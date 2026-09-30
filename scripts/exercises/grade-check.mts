/**
 * Checks the open-answer grader (src/lib/exercises/v2/grade/) on every level that takes an open answer.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/grade-check.mts [samples per level, default 50] [generator id]
 *
 * For each sample:
 * - the generator's own answer (answer.latex, with its labels: "S = …", "A ∪ B = …") is graded right;
 * - so are the other writings a student uses: x₁ = …, x₂ = …; x = a ∨ x = b; the reverse order; ∅ and "impossibile";
 *   ℝ and "indeterminata"; x ≠ a; a decimal for a fraction; a fraction not reduced where the value is enough;
 * - every wrong option of the multiple choice is graded wrong (a wrong value, or the right value in the wrong form);
 * - the problem copied as the answer is graded wrong, where the problem is an expression.
 * Prints the levels with failures and a few examples of each; exits 1 if any.
 */
import { configs } from '../../src/lib/exercises/config';
import { gradeOpen } from '../../src/lib/exercises/v2/grade/grade';
import { type Node, fromSympy } from '../../src/lib/exercises/v2/grade/node';
import { openAnswers } from '../../src/lib/exercises/v2/open-answers';
import { getGenerator } from '../../src/lib/exercises/v2/registry';
import { createRng, deriveSeed } from '../../src/lib/exercises/v2/rng';
import type { OpenGrading, Sample } from '../../src/lib/exercises/v2/types';

/** LaTeX of a node, as MathLive would write it. */
function tex(n: Node): string {
	switch (n.t) {
		case 'num':
			return n.v.den === 1 ? String(n.v.num) : `${n.v.num < 0 ? '-' : ''}\\frac{${Math.abs(n.v.num)}}{${n.v.den}}`;
		case 'sym':
			return n.name;
		case 'pi':
			return '\\pi';
		case 'paren':
			return `\\left(${tex(n.a)}\\right)`;
		case 'neg':
			return `-${n.a.t === 'add' ? `\\left(${tex(n.a)}\\right)` : tex(n.a)}`;
		case 'add':
			return n.args.map((a, i) => (i && !tex(a).startsWith('-') ? '+' : '') + tex(a)).join('');
		case 'mul':
			return n.args.map((a) => (a.t === 'add' ? `\\left(${tex(a)}\\right)` : tex(a))).join('\\cdot ');
		case 'div':
			return `\\frac{${tex(n.a)}}{${tex(n.b)}}`;
		case 'pow':
			return `${['sym', 'num', 'pi'].includes(n.a.t) && !(n.a.t === 'num' && n.a.v.num < 0) ? tex(n.a) : `\\left(${tex(n.a)}\\right)`}^{${tex(n.b)}}`;
		case 'root':
			return n.n === 2 ? `\\sqrt{${tex(n.a)}}` : `\\sqrt[${n.n}]{${tex(n.a)}}`;
		case 'abs':
			return `\\left|${tex(n.a)}\\right|`;
	}
}

/** A fraction's terminating decimal with the Italian comma, or null. */
function decimalOf(p: number, qd: number): string | null {
	let d = qd;
	for (const f of [2, 5]) while (d % f === 0) d /= f;
	if (d !== 1) return null;
	const s = (p / qd).toString();
	return s.includes('e') ? null : s.replace('.', '{,}');
}

/** A fraction as a decimal with the Italian comma, the period under a bar: 87/44 is 1{,}97\\overline{72}. */
function periodicOf(p: number, qd: number): string {
	const sign = p < 0 ? '-' : '';
	p = Math.abs(p);
	const whole = Math.floor(p / qd);
	let r = p % qd;
	if (r === 0) return `${sign}${whole}`;
	const digits: number[] = [];
	const seen = new Map<number, number>();
	while (r !== 0 && !seen.has(r)) {
		seen.set(r, digits.length);
		r *= 10;
		digits.push(Math.floor(r / qd));
		r %= qd;
	}
	if (r === 0) return `${sign}${whole}{,}${digits.join('')}`;
	const start = seen.get(r)!;
	return `${sign}${whole}{,}${digits.slice(0, start).join('')}\\overline{${digits.slice(start).join('')}}`;
}

