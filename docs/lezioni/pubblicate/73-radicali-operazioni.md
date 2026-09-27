# Operazioni con i radicali

Il prodotto $\sqrt{2} \cdot \sqrt{8}$ sembra un conto tra due numeri irrazionali, eppure vale $4$: moltiplicando i radicandi ottieni $\sqrt{16}$. Con i radicali si fanno le stesse operazioni che si fanno con i numeri (prodotto, quoziente, potenza, somma), ma ognuna ha le sue regole, e la più usata di tutte serve a scrivere un risultato come $\sqrt{12}$ nella forma $2\sqrt{3}$.

Qui ti servono la definizione di radicale, la proprietà invariantiva e la riduzione allo stesso indice, che trovi in [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta), e i [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli) per l'ultima parte.

In questa lezione le lettere che compaiono sotto radice rappresentano numeri positivi: così tutti i radicali esistono e non servono valori assoluti. I casi con le condizioni di esistenza sono nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).

## Prodotto di radicali con lo stesso indice

Il prodotto di due radicali con lo stesso indice è il radicale che ha quell'indice e per radicando il prodotto dei radicandi:

$$\sqrt[n]{a} \cdot \sqrt[n]{b} = \sqrt[n]{a \cdot b}$$

La regola vale per $a \geq 0$ e $b \geq 0$, e si legge anche da destra a sinistra: la radice di un prodotto è il prodotto delle radici. Per esempio $\sqrt{3} \cdot \sqrt{12} = \sqrt{36} = 6$ e $\sqrt[3]{2} \cdot \sqrt[3]{4} = \sqrt[3]{8} = 2$.

Se i radicali hanno un coefficiente davanti, moltiplichi i coefficienti tra loro e i radicali tra loro, come nel prodotto di due monomi:

$$
\begin{aligned}
2\sqrt{3} \cdot 5\sqrt{2} &= 10\sqrt{6} \\
4\sqrt{5} \cdot 3\sqrt{5} &= 12 \cdot 5 = 60
\end{aligned}
$$

```ad-note
Radicandi negativi e indice dispari
Con indice dispari la regola vale anche per radicandi negativi: $\sqrt[3]{-2} \cdot \sqrt[3]{4} = \sqrt[3]{-8} = -2$. Con indice pari no: $\sqrt{-4} \cdot \sqrt{-9}$ non ha senso, perché nessuno dei due radicali esiste, anche se $\sqrt{(-4)(-9)} = \sqrt{36}$ esiste.
```

## Quoziente di radicali con lo stesso indice

Il quoziente di due radicali con lo stesso indice è il radicale che ha quell'indice e per radicando il quoziente dei radicandi:

$$\sqrt[n]{a} : \sqrt[n]{b} = \sqrt[n]{a : b}$$

con $a \geq 0$ e $b > 0$. Si scrive anche con la frazione, $\dfrac{\sqrt[n]{a}}{\sqrt[n]{b}} = \sqrt[n]{\dfrac{a}{b}}$. Per esempio $\dfrac{\sqrt{18}}{\sqrt{2}} = \sqrt{9} = 3$ e $\sqrt[3]{54} : \sqrt[3]{2} = \sqrt[3]{27} = 3$. Anche qui i coefficienti si dividono tra loro: $6\sqrt{10} : 2\sqrt{5} = 3\sqrt{2}$.

Letta da destra a sinistra, la regola dice che la radice di una frazione è la radice del numeratore fratto la radice del denominatore: $\sqrt{\dfrac{9}{25}} = \dfrac{3}{5}$.

## Prodotto e quoziente con indici diversi

Se gli indici sono diversi, prima si riducono i radicali allo stesso indice, il mcm degli indici, con la proprietà invariantiva; poi si applica la regola di prima.

```ad-example
Esempio 1: indici 2 e 3
Calcola $\sqrt{2} \cdot \sqrt[3]{2}$.

Il mcm tra $2$ e $3$ è $6$. Il primo indice va moltiplicato per $3$, il secondo per $2$, e i radicandi vanno elevati allo stesso numero:

$$
\begin{aligned}
\sqrt{2} &= \sqrt[6]{2^3} = \sqrt[6]{8} \\
\sqrt[3]{2} &= \sqrt[6]{2^2} = \sqrt[6]{4}
\end{aligned}
$$

$$\sqrt[6]{8} \cdot \sqrt[6]{4} = \sqrt[6]{32}$$
```

