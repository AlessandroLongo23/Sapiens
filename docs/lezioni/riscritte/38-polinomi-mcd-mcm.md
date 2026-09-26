# MCD e MCM di polinomi

Il massimo comune divisore e il minimo comune multiplo si calcolano anche tra polinomi, con lo stesso ragionamento che conosci per i [numeri naturali](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n) e per i [monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/mcd-e-mcm-tra-monomi): si scompone ogni polinomio in fattori e si confrontano gli esponenti. Il lavoro vero è la scomposizione; il confronto, una volta scomposti i polinomi, richiede pochi secondi. Il MCM di polinomi ti servirà come denominatore comune quando sommerai le frazioni con i polinomi al denominatore.

## Divisori e multipli di un polinomio

Un polinomio $A$ è **divisibile** per un polinomio $B$ non nullo se esiste un polinomio $Q$ tale che $A = B \cdot Q$, cioè se la [divisione](/materiale/scuola-superiore/matematica/monomi-e-polinomi/divisione-tra-polinomi) di $A$ per $B$ ha resto zero. In questo caso $B$ è un divisore di $A$ e $A$ è un multiplo di $B$.

Per esempio $x^2 - 9$ è divisibile per $x - 3$, perché $x^2 - 9 = (x - 3)(x + 3)$. Quando un polinomio è scomposto in fattori, i suoi divisori si leggono subito: sono i fattori e i loro prodotti.

Come per i monomi, un divisore resta un divisore se lo moltiplichi per un numero diverso da zero: se $x - 3$ divide $x^2 - 9$, lo dividono anche $2(x - 3)$, $-(x - 3) = 3 - x$ e $\frac{1}{5}(x - 3)$. Per questo servirà una convenzione sul fattore numerico e sul segno.

## Definizioni

Dati due o più polinomi non nulli:

- il **massimo comune divisore** (MCD) è il polinomio di grado più alto tra quelli che li dividono tutti;
- il **minimo comune multiplo** (MCM) è il polinomio di grado più basso tra quelli che sono multipli di tutti.

Due o più polinomi che non hanno fattori comuni, a parte i numeri, si dicono **primi tra loro**. Per esempio $x^2 - 9 = (x - 3)(x + 3)$ e $x^2 + x - 2 = (x + 2)(x - 1)$ non hanno fattori in comune: il MCD è $1$ e il MCM è il prodotto $(x - 3)(x + 3)(x + 2)(x - 1)$.

## Dai numeri ai polinomi

Il metodo è lo stesso in tutti e tre i casi; cambiano i "mattoni" in cui si scompone.

| | Numeri naturali | Monomi | Polinomi |
|---|---|---|---|
| Si scompone in | fattori primi | coefficiente e lettere | fattore numerico e fattori irriducibili |
| MCD | fattori comuni, esponente minore | lettere comuni, esponente minore | fattori comuni, esponente minore |
| MCM | tutti i fattori, esponente maggiore | tutte le lettere, esponente maggiore | tutti i fattori, esponente maggiore |

Un fattore irriducibile è un polinomio che non si può scomporre ulteriormente, come $x + 3$ o $x^2 + 2x + 4$ (la definizione è nella lezione sul [raccoglimento](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/raccoglimento-totale-e-parziale)). Le lettere raccolte a fattor comune sono fattori irriducibili anche loro: in $6x^2(x + 1)$ i fattori sono il numero $6$, la $x$ con esponente $2$ e $x + 1$.

## Il procedimento

1. Scomponi ogni polinomio in fattori irriducibili: raccoglimento, [prodotti notevoli](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-i-prodotti-notevoli), [trinomio di secondo grado](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/trinomio-di-secondo-grado), [regola di Ruffini](/materiale/scuola-superiore/matematica/scomposizione-in-fattori/scomposizione-con-la-regola-di-ruffini).
2. Se due fattori sono opposti, come $x - 3$ e $3 - x$, scrivili nello stesso modo portando fuori un segno meno.
3. Fattore numerico: se i fattori numerici sono tutti interi, prendi il MCD dei loro valori assoluti per il MCD e il MCM dei valori assoluti per il MCM; se almeno uno è una frazione, il fattore numerico è $1$. È la stessa convenzione dei [monomi](/materiale/scuola-superiore/matematica/monomi-e-polinomi/mcd-e-mcm-tra-monomi).
4. MCD: moltiplica i fattori comuni a tutti i polinomi, ognuno con l'esponente minore con cui compare. Se non ce ne sono, il MCD è solo il fattore numerico.
5. MCM: moltiplica tutti i fattori, comuni e non comuni, ognuno una volta sola con l'esponente maggiore.
6. Lascia il risultato scomposto: è la forma che serve dopo, e sviluppare i prodotti non aggiunge niente.

