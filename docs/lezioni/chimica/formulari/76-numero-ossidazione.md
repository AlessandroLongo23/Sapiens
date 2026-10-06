# Formulario: Valenza e numero di ossidazione

## Valenza e numero di ossidazione

- Valenza: numero di elettroni che un atomo cede, acquista o mette in comune quando si lega. Non ha segno.
- Numero di ossidazione (n.o.): carica che l'atomo avrebbe se gli elettroni di ogni legame andassero tutti all'atomo più elettronegativo. Si scrive con il segno davanti: $+3$, $-2$.
- La valenza è il n.o. senza segno.
- Carica di uno ione: numero prima del segno, $\mathrm{Fe^{3+}}$. Numero di ossidazione: segno prima del numero, $+3$.

## Le regole, in ordine di precedenza

1. Elemento non combinato: $0$ ($\mathrm{Na}$, $\mathrm{O_2}$, $\mathrm{S_8}$).
2. Ione di un solo atomo: la sua carica ($+2$ in $\mathrm{Ca^{2+}}$).
3. Somma dei n.o.: $0$ in una molecola o in un'unità formula, la carica in uno ione poliatomico.
4. Fluoro: sempre $-1$.
5. Metalli del gruppo 1: $+1$; del gruppo 2: $+2$; alluminio $+3$; zinco $+2$; argento $+1$.
6. Idrogeno: $+1$.
7. Ossigeno: $-2$.
8. Cloro, bromo, iodio: $-1$ con l'idrogeno e con i metalli.

Eccezioni, tutte previste dall'ordine: idrogeno $-1$ negli idruri dei metalli ($\mathrm{NaH}$); ossigeno $-1$ nei perossidi ($\mathrm{H_2O_2}$) e $+2$ in $\mathrm{OF_2}$.

## Gli estremi dai gruppi

- n.o. massimo: la cifra delle unità del gruppo (gruppo 16: $+6$; gruppo 17: $+7$).
- n.o. minimo di un non metallo: numero del gruppo meno $18$ (gruppo 16: $-2$; gruppo 17: $-1$).
- Ossigeno e fluoro non arrivano al massimo del loro gruppo.

## Calcolare un numero di ossidazione

1. Scrivi i n.o. noti dalle regole.
2. Chiama $x$ quello che manca.
3. Moltiplica ogni n.o. per l'indice del suo atomo e somma.
4. Poni la somma uguale a $0$, o alla carica dello ione, e ricava $x$.

$$\mathrm{K_2Cr_2O_7}: \quad 2 \cdot (+1) + 2x + 7 \cdot (-2) = 0 \qquad x = +6$$

$$\mathrm{SO_4^{2-}}: \quad x + 4 \cdot (-2) = -2 \qquad x = +6$$

## Dai numeri di ossidazione alla formula

Regola dell'incrocio: il n.o. di ciascun elemento, senza segno, diventa l'indice dell'altro; poi gli indici si riducono ai minimi termini. L'elemento con il n.o. positivo si scrive per primo.

```tikz
% nome: ossidazione-regola-incrocio
% alt: La regola dell'incrocio per l'ossido di alluminio. In alto il simbolo Al con il numero di ossidazione più 3 e il simbolo O con meno 2; in basso gli stessi due simboli con gli indici. Due frecce si incrociano: il 3 dell'alluminio scende a fare da indice all'ossigeno, il 2 dell'ossigeno scende a fare da indice all'alluminio. A destra la formula Al2O3 e sotto il controllo: 2 per più 3 più 3 per meno 2 uguale 0
\begin{tikzpicture}
\node at (0,1.8) {\Large Al};
\node at (2.4,1.8) {\Large O};
\node[red] at (0.7,1.8) {$+3$};
\node[blue] at (3.05,1.8) {$-2$};
\node at (0,0) {\Large Al};
\node at (2.4,0) {\Large O};
\node[blue] at (0.5,-0.22) {$2$};
\node[red] at (2.95,-0.22) {$3$};
\draw[-{Stealth}, red] (0.7,1.55) -- (2.95,0.03);
\draw[-{Stealth}, blue] (3.05,1.55) -- (0.55,0.03);
\draw[-{Stealth}, thick] (3.7,0) -- (4.7,0);
\node at (5.7,0) {\Large $\mathrm{Al_2O_3}$};
\node at (2.8,-1.1) {\small $2 \cdot (+3) + 3 \cdot (-2) = 0$};
\end{tikzpicture}
```

Piombo $+4$ e ossigeno $-2$: $\mathrm{Pb_2O_4}$, che si semplifica in $\mathrm{PbO_2}$.

## Le famiglie dei composti

| Composti binari | Elementi | Composti ternari | Elementi |
|---|---|---|---|
| ossidi basici | metallo + O | idrossidi | metallo + O + H |
| ossidi acidi (anidridi) | non metallo + O | ossiacidi | H + non metallo + O |
| idruri | metallo o non metallo + H | sali ternari | metallo + non metallo + O |
| idracidi | H + non metallo dei gruppi 16 e 17 | | |
| sali binari | metallo + non metallo | | |

## I tre nomi

| Nomenclatura | Come dice il n.o. | Esempio per $\mathrm{Fe_2O_3}$ |
|---|---|---|
| tradizionale | suffissi e prefissi sulla radice | ossido ferrico |
| Stock | numero romano tra parentesi, senza spazio | ossido di ferro(III) |
| IUPAC | non lo dice: conta gli atomi con i prefissi | triossido di diferro |

Suffissi della nomenclatura tradizionale:

| n.o. dell'elemento | Nome |
|---|---|
| uno solo | "di" e il nome dell'elemento |
| due | -oso (il più basso), -ico (il più alto) |
| quattro | ipo- e -oso, -oso, -ico, per- e -ico |

Radici: ferr-, rame-, stann-, piomb-, aur-, solfor-, nitr-, fosfor-, carbon-, clor-.

Prefissi IUPAC: mono- ($1$), di- ($2$), tri- ($3$), tetra- ($4$), penta- ($5$), esa- ($6$), epta- ($7$). Mono- si scrive solo in monossido.

```ad-warning
Il n.o. è di un atomo solo
In $\mathrm{K_2Cr_2O_7}$ da $2x = 12$ si ricava $x = +6$, non $+12$.
```

```ad-warning
In uno ione la somma è la carica
Per $\mathrm{SO_4^{2-}}$ l'equazione è $x - 8 = -2$, non $x - 8 = 0$.
```

```ad-warning
Il numero romano non è l'indice
$\mathrm{Fe_2O_3}$ è l'ossido di ferro(III): tra parentesi va il n.o., non l'indice $2$.
```
