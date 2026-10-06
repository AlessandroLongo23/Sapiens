'use client';

import { useState } from 'react';
import { COVALENT_HYDRIDES, HYDRACIDS, metal, metalHydride, type Compound } from '@/lib/exercises/v2/chim3-i';
import { Caption, Controls, Drawing, Figure, FONT, INK, Readout, Tex, frame, v } from '../kit';
import { Line, NamesTable, Picker, Symbol } from './chim3-i-nomi';

/**
 * Lesson 78 (Idruri e idracidi): the student picks the element bound to hydrogen. The scale of electronegativity,
 * the same as the TikZ figure before it, marks hydrogen and the element, with an arrow towards the more
 * electronegative of the two: that is where the bonding electrons are counted. Under the scale the formula with the
 * oxidation numbers above the symbols; then the family and the names. Electronegativities from
 * src/lib/tools/elementi.json (Pauling).
 */

const CHI: Record<string, number> = { Li: 0.98, Na: 0.93, K: 0.82, Mg: 1.31, Ca: 1.0, Al: 1.61, C: 2.55, Si: 1.9, N: 3.04, P: 2.19, S: 2.58, F: 3.98, Cl: 3.16, Br: 2.96, I: 2.66 };
const CHI_H = 2.2;
const SYMS = Object.keys(CHI);
const METALLIC = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'];

function compound(sym: string): Compound {
	if (METALLIC.includes(sym)) {
		const m = metal(sym);
		return metalHydride(m, m.ox[0]);
	}
	const c = [...COVALENT_HYDRIDES, ...HYDRACIDS].find((x) => x.sym === sym);
	if (!c) throw new Error(`no hydride of ${sym}`);
	return c;
}

const U = 2.15; // centimetres per unit of electronegativity
const X0 = 0.5;
const f = frame(-0.2, (4.2 - X0) * U + 0.55, -2.65, 1.95);
const x = (chi: number) => (chi - X0) * U;

export default function IdruriIdracidiScegli({ alt }: { alt?: string }) {
	const [sym, setSym] = useState('Na');
	const c = compound(sym);
	const chi = CHI[sym];
	const acid = c.classe === 'idracido';
	// the oxidation number of hydrogen: -1 with a metal, and with silicon; +1 otherwise
	const oxH = c.classe === 'idruro metallico' || sym === 'Si' ? -1 : 1;
	const oxE = c.no;
	const nH = c.count[1];
	const close = Math.abs(chi - CHI_H) < 0.3;
	const toH = chi < CHI_H;
	const tie = sym === 'P';

	const axisY = 0;
	const a = f.px(v(x(X0), axisY));
	const b = f.px(v(x(4.2), axisY));
	const hP = f.px(v(x(CHI_H), axisY));
	const eP = f.px(v(x(chi), axisY));
	const eLabelY = close ? 1.45 : 0.65;
	const eTop = f.px(v(x(chi), eLabelY));
	const hTop = f.px(v(x(CHI_H), 0.65));
	const arrowY = f.px(v(0, -0.7)).y;

	const family = c.classe;
	const where = toH ? 'all’idrogeno' : /^[aeiou]/.test(c.nome) && c.nome !== 'iodio' ? `all’${c.nome}` : /^(z|io)/.test(c.nome) ? `allo ${c.nome}` : `al ${c.nome}`;
	const caption = tie
		? 'Fosforo e idrogeno hanno quasi la stessa elettronegatività: il legame è quasi apolare, e per convenzione i numeri di ossidazione si contano come nell’ammoniaca.'
		: sym === 'Si'
			? 'Il silicio è meno elettronegativo dell’idrogeno: nel silano l’idrogeno ha −1, anche se il composto è fatto di molecole e si chiama idruro covalente.'
			: `Gli elettroni di legame si contano ${where}, che è più elettronegativo: l’idrogeno ha ${oxH > 0 ? '+1' : '−1'} e nella formula sta a ${acid ? 'sinistra' : 'destra'}.`;

	// the formula, drawn symbol by symbol so that each has its oxidation number above it
	const first = acid ? { sym: 'H', sub: nH, ox: oxH } : { sym, sub: 1, ox: oxE };
	const second = acid ? { sym, sub: 1, ox: oxE } : { sym: 'H', sub: nH, ox: oxH };
	const mid = (f.x0 + f.x1) / 2;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<marker id="idruri-punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
						<path d="M0,1 L10,5 L0,9 Z" fill="#000" />
					</marker>
				</defs>
				<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" strokeWidth={1.2} markerEnd="url(#idruri-punta)" />
				<text x={b.x + 8} y={b.y} dy="0.35em" fontSize={15} fontStyle="italic" fontFamily={FONT} fill="#000">
					χ
				</text>
				{[1, 2, 3, 4].map((k) => {
					const p = f.px(v(x(k), axisY));
					return (
						<g key={k}>
							<line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke="#000" strokeWidth={0.6} />
							<text x={p.x} y={p.y + 20} textAnchor="middle" fontSize={13} fontFamily={FONT} fill="#000">
								{k}
							</text>
						</g>
					);
				})}
				<line x1={hP.x} y1={hP.y} x2={hTop.x} y2={hTop.y} stroke="#000" strokeWidth={0.6} />
				<circle cx={hP.x} cy={hP.y} r={3.2} fill="#000" />
				<text x={hTop.x} y={hTop.y - 5} textAnchor="middle" fontSize={15} fontFamily={FONT} fill="#000">
					H
				</text>
				<line x1={eP.x} y1={eP.y} x2={eTop.x} y2={eTop.y} stroke="#000" strokeWidth={0.6} />
				<circle cx={eP.x} cy={eP.y} r={3.2} fill={INK.orange} stroke="#000" strokeWidth={0.6} />
				<text x={eTop.x} y={eTop.y - 5} textAnchor="middle" fontSize={15} fontFamily={FONT} fill="#000">
					{sym}
				</text>
				{!tie && <line x1={toH ? eP.x : hP.x} y1={arrowY} x2={toH ? hP.x : eP.x} y2={arrowY} stroke="#000" strokeWidth={0.9} markerEnd="url(#idruri-punta)" />}
				<text x={(hP.x + eP.x) / 2} y={arrowY + 16} textAnchor="middle" fontSize={12} fontFamily={FONT} fill="#000">
					{tie ? 'quasi uguali' : 'elettroni di legame'}
				</text>
				<Symbol f={f} at={v(mid - 0.45, -2.15)} sym={first.sym} sub={first.sub} ox={first.ox} />
				<Symbol f={f} at={v(mid + 0.45, -2.15)} sym={second.sym} sub={second.sub} ox={second.ox} />
			</Drawing>

			<p className="m-0 text-center text-lg text-fg">
				<Tex>{c.tex}</Tex>
			</p>
			<Readout>
				<Line label="elettronegatività:">
					<Tex>{`\\chi(\\mathrm{H}) = 2{,}20`}</Tex>, <Tex>{`\\chi(\\mathrm{${sym}}) = ${chi.toFixed(2).replace('.', '{,}')}`}</Tex>
				</Line>
				<Line label="famiglia:">{family}</Line>
			</Readout>
			<NamesTable trad={c.trad} stock={c.stock} iupac={c.iupac} />
			<Caption>{caption}</Caption>

			<Controls>
				<Picker label="Elemento legato all’idrogeno" items={SYMS} value={sym} onPick={setSym} />
			</Controls>
		</Figure>
	);
}
