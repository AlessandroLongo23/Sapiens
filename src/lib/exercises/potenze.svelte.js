import { Exercise, Answer, Question } from './abstract.svelte.js';

export class PotenzaExSameBase extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.n = n;
		this.base = Math.floor(Math.random() * 9) + 2;
		this.exponents = Array.from({ length: n }, () => Math.floor(Math.random() * 5) + 2);

		this.operations = [];
		this.formula = '';
		for (let i = 0; i < this.n; i++) {
			this.formula += `${this.base}^{${this.exponents[i]}}`;
			if (i < this.n - 1) {
				this.operations.push(Math.random() < 0.5 ? ' \\times ' : ' : ');
				this.formula += this.operations[i];
			}
		}

		this.question = new Question(this.formula);
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();

		this.answers.push(new Answer(this.base + '^{' + (this.finalExponent + 1) + '}', false));
		this.answers.push(new Answer(this.base + '^{' + (this.finalExponent - 1) + '}', false));

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		this.finalExponent = this.exponents[0];
		for (let i = 0; i < this.operations.length; i++) {
			if (this.operations[i] === ' \\times ') {
				this.finalExponent += this.exponents[i + 1];
			} else {
				this.finalExponent -= this.exponents[i + 1];
			}
		}
		this.answers.push(new Answer(this.base + '^{' + this.finalExponent + '}', true));
	}
}

export class PotenzaExSameExponent extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.n = n;
		this.exponent = Math.floor(Math.random() * 9) + 2;
		this.bases = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 2);

		this.operations = [];
		this.formula = '';
		for (let i = 0; i < this.n; i++) {
			this.formula += `${this.bases[i]}^{${this.exponent}}`;
			if (i < this.n - 1) {
				this.operations.push(Math.random() < 0.5 ? ' \\times ' : ' : ');
				this.formula += this.operations[i];
			}
		}

		this.question = new Question(this.formula);
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();
		
		this.answers.push(new Answer((this.finalBase + 1) + '^{' + this.exponent + '}', false));
		this.answers.push(new Answer((this.finalBase - 1) + '^{' + this.exponent + '}', false));

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		this.finalBase = this.bases[0];
		for (let i = 0; i < this.operations.length; i++) {
			if (this.operations[i] === ' \\times ') {
				this.finalBase *= this.bases[i + 1];
			} else {
				this.finalBase /= this.bases[i + 1];
			}
		}
		this.answers.push(new Answer(this.finalBase + '^{' + this.exponent + '}', true));
	}
}

export class PotenzaExGeneral extends Exercise {
	constructor(n) {
		super();

		this.n = n;

		this.formula = '';
		for (let i = 0; i < this.n; i++) {
			const base = Math.floor(Math.random() * 9) + 2;
			const exponent = Math.floor(Math.random() * 9) + 2;
			this.formula += `${base}^${exponent}`;
			if (i < this.n - 1) {
				const operators = [' \\times ', ' : '];
				this.formula += operators[Math.floor(Math.random() * operators.length)];
			}
		}
		this.question = new Question(this.formula);

		this.generateAnswers();
	}

	generateAnswers() {
		this.answers.push(new Answer(this.formula, true));
		this.answers.push(new Answer(this.formula, false));
	}
}