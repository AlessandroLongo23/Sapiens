# Elettroni di valenza e simboli di Lewis

Quando due atomi si avvicinano, a venire in contatto sono gli elettroni più esterni; quelli interni restano stretti attorno al nucleo. Gli elettroni esterni sono pochi, da uno a otto, e il loro numero decide quasi tutta la chimica di un elemento: quali ioni forma, quanti legami fa, a quali altri elementi somiglia. I simboli di Lewis sono un modo rapido di disegnarli.

## Gli elettroni di valenza

Gli **elettroni di valenza** di un atomo sono gli elettroni del suo livello più esterno, che si chiama livello di valenza. Tutti gli altri sono elettroni interni. Questa definizione vale per gli elementi dei gruppi principali ($1$, $2$ e da $13$ a $18$), che sono quelli di questa lezione.

Dalla [configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica) si contano così: si cerca il valore più grande di $n$ e si sommano gli elettroni di tutti i sottolivelli con quel valore, che per un elemento dei gruppi principali sono $ns$ e $np$.

```ad-example
Esempio 1: gli elettroni di valenza dello zolfo
Lo zolfo ha configurazione $[\text{Ne}]\,3s^2\,3p^4$.

Il livello più esterno è il terzo, con i sottolivelli $3s$ e $3p$. Gli elettroni di valenza sono $2 + 4 = 6$. I dieci elettroni indicati da $[\text{Ne}]$ sono interni.
```

```ad-example
Esempio 2: gli elettroni di valenza del bromo
Il bromo ha configurazione $[\text{Ar}]\,4s^2\,3d^{10}\,4p^5$.

Il valore più grande di $n$ è $4$, e i sottolivelli del quarto livello sono il $4s$ e il $4p$. Gli elettroni di valenza sono $2 + 5 = 7$. I dieci elettroni del $3d$ appartengono al terzo livello: sono interni, anche se nella configurazione sono scritti dopo il $4s$.
```

```ad-warning
Non contare solo l'ultimo sottolivello, e non contare il d pieno
Due errori frequenti. Il primo è prendere solo gli elettroni dell'ultimo sottolivello: per lo zolfo $4$ invece di $6$. Gli elettroni di valenza sono quelli di tutto il livello esterno, $s$ compreso. Il secondo è sommare tutto quello che viene dopo il gas nobile: per il bromo $2 + 10 + 5 = 17$ invece di $7$. Il sottolivello $3d^{10}$ è pieno e più interno, e non conta.
```

## Dal gruppo agli elettroni di valenza

Gli elementi di uno stesso gruppo hanno la stessa configurazione esterna (lezione [Gruppi, periodi e blocchi](/materiale/scuola-superiore/chimica/il-sistema-periodico/gruppi-periodi-e-blocchi)), quindi lo stesso numero di elettroni di valenza. Per i gruppi principali il numero si legge sul gruppo: nei gruppi $1$ e $2$ è il numero del gruppo, nei gruppi da $13$ a $18$ è il numero del gruppo meno $10$.

| Gruppo | $1$ | $2$ | $13$ | $14$ | $15$ | $16$ | $17$ | $18$ |
|---|---|---|---|---|---|---|---|---|
| Numerazione tradizionale | IA | IIA | IIIA | IVA | VA | VIA | VIIA | VIIIA |
| Configurazione esterna | $ns^1$ | $ns^2$ | $ns^2\,np^1$ | $ns^2\,np^2$ | $ns^2\,np^3$ | $ns^2\,np^4$ | $ns^2\,np^5$ | $ns^2\,np^6$ |
| Elettroni di valenza | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ |

Nella numerazione tradizionale il numero romano è proprio il numero di elettroni di valenza. L'unica eccezione della tabella è l'elio: sta nel gruppo $18$, ma ha configurazione $1s^2$ e $2$ elettroni di valenza, perché il primo livello non ne contiene di più.

```ad-example
Esempio 3: dal posto nella tavola
Quanti elettroni di valenza hanno il potassio, l'alluminio e lo iodio?

Il potassio è nel gruppo $1$: ha $1$ elettrone di valenza. L'alluminio è nel gruppo $13$: ne ha $13 - 10 = 3$. Lo iodio è nel gruppo $17$: ne ha $17 - 10 = 7$.

Il periodo non conta: lo iodio, del quinto periodo, ha gli stessi $7$ elettroni di valenza del fluoro, del secondo. Cambia il livello in cui si trovano.
```

