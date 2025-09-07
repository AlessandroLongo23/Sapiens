import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

// Check if the API key exists and log its presence (not the actual key)
console.log('RESEND_API_KEY exists in test endpoint:', !!env.RESEND_API_KEY);

// Initialize Resend with better error handling
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function GET() {
	try {
		console.log('Testing email with Resend API, key:', env.RESEND_API_KEY ? 'Present' : 'Missing');

		// Check if resend client is available
		if (!resend) {
			console.error('ERROR: Cannot send test email - Resend API client is not initialized');
			return json({ 
				success: false,
				error: 'Email service is not configured. Please add RESEND_API_KEY to your environment variables.'
			}, { status: 500 });
		}

		const emailHtml = `
		<body style="font-family: Arial, sans-serif; padding: 20px;">
			<h1>Test Email</h1>
			<p>This is a test email from AleRipetizioni.</p>
			<p>If you're seeing this, the email system is working correctly.</p>
			<hr>
			<p>Generated at: ${new Date().toISOString()}</p>
		</body>`;

		try {
			const { data, error } = await resend.emails.send({
				from: 'AleRipetizioni <onboarding@resend.dev>',
				to: ['longoa02@gmail.com'],
				subject: 'Test Email from AleRipetizioni',
				html: emailHtml
			});

			if (error) {
				console.error('Resend API Error:', error);
				return json({ 
					success: false, 
					error: error.message,
					details: error
				}, { status: 500 });
			}
			
			console.log('Test email sent successfully:', data);
			return json({ 
				success: true, 
				messageId: data?.id,
				details: data
			});
			
		} catch (emailError) {
			console.error('Exception during test email sending:', emailError);
			return json({ 
				success: false, 
				error: emailError.message, 
				stack: emailError.stack
			}, { status: 500 });
		}
	} catch (error) {
		console.error('Error in test email route:', error);
		return json({ 
			success: false, 
			error: error.message,
			stack: error.stack
		}, { status: 500 });
	}
}
