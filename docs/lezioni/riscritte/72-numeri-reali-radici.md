# Radicali e loro proprietà

Un quadrato di area $25\ \text{cm}^2$ ha il lato di $5\ \text{cm}$, perché $5^2 = 25$; un cubo di volume $27\ \text{cm}^3$ ha lo spigolo di $3\ \text{cm}$, perché $3^3 = 27$. Risalire dal quadrato o dal cubo di un numero al numero stesso è l'operazione inversa della potenza, e si chiama estrazione di radice. Qui trovi come si definisce la radice di indice qualunque, quando esiste, e le regole per semplificare i radicali, portarli allo stesso indice e confrontarli.

Il risultato di una radice spesso non è razionale: $\sqrt{2}$, il lato del quadrato di area $2$, è un numero irrazionale. Che cosa sono gli irrazionali e l'insieme $\mathbb{R}$ dei numeri reali è spiegato in [Numeri irrazionali e numeri reali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/numeri-irrazionali-e-numeri-reali). In questa lezione tutti i numeri sono reali.

## Radice quadrata

Dato un numero reale $a \ge 0$, la **radice quadrata** di $a$, che si scrive $\sqrt{a}$, è il numero reale maggiore o uguale a zero che elevato al quadrato dà $a$:

$$
\begin{gathered}
\sqrt{a} = b \\
\text{se } b \ge 0 \text{ e } b^2 = a
\end{gathered}
$$

Per esempio $\sqrt{49} = 7$, perché $7 \ge 0$ e $7^2 = 49$; $\sqrt{0{,}09} = 0{,}3$, perché $0{,}3^2 = 0{,}09$; $\sqrt{0} = 0$. Anche $(-7)^2 = 49$, ma $-7$ è negativo, quindi non è la radice quadrata di $49$.

Un numero negativo non ha radice quadrata tra i numeri reali, perché il quadrato di un numero reale non è mai negativo: $\sqrt{-4}$ non esiste in $\mathbb{R}$.

```ad-warning
La radice quadrata non ha due valori
$\sqrt{9} = 3$, non $\pm 3$. L'equazione $x^2 = 9$ ha due soluzioni, $x = 3$ e $x = -3$, e si scrivono $x = \pm\sqrt{9}$: il $\pm$ lo metti tu davanti alla radice, come nelle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), perché $\sqrt{9}$ da sola è un numero solo.
```

## Radice n-esima

La stessa idea vale con le altre potenze. Dati un numero naturale $n \ge 2$ e un numero reale $a \ge 0$, la **radice $n$-esima** di $a$ è il numero reale $b \ge 0$ tale che $b^n = a$, e si scrive

$$\sqrt[n]{a} = b$$

Il numero $n$ si chiama **indice** della radice e $a$ si chiama **radicando**; tutta l'espressione $\sqrt[n]{a}$ è un **radicale**. Con indice $2$ si ha la radice quadrata, e il $2$ non si scrive; con indice $3$ si ha la radice cubica.

- $\sqrt[3]{8} = 2$, perché $2^3 = 8$;
- $\sqrt[4]{81} = 3$, perché $3^4 = 81$;
- $\sqrt[5]{\dfrac{1}{32}} = \dfrac{1}{2}$, perché $\left(\dfrac{1}{2}\right)^5 = \dfrac{1}{32}$;
- $\sqrt[3]{0{,}008} = 0{,}2$, perché $0{,}2^3 = 0{,}008$.

Per ogni indice, $\sqrt[n]{0} = 0$ e $\sqrt[n]{1} = 1$. Ogni numero reale $a \ge 0$ ha una e una sola radice $n$-esima maggiore o uguale a zero: lo accettiamo senza dimostrarlo. Dalla definizione vengono due uguaglianze che userai spesso, valide per $a \ge 0$:

$$
\begin{gathered}
\left(\sqrt[n]{a}\right)^n = a \\
\sqrt[n]{a^n} = a
\end{gathered}
$$