```ad-warning
Confrontare polinomi non scomposti del tutto
Con $x^3 - 4x = x(x^2 - 4)$ e $x^2 + 2x = x(x + 2)$ sembra che l'unico fattore comune sia $x$. Ma $x^2 - 4 = (x - 2)(x + 2)$ si scompone ancora, e allora il MCD è $x(x + 2)$. Come con i numeri, dove $36 = 4 \cdot 9$ non basta e si arriva a $2^2 \cdot 3^2$, ogni fattore va scomposto fino in fondo.
```

```ad-warning
Confrontare i termini invece dei fattori
In $x^2 - 9$ e $x^2 + x - 2$ il termine $x^2$ compare in tutti e due, ma non è un fattore: il MCD è $1$, non $x^2$. Si confrontano i fattori della scomposizione, non i termini delle somme.
```

## Fattori opposti

Due fattori come $x - 3$ e $3 - x$ sono **opposti**: $3 - x = -(x - 3)$. Non sono lo stesso fattore, ma differiscono solo per il segno, e il segno finisce nel fattore numerico, che nel MCD e nel MCM è sempre positivo. Per questo prima del confronto si scrivono nello stesso modo: si sceglie una delle due forme e nell'altra si porta fuori $-1$.

In questa lezione si sceglie la forma con il primo termine positivo, ordinando secondo le potenze decrescenti di $x$: si scrive $x - 3$ e non $3 - x$, $x - y$ e non $y - x$.

$$
\begin{aligned}
9 - x^2 &= (3 - x)(3 + x) \\
&= -(x - 3)(x + 3)
\end{aligned}
$$

Con le potenze bisogna guardare l'esponente. Con un esponente pari il segno sparisce, perché $(-1)^2 = 1$; con un esponente dispari resta.

$$
\begin{gathered}
(3 - x)^2 = (x - 3)^2 \\
(3 - x)^3 = -(x - 3)^3
\end{gathered}
$$

```ad-warning
Scambiare una somma per un fattore opposto
$3 + x$ e $x + 3$ sono lo stesso fattore scritto in un altro ordine, perché l'addizione è commutativa: non c'è nessun segno da portare fuori. Sono opposti solo i fattori che differiscono in tutti i segni, come $3 - x$ e $x - 3$, o $x + 3$ e $-x - 3$.
```

```ad-note
Un MCD scritto in un altro modo
Alcuni libri e insegnanti non fissano la forma dei fattori, e accettano sia $x - 3$ sia $3 - x$: i due risultati differiscono per il fattore $-1$ e dividono gli stessi polinomi. Se trovi $3 - x$ nelle soluzioni del libro, il tuo $x - 3$ non è sbagliato.
```

## Esempi svolti

```ad-example
Esempio 1: due binomi con raccoglimento
Trova MCD e MCM di $6x^2 + 6x$ e $4x^2 - 4$.

Scomposizione:

$$
\begin{aligned}
&6x^2 + 6x = 6x(x + 1) \\[6pt]
&4x^2 - 4 = 4(x^2 - 1) \\
&= 4(x - 1)(x + 1)
\end{aligned}
$$

Fattori numerici $6$ e $4$: $\text{MCD}(6, 4) = 2$ e $\text{MCM}(6, 4) = 12$.

Il solo fattore comune è $x + 1$, con esponente $1$ in tutti e due. La $x$ compare solo nel primo, $x - 1$ solo nel secondo.

$$
\begin{gathered}
\text{MCD} = 2(x + 1) \\
\text{MCM} = 12x(x - 1)(x + 1)
\end{gathered}
$$
```

```ad-example
Esempio 2: fattori con esponenti diversi
Trova MCD e MCM di $x^3 - 4x^2 + 4x$, $x^2 - 4$ e $x^3 - 2x^2$.

Scomposizione:

$$
\begin{aligned}
x^3 - 4x^2 + 4x &= x(x^2 - 4x + 4) \\
&= x(x - 2)^2
\end{aligned}
$$

$$
\begin{gathered}
x^2 - 4 = (x - 2)(x + 2) \\
x^3 - 2x^2 = x^2(x - 2)
\end{gathered}
$$

Il fattore $x - 2$ compare in tutti e tre, con esponenti $2$, $1$, $1$: nel MCD va con esponente $1$. La $x$ manca nel secondo polinomio, quindi nel MCD non entra.

Nel MCM entrano $x$ (esponente massimo $2$), $x - 2$ (esponente massimo $2$) e $x + 2$.

$$
\begin{gathered}
\text{MCD} = x - 2 \\
\text{MCM} = x^2(x - 2)^2(x + 2)
\end{gathered}
$$
```

```ad-warning
Mettere nel MCD un fattore che non è in tutti i polinomi
Nell'esempio 2 la $x$ compare nel primo e nel terzo polinomio, ma non nel secondo: nel MCD non va. Nel MCD entrano solo i fattori comuni a tutti.
```

