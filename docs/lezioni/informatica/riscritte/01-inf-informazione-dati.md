# Informazione, dati e codici

Quando mandi un messaggio, scatti una foto o apri il registro elettronico, un computer sta trattando informazioni: le riceve, le conserva, le trasforma e le restituisce. L'informatica è la scienza che studia come si rappresenta e come si elabora l'informazione in modo automatico, e il suo nome dice proprio questo: viene dal francese informatique, che unisce le parole informazione e automatica. Prima di parlare di computer conviene quindi capire che cosa sono un dato, un'informazione e un codice.

## Dati e informazioni

Su un foglio c'è scritto soltanto «38,5». Potrebbe essere una temperatura, un prezzo, un numero di scarpe con mezza misura in più: da solo non dice niente. Un **dato** è proprio questo: un valore o un simbolo preso da solo, senza che si sappia a che cosa si riferisce.

Se accanto al numero leggi «temperatura di Luca alle 8 di stamattina, in gradi Celsius», adesso sai una cosa nuova: Luca ha la febbre. Un'**informazione** è un dato a cui è stato dato un significato, perché si sa a che cosa si riferisce e come va letto. La stessa cosa succede sul registro elettronico: «7» è un dato, «Marta ha preso 7 nella verifica di matematica del 3 ottobre» è un'informazione.

Dai dati si ricavano altre informazioni con un'**elaborazione**, cioè con una serie di operazioni: il registro prende i voti di Marta, che sono i dati in ingresso, calcola la media e la mostra, e la media è un'informazione che prima non c'era scritta da nessuna parte.

```tikz
% nome: dati-elaborazione-informazioni
% alt: Schema a tre blocchi collegati da frecce: i dati in ingresso, i voti 7, 6 e 8, entrano nel blocco elaborazione, che calcola la media, e ne esce l'informazione: la media è 7
% svg: dati-elaborazione-informazioni-acfcaead.svg 306x45
\begin{tikzpicture}
\tikzset{blocco/.style={draw, thick, rounded corners=3pt, minimum height=1.1cm, align=center, font=\small}}
\node[blocco, fill=blue!10, minimum width=1.7cm] (d) at (0,0) {dati\\7, 6, 8};
\node[blocco, fill=orange!25, minimum width=2.3cm] (e) at (2.8,0) {elaborazione\\calcolo della media};
\node[blocco, fill=blue!10, minimum width=2cm] (i) at (6.1,0) {informazione\\media: 7};
\draw[-{Stealth}, thick] (d) -- (e);
\draw[-{Stealth}, thick] (e) -- (i);
\end{tikzpicture}
```

```ad-example
Esempio 1: lo stesso dato, tre informazioni
Il dato «12» diventa un'informazione diversa a seconda di quello che gli sta intorno: «il treno parte dal binario 12», «mancano 12 giorni alle vacanze», «la batteria del telefono è al 12%». Il simbolo è lo stesso; cambia ciò a cui si riferisce, e quindi cambia quello che vieni a sapere.
```

```ad-warning
Un dato non è per forza un numero
Sono dati anche una parola («MI»), una data («03/10»), un colore, un suono. «MI» da solo può essere una nota musicale o la sigla di Milano: diventa un'informazione solo quando sai di che cosa si sta parlando.
```

## Che cos'è un codice

Per conservare o trasmettere un'informazione bisogna scriverla con dei simboli, e chi la riceve deve sapere come leggerli. Un **codice** è una regola che associa a ogni significato una sequenza di simboli presi da un insieme fissato, che si chiama alfabeto del codice. Ogni sequenza usata dal codice è una parola del codice.

Il semaforo è un codice con un alfabeto di tre simboli (rosso, giallo, verde), ognuno con il suo significato. Il codice Morse ha un alfabeto di due segnali, il punto e la linea, e a ogni lettera associa una sequenza: alla S tre punti, alla O tre linee. Sono codici anche la targa di un'auto, il codice fiscale e il codice a barre sui prodotti del supermercato.

Usare un codice vuol dire fare due operazioni, una l'inversa dell'altra:

