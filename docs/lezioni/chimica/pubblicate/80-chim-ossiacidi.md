# Gli ossiacidi

L'acido solforico delle batterie delle automobili, l'acido nitrico da cui si ricavano i fertilizzanti, l'acido carbonico delle bibite gassate hanno la stessa ossatura: idrogeno, un non metallo e ossigeno. Sono ossiacidi, e il loro nome dice quale non metallo contengono e con quale numero di ossidazione. Chi sa leggere quel nome sa scrivere la formula, e chi sa leggere la formula sa dare il nome.

## Che cosa sono

Un **ossiacido** (o ossoacido) è un composto ternario formato da idrogeno, un non metallo e ossigeno. Nella formula i tre elementi si scrivono sempre in quest'ordine:

$$\mathrm{H}_a\mathrm{X}_b\mathrm{O}_c$$

dove $\mathrm{X}$ è il non metallo: $\mathrm{HNO_3}$, $\mathrm{H_2SO_4}$, $\mathrm{H_3PO_4}$. Come tutti gli acidi, in acqua liberano ioni $\mathrm{H^+}$: lo hai visto nella lezione [Soluzioni acide e basiche](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/soluzioni-acide-e-basiche-una-prima-idea-del-ph). Si distinguono dagli idracidi, come $\mathrm{HCl}$ e $\mathrm{H_2S}$, perché contengono ossigeno; gli idracidi sono nella lezione [Idruri e idracidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/idruri-e-idracidi).

La formula di un ossiacido si ricava da quella di un ossido acido, cioè di un'anidride, a cui si aggiunge acqua. Le anidridi sono nella lezione [Ossidi basici e ossidi acidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/ossidi-basici-e-ossidi-acidi).

```tikz
% nome: ossiacidi-schema-anidride-acqua
% alt: Schema a blocchi in due righe. Nella riga in alto tre riquadri collegati da frecce: non metallo, poi con la scritta più ossigeno sulla freccia ossido acido o anidride, poi con la scritta più acqua sulla freccia ossiacido. Nella riga in basso lo stesso percorso con le formule dello zolfo: S, poi SO3, poi H2SO4
% svg: ossiacidi-schema-anidride-acqua-63294726.svg 417x82
\begin{tikzpicture}
\tikzset{box/.style={draw, thick, rounded corners=2pt, fill=blue!10, minimum width=2.5cm, minimum height=0.9cm, align=center}}
\node[box] (a) at (0,0) {non metallo};
\node[box] (b) at (4.2,0) {ossido acido\\(anidride)};
\node[box, fill=orange!25] (c) at (8.4,0) {ossiacido};
\draw[-{Stealth}, thick] (a) -- (b) node[midway, above] {\small $+$ ossigeno};
\draw[-{Stealth}, thick] (b) -- (c) node[midway, above] {\small $+$ acqua};
\node (d) at (0,-1.3) {$\mathrm{S}$};
\node (e) at (4.2,-1.3) {$\mathrm{SO_3}$};
\node (f) at (8.4,-1.3) {$\mathrm{H_2SO_4}$};
\draw[-{Stealth}] (d) -- (e);
\draw[-{Stealth}] (e) -- (f);
\end{tikzpicture}
```

Lo schema serve a ricavare le formule e i nomi, e non descrive sempre una reazione che avviene davvero: l'anidride solforica reagisce con l'acqua e dà acido solforico, mentre la silice della sabbia, $\mathrm{SiO_2}$, in acqua non reagisce affatto. Come si bilanciano queste reazioni è argomento del quarto anno.

## Il numero di ossidazione del non metallo

Il nome di un ossiacido dipende dal numero di ossidazione del non metallo, e per trovarlo servono le regole della lezione [Valenza e numero di ossidazione](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/valenza-e-numero-di-ossidazione): in un ossiacido l'idrogeno ha sempre numero di ossidazione $+1$, l'ossigeno $-2$, e la somma su tutti gli atomi della formula è zero.

