import { Exercise } from './abstract.svelte.js';
import { gcd, gcdArray, lcmArray } from '$lib/utils/auxiliary.js';

export class McmEx {
	constructor(numCount = 3, maxNum = 25) {
		this.numbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * maxNum) + 2);
		this.question = `mcm(${this.numbers.join(', ')})`;
		this.correctAnswer = lcmArray(this.numbers);
		this.generateAnswers();
	}

	generateAnswers() {
		const distractors = new Set();
		distractors.add(this.correctAnswer);

		// Distractor: GCD
		if (this.numbers.length > 1) {
			const greatestCommonDivisor = this.numbers.reduce((acc, val) => gcd(acc, val));
			if (greatestCommonDivisor !== this.correctAnswer) {
				distractors.add(greatestCommonDivisor);
			}
		}

		// Distractor: Product of numbers
		const product = this.numbers.reduce((a, b) => a * b, 1);
		if (product !== this.correctAnswer) {
			distractors.add(product);
		}

		// Distractor: LCM of a subset
		if (this.numbers.length > 2) {
			const subsetLcm = lcmArray(this.numbers.slice(0, 2));
			if (subsetLcm !== this.correctAnswer) {
				distractors.add(subsetLcm);
			}
		}

		// Fill with other random distractors if needed
		while (distractors.size < 3) {
			const randomFactor = Math.floor(Math.random() * 5) + 1;
			const randomDistractor = this.correctAnswer * randomFactor;
			if (randomDistractor !== this.correctAnswer) {
				distractors.add(randomDistractor);
			}
		}

		// Ensure we have exactly 3 choices, even if some distractors were same as correct answer
		while (distractors.size > 3) {
			const toDelete = Array.from(distractors).find(d => d !== this.correctAnswer);
			distractors.delete(toDelete)
		}

		this.answers = Array.from(distractors);
		this.answers.shuffle();
	}
}

export class MCDEx {
	constructor(numCount = 3, maxNum = 25) {
		this.numbers = Array.from({ length: numCount }, () => Math.floor(Math.random() * maxNum) + 2);
		this.question = `mcd(${this.numbers.join(', ')})`;
		this.correctAnswer = gcdArray(this.numbers);
		this.generateAnswers();
	}

	generateAnswers() {
		const distractors = new Set();
		distractors.add(this.correctAnswer);

		// Distractor: LCM of numbers
		const lcm = lcmArray(this.numbers);
		if (lcm !== this.correctAnswer) {
			distractors.add(lcm);
		}

		// Distractor: GCD of a subset
		if (this.numbers.length > 2) {
			const subsetGcd = gcdArray(this.numbers.slice(0, 2));
			if (subsetGcd !== this.correctAnswer) {
				distractors.add(subsetGcd);
			}
		}

		// Fill with other random distractors if needed
		while (distractors.size < 3) {
			const randomFactor = Math.floor(Math.random() * 5) + 1;
			const randomDistractor = this.correctAnswer * randomFactor;
			if (randomDistractor !== this.correctAnswer) {
				distractors.add(randomDistractor);
			}
		}

		// Ensure we have exactly 3 choices, even if some distractors were same as correct answer
		while (distractors.size > 3) {
			const toDelete = Array.from(distractors).find(d => d !== this.correctAnswer);
			distractors.delete(toDelete)
		}

		this.answers = Array.from(distractors);
		this.answers.shuffle();
	}
}