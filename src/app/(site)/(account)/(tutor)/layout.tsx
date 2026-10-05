import type { ReactNode } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { tutorArea } from '@/lib/server/tutor-area';
import { tutorBadges } from '@/lib/server/tutor-agenda';
import { TutorNav } from '@/components/tutoring/TutorNav';

/**
 * The tutor area: squared paper behind the top of the page, the sections in a column on the
 * left (a row above the page on a phone), the page on the right. `tutor` is null before the profile is created.
 */
export default async function TutorAreaLayout({ children }: { children: ReactNode }) {
	const { tutor } = await tutorArea();
	const badges = tutor ? await tutorBadges(tutor.id) : undefined;
	return (
		<div className="relative min-h-screen overflow-clip bg-page-alt">
			<div className="grid-paper pointer-events-none absolute inset-x-0 top-0 h-[26rem] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" aria-hidden="true" />
			<div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-8 xl:gap-14">
				<aside className="mb-6 lg:sticky lg:top-24 lg:mb-0">
					<div className="mb-4 max-lg:flex max-lg:items-baseline max-lg:justify-between max-lg:gap-3 lg:mb-5 lg:border-b lg:border-edge-strong lg:pb-4">
						<p className="label-mono text-fg-subtle">Area tutor</p>
						{tutor && <p className="mt-1 hidden truncate font-display text-xl font-semibold text-fg-strong lg:block">{tutor.first_name} {tutor.last_name.charAt(0)}.</p>}
						{tutor?.status === 'published' && (
							<Link href={`${TUTORING_ROOT}/${tutor.slug}`} className="inline-flex items-center gap-1 text-xs text-fg-subtle transition-colors hover:text-accent-fg lg:mt-1">
								Il tuo profilo pubblico
								<ExternalLink className="size-3" aria-hidden="true" />
							</Link>
						)}
					</div>
					<TutorNav hasProfile={!!tutor} badges={badges} />
				</aside>
				<div className="min-w-0">{children}</div>
			</div>
		</div>
	);
}
