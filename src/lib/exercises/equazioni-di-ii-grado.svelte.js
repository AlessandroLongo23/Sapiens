import { Exercise, Question, Answer, AnswerSet } from '$lib/exercises/abstract.svelte.js';
import { Polynomial, Quadratic } from '$lib/math/algebra/Polynomial.js';
import { Fraction } from '$lib/math/algebra/Fraction.js';
import { Monomial } from '$lib/math/algebra/Monomial.js';
import { Equation } from '$lib/math/algebra/Equation.js';

export class SecondDegreeEquationEx extends Exercise {
	constructor() { super(4);}

	generateQuestion() {
        this.quadratic = Quadratic.random();
        this.equation = new Equation(this.quadratic, 0);
        this.question = new Question(this.equation.toLatex());
	}

    generateCorrectAnswer() {
        if (this.quadratic.solutions.length == 0) {
            this.answers.add(new Answer(`\\text{Impossibile}`, true));
        } else if (this.quadratic.solutions.length == 1) {
            this.answers.add(new Answer(`x = ${this.quadratic.solutions[0].toLatex()}`, true));
        } else {
            this.answers.add(new Answer(`x_1, x_2 = ${this.quadratic.solutions[0].toLatex()}, ${this.quadratic.solutions[1].toLatex()}`, true));
        }
    }

	generateWrongAnswers() {
        this.answers.add(new Answer(`x_1, x_2 = ${this.quadratic.solutions[1].mul(-1).toLatex()}, ${this.quadratic.solutions[0].mul(-1).toLatex()}`, true));
	}
}

export class SecondDegreeEquationDifferentFromZeroEx extends Exercise {
	constructor() { super(4); }

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
            this.answers.add(new Answer(`\\text{Impossibile}`, true));
        } else if (this.quadratic.solutions.length == 1) {
            this.answers.add(new Answer(`x = ${this.quadratic.solutions[0].toLatex()}`, true));
        } else {
            this.answers.add(new Answer(`x_1, x_2 = ${this.quadratic.solutions[0].toLatex()}, ${this.quadratic.solutions[1].toLatex()}`, true));
        }
    }

	generateWrongAnswers() {
		this.answers = new AnswerSet();

        this.answers.add(new Answer(`x_1, x_2 = ${this.quadratic.solutions[1].mul(-1).toLatex()}, ${this.quadratic.solutions[0].mul(-1).toLatex()}`, true));
	}
}