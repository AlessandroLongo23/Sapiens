/**
 * Progressioni geometriche (lesson slug progressioni-geometriche). Spec: specs/exercises/progressioni-geometriche.md
 *
 * Seven levels in the order of the lesson: the common ratio from the first terms; a term from a_1 and q;
 * increasing, decreasing or with alternating signs; the ratio from two terms (one ratio when the exponent is
 * odd, two when it is even); the place of a term; the sum of the first n terms; growth at a constant
 * percentage. Every exercise starts from a_1, q and n; all the numbers are exact rationals.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, lcm, q } from '../rational';
import { setLatex } from '../latex';
import { type Built, chapterGenerator, choiceOf, correctValues, nonZero, numberAnswer, numberChoice, numberCheck, par, pow, powLatex, t, termList } from '../successioni';

export const ID = 'progressioni-geometriche';

const R = (x: unknown) => Rational.parse(String(x));
const N = (x: unknown) => Number(x);

const term = (a1: Rational, r: Rational, n: number): Rational => a1.mul(pow(r, n - 1));
const sum = (a1: Rational, r: Rational, n: number): Rational => (r.isOne() ? a1.mul(q(n)) : a1.mul(pow(r, n).sub(q(1))).div(r.sub(q(1))));

/** A first term that keeps the first `n` terms integer when the ratio has denominator `den`. */
function firstFor(rng: Rng, den: number, n: number): Rational {
	const base = den ** (n - 1);
	return q(rng.pick([1, -1]) * base * rng.int(1, den === 2 ? 5 : 2));
}

function level1(rng: Rng): Built {
	const frac = rng.next() < 0.4;
	const r = frac ? rng.pick([q(1, 2), q(1, 3), q(-1, 2), q(3, 2), q(2, 3), q(-1, 3)]) : q(rng.pick([2, 3, -2, -3, 4, 5, -4, 10]));
	const a1 = frac ? firstFor(rng, r.den, 4) : q(nonZero(rng, -6, 6));
	const xs = [1, 2, 3, 4].map((n) => term(a1, r, n));
	return {
		prompt: 'Trova la ragione della progressione geometrica.',
		problem: termList(xs),
		solution: `q = ${r.toLatex()}`,
		steps: [
			t('La ragione è il rapporto tra un termine e il precedente'),
			`q = \\frac{${xs[1].toLatex()}}{${xs[0].toLatex()}} = ${r.toLatex()}`,
			`${t('Controllo con i due termini successivi: ')}\\frac{${xs[2].toLatex()}}{${xs[1].toLatex()}} = ${r.toLatex()}`,
		],
		answer: numberAnswer(r),
		choice: numberChoice(ID, rng, r, [q(1).div(r), xs[1].sub(xs[0]), r.neg(), q(-1).div(r)]),
		params: { case: frac ? 'frazionaria' : 'intera', terms: xs.map(String) },
	};
}

/** a_1, q and n with terms and sums that stay readable. */
function pick(rng: Rng): { a1: Rational; r: Rational; n: number } {
	const r = q(rng.pick([2, 2, 3, -2, -3]));
	if (rng.next() < 0.25) {
		const n = rng.int(4, 7);
		return { a1: firstFor(rng, 2, n - 1), r: rng.pick([q(1, 2), q(-1, 2)]), n };
	}
	return { a1: q(nonZero(rng, -6, 6)), r, n: Math.abs(r.num) === 2 ? rng.int(5, 10) : rng.int(4, 7) };
}

