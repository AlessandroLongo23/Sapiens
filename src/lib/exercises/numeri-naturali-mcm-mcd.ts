import { Exercise, Question, Answer } from './abstract';
import { gcdArray, lcmArray, productArray } from '@/lib/math/core/utils';
import { Random } from '@/lib/math/probabilityStatistics/Random';
import { Number } from '@/lib/math/algebra/Number';

export class McmEx extends Exercise {
	numbers!: Number[];
	correctAnswer!: Number;

	constructor() {
		super(4);
	}

	generateQuestion(): void {
		this.numbers = Random.intArray(2, 20, Random.int(2, 4).value, (arr: Number[]) => lcmArray(arr).value < 100);
		this.question = new Question(`mcm(${this.numbers.map(n => n.toLatex()).join(', ')})`);
	}

	generateCorrectAnswer(): void {
		this.correctAnswer = lcmArray(this.numbers);
		this.answers.add(new Answer(this.correctAnswer.toLatex(), true));
	}

	generateWrongAnswers(): void {
		this.answers.add(new Answer(gcdArray(this.numbers).toLatex(), false));
		this.answers.add(new Answer(productArray(this.numbers).toLatex(), false));

		// TODO: generate all subsets of this.numbers and add the mcm of each subset
		const subsetmcm: Number = lcmArray(this.numbers.slice(0, 2));
		this.answers.add(new Answer(subsetmcm.toLatex(), false));

		while (this.answers.size < 4) {
			const randomDistractor: Number = Number.mul(this.correctAnswer, Random.int(2, 5));
			this.answers.add(new Answer(randomDistractor.toLatex(), false));
		}
	}
}

export class MCDEx extends Exercise {
	numbers!: Number[];
	correctAnswer!: Number;

	constructor() {
		super(4);
	}

	generateQuestion(): void {
		this.numbers = Random.intArray(3, 20, Random.int(2, 4).value, (arr: Number[]) => gcdArray(arr).value > 1);
		this.question = new Question(`mcd(${this.numbers.map(n => n.toLatex()).join(', ')})`);
	}

	generateCorrectAnswer(): void {
		this.correctAnswer = gcdArray(this.numbers);
		this.answers.add(new Answer(this.correctAnswer.toLatex(), true));
	}

	generateWrongAnswers(): void {
		this.answers.add(new Answer(lcmArray(this.numbers).toLatex(), false));

		// TODO: generate all subsets of this.numbers and add the mcd of each subset
		const subsetGcd: Number = gcdArray(this.numbers.slice(0, 2));
		this.answers.add(new Answer(subsetGcd.toLatex(), false));

		while (this.answers.size < 4) {
			const randomDistractor: Number = Number.mul(this.correctAnswer, Random.int(1, 5));
			this.answers.add(new Answer(randomDistractor.toLatex(), false));
		}
	}
}