```ad-note
Gli elementi di transizione
Nei gruppi da $3$ a $12$ ai legami partecipano anche gli elettroni del sottolivello $(n-1)d$, che ha un'energia vicina a quella del sottolivello $ns$. Il conto degli elettroni di valenza lì è meno diretto, e i simboli di Lewis non si usano.
```

## I simboli di Lewis

Il **simbolo di Lewis** di un atomo è il simbolo dell'elemento circondato da tanti puntini quanti sono i suoi elettroni di valenza. Li introdusse nel 1916 il chimico americano Gilbert Lewis. Il simbolo dell'elemento rappresenta il nucleo insieme agli elettroni interni; i puntini sono gli elettroni di valenza.

Per disegnarlo:

1. Trova il numero di elettroni di valenza.
2. Immagina quattro posti attorno al simbolo: sopra, a destra, sotto, a sinistra.
3. Metti i primi quattro puntini uno per posto.
4. Dal quinto in poi aggiungi un secondo puntino a ogni posto, formando delle coppie.

```tikz
% nome: lewis-ordine-puntini
% alt: Otto simboli di Lewis di un elemento generico X, con un numero di puntini che cresce da uno a otto. Con uno, due, tre e quattro puntini i puntini sono singoli, uno per lato: sopra, a destra, sotto, a sinistra. Con cinque puntini il lato sopra ha una coppia e gli altri tre lati un puntino; con sei ci sono due coppie e due puntini singoli; con sette tre coppie e un puntino singolo; con otto quattro coppie
% svg: lewis-ordine-puntini-1a88bbb8.svg 322x58
\begin{tikzpicture}
\node at (0,0) {X};
\node at (1.12,0) {X};
\node at (2.24,0) {X};
\node at (3.36,0) {X};
\node at (4.48,0) {X};
\node at (5.6,0) {X};
\node at (6.72,0) {X};
\node at (7.84,0) {X};
\foreach \x/\y in {0/0.34, 1.12/0.34, 1.42/0, 2.24/0.34, 2.54/0, 2.24/-0.34, 3.36/0.34, 3.66/0, 3.36/-0.34, 3.06/0, 4.4/0.34, 4.57/0.34, 4.78/0, 4.48/-0.34, 4.18/0, 5.52/0.34, 5.69/0.34, 5.9/-0.09, 5.9/0.09, 5.6/-0.34, 5.3/0, 6.64/0.34, 6.81/0.34, 7.02/-0.09, 7.02/0.09, 6.64/-0.34, 6.81/-0.34, 6.42/0, 7.76/0.34, 7.93/0.34, 8.14/-0.09, 8.14/0.09, 7.76/-0.34, 7.93/-0.34, 7.54/-0.09, 7.54/0.09} \fill (\x,\y) circle (1.1pt);
\node at (0,-0.85) {\small $1$};
\node at (1.12,-0.85) {\small $2$};
\node at (2.24,-0.85) {\small $3$};
\node at (3.36,-0.85) {\small $4$};
\node at (4.48,-0.85) {\small $5$};
\node at (5.6,-0.85) {\small $6$};
\node at (6.72,-0.85) {\small $7$};
\node at (7.84,-0.85) {\small $8$};
\end{tikzpicture}
```

Un puntino da solo su un lato è un **elettrone spaiato**; due puntini sullo stesso lato sono una **coppia di elettroni**, o doppietto. Su quale lato si comincia non ha importanza: contano il numero di puntini singoli e il numero di coppie.

Ecco i simboli di Lewis degli elementi dei primi tre periodi. In ogni colonna il numero di puntini è lo stesso, perché è lo stesso il numero di elettroni di valenza.

