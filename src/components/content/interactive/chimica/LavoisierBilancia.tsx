'use client';

import { useState } from 'react';
import { Play, RotateCcw, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, lerp, dist, useFrameLoop, useReducedMotion, THICK, THIN, TINT, type V } from '../kit';
import { LIQUID } from '../fisica/liquidi';

/**
 * Lesson 23 (La legge di Lavoisier): a flask of vinegar on an electronic balance, with the baking soda on a weighing
 * boat beside it and, for the closed flask, the stopper: everything is on the pan from the start. "Versa il
 * bicarbonato" carries the powder into the flask (and puts the stopper in), then the reaction plays for about four
 * seconds: bubbles in the vinegar, the heap shrinking, the carbon dioxide formed growing as 1 - (1 - r)² towards
 * m(CO₂) = m(NaHCO₃) · 44,01 / 84,01. With the flask open the gas leaves as it forms and the reading drops; closed, the
 * gas stays in the flask and the reading does not move until "Togli il tappo". The vinegar (20 g, 6 % acetic acid) is
 * always in excess; the baking soda stays below 0,5 g, because the gas in a closed flask raises the pressure. The CO₂
 * that stays dissolved in the vinegar is neglected.
 */

type Mode = 'aperta' | 'chiusa';
const CO2_PER_G = 44.01 / 84.01; // g of CO₂ from 1 g of NaHCO₃ (lesson 01 masses)
const FLASK = 145.3, VINEGAR = 20.0, BOAT = 1.85, STOPPER = 4.6;
const PLAY = 5; // seconds, from the pouring to the end of the reaction
const POUR = 0.15, CAP = 0.25; // fractions of the play: powder carried until POUR, stopper put in until CAP

const PAN = 0.95; // the pan's top
const NECK = 2.75, TOP = 3.55, LEVEL = 1.55; // the flask's shoulder, rim and the vinegar's surface
const f = frame(-0.2, 5.7, -1.0, 5.1);

// The flask's walls: a cone from the base (0.55 to 2.95) to the neck (1.45 to 2.05).
const wallL = (y: number) => 0.55 + (0.9 * (Math.min(y, NECK) - PAN)) / (NECK - PAN);
const wallR = (y: number) => 2.95 - (0.9 * (Math.min(y, NECK) - PAN)) / (NECK - PAN);
const FLASK_PATH: V[] = [v(1.45, TOP), v(1.45, NECK), v(0.55, PAN), v(2.95, PAN), v(2.05, NECK), v(2.05, TOP)];

/** A point along a polyline, u from 0 to 1 by length. */
function along(ps: V[], u: number): V {
	const lens = ps.slice(1).map((p, i) => dist(ps[i], p));
	let d = Math.min(1, Math.max(0, u)) * lens.reduce((a, b) => a + b, 0);
	for (let i = 0; i < lens.length; i++) {
		if (d <= lens[i] || i === lens.length - 1) return lerp(ps[i], ps[i + 1], lens[i] ? Math.min(1, d / lens[i]) : 1);
		d -= lens[i];
	}
	return ps[ps.length - 1];
}
const POWDER_PATH = [v(3.7, 1.1), v(3.7, 4.15), v(1.75, 4.15), v(1.75, 1.05)];
const STOPPER_PATH = [v(4.75, PAN), v(4.75, 4.0), v(1.75, 4.0), v(1.75, 3.3)];

/** A fixed scatter of points, the same on the server and in the browser. */
const rand = (i: number, k: number) => {
	const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
	return x - Math.floor(x);
};
const frac = (x: number) => x - Math.floor(x);

/** A heap of powder at `at` (the middle of its base), `w` wide. */
function Heap({ at, w }: { at: V; w: number }) {
	if (w < 0.03) return null;
	const h = w * 0.38;
	const d = `${f.path([v(at.x - w / 2, at.y)])} Q${f.px(v(at.x, at.y + 2 * h)).x},${f.px(v(at.x, at.y + 2 * h)).y} ${f.px(v(at.x + w / 2, at.y)).x},${f.px(v(at.x + w / 2, at.y)).y} Z`;
	return <path d={d} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />;
}

/** The stopper, its lower face centred on `at`. */
function Stopper({ at }: { at: V }) {
	return <path d={f.path([v(at.x - 0.24, at.y), v(at.x + 0.24, at.y), v(at.x + 0.36, at.y + 0.38), v(at.x - 0.36, at.y + 0.38)], true)} fill={TINT.orange} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />;
}

const grams = (x: number) => `${x.toFixed(2).replace('.', ',')} g`;
const texG = (x: number) => `${x.toFixed(2).replace('.', '{,}')}\\,\\text{g}`;

