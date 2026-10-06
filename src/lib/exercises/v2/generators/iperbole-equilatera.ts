/**
 * Iperbole equilatera e funzione omografica (lesson 120, slug iperbole-equilatera). Spec:
 * specs/exercises/iperbole-equilatera.md
 *
 * Six levels in the order of the lesson: the foci of x^2 - y^2 = ±a^2; the vertex of xy = k; the focus of xy = k;
 * asymptotes and centre of y = (ax + b)/(x + d); the centre with fractions, y = (ax + b)/(cx + d); the function
 * from its asymptotes and a point of the graph.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { poly, polyToLatex } from '../latex';
import { type Axis, type Built, assemble, axisOption, choiceOf, nonZero, onAxis, other, pair, rootLatex, shuffle, t } from '../ellisse-iperbole';

export const ID = 'iperbole-equilatera';

const pointOption = (x: Rational, y: Rational, letter = ''): ChoiceOption => ({ latex: `${letter}${pair(x, y)}`, values: [x.toString(), y.toString()] });
const lineOption = (v: Axis, k: Rational): ChoiceOption => ({ latex: `${v} = ${k.toLatex()}`, values: [v, k.toString()] });

/** y = (ax + b)/(cx + d). */
const homographic = (a: number, b: number, c: number, d: number): string => `y = \\frac{${polyToLatex(poly(b, a))}}{${polyToLatex(poly(d, c))}}`;

// ---------------------------------------------------------------------------
// Level 1: x^2 - y^2 = ±a^2

const K_POOL = [1, 2, 4, 8, 9, 16, 18, 25, 32, 36, 49, 50];

