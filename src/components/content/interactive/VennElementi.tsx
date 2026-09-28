'use client';

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { frame, Drawing, Figure, Caption, ButtonRow, Readout, Tex, TINT, INK, v, dist, type V, FONT, FONT_SIZE } from './kit';
import { VENN2, VennDefs, VennOutline, zoneAt } from './insiemi';

/**
 * Lesson 2, "Tra elencazione e diagramma": the numbers of U are dragged from a row under the diagram into their zones.
 * Every zone has a few places, and a number dropped in a zone goes to the nearest free one, as the lesson's figure
 * sets them. Reading the diagram back (the numbers inside each circle) is written under it; when every number is in
 * its zone the diagram turns green, and a common element left in one circle only gets the lesson's warning.
 */

const L = VENN2;
const f = frame(-3.05, 3.05, -3.05, 2.05);
const U = [1, 2, 3, 4, 5, 6];

/** Places in each zone (0 outside the circles, 1 only A, 2 only B, 3 both), in the order they are filled. */
const SLOTS: V[][] = [
	[v(-2.6, -1.6), v(2.6, -1.6), v(0, -1.68), v(0, 1.68), v(-2.6, -0.85), v(2.6, -0.85)],
	[v(-1.8, 0.4), v(-1.8, -0.4), v(-1.25, 0.95), v(-1.25, -0.95), v(-1.3, 0), v(-2.1, 0)],
	[v(1.8, 0.4), v(1.8, -0.4), v(1.25, 0.95), v(1.25, -0.95), v(1.3, 0), v(2.1, 0)],
	[v(0, 0), v(0, 0.5), v(0, -0.5)]
];
const TRAY = U.map((_, i) => v(-2.5 + i, -2.55));
const CYCLE = [null, 1, 3, 2, 0] as const;

type Place = { zone: number; slot: number } | null;
type Sets = { A: number[]; B: number[] };
const START: Sets = { A: [1, 2, 3], B: [3, 4] };

const zoneOf = (s: Sets, x: number) => (s.A.includes(x) ? 1 : 0) | (s.B.includes(x) ? 2 : 0);
const where = ['fuori dai due cerchi', 'solo in A', 'solo in B', 'nella zona comune'];
const list = (xs: number[]) => (xs.length ? `\\{${xs.join(',\\ ')}\\}` : '\\emptyset');
const words = (xs: number[]) => (xs.length === 1 ? `${xs[0]}` : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);

/** New sets: every number in a random zone, with one to three in common and no zone over its places. */
function randomSets(): Sets {
	for (;;) {
		const zones = U.map(() => Math.floor(Math.random() * 4));
		const count = [0, 1, 2, 3].map((z) => zones.filter((x) => x === z).length);
		if (count[3] < 1 || count[1] < 1 || count[2] < 1 || count.some((c, z) => c > SLOTS[z].length)) continue;
		return { A: U.filter((_, i) => zones[i] & 1), B: U.filter((_, i) => zones[i] & 2) };
	}
}

