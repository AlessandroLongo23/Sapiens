import { Exercise } from './abstract.svelte.js';

export class PotenzaExSameBase extends Exercise {
	constructor(n) {
		super();

		this.n = n;
		this.base = Math.floor(Math.random() * 9) + 2;
		this.exponents = Array.from({ length: n }, () => Math.floor(Math.random() * 5) + 2);

		let formula = '';
		for (let i = 0; i < this.n; i++) {
			formula += `${this.base}^${this.exponents[i]}`;
			if (i < this.n - 1) {
				if (Math.random() < 0.5) {
					formula += ' \\cdot ';
				} else {
					formula += ' : ';
				}
			}
		}

		this.formula = '$$' + formula + '$$';
	}
}

export class PotenzaExSameExponent extends Exercise {
	constructor(n) {
		super();

		this.n = n;
		this.exponent = Math.floor(Math.random() * 9) + 2;
		this.bases = Array.from({ length: n }, () => Math.floor(Math.random() * 9) + 2);

		let formula = '';
		for (let i = 0; i < this.n; i++) {
			formula += `${this.bases[i]}^${this.exponent}`;
			if (i < this.n - 1) {
				if (Math.random() < 0.5) {
					formula += ' \\cdot ';
				} else {
					formula += ' : ';
				}
			}
		}

		this.formula = '$$' + formula + '$$';
	}
}

export class PotenzaExGeneral extends Exercise {
	constructor(n) {
		super();

		this.n = n;

		let formula = '';
		for (let i = 0; i < this.n; i++) {
			const base = Math.floor(Math.random() * 9) + 2;
			const exponent = Math.floor(Math.random() * 9) + 2;
			formula += `${base}^${exponent}`;
			if (i < this.n - 1) {
				const operators = [' \\cdot ', ' : '];
				formula += operators[Math.floor(Math.random() * operators.length)];
			}
		}
		this.formula = '$$' + formula + '$$';
	}
}