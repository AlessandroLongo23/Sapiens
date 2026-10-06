/**
 * Forze dipolo-dipolo e forze di London. Spec: specs/exercises/chim-forze-dipolo-london.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/72-chim-forze-dipolo-london.md), each one step harder:
 * which forces act in a substance whose polarity is given; the electrons of a molecule, the sum of the atomic numbers
 * (also as an open answer); London forces compared inside a family of apolar substances; two substances with the same
 * electrons, one polar and one not; the ion-dipole force, told from the ionic bond; the shape of the molecule and
 * the cases where London forces outweigh the polarity. Substances, electrons and boiling points are the lesson's.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, type Fact, cap, checkSample, choose, electrons, atoms, factLevel, fx, generateWith, intOpt, shuffled, t, texOpt, textBlock, textOpt, tx, Z } from '../chim3-h';

export const ID = 'chim-forze-dipolo-london';

// ---------------------------------------------------------------------------
// The substances of the lesson

interface Sub {
	f: string;
	il: string; // the name with its article
	kind: 'atomi' | 'apolare' | 'polare';
	teb: number; // boiling point, °C, as the lesson rounds it
}

const S = (f: string, il: string, kind: Sub['kind'], teb: number): Sub => ({ f, il, kind, teb });
export const SUBSTANCES: Sub[] = [
	S('He', "l'elio", 'atomi', -269),
	S('Ne', 'il neon', 'atomi', -246),
	S('Ar', "l'argon", 'atomi', -186),
	S('Kr', 'il kripton', 'atomi', -153),
	S('Xe', 'lo xeno', 'atomi', -108),
	S('F2', 'il fluoro', 'apolare', -188),
	S('Cl2', 'il cloro', 'apolare', -34),
	S('Br2', 'il bromo', 'apolare', 59),
	S('I2', 'lo iodio', 'apolare', 184),
	S('N2', "l'azoto", 'apolare', -196),
	S('CH4', 'il metano', 'apolare', -162),
	S('C2H6', "l'etano", 'apolare', -89),
	S('C3H8', 'il propano', 'apolare', -42),
	S('C5H12', 'il pentano', 'apolare', 36),
	S('CO2', 'il diossido di carbonio', 'apolare', -78),
	S('CCl4', 'il tetracloruro di carbonio', 'apolare', 77),
	S('HCl', 'il cloruro di idrogeno', 'polare', -85),
	S('HBr', 'il bromuro di idrogeno', 'polare', -67),
	S('HI', 'lo ioduro di idrogeno', 'polare', -35),
	S('SO2', 'il diossido di zolfo', 'polare', -10),
	S('CHCl3', 'il triclorometano', 'polare', 61),
	S('CH3Cl', 'il clorometano', 'polare', -24),
	S('ICl', 'il cloruro di iodio', 'polare', 97),
];
const sub = (f: string) => {
	const s = SUBSTANCES.find((x) => x.f === f);
	if (!s) throw new Error(`no substance ${f}`);
	return s;
};
const m = (f: string) => `$${fx(f)}$`;

// ---------------------------------------------------------------------------
// Level 1: which forces, the polarity given

const LONDON = 'Solo forze di London';
const BOTH = 'Forze di London e forze dipolo-dipolo';
const ONLY_DIPOLE = 'Solo forze dipolo-dipolo';
const ION_DIPOLE = 'Forze ione-dipolo';
const COVALENT = 'Legami covalenti';

function level1(rng: Rng): Built {
	const s = rng.pick(SUBSTANCES);
	const made = s.kind === 'atomi' ? 'è fatto di atomi singoli' : s.kind === 'apolare' ? 'ha molecole apolari' : 'ha molecole polari';
	const between = s.kind === 'atomi' ? 'i suoi atomi' : 'le sue molecole';
	const right = s.kind === 'polare' ? BOTH : LONDON;
	const why =
		s.kind === 'polare'
			? 'Le forze di London ci sono sempre, perché tutte le particelle hanno elettroni in movimento. In una sostanza polare si aggiungono le forze dipolo-dipolo.'
			: `Le forze di London ci sono sempre. Le forze dipolo-dipolo agiscono solo tra molecole polari, e qui ${s.kind === 'atomi' ? 'gli atomi non hanno poli' : 'le molecole sono apolari'}.`;
	return {
		prompt: 'Scegli le forze intermolecolari.',
		problem: textBlock(`${cap(s.il)}, ${m(s.f)}, ${made}. Quali forze intermolecolari agiscono tra ${between}?`),
		solution: textOpt(right).latex,
		steps: [textBlock(why)],
		answer: choose(rng, textOpt(right), (s.kind === 'polare' ? [ONLY_DIPOLE, LONDON, rng.pick([ION_DIPOLE, COVALENT])] : [BOTH, ONLY_DIPOLE, rng.pick([ION_DIPOLE, COVALENT])]).map((x) => textOpt(x))),
		params: { case: s.kind, formula: s.f },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the electrons of a molecule

export const COUNTED = ['F2', 'Cl2', 'Br2', 'I2', 'N2', 'CH4', 'C2H6', 'C3H8', 'C5H12', 'CO2', 'CCl4', 'HCl', 'HBr', 'HI', 'SO2', 'CHCl3', 'CH3Cl', 'ICl'];

function level2(rng: Rng): Built {
	const f = rng.pick(COUNTED);
	const s = sub(f);
	const parts = atoms(f);
	const n = electrons(f);
	const once = parts.reduce((x, [el]) => x + Z[el], 0); // the indices forgotten
	const count = parts.reduce((x, [, k]) => x + k, 0); // the atoms, not the electrons
	const swapped = parts.length > 1 ? parts.reduce((x, [el], i) => x + Z[el] * parts[parts.length - 1 - i][1], 0) : 0; // the indices on the wrong atoms
	const zMin = Math.min(...parts.map(([el]) => Z[el]));
	const others = [once, swapped, n + zMin, 2 * n, n - zMin, count, n + 2].filter((x) => x > 0 && x !== n);
	const sum = parts.map(([el, k]) => (k === 1 ? String(Z[el]) : `${k} \\cdot ${Z[el]}`)).join(' + ');
	return {
		prompt: 'Conta gli elettroni della molecola.',
		problem: textBlock(`Quanti elettroni ha in tutto una molecola di ${m(f)}, ${s.il.replace(/^(il |lo |l')/, '')}? Numeri atomici: ${parts.map(([el]) => `$Z(\\mathrm{${el}}) = ${Z[el]}$`).join(', ')}.`),
		solution: String(n),
		steps: [textBlock('In una molecola neutra gli elettroni sono tanti quanti i protoni: si sommano i numeri atomici di tutti gli atomi.'), `${sum} = ${n}`],
		answer: choose(rng, intOpt(n), others.map(intOpt)),
		params: { case: parts.length === 1 ? 'un elemento' : 'più elementi', formula: f },
		open: String(n),
	};
}

// ---------------------------------------------------------------------------
// Level 3: London forces inside a family

export const FAMILIES: { nome: string; made: string; list: string[] }[] = [
	{ nome: 'gas nobili', made: 'di atomi singoli', list: ['He', 'Ne', 'Ar', 'Kr', 'Xe'] },
	{ nome: 'alogeni', made: 'di molecole apolari', list: ['F2', 'Cl2', 'Br2', 'I2'] },
	{ nome: 'alcani', made: 'di molecole apolari', list: ['CH4', 'C2H6', 'C3H8', 'C5H12'] },
];
const ASKS: { q: string; top: boolean }[] = [
	{ q: 'Quale bolle alla temperatura più alta?', top: true },
	{ q: 'Quale bolle alla temperatura più bassa?', top: false },
	{ q: 'In quale le forze di London sono più intense?', top: true },
	{ q: 'In quale le forze di London sono più deboli?', top: false },
];

function level3(rng: Rng): Built {
	const fam = rng.pick(FAMILIES);
	const four = shuffled(rng, fam.list).slice(0, 4);
	const ask = rng.pick(ASKS);
	const byE = [...four].sort((a, b) => electrons(a) - electrons(b));
	const right = ask.top ? byE[3] : byE[0];
	return {
		prompt: 'Confronta le forze di London.',
		problem: textBlock(`Queste quattro sostanze sono fatte ${fam.made}: ${four.map(m).join(', ')}. ${ask.q}`),
		solution: fx(right),
		steps: [
			textBlock(`Tra particelle apolari ci sono solo forze di London, che crescono con il numero di elettroni: ${byE.map((f) => `${m(f)} ne ha $${electrons(f)}$`).join(', ')}.`),
			textBlock(`${ask.top ? 'Più' : 'Meno'} elettroni vuol dire nube ${ask.top ? 'più' : 'meno'} polarizzabile, forze di London ${ask.top ? 'più intense' : 'più deboli'} e temperatura di ebollizione ${ask.top ? 'più alta' : 'più bassa'}: ${m(right)}, che bolle a $${sub(right).teb}\\,^\\circ\\text{C}$.`),
		],
		answer: choose(rng, texOpt(fx(right), right), four.filter((f) => f !== right).map((f) => texOpt(fx(f), f))),
		params: { case: ask.top ? 'massimo' : 'minimo', family: fam.nome, four },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the same electrons, one polar and one not

/** [apolar, polar], with the same number of electrons. */
export const PAIRS: [string, string][] = [
	['F2', 'HCl'],
	['Ar', 'HCl'],
	['Br2', 'ICl'],
	['C3H8', 'CH3Cl'],
	['Kr', 'HBr'],
	['Xe', 'HI'],
];

