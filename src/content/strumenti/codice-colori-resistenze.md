# Codice colori delle resistenze

## Che cos'è

Il codice colori è il modo in cui il valore di un resistore è scritto sul suo corpo: ogni banda colorata è una cifra, un moltiplicatore o la tolleranza.

Ogni colore vale una cifra da 0 a 9: nero 0, marrone 1, rosso 2, arancione 3, giallo 4, verde 5, blu 6, viola 7, grigio 8, bianco 9. Come moltiplicatore, oro vale 0,1 e argento 0,01.

## Come si legge a mano

Tieni a destra la banda della tolleranza, che è un po' staccata dalle altre ed è spesso oro o argento. Poi leggi da sinistra.

Con 4 bande le prime due sono le cifre, la terza è il moltiplicatore, cioè la potenza di 10, e la quarta è la tolleranza. Con 5 bande le cifre sono tre.

```ad-example
Giallo, viola, rosso, oro
Giallo è 4, viola è 7, rosso come moltiplicatore è $10^2$, oro è $\pm 5\%$.

$$\begin{aligned}
R &= 47 \cdot 10^2\ \Omega \\[6pt]
&= 4700\ \Omega = 4{,}7\ \text{k}\Omega
\end{aligned}$$
```

La tolleranza dice di quanto il valore vero può essere diverso da quello scritto. Il 5% di 4700 Ω è 235 Ω, quindi la resistenza vera sta tra 4465 Ω e 4935 Ω.

Per fare il contrario, dal valore ai colori, scrivi il valore in ohm come cifre per una potenza di 10: $220\ \Omega = 22 \cdot 10^1\ \Omega$, cioè rosso, rosso, marrone.

```ad-error
Errori frequenti
- Leggere la resistenza al contrario: la prima banda non è mai nera, oro o argento.
- Prendere il moltiplicatore per una cifra: con 4 bande la terza banda dice quanti zeri aggiungere.
```

## Domande frequenti

### Come ricordo i colori?

Dopo nero e marrone, da rosso a viola i colori seguono l'ordine dell'arcobaleno; poi vengono grigio e bianco.

### E se le bande sono solo tre?

Manca la banda della tolleranza: vuol dire $\pm 20\%$. Le prime due bande sono le cifre e la terza è il moltiplicatore, come con 4 bande.

### Perché non trovo resistori da 4500 Ω?

I resistori si fabbricano in serie di valori standard, come la serie E12 (10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82) moltiplicati per le potenze di 10. Per 4500 Ω si prende il valore standard più vicino, 4,7 kΩ.
