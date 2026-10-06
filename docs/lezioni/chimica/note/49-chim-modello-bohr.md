# Note: Il modello atomico di Bohr

Lezione nuova (terzo anno di chimica, gruppo A, 6 ottobre 2026). Non pubblicata. Conti rifatti in Python (`conti.py` e
`bohr.py` nello scratchpad del gruppo). `check.mts` passa senza errori; restano gli avvisi sui titoli con i nomi propri
(Bohr, Lyman, Balmer, Paschen) e su "stato fondamentale", che è il termine.

## Struttura

I due problemi del modello di Rutherford; i tre postulati, con la figura delle orbite e il raggio $r_n = n^2 \cdot 52{,}9\,\text{pm}$;
i livelli di energia, con la tabella e la figura in scala; stato fondamentale, stati eccitati, ionizzazione; i salti e
le righe, con il procedimento in tre passi, l'esempio della riga rossa e la tabella della serie di Balmer; le tre serie
con la figura e la figura interattiva; l'assorbimento; due esempi (un fotone assorbito, dalla riga al salto); i limiti
del modello e che cosa ne resta.

## Scelte

- Livelli dell'idrogeno come nel brief: $E_n = -2{,}18 \cdot 10^{-18}\,\text{J}/n^2$, conti in joule. L'elettronvolt non
  compare.
- Procedimento per le righe: energie dei livelli dalla tabella (tre cifre), differenza, $\lambda = h\,c/\Delta E$. Con
  le costanti a tre cifre si ottengono $656$, $486$, $434$ e $411\,\text{nm}$ contro $656$, $486$, $434$ e $410$
  misurati: la tabella mostra le due colonne e il testo dice da dove viene la differenza.
- Niente formula di Rydberg con $R_H$ e $1/\lambda$: la lezione passa sempre dalle energie, che è il ragionamento di
  Bohr. Se Andrea la vuole, è un paragrafo.
- Raggio di Bohr $52{,}9\,\text{pm}$, lo stesso numero della lezione 52.
- Le serie sono tre, come nel brief; Brackett e Pfund non sono nominate (nella figura interattiva un salto che arriva
  al livello 4 o 5 è descritto come "una serie nell'infrarosso, oltre quella di Paschen").
- Confine con la 50: i livelli degli atomi con più elettroni sono là, e la lezione chiude con il link.
- Confine con la 51: tra i limiti c'è che l'orbita precisa non esiste, in una riga con il link; l'onda che spiega la
  quantizzazione è nella 51.
- La lezione 52 chiama già "stato fondamentale" e "stato eccitato" gli stati dell'idrogeno con gli orbitali: qui le
  stesse parole, con i livelli.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `bohr-orbite-idrogeno` (raggi in scala con $n^2$),
`bohr-livelli-energia-scala` (livelli in scala), `bohr-emissione-assorbimento`, `bohr-serie-lyman-balmer-paschen` (non
in scala, e l'alt lo dice).

Una interattiva: `bohr-livelli-salto-riga` (`BohrLivelliSalto.tsx`). Due cursori scelgono il livello di partenza e di
arrivo, da 1 a 6; la freccia mostra il salto, emissione o assorbimento; nello spettro in basso, su scala logaritmica da
$80$ a $2500\,\text{nm}$, compare la riga, colorata se è visibile, e le righe trovate restano; si leggono le due
energie, $\Delta E$, $\lambda$ e la serie. I numeri sono calcolati con il procedimento della lezione.

## Da verificare

- Date: Bohr 1913; Balmer 1885, "insegnante di matematica" svizzero; Lyman e Paschen "all'inizio del Novecento" (Lyman
  1906, Paschen 1908).
- "Aveva lavorato con Rutherford a Manchester": Bohr fu a Manchester nel 1912.
- La vita di uno stato eccitato, "dell'ordine dei centesimi di milionesimo di secondo" ($10^{-8}\,\text{s}$).
- Energia di ionizzazione dell'idrogeno: $1312\,\text{kJ/mol}$ è il valore di `elementi.json`; con le costanti della
  lezione viene $1{,}31 \cdot 10^3$.

## Dubbi per Andrea

- La formula di Rydberg ($1/\lambda = R_H\,(1/n_f^2 - 1/n_i^2)$) va aggiunta, o va bene passare solo dalle energie?
- I conti in joule, come chiede il brief, o anche in elettronvolt ($-13{,}6\,\text{eV}/n^2$)?
- L'esempio 5 (dalla riga al salto) e il livello 5 degli esercizi: sono del livello di una terza?
- I limiti del modello: quattro punti. Qualcuno è di troppo?

## Esercizio guidato

L'esempio 3 (la riga rossa). Punti in cui fermarsi: le energie dei due livelli; la differenza, con i due segni meno; la
lunghezza d'onda in metri e poi in nanometri.

## Esercizi

Generatore `chim-modello-bohr`, cinque livelli (specifica in `specs/exercises/chim-modello-bohr.md`); il quinto ha per
risposta un numero intero e può andare a risposta aperta. Controllo indipendente
`scripts/exercises/checkers/chim_modello_bohr.py`. Limite noto: il livello 2 ha poche domande diverse (i livelli sono
cinque), e così il caso "stato" del livello 1.

Prerequisiti proposti: chim-luce-spettri, chim-thomson-rutherford
