import '@/lib/utils/prototypes';

export class Exercise {
    question: Question;
    answers: AnswerSet;
    options: Answer[] = [];

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
    /** Set by v2 generators (through the legacy adapter): the instruction and the bare problem, so the page can lay them out. */
    prompt?: string;
    problem?: string;

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

/**
 * The answer options of an exercise, whatever generation of generator built it.
 * Newer generators fill `options` through the base class; the older ones
 * (insiemi, monomi operazioni, equazioni di primo grado, espressioni con
 * frazioni) override `generateAnswers` and keep an array in `answers`.
 * Returns at most `n` options with the correct one always included.
 */
export function optionsOf(exercise: Exercise, n = 4): Answer[] {
    if (Array.isArray(exercise.options) && exercise.options.length > 0) return exercise.options;
    const raw: unknown = exercise.answers;
    const all: Answer[] = Array.isArray(raw)
        ? raw
        : raw instanceof Set
            ? Array.from(raw as Set<Answer>)
            : [];
    if (all.length <= n) return all;
    const correct = all.find((a) => a.isCorrect);
    const wrong = all.filter((a) => a !== correct).slice(0, correct ? n - 1 : n);
    const picked = correct ? [correct, ...wrong] : wrong;
    return picked.shuffle ? picked.shuffle() : picked;
}

export class AnswerSet extends Set {
    constructor() {
        super();
    }

    override add(answer: Answer): this {
        const array = this.toArray();
        if (array.some(a => a.isEqual(answer))) return this;
        super.add(answer);
        return this;
    }

    remove(answer: Answer): void {
        this.delete(answer);
    }

    toArray(): Answer[] {
        return Array.from(this);
    }

    select(n: number): Answer[] {
        const correctAnswer = this.toArray().find(a => a.isCorrect);
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