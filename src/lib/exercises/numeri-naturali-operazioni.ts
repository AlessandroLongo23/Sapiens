import { Exercise, Question, Answer } from '@/lib/exercises/abstract';
import { Random } from '@/lib/math/probabilityStatistics/Random';
import { Expression } from '@/lib/math/algebra/Expression';
import { Operator } from '@/lib/math/core/Operator';
import { Number } from '@/lib/math/algebra/Number';
import { isPrime } from '@/lib/math/core/utils';

export class AddizioneEx extends Exercise {
	expression!: Expression;
	result!: Number;
	
	constructor() { 
		super(4); 
	}

	generateQuestion() {
		const a = Random.int(1, 30);
		const b = Random.int(1, 30);

		this.expression = new Expression(`${a.toLatex()} ${Operator.ADDITION} ${b.toLatex()}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		const offset = Random.sample([-2, -1, 1, 2], 3);
		for (const o of offset) {
			this.answers.add(new Answer((this.result.add(o)).toLatex(), false));
		}
	}
}

export class SottrazioneEx extends Exercise {
	expression!: Expression;
	result!: Number;
	
	constructor() {
		super(4);
	}

	generateQuestion() {
		const a = Random.int(1, 30);
		const b = Random.int(1, a);

		this.expression = new Expression(`${a.toLatex()} ${Operator.SUBTRACTION} ${b.toLatex()}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		const offset = Random.sample([-2, -1, 1, 2], 3);
		for (const o of offset) {
			this.answers.add(new Answer((this.result.add(o)).toLatex(), false));
		}
	}
}

export class MoltiplicazioneEx extends Exercise {
	expression!: Expression;
	result!: Number;
	
	constructor() {
		super(4);
	}

	generateQuestion() {
		const a = Random.int(1, 10);
		const b = Random.int(1, 10);

		this.expression = new Expression(`${a.toLatex()} ${Operator.MULTIPLICATION} ${b.toLatex()}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		const offset = Random.sample([-2, -1, 1, 2], 3);
		for (const o of offset) {
			this.answers.add(new Answer((this.result.add(o)).toLatex(), false));
		}
	}
}

export class DivisioneEx extends Exercise {
	expression!: Expression;
	result!: Number;
	
	constructor() {
		super(4);
	}

	generateQuestion() {
		const a = Random.int(1, 100, (n) => { return !isPrime(n) });
		const b = Random.choice(a.getDivisors().slice(1, -1));

		this.expression = new Expression(`${a.toLatex()} ${Operator.DIVISION} ${b.toLatex()}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		const offset = Random.sample([-2, -1, 1, 2], 3);
		for (const o of offset) {
			this.answers.add(new Answer((this.result.add(o)).toLatex(), false));
		}
	}
}

// TODO: Create exercises for the properties of the operations