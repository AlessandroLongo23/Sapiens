'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, lerp, clamp, useFrameLoop, useReducedMotion, THICK, THIN, type V } from '../kit';
import { HALF, SIZE, WaterMolecule, type Water } from './acqua';

/**
 * Lesson 46 (L'acqua come solvente): a crystal of sodium chloride, 4 × 2 ions, on the bottom of a container of water.
 * "Sciogli" plays the dissolution in ten seconds, and a slider moves through it. The ions leave one at a time, in an
 * order computed once: each time the ion with the fewest neighbours still in the crystal (the corners first, the
 * bottom row, lying on the container, counting one more), and among those the highest. Each ion takes 20% of the
 * time to reach its place in the solution, while its shell of water molecules closes around it: five around Na⁺,
 * the oxygen towards the ion; six around Cl⁻, one hydrogen towards the ion. Once in the solution the ions wobble a
 * little. Only the water molecules of the shells are drawn: the free ones would hide the ions.
 *
 * Na⁺ violet!15 and Cl⁻ green!15, as the TikZ figure acqua-ioni-idratati of the lesson.
 */

const W = 7.6, H = 4.8;
const f = frame(-0.05, W + 0.05, -0.05, H + 0.05);
const FILL_NA = '#ecd9f2';
const FILL_CL = '#d9f2d9';
const R_NA = 0.15, R_CL = 0.24;
const GAP = 0.5;
const COLS = 4, ROWS = 2;
const S = 0.8; // the shells' molecules, smaller than in the other figures
const X0 = 3.8 - ((COLS - 1) * GAP) / 2, Y0 = 0.3;
const PLAY = 10; // seconds
const TRAVEL = 0.2; // share of the time an ion travels

type Ion = { na: boolean; site: V; order: number; target: V; phase: number };

/** The crystal, the order in which the ions leave, and where each one goes. */
function build(): Ion[] {
	const cells: { c: number; r: number; na: boolean }[] = [];
	for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) cells.push({ c, r, na: (c + r) % 2 === 0 });
	const left = new Set(cells.map((_, i) => i));
	const order: number[] = [];
	const nb = (i: number) => {
		const { c, r } = cells[i];
		let n = r === 0 ? 1 : 0;
		for (const j of left) if (Math.abs(cells[j].c - c) + Math.abs(cells[j].r - r) === 1) n++;
		return n;
	};
	while (left.size) {
		let best = -1;
		for (const i of left) {
			if (best < 0) best = i;
			else {
				const a = nb(i), b = nb(best);
				if (a < b || (a === b && (cells[i].r > cells[best].r || (cells[i].r === cells[best].r && cells[i].c < cells[best].c)))) best = i;
			}
		}
		order.push(best);
		left.delete(best);
	}
	// places in the solution: two rows high up, then the two low corners; the nearest to the crystal first
	const places: V[] = [v(1.0, 3.45), v(2.85, 3.55), v(4.75, 3.45), v(6.6, 3.55), v(0.95, 1.55), v(2.45, 2.0), v(5.15, 2.0), v(6.65, 1.55)];
	places.sort((a, b) => Math.hypot(a.x - 3.8, a.y - 0.8) - Math.hypot(b.x - 3.8, b.y - 0.8));
	return cells.map((cell, i) => {
		const k = order.indexOf(i);
		return { na: cell.na, site: v(X0 + cell.c * GAP, Y0 + cell.r * GAP), order: k, target: places[k], phase: i * 1.7 };
	});
}
const IONS = build();
const N = IONS.length;

