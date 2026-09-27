import { Rational, q } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, parseDecimal } from './numbers';

/**
 * Angles between degrees (decimal, or sexagesimal d° m′ s″) and radians, from the proportion
 * α° : 180° = α_rad : π. A decimal number of degrees is always a rational multiple of π, kept exact (45° = π/4);
 * radians written with π go back to exact degrees, radians without π to a rounded value.
 */

export type AngleUnit = 'gradi' | 'rad';

export const ANGLE_UNITS: { id: AngleUnit; text: string; name: string }[] = [
	{ id: 'gradi', text: '°', name: 'gradi' },
	{ id: 'rad', text: 'rad', name: 'radianti' }
];

const MAX_DEGREES = 1e9;
const DIGITS = 4;

export interface Degrees {
	value: Rational;
	/** The sexagesimal parts as written, when the input had minutes or seconds. */
	dms?: { sign: number; d: Rational; m: Rational; s: Rational };
}

const NUM = String.raw`(\d+(?:[.,]\d+)?)`;
const DMS = new RegExp(String.raw`^(-?)\s*${NUM}\s*(?:°|º|gradi|deg)?\s*(?:${NUM}\s*(?:'|′|’|primi)\s*)?(?:${NUM}\s*(?:''|″|"|’’|′′|secondi)\s*)?$`);

/** "45", "22,5", "22° 30′", "22°30'15''", "-10°" → degrees, or null. */
export function parseDegrees(input: string): Degrees | null {
	const s = input.trim();
	const m = DMS.exec(s);
	if (!m) return null;
	const [, sign, dRaw, mRaw, sRaw] = m;
	const d = parseDecimal(dRaw);
	if (!d) return null;
	const neg = sign === '-';
	if (mRaw === undefined && sRaw === undefined) return { value: neg ? d.neg() : d };
	const min = mRaw === undefined ? q(0) : parseDecimal(mRaw);
	const sec = sRaw === undefined ? q(0) : parseDecimal(sRaw);
	if (!min || !sec) return null;
	// Only the last part written may have decimals, and minutes and seconds stay under 60.
	if (!d.isInteger() || (sRaw !== undefined && !min.isInteger())) return null;
	if (min.compare(q(60)) >= 0 || sec.compare(q(60)) >= 0) return null;
	const value = d.add(min.div(q(60))).add(sec.div(q(3600)));
	return { value: neg ? value.neg() : value, dms: { sign: neg ? -1 : 1, d, m: min, s: sec } };
}

export interface Radians {
	/** The coefficient: the angle is coef · π when `pi`, else coef. */
	coef: Rational;
	pi: boolean;
}

/** "π/4", "3pi/4", "3/4 π", "2π", "-π/6", "0,25π", "1,5", "1/2" → radians, or null. */
export function parseRadians(input: string): Radians | null {
	const s = input
		.trim()
		.replace(/\s+/g, '')
		.replace(/pi|pigreco|π/gi, 'π')
		.replace(/[*·×]/g, '')
		.replace(/rad$/i, '');
	if (!s) return null;
	const sign = s.startsWith('-') ? -1 : 1;
	const body = s.replace(/^[-+]/, '');
	const signed = (r: Rational) => (sign < 0 ? r.neg() : r);
	let m = /^(\d+(?:[.,]\d+)?)?π(?:\/(\d+))?$/.exec(body);
	if (m) {
		const a = m[1] === undefined ? q(1) : parseDecimal(m[1]);
		const b = m[2] === undefined ? 1 : Number(m[2]);
		if (!a || !b) return null;
		return { coef: signed(a.div(q(b))), pi: true };
	}
	m = /^(\d+)\/(\d+)(π?)$/.exec(body);
	if (m) {
		const b = Number(m[2]);
		if (!b) return null;
		return { coef: signed(q(Number(m[1]), b)), pi: m[3] === 'π' };
	}
	const r = parseDecimal(body);
	return r ? { coef: signed(r), pi: false } : null;
}

