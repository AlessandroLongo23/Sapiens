# Equazioni di secondo grado

Un quadrato ha l'area di $49\ \text{cm}^2$ e vuoi sapere quanto misura il lato. Se chiami $x$ la misura del lato, devi trovare i numeri che elevati al quadrato danno $49$, cioè risolvere $x^2 = 49$. I numeri sono due, $7$ e $-7$, ma una lunghezza non può essere negativa, quindi il lato misura $7\ \text{cm}$. Le equazioni come questa, in cui l'incognita compare al quadrato, si chiamano di secondo grado: hanno al massimo due soluzioni, e in certi casi nessuna.

Per seguire questa lezione ti servono le [equazioni di primo grado](/materiale/scuola-superiore/matematica/equazioni-di-primo-grado/equazioni-di-primo-grado-intere), perché i principi di equivalenza sono gli stessi, e la semplificazione dei radicali, che trovi in [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).

## Forma normale

Un'equazione è di **secondo grado** quando, svolti i calcoli e portati tutti i termini a primo membro, si può scrivere nella **forma normale**

$$ax^2 + bx + c = 0 \qquad \text{con } a \neq 0.$$

I numeri $a$, $b$ e $c$ sono i coefficienti: $a$ è il coefficiente di $x^2$, $b$ quello di $x$, e $c$ è il termine noto. La condizione $a \neq 0$ serve perché, senza il termine in $x^2$, l'equazione sarebbe di primo grado.

Per leggere i coefficienti conta anche il segno. In $3x^2 - x - 2 = 0$ hai $a = 3$, $b = -1$ e $c = -2$. In $x^2 - 5 = 0$ il termine in $x$ manca, quindi $b = 0$.

I valori di $x$ che rendono vera l'equazione si chiamano **soluzioni** o **radici**. Quando sono due, si indicano con $x_1$ e $x_2$ e si mette per prima la più piccola: $x_1 < x_2$.

## Equazioni incomplete

Se $b$ o $c$ (o tutti e due) sono uguali a zero, l'equazione è **incompleta**; se sono entrambi diversi da zero, è **completa**. Le incomplete si risolvono senza formula, con un metodo più corto che dipende dal coefficiente che manca.

| Nome | Coefficienti | Forma | Come si risolve |
|---|---|---|---|
| pura | $b = 0$, $c \neq 0$ | $ax^2 + c = 0$ | si ricava $x^2$ |
| spuria | $b \neq 0$, $c = 0$ | $ax^2 + bx = 0$ | si raccoglie $x$ |
| monomia | $b = 0$, $c = 0$ | $ax^2 = 0$ | l'unica soluzione è $0$ |

### Equazione pura

In un'equazione **pura** manca il termine in $x$. Porti $c$ a secondo membro e dividi per $a$:

$$ax^2 + c = 0 \quad\Rightarrow\quad x^2 = -\frac{c}{a}$$

Se il numero a secondo membro è positivo, le soluzioni sono due, opposte tra loro: $x = \pm\sqrt{-\dfrac{c}{a}}$. Se è negativo, non ci sono soluzioni reali, perché il quadrato di un numero reale non è mai negativo.

```ad-example
Esempio 1: pura con due soluzioni razionali
$$4x^2 - 49 = 0$$

$$4x^2 = 49 \quad\Rightarrow\quad x^2 = \frac{49}{4} \quad\Rightarrow\quad x = \pm\sqrt{\frac{49}{4}} = \pm\frac{7}{2}$$

Le soluzioni sono $x_1 = -\dfrac{7}{2}$ e $x_2 = \dfrac{7}{2}$, quindi $S = \left\{-\dfrac{7}{2},\ \dfrac{7}{2}\right\}$.
```

```ad-example
Esempio 2: pura senza soluzioni
$$2x^2 + 8 = 0$$

$$2x^2 = -8 \quad\Rightarrow\quad x^2 = -4$$

Nessun numero reale ha il quadrato uguale a $-4$. L'equazione non ha soluzioni reali: $S = \emptyset$.
```

```ad-example
Esempio 3: pura con soluzioni irrazionali
$$3x^2 - 24 = 0$$

$$3x^2 = 24 \quad\Rightarrow\quad x^2 = 8 \quad\Rightarrow\quad x = \pm\sqrt{8}$$

Il radicale si semplifica, perché $8 = 4 \cdot 2$: $\sqrt{8} = 2\sqrt{2}$. Quindi $x_1 = -2\sqrt{2}$ e $x_2 = 2\sqrt{2}$.
```

