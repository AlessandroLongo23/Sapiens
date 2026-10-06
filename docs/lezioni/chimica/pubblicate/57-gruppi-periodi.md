# Gruppi, periodi e blocchi

Mendeleev costruì la tavola periodica mettendo in colonna gli elementi che si somigliano, senza poter dire perché si somigliano (lezione [La tavola periodica di Mendeleev](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-tavola-periodica-di-mendeleev)). La risposta è nella [configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica): la riga e la colonna di un elemento si leggono nella sua configurazione, e dalla posizione si risale alla configurazione.

## La legge periodica

La tavola moderna ordina gli elementi per numero atomico $Z$ crescente. La **legge periodica** dice che, in quest'ordine, le proprietà degli elementi si ripetono a intervalli regolari: sono una funzione periodica del numero atomico.

Il litio ($Z = 3$), il sodio ($Z = 11$) e il potassio ($Z = 19$) sono tre metalli teneri che reagiscono con l'acqua allo stesso modo. Le loro configurazioni spiegano la somiglianza:

| Elemento | $Z$ | Configurazione |
|---|---|---|
| litio | $3$ | $[\text{He}]\,2s^1$ |
| sodio | $11$ | $[\text{Ne}]\,3s^1$ |
| potassio | $19$ | $[\text{Ar}]\,4s^1$ |

Tutti e tre hanno un solo elettrone in un sottolivello $s$, dopo la configurazione di un gas nobile. Cambia il livello, non la disposizione degli elettroni più esterni, e sono gli elettroni più esterni a decidere come un atomo reagisce. Le proprietà si ripetono perché, al crescere di $Z$, si ripete la configurazione esterna.

## I periodi

Le sette righe della tavola sono i **periodi**. Il numero del periodo è il livello più alto che contiene elettroni: il sodio, $[\text{Ne}]\,3s^1$, ha elettroni fino al terzo livello e sta nel periodo $3$.

Ogni periodo comincia quando un elettrone entra in un livello nuovo, nel sottolivello $s$, e finisce con un gas nobile, quando il sottolivello $p$ di quel livello è pieno (il primo periodo finisce con l'elio, perché il primo livello ha solo l'$1s$). La lunghezza di un periodo è il numero di elettroni che servono per riempire i sottolivelli tra un gas nobile e il successivo, presi nell'ordine della regola della diagonale.

| Periodo | Sottolivelli che si riempiono | Elementi |
|---|---|---|
| $1$ | $1s$ | $2$ |
| $2$ | $2s$, $2p$ | $2 + 6 = 8$ |
| $3$ | $3s$, $3p$ | $2 + 6 = 8$ |
| $4$ | $4s$, $3d$, $4p$ | $2 + 10 + 6 = 18$ |
| $5$ | $5s$, $4d$, $5p$ | $2 + 10 + 6 = 18$ |
| $6$ | $6s$, $4f$, $5d$, $6p$ | $2 + 14 + 10 + 6 = 32$ |
| $7$ | $7s$, $5f$, $6d$, $7p$ | $2 + 14 + 10 + 6 = 32$ |

```ad-warning
Il terzo periodo ha 8 elementi, non 18
Il terzo livello può contenere $18$ elettroni, ma il terzo periodo ha solo $8$ elementi. Il sottolivello $3d$ si riempie dopo il $4s$, quindi i suoi dieci elementi stanno nel quarto periodo. Il numero di elementi di un periodo non è la capienza del livello con lo stesso numero.
```

## I gruppi

Le diciotto colonne sono i **gruppi**, numerati da $1$ a $18$. Gli elementi di un gruppo hanno la stessa configurazione esterna, con un livello in più a ogni riga, e per questo hanno proprietà chimiche simili.

I gruppi $1$, $2$ e da $13$ a $18$ sono i **gruppi principali**, e i loro elementi si chiamano elementi rappresentativi. Nella numerazione tradizionale, che trovi ancora su molti libri, sono indicati con un numero romano e la lettera A (da IA a VIIIA): il numero romano è il numero di elettroni del livello più esterno.

