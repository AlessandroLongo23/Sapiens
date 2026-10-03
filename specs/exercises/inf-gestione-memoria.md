# La gestione della memoria

Generatore: `inf-gestione-memoria` (`src/lib/exercises/v2/generators/inf-gestione-memoria.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-so.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_gestione_memoria.py`.
Lezione collegata: `docs/lezioni/informatica/riscritte/21-inf-gestione-memoria.md`.

Sei livelli. I livelli da 1 a 5 sono conti, costruiti all'indietro dal numero di pagine, con risposta numerica
(`answer.kind = 'number'`) e la scelta multipla costruita da `toChoice()` sui valori sbagliati di `params.wrong`. Il
livello 6 è a scelta multipla su affermazioni vere e false.

## Nomi dei livelli

1. Quante pagine: divisione esatta
2. Quante pagine: arrotondare per eccesso
3. Quante pagine: dai mebibyte
4. Memoria assegnata e inutilizzata
5. RAM piena: swap e frame liberi
6. Vero o falso sulla memoria

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` quando superano i 28 caratteri (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I nomi di persona vengono da un elenco di dodici; nessun marchio nel testo.
- Unità come nel README di informatica: `$48\,\text{KiB}$`, `$3\,\text{MiB}$`. Dove serve una conversione il fattore è
  nel testo: "Sapendo che $1\,\text{MiB} = 1024\,\text{KiB}$".
- Le pagine sono da $4$, $8$ o $16\,\text{KiB}$. Il soggetto è uno di sei programmi ("Un gioco", "Il browser"…).
- Numeri da cinque cifre con lo spazio sottile: $16\,384$.

## Livello 1: divisione esatta

Si sceglie il numero di pagine, da 3 a 60, e la memoria è pagine per dimensione. "Un gioco chiede al sistema
$48\,\text{KiB}$ di memoria. Le pagine sono di $4\,\text{KiB}$. Quante pagine gli servono?" Risposta: $12$. Valori
sbagliati: una pagina in più o in meno, il doppio, la differenza al posto del quoziente, il prodotto.

Secondo esempio: $240\,\text{KiB}$ con pagine da $16\,\text{KiB}$: $15$.

## Livello 2: arrotondare per eccesso

Come il livello 1, ma alla memoria si toglie un numero di kibibyte da 1 a una pagina meno uno: la divisione ha il
resto. "$50\,\text{KiB}$ con pagine da $4\,\text{KiB}$": $13$. Valori sbagliati, nell'ordine: l'arrotondamento per
difetto ($12$), poi una pagina in più, il resto, il doppio.

Secondo esempio: $97\,\text{KiB}$ con pagine da $8\,\text{KiB}$: $13$ (per difetto sarebbe $12$).

## Livello 3: dai mebibyte

Memoria da $1$ a $64\,\text{MiB}$, intera. "Un lettore di musica chiede al sistema $3\,\text{MiB}$ di memoria. Le pagine
sono di $4\,\text{KiB}$. Sapendo che $1\,\text{MiB} = 1024\,\text{KiB}$, quante pagine gli servono?" Risposta: $768$.
Valori sbagliati: con il fattore $1000$ ($750$), senza dividere ($3072$), senza convertire ($1$), il doppio, la metà.

Secondo esempio: $50\,\text{MiB}$ con pagine da $16\,\text{KiB}$: $3200$.

## Livello 4: memoria assegnata e inutilizzata

Come il livello 2, fino a 40 pagine. Due domande, metà ciascuna:

- "Quanta memoria gli viene assegnata, contando le pagine intere?": pagine per dimensione. $50\,\text{KiB}$ con pagine
  da $4$: $52\,\text{KiB}$. Valori sbagliati: con una pagina in meno ($48$), con una in più, il numero di pagine.
- "Quanti kibibyte restano inutilizzati nell'ultima pagina?": memoria assegnata meno memoria richiesta. $50$ con
  pagine da $4$: $2\,\text{KiB}$. Valori sbagliati: il resto della divisione, una pagina intera.

## Livello 5: RAM piena

Tre processi che chiedono da 2 a 30 pagine ciascuno e un numero di frame liberi che differisce dal totale di 1-20.
Due domande:

- swap (circa 2 su 3): le pagine sono più dei frame. "La RAM ha $16$ frame liberi. Tre processi chiedono $6$, $7$ e
  $5$ pagine. Quante pagine restano fuori dalla RAM e vanno nell'area di swap?" Risposta: $2$.
- liberi (circa 1 su 3): i frame sono più delle pagine. "… Quando tutte le pagine sono nella RAM, quanti frame restano
  liberi?" Con $20$ frame: $2$.

Valori sbagliati: il totale delle pagine, il numero di frame, la differenza con un processo dimenticato.

## Livello 6: vero o falso sulla memoria

Dieci affermazioni vere (`t1`-`t10`) e dieci false (`f1`-`f10`), le false dagli avvisi della lezione (lo swap come
parte della RAM, la memoria virtuale che aumenta la RAM, la RAM confusa con la memoria di massa, l'arrotondamento per
difetto). "Quale di queste affermazioni sulla gestione della memoria è vera?" oppure "… è falsa?", metà ciascuna.

Esempi: vera, "Pagine e frame hanno la stessa dimensione"; falsa, "L'area di swap è una parte della RAM".

## Esercizi da evitare

- Memoria multipla della pagina ai livelli 2 e 4, o non multipla al livello 1.
- Conversioni senza il fattore scritto nel testo; i simboli KB o MB con il significato di 1024.
- Al livello 5, pagine uguali ai frame (differenza zero), dove nessuna delle due domande ha senso.

## Verifica

`scripts/exercises/checkers/inf_gestione_memoria.py` legge i numeri dal testo e rifà i conti con interi esatti: pagine
come quoziente arrotondato per eccesso, con il controllo che la divisione sia esatta al livello 1 e non lo sia ai
livelli 2 e 4; memoria assegnata e inutilizzata; differenza tra pagine e frame, che deve avere il segno della domanda.
Controlla la risposta, le quattro opzioni e la loro scrittura con l'unità. Al livello 6 usa la sua tabella.

## Domande per la revisione

- La pagina da $4\,\text{KiB}$ è il valore più diffuso; negli esercizi ci sono anche $8$ e $16\,\text{KiB}$. Va bene?
- Livello 5: si contano solo le pagine, senza dire quali finiscono nello swap. Basta per il primo anno?
- "Frame" resta in inglese, come nei libri; qualcuno scrive "blocco" o "pagina fisica". Quale termine si preferisce?