/** Right answers a student may write that are not the generator's own LaTeX. */
function writings(s: Sample, g: OpenGrading): string[] {
	const a = s.answer;
	if (a.kind === 'set') {
		const vs = a.values.map((v) => tex(fromSympy(v)));
		if (g.grade === 'value' && g.set === 'excluded' && vs.length === 0) return ['D=\\mathbb{R}', '\\text{nessuna condizione}'];
		if (g.grade === 'value' && g.set === 'excluded') return [vs.map((v) => `x\\neq ${v}`).join(',\\ '), `D=\\mathbb{R}\\setminus\\left\\{${vs.join(',')}\\right\\}`];
		if (a.universal) return ['\\mathbb{R}', '\\text{indeterminata}'];
		if (vs.length === 0) return ['\\emptyset', 'S=\\emptyset', '\\text{impossibile}'];
		if (vs.length === 1) return [`x=${vs[0]}`];
		return [
			vs.map((v, i) => `x_{${i + 1}}=${v}`).join(',\\ '),
			vs.map((v) => `x=${v}`).join('\\lor '),
			`S=\\left\\{${[...vs].reverse().join(';')}\\right\\}`,
		];
	}
	if (a.kind === 'number') {
		const [p, qd = '1'] = a.value.split('/');
		const out: string[] = [];
		const dec = qd !== '1' ? decimalOf(Number(p), Number(qd)) : null;
		const decimalOk = !(g.grade === 'form' && g.form === 'irreducible');
		if (dec && decimalOk) out.push(dec);
		if (g.grade === 'value') out.push(`\\frac{${2 * Number(p)}}{${2 * Number(qd)}}`);
		return out;
	}
	return [];
}

async function main(): Promise<number> {
	const count = Number(process.argv[2] ?? 50);
	const only = process.argv[3];
	const math = new Set(Object.entries(configs).filter(([p]) => p.startsWith('high_school/math/')).map(([, c]) => c.generator));
	const failures = new Map<string, string[]>();
	const fail = (where: string, what: string) => {
		const list = failures.get(where) ?? [];
		list.push(what);
		failures.set(where, list);
	};
	let checked = 0;
	for (const [id, levels] of Object.entries(openAnswers)) {
		if (only && id !== only) continue;
		if (!math.has(id)) continue;
		const gen = await getGenerator(id);
		for (const [lv, grading] of Object.entries(levels)) {
			const level = Number(lv);
			const where = `${id}#${level}`;
			for (let i = 0; i < count; i++) {
				const seed = 700_001 + i * 104_729;
				let s: Sample;
				try {
					s = gen.generate(createRng(seed), level);
				} catch {
					continue;
				}
				if (s.answer.kind === 'choice') continue;
				checked++;
				const expectRight = (latex: string, what: string) => {
					let v;
					try {
						v = gradeOpen(s, grading, latex);
					} catch (e) {
						return fail(where, `${what} threw ${(e as Error).message.split('\n')[0]} :: ${latex}`);
					}
					if (!v.correct) fail(where, `${what} graded wrong (${v.reason ?? 'value'}) :: ${latex}`);
				};
				const expectWrong = (latex: string, what: string) => {
					let v;
					try {
						v = gradeOpen(s, grading, latex);
					} catch (e) {
						return fail(where, `${what} threw ${(e as Error).message.split('\n')[0]} :: ${latex}`);
					}
					if (v.correct) fail(where, `${what} graded right :: ${latex}`);
				};
				const decimalAsked = grading.grade === 'form' && grading.form === 'decimal' && s.answer.kind === 'number';
				const [p, qd = '1'] = s.answer.kind === 'number' ? s.answer.value.split('/') : [];
				const reference = s.answer.kind === 'number' ? (decimalAsked ? periodicOf(Number(p), Number(qd)) : tex(fromSympy(s.answer.value))) : s.answer.latex;
				expectRight(reference, 'reference');
				for (const w of writings(s, grading)) expectRight(w, 'writing');
				const choice = s.choice ?? gen.toChoice?.(s, createRng(deriveSeed(seed, level)));
				if (choice) choice.options.forEach((o, k) => k !== choice.correct && !o.figure && expectWrong(o.latex, 'distractor'));
				const copyCounts = grading.grade === 'form' || s.answer.kind === 'number';
				// "Scomponi, se possibile": a polynomial that does not factor is its own answer
				const isItsOwnAnswer = s.answer.kind === 'expression' && (s.answer.latex.replace(/\s/g, '') === s.problem.replace(/\s/g, '') || /irriducibil/i.test(s.answer.latex));
				if (isItsOwnAnswer) expectRight('\\text{irriducibile}', 'writing');
				if (copyCounts && !isItsOwnAnswer && !/\\text|\\begin|\\quad|,|=/.test(s.problem)) expectWrong(s.problem, 'problem copied');
			}
		}
	}
	let total = 0;
	for (const [where, list] of failures) {
		total += list.length;
		console.log(`${where}: ${list.length} failures`);
		for (const f of [...new Set(list)].slice(0, 4)) console.log(`    ${f.slice(0, 220)}`);
	}
	console.log(`${checked} samples checked, ${total} failures in ${failures.size} levels`);
	return total ? 1 : 0;
}

main().then((code) => process.exit(code));
