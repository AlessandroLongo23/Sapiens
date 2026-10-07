'use client';

import { useId, useMemo, useState } from 'react';
import { Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { Passo, Stato } from '@/lib/informatica/tracce';
import { leggiParola } from '@/lib/informatica/tracce-matrici-stringhe';
import { Celle, ComandiPassi, Contatori, Figura, Frase, Legenda, usePassi } from '../informatica';

/**
 * A figure that walks through the trace of an algorithm on the characters of a word (lesson 73): the characters in
 * cells that touch, with their indices and the pointers, the sentence of the step, the counters, the commands, and a
 * field where the student writes another word. It is VettorePassi for a string: see StringaVocali.tsx.
 *
 * `traccia` must be a function defined outside the component, so that the trace is computed again only when the
 * word changes.
 */
export function StringaPassi({ alt, parola: iniziale, esempi, traccia, legenda, ritmo }: { alt?: string; /** The word of the lesson's example. */ parola: string; /** Other words to try, offered one after the other by the button. */ esempi: readonly string[]; traccia: (parola: string) => { passi: Passo[] }; legenda?: Partial<Record<Stato, string | true>>; ritmo?: number }) {
	const id = useId();
	const [parola, setParola] = useState(iniziale);
	const [bozza, setBozza] = useState<string | null>(null);
	const letta = bozza === null ? null : leggiParola(bozza);
	const { passi: lista } = useMemo(() => traccia(parola), [traccia, parola]);
	const passi = usePassi(lista.length, { ritmo });
	const passo = lista[passi.passo];
	const frasi = useMemo(() => lista.map((p) => p.frase), [lista]);
	const cambia = (nuova: string) => {
		setParola(nuova);
		setBozza(null);
		passi.ricomincia();
	};
	const conferma = () => {
		if (letta?.parola) cambia(letta.parola);
	};
	const altra = () => {
		const giro = [iniziale, ...esempi];
		cambia(giro[(giro.indexOf(parola) + 1) % giro.length]);
	};
	return (
		<Figura>
			<div className="flex w-full flex-col items-center gap-3">
				{/* the cells of a string touch (`unite`), as in <Stringa>; <Celle> itself, for the height that does not change */}
				<Celle celle={passo.celle} puntatori={passo.puntatori} passi={lista} label={alt ?? `La stringa ${parola}`} max={40} unite />
				{legenda && <Legenda stati={legenda} />}
			</div>
			<Frase tutte={frasi}>{passo.frase}</Frase>
			<Contatori voci={passo.contatori} />
			<ComandiPassi passi={passi} />
			<div className="flex w-full max-w-lg flex-col gap-1.5" data-parola>
				<div className="flex flex-wrap items-end justify-center gap-x-3 gap-y-2">
					<label htmlFor={id} className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
						<span className="label-mono text-fg-subtle">La parola</span>
						<input
							id={id}
							type="text"
							autoComplete="off"
							autoCapitalize="none"
							spellCheck={false}
							value={bozza ?? parola}
							onChange={(e) => setBozza(e.target.value)}
							onBlur={conferma}
							onKeyDown={(e) => {
								if (e.key === 'Enter') conferma();
								else if (e.key === 'Escape') setBozza(null);
							}}
							aria-invalid={letta?.errore ? true : undefined}
							aria-describedby={letta?.errore ? `${id}-errore` : undefined}
							className={cn(
								'min-h-9 w-full min-w-0 rounded-lg border bg-surface px-2.5 font-mono text-sm text-fg-strong shadow-paper transition outline-none focus:ring-3',
								letta?.errore ? 'border-danger focus:ring-danger/20' : 'border-edge-strong focus:border-[oklch(0.64_var(--chroma)_var(--hue))] focus:ring-tint/20'
							)}
						/>
					</label>
					<Button variant="secondary" size="sm" onClick={altra}>
						<Shuffle className="size-3.5" aria-hidden="true" />
						Un&apos;altra parola
					</Button>
				</div>
				{letta?.errore && (
					<p id={`${id}-errore`} role="alert" className="m-0 text-center text-xs text-danger-fg">
						{letta.errore}
					</p>
				)}
			</div>
		</Figura>
	);
}
