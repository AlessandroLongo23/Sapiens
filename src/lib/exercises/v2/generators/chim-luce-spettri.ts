/**
 * La luce e gli spettri atomici. Spec: specs/exercises/chim-luce-spettri.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/48-chim-luce-spettri.md), each one step harder: waves
 * and the regions of the spectrum, without numbers to compute; c = λν; the energy of a photon; a mole of photons
 * and the way back from the energy to the wavelength; the photoelectric effect; continuous and line spectra.
 * Constants and writing of the numbers: src/lib/exercises/v2/chim3-a.ts.
 */
import type { Generator, Rng, Sample } from '../types';
import { shuffle } from '../insiemi';
import { type Built, type Statement, C_LIGHT, H_PLANCK, N_AVOGADRO, checkSample, choose, clear, generateWith, plainOpt, plainQ, redraw, roundSig, sciChoice, sciOpt, sciQ, sciTex, sciValue, statementChoice, textBlock, textOpt } from '../chim3-a';

export const ID = 'chim-luce-spettri';

/** The regions of the spectrum, from the longest wavelength to the shortest, with wavelengths to show for each. */
const REGIONS: { nome: string; esempi: [string, string][] }[] = [
	{ nome: 'onde radio', esempi: [['3', 'm'], ['30', 'm'], ['300', 'm']] },
	{ nome: 'microonde', esempi: [['3', 'mm'], ['1', 'cm'], ['5', 'cm']] },
	{ nome: 'infrarosso', esempi: [['900', 'nm'], ['1500', 'nm'], ['5000', 'nm']] },
	{ nome: 'visibile', esempi: [['450', 'nm'], ['550', 'nm'], ['650', 'nm']] },
	{ nome: 'ultravioletto', esempi: [['50', 'nm'], ['150', 'nm'], ['300', 'nm']] },
	{ nome: 'raggi X', esempi: [['0.1', 'nm'], ['1', 'nm'], ['5', 'nm']] },
	{ nome: 'raggi gamma', esempi: [['0.001', 'nm'], ['0.005', 'nm']] }
];

const nm = (rng: Rng, lo = 380, hi = 780) => rng.int(lo, hi);
/** A frequency of visible light, k · 10¹² Hz with three figures. */
const visibleNu = (rng: Rng) => rng.int(400, 780) * 1e12;

// ---------------------------------------------------------------------------
// Level 1: waves and the spectrum, no computing

