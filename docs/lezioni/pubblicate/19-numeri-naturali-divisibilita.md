# Divisibilità e numeri primi

Ventiquattro caramelle si dividono tra sei amici senza avanzi, tra cinque no: $24$ è divisibile per $6$ ma non per $5$. La divisibilità dice quando una divisione tra numeri naturali è esatta, e porta ai numeri primi, i mattoni con cui si costruisce per moltiplicazione ogni altro numero. Scomporre un numero in fattori primi è il primo passo per calcolare [MCD e MCM](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n) e per semplificare le frazioni.

## Multipli e divisori

Dati due numeri naturali $a$ e $b$, con $b \neq 0$, si dice che $a$ è **divisibile** per $b$ quando la divisione $a : b$ ha resto $0$, cioè quando esiste un naturale $q$ tale che

$$a = b \cdot q$$

In questo caso $b$ è un **divisore** di $a$ e $a$ è un **multiplo** di $b$. Le tre frasi dicono la stessa cosa. Per esempio $35 = 7 \cdot 5$: $35$ è divisibile per $7$, $7$ è un divisore di $35$, $35$ è un multiplo di $7$. Invece $35$ non è divisibile per $6$, perché $35 : 6$ dà quoziente $5$ e resto $5$ (la divisione con resto è nella lezione sulle [operazioni in ℕ](/materiale/scuola-superiore/matematica/numeri-naturali/operazioni-in-n)).

```ad-warning
Rovesciare "divisibile per"
$12$ è divisibile per $3$, non il contrario: il numero più grande è il multiplo, quello che divide è il divisore. "$3$ è divisibile per $12$" è falso, perché $3 : 12$ ha quoziente $0$ e resto $3$.
```

I multipli di un numero si ottengono moltiplicandolo per $0, 1, 2, 3, \dots$ e sono infiniti: i multipli di $6$ sono $0, 6, 12, 18, 24, \dots$ I divisori di un numero diverso da zero invece sono finiti, e nessuno supera il numero stesso.

Alcuni casi valgono per ogni numero:

- $1$ è divisore di ogni numero, perché $a = 1 \cdot a$;
- ogni numero $a \neq 0$ è divisore di sé stesso, perché $a = a \cdot 1$;
- $0$ è multiplo di ogni numero, perché $0 = b \cdot 0$: quindi $0$ è divisibile per $5$, per $12$, per qualunque $b \neq 0$, e ha infiniti divisori;
- $0$ non è divisore di nessun numero, perché nella definizione il divisore è diverso da zero (la divisione per zero non si fa).

### Come trovare tutti i divisori

Per elencare i divisori di un numero $n$ si cercano le coppie di naturali che moltiplicate danno $n$:

1. Prova i numeri $1, 2, 3, \dots$ in ordine.
2. Ogni volta che un numero $d$ divide $n$, scrivi la coppia $d$ e $n : d$.
3. Ti fermi quando il numero da provare, moltiplicato per sé stesso, supera $n$: da lì in poi ritroveresti le coppie già scritte, scambiate.

```ad-example
Esempio 1: i divisori di 36
$$36 = 1 \cdot 36 = 2 \cdot 18 = 3 \cdot 12 = 4 \cdot 9 = 6 \cdot 6$$
Il $5$ non divide $36$, e il $6$ fa coppia con sé stesso. Il numero successivo da provare è $7$, e $7 \cdot 7 = 49$ supera $36$: ci si ferma. I divisori sono $1, 2, 3, 4, 6, 9, 12, 18, 36$: nove in tutto, perché il $6$ si conta una volta sola.
```

### Divisori di una somma

Se un numero $d$ divide sia $a$ sia $b$, allora divide anche $a + b$ e, quando $a \geq b$, anche $a - b$. Infatti da $a = d \cdot h$ e $b = d \cdot k$ segue $a + b = d \cdot (h + k)$ e $a - b = d \cdot (h - k)$. Per esempio $7$ divide $70$ e $14$, quindi divide anche $70 + 14 = 84$ e $70 - 14 = 56$.

