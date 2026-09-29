'use client';

import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, num, texNum, useTween, TINT, THICK, THIN, FONT } from '../kit';
import { Dinamometro, dinamometroGeometry } from './Dinamometro';

/**
 * Lesson 16 (Le forze e il dinamometro), "Come si legge un dinamometro": the student hangs slotted weights of 0,5 N
 * and 0,2 N on a hanger under a spring balance and reads the scale. Two balances: capacity 2 N with 20 divisions
 * (sensitivity 0,1 N) and capacity 5 N with 10 divisions (sensitivity 0,5 N), the same scale length, so the second
 * spring is stiffer. The index moves in proportion to the force (Hooke); over the capacity it stops past the last
 * mark and the caption warns. The reading is the mark nearest the index, with the sensitivity as its uncertainty.
 * The hanger weighs nothing (a real one is tared with the balance).
 */

type Model = 'fine' | 'grosso';
const MODELS: Record<Model, { portata: number; divisioni: number; ogni: number; label: string }> = {
	fine: { portata: 2, divisioni: 20, ogni: 5, label: 'Portata 2 N' },
	grosso: { portata: 5, divisioni: 10, ogni: 2, label: 'Portata 5 N' }
};
const MAX = { big: 6, small: 4 };
const SCALE = 2.2;
const RING = v(0, 0);
const HANGER = 1.6; // rod of the hanger, from its loop to its base

// Lowest point: the hook with the index past the end of the scale, then the hanger.
const low = dinamometroGeometry({ ring: RING, portata: 1, forza: 2, scaleLen: SCALE }).hookBottom.y - 0.25 - HANGER - 0.15;
const f = frame(-1.35, 1.35, low, 0.55);

const DISC = { big: { w: 0.9, h: 0.18, fill: TINT.blue }, small: { w: 0.66, h: 0.11, fill: TINT.orange } };

export default function DinamometroPesetti({ alt }: { alt?: string }) {
	const [model, setModel] = useState<Model>('fine');
	const [big, setBig] = useState(2);
	const [small, setSmall] = useState(1);
	const force = big * 0.5 + small * 0.2;
	const [shown, go] = useTween(force, 450);
	const m = MODELS[model];
	const sens = m.portata / m.divisioni;

	const set = (b: number, s: number) => {
		setBig(b);
		setSmall(s);
		void go(b * 0.5 + s * 0.2);
	};

	const geo = dinamometroGeometry({ ring: RING, portata: m.portata, forza: shown, scaleLen: SCALE });
	const hook = geo.hookBottom;
	const loop = hook.y - 0.12;
	const top = loop - 0.13;
	const base = top - HANGER;
	// Slotted weights stacked on the base, the 0,5 N ones first.
	const discs: { y: number; kind: 'big' | 'small' }[] = [];
	let y = base;
	for (let i = 0; i < big; i++) {
		discs.push({ y, kind: 'big' });
		y += DISC.big.h;
	}
	for (let i = 0; i < small; i++) {
		discs.push({ y, kind: 'small' });
		y += DISC.small.h;
	}

	const over = force > m.portata + 1e-9;
	const reading = Math.round(force / sens) * sens;
	const labelAt = f.px(v(0.55, base + 0.1));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Dinamometro f={f} ring={RING} portata={m.portata} divisioni={m.divisioni} ogni={m.ogni} forza={shown} scaleLen={SCALE} />
				{/* the hanger: a loop on the hook, a rod, a base */}
				<path d={f.path([hook, v(0, loop)])} stroke="#000" strokeWidth={THIN} fill="none" />
				<circle cx={f.px(v(0, loop - 0.065)).x} cy={f.px(v(0, loop - 0.065)).y} r={0.065 * (f.W / (f.x1 - f.x0))} fill="none" stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0, top), v(0, base)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(-0.5, base), v(0.5, base), v(0.5, base - 0.07), v(-0.5, base - 0.07)], true)} fill="#000" />
				{discs.map((d, i) => {
					const s = DISC[d.kind];
					return <path key={i} d={f.path([v(-s.w / 2, d.y), v(s.w / 2, d.y), v(s.w / 2, d.y + s.h), v(-s.w / 2, d.y + s.h)], true)} fill={s.fill} stroke="#000" strokeWidth={THIN} />;
				})}
				{force === 0 && (
					<text x={labelAt.x} y={labelAt.y} fontSize={10.5} fontFamily={FONT} fill="#000">
						portapesi
					</text>
				)}
			</Drawing>

			<Readout>
				<span>
					pesetti: {big} da <Tex>{'0{,}5'}</Tex> N, {small} da <Tex>{'0{,}2'}</Tex> N
				</span>
				<span>
					forza sul gancio <Tex>{`${texNum(force, 1)}`}</Tex> N
				</span>
				<span>
					lettura{' '}
					{over ? (
						'fuori portata'
					) : (
						<>
							<Tex>{`(${texNum(reading, 1)} \\pm ${texNum(sens, 1)})`}</Tex> N
						</>
					)}
				</span>
			</Readout>
			<Caption>
				{over ? (
					<>
						La forza di {num(force, 1)} N supera la portata di {m.portata} N: l&apos;indice va oltre la scala e la molla rischia di non tornare più com&apos;era. Togli qualche pesetto.
					</>
				) : force === 0 ? (
					'Senza pesetti l’indice è sullo zero. Appendi dei pesetti e guarda dove si ferma l’indice.'
				) : Math.abs(reading - force) > 1e-9 ? (
					<>
						La forza è di {num(force, 1)} N, ma questo dinamometro ha una divisione di {num(sens, 1)} N: la tacca più vicina all&apos;indice è {num(reading, 1)} N.
					</>
				) : (
					<>
						L&apos;indice è sulla tacca di {num(reading, 1)} N: una divisione vale {num(sens, 1)} N, e la sensibilità è l&apos;incertezza della lettura.
					</>
				)}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Dinamometro"
						options={(Object.keys(MODELS) as Model[]).map((k) => ({ value: k, label: MODELS[k].label }))}
						value={model}
						onChange={setModel}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={big >= MAX.big} onClick={() => set(big + 1, small)} aria-label="Aggiungi un pesetto da 0,5 N">
						<Plus className="size-4" aria-hidden="true" />0,5 N
					</Button>
					<Button variant="secondary" size="sm" disabled={big === 0} onClick={() => set(big - 1, small)} aria-label="Togli un pesetto da 0,5 N">
						<Minus className="size-4" aria-hidden="true" />0,5 N
					</Button>
					<Button variant="secondary" size="sm" disabled={small >= MAX.small} onClick={() => set(big, small + 1)} aria-label="Aggiungi un pesetto da 0,2 N">
						<Plus className="size-4" aria-hidden="true" />0,2 N
					</Button>
					<Button variant="secondary" size="sm" disabled={small === 0} onClick={() => set(big, small - 1)} aria-label="Togli un pesetto da 0,2 N">
						<Minus className="size-4" aria-hidden="true" />0,2 N
					</Button>
					<Button variant="secondary" size="sm" disabled={force === 0} onClick={() => set(0, 0)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Togli tutto
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
