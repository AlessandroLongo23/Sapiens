import { Exercise, Question, Answer } from './abstract.svelte.js';
import { gcd, gcdArray, mcmArray } from '$lib/utils/auxiliary.js';

export class StessoDenominatoreEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
        this.num1 = Math.floor(Math.random() * 10) + 1;
        this.num2 = Math.floor(Math.random() * 10) + 1;
        while (this.num2 == this.num1) {
            this.num2 = Math.floor(Math.random() * 10) + 1;
        }

        this.den = Math.floor(Math.random() * 10) + 1;
        while (this.den == this.num1 || this.den == this.num2) {
            this.den = Math.floor(Math.random() * 10) + 1;
        }

        this.question = new Question(`\\dfrac{${this.num1}}{${this.den}}\\ \\square\\ \\dfrac{${this.num2}}{${this.den}}`);
	}

	generateAnswers() {
		this.answers = []
        this.answers.push(new Answer('>', this.num1 > this.num2));
        this.answers.push(new Answer('<', this.num1 < this.num2));
        this.answers.push(new Answer('=', this.num1 == this.num2));
	}
}

export class StessoNumeratoreEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
        this.den1 = Math.floor(Math.random() * 10) + 1;
        this.den2 = Math.floor(Math.random() * 10) + 1;
        while (this.den2 == this.den1) {
            this.den2 = Math.floor(Math.random() * 10) + 1;
        }

        this.num = Math.floor(Math.random() * 10) + 1;
        while (this.num == this.den1 || this.num == this.den2) {
            this.num = Math.floor(Math.random() * 10) + 1;
        }

        this.question = new Question(`\\dfrac{${this.num}}{${this.den1}}\\ \\square\\ \\dfrac{${this.num}}{${this.den2}}`);
	}

	generateAnswers() {
		this.answers = []
        this.answers.push(new Answer('>', this.den1 < this.den2));
        this.answers.push(new Answer('<', this.den1 > this.den2));
        this.answers.push(new Answer('=', this.den1 == this.den2));
	}
}

export class NumeratoreEDenominatoreDiversoEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
	}

	generateQuestion() {
		this.num1 = Math.floor(Math.random() * 10) + 1;
		this.num2 = Math.floor(Math.random() * 10) + 1;
		while (this.num2 == this.num1) {
			this.num2 = Math.floor(Math.random() * 10) + 1;
		}

		this.den1 = Math.floor(Math.random() * 10) + 1;
        this.den2 = Math.floor(Math.random() * 10) + 1;
        while (this.den2 == this.den1) {
            this.den2 = Math.floor(Math.random() * 10) + 1;
        }

        this.question = new Question(`\\dfrac{${this.num1}}{${this.den1}}\\ \\square\\ \\dfrac{${this.num2}}{${this.den2}}`);
	}

    generateAnswers() {
        this.answers = []
        this.answers.push(new Answer('>', this.num1 / this.den1 > this.num2 / this.den2));
        this.answers.push(new Answer('<', this.num1 / this.den1 < this.num2 / this.den2));
        this.answers.push(new Answer('=', this.num1 / this.den1 == this.num2 / this.den2));
    }
}