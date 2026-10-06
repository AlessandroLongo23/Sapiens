# Ossidi basici e ossidi acidi

La sabbia, la ruggine, la calce dei muratori, l'anidride carbonica che espiri: sono tutti composti dell'ossigeno con un altro elemento. L'ossigeno si lega a quasi tutti gli elementi della tavola periodica, e i composti che forma, gli ossidi, sono la prima famiglia a cui si impara a dare un nome. Si dividono in due gruppi, che si comportano in modo opposto con l'acqua: gli ossidi dei metalli e quelli dei non metalli.

## Che cos'è un ossido

Un **ossido** è un composto binario dell'ossigeno in cui l'ossigeno ha numero di ossidazione $-2$. Nella formula l'ossigeno sta a destra, preceduto dall'altro elemento: $\mathrm{CaO}$, $\mathrm{Fe_2O_3}$, $\mathrm{SO_3}$. Fa eccezione solo il composto con il fluoro, $\mathrm{OF_2}$, che non è un ossido: lì l'ossigeno ha n.o. positivo.

La formula si scrive con la regola dell'incrocio della lezione [Valenza e numero di ossidazione](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/valenza-e-numero-di-ossidazione): il n.o. dell'elemento diventa l'indice dell'ossigeno, il $2$ dell'ossigeno diventa l'indice dell'elemento, e i due indici si riducono ai minimi termini.

| n.o. dell'elemento | $+1$ | $+2$ | $+3$ | $+4$ | $+5$ | $+6$ | $+7$ |
|---|---|---|---|---|---|---|---|
| Formula dell'ossido | $\mathrm{E_2O}$ | $\mathrm{EO}$ | $\mathrm{E_2O_3}$ | $\mathrm{EO_2}$ | $\mathrm{E_2O_5}$ | $\mathrm{EO_3}$ | $\mathrm{E_2O_7}$ |

Con un n.o. dispari gli atomi dell'elemento sono due; con un n.o. pari l'indice $2$ si semplifica e ne resta uno.

Gli ossidi sono di due tipi, secondo l'elemento che si lega all'ossigeno (la differenza tra i due tipi di elementi è nella lezione [Metalli, non metalli e semimetalli](/materiale/scuola-superiore/chimica/il-sistema-periodico/metalli-non-metalli-e-semimetalli)).

```tikz
% nome: ossidi-da-metalli-e-non-metalli
% alt: Due file di riquadri collegati da frecce. Nella prima: un metallo, per esempio il calcio, con l'ossigeno dà un ossido basico, CaO, che con l'acqua dà un idrossido, Ca(OH)2. Nella seconda: un non metallo, per esempio il carbonio, con l'ossigeno dà un ossido acido o anidride, CO2, che con l'acqua dà un ossiacido, H2CO3
% svg: ossidi-da-metalli-e-non-metalli-fe2e3c66.svg 432x129
\begin{tikzpicture}
\foreach \y/\a/\fa/\b/\fb/\c/\fc/\col in {0/{metallo}/{Ca}/{ossido basico}/{CaO}/{idrossido}/{Ca(OH)_2}/blue, -2.1/{non metallo}/{C}/{ossido acido}/{CO_2}/{ossiacido}/{H_2CO_3}/orange} {
  \draw[thick, fill=\col!10] (0,\y) rectangle ++(2.5,1.2);
  \draw[thick, fill=\col!10] (4.3,\y) rectangle ++(2.7,1.2);
  \draw[thick, fill=\col!10] (8.8,\y) rectangle ++(2.5,1.2);
  \node at (1.25,\y+0.82) {\small \a};
  \node at (1.25,\y+0.34) {$\mathrm{\fa}$};
  \node at (5.65,\y+0.82) {\small \b};
  \node at (5.65,\y+0.34) {$\mathrm{\fb}$};
  \node at (10.05,\y+0.82) {\small \c};
  \node at (10.05,\y+0.34) {$\mathrm{\fc}$};
  \draw[-{Stealth}, thick] (2.6,\y+0.6) -- (4.2,\y+0.6) node[midway, above] {\footnotesize + ossigeno};
  \draw[-{Stealth}, thick] (7.1,\y+0.6) -- (8.7,\y+0.6) node[midway, above] {\footnotesize + acqua};
}
\end{tikzpicture}
```

Un **ossido basico** è l'ossido di un metallo: con l'acqua dà un idrossido, che è una base. Un **ossido acido**, o **anidride**, è l'ossido di un non metallo: con l'acqua dà un ossiacido, che è un acido. I nomi "basico" e "acido" vengono da qui, e le proprietà di acidi e basi sono quelle della lezione [Soluzioni acide e basiche: una prima idea del pH](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/soluzioni-acide-e-basiche-una-prima-idea-del-ph). Lo schema dice chi si trasforma in chi; le quantità di ogni reazione si calcolano al quarto anno.

