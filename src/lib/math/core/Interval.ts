import { Number } from "@/lib/math/algebra/Number";

export class Interval {
    left: Number;
    right: Number;
    leftClosed: boolean;
    rightClosed: boolean;

    constructor(left: Number | number, right: Number | number, leftClosed: boolean = true, rightClosed: boolean = true) {
        this.left = left instanceof Number ? left : new Number(left);
        this.right = right instanceof Number ? right : new Number(right);
        this.leftClosed = leftClosed;
        this.rightClosed = rightClosed;
    }

    static fromLatex(latex: string): Interval {
        const [left, right] = latex.split(',').map(n => new Number(n));
        const leftClosed = latex.startsWith('[');
        const rightClosed = latex.endsWith(']');
        return new Interval(left, right, leftClosed, rightClosed);
    }

    toLatex(): string {
        return `${this.leftClosed ? '[' : '('}${this.left.toLatex()}, ${this.right.toLatex()}${this.rightClosed ? ']' : ')'}`;
    }

    contains(number: Number | number): boolean {
        if (typeof number === 'number') number = new Number(number);
        if (this.leftClosed && this.rightClosed) {
            return this.left.value <= number.value && number.value <= this.right.value;
        } else if (this.leftClosed && !this.rightClosed) {
            return this.left.value <= number.value && number.value < this.right.value;
        } else if (!this.leftClosed && this.rightClosed) {
            return this.left.value < number.value && number.value <= this.right.value;
        } else {
            return this.left.value < number.value && number.value < this.right.value;
        }
    }
    
    equals(other: Interval): boolean {
        return this.left.equals(other.left) && this.right.equals(other.right) && this.leftClosed === other.leftClosed && this.rightClosed === other.rightClosed;
    }

    union(_other: Interval): Interval[] {
        // TODO: Implement this method
        throw new Error('Not implemented');
    }

    difference(_other: Interval): Interval[] {
        // TODO: Implement this method
        throw new Error('Not implemented');
    }

    intersection(_other: Interval): Interval {
        // TODO: Implement this method
        throw new Error('Not implemented');
    }
}