# Semplificazione delle frazioni algebriche

Una frazione algebrica si semplifica come una frazione di numeri: si scrivono numeratore e denominatore come prodotti e si dividono tutti e due per i fattori che hanno in comune. Per esempio $\dfrac{x^2 - 9}{x^2 + 3x}$ diventa $\dfrac{x - 3}{x}$, che è più corta e più facile da usare nei conti. La differenza con i numeri è che qui i fattori sono polinomi, e per trovarli serve la [scomposizione in fattori](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale). Nella seconda parte della lezione trovi la riduzione allo stesso denominatore, che serve per sommare le frazioni algebriche.

Per seguire la lezione devi saper scrivere le [condizioni di esistenza](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza) di una frazione algebrica (C.E.): sono i valori delle lettere per cui il denominatore non è zero.

## Proprietà invariantiva

Con le frazioni di numeri, se moltiplichi o dividi numeratore e denominatore per lo stesso numero diverso da zero ottieni una frazione equivalente: è la [proprietà invariantiva](/materiale/scuola-superiore/matematica/numeri-razionali/frazioni-e-numeri-razionali). Per le frazioni algebriche vale la stessa cosa, con un polinomio $C$ al posto del numero:

$$\frac{A}{B} = \frac{A \cdot C}{B \cdot C}$$

L'uguaglianza vale per tutti i valori delle lettere per cui $B \neq 0$ e $C \neq 0$. Due frazioni algebriche si dicono **equivalenti** quando hanno lo stesso valore per tutti i valori delle lettere per cui esistono tutte e due.

Letta da sinistra a destra, la proprietà serve a cambiare il denominatore (è quello che si fa nella riduzione allo stesso denominatore). Letta da destra a sinistra, serve a semplificare: se numeratore e denominatore hanno un fattore $C$ in comune, lo si toglie da tutti e due.

```ad-example
La frazione dell'apertura
Numeratore e denominatore si scompongono così:

$$\frac{x^2 - 9}{x^2 + 3x} = \frac{(x - 3)(x + 3)}{x(x + 3)}$$

Il denominatore si annulla per $x = 0$ e per $x = -3$, quindi C.E.: $x \neq 0$, $x \neq -3$. Il fattore $x + 3$ è comune, e si dividono per $x + 3$ numeratore e denominatore:

$$\frac{(x - 3)(x + 3)}{x(x + 3)} = \frac{x - 3}{x}$$

Controllo con $x = 2$: la frazione di partenza vale $\dfrac{4 - 9}{4 + 6} = \dfrac{-5}{10} = -\dfrac{1}{2}$, quella semplificata $\dfrac{2 - 3}{2} = -\dfrac{1}{2}$.
```

Una frazione algebrica è **irriducibile** (o ridotta ai minimi termini) quando numeratore e denominatore non hanno fattori in comune: né polinomi di grado almeno $1$, né numeri diversi da $1$ e $-1$. Semplificare vuol dire arrivare alla frazione irriducibile equivalente a quella data.

## Le condizioni di esistenza restano

Nell'esempio, la frazione semplificata $\dfrac{x - 3}{x}$ per $x = -3$ ha un valore: $\dfrac{-6}{-3} = 2$. La frazione di partenza invece per $x = -3$ non esiste, perché il suo denominatore vale $9 - 9 = 0$. Le due frazioni sono uguali solo dove esistono tutte e due.

Per questo le C.E. si scrivono sulla frazione di partenza, prima di semplificare, e si portano dietro fino al risultato. Il risultato corretto dell'esempio è

$$\frac{x - 3}{x}, \quad \text{C.E.: } x \neq 0, \ x \neq -3$$

anche se nella frazione semplificata il fattore $x + 3$ non si vede più.

```ad-warning
Scrivere le C.E. dopo aver semplificato
Se cerchi le C.E. sulla frazione semplificata perdi i valori dei fattori che hai tolto: in $\dfrac{x - 3}{x}$ trovi solo $x \neq 0$, e ti sfugge $x \neq -3$. Le C.E. si leggono sul denominatore scomposto della frazione data, prima di togliere qualsiasi fattore.
```

