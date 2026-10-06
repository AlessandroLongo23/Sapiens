'use client';

import { useState } from 'react';
import { METALS, NON_METALS, anhydride, basicOxide, crossed, gcd, type Compound } from '@/lib/exercises/v2/chim3-i';
import { Caption, Controls, Drawing, Figure, FONT, K, Readout, Tex, frame, v } from '../kit';
import { Sphere } from './sfereDalton';
import { Line, NamesTable, NEG, Picker, POS, Symbol, signedText } from './chim3-i-nomi';

/**
 * Lesson 77 (Ossidi basici e ossidi acidi): the student picks an element and one of its oxidation numbers. The
 * drawing crosses the two oxidation numbers into the subscripts, as the TikZ figure of lesson 76 does, and puts the
 * atoms of the formula unit next to it; under it the formula (with the reduction, when the crossed subscripts have a
 * common divisor), the kind of oxide and its three names. Names and formulas come from the module of the exercises.
 */

const SYMS = ['Na', 'Ca', 'Al', 'Zn', 'Fe', 'Cu', 'Sn', 'Pb', 'C', 'Si', 'N', 'P', 'S', 'Cl', 'Br', 'I'];
const AMPHOTERIC = ['Al', 'Zn'];

function oxide(sym: string, n: number): Compound {
	const m = METALS.find((x) => x.sym === sym);
	if (m) return basicOxide(m, n);
	const x = NON_METALS.find((y) => y.sym === sym);
	if (!x) throw new Error(`no element ${sym}`);
	return anhydride(x, n);
}
const oxOf = (sym: string) => (METALS.find((x) => x.sym === sym) ?? NON_METALS.find((x) => x.sym === sym))?.ox ?? [];

const f = frame(0, 8.3, 0, 3.1);
const arrow = (color: string, id: string) => (
	<marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
		<path d="M0,1 L10,5 L0,9 Z" fill={color} />
	</marker>
);

export default function OssidiCostruisci({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('Fe');
	const [n, setN] = useState(3);
	const ox = oxOf(sym);
	const pick = (s: string) => {
		setSym(s);
		const next = oxOf(s);
		setN(next.includes(n) ? n : next[next.length - 1]);
	};
	const c = oxide(sym, n);
	const [a, b] = crossed(n, -2);
	const g = gcd(n, 2);
	const metal = METALS.some((x) => x.sym === sym);
	const kind = AMPHOTERIC.includes(sym) ? 'ossido anfotero (nei nomi, come un ossido basico)' : metal ? 'ossido basico' : 'ossido acido (anidride)';
	const raw = `\\mathrm{${sym}_{${2}}O_{${n}}}`;

	// the crossing, on the left: the symbols with their oxidation numbers above, the same symbols with the subscripts below
	const E1 = v(0.55, 2.45);
	const O1 = v(2.35, 2.45);
	const E2 = v(0.55, 0.75);
	const O2 = v(2.35, 0.75);
	const line = (from: { x: number; y: number }, to: { x: number; y: number }, color: string, id: string) => {
		const p = f.px(from);
		const q = f.px(to);
		return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth={0.9} markerEnd={`url(#${id})`} />;
	};
	const small = (at: { x: number; y: number }, text: string, color: string) => {
		const p = f.px(at);
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={15} fontFamily={FONT} fill={color}>
				{text}
			</text>
		);
	};
	const rowE = Array.from({ length: a }, (_, k) => v(4.6 + k * 0.62, 2.15));
	const rowO = Array.from({ length: b }, (_, k) => v(4.6 + k * 0.5, 1.2));
	const split = f.px(v(3.75, 0));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					{arrow(POS, 'ossidi-freccia-pos')}
					{arrow(NEG, 'ossidi-freccia-neg')}
				</defs>
				<Symbol f={f} at={E1} sym={sym} />
				<Symbol f={f} at={O1} sym="O" />
				{small(v(E1.x + 0.75, E1.y), signedText(n), POS)}
				{small(v(O1.x + 0.6, O1.y), signedText(-2), NEG)}
				<Symbol f={f} at={E2} sym={sym} />
				<Symbol f={f} at={O2} sym="O" />
				{small(v(E2.x + 0.55, E2.y - 0.22), '2', NEG)}
				{small(v(O2.x + 0.45, O2.y - 0.22), String(n), POS)}
				{line(v(E1.x + 0.75, E1.y - 0.28), v(O2.x + 0.45, O2.y + 0.08), POS, 'ossidi-freccia-pos')}
				{line(v(O1.x + 0.6, O1.y - 0.28), v(E2.x + 0.6, E2.y + 0.08), NEG, 'ossidi-freccia-neg')}
				<line x1={split.x} y1={0.25 * K} x2={split.x} y2={f.H - 0.25 * K} stroke="#000" strokeWidth={0.3} />
				{rowE.map((p, k) => (
					<Sphere key={`e${k}`} f={f} at={p} el={sym} r={0.27} />
				))}
				{rowO.map((p, k) => (
					<Sphere key={`o${k}`} f={f} at={p} el="O" r={0.22} />
				))}
				{small(v(6.0, 0.4), `${a === 1 ? '' : `${a} · `}(${signedText(n)}) + ${b === 1 ? '' : `${b} · `}(${signedText(-2)}) = 0`, '#000')}
			</Drawing>

			<p className="m-0 text-center text-lg text-fg">
				<Tex>{c.tex}</Tex>
			</p>
			<Readout>
				{g > 1 ? (
					<Line label="incrocio:">
						<Tex>{raw}</Tex>, e gli indici si dividono per {g}
					</Line>
				) : (
					<Line label="incrocio:">indici già ridotti</Line>
				)}
				<Line label="tipo:">{kind}</Line>
			</Readout>
			<NamesTable trad={c.trad} stock={c.stock} iupac={c.iupac} />
			<Caption>
				Il nome tradizionale e quello di Stock dicono il numero di ossidazione, {signedText(n)}; il nome IUPAC dice gli indici, {a} e {b}.
			</Caption>

			<Controls>
				<Picker label="Elemento" items={SYMS} value={sym} onPick={pick} />
				<Picker label="Numero di ossidazione" items={ox} value={n} onPick={setN} text={signedText} />
			</Controls>
		</Figure>
	);
}
