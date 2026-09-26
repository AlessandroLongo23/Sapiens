# Numeri interi e valore assoluto

Un termometro che d'inverno scende sotto lo zero segna $-4$ gradi; un conto in banca con $50$ euro da cui ne escono $80$ resta in rosso di $30$, cioè a $-30$ euro. Per dire quanto sotto lo zero si trova una grandezza servono i numeri negativi, che insieme ai naturali formano i numeri interi. Qui trovi come sono fatti, come si rappresentano su una retta, che cosa sono l'opposto e il valore assoluto di un numero e come si confrontano due interi, anche quando sono entrambi negativi.

## Perché servono i numeri negativi

Nei [numeri naturali](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n) la sottrazione non si può fare sempre: $8 - 3 = 5$ esiste, ma $3 - 8$ no, perché nessun naturale sommato a $8$ dà $3$. Eppure la situazione è comune: se la temperatura è di $3$ gradi e scende di $8$, arriva a $5$ gradi sotto lo zero, che si scrive $-5$. Allo stesso modo, se hai $3$ euro e ne spendi $8$, hai un debito di $5$ euro.

Per poter sottrarre sempre si aggiungono ai naturali i numeri negativi $-1, -2, -3, \dots$, uno per ogni naturale diverso da $0$. Con questi numeri $3 - 8 = -5$; come si calcolano le operazioni lo trovi nella lezione [Operazioni in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/operazioni-in-z).

## L'insieme ℤ

L'insieme dei **numeri interi** (detti anche interi relativi) è formato dai naturali e dai loro opposti negativi:

$$\mathbb{Z} = \{\dots, -3, -2, -1, 0, 1, 2, 3, \dots\}$$

Ogni intero diverso da $0$ ha un segno: è **positivo** se è maggiore di $0$ ($1, 2, 3, \dots$) ed è **negativo** se è minore di $0$ ($-1, -2, -3, \dots$). Lo zero non è né positivo né negativo. I positivi si possono scrivere con il segno davanti, $+7$, oppure senza, $7$: è lo stesso numero. Il segno meno invece non si omette mai, perché $-7$ e $7$ sono numeri diversi.

Ogni numero naturale è anche un intero, mentre non vale il contrario: $5 \in \mathbb{Z}$ e $5 \in \mathbb{N}$, ma $-5 \in \mathbb{Z}$ e $-5 \notin \mathbb{N}$. Quindi $\mathbb{N}$ è un [sottoinsieme proprio](/materiale/scuola-superiore/matematica/insiemi-e-logica/sottoinsiemi-e-uguaglianza) di $\mathbb{Z}$:

$$\mathbb{N} \subset \mathbb{Z}$$

In $\mathbb{Z}$ la sottrazione è sempre possibile, cioè è un'operazione interna: la differenza di due interi qualsiasi è ancora un intero.

## La retta dei numeri

Gli interi si rappresentano su una retta. Si sceglie un punto $O$, l'**origine**, a cui corrisponde lo $0$; un verso di percorrenza, indicato da una freccia, di solito verso destra; e un'unità di misura, cioè la lunghezza del segmento che va da $0$ a $1$. Una retta con questi tre elementi si chiama **retta orientata**. A partire dall'origine, i positivi si segnano a destra a distanza $1, 2, 3, \dots$ unità e i negativi a sinistra, alla stessa distanza.

