'use client';

import { useId, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, frame, v, useTween, THICK, THIN, DASH, TINT, type V } from '../kit';
import { LIQUID } from '../fisica/liquidi';
import { PARTICLE, mulberry32 } from './particelle-materia';

/**
 * Chemistry lesson 16 (Sostanze pure, miscugli omogenei ed eterogenei): eight materials to classify by looking closer
 * and closer. Three levels: with the naked eye (the beaker, the flask or the piece of material, with a dashed ring
 * where the next level looks), under an optical microscope (a round field: uniform, two layers, droplets, grains) and
 * at the level of the particles (an imagined view, no microscope shows it: particles of one kind or more, mixed or in
 * separate regions). Changing level zooms: the old view grows and fades while the new one comes in. The student
 * answers with three buttons, and the caption says whether the answer is right and why.
 *
 * Classifications as in the lesson: milk is a heterogeneous mixture (a colloid: droplets of fat seen under the
 * microscope), brass a homogeneous one (an alloy), filtered air a homogeneous one.
 */

type Kind = 'pura' | 'omogeneo' | 'eterogeneo';
type Level = 'occhio' | 'microscopio' | 'particelle';
type Id = 'distillata' | 'salata' | 'olio' | 'latte' | 'aria' | 'ottone' | 'granito' | 'rame';

const LEVELS: { value: Level; label: string }[] = [
	{ value: 'occhio', label: 'Occhio nudo' },
	{ value: 'microscopio', label: 'Microscopio' },
	{ value: 'particelle', label: 'Particelle' },
];
const LEVEL_TEXT: Record<Level, string> = {
	occhio: 'a occhio nudo',
	microscopio: 'al microscopio ottico, ingrandito qualche centinaio di volte',
	particelle: 'a livello delle particelle, che nessun microscopio ottico mostra',
};
const KIND_TEXT: Record<Kind, string> = { pura: 'Sostanza pura', omogeneo: 'Miscuglio omogeneo', eterogeneo: 'Miscuglio eterogeneo' };

const BRASS = '#f2dc8c';
const COPPER = '#f0b38f';
const MILK = '#f4f4ea';
const FAT = '#fff0a8';
const GRANITE = ['#f2eeea', '#f4b8b8', '#6e6a66'];

const SAMPLES: { id: Id; name: string; what: string; kind: Kind; why: string }[] = [
	{ id: 'olio', name: 'Acqua e olio', what: 'acqua e olio in un becher', kind: 'eterogeneo', why: 'le due fasi, acqua sotto e olio sopra, si vedono già a occhio nudo, e le particelle dei due liquidi restano separate.' },
	{ id: 'salata', name: 'Acqua salata', what: "acqua con del sale sciolto", kind: 'omogeneo', why: "è uguale in ogni punto anche al microscopio, ma le particelle sono di due tipi, mescolati fino alla singola particella: è una soluzione." },
	{ id: 'rame', name: 'Rame', what: 'un pezzo di rame', kind: 'pura', why: 'è uniforme a ogni ingrandimento, e le particelle sono tutte di un solo tipo.' },
	{ id: 'latte', name: 'Latte', what: 'del latte in un becher', kind: 'eterogeneo', why: 'a occhio sembra uniforme, ma al microscopio si vedono le goccioline di grasso sospese nell’acqua: è un colloide, un miscuglio eterogeneo.' },
	{ id: 'aria', name: 'Aria', what: "dell'aria filtrata in una bottiglia chiusa", kind: 'omogeneo', why: "è uguale in ogni punto, ma è fatta di particelle di più sostanze (soprattutto azoto e ossigeno) mescolate tra loro." },
	{ id: 'distillata', name: 'Acqua distillata', what: 'acqua distillata in un becher', kind: 'pura', why: 'è uniforme a ogni ingrandimento, e le particelle sono tutte molecole d’acqua.' },
	{ id: 'granito', name: 'Granito', what: 'un pezzo di granito', kind: 'eterogeneo', why: 'i granelli di minerali diversi, chiari, rosa e scuri, si distinguono già a occhio nudo.' },
	{ id: 'ottone', name: 'Ottone', what: 'un pezzo di ottone', kind: 'omogeneo', why: "è uniforme anche al microscopio, ma le particelle sono di due tipi, rame e zinco, mescolate: è una lega, una soluzione solida." },
];

// ---------------------------------------------------------------------------- geometry

const RV = 2.1; // radius of the round field (microscope, particles)
const RP = 0.17; // radius of a particle
const f = frame(-3.1, 3.1, -2.95, 2.95);
/** Everything is drawn in a 4,8 cm window and shown 1,3 times larger. */
const ZOOM = 1.3;
const PXCM = f.W / (f.x1 - f.x0);

