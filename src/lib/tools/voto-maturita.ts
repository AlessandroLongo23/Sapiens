import { fail, type Outcome, type ResultRow, type Step } from './types';
import { parseNatural } from './numbers';

/**
 * The final mark of the esame di maturità, in hundredths: the school credit (up to 40) plus the two written tests and
 * the oral (up to 20 each). At least 60 to pass. From 90 up the commission may add up to 3 points, never past 100;
 * with 100 reached without them it may give the lode, unanimously. Rules of D.Lgs. 62/2017 art. 18 as amended by
 * D.L. 127/2025 (converted by law 164/2025), applied to the 2026 exam by OM 54 of 26 March 2026, art. 16 and 28.
 * The ordinance for 2027 is not out yet (September 2026): the page says so.
 */

export const MAX = { credito: 40, prova: 20 } as const;
export const PASS = 60;
export const BONUS_FROM = 90;
export const BONUS_MAX = 3;

export interface MaturitaInput {
	credito: string;
	scritto1: string;
	scritto2: string;
	orale: string;
}

const FIELDS: { key: keyof MaturitaInput; name: string; max: number }[] = [
	{ key: 'credito', name: 'Credito scolastico', max: MAX.credito },
	{ key: 'scritto1', name: 'Prima prova scritta', max: MAX.prova },
	{ key: 'scritto2', name: 'Seconda prova scritta', max: MAX.prova },
	{ key: 'orale', name: 'Colloquio', max: MAX.prova }
];

export function votoMaturita(input: MaturitaInput): Outcome {
	const values: number[] = [];
	for (const f of FIELDS) {
		const raw = input[f.key];
		const what = f.key === 'credito' ? 'il credito scolastico' : f.key === 'orale' ? 'il punteggio del colloquio' : `il punteggio della ${f.key === 'scritto1' ? 'prima' : 'seconda'} prova`;
		if (!raw.trim()) return fail(`Scrivi ${what}, un numero intero da 0 a ${f.max}.`);
		const n = parseNatural(raw, f.max);
		if (n === null) return fail(`${f.name}: scrivi un numero intero da 0 a ${f.max}, per esempio ${f.key === 'credito' ? 32 : 15}.`);
		values.push(n);
	}
	const [credito, s1, s2, orale] = values;
	const prove = s1 + s2 + orale;
	const total = credito + prove;
	const passed = total >= PASS;

	const steps: Step[] = [
		{
			say: 'Scrivi i punti di ogni parte, con il suo massimo.',
			table: { head: ['Parte', 'Punti', 'Massimo'], rows: FIELDS.map((f, i) => [f.name, `$${values[i]}$`, `$${f.max}$`]) }
		},
		{
			say: 'Somma il credito e i punti delle tre prove.',
			math: [`${credito} + ${s1} + ${s2} + ${orale} = \\hl{${total}}`],
			then: `Il voto è in centesimi: ${total} su 100.`
		},
		{
			say: `Controlla la sufficienza: servono almeno ${PASS} punti.`,
			math: [passed ? `${total} \\ge ${PASS}` : `${PASS} - ${total} = \\hl{${PASS - total}}`],
			then: passed ? 'L’esame è superato.' : `Mancano ${PASS - total} punti: l’esame non è superato.`
		}
	];
	const rows: ResultRow[] = [{ label: 'Voto finale', value: `$${total}$ su $100$` }];
	if (!passed) rows.push({ label: 'Esito', value: `non superato: servono almeno $${PASS}$ punti` });

	if (total === 100) {
		steps.push({
			say: 'Con 100 senza bonus la commissione può dare la lode.',
			then: 'Servono il credito massimo, dato all’unanimità dal consiglio di classe, i punti pieni nelle prove e il voto unanime della commissione.'
		});
		rows.push({ label: 'Lode', value: 'possibile, se la commissione è unanime' });
	} else if (total >= BONUS_FROM) {
		const best = Math.min(100, total + BONUS_MAX);
		steps.push({
			say: `Da ${BONUS_FROM} punti in su la commissione può aggiungere fino a ${BONUS_MAX} punti.`,
			math: [total + BONUS_MAX > 100 ? `${total} + ${BONUS_MAX} = ${total + BONUS_MAX} \\to \\hl{100}` : `${total} + ${BONUS_MAX} = \\hl{${best}}`],
			then: `${total + BONUS_MAX > 100 ? 'Il voto non supera mai 100. ' : ''}Il bonus non è automatico: lo decide la commissione con i suoi criteri, e con il bonus non si ha la lode.`
		});
		rows.push({ label: 'Con il bonus della commissione', value: `fino a $${best}$ su $100$` });
	} else {
		steps.push({
			say: `Il bonus spetta solo da ${BONUS_FROM} punti in su.`,
			then: `Con ${total} punti la commissione non può aggiungere punti.`
		});
	}
	return { ok: true, rows, copy: `${total}/100`, steps };
}
