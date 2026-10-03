# Ordinare, filtrare e riassumere i dati

L'elenco dei brani di una playlist si può mettere in ordine di titolo o di durata, si può restringere a un solo artista, e in fondo dice quanti minuti dura in tutto. Un foglio di calcolo fa le stesse tre cose con qualunque tabella: la ordina, la filtra e la riassume. I dati restano quelli; cambia il modo di guardarli, e con tabelle di centinaia di righe è l'unico modo per trovarci qualcosa.

Le formule e le funzioni che servono qui, come `SOMMA`, sono nella lezione [Le funzioni del foglio di calcolo](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/le-funzioni-del-foglio-di-calcolo).

## Una tabella fatta per essere analizzata

Ordinamenti e filtri funzionano solo se i dati sono scritti in una **tabella di dati**, cioè in un elenco con una struttura precisa:

- la prima riga è l'**intestazione**: in ogni cella c'è il nome di una colonna;
- ogni riga successiva è un **record**, cioè descrive una cosa sola: una vendita, uno studente, un brano;
- ogni colonna è un **campo**, cioè contiene lo stesso tipo di dato per tutti i record: tutte classi, tutti importi;
- in ogni cella c'è un solo dato.

Le classi prime di una scuola hanno organizzato un mercatino. Ogni riga della tabella è l'incasso, in euro, di una classe per un prodotto.

|   | A | B | C |
|---|---|---|---|
| 1 | Classe | Prodotto | Incasso |
| 2 | 1B | torte | 30 |
| 3 | 1A | bibite | 18 |
| 4 | 1C | torte | 25 |
| 5 | 1A | torte | 42 |
| 6 | 1B | panini | 36 |
| 7 | 1C | bibite | 12 |
| 8 | 1A | panini | 20 |
| 9 | 1B | bibite | 15 |

La tabella ha tre campi (Classe, Prodotto, Incasso) e otto record, nelle righe da 2 a 9. L'intestazione serve al foglio per capire dove cominciano i dati e come si chiamano le colonne: grazie a lei puoi chiedere "ordina per Incasso" invece di "ordina per la colonna `C`", e la riga 1 resta ferma al suo posto.

```ad-warning
Righe vuote, celle unite, totali in mezzo
Il foglio considera finita la tabella alla prima riga vuota: i record che stanno sotto restano fuori dall'ordinamento. Anche le celle unite e una riga di totale scritta in mezzo ai dati rompono la struttura. I totali vanno sotto la tabella, staccati, oppure si fanno calcolare con i subtotali.
```

## Ordinare

**Ordinare** una tabella vuol dire cambiare l'ordine dei record secondo i valori di un campo. L'ordine è **crescente** (dal più piccolo al più grande, dalla A alla Z) oppure **decrescente** (dal più grande al più piccolo, dalla Z alla A).

1. Fai clic su una cella qualunque della tabella.
2. Apri il comando per ordinare, nel menu dei dati.
3. Scegli il campo e il verso, crescente o decrescente.

Ogni record si sposta intero: le celle di una riga restano sempre insieme.

```ad-example
Esempio 1: ordinare su un campo
Si ordina la tabella del mercatino per Incasso, in ordine decrescente. Il valore più grande è $42$, poi $36$, $30$, $25$, $20$, $18$, $15$ e $12$.

|   | A | B | C |
|---|---|---|---|
| 1 | Classe | Prodotto | Incasso |
| 2 | 1A | torte | 42 |
| 3 | 1B | panini | 36 |
| 4 | 1B | torte | 30 |
| 5 | 1C | torte | 25 |
| 6 | 1A | panini | 20 |
| 7 | 1A | bibite | 18 |
| 8 | 1B | bibite | 15 |
| 9 | 1C | bibite | 12 |

L'incasso più alto è nella riga 2, subito sotto l'intestazione: le torte della 1A. Accanto a ogni incasso ci sono ancora la sua classe e il suo prodotto.
```

```ad-warning
Ordinare una colonna sola
Se selezioni solo la colonna `C` e ordini quella, i numeri si spostano e le classi restano dove sono: ogni incasso finisce accanto alla classe sbagliata, e la tabella è rovinata senza che si veda. Fai clic su una sola cella, così il foglio prende tutta la tabella.
```

