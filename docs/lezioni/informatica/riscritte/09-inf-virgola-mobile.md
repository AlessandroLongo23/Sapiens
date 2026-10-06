# Numeri reali in virgola mobile

Il prezzo di un quaderno è $1{,}20$ euro, la media dei voti sul registro elettronico è $7{,}25$, in un videogioco la posizione di un personaggio cambia di frazioni di millimetro a ogni istante. Un calcolatore deve quindi scrivere con i bit anche i numeri con la virgola, e deve farlo in uno spazio fisso, di solito 32 o 64 bit. Il modo in cui ci riesce si chiama virgola mobile, e ha una conseguenza che sorprende: quasi tutti i numeri con la virgola vengono memorizzati con un piccolo errore.

## I numeri binari con la virgola

In base dieci le cifre dopo la virgola pesano un decimo, un centesimo, un millesimo: sono le potenze di dieci con esponente negativo. In base due succede lo stesso con le potenze di due: la prima cifra dopo la virgola pesa $\frac{1}{2}$, la seconda $\frac{1}{4}$, la terza $\frac{1}{8}$, e così via, ogni volta la metà.

```tikz
% nome: pesi-binario-con-la-virgola
% alt: Le sei cifre del numero binario 101,011 in sei caselle, con la virgola tra la terza e la quarta; sopra ogni casella il suo peso: 4, 2 e 1 per le cifre prima della virgola, un mezzo, un quarto e un ottavo per quelle dopo; sotto, la somma 4 più 1 più 0,25 più 0,125 che fa 5,375
% svg: pesi-binario-con-la-virgola-81a3e460.svg 237x86
\begin{tikzpicture}
\foreach \b/\w [count=\i from 0] in {1/4, 0/2, 1/1} {
  \draw[thick, fill=blue!10] (\i*0.8,0) rectangle ++(0.8,0.8);
  \node at (\i*0.8+0.4,0.4) {\b};
  \node[font=\small] at (\i*0.8+0.4,1.15) {$\w$};
}
\node at (2.6,0.12) {\Large ,};
\foreach \b/\w [count=\i from 0] in {0/\frac{1}{2}, 1/\frac{1}{4}, 1/\frac{1}{8}} {
  \draw[thick, fill=orange!30] (2.8+\i*0.8,0) rectangle ++(0.8,0.8);
  \node at (3.2+\i*0.8,0.4) {\b};
  \node[font=\small] at (3.2+\i*0.8,1.15) {$\w$};
}
\node[font=\small, left] at (-0.1,1.15) {peso};
\node[font=\small, left] at (-0.1,0.4) {cifra};
\node[font=\small] at (2.6,-0.5) {$4 + 1 + 0{,}25 + 0{,}125 = 5{,}375$};
\end{tikzpicture}
```

Per leggere un numero binario con la virgola si sommano i pesi delle cifre che valgono $1$, come per i numeri interi della lezione [Conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale).

```ad-example
Esempio 1: dal binario al decimale
Quanto vale $101{,}011_2$?

La parte intera è $101_2 = 4 + 1 = 5$. Dopo la virgola le cifre sono $0$, $1$, $1$: valgono $\frac{1}{4} + \frac{1}{8} = 0{,}25 + 0{,}125 = 0{,}375$.

Il numero è $5{,}375$.
```

```ad-warning
Le cifre dopo la virgola non si leggono come un numero intero
In $101{,}011_2$ le cifre dopo la virgola sono $011$, che come numero intero vale $3$. Il numero però non è $5{,}3$: ogni cifra ha il suo peso, e la prima dopo la virgola pesa $\frac{1}{2}$, non $1$.
```

### Dal decimale al binario

La parte intera si converte come sai. Per la parte dopo la virgola il procedimento è questo:

1. Moltiplica per $2$ la parte dopo la virgola.
2. La parte intera del risultato, $0$ oppure $1$, è la prossima cifra binaria.
3. Tieni solo la parte dopo la virgola del risultato e ripeti dal passo 1.
4. Ti fermi quando la parte dopo la virgola diventa $0$. Le cifre si scrivono nell'ordine in cui le hai trovate.

```ad-example
Esempio 2: un numero minore di uno
Scrivi $0{,}625$ in base due.

- $0{,}625 \cdot 2 = 1{,}25$: cifra $1$, resta $0{,}25$;
- $0{,}25 \cdot 2 = 0{,}5$: cifra $0$, resta $0{,}5$;
- $0{,}5 \cdot 2 = 1$: cifra $1$, resta $0$.

Quindi $0{,}625 = 0{,}101_2$. Controllo: $\frac{1}{2} + \frac{1}{8} = 0{,}625$.
```

```ad-example
Esempio 3: parte intera e parte dopo la virgola
Scrivi $6{,}75$ in base due.

La parte intera è $6 = 110_2$. Per $0{,}75$: $0{,}75 \cdot 2 = 1{,}5$, cifra $1$; $0{,}5 \cdot 2 = 1$, cifra $1$, e resta $0$.

Quindi $6{,}75 = 110{,}11_2$.
```

