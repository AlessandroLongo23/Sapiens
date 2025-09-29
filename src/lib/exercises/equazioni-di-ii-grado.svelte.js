import { Exercise, Question, Answer } from '$lib/exercises/abstract.svelte.js';
import { Polynomial, Quadratic } from '$lib/math/Polynomial.js';
import { Fraction } from '$lib/math/Fraction.js';
import { Monomial } from '$lib/math/Monomial.js';
import { Equation } from '$lib/math/Equation.js';

export class SecondDegreeEquationEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.quadratic = Quadratic.random();
        this.equation = new Equation(this.quadratic, 0);
        this.question = new Question(this.equation.toLatex());
	}

    generateCorrectAnswer() {
        if (this.quadratic.solutions.length == 0) {
            this.answers.push(new Answer(`\\text{Impossibile}`, true));
        } else if (this.quadratic.solutions.length == 1) {
            this.answers.push(new Answer(`x = ${this.quadratic.solutions[0].toLatex()}`, true));
        } else {
            this.answers.push(new Answer(`x_1, x_2 = ${this.quadratic.solutions[0].toLatex()}, ${this.quadratic.solutions[1].toLatex()}`, true));
        }
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        // wrongAnswers.push(new Answer(`x = ${this.solution1.mul(-1).toLatex()}`, false));
        // try {
        //     wrongAnswers.push(new Answer(`x = ${this.solution1.inverse().mul(-1).toLatex()}`, false));
        //     wrongAnswers.push(new Answer(`x = ${this.solution1.inverse().toLatex()}`, false));
        // } catch (e) {
        //     console.log(e);
        // }

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
        do {
            this.left = Quadratic.random(false);
            this.right = Quadratic.random(false);
            this.quadratic = Quadratic.sub(this.left, this.right);
        } while (Math.sqrt(this.quadratic.delta) % 1 != 0);

        this.equation = new Equation(this.left, this.right)
        this.question = new Question(this.equation.toLatex());
	}

    generateCorrectAnswer() {
        this.quadratic = Quadratic.sub(this.left, this.right);

        if (this.quadratic.solutions.length == 0) {
            this.answers.push(new Answer(`\\text{Impossibile}`, true));
        } else if (this.quadratic.solutions.length == 1) {
            this.answers.push(new Answer(`x = ${this.quadratic.solutions[0].toLatex()}`, true));
        } else {
            this.answers.push(new Answer(`x_1, x_2 = ${this.quadratic.solutions[0].toLatex()}, ${this.quadratic.solutions[1].toLatex()}`, true));
        }
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        // let wrongAnswers = [];

        // if (this.den == 0) {
        //     wrongAnswers.push(new Answer(`x = ${this.solution.toString()}`, false));
        // } else {
        //     wrongAnswers.push(new Answer(`\\text{Impossibile}`, false));
        //     wrongAnswers.push(new Answer(`\\forall x \\in \\mathbb{R}`, false));
        // }

        // try {
        //     if (this.solution.notEquals(this.solution.inverse())) {
        //         wrongAnswers.push(new Answer(`x = ${this.solution.inverse().toString()}`, false));
        //     }

        //     if (this.solution.notEquals(this.solution.inverse().mul(-1))) {
        //         wrongAnswers.push(new Answer(`x = ${this.solution.inverse().mul(-1).toString()}`, false));
        //     }
        // } catch (e) {
        //     console.log(e);
        // }

        // if (this.solution.notEquals(this.solution.mul(-1))) {
        //     wrongAnswers.push(new Answer(`x = ${this.solution.mul(-1).toString()}`, false));
        // }

        // wrongAnswers = wrongAnswers.shuffle().slice(0, 3);

        // this.answers.push(...wrongAnswers);
	}
}