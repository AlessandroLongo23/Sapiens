import type { Metadata } from 'next';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { CONTENT_ROOT } from '@/lib/config/site';
import { Features } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { freeQuestionsLeft, mistakes } from '@/lib/server/exercises';
import { REVIEW_LENGTH } from '@/lib/exercises/review';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { MistakesPage } from '@/components/content/exercises/MistakesPage';

export const metadata: Metadata = pageMetadata({ title: 'I tuoi errori | Sapiens', path: '/errori', noindex: true });

/** The student's own mistakes: rendered per request, behind the login (see AUTH_REQUIRED_PREFIXES). */
export const dynamic = 'force-dynamic';

export default async function ErroriPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const user = await currentUser();
	const raw = (await searchParams).pagina;
	const page = Math.max(0, (Number(typeof raw === 'string' ? raw : 1) || 1) - 1);
	const limited = !!user && !hasFeature(user, Features.EXERCISES);
	const [list, left] = user ? await Promise.all([mistakes(user.id, page), limited ? freeQuestionsLeft(user.id) : Promise.resolve(REVIEW_LENGTH)]) : [null, 0];

	return (
		<Page width="medium">
			<PageHeader
				crumbs={[HOME_CRUMB, { label: 'I tuoi errori' }]}
				icon={ListChecks}
				eyebrow="Esercizi"
				title="I tuoi errori"
				lead="Gli esercizi che hai sbagliato, con la risposta giusta e come si risolvono. Rifarli vuol dire esercizi nuovi sugli stessi livelli."
			/>
			{!list || (list.items.length === 0 && page === 0) ? (
				<div className="rounded-2xl border border-edge bg-surface p-8 text-center">
					<p className="mb-4 text-fg-muted">Non hai ancora errori da rivedere. Quando sbagli un esercizio lo ritrovi qui, con la soluzione.</p>
					<Link href={CONTENT_ROOT} className="font-medium text-accent-fg underline underline-offset-2 hover:text-accent-hover focus-ring">
						Vai al materiale
					</Link>
				</div>
			) : (
				<MistakesPage items={list.items} open={list.open} page={page} more={list.more} free={limited} left={left} />
			)}
		</Page>
	);
}