```ad-example
Esempio 2: un quoziente con le lettere
Calcola $\sqrt[4]{a^3} : \sqrt{a}$.

Il mcm tra $4$ e $2$ è $4$, quindi cambia solo il secondo radicale: $\sqrt{a} = \sqrt[4]{a^2}$.

$$\sqrt[4]{a^3} : \sqrt[4]{a^2} = \sqrt[4]{a}$$
```

```ad-warning
Indici diversi: non si moltiplicano indici e radicandi
$\sqrt{2} \cdot \sqrt[3]{2}$ non è $\sqrt[6]{4}$ e non è $\sqrt[5]{4}$. Prima si porta ogni radicale all'indice comune, elevando il suo radicando: $\sqrt[6]{8} \cdot \sqrt[6]{4} = \sqrt[6]{32}$.
```

## Trasporto di un fattore fuori dal segno di radice

Leggendo la regola del prodotto da destra a sinistra, un fattore del radicando che è una potenza con esponente uguale all'indice può uscire dalla radice:

$$\sqrt[n]{a^n \cdot b} = a\sqrt[n]{b}$$

con $a \geq 0$ e $b \geq 0$. Per esempio $\sqrt{12} = \sqrt{4 \cdot 3} = \sqrt{2^2 \cdot 3} = 2\sqrt{3}$. Questa operazione si chiama **trasporto fuori dal segno di radice** ed è quella che si usa per ridurre i risultati: per convenzione un radicale si lascia con il radicando più piccolo possibile, quindi si scrive $2\sqrt{3}$ e non $\sqrt{12}$.

Quando un fattore ha un esponente più grande dell'indice, dividi l'esponente per l'indice: il quoziente è l'esponente del fattore che esce, il resto è l'esponente del fattore che rimane dentro. In $\sqrt[3]{a^7}$ hai $7 : 3 = 2$ con resto $1$, quindi $\sqrt[3]{a^7} = a^2\sqrt[3]{a}$. Se il resto è $0$ il fattore esce tutto: $\sqrt{a^6} = a^3$.

### Come si porta fuori un fattore

1. Scomponi il radicando in fattori primi, se è un numero, e scrivilo come prodotto di potenze.
2. Per ogni fattore, dividi l'esponente per l'indice.
3. Porta fuori il fattore con esponente uguale al quoziente; lascia dentro il fattore con esponente uguale al resto.
4. Moltiplica i fattori fuori con l'eventuale coefficiente che c'era già.

```ad-example
Esempio 3: radicandi numerici
$$
\begin{aligned}
\sqrt{72} &= \sqrt{2^3 \cdot 3^2} \\
&= 2 \cdot 3\sqrt{2} = 6\sqrt{2}
\end{aligned}
$$

Il $2^3$ lascia fuori un $2$ e dentro un $2$ ($3 : 2 = 1$ con resto $1$); il $3^2$ esce tutto.

$$
\begin{aligned}
\sqrt[3]{54} &= \sqrt[3]{3^3 \cdot 2} = 3\sqrt[3]{2} \\
5\sqrt{20} &= 5\sqrt{2^2 \cdot 5} \\
&= 5 \cdot 2\sqrt{5} = 10\sqrt{5}
\end{aligned}
$$
```

```ad-example
Esempio 4: con le lettere
$$
\begin{aligned}
\sqrt{a^5b^2} &= a^2b\sqrt{a} \\
\sqrt[3]{16x^7} &= \sqrt[3]{2^4x^7} \\
&= 2x^2\sqrt[3]{2x}
\end{aligned}
$$

In $\sqrt[3]{2^4x^7}$: $4 : 3 = 1$ con resto $1$, e $7 : 3 = 2$ con resto $1$. Fuori restano $2^1x^2$, dentro $2^1x^1$.
```

```ad-example
Esempio 5: un radicando con una frazione
$$\sqrt{\frac{12a^3}{b^2}} = \frac{2a}{b}\sqrt{3a}$$

Il numeratore dà $\sqrt{2^2 \cdot 3 \cdot a^2 \cdot a} = 2a\sqrt{3a}$, il denominatore dà $\sqrt{b^2} = b$.
```

```ad-warning
Si porta fuori un fattore, non un addendo
$\sqrt{9 + 16} = \sqrt{25} = 5$, mentre $3 + 4 = 7$: la radice di una somma non è la somma delle radici. Allo stesso modo $\sqrt{a^2 + b^2}$ non è $a + b$, e in $\sqrt{4x^2 + 4}$ non esce niente finché non raccogli: $\sqrt{4(x^2 + 1)} = 2\sqrt{x^2 + 1}$.
```

