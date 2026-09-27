import Link from 'next/link';
import { NotebookPen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
	current: 'path' | 'sheet';
	paths: { exercises: string; worksheet: string };
	/** Inside the page's card, on its first row: left-aligned, without the page margins. */
	inCard?: boolean;
}

/**
 * The two ways to practise a lesson, each on its own page: the quick path of levels, answered on the phone, and the
 * daily worksheet, done on paper at a desk. It sits in the card at the top of each page; above it only where that
 * card is out of reach (the quick path behind the paywall), so the free worksheet stays one click away.
 */
export function ExerciseModes({ current, paths, inCard = false }: Props) {
	const modes = [
		{ key: 'path', href: paths.exercises, label: 'Prova veloce', Icon: Zap },
		{ key: 'sheet', href: paths.worksheet, label: 'Scheda giornaliera', Icon: NotebookPen }
	] as const;
	return (
		<nav aria-label="Modo di esercitarsi" className={cn('flex', inCard ? 'justify-start' : 'mx-4 mt-2 justify-center sm:mx-6 md:mx-10')}>
			<ul className={cn('grid grid-cols-2 gap-1 rounded-xl border border-edge bg-surface-2 p-1', inCard ? 'w-full sm:w-[22rem]' : 'w-full max-w-md')}>
				{modes.map(({ key, href, label, Icon }) => (
					<li key={key}>
						<Link
							href={href}
							aria-current={current === key ? 'page' : undefined}
							className={cn(
								'flex min-h-[40px] items-center justify-center gap-2 whitespace-nowrap rounded-lg px-2 text-sm font-medium transition-colors focus-ring sm:px-3',
								current === key ? 'bg-surface text-fg-strong shadow-paper' : 'text-fg-muted hover:text-fg'
							)}
						>
							<Icon className="hidden size-4 shrink-0 min-[400px]:block" aria-hidden="true" />
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
