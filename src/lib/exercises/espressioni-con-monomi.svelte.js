import { Exercise, Question, Answer } from './abstract.svelte.js';

const candidateVariables = ['x', 'y', 'z'];

function formatMonomial(coefficient, exponents) {
	const vars = Object.keys(exponents).sort();
	let s = '';
	if (coefficient !== 1 || vars.length === 0) s += String(coefficient);
	for (const v of vars) {
		const e = exponents[v];
		s += e === 1 ? v : `${v}^{${e}}`;
	}
	return s || '1';
}

function randomMonomial(vars) {
	const coefficient = Math.floor(Math.random() * 9) + 1; // 1..9
	const exps = {};
	for (const v of vars) exps[v] = Math.floor(Math.random() * 4) + 1; // 1..4
	return { coefficient, exponents: exps };
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

export class EspressioneMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		// choose variable set
		const count = Math.floor(Math.random() * 3) + 1; // 1..3
		const varsSet = new Set();
		while (varsSet.size < count) varsSet.add(candidateVariables[Math.floor(Math.random() * candidateVariables.length)]);
		this.vars = Array.from(varsSet).sort();

		// Build expression: ((m1 * m2) : m3) * (m4) ± (m5)
		const m1 = randomMonomial(this.vars);
		const m2 = randomMonomial(this.vars);
		const m3 = randomMonomial(this.vars);
		const m4 = randomMonomial(this.vars);
		const m5 = randomMonomial(this.vars);

		const group1 = `(${formatMonomial(m1.coefficient, m1.exponents)} \\times ${formatMonomial(m2.coefficient, m2.exponents)} : ${formatMonomial(m3.coefficient, m3.exponents)})`;
		const group2 = `${formatMonomial(m4.coefficient, m4.exponents)}`;
		const plus = Math.random() < 0.5;
		const group3 = `${formatMonomial(m5.coefficient, m5.exponents)}`;
		this.question = new Question(`${group1} \\times ${group2} ${plus ? '+' : '-'} ${group3}`);

		// compute value
		let coeff = Math.floor((m1.coefficient * m2.coefficient) / m3.coefficient) * m4.coefficient;
		let exps = addExponents(m1.exponents, m2.exponents);
		exps = subExponents(exps, m3.exponents);
		exps = addExponents(exps, m4.exponents);
		this.resultCoeff = plus ? coeff + m5.coefficient : Math.max(1, coeff - m5.coefficient);
		this.resultExps = { ...exps };
	}

	generateCorrectAnswer() {
		const ans = new Answer(formatMonomial(this.resultCoeff, this.resultExps), true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		// wrong 1: forget division
		const wrong1Coeff = this.resultCoeff * 2;
		this.answers.push(new Answer(formatMonomial(wrong1Coeff, this.resultExps), false));

		// wrong 2: sign flipped on last term
		const wrong2Coeff = Math.max(1, this.resultCoeff - 2);
		this.answers.push(new Answer(formatMonomial(wrong2Coeff, this.resultExps), false));

		// wrong 3: one exponent off by ±1
		const mutated = { ...this.resultExps };
		const keys = Object.keys(mutated);
		if (keys.length > 0) {
			const v = keys[Math.floor(Math.random() * keys.length)];
			mutated[v] = Math.max(0, mutated[v] + (Math.random() < 0.5 ? -1 : 1));
			if (mutated[v] === 0) delete mutated[v];
		}
		this.answers.push(new Answer(formatMonomial(this.resultCoeff, mutated), false));

		this.answers.shuffle();
	}
}


