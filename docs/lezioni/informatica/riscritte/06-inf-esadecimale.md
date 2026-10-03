# Il sistema esadecimale

Un numero binario è scomodo da leggere e da copiare: $1111\,1111\,1000\,0000\,0000\,0000_2$ sono ventiquattro cifre, e sbagliarne una è facile. Lo stesso numero in base sedici è $\text{FF8000}_{16}$, sei cifre, ed è il codice con cui una pagina web indica il colore arancione. Il sistema esadecimale è il modo in cui le persone scrivono in breve quello che il computer tiene in binario, perché tra le due basi si passa senza fare conti: ogni cifra esadecimale corrisponde a quattro bit.

## Sedici cifre

Il **sistema esadecimale** è il sistema posizionale in base sedici. Servono sedici cifre: le dieci da $0$ a $9$ non bastano, e per i valori da dieci a quindici si usano le lettere da A a F.

| Esadecimale | Decimale | Binario | | Esadecimale | Decimale | Binario |
|---|---|---|---|---|---|---|
| $0$ | $0$ | $0000$ | | $8$ | $8$ | $1000$ |
| $1$ | $1$ | $0001$ | | $9$ | $9$ | $1001$ |
| $2$ | $2$ | $0010$ | | $\text{A}$ | $10$ | $1010$ |
| $3$ | $3$ | $0011$ | | $\text{B}$ | $11$ | $1011$ |
| $4$ | $4$ | $0100$ | | $\text{C}$ | $12$ | $1100$ |
| $5$ | $5$ | $0101$ | | $\text{D}$ | $13$ | $1101$ |
| $6$ | $6$ | $0110$ | | $\text{E}$ | $14$ | $1110$ |
| $7$ | $7$ | $0111$ | | $\text{F}$ | $15$ | $1111$ |

Come in ogni sistema posizionale (lezione [I sistemi di numerazione posizionali](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/i-sistemi-di-numerazione-posizionali)), le posizioni si contano da destra a partire da $0$ e la posizione $k$ pesa $16^k$: i primi pesi sono $1$, $16$, $256$, $4096$. Un numero esadecimale si scrive con la base a pedice, $\text{2F}_{16}$, e si legge una cifra alla volta: "due effe in base sedici".

```ad-warning
Le lettere sono cifre
In $\text{2F}_{16}$ la F non è una variabile e non è una lettera dell'alfabeto: è la cifra che vale quindici. E $10_{16}$ non è dieci ma sedici, perché in ogni base la scrittura $10$ indica la base stessa.
```

## Da esadecimale a decimale

Si usa la forma polinomiale, con le potenze di $16$.

1. Sostituisci le lettere con il loro valore: A con $10$, B con $11$, fino a F con $15$.
2. Moltiplica ogni cifra per il peso della sua posizione: $1$, $16$, $256$ partendo da destra.
3. Somma i prodotti.

```ad-example
Esempio 1: due cifre
Converti $\text{2F}_{16}$ in base dieci.

La cifra $2$ è nella posizione $1$, che pesa $16$; la cifra F vale $15$ ed è nella posizione $0$.

$$
\text{2F}_{16} = 2 \cdot 16 + 15 \cdot 1 = 32 + 15 = 47
$$
```

```ad-example
Esempio 2: tre cifre
Converti $\text{1C8}_{16}$ in base dieci.

I pesi sono $256$, $16$, $1$ e la cifra C vale $12$.

$$
\text{1C8}_{16} = 1 \cdot 256 + 12 \cdot 16 + 8 \cdot 1 = 256 + 192 + 8 = 456
$$
```

```ad-example
Esempio 3: il numero più grande di due cifre
Converti $\text{FF}_{16}$ in base dieci.

$$
\text{FF}_{16} = 15 \cdot 16 + 15 = 240 + 15 = 255
$$

È il valore più grande che sta in un byte: con due cifre esadecimali si scrivono $16^2 = 256$ numeri, da $0$ a $255$.
```

## Da decimale a esadecimale

Il metodo è quello delle divisioni successive della lezione [Conversioni tra binario e decimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/conversioni-tra-binario-e-decimale), dividendo per $16$ invece che per $2$.