/** A float as an Italian decimal, rounded to `digits`: "0,7854". */
export function floatText(x: number, digits = DIGITS): { text: string; tex: string } {
	const fixed = Math.abs(x).toFixed(digits).replace(/\.?0+$/, '');
	const [int, frac] = fixed.split('.');
	const sign = x < 0 && fixed !== '0' ? '-' : '';
	const g = (sep: string) => (int.length > 4 ? int.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : int);
	return { text: `${sign}${g(' ')}${frac ? `,${frac}` : ''}`, tex: `${sign}${g('\\,')}${frac ? `{,}${frac}` : ''}` };
}

/** k · π in LaTeX: "\dfrac{\pi}{4}", "\dfrac{3\pi}{4}", "2\pi", "-\dfrac{\pi}{6}". */
export function piTex(k: Rational): string {
	if (k.isZero()) return '0';
	const sign = k.sign() < 0 ? '-' : '';
	const n = Math.abs(k.num);
	const top = n === 1 ? '\\pi' : `${n}\\pi`;
	return k.den === 1 ? `${sign}${top}` : `${sign}\\dfrac{${top}}{${k.den}}`;
}

/** k · π as plain text: "π/4", "3π/4". */
export function piText(k: Rational): string {
	if (k.isZero()) return '0';
	const sign = k.sign() < 0 ? '-' : '';
	const n = Math.abs(k.num);
	const top = n === 1 ? 'π' : `${n}π`;
	return k.den === 1 ? `${sign}${top}` : `${sign}${top}/${k.den}`;
}

/** A rational in a formula: a short decimal when it ends ("22{,}5"), else a fraction. */
function ratTex(r: Rational): string {
	const d = decimal(r, 6);
	return d.exact ? d.tex : r.toLatex().replace('\\frac', '\\dfrac');
}

/** Degrees, minutes and seconds from a number of seconds, rounded to the second. */
function dms(totalSeconds: number, negative: boolean): { tex: string; text: string } {
	const t = Math.round(totalSeconds);
	const d = Math.floor(t / 3600);
	const m = Math.floor((t % 3600) / 60);
	const s = t % 60;
	const sign = negative && t > 0 ? '-' : '';
	const tex = `${sign}${d}^\\circ${m || s ? `\\, ${m}'` : ''}${s ? `\\, ${s}''` : ''}`;
	const text = `${sign}${d}°${m || s ? ` ${m}′` : ''}${s ? ` ${s}″` : ''}`;
	return { tex, text };
}

/** Degrees as decimal and, when they have a fractional part, sexagesimal. */
function degreesOut(value: Rational | number): { tex: string; text: string; exact: boolean; dms: { tex: string; text: string; exact: boolean } | null } {
	if (typeof value === 'number') {
		const f = floatText(value);
		const sexa = dms(Math.abs(value) * 3600, value < 0);
		return { tex: `${f.tex}^\\circ`, text: `${f.text}°`, exact: false, dms: { ...sexa, exact: false } };
	}
	const d = decimal(value, DIGITS);
	const seconds = value.abs().mul(q(3600));
	const sexa = value.isInteger() ? null : { ...dms(seconds.num / seconds.den, value.sign() < 0), exact: seconds.isInteger() };
	return { tex: `${d.tex}^\\circ`, text: `${d.text}°`, exact: d.exact, dms: sexa };
}

const eq = (exact: boolean) => (exact ? '=' : '\\approx');
/** A value for a result row, "≈" in front when rounded. */
const val = (tex: string, exact: boolean) => `$${exact ? '' : '\\approx '}${tex}$`;

const PROPORTION: Step = {
	say: 'Imposta la proporzione tra gradi e radianti.',
	math: ['\\alpha^\\circ : 180^\\circ = \\alpha_{\\text{rad}} : \\pi'],
	then: 'Un angolo piatto misura $180^\\circ$, cioè $\\pi$ radianti.'
};

