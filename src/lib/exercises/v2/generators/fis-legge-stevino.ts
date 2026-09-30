/**
 * La legge di Stevino e i vasi comunicanti. Spec: specs/exercises/fis-legge-stevino.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/28-fis-legge-stevino.md): the hydrostatic pressure d·g·h
 * with the depth in metres; the depth in centimetres and the density sometimes in g/cm³; the total pressure
 * p0 + d·g·h; the depth from the height above the bottom; the depth from a pressure; the U-tube with two liquids,
 * d1·h1 = d2·h2. g = 9,8 N/kg, p0 = 1,01 · 10^5 Pa, densities from the lesson (water 1000, sea water 1030, olive oil
 * 920, mercury 13 600 kg/m³). Answers rounded to the figures of the data (two, and for p0 + d·g·h to the place of the
 * less precise addend, as the lesson on significant figures teaches), never a tie. Multiple choice with the unit in
 * the option and the lesson's mistakes: g forgotten, the density in g/cm³ or the depth in cm put in as they are, the
 * height from the bottom taken for the depth, p0 forgotten or added, the ratio of the U-tube upside down.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, G, G_TEX, P0, P0_TEX, approx, choiceOf, commonCheck, datum, dec, exponent, fixed, generateWith, isTie, n, pd, plain, round2, roundSig, sig, t, two, withU } from '../fis-fluidi';

export const ID = 'fis-legge-stevino';
const S2 = { kind: 'sig', s: 2 } as const;
const r2 = (x: R) => round2(x, 2);
const num = (r: R) => r.num / r.den;
const KGM3 = 'kg/m^3';

/** The lesson's liquids: density in kg/m³, where the problem puts the point, the fill of the scene. */
export const LIQUIDS = {
	acqua: { d: n(1000), where: "in un lago d'acqua dolce", name: 'acqua', fill: 'acqua' },
	mare: { d: n(1030), where: 'nel mare', name: 'acqua di mare', fill: 'acqua' },
	olio: { d: n(920), where: "in una cisterna piena d'olio d'oliva", name: "olio d'oliva", fill: 'olio' },
	mercurio: { d: n(13600), where: 'in una vaschetta di mercurio', name: 'mercurio', fill: 'mercurio' },
} as const;
type Liquid = keyof typeof LIQUIDS;

/** The densities in g/cm³ as the lesson's table writes them. */
const G_CM3: Record<Liquid, string> = { acqua: '1{,}00', mare: '1{,}03', olio: '0{,}92', mercurio: '13{,}6' };

const dTex = (d: R) => withU(dec(d), KGM3);
const pdT = (d: R) => `$d = ${dTex(d)}$`;

/** A depth in metres with two figures that fits the liquid: a lake or the sea up to 99 m, a tank up to 9,9 m, mercury up to 0,99 m. */
function depth(rng: Rng, l: Liquid): R {
	if (l === 'mercurio') return two(rng, -1);
	if (l === 'olio') return two(rng, 0);
	return two(rng, rng.pick([0, 1]));
}

function container(opts: { livello: R; profondita?: R; dalFondo?: R; liquido: string; etichette: Record<string, string>; alt: string }): SceneRef {
	const data: Record<string, unknown> = { livello: num(opts.livello), liquido: opts.liquido, etichette: opts.etichette };
	if (opts.profondita) data.profondita = num(opts.profondita);
	if (opts.dalFondo) data.dalFondo = num(opts.dalFondo);
	return { type: 'recipiente-liquido', data, alt: opts.alt };
}

// ---------------------------------------------------------------------------
// Level 1: the hydrostatic pressure, depth in metres

