# Il modello atomico di Bohr

Nel 1913 l'atomo di Rutherford aveva due problemi che nessuno sapeva risolvere. Un elettrone che gira attorno al nucleo, secondo la fisica dell'epoca, dovrebbe perdere energia e cadere sul nucleo, e invece gli atomi sono stabili (lezione [I modelli atomici di Thomson e di Rutherford](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/i-modelli-atomici-di-thomson-e-di-rutherford)). E un gas di idrogeno, quando emette luce, dà solo quattro righe nel visibile, sempre alle stesse lunghezze d'onda (lezione [La luce e gli spettri atomici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-luce-e-gli-spettri-atomici)). Il fisico danese Niels Bohr, che aveva lavorato con Rutherford a Manchester, risolse i due problemi insieme con un'idea presa dai quanti di Planck: nell'atomo anche l'energia dell'elettrone è quantizzata, cioè può avere solo certi valori.

## I postulati di Bohr

Bohr non dimostrò le sue ipotesi: le mise alla base del modello come postulati, e le giustificò con il fatto che i conti tornavano con lo spettro dell'idrogeno. Sono tre.

1. L'elettrone gira attorno al nucleo su orbite circolari, e finché resta su una di queste orbite non emette luce e non perde energia. Per questo si chiamano **orbite stazionarie**.
2. Le orbite permesse sono solo alcune. Ognuna ha un raggio e un'energia precisi, ed è indicata da un numero intero $n = 1, 2, 3, \dots$, il **numero quantico principale**. L'elettrone non può trovarsi tra un'orbita e l'altra.
3. L'elettrone può passare da un'orbita a un'altra con un **salto quantico**. Quando lo fa, assorbe o emette un fotone che ha esattamente l'energia che separa le due orbite.

```tikz
% nome: bohr-orbite-idrogeno
% alt: L'atomo di idrogeno secondo Bohr. Al centro il nucleo, e attorno quattro orbite circolari concentriche, indicate con n uguale a 1, 2, 3 e 4. I raggi crescono come il quadrato di n: la seconda orbita ha un raggio quattro volte la prima, la terza nove volte, la quarta sedici volte. L'elettrone è disegnato sulla prima orbita
\begin{tikzpicture}
\fill[red!70!black] (0,0) circle (0.07);
\foreach \n/\r in {1/0.2,2/0.8,3/1.8,4/3.2} \draw[thin] (0,0) circle (\r);
\draw[thin, fill=blue!10] (0.2,0) circle (0.07);
\node[above] at (0,0.2) {\scriptsize $n=1$};
\node[above] at (0,0.8) {\small $n=2$};
\node[above] at (0,1.8) {\small $n=3$};
\node[above] at (0,3.2) {\small $n=4$};
\draw[thin] (-0.04,-0.05) -- (-0.9,-1.25);
\node[below] at (-0.95,-1.2) {\small nucleo};
\end{tikzpicture}
```

Le orbite stanno a distanze fisse dal nucleo. Il raggio della prima, nell'idrogeno, è $52{,}9\,\text{pm}$, e quello delle altre cresce con il quadrato di $n$:

$$r_n = n^2 \cdot 52{,}9\,\text{pm}$$

La seconda orbita è a $4 \cdot 52{,}9 = 212\,\text{pm}$ dal nucleo, la terza a $9 \cdot 52{,}9 = 476\,\text{pm}$.

## I livelli di energia dell'idrogeno

A ogni orbita corrisponde un valore dell'energia dell'elettrone, un **livello di energia**. Per l'idrogeno Bohr trovò:

$$E_n = -\frac{2{,}18 \cdot 10^{-18}\,\text{J}}{n^2}$$

Il segno meno ha una ragione. Si prende come zero l'energia dell'elettrone fermo e lontanissimo dal nucleo, cioè libero. Un elettrone legato al nucleo ha meno energia di uno libero, perché per liberarlo bisogna dargliene: la sua energia è quindi negativa, e più l'elettrone è vicino al nucleo, più è negativa.

