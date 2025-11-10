import { Exercise, Question, Answer } from './abstract.svelte.js';

let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const setUnion = (A, B) => new Set([...A, ...B]);
const setIntersection = (A, B) => new Set([...A].filter(x => B.has(x)));
const setDifference = (A, B) => new Set([...A].filter(x => !B.has(x)));
const setEquals = (A, B) => A.size === B.size && [...A].every(v => B.has(v));
const toSortedArray = (S) => [...S].sort((a, b) => parseInt(a) - parseInt(b));
const formatSetLatex = (S) => {
    const arr = toSortedArray(S);
    return arr.length > 0 ? `\\{${arr.join()}\\}` : '\\emptyset';
};

export class IntersezioneEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.setA = new Set();
        this.setB = new Set();
        let nA = Math.floor(Math.random() * 10) + 1;
        let nB = Math.floor(Math.random() * 10) + 1;
        let temp = [...nums];
        temp.shuffle();
        for (let i = 0; i < nA; i++) {
            this.setA.add(temp.pop());
        }
        temp = [...nums];
        temp.shuffle();
        for (let i = 0; i < nB; i++) {
            this.setB.add(temp.pop()); 
        }

        this.question = new Question(`A = \\{${this.setA.sort().join()}\\}\\\\B = \\{${this.setB.sort().join()}\\}\\\\A \\cap B = `);
	}

    generateCorrectAnswer() {
        let intersection = setIntersection(this.setA, this.setB).sort().join();
        intersection = intersection.length > 0 ? `\\{${intersection}\\}` : '\\emptyset';
        this.answers.push(new Answer(intersection, true));
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

		let wrongAnswers = new Map();

		
		const intersection = setIntersection(this.setA, this.setB);
		const union = setUnion(this.setA, this.setB);
		const diffAB = setDifference(this.setA, this.setB);
		const diffBA = setDifference(this.setB, this.setA);

		
		if (!setEquals(intersection, union)) {
			wrongAnswers.set('union', new Answer(formatSetLatex(union), false));
		}
		
		if (!setEquals(intersection, diffAB)) {
			wrongAnswers.set('diffAB', new Answer(formatSetLatex(diffAB), false));
		}
		
		if (!setEquals(intersection, diffBA)) {
			wrongAnswers.set('diffBA', new Answer(formatSetLatex(diffBA), false));
		}
		
		if (intersection.size > 0) {
			const arr = [...intersection];
			const removed = new Set(arr.slice(1));
			if (!setEquals(intersection, removed)) {
				wrongAnswers.set('minusOne', new Answer(formatSetLatex(removed), false));
			}
		}
		
		const candidates = toSortedArray(setDifference(union, intersection));
		if (candidates.length > 0) {
			const added = new Set([...intersection, candidates[0]]);
			wrongAnswers.set('plusOne', new Answer(formatSetLatex(added), false));
		}

		this.answers.push(...Array.from(wrongAnswers.values()).shuffle().slice(0, 3));
	}
}

export class UnioneEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
        this.answers.shuffle();
	}

	generateQuestion() {
        this.setA = new Set();
        this.setB = new Set();
        let nA = Math.floor(Math.random() * 10) + 1;
        let nB = Math.floor(Math.random() * 10) + 1;
        let temp = [...nums];
        temp.shuffle();
        for (let i = 0; i < nA; i++) {
            this.setA.add(temp.pop());
        }
        temp = [...nums];
        temp.shuffle();
        for (let i = 0; i < nB; i++) {
            this.setB.add(temp.pop()); 
        }

        this.question = new Question(`A = \\{${this.setA.sort().join()}\\}\\\\B = \\{${this.setB.sort().join()}\\}\\\\A \\cup B = `);
	}

    generateCorrectAnswer() {
        let union = setUnion(this.setA, this.setB).sort().join();
        union = union.length > 0 ? `\\{${union}\\}` : '\\emptyset';
        this.answers.push(new Answer(union, true));
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

		let wrongAnswers = new Map();

		const union = new Set([...this.setA, ...this.setB]);
		const intersection = new Set([...this.setA].filter(x => this.setB.has(x)));
		const diffAB = new Set([...this.setA].filter(x => !this.setB.has(x)));
		const diffBA = new Set([...this.setB].filter(x => !this.setA.has(x)));

		
		if (!setEquals(union, intersection)) {
			wrongAnswers.set('intersection', new Answer(formatSetLatex(intersection), false));
		}
		
		if (!setEquals(union, diffAB)) {
			wrongAnswers.set('diffAB', new Answer(formatSetLatex(diffAB), false));
		}
		
		if (!setEquals(union, diffBA)) {
			wrongAnswers.set('diffBA', new Answer(formatSetLatex(diffBA), false));
		}
		
		if (union.size > 0) {
			const uArr = toSortedArray(union);
			const removed = new Set(uArr.slice(1));
			if (!setEquals(union, removed)) {
				wrongAnswers.set('minusOne', new Answer(formatSetLatex(removed), false));
			}
		}

		this.answers.push(...Array.from(wrongAnswers.values()).shuffle().slice(0, 3));
	}
}


