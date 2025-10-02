import { Exercise, Answer, Question } from './abstract.svelte.js';
import { Expression } from '$lib/math/Expression';

export class PotenzaExSameBase extends Exercise {
	base: number;
	exponents: number[];
	operations: string[];
	formula: string;
	expression: Expression;
	finalExponent: number;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;
		this.base = Math.floor(Math.random() * 9) + 2;
		this.exponents = Array.from({ length: n }, () => Math.floor(Math.random() * 5) + 2);

		this.operations = [];
		this.formula = '';
		for (let i = 0; i < n; i++) {
			this.formula += `${this.base}^{${this.exponents[i]}}`;
			if (i < n - 1) {
				this.operations.push(Math.random() < 0.5 ? ' \\times ' : ' : ');
				this.formula += this.operations[i];
			}
		}

		this.expression = new Expression(this.formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		this.finalExponent = this.exponents[0];
		for (let i = 0; i < this.operations.length; i++) {
			if (this.operations[i] === ' \\times ') {
				this.finalExponent += this.exponents[i + 1];
			} else {
				this.finalExponent -= this.exponents[i + 1];
			}
		}
		this.answers.add(new Answer(this.expression.simplify({ evaluateNumerics: false }).toLatex(), true));
	}

	generateWrongAnswers(): void {
		this.answers.add(new Answer(this.base + '^{' + (this.finalExponent + 1) + '}', false));
		this.answers.add(new Answer(this.base + '^{' + (this.finalExponent - 1) + '}', false));
	}
}

export class PotenzaExSameExponent extends Exercise {
	base: number;
	exponent: number;
	bases: number[];
	operations: string[];
	formula: string;
	expression: Expression;
	finalBase: number;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;
		this.exponent = Math.floor(Math.random() * 9) + 2;
		this.bases = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 2);

		this.operations = [];
		this.formula = '';
		for (let i = 0; i < n; i++) {
			this.formula += `${this.bases[i]}^{${this.exponent}}`;
			if (i < n - 1) {
				this.operations.push(Math.random() < 0.5 ? ' \\times ' : ' : ');
				this.formula += this.operations[i];
			}
		}

		this.expression = new Expression(this.formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		this.finalBase = this.bases[0];
		for (let i = 0; i < this.operations.length; i++) {
			if (this.operations[i] === ' \\times ') {
				this.finalBase *= this.bases[i + 1];
			} else {
				this.finalBase /= this.bases[i + 1];
			}
		}
		this.answers.add(new Answer(this.finalBase + '^{' + this.exponent + '}', true));
	}

	generateWrongAnswers(): void {
		this.answers.add(new Answer((this.finalBase + 1) + '^{' + this.exponent + '}', false));
		this.answers.add(new Answer((this.finalBase - 1) + '^{' + this.exponent + '}', false));
	}
}

export class PotenzaExGeneral extends Exercise {
	formula: string;
	expression: Expression;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;

		this.formula = '';
		for (let i = 0; i < n; i++) {
			const base: number = Math.floor(Math.random() * 9) + 2;
			const exponent: number = Math.floor(Math.random() * 9) + 2;
			this.formula += `${base}^${exponent}`;
			if (i < n - 1) {
				const operators: string[] = [' \\times ', ' : '];
				this.formula += operators[Math.floor(Math.random() * operators.length)];
			}
		}
		this.expression = new Expression(this.formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		// this.answers.add(new Answer(this.formula, true));
	}

	generateWrongAnswers(): void {
		// this.answers.add(new Answer(this.formula, false));
	}
}