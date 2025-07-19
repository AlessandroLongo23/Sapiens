import { Exercise, Question, Answer } from '$lib/exercises/abstract.svelte.js';

export class AddizioneEx extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.numbers = Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1);
		this.question = new Question(`${this.numbers.join(' + ')}`);
	}

	generateAnswers() {
		let answers = new Set();

		answers.add(this.generateCorrectAnswer());
		answers.add(new Answer(this.numbers.reduce((acc, val) => acc + val, 0) + 1, false));
		answers.add(new Answer(this.numbers.reduce((acc, val) => acc + val, 0) - 1, false));

		this.answers = Array.from(answers);

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		return new Answer(this.numbers.reduce((acc, val) => acc + val, 0), true);
	}
}

export class SottrazioneEx extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.numbers = Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1);
		this.question = new Question(`${this.numbers.join(' - ')}`);
	}

	generateAnswers() {
		let answers = new Set();

		answers.add(this.generateCorrectAnswer());
		answers.add(new Answer(this.correctAnswer + 1, false));
		answers.add(new Answer(this.correctAnswer - 1, false));

		this.answers = Array.from(answers);

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		let result = this.numbers[0];
		for (let i = 1; i < this.numbers.length; i++) {
			result -= this.numbers[i];
		}
		this.correctAnswer = result;
		return new Answer(result, true);
	}
}

export class MoltiplicazioneEx extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.numbers = Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1);
		this.question = new Question(`${this.numbers.join(' \\times ')}`);
	}

	generateAnswers() {
		let answers = new Set();

		answers.add(this.generateCorrectAnswer());
		answers.add(new Answer(this.numbers.reduce((acc, val) => acc * val, 1) + 1, false));
		answers.add(new Answer(this.numbers.reduce((acc, val) => acc * val, 1) - 1, false));

		this.answers = Array.from(answers);

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		return new Answer(this.numbers.reduce((acc, val) => acc * val, 1), true);
	}
}

export class DivisioneEx extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		this.numbers = Array.from({ length: n }, () => Math.floor(Math.random() * 10) + 1);
		this.question = new Question(`${this.numbers.join(' : ')}`);
	}

	generateAnswers() {
		let answers = new Set();

		answers.add(this.generateCorrectAnswer());
		answers.add(new Answer(this.correctAnswer + 1, false));
		answers.add(new Answer(this.correctAnswer - 1, false));

		this.answers = Array.from(answers);

		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		let result = this.numbers[0];
		for (let i = 1; i < this.numbers.length; i++) {
			result /= this.numbers[i];
		}
		this.correctAnswer = result;
		return new Answer(result, true);
	}
}