export function gradiRadianti(value: string, from: string, to: string): Outcome {
	if ((from !== 'gradi' && from !== 'rad') || (to !== 'gradi' && to !== 'rad')) return fail('Scegli le due unità di misura degli angoli, per esempio gradi e radianti.');
	try {
		return from === 'gradi' ? fromDegrees(value, to) : fromRadians(value, to);
	} catch {
		return fail('Il numero ha troppe cifre per questo calcolo: scrivi un angolo più corto, per esempio 22,5.');
	}
}

/** The step that turns d° m′ s″ into decimal degrees. */
function dmsStep(deg: Degrees): Step | null {
	if (!deg.dms) return null;
	const { sign, d, m, s } = deg.dms;
	const parts = [`${ratTex(d)}`, ...(m.isZero() ? [] : [`\\dfrac{${ratTex(m)}}{60}`]), ...(s.isZero() ? [] : [`\\dfrac{${ratTex(s)}}{3600}`])];
	const written = `${ratTex(d)}^\\circ${m.isZero() && !s.isZero() ? "\\, 0'" : m.isZero() ? '' : `\\, ${ratTex(m)}'`}${s.isZero() ? '' : `\\, ${ratTex(s)}''`}`;
	const dd = decimal(deg.value.abs(), DIGITS);
	return {
		say: 'Porta tutto in gradi: dividi i primi per 60 e i secondi per 3600.',
		math: [`${written} = ${parts.join(' + ')}`, `${written} ${eq(dd.exact)} \\hl{${dd.tex}^\\circ}`],
		then: sign < 0 ? "Il segno meno resta davanti all'angolo." : undefined
	};
}

/** The input in degrees as text, for a label: "45°", "22° 30′ 15″". */
function degreesText(deg: Degrees): string {
	if (!deg.dms) return `${decimal(deg.value, 6).text}°`;
	const { sign, d, m, s } = deg.dms;
	return `${sign < 0 ? '-' : ''}${decimal(d).text}° ${decimal(m).text}′${s.isZero() ? '' : ` ${decimal(s).text}″`}`;
}

function fromDegrees(value: string, to: AngleUnit): Outcome {
	const deg = parseDegrees(value);
	if (!deg) return fail('Scrivi un angolo in gradi, per esempio 45, 22,5 oppure 22° 30′ 15″.');
	if (Math.abs(deg.value.num / deg.value.den) > MAX_DEGREES) return fail("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 720.");
	const steps: Step[] = [];
	const first = dmsStep(deg);
	if (first) steps.push(first);
	const inText = degreesText(deg);

	if (to === 'gradi') {
		const out = degreesOut(deg.value);
		if (deg.dms) {
			return { ok: true, rows: [{ label: `${inText} in gradi decimali`, value: val(out.tex, out.exact) }], copy: out.text, steps };
		}
		if (!out.dms) {
			return { ok: true, rows: [{ label: 'Angolo in gradi', value: `$${out.tex}$` }], copy: out.text, steps: [{ say: "L'angolo è già un numero intero di gradi: non ci sono primi e secondi." }] };
		}
		steps.push(...dmsSteps(deg.value, out.tex));
		return { ok: true, rows: [{ label: `${inText} in gradi, primi e secondi`, value: val(out.dms.tex, out.dms.exact) }], copy: out.dms.text, steps };
	}

	const k = deg.value.div(q(180));
	const rad = (k.num / k.den) * Math.PI;
	const f = floatText(rad);
	if (k.isZero()) {
		steps.push({ say: 'Un angolo di $0^\\circ$ misura $0$ radianti.', math: ['0^\\circ = \\hl{0\\ \\text{rad}}'] });
		return { ok: true, rows: [{ label: `${inText} in radianti`, value: '$0\\ \\text{rad}$' }], copy: '0 rad', steps };
	}
	const d = deg.value;
	const neg = d.sign() < 0 ? '-' : '';
	const abs = ratTex(d.abs());
	steps.push(PROPORTION);
	const dA = d.abs();
	// A decimal that does not end (22° 30′ 15″ = 5401/240) goes in as a fraction: 5401π over 240 · 180.
	const raw = abs.includes('dfrac') ? `${neg}\\dfrac{${dA.num}\\pi}{${dA.den} \\cdot 180}` : `${neg}\\dfrac{${abs === '1' ? '' : abs}\\pi}{180}`;
	const simplified = piTex(k);
	steps.push({
		say: 'Ricava i radianti: moltiplica per $\\pi$ e dividi per $180$.',
		math: [`\\alpha_{\\text{rad}} = ${d.sign() < 0 ? `\\left(${ratTex(d)}\\right)` : ratTex(d)} \\cdot \\dfrac{\\pi}{180}`, raw === simplified ? `\\alpha_{\\text{rad}} = \\hl{${raw}}` : `\\alpha_{\\text{rad}} = ${raw}`]
	});
	if (raw !== simplified) {
		steps.push({ say: abs.includes('dfrac') ? 'Calcola la frazione e lascia $\\pi$ indicato.' : 'Semplifica la frazione e lascia $\\pi$ indicato.', math: [`${raw} = \\hl{${simplified}}`], then: 'Questo risultato è esatto.' });
	}
	steps.push({ say: 'Se ti serve il numero, usa $\\pi \\approx 3{,}1416$.', math: [`${simplified} \\approx \\hl{${f.tex}}`] });
	return {
		ok: true,
		rows: [
			{ label: `${inText} in radianti`, value: `$${simplified}\\ \\text{rad}$` },
			{ label: 'Valore approssimato', value: `$\\approx ${f.tex}\\ \\text{rad}$` }
		],
		copy: `${piText(k)} rad ≈ ${f.text} rad`,
		steps
	};
}