export class DifferenzaEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
		this.answers.shuffle();
	}

	generateQuestion() {
		this.setA = new Set();
		this.setB = new Set();
		let nA = Math.floor(Math.random() * 10) + 1;
		let nB = Math.floor(Math.random() * 10) + 1;
		let temp = [...nums];
		temp.shuffle();
		for (let i = 0; i < nA; i++) {
			this.setA.add(temp.pop());
		}
		temp = [...nums];
		temp.shuffle();
		for (let i = 0; i < nB; i++) {
			this.setB.add(temp.pop()); 
		}

		this.question = new Question(`A = \\{${this.setA.sort().join()}\\}\\\\B = \\{${this.setB.sort().join()}\\}\\\\A \\smallsetminus B = `);
	}

	generateCorrectAnswer() {
		const diff = setDifference(this.setA, this.setB).sort();
		this.answers.push(new Answer(formatSetLatex(diff), true));
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();

		let wrongAnswers = new Map();

		const correct = setDifference(this.setA, this.setB);
		const swapped = setDifference(this.setB, this.setA);
		const inter = setIntersection(this.setA, this.setB);
		const union = setUnion(this.setA, this.setB);

		
		if (!setEquals(correct, swapped)) wrongAnswers.set('swapped', new Answer(formatSetLatex(swapped), false));
		
		if (!setEquals(correct, inter)) wrongAnswers.set('inter', new Answer(formatSetLatex(inter), false));
		
		if (!setEquals(correct, union)) wrongAnswers.set('union', new Answer(formatSetLatex(union), false));
		
		if (correct.size > 0) {
			const arr = toSortedArray(correct);
			const removed = new Set(arr.slice(1));
			if (!setEquals(correct, removed)) wrongAnswers.set('minusOne', new Answer(formatSetLatex(removed), false));
		}

		this.answers.push(...Array.from(wrongAnswers.values()).shuffle().slice(0, 3));
	}
}

export class EspressioneEx extends Exercise {
	constructor() {
		super();

		this.generateQuestion();
		this.generateAnswers();
		this.answers.shuffle();
	}

	generateQuestion() {
		
		this.setA = new Set();
		this.setB = new Set();
		this.setC = new Set();
		let nA = Math.floor(Math.random() * 10) + 1;
		let nB = Math.floor(Math.random() * 10) + 1;
		let nC = Math.floor(Math.random() * 10) + 1;
		let temp;

		temp = [...nums]; temp.shuffle(); for (let i = 0; i < nA; i++) this.setA.add(temp.pop());
		temp = [...nums]; temp.shuffle(); for (let i = 0; i < nB; i++) this.setB.add(temp.pop());
		temp = [...nums]; temp.shuffle(); for (let i = 0; i < nC; i++) this.setC.add(temp.pop());

		
		const exprs = [
			'(A \\cup B) \\smallsetminus C',
			'A \\cap (B \\smallsetminus C)',
			'B \\cap (C \\smallsetminus A)',
			'(A \\cap B) \\cup C',
			'(A \\smallsetminus B) \\cup C',
			'(A \\cap (B \\cup C))'
		];
		this.expression = exprs.random();

		this.question = new Question(
			`A = \\{${this.setA.sort().join()}\\}\\\\` +
			`B = \\{${this.setB.sort().join()}\\}\\\\` +
			`C = \\{${this.setC.sort().join()}\\}\\\\` +
			`${this.expression} = `
		);
	}

	evalExpression() {
		const A = this.setA, B = this.setB, C = this.setC;
		switch (this.expression) {
			case '(A \\cup B) \\smallsetminus C':
				return setDifference(setUnion(A, B), C);
			case 'A \\cap (B \\smallsetminus C)':
				return setIntersection(A, setDifference(B, C));
			case 'B \\cap (C \\smallsetminus A)':
				return setIntersection(B, setDifference(C, A));
			case '(A \\cap B) \\cup C':
				return setUnion(setIntersection(A, B), C);
			case '(A \\smallsetminus B) \\cup C':
				return setUnion(setDifference(A, B), C);
			case '(A \\cap (B \\cup C))':
				return setIntersection(A, setUnion(B, C));
			default:
				return new Set();
		}
	}

	generateCorrectAnswer() {
		const result = this.evalExpression().sort();
		this.answers.push(new Answer(formatSetLatex(result), true));
	}

	generateAnswers() {
		this.answers = []

		this.generateCorrectAnswer();

		let wrongAnswers = new Map();
		const correct = this.evalExpression();

		const A = this.setA, B = this.setB, C = this.setC;

		
		const altExprs = [
			'(A \\cap B) \\smallsetminus C', // ∩ instead of ∪
			'(A \\cup B) \\cap C', 
			'C \\smallsetminus (A \\cup B)', 
			'A \\cup (B \\smallsetminus C)', 
			'(A \\cap (B \\smallsetminus C))', 
		];

		const evalAlt = (expr) => {
			switch (expr) {
				case '(A \\cap B) \\smallsetminus C': return setDifference(setIntersection(A, B), C);
				case '(A \\cup B) \\cap C': return setIntersection(setUnion(A, B), C);
				case 'C \\smallsetminus (A \\cup B)': return setDifference(C, setUnion(A, B));
				case 'A \\cup (B \\smallsetminus C)': return setUnion(A, setDifference(B, C));
				case '(A \\cap (B \\smallsetminus C))': return setIntersection(A, setDifference(B, C));
				default: return new Set();
			}
		};

		for (const ex of altExprs) {
			const val = evalAlt(ex);
			if (!setEquals(val, correct)) {
				wrongAnswers.set(ex, new Answer(formatSetLatex(val), false));
			}
		}

		
		if (correct.size > 0) {
			const arr = toSortedArray(correct);
			const removed = new Set(arr.slice(1));
			if (!setEquals(correct, removed)) wrongAnswers.set('minusOne', new Answer(formatSetLatex(removed), false));
		}
		const pool = toSortedArray(setUnion(setUnion(A, B), C)).filter(x => !correct.has(x));
		if (pool.length > 0) {
			const added = new Set([...correct, pool[0]]);
			wrongAnswers.set('plusOne', new Answer(formatSetLatex(added), false));
		}

		this.answers.push(...Array.from(wrongAnswers.values()).shuffle().slice(0, 3));
	}
}