| Livello $n$ | Energia $E_n$ | Raggio dell'orbita |
|---|---|---|
| $1$ | $-2{,}18 \cdot 10^{-18}\,\text{J}$ | $52{,}9\,\text{pm}$ |
| $2$ | $-5{,}45 \cdot 10^{-19}\,\text{J}$ | $212\,\text{pm}$ |
| $3$ | $-2{,}42 \cdot 10^{-19}\,\text{J}$ | $476\,\text{pm}$ |
| $4$ | $-1{,}36 \cdot 10^{-19}\,\text{J}$ | $846\,\text{pm}$ |
| $5$ | $-8{,}72 \cdot 10^{-20}\,\text{J}$ | $1{,}32 \cdot 10^3\,\text{pm}$ |
| $6$ | $-6{,}06 \cdot 10^{-20}\,\text{J}$ | $1{,}90 \cdot 10^3\,\text{pm}$ |
| $\infty$ | $0$ | elettrone libero |

```tikz
% nome: bohr-livelli-energia-scala
% alt: I livelli di energia dell'idrogeno disegnati in scala su un asse verticale dell'energia. Il livello n uguale a 1 è in basso, molto distante dagli altri, a meno 2,18 per dieci alla meno diciotto joule. Il livello 2 è a tre quarti dell'altezza, a meno 5,45 per dieci alla meno diciannove joule. I livelli 3, 4, 5 e 6 sono sempre più vicini tra loro e si addensano sotto la linea tratteggiata dello zero, che corrisponde all'elettrone libero
\begin{tikzpicture}
\draw[-{Stealth}] (0,-7) -- (0,0.7) node[above] {\small energia};
\foreach \y in {-6.54,-1.635,-0.727,-0.409,-0.262,-0.182} \draw[thick] (0.6,\y) -- (3.6,\y);
\draw[thin, dashed] (0.6,0) -- (3.6,0);
\node[right] at (3.7,-6.54) {\small $n=1$ \quad $-2{,}18 \cdot 10^{-18}$ J};
\node[right] at (3.7,-1.635) {\small $n=2$ \quad $-5{,}45 \cdot 10^{-19}$ J};
\node[right] at (3.7,-0.78) {\small $n=3$ \quad $-2{,}42 \cdot 10^{-19}$ J};
\node[right] at (3.7,-0.3) {\small $n=4, 5, 6, \dots$};
\node[right] at (3.7,0.18) {\small $n=\infty$ \quad $0$};
\end{tikzpicture}
```

La figura mostra due cose. Il primo livello è molto più in basso degli altri: tra $n = 1$ e $n = 2$ ci sono tre quarti di tutta la scala. E i livelli, salendo, si infittiscono, perché $1/n^2$ cambia sempre meno al crescere di $n$.

```ad-example
Esempio 1: l'energia del terzo livello
Qual è l'energia dell'elettrone dell'idrogeno nel livello $n = 3$?

$$E_3 = -\frac{2{,}18 \cdot 10^{-18}\,\text{J}}{3^2} = -\frac{2{,}18 \cdot 10^{-18}\,\text{J}}{9} = -2{,}42 \cdot 10^{-19}\,\text{J}$$
```

```ad-warning
Si divide per n al quadrato
L'errore più frequente è dividere per $n$: l'energia del livello $2$ è un quarto di quella del livello $1$, non la metà, e quella del livello $3$ è un nono.
```

```ad-warning
Il livello più alto ha l'energia meno negativa
Con il segno meno i confronti si rovesciano: $-2{,}18 \cdot 10^{-18}\,\text{J}$ è meno di $-5{,}45 \cdot 10^{-19}\,\text{J}$, anche se il numero è più grande. Il livello $1$ è quello con meno energia, e salendo di livello l'energia cresce verso lo zero.
```

## Stato fondamentale e stati eccitati