/** How to turn the decimal part of degrees into minutes and seconds; `left` is the angle as the last line starts it. */
function dmsSteps(value: Rational | number, left: string): Step[] {
	type Shown = { tex: string; exact: boolean };
	let d: number;
	let frac: Shown;
	let minutes: Shown;
	let minFrac: Shown | null;
	let seconds: Shown;
	let totalSeconds: number;
	let exact: boolean;
	const neg = typeof value === 'number' ? value < 0 : value.sign() < 0;
	if (typeof value === 'number') {
		const x = Math.abs(value);
		d = Math.floor(x);
		const mm = (x - d) * 60;
		const m = Math.floor(mm + 1e-9);
		const approx = (v: number, digits = DIGITS): Shown => ({ tex: floatText(v, digits).tex, exact: false });
		frac = approx(x - d);
		minutes = approx(mm);
		minFrac = mm - m > 1e-9 ? approx(mm - m) : null;
		seconds = approx((mm - m) * 60, 2);
		totalSeconds = x * 3600;
		exact = false;
	} else {
		const x = value.abs();
		d = Math.floor(x.num / x.den);
		const f = x.sub(q(d));
		const mm = f.mul(q(60));
		const m = Math.floor(mm.num / mm.den);
		const mf = mm.sub(q(m));
		const ss = mf.mul(q(60));
		frac = decimal(f, DIGITS);
		minutes = decimal(mm, DIGITS);
		minFrac = mf.isZero() ? null : decimal(mf, DIGITS);
		seconds = decimal(ss, 2);
		const t = x.mul(q(3600));
		totalSeconds = t.num / t.den;
		exact = t.isInteger();
	}
	const out = dms(totalSeconds, neg);
	const lines: Step[] = [
		{
			say: `Tieni i ${d} gradi interi e moltiplica per 60 la parte decimale: sono i primi.`,
			math: [`${frac.tex} \\cdot 60 ${eq(frac.exact && minutes.exact)} \\hl{${minutes.tex}'}`]
		}
	];
	if (minFrac) {
		lines.push({
			say: 'Moltiplica per 60 la parte decimale dei primi: sono i secondi.',
			math: [`${minFrac.tex} \\cdot 60 ${eq(minFrac.exact && seconds.exact)} \\hl{${seconds.tex}''}`],
			then: exact ? undefined : 'Arrotonda i secondi al numero intero più vicino.'
		});
	}
	lines.push({ say: "Scrivi l'angolo in gradi, primi e secondi.", math: [`${left} ${eq(exact)} \\hl{${out.tex}}`] });
	return lines;
}

