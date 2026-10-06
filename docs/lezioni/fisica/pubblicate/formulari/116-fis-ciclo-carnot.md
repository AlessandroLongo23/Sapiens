# Formulario: Il teorema di Carnot e il ciclo di Carnot

## Reversibile e irreversibile

- Reversibile: si può percorrere al contrario riportando sistema e ambiente allo stato iniziale. Deve essere quasistatica, senza attriti, con scambi di calore solo tra corpi alla stessa temperatura.
- Irreversibile: tutte le trasformazioni reali (attrito, calore tra temperature diverse, espansioni brusche).
- Macchina reversibile: il suo ciclo è fatto solo di trasformazioni reversibili.

## Il teorema di Carnot

Tra le stesse due temperature tutte le macchine reversibili hanno lo stesso rendimento, e nessun'altra macchina lo supera:

$$\eta \le \eta_{rev}$$

## Il rendimento di una macchina reversibile

$$\eta_{rev} = 1 - \frac{T_f}{T_c}$$

con le temperature in kelvin ($T = t + 273$). Per una macchina reversibile

$$\frac{Q_f}{Q_c} = \frac{T_f}{T_c}$$

- Esempio: tra $500\,\text{K}$ e $300\,\text{K}$, $\eta_{rev} = 1 - 300/500 = 0{,}400$.

| Si cerca | Formula |
|---|---|
| il lavoro | $W = \eta_{rev}\,Q_c$ |
| il calore ceduto | $Q_f = Q_c\,\dfrac{T_f}{T_c}$ |
| la temperatura calda | $T_c = \dfrac{T_f}{1 - \eta_{rev}}$ |
| la temperatura fredda | $T_f = (1 - \eta_{rev})\,T_c$ |

## Una macchina può esistere?

1. Calcola $\eta = W / Q_c$ dai dati della macchina.
2. Calcola $\eta_{rev} = 1 - T_f / T_c$ dalle temperature in kelvin.
3. Se $\eta > \eta_{rev}$ la macchina non può esistere; se $\eta < \eta_{rev}$ è irreversibile; se $\eta = \eta_{rev}$ è reversibile.

## Il ciclo di Carnot

| Tratto | Trasformazione | Che cosa succede |
|---|---|---|
| $A \to B$ | espansione isoterma a $T_c$ | assorbe $Q_c$ |
| $B \to C$ | espansione adiabatica | si raffredda da $T_c$ a $T_f$ |
| $C \to D$ | compressione isoterma a $T_f$ | cede $Q_f$ |
| $D \to A$ | compressione adiabatica | si riscalda da $T_f$ a $T_c$ |

```tikz
% nome: ciclo-carnot-piano-pv
% alt: Il ciclo di Carnot nel piano pressione-volume, percorso in senso orario tra quattro stati. Da A a B un'isoterma alla temperatura Tc, lungo la quale entra il calore Qc; da B a C un'adiabatica più ripida che scende fino all'isoterma inferiore; da C a D l'isoterma alla temperatura Tf, lungo la quale esce il calore Qf; da D ad A un'altra adiabatica che risale. L'area racchiusa, colorata, è il lavoro W
% svg: ciclo-carnot-piano-pv-6baa6312.svg 273x233
% poi-interattivo: cambiare le due temperature e vedere come cambia l'area del ciclo
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (6,5);
\draw[->] (-0.3,0) -- (6.3,0) node[right] {$V$};
\draw[->] (0,-0.3) -- (0,5.3) node[above] {$p$};
\fill[blue!10] plot[domain=1:2.5, samples=25] (\x,{4.5/\x}) -- plot[domain=2.5:5.379, samples=30] (\x,{1.8*pow(2.5/\x,1.6667)}) -- plot[domain=5.379:2.152, samples=30] (\x,{2.7/\x}) -- plot[domain=2.152:1, samples=30] (\x,{4.5*pow(1/\x,1.6667)}) -- cycle;
\draw[thin, dashed, red!70!black] plot[domain=0.9:6, samples=40] (\x,{4.5/\x});
\draw[thin, dashed, blue!70!black] plot[domain=0.55:6, samples=40] (\x,{2.7/\x});
\draw[thick, domain=1:2.5, samples=25] plot (\x,{4.5/\x});
\draw[thick, domain=2.5:5.379, samples=30] plot (\x,{1.8*pow(2.5/\x,1.6667)});
\draw[thick, domain=2.152:5.379, samples=30] plot (\x,{2.7/\x});
\draw[thick, domain=1:2.152, samples=30] plot (\x,{4.5*pow(1/\x,1.6667)});
\draw[-{Stealth}, thick] (1.6,2.813) -- (1.65,2.727);
\draw[-{Stealth}, thick] (3.6,0.980) -- (3.7,0.936);
\draw[-{Stealth}, thick] (3.8,0.711) -- (3.7,0.730);
\draw[-{Stealth}, thick] (1.5,2.290) -- (1.46,2.395);
\fill (1,4.5) circle (1.5pt) node[left] {$A$};
\fill (2.5,1.8) circle (1.5pt) node[above right] {$B$};
\fill (5.379,0.502) circle (1.5pt) node[below] {$C$};
\fill (2.152,1.255) circle (1.5pt) node[below left] {$D$};
\draw[-{Stealth}, thick, orange!90!black] (2.5,3.8) -- (1.8,2.95);
\node[right] at (2.5,3.8) {$Q_c$};
\draw[-{Stealth}, thick, orange!90!black] (3.3,0.7) -- (2.9,0.15);
\node[right] at (3.15,0.35) {$Q_f$};
\node at (2.45,1.5) {$W$};
\node[above, red!70!black] at (5.7,0.8) {\small $T_c$};
\node[right, blue!70!black] at (6,0.45) {\small $T_f$};
\end{tikzpicture}
```

Calore assorbito lungo l'isoterma $AB$, per $n$ moli:

$$Q_c = n R\,T_c \ln\frac{V_B}{V_A}$$

## Il ciclo Otto

Due adiabatiche e due trasformazioni a volume costante; con il rapporto di compressione $r = V_A / V_B$:

$$\eta = 1 - \frac{1}{r^{\gamma - 1}}$$

```ad-warning
Le temperature vanno in kelvin
Con i gradi Celsius il rapporto $T_f / T_c$ è sbagliato: prima si aggiunge $273$.
```

```ad-warning
Il rendimento di Carnot è un massimo
Il rendimento di una macchina reale è $W / Q_c$; $1 - T_f / T_c$ è il tetto con cui confrontarlo.
```