L'elettrone dell'idrogeno sta di solito nel livello $n = 1$, quello con meno energia. È lo **stato fondamentale** dell'atomo, ed è stabile: sotto $n = 1$ non ci sono altri livelli in cui scendere, e per questo l'elettrone non cade sul nucleo.

Se l'atomo riceve energia, da un urto in una scarica elettrica, dal calore di una fiamma o da un fotone, l'elettrone può salire a un livello più alto. L'atomo è allora in uno **stato eccitato**. Ci resta per un tempo brevissimo, dell'ordine dei centesimi di milionesimo di secondo, poi l'elettrone torna giù, in un salto solo o in più salti, e a ogni salto emette un fotone.

Se l'energia ricevuta è abbastanza grande da portare l'elettrone fino a $n = \infty$, l'elettrone si stacca dall'atomo, che diventa uno ione $\mathrm{H^+}$: è la **ionizzazione**.

```ad-example
Esempio 2: l'energia di ionizzazione dell'idrogeno
Quanta energia serve per staccare l'elettrone da un atomo di idrogeno nello stato fondamentale? E per una mole di atomi?

L'elettrone deve passare da $n = 1$, dove ha energia $-2{,}18 \cdot 10^{-18}\,\text{J}$, a $n = \infty$, dove ha energia zero:

$$\Delta E = 0 - (-2{,}18 \cdot 10^{-18}\,\text{J}) = 2{,}18 \cdot 10^{-18}\,\text{J}$$

Per una mole di atomi:

$$2{,}18 \cdot 10^{-18}\,\text{J} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 1{,}31 \cdot 10^6\,\text{J/mol} = 1{,}31 \cdot 10^3\,\text{kJ/mol}$$

Il valore misurato, che trovi sulla [tavola periodica](/strumenti/tavola-periodica?elemento=H), è $1312\,\text{kJ/mol}$.
```

## I salti e le righe dello spettro

Il terzo postulato spiega le righe. Quando l'elettrone scende da un livello di partenza $n_i$ a un livello di arrivo $n_f$ più basso, l'atomo perde l'energia che separa i due livelli, e la emette come un solo fotone:

$$\Delta E = E_{n_i} - E_{n_f} \qquad \Delta E = h\,\nu = \frac{h\,c}{\lambda}$$

Poiché i livelli sono fissi, anche le differenze tra i livelli sono fisse: l'atomo può emettere solo fotoni di certe energie, cioè luce di certe lunghezze d'onda. Ogni riga dello spettro è un salto.

```tikz
% nome: bohr-emissione-assorbimento
% alt: Due schemi affiancati con due livelli di energia ciascuno. A sinistra, l'emissione: l'elettrone scende dal livello alto al livello basso, con una freccia verso il basso, e un fotone, disegnato come una freccia ondulata, esce dall'atomo. A destra, l'assorbimento: un fotone arriva sull'atomo e l'elettrone sale dal livello basso al livello alto, con una freccia verso l'alto
\begin{tikzpicture}
\draw[thick] (0,0) -- (2.6,0) node[right] {\small $n_f$};
\draw[thick] (0,1.8) -- (2.6,1.8) node[right] {\small $n_i$};
\draw[-{Stealth}, thick, blue] (1.0,1.8) -- (1.0,0.05);
\draw[thin, fill=blue!10] (1.0,1.8) circle (0.09);
\draw[thick, orange!90!black, -{Stealth}, decorate, decoration={snake, amplitude=2pt, segment length=7pt, post length=4pt}] (1.3,0.9) -- (3.2,0.9);
\node[above] at (2.4,1.0) {\small fotone};
\node[below] at (1.3,-0.15) {\small emissione};
\draw[thick] (5.6,0) -- (8.2,0) node[right] {\small $n_i$};
\draw[thick] (5.6,1.8) -- (8.2,1.8) node[right] {\small $n_f$};
\draw[-{Stealth}, thick, blue] (7.2,0) -- (7.2,1.75);
\draw[thin, fill=blue!10] (7.2,0) circle (0.09);
\draw[thick, orange!90!black, -{Stealth}, decorate, decoration={snake, amplitude=2pt, segment length=7pt, post length=4pt}] (4.9,0.9) -- (6.9,0.9);
\node[above] at (5.6,1.0) {\small fotone};
\node[below] at (6.9,-0.15) {\small assorbimento};
\end{tikzpicture}
```

