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
}

export class Answer {
    constructor(textContent = '', isCorrect = false) {
        this.textContent = '$$' + textContent + '$$';
        this.isCorrect = isCorrect;
    }

    generateAnswer() {
        throw new Error('Abstract method not implemented');
    }
}