Un radicale con il radicando maggiore o uguale a zero, e quindi con il risultato maggiore o uguale a zero, si chiama **radicale aritmetico**. Le proprietà di questa lezione sono tutte enunciate per i radicali aritmetici.

## Indice dispari e radicando negativo

Con l'indice pari, un radicando negativo non ha radice reale: una potenza con esponente pari non è mai negativa, come hai visto nelle [potenze in ℤ](/materiale/scuola-superiore/matematica/numeri-interi/potenze-in-z). Con l'indice dispari invece la radice esiste anche per un radicando negativo, perché una potenza con esponente dispari conserva il segno della base:

$$\sqrt[3]{-8} = -2 \quad \text{perché} \quad (-2)^3 = -8$$

Con indice dispari ogni numero reale ha una e una sola radice reale, che ha lo stesso segno del radicando. Il segno meno si può portare fuori dalla radice:

$$\sqrt[n]{-a} = -\sqrt[n]{a} \quad \text{con } n \text{ dispari}$$

Per esempio $\sqrt[5]{-32} = -\sqrt[5]{32} = -2$. Così un radicale di indice dispari con radicando negativo diventa l'opposto di un radicale aritmetico, e le proprietà dei radicali aritmetici si applicano a quello.

| Radicando | Indice pari | Indice dispari |
|---|---|---|
| positivo | esiste, positivo | esiste, positivo |
| zero | $0$ | $0$ |
| negativo | non esiste in $\mathbb{R}$ | esiste, negativo |

```ad-example
Esempio 1: calcolare le radici
Calcola, se esistono in $\mathbb{R}$: $\sqrt{144}$, $\sqrt[3]{-27}$, $\sqrt[4]{16}$, $\sqrt[4]{-16}$, $\sqrt[5]{-\dfrac{1}{32}}$, $\sqrt{0{,}25}$.

$\sqrt{144} = 12$, perché $12^2 = 144$.

$\sqrt[3]{-27} = -3$, perché l'indice è dispari e $(-3)^3 = -27$.

$\sqrt[4]{16} = 2$, perché $2^4 = 16$. Anche $(-2)^4 = 16$, ma la radice è il numero positivo.

$\sqrt[4]{-16}$ non esiste in $\mathbb{R}$: l'indice è pari e il radicando è negativo.

$\sqrt[5]{-\dfrac{1}{32}} = -\sqrt[5]{\dfrac{1}{32}} = -\dfrac{1}{2}$.

$\sqrt{0{,}25} = 0{,}5$, perché $0{,}5^2 = 0{,}25$.
```

## Condizioni di esistenza con le lettere

Quando il radicando contiene delle lettere, prima di fare qualunque conto si scrivono le **condizioni di esistenza** (C.E.) del radicale, cioè i valori delle lettere per cui ha significato, come si fa con le [frazioni algebriche](/materiale/scuola-superiore/matematica/frazioni-algebriche/frazioni-algebriche-e-condizioni-di-esistenza):

- con l'indice pari il radicando deve essere maggiore o uguale a zero;
- con l'indice dispari il radicale esiste per tutti i valori per cui esiste il radicando, e l'unica condizione è che gli eventuali denominatori non si annullino.

Per esempio $\sqrt{x - 3}$ ha C.E.: $x \ge 3$, perché serve $x - 3 \ge 0$, mentre $\sqrt[3]{x - 3}$ esiste per ogni $x$. La condizione è una [disequazione di primo grado](/materiale/scuola-superiore/matematica/disequazioni-di-primo-grado/disequazioni-di-primo-grado-e-intervalli) quando il radicando è di primo grado.

