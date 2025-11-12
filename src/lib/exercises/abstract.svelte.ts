import '$lib/utils/prototypes.js';

export enum ProgressState {
    UNANSWERED = 'unanswered',
    CORRECT = 'correct',
    INCORRECT = 'incorrect',
}

export class Exercise {
    question: Question;
    answers: AnswerSet;
    options: Answer[];

	constructor(n: number) {
        this.question = new Question();
        this.answers = new AnswerSet();

        this.generateQuestion();
        this.generateAnswers(n);
    }

    generateQuestion() {
        throw new Error('Abstract method not implemented');
    }

    generateAnswers(n: number) {
		this.generateCorrectAnswer();
		this.generateWrongAnswers();
        this.options = this.answers.select(n);
    }
    
    generateCorrectAnswer(): void {
        throw new Error('Abstract method not implemented');
    }

    generateWrongAnswers(): void {
        throw new Error('Abstract method not implemented');
    }
}

export class Question {
    textContent: string;

    constructor(textContent: string = '') {
        this.textContent = '$$' + textContent + '$$';
    }
}

export class Answer {
    textContent: string;
    isCorrect: boolean;

    constructor(textContent = '', isCorrect = false) {
        this.textContent = '$$' + textContent + '$$';
        this.isCorrect = isCorrect;
    }

    isEqual(other: Answer): boolean {
        return other instanceof Answer && this.textContent === other.textContent; 
    }
}

export class AnswerSet extends Set {
    constructor() {
        super();
    }

    override add(answer: Answer): this {
        let array = this.toArray();
        if (array.some(a => a.isEqual(answer))) return;
        super.add(answer);
    }

    remove(answer: Answer): void {
        this.delete(answer);
    }

    toArray(): Answer[] {
        return Array.from(this);
    }

    select(n: number): Answer[] {
        let correctAnswer = this.toArray().find(a => a.isCorrect);
        if (!correctAnswer) {
            throw new Error('No correct answer found in the answer set');
        }
        
        this.remove(correctAnswer);
        let selected = [correctAnswer, ...this.toArray().extract(n - 1)];
        this.add(correctAnswer);
        selected = selected.shuffle();

        return selected;
    }
}