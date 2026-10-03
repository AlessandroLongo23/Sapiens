# Bit, byte e unità di misura

Una foto occupa qualche megabyte, la memoria di un telefono si misura in gigabyte, la connessione di casa in megabit al secondo. Sono tutte misure di quantità di informazione, e partono tutte dalla stessa unità: il bit. Qui trovi le unità, i loro multipli, come si passa dall'una all'altra e come si calcola il tempo che serve per scaricare un file.

## Il bit e il byte

Il **bit** è la più piccola quantità di informazione: un simbolo che vale 0 oppure 1, come spiega la lezione [Informazione, dati e codici](/materiale/scuola-superiore/informatica/informatica-e-informazione/informazione-dati-e-codici). Un bit da solo distingue due cose soltanto, quindi i computer li trattano a gruppi.

Il **byte** è un gruppo di 8 bit. Il suo simbolo è B, maiuscola; il bit non ha un simbolo e si scrive per esteso.

$$1\,\text{B} = 8\,\text{bit}$$

```tikz
% nome: un-byte-otto-bit
% alt: Otto caselle in fila, ciascuna con un bit: 0, 1, 0, 0, 0, 0, 0, 1. Una casella è indicata come 1 bit, tutta la fila come 1 byte uguale a 8 bit
% svg: un-byte-otto-bit-d9d48c51.svg 219x95
\begin{tikzpicture}
\foreach \i/\b in {0/0, 1/1, 2/0, 3/0, 4/0, 5/0, 6/0, 7/1} {
  \draw[thick, fill=blue!10] (\i*0.7,0) rectangle (\i*0.7+0.7,0.7);
  \node at (\i*0.7+0.35,0.35) {\b};
}
\draw[thick] (0,-0.15) -- (0,-0.3) -- (5.6,-0.3) -- (5.6,-0.15);
\node[font=\small] at (2.8,-0.65) {1 byte = 8 bit};
\draw[thick] (4.9,0.85) -- (4.9,1.0) -- (5.6,1.0) -- (5.6,0.85);
\node[font=\small] at (5.25,1.3) {1 bit};
\end{tikzpicture}
```

Per passare dai byte ai bit si moltiplica per 8, per passare dai bit ai byte si divide per 8: $5\,\text{B}$ sono $5 \cdot 8 = 40\,\text{bit}$, e $72\,\text{bit}$ sono $72 : 8 = 9\,\text{B}$. Nei codici più semplici una lettera di un testo occupa un byte, come racconta la lezione [La codifica dei caratteri: ASCII e Unicode](/materiale/scuola-superiore/informatica/la-codifica-dell-informazione/la-codifica-dei-caratteri-ascii-e-unicode): un messaggio di 20 lettere occupa allora $20\,\text{B}$, cioè $160\,\text{bit}$.

```ad-warning
Bit e byte non sono la stessa cosa
Un byte vale otto volte un bit. Nelle sigle la B maiuscola è il byte: $100\,\text{MB}$ sono megabyte, $100\,\text{Mbit}$ sono megabit, e la prima quantità è otto volte la seconda.
```

## Quanti valori con n bit

Con $n$ bit si scrivono $2^n$ sequenze diverse, e quindi si rappresentano $2^n$ valori diversi. Se i bit sono dati in byte, prima si passa ai bit.

| Spazio | Bit | Valori diversi |
|---|---|---|
| 4 bit | 4 | $2^4 = 16$ |
| 1 byte | 8 | $2^8 = 256$ |
| 2 byte | 16 | $2^{16} = 65\,536$ |
| 3 byte | 24 | $2^{24} = 16\,777\,216$ |

Se i valori sono numeri contati a partire da 0, il più grande è $2^n - 1$, perché uno dei valori è lo zero: in un byte stanno i numeri da 0 a 255, che sono 256 in tutto.

```ad-example
Esempio 1: il livello di un personaggio
Un videogioco conserva il livello di un personaggio in 1 byte, a partire da 0. Qual è il livello massimo?

Un byte sono 8 bit, quindi i valori sono $2^8 = 256$. Contando da 0, il massimo è $256 - 1 = 255$.
```

```ad-warning
Con 2 byte i valori non sono il doppio
Passando da 1 a 2 byte i bit raddoppiano, da 8 a 16, ma i valori passano da $2^8 = 256$ a $2^{16} = 65\,536$, cioè $256 \cdot 256$: non $512$. Ogni bit in più raddoppia i valori; un byte in più li moltiplica per 256.
```

## I multipli del byte

Un byte è poco: una foto ne occupa milioni. Per i multipli esistono due famiglie di unità, che si somigliano nel nome ma non coincidono.