```ad-warning
Leggere la proprietà al contrario
Se $d$ divide una somma, non è detto che divida gli addendi: $3$ divide $4 + 5 = 9$, ma non divide né $4$ né $5$.
```

## Criteri di divisibilità

I criteri di divisibilità dicono se un numero è divisibile per un altro guardandone le cifre, senza fare la divisione. Un numero è divisibile:

| per | se |
|---|---|
| $2$ | l'ultima cifra è pari ($0, 2, 4, 6, 8$) |
| $3$ | la somma delle cifre è divisibile per $3$ |
| $4$ | le ultime due cifre sono $00$ o formano un numero divisibile per $4$ |
| $5$ | l'ultima cifra è $0$ o $5$ |
| $9$ | la somma delle cifre è divisibile per $9$ |
| $10$ | l'ultima cifra è $0$ |
| $11$ | la differenza tra la somma delle cifre di posto dispari e quella delle cifre di posto pari (contando da destra) è $0$ o un multiplo di $11$ |
| $25$ | le ultime due cifre sono $00$, $25$, $50$ o $75$ |

Nel criterio dell'$11$ la cifra delle unità è al posto $1$, quella delle decine al posto $2$, e così via. Si sottrae la somma più piccola dalla più grande, così il risultato resta un numero naturale. Nei criteri del $3$ e del $9$, se la somma delle cifre è ancora un numero grande, puoi sommare di nuovo le sue cifre.

```ad-note
Perché i criteri funzionano
Ogni numero è un multiplo di $10$ più la sua ultima cifra: $2740 = 274 \cdot 10 + 0$. Il $10$ è divisibile per $2$, per $5$ e per $10$, quindi per questi tre numeri conta solo l'ultima cifra (è la proprietà dei divisori di una somma). Allo stesso modo $100$ è divisibile per $4$ e per $25$, e per loro contano le ultime due cifre.

Per il $3$ e il $9$ si usa $10 = 9 + 1$, $100 = 99 + 1$, $1000 = 999 + 1$: così $3465 = (3 \cdot 999 + 4 \cdot 99 + 6 \cdot 9) + (3 + 4 + 6 + 5)$, e la prima parentesi è un multiplo di $9$. Quindi $3465$ è divisibile per $9$ (e per $3$) esattamente quando lo è la somma delle cifre, $18$.
```

```ad-example
Esempio 2: i criteri applicati a 2740
L'ultima cifra è $0$: divisibile per $2$, per $5$ e per $10$.

Le ultime due cifre formano $40 = 4 \cdot 10$: divisibile per $4$. Non sono $00$, $25$, $50$ o $75$: non divisibile per $25$.

La somma delle cifre è $2 + 7 + 4 + 0 = 13$, che non è multiplo di $3$: non divisibile per $3$ né per $9$.

Per l'$11$, contando da destra, le cifre di posto dispari sono $0$ e $7$ (somma $7$), quelle di posto pari sono $4$ e $2$ (somma $6$). La differenza è $7 - 6 = 1$: non divisibile per $11$.
```

```ad-warning
Guardare solo l'ultima cifra per il 4
$134$ finisce con $4$, ma non è divisibile per $4$: le ultime due cifre formano $34$, che non è multiplo di $4$. Per il $4$ contano le ultime due cifre, per il $3$ e il $9$ la somma di tutte.
```

```ad-example
Esempio 3: 82 753 e il criterio dell'11
Da destra, le cifre di posto dispari (posti $1$, $3$, $5$) sono $3$, $7$, $8$, con somma $18$; quelle di posto pari (posti $2$, $4$) sono $5$ e $2$, con somma $7$. La differenza è $18 - 7 = 11$, che è multiplo di $11$: $82\,753$ è divisibile per $11$. Infatti $82\,753 = 11 \cdot 7523$.
```

Per i divisori che non sono nella tabella si possono combinare due criteri, a patto che i due numeri non abbiano fattori primi in comune: un numero è divisibile per $6$ quando è divisibile per $2$ e per $3$, per $12$ quando è divisibile per $3$ e per $4$, per $15$ quando è divisibile per $3$ e per $5$.

```ad-warning
Combinare criteri con fattori in comune
$12$ è divisibile per $2$ e per $4$, ma non per $8$. Il $2$ e il $4$ hanno in comune il fattore $2$, e i due criteri insieme non bastano.
```