| Gruppo | Numerazione tradizionale | Configurazione esterna | Esempio |
|---|---|---|---|
| $1$ | IA | $ns^1$ | $\mathrm{Na}$: $[\text{Ne}]\,3s^1$ |
| $2$ | IIA | $ns^2$ | $\mathrm{Mg}$: $[\text{Ne}]\,3s^2$ |
| $13$ | IIIA | $ns^2\,np^1$ | $\mathrm{Al}$: $[\text{Ne}]\,3s^2\,3p^1$ |
| $14$ | IVA | $ns^2\,np^2$ | $\mathrm{Si}$: $[\text{Ne}]\,3s^2\,3p^2$ |
| $15$ | VA | $ns^2\,np^3$ | $\mathrm{P}$: $[\text{Ne}]\,3s^2\,3p^3$ |
| $16$ | VIA | $ns^2\,np^4$ | $\mathrm{S}$: $[\text{Ne}]\,3s^2\,3p^4$ |
| $17$ | VIIA | $ns^2\,np^5$ | $\mathrm{Cl}$: $[\text{Ne}]\,3s^2\,3p^5$ |
| $18$ | VIIIA | $ns^2\,np^6$ | $\mathrm{Ar}$: $[\text{Ne}]\,3s^2\,3p^6$ |

Nella tabella $n$ è il numero del periodo. I gruppi da $3$ a $12$ contengono gli **elementi di transizione**, tutti metalli. Alcuni gruppi hanno un nome proprio (metalli alcalini, alogeni, gas nobili): ne parla la lezione [Metalli, non metalli e semimetalli](/materiale/scuola-superiore/chimica/il-sistema-periodico/metalli-non-metalli-e-semimetalli).

## I blocchi

La tavola si divide in quattro zone, i **blocchi**, che prendono il nome dal sottolivello che si sta riempiendo: in un elemento del blocco $d$, per esempio, l'ultimo elettrone previsto dalla regola della diagonale va in un sottolivello $d$.

```tikz
% nome: gruppi-periodi-blocchi-tavola
% alt: Lo schema della tavola periodica diviso in quattro blocchi colorati, con i gruppi numerati da 1 a 18 in alto e i periodi da 1 a 7 a sinistra. Il blocco s, a sinistra, occupa i gruppi 1 e 2, più la casella dell'elio in alto a destra. Il blocco d, al centro, occupa i gruppi da 3 a 12 dal quarto periodo in giù. Il blocco p, a destra, occupa i gruppi da 13 a 18 dal secondo periodo in giù. Il blocco f è formato da due righe di quattordici caselle disegnate sotto la tavola, collegate con un asterisco alle caselle del gruppo 3 nei periodi 6 e 7
% svg: gruppi-periodi-blocchi-tavola-5471a9de.svg 320x206
\begin{tikzpicture}[x=0.44cm, y=0.5cm]
\fill[blue!15] (0.5,-7.5) rectangle (1.5,-0.5);
\fill[blue!15] (1.5,-7.5) rectangle (2.5,-1.5);
\fill[blue!15] (17.5,-1.5) rectangle (18.5,-0.5);
\fill[green!15] (2.5,-7.5) rectangle (12.5,-3.5);
\fill[orange!25] (12.5,-7.5) rectangle (18.5,-1.5);
\fill[red!15] (3.5,-10.4) rectangle (17.5,-8.4);
\foreach \g in {1,18} \draw[very thin] (\g-0.5,-1.5) rectangle +(1,1);
\foreach \p in {2,3} \foreach \g in {1,2,13,14,15,16,17,18} \draw[very thin] (\g-0.5,-\p-0.5) rectangle +(1,1);
\foreach \p in {4,5,6,7} \foreach \g in {1,...,18} \draw[very thin] (\g-0.5,-\p-0.5) rectangle +(1,1);
\foreach \r in {8.9,9.9} \foreach \g in {4,...,17} \draw[very thin] (\g-0.5,-\r-0.5) rectangle +(1,1);
\foreach \g in {1,...,18} \node at (\g,-0.05) {\tiny \g};
\foreach \p in {1,...,7} \node at (-0.1,-\p) {\tiny \p};
\node at (3,-6) {\tiny $*$};
\node at (3,-7) {\tiny $**$};
\node at (2.9,-8.9) {\tiny $*$};
\node at (2.8,-9.9) {\tiny $**$};
\node at (2,-5) {\large $s$};
\node at (7,-5) {\large $d$};
\node at (15,-4) {\large $p$};
\node at (10,-8.9) {\large $f$};
\end{tikzpicture}
```

