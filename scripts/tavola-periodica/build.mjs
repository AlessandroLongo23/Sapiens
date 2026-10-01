// Builds src/lib/tools/elementi.json, the data of the periodic table (/strumenti/tavola-periodica).
//
//   node scripts/tavola-periodica/build.mjs            from the sources already downloaded
//   node scripts/tavola-periodica/build.mjs --scarica  downloads the sources first
//
// Sources, kept in scripts/tavola-periodica/fonti/ (not committed):
// - names and masses: ELEMENT_DATA in src/lib/tools/chimica.ts (IUPAC CIAAW 2021, two decimals, as in the lessons);
// - PubChem periodic table (NCBI): configuration, electronegativity (Pauling), first ionisation energy (eV),
//   oxidation states, melting and boiling points (K), density (g/cm³), family. Its electron affinities (fluorine
//   2% off, no value where the anion is unstable) and years of discovery (aluminium "ancient") are left out;
// - NIST, Atomic Weights and Isotopic Compositions: the isotopes found in nature and their abundance;
// - covalent radii (single bond, pm): the table in Wikipedia's "Atomic radii of the elements (data page)".
//   PubChem's radius is the van der Waals one, which does not show the trend the school books teach.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '../..');
const cache = path.join(here, 'fonti');
const OUT = path.join(root, 'src/lib/tools/elementi.json');

const SOURCES = {
	'pubchem.json': 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON',
	'nist.html': 'https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&all=all&ascii=ascii2&isotype=some',
	'raggi.wiki': 'https://en.wikipedia.org/w/index.php?title=Atomic_radii_of_the_elements_(data_page)&action=raw'
};

if (process.argv.includes('--scarica')) {
	await mkdir(cache, { recursive: true });
	for (const [file, url] of Object.entries(SOURCES)) {
		const res = await fetch(url, { headers: { 'user-agent': 'sapiens-tavola-periodica/1.0' } });
		if (!res.ok) throw new Error(`${url}: ${res.status}`);
		await writeFile(path.join(cache, file), await res.text());
		console.log('scaricato', file);
	}
}
for (const file of Object.keys(SOURCES)) {
	if (!existsSync(path.join(cache, file))) throw new Error(`Manca ${file}: lancia lo script con --scarica.`);
}
const read = (file) => readFile(path.join(cache, file), 'utf8');

// ---------------------------------------------------------------------------------------------------------------
// Names and masses, from the molar mass tool.

