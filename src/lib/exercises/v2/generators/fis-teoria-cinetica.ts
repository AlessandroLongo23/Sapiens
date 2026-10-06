/**
 * La teoria cinetica dei gas. Spec: specs/exercises/fis-teoria-cinetica.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/105-fis-teoria-cinetica.md), each one step harder: the
 * number of molecules from the moles, N = n N_A; the mass of a molecule from the molar mass, m = M / N_A, with the
 * grams turned into kilograms; the root-mean-square speed of a few molecules, drawn in a box with their speeds; the
 * pressure from the model, p = N m v_qm² / (3V), with the litres turned into cubic metres; the root-mean-square speed
 * from pressure and density, v_qm = √(3p/d); how the pressure changes when the number of molecules, the volume and the
 * speed change (p goes as N v_qm² / V). Multiple choice with the unit in the option and the lesson's mistakes: the
 * molar mass left in grams, the mean in place of the root-mean-square, the litres not converted, the 1/3 or the square
 * forgotten.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { shuffle } from '../insiemi';
import { type Rational, q } from '../rational';
import { type Built, GASES, N_A, approx, checkCommon, fx, generateWith, noZero, options, particles, pu, round, rounded, sci, t, tex, textBlock, wu } from '../fis-cinetica';

export const ID = 'fis-teoria-cinetica';

const NA_TEX = '6{,}02 \\cdot 10^{23}\\,\\text{mol}^{-1}';
const NA_NOTE = `($N_A = ${NA_TEX}$)`;
const must = (x: number, s: number) => {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	return tex(v);
};

// ---------------------------------------------------------------------------
// Level 1: how many molecules

function level1(rng: Rng): Built {
	const g = rng.pick(GASES);
	const small = rng.next() < 0.5;
	const k = noZero(rng, 11, 99);
	const n = small ? k / 100 : k / 10;
	const nTex = fx(n, small ? 2 : 1);
	const N = n * N_A;
	const what = particles(g);
	return {
		prompt: `Trova il numero di ${what}.`,
		problem: textBlock(`Un recipiente contiene ${pu(nTex, 'mol')} di ${g.name}. Quant${g.mono ? 'i' : 'e'} ${what} ci sono? ${NA_NOTE}`),
		solution: `N \\approx ${must(N, 2)}`,
		steps: [t(`Il numero di ${what} è il numero di moli per il numero di Avogadro.`), `N = n\\,N_A = ${wu(nTex, 'mol')} \\cdot ${NA_TEX} ${approx(N, '', 2)}`],
		// divided instead of multiplied, both ways; the exponent of N_A alone
		answer: options(rng, N, [N_A / n, n / N_A, N_A], '', 2),
		params: { case: small ? 'centesimi' : 'decimi', gas: g.name, n: String(n) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the mass of a molecule

function level2(rng: Rng): Built {
	const g = rng.pick(GASES);
	const one = g.mono ? 'un suo atomo' : 'una sua molecola';
	const MTex = fx(g.M, g.d);
	const m = (g.M / 1000) / N_A;
	return {
		prompt: g.mono ? 'Trova la massa di un atomo.' : 'Trova la massa di una molecola.',
		problem: textBlock(`La massa molare ${g.del} è ${pu(MTex, 'gmol')}. Qual è la massa di ${one}? ${NA_NOTE}`),
		solution: `m \\approx ${wu(must(m, 3), 'kg')}`,
		steps: [
			t('La massa molare va in chilogrammi per mole:') + ` \\; M = ${wu(MTex, 'gmol')} = ${MTex} \\cdot 10^{-3}\\,\\text{kg/mol}`,
			`m = \\dfrac{M}{N_A} = \\dfrac{${MTex} \\cdot 10^{-3}\\,\\text{kg/mol}}{${NA_TEX}} ${approx(m, 'kg', 3)}`,
		],
		// the grams not converted; multiplied by N_A; N_A over M
		answer: options(rng, m, [m * 1000, (g.M / 1000) * N_A, N_A / (g.M / 1000)], 'kg', 3),
		params: { case: g.mono ? 'atomo' : 'molecola', gas: g.name },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the root-mean-square speed of a few molecules

function level3(rng: Rng): Built {
	const count = rng.int(3, 5);
	for (;;) {
		const vs = Array.from({ length: count }, () => 10 * rng.int(15, 95));
		if (new Set(vs).size !== count || Math.max(...vs) - Math.min(...vs) < 250) continue;
		const sumSq = vs.reduce((a, b) => a + b * b, 0);
		const vqm = Math.sqrt(sumSq / count);
		const mean = vs.reduce((a, b) => a + b, 0) / count;
		const list = vs.map((x) => pu(String(x), 'ms'));
		const names = `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
		const alt = `Un recipiente con ${count} molecole, ciascuna con la freccia della sua velocità: ${vs.join(', ')} metri al secondo`;
		return {
			prompt: 'Trova la velocità quadratica media.',
			problem: textBlock(`In un recipiente ci sono ${count} molecole con velocità di modulo ${names}. Quanto vale la loro velocità quadratica media?`),
			solution: `v_{qm} \\approx ${wu(must(vqm, 3), 'ms')}`,
			steps: [
				t('Prima i quadrati, poi la media, poi la radice.'),
				`\\overline{v^2} = \\dfrac{${vs.map((x) => `${x}^2`).join(' + ')}}{${count}}\\,\\text{m}^2/\\text{s}^2 ${Number.isInteger(sumSq / count / 100) ? '=' : '\\approx'} ${must(sumSq / count, 4)}\\,\\text{m}^2/\\text{s}^2`,
				`v_{qm} = \\sqrt{\\overline{v^2}} ${approx(vqm, 'ms', 3)}`,
			],
			// the plain mean; the sum of the squares not divided; half way between the slowest and the fastest
			answer: options(rng, vqm, [mean, Math.sqrt(sumSq), (Math.max(...vs) + Math.min(...vs)) / 2], 'ms', 3),
			params: { case: `${count} molecole`, v: vs },
			scene: { type: 'molecole-velocita', data: { velocita: vs }, alt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the pressure from the model

const LITRES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8];

function level4(rng: Rng): Built {
	const g = rng.pick(GASES);
	const m = rounded(g.M / 1000 / N_A, 3);
	const V = rng.pick(LITRES);
	const v = noZero(rng, 151, 999);
	const target = rng.int(50, 400) * 1000;
	const N = rounded((3 * target * (V / 1000)) / (m * v * v), 3);
	const p = (N * m * v * v) / (3 * (V / 1000));
	const what = particles(g);
	const mTex = sci(m, 3), NTex = sci(N, 3), VTex = fx(V, 2);
	return {
		prompt: 'Trova la pressione del gas.',
		problem: textBlock(`In un recipiente di ${pu(VTex, 'L')} ci sono $${NTex}$ ${what} di ${g.name}, di massa ${pu(mTex, 'kg')} ciascun${g.mono ? 'o' : 'a'}, con velocità quadratica media ${pu(String(v), 'ms')}. Quanto vale la pressione del gas?`),
		solution: `p \\approx ${wu(must(p, 3), 'Pa')}`,
		steps: [
			`V = ${wu(VTex, 'L')} = ${VTex} \\cdot 10^{-3}\\,\\text{m}^3`,
			`p = \\dfrac{N\\,m\\,v_{qm}^2}{3\\,V} = \\dfrac{${NTex} \\cdot ${mTex} \\cdot ${v}^2}{3 \\cdot ${VTex} \\cdot 10^{-3}}\\,\\text{Pa} ${approx(p, 'Pa', 3)}`,
		],
		// the litres not converted; the 1/3 forgotten; the speed not squared
		answer: options(rng, p, [p / 1000, 3 * p, p / v], 'Pa', 3),
		params: { case: g.mono ? 'atomi' : 'molecole', gas: g.name, V: String(V), v, N: String(N), m: String(m) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the speed from pressure and density

function level5(rng: Rng): Built {
	const light = rng.next() < 0.5;
	const P = noZero(rng, 61, 299); // kPa
	const p = P * 1000;
	const k = light ? noZero(rng, 101, 999) : noZero(rng, 101, 249);
	const d = light ? k / 1000 : k / 100;
	const dTex = fx(d, light ? 3 : 2);
	const pTex = sci(p, 3);
	const vqm = Math.sqrt((3 * p) / d);
	return {
		prompt: 'Trova la velocità quadratica media.',
		problem: textBlock(`Un gas alla pressione di ${pu(pTex, 'Pa')} ha densità ${pu(dTex, 'kgm3')}. Quanto vale la velocità quadratica media delle sue molecole?`),
		solution: `v_{qm} \\approx ${wu(must(vqm, 3), 'ms')}`,
		steps: [
			t('Dalla formula della pressione scritta con la densità:') + ` \\; p = \\dfrac{1}{3}\\,d\\,v_{qm}^2`,
			`v_{qm} = \\sqrt{\\dfrac{3\\,p}{d}} = \\sqrt{\\dfrac{3 \\cdot ${pTex}\\,\\text{Pa}}{${wu(dTex, 'kgm3')}}} ${approx(vqm, 'ms', 3)}`,
		],
		// the 3 forgotten; the root forgotten; density and pressure multiplied
		answer: options(rng, vqm, [Math.sqrt(p / d), (3 * p) / d, Math.sqrt(3 * p * d)], 'ms', 3),
		params: { case: light ? 'gas leggero' : 'gas denso', p: String(p), d: String(d) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: how the pressure changes

const VERB: [Rational, string][] = [
	[q(2), 'raddoppia'],
	[q(3), 'triplica'],
	[q(1, 2), 'si dimezza'],
	[q(1), 'non cambia'],
];
const p0 = (k: Rational) => (k.equals(q(1)) ? 'p_0' : k.den === 1 ? `${k.num}\\,p_0` : `\\dfrac{${k.num}}{${k.den}}\\,p_0`);
const frac = (k: Rational) => (k.den === 1 ? String(k.num) : `\\dfrac{${k.num}}{${k.den}}`);

function level6(rng: Rng): Built {
	for (;;) {
		const [a, an] = rng.pick(VERB), [b, bn] = rng.pick(VERB), [c, cn] = rng.pick(VERB);
		const one = q(1);
		if ([a, b, c].filter((x) => !x.equals(one)).length < 2 || c.equals(one)) continue;
		const k = a.mul(c).mul(c).div(b);
		// the square forgotten; the volume the wrong way up; both; then other simple multiples
		const wrong = [a.mul(c).div(b), a.mul(c).mul(c).mul(b), a.mul(c).mul(b), k.mul(q(2)), k.div(q(2)), k.mul(q(3)), one];
		const seen = new Set([k.toString()]);
		const opts = [k];
		for (const w of wrong) {
			if (opts.length === 4) break;
			if (seen.has(w.toString())) continue;
			seen.add(w.toString());
			opts.push(w);
		}
		const order = shuffle(rng, [0, 1, 2, 3]);
		const answer: ChoiceAnswer = { kind: 'choice', options: order.map((i) => ({ latex: p0(opts[i]), values: [opts[i].toString()] })), correct: order.indexOf(0) };
		return {
			prompt: 'Trova la pressione finale.',
			problem: textBlock(`In un recipiente il numero di molecole ${an}, il volume ${bn} e la velocità quadratica media ${cn}. La pressione iniziale è $p_0$: quanto vale quella finale?`),
			solution: `p = ${p0(k)}`,
			steps: [
				t('La pressione va come il numero di molecole e come il quadrato della velocità, e come l’inverso del volume:') + ` \\; p = \\dfrac{N\\,m\\,v_{qm}^2}{3\\,V}`,
				`\\dfrac{p}{p_0} = \\dfrac{${frac(a)} \\cdot \\left(${frac(c)}\\right)^2}{${frac(b)}} = ${frac(k)}`,
			],
			answer,
			params: { case: c.compare(one) > 0 ? 'più veloci' : 'più lente', N: a.toString(), V: b.toString(), v: c.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	if (sample.level !== 6) return checkCommon(sample);
	// level 6: the options are fractions of p_0, not decimal numbers
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	const v: string[] = [];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.values[0])).size !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (!sample.steps.length) v.push('nessun passaggio');
	return v;
}

export const fisTeoriaCinetica: Generator = {
	id: ID,
	title: 'La teoria cinetica dei gas',
	levels: {
		1: { label: 'Quante molecole ci sono', constraints: ['N = n N_A', 'due cifre significative'] },
		2: { label: 'La massa di una molecola', constraints: ['m = M / N_A', 'la massa molare da grammi a chilogrammi'] },
		3: { label: 'La velocità quadratica media di poche molecole', constraints: ['quadrati, media, radice', 'da tre a cinque molecole, con la figura'] },
		4: { label: 'La pressione dal modello', constraints: ['p = N m v_qm² / (3V)', 'il volume da litri a metri cubi'] },
		5: { label: 'La velocità dalla pressione e dalla densità', constraints: ['v_qm = √(3p/d)'] },
		6: { label: 'Come cambia la pressione', constraints: ['p proporzionale a N v_qm² / V', 'risposta come multiplo di p₀'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTeoriaCinetica;