```ad-warning
Il più o meno nella pura
Da $x^2 = 9$ le soluzioni sono due, $-3$ e $3$, non soltanto $3$. E da $x^2 = -4$ non si ottiene $x = \pm 2$: l'equazione non ha soluzioni reali.
```

### Equazione spuria

In un'equazione **spuria** manca il termine noto. Raccogli $x$ a fattore comune:

$$ax^2 + bx = 0 \quad\Rightarrow\quad x(ax + b) = 0$$

Un prodotto vale zero se e solo se almeno uno dei fattori vale zero (è la **legge di annullamento del prodotto**). Quindi $x = 0$ oppure $ax + b = 0$, cioè $x = -\dfrac{b}{a}$. Una spuria ha sempre due soluzioni distinte, e una delle due è $0$.

```ad-example
Esempio 4: spuria
$$2x^2 - 6x = 0$$

Raccogli $2x$, il fattore comune più grande:

$$2x(x - 3) = 0$$

Il primo fattore si annulla per $x = 0$, il secondo per $x = 3$. Le soluzioni sono $x_1 = 0$ e $x_2 = 3$: $S = \{0,\ 3\}$.
```

```ad-warning
Dividere per x nella spuria
Da $2x^2 - 6x = 0$ non si passa a $2x - 6 = 0$ dividendo per $x$: così perdi la soluzione $x = 0$. Il secondo principio permette di dividere solo per numeri diversi da zero, e $x$ potrebbe valere zero. Raccogli $x$ a fattore comune.
```

```ad-example
Esempio 5: spuria con soluzione frazionaria
$$3x^2 + 5x = 0$$

$$x(3x + 5) = 0 \quad\Rightarrow\quad x = 0 \quad \text{oppure} \quad 3x + 5 = 0 \ \Rightarrow\ x = -\frac{5}{3}$$

In ordine crescente, $x_1 = -\dfrac{5}{3}$ e $x_2 = 0$.
```

### Equazione monomia

Quando mancano sia $b$ sia $c$ resta $ax^2 = 0$. Dividendo per $a$ si ottiene $x^2 = 0$, che ha la sola soluzione $x = 0$: per esempio $5x^2 = 0$ ha $S = \{0\}$. Si dice che $0$ è una soluzione doppia, perché è come se le due soluzioni coincidessero.

## Equazioni complete: la formula risolutiva

Un'equazione completa $ax^2 + bx + c = 0$ si risolve con la **formula risolutiva**. Per prima cosa si calcola il **discriminante**, indicato con la lettera greca $\Delta$ (delta):

$$\Delta = b^2 - 4ac$$

Poi, se $\Delta \geq 0$, le soluzioni sono

$$x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}$$

Il simbolo $\pm$ indica due conti: uno con il segno meno e uno con il segno più. Se $a$ è positivo, il segno meno dà la soluzione più piccola, cioè $x_1$, e il segno più dà $x_2$. Per questo conviene rendere $a$ positivo prima di cominciare, moltiplicando se serve tutta l'equazione per $-1$.

### I tre casi del discriminante

Il segno di $\Delta$ dice quante soluzioni ha l'equazione, prima ancora di usare la formula.

| Discriminante | Soluzioni reali | Insieme delle soluzioni |
|---|---|---|
| $\Delta > 0$ | due, distinte | $S = \{x_1,\ x_2\}$ con $x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a}$ |
| $\Delta = 0$ | due coincidenti (una soluzione doppia) | $S = \left\{-\dfrac{b}{2a}\right\}$ |
| $\Delta < 0$ | nessuna | $S = \emptyset$ |

Con $\Delta = 0$ la radice vale $0$, e i due conti con il più e con il meno danno lo stesso numero, $-\dfrac{b}{2a}$. Con $\Delta < 0$ la radice quadrata di un numero negativo non esiste tra i numeri reali, e quindi l'equazione non ha soluzioni reali.

```ad-note
Per i curiosi: i numeri complessi
Quando $\Delta < 0$ esistono comunque due soluzioni in un insieme più grande dei reali, quello dei numeri complessi, che si studia alla fine delle superiori o all'università. Negli esercizi e nelle verifiche del biennio la risposta giusta per $\Delta < 0$ è "nessuna soluzione reale", $S = \emptyset$.
```

