# La teoria atomica di Dalton

Alla fine del Settecento i chimici avevano tre leggi ricavate dalle misure: la massa si conserva nelle reazioni ([Lavoisier](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-lavoisier)), ogni composto ha una composizione fissa ([Proust](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-proust)), e quando due elementi formano più composti le masse stanno in rapporti di numeri interi ([proporzioni multiple](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-legge-di-dalton-delle-proporzioni-multiple)). Erano regole, senza una spiegazione. Nel 1808 John Dalton le spiegò tutte e tre con una sola idea, pubblicata nel libro *A New System of Chemical Philosophy*: la materia è fatta di atomi.

## Un'idea antica, una teoria nuova

L'idea che la materia sia fatta di particelle indivisibili è antica: il filosofo greco Democrito, nel V secolo a.C., le chiamava *atomi*, cioè "che non si possono tagliare". Ma per Democrito era un ragionamento, non una conclusione tratta da misure. La novità di Dalton è che i suoi atomi hanno una massa, e che dalla massa degli atomi si ricavano le masse misurate in laboratorio: la sua è una teoria che si può mettere alla prova con la bilancia.

## I postulati della teoria

La teoria di Dalton si riassume in quattro affermazioni, i suoi postulati:

1. La materia è formata da particelle piccolissime e indivisibili, gli **atomi**.
2. Gli atomi di uno stesso elemento sono tutti uguali tra loro, in massa e in proprietà; gli atomi di elementi diversi hanno massa e proprietà diverse.
3. Gli atomi non si creano e non si distruggono. In una reazione chimica gli atomi si separano, si riuniscono e si legano in modo diverso, ma restano gli stessi.
4. I composti si formano quando atomi di elementi diversi si uniscono in rapporti fissi di numeri interi piccoli: un atomo con un atomo, un atomo con due, due con tre.

Dalton chiamava "atomo composto" il gruppo di atomi che forma la particella di un composto; oggi si chiama **molecola** (o unità formula, se il composto è ionico: lo vedremo in [Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni)).

Nel modello di Dalton un atomo è una sfera piena, e un elemento è fatto di sfere tutte uguali. Un composto è fatto di gruppi di sfere tutti uguali tra loro, ognuno con gli stessi atomi nello stesso rapporto.

```tikz
% nome: dalton-elemento-composto-sfere
% alt: Tre riquadri con sfere. Nel primo, un elemento: sei sfere grigie tutte uguali, atomi di carbonio. Nel secondo, un altro elemento: sei sfere rosse tutte uguali, atomi di ossigeno. Nel terzo, un composto: quattro gruppi uguali, ognuno fatto di una sfera grigia e una rossa unite, molecole di monossido di carbonio
% svg: dalton-elemento-composto-sfere-0a875c28.svg 348x103
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.6,2);
\draw[thick] (3.1,0) rectangle (5.7,2);
\draw[thick] (6.2,0) rectangle (8.8,2);
\foreach \x/\y in {0.5/0.5, 1.3/0.45, 2.1/0.6, 0.6/1.4, 1.4/1.3, 2.1/1.5} {
  \draw[thick, fill=gray!45] (\x,\y) circle (0.25); \node at (\x,\y) {\small C};
}
\foreach \x/\y in {3.6/0.5, 4.4/0.45, 5.2/0.6, 3.7/1.4, 4.5/1.3, 5.2/1.5} {
  \draw[thick, fill=red!30] (\x,\y) circle (0.25); \node at (\x,\y) {\small O};
}
\foreach \x/\y in {6.55/0.5, 7.75/0.6, 6.65/1.45, 7.8/1.4} {
  \draw[thick, fill=gray!45] (\x,\y) circle (0.25); \node at (\x,\y) {\small C};
  \draw[thick, fill=red!30] (\x+0.45,\y) circle (0.25); \node at (\x+0.45,\y) {\small O};
}
\node at (1.3,-0.35) {elemento: carbonio};
\node at (4.4,-0.35) {elemento: ossigeno};
\node at (7.5,-0.35) {composto: CO};
\end{tikzpicture}
```

```ad-warning
Atomi dello stesso elemento, non della stessa sostanza
Il secondo postulato dice che sono uguali gli atomi di uno stesso elemento: tutti gli atomi di ossigeno, ovunque si trovino. Non dice che una sostanza è fatta di atomi tutti uguali: l'acqua contiene atomi di idrogeno e atomi di ossigeno, e le sue particelle uguali sono le molecole, non gli atomi.
```

