# Il principio di Avogadro

Nelle leggi dei gas viste finora la quantità di gas restava sempre la stessa. Ma che cosa succede al volume se nel recipiente entra altro gas? E due gas diversi, idrogeno e anidride carbonica, nello stesso volume, alla stessa temperatura e alla stessa pressione, contengono tante particelle quante? La risposta la diede Amedeo Avogadro nel 1811, per spiegare un fatto strano delle reazioni tra gas: il suo principio è la chiave che collega le leggi dei gas alle formule delle molecole.

## La legge dei volumi di combinazione

Nel 1808 Joseph Louis Gay-Lussac misurò i volumi dei gas che reagiscono tra loro, alla stessa temperatura e alla stessa pressione, e trovò che stanno sempre in rapporti di numeri interi piccoli. È la **legge dei volumi di combinazione**. Per esempio:

- $2$ volumi di idrogeno reagiscono con $1$ volume di ossigeno, e danno $2$ volumi di vapore acqueo;
- $1$ volume di idrogeno reagisce con $1$ volume di cloro, e dà $2$ volumi di acido cloridrico (cloruro di idrogeno);
- $1$ volume di azoto reagisce con $3$ volumi di idrogeno, e dà $2$ volumi di ammoniaca.

Un "volume" qui vuol dire una quantità qualunque, purché la stessa per tutti: $2$ litri di idrogeno con $1$ litro di ossigeno, oppure $2\,\text{m}^3$ con $1\,\text{m}^3$.

Il secondo esempio metteva in difficoltà la [teoria atomica di Dalton](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-teoria-atomica-di-dalton). Se l'idrogeno e il cloro fossero fatti di atomi singoli, e un volume di gas contenesse sempre lo stesso numero di particelle, un volume di idrogeno e uno di cloro dovrebbero dare un solo volume di acido cloridrico, un atomo di idrogeno più un atomo di cloro per ogni particella. Per averne due volumi, ogni atomo avrebbe dovuto dividersi a metà, e per Dalton gli atomi erano indivisibili.

## L'ipotesi di Avogadro

Avogadro risolse il problema con due ipotesi. La prima: le particelle dei gas elementari come l'idrogeno, l'ossigeno, l'azoto e il cloro non sono atomi singoli, ma molecole di due atomi, $\mathrm{H_2}$, $\mathrm{O_2}$, $\mathrm{N_2}$ e $\mathrm{Cl_2}$. La seconda è il **principio di Avogadro**: volumi uguali di gas diversi, alla stessa temperatura e alla stessa pressione, contengono lo stesso numero di particelle.

Con le due ipotesi insieme la reazione tra idrogeno e cloro torna. Ogni molecola di idrogeno reagisce con una molecola di cloro, e i loro quattro atomi formano due molecole di acido cloridrico:

$$\mathrm{H_2} + \mathrm{Cl_2} \longrightarrow 2\,\mathrm{HCl}$$

Se un volume di idrogeno contiene $N$ molecole, un volume di cloro ne contiene altrettante, e le molecole di acido cloridrico che si formano sono $2N$: occupano due volumi. Nessun atomo si divide; si dividono le molecole.

```tikz
% nome: avogadro-idrogeno-cloro-volumi
% alt: Un volume di idrogeno con quattro molecole H2, più un volume di cloro con quattro molecole Cl2, danno due volumi di acido cloridrico con quattro molecole HCl ciascuno: otto molecole in tutto, ognuna con un atomo di idrogeno e uno di cloro
% svg: avogadro-idrogeno-cloro-volumi-b7702b90.svg 287x77
\begin{tikzpicture}
\foreach \bx in {0, 2.1, 4.5, 6.0} \draw[thick] (\bx,0) rectangle ++(1.4,1.4);
\foreach \px/\py in {0.35/0.35, 1.0/0.4, 0.4/1.0, 1.05/1.05} {
  \draw[fill=gray!15] (\px-0.07,\py) circle (0.1);
  \draw[fill=gray!15] (\px+0.07,\py) circle (0.1);
  \draw[fill=green!35] (2.1+\px-0.09,\py) circle (0.14);
  \draw[fill=green!35] (2.1+\px+0.09,\py) circle (0.14);
  \draw[fill=green!35] (4.5+\px+0.05,\py) circle (0.14);
  \draw[fill=gray!15] (4.5+\px-0.13,\py) circle (0.1);
  \draw[fill=green!35] (6.0+\px+0.05,\py) circle (0.14);
  \draw[fill=gray!15] (6.0+\px-0.13,\py) circle (0.1);
}
\node at (1.75,0.7) {$+$};
\draw[-{Stealth}, thick] (3.65,0.7) -- (4.35,0.7);
\node[below] at (0.7,-0.05) {\small $1$ vol. $\mathrm{H_2}$};
\node[below] at (2.8,-0.05) {\small $1$ vol. $\mathrm{Cl_2}$};
\node[below] at (5.7,-0.05) {\small $2$ vol. $\mathrm{HCl}$};
\end{tikzpicture}
```