Per calcolare la lunghezza d'onda di una riga:

1. si calcolano le energie dei due livelli con $E_n = -2{,}18 \cdot 10^{-18}\,\text{J}/n^2$;
2. si fa la differenza, dal livello più alto a quello più basso, che è positiva;
3. si ricava la lunghezza d'onda del fotone, $\lambda = \dfrac{h\,c}{\Delta E}$, e la si porta in nanometri.

```ad-example
Esempio 3: la riga rossa dell'idrogeno
Che lunghezza d'onda ha la luce emessa quando l'elettrone dell'idrogeno scende dal livello $3$ al livello $2$?

Le energie dei due livelli sono nella tabella: $E_3 = -2{,}42 \cdot 10^{-19}\,\text{J}$ e $E_2 = -5{,}45 \cdot 10^{-19}\,\text{J}$.

$$\Delta E = E_3 - E_2 = -2{,}42 \cdot 10^{-19}\,\text{J} - (-5{,}45 \cdot 10^{-19}\,\text{J}) = 3{,}03 \cdot 10^{-19}\,\text{J}$$

$$\lambda = \frac{h\,c}{\Delta E} = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{3{,}03 \cdot 10^{-19}\,\text{J}} = 6{,}56 \cdot 10^{-7}\,\text{m} = 656\,\text{nm}$$

È la riga rossa dello spettro dell'idrogeno, che si misura proprio a $656\,\text{nm}$.
```

Rifacendo il conto per i salti che arrivano al livello $2$ dai livelli $4$, $5$ e $6$ si ottengono le altre tre righe visibili:

| Salto | $\Delta E$ | $\lambda$ calcolata | $\lambda$ misurata | Colore |
|---|---|---|---|---|
| $3 \to 2$ | $3{,}03 \cdot 10^{-19}\,\text{J}$ | $656\,\text{nm}$ | $656\,\text{nm}$ | rosso |
| $4 \to 2$ | $4{,}09 \cdot 10^{-19}\,\text{J}$ | $486\,\text{nm}$ | $486\,\text{nm}$ | verde-azzurro |
| $5 \to 2$ | $4{,}58 \cdot 10^{-19}\,\text{J}$ | $434\,\text{nm}$ | $434\,\text{nm}$ | blu |
| $6 \to 2$ | $4{,}84 \cdot 10^{-19}\,\text{J}$ | $411\,\text{nm}$ | $410\,\text{nm}$ | violetto |

L'accordo è entro un nanometro, e la piccola differenza dell'ultima riga viene dalle costanti arrotondate a tre cifre. Fu questo accordo a convincere i fisici che l'idea di Bohr, per quanto strana, coglieva qualcosa di vero.

```ad-warning
Il salto più lungo dà la lunghezza d'onda più corta
Un salto tra livelli lontani libera più energia, e un fotone con più energia ha una lunghezza d'onda più corta. Il salto $6 \to 2$ dà la riga violetta a $411\,\text{nm}$, il salto $3 \to 2$ la riga rossa a $656\,\text{nm}$.
```

## Le serie di Lyman, Balmer e Paschen

Le righe dell'idrogeno si raggruppano in **serie**, una per ogni livello di arrivo.

- La **serie di Lyman** raccoglie i salti che arrivano a $n_f = 1$. Sono i salti più grandi, e le righe cadono nell'ultravioletto.
- La **serie di Balmer** raccoglie i salti che arrivano a $n_f = 2$. Le sue prime quattro righe sono quelle visibili della tabella.
- La **serie di Paschen** raccoglie i salti che arrivano a $n_f = 3$. Sono salti piccoli, e le righe cadono nell'infrarosso.

