import { Rational } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type ResultRow, type Step } from './types';
import { decimal, intTex, intText, parseDecimal, parseNatural } from './numbers';

/**
 * How many hours of absence a student can still take before the school year stops being valid. The rule: at least
 * three quarters of the "orario annuale personalizzato" must be attended (DPR 122/2009 art. 14 c. 7 for the scuola
 * superiore, D.Lgs. 62/2017 art. 5 c. 1 for the scuola media), so absences may reach 25% of it. The annual hours come
 * from the school; when the student only knows the weekly timetable, the tool multiplies by 33 weeks, the count the
 * ordinamenti use (27 hours a week make the 891 of the liceo, DPR 89/2010). The limit is rounded down, the days too:
 * one hour over the limit is enough to lose the year. Exceptions (deroghe) are decided by each school's collegio
 * docenti, and the page says so.
 */

export type AssenzeMode = 'settimana' | 'anno';

export const WEEKS = 33;

export interface AssenzeInput {
	modo: AssenzeMode;
	/** Hours a week (settimana) or a year (anno). */
	ore: string;
	/** School days a week, 5 or 6. */
	giorni: string;
	/** Hours of absence already taken; empty is none. */
	fatte: string;
}

const floor = (r: Rational) => Math.floor(r.num / r.den);
const num = (r: Rational, digits = 2) => decimal(r, digits);
/** "= 5{,}4" or "\approx 5{,}43". */
const eqTex = (r: Rational, digits = 2) => `${num(r, digits).exact ? '=' : '\\approx'} ${num(r, digits).tex}`;
const hourWord = (r: Rational) => (r.equals(Rational.of(1)) ? 'ora' : 'ore');
const pctTex = (p: Rational) => `$${num(p, 1).exact ? '' : '\\approx '}${num(p, 1).tex}\\%$`;
const days = (n: number) => (n === 1 ? 'giorno' : 'giorni');

const DEROGHE: Step = {
	say: 'Controlla le deroghe decise dalla tua scuola.',
	then: 'Il collegio docenti può non contare alcune assenze documentate e continuative, per esempio per malattia, terapie o gare sportive. L’elenco è nel regolamento o in una circolare della scuola.'
};