## Gli ossidi basici

Negli ossidi basici un metallo è legato all'ossigeno con un [legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico): sono solidi fatti di cationi del metallo e di ioni ossido, $\mathrm{O^{2-}}$, e fondono a temperature alte. La calce viva, $\mathrm{CaO}$, fonde a circa $2600\,^\circ\text{C}$.

I tre nomi si costruiscono come spiega la lezione precedente.

- Nome tradizionale: "ossido di" e il nome del metallo, se il metallo ha un solo n.o.; "ossido" e l'aggettivo in -oso (n.o. più basso) o in -ico (n.o. più alto), se ne ha due.
- Notazione di Stock: "ossido di", il nome del metallo e, se il metallo ha più di un n.o., il n.o. in numeri romani tra parentesi.
- Nome IUPAC: i prefissi dicono gli indici, prima quello dell'ossigeno e poi quello del metallo.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{Na_2O}$ | ossido di sodio | ossido di sodio | ossido di disodio |
| $\mathrm{CaO}$ | ossido di calcio | ossido di calcio | ossido di calcio |
| $\mathrm{Al_2O_3}$ | ossido di alluminio | ossido di alluminio | triossido di dialluminio |
| $\mathrm{FeO}$ | ossido ferroso | ossido di ferro(II) | monossido di ferro |
| $\mathrm{Fe_2O_3}$ | ossido ferrico | ossido di ferro(III) | triossido di diferro |
| $\mathrm{Cu_2O}$ | ossido rameoso | ossido di rame(I) | ossido di dirame |
| $\mathrm{CuO}$ | ossido rameico | ossido di rame(II) | monossido di rame |
| $\mathrm{SnO_2}$ | ossido stannico | ossido di stagno(IV) | diossido di stagno |

I metalli con due n.o. che incontrerai più spesso sono questi:

| Metallo | n.o. | Aggettivi |
|---|---|---|
| ferro | $+2$, $+3$ | ferroso, ferrico |
| rame | $+1$, $+2$ | rameoso, rameico |
| stagno | $+2$, $+4$ | stannoso, stannico |
| piombo | $+2$, $+4$ | piomboso, piombico |
| cobalto | $+2$, $+3$ | cobaltoso, cobaltico |
| nichel | $+2$, $+3$ | nicheloso, nichelico |
| oro | $+1$, $+3$ | auroso, aurico |

```ad-example
Esempio 1: dalla formula ai tre nomi
Che nomi ha $\mathrm{PbO_2}$?

Serve il n.o. del piombo. L'ossigeno ha $-2$:

$$x + 2 \cdot (-2) = 0 \qquad x = +4$$

Il piombo ha n.o. $+2$ e $+4$: qui ha il più alto, quindi l'aggettivo è piombico.

Nome tradizionale: ossido piombico. Notazione di Stock: ossido di piombo(IV). Nome IUPAC: diossido di piombo.
```

```ad-warning
Il n.o. si calcola, non si legge dagli indici
In $\mathrm{PbO_2}$ l'indice del piombo è $1$, ma il suo n.o. è $+4$: gli indici sono stati semplificati. Chi legge "ossido di piombo(II)" dal $2$ dell'ossigeno, o "ossido di piombo(I)" dall'indice del piombo, sbaglia nome. Il conto $x + 2 \cdot (-2) = 0$ richiede dieci secondi e va fatto sempre.
```

```ad-example
Esempio 2: dal nome alla formula
Scrivi la formula dell'ossido rameoso, dell'ossido di nichel(III) e del triossido di dicromo.

Ossido rameoso: -oso indica il n.o. più basso del rame, $+1$. Incrocio con l'ossigeno a $-2$: $\mathrm{Cu_2O}$.

Ossido di nichel(III): il n.o. è scritto, $+3$. Incrocio: $\mathrm{Ni_2O_3}$.

Triossido di dicromo: il nome IUPAC dà gli indici, due atomi di cromo e tre di ossigeno. La formula è $\mathrm{Cr_2O_3}$, e non serve nessun conto.
```

```ad-warning
-oso e -ico si scambiano facilmente
L'ossido ferroso è $\mathrm{FeO}$, quello con meno ossigeno; l'ossido ferrico è $\mathrm{Fe_2O_3}$. Per ricordarlo: -oso sta con il n.o. più basso, -ico con il più alto. Lo scambio dei due suffissi è l'errore più frequente della nomenclatura tradizionale.
```

