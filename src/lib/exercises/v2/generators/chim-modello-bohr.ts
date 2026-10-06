/**
 * Il modello atomico di Bohr. Spec: specs/exercises/chim-modello-bohr.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/49-chim-modello-bohr.md), each one step harder: orbits
 * and states; the energy of a level; the energy of a jump and of the ionisation; the wavelength of a line and its
 * series; from a line back to the level the electron started from (a pure number, also as an open answer).
 *
 * The numbers follow the lesson's procedure: the energies of the levels are those of its table, E_n = -2,18 · 10⁻¹⁸ J
 * / n² rounded to three figures; ΔE is their difference, rounded to three figures; λ = hc / ΔE with that ΔE.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, C_LIGHT, H_PLANCK, checkSample, choose, generateWith, intOpt, plainOpt, plainQ, roundSig, sciOpt, sciQ, sciTex, sciValue, textBlock, textOpt } from '../chim3-a';

export const ID = 'chim-modello-bohr';

/** The energies of the lesson's table, in units of 10⁻²² J, without the minus: LEVEL[n]. */
const LEVEL = [0, 21800, 5450, 2420, 1360, 872, 606];
const energy = (n: number) => LEVEL[n] * 1e-22;
const A0 = 52.9; // pm

/** A negative energy as an option: -5{,}45 \cdot 10^{-19}\,\text{J}, value "-5.45e-19 J". */
const negOpt = (x: number): ChoiceOption => ({ latex: `-${sciQ(x, 'J')}`, values: [`-${sciValue(x)} J`] });
const negQ = (x: number) => `-${sciQ(x, 'J')}`;

/** ΔE between two levels as the lesson computes it, in joules, and λ in nanometres from that ΔE. */
function jump(a: number, b: number) {
	const dE = roundSig(Math.abs(LEVEL[a] - LEVEL[b]) * 1e-22);
	const nm = roundSig(((H_PLANCK * C_LIGHT) / dE) * 1e9);
	return { dE, nm };
}
/** A wavelength in nanometres as an option: plain below 1000 nm, in scientific notation from there on. */
const nmOpt = (x: number) => (x < 1000 ? plainOpt(roundSig(x), 'nm') : sciOpt(x, 'nm'));
const nmQ = (x: number) => (x < 1000 ? plainQ(roundSig(x), 'nm') : sciQ(x, 'nm'));

/** Two different levels up to 6, the lower first; (1, 2) is left out where its ΔE falls on a rounding tie. */
function pair(rng: Rng, skip: string[] = ['1-2']): [number, number] {
	for (;;) {
		const a = rng.int(1, 5);
		const b = rng.int(a + 1, 6);
		if (!skip.includes(`${a}-${b}`)) return [a, b];
	}
}

// ---------------------------------------------------------------------------
// Level 1: orbits and states

export const DIRECTION = { assorbe: 'assorbe un fotone', emette: 'emette un fotone', niente: 'non scambia energia', elettrone: 'perde il suo elettrone' };
export const STATE = { fondamentale: 'nello stato fondamentale', eccitato: 'in uno stato eccitato', ione: "non è più un atomo: è uno ione", vietato: 'in uno stato che non esiste' };

