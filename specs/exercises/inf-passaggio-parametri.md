# inf-passaggio-parametri: passaggio dei parametri per valore e per riferimento

Esercizi della lezione 68 del terzo anno di informatica
(`docs/lezioni/informatica/riscritte/68-inf-passaggio-parametri.md`). I programmi sono scritti a mano nei due
linguaggi con `src/lib/exercises/v2/inf-codice.ts` (brief: `docs/lezioni/informatica/brief-esercizi-codice.md`).

## La scelta del lotto

In C++ un parametro si passa per valore oppure per riferimento, con `&`. In Python la scelta non c'è: una funzione
che deve cambiare una variabile di chi chiama restituisce il valore nuovo, e chi chiama lo riassegna (anche due
valori: `return y, x` e `a, b = scambia(a, b)`). I puntatori non si nominano.

Per questo i due testi dello stesso programma sono spesso diversi e scrivono la stessa cosa:

| | C++ | Python |
|---|---|---|
| la modifica arriva a chi chiama | `void f(int &x)` e `f(a);` | `def f(x): ... return x` e `a = f(a)` |
| la modifica non arriva | `void f(int x)` e `f(a);` | il risultato non viene riassegnato: `f(a)` |
| un vettore | `int voti[]`, senza `&` | la lista come argomento |

Le domande sono "che cosa scrive", che valgono per il programma mostrato; dove una frase vale per un solo
linguaggio lo dice ("In C++ ...", "In Python ..."). Il controllo esegue il Python di ogni programma e, con
`INF_CPP=1`, anche il C++.

## Livelli

1. **Il parametro è una copia.** Un programma intero: una funzione che modifica il suo parametro, due variabili
   del programma principale (due numeri diversi da 2 a 9, nomi di una lettera), la chiamata, la scrittura delle due
   variabili su una riga. Passaggio per valore in tutti e due i linguaggi: niente `&`, niente `return`. Quattro
   famiglie, un quarto ciascuna: `raddoppia` (`x = x * 2`), `azzera` (`x = 0`), `aumenta` (`x = x + k`, k da 2 a
   9), tutte chiamate su una delle due variabili, e `scambia` (lo scambio dei due parametri con `temp`). La
   risposta sono le due variabili com'erano. Distrattori: la variabile passata è cambiata (l'errore centrale della
   lezione, sempre presente), è cambiata l'altra, sono cambiate tutte e due, i due numeri in ordine inverso; per
   `scambia`: i numeri scambiati, lo stesso numero due volte.
   Esempio: `raddoppia(a)` con `a = 7`, `b = 3` → `7 3` (non `14 3`).
2. **La variabile di chi chiama cambia.** Due variabili (numeri diversi da 3 a 9) e due modifiche diverse, prese
   tra `raddoppia`, `triplica`, `aumenta` (+k), `riduci` (−k, con k minore del numero) e `azzera`: la modifica
   arriva a una sola delle due. Due famiglie, metà ciascuna. `due`: due funzioni di un parametro; in C++ una ha il
   parametro con `&` e l'altra no, in Python tutte e due restituiscono il valore nuovo ma solo una chiamata lo
   riassegna (`a = aumenta(a)`), l'altra lo perde (`raddoppia(b)`). `una`: una funzione `cambia(x, y)` che modifica
   tutti e due i parametri; in C++ uno solo ha la `&`, in Python la funzione restituisce solo quello e la chiamata
   lo assegna. Distrattori: tutto cambiato e niente cambiato (sempre presenti), cambiata la variabile sbagliata,
   i numeri giusti in ordine inverso.
   Esempio: `aumenta` con `&` su `a = 3` (+5) e `raddoppia` senza su `b = 4` → `8 4`.
3. **Una funzione che modifica un vettore.** Un vettore `v` di 3 o 4 numeri diversi da 2 a 9 e un numero `n` che
   non è tra quelli. La funzione riceve il vettore (parametro con un nome: `voti`, `punti`, `passi`, `tempi`,
   `prezzi`; in C++ `int voti[]`) e il numero (`k`), cambia un elemento e poi cambia `k`. Tre famiglie, un terzo
   ciascuna, per come cambia l'elemento: `assegna` (`voti[i] = k`), `aumenta` (`voti[i] = voti[i] + k`),
   `raddoppia` (`voti[i] = voti[i] * 2`). Il numero viene azzerato, aumentato di 1 o raddoppiato. Il programma
   scrive `v[i]` e `n` su una riga, mai il vettore intero. Distrattori: il vettore visto come copia (elemento
   vecchio, sempre presente), il numero creduto cambiato, tutti e due gli errori, l'elemento accanto.
   Esempio: `voti[1] = voti[1] + k`, `k = 0` su `v = [5, 7, 8]`, `n = 2` → `9 2`.
