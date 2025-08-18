import { Exercise, Question, Answer } from './abstract.svelte.js';

const candidateVariables = ['x', 'y', 'z'];

function pickVariables() {
	const count = Math.floor(Math.random() * 3) + 1; // 1..3
	const vars = new Set();
	while (vars.size < count) vars.add(candidateVariables[Math.floor(Math.random() * candidateVariables.length)]);
	return Array.from(vars).sort();
}

function randomExponents(vars, min = 1, max = 5) {
	const exps = {};
	for (const v of vars) exps[v] = Math.floor(Math.random() * (max - min + 1)) + min;
	return exps;
}

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

export class SommaESottrazioneMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		this.vars = pickVariables();
		this.baseExps = randomExponents(this.vars, 1, 4);
		this.termCount = 3;
		this.terms = [];
		let expr = '';
		for (let i = 0; i < this.termCount; i++) {
			const sign = i === 0 ? 1 : (Math.random() < 0.5 ? 1 : -1);
			const coeff = Math.floor(Math.random() * 9) + 1; // 1..9
			this.terms.push(sign * coeff);
			if (i > 0) expr += sign === 1 ? ' + ' : ' - ';
			expr += formatMonomial(coeff, this.baseExps);
		}
		this.question = new Question(expr);
	}

	generateCorrectAnswer() {
		const coeff = this.terms.reduce((a, b) => a + b, 0);
		this.correctCoeff = coeff === 0 ? 1 : coeff; // avoid 0 result; adjust for robustness
		this.answers.push(new Answer(formatMonomial(this.correctCoeff, this.baseExps), true));
		this.correctAnswer = this.answers[0];
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		const wrongs = new Set();
		wrongs.add(this.correctAnswer.textContent);
		const candidates = [this.correctCoeff + 1, this.correctCoeff - 1, -this.correctCoeff, this.correctCoeff + 2];
		for (const c of candidates) {
			if (c !== 0) {
				const txt = '$$' + formatMonomial(c, this.baseExps) + '$$';
				wrongs.add(txt);
			}
			if (wrongs.size >= 4) break;
		}
		for (const txt of Array.from(wrongs)) {
			if (txt !== this.correctAnswer.textContent) this.answers.push(new Answer(txt.replace(/^\$\$|\$\$/g, ''), false));
			if (this.answers.length >= 3) break;
		}
		this.answers.push(this.correctAnswer);
		this.answers.shuffle();
	}
}

export class MoltiplicazioneEDivisioneMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		this.vars = pickVariables();
		// Start monomial
		let coeff = Math.floor(Math.random() * 8) + 2; // 2..9
		let exps = randomExponents(this.vars, 1, 4);
		const parts = [formatMonomial(coeff, exps)];

		const steps = Math.random() < 0.5 ? 2 : 3;
		for (let i = 0; i < steps - 1; i++) {
			const isMul = Math.random() < 0.6; // more multiplications
			if (isMul) {
				const f = Math.floor(Math.random() * 4) + 2; // 2..5
				const add = randomExponents(this.vars, 0, 3);
				coeff *= f;
				exps = addExponents(exps, add);
				parts.push(' \\times ' + formatMonomial(f, add));
			} else {
				// division: pick divisor of current coefficient and exponents <= current
				let divisors = [];
				for (let d = 2; d <= Math.min(9, coeff); d++) if (coeff % d === 0) divisors.push(d);
				if (divisors.length === 0) divisors = [1];
				const d = divisors[Math.floor(Math.random() * divisors.length)];
				const sub = {};
				for (const v of this.vars) sub[v] = Math.floor(Math.random() * (exps[v] + 1));
				coeff = Math.floor(coeff / d);
				exps = subExponents(exps, sub);
				parts.push(' : ' + formatMonomial(d, sub));
			}
		}

		this.finalCoeff = coeff;
		this.finalExps = exps;
		this.question = new Question(parts.join(''));
	}

	generateCorrectAnswer() {
		const txt = formatMonomial(this.finalCoeff, this.finalExps);
		const ans = new Answer(txt, true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		const wrongs = new Set();
		wrongs.add(this.correctAnswer.textContent);

		// Wrong 1: tweak one exponent by ±1
		const vars = Object.keys(this.finalExps);
		if (vars.length > 0) {
			const v = vars[Math.floor(Math.random() * vars.length)];
			const mutated = { ...this.finalExps };
			mutated[v] = Math.max(0, (mutated[v] || 0) + (Math.random() < 0.5 ? -1 : 1));
			wrongs.add('$$' + formatMonomial(this.finalCoeff, mutated) + '$$');
		}

		// Wrong 2: coefficient off by one factor
		wrongs.add('$$' + formatMonomial(this.finalCoeff + 1, this.finalExps) + '$$');

		// Wrong 3: treat last division as multiplication (if any division used)
		const text = this.question.textContent.replace(/^\$\$|\$\$/g, '');
		if (text.includes(' : ')) {
			const wrongText = text.replace(/ : /, ' \\times ');
			// we can't compute value easily here; provide structural distractor as text answer is numeric/monomial only, so skip
		}

		for (const txt of Array.from(wrongs)) {
			if (txt !== this.correctAnswer.textContent) this.answers.push(new Answer(txt.replace(/^\$\$|\$\$/g, ''), false));
			if (this.answers.length >= 3) break;
		}
		this.answers.push(this.correctAnswer);
		this.answers.shuffle();
	}
}

export class PotenzeMonomiEx extends Exercise {
	constructor() {
		super();
		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		this.vars = pickVariables();
		this.baseCoeff = Math.floor(Math.random() * 8) + 2; // 2..9
		this.baseExps = randomExponents(this.vars, 1, 4);
		this.power = Math.floor(Math.random() * 3) + 2; // 2..4
		this.question = new Question(`\\left(${formatMonomial(this.baseCoeff, this.baseExps)}\\right)^{${this.power}}`);
	}

	generateCorrectAnswer() {
		const coeff = this.baseCoeff ** this.power;
		const exps = {};
		for (const v of this.vars) exps[v] = this.baseExps[v] * this.power;
		const ans = new Answer(formatMonomial(coeff, exps), true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		// Wrong: forget to power the coefficient
		const exps = {};
		for (const v of this.vars) exps[v] = this.baseExps[v] * this.power;
		this.answers.push(new Answer(formatMonomial(this.baseCoeff, exps), false));

		// Wrong: power coefficient only
		this.answers.push(new Answer(formatMonomial(this.baseCoeff ** this.power, this.baseExps), false));

		// Wrong: use power ±1
		const altPower = Math.max(1, this.power + (Math.random() < 0.5 ? -1 : 1));
		const expsAlt = {};
		for (const v of this.vars) expsAlt[v] = this.baseExps[v] * altPower;
		this.answers.push(new Answer(formatMonomial(this.baseCoeff ** altPower, expsAlt), false));

		this.answers.shuffle();
	}
}


