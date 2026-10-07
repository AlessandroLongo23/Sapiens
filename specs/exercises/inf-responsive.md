# inf-responsive: pagine responsive e accessibili

Esercizi della lezione 95, `docs/lezioni/informatica/riscritte/95-inf-responsive.md`. Tutti a scelta multipla,
quattro opzioni, testo semplice. I frammenti sono HTML e CSS veri, sotto la domanda (`listing`) o come opzioni;
rientro di due spazi. Parole della lezione: viewport, unità relative, media query, "prima il telefono", rapporto
di contrasto, testo alternativo, etichetta.

## Livelli

1. **Unità relative.** Il conto della lezione, sempre in pixel interi. Quattro casi, un quarto ciascuno.
   - `rem`: una regola con una proprietà in `rem` (0.5, 0.75, 1.25, 1.5, 2, 2.5, 3); la domanda dice il carattere
     della pagina, 16 px (due volte su tre) o 20 px. Risposta: numero per carattere della pagina.
   - `em`: una regola che fissa `font-size` dell'elemento (12, 20, 24, 32 px) e un'altra proprietà in `em`; la
     domanda dà anche i 16 px della pagina, che non contano. Risposta: numero per carattere dell'elemento.
   - `percento`: un elemento con `width` in percentuale dentro un altro largo un numero di pixel; la domanda dà
     anche la larghezza del viewport, diversa, che non conta. Risposta: percentuale della larghezza di chi contiene.
   - `vw`: lo stesso con `vw`: conta il viewport e non l'elemento che contiene.
   Distrattori: il conto fatto sulla base sbagliata (16 al posto del carattere dell'elemento, viewport al posto del
   contenitore e viceversa), il numero letto come pixel, per dieci, per cento.
   Esempio: `h1 { font-size: 1.5rem; }` con la pagina a 16 px → 24 px.
2. **Quale regola è attiva.** Un foglio con una regola di base e due media query `min-width` sullo stesso selettore
   e la stessa proprietà in pixel (tre valori diversi; il quarto, che nel foglio non c'è, è la quarta opzione), e la
   larghezza del viewport. Quanto vale la proprietà. Sei casi, un sesto ciascuno: `sotto` (nessuna attiva), `mezzo`
   (solo la prima), `sopra` (tutte e due, vince l'ultima), `limite` (larghezza uguale a una soglia: è compresa),
   `ordine` (la media query della soglia più alta è scritta prima dell'altra, e sopra tutte e due vince quella
   della soglia più bassa), `base-dopo` (la regola di base è scritta per ultima e vince sempre).
   Regola: tra le dichiarazioni che valgono a quella larghezza vince l'ultima scritta.
3. **Prima il telefono.** A parole: un valore sotto una soglia e un altro dalla soglia in su (`direzione`: in
   colonna e in riga; `carattere`: due grandezze del testo), metà ciascuno. Quattro fogli di stile come opzioni.
   Giusto: la regola di base con il valore degli schermi stretti, poi `@media (min-width: soglia)` con l'altro.
   Distrattori, sempre tutti e tre: `max-width` al posto di `min-width`; i due valori scambiati; la media query
   scritta prima della regola di base. Soglia da 500 a 1000 px a passi di 50.
4. **Immagini che si adattano.** Un'immagine di $l \times a$ pixel (proporzioni 2:1, 3:2, 4:3, 5:4, 1:1) dentro un
   elemento largo un numero di pixel, con la regola di `img`. Quanto è larga, o alta, sulla pagina (metà e metà).
   Quattro casi, un quarto ciascuno: `stretta` (`max-width: 100%`, colonna più stretta del file: larga quanto la
   colonna, altezza in proporzione), `larga` (`max-width: 100%`, colonna più larga: resta com'è), `allargata`
   (`width: 100%`, colonna più larga: si allarga alla colonna), `niente` (solo `height: auto`, colonna più
   stretta: resta larga come il file). Distrattori: la misura del file, quella della colonna, l'altra dimensione,
   l'altezza ottenuta togliendo la differenza al posto di fare la proporzione.
   Esempio: 800 × 400 in una colonna di 360 con `max-width: 100%` → larga 360, alta 180.
5. **Il contrasto.** Un testo con la sua grandezza in pixel, in grassetto o no, e il rapporto di contrasto con
   lo sfondo, con un decimale. Quattro opzioni fisse: testo grande o normale, contrasto che basta o no. Testo
   grande: da 24 px, oppure in grassetto da 20 px (le misure in grassetto tra 18 e 19 px non si usano, perché la
   soglia vera è 18,66). Soglie: 4,5 per il testo normale, 3 per il testo grande, comprese. Quattro casi, un quarto
   ciascuno; i rapporti tra 3 e 4,4 escono spesso, perché lì la risposta dipende dalla grandezza.
6. **Una pagina accessibile.** Quattro frammenti di HTML come opzioni. Quattro casi, un quarto ciascuno.
   - `alt`: un'immagine con il file e la descrizione: giusto `alt` con la descrizione. Distrattori: senza `alt`,
     `alt` con il nome del file, `title` al posto di `alt`, `alt` vuoto, `alt="immagine"`.
   - `titoli`: il titolo della pagina e due sezioni dello stesso livello (`h1`, `h2`, `h2`) oppure una sezione e
     una sua parte (`h1`, `h2`, `h3`). Distrattori: un livello saltato, più `h1`, livelli sbagliati.
   - `label`: `label` con `for` uguale all'`id` del campo. Distrattori: senza `for`, `for` con una maiuscola
     diversa dall'`id`, un paragrafo, `for` che punta a un `name`, il solo `placeholder`.
   - `tastiera`: che cosa si raggiunge con Tab: `button`, oppure `a` con `href`. Distrattori: `div`, `span`, `p`,
     `b`, `u` con una classe, `a` senza `href`.
   I primi due distrattori dell'elenco ci sono sempre, il terzo è estratto tra gli altri.

## Vincoli

- Quattro opzioni diverse, una sola giusta: il controllo rilegge CSS e HTML e rifà i conti per conto suo.
- Frammenti sotto la domanda di al più 42 caratteri per riga e 18 righe; come opzioni 34 caratteri e 10 righe.
- Almeno cento esercizi diversi per livello su mille.

## Da evitare

Risultati con mezzi pixel. Nel livello 2 un viewport a meno di 10 px da una soglia, tranne nel caso `limite`.
Nel livello 5 il calcolo del rapporto dai colori, che non si fa a mano: il rapporto è dato. Nel livello 6 un
distrattore che per qualche lettore di schermo funziona lo stesso (per esempio `aria-label`, che la lezione non
nomina).
