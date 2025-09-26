import { Exercise, Question, Answer } from './abstract.svelte.js';
import { Fraction } from '../math/Fraction.js';

export class SecondDegreeEquationEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.delta = 2;
        while (Math.sqrt(this.delta) % 1 != 0) {
            this.a = (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? 1 : -1);
            this.b = Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);
            this.c = Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);

            this.delta = this.b ** 2 - 4 * this.a * this.c;
        }

        let question = '';
        if (this.a != 0) {
            if (Math.abs(this.a) == 1) {
                question += `${this.a > 0 ? '' : '-'}x^2 `;
            } else {
                question += `${this.a}x^2 `;
            }
        }
        if (this.b != 0) {
            question += `${this.b > 0 ? Math.abs(this.a) == 0 ? '' : '+' : '-'}`;
            if (Math.abs(this.b) == 1) {
                question += `x `;
            } else {
                question += `${Math.abs(this.b)}x `;
            }
        }
        if (this.c != 0) {
            question += `${this.c > 0 ? (this.a == 0 && this.b == 0) ? '' : '+' : '-'} ${Math.abs(this.c)} `;
        }
        question += '= 0';

        this.question = new Question(question);
	}

    generateCorrectAnswer() {
        if (this.delta < 0) {
            this.answers.push(new Answer(`\\text{Impossibile}`, true));
        } else if (this.delta == 0) {
            this.solution1 = new Fraction(-this.b, 2 * this.a);
            this.solution1.simplify();
            this.answers.push(new Answer(`x = ${this.solution1.toString()}`, true));
        } else {
            this.solution1 = new Fraction(-this.b - Math.sqrt(this.delta), 2 * this.a);
            this.solution1.simplify();
            this.solution2 = new Fraction(-this.b + Math.sqrt(this.delta), 2 * this.a);
            this.solution2.simplify();
            this.answers.push(new Answer(`x_1, x_2 = ${this.solution1.toString()}, ${this.solution2.toString()}`, true));
        }
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        wrongAnswers.push(new Answer(`x = ${this.solution1.mul(-1).toString()}`, false));
        try {
            wrongAnswers.push(new Answer(`x = ${this.solution1.inverse().mul(-1).toString()}`, false));
            wrongAnswers.push(new Answer(`x = ${this.solution1.inverse().toString()}`, false));
        } catch (e) {
            console.log(e);
        }

        wrongAnswers = wrongAnswers.shuffle().slice(0, 3);

        this.answers.push(...wrongAnswers);
	}
}

export class SecondDegreeEquationDifferentFromZeroEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.a1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.c1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

        this.a2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.c2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

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
        // this.solution.simplify();

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