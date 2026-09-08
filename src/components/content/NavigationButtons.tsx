import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LessonNavigation, NavigationLink } from '@/lib/utils/lesson-navigation';
import { Latex } from '@/components/ui/Latex';

function NavLink({ link, next }: { link: NavigationLink; next: boolean }) {
	return (
		<Link href={link.url} className={`group flex min-h-[64px] min-w-0 flex-col justify-center rounded-xl border border-edge p-3 transition-all duration-200 hover:border-crimson-500/30 hover:bg-crimson-50/50 sm:p-4 dark:hover:bg-crimson-900/10 ${next ? 'items-end' : 'items-start'}`}>
			<span className="mb-1 flex items-center gap-2 text-xs font-medium text-fg-subtle transition-colors group-hover:text-crimson-500">
				{!next && <ArrowLeft size={14} aria-hidden="true" />}
				{link.subLabel || (next ? 'Successivo' : 'Precedente')}
				{next && <ArrowRight size={14} aria-hidden="true" />}
			</span>
			<span className={`line-clamp-2 w-full break-words text-sm font-medium text-fg transition-colors group-hover:text-accent-fg ${next ? 'text-right' : 'text-left'}`}>
				<Latex content={link.label} />
			</span>
		</Link>
	);
}

/** Previous and next lesson, at the foot of a lesson page. */
export function NavigationButtons({ navigation }: { navigation: LessonNavigation | null }) {
	if (!navigation?.prev && !navigation?.next) return null;
	return (
		<div className="mt-8 grid grid-cols-2 gap-3 border-t border-edge p-4 sm:gap-4 sm:p-6 md:px-10">
			{navigation.prev ? <NavLink link={navigation.prev} next={false} /> : <div aria-hidden="true" />}
			{navigation.next ? <NavLink link={navigation.next} next /> : <div aria-hidden="true" />}
		</div>
	);
}
