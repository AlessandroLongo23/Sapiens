'use client';

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { useLessonProgress } from '@/lib/state/progress';
import { cn } from '@/lib/utils/cn';

/** What a row of the material can show progress for: a lesson with exercises, or a chapter's lessons with exercises. */
export type RowProgress = { kind: 'lesson'; path: string } | { kind: 'chapter'; lessons: string[] };

/**
 * The right end of a lesson or chapter row: the student's progress once it is known, in place of the row's usual
 * label (`fallback`), which stays for visitors, while the progress loads and on what is not started. It takes the
 * label's place so the row does not move when the progress arrives.
 */
export function ProgressMeta({ progress, fallback }: { progress: RowProgress; fallback: ReactNode }) {
	const lessons = useLessonProgress();
	if (!lessons) return fallback;

	if (progress.kind === 'lesson') {
		const p = lessons[progress.path];
		if (!p) return fallback;
		const done = p.passed >= p.total;
		return (
			<span className={cn('label-mono flex shrink-0 items-center gap-1.5', done ? 'text-ok-fg' : 'text-fg-muted')} aria-label={done ? 'Tutti i livelli superati' : `${p.passed} livelli superati su ${p.total}`}>
				{done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <Meter value={p.passed} of={p.total} />}
				<span aria-hidden="true">{done ? 'Completata' : `${p.passed}/${p.total} livelli`}</span>
			</span>
		);
	}

	const started = progress.lessons.filter((path) => lessons[path]);
	if (started.length === 0) return fallback;
	const done = started.filter((path) => lessons[path].passed >= lessons[path].total).length;
	const all = done === progress.lessons.length;
	return (
		<span className={cn('label-mono flex shrink-0 items-center gap-1.5', all ? 'text-ok-fg' : 'text-fg-muted')} aria-label={`${done} lezioni completate su ${progress.lessons.length} con esercizi`}>
			{all ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <Meter value={done} of={progress.lessons.length} />}
			<span aria-hidden="true">
				{done}/{progress.lessons.length} completate
			</span>
		</span>
	);
}

/** A short bar filled to value/of. */
function Meter({ value, of }: { value: number; of: number }) {
	return (
		<span className="relative h-1.5 w-8 overflow-hidden rounded-full bg-surface-4" aria-hidden="true">
			<span className="absolute inset-y-0 left-0 rounded-full bg-ok" style={{ width: `${of > 0 ? Math.round((value / of) * 100) : 0}%` }} />
		</span>
	);
}
