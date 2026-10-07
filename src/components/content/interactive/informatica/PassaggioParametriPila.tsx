'use client';

import { useState } from 'react';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import type { Variabile } from '@/lib/informatica/tracce';
import { ProgrammaPila, SceltaLinguaggio, useLinguaggio, type Esecuzione, type Linguaggio } from './PilaProgramma';

/**
 * "Se dentro scambia lo scambio avviene davvero, dove finisce?" The three programs of lesson 68, run one row at a
 * time beside the stack of the calls, in the language of the page:
 * - `tentativo`: `scambia` receives two numbers by value, swaps its own parameters, and they go with its frame;
 * - `scambio`: the swap that works, which is not the same program in the two languages. In C++ the parameters are
 *   references, other names of `a` and `b`; in Python the function returns the two values and the caller assigns;
 * - `vettore`: a function that changes an element of the vector it receives, and the caller sees it, in both.
 *
 * It grew out of ScambiaValoreRiferimento.tsx (which shows no code, and by reference only as C++ has it): here the
 * sentences follow the rows of the lesson's programs, and the variable in between is called `temp` as in the lesson.
 */

type Programma = 'tentativo' | 'scambio' | 'vettore';
type Stato = Variabile['stato'];

const A = 3;
const B = 8;

/** How the sentences name the frame at the bottom: `main` in C++, the main program in Python, which has no main. */
const parole = (cpp: boolean) => ({ nome: cpp ? 'main' : 'programma principale', il: cpp ? 'main' : 'il programma principale', nel: cpp ? 'in main' : 'nel programma principale', del: cpp ? 'di main' : 'del programma principale' });
/** A sentence that opens with it: `main` is a name of the program and keeps its small letter. */
const maiuscola = (testo: string) => (testo === 'main' ? testo : testo.charAt(0).toUpperCase() + testo.slice(1));

function tentativo(linguaggio: Linguaggio): Esecuzione {
	const cpp = linguaggio === 'cpp';
	const { nome, il, nel } = parole(cpp);
	const base = (sa?: Stato, sb?: Stato) => ({ nome, variabili: [{ nome: 'a', valore: A, stato: sa }, { nome: 'b', valore: B, stato: sb }] });
	const scambia = (x: number, y: number, temp: number | null, sx?: Stato, sy?: Stato, st?: Stato) => ({ nome: 'scambia', variabili: [{ nome: 'x', valore: x, stato: sx }, { nome: 'y', valore: y, stato: sy }, ...(temp === null ? [] : [{ nome: 'temp', valore: temp, stato: st }])] });
	const riga = cpp ? { testa: 1, temp: 2, x: 3, y: 4, b: 9, chiama: 10, scrive: 11 } : { testa: 1, temp: 2, x: 3, y: 4, b: 7, chiama: 8, scrive: 9 };
	return {
		programma: cpp
			? `void scambia(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3;
    int b = 8;
    scambia(a, b);
    cout << a << " " << b << endl;
    return 0;
}
`
			: `def scambia(x, y):
    temp = x
    x = y
    y = temp

a = 3
b = 8
scambia(a, b)
print(a, b)
`,
		passi: [
			{ riga: riga.b, pila: [base('nuova', 'nuova')], frase: `${maiuscola(il)} ha due variabili: a vale ${A} e b vale ${B}.` },
			{ riga: riga.testa, pila: [base('letta', 'letta'), scambia(A, B, null, 'nuova', 'nuova')], frase: `La chiamata scambia(a, b) apre il riquadro di scambia. I parametri x e y sono variabili locali di scambia, e partono con i valori di a e b: ${A} e ${B}.` },
			{ riga: riga.temp, pila: [base(), scambia(A, B, A, 'letta', 'normale', 'nuova')], frase: `Nasce la variabile locale temp, che conserva il valore di x: ${A}.` },
			{ riga: riga.x, pila: [base(), scambia(B, B, A, 'scritta', 'letta')], frase: `x prende il valore di y, ${B}. Cambia solo x: ${nel} a vale ancora ${A}.` },
			{ riga: riga.y, pila: [base(), scambia(B, A, A, 'normale', 'scritta', 'letta')], frase: `y prende il valore di temp, ${A}. Dentro scambia lo scambio è fatto; ${nel} non è cambiato niente.` },
			{ riga: riga.chiama, pila: [base()], frase: `scambia finisce e il suo riquadro sparisce, con x, y e temp. Lo scambio è sparito con loro.` },
			{ riga: riga.scrive, pila: [base('letta', 'letta')], uscita: [`${A} ${B}`], frase: `${maiuscola(il)} scrive a e b: ${A} e ${B}, come prima della chiamata.` }
		]
	};
}

