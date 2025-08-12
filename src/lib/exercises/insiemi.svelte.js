import { Exercise, Question, Answer } from './abstract.svelte.js';

let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

Set.prototype.join = function(joiner = ', ') {
    return `${[...this].join(joiner)}`;
}

Set.prototype.sort = function() {
    return new Set([...this].sort((a, b) => parseInt(a) - parseInt(b)));
}

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
        let intersection = [...this.setA].filter(x => this.setB.has(x)).sort().join();
        intersection = intersection.length > 0 ? `\\{${intersection}\\}` : '\\emptyset';
        this.answers.push(new Answer(intersection, true));
    }

	generateAnswers() {
		this.answers = []

        this.generateCorrectAnswer();

        let wrongAnswers = [];

        // for (let i = 0; i < 3; i++) {
        //     let setA = new Set([...this.setA]);
        //     let setB = new Set([...this.setB]);
        //     let nA = Math.floor(Math.random() * 10) + 1;
        //     let nB = Math.floor(Math.random() * 10) + 1;
        //     setA.add(nums.pop());
        //     setB.add(nums.pop());
        //     wrongAnswers.push(new Answer(`\\{${[...setA].filter(x => setB.has(x)).sort().join(', ')}\\}`, false));
        // }
	}
}