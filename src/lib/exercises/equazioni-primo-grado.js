import { Exercise, Question, Answer, AnswerSet } from './abstract';
import { Fraction } from '../math/algebra/Fraction';
import { Polynomial } from '../math/algebra/Polynomial';
import { Monomial } from '../math/algebra/Monomial';
import { Equation } from '../math/algebra/Equation';

export class FirstDegreeEquationEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers = this.answers.select(4);
	}

	generateQuestion() {
        this.a = Math.floor(Math.random() * 10) + 1 * (Math.random() < 0.5 ? 1 : -1);
        this.b = Math.floor(Math.random() * 10) * (Math.random() < 0.5 ? 1 : -1);

        this.equation = new Equation(new Polynomial([
            new Monomial(new Fraction(this.a), { x: 1 }),
            new Monomial(new Fraction(this.b), {}),
        ]), 0);

        this.question = new Question(this.equation.toLatex());
	}

    generateCorrectAnswer() {
        this.solution = new Fraction(-this.b, this.a);
        this.solution.simplify();

        this.answers.add(new Answer(`x = ${this.solution.toLatex()}`, true));
    }

	generateAnswers() {
		this.answers = new AnswerSet();

        this.generateCorrectAnswer();

        this.answers.add(new Answer(`x = ${this.solution.mul(-1).toLatex()}`, false));
        try {
            this.answers.add(new Answer(`x = ${this.solution.inverse().mul(-1).toLatex()}`, false));
            this.answers.add(new Answer(`x = ${this.solution.inverse().toLatex()}`, false));
        } catch (e) {
            console.log(e);
        }
	}
}

export class FirstDegreeEquationDifferentFromZeroEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers = this.answers.select(4);
	}

	generateQuestion() {
        this.a1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b1 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

        this.a2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);
        this.b2 = (Math.floor(Math.random() * 10)) * (Math.random() < 0.5 ? 1 : -1);

        this.equation = new Equation(
            new Polynomial(
                [
                    new Monomial(new Fraction(this.a1), { x: 1 }),
                    new Monomial(new Fraction(this.b1), {}),
                ]
            ),
            new Polynomial(
                [
                    new Monomial(new Fraction(this.a2), { x: 1 }),
                    new Monomial(new Fraction(this.b2), {}),
                ]
            ));

        this.question = new Question(this.equation.toLatex()); 
	}

    generateCorrectAnswer() {
        this.num = this.b2 - this.b1;
        this.den = this.a1 - this.a2;
        this.solution = new Fraction(this.num, this.den);
        this.solution.simplify();

        if (this.den == 0) {
            if (this.num == 0) {
                this.answers.add(new Answer(`\\forall x \\in \\mathbb{R}`, true));
            } else {
                this.answers.add(new Answer(`\\text{Impossibile}`, true));
            }
        } else {
            this.answers.add(new Answer(`x = ${this.solution.toLatex()}`, true));
        }
    }

	generateAnswers() {
		this.answers = new AnswerSet();

        this.generateCorrectAnswer();

        if (this.den == 0) {
            this.answers.add(new Answer(`x = ${this.solution.toLatex()}`, false));
        } else {
            this.answers.add(new Answer(`\\text{Impossibile}`, false));
            this.answers.add(new Answer(`\\forall x \\in \\mathbb{R}`, false));
        }

        try {
            this.answers.add(new Answer(`x = ${this.solution.inverse().toLatex()}`, false));
            this.answers.add(new Answer(`x = ${this.solution.inverse().mul(-1).toLatex()}`, false));
        } catch (e) {
            console.log(e);
        }

        this.answers.add(new Answer(`x = ${this.solution.mul(-1).toLatex()}`, false));
	}
}