/** An option on two lines, each one prose with formulas between dollars. */
const two = (a: string, b: string, value: string): ChoiceOption => ({ latex: `\\begin{gathered} ${tx(a)} \\\\ ${tx(b)} \\end{gathered}`, values: [value] });

function level4(rng: Rng): Built {
	const [a, p] = rng.pick(PAIRS);
	const [first, second] = rng.next() < 0.5 ? [a, p] : [p, a];
	const e = electrons(p);
	if (electrons(a) !== e) throw new Error('pair with different electrons');
	const A = sub(a), P = sub(p);
	const temps = `${cap(P.il)} bolle a $${P.teb}\\,^\\circ\\text{C}$, ${A.il} a $${A.teb}\\,^\\circ\\text{C}$.`;
	if (rng.next() < 0.5) {
		return {
			prompt: 'Confronta le due sostanze.',
			problem: textBlock(`${m(first)} e ${m(second)} hanno tutti e due $${e}$ elettroni. Quale bolle alla temperatura più alta, e perché?`),
			solution: two(`${m(p)}, perché`, 'è polare', 'polare').latex,
			steps: [
				textBlock(`Con gli stessi elettroni le forze di London sono simili. ${cap(P.il)} è polare, ${A.il} ${A.kind === 'atomi' ? 'è fatto di atomi singoli' : 'è apolare'}: tra le molecole del primo ci sono anche le forze dipolo-dipolo.`),
				textBlock(temps),
			],
			answer: choose(rng, two(`${m(p)}, perché`, 'è polare', 'polare'), [two(`${m(a)}, perché`, 'è apolare', 'apolare'), two(`${m(p)}, perché`, 'ha più elettroni', 'elettroni'), two('Bollono alla', 'stessa temperatura', 'uguali')]),
			params: { case: 'chi bolle', apolar: a, polar: p, first },
		};
	}
	return {
		prompt: 'Trova la forza in più.',
		problem: textBlock(`${m(first)} e ${m(second)} hanno tutti e due $${e}$ elettroni, ma ${m(p)} bolle a una temperatura più alta. Quale forza agisce tra le molecole di ${m(p)} e non tra ${A.kind === 'atomi' ? 'gli atomi' : 'le molecole'} di ${m(a)}?`),
		solution: t('La forza dipolo-dipolo'),
		steps: [textBlock(`${cap(P.il)} è polare: alle forze di London, che ci sono in tutte e due le sostanze, si aggiungono le forze dipolo-dipolo.`), textBlock(temps)],
		answer: choose(rng, textOpt('La forza dipolo-dipolo'), ['La forza di London', 'La forza ione-dipolo', 'Il legame covalente'].map((x) => textOpt(x))),
		params: { case: 'forza in più', apolar: a, polar: p, first },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the ion-dipole force

export const CATIONS = ['Na+', 'K+', 'Li+', 'Mg2+', 'Ca2+'];
export const ANIONS = ['Cl-', 'Br-', 'F-', 'I-'];
/** [more charged and not larger, the other]: the first holds the water molecules more strongly. */
export const STRONGER: [string, string][] = [
	['Mg2+', 'Na+'],
	['Mg2+', 'K+'],
	['Mg2+', 'Li+'],
	['Ca2+', 'K+'],
	['Ca2+', 'Na+'],
];

function level5(rng: Rng): Built {
	const r = rng.next();
	if (r < 0.3) {
		const ion = rng.pick([...CATIONS, ...ANIONS]);
		return {
			prompt: 'Riconosci la forza.',
			problem: textBlock(`Quale forza si esercita tra uno ione ${m(ion)} e una molecola d'acqua?`),
			solution: t('Forza ione-dipolo'),
			steps: [textBlock(`L'acqua è una molecola polare, neutra: uno ione attira il suo lato di carica opposta. È la forza ione-dipolo. Il legame ionico è l'attrazione tra due ioni.`)],
			answer: choose(rng, textOpt('Forza ione-dipolo'), ['Legame ionico', 'Forza dipolo-dipolo', 'Forza di London'].map((x) => textOpt(x))),
			params: { case: 'ione e acqua', ion },
		};
	}
	if (r < 0.55) {
		const ion = rng.pick([...CATIONS, ...ANIONS]);
		const positive = CATIONS.includes(ion);
		const O_NEG = "L'ossigeno, che è $\\delta^-$", H_POS = 'Gli idrogeni, che sono $\\delta^+$', O_POS = "L'ossigeno, che è $\\delta^+$", H_NEG = 'Gli idrogeni, che sono $\\delta^-$';
		const right = positive ? O_NEG : H_POS;
		return {
			prompt: "Orienta la molecola d'acqua.",
			problem: textBlock(`Quale parte della molecola d'acqua si rivolge verso uno ione ${m(ion)}?`),
			solution: tx(right),
			steps: [textBlock(`Lo ione ${m(ion)} è ${positive ? 'positivo' : 'negativo'} e attira il lato di carica opposta. Nell'acqua l'ossigeno ha la carica parziale $\\delta^-$ e gli idrogeni $\\delta^+$.`)],
			answer: choose(rng, textOpt(right), [positive ? H_POS : O_NEG, positive ? O_POS : H_NEG, positive ? H_NEG : O_POS].map((x) => textOpt(x))),
			params: { case: 'lato', ion },
		};
	}
	if (r < 0.8) {
		const c = rng.pick(CATIONS), a = rng.pick(ANIONS);
		return {
			prompt: 'Riconosci la forza.',
			problem: textBlock(`Quale forza tiene uniti uno ione ${m(c)} e uno ione ${m(a)} in un cristallo?`),
			solution: t('Legame ionico'),
			steps: [textBlock(`Sono due ioni, cioè due cariche intere di segno opposto: si attraggono con il legame ionico. La forza ione-dipolo è quella tra uno ione e una molecola polare, che resta neutra.`)],
			answer: choose(rng, textOpt('Legame ionico'), ['Forza ione-dipolo', 'Forza dipolo-dipolo', 'Forza di London'].map((x) => textOpt(x))),
			params: { case: 'due ioni', cation: c, anion: a },
		};
	}
	const [strong, weak] = rng.pick(STRONGER);
	const [first, second] = rng.next() < 0.5 ? [strong, weak] : [weak, strong];
	return {
		prompt: 'Confronta i due ioni.',
		problem: textBlock(`Quale dei due ioni trattiene con più forza le molecole d'acqua che ha intorno: ${m(first)} o ${m(second)}?`),
		solution: two(`${m(strong)}, perché ha`, 'la carica maggiore', 'maggiore').latex,
		steps: [textBlock(`La forza ione-dipolo cresce con la carica dello ione: ${m(strong)} ha carica doppia rispetto a ${m(weak)}, e attira di più il lato $\\delta^-$ delle molecole d'acqua.`)],
		answer: choose(rng, two(`${m(strong)}, perché ha`, 'la carica maggiore', 'maggiore'), [two(`${m(weak)}, perché ha`, 'la carica minore', 'minore'), two('Lo stesso: sono', 'tutti e due positivi', 'uguali'), two("Nessuno dei due:", "l'acqua è neutra", 'nessuno')]),
		params: { case: 'carica', strong, weak, first },
	};
}

// ---------------------------------------------------------------------------
// Level 6: shape, polarisability, and when London forces win

const HCL = '$\\mathrm{HCl}$', HBR = '$\\mathrm{HBr}$', HI = '$\\mathrm{HI}$';
const SAME = 'Bollono alla stessa temperatura';
export const FACTS: Fact[] = [
	{ q: `Tra ${HCL}, ${HBR} e ${HI}, quale bolle alla temperatura più alta?`, a: HI, wrong: [HCL, HBR, SAME], why: `${HI} è il meno polare dei tre, ma ha più elettroni ($54$, contro $36$ e $18$) e forze di London più intense: bolle a $-35\\,^\\circ\\text{C}$, contro $-67$ e $-85\\,^\\circ\\text{C}$.` },
	{ q: `Tra ${HCL}, ${HBR} e ${HI}, quale bolle alla temperatura più bassa?`, a: HCL, wrong: [HI, HBR, SAME], why: `${HCL} è il più polare dei tre, ma ha meno elettroni ($18$) e forze di London più deboli: bolle a $-85\\,^\\circ\\text{C}$.` },
	{ q: `Tra ${HCL}, ${HBR} e ${HI}, in quale le forze di London sono più intense?`, a: HI, wrong: [HCL, HBR, 'Sono uguali nei tre'], why: `Le forze di London crescono con il numero di elettroni: ${HI} ne ha $54$, ${HBR} $36$, ${HCL} $18$.` },
	{ q: `Tra ${HCL}, ${HBR} e ${HI}, quale ha la molecola più polare?`, a: HCL, wrong: [HI, HBR, 'Sono polari allo stesso modo'], why: `La differenza di elettronegatività è $0{,}96$ in ${HCL}, $0{,}76$ in ${HBR} e $0{,}46$ in ${HI}: la più polare è ${HCL}.` },
	{ q: `Da ${HCL} a ${HI} la molecola diventa meno polare, eppure la temperatura di ebollizione sale. Perché?`, a: 'Crescono le forze di London', wrong: ['Crescono le forze dipolo-dipolo', 'I legami covalenti sono più forti', 'Le molecole hanno meno elettroni'], why: 'Gli elettroni passano da $18$ a $54$: le forze di London crescono più di quanto calino le forze dipolo-dipolo.' },
	{ q: 'Il pentano e il 2,2-dimetilpropano hanno la stessa formula. Quale bolle alla temperatura più alta?', a: 'Il pentano', wrong: ['Il 2,2-dimetilpropano', SAME, 'Dipende dalla quantità'], why: 'Il pentano ha la molecola allungata, che tocca le vicine per tutta la lunghezza: bolle a $36\\,^\\circ\\text{C}$, il 2,2-dimetilpropano a $9{,}5\\,^\\circ\\text{C}$.' },
	{ q: 'Perché il pentano bolle più in alto del 2,2-dimetilpropano, che ha gli stessi elettroni?', a: 'Ha la molecola più allungata', wrong: ['Ha la molecola più compatta', 'È più polare', 'Ha la massa maggiore'], why: 'Le forze di London agiscono solo a distanze piccole: una molecola allungata tocca le vicine su una zona più grande di una molecola compatta.' },
	{ q: 'Il tetracloruro di carbonio è apolare e bolle a $77\\,^\\circ\\text{C}$; il clorometano è polare e bolle a $-24\\,^\\circ\\text{C}$. Perché?', a: 'Il primo ha molti più elettroni', wrong: ['Il primo è più polare', 'Il secondo ha più elettroni', 'Il primo ha legami covalenti più forti'], why: 'Il tetracloruro di carbonio ha $74$ elettroni, il clorometano $26$: le forze di London del primo superano di molto le forze dipolo-dipolo del secondo.' },
	{ q: 'Il triclorometano è polare e ha $58$ elettroni; il tetracloruro di carbonio è apolare e ne ha $74$, e bolle più in alto. Quale forza prevale?', a: 'La forza di London', wrong: ['La forza dipolo-dipolo', 'La forza ione-dipolo', 'Il legame covalente'], why: 'Il tetracloruro di carbonio bolle a $77\\,^\\circ\\text{C}$ e il triclorometano a $61\\,^\\circ\\text{C}$: i $16$ elettroni in più contano più della polarità.' },
	{ q: 'A temperatura ambiente il cloro è un gas e lo iodio un solido. Perché?', a: 'Lo iodio ha più elettroni', wrong: ['Lo iodio è polare', 'Lo iodio forma ioni', 'Il cloro ha legami covalenti deboli'], why: 'Sono tutti e due apolari: tra le loro molecole ci sono solo forze di London, più intense nello iodio, che ha $106$ elettroni contro $34$.' },
	{ q: 'Che cosa si indica con il nome di forze di van der Waals?', a: 'Le forze dipolo-dipolo e di London', wrong: ['Le forze ione-dipolo', 'I legami covalenti e ionici', 'Solo le forze dipolo-dipolo'], why: 'Forze dipolo-dipolo e forze di London, prese insieme, si chiamano forze di van der Waals.' },
	{ q: "Che cos'è la polarizzabilità?", a: 'La facilità con cui la nube elettronica si deforma', wrong: ['La carica parziale di una molecola polare', 'Il numero degli elettroni di valenza', 'La differenza di elettronegatività'], why: 'Una nube grande, con molti elettroni lontani dal nucleo, si deforma con facilità e dà forze di London più intense.' },
	{ q: 'Come cambia la polarizzabilità quando gli elettroni di una particella aumentano?', a: 'Aumenta', wrong: ['Diminuisce', 'Non cambia', 'Si annulla'], why: 'Più elettroni vuol dire una nube più grande e più facile da deformare.' },
	{ q: 'Quando una sostanza molecolare bolle, che cosa si vince?', a: 'Le forze tra le molecole', wrong: ['I legami covalenti nelle molecole', "L'attrazione tra nucleo ed elettroni", 'Il legame ionico'], why: 'Nell\'ebollizione le molecole si allontanano l\'una dall\'altra e restano intere: si vincono le forze intermolecolari, non i legami covalenti.' },
	{ q: "Che cos'è un dipolo istantaneo?", a: 'Un dipolo che dura un istante', wrong: ['Il dipolo di una molecola polare', 'Uno ione con una carica intera', 'Un legame covalente polare'], why: 'Gli elettroni si muovono, e per un istante possono trovarsi un po\' di più da una parte: per quell\'istante la particella è un dipolo.' },
	{ q: "Che cos'è un dipolo indotto?", a: 'Un dipolo creato da un dipolo vicino', wrong: ['Un dipolo che la molecola ha sempre', 'Uno ione negativo', 'Un legame tra due ioni'], why: 'Il dipolo istantaneo di una particella sposta gli elettroni della particella vicina e crea anche lì un dipolo.' },
	{ q: 'Tra quali particelle agiscono le forze di London?', a: 'Tra tutte', wrong: ['Solo tra molecole apolari', 'Solo tra molecole polari', 'Solo tra ioni'], why: 'Tutte le particelle hanno elettroni in movimento: le forze di London ci sono sempre, anche tra molecole polari.' },
	{ q: 'Perché la forza ione-dipolo è più intensa della forza dipolo-dipolo?', a: 'Lo ione ha una carica intera', wrong: ['Lo ione ha una carica parziale', 'Lo ione è una molecola polare', 'Lo ione è neutro'], why: 'Uno ione ha una carica intera, una molecola polare solo cariche parziali.' },
	{ q: 'Perché nei gas le forze intermolecolari contano poco?', a: 'Le particelle sono lontane', wrong: ['Le particelle sono ferme', 'Le particelle sono cariche', 'I gas non hanno elettroni'], why: 'Le forze intermolecolari si fanno sentire solo quando le particelle sono vicine, come nei liquidi e nei solidi.' },
	{ q: 'Quale di queste è una forza intramolecolare?', a: 'Il legame covalente', wrong: ['La forza di London', 'La forza dipolo-dipolo', 'La forza ione-dipolo'], why: 'Il legame covalente tiene uniti gli atomi dentro una molecola. Le altre tre sono attrazioni tra particelle diverse.' },
];

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: factLevel(FACTS) };

function check(sample: Sample): string[] {
	const v = checkSample(sample);
	if (sample.level === 2 && sample.answer.kind !== 'number') v.push('il livello 2 dà la risposta come numero');
	if (sample.level !== 2 && sample.answer.kind !== 'choice') v.push('solo il livello 2 è a risposta aperta');
	return v;
}

export const chimForzeDipoloLondon: Generator = {
	id: ID,
	title: 'Forze dipolo-dipolo e forze di London',
	levels: {
		1: { label: 'Quali forze agiscono', constraints: ['polarità data nel testo', 'London sempre, dipolo-dipolo solo se polare'] },
		2: { label: 'Gli elettroni di una molecola', constraints: ['somma dei numeri atomici', 'anche a risposta aperta'] },
		3: { label: 'London in una famiglia', constraints: ['quattro sostanze apolari della stessa famiglia', 'più elettroni, ebollizione più alta'] },
		4: { label: 'Stessi elettroni, polarità diversa', constraints: ['coppie con lo stesso numero di elettroni', 'bolle più in alto la polare'] },
		5: { label: 'La forza ione-dipolo', constraints: ["ione e molecola d'acqua", 'legame ionico tra due ioni'] },
		6: { label: 'Forma, polarizzabilità e quando vince London', constraints: ['domande della lezione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check,
};

export default chimForzeDipoloLondon;
