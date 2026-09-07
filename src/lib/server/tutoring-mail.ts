import { env } from '$env/dynamic/private';
import { Resend } from 'resend';
import { levelName, modeName, subjectName } from '$lib/tutoring/config';
import type { RequestRow } from './tutoring-admin';

/**
 * Notifications of the marketplace. All best effort: a failed email never
 * fails the action that triggered it. Contact details travel only in the
 * acceptance emails, in both directions.
 */

const FROM = 'Sapiens <onboarding@resend.dev>';

function esc(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function layout(title: string, body: string): string {
	return `
		<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b">
			<h1 style="font-size:20px;margin:0 0 12px">${esc(title)}</h1>
			${body}
			<p style="margin:24px 0 0;color:#71717a;font-size:13px">Sapiens non trattiene nulla sulle lezioni: orari e prezzo li concordate tra voi.</p>
		</div>`;
}

function rows(pairs: [string, string][]): string {
	return `<table style="border-collapse:collapse;margin:0 0 16px">${pairs
		.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#71717a">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`)
		.join('')}</table>`;
}

function summary(req: Pick<RequestRow, 'subject' | 'level' | 'mode'>): [string, string][] {
	return [
		['Materia', subjectName(req.subject)],
		['Livello', levelName(req.level)],
		['Modalità', modeName(req.mode)]
	];
}

async function send(to: string | null | undefined, subject: string, html: string): Promise<void> {
	if (!to || !env.RESEND_API_KEY) return;
	try {
		const resend = new Resend(env.RESEND_API_KEY);
		await resend.emails.send({
			from: FROM,
			to: [to],
			...(env.TUTORING_NOTIFY_EMAIL ? { bcc: [env.TUTORING_NOTIFY_EMAIL] } : {}),
			subject,
			html
		});
	} catch (err) {
		console.error('tutoring email failed:', err);
	}
}

/** To the tutor: the message, never the contacts. */
export function mailRequestReceived(to: string | null, tutorFirstName: string, req: RequestRow, origin: string): Promise<void> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">Uno ${req.requester === 'parent' ? 'genitore' : 'studente'} ti ha scritto da Sapiens. Hai 48 ore per accettare: i contatti ti arrivano solo se accetti.</p>
		${rows(summary(req))}
		<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #e11d48;background:#fafafa;white-space:pre-wrap">${esc(req.message)}</blockquote>
		<p style="margin:0"><a href="${esc(origin)}/leads" style="color:#e11d48">Rispondi dalla tua area tutor</a></p>`;
	return send(to, `Nuova richiesta di ripetizioni su Sapiens: ${subjectName(req.subject)}`, layout(`Ciao ${tutorFirstName}, hai una nuova richiesta`, body));
}

export interface TutorContact {
	first_name: string;
	last_name: string;
	contact_phone: string | null;
	contact_email: string | null;
}

/** To the student (or parent): the tutor's contacts. */
export function mailRequestAcceptedToStudent(to: string | null, tutor: TutorContact, req: RequestRow, origin: string): Promise<void> {
	const name = `${tutor.first_name} ${tutor.last_name}`;
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">${esc(tutor.first_name)} ha accettato la tua richiesta. Ecco come contattarl${'o'}:</p>
		${rows([
			['Nome', name],
			...(tutor.contact_phone ? [['Telefono', tutor.contact_phone] as [string, string]] : []),
			...(tutor.contact_email ? [['Email', tutor.contact_email] as [string, string]] : []),
			...summary(req)
		])}
		<p style="margin:0">Trovi tutto anche in <a href="${esc(origin)}/richieste" style="color:#e11d48">Le tue richieste</a>.</p>`;
	return send(to, `${tutor.first_name} ha accettato la tua richiesta di ripetizioni`, layout(`Richiesta accettata da ${tutor.first_name}`, body));
}

/** To the tutor: the student's contacts. */
export function mailRequestAcceptedToTutor(to: string | null, tutorFirstName: string, req: RequestRow, origin: string): Promise<void> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">Hai accettato la richiesta: ora puoi contattare direttamente ${req.requester === 'parent' ? 'il genitore' : 'lo studente'}.</p>
		${rows([
			['Nome', req.contact_name],
			['Telefono', req.contact_phone],
			...(req.contact_email ? [['Email', req.contact_email] as [string, string]] : []),
			...summary(req)
		])}
		<blockquote style="margin:0 0 20px;padding:12px 16px;border-left:3px solid #e11d48;background:#fafafa;white-space:pre-wrap">${esc(req.message)}</blockquote>
		<p style="margin:0">Trovi i contatti anche nella tua <a href="${esc(origin)}/leads" style="color:#e11d48">area tutor</a>.</p>`;
	return send(to, `Contatti dello studente per ${subjectName(req.subject)}`, layout(`Ciao ${tutorFirstName}, ecco i contatti`, body));
}

/** To the student: the tutor said no, without a reason. */
export function mailRequestDeclined(to: string | null, tutorFirstName: string, req: RequestRow, origin: string): Promise<void> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">${esc(tutorFirstName)} non può accettare la tua richiesta di ${esc(subjectName(req.subject))} in questo momento. Succede: capacità piena, orari che non combaciano.</p>
		<p style="margin:0"><a href="${esc(origin)}/ripetizioni?materia=${encodeURIComponent(req.subject)}&livello=${encodeURIComponent(req.level)}" style="color:#e11d48">Trova un altro tutor</a></p>`;
	return send(to, `La richiesta a ${tutorFirstName} non è andata a buon fine`, layout('Richiesta non accettata', body));
}