```ad-note
Da dove viene la formula
Moltiplica entrambi i membri di $ax^2 + bx + c = 0$ per $4a$ e porta $4ac$ a secondo membro: $4a^2x^2 + 4abx = -4ac$. Aggiungi $b^2$ a entrambi i membri: a sinistra ottieni il quadrato di un binomio, $(2ax + b)^2 = b^2 - 4ac$. Se $\Delta = b^2 - 4ac$ non è negativo, $2ax + b = \pm\sqrt{\Delta}$, e ricavando $x$ si ottiene la formula. Questo spiega anche il ruolo di $\Delta$: un quadrato non può essere uguale a un numero negativo.
```

### Quando il discriminante non è un quadrato perfetto

Se $\Delta$ è un quadrato perfetto ($1$, $4$, $9$, $16$, ...) e i coefficienti sono interi, le soluzioni sono numeri razionali, interi o frazioni. Se invece $\Delta$ è positivo ma non è un quadrato perfetto, $\sqrt{\Delta}$ è un numero irrazionale, e lo sono anche le soluzioni: si lasciano scritte con il radicale, senza trasformarle in numeri decimali.

Il risultato va semplificato in due passaggi:

1. semplifica $\sqrt{\Delta}$ portando fuori dalla radice i fattori quadrati, per esempio $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$;
2. se $-b$, il coefficiente davanti al radicale e $2a$ hanno un divisore comune, dividili tutti e tre per quel numero, per esempio $\dfrac{8 \pm 6\sqrt{2}}{2} = 4 \pm 3\sqrt{2}$.

```ad-tip
La formula ridotta, quando b è pari
Se $b$ è pari, i conti si accorciano con la formula ridotta, che usa $\dfrac{b}{2}$ al posto di $b$:

$$\frac{\Delta}{4} = \left(\frac{b}{2}\right)^2 - ac \qquad x_{1,2} = \frac{-\dfrac{b}{2} \pm \sqrt{\dfrac{\Delta}{4}}}{a}$$

Dà le stesse soluzioni della formula completa, con numeri più piccoli e spesso senza bisogno di semplificare alla fine. Per $x^2 - 8x - 2 = 0$ hai $\dfrac{b}{2} = -4$, $\dfrac{\Delta}{4} = 16 + 2 = 18$ e $\sqrt{18} = 3\sqrt{2}$, quindi $x_{1,2} = 4 \pm 3\sqrt{2}$.
```

## Come si risolve un'equazione di secondo grado

1. Porta l'equazione in forma normale: svolgi i prodotti, porta tutti i termini a primo membro, riduci i termini simili e ordinali per grado, $ax^2 + bx + c = 0$.
2. Se $a$ è negativo, moltiplica tutto per $-1$. Se tutti i coefficienti hanno un divisore comune, dividi per quel numero.
3. Guarda quali termini ci sono. Se l'equazione è pura, spuria o monomia, risolvila con il suo metodo; se è completa, prosegui.
4. Calcola $\Delta = b^2 - 4ac$. Se è negativo hai finito: $S = \emptyset$.
5. Applica la formula, poi semplifica il radicale e la frazione.
6. Scrivi le soluzioni in ordine crescente, $x_1 < x_2$, e l'insieme $S$.

## Esempi svolti

Gli esempi vanno dal più semplice al meno semplice. Le equazioni incomplete sono negli esempi da 1 a 5.

### Coefficiente di $x^2$ uguale a 1

```ad-example
Esempio 6: due soluzioni intere
$$x^2 - 5x + 6 = 0$$

I coefficienti sono $a = 1$, $b = -5$, $c = 6$.

$$\Delta = (-5)^2 - 4 \cdot 1 \cdot 6 = 25 - 24 = 1$$

$$x_{1,2} = \frac{5 \pm \sqrt{1}}{2} = \frac{5 \pm 1}{2}$$

Con il meno $x_1 = \dfrac{4}{2} = 2$, con il più $x_2 = \dfrac{6}{2} = 3$. Quindi $S = \{2,\ 3\}$.
```

```ad-warning
Il segno di b nella formula
Se $b = -5$, allora $-b = 5$ e $b^2 = (-5)^2 = 25$. Scrivere $-5^2$ senza parentesi dà $-25$, perché l'esponente si applica solo al $5$: metti sempre $b$ tra parentesi quando è negativo.
```

