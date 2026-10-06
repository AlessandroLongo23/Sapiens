# Formulario: Affinità elettronica ed elettronegatività

## Affinità elettronica

Energia che un atomo isolato, allo stato gassoso, libera quando acquista un elettrone, in $\text{kJ/mol}$:

$$\mathrm{X}(g) + e^- \to \mathrm{X^-}(g) + \text{energia}$$

- Lungo un periodo, verso destra: cresce, fino al gruppo $17$.
- Lungo un gruppo, verso il basso: tende a diminuire, con eccezioni.
- Le più alte: gli alogeni. La più alta di tutte: il cloro, $349\,\text{kJ/mol}$ (il fluoro $328$).
- Non liberano energia (anione non stabile): gas nobili, berillio, magnesio, azoto.

| | $\mathrm{Na}$ | $\mathrm{Cl}$ |
|---|---|---|
| Energia di prima ionizzazione ($\text{kJ/mol}$) | $495{,}8$ | $1251$ |
| Affinità elettronica ($\text{kJ/mol}$) | $53$ | $349$ |

Trasferire una mole di elettroni dal sodio al cloro, tra atomi isolati: $495{,}8 - 349 = 146{,}8\,\text{kJ}$ da spendere.

## Elettronegatività

Tendenza di un atomo ad attirare verso di sé gli elettroni di un legame. Simbolo $\chi$, numero senza unità, scala di Pauling.

- Lungo un periodo, verso destra: aumenta.
- Lungo un gruppo, verso il basso: diminuisce.
- I più elettronegativi: $\mathrm{F}$ ($3{,}98$), $\mathrm{O}$ ($3{,}44$), $\mathrm{Cl}$ ($3{,}16$), $\mathrm{N}$ ($3{,}04$). Il meno elettronegativo tra gli elementi comuni: $\mathrm{Cs}$ ($0{,}79$).
- Idrogeno $2{,}20$, carbonio $2{,}55$.

```tikz
% nome: elettronegativita-scala-pauling
% alt: I valori di elettronegatività di Pauling per l'idrogeno e per gli elementi dei gruppi 1, 2, 13, 14, 15, 16 e 17 dal secondo al quinto periodo, in una griglia con il colore delle caselle più intenso dove il valore è più alto. Idrogeno 2,20. Secondo periodo: litio 0,98, berillio 1,57, boro 2,04, carbonio 2,55, azoto 3,04, ossigeno 3,44, fluoro 3,98. Terzo: sodio 0,93, magnesio 1,31, alluminio 1,61, silicio 1,90, fosforo 2,19, zolfo 2,58, cloro 3,16. Quarto: potassio 0,82, calcio 1,00, gallio 1,81, germanio 2,01, arsenico 2,18, selenio 2,55, bromo 2,96. Quinto: rubidio 0,82, stronzio 0,95, indio 1,78, stagno 1,96, antimonio 2,05, tellurio 2,10, iodio 2,66
\begin{tikzpicture}[x=1.12cm, y=0.95cm]
\foreach \g/\n in {1/1,2/2,3/13,4/14,5/15,6/16,7/17} \node at (\g,-0.25) {\scriptsize \n};
\foreach \g/\p/\s/\c/\k in {1/1/H/{2,20}/32, 1/2/Li/{0,98}/6, 2/2/Be/{1,57}/18, 3/2/B/{2,04}/28, 4/2/C/{2,55}/39, 5/2/N/{3,04}/50, 6/2/O/{3,44}/58, 7/2/F/{3,98}/70, 1/3/Na/{0,93}/5, 2/3/Mg/{1,31}/13, 3/3/Al/{1,61}/19, 4/3/Si/{1,90}/25, 5/3/P/{2,19}/32, 6/3/S/{2,58}/40, 7/3/Cl/{3,16}/52, 1/4/K/{0,82}/3, 2/4/Ca/{1,00}/6, 3/4/Ga/{1,81}/24, 4/4/Ge/{2,01}/28, 5/4/As/{2,18}/31, 6/4/Se/{2,55}/39, 7/4/Br/{2,96}/48, 1/5/Rb/{0,82}/3, 2/5/Sr/{0,95}/5, 3/5/In/{1,78}/23, 4/5/Sn/{1,96}/27, 5/5/Sb/{2,05}/29, 6/5/Te/{2,10}/30, 7/5/I/{2,66}/42} {
\draw[thin, fill=blue!\k] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p+0.2) {\small \s};
\node at (\g,-\p-0.2) {\scriptsize \c};
}
\end{tikzpicture}
```

## Differenza di elettronegatività

$$\Delta\chi = \chi_{\text{maggiore}} - \chi_{\text{minore}}$$

L'atomo con $\chi$ maggiore prende la carica parziale $\delta^-$, l'altro la $\delta^+$.

$\mathrm{H{-}Cl}$: $\Delta\chi = 3{,}16 - 2{,}20 = 0{,}96$, con $\delta^-$ sul cloro.

## Le quattro proprietà periodiche

| Proprietà | Lungo un periodo, verso destra | Lungo un gruppo, verso il basso |
|---|---|---|
| Raggio atomico | diminuisce | aumenta |
| Energia di ionizzazione | aumenta | diminuisce |
| Affinità elettronica | aumenta, fino al gruppo $17$ | tende a diminuire |
| Elettronegatività | aumenta | diminuisce |

```ad-warning
Affinità elettronica ed elettronegatività
La prima è un'energia in $\text{kJ/mol}$ di un atomo isolato; la seconda è un numero senza unità di un atomo legato.
```

```ad-warning
Cloro e fluoro
L'affinità elettronica più alta è del cloro; l'elemento più elettronegativo è il fluoro.
```

```ad-warning
Elementi in diagonale
Se un elemento è più a destra ma più in basso dell'altro, la posizione non decide: servono i valori di $\chi$.
```
