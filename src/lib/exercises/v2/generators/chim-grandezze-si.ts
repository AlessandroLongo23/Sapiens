/**
 * Grandezze e unità del Sistema Internazionale (chemistry, first year). Spec: specs/exercises/chim-grandezze-si.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/10-chim-grandezze-si.md), each one step harder, all
 * multiple choice with the unit in the option: the SI unit of a quantity (the mole among them), the correct writing
 * of a measure, the value of a prefix; one prefix to or from the unit (g, L, mol, J); scientific notation; between two
 * prefixes (µg, mg, mL, µL, mmol, nm, pm), answer in scientific notation; volumes (m³, dm³, L, cm³, mL), where the
 * factor goes to the cube; composite units of density and concentration (g/mL, kg/m³, g/L, mg/mL, mg/L), where both
 * units change. Distractors are the mistakes the lesson warns about: the exponent with the wrong sign, one step too
 * many or too few, the zeros counted instead of the places, the volume factor not cubed, the factor put on the wrong
 * side of the fraction. Numbers are built backwards from a mantissa with one to three significant digits.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { sci, sciRaw } from '../fis-grandezze';
import { type Built, BANNED, U, checkCommon, choose, dec, decimals, generateWith, pow10, pow10Tex, pu, q, t, wu, type R } from '../chim-misure';

export const ID = 'chim-grandezze-si';

/** A mantissa with 1 to 3 significant digits, from 1 to 9,99 (never ending in 0 after the comma). */
function mantissa(rng: Rng, sigs = rng.int(1, 3)): R {
	for (;;) {
		const x = sigs === 1 ? rng.int(1, 9) : sigs === 2 ? rng.int(10, 99) : rng.int(100, 999);
		if (sigs > 1 && x % 10 === 0) continue;
		return q(x, 10 ** (sigs - 1));
	}
}

/** Decimal when short, otherwise scientific notation. */
const val = (r: R) => (decimals(r) <= 4 && r.compare(q(1000000)) < 0 ? dec(r) : sci(r));
const valOpt = (r: R, u: string, form: 'val' | 'sci' = 'val'): ChoiceOption => ({ latex: wu(form === 'sci' ? sci(r) : val(r), u), values: [r.toString()] });
/** A power of ten in a fraction: 1 for 10^0. */
const p10 = (n: number) => (n === 0 ? '1' : pow10Tex(n));
const ok = (r: R) => r.sign() > 0 && decimals(r) <= 15 && r.compare(q(1e12)) < 0;

// ---------------------------------------------------------------------------
// Level 1: units, writing, prefixes

const SI: [string, string, string, string][] = [
	['la lunghezza', 'metro', 'm', 'il '],
	['la massa', 'chilogrammo', 'kg', 'il '],
	["l'intervallo di tempo", 'secondo', 's', 'il '],
	['la temperatura', 'kelvin', 'K', 'il '],
	['la quantità di sostanza', 'mole', 'mol', 'la '],
	["l'intensità di corrente elettrica", 'ampere', 'A', "l'"],
	["l'intensità luminosa", 'candela', 'cd', 'la '],
];
const WRONG_UNITS: Record<string, [string, string][]> = {
	m: [['centimetro', 'cm'], ['litro', 'L'], ['chilometro', 'km'], ['grammo', 'g']],
	kg: [['grammo', 'g'], ['newton', 'N'], ['litro', 'L'], ['mole', 'mol']],
	s: [['minuto', 'min'], ['ora', 'h'], ['kelvin', 'K'], ['metro', 'm']],
	K: [['grado Celsius', '°C'], ['joule', 'J'], ['candela', 'cd'], ['caloria', 'cal']],
	mol: [['grammo', 'g'], ['chilogrammo', 'kg'], ['litro', 'L'], ['candela', 'cd']],
	A: [['kelvin', 'K'], ['mole', 'mol'], ['newton', 'N'], ['candela', 'cd']],
	cd: [['kelvin', 'K'], ['mole', 'mol'], ['ampere', 'A'], ['metro', 'm']],
};
/** Wrong writings of a symbol, as the lesson's table lists them. */
const WRONG_WRITING: Record<string, string[]> = {
	g: ['gr', 'gr.', 'g.', 'grs'],
	kg: ['Kg', 'kgs', 'kg.', 'KG'],
	mol: ['moli', 'mol.', 'Mol', 'mols'],
	mL: ['mL.', 'Ml', 'mLs', 'cc'],
	K: ['°K', 'K.', '°k', 'k'],
	s: ['sec', 's.', 'sec.', 'secs'],
};
const PREFIXES: [string, string, number][] = [
	['mega', 'M', 6],
	['kilo', 'k', 3],
	['deci', 'd', -1],
	['centi', 'c', -2],
	['milli', 'm', -3],
	['micro', 'μ', -6],
	['nano', 'n', -9],
	['pico', 'p', -12],
];