```ad-example
Esempio 7: soluzioni di segno diverso
$$x^2 + 2x - 15 = 0$$

Qui $a = 1$, $b = 2$, $c = -15$. Con $c$ negativo, $-4ac$ diventa positivo:

$$\Delta = 2^2 - 4 \cdot 1 \cdot (-15) = 4 + 60 = 64$$

$$x_{1,2} = \frac{-2 \pm 8}{2} \quad\Rightarrow\quad x_1 = \frac{-10}{2} = -5, \quad x_2 = \frac{6}{2} = 3$$

$S = \{-5,\ 3\}$.
```

### Coefficiente di $x^2$ diverso da 1

```ad-example
Esempio 8: una soluzione frazionaria
$$2x^2 + 5x - 3 = 0$$

$$\Delta = 5^2 - 4 \cdot 2 \cdot (-3) = 25 + 24 = 49$$

$$x_{1,2} = \frac{-5 \pm 7}{4} \quad\Rightarrow\quad x_1 = \frac{-12}{4} = -3, \quad x_2 = \frac{2}{4} = \frac{1}{2}$$

$S = \left\{-3,\ \dfrac{1}{2}\right\}$. Il denominatore è $2a = 4$, non $2$.
```

```ad-warning
Il segno di 4ac
Con $a$ e $c$ di segno opposto, $-4ac$ è positivo. In $2x^2 + 5x - 3 = 0$ il discriminante è $25 - 4 \cdot 2 \cdot (-3) = 25 + 24$, non $25 - 24$.
```

```ad-warning
Il denominatore della formula
Si divide per $2a$, e si divide tutto il numeratore, non solo il radicale. Con $a = 2$ il denominatore è $4$, non $2$ e non $a$.
```

```ad-example
Esempio 9: due soluzioni frazionarie
$$6x^2 - x - 2 = 0$$

$$\Delta = (-1)^2 - 4 \cdot 6 \cdot (-2) = 1 + 48 = 49$$

$$x_{1,2} = \frac{1 \pm 7}{12} \quad\Rightarrow\quad x_1 = \frac{-6}{12} = -\frac{1}{2}, \quad x_2 = \frac{8}{12} = \frac{2}{3}$$

$S = \left\{-\dfrac{1}{2},\ \dfrac{2}{3}\right\}$.
```

```ad-example
Esempio 10: prima dividi
$$3x^2 + 12x - 15 = 0$$

Tutti i coefficienti sono multipli di $3$. Dividendo per $3$ ottieni un'equazione equivalente, con numeri più piccoli:

$$x^2 + 4x - 5 = 0$$

$$\Delta = 16 + 20 = 36 \qquad x_{1,2} = \frac{-4 \pm 6}{2} \quad\Rightarrow\quad x_1 = -5, \quad x_2 = 1$$

$S = \{-5,\ 1\}$.
```

### Soluzioni irrazionali

```ad-example
Esempio 11: radicale che non si semplifica
$$x^2 - 5x + 1 = 0$$

$$\Delta = 25 - 4 = 21$$

$21 = 3 \cdot 7$ non ha fattori quadrati, quindi $\sqrt{21}$ resta com'è:

$$x_1 = \frac{5 - \sqrt{21}}{2}, \qquad x_2 = \frac{5 + \sqrt{21}}{2}$$
```

```ad-example
Esempio 12: radicale da semplificare
$$x^2 - 8x - 2 = 0$$

$$\Delta = (-8)^2 - 4 \cdot 1 \cdot (-2) = 64 + 8 = 72$$

Semplifica il radicale: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$. Poi dividi per $2$ tutti e tre i numeri, $8$, $6$ e il denominatore:

$$x_{1,2} = \frac{8 \pm 6\sqrt{2}}{2} = 4 \pm 3\sqrt{2}$$

Quindi $x_1 = 4 - 3\sqrt{2}$ e $x_2 = 4 + 3\sqrt{2}$. Con la formula ridotta arrivi allo stesso risultato con meno conti.
```

```ad-warning
Semplificare un termine solo
In $\dfrac{8 \pm 6\sqrt{2}}{2}$ il $2$ divide sia $8$ sia $6\sqrt{2}$: il risultato è $4 \pm 3\sqrt{2}$, non $4 \pm 6\sqrt{2}$. Se uno dei termini del numeratore non è divisibile per il denominatore, la frazione non si semplifica.
```