function level2(rng: Rng): Built {
	const { a1, r, n } = pick(rng);
	const value = term(a1, r, n);
	const p = pow(r, n - 1);
	return {
		prompt: 'Calcola il termine indicato della progressione geometrica.',
		problem: `\\begin{array}{l} a_1 = ${a1.toLatex()} \\qquad q = ${r.toLatex()} \\\\ a_{${n}} = \\ ? \\end{array}`,
		solution: `a_{${n}} = ${value.toLatex()}`,
		steps: [`a_n = a_1 \\cdot q^{n-1}`, `a_{${n}} = ${a1.toLatex()} \\cdot ${powLatex(r, n - 1)} = ${a1.toLatex()} \\cdot ${par(p)} = ${value.toLatex()}`],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [term(a1, r, n + 1), term(a1, r, n - 1), value.neg(), a1.add(r.mul(q(n - 1)))]),
		params: { a1: a1.toString(), q: r.toString(), n },
	};
}

type Behaviour = 'crescente' | 'decrescente' | 'costante' | 'alterni';
const BEHAVIOUR_LATEX: Record<Behaviour, string> = {
	crescente: t('crescente'),
	decrescente: t('decrescente'),
	costante: t('costante'),
	alterni: t('a segni alterni'),
};

function level3(rng: Rng): Built {
	const u = rng.next();
	const target: Behaviour = u < 0.3 ? 'crescente' : u < 0.6 ? 'decrescente' : u < 0.9 ? 'alterni' : 'costante';
	const big = () => rng.pick([q(2), q(3), q(4), q(3, 2), q(5, 2)]);
	const small = () => rng.pick([q(1, 2), q(1, 3), q(2, 3), q(1, 4), q(3, 4)]);
	const positive = rng.next() < 0.5;
	const a1 = q((target === 'alterni' || target === 'costante' ? rng.pick([1, -1]) : positive ? 1 : -1) * rng.int(1, 9));
	const r = target === 'costante' ? q(1) : target === 'alterni' ? rng.pick([q(-2), q(-3), q(-1, 2), q(-1, 3), q(-1)]) : (target === 'crescente') === positive ? big() : small();
	const xs = [1, 2, 3].map((n) => term(a1, r, n));
	const why: Record<Behaviour, string> = {
		crescente: positive ? 'Il primo termine è positivo e la ragione è maggiore di 1: i termini crescono' : 'Il primo termine è negativo e la ragione è tra 0 e 1: i termini si avvicinano a zero da sotto, quindi crescono',
		decrescente: positive ? 'Il primo termine è positivo e la ragione è tra 0 e 1: i termini decrescono' : 'Il primo termine è negativo e la ragione è maggiore di 1: i termini decrescono',
		costante: 'La ragione è 1: tutti i termini sono uguali al primo',
		alterni: 'La ragione è negativa: ogni termine ha il segno opposto al precedente, e la progressione non è monotona',
	};
	const opts = Object.fromEntries(Object.entries(BEHAVIOUR_LATEX).map(([k, latex]) => [k, { latex, values: [k] }])) as Record<Behaviour, ChoiceOption>;
	return {
		prompt: 'Stabilisci come si comporta la progressione geometrica.',
		problem: `a_1 = ${a1.toLatex()} \\qquad q = ${r.toLatex()}`,
		solution: BEHAVIOUR_LATEX[target],
		steps: [`${t('I primi termini sono ')}${termList(xs)}`, t(why[target])],
		answer: choiceOf(
			ID,
			rng,
			opts[target],
			(Object.keys(opts) as Behaviour[]).filter((k) => k !== target).map((k) => opts[k]),
		),
		params: { case: target, a1: a1.toString(), q: r.toString() },
	};
}

const ratioOption = (values: Rational[]): ChoiceOption => {
	const sorted = [...values].sort((x, y) => x.compare(y));
	const latex = sorted.length === 2 && sorted[0].equals(sorted[1].neg()) ? `q = \\pm ${sorted[1].toLatex()}` : `q = ${sorted[0].toLatex()}`;
	return { latex, values: sorted.map(String) };
};

