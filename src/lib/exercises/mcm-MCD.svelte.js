import { Exercise, Question, Answer } from './abstract.svelte.js';
import { gcd, gcdArray, mcmArray } from '$lib/utils/auxiliary.js';

export class McmEx extends Exercise {
	constructor(numCount = 3, maxNum = 25) {
		super();

		this.generateQuestion(numCount, maxNum);
		this.generateAnswers();
	}

	generateQuestion(numCount, maxNum) {
		this.numbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * maxNum) + 2);
		this.question = new Question(`mcm(${this.numbers.join(', ')})`);
	}

	generateCorrectAnswer() {
		this.answers.push(new Answer(mcmArray(this.numbers), true));
		this.correctAnswer = this.answers[0];
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();

		const answersSet = new Set();

		if (this.numbers.length > 1) {
			const greatestCommonDivisor = this.numbers.reduce((acc, val) => gcd(acc, val));
			if (greatestCommonDivisor !== this.correctAnswer) {
				answersSet.add(new Answer(greatestCommonDivisor, false));
			}
		}

		const product = this.numbers.reduce((a, b) => a * b, 1);
		if (product !== this.correctAnswer) {
			answersSet.add(new Answer(product, false));
		}

		if (this.numbers.length > 2) {
			const subsetmcm = mcmArray(this.numbers.slice(0, 2));
			if (subsetmcm !== this.correctAnswer) {
				answersSet.add(new Answer(subsetmcm, false));
			}
		}

		while (answersSet.size < 3) {
			const randomFactor = Math.floor(Math.random() * 5) + 1;
			const randomDistractor = this.correctAnswer * randomFactor;
			if (randomDistractor !== this.correctAnswer) {
				answersSet.add(new Answer(randomDistractor, false));
			}
		}

		while (answersSet.size > 3) {
			const toDelete = Array.from(answersSet).find(d => d !== this.correctAnswer);
			answersSet.delete(toDelete)
		}

		this.answers.push(...Array.from(answersSet));

		this.answers.shuffle();
	}
}

export class MCDEx extends Exercise {
	constructor(numCount = 3, maxNum = 25) {
		super();

		this.generateQuestion(numCount, maxNum);
		this.generateAnswers();
	}

	generateQuestion(numCount, maxNum) {
		this.numbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * maxNum) + 2);
		this.question = new Question(`mcd(${this.numbers.join(', ')})`);
	}

	generateCorrectAnswer() {
		this.answers.push(new Answer(gcdArray(this.numbers), true));
		this.correctAnswer = this.answers[0];
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();

		const answersSet = new Set();
		answersSet.add(this.correctAnswer);

		const mcm = mcmArray(this.numbers);
		if (mcm !== this.correctAnswer) {
			answersSet.add(new Answer(mcm, false));
		}

		if (this.numbers.length > 2) {
			const subsetGcd = gcdArray(this.numbers.slice(0, 2));
			if (subsetGcd !== this.correctAnswer) {
				answersSet.add(new Answer(subsetGcd, false));
			}
		}

		while (answersSet.size < 3) {
			const randomFactor = Math.floor(Math.random() * 5) + 1;
			const randomDistractor = this.correctAnswer * randomFactor;
			if (randomDistractor !== this.correctAnswer) {
				answersSet.add(new Answer(randomDistractor, false));
			}
		}

		while (answersSet.size > 3) {
			const toDelete = Array.from(answersSet).find(d => d !== this.correctAnswer);
			answersSet.delete(toDelete)
		}

		this.answers.push(...Array.from(answersSet));

		this.answers.shuffle();
	}
}