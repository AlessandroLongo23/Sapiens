<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';

	import Seo from '$lib/components/seo/Seo.svelte';

	const description =
		'Informativa sulla privacy di Sapiens: quali dati raccogliamo (account, pagamenti, richieste di contatto), come li usiamo, quali servizi li trattano e quali sono i tuoi diritti.';
</script>

<!--
	OWNER: this page lists only the processing the code actually performs. Before
	the site is promoted, complete it with: the data controller (name, address,
	contact email), retention periods, the legal basis for each processing and
	the date of the last revision. Then remove `noindex` from the <Seo> below.
-->
<Seo title="Privacy | {SITE_NAME}" {description} path="/privacy" noindex />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-zinc dark:prose-invert max-w-none">
	<h1>Informativa sulla privacy</h1>
	<p>
		Questa pagina descrive quali dati personali {SITE_NAME} raccoglie, perché e con quali servizi li tratta.
	</p>

	<h2>Consultare il materiale</h2>
	<p>
		Leggere teoria e formulari non richiede registrazione e non comporta la raccolta di dati personali. La preferenza
		tra tema chiaro e scuro è salvata solo nel tuo browser.
	</p>

	<h2>Account</h2>
	<p>
		Quando crei un account raccogliamo email e password. L'autenticazione e la conservazione dell'account sono affidate a
		Supabase. Questi dati servono a farti accedere ai servizi Premium e restano finché l'account esiste.
	</p>

	<h2>Pagamenti</h2>
	<p>
		I pagamenti degli abbonamenti sono gestiti da Stripe, che riceve i dati della carta direttamente. {SITE_NAME} non
		li vede e non li conserva; riceve da Stripe solo lo stato dell'abbonamento associato al tuo account.
	</p>

	<h2>Richieste di contatto</h2>
	<p>
		Il modulo della pagina <a href="/contacts">Contatti</a> invia nome, cognome, indirizzo email, livello, materie e
		frequenza richiesti a {SITE_NAME} tramite un servizio di posta (Resend). Usiamo questi dati solo per risponderti.
	</p>

	<h2>Assistente AI</h2>
	<p>
		Se usi la chat con Sapiens AI, i messaggi che scrivi vengono inviati a OpenAI per generare la risposta. Non
		inserire dati personali nei messaggi.
	</p>

	<h2>Statistiche di utilizzo</h2>
	<p>
		Il sito usa Vercel Web Analytics e Speed Insights, che misurano visite e prestazioni senza cookie e senza
		identificare i singoli visitatori.
	</p>

	<h2>I tuoi diritti</h2>
	<p>
		Puoi chiedere in qualsiasi momento l'accesso ai tuoi dati, la loro correzione o cancellazione e la chiusura
		dell'account scrivendo dalla pagina <a href="/contacts">Contatti</a>.
	</p>

	<h2>Modifiche</h2>
	<p>Questa informativa può essere aggiornata. Le modifiche valgono dalla pubblicazione su questa pagina.</p>
</div>
