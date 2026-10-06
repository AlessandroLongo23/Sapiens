# Note: La luce e gli spettri atomici

Lezione nuova (terzo anno di chimica, gruppo A, 6 ottobre 2026), prima del capitolo "La struttura elettronica
dell'atomo". Non pubblicata. Conti degli esempi rifatti in Python (`conti.py` nello scratchpad del gruppo) con
$c = 3{,}00 \cdot 10^8\,\text{m/s}$, $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$ e $N_A = 6{,}02 \cdot 10^{23}$:
esempio 1, $3{,}00 \cdot 10^8 / 5{,}30 \cdot 10^{-7} = 5{,}66 \cdot 10^{14}$; esempio 2, $3{,}38 \cdot 10^{-19}\,\text{J}$;
esempio 3, $4{,}97 \cdot 10^{-19}\,\text{J}$ e $299\,\text{kJ/mol}$; esempio 4, $2{,}84 \cdot 10^{-19}\,\text{J}$ e
$1{,}29 \cdot 10^{-19}\,\text{J}$; esempio 5, $6{,}17 \cdot 10^{14}\,\text{Hz}$ e $4{,}09 \cdot 10^{-19}\,\text{J}$.
`check.mts` passa senza errori; l'avviso sui 21 grassetti resta: sono tutti termini nel punto in cui sono definiti.

## Struttura

Apertura con i fuochi d'artificio e i lampioni al sodio; la luce come onda ($\lambda$, $\nu$, ampiezza, $c = \lambda\,\nu$)
con una figura e un esempio; lo spettro elettromagnetico con figura e tabella; quanti e fotoni ($E = h\,\nu$,
$E = h\,c/\lambda$) con due esempi, uno sulla mole di fotoni, e la prima figura interattiva; l'effetto fotoelettrico in
breve, con figura ed esempio; spettroscopio, spettro continuo e spettro a righe di emissione, con due figure; spettro
di assorbimento e righe di Fraunhofer; ogni elemento ha il suo spettro, con la seconda figura interattiva, il saggio
alla fiamma e un ultimo esempio che prepara la lezione su Bohr.

## Scelte

- Confine con la 49: qui le righe sono un fatto sperimentale. La lezione chiude dicendo che una riga vuol dire fotoni
  di un'energia precisa, e rimanda a Bohr per il perché. La formula di Balmer non c'è.
- Confine con la 51: il dualismo è nominato in una frase alla fine dell'effetto fotoelettrico, con il link.
- Visibile da $400$ a $700\,\text{nm}$, come dice il brief. I confini delle altre regioni sono quelli più diffusi nei
  libri, e il testo dice che sono convenzioni.
- La frequenza è $\nu$, non $f$ come nelle lezioni di fisica: lo chiede il brief, ed è la lettera dei libri di chimica.
- Esempio 3 (una mole di fotoni, $299\,\text{kJ/mol}$): l'ho messo perché collega l'energia della luce alle energie di
  legame in $\text{kJ/mol}$ che arrivano nel capitolo sui legami. Non è in tutti i libri.
- Effetto fotoelettrico: non uso il nome "lavoro di estrazione" né la formula $h\,\nu = W + E_c$; dico "energia minima
  per strappare un elettrone". Il brief lo vuole in breve.
- Nell'esempio 4 l'energia minima del potassio è $3{,}68 \cdot 10^{-19}\,\text{J}$ ($2{,}30\,\text{eV}$): da verificare.
  Negli esercizi il metallo non ha nome, proprio perché i valori dei libri non coincidono.
- Nessun link alla fisica delle onde: è al quarto anno, fuori da quello che si può linkare. C'è il link alla
  dispersione della luce (fisica, primo anno).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `luce-onde-lunghezza-frequenza`, `luce-spettro-elettromagnetico`,
