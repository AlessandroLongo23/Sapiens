# Lezioni di informatica

Le lezioni di informatica delle superiori, scritte a lotti come quelle di matematica e di fisica. Il programma è in
`programma.md`, l'albero in `albero.md`, già nel database dal 26 settembre 2026 (36 capitoli, 171 lezioni). Il primo
lotto, del 3 ottobre 2026, è il primo anno: 7 capitoli, 32 lezioni, senza programmazione.

## File

Stessa struttura di `docs/lezioni/fisica/`, con il numero che viene da `originali/index.json` (la lezione in
posizione i ha il numero i + 1, a due cifre fino a 99, a tre da 100):

- `riscritte/NN-slug.md`: la lezione. Lo slug è quello del database (`inf-bit-byte`, `excel`).
- `formulari/NN-slug.md`: il formulario. `flashcard/NN-slug.md`: le flashcard.
- `note/NN-slug.md`: le note per Alessandro e Andrea: scelte fatte, dubbi, fonti da verificare, domande.
- `url.md`: capitoli e lezioni con il loro indirizzo, per i link. Si rigenera, insieme a `originali/index.json`, con
  `scripts/fisica/indice.mts --materia computer-science --dir docs/lezioni/informatica`.
- `pubblicate/`: l'ultima versione scritta nel database dallo script di pubblicazione.

