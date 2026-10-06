'use client';

import { Drawing, frame, v, THICK, FONT, type V } from '@/components/content/interactive/kit';
import { AssiPV, PuntoStato, Verso, lineaPV, puntoPV, tratto, type PianoPV, type Stato } from '@/components/content/interactive/fisica/pianoPV';
import type { SceneProps } from '.';

/**
 * A Carnot cycle to scale in the pressure-volume plane (third year, group 43: fis-ciclo-carnot, level 6), drawn like
 * the lesson's TikZ figure `ciclo-carnot-piano-pv`: the isotherm A → B, the adiabat B → C, the isotherm C → D, the
 * adiabat D → A, clockwise, with the two temperatures written next to their isotherms. The plane's pieces are group
 * 41's (pianoPV.tsx); its scene `piano-pv` places the names away from the middle of the figure, which on a cycle this
 * thin puts B on top of D, so the names here have fixed sides. No area is filled and no heat is written: the drawing
 * gives the data, not the work.
 *
 *   { type: 'ciclo-carnot', data: {
 *       V: { unita: 'L', passo: 2, celle: 7, etichette: 2 },
 *       p: { unita: 'kPa', passo: 200, celle: 6, etichette: 2 },
 *       stati: [{ nome: 'A', V: 1.5, p: 850.9 }, { nome: 'B', … }, { nome: 'C', … }, { nome: 'D', … }],
 *       gamma: 5 / 3,                                    // of the adiabats (default 5/3)
 *       temperature: { calda: '512 K', fredda: '278 K' } } }
 */
type Axis = { unita: string; passo: number; celle: number; etichette?: number };
type Named = Stato & { nome: string };

const isAxis = (a: unknown): a is Axis => !!a && typeof a === 'object' && Number((a as Axis).passo) > 0 && Number((a as Axis).celle) > 0;
const DIR: Record<string, V> = { A: v(-0.9, 0.45), B: v(0.7, 0.7), C: v(-0.2, 1), D: v(-0.7, -0.7) };

export default function CicloCarnotPV({ data, alt }: SceneProps) {
	const stati = (Array.isArray(data.stati) ? data.stati : []).filter((s): s is Named => !!s && typeof s === 'object' && typeof (s as Named).nome === 'string' && Number.isFinite((s as Named).V) && Number.isFinite((s as Named).p));
	const by = new Map(stati.map((s) => [s.nome, s]));
	const A = by.get('A'), B = by.get('B'), C = by.get('C'), D = by.get('D');
	if (!isAxis(data.V) || !isAxis(data.p) || !A || !B || !C || !D) return <p className="sr-only">{alt}</p>;
	const X = data.V, Y = data.p;
	const cx = Math.min(0.7, 5.6 / X.celle), cy = Math.min(0.55, 4.4 / Y.celle);
	const piano: PianoPV = { sx: cx / X.passo, sy: cy / Y.passo, vMax: X.celle * X.passo, pMax: Y.celle * Y.passo, vPasso: X.passo, pPasso: Y.passo, vOgni: X.etichette ?? 1, pOgni: Y.etichette ?? 1, vUnita: X.unita, pUnita: Y.unita };
	const f = frame(-1.05, X.celle * cx + 0.75, -0.95, Y.celle * cy + 0.85);
	const gamma = typeof data.gamma === 'number' && data.gamma > 1 ? data.gamma : 5 / 3;
	const legs = [tratto('isoterma', A, B), tratto('adiabatica', B, C, gamma), tratto('isoterma', C, D), tratto('adiabatica', D, A, gamma)];
	const T = (data.temperature && typeof data.temperature === 'object' ? data.temperature : {}) as { calda?: unknown; fredda?: unknown };
	const word = (at: V, s: unknown, anchor: 'start' | 'end') => {
		if (typeof s !== 'string' || !s) return null;
		const p = f.px(at);
		return (
			<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={12} fontFamily={FONT}>
				{s}
			</text>
		);
	};
	// The hot temperature beside the first part of A → B, on its outer side; the cold one after C, where C → D begins.
	const hot = puntoPV(piano, legs[0][Math.floor(legs[0].length * 0.3)]);
	const cold = puntoPV(piano, C);

	return (
		<Drawing f={f} label={alt}>
			<AssiPV f={f} a={piano} />
			{legs.map((l, i) => (
				<path key={i} d={lineaPV(f, piano, l)} stroke="#000" strokeWidth={THICK} fill="none" strokeLinecap="round" />
			))}
			{legs.map((l, i) => (
				<Verso key={i} f={f} a={piano} stati={l} />
			))}
			{stati.map((s) => (
				<PuntoStato key={s.nome} f={f} at={puntoPV(piano, s)} nome={s.nome} dir={DIR[s.nome] ?? v(0.7, 0.7)} />
			))}
			{word(v(hot.x + 0.22, hot.y + 0.18), T.calda, 'start')}
			{word(v(cold.x + 0.2, cold.y + 0.02), T.fredda, 'start')}
		</Drawing>
	);
}
