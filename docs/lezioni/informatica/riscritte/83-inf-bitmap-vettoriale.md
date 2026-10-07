# Grafica bitmap e grafica vettoriale

Il logo del giornalino della scuola sta bene sul sito, in un angolo della pagina. Poi qualcuno decide di stamparlo su uno striscione di due metri, e la tipografia risponde che con quel file verrà tutto a quadretti: serve "il vettoriale". Il disegno è lo stesso, ma può essere scritto in un file in due modi che si comportano all'opposto quando lo si ingrandisce.

## Due modi di descrivere un'immagine

Un'immagine **bitmap** (o raster) è una griglia di pixel, ciascuno con il suo colore: è il modo che conosci dalla lezione [La codifica delle immagini](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori). Il file dice di che colore è ogni quadretto, e non sa niente di che cosa i quadretti rappresentano.

Un'immagine **vettoriale** è un elenco di forme: il file dice che cosa disegnare, dove e con quale colore. Il disegno della figura più sotto, un sole dietro due montagne, in vettoriale è fatto di tre istruzioni:

- un cerchio arancione con centro in $(64, 32)$ e raggio $18$;
- un triangolo blu scuro con i vertici in $(6, 86)$, $(38, 26)$ e $(70, 86)$;
- un triangolo azzurro con i vertici in $(42, 86)$, $(66, 50)$ e $(90, 86)$.

Lo stesso disegno come bitmap di $96 \times 96$ pixel è un elenco di $96 \cdot 96 = 9216$ colori. A $24$ bit per pixel sono $9216 \cdot 3 = 27\,648$ byte, mentre le tre istruzioni, scritte come testo, stanno in meno di $300$ byte.

## Che cosa succede ingrandendo

A sinistra c'è la bitmap, a destra il disegno vettoriale. Alla dimensione di partenza sembrano la stessa immagine: che cosa cambia quando le ingrandisci? Porta il cursore a $8$, poi fino in fondo, e guarda il bordo del sole nelle due versioni.

```interattivo
% nome: inf-bitmap-vettoriale-zoom
% alt: Lo stesso disegno, un sole arancione dietro due montagne blu, due volte: a sinistra come bitmap di 96 per 96 pixel, a destra come disegno vettoriale di tre forme. Un cursore ingrandisce le due immagini nello stesso punto, da 1 a 24 volte: nella bitmap i pixel diventano quadretti sempre più grandi e il bordo del sole una scaletta, nel disegno vettoriale il bordo resta una curva liscia. Sotto, il numero dei pixel, 9216, il peso della bitmap, 27,6 kB, e quello del file vettoriale, meno di 300 byte
```

Nella bitmap i pixel sono $9216$ a qualunque ingrandimento. Ingrandire vuol dire solo far occupare a ogni pixel più spazio sullo schermo, finché i quadretti si vedono a occhio nudo e il bordo del sole diventa una scaletta: si dice che l'immagine è sgranata. Nel disegno vettoriale non c'è niente da stirare. A ogni ingrandimento il calcolatore rilegge le tre istruzioni e ricalcola quali pixel dello schermo accendere, un'operazione che si chiama **rasterizzazione**. Il bordo del sole è sempre il bordo di un cerchio, calcolato con tutta la precisione che lo schermo permette.

Lo striscione di due metri è un ingrandimento enorme: con la bitmap del sito ogni pixel diventerebbe un quadrato grande come un'unghia, con il file vettoriale il logo esce netto come sul sito.

```ad-warning
Ingrandire una bitmap non aggiunge dettagli
Molti programmi, quando ingrandiscono una bitmap, non mostrano i quadretti: inventano i pixel che mancano facendo la media di quelli vicini. Il risultato è sfocato invece che a scaletta, ma i dettagli che non c'erano non compaiono. L'ingrandimento che rivela una targa illeggibile esiste solo nei film.
```

## Quando si usa l'una e quando l'altra