```ad-example
Esempio 3: fattori opposti
Trova MCD e MCM di $2x - 6$, $9 - x^2$ e $x^2 - 6x + 9$.

Scomposizione, con il secondo polinomio riscritto per avere $x - 3$:

$$
\begin{gathered}
2x - 6 = 2(x - 3) \\
x^2 - 6x + 9 = (x - 3)^2
\end{gathered}
$$

$$
\begin{aligned}
9 - x^2 &= (3 - x)(3 + x) \\
&= -(x - 3)(x + 3)
\end{aligned}
$$

Fattori numerici $2$, $-1$, $1$: i valori assoluti sono $2$, $1$, $1$, quindi il fattore numerico è $1$ nel MCD e $2$ nel MCM.

Il fattore $x - 3$ compare in tutti e tre, con esponenti $1$, $1$, $2$. Il fattore $x + 3$ compare solo nel secondo.

$$
\begin{gathered}
\text{MCD} = x - 3 \\
\text{MCM} = 2(x - 3)^2(x + 3)
\end{gathered}
$$

Senza riscrivere $3 - x$ come $-(x - 3)$ si concluderebbe per errore che il secondo polinomio non ha fattori in comune con gli altri, e che il MCD è $1$.
```

```ad-example
Esempio 4: due lettere
Trova MCD e MCM di $x^3y - xy^3$ e $x^2y + 2xy^2 + y^3$.

Scomposizione: nel primo si raccoglie $xy$ e resta una differenza di quadrati, nel secondo si raccoglie $y$ e resta un quadrato di binomio.

$$
\begin{aligned}
x^3y - xy^3 &= xy(x^2 - y^2) \\
&= xy(x - y)(x + y)
\end{aligned}
$$

$$
\begin{aligned}
&x^2y + 2xy^2 + y^3 \\
&= y(x^2 + 2xy + y^2) \\
&= y(x + y)^2
\end{aligned}
$$

Fattori comuni: $y$ (esponente $1$ in tutti e due) e $x + y$ (esponenti $1$ e $2$). La $x$ e $x - y$ sono solo nel primo.

$$
\begin{gathered}
\text{MCD} = y(x + y) \\
\text{MCM} = xy(x - y)(x + y)^2
\end{gathered}
$$
```

```ad-example
Esempio 5: cubi e trinomio
Trova MCD e MCM di $x^3 - 8$, $x^2 + x - 6$ e $x^2 - 4x + 4$.

Scomposizione. Il primo è una differenza di cubi, con il falso quadrato $x^2 + 2x + 4$ che non si scompone. Il secondo è un trinomio con somma $1$ e prodotto $-6$: i numeri sono $3$ e $-2$. Il terzo è un quadrato di binomio.

$$x^3 - 8 = (x - 2)(x^2 + 2x + 4)$$

$$
\begin{gathered}
x^2 + x - 6 = (x + 3)(x - 2) \\
x^2 - 4x + 4 = (x - 2)^2
\end{gathered}
$$

Il solo fattore comune è $x - 2$, con esponente minimo $1$ e massimo $2$.

$$
\begin{aligned}
&\text{MCD} = x - 2 \\[6pt]
&\text{MCM} \\
&= (x - 2)^2(x + 3)(x^2 + 2x + 4)
\end{aligned}
$$
```

```ad-warning
Lasciare fuori dal MCM il falso quadrato
Il fattore $x^2 + 2x + 4$ non si scompone, ma è un fattore come gli altri: nel MCM entra intero. Scriverlo come $(x + 2)^2$ è sbagliato, perché $(x + 2)^2 = x^2 + 4x + 4$.
```

```ad-example
Esempio 6: fattori numerici frazionari
Trova MCD e MCM di $\frac{1}{2}x^2 - 2$ e $\frac{2}{3}x + \frac{4}{3}$.

Scomposizione, raccogliendo il coefficiente frazionario:

$$
\begin{aligned}
&\frac{1}{2}x^2 - 2 = \frac{1}{2}(x^2 - 4) \\
&= \frac{1}{2}(x - 2)(x + 2) \\[6pt]
&\frac{2}{3}x + \frac{4}{3} = \frac{2}{3}(x + 2)
\end{aligned}
$$

I fattori numerici sono frazioni, quindi il fattore numerico è $1$ sia nel MCD sia nel MCM.

$$
\begin{gathered}
\text{MCD} = x + 2 \\
\text{MCM} = (x - 2)(x + 2)
\end{gathered}
$$
```

```ad-tip
Un controllo per due polinomi
Con due polinomi e fattori numerici interi, il prodotto di MCD e MCM è uguale al prodotto dei due polinomi, a meno del segno. Nell'esempio 4: $y(x + y) \cdot xy(x - y)(x + y)^2 = xy^2(x - y)(x + y)^3$, e anche $xy(x - y)(x + y) \cdot y(x + y)^2 = xy^2(x - y)(x + y)^3$. Il controllo funziona perché per ogni fattore il minimo più il massimo dei due esponenti è uguale alla loro somma. Con tre o più polinomi, o con fattori numerici frazionari, non vale.
```