```tikz
% nome: lewis-simboli-primi-tre-periodi
% alt: I simboli di Lewis degli elementi dei primi tre periodi, disposti come nella tavola periodica sotto i numeri dei gruppi 1, 2, 13, 14, 15, 16, 17 e 18. Idrogeno, litio e sodio hanno un puntino. Berillio e magnesio due puntini singoli. Boro e alluminio tre puntini singoli. Carbonio e silicio quattro puntini singoli. Azoto e fosforo una coppia e tre puntini singoli. Ossigeno e zolfo due coppie e due puntini singoli. Fluoro e cloro tre coppie e un puntino singolo. Neon e argon quattro coppie. L'elio, sopra il neon, ha una sola coppia
% svg: lewis-simboli-primi-tre-periodi-f80b932d.svg 367x152
\begin{tikzpicture}
\node at (0,0) {H};
\node at (8.4,0) {He};
\node at (0,-1.15) {Li};
\node at (1.2,-1.15) {Be};
\node at (2.4,-1.15) {B};
\node at (3.6,-1.15) {C};
\node at (4.8,-1.15) {N};
\node at (6,-1.15) {O};
\node at (7.2,-1.15) {F};
\node at (8.4,-1.15) {Ne};
\node at (0,-2.3) {Na};
\node at (1.2,-2.3) {Mg};
\node at (2.4,-2.3) {Al};
\node at (3.6,-2.3) {Si};
\node at (4.8,-2.3) {P};
\node at (6,-2.3) {S};
\node at (7.2,-2.3) {Cl};
\node at (8.4,-2.3) {Ar};
\foreach \x/\y in {0/0.34, 0/-0.81, 1.2/-0.81, 1.62/-1.15, 2.4/-0.81, 2.7/-1.15, 2.4/-1.49, 3.6/-0.81, 3.9/-1.15, 3.6/-1.49, 3.3/-1.15, 4.71/-0.81, 4.88/-0.81, 5.1/-1.15, 4.8/-1.49, 4.5/-1.15, 5.92/-0.81, 6.08/-0.81, 6.3/-1.23, 6.3/-1.06, 6/-1.49, 5.7/-1.15, 7.11/-0.81, 7.28/-0.81, 7.5/-1.23, 7.5/-1.06, 7.11/-1.49, 7.28/-1.49, 6.9/-1.15, 8.31/-0.81, 8.49/-0.81, 8.82/-1.23, 8.82/-1.06, 8.31/-1.49, 8.49/-1.49, 7.98/-1.23, 7.98/-1.06, 0/-1.96, 1.2/-1.96, 1.62/-2.3, 2.4/-1.96, 2.82/-2.3, 2.4/-2.64, 3.6/-1.96, 4.02/-2.3, 3.6/-2.64, 3.18/-2.3, 4.71/-1.96, 4.88/-1.96, 5.1/-2.3, 4.8/-2.64, 4.5/-2.3, 5.92/-1.96, 6.08/-1.96, 6.3/-2.38, 6.3/-2.21, 6/-2.64, 5.7/-2.3, 7.11/-1.96, 7.28/-1.96, 7.62/-2.38, 7.62/-2.21, 7.11/-2.64, 7.28/-2.64, 6.78/-2.3, 8.31/-1.96, 8.49/-1.96, 8.82/-2.38, 8.82/-2.21, 8.31/-2.64, 8.49/-2.64, 7.98/-2.38, 7.98/-2.21} \fill (\x,\y) circle (1.1pt);
\foreach \c/\r in {0/0, 7/0, 0/1, 1/1, 2/1, 3/1, 4/1, 5/1, 6/1, 7/1, 0/2, 1/2, 2/2, 3/2, 4/2, 5/2, 6/2, 7/2} \draw[very thin, gray] (\c*1.2-0.6,-\r*1.15-0.575) rectangle +(1.2,1.15);
\node at (0,0.85) {\small 1};
\node at (1.2,0.85) {\small 2};
\node at (2.4,0.85) {\small 13};
\node at (3.6,0.85) {\small 14};
\node at (4.8,0.85) {\small 15};
\node at (6,0.85) {\small 16};
\node at (7.2,0.85) {\small 17};
\node at (8.4,0.85) {\small 18};
\foreach \x/\y in {8.31/0.34, 8.49/0.34} \fill (\x,\y) circle (1.1pt);
\end{tikzpicture}
```