| | Bitmap | Vettoriale |
|---|---|---|
| Il file contiene | i colori dei pixel | le forme, con posizioni e colori |
| Ingrandendo | si sgrana | resta netta |
| Il peso dipende da | quanti pixel ha | quante forme ha |
| Va bene per | fotografie, schermate, dipinti | loghi, icone, grafici, mappe, caratteri |
| Formati | JPEG, PNG, GIF, WebP | SVG |

Una fotografia resta bitmap, perché non è fatta di forme: per descrivere a parole ogni foglia di un albero servirebbero più istruzioni che pixel. Un logo, al contrario, nasce come insieme di poche forme, e salvarlo come bitmap vuol dire fissarne per sempre la dimensione.

Passare da vettoriale a bitmap è facile, ed è quello che succede ogni volta che un disegno arriva sullo schermo: i programmi di grafica lo chiamano "esportare", e chiedono quanti pixel deve avere il risultato. Il passaggio inverso è difficile: un programma deve indovinare quali forme hanno prodotto quei pixel, e ci riesce in modo accettabile solo con disegni semplici, a colori piatti. I formati delle due famiglie sono confrontati nella lezione [I formati dei file multimediali](/materiale/scuola-superiore/informatica/immagini-suoni-e-video-digitali/i-formati-dei-file-multimediali).

## SVG, un disegno che si legge

Il formato vettoriale più diffuso è **SVG** (Scalable Vector Graphics, grafica vettoriale che si può ingrandire). Un file SVG è un file di testo: le forme sono scritte con i tag, come i dati della lezione [Dati strutturati: XML e JSON](/materiale/scuola-superiore/informatica/i-file/dati-strutturati-xml-e-json), e si possono leggere e cambiare con un editor qualunque.

Qui sotto c'è il sole con le montagne, dentro una pagina web che contiene solo il disegno. Il linguaggio delle pagine arriva tra qualche lezione: per ora leggi le righe una alla volta.

```codice html
<svg viewBox="0 0 96 96" width="200">
    <rect width="96" height="96" fill="#e6f0fa"/>
    <circle cx="64" cy="32" r="18" fill="#f5a524"/>
    <polygon points="6,86 38,26 70,86" fill="#1f3b5c"/>
    <polygon points="42,86 66,50 90,86" fill="#4a7fb5"/>
</svg>
```

- `viewBox="0 0 96 96"` dice che il disegno usa una griglia sua, larga $96$ e alta $96$: tutte le coordinate si misurano lì dentro. `width="200"` dice quanto deve essere largo sullo schermo.
- `rect` è un rettangolo: qui fa da sfondo.
- `circle` è un cerchio, con il centro in (`cx`, `cy`) e il raggio `r`.
- `polygon` è un poligono, e `points` elenca i suoi vertici: ogni coppia è un punto, prima la x e poi la y.
- `fill` è il colore di riempimento, scritto in esadecimale come nella lezione sulla codifica delle immagini, oppure con il suo nome in inglese (`white`, `red`).

Le forme vengono disegnate nell'ordine in cui sono scritte, e ognuna copre quelle di prima: per questo il sole sta dietro la montagna.

Cambia `width="200"` in `width="400"` e premi "Esegui": il disegno raddoppia, resta netto, e il file è lungo quanto prima. Poi porta `cy` da `32` a `60`, per far tramontare il sole dietro le montagne, e sposta la riga del cerchio in fondo, dopo i due poligoni, per vedere che cosa cambia.

```ad-warning
La y cresce verso il basso
In un disegno SVG, come sullo schermo, l'origine è l'angolo in alto a sinistra: la x cresce verso destra e la y verso il basso, al contrario del piano cartesiano. Con `cy="10"` un cerchio sta in alto, con `cy="90"` sta in basso.
```

## Pixel, schermo e stampa

Una bitmap ha una larghezza e un'altezza in pixel, e nessuna misura in centimetri. Quanto è grande davvero dipende da dove finisce.

Su uno schermo ogni pixel dell'immagine occupa di solito un pixel dello schermo. Un'immagine larga $1920$ pixel riempie in larghezza uno schermo da $1920 \times 1080$, e la stessa immagine su uno schermo che di pixel ne ha il doppio in larghezza ne occupa metà. Per lo schermo contano i pixel, e nient'altro.

