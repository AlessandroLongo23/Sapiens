# La codifica dei caratteri: ASCII e Unicode

Quando scrivi "Ciao" in una chat, il telefono non memorizza delle lettere: memorizza dei numeri, e chi riceve il messaggio li ritrasforma in lettere. Perché funzioni, i due telefoni devono usare la stessa tabella, che dice quale numero corrisponde a ogni carattere. Una tabella così si chiama **codice dei caratteri**, e un **carattere** è ogni segno che si può scrivere: lettere, cifre, punteggiatura, lo spazio, i simboli.

## Il codice ASCII

Il codice **ASCII** (American Standard Code for Information Interchange), pubblicato negli Stati Uniti nel 1963, usa 7 bit per carattere. Con 7 bit le combinazioni sono $2^7 = 128$, numerate da $0$ a $127$: tante quante bastavano per scrivere in inglese.

| Codici | Caratteri |
|---|---|
| da $0$ a $31$, e $127$ | caratteri di controllo, che non si vedono (a capo, tabulazione) |
| $32$ | lo spazio |
| da $48$ a $57$ | le cifre da 0 a 9 |
| da $65$ a $90$ | le lettere maiuscole da A a Z |
| da $97$ a $122$ | le lettere minuscole da a a z |
| gli altri | punteggiatura e simboli, come ! ? + @ |

Le cifre e le lettere hanno codici consecutivi, nel loro ordine. Non serve quindi imparare la tabella a memoria: bastano tre punti di partenza, cioè $48$ per la cifra 0, $65$ per la A maiuscola e $97$ per la a minuscola. Gli altri codici si trovano contando.

```ad-example
Esempio 1: il codice di una lettera
Qual è il codice ASCII della E maiuscola, in base dieci e in binario?

La E è la quinta lettera dell'alfabeto, quattro posti dopo la A: il suo codice è $65 + 4 = 69$.

In binario su 7 bit, $69 = 64 + 4 + 1 = 100\,0101_2$.
```

```ad-example
Esempio 2: una parola
Con quali codici si scrive la parola "Ciao"?

La C maiuscola è due posti dopo la A: $65 + 2 = 67$. Le altre lettere sono minuscole: la i è otto posti dopo la a, $97 + 8 = 105$; la a è $97$; la o è quattordici posti dopo la a, $97 + 14 = 111$.

La parola è la sequenza $67$, $105$, $97$, $111$.
```

```ad-warning
La cifra 7 non ha codice 7
Il carattere 7, quello che scrivi in un messaggio, ha codice $48 + 7 = 55$. Il codice $7$ è un carattere di controllo. Un carattere che rappresenta una cifra e il numero che quella cifra indica sono due cose diverse: su "12" scritto come testo non si fanno conti, finché un programma non lo trasforma nel numero dodici.
```

```ad-warning
Lo spazio è un carattere
Lo spazio tra due parole ha il suo codice, $32$, e occupa posto in memoria come ogni lettera. Lo stesso vale per i punti, le virgole e gli a capo.
```

### Maiuscole e minuscole

La a minuscola ha codice $97$ e la A maiuscola $65$: la differenza è $32$, ed è la stessa per tutte le lettere. Il codice di una minuscola è quello della maiuscola aumentato di $32$.

Non è un caso: $32 = 2^5$, quindi una lettera maiuscola e la sua minuscola differiscono per un solo bit, quello di peso $32$.

