import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { parentRequest } from '@/lib/server/onboarding';
import { LEGAL } from '@/lib/config/legal';
import { PARENT_CONFIRM_PATH } from '@/lib/onboarding/config';
import { ParentConfirm } from '@/components/onboarding/ParentConfirm';

export const metadata: Metadata = pageMetadata({ title: 'Consenso del genitore | Sapiens', path: PARENT_CONFIRM_PATH, noindex: true });

/** Where the link sent to the parent of a student under 14 leads: what Sapiens is, what confirming means, one button. */
export default async function ParentConfirmPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
	const { token } = await searchParams;
	const request = await parentRequest(token);
	return (
		<main className="mx-auto w-full max-w-xl px-5 py-10 sm:py-16">
			{!request || !token ? (
				<>
					<h1 className="font-display text-3xl font-semibold text-fg-strong">Questo link non è valido</h1>
					<p className="mt-3 text-fg-muted">Controlla di aver aperto il link dell’ultima email ricevuta. Se l’account è stato cancellato, lo studente può iscriversi di nuovo.</p>
				</>
			) : request.state === 'expired' ? (
				<>
					<h1 className="font-display text-3xl font-semibold text-fg-strong">Questo link è scaduto</h1>
					<p className="mt-3 text-fg-muted">{request.studentFirstName} può iscriversi di nuovo: riceverai un’altra email.</p>
				</>
			) : (
				<>
					<h1 className="font-display text-3xl font-semibold text-fg-strong">{request.studentFirstName} vuole usare Sapiens</h1>
					<div className="mt-4 flex flex-col gap-3 text-fg-muted">
						<p>Sapiens è una piattaforma per studiare matematica e le altre materie scientifiche: lezioni, esercizi a livelli, formulari e un quaderno per gli appunti.</p>
						<p>
							Chi ha meno di {LEGAL.digitalConsentAge} anni può avere un account solo con il consenso di un genitore o di chi ne fa le veci. Confermando dichiari di esserlo e acconsenti al trattamento dei dati di {request.studentFirstName} descritto nell’
							<Link href="/privacy" target="_blank" className="font-medium text-accent-fg hover:underline">
								informativa sulla privacy
							</Link>
							, alle condizioni dei{' '}
							<Link href="/terms" target="_blank" className="font-medium text-accent-fg hover:underline">
								Termini
							</Link>
							.
						</p>
						<p>L’account è gratuito. Non ti chiediamo di crearne uno tuo, e puoi farlo cancellare in ogni momento.</p>
					</div>
					<ParentConfirm token={token} studentFirstName={request.studentFirstName} done={request.state === 'confirmed'} />
				</>
			)}
		</main>
	);
}