`luce-effetto-fotoelettrico`, `luce-spettroscopio-schema`, `luce-spettri-continuo-righe-assorbimento`. Nessuna usa i
colori della luce: lo spettro elettromagnetico ha i nomi dei colori scritti, i tre spettri sono in grigio con le
lunghezze d'onda.

Due interattive, in `src/components/content/interactive/chimica/`:

| Nome | File | Che cosa fa |
|---|---|---|
| `luce-lunghezza-onda-fotone` | `LuceLunghezzaOnda.tsx` | un cursore sceglie $\lambda$ tra $250$ e $900\,\text{nm}$; si leggono colore, frequenza, energia del fotone e di una mole; un'onda si allunga e si accorcia |
| `luce-spettri-righe-elementi` | `LuceSpettriRighe.tsx` | spettro di un campione sconosciuto da confrontare con quello dell'elemento scelto (H, He, Li, Na, Ne, Hg), in emissione o in assorbimento; quando coincidono lo dice |

I colori dello spettro sono disegnati in uno strato fuori dall'inversione del tema scuro, come `PrismaDispersione`
(`chim3-A-luce.tsx`, modulo comune del gruppo). Il colore di ogni lunghezza d'onda viene dall'approssimazione di Dan
Bruton, ed è indicativo.

## Da verificare

- Le lunghezze d'onda delle righe nella figura interattiva (NIST Atomic Spectra Database, scritte a memoria): H
  $656{,}3$, $486{,}1$, $434{,}0$, $410{,}2$; He $667{,}8$, $587{,}6$, $501{,}6$, $492{,}2$, $471{,}3$, $447{,}1$,
  $402{,}6$; Li $670{,}8$, $610{,}4$, $497{,}2$, $460{,}3$; Na $589{,}0$, $589{,}6$, $568{,}8$, $616{,}1$, $498{,}3$;
  Hg $404{,}7$, $407{,}8$, $435{,}8$, $491{,}6$, $546{,}1$, $577{,}0$, $579{,}1$, $690{,}7$; Ne diciotto righe tra
  $540$ e $693\,\text{nm}$. Le intensità relative sono a occhio.
- Date: Maxwell 1865; Planck 1900; Einstein 1905 e il Nobel per l'effetto fotoelettrico (1921); Fraunhofer 1814;
  Bunsen e Kirchhoff "intorno al 1860", con cesio (1860) e rubidio (1861); elio nello spettro del Sole 1868, trovato
  sulla Terra nel 1895.
- I colori dei saggi alla fiamma (litio rosso cremisi, sodio giallo, potassio violetto, calcio rosso arancio, stronzio
  rosso, bario verde chiaro, rame verde azzurro).
- "I lampioni arancioni di certe strade sono pieni di vapori di sodio": le lampade al sodio stanno sparendo, sostituite
  dai LED. Un sedicenne di oggi le ha ancora viste?

## Dubbi per Andrea

- La mole di fotoni (esempio 3 e livello 4 degli esercizi) va bene in terza, o è un passo in più che i libri non
  fanno?
- $400$-$700\,\text{nm}$ per il visibile, oppure $380$-$750$ come altri libri?
- L'effetto fotoelettrico senza il nome "lavoro di estrazione" e senza la formula: basta così per la chimica?
- Il saggio alla fiamma sta qui o si aspetta un laboratorio a parte?

## Esercizio guidato

L'esempio che renderebbe di più è l'esempio 3 (una mole di fotoni). Punti in cui fermarsi: la conversione dei nanometri
in metri; l'energia di un fotone con $E = h\,c/\lambda$; il passaggio da un fotone a una mole e da joule a chilojoule.

## Esercizi

Generatore `chim-luce-spettri`, sei livelli (specifica in `specs/exercises/chim-luce-spettri.md`), tutto a scelta
multipla. Controllo indipendente `scripts/exercises/checkers/chim_luce_spettri.py`.

Prerequisiti proposti: particelle-fondamentali, chim-thomson-rutherford, mole-massa-molare