I multipli decimali usano i prefissi del Sistema Internazionale, gli stessi di chilometro e chilogrammo: ogni unità vale 1000 volte la precedente.

| Unità | Simbolo | Quanti byte |
|---|---|---|
| kilobyte | kB | $1000\,\text{B} = 10^3\,\text{B}$ |
| megabyte | MB | $1000\,\text{kB} = 10^6\,\text{B}$ |
| gigabyte | GB | $1000\,\text{MB} = 10^9\,\text{B}$ |
| terabyte | TB | $1000\,\text{GB} = 10^{12}\,\text{B}$ |

I multipli binari, fissati dalla norma internazionale IEC, vanno di 1024 in 1024, perché $1024 = 2^{10}$ e le memorie dei computer sono costruite a potenze di due.

| Unità | Simbolo | Quanti byte |
|---|---|---|
| kibibyte | KiB | $1024\,\text{B} = 2^{10}\,\text{B}$ |
| mebibyte | MiB | $1024\,\text{KiB} = 2^{20}\,\text{B} = 1\,048\,576\,\text{B}$ |
| gibibyte | GiB | $1024\,\text{MiB} = 2^{30}\,\text{B} = 1\,073\,741\,824\,\text{B}$ |
| tebibyte | TiB | $1024\,\text{GiB} = 2^{40}\,\text{B}$ |

```tikz
% nome: multipli-del-byte
% alt: Due file di unità collegate da frecce. Sopra i multipli decimali: B, kB, MB, GB, TB, con la scritta per 1000 su ogni freccia. Sotto i multipli binari: B, KiB, MiB, GiB, TiB, con la scritta per 1024 su ogni freccia
% svg: multipli-del-byte-d7a82943.svg 347x125
\begin{tikzpicture}
\tikzset{u/.style={draw, thick, rounded corners=2pt, minimum width=0.85cm, minimum height=0.6cm, font=\small}, f/.style={font=\scriptsize, above, inner sep=3.5pt}}
\node[font=\small, anchor=west] at (-0.45,0.85) {multipli decimali};
\foreach \i/\n in {0/B, 1/kB, 2/MB, 3/GB, 4/TB} \node[u, fill=blue!10] (d\i) at (\i*2.05,0) {\n};
\foreach \a/\b in {0/1, 1/2, 2/3, 3/4} \draw[-{Stealth}, thick] (d\a) -- node[f] {$\cdot 1000$} (d\b);
\node[font=\small, anchor=west] at (-0.45,-0.95) {multipli binari};
\foreach \i/\n in {0/B, 1/KiB, 2/MiB, 3/GiB, 4/TiB} \node[u, fill=orange!25] (b\i) at (\i*2.05,-1.8) {\n};
\foreach \a/\b in {0/1, 1/2, 2/3, 3/4} \draw[-{Stealth}, thick] (b\a) -- node[f] {$\cdot 1024$} (b\b);
\end{tikzpicture}
```

Le due famiglie esistono perché per anni si è scritto "kilobyte" intendendo 1024 byte, dato che 1024 è vicino a 1000. Molti libri e alcuni sistemi operativi lo fanno ancora, e scrivono KB, MB e GB per i multipli da 1024. In queste lezioni kB, MB, GB e TB sono sempre i multipli da 1000, e quelli da 1024 hanno sempre la "i" nel simbolo. Negli esercizi il fattore è scritto ogni volta.

La differenza è piccola per il kilobyte ($24$ byte su $1000$, il $2{,}4\%$) e cresce a ogni passo: un GiB è più grande di un GB di circa il $7\%$.

```ad-warning
1 kB non sono 1024 byte
$1\,\text{kB} = 1000\,\text{B}$ e $1\,\text{KiB} = 1024\,\text{B}$. Prima di fare un conto guarda il simbolo: se c'è la "i" il fattore è 1024, altrimenti è 1000.
```

## Convertire da un'unità all'altra

1. Scrivi il fattore tra le due unità: 8 tra bit e byte, 1000 tra un multiplo decimale e il successivo, 1024 tra un multiplo binario e il successivo.
2. Se vai verso l'unità più piccola moltiplichi, se vai verso l'unità più grande dividi.
3. Se tra le due unità ci sono più passi (da GB a kB, da bit a kB), applichi un fattore per ogni passo.
4. Controlla il risultato: con l'unità più piccola il numero deve essere più grande, e viceversa.

```ad-example
Esempio 2: da megabyte a kilobyte
Quanti kB sono $3{,}5\,\text{MB}$?

Il fattore è 1000 e il kB è l'unità più piccola, quindi si moltiplica: $3{,}5 \cdot 1000 = 3500$. Sono $3500\,\text{kB}$.
```

