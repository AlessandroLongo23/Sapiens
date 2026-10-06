# La configurazione elettronica

Un atomo di sodio ha undici elettroni, uno di ferro ventisei. Non possono stare tutti nell'orbitale con meno energia: si distribuiscono nei sottolivelli seguendo tre regole, e il risultato si chiama **configurazione elettronica**. Dalla configurazione dipendono il posto dell'elemento nella tavola periodica, gli ioni che forma e i legami che fa.

## Come si scrive una configurazione

Ogni sottolivello occupato si scrive con il numero del livello, la lettera del sottolivello e, in alto a destra, il numero di elettroni che contiene. L'idrogeno, con il suo unico elettrone nel sottolivello $1s$, ha configurazione $1s^1$, che si legge "uno esse uno".

```tikz
% nome: configurazione-notazione-sottolivello
% alt: La scrittura 2p con esponente 4, in grande, con tre linee che ne spiegano le parti: il 2 è il livello, la lettera p è il sottolivello, l'esponente 4 è il numero di elettroni che il sottolivello contiene
\begin{tikzpicture}
\node[scale=2.4] at (0,0) {$2p^4$};
\draw[thin] (-0.5,-0.3) -- (-1.2,-0.9) node[below left] {\small livello $n = 2$};
\draw[thin] (0.0,-0.5) -- (0.0,-1.4) node[below] {\small sottolivello $p$};
\draw[thin] (0.65,0.4) -- (1.3,0.8) node[right] {\small $4$ elettroni};
\end{tikzpicture}
```

I sottolivelli si scrivono uno dopo l'altro: $1s^2\,2s^2\,2p^4$ è la configurazione di un atomo con due elettroni nell'$1s$, due nel $2s$ e quattro nel $2p$. La somma degli esponenti è il numero totale di elettroni, qui $2 + 2 + 4 = 8$: è l'ossigeno.

Quanti elettroni può contenere ogni sottolivello lo sai dalle lezioni [Livelli e sottolivelli di energia](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/livelli-e-sottolivelli-di-energia) e [Orbitali e numeri quantici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/orbitali-e-numeri-quantici): due per ogni orbitale.

| Sottolivello | Orbitali | Elettroni al massimo |
|---|---|---|
| $s$ | $1$ | $2$ |
| $p$ | $3$ | $6$ |
| $d$ | $5$ | $10$ |
| $f$ | $7$ | $14$ |

## L'ordine di riempimento

Lo stato di un atomo con la minore energia possibile si chiama stato fondamentale, ed è quello che la configurazione descrive. Per trovarlo si immagina di costruire l'atomo aggiungendo gli elettroni uno alla volta. Il **principio di Aufbau** (in tedesco *Aufbau* vuol dire "costruzione") dice che ogni elettrone va nel sottolivello libero con meno energia, e che un sottolivello comincia a riempirsi solo quando quelli che hanno meno energia sono pieni.

L'ordine delle energie non è quello dei livelli: il sottolivello $4s$ ha meno energia del $3d$, e si riempie prima. Per ricordare l'ordine c'è la **regola della diagonale**. Si scrivono i sottolivelli in righe, un livello per riga, e si leggono lungo le diagonali, dall'alto verso il basso.

```tikz
% nome: configurazione-regola-diagonale
% alt: La regola della diagonale. I sottolivelli sono scritti in sette righe, una per livello: 1s; 2s 2p; 3s 3p 3d; 4s 4p 4d 4f; 5s 5p 5d 5f; 6s 6p 6d; 7s 7p. Otto frecce blu parallele li attraversano in diagonale, dall'alto a destra verso il basso a sinistra. Leggendo le frecce una dopo l'altra dall'alto si ottiene l'ordine di riempimento: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s, 5f, 6d, 7p
\begin{tikzpicture}[x=1.15cm, y=0.72cm]
\foreach \s/\a/\b in {1/0/0, 2/0/0, 3/1/0, 4/1/0, 5/2/0, 6/2/0, 7/3/0, 8/3/1}
  \draw[-{Stealth}, blue!50] ({\a+0.42},{\a+0.42-\s}) -- ({\b-0.5},{\b-0.5-\s});
\foreach \n/\l/\name in {1/0/1s, 2/0/2s, 2/1/2p, 3/0/3s, 3/1/3p, 3/2/3d, 4/0/4s, 4/1/4p, 4/2/4d, 4/3/4f, 5/0/5s, 5/1/5p, 5/2/5d, 5/3/5f, 6/0/6s, 6/1/6p, 6/2/6d, 7/0/7s, 7/1/7p}
  \node at (\l,-\n) {$\name$};
\end{tikzpicture}
```