```ad-note
Se le lettere possono essere negative
Senza l'ipotesi che le lettere siano positive, un fattore che esce da una radice di indice pari va messo in valore assoluto, perché $\sqrt{a^2} = |a|$: per esempio $\sqrt{4x^2} = 2|x|$ e $\sqrt{a^2b} = |a|\sqrt{b}$. Il valore assoluto non serve quando le condizioni di esistenza dicono già che la lettera è positiva o nulla: in $\sqrt{a^3}$ deve essere $a \geq 0$, quindi $\sqrt{a^3} = a\sqrt{a}$. Con indice dispari non serve mai: $\sqrt[3]{a^3b} = a\sqrt[3]{b}$ per ogni $a$. Il perché è nella lezione [Radicali e loro proprietà](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/radicali-e-loro-proprieta).
```

## Trasporto di un fattore dentro il segno di radice

È l'operazione inversa: un fattore positivo che moltiplica un radicale entra sotto radice elevato all'indice.

$$a\sqrt[n]{b} = \sqrt[n]{a^n \cdot b}$$

Per esempio $2\sqrt{3} = \sqrt{4 \cdot 3} = \sqrt{12}$ e $2\sqrt[3]{5} = \sqrt[3]{8 \cdot 5} = \sqrt[3]{40}$. Serve per confrontare due radicali con il coefficiente, per esempio $2\sqrt{3}$ e $3\sqrt{2}$: diventano $\sqrt{12}$ e $\sqrt{18}$, e quindi $2\sqrt{3} < 3\sqrt{2}$. Serve anche prima di una radice di radicale, come nell'esempio 7.

Con le lettere: $a\sqrt{\dfrac{b}{a}} = \sqrt{\dfrac{a^2b}{a}} = \sqrt{ab}$.

```ad-warning
Il segno meno resta fuori
Il fattore entra elevato all'indice, e con indice pari il segno si perderebbe: $-2\sqrt{3}$ è un numero negativo, $\sqrt{12}$ è positivo. Quindi $-2\sqrt{3} = -\sqrt{12}$: entra solo il $2$, il meno resta davanti. Con indice dispari il meno può entrare: $-2\sqrt[3]{3} = \sqrt[3]{-24}$.
```

## Potenza e radice di un radicale

Per elevare un radicale a potenza, si eleva il radicando:

$$\left(\sqrt[n]{a}\right)^m = \sqrt[n]{a^m}$$

Per esempio $\left(\sqrt[3]{2}\right)^4 = \sqrt[3]{16} = 2\sqrt[3]{2}$. Quando l'esponente è uguale all'indice, radice e potenza si annullano: $\left(\sqrt{5}\right)^2 = 5$ e $\left(\sqrt[3]{7}\right)^3 = 7$.

La radice di un radicale è un radicale con lo stesso radicando e con indice uguale al prodotto degli indici:

$$\sqrt[m]{\sqrt[n]{a}} = \sqrt[m \cdot n]{a}$$

Per esempio $\sqrt{\sqrt[3]{5}} = \sqrt[6]{5}$ e $\sqrt[3]{\sqrt{64}} = \sqrt[6]{64} = 2$.

```ad-example
Esempio 6: la potenza di un radicale con il coefficiente
$$
\begin{aligned}
\left(2\sqrt{3}\right)^2 &= 2^2 \cdot \left(\sqrt{3}\right)^2 \\
&= 4 \cdot 3 = 12
\end{aligned}
$$

Si eleva al quadrato tutto il prodotto, coefficiente compreso, come per un monomio.
```

```ad-warning
La potenza del coefficiente
$\left(2\sqrt{3}\right)^2$ vale $12$: non $6$, che dimentica di elevare il $2$, e non $36$, che eleva al quadrato il $2$ e il $3$ come se $\sqrt{3}$ fosse $3$.
```

```ad-example
Esempio 7: un coefficiente sotto la radice esterna
Calcola $\sqrt{2\sqrt{2}}$.

Prima porta il $2$ dentro la radice interna: $2\sqrt{2} = \sqrt{4 \cdot 2} = \sqrt{8}$. Poi moltiplica gli indici:

$$\sqrt{2\sqrt{2}} = \sqrt{\sqrt{8}} = \sqrt[4]{8}$$
```

