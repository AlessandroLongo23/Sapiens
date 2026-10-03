# La codifica delle immagini: pixel e colori

Se ingrandisci molto una foto sul telefono, a un certo punto vedi dei quadratini colorati. La foto è fatta solo di quelli: per un calcolatore un'immagine è una griglia di quadratini, e ogni quadratino è un numero che dice di che colore è. Da questa idea vengono le due grandezze che decidono la qualità di un'immagine e lo spazio che occupa: quanti sono i quadratini e quanti bit servono per ognuno.

## Pixel e immagini raster

Un'**immagine raster** (o bitmap) è un'immagine descritta come una griglia di punti colorati. Ogni punto della griglia si chiama **pixel** (da picture element, elemento dell'immagine) ed è la parte più piccola dell'immagine: dentro un pixel il colore è uno solo.

Nel caso più povero ogni pixel può essere solo acceso o spento, e per dirlo serve 1 bit. L'immagine diventa allora una sequenza di bit, letti riga per riga dall'alto verso il basso.

```tikz
% nome: griglia-pixel-un-bit
% alt: Una griglia di 8 per 8 pixel in cui i pixel colorati disegnano un cuore; a destra di ogni riga gli otto bit che la codificano, 1 per un pixel colorato e 0 per un pixel vuoto: la prima riga è 0110 0110, le tre successive 1111 1111, poi 0111 1110, 0011 1100, 0001 1000 e l'ultima 0000 0000
% svg: griglia-pixel-un-bit-19b92f50.svg 204x126
\begin{tikzpicture}
\fill[blue!45] (0.4,2.8) rectangle (1.2,3.2);
\fill[blue!45] (2.0,2.8) rectangle (2.8,3.2);
\fill[blue!45] (0,1.6) rectangle (3.2,2.8);
\fill[blue!45] (0.4,1.2) rectangle (2.8,1.6);
\fill[blue!45] (0.8,0.8) rectangle (2.4,1.2);
\fill[blue!45] (1.2,0.4) rectangle (2.0,0.8);
\draw[step=0.4, thin] (0,0) grid (3.2,3.2);
\draw[thick] (0,0) rectangle (3.2,3.2);
\foreach \r [count=\i from 0] in {0110\,0110, 1111\,1111, 1111\,1111, 1111\,1111, 0111\,1110, 0011\,1100, 0001\,1000, 0000\,0000} {
  \node[font=\small] at (4.5,3.0-\i*0.4) {\r};
}
\end{tikzpicture}
```

La griglia della figura ha $8 \cdot 8 = 64$ pixel e occupa $64$ bit, cioè $8$ byte: un byte per riga.

## La risoluzione

La **risoluzione** di un'immagine è il numero dei suoi pixel, scritto come larghezza per altezza: un'immagine $1920 \times 1080$ ha $1920$ pixel in ogni riga e $1080$ righe. Più pixel ci sono, più dettagli l'immagine può contenere.

```ad-example
Esempio 1: quanti pixel
Quanti pixel ha un'immagine $1920 \times 1080$?

$1920 \cdot 1080 = 2\,073\,600$ pixel, poco più di due milioni. Un milione di pixel si chiama megapixel: questa immagine ha circa $2$ megapixel.
```

```ad-note
Risoluzione e dimensioni sulla carta
I pixel non hanno una misura in centimetri: dipende da quanto fitti si stampano o si mostrano. La densità si misura in punti per pollice (dpi), e un pollice è $2{,}54\,\text{cm}$. Un'immagine $1800 \times 1200$ stampata a $300\,\text{dpi}$ è larga $1800 : 300 = 6$ pollici e alta $4$, cioè circa $15 \times 10\,\text{cm}$.
```

## La profondità di colore

La **profondità di colore** è il numero di bit usati per ogni pixel. Con $n$ bit le combinazioni sono $2^n$, e ogni combinazione è un colore diverso:

$$\text{numero di colori} = 2^n$$

| Bit per pixel | Colori | Uso tipico |
|---|---|---|
| $1$ | $2$ | bianco e nero, senza grigi |
| $8$ | $256$ | scala di grigi, oppure una tavolozza di $256$ colori |
| $24$ | $16\,777\,216$ | fotografie a colori |

```ad-example
Esempio 2: quanti bit per un certo numero di colori
Un'icona usa $16$ colori. Quanti bit per pixel servono? E per un disegno con $100$ colori?

Per $16$ colori: $2^4 = 16$, quindi servono $4$ bit.

Per $100$ colori: $2^6 = 64$ non basta e $2^7 = 128$ sì, quindi servono $7$ bit. Le combinazioni che avanzano restano inutilizzate.
```

## Il modello RGB

Uno schermo produce i colori mescolando tre luci: rossa, verde e blu. Nel **modello RGB** (Red, Green, Blue) il colore di un pixel è descritto da tre numeri, uno per ogni luce, che dicono quanto è intensa. Con $24$ bit per pixel ogni componente ha $8$ bit, quindi va da $0$ (luce spenta) a $255$ (luce al massimo).

| R | G | B | Colore |
|---|---|---|---|
| $255$ | $0$ | $0$ | rosso |
| $0$ | $255$ | $0$ | verde |
| $0$ | $0$ | $255$ | blu |
| $255$ | $255$ | $0$ | giallo |
| $0$ | $255$ | $255$ | ciano |
| $255$ | $0$ | $255$ | magenta |
| $0$ | $0$ | $0$ | nero |
| $255$ | $255$ | $255$ | bianco |
| $128$ | $128$ | $128$ | grigio |

Quando le tre componenti sono uguali il pixel è un grigio, più chiaro quanto più il valore è alto: da $0$, $0$, $0$ (nero) a $255$, $255$, $255$ (bianco). I colori possibili sono $256 \cdot 256 \cdot 256 = 2^{24} = 16\,777\,216$.

Un colore RGB si scrive spesso in esadecimale, due cifre per componente: `#FF8000` vuol dire R $= \text{FF}_{16} = 255$, G $= 80_{16} = 128$, B $= 0$, cioè un arancione. Le cifre esadecimali sono spiegate nella lezione [Il sistema esadecimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/il-sistema-esadecimale).

```ad-warning
Le luci non si mescolano come le tempere
Con i colori a tempera rosso e verde danno un marrone, e tutti i colori insieme un colore scuro. Con le luci è il contrario: rosso e verde al massimo danno il giallo, e le tre luci al massimo danno il bianco. Il nero è l'assenza di luce, cioè $0$, $0$, $0$.
```

## La dimensione di un'immagine non compressa

Se ogni pixel viene memorizzato così com'è, lo spazio occupato si calcola in quattro passi:

1. Calcola i pixel: larghezza per altezza.
2. Moltiplica per la profondità di colore: ottieni i bit.
3. Dividi per $8$: ottieni i byte.
4. Se serve, passa a un multiplo del byte, con il fattore giusto: $1\,\text{kB} = 1000\,\text{B}$ e $1\,\text{MB} = 1\,000\,000\,\text{B}$, oppure $1\,\text{KiB} = 1024\,\text{B}$ e $1\,\text{MiB} = 1024\,\text{KiB}$ (lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura)).