function level1(rng: Rng): Built {
	const kind = rng.pick(['confronto', 'regione', 'ordine'] as const);
	if (kind === 'confronto') {
		const given = rng.pick(['lunghezza', 'frequenza'] as const);
		if (given === 'lunghezza') {
			const a = nm(rng, 400, 700);
			const b = nm(rng, 400, 700);
			if (Math.abs(a - b) < 40) redraw();
			const short = Math.min(a, b);
			const opt = (x: number) => textOpt(`quella a ${x} nm`, String(x));
			return {
				prompt: 'Scegli la risposta giusta.',
				problem: textBlock(`Due luci hanno lunghezza d'onda $${plainQ(a, 'nm')}$ e $${plainQ(b, 'nm')}$. Quale ha la frequenza più alta?`),
				solution: opt(short).latex,
				steps: [textBlock(`Lunghezza d'onda e frequenza sono inversamente proporzionali, perché $c = \\lambda\\,\\nu$ e $c$ è fissa: la frequenza più alta è quella della luce con la lunghezza d'onda più corta, $${plainQ(short, 'nm')}$.`)],
				answer: choose(rng, opt(short), [opt(Math.max(a, b)), textOpt('hanno la stessa frequenza', 'uguali'), textOpt("dipende dall'intensità", 'intensita')]),
				params: { case: kind, given, a, b }
			};
		}
		const a = rng.int(400, 780);
		const b = rng.int(400, 780);
		if (Math.abs(a - b) < 40) redraw();
		const low = Math.min(a, b);
		const q = (k: number) => sciQ(k * 1e12, 'Hz');
		const opt = (k: number) => ({ latex: `\\text{quella a } ${q(k)}`, values: [String(k)] });
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Due luci hanno frequenza $${q(a)}$ e $${q(b)}$. Quale ha la lunghezza d'onda più lunga?`),
			solution: opt(low).latex,
			steps: [textBlock(`Lunghezza d'onda e frequenza sono inversamente proporzionali, perché $c = \\lambda\\,\\nu$ e $c$ è fissa: la lunghezza d'onda più lunga è quella della luce con la frequenza più bassa, $${q(low)}$.`)],
			answer: choose(rng, opt(low), [opt(Math.max(a, b)), textOpt('hanno la stessa', 'uguali', 30), textOpt("dipende dall'intensità", 'intensita')]),
			params: { case: kind, given, a, b }
		};
	}
	if (kind === 'regione') {
		const i = rng.int(0, REGIONS.length - 1);
		const [num, unit] = rng.pick(REGIONS[i].esempi);
		const near = shuffle(rng, REGIONS.map((_, k) => k).filter((k) => k !== i)).sort((x, y) => Math.abs(x - i) - Math.abs(y - i));
		return {
			prompt: 'Riconosci la regione dello spettro.',
			problem: textBlock(`A quale regione dello spettro elettromagnetico appartiene una radiazione con lunghezza d'onda $${plainQ(num, unit)}$?`),
			solution: textOpt(REGIONS[i].nome).latex,
			steps: [textBlock(`Il visibile va da $400$ a $700\\,\\text{nm}$. Sopra ci sono infrarosso (fino a $1\\,\\text{mm}$), microonde (fino a $10\\,\\text{cm}$) e onde radio; sotto, ultravioletto (fino a $10\\,\\text{nm}$), raggi X (fino a $0{,}01\\,\\text{nm}$) e raggi gamma. La regione di $${plainQ(num, unit)}$ è: ${REGIONS[i].nome}.`)],
			answer: choose(rng, textOpt(REGIONS[i].nome), near.map((k) => textOpt(REGIONS[k].nome))),
			params: { case: kind, num, unit }
		};
	}
	const what = rng.pick(['frequenza', "lunghezza d'onda"] as const);
	const three = shuffle(rng, REGIONS.map((_, k) => k)).slice(0, 3);
	// REGIONS goes from the longest wavelength to the shortest: its order is that of growing frequency.
	const byFrequency = [...three].sort((x, y) => x - y);
	const right = what === 'frequenza' ? byFrequency : [...byFrequency].reverse();
	const label = (xs: number[]) => xs.map((k) => REGIONS[k].nome).join(', ');
	const opt = (xs: number[]) => textOpt(label(xs), xs.join('-'), 26);
	const [a, b, c] = right;
	return {
		prompt: "Scegli l'elenco ordinato.",
		problem: textBlock(`Quale elenco è in ordine di ${what} crescente?`),
		solution: opt(right).latex,
		steps: [textBlock(`Dalle onde radio ai raggi gamma la lunghezza d'onda diminuisce e la frequenza cresce: onde radio, microonde, infrarosso, visibile, ultravioletto, raggi X, raggi gamma. In ordine di ${what} crescente: ${label(right)}.`)],
		answer: choose(rng, opt(right), [opt([c, b, a]), opt([b, a, c]), opt([a, c, b]), opt([c, a, b]), opt([b, c, a])]),
		params: { case: kind, what, regions: three.map((k) => REGIONS[k].nome) }
	};
}

// ---------------------------------------------------------------------------
// Level 2: c = λν

