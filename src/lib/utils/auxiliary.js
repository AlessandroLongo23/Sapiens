export const gcd = (a, b) => {
	return b === 0 ? a : gcd(b, a % b);
}

export const gcdArray = (arr) => {
	if (arr.length === 0) {
		return 0;
	}
	return arr.reduce((acc, val) => gcd(acc, val), arr[0]);
}

export const mcm = (a, b) => {
	return (a * b) / gcd(a, b);
}

export const mcmArray = (arr) => {
	if (arr.length === 0) {
		return 0;
	}
	return arr.reduce((acc, val) => mcm(acc, val), arr[0]);
}

Array.prototype.shuffle = function() {
	return this.sort((a, b) => Math.random() - 0.5);
}