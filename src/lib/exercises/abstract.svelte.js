export class Exercise {
	constructor() {
        this.question = new Question();
        this.answers = [];
    }

    generateQuestion() {
        throw new Error('Abstract method not implemented');
    }

    generateCorrectAnswer() {
        throw new Error('Abstract method not implemented');
    }

    generateAnswers() {
        throw new Error('Abstract method not implemented');
    }
}

export class Question {
    constructor(textContent = '') {
        this.textContent = '$$' + textContent + '$$';
    }

    generateQuestion() {
        throw new Error('Abstract method not implemented');
    }

    equals(other) {
        return other instanceof Question && 
               this.textContent === other.textContent;
    }
}

export class Answer {
    constructor(textContent = '', isCorrect = false) {
        this.textContent = '$$' + textContent + '$$';
        this.isCorrect = isCorrect;
    }

    generateAnswer() {
        throw new Error('Abstract method not implemented');
    }

    isEqual(other) {
        return other instanceof Answer && this.textContent === other.textContent; 
    }
}

export class AnswerSet extends Set {
    constructor() {
        super();
    }

    add(answer) {
        let array = this.toArray();
        if (array.some(a => a.isEqual(answer))) return;
        super.add(answer);
    }

    remove(answer) {
        this.delete(answer);
    }

    toArray() {
        return Array.from(this);
    }

    select(n) {
        let correctAnswer = this.toArray().find(a => a.isCorrect);
        this.remove(correctAnswer);
        let selected = [correctAnswer, ...this.toArray().extract(n - 1)];
        this.add(correctAnswer);

        return selected.shuffle();
    }
}