```ad-example
Esempio 2: condizioni di esistenza
Scrivi le C.E. di $\sqrt{2x - 6}$, $\sqrt[4]{5 - x}$, $\sqrt[3]{2x - 6}$, $\sqrt{x^2 + 4}$, $\sqrt{-x^2}$, $\sqrt{\dfrac{2}{x - 1}}$ e $\sqrt[3]{\dfrac{1}{x + 1}}$.

$\sqrt{2x - 6}$: indice pari, quindi $2x - 6 \ge 0$, cioè $2x \ge 6$. C.E.: $x \ge 3$.

$\sqrt[4]{5 - x}$: indice pari, $5 - x \ge 0$, cioè $-x \ge -5$; moltiplicando per $-1$ il verso cambia. C.E.: $x \le 5$.

$\sqrt[3]{2x - 6}$: indice dispari e nessun denominatore, esiste per ogni $x$ reale.

$\sqrt{x^2 + 4}$: il radicando è sempre positivo, perché $x^2 + 4 \ge 4$. Esiste per ogni $x$.

$\sqrt{-x^2}$: serve $-x^2 \ge 0$, cioè $x^2 \le 0$, e un quadrato è minore o uguale a zero solo quando vale zero. C.E.: $x = 0$, e il radicale vale $0$.

$\sqrt{\dfrac{2}{x - 1}}$: la frazione deve essere maggiore o uguale a zero e il denominatore diverso da zero. Il numeratore $2$ è positivo, quindi serve $x - 1 > 0$. C.E.: $x > 1$.

$\sqrt[3]{\dfrac{1}{x + 1}}$: indice dispari, resta solo il denominatore. C.E.: $x \neq -1$.
```

```ad-warning
Il denominatore sotto una radice di indice pari
In $\sqrt{\dfrac{2}{x - 1}}$ la condizione è $x > 1$, non $x \ge 1$: per $x = 1$ il denominatore si annulla e la frazione non esiste. Quando il radicando ha l'incognita al denominatore, i valori che annullano il denominatore sono sempre esclusi.
```

## La radice di un quadrato: $\sqrt{x^2} = |x|$

L'uguaglianza $\sqrt[n]{a^n} = a$ vale per $a \ge 0$. Se la base è negativa e l'indice è pari, il risultato cambia:

$$\sqrt{(-5)^2} = \sqrt{25} = 5$$

e non $-5$, perché una radice quadrata non è mai negativa. Il risultato è $5 = |-5|$, il [valore assoluto](/materiale/scuola-superiore/matematica/numeri-interi/numeri-interi-e-valore-assoluto) della base. Per ogni numero reale $x$, positivo, negativo o nullo, vale quindi

$$\sqrt{x^2} = |x|$$

e allo stesso modo, per ogni indice:

$$
\begin{gathered}
\sqrt[n]{x^n} = |x| \quad \text{con } n \text{ pari} \\
\sqrt[n]{x^n} = x \quad \text{con } n \text{ dispari}
\end{gathered}
$$

Con l'indice dispari il valore assoluto non serve, perché la radice conserva il segno: $\sqrt[3]{(-5)^3} = \sqrt[3]{-125} = -5$.

```ad-warning
La radice di x² non è x
Scrivere $\sqrt{x^2} = x$ è sbagliato quando $x$ può essere negativo: per $x = -5$ il primo membro vale $5$ e il secondo $-5$. Con l'indice pari si scrive $|x|$, a meno che le condizioni del problema non dicano già che $x \ge 0$.
```

```ad-example
Esempio 3: radici di quadrati con le lettere
Scrivi senza radice $\sqrt{(x - 3)^2}$, $\sqrt{x^2 + 6x + 9}$, $\sqrt[4]{a^4}$ e $\sqrt[3]{(x - 3)^3}$.

L'indice è pari, quindi $\sqrt{(x - 3)^2} = |x - 3|$. Per $x \ge 3$ vale $x - 3$; per $x < 3$ vale $3 - x$. Con $x = 1$, per esempio, $\sqrt{(1 - 3)^2} = \sqrt{4} = 2$, e infatti $|1 - 3| = 2$, mentre $x - 3$ darebbe $-2$.

Il radicando $x^2 + 6x + 9$ è il quadrato del binomio $x + 3$, come nei [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli):

$$
\begin{aligned}
\sqrt{x^2 + 6x + 9} &= \sqrt{(x + 3)^2} \\
&= |x + 3|
\end{aligned}
$$

$\sqrt[4]{a^4} = |a|$, perché l'indice è pari.

$\sqrt[3]{(x - 3)^3} = x - 3$, senza valore assoluto, perché l'indice è dispari.
```

