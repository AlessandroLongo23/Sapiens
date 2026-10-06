/**
 * Dualismo onda-particella e principio di indeterminazione. Spec: specs/exercises/chim-onda-particella.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/51-chim-onda-particella.md), each one step harder: the
 * de Broglie relation without numbers; λ = h/(mv) for an electron or a proton; the same with a unit to convert
 * (grams, picometres); the way back, to the speed or to the mass; the uncertainty principle; orbit, orbital and the
 * experiments. Constants and writing of the numbers: src/lib/exercises/v2/chim3-a.ts.
 */
import type { Generator, Rng, Sample } from '../types';
import { shuffle } from '../insiemi';
import { type Built, type Statement, H_PLANCK, M_ELECTRON, checkSample, choose, clear, generateWith, plainOpt, plainQ, redraw, roundSig, sciChoice, sciOpt, sciQ, sciTex, sciValue, statementChoice, textBlock, textOpt } from '../chim3-a';

export const ID = 'chim-onda-particella';

const M_PROTON = 1.67e-27;
const PARTICLES = [
	{ nome: 'un elettrone', gen: "dell'elettrone", kg: M_ELECTRON, exps: [5, 6] },
	{ nome: 'un protone', gen: 'del protone', kg: M_PROTON, exps: [3, 4, 5, 6] }
];
/** A speed with three figures: k/100 · 10^e m/s. */
const speed = (rng: Rng, exps: number[]) => (rng.int(100, 999) / 100) * 10 ** rng.pick(exps);

// ---------------------------------------------------------------------------
// Level 1: the de Broglie relation, no computing

export const FACTORS = [
	{ come: 'raddoppia', then: 'si dimezza' },
	{ come: 'triplica', then: 'diventa un terzo' },
	{ come: 'si dimezza', then: 'raddoppia' },
	{ come: 'diventa un terzo', then: 'triplica' }
];
/** By growing mass. */
export const BY_MASS = ['un elettrone', 'un protone', 'un atomo di elio', 'un atomo di ferro', 'un granello di polvere'];
export const SMALL = ['un elettrone', 'un protone', 'un atomo di elio'];
export const BIG = ['una pallina da tennis', 'un granello di sabbia', "un'automobile", 'un pallone da calcio', "una goccia d'acqua", 'un proiettile'];

function level1(rng: Rng): Built {
	const kind = rng.pick(['fattore', 'massa', 'onda'] as const);
	if (kind === 'fattore') {
		const f = rng.pick(FACTORS);
		const others = [...FACTORS.filter((x) => x.then !== f.then).map((x) => x.then), 'resta uguale', 'diventa quattro volte più grande'];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`La velocità di un elettrone ${f.come}. Che cosa succede alla sua lunghezza d'onda di de Broglie?`),
			solution: textOpt(f.then).latex,
			steps: [textBlock(`Nella relazione $\\lambda = h / (m\\,v)$ la velocità sta al denominatore: lunghezza d'onda e velocità sono inversamente proporzionali. Se la velocità ${f.come}, la lunghezza d'onda ${f.then}.`)],
			answer: choose(rng, textOpt(f.then), [textOpt(f.come), ...shuffle(rng, others.filter((x) => x !== f.come)).map((x) => textOpt(x))]),
			params: { case: kind, come: f.come }
		};
	}
	if (kind === 'massa') {
		const i = rng.int(0, BY_MASS.length - 2);
		const j = rng.int(i + 1, BY_MASS.length - 1);
		const longer = rng.next() < 0.5;
		const right = longer ? BY_MASS[i] : BY_MASS[j];
		const [a, b] = rng.next() < 0.5 ? [BY_MASS[i], BY_MASS[j]] : [BY_MASS[j], BY_MASS[i]];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`${a[0].toUpperCase()}${a.slice(1)} e ${b} si muovono alla stessa velocità. Quale dei due ha la lunghezza d'onda di de Broglie più ${longer ? 'lunga' : 'corta'}?`),
			solution: textOpt(right).latex,
			steps: [textBlock(`Nella relazione $\\lambda = h / (m\\,v)$ la massa sta al denominatore: a parità di velocità, chi ha la massa più piccola ha la lunghezza d'onda più lunga. La massa più piccola è quella di ${BY_MASS[i]}: la lunghezza d'onda più ${longer ? 'lunga' : 'corta'} è quella di ${right}.`)],
			answer: choose(rng, textOpt(right), [textOpt(longer ? BY_MASS[j] : BY_MASS[i]), textOpt('hanno la stessa', 'uguali', 30), textOpt("nessuno dei due ha una lunghezza d'onda", 'nessuno')]),
			params: { case: kind, a, b, longer }
		};
	}
	const right = rng.pick(SMALL);
	const others = shuffle(rng, BIG).slice(0, 3);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock('Per quale di questi oggetti il comportamento da onda si può osservare con un esperimento?'),
		solution: textOpt(right).latex,
		steps: [textBlock(`La lunghezza d'onda $\\lambda = h / (m\\,v)$ è apprezzabile solo quando la massa è piccolissima. Tra questi oggetti solo ${right} ha una massa abbastanza piccola: per gli altri la lunghezza d'onda è troppo corta per qualunque misura.`)],
		answer: choose(rng, textOpt(right), others.map((x) => textOpt(x))),
		params: { case: kind }
	};
}

