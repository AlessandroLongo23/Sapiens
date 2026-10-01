'use client';

import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { LETTERS, SUBLEVEL_TABLE, boxOccupation } from '@/lib/orbitali/configurazione';
import { orbitalName, orientationOrder, type Orbital } from '@/lib/orbitali/idrogeno';
import { cn } from '@/lib/utils/cn';

/**
 * The table of sublevels as the school books draw it for the electron configuration: one box per orbital, a row of
 * boxes per sublevel (one for s, three for p, five for d, seven for f), the levels one above the other with the
 * first at the bottom. Here every box is a button that shows its orbital, so the table teachers and students already
 * know is the way to choose one. With an element chosen, the boxes carry its electrons as arrows, laid by Hund's
 * rule, and each sublevel its count. The colours are those of the blocks of the periodic table.
 */

const LEVELS = [7, 6, 5, 4, 3, 2, 1];

/** One or two electrons in a box: an arrow up, and one down for the second, with opposite spin. */
function Arrows({ count }: { count: number }) {
	if (!count) return null;
	return (
		<svg viewBox="0 0 20 20" className="pointer-events-none size-full" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
			<path d="M7 16V4M4.4 7 7 4l2.6 3" />
			{count === 2 && <path d="M13 4v12M10.4 13 13 16l2.6-3" />}
		</svg>
	);
}

const WIDTH = 'w-[calc(1.75rem+var(--boxes)*(var(--box)+2px))] shrink-0 [--box:1rem] sm:[--box:1.5rem] lg:[--box:1.75rem]';

export function OrbitalGrid({ orbital, onPick, electrons }: { orbital: Orbital; onPick: (patch: Partial<Orbital>) => void; electrons: Map<string, number> | null }) {
	const root = useRef<HTMLDivElement>(null);
	const inTable = SUBLEVEL_TABLE[orbital.n]?.includes(orbital.l) ?? false;

	// One Tab stop; the arrows go along a sublevel and from a level to the next of the same letter.
	const keys = (e: KeyboardEvent<HTMLDivElement>) => {
		const step = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [1, 0], ArrowDown: [-1, 0] }[e.key];
		const at = (e.target as HTMLElement).dataset;
		if (!step || at.n === undefined) return;
		e.preventDefault();
		const all = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button[data-n]') ?? []);
		const [n, l, i] = [Number(at.n), Number(at.l), Number(at.i)];
		const next = step[0]
			? all.find((b) => Number(b.dataset.n) === n + step[0] && Number(b.dataset.l) === l && Number(b.dataset.i) === i)
			: all[all.indexOf(e.target as HTMLButtonElement) + step[1]];
		next?.focus();
	};

	return (
		<div ref={root} role="group" aria-label="Tabella dei sottolivelli: scegli un orbitale" onKeyDown={keys} className="ptable flex flex-col gap-1 sm:gap-1.5">
			{LEVELS.map((n) => (
				<div key={n} className="flex items-center gap-2 sm:gap-4">
					{[0, 1, 2, 3].map((l) => {
						// Each letter keeps its column, so that the s, p, d and f of the levels stand one above the other.
						const width = { '--boxes': 2 * l + 1 } as CSSProperties;
						if (!SUBLEVEL_TABLE[n].includes(l)) return <div key={l} className={WIDTH} style={width} aria-hidden="true" />;
						const level = `${n}${LETTERS[l]}`;
						const count = electrons?.get(level) ?? 0;
						const occupation = electrons ? boxOccupation(l, count) : null;
						return (
							<div key={l} className={cn('flex items-center', WIDTH)} style={width}>
								<span className={cn('w-7 shrink-0 font-mono text-[0.6875rem]', (orbital.n === n && orbital.l === l) || count > 0 ? 'font-semibold text-fg-strong' : 'text-fg-subtle')}>
									{level}
									{count > 0 && <sup>{count}</sup>}
								</span>
								{orientationOrder(l, orbital.kind).map((m, i) => {
									const selected = orbital.n === n && orbital.l === l && orbital.m === m;
									const name = orbitalName({ n, l, m, kind: orbital.kind });
									const inBox = occupation?.[i] ?? 0;
									const label =
										`Orbitale ${level}${name.direction ? ` ${name.direction}` : orbital.kind === 'complesso' || l > 2 ? `, m = ${m}` : ''}` +
										(occupation ? `: ${inBox === 0 ? 'vuoto' : inBox === 1 ? 'un elettrone' : 'due elettroni'}` : '');
									return (
										<button
											key={m}
											type="button"
											data-n={n}
											data-l={l}
											data-i={i}
											tabIndex={selected || (!inTable && n === 1) ? 0 : -1}
											aria-pressed={selected}
											aria-label={label}
											title={label}
											onClick={() => onPick({ n, l, m })}
											className={cn(
												'ptable-cell mr-0.5 size-(--box) shrink-0 rounded-[3px] border transition-[transform,box-shadow,opacity] duration-150 hover:z-10 hover:scale-110 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-strong motion-reduce:hover:scale-100',
												selected ? 'z-10 border-accent ring-2 ring-accent' : 'border-edge-strong',
												// With an element chosen the empty sublevels step back.
												occupation && count === 0 && !selected && 'opacity-40'
											)}
											style={{ '--pt-fill': `var(--pt-blocco-${LETTERS[l]})` } as CSSProperties}
										>
											<Arrows count={inBox} />
										</button>
									);
								})}
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
