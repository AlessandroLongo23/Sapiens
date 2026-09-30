# La formula chimica e il suo significato

$\mathrm{H_2O}$ è forse la formula più famosa del mondo, e in quattro caratteri dice molto: che l'acqua è un composto, che è fatta di idrogeno e ossigeno, e che ogni sua molecola ha due atomi di idrogeno e uno di ossigeno. La formula chimica è il modo in cui i chimici scrivono di che cosa è fatta una sostanza, e saperla leggere vuol dire saper contare gli atomi che contiene.

## Simboli e indici

Una **formula chimica** è fatta dei simboli degli elementi che formano la sostanza ([Elementi, composti e simboli chimici](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/elementi-composti-e-simboli-chimici)), ognuno seguito da un numero scritto in basso, l'**indice**, che dice quanti atomi di quell'elemento ci sono. L'indice $1$ non si scrive.

- $\mathrm{H_2O}$: due atomi di idrogeno, uno di ossigeno.
- $\mathrm{CO_2}$: un atomo di carbonio, due di ossigeno.
- $\mathrm{H_2SO_4}$ (acido solforico): due atomi di idrogeno, uno di zolfo, quattro di ossigeno.
- $\mathrm{C_6H_{12}O_6}$ (glucosio): sei atomi di carbonio, dodici di idrogeno, sei di ossigeno.

L'indice si riferisce solo al simbolo che lo precede: in $\mathrm{CO_2}$ il $2$ riguarda l'ossigeno, non il carbonio.

```molecole
% nome: formula-acido-solforico-etanolo
% alt: Due molecole in formula di struttura con tutti gli atomi: l'acido solforico, uno zolfo al centro legato a quattro ossigeni, due dei quali portano un idrogeno; l'etanolo, due carboni, sei idrogeni e un ossigeno
% svg: formula-acido-solforico-etanolo-9423d2e8.svg 452x124
colonne: 2
idrogeni: tutti
carboni: si
OS(=O)(=O)O | acido solforico, H2SO4
CCO | etanolo, C2H6O
```

La formula dice quanti atomi ci sono, non come sono legati: il disegno lo mostra, la formula no. Contando gli atomi del disegno si ritrova la formula: nell'acido solforico $2$ idrogeni, $1$ zolfo, $4$ ossigeni.

## Il significato qualitativo e quantitativo

Una formula ha due significati.

- Il **significato qualitativo**: quali elementi formano la sostanza. $\mathrm{NaCl}$ contiene sodio e cloro, e nient'altro.
- Il **significato quantitativo**: in che numero ci sono gli atomi di ogni elemento.

Il significato quantitativo dipende dalle particelle della sostanza ([Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni)). Per una sostanza molecolare la formula dice quanti atomi ci sono in una molecola: $\mathrm{NH_3}$ è una molecola con un atomo di azoto e tre di idrogeno. Per un composto ionico non ci sono molecole, e la formula dice il rapporto tra gli ioni del reticolo: $\mathrm{CaCl_2}$ vuol dire un ione calcio ogni due ioni cloruro. Il gruppo di ioni scritto dalla formula è l'**unità formula**.

Dai numeri di atomi, con le masse atomiche, si ricava anche la massa di una molecola o di un'unità formula: il conto è nella lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare).

```ad-warning
Le lettere maiuscole contano
$\mathrm{Co}$ è il cobalto, un elemento; $\mathrm{CO}$ è il monossido di carbonio, un composto di carbonio e ossigeno. Ogni simbolo comincia con una maiuscola, e la seconda lettera, se c'è, è minuscola: le maiuscole dicono dove comincia un nuovo elemento.
```

## Le formule degli elementi

La formula di un elemento dice di che particelle è fatto.

- Gas nobili e metalli si scrivono con il solo simbolo: $\mathrm{He}$, $\mathrm{Ar}$, $\mathrm{Fe}$, $\mathrm{Cu}$.
- Gli elementi fatti di molecole hanno l'indice che dice quanti atomi ha la molecola: $\mathrm{H_2}$, $\mathrm{N_2}$, $\mathrm{O_2}$, $\mathrm{F_2}$, $\mathrm{Cl_2}$, $\mathrm{Br_2}$, $\mathrm{I_2}$, e poi $\mathrm{O_3}$ (ozono), $\mathrm{P_4}$ (fosforo bianco), $\mathrm{S_8}$ (zolfo).

