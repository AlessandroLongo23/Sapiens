# Formulario: Gli enunciati di Kelvin e di Clausius

## Il secondo principio

Il primo principio dice che l'energia si conserva, non in che verso avvengono gli scambi. Il verso lo fissa il secondo principio, in due enunciati equivalenti.

| Enunciato | È impossibile una trasformazione il cui unico risultato sia |
|---|---|
| di Clausius | far passare calore da un corpo più freddo a uno più caldo |
| di Kelvin | trasformare interamente in lavoro il calore prelevato da un'unica sorgente |

## Che cosa è vietato e che cosa no

- Vietato da Clausius: un frigorifero con $W = 0$. Un frigorifero vero riceve lavoro:

$$Q_c = Q_f + W$$

- Vietato da Kelvin: una macchina termica con $Q_f = 0$. Per ogni macchina termica

$$\eta = 1 - \frac{Q_f}{Q_c} < 1$$

- Permesso: un'espansione isoterma trasforma in lavoro tutto il calore assorbito ($Q = W$), ma non è l'unico risultato, perché il gas alla fine ha un volume diverso.
- Permesso: trasformare tutto il lavoro in calore (attrito).

## Il moto perpetuo

| | Che cosa dovrebbe fare | Principio violato |
|---|---|---|
| di prima specie | produrre lavoro senza ricevere energia | il primo |
| di seconda specie | produrre lavoro con il calore di una sola sorgente | il secondo (Kelvin) |

## Equivalenza dei due enunciati

- Se fosse falso Clausius: il dispositivo vietato riporta $Q_f$ alla sorgente calda; con una macchina termica, l'insieme prende $Q_c - Q_f$ da una sola sorgente e lo trasforma tutto in lavoro. Viola Kelvin.
- Se fosse falso Kelvin: la macchina vietata produce $W$ e aziona un frigorifero; l'insieme porta $Q_f$ dal freddo al caldo senza lavoro. Viola Clausius.

## Riconoscere che cosa viola un dispositivo

1. Bilancio dell'energia: $W = Q_c - Q_f$ per una macchina, $Q_c = Q_f + W$ per un frigorifero. Se non torna, viola il primo principio.
2. Se torna: calore di una sola sorgente tutto in lavoro viola Kelvin; calore dal freddo al caldo senza lavoro viola Clausius.

```ad-warning
Contano le parole "unico risultato"
Il frigorifero sposta calore dal freddo al caldo, ma assorbe lavoro; l'isoterma trasforma tutto il calore in lavoro, ma il gas cambia stato. Nessuno dei due viola il secondo principio.
```

```ad-warning
Un bilancio in pari non è una prova
Un dispositivo può conservare l'energia ed essere vietato lo stesso dal secondo principio.
```
