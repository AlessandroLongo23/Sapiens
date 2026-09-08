import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/config/site';
import { SUBSCRIPTION_PLANS, formatPrice } from '@/lib/stripe/config';
import { faqJsonLd, type FaqEntry } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { MarketingHeader, RelatedLinks } from '@/components/content/Prose';

// Every answer restates something the site already publishes (plan config, pricing page, content tree). Update both when the offer changes.
const lite = formatPrice(SUBSCRIPTION_PLANS.LITE.price);
const base = formatPrice(SUBSCRIPTION_PLANS.BASE.price);
const pro = formatPrice(SUBSCRIPTION_PLANS.PRO.price);

const FAQS: FaqEntry[] = [
	{ question: "Che cos'è Sapiens?", answer: 'Sapiens è una piattaforma di materiale didattico online: teoria, formulari ed esercizi per la scuola media, la scuola superiore e i primi anni di università. Chi vuole un aiuto in più può attivare un piano Premium con esercizi interattivi, flashcard, assistente AI e lezioni individuali.' },
	{ question: 'Il materiale è gratuito?', answer: 'Sì. La teoria e i formulari di tutte le lezioni si leggono gratis e senza registrazione. Gli esercizi interattivi, le flashcard, la chat con Sapiens AI e le ripetizioni fanno parte dei piani a pagamento.' },
	{ question: 'Quali livelli e materie sono coperti?', answer: 'Scuola media: matematica. Scuola superiore: matematica, fisica, informatica e chimica. Università: Analisi matematica I e II, Fisica I e II, Fondamenti di informatica. Il catalogo si trova nella sezione Materiale didattico ed è in crescita: le lezioni non ancora scritte sono segnalate come in arrivo.' },
	{ question: 'Come sono organizzate le lezioni?', answer: "Il materiale è ordinato per livello, materia, capitolo e lezione. Ogni lezione ha quattro sezioni: teoria, esercizi, formulario e flashcard. Le lezioni di un capitolo seguono l'ordine in cui gli argomenti si incontrano a scuola, e ognuna usa solo quello che viene prima." },
	{ question: 'Quali sono i piani Premium e quanto costano?', answer: `Piano Lite a ${lite} al mese: esercizi interattivi, flashcard e nessuna pubblicità. Piano Base a ${base} al mese: tutto Lite più la chat con Sapiens AI. Piano Pro a ${pro} al mese: tutto Base più ripetizioni individuali settimanali. Con l'abbonamento semestrale paghi cinque mesi su sei.` },
	{ question: "C'è una prova gratuita?", answer: 'Sì: tutti i piani Premium hanno una prova gratuita di 7 giorni e non serve inserire la carta di credito per iniziarla.' },
	{ question: "Posso disdire l'abbonamento?", answer: 'Sì, in qualsiasi momento dalla pagina del tuo abbonamento. Il piano resta attivo fino alla fine del periodo già pagato e non viene rinnovato.' },
	{ question: 'Serve un account per studiare?', answer: "No: teoria e formulari sono aperti a tutti. L'account serve solo per attivare un piano Premium e usare esercizi, flashcard, assistente AI e lezioni." },
	{ question: 'Come posso chiedere una lezione individuale o contattarvi?', answer: 'Dalla pagina Contatti puoi indicare livello, materie e frequenza desiderata: ti rispondiamo con una proposta. Le lezioni individuali sono comprese nel piano Pro.' },
	{ question: 'Ho trovato un errore in una lezione, cosa faccio?', answer: 'Segnalalo dalla pagina Contatti indicando la lezione e il passaggio. Le correzioni vengono pubblicate direttamente nella lezione, senza bisogno di aggiornare nulla.' }
];

export const metadata: Metadata = pageMetadata({
	title: `Domande frequenti | ${SITE_NAME}`,
	description: 'Risposte alle domande più frequenti su Sapiens: cosa è gratuito, quali livelli e materie sono coperti, come funzionano i piani Premium, la prova gratuita e la disdetta.',
	path: '/faq'
});

export default function FaqPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
			<JsonLd data={faqJsonLd(FAQS)} />
			<MarketingHeader title="Domande frequenti">
				Le risposte alle domande che riceviamo più spesso su materiale, piani e funzionamento del sito. Se non trovi quello che cerchi, scrivici dalla pagina{' '}
				<Link href="/contacts" className="text-accent-fg hover:underline">Contatti</Link>.
			</MarketingHeader>
			<dl className="divide-y divide-edge border-y border-edge">
				{FAQS.map((faq) => (
					<div key={faq.question} className="py-6">
						<dt className="mb-2 text-lg font-semibold text-fg">{faq.question}</dt>
						<dd className="leading-relaxed text-fg-muted">{faq.answer}</dd>
					</div>
				))}
			</dl>
			<RelatedLinks links={[['/materiale', 'Esplora il materiale didattico'], ['/pricing', 'Prezzi e abbonamenti'], ['/contacts', 'Contatti']]} />
		</div>
	);
}
