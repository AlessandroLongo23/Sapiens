# Grafici per rappresentare i dati

Una tabella con sei colonne e trenta righe contiene tutte le informazioni, ma per capire quale valore è il più grande, o se i numeri stanno salendo, bisogna leggerla cella per cella. Un grafico fa vedere la stessa cosa in un'occhiata, a patto di scegliere il tipo adatto ai dati. Un foglio di calcolo disegna il grafico partendo dalle celle, e lo ridisegna da solo quando i numeri cambiano.

La statistica che sta dietro ai grafici (frequenze, media, moda, mediana) è nelle lezioni di matematica [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici) e [Media, mediana e moda](/materiale/scuola-superiore/matematica/statistica/media-mediana-e-moda). Qui si impara a costruire un grafico con il foglio e a scegliere quello giusto.

## Dalla tabella al grafico: serie e categorie

La tabella riporta quanti libri hanno preso in prestito due classi nei primi tre mesi dell'anno.

|   | A | B | C |
|---|---|---|---|
| 1 | Mese | 1A | 1B |
| 2 | gen | 12 | 18 |
| 3 | feb | 20 | 15 |
| 4 | mar | 26 | 22 |

Una **serie di dati** è un gruppo di numeri che il grafico disegna con lo stesso colore: di solito una colonna della tabella. Qui le serie sono due, 1A e 1B, e il nome di ognuna è l'intestazione della sua colonna. Le **categorie** sono le etichette a cui i numeri si riferiscono: gen, feb, mar, nella colonna `A`.

Per costruire il grafico:

1. seleziona le celle con i dati, comprese le intestazioni: qui da `A1` a `C4`;
2. inserisci un grafico e scegli il tipo;
3. controlla che il foglio abbia preso la prima riga come nomi delle serie e la prima colonna come categorie;
4. scrivi il titolo del grafico e i titoli degli assi.

Il risultato è un grafico a colonne con due colonne per ogni mese, sei in tutto.

```tikz
% nome: grafico-colonne-parti
% alt: Grafico a colonne dei libri presi in prestito da due classi in tre mesi, con il titolo in alto, l'asse verticale graduato da 0 a 30, i mesi sull'asse orizzontale e la legenda con le due serie 1A e 1B
% svg: grafico-colonne-parti-edcb5be6.svg 269x192
\begin{tikzpicture}[font=\small]
\node at (2.3,3.75) {Libri presi in prestito};
\foreach \y/\l in {0/0,1/10,2/20,3/30} {\draw[gray!60] (0,\y) -- (4.6,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,3.2);
\draw[thick] (0,0) -- (4.6,0);
\node[rotate=90] at (-0.85,1.6) {libri};
\foreach \x/\a/\b/\m in {0.35/1.2/1.8/gen, 1.85/2.0/1.5/feb, 3.35/2.6/2.2/mar} {
  \draw[thick, fill=blue!35] (\x,0) rectangle ++(0.45,\a);
  \draw[thick, fill=orange!45] (\x+0.45,0) rectangle ++(0.45,\b);
  \node[anchor=base] at (\x+0.45,-0.4) {\m};
}
\node at (2.3,-0.8) {mese};
\draw[thick, fill=blue!35] (5.0,2.3) rectangle ++(0.3,0.3);
\node[right] at (5.3,2.45) {1A};
\draw[thick, fill=orange!45] (5.0,1.7) rectangle ++(0.3,0.3);
\node[right] at (5.3,1.85) {1B};
\end{tikzpicture}
```

Le parti del grafico, e che cosa dice ciascuna:

- il **titolo** dice di che cosa parla il grafico;
- l'**asse orizzontale** porta le categorie, cioè i mesi;
- l'**asse verticale** porta i valori, con una scala di numeri: qui da $0$ a $30$;
- i **titoli degli assi** dicono che cosa si legge su ogni asse, con l'unità di misura quando c'è;
- la **legenda** dice quale colore corrisponde a quale serie.