- la **codifica** passa dal significato alla sequenza di simboli (chi trasmette SOS in Morse scrive tre punti, tre linee, tre punti);
- la **decodifica** passa dalla sequenza di simboli al significato (chi vede il rosso al semaforo capisce che deve fermarsi).

Un codice funziona solo se chi codifica e chi decodifica usano la stessa regola, e se a significati diversi corrispondono parole diverse: se due lettere avessero la stessa sequenza, chi riceve non saprebbe quale delle due leggere.

```ad-example
Esempio 2: codificare e decodificare con una tabella
Un codice associa a quattro lettere una sequenza di due simboli, scelti tra 0 e 1:

| lettera | A | C | O | S |
|---|---|---|---|---|
| parola del codice | 00 | 01 | 10 | 11 |

Per codificare la parola CASA si sostituisce ogni lettera con la sua sequenza: C diventa 01, A diventa 00, S diventa 11, A diventa 00. Il risultato è 01001100.

Per decodificare 01101100 si fa il contrario. Tutte le parole del codice sono lunghe due simboli, quindi si divide la sequenza in gruppi di due a partire da sinistra, 01 10 11 00, e si legge la tabella al contrario: C, O, S, A. La parola è COSA.
```

```ad-warning
Decodificare senza dividere in gruppi
In 01101100 non si cercano le parole del codice dove capita: i gruppi cominciano sempre da sinistra e hanno tutti la stessa lunghezza. Chi legge "11" a cavallo tra il primo e il secondo gruppo trova una S che non c'è.
```

## Il codice binario e il bit

Il codice dell'esempio 2 usa un alfabeto di due soli simboli, 0 e 1: è un **codice binario**. Ogni simbolo di un codice binario si chiama **bit** (dall'inglese binary digit, cifra binaria): un bit vale 0 oppure 1.

I computer usano codici binari per una ragione pratica. Dentro un circuito è facile costruire un componente che ha due stati ben distinti (passa corrente oppure no, la tensione è alta oppure bassa) ed è facile riconoscerli senza sbagliare anche quando il segnale è disturbato. Con dieci stati diversi, uno per ogni cifra da 0 a 9, basterebbe un piccolo disturbo per scambiare uno stato con quello vicino.

Due simboli sembrano pochi, ma mettendoli in fila le sequenze possibili crescono in fretta. Con 1 bit le sequenze sono due, 0 e 1. Ogni bit aggiunto le raddoppia, perché ogni sequenza di prima può continuare con 0 oppure con 1: con 2 bit sono quattro (00, 01, 10, 11), con 3 bit sono otto.

```tikz
% nome: sequenze-di-tre-bit
% alt: Albero che parte da un punto e si divide in due rami a ogni bit, uno per lo 0 e uno per l'1: dopo il primo bit ci sono 2 sequenze, dopo il secondo 4, dopo il terzo le 8 sequenze 000, 001, 010, 011, 100, 101, 110, 111
% svg: sequenze-di-tre-bit-23100158.svg 296x122
\begin{tikzpicture}
\tikzset{p/.style={circle, fill=black, inner sep=1.3pt}, e/.style={font=\scriptsize, inner sep=1.5pt}}
\node[p] (r) at (0,0) {};
\foreach \x/\n in {-1.6/a, 1.6/b} \node[p] (\n) at (\x,-0.9) {};
\foreach \x/\n in {-2.4/aa, -0.8/ab, 0.8/ba, 2.4/bb} \node[p] (\n) at (\x,-1.8) {};
\foreach \x/\n/\s in {-2.8/aaa/000, -2.0/aab/001, -1.2/aba/010, -0.4/abb/011, 0.4/baa/100, 1.2/bab/101, 2.0/bba/110, 2.8/bbb/111} \node[font=\small, inner sep=2pt] (\n) at (\x,-2.85) {\s};
\draw[thick] (r) -- node[e, above left] {0} (a);
\draw[thick] (r) -- node[e, above right] {1} (b);
\draw[thick] (a) -- node[e, left] {0} (aa);
\draw[thick] (a) -- node[e, right] {1} (ab);
\draw[thick] (b) -- node[e, left] {0} (ba);
\draw[thick] (b) -- node[e, right] {1} (bb);
\foreach \f/\z/\u in {aa/aaa/aab, ab/aba/abb, ba/baa/bab, bb/bba/bbb} {
  \draw[thick] (\f) -- (\z.north);
  \draw[thick] (\f) -- (\u.north);
}
\node[font=\small, anchor=west] at (3.3,-0.9) {1 bit: 2};
\node[font=\small, anchor=west] at (3.3,-1.8) {2 bit: 4};
\node[font=\small, anchor=west] at (3.3,-2.85) {3 bit: 8};
\end{tikzpicture}
```

