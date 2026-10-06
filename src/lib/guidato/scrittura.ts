/**
 * The answer of a written stop of a guided exercise (blocco.ts) as LaTeX, made from the exact value its author
 * wrote in SymPy syntax: what the lesson shows when the author gives no other writing, and what the check types
 * into the grader. It reads the value with the grader's own reader, and does not carry the grader.
 */
import { fromSympy, type Node } from '../exercises/v2/grade/node';
import type { OpenGrading } from '../exercises/v2/types';
import type { WrittenAnswer } from './blocco';

const group = (n: Node) => (n.t === 'add' || n.t === 'neg' ? `\\left(${tex(n)}\\right)` : tex(n));

/** An expression as a student would type it, and as the lesson shows it when the author gives no other writing. */
function tex(n: Node): string {
	switch (n.t) {
		case 'num':
			if (n.decimal) return String(n.v.num / n.v.den).replace('.', '{,}');
			return n.v.den === 1 ? String(n.v.num) : `${n.v.num < 0 ? '-' : ''}\\frac{${Math.abs(n.v.num)}}{${n.v.den}}`;
		case 'sym':
			return n.name;
		case 'pi':
			return '\\pi';
		case 'add':
			return n.args.map((a, i) => (a.t === 'neg' ? `-${group(a.a)}` : `${i ? '+' : ''}${tex(a)}`)).join('');
		case 'neg':
			return `-${group(n.a)}`;
		case 'mul':
			return n.args.map((a, i) => (i && /^\d/.test(group(a)) ? `\\cdot ${group(a)}` : group(a))).join('');
		case 'div':
			// -3/2 is read as (-3)/2: the sign goes in front of the fraction, where a lesson writes it
			return n.a.t === 'neg' ? `-\\frac{${tex(n.a.a)}}{${tex(n.b)}}` : `\\frac{${tex(n.a)}}{${tex(n.b)}}`;
		case 'pow': {
			const plain = n.a.t === 'sym' || n.a.t === 'pi' || (n.a.t === 'num' && n.a.v.den === 1 && n.a.v.num >= 0 && !n.a.decimal);
			return `${plain ? tex(n.a) : `\\left(${tex(n.a)}\\right)`}^{${tex(n.b)}}`;
		}
		case 'root':
			return n.n === 2 ? `\\sqrt{${tex(n.a)}}` : `\\sqrt[${n.n}]{${tex(n.a)}}`;
		case 'abs':
			return `\\left|${tex(n.a)}\\right|`;
		case 'paren':
			return `\\left(${tex(n.a)}\\right)`;
	}
}

/** The answer of a stop as LaTeX, from the exact value its author wrote. Throws when the value is not read. */
export function answerLatex(answer: WrittenAnswer, grading: OpenGrading): string {
	if (answer.kind === 'number') return tex(fromSympy(answer.value));
	if (answer.kind === 'expression') return `${grading.grade === 'form' && grading.form === 'explicit' ? 'y=' : ''}${tex(fromSympy(answer.value))}`;
	const excluded = grading.grade === 'value' && grading.set === 'excluded';
	if (answer.universal || (excluded && !answer.values.length)) return '\\mathbb{R}';
	if (!answer.values.length) return '\\emptyset';
	const list = `\\left\\lbrace ${answer.values.map((v) => tex(fromSympy(v))).join(';')}\\right\\rbrace`;
	return excluded ? `\\mathbb{R}\\setminus${list}` : list;
}