## Proprietà invariantiva

Due radicali possono avere indici e radicandi diversi e valere lo stesso numero: $\sqrt{2}$ e $\sqrt[4]{4}$ sono entrambi positivi, e $\left(\sqrt[4]{4}\right)^4 = 4 = \left(\sqrt{2}\right)^4$, quindi sono uguali. È un caso della **proprietà invariantiva**: il valore di un radicale aritmetico non cambia se moltiplichi l'indice e l'esponente del radicando per uno stesso numero naturale $p \ge 1$.

$$\sqrt[n]{a^m} = \sqrt[n \cdot p]{a^{m \cdot p}} \quad \text{con } a \ge 0$$

Per esempio $\sqrt{2} = \sqrt[4]{2^2} = \sqrt[6]{2^3}$, cioè $\sqrt{2} = \sqrt[4]{4} = \sqrt[6]{8}$.

```ad-note
Perché vale
Chiama $b = \sqrt[n]{a^m}$. Per la definizione $b \ge 0$ e $b^n = a^m$. Elevando alla $p$ entrambi i membri, $b^{n \cdot p} = a^{m \cdot p}$: quindi $b$ è un numero maggiore o uguale a zero che elevato a $n \cdot p$ dà $a^{m \cdot p}$, cioè $b = \sqrt[n \cdot p]{a^{m \cdot p}}$.
```

La proprietà si legge anche da destra a sinistra: se l'indice e l'esponente del radicando hanno un divisore comune, li puoi dividere entrambi per quel numero. Sono le due cose che si fanno con i radicali in questa lezione, la semplificazione (si divide) e la riduzione allo stesso indice (si moltiplica).

```ad-warning
La proprietà invariantiva con un radicando negativo
$\sqrt[3]{-2}$ è negativo, mentre $\sqrt[6]{(-2)^2} = \sqrt[6]{4}$ è positivo: non sono uguali. La proprietà vale per i radicali aritmetici. Con indice dispari e radicando negativo porta prima fuori il segno meno, $\sqrt[3]{-2} = -\sqrt[3]{2}$, poi applica la proprietà al radicale aritmetico: $-\sqrt[3]{2} = -\sqrt[6]{4}$.
```

## Semplificazione di un radicale

**Semplificare** un radicale vuol dire dividere l'indice e gli esponenti di tutti i fattori del radicando per un loro divisore comune. Per trovarlo scomponi il radicando in fattori primi e calcola il [MCD](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n) tra l'indice e tutti gli esponenti:

$$
\begin{aligned}
\sqrt[6]{8} &= \sqrt[6]{2^3} \\
&= \sqrt[6 : 3]{2^{3 : 3}} = \sqrt{2}
\end{aligned}
$$

Un radicale è **irriducibile** quando l'indice e gli esponenti dei fattori del radicando hanno come MCD soltanto $1$. Per esempio $\sqrt[6]{12} = \sqrt[6]{2^2 \cdot 3}$ è irriducibile: gli esponenti sono $2$ e $1$, e il MCD tra $6$, $2$ e $1$ è $1$. Il risultato di un esercizio si scrive sempre con i radicali irriducibili.

