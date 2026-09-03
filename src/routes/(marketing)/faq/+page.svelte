<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import { SUBSCRIPTION_PLANS, formatPrice } from '$lib/stripe/config';
	import { faqJsonLd, type FaqEntry } from '$lib/seo/jsonld';

	import Seo from '$lib/components/seo/Seo.svelte';

	// Every answer restates something the site already publishes (plan config,
	// pricing page, content tree). Update both when the offer changes.
	const lite = formatPrice(SUBSCRIPTION_PLANS.LITE.price);
	const base = formatPrice(SUBSCRIPTION_PLANS.BASE.price);
	const pro = formatPrice(SUBSCRIPTION_PLANS.PRO.price);

	const faqs: FaqEntry[] = [
		{
			question: "Che cos'è Sapiens?",
			answer:
				'Sapiens è una piattaforma di materiale didattico online: teoria, formulari ed esercizi per la scuola media, la scuola superiore e i primi anni di università. Chi vuole un aiuto in più può attivare un piano Premium con esercizi interattivi, flashcard, assistente AI e lezioni individuali.'
		},
		{
			question: 'Il materiale è gratuito?',
			answer:
				'Sì. La teoria e i formulari di tutte le lezioni si leggono gratis e senza registrazione. Gli esercizi interattivi, le flashcard, la chat con Sapiens AI e le ripetizioni fanno parte dei piani a pagamento.'
		},
		{
			question: 'Quali livelli e materie sono coperti?',
			answer:
				'Scuola media: matematica. Scuola superiore: matematica, fisica, informatica e chimica. Università: Analisi matematica I e II, Fisica I e II, Fondamenti di informatica. Il catalogo si trova nella sezione Materiale didattico ed è in crescita: le lezioni non ancora scritte sono segnalate come in arrivo.'
		},
		{
			question: 'Come sono organizzate le lezioni?',
			answer:
				'Il materiale è ordinato per livello, materia, capitolo e lezione. Ogni lezione ha quattro sezioni: teoria, esercizi, formulario e flashcard. Le lezioni di un capitolo seguono l\'ordine in cui gli argomenti si incontrano a scuola, e ognuna usa solo quello che viene prima.'
		},
		{
			question: 'Quali sono i piani Premium e quanto costano?',
			answer: `Piano Lite a ${lite} al mese: esercizi interattivi, flashcard e nessuna pubblicità. Piano Base a ${base} al mese: tutto Lite più la chat con Sapiens AI. Piano Pro a ${pro} al mese: tutto Base più ripetizioni individuali settimanali. Con l'abbonamento semestrale paghi cinque mesi su sei.`
		},
		{
			question: "C'è una prova gratuita?",
			answer:
				'Sì: tutti i piani Premium hanno una prova gratuita di 7 giorni e non serve inserire la carta di credito per iniziarla.'
		},
		{
			question: "Posso disdire l'abbonamento?",
			answer:
				'Sì, in qualsiasi momento dalla pagina del tuo abbonamento. Il piano resta attivo fino alla fine del periodo già pagato e non viene rinnovato.'
		},
		{
			question: 'Serve un account per studiare?',
			answer:
				"No: teoria e formulari sono aperti a tutti. L'account serve solo per attivare un piano Premium e usare esercizi, flashcard, assistente AI e lezioni."
		},
		{
			question: 'Come posso chiedere una lezione individuale o contattarvi?',
			answer:
				'Dalla pagina Contatti puoi indicare livello, materie e frequenza desiderata: ti rispondiamo con una proposta. Le lezioni individuali sono comprese nel piano Pro.'
		},
		{
			question: 'Ho trovato un errore in una lezione, cosa faccio?',
			answer:
				'Segnalalo dalla pagina Contatti indicando la lezione e il passaggio. Le correzioni vengono pubblicate direttamente nella lezione, senza bisogno di aggiornare nulla.'
		}
	];

	const description =
		'Risposte alle domande più frequenti su Sapiens: cosa è gratuito, quali livelli e materie sono coperti, come funzionano i piani Premium, la prova gratuita e la disdetta.';
</script>

<Seo title="Domande frequenti | {SITE_NAME}" {description} path="/faq" jsonLd={faqJsonLd(faqs)} />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
	<header class="mb-10">
		<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
			Domande frequenti
		</h1>
		<p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
			Le risposte alle domande che riceviamo più spesso su materiale, piani e funzionamento del sito.
			Se non trovi quello che cerchi, scrivici dalla pagina <a href="/contacts" class="text-crimson-600 dark:text-crimson-400 hover:underline">Contatti</a>.
		</p>
	</header>

	<dl class="divide-y divide-zinc-500/25 border-y border-zinc-500/25">
		{#each faqs as faq}
			<div class="py-6">
				<dt class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{faq.question}</dt>
				<dd class="text-zinc-700 dark:text-zinc-300 leading-relaxed">{faq.answer}</dd>
			</div>
		{/each}
	</dl>

	<nav class="mt-10 flex flex-wrap gap-4 text-sm" aria-label="Pagine correlate">
		<a href="/materiale" class="text-crimson-600 dark:text-crimson-400 hover:underline">Esplora il materiale didattico</a>
		<a href="/pricing" class="text-crimson-600 dark:text-crimson-400 hover:underline">Prezzi e abbonamenti</a>
		<a href="/contacts" class="text-crimson-600 dark:text-crimson-400 hover:underline">Contatti</a>
	</nav>
</div>
