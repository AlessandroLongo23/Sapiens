<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import { LEGAL, LEGAL_VERSIONS } from '$lib/config/legal';
	import { CONSENT_COOKIE } from '$lib/consent/consent.svelte';

	import Seo from '$lib/components/seo/Seo.svelte';
	import CookieManageLink from '$lib/components/consent/CookieManageLink.svelte';

	const description =
		'Cookie policy di Sapiens: quali cookie e quali strumenti di misurazione usa il sito, per quanto tempo, e come cambiare la tua scelta.';

	const cookies = [
		{
			name: 'sb-…-auth-token',
			category: 'Necessario',
			purpose: 'Sessione di accesso (Supabase). Presente solo dopo il login.',
			duration: 'Fino al logout, rinnovato mentre usi il sito'
		},
		{
			name: CONSENT_COOKIE,
			category: 'Necessario',
			purpose: 'Ricorda la tua scelta sui cookie, con data e versione di questa policy.',
			duration: '6 mesi'
		},
		{
			name: 'theme, theme-explicit (archiviazione locale)',
			category: 'Necessario',
			purpose: 'Tema chiaro o scuro scelto con il pulsante nell\'intestazione. Non è un cookie e non lascia mai il tuo browser.',
			duration: 'Finché non cancelli i dati del sito'
		}
	];
</script>

<Seo title="Cookie policy | {SITE_NAME}" {description} path="/cookie" />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-zinc dark:prose-invert max-w-none">
	<h1>Cookie policy</h1>
	<p><em>Versione {LEGAL_VERSIONS.cookies}.</em></p>
	<p>
		Questa pagina spiega quali cookie e quali strumenti di misurazione usa {SITE_NAME}, secondo le
		<a href="https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876" rel="noopener">Linee guida
		cookie e altri strumenti di tracciamento</a> del Garante per la protezione dei dati personali (10 giugno 2021).
	</p>

	<h2>Cosa sono i cookie</h2>
	<p>
		I cookie sono piccoli file che il sito salva nel tuo browser per ricordare qualcosa tra una pagina e l'altra: per
		esempio che hai fatto l'accesso. {SITE_NAME} usa solo cookie tecnici, indispensabili per far funzionare il sito, e
		non installa cookie di profilazione o pubblicitari.
	</p>

	<h2>Cookie e archiviazione usati dal sito</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Nome</th>
					<th>Categoria</th>
					<th>A cosa serve</th>
					<th>Durata</th>
				</tr>
			</thead>
			<tbody>
				{#each cookies as cookie (cookie.name)}
					<tr>
						<td><code>{cookie.name}</code></td>
						<td>{cookie.category}</td>
						<td>{cookie.purpose}</td>
						<td>{cookie.duration}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<h2>Statistiche di visita (solo con il tuo consenso)</h2>
	<p>
		Se accetti le statistiche, il sito carica Vercel Web Analytics e Vercel Speed Insights. Nessuno dei due usa
		cookie: contano le visite a ogni pagina e ne misurano la velocità con un identificatore che cambia ogni giorno,
		calcolato a partire da indirizzo IP e browser e non riconducibile alla persona. Finché non accetti, questi script
		non vengono nemmeno scaricati. Puoi negare o revocare il consenso in qualsiasi momento: il sito funziona allo
		stesso modo.
	</p>

	<h2>Servizi di terze parti</h2>
	<p>
		Il pagamento di un piano Premium avviene sulle pagine di Stripe, che usa i propri cookie tecnici e antifrode sul
		proprio dominio, secondo la <a href="https://stripe.com/legal/cookies-policy" rel="noopener">cookie policy di
		Stripe</a>. Su {SITE_NAME} non è presente alcun cookie di Stripe.
	</p>

	<h2>Come cambiare la tua scelta</h2>
	<p>
		Puoi riaprire il pannello delle preferenze quando vuoi, da qui o dal link "Gestisci cookie" in fondo a ogni
		pagina. La scelta viene chiesta di nuovo dopo sei mesi, oppure prima se questa policy cambia.
	</p>
	<p>
		<CookieManageLink class="not-prose inline-flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-500/25 px-4 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500" />
	</p>
	<p>
		Puoi anche bloccare o cancellare i cookie dalle impostazioni del browser; in quel caso l'accesso all'account
		potrebbe non funzionare.
	</p>

	<h2>Riferimenti e contatti</h2>
	<p>
		Il trattamento dei dati personali è descritto nell'<a href="/privacy">informativa sulla privacy</a>. Per domande
		{#if LEGAL.privacyEmail}
			scrivi a <a href="mailto:{LEGAL.privacyEmail}">{LEGAL.privacyEmail}</a>
		{:else}
			usa la pagina <a href="/contacts">Contatti</a>
		{/if}.
	</p>
</div>
