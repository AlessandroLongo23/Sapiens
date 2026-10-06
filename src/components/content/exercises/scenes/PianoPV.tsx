'use client';

import { Drawing, frame, v, add, sub, scale, unit, len, THICK, TINT, type V } from '@/components/content/interactive/kit';
import { QTY } from '@/components/content/interactive/fisica';
import { AssiPV, PuntoStato, Verso, areaSotto, lineaPV, puntoPV, tratto, type PianoPV as Piano, type Stato, type TipoTratto } from '@/components/content/interactive/fisica/pianoPV';
import type { SceneProps } from '.';

/**
 * The pressure-volume plane of a thermodynamics exercise (third year, group 41: fis-lavoro-termodinamico,
 * principi-termo, fis-trasformazioni-termodinamiche; made for the neighbouring lessons too): a squared sheet with
 * the volume across and the pressure up, numbered ticks, the states as named dots and the transformations between
 * them as lines with an arrow for their direction. Values are in the exercise's units.
 *
 *   { type: 'piano-pv', data: {
 *       V: { unita: 'L', passo: 1, celle: 8, etichette: 1 },
 *       p: { unita: 'kPa', passo: 50, celle: 8, etichette: 2 },
 *       stati: [{ nome: 'A', V: 2, p: 300 }, { nome: 'B', V: 6, p: 100 }],
 *       tratti: [{ da: 'A', a: 'B', tipo: 'retta' }],      // or 'isoterma', or 'adiabatica' with gamma (default 5/3)
 *       area: 'sotto' } }                                    // or 'ciclo'; only for the solution's scene
 *
 * A straight `retta` is an isobar when horizontal and an isochore when vertical. An `isoterma` follows p V = constant
 * and an `adiabatica` p V^γ = constant from the state `da` to the volume of the state `a`, which must lie on the
 * curve. Unit names are plain text (Unicode: m³, 10⁵ Pa), not LaTeX. `area` fills what the work is: `sotto` the
 * region between each line and the volume axis, `ciclo` the region the lines enclose. The scene draws the data,
 * never the answer: leave `area` out of the problem's scene.
 */
type Axis = { unita: string; passo: number; celle: number; etichette?: number };
type Named = Stato & { nome: string };
type Leg = { da: string; a: string; tipo?: TipoTratto; gamma?: number };

const isAxis = (a: unknown): a is Axis => !!a && typeof a === 'object' && Number((a as Axis).passo) > 0 && Number((a as Axis).celle) > 0;

export default function PianoPV({ data, alt }: SceneProps) {
	if (!isAxis(data.V) || !isAxis(data.p)) return <p className="sr-only">{alt}</p>;
	const X = data.V, Y = data.p;
	const cx = Math.min(0.7, 5.6 / X.celle), cy = Math.min(0.55, 4.4 / Y.celle);
	const piano: Piano = { sx: cx / X.passo, sy: cy / Y.passo, vMax: X.celle * X.passo, pMax: Y.celle * Y.passo, vPasso: X.passo, pPasso: Y.passo, vOgni: X.etichette ?? 1, pOgni: Y.etichette ?? 1, vUnita: X.unita, pUnita: Y.unita };
	const Lx = X.celle * cx, Ly = Y.celle * cy;
	const f = frame(-1.05, Lx + 0.6, -0.95, Ly + 0.85);

	const stati: Named[] = (Array.isArray(data.stati) ? data.stati : []).filter((s): s is Named => !!s && typeof s === 'object' && typeof (s as Named).nome === 'string' && Number.isFinite((s as Named).V) && Number.isFinite((s as Named).p));
	const by = new Map(stati.map((s) => [s.nome, s]));
	const legs = (Array.isArray(data.tratti) ? (data.tratti as Leg[]) : []).flatMap((t) => {
		const A = by.get(t.da), B = by.get(t.a);
		return A && B ? [tratto(t.tipo ?? 'retta', A, B, t.gamma)] : [];
	});

	// Names go away from the middle of the figure, so they stay off the lines.
	const P = stati.map((s) => puntoPV(piano, s));
	const centre = P.length ? scale(P.reduce((a, b) => add(a, b), v(0, 0)), 1 / P.length) : v(0, 0);
	const dirOf = (p: V) => {
		const d = sub(p, centre);
		if (len(d) < 0.05) return v(0.7, 0.7);
		const u = unit(d);
		return Math.abs(u.y) < 0.35 ? unit(v(u.x, 0.6)) : u;
	};

	return (
		<Drawing f={f} label={alt}>
			{data.area === 'sotto' && legs.map((l, i) => <path key={i} d={areaSotto(f, piano, l)} fill={TINT.orange} stroke="none" />)}
			{data.area === 'ciclo' && legs.length > 0 && <path d={f.path(legs.flatMap((l) => l.map((s) => puntoPV(piano, s))), true)} fill={TINT.orange} stroke="none" />}
			<AssiPV f={f} a={piano} />
			{legs.map((l, i) => (
				<g key={i}>
					<path d={lineaPV(f, piano, l)} stroke={QTY.vettore} strokeWidth={THICK * 1.2} fill="none" strokeLinejoin="round" />
					<Verso f={f} a={piano} stati={l} color={QTY.vettore} />
				</g>
			))}
			{stati.map((s, i) => (
				<PuntoStato key={s.nome} f={f} at={P[i]} nome={s.nome} dir={dirOf(P[i])} />
			))}
		</Drawing>
	);
}