Può succedere che dopo la semplificazione il denominatore sparisca del tutto, e il risultato sia un polinomio:

$$
\begin{aligned}
\frac{x^2 - 4}{x - 2} &= \frac{(x - 2)(x + 2)}{x - 2} \\
&= x + 2
\end{aligned}
$$

con C.E.: $x \neq 2$. Il polinomio $x + 2$ da solo ha un valore per ogni $x$, la frazione di partenza no: il risultato è "$x + 2$ con $x \neq 2$".

## Il procedimento

1. Scomponi il denominatore in fattori e scrivi le C.E.
2. Scomponi il numeratore in fattori: raccoglimento, [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado), [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).
3. Se un fattore del numeratore e uno del denominatore sono opposti, come $x - 2$ e $2 - x$, scrivili nello stesso modo portando fuori un segno meno.
4. Dividi numeratore e denominatore per ogni fattore comune, con l'esponente minore con cui compare; semplifica anche i fattori numerici. In pratica dividi tutti e due per il loro [MCD](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi).
5. Scrivi il risultato insieme alle C.E. del passo 1.

Se al passo 4 non c'è nessun fattore comune, la frazione è già irriducibile: per esempio $\dfrac{x^2 + 4}{x^2 - 4} = \dfrac{x^2 + 4}{(x - 2)(x + 2)}$ non si semplifica, perché $x^2 + 4$ non si scompone.

```ad-warning
Semplificare i termini invece dei fattori
In $\dfrac{x + 6}{x + 2}$ non si possono togliere le $x$, né dividere $6$ per $2$ e scrivere $3$: numeratore e denominatore sono somme, e si semplificano solo i fattori, cioè ciò che moltiplica tutto il numeratore e tutto il denominatore. Con $x = 1$ la frazione vale $\dfrac{7}{3}$, non $3$. Questa frazione è già irriducibile.
```

```ad-warning
Scrivere 0 al posto di 1
Quando un fattore si semplifica e sopra non resta niente, al numeratore resta $1$:

$$\frac{x + 1}{x^2 + x} = \frac{x + 1}{x(x + 1)} = \frac{1}{x}$$

con C.E.: $x \neq 0$, $x \neq -1$. Il risultato non è $0$ e non è $x$: dividere un fattore per sé stesso dà $1$.
```

```ad-tip
Un controllo con un numero
Scegli un valore della lettera che rispetta le C.E. e non è $0$ né $1$, e calcola la frazione di partenza e quella semplificata. Se i due valori sono diversi, hai sbagliato; se sono uguali, il risultato è quasi certamente giusto.
```

## Fattori opposti

Due polinomi come $x - 2$ e $2 - x$ sono **opposti**: hanno tutti i termini con il segno cambiato, e quindi

$$a - b = -(b - a)$$

Non sono lo stesso fattore, ma differiscono solo per il segno: portando fuori un $-1$ diventano uguali e si possono semplificare. Il caso più corto è

$$\frac{x - 2}{2 - x} = \frac{x - 2}{-(x - 2)} = -1$$

con C.E.: $x \neq 2$. Una frazione con numeratore e denominatore opposti vale $-1$, non $1$.

Il segno meno che resta si scrive davanti alla frazione, oppure al numeratore: le tre scritture

$$-\frac{A}{B} = \frac{-A}{B} = \frac{A}{-B}$$

sono equivalenti, e di solito si evita il meno al denominatore.

Con le potenze conta l'esponente, come nella lezione sul [MCD e MCM di polinomi](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi): con esponente pari il segno sparisce, con esponente dispari resta.

$$
\begin{gathered}
(2 - x)^2 = (x - 2)^2 \\
(2 - x)^3 = -(x - 2)^3
\end{gathered}
$$

```ad-warning
Scambiare una somma per un fattore opposto
$2 + x$ e $x + 2$ sono lo stesso fattore scritto in un altro ordine, e $\dfrac{x + 2}{2 + x} = 1$. Sono opposti solo i polinomi che differiscono in tutti i segni, come $2 - x$ e $x - 2$.
```