```ad-example
Esempio 4: il simbolo di Lewis del fosforo
Il fosforo è nel gruppo $15$: ha $15 - 10 = 5$ elettroni di valenza.

I primi quattro puntini vanno uno per lato. Il quinto si aggiunge al primo lato e forma una coppia.

```tikz
% nome: lewis-simbolo-fosforo
% alt: Il simbolo di Lewis del fosforo: la lettera P con una coppia di puntini sopra e tre puntini singoli, uno a destra, uno sotto e uno a sinistra
% svg: lewis-simbolo-fosforo-993a81bb.svg 28x31
\begin{tikzpicture}
\node at (0,0) {P};
\foreach \x/\y in {-0.09/0.34, 0.09/0.34, 0.3/0, 0/-0.34, -0.3/0} \fill (\x,\y) circle (1.1pt);
\end{tikzpicture}
```

Il simbolo ha una coppia e tre elettroni spaiati, come quello dell'azoto, che sta nello stesso gruppo.
```

```ad-note
Il simbolo di Lewis non è un diagramma a caselle
Nel diagramma a caselle del carbonio, $2s^2\,2p^2$, due elettroni sono appaiati nel $2s$ e due sono spaiati nel $2p$. Il simbolo di Lewis del carbonio ha invece quattro puntini singoli. Non è un errore: il simbolo di Lewis non descrive gli orbitali dell'atomo isolato, conta gli elettroni di valenza e li dispone nel modo più utile per prevedere i legami. Il carbonio forma infatti quattro legami. Per questo gli elettroni spaiati di un simbolo di Lewis non sono sempre quelli del diagramma a caselle.
```

Nei non metalli il numero di elettroni spaiati del simbolo è il numero di legami che l'atomo forma di solito: uno per l'idrogeno e per il cloro, due per l'ossigeno, tre per l'azoto, quattro per il carbonio. Il perché è nella lezione [Il legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente).

Nella figura qui sotto scegli un elemento dei gruppi principali e guardi il suo simbolo di Lewis. Prova a scendere lungo un gruppo e poi a spostarti lungo un periodo, e poi passa dall'atomo allo ione.

```interattivo
% nome: lewis-simboli-gruppo
% alt: A sinistra una tavola con gli elementi dei gruppi principali dei primi quattro periodi, da toccare per sceglierne uno. A destra il simbolo di Lewis dell'elemento scelto, in grande, con i puntini degli elettroni di valenza. Un selettore passa dall'atomo allo ione: nello ione i puntini spariscono o diventano otto, compaiono le parentesi quadre e la carica. Sotto si leggono il gruppo, la configurazione esterna, il numero di elettroni di valenza e, per lo ione, quanti elettroni l'atomo ha perso o acquistato
```

Scendendo lungo un gruppo il simbolo cambia lettera ma non puntini; spostandoti di una casella verso destra i puntini aumentano di uno. Passando allo ione, i metalli a sinistra perdono tutti i puntini, i non metalli a destra arrivano a otto.

## Gli ioni dei gruppi principali