```ad-example
Esempio 1: il numero di ossidazione dello zolfo in H₂SO₄
Chiama $x$ il numero di ossidazione dello zolfo. Gli atomi di idrogeno sono $2$, quelli di ossigeno $4$:

$$2 \cdot (+1) + x + 4 \cdot (-2) = 0$$

$$2 + x - 8 = 0 \qquad x = +6$$

Nell'acido $\mathrm{H_2SO_4}$ lo zolfo ha numero di ossidazione $+6$.
```

Il conto è sempre lo stesso: le cariche negative dell'ossigeno, meno quelle positive dell'idrogeno, sono quelle che il non metallo deve compensare. Per un ossiacido $\mathrm{H}_a\mathrm{XO}_c$ con un solo atomo di non metallo:

$$x = 2c - a$$

In $\mathrm{HNO_3}$ l'azoto ha $2 \cdot 3 - 1 = +5$; in $\mathrm{HClO}$ il cloro ha $2 \cdot 1 - 1 = +1$; in $\mathrm{H_3PO_4}$ il fosforo ha $2 \cdot 4 - 3 = +5$. Quando gli atomi di non metallo sono due, come in $\mathrm{H_4P_2O_7}$, il risultato si divide per due: $(2 \cdot 7 - 4) : 2 = +5$.

```ad-warning
Il segno e gli indici
Due errori ricorrenti: dimenticare di moltiplicare per l'indice ($4$ atomi di ossigeno valgono $-8$, non $-2$) e scrivere il risultato senza segno. Il numero di ossidazione ha sempre il segno davanti: $+6$, non $6$.
```

## Il nome tradizionale

Il nome tradizionale è quello che si usa di più, in laboratorio e sulle etichette. Si forma con la parola *acido* seguita dall'aggettivo del non metallo, lo stesso dell'anidride da cui l'acido deriva: dall'anidride solforica l'acido solforico, dall'anidride nitrosa l'acido nitroso. I suffissi e i prefissi sono quelli della nomenclatura tradizionale, e dipendono da quanti numeri di ossidazione ha il non metallo nei suoi ossiacidi:

- se ne ha uno solo, il suffisso è *-ico*: acido carbonico;
- se ne ha due, *-oso* per il più basso e *-ico* per il più alto: acido solforoso ($+4$) e acido solforico ($+6$);
- se ne ha quattro, come il cloro, si aggiungono i prefissi *ipo-* per il più basso di tutti e *per-* per il più alto.

```tikz
% nome: ossiacidi-cloro-quattro-nomi
% alt: Una scala verticale con i quattro numeri di ossidazione del cloro nei suoi ossiacidi, dal basso verso l'alto: più 1, acido ipocloroso, HClO; più 3, acido cloroso, HClO2; più 5, acido clorico, HClO3; più 7, acido perclorico, HClO4. Una freccia a sinistra indica che il numero di ossidazione cresce verso l'alto, e a ogni gradino la formula ha un atomo di ossigeno in più
% svg: ossiacidi-cloro-quattro-nomi-7749b4fc.svg 254x178
\begin{tikzpicture}
\draw[-{Stealth}, thick] (0,-0.3) -- (0,4.3);
\node[rotate=90] at (-0.4,2) {\small numero di ossidazione};
\foreach \y/\n/\nome/\f in {0.4/+1/acido ipocloroso/HClO, 1.5/+3/acido cloroso/HClO_2, 2.6/+5/acido clorico/HClO_3, 3.7/+7/acido perclorico/HClO_4}
{
\draw[thick] (-0.1,\y) -- (0.1,\y);
\node[right] at (0.2,\y) {$\n$};
\draw[thick, rounded corners=2pt, fill=blue!10] (1.2,\y-0.38) rectangle (4.5,\y+0.38);
\node at (2.85,\y) {\nome};
\node[right] at (4.7,\y) {$\mathrm{\f}$};
}
\end{tikzpicture}
```