4. **Quale funzione lo fa.** Le opzioni sono programmi, e di ognuno si vede solo la funzione. La domanda dice che
   cosa fa il programma principale (legge, chiama, scrive) e come chiama la funzione nei due linguaggi. Quattro
   famiglie, un quarto ciascuna: `scambia` (dopo la chiamata i due valori sono scambiati), `ordina` (in ordine
   crescente o decrescente), `raddoppia` (una variabile vale il doppio), `aumenta` (una variabile vale k in più,
   k da 3 a 9). Ogni programma è provato su due ingressi (per `ordina` una coppia da scambiare e una no).
   Distrattori, ognuno una funzione nei due linguaggi che lascia gli stessi valori: la `&` dimenticata su tutti i
   parametri (sempre presente; in Python la funzione restituisce i valori com'erano), la `&` su un parametro solo
   oppure lo scambio senza `temp` (in Python `return y, y` o lo scambio senza `temp` prima di `return x, y`),
   l'assegnamento al contrario (`return x, x`), lo scambio fatto sempre o con il confronto rovesciato, la formula
   sbagliata (`x + 2`, `x * x`, `2`).
5. **Scrivi la funzione.** Risposta aperta: il programma di partenza legge i numeri (uno per riga) e li scrive;
   lo studente scrive la funzione e la riga della chiamata, al posto di due commenti con `scrivi qui`. La consegna
   dà la chiamata nei due linguaggi. Tre famiglie, un terzo ciascuna: `ordina` (due numeri da 0 a 40 in ordine
   crescente o decrescente; prove: una coppia da scambiare, una no, due numeri uguali), `riporto` (la funzione
   `sistema` aggiunge alla prima variabile il quoziente della seconda per un divisore dato e lascia nella seconda
   il resto: ore e minuti, euro e centesimi, metri e centimetri, chili e grammi, pacchi e uova, giorni e ore;
   le due variabili sono scritte una per riga; prove: un riporto, nessuno, più di uno), `tetto` (una variabile cresce di un bonus senza superare un massimo:
   voto, punti, carica, livello; prove: due sotto il tetto e una sopra). Tre prove che scrivono tre cose diverse;
   la prima è sempre una che cambia qualcosa. La risposta deve contenere una funzione definita e chiamata
   (`funzione`). A scelta multipla: quattro funzioni, come nel livello 4.

## Vincoli

- Quattro opzioni diverse. I distrattori che sono programmi scrivono altro dal giusto su almeno una prova, non
  vanno mai in errore e scrivono la stessa cosa in Python e in C++.
- Nelle opzioni righe di al più 34 caratteri; nei programmi sotto la domanda, nella soluzione e nell'editor di al
  più 42.
- Nell'editor della risposta aperta righe di al più 38 caratteri: su un telefono l'editor, che ha i numeri di
  riga, ne mostra meno dei 42 del programma sotto la domanda. Per questo `riporto` scrive le due variabili su due
  righe (`cout << pacchi << " " << uova << endl;` dentro `main` ne ha 42).
- Solo numeri mai negativi dove c'è una divisione (`riporto`); `//` in Python e `/` tra interi in C++.
- Nel programma principale ogni variabile ha un valore prima della chiamata (assegnata o letta): una funzione
  senza `&` non deve mai far scrivere al C++ una variabile senza valore.
- La variabile d'appoggio dello scambio si chiama `temp`; le funzioni stanno prima del programma principale.
- `steps` di tre frasi, `solution` di una riga.
- Le famiglie di un livello escono nelle stesse quote.

## Da evitare

- La coppia 3 e 8 dello scambio, che è l'esempio della lezione.
- Una funzione che in Python finisce senza `return` quando la chiamata ne assegna il risultato: andrebbe in errore.
- Un'intestazione C++ con tre parametri di cui due con `&` tra le opzioni: non sta in 34 caratteri (vedi sotto).
- La lista stampata intera, i puntatori, la chiamata con un numero al posto della variabile.

## Scelte imposte da un vincolo tecnico

- **Livello 4, `aumenta` al posto di `azzera`.** Una funzione che azzera ha un solo errore plausibile (la `&`
  dimenticata) e non dà tre distrattori diversi; `aumenta` ne ha quattro.
- **Livello 5, `riporto` al posto di "quoziente e resto in due variabili nuove".** `void converti(int durata, int
  &ore, int &minuti)` è più larga di 34 caratteri, e una funzione con tre parametri entra in un'opzione solo con un
  nome di quattro lettere. In più le due variabili dei risultati non avrebbero un valore prima della chiamata, e il
  distrattore senza `&` le farebbe scrivere al C++ senza valore. `sistema(ore, minuti)` ha due parametri, tutti e
  due letti, e usa lo stesso quoziente e lo stesso resto.
- **Livello 5, la chiamata la scrive lo studente.** Il controllo comune compila il C++ di partenza, e un `main` che
  chiama una funzione non ancora definita non compila. Al posto della chiamata c'è un commento, nei due linguaggi,
  e la consegna dice come si scrive.
