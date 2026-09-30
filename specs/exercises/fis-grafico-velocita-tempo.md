# Il grafico velocità-tempo

Generatore: `fis-grafico-velocita-tempo` (`src/lib/exercises/v2/generators/fis-grafico-velocita-tempo.ts`, con
`src/lib/exercises/v2/fis-moto-accelerato.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_grafico_velocita_tempo.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/43-fis-grafico-velocita-tempo.md`. Percorso nel database:
`high_school/physics/cinematica/fis-grafico-velocita-tempo`.

Cinque livelli, ognuno con una difficoltà in più. Ogni esercizio ha la scena `grafico-velocita-tempo` (nuova,
`src/components/content/exercises/scenes/GraficoVelocitaTempo.tsx`): i dati del problema sono nel grafico.

## Nomi dei livelli

1. L'accelerazione dalla pendenza
2. Lo spostamento dall'area
3. Un viaggio a tratti
4. Le aree con il segno
5. La velocità media

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. I vertici del grafico stanno sui nodi della quadrettatura (un quadretto
vale $0{,}5$, $1$, $2$ o $5\,\text{s}$ in orizzontale e $1$, $2$, $3$ o $5\,\text{m/s}$ in verticale), quindi le
letture sono esatte: le aree (livelli 2, 3 e 4) si scrivono esatte ($22{,}5\,\text{m}$, $375\,\text{m}$), le pendenze e
le velocità medie (livelli 1 e 5) con due cifre significative, mai vicine a un confine di arrotondamento. Al più 10
quadretti in orizzontale e 12 in verticale.

## Regole comuni

- Formule della lezione: $a = \Delta v/\Delta t$; area del rettangolo, del triangolo e del trapezio; aree sotto l'asse
  negative; distanza percorsa con tutte le aree positive; $v_m = \Delta s_{tot}/\Delta t_{tot}$.
- La scena disegna il grafico, gli assi con le tacche numerate e la quadrettatura, mai le aree (quelle sono per la
  soluzione).
- Chi si muove: un'auto, un ciclista, un carrello, uno scooter (livelli 1 e 2); un autobus, un tram, un treno della
  metropolitana tra due fermate (livelli 3 e 5); una palla su un piano inclinato (livello 4).

## Livello 1: l'accelerazione dalla pendenza

Un tratto rettilineo da $(0; v_0)$ a $(T; v_1)$, da 3 a 8 quadretti in orizzontale, velocità da $0$ a 8 quadretti;
metà sale, metà scende.

- Grafico da $(0\,\text{s}; 3\,\text{m/s})$ a $(5\,\text{s}; 5\,\text{m/s})$: "Quanto vale l'accelerazione?" Risposta
  $0{,}40\,\text{m/s}^2$; distrattori $1{,}0\,\text{m/s}^2$ ($v_1/T$, $v_0$ ignorata), $2{,}5\,\text{m/s}^2$ (il rapporto
  rovesciato), $-0{,}40\,\text{m/s}^2$ (il segno sbagliato); di riserva il doppio, la metà, $(v_0 + v_1)/T$.

## Livello 2: lo spostamento dall'area

Un tratto con $v_0$ e $v_1$ positive e diverse: l'area è un trapezio. Metà sale, metà scende.

- Grafico da $(0; 4\,\text{m/s})$ a $(5\,\text{s}; 5\,\text{m/s})$: risposta $22{,}5\,\text{m}$; distrattori $25\,\text{m}$
  (il rettangolo alto $v_1$), $12{,}5\,\text{m}$ (il triangolo $\tfrac{1}{2}v_1 T$), $2{,}5\,\text{m}$ (solo il triangolo
  sopra la base minore), $20\,\text{m}$ (il rettangolo alto $v_0$).

## Livello 3: un viaggio a tratti

Da fermo accelera fino a $V$, viaggia a velocità costante, frena fino a fermarsi: triangolo, rettangolo, triangolo.
Da 4 a 10 quadretti in tutto, ogni tratto almeno uno.

- Grafico $(0;0)$, $(4\,\text{s}; 10\,\text{m/s})$, $(12\,\text{s}; 10\,\text{m/s})$, $(18\,\text{s}; 0)$: risposta
  $130\,\text{m}$; distrattori $180\,\text{m}$ (il rettangolo $V\,T$), $80\,\text{m}$ (solo il tratto centrale),
  $90\,\text{m}$ ($\tfrac{1}{2}V\,T$) o $100\,\text{m}$ (l'ultimo tratto dimenticato).

## Livello 4: le aree con il segno

Una palla lanciata su per un piano inclinato: il grafico scende in linea retta da $v_0 > 0$ a $v_1 < 0$ e taglia l'asse
dei tempi su un nodo della quadrettatura. Metà lo spostamento (può venire negativo), metà la distanza percorsa;
spostamento mai zero.

- Grafico da $(0; 2\,\text{m/s})$ a $(2{,}5\,\text{s}; -3\,\text{m/s})$, "Quanto vale il suo spostamento tra $0$ e
  $2{,}5\,\text{s}$?" Risposta $-1{,}25\,\text{m}$; distrattori $3{,}25\,\text{m}$ (la distanza), $1\,\text{m}$ (solo
  l'area sopra l'asse), $1{,}25\,\text{m}$ (il segno perso).
- Per la distanza i distrattori sono il valore assoluto dello spostamento, l'area sopra l'asse e il suo doppio.

## Livello 5: la velocità media

Il viaggio del livello 3; si chiede $\Delta s/T$ con due cifre significative.

- Stesso grafico del livello 3: risposta $7{,}2\,\text{m/s}$ ($130/18$); distrattori $5{,}0\,\text{m/s}$ (la media tra
  $0$ e $V$), $10\,\text{m/s}$ ($V$), $16\,\text{m/s}$ (lo spostamento diviso per il solo tratto centrale).

## Esercizi da evitare

- Vertici fuori dalla quadrettatura, o un attraversamento dell'asse che non cade su un nodo (livello 4).
- Tratti piatti al livello 1, spostamento zero al livello 4, pendenze o velocità medie vicine a un confine.

## Verifica

`fis_grafico_velocita_tempo.py` legge il grafico dalla scena, controlla che ogni vertice stia su un nodo, che gli assi
contengano il grafico con un quadretto di margine e che la scena del problema non disegni le aree, riconosce il testo e
la forma del grafico di ogni livello, calcola pendenze e aree con i razionali esatti e confronta la risposta.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 63 px su 252).

### Errori piantati

Su 200 esercizi (40 per livello), bocciati tutti: indice dell'opzione giusta, numero del testo cambiato, testo
dell'opzione giusta, opzione doppia, parole vietate, ultimo vertice spostato di un quadretto, aree disegnate nella
scena del problema.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 936 (947), livello 2 958 (961), livello 3 941 (938), livello 4 377 (366), livello 5
935 (922).

## Domande per la revisione

- Le aree si danno esatte ($22{,}5\,\text{m}$, $375\,\text{m}$) perché il grafico si legge sui nodi: va bene, o anche qui
  due cifre significative?
- Il livello 4 dà spostamenti negativi ($-1{,}25\,\text{m}$): chiaro per lo studente del secondo anno?
