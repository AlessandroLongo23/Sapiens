# inf-confronto-algoritmi: confrontare gli algoritmi contando le operazioni

Esercizi della lezione 78, `docs/lezioni/informatica/riscritte/78-inf-confronto-algoritmi.md` (terzo anno di
informatica, capitolo "Ricerca e ordinamento"). Seguono le parole della lezione e delle lezioni 71, 74, 75, 76 e 77:
confronti, scambi, spostamenti (solo per l'inserimento), giro, bandierina, caso migliore, caso peggiore, "cresce come
$n$", "cresce come $\log_2 n$", "cresce come $n^2$". Mai la notazione O grande.

I programmi sono scritti nei due linguaggi con `src/lib/exercises/v2/inf-codice.ts`. Nomi: vettore `v` di `n`
elementi, `i`, `j`, `temp`, `scambiato`, `imin`, `x`, contatori `confronti`, `scambi`, `spostamenti`. In C++ array
(`int v[]`, con `n` passato alla funzione), mai `vector`.

## Come si conta

Sono i conti della lezione, e il controllo li rifà per conto suo.

| Algoritmo | Confronti | Scambi o spostamenti |
|---|---|---|
| selezione | sempre $\frac{n(n-1)}{2}$ | uno scambio per ogni giro in cui `imin != i`, al massimo $n - 1$ |
| bolle senza bandierina | sempre $\frac{n(n-1)}{2}$ | uno scambio per ogni coppia di vicini fuori ordine |
| bolle con la bandierina | la somma dei giri fatti: $n - 1$ sul vettore in ordine, $\frac{n(n-1)}{2}$ sul rovesciato | come senza bandierina |
| inserimento | uno per ogni spostamento, più quello che ferma la ricerca del posto: $n - 1$ in ordine, $\frac{n(n-1)}{2}$ rovesciato | $0$ in ordine, $\frac{n(n-1)}{2}$ rovesciato |
| ricerca sequenziale | la posizione del valore, contata da 1; $n$ se non c'è | |
| ricerca binaria, caso peggiore | quante volte $n$ si può dimezzare, con la divisione intera, prima di arrivare a 0 ($100 \to 7$, $1000 \to 10$, $1\,000\,000 \to 20$) | |

Nelle bolle ogni giro si ferma un posto prima del precedente (`range(n - 1 - i)`).

## Livelli

1. **Contare i confronti.** Un programma intero sotto la domanda: la funzione `ordina` con un contatore che
   restituisce, chiamata su un vettore di 4, 5 o 6 numeri diversi tra 2 e 29. "Che cosa scrive questo programma?",
   quattro numeri. Cinque casi, un quinto ciascuno: `bolle-confronti`, `bolle-scambi`, `bandierina-confronti`,
   `selezione-confronti`, `selezione-scambi`. Il vettore è in ordine, rovesciato, in ordine tranne due vicini, oppure
   in un ordine qualunque; con la bandierina escono più spesso i vettori in ordine e quasi in ordine. Distrattori: il
   numero che darebbe lo stesso programma con il contatore dentro la selezione (gli scambi al posto dei confronti, e
   viceversa), nel ciclo esterno ($n - 1$), il conto senza bandierina, $n^2$, $(n - 1)^2$, $n$.
   Esempio: bolle con la bandierina su `[2, 3, 7, 17, 27]`, contatore dei confronti → 4 (distrattori 10, 0, 1).
2. **Caso migliore e caso peggiore.** Opzioni di testo, due casi, metà ciascuno.
   `conto`: un vettore di $n$ elementi diversi ($n$ da 6 a 30) in ordine o rovesciato; quanti confronti, scambi o
   spostamenti fa uno dei quattro ordinamenti. Oppure una ricerca sequenziale su $n$ elementi (da 10 a 200) di un
   valore che è il primo, l'ultimo o non c'è, o i confronti al massimo della ricerca binaria su $n$ elementi (da 20
   a 1000). Distrattori: gli altri conti ($n - 1$, $n$, $\frac{n(n-1)}{2}$, $n^2$, 0, 1).
   `riconosci`: tre vettori con gli stessi 5 o 6 valori (in ordine, rovesciato, in un altro ordine) e l'opzione "Ne
   fa lo stesso numero su tutti e tre"; su quale un ordinamento fa meno, o più, confronti (o scambi, o spostamenti).
   Per i confronti della selezione e delle bolle senza bandierina la risposta è che sono gli stessi.
   Esempio: "Un vettore di 13 elementi diversi è rovesciato. Quanti confronti fa l'ordinamento per inserimento?" → 78.
3. **Quando n raddoppia.** Conto costruito all'indietro, tre casi (40%, 30%, 30%).
   `scala`: un algoritmo fa X confronti nel caso peggiore su $n$ elementi; quanti su $k \cdot n$. Ricerca
   sequenziale ($k$ = 2, 4, 10): $k$ volte tanti. Ricerca binaria ($k$ = 2, 4, 8): uno in più a ogni raddoppio.
   Ordinamento ($k$ = 2, 4, 10): "circa", $k^2$ volte tanti. Distrattori: le altre crescite applicate a X.
   `tabella`: una tabella a larghezza fissa con $n$ che raddoppia e i confronti, tre righe piene e la quarta con il
   punto interrogativo. Per l'ordinamento la risposta è il conto esatto, che tra le opzioni è il più vicino al
   quadruplo.
   `crescita`: la tabella con quattro righe; come cresce il conto: come $n$, come $\log_2 n$, come $n^2$, o non
   cresce.
   Esempio: "la ricerca binaria fa 11 confronti su 1517 elementi; su 12 136?" → 14.
4. **Dove va il contatore.** Opzioni che sono programmi: quattro versioni del corpo della stessa funzione, mostrato
   senza la prima riga (lo dice la consegna). Quattro famiglie, un quarto ciascuna: `giro-confronti` e `giro-scambi`
   (`giro(v)` fa un solo giro delle bolle e restituisce il contatore), `cerca` (`cerca(v, x)`, la ricerca
   sequenziale che restituisce i confronti fatti), `dimezza` (`confronti_binaria(n)` della lezione). Il programma
   intero di ogni opzione chiama la funzione due volte e scrive i due risultati. Errori: il contatore dentro la
   selezione (o fuori, per gli scambi), nel ramo `else`, dopo il ciclo, azzerato a ogni giro, che parte da 1, che
   aumenta di `j`, di `i` o di `n`, il `return` di `n`, il ciclo che si ferma a `n > 1`.
5. **Quanto lavoro, quanto tempo.** Opzioni di testo, quattro casi, un quarto ciascuno, con numeri tondi e
   risultati interi. `ordinamento`: $n$ elementi, un computer da 1, 10 o 100 milioni di confronti al secondo,
   circa $\frac{n^2}{2}$ confronti: quanti secondi. `ricerche`: $k$ ricerche sequenziali nel caso peggiore su $n$
   elementi: quanti secondi. `binaria`: $k$ ricerche binarie nel caso peggiore: quanti confronti in tutto.
   `ripaga`: dato il costo dell'ordinamento e quello di una ricerca binaria e di una sequenziale, dopo circa quante
   ricerche l'ordinamento è ripagato (circa $\frac{n}{2}$).
   Esempio: 300 000 elementi, 10 milioni di confronti al secondo → circa 4500 secondi.
6. **Scrivere un programma che conta.** Risposta aperta: la lettura c'è già, lo studente scrive il resto. Sei
   varianti, un sesto ciascuna, con il costrutto che la consegna nomina:
   `bandierina-confronti`, `bolle-scambi`, `selezione-scambi`, `inserimento-spostamenti` (legge $n$ e $n$ numeri in
   `v`, ordina e scrive il contatore: due cicli uno dentro l'altro, `annidati`); `sequenziale` (legge anche `x`: una
   funzione `cerca` che restituisce i confronti, `funzione`); `dimezzamenti` (legge $n$ e conta i dimezzamenti:
   `while`). Tre prove che scrivono tre numeri diversi. A scelta multipla: quattro programmi, di cui si vede il
   ciclo interno, il corpo del ciclo esterno, il corpo della funzione o la parte dopo la lettura (lo dice la
   consegna).

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova e non
  vanno mai in errore.
- Larghezze: 34 caratteri e 10 righe (16 in C++) per un programma che è un'opzione; 42 caratteri e 18 righe (28 in
  C++) per un programma sotto la domanda
  e nella soluzione, di al più 38 nel programma di partenza dell'editor.
- In C++ il ciclo interno delle bolle a 8 spazi sarebbe di 45 caratteri: `j` è dichiarata prima dei cicli (`int i,
  j;`, oppure `int i = 0, j;` con la bandierina) e il ciclo è `for (j = 0; j < n - 1 - i; j++)`. Nella variante
  `bandierina-confronti` del livello 6 la lettura dichiara `int n, v[100];` su una riga, per stare in 28 righe.
- I casi di ogni livello escono nelle quote scritte sopra.
- `steps` di due o tre frasi, `solution` di una riga. Niente trattini lunghi, niente "piuttosto che".

## Da evitare

Vettori su cui due errori danno lo stesso numero (i numeri si estraggono di nuovo, il caso no); nel caso
`riconosci`, due vettori allo stesso estremo, o l'estremo sul vettore in ordine qualunque, che andrebbe contato a
mano; domande di sola memoria (quale algoritmo è "il migliore"); la notazione O grande; `vector` in C++; un indice
fuori dal vettore tra i distrattori.
