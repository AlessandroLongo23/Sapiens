/**
 * L'equilibrio sul piano inclinato. Spec: specs/exercises/fis-equilibrio-piano-inclinato.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/21-fis-equilibrio-piano-inclinato.md), each one step
 * harder: a component of the weight from the angle; the equilibrant force or the plane's reaction from the height and
 * the length; the angle of a smooth plane from the force that holds the block; the limit angle and the coefficient of
 * static friction; the friction on a block that stays or slides. g = 9,8 N/kg, masses and lengths with two significant
 * figures, angles in whole degrees, coefficients with two decimals; answers with two significant figures (angles to
 * the degree), never too close to a rounding boundary. Distractors from the lesson's warnings: sine and cosine
 * swapped, the reaction taken for the weight, static friction always at its maximum, the mass for the weight.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, coeff, cosD, degOpt, generateWith, lab, numOpt, opts, r2, roundDeg, sinD, tanD, two, weight } from '../fisica-equilibrio';

export const ID = 'fis-equilibrio-piano-inclinato';

const N = (s: string) => qty(s, 'N');
const nOpts = (xs: (string | null)[]) => opts(xs, (s) => qOpt(s, 'N'));
const RAD = 180 / Math.PI;
/** A float for a step, cut after three decimals (exact values stay as they are). */
const f3 = (x: number) => {
	const r = Math.round(x * 1000);
	return decTex(String((Math.abs(x * 1000 - r) < 1e-6 ? r : Math.trunc(x * 1000)) / 1000));
};
const fall = (x: number) => nOpts([r2(x * 1.2), r2(x * 0.8), r2(x * 1.4), r2(x * 0.6)]);

type SceneForce = { nome: string; sub?: string; modulo: number; direzione: 'giu' | 'su-piano' | 'giu-piano' | 'fuori' | 'dentro'; tratteggiata?: boolean };
function plane(alt: string, d: { angolo: number; testoAngolo?: string; altezza?: string; lunghezza?: string; filo?: boolean; forze?: SceneForce[] }): SceneRef {
	const data: Record<string, unknown> = { angolo: Math.round(d.angolo * 1000) / 1000 };
	if (d.testoAngolo) data.testoAngolo = d.testoAngolo;
	if (d.altezza) data.altezza = d.altezza;
	if (d.lunghezza) data.lunghezza = d.lunghezza;
	if (d.filo) data.filo = true;
	if (d.forze) {
		data.forze = d.forze.map((F) => ({ ...F, modulo: Math.round(F.modulo * 1000) / 1000 }));
		data.scala = Math.round((1.5 / Math.max(...d.forze.map((F) => F.modulo))) * 10000) / 10000;
	}
	return { type: 'piano-inclinato', data, alt };
}

const BODIES = [
	{ name: 'Una cassa', e: 'a' },
	{ name: 'Uno scatolone', e: 'o' },
	{ name: 'Un blocco di legno', e: 'o' },
	{ name: 'Una valigia', e: 'a' },
];
const P_STEP = (m: string, P: string) => `P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`;

// ---------------------------------------------------------------------------
// Level 1: a component of the weight

