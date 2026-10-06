# Formulario: Energia di legame e regola dell'ottetto

## Perché gli atomi si legano

- Legame chimico: la forza che tiene uniti due atomi. Si forma perché gli atomi legati hanno meno energia degli atomi separati.
- Meno energia vuol dire più stabilità.
- I legami li fanno gli elettroni di valenza.

## La curva dell'energia

```tikz
% nome: energia-legame-curva-idrogeno
% alt: Grafico dell'energia di due atomi di idrogeno in funzione della distanza tra i nuclei. A grande distanza la curva è sullo zero. Avvicinando gli atomi la curva scende fino a un minimo a 74 picometri, dove l'energia vale meno 436 chilojoule per mole, poi risale ripida e supera lo zero quando i nuclei sono troppo vicini. Una freccia verticale dal minimo allo zero indica l'energia di legame, una linea tratteggiata verticale la lunghezza di legame
% svg: energia-legame-curva-idrogeno-7801ca8c.svg 330x210
\begin{tikzpicture}
\draw[->] (0,0) -- (6.6,0) node[below] {\small distanza};
\draw[->] (0,-2.7) -- (0,2.2) node[above] {\small energia (kJ/mol)};
\node[left] at (0,0) {\small $0$};
\draw[thick, blue, domain=0.66:6.3, samples=80, smooth] plot (\x, {2.18*((1-exp(-0.97*(\x-1.48)))^2-1)});
\draw[thin, dashed] (1.48,0) -- (1.48,-2.18);
\draw[thin, dashed] (0,-2.18) -- (1.48,-2.18);
\fill[red] (1.48,-2.18) circle (2pt);
\node[above] at (1.48,0) {\small $74$ pm};
\node[left] at (0,-2.18) {\small $-436$};
\draw[{Stealth}-{Stealth}, thick, orange!90!black] (2.6,-2.18) -- (2.6,0);
\draw[thin, dashed] (1.48,-2.18) -- (2.6,-2.18);
\node[right] at (2.65,-1.65) {\small energia di legame};
\node[right] at (2.65,-2.05) {\small $436$ kJ/mol};
\node[right] at (0.85,1.6) {\small nuclei troppo vicini};
\node at (4.6,0.35) {\small atomi lontani};
\end{tikzpicture}
```

- Atomi lontani: energia zero.
- Avvicinandoli: prevale l'attrazione, l'energia scende.
- Minimo: gli atomi sono legati. Per $\mathrm{H_2}$: $74\,\text{pm}$ e $-436\,\text{kJ/mol}$.
- Troppo vicini: i nuclei si respingono, l'energia risale.

## Lunghezza ed energia di legame

- Lunghezza di legame: la distanza tra i nuclei dei due atomi legati, in pm ($1\,\text{pm} = 10^{-12}\,\text{m}$).
- Energia di legame: l'energia da fornire per rompere una mole di legami, in $\text{kJ/mol}$. Più è grande, più il legame è forte.

| Legame | Lunghezza (pm) | Energia (kJ/mol) |
|---|---|---|
| $\mathrm{H{-}H}$ | $74$ | $436$ |
| $\mathrm{F{-}F}$ | $141$ | $159$ |
| $\mathrm{Cl{-}Cl}$ | $199$ | $243$ |
| $\mathrm{Br{-}Br}$ | $228$ | $193$ |
| $\mathrm{I{-}I}$ | $267$ | $151$ |
| $\mathrm{H{-}F}$ | $92$ | $567$ |
| $\mathrm{H{-}Cl}$ | $127$ | $431$ |
| $\mathrm{H{-}Br}$ | $141$ | $366$ |
| $\mathrm{H{-}I}$ | $161$ | $298$ |

Energia per rompere $n$ moli di legami:

$$E = n \cdot E_{\text{legame}}$$

Energia di un solo legame: l'energia di legame, in joule, divisa per $6{,}022 \cdot 10^{23}$. Per $\mathrm{H{-}H}$: $7{,}24 \cdot 10^{-19}\,\text{J}$.

## Bilancio di energia di una reazione

1. Somma le energie dei legami che si rompono: è l'energia assorbita.
2. Somma le energie dei legami che si formano: è l'energia ceduta.
3. Se la ceduta è maggiore dell'assorbita, la reazione cede la differenza all'ambiente; altrimenti la assorbe.

$\mathrm{H_2} + \mathrm{Cl_2} \to 2\,\mathrm{HCl}$: assorbiti $436 + 243 = 679\,\text{kJ}$, ceduti $2 \cdot 431 = 862\,\text{kJ}$, la reazione cede $183\,\text{kJ}$.

## Gas nobili e regola dell'ottetto

- Gas nobili: livello più esterno completo, $2$ elettroni per l'elio e $8$ per gli altri ($ns^2\,np^6$). Non si legano.
- Ottetto: gli otto elettroni del livello più esterno.
- Regola dell'ottetto: un atomo tende a cedere, acquistare o mettere in comune elettroni fino ad avere otto elettroni nel livello più esterno, come il gas nobile più vicino.

| Strada | Chi la prende | Esempio | Legame |
|---|---|---|---|
| cedere elettroni | metalli, pochi elettroni di valenza | $\mathrm{Na} \to \mathrm{Na^+}$, come il neon | ionico |
| acquistare elettroni | non metalli, mancano pochi elettroni | $\mathrm{Cl} \to \mathrm{Cl^-}$, come l'argon | ionico |
| mettere in comune | non metalli tra loro | $\mathrm{Cl_2}$ | covalente |

Elettroni che mancano all'ottetto: $8 - \text{elettroni di valenza}$. Per l'idrogeno il livello completo ha $2$ elettroni (duetto).

## Limiti della regola

- Idrogeno, litio, berillio: arrivano a $2$ elettroni, come l'elio.
- Meno di otto: il boro in $\mathrm{BF_3}$ ne ha $6$.
- Più di otto, dal terzo periodo: il fosforo in $\mathrm{PCl_5}$ ne ha $10$, lo zolfo in $\mathrm{SF_6}$ ne ha $12$.
- Numero dispari di elettroni: $\mathrm{NO}$.
- Metalli di transizione: $\mathrm{Fe^{2+}}$ e $\mathrm{Fe^{3+}}$.

```ad-warning
Rompere un legame assorbe energia
Per rompere un legame l'energia va sempre fornita; viene ceduta quando un legame si forma.
```

```ad-warning
L'ottetto è del livello più esterno
$\mathrm{Na^+}$ ha $10$ elettroni in tutto, $8$ nel livello più esterno; e resta sodio, con $11$ protoni.
```