function level4(rng: Rng): Built {
	const two = rng.next() < 0.5;
	const gap = two ? rng.pick([2, 2, 4]) : rng.pick([1, 3, 3]);
	const k = rng.int(1, 3);
	const m = k + gap;
	const half = rng.next() < 0.25;
	const r = half ? q(rng.pick([1, -1]), 2) : q(rng.pick([2, 3, -2, -3]));
	const a1 = half ? firstFor(rng, 2, m) : q(nonZero(rng, -5, 5));
	const [ak, am] = [term(a1, r, k), term(a1, r, m)];
	if (am.abs().compare(q(5000)) > 0) return level4(rng);
	const ratio = am.div(ak);
	const abs = r.abs();
	const answer = two ? [abs.neg(), abs] : [r];
	const wrong = two ? [[abs], [abs.neg()], [ratio.div(q(gap))], [ratio], [abs.add(q(1)).neg(), abs.add(q(1))]] : [[abs.neg(), abs], [r.neg()], [ratio.div(q(gap))], [ratio], [q(1).div(r)]];
	const root = two
		? `${t(`L'esponente è pari: i numeri che hanno potenza di esponente ${gap} uguale a `)}${ratio.toLatex()}${t(' sono due, ')}${abs.toLatex()}${t(' e ')}${abs.neg().toLatex()}`
		: gap === 1
			? `${t('Tra i due termini c’è un solo passo: la ragione è il loro rapporto')}`
			: `${t(`L'esponente è dispari: un solo numero reale ha potenza di esponente ${gap} uguale a `)}${ratio.toLatex()}`;
	return {
		prompt: 'Trova la ragione della progressione geometrica. Se le ragioni possibili sono due, indicale tutte e due.',
		problem: `\\begin{array}{l} a_{${k}} = ${ak.toLatex()} \\qquad a_{${m}} = ${am.toLatex()} \\\\ q = \\ ? \\end{array}`,
		solution: ratioOption(answer).latex,
		steps: [`${gap === 1 ? 'q' : `q^${gap}`} = \\frac{a_{${m}}}{a_{${k}}} = \\frac{${am.toLatex()}}{${ak.toLatex()}} = ${ratio.toLatex()}`, root, ratioOption(answer).latex],
		answer: { kind: 'set', values: answer.map(String), latex: setLatex(answer) },
		choice: choiceOf(ID, rng, ratioOption(answer), wrong.map(ratioOption)),
		params: { case: two ? 'due' : 'una', k, m, ak: ak.toString(), am: am.toString() },
	};
}

function level5(rng: Rng): Built {
	const r = rng.pick([2, 2, 3, 3, 4, 5, 10]);
	const a1 = nonZero(rng, -6, 6);
	const n = rng.int(4, r === 2 ? 11 : r === 3 ? 8 : 6);
	const p = r ** (n - 1);
	const value = a1 * p;
	return {
		prompt: 'Trova il posto n del termine indicato nella progressione geometrica.',
		problem: `\\begin{array}{l} a_1 = ${a1} \\qquad q = ${r} \\qquad a_n = ${value} \\\\ n = \\ ? \\end{array}`,
		solution: `n = ${n}`,
		steps: [
			`${a1} \\cdot ${r}^{n-1} = ${value} \\ \\Rightarrow \\ ${r}^{n-1} = ${p}`,
			`${p} = ${powLatex(q(r), n - 1)}${t(': due potenze con la stessa base sono uguali se hanno lo stesso esponente')}`,
			`n - 1 = ${n - 1} \\ \\Rightarrow \\ n = ${n}`,
		],
		answer: numberAnswer(q(n)),
		choice: numberChoice(ID, rng, q(n), [q(n - 1), q(n + 1), q(n - 2)]),
		params: { a1, q: r, value },
	};
}