function level1(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(['acqua', 'mare', 'olio', 'mercurio'] as Liquid[]);
		const L = LIQUIDS[l];
		const h = depth(rng, l);
		const exact = L.d.mul(G).mul(h);
		const p = r2(exact);
		if (!p) continue;
		const hl = `h = ${plain(datum(h), 'm')}`;
		return {
			prompt: 'Calcola la pressione idrostatica.',
			problem: textBlock(`Quanto vale la pressione idrostatica a ${pd(h, 'm')} di profondità ${L.where} (${pdT(L.d)})?`),
			solution: `d \\cdot g \\cdot h = ${withU(sig(p, 2), 'Pa')}`,
			steps: [`d \\cdot g \\cdot h = ${dTex(L.d)} \\cdot ${G_TEX} \\cdot ${withU(datum(h), 'm')} ${approx(exact, 2, 'Pa')}`],
			answer: p,
			unit: 'Pa',
			format: S2,
			// g forgotten; the density in g/cm³; ten times
			mistakes: [L.d.mul(h), exact.div(n(1000)), exact.mul(n(10))],
			params: { case: l, h: h.toString() },
			scene: container({ livello: h.mul(q(5, 4)), profondita: h, liquido: L.fill, etichette: { h: hl }, alt: `Un recipiente pieno di ${L.name} con un punto P a ${plain(datum(h), 'm')} sotto la superficie libera` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the depth in cm, the density in kg/m³ or in g/cm³

function level2(rng: Rng): Built {
	const gcm3 = rng.next() < 0.5;
	for (;;) {
		const l = rng.pick(['acqua', 'mare', 'olio', 'mercurio'] as Liquid[]);
		const L = LIQUIDS[l];
		const hc = two(rng, 1); // cm, 10 to 99
		const hm = hc.div(n(100));
		const exact = L.d.mul(G).mul(hm);
		const p = r2(exact);
		if (!p) continue;
		const dText = gcm3 ? `$d = ${withU(G_CM3[l], 'g/cm^3')}$` : pdT(L.d);
		return {
			prompt: 'Calcola la pressione idrostatica.',
			problem: textBlock(`Quanto vale la pressione idrostatica a ${pd(hc, 'cm')} di profondità ${L.where} (${dText})?`),
			solution: `d \\cdot g \\cdot h = ${withU(sig(p, 2), 'Pa')}`,
			steps: [
				`h = ${withU(datum(hc), 'cm')} = ${withU(dec(hm), 'm')}${gcm3 ? ` \\qquad d = ${withU(G_CM3[l], 'g/cm^3')} = ${dTex(L.d)}` : ''}`,
				`d \\cdot g \\cdot h = ${dTex(L.d)} \\cdot ${G_TEX} \\cdot ${withU(dec(hm), 'm')} ${approx(exact, 2, 'Pa')}`,
			],
			answer: p,
			unit: 'Pa',
			format: S2,
			// the centimetres put in as they are; the g/cm³ put in as they are (or, with kg/m³, g forgotten); both
			mistakes: [exact.mul(n(100)), gcm3 ? exact.div(n(1000)) : L.d.mul(hm), gcm3 ? exact.div(n(10)) : exact.div(n(1000))],
			params: { case: gcm3 ? 'g-cm3' : 'kg-m3', liquid: l, h: hc.toString() },
			scene: container({ livello: hc.mul(q(5, 4)), profondita: hc, liquido: L.fill, etichette: { h: `h = ${plain(datum(hc), 'cm')}` }, alt: `Un recipiente pieno di ${L.name} con un punto P a ${plain(datum(hc), 'cm')} sotto la superficie libera` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the total pressure

/** p0 + d·g·h rounded to the place of the less precise addend: p0 to 10³ Pa, d·g·h to its second figure. */
export function totalPlace(dgh: R): number {
	return Math.max(3, exponent(roundSig(dgh, 2)) - 1);
}

function level3(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(['acqua', 'mare'] as Liquid[]);
		const L = LIQUIDS[l];
		const h = two(rng, rng.pick([0, 1]));
		const dgh = L.d.mul(G).mul(h);
		const total = P0.add(dgh);
		const k = totalPlace(dgh);
		const s = exponent(total) - k + 1;
		if (isTie(total, s)) continue;
		const p = roundSig(total, s);
		const fmt = { kind: 'sig', s } as const;
		return {
			prompt: 'Calcola la pressione.',
			problem: textBlock(`Quanto vale la pressione totale a ${pd(h, 'm')} di profondità ${L.where} (${pdT(L.d)}), se in superficie la pressione atmosferica è di $${P0_TEX}$?`),
			solution: `p = ${withU(sig(p, s), 'Pa')}`,
			steps: [
				`d \\cdot g \\cdot h = ${dTex(L.d)} \\cdot ${G_TEX} \\cdot ${withU(datum(h), 'm')} ${approx(dgh, 2, 'Pa')}`,
				`p = p_0 + d \\cdot g \\cdot h = ${P0_TEX} + ${withU(sig(dgh, 2), 'Pa')} ${approx(total, s, 'Pa')}`,
				t(`Il risultato si arrotonda alla cifra delle ${k === 3 ? 'migliaia' : k === 4 ? 'decine di migliaia' : 'centinaia di migliaia'} di pascal, come l'addendo meno preciso.`),
			],
			answer: p,
			unit: 'Pa',
			format: fmt,
			// p0 forgotten; g forgotten; the density in g/cm³
			mistakes: [dgh, P0.add(L.d.mul(h)), P0.add(dgh.div(n(1000)))],
			params: { case: l, h: h.toString(), place: k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the depth from the height above the bottom

function level4(rng: Rng): Built {
	for (;;) {
		const l = rng.pick(['acqua', 'olio'] as Liquid[]);
		const L = LIQUIDS[l];
		const H = two(rng, 0); // m, 1,0 to 9,9
		const yc = n(10 * rng.int(1, 9)); // cm, 10 to 90
		const y = yc.div(n(100));
		const h = H.sub(y);
		if (h.compare(q(5, 10)) < 0) continue;
		const exact = L.d.mul(G).mul(h);
		const p = r2(exact);
		if (!p) continue;
		const what = l === 'acqua' ? "Una vasca è piena d'acqua" : "Una cisterna è piena d'olio d'oliva";
		return {
			prompt: 'Calcola la pressione idrostatica.',
			problem: textBlock(`${what} (${pdT(L.d)}) fino all'altezza di ${pd(H, 'm')}. Quanto vale la pressione idrostatica in un punto che si trova ${pd(yc, 'cm')} sopra il fondo?`),
			solution: `d \\cdot g \\cdot h = ${withU(sig(p, 2), 'Pa')}`,
			steps: [
				t('La profondità si misura dalla superficie libera:'),
				`h = ${withU(datum(H), 'm')} - ${withU(fixed(y, 2), 'm')} = ${withU(fixed(h, 1), 'm')}`,
				`d \\cdot g \\cdot h = ${dTex(L.d)} \\cdot ${G_TEX} \\cdot ${withU(fixed(h, 1), 'm')} ${approx(exact, 2, 'Pa')}`,
			],
			answer: p,
			unit: 'Pa',
			format: S2,
			// the height above the bottom taken for the depth; the whole height; the two added
			mistakes: [L.d.mul(G).mul(y), L.d.mul(G).mul(H), L.d.mul(G).mul(H.add(y))],
			params: { case: l, H: H.toString(), y: yc.toString() },
			scene: container({ livello: H, dalFondo: y, liquido: L.fill, etichette: { H: `H = ${plain(datum(H), 'm')}`, y: `y = ${plain(datum(yc), 'cm')}` }, alt: `Un recipiente pieno di ${L.name} fino a ${plain(datum(H), 'm')}, con un punto P a ${plain(datum(yc), 'cm')} dal fondo` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the depth from a pressure

function level5(rng: Rng): Built {
	const total = rng.next() < 0.5;
	for (;;) {
		const l = rng.pick(['acqua', 'mare'] as Liquid[]);
		const L = LIQUIDS[l];
		const dg = L.d.mul(G);
		if (!total) {
			const pk = two(rng, rng.pick([1, 2])); // kPa, 10 to 990
			const exact = pk.mul(n(1000)).div(dg);
			const h = r2(exact);
			if (!h) continue;
			return {
				prompt: 'Calcola la profondità.',
				problem: textBlock(`Il sensore di un sub misura una pressione idrostatica di ${pd(pk, 'kPa')} ${L.where} (${pdT(L.d)}). A che profondità si trova il sub?`),
				solution: `h = ${withU(sig(h, 2), 'm')}`,
				steps: [`h = \\dfrac{d \\cdot g \\cdot h}{d \\cdot g} = \\dfrac{${datum(pk)} \\cdot 10^{3}\\,\\text{Pa}}{${dTex(L.d)} \\cdot ${G_TEX}} ${approx(exact, 2, 'm')}`],
				answer: h,
				unit: 'm',
				format: S2,
				// g forgotten; the kPa put in as they are; the density in g/cm³
				mistakes: [pk.mul(n(1000)).div(L.d), exact.div(n(1000)), exact.mul(n(1000))],
				params: { case: 'idrostatica', p: pk.toString() },
			};
		}
		// the total pressure in kPa, an integer from 120 to 990
		const pk = n(rng.int(12, 99) * 10);
		const diff = pk.mul(n(1000)).sub(P0);
		const exact = diff.div(dg);
		const h = r2(exact);
		if (!h) continue;
		return {
			prompt: 'Calcola la profondità.',
			problem: textBlock(`${L.where === 'nel mare' ? 'Nel mare' : "In un lago d'acqua dolce"} (${pdT(L.d)}) un sensore misura la pressione totale di ${pd(pk, 'kPa')}. In superficie la pressione atmosferica è di $${P0_TEX}$. A che profondità si trova il sensore?`),
			solution: `h = ${withU(sig(h, 2), 'm')}`,
			steps: [
				`d \\cdot g \\cdot h = p - p_0 = ${withU(dec(pk.mul(n(1000))), 'Pa')} - ${withU(dec(P0), 'Pa')} = ${withU(dec(diff), 'Pa')}`,
				`h = \\dfrac{${withU(dec(diff), 'Pa')}}{${dTex(L.d)} \\cdot ${G_TEX}} ${approx(exact, 2, 'm')}`,
			],
			answer: h,
			unit: 'm',
			format: S2,
			// p0 not subtracted; g forgotten; p0 added
			mistakes: [pk.mul(n(1000)).div(dg), diff.div(L.d), pk.mul(n(1000)).add(P0).div(dg)],
			params: { case: 'totale', p: pk.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the U-tube

const PAIRS: [Liquid, Liquid][] = [
	['olio', 'acqua'],
	['acqua', 'mercurio'],
	['olio', 'mercurio'],
];
const nameOf = (l: Liquid) => (l === 'olio' ? "olio d'oliva" : LIQUIDS[l].name);
const of = (l: Liquid) => (l === 'mercurio' ? 'di mercurio' : l === 'olio' ? "d'olio" : "d'acqua");

function level6(rng: Rng): Built {
	const density = rng.next() < 0.4;
	for (;;) {
		if (!density) {
			const [a, b] = rng.pick(PAIRS);
			const d1 = LIQUIDS[a].d;
			const d2 = LIQUIDS[b].d;
			const h1 = two(rng, 1); // cm, 10 to 99
			if (b === 'acqua' && h1.compare(n(30)) > 0) continue;
			const exact = h1.mul(d1).div(d2);
			const h2 = r2(exact);
			if (!h2) continue;
			const lab1 = `h_1 = ${plain(datum(h1), 'cm')}`;
			return {
				prompt: "Calcola l'altezza.",
				problem: textBlock(
					`In un tubo a U che contiene ${nameOf(b)} (${pdT(d2)}) si versa, in un ramo, ${nameOf(a)} (${pdT(d1)}), che non si mescola con esso. Sopra la superficie di separazione la colonna ${of(a)} è alta ${pd(h1, 'cm')}. Quanto è alta, nell'altro ramo, la colonna ${of(b)} sopra lo stesso piano?`,
				),
				solution: `h_2 = ${withU(sig(h2, 2), 'cm')}`,
				steps: [`d_1 \\cdot h_1 = d_2 \\cdot h_2 \\quad\\Rightarrow\\quad h_2 = h_1 \\cdot \\dfrac{d_1}{d_2} = ${withU(datum(h1), 'cm')} \\cdot \\dfrac{${dec(d1)}}{${dec(d2)}} ${approx(exact, 2, 'cm')}`],
				answer: h2,
				unit: 'cm',
				format: S2,
				// the ratio upside down; the same height; the difference of the two heights
				mistakes: [h1.mul(d2).div(d1), h1, h1.sub(exact)],
				params: { case: 'altezza', pair: `${a}-${b}`, h1: h1.toString() },
				scene: { type: 'tubo-a-u', data: { d1: num(d1), d2: num(d2), h1: num(h1), liquidi: [LIQUIDS[a].fill, LIQUIDS[b].fill], etichette: { h1: lab1, h2: 'h_2 = ?' } }, alt: `Un tubo a U con ${nameOf(b)} in basso e, in un ramo, una colonna ${of(a)} alta ${plain(datum(h1), 'cm')} sopra la superficie di separazione` },
			};
		}
		// an unknown liquid on water: the two heights, the density
		const h1 = two(rng, 1); // cm
		const h2 = two(rng, rng.pick([0, 1]));
		const ratio = h2.div(h1);
		if (ratio.compare(q(6, 10)) < 0 || ratio.compare(q(99, 100)) > 0) continue;
		const exact = n(1000).mul(ratio);
		const d1 = r2(exact);
		if (!d1) continue;
		return {
			prompt: 'Calcola la densità.',
			problem: textBlock(
				`In un tubo a U con dell'acqua (${pdT(n(1000))}) si versa, in un ramo, un liquido che non si mescola con essa. Sopra il piano della superficie di separazione la colonna del liquido è alta ${pd(h1, 'cm')} e quella d'acqua ${pd(h2, 'cm')}. Quanto vale la densità del liquido?`,
			),
			solution: `d_1 = ${withU(sig(d1, 2), KGM3)}`,
			steps: [`d_1 \\cdot h_1 = d_2 \\cdot h_2 \\quad\\Rightarrow\\quad d_1 = d_2 \\cdot \\dfrac{h_2}{h_1} = ${dTex(n(1000))} \\cdot \\dfrac{${withU(datum(h2), 'cm')}}{${withU(datum(h1), 'cm')}} ${approx(exact, 2, KGM3)}`],
			answer: d1,
			unit: KGM3,
			format: S2,
			// the ratio upside down; the ratio alone, as if in g/cm³ read as kg/m³; the difference of the heights
			mistakes: [n(1000).div(ratio), ratio, n(1000).mul(h1.sub(h2)).div(h1)],
			params: { case: 'densita', h1: h1.toString(), h2: h2.toString() },
			scene: { type: 'tubo-a-u', data: { d1: num(exact), d2: 1000, h1: num(h1), liquidi: ['olio', 'acqua'], etichette: { h1: `h_1 = ${plain(datum(h1), 'cm')}`, h2: `h_2 = ${plain(datum(h2), 'cm')}` } }, alt: `Un tubo a U con acqua in basso e un liquido versato in un ramo: sopra la superficie di separazione la colonna del liquido è alta ${plain(datum(h1), 'cm')} e quella d'acqua ${plain(datum(h2), 'cm')}` },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	if ([1, 2, 4, 6].includes(sample.level) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisLeggeStevino: Generator = {
	id: ID,
	title: 'La legge di Stevino e i vasi comunicanti',
	levels: {
		1: { label: 'La pressione idrostatica', constraints: ['d·g·h con la profondità in metri', 'acqua, acqua di mare, olio, mercurio'] },
		2: { label: 'Profondità in centimetri', constraints: ['profondità in cm', 'densità in kg/m³ o in g/cm³ (metà)'] },
		3: { label: 'La pressione totale', constraints: ['p = p0 + d·g·h, p0 = 1,01 · 10^5 Pa', "arrotondata all'addendo meno preciso"] },
		4: { label: 'La profondità dalla superficie', constraints: ["l'altezza del liquido e quella del punto dal fondo", 'h = H − y'] },
		5: { label: 'La profondità dalla pressione', constraints: ['pressione idrostatica o totale in kPa (metà)', 'h = (p − p0)/(d·g)'] },
		6: { label: 'Il tubo a U', constraints: ['d1·h1 = d2·h2', "l'altezza (60%) o la densità (40%)"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceOf(sample, rng, ID),
};

export default fisLeggeStevino;
