'use client';

import { useState, useSyncExternalStore } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import type { Linguaggio, TracciaProgramma } from '@/lib/informatica/tracce-funzioni';
import type { Stato } from '@/lib/informatica/tracce';
import { ComandiPassi, Figura, Frase, Legenda, Pila, usePassi } from '../informatica';

/**
 * A program followed row by row (lessons 65 and 66 on functions): the listing with the row that runs lit and the
 * row of the call that waits marked, the stack of the calls from the kit, what the program has written on the
 * screen, the sentence of the step and the commands. The traces are in src/lib/informatica/tracce-funzioni.ts, one
 * per language: the figure opens in the language chosen for the programs of the page, and follows it.
 *
 * <Listato> and <Schermo> are not in the kit (informatica.tsx): they are here until other figures need them.
 */

// the language of the programs of the page, as components/codice/LessonCode.tsx keeps it
const KEY = 'sapiens:linguaggio';
const subscribe = (changed: () => void) => {
	window.addEventListener(KEY, changed);
	window.addEventListener('storage', changed);
	return () => {
		window.removeEventListener(KEY, changed);
		window.removeEventListener('storage', changed);
	};
};
const stored = (): Linguaggio => {
	try {
		return localStorage.getItem(KEY) === 'cpp' ? 'cpp' : 'python';
	} catch {
		return 'python';
	}
};

/** The language chosen on this device for every program, and how to choose another. */
function useLinguaggio(): [Linguaggio, (linguaggio: Linguaggio) => void] {
	const linguaggio = useSyncExternalStore<Linguaggio>(subscribe, stored, () => 'python');
	const scegli = (nuovo: Linguaggio) => {
		try {
			localStorage.setItem(KEY, nuovo);
		} catch {
			// not remembered: the figure keeps the language it had
		}
		window.dispatchEvent(new Event(KEY));
	};
	return [linguaggio, scegli];
}

const ARANCIO = 'border-[oklch(0.64_var(--chroma)_var(--hue))]';

/** The program with its rows numbered: the row that runs is lit, a row whose call has not ended yet says so. */
function Listato({ codice, riga, attesa }: { codice: string; riga: number; attesa: readonly number[] }) {
	const righe = codice.split('\n');
	return (
		<div role="group" aria-label={`Il programma. In esecuzione la riga ${riga}${attesa.length ? `; in attesa la riga ${attesa.join(', ')}` : ''}.`} className="w-full overflow-x-auto rounded-xl border border-edge bg-surface-2 py-2 font-mono text-[12px] leading-[19px] text-fg-strong [font-variant-ligatures:none]" data-listato>
			{righe.map((testo, i) => {
				const n = i + 1;
				const corrente = n === riga;
				const ferma = attesa.includes(n);
				return (
					<div key={n} aria-current={corrente ? 'step' : undefined} data-riga={n} data-stato={corrente ? 'corrente' : ferma ? 'attesa' : undefined} className={cn('flex min-w-max items-baseline border-l-[3px] pr-2 motion-safe:transition-colors motion-safe:duration-200', corrente ? `${ARANCIO} bg-tint-soft` : ferma ? 'border-dashed border-fg-subtle bg-surface-3/60' : 'border-transparent')}>
						<span aria-hidden="true" className={cn('w-7 shrink-0 pr-2 text-right text-[10.5px] tabular-nums select-none', corrente ? 'font-semibold text-tint-fg' : 'text-fg-faint')}>
							{n}
						</span>
						<span className="whitespace-pre">{testo || ' '}</span>
						{ferma && <span className="label-mono ml-auto pl-3 text-[10px] text-fg-subtle">in attesa</span>}
					</div>
				);
			})}
		</div>
	);
}