## Esempi svolti di semplificazione

```ad-example
Esempio 1: raccoglimento e fattori numerici
Semplifica $\dfrac{4x^2 - 6x}{10x^2}$.

Il denominatore è il monomio $10x^2$, che si annulla solo per $x = 0$: C.E.: $x \neq 0$.

Nel numeratore si raccoglie $2x$:

$$\frac{4x^2 - 6x}{10x^2} = \frac{2x(2x - 3)}{10x^2}$$

Numeratore e denominatore hanno in comune il numero $2$ e la $x$ (con esponente $1$ sopra e $2$ sotto, quindi si toglie $x$ una volta):

$$\frac{2x(2x - 3)}{10x^2} = \frac{2x - 3}{5x}$$

Risultato: $\dfrac{2x - 3}{5x}$, C.E.: $x \neq 0$.
```

```ad-example
Esempio 2: differenza di quadrati e trinomio
Semplifica $\dfrac{x^2 - 4}{x^2 + x - 6}$.

Il denominatore è un trinomio con somma $1$ e prodotto $-6$: i numeri sono $3$ e $-2$. Il numeratore è una differenza di quadrati.

$$
\begin{gathered}
x^2 + x - 6 = (x + 3)(x - 2) \\
x^2 - 4 = (x - 2)(x + 2)
\end{gathered}
$$

C.E.: $x \neq -3$, $x \neq 2$. Il fattore comune è $x - 2$:

$$
\begin{aligned}
\frac{x^2 - 4}{x^2 + x - 6} &= \frac{(x - 2)(x + 2)}{(x + 3)(x - 2)} \\
&= \frac{x + 2}{x + 3}
\end{aligned}
$$

Risultato: $\dfrac{x + 2}{x + 3}$, C.E.: $x \neq -3$, $x \neq 2$.
```

```ad-example
Esempio 3: fattori opposti
Semplifica $\dfrac{6 - 3x}{x^2 - 4x + 4}$.

Il denominatore è un quadrato di binomio: $x^2 - 4x + 4 = (x - 2)^2$. C.E.: $x \neq 2$.

Nel numeratore si raccoglie $3$ e resta $2 - x$, che è l'opposto di $x - 2$:

$$
\begin{aligned}
6 - 3x &= 3(2 - x) \\
&= -3(x - 2)
\end{aligned}
$$

Il fattore $x - 2$ compare con esponente $1$ sopra e $2$ sotto: si toglie una volta.

$$
\begin{aligned}
\frac{6 - 3x}{x^2 - 4x + 4} &= \frac{-3(x - 2)}{(x - 2)^2} \\
&= -\frac{3}{x - 2}
\end{aligned}
$$

Risultato: $-\dfrac{3}{x - 2}$, C.E.: $x \neq 2$. Senza riscrivere $2 - x$ come $-(x - 2)$ sembrerebbe che la frazione non si possa semplificare.
```

```ad-example
Esempio 4: fattore opposto e quadrato
Semplifica $\dfrac{x^2 - 2x + 1}{1 - x^2}$.

Il denominatore è una differenza di quadrati con il fattore $1 - x$, opposto di $x - 1$:

$$
\begin{aligned}
1 - x^2 &= (1 - x)(1 + x) \\
&= -(x - 1)(x + 1)
\end{aligned}
$$

C.E.: $x \neq 1$, $x \neq -1$. Il numeratore è il quadrato $(x - 1)^2$. Il fattore $x - 1$ compare con esponente $2$ sopra e $1$ sotto, quindi sopra ne resta uno:

$$
\begin{aligned}
\frac{x^2 - 2x + 1}{1 - x^2} &= \frac{(x - 1)^2}{-(x - 1)(x + 1)} \\
&= -\frac{x - 1}{x + 1}
\end{aligned}
$$

Risultato: $-\dfrac{x - 1}{x + 1}$, C.E.: $x \neq 1$, $x \neq -1$. Se porti il meno dentro il numeratore ottieni $\dfrac{1 - x}{x + 1}$, che è la stessa frazione scritta in un altro modo: $-(x - 1) = 1 - x$.
```

