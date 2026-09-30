# La rifrazione e la riflessione totale

Generatore: `fis-rifrazione` (`src/lib/exercises/v2/generators/fis-rifrazione.ts`, con gli aiuti di
`src/lib/exercises/v2/vettori.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_rifrazione.py`. Lezione
collegata: `docs/lezioni/fisica/riscritte/34-fis-rifrazione.md`. Percorso nel database:
`high_school/physics/ottica/fis-rifrazione`. Scena: `raggio-due-mezzi`
(`src/components/content/exercises/scenes/RaggioDueMezzi.tsx`).

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'indice e la velocità della luce
2. L'angolo di rifrazione
3. L'indice dagli angoli
4. Verso un mezzo meno rifrangente
5. L'angolo limite
6. Esce o si riflette tutto?

## Dati, arrotondamenti e opzioni

Gli indici sono quelli della tabella della lezione, con due decimali: aria $1{,}00$, acqua $1{,}33$, ghiaccio $1{,}31$,
alcol etilico $1{,}36$, vetro $1{,}50$, diamante $2{,}42$; oppure "una plastica" con un indice da $1{,}41$ a $1{,}69$
(senza lo zero finale). $c = 3{,}00 \cdot 10^8\,\text{m/s}$. Gli angoli dati sono gradi interi; gli angoli trovati si
arrotondano al grado, gli indici e le velocità a tre cifre significative, come negli esempi della lezione. Un valore a
meno di $10^{-6}$ da un confine di arrotondamento non si usa. Tutte le risposte sono a scelta multipla: le opzioni
sono angoli ($32^\circ$), velocità con l'unità ($2{,}26 \cdot 10^8\,\text{m/s}$), indici ($n = 1{,}52$) o, al livello
6, "riflessione totale" e "raggio rifratto a $32^\circ$". Le opzioni angolo stanno tra $1^\circ$ e $89^\circ$, o sono
$90^\circ$ (il raggio radente, livello 6).

## Regole comuni

- La scena del problema disegna i due mezzi (nome e indice), la superficie orizzontale, la normale tratteggiata e il
  raggio incidente all'angolo del testo, con l'arco dell'angolo dato (dalla normale o dalla superficie). Il raggio
  rifratto e quello riflesso stanno solo nella `solutionScene`, salvo al livello 3, dove i due angoli sono dati.
- Livello 1: nessuna scena. Livello 5: solo la scena della soluzione (il raggio all'angolo limite, con il rifratto
  radente), perché la scena del problema mostrerebbe l'angolo da trovare.
- I passaggi scrivono i seni con quattro decimali, l'angolo con due, e poi l'arrotondamento.

## Livello 1: l'indice e la velocità della luce

Metà dei casi da $n$ a $v = c/n$ (un mezzo della tabella o una plastica), metà da $v$ (da $1{,}25$ a
$2{,}29 \cdot 10^8\,\text{m/s}$, tre cifre) a $n = c/v$.

- "Il diamante ha indice di rifrazione $n = 2{,}42$. A che velocità viaggia la luce al suo interno?" Risposta
  $1{,}24 \cdot 10^8\,\text{m/s}$; distrattori $7{,}26 \cdot 10^8$ ($c \cdot n$), $1{,}24 \cdot 10^7$ (la potenza di
  dieci sbagliata).
- "In un cristallo la luce viaggia a $1{,}94 \cdot 10^8\,\text{m/s}$. Quanto vale l'indice?" Risposta $n = 1{,}55$;
  distrattori $n = 0{,}647$ ($v/c$), $n = 1{,}06$ ($c - v$ in unità di $10^8$).

## Livello 2: l'angolo di rifrazione

Dall'aria a un mezzo più rifrangente (tre volte su quattro un mezzo della tabella), angolo di incidenza da $15^\circ$ a
$80^\circ$.

- "Un raggio di luce passa dall'aria ($n = 1{,}00$) al vetro ($n = 1{,}50$) con un angolo di incidenza di $34^\circ$.
  Quanto vale l'angolo di rifrazione?" Risposta $22^\circ$; distrattori $23^\circ$ (l'angolo diviso per l'indice),
  $57^\circ$ (il rapporto degli indici rovesciato), $68^\circ$ (l'angolo dalla superficie).
- "... all'acqua ($n = 1{,}33$) con un angolo di incidenza di $79^\circ$." Risposta $48^\circ$; distrattori $59^\circ$,
  $42^\circ$, $79^\circ$ (nessuna deviazione).

## Livello 3: l'indice dagli angoli

Dall'aria a "un materiale trasparente", angolo di incidenza da $30^\circ$ a $80^\circ$, angolo di rifrazione intero,
con l'indice tra $1{,}25$ e $2{,}45$.

- "L'angolo di incidenza è di $37^\circ$ e l'angolo di rifrazione è di $23^\circ$." Risposta $n = 1{,}54$; distrattori
  $n = 1{,}61$ (il rapporto degli angoli), $n = 0{,}649$ (il rapporto dei seni rovesciato), $n = 1{,}15$ (i coseni, cioè
  gli angoli dalla superficie).

## Livello 4: verso un mezzo meno rifrangente

Da un mezzo più rifrangente a uno meno rifrangente: acqua, ghiaccio, alcol, vetro, diamante o una plastica verso
l'aria; vetro o diamante verso l'acqua; diamante verso il vetro. Angolo di incidenza da $10^\circ$ a $3^\circ$ sotto
l'angolo limite. Circa una volta su tre il testo dà l'angolo con la superficie, e l'angolo di incidenza è il suo
complementare.

- "... dall'acqua ($n = 1{,}33$) all'aria ($n = 1{,}00$) con un angolo di incidenza di $45^\circ$." Risposta $70^\circ$;
  distrattori $32^\circ$ (il rapporto rovesciato), $60^\circ$ (l'angolo moltiplicato per l'indice), $20^\circ$.
- "... dal vetro all'aria, e forma un angolo di $70^\circ$ con la superficie di separazione. Quanto vale l'angolo di
  rifrazione, misurato dalla normale?" Risposta $31^\circ$ (incidenza $20^\circ$); tra i distrattori l'angolo che si
  trova usando $70^\circ$ come incidenza, se esiste.

## Livello 5: l'angolo limite

Le coppie del livello 4. Risposta $\theta_L = \sin^{-1}(n_2/n_1)$ al grado; distrattori $90^\circ - \theta_L$ (il
coseno al posto del seno), $\frac{n_2}{n_1} \cdot 90^\circ$ (gli angoli proporzionali agli indici), $\tan^{-1}(n_2/n_1)$.

- "Qual è l'angolo limite per la luce che passa dall'acqua ($n = 1{,}33$) all'aria ($n = 1{,}00$)?" Risposta $49^\circ$;
  distrattori $41^\circ$, $68^\circ$, $37^\circ$.

## Livello 6: esce o si riflette tutto?

Tre casi: riflessione totale (circa il 40%, angolo di incidenza da $3^\circ$ sopra l'angolo limite a $85^\circ$), raggio
che esce (circa il 35%, da $10^\circ$ a $3^\circ$ sotto l'angolo limite), luce verso un mezzo più rifrangente (circa il
25%, da $45^\circ$ a $85^\circ$, dove la riflessione totale non può succedere). Le opzioni sono "riflessione totale" e
"raggio rifratto a $x^\circ$".

- "Un raggio di luce va dall'acqua ($n = 1{,}33$) verso l'aria ($n = 1{,}00$) e arriva sulla superficie con un angolo
  di incidenza di $85^\circ$. Che cosa succede?" Risposta: riflessione totale; distrattori: rifratto a $49^\circ$ (il
  rapporto rovesciato), a $85^\circ$, a $90^\circ$.
- "... dall'aria verso il vetro ... $70^\circ$." Risposta: rifratto a $39^\circ$; tra i distrattori la riflessione
  totale.

## Esercizi da evitare

- Risultati al confine di un arrotondamento; due opzioni con lo stesso valore; angoli di opzione fuori da $1^\circ$
  a $90^\circ$.
- Al livello 4 e al livello 6 (caso "esce") angoli troppo vicini all'angolo limite, dove il risultato cambia molto con
  piccoli errori: si resta ad almeno $3^\circ$.

## Verifica

`fis_rifrazione.py` rilegge il testo, riconosce i mezzi e gli indici, rifà i conti con SymPy (seni esatti di
$\pi\alpha/180$ valutati a 50 cifre) e arrotonda al grado o a tre cifre, rifiutando i valori a meno di $10^{-9}$ da un
confine. Controlla l'opzione giusta, quattro opzioni diverse, la forma di ogni opzione, i vincoli del livello, la scena
(mezzi e indici del testo, raggio incidente all'angolo dato entro $0{,}05^\circ$, arco dal riferimento giusto, niente
raggio rifratto nel problema salvo al livello 3) e la scena della soluzione (raggio rifratto all'angolo esatto, o il
riflesso nella riflessione totale), e le quote dei casi.

## Domande per la revisione

- Angoli al grado (qui) o al decimo di grado, come fanno alcuni libri?
- Livello 6: le due opzioni "riflessione totale" e "raggio rifratto a $x^\circ$" vanno bene, o meglio chiedere prima
  se c'è riflessione totale (vero o falso)?
