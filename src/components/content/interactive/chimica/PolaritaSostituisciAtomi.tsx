'use client';

import { useState, type KeyboardEvent } from 'react';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, add, scale, len, unit, num, type V } from '../kit';
import { Atom, ATOM_FILL, DipoleArrow, DIPOLE, RESULTANT, Pills } from './chim3-g-pezzi';

/**
 * Lesson 69 (Molecole polari e apolari): the tetrahedral molecules from CH₄ to CCl₄. Each of the four atoms around the
 * carbon is switched between hydrogen and chlorine with a click (or with the five buttons, one per molecule). Every
 * C-Cl bond carries a dipole, an arrow towards the chlorine; the C-H bond counts as apolar (Δχ = 0,35), as the lesson
 * says. The orange arrow is the sum of the arrows, added in three dimensions and then drawn in the same projection
 * as the atoms: it disappears for CH₄ and CCl₄.
 *
 * The measured dipole moments (CRC Handbook: 1,87 D, 1,60 D, 1,04 D; to be checked) are shown beside the sum the
 * model gives in units of one C-Cl dipole (1, 1,15, 1, 0), so the student sees that the arrows give polar or apolar,
 * not the value.
 */

type P3 = [number, number, number];
const R = Math.sqrt(8) / 3;
/** The four vertices of a tetrahedron around the origin: up, then three below (front, back left, back right). */
const DIRS: P3[] = [
	[0, 1, 0],
	[R * Math.cos((330 * Math.PI) / 180), -1 / 3, R * Math.sin((330 * Math.PI) / 180)],
	[R * Math.cos((210 * Math.PI) / 180), -1 / 3, R * Math.sin((210 * Math.PI) / 180)],
	[0, -1 / 3, R],
];
/** An oblique projection: what is towards the viewer (z > 0) goes down and to the left. */
const proj = ([x, y, z]: P3): V => v(x - 0.3 * z, y - 0.24 * z);

const BOND = 1.6;
const ARROW = 1.05;
const f = frame(-2.5, 2.5, -2.3, 2.25);

const MOLS = [
	{ n: 0, tex: '\\mathrm{CH_4}', label: 'CH₄', nome: 'metano', mu: 0 },
	{ n: 1, tex: '\\mathrm{CH_3Cl}', label: 'CH₃Cl', nome: 'clorometano', mu: 1.87 },
	{ n: 2, tex: '\\mathrm{CH_2Cl_2}', label: 'CH₂Cl₂', nome: 'diclorometano', mu: 1.6 },
	{ n: 3, tex: '\\mathrm{CHCl_3}', label: 'CHCl₃', nome: 'triclorometano', mu: 1.04 },
	{ n: 4, tex: '\\mathrm{CCl_4}', label: 'CCl₄', nome: 'tetraclorometano', mu: 0 },
];
const WHERE = ['in alto', 'a destra', 'a sinistra', 'davanti'];

export default function PolaritaSostituisciAtomi({ alt }: { alt?: string }) {
	// which of the four positions hold a chlorine
	const [cl, setCl] = useState<boolean[]>([true, true, false, false]);
	const n = cl.filter(Boolean).length;
	const mol = MOLS[n];

	const sum3 = DIRS.reduce<P3>((s, d, i) => (cl[i] ? [s[0] + d[0], s[1] + d[1], s[2] + d[2]] : s), [0, 0, 0]);
	const size = Math.hypot(...sum3);
	const sum = scale(proj(sum3), ARROW);
	const polare = size > 1e-6;

	const toggle = (i: number) => setCl((c) => c.map((x, k) => (k === i ? !x : x)));
	const key = (i: number) => (e: KeyboardEvent<SVGGElement>) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		toggle(i);
	};
	// back atoms first, the front one last
	const order = [0, 1, 2, 3].sort((a, b) => DIRS[a][2] - DIRS[b][2]);
	const K = f.W / (f.x1 - f.x0);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{order.map((i) => {
					const at = scale(proj(DIRS[i]), BOND);
					const front = DIRS[i][2] > 0.5;
					const p = f.px(at);
					const r = cl[i] ? 0.42 : 0.28;
					// the dipole beside the bond
					const u = unit(at);
					const side = scale(v(-u.y, u.x), i === 2 ? 0.17 : -0.17);
					return (
						<g key={i}>
							<path d={f.path([v(0, 0), at])} stroke="#000" strokeWidth={front ? 3.2 : 1.6} strokeDasharray={!front && DIRS[i][2] < -0.1 ? '5 3' : undefined} />
							{cl[i] && <DipoleArrow f={f} from={add(scale(u, 0.42), side)} to={add(scale(u, Math.min(0.42 + ARROW * len(proj(DIRS[i])), len(at) - r - 0.02)), side)} color={DIPOLE} />}
							<Atom f={f} at={at} r={r} fill={cl[i] ? ATOM_FILL.Cl : ATOM_FILL.H}>
								{cl[i] ? 'Cl' : 'H'}
							</Atom>
							<g
								role="button"
								tabIndex={0}
								aria-label={`Atomo ${WHERE[i]}: ${cl[i] ? 'cloro' : 'idrogeno'}. Premi per cambiarlo in ${cl[i] ? 'idrogeno' : 'cloro'}`}
								data-atomo={i}
								className="cursor-pointer outline-none focus-visible:[&>circle]:stroke-black"
								onClick={() => toggle(i)}
								onKeyDown={key(i)}
							>
								<circle cx={p.x} cy={p.y} r={0.5 * K} fill="transparent" stroke="transparent" strokeWidth={1} strokeDasharray="3 3" />
							</g>
						</g>
					);
				})}
				<Atom f={f} at={v(0, 0)} r={0.36} fill={ATOM_FILL.C}>
					C
				</Atom>
				{polare && <DipoleArrow f={f} from={v(0, 0)} to={sum} color={RESULTANT} weight="veryThick" />}
			</Drawing>
			<Readout>
				<Tex>{mol.tex}</Tex>
				<span>{mol.nome}</span>
				<span>{polare ? 'molecola polare' : 'molecola apolare'}</span>
				<span>
					<Tex>{'\\mu'}</Tex> misurato: {mol.mu === 0 ? '0' : `${num(mol.mu, 2)} D`}
				</span>
			</Readout>
			<Caption>
				{n === 0
					? 'Nessun legame polare: i legami C–H si contano come apolari, e la molecola è apolare.'
					: n === 4
						? 'Quattro frecce uguali verso i vertici di un tetraedro: la somma è zero, e la molecola è apolare anche se i suoi legami sono polari.'
						: `La freccia arancione è la somma delle frecce blu: vale ${num(size, 2)} ${size > 1.01 ? 'volte' : 'volta'} il dipolo di un legame C–Cl.${n === 3 ? " Tre frecce di un tetraedro valgono quanto la quarta, quella che manca, cambiata di verso: la somma punta dalla parte opposta all'idrogeno." : ''}`}
			</Caption>
			<Controls>
				<Pills
					label="Molecola"
					options={MOLS.map((m) => ({ value: String(m.n), label: m.label }))}
					value={cl.every((x, i) => x === i < n) ? String(n) : null}
					onChange={(k) => setCl([0, 1, 2, 3].map((i) => i < Number(k)))}
				/>
				<p className="m-0 text-center text-xs text-fg-muted">Oppure premi su un atomo per cambiarlo da idrogeno a cloro e viceversa.</p>
			</Controls>
		</Figure>
	);
}
