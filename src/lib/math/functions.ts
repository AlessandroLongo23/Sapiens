export const gcd = (a: number, b: number): number => {
	return b === 0 ? a : gcd(b, a % b);
}

export const gcdArray = (arr: number[]): number => {
	if (arr.length === 0) {
		return 0;
	}
	return arr.reduce((acc, val) => gcd(acc, val), arr[0]);
}

export const lcm = (a: number, b: number): number => {
	return (a * b) / gcd(a, b);
}

export const lcmArray = (arr: number[]): number => {
	if (arr.length === 0) {
		return 0;
	}
	return arr.reduce((acc, val) => lcm(acc, val), arr[0]);
}

export const ceilToMultiple = (value: number, multiple: number): number => {
	return Math.ceil(value / multiple) * multiple;
}

export const floorToMultiple = (value: number, multiple: number): number => {
	return Math.floor(value / multiple) * multiple;
}

export const roundToMultiple = (value: number, multiple: number): number => {
	return Math.round(value / multiple) * multiple;
}