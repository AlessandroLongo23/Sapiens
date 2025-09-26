export class Integer {
    value: number;

    constructor(value: number) {
        this.value = Math.floor(value);
    }

    toString(): string {
        return this.value.toString();
    }
}