```ad-example
Esempio 4: semplificare radicali numerici
Semplifica $\sqrt[4]{9}$, $\sqrt[15]{32}$, $\sqrt[8]{16}$ e $\sqrt[10]{2^4 \cdot 3^6}$.

$\sqrt[4]{9} = \sqrt[4]{3^2}$: il MCD tra $4$ e $2$ è $2$, quindi $\sqrt[4]{3^2} = \sqrt{3}$.

$\sqrt[15]{32} = \sqrt[15]{2^5}$: il MCD tra $15$ e $5$ è $5$, quindi $\sqrt[15]{2^5} = \sqrt[3]{2}$.

$\sqrt[8]{16} = \sqrt[8]{2^4}$: il MCD tra $8$ e $4$ è $4$, quindi $\sqrt[8]{2^4} = \sqrt{2}$.

In $\sqrt[10]{2^4 \cdot 3^6}$ il MCD tra $10$, $4$ e $6$ è $2$. Dividi l'indice e tutti e due gli esponenti per $2$:

$$
\begin{aligned}
\sqrt[10]{2^4 \cdot 3^6} &= \sqrt[5]{2^2 \cdot 3^3} \\
&= \sqrt[5]{108}
\end{aligned}
$$
```

```ad-warning
Dividere un esponente solo
In $\sqrt[10]{2^4 \cdot 3^6}$ l'indice si divide per $2$ insieme a tutti gli esponenti, non a uno solo: $\sqrt[5]{2^2 \cdot 3^6}$ è sbagliato. E se anche un solo fattore ha un esponente non divisibile, come il $3$ in $\sqrt[6]{2^2 \cdot 3}$, il radicale non si semplifica.
```

```ad-warning
Semplificare una somma
La proprietà invariantiva riguarda gli esponenti dei fattori, quindi vale quando il radicando è un prodotto di potenze. $\sqrt[4]{a^2 + b^2}$ non si semplifica e non diventa $\sqrt{a + b}$: con $a = 3$ e $b = 4$ il primo vale $\sqrt[4]{25} = \sqrt{5}$, il secondo $\sqrt{7}$.
```

### Semplificare con le lettere

Con le lettere, prima di semplificare guarda l'indice di partenza. Se è pari, il radicando è maggiore o uguale a zero anche quando una lettera è negativa, come in $\sqrt[4]{a^2}$, che esiste per ogni $a$. Se dopo la semplificazione quella lettera ha un esponente dispari, il nuovo radicale sarebbe negativo per $a < 0$, oppure non esisterebbe: per non cambiare il valore si mette il valore assoluto.

$$\sqrt[4]{a^2} = \sqrt{|a|}$$

Se invece l'esponente che resta è pari, il valore assoluto non serve, perché la potenza è già maggiore o uguale a zero: $\sqrt[6]{a^4} = \sqrt[3]{a^2}$. Con un indice di partenza dispari il valore assoluto non serve mai: $\sqrt[9]{a^6} = \sqrt[3]{a^2}$ e $\sqrt[9]{a^3} = \sqrt[3]{a}$ per ogni $a$.

```ad-example
Esempio 5: semplificare con le lettere
Semplifica $\sqrt[6]{x^2}$, $\sqrt[10]{a^6 b^4}$, $\sqrt[4]{(x - 1)^2}$ e $\sqrt[6]{x^3}$.

$\sqrt[6]{x^2}$ esiste per ogni $x$. Il MCD tra $6$ e $2$ è $2$; l'indice di partenza è pari e l'esponente che resta è $1$, dispari:

$$\sqrt[6]{x^2} = \sqrt[3]{|x|}$$

Senza valore assoluto, per $x = -8$ il primo membro varrebbe $\sqrt[6]{64} = 2$ e $\sqrt[3]{-8}$ varrebbe $-2$.

$\sqrt[10]{a^6 b^4}$ esiste per ogni $a$ e $b$. Il MCD tra $10$, $6$ e $4$ è $2$. Dopo la divisione $a$ ha esponente $3$, dispari, e prende il valore assoluto; $b$ ha esponente $2$, pari, e non lo prende:

$$\sqrt[10]{a^6 b^4} = \sqrt[5]{|a|^3 b^2}$$

$\sqrt[4]{(x - 1)^2}$ esiste per ogni $x$, e la base $x - 1$ può essere negativa:

$$\sqrt[4]{(x - 1)^2} = \sqrt{|x - 1|}$$

$\sqrt[6]{x^3}$ ha indice pari, quindi C.E.: $x^3 \ge 0$, cioè $x \ge 0$. Per questi valori la base è già positiva o nulla, e il valore assoluto non serve:

$$\sqrt[6]{x^3} = \sqrt{x}$$
```