In una formula:

$$\text{byte} = \frac{\text{larghezza} \cdot \text{altezza} \cdot \text{bit per pixel}}{8}$$

```ad-example
Esempio 3: un'immagine a 24 bit
Quanti byte occupa un'immagine non compressa $640 \times 480$ a $24$ bit per pixel? E quanti kB?

1. Pixel: $640 \cdot 480 = 307\,200$.
2. Bit: $307\,200 \cdot 24 = 7\,372\,800$.
3. Byte: $7\,372\,800 : 8 = 921\,600$.
4. In kB, con $1\,\text{kB} = 1000\,\text{B}$: $921\,600 : 1000 = 921{,}6\,\text{kB}$.

A $24$ bit ogni pixel occupa $3$ byte, quindi si può anche moltiplicare subito i pixel per $3$.
```

```ad-example
Esempio 4: un'immagine in bianco e nero
Quanti byte occupa un'immagine non compressa $800 \times 600$ con $1$ bit per pixel?

1. Pixel: $800 \cdot 600 = 480\,000$.
2. Bit: $480\,000 \cdot 1 = 480\,000$.
3. Byte: $480\,000 : 8 = 60\,000$.

Qui un byte contiene $8$ pixel: l'immagine occupa $60\,000\,\text{B}$, cioè $60\,\text{kB}$.
```

```ad-example
Esempio 5: con i multipli binari
Quanti KiB occupa un'immagine non compressa $1024 \times 768$ a $8$ bit per pixel? Usa $1\,\text{KiB} = 1024\,\text{B}$.

1. Pixel: $1024 \cdot 768 = 786\,432$.
2. A $8$ bit ogni pixel occupa $1$ byte: $786\,432\,\text{B}$.
3. In KiB: $786\,432 : 1024 = 768\,\text{KiB}$.
```

```ad-warning
Bit per pixel, non byte per pixel
La profondità di colore è in bit. Se moltiplichi i pixel per $24$ e ti fermi, hai trovato i bit: il risultato in byte è otto volte più piccolo.
```

## La compressione e le immagini vettoriali

Una foto da $12$ megapixel a $24$ bit, non compressa, occuperebbe $12\,000\,000 \cdot 3 = 36\,000\,000\,\text{B}$, cioè $36\,\text{MB}$. Sul telefono lo stesso file occupa molto meno, perché le immagini si salvano quasi sempre con una **compressione**, cioè con un procedimento che riduce i bit necessari. Alcune compressioni conservano tutti i pixel esatti, altre ne cambiano un po' i colori in modo che l'occhio non se ne accorga, e risparmiano molto di più.

C'è poi un modo del tutto diverso di descrivere un'immagine. Un'**immagine vettoriale** non contiene pixel, ma le istruzioni per disegnare le forme: un cerchio con quel centro e quel raggio, una linea da qui a lì, un colore di riempimento. Ingrandendola, il calcolatore ridisegna le forme e i bordi restano netti; un'immagine raster ingrandita mostra invece i suoi pixel.

```tikz
% nome: cerchio-raster-e-vettoriale
% alt: Lo stesso cerchio molto ingrandito in due versioni: a sinistra raster, su una griglia di 10 per 10 pixel, con il bordo a scalini; a destra vettoriale, con il bordo liscio
% svg: cerchio-raster-e-vettoriale-f47d2712.svg 243x124
\begin{tikzpicture}
\fill[blue!45] (0.78,0.26) rectangle (1.82,2.34);
\fill[blue!45] (0.52,0.52) rectangle (0.78,2.08);
\fill[blue!45] (1.82,0.52) rectangle (2.08,2.08);
\fill[blue!45] (0.26,0.78) rectangle (0.52,1.82);
\fill[blue!45] (2.08,0.78) rectangle (2.34,1.82);
\draw[step=0.26, thin] (0,0) grid (2.6,2.6);
\draw[thick] (0,0) rectangle (2.6,2.6);
\node[font=\small] at (1.3,-0.35) {raster};
\draw[thick, fill=blue!45] (5.2,1.3) circle (1.12);
\node[font=\small] at (5.2,-0.35) {vettoriale};
\end{tikzpicture}
```

Le immagini vettoriali vanno bene per loghi, icone, caratteri di stampa e disegni tecnici, che sono fatti di forme. Una fotografia non si lascia descrivere con poche forme, e resta raster.
