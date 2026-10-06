# Formulario: Idruri e idracidi

## Le tre famiglie

L'idrogeno ha elettronegatività $\chi = 2{,}20$: con un elemento meno elettronegativo ha n.o. $-1$, con uno più elettronegativo ha $+1$.

| Famiglia | Idrogeno legato a | n.o. dell'idrogeno | H nella formula | Esempi |
|---|---|---|---|---|
| idruri metallici | un metallo | $-1$ | a destra | $\mathrm{NaH}$, $\mathrm{CaH_2}$ |
| idruri covalenti | un non metallo o un semimetallo dei gruppi 14 e 15 | $+1$ con carbonio, azoto e fosforo | a destra | $\mathrm{CH_4}$, $\mathrm{NH_3}$ |
| idracidi | un non metallo dei gruppi 16 e 17, ossigeno escluso | $+1$ | a sinistra | $\mathrm{H_2S}$, $\mathrm{HCl}$ |

```tikz
% nome: idruri-terzo-periodo-famiglie
% alt: I composti con l'idrogeno degli elementi del terzo periodo, in fila: NaH, MgH2, AlH3, SiH4, PH3, H2S, HCl. Sotto i primi tre c'è scritto idruri metallici, sotto SiH4 e PH3 idruri covalenti, sotto H2S e HCl idracidi. Sopra ogni formula c'è il numero di atomi di idrogeno: 1, 2, 3, 4, 3, 2, 1
\begin{tikzpicture}[x=1.5cm]
\foreach \x/\f/\n/\col in {0/{NaH}/1/blue!12, 1/{MgH_2}/2/blue!12, 2/{AlH_3}/3/blue!12, 3/{SiH_4}/4/gray!20, 4/{PH_3}/3/gray!20, 5/{H_2S}/2/orange!18, 6/{HCl}/1/orange!18} {
  \draw[thick, fill=\col] (\x,0) rectangle ++(1,0.9);
  \node at (\x+0.5,0.45) {\small $\mathrm{\f}$};
  \node at (\x+0.5,1.2) {\small $\n$};
}
\node[left] at (0,1.2) {\small atomi di H};
\draw[thin] (0.05,-0.15) -- (2.95,-0.15);
\node[below] at (1.5,-0.15) {\small idruri metallici};
\draw[thin] (3.05,-0.15) -- (4.95,-0.15);
\node[below] at (4,-0.15) {\small idruri covalenti};
\draw[thin] (5.05,-0.15) -- (6.95,-0.15);
\node[below] at (6,-0.15) {\small idracidi};
\end{tikzpicture}
```

## Idruri metallici

- Formula: $\mathrm{MH}_n$, con $n$ uguale al n.o. del metallo.
- Nomi: idruro di + metallo (tradizionale e Stock); prefisso + idruro di + metallo (IUPAC).

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{NaH}$ | idruro di sodio | idruro di sodio | idruro di sodio |
| $\mathrm{CaH_2}$ | idruro di calcio | idruro di calcio | diidruro di calcio |
| $\mathrm{AlH_3}$ | idruro di alluminio | idruro di alluminio | triidruro di alluminio |

Schema: idruro + acqua dà idrossido + idrogeno.

## Idruri covalenti

- Atomi di idrogeno: $4$ con gli elementi del gruppo 14, $3$ con quelli del gruppo 15. Il nome tradizionale è il nome proprio del composto.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{CH_4}$ | metano | idruro di carbonio | tetraidruro di carbonio |
| $\mathrm{SiH_4}$ | silano | idruro di silicio | tetraidruro di silicio |
| $\mathrm{NH_3}$ | ammoniaca | idruro di azoto | triidruro di azoto |
| $\mathrm{PH_3}$ | fosfina | idruro di fosforo | triidruro di fosforo |
| $\mathrm{AsH_3}$ | arsina | idruro di arsenico | triidruro di arsenico |

## Idracidi

- Formula: $\mathrm{HX}$ con gli alogeni (n.o. $-1$), $\mathrm{H_2S}$ con lo zolfo (n.o. $-2$).
- Composto puro (gas), nome IUPAC: radice + -uro di idrogeno.
- Soluzione in acqua, nome tradizionale: acido + radice + -idrico.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{HF}$ | acido fluoridrico | fluoruro di idrogeno | fluoruro di idrogeno |
| $\mathrm{HCl}$ | acido cloridrico | cloruro di idrogeno | cloruro di idrogeno |
| $\mathrm{HBr}$ | acido bromidrico | bromuro di idrogeno | bromuro di idrogeno |
| $\mathrm{HI}$ | acido iodidrico | ioduro di idrogeno | ioduro di idrogeno |
| $\mathrm{H_2S}$ | acido solfidrico | solfuro di idrogeno | solfuro di diidrogeno |

In acqua: $\mathrm{HCl}(g) \longrightarrow \mathrm{H^+}(aq) + \mathrm{Cl^-}(aq)$.

L'acido cianidrico, $\mathrm{HCN}$ (cianuro di idrogeno), si mette tra gli idracidi anche se ha tre elementi.

## Riconoscere la famiglia

1. L'altro elemento è un metallo: idruro metallico, H a destra con $-1$.
2. È un non metallo dei gruppi 16 e 17, ossigeno escluso: idracido, H a sinistra con $+1$.
3. È un non metallo o un semimetallo dei gruppi 14 e 15: idruro covalente, H a destra.

```ad-warning
Negli idruri dei metalli l'idrogeno ha −1
In $\mathrm{CaH_2}$ si fissa il calcio a $+2$, e l'idrogeno viene $-1$.
```

```ad-warning
-idrico non è -ico
Acido cloridrico $\mathrm{HCl}$, senza ossigeno; acido clorico $\mathrm{HClO_3}$, con l'ossigeno.
```

```ad-warning
L'ammoniaca non è un acido
$\mathrm{NH_3}$ ha l'idrogeno a destra ed è una base.
```
