'use client';

import { useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Label, Tex, frame, v, texNum, THICK, THIN, TINT } from '../kit';

/**
 * Chemistry lesson 35 (Composizione percentuale, formula minima e formula molecolare): the student picks a compound and
 * sees two bars of the same length, its composition by mass (one segment per element, with the percentage) and its
 * atoms (one segment per element, split into one cell per atom). "Passo successivo" then walks the lesson's procedure
 * in a table under the drawing, one column at a time: the grams in 100 g, the moles of atoms (g / A), the moles
 * divided by the smallest, and the multiplication by 2, 3 or 4 when a quotient ends in 0,5, 0,33 or 0,25; the last
 * step writes the empirical formula and compares it with the molecular one (n = M / M_min), or says that an ionic
 * compound has only the empirical formula. The percentages are those of the formula with the lesson 01 table,
 * rounded to one decimal, and the steps start from them, as a student would.
 */

const A: Record<string, number> = { H: 1.01, C: 12.01, N: 14.01, O: 16.0, P: 30.97, Fe: 55.85 };
const FILL: Record<string, string> = { C: TINT.gray, H: TINT.blue, O: TINT.red, Fe: TINT.orange, P: TINT.yellow, N: TINT.green };

type Compound = { key: string; name: string; atoms: [string, number][]; ionic?: boolean };
const COMPOUNDS: Compound[] = [
	{ key: 'glucosio', name: 'Glucosio', atoms: [['C', 6], ['H', 12], ['O', 6]] },
	{ key: 'etanolo', name: 'Etanolo', atoms: [['C', 2], ['H', 6], ['O', 1]] },
	{ key: 'acqua-ossigenata', name: 'Acqua ossigenata', atoms: [['H', 2], ['O', 2]] },
	{ key: 'benzene', name: 'Benzene', atoms: [['C', 6], ['H', 6]] },
	{ key: 'ossido-ferro', name: 'Ossido di ferro(III)', atoms: [['Fe', 2], ['O', 3]], ionic: true },
	{ key: 'magnetite', name: 'Magnetite', atoms: [['Fe', 3], ['O', 4]], ionic: true },
	{ key: 'anidride-fosforica', name: 'Anidride fosforica', atoms: [['P', 4], ['O', 10]] },
];

/** A number with exactly `d` decimals, the Italian way, as text and for <Tex>. */
const fix = (x: number, d: number) => x.toFixed(d).replace('.', ',');
const texFix = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const formula = (atoms: [string, number][]) => `\\mathrm{${atoms.map(([e, k]) => (k === 1 ? e : `${e}_{${k}}`)).join('')}}`;

/** Everything the table shows, from the percentages rounded to one decimal. */
function solve(c: Compound) {
	const M = c.atoms.reduce((s, [e, k]) => s + A[e] * k, 0);
	const pct = c.atoms.map(([e, k]) => Math.round(((A[e] * k) / M) * 1000) / 10);
	const mol = c.atoms.map(([e], i) => pct[i] / A[e]);
	const min = Math.min(...mol);
	const ratio = mol.map((x) => x / min);
	const mult = [1, 2, 3, 4].find((k) => ratio.every((r) => Math.abs(r * k - Math.round(r * k)) < 0.08)) ?? 1;
	const idx = ratio.map((r) => Math.round(r * mult));
	const g = c.atoms.map(([, k]) => k).reduce(gcd);
	const minimal: [string, number][] = c.atoms.map(([e, k]) => [e, k / g]);
	const Mmin = minimal.reduce((s, [e, k]) => s + A[e] * k, 0);
	return { M, pct, mol, min, ratio, mult, idx, n: g, minimal, Mmin };
}

const X0 = 0, X1 = 8; // the bars
const f = frame(-1.75, 8.25, -0.25, 3.05);
const MASS_Y = 1.55, ATOM_Y = 0.1, BH = 0.6;