```ad-note
Le lettere nelle lezioni che seguono
Nelle lezioni sulle operazioni, sulla razionalizzazione e sulle espressioni con i radicali, per non appesantire i conti, si dice all'inizio che le lettere sotto radice indicano numeri positivi: così ogni radicale esiste e i valori assoluti non servono. Se un esercizio non lo dice, valgono le condizioni di esistenza e le regole sul valore assoluto di questa lezione.
```

## Riduzione allo stesso indice

Per fare i conti con radicali di indici diversi, o per confrontarli, si trasformano in radicali con lo stesso indice, come si portano due frazioni allo stesso denominatore. L'indice comune è il [MCM](/materiale/scuola-superiore/matematica/numeri-naturali/mcd-e-mcm-in-n) degli indici.

1. Controlla che i radicali siano aritmetici: con le lettere scrivi le C.E., con un radicando negativo e indice dispari porta fuori il segno meno.
2. Semplifica i radicali che non sono irriducibili.
3. Calcola il MCM degli indici: è il nuovo indice.
4. Per ogni radicale dividi il MCM per il suo indice, e per il numero che ottieni moltiplica l'esponente del radicando.

```ad-example
Esempio 6: tre radicali allo stesso indice
Riduci allo stesso indice $\sqrt{2}$, $\sqrt[3]{3}$ e $\sqrt[4]{5}$.

Il MCM tra $2$, $3$ e $4$ è $12$. Per $\sqrt{2}$ il fattore è $12 : 2 = 6$, per $\sqrt[3]{3}$ è $12 : 3 = 4$, per $\sqrt[4]{5}$ è $12 : 4 = 3$:

$$
\begin{gathered}
\sqrt{2} = \sqrt[12]{2^6} = \sqrt[12]{64} \\
\sqrt[3]{3} = \sqrt[12]{3^4} = \sqrt[12]{81} \\
\sqrt[4]{5} = \sqrt[12]{5^3} = \sqrt[12]{125}
\end{gathered}
$$
```

```ad-example
Esempio 7: con le lettere
Riduci allo stesso indice $\sqrt{x}$ e $\sqrt[3]{x}$.

Il primo radicale ha indice pari: C.E.: $x \ge 0$. Con questa condizione anche il radicando di $\sqrt[3]{x}$ è positivo o nullo, e la proprietà invariantiva si può usare su tutti e due. Il MCM tra $2$ e $3$ è $6$:

$$
\begin{gathered}
\sqrt{x} = \sqrt[6]{x^3} \\
\sqrt[3]{x} = \sqrt[6]{x^2}
\end{gathered}
$$
```

## Confronto tra radicali

Tra due radicali aritmetici con lo stesso indice è maggiore quello con il radicando maggiore: per $a, b \ge 0$

$$a < b \quad \Longleftrightarrow \quad \sqrt[n]{a} < \sqrt[n]{b}$$

Il motivo è che, tra numeri positivi o nulli, elevare alla $n$ conserva l'ordine: il numero più grande ha anche la potenza più grande. Per esempio $\sqrt{5} < \sqrt{7}$ e $\sqrt[3]{10} > \sqrt[3]{9}$. Se gli indici sono diversi, prima si riducono allo stesso indice e poi si confrontano i radicandi.

