import { Exercise, Question, Answer } from '$lib/exercises/abstract.svelte.js';
import { Expression } from '$lib/math/Expression.js';
import { Number } from '$lib/math/Number.js';
import { Operator } from '$lib/math/Operator.js';

export class AddizioneEx extends Exercise {
	expression: Expression;
	result: Number;
	
	constructor() { 
		super(3); 
	}

	generateQuestion() {
		const a = Math.floor(Math.random() * 10) + 1;
		const b = Math.floor(Math.random() * 10) + 1;

		this.expression = new Expression(`${a} ${Operator.ADDITION} ${b}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		this.answers.add(new Answer((this.result.add(1)).toLatex(), false));
		this.answers.add(new Answer((this.result.sub(1)).toLatex(), false));
	}
}

export class SottrazioneEx extends Exercise {
	expression: Expression;
	result: Number;
	
	constructor() {
		super(3);
	}

	generateQuestion() {
		const a = Math.floor(Math.random() * 10) + 1;
		const b = Math.floor(Math.random() * 10) + 1;

		this.expression = new Expression(`${a} ${Operator.SUBTRACTION} ${b}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		this.answers.add(new Answer((this.result.add(1)).toLatex(), false));
		this.answers.add(new Answer((this.result.sub(1)).toLatex(), false));
	}
}

export class MoltiplicazioneEx extends Exercise {
	expression: Expression;
	result: Number;
	
	constructor() {
		super(3);
	}

	generateQuestion() {
		const a = Math.floor(Math.random() * 10) + 1;
		const b = Math.floor(Math.random() * 10) + 1;

		this.expression = new Expression(`${a} ${Operator.MULTIPLICATION} ${b}`);
		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		this.answers.add(new Answer((this.result.add(1)).toLatex(), false));
		this.answers.add(new Answer((this.result.sub(1)).toLatex(), false));
	}
}

export class DivisioneEx extends Exercise {
	expression: Expression;
	result: Number;
	
	constructor() {
		super(3);
	}

	generateQuestion() {
		const a = Math.floor(Math.random() * 10) + 1;
		const b = Math.floor(Math.random() * 10) + 1;

		this.expression = new Expression(`${a} ${Operator.DIVISION} ${b}`);
		console.log(this.expression);

		this.question = new Question(`${this.expression.toLatex()}`);
	}

	generateCorrectAnswer() {
		this.result = this.expression.evaluate();
		this.answers.add(new Answer(this.result.toLatex(), true));
	}

	generateWrongAnswers() {
		this.answers.add(new Answer((this.result.add(1)).toLatex(), false));
		this.answers.add(new Answer((this.result.sub(1)).toLatex(), false));
	}
}