const chimica = await readFile(path.join(root, 'src/lib/tools/chimica.ts'), 'utf8');
const names = /const ELEMENT_DATA = `([^`]+)`/.exec(chimica)[1].split('|').map((entry) => {
	const [symbol, name, mass] = entry.split(' ');
	return { symbol, name, mass: mass.replace('.', ',') };
});
if (names.length !== 118) throw new Error(`chimica.ts ha ${names.length} elementi`);

// ---------------------------------------------------------------------------------------------------------------
// PubChem.

const table = JSON.parse(await read('pubchem.json')).Table;
const columns = table.Columns.Column;
const pubchem = table.Row.map((row) => Object.fromEntries(row.Cell.map((cell, i) => [columns[i], cell])));

const FAMILY = {
	'Alkali metal': 'alcalini',
	'Alkaline earth metal': 'alcalino-terrosi',
	'Transition metal': 'transizione',
	'Post-transition metal': 'altri-metalli',
	Metalloid: 'semimetalli',
	Nonmetal: 'non-metalli',
	Halogen: 'alogeni',
	'Noble gas': 'gas-nobili',
	Lanthanide: 'lantanidi',
	Actinide: 'attinidi'
};
const STATE = { Solid: 's', Liquid: 'l', Gas: 'g' };
const EV_TO_KJ_MOL = 96.485;

/** "+3", "−1", "0": PubChem leaves the plus out for some elements. */
const oxidation = (s) => {
	const n = Number(s.trim());
	return n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0';
};
/** Sublevels in the order they fill (n + l, then n): 4s before 3d, 6s before 4f before 5d. PubChem mixes two orders. */
const fillingOrder = (sub) => {
	const n = Number(sub[0]);
	const l = 'spdf'.indexOf(sub[1]);
	return (n + l) * 10 + n;
};
function configuration(raw) {
	const [core, ...subs] = raw.replace(/\s*\((predicted|calculated)\)/, '').replace(/\](?=\d)/, '] ').split(' ');
	const all = core.startsWith('[') ? subs : [core, ...subs];
	all.sort((x, y) => fillingOrder(x) - fillingOrder(y));
	return (core.startsWith('[') ? [core, ...all] : all).join(' ');
}

const num = (s) => (s === '' || s === undefined ? null : Number(s));
/** Significant digits kept on a derived value. */
const round = (x, digits) => Number(x.toPrecision(digits));

// ---------------------------------------------------------------------------------------------------------------
// Position: period, group (null in the f rows) and block, from the atomic number.

const PERIOD_END = [2, 10, 18, 36, 54, 86, 118];
function position(z) {
	const period = PERIOD_END.findIndex((end) => z <= end) + 1;
	const index = z - (period === 1 ? 0 : PERIOD_END[period - 2]);
	if (period === 1) return { period, group: z === 1 ? 1 : 18, block: 's' };
	if (period <= 3) return index <= 2 ? { period, group: index, block: 's' } : { period, group: index + 10, block: 'p' };
	if (period <= 5) return { period, group: index, block: index <= 2 ? 's' : index <= 12 ? 'd' : 'p' };
	if (index <= 2) return { period, group: index, block: 's' };
	// La to Lu and Ac to Lr, the fifteen elements of the two rows under the table; `series` is their place in the row.
	// Lanthanum and actinium have a d electron and no f electron: block d, like the group 3 they stand under; the
	// fourteen that follow fill the f sublevel.
	if (index <= 17) return { period, group: null, block: index === 3 ? 'd' : 'f', series: index - 2 };
	const group = index - 14;
	return { period, group, block: group <= 12 ? 'd' : 'p' };
}

// ---------------------------------------------------------------------------------------------------------------
// Isotopes found in nature, with their abundance in per cent.

const isotopes = new Map();
for (const block of (await read('nist.html')).split(/\n\s*\n/)) {
	const field = (name) => new RegExp(`${name} = (.*)`).exec(block)?.[1].trim();
	const z = Number(field('Atomic Number'));
	const share = field('Isotopic Composition');
	if (!z || !share) continue;
	// "0.999885(70)" → 99,9885; a lone "1" is an element with one isotope.
	const percent = Number(share.replace(/\(.*\)/, '')) * 100;
	if (!Number.isFinite(percent)) continue;
	if (!isotopes.has(z)) isotopes.set(z, []);
	// Four significant digits, more for a share close to 100 so that the shares of an element still add up to 100.
	isotopes.get(z).push([Number(field('Mass Number')), round(percent, percent > 99 ? 6 : 4)]);
}

// ---------------------------------------------------------------------------------------------------------------
// Covalent radii.

const radii = new Map();
for (const row of (await read('raggi.wiki')).split(/\n\|-\s*\n/)) {
	const head = /^\|\s*(\d+)\s*\|\|\s*(\w+)\s*\|\|/.exec(row);
	if (!head) continue;
	const cells = row.split('\n').slice(1).filter((line) => line.startsWith('|'));
	// Columns: empirical, calculated, van der Waals, covalent (single bond), covalent (triple bond), metallic.
	const covalent = (cells[3] ?? '').replace(/<ref[^>]*\/>/g, '').replace(/<ref[\s\S]*?<\/ref>/g, '');
	const value = /^\|\s*(\d+)/.exec(covalent);
	if (value) radii.set(Number(head[1]), Number(value[1]));
}

// ---------------------------------------------------------------------------------------------------------------

const elements = pubchem.map((p, i) => {
	const z = i + 1;
	const own = names[i];
	if (Number(p.AtomicNumber) !== z || p.Symbol !== own.symbol) throw new Error(`Z = ${z}: ${p.Symbol} non è ${own.symbol}`);
	const family = FAMILY[p.GroupBlock];
	if (!family) throw new Error(`Famiglia sconosciuta: ${p.GroupBlock}`);
	const predicted = /\(predicted\)|\(calculated\)/.test(p.ElectronConfiguration);
	const expected = p.StandardState.startsWith('Expected to be a ');
	const state = STATE[p.StandardState.replace('Expected to be a ', '')];
	if (!state) throw new Error(`Stato sconosciuto: ${p.StandardState}`);
	const ev = (s) => (num(s) === null ? null : round(num(s) * EV_TO_KJ_MOL, 4));
	return {
		z,
		symbol: own.symbol,
		name: own.name,
		mass: own.mass,
		...position(z),
		family,
		config: configuration(p.ElectronConfiguration),
		...(predicted ? { configPredicted: true } : {}),
		electronegativity: num(p.Electronegativity),
		radius: radii.get(z) ?? null,
		ionization: ev(p.IonizationEnergy),
		oxidation: p.OxidationStates ? p.OxidationStates.split(',').map(oxidation) : [],
		// From rutherfordium on nobody has done the chemistry: the states are calculated.
		...(z >= 104 && p.OxidationStates ? { oxidationPredicted: true } : {}),
		state,
		...(expected ? { stateExpected: true } : {}),
		melting: num(p.MeltingPoint),
		boiling: num(p.BoilingPoint),
		density: num(p.Density),
		isotopes: isotopes.get(z) ?? []
	};
});

await writeFile(OUT, `[\n${elements.map((e) => `\t${JSON.stringify(e)}`).join(',\n')}\n]\n`);
console.log(`${elements.length} elementi in ${path.relative(root, OUT)}`);
