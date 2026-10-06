'use client';

import { useState } from 'react';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, Dot, frame, v, num, texNum, THICK, THIN, DASH, INK, TINT } from '../kit';
import { Formula, FormulaLabel, Pills } from './chim3-H-pezzi';

/**
 * Lesson 72 (Forze dipolo-dipolo e forze di London): the boiling point as the particle changes. The student picks a
 * family (noble gases, halogens, alkanes, HCl-HBr-HI) and one of its substances. On the left two particles drawn as
 * electron clouds, larger with more electrons, caught as an instantaneous and an induced dipole; on the right a
 * temperature scale with a mark for every substance of the family, the chosen one highlighted, and the line of 25 °C.
 * Under the drawing: electrons, molar mass, boiling point, state at 25 °C.
 *
 * Data: electrons from the atomic numbers, molar masses from src/lib/tools/elementi.json (two decimals), boiling and
 * melting points as in the lesson's tables (rounded to the degree; butane -0,5 °C).
 */

type Substance = { formula: string; nome: string; il: string; e: number; M: number; teb: number; tfus: number };
type FamilyId = 'nobili' | 'alogeni' | 'alcani' | 'hx';

const FAMILIES: Record<FamilyId, { label: string; polar: boolean; unit: 'atomo' | 'molecola'; list: Substance[] }> = {
	nobili: {
		label: 'gas nobili',
		polar: false,
		unit: 'atomo',
		list: [
			{ formula: 'He', nome: 'elio', il: "l'elio", e: 2, M: 4.0, teb: -269, tfus: -272 },
			{ formula: 'Ne', nome: 'neon', il: "il neon", e: 10, M: 20.18, teb: -246, tfus: -249 },
			{ formula: 'Ar', nome: 'argon', il: "l'argon", e: 18, M: 39.95, teb: -186, tfus: -189 },
			{ formula: 'Kr', nome: 'kripton', il: "il kripton", e: 36, M: 83.8, teb: -153, tfus: -157 },
			{ formula: 'Xe', nome: 'xeno', il: "lo xeno", e: 54, M: 131.29, teb: -108, tfus: -112 },
		],
	},
	alogeni: {
		label: 'alogeni',
		polar: false,
		unit: 'molecola',
		list: [
			{ formula: 'F2', nome: 'fluoro', il: "il fluoro", e: 18, M: 38.0, teb: -188, tfus: -220 },
			{ formula: 'Cl2', nome: 'cloro', il: "il cloro", e: 34, M: 70.9, teb: -34, tfus: -101 },
			{ formula: 'Br2', nome: 'bromo', il: "il bromo", e: 70, M: 159.8, teb: 59, tfus: -7 },
			{ formula: 'I2', nome: 'iodio', il: "lo iodio", e: 106, M: 253.8, teb: 184, tfus: 114 },
		],
	},
	alcani: {
		label: 'alcani',
		polar: false,
		unit: 'molecola',
		list: [
			{ formula: 'CH4', nome: 'metano', il: "il metano", e: 10, M: 16.05, teb: -162, tfus: -182 },
			{ formula: 'C2H6', nome: 'etano', il: "l'etano", e: 18, M: 30.08, teb: -89, tfus: -183 },
			{ formula: 'C3H8', nome: 'propano', il: "il propano", e: 26, M: 44.11, teb: -42, tfus: -188 },
			{ formula: 'C4H10', nome: 'butano', il: "il butano", e: 34, M: 58.14, teb: -0.5, tfus: -138 },
			{ formula: 'C5H12', nome: 'pentano', il: "il pentano", e: 42, M: 72.17, teb: 36, tfus: -130 },
		],
	},
	hx: {
		label: 'HCl, HBr, HI',
		polar: true,
		unit: 'molecola',
		list: [
			{ formula: 'HCl', nome: 'cloruro di idrogeno', il: "il cloruro di idrogeno", e: 18, M: 36.46, teb: -85, tfus: -114 },
			{ formula: 'HBr', nome: 'bromuro di idrogeno', il: "il bromuro di idrogeno", e: 36, M: 80.91, teb: -67, tfus: -87 },
			{ formula: 'HI', nome: 'ioduro di idrogeno', il: "lo ioduro di idrogeno", e: 54, M: 127.91, teb: -35, tfus: -51 },
		],
	},
};

const f = frame(-0.1, 9.3, -0.55, 5.45);
const AXIS_X = 6.5;
const T_MIN = -280, T_MAX = 200, Y0 = 0, Y1 = 4.6;
const yOf = (t: number) => Y0 + ((t - T_MIN) / (T_MAX - T_MIN)) * (Y1 - Y0);
const K = f.W / (f.x1 - f.x0);
const minus = (s: string) => s.replace('-', '−');