// ---------------------------------------------------------------------------
// Level 2: λ = h / (m v)

function level2(rng: Rng): Built {
	const part = rng.pick(PARTICLES);
	const v = speed(rng, part.exps);
	const lam = H_PLANCK / (part.kg * v);
	if (!clear(lam)) redraw();
	return {
		prompt: "Calcola la lunghezza d'onda di de Broglie.",
		problem: textBlock(`${part.nome[0].toUpperCase()}${part.nome.slice(1)}, di massa $${sciQ(part.kg, 'kg')}$, si muove alla velocità di $${sciQ(v, 'm/s')}$. Qual è la sua lunghezza d'onda di de Broglie?`),
		solution: sciQ(lam, 'm'),
		steps: [textBlock('La relazione di de Broglie è $\\lambda = h / (m\\,v)$:'), `\\lambda = \\dfrac{${sciTex(H_PLANCK)}}{${sciTex(part.kg)} \\cdot ${sciTex(v)}} = ${sciQ(lam, 'm')}`],
		answer: sciChoice(rng, lam, [(part.kg * v) / H_PLANCK, H_PLANCK / part.kg, (H_PLANCK * v) / part.kg, lam * 10, lam / 10, lam * 100], 'm'),
		params: { case: 'calcolo', particle: part.nome, v: sciValue(v) }
	};
}

// ---------------------------------------------------------------------------
// Level 3: a unit to convert

const OBJECTS = [
	{ nome: 'Una pallina da tennis', g: 57 },
	{ nome: 'Una pallina da golf', g: 46 },
	{ nome: 'Una biglia', g: 5.2 },
	{ nome: 'Un pallone da calcio', g: 430 },
	{ nome: 'Una pallina da ping pong', g: 2.7 }
];

