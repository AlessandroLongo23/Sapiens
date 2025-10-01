import { Exercise, Question, Answer, AnswerSet } from './abstract.svelte.js';
import { gcd, gcdArray, mcmArray } from '$lib/utils/auxiliary.js';
import { Fraction } from '$lib/math/Fraction.js';

export class StessoDenominatoreEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers = this.answers.select(3);
	}

	generateQuestion() {
        this.sign = Math.random() < 0.5 ? '+' : '-';
        this.den = Math.floor(Math.random() * 10) + 1;

        do {
            this.fraction1 = Fraction.random(this.sign, null, this.den, false);
            this.fraction2 = Fraction.random(this.sign, null, this.den, false);
        } while (
            Math.abs(this.fraction1.value) == 1 ||
            Math.abs(this.fraction2.value) == 1
        );

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

	generateAnswers() {
		this.answers = new AnswerSet();
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
	}
}

export class StessoNumeratoreEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers = this.answers.select(3);
	}

	generateQuestion() {
        this.sign = Math.random() < 0.5 ? '+' : '-';
        this.num = Math.floor(Math.random() * 10) + 1;

        do {
            this.fraction1 = Fraction.random(this.sign, this.num, null, false);
            this.fraction2 = Fraction.random(this.sign, this.num, null, false);
        } while (
            Math.abs(this.fraction1.value) == 1 ||
            Math.abs(this.fraction2.value) == 1
        );

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

	generateAnswers() {
		this.answers = new AnswerSet();
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
	}
}

export class NumeratoreEDenominatoreDiversoEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers = this.answers.select(3);
	}

	generateQuestion() {
        let sign = Math.random() < 0.5 ? '+' : '-';
        do {
            this.fraction1 = Fraction.random(sign, null, null, false);
            this.fraction2 = Fraction.random(sign, null, null, false);
        } while (this.fraction1.num == this.fraction2.num || this.fraction1.den == this.fraction2.den);

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

    generateAnswers() {
        this.answers = new AnswerSet();
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
    }
}