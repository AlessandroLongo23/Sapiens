'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Inbox, Mail, UsersRound } from 'lucide-react';
import { subjectName, tutorDisplayName, type TutorProfile } from '@/lib/tutoring/config';
import { EMPTY_FILTERS, activeFilterCount, applyFilters, citiesOf, filtersFromParams, paramsFromFilters, type TutorFilters as Filters } from '@/lib/tutoring/filter';
import { useAuth } from '@/lib/state/auth';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TutorCard } from './TutorCard';
import { TutorFilters } from './TutorFilters';
import { TutorAvatar } from './TutorAvatar';
import { RequestForm } from './RequestForm';

/**
 * The tutor list with its filters. Filters live in the URL: the cached HTML
 * is rendered with none (so the full list is in the page for crawlers and
 * for the first paint), the first effect reads the query string from the
 * address bar, and every later change rewrites it in place (no history
 * entry per keystroke). `useSearchParams` is avoided on purpose: on a
 * statically cached page it would make React render this whole list in the
 * browser only.
 */
export function TutorList({ tutors }: { tutors: TutorProfile[] }) {
	const router = useRouter();
	const pathname = usePathname();
	const user = useAuth((s) => s.user);
	const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });
	const applied = useRef('');
	const [requestTutor, setRequestTutor] = useState<TutorProfile | null>(null);

	useEffect(() => {
		const sync = () => {
			const search = window.location.search.replace(/^\?/, '');
			if (search === applied.current) return;
			applied.current = search;
			setFilters(filtersFromParams(new URLSearchParams(search)));
		};
		sync();
		window.addEventListener('popstate', sync);
		return () => window.removeEventListener('popstate', sync);
	}, []);

	const change = (next: Filters) => {
		setFilters(next);
		const search = paramsFromFilters(next).toString();
		if (search === applied.current) return;
		applied.current = search;
		router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
	};

	const cities = useMemo(() => citiesOf(tutors), [tutors]);
	const results = useMemo(() => applyFilters(tutors, filters, { subjectName }), [tutors, filters]);

	return (
		<div className="animate-fade-in space-y-6">
			{user && (
				<Link href="/richieste" className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
					<Inbox className="size-4" aria-hidden="true" />
					Le tue richieste
				</Link>
			)}
			<TutorFilters filters={filters} onChange={change} cities={cities} resultCount={results.length} />
			{tutors.length === 0 ? (
				<Card tone="dashed" className="space-y-3 p-10 text-center">
					<UsersRound className="mx-auto size-10 text-fg-faint" aria-hidden="true" />
					<h2 className="text-xl font-semibold text-fg">I primi tutor stanno arrivando</h2>
					<p className="mx-auto max-w-md text-fg-muted">Stiamo verificando i primi profili. Nel frattempo puoi chiedere una lezione individuale dalla pagina contatti.</p>
					<Link href="/contacts" className="inline-flex items-center gap-2 font-medium text-accent-fg hover:underline">
						<Mail className="size-4" aria-hidden="true" />
						Scrivici
					</Link>
				</Card>
			) : results.length === 0 ? (
				<Card tone="dashed" className="space-y-3 p-10 text-center" role="status">
					<h2 className="text-xl font-semibold text-fg">Nessun tutor con questi filtri</h2>
					<p className="mx-auto max-w-md text-fg-muted">Prova a togliere la città o a cercare solo la materia: molti tutor fanno lezione anche online.</p>
					{activeFilterCount(filters) > 0 && (
						<Button variant="secondary" size="sm" onClick={() => change({ ...EMPTY_FILTERS, sort: filters.sort })}>Azzera i filtri</Button>
					)}
				</Card>
			) : (
				<>
					<h2 id="tutor-list-title" className="sr-only">Tutor disponibili</h2>
					<ul aria-labelledby="tutor-list-title" className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
					{results.map((tutor, index) => (
						<li key={tutor.id} className="h-full animate-rise-in" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
							<TutorCard tutor={tutor} highlightSubject={filters.subject} onRequest={setRequestTutor} />
						</li>
					))}
					</ul>
				</>
			)}
			<Sheet open={requestTutor !== null} onClose={() => setRequestTutor(null)} title={requestTutor ? `Chiedi aiuto a ${tutorDisplayName(requestTutor)}` : ''} align="center" bodyClass="px-4 pb-4 sm:px-5">
				{requestTutor && (
					<>
						<div className="mb-4 flex items-center gap-3">
							<TutorAvatar tutor={requestTutor} size="sm" />
							<p className="truncate text-sm text-fg-muted">{requestTutor.headline}</p>
						</div>
						<RequestForm tutor={requestTutor} initial={{ subject: filters.subject, level: filters.level, mode: filters.mode }} />
					</>
				)}
			</Sheet>
		</div>
	);
}
