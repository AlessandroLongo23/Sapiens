# Livelli e sottolivelli di energia

Il modello di Bohr dà i livelli di energia dell'idrogeno, che ha un solo elettrone. Il sodio ne ha undici, il calcio venti: anche i loro elettroni stanno su livelli? E quanti elettroni ci sono in ogni livello? La risposta viene da una misura: l'energia che serve per strappare a un atomo i suoi elettroni, uno dopo l'altro. Da quei numeri si legge come sono disposti gli elettroni, e su quella disposizione è costruita tutta la tavola periodica.

## L'energia di ionizzazione

Per togliere un elettrone a un atomo bisogna vincere l'attrazione del nucleo, e serve energia. L'**energia di ionizzazione** è l'energia necessaria per togliere un elettrone a ogni atomo di una mole di atomi isolati, allo stato gassoso. Si misura in $\text{kJ/mol}$.

Dopo il primo elettrone se ne può togliere un secondo, poi un terzo, fino all'ultimo. L'**energia di prima ionizzazione** toglie il primo elettrone all'atomo neutro, quella di seconda ionizzazione toglie un elettrone allo ione che si è formato, e così via:

$$\mathrm{Na}(g) \to \mathrm{Na^+}(g) + e^- \qquad\qquad \mathrm{Na^+}(g) \to \mathrm{Na^{2+}}(g) + e^-$$

Sono le **energie di ionizzazione successive**. Ogni energia è più grande della precedente: a ogni passo lo ione ha una carica positiva più grande, e trattiene con più forza gli elettroni che gli restano. Più un elettrone è legato al nucleo, più energia serve per toglierlo: l'energia di ionizzazione misura quanto è profondo, in energia, il posto occupato da quell'elettrone.

```ad-warning
La seconda ionizzazione toglie un elettrone solo
L'energia di seconda ionizzazione è quella che serve per togliere il secondo elettrone, dopo che il primo è già stato tolto. Per toglierli tutti e due si sommano la prima e la seconda.
```

## Le undici energie del sodio

Il sodio ha $11$ elettroni, e quindi undici energie di ionizzazione.

| Ionizzazione | Energia (kJ/mol) | Rapporto con la precedente |
|---|---|---|
| 1ª | $496$ | |
| 2ª | $4562$ | $9{,}2$ |
| 3ª | $6910$ | $1{,}5$ |
| 4ª | $9543$ | $1{,}4$ |
| 5ª | $13\,354$ | $1{,}4$ |
| 6ª | $16\,613$ | $1{,}2$ |
| 7ª | $20\,117$ | $1{,}2$ |
| 8ª | $25\,496$ | $1{,}3$ |
| 9ª | $28\,932$ | $1{,}1$ |
| 10ª | $141\,362$ | $4{,}9$ |
| 11ª | $159\,076$ | $1{,}1$ |

Se gli undici elettroni fossero tutti sullo stesso piano, le energie crescerebbero con regolarità, ognuna poco più grande della precedente. Per otto passi su dieci è così: il rapporto con l'energia precedente sta tra $1{,}1$ e $1{,}5$. In due punti, invece, l'energia fa un salto: tra la prima e la seconda cresce di nove volte, tra la nona e la decima di quasi cinque.

I numeri vanno da cinquecento a centosessantamila, e in un grafico normale i primi sparirebbero. Per vederli tutti insieme si usa una scala in cui ogni tacca vale dieci volte la precedente.