## Gli ossidi acidi, o anidridi

Negli ossidi acidi un non metallo è legato all'ossigeno con [legami covalenti polari](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo). Molti sono fatti di molecole piccole e a temperatura ambiente sono gas, come l'anidride carbonica, $\mathrm{CO_2}$, e l'anidride solforosa, $\mathrm{SO_2}$.

Cambia solo il nome tradizionale, che usa la parola "anidride" con l'aggettivo al femminile.

- Nome tradizionale: "anidride" e l'aggettivo in -ica, se il non metallo forma una sola anidride; in -osa (n.o. più basso) e in -ica (n.o. più alto), se ne forma due; con i quattro nomi ipo- e -osa, -osa, -ica, per- e -ica per gli alogeni, che ne formano fino a quattro.
- Notazione di Stock e nome IUPAC: come per gli ossidi basici, sempre con la parola "ossido".

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{CO_2}$ | anidride carbonica | ossido di carbonio(IV) | diossido di carbonio |
| $\mathrm{SiO_2}$ | anidride silicica | ossido di silicio | diossido di silicio |
| $\mathrm{N_2O_3}$ | anidride nitrosa | ossido di azoto(III) | triossido di diazoto |
| $\mathrm{N_2O_5}$ | anidride nitrica | ossido di azoto(V) | pentaossido di diazoto |
| $\mathrm{P_2O_3}$ | anidride fosforosa | ossido di fosforo(III) | triossido di difosforo |
| $\mathrm{P_2O_5}$ | anidride fosforica | ossido di fosforo(V) | pentaossido di difosforo |
| $\mathrm{SO_2}$ | anidride solforosa | ossido di zolfo(IV) | diossido di zolfo |
| $\mathrm{SO_3}$ | anidride solforica | ossido di zolfo(VI) | triossido di zolfo |
| $\mathrm{Cl_2O}$ | anidride ipoclorosa | ossido di cloro(I) | ossido di dicloro |
| $\mathrm{Cl_2O_3}$ | anidride clorosa | ossido di cloro(III) | triossido di dicloro |
| $\mathrm{Cl_2O_5}$ | anidride clorica | ossido di cloro(V) | pentaossido di dicloro |
| $\mathrm{Cl_2O_7}$ | anidride perclorica | ossido di cloro(VII) | eptaossido di dicloro |

L'azoto prende la radice dal suo nome latino, nitr-. Bromo e iodio si comportano come il cloro: l'anidride ipobromosa è $\mathrm{Br_2O}$, l'anidride iodica $\mathrm{I_2O_5}$, l'anidride periodica $\mathrm{I_2O_7}$. Per gli alogeni il nome segue il n.o. anche quando un'anidride manca: $+1$ ipo- e -osa, $+3$ -osa, $+5$ -ica, $+7$ per- e -ica.

```ad-example
Esempio 3: dalla formula ai tre nomi
Che nomi ha $\mathrm{N_2O_5}$?

Gli atomi di azoto sono due, e l'incognita va moltiplicata per $2$:

$$2x + 5 \cdot (-2) = 0 \qquad 2x = 10 \qquad x = +5$$

L'azoto forma due anidridi, con n.o. $+3$ e $+5$: questa è quella con il n.o. più alto.

Nome tradizionale: anidride nitrica. Notazione di Stock: ossido di azoto(V). Nome IUPAC: pentaossido di diazoto.
```

```ad-example
Esempio 4: dal nome alla formula
Scrivi la formula dell'anidride solforosa e dell'anidride ipoclorosa.

Anidride solforosa: lo zolfo forma due anidridi, con n.o. $+4$ e $+6$, e -osa indica il più basso, $+4$. L'incrocio dà $\mathrm{S_2O_4}$, che si semplifica: $\mathrm{SO_2}$.

Anidride ipoclorosa: ipo- e -osa indicano il più basso dei quattro n.o. del cloro, $+1$. L'incrocio dà $\mathrm{Cl_2O}$.
```

```ad-warning
"Anidride" si dice solo per i non metalli
$\mathrm{Fe_2O_3}$ non è l'anidride ferrica: il ferro è un metallo, e il suo ossido è un ossido basico, l'ossido ferrico. Al contrario, $\mathrm{SO_3}$ nella nomenclatura tradizionale è l'anidride solforica, non l'ossido solforico. Nei nomi di Stock e IUPAC la parola è sempre "ossido", per metalli e non metalli.
```

