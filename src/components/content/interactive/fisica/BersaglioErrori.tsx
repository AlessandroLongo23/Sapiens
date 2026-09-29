'use client';

import { useRef, useState } from 'react';
import { RotateCcw, Target as TargetIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ButtonRow, Caption, Controls, Drawing, Figure, frame, INK, Readout, Tex, texNum, THICK, THIN, v, type Frame, type V } from '../kit';
import { QTY } from '../fisica';

/**
 * Lesson "Errori casuali ed errori sistematici" (fis-errori-misura), section "Precisione e accuratezza": a target
 * drawn like `bersagli-precisione-accuratezza` (rings of radius 1, 0.65 and 0.3 there, scaled up here), on which the
 * student fires shots one or ten at a time. Each shot is the target's centre, plus the systematic error (always the
 * same displacement, up and to the right), plus the random error (a normal draw scaled by the second slider). The
 * draws are kept, so moving a slider moves the cloud that is already there: the systematic slider shifts it, the
 * random one spreads it. An orange cross marks the mean of the shots.
 *
 * `Target` and `Hit` are also the drawing of the exercises' scene `bersaglio` (exercises/scenes/Bersaglio.tsx).
 */

/** Radii of the rings, in centimetres, for a target of outer radius R. */
export const RINGS = [1, 0.65, 0.3];

/** The rings of a target centred at `c` with outer radius `R`, and the small cross at the centre. */
export function Target({ f, c = v(0, 0), R = 1 }: { f: Frame; c?: V; R?: number }) {
	const p = f.px(c);
	const k = f.W / (f.x1 - f.x0);
	const arm = 0.08 * (R / 1) * k;
	return (
		<g pointerEvents="none">
			{RINGS.map((r, i) => (
				<circle key={r} cx={p.x} cy={p.y} r={r * R * k} fill="none" stroke="#000" strokeWidth={i === 0 ? THICK : THIN} />
			))}
			<path d={`M${p.x - arm},${p.y} H${p.x + arm} M${p.x},${p.y - arm} V${p.y + arm}`} stroke={INK.gray} strokeWidth={THIN} />
		</g>
	);
}

/** One shot, as `\fill[blue] (P) circle (1.5pt);`. */
export function Hit({ f, at }: { f: Frame; at: V }) {
	const p = f.px(at);
	return <circle cx={p.x} cy={p.y} r={3.2} fill={INK.blue} pointerEvents="none" />;
}

/** The mean of the shots: an orange cross. */
function MeanMark({ f, at }: { f: Frame; at: V }) {
	const p = f.px(at);
	const a = 7;
	return <path d={`M${p.x - a},${p.y - a} L${p.x + a},${p.y + a} M${p.x - a},${p.y + a} L${p.x + a},${p.y - a}`} stroke={QTY.risultante} strokeWidth={1.8} strokeLinecap="round" opacity={0.9} pointerEvents="none" />;
}

const R = 2; // outer ring, cm
const f = frame(-2.5, 2.5, -2.5, 2.5);
const DIR = v(Math.cos((40 * Math.PI) / 180), Math.sin((40 * Math.PI) / 180));
const MAX = 200;
const SEED = 20260929;

/** A small seeded generator (mulberry32), so the figure looks the same every time it opens. */
function makeRandom(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** A pair of independent standard normal numbers (Box-Muller). */
function normalPair(rand: () => number): V {
	const u = Math.max(rand(), 1e-12);
	const w = rand();
	const r = Math.sqrt(-2 * Math.log(u));
	return v(r * Math.cos(2 * Math.PI * w), r * Math.sin(2 * Math.PI * w));
}

export default function BersaglioErrori({ alt }: { alt?: string }) {
	const [sys, setSys] = useState(0);
	const [cas, setCas] = useState(0.15);
	// The figure opens with ten shots already fired, always the same ones; the generator goes on from there.
	const [start] = useState(() => {
		const r = makeRandom(SEED);
		return { r, first: Array.from({ length: 10 }, () => normalPair(r)) };
	});
	const rand = useRef(start.r);
	const [draws, setDraws] = useState<V[]>(start.first);

	const fire = (k: number) => {
		const more = Array.from({ length: k }, () => normalPair(rand.current));
		setDraws((d) => [...d, ...more].slice(-MAX));
	};
	const reset = () => setDraws([]);

	const shots = draws.map((z) => v(DIR.x * sys + z.x * cas, DIR.y * sys + z.y * cas));
	const n = shots.length;
	const mean = n ? v(shots.reduce((s, p) => s + p.x, 0) / n, shots.reduce((s, p) => s + p.y, 0) / n) : null;
	const off = mean ? Math.hypot(mean.x, mean.y) : 0;
	const spread = mean ? shots.reduce((s, p) => s + Math.hypot(p.x - mean.x, p.y - mean.y), 0) / n : 0;
	const precise = spread < 0.3;
	const accurate = off < 0.3;
	const verdict = precise && accurate ? 'precisi e accurati' : precise ? 'precisi, ma non accurati' : accurate ? 'accurati, ma non precisi' : 'né precisi né accurati';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Target f={f} R={R} />
				{shots.map((p, i) => (
					<Hit key={i} f={f} at={p} />
				))}
				{mean && n >= 2 && <MeanMark f={f} at={mean} />}
			</Drawing>
			<Readout>
				<span>colpi: {n}</span>
				{n >= 2 && (
					<>
						<span>
							media a <Tex>{`${texNum(off)}\\,\\text{cm}`}</Tex> dal centro
						</span>
						<span>
							colpi a <Tex>{`${texNum(spread)}\\,\\text{cm}`}</Tex> dalla media, in media
						</span>
					</>
				)}
			</Readout>
			<Caption>
				{n < 5
					? 'Spara almeno cinque colpi: ogni colpo è una misura, il centro del bersaglio è il valore vero.'
					: `Colpi ${verdict}. L'errore sistematico sposta la nuvola e la sua media; l'errore casuale la allarga, ma la media resta dove la mette l'errore sistematico.`}
			</Caption>
			<Controls>
				<Slider label="Errore sistematico" value={sys} min={0} max={1} step={0.1} unit="cm" onChange={setSys} />
				<Slider label="Errore casuale" value={cas} min={0} max={0.5} step={0.05} unit="cm" onChange={setCas} />
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => fire(1)}>
						<TargetIcon className="size-4" aria-hidden="true" />
						Spara un colpo
					</Button>
					<Button variant="secondary" size="sm" onClick={() => fire(10)}>
						<TargetIcon className="size-4" aria-hidden="true" />
						Spara 10 colpi
					</Button>
					<Button variant="secondary" size="sm" disabled={n === 0} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