function level2(rng: Rng): Built {
	const kind = rng.pick(['frequenza', 'lunghezza'] as const);
	if (kind === 'frequenza') {
		const l = nm(rng);
		const lm = l * 1e-9;
		const nu = C_LIGHT / lm;
		if (!clear(nu)) redraw();
		return {
			prompt: 'Calcola la frequenza.',
			problem: textBlock(`Una radiazione ha lunghezza d'onda $\\lambda = ${plainQ(l, 'nm')}$. Qual è la sua frequenza?`),
			solution: sciQ(nu, 'Hz'),
			steps: [
				textBlock(`In metri: $${plainQ(l, 'nm')} = ${sciQ(lm, 'm')}$.`),
				textBlock(`Da $c = \\lambda\\,\\nu$ si ricava $\\nu = c / \\lambda$:`),
				`\\nu = \\dfrac{${sciQ(C_LIGHT, 'm/s')}}{${sciQ(lm, 'm')}} = ${sciQ(nu, 'Hz')}`
			],
			answer: sciChoice(rng, nu, [C_LIGHT / l, lm / C_LIGHT, C_LIGHT * lm, nu * 10, nu / 10], 'Hz'),
			params: { case: kind, nm: l }
		};
	}
	const nu = visibleNu(rng);
	const lam = C_LIGHT / nu;
	if (!clear(lam)) redraw();
	return {
		prompt: "Calcola la lunghezza d'onda.",
		problem: textBlock(`Una radiazione ha frequenza $\\nu = ${sciQ(nu, 'Hz')}$. Qual è la sua lunghezza d'onda?`),
		solution: sciQ(lam, 'm'),
		steps: [textBlock(`Da $c = \\lambda\\,\\nu$ si ricava $\\lambda = c / \\nu$:`), `\\lambda = \\dfrac{${sciQ(C_LIGHT, 'm/s')}}{${sciQ(nu, 'Hz')}} = ${sciQ(lam, 'm')}`, textBlock(`Sono $${plainQ(roundSig(lam * 1e9), 'nm')}$.`)],
		answer: sciChoice(rng, lam, [nu / C_LIGHT, C_LIGHT * nu, lam * 10, lam / 10, lam * 100], 'm'),
		params: { case: kind, nu: sciValue(nu) }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the energy of a photon

function level3(rng: Rng): Built {
	const kind = rng.pick(['da-frequenza', 'da-lunghezza'] as const);
	if (kind === 'da-frequenza') {
		const nu = visibleNu(rng);
		const E = H_PLANCK * nu;
		if (!clear(E)) redraw();
		return {
			prompt: "Calcola l'energia del fotone.",
			problem: textBlock(`Una luce ha frequenza $\\nu = ${sciQ(nu, 'Hz')}$. Quanta energia porta un suo fotone?`),
			solution: sciQ(E, 'J'),
			steps: [textBlock(`L'energia di un fotone è $E = h\\,\\nu$, con $h = ${sciQ(H_PLANCK, 'J} \\cdot \\text{s')}$:`), `E = ${sciTex(H_PLANCK)} \\cdot ${sciTex(nu)} = ${sciQ(E, 'J')}`],
			answer: sciChoice(rng, E, [H_PLANCK / nu, nu / H_PLANCK, E * 10, E / 10, E * 100], 'J'),
			params: { case: kind, nu: sciValue(nu) }
		};
	}
	const l = nm(rng);
	const lm = l * 1e-9;
	const E = (H_PLANCK * C_LIGHT) / lm;
	if (!clear(E)) redraw();
	return {
		prompt: "Calcola l'energia del fotone.",
		problem: textBlock(`Una luce ha lunghezza d'onda $\\lambda = ${plainQ(l, 'nm')}$. Quanta energia porta un suo fotone?`),
		solution: sciQ(E, 'J'),
		steps: [
			textBlock(`In metri: $${plainQ(l, 'nm')} = ${sciQ(lm, 'm')}$.`),
			textBlock(`L'energia del fotone è $E = h\\,c / \\lambda$:`),
			`E = \\dfrac{${sciTex(H_PLANCK)} \\cdot ${sciTex(C_LIGHT)}}{${sciTex(lm)}} = ${sciQ(E, 'J')}`
		],
		answer: sciChoice(rng, E, [(H_PLANCK * C_LIGHT) / l, (H_PLANCK * lm) / C_LIGHT, H_PLANCK * lm, E * 10, E / 10], 'J'),
		params: { case: kind, nm: l }
	};
}

// ---------------------------------------------------------------------------
// Level 4: a mole of photons, and back from the energy to the wavelength

function level4(rng: Rng): Built {
	const kind = rng.pick(['mole', 'lambda'] as const);
	if (kind === 'mole') {
		const l = nm(rng, 250, 780);
		const lm = l * 1e-9;
		const E = (H_PLANCK * C_LIGHT) / lm;
		const mole = (E * N_AVOGADRO) / 1000;
		if (!clear(mole)) redraw();
		const kJ = roundSig(mole);
		return {
			prompt: "Calcola l'energia di una mole di fotoni.",
			problem: textBlock(`Quanta energia porta una mole di fotoni con lunghezza d'onda $\\lambda = ${plainQ(l, 'nm')}$?`),
			solution: plainQ(kJ, 'kJ/mol'),
			steps: [
				textBlock(`Un fotone ha energia $E = h\\,c / \\lambda$, con $\\lambda = ${sciQ(lm, 'm')}$:`),
				`E = \\dfrac{${sciTex(H_PLANCK)} \\cdot ${sciTex(C_LIGHT)}}{${sciTex(lm)}} = ${sciQ(E, 'J')}`,
				textBlock(`Una mole sono $${sciTex(N_AVOGADRO)}$ fotoni:`),
				`${sciTex(E)} \\cdot ${sciTex(N_AVOGADRO)} = ${sciQ(E * N_AVOGADRO, 'J/mol')} = ${plainQ(kJ, 'kJ/mol')}`
			],
			answer: choose(rng, plainOpt(kJ, 'kJ/mol'), [sciOpt(E * N_AVOGADRO, 'kJ/mol'), sciOpt(E, 'kJ/mol'), sciOpt(mole / 1000, 'kJ/mol'), sciOpt(mole * 1e-9, 'kJ/mol')]),
			params: { case: kind, nm: l }
		};
	}
	// From the photon's energy to the wavelength, in nanometres.
	const l0 = nm(rng);
	const E = roundSig((H_PLANCK * C_LIGHT) / (l0 * 1e-9));
	const lam = ((H_PLANCK * C_LIGHT) / E) * 1e9;
	if (!clear(lam)) redraw();
	const right = roundSig(lam);
	const nu = E / H_PLANCK;
	return {
		prompt: "Calcola la lunghezza d'onda.",
		problem: textBlock(`Un fotone ha energia $E = ${sciQ(E, 'J')}$. Qual è la lunghezza d'onda della luce, in nanometri?`),
		solution: plainQ(right, 'nm'),
		steps: [textBlock(`Da $E = h\\,c / \\lambda$ si ricava $\\lambda = h\\,c / E$:`), `\\lambda = \\dfrac{${sciTex(H_PLANCK)} \\cdot ${sciTex(C_LIGHT)}}{${sciTex(E)}} = ${sciQ(lam * 1e-9, 'm')}`, textBlock(`In nanometri: $${plainQ(right, 'nm')}$.`)],
		answer: choose(rng, plainOpt(right, 'nm'), [sciOpt(nu, 'Hz'), plainOpt(roundSig(right / 10), 'nm'), sciOpt(lam * 1e-9, 'nm'), sciOpt(right * 10, 'nm')]),
		params: { case: kind, E: sciValue(E) }
	};
}

// ---------------------------------------------------------------------------
// Level 5: the photoelectric effect

export const INTENSITY: Statement[] = [
	{ text: 'escono più elettroni, con la stessa energia', ok: true },
	{ text: 'escono gli stessi elettroni, più veloci', ok: false },
	{ text: 'escono più elettroni, e più veloci', ok: false },
	{ text: 'non cambia niente', ok: false }
];
export const THRESHOLD = {
	si: 'sì: ogni fotone ha più energia di quella che serve',
	no: 'no: ogni fotone ha meno energia di quella che serve',
	intensa: 'sì, ma solo se la luce è molto intensa',
	tempo: "sì, ma solo dopo un tempo abbastanza lungo"
};

/** An energy of k · 10⁻²¹ J, with three figures. */
const e21 = (k: number) => k * 1e-21;

function level5(rng: Rng): Built {
	const kind = rng.pick(['soglia', 'soglia', 'cinetica', 'cinetica', 'intensita'] as const);
	if (kind === 'intensita') {
		const { answer, right } = statementChoice(rng, INTENSITY, true);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock("Una luce strappa elettroni a un metallo. Si raddoppia l'intensità della luce, senza cambiarne la frequenza. Che cosa succede?"),
			solution: textOpt(right.text).latex,
			steps: [textBlock("L'intensità è il numero dei fotoni. Ogni elettrone è strappato da un solo fotone: con più fotoni escono più elettroni, ma l'energia di ogni fotone, che dipende solo dalla frequenza, non è cambiata.")],
			answer,
			params: { case: kind }
		};
	}
	const min = rng.int(300, 700); // the least energy to pull an electron out, in 10⁻²¹ J
	if (kind === 'soglia') {
		const l = nm(rng, 250, 750);
		const E = (H_PLANCK * C_LIGHT) / (l * 1e-9);
		if (!clear(E) || Math.abs(E / e21(min) - 1) < 0.08) redraw();
		const key = E > e21(min) ? 'si' : 'no';
		const opt = (k: keyof typeof THRESHOLD) => textOpt(THRESHOLD[k], k);
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Per strappare un elettrone a un metallo servono almeno $${sciQ(e21(min), 'J')}$. Il metallo è illuminato con luce di lunghezza d'onda $${plainQ(l, 'nm')}$. Escono elettroni?`),
			solution: opt(key).latex,
			steps: [
				textBlock(`Un fotone di questa luce ha energia $E = h\\,c / \\lambda$:`),
				`E = \\dfrac{${sciTex(H_PLANCK)} \\cdot ${sciTex(C_LIGHT)}}{${sciTex(l * 1e-9)}} = ${sciQ(E, 'J')}`,
				textBlock(`È ${key === 'si' ? 'più' : 'meno'} di $${sciQ(e21(min), 'J')}$: ${key === 'si' ? 'gli elettroni escono, anche con luce debole' : 'nessun elettrone esce, per quanto intensa sia la luce e per quanto a lungo la si tenga accesa'}.`)
			],
			answer: choose(rng, opt(key), (['si', 'no', 'intensa', 'tempo'] as const).filter((k) => k !== key).map(opt)),
			params: { case: kind, min, nm: l }
		};
	}
	const photon = min + rng.int(60, 500);
	const K = photon - min;
	const digits = K >= 100 ? 3 : 2;
	return {
		prompt: "Calcola l'energia cinetica dell'elettrone.",
		problem: textBlock(`Per strappare un elettrone a un metallo servono almeno $${sciQ(e21(min), 'J')}$. Un fotone di energia $${sciQ(e21(photon), 'J')}$ colpisce il metallo e strappa un elettrone. Con quale energia cinetica esce l'elettrone?`),
		solution: sciQ(e21(K), 'J', digits),
		steps: [textBlock("L'elettrone esce con l'energia del fotone meno quella che serve per strapparlo:"), `${sciTex(e21(photon))} - ${sciTex(e21(min))} = ${sciQ(e21(K), 'J', digits)}`],
		answer: choose(rng, sciOpt(e21(K), 'J', digits), [sciOpt(e21(photon + min), 'J'), sciOpt(e21(photon), 'J'), sciOpt(e21(min), 'J')]),
		params: { case: kind, min, photon }
	};
}

