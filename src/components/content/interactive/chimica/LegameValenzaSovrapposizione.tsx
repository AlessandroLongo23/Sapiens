'use client';

import { useId, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, clamp, DASH, THICK, THIN, type V } from '../kit';
import { circlePath, lobePath, Pills, SIGN_FILL, OVERLAP, CANCEL } from './chim3-g-pezzi';

/**
 * Lesson 70 (Teoria del legame di valenza): two orbitals brought together. The student picks the pair (s with s, s
 * with a p along the axis, two p head on, two p side by side, s beside a p) and slides the nuclei closer. Each lobe
 * has the tint of its sign, as in lesson 52; where two lobes of the same sign overlap the zone is orange, where two
 * of opposite sign overlap it is grey. On the axis: a sigma bond. Above and below it: a pi bond. Orange and grey in
 * equal parts (s beside p): the contributions cancel, no bond.
 *
 * The overlap zones are the lobes of one atom clipped by those of the other. Distances are schematic: the slider goes
 * from far apart (0%) to the bond distance (100%).
 */

type Case = 'ss' | 'sp' | 'pp' | 'pi' | 'spi';
type Shape = { kind: 's' } | { kind: 'p'; th: number };
const CASES: Record<Case, { label: string; a: Shape; b: Shape; bond: number; contact: number; type: 'sigma' | 'pi' | 'none'; nome: string }> = {
	ss: { label: 's + s', a: { kind: 's' }, b: { kind: 's' }, bond: 0.85, contact: 1.4, type: 'sigma', nome: 'due orbitali s' },
	sp: { label: 's + p', a: { kind: 's' }, b: { kind: 'p', th: Math.PI }, bond: 1.25, contact: 1.95, type: 'sigma', nome: "un orbitale s e un orbitale p lungo l'asse" },
	pp: { label: 'p + p di testa', a: { kind: 'p', th: 0 }, b: { kind: 'p', th: Math.PI }, bond: 1.7, contact: 2.5, type: 'sigma', nome: "due orbitali p lungo l'asse" },
	pi: { label: 'p + p di fianco', a: { kind: 'p', th: Math.PI / 2 }, b: { kind: 'p', th: Math.PI / 2 }, bond: 0.8, contact: 1.16, type: 'pi', nome: 'due orbitali p paralleli' },
	spi: { label: 's + p di fianco', a: { kind: 's' }, b: { kind: 'p', th: Math.PI / 2 }, bond: 0.75, contact: 1.28, type: 'none', nome: "un orbitale s e un orbitale p perpendicolare all'asse" },
};
const FAR = 3.3;
const RS = 0.7; // radius of an s orbital
const LP = 1.25, WP = 0.58; // length and half width of a p lobe

const f = frame(-3.35, 3.35, -1.65, 1.65);

/** The pieces of an orbital at `at`: outlines with their sign. A p orbital's first lobe (direction th) is positive. */
function pieces(s: Shape, at: V): { d: string; plus: boolean }[] {
	if (s.kind === 's') return [{ d: circlePath(f, at, RS), plus: true }];
	return [
		{ d: lobePath(f, at, s.th, LP, WP), plus: true },
		{ d: lobePath(f, at, s.th + Math.PI, LP, WP), plus: false },
	];
}

export default function LegameValenzaSovrapposizione({ alt }: { alt?: string }) {
	const [kind, setKind] = useState<Case>('ss');
	const [near, setNear] = useState(0);
	const id = useId().replace(/[^a-zA-Z0-9]/g, '');
	const c = CASES[kind];
	const D = FAR + (c.bond - FAR) * (near / 100);
	const A = v(-D / 2, 0), B = v(D / 2, 0);
	const pa = pieces(c.a, A), pb = pieces(c.b, B);
	const overlap = clamp((c.contact - D) / (c.contact - c.bond), 0, 1);
	const pA = f.px(A), pB = f.px(B);

	const stato = overlap === 0 ? 'nessuna' : near >= 100 ? 'massima' : 'parziale';
	const legame = overlap === 0 ? 'gli orbitali non si toccano ancora' : c.type === 'sigma' ? 'legame σ' : c.type === 'pi' ? 'legame π' : 'nessun legame';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					{pa.map((p, i) => (
						<clipPath key={i} id={`${id}-a${i}`}>
							<path d={p.d} />
						</clipPath>
					))}
				</defs>
				<path d={f.path([v(f.x0 + 0.1, 0), v(f.x1 - 0.1, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				{[...pa, ...pb].map((p, i) => (
					<path key={i} d={p.d} fill={p.plus ? SIGN_FILL.plus : SIGN_FILL.minus} />
				))}
				{/* the overlap of every piece of A with every piece of B */}
				{pa.map((p, i) => pb.map((q, j) => <path key={`${i}-${j}`} d={q.d} clipPath={`url(#${id}-a${i})`} fill={p.plus === q.plus ? OVERLAP : CANCEL} />))}
				{[...pa, ...pb].map((p, i) => (
					<path key={i} d={p.d} fill="none" stroke="#000" strokeWidth={THICK} />
				))}
				<circle cx={pA.x} cy={pA.y} r={2.4} fill="#000" />
				<circle cx={pB.x} cy={pB.y} r={2.4} fill="#000" />
			</Drawing>
			<Readout>
				<span>sovrapposizione: {stato}</span>
				<span>{legame}</span>
				{overlap > 0 && c.type !== 'none' && <Tex>{c.type === 'sigma' ? '\\sigma' : '\\pi'}</Tex>}
			</Readout>
			<Caption>
				{overlap === 0
					? `Con ${c.nome} ancora lontani non c'è sovrapposizione: avvicina i nuclei.`
					: c.type === 'sigma'
						? `La zona arancione, dove si sovrappongono due lobi dello stesso segno, sta sull'asse tra i due nuclei: ${c.nome} formano un legame σ.`
						: c.type === 'pi'
							? "Le zone arancioni sono due, una sopra e una sotto l'asse, e sull'asse non c'è sovrapposizione: due orbitali p paralleli formano un legame π."
							: "L'orbitale s si sovrappone a un lobo dello stesso segno (zona arancione) e a uno di segno opposto (zona grigia), in parti uguali: i due contributi si annullano e non nasce nessun legame."}
			</Caption>
			<Controls>
				<Pills label="Orbitali" options={(Object.keys(CASES) as Case[]).map((k) => ({ value: k, label: CASES[k].label }))} value={kind} onChange={setKind} />
				<Slider label="Avvicinamento" value={near} min={0} max={100} step={1} unit="%" onChange={setNear} />
			</Controls>
		</Figure>
	);
}
