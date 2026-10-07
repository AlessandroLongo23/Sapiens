'use client';

import { useCallback, useSyncExternalStore, type ReactNode } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { cn } from '@/lib/utils/cn';
import type { Chiamata } from '@/lib/informatica/tracce';
import { ComandiPassi, Figura, Frase, Pila, usePassi } from '../informatica';

/**
 * Pieces for the figures that run a program with functions one row at a time, beside the stack of its calls
 * (lessons 67 and 68): the program with the row in course lit, in the language the student has chosen for the
 * programs of the page, what the program has written so far, and the whole figure put together.
 *
 * They are not in the kit (informatica.tsx) because they were written with the lessons of group 02; nothing here
 * redraws a piece of the kit.
 */

export type Linguaggio = 'python' | 'cpp';

// the same key and event as components/codice/LessonCode.tsx: the choice made on a program of the lesson moves the
// figure too, and the other way round
const KEY = 'sapiens:linguaggio';
const EVENT = 'sapiens:linguaggio';

function read(): Linguaggio {
	try {
		return localStorage.getItem(KEY) === 'cpp' ? 'cpp' : 'python';
	} catch {
		return 'python';
	}
}

/** The language of the programs of the page, and how to change it for the whole page. */
export function useLinguaggio(): [Linguaggio, (linguaggio: Linguaggio) => void] {
	const subscribe = useCallback((notify: () => void) => {
		window.addEventListener(EVENT, notify);
		window.addEventListener('storage', notify);
		return () => {
			window.removeEventListener(EVENT, notify);
			window.removeEventListener('storage', notify);
		};
	}, []);
	const linguaggio = useSyncExternalStore(subscribe, read, () => 'python' as const);
	const scegli = (nuovo: Linguaggio) => {
		try {
			localStorage.setItem(KEY, nuovo);
		} catch {
			// not remembered: the page keeps the language it had
		}
		window.dispatchEvent(new Event(EVENT));
	};
	return [linguaggio, scegli];
}

export function SceltaLinguaggio({ linguaggio, onLinguaggio }: { linguaggio: Linguaggio; onLinguaggio: (linguaggio: Linguaggio) => void }) {
	return (
		<ToggleGroup
			compact
			label="Linguaggio del programma"
			value={linguaggio}
			onChange={onLinguaggio}
			options={[
				{ value: 'python', label: 'Python' },
				{ value: 'cpp', label: 'C++' }
			]}
		/>
	);
}

/** A program as rows of text, with the row in course (from 1) lit. `righe` is the height to keep, when programs of different lengths take turns. */
export function ListatoProgramma({ programma, riga, righe, label = 'Il programma' }: { programma: string; riga?: number; righe?: number; label?: string }) {
	const rows = programma.replace(/\n$/, '').split('\n');
	const empty = Math.max(0, (righe ?? 0) - rows.length);
	return (
		<div role="group" aria-label={label} className="w-full max-w-sm overflow-x-auto rounded-xl border border-edge bg-surface-2 py-2 font-mono text-[11.5px] leading-[19px] sm:text-xs sm:leading-5" data-listato>
			{rows.map((row, i) => {
				const now = i + 1 === riga;
				return (
					<div key={i} aria-current={now ? 'step' : undefined} className={cn('min-w-max border-l-[3px] pr-3 pl-2.5 whitespace-pre motion-safe:transition-colors motion-safe:duration-200', now ? 'border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-semibold text-fg-strong' : 'border-transparent text-fg-muted')}>
						{row || ' '}
					</div>
				);
			})}
			{Array.from({ length: empty }, (_, i) => (
				<div key={`e${i}`} aria-hidden="true" className="whitespace-pre">
					{' '}
				</div>
			))}
		</div>
	);
}

/** What the program has written so far, on one row; the row is there from the start, so nothing moves when the first line arrives. */
export function Uscita({ righe }: { righe?: readonly string[] }) {
	return (
		<div className="flex w-full max-w-sm items-baseline gap-2.5 rounded-lg border border-edge bg-surface px-3 py-1.5" data-uscita>
			<span className="label-mono shrink-0 text-fg-subtle">Scrive</span>
			<output aria-live="polite" className={cn('min-h-5 font-mono text-sm', righe?.length ? 'font-semibold text-fg-strong' : 'text-fg-faint')}>
				{righe?.length ? righe.join(' ⏎ ') : 'ancora niente'}
			</output>
		</div>
	);
}

/** One step of a program in the two languages: the stack, the row lit in each language, what has been written. */
export type PassoProgramma = { pila: Chiamata[]; frase: string; riga: number; uscita?: string[] };
/** A program with its trace, already in one language. */
export type Esecuzione = { programma: string; passi: PassoProgramma[] };

/**
 * The whole figure: the choices above (`scelte`, for a figure with more programs, beside the language), the program
 * and the stack side by side (one under the other on a phone), what the program writes, the sentence, the commands.
 * `tutte` are all the executions the figure can show, for the heights that must not change.
 */
export function ProgrammaPila({ esecuzione, tutte, scelte, chiave }: { esecuzione: Esecuzione; tutte: readonly Esecuzione[]; scelte?: ReactNode; /** Changes when another execution is shown: the steps start again. */ chiave: string }) {
	return <Corsa key={chiave} esecuzione={esecuzione} tutte={tutte} scelte={scelte} />;
}

function Corsa({ esecuzione, tutte, scelte }: { esecuzione: Esecuzione; tutte: readonly Esecuzione[]; scelte?: ReactNode }) {
	const passi = usePassi(esecuzione.passi.length, { ritmo: 2400 });
	const passo = esecuzione.passi[passi.passo];
	const rows = Math.max(...tutte.map((e) => e.programma.replace(/\n$/, '').split('\n').length));
	return (
		<Figura>
			{scelte && <div className="flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-2">{scelte}</div>}
			<div className="grid w-full max-w-3xl items-start justify-items-center gap-4 sm:grid-cols-2">
				<div className="flex w-full flex-col items-center gap-2.5">
					<ListatoProgramma programma={esecuzione.programma} riga={passo.riga} righe={rows} />
					<Uscita righe={passo.uscita} />
				</div>
				<Pila pila={passo.pila} passi={tutte.flatMap((e) => e.passi.map((p) => p.pila))} />
			</div>
			<Frase tutte={tutte.flatMap((e) => e.passi.map((p) => p.frase))}>{passo.frase}</Frase>
			<ComandiPassi passi={passi} />
		</Figura>
	);
}
