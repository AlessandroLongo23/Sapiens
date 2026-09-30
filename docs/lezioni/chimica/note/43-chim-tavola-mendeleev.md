# Note: La tavola periodica di Mendeleev

Lezione nuova (biennio di chimica, gruppo 28, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$(6{,}94 + 39{,}10)/2 = 23{,}02$ e $(35{,}45 + 126{,}90)/2 = 81{,}175$, scritto $81{,}18$; esempio 2,
$(28{,}09 + 118{,}71)/2 = 73{,}40$. `check.mts` passa (avvisi sui titoli con Mendeleev: sono giusti).

## Struttura

Le famiglie di elementi e le triadi di Döbereiner (esempio 1), le ottave di Newlands; la tavola di Mendeleev con la
figura della parte del 1871; le due scelte (caselle vuote, inversioni); le previsioni verificate con la tabella
eka-silicio e germanio, gli esempi 2 e 3 e l'avviso "colonna, non riga"; dalle masse al numero atomico con Moseley e
l'avviso; la tavola moderna con la figura dei primi quattro periodi e il rimando al terzo anno.

## Scelte e fonti

- Date: Döbereiner, triadi, 1829; Newlands, ottave, 1865 (la "legge delle ottave" è del 1864-1865); Mendeleev, 1869;
  Lothar Meyer, tabella pubblicata nel 1870; eka-elementi descritti nel 1871; gallio 1875 (Lecoq de Boisbaudran),
  scandio 1879 (Nilson), germanio 1886 (Winkler); gas nobili 1894-1898; Moseley 1913. Da manuali, da verificare.
- La tabella dell'eka-silicio: previsioni di Mendeleev del 1871 (massa $72$, densità $5{,}5$, ossido $\mathrm{EsO_2}$ di
  densità $4{,}7$, cloruro liquido) e valori di oggi del germanio (massa $72{,}63$, densità $5{,}32\,\text{g/cm}^3$,
  $\mathrm{GeO_2}$ $4{,}23\,\text{g/cm}^3$, $\mathrm{GeCl_4}$ liquido): tutti da verificare, in particolare le densità
  dell'ossido. Il simbolo $\mathrm{Es}$ per l'eka-silicio è quello dei libri (oggi $\mathrm{Es}$ è l'einsteinio): da
  segnalare?
- La figura della tavola del 1871 usa le masse che Mendeleev scrisse allora (Be $9{,}4$, Al $27{,}3$, Cl $35{,}5$, le
  caselle vuote $44$, $68$, $72$), da una riproduzione della tavola del 1871 ricordata a memoria: da verificare, in
  particolare che il rame stia all'inizio della quinta serie.
- L'aneddoto della densità del gallio (misurata $4{,}7$, corretta a $5{,}9$ dopo la lettera di Mendeleev) non c'è: è
  famoso ma non l'ho potuto verificare.
- La tavola moderna disegnata ha solo i primi quattro periodi (36 caselle): quella completa è un'idea del vault
  (`Idee/Tavola periodica interattiva.md`). Larga $540\,\text{px}$: sul telefono si stringe a circa due terzi, e i
  simboli restano leggibili ma piccoli.

## Figure

Due TikZ, guardate in chiaro e in scuro: `mendeleev-tavola-1871` (quattro serie, gruppi I-VII, tre caselle vuote
colorate) e `mendeleev-tavola-moderna-quattro-periodi`. Nessuna interattiva, come chiesto.

## Esercizi

Generatore `chim-tavola-mendeleev`, quattro livelli (specifica in `specs/exercises/chim-tavola-mendeleev.md`), senza
scene. Il livello delle triadi usa solo le dieci terne in cui la media sta entro il $3\%$ della massa vera: dal secondo
periodo la regola fallisce (azoto-fosforo-arsenico dà $44{,}5$ contro $30{,}97$), e la lezione non lo dice.

## Domande per Andrea

- Va detto nella lezione che le triadi e la stima per media funzionano solo dal terzo periodo in giù?
- Il simbolo $\mathrm{Es}$ per l'eka-silicio va bene, o crea confusione con l'einsteinio?
- La tavola del 1871 disegnata con i gruppi in colonna (come la tavola moderna) va bene? Nell'originale del 1869 i
  gruppi erano righe.
- I nomi dei gruppi (metalli alcalini, alcalino-terrosi, alogeni, gas nobili) sono da biennio o da terzo anno?
