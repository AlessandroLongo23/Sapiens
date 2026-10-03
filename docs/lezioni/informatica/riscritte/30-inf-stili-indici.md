# Stili, titoli, tabelle e indici automatici

Una ricerca di venti pagine ha una decina di titoli. Se li hai formattati uno per uno, selezionando il testo e scegliendo carattere, dimensione e grassetto, per cambiare colore a tutti devi ripassarli uno per uno, e l'indice lo devi copiare a mano controllando ogni numero di pagina. Con gli stili dici al programma che cosa è ogni pezzo del documento: da quel momento l'aspetto si cambia in un punto solo, e indice e numerazioni li costruisce il programma.

## Che cos'è uno stile

Uno **stile** è un insieme di scelte di formattazione che ha un nome e che si applica con un solo comando. Lo stile "Titolo 1", per esempio, può voler dire: carattere di $16$ punti, grassetto, blu, con uno spazio di $12$ punti prima del paragrafo. I programmi di videoscrittura ne offrono una serie già pronta, con nomi che cambiano poco dall'uno all'altro: Titolo 1, Titolo 2, Titolo 3 per i titoli, Corpo del testo per il testo normale, Didascalia per la frase che accompagna una figura.

Applicare uno stile a un paragrafo fa due cose insieme. Gli dà l'aspetto previsto dallo stile, e soprattutto dichiara che cosa quel paragrafo è: un titolo di capitolo, un pezzo di testo normale, una didascalia. La [struttura del documento](/materiale/scuola-superiore/informatica/documenti-di-testo-e-presentazioni/struttura-di-un-documento-elettronico), che finora era solo nella tua testa, diventa un'informazione scritta nel file.

```tikz
% nome: documento-senza-e-con-stili
% alt: Una pagina con un titolo grande, tre righe di testo, un titolo più piccolo e altre righe. A sinistra, sotto la scritta senza stili, ogni pezzo porta la stessa etichetta, testo normale: per il programma i titoli formattati a mano sono testo come il resto. A destra, sotto la scritta con gli stili, le etichette sono Titolo 1, Corpo del testo, Titolo 2 e Corpo del testo
\begin{tikzpicture}
\draw[thick, fill=gray!8] (0,0) rectangle (3.0,4.3);
\draw[line width=3pt, blue!60!black] (0.3,3.8) -- (2.2,3.8);
\foreach \y in {3.3,3.05,2.8} {\draw[line width=1.2pt, gray!70] (0.3,\y) -- (2.7,\y);}
\draw[line width=2.2pt, blue!60!black] (0.3,2.2) -- (1.7,2.2);
\foreach \y in {1.75,1.5,1.25} {\draw[line width=1.2pt, gray!70] (0.3,\y) -- (2.7,\y);}
\draw[line width=2.2pt, blue!60!black] (0.3,0.7) -- (1.9,0.7);
\draw[line width=1.2pt, gray!70] (0.3,0.3) -- (2.7,0.3);
\tikzset{e/.style={font=\footnotesize, draw, rounded corners=2pt, inner sep=2.5pt}}
\node[font=\small] at (-1.5,4.75) {senza stili};
\node[font=\small] at (4.6,4.75) {con gli stili};
\foreach \y in {3.8,3.05,2.2,1.5,0.7} {\node[e, anchor=east] at (-0.3,\y) {testo normale}; \draw (-0.3,\y) -- (0,\y);}
\node[e, anchor=west, fill=blue!12] at (3.3,3.8) {Titolo 1};
\node[e, anchor=west] at (3.3,3.05) {Corpo del testo};
\node[e, anchor=west, fill=blue!12] at (3.3,2.2) {Titolo 2};
\node[e, anchor=west] at (3.3,1.5) {Corpo del testo};
\node[e, anchor=west, fill=blue!12] at (3.3,0.7) {Titolo 2};
\foreach \y in {3.8,3.05,2.2,1.5,0.7} {\draw (3.0,\y) -- (3.3,\y);}
\end{tikzpicture}
```

```ad-warning
Un titolo non è un testo grande e in grassetto
Se selezioni una riga e la fai di $16$ punti e in grassetto, per chi legge è un titolo, ma per il programma resta testo normale con un aspetto diverso. Quella riga non entrerà nell'indice e non cambierà quando modifichi lo stile dei titoli. Un titolo è un paragrafo a cui hai dato uno stile di titolo.
```

## Modificare uno stile cambia tutto il documento

Quando modifichi uno stile, tutti i paragrafi che lo usano cambiano insieme, dalla prima all'ultima pagina. La formattazione data a mano su un pezzo di testo selezionato si chiama **formattazione diretta**: vale solo per quel pezzo e non segue lo stile.

