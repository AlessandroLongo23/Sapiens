import { Exercise, Question, Answer, AnswerSet } from './abstract.svelte.js';
import { gcd, gcdArray, lcmArray } from '$lib/math/core/utils.js';
import { Fraction } from '$lib/math/algebra/Fraction.js';

export class StessoDenominatoreEx extends Exercise {
	constructor() { super(3); }

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

	generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
	}

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}

export class StessoNumeratoreEx extends Exercise {
	constructor() { super(3); }

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

	generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
	}

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}

export class NumeratoreEDenominatoreDiversoEx extends Exercise {
	constructor() { super(3); }

	generateQuestion() {
        this.sign = Math.random() < 0.5 ? '+' : '-';
        do {
            this.fraction1 = Fraction.random(this.sign, null, null, false);
            this.fraction2 = Fraction.random(this.sign, null, null, false);
        } while (this.fraction1.num == this.fraction2.num || this.fraction1.den == this.fraction2.den);

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

    generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value > this.fraction2.value));
        this.answers.add(new Answer('<', this.fraction1.value < this.fraction2.value));
        this.answers.add(new Answer('=', this.fraction1.value == this.fraction2.value));
    }

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}