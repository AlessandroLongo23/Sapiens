# La codifica dei suoni

Un messaggio vocale, una canzone sul telefono, la voce di un compagno in una videochiamata: sono tutti suoni che un calcolatore ha trasformato in numeri. Un suono, però, non è fatto di pezzi separati come un testo, che è una fila di caratteri, o un'immagine, che è una griglia di pixel. È una vibrazione dell'aria che cambia senza salti, istante dopo istante. Per scriverla con i bit bisogna decidere quanto spesso misurarla e con quanta precisione scrivere ogni misura.

## Dal suono ai numeri

Un microfono trasforma la vibrazione dell'aria in un segnale elettrico che la segue fedelmente: quando l'aria spinge di più il segnale sale, quando spinge di meno scende. Un segnale così, che può assumere qualunque valore e cambia con continuità, si dice **analogico**. Un calcolatore lavora invece con un segnale **digitale**, cioè con una sequenza di numeri.

Il passaggio dall'uno all'altro si fa in due mosse: il campionamento, che sceglie gli istanti in cui misurare, e la quantizzazione, che trasforma ogni misura in un numero intero.

## Il campionamento

Il **campionamento** consiste nel misurare il segnale a intervalli di tempo regolari. Ogni misura si chiama **campione**. Quello che il segnale fa tra un campione e il successivo va perso.

```tikz
% nome: campionamento-di-un-suono
% alt: Una curva ondulata rappresenta il segnale analogico in funzione del tempo; lungo la curva, a intervalli regolari, tredici punti con un trattino verticale fino all'asse del tempo segnano i campioni
% svg: campionamento-di-un-suono-f85e4b8c.svg 332x175
\begin{tikzpicture}
\draw[-{Stealth}] (-0.2,0) -- (7.9,0) node[below, font=\small] {tempo};
\draw[-{Stealth}] (0,-0.2) -- (0,3.9);
\node[font=\small, right] at (0.1,3.8) {segnale};
\draw[thick, blue] plot[smooth] coordinates {(0.0,2.14) (0.2,2.59) (0.4,2.79) (0.6,2.75) (0.8,2.56) (1.0,2.37) (1.2,2.3) (1.4,2.37) (1.6,2.54) (1.8,2.69) (2.0,2.69) (2.2,2.44) (2.4,1.95) (2.6,1.33) (2.8,0.73) (3.0,0.32) (3.2,0.2) (3.4,0.38) (3.6,0.75) (3.8,1.17) (4.0,1.49) (4.2,1.65) (4.4,1.65) (4.6,1.59) (4.8,1.59) (5.0,1.77) (5.2,2.14) (5.4,2.62) (5.6,3.08) (5.8,3.35) (6.0,3.32) (6.2,3.0) (6.4,2.46) (6.6,1.86) (6.8,1.37) (7.0,1.09) (7.2,1.04)};
\foreach \x/\y in {0.0/2.14, 0.6/2.75, 1.2/2.3, 1.8/2.69, 2.4/1.95, 3.0/0.32, 3.6/0.75, 4.2/1.65, 4.8/1.59, 5.4/2.62, 6.0/3.32, 6.6/1.86, 7.2/1.04} {
  \draw[thin] (\x,0) -- (\x,\y);
  \fill[orange] (\x,\y) circle (2.2pt);
}
\end{tikzpicture}
```

La **frequenza di campionamento** è il numero di campioni presi in un secondo. Si misura in hertz (Hz), e $1\,\text{kHz} = 1000\,\text{Hz}$. Un CD audio usa $44{,}1\,\text{kHz}$, cioè $44\,100$ campioni al secondo; per la voce di una telefonata tradizionale ne bastano $8000$ al secondo.

```ad-example
Esempio 1: quanti campioni
Un messaggio vocale di $3$ secondi è campionato a $8\,\text{kHz}$. Quanti campioni contiene?

$8\,\text{kHz}$ sono $8000$ campioni al secondo. In $3$ secondi: $8000 \cdot 3 = 24\,000$ campioni.
```

### Quanti campioni al secondo servono

Ogni suono ha la sua frequenza, che dice quante volte al secondo l'aria vibra: i suoni gravi hanno frequenze basse, quelli acuti frequenze alte. Anche questa si misura in hertz, e l'orecchio umano sente all'incirca i suoni tra $20\,\text{Hz}$ e $20\,\text{kHz}$.

Se i campioni sono troppo radi, le vibrazioni veloci passano tra un campione e l'altro senza lasciare traccia. La regola per non perderle è questa: la frequenza di campionamento deve essere almeno il doppio della frequenza più alta contenuta nel suono.

$$\text{frequenza di campionamento} \ge 2 \cdot \text{frequenza più alta del suono}$$

Per questo i CD campionano a $44{,}1\,\text{kHz}$: è un po' più del doppio di $20\,\text{kHz}$, il limite dell'udito.

