# inf-ciclo-for: Il ciclo for

Lezione: `docs/lezioni/informatica/riscritte/61-inf-ciclo-for.md`. Segue il riferimento `inf-ciclo-while` e usa gli
aiuti di `src/lib/exercises/v2/inf-programmi.ts` e di `src/lib/exercises/v2/inf-iter.ts`.

Il linguaggio dei diagrammi non ha il `for`. Ogni ciclo è scritto una volta sola come contatore con partenza,
condizione e passo (`i = 1`, `finché i <= 5`, in fondo al corpo `i = i + 1`): è il programma di riferimento, in
`params.source`. Da lì `forCodes` ricava il programma con il `for` nei due linguaggi (`for i in range(1, 6):` e
`for (int i = 1; i <= 5; i++) {`), riscrivendo il `while` che `codes` produce. Un'opzione che mostra un `for` tiene in
`values[0]` il suo `while` equivalente, così il controllo esegue i due e li confronta.

Quattro modi di scrivere il contatore, che sono i casi dei livelli 1-4:

- `uno`: `range(n)`, da 0 a n − 1, con n tra 3 e 7;
- `due`: `range(a, b)`, con a tra 1 e 9 e da 3 a 6 giri;
- `passo`: `range(a, b, p)`, con p tra 2 e 4 e da 3 a 6 giri; il valore di arrivo può non essere toccato dal contatore;
- `indietro`: `range(a, b, -p)`, con p tra 1 e 3, arrivo tra 0 e 3, da 3 a 6 giri.

In C++ la condizione è scritta metà delle volte con `<` (o `>`) e metà con `<=` (o `>=`). Il corpo scrive `i` due
volte su tre, altrimenti un multiplo (`3 * i`).

Cinque compiti con un numero letto, che sono i casi dei livelli 5 e 6:

- `multipli`: i primi m multipli di n (m tra 3 e 6);
- `fino`: i numeri da a a n, di p in p;
- `indietro`: i numeri da n in giù fino a un minimo, di 1 in 1 o di 2 in 2;
- `somma`: la somma dei pari, dei dispari o dei multipli di p fino a n;
- `quadrati`: i quadrati da 1 a n.

Ogni compito ha due prove con n diversi; dove conta, una prova ha n che il contatore tocca (così `<` e `<=` si
distinguono) e una no.

Distrattori, dagli errori dei riquadri della lezione: il valore di arrivo preso come compreso (un giro in più), un
giro in meno, la partenza spostata di un passo, `range(n)` letto come da 1 a n, il passo ignorato o sbagliato, il
verso della condizione. Nei diagrammi (livello 5) anche il passo messo prima del corpo.

## Livelli

1. **Che cosa scrive un for.** Casi `uno` e `due`. Il programma con il `for`; opzioni: quattro uscite.
   Esempio: `for i in range(9, 13): print(4 * i)` → 36, 40, 44, 48.
2. **Il passo e il conto alla rovescia.** Casi `passo` e `indietro`, stessa domanda.
   Esempio: `for i in range(15, 1, -3): print(i)` → 15, 12, 9, 6, 3.
3. **Quanti giri fa un for.** I quattro casi; opzioni: quattro numeri di giri.
   Esempio: `range(1, 20, 4)` → 5 volte (non 19, non 4, non 6).
4. **Dal while al for.** Il programma con il `while`; opzioni: quattro programmi con il `for`, uno solo equivalente.
5. **Costruire il diagramma di un for.** Il programma con il `for` di un compito. Risposta aperta: il diagramma, che
   viene eseguito sulle due prove. A scelta multipla: quattro diagrammi.
6. **Scrivere un ciclo for.** La consegna a parole. Risposta aperta: il programma, eseguito sulle due prove (passa
   qualunque programma che stampa il giusto). A scelta multipla: quattro programmi con il `for`.

## Vincoli

Solo numeri interi, senza `/`; il programma di riferimento finisce e scrive da 1 a 12 righe; nei livelli 1-4 da 3 a
7 giri; quattro opzioni diverse; i programmi sbagliati scrivono altro dal giusto su almeno una prova. Ogni `for`
mostrato percorre gli stessi valori in Python e in C++ (il controllo rilegge le due righe).

Larghezza delle opzioni che sono programmi: al più 9 righe in Python, righe di al più 34 caratteri. Fa eccezione la
riga del `for` in C++, che con un passo o un numero di due cifre non ci sta (quella della lezione,
`for (int i = 0; i < 11; i += 2) {`, è di 37 dentro `main`): può arrivare a 38, che uno schermo di 390 px mostra
intera e uno di 360 px fa scorrere di due caratteri.

## Da evitare

Il contatore letto dopo il suo ciclo (in C++ lì non esiste); cicli che non finiscono, anche tra i distrattori; un
passo positivo con una condizione che scende; più di 12 righe scritte.
