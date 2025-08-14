import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST({ request }) {
	try {
		const reviewData = await request.json();

		const {
			student_id,
            student_name,
			rating,
			review,
			isEdit
		} = reviewData;

		// Format the star rating visually
		const starRating = '★'.repeat(rating) + '☆'.repeat(5 - rating);

		const emailHtml = `
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
			<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
				<tr>
					<td align="center" style="padding: 40px 0 30px 0; background-color: #8b5cf6; color: #ffffff;">
						<h1 style="margin: 0;">${isEdit ? 'Recensione Aggiornata' : 'Nuova Recensione'}</h1>
					</td>
				</tr>
				<tr>
					<td style="padding: 40px 30px;">
						<h2 style="color: #333333; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Dettagli della Recensione</h2>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Studente:</strong> ${student_name}</p>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Valutazione:</strong> <span style="color: #fbbf24; font-size: 24px;">${starRating}</span> (${rating}/5)</p>
						
						<h2 style="color: #333333; border-bottom: 2px solid #eeeeee; padding-bottom: 10px; margin-top: 30px;">Recensione</h2>
						<div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8b5cf6; margin: 15px 0;">
							<p style="font-size: 16px; line-height: 1.6; font-style: italic; color: #444444; margin: 0;">
								"${review}"
							</p>
						</div>
					</td>
				</tr>
				<tr>
					<td align="center" style="padding: 20px; background-color: #f4f4f4; color: #666666; font-size: 12px;">
						<p style="margin: 0;">Email inviata dal sito AleRipetizioni</p>
					</td>
				</tr>
			</table>
		</body>
        `;

		const { data, error } = await resend.emails.send({
			from: 'AleRipetizioni <onboarding@resend.dev>',
			to: ['longoa02@gmail.com'],
			subject: `${isEdit ? 'Recensione Aggiornata' : 'Nuova Recensione'} da ${student_name}`,
			html: emailHtml
		});

		if (error) {
			console.error({ error });
			return json({ error: 'Error sending email' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error processing review email:', error);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
}