Seguendo le frecce si ottiene l'ordine di riempimento:

$$1s \to 2s \to 2p \to 3s \to 3p \to 4s \to 3d \to 4p \to 5s \to 4d$$

$$\to 5p \to 6s \to 4f \to 5d \to 6p \to 7s \to 5f \to 6d \to 7p$$

Per scrivere la configurazione di un atomo neutro:

1. Trova il numero di elettroni: è il numero atomico $Z$.
2. Riempi i sottolivelli nell'ordine della diagonale, ognuno fino al suo massimo ($2$, $6$, $10$ o $14$ elettroni).
3. Metti nell'ultimo sottolivello gli elettroni che restano.
4. Controlla che la somma degli esponenti sia $Z$.

```ad-example
Esempio 1: la configurazione del fosforo
Il fosforo ha $Z = 15$, quindi $15$ elettroni.

I primi quattro sottolivelli si riempiono: $1s^2\,2s^2\,2p^6\,3s^2$, in tutto $2 + 2 + 6 + 2 = 12$ elettroni. Ne restano $15 - 12 = 3$, che vanno nel $3p$.

$$\mathrm{P}: \quad 1s^2\,2s^2\,2p^6\,3s^2\,3p^3$$

Controllo: $2 + 2 + 6 + 2 + 3 = 15$.
```

```ad-example
Esempio 2: la configurazione del ferro
Il ferro ha $Z = 26$.

Fino al $3p$ pieno gli elettroni sono $2 + 2 + 6 + 2 + 6 = 18$. Dopo il $3p$ la diagonale dà il $4s$, che ne prende $2$: siamo a $20$. I $6$ che restano vanno nel $3d$.

$$\mathrm{Fe}: \quad 1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,4s^2\,3d^6$$

Controllo: $18 + 2 + 6 = 26$.
```

```ad-warning
Dopo il 3p viene il 4s, non il 3d
L'errore più frequente è riempire il terzo livello tutto di seguito e scrivere per il ferro $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,3d^8$. Il $3d$ comincia a riempirsi solo dopo il $4s$. Un secondo errore è sbagliare il massimo di un sottolivello: nel $p$ stanno $6$ elettroni, non $8$.
```

```ad-note
Due modi di ordinare la scrittura
Alcuni libri, dopo aver riempito i sottolivelli, li riscrivono in ordine di livello: per il ferro $1s^2\,2s^2\,2p^6\,3s^2\,3p^6\,3d^6\,4s^2$. La configurazione è la stessa. In queste lezioni, come nella [tavola periodica](/strumenti/tavola-periodica?elemento=Fe) del sito, i sottolivelli restano nell'ordine in cui si riempiono.
```

## Diagrammi a caselle e principio di Pauli

La configurazione dice quanti elettroni ha ogni sottolivello, ma non come sono disposti nei suoi orbitali. Per mostrarlo si usa il **diagramma a caselle**: ogni casella è un orbitale, ogni freccia un elettrone. La freccia verso l'alto e quella verso il basso sono i due valori dello spin, $m_s = +\frac{1}{2}$ e $m_s = -\frac{1}{2}$. Un sottolivello $s$ ha una casella, un $p$ ne ha tre unite, un $d$ cinque.

Il **principio di esclusione di Pauli** dice che in un atomo non ci sono due elettroni con gli stessi quattro numeri quantici. Due elettroni nella stessa casella hanno già uguali $n$, $l$ e $m_l$, quindi devono avere spin diverso: una casella contiene al massimo due frecce, una verso l'alto e una verso il basso. Due elettroni così si dicono appaiati.