1. Dividi il numero per $16$ e scrivi il quoziente e il resto, che va da $0$ a $15$.
2. Ripeti sul quoziente finché diventa $0$.
3. Trasforma i resti da $10$ a $15$ nelle cifre da A a F.
4. Leggi i resti dal basso verso l'alto.

```ad-example
Esempio 4: il numero 456
Converti $456$ in esadecimale.

| Divisione | Quoziente | Resto |
|---|---|---|
| $456 : 16$ | $28$ | $8$ |
| $28 : 16$ | $1$ | $12$, cioè C |
| $1 : 16$ | $0$ | $1$ |

Dal basso verso l'alto: $1$, C, $8$. Quindi $456 = \text{1C8}_{16}$, come nell'esempio 2.
```

```ad-warning
Un resto maggiore di 9 è una sola cifra
Il resto $12$ si scrive C. Scrivere $1128_{16}$ al posto di $\text{1C8}_{16}$ aggiunge una cifra e cambia il numero: $1128_{16}$ vale $4392$.
```

## Tra binario ed esadecimale: gruppi di quattro bit

Poiché $16 = 2^4$, quattro bit hanno esattamente sedici combinazioni, da $0000$ a $1111$: tante quante le cifre esadecimali. Ogni cifra esadecimale corrisponde quindi a un gruppo di quattro bit, quello della tabella iniziale, e la conversione si fa sostituendo un pezzo alla volta.

Da binario a esadecimale:

1. Dividi i bit in gruppi di quattro partendo da destra.
2. Se il gruppo più a sinistra ha meno di quattro bit, completalo con degli zeri a sinistra.
3. Sostituisci ogni gruppo con la sua cifra esadecimale.

```ad-example
Esempio 5: dieci bit
Converti $10\,1101\,0110_2$ in esadecimale.

I gruppi, da destra, sono $0110$, $1101$ e $10$, che si completa in $0010$. Il gruppo $0010$ vale $2$, il gruppo $1101$ vale $13$, cioè D, e il gruppo $0110$ vale $6$.

$$
10\,1101\,0110_2 = \text{2D6}_{16}
$$
```

```tikz
% nome: binario-esadecimale-gruppi
% alt: I dieci bit di 10 1101 0110 divisi in tre gruppi di quattro a partire da destra; al gruppo di sinistra, che ha solo i bit 1 e 0, sono aggiunti due zeri in grigio. Sotto ogni gruppo una freccia porta alla sua cifra esadecimale: 2, D, 6
% svg: binario-esadecimale-gruppi-06a4a827.svg 267x95
\begin{tikzpicture}[font=\small]
\foreach \g/\h [count=\i from 0] in {10/2, 1101/\mathrm{D}, 0110/6} {
  \node[draw, thick, fill=blue!10, minimum width=1.7cm, minimum height=0.8cm] (g\i) at (2.1*\i,0) {};
  \node[draw, thick, fill=orange!30, minimum width=0.8cm, minimum height=0.8cm, font=\large] (h\i) at (2.1*\i,-1.6) {$\h$};
  \draw[-{Stealth}, thick] (g\i) -- (h\i);
}
\node[font=\large] at (0,0) {$\textcolor{gray}{00}10$};
\node[font=\large] at (2.1,0) {$1101$};
\node[font=\large] at (4.2,0) {$0110$};
\node[left] at (-1.05,0) {bit};
\node[left] at (-1.05,-1.6) {cifra};
\end{tikzpicture}
```

Da esadecimale a binario si fa il contrario: ogni cifra diventa il suo gruppo di quattro bit, sempre con tutti e quattro i bit, e i gruppi si scrivono di seguito.

```ad-example
Esempio 6: da esadecimale a binario
Converti $\text{7A}_{16}$ in binario.

La cifra $7$ diventa $0111$ e la cifra A, che vale $10$, diventa $1010$.

$$
\text{7A}_{16} = 0111\,1010_2 = 111\,1010_2
$$

Lo zero iniziale si può togliere, perché non cambia il valore; resta se il numero deve occupare un byte intero.
```

```ad-example
Esempio 7: una cifra zero in mezzo
Converti $\text{C05}_{16}$ in binario.

C diventa $1100$, lo $0$ diventa $0000$ e il $5$ diventa $0101$.

$$
\text{C05}_{16} = 1100\,0000\,0101_2
$$
```

