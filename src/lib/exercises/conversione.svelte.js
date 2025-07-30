import { Exercise, Question, Answer } from './abstract.svelte.js';
import { gcd, gcdArray, mcmArray } from '$lib/utils/auxiliary.js';

export class FinitoEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.integer = Math.random() < 0.5 ? Math.floor(Math.random() * 10) : 0;
        this.decimalDigits = Math.floor(Math.random() * 3) + 1;
        this.decimal = Math.round(Math.random() * 10 ** this.decimalDigits);
        if (this.decimal % 10 == 0) this.decimal++;
        this.decimal = this.decimal.toString();
        this.num = this.integer + '.' + this.decimal;

        this.question = new Question(`${this.num}`);
	}

    generateCorrectAnswer() {
        let num = Math.round(this.num * 10 ** this.decimalDigits);
        let den = 10 ** this.decimalDigits;

        this.answers.push(new Answer(`\\dfrac{${num}}{${den}}`, true));
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = new Map();

        for (let i = -2; i <= 2; i++) {
            let num = Math.round(this.num * 10 ** this.decimalDigits);
            let den = 10 ** (this.decimalDigits + i);
            if (num / den != this.num) {
                let key = `${num}/${den}`;
                wrongAnswers.set(key, new Answer(`\\dfrac{${num}}{${den}}`, false));
            }
        }

        wrongAnswers = Array.from(wrongAnswers.values()).shuffle().slice(0, 2);

        this.answers.push(...wrongAnswers);
	}
}

export class PeriodicoSempliceEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

    generateQuestion() {
        this.decimalDigits = Math.floor(Math.random() * 3) + 1;
        this.digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.decimal = this.digits.shuffle().slice(0, this.decimalDigits).join('');

        this.question = new Question(`0.\\overline{${this.decimal}}`);
    }

    generateCorrectAnswer() {
        let num = this.decimal;
        let den = '9'.repeat(this.decimalDigits);

        this.answers.push(new Answer(`\\dfrac{${num}}{${den}}`, true));
        this.n = num / den;
    }

    generateAnswers() {
        this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = new Map();

        for (let i = -2; i <= 2; i++) {
            let num = this.decimal;
            if (this.decimalDigits + i <= 0) continue;

            let den = '9'.repeat(this.decimalDigits + i);
            if (Math.abs(num / den - this.n) > 1e-10) {
                let key = `${num}/${den}`;
                wrongAnswers.set(key, new Answer(`\\dfrac{${num}}{${den}}`, false));
            }
        }

        wrongAnswers = Array.from(wrongAnswers.values()).shuffle().slice(0, 2);

        this.answers.push(...wrongAnswers);
    }
}

export class PeriodicoMistoEx extends Exercise {
    constructor() {
        super();

        this.generateQuestion();
        this.generateAnswers();
        this.answers.shuffle();
    }
    
    generateQuestion() {
        this.integer = Math.random() < 0.5 ? Math.floor(Math.random() * 10) : 0;
        this.numPeriodicDigits = Math.floor(Math.random() * 2) + 1;
        this.numAperiodicDigits = Math.floor(Math.random() * 2) + 1;
        this.digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.periodicDigits = this.digits.shuffle().slice(0, this.numPeriodicDigits).join('');
        this.aperiodicDigits = this.digits.shuffle().slice(0, this.numAperiodicDigits).join('');

        this.question = new Question(`${this.integer}.${this.aperiodicDigits}\\overline{${this.periodicDigits}}`);
    }
    
    generateCorrectAnswer() {
        let num = 0;
        num += parseInt(this.integer) * 10 ** (this.numAperiodicDigits + this.numPeriodicDigits)
        num += parseInt(this.aperiodicDigits) * 10 ** this.numPeriodicDigits
        num += parseInt(this.periodicDigits);
        num -= parseInt(this.integer) * 10 ** (this.numAperiodicDigits)
        num -= parseInt(this.aperiodicDigits);

        let den = '9'.repeat(this.numPeriodicDigits) + '0'.repeat(this.numAperiodicDigits);

        this.answers.push(new Answer(`\\dfrac{${num}}{${den}}`, true));
        this.n = num / den;
    }
    
    generateAnswers() {
        this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        let num = 0, den = 0;
        num += parseInt(this.integer) * 10 ** (this.numAperiodicDigits + this.numPeriodicDigits)
        num += parseInt(this.aperiodicDigits) * 10 ** this.numPeriodicDigits
        num += parseInt(this.periodicDigits);

        if (this.numPeriodicDigits !== this.numAperiodicDigits) {
            den = '9'.repeat(this.numAperiodicDigits) + '0'.repeat(this.numPeriodicDigits);
            wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        }
        den = '9'.repeat(this.numPeriodicDigits)
        wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        if (this.integer != 0) {
            den = '9'.repeat(this.numPeriodicDigits) + '0'.repeat(this.numAperiodicDigits + 1);
            wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        }

        num -= parseInt(this.integer) * 10 ** (this.numAperiodicDigits)
        num -= parseInt(this.aperiodicDigits);

        if (this.numPeriodicDigits !== this.numAperiodicDigits) {
            den = '9'.repeat(this.numAperiodicDigits) + '0'.repeat(this.numPeriodicDigits);
            wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        }
        den = '9'.repeat(this.numPeriodicDigits)
        wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        if (this.integer != 0) {
            den = '9'.repeat(this.numPeriodicDigits) + '0'.repeat(this.numAperiodicDigits + 1);
            wrongAnswers.push(new Answer(`\\dfrac{${num}}{${den}}`, false));
        }

        wrongAnswers = wrongAnswers.shuffle().slice(0, 3);

        this.answers.push(...wrongAnswers);
    }
}