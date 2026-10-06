'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FAMILIES, OXOACIDS, acidIupac, acidTex, acidTrad, gcd, type Oxoacid } from '@/lib/exercises/v2/chim3-j';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, THICK } from '../kit';
import { Sphere } from './sfereDalton';

/**
 * Lesson 80 (Gli ossiacidi): from the oxide to the acid. The student picks a non-metal and one of its oxidation
 * numbers (and, for phosphorus, boron and silicon, how many molecules of water); the drawing shows the atoms of the
 * oxide and of the water as spheres, then the same atoms gathered as hydrogen, non-metal, oxygen. Under it the sum of
 * the atoms, the formula in lowest terms, how many molecules of acid it makes, and the two names.
 *
 * Formulas and names come from src/lib/exercises/v2/chim3-j.ts, the tables of the exercises.
 */

type Choice = { label: string; x: string; acids: Oxoacid[]; waters?: boolean };

const of = (x: string) => OXOACIDS.filter((a) => a.x === x && !a.family);
const fam = (x: string, no: number, keep: string[]) => FAMILIES.filter((a) => a.x === x && a.no === no && keep.includes(a.family ?? ''));

const CHOICES: Choice[] = [
	{ label: 'carbonio', x: 'C', acids: of('C') },
	{ label: 'azoto', x: 'N', acids: of('N') },
	{ label: 'zolfo', x: 'S', acids: of('S') },
	{ label: 'cloro', x: 'Cl', acids: of('Cl') },
	{ label: 'fosforo', x: 'P', acids: fam('P', 5, ['meta', 'piro', 'orto']), waters: true },
	{ label: 'boro', x: 'B', acids: fam('B', 3, ['meta', 'orto']), waters: true },
	{ label: 'silicio', x: 'Si', acids: fam('Si', 4, ['meta', 'orto']), waters: true },
];

/** N_2O_5 → [2, 5] */
function oxideAtoms(oxide: string): [number, number] {
	const m = /^[A-Z][a-z]?(?:_(\d))?O(?:_(\d))?$/.exec(oxide);
	if (!m) throw new Error(`oxide ${oxide}`);
	return [Number(m[1] ?? 1), Number(m[2] ?? 1)];
}

const STEP = 0.47;
const R = 0.21;
const f = frame(0, 10.4, 0, 4.3);
const sub = (s: string, n: number) => (n === 1 ? s : `${s}_${n}`);

