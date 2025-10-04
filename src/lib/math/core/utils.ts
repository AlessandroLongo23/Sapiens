import { Number } from "$lib/math/algebra/Number";

export const gcd = (a: number | Number, b: number | Number): Number => {
	if (typeof a === 'number') a = new Number(a);
	if (typeof b === 'number') b = new Number(b);
	return b.value === 0 ? a : gcd(b, a.value % b.value);
}

export const gcdArray = (arr: number[] | Number[]): Number => {
	const numbers: Number[] = typeof arr[0] === 'number' 
		? (arr as number[]).map(n => new Number(n))
		: arr as Number[];

	if (numbers.length === 0) {
		return new Number(0);
	}

	return numbers.reduce((acc, val) => gcd(acc, val), numbers[0]) as Number;
}

export const sumArray = (arr: number[] | Number[]): Number => {
	const numbers: Number[] = typeof arr[0] === 'number' 
		? (arr as number[]).map(n => new Number(n))
		: arr as Number[];
	return numbers.reduce((acc, val) => Number.add(acc, val), new Number(0));
}

export const productArray = (arr: number[] | Number[]): Number => {
	const numbers: Number[] = typeof arr[0] === 'number' 
		? (arr as number[]).map(n => new Number(n))
		: arr as Number[];
	return numbers.reduce((acc, val) => Number.mul(acc, val), new Number(1));
}

export const lcm = (a: number | Number, b: number | Number): Number => {
	if (typeof a === 'number') a = new Number(a);
	if (typeof b === 'number') b = new Number(b);
	return new Number((a.value * b.value) / gcd(a, b).value);
}

export const lcmArray = (arr: number[] | Number[]): Number => {
	const numbers: Number[] = typeof arr[0] === 'number' 
		? (arr as number[]).map(n => new Number(n))
		: arr as Number[];

	if (numbers.length === 0) {
		return new Number(0);
	}
	return numbers.reduce((acc, val) => lcm(acc, val), numbers[0]) as Number;
}

export const cube = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(n.value).pow(3);
}

export const sqrt = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(Math.sqrt(n.value));
}

export const isPrime = (n: number | Number): boolean => {
	if (typeof n === 'number') n = new Number(n);
	for (let i = 2; i <= floor(sqrt(n)).value; i++) {
		if (n.value % i === 0) {
			return false;
		}
	}
	return true;
}

export const floor = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(Math.floor(n.value));
}

export const ceil = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(Math.ceil(n.value));
}

export const round = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(Math.round(n.value));
}

export const abs = (n: number | Number): Number => {
	if (typeof n === 'number') n = new Number(n);
	return new Number(Math.abs(n.value));
}