/** The swap that works in C++: the parameters are references, drawn dashed, with whose other name they are. */
function riferimento(): Esecuzione {
	const base = (a: number, b: number, sa?: Stato, sb?: Stato) => ({ nome: 'main', variabili: [{ nome: 'a', valore: a, stato: sa }, { nome: 'b', valore: b, stato: sb }] });
	const scambia = (x: number, y: number, temp: number | null, sx?: Stato, sy?: Stato, st?: Stato) => ({
		nome: 'scambia',
		variabili: [{ nome: 'x', valore: x, stato: sx, rif: 'a di main' }, { nome: 'y', valore: y, stato: sy, rif: 'b di main' }, ...(temp === null ? [] : [{ nome: 'temp', valore: temp, stato: st }])]
	});
	return {
		programma: `void scambia(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 3;
    int b = 8;
    scambia(a, b);
    cout << a << " " << b << endl;
    return 0;
}
`,
		passi: [
			{ riga: 9, pila: [base(A, B, 'nuova', 'nuova')], frase: `main ha due variabili: a vale ${A} e b vale ${B}.` },
			{ riga: 1, pila: [base(A, B, 'letta', 'letta'), scambia(A, B, null, 'nuova', 'nuova')], frase: 'La chiamata apre il riquadro di scambia. Con la & i parametri x e y non sono variabili nuove: sono altri due nomi per a e b di main.' },
			{ riga: 2, pila: [base(A, B), scambia(A, B, A, 'letta', 'normale', 'nuova')], frase: `Nasce la variabile locale temp, che conserva il valore di x, cioè di a: ${A}.` },
			{ riga: 3, pila: [base(B, B, 'scritta'), scambia(B, B, A, 'scritta', 'letta')], frase: `x prende il valore di y, ${B}. Ma x è un altro nome di a: anche in main ora a vale ${B}.` },
			{ riga: 4, pila: [base(B, A, 'normale', 'scritta'), scambia(B, A, A, 'normale', 'scritta', 'letta')], frase: `y prende il valore di temp, ${A}, e con y cambia b di main. Lo scambio è fatto dove serviva.` },
			{ riga: 10, pila: [base(B, A)], frase: 'scambia finisce e il suo riquadro sparisce, con i nomi x e y e con temp. Le variabili a e b restano, scambiate.' },
			{ riga: 11, pila: [base(B, A, 'letta', 'letta')], uscita: [`${B} ${A}`], frase: `main scrive a e b: ${B} e ${A}.` }
		]
	};
}

/** The swap that works in Python: the function gives back the two values the other way round, and the caller assigns them. */
function dueValori(): Esecuzione {
	const nome = 'programma principale';
	const base = (a: number, b: number, sa?: Stato, sb?: Stato) => ({ nome, variabili: [{ nome: 'a', valore: a, stato: sa }, { nome: 'b', valore: b, stato: sb }] });
	const scambia = (sx?: Stato, sy?: Stato) => ({ nome: 'scambia', variabili: [{ nome: 'x', valore: A, stato: sx }, { nome: 'y', valore: B, stato: sy }] });
	return {
		programma: `def scambia(x, y):
    return y, x

a = 3
b = 8
a, b = scambia(a, b)
print(a, b)
`,
		passi: [
			{ riga: 5, pila: [base(A, B, 'nuova', 'nuova')], frase: `Il programma principale ha due variabili: a vale ${A} e b vale ${B}.` },
			{ riga: 1, pila: [base(A, B, 'letta', 'letta'), scambia('nuova', 'nuova')], frase: `La chiamata scambia(a, b) apre il riquadro di scambia. I parametri x e y partono con i valori di a e b: ${A} e ${B}.` },
			{ riga: 2, pila: [base(A, B), scambia('letta', 'letta')], frase: `return restituisce due valori: prima quello di y, ${B}, poi quello di x, ${A}. La funzione non ha modificato niente.` },
			{ riga: 6, pila: [base(B, A, 'scritta', 'scritta')], frase: `Il riquadro di scambia sparisce. L'assegnamento con due nomi a sinistra mette il primo valore, ${B}, in a e il secondo, ${A}, in b: lo scambio lo fa il programma principale.` },
			{ riga: 7, pila: [base(B, A, 'letta', 'letta')], uscita: [`${B} ${A}`], frase: `Il programma principale scrive a e b: ${B} e ${A}.` }
		]
	};
}