## Perché 0,1 non è esatto

Con $0{,}1$ il procedimento non si ferma.

```ad-example
Esempio 4: un numero che non finisce mai
Scrivi $0{,}1$ in base due.

- $0{,}1 \cdot 2 = 0{,}2$: cifra $0$;
- $0{,}2 \cdot 2 = 0{,}4$: cifra $0$;
- $0{,}4 \cdot 2 = 0{,}8$: cifra $0$;
- $0{,}8 \cdot 2 = 1{,}6$: cifra $1$, resta $0{,}6$;
- $0{,}6 \cdot 2 = 1{,}2$: cifra $1$, resta $0{,}2$.

Sei tornato a $0{,}2$, che hai già incontrato al secondo passo: da qui le cifre $0011$ si ripetono per sempre.

$$0{,}1 = 0{,}0001\,1001\,1001\,1001\ldots_2$$
```

Succede la stessa cosa in base dieci con $\frac{1}{3} = 0{,}3333\ldots$: il numero è preciso, ma la sua scrittura con la virgola non finisce. In base due questo capita a numeri che in base dieci sembrano innocui. La regola è questa: un numero ha un numero finito di cifre binarie dopo la virgola solo se, scritto come frazione ridotta ai minimi termini, ha per denominatore una potenza di $2$ (le frazioni e i numeri decimali sono nella lezione [Numeri decimali e frazioni](/materiale/scuola-superiore/matematica/numeri-razionali/numeri-decimali-e-frazioni)).

| Numero | Frazione | In base due |
|---|---|---|
| $0{,}5$ | $\frac{1}{2}$ | $0{,}1_2$, finito |
| $0{,}375$ | $\frac{3}{8}$ | $0{,}011_2$, finito |
| $0{,}1$ | $\frac{1}{10}$ | infinite cifre |
| $0{,}2$ | $\frac{1}{5}$ | infinite cifre |

Un calcolatore ha un numero finito di bit, quindi di $0{,}1$ tiene solo le prime cifre e arrotonda l'ultima. Il numero che ha in memoria non è $0{,}1$, ma un numero vicinissimo.

## La notazione scientifica in base due

Resta da decidere dove mettere la virgola. Se si riservassero, per esempio, 16 bit alla parte intera e 16 alla parte dopo la virgola, non si potrebbero scrivere né i numeri molto grandi né quelli molto piccoli. Le scienze risolvono lo stesso problema con la notazione scientifica: $149\,600\,000$ si scrive $1{,}496 \cdot 10^8$ e $0{,}00052$ si scrive $5{,}2 \cdot 10^{-4}$. Le cifre che contano stanno da una parte, la posizione della virgola sta nell'esponente.

In base due si fa lo stesso con le potenze di $2$. Spostare la virgola di un posto verso sinistra divide il numero per $2$, spostarla verso destra lo moltiplica per $2$:

$$1101{,}01_2 = 1{,}10101_2 \cdot 2^3$$

La forma **normalizzata** è quella con una sola cifra prima della virgola, diversa da zero. In base due quella cifra può essere solo $1$. Un numero scritto così ha tre parti:

- il **segno**, più o meno;
- la **mantissa**, cioè le cifre del numero ($1{,}10101_2$ nell'esempio);
- l'**esponente** della potenza di $2$ ($3$ nell'esempio).

La virgola non ha un posto fisso tra i bit: è l'esponente a dire dove va. Per questo la rappresentazione si chiama **virgola mobile** (in inglese floating point).

```ad-example
Esempio 5: normalizzare un numero piccolo
Scrivi $0{,}00101_2$ in forma normalizzata.

La virgola va portata subito dopo il primo $1$, cioè spostata di $3$ posti verso destra. Il numero $1{,}01_2$ è $2^3$ volte più grande di quello di partenza, e per compensare l'esponente è negativo:

$$0{,}00101_2 = 1{,}01_2 \cdot 2^{-3}$$
```

```ad-warning
Il segno dell'esponente
Se sposti la virgola verso sinistra (numeri grandi) l'esponente è positivo; se la sposti verso destra (numeri minori di $1$) è negativo. L'esponente conta i posti di cui si sposta la virgola, non le cifre del numero: $1101{,}01_2$ ha quattro cifre prima della virgola, ma l'esponente è $3$.
```

## Lo standard IEEE 754

Quasi tutti i calcolatori memorizzano i numeri in virgola mobile seguendo lo stesso standard, chiamato IEEE 754 dal nome dell'associazione che lo ha pubblicato (Institute of Electrical and Electronics Engineers). Lo standard prevede due formati principali.

| Formato | Segno | Esponente | Mantissa | Cifre decimali affidabili |
|---|---|---|---|---|
| 32 bit (precisione singola) | 1 bit | 8 bit | 23 bit | circa $7$ |
| 64 bit (precisione doppia) | 1 bit | 11 bit | 52 bit | $15$ o $16$ |