function fromRadians(value: string, to: AngleUnit): Outcome {
	const r = parseRadians(value);
	if (!r) return fail('Scrivi un angolo in radianti, per esempio 1,5 oppure 3π/4 (puoi scrivere pi al posto di π).');
	const inTex = r.pi ? piTex(r.coef) : ratTex(r.coef);
	const inText = r.pi ? piText(r.coef) : decimal(r.coef, 6).text;
	const steps: Step[] = [];
	if (to === 'rad') {
		const f = floatText((r.coef.num / r.coef.den) * (r.pi ? Math.PI : 1));
		if (!r.pi) return { ok: true, rows: [{ label: 'Angolo in radianti', value: `$${inTex}\\ \\text{rad}$` }], copy: `${inText} rad`, steps: [{ say: 'Le due unità sono uguali: la misura non cambia.' }] };
		return {
			ok: true,
			rows: [{ label: `${inText} rad come numero decimale`, value: `$\\approx ${f.tex}\\ \\text{rad}$` }],
			copy: `${f.text} rad`,
			steps: [{ say: 'Sostituisci $\\pi$ con $3{,}1416$.', math: [`${inTex} \\approx \\hl{${f.tex}}`] }]
		};
	}
	let out: ReturnType<typeof degreesOut>;
	if (r.coef.isZero()) {
		out = degreesOut(q(0));
		steps.push({ say: 'Un angolo di $0$ radianti misura $0^\\circ$.', math: ['0\\ \\text{rad} = \\hl{0^\\circ}'] });
	} else if (r.pi) {
		const d = r.coef.mul(q(180));
		if (Math.abs(d.num / d.den) > MAX_DEGREES) return fail("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 4π.");
		out = degreesOut(d);
		const k = r.coef;
		const sign = k.sign() < 0 ? '-' : '';
		const n = Math.abs(k.num);
		const top = n === 1 ? '180^\\circ' : `${n} \\cdot 180^\\circ`;
		const cancelled = k.den === 1 ? `${sign}${top}` : `${sign}\\dfrac{${top}}{${k.den}}`;
		steps.push(PROPORTION);
		steps.push({
			say: 'Ricava i gradi: moltiplica per $180^\\circ$ e dividi per $\\pi$.',
			math: [`\\alpha^\\circ = ${k.sign() < 0 ? `\\left(${inTex}\\right)` : inTex} \\cdot \\dfrac{180^\\circ}{\\pi}`, `\\alpha^\\circ = ${cancelled}`, `\\alpha^\\circ ${eq(out.exact)} \\hl{${out.tex}}`],
			then: out.exact ? 'Il $\\pi$ si semplifica: il risultato è esatto.' : 'Il $\\pi$ si semplifica; la divisione non finisce, quindi arrotonda.'
		});
	} else {
		const x = r.coef.num / r.coef.den;
		const d = (x * 180) / Math.PI;
		if (Math.abs(d) > MAX_DEGREES) return fail("L'angolo è troppo grande: scrivi un numero più piccolo, per esempio 6,28.");
		out = degreesOut(d);
		steps.push(PROPORTION);
		steps.push({
			say: 'Ricava i gradi: moltiplica per $180^\\circ$ e dividi per $\\pi \\approx 3{,}14159$.',
			math: [`\\alpha^\\circ = \\dfrac{${r.coef.sign() < 0 ? `(${inTex})` : inTex} \\cdot 180^\\circ}{\\pi}`, `\\alpha^\\circ \\approx \\hl{${out.tex}}`]
		});
	}
	const rows: ResultRow[] = [{ label: `${inText} rad in gradi`, value: val(out.tex, out.exact) }];
	if (out.dms) {
		steps.push(...dmsSteps(r.pi ? r.coef.mul(q(180)) : (r.coef.num / r.coef.den) * (180 / Math.PI), out.tex));
		rows.push({ label: 'In gradi, primi e secondi', value: val(out.dms.tex, out.dms.exact && out.exact) });
	}
	return { ok: true, rows, copy: out.text, steps };
}
