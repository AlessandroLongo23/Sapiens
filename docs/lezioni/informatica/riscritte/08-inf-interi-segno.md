# Numeri interi con segno e complemento a due

La temperatura di una notte d'inverno è $-5$ gradi, il saldo di un conto può andare sotto zero, in un videogioco un punteggio può scendere a $-20$. Un calcolatore però ha solo bit: non c'è un posto dove scrivere il segno meno. Anche il segno, quindi, va codificato con degli $0$ e degli $1$, e il modo in cui lo si fa decide quali numeri si possono scrivere e come si fanno le somme.

In tutta la lezione i numeri occupano 8 bit, cioè un byte, salvo dove è scritto diversamente. Per passare dal binario al decimale e viceversa serve la lezione [Conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale).

## Modulo e segno

L'idea più diretta è copiare quello che si fa sulla carta: un simbolo per il segno, poi il numero. Nella rappresentazione in **modulo e segno** il bit più significativo (MSB), cioè il primo a sinistra, dice il segno: $0$ per i positivi, $1$ per i negativi. Gli altri 7 bit sono il modulo, cioè il numero senza segno, scritto in binario.

Il numero $37$ in binario è $100101_2$. Su 8 bit, in modulo e segno, $+37$ si scrive $0010\,0101$ e $-37$ si scrive $1010\,0101$: cambia solo il primo bit.

Con 7 bit il modulo arriva a $2^7 - 1 = 127$, quindi con 8 bit in modulo e segno si scrivono i numeri da $-127$ a $+127$.

```ad-example
Esempio 1: leggere un numero in modulo e segno
Quale numero rappresenta $1001\,0011$ in modulo e segno?

L'MSB è $1$: il numero è negativo. Gli altri 7 bit sono $001\,0011_2 = 16 + 2 + 1 = 19$.

Il numero è $-19$.
```

Il modulo e segno si legge bene, ma ha due difetti che lo rendono scomodo per un calcolatore.

Il primo: lo zero si scrive in due modi. $0000\,0000$ è $+0$ e $1000\,0000$ è $-0$, due sequenze diverse per lo stesso numero. Una delle $256$ sequenze è sprecata, e per sapere se un numero è zero servono due controlli.

Il secondo, più grave: l'addizione binaria non funziona. Prova a sommare $5$ e $-3$ con la regola della lezione [Addizione e moltiplicazione in binario](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/addizione-e-moltiplicazione-in-binario):

$$0000\,0101 + 1000\,0011 = 1000\,1000$$

Il risultato, letto in modulo e segno, è $-8$, mentre $5 + (-3) = 2$. Per sommare due numeri in modulo e segno il calcolatore dovrebbe prima guardare i segni e poi decidere se sommare o sottrarre i moduli: un circuito in più.

## Il complemento a due

Il **complemento a due** è la rappresentazione dei numeri interi con segno che i calcolatori usano davvero. Si basa su un'idea sola: i bit hanno gli stessi pesi del binario, tranne l'MSB, che ha il peso negativo. Su 8 bit i pesi sono $-128$, $64$, $32$, $16$, $8$, $4$, $2$, $1$.

```tikz
% nome: pesi-complemento-a-due
% alt: Gli otto bit della sequenza 1110 1100 in otto caselle, con sopra ogni casella il suo peso: meno 128 per il bit più significativo, evidenziato, poi 64, 32, 16, 8, 4, 2 e 1; sotto, la somma dei pesi dei bit a 1, meno 128 più 64 più 32 più 8 più 4, che fa meno 20
% svg: pesi-complemento-a-due-a086fd3e.svg 283x81
\begin{tikzpicture}
\foreach \b/\w [count=\i from 0] in {1/-128, 1/64, 1/32, 0/16, 1/8, 1/4, 0/2, 0/1} {
  \ifnum\i=0
    \draw[thick, fill=orange!30] (\i*0.8,0) rectangle ++(0.8,0.8);
  \else
    \draw[thick, fill=blue!10] (\i*0.8,0) rectangle ++(0.8,0.8);
  \fi
  \node at (\i*0.8+0.4,0.4) {\b};
  \node[font=\small] at (\i*0.8+0.4,1.1) {$\w$};
}
\node[font=\small, left] at (-0.1,1.1) {peso};
\node[font=\small, left] at (-0.1,0.4) {bit};
\node[font=\small] at (3.2,-0.5) {$-128 + 64 + 32 + 8 + 4 = -20$};
\end{tikzpicture}
```

Per leggere un numero in complemento a due si sommano i pesi dei bit che valgono $1$, come in binario, ricordando che il primo peso è negativo. La sequenza $1110\,1100$ vale $-128 + 64 + 32 + 8 + 4 = -20$.