```tikz
% nome: numeri-interi-retta-orientata
% alt: Retta orientata verso destra con l'origine O nello zero e segnati i numeri interi da meno 5 a 5, i negativi a sinistra dello zero e i positivi a destra
% svg: numeri-interi-retta-orientata-eddb077d.svg 436x54
\begin{tikzpicture}
\draw[->] (-5.6,0) -- (5.8,0);
\draw (-5,-0.1) -- (-5,0.1);
\draw (-4,-0.1) -- (-4,0.1);
\draw (-3,-0.1) -- (-3,0.1);
\draw (-2,-0.1) -- (-2,0.1);
\draw (-1,-0.1) -- (-1,0.1);
\draw (0,-0.1) -- (0,0.1);
\draw (1,-0.1) -- (1,0.1);
\draw (2,-0.1) -- (2,0.1);
\draw (3,-0.1) -- (3,0.1);
\draw (4,-0.1) -- (4,0.1);
\draw (5,-0.1) -- (5,0.1);
\node[below] at (-5,-0.15) {$-5$};
\node[below] at (-4,-0.15) {$-4$};
\node[below] at (-3,-0.15) {$-3$};
\node[below] at (-2,-0.15) {$-2$};
\node[below] at (-1,-0.15) {$-1$};
\node[below] at (0,-0.15) {$0$};
\node[below] at (1,-0.15) {$1$};
\node[below] at (2,-0.15) {$2$};
\node[below] at (3,-0.15) {$3$};
\node[below] at (4,-0.15) {$4$};
\node[below] at (5,-0.15) {$5$};
\fill (0,0) circle (0.06);
\node[above] at (0,0.15) {$O$};
\node[above] at (-3,0.15) {negativi};
\node[above] at (3,0.15) {positivi};
\end{tikzpicture}
```

Ogni intero ha un **successivo**, quello subito a destra, che si ottiene aggiungendo $1$, e un **precedente**, quello subito a sinistra, che si ottiene togliendo $1$. Il successivo di $-5$ è $-4$, il precedente di $-5$ è $-6$. Tra due interi consecutivi non ci sono altri interi.

```ad-warning
Il successivo di un negativo
Il successivo di $-5$ è $-4$, non $-6$: il successivo sta a destra, cioè verso lo zero. $-6$ è il precedente.
```

In $\mathbb{N}$ c'è un numero più piccolo di tutti, lo $0$, che non ha un precedente. In $\mathbb{Z}$ invece ogni numero ha un precedente e un successivo, quindi non esiste un intero più piccolo di tutti, e nemmeno uno più grande di tutti.

## Numeri concordi e discordi

Due interi diversi da $0$ sono **concordi** se hanno lo stesso segno e **discordi** se hanno segno diverso. Per esempio $+3$ e $+8$ sono concordi, e lo sono anche $-2$ e $-9$; invece $-4$ e $+6$ sono discordi.

Lo zero non ha segno, quindi non è né concorde né discorde con nessun numero.

## Numeri opposti

Due interi sono **opposti** se hanno lo stesso numero di unità ma segno diverso, come $+3$ e $-3$: sulla retta stanno alla stessa distanza dall'origine, uno a destra e uno a sinistra. L'opposto di un numero $a$ si scrive $-a$:

- l'opposto di $7$ è $-7$;
- l'opposto di $-7$ è $-(-7) = 7$;
- l'opposto di $0$ è $0$, perché $-0 = 0$.

Due opposti diversi da $0$ sono sempre discordi. L'opposto dell'opposto è il numero di partenza, $-(-a) = a$, perché sulla retta si va dall'altra parte dello zero e poi si torna indietro.

```ad-warning
Il segno meno davanti a una lettera
$-a$ vuol dire "l'opposto di $a$", non "un numero negativo". Se $a = -7$, allora $-a = 7$, che è positivo.
```

## Valore assoluto

Il **valore assoluto** di un intero $a$, che si scrive $|a|$, è la sua distanza dall'origine sulla retta dei numeri, misurata in unità. Per esempio $|5| = 5$ e $|-5| = 5$, perché sia $5$ sia $-5$ stanno a $5$ unità da $0$.

In pratica il valore assoluto si ottiene togliendo il segno: $|+12| = 12$, $|-12| = 12$, $|0| = 0$. Scritto con le lettere:

$$|a| = \begin{cases} a & \text{se } a \geq 0 \\ -a & \text{se } a < 0 \end{cases}$$

La seconda riga dice che il valore assoluto di un negativo è il suo opposto, che è positivo: $|-4| = -(-4) = 4$.