In generale, con $n$ bit si scrivono

$$2^n$$

sequenze diverse, e quindi si possono rappresentare $2^n$ cose diverse: con 4 bit $2^4 = 16$, con 8 bit $2^8 = 256$, con 10 bit $2^{10} = 1024$. Le potenze sono spiegate nella lezione [Potenze in $\mathbb{N}$](/materiale/scuola-superiore/matematica/numeri-naturali/potenze-in-n) di matematica.

```ad-warning
Con n bit le sequenze sono 2 alla n, non 2 per n
Con 5 bit le sequenze sono $2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32$, non $2 \cdot 5 = 10$. A ogni bit in più il numero raddoppia, non aumenta di due.
```

## Quanti bit servono

Il problema si presenta più spesso al contrario: hai un certo numero di cose da distinguere e vuoi sapere quanti bit deve avere ogni parola del codice. Servono abbastanza sequenze da darne una diversa a ogni cosa, senza sprecare bit.

1. Conta le cose da rappresentare: sia $N$ il loro numero.
2. Scorri le potenze di due, $2, 4, 8, 16, 32, \dots$, finché ne trovi una maggiore o uguale a $N$.
3. L'esponente di quella potenza è il numero di bit: il più piccolo $n$ per cui $2^n \ge N$.

```ad-example
Esempio 3: i quattro semi delle carte
I semi sono $N = 4$: cuori, quadri, fiori, picche. La prima potenza di due che arriva a 4 è $2^2 = 4$: bastano 2 bit, e le quattro sequenze si usano tutte.

| seme | cuori | quadri | fiori | picche |
|---|---|---|---|---|
| codice | 00 | 01 | 10 | 11 |
```

```ad-example
Esempio 4: i giorni della settimana
I giorni sono $N = 7$. Con 2 bit le sequenze sono $2^2 = 4$, troppo poche; con 3 bit sono $2^3 = 8 \ge 7$. Servono 3 bit. Le sequenze sono otto e i giorni sette: una sequenza resta senza significato, e non è un problema.
```

```ad-example
Esempio 5: le lettere dell'alfabeto inglese
Le lettere sono $N = 26$. Le potenze di due sono $2, 4, 8, 16, 32$: $2^4 = 16$ non basta, $2^5 = 32 \ge 26$ sì. Servono 5 bit, e $32 - 26 = 6$ sequenze restano libere.
```

```ad-example
Esempio 6: sessantaquattro livelli, e poi uno in più
Un videogioco ha $N = 64$ livelli. Poiché $2^6 = 64$, bastano 6 bit esatti: quando $N$ è una potenza di due, l'esponente è la risposta e non serve un bit in più. Se il gioco aggiunge un solo livello e arriva a $65$, i 6 bit non bastano più: serve la potenza successiva, $2^7 = 128$, cioè 7 bit.
```

```ad-warning
Non serve un bit per ogni cosa
Per distinguere 8 cose non servono 8 bit: ne bastano 3, perché $2^3 = 8$. Un bit per ogni cosa è uno spreco che cresce in fretta: per 256 cose servono 8 bit, non 256.
```

## Analogico e digitale

Un termometro a mercurio e un termometro con il display misurano la stessa temperatura, ma la rappresentano in due modi diversi.

Nel primo la colonnina si allunga con continuità quando la temperatura sale: tra 36,5 e 36,6 può fermarsi in qualunque punto. Una rappresentazione è **analogica** quando varia con continuità, imitando la grandezza che rappresenta, e può assumere tutti i valori di un intervallo. Sono analogici l'orologio a lancette, il solco di un disco in vinile, la lancetta del tachimetro.

