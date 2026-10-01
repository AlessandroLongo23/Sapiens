import data from './elementi.json';

/**
 * The periodic table (/strumenti/tavola-periodica): the elements with their data, where each one sits in the grid,
 * and what the views colour. The data file is written by scripts/tavola-periodica/build.mjs, which names its sources;
 * names and masses are those of the molar mass tool (chimica.ts), so the table and the lessons agree.
 */

export type FamilyId = 'alcalini' | 'alcalino-terrosi' | 'transizione' | 'altri-metalli' | 'semimetalli' | 'non-metalli' | 'alogeni' | 'gas-nobili' | 'lantanidi' | 'attinidi';
export type BlockId = 's' | 'p' | 'd' | 'f';
/** Solid, liquid, gas, or not known at that temperature. */
export type StateId = 's' | 'l' | 'g' | '?';

export interface ChemElement {
	z: number;
	symbol: string;
	name: string;
	/** As written in the lessons: "55,85", or "[98]" for the mass number of an element with no stable isotope. */
	mass: string;
	period: number;
	/** 1 to 18; null for the lanthanides and actinides, drawn in two rows under the table. */
	group: number | null;
	block: BlockId;
	/** Place in the row of the lanthanides or actinides, 1 to 15. */
	series?: number;
	family: FamilyId;
	/** "[Ar] 4s2 3d6": the exponent is the digits after the letter. */
	config: string;
	configPredicted?: boolean;
	/** Pauling scale. */
	electronegativity: number | null;
	/** Covalent radius, single bond, in pm. */
	radius: number | null;
	/** First ionisation energy, kJ/mol. */
	ionization: number | null;
	oxidation: string[];
	/** The oxidation states are calculated, not observed (from rutherfordium on). */
	oxidationPredicted?: boolean;
	/** At 25 °C and 1 atm. */
	state: Exclude<StateId, '?'>;
	/** The state is a prediction: the element has never been made in a visible amount. */
	stateExpected?: boolean;
	/** K. */
	melting: number | null;
	/** K. */
	boiling: number | null;
	/** g/cm³. */
	density: number | null;
	/** Mass number and abundance in per cent of the isotopes found in nature. */
	isotopes: [number, number][];
}

export const ELEMENTI = data as ChemElement[];

export const elementBySymbol = (symbol: string): ChemElement | undefined => ELEMENTI.find((e) => e.symbol.toLowerCase() === symbol.trim().toLowerCase());

export const FAMILIES: { id: FamilyId; name: string }[] = [
	{ id: 'alcalini', name: 'Metalli alcalini' },
	{ id: 'alcalino-terrosi', name: 'Metalli alcalino-terrosi' },
	{ id: 'transizione', name: 'Metalli di transizione' },
	{ id: 'altri-metalli', name: 'Altri metalli' },
	{ id: 'semimetalli', name: 'Semimetalli' },
	{ id: 'non-metalli', name: 'Non metalli' },
	{ id: 'alogeni', name: 'Alogeni' },
	{ id: 'gas-nobili', name: 'Gas nobili' },
	{ id: 'lantanidi', name: 'Lantanidi' },
	{ id: 'attinidi', name: 'Attinidi' }
];
export const familyName = (id: FamilyId): string => FAMILIES.find((f) => f.id === id)!.name;

export const BLOCKS: { id: BlockId; name: string; note: string }[] = [
	{ id: 's', name: 'Blocco s', note: 'gruppi 1 e 2, più l’elio' },
	{ id: 'p', name: 'Blocco p', note: 'gruppi da 13 a 18' },
	{ id: 'd', name: 'Blocco d', note: 'gruppi da 3 a 12, con lantanio e attinio' },
	{ id: 'f', name: 'Blocco f', note: 'dal cerio al lutezio e dal torio al laurenzio' }
];

export const STATES: { id: StateId; name: string }[] = [
	{ id: 's', name: 'Solido' },
	{ id: 'l', name: 'Liquido' },
	{ id: 'g', name: 'Gas' },
	{ id: '?', name: 'Non noto' }
];
export const stateName = (id: StateId): string => STATES.find((s) => s.id === id)!.name;

export const ZERO_CELSIUS = 273.15;

/** Helium does not freeze at 1 atm, whatever the temperature: its melting point in the data is under pressure. */
export const NEVER_SOLID = new Set(['He']);
/**
 * Carbon and arsenic sublime at 1 atm: solid, then gas, at the temperature the data gives as their boiling point.
 * Their melting point is under pressure.
 */
export const SUBLIMES = new Set(['C', 'As']);

/**
 * The state at a temperature in kelvin and 1 atm, from the melting and boiling points. Where a point is not known
 * the state is given only when the other one settles it.
 */
export function stateAt(el: ChemElement, kelvin: number): StateId {
	const { melting, boiling } = el;
	if (NEVER_SOLID.has(el.symbol)) return kelvin < boiling! ? 'l' : 'g';
	if (SUBLIMES.has(el.symbol)) return kelvin < boiling! ? 's' : 'g';
	if (melting !== null && boiling !== null) {
		if (kelvin < melting) return 's';
		return kelvin < boiling ? 'l' : 'g';
	}
	if (melting !== null) return kelvin < melting ? 's' : '?';
	if (boiling !== null) return kelvin >= boiling ? 'g' : '?';
	return '?';
}

