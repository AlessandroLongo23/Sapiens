# Note: Problemi con i sistemi

Lezione nuova, scritta da zero (lotto 7). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`linsolve` su ogni sistema, compresi i casi non accettabili: incasso $3130$ € con $x = \frac{365}{2}$, miscela al $60\%$ con $\left(-\frac{10}{3}, \frac{40}{3}\right)$, il sistema indeterminato del rettangolo; `expand` sui passaggi di sostituzione; i controlli sul testo di ogni esempio e la media $\frac{72}{5} = 14{,}4$ dell'avviso sulla barca). Lo script in `scratchpad/70-verifica.py`. Il controllo `check.mts` passa sui tre file.

## Struttura ed esempi

Procedimento in sei passi (lo stesso della 51, con "tante equazioni quante incognite" al passo 4), definizione di soluzione accettabile per un sistema, un paragrafo che confronta la risoluzione con un'incognita sola e con il sistema. Poi una sezione sulle due equazioni che devono dire cose diverse, con un esempio di sistema indeterminato (perimetro e semiperimetro). Poi dieci esempi svolti, dal più semplice:

1. somma e differenza di due numeri (riduzione);
2. biglietti interi e ridotti (prezzi, sostituzione), con il caso non accettabile dell'incasso $3130$ € ($x = 182{,}5$);
3. età, "tra $5$ anni";
4. perimetro di un rettangolo che cambia, con la domanda sull'area (figura);
5. angoli di un triangolo isoscele (figura);
6. le cifre di un numero ($47$), con le limitazioni sulle cifre;
7. percentuali: due sconti diversi su due articoli;
8. miscela di due soluzioni di alcol, con il caso non accettabile della miscela al $60\%$;
9. moto: la barca sul fiume, velocità della barca e della corrente;
10. tre incognite: le monete di un salvadanaio, risolto per sostituzione.

Avvisi, ognuno dopo il suo esempio: contare due volte la stessa informazione, far passare il tempo per uno solo, gli angoli alla base sono due, il numero con le cifre $x$ e $y$, togliere la percentuale come se fosse in euro, la velocità media non è la velocità della barca, mescolare euro e centesimi.

## Scelte di convenzione e dubbi

- Incognite sempre $x$ e $y$ (e $z$), anche nei problemi di età e di velocità, come chiede il brief: nessuna lettera parlante ($m$, $f$, $v$, $c$). Da verificare con il libro in uso; alcuni libri usano lettere parlanti nei problemi.
- Sistemi con `\begin{cases}`. Nella lezione non compare nessuna coppia soluzione scritta come $(x, y)$: le risposte sono in parole, perché con i numeri decimali la coppia con la virgola ($(1{,}8, 0{,}8)$) si legge male. Se servisse, la convenzione è la virgola, come nella 39, nella 42 e nella 68 (la 45 usa il punto e virgola). Solo nella riga SymPy di queste note c'è una coppia di frazioni.
- "Soluzione accettabile" e "limitazioni" come nella 51. Terminologia dei metodi ("riduzione", "sommando membro a membro", "sostituzione") come nella 68.
- L'esempio 5 usa due risultati di geometria, con link: gli angoli alla base del triangolo isoscele sono congruenti (59) e la somma degli angoli interni è $180^\circ$ (60).
- L'esempio 9 (barca) presuppone la formula $s = v \cdot t$ senza rispiegarla: la 51 la dà nell'esempio del moto.
- Il problema con tre incognite ha una relazione molto semplice ($x = 2z$), così la sostituzione riporta subito a un sistema di due equazioni. La risoluzione generale dei sistemi $3 \times 3$ (sostituzione, Sarrus, Cramer) è della 69, con un link. Se si vuole un problema a tre incognite più "vero", l'alternativa classica è quella delle somme a due a due ($x + y = a$, $y + z = b$, $x + z = c$), che però è un trucco a parte.
- L'esempio iniziale sul sistema indeterminato dice "infiniti altri rettangoli": è vero per il sistema con $x, y > 0$ reali. Se le lunghezze fossero intere i rettangoli sarebbero finiti; la lezione non entra nel dettaglio.

## Lasciato ad altre lezioni

- Metodi di risoluzione, classificazione dei sistemi dai coefficienti, sistemi con le frazioni: 68, con link.
- Sistemi di tre equazioni e Cramer: 69, con link.
- Problemi con un'incognita sola e la tabella di traduzione dal testo ai simboli: 51, con link. Non ho ripetuto la tabella.
- Problemi di lavoro (rubinetti) con due incognite: portano a sistemi fratti o a incognite reciproche, e li ho lasciati fuori.

## Figure

Due, dentro i riquadri dei loro esempi, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro e con il filtro del tema scuro (`invert(1) hue-rotate(180deg)`):

- `rettangolo-base-altezza-incognite` (190×86): rettangolo $20 \times 8$ in proporzione, `blue!15`, lati $x$ e $y$.
- `triangolo-isoscele-angoli-incogniti` (174×105): triangolo con angoli alla base di $50^\circ$ veri, archi `blue!15` sugli angoli $y$ e `orange!30` sull'angolo $x$.

Niente `\clip`, niente riempimenti bianchi, tinte chiare. Nessuna figura nel formulario.

## Formulario e flashcard

- Formulario: procedimento, casi particolari (accettabile, indeterminato, impossibile), una riga per tipo di problema con le equazioni degli esempi, tre avvisi.
- 19 carte, nell'ordine della lezione; i conti usano i numeri degli esempi.

## Da cambiare nelle lezioni già scritte

Lezione 51 (Problemi con le equazioni): la sua nota dice che il link a questa lezione si può aggiungere nell'apertura. Proposta, da aggiungere in fondo al paragrafo "Di solito conviene chiamare $x$ la grandezza che il problema chiede...":

> Quando le grandezze incognite sono due e il testo dà due informazioni, puoi anche chiamarle $x$ e $y$ e scrivere un sistema: lo trovi in [Problemi con i sistemi](/materiale/scuola-superiore/matematica/sistemi-lineari/problemi-con-i-sistemi).

## Prerequisiti

La riga `sistemi-problemi <- sistemi-di-equazioni, equazioni-problemi` va bene così. La lezione si regge sulla risoluzione dei sistemi (68) e sul metodo dei problemi con le limitazioni e la verifica sul testo (51); le percentuali e la formula del moto arrivano attraverso la 51. Gli esempi di geometria (59, 60) e il problema a tre incognite (69) sono singoli esempi con il link, e un arco per ciascuno andrebbe contro la regola "senza la quale non si segue": non li aggiungerei. In particolare non metterei `sistemi-cramer`, perché l'esempio con tre incognite si risolve per sostituzione senza determinanti.

## Per il generatore

1. Problemi sui numeri: somma e differenza, somma e rapporto ("uno è il triplo dell'altro"), con soluzione intera.
2. Prezzi e biglietti: numero di pezzi e incasso, con il caso non accettabile (soluzione non intera o negativa).
3. Età: "oggi" più "tra $n$ anni" o "$n$ anni fa", con le limitazioni.
4. Geometria: perimetri di rettangoli che cambiano, angoli di triangoli isosceli o di un triangolo con due angoli legati; domanda sull'area.
5. Cifre di un numero di due cifre, con la somma delle cifre e lo scambio.
6. Percentuali e miscele: due sconti diversi, due soluzioni con concentrazioni diverse, con il caso della concentrazione fuori dall'intervallo.
7. Moto con la corrente (o con il vento) e problemi con tre incognite con una relazione semplice tra due di esse.