```ad-example
Esempio 5: raccoglimento parziale con due lettere
Semplifica $\dfrac{ax - ay + bx - by}{x^2 - y^2}$.

Il denominatore è una differenza di quadrati: $x^2 - y^2 = (x - y)(x + y)$. Si annulla quando $x = y$ o quando $x = -y$, quindi C.E.: $x \neq y$, $x \neq -y$.

Nel numeratore si raccoglie $a$ dai primi due termini e $b$ dagli ultimi due:

$$
\begin{aligned}
&ax - ay + bx - by \\
&= a(x - y) + b(x - y) \\
&= (x - y)(a + b)
\end{aligned}
$$

Il fattore comune è $x - y$:

$$\frac{(x - y)(a + b)}{(x - y)(x + y)} = \frac{a + b}{x + y}$$

Risultato: $\dfrac{a + b}{x + y}$, C.E.: $x \neq y$, $x \neq -y$.
```

```ad-example
Esempio 6: cubi e regola di Ruffini
Semplifica $\dfrac{x^3 - 8}{x^3 - 3x^2 + 4}$.

Il denominatore si scompone con la regola di Ruffini: si annulla per $x = 2$ ($8 - 12 + 4 = 0$) e per $x = -1$ ($-1 - 3 + 4 = 0$), e

$$x^3 - 3x^2 + 4 = (x - 2)^2(x + 1)$$

C.E.: $x \neq 2$, $x \neq -1$. Il numeratore è una differenza di cubi, con il falso quadrato $x^2 + 2x + 4$ che non si scompone:

$$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$$

Il fattore $x - 2$ compare con esponente $1$ sopra e $2$ sotto: si toglie una volta, e sotto ne resta uno.

$$
\begin{aligned}
&\frac{(x - 2)(x^2 + 2x + 4)}{(x - 2)^2(x + 1)} \\[6pt]
&= \frac{x^2 + 2x + 4}{(x - 2)(x + 1)}
\end{aligned}
$$

Risultato: $\dfrac{x^2 + 2x + 4}{(x - 2)(x + 1)}$, C.E.: $x \neq 2$, $x \neq -1$. Il denominatore si lascia scomposto: sviluppare il prodotto non aggiunge niente, e nelle operazioni successive serve proprio la forma scomposta.
```

```ad-example
Esempio 7: un denominatore che non si annulla mai
Semplifica $\dfrac{x^3 + x}{x^2 + 1}$.

Il denominatore $x^2 + 1$ è la somma di un quadrato, che non è mai negativo, e di $1$: vale almeno $1$ e non si annulla per nessun valore di $x$. La frazione esiste per ogni $x$, e non ci sono C.E. da scrivere.

Nel numeratore si raccoglie $x$:

$$\frac{x^3 + x}{x^2 + 1} = \frac{x(x^2 + 1)}{x^2 + 1} = x$$

Risultato: $x$, per ogni valore di $x$. Qui la frazione e il polinomio sono uguali ovunque, perché nessun valore è stato escluso.
```

## Riduzione allo stesso denominatore

Per sommare o sottrarre due frazioni algebriche, e per confrontarle, le si scrive prima con lo stesso denominatore. Come con i numeri, il denominatore comune più semplice è il [MCM dei denominatori](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/mcd-e-mcm-di-polinomi), e ogni frazione si trasforma con la proprietà invariantiva, moltiplicando numeratore e denominatore per il fattore che le manca.

1. Scomponi tutti i denominatori e scrivi le C.E. di tutte le frazioni insieme.
2. Se una frazione si può semplificare, semplificala.
3. Calcola il MCM dei denominatori: è il denominatore comune.
4. Per ogni frazione, dividi il MCM per il suo denominatore: il quoziente è il fattore che manca.
5. Moltiplica numeratore e denominatore della frazione per quel fattore.

Il MCM contiene soltanto i fattori dei denominatori, quindi il passo 5 non aggiunge C.E. nuove: moltiplichi per fattori che sono già diversi da zero per le C.E. del passo 1. Il numeratore di solito si lascia scomposto, o si sviluppa solo se poi va sommato. Come si fa la somma è nella lezione sulle [operazioni con le frazioni algebriche](/materiale/scuola-superiore/matematica/frazioni-algebriche/operazioni-con-le-frazioni-algebriche).