## Indici e coefficienti

Un numero davanti alla formula, grande come i simboli, è un **coefficiente**: dice quante molecole (o unità formula, o atomi) ci sono. Il coefficiente moltiplica tutta la formula che segue.

```tikz
% nome: formula-h-2h-h2-2h2
% alt: Quattro scritture a confronto, ognuna con il suo disegno a sfere: H, un atomo di idrogeno; 2H, due atomi separati; H2, una molecola di due atomi legati; 2H2, due molecole, quattro atomi in tutto
% svg: formula-h-2h-h2-2h2-ff57ee2c.svg 301x99
\begin{tikzpicture}
\draw[thick, fill=gray!8] (0,0) circle (0.25); \node at (0,0) {\small H};
\draw[thick, fill=gray!8] (1.7,0) circle (0.25); \node at (1.7,0) {\small H};
\draw[thick, fill=gray!8] (2.5,0) circle (0.25); \node at (2.5,0) {\small H};
\draw[thick, fill=gray!8] (4.1,0) circle (0.25); \node at (4.1,0) {\small H};
\draw[thick, fill=gray!8] (4.52,0) circle (0.25); \node at (4.52,0) {\small H};
\draw[thick, fill=gray!8] (6.1,0.35) circle (0.25); \node at (6.1,0.35) {\small H};
\draw[thick, fill=gray!8] (6.52,0.35) circle (0.25); \node at (6.52,0.35) {\small H};
\draw[thick, fill=gray!8] (6.1,-0.35) circle (0.25); \node at (6.1,-0.35) {\small H};
\draw[thick, fill=gray!8] (6.52,-0.35) circle (0.25); \node at (6.52,-0.35) {\small H};
\node at (0,-1) {H};
\node at (2.1,-1) {2H};
\node at (4.31,-1) {H$_2$};
\node at (6.31,-1) {2H$_2$};
\node[align=center] at (0,-1.7) {\small 1 atomo};
\node[align=center] at (2.1,-1.7) {\small 2 atomi};
\node[align=center] at (4.31,-1.7) {\small 1 molecola};
\node[align=center] at (6.31,-1.7) {\small 2 molecole};
\end{tikzpicture}
```

Per contare gli atomi con un coefficiente si moltiplica l'indice per il coefficiente. In $3\,\mathrm{H_2O}$ ci sono tre molecole d'acqua: $3 \cdot 2 = 6$ atomi di idrogeno e $3 \cdot 1 = 3$ atomi di ossigeno.

```ad-warning
Il coefficiente non si somma all'indice
In $3\,\mathrm{H_2O}$ gli atomi di idrogeno sono $3 \cdot 2 = 6$, non $3 + 2 = 5$. E il coefficiente vale per tutti gli elementi della formula: gli atomi di ossigeno sono $3$, non $1$.
```

Indice e coefficiente dicono cose diverse, e non si possono scambiare: $2\,\mathrm{H_2O}$ sono due molecole d'acqua, mentre $\mathrm{H_2O_2}$ è una molecola di un'altra sostanza, l'acqua ossigenata. Per cambiare la quantità si cambia il coefficiente; cambiare un indice vuol dire cambiare sostanza.

## Le formule degli ioni

La formula di uno ione ha la carica in alto a destra: prima il numero, poi il segno, e il numero $1$ non si scrive. $\mathrm{Na^+}$ ha una carica positiva, $\mathrm{Ca^{2+}}$ due, $\mathrm{Cl^-}$ una negativa, $\mathrm{O^{2-}}$ due. Negli ioni poliatomici la carica appartiene a tutto il gruppo: $\mathrm{SO_4^{2-}}$ è un atomo di zolfo e quattro di ossigeno con due cariche negative in tutto.