| Blocco | Dove sta | Sottolivello che si riempie nel periodo $n$ | Colonne |
|---|---|---|---|
| $s$ | gruppi $1$ e $2$, più l'elio | $ns$ | $2$ |
| $p$ | gruppi da $13$ a $18$ | $np$ | $6$ |
| $d$ | gruppi da $3$ a $12$ | $(n-1)d$ | $10$ |
| $f$ | le due righe sotto la tavola | $(n-2)f$ | $14$ |

Ogni blocco è largo quanti sono gli elettroni che il suo sottolivello può contenere: $2$, $6$, $10$ e $14$. Nel blocco $d$ e nel blocco $f$ il sottolivello che si riempie appartiene a un livello più interno di quello del periodo: nel quarto periodo si riempie il $3d$, nel sesto il $4f$ e il $5d$.

Il blocco $f$ contiene i lantanidi (periodo $6$) e gli attinidi (periodo $7$). Si disegnano sotto la tavola solo per non allargarla a $32$ colonne: il loro posto è tra il gruppo $3$ e il gruppo $4$.

```ad-note
L'elio sta nel blocco s ma nel gruppo 18
L'elio, $1s^2$, riempie un sottolivello $s$, quindi appartiene al blocco $s$. Nella tavola però sta sopra il neon, nel gruppo $18$, perché si comporta come gli altri gas nobili: ha il livello più esterno pieno.
```

La striscia qui sotto è il quarto periodo: sotto ogni tratto è scritto il sottolivello che si riempie.

```tikz
% nome: gruppi-periodi-quarto-periodo
% alt: Il quarto periodo della tavola periodica come una striscia di diciotto caselle, dal potassio al kripton, con il numero del gruppo sopra ogni casella. Le prime due caselle, potassio e calcio, sono del blocco s, e sotto c'è scritto 4s. Le dieci caselle dallo scandio allo zinco sono del blocco d, e sotto c'è scritto 3d. Le ultime sei, dal gallio al kripton, sono del blocco p, e sotto c'è scritto 4p
% svg: gruppi-periodi-quarto-periodo-426dc23e.svg 345x65
\begin{tikzpicture}[x=0.5cm, y=0.56cm]
\fill[blue!15] (0.5,-0.5) rectangle (2.5,0.5);
\fill[green!15] (2.5,-0.5) rectangle (12.5,0.5);
\fill[orange!25] (12.5,-0.5) rectangle (18.5,0.5);
\foreach \g/\s in {1/K, 2/Ca, 3/Sc, 4/Ti, 5/V, 6/Cr, 7/Mn, 8/Fe, 9/Co, 10/Ni, 11/Cu, 12/Zn, 13/Ga, 14/Ge, 15/As, 16/Se, 17/Br, 18/Kr} {
  \draw[thin] (\g-0.5,-0.5) rectangle +(1,1);
  \node at (\g,0) {\scriptsize \s};
  \node at (\g,0.85) {\tiny \g};
}
\foreach \a/\b/\name in {0.6/2.4/4s, 2.6/12.4/3d, 12.6/18.4/4p} {
  \draw[thin] (\a,-0.7) -- (\a,-0.9) -- (\b,-0.9) -- (\b,-0.7);
  \node at ({(\a+\b)/2},-1.35) {\small $\name$};
}
\end{tikzpicture}
```

