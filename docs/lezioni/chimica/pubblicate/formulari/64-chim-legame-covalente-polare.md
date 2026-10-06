# Formulario: Legame covalente polare e legame dativo

## Elettronegatività e differenza di elettronegatività

| Elemento | $\chi$ | Elemento | $\chi$ | Elemento | $\chi$ |
|---|---|---|---|---|---|
| $\mathrm{H}$ | $2{,}20$ | $\mathrm{F}$ | $3{,}98$ | $\mathrm{S}$ | $2{,}58$ |
| $\mathrm{Li}$ | $0{,}98$ | $\mathrm{Na}$ | $0{,}93$ | $\mathrm{Cl}$ | $3{,}16$ |
| $\mathrm{C}$ | $2{,}55$ | $\mathrm{Mg}$ | $1{,}31$ | $\mathrm{K}$ | $0{,}82$ |
| $\mathrm{N}$ | $3{,}04$ | $\mathrm{Si}$ | $1{,}90$ | $\mathrm{Ca}$ | $1{,}00$ |
| $\mathrm{O}$ | $3{,}44$ | $\mathrm{P}$ | $2{,}19$ | $\mathrm{Br}$ | $2{,}96$ |

Differenza di elettronegatività, sempre positiva:

$$\Delta\chi = \chi_{\text{maggiore}} - \chi_{\text{minore}}$$

$\mathrm{H{-}Cl}$: $\Delta\chi = 3{,}16 - 2{,}20 = 0{,}96$.

## Il legame covalente polare

- Legame covalente polare: legame covalente tra atomi con elettronegatività diversa; la coppia in comune è spostata verso il più elettronegativo.
- Cariche parziali: $\delta^-$ sull'atomo più elettronegativo, $\delta^+$ sull'altro. Sono più piccole della carica di un elettrone.
- Dipolo: due cariche uguali e opposte a una certa distanza.
- Momento dipolare $\mu$: la freccia che punta verso l'atomo più elettronegativo ($\delta^-$), con una croce sulla coda. È più grande se le cariche parziali sono più grandi e più lontane.

## Il tipo di legame da $\Delta\chi$

| $\Delta\chi$ | Tipo di legame | La coppia di elettroni |
|---|---|---|
| minore di $0{,}4$ | covalente puro | in comune, a metà |
| da $0{,}4$ a $1{,}9$ | covalente polare | in comune, spostata |
| maggiore di $1{,}9$ | ionico | passata a un atomo solo |

```tikz
% nome: polare-scala-delta-chi
% alt: Una scala orizzontale della differenza di elettronegatività, da 0 a 3,3, divisa in tre fasce. Da 0 a 0,4 la fascia grigia del legame covalente puro, con i legami cloro-cloro a 0 e carbonio-idrogeno a 0,35. Da 0,4 a 1,9 la fascia azzurra del legame covalente polare, con idrogeno-cloro a 0,96, ossigeno-idrogeno a 1,24 e idrogeno-fluoro a 1,78. Oltre 1,9 la fascia arancione del legame ionico, con sodio-cloro a 2,23 e potassio-fluoro a 3,16
% svg: polare-scala-delta-chi-7ca1766d.svg 370x106
\begin{tikzpicture}[x=2.5cm]
\fill[gray!25] (0,0) rectangle (0.4,0.45);
\fill[blue!15] (0.4,0) rectangle (1.9,0.45);
\fill[orange!30] (1.9,0) rectangle (3.3,0.45);
\draw[thick] (0,0) -- (3.3,0);
\foreach \x in {0, 0.4, 1.9} \draw[thick] (\x,0.55) -- (\x,-0.1);
\node[above] at (0,0.55) {\small $0$};
\node[above] at (0.4,0.55) {\small $0{,}4$};
\node[above] at (1.9,0.55) {\small $1{,}9$};
\node[right] at (3.3,0.22) {\small $\Delta\chi$};
\node at (1.15,0.22) {\small covalente polare};
\node at (2.6,0.22) {\small ionico};
\draw[thin] (0.2,0.45) -- (0.2,1.25);
\node[above] at (0.45,1.2) {\small covalente puro};
\foreach \x in {0, 0.35, 0.96, 1.24, 1.78, 2.23, 3.16} \fill (\x,0) circle (1.6pt);
\node[below] at (-0.08,-0.1) {\small Cl--Cl};
\node[below] at (0.35,-0.55) {\small C--H};
\node[below] at (0.96,-0.1) {\small H--Cl};
\node[below] at (1.3,-0.55) {\small O--H};
\node[below] at (1.78,-0.1) {\small H--F};
\node[below] at (2.23,-0.55) {\small Na--Cl};
\node[below] at (3.16,-0.1) {\small K--F};
\draw[thin] (0.35,0) -- (0.35,-0.6);
\draw[thin] (1.24,0) -- (1.28,-0.6);
\draw[thin] (2.23,0) -- (2.23,-0.6);
\end{tikzpicture}
```

Procedimento:

1. Cerca le due elettronegatività.
2. Calcola $\Delta\chi$, il valore maggiore meno il minore.
3. Confronta con le soglie $0{,}4$ e $1{,}9$.
4. Se il legame è polare, metti $\delta^-$ sull'atomo più elettronegativo.

Tra due legami covalenti è più polare quello con $\Delta\chi$ maggiore: $\mathrm{H{-}F}$ ($1{,}78$), $\mathrm{H{-}Cl}$ ($0{,}96$), $\mathrm{H{-}Br}$ ($0{,}76$).

Le soglie sono una regola pratica. Eccezioni: $\mathrm{NaI}$ ($\Delta\chi = 1{,}73$) è ionico; in $\mathrm{BF_3}$ ($\Delta\chi = 1{,}94$) i legami sono covalenti.

## Il legame dativo

- Legame dativo (o di coordinazione): legame covalente in cui tutti e due gli elettroni della coppia vengono dallo stesso atomo.
- Donatore: l'atomo che mette la coppia; deve avere una coppia solitaria.
- Accettore: l'atomo che la riceve; deve avere posto per due elettroni.
- Si può disegnare con una freccia dal donatore all'accettore.

$$\mathrm{NH_3} + \mathrm{H^+} \longrightarrow \mathrm{NH_4^+} \qquad\qquad \mathrm{H_2O} + \mathrm{H^+} \longrightarrow \mathrm{H_3O^+}$$

| Ione | Donatore | Accettore | Coppie solitarie rimaste |
|---|---|---|---|
| ammonio, $\mathrm{NH_4^+}$ | azoto | $\mathrm{H^+}$ | $0$ |
| ossonio, $\mathrm{H_3O^+}$ | ossigeno | $\mathrm{H^+}$ | $1$ |

Una volta formato, il legame dativo è uguale agli altri: nello ione ammonio i quattro legami $\mathrm{N{-}H}$ sono identici.

```ad-warning
$\delta^-$ non è la carica di uno ione
In $\mathrm{HCl}$ il cloro è $\delta^-$, non $\mathrm{Cl^-}$: la coppia è ancora in comune, solo spostata.
```

```ad-warning
Atomi diversi, ma legame puro
Con $\Delta\chi$ minore di $0{,}4$ il legame è covalente puro anche tra atomi diversi: $\mathrm{C{-}H}$ ($0{,}35$), $\mathrm{N{-}Cl}$ ($0{,}12$).
```

```ad-warning
Legami polari, molecola apolare
Nel $\mathrm{CO_2}$ i due legami sono polari, ma i dipoli si annullano e la molecola è apolare.
```
