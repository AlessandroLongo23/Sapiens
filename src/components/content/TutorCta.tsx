import { ArrowRight, UsersRound } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';

/** At the foot of a lesson: the tutors of its subject and level. */
export function TutorCta({ href }: { href: string }) {
	return (
		<aside className="mx-4 flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-5 sm:mx-6 sm:flex-row sm:items-center md:mx-10" aria-labelledby="tutor-cta">
			<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-fg">
				<UsersRound className="size-5" aria-hidden="true" />
			</span>
			<div className="flex-1">
				<h2 id="tutor-cta" className="text-base font-semibold text-fg">
					Non ti torna qualcosa?
				</h2>
				<p className="text-sm text-fg-muted">Un tutor di questa materia può spiegartelo in una lezione, online o vicino a te. Nessuna commissione sulle lezioni.</p>
			</div>
			<LinkButton href={href}>
				Chiedi aiuto a un tutor
				<ArrowRight className="size-4" aria-hidden="true" />
			</LinkButton>
		</aside>
	);
}