```ad-example
Esempio 13: coefficiente di x² diverso da 1
$$2x^2 - 2x - 1 = 0$$

$$\Delta = 4 + 8 = 12, \qquad \sqrt{12} = \sqrt{4 \cdot 3} = 2\sqrt{3}$$

$$x_{1,2} = \frac{2 \pm 2\sqrt{3}}{4} = \frac{1 \pm \sqrt{3}}{2}$$

Hai diviso per $2$ tutti e tre i numeri: il $2$ iniziale, il $2$ davanti a $\sqrt{3}$ e il $4$ al denominatore. Le soluzioni sono $x_1 = \dfrac{1 - \sqrt{3}}{2}$ e $x_2 = \dfrac{1 + \sqrt{3}}{2}$.
```

### Termini in entrambi i membri

```ad-example
Esempio 14: da portare in forma normale
$$x^2 + 2x - 1 = 7x^2 - 11x + 5$$

Porta tutto a primo membro, cambiando segno ai termini che attraversano l'uguale, e riduci:

$$x^2 - 7x^2 + 2x + 11x - 1 - 5 = 0 \quad\Rightarrow\quad -6x^2 + 13x - 6 = 0$$

Il coefficiente di $x^2$ è negativo: moltiplica per $-1$.

$$6x^2 - 13x + 6 = 0$$

$$\Delta = 169 - 144 = 25 \qquad x_{1,2} = \frac{13 \pm 5}{12} \quad\Rightarrow\quad x_1 = \frac{8}{12} = \frac{2}{3}, \quad x_2 = \frac{18}{12} = \frac{3}{2}$$

$S = \left\{\dfrac{2}{3},\ \dfrac{3}{2}\right\}$.
```

```ad-warning
Leggere i coefficienti prima della forma normale
In $x^2 + 2x - 1 = 7x^2 - 11x + 5$ il coefficiente $a$ non è $1$: prima porta tutto a primo membro, poi leggi $a$, $b$ e $c$.
```

```ad-example
Esempio 15: con un quadrato da sviluppare
$$(x - 1)^2 = 2x + 3$$

Sviluppa il quadrato del binomio, poi porta tutto a primo membro:

$$x^2 - 2x + 1 = 2x + 3 \quad\Rightarrow\quad x^2 - 4x - 2 = 0$$

$$\Delta = 16 + 8 = 24, \qquad \sqrt{24} = 2\sqrt{6}, \qquad x_{1,2} = \frac{4 \pm 2\sqrt{6}}{2} = 2 \pm \sqrt{6}$$

Quindi $x_1 = 2 - \sqrt{6}$ e $x_2 = 2 + \sqrt{6}$.
```

### Discriminante nullo o negativo

```ad-example
Esempio 16: soluzione doppia
$$4x^2 - 12x + 9 = 0$$

$$\Delta = (-12)^2 - 4 \cdot 4 \cdot 9 = 144 - 144 = 0$$

Le due soluzioni coincidono:

$$x_1 = x_2 = \frac{12}{2 \cdot 4} = \frac{12}{8} = \frac{3}{2}$$

$S = \left\{\dfrac{3}{2}\right\}$. Infatti il primo membro è il quadrato di un binomio, $4x^2 - 12x + 9 = (2x - 3)^2$.
```

```ad-example
Esempio 17: nessuna soluzione reale
$$2x^2 - 4x + 5 = 0$$

$$\Delta = (-4)^2 - 4 \cdot 2 \cdot 5 = 16 - 40 = -24$$

Il discriminante è negativo: l'equazione non ha soluzioni reali, $S = \emptyset$. Non serve applicare la formula.
```

```ad-tip
Controllo veloce con somma e prodotto
Se le soluzioni sono $x_1$ e $x_2$, allora $x_1 + x_2 = -\dfrac{b}{a}$ e $x_1 \cdot x_2 = \dfrac{c}{a}$. Nell'esempio 14, con $6x^2 - 13x + 6 = 0$: $\dfrac{2}{3} + \dfrac{3}{2} = \dfrac{13}{6}$, che è $-\dfrac{b}{a}$, e $\dfrac{2}{3} \cdot \dfrac{3}{2} = 1$, che è $\dfrac{c}{a}$. Se uno dei due conti non torna, c'è un errore.
```

Dopo questa lezione puoi passare alle [disequazioni di secondo grado](/materiale/scuola-superiore/matematica/parabola-e-disequazioni-di-secondo-grado/disequazioni-di-secondo-grado), che si risolvono partendo proprio dalle soluzioni dell'equazione associata.