| Formula | Numero di ossidazione | Nome tradizionale |
|---|---|---|
| $\mathrm{H_2CO_3}$ | $+4$ | acido carbonico |
| $\mathrm{HNO_2}$ | $+3$ | acido nitroso |
| $\mathrm{HNO_3}$ | $+5$ | acido nitrico |
| $\mathrm{H_2SO_3}$ | $+4$ | acido solforoso |
| $\mathrm{H_2SO_4}$ | $+6$ | acido solforico |
| $\mathrm{H_3PO_4}$ | $+5$ | acido fosforico |
| $\mathrm{HClO}$ | $+1$ | acido ipocloroso |
| $\mathrm{HClO_2}$ | $+3$ | acido cloroso |
| $\mathrm{HClO_3}$ | $+5$ | acido clorico |
| $\mathrm{HClO_4}$ | $+7$ | acido perclorico |

Il bromo e lo iodio seguono lo schema del cloro, con gli stessi prefissi e suffissi per gli stessi numeri di ossidazione: $\mathrm{HBrO}$ è l'acido ipobromoso, $\mathrm{HBrO_3}$ l'acido bromico, $\mathrm{HIO_3}$ l'acido iodico, $\mathrm{HIO_4}$ l'acido periodico. L'azoto ha molti numeri di ossidazione, ma forma ossiacidi solo con $+3$ e $+5$.

```ad-warning
-oso e -ico non sono numeri fissi
I suffissi confrontano tra loro gli ossiacidi dello stesso elemento, e non valgono lo stesso numero per tutti: *-ico* vuol dire $+5$ per l'azoto, $+6$ per lo zolfo, $+4$ per il carbonio. Per passare dal nome al numero di ossidazione bisogna conoscere i numeri di ossidazione di quell'elemento, che trovi sulla [tavola periodica](/strumenti/tavola-periodica).
```

```ad-warning
Acido cloridrico e acido clorico
Il suffisso *-idrico* è degli idracidi, che non contengono ossigeno: l'acido cloridrico è $\mathrm{HCl}$. L'acido clorico è $\mathrm{HClO_3}$. Una sillaba cambia il composto.
```

### Cromo e manganese

Il cromo e il manganese sono metalli, ma con i numeri di ossidazione più alti si comportano come non metalli: i loro ossidi sono anidridi e danno ossiacidi. Dal cromo con $+6$ viene l'acido cromico, $\mathrm{H_2CrO_4}$. Il manganese ne forma due: con $+6$ l'acido manganico, $\mathrm{H_2MnO_4}$, e con $+7$ l'acido permanganico, $\mathrm{HMnO_4}$, dove il prefisso *per-* segnala il numero di ossidazione più alto.

## Dal nome tradizionale alla formula

Per scrivere la formula di un ossiacido partendo dal nome si ripercorre lo schema dell'inizio: prima l'anidride, poi l'acqua.

