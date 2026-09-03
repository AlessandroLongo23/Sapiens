<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import { SUBSCRIPTION_PLANS, formatPrice } from '$lib/stripe/config';

	import Seo from '$lib/components/seo/Seo.svelte';

	const description =
		"Termini e condizioni d'uso di Sapiens: accesso al materiale didattico, account, abbonamenti Premium, pagamenti e disdetta.";
	const plans = [SUBSCRIPTION_PLANS.LITE, SUBSCRIPTION_PLANS.BASE, SUBSCRIPTION_PLANS.PRO];
</script>

<!--
	OWNER: this page states only what the code and the pricing page already
	guarantee. Before the site is promoted, complete it with: the legal entity
	that provides the service (name, address, VAT number), governing law and
	court, refund terms, and the date of the last revision. Then remove
	`noindex` from the <Seo> below.
-->
<Seo title="Termini e condizioni | {SITE_NAME}" {description} path="/terms" noindex />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-zinc dark:prose-invert max-w-none">
	<h1>Termini e condizioni</h1>
	<p>
		Queste condizioni regolano l'uso del sito {SITE_NAME} e dei servizi Premium. Usando il sito le accetti.
	</p>

	<h2>Il servizio</h2>
	<p>
		{SITE_NAME} pubblica materiale didattico (teoria, formulari, esercizi e flashcard) per la scuola media, la scuola
		superiore e l'università. La teoria e i formulari sono consultabili gratuitamente e senza registrazione. Esercizi
		interattivi, flashcard, assistente AI e lezioni individuali sono riservati ai piani a pagamento.
	</p>

	<h2>Account</h2>
	<p>
		Per attivare un piano Premium serve un account, creato con email e password. Sei responsabile della custodia delle
		credenziali e delle attività svolte con il tuo account. Puoi chiederne la cancellazione in qualsiasi momento dalla
		pagina <a href="/contacts">Contatti</a>.
	</p>

	<h2>Abbonamenti e pagamenti</h2>
	<p>I piani Premium disponibili e i prezzi mensili pubblicati sono:</p>
	<ul>
		{#each plans as plan}
			<li>{plan.name}: {formatPrice(plan.price, plan.currency)} al mese</li>
		{/each}
	</ul>
	<p>
		L'abbonamento semestrale costa quanto cinque mensilità. Tutti i piani Premium prevedono una prova gratuita di 7
		giorni senza carta di credito. I pagamenti sono gestiti da Stripe; {SITE_NAME} non conserva i dati della carta.
		L'abbonamento si rinnova automaticamente alla scadenza del periodo scelto, salvo disdetta.
	</p>

	<h2>Disdetta</h2>
	<p>
		Puoi disdire in qualsiasi momento dalla pagina del tuo abbonamento. Il piano resta attivo fino alla fine del
		periodo già pagato e non viene rinnovato.
	</p>

	<h2>Contenuti</h2>
	<p>
		I testi, gli esercizi e le immagini pubblicati su {SITE_NAME} sono protetti dal diritto d'autore. Puoi usarli per
		lo studio personale; non puoi ripubblicarli o rivenderli senza autorizzazione scritta. Il materiale è curato con
		attenzione ma può contenere errori: se ne trovi uno, segnalalo dalla pagina <a href="/contacts">Contatti</a>.
	</p>

	<h2>Modifiche</h2>
	<p>
		Queste condizioni possono essere aggiornate. Le modifiche valgono dalla pubblicazione su questa pagina.
	</p>

	<h2>Contatti</h2>
	<p>Per domande su queste condizioni usa la pagina <a href="/contacts">Contatti</a>.</p>
</div>
