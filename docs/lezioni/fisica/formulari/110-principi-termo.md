# Formulario: Il primo principio della termodinamica

## Enunciato

La variazione dell'energia interna è il calore assorbito meno il lavoro compiuto dal sistema:

$$\Delta U = Q - W \qquad \Delta U = U_f - U_i$$

Forme equivalenti: $Q = \Delta U + W$ e $W = Q - \Delta U$. Tutte le grandezze in joule ($1\,\text{cal} = 4{,}186\,\text{J}$).

## Segni

| Grandezza | Positiva | Negativa |
|---|---|---|
| $Q$ | calore assorbito dal sistema | calore ceduto dal sistema |
| $W$ | lavoro compiuto dal sistema (espansione) | lavoro compiuto sul sistema (compressione) |
| $\Delta U$ | l'energia interna aumenta | l'energia interna diminuisce |

Esempio: lavoro di $350\,\text{J}$ sul gas, $120\,\text{J}$ di calore ceduti: $\Delta U = -120\,\text{J} - (-350\,\text{J}) = 230\,\text{J}$.

## Funzioni di stato e scambi

- $U$ è una funzione di stato: $\Delta U$ dipende solo dallo stato iniziale e da quello finale.
- $Q$ e $W$ dipendono dal cammino; la loro differenza $Q - W$ no.
- Per un gas a pressione costante $W = p\,\Delta V$.
- Per un gas perfetto monoatomico $\Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$, con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$.

## Procedimento

1. Scegli il sistema.
2. Dai i segni a $Q$ e a $W$.
3. Porta tutto in joule; se serve calcola $W = p\,\Delta V$.
4. Scrivi $\Delta U = Q - W$ e ricava la grandezza che manca.
5. Controlla il segno del risultato.

## Casi semplici

| Situazione | Che cosa è zero | Il principio diventa |
|---|---|---|
| sistema isolato | $Q = 0$ e $W = 0$ | $\Delta U = 0$ |
| volume costante | $W = 0$ | $\Delta U = Q$ |
| nessuno scambio di calore (adiabatica) | $Q = 0$ | $\Delta U = -W$ |
| trasformazione ciclica | $\Delta U = 0$ | $Q = W$ |

Il moto perpetuo di prima specie (lavoro senza assorbire energia) è impossibile.

```ad-warning
Il lavoro fatto sul gas ha il segno meno
"Si compie sul gas un lavoro di $350\,\text{J}$" vuol dire $W = -350\,\text{J}$.
```

```ad-warning
La temperatura segue l'energia interna, non il calore
Un gas che assorbe calore può anche raffreddarsi, se compie più lavoro del calore che riceve.
```

```ad-warning
Un'altra convenzione
Dove $W$ è il lavoro compiuto sul sistema (libri di chimica) il principio si scrive $\Delta U = Q + W$.
```