Da qui vengono due conseguenze. Se l'MSB è $0$, il peso negativo non entra nella somma: il numero è positivo o nullo e si legge come un normale numero binario. Se l'MSB è $1$, il numero è negativo, perché gli altri sette pesi insieme arrivano al massimo a $127$ e non riescono a compensare $-128$. L'MSB fa quindi anche da bit di segno, come nel modulo e segno, ma gli altri bit di un numero negativo non sono il suo modulo.

```ad-warning
Il complemento a due non è il modulo e segno
$1001\,0011$ in modulo e segno vale $-19$. In complemento a due vale $-128 + 16 + 2 + 1 = -109$. Prima di leggere una sequenza di bit devi sapere in quale rappresentazione è scritta.
```

### Scrivere un numero in complemento a due

Un numero positivo si scrive in binario, aggiungendo zeri a sinistra fino a 8 bit. Per un numero negativo $-x$:

1. Scrivi $x$ in binario su 8 bit, con gli zeri a sinistra.
2. Inverti tutti i bit: ogni $0$ diventa $1$ e ogni $1$ diventa $0$.
3. Somma $1$.

```ad-example
Esempio 2: scrivere un numero negativo
Scrivi $-20$ in complemento a due su 8 bit.

1. $20 = 16 + 4$, quindi su 8 bit è $0001\,0100$.
2. Inverti: $1110\,1011$.
3. Somma $1$: $1110\,1011 + 1 = 1110\,1100$.

È la sequenza della figura: $-128 + 64 + 32 + 8 + 4 = -20$.
```

```ad-example
Esempio 3: un riporto che attraversa tutti i bit
Scrivi $-96$ in complemento a due su 8 bit.

1. $96 = 64 + 32$, quindi su 8 bit è $0110\,0000$.
2. Inverti: $1001\,1111$.
3. Somma $1$: i cinque $1$ a destra diventano $0$ e il riporto arriva al sesto bit, $1001\,1111 + 1 = 1010\,0000$.

Controllo: $-128 + 32 = -96$.
```

```ad-warning
Due errori nel procedimento
Il primo è fermarsi al passo 2: $1110\,1011$ non è $-20$ ma $-21$. Il secondo è invertire il numero prima di averlo portato a 8 bit: $20$ è $10100_2$, e invertendo solo queste cinque cifre si perdono i tre $1$ che devono stare a sinistra.
```

### L'opposto di un numero

Lo stesso procedimento, inverti tutti i bit e somma $1$, trasforma qualunque numero nel suo opposto, in tutti e due i versi. Serve quindi anche per leggere un numero negativo: se l'MSB è $1$, inverti e somma $1$, leggi il numero positivo che ottieni e mettici davanti il meno.

```ad-example
Esempio 4: leggere un numero negativo con l'opposto
Quale numero rappresenta $1011\,0101$ in complemento a due?

L'MSB è $1$, quindi il numero è negativo. Inverti: $0100\,1010$. Somma $1$: $0100\,1011$, cioè $64 + 8 + 2 + 1 = 75$.

Il numero è $-75$. Con i pesi si arriva allo stesso risultato: $-128 + 32 + 16 + 4 + 1 = -75$.
```

## L'intervallo dei valori

Su 8 bit il numero più grande ha l'MSB a $0$ e tutti gli altri bit a $1$: $0111\,1111 = 127$. Il più piccolo ha solo l'MSB a $1$: $1000\,0000 = -128$. Lo zero si scrive in un modo solo, $0000\,0000$, e tutte le $256$ sequenze rappresentano numeri diversi: è il primo difetto del modulo e segno che sparisce.

Con $n$ bit vale la stessa cosa, con il peso $-2^{n-1}$ per l'MSB. In complemento a due su $n$ bit si scrivono i numeri

$$\text{da } -2^{n-1} \text{ a } 2^{n-1} - 1$$

| Bit | Numero più piccolo | Numero più grande |
|---|---|---|
| $4$ | $-8$ | $7$ |
| $8$ | $-128$ | $127$ |
| $16$ | $-32\,768$ | $32\,767$ |
| $32$ | $-2\,147\,483\,648$ | $2\,147\,483\,647$ |

I negativi sono uno in più dei positivi. Per questo $-128$ è l'unico numero su 8 bit che non ha l'opposto: $+128$ non si può scrivere, e se inverti $1000\,0000$ e sommi $1$ ritrovi $1000\,0000$.

