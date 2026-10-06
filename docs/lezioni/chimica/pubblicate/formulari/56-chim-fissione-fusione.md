# Formulario: Fissione e fusione nucleare

## Difetto di massa

Differenza tra la massa dei nucleoni separati e la massa del nucleo:

$$\Delta m = Z \cdot m_p + N \cdot m_n - m_{\text{nucleo}} \qquad N = A - Z$$

Masse: protone $1{,}00728\,\text{u}$, neutrone $1{,}00866\,\text{u}$.

## Massa ed energia

$$E = m\,c^2 \qquad\qquad E = \Delta m \cdot c^2$$

- $c = 3{,}00 \cdot 10^8\,\text{m/s}$, $c^2 = 9{,}00 \cdot 10^{16}\,\text{m}^2/\text{s}^2$.
- $1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$; a $1\,\text{u}$ corrispondono $1{,}494 \cdot 10^{-10}\,\text{J}$.
- $1\,\text{MeV} = 1{,}60 \cdot 10^{-13}\,\text{J}$.

Energia di legame: l'energia liberata quando il nucleo si forma dai suoi nucleoni, uguale a quella che serve per separarli.

## Come si calcola l'energia di legame

1. Conta protoni ($Z$) e neutroni ($N = A - Z$).
2. Calcola $\Delta m$ in unità di massa atomica.
3. Passa ai joule: $E = \Delta m \cdot 1{,}494 \cdot 10^{-10}\,\text{J}$ (oppure $\Delta m$ in kilogrammi per $c^2$).
4. Se serve, passa ai megaelettronvolt dividendo per $1{,}60 \cdot 10^{-13}$.
5. Energia di legame per nucleone: dividi per $A$.

Elio-4: $\Delta m = 0{,}03037\,\text{u}$, $E = 4{,}54 \cdot 10^{-12}\,\text{J} = 28{,}4\,\text{MeV}$, $\dfrac{E}{A} = 7{,}1\,\text{MeV}$.

## Energia di legame per nucleone

$$\frac{E}{A}$$

Più è alta, più il nucleo è stabile. Massimo, circa $8{,}8\,\text{MeV}$, intorno al ferro-56; elio-4 $7{,}1\,\text{MeV}$; uranio-235 $7{,}6\,\text{MeV}$.

```tikz
% nome: fissione-fusione-curva-energia-legame
% alt: Grafico dell'energia di legame per nucleone, in megaelettronvolt, in funzione del numero di massa A da 0 a 240. La curva sale ripida per i nuclei leggeri, con un picco isolato per l'elio-4 a 7,1; arriva al massimo, 8,8, intorno al ferro-56, e poi scende piano fino a 7,6 per l'uranio-235. Una freccia verde verso destra nella parte in salita è la fusione, una freccia rossa verso sinistra nella parte in discesa è la fissione: tutte e due portano verso il massimo
% svg: fissione-fusione-curva-energia-legame-0aa2ce06.svg 348x232
\begin{tikzpicture}[x=0.03cm,y=0.5cm]
\draw[->] (0,0) -- (252,0) node[right] {$A$};
\draw[->] (0,0) -- (0,9.9) node[above] {$E/A$ (MeV)};
\foreach \a in {50,100,150,200} { \draw (\a,0) -- (\a,-0.12) node[below] {\small $\a$}; }
\foreach \e in {2,4,6,8} { \draw (0,\e) -- (-2,\e) node[left] {\small $\e$}; }
\draw[thick, blue] plot coordinates {(1,0.00) (2,1.11) (3,2.83) (4,7.07) (6,5.33) (7,5.61) (9,6.46) (11,6.93) (12,7.68) (14,7.52) (16,7.98) (20,8.03) (24,8.26) (28,8.45) (32,8.49) (40,8.60) (48,8.72) (56,8.79) (62,8.79) (70,8.73) (84,8.72) (98,8.64) (110,8.55) (120,8.50) (138,8.39) (150,8.26) (165,8.15) (184,8.01) (197,7.92) (208,7.87) (220,7.72) (232,7.62) (238,7.57)};
\fill (2,1.11) circle (1.5pt) node[right] {\small ${}^{2}\mathrm{H}$};
\fill (4,7.07) circle (1.5pt) node[left] {\small ${}^{4}\mathrm{He}$};
\fill (56,8.79) circle (1.5pt) node[above] {\small ${}^{56}\mathrm{Fe}$};
\fill (235,7.59) circle (1.5pt) node[above] {\small ${}^{235}\mathrm{U}$};
\draw[-{Stealth}, thick, green!50!black] (8,3.6) -- (40,6.6);
\node[right, green!50!black] at (27,4.6) {\small fusione};
\draw[-{Stealth}, thick, red] (222,6.5) -- (150,7.3);
\node[below, red] at (186,6.6) {\small fissione};
\end{tikzpicture}
```

Una reazione nucleare libera energia se i nuclei che si formano stanno più in alto sulla curva di quelli di partenza.

## Energia di una reazione nucleare

$$\Delta m = m_{\text{reagenti}} - m_{\text{prodotti}} \qquad E = \Delta m \cdot c^2$$

## Fissione e fusione

| | Fissione | Fusione |
|---|---|---|
| Che cosa succede | un nucleo pesante si divide in due nuclei medi | due nuclei leggeri si uniscono |
| Esempio | ${}^{235}_{\ 92}\mathrm{U} + {}^{1}_{0}n \longrightarrow {}^{141}_{\ 56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^{1}_{0}n$ | ${}^{2}_{1}\mathrm{H} + {}^{3}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + {}^{1}_{0}n$ |
| Energia di una reazione | circa $200\,\text{MeV}$ | $17{,}6\,\text{MeV}$ |
| Energia per grammo | circa $7 \cdot 10^{10}\,\text{J}$ | circa $3 \cdot 10^{11}\,\text{J}$ |
| Come si innesca | con un neutrone lento | con temperature di milioni di gradi |
| Dove avviene | centrali nucleari, bombe atomiche | stelle, bombe all'idrogeno |

Reazione a catena: i neutroni liberati da una fissione provocano altre fissioni. Se ogni fissione ne provoca in media una, la reazione è controllata (reattore); se più di una, è incontrollata (bomba); se meno di una, si spegne. Massa critica: la massa minima perché la reazione si mantenga.

Nel Sole: $4\,{}^{1}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + 2\,{}^{\ 0}_{+1}e$.

```ad-warning
Unità nel calcolo dell'energia
La massa va in kilogrammi e la velocità della luce va al quadrato: solo così l'energia è in joule.
```

```ad-warning
La massa non si conserva
Nelle reazioni nucleari si conserva il numero di nucleoni, non la massa: la massa che manca è l'energia liberata.
```

```ad-warning
Energia di legame alta
Un'energia di legame per nucleone alta indica un nucleo stabile, da cui non si ricava energia: il ferro non dà energia né per fissione né per fusione.
```
