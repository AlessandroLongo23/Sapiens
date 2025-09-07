import { Exercise, Question, Answer } from './abstract.svelte.js';
import { gcdArray, mcmArray } from '$lib/utils/auxiliary.js';

const candidateVariables = ['x', 'y', 'z'];

function generateRandomMonomial() {
	const numberOfVariables = Math.floor(Math.random() * 3) + 1; 
	const variables = new Set();
	while (variables.size < numberOfVariables) {
		variables.add(candidateVariables[Math.floor(Math.random() * candidateVariables.length)]);
	}
	const exponents = {};
	for (const v of Array.from(variables).sort()) {
		exponents[v] = Math.floor(Math.random() * 5) + 1; 
	}
	const coefficient = Math.floor(Math.random() * 12) + 1; 
	return { coefficient, exponents };
}

function formatMonomial({ coefficient, exponents }) {
	const vars = Object.keys(exponents).sort();
	let s = '';
	if (coefficient !== 1 || vars.length === 0) s += String(coefficient);
	for (const v of vars) {
		const e = exponents[v];
		s += e === 1 ? v : `${v}^{${e}}`;
	}
	if (s === '') s = '1';
	return s;
}

function unionVariables(monomials) {
	const u = new Set();
	for (const m of monomials) for (const v of Object.keys(m.exponents)) u.add(v);
	return Array.from(u).sort();
}

function mcdMonomial(monomials) {
	const coeff = gcdArray(monomials.map((m) => Math.abs(m.coefficient)));
	const exps = {};
	const vars = unionVariables(monomials);
	for (const v of vars) {
		let minExp = Infinity;
		for (const m of monomials) {
			const e = m.exponents[v] || 0;
			if (e < minExp) minExp = e;
		}
		if (minExp > 0) exps[v] = minExp;
	}
	return { coefficient: coeff === 0 ? 1 : coeff, exponents: exps };
}

function mcmMonomial(monomials) {
	const coeff = mcmArray(monomials.map((m) => Math.abs(m.coefficient)));
	const exps = {};
	const vars = unionVariables(monomials);
	for (const v of vars) {
		let maxExp = 0;
		for (const m of monomials) {
			const e = m.exponents[v] || 0;
			if (e > maxExp) maxExp = e;
		}
		if (maxExp > 0) exps[v] = maxExp;
	}
	return { coefficient: coeff === 0 ? 1 : coeff, exponents: exps };
}

export class McmMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		const count = Math.random() < 0.5 ? 2 : 3;
		this.monomials = Array.from({ length: count }, () => generateRandomMonomial());
		const monomialsStr = this.monomials.map((m) => formatMonomial(m)).join(', ');
		this.question = new Question(`mcm(${monomialsStr})`);
	}

	generateCorrectAnswer() {
		const result = mcmMonomial(this.monomials);
		const text = formatMonomial(result);
		const ans = new Answer(text, true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		const correct = formatMonomial(mcmMonomial(this.monomials));
		const distractors = new Set();

		
		const gcdMono = formatMonomial(mcdMonomial(this.monomials));
		if (gcdMono !== correct) distractors.add(gcdMono);

		
		const lcm = mcmMonomial(this.monomials);
		const vars = Object.keys(lcm.exponents);
		if (vars.length > 0) {
			const v = vars[Math.floor(Math.random() * vars.length)];
			const mutated = { coefficient: lcm.coefficient, exponents: { ...lcm.exponents } };
			mutated.exponents[v] = Math.max(1, mutated.exponents[v] - 1 + (Math.random() < 0.5 ? -1 : 1));
			distractors.add(formatMonomial(mutated));
		}

		
		const coeffVariants = [lcm.coefficient * 2, Math.max(1, Math.floor(lcm.coefficient / 2)), lcm.coefficient + 1];
		for (const c of coeffVariants) {
			if (c !== lcm.coefficient) {
				const mutated = { coefficient: c, exponents: { ...lcm.exponents } };
				distractors.add(formatMonomial(mutated));
			}
			if (distractors.size >= 3) break;
		}

		for (const d of Array.from(distractors).slice(0, 3)) {
			this.answers.push(new Answer(d, false));
		}
		this.answers.shuffle();
	}
}

export class McdMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		const count = Math.random() < 0.5 ? 2 : 3;
		this.monomials = Array.from({ length: count }, () => generateRandomMonomial());
		const monomialsStr = this.monomials.map((m) => formatMonomial(m)).join(', ');
		this.question = new Question(`mcd(${monomialsStr})`);
	}

	generateCorrectAnswer() {
		const result = mcdMonomial(this.monomials);
		const text = formatMonomial(result);
		const ans = new Answer(text, true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		const correct = formatMonomial(mcdMonomial(this.monomials));
		const distractors = new Set();

		
		const lcmMono = formatMonomial(mcmMonomial(this.monomials));
		if (lcmMono !== correct) distractors.add(lcmMono);

		
		const gcd = mcdMonomial(this.monomials);
		const vars = Object.keys(gcd.exponents);
		if (vars.length > 0) {
			const v = vars[Math.floor(Math.random() * vars.length)];
			const mutated = { coefficient: gcd.coefficient, exponents: { ...gcd.exponents } };
			mutated.exponents[v] = Math.max(0, mutated.exponents[v] - 1);
			if (mutated.exponents[v] === 0) delete mutated.exponents[v];
			distractors.add(formatMonomial(mutated));
		}

		
		const coeffVariants = [gcd.coefficient * 2, Math.max(1, Math.floor(gcd.coefficient / 2)), gcd.coefficient + 1];
		for (const c of coeffVariants) {
			if (c !== gcd.coefficient) {
				const mutated = { coefficient: c, exponents: { ...gcd.exponents } };
				distractors.add(formatMonomial(mutated));
			}
			if (distractors.size >= 3) break;
		}

		for (const d of Array.from(distractors).slice(0, 3)) {
			this.answers.push(new Answer(d, false));
		}
		this.answers.shuffle();
	}
}