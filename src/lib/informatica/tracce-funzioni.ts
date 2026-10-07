/**
 * The traces of the figures of the first two lessons on functions (informatica, third year: lessons 65 and 66). A
 * program with a function is followed row by row: which row runs, which row of `main` waits for the function to
 * end, the stack of the calls, what is on the screen so far and a sentence in Italian.
 *
 * As in tracce.ts there is no React here: a trace is data, written once per language because the rows of the same
 * program are not the same in Python and in C++. The rows are found by their text, so a trace cannot point at a row
 * that is not in its program. Tests: tests/unit/informatica-tracce-funzioni.test.mjs
 */
import type { Chiamata, Variabile } from './tracce';

export type Linguaggio = 'python' | 'cpp';

/** One step of a program followed row by row. */
export type PassoProgramma = {
	/** The row that runs in this step, from 1. */
	riga: number;
	/** The rows of the calls that wait for a function to end, from 1. */
	attesa: number[];
	/** The stack of the calls, `main` first. */
	pila: Chiamata[];
	/** What the program has written so far, row by row. */
	uscita: string[];
	frase: string;
};

export type TracciaProgramma = { codice: string; passi: PassoProgramma[] };

/** The row of `codice` (from 1) that holds `testo`: the first, or the one of that occurrence. */
export function rigaDi(codice: string, testo: string, occorrenza = 1): number {
	const righe = codice.split('\n');
	let viste = 0;
	for (let i = 0; i < righe.length; i++) {
		if (righe[i].includes(testo) && ++viste === occorrenza) return i + 1;
	}
	throw new Error(`rigaDi: "${testo}" (${occorrenza}) is not in the program`);
}

type Stato = Variabile['stato'];
const variabile = (nome: string, valore: number | string, stato?: Stato): Variabile => ({ nome, valore, stato });

// ---------------------------------------------------------------- lesson 65: a function without parameters

const TRATTINI = '------------';

const CLASSIFICA: Record<Linguaggio, string> = {
	python: ['def linea():', `    print("${TRATTINI}")`, '', 'print("Classifica")', 'linea()', 'print("1. Tigri 12")', 'print("2. Lupi 9")', 'linea()', 'print("Fine")'].join('\n'),
	cpp: [
		'#include <iostream>',
		'using namespace std;',
		'',
		'void linea() {',
		`    cout << "${TRATTINI}" << endl;`,
		'}',
		'',
		'int main() {',
		'    cout << "Classifica" << endl;',
		'    linea();',
		'    cout << "1. Tigri 12" << endl;',
		'    cout << "2. Lupi 9" << endl;',
		'    linea();',
		'    cout << "Fine" << endl;',
		'    return 0;',
		'}'
	].join('\n')
};

/**
 * Lesson 65, "in che ordine vengono eseguite le righe di un programma con una funzione?": the standings of a
 * tournament, with a function `linea` that writes a row of dashes and is called twice.
 */
export function classificaConLinea(linguaggio: Linguaggio): TracciaProgramma {
	const codice = CLASSIFICA[linguaggio];
	const python = linguaggio === 'python';
	const riga = (testo: string, occorrenza = 1) => rigaDi(codice, testo, occorrenza);
	const corpo = riga(TRATTINI);
	const chiamata = (k: number) => riga(python ? 'linea()' : 'linea();', python ? k + 1 : k);
	const main: Chiamata = { nome: python ? 'programma' : 'main', variabili: [] };
	const linea: Chiamata = { nome: 'linea', variabili: [] };
	const chi = python ? 'Il programma' : 'main';
	const passi: PassoProgramma[] = [];
	const uscita: string[] = [];
	const passo = (r: number, frase: string, dentro = 0) => passi.push({ riga: r, attesa: dentro ? [chiamata(dentro)] : [], pila: dentro ? [main, linea] : [main], uscita: [...uscita], frase });

	passo(
		python ? riga('def linea') : riga('int main'),
		python
			? 'Python legge la definizione di linea e ne impara il nome. Il corpo, rientrato, per ora non viene eseguito.'
			: 'Un programma in C++ comincia sempre da main. La funzione linea è scritta più in alto, ma finché nessuno la chiama il suo corpo non viene eseguito.'
	);
	uscita.push('Classifica');
	passo(riga('"Classifica"'), `${chi} scrive Classifica.`);
	passo(chiamata(1), `Prima chiamata di linea: ${python ? 'il programma' : 'main'} si ferma a questa riga e il flusso salta al corpo della funzione.`);
	uscita.push(TRATTINI);
	passo(corpo, `Si esegue il corpo di linea, che scrive i trattini. ${chi} aspetta alla riga ${chiamata(1)}.`, 1);
	uscita.push('1. Tigri 12');
	passo(riga('Tigri'), `Il corpo è finito: il flusso torna alla riga dopo la chiamata, e ${python ? 'il programma' : 'main'} scrive la prima squadra.`);
	uscita.push('2. Lupi 9');
	passo(riga('Lupi'), `${chi} scrive la seconda squadra.`);
	passo(chiamata(2), 'Seconda chiamata di linea: il flusso salta di nuovo allo stesso corpo, che è scritto una volta sola.');
	uscita.push(TRATTINI);
	passo(corpo, `Il corpo di linea scrive un'altra riga di trattini. Questa volta ${python ? 'il programma' : 'main'} aspetta alla riga ${chiamata(2)}.`, 2);
	uscita.push('Fine');
	passo(riga('"Fine"'), `Il flusso torna dopo la seconda chiamata, non dopo la prima: ${python ? 'il programma' : 'main'} scrive Fine e termina.`);
	return { codice, passi };
}