```ad-example
Esempio 4: la cifra mancante
Quali cifre si possono mettere al posto del quadratino in $4\square8$ perché il numero sia divisibile per $12$?

Serve la divisibilità per $3$ e per $4$. Per il $3$, la somma delle cifre $4 + \square + 8 = 12 + \square$ deve essere un multiplo di $3$: il quadratino può essere $0$, $3$, $6$ o $9$. Per il $4$, le ultime due cifre $\square 8$ devono formare un multiplo di $4$: vanno bene $08$, $28$, $48$, $68$, $88$, cioè il quadratino deve essere pari.

Le cifre che vanno bene per entrambi sono $0$ e $6$: $408 = 12 \cdot 34$ e $468 = 12 \cdot 39$.
```

## Numeri primi e numeri composti

Un numero naturale è **primo** se ha esattamente due divisori: $1$ e sé stesso. Per esempio $7$ è primo, perché i suoi divisori sono solo $1$ e $7$. Un numero maggiore di $1$ che non è primo si chiama **composto**: ha almeno un divisore diverso da $1$ e da sé stesso, come $15$, che è divisibile per $3$ e per $5$.

I numeri $0$ e $1$ non sono né primi né composti. Il $1$ ha un solo divisore, sé stesso. Lo $0$ è divisibile per ogni numero diverso da zero, quindi ha infiniti divisori.

Il $2$ è l'unico numero primo pari: ogni altro numero pari è divisibile per $2$, e quindi ha almeno tre divisori.

```ad-warning
Credere che i dispari siano primi
$9 = 3 \cdot 3$, $15 = 3 \cdot 5$, $91 = 7 \cdot 13$ sono dispari e composti. Essere dispari vuol dire solo non essere divisibili per $2$.
```

I numeri primi sono infiniti: comunque grande sia un primo, ce n'è sempre uno più grande. Lo dimostrò Euclide negli *Elementi*, circa 300 anni prima di Cristo.

### Il crivello di Eratostene

Il crivello di Eratostene è un procedimento per trovare tutti i numeri primi fino a un certo numero, per esempio $100$:

1. Scrivi i numeri da $2$ a $100$.
2. Il primo numero non cancellato, il $2$, è primo: cerchialo e cancella tutti i suoi multipli, da $2 \cdot 2 = 4$ in poi.
3. Il primo numero non cancellato dopo il $2$ è il $3$: è primo, cerchialo e cancella i suoi multipli, da $3 \cdot 3 = 9$ in poi.
4. Ripeti con il $5$ e poi con il $7$, cancellando ogni volta i multipli a partire dal quadrato del numero.
5. Il primo non cancellato dopo il $7$ è $11$, e $11 \cdot 11 = 121$ supera $100$: tutti i numeri non ancora cancellati sono primi.

Si comincia a cancellare dal quadrato perché i multipli più piccoli sono già stati cancellati: per esempio $5 \cdot 2$, $5 \cdot 3$ e $5 \cdot 4$ sono multipli di $2$ o di $3$. Per la stessa ragione ci si ferma al $7$.

```tikz
% nome: crivello-di-eratostene-100
% alt: Tabella dei numeri da 1 a 100, dieci per riga, con i 25 numeri primi cerchiati, i numeri composti barrati e il numero 1 né cerchiato né barrato
% svg: crivello-di-eratostene-100-ed5605a3.svg 284x248
\begin{tikzpicture}[font=\small]
\foreach \n in {1,...,100} {
  \pgfmathtruncatemacro{\c}{mod(\n-1,10)}
  \pgfmathtruncatemacro{\r}{(\n-1)/10}
  \node at (0.75*\c,-0.65*\r) {$\n$};
}
\foreach \n in {2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97} {
  \pgfmathtruncatemacro{\c}{mod(\n-1,10)}
  \pgfmathtruncatemacro{\r}{(\n-1)/10}
  \draw[thick] (0.75*\c,-0.65*\r) circle (0.3);
}
\foreach \n in {4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35,36,38,39,40,42,44,45,46,48,49,50,51,52,54,55,56,57,58,60,62,63,64,65,66,68,69,70,72,74,75,76,77,78,80,81,82,84,85,86,87,88,90,91,92,93,94,95,96,98,99,100} {
  \pgfmathtruncatemacro{\c}{mod(\n-1,10)}
  \pgfmathtruncatemacro{\r}{(\n-1)/10}
  \draw[gray] (0.75*\c-0.25,-0.65*\r-0.2) -- (0.75*\c+0.25,-0.65*\r+0.2);
}
\end{tikzpicture}
```