```tikz
% nome: configurazione-caselle-idrogeno-elio
% alt: Due diagrammi a caselle. Per l'idrogeno, configurazione 1s1, una casella con una sola freccia verso l'alto. Per l'elio, configurazione 1s2, una casella con due frecce, una verso l'alto e una verso il basso
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/0, 0/-1.25} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.5/0, 0.34/-1.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {0.66/-1.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node at (0.5,0.95) {\small $1s$};
\node[right] at (1.3,0) {\small idrogeno, $1s^1$};
\node[right] at (1.3,-1.25) {\small elio, $1s^2$};
\end{tikzpicture}
```

## La regola di Hund

Nei sottolivelli $p$, $d$ e $f$ ci sono più orbitali con la stessa energia, e bisogna decidere in quale casella va ogni elettrone. La **regola di Hund** dice che gli elettroni di uno stesso sottolivello occupano prima una casella ciascuno, tutti con lo stesso spin, e si appaiano solo quando ogni casella ha già un elettrone. Il motivo è la repulsione: due elettroni in orbitali diversi stanno più lontani tra loro, e l'atomo ha meno energia.

```tikz
% nome: configurazione-caselle-secondo-periodo
% alt: I diagrammi a caselle di sei elementi del secondo periodo, uno per riga: boro, carbonio, azoto, ossigeno, fluoro, neon. Ogni riga ha una casella per l'1s e una per il 2s, tutte e due con due frecce opposte, e tre caselle unite per il 2p. Nel 2p il boro ha una freccia, il carbonio due frecce in due caselle diverse, l'azoto tre frecce in tre caselle, tutte verso l'alto; l'ossigeno ha una coppia e due frecce singole, il fluoro due coppie e una freccia singola, il neon tre coppie
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/0, 1.45/0, 2.9/0, 3.9/0, 4.9/0, 0/-1.25, 1.45/-1.25, 2.9/-1.25, 3.9/-1.25, 4.9/-1.25, 0/-2.5, 1.45/-2.5, 2.9/-2.5, 3.9/-2.5, 4.9/-2.5, 0/-3.75, 1.45/-3.75, 2.9/-3.75, 3.9/-3.75, 4.9/-3.75, 0/-5, 1.45/-5, 2.9/-5, 3.9/-5, 4.9/-5, 0/-6.25, 1.45/-6.25, 2.9/-6.25, 3.9/-6.25, 4.9/-6.25} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.34/0, 1.79/0, 3.4/0, 0.34/-1.25, 1.79/-1.25, 3.4/-1.25, 4.4/-1.25, 0.34/-2.5, 1.79/-2.5, 3.4/-2.5, 4.4/-2.5, 5.4/-2.5, 0.34/-3.75, 1.79/-3.75, 3.24/-3.75, 4.4/-3.75, 5.4/-3.75, 0.34/-5, 1.79/-5, 3.24/-5, 4.24/-5, 5.4/-5, 0.34/-6.25, 1.79/-6.25, 3.24/-6.25, 4.24/-6.25, 5.24/-6.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {0.66/0, 2.11/0, 0.66/-1.25, 2.11/-1.25, 0.66/-2.5, 2.11/-2.5, 0.66/-3.75, 2.11/-3.75, 3.56/-3.75, 0.66/-5, 2.11/-5, 3.56/-5, 4.56/-5, 0.66/-6.25, 2.11/-6.25, 3.56/-6.25, 4.56/-6.25, 5.56/-6.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node[left] at (-0.25,0) {B};
\node at (0.5,0.95) {\small $1s$};
\node at (1.95,0.95) {\small $2s$};
\node at (4.4,0.95) {\small $2p$};
\node[left] at (-0.25,-1.25) {C};
\node[left] at (-0.25,-2.5) {N};
\node[left] at (-0.25,-3.75) {O};
\node[left] at (-0.25,-5) {F};
\node[left] at (-0.25,-6.25) {Ne};
\end{tikzpicture}
```

