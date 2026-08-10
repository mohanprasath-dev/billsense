import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, message } = body;

		if (!email || !message) {
			return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
		}

		const resendApiKey = process.env.RESEND_API_KEY;
		const submitterName = name ? name.trim() : 'Anonymous User';

		// 1. Send Notification Email via Resend if API key is present
		if (resendApiKey) {
			try {
				const resend = new Resend(resendApiKey);

				// Notification to team
				await resend.emails.send({
					from: 'BillSense Feedback <onboarding@resend.dev>',
					to: ['info.taskdrift@gmail.com', 'mohanprasath210607@gmail.com'],
					subject: 'New BillSense Feedback',
					html: `
						<h2>New BillSense Feedback Submission</h2>
						<p><strong>Name:</strong> ${submitterName}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Message:</strong></p>
						<blockquote style="background:#f8fafc;padding:12px;border-left:4px solid #0d9488;">
							${message.replace(/\n/g, '<br/>')}
						</blockquote>
						<p style="font-size:12px;color:#64748b;">Submitted at ${new Date().toISOString()}</p>
					`,
				});

				// Auto-reply to submitter
				await resend.emails.send({
					from: 'BillSense Team <onboarding@resend.dev>',
					to: [email],
					subject: 'Thanks for your feedback on BillSense',
					html: `
						<p>Hi ${submitterName},</p>
						<p>Thanks for your feedback on BillSense! We've received your message and our team will review it shortly.</p>
						<p>Best regards,<br/>The TaskDrift / BillSense Team</p>
					`,
				});
			} catch (emailErr) {
				console.warn('Resend email notification warning:', emailErr);
			}
		}

		// 2. Google Sheets append via Service Account (if configured)
		const googleEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
		const googleKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

		if (googleEmail && googleKey) {
			try {
				const { google } = await import('googleapis');
				const auth = new google.auth.JWT({
					email: googleEmail,
					key: googleKey.replace(/\\n/g, '\n'),
					scopes: ['https://www.googleapis.com/auth/spreadsheets'],
				});
				const sheets = google.sheets({ version: 'v4', auth });

				await sheets.spreadsheets.values.append({
					spreadsheetId: '1WzOJrhMehkjMkzD5NUFOpvG2UNWGxCxS8jEIU6XuDt8',
					range: 'Sheet1!A:D',
					valueInputOption: 'USER_ENTERED',
					requestBody: {
						values: [[new Date().toISOString(), submitterName, email, message]],
					},
				});
			} catch (sheetsErr) {
				console.warn('Google Sheets append warning:', sheetsErr);
			}
		}

		return NextResponse.json({ success: true, message: 'Feedback submitted successfully' });
	} catch (err) {
		console.error('Feedback API error:', err);
		return NextResponse.json({ success: true, message: 'Feedback received' });
	}
}
