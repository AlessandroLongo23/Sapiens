# Note: Tabelle e grafici cartesiani

Lezione nuova, primo lotto di fisica (gruppo 3, 29 settembre 2026). Prima lezione del capitolo "Relazioni tra
grandezze e grafici". Tutti i numeri di lezione, formulario e carte sono rifatti in Python nello script `verifica.py`
dello scratchpad del lotto (179 controlli per le lezioni 10, 11 e 12), comprese le coordinate di ogni punto dei grafici
TikZ confrontate con le tabelle. `check.mts` passa sui tre file senza avvisi.

## Struttura ed esempi

Variabile indipendente e dipendente, tabella con simbolo e unità in cima alla colonna; il grafico in cinque passi;
la scala (passi $1$, $2$, $5$ per una potenza di $10$), l'asse che non parte da zero, le barre di incertezza, la linea
tra i punti (non la spezzata); interpolare ed estrapolare; le quattro forme dei grafici che rimandano alle lezioni 11
e 12.

Quattro esempi, tutti con dati di esperimenti di laboratorio plausibili:

1. la molla con cinque pesetti da $50$ g, allungamenti $2{,}1$; $3{,}9$; $6{,}0$; $8{,}1$; $9{,}9$ cm con l'incertezza
   di $0{,}2$ cm (retta dei minimi quadrati per l'origine: $0{,}0399\ \text{cm/g}$);
2. la scala per cinque cilindri di alluminio (densità $2{,}70\ \text{g/cm}^3$ con piccoli errori): $2\ \text{cm}^3$ e
   $5$ g a quadretto su un foglio di $15 \times 15$ quadretti;
3. le letture sulla retta della molla: $120$ g danno circa $4{,}8$ cm, $7{,}0$ cm vengono da circa $175$ g;
4. il tè che si raffredda in una stanza a $20$ °C (dati costruiti con la legge di Newton del raffreddamento,
   $T = 20 + 60 \cdot e^{-0{,}112\, t}$, arrotondati al grado): la lettura a $5$ minuti ($54$ °C) e l'estrapolazione
   sbagliata con la retta dei primi due punti ($-4$ °C a $14$ minuti).

Avvisi accanto alla regola: i numeri senza unità, le tacche a passi diversi, la retta obbligata per il primo e
l'ultimo punto, l'estrapolazione fino a zero; in fondo gli assi scambiati e i quadretti letti al posto dei valori.

## Scelte

- Le masse al posto delle forze: la lezione viene prima del capitolo sulle forze, quindi la molla è descritta con la
  massa appesa in grammi. La legge di Hooke con la forza è rimandata alla lezione 11 e alla lezione "La forza elastica
  e la legge di Hooke".
- La regola della scala è "il passo comodo più piccolo che fa stare i dati", con i passi $1$, $2$, $5$. Alcuni libri
  usano anche $2{,}5$ e $4$: da decidere (domanda sotto).
- Il nome "barra di incertezza" (alcuni libri dicono "barra d'errore" o "rettangolo di indeterminazione"; l'Amaldi,
  da verificare).
- Niente metodo dei minimi quadrati: la retta si traccia "a occhio" tra i punti, come al biennio. Il valore della
  pendenza calcolata è nella lezione 11.
- La lezione di matematica sul piano cartesiano (80) è del secondo anno; il link serve per le coordinate, che gli
  studenti di prima conoscono dalle medie e dalla lezione "Definizione di funzione".

## Fonti

- DM 211/2010, Indicazioni nazionali per i licei scientifici, fisica, primo biennio: "incertezze, cifre significative,
  grafici" e "la scrittura di relazioni" (citato in `programma.md`).
- Galileo e la legge di caduta sono nella lezione 12. La legge del raffreddamento del tè non è nominata nella lezione:
  i dati sono solo plausibili.

## Figure

Sette blocchi TikZ, guardati con `anteprima.mjs` in chiaro e in scuro, tutti larghi al più 377 px:
`molla-pesetti-righello`, `grafico-molla-allungamento-massa`, `grafico-cilindri-alluminio-scala`,
`spezzata-o-retta-tra-i-punti`, `grafico-molla-interpolazione`, `grafico-raffreddamento-te`, `forme-dei-grafici`.
Le unità nelle figure sono testo normale, con solo l'esponente e il simbolo del grado in modalità matematica, come nelle
lezioni di matematica, senza `\text`.

Una figura interattiva: `molla-pesetti` (`src/components/content/interactive/fisica/MollaPesetti.tsx`), registrata in
`FIGURES`. La molla appesa accanto a un righello con lo zero dove sta l'indice senza pesetti; due bottoni aggiungono e
tolgono pesetti da $50$ g, la molla si allunga dei valori misurati della tabella e la riga compare nella tabella
accanto. Non è un grafico: il grafico degli stessi dati è la figura TikZ subito dopo.

### Grafici marcati `% poi-interattivo`

| Figura | Cosa dovrà fare |
|---|---|
| `grafico-molla-allungamento-massa` | aggiungere i punti della tabella uno alla volta e spostare una retta per l'origine finché passa tra i punti |
| `grafico-cilindri-alluminio-scala` | cambiare il valore di un quadretto su ciascun asse e vedere i punti schiacciarsi o uscire dal foglio |
| `spezzata-o-retta-tra-i-punti` | tracciare a mano una retta tra i punti e contare quanti restano sopra e sotto |
| `grafico-molla-interpolazione` | trascinare un punto lungo la retta e leggere massa e allungamento sugli assi |
| `grafico-raffreddamento-te` | trascinare un punto sulla curva e leggere la temperatura; prolungare la retta dei primi due punti |

## Formulario e flashcard

Formulario: variabili e tabella, i cinque passi del grafico con l'esempio della scala, interpolare ed estrapolare, la
tabella delle quattro forme, tre avvisi. 17 carte nell'ordine della lezione.

## Esercizi

Generatore `fis-tabelle-grafici`, quattro livelli (specifica `specs/exercises/fis-tabelle-grafici.md`): leggere un
punto del grafico, scegliere la scala di un asse, leggere tra i punti sulla retta, la misura da rifare. Il grafico è la
scena `grafico-dati` (`src/components/content/exercises/scenes/GraficoDati.tsx`).

## Prerequisiti

`fis-tabelle-grafici <- fis-cifre-significative` (le misure con le loro cifre e l'incertezza). Da confermare con chi
scrive il capitolo precedente.

## Domande per Andrea

- La scala: solo passi $1$, $2$, $5$ per una potenza di $10$, o anche $2{,}5$ e $4$?
- "Barra di incertezza" o "barra d'errore"? E al biennio si disegnano davvero, o basta dire che il punto è incerto?
- La retta "a occhio" tra i punti è la pratica del biennio, o in laboratorio si usano già due rette estreme (massima e
  minima pendenza) per l'incertezza della pendenza?
- L'esempio del tè che si raffredda (una curva che non è né diretta né inversa) va bene al primo anno, o è meglio un
  esempio senza esponenziale nascosto?
- La molla descritta con la massa appesa, prima delle forze: va bene, o si preferisce aspettare le forze e usare un
  altro esperimento?