```ad-example
Esempio 1: quanti titoli cambiano
Nella relazione di Giulia ci sono $5$ titoli con lo stile Titolo 1, $8$ con lo stile Titolo 2 e $2$ titoli che Giulia ha formattato a mano perché assomigliassero ai Titolo 1. Giulia modifica lo stile Titolo 1 e sceglie il colore verde. Quanti titoli diventano verdi?

Diventano verdi i $5$ paragrafi con lo stile Titolo 1. Gli $8$ Titolo 2 hanno un altro stile, e i $2$ titoli fatti a mano non hanno lo stile Titolo 1, anche se gli somigliavano: restano com'erano, e da questo momento si vede che sono diversi.
```

## I livelli dei titoli

Gli stili di titolo sono numerati perché i titoli hanno una gerarchia. Titolo 1 è per i capitoli; Titolo 2 per le parti in cui si divide un capitolo; Titolo 3 per le parti di una di queste. Il livello dice quanto in profondità sta un titolo, non quanto è grande sulla pagina.

```ad-example
Esempio 2: i livelli di una ricerca
La ricerca "L'acqua" ha due capitoli, "Il ciclo dell'acqua" e "L'acqua potabile". Il primo è diviso in "Evaporazione" e "Precipitazioni"; dentro "Precipitazioni" ci sono "La pioggia" e "La neve". Quale stile va a ogni titolo?

"Il ciclo dell'acqua" e "L'acqua potabile" sono capitoli: Titolo 1. "Evaporazione" e "Precipitazioni" sono parti di un capitolo: Titolo 2. "La pioggia" e "La neve" sono parti di "Precipitazioni": Titolo 3. Il titolo della ricerca, che sta sulla copertina, non è un capitolo e ha uno stile suo.
```

```ad-warning
Scegliere il livello dall'aspetto
Chi usa Titolo 3 per un capitolo "perché è più piccolo e sta meglio" rompe la gerarchia: nell'indice quel capitolo finirà rientrato sotto il capitolo precedente, come se ne fosse una parte. Se l'aspetto di Titolo 1 non ti piace, modifica lo stile Titolo 1.
```

## L'indice automatico

Con i titoli dichiarati, l'**indice** lo costruisce il programma. Il procedimento è sempre lo stesso:

1. dai a ogni titolo lo stile del suo livello;
2. metti il cursore nel punto in cui vuoi l'indice e inserisci l'indice automatico (alcuni programmi lo chiamano sommario);
3. scegli fino a quale livello mostrare i titoli;
4. dopo ogni modifica del documento, aggiorna l'indice.

Il programma percorre il documento, raccoglie i paragrafi che hanno uno stile di titolo fino al livello scelto e scrive per ciascuno una riga con il testo e il numero di pagina, rientrando i livelli più bassi.

```tikz
% nome: indice-automatico-livelli
% alt: Un indice con cinque voci, ciascuna seguita da puntini e dal numero di pagina: Il ciclo dell'acqua a pagina 2, sotto di esso rientrate Evaporazione a pagina 2 e Precipitazioni a pagina 3, poi L'acqua potabile a pagina 5 e rientrata Gli acquedotti a pagina 6. A sinistra un'etichetta dice che le voci non rientrate vengono dai paragrafi con stile Titolo 1 e quelle rientrate dai paragrafi con stile Titolo 2
\begin{tikzpicture}
\draw[thick, fill=gray!8] (0,0) rectangle (5.6,3.6);
\node[anchor=west, font=\small\bfseries] at (0.2,3.25) {Indice};
\tikzset{v/.style={anchor=west, font=\small, inner sep=0pt}}
\node[v] at (0.25,2.7) {Il ciclo dell'acqua};
\node[v] at (0.75,2.2) {Evaporazione};
\node[v] at (0.75,1.7) {Precipitazioni};
\node[v] at (0.25,1.2) {L'acqua potabile};
\node[v] at (0.75,0.7) {Gli acquedotti};
\draw[dotted, thick] (3.25,2.62) -- (5.0,2.62);
\draw[dotted, thick] (2.95,2.12) -- (5.0,2.12);
\draw[dotted, thick] (3.05,1.62) -- (5.0,1.62);
\draw[dotted, thick] (3.0,1.12) -- (5.0,1.12);
\draw[dotted, thick] (3.05,0.62) -- (5.0,0.62);
\node[font=\small] at (5.25,2.7) {2};
\node[font=\small] at (5.25,2.2) {2};
\node[font=\small] at (5.25,1.7) {3};
\node[font=\small] at (5.25,1.2) {5};
\node[font=\small] at (5.25,0.7) {6};
\tikzset{e/.style={font=\footnotesize, draw, rounded corners=2pt, inner sep=2.5pt, fill=blue!12}}
\node[e, anchor=east] (a) at (-0.6,2.7) {Titolo 1};
\node[e, anchor=east] (b) at (-0.6,1.95) {Titolo 2};
\draw[-{Stealth}] (a.east) -- (0.2,2.7);
\draw[-{Stealth}] (b.east) -- (0.7,2.2);
\draw[-{Stealth}] (b.east) -- (0.7,1.7);
\end{tikzpicture}
```

