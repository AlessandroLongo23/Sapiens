# Quartili e box plot

## Che cosa sono

I quartili sono i tre valori che dividono i dati ordinati in quattro parti con lo stesso numero di dati. Il secondo quartile $Q_2$ è la mediana; il primo $Q_1$ lascia sotto di sé circa un quarto dei dati, il terzo $Q_3$ circa tre quarti.

Lo scarto interquartile è $Q_3 - Q_1$: la larghezza dell'intervallo in cui sta la metà centrale dei dati. Il box plot li disegna insieme al minimo e al massimo: una scatola da $Q_1$ a $Q_3$ con una linea sulla mediana, e due baffi fino ai dati estremi.

## Come si calcola a mano

```ad-example
Undici dati
I dati ordinati sono $6$, $7$, $15$, $36$, $39$, $40$, $41$, $42$, $43$, $47$, $49$. Sono $11$: la mediana è il sesto, $40$.

La metà prima della mediana è $6$, $7$, $15$, $36$, $39$, e la sua mediana è $Q_1 = 15$. La metà dopo è $41$, $42$, $43$, $47$, $49$, e la sua mediana è $Q_3 = 43$.

$$\begin{aligned}
Q_3 - Q_1 &= 43 - 15 \\[6pt]
&= 28
\end{aligned}$$
```

La regola:

1. metti i dati in ordine e trova la mediana;
2. dividi i dati in due metà: con un numero dispari di dati la mediana resta fuori da tutte e due;
3. $Q_1$ è la mediana della prima metà, $Q_3$ la mediana della seconda.

Questo è il metodo dei libri delle superiori. Calcolatrici e fogli di calcolo usano altre regole, con posizioni frazionarie tra un dato e l'altro, e possono dare quartili un po' diversi.

```ad-error
Errori frequenti
- Cercare i quartili nei dati non ordinati.
- Mettere la mediana in una delle due metà quando i dati sono dispari.
- Scambiare lo scarto interquartile con il campo di variazione, che è massimo meno minimo.
```

## Domande frequenti

### A che cosa serve lo scarto interquartile?

Misura quanto sono sparsi i dati senza farsi influenzare dai valori estremi. Un dato anomalo, come un $200$ in mezzo a numeri vicini a $40$, cambia molto il campo di variazione e quasi per niente lo scarto interquartile.

### Perché Excel dà un risultato diverso?

La funzione QUARTILE di Excel interpola tra le posizioni dei dati invece di prendere le mediane delle due metà. Con molti dati la differenza è piccola; con pochi dati si nota. A scuola si usa il metodo delle due metà.
