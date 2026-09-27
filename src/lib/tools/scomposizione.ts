import { factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { fail, type Outcome, type Step } from './types';
import { q } from '@/lib/exercises/v2/rational';
import { decimal, intTex, intText, parseNatural } from './numbers';

/**
 * Prime factorisation of one whole number, the way the lesson does it: divide by the smallest prime that divides the
 * number, one prime at a time, down to 1; then the division column as a table, and the equal factors gathered into
 * powers. A prime number gets the trial divisions up to its square root, with their remainders.
 */

const MAX = 1e12;
/** Divisions shown in full for one prime; beyond, the first and last ones with a gap between. */
const MAX_LINES = 6;
/** Primes tried in the table of a prime number; beyond, a row of dots. */
const MAX_TRIED = 30;

/** "2^3 · 3^2 · 5", for copying. */
export function factorsText(fs: [number, number][]): string {
	return fs.map(([p, e]) => (e === 1 ? intText(p) : `${intText(p)}^${e}`)).join(' · ');
}

/** Primes up to `limit`, for the steps on a prime number. */
function primesUpTo(limit: number): number[] {
	const out: number[] = [];
	for (let n = 2; n <= limit; n++) if (out.every((p) => n % p !== 0)) out.push(n);
	return out;
}

const digitSum = (n: number) => [...String(n)].reduce((s, d) => s + Number(d), 0);

/** The sentence of the step that divides `m` by `p`: why `p` divides it, with the divisibility rule of the lesson. */
function divideSay(m: number, p: number): string {
	const mt = intTex(m);
	if (m === p) return `$${mt}$ è primo: dividilo per sé stesso.`;
	if (p === 2) return `$${mt}$ è pari: dividi per $2$ finché puoi.`;
	if (p === 3) return `La somma delle cifre di $${mt}$ è $${digitSum(m)}$: dividi per $3$.`;
	if (p === 5) return `$${mt}$ finisce con ${m % 10 === 0 ? '$0$' : '$5$'}: dividi per $5$.`;
	return `Il più piccolo primo che divide $${mt}$ è $${p}$: dividi per $${p}$.`;
}

export function scomposizione(input: string): Outcome {
	if (!input.trim()) return fail('Scrivi un numero intero positivo, per esempio 360.');
	const n = parseNatural(input, MAX);
	if (n === null) return fail('Scrivi un numero intero positivo senza virgola, fino a mille miliardi, per esempio 360.');
	if (n === 0) return fail('Lo zero non si scompone in fattori primi, perché è multiplo di ogni numero. Scrivi un numero maggiore di zero, per esempio 360.');
	if (n === 1)
		return {
			ok: true,
			rows: [{ label: 'Fattori primi di 1', value: 'nessuno: $1$ non si scompone' }],
			copy: '1',
			steps: [
				{
					say: 'Ricorda che $1$ non è un numero primo.',
					then: 'Un numero primo ha esattamente due divisori, $1$ e sé stesso. Il numero $1$ ne ha uno solo, quindi non ha fattori primi.'
				}
			]
		};

	const nTex = intTex(n);
	const fs = factorize(n);
	if (fs.length === 1 && fs[0][1] === 1) return prime(n);

	// One step per prime: the divisions, the new quotient marked.
	const steps: Step[] = [];
	const column: string[][] = [];
	let m = n;
	for (const [p, e] of fs) {
		const say = divideSay(m, p);
		const lines: string[] = [];
		for (let i = 0; i < e; i++) {
			lines.push(`${intTex(m)} : ${p} = \\hl{${intTex(m / p)}}`);
			column.push([`$${intTex(m)}$`, `$${p}$`]);
			m /= p;
		}
		const shown = lines.length > MAX_LINES ? [...lines.slice(0, 2), '\\vdots', ...lines.slice(-2)] : lines;
		const count = e === 1 ? 'una volta' : `$${e}$ volte`;
		steps.push({ say, math: shown, then: `Il fattore $${p}$ compare ${count}${e > 1 ? `: scrivi $${p}^{${e}}$.` : '.'}` });
	}
	column.push(['$1$', '']);
	const factors = factorsLatex(fs);
	steps.push({ say: 'Metti in colonna tutte le divisioni.', table: { head: ['Numero', 'Divisore primo'], rows: column } });
	steps.push({ say: 'Scrivi il numero come prodotto di potenze.', math: [`${nTex} = \\hl{${factors}}`] });
	if (fs.length > 1 || fs[0][1] > 1) {
		// The powers, then one product per line, left to right.
		const powers = fs.map(([p, e]) => intTex(p ** e));
		const chain = [powers.join(' \\cdot ')];
		let acc = fs[0][0] ** fs[0][1];
		for (let i = 1; i < fs.length; i++) {
			acc *= fs[i][0] ** fs[i][1];
			chain.push([intTex(acc), ...powers.slice(i + 1)].join(' \\cdot '));
		}
		if (chain[0] === factors) chain.shift();
		chain[chain.length - 1] = `\\hl{${chain[chain.length - 1]}}`;
		const check = [`${factors} = ${chain[0]}`, ...chain.slice(1).map((c) => `= ${c}`)];
		steps.push({ say: 'Controlla: moltiplica le potenze.', math: check, then: `Ritrovi $${nTex}$: la scomposizione è giusta.` });
	}
	if (steps.length > 5) {
		steps[0].group = 'Le divisioni';
		steps[fs.length].group = 'La scomposizione';
	}

	return { ok: true, rows: [{ label: `Scomposizione di ${intText(n)}`, value: `$${nTex} = ${factors}$` }], copy: `${intText(n)} = ${factorsText(fs)}`, steps };
}

/** A prime number: try the primes up to its square root, and none leaves remainder 0. */
function prime(n: number): Outcome {
	const nTex = intTex(n);
	const rows = [{ label: `Scomposizione di ${intText(n)}, che è un numero primo`, value: `$${nTex}$` }];
	const root = Math.floor(Math.sqrt(n));
	if (root < 2)
		return {
			ok: true,
			rows,
			copy: intText(n),
			steps: [{ say: `I divisori di $${nTex}$ sono solo $1$ e $${nTex}$.`, then: `Quindi $${nTex}$ è un numero primo, e la sua scomposizione è $${nTex}$ stesso.` }]
		};
	const rootTex = decimal(q(Math.round(Math.sqrt(n) * 10), 10), 1).tex;
	const tried = primesUpTo(Math.min(root, MAX_TRIED));
	const more = root > MAX_TRIED;
	const table = tried.map((p) => [`$${p}$`, `$${n % p}$`]);
	if (more) table.push(['$\\vdots$', '$\\vdots$']);
	return {
		ok: true,
		rows,
		copy: intText(n),
		steps: [
			{
				say: 'Calcola fino a dove provare i divisori.',
				math: [`\\sqrt{${nTex}} \\approx \\hl{${rootTex}}`],
				then: `Basta provare i numeri primi fino a $${rootTex}$: un divisore più grande ne avrebbe accanto uno più piccolo.`
			},
			{
				say: `Dividi $${nTex}$ per ogni numero primo e guarda il resto.`,
				table: { head: ['Divisore primo', 'Resto'], rows: table },
				then: more ? `Continua così fino a $${intTex(root)}$: nessun resto è $0$.` : 'Nessun resto è $0$: nessuno di questi primi divide il numero.'
			},
			{ say: `$${nTex}$ ha come divisori solo $1$ e sé stesso.`, then: `Quindi $${nTex}$ è un numero primo, e la sua scomposizione è $${nTex}$ stesso.` }
		]
	};
}
