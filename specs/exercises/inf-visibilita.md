# inf-visibilita: variabili locali e globali

Esercizi della lezione 67 del terzo anno di informatica, `docs/lezioni/informatica/riscritte/67-inf-visibilita.md`.
Generatore: `src/lib/exercises/v2/generators/inf-visibilita.ts`. Controllo:
`scripts/exercises/checkers/inf_visibilita.py`.

Ogni programma è scritto a mano in Python e in C++ con `src/lib/exercises/v2/inf-codice.ts`
(`docs/lezioni/informatica/brief-esercizi-codice.md`). I numeri sono interi, con `+`, `-` e `*`: niente divisioni.
Le parole sono quelle della lezione: variabile locale, variabile globale, visibilità, programma principale,
parametro, argomento, valore restituito, "nasconde".

## Le funzioni degli esercizi

Quasi tutti i livelli usano una funzione di due numeri interi che mette in una variabile locale `k * a + b` oppure
`k * a - b` e la restituisce.

| Famiglia | Funzione | Variabile locale | Calcolo | k |
|---|---|---|---|---|
| `paga` | `paga(ore, premio)` | `soldi` | `k * ore + premio` | da 6 a 9 |
| `spesa` | `spesa(kg, sconto)` | `conto` | `k * kg - sconto` | da 3 a 6 |
| `tempo` | `tempo(giri, pausa)` | `minuti` | `k * giri + pausa` | da 2 a 5 |
| `punti` | `punti(vinte, pari)` | `totale` | `k * vinte + pari` | da 2 a 5 |

`punti` è l'esempio della lezione e compare solo nel livello 5, dove lo studente la scrive. I nomi sono corti perché
la funzione in C++ deve stare in 34 caratteri quando è un'opzione.

I livelli 2 e 3 hanno anche una funzione che aggiunge il suo parametro a una variabile: `versa(euro)` con `saldo`,
`carica(litri)` con `livello`, `sali(gradini)` con `quota`, `segna(gol)` con `reti`.

## Livelli

1. **Dove esiste una variabile.** Un programma sotto la domanda, opzioni di testo. Tre casi, un terzo ciascuno.
   - `locali`: "Quali sono le variabili locali della funzione paga?". Il programma ha una funzione e un programma
     principale con tre variabili. Giusta: i due parametri e la variabile creata nella funzione. Distrattori: la
     sola variabile creata nella funzione (chi dimentica che i parametri sono locali, sempre presente), i soli
     parametri, le variabili del programma principale, la locale insieme a quelle, tutte.
   - `fuori`: "In fondo al programma principale vuoi aggiungere un'istruzione che scrive una di queste variabili. Con
     quale il programma dà errore?". Giusta: un parametro o la variabile locale della funzione. Distrattori: le tre
     variabili del programma principale. È l'errore del riquadro "Il risultato non esce da solo dalla funzione".
   - `dove`: "In quale parte del programma puoi usare la variabile x?". Il programma ha una variabile globale
     dichiarata sopra due funzioni, che la leggono tutte e due; x è la globale, un parametro o una variabile locale
     di una delle due funzioni. Opzioni: solo nella prima funzione, solo nella seconda, nelle due funzioni ma non
     nel programma principale, solo nel programma principale, nelle due funzioni e nel programma principale. Per
     una locale l'opzione "nelle due funzioni e nel programma principale" c'è sempre.

   Nessuna domanda chiede delle variabili del programma principale, che in Python sono globali e in C++ sono locali
   di `main`: la risposta è la stessa nei due linguaggi.
   Esempio (`locali`): `paga(ore, premio)` con `soldi`, e nel programma principale `lunedi`, `sabato`, `settimana`
   → "ore, premio, soldi".
2. **Due variabili con lo stesso nome.** "Che cosa scrive questo programma?", opzioni che sono uscite. Lo stesso
   nome è una variabile del programma principale e una variabile locale della funzione, che è chiamata due volte.
   Tre casi, un terzo ciascuno.
   - `nascosta`: il programma principale ha `soldi = 50`, mette i due valori di ritorno in altre due variabili e
     scrive `soldi` e le due. Giusta: 50 e i due risultati. Distrattore sempre presente: al posto di 50 il secondo
     risultato (chi crede che la funzione cambi la variabile del programma principale).
   - `rinasce`: la funzione crea la locale con un valore di partenza (0 una volta su due, altrimenti una decina),
     le aggiunge il parametro e la restituisce; il programma principale scrive le due chiamate e poi la sua
     variabile. Distrattori sempre presenti: la seconda chiamata che parte dal risultato della prima (la locale che
     ricorda, il riquadro "Una variabile locale non ricorda la chiamata precedente"), e la variabile del programma
     principale uguale all'ultimo risultato.
   - `somma`: il programma principale aggiunge i due valori di ritorno alla sua variabile, che non parte da 0, e la
     scrive. Giusta: partenza più i due risultati. Distrattore sempre presente: la somma dei due risultati senza la
     partenza.

   Esempio (`rinasce`): `versa(euro)` con `saldo = 10` e `saldo = saldo + euro`; `saldo = 50`, `versa(4)`,
   `versa(3)` → 14, 13, 50.
