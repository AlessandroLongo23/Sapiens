import { Exercise, Answer, Question } from './abstract';
import { Random } from '@/lib/math/probabilityStatistics/Random';
import { Expression } from '@/lib/math/algebra/Expression';
import { Operator } from '@/lib/math/core/Operator';
import { Interval } from '@/lib/math/core/Interval';
import { Number } from '@/lib/math/algebra/Number';

const operators: Operator[] = [Operator.MULTIPLICATION, Operator.DIVISION];
const offsets: Number[] = [-3, -2, -1, 1, 2, 3].map(n => new Number(n));

export class PotenzaExSameBase extends Exercise {
	base!: Number;
	exponents!: Number[];
	operations!: string[];
	expression!: Expression;
	finalExponent!: Number;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;
		this.base = Random.int(2, 9);
		this.exponents = Random.intArray(2, 5, n);
		this.operations = Random.choices(operators, n - 1);

		let formula: string = '';
		for (let i = 0; i < n; i++) {
			formula += `${this.base.toLatex()}^{${this.exponents[i].toLatex()}}`;
			formula += i < n - 1 ? this.operations[i] : '';
		}

		this.expression = new Expression(formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		let finalExponentExprLatex: string = '';
		for (let i = 0; i < this.exponents.length; i++) {
			finalExponentExprLatex += this.exponents[i].toLatex();
			const operator: Operator = this.operations[i] === Operator.MULTIPLICATION ? Operator.ADDITION : Operator.SUBTRACTION;
			finalExponentExprLatex += i < this.operations.length ? operator : '';
		}
		this.finalExponent = new Expression(finalExponentExprLatex).evaluate() as Number;

		this.answers.add(new Answer(this.expression.simplify({ evaluateNumerics: false }).toLatex(), true));
	}

	generateWrongAnswers(): void {
		const offsetExponents: Number[] = Random.sample(offsets, 3);
		for (let i = 0; i < offsetExponents.length; i++) {
			this.answers.add(new Answer(this.base.toLatex() + '^{' + Number.add(this.finalExponent, offsetExponents[i]).toLatex() + '}', false));
		}
	}
}

export class PotenzaExSameExponent extends Exercise {
	base!: Number;
	exponent!: Number;
	bases!: Number[];
	operations!: string[];
	expression!: Expression;
	finalBase!: Number;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;
		let iter: number = 0;
		const validBaseInterval: Interval = new Interval(0, 100);
		this.exponent = Random.int(2, 9);
		do {
			this.bases = Random.intArray(2, 20, n);
			this.operations = Random.choices(operators, n - 1);

			let finalBaseExprLatex: string = '';
			for (let i = 0; i < this.bases.length; i++) {
				finalBaseExprLatex += this.bases[i].toLatex();
				finalBaseExprLatex += i < this.operations.length ? this.operations[i] : '';
			}
			this.finalBase = new Expression(finalBaseExprLatex).evaluate() as Number;
			iter++;
		} while ((this.finalBase.value % 1 !== 0 || !validBaseInterval.contains(this.finalBase)) && iter < 100);

		let formula: string = '';
		for (let i = 0; i < n; i++) {
			formula += `${this.bases[i].toLatex()}^{${this.exponent.toLatex()}}`;
			formula += i < n - 1 ? this.operations[i] : '';
		}

		this.expression = new Expression(formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		this.answers.add(new Answer(this.finalBase.toLatex() + '^{' + this.exponent.toLatex() + '}', true));
	}

	generateWrongAnswers(): void {
		const offsetBases: Number[] = Random.sample(offsets, 3);
		for (let i = 0; i < offsetBases.length; i++) {
			this.answers.add(new Answer(Number.add(this.finalBase, offsetBases[i]).toLatex() + '^{' + this.exponent.toLatex() + '}', false));
		}
	}
}

// TODO: Implement this exercise type
export class PotenzaExGeneral extends Exercise {
	formula!: string;
	expression!: Expression;

	constructor() {
		super(3);
	}

	generateQuestion(): void {
		const n: number = 3;

		this.formula = '';
		for (let i = 0; i < n; i++) {
			const base: Number = Random.int(2, 9);
			const exponent: Number = Random.int(2, 9);
			this.formula += `${base.toLatex()}^{${exponent.toLatex()}}`;
			if (i < n - 1) {
				this.formula += Random.choice(operators);
			}
		}
		this.expression = new Expression(this.formula);
		this.question = new Question(this.expression.toLatex());
	}

	generateCorrectAnswer(): void {
		// this.answers.add(new Answer(this.formula, true));
	}

	generateWrongAnswers(): void {
		// this.answers.add(new Answer(this.formula, false));
	}
}