export default function VennElementi({ alt }: { alt?: string }) {
	const id = useId().replace(/:/g, '');
	const [sets, setSets] = useState<Sets>(START);
	const [places, setPlaces] = useState<Place[]>(U.map(() => null));
	const [drag, setDrag] = useState<{ i: number; at: V } | null>(null);
	const svg = useRef<SVGSVGElement>(null);

	const at = (p: Place, i: number) => (p ? SLOTS[p.zone][p.slot] : TRAY[i]);

	/** Puts number i in zone z, in the free place nearest to `near` (or the first free one). */
	const put = (i: number, z: number | null, near?: V) => {
		setPlaces((ps) => {
			const next = [...ps];
			if (z === null) {
				next[i] = null;
				return next;
			}
			const taken = new Set(ps.flatMap((p, j) => (p && p.zone === z && j !== i ? [p.slot] : [])));
			const free = SLOTS[z].map((s, k) => ({ s, k })).filter(({ k }) => !taken.has(k));
			if (!free.length) return ps;
			free.sort((a, b) => (near ? dist(a.s, near) - dist(b.s, near) : a.k - b.k));
			next[i] = { zone: z, slot: free[0].k };
			return next;
		});
	};

	const down = (i: number) => (e: PointerEvent<SVGGElement>) => {
		if (!svg.current) return;
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		setDrag({ i, at: f.toTikz(e, svg.current) });
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		if (!drag || !svg.current) return;
		setDrag({ i: drag.i, at: f.toTikz(e, svg.current) });
	};
	const up = () => {
		if (!drag) return;
		put(drag.i, zoneAt(L, drag.at), drag.at);
		setDrag(null);
	};
	const key = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		const now = places[i] ? places[i]!.zone : null;
		put(i, CYCLE[(CYCLE.indexOf(now as (typeof CYCLE)[number]) + 1) % CYCLE.length]);
	};

	const reset = (s: Sets) => {
		setSets(s);
		setPlaces(U.map(() => null));
	};

	const placed = places.every(Boolean);
	const wrong = U.filter((x, i) => places[i] && places[i]!.zone !== zoneOf(sets, x));
	// The lesson's warning: a common element drawn inside one circle only.
	const split = U.filter((x, i) => zoneOf(sets, x) === 3 && places[i] && (places[i]!.zone === 1 || places[i]!.zone === 2));
	const done = placed && wrong.length === 0;
	const inA = U.filter((_, i) => places[i] && places[i]!.zone & 1);
	const inB = U.filter((_, i) => places[i] && places[i]!.zone & 2);
	const tl = f.px(v(L.x0, L.y1)), br = f.px(v(L.x1, L.y0));

	let caption: string;
	if (done) caption = 'Giusto: ogni numero è nella sua zona, e dentro i cerchi si rileggono proprio gli elenchi di A e di B.';
	else if (split.length) {
		const x = split[0];
		caption = `Il ${x} sta sia in A sia in B: va nella zona in cui i cerchi si sovrappongono. Dentro un cerchio solo, il diagramma dice che non appartiene all'altro insieme.`;
	} else if (placed) caption = `${wrong.length === 1 ? `Il ${wrong[0]} non è al suo posto` : `${words(wrong)} non sono al loro posto`}: guarda di nuovo gli elenchi. I numeri da spostare hanno un cerchio rosso.`;
	else caption = 'Trascina ogni numero nella sua zona: prima quelli comuni, poi quelli di un solo insieme, infine quelli fuori. Con la tastiera, Invio sposta il numero di zona in zona.';

	return (
		<Figure>
			<div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-fg">
				<Tex>{`U = ${list(U)}`}</Tex>
				<Tex>{`A = ${list(sets.A)}`}</Tex>
				<Tex>{`B = ${list(sets.B)}`}</Tex>
			</div>
			<Drawing f={f} svgRef={svg} label={alt ?? 'Diagramma di Eulero-Venn in cui trascinare i numeri da 1 a 6'}>
				<VennDefs L={L} f={f} id={id} />
				{done && <rect x={tl.x} y={tl.y} width={br.x - tl.x} height={br.y - tl.y} fill={TINT.green} />}
				<VennOutline L={L} f={f} />
				{U.map((x, i) => {
					const dragging = drag?.i === i;
					const p = f.px(dragging ? drag.at : at(places[i], i));
					const bad = (placed && wrong.includes(x)) || split.includes(x);
					const now = places[i] ? where[places[i]!.zone] : 'sotto il diagramma';
					return (
						<g
							key={x}
							role="button"
							tabIndex={0}
							aria-label={`Numero ${x}, ora ${now}. Trascinalo, oppure premi Invio per cambiargli zona`}
							className="group cursor-grab outline-none active:cursor-grabbing"
							style={{ touchAction: 'none' }}
							onPointerDown={down(i)}
							onPointerMove={move}
							onPointerUp={up}
							onPointerCancel={up}
							onKeyDown={key(i)}
						>
							<circle cx={p.x} cy={p.y} r={17} fill="transparent" />
							<circle cx={p.x} cy={p.y} r={11} fill="none" stroke="#000" strokeWidth={1} className={dragging ? 'opacity-50' : 'opacity-0 transition-opacity group-hover:opacity-30 group-focus-visible:opacity-80'} />
							{bad && <circle cx={p.x} cy={p.y} r={11} fill="none" stroke={INK.red} strokeWidth={1.5} />}
							<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={FONT_SIZE} fontFamily={FONT} fill="#000" pointerEvents="none">
								{x}
							</text>
						</g>
					);
				})}
			</Drawing>
			<Readout>
				<span>
					Dentro <Tex>A</Tex>: <Tex>{list(inA)}</Tex>
				</span>
				<span>
					Dentro <Tex>B</Tex>: <Tex>{list(inB)}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>
			<ButtonRow>
				<Button variant="secondary" size="sm" onClick={() => reset(sets)}>
					<RotateCcw className="size-4" aria-hidden="true" />
					Ricomincia
				</Button>
				<Button variant="secondary" size="sm" onClick={() => reset(randomSets())}>
					<Shuffle className="size-4" aria-hidden="true" />
					Altri insiemi
				</Button>
			</ButtonRow>
		</Figure>
	);
}
