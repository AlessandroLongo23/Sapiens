# Legge di Ohm

## Che cos'è

La prima legge di Ohm dice che in un conduttore la tensione ai capi è proporzionale all'intensità della corrente che lo attraversa.

La costante di proporzionalità è la resistenza del conduttore. Più è grande, più tensione serve per far passare la stessa corrente.

## Come si calcola a mano

Con $V$ la tensione in volt, $R$ la resistenza in ohm e $I$ l'intensità di corrente in ampere:

$$V = R \cdot I$$

Alcuni libri scrivono $\Delta V = R \cdot i$: è la stessa legge. Dalla formula si ricavano le altre due:

$$R = \dfrac{V}{I} \qquad I = \dfrac{V}{R}$$

```ad-example
La corrente in un resistore
Un resistore da 240 Ω è collegato a una pila da 12 V. Dividi la tensione per la resistenza:

$$\begin{aligned}
I &= \dfrac{12\ \text{V}}{240\ \Omega} \\[6pt]
&= 0{,}05\ \text{A} = 50\ \text{mA}
\end{aligned}$$
```

Prima di sostituire, porta i dati in volt, ohm e ampere: $1\ \text{k}\Omega = 1000\ \Omega$ e $1\ \text{mA} = 0{,}001\ \text{A}$.

## La potenza

La potenza elettrica dissipata nel resistore è il prodotto di tensione e corrente, e si misura in watt:

$$P = V \cdot I$$

```ad-example
La potenza dello stesso resistore
$$P = 12\ \text{V} \cdot 0{,}05\ \text{A} = 0{,}6\ \text{W}$$
```

Usando la legge di Ohm la potenza si può scrivere anche come $P = R I^2$ oppure $P = V^2 / R$.

```ad-error
Errori frequenti
- Lasciare la resistenza in kΩ o la corrente in mA: il risultato viene mille volte sbagliato.
- Moltiplicare tensione e resistenza per trovare la corrente: si divide.
- Applicare la legge a una lampadina a incandescenza come se la resistenza fosse costante: scaldandosi, il filamento cambia resistenza.
```

## Domande frequenti

### Che cosa dice la seconda legge di Ohm?

Dice da che cosa dipende la resistenza di un filo: $R = \rho \dfrac{\ell}{S}$, con $\rho$ la resistività del materiale, $\ell$ la lunghezza e $S$ l'area della sezione.

### Vale per tutti i componenti?

No. Vale per i conduttori detti ohmici, come i resistori e i fili metallici a temperatura costante. Un diodo o un LED non la seguono.