Un elettrone che sta da solo nel suo orbitale è un **elettrone spaiato**. Dal diagramma si contano: il carbonio ne ha due, l'azoto tre, l'ossigeno di nuovo due, il neon nessuno.

```ad-example
Esempio 3: il diagramma a caselle dell'ossigeno
L'ossigeno ha $Z = 8$ e configurazione $1s^2\,2s^2\,2p^4$.

L'$1s$ e il $2s$ hanno una casella ciascuno, con due elettroni appaiati. Nel $2p$ gli elettroni sono quattro e le caselle tre: i primi tre elettroni vanno uno per casella, con lo stesso spin; il quarto si appaia con il primo.

```tikz
% nome: configurazione-caselle-ossigeno
% alt: Il diagramma a caselle dell'ossigeno: una casella per l'1s e una per il 2s, ognuna con due frecce opposte, e tre caselle unite per il 2p, la prima con due frecce opposte, la seconda e la terza con una sola freccia verso l'alto
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/0, 1.45/0, 2.9/0, 3.9/0, 4.9/0} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.34/0, 1.79/0, 3.24/0, 4.4/0, 5.4/0} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {0.66/0, 2.11/0, 3.56/0} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node[left] at (-0.25,0) {O};
\node at (0.5,0.95) {\small $1s$};
\node at (1.95,0.95) {\small $2s$};
\node at (4.4,0.95) {\small $2p$};
\end{tikzpicture}
```

Restano due caselle con una freccia sola: l'ossigeno ha $2$ elettroni spaiati.
```

```ad-warning
Non appaiare gli elettroni troppo presto
Per il $2p^2$ del carbonio una sola disposizione è giusta: due frecce in due caselle diverse, con lo stesso verso. Mettere i due elettroni nella stessa casella, o in due caselle con versi opposti, viola la regola di Hund. Due frecce con lo stesso verso nella stessa casella violano il principio di Pauli, e non si scrivono mai.
```

```tikz
% nome: configurazione-caselle-errori
% alt: Quattro modi di disporre due elettroni nelle tre caselle di un sottolivello 2p. Il primo è giusto: due frecce verso l'alto in due caselle diverse. Il secondo viola la regola di Hund: due frecce opposte nella stessa casella, con due caselle vuote. Il terzo viola la regola di Hund: due frecce in caselle diverse, una verso l'alto e una verso il basso. Il quarto viola il principio di Pauli: due frecce verso l'alto nella stessa casella. Le caselle sbagliate sono colorate
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/-1.25, 0/-2.5, 1/-2.5, 0/-3.75} \draw[thin, fill=red!15] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0/0, 1/0, 2/0, 1/-1.25, 2/-1.25, 2/-2.5, 1/-3.75, 2/-3.75} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.5/0, 1.5/0, 0.34/-1.25, 0.5/-2.5, 0.34/-3.75, 0.66/-3.75} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {0.66/-1.25, 1.5/-2.5} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node at (1.5,0.95) {\small $2p$};
\node[right] at (3.3,0) {\small giusto};
\node[right] at (3.3,-1.25) {\small viola Hund: appaiati troppo presto};
\node[right] at (3.3,-2.5) {\small viola Hund: spin non paralleli};
\node[right] at (3.3,-3.75) {\small viola Pauli: stesso spin};
\end{tikzpicture}
```

Nella figura qui sotto il diagramma lo riempi tu. Scegli un elemento, poi tocca le caselle per aggiungere frecce verso l'alto o verso il basso: la figura controlla le tre regole e ti dice quale stai violando.

```interattivo
% nome: configurazione-caselle-riempi
% alt: Un diagramma a caselle da riempire, con le caselle dei sottolivelli 1s, 2s, 2p, 3s, 3p, 4s e 3d. Si sceglie un elemento tra i primi trenta e si aggiungono o si tolgono frecce verso l'alto e verso il basso toccando le caselle. Sotto si leggono la configurazione che corrisponde al diagramma e il numero di elettroni messi. La figura segnala in colore le caselle che violano il principio di Pauli, la regola di Hund o l'ordine di riempimento, e dice quando il diagramma è quello dello stato fondamentale
```

