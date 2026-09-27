import { divisionTable, factorize, factorsLatex } from '@/lib/exercises/v2/naturali';
import { fail, type Outcome } from './types';
import { q } from '@/lib/exercises/v2/rational';
import { decimal, intTex, intText, parseNatural } from './numbers';

/**
 * Prime factorisation of one whole number, the way the lesson does it: the division column (the number on the left,
 * its smallest prime divisor on the right, down to 1), then the equal factors gathered into powers.
 */

const MAX = 1e12;

/** Why each small prime divides the number, with the divisibility rules of the lesson. */
function criterion(p: number): string {
	if (p === 2) return 'il numero è pari';
	if (p === 3) return 'la somma delle cifre è divisibile per 3';
	if (p === 5) return "l'ultima cifra è 0 o 5";
	if (p === 11) return 'la differenza tra la somma delle cifre di posto dispari e quella delle cifre di posto pari è divisibile per 11';
	return '';
}

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

export function scomposizione(input: string): Outcome {
	if (!input.trim()) return fail('Scrivi un numero intero positivo, per esempio 360.');
	const n = parseNatural(input, MAX);
	if (n === null) return fail('Scrivi un numero intero positivo, fino a mille miliardi (10^12), senza virgola.');
	if (n === 0) return fail('Lo zero non si scompone in fattori primi: è multiplo di ogni numero, quindi non ha una scomposizione. Prova con un numero maggiore di zero.');
	if (n === 1)
		return {
			ok: true,
			result: '$1$ non ha fattori primi',
			copy: '1',
			steps: ['Ricorda che 1 non è un numero primo: un numero primo ha esattamente due divisori, 1 e sé stesso, mentre 1 ne ha uno solo. Per questo 1 non ha fattori primi e non si scompone.']
		};

	const fs = factorize(n);
	const nTex = intTex(n);

	if (fs.length === 1 && fs[0][1] === 1) {
		const root = Math.floor(Math.sqrt(n));
		const rootTex = decimal(q(Math.round(Math.sqrt(n) * 10), 10), 1).tex;
		const tried = primesUpTo(Math.min(root, 30));
		const list = tried.map(String).join(', ');
		const tries =
			root < 2
				? `Un numero così piccolo ha come divisori solo 1 e sé stesso.`
				: root <= 30
					? `Prova a dividere $${nTex}$ per i numeri primi fino a $\\sqrt{${nTex}} \\approx ${rootTex}$, cioè ${list}: nessuno lo divide.`
					: `Prova a dividere $${nTex}$ per i numeri primi fino a $\\sqrt{${nTex}} \\approx ${rootTex}$ (${list} e così via): nessuno lo divide.`;
		return {
			ok: true,
			result: `$${nTex}$ è un numero primo`,
			copy: intText(n),
			steps: [
				tries,
				'Basta arrivare alla radice quadrata: se il numero avesse un divisore più grande, avrebbe anche un divisore più piccolo, che avresti già trovato.',
				`Quindi $${nTex}$ ha come divisori solo 1 e sé stesso: è primo, e la sua scomposizione è $${nTex}$ stesso.`
			]
		};
	}

	const steps = [`Scrivi $${nTex}$ a sinistra di una linea verticale. Dividi per il più piccolo numero primo che lo divide, scrivi il primo a destra e il quoziente sotto; ripeti finché arrivi a 1: $$${divisionTable(n)}$$`];
	let m = n;
	for (const [p, e] of fs) {
		const why = criterion(p);
		const chain: string[] = [];
		for (let i = 0; i < e; i++) {
			chain.push(`${intTex(m)} : ${intTex(p)} = ${intTex(m / p)}`);
			m /= p;
		}
		const shown = chain.length > 4 ? [...chain.slice(0, 2), '\\ldots', chain[chain.length - 1]] : chain;
		const times = e === 1 ? 'una volta' : `${e} volte`;
		steps.push(`Dividi per ${intText(p)}${why ? ` (${why})` : ''}: $${shown.join(',\\ ')}$. Il fattore ${intText(p)} compare ${times}, quindi scrivi $${factorsLatex([[p, e]])}$.`);
	}
	const powers = fs.map(([p, e]) => intTex(p ** e));
	steps.push(`Scrivi il numero come prodotto delle potenze: $${nTex} = ${factorsLatex(fs)}$.`);
	if (fs.length > 1) steps.push(`Controlla moltiplicando le potenze: $${powers.join(' \\cdot ')} = ${nTex}$.`);

	return { ok: true, result: `$${nTex} = ${factorsLatex(fs)}$`, copy: `${intText(n)} = ${factorsText(fs)}`, steps };
}