```tikz
% nome: valore-assoluto-opposti-retta
% alt: Retta dei numeri con segnati i numeri opposti meno 3 e 3, entrambi a distanza 3 dallo zero, quindi con lo stesso valore assoluto 3
% svg: valore-assoluto-opposti-retta-0fd1341a.svg 436x65
\begin{tikzpicture}
\draw[->] (-5.6,0) -- (5.8,0);
\draw (-5,-0.1) -- (-5,0.1);
\draw (-4,-0.1) -- (-4,0.1);
\draw (-3,-0.1) -- (-3,0.1);
\draw (-2,-0.1) -- (-2,0.1);
\draw (-1,-0.1) -- (-1,0.1);
\draw (0,-0.1) -- (0,0.1);
\draw (1,-0.1) -- (1,0.1);
\draw (2,-0.1) -- (2,0.1);
\draw (3,-0.1) -- (3,0.1);
\draw (4,-0.1) -- (4,0.1);
\draw (5,-0.1) -- (5,0.1);
\node[below] at (-5,-0.15) {$-5$};
\node[below] at (-4,-0.15) {$-4$};
\node[below] at (-3,-0.15) {$-3$};
\node[below] at (-2,-0.15) {$-2$};
\node[below] at (-1,-0.15) {$-1$};
\node[below] at (0,-0.15) {$0$};
\node[below] at (1,-0.15) {$1$};
\node[below] at (2,-0.15) {$2$};
\node[below] at (3,-0.15) {$3$};
\node[below] at (4,-0.15) {$4$};
\node[below] at (5,-0.15) {$5$};
\fill (-3,0) circle (0.07);
\fill (3,0) circle (0.07);
\draw[<->] (-3,0.35) -- (-0.05,0.35);
\draw[<->] (0.05,0.35) -- (3,0.35);
\node[above] at (-1.5,0.4) {$|{-3}| = 3$};
\node[above] at (1.5,0.4) {$|3| = 3$};
\end{tikzpicture}
```

Dalla definizione vengono alcune proprietà:

- $|a| \geq 0$ per ogni intero $a$: una distanza non è mai negativa;
- $|a| = 0$ solo quando $a = 0$;
- $|-a| = |a|$: due numeri opposti hanno lo stesso valore assoluto;
- viceversa, due interi con lo stesso valore assoluto sono uguali oppure opposti. Per esempio gli interi con valore assoluto $4$ sono due, $4$ e $-4$.

```ad-warning
Il segno fuori dal valore assoluto
In $-|-5|$ il valore assoluto si calcola per primo, $|-5| = 5$, e poi si prende l'opposto: $-|-5| = -5$, non $5$. Il valore assoluto toglie il segno solo a quello che sta dentro le sbarre.
```

```ad-note
Anche per frazioni e decimali
Opposto e valore assoluto si definiscono allo stesso modo per tutti i numeri che hanno un posto sulla retta: $\left|-\dfrac{3}{4}\right| = \dfrac{3}{4}$ e $|-2{,}5| = 2{,}5$.
```

## Confronto tra numeri interi

Sulla retta orientata verso destra, un intero $a$ è **minore** di un intero $b$, e si scrive $a < b$, quando $a$ sta a sinistra di $b$. Allo stesso modo $a > b$ vuol dire che $a$ sta a destra di $b$. Da qui vengono tre regole.

1. Ogni positivo è maggiore di $0$, e $0$ è maggiore di ogni negativo: $-9 < 0 < 2$.
2. Tra due positivi è maggiore quello con il valore assoluto maggiore: $12 > 7$.
3. Tra due negativi è maggiore quello con il valore assoluto minore, perché sta più vicino allo zero, cioè più a destra: $-7 > -12$.

La terza regola è quella che si sbaglia più spesso. Con le temperature è evidente: $-2$ gradi è più caldo di $-10$ gradi, quindi $-2 > -10$.