Sulla carta bisogna decidere quanti pixel stampare in ogni pollice: è la **densità di stampa**, misurata in punti per pollice (dpi, dots per inch). Un pollice è $2{,}54\,\text{cm}$. Per un foglio che si guarda da vicino si usano circa $300\,\text{dpi}$, così i pixel non si distinguono a occhio; per un manifesto visto da lontano ne bastano molti meno.

$$\text{pixel} = \text{pollici} \cdot \text{dpi}$$

```ad-example
Esempio 1: quanto viene grande una stampa
Una foto di $2400 \times 1800$ pixel viene stampata a $300\,\text{dpi}$. Quanto misura sulla carta?

Si dividono i pixel per la densità: $2400 : 300 = 8$ pollici di larghezza e $1800 : 300 = 6$ pollici di altezza. In centimetri: $8 \cdot 2{,}54 = 20{,}32\,\text{cm}$ e $6 \cdot 2{,}54 = 15{,}24\,\text{cm}$, circa $20 \times 15\,\text{cm}$.
```

```ad-example
Esempio 2: quanti pixel servono
Sul giornalino una foto deve essere larga $4$ pollici (circa $10\,\text{cm}$), stampata a $300\,\text{dpi}$. Quanti pixel deve avere in larghezza? E che cosa succede usando un'immagine larga $400$ pixel presa da un sito?

Servono $4 \cdot 300 = 1200$ pixel. Con $400$ pixel su $4$ pollici la densità scende a $400 : 4 = 100\,\text{dpi}$: ogni pixel è largo un quarto di millimetro, e la foto esce sgranata.
```

```ad-warning
Cambiare il numero dei dpi non cambia l'immagine
In molti programmi si può scrivere "300 dpi" nelle proprietà di un'immagine senza toccare i pixel. È solo un'etichetta che dice quanto grande stamparla: un'immagine di $400$ pixel segnata a $300\,\text{dpi}$ verrà larga poco più di un pollice, non più nitida. I dettagli stanno nei pixel.
```

Per un disegno vettoriale tutto questo non serve: non ha pixel finché non lo si stampa o non lo si mostra, e a quel punto viene calcolato alla densità richiesta.

## Le operazioni di base e che cosa fanno ai dati

Ritagliare, ridimensionare e cambiare formato sono le tre operazioni che si fanno più spesso su una bitmap, e trattano i pixel in modo molto diverso.

| Operazione | Che cosa succede ai pixel | Si torna indietro? |
|---|---|---|
| ritagliare | quelli fuori dal ritaglio vengono eliminati, gli altri restano identici | no: i pixel tolti non ci sono più |
| rimpicciolire | ogni pixel nuovo è la media di più pixel vecchi | no: i dettagli si sono fusi |
| ingrandire | i pixel in più vengono inventati a partire dai vicini | sì, ma non si è guadagnato niente |
| cambiare formato, senza perdita | restano gli stessi, scritti in un altro modo | sì |
| cambiare formato, con perdita | cambiano un po', dove l'occhio nota meno | no |

Che cosa si perde, di preciso, togliendo pixel? Nella figura metti "Bit per pixel" su $8$, poi passa da $64$ a $16$ pixel per lato.

```interattivo
% nome: inf-pixel-risoluzione-profondita
% alt: Un sole sopra due colline disegnato su una griglia di pixel in toni di grigio. Due scelte, i pixel per lato, 8, 16, 32 o 64, e i bit per pixel, 1, 2, 4 o 8, cambiano l'immagine; sotto ci sono il numero dei pixel, le tonalità di grigio e il peso senza compressione
```

A $64$ pixel per lato il sole è un disco e l'immagine pesa $4096$ byte; a $16$ è una macchia di una ventina di quadretti e ne pesa $256$, sedici volte meno. La figura sa tornare a $64$ perché ha ancora il disegno di partenza. Un programma di ritocco, una volta salvata l'immagine rimpicciolita, ha solo quei $256$ pixel: ingrandendola otterrebbe la macchia, più grande.

