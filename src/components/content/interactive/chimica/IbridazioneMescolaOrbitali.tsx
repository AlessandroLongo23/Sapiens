'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, add, len, ang, THICK, THIN, type V } from '../kit';
import { Arrow } from '../fisica';
import { HYBRID, Lobe, SIGN_FILL } from './chim3-g-pezzi';

/**
 * Lesson 71 (L'ibridazione degli orbitali): the carbon atom with its 2s orbital mixed with three, two or one of its
 * 2p orbitals. On the left the box diagram: the hybrid boxes (orange, four, three or two) and above them the 2p
 * orbitals left out of the mixing, each with one electron. On the right the orbitals around the nucleus: the hybrid
 * lobes, orange, towards the vertices of a tetrahedron, of a triangle in a plane seen from above, or on a line, and
 * the remaining p orbitals with their two lobes tinted by sign. Hybrids plus remaining p orbitals always make four.
 *
 * The lobes are placed in three dimensions and drawn with one oblique projection; the small back lobe of each hybrid
 * is left out, as in the lesson's drawings.
 */

type Hyb = 'sp3' | 'sp2' | 'sp';
type P3 = [number, number, number];
const proj = ([x, y, z]: P3): V => v(x - 0.4 * z, y - 0.32 * z);
const deg = (a: number) => (a * Math.PI) / 180;
const T = Math.sqrt(8) / 3;

const DATA: Record<Hyb, { label: string; tex: string; n: number; angolo: string; hybrids: P3[]; p: P3[]; esempio: string; forma: string }> = {
	sp3: {
		label: 'sp³',
		tex: 'sp^3',
		n: 4,
		angolo: '109,5°',
		hybrids: [[0, 1, 0], [T * Math.cos(deg(330)), -1 / 3, T * Math.sin(deg(330))], [T * Math.cos(deg(210)), -1 / 3, T * Math.sin(deg(210))], [0, -1 / 3, T]],
		p: [],
		esempio: 'il carbonio del metano',
		forma: 'verso i vertici di un tetraedro',
	},
	sp2: {
		label: 'sp²',
		tex: 'sp^2',
		n: 3,
		angolo: '120°',
		hybrids: [[Math.cos(deg(330)), 0, Math.sin(deg(330))], [Math.cos(deg(210)), 0, Math.sin(deg(210))], [0, 0, 1]],
		p: [[0, 1, 0]],
		esempio: "i carboni dell'etene",
		forma: 'in un piano, verso i vertici di un triangolo',
	},
	sp: {
		label: 'sp',
		tex: 'sp',
		n: 2,
		angolo: '180°',
		hybrids: [[1, 0, 0], [-1, 0, 0]],
		p: [[0, 1, 0], [0, 0, 1]],
		esempio: "i carboni dell'etino",
		forma: 'su una retta, in versi opposti',
	},
};

const f = frame(-4.05, 4.05, -2.0, 2.1);
const N = v(1.9, 0); // the nucleus
const LH = 1.55, WH = 0.5; // a hybrid lobe
const LP = 1.25, WP = 0.3; // a remaining p lobe
const U = 0.6; // side of a box

/** A box of the diagram with one electron, its bottom left corner at (x, y). */
function Box({ x, y, fill }: { x: number; y: number; fill: string }) {
	const a = f.px(v(x, y + U));
	const K = f.W / (f.x1 - f.x0);
	return (
		<g>
			<rect x={a.x} y={a.y} width={U * K} height={U * K} fill={fill} stroke="#000" strokeWidth={THICK} />
			<Arrow f={f} from={v(x + U / 2, y + 0.1)} to={v(x + U / 2, y + U - 0.1)} />
		</g>
	);
}

export default function IbridazioneMescolaOrbitali({ alt }: { alt?: string }) {
	const [hyb, setHyb] = useState<Hyb>('sp3');
	const d = DATA[hyb];
	const rest = 4 - d.n;
	const x0 = -3.6;
	// orbitals from the back to the front
	const lobes = [
		...d.hybrids.map((dir) => ({ dir, kind: 'h' as const, z: dir[2] })),
		...d.p.flatMap((dir) => [
			{ dir, kind: 'p+' as const, z: dir[2] },
			{ dir: [-dir[0], -dir[1], -dir[2]] as P3, kind: 'p-' as const, z: -dir[2] },
		]),
	].sort((a, b) => a.z - b.z);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the box diagram */}
				<Arrow f={f} from={v(-3.9, -1.2)} to={v(-3.9, 1.6)} weight="thin" />
				<Label f={f} at={v(-3.9, 1.6)} dir={v(0, 1)} size={13}>
					E
				</Label>
				{Array.from({ length: d.n }, (_, i) => (
					<Box key={`h${i}`} x={x0 + i * U} y={-0.6} fill={HYBRID} />
				))}
				<Label f={f} at={v(x0 + (d.n * U) / 2, -0.6)} dir={v(0, -1)} size={13}>
					{d.label}
				</Label>
				{Array.from({ length: rest }, (_, i) => (
					<Box key={`p${i}`} x={x0 + (d.n + i) * U + 0.15 - (hyb === 'sp' ? 0 : 0)} y={0.5} fill="none" />
				))}
				{rest > 0 && (
					<Label f={f} at={v(x0 + (d.n + rest / 2) * U + 0.15, 0.5 + U)} dir={v(0, 1)} size={13}>
						2p
					</Label>
				)}
				<path d={f.path([v(-0.75, -1.8), v(-0.75, 1.9)])} stroke="#000" strokeWidth={THIN} strokeDasharray="1 4" />
				{/* the orbitals */}
				{lobes.map((l, i) => {
					const q = proj(l.dir);
					return l.kind === 'h' ? (
						<Lobe key={i} f={f} at={N} th={ang(q)} L={LH * len(q)} w={WH} fill={HYBRID} />
					) : (
						<Lobe key={i} f={f} at={N} th={ang(q)} L={LP * len(q)} w={WP * (0.6 + 0.4 * len(q))} fill={l.kind === 'p+' ? SIGN_FILL.plus : SIGN_FILL.minus} thin />
					);
				})}
				<circle cx={f.px(N).x} cy={f.px(N).y} r={2.6} fill="#000" />
				{rest > 0 && (
					<Label f={f} at={add(N, v(0.2, LP * 0.95))} dir={v(1, 0)} size={13}>
						p
					</Label>
				)}
			</Drawing>
			<Readout>
				<span>
					ibridi <Tex>{d.tex}</Tex>: {d.n}
				</span>
				<span>angolo: {d.angolo}</span>
				<span>
					orbitali <Tex>{'p'}</Tex> rimasti: {rest}
				</span>
				<span>
					legami <Tex>{'\\pi'}</Tex> possibili: {rest}
				</span>
			</Readout>
			<Caption>
				{`L'orbitale 2s si mescola con ${hyb === 'sp3' ? 'tutti e tre gli orbitali 2p' : hyb === 'sp2' ? 'due orbitali 2p' : 'un solo orbitale 2p'}: nascono ${d.n} ibridi (in arancione), ${d.forma}. ${rest === 0 ? 'Non resta nessun orbitale p: solo legami σ.' : rest === 1 ? "Resta un orbitale p, perpendicolare al piano degli ibridi: può formare un legame π." : 'Restano due orbitali p, perpendicolari tra loro e agli ibridi: possono formare due legami π.'} È ${d.esempio}.`}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Ibridazione" options={(Object.keys(DATA) as Hyb[]).map((k) => ({ value: k, label: DATA[k].label }))} value={hyb} onChange={setHyb} />
				</div>
			</Controls>
		</Figure>
	);
}