// ---------------------------------------------------------------------------
// Level 6: continuous and line spectra

export const SOURCES: { text: string; kind: 'continuo' | 'emissione' | 'assorbimento' }[] = [
	{ text: 'il filamento incandescente di una lampadina', kind: 'continuo' },
	{ text: 'un pezzo di ferro rovente', kind: 'continuo' },
	{ text: 'un tubo di idrogeno rarefatto attraversato da una scarica elettrica', kind: 'emissione' },
	{ text: 'i vapori di sodio di un lampione, attraversati da una scarica elettrica', kind: 'emissione' },
	{ text: 'un sale di litio portato sulla fiamma', kind: 'emissione' },
	{ text: 'la luce bianca di una lampadina dopo che ha attraversato un gas freddo', kind: 'assorbimento' },
	{ text: 'la luce del Sole, che ha attraversato i gas più freddi della sua superficie', kind: 'assorbimento' }
];
export const KINDS = { continuo: 'continuo', emissione: 'a righe, di emissione', assorbimento: 'a righe, di assorbimento', nessuno: 'nessuno: quella luce non si separa' };

export const SPECTRA: Statement[] = [
	{ text: 'ogni elemento ha le sue righe, diverse da quelle di ogni altro', ok: true },
	{ text: "un elemento assorbe le stesse lunghezze d'onda che emette", ok: true },
	{ text: "uno spettro continuo contiene tutte le lunghezze d'onda del visibile", ok: true },
	{ text: 'le righe di un elemento sono le stesse in ogni laboratorio', ok: true },
	{ text: 'tutti gli elementi hanno le stesse righe, con intensità diverse', ok: false },
	{ text: 'le righe di un elemento cambiano con la temperatura della fiamma', ok: false },
	{ text: 'un gas rarefatto eccitato dà uno spettro continuo', ok: false },
	{ text: 'le righe scure sono colori che la sorgente non emette', ok: false },
	{ text: 'un solido incandescente dà uno spettro a righe', ok: false },
	{ text: 'un elemento assorbe i colori che non riesce a emettere', ok: false }
];

