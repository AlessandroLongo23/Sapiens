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

export const ceilToMultiple = (value, multiple) => {
	return Math.ceil(value / multiple) * multiple;
}

export const floorToMultiple = (value, multiple) => {
	return Math.floor(value / multiple) * multiple;
}

export const roundToMultiple = (value, multiple) => {
	return Math.round(value / multiple) * multiple;
}

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this;
}

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}

Number.prototype.toHours = function() {
    let hours = Math.floor(this);
    let minutes = Math.floor((this % 1 * 60));
    return `${hours}h ${minutes}m`;
}

Number.prototype.toCurrency = function(symbol = '€') {
    return `${this.toFixed(2)} ${symbol}`;
}

Set.prototype.join = function(joiner = ', ') {
    return `${[...this].join(joiner)}`;
}

Set.prototype.sort = function() {
    return new Set([...this].sort((a, b) => parseInt(a) - parseInt(b)));
}