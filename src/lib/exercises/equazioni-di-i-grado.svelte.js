import { Exercise, Question, Answer } from './abstract.svelte.js';
import { Fraction } from '../math/Fraction.js';

export class FirstDegreeEquationEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.a = Math.floor(Math.random() * 10) + 1 * (Math.random() < 0.5 ? 1 : -1);
        this.b = Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);

        let question = '';
        if (this.a != 0) {
            if (Math.abs(this.a) == 1) {
                question += `${this.a > 0 ? '' : '-'}x `;
            } else {
                question += `${this.a}x `;
            }
        }
        if (this.b != 0) {
            question += `${this.b > 0 ? this.a == 0 ? '' : '+' : '-'} ${Math.abs(this.b)} `;
        }
        question += '= 0';

        this.question = new Question(question);
	}

    generateCorrectAnswer() {
        this.solution = new Fraction(-this.b, this.a);
        this.solution.simplify();

        this.answers.push(new Answer(`x = ${this.solution.toString()}`, true));
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        wrongAnswers.push(new Answer(`x = ${this.solution.mul(-1).toString()}`, false));
        try {
            wrongAnswers.push(new Answer(`x = ${this.solution.inverse().mul(-1).toString()}`, false));
            wrongAnswers.push(new Answer(`x = ${this.solution.inverse().toString()}`, false));
        } catch (e) {
            console.log(e);
        }

        wrongAnswers = wrongAnswers.shuffle().slice(0, 3);

        this.answers.push(...wrongAnswers);
	}
}

export class FirstDegreeEquationDifferentFromZeroEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.a1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

        this.a2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

        let question = '';
        if (this.a1 != 0) {
            if (Math.abs(this.a1) == 1) {
                question += `${this.a1 > 0 ? '' : '-'}x `;
            } else {
                question += `${this.a1}x `;
            }
        }
        if (this.b1 != 0) {
            question += `${this.b1 > 0 ? this.a1 == 0 ? '' : '+' : '-'} ${Math.abs(this.b1)} `;
        } else if (this.a1 == 0) {
            question += `0 `;
        }

        question += `= `;

        if (this.a2 != 0) {
            if (Math.abs(this.a2) == 1) {
                question += `${this.a2 > 0 ? '' : '-'}x `;
            } else {
                question += `${this.a2}x `;
            }
        }
        if (this.b2 != 0) {
            question += `${this.b2 > 0 ? this.a2 == 0 ? '' : '+' : '-'} ${Math.abs(this.b2)}`;
        } else if (this.a2 == 0) {
            question += `0 `;
        }


        this.question = new Question(question); 
	}

    generateCorrectAnswer() {
        this.num = this.b2 - this.b1;
        this.den = this.a1 - this.a2;
        this.solution = new Fraction(this.num, this.den);
        this.solution.simplify();

        if (this.den == 0) {
            if (this.num == 0) {
                this.answers.push(new Answer(`\\forall x \\in \\mathbb{R}`, true));
            } else {
                this.answers.push(new Answer(`\\text{Impossibile}`, true));
            }
        } else {
            this.answers.push(new Answer(`x = ${this.solution.toString()}`, true));
        }
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        if (this.den == 0) {
            wrongAnswers.push(new Answer(`x = ${this.solution.toString()}`, false));
        } else {
            wrongAnswers.push(new Answer(`\\text{Impossibile}`, false));
            wrongAnswers.push(new Answer(`\\forall x \\in \\mathbb{R}`, false));
        }

        try {
            if (this.solution.notEquals(this.solution.inverse())) {
                wrongAnswers.push(new Answer(`x = ${this.solution.inverse().toString()}`, false));
            }

            if (this.solution.notEquals(this.solution.inverse().mul(-1))) {
                wrongAnswers.push(new Answer(`x = ${this.solution.inverse().mul(-1).toString()}`, false));
            }
        } catch (e) {
            console.log(e);
        }

        if (this.solution.notEquals(this.solution.mul(-1))) {
            wrongAnswers.push(new Answer(`x = ${this.solution.mul(-1).toString()}`, false));
        }

        wrongAnswers = wrongAnswers.shuffle().slice(0, 3);

        this.answers.push(...wrongAnswers);
	}
}