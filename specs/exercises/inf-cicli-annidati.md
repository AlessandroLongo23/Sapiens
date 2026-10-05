# inf-cicli-annidati: Cicli annidati

Lezione: `docs/lezioni/informatica/riscritte/63-inf-cicli-annidati.md`. Usa `inf-programmi.ts` e `inf-iter.ts`: due
cicli, uno nel corpo dell'altro, con i contatori `i` e `j`, scritti una volta nel linguaggio dei diagrammi
(`params.source`) e mostrati con due `for`.

Un diagramma non può scrivere senza andare a capo. Il programma di riferimento di un disegno costruisce quindi ogni
riga in un testo (`riga = riga + "*"`) e la scrive alla fine del giro esterno; il programma mostrato disegna come la
lezione, un carattere alla volta (`print("*", end="")` e `print()`, `cout << "*";` e `cout << endl;`): lo ricava
`drawCodes`. I due scrivono le stesse righe, e il controllo li esegue entrambi.

## Livelli

1. **Quante volte gira il corpo interno.** Due cicli da 2 a 9 giri che non dipendono l'uno dall'altro, scritti da 1
   (`da-uno`) o da 0 (`da-zero`). Risposta: il prodotto. Distrattori: la somma, i soli giri interni, i soli esterni,
   un giro in più per ciclo. Esempio: `range(7)` e `range(2)` → 14 volte.
2. **Che cosa scrive un ciclo doppio.** Al più 3 giri per 3; il corpo scrive `i, j`, `i * j`, `i + j` oppure
   `10 * i + j`. Distrattori: i cicli scambiati (cambia prima `i`), il contatore interno che non riparte (solo la
   prima riga), i due contatori che avanzano insieme, un giro in più o in meno.
   Esempio: i da 2 a 4, j da 3 a 4, `10 * i + j` → 23, 24, 33, 34, 43, 44.
3. **Il ciclo interno che dipende da quello esterno.** `j` arriva a `i` (`fino-a-i`, `sotto-i`) o parte da `i`
   (`da-i`). Risposta: la somma dei giri. Distrattori: il prodotto, il massimo.
   Esempio: i da 1 a 4, j in `range(i)` → 1 + 2 + 3 + 4 = 10.
4. **Le righe di un disegno.** `rettangolo`, `triangolo`, `rovesciato`, `scala` (la riga i ha 2·i caratteri), da 2 a
   5 righe di al più 8 caratteri, con `*`, `#`, `o` oppure `+`. Le opzioni sono testi, con le righe separate da una
   virgola. Distrattori: il disegno capovolto, il rettangolo al posto del triangolo, tutto su una riga (l'a capo
   tolto), un carattere per riga (l'a capo nel ciclo interno), una riga o un carattere in più o in meno.
5. **I due cicli di una tabella.** Una consegna a parole (`tavola` e `aree` scrivono i prodotti, `dadi` e `menu` le
   somme). Le due dimensioni m e n si leggono; sono diverse, tra 2 e 7, e le prove sono due: m e n, poi n e m. Così
   la tabella non si può scrivere a mano, una riga per blocco. Le opzioni sono quattro programmi con due `while`: solo con il
   `while` si può sbagliare come dice il primo riquadro della lezione, mettendo `j = 1` prima del ciclo esterno.
   Altri distrattori: le due dimensioni scambiate, il passo di `i` nel corpo interno, la scrittura fuori dal ciclo
   interno, i cicli scambiati. Risposta aperta: il diagramma con i due cicli, eseguito sulle due prove; deve avere
   un ciclo dentro un altro (`needs: annidati`).
6. **Scrivere due cicli annidati.** Casi `prodotti`, `somme` (con `j` fino a `i`), `rettangolo`, `triangolo`,
   `quadrato`. Risposta aperta: il programma, su due ingressi; deve avere un ciclo dentro un altro, e la pagina lo
   dice prima (un triangolo fatto con un ciclo solo e `"*" * i` scrive giusto e non passa). A scelta multipla: quattro programmi con due `for`.

## Scelte da sapere

- Un diagramma con due cicli è largo: come opzioni ci sono solo programmi. Costruirlo invece si può: nella pagina
  di prova il diagramma con due cicli sta in 390 px e si costruisce bene, quindi il livello 5 lo chiede nella
  risposta aperta (`BUILD_CHART` nel generatore; a `false` il livello resta solo a scelta multipla).
- Nelle opzioni che sono programmi il corpo interno scrive un numero solo (`i * j`, `i + j`): la riga C++ che
  scrive due numeri, `cout << i << " " << j << endl;`, dentro due cicli è di 41 caratteri.
- La riga del `for` interno in C++ è di 38 caratteri (vedi la nota sulla larghezza in `inf-ciclo-for.md`).

## Da evitare

Lo stesso nome per i due contatori e ogni altro ciclo che non finisce; disegni con righe vuote tra le opzioni di
testo; il testo `riga` in un programma mostrato.