// ---------------------------------------------------------------------------------------------------------------
// The periodic trends.

export type TrendId = 'raggio' | 'elettronegativita' | 'ionizzazione';

export interface Trend {
	id: TrendId;
	/** On the switch. */
	label: string;
	/** In full, for the card of an element. */
	name: string;
	unit: string;
	value: (el: ChemElement) => number | null;
	/** Decimals always written, so that a column of values lines up: 2 for the electronegativity ("2,20"). */
	decimals?: number;
	/** How it changes across the table, in one sentence. */
	note: string;
}

export const TRENDS: Trend[] = [
	{
		id: 'raggio',
		label: 'Raggio atomico',
		name: 'Raggio atomico (covalente)',
		unit: 'pm',
		value: (el) => el.radius,
		note: 'In generale cresce scendendo lungo un gruppo e diminuisce da sinistra a destra lungo un periodo. È il raggio covalente, la metà della distanza tra due atomi uguali legati; per i gas nobili è una stima.'
	},
	{
		id: 'elettronegativita',
		label: 'Elettronegatività',
		name: 'Elettronegatività (Pauling)',
		unit: '',
		value: (el) => el.electronegativity,
		decimals: 2,
		note: 'In generale cresce da sinistra a destra lungo un periodo e diminuisce scendendo lungo un gruppo. Il fluoro ha il valore più alto.'
	},
	{
		id: 'ionizzazione',
		label: 'Energia di ionizzazione',
		name: 'Energia di prima ionizzazione',
		unit: 'kJ/mol',
		value: (el) => el.ionization,
		note: 'In generale cresce da sinistra a destra lungo un periodo e diminuisce scendendo lungo un gruppo, con qualche eccezione (il boro meno del berillio, l’ossigeno meno dell’azoto). L’elio ha il valore più alto.'
	},
];
export const trendById = (id: string): Trend => TRENDS.find((t) => t.id === id) ?? TRENDS[0];

/** The smallest and largest value of a trend over the elements that have one. */
export function trendRange(trend: Trend): { min: number; max: number } {
	const values = ELEMENTI.map(trend.value).filter((v): v is number => v !== null);
	return { min: Math.min(...values), max: Math.max(...values) };
}

/**
 * Where each element stands in a trend, 0 for the lowest value to 1 for the highest, by atomic number. By rank, not
 * by value: helium's ionisation energy is twice the next ones, and on a straight scale the rest of the table would
 * be one tint. Equal values share a place.
 */
export function trendRanks(trend: Trend): Map<number, number> {
	const distinct = [...new Set(ELEMENTI.map(trend.value).filter((v): v is number => v !== null))].sort((a, b) => a - b);
	const place = new Map(distinct.map((v, i) => [v, distinct.length > 1 ? i / (distinct.length - 1) : 1]));
	return new Map(ELEMENTI.flatMap((el) => (trend.value(el) === null ? [] : [[el.z, place.get(trend.value(el)!)!] as [number, number]])));
}

/** A trend's value as it is written: "2,20", "116". */
export const trendText = (trend: Trend, value: number): string => (trend.decimals === undefined ? num(value) : value.toFixed(trend.decimals).replace('.', ','));

// ---------------------------------------------------------------------------------------------------------------
// The grid: 18 columns, seven periods, then the two rows of lanthanides and actinides after an empty row.

export const F_ROW_OFFSET = 3;

/** Row and column of an element, both from 1. */
export function gridPlace(el: ChemElement): { row: number; col: number } {
	if (el.group === null) return { row: el.period + F_ROW_OFFSET, col: el.series! + 2 };
	return { row: el.period, col: el.group };
}

/** The two cells of group 3 that stand for the rows under the table. */
export const SERIES_CELLS = [
	{ row: 6, col: 3, label: '57-71', family: 'lantanidi' as FamilyId, name: 'Lantanidi' },
	{ row: 7, col: 3, label: '89-103', family: 'attinidi' as FamilyId, name: 'Attinidi' }
];

// ---------------------------------------------------------------------------------------------------------------
// Writing the values.

/** A number with the decimal comma and a thin space every three digits from 10 000 up. */
export function num(x: number): string {
	const [int, dec] = String(x).split('.');
	const grouped = int.replace('-', '').length > 4 ? int.replace(/\B(?=(\d{3})+$)/g, ' ') : int;
	return (dec ? `${grouped},${dec}` : grouped).replace('-', '−');
}

/** Kelvin as whole degrees Celsius: 1811 → "1538". */
export const celsius = (kelvin: number): string => num(Math.round(kelvin - ZERO_CELSIUS));

/** A trend's value with its unit: "116 pm", "1,83". */
export const withUnit = (trend: Trend, value: number): string => (trend.unit ? `${trendText(trend, value)}\u00a0${trend.unit}` : trendText(trend, value));

/** The configuration in pieces: "[Ar]" as it is, "3d6" as the sublevel "3d" with 6 electrons. */
export function configParts(config: string): { text: string; electrons?: string }[] {
	return config.split(' ').map((part) => {
		const m = /^(\d[spdf])(\d+)$/.exec(part);
		return m ? { text: m[1], electrons: m[2] } : { text: part };
	});
}