```ad-example
Esempio 5: quanti bit servono
Quanti bit servono, come minimo, per scrivere $200$ in complemento a due? E per $-128$?

Con 8 bit si arriva a $127$: $200$ non ci sta. Con 9 bit l'intervallo va da $-256$ a $255$: servono 9 bit, anche se $200$ in binario ha solo 8 cifre ($1100\,1000_2$). Il nono bit è l'MSB a $0$ che dice che il numero è positivo.

Per $-128$ bastano 8 bit, perché è proprio il più piccolo numero dell'intervallo.
```

## La somma e il traboccamento

Il secondo difetto del modulo e segno sparisce anche lui: in complemento a due due numeri si sommano con l'addizione binaria, senza guardare i segni. C'è una sola regola in più: il riporto che esce a sinistra dell'ottavo bit si butta via.

```ad-example
Esempio 6: una somma con un numero negativo
Calcola $45 + (-28)$ su 8 bit in complemento a due.

$45$ è $0010\,1101$ e $-28$ è $1110\,0100$. Sommando in colonna:

$$0010\,1101 + 1110\,0100 = 1\;0001\,0001$$

Il nono bit a sinistra è il riporto finale e si scarta. Restano $0001\,0001 = 17$, che è proprio $45 - 28$.
```

Gli 8 bit però contengono solo i numeri da $-128$ a $127$. Quando il risultato vero di una somma esce da questo intervallo, negli 8 bit resta un numero sbagliato: è il **traboccamento** (in inglese overflow).

```ad-example
Esempio 7: una somma che trabocca
Calcola $100 + 50$ su 8 bit in complemento a due.

$100$ è $0110\,0100$ e $50$ è $0011\,0010$:

$$0110\,0100 + 0011\,0010 = 1001\,0110$$

Il risultato ha l'MSB a $1$, quindi è negativo: vale $-128 + 16 + 4 + 2 = -106$. La somma vera, $150$, è più grande di $127$ e non ci sta: il calcolatore ottiene $-106$, cioè $150 - 256$.
```

Per capire che cosa succede conviene disporre i numeri su una ruota. La figura lo fa con soli 3 bit, che vanno da $-4$ a $3$: sommare $1$ vuol dire fare un passo in senso orario, e dopo $011 = 3$ il passo successivo porta a $100 = -4$. Su 8 bit la ruota ha $256$ posizioni e il salto è tra $127$ e $-128$: chi esce da una parte rientra dall'altra, spostato di $256$.

```tikz
% nome: ruota-complemento-a-due-3-bit
% alt: Una ruota con le otto sequenze di 3 bit in complemento a due e il loro valore, in senso orario: 000 vale 0, 001 vale 1, 010 vale 2, 011 vale 3, 100 vale meno 4, 101 vale meno 3, 110 vale meno 2, 111 vale meno 1; una freccia evidenziata tra 011 e 100 segna il traboccamento, dove da 3 si salta a meno 4
% svg: ruota-complemento-a-due-3-bit-2327df83.svg 217x246
\begin{tikzpicture}
\draw[thick] (0,0) circle (1.5);
\foreach \s/\v [count=\i from 0] in {000/0, 001/1, 010/2, 011/3, 100/-4, 101/-3, 110/-2, 111/-1} {
  \fill ({90-45*\i}:1.5) circle (2pt);
  \node[font=\small] at ({90-45*\i}:2.05) {\s};
  \node[font=\small] at ({90-45*\i}:1.0) {$\v$};
}
\draw[-{Stealth}, very thick, orange] (-38:2.75) arc (-38:-97:2.75);
\node[font=\small, right] at (0.9,-2.9) {traboccamento};
\draw[-{Stealth}, thick] (128:2.75) arc (128:52:2.75);
\node[font=\small] at (0,3.05) {$+1$};
\end{tikzpicture}
```

Un traboccamento si riconosce dai segni, senza conoscere il risultato vero:

- se gli addendi hanno segni diversi, il traboccamento non può esserci, perché il risultato sta tra i due;
- se gli addendi hanno lo stesso segno e il risultato ha il segno opposto, c'è stato un traboccamento.

Nell'esempio 7 due numeri positivi hanno dato un risultato negativo. Succede lo stesso dall'altra parte: $-100 + (-60)$ dovrebbe fare $-160$, che è più piccolo di $-128$, e negli 8 bit resta $0110\,0000 = 96$, cioè $-160 + 256$.

```ad-warning
Il riporto scartato non è un traboccamento
Nell'esempio 6 esce un riporto dall'ottavo bit e il risultato è giusto; nell'esempio 7 non esce nessun riporto e il risultato è sbagliato. Per sapere se c'è traboccamento si guardano i segni degli addendi e del risultato, non il riporto.
```