Quando un campo ha valori ripetuti, un solo ordinamento non decide l'ordine dentro ogni gruppo. Si ordina allora su più **livelli**: il primo livello raggruppa, il secondo mette in ordine i record che nel primo sono alla pari.

```ad-example
Esempio 2: ordinare su due livelli
Si ordina la tabella prima per Classe, dalla A alla Z, e poi per Incasso, in ordine decrescente.

|   | A | B | C |
|---|---|---|---|
| 1 | Classe | Prodotto | Incasso |
| 2 | 1A | torte | 42 |
| 3 | 1A | panini | 20 |
| 4 | 1A | bibite | 18 |
| 5 | 1B | panini | 36 |
| 6 | 1B | torte | 30 |
| 7 | 1B | bibite | 15 |
| 8 | 1C | torte | 25 |
| 9 | 1C | bibite | 12 |

Prima vengono tutti i record della 1A, poi quelli della 1B, poi quelli della 1C. Dentro ogni classe gli incassi scendono: per la 1B sono $36$, $30$ e $15$. Il secondo livello non mescola le classi: il $36$ della 1B resta sotto il $18$ della 1A, anche se è più grande.
```

## Filtrare

Un **filtro** mostra solo i record che rispettano una condizione e nasconde gli altri. Si attiva dal menu dei dati: accanto a ogni intestazione compare una freccia, da cui si scelgono i valori da tenere oppure una condizione come "maggiore di". Le condizioni sono i confronti della lezione [Condizioni e funzioni logiche](/materiale/scuola-superiore/informatica/il-foglio-di-calcolo/condizioni-e-funzioni-logiche).

```ad-example
Esempio 3: uno e due filtri
Si parte dalla tabella del mercatino nell'ordine iniziale.

Con il filtro "Classe uguale a 1B" restano visibili tre record, quelli delle righe 2, 6 e 9:

|   | A | B | C |
|---|---|---|---|
| 1 | Classe | Prodotto | Incasso |
| 2 | 1B | torte | 30 |
| 6 | 1B | panini | 36 |
| 9 | 1B | bibite | 15 |

I numeri di riga saltano da 2 a 6: le righe in mezzo ci sono ancora, ma sono nascoste.

Con il filtro "Incasso maggiore di 20" restano invece quattro record: $30$, $25$, $42$ e $36$, nelle righe 2, 4, 5 e 6. Il $20$ della riga 8 non passa, perché non è maggiore di $20$.

Se i due filtri sono attivi insieme, restano solo i record che rispettano tutte e due le condizioni: le righe 2 e 6, cioè le torte e i panini della 1B.
```

```ad-warning
Un record nascosto non è cancellato
Dopo un filtro la tabella sembra più corta, ma i dati ci sono tutti: tolto il filtro, tornano. Per questo `=SOMMA(C2:C9)` continua a dare $198$, il totale di tutti gli incassi, anche quando si vedono solo le tre righe della 1B.
```

```ad-note
Sommare solo le righe visibili
La funzione `SUBTOTALE` fa i conti solo sulle righe che il filtro lascia visibili. Con il filtro sulla 1B, `=SUBTOTALE(9;C2:C9)` dà $81$: il primo argomento, 9, vuol dire "somma".
```

## I subtotali

Un **subtotale** è il totale di un gruppo di record. Il comando dei subtotali, nel menu dei dati, inserisce una riga di totale ogni volta che il valore di un campo cambia, e in fondo il totale complessivo.

1. Ordina la tabella secondo il campo dei gruppi.
2. Apri il comando dei subtotali.
3. Scegli il campo dei gruppi ("a ogni cambiamento in"), la funzione (somma, conteggio, media) e il campo su cui calcolarla.

```ad-example
Esempio 4: l'incasso di ogni classe
La tabella è ordinata per Classe, come nell'esempio 2. Si chiedono i subtotali a ogni cambiamento in Classe, con la funzione somma, sul campo Incasso.

|   | A | B | C |
|---|---|---|---|
| 1 | Classe | Prodotto | Incasso |
| 2 | 1A | torte | 42 |
| 3 | 1A | panini | 20 |
| 4 | 1A | bibite | 18 |
| 5 | Totale 1A | | 80 |
| 6 | 1B | panini | 36 |
| 7 | 1B | torte | 30 |
| 8 | 1B | bibite | 15 |
| 9 | Totale 1B | | 81 |
| 10 | 1C | torte | 25 |
| 11 | 1C | bibite | 12 |
| 12 | Totale 1C | | 37 |
| 13 | Totale complessivo | | 198 |

I conti: $42 + 20 + 18 = 80$, $36 + 30 + 15 = 81$, $25 + 12 = 37$. Il totale complessivo è la somma dei tre subtotali, $80 + 81 + 37 = 198$.

Con la funzione conteggio i subtotali direbbero quanti record ha ogni classe: $3$, $3$ e $2$.
```

