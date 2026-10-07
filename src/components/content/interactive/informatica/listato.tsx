'use client';

import type { ReactNode } from 'react';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

/**
 * Pieces shared by the figures of the lessons on tables and on forms (CelleUnite.tsx, ModuloInviato.tsx): a
 * listing of code whose lines can be lit or struck through, and a button that stays in the Tab order when it has
 * nothing to do. Written in the site's tokens, like the rest of the computer science kit (../informatica.tsx).
 */

export interface RigaListato {
	testo: ReactNode;
	/** Levels of indentation. */
	rientro?: number;
	/** `accesa`: the line the figure is about now; `tolta`: a line that is no longer part of the code, struck through. */
	stato?: 'normale' | 'accesa' | 'tolta';
	chiave?: string | number;
}

/** Lines of code in fixed width, one under the other, each with its state. A struck line is a <del>: it is not code any more. */
export function Listato({ righe, label, stretto = false, className }: { righe: readonly RigaListato[]; label: string; /** A smaller letter, for when a line would not fit: the height of the lines stays the same. */ stretto?: boolean; className?: string }) {
	return (
		<div role="group" aria-label={label} data-listato className={cn('w-full overflow-x-auto rounded-xl border border-edge bg-surface-2 py-1.5 font-mono leading-[18px] text-fg', stretto ? 'text-[10.5px]' : 'text-[11.5px]', className)}>
			{righe.map((riga, i) => {
				const Tag = riga.stato === 'tolta' ? 'del' : 'div';
				return (
					<Tag
						key={riga.chiave ?? i}
						data-riga={riga.stato ?? 'normale'}
						className={cn(
							'block border-l-[3px] pr-2 whitespace-pre motion-safe:transition-[background-color,border-color,color] motion-safe:duration-200',
							riga.stato === 'accesa' ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-medium text-fg-strong' : 'border-transparent',
							riga.stato === 'tolta' && 'text-fg-faint line-through decoration-fg-subtle'
						)}
						style={{ paddingLeft: 8 + (riga.rientro ?? 0) * 10 }}
					>
						{riga.testo}
					</Tag>
				);
			})}
		</div>
	);
}

/** A button of a figure: with `off` it has nothing to do, looks so, and still takes the focus (so the keyboard does not lose its place). */
export function Tasto({ off = false, onClick, variant = 'secondary', children }: { off?: boolean; onClick: () => void; variant?: ButtonVariant; children: ReactNode }) {
	return (
		<Button variant={variant} size="sm" aria-disabled={off || undefined} onClick={off ? undefined : onClick} className="aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none">
			{children}
		</Button>
	);
}

/** A piece of code inside a sentence. */
export function Codice({ children }: { children: ReactNode }) {
	return <b className="font-mono font-medium whitespace-nowrap text-fg">{children}</b>;
}

/** The small title of a part of a figure. */
export function Titolino({ children }: { children: ReactNode }) {
	return <div className="label-mono text-fg-subtle">{children}</div>;
}
