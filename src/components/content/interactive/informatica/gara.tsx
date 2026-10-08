'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import type { Passo } from '@/lib/informatica/tracce';
import { Celle } from '../informatica';

/**
 * The pieces of a race between algorithms on the same array (lesson 78, inf-confronto-algoritmi): each algorithm
 * has a lane with its cells and its counters, and the clock of the race is the comparison. At tick t every runner
 * shows its array as it is after t comparisons, so the one that needs fewer of them is done first.
 *
 * The traces are those of src/lib/informatica/tracce.ts, as they are: a runner only says which of its steps to show
 * for each number of comparisons.
 */
export type Corridore = {
	nome: string;
	passi: readonly Passo[];
	/** For each number of comparisons made, the last step of the trace that has made that many. */
	indice: readonly number[];
	/** The comparisons of the whole run. */
	confronti: number;
};

export function corridore(nome: string, passi: readonly Passo[]): Corridore {
	const indice: number[] = [];
	passi.forEach((passo, i) => {
		indice[passo.contatori.confronti] = i;
	});
	// before the first comparison every runner shows the array as it was given
	indice[0] = 0;
	return { nome, passi, indice, confronti: indice.length - 1 };
}

/** The step a runner shows after `tick` comparisons of the race: its last one, once it is done. */
export const passoAl = (c: Corridore, tick: number): Passo => c.passi[c.indice[Math.min(tick, c.confronti)]];

/** How long a tick lasts, so that a race of `ticks` comparisons takes about a quarter of a minute at most. */
export const ritmoDi = (ticks: number) => Math.round(Math.min(1000, Math.max(260, 14000 / Math.max(ticks, 1))));

/**
 * One lane: the name of the algorithm with its counters beside it, and under them its cells. When the runner is
 * done the name turns green and gets a tick, and `esito` (what a search found, in two or three words) is written
 * after it.
 */
export function Corsia({ corridore: c, tick, esito }: { corridore: Corridore; tick: number; esito?: ReactNode }) {
	const passo = passoAl(c, tick);
	const finito = tick >= c.confronti;
	// without the pointers, a row has the same height in every lane and at every step
	const righe = c.passi.map((p) => ({ celle: p.celle, puntatori: [] }));
	return (
		<section aria-label={c.nome} className="flex w-full flex-col gap-2 rounded-xl border border-edge bg-surface-2 px-3 pt-2.5 pb-3" data-corsia={c.nome} data-finito={finito || undefined}>
			<div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
				<span className={cn('inline-flex items-center gap-1.5 text-sm font-semibold motion-safe:transition-colors motion-safe:duration-200', finito ? 'text-ok-fg' : 'text-fg-strong')}>
					{c.nome}
					{finito && <Check className="size-3.5" aria-hidden="true" />}
					{finito && (esito ? <span className="font-normal">{esito}</span> : <span className="sr-only">ha finito</span>)}
				</span>
				<dl className="m-0 flex items-baseline gap-x-3 font-mono text-xs text-fg-muted">
					{Object.entries(passo.contatori).map(([nome, valore]) => (
						<div key={nome} className="flex items-baseline gap-1" data-contatore={nome}>
							<dd className="m-0 min-w-[2ch] text-right text-sm font-semibold text-fg-strong tabular-nums">{valore}</dd>
							<dt className="m-0">{nome}</dt>
						</div>
					))}
				</dl>
			</div>
			<Celle celle={passo.celle} passi={righe} label={`Il vettore di ${c.nome}`} max={38} indici={false} />
		</section>
	);
}

/** A choice of the race with its name above it, as the fields of the kit have theirs. */
export function Scelta({ nome, children }: { nome: string; children: ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-1">
			<span className="label-mono text-fg-subtle" aria-hidden="true">
				{nome}
			</span>
			{children}
		</div>
	);
}