```ad-note
Formule che semplificano la realtà
Le molecole delle due anidridi del fosforo sono in realtà $\mathrm{P_4O_6}$ e $\mathrm{P_4O_{10}}$; si usano le formule minime $\mathrm{P_2O_3}$ e $\mathrm{P_2O_5}$, da cui vengono i nomi. Alcune anidridi, come la clorosa e la clorica, sono così instabili che non si conservano: i loro nomi servono soprattutto per gli acidi che ne derivano, nella lezione [Gli ossiacidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/gli-ossiacidi).
```

## Dal carattere basico al carattere acido

Il confine tra i due tipi di ossidi non è netto. Lungo un periodo della tavola, da sinistra a destra, il carattere metallico diminuisce, e gli ossidi passano poco alla volta da basici ad acidi.

```tikz
% nome: ossidi-terzo-periodo-carattere
% alt: Gli ossidi degli elementi del terzo periodo in fila, da sinistra a destra: Na2O, MgO, Al2O3, SiO2, P2O5, SO3, Cl2O7. Sotto i primi due c'è scritto basici, sotto il terzo anfotero, sotto gli ultimi quattro acidi. Una freccia verso destra dice che il carattere acido cresce
% svg: ossidi-terzo-periodo-carattere-11e77fcb.svg 402x97
\begin{tikzpicture}[x=1.5cm]
\foreach \x/\f/\col in {0/{Na_2O}/blue!12, 1/{MgO}/blue!12, 2/{Al_2O_3}/gray!20, 3/{SiO_2}/orange!18, 4/{P_2O_5}/orange!18, 5/{SO_3}/orange!18, 6/{Cl_2O_7}/orange!18} {
  \draw[thick, fill=\col] (\x,0) rectangle ++(1,0.9);
  \node at (\x+0.5,0.45) {\small $\mathrm{\f}$};
}
\draw[thin] (0.05,-0.15) -- (1.95,-0.15);
\node[below] at (1,-0.15) {\small basici};
\draw[thin] (2.05,-0.15) -- (2.95,-0.15);
\node[below] at (2.5,-0.15) {\small anfotero};
\draw[thin] (3.05,-0.15) -- (6.95,-0.15);
\node[below] at (5,-0.15) {\small acidi};
\draw[-{Stealth}, thick] (0,-1.1) -- (7,-1.1) node[midway, below] {\small cresce il carattere acido};
\end{tikzpicture}
```

In mezzo ci sono gli **ossidi anfoteri**, che si comportano da ossidi basici con gli acidi e da ossidi acidi con le basi: l'ossido di alluminio, $\mathrm{Al_2O_3}$, e l'ossido di zinco, $\mathrm{ZnO}$, sono i due esempi più comuni. Nei nomi si trattano come ossidi basici.

Conta anche il numero di ossidazione. Un metallo di transizione con un n.o. molto alto si comporta da non metallo, e il suo ossido è acido. Succede con il cromo a $+6$ e con il manganese a $+7$:

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{CrO}$ | ossido cromoso | ossido di cromo(II) | monossido di cromo |
| $\mathrm{Cr_2O_3}$ | ossido cromico | ossido di cromo(III) | triossido di dicromo |
| $\mathrm{CrO_3}$ | anidride cromica | ossido di cromo(VI) | triossido di cromo |
| $\mathrm{MnO}$ | ossido manganoso | ossido di manganese(II) | monossido di manganese |
| $\mathrm{Mn_2O_3}$ | ossido manganico | ossido di manganese(III) | triossido di dimanganese |
| $\mathrm{MnO_2}$ | biossido di manganese | ossido di manganese(IV) | diossido di manganese |
| $\mathrm{Mn_2O_7}$ | anidride permanganica | ossido di manganese(VII) | eptaossido di dimanganese |

Qui i nomi tradizionali sono poco regolari ("cromico" indica $+3$ nell'ossido e $+6$ nell'anidride), ed è una buona ragione per preferire gli altri due sistemi.

```ad-note
Ossidi di non metalli che non sono anidridi
Il monossido di carbonio, $\mathrm{CO}$, e il monossido di azoto, $\mathrm{NO}$, non reagiscono con l'acqua per dare un acido: non sono né acidi né basici, e non si chiamano anidridi. Lo stesso vale per $\mathrm{N_2O}$, il gas esilarante. Di solito si chiamano con il nome IUPAC.
```

Nella figura scegli un elemento e uno dei suoi numeri di ossidazione: l'incrocio con l'ossigeno dà la formula, e sotto compaiono il tipo di ossido e i tre nomi.

