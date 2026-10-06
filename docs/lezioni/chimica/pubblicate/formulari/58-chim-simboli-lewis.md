# Formulario: Elettroni di valenza e simboli di Lewis

## Elettroni di valenza

Sono gli elettroni del livello più esterno (elementi dei gruppi principali). Dalla configurazione: si sommano gli elettroni dei sottolivelli con il valore più grande di $n$.

- Zolfo, $[\text{Ne}]\,3s^2\,3p^4$: $2 + 4 = 6$.
- Bromo, $[\text{Ar}]\,4s^2\,3d^{10}\,4p^5$: $2 + 5 = 7$. Il $3d^{10}$ è interno.

Dal gruppo: nei gruppi $1$ e $2$ il numero del gruppo, nei gruppi da $13$ a $18$ il numero del gruppo meno $10$.

| Gruppo | $1$ | $2$ | $13$ | $14$ | $15$ | $16$ | $17$ | $18$ |
|---|---|---|---|---|---|---|---|---|
| Numerazione tradizionale | IA | IIA | IIIA | IVA | VA | VIA | VIIA | VIIIA |
| Configurazione esterna | $ns^1$ | $ns^2$ | $ns^2\,np^1$ | $ns^2\,np^2$ | $ns^2\,np^3$ | $ns^2\,np^4$ | $ns^2\,np^5$ | $ns^2\,np^6$ |
| Elettroni di valenza | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ |

L'elio, nel gruppo $18$, ne ha $2$.

## Simbolo di Lewis

Il simbolo dell'elemento con un puntino per ogni elettrone di valenza.

1. Trova il numero di elettroni di valenza.
2. Quattro posti: sopra, a destra, sotto, a sinistra.
3. I primi quattro puntini uno per posto.
4. Dal quinto in poi un secondo puntino per posto: le coppie.

```tikz
% nome: lewis-ordine-puntini
% alt: Otto simboli di Lewis di un elemento generico X, con un numero di puntini che cresce da uno a otto. Con uno, due, tre e quattro puntini i puntini sono singoli, uno per lato: sopra, a destra, sotto, a sinistra. Con cinque puntini il lato sopra ha una coppia e gli altri tre lati un puntino; con sei ci sono due coppie e due puntini singoli; con sette tre coppie e un puntino singolo; con otto quattro coppie
% svg: lewis-ordine-puntini-1a88bbb8.svg 322x58
\begin{tikzpicture}
\node at (0,0) {X};
\node at (1.12,0) {X};
\node at (2.24,0) {X};
\node at (3.36,0) {X};
\node at (4.48,0) {X};
\node at (5.6,0) {X};
\node at (6.72,0) {X};
\node at (7.84,0) {X};
\foreach \x/\y in {0/0.34, 1.12/0.34, 1.42/0, 2.24/0.34, 2.54/0, 2.24/-0.34, 3.36/0.34, 3.66/0, 3.36/-0.34, 3.06/0, 4.4/0.34, 4.57/0.34, 4.78/0, 4.48/-0.34, 4.18/0, 5.52/0.34, 5.69/0.34, 5.9/-0.09, 5.9/0.09, 5.6/-0.34, 5.3/0, 6.64/0.34, 6.81/0.34, 7.02/-0.09, 7.02/0.09, 6.64/-0.34, 6.81/-0.34, 6.42/0, 7.76/0.34, 7.93/0.34, 8.14/-0.09, 8.14/0.09, 7.76/-0.34, 7.93/-0.34, 7.54/-0.09, 7.54/0.09} \fill (\x,\y) circle (1.1pt);
\node at (0,-0.85) {\small $1$};
\node at (1.12,-0.85) {\small $2$};
\node at (2.24,-0.85) {\small $3$};
\node at (3.36,-0.85) {\small $4$};
\node at (4.48,-0.85) {\small $5$};
\node at (5.6,-0.85) {\small $6$};
\node at (6.72,-0.85) {\small $7$};
\node at (7.84,-0.85) {\small $8$};
\end{tikzpicture}
```

- Elettrone spaiato: un puntino da solo su un lato.
- Coppia di elettroni (doppietto): due puntini sullo stesso lato.

## Ioni dei gruppi principali

| Gruppo | Elettroni di valenza | Che cosa fa l'atomo | Carica dello ione |
|---|---|---|---|
| $1$ | $1$ | perde $1$ elettrone | $+1$ |
| $2$ | $2$ | perde $2$ elettroni | $+2$ |
| $13$ | $3$ | perde $3$ elettroni | $+3$ |
| $15$ | $5$ | acquista $3$ elettroni | $-3$ |
| $16$ | $6$ | acquista $2$ elettroni | $-2$ |
| $17$ | $7$ | acquista $1$ elettrone | $-1$ |

- Lo ione ha la configurazione di un gas nobile: quello che precede l'elemento per i cationi, quello che chiude il periodo per gli anioni.
- Gruppo $14$ (carbonio, silicio) e gruppo $18$: di solito nessuno ione semplice.
- Simbolo di Lewis di un catione: il simbolo con la carica, senza puntini. Di un anione: otto puntini tra parentesi quadre, con la carica fuori.

```ad-warning
Tutto il livello esterno
Gli elettroni di valenza dello zolfo sono $6$, non i $4$ del solo $3p$.
```

```ad-warning
Il d pieno non conta
Per il bromo il $3d^{10}$ è interno: $7$ elettroni di valenza, non $17$.
```

```ad-warning
Il segno della carica
Chi acquista elettroni diventa negativo: lo zolfo forma $\mathrm{S^{2-}}$, non $\mathrm{S^{2+}}$.
```
