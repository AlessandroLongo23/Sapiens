'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, frame, v, add, sub, rot, polar, ang, FONT, THICK, THIN, type V } from '../kit';
import { HBOND } from './acqua';
import { Formula, Pills } from './chim3-H-pezzi';

/**
 * Lesson 73 (Il legame a idrogeno): who makes hydrogen bonds with whom. The student picks two molecules; the one on
 * the left is asked to give a hydrogen, the one on the right to take it. When the left one has a hydrogen bound to
 * F, O or N and the right one has an F, O or N with a lone pair, the two turn so that the hydrogen faces the lone
 * pair and the bond is drawn, dashed; otherwise they stay apart. A button swaps the two. Under the drawing: what each
 * molecule can do, and why.
 *
 * The molecules are flat drawings with the atoms as circles and their symbols (bond angles only roughly those of
 * the real molecules); tints as in the water figures of lessons 44-47, and the symbols carry the information.
 */

const DEG = Math.PI / 180;
const XH = 0.8, XX = 1.1;
const R: Record<string, number> = { H: 0.24, C: 0.37, N: 0.37, O: 0.37, F: 0.36, S: 0.42 };
const FILL: Record<string, string> = { H: '#e6e6ff', C: '#d0d0d0', N: '#bfbfff', O: '#ffcccc', F: '#ccffcc', S: '#ffff99' };

type Mol = {
	formula: string;
	nome: string;
	/** "l'acqua", "dell'acqua": the name with its article, and with "di". */
	il: string;
	del: string;
	atoms: { el: string; at: V }[];
	bonds: [number, number][];
	/** The hydrogen it can give, with the atom it is bound to. */
	donor?: { x: number; h: number };
	/** The atom that can take a hydrogen, and the direction its lone pair points to. */
	acceptor?: { atom: number; dir: number };
	/** Why it cannot give: where its hydrogens are. */
	noDonor?: string;
	noAcceptor?: string;
};

const o = v(0, 0);
const methyl = (c: V, away: number) => [0, 72, -72].map((d) => ({ el: 'H', at: add(c, polar(XH, (away + d) * DEG)) }));
const c1 = polar(XX, 214 * DEG), c2 = polar(XX, -34 * DEG), cm = v(-XX, 0);