| Carica | Cationi | Anioni |
|---|---|---|
| $1$ | $\mathrm{H^+}$, $\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{NH_4^+}$ | $\mathrm{F^-}$, $\mathrm{Cl^-}$, $\mathrm{Br^-}$, $\mathrm{I^-}$, $\mathrm{OH^-}$, $\mathrm{NO_3^-}$ |
| $2$ | $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$, $\mathrm{Fe^{2+}}$ | $\mathrm{O^{2-}}$, $\mathrm{S^{2-}}$, $\mathrm{SO_4^{2-}}$, $\mathrm{CO_3^{2-}}$ |
| $3$ | $\mathrm{Al^{3+}}$, $\mathrm{Fe^{3+}}$ | $\mathrm{N^{3-}}$, $\mathrm{PO_4^{3-}}$ |

## La formula di un composto ionico

Un composto ionico è neutro, e la sua formula mette insieme cationi e anioni nel rapporto che rende nulla la carica totale. Si scrive prima il catione, poi l'anione, senza le cariche.

1. Scrivi i due ioni con la loro carica.
2. Trova quanti ioni di ogni tipo servono perché le cariche positive siano tante quante le negative: il numero di cariche da compensare è il minimo comune multiplo delle due cariche.
3. Scrivi i numeri trovati come indici, semplificando se hanno un divisore comune.
4. Se un indice diverso da $1$ va a uno ione poliatomico, lo ione va tra parentesi.

```ad-example
Esempio 1: dagli ioni alla formula
Ossido di magnesio, ioni $\mathrm{Mg^{2+}}$ e $\mathrm{O^{2-}}$: le cariche sono già uguali, un ione di ciascuno, $\mathrm{MgO}$.

Cloruro di calcio, $\mathrm{Ca^{2+}}$ e $\mathrm{Cl^-}$: per compensare $+2$ servono due $\mathrm{Cl^-}$, $\mathrm{CaCl_2}$.

Ossido di alluminio, $\mathrm{Al^{3+}}$ e $\mathrm{O^{2-}}$: il minimo comune multiplo di $3$ e $2$ è $6$; servono due $\mathrm{Al^{3+}}$ ($+6$) e tre $\mathrm{O^{2-}}$ ($-6$), $\mathrm{Al_2O_3}$.

Idrossido di calcio, $\mathrm{Ca^{2+}}$ e $\mathrm{OH^-}$: servono due ioni $\mathrm{OH^-}$, e lo ione va tra parentesi, $\mathrm{Ca(OH)_2}$.

Solfato di alluminio, $\mathrm{Al^{3+}}$ e $\mathrm{SO_4^{2-}}$: come per l'ossido, due e tre, $\mathrm{Al_2(SO_4)_3}$.
```

```ad-warning
Dimenticare le parentesi
$\mathrm{CaOH_2}$ direbbe un atomo di ossigeno e due di idrogeno; $\mathrm{Ca(OH)_2}$ dice due ioni $\mathrm{OH^-}$, cioè due atomi di ossigeno e due di idrogeno. Senza parentesi l'indice vale solo per l'ultimo simbolo.
```

```ad-warning
Non semplificare, o semplificare troppo
Con $\mathrm{Mg^{2+}}$ e $\mathrm{O^{2-}}$ lo scambio delle cariche darebbe $\mathrm{Mg_2O_2}$: la formula di un composto ionico si semplifica, ed è $\mathrm{MgO}$. Nelle molecole invece gli indici non si semplificano: l'acqua ossigenata è $\mathrm{H_2O_2}$, non $\mathrm{HO}$, perché la sua molecola ha davvero quattro atomi.
```

## Contare gli atomi

Per contare gli atomi di un elemento in una formula:

1. Guarda ogni punto in cui compare l'elemento, perché può comparire più di una volta (in $\mathrm{NH_4NO_3}$ l'azoto compare due volte).
2. Per ogni comparsa, moltiplica il suo indice per l'indice fuori dalla parentesi, se l'elemento è dentro una parentesi.
3. Somma i contributi.
4. Se c'è un coefficiente davanti, moltiplica il risultato per il coefficiente.

