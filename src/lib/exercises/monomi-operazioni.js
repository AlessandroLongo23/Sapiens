import { Exercise, Question, Answer } from './abstract';

const candidateVariables = ['x', 'y', 'z'];

function pickVariables() {
	const count = Math.floor(Math.random() * 3) + 1; 
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
		super(3);
	}

	generateQuestion() {
		this.vars = pickVariables();
		this.baseExps = randomExponents(this.vars, 1, 4);
		
		this.coeffA = Math.floor(Math.random() * 9) + 1; 
		this.coeffB = Math.floor(Math.random() * 9) + 1; 
		this.isPlus = Math.random() < 0.5;
		
		if (!this.isPlus && this.coeffA === this.coeffB) this.coeffB += 1;
		const op = this.isPlus ? ' + ' : ' - ';
		const expr = `${formatMonomial(this.coeffA, this.baseExps)}${op}${formatMonomial(this.coeffB, this.baseExps)}`;
		this.question = new Question(expr);
	}

	generateCorrectAnswer() {
		const resultCoeff = this.isPlus ? this.coeffA + this.coeffB : this.coeffA - this.coeffB;
		this.correctText = formatMonomial(resultCoeff, this.baseExps);
		const ans = new Answer(this.correctText, true);
		this.answers.push(ans);
		this.correctAnswer = ans;
	}

	generateAnswers() {
		this.answers = [];
		this.generateCorrectAnswer();

		const wrongTexts = new Set();
		wrongTexts.add(this.correctText);
		
		const candidates = [];
		const sum = this.coeffA + this.coeffB;
		const diff = this.coeffA - this.coeffB;
		candidates.push(formatMonomial(- (this.isPlus ? sum : diff), this.baseExps));
		candidates.push(formatMonomial((this.isPlus ? sum : diff) + 1, this.baseExps));
		candidates.push(formatMonomial((this.isPlus ? sum : diff) - 1, this.baseExps));
		candidates.push(formatMonomial(this.isPlus ? diff : sum, this.baseExps));

		for (const t of candidates) {
			if (!wrongTexts.has(t)) wrongTexts.add(t);
			if (wrongTexts.size >= 4) break;
		}

		for (const t of Array.from(wrongTexts)) {
			if (t !== this.correctText && this.answers.length < 3) this.answers.push(new Answer(t, false));
		}
		
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
		this.isMul = Math.random() < 0.5; 
		
		const Acoeff = Math.floor(Math.random() * 8) + 2; 
		const Aexps = randomExponents(this.vars, 1, 4);
		let Bcoeff;
		let Bexps;
		if (this.isMul) {
			Bcoeff = Math.floor(Math.random() * 8) + 2; 
			Bexps = randomExponents(this.vars, 0, 3);
			this.finalCoeff = Acoeff * Bcoeff;
			this.finalExps = addExponents(Aexps, Bexps);
			this.question = new Question(`${formatMonomial(Acoeff, Aexps)} \\times ${formatMonomial(Bcoeff, Bexps)}`);
		} else {
			
			
			let divisors = [];
			for (let d = 2; d <= Acoeff; d++) if (Acoeff % d === 0) divisors.push(d);
			if (divisors.length === 0) divisors = [1];
			Bcoeff = divisors[Math.floor(Math.random() * divisors.length)];
			
			Bexps = {};
			for (const v of this.vars) Bexps[v] = Math.floor(Math.random() * (Aexps[v] + 1));
			this.finalCoeff = Math.floor(Acoeff / Bcoeff);
			this.finalExps = subExponents(Aexps, Bexps);
			this.question = new Question(`${formatMonomial(Acoeff, Aexps)} : ${formatMonomial(Bcoeff, Bexps)}`);
		}
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

		const correctText = this.correctAnswer.textContent.replace(/^\$\$|\$\$/g, '');
		const wrongTexts = new Set([correctText]);

		
		const vars = Object.keys(this.finalExps);
		if (vars.length > 0) {
			const v = vars[Math.floor(Math.random() * vars.length)];
			const mutated = { ...this.finalExps };
			mutated[v] = Math.max(0, (mutated[v] || 0) + (Math.random() < 0.5 ? -1 : 1));
			if (mutated[v] === 0) delete mutated[v];
			wrongTexts.add(formatMonomial(this.finalCoeff, mutated));
		}

		
		wrongTexts.add(formatMonomial(Math.max(1, this.finalCoeff - 1), this.finalExps));
		wrongTexts.add(formatMonomial(this.finalCoeff + 1, this.finalExps));

		
		for (const v of this.vars) {
			if (!this.finalExps[v]) {
				const mutated = { ...this.finalExps, [v]: 1 };
				wrongTexts.add(formatMonomial(this.finalCoeff, mutated));
				break;
			}
		}

		for (const t of Array.from(wrongTexts)) {
			if (t !== correctText && this.answers.length < 3) this.answers.push(new Answer(t, false));
		}
		
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
		this.baseCoeff = Math.floor(Math.random() * 8) + 2; 
		this.baseExps = randomExponents(this.vars, 1, 4);
		this.power = Math.floor(Math.random() * 3) + 2; 
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

		
		const exps = {};
		for (const v of this.vars) exps[v] = this.baseExps[v] * this.power;
		this.answers.push(new Answer(formatMonomial(this.baseCoeff, exps), false));

		
		this.answers.push(new Answer(formatMonomial(this.baseCoeff ** this.power, this.baseExps), false));

		
		const altPower = Math.max(1, this.power + (Math.random() < 0.5 ? -1 : 1));
		const expsAlt = {};
		for (const v of this.vars) expsAlt[v] = this.baseExps[v] * altPower;
		this.answers.push(new Answer(formatMonomial(this.baseCoeff ** altPower, expsAlt), false));

		this.answers.shuffle();
	}
}