```tikz
% nome: livelli-ionizzazioni-sodio
% alt: Grafico delle undici energie di ionizzazione successive del sodio, in chilojoule alla mole, su una scala verticale in cui ogni tacca vale dieci volte la precedente: mille, diecimila, centomila. Il primo punto è da solo in basso, vicino a cinquecento. Poi un grande salto, e otto punti che salgono piano tra quattromila e trentamila. Poi un altro grande salto, e due punti in alto, sopra centoquarantamila. Tre parentesi sotto l'asse raggruppano i punti: un elettrone, otto elettroni, due elettroni
% svg: livelli-ionizzazioni-sodio-d0d966b4.svg 368x316
\begin{tikzpicture}
\draw[->] (0,0) -- (8.6,0);
\draw[->] (0,0) -- (0,6.1);
\node[above] at (0.3,6.1) {\small energia (kJ/mol)};
\foreach \y/\l in {1/{$10^3$},3/{$10^4$},5/{$10^5$}} {
  \draw[gray!30, very thin] (0,\y) -- (8.4,\y);
  \node[left] at (0,\y) {\small \l};
}
\foreach \k in {1,...,11} \node[below] at (\k*0.7,0) {\scriptsize \k};
\draw[thin, blue] (0.7,0.39) -- (1.4,2.32) -- (2.1,2.68) -- (2.8,2.96) -- (3.5,3.25) -- (4.2,3.44) -- (4.9,3.61) -- (5.6,3.81) -- (6.3,3.92) -- (7.0,5.30) -- (7.7,5.40);
\foreach \x/\y in {0.7/0.39, 1.4/2.32, 2.1/2.68, 2.8/2.96, 3.5/3.25, 4.2/3.44, 4.9/3.61, 5.6/3.81, 6.3/3.92, 7.0/5.30, 7.7/5.40} \fill[blue] (\x,\y) circle (2pt);
\draw[thick, red!80!black, -{Stealth}] (0.85,0.75) -- (1.25,1.95);
\draw[thick, red!80!black, -{Stealth}] (6.45,4.25) -- (6.85,4.95);
\draw[thin] (0.45,-0.55) -- (0.45,-0.65) -- (0.95,-0.65) -- (0.95,-0.55);
\node[below] at (0.7,-0.65) {\scriptsize 1};
\draw[thin] (1.15,-0.55) -- (1.15,-0.65) -- (6.55,-0.65) -- (6.55,-0.55);
\node[below] at (3.85,-0.65) {\scriptsize 8 elettroni};
\draw[thin] (6.75,-0.55) -- (6.75,-0.65) -- (7.95,-0.65) -- (7.95,-0.55);
\node[below] at (7.35,-0.65) {\scriptsize 2};
\node[below] at (4.2,-1.15) {\small ionizzazione};
\end{tikzpicture}
```

I due salti dividono gli elettroni del sodio in tre gruppi.

- Un elettrone si toglie con poca energia: è il più lontano dal nucleo.
- Otto elettroni chiedono energie da nove a sessanta volte più grandi: sono molto più vicini al nucleo, e hanno energie simili tra loro.
- Gli ultimi due chiedono energie enormi: sono i più vicini di tutti.

Ogni gruppo è un **livello di energia**, indicato come nell'idrogeno dal numero quantico principale $n$. Nel sodio i due elettroni più interni sono nel livello $n = 1$, gli otto intermedi nel livello $n = 2$, l'ultimo nel livello $n = 3$: partendo dal nucleo, $2$, $8$, $1$. Le energie di ionizzazione si leggono all'indietro, perché il primo elettrone che si toglie è il più esterno.

```ad-example
Esempio 1: gli elettroni dell'alluminio
Le prime cinque energie di ionizzazione dell'alluminio ($Z = 13$) sono, in $\text{kJ/mol}$: $578$, $1817$, $2745$, $11\,577$, $14\,842$. Quanti elettroni ha nel livello più esterno?

Si confronta ogni energia con la precedente:

$$\frac{1817}{578} = 3{,}1 \qquad \frac{2745}{1817} = 1{,}5 \qquad \frac{11\,577}{2745} = 4{,}2 \qquad \frac{14\,842}{11\,577} = 1{,}3$$

Il rapporto più grande è tra la terza e la quarta, dove l'energia aumenta di $8832\,\text{kJ/mol}$ in un passo solo. I primi tre elettroni stanno nel livello più esterno, il quarto è già di un livello interno. L'alluminio ha $13$ elettroni: $2$ nel primo livello, $8$ nel secondo, $3$ nel terzo.
```

