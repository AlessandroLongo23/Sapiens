/**
 * La gestione della memoria. Spec: specs/exercises/inf-gestione-memoria.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/21-inf-gestione-memoria.md). Levels 1 to 5 are
 * counts built backwards from the number of pages: pages with an exact division, pages rounded up, pages from
 * mebibytes, memory assigned and left unused in the last page, pages in the swap area or frames left free. Their
 * answer is a number. Level 6 is a multiple choice on true and false statements.
 */
import type { Rng, Sample } from '../types';
import { makeGenerator, numTex, numberAnswer, pw, shuffle, statementLevel, textBlock, withUnit, type Built, type Statement } from '../inf-so';

export const ID = 'inf-gestione-memoria';

const SUBJECTS = ['Un gioco', 'Il browser', 'Un programma di disegno', 'Un lettore di musica', "Un'app di messaggi", 'Un foglio di calcolo'];
const PAGES = [4, 8, 16];
const kib = (x: number) => pw(x, 'KiB');
const n = (x: number) => numTex(String(x));

// ---------------------------------------------------------------------------
// Level 1: exact division

function level1(rng: Rng): Built {
	const page = rng.pick(PAGES);
	const pages = rng.int(3, 60);
	const size = pages * page;
	const { answer, params } = numberAnswer(pages, [...shuffle(rng, [pages + 1, pages - 1, size - page, 2 * pages]), size * page], '');
	return {
		prompt: 'Calcola quante pagine servono al processo.',
		problem: textBlock(`${rng.pick(SUBJECTS)} chiede al sistema ${kib(size)} di memoria. Le pagine sono di ${kib(page)}. Quante pagine gli servono?`),
		solution: n(pages),
		steps: [textBlock('Si divide la memoria richiesta per la dimensione di una pagina.'), `${n(size)} : ${page} = ${n(pages)}`, textBlock(`La divisione è esatta: servono $${n(pages)}$ pagine.`)],
		answer,
		params: { ...params, size, page },
	};
}

// ---------------------------------------------------------------------------
// Level 2: rounding up

