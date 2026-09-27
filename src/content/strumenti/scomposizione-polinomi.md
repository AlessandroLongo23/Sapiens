# Scomposizione di polinomi

## Che cos'è la scomposizione

Scomporre un polinomio vuol dire scriverlo come prodotto di polinomi di grado più basso, come si fa con i numeri: $12 = 2^2 \cdot 3$. Un polinomio che non si può scomporre si dice irriducibile.

## Come si scompone a mano

Si provano i metodi in quest'ordine, e si ricomincia su ogni fattore trovato.

1. Raccoglimento totale: metti in evidenza il MCD dei coefficienti e la potenza di $x$ più bassa.
2. Prodotti notevoli: differenza di quadrati $a^2 - b^2$, quadrato di binomio, somma o differenza di cubi.
3. Trinomio notevole $x^2 + sx + p$: cerca due numeri con somma $s$ e prodotto $p$.
4. Regola di Ruffini: cerca un numero che annulla il polinomio tra i divisori del termine noto.

```ad-example
Esempio: 3x³ - 12x
Raccogli $3x$, che divide tutti i termini. Dentro la parentesi resta una differenza di quadrati:

$$\begin{aligned}
3x^3 - 12x &= 3x(x^2 - 4) \\[6pt]
&= 3x(x - 2)(x + 2)
\end{aligned}$$
```

```ad-example
Esempio: x³ - 2x² - 5x + 6
Il termine noto è $6$: i candidati sono $\pm 1$, $\pm 2$, $\pm 3$, $\pm 6$. Il primo che annulla il polinomio è $1$, perché $1 - 2 - 5 + 6 = 0$. Dividi per $x - 1$ con la regola di Ruffini, poi scomponi il quoziente con somma $-1$ e prodotto $-6$, cioè $-3$ e $2$:

$$\begin{aligned}
x^3 - 2x^2 - 5x + 6 &= (x - 1)(x^2 - x - 6) \\[6pt]
&= (x - 1)(x - 3)(x + 2)
\end{aligned}$$
```

Quando il primo coefficiente non è 1, i candidati di Ruffini sono anche frazioni: un divisore del termine noto diviso per un divisore del primo coefficiente.

```ad-error
Errori frequenti
- Fermarsi troppo presto: dopo il raccoglimento, controlla se la parentesi si scompone ancora.
- Scomporre $x^2 + 4$ come $(x + 2)^2$: la somma di due quadrati non si scompone.
- Dimenticare il fattore raccolto quando si scrive il risultato finale.
```

## Domande frequenti

### Come capisco che un trinomio di secondo grado non si scompone?

Calcola il discriminante $\Delta = b^2 - 4ac$. Se è negativo, il trinomio non si scompone. Se è positivo ma non è un quadrato perfetto, si scompone solo con numeri irrazionali.

### Perché lo strumento a volte dice che non sa scomporre?

Alcuni polinomi di grado 4 o più si scompongono in fattori di secondo grado senza zeri razionali, come $x^4 + x^2 + 1$. Servono artifici che questo strumento non usa: in quel caso lo dice, invece di dare un risultato sbagliato.