## Radicali simili e somma algebrica

Due radicali sono **simili** se hanno lo stesso indice e lo stesso radicando; possono differire solo per il coefficiente. Per esempio $3\sqrt{2}$ e $-5\sqrt{2}$ sono simili; $\sqrt{2}$ e $\sqrt{3}$ no, e neppure $\sqrt{2}$ e $\sqrt[3]{2}$.

Si possono sommare solo i radicali simili, e si fa come con i monomi simili: si sommano i coefficienti e si lascia il radicale. È la proprietà distributiva:

$$3\sqrt{2} + 5\sqrt{2} = (3 + 5)\sqrt{2} = 8\sqrt{2}$$

Una somma di radicali non simili resta com'è: $\sqrt{2} + \sqrt{3}$ non si riduce, e lo stesso vale per $3 + 2\sqrt{5}$. Prima di arrenderti, però, porta fuori tutto quello che si può: radicali che sembrano diversi spesso diventano simili.

```ad-example
Esempio 8: radicali che diventano simili
$$
\begin{aligned}
&\sqrt{50} - \sqrt{18} + \sqrt{8} \\
&= 5\sqrt{2} - 3\sqrt{2} + 2\sqrt{2} \\
&= 4\sqrt{2}
\end{aligned}
$$

Con le lettere: $\sqrt{4a} + \sqrt{9a} = 2\sqrt{a} + 3\sqrt{a} = 5\sqrt{a}$.
```

```ad-example
Esempio 9: due gruppi di radicali simili
$$
\begin{aligned}
&\sqrt{12} + \sqrt{20} - \sqrt{27} \\
&= 2\sqrt{3} + 2\sqrt{5} - 3\sqrt{3} \\
&= -\sqrt{3} + 2\sqrt{5}
\end{aligned}
$$

$2\sqrt{3}$ e $-3\sqrt{3}$ si sommano; $2\sqrt{5}$ resta da solo.
```

```ad-warning
La somma dei radicandi
$\sqrt{2} + \sqrt{3}$ non è $\sqrt{5}$: con i numeri, $\sqrt{9} + \sqrt{16} = 3 + 4 = 7$, mentre $\sqrt{25} = 5$. E $3\sqrt{2} + \sqrt{2}$ vale $4\sqrt{2}$, perché il coefficiente di $\sqrt{2}$ è $1$: non $3\sqrt{4}$ e non $3\sqrt{2}$.
```

## Prodotti notevoli con i radicali

Un radicale si comporta come un monomio, quindi i [prodotti notevoli](/materiale/scuola-superiore/matematica/monomi-e-polinomi/prodotti-notevoli) valgono anche qui. Nel quadrato di un binomio ogni radice quadrata elevata al quadrato ridà il suo radicando, $\left(\sqrt{a}\right)^2 = a$, mentre il doppio prodotto contiene di solito un radicale:

$$
\begin{gathered}
\left(\sqrt{a} + \sqrt{b}\right)^2 \\
= a + 2\sqrt{ab} + b
\end{gathered}
$$

Nella somma per differenza i radicali quadratici spariscono, perché restano solo due quadrati:

$$
\begin{gathered}
\left(\sqrt{a} + \sqrt{b}\right)\left(\sqrt{a} - \sqrt{b}\right) \\
= a - b
\end{gathered}
$$

Questa seconda formula è quella che si usa nella [razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione) per togliere i radicali dal denominatore.

```ad-example
Esempio 10: quadrati di binomi
$$
\begin{aligned}
\left(1 + \sqrt{2}\right)^2 &= 1 + 2\sqrt{2} + 2 \\
&= 3 + 2\sqrt{2}
\end{aligned}
$$

$$
\begin{aligned}
\left(\sqrt{5} - \sqrt{3}\right)^2 &= 5 - 2\sqrt{15} + 3 \\
&= 8 - 2\sqrt{15}
\end{aligned}
$$

$$
\begin{aligned}
\left(2\sqrt{3} - 1\right)^2 &= 12 - 4\sqrt{3} + 1 \\
&= 13 - 4\sqrt{3}
\end{aligned}
$$

Nell'ultimo il primo quadrato è $\left(2\sqrt{3}\right)^2 = 12$, come nell'esempio 6.
```

