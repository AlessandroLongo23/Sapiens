import { q } from '@/lib/exercises/v2/rational';
import { fail, type Step } from './types';
import { decimal } from './numbers';
import { calc, div, int, mul, readMeasure, rowValue, shown, sqrt, val, valueText, vt, type FigureResult, type Pt, type Sketch, type Unit, type Val } from './geometria';

/**
 * Area and perimeter of a regular polygon, from 3 to 12 sides: from the side with the "numero fisso" (the ratio
 * apothem : side, the same for every polygon with that many sides), from the apothem, or from both.
 *
 * For the triangle, the square and the hexagon the apothem is exact (l√3/6, l/2, l√3/2). For the others the books
 * multiply by the fixed number rounded to three decimals (0,688 for the pentagon), and so does this tool, so that a
 * student gets the book's answer; those results are marked "≈".
 */

export interface PolygonSpec {
	n: number;
	/** "pentagono", "triangolo equilatero". */
	name: string;
	/** The fixed number apothem : side, as in the books' tables. */
	f: string;
}

export const POLYGONS: PolygonSpec[] = [
	{ n: 3, name: 'triangolo equilatero', f: '0,289' },
	{ n: 4, name: 'quadrato', f: '0,5' },
	{ n: 5, name: 'pentagono', f: '0,688' },
	{ n: 6, name: 'esagono', f: '0,866' },
	{ n: 7, name: 'ettagono', f: '1,038' },
	{ n: 8, name: 'ottagono', f: '1,207' },
	{ n: 9, name: 'ennagono', f: '1,374' },
	{ n: 10, name: 'decagono', f: '1,539' },
	{ n: 12, name: 'dodecagono', f: '1,866' }
];

export const polygonBySides = (n: number): PolygonSpec | undefined => POLYGONS.find((p) => p.n === n);

export type PolygonMode = 'lato' | 'apotema' | 'lato-apotema';

export const POLYGON_MODES: { value: PolygonMode; label: string; example: { a: string; b: string } }[] = [
	{ value: 'lato', label: 'Dal lato', example: { a: '10', b: '' } },
	{ value: 'apotema', label: "Dall'apotema", example: { a: '', b: '12' } },
	{ value: 'lato-apotema', label: 'Lato e apotema', example: { a: '8', b: '5,5' } }
];

export const POLYGON_EXAMPLES: { label: string; n: number; mode: PolygonMode; a: string; b: string }[] = [
	{ label: 'esagono l = 4', n: 6, mode: 'lato', a: '4', b: '' },
	{ label: 'ottagono l = 5', n: 8, mode: 'lato', a: '5', b: '' },
	{ label: 'triangolo a = 3', n: 3, mode: 'apotema', a: '', b: '3' },
	{ label: 'pentagono l = 6, a = 4,13', n: 5, mode: 'lato-apotema', a: '6', b: '4,13' }
];

const fixed = (p: PolygonSpec) => {
	const [i, d = ''] = p.f.split(',');
	return val(q(Number(i + d), 10 ** d.length));
};
const fTex = (p: PolygonSpec) => p.f.replace(',', '{,}');

/** The true ratio apothem : side, for drawing and for checking given data. */
const trueRatio = (n: number) => 1 / (2 * Math.tan(Math.PI / n));

const approxOnly = (x: number): Val => ({ c: null, r: 1, pi: 0, x });

/** A decimal rounded as it is shown (two decimals), so that the next steps use the number the student reads. */
const snapped = (x: number): Val => approxOnly(Number(shown(approxOnly(x)).approx!.text.replace(/\s/g, '').replace(',', '.')));

/** "del pentagono", "dell'ottagono". */
const of = (p: PolygonSpec) => (/^[aeiou]/.test(p.name) ? `dell'${p.name}` : `del ${p.name}`);

