import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { MarketingHeader, RelatedLinks } from '@/components/content/Prose';
import { ContactForm } from '@/components/landing/ContactForm';

export const metadata: Metadata = pageMetadata({
	title: `Contatti | ${SITE_NAME}`,
	description: 'Scrivi a Sapiens per chiedere una lezione individuale, avere informazioni sui piani o segnalare un errore in una lezione. Indica livello, materie e frequenza: ti rispondiamo con una proposta.',
	path: '/contacts'
});

export default function ContactsPage() {
	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
			<MarketingHeader title="Contatti">
				<p>Vuoi una lezione individuale, hai una domanda sui piani o hai trovato un errore in una lezione? Compila il modulo: ti rispondiamo all&apos;indirizzo che indichi.</p>
				{CONTACT_EMAIL && (
					<p className="mt-4 inline-flex items-center gap-2 text-base text-fg">
						<Mail className="size-4 text-accent-fg" aria-hidden="true" />
						<a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-fg hover:underline">{CONTACT_EMAIL}</a>
					</p>
				)}
			</MarketingHeader>
			<ContactForm />
			<RelatedLinks links={[['/faq', 'Domande frequenti'], ['/pricing', 'Prezzi e abbonamenti'], ['/materiale', 'Materiale didattico']]} />
		</div>
	);
}