export default function ForzeEbollizioneMolecola({ alt }: { alt?: string }) {
	const [fam, setFam] = useState<FamilyId>('alogeni');
	const [pick, setPick] = useState<Record<FamilyId, string>>({ nobili: 'Ar', alogeni: 'Cl2', alcani: 'C3H8', hx: 'HCl' });
	const family = FAMILIES[fam];
	const sub = family.list.find((s) => s.formula === pick[fam]) ?? family.list[0];

	// the two clouds: radius grows with the cube root of the number of electrons, like the radius of a ball with its volume
	const r = 0.3 + 0.17 * Math.cbrt(sub.e);
	const shift = 0.12 * r; // how far the cloud is pushed off its nucleus
	const cy = 2.75;
	const c1 = v(2.45 - r - 0.36, cy), c2 = v(2.45 + r + 0.36, cy);
	const cloud = (c: typeof c1, key: string) => {
		const p = f.px(v(c.x + shift, c.y));
		return <ellipse key={key} cx={p.x} cy={p.y} rx={(r + shift) * K} ry={r * 0.94 * K} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />;
	};

	const state = sub.teb < 25 ? 'gas' : sub.tfus < 25 ? 'liquido' : 'solido';
	// labels of the family on the scale, in two columns when two marks are too close
	const sorted = [...family.list].sort((a, b) => a.teb - b.teb);
	const lastY = [-9, -9];
	const marks = sorted.map((s) => {
		const y = yOf(s.teb);
		const col = y - lastY[0] >= 0.34 ? 0 : 1;
		lastY[col] = y;
		return { s, y, col };
	});

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the two particles */}
				{cloud(c1, 'a')}
				{cloud(c2, 'b')}
				<Dot f={f} at={c1} />
				<Dot f={f} at={c2} />
				<path d={f.path([v(c1.x + shift + r + shift + 0.05, cy), v(c2.x + shift - r - shift - 0.05, cy)])} stroke={INK.gray} strokeWidth={THICK} strokeDasharray={DASH} />
				{[c1, c2].map((c, i) => (
					<g key={i}>
						<Label f={f} at={v(c.x - r * 0.55, cy + r + 0.08)} dir={v(0, 1)} size={13}>
							δ+
						</Label>
						<Label f={f} at={v(c.x + shift + r * 0.6, cy + r + 0.08)} dir={v(0, 1)} size={13}>
							δ−
						</Label>
					</g>
				))}
				<FormulaLabel f={f} at={v(2.55, cy - 1.25 - 0.25)} dir={v(0, -1)} size={15}>
					{sub.formula}
				</FormulaLabel>
				<Label f={f} at={v(2.55, cy - 1.25 - 0.7)} dir={v(0, -1)} upright size={12}>
					{`${sub.e} elettroni per ${family.unit}`}
				</Label>
				<Label f={f} at={v(2.55, 4.75)} dir={v(0, 1)} upright size={12}>
					due particelle vicine, in un istante
				</Label>

				{/* the temperature scale */}
				<path d={f.path([v(AXIS_X, Y0 - 0.05), v(AXIS_X, Y1 + 0.2)])} stroke="#000" strokeWidth={THIN} />
				{[-200, -100, 0, 100, 200].map((t) => (
					<g key={t}>
						<path d={f.path([v(AXIS_X - 0.08, yOf(t)), v(AXIS_X, yOf(t))])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(AXIS_X - 0.08, yOf(t))} dir={v(-1, 0)} upright size={11}>
							{minus(String(t))}
						</Label>
					</g>
				))}
				<Label f={f} at={v(AXIS_X, Y1 + 0.2)} dir={v(0, 1)} upright size={12}>
					t di ebollizione (°C)
				</Label>
				<path d={f.path([v(AXIS_X - 1.0, yOf(25)), v(AXIS_X, yOf(25))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<Label f={f} at={v(AXIS_X - 1.0, yOf(25))} dir={v(-0.4, 1)} upright size={11}>
					25 °C
				</Label>
				{marks.map(({ s, y, col }) => {
					const on = s.formula === sub.formula;
					const x = AXIS_X + 0.2 + col * 1.15;
					return (
						<g key={s.formula}>
							<path d={f.path([v(AXIS_X, y), v(x - 0.04, y)])} stroke={on ? INK.orange : '#000'} strokeWidth={on ? THICK : THIN} />
							<Dot f={f} at={v(AXIS_X, y)} r={on ? 4 : 2.2} color={on ? INK.orange : '#000'} />
							<FormulaLabel f={f} at={v(x - 0.2, y)} dir={v(1, 0)} size={on ? 14 : 12} weight={on ? 700 : undefined}>
								{s.formula}
							</FormulaLabel>
						</g>
					);
				})}
			</Drawing>
			<Readout>
				<span>
					<Formula>{sub.formula}</Formula>, {sub.nome}
				</span>
				<span>{sub.e} elettroni</span>
				<Tex>{`M = ${texNum(sub.M, 2)}\\,\\text{g/mol}`}</Tex>
				<Tex>{`t_{eb} = ${texNum(sub.teb, 1)}\\,^\\circ\\text{C}`}</Tex>
				<span>a 25 °C: {state}</span>
			</Readout>
			<Caption>
				{family.polar
					? `Molecole polari: tra loro agiscono forze di London e forze dipolo-dipolo. Da HCl a HI la polarità diminuisce, ma gli elettroni aumentano e la temperatura di ebollizione sale lo stesso.`
					: `${family.unit === 'atomo' ? 'Atomi singoli' : 'Molecole apolari'}: tra loro agiscono solo forze di London. Più elettroni ha la particella, più la nube si deforma e più in alto bolle la sostanza.`}{' '}
				{`A 25 °C ${sub.il} è ${state === 'gas' ? 'un gas' : state === 'liquido' ? 'un liquido' : 'un solido'}${state === 'solido' ? `: fonde a ${minus(num(sub.tfus, 0))} °C` : ''}.`}
			</Caption>
			<Controls>
				<Pills label="Famiglia" value={fam} onChange={setFam} options={(Object.keys(FAMILIES) as FamilyId[]).map((k) => ({ value: k, label: FAMILIES[k].label }))} />
				<Pills label="Sostanza" value={sub.formula} onChange={(x) => setPick({ ...pick, [fam]: x })} options={family.list.map((s) => ({ value: s.formula, label: <Formula>{s.formula}</Formula> }))} />
			</Controls>
		</Figure>
	);
}