I primi minori di $100$ sono $25$:

$$2,\ 3,\ 5,\ 7,\ 11,\ 13,\ 17,\ 19,\ 23,\ 29,\ 31,\ 37,\ 41,\ 43,\ 47,\ 53,\ 59,\ 61,\ 67,\ 71,\ 73,\ 79,\ 83,\ 89,\ 97$$

### Come capire se un numero è primo

Per un numero $n$ maggiore di $1$:

1. Prova a dividere $n$ per i numeri primi in ordine: $2, 3, 5, 7, 11, 13, \dots$
2. Se uno di questi divide $n$, il numero è composto.
3. Se arrivi a un primo $p$ con $p \cdot p > n$ senza aver trovato divisori, $n$ è primo.

Ci si può fermare perché, se $n = a \cdot b$ con $1 < a \leq b$, allora $a \cdot a \leq a \cdot b = n$: il fattore più piccolo ha il quadrato che non supera $n$, e lo stesso vale per i suoi fattori primi. Quindi un numero composto ha sempre un divisore primo il cui quadrato non supera $n$.

```ad-example
Esempio 5: 91 è primo?
Non è divisibile per $2$ (è dispari), né per $3$ (la somma delle cifre è $10$), né per $5$ (finisce con $1$). Per il $7$: $91 = 7 \cdot 13$. Il numero $91$ è composto.
```

```ad-example
Esempio 6: 211 è primo?
Non è divisibile per $2$, per $3$ (la somma delle cifre è $4$) né per $5$. Le divisioni per i primi successivi hanno tutte resto diverso da zero: $211 = 7 \cdot 30 + 1$, $211 = 11 \cdot 19 + 2$, $211 = 13 \cdot 16 + 3$.

Il primo successivo è $17$, e $17 \cdot 17 = 289$ supera $211$: puoi fermarti. Il numero $211$ è primo.
```

## Scomposizione in fattori primi

Ogni numero naturale maggiore di $1$ si può scrivere come prodotto di numeri primi, e in un solo modo se non si tiene conto dell'ordine dei fattori. È il **teorema fondamentale dell'aritmetica**, e scrivere quel prodotto si dice **scomporre in fattori primi**. I fattori uguali si raccolgono in [potenze](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n): $12 = 2 \cdot 2 \cdot 3 = 2^2 \cdot 3$. Un numero primo è già scomposto: $97 = 97$.

Il $36$ si può scrivere come $4 \cdot 9$, $6 \cdot 6$ o $2 \cdot 18$, ma la scomposizione in fattori primi è una sola: $36 = 2^2 \cdot 3^2$. È anche il motivo per cui $1$ non è primo: se lo fosse, $6 = 2 \cdot 3 = 1 \cdot 2 \cdot 3 = 1 \cdot 1 \cdot 2 \cdot 3$ avrebbe infinite scomposizioni diverse.

Il procedimento:

1. Dividi il numero per il più piccolo primo che lo divide, aiutandoti con i criteri di divisibilità.
2. Riparti dal quoziente, provando di nuovo lo stesso primo prima di passare ai successivi.
3. Continua finché il quoziente è $1$.
4. Scrivi il numero come prodotto dei primi trovati, con i fattori uguali raccolti in potenze.

```ad-example
Esempio 7: scomporre 1260
Nella colonna di sinistra c'è il numero da dividere, in quella di destra il primo per cui lo dividi.
$$\begin{array}{r|l} 1260 & 2 \\ 630 & 2 \\ 315 & 3 \\ 105 & 3 \\ 35 & 5 \\ 7 & 7 \\ 1 & \end{array}$$
Quindi $1260 = 2 \cdot 2 \cdot 3 \cdot 3 \cdot 5 \cdot 7 = 2^2 \cdot 3^2 \cdot 5 \cdot 7$.
```