function level6(rng: Rng): Built {
	const { a1, r, n } = pick(rng);
	const value = sum(a1, r, n);
	const p = pow(r, n);
	return {
		prompt: 'Calcola la somma dei primi n termini della progressione geometrica.',
		problem: `\\begin{array}{l} a_1 = ${a1.toLatex()} \\qquad q = ${r.toLatex()} \\\\ S_{${n}} = \\ ? \\end{array}`,
		solution: `S_{${n}} = ${value.toLatex()}`,
		steps: [
			`S_n = a_1 \\cdot \\frac{q^n - 1}{q - 1}`,
			`${powLatex(r, n)} = ${p.toLatex()}`,
			`S_{${n}} = ${a1.toLatex()} \\cdot \\frac{${p.toLatex()} - 1}{${r.toLatex()} - 1} = ${a1.toLatex()} \\cdot ${par(p.sub(q(1)).div(r.sub(q(1))))} = ${value.toLatex()}`,
		],
		answer: numberAnswer(value),
		choice: numberChoice(ID, rng, value, [sum(a1, r, n - 1), a1.mul(p.sub(q(1))), term(a1, r, n), sum(a1, r, n + 1), value.neg()]),
		params: { a1: a1.toString(), q: r.toString(), n },
	};
}

const STORIES = {
	capitale: { rates: [5, 10, 20], first: (c: number, p: number) => `Un capitale di $${c}$ euro cresce del $${p}\\%$ all'anno, con interesse composto.`, ask: (n: number) => `Quanti euro vale dopo $${n}$ anni?` },
	auto: { rates: [-10, -20, -30], first: (c: number, p: number) => `Un'auto che vale $${c}$ euro perde ogni anno il $${p}\\%$ del suo valore.`, ask: (n: number) => `Quanti euro vale dopo $${n}$ anni?` },
	paese: { rates: [5, 10, 20], first: (c: number, p: number) => `Un paese di $${c}$ abitanti cresce del $${p}\\%$ all'anno.`, ask: (n: number) => `Quanti abitanti ha dopo $${n}$ anni?` },
} as const;
type Story = keyof typeof STORIES;

/** A terminating decimal with the comma: 1{,}1, 0{,}05, 1{,}331. */
const decimal = (r: Rational): string => {
	for (let e = 0; e <= 9; e++) {
		const scaled = r.mul(q(10 ** e));
		if (!scaled.isInteger()) continue;
		if (e === 0) return `${scaled.num}`;
		const digits = String(Math.abs(scaled.num)).padStart(e + 1, '0');
		return `${scaled.num < 0 ? '-' : ''}${digits.slice(0, -e)}{,}${digits.slice(-e)}`;
	}
	throw new Error(`${ID}: ${r} is not a terminating decimal`);
};

function level7(rng: Rng): Built {
	const story = rng.pick<Story>(['capitale', 'auto', 'paese']);
	const p = rng.pick(STORIES[story].rates);
	const n = rng.int(2, 3);
	const r = Rational.of(100 + p, 100);
	// A starting value that fits the story and keeps the result whole: a multiple of den^n and of a round number.
	const [lo, hi, round] = story === 'auto' ? [8000, 32000, 1000] : story === 'paese' ? [1000, 9000, 100] : [500, 9000, 100];
	const unit = lcm(r.den ** n, round);
	const c0 = unit * rng.int(Math.ceil(lo / unit), Math.max(Math.ceil(lo / unit), Math.floor(hi / unit)));
	const value = q(c0).mul(pow(r, n));
	if (c0 > hi || !value.isInteger()) return level7(rng);
	const simple = q(c0).mul(q(100 + n * p, 100));
	return {
		prompt: 'Risolvi il problema.',
		problem: `\\begin{array}{l} \\text{${STORIES[story].first(c0, Math.abs(p))}} \\\\ \\text{${STORIES[story].ask(n)}} \\end{array}`,
		solution: value.toLatex(),
		steps: [
			`${t(`Ogni anno il valore si moltiplica per `)}1 ${p > 0 ? '+' : '-'} ${decimal(q(Math.abs(p), 100))} = ${decimal(r)}${t(': è la ragione di una progressione geometrica')}`,
			`${c0} \\cdot ${decimal(r)}^${n} = ${c0} \\cdot ${decimal(pow(r, n))} = ${value.toLatex()}`,
		],
		answer: numberAnswer(value),
		choice: numberChoice(
			ID,
			rng,
			value,
			[simple, q(c0).mul(pow(r, n - 1)), q(c0).mul(pow(r, n + 1)), q(c0 + n * p)].filter((x) => x.isInteger()),
		),
		params: { case: story, c0, p, n },
	};
}