/** Area and perimeter of a regular polygon with n sides. `a` is the side, `b` the apothem. */
export function poligonoRegolare(n: number, mode: PolygonMode, values: { a?: string; b?: string }, u: Unit = ''): FigureResult {
	const p = polygonBySides(n);
	if (!p) return { outcome: fail('Scegli un poligono regolare da 3 a 12 lati, per esempio il pentagono.'), sketch: null };
	const steps: Step[] = [];
	const f = fixed(p);
	const exact = n === 3 || n === 4 || n === 6;
	let l: Val;
	let a: Val;
	const given = { l: mode !== 'apotema', a: mode !== 'lato' };
	const readL = () => readMeasure({ the: 'il lato', optional: false }, values.a);
	const readA = () => readMeasure({ the: "l'apotema", optional: false }, values.b);
	if (mode === 'apotema') {
		const r = readA();
		if (typeof r === 'string' || !r) return { outcome: fail(r ?? "Scrivi l'apotema."), sketch: null };
		a = r;
		if (n === 3) {
			l = mul(int(2), mul(a, sqrt(int(3))));
			steps.push({ say: "Ricava il lato: nel triangolo equilatero l'apotema è un terzo dell'altezza.", math: calc('l = \\dfrac{6a}{\\sqrt{3}}', ['2a\\sqrt{3}', `2 \\cdot ${vt(a)}\\sqrt{3}`], l, u) });
		} else if (n === 4) {
			l = mul(int(2), a);
			steps.push({ say: "Ricava il lato: nel quadrato l'apotema è metà lato.", math: calc('l = 2a', [`2 \\cdot ${vt(a)}`], l, u) });
		} else if (n === 6) {
			l = div(mul(int(2), a), sqrt(int(3)));
			steps.push({ say: "Ricava il lato: l'apotema è l'altezza di un triangolo equilatero.", math: calc('l = \\dfrac{2a}{\\sqrt{3}}', ['\\dfrac{2a\\sqrt{3}}{3}', `\\dfrac{2 \\cdot ${vt(a)}\\sqrt{3}}{3}`], l, u) });
		} else {
			l = snapped(a.x / f.x);
			steps.push({
				say: `Ricava il lato: dividi l'apotema per il numero fisso ${of(p)}.`,
				math: ['l = \\dfrac{a}{f}', `\\approx \\dfrac{${vt(a)}}{${fTex(p)}}`, `\\approx \\hl{${shown(l).approx!.tex}${u ? `\\,\\text{${u}}` : ''}}`]
			});
		}
	} else {
		const r = readL();
		if (typeof r === 'string' || !r) return { outcome: fail(r ?? 'Scrivi il lato.'), sketch: null };
		l = r;
		if (mode === 'lato-apotema') {
			const s = readA();
			if (typeof s === 'string' || !s) return { outcome: fail(s ?? "Scrivi l'apotema."), sketch: null };
			a = s;
		} else if (n === 3) {
			a = div(mul(l, sqrt(int(3))), int(6));
			steps.push({
				say: "Calcola l'apotema: nel triangolo equilatero è un terzo dell'altezza.",
				math: calc('a = \\dfrac{l\\sqrt{3}}{6}', [`\\dfrac{${vt(l)}\\sqrt{3}}{6}`], a, u),
				then: `Con il numero fisso viene quasi uguale: $a \\approx l \\cdot ${fTex(p)}$.`
			});
		} else if (n === 4) {
			a = div(l, int(2));
			steps.push({ say: "Calcola l'apotema: nel quadrato è metà lato.", math: calc('a = \\dfrac{l}{2}', [`\\dfrac{${vt(l)}}{2}`], a, u), then: 'Il numero fisso del quadrato è $0{,}5$.' });
		} else if (n === 6) {
			a = div(mul(l, sqrt(int(3))), int(2));
			steps.push({
				say: "Calcola l'apotema: è l'altezza di uno dei 6 triangoli equilateri.",
				math: calc('a = \\dfrac{l\\sqrt{3}}{2}', [`\\dfrac{${vt(l)}\\sqrt{3}}{2}`], a, u),
				then: `Con il numero fisso viene quasi uguale: $a \\approx l \\cdot ${fTex(p)}$.`
			});
		} else {
			a = snapped(l.x * f.x);
			steps.push({
				say: `Calcola l'apotema: moltiplica il lato per il numero fisso ${of(p)}.`,
				math: ['a = l \\cdot f', `\\approx ${vt(l)} \\cdot ${fTex(p)}`, `\\approx \\hl{${shown(a).approx!.tex}${u ? `\\,\\text{${u}}` : ''}}`],
				then: `Il numero fisso $f$ è il rapporto tra apotema e lato: è lo stesso in ogni ${p.name} regolare.`
			});
		}
	}
	const p2 = mul(int(n), l);
	const A = div(mul(p2, a), int(2));
	steps.push(
		{ say: `Calcola il perimetro: ${n === 8 ? 'gli' : 'i'} ${n} lati sono uguali.`, math: calc(`2p = ${n}l`, [`${n} \\cdot ${vt(l)}`], p2, u) },
		{ say: "Calcola l'area: il perimetro per l'apotema, diviso 2.", math: calc('A = \\dfrac{2p \\cdot a}{2}', [`\\dfrac{${vt(p2)} \\cdot ${vt(a)}}{2}`, ...(A.c ? [`\\dfrac{${vt(mul(p2, a))}}{2}`] : [])], A, u, 2) }
	);
	const expected = l.x * trueRatio(n);
	if (mode === 'lato-apotema' && Math.abs(a.x - expected) > 0.01 * expected) {
		const d = decimal(q(Math.round(expected * 100), 100), 2).text;
		steps[steps.length - 1].then = `Attenzione: in un ${p.name} regolare con questo lato l'apotema è circa ${d}. Controlla i dati.`;
	} else if (!exact && mode !== 'lato-apotema') {
		steps[steps.length - 1].then = "Il numero fisso è arrotondato, come nelle tabelle dei libri: l'area è approssimata.";
	}
	const items: [string, string, Val, 1 | 2][] = [];
	if (mode === 'apotema') items.push(['Lato', 'l', l, 1]);
	items.push(['Perimetro', '2p', p2, 1]);
	if (mode === 'lato') items.push(['Apotema', 'a', a, 1]);
	items.push(['Area', 'A', A, 2]);
	return {
		outcome: {
			ok: true,
			rows: items.map(([label, sym, v, dim]) => ({ label, value: rowValue(sym, v, u, dim) })),
			copy: items
				.map(([, sym, v, dim]) => {
					const t = valueText(v, u, dim);
					return `${sym} ${t.startsWith('≈') ? '' : '= '}${t}`;
				})
				.join('; '),
			steps
		},
		sketch: polygonSketch(n, l, a, given, u)
	};
}