```ad-warning
Un grafico senza titoli e senza legenda
Chi guarda un grafico non ha davanti la tabella. Senza titolo, senza i titoli degli assi e senza legenda vede colonne colorate e non sa se sono libri, euro o gradi, né quale colore è la 1A.
```

## Quale grafico per quali dati

I tipi più usati sono quattro, e ognuno risponde a una domanda diversa.

| Tipo di grafico | Quando si usa | Esempio |
|---|---|---|
| a colonne | confrontare i valori di categorie diverse | gli iscritti a quattro corsi |
| a linee | mostrare un andamento nel tempo | la temperatura ora per ora |
| a torta | mostrare le parti di un totale | come gli studenti vengono a scuola |
| a dispersione | vedere se due grandezze misurate sono legate | ore di studio e voto |

Il grafico a colonne è l'ortogramma della statistica. Alcuni programmi lo chiamano istogramma, ma in statistica l'istogramma è un grafico diverso, per i dati raggruppati in classi: la differenza è spiegata nella lezione [Dati, frequenze e grafici](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici).

```ad-example
Esempio 1: confrontare categorie con le colonne
Ai corsi pomeridiani di una scuola si sono iscritti $18$ studenti a teatro, $9$ al coro, $12$ a scacchi e $24$ a robotica. I corsi sono categorie separate, e si vuole confrontarli: serve un grafico a colonne.

L'altezza di ogni colonna è il numero di iscritti. Si vede subito che robotica ha più iscritti di tutti e che il coro ne ha meno della metà.

```tikz
% nome: grafico-colonne-iscritti
% alt: Grafico a colonne degli iscritti a quattro corsi pomeridiani: teatro 18, coro 9, scacchi 12, robotica 24, con l'asse verticale da 0 a 25
% svg: grafico-colonne-iscritti-3b13f3ad.svg 249x125
\begin{tikzpicture}[font=\small]
\foreach \y/\l in {0/0,1/10,2/20} {\draw[gray!60] (0,\y) -- (5.4,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,2.7);
\draw[thick] (0,0) -- (5.4,0);
\foreach \x/\h/\m in {0.3/1.8/teatro, 1.6/0.9/coro, 2.9/1.2/scacchi, 4.2/2.4/robotica} {
  \draw[thick, fill=blue!35] (\x,0) rectangle ++(0.8,\h);
  \node[anchor=base] at (\x+0.4,-0.4) {\m};
}
\node[rotate=90] at (-0.85,1.35) {iscritti};
\end{tikzpicture}
```
```

```ad-example
Esempio 2: un andamento nel tempo con le linee
Un termometro registra la temperatura esterna ogni due ore: $12\,^\circ\text{C}$ alle 8, poi $15$, $19$, $21$, $20$ e $16\,^\circ\text{C}$ alle 18. Le misure sono in ordine di tempo, e interessa come cambia la temperatura: serve un grafico a linee.

Sull'asse orizzontale va il tempo. I segmenti che uniscono i punti mostrano che la temperatura sale fino alle 14 e poi scende.

```tikz
% nome: grafico-linee-temperatura
% alt: Grafico a linee della temperatura dalle 8 alle 18: punti a 12, 15, 19, 21, 20 e 16 gradi uniti da segmenti, con il massimo alle 14
% svg: grafico-linee-temperatura-613c8df7.svg 255x162
\begin{tikzpicture}[font=\small]
\foreach \y/\l in {0/10,1/15,2/20,3/25} {\draw[gray!60] (0,\y) -- (5.5,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,3.2);
\draw[thick] (0,0) -- (5.5,0);
\foreach \x/\l in {0.4/8,1.3/10,2.2/12,3.1/14,4.0/16,4.9/18} {\node[below] at (\x,0) {\l};}
\draw[very thick, blue!70] (0.4,0.4) -- (1.3,1.0) -- (2.2,1.8) -- (3.1,2.2) -- (4.0,2.0) -- (4.9,1.2);
\foreach \x/\y in {0.4/0.4,1.3/1.0,2.2/1.8,3.1/2.2,4.0/2.0,4.9/1.2} {\fill[blue!70] (\x,\y) circle (0.07);}
\node at (2.75,-0.8) {ora};
\node[rotate=90] at (-0.85,1.6) {temperatura ($^\circ$C)};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: le parti di un totale con la torta
In una classe di $24$ studenti, $12$ vengono a scuola a piedi, $6$ in autobus, $4$ in auto e $2$ in bicicletta. Ogni studente sta in un solo gruppo, e i quattro gruppi insieme fanno tutta la classe: sono le parti di un totale, e serve un grafico a torta.

Ogni fetta è grande quanto la sua parte del totale. Chi va a piedi è la metà della classe, $12 : 24 = 50\%$, e la sua fetta è mezzo cerchio; l'autobus è un quarto, $25\%$. Le percentuali si calcolano come nella lezione [Rapporti, proporzioni e percentuali](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali).

```tikz
% nome: grafico-torta-trasporti
% alt: Grafico a torta di come 24 studenti vengono a scuola: mezzo cerchio per i 12 a piedi, un quarto per i 6 in autobus, un sesto per i 4 in auto e un dodicesimo per i 2 in bicicletta
% svg: grafico-torta-trasporti-5c6ca9eb.svg 164x132
\begin{tikzpicture}[font=\small]
\draw[thick, fill=blue!35] (0,0) -- (90:1.5) arc (90:-90:1.5) -- cycle;
\draw[thick, fill=orange!45] (0,0) -- (-90:1.5) arc (-90:-180:1.5) -- cycle;
\draw[thick, fill=green!30] (0,0) -- (180:1.5) arc (180:120:1.5) -- cycle;
\draw[thick, fill=red!30] (0,0) -- (120:1.5) arc (120:90:1.5) -- cycle;
\node at (0:0.8) {a piedi};
\node at (0:0.8) [yshift=-10pt] {$12$};
\node at (-135:0.85) {$6$};
\node at (150:0.95) {$4$};
\node at (105:1.15) {$2$};
\node[left] at (-150:1.6) {autobus};
\node[left] at (150:1.6) {auto};
\node[above left] at (108:1.5) {bici};
\end{tikzpicture}
```
```

```ad-example
Esempio 4: due grandezze misurate con la dispersione
Dieci studenti scrivono quante ore hanno studiato per una verifica e che voto hanno preso. Per ogni studente ci sono due numeri misurati, e la domanda è se sono legati: serve un grafico a dispersione.

Ogni studente diventa un punto, con le ore sull'asse orizzontale e il voto su quello verticale, come un punto del [piano cartesiano](/materiale/scuola-superiore/matematica/piano-cartesiano-e-retta/il-piano-cartesiano-distanza-e-punto-medio). I punti non si uniscono con una linea. La nuvola sale verso destra: chi ha studiato di più ha preso, in genere, un voto più alto.

```tikz
% nome: grafico-dispersione-studio-voto
% alt: Grafico a dispersione con dieci punti: le ore di studio da 1 a 6 sull'asse orizzontale e il voto da 5 a 8,5 sull'asse verticale; i punti salgono da sinistra a destra
% svg: grafico-dispersione-studio-voto-0d10c862.svg 239x164
\begin{tikzpicture}[font=\small]
\foreach \y/\l in {0/4,1/6,2/8,3/10} {\draw[gray!60] (0,\y) -- (5.2,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,3.2);
\draw[thick] (0,0) -- (5.2,0);
\foreach \x/\l in {0.75/1,1.5/2,2.25/3,3.0/4,3.75/5,4.5/6} {\draw[thick] (\x,0) -- (\x,-0.08); \node[below] at (\x,-0.05) {\l};}
\foreach \x/\y in {0.75/0.5,1.5/0.75,1.5/1.0,2.25/1.0,2.25/1.5,3.0/1.25,3.0/1.75,3.75/1.5,3.75/2.0,4.5/2.25} {\fill[blue!70] (\x,\y) circle (0.08);}
\node at (2.6,-0.8) {ore di studio};
\node[rotate=90] at (-0.8,1.6) {voto};
\end{tikzpicture}
```
```

```ad-warning
Una linea tra categorie che non hanno un ordine
Unire con una linea gli iscritti a teatro, coro, scacchi e robotica fa pensare a qualcosa che sale e scende, ma tra un corso e l'altro non c'è nessun "prima" e "dopo". La linea ha senso quando sull'asse orizzontale c'è il tempo, o comunque una grandezza ordinata.
```

## Grafici che ingannano

Un grafico può essere costruito con i dati giusti e dare lo stesso un'idea sbagliata.

### L'asse tagliato

Due negozi hanno venduto in un mese $100$ e $110$ mila euro. Nel grafico di sinistra l'asse verticale parte da zero; in quello di destra parte da $90$.

```tikz
% nome: asse-verticale-tagliato
% alt: Due grafici a colonne degli stessi dati, 100 e 110: a sinistra l'asse verticale parte da zero e le colonne sono quasi uguali; a destra l'asse parte da 90 e la seconda colonna è alta il doppio della prima
% svg: asse-verticale-tagliato-8ace246f.svg 277x164
\begin{tikzpicture}[font=\small]
\foreach \y/\l in {0/0,1.25/50,2.5/100} {\draw[gray!60] (0,\y) -- (2.4,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,3.1);
\draw[thick] (0,0) -- (2.4,0);
\draw[thick, fill=blue!35] (0.35,0) rectangle ++(0.7,2.5);
\draw[thick, fill=orange!45] (1.4,0) rectangle ++(0.7,2.75);
\node[below] at (0.7,0) {A};
\node[below] at (1.75,0) {B};
\node at (1.2,-0.9) {asse da $0$};
\begin{scope}[xshift=4.1cm]
\foreach \y/\l in {0/90,1.2/100,2.4/110} {\draw[gray!60] (0,\y) -- (2.4,\y); \node[left] at (0,\y) {\l};}
\draw[thick] (0,0) -- (0,3.1);
\draw[thick] (0,0) -- (2.4,0);
\draw[thick, fill=blue!35] (0.35,0) rectangle ++(0.7,1.2);
\draw[thick, fill=orange!45] (1.4,0) rectangle ++(0.7,2.4);
\node[below] at (0.7,0) {A};
\node[below] at (1.75,0) {B};
\node at (1.2,-0.9) {asse da $90$};
\end{scope}
\end{tikzpicture}
```

A destra l'altezza disegnata di ogni colonna è il valore meno $90$: la prima è alta $100 - 90 = 10$ e la seconda $110 - 90 = 20$. La seconda colonna appare alta il doppio, ma il negozio B ha venduto solo il $10\%$ in più: $10 : 100 = 10\%$. I numeri sono giusti in tutti e due i grafici; l'impressione che dà quello di destra è falsa.

```ad-warning
Prima di confrontare le colonne, leggi da dove parte l'asse
In un grafico a colonne l'altezza si confronta a occhio, quindi l'asse verticale deve partire da zero. Se parte da un altro numero, confronta i valori scritti sull'asse e non le altezze.
```

### La torta sbagliata

```ad-warning
Troppe fette
Una torta con quindici fette sottili non si legge: gli angoli non si confrontano a occhio e i colori si confondono. Oltre cinque o sei fette è meglio un grafico a colonne, oppure riunire le voci più piccole in una sola fetta "altro".
```

```ad-warning
Dati che non sono parti di un totale
La temperatura di cinque città non si può mettere in una torta: sommare le temperature non ha senso, e una fetta "Roma" non è una parte di niente. La torta va bene solo quando le fette, messe insieme, fanno un intero.
```

### Tre controlli prima di consegnare un grafico

1. Il tipo è quello adatto ai dati: categorie, tempo, parti di un totale o due grandezze.
2. Ci sono il titolo, i titoli degli assi con le unità e, se le serie sono più di una, la legenda.
3. L'asse verticale di un grafico a colonne parte da zero.