function level1(rng: Rng): Built {
	const kind = rng.pick(['raggio', 'verso', 'stato'] as const);
	if (kind === 'raggio') {
		const n = rng.int(2, 6);
		const r = n * n * A0;
		const opt = (x: number) => (x < 1000 ? plainOpt(roundSig(x), 'pm') : sciOpt(x, 'pm'));
		return {
			prompt: "Calcola il raggio dell'orbita.",
			problem: textBlock(`Nel modello di Bohr la prima orbita dell'idrogeno ha raggio $${plainQ('52.9', 'pm')}$. Qual è il raggio dell'orbita con $n = ${n}$?`),
			solution: opt(r).latex,
			steps: [textBlock(`Il raggio delle orbite cresce con il quadrato di $n$: $r_n = n^2 \\cdot ${plainQ('52.9', 'pm')}$.`), `r_{${n}} = ${n}^2 \\cdot ${plainQ('52.9', 'pm')} = ${n * n} \\cdot ${plainQ('52.9', 'pm')} = ${opt(r).latex}`],
			answer: choose(rng, opt(r), [opt(n * A0), opt(A0 / (n * n)), opt(2 * n * A0), opt(A0 / n), opt(n * n * n * A0)]),
			params: { case: kind, n }
		};
	}
	if (kind === 'verso') {
		const [lo, hi] = pair(rng, []);
		const up = rng.next() < 0.5;
		const [from, to] = up ? [lo, hi] : [hi, lo];
		const key = up ? 'assorbe' : 'emette';
		const opt = (k: keyof typeof DIRECTION) => textOpt(DIRECTION[k], k);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`L'elettrone di un atomo di idrogeno passa dal livello $n = ${from}$ al livello $n = ${to}$. Che cosa fa l'atomo?`),
			solution: opt(key).latex,
			steps: [textBlock(up ? `Il livello $${to}$ ha più energia del livello $${from}$: per salire l'elettrone deve ricevere energia, e l'atomo assorbe un fotone.` : `Il livello $${to}$ ha meno energia del livello $${from}$: scendendo l'elettrone perde energia, e l'atomo la emette come un fotone.`)],
			answer: choose(rng, opt(key), (['assorbe', 'emette', 'niente', 'elettrone'] as const).filter((k) => k !== key).map(opt)),
			params: { case: kind, from, to }
		};
	}
	const n = rng.next() < 0.4 ? 1 : rng.int(2, 5);
	const key = n === 1 ? 'fondamentale' : 'eccitato';
	const opt = (k: keyof typeof STATE) => textOpt(STATE[k], k);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`L'elettrone di un atomo di idrogeno si trova nel livello $n = ${n}$. In che stato è l'atomo?`),
		solution: opt(key).latex,
		steps: [textBlock(n === 1 ? 'Il livello $n = 1$ è quello con meno energia: è lo stato fondamentale.' : `Lo stato fondamentale è quello con l'elettrone nel livello $n = 1$. Con l'elettrone nel livello $${n}$, più alto, l'atomo è in uno stato eccitato.`)],
		answer: choose(rng, opt(key), (['fondamentale', 'eccitato', 'ione', 'vietato'] as const).filter((k) => k !== key).map(opt)),
		params: { case: kind, n }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the energy of a level

function level2(rng: Rng): Built {
	const kind = rng.pick(['energia', 'energia', 'livello', 'confronto'] as const);
	const R = energy(1);
	if (kind === 'energia') {
		const n = rng.int(2, 6);
		return {
			prompt: "Calcola l'energia del livello.",
			problem: textBlock(`Qual è l'energia dell'elettrone dell'idrogeno nel livello $n = ${n}$?`),
			solution: negQ(energy(n)),
			steps: [textBlock(`L'energia del livello $n$ è $E_n = -${sciQ(R, 'J')} / n^2$:`), `E_{${n}} = -\\dfrac{${sciQ(R, 'J')}}{${n}^2} = ${negQ(energy(n))}`],
			answer: choose(rng, negOpt(energy(n)), [sciOpt(energy(n), 'J'), negOpt(R / n), negOpt(R * n * n), negOpt(R * n), sciOpt(R / n, 'J')]),
			params: { case: kind, n }
		};
	}
	if (kind === 'livello') {
		const n = rng.int(2, 6);
		return {
			prompt: 'Trova il livello.',
			problem: textBlock(`L'elettrone di un atomo di idrogeno ha energia $${negQ(energy(n))}$. In quale livello si trova?`),
			solution: `n = ${n}`,
			steps: [textBlock(`Da $E_n = -${sciQ(R, 'J')} / n^2$ si ricava $n^2$ dividendo $${sciTex(R)}$ per $${sciTex(energy(n))}$: viene $${n * n}$, quindi $n = ${n}$.`)],
			answer: choose(rng, intOpt(n), [intOpt(n * n), intOpt(n + 1), intOpt(n - 1), intOpt(n + 2), intOpt(1)]),
			params: { case: kind, n }
		};
	}
	const [lo, hi] = pair(rng, []);
	const more = rng.next() < 0.5;
	const right = more ? hi : lo;
	const opt = (n: number) => textOpt(`nel livello ${n}`, String(n));
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`In quale dei due livelli l'elettrone dell'idrogeno ha ${more ? 'più' : 'meno'} energia: $n = ${lo}$ oppure $n = ${hi}$?`),
		solution: opt(right).latex,
		steps: [textBlock(`Le energie dei livelli sono negative e crescono verso lo zero al crescere di $n$: $E_{${lo}} = ${negQ(energy(lo))}$ è minore di $E_{${hi}} = ${negQ(energy(hi))}$. L'elettrone ha ${more ? 'più' : 'meno'} energia nel livello $${right}$.`)],
		answer: choose(rng, opt(right), [opt(more ? lo : hi), textOpt('è la stessa nei due livelli', 'uguale'), textOpt('dipende dalla temperatura', 'temperatura')]),
		params: { case: kind, lo, hi, more }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the energy of a jump