```ad-warning
Il salto è il rapporto più grande, non il primo aumento
Nell'alluminio la seconda energia è già il triplo della prima, ma il salto di livello è dopo la terza: lì il rapporto è $4{,}2$ e l'aumento è di quasi novemila $\text{kJ/mol}$. Confronta tutti i passi prima di decidere.
```

```ad-example
Esempio 2: riconoscere un elemento
Un elemento del terzo periodo ha queste prime energie di ionizzazione, in $\text{kJ/mol}$: $738$, $1451$, $7733$, $10\,543$. Qual è l'elemento, e quale ione forma?

I rapporti sono $1451/738 = 2{,}0$, poi $7733/1451 = 5{,}3$, poi $10\,543/7733 = 1{,}4$: il salto è dopo la seconda ionizzazione, quindi nel livello esterno ci sono $2$ elettroni. Nel terzo periodo l'elemento con gli elettroni disposti $2$, $8$, $2$ ne ha $12$: è il magnesio.

Togliere i primi due elettroni costa relativamente poco, togliere il terzo costa cinque volte di più: il magnesio forma lo ione $\mathrm{Mg^{2+}}$ e si ferma lì.
```

Nella figura qui sotto scegli un elemento, dal litio al calcio, e guardi tutte le sue energie di ionizzazione. Con il secondo cursore leggi il valore di ognuna e il rapporto con la precedente.

```interattivo
% nome: livelli-ionizzazioni-successive
% alt: Un grafico a colonne delle energie di ionizzazione successive di un elemento a scelta tra i primi venti, in chilojoule alla mole, su una scala in cui ogni tacca vale dieci volte la precedente. Le colonne sono raggruppate per livello di energia con una parentesi e un'etichetta, e a ogni cambio di livello c'è un grande salto. Un cursore sceglie l'elemento, un altro la ionizzazione di cui leggere il valore e il rapporto con la precedente. Sotto si legge quanti elettroni ha l'elemento in ogni livello
```

Passando dal sodio al magnesio, all'alluminio, il primo salto si sposta di un posto ogni volta: gli elettroni del livello esterno diventano $1$, $2$, $3$. I gruppi interni restano di $2$ e di $8$. Arrivati al potassio compare un quarto gruppo.

Come cambia l'energia di prima ionizzazione da un elemento all'altro della tavola è l'argomento della lezione [Raggio atomico ed energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione).

## Quanti elettroni in ogni livello

Le energie di ionizzazione degli elementi mostrano che un livello non può contenere quanti elettroni si vuole: il primo si ferma a $2$, il secondo a $8$. La regola generale è che il livello $n$ contiene al massimo

$$2n^2 \text{ elettroni}$$

| Livello $n$ | Capienza $2n^2$ |
|---|---|
| $1$ | $2$ |
| $2$ | $8$ |
| $3$ | $18$ |
| $4$ | $32$ |

Da dove venga il $2n^2$ lo spiega la lezione [Orbitali e numeri quantici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/orbitali-e-numeri-quantici).

```ad-warning
La capienza è un massimo
$2n^2$ dice quanti elettroni possono stare al massimo in un livello, non quanti ce ne sono. Il terzo livello del sodio può contenerne $18$ e ne contiene $1$.
```

## I sottolivelli

Guardate più da vicino, le otto energie del secondo gruppo del sodio non crescono in modo uniforme. Dalla seconda alla settima ionizzazione ogni passo aggiunge tra $2300$ e $3900\,\text{kJ/mol}$; tra la settima e l'ottava l'aumento è di $5379\,\text{kJ/mol}$, e poi torna a $3436$. È un gradino molto più piccolo dei salti tra un livello e l'altro, ma c'è, e si ritrova in tutti gli elementi: divide gli otto elettroni del secondo livello in un gruppo di sei, più facili da togliere, e un gruppo di due, un po' più legati.

Gli elettroni di uno stesso livello, quindi, non hanno tutti la stessa energia: ogni livello è diviso in **sottolivelli**. La conferma viene dagli spettri. Gli atomi con più elettroni hanno molte più righe di quante ne darebbero dei livelli semplici come quelli dell'idrogeno, e le righe si spiegano solo ammettendo che ogni livello sia fatto di più sottolivelli vicini.