```ad-example
Esempio 11: somma per differenza
$$
\begin{aligned}
&\left(\sqrt{7} + \sqrt{2}\right)\left(\sqrt{7} - \sqrt{2}\right) \\
&= 7 - 2 = 5
\end{aligned}
$$

$$
\begin{aligned}
&\left(3 - 2\sqrt{2}\right)\left(3 + 2\sqrt{2}\right) \\
&= 9 - 8 = 1
\end{aligned}
$$
```

```ad-warning
Il quadrato di una differenza di radicali
$\left(\sqrt{5} - \sqrt{3}\right)^2$ non è $5 - 3 = 2$: manca il doppio prodotto $-2\sqrt{15}$. Il risultato giusto è $8 - 2\sqrt{15}$.
```

## Esempi svolti

In questi esempi le operazioni della lezione si mescolano. L'ordine è quello delle espressioni con i numeri: potenze, poi prodotti e quozienti, poi somme; alla fine si porta fuori quello che si può e si sommano i radicali simili.

```ad-example
Esempio 12: prodotto e somma
Calcola $\sqrt{8} \cdot \sqrt{6} - 3\sqrt{3}$.

$$
\begin{aligned}
&\sqrt{8} \cdot \sqrt{6} - 3\sqrt{3} \\
&= \sqrt{48} - 3\sqrt{3} \\
&= 4\sqrt{3} - 3\sqrt{3} = \sqrt{3}
\end{aligned}
$$

Perché $48 = 2^4 \cdot 3$ e $\sqrt{2^4} = 2^2 = 4$.
```

```ad-example
Esempio 13: un prodotto di due binomi
Calcola $\left(\sqrt{2} + 3\right)\left(\sqrt{2} - 1\right)$.

Non è un prodotto notevole: moltiplica ogni termine del primo per ogni termine del secondo.

$$
\begin{aligned}
&\left(\sqrt{2} + 3\right)\left(\sqrt{2} - 1\right) \\
&= 2 - \sqrt{2} + 3\sqrt{2} - 3 \\
&= -1 + 2\sqrt{2}
\end{aligned}
$$
```

```ad-example
Esempio 14: un doppio prodotto che si cancella
Calcola $\left(\sqrt{3} - \sqrt{2}\right)^2 + 2\sqrt{6}$.

$$
\begin{aligned}
&\left(\sqrt{3} - \sqrt{2}\right)^2 + 2\sqrt{6} \\
&= 3 - 2\sqrt{6} + 2 + 2\sqrt{6} \\
&= 5
\end{aligned}
$$
```

```ad-example
Esempio 15: indice dispari e radicando negativo
Calcola $\sqrt[3]{-16} + \sqrt[3]{54}$.

Con indice $3$ il segno meno esce dalla radice: $\sqrt[3]{-16} = -\sqrt[3]{16}$.

$$
\begin{aligned}
&\sqrt[3]{-16} + \sqrt[3]{54} \\
&= -2\sqrt[3]{2} + 3\sqrt[3]{2} \\
&= \sqrt[3]{2}
\end{aligned}
$$
```

```ad-example
Esempio 16: tre indici diversi con le lettere
Calcola $\sqrt[3]{a^2} \cdot \sqrt{a} : \sqrt[6]{a}$.

Il mcm tra $3$, $2$ e $6$ è $6$:

$$
\begin{gathered}
\sqrt[3]{a^2} = \sqrt[6]{a^4} \\
\sqrt{a} = \sqrt[6]{a^3} \\[6pt]
\sqrt[6]{a^4 \cdot a^3 : a} = \sqrt[6]{a^6} = a
\end{gathered}
$$
```

```ad-example
Esempio 17: il cubo di un binomio
Calcola $\left(1 + \sqrt{2}\right)^3$.

Con la regola del cubo, $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$, e con $\left(\sqrt{2}\right)^2 = 2$ e $\left(\sqrt{2}\right)^3 = 2\sqrt{2}$:

$$
\begin{aligned}
&\left(1 + \sqrt{2}\right)^3 \\
&= 1 + 3\sqrt{2} + 3 \cdot 2 + 2\sqrt{2} \\
&= 7 + 5\sqrt{2}
\end{aligned}
$$
```

Dopo questa lezione puoi passare alla [razionalizzazione](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/razionalizzazione), che toglie i radicali dal denominatore, e alle [espressioni con i radicali](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/espressioni-con-i-radicali). Il trasporto fuori dal segno di radice serve anche nelle [equazioni di secondo grado](/materiale/scuola-superiore/matematica/equazioni-di-secondo-grado/equazioni-di-secondo-grado), quando il discriminante non è un quadrato perfetto.