## Le tre leggi spiegate dagli atomi

### La conservazione della massa

In una reazione gli atomi cambiano compagni, ma non spariscono e non compaiono dal nulla (postulato 3). Ogni atomo conserva la sua massa (postulato 2), quindi la somma delle masse dei reagenti è uguale alla somma delle masse dei prodotti: è la legge di Lavoisier.

```tikz
% nome: dalton-reazione-idrogeno-ossigeno
% alt: A sinistra due molecole di idrogeno, ognuna di due sfere bianche H, e una molecola di ossigeno, due sfere rosse O; una freccia porta a destra, dove ci sono due molecole d'acqua, ognuna con una sfera O e due sfere H. Sotto i due lati è scritto lo stesso conteggio: 4 atomi di H e 2 atomi di O
% svg: dalton-reazione-idrogeno-ossigeno-926b849e.svg 300x90
\begin{tikzpicture}
\foreach \y in {0.4,1.4} {
  \draw[thick, fill=gray!8] (0,\y) circle (0.22); \node at (0,\y) {\small H};
  \draw[thick, fill=gray!8] (0.38,\y) circle (0.22); \node at (0.38,\y) {\small H};
}
\draw[thick, fill=red!30] (1.3,0.9) circle (0.25); \node at (1.3,0.9) {\small O};
\draw[thick, fill=red!30] (1.75,0.9) circle (0.25); \node at (1.75,0.9) {\small O};
\draw[-{Stealth}, thick] (2.5,0.9) -- (3.7,0.9);
\foreach \x in {4.6,6.1} {
  \draw[thick, fill=red!30] (\x,0.9) circle (0.25); \node at (\x,0.9) {\small O};
  \draw[thick, fill=gray!8] (\x-0.36,0.6) circle (0.22); \node at (\x-0.36,0.6) {\small H};
  \draw[thick, fill=gray!8] (\x+0.36,0.6) circle (0.22); \node at (\x+0.36,0.6) {\small H};
}
\node at (0.9,-0.4) {4 atomi di H, 2 di O};
\node at (5.35,-0.4) {4 atomi di H, 2 di O};
\end{tikzpicture}
```

Due molecole di idrogeno, $\mathrm{H_2}$, e una di ossigeno, $\mathrm{O_2}$, danno due molecole d'acqua, $\mathrm{H_2O}$. Prima e dopo ci sono quattro atomi di idrogeno e due di ossigeno: sono cambiati i legami, non gli atomi.

### La composizione costante

Ogni molecola d'acqua contiene due atomi di idrogeno e uno di ossigeno (postulato 4), e tutti gli atomi di ossigeno hanno la stessa massa, come tutti quelli di idrogeno (postulato 2). Il rapporto tra la massa dell'ossigeno e quella dell'idrogeno è quindi lo stesso in una molecola, in un bicchiere e in un lago: è la legge di Proust.

### Le proporzioni multiple

Nel monossido di carbonio ogni atomo di carbonio è unito a un atomo di ossigeno, nell'anidride carbonica a due. Per la stessa massa di carbonio, cioè per lo stesso numero di atomi di carbonio, il secondo composto ha il doppio degli atomi di ossigeno e il doppio della massa di ossigeno. Gli atomi si uniscono solo interi, e per questo i rapporti tra le masse sono rapporti di numeri interi: è la legge delle proporzioni multiple, che Dalton scoprì proprio ragionando così.

## Le masse relative degli atomi

Un atomo è troppo piccolo per essere pesato, ma dalla teoria di Dalton si ricava quanto pesa un atomo rispetto a un altro. Se in un composto il rapporto tra il numero di atomi è noto, il rapporto tra le masse misurate dice il rapporto tra le masse degli atomi. Dalton prese come riferimento l'atomo più leggero, quello di idrogeno, a cui diede massa $1$, e costruì la prima tabella di **masse atomiche relative**.

