'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { add, ButtonRow, Caption, clamp, Controls, Drawing, Figure, frame, Handle, Readout, Tex, THICK, THIN, v, type V } from '../kit';
import { Ground, QTY, Vector } from '../fisica';
import { Asta, Fulcro, ROD } from './leve';

/**
 * Lesson 24 (Le leve e le macchine semplici), "I tre generi di leve": a lever 70 cm long with the fulcrum, the
 * resistance (60 N, downwards) and the effort, all three dragged along the rod in steps of 5 cm. The figure finds the
 * kind of lever from their order (fulcrum between the forces: first; resistance between: second; effort between:
 * third), draws to scale the effort that balances the resistance, F_m = F_r b_r / b_m (downwards if the fulcrum is
 * between them, upwards otherwise), and says whether the lever is advantageous. Three buttons set a lever of each kind.
 *
 * Scale: 1 cm of the drawing per 10 cm of lever, 1 cm of arrow per 40 N; an effort over 100 N is drawn 2,5 cm long,
 * cut, and the caption says so; one under 7,5 N is drawn 0,3 cm long.
 */

const FR = 60;
const K = 1 / 40;
const CAP = 2.5;
const L = 7;
const STEP = 0.5;
const f = frame(-0.4, 7.4, -3.05, 3.0);

type Pos = { f: number; r: number; m: number };
const PRESETS: Record<'primo' | 'secondo' | 'terzo', Pos> = {
	primo: { f: 3, r: 1, m: 6.5 },
	secondo: { f: 0.5, r: 2.5, m: 6.5 },
	terzo: { f: 0.5, r: 6.5, m: 4.5 },
};
const NAMES = { primo: 'primo', secondo: 'secondo', terzo: 'terzo' } as const;

const between = (a: number, x: number, b: number) => (a < x && x < b) || (b < x && x < a);
const cm = (x: number) => Math.round(x * 10);

export default function LevaGeneri({ alt }: { alt?: string }) {
	const [pos, setPos] = useState<Pos>(PRESETS.primo);
	const br = Math.abs(pos.r - pos.f);
	const bm = Math.abs(pos.m - pos.f);
	const Fm = (FR * br) / bm;
	const kind = between(pos.r, pos.f, pos.m) ? 'primo' : between(pos.f, pos.r, pos.m) ? 'secondo' : 'terzo';
	const down = kind === 'primo';
	// Never shorter than 0,3 cm, or a small effort would be a tip without a line.
	const len = Math.max(0.3, Math.min(Fm * K, CAP));
	const cut = Fm * K > CAP + 1e-9;
	const gain = bm > br ? 'vantaggiosa' : bm < br ? 'svantaggiosa' : 'indifferente';

	const move = (key: keyof Pos) => (p: V) => {
		const x = clamp(Math.round(p.x / STEP) * STEP, STEP, L - STEP);
		setPos((q) => {
			const others = (Object.keys(q) as (keyof Pos)[]).filter((k) => k !== key).map((k) => q[k]);
			return others.some((o) => Math.abs(o - x) < 1e-9) ? q : { ...q, [key]: x };
		});
	};

	const top = (x: number) => v(x, ROD / 2);
	const ticks = Array.from({ length: 13 }, (_, i) => (i + 1) * STEP);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(pos.f - 0.35, -0.35)} to={v(pos.f + 0.35, -0.35)} />
				<Fulcro f={f} at={v(pos.f, 0)} ground={false} />
				<Asta f={f} from={v(0, 0)} to={v(L, 0)} />
				<path d={ticks.map((x) => f.path([v(x, ROD), v(x, ROD - 0.05)])).join(' ')} stroke="#000" strokeWidth={THIN} fill="none" pointerEvents="none" />
				<Vector f={f} from={top(pos.r)} to={add(top(pos.r), v(0, -FR * K))} color={QTY.forza} name="F" sub="r" />
				<Vector f={f} from={top(pos.m)} to={add(top(pos.m), v(0, down ? -len : len))} color={QTY.forza} name="F" sub="m" />
				{cut && (
					<path
						d={f.path([add(top(pos.m), v(-0.12, (down ? -1 : 1) * (CAP * 0.5 - 0.04))), add(top(pos.m), v(0.12, (down ? -1 : 1) * (CAP * 0.5 + 0.04)))])}
						stroke={QTY.forza}
						strokeWidth={THICK}
						pointerEvents="none"
					/>
				)}
				<Handle f={f} at={v(pos.f, 0)} onMove={move('f')} step={STEP} label="Fulcro, lungo l'asta" />
				<Handle f={f} at={top(pos.r)} onMove={move('r')} step={STEP} label="Punto della forza resistente" color={QTY.forza} />
				<Handle f={f} at={top(pos.m)} onMove={move('m')} step={STEP} label="Punto della forza motrice" color={QTY.forza} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`b_r = ${cm(br)}\\,\\text{cm}`}</Tex>
				</span>
				<span>
					<Tex>{`b_m = ${cm(bm)}\\,\\text{cm}`}</Tex>
				</span>
				<span>
					<Tex>{`F_m = ${FR}\\,\\text{N} \\cdot \\frac{${cm(br)}}{${cm(bm)}} = ${Fm.toFixed(1).replace('.', '{,}')}\\,\\text{N}`}</Tex>
				</span>
			</Readout>
			<Caption>
				Leva di {NAMES[kind]} genere, {gain}:{' '}
				{kind === 'primo'
					? 'il fulcro è tra le due forze, che hanno lo stesso verso.'
					: kind === 'secondo'
						? 'la resistenza è tra il fulcro e la forza motrice, e il braccio motore è per forza il più lungo.'
						: 'la forza motrice è tra il fulcro e la resistenza, e il braccio motore è per forza il più corto.'}
				{cut && ' La freccia della forza motrice è accorciata: in scala sarebbe troppo lunga.'}
			</Caption>

			<Controls>
				<ButtonRow>
					{(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((k) => (
						<Button key={k} variant={kind === k ? 'primary' : 'secondary'} size="sm" onClick={() => setPos(PRESETS[k])}>
							{`Leva di ${NAMES[k]} genere`}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
