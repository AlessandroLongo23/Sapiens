'use client';

import { useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, useFrameLoop, useReducedMotion, THICK, THIN, DASH } from '../kit';
import { Liquid, Surface, Vessel } from '../fisica/liquidi';
import { Words } from '../fisica/calore';

/**
 * Lesson 18 (Metodi di separazione dei miscugli), "Cromatografia": a strip of paper hangs from a rod in a beaker, its
 * lower edge in the solvent, with a drop of ink on the pencil start line. The student picks the ink (black, green,
 * brown) and starts the run: the solvent front climbs as the square root of the time, as a liquid rising in paper
 * does (a hand-written law, no simulation: d = 8,0 cm · √(t / 15 min)), and each dye of the ink climbs with it at the
 * fixed fraction R_f of the front's distance, so the spots separate. The readout gives the front's distance, each
 * spot's distance and its R_f.
 *
 * The R_f values are made up for the figure (the lesson says R_f depends on the paper and the solvent). The strip is
 * drawn in a second SVG over the drawing, left out of the dark theme's inversion: paper is white and dyes keep their
 * colours on both backgrounds, as they would on a real strip.
 */

type Ink = 'nero' | 'verde' | 'marrone';
const INKS: Record<Ink, { spot: string; dyes: { nome: string; rf: number; css: string }[] }> = {
	nero: {
		spot: '#333333',
		dyes: [
			{ nome: 'giallo', rf: 0.75, css: '#e0b000' },
			{ nome: 'rosso', rf: 0.45, css: '#d6246e' },
			{ nome: 'blu', rf: 0.25, css: '#2a5bd7' },
		],
	},
	verde: {
		spot: '#1f7a3a',
		dyes: [
			{ nome: 'giallo', rf: 0.7, css: '#e0b000' },
			{ nome: 'blu', rf: 0.3, css: '#2a5bd7' },
		],
	},
	marrone: {
		spot: '#6b3a1f',
		dyes: [
			{ nome: 'arancione', rf: 0.62, css: '#f07f13' },
			{ nome: 'rosso', rf: 0.4, css: '#d11f2a' },
			{ nome: 'blu', rf: 0.18, css: '#2a5bd7' },
		],
	},
};

const D_MAX = 8.0; // cm reached by the front at the end
const T_END = 15; // min
const PLAY = 10; // s of animation for the whole run
const S = 0.42; // drawing cm per real cm of the strip

// Beaker 0..2.4, solvent up to 0.5; strip from x 0.85 to 1.55, start line 0.8.
const BW = 2.4, BH = 4.6, SOLV = 0.5, START = 0.8, X0 = 0.85, X1 = 1.55, TOP = 4.75;
const f = frame(-0.4, 4.9, -0.3, 5.1);
const y = (d: number) => START + d * S;
/** One decimal, always written (8,0 cm), as a measure on the strip. */
const fix1 = (x: number) => x.toFixed(1).replace('.', ',');