function level1(rng: Rng): Built {
	const k = rng.pick(K_POOL);
	const rhs = rng.next() < 0.5 ? 1 : -1;
	const axis: Axis = rhs === 1 ? 'x' : 'y';
	const answer = choiceOf(ID, rng, axisOption('F', axis, 2 * k), [axisOption('F', other(axis), 2 * k), axisOption('F', axis, k), axisOption('F', axis, 4 * k * k), axisOption('F', other(axis), k)]);
	const a = rootLatex(k);
	const c = rootLatex(2 * k);
	return {
		prompt: "Trova i fuochi dell'iperbole equilatera.",
		problem: `x^2 - y^2 = ${rhs * k}`,
		solution: `F${onAxis(axis, 2 * k)}`,
		steps: [
			`${t(`Il secondo membro è ${rhs === 1 ? 'positivo' : 'negativo'}: i fuochi stanno sull'asse `)} ${axis}`,
			`a^2 = ${k}${t(', quindi ')} a = ${a}`,
			Number.isInteger(Math.sqrt(k)) ? `c = a\\sqrt{2} = ${c}` : `c = a\\sqrt{2} = ${a} \\cdot \\sqrt{2} = \\sqrt{${2 * k}} = ${c}`,
			`${t('I fuochi sono ')} F${onAxis(axis, 2 * k)}`,
		],
		answer,
		params: { case: `asse ${axis}`, k: rhs * k },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: xy = k

const quadrants = (s: number) => (s > 0 ? 'nel primo e nel terzo quadrante' : 'nel secondo e nel quarto quadrante');
const bisector = (s: number) => (s > 0 ? 'y = x' : 'y = -x');

function level2(rng: Rng): Built {
	const n = rng.int(2, 7);
	const s = rng.next() < 0.5 ? 1 : -1;
	const k = s * n * n;
	const K = Math.abs(k);
	const answer = choiceOf(ID, rng, pointOption(q(n), q(s * n), 'V'), [pointOption(q(n), q(-s * n), 'V'), ...shuffle(rng, [pointOption(q(K), q(0), 'V'), pointOption(q(K), q(s * K), 'V'), pointOption(q(0), q(K), 'V')])]);
	return {
		prompt: "Trova il vertice dell'iperbole che ha ascissa positiva.",
		problem: `xy = ${k}`,
		solution: `V${pair(q(n), q(s * n))}`,
		steps: [
			`k = ${k} ${t(` è ${s > 0 ? 'positivo' : 'negativo'}: i rami stanno ${quadrants(s)}, e i vertici sulla retta `)} ${bisector(s)}`,
			`${t('Sostituisci ')} ${bisector(s)} ${t(' in ')} xy = ${k}${t(': ')} x^2 = ${K}${t(', quindi ')} x = \\pm ${n}`,
			`${t('Con ')} x = ${n} ${t(' è ')} y = ${s * n}${t(': il vertice è ')} V${pair(q(n), q(s * n))}${t('. Gli assi sono asintoti: l\'iperbole non li incontra.')}`,
		],
		answer,
		params: { case: s > 0 ? 'k positivo' : 'k negativo', k },
	};
}

function level3(rng: Rng): Built {
	const m = rng.int(1, 5);
	const s = rng.next() < 0.5 ? 1 : -1;
	const k = s * 2 * m * m;
	const K = Math.abs(k);
	const P = (x: number, y: number) => pointOption(q(x), q(y), 'F');
	const answer = choiceOf(ID, rng, P(2 * m, s * 2 * m), [P(2 * m, -s * 2 * m), ...shuffle(rng, [P(K, s * K), P(m, s * m), P(2 * K, s * 2 * K), P(2 * m, 0)]), P(4 * m, s * 4 * m)]);
	return {
		prompt: "Trova il fuoco dell'iperbole che ha ascissa positiva.",
		problem: `xy = ${k}`,
		solution: `F${pair(q(2 * m), q(s * 2 * m))}`,
		steps: [
			`k = ${k} ${t(` è ${s > 0 ? 'positivo' : 'negativo'}: i rami stanno ${quadrants(s)}, e i fuochi sulla retta `)} ${bisector(s)}`,
			`${t('Le coordinate dei fuochi valgono, in valore assoluto, ')} \\sqrt{2|k|} = \\sqrt{${2 * K}} = ${2 * m}`,
			`${t('Il fuoco con ascissa positiva è ')} F${pair(q(2 * m), q(s * 2 * m))}`,
		],
		answer,
		params: { case: s > 0 ? 'k positivo' : 'k negativo', k },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: asymptotes and centre of a homographic function

function centreSteps(a: number, b: number, c: number, d: number): string[] {
	const [xc, yc] = [q(-d, c), q(a, c)];
	return [
		`${t('I coefficienti sono ')} a = ${a},\\ b = ${b},\\ c = ${c},\\ d = ${d}${t(', con ')} ad - bc = ${a * d - b * c} \\neq 0`,
		`${t('Asintoto verticale, dove si annulla il denominatore: ')} x = -\\frac{d}{c} = ${xc.toLatex()}`,
		`${t('Asintoto orizzontale, il rapporto tra i coefficienti di ')} x${t(': ')} y = \\frac{a}{c} = ${yc.toLatex()}`,
		`${t('Il centro è il punto in cui si incontrano: ')} C${pair(xc, yc)}`,
	];
}

function level4(rng: Rng): Built {
	for (;;) {
		const a = nonZero(rng, -5, 5);
		const d = nonZero(rng, -6, 6);
		const b = rng.int(-9, 9);
		if (b === a * d || -d === a) continue;
		const [xc, yc] = [q(-d), q(a)];
		const u = rng.next();
		const kind = u < 1 / 3 ? 'verticale' : u < 2 / 3 ? 'orizzontale' : 'centro';
		const steps = centreSteps(a, b, 1, d);
		let answer, solution, prompt;
		if (kind === 'verticale') {
			prompt = "Trova l'asintoto verticale del grafico della funzione.";
			solution = `x = ${xc.toLatex()}`;
			answer = choiceOf(ID, rng, lineOption('x', xc), [lineOption('x', q(d)), ...shuffle(rng, [lineOption('y', xc), lineOption('x', yc), lineOption('x', q(-b, a)), lineOption('y', yc)])]);
		} else if (kind === 'orizzontale') {
			prompt = "Trova l'asintoto orizzontale del grafico della funzione.";
			solution = `y = ${yc.toLatex()}`;
			answer = choiceOf(ID, rng, lineOption('y', yc), [lineOption('y', q(b, d)), ...shuffle(rng, [lineOption('x', yc), lineOption('y', xc), lineOption('y', q(-a)), lineOption('x', xc)])]);
		} else {
			prompt = "Trova il centro dell'iperbole, grafico della funzione.";
			solution = `C${pair(xc, yc)}`;
			answer = choiceOf(ID, rng, pointOption(xc, yc, 'C'), [pointOption(q(d), yc, 'C'), ...shuffle(rng, [pointOption(xc, q(b, d), 'C'), pointOption(yc, xc, 'C'), pointOption(q(d), q(b, d), 'C'), pointOption(xc, q(-a), 'C')])]);
		}
		return { prompt, problem: homographic(a, b, 1, d), solution, steps, answer, params: { case: kind, a, b, c: 1, d } };
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const c = rng.pick([2, 3, 4, -2, -3]);
		const a = nonZero(rng, -6, 6);
		const d = nonZero(rng, -6, 6);
		const b = rng.int(-9, 9);
		if (a * d === b * c || gcd(gcd(Math.abs(a), Math.abs(b)), gcd(Math.abs(c), Math.abs(d))) !== 1) continue;
		const [xc, yc] = [q(-d, c), q(a, c)];
		if (xc.isInteger() && yc.isInteger()) continue;
		const C = (x: Rational, y: Rational) => pointOption(x, y, 'C');
		let answer;
		try {
			answer = choiceOf(ID, rng, C(xc, yc), [C(xc.neg(), yc), ...shuffle(rng, [C(xc, q(b, d)), C(yc, xc), C(q(-d), q(a)), C(xc, yc.neg())]), C(xc.neg(), yc.neg())]);
		} catch {
			continue;
		}
		return {
			prompt: "Trova il centro dell'iperbole, grafico della funzione.",
			problem: homographic(a, b, c, d),
			solution: `C${pair(xc, yc)}`,
			steps: centreSteps(a, b, c, d),
			answer,
			params: { case: 'centro', a, b, c, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the function from its asymptotes and a point

function level6(rng: Rng): Built {
	for (;;) {
		const p = nonZero(rng, -5, 5);
		const h = nonZero(rng, -5, 5);
		const k = nonZero(rng, -6, 6);
		const dx = rng.pick([1, -1, 2, -2, 3, -3]);
		if (k % dx !== 0) continue;
		const [x0, y0] = [p + dx, h + k / dx];
		const opt = (a: number, b: number, d: number): ChoiceOption => ({ latex: homographic(a, b, 1, d), values: [String(a), String(b), '1', String(d)] });
		const right = opt(h, k - p * h, -p);
		let answer;
		try {
			answer = choiceOf(ID, rng, right, [opt(h, k + p * h, p), ...shuffle(rng, [opt(0, k, -p), opt(p, k - p * h, -h), opt(h, -k - p * h, -p), opt(h, k, -p)])].filter((o) => Number(o.values[0]) * Number(o.values[3]) !== Number(o.values[1])));
		} catch {
			continue;
		}
		const den = polyToLatex(poly(-p, 1));
		return {
			prompt: 'Trova la funzione omografica che ha per asintoti le due rette indicate e il cui grafico passa per P.',
			problem: `x = ${p} \\qquad y = ${h} \\qquad P(${x0}, ${y0})`,
			solution: right.latex,
			steps: [
				`${t('Con gli asintoti ')} x = ${p} ${t(' e ')} y = ${h} ${t(' la funzione ha la forma ')} y = ${h} + \\frac{k}{${den}}`,
				`${t('Sostituisci le coordinate di ')} P${t(': ')} ${y0} = ${h} + \\frac{k}{${dx}}${t(', quindi ')} k = ${k}`,
				`${t('Riduci a una sola frazione: ')} y = \\frac{${h === 1 ? '' : h === -1 ? '-' : h}(${den}) ${k < 0 ? '-' : '+'} ${Math.abs(k)}}{${den}}`,
				right.latex,
			],
			answer,
			params: { case: 'asintoti e punto', p, q: h, x0, y0 },
		};
	}
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, number | string>;
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	const right = ch?.options[ch.correct]?.values.join('|');
	switch (s.level) {
		case 1: {
			const k = Number(p.k);
			if (right !== `${k > 0 ? 'x' : 'y'}|${2 * Math.abs(k)}`) v.push('fuochi sbagliati');
			break;
		}
		case 2: {
			const k = Number(p.k);
			const n = Math.sqrt(Math.abs(k));
			if (!Number.isInteger(n) || right !== `${n}|${Math.sign(k) * n}`) v.push('vertice sbagliato');
			break;
		}
		case 3: {
			const k = Number(p.k);
			const f = Math.sqrt(2 * Math.abs(k));
			if (!Number.isInteger(f) || right !== `${f}|${Math.sign(k) * f}`) v.push('fuoco sbagliato');
			break;
		}
		case 4:
		case 5: {
			const [a, b, c, d] = [Number(p.a), Number(p.b), Number(p.c), Number(p.d)];
			if (c === 0 || a * d === b * c) v.push('non è una funzione omografica');
			const [xc, yc] = [q(-d, c), q(a, c)];
			const want = p.case === 'verticale' ? `x|${xc}` : p.case === 'orizzontale' ? `y|${yc}` : `${xc}|${yc}`;
			if (right !== want) v.push('risposta sbagliata');
			if (s.level === 5 && xc.isInteger() && yc.isInteger()) v.push('centro intero al livello 5');
			break;
		}
		case 6: {
			const [pp, h, x0, y0] = [Number(p.p), Number(p.q), Number(p.x0), Number(p.y0)];
			const k = (y0 - h) * (x0 - pp);
			if (k === 0 || right !== `${h}|${k - pp * h}|1|${-pp}`) v.push('funzione sbagliata');
			if (ch?.options.some((o) => Number(o.values[0]) * Number(o.values[3]) === Number(o.values[1]))) v.push('opzione che non è una funzione omografica');
			break;
		}
		default:
			v.push(`livello sconosciuto ${s.level}`);
	}
	return v;
}

export const iperboleEquilatera = assemble(
	ID,
	'Iperbole equilatera e funzione omografica',
	{
		1: { label: 'Fuochi di x^2 - y^2 = ±a^2', constraints: ['c = a√2, sull\'asse x se il secondo membro è positivo, sull\'asse y se è negativo', 'distrattori: i vertici, l\'asse sbagliato, c = 2a^2'] },
		2: { label: 'Vertice di xy = k', constraints: ['k = ±n^2 con n tra 2 e 7', 'distrattori: il quadrante sbagliato, punti sugli assi, (k, k)'] },
		3: { label: 'Fuoco di xy = k', constraints: ['k = ±2m^2 con m tra 1 e 5: fuochi con coordinate intere', 'distrattori: il quadrante sbagliato, il vertice, (k, k)'] },
		4: { label: 'Asintoti e centro di y = (ax + b)/(x + d)', constraints: ['un terzo asintoto verticale, un terzo orizzontale, un terzo centro', 'coefficienti interi, ad - b diverso da 0'] },
		5: { label: 'Centro con le frazioni', constraints: ['c in {±2, ±3, 4}, almeno una coordinata del centro frazionaria', 'coefficienti senza divisori comuni'] },
		6: { label: 'La funzione dagli asintoti e da un punto', constraints: ['asintoti x = p, y = q con p e q interi non nulli', 'risposta ridotta a una sola frazione con denominatore x - p'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
	check,
);

export default iperboleEquilatera;
