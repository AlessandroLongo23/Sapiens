# Flashcard: L'impaginazione di una pagina web

## contenitore-flex
Quale dichiarazione fa di un elemento un contenitore flex?
---
`display: flex`. I suoi figli diretti diventano elementi flex e si mettono in riga.

## figli-diretti
Il menu è `<nav><ul><li>…</li><li>…</li></ul></nav>`. Con `nav { display: flex; }` le voci `li` vanno in riga?
---
No. L'unico figlio diretto di `nav` è `ul`: per mettere in riga le voci il contenitore deve essere `ul`.

## dove-si-scrive
Tre schede stanno dentro `<div class="schede">`. In quale regola va `display: flex` per affiancarle?
---
Nella regola di `.schede`, il contenitore. Scritto nella regola delle schede non le sposta.

## direzione-partenza
In che direzione si dispongono gli elementi di un contenitore flex, se non scrivi `flex-direction`?
---
In riga, da sinistra a destra: il valore di partenza è `row`.

## asse-principale
Che cos'è l'asse principale di un contenitore flex?
---
La linea lungo cui gli elementi si mettono in fila: orizzontale con `row`, verticale con `column`.

## justify-riga
In un contenitore in riga, dove finiscono gli elementi con `justify-content: flex-end`?
---
A destra, uno accanto all'altro.

## justify-colonna
In un contenitore con `flex-direction: column`, `justify-content: center` centra gli elementi in orizzontale o in verticale?
---
In verticale. `justify-content` lavora sempre lungo l'asse principale, che in colonna è verticale.

## centrare-in-colonna
Un contenitore è in colonna. Quale proprietà centra i suoi elementi in orizzontale?
---
`align-items: center`: in colonna l'asse trasversale è quello orizzontale.

## space-between
Come dispone tre elementi `justify-content: space-between`?
---
Il primo e l'ultimo ai bordi del contenitore, il secondo in mezzo: lo spazio che avanza sta tutto tra gli elementi.

## space-around
Che differenza c'è tra `space-between` e `space-around`?
---
Con `space-around` resta dello spazio anche ai bordi, la metà di quello che c'è tra due elementi.

## stretch
Due colonne affiancate in un contenitore flex hanno testi di lunghezza diversa. Sono alte uguali?
---
Sì. Il valore di partenza di `align-items` è `stretch`, che allunga gli elementi fino a riempire il contenitore.

## gap
Che cosa fa `gap: 20px` in un contenitore flex con quattro elementi?
---
Mette $20\,\text{px}$ tra un elemento e il successivo: tre spazi, $60\,\text{px}$ in tutto. Ai bordi non aggiunge niente.

## avanzo
Un contenitore largo $500\,\text{px}$ ha due elementi da $150\,\text{px}$ e `gap: 20px`. Quanto spazio avanza?
---
$180\,\text{px}$: $500 - 300 - 20$.

## flex-uno
In una riga `aside` è largo $140\,\text{px}$ e `main` ha `flex: 1`. Quanto è largo `main`?
---
Tutto quello che resta della riga dopo `aside` e il `gap`.

## flex-uno-tutti
Tre elementi di una riga hanno tutti `flex: 1`. Come si dividono la larghezza?
---
In tre parti uguali.

## nowrap
Con `flex-wrap: nowrap`, che cosa succede a cinque elementi che non stanno nella riga?
---
Restano su una riga sola e si stringono.

## wrap-conto
Contenitore di $400\,\text{px}$ con `flex-wrap: wrap` e `gap: 20px`, schede da $120\,\text{px}$. Quante per riga?
---
Tre: $3 \cdot 120 + 2 \cdot 20 = 400$. La quarta va a capo.

## ordine-html
In una riga flex come si porta `aside` a sinistra di `main`?
---
Scrivendo `aside` prima di `main` nell'HTML: l'ordine nella riga è quello del file.

## tabelle-layout
Perché non si usa `table` per affiancare il testo e la colonna laterale?
---
Perché `table` dichiara dei dati da leggere per righe e colonne. I pezzi della pagina si affiancano con il CSS.
