// The limiting reagent of a balanced reaction, the products and the excess. Run with `npm run test:unit`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createJiti } from 'jiti';
import { assertReadable } from './readable-outcome.mjs';

const jiti = createJiti(import.meta.url, { alias: { '@': new URL('../../src', import.meta.url).pathname } });
const { reagenteLimitante, parseReaction, reagentsOf } = await jiti.import('../../src/lib/tools/reagente-limitante.ts');
const { ELEMENTS } = await jiti.import('../../src/lib/tools/chimica.ts');

const ok = (o) => {
	assert.ok(o.ok, o.error);
	assertReadable(o);
	return o;
};
const run = (r, ...amounts) => {
	const state = { r };
	amounts.forEach(([x, u], i) => {
		state['abcd'[i]] = x;
		state[`u${'abcd'[i]}`] = u;
	});
	return reagenteLimitante(state);
};
const row = (o, label) => o.rows.find((r) => r.label === label)?.value;
/** "$\\approx 72{,}08\\ \\text{g}$ ($4\\ \\text{mol}$)" → [72.08, 4]. */
function nums(value) {
	return [...value.matchAll(/\$(?:\\approx )?(-?\d+(?:\\,\d{3})*)(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?/g)].map((m) => Number(`${m[1].replace(/\\,/g, '')}.${m[2] ?? '0'}`) * 10 ** Number(m[3] ?? 0));
}

test('the example: water from hydrogen and oxygen', () => {
	const o = ok(run('2H2 + O2 -> 2H2O', ['10', 'g'], ['64', 'g']));
	assert.equal(row(o, 'Reagente limitante'), '$\\mathrm{O_{2}}$');
	assert.equal(row(o, 'H₂O che si forma'), '$72{,}08\\ \\text{g}$ ($4\\ \\text{mol}$)');
	assert.equal(row(o, 'H₂ in eccesso che avanza'), '$1{,}92\\ \\text{g}$ ($\\approx 0{,}9505\\ \\text{mol}$)');
	assert.equal(o.copy, 'Reagente limitante: O₂');
	const steps = JSON.stringify(o.steps);
	assert.match(steps, /è bilanciata/);
	assert.match(steps, /10\\\\ \\\\text\{g\} - 8\{,\}08\\\\ \\\\text\{g\}/);
	assert.ok(o.steps[0].group, 'grouped');
});

test('other reactions and units', () => {
	const nh3 = ok(run('N2 + 3H2 -> 2NH3', ['28', 'g'], ['10', 'g']));
	assert.equal(row(nh3, 'Reagente limitante'), '$\\mathrm{N_{2}}$');
	const [g] = nums(row(nh3, 'NH₃ che si forma'));
	assert.ok(Math.abs(g - (28 / 28.02) * 2 * 17.04) < 0.01, `${g}`);
	const fe = ok(run('4Fe + 3O2 -> 2Fe2O3', ['1', 'mol'], ['1', 'mol']));
	assert.equal(row(fe, 'Reagente limitante'), '$\\mathrm{Fe}$');
	assert.equal(row(fe, 'Fe₂O₃ che si forma'), '$79{,}85\\ \\text{g}$ ($0{,}5\\ \\text{mol}$)');
	assert.equal(row(fe, 'O₂ in eccesso che avanza'), '$8\\ \\text{g}$ ($0{,}25\\ \\text{mol}$)');
	const ch4 = ok(run('CH4 + 2O2 -> CO2 + 2H2O', ['16', 'g'], ['48', 'g']));
	assert.equal(row(ch4, 'Reagente limitante'), '$\\mathrm{O_{2}}$');
	assert.equal(row(ch4, 'CO₂ che si forma'), '$\\approx 33{,}01\\ \\text{g}$ ($0{,}75\\ \\text{mol}$)');
	assert.equal(row(ch4, 'H₂O che si forma'), '$27{,}03\\ \\text{g}$ ($1{,}5\\ \\text{mol}$)');
	// Kilograms, arrows and states.
	const kg = ok(run('2H2(g) + O2(g) → 2H2O(l)', ['0,01', 'kg'], ['64', 'g']));
	assert.equal(row(kg, 'Reagente limitante'), '$\\mathrm{O_{2}}$');
	assert.match(JSON.stringify(kg.steps), /0\{,\}01\\\\ \\\\text\{kg\} = 10\\\\ \\\\text\{g\}/);
	assert.equal(ok(run('2H2 + O2 = 2H2O', ['10', 'g'], ['64', 'g'])).copy, 'Reagente limitante: O₂');
	assert.equal(ok(run('2 H2 + O2 --> 2 H2O', ['10', 'g'], ['64', 'g'])).copy, 'Reagente limitante: O₂');
	// Exact proportions: no limiting reagent, nothing left.
	const tie = ok(run('N2 + 3H2 -> 2NH3', ['1', 'mol'], ['3', 'mol']));
	assert.equal(row(tie, 'Reagente limitante'), 'nessuno: i reagenti finiscono insieme');
	assert.equal(tie.copy, 'Nessun reagente limitante');
	assert.equal(tie.rows.length, 2);
	// Three reagents, two of them limiting together.
	const three = ok(run('H2 + O2 + 2Na -> 2NaOH', ['1', 'mol'], ['1', 'mol'], ['5', 'mol']));
	assert.equal(row(three, 'Reagenti limitanti'), '$\\mathrm{H_{2}}$ e $\\mathrm{O_{2}}$');
	assert.equal(row(three, 'Na in eccesso che avanza'), '$68{,}97\\ \\text{g}$ ($3\\ \\text{mol}$)');
	assert.deepEqual(reagentsOf('H2 + O2 + 2Na -> 2NaOH'), ['H₂', 'O₂', 'Na']);
	assert.equal(reagentsOf('H2 + '), null);
});

test('reactions that are not balanced, or not reactions', () => {
	const unbalanced = run('H2 + O2 -> H2O', ['10', 'g'], ['64', 'g']);
	assert.equal(unbalanced.ok, false);
	assert.match(unbalanced.error, /non è bilanciata/);
	assert.match(unbalanced.error, /atomi di O sono 2 a sinistra e 1 a destra/);
	assertReadable(unbalanced);
	assert.match(run('Fe + O2 -> Fe2O3', ['1', 'mol'], ['1', 'mol']).error, /non bilancia/);
	const bad = [
		'',
		'H2 + O2',
		'H2 -> H2O -> O2',
		'2H2O2 -> 2H2O + O2',
		'1/2O2 + H2 -> H2O',
		'0,5O2 + H2 -> H2O',
		'0H2 + O2 -> H2O',
		'h2 + o2 -> h2o',
		'H2 + + O2 -> H2O',
		'H2 + O2 -> ',
		'A + B + C + D + E -> F',
		'2H2 + O2 -> 2H2O'.repeat(10)
	];
	for (const r of bad) {
		const o = run(r, ['1', 'g'], ['1', 'g'], ['1', 'g'], ['1', 'g']);
		assert.equal(o.ok, false, r);
		assertReadable(o);
	}
	assert.equal(typeof parseReaction('2H2O2 -> 2H2O + O2'), 'string');
	for (const amounts of [
		[['', 'g'], ['64', 'g']],
		[['10', 'g'], ['0', 'g']],
		[['10', 'g'], ['-3', 'g']],
		[['dieci', 'g'], ['64', 'g']]
	]) {
		const o = run('2H2 + O2 -> 2H2O', ...amounts);
		assert.equal(o.ok, false, JSON.stringify(amounts));
		assertReadable(o);
	}
});

test('brute force against a float calculation', () => {
	const M = (f) => {
		let m = 0;
		for (const [, sym, n] of f.matchAll(/([A-Z][a-z]?)(\d*)/g)) m += Math.round(ELEMENTS.find((e) => e.symbol === sym).mass.toNumber() * 100) * Number(n || 1);
		return m / 100;
	};
	const reactions = [
		[[[2, 'H2'], [1, 'O2']], [[2, 'H2O']]],
		[[[1, 'N2'], [3, 'H2']], [[2, 'NH3']]],
		[[[4, 'Fe'], [3, 'O2']], [[2, 'Fe2O3']]],
		[[[1, 'CH4'], [2, 'O2']], [[1, 'CO2'], [2, 'H2O']]],
		[[[2, 'Al'], [3, 'Cl2']], [[2, 'AlCl3']]],
		[[[1, 'Zn'], [2, 'HCl']], [[1, 'ZnCl2'], [1, 'H2']]],
		[[[1, 'C3H8'], [5, 'O2']], [[3, 'CO2'], [4, 'H2O']]]
	];
	const str = (side) => side.map(([c, f]) => `${c === 1 ? '' : c}${f}`).join(' + ');
	for (let i = 0; i < 300; i++) {
		const [reag, prod] = reactions[Math.floor(Math.random() * reactions.length)];
		const grams = reag.map(() => Math.round((1 + Math.random() * 200) * 100) / 100);
		const o = ok(run(`${str(reag)} -> ${str(prod)}`, ...grams.map((g) => [String(g).replace('.', ','), 'g'])));
		const n = reag.map(([, f], j) => grams[j] / M(f));
		const per = reag.map(([c], j) => n[j] / c);
		const least = Math.min(...per);
		const lim = per.findIndex((p) => p === least);
		if (per.filter((p) => Math.abs(p - least) < 1e-12).length > 1) continue;
		const sub = (f) => f.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
		assert.equal(o.copy, `Reagente limitante: ${sub(reag[lim][1])}`);
		for (const [c, f] of prod) {
			const [g, mol] = nums(row(o, `${sub(f)} che si forma`));
			const want = least * c;
			assert.ok(Math.abs(mol - want) <= 5e-4 * want, `${f}: ${mol} vs ${want}`);
			assert.ok(Math.abs(g - want * M(f)) <= 5e-4 * want * M(f) + 0.005, `${f}: ${g} vs ${want * M(f)}`);
		}
		reag.forEach(([c, f], j) => {
			if (j === lim) return;
			const [g] = nums(row(o, `${sub(f)} in eccesso che avanza`));
			const want = grams[j] - least * c * M(f);
			assert.ok(Math.abs(g - want) <= 5e-4 * Math.abs(want) + 0.005, `${f}: ${g} vs ${want}`);
		});
	}
});
