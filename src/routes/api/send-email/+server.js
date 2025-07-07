import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST({ request }) {
	try {
		const formData = await request.json();

		const {
			level,
			subjects,
			customSubject,
			frequency,
			firstName,
			lastName,
			contact,
			contactType
		} = formData;

		const subjectList = subjects.includes('altro')
			? subjects.filter((s) => s !== 'altro').concat(customSubject).join(', ')
			: subjects.join(', ');

		const emailHtml = `
			<h1>Nuova richiesta di lezione</h1>
			<p><strong>Nome:</strong> ${firstName} ${lastName}</p>
			<p><strong>Contatto (${contactType}):</strong> ${contact}</p>
			<hr>
			<h3>Dettagli Richiesta:</h3>
			<p><strong>Livello:</strong> ${level}</p>
			<p><strong>Materie:</strong> ${subjectList}</p>
			<p><strong>Frequenza:</strong> ${frequency}</p>
        `;

		const { data, error } = await resend.emails.send({
			from: 'AleRipetizioni <onboarding@resend.dev>',
			to: ['longoa02@gmail.com'],
			subject: `Nuova Richiesta Lezione da ${firstName} ${lastName}`,
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