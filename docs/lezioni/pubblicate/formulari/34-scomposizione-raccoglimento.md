# Formulario: Raccoglimento totale e parziale

## Scomposizione e polinomi irriducibili

- Scomporre in fattori: scrivere il polinomio come prodotto di due o più polinomi. L'ultima operazione deve essere una moltiplicazione.
- Irriducibile: non si scrive come prodotto di due polinomi di grado almeno $1$. I polinomi di primo grado sono irriducibili.
- Scomposizione completa: ogni fattore è irriducibile; il fattore numerico comune si raccoglie, $6x - 9 = 3(2x - 3)$.

## Raccoglimento totale

La proprietà distributiva letta da destra a sinistra; il fattore da raccogliere è il MCD dei termini:

$$ab + ac = a(b + c)$$

1. Calcola il MCD di tutti i termini.
2. Scrivi il MCD fuori da una parentesi.
3. Dentro, il quoziente di ogni termine diviso per il MCD, con il suo segno.
4. Controlla: tanti termini quanti erano, nessun fattore comune rimasto.

$$
\begin{aligned}
&6x^3y - 9x^2y^2 + 3x^2y \\
&= 3x^2y(2x - 3y + 1)
\end{aligned}
$$

Raccogliendo un segno meno cambiano segno tutti i termini nella parentesi:

$$
\begin{aligned}
&-a + b = -(a - b) \\[6pt]
&-4x^3 + 8x^2 - 2x \\
&= -2x(2x^2 - 4x + 1)
\end{aligned}
$$

Il fattore comune può essere un polinomio; se due parentesi sono opposte, prima si usa $b - a = -(a - b)$:

$$
\begin{aligned}
&x(a - b) + y(b - a) \\
&= x(a - b) - y(a - b) \\
&= (a - b)(x - y)
\end{aligned}
$$

## Raccoglimento parziale

$$
\begin{aligned}
&ax + ay + bx + by \\
&= a(x + y) + b(x + y) \\
&= (x + y)(a + b)
\end{aligned}
$$

1. Raccogli prima il fattore comune a tutti i termini, se c'è.
2. Dividi i termini in gruppi con lo stesso numero di termini.
3. Raccogli in ogni gruppo, con il segno che rende le parentesi uguali.
4. Raccogli la parentesi comune.
5. Se le parentesi non vengono uguali, prova un altro raggruppamento.

$$
\begin{aligned}
&x^3 - 2x^2 - 3x + 6 \\
&= x^2(x - 2) - 3(x - 2) \\
&= (x - 2)(x^2 - 3)
\end{aligned}
$$

## Controllo

Moltiplica i fattori e ritrovi il polinomio, oppure sostituisci alla lettera un numero diverso da $0$ e da $1$ nei due lati e confronta i valori.

```ad-warning
Dimenticare l'1
Il termine uguale al MCD lascia $1$: $3x^2y(2x - 3y + 1)$, non $3x^2y(2x - 3y)$.
```

```ad-warning
Cambiare segno solo al primo termine
$-x^2 + 5x - 6 = -(x^2 - 5x + 6)$, non $-(x^2 + 5x - 6)$.
```

```ad-warning
Fermarsi a metà
$x^2(x - 2) - 3(x - 2)$ è ancora una somma: la scomposizione è $(x - 2)(x^2 - 3)$.
```
