import { Exercise, Question, Answer } from './abstract.svelte.js';
import { gcd, gcdArray, mcmArray } from '$lib/utils/auxiliary.js';
import { themeStore } from '$lib/components/theme/theme.js';

export class PotenzeEsponenteNegativoEx extends Exercise {
	constructor() {
		super();

        this.exponents = [-3, -2, -1, 2, 3]

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.num = Math.floor(Math.random() * 10) + 1;
        do {
            if (this.num == 1) {
                this.den = Math.floor(Math.random() * 9) + 2;
            } else {
                this.den = Math.floor(Math.random() * 10) + 1;
            }
        } while (this.den == this.num);

        this.exp = this.exponents.random();
        this.negativeBase = Math.random() < 0.5;

        if (this.den == 1) {
            this.question = new Question(`\\left(${this.negativeBase ? '-' : ''}${this.num}\\right)^{${this.exp}}`);
        } else {
            this.question = new Question(`\\left(${this.negativeBase ? '-' : ''}\\dfrac{${this.num}}{${this.den}}\\right)^{${this.exp}}`);
        }
	}

    generateCorrectAnswer() {
        if (this.exp < 0) {
            if (this.num ** -this.exp == 1) {
                this.answers.push(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}${this.den ** -this.exp}`, true));
            } else {
                this.answers.push(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}\\dfrac{${this.den ** -this.exp}}{${this.num ** -this.exp}}`, true));
            }
        } else {
            if (this.den ** this.exp == 1) {
                this.answers.push(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}${this.num ** this.exp}`, true));
            } else {
                this.answers.push(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}\\dfrac{${this.num ** this.exp}}{${this.den ** this.exp}}`, true));
            }
        }
    }

	generateAnswers() {
		let wrongAnswers = new Set();

        this.generateCorrectAnswer();

        // right answer ^{-1}
        if (this.exp < 0) {
            if (this.den ** -this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}${this.num ** -this.exp}`, false));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}\\dfrac{${this.num ** -this.exp}}{${this.den ** -this.exp}}`, false));
            }
        } else {
            if (this.num ** this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}${this.den ** this.exp}`, false));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '-' : ''}\\dfrac{${this.den ** this.exp}}{${this.num ** this.exp}}`, false));
            }
        }

        // * instead of ^
        if (this.exp < 0) {
            wrongAnswers.add(new Answer(`${this.negativeBase ? '' : '-'}\\dfrac{${-this.num * this.exp}}{${-this.den * this.exp}}`, false));
        } else {
            wrongAnswers.add(new Answer(`${this.negativeBase ? '' : '-'}\\dfrac{${this.num * this.exp}}{${this.den * this.exp}}`, false));
        }

        // right answer * -1
        if (this.exp < 0) {
            if (this.num ** -this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}${this.den ** -this.exp}`, true));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}\\dfrac{${this.den ** -this.exp}}{${this.num ** -this.exp}}`, true));
            }
        } else {
            if (this.den ** this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}${this.num ** this.exp}`, true));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}\\dfrac{${this.num ** this.exp}}{${this.den ** this.exp}}`, true));
            }
        }

        // right answer ^{-1} * -1
        if (this.exp < 0) {
            if (this.den ** -this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}${this.num ** -this.exp}`, false));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}\\dfrac{${this.num ** -this.exp}}{${this.den ** -this.exp}}`, false));
            }
        } else {
            if (this.num ** this.exp == 1) {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}${this.den ** this.exp}`, false));
            } else {
                wrongAnswers.add(new Answer(`${this.negativeBase && this.exp % 2 == 1 ? '' : '-'}\\dfrac{${this.den ** this.exp}}{${this.num ** this.exp}}`, false));
            }
        }

        wrongAnswers = Array.from(wrongAnswers).shuffle().slice(0, 3);

        this.answers = [...wrongAnswers, ...this.answers];
        this.answers.shuffle();
    }
}