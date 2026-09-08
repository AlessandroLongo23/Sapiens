import type { ReactNode } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { tutorArea } from '@/lib/server/tutor-area';
import { TutorNav } from '@/components/tutoring/TutorNav';

/** The tutor area: the signed-in user's own profile, or null before it is created. */
export default async function TutorAreaLayout({ children }: { children: ReactNode }) {
	const { tutor } = await tutorArea();
	return (
		<div className="min-h-screen bg-page-alt">
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex flex-wrap items-center justify-between gap-4">
					<div>
						<p className="text-sm font-medium text-accent-fg">Area tutor</p>
						{tutor?.status === 'published' && (
							<Link href={`${TUTORING_ROOT}/${tutor.slug}`} className="inline-flex items-center gap-1 text-sm text-fg-subtle transition-colors hover:text-accent-fg">
								Il tuo profilo pubblico
								<ExternalLink className="size-3.5" aria-hidden="true" />
							</Link>
						)}
					</div>
					<TutorNav hasProfile={!!tutor} />
				</div>
				{children}
			</div>
		</div>
	);
}