All'inizio la figura mostra un carbonio con i due elettroni del $2p$ nella stessa casella, e segnala la regola di Hund: spostandone uno in una casella vuota, con lo stesso verso dell'altro, l'avviso sparisce. Se provi a mettere un elettrone nel $3d$ con il $4s$ ancora vuoto, la figura segnala l'ordine di riempimento.

## La configurazione abbreviata

Scrivere tutti i sottolivelli di un atomo grande è lungo, e i primi sono sempre gli stessi. Gli elettroni interni di un atomo hanno la configurazione del gas nobile che lo precede nella tavola periodica: nella **configurazione abbreviata** al loro posto si scrive il simbolo di quel gas nobile tra parentesi quadre, e poi i sottolivelli che restano.

| Gas nobile | $Z$ | Dopo la parentesi si riparte da |
|---|---|---|
| $\mathrm{He}$ | $2$ | $2s$ |
| $\mathrm{Ne}$ | $10$ | $3s$ |
| $\mathrm{Ar}$ | $18$ | $4s$ |
| $\mathrm{Kr}$ | $36$ | $5s$ |
| $\mathrm{Xe}$ | $54$ | $6s$ |
| $\mathrm{Rn}$ | $86$ | $7s$ |

Il sodio, $1s^2\,2s^2\,2p^6\,3s^1$, ha i primi dieci elettroni disposti come quelli del neon, e si scrive $[\text{Ne}]\,3s^1$. Il ferro dell'esempio 2 diventa $[\text{Ar}]\,4s^2\,3d^6$.

```ad-example
Esempio 4: la configurazione abbreviata del bromo
Il bromo ha $Z = 35$.

Il gas nobile che lo precede è l'argon, con $18$ elettroni. Ne restano $35 - 18 = 17$, da mettere a partire dal $4s$: $2$ nel $4s$, $10$ nel $3d$ e gli ultimi $5$ nel $4p$.

$$\mathrm{Br}: \quad [\text{Ar}]\,4s^2\,3d^{10}\,4p^5$$

Controllo: $18 + 2 + 10 + 5 = 35$.
```

```ad-example
Esempio 5: dalla configurazione all'elemento
Quale elemento ha configurazione $[\text{Ar}]\,4s^2\,3d^{10}\,4p^3$?

L'argon tra parentesi vale $18$ elettroni. In tutto sono $18 + 2 + 10 + 3 = 33$. Un atomo neutro con $33$ elettroni ha $Z = 33$: è l'arsenico.
```

```ad-warning
Tra parentesi va il gas nobile che viene prima
Il gas nobile della configurazione abbreviata è quello con il numero atomico più grande tra quelli minori di $Z$, cioè l'ultimo elemento del periodo precedente. Per il bromo è l'argon, non il kripton, che chiude il periodo del bromo e ha un elettrone in più.
```

Gli elettroni scritti dopo la parentesi sono quelli che contano nella chimica dell'elemento: tra loro ci sono gli elettroni di valenza, di cui parla la lezione [Elettroni di valenza e simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis).

## Le eccezioni: cromo e rame

La regola della diagonale dà la configurazione giusta per quasi tutti gli elementi, ma non per tutti. Tra i primi $36$ le eccezioni sono due.

| Elemento | $Z$ | Con la regola della diagonale | Configurazione vera |
|---|---|---|---|
| cromo | $24$ | $[\text{Ar}]\,4s^2\,3d^4$ | $[\text{Ar}]\,4s^1\,3d^5$ |
| rame | $29$ | $[\text{Ar}]\,4s^2\,3d^9$ | $[\text{Ar}]\,4s^1\,3d^{10}$ |

In tutti e due i casi un elettrone che la regola metterebbe nel $4s$ sta nel $3d$. Le energie del $4s$ e del $3d$ sono molto vicine, e un sottolivello $d$ pieno a metà (cinque elettroni, uno per casella) o pieno (dieci) è una disposizione particolarmente stabile: all'atomo conviene avere il $3d$ così, anche lasciando il $4s$ con un solo elettrone.

