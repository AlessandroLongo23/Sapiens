'use client';

import { useState } from 'react';
import { elementBySymbol } from '@/lib/tools/tavola-periodica';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, frame, v, K, TINT, THICK, THIN } from '../kit';

/**
 * Lesson 59 (Raggio atomico ed energia di ionizzazione): an atom and its most common ion, drawn to scale side by
 * side. The student picks the element; under each circle the radius, the protons and the electrons. Cations come out
 * smaller than their atom, anions larger, and the protons never change.
 *
 * Atomic radii from the site's periodic table (covalent radii, elementi.json); ionic radii are those of the lesson
 * (Shannon's radii for six neighbours, rounded to the picometre: to be checked, as the lesson's notes say).
 */

const IONS: { sym: string; charge: number; r: number }[] = [
	{ sym: 'Li', charge: 1, r: 76 },
	{ sym: 'Na', charge: 1, r: 102 },
	{ sym: 'K', charge: 1, r: 138 },
	{ sym: 'Mg', charge: 2, r: 72 },
	{ sym: 'Ca', charge: 2, r: 100 },
	{ sym: 'Al', charge: 3, r: 54 },
	{ sym: 'O', charge: -2, r: 140 },
	{ sym: 'S', charge: -2, r: 184 },
	{ sym: 'F', charge: -1, r: 133 },
	{ sym: 'Cl', charge: -1, r: 181 },
	{ sym: 'Br', charge: -1, r: 196 },
];

const SCALE = 0.0075; // cm per pm: potassium, 196 pm, is 1,47 cm
const f = frame(-3.9, 3.9, -2.55, 1.7);
const sup = (q: number) => `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`;

export default function RaggioAtomoIone({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('Na');
	const ion = IONS.find((i) => i.sym === sym)!;
	const el = elementBySymbol(sym)!;
	const ra = el.radius ?? 0;
	const cation = ion.charge > 0;
	const n = Math.abs(ion.charge);
	const A = v(-1.9, 0), B = v(1.9, 0);
	const pa = f.px(A), pb = f.px(B);
	const rows = (at: typeof A, r: number, e: number) => (
		<>
			<Label f={f} at={v(at.x, -1.62)} dir={v(0, -1)} upright size={13}>{`${r} pm`}</Label>
			<Label f={f} at={v(at.x, -2.0)} dir={v(0, -1)} upright size={12}>{`${el.z} protoni, ${e} elettroni`}</Label>
		</>
	);
	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<circle cx={pa.x} cy={pa.y} r={ra * SCALE * K} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				<circle cx={pb.x} cy={pb.y} r={ion.r * SCALE * K} fill={cation ? TINT.orange : TINT.green} stroke="#000" strokeWidth={THICK} />
				<text x={pa.x} y={pa.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily="KaTeX_Main, serif">
					{sym}
				</text>
				<text x={pb.x} y={pb.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily="KaTeX_Main, serif">
					{sym}
					<tspan dy="-0.5em" fontSize={11}>
						{sup(ion.charge).replace('-', '−')}
					</tspan>
				</text>
				<path d={f.path([v(-0.25, 0), v(0.25, 0)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(0.13, 0.09), v(0.25, 0), v(0.13, -0.09)])} stroke="#000" strokeWidth={THIN} fill="none" />
				{rows(A, ra, el.z)}
				{rows(B, ion.r, el.z - ion.charge)}
			</Drawing>
			<Readout>
				<Tex>{`\\mathrm{${sym}} \\to \\mathrm{${sym}^{${sup(ion.charge)}}}`}</Tex>
				<span>{cation ? `perde ${n === 1 ? 'un elettrone' : `${n} elettroni`}` : `acquista ${n === 1 ? 'un elettrone' : `${n} elettroni`}`}</span>
				<span>{`raggio: da ${ra} a ${ion.r} pm`}</span>
			</Readout>
			<Caption>
				{cation
					? `Il catione è più piccolo dell'atomo: ${el.z} protoni trattengono ${el.z - ion.charge} elettroni invece di ${el.z}, e il livello esterno si è svuotato.`
					: `L'anione è più grande dell'atomo: gli stessi ${el.z} protoni devono trattenere ${el.z - ion.charge} elettroni, che si respingono di più.`}
			</Caption>
			<Controls>
				<div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Elemento">
					{IONS.map((i) => (
						<button
							key={i.sym}
							type="button"
							onClick={() => setSym(i.sym)}
							aria-pressed={sym === i.sym}
							className={`min-w-10 rounded-full border px-3 py-1.5 text-sm transition-colors ${sym === i.sym ? 'border-accent bg-accent text-white' : 'border-edge text-fg-muted hover:border-fg-muted'}`}
						>
							{i.sym}
						</button>
					))}
				</div>
			</Controls>
		</Figure>
	);
}
