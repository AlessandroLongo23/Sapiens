'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Slider } from '@/components/ui/Slider';
import { cn } from '@/lib/utils/cn';
import { Caption } from '../kit';
import { Figura } from '../informatica';
import { MOSSA, Regola, Scelta, posto, useLarghezza, usePosti } from './impaginazione';

/**
 * "Dove finiscono gli elementi di un contenitore flex quando cambio direzione, justify-content e align-items, e
 * che cosa succede quando non ci stanno?" A container with three to five elements of different sizes: the student
 * picks the values, the elements slide to their new places, and the rule that has been put together is written
 * beside the container. The two arrows on the edges say along which side each property works, and they trade
 * places when the direction changes.
 *
 * The places are the browser's own: a hidden copy of the container has the real CSS, and the boxes are drawn where
 * its elements are (impaginazione.tsx).
 */

const DIREZIONI = ['row', 'column'] as const;
const GIUSTIFICA = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'] as const;
const ALLINEA = ['stretch', 'flex-start', 'center', 'flex-end'] as const;
const A_CAPO = ['nowrap', 'wrap'] as const;
const QUANTI = ['3', '4', '5'] as const;

type Direzione = (typeof DIREZIONI)[number];
type Giustifica = (typeof GIUSTIFICA)[number];
type Allinea = (typeof ALLINEA)[number];

const ALTEZZA = 232; // the container, in pixels
const BORDO = 8; // its padding
const LARGHEZZA = 304; // at most
/** The elements: the share of the container's width each would like in a row, its height in a column, and its size across. */
const ELEMENTI = [
	{ lungo: 0.155, alto: 26, traverso: { riga: 30, colonna: 0.3 } },
	{ lungo: 0.2, alto: 38, traverso: { riga: 54, colonna: 0.55 } },
	{ lungo: 0.17, alto: 30, traverso: { riga: 40, colonna: 0.4 } },
	{ lungo: 0.21, alto: 42, traverso: { riga: 66, colonna: 0.7 } },
	{ lungo: 0.185, alto: 34, traverso: { riga: 46, colonna: 0.48 } }
] as const;

const DOVE: Record<Direzione, Record<'inizio' | 'fine' | 'lungo' | 'traverso' | 'inizioTraverso' | 'fineTraverso' | 'fila', string>> = {
	row: { inizio: 'a sinistra', fine: 'a destra', lungo: 'in larghezza', traverso: 'in altezza', inizioTraverso: 'in alto', fineTraverso: 'in basso', fila: 'riga' },
	column: { inizio: 'in alto', fine: 'in basso', lungo: 'in altezza', traverso: 'in larghezza', inizioTraverso: 'a sinistra', fineTraverso: 'a destra', fila: 'colonna' }
};

const b = (testo: string): ReactNode => <b className="font-mono font-medium whitespace-nowrap text-fg">{testo}</b>;

function Asse({ nome, verticale, principale }: { nome: string; verticale: boolean; principale: boolean }) {
	return (
		<span aria-hidden="true" className={cn('flex items-center gap-1 font-mono text-[11px] leading-none whitespace-nowrap', principale ? 'font-semibold text-tint-fg' : 'text-fg-subtle')} style={verticale ? { writingMode: 'vertical-rl' } : undefined}>
			{nome}
			<svg width="18" height="7" viewBox="0 0 18 7" className="block shrink-0" style={verticale ? { transform: 'rotate(90deg)', margin: '6px -5.5px' } : undefined}>
				<path d="M0 3.5H14M11 0.5 15 3.5 11 6.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</span>
	);
}

