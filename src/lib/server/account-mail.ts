import 'server-only';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils/escape';
import { EMAIL_CODE, PARENT_LINK_DAYS } from '@/lib/onboarding/config';
import { MAIL_FROM } from './tutoring-mail';

/**
 * The emails of the account: the code that confirms an address and the link for the parent of a student under 14.
 * Unlike the marketplace notices these must arrive, so a rejected send is reported to the caller. Without a
 * RESEND_API_KEY (local development) the message is written to the server log instead.
 */

const esc = escapeHtml;

function layout(title: string, body: string): string {
	return `
		<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b">
			<h1 style="font-size:20px;margin:0 0 12px">${esc(title)}</h1>
			${body}
		</div>`;
}

async function send(to: string, subject: string, html: string, plain: string): Promise<boolean> {
	if (!process.env.RESEND_API_KEY) {
		if (process.env.NODE_ENV !== 'production') console.info(`[mail to ${to}] ${subject}\n${plain}`);
		return process.env.NODE_ENV !== 'production';
	}
	try {
		const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: MAIL_FROM, to: [to], subject, html, text: plain });
		if (error) console.error('account email rejected:', error);
		return !error;
	} catch (err) {
		console.error('account email failed:', err);
		return false;
	}
}

export function mailEmailCode(to: string, code: string): Promise<boolean> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">Scrivi questo codice in Sapiens per confermare il tuo indirizzo email. Vale ${EMAIL_CODE.minutes} minuti.</p>
		<p style="margin:0 0 16px;font-size:32px;font-weight:700;letter-spacing:6px">${esc(code)}</p>
		<p style="margin:0;color:#71717a;font-size:13px">Se non ti sei iscritto a Sapiens, ignora questa email: senza il codice l'indirizzo non viene confermato.</p>`;
	return send(to, `${code} è il tuo codice di Sapiens`, layout('Conferma la tua email', body), `Il tuo codice di Sapiens: ${code} (vale ${EMAIL_CODE.minutes} minuti).`);
}

/** To the parent: who asked, what confirming means, and the link. The child's surname and email stay out. */
export function mailParentConsent(to: string, studentFirstName: string, link: string): Promise<boolean> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">${esc(studentFirstName)} vuole usare Sapiens, una piattaforma per studiare matematica e le altre materie scientifiche, e ha indicato questo indirizzo come quello di un genitore.</p>
		<p style="margin:0 0 16px;color:#3f3f46">Chi ha meno di 14 anni può avere un account solo con il consenso di un genitore o di chi ne fa le veci. Se sei d'accordo, apri la pagina qui sotto e conferma: non devi creare un account né scegliere una password.</p>
		<p style="margin:0 0 20px"><a href="${esc(link)}" style="display:inline-block;padding:12px 20px;border-radius:12px;background:#e11d48;color:#ffffff;text-decoration:none;font-weight:600">Leggi e conferma</a></p>
		<p style="margin:0;color:#71717a;font-size:13px">Il link vale ${PARENT_LINK_DAYS} giorni. Se non conosci ${esc(studentFirstName)} o non sei d'accordo, non fare niente: l'account non viene attivato e i dati vengono cancellati.</p>`;
	return send(to, `${studentFirstName} chiede il tuo consenso per usare Sapiens`, layout('Serve il tuo consenso', body), `${studentFirstName} chiede il tuo consenso per usare Sapiens. Apri: ${link}`);
}

/** To the student, once the parent has confirmed. */
export function mailParentConfirmed(to: string, firstName: string, origin: string): Promise<boolean> {
	const body = `
		<p style="margin:0 0 16px;color:#3f3f46">Il tuo genitore ha confermato: il tuo account è attivo. Entra con l'email e la password che hai scelto.</p>
		<p style="margin:0"><a href="${esc(origin)}/" style="color:#e11d48">Apri Sapiens</a></p>`;
	return send(to, 'Il tuo account Sapiens è attivo', layout(`Ciao ${firstName}, puoi entrare`, body), `Il tuo account Sapiens è attivo: ${origin}/`);
}
