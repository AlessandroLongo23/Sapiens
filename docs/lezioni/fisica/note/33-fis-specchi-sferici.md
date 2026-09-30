# Note: Gli specchi sferici

Lezione nuova, secondo lotto di fisica, gruppo 10, 30 settembre 2026. Numeri degli esempi rifatti in Python con
frazioni esatte; le costruzioni delle figure calcolate in Python (script nella cartella di lavoro, non nel repo).
`check.mts` passa su lezione, formulario e flashcard senza errori né avvisi.

## Struttura ed esempi

Concavo e convesso; centro, raggio di curvatura, vertice, asse ottico; fuoco e $f = R/2$ (fuoco virtuale del
convesso); raggi parassiali e aberrazione (`ad-note`); i quattro raggi notevoli; la costruzione in quattro passi e i
casi dello specchio concavo (oltre $C$, in $C$, tra $C$ e $F$, in $F$, tra $F$ e $V$) con tabella; lo specchio
convesso; l'equazione dei punti coniugati con la convenzione dei segni e l'ingrandimento; specchi convessi agli
incroci e nei retrovisori.

Esempi: il Sole con $R = 40\,\text{cm}$ ($20\,\text{cm}$); $f = 20\,\text{cm}$ con $p = 60$, $30$, $10\,\text{cm}$
($q = 30$, $60$, $-20\,\text{cm}$; $G = -0{,}50$, $-2{,}0$, $+2{,}0$); specchio all'incrocio ($R = 1{,}0\,\text{m}$,
$p = 4{,}5\,\text{m}$: $q = -0{,}45\,\text{m}$, $G = +0{,}10$).

Avvisi accanto alla regola: il fuoco non è il centro; l'immagine virtuale sta dietro lo specchio; il reciproco
dimenticato; il segno di $q$ per l'immagine virtuale; il segno di $f$ per lo specchio convesso.

## Convenzione dei segni

$\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$ e $G = -\frac{q}{p} = \frac{h'}{h}$, con $p > 0$ per l'oggetto davanti allo
specchio; $q > 0$ per l'immagine reale (davanti), $q < 0$ per la virtuale (dietro); $f = R/2 > 0$ per il concavo,
$f = -R/2 < 0$ per il convesso; $G < 0$ capovolta, $G > 0$ diritta. È la stessa di `imageDistance` e `magnification` in
`ottica.tsx`, e la lezione dice che vale anche per le lenti (link alla lezione delle lenti sottili, scritta da un altro
gruppo con la stessa convenzione).

## Scelte

- Nelle costruzioni lo specchio è disegnato con un raggio tre volte più grande del vero (meno curvo), e ogni raggio
  riflesso parte dal punto dell'arco e punta all'immagine data dall'equazione: così le figure sono esatte per i raggi
  parassiali. Con l'arco vero, i raggi disegnati mancavano l'immagine di 2-4 pixel. La lezione lo dice nel riquadro
  sull'aberrazione. La prima figura (`specchio-concavo-convesso`) usa invece la geometria vera, con la sfera
  tratteggiata e $C$ nel suo centro, perché definisce il centro di curvatura.
- Tre raggi nelle costruzioni: parallelo (arancione), per il fuoco (blu), nel vertice (verde, `green!50!black`). Il
  README ha solo due colori per i raggi: il verde è una mia aggiunta, da confermare.
- I numeri degli esempi sono esatti (centimetri interi) e i risultati non si arrotondano.

## Figure

Statiche (chiaro e scuro): `specchio-concavo-convesso`, `fuoco-specchi-sferici`, `raggi-notevoli-specchio-concavo`,
`specchio-concavo-oggetto-oltre-c` ($f = 1{,}2$, $p = 3{,}6$: $q = 1{,}8$, $G = -0{,}5$), `specchio-concavo-oggetto-tra-c-e-f`
($p = 1{,}8$: $q = 3{,}6$, $G = -2$), `specchio-concavo-oggetto-tra-f-e-v` ($f = 1{,}6$, $p = 0{,}8$: $q = -1{,}6$, $G = 2$),
`specchio-convesso-immagine` ($f = -1{,}5$, $p = 3$: $q = -1$, $G = 1/3$). Controllato che ogni raggio riflesso passi per
la punta dell'immagine (o ci passi il suo prolungamento) e che il raggio parallelo passi per il fuoco entro mezzo pixel.

Interattiva: `specchio-sferico-immagine` (`SpecchioSferico.tsx`): si trascina l'oggetto lungo l'asse, un selettore
passa dal concavo al convesso; tre raggi notevoli; immagine reale e capovolta o virtuale, diritta e tratteggiata; con
l'oggetto nel fuoco i raggi riflessi escono paralleli; sotto $f$, $p$, $q$, $G$ con `imageDistance` e `magnification`.
Guardata in chiaro, in scuro, sul telefono, con l'oggetto oltre $C$, tra $C$ e $F$, nel fuoco, dentro il fuoco, e con
lo specchio convesso.

## Esercizi

Generatore `fis-specchi-sferici`, sei livelli: il fuoco e il raggio di curvatura; l'immagine reale di uno specchio
concavo; altezza e verso dell'immagine; l'immagine virtuale dello specchio concavo; lo specchio convesso; la distanza
focale dall'immagine. Scene `raggi-specchi` ai livelli 1-5 (problema e soluzione), solo soluzione al 6.

## Domande per Andrea

- Simboli: $p$, $q$, $f$ (qui) o $d_o$, $d_i$, $f$? $G$ per l'ingrandimento, o $I$ o $m$?
- Convenzione dei segni: $q < 0$ per le immagini virtuali e $f < 0$ per il convesso, come qui? Alcuni libri del
  biennio lavorano solo con valori positivi e dicono a parole se l'immagine è virtuale.
- L'ingrandimento con il segno ($G = -q/p$), o solo il rapporto delle altezze in valore assoluto?
- Tre raggi notevoli nelle costruzioni (con il verde per il terzo) o due?
- Il riquadro sull'aberrazione sferica e sugli specchi parabolici serve al biennio?

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e 18 carte.
- Generatore: seed 1, 50001 e 777001, 6000 esercizi ciascuno, `verify.py` PASS; errori piantati bocciati (opzione
  giusta spostata, opzioni doppie, risposta cambiata, dato del testo cambiato, immagine spostata nella scena: tutti).
  `review.mts` e `width.mts` codice 0.
