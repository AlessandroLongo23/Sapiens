# Formulario: Probabilità della somma e dell'evento contrario

## Evento contrario

$$p(\overline{E}) = 1 - p(E)$$

- "Almeno uno" ha per contrario "nessuno". Due dadi: $p(\text{almeno un } 6) = 1 - \dfrac{25}{36} = \dfrac{11}{36}$.
- Tre monete: $p(\text{almeno una testa}) = 1 - \dfrac{1}{8} = \dfrac{7}{8}$.

## Unione di eventi incompatibili

Se $A \cap B = \emptyset$:

$$p(A \cup B) = p(A) + p(B)$$

- Asso o re: $\dfrac{4}{40} + \dfrac{4}{40} = \dfrac{1}{5}$.
- Con più eventi incompatibili a due a due si sommano tutte le probabilità.

## Unione di eventi compatibili

Per due eventi qualsiasi:

$$
\begin{aligned}
p(A \cup B) = {} & p(A) + p(B) \\
& - p(A \cap B)
\end{aligned}
$$

- $p(A \cap B)$ si trova contando gli esiti comuni ai due eventi.
- Coppe o figura: $\dfrac{10}{40} + \dfrac{12}{40} - \dfrac{3}{40} = \dfrac{19}{40}$.
- Doppio o somma $8$ con due dadi: $\dfrac{6}{36} + \dfrac{5}{36} - \dfrac{1}{36} = \dfrac{5}{18}$.

## Come si risolve

1. Scrivi $\Omega$ e controlla che gli esiti siano equiprobabili.
2. Traduci: "o" unione, "e" intersezione, "non" e "nessuno" contrario.
3. Con "almeno uno", valuta il contrario "nessuno".
4. Unione: esiti in comune? No, somma; sì, togli $p(A \cap B)$.
5. Controlla che il risultato stia tra $0$ e $1$.

```ad-warning
Sommare probabilità di eventi compatibili
Dado: $p(\text{pari o maggiore di } 3)$ non è $\dfrac{1}{2} + \dfrac{1}{2} = 1$, ma $\dfrac{4}{6} = \dfrac{2}{3}$: $4$ e $6$ sono in comune.
```

```ad-warning
Il contrario di almeno uno
Il contrario di "almeno un $6$" è "nessun $6$", non "esattamente un $6$".
```

```ad-warning
Incompatibili non vuol dire contrari
"Esce $1$" ed "esce $2$" sono incompatibili ma non contrari: le probabilità danno $\dfrac{1}{3}$, non $1$.
```