const MOLS: Record<string, Mol> = {
	H2O: {
		formula: 'H2O', nome: 'acqua', il: "l'acqua", del: "dell'acqua",
		atoms: [{ el: 'O', at: o }, { el: 'H', at: polar(XH, -142.25 * DEG) }, { el: 'H', at: polar(XH, -37.75 * DEG) }],
		bonds: [[0, 1], [0, 2]],
		donor: { x: 0, h: 2 },
		acceptor: { atom: 0, dir: 90 * DEG },
	},
	NH3: {
		formula: 'NH3', nome: 'ammoniaca', il: "l'ammoniaca", del: "dell'ammoniaca",
		atoms: [{ el: 'N', at: o }, { el: 'H', at: polar(XH, 205 * DEG) }, { el: 'H', at: polar(XH, 270 * DEG) }, { el: 'H', at: polar(XH, 335 * DEG) }],
		bonds: [[0, 1], [0, 2], [0, 3]],
		donor: { x: 0, h: 3 },
		acceptor: { atom: 0, dir: 90 * DEG },
	},
	HF: {
		formula: 'HF', nome: 'fluoruro di idrogeno', il: 'il fluoruro di idrogeno', del: 'del fluoruro di idrogeno',
		atoms: [{ el: 'F', at: o }, { el: 'H', at: polar(XH, 180 * DEG) }],
		bonds: [[0, 1]],
		donor: { x: 0, h: 1 },
		acceptor: { atom: 0, dir: 55 * DEG },
	},
	CH3OH: {
		formula: 'CH3OH', nome: 'metanolo', il: 'il metanolo', del: 'del metanolo',
		atoms: [{ el: 'O', at: o }, { el: 'H', at: polar(XH, -71.5 * DEG) }, { el: 'C', at: cm }, ...methyl(cm, 180)],
		bonds: [[0, 1], [0, 2], [2, 3], [2, 4], [2, 5]],
		donor: { x: 0, h: 1 },
		acceptor: { atom: 0, dir: 70 * DEG },
	},
	CH3OCH3: {
		formula: 'CH3OCH3', nome: 'etere dimetilico', il: "l'etere dimetilico", del: "dell'etere dimetilico",
		atoms: [{ el: 'O', at: o }, { el: 'C', at: c1 }, { el: 'C', at: c2 }, ...methyl(c1, 214), ...methyl(c2, -34)],
		bonds: [[0, 1], [0, 2], [1, 3], [1, 4], [1, 5], [2, 6], [2, 7], [2, 8]],
		acceptor: { atom: 0, dir: 90 * DEG },
		noDonor: 'i suoi idrogeni sono tutti legati al carbonio',
	},
	CH4: {
		formula: 'CH4', nome: 'metano', il: 'il metano', del: 'del metano',
		atoms: [{ el: 'C', at: o }, ...[45, 135, 225, 315].map((d) => ({ el: 'H', at: polar(XH, d * DEG) }))],
		bonds: [[0, 1], [0, 2], [0, 3], [0, 4]],
		noDonor: 'i suoi idrogeni sono tutti legati al carbonio',
		noAcceptor: 'il carbonio non è tra i tre elementi e non ha coppie solitarie',
	},
	H2S: {
		formula: 'H2S', nome: 'solfuro di idrogeno', il: 'il solfuro di idrogeno', del: 'del solfuro di idrogeno',
		atoms: [{ el: 'S', at: o }, { el: 'H', at: polar(0.9, -136 * DEG) }, { el: 'H', at: polar(0.9, -44 * DEG) }],
		bonds: [[0, 1], [0, 2]],
		noDonor: 'i suoi idrogeni sono legati allo zolfo',
		noAcceptor: 'lo zolfo ha coppie solitarie, ma è troppo grande e poco elettronegativo',
	},
};
type Id = keyof typeof MOLS;
const IDS = Object.keys(MOLS) as Id[];

const f = frame(-4.0, 4.0, -2.75, 2.75);
const D = 1.7; // from the hydrogen to the atom that takes it, centre to centre

/** The atoms of a molecule turned by `turn` and moved so that atom `pin` sits at `to`. */
function place(m: Mol, turn: number, pin: number | null, to: V): V[] {
	const turned = m.atoms.map((a) => rot(a.at, turn));
	const from = pin === null ? v(turned.reduce((s, p) => s + p.x, 0) / turned.length, turned.reduce((s, p) => s + p.y, 0) / turned.length) : turned[pin];
	return turned.map((p) => add(sub(p, from), to));
}

function Molecule({ m, at }: { m: Mol; at: V[] }) {
	const K = f.W / (f.x1 - f.x0);
	return (
		<g>
			{m.bonds.map(([i, j]) => (
				<path key={`${i}-${j}`} d={f.path([at[i], at[j]])} stroke="#000" strokeWidth={THICK * 1.3} />
			))}
			{m.atoms.map((a, i) => {
				const p = f.px(at[i]);
				return (
					<g key={i}>
						<circle cx={p.x} cy={p.y} r={R[a.el] * K} fill={FILL[a.el]} stroke="#000" strokeWidth={THIN * 1.6} />
						<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={a.el === 'H' ? 12 : 16} fontFamily={FONT} fill="#000">
							{a.el}
						</text>
					</g>
				);
			})}
		</g>
	);
}