// ---------------------------------------------------------------- lesson 66: parameters and a return value

const PUNTI = (chiamata: string): Record<Linguaggio, string> => ({
	python: ['def punti(vinte, pareggi):', '    return 3 * vinte + pareggi', '', 'v = 4', 'p = 2', `t = ${chiamata}`, 'print("Punti:", t)'].join('\n'),
	cpp: [
		'#include <iostream>',
		'using namespace std;',
		'',
		'int punti(int vinte, int pareggi) {',
		'    return 3 * vinte + pareggi;',
		'}',
		'',
		'int main() {',
		'    int v = 4;',
		'    int p = 2;',
		`    int t = ${chiamata};`,
		'    cout << "Punti: " << t << endl;',
		'    return 0;',
		'}'
	].join('\n')
});

/**
 * Lesson 66, "quale argomento finisce in quale parametro, e dove va il valore restituito?": the points of a team,
 * three for a win and one for a draw. With `scambiati` the call is `punti(p, v)`: the arguments go into the
 * parameters by their place, so the draws are counted as wins.
 */
export function puntiConRitorno(linguaggio: Linguaggio, scambiati = false): TracciaProgramma {
	const V = 4;
	const P = 2;
	const chiamata = scambiati ? 'punti(p, v)' : 'punti(v, p)';
	const codice = PUNTI(chiamata)[linguaggio];
	const python = linguaggio === 'python';
	const riga = (testo: string) => rigaDi(codice, testo);
	const [primo, secondo] = scambiati ? ['p', 'v'] : ['v', 'p'];
	const [vinte, pareggi] = scambiati ? [P, V] : [V, P];
	const totale = 3 * vinte + pareggi;
	const nomeMain = python ? 'programma' : 'main';
	const chi = python ? 'Il programma' : 'main';
	const main = (...variabili: Variabile[]): Chiamata => ({ nome: nomeMain, variabili });
	const punti = (...variabili: Variabile[]): Chiamata => ({ nome: 'punti', variabili });
	const rChiamata = riga(chiamata);
	const passi: PassoProgramma[] = [];
	const passo = (r: number, pila: Chiamata[], frase: string, uscita: string[] = []) => passi.push({ riga: r, attesa: pila.length > 1 ? [rChiamata] : [], pila, uscita, frase });

	passo(
		python ? riga('def punti') : riga('int main'),
		[main()],
		python
			? 'Python legge la definizione di punti e ne impara il nome e i due parametri. Il corpo non viene ancora eseguito.'
			: 'Il programma comincia da main. La funzione punti è definita più in alto, con i suoi due parametri, ma non viene eseguita finché nessuno la chiama.'
	);
	passo(riga('v = 4'), [main(variabile('v', V, 'nuova'))], `Nasce la variabile v, le partite vinte: vale ${V}.`);
	passo(riga('p = 2'), [main(variabile('v', V), variabile('p', P, 'nuova'))], `Nasce la variabile p, i pareggi: vale ${P}.`);
	passo(
		rChiamata,
		[main(variabile('v', V, 'letta'), variabile('p', P, 'letta'))],
		`${chi} chiama ${chiamata}. Gli argomenti sono due valori: quello di ${primo}, cioè ${vinte}, e quello di ${secondo}, cioè ${pareggi}.`
	);
	passo(
		python ? riga('def punti') : riga('int punti'),
		[main(variabile('v', V), variabile('p', P)), punti(variabile('vinte', vinte, 'nuova'), variabile('pareggi', pareggi, 'nuova'))],
		scambiati
			? `Il primo argomento, ${vinte}, va nel primo parametro, vinte, anche se veniva da p: conta il posto, non il nome. Il secondo, ${pareggi}, va in pareggi.`
			: `Si apre il riquadro di punti. Il primo argomento, ${vinte}, va nel primo parametro, vinte; il secondo, ${pareggi}, va nel secondo, pareggi.`
	);
	passo(
		riga('return 3'),
		[main(variabile('v', V), variabile('p', P)), punti(variabile('vinte', vinte, 'letta'), variabile('pareggi', pareggi, 'letta'), variabile('return', totale, 'scritta'))],
		`return calcola 3 · ${vinte} + ${pareggi} = ${totale} e lo restituisce a chi ha chiamato. La funzione finisce qui.`
	);
	passo(
		rChiamata,
		[main(variabile('v', V), variabile('p', P), variabile('t', totale, 'nuova'))],
		`Il riquadro di punti sparisce con i suoi parametri. Il valore restituito, ${totale}, prende il posto della chiamata e finisce in t.`
	);
	passo(
		riga('"Punti:'),
		[main(variabile('v', V), variabile('p', P), variabile('t', totale, 'letta'))],
		scambiati ? `${chi} scrive Punti: ${totale}. Con ${V} vittorie e ${P} pareggi dovevano essere ${3 * V + P}: gli argomenti erano nell'ordine sbagliato.` : `${chi} scrive Punti: ${totale}, il valore che la funzione ha restituito.`,
		[`Punti: ${totale}`]
	);
	return { codice, passi };
}
