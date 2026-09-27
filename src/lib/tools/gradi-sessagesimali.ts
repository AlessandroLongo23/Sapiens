import { Rational, q } from '@/lib/exercises/v2/rational';
import { parseDegrees } from './gradi-radianti';
import { decimal, intTex, parseDecimal } from './numbers';
import { fail, type Outcome, type Step } from './types';

/**
 * Sexagesimal degrees (23° 15′ 36″) and decimal degrees (23,26°), both ways, with the divisions and multiplications
 * by 60 written out one at a time. Exact rational arithmetic: a value is rounded only where it is shown, to
 * DIGITS decimals, and seconds to the nearest whole second.
 */

/** Decimals of decimal degrees. */
const DIGITS = 4;
const MAX_DEGREES = 1e6;

export type SessagesimaliMode = 'dms' | 'dec';

/** d° m′ s″ from a number of seconds, as TeX and text: "23^\circ\, 15'\, 36''", "23° 15′ 36″". Zero parts stay. */
function dmsParts(totalSeconds: number, negative: boolean): { tex: string; text: string; d: number; m: number; s: number } {
	const d = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const sign = negative && totalSeconds > 0 ? '-' : '';
	return {
		tex: `${sign}${intTex(d)}^\\circ\\, ${m}'\\, ${s}''`,
		text: `${sign}${d}° ${m}′ ${s}″`,
		d,
		m,
		s
	};
}

/**
 * An angle found by a calculation (a float in degrees) as the answer is written at school: the decimal to two places
 * and degrees, primes and seconds to the nearest second. "36{,}87^\circ", "36^\circ\, 52'\, 12''".
 */
export function angleFromFloat(x: number): {
	dec: { tex: string; text: string };
	dms: { tex: string; text: string };
} {
	const t = Math.round(Math.abs(x) * 3600);
	const fixed = Math.abs(x).toFixed(2);
	const sign = x < 0 && Number(fixed) !== 0 ? '-' : '';
	const [int, frac] = fixed.split('.');
	const p = dmsParts(t, x < 0);
	return {
		dec: {
			tex: `${sign}${int}{,}${frac}^\\circ`,
			text: `${sign}${int},${frac}°`
		},
		dms: { tex: p.tex, text: p.text }
	};
}

const r4 = (r: Rational) => decimal(r, DIGITS);
/** "=" or "\approx" before a value shown to DIGITS decimals. */
const eqs = (r: Rational) => (r4(r).exact ? '=' : '\\approx');

function readPart(input: string, name: string, example: string, integer: boolean): Rational | string {
	const t = input.trim();
	if (!t) return q(0);
	const r = parseDecimal(t);
	if (!r) return `Scrivi ${name} come numero, per esempio ${example}.`;
	if (r.sign() < 0) return `${name.charAt(0).toUpperCase()}${name.slice(1)} non possono essere negativi: il segno va davanti ai gradi.`;
	if (integer && !r.isInteger()) return `Scrivi ${name} come numero intero, per esempio ${example}. I decimali vanno solo nei secondi.`;
	if (r.compare(q(60)) >= 0) return `${name.charAt(0).toUpperCase()}${name.slice(1)} vanno da 0 a 59: 60 ${name.slice(2)} fanno già ${name === 'i primi' ? 'un grado' : 'un primo'}.`;
	if (r.den > 1e4) return 'Usa al massimo quattro cifre decimali nei secondi.';
	return r;
}

export function gradiSessagesimali(mode: string, g: string, p: string, s: string, n: string): Outcome {
	try {
		if (mode === 'dms') return toDecimal(g, p, s);
		if (mode === 'dec') return toSexagesimal(n);
		return fail('Scegli da che forma parti: gradi, primi e secondi oppure gradi decimali.');
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo: scrivi un angolo più corto, per esempio 23,26.');
	}
}

