import { env } from '$env/dynamic/private';
import { createClient } from '$lib/supabase';
import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const SECRET_KEY = env.JWT_SECRET || 'aleripetizioni-lecture-actions-secret';

function generateActionToken(lectureId, action) {
	return jwt.sign(
		{ 
			lectureId, 
			action, 
			exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
		},
		SECRET_KEY
	);
}

export async function POST({ request, url, cookies }) {
	try {
		const supabase = createClient(cookies);
		
		const formData = await request.json();

		const {
			student_id,
            first_name,
            last_name,
			date,
			start_time,
			end_time,
			subject_id,
		} = formData;
		
		const { data: lectureData } = await supabase
			.from('lectures')
			.select('id, subject_id')
			.eq('student_id', student_id)
			.eq('date', date)
			.or(`start_time.eq.${start_time},end_time.eq.${end_time}`)
			.eq('status', 'pending')
			.order('created_at', { ascending: false })
			.limit(1);
			
		if (!lectureData || lectureData.length === 0) {
			const { data: fallbackData } = await supabase
				.from('lectures')
				.select('id, subject_id')
				.eq('student_id', student_id)
				.eq('date', date)
				.eq('status', 'pending')
				.order('created_at', { ascending: false })
				.limit(1);
				
			if (!fallbackData || fallbackData.length === 0) {
				const dummyLecture = {
					id: 'not-found',
					subject_id: subject_id || null
				};
				
				const { data, error } = await resend.emails.send({
					from: 'AleRipetizioni <onboarding@resend.dev>',
					to: ['longoa02@gmail.com'],
					subject: `Nuova Proposta di Lezione da ${first_name} ${last_name}`,
					html: `
					<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
							<tr>
								<td align="center" style="padding: 30px 0 20px 0; background-color: #007bff; color: #ffffff;">
									<h1 style="margin: 0;">Nuova Proposta di Lezione</h1>
								</td>
							</tr>
							<tr>
								<td style="padding: 30px 30px 20px 30px;">
									<h2 style="color: #333333; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Dati della Richiesta</h2>
									<table border="0" cellpadding="0" cellspacing="0" width="100%">
										<tr>
											<td style="padding: 10px 0;"><strong>Studente:</strong></td>
											<td style="padding: 10px 0;">${first_name} ${last_name}</td>
										</tr>
										<tr>
											<td style="padding: 10px 0;"><strong>Data:</strong></td>
											<td style="padding: 10px 0;">${date}</td>
										</tr>
										<tr>
											<td style="padding: 10px 0;"><strong>Orario:</strong></td>
											<td style="padding: 10px 0;">${start_time} - ${end_time}</td>
										</tr>
										<tr>
											<td style="padding: 10px 0;"><strong>Nota:</strong></td>
											<td style="padding: 10px 0;"><em>La lezione è stata salvata ma c'è stato un problema nel generare i link per accettarla. Per favore, accedi al pannello di amministrazione per gestire questa richiesta.</em></td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td align="center" style="padding: 20px; background-color: #f4f4f4; color: #666666; font-size: 12px;">
									<p style="margin: 0;">Email inviata dal sito AleRipetizioni</p>
								</td>
							</tr>
						</table>
					</body>
					`
				});
				
				if (error) {
					return json({ error: `Error sending email: ${error.message}` }, { status: 500 });
				}
				
				return json({ success: true, note: 'Email sent without action links' });
			}
			
			lectureData = fallbackData;
		}
		
		const lectureId = lectureData[0].id;
		
		const { data: subjectData } = await supabase
			.from('subjects')
			.select('name')
			.eq('id', subject_id || lectureData[0].subject_id)
			.single();
			
		const subjectName = subjectData?.name || 'Non specificata';
		
		const acceptToken = generateActionToken(lectureId, 'accept');
		const refuseToken = generateActionToken(lectureId, 'refuse');
		
		const baseUrl = "https://ale-ripetizioni.vercel.app";
		const acceptUrl = `${baseUrl}/api/lectures/accept?token=${acceptToken}&id=${lectureId}`;
		const refuseUrl = `${baseUrl}/api/lectures/refuse?token=${refuseToken}&id=${lectureId}`;

		const emailHtml = `
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
			<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin-top: 20px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
				<tr>
					<td align="center" style="padding: 30px 0 20px 0; background-color: #007bff; color: #ffffff;">
						<h1 style="margin: 0;">Nuova Proposta di Lezione</h1>
					</td>
				</tr>
				<tr>
					<td style="padding: 30px 30px 20px 30px;">
						<h2 style="color: #333333; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Dati della Richiesta</h2>
						<table border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td style="padding: 10px 0;"><strong>Studente:</strong></td>
								<td style="padding: 10px 0;">${first_name} ${last_name}</td>
							</tr>
							<tr>
								<td style="padding: 10px 0;"><strong>Data:</strong></td>
								<td style="padding: 10px 0;">${date}</td>
							</tr>
							<tr>
								<td style="padding: 10px 0;"><strong>Orario:</strong></td>
								<td style="padding: 10px 0;">${start_time} - ${end_time}</td>
							</tr>
							<tr>
								<td style="padding: 10px 0;"><strong>Materia:</strong></td>
								<td style="padding: 10px 0;">${subjectName}</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="padding: 0 30px 30px 30px;">
						<table border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td align="center" style="padding: 20px 0;">
									<table border="0" cellpadding="0" cellspacing="0">
										<tr>
											<td style="padding-right: 10px;">
												<a href="${acceptUrl}" style="background-color: #4CAF50; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">ACCETTA</a>
											</td>
											<td style="padding-left: 10px;">
												<a href="${refuseUrl}" style="background-color: #F44336; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">RIFIUTA</a>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
						<p style="color: #666; font-size: 14px; margin-top: 20px;">
							Puoi accettare o rifiutare questa richiesta direttamente cliccando sui pulsanti qui sopra, oppure accedere al pannello di amministrazione per gestire tutte le richieste.
						</p>
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

		if (!resend) {
			return json({ 
				error: 'Email service is not configured. Please add RESEND_API_KEY to your environment variables.', 
				lectureData: { 
					student: `${first_name} ${last_name}`,
					date,
					start_time,
					end_time,
					subject: subjectName
				} 
			}, { status: 500 });
		}
		
		try {
			const { data, error } = await resend.emails.send({
				from: 'AleRipetizioni <onboarding@resend.dev>',
				to: ['longoa02@gmail.com'],
				subject: `Nuova Proposta di Lezione da ${first_name} ${last_name}`,
				html: emailHtml
			});

			if (error) {
				console.error('Resend API Error:', error);
				return json({ error: `Error sending email: ${error.message}` }, { status: 500 });
			}
		} catch (emailError) {
			console.error('Exception during email sending:', emailError);
			return json({ 
				error: `Email sending exception: ${emailError.message}`,
				tip: 'Check that your RESEND_API_KEY is valid and correctly set in your environment variables.'
			}, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error processing request:', error);
		return json({ error: 'Invalid request' }, { status: 400 });
	}
} 