I gas nobili hanno otto elettroni di valenza (due l'elio), con i sottolivelli $s$ e $p$ del livello esterno pieni, e non reagiscono quasi con niente: è una configurazione particolarmente stabile. Gli altri atomi tendono a raggiungerla, e un modo per farlo è perdere o acquistare elettroni fino ad avere la configurazione del gas nobile più vicino. È la regola dell'ottetto, che trovi nella lezione [Energia di legame e regola dell'ottetto](/materiale/scuola-superiore/chimica/i-legami-chimici/energia-di-legame-e-regola-dell-ottetto); qui serve per prevedere la carica degli ioni.

I metalli dei gruppi $1$ e $2$, e l'alluminio nel gruppo $13$, hanno pochi elettroni di valenza e li perdono tutti: diventano cationi con una carica uguale al numero di elettroni di valenza, e restano con la configurazione del gas nobile che li precede.

I non metalli dei gruppi $15$, $16$ e $17$ hanno il livello di valenza quasi pieno e acquistano gli elettroni che mancano per arrivare a otto: diventano anioni, con la configurazione del gas nobile che chiude il loro periodo.

| Gruppo | Elettroni di valenza | Che cosa fa l'atomo | Carica dello ione | Esempi |
|---|---|---|---|---|
| $1$ | $1$ | perde $1$ elettrone | $+1$ | $\mathrm{Li^+}$, $\mathrm{Na^+}$, $\mathrm{K^+}$ |
| $2$ | $2$ | perde $2$ elettroni | $+2$ | $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$ |
| $13$ | $3$ | perde $3$ elettroni | $+3$ | $\mathrm{Al^{3+}}$ |
| $15$ | $5$ | acquista $3$ elettroni | $-3$ | $\mathrm{N^{3-}}$, $\mathrm{P^{3-}}$ |
| $16$ | $6$ | acquista $2$ elettroni | $-2$ | $\mathrm{O^{2-}}$, $\mathrm{S^{2-}}$ |
| $17$ | $7$ | acquista $1$ elettrone | $-1$ | $\mathrm{F^-}$, $\mathrm{Cl^-}$, $\mathrm{Br^-}$ |

Mancano due gruppi. Il carbonio e il silicio, nel gruppo $14$, dovrebbero perdere o acquistare quattro elettroni, e di solito non formano ioni semplici: mettono gli elettroni in comune con altri atomi. I gas nobili del gruppo $18$ hanno già il livello pieno e non formano ioni. L'idrogeno, con un solo elettrone, può perderlo e diventare $\mathrm{H^+}$ oppure acquistarne uno e diventare lo ione idruro $\mathrm{H^-}$, con la configurazione dell'elio.

Nel simbolo di Lewis di un catione dei gruppi principali non restano puntini: si scrive il simbolo con la carica. Nel simbolo di un anione i puntini sono otto, in quattro coppie, chiusi tra parentesi quadre con la carica fuori.

```tikz
% nome: lewis-ioni-sodio-cloro
% alt: In alto il simbolo di Lewis del sodio, con un puntino, e una freccia con scritto perde 1 elettrone che porta allo ione sodio: il simbolo Na tra parentesi quadre, senza puntini, con la carica più. In basso il simbolo di Lewis del cloro, con tre coppie e un puntino singolo, e una freccia con scritto acquista 1 elettrone che porta allo ione cloruro: il simbolo Cl tra parentesi quadre con quattro coppie di puntini e la carica meno
% svg: lewis-ioni-sodio-cloro-eea0dec6.svg 223x110
\begin{tikzpicture}
\node at (0,0) {Na};
\node at (4.3,0) {Na};
\draw[thin] (3.78,-0.52) -- (3.68,-0.52) -- (3.68,0.52) -- (3.78,0.52);
\draw[thin] (4.82,-0.52) -- (4.92,-0.52) -- (4.92,0.52) -- (4.82,0.52);
\node[right] at (4.9,0.5) {\scriptsize $+$};
\node at (0,-1.6) {Cl};
\node at (4.3,-1.6) {Cl};
\draw[thin] (3.78,-2.12) -- (3.68,-2.12) -- (3.68,-1.08) -- (3.78,-1.08);
\draw[thin] (4.82,-2.12) -- (4.92,-2.12) -- (4.92,-1.08) -- (4.82,-1.08);
\node[right] at (4.9,-1.1) {\scriptsize $-$};
\foreach \x/\y in {0/0.34, -0.09/-1.26, 0.09/-1.26, 0.42/-1.69, 0.42/-1.52, -0.09/-1.94, 0.09/-1.94, -0.42/-1.6, 4.21/-1.26, 4.38/-1.26, 4.72/-1.69, 4.72/-1.52, 4.21/-1.94, 4.38/-1.94, 3.88/-1.69, 3.88/-1.52} \fill (\x,\y) circle (1.1pt);
\draw[-{Stealth}] (0.85,0) -- (3.35,0) node[midway, above] {\scriptsize perde $1$ elettrone};
\draw[-{Stealth}] (0.85,-1.6) -- (3.35,-1.6) node[midway, above] {\scriptsize acquista $1$ elettrone};
\end{tikzpicture}
```

```ad-example
Esempio 5: gli ioni del magnesio e dello zolfo
Quali ioni formano il magnesio e lo zolfo, e con quale configurazione?

Il magnesio, $[\text{Ne}]\,3s^2$, è nel gruppo $2$ e ha $2$ elettroni di valenza. Li perde tutti e due: diventa $\mathrm{Mg^{2+}}$, con configurazione $[\text{Ne}]$.

Lo zolfo, $[\text{Ne}]\,3s^2\,3p^4$, è nel gruppo $16$ e ha $6$ elettroni di valenza. Gliene mancano $8 - 6 = 2$ per arrivare a otto: li acquista e diventa $\mathrm{S^{2-}}$, con configurazione $[\text{Ne}]\,3s^2\,3p^6$, quella dell'argon.

```tikz
% nome: lewis-ioni-magnesio-zolfo
% alt: In alto il simbolo di Lewis del magnesio, con due puntini singoli, e una freccia con scritto perde 2 elettroni che porta allo ione magnesio: il simbolo Mg tra parentesi quadre, senza puntini, con la carica due più. In basso il simbolo di Lewis dello zolfo, con due coppie e due puntini singoli, e una freccia con scritto acquista 2 elettroni che porta allo ione solfuro: il simbolo S tra parentesi quadre con quattro coppie di puntini e la carica due meno
% svg: lewis-ioni-magnesio-zolfo-d8b22dff.svg 225x110
\begin{tikzpicture}
\node at (0,0) {Mg};
\node at (4.3,0) {Mg};
\draw[thin] (3.78,-0.52) -- (3.68,-0.52) -- (3.68,0.52) -- (3.78,0.52);
\draw[thin] (4.82,-0.52) -- (4.92,-0.52) -- (4.92,0.52) -- (4.82,0.52);
\node[right] at (4.9,0.5) {\scriptsize $2+$};
\node at (0,-1.6) {S};
\node at (4.3,-1.6) {S};
\draw[thin] (3.9,-2.12) -- (3.8,-2.12) -- (3.8,-1.08) -- (3.9,-1.08);
\draw[thin] (4.7,-2.12) -- (4.8,-2.12) -- (4.8,-1.08) -- (4.7,-1.08);
\node[right] at (4.78,-1.1) {\scriptsize $2-$};
\foreach \x/\y in {0/0.34, 0.42/0, -0.09/-1.26, 0.09/-1.26, 0.3/-1.69, 0.3/-1.52, 0/-1.94, -0.3/-1.6, 4.21/-1.26, 4.38/-1.26, 4.6/-1.69, 4.6/-1.52, 4.21/-1.94, 4.38/-1.94, 4/-1.69, 4/-1.52} \fill (\x,\y) circle (1.1pt);
\draw[-{Stealth}] (0.85,0) -- (3.35,0) node[midway, above] {\scriptsize perde $2$ elettroni};
\draw[-{Stealth}] (0.85,-1.6) -- (3.35,-1.6) node[midway, above] {\scriptsize acquista $2$ elettroni};
\end{tikzpicture}
```
```

```ad-example
Esempio 6: la carica dal posto nella tavola
Che ione forma l'elemento del periodo $4$ e del gruppo $2$? E quello del periodo $4$ e del gruppo $17$?

Il gruppo $2$ ha $2$ elettroni di valenza: l'elemento è un metallo, li perde e forma uno ione con carica $+2$. Nel periodo $4$ è il calcio: $\mathrm{Ca^{2+}}$.

Il gruppo $17$ ha $7$ elettroni di valenza: all'elemento ne manca $1$, lo acquista e forma uno ione con carica $-1$. Nel periodo $4$ è il bromo: $\mathrm{Br^-}$.
```

```ad-warning
Acquistare elettroni dà una carica negativa
Lo zolfo acquista due elettroni, e ogni elettrone porta una carica negativa: lo ione è $\mathrm{S^{2-}}$, non $\mathrm{S^{2+}}$. Un altro errore è usare gli elettroni di valenza come carica anche per i non metalli: il cloro ne ha $7$, ma non forma $\mathrm{Cl^{7+}}$. Gli costa molta meno energia acquistare un elettrone che perderne sette, e forma $\mathrm{Cl^-}$.
```

La regola funziona bene per i gruppi della tabella. I metalli di transizione e i metalli più pesanti del blocco $p$, come lo stagno e il piombo, formano spesso più di uno ione, e la loro carica non si prevede contando fino a otto: se ne occupa la lezione [Valenza e numero di ossidazione](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/valenza-e-numero-di-ossidazione). Come cationi e anioni si uniscono in un composto è l'argomento della lezione [Il legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico).
