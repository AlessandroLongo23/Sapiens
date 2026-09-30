/**
 * Answers written by hand as a student types them in MathLive, graded by the open-answer grader: the writings the
 * decisions promise and the usual mistakes. Complements grade-check.mts, which only uses what the generators write.
 *
 *   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/grade-cases.mts
 */
import { gradeOpen } from '../../src/lib/exercises/v2/grade/grade';
import type { Answer, OpenGrading, Sample } from '../../src/lib/exercises/v2/types';

const V: OpenGrading = { grade: 'value' };
const F: OpenGrading = { grade: 'form' };
const EXCLUDED: OpenGrading = { grade: 'value', set: 'excluded' };
const form = (f: Extract<OpenGrading, { grade: 'form' }>['form']): OpenGrading => ({ grade: 'form', form: f });

const sample = (answer: Answer, problem = '', prompt = ''): Sample => ({
	generatorId: 'casi',
	level: 1,
	seed: 1,
	prompt,
	problem,
	solution: '',
	steps: [],
	answer,
	params: {},
});
const set = (values: string[], universal = false): Answer => ({ kind: 'set', values, latex: '', universal });
const number = (value: string): Answer => ({ kind: 'number', value });
const expression = (value: string, latex = '', f?: string): Answer => ({ kind: 'expression', value, latex, form: f });

