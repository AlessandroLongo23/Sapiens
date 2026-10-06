# Formulario: Equazioni logaritmiche

## Condizioni di esistenza

C.E.: l'argomento di ogni logaritmo deve essere positivo. Si scrivono sull'equazione di partenza, prima di usare le proprietà, e una soluzione che non le rispetta si scarta.

## I due tipi a cui ricondursi

| Equazione | Diventa | C.E. |
|---|---|---|
| $\log_a f(x) = c$ | $f(x) = a^c$ | rispettate da sole |
| $\log_a f(x) = \log_a g(x)$ | $f(x) = g(x)$ | da controllare: $f(x) > 0$ e $g(x) > 0$ |

Per esempio $\log_3 \left(x^2 - 2x\right) = 1$ diventa $x^2 - 2x = 3$, con $S = \{-1, 3\}$.

## Procedimento

1. Scrivi le C.E.: ogni argomento positivo.
2. Con le proprietà riduci ogni membro a un solo logaritmo o a un numero, con la stessa base.
3. Passa agli argomenti: $f(x) = a^c$ oppure $f(x) = g(x)$.
4. Risolvi l'equazione ottenuta.
5. Scarta le soluzioni che non rispettano le C.E.

Per esempio $\log_2 x + \log_2 (x - 2) = 3$: C.E. $x > 2$; $x(x - 2) = 8$ dà $-2$ e $4$; $S = \{4\}$.

## Passaggi utili

- Un numero come logaritmo: $c = \log_a a^c$, per esempio $2 = \log_2 4$.
- Un coefficiente all'esponente: $2\log_5 x = \log_5 x^2$, con $x > 0$.
- Sostituzione: se compare più volte $\log_a x$, poni $t = \log_a x$; ogni valore reale di $t$ è accettabile. $\log_a^2 x$ vuol dire $\left(\log_a x\right)^2$.
- Basi diverse: porta tutto alla stessa base, $\log_4 x = \dfrac{\log_2 x}{2}$.

## Equazioni esponenziali con i logaritmi

Con $b > 0$:

$$a^{f(x)} = b \iff f(x) = \log_a b$$

Con $b \leq 0$ l'equazione è impossibile. Per esempio $2^x = 5$ ha la soluzione $x = \log_2 5 \approx 2{,}32$.

Con basi diverse nei due membri si calcola il logaritmo dei due membri e si portano gli esponenti davanti:

$$2^{x + 1} = 3^x \ \Rightarrow \ (x + 1)\log 2 = x\log 3 \ \Rightarrow \ x = \frac{\log 2}{\log 3 - \log 2}$$

```ad-warning
Le C.E. dopo le proprietà
Le condizioni si scrivono un argomento alla volta sull'equazione data: $\log_2 \left[x(x - 2)\right]$ esiste anche per $x < 0$, $\log_2 x + \log_2 (x - 2)$ no.
```

```ad-warning
Positivo l'argomento, non la x
$\log (3x + 1) = -1$ ha la soluzione $x = -\dfrac{3}{10}$: è negativa, ma l'argomento vale $\dfrac{1}{10}$.
```

```ad-warning
L'esponente pari
$\log_2 x^2 = 4$ ha $S = \{-4, 4\}$; scrivendo $2\log_2 x = 4$ si perde $-4$.
```
