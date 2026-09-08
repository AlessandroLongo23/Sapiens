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

Array.prototype.extract = function(n) {
	if (n < 0) {
		return [];
	}
	if (n > this.length) {
		return this;
	}
	return this.shuffle().slice(0, n);
}

Set.prototype.join = function(joiner = ', ') {
    return `${[...this].join(joiner)}`;
}

Set.prototype.sort = function() {
    return new Set([...this].sort((a, b) => parseInt(a) - parseInt(b)));
}