import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST({ request }) {
	try {
		const formData = await request.json();

		const {
			student_id,
            first_name,
            last_name,
			date,
			start_time,
			end_time,
		} = formData;

		const emailHtml = `
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
			<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
				<tr>
					<td align="center" style="padding: 40px 0 30px 0; background-color: #007bff; color: #ffffff;">
						<h1 style="margin: 0;">Nuova Proposta di Lezione</h1>
					</td>
				</tr>
				<tr>
					<td style="padding: 40px 30px;">
						<h2 style="color: #333333; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Dati del Richiedente</h2>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Nome:</strong> ${first_name} ${last_name}</p>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Data:</strong> ${date}</p>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Inizio:</strong> ${start_time}</p>
						<p style="font-size: 16px; line-height: 1.5;"><strong>Fine:</strong> ${end_time}</p>
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
			subject: `Nuova Proposta di Lezione da ${first_name} ${last_name}`,
			html: emailHtml
		});

		if (error) {
			console.error({ error });
			return json({ error: 'Error sending email' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error processing request:', error);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
} 