Da qui la regola di chi lavora con le immagini: l'originale non si tocca. Si ritaglia e si ridimensiona una copia, e si rimpicciolisce una volta sola, alla fine, alla misura che serve.

## Prova tu

Nel disegno qui sotto il sole è troppo grande e troppo in alto. Portane il raggio a `12` e il centro all'altezza `40`, senza toccare le montagne.

```codice html
<svg viewBox="0 0 96 96" width="200">
    <rect width="96" height="96" fill="#e6f0fa"/>
    <circle cx="64" cy="20" r="26" fill="#f5a524"/>
    <polygon points="6,86 38,26 70,86" fill="#1f3b5c"/>
    <polygon points="42,86 66,50 90,86" fill="#4a7fb5"/>
</svg>
%% soluzione
<svg viewBox="0 0 96 96" width="200">
    <rect width="96" height="96" fill="#e6f0fa"/>
    <circle cx="64" cy="40" r="12" fill="#f5a524"/>
    <polygon points="6,86 38,26 70,86" fill="#1f3b5c"/>
    <polygon points="42,86 66,50 90,86" fill="#4a7fb5"/>
</svg>
%% controllo Il sole ha raggio 12
circle | attributo r = 12
%% controllo Il centro del sole è all'altezza 40
circle | attributo cy = 40
%% controllo Le montagne sono ancora due
polygon | quanti = 2
```

Ora una bandiera a tre bande verticali, verde, bianca e rossa, in un disegno largo $90$ e alto $60$. La banda verde c'è già: aggiungi le altre due, ciascuna larga $30$ e alta $60$, con i colori `white` e `red`. L'attributo `x` di un rettangolo è la distanza del suo lato sinistro dal bordo sinistro del disegno.

```codice html
<svg viewBox="0 0 90 60" width="270">
    <rect x="0" width="30" height="60" fill="green"/>
</svg>
%% soluzione
<svg viewBox="0 0 90 60" width="270">
    <rect x="0" width="30" height="60" fill="green"/>
    <rect x="30" width="30" height="60" fill="white"/>
    <rect x="60" width="30" height="60" fill="red"/>
</svg>
%% controllo I rettangoli sono tre
rect | quanti = 3
%% controllo La banda bianca comincia a x = 30
rect[fill="white"] | attributo x = 30
%% controllo La banda rossa comincia a x = 60
rect[fill="red"] | attributo x = 60
%% controllo Ogni banda è larga 30
rect[width="30"] | quanti = 3
```

L'ultimo esercizio è il conto della stampa. Il programma legge la larghezza e l'altezza di una stampa in pollici, poi la densità in dpi, tutti numeri interi. Deve scrivere su tre righe i pixel che servono in larghezza, quelli che servono in altezza e i pixel in tutto.

```codice python
larghezza = int(input())
altezza = int(input())
dpi = int(input())

# scrivi qui
%% soluzione
larghezza = int(input())
altezza = int(input())
dpi = int(input())

pixel_larghezza = larghezza * dpi
pixel_altezza = altezza * dpi
print(pixel_larghezza)
print(pixel_altezza)
print(pixel_larghezza * pixel_altezza)
%% prova
8
6
300
%% stampa
2400
1800
4320000
%% prova
4
3
150
%% stampa
600
450
270000
%% prova
1
1
72
%% stampa
72
72
5184
```

```codice cpp
#include <iostream>
using namespace std;

int main() {
    int larghezza, altezza, dpi;
    cin >> larghezza >> altezza >> dpi;

    // scrivi qui
    return 0;
}
%% soluzione
#include <iostream>
using namespace std;

int main() {
    int larghezza, altezza, dpi;
    cin >> larghezza >> altezza >> dpi;

    int pixel_larghezza = larghezza * dpi;
    int pixel_altezza = altezza * dpi;
    cout << pixel_larghezza << endl;
    cout << pixel_altezza << endl;
    cout << pixel_larghezza * pixel_altezza << endl;
    return 0;
}
```