type Case = [label: string, s: Sample, g: OpenGrading, latex: string, right: boolean];
const quadratic = sample(set(['0', '2']), 'x^2 - 2x = 0');
const irrational = sample(set(['(3-sqrt(5))/2', '(3+sqrt(5))/2']));
const cases: Case[] = [
	// sets of solutions: every usual writing, and the Italian decimal comma
	['x = 0, 2', quadratic, V, 'x=0,2', true],
	['x = 0{,}2 read as a list', quadratic, V, 'x=0{,}2', true],
	['x₁ = 0, x₂ = 2', quadratic, V, 'x_1=0,\\ x_2=2', true],
	['x₁, x₂ = 0, 2', quadratic, V, 'x_1,x_2=0,2', true],
	['x = 0 ∨ x = 2', quadratic, V, 'x=0\\lor x=2', true],
	['S = {2; 0}', quadratic, V, 'S=\\left\\{2;0\\right\\}', true],
	['0 e 2', quadratic, V, '0\\text{ e }2', true],
	['only one solution', quadratic, V, 'x=0', false],
	['a wrong one', quadratic, V, 'x=0,\\ x=-2', false],
	['the equation copied', quadratic, V, 'x^2-2x=0', false],
	['± in a fraction', irrational, V, 'x=\\frac{3\\pm\\sqrt{5}}{2}', true],
	['± split', irrational, V, 'x_1=\\frac{3-\\sqrt{5}}{2},\\ x_2=\\frac{3+\\sqrt{5}}{2}', true],
	['± with the wrong sign inside', irrational, V, 'x=\\frac{-3\\pm\\sqrt{5}}{2}', false],
	['impossibile', sample(set([])), V, '\\text{impossibile}', true],
	['impossibile typed as letters', sample(set([])), V, 'impossibile', true],
	['S = ∅', sample(set([])), V, 'S=\\varnothing', true],
	['nessuna soluzione', sample(set([])), V, '\\text{nessuna soluzione}', true],
	['a value where there is none', sample(set([])), V, 'x=3', false],
	['indeterminata', sample(set([], true)), V, '\\text{indeterminata}', true],
	['S = ℝ', sample(set([], true)), V, 'S=\\mathbb{R}', true],
	['ℝ where there is one solution', sample(set(['3'])), V, '\\mathbb{R}', false],
	// domains and conditions of existence
	['x ≠ ±2/3', sample(set(['-2/3', '2/3'])), EXCLUDED, 'x\\neq\\pm\\frac{2}{3}', true],
	['x ≠ 0 e x ≠ 1', sample(set(['0', '1'])), EXCLUDED, 'x\\ne0\\land x\\ne1', true],
	['D = ℝ ∖ {−1, 0}', sample(set(['-1', '0'])), EXCLUDED, 'D=\\mathbb{R}\\setminus\\left\\{-1,0\\right\\}', true],
	['one condition missing', sample(set(['-1', '0'])), EXCLUDED, 'x\\neq0', false],
	['the values without ≠', sample(set(['-1', '0'])), EXCLUDED, 'x=-1,\\ x=0', false],
	// numbers
	['a percentage', sample(number('-25')), V, '-25\\%', true],
	['the sign lost', sample(number('-25')), V, '25\\%', false],
	['a length with its unit', sample(number('25')), V, '25\\,\\mathrm{cm}', true],
	['a unit typed as letters', sample(number('25')), V, '25cm', true],
	['an angle in degrees', sample(number('149')), V, '149^{\\circ}', true],
	['a decimal for a fraction', sample(number('6/5')), V, '1{,}2', true],
	['a periodic decimal', sample(number('1/3')), V, '0{,}\\overline{3}', true],
	['a rounded decimal', sample(number('1/3')), V, '0{,}33', false],
	['a fraction still to reduce', sample(number('6/5')), V, '\\frac{12}{10}', true],
	['the calculation copied', sample(number('38'), '23 + 60 : 4'), V, '23+60:4', false],
	['a division with ":"', sample(number('15'), '(-120) : (-8)'), V, '(-120):(-8)', false],
	['reduce: in lowest terms', sample(number('-4/15')), form('irreducible'), '-\\frac{4}{15}', true],
	['reduce: sign on the numerator', sample(number('-4/15')), form('irreducible'), '\\frac{-4}{15}', true],
	['reduce: not reduced', sample(number('-4/15')), form('irreducible'), '-\\frac{8}{30}', false],
	['reduce: a decimal', sample(number('1/4')), form('irreducible'), '0{,}25', false],
	['to decimal: periodic', sample(number('87/44')), form('decimal'), '1{,}97\\overline{72}', true],
	['to decimal: the fraction back', sample(number('87/44')), form('decimal'), '\\frac{87}{44}', false],
	// expressions: forms
	['expanded, any order', sample(expression('9 - y**2', '9 - y^2', 'expanded')), F, '-y^2+9', true],
	['expanded: product left', sample(expression('9 - y**2', '9 - y^2', 'expanded'), '(3 - y)(3 + y)'), F, '(3-y)(3+y)', false],
	['expanded: like terms apart', sample(expression('x**2 - 2*x + 1', '', 'expanded')), F, 'x^2-x-x+1', false],
	['monomial in normal form', sample(expression('30*x**4*y**7*z**3'), '(-6xy^3)\\cdot(-5x^3y^4z^3)'), form('expanded'), '30x^4y^7z^3', true],
	['monomial: product copied', sample(expression('30*x**4*y**7*z**3'), '(-6xy^3)\\cdot(-5x^3y^4z^3)'), form('expanded'), '(-6xy^3)\\cdot(-5x^3y^4z^3)', false],
	['factored', sample(expression('3*x**2*(7*x - 6)', '', 'factored')), F, '3x^2(7x-6)', true],
	['factored, other order and sign', sample(expression('-(y + 2)*(y + 11)', '', 'factored')), F, '(-y-2)(y+11)', true],
	['factored: common factor left inside', sample(expression('3*x**2*(7*x - 6)', '', 'factored')), F, 'x^2(21x-18)', false],
	['factored: not to the end', sample(expression('(x - 1)*(x + 1)*(x - 7)', '', 'factored')), F, '(x^2-1)(x-7)', false],
	['algebraic fraction, denominator multiplied out', sample(expression('(x - 16)/((x - 6)*(x - 1))')), form('irreducible'), '\\frac{x-16}{x^2-7x+6}', true],
	['algebraic fraction not reduced', sample(expression('x/(x - 4)')), form('irreducible'), '\\frac{x^2+6x}{x^2+2x-24}', false],
	['radical simplified', sample(expression('3*root(3, 3)', '', 'simplified')), F, '3\\sqrt[3]{3}', true],
	['radical not simplified', sample(expression('3*root(3, 3)', '', 'simplified')), F, '\\sqrt[3]{81}', false],
	['rationalized', sample(expression('6*sqrt(17)/17', '', 'rationalized')), F, '\\frac{6\\sqrt{17}}{17}', true],
	['a radical below', sample(expression('6*sqrt(17)/17', '', 'rationalized')), F, '\\frac{6}{\\sqrt{17}}', false],
	['line in explicit form', sample(expression('5*x/2 + 23/2')), form('explicit'), 'y=\\frac{5x+23}{2}', true],
	['line in implicit form', sample(expression('5*x/2 + 23/2')), form('explicit'), '5x-2y+23=0', false],
	['inverse written in x', sample(expression('(y - 2)/6')), V, 'f^{-1}(x)=\\frac{x-2}{6}', true],
	['π left in', sample(expression('169*pi')), V, '169\\pi', true],
	['π as a decimal', sample(expression('169*pi')), V, '530{,}93', false],
	['a word where a formula is due', sample(expression('x + 1')), V, '\\text{boh}', false],
	['brackets that do not close', sample(expression('x + 1')), V, '(x+1', false],
];

let failed = 0;
for (const [label, s, g, latex, right] of cases) {
	let v;
	try {
		v = gradeOpen(s, g, latex);
	} catch (e) {
		failed++;
		console.log(`THREW  ${label} :: ${latex} :: ${(e as Error).message}`);
		continue;
	}
	if (v.correct !== right) {
		failed++;
		console.log(`FAIL   ${label} :: ${latex} :: graded ${v.correct ? 'right' : 'wrong'}${v.reason ? ` (${v.reason})` : ''}`);
	}
}
console.log(`${cases.length - failed}/${cases.length} cases as expected`);
process.exit(failed ? 1 : 0);
