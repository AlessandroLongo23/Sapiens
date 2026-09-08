import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { LEGAL, LEGAL_VERSIONS } from '@/lib/config/legal';
import { CONSENT_COOKIE } from '@/lib/consent/consent';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { Prose } from '@/components/content/Prose';
import { CookieManageLink } from '@/components/shell/CookieBanner';
import { buttonClass } from '@/components/ui/Button';

export const metadata: Metadata = pageMetadata({
	title: `Cookie policy | ${SITE_NAME}`,
	description: 'Cookie policy di Sapiens: quali cookie e quali strumenti di misurazione usa il sito, per quanto tempo, e come cambiare la tua scelta.',
	path: '/cookie'
});

const COOKIES = [
	{ name: 'sb-…-auth-token', category: 'Necessario', purpose: 'Sessione di accesso (Supabase). Presente solo dopo il login.', duration: 'Fino al logout, rinnovato mentre usi il sito' },
	{ name: CONSENT_COOKIE, category: 'Necessario', purpose: 'Ricorda la tua scelta sui cookie, con data e versione di questa policy.', duration: '6 mesi' },
	{ name: 'theme, theme-explicit (archiviazione locale)', category: 'Necessario', purpose: "Tema chiaro o scuro scelto con il pulsante nell'intestazione. Non è un cookie e non lascia mai il tuo browser.", duration: 'Finché non cancelli i dati del sito' }
];

export default function CookiePage() {
	return (
		<Prose>
			<h1>Cookie policy</h1>
			<p><em>Versione {LEGAL_VERSIONS.cookies}.</em></p>
			<p>
				Questa pagina spiega quali cookie e quali strumenti di misurazione usa {SITE_NAME}, secondo le{' '}
				<a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876" rel="noopener">Linee guida cookie e altri strumenti di tracciamento</a> del Garante per la protezione dei dati personali (10 giugno 2021).
			</p>
			<h2>Cosa sono i cookie</h2>
			<p>
				I cookie sono piccoli file che il sito salva nel tuo browser per ricordare qualcosa tra una pagina e l&apos;altra: per esempio che hai fatto l&apos;accesso. {SITE_NAME} usa solo cookie tecnici, indispensabili per far funzionare il sito, e non installa cookie di profilazione o pubblicitari.
			</p>
			<h2>Cookie e archiviazione usati dal sito</h2>
			<div className="overflow-x-auto">
				<table>
					<thead>
						<tr><th>Nome</th><th>Categoria</th><th>A cosa serve</th><th>Durata</th></tr>
					</thead>
					<tbody>
						{COOKIES.map((c) => (
							<tr key={c.name}><td><code>{c.name}</code></td><td>{c.category}</td><td>{c.purpose}</td><td>{c.duration}</td></tr>
						))}
					</tbody>
				</table>
			</div>
			<h2>Statistiche di visita (solo con il tuo consenso)</h2>
			<p>
				Se accetti le statistiche, il sito carica Vercel Web Analytics e Vercel Speed Insights. Nessuno dei due usa cookie: contano le visite a ogni pagina e ne misurano la velocità con un identificatore che cambia ogni giorno, calcolato a partire da indirizzo IP e browser e non riconducibile alla persona. Finché non accetti, questi script non vengono nemmeno scaricati. Puoi negare o revocare il consenso in qualsiasi momento: il sito funziona allo stesso modo.
			</p>
			<h2>Servizi di terze parti</h2>
			<p>
				Il pagamento di un piano Premium avviene sulle pagine di Stripe, che usa i propri cookie tecnici e antifrode sul proprio dominio, secondo la <a href="https://stripe.com/legal/cookies-policy" rel="noopener">cookie policy di Stripe</a>. Su {SITE_NAME} non è presente alcun cookie di Stripe.
			</p>
			<h2>Come cambiare la tua scelta</h2>
			<p>Puoi riaprire il pannello delle preferenze quando vuoi, da qui o dal link &quot;Gestisci cookie&quot; in fondo a ogni pagina. La scelta viene chiesta di nuovo dopo sei mesi, oppure prima se questa policy cambia.</p>
			<p>
				<CookieManageLink className={buttonClass('secondary', 'sm', 'not-prose')} />
			</p>
			<p>Puoi anche bloccare o cancellare i cookie dalle impostazioni del browser; in quel caso l&apos;accesso all&apos;account potrebbe non funzionare.</p>
			<h2>Riferimenti e contatti</h2>
			<p>
				Il trattamento dei dati personali è descritto nell&apos;<a href="/privacy">informativa sulla privacy</a>. Per domande {LEGAL.privacyEmail ? <>scrivi a <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a></> : <>usa la pagina <a href="/contacts">Contatti</a></>}.
			</p>
		</Prose>
	);
}
