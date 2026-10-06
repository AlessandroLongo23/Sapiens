# Formulario: Raggio atomico ed energia di ionizzazione

## Carica nucleare efficace

La carica che sentono gli elettroni esterni, tolto lo schermo degli elettroni interni ($S$ è il loro numero):

$$Z_{eff} = Z - S$$

Sodio, $[\text{Ne}]\,3s^1$: $Z_{eff} = 11 - 10 = +1$. Cloro, $[\text{Ne}]\,3s^2\,3p^5$: $Z_{eff} = 17 - 10 = +7$.

- Lungo un periodo, verso destra: $Z_{eff}$ cresce di uno a ogni elemento.
- Lungo un gruppo, verso il basso: $Z_{eff}$ resta uguale, il livello esterno si allontana dal nucleo.

## Raggio atomico

Metà della distanza tra i nuclei di due atomi uguali legati tra loro, in picometri ($1\,\text{pm} = 10^{-12}\,\text{m}$).

- Lungo un periodo, verso destra: diminuisce (terzo periodo: da $155\,\text{pm}$ del sodio a $99\,\text{pm}$ del cloro).
- Lungo un gruppo, verso il basso: aumenta (gruppo $1$: da $133\,\text{pm}$ del litio a $232\,\text{pm}$ del cesio).
- I gas nobili restano fuori dal confronto.

## Raggio ionico

| Ione | Rispetto all'atomo | Perché | Esempio |
|---|---|---|---|
| Catione | più piccolo | perde il livello esterno, meno elettroni per gli stessi protoni | $\mathrm{Na}$ $155\,\text{pm}$, $\mathrm{Na^+}$ $102\,\text{pm}$ |
| Anione | più grande | più elettroni che si respingono, stessi protoni | $\mathrm{Cl}$ $99\,\text{pm}$, $\mathrm{Cl^-}$ $181\,\text{pm}$ |

Ioni isoelettronici (stesso numero di elettroni): il più piccolo è quello con $Z$ più grande.

$$\mathrm{Al^{3+}} < \mathrm{Mg^{2+}} < \mathrm{Na^+} < \mathrm{F^-} < \mathrm{O^{2-}}$$

## Energia di prima ionizzazione

Energia necessaria per togliere l'elettrone più esterno a un atomo isolato, allo stato gassoso, in $\text{kJ/mol}$:

$$\mathrm{X}(g) \to \mathrm{X^+}(g) + e^-$$

- Lungo un periodo, verso destra: aumenta (minimo il metallo alcalino, massimo il gas nobile).
- Lungo un gruppo, verso il basso: diminuisce.
- Per un solo atomo: si divide per $N_A = 6{,}022 \cdot 10^{23}\,\text{mol}^{-1}$. Sodio: $495{,}8\,\text{kJ/mol}$, cioè $8{,}233 \cdot 10^{-19}\,\text{J}$ per atomo.

Le due eccezioni lungo il periodo:

| Coppia | Chi ha l'energia più bassa | Perché |
|---|---|---|
| Gruppi $2$ e $13$ ($\mathrm{Be}$ e $\mathrm{B}$, $\mathrm{Mg}$ e $\mathrm{Al}$) | il gruppo $13$ | si toglie un elettrone $p$, più alto in energia e schermato dagli $s$ |
| Gruppi $15$ e $16$ ($\mathrm{N}$ e $\mathrm{O}$, $\mathrm{P}$ e $\mathrm{S}$) | il gruppo $16$ | si toglie un elettrone da un orbitale $p$ con due elettroni, che si respingono |

## Energie di ionizzazione successive

Ogni energia è più grande della precedente. Il salto più grande arriva quando finiscono gli elettroni di valenza.

| Elemento | Prima | Seconda | Terza | Quarta |
|---|---|---|---|---|
| $\mathrm{Na}$ | $496$ | $4562$ | $6910$ | $9543$ |
| $\mathrm{Mg}$ | $738$ | $1451$ | $7733$ | $10\,543$ |
| $\mathrm{Al}$ | $578$ | $1817$ | $2745$ | $11\,577$ |

Per trovare il gruppo dalle energie successive:

1. Calcola la differenza (o il rapporto) tra ogni energia e la precedente.
2. Trova il salto più grande.
3. Gli elettroni tolti prima del salto sono gli elettroni di valenza.

## Gli andamenti in uno schema

```tikz
% nome: raggio-ionizzazione-andamenti-tavola
% alt: Lo schema della tavola periodica, un rettangolo con l'incavo in alto, con quattro frecce. Per il raggio atomico una freccia verso il basso lungo il lato sinistro e una verso sinistra lungo il lato inferiore: il raggio aumenta scendendo e andando a sinistra. Per l'energia di ionizzazione una freccia verso l'alto lungo il lato destro e una verso destra lungo il lato superiore: l'energia aumenta salendo e andando a destra
% svg: raggio-ionizzazione-andamenti-tavola-09f5a4a7.svg 309x179
\begin{tikzpicture}
\draw[thick, fill=gray!12] (0,0) -- (7.2,0) -- (7.2,2.8) -- (6.8,2.8) -- (6.8,2.4) -- (4.8,2.4) -- (4.8,1.6) -- (0.8,1.6) -- (0.8,2.4) -- (0.4,2.4) -- (0.4,2.8) -- (0,2.8) -- cycle;
\draw[-{Stealth}, thick, blue] (-0.35,2.8) -- (-0.35,0);
\draw[-{Stealth}, thick, blue] (7.2,-0.35) -- (0,-0.35);
\node[blue, below] at (3.6,-0.4) {\small il raggio atomico aumenta};
\draw[-{Stealth}, thick, red] (7.55,0) -- (7.55,2.8);
\draw[-{Stealth}, thick, red] (0,3.15) -- (7.2,3.15);
\node[red, above] at (3.6,3.2) {\small l'energia di ionizzazione aumenta};
\node at (3.6,0.8) {\small tavola periodica};
\end{tikzpicture}
```

```ad-warning
Più elettroni, atomo più piccolo
Lungo un periodo gli elettroni entrano nello stesso livello e i protoni in più li avvicinano: il raggio diminuisce.
```

```ad-warning
Catione e anione
Il catione (segno più) ha perso elettroni ed è più piccolo dell'atomo; l'anione è più grande.
```

```ad-warning
Le eccezioni dell'energia di ionizzazione
Tra i gruppi $2$ e $13$ e tra i gruppi $15$ e $16$ l'energia di ionizzazione scende invece di salire.
```
