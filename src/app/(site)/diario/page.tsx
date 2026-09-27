import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { DIARIO_ROOT } from '@/lib/config/site';
import { romeDate } from '@/lib/stripe/config';
import { getSession } from '@/lib/server/auth';
import { diaryView } from '@/lib/server/diary';
import { isDay, schoolYear } from '@/lib/diary/dates';
import { PenStroke } from '@/components/content/PageHeader';
import { DiaryInvite } from '@/components/diary/DiaryInvite';
import { DiaryScreen } from '@/components/diary/DiaryScreen';

export const metadata: Metadata = pageMetadata({ title: 'Diario | Sapiens', path: DIARIO_ROOT, noindex: true });

/** The student's own diary: rendered per request. Visitors without an account see what it holds and the way in. */
export const dynamic = 'force-dynamic';

export default async function DiarioPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const { supabase, user } = await getSession();
	const today = romeDate();
	const asked = (await searchParams).giorno;
	const day = isDay(asked) ? asked : today;
	const view = user ? await diaryView(supabase, user, day) : null;
	const year = schoolYear(day);

	return (
		<div className="relative min-h-screen overflow-x-clip bg-page-alt">
			<div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[26rem] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" aria-hidden="true" />
			<div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:px-8">
				{view ? (
					<DiaryScreen view={view} />
				) : (
					<>
						<header className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
							<h1 className="w-fit font-display text-4xl font-semibold leading-none text-fg-strong sm:text-5xl">
								Diario
								<PenStroke className="mt-1.5" />
							</h1>
							<span className="label-mono pb-2 text-fg-subtle">
								Anno scolastico {year}/{String(year + 1).slice(2)}
							</span>
						</header>
						<DiaryInvite year={year} />
					</>
				)}
			</div>
		</div>
	);
}