```ad-warning
Prima si ordina, poi si chiedono i subtotali
Il foglio inserisce un totale ogni volta che il valore cambia da una riga alla successiva. Nella tabella non ordinata la classe cambia a ogni riga (1B, 1A, 1C, 1A...): usciranno otto "totali" di una riga sola invece di tre.
```

## La tabella pivot

Una **tabella pivot** è una tabella riassuntiva che il foglio costruisce a partire dai dati: incrocia due campi e, per ogni incrocio, calcola un valore. Si decide che cosa mettere in tre posti:

- nelle righe, un campo i cui valori diventano le righe della tabella riassuntiva;
- nelle colonne, un campo i cui valori diventano le colonne;
- nei valori, il campo da riassumere e la funzione con cui farlo: somma, conteggio, media.

```tikz
% nome: tabella-pivot-campi
% alt: Schema di una tabella pivot: una freccia porta il campo Classe nella fascia delle righe a sinistra, una il campo Prodotto nella fascia delle colonne in alto e una il campo Incasso, con la funzione somma, nelle celle dei valori al centro
% svg: tabella-pivot-campi-3256a3b8.svg 247x201
\begin{tikzpicture}[font=\small]
\tikzset{campo/.style={draw, thick, fill=orange!25, rounded corners=3pt, minimum width=1.6cm, minimum height=0.6cm}}
\draw[thick, fill=blue!10] (2.2,2.1) rectangle (3.3,2.8);
\draw[thick, fill=blue!25] (3.3,2.1) rectangle (6.2,2.8);
\draw[thick, fill=blue!25] (2.2,0) rectangle (3.3,2.1);
\draw[thick] (3.3,0) rectangle (6.2,2.1);
\node at (4.75,2.45) {colonne};
\node at (2.75,1.05) {righe};
\node[align=center] at (4.75,1.05) {valori\\(somma)};
\node[campo] (c) at (0.6,1.05) {Classe};
\node[campo] (p) at (4.75,3.7) {Prodotto};
\node[campo] (i) at (4.75,-0.9) {Incasso};
\draw[-{Stealth}, thick] (c.east) -- (2.15,1.05);
\draw[-{Stealth}, thick] (p.south) -- (4.75,2.85);
\draw[-{Stealth}, thick] (i.north) -- (4.75,-0.05);
\end{tikzpicture}
```

```ad-example
Esempio 5: classi e prodotti
Dalla tabella del mercatino si costruisce una tabella pivot con Classe nelle righe, Prodotto nelle colonne e la somma di Incasso nei valori.

| | bibite | panini | torte | Totale |
|---|---|---|---|---|
| 1A | 18 | 20 | 42 | 80 |
| 1B | 15 | 36 | 30 | 81 |
| 1C | 12 | | 25 | 37 |
| Totale | 45 | 56 | 97 | 198 |

All'incrocio tra 1B e panini c'è $36$: è la somma degli incassi di tutti i record con Classe uguale a 1B e Prodotto uguale a panini (qui uno solo). La cella tra 1C e panini è vuota, perché la 1C non ha venduto panini.

L'ultima colonna dà il totale di ogni classe, gli stessi numeri dei subtotali dell'esempio 4. L'ultima riga dà il totale di ogni prodotto: le torte hanno incassato $42 + 30 + 25 = 97$ euro. In basso a destra c'è il totale complessivo, $198$.
```

Otto record sono diventati una tabella che risponde a tre domande insieme: quanto ha incassato ogni classe, quanto ha reso ogni prodotto, e chi ha venduto che cosa. La tabella pivot non tocca i dati di partenza: li legge e li riassume in un altro punto del foglio. Se i dati cambiano, va aggiornata con il suo comando.

```ad-tip
Subtotali o pivot
I subtotali riassumono secondo un solo campo e si mescolano ai dati. La tabella pivot incrocia due campi e sta per conto suo: quando la domanda è "quanto per ogni classe e per ogni prodotto", serve lei.
```