3. **Una variabile globale.** "Che cosa scrive questo programma?", opzioni che sono uscite. La globale è dichiarata
   sopra la funzione nei due linguaggi. Tre casi, un terzo ciascuno.
   - `cambia`: la funzione legge la globale che fa da coefficiente (`tariffa`, `prezzo`, `durata`) e il programma
     principale la cambia tra due chiamate uguali. Distrattore sempre presente: due volte il primo risultato.
   - `nasconde`: la funzione ha un solo parametro e crea una locale con il nome della globale, poi il programma
     principale scrive il risultato e la globale. Distrattori sempre presenti: la globale cambiata dalla funzione,
     la funzione che usa il valore della globale.
   - `modifica`: la funzione modifica la globale, in Python con la riga `global nome` e in C++ senza (lì la funzione
     è `void`); due chiamate, poi il programma principale scrive la globale. Distrattori sempre presenti: la
     globale com'era all'inizio, la sola seconda chiamata.

   Esempio (`cambia`): `tariffa = 9`, `paga(4, 5)`, `tariffa = 7`, `paga(4, 5)` → 41, 33.
4. **Senza variabili globali.** La consegna dice che sopra la funzione c'è una variabile globale e quanto vale, e
   chiede quale funzione fa il calcolo usando solo i suoi parametri e restituendo il risultato. Opzioni: quattro
   programmi, di cui si vede solo la funzione. Il programma intero di ogni opzione dichiara la globale, definisce la
   funzione e scrive due chiamate con argomenti diversi. Tre famiglie, un terzo ciascuna: `paga`, `spesa`, `tempo`.
   Distrattori: la funzione che legge la globale al posto del secondo parametro (sempre presente, e scrive altro
   perché la globale non vale quanto gli argomenti), i parametri scambiati, il segno sbagliato, il coefficiente
   dimenticato, il coefficiente sommato, la funzione che restituisce un parametro e lascia il risultato nella
   variabile locale.
5. **Scrivi la funzione.** Risposta aperta. Il programma di partenza legge due numeri, un valore per riga; lo
   studente scrive sopra la funzione con il nome e i parametri dati, che usa una variabile locale e restituisce il
   risultato, poi la chiama e scrive quello che restituisce. Tre famiglie, un terzo ciascuna: `punti` (k punti per
   ogni vittoria e 1 per ogni pari), `sconto` (il conto della frutta, `spesa(kg, sconto)`), `contatore`
   (`sufficienti(a, b)`: quanti di due voti sono almeno 6, contati in una variabile locale che parte da 0). Il
   programma è eseguito su tre coppie di numeri che scrivono tre risultati diversi, e deve contenere una funzione
   definita e chiamata dallo studente (`funzione`). Per `contatore` le tre prove scrivono 2, 1 e 0, e una ha un
   voto uguale a 6. A scelta multipla: quattro funzioni, come nel livello 4, senza la globale; per `contatore` i
   distrattori sono `>` al posto di `>=`, il contatore che parte da 1, `quanti = 1` al posto dell'incremento, il
   confronto al contrario, i voti sommati.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Righe di al più 34 caratteri nelle opzioni che sono programmi, di al più 42 nei programmi sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor;
  al più 18 righe in Python e 28 in C++ sotto la domanda.
- I casi di un livello escono nelle stesse quote (tra il 25% e il 42% ciascuno).
- Funzioni definite prima del programma principale; in C++ `#include <iostream>`, `using namespace std;`, le
  globali e le funzioni prima di `main`; rientro di 4 spazi.
- Nei livelli 2 e 3 le risposte di chi fa gli errori della lezione sono tra le opzioni e sono diverse dalla
  risposta giusta.
- Nel livello 5 nessuna prova scrive un numero negativo.

## Da evitare

- Domande sulle variabili del programma principale ("è locale o globale?"): la risposta cambia da Python a C++.
- Un programma che va in errore come riferimento o come opzione: la domanda sulla variabile usata fuori dalla sua
  funzione mostra il programma che funziona e chiede quale variabile non si può scrivere in fondo.
- Una funzione senza `return` tra le opzioni che sono programmi: in Python il programma scriverebbe `None`, in C++
  non compila o non ha un comportamento definito. Al suo posto c'è la funzione che restituisce un parametro.
- Nel livello 5 la chiamata già scritta nel programma di partenza: in C++ non compilerebbe finché la funzione non
  c'è. La chiamata la scrive lo studente.
- Numeri estratti in cui due errori danno la stessa uscita: si estraggono di nuovo, senza cambiare il caso.
