# Formulario: Le formule di Lewis delle molecole

## Che cosa mostra

- Formula di Lewis: i simboli degli atomi con tutti gli elettroni di valenza, a coppie.
- Coppia di legame: condivisa tra due atomi, un trattino. Due trattini sono un legame doppio, tre un triplo.
- Coppia solitaria: appartiene a un solo atomo, due puntini.
- Una coppia di legame conta per l'ottetto di tutti e due gli atomi; nel totale conta $2$ una volta sola.

## Il procedimento

1. Conta gli elettroni di valenza; per uno ione aggiungi un elettrone per ogni carica negativa, togline uno per ogni carica positiva.
2. Scheletro: al centro l'atomo meno elettronegativo (mai l'idrogeno), legami semplici con gli atomi esterni.
3. Togli $2$ elettroni per ogni legame.
4. Completa l'ottetto degli atomi esterni con coppie solitarie.
5. Gli elettroni che avanzano vanno sull'atomo centrale.
6. Se l'atomo centrale non ha l'ottetto, una coppia solitaria di un atomo esterno diventa un legame in più.

Controllo: $8$ elettroni intorno a ogni atomo, $2$ intorno all'idrogeno, e il totale uguale a quello del passo 1.

Per le molecole semplici si arriva alla stessa formula dando a ogni atomo i legami che gli servono: $8$ meno i suoi elettroni di valenza, uno solo per l'idrogeno.

Negli ossiacidi l'idrogeno è legato a un ossigeno, non all'atomo centrale: lo scheletro è idrogeno, ossigeno, atomo centrale.

Quanti legami servono, se tutti gli atomi rispettano l'ottetto:

$$\text{coppie di legame} = \frac{\text{elettroni per gli ottetti} - \text{elettroni di valenza}}{2}$$

Per $\mathrm{CO_2}$: $(3 \cdot 8 - 16) : 2 = 4$.

## Ioni poliatomici

La carica entra nel conto degli elettroni, e la formula si chiude tra parentesi quadre con la carica in alto a destra. $\mathrm{CN^-}$: $4 + 5 + 1 = 10$ elettroni. $\mathrm{NH_4^+}$: $5 + 4 - 1 = 8$ elettroni.

## Carica formale

$$\text{carica formale} = \text{elettroni di valenza} - \text{elettroni delle coppie solitarie} - \text{numero di legami}$$

- Un legame doppio conta per due, un triplo per tre.
- La somma delle cariche formali è la carica della specie.
- La formula migliore ha le cariche formali più vicine a zero, e quelle negative sugli atomi più elettronegativi.

In $\mathrm{CN^-}$: carbonio $4 - 2 - 3 = -1$, azoto $5 - 2 - 3 = 0$.

## Risonanza

Quando più formule differiscono solo per la posizione degli elettroni, si scrivono tutte, separate da una freccia a due punte: sono le formule limite. La molecola reale è l'ibrido di risonanza, con legami uguali tra loro. Esempi: $\mathrm{SO_3}$, $\mathrm{O_3}$, $\mathrm{CO_3^{2-}}$, $\mathrm{NO_3^-}$.