Nella figura che segue scegli tu il numero di elettroni, cioè il numero atomico, e vedi in quale casella finisce l'elemento. Aggiungi un elettrone alla volta e guarda quando la casella cambia blocco e quando va a capo.

```interattivo
% nome: gruppi-periodi-elettrone-casella
% alt: La tavola periodica completa, con le caselle colorate secondo il blocco e il simbolo di ogni elemento. Con un cursore o con due bottoni si sceglie il numero atomico, da 1 a 118, oppure si tocca una casella. La casella dell'elemento scelto è evidenziata, insieme al numero del suo gruppo e del suo periodo. Sotto si leggono la configurazione elettronica, il periodo, il gruppo e il blocco, con una frase che spiega come ognuno dei tre si ricava dalla configurazione
```

Ogni elettrone in più sposta l'elemento di una casella verso destra. Quando comincia un livello nuovo, con il primo elettrone in un sottolivello $s$, la casella va a capo: è l'inizio di un periodo. Quando cambia il sottolivello che si riempie, la casella entra in un altro blocco.

## Dalla configurazione alla posizione

Dalla configurazione di un elemento si ricavano periodo, blocco e gruppo.

1. Il periodo è il valore più grande di $n$ che compare nella configurazione.
2. Il blocco è la lettera dell'ultimo sottolivello, con la configurazione scritta nell'ordine di riempimento.
3. Il gruppo dipende dal blocco. Nel blocco $s$ è il numero di elettroni nel sottolivello $ns$. Nel blocco $p$ è $12$ più il numero di elettroni nel sottolivello $np$. Nel blocco $d$ è la somma degli elettroni di $ns$ e di $(n-1)d$.

```ad-example
Esempio 1: un elemento del blocco p
Un elemento ha configurazione $[\text{Ne}]\,3s^2\,3p^4$. Dove si trova nella tavola?

Il valore più grande di $n$ è $3$: periodo $3$. L'ultimo sottolivello è il $3p$: blocco $p$. Nel $3p$ ci sono $4$ elettroni, quindi il gruppo è $12 + 4 = 16$.

L'elemento del periodo $3$ e del gruppo $16$ è lo zolfo. Controllo con il numero di elettroni: $10 + 2 + 4 = 16$, che è il numero atomico dello zolfo.
```

```ad-example
Esempio 2: un elemento del blocco d
Un elemento ha configurazione $[\text{Ar}]\,4s^2\,3d^6$. Dove si trova?

Il valore più grande di $n$ è $4$, quello del $4s$: periodo $4$. L'ultimo sottolivello è il $3d$: blocco $d$. Il gruppo è la somma degli elettroni del $4s$ e del $3d$: $2 + 6 = 8$.

È il ferro, periodo $4$ e gruppo $8$.
```

```ad-warning
Nel blocco d il periodo si legge sul sottolivello s
In $[\text{Ar}]\,4s^2\,3d^6$ l'ultimo sottolivello scritto è il $3d$, ma il periodo è $4$, perché il livello più alto occupato è il quarto. Chi legge il periodo sull'ultimo sottolivello mette il ferro nel terzo periodo, che ha solo otto elementi e nessun metallo di transizione.
```

```ad-example
Esempio 3: una configurazione scritta per intero
Un elemento ha configurazione $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^{10}\,4p^5$. Dove si trova?

Il valore più grande di $n$ è $4$: periodo $4$. L'ultimo sottolivello è il $4p$: blocco $p$. Nel $4p$ ci sono $5$ elettroni: gruppo $12 + 5 = 17$.

È il bromo. Controllo: gli esponenti danno $2 + 2 + 6 + 2 + 6 + 2 + 10 + 5 = 35$, il suo numero atomico.
```