Lo stile è quello di `../stile.md`, con le convenzioni qui sotto. Il controllo è lo stesso:

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/informatica/riscritte/*.md docs/lezioni/informatica/formulari/*.md docs/lezioni/informatica/flashcard/*.md
```

Per pubblicare (prima senza `--apply`):

```sh
node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts --dir docs/lezioni/informatica --apply
```

## Convenzioni di informatica

Scelte del 3 ottobre 2026 prima del primo lotto, da confermare con Andrea (vault: `Contenuti/Domande per Andrea.md`).
Valgono per tutti i capitoli, perché le lezioni si richiamano a vicenda.

### Numeri e basi

- Un numero scritto in una base diversa da dieci porta la base a pedice, in formula: `$1011_2$`, `$17_8$`,
  `$\text{2F}_{16}$` (le cifre esadecimali da A a F in tondo, maiuscole). Un numero in base dieci porta il pedice
  `$13_{10}$` solo dove nella stessa frase ci sono altre basi; altrimenti niente.
- Le cifre di un numero binario lungo si raggruppano a quattro con uno spazio sottile: `$1011\,0110_2$`.
- Bit più significativo e meno significativo: "il bit più significativo (MSB)" alla prima occorrenza di una
  lezione, poi MSB e LSB. Le posizioni si contano da destra, a partire da 0.
- Potenze di due come formule: `$2^8 = 256$`. Virgola decimale `{,}` e moltiplicazione con `\cdot`, come in
  matematica.

### Unità di misura dell'informazione

- Il bit si scrive "bit", per esteso; il byte ha simbolo B, e 1 byte sono 8 bit.
- I multipli sono di due famiglie, e la lezione "Bit, byte e unità di misura" le presenta entrambe:
  - decimali, del Sistema Internazionale: kB, MB, GB, TB, con $1\,\text{kB} = 1000\,\text{B} = 10^3\,\text{B}$
    (k minuscola);
  - binari, della norma IEC: KiB, MiB, GiB, TiB, con $1\,\text{KiB} = 1024\,\text{B} = 2^{10}\,\text{B}$.
- Molti libri, e alcuni sistemi operativi, scrivono KB o MB intendendo 1024: la lezione lo dice una volta. Nelle
  nostre lezioni e negli esercizi il simbolo è sempre uno di quelli qui sopra, e in ogni esercizio il fattore è
  scritto nel testo ("$1\,\text{KiB} = 1024\,\text{B}$"), così la risposta non dipende da una convenzione.
- Unità in tondo dopo il numero con uno spazio sottile, come in fisica: `$4\,\text{GB}$`, `$44{,}1\,\text{kHz}$`,
  `$300\,\text{dpi}$`. Velocità di trasmissione in bit al secondo: `$\text{bit/s}$`, `$\text{Mbit/s}$`.

### Parole

- Il termine tecnico in italiano quando esiste ed è quello dei libri (memoria centrale, memoria di massa,
  sistema operativo, foglio di calcolo, cartella, percorso), con il termine inglese tra parentesi la prima volta se
  è quello che lo studente incontra sullo schermo: "memoria centrale (RAM)", "unità centrale di elaborazione
  (CPU)". Dove l'italiano non si usa, resta l'inglese: hardware, software, bit, byte, file, bus, thread, pixel.
  Le parole inglesi non vanno in corsivo e non prendono la s al plurale ("i file", "due byte").
- Le sigle si sciolgono la prima volta in ogni lezione: "ASCII (American Standard Code for Information
  Interchange)".
- Niente marchi nei titoli e nelle definizioni: "foglio di calcolo", "programma di videoscrittura", "sistema
  operativo". I nomi dei prodotti (Excel, LibreOffice Calc, Fogli Google; Windows, macOS, Linux, Android, iOS)
  compaiono come esempi, una volta, quando servono a riconoscere di cosa si parla.
- Fatti con una data o un numero che cambia nel tempo (capacità tipiche, velocità, versioni, quote di mercato) si
  evitano; dove servono, portano l'anno e vanno segnati nelle note come "da verificare". I fatti storici (von
  Neumann e l'EDVAC, 1945; ASCII, 1963; Unicode, 1991) si controllano e si segnano nelle note con la fonte.

### Foglio di calcolo

- Formule, riferimenti e percorsi dei file in codice in linea: `` `=SOMMA(A1:A5)` ``, `` `$B$2` ``,
  `` `C:\Documenti\tema.odt` ``. Mai dentro `$...$`.
- Nomi delle funzioni in italiano, come nelle versioni italiane dei programmi: `SOMMA`, `MEDIA`, `MIN`, `MAX`,
  `CONTA.NUMERI`, `CONTA.SE`, `SOMMA.SE`, `SE`, `E`, `O`, `NON`, `ARROTONDA`. La lezione sulle funzioni dice una
  volta che in inglese si chiamano SUM, AVERAGE, IF. Separatore degli argomenti il punto e virgola, virgola
  decimale: `=SE(B2>=6;"sufficiente";"insufficiente")`, `=ARROTONDA(A1*1,22;2)`.
- Le tabelle di esempio sono tabelle markdown con la riga delle lettere di colonna e la colonna dei numeri di
  riga, così la cella si trova a colpo d'occhio.

### Figure, programmi, esercizi

- Figure statiche in TikZ, come in matematica e in fisica (`% nome:` e `% alt:`): schemi a blocchi (la macchina di
  von Neumann, il ciclo della CPU, la gerarchia delle memorie, l'albero delle cartelle), tabelle dei pesi delle
  cifre, griglie di pixel. Niente `pattern=` (node-tikzjax non lo disegna) e niente riempimenti bianchi per
  cancellare. Si guardano con `node scripts/figure/anteprima.mjs <cartella di uscita> <file della lezione>`.
- Nel primo anno non c'è programmazione: niente blocchi `codice` e niente figure interattive in questo lotto.

### Programmazione

Scelte del 5 ottobre 2026, per le prime lezioni di programmazione (secondo anno), da confermare.

- **Linguaggi.** Ogni programma è scritto in Python e in C++, in due blocchi `codice` uno dopo l'altro: lo studente
  sceglie la linguetta, e la scelta vale per tutta la pagina. Il testo attorno parla del concetto con parole che
  valgono per tutti e due ("la variabile", "il ciclo", "la condizione"); quello che cambia da un linguaggio
  all'altro (i tipi dichiarati in C++, i due punti e il rientro in Python, il punto e virgola) sta in un riquadro
  `ad-note` subito dopo il programma. Le parole del linguaggio in codice in linea: `` `while` ``, `` `int` ``.
- **Programmi da eseguire e da modificare.** Un esempio è un blocco `codice` che lo studente esegue; il testo
  prima dice che cosa fa, quello dopo che cosa provare a cambiare. In C++ sempre `#include <iostream>` e
  `using namespace std;`, come nei libri del biennio. Rientro di quattro spazi nei due linguaggi.
- **Esercizi.** Con `%% prova` e `%% stampa`, scritte nel blocco Python e valide anche per il C++. Il programma di
  partenza legge i dati e ha un commento dove scrivere; `%% soluzione` c'è sempre, in tutti e due i linguaggi. Nelle
  prove il programma C++ non scrive domande prima di leggere (Python non le stampa, il C++ sì): quindi i programmi
  degli esercizi leggono senza domanda. Ogni soluzione si controlla con `scripts/codice/verifica.mts`.
- **Diagrammi di flusso.** Il diagramma di un programma è un blocco `diagramma` (vedi `../README.md`, "Il diagramma
  di flusso da eseguire"): si scrive il programma in poche righe e la pagina lo disegna con le forme dei libri (ovale
  per inizio e fine, parallelogramma per leggere e scrivere, rettangolo per un'istruzione, rombo per una condizione,
  con "sì" e "no" sui due rami) e lo esegue un blocco alla volta, con la tabella delle variabili accanto. Nomi delle
  variabili e ordine dei passi sono quelli del programma `codice` che lo segue. `% ingresso:` porta i valori della
  tabella che la lezione usa per seguire il programma a mano, così lo studente ritrova gli stessi numeri.
  Una figura che non è un programma (i quattro blocchi con il loro nome) resta in TikZ: node-tikzjax non ha
  `shapes.geometric`, e parallelogramma e rombo si disegnano come percorsi, come in `47-diagrammi-flusso.md`.
- **Anteprima.** Con il sito in sviluppo: `/prova-grafico/lezione?file=informatica/riscritte/NN-slug.md`.
- Esercizi: un generatore per lezione, con id uguale allo slug della lezione, secondo
  `scripts/exercises/README.md`. Le lezioni di conto (basi, complemento a due, dimensione di un'immagine o di un
  suono, formule del foglio) hanno esercizi costruiti all'indietro; quelle di concetto (hardware e software,
  funzioni del sistema operativo, struttura di un documento) hanno domande a scelta multipla composte da pezzi
  intercambiabili, come `fis-metodo-sperimentale`, con distrattori presi dagli errori veri degli studenti.
- Link: alle lezioni di matematica che servono (potenze, notazione scientifica) con gli indirizzi di `../url.md`;
  alle altre lezioni di informatica con quelli di `url.md`, e solo a quelle del primo anno, le sole scritte.