```ad-warning
Due errori con i gruppi
I gruppi si formano da destra: dividendo $10\,1101\,0110_2$ da sinistra si otterrebbero $1011$, $0101$, $10$, e il numero sbagliato. Nell'altro verso, ogni cifra vale sempre quattro bit: scrivere $0$ al posto di $0000$ e $101$ al posto di $0101$ trasforma $\text{C05}_{16}$ in $1100\,0101_2$, che è $\text{C5}_{16}$.
```

## Il sistema ottale

Il **sistema ottale** è il sistema posizionale in base otto, con le cifre da $0$ a $7$ e i pesi $1$, $8$, $64$, $512$. Funziona come l'esadecimale, ma poiché $8 = 2^3$ ogni cifra ottale corrisponde a un gruppo di tre bit: $0$ è $000$, $1$ è $001$, e così via fino a $7$, che è $111$.

```ad-example
Esempio 8: binario, ottale, decimale
Converti $11\,0101_2$ in ottale, e poi in base dieci.

I gruppi di tre bit, da destra, sono $101$ e $110$: valgono $5$ e $6$. Quindi $11\,0101_2 = 65_8$.

In base dieci: $65_8 = 6 \cdot 8 + 5 = 53$. Lo stesso valore si trova dal binario: $32 + 16 + 4 + 1 = 53$.
```

Oggi l'ottale si incontra molto meno dell'esadecimale. Il motivo è che un byte ha otto bit, che si dividono in due gruppi di quattro ma non in gruppi di tre.

## Dove si incontra l'esadecimale

Un byte, cioè otto bit, si scrive sempre con due cifre esadecimali, da $00$ a $\text{FF}$: per questo l'esadecimale compare ovunque si debbano mostrare dei byte.

- I colori. Sullo schermo un colore è la somma di tre luci, rossa, verde e blu, ognuna con un'intensità da $0$ a $255$, cioè un byte. Nelle pagine web e nei programmi di grafica il colore si scrive con il simbolo `#` seguito da sei cifre esadecimali: due per il rosso, due per il verde, due per il blu. Ne parla la lezione [La codifica delle immagini: pixel e colori](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori).
- Gli indirizzi. Ogni scheda di rete ha un indirizzo fisico (indirizzo MAC) di sei byte, scritto come sei coppie di cifre esadecimali, per esempio `3C:22:FB:10:A4:7E`; anche gli indirizzi delle celle di memoria si scrivono di solito in esadecimale.

```ad-example
Esempio 9: leggere un colore
Che colore è `#FF8000`?

Le sei cifre si leggono a coppie: rosso $\text{FF}_{16}$, verde $80_{16}$, blu $00_{16}$.

$$
\text{FF}_{16} = 255 \qquad 80_{16} = 8 \cdot 16 + 0 = 128 \qquad 00_{16} = 0
$$

Il rosso è al massimo, il verde a metà, il blu è spento: è un arancione. Allo stesso modo `#000000` è il nero, con le tre luci spente, e `#FFFFFF` è il bianco, con le tre luci al massimo.
```

```tikz
% nome: colore-esadecimale-componenti
% alt: Il codice di colore cancelletto FF8000 diviso in tre coppie di cifre esadecimali: FF per il rosso, 80 per il verde, 00 per il blu; sotto ogni coppia il suo valore in base dieci, cioè 255, 128 e 0
% svg: colore-esadecimale-componenti-9998faba.svg 270x77
\begin{tikzpicture}[font=\small]
\node[font=\large] at (-1.1,0) {\#};
\foreach \h/\n/\v [count=\i from 0] in {FF/rosso/255, 80/verde/128, 00/blu/0} {
  \node[draw, thick, fill=blue!10, minimum width=1.3cm, minimum height=0.8cm, font=\large] at (1.5*\i,0) {$\mathrm{\h}$};
  \node at (1.5*\i,0.75) {\n};
  \node at (1.5*\i,-0.75) {$\v$};
}
\node[left] at (-1.4,-0.75) {in base dieci};
\end{tikzpicture}
```
