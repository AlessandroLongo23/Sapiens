import { Check, Plus } from 'lucide-react';
import type { DiaryEntry, EntryKind } from '@/lib/diary/entries';
import { cn } from '@/lib/utils/cn';

/** The colour of a kind of entry: tests in the accent, oral tests in amber, homework in pen, reminders in pencil. */
const DOT: Record<EntryKind, string> = {
	verifica: 'bg-accent',
	interrogazione: 'bg-warn',
	compito: 'bg-[var(--pen)]',
	promemoria: 'bg-fg-faint'
};

/** What is written on a day, as dots under its number, and a tick if the day was studied. */
export function EntryDots({ entries, studied }: { entries: DiaryEntry[]; studied: boolean }) {
	const shown = entries.slice(0, 3);
	return (
		<span className="flex h-2.5 items-center gap-[3px]" aria-hidden="true">
			{shown.map((e) => (
				<span key={e.id} className={cn('size-[5px] rounded-full', DOT[e.kind], e.done && 'opacity-35')} />
			))}
			{entries.length > 3 && <Plus className="size-2 text-fg-subtle" strokeWidth={3.5} />}
			{studied && <Check className="size-2.5 text-ok-fg" strokeWidth={3.5} />}
		</span>
	);
}
