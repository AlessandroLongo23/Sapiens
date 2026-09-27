# Calcolo del fattoriale

## Che cos'è

Il fattoriale di un numero naturale $n$ è il prodotto di tutti i numeri interi da $n$ fino a $1$. Si scrive $n!$ e si legge "enne fattoriale".

Per esempio $4! = 4 \cdot 3 \cdot 2 \cdot 1 = 24$. Il fattoriale conta i modi di mettere in fila $n$ oggetti diversi: quattro libri su uno scaffale si possono ordinare in $24$ modi.

## Come si calcola a mano

```ad-example
Il fattoriale di 6
Moltiplica i numeri da $6$ a $1$, un fattore alla volta:

$$\begin{aligned}
6! &= 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 \\[6pt]
&= 30 \cdot 4 \cdot 3 \cdot 2 \cdot 1 \\[6pt]
&= 120 \cdot 3 \cdot 2 \cdot 1 \\[6pt]
&= 720
\end{aligned}$$
```

La regola generale:

$$n! = n \cdot (n - 1) \cdot (n - 2) \cdot \ldots \cdot 2 \cdot 1$$

Se conosci già il fattoriale del numero prima, basta una moltiplicazione, perché $n! = n \cdot (n - 1)!$. Da $6! = 720$ si ottiene subito $7! = 7 \cdot 720 = 5040$.

Il fattoriale cresce molto in fretta. $10!$ vale già $3\,628\,800$, $20!$ ha $19$ cifre e $52!$, i modi di mescolare un mazzo di carte francesi, ne ha $68$. Per questo la calcolatrice passa presto alla notazione scientifica, e questo strumento dà anche tutte le cifre.

```ad-error
Errori frequenti
- Dire che $0! = 0$: per definizione $0! = 1$.
- Fermarsi a $2$ o partire da $n - 1$: i fattori sono esattamente $n$, da $n$ fino a $1$.
- Semplificare $\dfrac{8!}{4!}$ come $2!$: si semplificano i fattori comuni, e resta $8 \cdot 7 \cdot 6 \cdot 5 = 1680$.
```

## Domande frequenti

### Perché 0! vale 1?

È una convenzione, scelta perché le formule del calcolo combinatorio funzionino sempre. Per esempio il coefficiente binomiale $\binom{n}{n} = \dfrac{n!}{n! \cdot 0!}$ deve valere $1$, visto che c'è un solo modo di scegliere tutti gli oggetti, e questo succede solo se $0! = 1$. Anche la regola $n! = n \cdot (n - 1)!$ con $n = 1$ dà $1! = 1 \cdot 0!$, quindi $0! = 1$.

### Esiste il fattoriale di un numero negativo o con la virgola?

Alle superiori no: il fattoriale si definisce solo per i numeri naturali $0, 1, 2, 3, \ldots$ All'università si studia una funzione, la funzione gamma, che lo estende anche ad altri numeri.

### A che cosa serve?

Soprattutto nel calcolo combinatorio: permutazioni, disposizioni e combinazioni si scrivono tutte con i fattoriali.