Allo stesso modo si spiegano le altre reazioni. Due molecole di idrogeno e una di ossigeno danno due molecole d'acqua, $2\,\mathrm{H_2} + \mathrm{O_2} \longrightarrow 2\,\mathrm{H_2O}$, e i volumi stanno come $2 : 1 : 2$; una molecola di azoto e tre di idrogeno danno due molecole di ammoniaca, $\mathrm{N_2} + 3\,\mathrm{H_2} \longrightarrow 2\,\mathrm{NH_3}$, e i volumi stanno come $1 : 3 : 2$. I rapporti tra i volumi dei gas che reagiscono sono i rapporti tra i numeri di molecole, cioè i coefficienti dell'equazione chimica.

Le idee di Avogadro furono ignorate per quasi cinquant'anni. Le rese note Stanislao Cannizzaro, che nel 1858 le usò per calcolare le masse atomiche e le presentò al congresso di chimica di Karlsruhe, nel 1860.

## Perché vale: il volume dipende dal numero di particelle

La [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare) spiega il principio. In un gas il volume delle particelle è trascurabile e tra le particelle non ci sono forze: il volume che il gas occupa non dipende da quanto sono grandi le particelle né da che cosa sono, ma solo da quante sono, dalla loro velocità (la temperatura) e dalla [pressione](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas). Una molecola grande di anidride carbonica e un piccolo atomo di elio, alla stessa temperatura, fanno sulle pareti la stessa pressione media: l'atomo di elio è più leggero, ma più veloce.

```tikz
% nome: avogadro-stesso-volume-stesse-particelle
% alt: Tre recipienti uguali alla stessa temperatura e alla stessa pressione: uno con sei atomi di elio, piccoli, uno con sei molecole di azoto, fatte di due atomi, uno con sei molecole di anidride carbonica, fatte di tre atomi. Lo stesso volume contiene lo stesso numero di particelle, qualunque sia il gas
% svg: avogadro-stesso-volume-stesse-particelle-f55eb54c.svg 250x84
\begin{tikzpicture}
\foreach \bx in {0, 2.3, 4.6} \draw[thick] (\bx,0) rectangle ++(1.9,1.6);
\foreach \px/\py in {0.35/0.35, 0.95/0.5, 1.55/0.3, 0.4/1.2, 1.0/1.05, 1.55/1.25} {
  \draw[fill=yellow!40] (\px,\py) circle (0.08);
  \draw[fill=blue!30] (2.3+\px-0.08,\py) circle (0.11);
  \draw[fill=blue!30] (2.3+\px+0.08,\py) circle (0.11);
  \draw[fill=red!30] (4.6+\px-0.17,\py) circle (0.09);
  \draw[fill=red!30] (4.6+\px+0.17,\py) circle (0.09);
  \draw[fill=gray!40] (4.6+\px,\py) circle (0.11);
}
\node[below] at (0.95,-0.05) {\small $\mathrm{He}$};
\node[below] at (3.25,-0.05) {\small $\mathrm{N_2}$};
\node[below] at (5.55,-0.05) {\small $\mathrm{CO_2}$};
\end{tikzpicture}
```

A temperatura e pressione costanti, quindi, il volume di un gas è direttamente proporzionale al numero $N$ delle sue particelle:

$$\frac{V}{N} = \text{costante} \qquad\qquad \frac{V_1}{N_1} = \frac{V_2}{N_2}$$

Se si raddoppia il numero di particelle, il volume raddoppia. Nella figura qui sotto la pressione e la temperatura restano costanti: aggiungi particelle al cilindro e guarda il pistone salire.

```interattivo
% nome: gas-cilindro-avogadro
% alt: Un cilindro verticale chiuso da un pistone libero, con dentro particelle di gas che rimbalzano, un manometro e un piccolo grafico. Con la pressione e la temperatura costanti, un cursore cambia il numero di particelle da 10 a 60: il pistone sale e il volume cresce in proporzione, mentre la pressione letta sul manometro resta la stessa. Si può scegliere anche di tenere costante il volume, e allora a crescere con il numero di particelle è la pressione
```

```ad-example
Esempio 1: quante molecole?
Un palloncino di $2{,}0\,\text{L}$ contiene $5{,}0 \cdot 10^{22}$ atomi di elio. Quante molecole di azoto ci sono in $3{,}0\,\text{L}$ di azoto, alla stessa temperatura e alla stessa pressione?

Per il principio di Avogadro il numero di particelle non dipende dal gas, ma solo dal volume:

$$N_2 = N_1 \cdot \frac{V_2}{V_1} = 5{,}0 \cdot 10^{22} \cdot \frac{3{,}0\,\text{L}}{2{,}0\,\text{L}} = 7{,}5 \cdot 10^{22}$$
```

```ad-warning
Stessa temperatura e stessa pressione
Il principio di Avogadro confronta gas alla stessa temperatura e alla stessa pressione. Un litro di ossigeno compresso in una bombola a $200\,\text{atm}$ contiene circa duecento volte le molecole di un litro d'aria nella stanza: il volume da solo non dice quante particelle ci sono.
```