Nel formato a 32 bit i tre campi si riempiono così:

1. Il bit di segno è $0$ se il numero è positivo, $1$ se è negativo.
2. Nel campo dell'esponente si scrive l'esponente aumentato di $127$, in binario su 8 bit. In questo modo anche gli esponenti negativi diventano numeri positivi e non serve un secondo bit di segno.
3. Nel campo della mantissa si scrivono le cifre dopo la virgola della forma normalizzata, seguite da zeri fino a 23 bit. L'$1$ prima della virgola non si scrive, perché c'è sempre.

```ad-example
Esempio 6: i 32 bit di un numero
Come si memorizza $-6{,}5$ nel formato a 32 bit?

In base due $6{,}5 = 110{,}1_2$, e in forma normalizzata $110{,}1_2 = 1{,}101_2 \cdot 2^2$.

- Segno: il numero è negativo, quindi $1$.
- Esponente: $2 + 127 = 129 = 1000\,0001_2$.
- Mantissa: le cifre dopo la virgola sono $101$, seguite da venti zeri.
```

```tikz
% nome: campi-virgola-mobile-32-bit
% alt: I 32 bit del numero meno 6,5 in virgola mobile, divisi in tre campi: il segno, di 1 bit, che vale 1; l'esponente, di 8 bit, che vale 1000 0001; la mantissa, di 23 bit, che comincia con 101 e continua con zeri
% svg: campi-virgola-mobile-32-bit-d28e2179.svg 280x74
\begin{tikzpicture}
\draw[thick, fill=orange!30] (0,0) rectangle (0.8,0.8);
\draw[thick, fill=blue!10] (0.8,0) rectangle (3.2,0.8);
\draw[thick, fill=green!12] (3.2,0) rectangle (7.2,0.8);
\node at (0.4,0.4) {1};
\node at (2.0,0.4) {1000\,0001};
\node at (5.2,0.4) {1010\,0000\,\ldots\,0000};
\node[font=\small] at (0.4,1.1) {segno};
\node[font=\small] at (2.0,1.1) {esponente};
\node[font=\small] at (5.2,1.1) {mantissa};
\node[font=\small] at (0.4,-0.3) {1 bit};
\node[font=\small] at (2.0,-0.3) {8 bit};
\node[font=\small] at (5.2,-0.3) {23 bit};
\end{tikzpicture}
```

Il formato a 64 bit funziona allo stesso modo, con più bit per l'esponente e per la mantissa: i numeri possono essere più grandi e hanno più cifre esatte.

## Gli errori di arrotondamento

La mantissa ha un numero fisso di bit: tutto quello che non ci sta viene arrotondato. Per $6{,}5$ bastano tre cifre e il numero è memorizzato in modo esatto. Per $0{,}1$, che ne vorrebbe infinite, il formato a 64 bit tiene in memoria

$$0{,}1000000000000000055511151231257827\ldots$$

L'errore è piccolissimo, ma si vede appena si fanno dei conti. Sommando $0{,}1$ e $0{,}2$ a 64 bit, il risultato in memoria è $0{,}30000000000000004$, che non è uguale al numero memorizzato per $0{,}3$. Sommando dieci volte $0{,}1$ non si ottiene $1$, ma $0{,}9999999999999999$.

Lo puoi vedere sul tuo computer. Le tre righe qui sotto sono un programma in Python, che lavora a 64 bit: ogni `print` scrive il risultato del conto tra parentesi, i numeri hanno il punto al posto della virgola, e `==` chiede se due numeri sono uguali (`False` vuol dire no). Non serve saper programmare: premi "Esegui" e leggi. Poi cambia i numeri: con `0.5 + 0.25`, due frazioni che hanno per denominatore una potenza di $2$, il risultato è esatto.

```codice python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
print(0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1 + 0.1)
```

Anche i numeri interi grandi possono perdere cifre. Nel formato a 32 bit la mantissa contiene 24 cifre binarie, contando l'$1$ che non si scrive: fino a $2^{24} = 16\,777\,216$ tutti i numeri interi sono esatti, ma $16\,777\,217$ non si può scrivere e viene arrotondato a $16\,777\,216$.

```ad-warning
Un numero in virgola mobile non è un numero reale
I numeri reali sono infiniti e fitti; quelli in virgola mobile a 32 bit sono al massimo $2^{32}$, circa quattro miliardi. Tra un numero e il successivo c'è un salto, e ogni risultato che cade nel salto viene spostato sul numero più vicino. Per questo due risultati in virgola mobile non si confrontano chiedendo se sono uguali, ma se la loro differenza è abbastanza piccola.
```

```ad-note
Dove si incontrano questi errori
In un programma che lavora a 64 bit la somma di $4{,}1$ e $8{,}2$ dà $12{,}299999999999999$ invece di $12{,}3$. Non è un guasto: è l'arrotondamento dei numeri che in base due non finiscono. Per questo nei programmi che gestiscono denaro i centesimi si contano spesso con numeri interi.
```
