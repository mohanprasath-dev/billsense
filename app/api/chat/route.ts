import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { message, lastAnalysisResult } = body;

		if (!message) {
			return NextResponse.json({ error: 'Message is required' }, { status: 400 });
		}

		if (!GEMINI_API_KEY) {
			return NextResponse.json({
				reply: 'BillSense Assistant is currently running in offline preview mode. BillSense explains Indian medical bill items and compares them with CGHS reference rates.',
			});
		}

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		// Try latest gemini-3.6-flash model with fallback to 2.5-flash
		let model;
		try {
			model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
		} catch {
			model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
		}

		let contextPrompt = `
You are the official BillSense AI Assistant — a helpful, patient-friendly AI for an Indian healthcare transparency tool.
Your goal is to answer questions about medical bill line items, diagnostic test descriptions, and CGHS (Central Government Health Scheme) price benchmarks.

CRITICAL RULES:
1. NEVER provide medical diagnosis, treatment recommendations, or clinical advice.
2. NEVER claim a medical test ordered by a doctor was "unnecessary".
3. Always keep explanations plain-language, empathetic, and jargon-free.
4. Keep responses concise (2-4 sentences max per response).
5. Do NOT use em-dashes (—); use colons or vertical pipes instead.
`;

		if (lastAnalysisResult && lastAnalysisResult.matched) {
			contextPrompt += `
The user has scanned a medical bill with the following matched results:
${JSON.stringify(lastAnalysisResult.matched, null, 2)}
`;
		}

		const fullPrompt = `${contextPrompt}\n\nUser Question: ${message}\n\nAssistant Response:`;

		const result = await model.generateContent(fullPrompt);
		const text = result.response.text();

		return NextResponse.json({ reply: text });
	} catch (err: any) {
		console.error('Chat API error:', err);
		return NextResponse.json({
			reply: 'BillSense provides plain-language explanations of medical tests and CGHS price benchmarks. Always consult your doctor for medical advice.',
		});
	}
}