function level3(rng: Rng): Built {
	const kind = rng.pick(['salto', 'salto', 'salto', 'ionizzazione'] as const);
	if (kind === 'ionizzazione') {
		const n = rng.int(1, 4);
		const R = energy(1);
		return {
			prompt: "Calcola l'energia di ionizzazione.",
			problem: textBlock(`L'elettrone di un atomo di idrogeno è nel livello $n = ${n}$. Quanta energia serve per staccarlo dall'atomo?`),
			solution: sciQ(energy(n), 'J'),
			steps: [textBlock(`Staccare l'elettrone vuol dire portarlo a $n = \\infty$, dove l'energia è zero. Nel livello $${n}$ l'energia è $${negQ(energy(n))}$:`), `\\Delta E = 0 - (${negQ(energy(n))}) = ${sciQ(energy(n), 'J')}`],
			answer: choose(rng, sciOpt(energy(n), 'J'), [negOpt(energy(n)), sciOpt(n === 1 ? R / 2 : R / n, 'J'), sciOpt(n === 1 ? R * 2 : R * n * n, 'J'), sciOpt(n === 1 ? R / 4 : R, 'J'), sciOpt(energy(n) * 10, 'J')]),
			params: { case: kind, n }
		};
	}
	const [lo, hi] = pair(rng);
	const up = rng.next() < 0.5;
	const { dE } = jump(lo, hi);
	const sum = (LEVEL[lo] + LEVEL[hi]) * 1e-22;
	const linear = Math.abs(LEVEL[1] / lo - LEVEL[1] / hi) * 1e-22; // n not squared
	return {
		prompt: "Calcola l'energia del fotone.",
		problem: textBlock(
			up
				? `L'elettrone di un atomo di idrogeno sale dal livello $n = ${lo}$ al livello $n = ${hi}$. Quanta energia ha il fotone che l'atomo assorbe?`
				: `L'elettrone di un atomo di idrogeno scende dal livello $n = ${hi}$ al livello $n = ${lo}$. Quanta energia ha il fotone che l'atomo emette?`
		),
		solution: sciQ(dE, 'J'),
		steps: [
			textBlock(`Le energie dei due livelli sono $E_{${hi}} = ${negQ(energy(hi))}$ e $E_{${lo}} = ${negQ(energy(lo))}$.`),
			textBlock("L'energia del fotone è la differenza, dal livello più alto a quello più basso:"),
			`\\Delta E = ${negQ(energy(hi))} - (${negQ(energy(lo))}) = ${sciQ(dE, 'J')}`
		],
		answer: choose(rng, sciOpt(dE, 'J'), [sciOpt(sum, 'J'), sciOpt(linear, 'J'), sciOpt(energy(lo), 'J'), sciOpt(energy(hi), 'J'), sciOpt(dE * 10, 'J')].filter((o) => Math.abs(Number(o.values[0].split(' ')[0]) / dE - 1) > 0.05)),
		params: { case: kind, lo, hi, up }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the wavelength of a line and its series

export const SERIES: Record<number, { nome: string; regione: string }> = { 1: { nome: 'Lyman', regione: 'ultravioletto' }, 2: { nome: 'Balmer', regione: 'visibile' }, 3: { nome: 'Paschen', regione: 'infrarosso' } };

function level4(rng: Rng): Built {
	const kind = rng.pick(['lambda', 'lambda', 'serie', 'confronto'] as const);
	if (kind === 'lambda') {
		const [lo, hi] = pair(rng, ['1-2', '1-3', '4-5', '4-6', '5-6']);
		const { dE, nm } = jump(lo, hi);
		const sum = (LEVEL[lo] + LEVEL[hi]) * 1e-22;
		const wrongSum = ((H_PLANCK * C_LIGHT) / sum) * 1e9;
		return {
			prompt: "Calcola la lunghezza d'onda della riga.",
			problem: textBlock(`L'elettrone di un atomo di idrogeno scende dal livello $n = ${hi}$ al livello $n = ${lo}$. Qual è la lunghezza d'onda della luce emessa?`),
			solution: nmQ(nm),
			steps: [
				textBlock(`Le energie dei due livelli sono $E_{${hi}} = ${negQ(energy(hi))}$ e $E_{${lo}} = ${negQ(energy(lo))}$, e la loro differenza è $\\Delta E = ${sciQ(dE, 'J')}$.`),
				textBlock("La lunghezza d'onda del fotone è $\\lambda = h\\,c / \\Delta E$:"),
				`\\lambda = \\dfrac{${sciTex(H_PLANCK)} \\cdot ${sciTex(C_LIGHT)}}{${sciTex(dE)}} = ${sciQ(nm * 1e-9, 'm')} = ${nmQ(nm)}`
			],
			answer: choose(rng, nmOpt(nm), [nmOpt(wrongSum), sciOpt(nm * 1e-9, 'nm'), nmOpt(nm / 10), nmOpt(nm * 10), nmOpt(((H_PLANCK * C_LIGHT) / energy(lo)) * 1e9)].filter((o) => o.values[0] !== nmOpt(nm).values[0])),
			params: { case: kind, lo, hi }
		};
	}
	if (kind === 'serie') {
		const lo = rng.int(1, 3);
		const hi = rng.int(lo + 1, 6);
		const label = (k: number, region = SERIES[k].regione) => `${SERIES[k].nome}, ${region}`;
		const opt = (k: number, region = SERIES[k].regione) => textOpt(label(k, region), `${SERIES[k].nome}-${region}`);
		const others = [1, 2, 3].filter((k) => k !== lo);
		return {
			prompt: 'Riconosci la serie.',
			problem: textBlock(`L'elettrone di un atomo di idrogeno scende dal livello $n = ${hi}$ al livello $n = ${lo}$. A quale serie appartiene la riga, e in che regione dello spettro cade?`),
			solution: opt(lo).latex,
			steps: [textBlock(`La serie dipende dal livello di arrivo: $1$ Lyman, $2$ Balmer, $3$ Paschen. Qui il livello di arrivo è $${lo}$: serie di ${SERIES[lo].nome}, nella regione ${SERIES[lo].regione === 'visibile' ? 'del visibile' : SERIES[lo].regione === 'ultravioletto' ? "dell'ultravioletto" : "dell'infrarosso"}.`)],
			answer: choose(rng, opt(lo), [opt(others[0]), opt(others[1]), opt(lo, SERIES[others[0]].regione), opt(others[0], SERIES[lo].regione)]),
			params: { case: kind, lo, hi }
		};
	}
	// Two emission jumps to the same level: which line has the shorter wavelength?
	const lo = rng.int(1, 3);
	const a = rng.int(lo + 1, 5);
	const b = rng.int(a + 1, 6);
	const shorter = rng.next() < 0.5;
	const right = shorter ? b : a;
	const opt = (hi: number) => ({ latex: `${hi} \\to ${lo}`, values: [`${hi}-${lo}`] });
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(`Nell'atomo di idrogeno, quale dei due salti dà la riga con la lunghezza d'onda più ${shorter ? 'corta' : 'lunga'}: $${a} \\to ${lo}$ oppure $${b} \\to ${lo}$?`),
		solution: opt(right).latex,
		steps: [textBlock(`Il salto $${b} \\to ${lo}$ parte da più in alto e libera più energia del salto $${a} \\to ${lo}$. Un fotone con più energia ha una lunghezza d'onda più corta: la riga con la lunghezza d'onda più ${shorter ? 'corta' : 'lunga'} è quella del salto $${right} \\to ${lo}$.`)],
		answer: choose(rng, opt(right), [opt(shorter ? a : b), textOpt('hanno la stessa', 'uguali', 30), textOpt('dipende dal gas', 'gas')]),
		params: { case: kind, lo, a, b, shorter }
	};
}

// ---------------------------------------------------------------------------
// Level 5: from the line to the level (a pure number)

function level5(rng: Rng): Built {
	const kind = rng.pick(['da-lambda', 'da-energia'] as const);
	if (kind === 'da-lambda') {
		const lo = rng.int(1, 2);
		const hi = rng.int(lo + 1, 6);
		const { nm } = jump(lo, hi);
		const photon = roundSig((H_PLANCK * C_LIGHT) / (nm * 1e-9));
		return {
			prompt: 'Trova il livello di partenza.',
			problem: textBlock(`Una riga della serie di ${SERIES[lo].nome} dell'idrogeno ha lunghezza d'onda $${nmQ(nm)}$. Da quale livello $n$ è sceso l'elettrone?`),
			solution: `n = ${hi}`,
			steps: [
				textBlock(`L'energia del fotone è $h\\,c / \\lambda = ${sciQ(photon, 'J')}$.`),
				textBlock(`Nella serie di ${SERIES[lo].nome} il livello di arrivo è il $${lo}$, con energia $${negQ(energy(lo))}$. Il livello di partenza sta più in alto dell'energia del fotone: circa $${negQ(energy(hi))}$, che è l'energia del livello $${hi}$.`)
			],
			answer: choose(rng, intOpt(hi), [intOpt(hi + 1), intOpt(hi - 1), intOpt(lo), intOpt(hi + 2), intOpt(hi * hi)]),
			params: { case: kind, lo, nm: sciValue(nm) },
			open: String(hi)
		};
	}
	let [lo, hi] = pair(rng);
	while (lo > 3) [lo, hi] = pair(rng);
	const { dE } = jump(lo, hi);
	return {
		prompt: 'Trova il livello di arrivo.',
		problem: textBlock(`Un atomo di idrogeno con l'elettrone nel livello $n = ${lo}$ assorbe un fotone di energia $${sciQ(dE, 'J')}$. In quale livello $n$ arriva l'elettrone?`),
		solution: `n = ${hi}`,
		steps: [
			textBlock(`Nel livello $${lo}$ l'energia è $${negQ(energy(lo))}$. Dopo aver assorbito il fotone l'elettrone ha energia`),
			`${negQ(energy(lo))} + ${sciQ(dE, 'J')} = ${negQ(energy(hi))}`,
			textBlock(`che è l'energia del livello $${hi}$.`)
		],
		answer: choose(rng, intOpt(hi), [intOpt(hi + 1), intOpt(hi - 1 === lo ? hi + 3 : hi - 1), intOpt(lo), intOpt(hi + 2), intOpt(lo + hi)]),
		params: { case: kind, lo, dE: sciValue(dE) },
		open: String(hi)
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimModelloBohr: Generator = {
	id: ID,
	title: 'Il modello atomico di Bohr',
	levels: {
		1: { label: 'Orbite e stati', constraints: ['raggio n² · 52,9 pm; salto in salita o in discesa; stato fondamentale o eccitato'] },
		2: { label: "L'energia di un livello", constraints: ['E_n = −2,18 · 10⁻¹⁸ J / n², n da 2 a 6'] },
		3: { label: "L'energia di un salto", constraints: ['differenza tra le energie della tabella; il salto 1-2 escluso'] },
		4: { label: "La lunghezza d'onda di una riga", constraints: ['λ = hc/ΔE a tre cifre; serie dal livello di arrivo'] },
		5: { label: 'Dalla riga al livello', constraints: ['risposta: un numero intero da 2 a 6'] }
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check
};

export default chimModelloBohr;