```ad-example
Esempio 2: le parentesi
Quanti atomi di ogni elemento ci sono in un'unità formula di $\mathrm{Al_2(SO_4)_3}$? E in tutto?

L'alluminio è fuori dalla parentesi: $2$. Lo zolfo è dentro, con indice $1$, e la parentesi ha indice $3$: $1 \cdot 3 = 3$. L'ossigeno è dentro con indice $4$: $4 \cdot 3 = 12$. In tutto $2 + 3 + 12 = 17$ atomi.
```

```ad-example
Esempio 3: un elemento che compare due volte
Quanti atomi di azoto e di idrogeno ci sono in $\mathrm{(NH_4)_3PO_4}$, il fosfato di ammonio?

L'azoto è nella parentesi, con indice $1$, e la parentesi ha indice $3$: $3$ atomi di azoto. L'idrogeno ha indice $4$ nella parentesi: $4 \cdot 3 = 12$. Con il fosforo, $1$, e l'ossigeno, $4$, gli atomi in tutto sono $3 + 12 + 1 + 4 = 20$.

In $\mathrm{NH_4NO_3}$, il nitrato di ammonio, l'azoto compare due volte, una nello ione ammonio e una nello ione nitrato: $1 + 1 = 2$ atomi di azoto, $4$ di idrogeno, $3$ di ossigeno.
```

```ad-example
Esempio 4: con un coefficiente
Quanti atomi di ossigeno ci sono in $2\,\mathrm{Ca(NO_3)_2}$?

In un'unità formula l'ossigeno è $3 \cdot 2 = 6$; le unità formula sono due, e gli atomi di ossigeno sono $2 \cdot 6 = 12$.
```

Nella figura scegli una formula e metti nel vassoio gli atomi che servono: la figura ti dice se il conto torna, e se no dove hai sbagliato.

```interattivo
% nome: costruisci-formula-atomi
% alt: Si sceglie una formula tra otto (H2O, CO2, NH3, CH4, H2SO4, Ca(OH)2, Al2(SO4)3 e CuSO4·5H2O) e, per ogni elemento, si aggiungono o si tolgono atomi con due bottoni; gli atomi compaiono come sfere colorate con il loro simbolo, in una riga per elemento. Un bottone controlla il conto: per ogni elemento dice se gli atomi sono giusti, troppi o troppo pochi, e alla fine spiega come si contano con gli indici, le parentesi e l'acqua di cristallizzazione
```

## Gli idrati

Alcuni composti ionici, quando cristallizzano dall'acqua, trattengono nel reticolo un numero fisso di molecole d'acqua, l'**acqua di cristallizzazione**. Sono gli **idrati**, e la loro formula aggiunge l'acqua dopo un punto: il solfato di rame pentaidrato, i cristalli azzurri dei laboratori, è $\mathrm{CuSO_4 \cdot 5H_2O}$. Il punto non è una moltiplicazione: vuol dire "insieme a", e il $5$ è un coefficiente che vale solo per $\mathrm{H_2O}$. Ogni unità formula di $\mathrm{CuSO_4}$ ha con sé cinque molecole d'acqua.

Scaldato, il solfato di rame pentaidrato perde l'acqua e diventa bianco, $\mathrm{CuSO_4}$; con qualche goccia d'acqua torna azzurro.

```ad-example
Esempio 5: il solfato di rame pentaidrato
Quanti atomi di ogni elemento ci sono in $\mathrm{CuSO_4 \cdot 5H_2O}$?

Nel $\mathrm{CuSO_4}$: $1$ di rame, $1$ di zolfo, $4$ di ossigeno. Nelle cinque molecole d'acqua: $5 \cdot 2 = 10$ di idrogeno e $5 \cdot 1 = 5$ di ossigeno. In tutto: $1$ di rame, $1$ di zolfo, $4 + 5 = 9$ di ossigeno, $10$ di idrogeno, cioè $21$ atomi.
```

```ad-warning
L'ossigeno dell'acqua
Negli idrati l'ossigeno compare due volte, nel sale e nell'acqua. Chi conta solo l'ossigeno del sale trova $4$ invece di $9$; chi dimentica il coefficiente dell'acqua trova $4 + 1 = 5$.
```

Altri idrati comuni sono il gesso, $\mathrm{CaSO_4 \cdot 2H_2O}$, e il sale di Epsom, $\mathrm{MgSO_4 \cdot 7H_2O}$.