```ad-example
Esempio 2: la regola nei due versi
Una registrazione contiene suoni fino a $4\,\text{kHz}$: con quale frequenza va campionata, come minimo? E un registratore che campiona a $8\,\text{kHz}$, fino a quale frequenza registra correttamente?

Per la registrazione serve almeno il doppio: $2 \cdot 4 = 8\,\text{kHz}$.

Per il registratore si fa il conto al contrario: la frequenza più alta è la metà di quella di campionamento, $8 : 2 = 4\,\text{kHz}$. I suoni più acuti di così non vengono registrati correttamente.
```

```ad-warning
Il doppio, non lo stesso numero
Campionare a $4\,\text{kHz}$ un suono di $4\,\text{kHz}$ non basta: servono almeno due campioni per ogni vibrazione, uno quando il segnale sale e uno quando scende.
```

## La quantizzazione

Un campione è una misura, e può valere qualunque numero. Per scriverlo con un numero fisso di bit bisogna arrotondarlo. La **quantizzazione** divide l'intervallo dei valori possibili in livelli numerati e sostituisce ogni campione con il numero del livello più vicino.

Con $n$ bit per campione i livelli sono $2^n$: con $8$ bit sono $256$, con i $16$ bit dei CD sono $65\,536$. Più livelli ci sono, più piccolo è l'arrotondamento e più il suono registrato somiglia all'originale.

```tikz
% nome: quantizzazione-a-3-bit
% alt: Lo stesso segnale della figura precedente con otto livelli orizzontali numerati da 0 a 7, cioè 3 bit; ogni campione è spostato sul livello più vicino, e sotto l'asse del tempo sono scritti i numeri dei livelli: 4, 6, 5, 5, 4, 1, 2, 3, 3, 5, 7, 4, 2
% svg: quantizzazione-a-3-bit-5781d45f.svg 360x185
\begin{tikzpicture}
\draw[-{Stealth}] (-0.2,0) -- (7.9,0);
\foreach \l in {0,...,7} {
  \draw[thin, dashed] (0,\l*0.5) -- (7.5,\l*0.5);
  \node[font=\small, left] at (-0.1,\l*0.5) {\l};
}
\node[font=\small, left] at (-0.45,3.95) {livello};
\draw[thin, blue] plot[smooth] coordinates {(0.0,2.14) (0.2,2.59) (0.4,2.79) (0.6,2.75) (0.8,2.56) (1.0,2.37) (1.2,2.3) (1.4,2.37) (1.6,2.54) (1.8,2.69) (2.0,2.69) (2.2,2.44) (2.4,1.95) (2.6,1.33) (2.8,0.73) (3.0,0.32) (3.2,0.2) (3.4,0.38) (3.6,0.75) (3.8,1.17) (4.0,1.49) (4.2,1.65) (4.4,1.65) (4.6,1.59) (4.8,1.59) (5.0,1.77) (5.2,2.14) (5.4,2.62) (5.6,3.08) (5.8,3.35) (6.0,3.32) (6.2,3.0) (6.4,2.46) (6.6,1.86) (6.8,1.37) (7.0,1.09) (7.2,1.04)};
\foreach \x/\q in {0.0/4, 0.6/6, 1.2/5, 1.8/5, 2.4/4, 3.0/1, 3.6/2, 4.2/3, 4.8/3, 5.4/5, 6.0/7, 6.6/4, 7.2/2} {
  \fill[orange] (\x,\q*0.5) circle (2.4pt);
  \node[font=\small] at (\x,-0.4) {\q};
}
\end{tikzpicture}
```

Nella figura i livelli sono solo $8$, quelli di $3$ bit. Il suono diventa la sequenza $4$, $6$, $5$, $5$, $4$, $1$, $2$, $3$, $3$, $5$, $7$, $4$, $2$, e ogni numero si scrive con tre bit: $100$, $110$, $101$, e così via.

Nel piano qui sotto la curva grigia tratteggiata è un segnale e quella a gradini è lo stesso segnale dopo la quantizzazione a $n$ bit: in ogni istante vale il livello più vicino. I livelli sono $L = 2^n$. Muovi il cursore di $n$ e guarda quanto i gradini si staccano dalla curva: con $1$ bit i livelli sono due, e del segnale resta solo se è alto o basso.

```grafico
% nome: quantizzazione-al-variare-dei-bit
% alt: Un segnale ondulato tratteggiato e la sua versione a gradini, quantizzata con n bit: un cursore cambia n da 1 a 6 e i livelli, che sono 2 alla n, diventano più fitti
curva: y=2+\sin\left(x\right)+\frac{1}{2}\sin\left(3x\right) | tratteggiata | grigio
curva: y=\frac{4}{2^n}\left(\left\lfloor\frac{2^n}{4}\left(2+\sin\left(x\right)+\frac{1}{2}\sin\left(3x\right)\right)\right\rfloor+\frac{1}{2}\right)
cursore: n = 3 da 1 a 6 passo 1
finestra: x da 0 a 8, y da 0 a 4
valore: L = 2^n
domanda: Con quanti bit i gradini non si distinguono più dalla curva? E quanti livelli sono?
```