function vettore(linguaggio: Linguaggio): Esecuzione {
	const cpp = linguaggio === 'cpp';
	const { nome, il } = parole(cpp);
	const stesso = cpp ? 'dello stesso vettore' : 'della stessa lista';
	const scritto = (v: number[]) => (cpp ? `{${v.join(', ')}}` : `[${v.join(', ')}]`);
	const PRIMA = [5, 7, 8];
	const DOPO = [6, 7, 8];
	const base = (v: number[], stato?: Stato) => ({ nome, variabili: [{ nome: 'pagella', valore: scritto(v), stato }] });
	const recupera = (v: number[], stato?: Stato) => ({ nome: 'recupera', variabili: [{ nome: 'voti', valore: scritto(v), stato, rif: cpp ? 'pagella di main' : 'pagella' }] });
	const riga = cpp ? { testa: 1, scrive0: 2, crea: 6, chiama: 7, scrive: 8 } : { testa: 1, scrive0: 2, crea: 4, chiama: 5, scrive: 6 };
	return {
		programma: cpp
			? `void recupera(int voti[]) {
    voti[0] = 6;
}

int main() {
    int pagella[3] = {5, 7, 8};
    recupera(pagella);
    cout << pagella[0] << endl;
    return 0;
}
`
			: `def recupera(voti):
    voti[0] = 6

pagella = [5, 7, 8]
recupera(pagella)
print(pagella[0])
`,
		passi: [
			{ riga: riga.crea, pila: [base(PRIMA, 'nuova')], frase: `${maiuscola(il)} crea ${cpp ? 'il vettore' : 'la lista'} pagella con tre voti. Il primo, quello con indice 0, è un 5.` },
			{ riga: riga.testa, pila: [base(PRIMA, 'letta'), recupera(PRIMA, 'nuova')], frase: `La chiamata recupera(pagella) apre il riquadro di recupera. Il parametro voti non riceve una copia dei tre voti: è un altro nome ${stesso}.` },
			{ riga: riga.scrive0, pila: [base(DOPO, 'scritta'), recupera(DOPO, 'scritta')], frase: `La funzione cambia l'elemento di indice 0. ${cpp ? 'Il vettore è uno solo' : 'La lista è una sola'}: il 6 compare anche in pagella.` },
			{ riga: riga.chiama, pila: [base(DOPO)], frase: `recupera finisce e il suo riquadro sparisce, con il nome voti. ${cpp ? 'Il vettore' : 'La lista'} resta, modificat${cpp ? 'o' : 'a'}.` },
			{ riga: riga.scrive, pila: [base(DOPO, 'letta')], uscita: ['6'], frase: `${maiuscola(il)} scrive il primo voto di pagella: 6.` }
		]
	};
}

const ESECUZIONI: Record<Programma, Record<Linguaggio, Esecuzione>> = {
	tentativo: { python: tentativo('python'), cpp: tentativo('cpp') },
	scambio: { python: dueValori(), cpp: riferimento() },
	vettore: { python: vettore('python'), cpp: vettore('cpp') }
};

export default function PassaggioParametriPila() {
	const [linguaggio, scegli] = useLinguaggio();
	const [programma, setProgramma] = useState<Programma>('tentativo');
	const tutte = (Object.keys(ESECUZIONI) as Programma[]).map((p) => ESECUZIONI[p][linguaggio]);
	return (
		<ProgrammaPila
			chiave={`${programma}-${linguaggio}`}
			esecuzione={ESECUZIONI[programma][linguaggio]}
			tutte={tutte}
			scelte={
				<>
					<ToggleGroup
						compact
						label="Quale programma della lezione"
						value={programma}
						onChange={setProgramma}
						options={[
							{ value: 'tentativo', label: 'Tentativo' },
							{ value: 'scambio', label: 'Scambio' },
							{ value: 'vettore', label: 'Vettore' }
						]}
					/>
					<SceltaLinguaggio linguaggio={linguaggio} onLinguaggio={scegli} />
				</>
			}
		/>
	);
}