const STEPS = 5; // 0: bars only; 1: grams; 2: moles; 3: divided by the smallest; 4: multiplied and the formula

export default function ComposizioneFormulaMinima({ alt }: { alt?: string }) {
	const [key, setKey] = useState('glucosio');
	const [step, setStep] = useState(0);
	const c = COMPOUNDS.find((x) => x.key === key)!;
	const s = solve(c);
	const total = c.atoms.reduce((t, [, k]) => t + k, 0);

	const pick = (k: string) => {
		setKey(k);
		setStep(0);
	};

	// Mass bar: one segment per element; the label inside if it fits, else above with a leader.
	const before = (ws: number[], i: number) => X0 + ws.slice(0, i).reduce((t, w) => t + w, 0);
	const mw = c.atoms.map((_, i) => ((X1 - X0) * s.pct[i]) / 100);
	const massSegs = c.atoms.map(([e], i) => ({ e, x: before(mw, i), w: mw[i], pct: s.pct[i] }));
	const aw = c.atoms.map(([, k]) => ((X1 - X0) * k) / total);
	const atomSegs = c.atoms.map(([e, k], i) => ({ e, k, x: before(aw, i), w: aw[i] }));
	const cell = (X1 - X0) / total;

	const lastMult = s.mult > 1;
	let caption: string;
	if (step === 0) caption = `La barra in alto divide tra gli elementi la massa del composto, quella in basso i ${total} atomi della sua formula, uno per tacca. Premi «Passo successivo» per ricavare la formula minima dalle percentuali.`;
	else if (step === 1) caption = 'In 100 g di composto, ogni percentuale diventa una massa in grammi.';
	else if (step === 2) caption = 'Dividendo i grammi per la massa atomica di ogni elemento si trovano le moli di atomi: il loro rapporto è il rapporto tra gli atomi.';
	else if (step === 3) caption = lastMult ? `Divise per la più piccola, le moli non sono tutte intere: un quoziente finisce in ${s.mult === 2 ? '0,5' : s.mult === 3 ? '0,33' : '0,25'}, e non si arrotonda.` : 'Divise per la più piccola, le moli sono numeri interi, a meno di qualche centesimo dovuto agli arrotondamenti.';
	else caption = lastMult ? `Moltiplicando tutto per ${s.mult} i quozienti diventano interi: sono gli indici della formula minima.` : 'I quozienti arrotondati sono gli indici della formula minima.';

	const head = ['', 'in 100 g', 'moli di atomi', ': più piccola', ...(lastMult ? [`× ${s.mult}`] : [])];
	const cols = step === 0 ? 0 : Math.min(step, lastMult ? 4 : 3);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Label f={f} at={v(X0, MASS_Y + BH / 2)} dir={v(-1, 0)} upright size={13}>
					massa
				</Label>
				<Label f={f} at={v(X0, ATOM_Y + BH / 2)} dir={v(-1, 0)} upright size={13}>
					atomi
				</Label>
				{massSegs.map((g) => (
					<g key={`m${g.e}`}>
						<path d={f.path([v(g.x, MASS_Y), v(g.x + g.w, MASS_Y), v(g.x + g.w, MASS_Y + BH), v(g.x, MASS_Y + BH)], true)} fill={FILL[g.e]} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
						{g.w >= 1.7 ? (
							<Label f={f} at={v(g.x + g.w / 2, MASS_Y + BH / 2)} upright size={13}>
								{`${g.e} ${fix(g.pct, 1)}%`}
							</Label>
						) : (
							<>
								<path d={f.path([v(g.x + g.w / 2, MASS_Y + BH), v(g.x + g.w / 2, MASS_Y + BH + 0.3)])} stroke="#000" strokeWidth={THIN} fill="none" />
								<Label f={f} at={v(Math.min(g.x + g.w / 2, X1 - 0.6), MASS_Y + BH + 0.32)} dir={v(0, 1)} upright size={13}>
									{`${g.e} ${fix(g.pct, 1)}%`}
								</Label>
							</>
						)}
					</g>
				))}
				{atomSegs.map((g) => (
					<g key={`a${g.e}`}>
						<path d={f.path([v(g.x, ATOM_Y), v(g.x + g.w, ATOM_Y), v(g.x + g.w, ATOM_Y + BH), v(g.x, ATOM_Y + BH)], true)} fill={FILL[g.e]} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
						<path d={Array.from({ length: g.k - 1 }, (_, i) => g.x + (i + 1) * cell).flatMap((x) => [f.path([v(x, ATOM_Y), v(x, ATOM_Y + 0.14)]), f.path([v(x, ATOM_Y + BH - 0.14), v(x, ATOM_Y + BH)])]).join(' ')} stroke="#000" strokeWidth={THIN} fill="none" />
						{g.w >= 0.9 && (
							<Label f={f} at={v(g.x + g.w / 2, ATOM_Y + BH / 2)} upright size={13}>
								{`${g.k} ${g.e}`}
							</Label>
						)}
					</g>
				))}
			</Drawing>

			{step > 0 && (
				<div className="w-full max-w-lg overflow-x-auto">
					<table className="m-0 w-full border-collapse text-center text-sm text-fg">
						<thead>
							<tr className="border-b border-edge text-xs text-fg-muted">
								{head.slice(0, cols + 1).map((h, i) => (
									<th key={i} className="px-1.5 py-1 font-medium">
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{c.atoms.map(([e], i) => (
								<tr key={e} className="border-b border-edge/60">
									<td className="px-1.5 py-1">
										<Tex>{`\\mathrm{${e}}`}</Tex>
									</td>
									{cols >= 1 && (
										<td className="px-1.5 py-1">
											<Tex>{`${texFix(s.pct[i], 1)}\\,\\text{g}`}</Tex>
										</td>
									)}
									{cols >= 2 && (
										<td className="px-1.5 py-1">
											<Tex>{`\\dfrac{${texFix(s.pct[i], 1)}}{${texFix(A[e], 2)}} = ${texFix(s.mol[i], 3)}`}</Tex>
										</td>
									)}
									{cols >= 3 && (
										<td className="px-1.5 py-1">
											<Tex>{step >= 4 && !lastMult ? `${texFix(s.ratio[i], 2)} \\approx ${s.idx[i]}` : texFix(s.ratio[i], 2)}</Tex>
										</td>
									)}
									{cols >= 4 && (
										<td className="px-1.5 py-1">
											<Tex>{`${texFix(s.ratio[i] * s.mult, 2)} \\approx ${s.idx[i]}`}</Tex>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{step >= 4 && (
				<p className="m-0 text-center text-sm text-fg">
					<Tex>{`\\text{formula minima: } ${formula(c.atoms.map(([e], i) => [e, s.idx[i]]))}`}</Tex>
					<br />
					{c.ionic ? (
						<span className="text-fg-muted">È un composto ionico: la sua formula è la formula minima.</span>
					) : s.n === 1 ? (
						<span className="text-fg-muted">La formula molecolare è la stessa.</span>
					) : (
						<Tex>{`n = \\dfrac{M}{M_{\\text{min}}} = \\dfrac{${texNum(s.M, 2)}}{${texNum(s.Mmin, 2)}} = ${s.n} \\;\\Rightarrow\\; ${formula(c.atoms)}`}</Tex>
					)}
				</p>
			)}
			<Caption>{caption}</Caption>

			<Controls>
				<ButtonRow>
					{COMPOUNDS.map((x) => (
						<Button key={x.key} variant={x.key === key ? 'primary' : 'secondary'} size="sm" aria-pressed={x.key === key} onClick={() => pick(x.key)}>
							{x.name}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={() => setStep(step >= STEPS - 1 ? 0 : step + 1)}>
						{step >= STEPS - 1 ? <RotateCcw className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
						{step >= STEPS - 1 ? 'Ricomincia' : 'Passo successivo'}
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
