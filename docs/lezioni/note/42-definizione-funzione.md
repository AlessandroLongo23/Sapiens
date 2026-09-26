# Note: Definizione di funzione

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: i resti della divisione per 3, le coppie di $y^2 = x$ nell'esempio 2, i valori degli esempi 3, 4 e 5 (compresi i controlli con $a = 1$), l'avviso sulle parentesi ($-2^2 + 6 = 2$ contro $10$), le due tabelle di valori, il punto $\left(\frac{1}{2}, 0\right)$ sulla retta $y = 2x - 1$ e le carte con un conto.

## Scelte di convenzione

- Definizione: "relazione che associa a ogni elemento di $A$ uno e un solo elemento di $B$", divisa esplicitamente nelle due richieste (almeno una immagine, al massimo una). È la forma della lezione 18, che la richiama nella sezione iniziale.
- Nomi uguali alla 18: immagine di $x$, dominio e codominio (solo le parole e il link a 43), diagramma a frecce, $f: A \to B$ letto "$f$ da $A$ a $B$", $x \mapsto f(x)$ letto "$x$ va in $f$ di $x$". "Applicazione" è citata una volta come sinonimo, senza grassetto, e poi non si usa più.
- Nuovi termini in grassetto: funzione, immagine, dominio, codominio, variabile indipendente, variabile dipendente, legge, grafico, tabella di valori, ascissa, ordinata (11 in tutto). "Legge" per la formula, con "espressione analitica" non citata: alcuni libri usano quella, da verificare con il libro in uso.
- Il controllo con le rette verticali è detto "al più una volta" (per una linea qualunque del piano), con la precisazione che le rette per gli $x$ del dominio la incontrano esattamente una volta. È compatibile con l'avviso della 18 ("ogni retta verticale $x = k$, con $k$ nel dominio, deve incontrarlo esattamente una volta").
- Grafico per punti: il passo 4 distingue dominio $\mathbb{R}$ (si uniscono i punti) e dominio finito (solo i punti). L'esempio 6 mostra la stessa legge con i due domini nella stessa figura.
- La funzione numerica è definita come funzione con dominio e codominio insiemi di numeri; "funzione reale di variabile reale" non compare (è il titolo della lezione del terzo anno).

## Lasciato ad altre lezioni

- Dominio, codominio, insieme immagine, controimmagine, dominio naturale: solo le parole e tre link a 43. Il riquadro `ad-note` "Formule che non si possono calcolare" ($g(x) = \frac{1}{x - 2}$) dice che il $2$ va tolto dal dominio e rimanda a 43 per il come.
- Iniettiva, suriettiva, rette orizzontali: link a 18, in due avvisi.
- Piano cartesiano: una sottosezione breve (assi, origine, coppia ↔ punto, ascissa e ordinata), con link alla lezione del secondo anno e al prodotto cartesiano. Nessuna distanza, nessun quadrante.
- Retta e parabola: nominate a livello intuitivo negli esempi 6 e 7 ("la retta che passa per i cinque punti", "una curva a forma di U, che si chiama parabola"), senza equazioni della retta.
- Proporzionalità e funzione lineare $y = mx + q$: lasciate alla 45, non citate.

## Dubbi

- Calcolo letterale. Nell'albero Relazioni e funzioni viene prima di Monomi e polinomi, quindi l'esempio 5 ($f(a + 1)$ con $f(x) = 2x + 3$) usa solo la proprietà distributiva con una lettera e non linka nessuna lezione del capitolo successivo. Nella prima stesura usavo $x^2 - 3x$ e il quadrato del binomio: l'ho tolto per questo motivo. Se si preferisce, l'esempio 5 e il suo avviso si possono togliere senza toccare il resto; nel formulario e nella carta `valore-in-a-piu-uno` c'è la stessa funzione.
- Il link per "sostituire tra parentesi" va a Espressioni con frazioni, l'ultima lezione di calcolo che lo studente ha già visto a questo punto.
- L'esempio 2 introduce la curva $y^2 = x$, ripresa nella figura delle rette verticali. Lo studente la vede solo come insieme di punti, senza equazione risolta rispetto a $y$ (niente radici): mi sembra il controesempio più naturale, meglio della circonferenza, che al primo anno non ha equazione.