```ad-example
Esempio 3: quante voci ha l'indice
Un documento ha $4$ titoli con lo stile Titolo 1, $9$ con lo stile Titolo 2 e $6$ con lo stile Titolo 3. L'indice mostra i titoli fino al livello 2. Quante voci contiene?

Entrano i Titolo 1 e i Titolo 2: $4 + 9 = 13$ voci. I $6$ Titolo 3 sono oltre il livello scelto e restano fuori; mostrando i titoli fino al livello 3 le voci sarebbero $4 + 9 + 6 = 19$.
```

```ad-example
Esempio 4: un titolo fatto a mano
Nello stesso documento Marco aggiunge un capitolo e scrive il suo titolo in grassetto, di $16$ punti, senza dargli uno stile. Poi aggiorna l'indice. Quante voci ha ora l'indice, sempre fino al livello 2?

Ancora $13$. Il nuovo titolo è testo normale con un aspetto diverso: il programma, che raccoglie solo i paragrafi con uno stile di titolo, non lo vede.
```

L'indice è un campo, come il numero di pagina: il programma lo calcola nel momento in cui lo inserisci o lo aggiorni, e tra un aggiornamento e l'altro resta com'era.

```ad-example
Esempio 5: l'indice dopo una modifica
Nell'indice si legge "L'acqua potabile ..... 5". Sara cambia il titolo del capitolo in "L'acqua che beviamo" e aggiunge $2$ pagine al capitolo precedente. Che cosa mostra l'indice?

Finché Sara non lo aggiorna, l'indice mostra ancora "L'acqua potabile ..... 5": il titolo vecchio e la pagina vecchia. Dopo l'aggiornamento mostra "L'acqua che beviamo ..... 7", perché il capitolo ora comincia $2$ pagine più avanti: $5 + 2 = 7$.
```

```ad-warning
Consegnare con l'indice non aggiornato
L'ultima correzione sposta quasi sempre qualche titolo di pagina. Prima di esportare il documento in PDF, aggiorna l'indice: altrimenti chi legge cerca il capitolo alla pagina sbagliata.
```

## Figure, tabelle e note numerate

Lo stesso meccanismo vale per tutto ciò che in un documento ha un numero. Una **didascalia** è la riga che accompagna una figura o una tabella ("Figura 3: il ciclo dell'acqua"); se la inserisci con il comando apposito, il numero è un campo, e il programma numera le figure nell'ordine in cui compaiono. Le tabelle hanno una numerazione separata da quella delle figure.

Un **riferimento incrociato** è un rimando a una figura, a una tabella o a un titolo ("vedi Figura 3") scritto anch'esso come campo: se la figura cambia numero, il rimando cambia con lei.

Una **nota a piè di pagina** è un testo breve in fondo alla pagina, richiamato nel testo da un numerino in alto. Anche le note si numerano da sole, e la nota resta sempre sulla stessa pagina del suo richiamo.

```ad-example
Esempio 6: una figura inserita in mezzo
Una relazione ha $6$ figure con la didascalia automatica. Luca ne inserisce una nuova tra la Figura 2 e la Figura 3. Che numero ha ora quella che era la Figura 5? E quella che era la Figura 2?

La nuova figura viene dopo la Figura 2, quindi diventa la Figura 3. Tutte le figure che la seguono salgono di uno: la vecchia Figura 5 diventa la Figura 6. La Figura 2 viene prima del punto di inserimento e resta la Figura 2. Un riferimento incrociato che diceva "vedi Figura 5" ora dice "vedi Figura 6"; un "vedi Figura 5" scritto a mano resta com'è, e indica la figura sbagliata.
```

## Le tabelle

Una **tabella** organizza i dati in righe e colonne; l'incrocio di una riga e di una colonna è una **cella**. Una tabella con $R$ righe e $C$ colonne ha $R \cdot C$ celle. La prima riga di solito è la **riga di intestazione**, che dice che cosa contiene ogni colonna; si può chiedere al programma di ripeterla in cima a ogni pagina quando la tabella è lunga.

Più celle vicine si possono **unire** in una cella sola, per esempio per un titolo che sta sopra più colonne. Unendo $m$ celle ne resta una: il totale diminuisce di $m - 1$.

```ad-example
Esempio 7: le celle di una tabella
Anna vuole una tabella con i voti di $5$ materie nel primo e nel secondo quadrimestre, con una riga di intestazione. Quante righe, colonne e celle servono? E se aggiunge in cima una riga con il titolo "I miei voti" in un'unica cella?

Le colonne sono $3$: la materia, il primo quadrimestre, il secondo. Le righe sono $6$: l'intestazione e una riga per materia. Le celle sono $6 \cdot 3 = 18$.

La riga aggiunta porta $3$ celle, e la tabella ne ha $7 \cdot 3 = 21$; unendo le $3$ celle della nuova riga in una sola se ne tolgono $3 - 1 = 2$, e ne restano $19$.
```

```ad-warning
La tabella finta, fatta di spazi
Colonne allineate con spazi o con tante tabulazioni si sfasciano appena cambia un dato o la larghezza della pagina. Dati che hanno righe e colonne vanno in una tabella vera, dove ogni dato ha la sua cella.
```