Anche un numero intero si confronta con un radicale scrivendolo come radicale con lo stesso indice: $3 = \sqrt[4]{3^4} = \sqrt[4]{81}$, quindi $3 > \sqrt[4]{80}$. Per confrontare radicali con un coefficiente davanti, come $2\sqrt{3}$ e $3\sqrt{2}$, si porta il coefficiente sotto la radice, come spiegato in [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).

```ad-warning
Confrontare i radicandi con indici diversi
$5 > 3$, ma $\sqrt[3]{5} < \sqrt{3}$. Con indici diversi i radicandi da soli non dicono niente: allo stesso indice $\sqrt[3]{5} = \sqrt[6]{25}$ e $\sqrt{3} = \sqrt[6]{27}$, e $25 < 27$.
```

```ad-example
Esempio 8: confrontare due radicali
Qual è il maggiore tra $\sqrt{3}$ e $\sqrt[3]{5}$?

Il MCM tra $2$ e $3$ è $6$:

$$
\begin{gathered}
\sqrt{3} = \sqrt[6]{3^3} = \sqrt[6]{27} \\
\sqrt[3]{5} = \sqrt[6]{5^2} = \sqrt[6]{25}
\end{gathered}
$$

Poiché $27 > 25$, $\sqrt{3} > \sqrt[3]{5}$. Con la calcolatrice: $\sqrt{3} \approx 1{,}73$ e $\sqrt[3]{5} \approx 1{,}71$.
```

```ad-example
Esempio 9: ordinare tre radicali
Scrivi in ordine crescente $\sqrt[3]{4}$, $\sqrt{2}$ e $\sqrt[4]{5}$.

Il MCM tra $3$, $2$ e $4$ è $12$:

$$
\begin{gathered}
\sqrt[3]{4} = \sqrt[12]{4^4} = \sqrt[12]{256} \\
\sqrt{2} = \sqrt[12]{2^6} = \sqrt[12]{64} \\
\sqrt[4]{5} = \sqrt[12]{5^3} = \sqrt[12]{125}
\end{gathered}
$$

I radicandi in ordine crescente sono $64 < 125 < 256$, quindi

$$\sqrt{2} < \sqrt[4]{5} < \sqrt[3]{4}$$
```

```ad-example
Esempio 10: radicali negativi
Qual è il maggiore tra $\sqrt[3]{-3}$ e $-\sqrt{2}$?

Porta fuori il segno meno: $\sqrt[3]{-3} = -\sqrt[3]{3}$. Confronta prima i radicali aritmetici $\sqrt[3]{3}$ e $\sqrt{2}$, con indice comune $6$:

$$
\begin{gathered}
\sqrt[3]{3} = \sqrt[6]{3^2} = \sqrt[6]{9} \\
\sqrt{2} = \sqrt[6]{2^3} = \sqrt[6]{8}
\end{gathered}
$$

Quindi $\sqrt[3]{3} > \sqrt{2}$. Tra i loro opposti l'ordine si rovescia, come tra $-3$ e $-2$: $-\sqrt[3]{3} < -\sqrt{2}$, cioè $\sqrt[3]{-3} < -\sqrt{2}$. Il maggiore è $-\sqrt{2}$.
```

```ad-warning
Portare allo stesso indice un radicale negativo
Da $\sqrt[3]{-3}$ non si passa a $\sqrt[6]{(-3)^2} = \sqrt[6]{9}$, che è positivo. Prima si porta fuori il segno meno, poi si riduce allo stesso indice il radicale aritmetico, e il meno resta davanti: $\sqrt[3]{-3} = -\sqrt[6]{9}$.
```

I radicali si possono scrivere anche come potenze con esponente frazionario, $\sqrt[n]{a^m} = a^{\frac{m}{n}}$: con questa scrittura la proprietà invariantiva diventa la proprietà delle frazioni equivalenti, $\dfrac{m}{n} = \dfrac{m \cdot p}{n \cdot p}$. Lo trovi in [Potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale). Prodotti, quozienti e potenze di radicali sono nella lezione [Operazioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/operazioni-con-i-radicali).