```ad-example
Esempio 3: livelli e bit
Quanti livelli ci sono con $12$ bit per campione? E quanti bit servono per avere almeno $1000$ livelli?

Con $12$ bit: $2^{12} = 4096$ livelli.

Per $1000$ livelli: $2^9 = 512$ non basta, $2^{10} = 1024$ sì. Servono $10$ bit.
```

## I canali

Un suono **mono** ha un solo canale: una sola sequenza di campioni. Un suono **stereo** ne ha due, uno per l'altoparlante o l'auricolare sinistro e uno per il destro, e ogni canale ha i suoi campioni. A parità di tutto il resto, un suono stereo occupa il doppio di uno mono.

## La dimensione di un suono non compresso

Se ogni campione viene memorizzato così com'è, lo spazio occupato si calcola così:

1. Porta la durata in secondi e la frequenza di campionamento in hertz.
2. Campioni per canale: frequenza di campionamento per durata.
3. Moltiplica per i bit per campione e per il numero di canali: ottieni i bit.
4. Dividi per $8$: ottieni i byte.
5. Se serve, passa a un multiplo del byte con il fattore giusto, come nella lezione [Bit, byte e unità di misura](/materiale/scuola-superiore/informatica/informatica-e-informazione/bit-byte-e-unita-di-misura).

In una formula:

$$\text{byte} = \frac{\text{frequenza} \cdot \text{secondi} \cdot \text{bit per campione} \cdot \text{canali}}{8}$$

```ad-example
Esempio 4: un messaggio vocale
Un messaggio di $10$ secondi è registrato in mono a $8\,\text{kHz}$ con $8$ bit per campione. Quanti byte occupa?

1. La frequenza è $8000\,\text{Hz}$, la durata $10$ secondi.
2. Campioni: $8000 \cdot 10 = 80\,000$.
3. Bit: $80\,000 \cdot 8 \cdot 1 = 640\,000$.
4. Byte: $640\,000 : 8 = 80\,000$.

Il messaggio occupa $80\,000\,\text{B}$, cioè $80\,\text{kB}$ con $1\,\text{kB} = 1000\,\text{B}$.
```

```ad-example
Esempio 5: un minuto con la qualità di un CD
Quanti MB occupa un minuto di musica non compressa, stereo, a $44{,}1\,\text{kHz}$ e $16$ bit per campione? Usa $1\,\text{MB} = 1\,000\,000\,\text{B}$.

1. La frequenza è $44\,100\,\text{Hz}$, la durata $60$ secondi.
2. Campioni per canale: $44\,100 \cdot 60 = 2\,646\,000$.
3. Bit: $2\,646\,000 \cdot 16 \cdot 2 = 84\,672\,000$.
4. Byte: $84\,672\,000 : 8 = 10\,584\,000$.
5. In MB: $10\,584\,000 : 1\,000\,000 = 10{,}584\,\text{MB}$.

Ogni minuto occupa più di $10\,\text{MB}$.
```

```ad-example
Esempio 6: quanti secondi stanno in una memoria
Quanti secondi interi di suono mono a $44{,}1\,\text{kHz}$ e $16$ bit per campione stanno in $1\,\text{MB}$, cioè in $1\,000\,000\,\text{B}$?

Un secondo occupa $44\,100 \cdot 16 \cdot 1 : 8 = 88\,200\,\text{B}$.

$1\,000\,000 : 88\,200 = 11{,}3\ldots$: ci stanno $11$ secondi interi.
```

```ad-warning
Tre dimenticanze frequenti
I minuti vanno trasformati in secondi prima di moltiplicare. I kHz vanno trasformati in Hz: $44{,}1\,\text{kHz}$ sono $44\,100$ campioni al secondo, non $44{,}1$. In stereo i canali sono due, e il risultato raddoppia.
```

I bit che servono per ogni secondo di suono si chiamano anche flusso di bit e si misurano in $\text{kbit/s}$. Per la musica dell'esempio 5 sono $44\,100 \cdot 16 \cdot 2 = 1\,411\,200$ bit al secondo, cioè $1411{,}2\,\text{kbit/s}$.

## Perché la musica che ascolti occupa meno

Con i numeri dell'esempio 5 una canzone di tre minuti occuperebbe quasi $32\,\text{MB}$. I file musicali e i messaggi vocali sono molto più piccoli perché sono salvati con una compressione: un procedimento che riduce i bit, spesso eliminando le parti del suono che l'orecchio distingue peggio. Con la compressione lo stesso minuto di musica può scendere a circa un decimo.