export function calcoloAssenze({ modo, ore, giorni, fatte }: AssenzeInput): Outcome {
	const g = parseNatural(giorni);
	if (g !== 5 && g !== 6) return fail('Scegli quanti giorni a settimana vai a scuola: 5 o 6.');

	let monte: number;
	let weekly: Rational;
	const steps: Step[] = [];
	if (modo === 'settimana') {
		if (!ore.trim()) return fail('Scrivi quante ore di lezione hai a settimana, per esempio 27.');
		const w = parseNatural(ore, 60);
		if (w === null || w < 10 || w > 45) return fail('Scrivi le ore di lezione a settimana, un numero intero da 10 a 45: per esempio 27 o 30.');
		monte = w * WEEKS;
		weekly = Rational.of(w);
		steps.push({
			say: `Moltiplica le ore settimanali per $${WEEKS}$ settimane di lezione.`,
			math: [`${w} \\cdot ${WEEKS} = \\hl{${intTex(monte)}}`],
			then: `È il monte ore annuale, ${intText(monte)} ore. Se la scuola te ne comunica uno diverso, usa quello.`
		});
	} else {
		if (!ore.trim()) return fail('Scrivi il monte ore annuale della tua classe, per esempio 891.');
		const m = parseNatural(ore, 2000);
		if (m === null || m < 300) return fail('Scrivi il monte ore annuale, un numero intero da 300 a 2000: per esempio 891 o 990.');
		monte = m;
		weekly = Rational.of(m, WEEKS);
		steps.push({
			say: 'Parti dal monte ore annuale della tua classe.',
			math: [`\\text{monte ore} = ${intTex(monte)}`]
		});
	}

	let done: Rational | null = null;
	if (fatte.trim()) {
		const f = parseDecimal(fatte);
		if (!f || f.sign() < 0) return fail('Scrivi le ore di assenza già fatte, un numero da 0 in su: per esempio 60. Lascia vuoto se non ne hai.');
		if (f.compare(Rational.of(monte)) > 0) return fail(`Le ore di assenza non possono superare il monte ore, ${intText(monte)}: controlla il numero.`);
		done = f;
	}

	const quarter = Rational.of(monte, 4);
	const max = floor(quarter);
	steps.push({
		say: 'Calcola il 25% del monte ore, cioè un quarto.',
		math: quarter.isInteger() ? [`\\dfrac{${intTex(monte)}}{4} = \\hl{${intTex(max)}}`] : [`\\dfrac{${intTex(monte)}}{4} = ${num(quarter).tex}`, `\\to \\hl{${intTex(max)}}`],
		then: quarter.isInteger()
			? `Puoi fare al massimo ${intText(max)} ore di assenza.`
			: `Arrotonda per difetto: con un’ora in più supereresti il limite. Puoi fare al massimo ${intText(max)} ore di assenza.`
	});

	const perDay = weekly.div(Rational.of(g));
	const perDayTex = `${modo === 'settimana' ? `\\dfrac{${num(weekly).tex}}{${g}}` : `\\dfrac{${intTex(monte)}}{${WEEKS} \\cdot ${g}}`} ${eqTex(perDay)}`;
	const toDays = (h: Rational) => floor(h.div(perDay));
	const rows: ResultRow[] = [{ label: 'Ore di assenza massime nell’anno', value: `$${intTex(max)}$ ore` }];

	if (done === null) {
		const d = toDays(Rational.of(max));
		steps.push({
			say: 'Calcola quante ore dura in media un giorno di scuola.',
			math: [perDayTex],
			then: modo === 'settimana' ? `Sono le ore settimanali divise per ${g} giorni.` : `Sono le ore dell’anno divise per ${WEEKS} settimane e per ${g} giorni.`
		});
		steps.push({
			say: 'Dividi le ore massime per le ore di un giorno.',
			math: [`\\dfrac{${intTex(max)}}{${num(perDay).tex}} \\approx \\hl{${d}}`],
			then: `Arrotonda per difetto: sono circa ${d} ${days(d)} di scuola interi.`
		});
		steps.push(DEROGHE);
		rows.push({ label: 'In giorni di scuola, circa', value: `$${d}$ ${days(d)}` });
		return { ok: true, rows, copy: `${intText(max)} ore`, steps };
	}

	const left = Rational.of(max).sub(done);
	const pct = done.mul(Rational.of(100)).div(Rational.of(monte));
	const doneTex = num(done).tex;
	if (left.sign() < 0) {
		const over = left.neg();
		steps.push({
			say: 'Togli le ore massime dalle ore di assenza già fatte.',
			math: [`${doneTex} - ${intTex(max)} = \\hl{${num(over).tex}}`],
			then: `Hai superato il limite di ${num(over).text} ${hourWord(over)}. L’anno è valido solo se le assenze in più rientrano nelle deroghe.`
		});
		steps.push(DEROGHE);
		rows.push({ label: 'Ore oltre il limite', value: `$${num(over).tex}$ ${hourWord(over)}` });
		rows.push({ label: 'Assenze fatte, sul monte ore', value: pctTex(pct) });
		return { ok: true, rows, copy: `limite superato di ${num(over).text} ore`, steps };
	}

	const d = toDays(left);
	steps.push({
		say: 'Togli le ore di assenza che hai già fatto.',
		math: [`${intTex(max)} - ${doneTex} = \\hl{${num(left).tex}}`],
		then: `Ti restano ${num(left).text} ${hourWord(left)} di assenza.`
	});
	steps.push({
		say: 'Trasforma le ore che restano in giorni di scuola.',
		math: [perDayTex, `\\dfrac{${num(left).tex}}{${num(perDay).tex}} \\approx \\hl{${d}}`],
		then: `Un giorno di scuola dura in media ${num(perDay).text} ore: ti restano circa ${d} ${days(d)} interi.`
	});
	steps.push(DEROGHE);
	rows.push({ label: 'Ore di assenza che ti restano', value: `$${num(left).tex}$ ${hourWord(left)}` });
	rows.push({ label: 'In giorni di scuola, circa', value: `$${d}$ ${days(d)}` });
	rows.push({ label: 'Assenze fatte, sul monte ore', value: pctTex(pct) });
	return { ok: true, rows, copy: `${num(left).text} ore`, steps };
}