## Da togliere o controllare in lezioni già scritte

- Lezione 18, sezione "Dominio, codominio e immagine": il primo paragrafo richiama già la definizione con il link a questa lezione, e va bene così. Il paragrafo sul diagramma a frecce ("Per essere una funzione, da ogni elemento di $A$ deve partire esattamente una freccia") ripete un criterio di questa lezione ma in una frase sola: si può tenere. Il resto della sezione è materia della 43.
- Lezione 03, sezione sul prodotto cartesiano: "ogni coppia $(x, y)$ corrisponde a un punto del piano cartesiano" è coerente con la sottosezione sul piano di questa lezione. Niente da cambiare.

## Figure

Sei, tutte compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (PNG da `qlmanage`). Niente `\clip`, niente riempimenti; le curve in `blue` come nella 18, i punti in nero. Non le ho viste sul sito in tema scuro.

- `diagramma-frecce-funzione-resto` (170×207): la funzione resto della divisione per 3, stesso stile dei diagrammi della 18.
- `relazioni-che-non-sono-funzioni` (345×213): due diagrammi affiancati, $R_2$ (da $1$ due frecce) e $R_3$ (da $2$ nessuna freccia), con una didascalia sotto ciascuno.
- `piano-cartesiano-due-punti` (263×203): assi, origine, $P(3, 2)$ e $Q(-2, 1)$ con le proiezioni tratteggiate. L'etichetta dell'1 sull'asse $y$ è a destra, perché a sinistra la tagliava il tratteggio di $Q$.
- `grafico-per-punti-2x-meno-1` (190×240): cinque punti con le coordinate e la retta.
- `grafico-per-punti-x-quadro-meno-2` (198×188): cinque punti con le coordinate e la parabola.
- `test-rette-verticali` (384×223): la parabola con $x = 1$ (un punto) e la curva $y^2 = x$ con $x = 4$ (due punti).

Il formulario non ha figure.

## Formulario e flashcard

- Il formulario riassume i tre criteri di riconoscimento in una tabella (frecce, coppie, grafico), che nella lezione sono in tre sezioni.
- 19 carte. Nessuna usa esempi fuori dalla lezione, tranne `ascissa-ordinata`, che usa il punto $P(3, 2)$ della figura, e `grafico-dominio-finito`, con un dominio $\{-1,\ 0,\ 1,\ 2\}$ diverso da quello dell'esempio 6.

## Prerequisiti

La riga `definizione-funzione <- relazioni-binarie` va quasi bene: la definizione si appoggia alla relazione come insieme di coppie e al diagramma a frecce, che arrivano dalla 40 (e attraverso lei dal prodotto cartesiano). Gli esempi 3 e 4 calcolano però valori con numeri negativi, frazioni e potenze ($f\left(-\frac{1}{3}\right) = \frac{20}{9}$), che vengono da Espressioni con frazioni; relazioni-binarie non ci arriva, perché dipende solo dagli insiemi. Proporrei:

`definizione-funzione <- relazioni-binarie, numeri-razionali-espressioni`

Il piano cartesiano non entra: la lezione spiega quello che serve.

## Per il generatore

1. Riconoscere una funzione da un elenco di coppie o da un diagramma a frecce tra insiemi finiti (sì/no, con il motivo: elemento senza immagine o con due immagini).
2. Valore di una funzione di primo grado in un intero: $f(x) = 3x - 5$, $f(-1) = -8$.
3. Valore di una funzione di secondo grado in un intero negativo: $f(x) = x^2 - 3x$, $f(-2) = 10$.
4. Valore in una frazione, anche negativa: $f(x) = 2x^2 - 3x + 1$, $f\left(-\frac{1}{3}\right) = \frac{20}{9}$.
5. Tabella di valori: completare le $f(x)$ per cinque valori di $x$ dati ($f(x) = x^2 - 2$ per $x$ da $-2$ a $2$).
6. Valore in un'espressione letterale di primo grado: $f(x) = 2x + 3$, $f(a + 1) = 2a + 5$, $f(-a) = -2a + 3$.