/** The polygon with its bottom side flat, the apothem to its midpoint and the right angle at its foot. */
function polygonSketch(n: number, l: Val, a: Val, given: { l: boolean; a: boolean }, u: Unit): Sketch {
	const side = l.x;
	const R = side / (2 * Math.sin(Math.PI / n));
	const outline: Pt[] = Array.from({ length: n }, (_, k) => {
		const t = -Math.PI / 2 - Math.PI / n + (2 * Math.PI * k) / n;
		return [R * Math.cos(t), R * Math.sin(t)];
	});
	// Drawn to the true proportions, whatever apothem was typed.
	const foot: Pt = [0, outline[0][1]];
	const label = (sym: string, v: Val, isGiven: boolean) => {
		const s = shown(v);
		const t = s.exact && s.exact.text.length <= 8 ? s.exact.text : (s.approx ?? s.exact)!.text;
		return isGiven ? `${sym} = ${t}${u ? ` ${u}` : ''}` : sym;
	};
	return {
		outline,
		lines: [[[0, 0], foot]],
		labels: [
			{ from: outline[0], to: outline[1], text: label('l', l, given.l), given: given.l },
			{ from: [0, 0], to: foot, text: label('a', a, given.a), given: given.a }
		],
		right: [[foot, [foot[0] + 1, foot[1]], [0, 0]]]
	};
}
