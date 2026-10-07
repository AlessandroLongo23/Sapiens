# inf-css-layout: l'impaginazione di una pagina web

Esercizi della lezione 94, `docs/lezioni/informatica/riscritte/94-inf-css-layout.md`: flexbox. Tutti a scelta
multipla, quattro opzioni, testo semplice. I frammenti sono HTML e CSS veri, sotto la domanda (`listing`) o come
opzioni; rientro di due spazi, una dichiarazione per riga. Parole della lezione: contenitore flex, elementi flex,
asse principale, "lo spazio che avanza", "andare a capo".

## Livelli

1. **Contenitore ed elementi.** Un pezzo di pagina: un elemento esterno (`nav`, `header`, `section`, `footer`,
   `main`), dentro un elenco `ul` o un `div` con una classe, dentro da 2 a 4 elementi di blocco (`li`, `p`,
   `article`, `h3`). Due casi, metà ciascuno.
   - `chi`: sotto la pagina c'è una regola con `display: flex` sul selettore dell'esterno, della classe, oppure
     degli elementi (la classe esce il doppio degli altri due). Quali elementi si dispongono in riga? Giusto: gli
     elementi interni se la regola è sulla classe; nessuno negli altri due casi, con il perché (elemento flex diventa
     solo l'elenco; ogni elemento diventa un contenitore). Distrattori: le altre due risposte, "esterno ed elenco
     affiancati", "tutti su una riga".
   - `dove`: quale regola mette in riga gli elementi interni? Giusto: `display: flex` sulla classe. Distrattori:
     `display: flex` sugli elementi, sull'esterno, `display: row`, `flex-direction: row` senza `display: flex`.
   Esempio: `<nav><ul class="menu"><li>…` con `nav { display: flex; }` → nessuno, elemento flex diventa solo `ul`.
2. **Direzione e assi.** Un contenitore più largo e più alto dei suoi tre elementi; `flex-direction` `row` o
   `column`, `justify-content` e `align-items` tra `flex-start`, `center`, `flex-end`. Due casi, metà ciascuno.
   - `dove`: data la regola (dove `flex-direction: row` e `justify-content: flex-start` possono mancare, e valgono
     i valori di partenza), come sono disposti gli elementi e dove si trovano. Risposta: "In riga" o "In colonna",
     la posizione in orizzontale e quella in verticale. In riga `justify-content` dà l'orizzontale e `align-items`
     il verticale; in colonna il contrario. Distrattori: le due proprietà scambiate, l'altra direzione, un valore
     cambiato.
   - `regola`: data la disposizione a parole, quale regola la produce (opzioni che sono regole).
   Esempio: `column`, `justify-content: flex-end`, `align-items: center` → in colonna, al centro in orizzontale e
   in basso.
3. **Lo spazio che avanza.** Il conto della lezione, costruito all'indietro, larghezze intere in pixel. Sotto la
   domanda la regola del contenitore (con `width` e `gap`) e quella degli elementi. Quattro casi, un quarto
   ciascuno; $n$ elementi da 2 a 5 (da 3 a 5 in `between`), larghi $l$, `gap` $g$ tra 10, 12, 16, 20, 24.
   - `avanzo`: quanto spazio avanza: $L - n \cdot l - (n - 1) \cdot g$. Distrattori: senza gli spazi, con $n$ spazi.
   - `flex`: l'ultimo elemento ha `flex: 1`: è largo $L - (n - 1) \cdot l - (n - 1) \cdot g$. Distrattori: solo
     l'avanzo, senza gli spazi, $L : n$.
   - `between`: `justify-content: space-between`, senza `gap`: tra due elementi vicini c'è
     $(L - n \cdot l) : (n - 1)$. Distrattori: diviso $n$, diviso $n + 1$, tutto l'avanzo.
   - `tutti`: tutti gli elementi hanno `flex: 1`: ciascuno è largo $(L - (n - 1) \cdot g) : n$. Distrattori:
     $L : n$, con $n$ spazi.
   Esempio: contenitore 600, tre elementi da 100, `gap` 20 → avanzano 260 px.
4. **Andare a capo.** Contenitore largo $L$, elementi larghi $l$ (da 80 a 180), `gap` $g$, in tutto $k$ elementi;
   su una riga ne stanno $p$ (da 2 a 4), cioè il più grande $p$ con $p \cdot l + (p - 1) \cdot g \le L$; $k$ va da
   $p + 1$ a $3p$. Tre casi, un terzo ciascuno.
   - `prima-riga`: con `flex-wrap: wrap`, quanti sulla prima riga: $p$. Distrattori: $L : l$ senza gli spazi,
     $p + 1$, $p - 1$, $k$.
   - `righe`: quante righe: $k : p$ arrotondato per eccesso.
   - `nowrap`: con `flex-wrap: nowrap` che cosa succede agli elementi che non ci stanno: restano sulla riga e
     tutti si stringono. Distrattori: vanno a capo, non vengono mostrati.
5. **Impaginare la pagina.** Una disposizione descritta a parole e quattro regole tra cui scegliere. Cinque
   casi, un quinto ciascuno.
   - `intestazione`: due elementi ai due estremi di una riga, centrati in altezza: `display: flex`,
     `justify-content: space-between`, `align-items: center`. Distrattori: i due valori scambiati tra le
     proprietà, `flex-direction: column` in più, `display: flex` mancante, `flex-start`, `center`.
   - `colonne`: `main` e `aside` affiancati con un `gap`, `main` prende lo spazio che avanza: `display: flex` e
     `gap` sul contenitore, `flex: 1` su `main`. Distrattori: le dichiarazioni nelle regole sbagliate, `flex: 1`
     su `aside`, `column`.
   - `menu`: le voci `li` in riga con un `gap`: la regola su `ul`. Distrattori: sull'elemento esterno, su `li`,
     `column`, senza `display: flex`, `padding` al posto di `gap`.
   - `centro`: un solo elemento al centro esatto: `display: flex` con `justify-content: center` e
     `align-items: center`. Distrattori: una sola delle due, senza `display: flex`, `text-align`.
   - `colonna`: elementi uno sotto l'altro, centrati in orizzontale: `column` con `align-items: center`.
     Distrattori: `justify-content: center`, `row`, senza `display: flex`, `flex-end`.
   I primi due distrattori dell'elenco ci sono sempre, il terzo è estratto tra gli altri.

## Vincoli

- Quattro opzioni diverse, una sola giusta: il controllo rilegge i frammenti e rifà i conti per conto suo.
- Frammenti sotto la domanda di al più 42 caratteri per riga e 18 righe; come opzioni 34 caratteri e 10 righe.
- Almeno cento esercizi diversi per livello su mille.

## Da evitare

Elementi in linea (`a`, `span`) nel livello 1, che stanno in riga anche senza flexbox. `stretch` e i valori
`space-between` e `space-around` nel livello 2, dove la posizione non si dice in tre parole. Nel livello 5 un
distrattore che dà la stessa disposizione del giusto (per esempio `text-align: center` su elementi allungati da
`stretch`).