```tikz
% nome: configurazione-caselle-cromo-rame
% alt: I diagrammi a caselle del cromo e del rame, limitati ai sottolivelli 4s e 3d. Il cromo ha una freccia nella casella del 4s e cinque frecce verso l'alto, una per casella, nelle cinque caselle del 3d. Il rame ha una freccia nella casella del 4s e cinque coppie di frecce nelle cinque caselle del 3d
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/0, 1.45/0, 2.45/0, 3.45/0, 4.45/0, 5.45/0, 0/-1.25, 1.45/-1.25, 2.45/-1.25, 3.45/-1.25, 4.45/-1.25, 5.45/-1.25} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.5/0, 1.95/0, 2.95/0, 3.95/0, 4.95/0, 5.95/0, 0.5/-1.25, 1.79/-1.25, 2.79/-1.25, 3.79/-1.25, 4.79/-1.25, 5.79/-1.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {2.11/-1.25, 3.11/-1.25, 4.11/-1.25, 5.11/-1.25, 6.11/-1.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node[left] at (-0.25,0) {Cr};
\node at (0.5,0.95) {\small $4s$};
\node at (3.95,0.95) {\small $3d$};
\node[left] at (-0.25,-1.25) {Cu};
\end{tikzpicture}
```

La regola della diagonale è una regola pratica, non una legge: le configurazioni vere si ricavano dagli spettri degli atomi. Più in basso nella tavola periodica le eccezioni sono più numerose; il molibdeno e l'argento, per esempio, si comportano come il cromo e il rame, che stanno sopra di loro. Per ogni elemento la configurazione vera è nella tabella dello strumento [Orbitali atomici](/strumenti/orbitali-atomici).

## La configurazione degli ioni

Uno ione ha un numero di elettroni diverso dal numero di protoni (lezione [Numero atomico, numero di massa e isotopi](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/numero-atomico-numero-di-massa-e-isotopi)): un anione con carica $-1$ ha un elettrone in più dell'atomo, un catione con carica $+2$ ne ha due in meno.

Per un **anione** gli elettroni in più si aggiungono continuando l'ordine di riempimento. Il cloro è $[\text{Ne}]\,3s^2\,3p^5$; lo ione cloruro $\mathrm{Cl^-}$ ha un elettrone in più, che completa il $3p$:

$$\mathrm{Cl^-}: \quad [\text{Ne}]\,3s^2\,3p^6$$

Per un **catione** gli elettroni si tolgono a partire dal livello più esterno, quello con $n$ più grande. Il sodio è $[\text{Ne}]\,3s^1$; lo ione $\mathrm{Na^+}$ perde l'elettrone del $3s$ e resta $[\text{Ne}]$, cioè $1s^2\,2s^2\,2p^6$.

Atomi e ioni con lo stesso numero di elettroni e la stessa configurazione si dicono **isoelettronici**. Gli ioni $\mathrm{O^{2-}}$, $\mathrm{F^-}$, $\mathrm{Na^+}$ e $\mathrm{Mg^{2+}}$ hanno tutti $10$ elettroni e sono isoelettronici con il neon; restano ioni di elementi diversi, perché il numero di protoni non cambia.

```ad-example
Esempio 6: due ioni isoelettronici con l'argon
Scrivi la configurazione di $\mathrm{S^{2-}}$ e di $\mathrm{Ca^{2+}}$.

Lo zolfo ha $Z = 16$ e configurazione $[\text{Ne}]\,3s^2\,3p^4$. Lo ione $\mathrm{S^{2-}}$ ha $16 + 2 = 18$ elettroni: i due in più completano il $3p$, e la configurazione è $[\text{Ne}]\,3s^2\,3p^6$.

Il calcio ha $Z = 20$ e configurazione $[\text{Ar}]\,4s^2$. Lo ione $\mathrm{Ca^{2+}}$ ha $20 - 2 = 18$ elettroni: perde i due del $4s$ e resta $[\text{Ar}]$.

Le due configurazioni sono la stessa, perché $[\text{Ne}]\,3s^2\,3p^6$ è proprio quella dell'argon.
```