function level1(rng: Rng): Built {
	const kind = rng.pick(['unita', 'scrittura', 'prefisso'] as const);
	if (kind === 'unita') {
		const [qty, name, sym, art] = rng.pick(SI);
		const o = (n: string, s: string) => ({ latex: t(`${n} (${s})`), values: [s] });
		return {
			prompt: "Scegli l'unità di misura.",
			problem: textBlock(`Qual è l'unità di misura del Sistema Internazionale per ${qty}?`),
			solution: t(`${name} (${sym})`),
			steps: [textBlock(`Nel SI l'unità di misura per ${qty} è ${art}${name}, simbolo ${sym}.`)],
			answer: choose(rng, o(name, sym), shuffle(rng, WRONG_UNITS[sym]).map(([n, s]) => o(n, s))),
			params: { case: kind, qty },
		};
	}
	if (kind === 'scrittura') {
		const sym = rng.pick(Object.keys(WRONG_WRITING));
		const x = sym === 'K' ? String(rng.int(250, 400)) : rng.next() < 0.7 ? String(rng.int(2, 95)) : `${rng.int(1, 9)},${rng.int(1, 9)}`;
		const right = { latex: t(`${x} ${sym}`), values: [sym] };
		const others = shuffle(rng, WRONG_WRITING[sym]).map((w) => ({ latex: t(`${x} ${w}`), values: [w] }));
		const why = sym === 'K' ? 'Il kelvin si scrive K, senza il simbolo di grado e senza punto.' : `Il simbolo si scrive ${sym}, senza punto e senza plurale, e maiuscole e minuscole non si cambiano.`;
		return {
			prompt: 'Scegli la scrittura corretta.',
			problem: textBlock('Quale di queste misure è scritta correttamente?'),
			solution: right.latex,
			steps: [textBlock(`La scrittura giusta è ${x} ${sym}. ${why}`)],
			answer: choose(rng, right, others),
			params: { case: kind, sym, x },
		};
	}
	const [name, sym, e] = rng.pick(PREFIXES);
	const o = (n: number) => ({ latex: pow10Tex(n), values: [String(n)] });
	const cands = [-e, e + 3, e - 3, e + 1, e - 1, e + 6, e - 6].filter((n) => n !== e && n !== 0 && Math.abs(n) <= 15);
	return {
		prompt: 'Scegli il valore del prefisso.',
		problem: textBlock(`Quanto vale il prefisso ${name}, di simbolo $${sym === 'μ' ? '\\mu' : `\\text{${sym}}`}$?`),
		solution: pow10Tex(e),
		steps: [`${t(`Il prefisso ${name} moltiplica l'unità per `)} ${pow10Tex(e)}`],
		answer: choose(rng, o(e), cands.map(o)),
		params: { case: kind, prefix: name },
	};
}

// ---------------------------------------------------------------------------
// Level 2: one prefix, to the unit or from it

const EXP: Record<string, number> = { M: 6, k: 3, h: 2, '': 0, d: -1, c: -2, m: -3, μ: -6, n: -9, p: -12 };
const FAMILIES2: { unit: string; prefixes: string[] }[] = [
	{ unit: 'g', prefixes: ['k', 'm'] },
	{ unit: 'L', prefixes: ['m'] },
	{ unit: 'mol', prefixes: ['m'] },
	{ unit: 'J', prefixes: ['k'] },
];

function level2(rng: Rng): Built {
	for (;;) {
		const F = rng.pick(FAMILIES2);
		const p = rng.pick(F.prefixes);
		const e = EXP[p];
		const toUnit = rng.next() < 0.5;
		const x = mantissa(rng).mul(pow10(rng.int(-2, 2)));
		const from = toUnit ? p + F.unit : F.unit;
		const to = toUnit ? F.unit : p + F.unit;
		const k = toUnit ? e : -e;
		const ans = x.mul(pow10(k));
		if (decimals(x) > 3 || decimals(ans) > 4 || ans.compare(q(1000000)) > 0) continue;
		const wrong = [x.mul(pow10(-k)), x.mul(pow10(k + 1)), x.mul(pow10(k - 1)), x.mul(pow10(k + 2)), x.mul(pow10(k - 2))].filter((r) => decimals(r) <= 6 && r.compare(q(1e9)) < 0);
		if (wrong.length < 3) continue;
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi ${pu(dec(x), from)} in $${U(to)}$.`),
			solution: wu(dec(ans), to),
			steps: [`1\\,${U(p + F.unit)} = ${pow10Tex(e)}\\,${U(F.unit)}`, `${wu(dec(x), from)} = ${dec(x)} \\cdot ${pow10Tex(k)}\\,${U(to)} = ${wu(dec(ans), to)}`],
			answer: choose(
				rng,
				{ latex: wu(dec(ans), to), values: [ans.toString()] },
				wrong.map((r) => ({ latex: wu(dec(r), to), values: [r.toString()] })),
			),
			params: { case: toUnit ? 'verso-unita' : 'da-unita', unit: F.unit, prefix: p },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: scientific notation

const SCI_UNITS = ['m', 'g', 'mol', 'L'];

function level3(rng: Rng): Built {
	for (;;) {
		const u = rng.pick(SCI_UNITS);
		const a = mantissa(rng);
		const n = rng.pick([-9, -8, -7, -6, -5, -4, -3, 3, 4, 5, 6, 7, 8, 9]);
		const x = a.mul(pow10(n));
		if (decimals(x) > 11) continue;
		if (rng.next() < 0.6) {
			// the zeros counted instead of the places the comma moves
			const digits = dec(x).replace(/\\,|\{,\}/g, '');
			const zeros = (digits.match(/0/g) ?? []).length;
			const wrongN = [-n, n > 0 ? zeros : -(zeros - 1), n + 1, n - 1, n > 0 ? zeros - 1 : -zeros].filter((m) => m !== n);
			const opts = wrongN.map((m) => ({ latex: wu(sciRaw(a, m), u), values: [a.mul(pow10(m)).toString()] }));
			return {
				prompt: 'Scrivi in notazione scientifica.',
				problem: textBlock(`Scrivi in notazione scientifica la misura ${pu(dec(x), u)}.`),
				solution: wu(sci(x), u),
				steps: [
					textBlock(`La virgola si sposta di $${Math.abs(n)}$ posti verso ${n > 0 ? 'sinistra' : 'destra'} per avere $${dec(a)}$, con una sola cifra diversa da zero prima della virgola.`),
					textBlock(`Il numero era ${n > 0 ? "grande, quindi l'esponente è positivo" : "minore di $1$, quindi l'esponente è negativo"}: ${pu(sci(x), u)}.`),
				],
				answer: choose(rng, { latex: wu(sci(x), u), values: [x.toString()] }, opts),
				params: { case: 'scrivi', unit: u },
			};
		}
		// four writings of the same number: only one has 1 <= a < 10
		const alt = [-1, 1, -2, 2].map((d) => ({ a: a.mul(pow10(d)), n: n - d }));
		const opts = alt.filter((w) => decimals(w.a) <= 4 && w.a.compare(q(1000)) < 0).map((w) => ({ latex: wu(sciRaw(w.a, w.n), u), values: [`${w.a.toString()}e${w.n}`] }));
		if (opts.length < 3) continue;
		return {
			prompt: 'Riconosci la notazione scientifica.',
			problem: textBlock(`Quale di queste scritture è la notazione scientifica della misura ${pu(dec(x), u)}?`),
			solution: wu(sci(x), u),
			steps: [textBlock(`Tutte valgono ${pu(dec(x), u)}, ma solo in ${pu(sci(x), u)} il primo fattore è almeno $1$ e minore di $10$.`)],
			answer: choose(rng, { latex: wu(sci(x), u), values: [`${a.toString()}e${n}`] }, shuffle(rng, opts)),
			params: { case: 'riconosci', unit: u },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: between two prefixes, the answer in scientific notation

const FAMILIES4: { unit: string; prefixes: string[] }[] = [
	{ unit: 'g', prefixes: ['k', '', 'm', 'μ'] },
	{ unit: 'L', prefixes: ['', 'm', 'μ'] },
	{ unit: 'mol', prefixes: ['', 'm', 'μ'] },
	{ unit: 'm', prefixes: ['', 'μ', 'n', 'p'] },
];

function level4(rng: Rng): Built {
	for (;;) {
		const F = rng.pick(FAMILIES4);
		const [p1, p2] = shuffle(rng, F.prefixes).slice(0, 2);
		const d = EXP[p1] - EXP[p2]; // 1 p1 = 10^d p2
		if (Math.abs(d) < 3 || Math.abs(d) > 9) continue;
		const x = mantissa(rng).mul(pow10(rng.int(-1, 2)));
		if (decimals(x) > 3) continue;
		const ans = x.mul(pow10(d));
		const n = Math.floor(Math.log10(ans.num / ans.den) + 1e-9);
		if (Math.abs(n) < 2 || Math.abs(n) > 12) continue;
		const from = p1 + F.unit;
		const to = p2 + F.unit;
		const wrong = [-d, d + 3, d - 3, d + 1, d - 1].filter((k) => Math.abs(k) <= 15).map((k) => x.mul(pow10(k)));
		const e1 = EXP[p1], e2 = EXP[p2];
		const steps = [
			[p1 ? `1\\,${U(from)} = ${pow10Tex(e1)}\\,${U(F.unit)}` : '', p2 ? `1\\,${U(to)} = ${pow10Tex(e2)}\\,${U(F.unit)}` : ''].filter(Boolean).join(' \\qquad '),
			`1\\,${U(from)} = \\dfrac{${pow10Tex(e1)}}{${pow10Tex(e2)}}\\,${U(to)} = ${pow10Tex(d)}\\,${U(to)}`,
			`${wu(dec(x), from)} = ${dec(x)} \\cdot ${pow10Tex(d)}\\,${U(to)}${sciRaw(x, d) === sci(ans) ? '' : ` = ${wu(sci(ans), to)}`}`,
		];
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi ${pu(dec(x), from)} in $${U(to)}$, in notazione scientifica.`),
			solution: wu(sci(ans), to),
			steps,
			answer: choose(rng, valOpt(ans, to, 'sci'), wrong.filter(ok).map((r) => valOpt(r, to, 'sci'))),
			params: { case: F.unit, from, to },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: volumes

/** Every volume unit as a power of ten of the millilitre (the cube of the length factor). */
const VOL: Record<string, number> = { 'm^3': 6, 'dm^3': 3, L: 3, 'cm^3': 0, mL: 0 };
const VOL_NAMES = Object.keys(VOL);

function level5(rng: Rng): Built {
	for (;;) {
		const [u1, u2] = shuffle(rng, VOL_NAMES).slice(0, 2);
		const d = VOL[u1] - VOL[u2]; // 1 u1 = 10^d u2
		if (d === 0) continue;
		const x = mantissa(rng).mul(pow10(rng.int(-1, 2)));
		if (decimals(x) > 3) continue;
		const ans = x.mul(pow10(d));
		if (!ok(ans) || ans.compare(q(1, 10 ** 7)) < 0) continue;
		// the length factor (not cubed), the square, the factor upside down, one power off
		const wrong = [d / 3, (2 * d) / 3, -d, d + 3, d - 3].filter((k) => Number.isInteger(k) && k !== d).map((k) => x.mul(pow10(k)));
		const lengths = (u: string) => (u === 'L' ? '1\\,\\text{L} = 1\\,\\text{dm}^3' : u === 'mL' ? '1\\,\\text{mL} = 1\\,\\text{cm}^3' : '');
		// L = dm³ and mL = cm³ matter only between a litre unit and a cubic one
		const note = u1.includes('^') !== u2.includes('^') ? [lengths(u1), lengths(u2)].filter(Boolean) : [];
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi il volume ${pu(dec(x), u1)} in $${U(u2)}$.`),
			solution: wu(val(ans), u2),
			steps: [
				...(note.length ? [note.join(' \\qquad ')] : []),
				`1\\,${U(u1)} = ${pow10Tex(d)}\\,${U(u2)}`,
				`${wu(dec(x), u1)} = ${dec(x)} \\cdot ${pow10Tex(d)}\\,${U(u2)} = ${wu(val(ans), u2)}`,
				t('Tra due unità di volume il fattore delle lunghezze va alla terza: ogni passo vale 1000.'),
			],
			answer: choose(rng, valOpt(ans, u2), wrong.filter(ok).map((r) => valOpt(r, u2))),
			params: { case: `${u1}>${u2}` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: density and concentration

/** Units of a density or a concentration as (mass exponent in g, volume exponent in mL). */
const COMP: Record<string, [number, number]> = {
	'g/mL': [0, 0],
	'g/cm^3': [0, 0],
	'kg/m^3': [3, 6],
	'g/L': [0, 3],
	'mg/mL': [-3, 0],
	'mg/L': [-3, 3],
};
const PAIRS: [string, string][] = [
	['g/mL', 'kg/m^3'],
	['kg/m^3', 'g/mL'],
	['g/cm^3', 'kg/m^3'],
	['g/L', 'g/mL'],
	['g/mL', 'g/L'],
	['g/L', 'kg/m^3'],
	['kg/m^3', 'g/L'],
	['mg/mL', 'g/L'],
	['g/L', 'mg/mL'],
	['mg/L', 'g/L'],
	['g/L', 'mg/L'],
];

function level6(rng: Rng): Built {
	for (;;) {
		const [u1, u2] = rng.pick(PAIRS);
		const [m1, v1] = COMP[u1], [m2, v2] = COMP[u2];
		const k = m1 - v1 - (m2 - v2); // x u1 = x · 10^k u2
		const x = mantissa(rng).mul(pow10(rng.int(-2, 2)));
		if (decimals(x) > 4) continue;
		const ans = x.mul(pow10(k));
		if (!ok(ans) || ans.compare(q(1, 10 ** 6)) < 0) continue;
		// the factor on the wrong side; nothing changed (or, when nothing changes, a thousand either way); a million
		const ks = k === 0 ? [3, -3, 6] : [-k, 0, k > 0 ? k + 3 : k - 3, 2 * k];
		const wrong = ks.filter((j) => j !== k).map((j) => x.mul(pow10(j)));
		const [a1, b1] = u1.split('/'), [a2, b2] = u2.split('/');
		const mass = a1 === a2 ? '' : `1\\,${U(a1)} = ${pow10Tex(m1 - m2)}\\,${U(a2)}`;
		const vol = b1 === b2 ? '' : `1\\,${U(b1)} = ${pow10Tex(v1 - v2)}\\,${U(b2)}`;
		return {
			prompt: 'Cambia unità di misura.',
			problem: textBlock(`Esprimi ${pu(dec(x), u1)} in $${U(u2)}$.`),
			solution: wu(val(ans), u2),
			steps: [
				[mass, vol].filter(Boolean).join(' \\qquad '),
				`${wu(dec(x), u1)} = ${dec(x)} \\cdot \\dfrac{${p10(m1 - m2)}\\,${U(a2)}}{${p10(v1 - v2)}\\,${U(b2)}} = ${wu(val(ans), u2)}`,
			],
			answer: choose(rng, valOpt(ans, u2), wrong.filter(ok).map((r) => valOpt(r, u2))),
			params: { case: k === 0 ? 'uguali' : 'fattore', from: u1, to: u2 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (BANNED.test(sample.problem)) v.push('parole vietate');
	return v;
}

export const chimGrandezzeSi: Generator = {
	id: ID,
	title: 'Grandezze e unità del Sistema Internazionale',
	levels: {
		1: { label: 'Unità e simboli', constraints: ["l'unità del SI di una grandezza (con la mole), la scrittura corretta di una misura, il valore di un prefisso"] },
		2: { label: "Un prefisso e l'unità", constraints: ["da g, L, mol, J a un multiplo o sottomultiplo o viceversa", 'risposta decimale, al più 4 decimali'] },
		3: { label: 'Notazione scientifica', constraints: ['scrivere in notazione scientifica (60%) o riconoscerla (40%)', 'esponente da -9 a 9, mai da -2 a 2'] },
		4: { label: 'Tra due prefissi', constraints: ['µg, mg, kg, mL, µL, mmol, µmol, nm, pm', 'risposta in notazione scientifica'] },
		5: { label: 'I volumi', constraints: ['m³, dm³, L, cm³, mL', 'il fattore delle lunghezze alla terza'] },
		6: { label: 'Densità e concentrazioni', constraints: ['g/mL, g/cm³, kg/m³, g/L, mg/mL, mg/L', 'si convertono le due unità della frazione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimGrandezzeSi;
