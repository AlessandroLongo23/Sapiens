import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/config/site';
import { SCHOOL_YEAR_PASS, SUBSCRIPTION_PLANS, TRIAL_DAYS, formatPrice } from '@/lib/stripe/config';
import { faqJsonLd, type FaqEntry } from '@/lib/seo/jsonld';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { MarketingHeader, RelatedLinks } from '@/components/content/Prose';

// Every answer restates something the site already publishes (plan config, pricing page, content tree). Update both when the offer changes.
const studio = formatPrice(SUBSCRIPTION_PLANS.STUDIO.price);
const pass = formatPrice(SCHOOL_YEAR_PASS.price);

const FAQS: FaqEntry[] = [
	{ question: "Che cos'è Sapiens?", answer: 'Sapiens è una piattaforma di materiale didattico online: teoria, formulari ed esercizi per la scuola media, la scuola superiore e i primi anni di università. Chi vuole allenarsi di più può attivare il piano Studio, con esercizi senza limiti, flashcard, lo Zaino per gli appunti e l’assistente Sapiens AI.' },
	{ question: 'Il materiale è gratuito?', answer: 'Sì. La teoria e i formulari di tutte le lezioni si leggono gratis e senza registrazione. Con un account gratuito hai anche una sessione di esercizi al giorno. Esercizi senza limiti, flashcard, Zaino senza limiti e Sapiens AI fanno parte del piano Studio.' },
	{ question: 'Quali livelli e materie sono coperti?', answer: 'Scuola media: matematica. Scuola superiore: matematica, fisica, informatica e chimica. Università: Analisi matematica I e II, Fisica I e II, Fondamenti di informatica. Il catalogo si trova nella sezione Materiale didattico ed è in crescita: le lezioni non ancora scritte sono segnalate come in arrivo.' },
	{ question: 'Come sono organizzate le lezioni?', answer: "Il materiale è ordinato per livello, materia, capitolo e lezione. Ogni lezione ha quattro sezioni: teoria, esercizi, formulario e flashcard. Le lezioni di un capitolo seguono l'ordine in cui gli argomenti si incontrano a scuola, e ognuna usa solo quello che viene prima." },
	{ question: 'Quali sono i piani e quanto costano?', answer: `Due piani. Free: teoria, formulari e una sessione di esercizi al giorno. Studio: ${studio} al mese, con esercizi senza limiti e progressi salvati, flashcard, Zaino senza limiti e Sapiens AI. A gennaio e febbraio puoi anche prendere Studio fino al 30 giugno con un solo pagamento di ${pass}, che non si rinnova.` },
	{ question: "C'è una prova gratuita?", answer: `Sì: chi crea un account ha Studio gratis per ${TRIAL_DAYS} giorni, senza carta di credito. Alla fine della prova l’account passa da solo al piano Free, senza addebiti.` },
	{ question: "Posso disdire l'abbonamento?", answer: 'Sì, in qualsiasi momento dalla pagina del tuo abbonamento. Studio resta attivo fino alla fine del mese già pagato e non viene rinnovato. Studio fino a giugno non va disdetto: finisce da solo.' },
	{ question: 'Serve un account per studiare?', answer: 'No: teoria e formulari sono aperti a tutti. L’account serve per gli esercizi, gratuiti una sessione al giorno, e per il piano Studio.' },
	{ question: 'Come posso chiedere una lezione individuale o contattarvi?', answer: 'Dalla pagina Contatti. Per trovare un insegnante per lezioni individuali c’è la sezione Ripetizioni, con i tutor e i loro contatti.' },
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