/** The shell of an ion at P, closed by q (0 far and faint, 1 in place), turned by `spin`. */
function shell(P: V, na: boolean, q: number, spin: number): Water[] {
	const n = na ? 5 : 6;
	const out: Water[] = [];
	for (let k = 0; k < n; k++) {
		const a = spin + (2 * Math.PI * k) / n;
		const u = v(Math.cos(a), Math.sin(a));
		const far = (1 - q) * 0.45;
		if (na) {
			// the oxygen towards the ion, the hydrogens outwards
			const d = R_NA + (SIZE.rO + 0.04) * S + far;
			out.push({ at: v(P.x + u.x * d, P.y + u.y * d), th: a });
		} else {
			// one hydrogen towards the ion: that arm points along -u
			const d = R_CL + (SIZE.rH + 0.04 + SIZE.oh) * S + far;
			out.push({ at: v(P.x + u.x * d, P.y + u.y * d), th: a + Math.PI + HALF });
		}
	}
	return out;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export default function SaleSiScioglie({ alt }: { alt?: string }) {
	const [p, setP] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [clock, setClock] = useState(0);
	const reduced = useReducedMotion();

	useFrameLoop(playing || (p > 0 && !reduced), (dt) => {
		setClock((c) => c + dt);
		if (playing) {
			const next = Math.min(1, p + dt / PLAY);
			setP(next);
			if (next >= 1) setPlaying(false);
		}
	});

	const start = () => {
		if (p >= 1) {
			setP(0);
			return;
		}
		if (reduced) setP(1);
		else setPlaying(true);
	};

	// ion k leaves at p = k / N · (1 - TRAVEL) and arrives TRAVEL later
	const state = IONS.map((ion) => {
		const t0 = (ion.order / N) * (1 - TRAVEL);
		const q = clamp((p - t0) / TRAVEL, 0, 1);
		const e = ease(q);
		const wob = q >= 1 ? 0.06 : 0.06 * q;
		const lift = Math.sin(Math.PI * e) * 0.35;
		const base = lerp(ion.site, ion.target, e);
		const at = v(base.x + wob * Math.sin(1.3 * clock + ion.phase), base.y + lift + wob * Math.cos(1.1 * clock + ion.phase));
		const shellQ = clamp((p - t0 + TRAVEL * 0.25) / (TRAVEL * 0.9), 0, 1);
		return { ion, q, at, shellQ, spin: ion.phase + 0.25 * clock * (ion.na ? 1 : -1) };
	});
	const gone = state.filter((s) => s.q >= 1).length;
	const leaving = state.filter((s) => s.q > 0 && s.q < 1).length;
	const inCrystal = N - gone - leaving;

	const caption =
		p === 0
			? 'Il cristallo di cloruro di sodio sul fondo dell\'acqua: ioni sodio, piccoli e con il più, e ioni cloruro, grandi e con il meno, alternati. Premi «Sciogli».'
			: p < 1
				? 'Le molecole d\'acqua girano l\'ossigeno verso gli ioni sodio e un idrogeno verso gli ioni cloruro, e li staccano dal cristallo uno alla volta, prima quelli degli spigoli; ogni ione si allontana nel liquido circondato dal suo guscio di molecole d\'acqua.'
				: 'Il cristallo non c\'è più: tutti gli ioni sono idratati e sparsi nel liquido. Le molecole d\'acqua disegnate sono solo quelle dei gusci; in realtà l\'acqua riempie tutto il recipiente.';

	const K = f.W / (f.x1 - f.x0);
	const top = f.px(v(0, H - 0.3));
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={top.x} y={top.y} width={W * K} height={(H - 0.3) * K} fill="#ccf5ff" stroke="none" />
				<path d={f.path([v(0, H), v(0, 0), v(W, 0), v(W, H)])} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path([v(0, H - 0.3), v(W, H - 0.3)])} stroke="#000" strokeWidth={THIN} />
				{state.map((s, i) => {
					const r = s.ion.na ? R_NA : R_CL;
					const c = f.px(s.at);
					return (
						<g key={i}>
							{s.shellQ > 0 && shell(s.at, s.ion.na, s.shellQ, s.spin).map((w, k) => w.at.y < 0.3 ? null : <WaterMolecule key={k} f={f} w={w} scale={S} opacity={Math.min(1, s.shellQ * 1.5)} />)}
							<circle cx={c.x} cy={c.y} r={r * K} fill={s.ion.na ? FILL_NA : FILL_CL} stroke="#000" strokeWidth={THIN} />
							<Label f={f} at={s.at} upright size={s.ion.na ? 11 : 14}>
								{s.ion.na ? '+' : '−'}
							</Label>
						</g>
					);
				})}
			</Drawing>
			<Readout>
				<span>ioni nel cristallo: {inCrystal}</span>
				<span>ioni idratati in soluzione: {gone + leaving}</span>
				<Tex>{'\\mathrm{NaCl}(s) \\longrightarrow \\mathrm{Na^+}(aq) + \\mathrm{Cl^-}(aq)'}</Tex>
			</Readout>
			<Caption>{caption}</Caption>
			<Controls>
				<Slider
					label="Avanzamento (%)"
					value={Math.round(p * 100)}
					min={0}
					max={100}
					step={1}
					onChange={(x) => {
						setPlaying(false);
						setP(x / 100);
					}}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={playing} onClick={start}>
						{p >= 1 ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						{p >= 1 ? 'Ricomincia' : 'Sciogli'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