export default function CromatografiaCarta({ alt }: { alt?: string }) {
	const [ink, setInk] = useState<Ink>('nero');
	const [t, setT] = useState(0);
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();
	const front = D_MAX * Math.sqrt(t / T_END);
	const started = t > 0;
	const I = INKS[ink];

	useFrameLoop(playing, (dt) => {
		const next = Math.min(T_END, t + (dt * T_END) / PLAY);
		setT(next);
		if (next >= T_END) setPlaying(false);
	});
	const play = () => {
		if (playing) return setPlaying(false);
		if (reduced) return setT(t >= T_END ? 0 : T_END);
		if (t >= T_END) setT(0);
		setPlaying(true);
	};

	// A dye leaves the drop only once the front has passed the start line: the paper under it is wet.
	const spots = I.dyes.map((d) => ({ ...d, dist: d.rf * front }));
	const wetTop = y(front);
	const px = (x: number, yy: number) => f.px(v(x, yy));
	const rect = (x0: number, y0: number, x1: number, y1: number) => {
		const a = px(x0, y1), b = px(x1, y0);
		return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
	};

	return (
		<Figure>
			<div className="relative max-w-full">
				<Drawing f={f} label={alt}>
					<Liquid f={f} pts={[v(0.05, 0.05), v(BW - 0.05, 0.05), v(BW - 0.05, SOLV), v(0.05, SOLV)]} />
					<Surface f={f} from={v(0.05, SOLV)} to={v(BW - 0.05, SOLV)} />
					<Vessel f={f} pts={[v(-0.1, BH + 0.1), v(0, BH), v(0, 0), v(BW, 0), v(BW, BH), v(BW + 0.1, BH + 0.1)]} />
					{/* the rod the strip hangs from */}
					<path d={f.path([v(-0.25, TOP), v(BW + 0.25, TOP)])} stroke="#000" strokeWidth={THICK * 2.2} strokeLinecap="round" />
					{/* the distances, once the run has started */}
					{started && (
						<g pointerEvents="none">
							<path d={f.path([v(X1 + 0.05, wetTop), v(3.0, wetTop)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
							<path d={f.path([v(X1 + 0.05, START), v(3.0, START)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
							<path d={f.path([v(2.85, START), v(2.85, wetTop)])} stroke="#000" strokeWidth={THIN} fill="none" />
							<Words f={f} at={v(3.05, (START + wetTop) / 2)} anchor="start" size={12}>
								{`${fix1(front)} cm`}
							</Words>
							<Words f={f} at={v(3.05, wetTop + 0.22)} anchor="start" size={11}>
								fronte
							</Words>
						</g>
					)}
					<Words f={f} at={v(3.05, START - 0.2)} anchor="start" size={11}>
						partenza
					</Words>
				</Drawing>
				{/* the strip itself, with the colours of the dyes, outside the dark theme's inversion */}
				<svg viewBox={`0 0 ${f.W.toFixed(1)} ${f.H.toFixed(1)}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
					<rect {...rect(X0, 0.25, X1, TOP)} fill="#ffffff" stroke="#555" strokeWidth={THIN * 1.5} />
					<rect {...rect(X0, 0.25, X1, Math.max(SOLV, wetTop))} fill="#dcecf7" />
					<path d={f.path([v(X0, START), v(X1, START)])} stroke="#777" strokeWidth={0.6} strokeDasharray="3 2" fill="none" />
					{started && <path d={f.path([v(X0, wetTop), v(X1, wetTop)])} stroke="#6a9fc8" strokeWidth={0.8} fill="none" />}
					{!started && <ellipse cx={px((X0 + X1) / 2, START).x} cy={px((X0 + X1) / 2, START).y} rx={6} ry={5} fill={I.spot} />}
					{started &&
						spots.map((s) => {
							const c = px((X0 + X1) / 2, y(s.dist));
							const grow = 1 + s.dist / D_MAX;
							return <ellipse key={s.nome} cx={c.x} cy={c.y} rx={6 + grow} ry={3.5 * grow} fill={s.css} opacity={0.85} />;
						})}
					<rect {...rect(X0, 0.25, X1, TOP)} fill="none" stroke="#555" strokeWidth={THIN * 1.5} />
				</svg>
			</div>

			<Readout>
				<span>tempo {num(t, 1)} min</span>
				<Tex>{`d_{\\text{solvente}} = ${fix1(front).replace(',', '{,}')}\\,\\text{cm}`}</Tex>
				{started &&
					spots.map((s) => (
						<Tex key={s.nome}>{`\\text{${s.nome}: } ${fix1(s.dist).replace(',', '{,}')}\\,\\text{cm},\\ R_f = ${s.rf.toFixed(2).replace(".", "{,}")}`}</Tex>
					))}
			</Readout>
			<Caption>
				{!started
					? 'La goccia d’inchiostro è sulla linea di partenza, a matita, appena sopra il solvente. Avvia la corsa.'
					: t < T_END
						? 'Il solvente sale lungo la carta, sempre più piano, e trascina i coloranti: ognuno percorre sempre la stessa frazione della distanza del solvente, il suo fattore di ritenzione.'
						: `Fine della corsa. L’inchiostro ${ink} conteneva ${spots.length} coloranti; quello che sale di più è il meno trattenuto dalla carta.`}
			</Caption>

			<Controls>
				<ToggleGroup
					label="Inchiostro"
					options={[
						{ value: 'nero', label: 'nero' },
						{ value: 'verde', label: 'verde' },
						{ value: 'marrone', label: 'marrone' },
					]}
					value={ink}
					onChange={(x) => {
						setPlaying(false);
						setT(0);
						setInk(x);
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={play}>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{playing ? 'Ferma' : t >= T_END ? 'Riparti' : t > 0 ? 'Continua' : 'Avvia'}
					</Button>
					<Button variant="secondary" size="sm" disabled={t === 0} onClick={() => { setPlaying(false); setT(0); }}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