```ad-example
Esempio 8: due frazioni
Riduci allo stesso denominatore $\dfrac{3}{x^2 - x}$ e $\dfrac{2}{x^2 - 1}$.

I denominatori scomposti sono $x(x - 1)$ e $(x - 1)(x + 1)$. C.E.: $x \neq 0$, $x \neq 1$, $x \neq -1$.

Il MCM è $x(x - 1)(x + 1)$. Alla prima frazione manca $x + 1$, alla seconda manca $x$: si moltiplicano per questi fattori numeratore e denominatore, e le due frazioni diventano

$$
\begin{gathered}
\frac{3(x + 1)}{x(x - 1)(x + 1)} \\[8pt]
\frac{2x}{x(x - 1)(x + 1)}
\end{gathered}
$$
```

```ad-example
Esempio 9: un denominatore opposto
Riduci allo stesso denominatore $\dfrac{1}{x - 3}$ e $\dfrac{x}{9 - x^2}$.

Il secondo denominatore contiene $3 - x$, che è l'opposto di $x - 3$:

$$
\begin{aligned}
9 - x^2 &= (3 - x)(3 + x) \\
&= -(x - 3)(x + 3)
\end{aligned}
$$

C.E.: $x \neq 3$, $x \neq -3$. Il meno si porta davanti alla seconda frazione, e poi al numeratore:

$$\frac{x}{9 - x^2} = -\frac{x}{(x - 3)(x + 3)}$$

Il MCM è $(x - 3)(x + 3)$. Alla prima frazione manca $x + 3$, alla seconda niente. Le due frazioni, con il segno della seconda portato al numeratore, diventano

$$
\begin{gathered}
\frac{x + 3}{(x - 3)(x + 3)} \\[8pt]
\frac{-x}{(x - 3)(x + 3)}
\end{gathered}
$$

Senza riscrivere $3 - x$ il MCM sarebbe venuto $(x - 3)(3 - x)(3 + x)$, con un fattore di troppo.
```

```ad-example
Esempio 10: tre frazioni con fattori numerici
Riduci allo stesso denominatore $\dfrac{1}{2x + 4}$, $\dfrac{x}{x^2 + 4x + 4}$ e $\dfrac{5}{6x}$.

I denominatori scomposti sono $2(x + 2)$, $(x + 2)^2$ e $6x$. C.E.: $x \neq -2$, $x \neq 0$.

Il MCM ha fattore numerico $\text{MCM}(2, 6) = 6$, poi $x$ e $x + 2$ con esponente massimo $2$: è $6x(x + 2)^2$. Dividendo il MCM per ogni denominatore trovi i fattori che mancano: $3x(x + 2)$ alla prima frazione, $6x$ alla seconda, $(x + 2)^2$ alla terza. Le tre frazioni diventano

$$
\begin{gathered}
\frac{3x(x + 2)}{6x(x + 2)^2} \\[8pt]
\frac{6x^2}{6x(x + 2)^2} \\[8pt]
\frac{5(x + 2)^2}{6x(x + 2)^2}
\end{gathered}
$$
```

```ad-warning
Moltiplicare solo il denominatore
Il fattore che manca va moltiplicato sopra e sotto: $\dfrac{3}{x(x - 1)}$ diventa $\dfrac{3(x + 1)}{x(x - 1)(x + 1)}$, non $\dfrac{3}{x(x - 1)(x + 1)}$. Se cambi solo il denominatore, la frazione cambia valore.
```

```ad-note
Il prodotto dei denominatori
Anche il prodotto di tutti i denominatori è un denominatore comune, e le frazioni che ottieni sono equivalenti a quelle date. Ma quando i denominatori hanno fattori in comune il prodotto è più lungo del MCM, e i conti che seguono si allungano con lui: nell'esempio 8 verrebbe $x(x - 1)^2(x + 1)$ invece di $x(x - 1)(x + 1)$.
```