export default function Flexbox({ alt }: { alt?: string }) {
	const [direzione, setDirezione] = useState<Direzione>('row');
	const [giustifica, setGiustifica] = useState<Giustifica>('flex-start');
	const [allinea, setAllinea] = useState<Allinea>('stretch');
	const [aCapo, setACapo] = useState<(typeof A_CAPO)[number]>('nowrap');
	const [gap, setGap] = useState(8);
	const [quanti, setQuanti] = useState<(typeof QUANTI)[number]>('4');
	const [accesa, setAccesa] = useState<string>();
	const cambia = <T,>(proprieta: string, set: (value: T) => void) => (value: T) => {
		set(value);
		setAccesa(proprieta);
	};

	const [box, misurata] = useLarghezza<HTMLDivElement>();
	const larghezza = Math.min(LARGHEZZA, Math.max(220, (misurata || 330) - 22));
	const dentro = larghezza - 2 * BORDO;
	const riga = direzione === 'row';
	const n = Number(quanti);
	const elementi = ELEMENTI.slice(0, n);
	const [copia, posti] = usePosti<HTMLDivElement>(`${direzione} ${giustifica} ${allinea} ${aCapo} ${gap} ${n} ${larghezza}`);

	// whether the elements fit on one line at the size they would like
	const voluto = elementi.reduce((s, e) => s + (riga ? Math.round(e.lungo * dentro) : e.alto), 0) + gap * (n - 1);
	const ciStanno = voluto <= (riga ? dentro : ALTEZZA - 2 * BORDO);
	const d = DOVE[direzione];

	const giustificato: Record<Giustifica, ReactNode> = {
		'flex-start': <>li raccoglie {d.inizio}</>,
		center: <>li raccoglie al centro</>,
		'flex-end': <>li raccoglie {d.fine}</>,
		'space-between': <>manda il primo e l’ultimo ai bordi e divide lo spazio che avanza tra gli altri</>,
		'space-around': <>mette lo stesso spazio ai due lati di ogni elemento</>
	};
	const allineato: Record<Allinea, ReactNode> = {
		stretch: <>li allunga {d.traverso} fino a riempire la {d.fila}</>,
		'flex-start': <>li tiene {d.inizioTraverso}</>,
		center: <>li centra {d.traverso}</>,
		'flex-end': <>li tiene {d.fineTraverso}</>
	};

	return (
		<Figura>
			<div ref={box} className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-4">
				{/* the container, with the two arrows on its top and left edges */}
				<div className="grid shrink-0 grid-cols-[18px_auto] grid-rows-[18px_auto] gap-1" role="img" aria-label={alt ?? `Un contenitore flex con ${n} elementi: flex-direction ${direzione}, justify-content ${giustifica}, align-items ${allinea}, flex-wrap ${aCapo}, gap di ${gap} pixel`}>
					<span />
					<span className="flex items-center pl-1">
						<Asse nome={riga ? 'justify-content' : 'align-items'} verticale={false} principale={riga} />
					</span>
					<span className="flex justify-center pt-1">
						<Asse nome={riga ? 'align-items' : 'justify-content'} verticale principale={!riga} />
					</span>
					<div className="relative overflow-hidden rounded-xl border-[1.5px] border-dashed border-edge-strong bg-surface-2" style={{ width: larghezza, height: ALTEZZA }} data-contenitore>
						{/* the real CSS, hidden: the browser lays it out and the boxes below are drawn where its elements are */}
						<div
							ref={copia}
							aria-hidden="true"
							className="invisible absolute inset-0 flex"
							style={{ flexDirection: direzione, justifyContent: giustifica, alignItems: allinea, flexWrap: aCapo, gap, padding: BORDO }}
						>
							{elementi.map((e, i) => {
								const style: CSSProperties = riga ? { flex: `0 1 ${Math.round(e.lungo * dentro)}px`, minHeight: e.traverso.riga } : { flex: `0 1 ${e.alto}px`, minWidth: Math.round(e.traverso.colonna * dentro) };
								return (
									<div key={i} data-posto={i} className="box-border px-1.5 font-mono text-sm leading-5" style={style}>
										{i + 1}
									</div>
								);
							})}
						</div>
						{elementi.map((_, i) => {
							const r = posti.get(String(i));
							return (
								r && (
									<div key={i} data-elemento={i + 1} className={cn('absolute top-0 left-0 flex items-center justify-center rounded-lg border-[1.5px] border-[oklch(0.64_var(--chroma)_var(--hue))] bg-tint-soft font-mono text-sm font-semibold text-fg-strong motion-safe:animate-fade-in', MOSSA)} style={posto(r)}>
										{i + 1}
									</div>
								)
							);
						})}
					</div>
				</div>
				<div className="mt-0 flex min-w-0 flex-col gap-2 sm:mt-[22px]">
					<Regola
						selettore=".contenitore"
						accesa={accesa}
						righe={[
							{ proprieta: 'display', valore: 'flex' },
							{ proprieta: 'flex-direction', valore: direzione },
							{ proprieta: 'justify-content', valore: giustifica },
							{ proprieta: 'align-items', valore: allinea },
							{ proprieta: 'flex-wrap', valore: aCapo },
							{ proprieta: 'gap', valore: `${gap}px` }
						]}
					/>
				</div>
			</div>
			<div className="flex min-h-[7.5rem] w-full items-start justify-center sm:min-h-[5rem]">
				<Caption>
					Con {b(`flex-direction: ${direzione}`)} gli elementi sono in {d.fila}. {b(`justify-content: ${giustifica}`)} lavora lungo la {d.fila}: {giustificato[giustifica]}. {b(`align-items: ${allinea}`)} lavora di traverso: {allineato[allinea]}.{' '}
					{!ciStanno && (aCapo === 'wrap' ? <>Non ci stanno tutti: con {b('wrap')} quelli che avanzano vanno a capo.</> : <>Non ci stanno tutti: con {b('nowrap')} si stringono per restare su una sola {d.fila}.</>)}
				</Caption>
			</div>
			<div className="flex w-full max-w-xl flex-col gap-3">
				<Scelta nome="flex-direction" value={direzione} options={DIREZIONI} onChange={cambia('flex-direction', setDirezione)} />
				<Scelta nome="justify-content" value={giustifica} options={GIUSTIFICA} onChange={cambia('justify-content', setGiustifica)} />
				<Scelta nome="align-items" value={allinea} options={ALLINEA} onChange={cambia('align-items', setAllinea)} />
				<Scelta nome="flex-wrap" value={aCapo} options={A_CAPO} onChange={cambia('flex-wrap', setACapo)} />
				<Slider label="gap" value={gap} min={0} max={24} step={4} unit="px" onChange={cambia('gap', setGap)} />
				<Scelta nome="Quanti elementi" value={quanti} options={QUANTI} onChange={setQuanti} codice={false} />
			</div>
		</Figura>
	);
}
