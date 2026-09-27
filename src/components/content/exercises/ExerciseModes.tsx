import Link from 'next/link';
import { NotebookPen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
	current: 'path' | 'sheet';
	paths: { exercises: string; worksheet: string };
}

/**
 * The two ways to practise a lesson, each on its own page: the quick path of levels, answered on the phone, and the
 * worksheet, done on paper at a desk.
 */
export function ExerciseModes({ current, paths }: Props) {
	const modes = [
		{ key: 'path', href: paths.exercises, label: 'Prova veloce', Icon: Zap },
		{ key: 'sheet', href: paths.worksheet, label: 'Scheda sul quaderno', Icon: NotebookPen }
	] as const;
	return (
		<nav aria-label="Modo di esercitarsi" className="mx-4 mt-2 flex justify-center sm:mx-6 md:mx-10">
			<ul className="grid w-full max-w-md grid-cols-2 gap-1 rounded-xl border border-edge bg-surface-2 p-1">
				{modes.map(({ key, href, label, Icon }) => (
					<li key={key}>
						<Link
							href={href}
							aria-current={current === key ? 'page' : undefined}
							className={cn(
								'flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-ring',
								current === key ? 'bg-surface text-fg-strong shadow-paper' : 'text-fg-muted hover:text-fg'
							)}
						>
							<Icon className="size-4 shrink-0" aria-hidden="true" />
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