export default function OssiacidiAnidrideAcqua({ alt }: { alt?: string }) {
	const [ci, setCi] = useState(2);
	const [ai, setAi] = useState(1);
	const choice = CHOICES[ci];
	const acid = choice.acids[Math.min(ai, choice.acids.length - 1)];
	const [nx, no] = oxideAtoms(acid.oxide);
	const w = acid.water;
	// the atoms on the table: those of one oxide and of w molecules of water
	const H = 2 * w;
	const O = no + w;
	const g = gcd(gcd(H, nx), O);
	const sum = `${sub('H', H)}${sub(acid.x, nx)}${sub('O', O)}`;

	// first row: the oxide, a plus, the water molecules
	const oxideW = (nx + no) * STEP;
	const waterW = w * 3 * STEP + (w - 1) * 0.25;
	const gap = 0.9;
	const x0 = (f.x1 - (oxideW + gap + waterW)) / 2 + STEP / 2;
	const y1 = 3.2;
	const y2 = 1.05;
	const oxide = [...Array.from({ length: nx }, () => acid.x), ...Array.from({ length: no }, () => 'O')];
	const xw = x0 + oxideW + gap;
	const all = [...Array.from({ length: H }, () => 'H'), ...Array.from({ length: nx }, () => acid.x), ...Array.from({ length: O }, () => 'O')];
	const xa = (f.x1 - all.length * STEP) / 2 + STEP / 2;
	const plus = f.px(v(x0 + oxideW + (gap - STEP) / 2, y1));
	const arrowTop = f.px(v(f.x1 / 2, y1 - 1.0));
	const arrowBottom = f.px(v(f.x1 / 2, y2 + 0.55));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{oxide.map((el, k) => (
					<Sphere key={`o${k}`} f={f} at={v(x0 + k * STEP, y1)} el={el} r={R} />
				))}
				<text x={plus.x} y={plus.y} dy="0.35em" textAnchor="middle" fontSize={18} fill="#000">
					+
				</text>
				{Array.from({ length: w }, (_, m) => {
					const xm = xw + m * (3 * STEP + 0.25);
					return (
						<g key={`w${m}`}>
							<Sphere f={f} at={v(xm, y1)} el="H" r={R * 0.85} />
							<Sphere f={f} at={v(xm + STEP, y1)} el="O" r={R} />
							<Sphere f={f} at={v(xm + 2 * STEP, y1)} el="H" r={R * 0.85} />
						</g>
					);
				})}
				<Label f={f} at={v(x0 + oxideW / 2 - STEP / 2, y1 + 0.4)} dir={v(0, 1)} upright size={13}>
					{acid.oxideName}
				</Label>
				<Label f={f} at={v(xw + waterW / 2 - STEP / 2, y1 - 0.4)} dir={v(0, -1)} upright size={13}>
					{w === 1 ? 'una molecola d’acqua' : `${w} molecole d’acqua`}
				</Label>
				<path d={`M${arrowTop.x},${arrowTop.y} L${arrowBottom.x},${arrowBottom.y}`} stroke="#000" strokeWidth={THICK} />
				<path d={`M${arrowBottom.x - 4},${arrowBottom.y - 7} L${arrowBottom.x},${arrowBottom.y} L${arrowBottom.x + 4},${arrowBottom.y - 7}`} stroke="#000" strokeWidth={THICK} fill="none" />
				{all.map((el, k) => (
					<Sphere key={`a${k}`} f={f} at={v(xa + k * STEP, y2)} el={el} r={el === 'H' ? R * 0.85 : R} />
				))}
				<Label f={f} at={v(f.x1 / 2, y2 - 0.4)} dir={v(0, -1)} upright size={13}>
					{`gli stessi atomi: ${H} H, ${nx} ${acid.x}, ${O} O`}
				</Label>
			</Drawing>

			<p className="m-0 text-center text-base text-fg">
				<Tex>{`\\mathrm{${acid.oxide}} + ${w === 1 ? '' : `${w}\\,`}\\mathrm{H_2O} \\longrightarrow ${g === 1 ? '' : `\\mathrm{${sum}} \\longrightarrow ${g}\\,`}\\mathrm{${acidTex(acid)}}`}</Tex>
			</p>
			<Readout>
				<span>{acidTrad(acid)}</span>
				<span>{acidIupac(acid)}</span>
			</Readout>
			<Caption>
				{g === 1 ? (
					<>Gli indici della somma non sono tutti divisibili per uno stesso numero: la formula resta com’è, e si forma una molecola di acido.</>
				) : (
					<>
						Tutti gli indici della somma sono divisibili per {g}: la formula si semplifica, e le molecole di acido sono {g}.
					</>
				)}{' '}
				Il numero di ossidazione di {acid.x} è <Tex>{`+${acid.no}`}</Tex>, nell’anidride e nell’acido.
			</Caption>

			<Controls>
				<ButtonRow>
					{CHOICES.map((c, k) => (
						<Button
							key={c.x}
							variant={k === ci ? 'primary' : 'secondary'}
							size="sm"
							aria-pressed={k === ci}
							onClick={() => {
								setCi(k);
								setAi(c.acids.length - 1);
							}}
						>
							{c.label}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					{choice.acids.map((a, k) => (
						<Button key={acidTex(a)} variant={a === acid ? 'primary' : 'secondary'} size="sm" aria-pressed={a === acid} onClick={() => setAi(k)}>
							{choice.waters ? (a.water === 1 ? '1 molecola d’acqua' : `${a.water} molecole d’acqua`) : `n.o. +${a.no}`}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
