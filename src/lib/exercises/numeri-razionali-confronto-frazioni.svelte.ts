import { Exercise, Question, Answer, AnswerSet } from './abstract.svelte.js';
import { gcd, gcdArray, lcmArray } from '$lib/math/core/utils.js';
import { Fraction } from '$lib/math/algebra/Fraction.js';
import { Random } from '$lib/math/probabilityStatistics/Random.js';

export class StessoDenominatoreEx extends Exercise {
    sign: '+' | '-';
    den: number;
    fraction1: Fraction;
    fraction2: Fraction;

	constructor() { 
        super(3); 
    }

	generateQuestion() {
        this.sign = Math.random() < 0.5 ? '+' : '-';
        this.den = Math.floor(Math.random() * 10) + 1;

        do {
            this.fraction1 = Fraction.random(this.sign, null, this.den, 1, 10, false);
            this.fraction2 = Fraction.random(this.sign, null, this.den, 1, 10, false);
        } while (
            Math.abs(this.fraction1.value.value) == 1 ||
            Math.abs(this.fraction2.value.value) == 1
        );

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

	generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value.value > this.fraction2.value.value));
        this.answers.add(new Answer('<', this.fraction1.value.value < this.fraction2.value.value));
        this.answers.add(new Answer('=', this.fraction1.value.value == this.fraction2.value.value));
	}

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}

export class StessoNumeratoreEx extends Exercise {
    sign: '+' | '-';
    num: number;
    fraction1: Fraction;
    fraction2: Fraction;

	constructor() { 
        super(3); 
    }

	generateQuestion() {
        this.sign = Random.choice(['+', '-']);
        this.num = Random.int(1, 10).value;

        do {
            this.fraction1 = Fraction.random(this.sign, this.num, null, 1, 10, false);
            this.fraction2 = Fraction.random(this.sign, this.num, null, 1, 10, false);
        } while (
            Math.abs(this.fraction1.value.value) == 1 ||
            Math.abs(this.fraction2.value.value) == 1
        );

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

	generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value.value > this.fraction2.value.value));
        this.answers.add(new Answer('<', this.fraction1.value.value < this.fraction2.value.value));
        this.answers.add(new Answer('=', this.fraction1.value.value == this.fraction2.value.value));
	}

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}

export class NumeratoreEDenominatoreDiversoEx extends Exercise {
    sign: '+' | '-';
    num: number;
    den: number;
    fraction1: Fraction;
    fraction2: Fraction;

	constructor() { 
        super(3); 
    }

	generateQuestion() {
        this.sign = Random.choice(['+', '-']);
        this.num = Random.int(1, 10).value;
        this.den = Random.int(1, 10).value;

        do {
            this.fraction1 = Fraction.random(this.sign, null, null, 1, 10, false);
            this.fraction2 = Fraction.random(this.sign, null, null, 1, 10, false);
        } while (this.fraction1.num == this.fraction2.num || this.fraction1.den == this.fraction2.den);

        this.question = new Question(`${this.fraction1.toLatex()}\\ \\square\\ ${this.fraction2.toLatex()}`);
	}

    generateCorrectAnswer() {
        this.answers.add(new Answer('>', this.fraction1.value.value > this.fraction2.value.value));
        this.answers.add(new Answer('<', this.fraction1.value.value < this.fraction2.value.value));
        this.answers.add(new Answer('=', this.fraction1.value.value == this.fraction2.value.value));
    }

    generateWrongAnswers() {
        this.generateCorrectAnswer();
    }
}