export default function LegameIdrogenoCoppie({ alt }: { alt?: string }) {
	const [a, setA] = useState<Id>('H2O');
	const [b, setB] = useState<Id>('NH3');
	const A = MOLS[a], B = MOLS[b];
	const bond = !!A.donor && !!B.acceptor;
	const reverse = !!B.donor && !!A.acceptor;

	let atA: V[], atB: V[];
	if (bond && A.donor && B.acceptor) {
		const dirH = ang(sub(A.atoms[A.donor.h].at, A.atoms[A.donor.x].at));
		atA = place(A, -dirH, A.donor.h, v(-D / 2, 0));
		atB = place(B, Math.PI - B.acceptor.dir, B.acceptor.atom, v(D / 2, 0));
	} else {
		atA = place(A, 0, null, v(-2.0, 0));
		atB = place(B, 0, null, v(2.0, 0));
	}
	const X = A.donor ? A.atoms[A.donor.x].el : '';
	const Y = B.acceptor ? B.atoms[B.acceptor.atom].el : '';
	const rY = R[Y] ?? 0.3;
	const pairX = D / 2 - rY - 0.12;

	let text: string;
	if (bond) text = `Un idrogeno ${A.del}, legato a ${X}, è attirato da una coppia solitaria ${Y === 'O' ? "dell'ossigeno" : Y === 'N' ? "dell'azoto" : 'del fluoro'} ${a === b ? 'di un’altra molecola' : B.del}: si forma un legame a idrogeno ${X}–H···${Y}.`;
	else if (!A.donor) text = `${A.il[0].toUpperCase()}${A.il.slice(1)} non può donare un idrogeno: ${A.noDonor}.${!B.acceptor ? ` E ${B.il} non può accettarlo: ${B.noAcceptor}.` : ''} Nessun legame a idrogeno.`;
	else text = `${B.il[0].toUpperCase()}${B.il.slice(1)} non può accettare un idrogeno: ${B.noAcceptor}. Nessun legame a idrogeno.`;
	if (!bond && reverse) text += ' Nel verso opposto il legame si forma: scambia le due molecole.';
	if (bond && !reverse && a !== b) text += ' Nel verso opposto non si formerebbe.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Molecule m={A} at={atA} />
				<Molecule m={B} at={atB} />
				{bond && (
					<g>
						<path d={f.path([v(-D / 2 + R.H + 0.04, 0), v(pairX - 0.08, 0)])} stroke={HBOND} strokeWidth={THICK * 1.5} strokeDasharray="4.5 3.5" />
						{[0.09, -0.09].map((y) => {
							const p = f.px(v(pairX, y));
							return <circle key={y} cx={p.x} cy={p.y} r={1.9} fill="#000" />;
						})}
						<Label f={f} at={v(-D / 2, R.H + 0.05)} dir={v(0, 1)} size={13}>
							δ+
						</Label>
					</g>
				)}
				{!bond && (
					<Label f={f} at={v(0, -2.05)} upright size={12}>
						nessun legame a idrogeno
					</Label>
				)}
				<Label f={f} at={v(-2.0, 2.5)} upright size={12}>
					dona un idrogeno?
				</Label>
				<Label f={f} at={v(2.0, 2.5)} upright size={12}>
					lo accetta?
				</Label>
				<Label f={f} at={v(-2.0, -2.5)} upright size={13}>
					{A.nome}
				</Label>
				<Label f={f} at={v(2.0, -2.5)} upright size={13}>
					{B.nome}
				</Label>
			</Drawing>
			<Readout>
				<span>
					<Formula>{A.formula}</Formula>: idrogeno legato a F, O o N? {A.donor ? 'sì' : 'no'}
				</span>
				<span>
					<Formula>{B.formula}</Formula>: coppia solitaria su F, O o N? {B.acceptor ? 'sì' : 'no'}
				</span>
			</Readout>
			<Caption>{text}</Caption>
			<Controls>
				<Pills label="Dona" value={a} onChange={setA} options={IDS.map((k) => ({ value: k, label: <Formula>{MOLS[k].formula}</Formula> }))} />
				<Pills label="Accetta" value={b} onChange={setB} options={IDS.map((k) => ({ value: k, label: <Formula>{MOLS[k].formula}</Formula> }))} />
				<ButtonRow>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => {
							setA(b);
							setB(a);
						}}
					>
						Scambia le due molecole
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