function level3(rng: Rng): Built {
	const kind = rng.pick(['grammi', 'picometri'] as const);
	if (kind === 'grammi') {
		const obj = rng.pick(OBJECTS);
		const v = rng.int(11, 99);
		if (v % 10 === 0) redraw();
		const kg = obj.g / 1000;
		const lam = H_PLANCK / (kg * v);
		if (!clear(lam, 2)) redraw();
		return {
			prompt: "Calcola la lunghezza d'onda di de Broglie.",
			problem: textBlock(`${obj.nome} di massa $${plainQ(obj.g, 'g')}$ si muove alla velocità di $${plainQ(v, 'm/s')}$. Qual è la sua lunghezza d'onda di de Broglie?`),
			solution: sciQ(lam, 'm', 2),
			steps: [textBlock(`La massa va in chilogrammi: $${plainQ(obj.g, 'g')} = ${sciQ(kg, 'kg', 2)}$.`), `\\lambda = \\dfrac{h}{m\\,v} = \\dfrac{${sciTex(H_PLANCK)}}{${sciTex(kg, 2)} \\cdot ${v}} = ${sciQ(lam, 'm', 2)}`],
			answer: sciChoice(rng, lam, [lam / 1000, (kg * v) / H_PLANCK, H_PLANCK / kg, lam * 1000, lam * 10], 'm', 2),
			params: { case: kind, object: obj.nome, g: obj.g, v }
		};
	}
	const v = speed(rng, [6]);
	const lam = H_PLANCK / (M_ELECTRON * v);
	const pm = lam * 1e12;
	if (!clear(pm) || pm < 100 || pm >= 1000) redraw();
	const right = roundSig(pm);
	return {
		prompt: "Calcola la lunghezza d'onda in picometri.",
		problem: textBlock(`Un elettrone, di massa $${sciQ(M_ELECTRON, 'kg')}$, si muove alla velocità di $${sciQ(v, 'm/s')}$. Qual è la sua lunghezza d'onda di de Broglie, in picometri?`),
		solution: plainQ(right, 'pm'),
		steps: [textBlock("La relazione di de Broglie dà la lunghezza d'onda in metri:"), `\\lambda = \\dfrac{${sciTex(H_PLANCK)}}{${sciTex(M_ELECTRON)} \\cdot ${sciTex(v)}} = ${sciQ(lam, 'm')}`, textBlock(`Un picometro è $10^{-12}\\,\\text{m}$: $${sciQ(lam, 'm')} = ${plainQ(right, 'pm')}$.`)],
		answer: choose(rng, plainOpt(right, 'pm'), [sciOpt(lam, 'pm'), plainOpt(roundSig(right / 1000), 'pm'), plainOpt(roundSig(right / 10), 'pm'), sciOpt(right * 1000, 'pm')]),
		params: { case: kind, v: sciValue(v) }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the way back

function level4(rng: Rng): Built {
	const kind = rng.pick(['velocita', 'massa'] as const);
	if (kind === 'velocita') {
		const pm = rng.int(100, 999);
		const lam = pm * 1e-12;
		const v = H_PLANCK / (M_ELECTRON * lam);
		if (!clear(v)) redraw();
		return {
			prompt: 'Calcola la velocità.',
			problem: textBlock(`Un elettrone, di massa $${sciQ(M_ELECTRON, 'kg')}$, ha una lunghezza d'onda di de Broglie di $${plainQ(pm, 'pm')}$. A che velocità si muove?`),
			solution: sciQ(v, 'm/s'),
			steps: [textBlock(`In metri: $${plainQ(pm, 'pm')} = ${sciQ(lam, 'm')}$.`), textBlock('Da $\\lambda = h / (m\\,v)$ si ricava $v = h / (m\\,\\lambda)$:'), `v = \\dfrac{${sciTex(H_PLANCK)}}{${sciTex(M_ELECTRON)} \\cdot ${sciTex(lam)}} = ${sciQ(v, 'm/s')}`],
			answer: sciChoice(rng, v, [H_PLANCK / (M_ELECTRON * pm), (M_ELECTRON * lam) / H_PLANCK, (H_PLANCK * lam) / M_ELECTRON, v * 10, v / 10], 'm/s'),
			params: { case: kind, pm }
		};
	}
	// A particle of unknown mass: an electron or a proton, to be recognised from the mass.
	const part = rng.pick(PARTICLES);
	const v = speed(rng, part.exps);
	const lam = roundSig(H_PLANCK / (part.kg * v));
	const m = H_PLANCK / (lam * v);
	// The mass computed back from the rounded wavelength differs from the particle's in the third figure at most.
	if (Math.abs(m / part.kg - 1) > 0.004) redraw();
	const opt = (label: string, key: string) => textOpt(label, key, 30);
	const right = part.kg === M_ELECTRON ? 'elettrone' : 'protone';
	return {
		prompt: 'Riconosci la particella.',
		problem: textBlock(`Una particella si muove alla velocità di $${sciQ(v, 'm/s')}$ e ha una lunghezza d'onda di de Broglie di $${sciQ(lam, 'm')}$. L'elettrone ha massa $${sciQ(M_ELECTRON, 'kg')}$, il protone $${sciQ(M_PROTON, 'kg')}$. Che particella è?`),
		solution: textOpt(`un ${right}`).latex,
		steps: [textBlock('Da $\\lambda = h / (m\\,v)$ si ricava la massa, $m = h / (\\lambda\\,v)$:'), `m = \\dfrac{${sciTex(H_PLANCK)}}{${sciTex(lam)} \\cdot ${sciTex(v)}} = ${sciQ(m, 'kg')}`, textBlock(`È la massa ${part.gen}.`)],
		answer: choose(rng, opt(`un ${right}`, right), [opt(`un ${right === 'elettrone' ? 'protone' : 'elettrone'}`, right === 'elettrone' ? 'protone' : 'elettrone'), opt('nessuna delle due', 'nessuna'), opt('non si può stabilire', 'indeterminata')]),
		params: { case: kind, v: sciValue(v), lam: sciValue(lam) }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the uncertainty principle

export const SCALE = [
	{ come: 'si dimezza', then: 'raddoppia' },
	{ come: 'diventa un decimo', then: 'diventa dieci volte più grande' },
	{ come: 'raddoppia', then: 'si dimezza' },
	{ come: 'diventa dieci volte più grande', then: 'diventa un decimo' }
];
export const PRINCIPLE: Statement[] = [
	{ text: 'posizione e velocità di un elettrone non si conoscono insieme con precisione arbitraria', ok: true },
	{ text: "più è precisa la posizione, più è incerta la velocità", ok: true },
	{ text: "l'indeterminazione è una proprietà dell'elettrone, non un difetto degli strumenti", ok: true },
	{ text: "per una pallina da tennis l'indeterminazione esiste, ma è troppo piccola per notarla", ok: true },
	{ text: "con strumenti abbastanza precisi l'indeterminazione si elimina", ok: false },
	{ text: 'il principio vale solo per gli elettroni, non per gli altri corpi', ok: false },
	{ text: 'la posizione di un elettrone non si può misurare in nessun modo', ok: false },
	{ text: 'più è precisa la posizione, più è precisa anche la velocità', ok: false },
	{ text: "l'elettrone di un atomo percorre un'orbita precisa, che gli strumenti non riescono a seguire", ok: false }
];

function level5(rng: Rng): Built {
	const kind = rng.pick(['calcolo', 'calcolo', 'proporzione', 'affermazione'] as const);
	if (kind === 'calcolo') {
		const k = rng.int(11, 99);
		if (k % 10 === 0) redraw();
		const dx = (k / 10) * 10 ** -rng.int(9, 11);
		const dv = H_PLANCK / (4 * Math.PI * M_ELECTRON * dx);
		if (!clear(dv, 2)) redraw();
		return {
			prompt: "Calcola l'incertezza sulla velocità.",
			problem: textBlock(`La posizione di un elettrone, di massa $${sciQ(M_ELECTRON, 'kg')}$, è nota con un'incertezza $\\Delta x = ${sciQ(dx, 'm', 2)}$. Qual è l'incertezza minima sulla sua velocità?`),
			solution: sciQ(dv, 'm/s', 2),
			steps: [textBlock("Dal principio di indeterminazione, l'incertezza minima sulla velocità è $\\Delta v = h / (4\\pi\\,m\\,\\Delta x)$:"), `\\Delta v = \\dfrac{${sciTex(H_PLANCK)}}{4\\pi \\cdot ${sciTex(M_ELECTRON)} \\cdot ${sciTex(dx, 2)}} = ${sciQ(dv, 'm/s', 2)}`],
			answer: sciChoice(rng, dv, [dv * 4 * Math.PI, (4 * Math.PI * M_ELECTRON * dx) / H_PLANCK, H_PLANCK / (4 * Math.PI * dx), dv * 2, dv * 10, dv / 10], 'm/s', 2),
			params: { case: kind, dx: sciValue(dx, 2) }
		};
	}
	if (kind === 'proporzione') {
		const f = rng.pick(SCALE);
		const others = [...SCALE.filter((x) => x.then !== f.then).map((x) => x.then), 'resta uguale'];
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`L'incertezza sulla posizione di un elettrone ${f.come}. Che cosa succede all'incertezza minima sulla sua velocità?`),
			solution: textOpt(f.then).latex,
			steps: [textBlock(`Il prodotto $\\Delta x \\cdot m\\,\\Delta v$ non può scendere sotto $h / (4\\pi)$: le due incertezze minime sono inversamente proporzionali. Se quella sulla posizione ${f.come}, quella sulla velocità ${f.then}.`)],
			answer: choose(rng, textOpt(f.then), [textOpt(f.come), ...shuffle(rng, others.filter((x) => x !== f.come)).map((x) => textOpt(x))]),
			params: { case: kind, come: f.come }
		};
	}
	const want = rng.next() < 0.6;
	const { answer, right } = statementChoice(rng, PRINCIPLE, want);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(want ? 'Quale affermazione sul principio di indeterminazione è vera?' : 'Quale affermazione sul principio di indeterminazione è sbagliata?'),
		solution: textOpt(right.text).latex,
		steps: [textBlock("Il principio dice che posizione e velocità di una particella non si possono conoscere insieme con la precisione che si vuole: se un'incertezza diminuisce, l'altra cresce. Vale per tutti i corpi, ma si nota solo per quelli di massa piccolissima, e non dipende dagli strumenti.")],
		answer,
		params: { case: kind, want }
	};
}

// ---------------------------------------------------------------------------
// Level 6: orbit, orbital and the experiments

export const ORBITAL: Statement[] = [
	{ text: "un orbitale è la regione in cui è alta la probabilità di trovare l'elettrone", ok: true },
	{ text: "un orbitale non dice che strada percorre l'elettrone", ok: true },
	{ text: "l'orbita di Bohr non può esistere, per il principio di indeterminazione", ok: true },
	{ text: 'i livelli di energia di Bohr restano validi, le orbite no', ok: true },
	{ text: "un orbitale è la traiettoria dell'elettrone attorno al nucleo", ok: false },
	{ text: "un orbitale è un'orbita di Bohr misurata con meno precisione", ok: false },
	{ text: 'i puntini con cui si disegna un orbitale sono tanti elettroni', ok: false },
	{ text: "fuori dalla superficie disegnata l'elettrone non si trova mai", ok: false }
];
export const EXPERIMENTS = {
	diffrazione: 'la diffrazione di un fascio di elettroni attraverso un cristallo',
	lamina: "le particelle alfa contro la lamina d'oro",
	fotoelettrico: "l'effetto fotoelettrico",
	catodici: 'i raggi catodici deviati da un campo elettrico'
};

function level6(rng: Rng): Built {
	const kind = rng.pick(['affermazione', 'affermazione', 'esperimento'] as const);
	if (kind === 'esperimento') {
		const opt = (k: keyof typeof EXPERIMENTS) => textOpt(EXPERIMENTS[k], k);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock('Quale esperimento ha mostrato che gli elettroni si comportano anche come onde?'),
			solution: opt('diffrazione').latex,
			steps: [textBlock("La diffrazione è un comportamento delle onde. Nel 1927 un fascio di elettroni mandato contro un cristallo diede una figura di diffrazione, con la lunghezza d'onda prevista da de Broglie.")],
			answer: choose(rng, opt('diffrazione'), [opt('lamina'), opt('fotoelettrico'), opt('catodici')]),
			params: { case: kind }
		};
	}
	const want = rng.next() < 0.6;
	const { answer, right } = statementChoice(rng, ORBITAL, want);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(want ? 'Quale affermazione su orbite e orbitali è vera?' : 'Quale affermazione su orbite e orbitali è sbagliata?'),
		solution: textOpt(right.text).latex,
		steps: [textBlock("Per il principio di indeterminazione l'elettrone non ha una traiettoria: l'orbita di Bohr non esiste. L'orbitale è la regione in cui è alta la probabilità di trovare l'elettrone, di solito il $90\\%$: non è un percorso, e i puntini con cui lo si disegna sono le posizioni possibili di un solo elettrone.")],
		answer,
		params: { case: kind, want }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimOndaParticella: Generator = {
	id: ID,
	title: 'Dualismo onda-particella e principio di indeterminazione',
	levels: {
		1: { label: 'La relazione di de Broglie, senza conti', constraints: ['proporzionalità inversa con velocità e massa'] },
		2: { label: "La lunghezza d'onda di una particella", constraints: ['λ = h/(mv), elettrone o protone, tre cifre'] },
		3: { label: 'Con le unità da convertire', constraints: ['massa in grammi (due cifre) oppure risposta in picometri'] },
		4: { label: "Dalla lunghezza d'onda alla velocità", constraints: ['v = h/(mλ) con λ in pm; elettrone o protone dalla massa'] },
		5: { label: 'Il principio di indeterminazione', constraints: ['Δv = h/(4π m Δx) a due cifre; proporzionalità inversa'] },
		6: { label: 'Orbita e orbitale', constraints: ['affermazioni vere e sbagliate; la diffrazione degli elettroni'] }
	},
	generate: generateWith(ID, LEVELS, check),
	check
};

export default chimOndaParticella;