/** What the program has written so far. It keeps the room of `tutte` rows, and the rows of this step are lit. */
function Schermo({ righe, nuove, tutte }: { righe: readonly string[]; nuove: number; tutte: number }) {
	return (
		<div className="w-full" data-schermo>
			<div className="label-mono mb-1 text-fg-subtle">Sullo schermo</div>
			<div role="group" aria-label={righe.length ? `Sullo schermo: ${righe.join(', ')}` : 'Sullo schermo non c’è ancora niente'} className="rounded-xl border border-edge-strong bg-surface py-1.5 font-mono text-[12px] leading-[19px] text-fg-strong shadow-paper">
				{Array.from({ length: Math.max(tutte, 1) }, (_, i) => (
					<div key={i} className={cn('px-3 whitespace-pre motion-safe:transition-colors motion-safe:duration-200', i < righe.length && i >= righe.length - nuove && 'bg-tint-soft')}>
						{righe[i] ?? ' '}
					</div>
				))}
			</div>
		</div>
	);
}

type Varianti<V extends string> = { label: string; opzioni: { value: V; label: string }[] };

/**
 * The whole figure. `traccia(linguaggio, variante)` gives the program and its steps; with `varianti` the student
 * chooses between two or three versions of the program (the order of the arguments of a call). The boxes of the
 * variables are the kit's: a new one is drawn as a cell `esame`, one that is read as `confronto`, one that is written
 * as `scambio`, and `legenda` names them with those keys.
 */
export function ProgrammaPassi<V extends string = 'base'>({ traccia, varianti, legenda, ritmo = 2400 }: { traccia: (linguaggio: Linguaggio, variante: V) => TracciaProgramma; varianti?: Varianti<V>; /** What the colours of the boxes of the variables mean, where the trace uses them. */ legenda?: Partial<Record<Stato, string | true>>; ritmo?: number }) {
	const [linguaggio, scegli] = useLinguaggio();
	const [variante, setVariante] = useState<V>((varianti?.opzioni[0].value ?? 'base') as V);
	const { codice, passi: lista } = traccia(linguaggio, variante);
	const passi = usePassi(lista.length, { ritmo });
	const passo = lista[passi.passo];
	const prima = passi.passo > 0 ? lista[passi.passo - 1].uscita.length : 0;
	// every sentence the figure can show, in any language and version: the height does not change with a choice
	const frasi = (['python', 'cpp'] as const).flatMap((l) => (varianti?.opzioni.map((o) => o.value) ?? [variante]).flatMap((v) => traccia(l, v).passi.map((p) => p.frase)));
	return (
		<Figura>
			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
				<ToggleGroup
					label="Linguaggio del programma"
					compact
					value={linguaggio}
					onChange={scegli}
					options={[
						{ value: 'python', label: 'Python' },
						{ value: 'cpp', label: 'C++' }
					]}
				/>
				{varianti && (
					<ToggleGroup
						label={varianti.label}
						compact
						value={variante}
						onChange={(value) => {
							setVariante(value);
							passi.ricomincia();
						}}
						options={varianti.opzioni}
					/>
				)}
			</div>
			{/* on a phone the sentence and the commands come right under the listing, so a step is read without scrolling; the stack and the screen follow */}
			<div className="grid w-full max-w-2xl items-start gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
				<Listato codice={codice} riga={passo.riga} attesa={passo.attesa} />
				<div className="sm:order-3 sm:col-span-2">
					<Frase tutte={frasi}>{passo.frase}</Frase>
				</div>
				<div className="sm:order-4 sm:col-span-2">
					<ComandiPassi passi={passi} />
				</div>
				<div className="flex w-full flex-col items-center gap-3 sm:order-2">
					<div className="grid w-full max-w-sm" data-chiamate>
						{/* the room kept for the frame of a function, while no function is running: under it, unseen, the frame of the main program, to give it the right height */}
						<div aria-hidden="true" className="col-start-1 row-start-1 flex flex-col-reverse gap-2">
							<div className="invisible">
								<Pila pila={passo.pila.slice(0, 1)} />
							</div>
							<div className={cn('flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-edge-strong px-3 text-center text-xs text-fg-subtle', passo.pila.length > 1 && 'invisible')}>nessuna funzione chiamata</div>
						</div>
						<div className="col-start-1 row-start-1">
							<Pila pila={passo.pila} passi={lista.map((p) => p.pila)} />
						</div>
					</div>
					{legenda && <Legenda stati={legenda} />}
					<Schermo righe={passo.uscita} nuove={passo.uscita.length - prima} tutte={lista[lista.length - 1].uscita.length} />
				</div>
			</div>
		</Figura>
	);
}