I sottolivelli si indicano con le lettere $s$, $p$, $d$, $f$, che vengono proprio dai nomi che gli spettroscopisti davano alle serie di righe. Le regole sono due.

1. Il livello $n$ ha $n$ sottolivelli: il primo ha solo $s$, il secondo $s$ e $p$, il terzo $s$, $p$ e $d$, il quarto $s$, $p$, $d$ e $f$.
2. Ogni tipo di sottolivello ha la sua capienza, uguale in tutti i livelli: $2$ elettroni per un $s$, $6$ per un $p$, $10$ per un $d$, $14$ per un $f$.

Un sottolivello si scrive con il numero del livello seguito dalla lettera: $2p$ è il sottolivello $p$ del secondo livello.

| Livello | Sottolivelli | Elettroni nei sottolivelli | Capienza del livello |
|---|---|---|---|
| $1$ | $1s$ | $2$ | $2$ |
| $2$ | $2s$, $2p$ | $2 + 6$ | $8$ |
| $3$ | $3s$, $3p$, $3d$ | $2 + 6 + 10$ | $18$ |
| $4$ | $4s$, $4p$, $4d$, $4f$ | $2 + 6 + 10 + 14$ | $32$ |

Gli otto elettroni del secondo livello del sodio sono quindi due nel $2s$ e sei nel $2p$: il gradino tra la settima e l'ottava ionizzazione è il passaggio dal $2p$ al $2s$.

```ad-example
Esempio 3: la capienza del quarto livello
Quanti elettroni può contenere al massimo il livello $n = 4$? Quali sottolivelli ha?

Con la regola dei livelli: $2n^2 = 2 \cdot 4^2 = 32$ elettroni.

Il quarto livello ha quattro sottolivelli, $4s$, $4p$, $4d$ e $4f$, che contengono al massimo $2$, $6$, $10$ e $14$ elettroni: in tutto $2 + 6 + 10 + 14 = 32$, come deve essere.
```

```ad-warning
Non tutti i sottolivelli esistono in tutti i livelli
Il livello $n$ ha solo $n$ sottolivelli. Non esistono $1p$, $2d$ o $3f$: il primo $p$ è il $2p$, il primo $d$ è il $3d$, il primo $f$ è il $4f$.
```

## L'ordine di energia dei sottolivelli

Nell'idrogeno l'energia dell'elettrone dipende solo dal livello: $2s$ e $2p$ hanno la stessa energia, e così $3s$, $3p$ e $3d$. Negli atomi con più elettroni non è più vero, perché gli elettroni si respingono tra loro e quelli interni schermano in parte la carica del nucleo. Un elettrone di un sottolivello $s$ passa più tempo vicino al nucleo di uno di un sottolivello $p$ dello stesso livello, sente meglio la sua attrazione e ha un'energia più bassa. Dentro ogni livello l'energia cresce nell'ordine

$$s < p < d < f$$

```tikz
% nome: livelli-sottolivelli-ordine-energia
% alt: Schema dell'energia dei sottolivelli in un atomo con più elettroni, con l'energia che cresce verso l'alto e una colonna per ogni livello da 1 a 5. Dal basso: 1s; poi 2s e 2p; poi 3s e 3p; poi 4s, che sta più in basso di 3d; poi 3d, 4p, 5s, 4d e 5p. Il 4s e il 3d sono evidenziati: il 4s, pur essendo del quarto livello, ha energia più bassa del 3d, che è del terzo
% svg: livelli-sottolivelli-ordine-energia-749c749d.svg 319x314
\begin{tikzpicture}
\draw[-{Stealth}] (0,-0.2) -- (0,6.9) node[above] {\small energia};
\foreach \x/\y/\l in {1.1/0/1s, 2.5/1.5/2s, 2.5/2.2/2p, 3.9/3.1/3s, 3.9/3.7/3p, 5.3/4.8/4p, 6.7/5.3/5s, 5.3/5.75/4d, 6.7/6.3/5p} {
  \draw[thick] (\x-0.45,\y) -- (\x+0.45,\y);
  \node[right] at (\x+0.45,\y) {\small $\l$};
}
\draw[very thick, orange!90!black] (4.85,4.15) -- (5.75,4.15);
\node[right] at (5.75,4.15) {\small $4s$};
\draw[very thick, orange!90!black] (3.45,4.45) -- (4.35,4.45);
\node[left] at (3.45,4.45) {\small $3d$};
\foreach \x/\n in {1.1/1, 2.5/2, 3.9/3, 5.3/4, 6.7/5} \node[below] at (\x,-0.35) {\small $n=\n$};
\end{tikzpicture}
```

