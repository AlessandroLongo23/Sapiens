'use client';

import type { Variabile } from '@/lib/informatica/tracce';
import { ProgrammaPila, SceltaLinguaggio, useLinguaggio, type Esecuzione, type Linguaggio } from './PilaProgramma';

/**
 * "Mentre punti calcola i punti dell'andata, quante variabili totale ci sono, e quanto valgono?" The program of
 * lesson 67 (the points of a season: two calls of `punti`, and a `totale` in the main program and one in the
 * function), run one row at a time beside the stack of the calls. The frame of `punti` is born at each call with
 * its own `totale` and goes at the return; the `totale` of the main program is another variable.
 */

const PROGRAMMA: Record<Linguaggio, string> = {
	python: `def punti(vinte, pareggi):
    totale = 3 * vinte + pareggi
    return totale

totale = 0
totale = totale + punti(4, 1)
totale = totale + punti(2, 3)
print(totale)
`,
	cpp: `int punti(int vinte, int pareggi) {
    int totale = 3 * vinte + pareggi;
    return totale;
}

int main() {
    int totale = 0;
    totale = totale + punti(4, 1);
    totale = totale + punti(2, 3);
    cout << totale << endl;
    return 0;
}
`
};

/** The rows of the two programs that do the same thing: the function's three, and the main program's four. */
const RIGA: Record<Linguaggio, { testa: number; calcolo: number; ritorno: number; zero: number; andata: number; rientro: number; scrive: number }> = {
	python: { testa: 1, calcolo: 2, ritorno: 3, zero: 5, andata: 6, rientro: 7, scrive: 8 },
	cpp: { testa: 1, calcolo: 2, ritorno: 3, zero: 7, andata: 8, rientro: 9, scrive: 10 }
};

function esecuzione(linguaggio: Linguaggio): Esecuzione {
	const riga = RIGA[linguaggio];
	const cpp = linguaggio === 'cpp';
	// how the sentences name the frame at the bottom: `main` in C++, the main program in Python, which has no main
	const nome = cpp ? 'main' : 'programma principale';
	const del = cpp ? 'di main' : 'del programma principale';
	type Stato = Variabile['stato'];
	const base = (totale: number, stato?: Stato) => ({ nome, variabili: [{ nome: 'totale', valore: totale, stato }] });
	const punti = (v: number, p: number, totale: number | null, sp?: Stato, st?: Stato) => ({
		nome: 'punti',
		variabili: [{ nome: 'vinte', valore: v, stato: sp }, { nome: 'pareggi', valore: p, stato: sp }, ...(totale === null ? [] : [{ nome: 'totale', valore: totale, stato: st }])]
	});
	const Il = cpp ? 'main' : 'Il programma principale';
	return {
		programma: PROGRAMMA[linguaggio],
		passi: [
			{ riga: riga.zero, pila: [base(0, 'nuova')], frase: `${Il} crea la sua variabile totale e ci mette 0.` },
			{ riga: riga.testa, pila: [base(0), punti(4, 1, null, 'nuova')], frase: `La riga dell'andata chiama punti(4, 1). Sopra il riquadro ${del} compare quello di punti, con i parametri vinte e pareggi che ricevono 4 e 1.` },
			{ riga: riga.calcolo, pila: [base(0), punti(4, 1, 13, 'letta', 'nuova')], frase: `Nasce totale, variabile locale di punti: 3 · 4 + 1 = 13. Il totale ${del} è un'altra variabile, e vale ancora 0.` },
			{ riga: riga.ritorno, pila: [base(0), punti(4, 1, 13, 'normale', 'letta')], frase: 'return restituisce il valore del totale di punti, 13. La funzione ha finito.' },
			{ riga: riga.andata, pila: [base(13, 'scritta')], frase: `Il riquadro di punti è sparito, con vinte, pareggi e il suo totale. Il 13 restituito si somma al totale ${del}: 0 + 13 = 13.` },
			{ riga: riga.testa, pila: [base(13), punti(2, 3, null, 'nuova')], frase: 'La riga del ritorno chiama punti(2, 3). Nasce un riquadro nuovo, con parametri nuovi: del 13 di prima qui non è rimasto niente.' },
			{ riga: riga.calcolo, pila: [base(13), punti(2, 3, 9, 'letta', 'nuova')], frase: `Nasce un altro totale locale: 3 · 2 + 3 = 9. Quello ${del} intanto vale 13.` },
			{ riga: riga.ritorno, pila: [base(13), punti(2, 3, 9, 'normale', 'letta')], frase: 'return restituisce 9.' },
			{ riga: riga.rientro, pila: [base(22, 'scritta')], frase: `Il riquadro di punti sparisce di nuovo. Il totale ${del} diventa 13 + 9 = 22.` },
			{ riga: riga.scrive, pila: [base(22, 'letta')], uscita: ['22'], frase: `${Il} scrive 22. Di tutte le variabili totale che sono esistite ne è rimasta una, la sua.` }
		]
	};
}

const ESECUZIONI: Record<Linguaggio, Esecuzione> = { python: esecuzione('python'), cpp: esecuzione('cpp') };

export default function VisibilitaPila() {
	const [linguaggio, scegli] = useLinguaggio();
	return <ProgrammaPila chiave={linguaggio} esecuzione={ESECUZIONI[linguaggio]} tutte={[ESECUZIONI[linguaggio]]} scelte={<SceltaLinguaggio linguaggio={linguaggio} onLinguaggio={scegli} />} />;
}