function check(s: Sample): string[] {
	const p = s.params;
	switch (s.level) {
		case 1: {
			const xs = (p.terms as string[]).map(R);
			const r = xs[1].div(xs[0]);
			if (!xs.slice(1).every((x, i) => x.div(xs[i]).equals(r)) || r.isOne()) return ['i termini non sono in progressione geometrica'];
			return numberCheck(s, r);
		}
		case 2:
			return numberCheck(s, term(R(p.a1), R(p.q), N(p.n)));
		case 3: {
			const [a1, r] = [R(p.a1), R(p.q)];
			const b: Behaviour = r.sign() < 0 ? 'alterni' : r.isOne() ? 'costante' : r.compare(q(1)) > 0 === a1.sign() > 0 ? 'crescente' : 'decrescente';
			return b === p.case && correctValues(s)?.[0] === b ? [] : [`la progressione è ${b}`];
		}
		case 4: {
			const gap = N(p.m) - N(p.k);
			const ratio = R(p.am).div(R(p.ak));
			const roots: Rational[] = [];
			for (const den of [1, 2]) for (let num = -6; num <= 6; num++) if (num !== 0 && (den === 1 || num % 2 !== 0) && pow(q(num, den), gap).equals(ratio)) roots.push(q(num, den));
			roots.sort((x, y) => x.compare(y));
			if (s.answer.kind !== 'set' || s.answer.values.join('|') !== roots.map(String).join('|')) return ['ragioni sbagliate'];
			return correctValues(s)?.join('|') === roots.map(String).join('|') ? [] : ["l'opzione giusta non è la risposta"];
		}
		case 5: {
			let n = 1;
			for (let v = N(p.a1); Math.abs(v) < Math.abs(N(p.value)) && n < 40; n++) v *= N(p.q);
			return N(p.a1) * N(p.q) ** (n - 1) === N(p.value) ? numberCheck(s, q(n)) : ['il numero non è un termine'];
		}
		case 6:
			return numberCheck(s, sum(R(p.a1), R(p.q), N(p.n)));
		case 7:
			return numberCheck(s, q(N(p.c0)).mul(pow(Rational.of(100 + N(p.p), 100), N(p.n))));
		default:
			return [`livello sconosciuto ${s.level}`];
	}
}

export const progressioniGeometriche = chapterGenerator({
	id: ID,
	title: 'Progressioni geometriche',
	levels: {
		1: { label: 'La ragione dai primi termini', constraints: ['quattro termini interi', 'sei su dieci con ragione intera, quattro con ragione frazionaria; anche ragioni negative'] },
		2: { label: 'Un termine da a_1 e q', constraints: ['a_n = a_1·q^(n-1) con q tra 2, 3, -2, -3, 1/2, -1/2', 'termini in valore assoluto fino a qualche migliaio'] },
		3: { label: 'Crescente, decrescente o a segni alterni', constraints: ['crescente 30%, decrescente 30%, a segni alterni 30%, costante 10%', 'il primo termine può essere negativo'] },
		4: { label: 'La ragione da due termini', constraints: ['metà con esponente dispari (una ragione), metà con esponente pari (due ragioni opposte)'] },
		5: { label: 'Il posto di un termine', constraints: ['ragione intera positiva; il termine è a_1 per una potenza esatta della ragione'] },
		6: { label: 'La somma dei primi n termini', constraints: ['q tra 2, 3, -2, -3, 1/2, -1/2', 'n tra 4 e 10'] },
		7: { label: 'Crescita a percentuale costante', constraints: ['tre storie: un capitale, un’auto che perde valore, gli abitanti di un paese', 'due o tre periodi, risultato intero'] },
	},
	builders: { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 },
	check,
});

export default progressioniGeometriche;
