import { Exercise, Question, Answer } from '$lib/exercises/abstract.svelte.js';

export class GradoEx extends Exercise {
	constructor(n) {
		super();

		this.generateQuestion(n);
		this.generateAnswers();
	}

	generateQuestion(n) {
		const candidateVariables = ['x', 'y', 'z', 'a', 'b', 'c'];
		const numberOfVariables = Math.floor(Math.random() * 3) + 1; 

		
		const variables = [];
		while (variables.length < numberOfVariables) {
			const v = candidateVariables[Math.floor(Math.random() * candidateVariables.length)];
			if (!variables.includes(v)) variables.push(v);
		}

		
		this.coefficient = Math.floor(Math.random() * 9) + 1;

		
		this.exponents = variables.map(() => Math.floor(Math.random() * 5) + 1); 

		
		this.degree = this.exponents.reduce((sum, e) => sum + e, 0);

		
		let monomial = this.coefficient === 1 ? '' : String(this.coefficient);
		for (let i = 0; i < variables.length; i++) {
			const variable = variables[i];
			const exponent = this.exponents[i];
			if (exponent === 1) {
				monomial += variable;
			} else {
				monomial += `${variable}^{${exponent}}`;
			}
		}

		this.question = new Question(monomial);
    }

	generateAnswers() {
		const answersSet = new Set();

		answersSet.add(this.generateCorrectAnswer());

		
		const wrongNumbers = new Set();
		const targetWrongCount = 3;
		while (wrongNumbers.size < targetWrongCount) {
			const deltas = [-2, -1, 1, 2, 3];
			const delta = deltas[Math.floor(Math.random() * deltas.length)];
			const candidate = this.degree + delta;
			if (candidate >= 1 && candidate !== this.degree) wrongNumbers.add(candidate);
		}

		for (const wrong of wrongNumbers) {
			answersSet.add(new Answer(wrong, false));
		}

		this.answers = Array.from(answersSet);
		this.answers.shuffle();
	}

	generateCorrectAnswer() {
		return new Answer(this.degree, true);
    }
}