const LINES: { nome: string; righe: number[] }[] = [
	{ nome: 'idrogeno', righe: [656, 486, 434] },
	{ nome: 'elio', righe: [668, 588, 502] },
	{ nome: 'litio', righe: [671, 610, 460] },
	{ nome: 'mercurio', righe: [546, 436, 405] }
];

function level6(rng: Rng): Built {
	const kind = rng.pick(['tipo', 'assorbimento', 'affermazione'] as const);
	if (kind === 'tipo') {
		const src = rng.pick(SOURCES);
		const opt = (k: keyof typeof KINDS) => textOpt(KINDS[k], k);
		const why = {
			continuo: "Un solido o un liquido incandescente emette tutte le lunghezze d'onda: lo spettro è continuo.",
			emissione: "Un gas rarefatto eccitato emette solo certe lunghezze d'onda: lo spettro è fatto di righe luminose su fondo nero.",
			assorbimento: "Il gas toglie alla luce bianca le lunghezze d'onda che assorbe: sul continuo restano delle righe scure."
		}[src.kind];
		return {
			prompt: 'Riconosci il tipo di spettro.',
			problem: textBlock(`Che tipo di spettro dà ${src.text}?`),
			solution: opt(src.kind).latex,
			steps: [textBlock(why)],
			answer: choose(rng, opt(src.kind), (['continuo', 'emissione', 'assorbimento', 'nessuno'] as const).filter((k) => k !== src.kind).map(opt)),
			params: { case: kind, source: src.text }
		};
	}
	if (kind === 'assorbimento') {
		const el = rng.pick(LINES);
		const list = `${el.righe[0]}, ${el.righe[1]} e ${el.righe[2]} nm`;
		const double = `${el.righe[0] * 2}, ${el.righe[1] * 2} e ${el.righe[2] * 2} nm`;
		return {
			prompt: 'Scegli la risposta giusta.',
			problem: textBlock(`Lo spettro di emissione di un gas ha tre righe, a $${el.righe[0]}$, $${el.righe[1]}$ e $${plainQ(el.righe[2], 'nm')}$. Lo stesso gas, freddo, viene attraversato da luce bianca. Dove cadono le righe scure del suo spettro di assorbimento?`),
			solution: textOpt(`a ${list}`, 'stesse').latex,
			steps: [textBlock(`Un elemento assorbe le stesse lunghezze d'onda che emette: le righe scure cadono a ${list}, dove nello spettro di emissione ci sono le righe luminose.`)],
			answer: choose(rng, textOpt(`a ${list}`, 'stesse'), [textOpt("a tutte le altre lunghezze d'onda", 'altre'), textOpt(`a ${double}`, 'doppie'), textOpt('da nessuna parte: un gas freddo non assorbe', 'nessuna')]),
			params: { case: kind, lines: el.righe }
		};
	}
	const want = rng.next() < 0.6;
	const { answer, right } = statementChoice(rng, SPECTRA, want);
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(want ? 'Quale affermazione sugli spettri è vera?' : 'Quale affermazione sugli spettri è sbagliata?'),
		solution: textOpt(right.text).latex,
		steps: [
			textBlock(
				"Un solido incandescente dà uno spettro continuo, un gas rarefatto eccitato uno spettro a righe. Ogni elemento ha le sue righe, sempre le stesse, e assorbe le lunghezze d'onda che emette: le righe scure sono quelle tolte dal gas, non colori che mancano alla sorgente."
			)
		],
		answer,
		params: { case: kind, want }
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimLuceSpettri: Generator = {
	id: ID,
	title: 'La luce e gli spettri atomici',
	levels: {
		1: { label: 'Onde e regioni dello spettro', constraints: ['nessun conto: confronti, regioni, ordine'] },
		2: { label: "Lunghezza d'onda e frequenza", constraints: ['c = λν, λ in nm da portare in metri, tre cifre'] },
		3: { label: "L'energia di un fotone", constraints: ['E = hν oppure E = hc/λ, tre cifre'] },
		4: { label: 'Una mole di fotoni', constraints: ['kJ/mol con N_A = 6,02 · 10²³; λ in nm da E'] },
		5: { label: "L'effetto fotoelettrico", constraints: ["fotone contro energia minima, distanti almeno l'8%"] },
		6: { label: 'Spettri continui e a righe', constraints: ['tipo di spettro, righe di assorbimento, affermazioni'] }
	},
	generate: generateWith(ID, LEVELS, check),
	check
};

export default chimLuceSpettri;