export default function LavoisierBilancia({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('aperta');
	const [mb, setMb] = useState(0.4);
	const [p, setP] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [q, setQ] = useState(0);
	const [opening, setOpening] = useState(false);
	const reduced = useReducedMotion();

	const closed = mode === 'chiusa';
	const gasMax = mb * CO2_PER_G;
	const m0 = FLASK + VINEGAR + BOAT + mb + (closed ? STOPPER : 0);
	const r = Math.min(1, Math.max(0, (p - CAP) / (1 - CAP)));
	const formed = gasMax * (1 - (1 - r) ** 2);
	const escaped = closed ? gasMax * q : formed;
	const reading = m0 - escaped;
	const done = p >= 1 - 1e-9;
	const started = p > 0 || playing;

	const reset = () => {
		setPlaying(false);
		setOpening(false);
		setP(0);
		setQ(0);
	};
	useFrameLoop(playing, (dt) => {
		const next = Math.min(1, p + dt / PLAY);
		setP(next);
		if (next >= 1) setPlaying(false);
	});
	useFrameLoop(opening, (dt) => {
		const next = Math.min(1, q + dt / 1.5);
		setQ(next);
		if (next >= 1) setOpening(false);
	});
	const start = () => {
		if (reduced) setP(1);
		else setPlaying(true);
	};
	const uncap = () => {
		if (reduced) setQ(1);
		else setOpening(true);
	};

	// Where the powder and the stopper are now.
	const pour = Math.min(1, p / POUR);
	const powderAt = along(POWDER_PATH, pour);
	const cap = closed ? Math.min(1, Math.max(0, (p - POUR) / (CAP - POUR))) : 0;
	const stopperAt = closed ? (q > 0 ? along([...STOPPER_PATH].reverse(), q) : along(STOPPER_PATH, cap)) : null;
	const heapW = 0.75 * Math.sqrt(mb / 0.5);

	// Bubbles in the vinegar while it reacts, rising from the heap; gas above the neck while it leaves.
	const reacting = r > 0 && r < 1;
	const rate = reacting ? 1 - r : 0;
	const bubbles = Array.from({ length: Math.round(12 * rate) }, (_, i) => {
		const y = PAN + 0.12 + frac(rand(i, 1) + p * 5) * (LEVEL - PAN - 0.2);
		const x = 1.75 + (rand(i, 2) - 0.5) * (wallR(y) - wallL(y) - 0.4);
		return v(x, y);
	});
	const leaving = closed ? opening : reacting;
	const outside = leaving
		? Array.from({ length: 8 }, (_, i) => {
				const s = frac(rand(i, 3) + (closed ? q * 2 : p * 4));
				return { at: v(1.75 + (rand(i, 4) - 0.5) * 0.4 + s * (rand(i, 5) - 0.3) * 1.2, TOP + 0.1 + s * 1.3), o: 1 - s };
			})
		: [];
	// Closed: the gas kept in the flask, as dots in the space above the vinegar.
	const kept = closed ? Math.round((26 * (formed - escaped)) / (0.5 * CO2_PER_G)) : 0;
	const inside = Array.from({ length: kept }, (_, i) => {
		const y = LEVEL + 0.15 + rand(i, 6) * (3.2 - LEVEL - 0.15);
		const x = wallL(y) + 0.1 + rand(i, 7) * (wallR(y) - wallL(y) - 0.2);
		return v(x, y);
	});

	let caption: string;
	if (!started) caption = closed ? 'Sulla bilancia ci sono la beuta con l’aceto, il vetrino con il bicarbonato e il tappo. Premi «Versa il bicarbonato»: la beuta verrà chiusa subito dopo.' : 'Sulla bilancia ci sono la beuta con l’aceto e il vetrino con il bicarbonato. Premi «Versa il bicarbonato».';
	else if (!done) caption = closed ? 'Il bicarbonato reagisce con l’aceto: il diossido di carbonio che si forma resta chiuso nella beuta, e la bilancia segna sempre la stessa massa.' : 'Il bicarbonato reagisce con l’aceto: il diossido di carbonio che si forma esce dalla beuta, e la bilancia segna sempre meno.';
	else if (!closed) caption = `Reazione finita: la bilancia segna ${grams(gasMax)} in meno, la massa del gas uscito nell’aria. La massa totale non è cambiata, ma una parte non è più sul piatto.`;
	else if (q === 0) caption = `Reazione finita: con la beuta chiusa la bilancia segna ancora ${grams(m0)}, come prima: il gas che si è formato, ${grams(gasMax)}, è rimasto nella beuta. Prova a togliere il tappo.`;
	else if (q < 1) caption = 'Il tappo è tolto: il gas esce dalla beuta, e la bilancia comincia a scendere.';
	else caption = `Tolto il tappo, il gas è uscito e la bilancia segna ${grams(gasMax)} in meno: la massa del diossido di carbonio che si era formato.`;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the balance: body, display, pan */}
				<path d={f.path([v(0, -0.85), v(5.5, -0.85), v(5.5, 0.8), v(0, 0.8)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(2.1, -0.6), v(4.6, -0.6), v(4.6, 0.45), v(2.1, 0.45)], true)} fill="#fff" stroke="#000" strokeWidth={THIN} />
				<text x={f.px(v(4.45, -0.08)).x} y={f.px(v(4.45, -0.08)).y} dy="0.35em" textAnchor="end" fontSize={20} fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fill="#000">
					{grams(reading)}
				</text>
				<path d={f.path([v(0.2, 0.8), v(5.3, 0.8), v(5.3, PAN), v(0.2, PAN)], true)} fill="#fff" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />

				{/* the vinegar, the heap on the bottom, the bubbles */}
				<path d={f.path([v(wallL(PAN) + 0.03, PAN + 0.03), v(wallR(PAN) - 0.03, PAN + 0.03), v(wallR(LEVEL), LEVEL), v(wallL(LEVEL), LEVEL)], true)} fill={LIQUID.acqua} stroke="none" />
				<path d={f.path([v(wallL(LEVEL), LEVEL), v(wallR(LEVEL), LEVEL)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{pour >= 1 && <Heap at={v(1.75, PAN + 0.03)} w={heapW * Math.sqrt(1 - r)} />}
				{bubbles.map((b, i) => (
					<circle key={i} cx={f.px(b).x} cy={f.px(b).y} r={2.4} fill="none" stroke="#000" strokeWidth={THIN} />
				))}
				{inside.map((b, i) => (
					<circle key={i} cx={f.px(b).x} cy={f.px(b).y} r={1.6} fill="#808080" />
				))}
				<path d={f.path(FLASK_PATH)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<path d={`${f.path([v(1.35, TOP), v(1.45, TOP)])} ${f.path([v(2.05, TOP), v(2.15, TOP)])}`} stroke="#000" strokeWidth={THICK} fill="none" />

				{/* the weighing boat and its powder, the powder on its way, the stopper */}
				<path d={f.path([v(3.2, 1.12), v(3.35, PAN + 0.02), v(4.05, PAN + 0.02), v(4.2, 1.12)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				{p === 0 && <Heap at={v(3.7, PAN + 0.03)} w={heapW} />}
				{p > 0 && pour < 1 && <Heap at={powderAt} w={heapW * 0.8} />}
				{stopperAt && <Stopper at={stopperAt} />}
				{outside.map((b, i) => (
					<circle key={i} cx={f.px(b.at).x} cy={f.px(b.at).y} r={1.8} fill="#808080" opacity={b.o} />
				))}
			</Drawing>

			<Readout>
				<Tex>{`m_{\\text{iniziale}} = ${texG(m0)}`}</Tex>
				<Tex>{`m_{\\text{ora}} = ${texG(reading)}`}</Tex>
				<Tex>{`\\text{gas formato} = ${texG(formed)}`}</Tex>
				<Tex>{`\\text{gas uscito} = ${texG(escaped)}`}</Tex>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="La beuta"
						options={[
							{ value: 'aperta', label: 'Beuta aperta' },
							{ value: 'chiusa', label: 'Beuta chiusa' },
						]}
						value={mode}
						onChange={(m: Mode) => {
							setMode(m);
							reset();
						}}
					/>
				</div>
				<Slider
					label="Bicarbonato (g)"
					value={mb}
					min={0.1}
					max={0.5}
					step={0.05}
					onChange={(x) => {
						setMb(x);
						reset();
					}}
				/>
				<ButtonRow>
					{!done && (
						<Button variant="secondary" size="sm" disabled={started} onClick={start}>
							<Play className="size-4" aria-hidden="true" />
							Versa il bicarbonato
						</Button>
					)}
					{done && closed && q === 0 && (
						<Button variant="secondary" size="sm" onClick={uncap}>
							<Unplug className="size-4" aria-hidden="true" />
							Togli il tappo
						</Button>
					)}
					{done && (
						<Button variant="secondary" size="sm" disabled={opening} onClick={reset}>
							<RotateCcw className="size-4" aria-hidden="true" />
							Ricomincia
						</Button>
					)}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