```ad-example
Esempio 1: l'ossigeno rispetto all'idrogeno
Nell'acqua la massa di ossigeno è $7{,}92$ volte quella dell'idrogeno. Quanto pesa un atomo di ossigeno rispetto a uno di idrogeno?

Una molecola d'acqua, $\mathrm{H_2O}$, ha due atomi di idrogeno e uno di ossigeno. La massa dell'ossigeno è quella di un atomo di ossigeno, la massa dell'idrogeno è quella di due atomi di idrogeno:
$$\frac{m_{\mathrm{O}}}{2\,m_{\mathrm{H}}} = 7{,}92 \quad\Rightarrow\quad \frac{m_{\mathrm{O}}}{m_{\mathrm{H}}} = 2 \cdot 7{,}92 = 15{,}8$$
Un atomo di ossigeno pesa circa $16$ volte un atomo di idrogeno.
```

Dalton però non sapeva che l'acqua è $\mathrm{H_2O}$. Non c'era modo di contare gli atomi in una molecola, e lui seguì una regola che chiamava della massima semplicità: se due elementi formano un solo composto, la sua particella ha un atomo di ciascuno. Per lui l'acqua era $\mathrm{HO}$, e quindi l'ossigeno pesava quanto il rapporto delle masse, circa $8$ volte l'idrogeno (con le misure del suo tempo scrisse $7$; fonte: C. Giunta, "Dalton atomic weights", Le Moyne College, letto il 30 settembre 2026). Le formule giuste e le masse giuste arrivarono solo decenni dopo, con il [principio di Avogadro](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/il-principio-di-avogadro).

```ad-example
Esempio 2: l'azoto nell'ammoniaca
Nell'ammoniaca, $\mathrm{NH_3}$, la massa di azoto è $4{,}62$ volte quella dell'idrogeno. Quanto pesa un atomo di azoto rispetto a uno di idrogeno? E che cosa avrebbe trovato Dalton con la formula $\mathrm{NH}$?

Nella molecola ci sono un atomo di azoto e tre di idrogeno:
$$\frac{m_{\mathrm{N}}}{3\,m_{\mathrm{H}}} = 4{,}62 \quad\Rightarrow\quad \frac{m_{\mathrm{N}}}{m_{\mathrm{H}}} = 3 \cdot 4{,}62 = 13{,}9$$
Con la formula $\mathrm{NH}$ il rapporto tra le masse degli atomi sarebbe stato lo stesso delle masse misurate, $4{,}62$: tre volte troppo piccolo.
```

```ad-warning
Il rapporto delle masse non è il rapporto degli atomi
Il rapporto tra le masse dei due elementi in un composto è uguale al rapporto tra le masse dei loro atomi solo se gli atomi sono uno a uno. Se la formula ha un indice, bisogna tenerne conto: nell'acqua due atomi di idrogeno pesano insieme un ottavo dell'ossigeno, quindi uno solo ne pesa un sedicesimo.
```

Oggi il riferimento non è più l'atomo di idrogeno ma un dodicesimo dell'atomo di carbonio-12, e le masse atomiche relative si leggono sulla tavola periodica: sono quelle della lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare) ($\mathrm{H}$ $1{,}01$, $\mathrm{N}$ $14{,}01$, $\mathrm{O}$ $16{,}00$). Il rapporto tra ossigeno e idrogeno, $16{,}00 / 1{,}01 = 15{,}8$, è quello dell'esempio 1.

## Che cosa resta della teoria

Due secoli dopo, la teoria di Dalton è ancora il punto di partenza della chimica, ma due postulati si sono rivelati veri solo in parte.

| Postulato | Oggi |
|---|---|
| Gli atomi sono indivisibili | Falso: l'atomo è fatto di [elettroni, protoni e neutroni](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/elettroni-protoni-e-neutroni). Nelle reazioni chimiche però l'atomo non si spezza: al massimo perde o acquista qualche elettrone. |
| Gli atomi di un elemento sono tutti uguali | Vero per le proprietà chimiche, non per la massa: esistono gli [isotopi](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/numero-atomico-numero-di-massa-e-isotopi), atomi dello stesso elemento con masse diverse. |
| Gli atomi non si creano e non si distruggono | Vero in ogni reazione chimica; nelle [reazioni nucleari](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/radioattivita-e-decadimenti) un elemento si può trasformare in un altro. |
| I composti hanno rapporti fissi di numeri interi | Vero per le sostanze fatte di molecole; ma la regola della massima semplicità era sbagliata, e l'acqua è $\mathrm{H_2O}$. |

```ad-note
Perché la massa media della tavola non è intera
Gli isotopi spiegano anche perché le masse atomiche della tavola periodica non sono numeri interi: il cloro, per esempio, è un miscuglio di atomi di due masse diverse, e $35{,}45$ è la loro media.
```