type Dot = { p: V; k: 'a' | 'b' | 'c' };

/** A jittered triangular packing of particles covering the round field, as a liquid or a solid seen close up. */
function packing(seed: number, jitter: number, lattice = false): V[] {
	const rnd = mulberry32(seed);
	const out: V[] = [];
	const dx = 2 * RP + 0.04, dy = lattice ? dx : dx * 0.87;
	for (let j = -8; j <= 8; j++) {
		for (let i = -8; i <= 8; i++) {
			const x = i * dx + (lattice || j % 2 === 0 ? 0 : dx / 2) + (rnd() - 0.5) * jitter;
			const y = j * dy + (rnd() - 0.5) * jitter;
			if (Math.hypot(x, y) < RV + RP) out.push(v(x, y));
		}
	}
	return out;
}

const DOTS: Record<Id, Dot[]> = (() => {
	const rnd = mulberry32(16);
	const liquid = packing(1, 0.06);
	const solid = packing(2, 0.02, true);
	const gas: V[] = [];
	for (let n = 0; gas.length < 18 && n < 2000; n++) {
		const p = v((rnd() * 2 - 1) * RV, (rnd() * 2 - 1) * RV);
		if (Math.hypot(p.x, p.y) < RV - 0.1 && gas.every((q) => Math.hypot(q.x - p.x, q.y - p.y) > 0.75)) gas.push(p);
	}
	const pick = (xs: V[], share: number, k: 'b' | 'c', seed: number): Dot[] => {
		const r = mulberry32(seed);
		return xs.map((p) => ({ p, k: r() < share ? k : 'a' }));
	};
	return {
		distillata: liquid.map((p) => ({ p, k: 'a' as const })),
		salata: pick(liquid, 0.14, 'b', 3),
		olio: liquid.map((p) => ({ p, k: p.y > 0.05 ? ('b' as const) : ('a' as const) })),
		latte: liquid.map((p) => ({ p, k: Math.hypot(p.x - 1.3, p.y - 1.2) < 1.6 ? ('b' as const) : ('a' as const) })),
		aria: gas.map((p, i) => ({ p, k: i % 5 === 2 ? ('c' as const) : ('a' as const) })),
		ottone: pick(solid, 0.35, 'c', 40).map((d) => ({ ...d, k: d.k === 'a' ? ('b' as const) : d.k })),
		granito: solid.map((p) => ({ p, k: p.x + 0.4 * p.y < -0.3 ? ('a' as const) : p.y > 0.5 ? ('b' as const) : ('c' as const) })),
		rame: solid.map((p) => ({ p, k: 'b' as const })),
	};
})();

/** Droplets of fat in milk, and the grains of granite, under the microscope. */
const DROPLETS = (() => {
	const rnd = mulberry32(5);
	const out: { p: V; r: number }[] = [];
	for (let n = 0; out.length < 26 && n < 4000; n++) {
		const r = 0.08 + rnd() * 0.24;
		const p = v((rnd() * 2 - 1) * RV, (rnd() * 2 - 1) * RV);
		if (Math.hypot(p.x, p.y) < RV && out.every((q) => Math.hypot(q.p.x - p.x, q.p.y - p.y) > q.r + r + 0.08)) out.push({ p, r });
	}
	return out;
})();
const GRAINS = (() => {
	const rnd = mulberry32(9);
	const n = 6, step = (2 * RV + 0.6) / n, x0 = -RV - 0.3;
	const pts: V[][] = [];
	for (let j = 0; j <= n; j++) {
		pts.push([]);
		for (let i = 0; i <= n; i++) {
			const edge = i === 0 || j === 0 || i === n || j === n;
			pts[j].push(v(x0 + i * step + (edge ? 0 : (rnd() - 0.5) * step * 0.7), x0 + j * step + (edge ? 0 : (rnd() - 0.5) * step * 0.7)));
		}
	}
	const cells: { pts: V[]; c: string }[] = [];
	for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) cells.push({ pts: [pts[j][i], pts[j][i + 1], pts[j + 1][i + 1], pts[j + 1][i]], c: GRANITE[Math.floor(rnd() * 3)] });
	return cells;
})();
/** Speckles of granite seen with the naked eye. */
const SPECKLES = (() => {
	const rnd = mulberry32(12);
	return Array.from({ length: 70 }, () => ({ p: v(-1.5 + rnd() * 3, -1.35 + rnd() * 2.5), r: 0.04 + rnd() * 0.07, c: GRANITE[1 + Math.floor(rnd() * 2)] }));
})();

// ---------------------------------------------------------------------------- the three views