1. Dal suffisso (e dal prefisso, se c'è) ricava il numero di ossidazione del non metallo.
2. Scrivi la formula dell'anidride: il non metallo con il suo numero di ossidazione e l'ossigeno con $-2$.
3. Aggiungi una molecola d'acqua, sommando gli atomi di ogni elemento, e scrivili nell'ordine idrogeno, non metallo, ossigeno.
4. Se tutti gli indici sono divisibili per $2$, dividili per $2$.

```ad-example
Esempio 2: acido solforico
Il suffisso *-ico* indica il numero di ossidazione più alto dello zolfo nei suoi ossiacidi, $+6$. L'anidride è $\mathrm{SO_3}$. Con una molecola d'acqua:

$$\mathrm{SO_3} + \mathrm{H_2O} \longrightarrow \mathrm{H_2SO_4}$$

Gli atomi sono $2$ di idrogeno, $1$ di zolfo e $3 + 1 = 4$ di ossigeno. Gli indici $2$, $1$, $4$ non sono tutti divisibili per $2$: la formula resta $\mathrm{H_2SO_4}$.
```

```ad-example
Esempio 3: acido nitrico
*-ico* per l'azoto vuol dire $+5$, e l'anidride nitrica è $\mathrm{N_2O_5}$. Sommando una molecola d'acqua si contano $2$ atomi di idrogeno, $2$ di azoto e $5 + 1 = 6$ di ossigeno: $\mathrm{H_2N_2O_6}$. Tutti gli indici sono divisibili per $2$, e si semplifica:

$$\mathrm{N_2O_5} + \mathrm{H_2O} \longrightarrow 2\,\mathrm{HNO_3}$$

La formula dell'acido nitrico è $\mathrm{HNO_3}$. Il $2$ davanti dice che da un'anidride e da una molecola d'acqua si formano due molecole di acido.
```

```ad-example
Esempio 4: acido ipocloroso
*Ipo-* e *-oso* insieme indicano il più basso dei quattro numeri di ossidazione del cloro, $+1$. L'anidride ipoclorosa è $\mathrm{Cl_2O}$; con una molecola d'acqua si ottiene $\mathrm{H_2Cl_2O_2}$, che si semplifica in $\mathrm{HClO}$.
```

```ad-warning
Si semplifica solo se si può dividere tutto
$\mathrm{H_2SO_4}$ non diventa $\mathrm{HSO_2}$: lo zolfo ha indice $1$, e $1$ non si divide per $2$. La semplificazione riguarda i tre indici insieme, mai due su tre.
```

```ad-tip
Un controllo veloce
Negli ossiacidi che si ottengono con una sola molecola d'acqua, se il numero di ossidazione del non metallo è dispari l'acido ha $1$ atomo di idrogeno, se è pari ne ha $2$. Gli atomi di ossigeno sono la metà della somma tra il numero di ossidazione e gli atomi di idrogeno. Per l'acido perclorico, cloro $+7$: $1$ idrogeno e $(7 + 1) : 2 = 4$ ossigeni, $\mathrm{HClO_4}$.
```

Nella figura qui sotto scegli il non metallo e il suo numero di ossidazione: compaiono l'anidride, la molecola d'acqua che le si aggiunge, la somma degli atomi e la formula dell'acido con i suoi nomi.

```interattivo
% nome: ossiacidi-anidride-piu-acqua
% alt: Si sceglie un non metallo (carbonio, azoto, zolfo, cloro, fosforo, boro, silicio) e uno dei suoi numeri di ossidazione; per fosforo, boro e silicio si sceglie anche quante molecole d'acqua aggiungere. La figura mostra, come sfere colorate con il simbolo, gli atomi dell'anidride e quelli dell'acqua, poi gli stessi atomi raccolti nell'ordine idrogeno, non metallo, ossigeno. Sotto si leggono la somma degli atomi, la formula semplificata dell'ossiacido, quante molecole se ne formano, il nome tradizionale e il nome IUPAC
```

Con lo zolfo e il carbonio gli indici non si semplificano e si forma una sola molecola di acido; con l'azoto e il cloro, che nell'anidride hanno due atomi, la somma ha tutti gli indici pari e le molecole di acido sono due. Al crescere del numero di ossidazione dello stesso elemento cresce il numero di atomi di ossigeno, mentre quelli di idrogeno non cambiano.

## Il nome IUPAC

Il nome IUPAC descrive la formula senza chiedere di ricordare suffissi diversi. Si costruisce così:

1. la parola *acido*;
2. il numero di atomi di ossigeno, con un prefisso (*mon-*, *di-*, *tri-*, *tetra-*) seguito da *-osso*: monosso, diosso, triosso, tetraosso;
3. il nome del non metallo con il suffisso *-ico*, sempre, qualunque sia il numero di ossidazione;
4. il numero di ossidazione del non metallo, in numeri romani tra parentesi, attaccato al nome.

$\mathrm{H_2SO_4}$ ha quattro atomi di ossigeno e lo zolfo con $+6$: è l'acido tetraossosolforico(VI). $\mathrm{H_2SO_3}$, con tre ossigeni e lo zolfo a $+4$, è l'acido triossosolforico(IV). Il numero romano tra parentesi è la notazione di Stock, che qui fa parte del nome IUPAC: per questo gli ossiacidi hanno due nomi e non tre, quello tradizionale e quello IUPAC.

| Formula | Tradizionale | IUPAC |
|---|---|---|
| $\mathrm{H_2CO_3}$ | acido carbonico | acido triossocarbonico(IV) |
| $\mathrm{HNO_2}$ | acido nitroso | acido diossonitrico(III) |
| $\mathrm{HNO_3}$ | acido nitrico | acido triossonitrico(V) |
| $\mathrm{H_2SO_3}$ | acido solforoso | acido triossosolforico(IV) |
| $\mathrm{H_2SO_4}$ | acido solforico | acido tetraossosolforico(VI) |
| $\mathrm{H_3PO_4}$ | acido fosforico | acido tetraossofosforico(V) |
| $\mathrm{HClO}$ | acido ipocloroso | acido monossoclorico(I) |
| $\mathrm{HClO_2}$ | acido cloroso | acido diossoclorico(III) |
| $\mathrm{HClO_3}$ | acido clorico | acido triossoclorico(V) |
| $\mathrm{HClO_4}$ | acido perclorico | acido tetraossoclorico(VII) |
| $\mathrm{H_2CrO_4}$ | acido cromico | acido tetraossocromico(VI) |
| $\mathrm{HMnO_4}$ | acido permanganico | acido tetraossomanganico(VII) |

Dal nome IUPAC alla formula si arriva con un conto: il nome dà gli atomi di ossigeno e il numero di ossidazione del non metallo, e gli atomi di idrogeno sono quelli che mancano per arrivare a zero.

```ad-example
Esempio 5: dal nome IUPAC alla formula
Qual è la formula dell'acido triossoclorico(V)?

*Triosso* dice $3$ atomi di ossigeno, che valgono $3 \cdot (-2) = -6$. Il cloro ha $+5$. La somma è $-6 + 5 = -1$: per arrivare a zero serve $1$ atomo di idrogeno, con $+1$. La formula è $\mathrm{HClO_3}$, l'acido clorico.
```

```ad-example
Esempio 6: dalla formula al nome IUPAC
Che nome IUPAC ha $\mathrm{HNO_2}$?

Gli atomi di ossigeno sono $2$: *diosso*. Il numero di ossidazione dell'azoto è $2 \cdot 2 - 1 = +3$. Il nome è acido diossonitrico(III). Il nome tradizionale, acido nitroso, dice la stessa cosa con il suffisso *-oso*.
```

```ad-warning
Nel nome IUPAC -oso non c'è
Acido triossosolforoso(IV) non esiste: nel nome IUPAC il suffisso è sempre *-ico*, e a distinguere i due acidi dello zolfo sono il prefisso dell'ossigeno e il numero romano. Il numero romano è il numero di ossidazione del non metallo, non il numero di atomi di ossigeno né quello di idrogeno.
```

```ad-note
Un secondo nome IUPAC
Alcuni libri danno agli ossiacidi il nome che hanno i loro sali, con l'idrogeno al posto del metallo: $\mathrm{H_2SO_4}$ diventa tetraossosolfato(VI) di diidrogeno. Come si costruisce questo nome lo vedi nella lezione [I sali ternari](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/i-sali-ternari).
```

## Meta, piro e orto

Le anidridi di alcuni non metalli, tra cui il fosforo, il boro e il silicio, possono combinarsi con un numero diverso di molecole d'acqua e dare più ossiacidi con lo stesso numero di ossidazione. Il suffisso non può distinguerli, perché il numero di ossidazione è lo stesso, e li distingue un prefisso:

- *meta-* per l'acido con meno acqua: una molecola per ogni anidride;
- *piro-* per quello con due molecole d'acqua;
- *orto-* per quello con più acqua: tre molecole.

Per l'anidride fosforica, $\mathrm{P_2O_5}$:

$$\mathrm{P_2O_5} + \mathrm{H_2O} \longrightarrow 2\,\mathrm{HPO_3} \qquad \mathrm{P_2O_5} + 2\,\mathrm{H_2O} \longrightarrow \mathrm{H_4P_2O_7} \qquad \mathrm{P_2O_5} + 3\,\mathrm{H_2O} \longrightarrow 2\,\mathrm{H_3PO_4}$$

| Anidride | Molecole d'acqua | Formula | Tradizionale | IUPAC |
|---|---|---|---|---|
| $\mathrm{P_2O_5}$ | $1$ | $\mathrm{HPO_3}$ | acido metafosforico | acido triossofosforico(V) |
| $\mathrm{P_2O_5}$ | $2$ | $\mathrm{H_4P_2O_7}$ | acido pirofosforico | acido eptaossodifosforico(V) |
| $\mathrm{P_2O_5}$ | $3$ | $\mathrm{H_3PO_4}$ | acido ortofosforico | acido tetraossofosforico(V) |
| $\mathrm{P_2O_3}$ | $3$ | $\mathrm{H_3PO_3}$ | acido ortofosforoso | acido triossofosforico(III) |
| $\mathrm{B_2O_3}$ | $1$ | $\mathrm{HBO_2}$ | acido metaborico | acido diossoborico(III) |
| $\mathrm{B_2O_3}$ | $3$ | $\mathrm{H_3BO_3}$ | acido ortoborico | acido triossoborico(III) |
| $\mathrm{SiO_2}$ | $1$ | $\mathrm{H_2SiO_3}$ | acido metasilicico | acido triossosilicico(IV) |
| $\mathrm{SiO_2}$ | $2$ | $\mathrm{H_4SiO_4}$ | acido ortosilicico | acido tetraossosilicico(IV) |

L'acido orto è il più comune, e il prefisso di solito si lascia cadere: acido fosforico, senza altro, vuol dire $\mathrm{H_3PO_4}$, e acido borico vuol dire $\mathrm{H_3BO_3}$. Per il silicio, che nell'anidride ha un solo atomo, l'acido con più acqua ne ha due molecole, ed è quello a prendere il prefisso *orto-*. Nel nome IUPAC due atomi di non metallo si indicano con *di-* davanti al suo nome: eptaosso, sette ossigeni, e difosforico, due atomi di fosforo.

```ad-example
Esempio 7: acido pirofosforico
*-ico* per il fosforo vuol dire $+5$: l'anidride è $\mathrm{P_2O_5}$. *Piro-* chiede due molecole d'acqua, cioè $4$ atomi di idrogeno e $2$ di ossigeno in più. Gli atomi sono $4$ di idrogeno, $2$ di fosforo e $5 + 2 = 7$ di ossigeno: $\mathrm{H_4P_2O_7}$. Gli indici $4$, $2$, $7$ non sono tutti divisibili per $2$, e la formula resta così.

Controllo con il numero di ossidazione: $(2 \cdot 7 - 4) : 2 = +5$.
```

```ad-warning
Il prefisso dice l'acqua, non il numero di ossidazione
Acido metafosforico, pirofosforico e ortofosforico hanno tutti il fosforo a $+5$. Chi cambia il numero di ossidazione passando da *meta-* a *orto-* confonde questi prefissi con *ipo-* e *per-*, che invece lo cambiano.
```

Un caso vicino è quello del cromo: due molecole di anidride cromica con una sola molecola d'acqua danno l'acido dicromico, $\mathrm{H_2Cr_2O_7}$ (acido eptaossodicromico(VI)), dove il cromo ha ancora $+6$ come nell'acido cromico.