```tikz
% nome: ascii-maiuscola-minuscola
% alt: I sette bit dei codici ASCII della A maiuscola, 100 0001 cioè 65, e della a minuscola, 110 0001 cioè 97, su due righe; sopra le caselle i pesi 64, 32, 16, 8, 4, 2, 1; la casella di peso 32, evidenziata, vale 0 nella maiuscola e 1 nella minuscola, mentre tutte le altre sono uguali
% svg: ascii-maiuscola-minuscola-100583e7.svg 277x93
\begin{tikzpicture}
\foreach \w [count=\i from 0] in {64, 32, 16, 8, 4, 2, 1} {
  \node[font=\small] at (\i*0.8+0.4,2.15) {$\w$};
}
\foreach \b [count=\i from 0] in {1, 0, 0, 0, 0, 0, 1} {
  \ifnum\i=1
    \draw[thick, fill=orange!30] (\i*0.8,1.0) rectangle ++(0.8,0.8);
  \else
    \draw[thick, fill=blue!10] (\i*0.8,1.0) rectangle ++(0.8,0.8);
  \fi
  \node at (\i*0.8+0.4,1.4) {\b};
}
\foreach \b [count=\i from 0] in {1, 1, 0, 0, 0, 0, 1} {
  \ifnum\i=1
    \draw[thick, fill=orange!30] (\i*0.8,0) rectangle ++(0.8,0.8);
  \else
    \draw[thick, fill=blue!10] (\i*0.8,0) rectangle ++(0.8,0.8);
  \fi
  \node at (\i*0.8+0.4,0.4) {\b};
}
\node[font=\small, left] at (-0.1,2.15) {peso};
\node[left] at (-0.1,1.4) {A};
\node[left] at (-0.1,0.4) {a};
\node[font=\small, right] at (5.7,1.4) {$65$};
\node[font=\small, right] at (5.7,0.4) {$97$};
\end{tikzpicture}
```

```ad-example
Esempio 3: dalla maiuscola alla minuscola
La G maiuscola ha codice $71$. Qual è il codice della g minuscola? E della k minuscola?

Per la g: $71 + 32 = 103$.

La k è quattro posti dopo la g (g, h, i, j, k): $103 + 4 = 107$.
```

Dato che i codici seguono l'ordine alfabetico, un calcolatore mette in ordine le parole confrontando i numeri. C'è però una conseguenza: tutte le maiuscole ($65$-$90$) vengono prima di tutte le minuscole ($97$-$122$), e un ordinamento fatto solo sui codici mette "Zebra" prima di "ape".

## Le estensioni a 8 bit

Un byte ha 8 bit, e l'ASCII ne usa 7: nel byte il bit più significativo (MSB) resta a $0$. Con l'ottavo bit i codici diventano $2^8 = 256$, e i $128$ in più, da $128$ a $255$, sono stati usati per le lettere che all'inglese non servono: le accentate dell'italiano e del francese, la ß del tedesco, la ñ dello spagnolo.

Il guaio è che ogni gruppo di paesi ha riempito quei $128$ posti a modo suo. Nella tabella più usata in Europa occidentale, chiamata Latin-1, il codice $232$ è la è; in quella per il greco lo stesso codice è la lettera θ. Sono nate decine di **estensioni dell'ASCII**, uguali nei primi $128$ codici e diverse negli altri: un testo scritto con una tabella e letto con un'altra mostra i caratteri sbagliati. E $256$ codici non bastano comunque per lingue come il cinese e il giapponese, che usano migliaia di caratteri.

## Unicode

**Unicode**, pubblicato nel 1991, risolve il problema alla radice: una sola tabella per tutte le scritture del mondo. Ogni carattere ha un numero, che si chiama **punto di codice** e si scrive con U+ seguito dal numero in esadecimale (il [sistema esadecimale](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/il-sistema-esadecimale) ha la sua lezione).

| Carattere | Punto di codice | In base dieci |
|---|---|---|
| A | U+0041 | $65$ |
| è | U+00E8 | $232$ |
| € | U+20AC | $8364$ |
| la faccina che sorride | U+1F600 | $128\,512$ |

I primi $128$ punti di codice sono quelli dell'ASCII, con gli stessi numeri: la A è $65$ anche in Unicode. I punti di codice vanno da U+0000 a U+10FFFF, cioè sono $1\,114\,112$, e contengono gli alfabeti, gli ideogrammi, i simboli matematici e le emoji.

## UTF-8: i punti di codice diventano byte

Unicode dice quale numero ha ogni carattere; non dice come scrivere quel numero in memoria. Un byte non basta, perché arriva solo a $255$. Usare sempre 4 byte funzionerebbe, ma un testo in italiano o in inglese occuperebbe il quadruplo dello spazio.

**UTF-8** è la codifica più diffusa, quella della quasi totalità delle pagine web: è a lunghezza variabile, cioè usa da 1 a 4 byte secondo il punto di codice.