function level2(rng: Rng): Built {
	const page = rng.pick(PAGES);
	const pages = rng.int(3, 60);
	const spare = rng.int(1, page - 1);
	const size = pages * page - spare;
	const { answer, params } = numberAnswer(pages, [pages - 1, ...shuffle(rng, [pages + 1, page - spare, 2 * pages, pages - 2])], '');
	return {
		prompt: 'Calcola quante pagine servono al processo.',
		problem: textBlock(`${rng.pick(SUBJECTS)} chiede al sistema ${kib(size)} di memoria. Le pagine sono di ${kib(page)}. Quante pagine gli servono?`),
		solution: n(pages),
		steps: [
			textBlock(`Si divide la memoria richiesta per la dimensione di una pagina: $${n(size)} : ${page}$ dà $${pages - 1}$ con resto $${page - spare}$.`),
			textBlock(`In $${pages - 1}$ pagine stanno ${kib((pages - 1) * page)}, e ne restano fuori $${page - spare}$: si arrotonda per eccesso, servono $${pages}$ pagine.`),
		],
		answer,
		params: { ...params, size, page },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from mebibytes

function level3(rng: Rng): Built {
	const page = rng.pick(PAGES);
	const mib = rng.int(1, 64);
	const pages = (mib * 1024) / page;
	const { answer, params } = numberAnswer(pages, [(mib * 1000) / page, mib * 1024, Math.ceil(mib / page), ...shuffle(rng, [2 * pages, pages / 2, mib * page])], '');
	return {
		prompt: 'Calcola quante pagine servono al processo.',
		problem: textBlock(`${rng.pick(SUBJECTS)} chiede al sistema ${pw(mib, 'MiB')} di memoria. Le pagine sono di ${kib(page)}. Sapendo che $1\\,\\text{MiB} = 1024\\,\\text{KiB}$, quante pagine gli servono?`),
		solution: n(pages),
		steps: [textBlock('Prima si porta la memoria richiesta in kibibyte.'), `${mib} \\cdot 1024 = ${withUnit(mib * 1024, 'KiB')}`, textBlock('Poi si divide per la dimensione di una pagina.'), `${n(mib * 1024)} : ${page} = ${n(pages)}`],
		answer,
		params: { ...params, mib, page },
	};
}

// ---------------------------------------------------------------------------
// Level 4: memory assigned, memory left unused

function level4(rng: Rng): Built {
	const page = rng.pick(PAGES);
	const pages = rng.int(3, 40);
	const spare = rng.int(1, page - 1);
	const size = pages * page - spare;
	const assigned = rng.next() < 0.5;
	const value = assigned ? pages * page : spare;
	const wrong = assigned ? [(pages - 1) * page, ...shuffle(rng, [(pages + 1) * page, pages, size + page, pages * page + spare])] : [page - spare, ...shuffle(rng, [page, spare + 1, spare + page, 2 * spare])];
	const { answer, params } = numberAnswer(value, wrong, 'KiB');
	const steps = [textBlock(`$${n(size)} : ${page}$ dà $${pages - 1}$ con resto $${page - spare}$: si arrotonda per eccesso, servono $${pages}$ pagine.`), `${pages} \\cdot ${page} = ${withUnit(pages * page, 'KiB')}`];
	if (!assigned) steps.push(textBlock("Lo spazio inutilizzato è la differenza tra la memoria assegnata e quella richiesta."), `${n(pages * page)} - ${n(size)} = ${withUnit(spare, 'KiB')}`);
	return {
		prompt: assigned ? 'Calcola la memoria assegnata al processo.' : "Calcola lo spazio che resta inutilizzato nell'ultima pagina.",
		problem: textBlock(
			`${rng.pick(SUBJECTS)} chiede al sistema ${kib(size)} di memoria. Le pagine sono di ${kib(page)}. ${assigned ? 'Quanta memoria gli viene assegnata, contando le pagine intere?' : "Quanti kibibyte restano inutilizzati nell'ultima pagina?"}`,
		),
		solution: withUnit(value, 'KiB'),
		steps,
		answer,
		params: { ...params, case: assigned ? 'assegnata' : 'inutilizzata', size, page },
	};
}

// ---------------------------------------------------------------------------
// Level 5: pages in the swap area, frames left free

function level5(rng: Rng): Built {
	const asks = [0, 1, 2].map(() => rng.int(2, 30));
	const total = asks[0] + asks[1] + asks[2];
	const swap = rng.next() < 0.65;
	const diff = rng.int(1, Math.min(20, total - 4));
	const frames = swap ? total - diff : total + diff;
	const wrong = [total, frames, ...shuffle(rng, [Math.abs(frames - asks[0] - asks[1]), diff + 1, diff - 1, diff + asks[2], diff + 2])];
	const { answer, params } = numberAnswer(diff, wrong, '');
	return {
		prompt: swap ? "Calcola quante pagine finiscono nell'area di swap." : 'Calcola quanti frame restano liberi.',
		problem: textBlock(
			`La RAM ha $${frames}$ frame liberi. Tre processi chiedono $${asks[0]}$, $${asks[1]}$ e $${asks[2]}$ pagine. ${swap ? "Quante pagine restano fuori dalla RAM e vanno nell'area di swap?" : 'Quando tutte le pagine sono nella RAM, quanti frame restano liberi?'}`,
		),
		solution: n(diff),
		steps: [
			textBlock('Si sommano le pagine richieste.'),
			`${asks[0]} + ${asks[1]} + ${asks[2]} = ${total}`,
			textBlock(swap ? `Le pagine sono più dei frame liberi: quelle in più vanno nell'area di swap.` : 'I frame liberi sono più delle pagine: quelli in più restano liberi.'),
			swap ? `${total} - ${frames} = ${diff}` : `${frames} - ${total} = ${diff}`,
		],
		answer,
		params: { ...params, case: swap ? 'swap' : 'liberi', frames, asks },
	};
}

// ---------------------------------------------------------------------------
// Level 6: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Una pagina può stare in qualunque frame libero', why: 'Tutti i frame hanno la dimensione di una pagina: una pagina può stare in qualunque frame libero.' },
	{ id: 't2', text: 'Pagine e frame hanno la stessa dimensione', why: 'La RAM è divisa in frame grandi quanto una pagina.' },
	{ id: 't3', text: "L'area di swap sta sulla memoria di massa", why: "L'area di swap è una zona della memoria di massa." },
	{ id: 't4', text: 'Con la memoria virtuale ogni processo vede una memoria tutta sua', why: 'Con la memoria virtuale ogni processo vede una memoria sua, numerata da zero.' },
	{ id: 't5', text: 'Un page fault avviene quando serve una pagina che non è nella RAM', why: 'Il page fault avviene quando il processo usa una pagina che non è nella RAM.' },
	{ id: 't6', text: 'Quando un processo termina, la sua memoria torna libera', why: 'Alla fine di un processo il sistema si riprende tutta la sua memoria.' },
	{ id: 't7', text: 'Un processo non può leggere la memoria di un altro processo', why: 'La protezione della memoria tiene separati i processi.' },
	{ id: 't8', text: 'Usare molto lo swap rallenta il computer', why: 'La memoria di massa è molto più lenta della RAM: spostare pagine avanti e indietro rallenta tutto.' },
	{ id: 't9', text: 'La tabella delle pagine dice in quale frame sta ogni pagina', why: 'Per ogni pagina la tabella delle pagine dice in quale frame si trova, o se è fuori dalla RAM.' },
	{ id: 't10', text: 'Il numero di pagine si arrotonda sempre per eccesso', why: 'Anche un solo byte in più richiede una pagina intera: si arrotonda per eccesso.' },
];
const FALSE: Statement[] = [
	{ id: 'f1', text: "L'area di swap è una parte della RAM", why: "L'area di swap non è nella RAM: sta sulla memoria di massa." },
	{ id: 'f2', text: 'La memoria virtuale aumenta la RAM installata', why: 'La memoria virtuale non aggiunge RAM: usa la memoria di massa, che è più lenta.' },
	{ id: 'f3', text: 'Le pagine di un processo devono stare in frame vicini', why: 'Le pagine di un processo possono stare in frame lontani tra loro.' },
	{ id: 'f4', text: 'Un frame è più grande di una pagina', why: 'Frame e pagine hanno la stessa dimensione.' },
	{ id: 'f5', text: 'Dopo un page fault il processo viene chiuso', why: 'Dopo un page fault il sistema carica la pagina e fa ripartire il processo.' },
	{ id: 'f6', text: 'Una pagina nello swap si usa in fretta come una nella RAM', why: 'Una pagina nello swap va prima ricopiata nella RAM, e questo richiede tempo.' },
	{ id: 'f7', text: 'La RAM piena si svuota cancellando foto e video', why: 'Foto e video stanno nella memoria di massa: la RAM si libera chiudendo i programmi.' },
	{ id: 'f8', text: 'Tutte le pagine di un processo devono stare sempre nella RAM', why: "Le pagine che non servono in quel momento possono stare nell'area di swap." },
	{ id: 'f9', text: 'Ogni processo può scrivere nella memoria degli altri', why: 'Un processo può leggere e scrivere solo nella memoria che gli è stata assegnata.' },
	{ id: 'f10', text: 'Il numero di pagine si arrotonda per difetto', why: 'Arrotondando per difetto una parte del programma resterebbe senza memoria: si arrotonda per eccesso.' },
];

// ---------------------------------------------------------------------------
// Checks

const sizeCheck = (exact: boolean, max: number) => (sample: Sample) => {
	const { size, page } = sample.params as { size: number; page: number };
	const v: string[] = [];
	if (!PAGES.includes(page)) v.push('pagine da 4, 8 o 16 KiB');
	if ((size % page === 0) !== exact) v.push(exact ? 'la divisione deve essere esatta' : 'la divisione non deve essere esatta');
	const pages = Math.ceil(size / page);
	if (pages < 3 || pages > max) v.push(`da 3 a ${max} pagine`);
	return v;
};

export default makeGenerator(ID, 'La gestione della memoria', {
	1: { label: 'Quante pagine: divisione esatta', constraints: ['pagine da 4, 8 o 16 KiB, da 3 a 60 pagine, memoria multipla della pagina'], make: level1, check: sizeCheck(true, 60) },
	2: { label: 'Quante pagine: arrotondare per eccesso', constraints: ['pagine da 4, 8 o 16 KiB, da 3 a 60 pagine, memoria non multipla della pagina'], make: level2, check: sizeCheck(false, 60) },
	3: {
		label: 'Quante pagine: dai mebibyte',
		constraints: ['da 1 a 64 MiB, pagine da 4, 8 o 16 KiB, il fattore 1024 scritto nel testo'],
		make: level3,
		check: (s) => {
			const { mib, page } = s.params as { mib: number; page: number };
			return Number.isInteger(mib) && mib >= 1 && mib <= 64 && PAGES.includes(page) ? [] : ['da 1 a 64 MiB, pagine da 4, 8 o 16 KiB'];
		},
	},
	4: { label: 'Memoria assegnata e inutilizzata', constraints: ['come il livello 2, fino a 40 pagine; memoria assegnata o spazio inutilizzato, circa metà ciascuno'], make: level4, check: sizeCheck(false, 40) },
	5: {
		label: 'RAM piena: swap e frame liberi',
		constraints: ['tre processi da 2 a 30 pagine; pagine nello swap (circa 2 su 3) o frame liberi; differenza da 1 a 20'],
		make: level5,
		check: (s) => {
			const { frames, asks } = s.params as { frames: number; asks: number[] };
			const d = Math.abs(asks.reduce((a, b) => a + b, 0) - frames);
			return asks.length === 3 && asks.every((a) => a >= 2 && a <= 30) && frames >= 4 && d >= 1 && d <= 20 ? [] : ['tre processi da 2 a 30 pagine, differenza da 1 a 20'];
		},
	},
	6: { label: 'Vero o falso sulla memoria', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, circa metà ciascuno"], make: (rng) => statementLevel(rng, TRUE, FALSE, 'sulla gestione della memoria') },
});