## I volumi nelle reazioni tra gas

Quando reagenti e prodotti sono gas, alla stessa temperatura e alla stessa pressione, i volumi stanno come i coefficienti dell'equazione chimica bilanciata. Si possono quindi calcolare i volumi che reagiscono senza conoscere le masse.

```ad-example
Esempio 2: la sintesi dell'ammoniaca
L'ammoniaca si produce dall'azoto e dall'idrogeno: $\mathrm{N_2} + 3\,\mathrm{H_2} \longrightarrow 2\,\mathrm{NH_3}$. Quanti litri di azoto servono per far reagire $12\,\text{L}$ di idrogeno, e quanti litri di ammoniaca si ottengono, tutti alla stessa temperatura e pressione?

I volumi stanno come $1 : 3 : 2$. L'azoto è un terzo dell'idrogeno, l'ammoniaca due terzi:

$$V_{\mathrm{N_2}} = \frac{12\,\text{L}}{3} = 4{,}0\,\text{L} \qquad V_{\mathrm{NH_3}} = \frac{2}{3} \cdot 12\,\text{L} = 8{,}0\,\text{L}$$

Da $16\,\text{L}$ di reagenti si ottengono $8{,}0\,\text{L}$ di prodotto: il volume totale dei gas non si conserva, perché cambia il numero di molecole. Si conserva la massa.
```

Si può anche fare il ragionamento di Avogadro al contrario, e ricavare la formula di una molecola dai volumi.

```ad-example
Esempio 3: la formula dai volumi
$2$ volumi di monossido di azoto $\mathrm{NO}$ reagiscono con $1$ volume di ossigeno $\mathrm{O_2}$ e danno $2$ volumi di un solo gas. Qual è la formula delle sue molecole?

Per il principio di Avogadro, $2$ molecole di $\mathrm{NO}$ reagiscono con $1$ molecola di $\mathrm{O_2}$ e danno $2$ molecole del prodotto. Gli atomi di partenza sono $2$ di azoto e $2 + 2 = 4$ di ossigeno, divisi in $2$ molecole: ognuna ha $1$ atomo di azoto e $2$ di ossigeno. Il gas è il diossido di azoto, $\mathrm{NO_2}$:

$$2\,\mathrm{NO} + \mathrm{O_2} \longrightarrow 2\,\mathrm{NO_2}$$
```

```ad-warning
I volumi non si sommano
Un errore frequente è pensare che il volume del prodotto sia la somma dei volumi dei reagenti: $1$ litro di azoto e $3$ di idrogeno darebbero $4$ litri di ammoniaca. I volumi seguono il numero di molecole, e le molecole di ammoniaca sono la metà di quelle dei reagenti: i litri sono $2$.
```

## Le masse delle molecole dalle densità dei gas

Il principio di Avogadro permise di pesare le molecole, una contro l'altra. Due volumi uguali di gas diversi, alla stessa temperatura e pressione, contengono lo stesso numero di molecole; il rapporto tra le loro masse, cioè tra le loro [densità](/materiale/scuola-superiore/chimica/misure-e-grandezze/massa-volume-e-densita), è allora il rapporto tra le masse di una molecola e dell'altra:

$$\frac{d_x}{d_{rif}} = \frac{m_x}{m_{rif}} = \frac{M_x}{M_{rif}}$$

dove $M$ è la massa molecolare relativa, la somma delle masse atomiche della molecola (con le masse atomiche della [lezione sulla mole](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)). Così Cannizzaro, pesando volumi uguali di gas, ricavò le masse di molecole e atomi.

```ad-example
Esempio 4: quale gas è?
Alla stessa temperatura e pressione, $1{,}00\,\text{L}$ di un gas sconosciuto ha una massa di $1{,}96\,\text{g}$, e $1{,}00\,\text{L}$ di ossigeno $\mathrm{O_2}$ una massa di $1{,}43\,\text{g}$. Qual è la massa molecolare relativa del gas? Si tratta di anidride carbonica, di azoto o di metano?

La massa molecolare relativa dell'ossigeno è $2 \cdot 16{,}00 = 32{,}00$. Allora

$$M_x = M_{\mathrm{O_2}} \cdot \frac{m_x}{m_{\mathrm{O_2}}} = 32{,}00 \cdot \frac{1{,}96\,\text{g}}{1{,}43\,\text{g}} = 43{,}8\ldots \approx 44$$

L'anidride carbonica $\mathrm{CO_2}$ ha $M = 12{,}01 + 2 \cdot 16{,}00 = 44{,}01$; l'azoto $\mathrm{N_2}$ $28{,}02$, il metano $\mathrm{CH_4}$ $16{,}05$. Il gas è l'anidride carbonica.
```

Il principio di Avogadro dice che volumi uguali contengono lo stesso numero di particelle, ma non quante sono. Per contarle serve un'altra unità di misura, la mole, e il volume che una mole di gas occupa è il tema della lezione sul [volume molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/il-volume-molare).
