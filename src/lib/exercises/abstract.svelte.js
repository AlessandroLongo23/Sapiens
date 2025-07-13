export class Exercise {
	constructor() {
		this.formula = '';
	}

    generateAnswers() {
        throw new Error('Abstract method not implemented');
    }
}