const box = (x0: number, y0: number, x1: number, y1: number) => f.path([v(x0, y0), v(x1, y0), v(x1, y1), v(x0, y1)], true);
/** Where the next level looks, at the naked eye. */
const LOOK: Record<Id, V> = { distillata: v(0.2, -0.6), salata: v(0.2, -0.6), olio: v(0, -0.1), latte: v(0.2, -0.6), aria: v(0.1, 0), ottone: v(0.2, -0.2), granito: v(0.1, -0.2), rame: v(0.2, -0.2) };

function EyeView({ id }: { id: Id }) {
	const beaker = (fills: [number, number, string][]) => (
		<>
			{fills.map(([y0, y1, c], i) => (
				<path key={i} d={box(-1.3, y0, 1.3, y1)} fill={c} stroke="none" />
			))}
			<path d={f.path([v(-1.3, fills[fills.length - 1][1]), v(1.3, fills[fills.length - 1][1])])} stroke="#000" strokeWidth={THIN} />
			{fills.length > 1 && <path d={f.path([v(-1.3, fills[0][1]), v(1.3, fills[0][1])])} stroke="#000" strokeWidth={THIN} />}
			<path d={f.path([v(-1.3, 1.7), v(-1.3, -1.6), v(1.3, -1.6), v(1.3, 1.7)])} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
		</>
	);
	const block = (fill: string) => <path d={box(-1.6, -1.4, 1.6, 1.2)} fill={fill} stroke="#000" strokeWidth={THICK} />;
	let body;
	if (id === 'distillata' || id === 'salata') body = beaker([[-1.6, 0.8, LIQUID.acqua]]);
	else if (id === 'olio') body = beaker([[-1.6, -0.1, LIQUID.acqua], [-0.1, 0.8, LIQUID.olio]]);
	else if (id === 'latte') body = beaker([[-1.6, 0.8, MILK]]);
	else if (id === 'aria')
		body = (
			<>
				<path d={box(-1.1, -1.6, 1.1, 1.3)} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={box(-0.45, 1.3, 0.45, 1.75)} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={box(-0.55, 1.75, 0.55, 1.95)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			</>
		);
	else if (id === 'ottone') body = block(BRASS);
	else if (id === 'rame') body = block(COPPER);
	else
		body = (
			<>
				{block(GRANITE[0])}
				{SPECKLES.map((s, i) => {
					const q = f.px(s.p);
					return <circle key={i} cx={q.x} cy={q.y} r={s.r * PXCM} fill={s.c} />;
				})}
			</>
		);
	const q = f.px(LOOK[id]);
	return (
		<g>
			{body}
			<circle cx={q.x} cy={q.y} r={0.3 * PXCM} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
		</g>
	);
}

function Field({ clip, children }: { clip: string; children: ReactNode }) {
	const c = f.px(v(0, 0));
	return (
		<g>
			<g clipPath={`url(#${clip})`}>{children}</g>
			<circle cx={c.x} cy={c.y} r={RV * PXCM} fill="none" stroke="#000" strokeWidth={THICK} />
		</g>
	);
}

function MicroView({ id, clip }: { id: Id; clip: string }) {
	const all = box(-RV, -RV, RV, RV);
	let body;
	if (id === 'distillata' || id === 'salata') body = <path d={all} fill={LIQUID.acqua} />;
	else if (id === 'olio')
		body = (
			<>
				<path d={box(-RV, -RV, RV, 0.05)} fill={LIQUID.acqua} />
				<path d={box(-RV, 0.05, RV, RV)} fill={LIQUID.olio} />
				<path d={f.path([v(-RV, 0.05), v(RV, 0.05)])} stroke="#000" strokeWidth={THIN} />
			</>
		);
	else if (id === 'latte')
		body = (
			<>
				<path d={all} fill={MILK} />
				{DROPLETS.map((d, i) => {
					const q = f.px(d.p);
					return <circle key={i} cx={q.x} cy={q.y} r={d.r * PXCM} fill={FAT} stroke="#000" strokeWidth={THIN * 0.7} />;
				})}
			</>
		);
	else if (id === 'aria') body = <path d={all} fill="#fff" />;
	else if (id === 'ottone') body = <path d={all} fill={BRASS} />;
	else if (id === 'rame') body = <path d={all} fill={COPPER} />;
	else body = GRAINS.map((g, i) => <path key={i} d={f.path(g.pts, true)} fill={g.c} stroke="#000" strokeWidth={THIN * 0.7} />);
	const c = f.px(v(0, 0));
	return (
		<Field clip={clip}>
			{body}
			<rect x={c.x - 0.3 * PXCM} y={c.y - 0.3 * PXCM} width={0.6 * PXCM} height={0.6 * PXCM} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
		</Field>
	);
}

function ParticleView({ id, clip }: { id: Id; clip: string }) {
	return (
		<Field clip={clip}>
			<path d={box(-RV, -RV, RV, RV)} fill="#fff" />
			{DOTS[id].map((d, i) => {
				const q = f.px(d.p);
				return <circle key={i} cx={q.x} cy={q.y} r={RP * PXCM} fill={PARTICLE[d.k]} stroke="#000" strokeWidth={THIN} />;
			})}
		</Field>
	);
}

// ---------------------------------------------------------------------------- the figure

export default function MiscuglioIngrandisci({ alt }: { alt?: string }) {
	const clip = `ingrandisci-${useId().replace(/:/g, '')}`;
	const [index, setIndex] = useState(0);
	const [level, setLevel] = useState<Level>('occhio');
	const [prev, setPrev] = useState<Level>('occhio');
	const [z, goZ, zooming] = useTween(1, 700);
	const [answers, setAnswers] = useState<Partial<Record<Id, Kind>>>({});
	const s = SAMPLES[index];
	const answer = answers[s.id];

	const order = (l: Level) => LEVELS.findIndex((x) => x.value === l);
	const toLevel = (l: Level) => {
		if (l === level) return;
		setPrev(level);
		setLevel(l);
		void goZ(0, 0).then(() => goZ(1));
	};
	const toSample = (i: number) => {
		setIndex((i + SAMPLES.length) % SAMPLES.length);
		setPrev('occhio');
		setLevel('occhio');
		void goZ(1, 0);
	};

	// Zooming in, the old view grows by 3 and fades, the new one grows from 1/3; zooming out, the reverse.
	const inward = order(level) > order(prev);
	const c = f.px(v(0, 0));
	// The naked-eye view zooms on its dashed ring: the ring's centre slides to the middle while the view grows.
	const a = f.px(LOOK[s.id]);
	const layer = (l: Level, scale: number, opacity: number, toward: number) => {
		const m = l === 'occhio' ? { x: c.x + (a.x - c.x) * toward, y: c.y + (a.y - c.y) * toward } : c;
		return (
			<g key={l} transform={`translate(${c.x} ${c.y}) scale(${scale}) translate(${-m.x} ${-m.y})`} opacity={opacity}>
				{l === 'occhio' ? <EyeView id={s.id} /> : l === 'microscopio' ? <MicroView id={s.id} clip={clip} /> : <ParticleView id={s.id} clip={clip} />}
			</g>
		);
	};
	const done = z >= 1 - 1e-6;
	const k = inward ? 3 : 1 / 3;

	const score = SAMPLES.filter((x) => answers[x.id] === x.kind).length;
	const answered = SAMPLES.filter((x) => answers[x.id]).length;
	let caption: string;
	if (!answer) caption = `${s.what[0].toUpperCase()}${s.what.slice(1)}, ${LEVEL_TEXT[level]}. Guarda da più vicino, poi decidi che cos'è.`;
	else if (answer === s.kind) caption = `Giusto, ${s.kind === 'pura' ? 'è una sostanza pura' : 'è un ' + KIND_TEXT[s.kind].toLowerCase()}: ${s.why}`;
	else caption = `Non è così, ${s.kind === 'pura' ? 'è una sostanza pura' : 'è un ' + KIND_TEXT[s.kind].toLowerCase()}: ${s.why}`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<clipPath id={clip}>
						<circle cx={c.x} cy={c.y} r={RV * PXCM} />
					</clipPath>
				</defs>
				<g transform={`translate(${c.x} ${c.y}) scale(${ZOOM}) translate(${-c.x} ${-c.y})`}>
					{!done && layer(prev, 1 + (k - 1) * z, 1 - z, z)}
					{layer(level, done ? 1 : 1 / k + (1 - 1 / k) * z, done ? 1 : z, done ? 0 : 1 - z)}
				</g>
			</Drawing>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex items-center justify-center gap-2">
					<ZoomIn className="size-4 text-fg-muted" aria-hidden="true" />
					<ToggleGroup label="Ingrandimento" options={LEVELS} value={level} onChange={(l) => !zooming && toLevel(l)} />
				</div>
				<ButtonRow>
					{(['pura', 'omogeneo', 'eterogeneo'] as Kind[]).map((kk) => (
						<Button
							key={kk}
							variant={answer === kk ? 'primary' : 'secondary'}
							size="sm"
							onClick={() => setAnswers((a) => ({ ...a, [s.id]: kk }))}
						>
							{KIND_TEXT[kk]}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					<Button variant="ghost" size="sm" onClick={() => toSample(index - 1)}>
						<ChevronLeft className="size-4" aria-hidden="true" />
						Precedente
					</Button>
					<span className="self-center text-sm text-fg-muted">{`Giusti: ${score} su ${answered}`}</span>
					<Button variant="ghost" size="sm" onClick={() => toSample(index + 1)}>
						Successivo
						<ChevronRight className="size-4" aria-hidden="true" />
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