```ad-warning
Nel blocco p il gruppo non è il numero di elettroni del sottolivello p
Un elemento con configurazione esterna $ns^2\,np^4$ non sta nel gruppo $4$, e nemmeno nel gruppo $6$: sta nel gruppo $16$. Davanti al blocco $p$ ci sono le due colonne del blocco $s$ e le dieci del blocco $d$, per questo si somma $12$. Il $6$, che è la somma degli elettroni di $ns$ e $np$, è il numero della numerazione tradizionale: gruppo VIA.
```

## Dalla posizione alla configurazione

Il percorso inverso parte dal periodo $n$ e dal gruppo.

1. Tra parentesi quadre va il gas nobile che chiude il periodo precedente.
2. Si riempiono i sottolivelli del periodo, nell'ordine $ns$, $(n-2)f$, $(n-1)d$, $np$, saltando quelli che in quel periodo non ci sono, finché gli elettroni aggiunti portano al gruppo giusto.

In pratica: un elemento del gruppo $1$ o $2$ finisce con $ns^1$ o $ns^2$; uno dei gruppi da $3$ a $12$ ha $ns^2$ e nel $(n-1)d$ il numero del gruppo meno $2$; uno dei gruppi da $13$ a $18$ ha $ns^2$, il sottolivello $(n-1)d$ pieno se il periodo è il quarto o uno dei successivi, e nel $np$ il numero del gruppo meno $12$.

```ad-example
Esempio 4: periodo 3, gruppo 15
Il gas nobile che chiude il secondo periodo è il neon. Nel terzo periodo si riempiono il $3s$ e il $3p$. Il gruppo $15$ è nel blocco $p$: il $3s$ è pieno e nel $3p$ ci sono $15 - 12 = 3$ elettroni.

$$[\text{Ne}]\,3s^2\,3p^3$$

È il fosforo: $10 + 2 + 3 = 15$ elettroni.
```

```ad-example
Esempio 5: periodo 4, gruppo 7
Il gas nobile che chiude il terzo periodo è l'argon. Il gruppo $7$ è nel blocco $d$: il $4s$ è pieno e nel $3d$ ci sono $7 - 2 = 5$ elettroni.

$$[\text{Ar}]\,4s^2\,3d^5$$

È il manganese: $18 + 2 + 5 = 25$ elettroni.
```

```ad-example
Esempio 6: periodo 5, gruppo 16
Il gas nobile che chiude il quarto periodo è il kripton. Il gruppo $16$ è nel blocco $p$, e per arrivarci nel quinto periodo si attraversano il $5s$ e tutto il $4d$: sono pieni tutti e due. Nel $5p$ ci sono $16 - 12 = 4$ elettroni.

$$[\text{Kr}]\,5s^2\,4d^{10}\,5p^4$$

È il tellurio: $36 + 2 + 10 + 4 = 52$ elettroni.
```

```ad-warning
Dal quarto periodo, prima del sottolivello p c'è un d pieno
Per un elemento del blocco $p$ del quarto periodo o dei successivi, tra $ns^2$ e $np$ va scritto il sottolivello $(n-1)d^{10}$. Il selenio è $[\text{Ar}]\,4s^2\,3d^{10}\,4p^4$, non $[\text{Ar}]\,4s^2\,4p^4$: senza i dieci elettroni del $3d$ il conto degli elettroni si ferma a $24$ invece che a $34$.
```

Il procedimento dà la configurazione prevista dalla regola della diagonale. Per il cromo (periodo $4$, gruppo $6$) e il rame (periodo $4$, gruppo $11$) la configurazione vera sposta un elettrone dal $4s$ al $3d$, come hai visto nella lezione sulla configurazione elettronica; la posizione nella tavola resta quella. La configurazione vera di ogni elemento è nella sua scheda della [tavola periodica](/strumenti/tavola-periodica).