Nei metalli di transizione il livello più esterno è quello del sottolivello $s$, anche se si è riempito prima del $d$. Il ferro, $[\text{Ar}]\,4s^2\,3d^6$, ha come elettroni più esterni i due del $4s$, che appartengono al quarto livello; i sei del $3d$ sono del terzo. Quando diventa uno ione, il ferro perde prima gli elettroni del $4s$, poi quelli del $3d$.

```ad-example
Esempio 7: gli ioni del ferro
Scrivi la configurazione di $\mathrm{Fe^{2+}}$ e di $\mathrm{Fe^{3+}}$.

L'atomo di ferro è $[\text{Ar}]\,4s^2\,3d^6$. Lo ione $\mathrm{Fe^{2+}}$ ha due elettroni in meno, e sono i due del $4s$:

$$\mathrm{Fe^{2+}}: \quad [\text{Ar}]\,3d^6$$

Lo ione $\mathrm{Fe^{3+}}$ ne perde un terzo, che viene dal $3d$:

$$\mathrm{Fe^{3+}}: \quad [\text{Ar}]\,3d^5$$

```tikz
% nome: configurazione-caselle-ioni-ferro
% alt: I diagrammi a caselle dei sottolivelli 4s e 3d per l'atomo di ferro e per i suoi due ioni. Nell'atomo il 4s ha due frecce opposte e il 3d ha una coppia e quattro frecce singole. Nello ione con carica più due il 4s è vuoto e il 3d è uguale a quello dell'atomo. Nello ione con carica più tre il 4s è vuoto e il 3d ha cinque frecce singole, una per casella
\begin{tikzpicture}[x=0.62cm, y=0.62cm]
\foreach \x/\y in {0/0, 1.45/0, 2.45/0, 3.45/0, 4.45/0, 5.45/0, 0/-1.25, 1.45/-1.25, 2.45/-1.25, 3.45/-1.25, 4.45/-1.25, 5.45/-1.25, 0/-2.5, 1.45/-2.5, 2.45/-2.5, 3.45/-2.5, 4.45/-2.5, 5.45/-2.5} \draw[thin] (\x,\y-0.5) rectangle +(1,1);
\foreach \x/\y in {0.34/0, 1.79/0, 2.95/0, 3.95/0, 4.95/0, 5.95/0, 1.79/-1.25, 2.95/-1.25, 3.95/-1.25, 4.95/-1.25, 5.95/-1.25, 1.95/-2.5, 2.95/-2.5, 3.95/-2.5, 4.95/-2.5, 5.95/-2.5} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y-0.32) -- +(0,0.64);
\foreach \x/\y in {0.66/0, 2.11/0, 2.11/-1.25} \draw[-{Stealth[length=3.2pt]}, thick] (\x,\y+0.32) -- +(0,-0.64);
\node[left] at (-0.25,0) {Fe};
\node at (0.5,0.95) {\small $4s$};
\node at (3.95,0.95) {\small $3d$};
\node[left] at (-0.25,-1.25) {Fe$^{2+}$};
\node[left] at (-0.25,-2.5) {Fe$^{3+}$};
\end{tikzpicture}
```

Controllo: $\mathrm{Fe^{2+}}$ ha $18 + 6 = 24$ elettroni, cioè $26 - 2$; $\mathrm{Fe^{3+}}$ ne ha $18 + 5 = 23$, cioè $26 - 3$.
```

```ad-warning
Uno ione non ha la configurazione dell'atomo con gli stessi elettroni
Lo ione $\mathrm{Fe^{2+}}$ ha $24$ elettroni come l'atomo di cromo, ma la sua configurazione è $[\text{Ar}]\,3d^6$, non $[\text{Ar}]\,4s^1\,3d^5$. Nei metalli di transizione gli elettroni si tolgono dal $4s$ prima che dal $3d$, quindi non si può riscrivere la configurazione da capo con meno elettroni. L'errore opposto è toglierli dal $3d$ perché è scritto per ultimo, e ottenere $[\text{Ar}]\,4s^2\,3d^4$.
```
