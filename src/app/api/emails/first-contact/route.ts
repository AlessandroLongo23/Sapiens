import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils/escape';
import { fail, json, readJson } from '@/lib/server/http';
import { MAIL_FROM } from '@/lib/server/tutoring-mail';

const esc = escapeHtml;

const row = (label: string, value: string) => `<tr><td style="padding:10px 0;font-size:16px"><strong>${label}:</strong></td><td style="padding:10px 0;font-size:16px">${value}</td></tr>`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (v: unknown, max: number) => (typeof v === 'string' && v.trim().length > 0 && v.length <= max ? v.trim() : null);

/** A few sends per address per hour is plenty for a contact form; the counter lives for the life of the instance. */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();
function throttled(ip: string): boolean {
	const now = Date.now();
	const stamps = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
	if (stamps.length >= MAX_PER_WINDOW) return true;
	stamps.push(now);
	recent.set(ip, stamps);
	return false;
}

/**
 * The contact form, sent to the owner's inbox. Public by nature, so it is
 * strict about what it accepts: typed and bounded fields, an email address
 * that looks like one, a honeypot field that must stay empty, and a per-address
 * rate limit.
 */
export async function POST(request: Request) {
	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
	if (throttled(ip)) return fail('Troppe richieste. Riprova tra un’ora.', 429);

	const b = await readJson(request);
	// Bots fill every field; people never see this one.
	if (b.website) return json({ success: true });

	const firstName = text(b.firstName, 80);
	const lastName = text(b.lastName, 80) ?? '';
	const contact = text(b.contact, 120);
	const level = text(b.level, 80) ?? '';
	const frequency = text(b.frequency, 80) ?? '';
	const subjects = Array.isArray(b.subjects) ? b.subjects.filter((s): s is string => typeof s === 'string' && s.length <= 40).slice(0, 10) : [];
	if (!firstName) return fail('Inserisci il tuo nome.', 400);
	if (!contact || !EMAIL.test(contact)) return fail('Inserisci un indirizzo email valido.', 400);

	const subjectList = (subjects.includes('altro') ? [...subjects.filter((s) => s !== 'altro'), text(b.customSubject, 80) ?? ''] : subjects).filter(Boolean).join(', ');
	const html = `<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4">
	<table align="center" width="600" style="border-collapse:collapse;margin-top:20px;background:#fff;box-shadow:0 4px 8px rgba(0,0,0,.1)">
		<tr><td align="center" style="padding:40px 0 30px;background:#007bff;color:#fff"><h1 style="margin:0">Nuova Richiesta</h1></td></tr>
		<tr><td style="padding:40px 30px">
			<h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:10px">Dati del Richiedente</h2>
			<p style="font-size:16px;line-height:1.5"><strong>Nome:</strong> ${esc(firstName)} ${esc(lastName)}</p>
			<p style="font-size:16px;line-height:1.5"><strong>Email:</strong> <a href="mailto:${esc(contact)}" style="color:#007bff">${esc(contact)}</a></p>
			<h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:10px;margin-top:30px">Dettagli della Richiesta</h2>
			<table width="100%">${row('Livello', esc(level))}${row('Materie', esc(subjectList))}${row('Frequenza', esc(frequency))}</table>
		</td></tr>
		<tr><td align="center" style="padding:20px;background:#f4f4f4;color:#666;font-size:12px"><p style="margin:0">Email inviata dal sito Sapiens</p></td></tr>
	</table></body>`;

	const to = process.env.CONTACT_INBOX;
	if (!process.env.RESEND_API_KEY || !to) {
		console.error('first-contact: RESEND_API_KEY or CONTACT_INBOX is not set');
		return fail('Il modulo non è configurato. Scrivici via email.', 503);
	}
	const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: MAIL_FROM, to: [to], replyTo: contact, subject: `Nuova richiesta lezione da ${firstName} ${lastName}`.trim(), html });
	if (error) {
		console.error('first-contact send failed:', error);
		return fail('Invio non riuscito. Riprova tra qualche minuto.', 502);
	}
	return json({ success: true });
}