```ad-warning
Lasciare fattori non primi
$36 = 4 \cdot 9$ non è una scomposizione in fattori primi, perché $4$ e $9$ sono composti. Alla fine della colonna ogni fattore deve essere primo: $36 = 2^2 \cdot 3^2$.
```

```ad-example
Esempio 8: un numero che finisce con zeri
Con $4500$ conviene staccare gli zeri: $4500 = 45 \cdot 100$. Poi $45 = 3^2 \cdot 5$ e $100 = 2^2 \cdot 5^2$, quindi
$$4500 = 3^2 \cdot 5 \cdot 2^2 \cdot 5^2 = 2^2 \cdot 3^2 \cdot 5^3$$
Il $5$ compare in entrambe le parti, e gli esponenti si sommano: $5 \cdot 5^2 = 5^3$.
```

```ad-example
Esempio 9: quando i criteri non bastano
$1001$ non è divisibile per $2$, per $3$ (la somma delle cifre è $2$) né per $5$. Si prova il $7$: $1001 = 7 \cdot 143$. Poi $143$ non è divisibile per $7$ ($143 = 7 \cdot 20 + 3$), ma per $11$ sì: $143 = 11 \cdot 13$, e $13$ è primo.
$$1001 = 7 \cdot 11 \cdot 13$$
```

### Divisibilità e numero dei divisori dalla scomposizione

La scomposizione dice subito se un numero è divisibile per un altro: $a$ è divisibile per $b$ quando ogni fattore primo di $b$ compare nella scomposizione di $a$ con un esponente almeno uguale. Con $1260 = 2^2 \cdot 3^2 \cdot 5 \cdot 7$:

- $1260$ è divisibile per $45 = 3^2 \cdot 5$, e il quoziente è quello che resta, $2^2 \cdot 7 = 28$;
- $1260$ non è divisibile per $8 = 2^3$, perché nella scomposizione il $2$ ha esponente $2$;
- $1260$ non è divisibile per $27 = 3^3$, per lo stesso motivo.

Per la stessa ragione i divisori di un numero si costruiscono con i suoi fattori primi, ciascuno con un esponente che va da $0$ fino a quello della scomposizione. Se $n = p^a \cdot q^b$, con $p$ e $q$ primi diversi, il numero dei divisori di $n$ è

$$(a + 1) \cdot (b + 1)$$

perché l'esponente di $p$ si sceglie in $a + 1$ modi ($0, 1, \dots, a$) e quello di $q$ in $b + 1$ modi. Con un solo fattore primo o con più di due si fa lo stesso: un fattore (esponente $+ 1$) per ciascun primo della scomposizione.

```ad-example
Esempio 10: i divisori di 72
$72 = 2^3 \cdot 3^2$, quindi i divisori sono $(3 + 1) \cdot (2 + 1) = 12$. Ogni divisore è $2^i \cdot 3^j$ con $i$ da $0$ a $3$ e $j$ da $0$ a $2$ (ricorda che $2^0 = 3^0 = 1$):
$$\begin{array}{c|ccc} & 1 & 3 & 9 \\ \hline 1 & 1 & 3 & 9 \\ 2 & 2 & 6 & 18 \\ 4 & 4 & 12 & 36 \\ 8 & 8 & 24 & 72 \end{array}$$
Con lo stesso conto, $1260 = 2^2 \cdot 3^2 \cdot 5 \cdot 7$ ha $3 \cdot 3 \cdot 2 \cdot 2 = 36$ divisori.
```

```ad-warning
Dimenticare il più uno
$72 = 2^3 \cdot 3^2$ non ha $3 \cdot 2 = 6$ divisori, ma $4 \cdot 3 = 12$: ogni esponente può valere anche $0$, cioè il fattore si può non prendere.
```

Con la scomposizione si calcolano anche il massimo comune divisore e il minimo comune multiplo di due o più numeri: il procedimento è nella lezione su [MCD e MCM](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n).