```tikz
% nome: formule-lewis-triossido-zolfo-risonanza
% alt: Tre formule di Lewis del triossido di zolfo, separate da frecce a due punte. In ognuna lo zolfo è al centro di tre ossigeni: uno è unito da un doppio legame e ha due coppie solitarie, gli altri due da legami semplici e ne hanno tre. Il doppio legame è su un ossigeno diverso in ciascuna formula
% svg: formule-lewis-triossido-zolfo-risonanza-5c698fce.svg 349x85
\begin{tikzpicture}
\node at (0,0) {S};
\node at (0,1) {O};
\node at (-0.87,-0.5) {O};
\node at (0.87,-0.5) {O};
\node at (3.4,0) {S};
\node at (3.4,1) {O};
\node at (2.53,-0.5) {O};
\node at (4.27,-0.5) {O};
\node at (6.8,0) {S};
\node at (6.8,1) {O};
\node at (5.93,-0.5) {O};
\node at (7.67,-0.5) {O};
\draw[{Stealth}-{Stealth}, thick] (1.35,0) -- (2.05,0);
\draw[{Stealth}-{Stealth}, thick] (4.75,0) -- (5.45,0);
\foreach \a/\b/\c/\d in {0.06/0.27/0.06/0.73, -0.05/0.27/-0.05/0.73, -0.23/-0.14/-0.63/-0.37, 0.23/-0.14/0.63/-0.37, 3.4/0.27/3.4/0.73, 3.14/-0.09/2.74/-0.32, 3.19/-0.18/2.8/-0.41, 3.63/-0.14/4.03/-0.37, 6.8/0.27/6.8/0.73, 6.57/-0.14/6.17/-0.37, 7.01/-0.18/7.4/-0.41, 7.06/-0.09/7.46/-0.32} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {0.3/0.93, 0.3/1.07, -0.3/1.07, -0.3/0.93, -0.95/-0.2, -1.08/-0.28, -1.16/-0.59, -1.09/-0.71, -0.78/-0.8, -0.65/-0.72, 0.65/-0.72, 0.78/-0.8, 1.09/-0.71, 1.16/-0.59, 1.08/-0.28, 0.95/-0.2, 3.7/0.93, 3.7/1.07, 3.48/1.3, 3.32/1.3, 3.1/1.07, 3.1/0.93, 2.45/-0.2, 2.32/-0.28, 2.62/-0.8, 2.75/-0.72, 4.05/-0.72, 4.18/-0.8, 4.49/-0.71, 4.56/-0.59, 4.48/-0.28, 4.35/-0.2, 7.1/0.93, 7.1/1.07, 6.88/1.3, 6.72/1.3, 6.5/1.07, 6.5/0.93, 5.85/-0.2, 5.72/-0.28, 5.64/-0.59, 5.71/-0.71, 6.02/-0.8, 6.15/-0.72, 7.45/-0.72, 7.58/-0.8, 7.88/-0.28, 7.75/-0.2} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

## Eccezioni all'ottetto

| Eccezione | Esempio | Elettroni intorno all'atomo centrale |
|---|---|---|
| Ottetto incompleto | $\mathrm{BF_3}$ | $6$ |
| Numero dispari di elettroni | $\mathrm{NO}$ ($11$ elettroni) | un elettrone spaiato |
| Ottetto espanso, dal terzo periodo in poi | $\mathrm{PCl_5}$, $\mathrm{SF_6}$ | $10$, $12$ |

$\mathrm{H_2SO_4}$, $\mathrm{SO_4^{2-}}$, $\mathrm{SO_3}$, $\mathrm{HClO_4}$: due formule in uso, con l'ottetto (legami semplici e cariche formali) o con l'ottetto espanso (doppi legami, cariche formali nulle).

## Le formule da ricordare

| Specie | Elettroni di valenza | Legami dell'atomo centrale | Coppie solitarie dell'atomo centrale |
|---|---|---|---|
| $\mathrm{CH_4}$ | $8$ | quattro semplici | $0$ |
| $\mathrm{NH_3}$ | $8$ | tre semplici | $1$ |
| $\mathrm{H_2O}$ | $8$ | due semplici | $2$ |
| $\mathrm{CO_2}$ | $16$ | due doppi | $0$ |
| $\mathrm{BF_3}$ | $24$ | tre semplici | $0$ |
| $\mathrm{SO_3}$ | $24$ | un doppio e due semplici | $0$ |
| $\mathrm{SO_4^{2-}}$ | $32$ | quattro semplici | $0$ |

```ad-warning
Errori che costano
Dimenticare la carica nel conto degli elettroni di uno ione. Aggiungere puntini per completare un ottetto: gli elettroni sono quelli contati. Dare più di otto elettroni a un atomo del secondo periodo.
```