```tikz
% nome: bohr-serie-lyman-balmer-paschen
% alt: Schema non in scala dei livelli dell'idrogeno da n uguale a 1 a n uguale a 6, con i salti raggruppati in tre serie. A sinistra tre frecce lunghe scendono dai livelli 2, 3 e 4 al livello 1: serie di Lyman, ultravioletto. Al centro quattro frecce scendono dai livelli 3, 4, 5 e 6 al livello 2: serie di Balmer, visibile. A destra tre frecce corte scendono dai livelli 4, 5 e 6 al livello 3: serie di Paschen, infrarosso
\begin{tikzpicture}
\foreach \n/\y in {1/0,2/2.4,3/3.6,4/4.3,5/4.8,6/5.15} {
  \draw[thick] (0,\y) -- (8.4,\y);
  \node[left] at (0,\y) {\small $n=\n$};
}
\draw[thin, dashed] (0,5.7) -- (8.4,5.7);
\node[left] at (0,5.7) {\small $n=\infty$};
\foreach \x/\y in {0.7/2.4,1.3/3.6,1.9/4.3} \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- (\x,0.05);
\foreach \x/\y in {3.3/3.6,3.9/4.3,4.5/4.8,5.1/5.15} \draw[-{Stealth}, thick, green!50!black] (\x,\y) -- (\x,2.45);
\foreach \x/\y in {6.5/4.3,7.1/4.8,7.7/5.15} \draw[-{Stealth}, thick, red!70!black] (\x,\y) -- (\x,3.65);
\node[below] at (1.3,-0.1) {\small Lyman};
\node[below] at (1.3,-0.55) {\small ultravioletto};
\node[below] at (4.2,-0.1) {\small Balmer};
\node[below] at (4.2,-0.55) {\small visibile};
\node[below] at (7.1,-0.1) {\small Paschen};
\node[below] at (7.1,-0.55) {\small infrarosso};
\end{tikzpicture}
```

Le serie prendono il nome da chi le ha studiate. Lo svizzero Johann Balmer, un insegnante di matematica, nel 1885 aveva trovato per tentativi una formula che dava le quattro righe visibili, senza sapere perché funzionasse; Theodore Lyman e Friedrich Paschen trovarono le altre due serie all'inizio del Novecento. Il modello di Bohr le spiega tutte con la stessa formula dei livelli.

Nella figura qui sotto scegli il livello di partenza e quello di arrivo. La freccia mostra il salto, e nello spettro in basso compare la riga, con la sua lunghezza d'onda e la sua serie. Le righe che trovi restano segnate: prova a ricostruire tutta la serie di Balmer.

```interattivo
% nome: bohr-livelli-salto-riga
% alt: I livelli di energia dell'idrogeno da n uguale a 1 a n uguale a 6, non in scala, con le energie scritte accanto. Due cursori scelgono il livello di partenza e il livello di arrivo: una freccia collega i due livelli, verso il basso se l'atomo emette un fotone e verso l'alto se lo assorbe. Sotto, uno spettro su fondo nero che va dall'ultravioletto all'infrarosso, con la zona del visibile segnata: a ogni salto compare una riga alla sua lunghezza d'onda, colorata se è visibile, e le righe già trovate restano. Sotto si leggono la differenza di energia, la lunghezza d'onda e il nome della serie
```

Tutti i salti che arrivano al livello $1$ danno righe sotto i $122\,\text{nm}$, nell'ultravioletto; quelli che arrivano al livello $2$ partendo da $3$, $4$, $5$ e $6$ danno le quattro righe colorate; quelli che arrivano al livello $3$ finiscono oltre i $1000\,\text{nm}$, nell'infrarosso. Scambiando partenza e arrivo la riga resta dov'è.

## L'assorbimento

Il salto si può fare anche in salita. Un atomo nel livello $n_i$ passa a un livello più alto $n_f$ solo se riceve esattamente l'energia che li separa: un fotone con quell'energia viene assorbito, uno con un'energia diversa passa oltre senza effetto.

