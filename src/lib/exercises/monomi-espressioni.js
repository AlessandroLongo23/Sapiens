import { Exercise, Question, Answer } from './abstract';
import { gcd } from '@/lib/math/core/utils';
import { Operator } from '@/lib/math/core/Operator';

const candidateVariables = ['x', 'y', 'z'];

function simplifyFraction(frac) {
	let num = frac.num;
	let den = frac.den;
	if (den < 0) {
		num = -num; den = -den;
	}
	const g = gcd(Math.abs(num), Math.abs(den));
	return { num: num / g, den: den / g };
}

function makeInt(n) { return { num: n, den: 1 }; }
function multiplyFrac(a, b) { return simplifyFraction({ num: a.num * b.num, den: a.den * b.den }); }
function divideFrac(a, b) { return simplifyFraction({ num: a.num * b.den, den: a.den * b.num }); }
function addFrac(a, b) { return simplifyFraction({ num: a.num * b.den + b.num * a.den, den: a.den * b.den }); }
function subFrac(a, b) { return simplifyFraction({ num: a.num * b.den - b.num * a.den, den: a.den * b.den }); }

function formatFraction(frac) {
	if (frac.den === 1) return String(frac.num);
	return `\\dfrac{${frac.num}}{${frac.den}}`;
}

function formatMonomial(coefficient, exponents) {
	const vars = Object.keys(exponents).filter(k => exponents[k] !== 0).sort();
	const coeffStr = formatFraction(coefficient);
	let s = '';
	if (coefficient.den === 1 && Math.abs(coefficient.num) === 1 && vars.length > 0) {
		s += coefficient.num === -1 ? '-' : '';
	} else {
		s += coeffStr;
	}
	for (const v of vars) {
		const e = exponents[v];
		s += e === 1 ? v : `${v}^{${e}}`;
	}
	return s || '1';
}

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomExponents(vars, min = 1, max = 4) {
	const exps = {};
	for (const v of vars) exps[v] = randomInt(min, max);
	return exps;
}

function addExponents(a, b) {
	const out = { ...a };
	for (const v of Object.keys(b)) out[v] = (out[v] || 0) + b[v];
	for (const v of Object.keys(out)) if (out[v] === 0) delete out[v];
	return out;
}

function subExponents(a, b) {
	const out = { ...a };
	for (const v of Object.keys(b)) out[v] = (out[v] || 0) - b[v];
	for (const v of Object.keys(out)) if (out[v] === 0) delete out[v];
	return out;
}

function monomialWithIntegerCoeff(vars, coeffMin = 1, coeffMax = 9, expMin = 1, expMax = 4) {
	return { coefficient: makeInt(randomInt(coeffMin, coeffMax)), exponents: randomExponents(vars, expMin, expMax) };
}

function monomialWithFractionCoeff(vars, numMin = 1, numMax = 9, denMin = 2, denMax = 5, expMin = -2, expMax = 2) {
	const num = randomInt(numMin, numMax) * (Math.random() < 0.3 ? -1 : 1);
	const den = randomInt(denMin, denMax);
	return { coefficient: simplifyFraction({ num, den }), exponents: randomExponents(vars, expMin, expMax) };
}

export class EspressioneMonomiEx extends Exercise {
	constructor() { super(3); }

	generateQuestion() {
		const count = Math.floor(Math.random() * 3) + 1; 
		const varsSet = new Set();
		while (varsSet.size < count) varsSet.add(candidateVariables[Math.floor(Math.random() * candidateVariables.length)]);
		this.vars = Array.from(varsSet).sort();

		const m1 = monomialWithIntegerCoeff(this.vars, 1, 9, 1, 4);
		const m2 = monomialWithIntegerCoeff(this.vars, 1, 9, 1, 4);
		
		const exps12 = addExponents(m1.exponents, m2.exponents);
		const prodCoeff = m1.coefficient.num * m2.coefficient.num;
		let divisors = [];
		for (let d = 1; d <= prodCoeff; d++) if (prodCoeff % d === 0) divisors.push(d);
		const d = divisors[Math.floor(Math.random() * divisors.length)];
		const m3exps = {};
		for (const v of this.vars) m3exps[v] = Math.floor(Math.random() * (exps12[v] + 1));
		const m3 = { coefficient: makeInt(d), exponents: m3exps };

		const m4 = monomialWithFractionCoeff(this.vars, 1, 9, 2, 5, -2, 2);
		
		let exps = addExponents(m1.exponents, m2.exponents);
		exps = subExponents(exps, m3.exponents);
		exps = addExponents(exps, m4.exponents);

		const c12 = multiplyFrac(m1.coefficient, m2.coefficient);
		const c123 = divideFrac(c12, m3.coefficient); 
		const c1234 = multiplyFrac(c123, m4.coefficient); 

		const m5 = { coefficient: monomialWithFractionCoeff(this.vars, 1, 9, 2, 5, 0, 0).coefficient, exponents: { ...exps } };
		const plus = Math.random() < 0.5;

		const group1 = `(${formatMonomial(m1.coefficient, m1.exponents)} ${Operator.MULTIPLICATION} ${formatMonomial(m2.coefficient, m2.exponents)} : ${formatMonomial(m3.coefficient, m3.exponents)})`;
		const group2 = `${formatMonomial(m4.coefficient, m4.exponents)}`;
		const group3 = `${formatMonomial(m5.coefficient, m5.exponents)}`;
		this.question = new Question(`${group1} ${Operator.MULTIPLICATION} ${group2} ${plus ? Operator.ADDITION : Operator.SUBTRACTION} ${group3}`);

		this.resultCoeff = plus ? addFrac(c1234, m5.coefficient) : subFrac(c1234, m5.coefficient);
		this.resultExps = { ...exps };
	}

	generateCorrectAnswer() {
		const ans = new Answer(formatMonomial(this.resultCoeff, this.resultExps), true);
		this.answers.add(ans);
	}

	generateWrongAnswers() {
		const tweak = simplifyFraction({ num: 1, den: Math.floor(Math.random() * 4) + 2 });
		this.answers.add(formatMonomial(addFrac(this.resultCoeff, tweak), this.resultExps));
		this.answers.add(formatMonomial(subFrac(this.resultCoeff, tweak), this.resultExps));
		
		const mutated = { ...this.resultExps };
		const keys = Object.keys(mutated);
		if (keys.length > 0) {
			const v = keys[Math.floor(Math.random() * keys.length)];
			mutated[v] = (mutated[v] || 0) + (Math.random() < 0.5 ? -1 : 1);
			if (mutated[v] === 0) delete mutated[v];
			this.answers.add(formatMonomial(this.resultCoeff, mutated));
		}
		
		this.answers.add(formatMonomial(simplifyFraction({ num: -this.resultCoeff.num, den: this.resultCoeff.den }), this.resultExps));

		for (const t of Array.from(this.answers)) {
			if (t !== correctText && this.answers.length < 3) this.answers.add(new Answer(t, false));
		}
	}
}