Sul display invece leggi 36,5 oppure 36,6, e niente in mezzo. Una rappresentazione è **digitale** quando usa un numero finito di valori distinti, ciascuno scritto con delle cifre (in inglese digit vuol dire cifra). Sono digitali l'orologio che mostra le ore con i numeri, il contapassi del telefono, un file musicale.

```tikz
% nome: segnale-analogico-e-digitale
% alt: Due grafici affiancati con la stessa grandezza che cambia nel tempo. A sinistra, analogico: una curva continua. A destra, digitale: gli stessi istanti con soli quattro livelli possibili, e la grandezza è una fila di punti che stanno sui livelli
% svg: segnale-analogico-e-digitale-d15319dd.svg 328x130
\begin{tikzpicture}
\draw[-{Stealth}] (0,0) -- (3.5,0) node[below, font=\scriptsize] {tempo};
\draw[-{Stealth}] (0,0) -- (0,2.4);
\draw[very thick, blue!70!black] plot[smooth] coordinates {(0.2,0.6) (0.7,1.25) (1.2,1.85) (1.7,1.6) (2.2,0.95) (2.7,0.7) (3.2,1.3)};
\node[font=\small] at (1.75,-0.7) {analogico};
\begin{scope}[xshift=4.5cm]
\draw[-{Stealth}] (0,0) -- (3.5,0) node[below, font=\scriptsize] {tempo};
\draw[-{Stealth}] (0,0) -- (0,2.4);
\foreach \y in {0.5,1.0,1.5,2.0} \draw[gray, thin, dashed] (0,\y) -- (3.3,\y);
\foreach \x/\y in {0.2/0.5, 0.7/1.5, 1.2/2.0, 1.7/1.5, 2.2/1.0, 2.7/0.5, 3.2/1.5} {
  \draw[thick, blue!70!black] (\x,0) -- (\x,\y);
  \fill[blue!70!black] (\x,\y) circle (2pt);
}
\node[font=\small] at (1.75,-0.7) {digitale};
\end{scope}
\end{tikzpicture}
```

Un computer lavora solo con sequenze di bit, quindi tutto quello che tratta è digitale: testi, numeri, immagini e suoni vengono trasformati in numeri, e i numeri in bit. Come si fa per ciascuno lo spiegano le lezioni del capitolo sulla codifica, a partire da [La codifica dei caratteri: ASCII e Unicode](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode), [La codifica delle immagini: pixel e colori](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-delle-immagini-pixel-e-colori) e [La codifica dei suoni](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-suoni).

Passare dall'analogico al digitale ha un costo e un vantaggio. Il costo è che i valori intermedi si perdono: se il display ha una sola cifra decimale, 36,54 e 36,46 diventano tutti e due 36,5. Il vantaggio è che una sequenza di cifre si copia e si trasmette senza rovinarsi: la millesima copia di un file è identica alla prima, mentre la copia di una copia di una musicassetta si sente ogni volta un po' peggio.

```ad-example
Esempio 7: analogico o digitale
Una bilancia con l'ago che scorre su una scala graduata è analogica: l'ago può fermarsi in qualunque punto. Una bilancia che scrive «62,4 kg» è digitale: tra 62,4 e 62,5 non mostra niente. Un interruttore della luce, che ha solo due posizioni, è digitale, anche se non ha nessun display: quello che conta è che i valori possibili sono in numero finito.
```

```ad-warning
Digitale non vuol dire elettronico, e non vuol dire più preciso
Un vecchio televisore a tubo catodico è elettronico ma tratta un segnale analogico; un pallottoliere è digitale e non ha nemmeno un filo. E un termometro digitale che mostra solo i gradi interi è meno preciso di un buon termometro a mercurio: la precisione dipende da quanti valori distinti si usano, non dal fatto che siano cifre.
```

Quanto spazio occupano i bit, e come si misura, è l'argomento della lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura); come si scrivono i numeri con le sole cifre 0 e 1 lo spiega il capitolo sui [sistemi di numerazione posizionali](/materiale/scuola-superiore/informatica/i-sistemi-di-numerazione/i-sistemi-di-numerazione-posizionali).