function level1(rng: Rng): Built {
	const par = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const a = rng.int(10, 70);
		const exact = par ? Pn * sinD(a) : Pn * cosD(a);
		const other = par ? Pn * cosD(a) : Pn * sinD(a);
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const b = rng.pick(BODIES);
		const sym = par ? 'P_\\parallel' : 'P_\\perp';
		const fn = par ? '\\sin' : '\\cos';
		const alt = `${b.name} su un piano inclinato di ${a} gradi.`;
		return {
			prompt: 'Trova la componente del peso.',
			problem: textBlock(`${b.name} di ${pq(m, 'kg')} è appoggiat${b.e} su un piano inclinato di $${a}^\\circ$. Quanto vale la componente del peso ${par ? 'parallela al piano' : 'perpendicolare al piano'}?`),
			solution: `${sym} \\approx ${N(ans)}`,
			steps: [
				P_STEP(m, P),
				par ? t("La componente parallela è opposta all'angolo alfa nel triangolo delle forze: va con il seno.") : t("La componente perpendicolare è adiacente all'angolo alfa nel triangolo delle forze: va con il coseno."),
				`${sym} = P ${fn}\\alpha = ${N(P)} \\cdot ${fn} ${a}^\\circ = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`,
			],
			// sine and cosine swapped; the whole weight; the mass in place of the weight
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(other), r2(Pn), r2(par ? Number(m) * sinD(a) : Number(m) * cosD(a))]), fall(exact)),
			params: { case: par ? 'parallela' : 'perpendicolare', m, angle: a },
			scene: plane(alt, { angolo: a, testoAngolo: `${a}°` }),
			solutionScene: plane(`${alt} Il peso, di ${lab(P)} newton, e le sue componenti: ${lab(String(Math.round(Pn * sinD(a) * 10) / 10))} newton lungo il piano e ${lab(String(Math.round(Pn * cosD(a) * 10) / 10))} newton perpendicolare.`, {
				angolo: a,
				testoAngolo: `${a}°`,
				forze: [
					{ nome: 'P', modulo: Pn, direzione: 'giu' },
					{ nome: 'P', sub: '∥', modulo: Pn * sinD(a), direzione: 'giu-piano', tratteggiata: true },
					{ nome: 'P', sub: '⊥', modulo: Pn * cosD(a), direzione: 'dentro', tratteggiata: true },
				],
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: height and length

function level2(rng: Rng): Built {
	const askF = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const l = two(rng, true);
		const h = (rng.int(10, 99) / 10).toFixed(1);
		const ln = Number(l), hn = Number(h);
		if (hn < 0.15 * ln || hn > 0.85 * ln) continue;
		const b = Math.sqrt(ln * ln - hn * hn);
		const F = (Pn * hn) / ln, Fv = (Pn * b) / ln;
		const exact = askF ? F : Fv;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const body = rng.pick(BODIES);
		const alt = `${body.name} su un piano inclinato lungo ${lab(l)} metri e alto ${lab(h)} metri, tenut${body.e} da un filo parallelo al piano.`;
		const deg = Math.asin(hn / ln) * RAD;
		return {
			prompt: askF ? 'Trova la forza equilibrante.' : 'Trova la reazione vincolare.',
			problem: textBlock(
				`${body.name} di ${pq(m, 'kg')} è ferm${body.e} su un piano inclinato liscio, lungo ${pq(l, 'm')} e alto ${pq(h, 'm')}, tenut${body.e} da un filo parallelo al piano. Quanto vale ${askF ? 'la tensione del filo' : 'la reazione vincolare del piano'}?`,
			),
			solution: `${askF ? 'T' : 'F_v'} \\approx ${N(ans)}`,
			steps: askF
				? [P_STEP(m, P), t('Il filo bilancia la componente parallela del peso:'), `T = P \\cdot \\dfrac{h}{l} = ${N(P)} \\cdot \\dfrac{${qty(h, 'm')}}{${qty(l, 'm')}} = ${f3(F)}\\ldots\\,\\text{N} \\approx ${N(ans)}`]
				: [
						P_STEP(m, P),
						`${t('La base del piano: ')} b = \\sqrt{l^2 - h^2} = \\sqrt{${decTex(l)}^2 - ${decTex(h)}^2}\\,\\text{m} = ${f3(b)}\\ldots\\,\\text{m}`,
						`${t('La reazione bilancia la componente perpendicolare: ')} F_v = P \\cdot \\dfrac{b}{l} = ${f3(Fv)}\\ldots\\,\\text{N} \\approx ${N(ans)}`,
					],
			// F: the ratio upside down, the tangent (h/b), the other component; Fv: the weight, the other component, P·b/h
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts(askF ? [r2((Pn * ln) / hn), r2((Pn * hn) / b), r2(Fv)] : [r2(Pn), r2(F), r2((Pn * hn) / b)]), fall(exact)),
			params: { case: askF ? 'tensione' : 'reazione', m, l, h },
			scene: plane(alt, { angolo: deg, altezza: `${lab(h)} m`, lunghezza: `${lab(l)} m`, filo: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the angle of a smooth plane

function level3(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const F = two(rng, rng.next() < 0.5);
		const ratio = Number(F) / Pn;
		if (ratio < sinD(8) || ratio > sinD(70)) continue;
		const deg = Math.asin(ratio) * RAD;
		const ans = roundDeg(deg);
		if (ans === null) continue;
		const a = Number(ans);
		const body = rng.pick(BODIES);
		const alt = `${body.name} su un piano inclinato liscio, di inclinazione alfa sconosciuta (il disegno non è in scala), tenut${body.e} da un filo parallelo al piano.`;
		return {
			prompt: "Trova l'inclinazione.",
			problem: textBlock(`${body.name} di ${pq(m, 'kg')} è tenut${body.e} ferm${body.e} su un piano inclinato liscio da un filo parallelo al piano, con una tensione di ${pq(F, 'N')}. Quanto vale l'inclinazione del piano?`),
			solution: `\\alpha \\approx ${ans}^\\circ`,
			steps: [
				P_STEP(m, P),
				t('Il filo bilancia la componente parallela del peso: ') + ` T = P \\sin\\alpha`,
				`\\sin\\alpha = \\dfrac{T}{P} = \\dfrac{${N(F)}}{${N(P)}} = ${f3(ratio)}\\ldots \\quad\\Rightarrow\\quad \\alpha = ${f3(deg)}\\ldots^\\circ \\approx ${ans}^\\circ`,
			],
			// sine and cosine swapped; the tangent; the mass in place of the weight (when it gives an angle)
			answer: choiceOf(
				rng,
				degOpt(ans),
				opts([roundDeg(Math.acos(ratio) * RAD), roundDeg(Math.atan(ratio) * RAD), Number(F) / Number(m) <= 1 ? roundDeg(Math.asin(Number(F) / Number(m)) * RAD) : null], degOpt),
				[a + 3, a - 3, a + 6, a - 6].filter((x) => x > 0 && x < 90).map((x) => degOpt(String(x))),
			),
			params: { case: 'angolo', m, F },
			scene: plane(alt, { angolo: 25, testoAngolo: 'α', filo: true }),
			solutionScene: plane(`${body.name} su un piano inclinato di ${ans} gradi, tenut${body.e} da un filo parallelo al piano.`, { angolo: deg, testoAngolo: `${ans}°`, filo: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the limit angle

function level4(rng: Rng): Built {
	const askAngle = rng.next() < 0.5;
	for (;;) {
		if (askAngle) {
			const mu = coeff(rng, 10, 90);
			const deg = Math.atan(Number(mu)) * RAD;
			const ans = roundDeg(deg);
			if (ans === null) continue;
			const a = Number(ans);
			return {
				prompt: "Trova l'angolo limite.",
				problem: textBlock(`Tra un blocco e un'asse di legno il coefficiente di attrito statico è $\\mu_s = ${decTex(mu)}$. Si inclina l'asse sempre di più. A quale inclinazione il blocco comincia a scivolare?`),
				solution: `\\alpha_{lim} \\approx ${ans}^\\circ`,
				steps: [t("All'angolo limite l'attrito statico massimo è uguale alla componente parallela del peso:"), `\\tan\\alpha_{lim} = \\mu_s = ${decTex(mu)} \\quad\\Rightarrow\\quad \\alpha_{lim} = \\tan^{-1} ${decTex(mu)} = ${f3(deg)}\\ldots^\\circ \\approx ${ans}^\\circ`],
				// the sine in place of the tangent; the cosine; the complement
				answer: choiceOf(rng, degOpt(ans), opts([roundDeg(Math.asin(Number(mu)) * RAD), roundDeg(Math.acos(Number(mu)) * RAD), roundDeg(90 - deg)], degOpt), [a + 3, a - 3, a + 6].filter((x) => x > 0).map((x) => degOpt(String(x)))),
				params: { case: 'angolo', mu },
			};
		}
		const a = rng.int(6, 40);
		const exact = tanD(a);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova il coefficiente di attrito.',
			problem: textBlock(`Un libro è appoggiato su un'asse di legno, che viene inclinata sempre di più. Il libro comincia a scivolare quando l'asse forma un angolo di $${a}^\\circ$ con l'orizzontale. Quanto vale il coefficiente di attrito statico?`),
			solution: `\\mu_s \\approx ${decTex(ans)}`,
			steps: [t("A quell'inclinazione l'attrito statico è al massimo:"), `\\mu_s = \\tan ${a}^\\circ = ${f3(exact)}\\ldots \\approx ${decTex(ans)}`, t('Il coefficiente è un numero puro, senza unità.')],
			// the sine; the cosine; the tangent upside down
			answer: choiceOf(rng, numOpt(ans), opts([r2(sinD(a)), r2(cosD(a)), r2(1 / exact)], numOpt), opts([r2(exact * 1.2), r2(exact * 0.8), r2(exact * 1.4)], numOpt)),
			params: { case: 'coefficiente', angle: a },
			scene: plane(`Un libro su un'asse inclinata di ${a} gradi.`, { angolo: a, testoAngolo: `${a}°` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the block stays or slides

function level5(rng: Rng): Built {
	const still = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const a = rng.int(10, 50);
		const mus = coeff(rng, 20, 90);
		const mud = coeff(rng, 10, Math.round(Number(mus) * 100) - 5);
		const tn = tanD(a);
		if (still ? tn > 0.9 * Number(mus) : tn < 1.1 * Number(mus)) continue;
		const exact = still ? Pn * sinD(a) : Number(mud) * Pn * cosD(a);
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const body = rng.pick(BODIES);
		const smax = Number(mus) * Pn * cosD(a);
		const alt = `${body.name} su un piano inclinato di ${a} gradi.`;
		return {
			prompt: "Trova la forza d'attrito.",
			problem: textBlock(`${body.name} di ${pq(m, 'kg')} è appoggiat${body.e} su un piano inclinato di $${a}^\\circ$, con $\\mu_s = ${decTex(mus)}$ e $\\mu_d = ${decTex(mud)}$. Quanto vale la forza di attrito?`),
			solution: `${still ? 'F_s' : 'F_d'} \\approx ${N(ans)}`,
			steps: [
				`\\tan ${a}^\\circ = ${f3(tn)}\\ldots ${still ? '<' : '>'} \\mu_s = ${decTex(mus)}`,
				still ? t("L'attrito statico basta: il corpo resta fermo, e l'attrito è uguale alla componente parallela del peso.") : t("L'attrito statico non basta: il corpo scivola, e l'attrito è dinamico."),
				P_STEP(m, P),
				still
					? `F_s = P \\sin ${a}^\\circ = ${N(P)} \\cdot \\sin ${a}^\\circ = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`
					: `F_d = \\mu_d \\cdot P\\cos ${a}^\\circ = ${decTex(mud)} \\cdot ${N(P)} \\cdot \\cos ${a}^\\circ = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`,
			],
			// still: static friction always at its maximum, the reaction, kinetic friction; sliding: the maximum static, the parallel component, mu_d times the weight
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts(still ? [r2(smax), r2(Pn * cosD(a)), r2(Number(mud) * Pn * cosD(a))] : [r2(smax), r2(Pn * sinD(a)), r2(Number(mud) * Pn)]), fall(exact)),
			params: { case: still ? 'fermo' : 'scivola', m, angle: a, mus, mud },
			scene: plane(alt, { angolo: a, testoAngolo: `${a}°` }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	const needsScene = sample.level !== 4 || sample.params.case === 'coefficiente';
	if (needsScene && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisEquilibrioPianoInclinato: Generator = {
	id: ID,
	title: "L'equilibrio sul piano inclinato",
	levels: {
		1: { label: 'Le componenti del peso', constraints: ['inclinazione da 10° a 70°', 'componente parallela o perpendicolare, metà ciascuna'] },
		2: { label: 'Altezza e lunghezza', constraints: ["altezza tra il 15% e l'85% della lunghezza", 'tensione del filo o reazione del piano'] },
		3: { label: "L'inclinazione dalla forza", constraints: ['piano liscio, filo parallelo', 'inclinazione tra 8° e 70°, al grado'] },
		4: { label: "L'angolo limite", constraints: ["dall'attrito all'angolo, o dall'angolo all'attrito"] },
		5: { label: 'Fermo o scivola', constraints: ['tan α al più il 90% di μs, o almeno il 110%, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEquilibrioPianoInclinato;
