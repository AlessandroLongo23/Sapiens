/**
 * Progressioni aritmetiche (lesson slug progressioni-aritmetiche). Spec: specs/exercises/progressioni-aritmetiche.md
 *
 * Seven levels in the order of the lesson: the common difference from the first terms; a term from a_1 and d;
 * the place of a term; the first term from two terms; arithmetic means between two numbers; the sum of the first
 * n terms; a sum given by its first terms and its last one, where the terms must be counted. Every exercise
 * starts from a_1, d and n and builds its numbers from them; all the answers are exact numbers.
 */
import type { Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { type Built, chapterGenerator, nonZero, numberAnswer, numberChoice, numberCheck, par, t, termList } from '../successioni';

export const ID = 'progressioni-aritmetiche';

const R = (x: unknown) => Rational.parse(String(x));
const N = (x: unknown) => Number(x);

const FRACTIONS: Rational[] = [q(1, 2), q(3, 2), q(-1, 2), q(5, 2), q(1, 3), q(2, 3), q(-3, 2), q(3, 4), q(-1, 4)];

const term = (a1: Rational, d: Rational, n: number): Rational => a1.add(d.mul(q(n - 1)));
const sum = (a1: Rational, d: Rational, n: number): Rational => a1.add(term(a1, d, n)).mul(q(n, 2));

/** "x + y" or "x - |y|": a sum whose second addend may be negative. */
const plus = (x: string, y: Rational): string => (y.sign() < 0 ? `${x} - ${y.abs().toLatex()}` : `${x} + ${y.toLatex()}`);

function level1(rng: Rng): Built {
	const frac = rng.next() < 0.25;
	const d = frac ? rng.pick(FRACTIONS) : q(nonZero(rng, -9, 9));
	const a1 = q(rng.int(-12, 12));
	const xs = [1, 2, 3, 4].map((n) => term(a1, d, n));
	const wrong = [d.neg(), xs[1].add(xs[0]), xs[0]];
	if (!xs[0].isZero()) wrong.push(xs[1].div(xs[0]));
	return {
		prompt: 'Trova la ragione della progressione aritmetica.',
		problem: termList(xs),
		solution: `d = ${d.toLatex()}`,
		steps: [
			t('La ragione è la differenza tra un termine e il precedente'),
			`d = ${plus(xs[1].toLatex(), xs[0].neg())} = ${d.toLatex()}`,
			`${t('Controllo con i due termini successivi: ')}${plus(xs[2].toLatex(), xs[1].neg())} = ${d.toLatex()}`,
		],
		answer: numberAnswer(d),
		choice: numberChoice(ID, rng, d, wrong),
		params: { case: frac ? 'frazionaria' : 'intera', terms: xs.map(String) },
	};
}

function level2(rng: Rng): Built {
	const [a1, d, n] = [q(rng.int(-15, 20)), q(nonZero(rng, -9, 9)), rng.int(8, 40)];
	const value = term(a1, d, n);
	return {
		prompt: 'Calcola il termine indicato della progressione aritmetica.',
		problem: `\\begin{array}{l} a_1 = ${a1.toLatex()} \\qquad d = ${d.toLatex()} \\\\ a_{${n}} = \\ ? \\end{array}`,
		solution: `a_{${n}} = ${value.toLatex()}`,
		steps: [`a_n = a_1 + (n - 1)d`, `a_{${n}} = ${a1.toLatex()} + ${n - 1} \\cdot ${par(d)} = ${plus(a1.toLatex(), d.mul(q(n - 1)))} = ${value.toLatex()}`],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [term(a1, d, n + 1), term(a1, d, n - 1), d.mul(q(n)), a1.mul(q(n)).add(d)]),
		params: { a1: a1.toString(), d: d.toString(), n },
	};
}

function level3(rng: Rng): Built {
	const [a1, d, n] = [q(rng.int(-15, 20)), q(rng.pick([1, -1]) * rng.int(2, 9)), rng.int(8, 40)];
	const value = term(a1, d, n);
	const gap = value.sub(a1);
	return {
		prompt: 'Trova il posto n del termine indicato nella progressione aritmetica.',
		problem: `\\begin{array}{l} a_1 = ${a1.toLatex()} \\qquad d = ${d.toLatex()} \\qquad a_n = ${value.toLatex()} \\\\ n = \\ ? \\end{array}`,
		solution: `n = ${n}`,
		steps: [
			`${a1.toLatex()} + (n - 1) \\cdot ${par(d)} = ${value.toLatex()}`,
			`(n - 1) \\cdot ${par(d)} = ${gap.toLatex()} \\ \\Rightarrow \\ n - 1 = ${n - 1}`,
			`n = ${n}${t(': i termini sono uno più dei passi')}`,
		],
		answer: numberAnswer(q(n)),
		choice: numberChoice(ID, rng, q(n), [q(n - 1), q(n + 1), q(n - 2)]),
		params: { a1: a1.toString(), d: d.toString(), value: value.toString() },
	};
}

function level4(rng: Rng): Built {
	const [a1, d] = [q(rng.int(-15, 15)), q(nonZero(rng, -6, 6))];
	const k = rng.int(2, 6);
	const m = k + rng.int(2, 8);
	const [ak, am] = [term(a1, d, k), term(a1, d, m)];
	const wrongD = am.sub(ak).div(q(m - k + 1));
	return {
		prompt: 'Trova il primo termine della progressione aritmetica.',
		problem: `\\begin{array}{l} a_{${k}} = ${ak.toLatex()} \\qquad a_{${m}} = ${am.toLatex()} \\\\ a_1 = \\ ? \\end{array}`,
		solution: `a_1 = ${a1.toLatex()}`,
		steps: [
			`${t(`Dal termine di posto ${k} a quello di posto ${m} ci sono `)}${m} - ${k} = ${m - k}${t(' passi')}`,
			`d = \\frac{${plus(am.toLatex(), ak.neg())}}{${m - k}} = ${d.toLatex()}`,
			`a_1 = a_{${k}} - ${k - 1} \\cdot d = ${ak.toLatex()} - ${k - 1} \\cdot ${par(d)} = ${a1.toLatex()}`,
		],
		answer: numberAnswer(a1),
		choice: numberChoice(ID, rng, a1, [ak.sub(d.mul(q(k))), ak.add(d.mul(q(k - 1))), ak.sub(wrongD.mul(q(k - 1))), ak.sub(d)]),
		params: { k, m, ak: ak.toString(), am: am.toString() },
	};
}

function level5(rng: Rng): Built {
	const means = rng.int(2, 6);
	const d = means % 2 === 1 && rng.next() < 0.3 ? rng.pick([q(1, 2), q(3, 2), q(-1, 2), q(5, 2), q(-3, 2)]) : q(nonZero(rng, -6, 6));
	const a = q(rng.int(-10, 20));
	const b = a.add(d.mul(q(means + 1)));
	const diff = b.sub(a);
	return {
		prompt: 'Trova la ragione della progressione aritmetica che si ottiene.',
		problem: `\\begin{array}{l} \\text{Inserisci $${means}$ medi aritmetici tra $${a.toLatex()}$ e $${b.toLatex()}$.} \\\\ d = \\ ? \\end{array}`,
		solution: `d = ${d.toLatex()}`,
		steps: [
			`${t(`Con i due estremi i termini sono ${means + 2}, e i passi dal primo all'ultimo sono `)}${means + 1}`,
			`d = \\frac{${plus(b.toLatex(), a.neg())}}{${means + 1}} = \\frac{${diff.toLatex()}}{${means + 1}} = ${d.toLatex()}`,
		],
		answer: numberAnswer(d),
		choice: numberChoice(ID, rng, d, [diff.div(q(means)), diff.div(q(means + 2)), diff, d.neg()]),
		params: { means, a: a.toString(), b: b.toString() },
	};
}

function level6(rng: Rng): Built {
	const [a1, d, n] = [q(rng.int(-10, 20)), q(nonZero(rng, -6, 8)), rng.int(8, 40)];
	const an = term(a1, d, n);
	const value = sum(a1, d, n);
	const ends = a1.add(an);
	return {
		prompt: 'Calcola la somma dei primi n termini della progressione aritmetica.',
		problem: `\\begin{array}{l} a_1 = ${a1.toLatex()} \\qquad d = ${d.toLatex()} \\\\ S_{${n}} = \\ ? \\end{array}`,
		solution: `S_{${n}} = ${value.toLatex()}`,
		steps: [
			`a_{${n}} = ${a1.toLatex()} + ${n - 1} \\cdot ${par(d)} = ${an.toLatex()}`,
			`S_{${n}} = \\frac{${n} \\cdot (${plus(a1.toLatex(), an)})}{2} = \\frac{${n} \\cdot ${par(ends)}}{2} = ${value.toLatex()}`,
		],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [ends.mul(q(n)), ends.mul(q(n - 1, 2)), a1.add(term(a1, d, n + 1)).mul(q(n, 2)), an]),
		params: { a1: a1.toString(), d: d.toString(), n },
	};
}

function level7(rng: Rng): Built {
	const d0 = rng.int(2, 12);
	const n = rng.int(8, 40);
	const low = rng.int(1, 120);
	const high = low + (n - 1) * d0;
	const down = rng.next() < 0.3;
	const [first, d, last] = down ? [high, -d0, low] : [low, d0, high];
	const shown = [0, 1, 2].map((i) => first + i * d);
	const value = q(((first + last) * n) / 2);
	return {
		prompt: 'Calcola la somma dei termini della progressione aritmetica.',
		problem: `S = ${shown.join(' + ')} + \\dots + ${last}`,
		solution: `S = ${value.toLatex()}`,
		steps: [
			`${t('La ragione è ')}d = ${shown[1]} - ${shown[0]} = ${d}`,
			`${t('Il numero dei termini è ')}n = \\frac{${last} - ${first}}{${d}} + 1 = ${n - 1} + 1 = ${n}`,
			`S = \\frac{${n} \\cdot (${first} + ${last})}{2} = \\frac{${n} \\cdot ${first + last}}{2} = ${value.toLatex()}`,
		],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [Rational.of((first + last) * (n - 1), 2), q((first + last) * n), Rational.of((first + last) * (n + 1), 2)]),
		params: { first, d, last },
	};
}

function check(s: Sample): string[] {
	const p = s.params;
	switch (s.level) {
		case 1: {
			const xs = (p.terms as string[]).map(R);
			const d = xs[1].sub(xs[0]);
			if (!xs.slice(1).every((x, i) => x.sub(xs[i]).equals(d)) || d.isZero()) return ['i termini non sono in progressione aritmetica'];
			return numberCheck(s, d);
		}
		case 2:
			return numberCheck(s, term(R(p.a1), R(p.d), N(p.n)));
		case 3: {
			const n = R(p.value).sub(R(p.a1)).div(R(p.d)).add(q(1));
			return n.isInteger() && n.num >= 1 ? numberCheck(s, n) : ['il numero non è un termine'];
		}
		case 4: {
			const d = R(p.am).sub(R(p.ak)).div(q(N(p.m) - N(p.k)));
			return numberCheck(s, R(p.ak).sub(d.mul(q(N(p.k) - 1))));
		}
		case 5:
			return numberCheck(s, R(p.b).sub(R(p.a)).div(q(N(p.means) + 1)));
		case 6:
			return numberCheck(s, sum(R(p.a1), R(p.d), N(p.n)));
		case 7: {
			const n = (N(p.last) - N(p.first)) / N(p.d) + 1;
			if (!Number.isInteger(n) || n < 2 || Math.min(N(p.first), N(p.last)) < 1) return ['estremi fuori specifica'];
			return numberCheck(s, sum(q(N(p.first)), q(N(p.d)), n));
		}
		default:
			return [`livello sconosciuto ${s.level}`];
	}
}

export const progressioniAritmetiche = chapterGenerator({
	id: ID,
	title: 'Progressioni aritmetiche',
	levels: {
		1: { label: 'La ragione dai primi termini', constraints: ['quattro termini, primo termine intero tra -12 e 12', 'tre su quattro con ragione intera non nulla, uno con ragione frazionaria'] },
		2: { label: 'Un termine da a_1 e d', constraints: ['a_n = a_1 + (n - 1)d con n tra 8 e 40', 'ragione intera non nulla tra -9 e 9'] },
		3: { label: 'Il posto di un termine', constraints: ['|d| tra 2 e 9, posto tra 8 e 40'] },
		4: { label: 'Il primo termine da due termini', constraints: ['due termini di posto k e m con m - k tra 2 e 8', 'ragione intera non nulla tra -6 e 6'] },
		5: { label: 'Inserire medi aritmetici', constraints: ['da 2 a 6 medi; si chiede la ragione', 'ragione intera, a volte con denominatore 2'] },
		6: { label: 'La somma dei primi n termini', constraints: ['n tra 8 e 40, ragione intera non nulla'] },
		7: { label: 'Una somma di cui contare i termini', constraints: ['tre termini iniziali e l’ultimo, tutti positivi', 'tre su dieci decrescenti'] },
	},
	builders: { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	check,
});

export default progressioniAritmetiche;