| Punti di codice | Byte | Che cosa contiene |
|---|---|---|
| da U+0000 a U+007F | 1 | i caratteri ASCII |
| da U+0080 a U+07FF | 2 | lettere accentate, greco, cirillico, arabo, ebraico |
| da U+0800 a U+FFFF | 3 | il simbolo €, quasi tutti i caratteri cinesi e giapponesi |
| da U+10000 a U+10FFFF | 4 | le emoji, scritture antiche |

Un carattere ASCII in UTF-8 occupa un solo byte, lo stesso che occuperebbe in ASCII: un testo senza accenti è identico nelle due codifiche.

```tikz
% nome: utf8-byte-di-piu
% alt: La parola più codificata in UTF-8: la lettera p occupa un byte, che in esadecimale è 70; la lettera i occupa un byte, 69; la lettera ù occupa due byte, evidenziati, C3 e B9; in tutto tre caratteri e quattro byte
% svg: utf8-byte-di-piu-6147cf86.svg 171x77
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) rectangle (1.1,0.8);
\draw[thick, fill=blue!10] (1.1,0) rectangle (2.2,0.8);
\draw[thick, fill=orange!30] (2.2,0) rectangle (3.3,0.8);
\draw[thick, fill=orange!30] (3.3,0) rectangle (4.4,0.8);
\node at (0.55,0.4) {70};
\node at (1.65,0.4) {69};
\node at (2.75,0.4) {C3};
\node at (3.85,0.4) {B9};
\node at (0.55,1.15) {p};
\node at (1.65,1.15) {i};
\node at (3.3,1.15) {\`u};
\node[font=\small] at (0.55,-0.3) {1 byte};
\node[font=\small] at (1.65,-0.3) {1 byte};
\node[font=\small] at (3.3,-0.3) {2 byte};
\end{tikzpicture}
```

```ad-warning
In UTF-8 un carattere non è sempre un byte
La parola "più" ha 3 caratteri ma occupa 4 byte. Se un programma legge quei byte credendo che siano Latin-1, un byte per carattere, mostra due caratteri al posto di uno: "perché" diventa "perchÃ©". Quando in una pagina vedi lettere accentate trasformate in coppie di simboli strani, è successo questo.
```

## Quanti byte occupa un testo

Per sapere quanto spazio occupa un testo:

1. Conta i caratteri, compresi gli spazi, la punteggiatura e gli a capo.
2. Se il testo è in ASCII o in un'estensione a 8 bit, ogni carattere occupa 1 byte: i byte sono quanti i caratteri.
3. Se il testo è in UTF-8, conta 1 byte per i caratteri ASCII, 2 per ogni lettera accentata, 3 per il simbolo €, 4 per ogni emoji.

Per i multipli del byte vale la lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura): qui $1\,\text{kB} = 1000\,\text{B}$.

```ad-example
Esempio 4: un messaggio in ASCII
Quanti byte occupa il messaggio "Ciao mondo" salvato in ASCII?

Le lettere sono $4 + 5 = 9$, più uno spazio: $10$ caratteri, quindi $10$ byte.
```

```ad-example
Esempio 5: un documento
Un racconto di $30$ pagine ha $40$ righe per pagina e $60$ caratteri per riga, spazi compresi. È salvato con un byte per carattere. Quanti kB occupa?

I caratteri sono $30 \cdot 40 \cdot 60 = 72\,000$, quindi il file occupa $72\,000\,\text{B}$.

Con $1\,\text{kB} = 1000\,\text{B}$: $72\,000 : 1000 = 72\,\text{kB}$.
```

```ad-example
Esempio 6: un messaggio con gli accenti in UTF-8
Quanti byte occupa in UTF-8 il messaggio "Perché è così?"

I caratteri sono $14$: $6 + 1 + 4 = 11$ lettere, $2$ spazi e il punto interrogativo. Tre lettere sono accentate (é, è, ì) e occupano 2 byte ciascuna, cioè un byte in più.

I byte sono $14 + 3 = 17$.
```

In un file di solo testo non c'è altro: niente grassetti, niente colori, niente margini. Un documento scritto con un programma di videoscrittura occupa di più, perché oltre ai caratteri contiene le informazioni sull'aspetto.