L'energia che separa due livelli è la stessa in salita e in discesa. Per questo le righe scure dello spettro di assorbimento cadono alle stesse lunghezze d'onda delle righe luminose dello spettro di emissione: sono gli stessi salti, percorsi nei due versi.

```ad-example
Esempio 4: un fotone che l'idrogeno assorbe
Che lunghezza d'onda deve avere un fotone per portare l'elettrone dell'idrogeno dallo stato fondamentale al livello $3$?

$$\Delta E = E_3 - E_1 = -2{,}42 \cdot 10^{-19}\,\text{J} - (-2{,}18 \cdot 10^{-18}\,\text{J}) = 1{,}94 \cdot 10^{-18}\,\text{J}$$

Per fare la differenza conviene scrivere le due energie con la stessa potenza di dieci: $-0{,}242 \cdot 10^{-18}$ e $-2{,}18 \cdot 10^{-18}$.

$$\lambda = \frac{h\,c}{\Delta E} = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{1{,}94 \cdot 10^{-18}\,\text{J}} = 1{,}03 \cdot 10^{-7}\,\text{m} = 103\,\text{nm}$$

È luce ultravioletta: è una riga della serie di Lyman. La luce visibile non ha abbastanza energia per eccitare un atomo di idrogeno che si trova nello stato fondamentale.
```

```ad-example
Esempio 5: dalla riga al salto
Una riga della serie di Balmer ha lunghezza d'onda $434\,\text{nm}$. Da quale livello è partito l'elettrone?

L'energia del fotone è

$$\Delta E = \frac{h\,c}{\lambda} = \frac{6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s} \cdot 3{,}00 \cdot 10^8\,\text{m/s}}{4{,}34 \cdot 10^{-7}\,\text{m}} = 4{,}58 \cdot 10^{-19}\,\text{J}$$

Nella serie di Balmer il livello di arrivo è il $2$, con energia $-5{,}45 \cdot 10^{-19}\,\text{J}$. Il livello di partenza sta più in alto di $\Delta E$:

$$E_{n_i} = -5{,}45 \cdot 10^{-19}\,\text{J} + 4{,}58 \cdot 10^{-19}\,\text{J} = -0{,}87 \cdot 10^{-19}\,\text{J}$$

Nella tabella dei livelli è l'energia di $n = 5$: la riga è il salto $5 \to 2$.
```

## I limiti del modello

Il modello di Bohr spiega la stabilità dell'atomo e dà le righe dell'idrogeno con una precisione che nel 1913 lasciò tutti stupiti. Ma resta un modello, e presto mostrò i suoi limiti.

- Funziona solo per l'idrogeno e per gli ioni con un solo elettrone, come $\mathrm{He^+}$ e $\mathrm{Li^{2+}}$. Già per l'elio, che di elettroni ne ha due, le righe calcolate non coincidono con quelle misurate.
- Non spiega perché alcune righe sono più intense di altre, né perché molte righe, guardate con uno spettroscopio più fine, si rivelano fatte di più righe vicinissime.
- Non spiega i suoi postulati. Perché sono permesse solo certe orbite? Perché su quelle l'elettrone non emette luce? Bohr lo assume, non lo ricava.
- Descrive l'elettrone come una pallina su un'orbita precisa. Pochi anni dopo si capì che per un elettrone una traiettoria precisa non esiste, come spiega la lezione [Dualismo onda-particella e principio di indeterminazione](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/dualismo-onda-particella-e-principio-di-indeterminazione).

Del modello di Bohr resta l'idea centrale, che la fisica successiva ha confermato: l'energia degli elettroni in un atomo è quantizzata, e la luce che un atomo emette o assorbe nasce dai salti tra i suoi livelli. Le orbite, invece, sono state abbandonate: al loro posto ci sono gli orbitali della lezione [Orbitali e numeri quantici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/orbitali-e-numeri-quantici). Come sono fatti i livelli negli atomi con più elettroni lo racconta la lezione [Livelli e sottolivelli di energia](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/livelli-e-sottolivelli-di-energia).