```interattivo
% nome: ossidi-costruisci-formula-nomi
% alt: Si sceglie un elemento tra sedici, metalli e non metalli, e uno dei suoi numeri di ossidazione. La figura mostra l'incrocio: il simbolo dell'elemento con il suo numero di ossidazione e quello dell'ossigeno con meno 2, gli indici che ne escono, la semplificazione quando serve e gli atomi dell'unità formula disegnati come sfere. Sotto si leggono la formula, se l'ossido è basico, acido o anfotero, e i tre nomi: tradizionale, di Stock e IUPAC
```

Con il ferro, passando da $+2$ a $+3$, la formula cambia da $\mathrm{FeO}$ a $\mathrm{Fe_2O_3}$ e il nome da ferroso a ferrico. Con lo zolfo a $+4$ e a $+6$ l'incrocio dà indici da semplificare. Con il cloro i quattro n.o. danno i quattro nomi, da ipoclorosa a perclorica. In tutti i casi il nome IUPAC si legge sugli indici e gli altri due sul n.o.

## I perossidi

I **perossidi** sono composti binari in cui l'ossigeno ha n.o. $-1$, perché contengono due atomi di ossigeno legati tra loro. Il più noto è il perossido di idrogeno, $\mathrm{H_2O_2}$, che in soluzione è l'acqua ossigenata dei disinfettanti.

```tikz
% nome: ossidi-acqua-e-acqua-ossigenata
% alt: A sinistra la molecola d'acqua, H legato a O legato a H, con i numeri di ossidazione scritti sopra gli atomi: più 1, meno 2, più 1. A destra la molecola del perossido di idrogeno, H legato a O legato a O legato a H, con i due atomi di ossigeno legati tra loro: più 1, meno 1, meno 1, più 1
% svg: ossidi-acqua-e-acqua-ossigenata-5aec20a8.svg 312x69
\begin{tikzpicture}
\node (h1) at (0,0) {H};
\node (o1) at (1,0) {O};
\node (h2) at (2,0) {H};
\draw (h1) -- (o1) -- (h2);
\node[red] at (0,0.55) {\small $+1$};
\node[blue] at (1,0.55) {\small $-2$};
\node[red] at (2,0.55) {\small $+1$};
\node at (1,-0.7) {\small acqua};
\node (h3) at (4.5,0) {H};
\node (o2) at (5.5,0) {O};
\node (o3) at (6.5,0) {O};
\node (h4) at (7.5,0) {H};
\draw (h3) -- (o2) -- (o3) -- (h4);
\node[red] at (4.5,0.55) {\small $+1$};
\node[blue] at (5.5,0.55) {\small $-1$};
\node[blue] at (6.5,0.55) {\small $-1$};
\node[red] at (7.5,0.55) {\small $+1$};
\node at (6,-0.7) {\small perossido di idrogeno};
\end{tikzpicture}
```

Il legame tra i due atomi di ossigeno è covalente puro e non sposta elettroni: ogni ossigeno guadagna un solo elettrone, quello dell'idrogeno a cui è legato. Formano perossidi soprattutto l'idrogeno e i metalli dei gruppi 1 e 2 (IA e IIA): perossido di sodio, $\mathrm{Na_2O_2}$, perossido di bario, $\mathrm{BaO_2}$. Il nome è "perossido di" seguito dal nome dell'elemento.

Il gruppo dei due atomi di ossigeno resta intero, e per questo gli indici non si semplificano: $\mathrm{H_2O_2}$ non diventa $\mathrm{HO}$, $\mathrm{Na_2O_2}$ non diventa $\mathrm{NaO}$.

```ad-example
Esempio 5: ossido o perossido?
$\mathrm{BaO_2}$ e $\mathrm{PbO_2}$ hanno formule dello stesso tipo. Sono tutti e due ossidi?

Il bario è un metallo del gruppo 2 e ha sempre n.o. $+2$. Allora $+2 + 2x = 0$ dà $x = -1$ per l'ossigeno: $\mathrm{BaO_2}$ è un perossido, il perossido di bario. L'ossido di bario è $\mathrm{BaO}$.

Il piombo può avere n.o. $+4$, e con l'ossigeno a $-2$ il conto torna: $+4 + 2 \cdot (-2) = 0$. $\mathrm{PbO_2}$ è un ossido, l'ossido piombico.
```

```ad-warning
Un perossido non si riconosce dal numero di atomi di ossigeno
$\mathrm{CO_2}$, $\mathrm{SO_2}$ e $\mathrm{PbO_2}$ hanno due atomi di ossigeno e sono ossidi. È un perossido solo il composto in cui, fissato il n.o. dell'altro elemento con le regole, l'ossigeno risulta $-1$: in pratica con l'idrogeno e con i metalli che hanno un solo n.o., quelli dei gruppi 1 e 2.
```
