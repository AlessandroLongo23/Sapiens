# inf-variabili-tipi: Variabili, assegnamento e tipi di dato

Lezione: `docs/lezioni/informatica/riscritte/53-inf-variabili-tipi.md`. Segue il generatore di riferimento
`inf-ciclo-while`, con gli aiuti di `inf-primi.ts`. I programmi sono sequenze di letture, assegnamenti e scritture,
con numeri interi e `+ - *`.

Distrattori, dai riquadri della lezione: l'ordine delle istruzioni scambiato; l'assegnamento letto come uguaglianza
(la variabile non cambia); lo scambio senza la variabile di appoggio; l'assegnamento nel verso sbagliato; la
variabile usata prima di averle dato un valore; il nome della variabile stampato tra virgolette; `"3"` preso per un
numero.

## Livelli

1. **Seguire gli assegnamenti.** Una variabile, un valore di partenza e due o tre assegnamenti che usano il suo
   valore (metà e metà); mai un valore negativo. Esempio: `punti = 10`, `punti = punti + 5`, `punti = punti * 2` →
   30. Distrattori: le due ultime istruzioni scambiate (25), solo l'ultima, il valore prima dell'ultima.
2. **Scambiare due variabili.** Due valori diversi e, un terzo ciascuno: lo scambio con la variabile di appoggio, le
   due istruzioni `a = b`, `b = a`, le stesse al contrario. Opzioni: le quattro coppie possibili.
   Esempio: `a = 3`, `b = 8`, `a = b`, `b = a` → "8, 8".
3. **Il tipo giusto per un dato.** Testo. Un dato detto a parole (55 su 100; 32 dati, 8 per tipo) oppure un valore
   scritto come in un programma (`15`, `-3`, `2.5`, `"Giulia"`, `"3"`, vero o falso). Opzioni: i quattro tipi di
   base. Esempio: "una variabile riceve il valore "42"" → Testo (stringa).
4. **Sommare numeri, unire testi.** `+` tra due numeri interi o tra due testi fatti di cifre (metà e metà).
   Esempio: `s = "3"`, `t = "4"`, `print(s + t)` → 34. Distrattori: la somma (7), "3 + 4", "s + t".
5. **Costruire il diagramma di un calcolo.** Cinque famiglie, un quinto ciascuna: `prodotto` (totale = prezzo per
   quantità), `aggiorna` (punti = punti + bonus), `costante` (perimetro = lato per 4), `due passi` (somma, poi il
   doppio), `scambio`. Risposta aperta: il diagramma, eseguito su due prove. A scelta multipla: quattro diagrammi.
6. **Scrivere il programma di un calcolo.** Le stesse famiglie. Risposta aperta: il programma, che parte dalle
   letture. A scelta multipla: quattro programmi.

## Da evitare

Decimali e `/` nei programmi (i due linguaggi li stampano in modo diverso: il tipo con la virgola entra solo nel
livello 3, a parole); la somma di un numero e un testo, che ferma il programma; valori negativi; prove con due
valori uguali, che non distinguono lo scambio.
