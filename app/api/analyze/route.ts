import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { fuzzyMatchTest, computePriceFlag, MedicalTest } from '@/lib/fuzzy-match';
import testsData from '@/data/tests.json';

const tests = testsData.tests as MedicalTest[];

// Server-side Supabase client — uses service role for storage writes
const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	// Fallback to anon key if service role not configured (demo mode)
	process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GeminiLineItem {
	raw_text: string;
	guessed_test_name: string;
	billed_price?: number | null;
}

interface GeminiResponse {
	error?: boolean;
	items?: GeminiLineItem[];
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File | null;

		if (!file) {
			return NextResponse.json({ error: 'No image provided' }, { status: 400 });
		}

		// Convert file to bytes
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const mimeType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/heic';

		// Step 1: Upload to Supabase Storage
		let publicUrl: string | null = null;
		try {
			const fileName = `bill-${Date.now()}-${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
			const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
				.from('bill-uploads')
				.upload(fileName, buffer, {
					contentType: mimeType,
					upsert: false,
				});

			if (!uploadError && uploadData) {
				const { data: urlData } = supabaseAdmin.storage
					.from('bill-uploads')
					.getPublicUrl(uploadData.path);
				publicUrl = urlData.publicUrl;
			}
		} catch (_storageError) {
			// Storage upload is non-critical for demo — continue without it
			console.warn('Storage upload skipped:', _storageError);
		}

		// Step 2: Call Gemini 2.5 Flash with the image
		const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

		const systemPrompt = `You are extracting line items from an Indian medical bill or prescription photo.
Return ONLY valid JSON, no markdown fences, no preamble, no explanation.
For each distinct test, procedure, consultation, or medication line you can identify in the image, return an object in this exact format:
{
  "items": [
    {
      "raw_text": "the exact text as it appears on the bill",
      "guessed_test_name": "your best guess at the standardized medical test or procedure name in English",
      "billed_price": <number in INR, or null if no price is visible for this line>
    }
  ]
}
If the image is completely unreadable, not a medical document, or you cannot extract any line items, return: {"error": true}
Rules:
- Include ALL line items you see, even if partially readable
- billed_price should be a number (e.g. 500) or null — never a string
- guessed_test_name should be in English even if the bill is in another language
- Do not include general charges like "room charges" or "pharmacy" unless they are specific procedures`;

		const imagePart = {
			inlineData: {
				data: buffer.toString('base64'),
				mimeType,
			},
		};

		let geminiResult: GeminiResponse = { items: [] };

		try {
			const result = await model.generateContent([systemPrompt, imagePart]);
			const responseText = result.response.text().trim();

			// Strip markdown fences if Gemini adds them anyway
			const cleaned = responseText
				.replace(/^```(?:json)?\s*/i, '')
				.replace(/\s*```$/, '')
				.trim();

			geminiResult = JSON.parse(cleaned) as GeminiResponse;
		} catch (geminiError) {
			console.error('Gemini error:', geminiError);
			return NextResponse.json(
				{ error: 'Failed to analyse image. Please try a clearer photo.' },
				{ status: 422 }
			);
		}

		if (geminiResult.error) {
			return NextResponse.json(
				{ error: 'The image does not appear to be a medical bill or is unreadable.' },
				{ status: 422 }
			);
		}

		const items = geminiResult.items ?? [];

		// Step 3: Match each item against our test database
		const matched: Array<{
			test: MedicalTest;
			raw_text: string;
			billed_price: number | null;
			flag: 'high' | 'fair' | 'no_data';
		}> = [];

		const unmatched: string[] = [];

		for (const item of items) {
			const matchedTest = fuzzyMatchTest(item.guessed_test_name, tests);

			if (matchedTest) {
				const billedPrice = typeof item.billed_price === 'number' ? item.billed_price : null;
				const flag = computePriceFlag(billedPrice, matchedTest.cghs_price_inr);

				// Avoid duplicate matches
				if (!matched.find((m) => m.test.id === matchedTest.id)) {
					matched.push({
						test: matchedTest,
						raw_text: item.raw_text,
						billed_price: billedPrice,
						flag,
					});
				}
			} else {
				unmatched.push(item.raw_text);
			}
		}

		// Step 4 (optional): Log scan to bill_scans table for demo analytics
		// Non-blocking — if table doesn't exist yet, scan still works
		try {
			const language = request.headers.get('x-language') ?? 'en';
			await supabaseAdmin.from('bill_scans').insert({
				image_url: publicUrl,
				matched_count: matched.length,
				high_count: matched.filter((m) => m.flag === 'high').length,
				fair_count: matched.filter((m) => m.flag === 'fair').length,
				no_data_count: matched.filter((m) => m.flag === 'no_data').length,
				language,
			});
		} catch {
			// Silently skip — table may not exist in minimal setup
		}

		return NextResponse.json({
			matched,
			unmatched,
			image_url: publicUrl,
		});
	} catch (err) {
		console.error('Analyze route error:', err);
		return NextResponse.json(
			{ error: 'Something went wrong. Please try again.' },
			{ status: 500 }
		);
	}
}