```ad-warning
Confrontare i negativi come se fossero positivi
$-12 < -7$, anche se $12 > 7$. Tra due negativi il più grande è quello più vicino allo zero, cioè quello con il valore assoluto minore.
```

```ad-warning
Confrontare i valori assoluti al posto dei numeri
$|-8| > |3|$, ma $-8 < 3$. Il valore assoluto dice quanto un numero è lontano dallo zero, non se è più grande: un negativo è sempre minore di un positivo.
```

Il procedimento per ordinare un gruppo di interi in ordine crescente è questo.

1. Separa i negativi, l'eventuale zero e i positivi.
2. Ordina i negativi partendo da quello con il valore assoluto maggiore.
3. Scrivi lo zero, se c'è.
4. Ordina i positivi partendo da quello con il valore assoluto minore.

Per l'ordine decrescente si scrive la stessa fila al contrario.

```ad-example
Esempio 1: confronto tra due interi
Confronta le coppie $5$ e $-8$; $-3$ e $0$; $-12$ e $-9$.

$5$ e $-8$ sono discordi: il positivo è maggiore, $5 > -8$.

$-3$ è negativo, quindi $-3 < 0$.

$-12$ e $-9$ sono negativi: $|-12| = 12$ e $|-9| = 9$, quindi il maggiore è $-9$, quello con il valore assoluto minore. Si scrive $-12 < -9$.
```

```ad-example
Esempio 2: ordine crescente
Ordina in ordine crescente $4, -7, 0, -1, 12, -15, 3$.

I negativi sono $-7, -1, -15$, con valori assoluti $7, 1, 15$: si parte da quello con il valore assoluto maggiore, quindi $-15 < -7 < -1$. Poi viene lo $0$. I positivi sono $4, 12, 3$, e in ordine crescente $3 < 4 < 12$. In tutto:

$$-15 < -7 < -1 < 0 < 3 < 4 < 12$$
```

```ad-example
Esempio 3: con opposti e valori assoluti
Ordina in ordine crescente $|-6|$, $-(-4)$, $-|-9|$, $-|5|$, $-(+2)$.

Prima si calcola ogni numero:

$|-6| = 6 \qquad -(-4) = 4 \qquad -|-9| = -9 \qquad -|5| = -5 \qquad -(+2) = -2$

I negativi sono $-9, -5, -2$ e i positivi $4, 6$, quindi

$$
\begin{aligned}
&-|-9| < -|5| < \\
&\quad -(+2) < -(-4) < |-6|
\end{aligned}
$$

cioè $-9 < -5 < -2 < 4 < 6$.
```

```ad-example
Esempio 4: interi compresi tra due numeri
Scrivi gli interi compresi tra $-4$ e $2$, estremi esclusi, e poi l'insieme $\{x \in \mathbb{Z} \mid -4 \leq x < 2\}$.

Sulla retta, tra $-4$ e $2$ ci sono $-3, -2, -1, 0, 1$: sono cinque interi. Il $2$ è escluso, e anche il $-4$.

Nell'insieme il segno $\leq$ include $-4$ mentre il $<$ esclude $2$, quindi $\{x \in \mathbb{Z} \mid -4 \leq x < 2\} = \{-4, -3, -2, -1, 0, 1\}$.
```

```ad-example
Esempio 5: temperature
Un mattino di gennaio a Bolzano ci sono $-6$ gradi, a Milano $-1$, a Roma $4$ e a Cortina $-11$. Qual è la città più fredda? In quale la temperatura è più lontana dallo zero?

La città più fredda è quella con la temperatura minore. In ordine crescente $-11 < -6 < -1 < 4$, quindi è Cortina.

La distanza dallo zero è il valore assoluto: $|-11| = 11$, $|-6| = 6$, $|-1| = 1$, $|4| = 4$. La più lontana dallo zero è ancora Cortina, con $11$ gradi sotto; la più vicina è Milano, con $1$ grado sotto. Roma è la città più calda, ma con $4$ gradi è più lontana dallo zero di Milano.
```