```ad-example
Esempio 3: due passi verso l'unità più grande
Quanti GB sono $250\,000\,\text{kB}$?

Da kB a GB i passi sono due (kB, MB, GB) e si va verso l'unità più grande, quindi si divide due volte per 1000: $250\,000 : 1000 = 250\,\text{MB}$, e $250 : 1000 = 0{,}25\,\text{GB}$.
```

```ad-example
Esempio 4: multipli binari
Quanti KiB sono $4096\,\text{B}$? E quanti MiB sono $3\,\text{GiB}$?

Con la "i" il fattore è 1024. Dai byte ai KiB si divide: $4096 : 1024 = 4\,\text{KiB}$. Dai GiB ai MiB si moltiplica: $3 \cdot 1024 = 3072\,\text{MiB}$.
```

```ad-example
Esempio 5: dai bit ai kilobyte
Quanti kB sono $16\,000\,\text{bit}$?

Prima dai bit ai byte, dividendo per 8: $16\,000 : 8 = 2000\,\text{B}$. Poi dai byte ai kB, dividendo per 1000: $2000 : 1000 = 2\,\text{kB}$.
```

```ad-example
Esempio 6: da una famiglia all'altra
Un disco venduto come $500\,\text{GB}$ viene mostrato dal computer con un numero vicino a 465. Perché?

Il costruttore usa i GB: $500\,\text{GB} = 500 \cdot 10^9\,\text{B}$. Il computer conta in GiB, anche se a volte scrive GB. Per passare da una famiglia all'altra si passa dai byte: $500 \cdot 10^9 : 2^{30} = 500\,000\,000\,000 : 1\,073\,741\,824 \approx 465{,}66$. Il disco ha $465{,}66\,\text{GiB}$: i byte sono gli stessi, cambia l'unità con cui sono contati.
```

```ad-warning
Moltiplicare quando si deve dividere
$250\,\text{MB}$ non sono $250\,000\,\text{GB}$: il GB è più grande del MB, quindi ne servono di meno, $0{,}25\,\text{GB}$. Il controllo del passo 4 scopre l'errore subito.
```

## La velocità di trasmissione

Quando i dati viaggiano da un computer a un altro, la **velocità di trasmissione** dice quanti bit passano ogni secondo. Si misura in bit al secondo, $\text{bit/s}$, con multipli che sono sempre decimali:

$$1\,\text{kbit/s} = 1000\,\text{bit/s} \qquad 1\,\text{Mbit/s} = 1000\,\text{kbit/s} \qquad 1\,\text{Gbit/s} = 1000\,\text{Mbit/s}$$

Il tempo $t$ per trasferire una quantità di dati $D$ alla velocità $v$ è

$$t = \frac{D}{v}$$

La velocità è in bit e le dimensioni dei file sono in byte: prima di dividere bisogna portare $D$ in bit.

1. Porta la dimensione nello stesso multiplo della velocità: in MB se la velocità è in $\text{Mbit/s}$.
2. Moltiplica per 8 per passare dai byte ai bit: i MB diventano Mbit.
3. Dividi per la velocità: ottieni il tempo in secondi.
4. Se i secondi sono tanti, passa ai minuti dividendo per 60.

```ad-example
Esempio 7: una foto
Quanto tempo serve per scaricare una foto di $6\,\text{MB}$ con una connessione da $16\,\text{Mbit/s}$?

La foto è $6 \cdot 8 = 48\,\text{Mbit}$. Il tempo è $t = 48 : 16 = 3\,\text{s}$.
```

```ad-example
Esempio 8: un videogioco
Quanto tempo serve per scaricare un gioco di $45\,\text{GB}$ a $100\,\text{Mbit/s}$?

La velocità è in megabit, quindi si porta il gioco in MB: $45 \cdot 1000 = 45\,000\,\text{MB}$. In bit: $45\,000 \cdot 8 = 360\,000\,\text{Mbit}$. Il tempo è $360\,000 : 100 = 3600\,\text{s}$, cioè $3600 : 60 = 60$ minuti: un'ora.
```

```ad-example
Esempio 9: quanti dati in un certo tempo
Quanti MB si scaricano in $20\,\text{s}$ a $50\,\text{Mbit/s}$?

Dalla formula, $D = v \cdot t = 50 \cdot 20 = 1000\,\text{Mbit}$. In byte: $1000 : 8 = 125\,\text{MB}$.
```

```ad-warning
Megabit al secondo, non megabyte al secondo
Una connessione da $100\,\text{Mbit/s}$ non scarica $100\,\text{MB}$ ogni secondo: ne scarica $100 : 8 = 12{,}5$. Chi dimentica il fattore 8 trova tempi otto volte più brevi di quelli veri.
```