function toDecimal(gIn: string, pIn: string, sIn: string): Outcome {
	const gt = gIn.trim().replace(/°$/, '').trim();
	if (!gt) return fail('Scrivi i gradi, per esempio 23 (e poi 15 primi e 36 secondi).');
	const neg = gt.startsWith('-');
	const gr = parseDecimal(gt.replace(/^-/, ''));
	if (!gr || gr.sign() < 0 || gIn.trim().startsWith('--')) return fail('Scrivi i gradi come numero intero, per esempio 23.');
	if (!gr.isInteger()) return fail('Scrivi i gradi come numero intero, per esempio 23: la parte decimale va nei primi e nei secondi.');
	if (gr.num > MAX_DEGREES) return fail("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 720.");
	const m = readPart(pIn.replace(/['′’]$/, ''), 'i primi', '15', true);
	if (typeof m === 'string') return fail(m);
	const sec = readPart(sIn.replace(/(''|″|"|’’)$/, ''), 'i secondi', '36', false);
	if (typeof sec === 'string') return fail(sec);

	const d = gr.num;
	const written = `${neg ? '-' : ''}${intTex(d)}^\\circ\\, ${decimal(m).tex}'\\, ${decimal(sec).tex}''`;
	const writtenText = `${neg ? '-' : ''}${d}° ${decimal(m).text}′ ${decimal(sec).text}″`;
	const steps: Step[] = [];
	let minutes = m;
	if (!sec.isZero()) {
		const fromSec = sec.div(q(60));
		steps.push({
			say: 'Dividi i secondi per 60: diventano primi.',
			math: [`${decimal(sec).tex}'' = \\dfrac{${decimal(sec).tex}}{60}'`, `${eqs(fromSec)} \\hl{${r4(fromSec).tex}'}`],
			then: 'Un primo è fatto di 60 secondi.'
		});
		minutes = m.add(fromSec);
		if (!m.isZero())
			steps.push({
				say: 'Somma i primi che avevi già.',
				math: [`${decimal(m).tex}' + ${r4(fromSec).tex}' ${eqs(minutes)} \\hl{${r4(minutes).tex}'}`]
			});
	}
	const value = q(d).add(minutes.div(q(60)));
	if (!minutes.isZero()) {
		const fromMin = minutes.div(q(60));
		steps.push({
			say: 'Dividi i primi per 60: diventano gradi.',
			math: [`${r4(minutes).tex}' = \\dfrac{${r4(minutes).tex}}{60}^\\circ`, `${eqs(fromMin)} \\hl{${r4(fromMin).tex}^\\circ}`],
			then: r4(minutes).exact ? 'Un grado è fatto di 60 primi.' : 'Un grado è fatto di 60 primi. Il calcolo usa il valore esatto, non quello arrotondato.'
		});
		steps.push({
			say: 'Somma i gradi interi.',
			math: [`${intTex(d)}^\\circ + ${r4(fromMin).tex}^\\circ ${eqs(value)} \\hl{${r4(value).tex}^\\circ}`],
			then: neg ? "Il segno meno resta davanti all'angolo." : undefined
		});
	} else {
		steps.push({
			say: 'Non ci sono primi né secondi: i gradi restano quelli.',
			math: [`${written} = \\hl{${intTex(d)}^\\circ}`]
		});
	}
	const signed = neg ? value.neg() : value;
	const out = r4(signed);
	return {
		ok: true,
		rows: [
			{
				label: `${writtenText} in gradi decimali`,
				value: `$${out.exact ? '' : '\\approx '}${out.tex}^\\circ$`
			}
		],
		copy: `${out.text}°`,
		steps: minutes.isZero()
			? steps
			: [
					...steps,
					{
						say: 'Controlla con la formula in una riga.',
						math: [
							`${written} = ${neg ? '-\\left(' : ''}${intTex(d)} + \\dfrac{${decimal(m).tex}}{60} + \\dfrac{${decimal(sec).tex}}{3600}${neg ? '\\right)' : ''}`,
							`${eqs(signed)} ${out.tex}^\\circ`
						]
					}
				]
	};
}

function toSexagesimal(input: string): Outcome {
	const parsed = parseDegrees(input);
	if (!parsed) return fail('Scrivi un angolo in gradi decimali, per esempio 23,26.');
	if (parsed.dms) return fail("Questo angolo è già in gradi, primi e secondi: scegli l'altra conversione.");
	const signed = parsed.value;
	const x = signed.abs();
	if (x.compare(q(MAX_DEGREES)) > 0) return fail("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 720.");
	if (x.den > 1e8) return fail('Usa al massimo otto cifre decimali, per esempio 23,26.');
	const neg = signed.sign() < 0;
	const d = Math.floor(x.num / x.den);
	const frac = x.sub(q(d));
	const dT = decimal(x).tex;
	const steps: Step[] = [];
	if (frac.isZero()) {
		return {
			ok: true,
			rows: [
				{
					label: `${decimal(signed).text}° in gradi, primi e secondi`,
					value: `$${neg ? '-' : ''}${intTex(d)}^\\circ\\, 0'\\, 0''$`
				}
			],
			copy: `${neg ? '-' : ''}${d}° 0′ 0″`,
			steps: [
				{
					say: "L'angolo è un numero intero di gradi: primi e secondi valgono zero."
				}
			]
		};
	}
	steps.push({
		say: 'Separa la parte intera: sono i gradi.',
		math: [`${dT}^\\circ = \\hl{${intTex(d)}^\\circ} + ${decimal(frac).tex}^\\circ`]
	});
	const mm = frac.mul(q(60));
	const m = Math.floor(mm.num / mm.den);
	steps.push({
		say: 'Moltiplica per 60 la parte decimale: ottieni i primi.',
		math: [`${decimal(frac).tex} \\cdot 60 ${eqs(mm)} \\hl{${r4(mm).tex}'}`],
		then: mm.isInteger() ? undefined : 'Tieni la parte intera: sono i primi.'
	});
	const mf = mm.sub(q(m));
	const ss = mf.mul(q(60));
	if (!mf.isZero()) {
		const sd = decimal(ss, 2);
		steps.push({
			say: 'Moltiplica per 60 la parte decimale dei primi: ottieni i secondi.',
			math: [`${decimal(mf, DIGITS).tex} \\cdot 60 ${sd.exact && decimal(mf, DIGITS).exact ? '=' : '\\approx'} \\hl{${sd.tex}''}`],
			then: ss.isInteger() ? undefined : 'Arrotonda i secondi al numero intero più vicino.'
		});
	}
	const total = x.mul(q(3600));
	const rounded = Math.round(total.num / total.den);
	const exact = total.isInteger();
	const out = dmsParts(rounded, neg);
	// Rounding can make 60 seconds: one more prime (or degree).
	const carried = !mf.isZero() && Math.round(ss.num / ss.den) === 60;
	steps.push({
		say: "Scrivi l'angolo in gradi, primi e secondi.",
		math: [`${neg ? '-' : ''}${dT}^\\circ ${exact ? '=' : '\\approx'} \\hl{${out.tex}}`],
		then: carried ? 'I secondi arrotondati fanno 60, cioè un primo in più.' : neg ? "Il segno meno resta davanti all'angolo." : undefined
	});
	return {
		ok: true,
		rows: [
			{
				label: `${decimal(signed).text}° in gradi, primi e secondi`,
				value: `$${exact ? '' : '\\approx '}${out.tex}$`
			}
		],
		copy: out.text,
		steps
	};
}