La separazione tra i sottolivelli è abbastanza grande da far sovrapporre i livelli: il sottolivello $4s$ ha un'energia un po' più bassa del $3d$, anche se appartiene a un livello più alto. Mettendo i sottolivelli in ordine di energia crescente si ottiene la sequenza con cui gli elettroni li occupano:

$$1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p < 6s < 4f < 5d < 6p < 7s < 5f < 6d < 7p$$

Nella figura passi dall'idrogeno a un atomo con più elettroni e guardi i sottolivelli separarsi.

```interattivo
% nome: livelli-sottolivelli-idrogeno-altri
% alt: Uno schema dei sottolivelli dei primi quattro livelli di energia, con una colonna per ogni tipo, s, p, d, f, e l'energia verso l'alto. Un selettore passa dall'idrogeno a un atomo con più elettroni. Nell'idrogeno i sottolivelli di uno stesso livello sono alla stessa altezza. Nell'atomo con più elettroni si separano, con s più in basso, poi p, d e f, e il 4s scende sotto il 3d. Accanto a ogni sottolivello è scritto quanti elettroni può contenere, e sotto è scritto l'ordine di energia
```

Nell'idrogeno i sottolivelli di un livello stanno tutti alla stessa altezza; con più elettroni ogni livello si apre a ventaglio, e il $4s$ finisce sotto il $3d$.

```ad-example
Esempio 4: gli elettroni del potassio
Il potassio ha $19$ elettroni. Le sue prime due energie di ionizzazione sono $419$ e $3052\,\text{kJ/mol}$. Come sono disposti gli elettroni nei livelli?

La seconda energia è più di sette volte la prima: nel livello esterno c'è un solo elettrone. I primi due livelli sono pieni, con $2$ e $8$ elettroni, e ne restano $19 - 2 - 8 - 1 = 8$ per il terzo: la disposizione è $2$, $8$, $8$, $1$.

Il terzo livello potrebbe contenere $18$ elettroni, ma dopo l'ottavo il diciannovesimo elettrone va nel quarto. Il motivo è l'ordine di energia: riempiti $3s$ e $3p$ con $2 + 6 = 8$ elettroni, il sottolivello libero con l'energia più bassa è il $4s$, non il $3d$.
```

```ad-example
Esempio 5: mettere in ordine i sottolivelli
Metti in ordine di energia crescente i sottolivelli $3d$, $4s$, $3p$ e $4p$.

Nella sequenza dell'ordine di energia si leggono così: $3p < 4s < 3d < 4p$. Il $4s$ viene prima del $3d$; il $4p$, che è dello stesso livello del $4s$ ma di tipo $p$, viene dopo il $3d$.
```

```ad-note
Un ordine che vale per gli atomi neutri
Le energie di $4s$ e $3d$ sono molto vicine, e la sequenza scritta sopra descrive l'ordine in cui i sottolivelli si riempiono negli atomi neutri. Negli ioni dei metalli di transizione l'ordine tra i due si inverte: ne parla la lezione sulla configurazione elettronica.
```

Come gli elettroni di un atomo si distribuiscono nei sottolivelli, uno per uno, è l'argomento della lezione [La configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica). La tabella dei sottolivelli di ogni elemento si può esplorare con lo strumento degli [orbitali atomici](/strumenti/orbitali-atomici).
