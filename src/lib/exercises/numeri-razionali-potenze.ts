import { Exercise, Question, Answer } from './abstract';
import { Random } from '@/lib/math/probabilityStatistics/Random';
import { Fraction } from '@/lib/math/algebra/Fraction';
import { Number } from '@/lib/math/algebra/Number';
import { Expression } from '@/lib/math/algebra/Expression';

const exponents: Number[] = [-3, -2, -1, 2, 3].map(n => new Number(n));

export class PotenzeEsponenteNegativoEx extends Exercise {
    exp!: Number;
    negativeBase!: boolean;
    fraction!: Fraction;
    expression!: Expression;
    
	constructor() {
		super(4);
	}

	generateQuestion() {
        const [num, den] = Random.intArray(1, 10, 2, (n: Number[]) => n[0].value !== n[1].value);
        this.exp = Random.choice(exponents);
        
        this.negativeBase = Random.bool();
        this.fraction = Fraction.fromNumDen(num, den).mul(this.negativeBase ? -1 : 1);

        this.expression = new Expression(`\\left(${this.fraction.toLatex()}\\right)^{${this.exp.toLatex()}}`);
        this.question = new Question(this.expression.toLatex());
	}

    generateCorrectAnswer() {
        const solution: Expression = this.expression.simplify({ evaluateNumerics: { power: true } });
        this.answers.add(new Answer(solution.toLatex(), true));
    }

	generateWrongAnswers() {
        // opposite, reciprocal, antireciprocal
        this.answers.add(new Answer(this.expression.mul(-1).simplify({ evaluateNumerics: { power: true } }).toLatex(), false));
        this.answers.add(new Answer(this.expression.power(-1).simplify({ evaluateNumerics: { power: true } }).toLatex(), false));
        this.answers.add(new Answer(this.expression.power(-1).mul(-1).simplify({ evaluateNumerics: { power: true } }).toLatex(), false));

        // * instead of ^
        const product = new Expression(`\\left(${this.negativeBase ? '-' : ''}\\dfrac{${this.fraction.num.toLatex()}\\times${this.exp.toLatex()}}{${this.fraction.den.toLatex()}\\times${this.exp.toLatex()}}\\right)`)
        this.answers.add(new Answer(product.simplify({ evaluateNumerics: { power: true, multiplication: true } }).toLatex(), false));
        this.answers.add(new Answer(product.mul(-1).simplify({ evaluateNumerics: { power: true, multiplication: true } }).toLatex(), false));
        this.answers.add(new Answer(product.power(-1).simplify({ evaluateNumerics: { power: true, multiplication: true } }).toLatex(), false));
        this.answers.add(new Answer(product.power(-1).mul(-1).simplify({ evaluateNumerics: { power: true, multiplication: true } }).toLatex(), false));
    }
}