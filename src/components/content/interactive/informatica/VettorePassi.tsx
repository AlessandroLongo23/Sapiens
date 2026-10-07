'use client';

import { useMemo, useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { Passo, Stato } from '@/lib/informatica/tracce';
import { Celle, ComandiPassi, Contatori, Dati, Figura, Frase, Legenda, usePassi } from '../informatica';

/**
 * A figure that walks through the trace of an algorithm on an array: the cells, what the colours mean, the sentence
 * of the step, the counters, the commands, and the fields where the student changes the values. Searches and sorts
 * are all this figure with another `traccia` (src/lib/informatica/tracce.ts): see RicercaSequenzialePassi.tsx.
 *
 * `traccia` must be a function defined outside the component, so that the trace is computed again only when the
 * data change.
 */
export function VettorePassi({
	alt,
	valori: iniziali,
	traccia,
	cerca: cercaIniziale,
	ordinati = false,
	varianti,
	legenda
}: {
	alt?: string;
	/** The values the figure opens with: those of the lesson's example. */
	valori: readonly number[];
	traccia: (valori: readonly number[], scelte: { cerca: number; variante: string }) => { passi: Passo[] };
	/** For a search: the value looked for at first. Without it the figure has no such field. */
	cerca?: number;
	/** Keep the values sorted, whatever the student types (binary search). */
	ordinati?: boolean;
	/** A choice between versions of the algorithm, passed to `traccia` as `variante`. Two or three short options. */
	varianti?: { label: string; opzioni: { value: string; label: string }[] };
	/** The states the figure uses, each with its name here (`true` for the usual name). */
	legenda?: Partial<Record<Stato, string | true>>;
}) {
	const [valori, setValori] = useState<readonly number[]>(iniziali);
	const [cerca, setCerca] = useState(cercaIniziale ?? 0);
	const [variante, setVariante] = useState(varianti?.opzioni[0].value ?? '');
	const { passi: lista } = useMemo(() => traccia(valori, { cerca, variante }), [traccia, valori, cerca, variante]);
	const passi = usePassi(lista.length);
	const passo = lista[passi.passo];
	const frasi = useMemo(() => lista.map((p) => p.frase), [lista]);
	const cercando = cercaIniziale !== undefined;

	return (
		<Figura>
			{varianti && (
				<ToggleGroup
					label={varianti.label}
					compact
					options={varianti.opzioni}
					value={variante}
					onChange={(value) => {
						setVariante(value);
						passi.ricomincia();
					}}
				/>
			)}
			<div className="flex w-full flex-col items-center gap-3">
				{cercando && (
					<div className="flex items-center gap-2" data-cerco>
						<span className="label-mono text-fg-subtle">Cerco</span>
						<span className="flex h-8 min-w-8 items-center justify-center rounded-lg border-[1.5px] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-surface px-1.5 font-mono text-sm leading-none font-semibold text-fg-strong tabular-nums">{cerca}</span>
					</div>
				)}
				<Celle celle={passo.celle} puntatori={passo.puntatori} passi={lista} label={alt ?? 'Il vettore'} />
				{legenda && <Legenda stati={legenda} />}
			</div>
			<Frase tutte={frasi}>{passo.frase}</Frase>
			<Contatori voci={passo.contatori} />
			<ComandiPassi passi={passi} />
			<Dati
				valori={valori}
				onValori={(nuovi) => {
					setValori(nuovi);
					passi.ricomincia();
				}}
				cerca={cercando ? cerca : undefined}
				onCerca={(valore) => {
					setCerca(valore);
					passi.ricomincia();
				}}
				ordinati={ordinati}
			/>
		</Figura>
	);
}
