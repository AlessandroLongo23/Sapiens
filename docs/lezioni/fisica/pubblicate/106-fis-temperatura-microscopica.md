# Temperatura ed energia cinetica delle molecole

Finora la [temperatura](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-temperatura-e-le-scale-termometriche) è stata il numero che si legge su un termometro. La teoria cinetica dice che cosa misura quel numero dentro il gas: l'energia cinetica media delle sue molecole. Scaldare un gas vuol dire far correre di più le sue molecole, e in questa lezione si calcola di quanto.

## L'energia cinetica media di una molecola

Per lo stesso gas abbiamo due espressioni del prodotto $p\,V$. La [teoria cinetica](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas) lo ricava dagli urti delle $N$ molecole, di massa $m$ e velocità quadratica media $v_{qm}$; l'[equazione di stato del gas perfetto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) lo lega alla temperatura assoluta $T$:

$$p\,V = \frac{1}{3}\,N\,m\,v_{qm}^2 \qquad\qquad p\,V = N\,k_B\,T$$

I due secondi membri sono uguali. Semplificando $N$ e moltiplicando per $\frac{3}{2}$:

$$\frac{1}{3}\,m\,v_{qm}^2 = k_B\,T \qquad\Rightarrow\qquad \frac{1}{2}\,m\,v_{qm}^2 = \frac{3}{2}\,k_B\,T$$

A sinistra c'è un'[energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica). Poiché $v_{qm}^2$ è la media dei quadrati delle velocità, $\frac{1}{2}\,m\,v_{qm}^2$ è la media delle energie cinetiche $\frac{1}{2}\,m\,v^2$ delle singole molecole: è l'**energia cinetica media** di una molecola, che indichiamo con $K_m$.

$$K_m = \frac{3}{2}\,k_B\,T$$

con la costante di Boltzmann $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$ e la temperatura in kelvin. È il risultato centrale della teoria cinetica, e dice tre cose.

- La temperatura assoluta di un gas perfetto è direttamente proporzionale all'energia cinetica media delle sue molecole. La temperatura è una misura dell'agitazione delle molecole, che per questo si chiama agitazione termica.
- Nella formula non compare la massa della molecola e nemmeno il tipo di gas: alla stessa temperatura le molecole di elio, di azoto e di anidride carbonica hanno la stessa energia cinetica media.
- Allo zero assoluto, $T = 0\,\text{K}$, l'energia cinetica media sarebbe nulla e le molecole sarebbero ferme. È il significato dello [zero assoluto](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/le-leggi-di-gay-lussac) nel modello: non esiste una temperatura più bassa perché non esiste un'energia cinetica minore di zero.

```tikz
% nome: grafico-energia-cinetica-media-temperatura
% alt: Grafico dell'energia cinetica media di una molecola in funzione della temperatura assoluta: una retta che passa per l'origine. Sono segnati due punti: a 293 kelvin l'energia è 6,07 per 10 alla meno 21 joule, a 586 kelvin, il doppio, è 12,1 per 10 alla meno 21 joule
% svg: grafico-energia-cinetica-media-temperatura-4e6da16b.svg 258x208
% poi-interattivo: trascinare un punto lungo la retta e leggere la temperatura in kelvin e in gradi Celsius e l'energia cinetica media
\begin{tikzpicture}[scale=0.72]
\draw[gray!25, very thin] (0,0) grid (7,5);
\draw[->] (0,0) -- (7.4,0);
\node[below] at (6.9,-0.45) {$T$ (K)};
\draw[->] (0,0) -- (0,5.4) node[above] {$K_m$ ($10^{-21}$ J)};
\foreach \x/\t in {1/100,2/200,3/300,4/400,5/500,6/600} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/3,2/6,3/9,4/12,5/15} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60] (0,0) -- (7,4.83);
\draw[dashed, thin] (2.93,0) -- (2.93,2.022) -- (0,2.022);
\draw[dashed, thin] (5.86,0) -- (5.86,4.043) -- (0,4.043);
\fill (2.93,2.022) circle (0.06);
\fill (5.86,4.043) circle (0.06);
\node[above left, inner sep=2pt] at (2.93,2.022) {\small $A$};
\node[above left, inner sep=2pt] at (5.86,4.043) {\small $B$};
\end{tikzpicture}
```

Nel grafico il punto $A$ è l'aria di una stanza a $293\,\text{K}$, il punto $B$ un gas a temperatura assoluta doppia: gli esempi 1 e 2 ne calcolano le coordinate.

```ad-example
Esempio 1: l'energia cinetica media a temperatura ambiente
Quanto vale l'energia cinetica media di una molecola dell'aria in una stanza a $20\,^\circ\text{C}$?

La temperatura va in kelvin: $T = 20 + 273 = 293\,\text{K}$.

$$K_m = \frac{3}{2}\,k_B\,T = \frac{3}{2} \cdot 1{,}38 \cdot 10^{-23}\,\text{J/K} \cdot 293\,\text{K} = 6{,}065\ldots \cdot 10^{-21}\,\text{J} \approx 6{,}07 \cdot 10^{-21}\,\text{J}$$

Il risultato vale per le molecole di azoto, per quelle di ossigeno e per ogni altro gas alla stessa temperatura. È un'energia piccolissima perché la molecola è piccolissima; moltiplicata per le $6{,}02 \cdot 10^{23}$ molecole di una mole dà $3{,}65 \cdot 10^{3}\,\text{J}$.
```

```ad-warning
La temperatura è in kelvin
Nella formula $K_m = \frac{3}{2}\,k_B\,T$ la temperatura è quella assoluta. Con $20$ al posto di $293$ l'energia dell'esempio 1 verrebbe quasi quindici volte più piccola, e a $0\,^\circ\text{C}$ verrebbe zero, come se nel ghiaccio che fonde le molecole fossero ferme.
```

```ad-example
Esempio 2: raddoppiare l'energia cinetica media
Un gas è a $20\,^\circ\text{C}$. A quale temperatura l'energia cinetica media delle sue molecole è doppia?

$K_m$ è proporzionale alla temperatura assoluta, quindi deve raddoppiare quella:

$$T_2 = 2 \cdot 293\,\text{K} = 586\,\text{K} \qquad\Rightarrow\qquad t_2 = 586 - 273 = 313\,^\circ\text{C}$$

Servono $313\,^\circ\text{C}$, non $40\,^\circ\text{C}$. Passando da $20\,^\circ\text{C}$ a $40\,^\circ\text{C}$ la temperatura assoluta va da $293\,\text{K}$ a $313\,\text{K}$, e l'energia cinetica media aumenta solo del $7\%$ circa.
```

```ad-note
Da dove viene la costante di Boltzmann
La costante $k_B$ è la costante dei gas divisa per il numero di Avogadro: $k_B = R / N_A$. È la costante dei gas riferita a una molecola invece che a una mole, e con i valori $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ e $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$ dà appunto $1{,}38 \cdot 10^{-23}\,\text{J/K}$.
```

## La velocità quadratica media dalla temperatura

Dalla relazione $\frac{1}{2}\,m\,v_{qm}^2 = \frac{3}{2}\,k_B\,T$ si ricava la velocità quadratica media:

$$v_{qm} = \sqrt{\frac{3\,k_B\,T}{m}}$$

Di solito è più comodo usare la massa molare $M$ al posto della massa $m$ di una molecola. Moltiplicando numeratore e denominatore per il numero di Avogadro, $k_B\,N_A = R$ e $m\,N_A = M$:

$$v_{qm} = \sqrt{\frac{3\,R\,T}{M}}$$

con $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ e $M$ in chilogrammi per mole.

```ad-example
Esempio 3: le molecole di azoto in una stanza
Quanto vale la velocità quadratica media delle molecole di azoto, $M = 28{,}0\,\text{g/mol}$, a $20\,^\circ\text{C}$?

Con $T = 293\,\text{K}$ e $M = 28{,}0 \cdot 10^{-3}\,\text{kg/mol}$:

$$v_{qm} = \sqrt{\frac{3\,R\,T}{M}} = \sqrt{\frac{3 \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 293\,\text{K}}{28{,}0 \cdot 10^{-3}\,\text{kg/mol}}} = \sqrt{2{,}609 \cdot 10^{5}\,\text{m}^2/\text{s}^2} = 510{,}7\ldots\,\text{m/s} \approx 511\,\text{m/s}$$

È dello stesso ordine della velocità trovata per l'aria dalla pressione e dalla densità nella [lezione precedente](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-teoria-cinetica-dei-gas), circa $500\,\text{m/s}$.
```

```ad-warning
La massa molare in chilogrammi per mole
Con $M = 28{,}0$ lasciato in grammi per mole la velocità dell'esempio 3 verrebbe $16\,\text{m/s}$, quella di un'auto in città. Il controllo è l'ordine di grandezza: a temperatura ambiente le molecole dei gas comuni vanno a centinaia di metri al secondo.
```

### Molecole leggere, molecole veloci

Alla stessa temperatura tutte le molecole hanno la stessa energia cinetica media $\frac{1}{2}\,m\,v_{qm}^2$. Se la massa è più piccola, deve essere più grande la velocità: $v_{qm}$ è inversamente proporzionale alla radice quadrata della massa molare.

| Gas | $M$ (g/mol) | $v_{qm}$ a $293\,\text{K}$ (m/s) |
|---|---|---|
| idrogeno $\mathrm{H_2}$ | $2{,}02$ | $1900$ |
| elio $\mathrm{He}$ | $4{,}00$ | $1350$ |
| vapore d'acqua $\mathrm{H_2O}$ | $18{,}0$ | $637$ |
| azoto $\mathrm{N_2}$ | $28{,}0$ | $511$ |
| ossigeno $\mathrm{O_2}$ | $32{,}0$ | $478$ |
| anidride carbonica $\mathrm{CO_2}$ | $44{,}0$ | $407$ |

```ad-example
Esempio 4: elio e azoto alla stessa temperatura
Un palloncino contiene elio ($M = 4{,}00\,\text{g/mol}$) alla stessa temperatura dell'aria che lo circonda. Quante volte sono più veloci gli atomi di elio delle molecole di azoto ($M = 28{,}0\,\text{g/mol}$)?

Nel rapporto tra le due velocità $R$ e $T$ si semplificano, e resta il rapporto delle masse molari, rovesciato e sotto radice:

$$\frac{v_{qm,\text{He}}}{v_{qm,\text{N}_2}} = \sqrt{\frac{M_{\text{N}_2}}{M_{\text{He}}}} = \sqrt{\frac{28{,}0}{4{,}00}} = \sqrt{7{,}00} = 2{,}645\ldots \approx 2{,}65$$

Gli atomi di elio hanno una massa sette volte più piccola e sono $2{,}65$ volte più veloci, non sette: così il prodotto $m\,v_{qm}^2$ è lo stesso per i due gas. Non serve conoscere la temperatura, e le masse molari possono restare in grammi per mole, perché conta solo il loro rapporto.
```

### La velocità cresce con la radice della temperatura

L'energia cinetica media è proporzionale a $T$; la velocità quadratica media, che sta sotto radice, cresce più lentamente.

```tikz
% nome: grafico-velocita-quadratica-media-temperatura
% alt: Grafico della velocità quadratica media in funzione della temperatura assoluta per l'elio e per l'azoto: due curve che partono dall'origine e salgono sempre meno ripide. Quella dell'elio è più alta: a 300 kelvin vale circa 1370 metri al secondo e a 600 kelvin circa 1930; quella dell'azoto vale circa 517 metri al secondo a 300 kelvin e 731 a 600 kelvin
% svg: grafico-velocita-quadratica-media-temperatura-9b368135.svg 247x208
% poi-interattivo: scegliere il gas e trascinare un punto lungo la curva per leggere temperatura e velocità quadratica media
\begin{tikzpicture}[scale=0.72]
\draw[gray!25, very thin] (0,0) grid (7,5);
\draw[->] (0,0) -- (7.4,0);
\node[below] at (6.9,-0.45) {$T$ (K)};
\draw[->] (0,0) -- (0,5.4) node[above] {$v_{qm}$ (m/s)};
\foreach \x/\t in {1/100,2/200,3/300,4/400,5/500,6/600} \node[below] at (\x,0) {\small $\t$};
\foreach \y/\t in {1/400,2/800,3/1200,4/1600,5/2000} \node[left] at (0,\y) {\small $\t$};
\draw[thick, blue!60, domain=0:6.6, samples=80, smooth] plot (\x, {1.9737*sqrt(\x)});
\draw[thick, orange!90!black, domain=0:6.6, samples=80, smooth] plot (\x, {0.746*sqrt(\x)});
\node[above left, blue!60!black] at (5.2,4.5) {elio};
\node[above, orange!90!black] at (5.2,1.75) {azoto};
\fill (3,3.4185) circle (0.06);
\fill (6,4.8346) circle (0.06);
\fill (3,1.2921) circle (0.06);
\fill (6,1.8273) circle (0.06);
\end{tikzpicture}
```

```ad-warning
Temperatura doppia non vuol dire velocità doppia
Se la temperatura assoluta raddoppia, raddoppia l'energia cinetica media, ma la velocità quadratica media aumenta solo di $\sqrt{2} \approx 1{,}41$ volte: per l'azoto da $517\,\text{m/s}$ a $300\,\text{K}$ a $731\,\text{m/s}$ a $600\,\text{K}$. Per raddoppiare la velocità la temperatura assoluta deve diventare quattro volte più grande.
```

```ad-example
Esempio 5: la temperatura dalla velocità
In una bombola gli atomi di elio ($M = 4{,}00\,\text{g/mol}$) hanno velocità quadratica media $1{,}37 \cdot 10^{3}\,\text{m/s}$. Qual è la temperatura del gas? A quale temperatura la velocità quadratica media sarebbe il doppio?

Dalla formula $v_{qm}^2 = 3\,R\,T / M$ si ricava la temperatura:

$$T = \frac{M\,v_{qm}^2}{3\,R} = \frac{4{,}00 \cdot 10^{-3}\,\text{kg/mol} \cdot (1{,}37 \cdot 10^{3}\,\text{m/s})^2}{3 \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} = 301{,}1\ldots\,\text{K} \approx 301\,\text{K}$$

cioè $28\,^\circ\text{C}$. Per avere una velocità doppia la temperatura assoluta deve essere quattro volte più grande: $4 \cdot 301\,\text{K} \approx 1{,}20 \cdot 10^{3}\,\text{K}$, più di $900\,^\circ\text{C}$.
```

## Non tutte alla stessa velocità: la distribuzione di Maxwell

La velocità quadratica media è una media. In ogni istante nel gas ci sono molecole quasi ferme e molecole molto più veloci di $v_{qm}$, e a ogni urto ciascuna cambia velocità. Quello che resta stabile, finché la temperatura non cambia, è il modo in cui le velocità sono distribuite: quante molecole hanno una velocità tra $0$ e $100\,\text{m/s}$, quante tra $100$ e $200\,\text{m/s}$, e così via. Con classi sempre più strette l'[istogramma](/materiale/scuola-superiore/matematica/statistica/dati-frequenze-e-grafici) delle velocità diventa una curva, la **distribuzione di Maxwell**, che James Clerk Maxwell ricavò nel 1860. La sua formula richiede strumenti di matematica degli anni successivi; qui interessa la sua forma.

```tikz
% nome: distribuzione-maxwell-tre-velocita
% alt: La distribuzione di Maxwell delle velocità delle molecole di azoto a 300 kelvin: una curva a campana asimmetrica che parte da zero, sale fino a un massimo a 422 metri al secondo e scende con una coda lunga verso le velocità alte. Tre linee verticali segnano la velocità più probabile a 422 metri al secondo, la velocità media a 476 e la velocità quadratica media a 517
% svg: distribuzione-maxwell-tre-velocita-471b2a5a.svg 238x217
\begin{tikzpicture}[x=0.82cm]
\draw[->] (0,0) -- (7.4,0);
\node[below] at (6.6,-0.45) {$v$ (m/s)};
\draw[->] (0,0) -- (0,4.3) node[above right, inner sep=1pt] {\small numero di molecole};
\foreach \x/\t in {1/200,2/400,3/600,4/800,5/1000,6/1200} {
  \draw[thin] (\x,0.06) -- (\x,-0.06);
  \node[below] at (\x,-0.06) {\small $\t$};
}
\draw[thick, blue!60, domain=0:7, samples=100, smooth] plot (\x, {2.198*\x*\x*exp(-0.22461*\x*\x)});
\draw[dashed, thin] (2.11,0) -- (2.11,3.6);
\draw[dashed, thin] (2.38,0) -- (2.38,3.49);
\draw[thick, orange!90!black] (2.585,0) -- (2.585,3.27);
\draw[thin] (2.11,3.45) -- (4.1,3.85) node[right, inner sep=1pt] {\small $v_p = 422$};
\draw[thin] (2.38,2.85) -- (4.1,3.25) node[right, inner sep=1pt] {\small $\bar v = 476$};
\draw[thin, orange!90!black] (2.585,2.25) -- (4.1,2.65) node[right, inner sep=1pt] {\small $v_{qm} = 517$};
\end{tikzpicture}
```

La curva parte da zero, sale fino a un massimo e poi scende lentamente, con una coda lunga dalla parte delle velocità alte: le molecole ferme sono pochissime, quelle molto veloci sono poche ma ci sono. Sulla curva si leggono tre velocità diverse:

- la **velocità più probabile** $v_p$, sotto il massimo della curva, è quella intorno a cui si trovano più molecole;
- la **velocità media** $\bar v$ è un po' più grande, perché la coda di destra sposta la media;
- la **velocità quadratica media** $v_{qm}$ è la più grande delle tre, perché nella media dei quadrati le molecole veloci pesano ancora di più.

Si dimostra che $v_p \approx 0{,}82\,v_{qm}$ e $\bar v \approx 0{,}92\,v_{qm}$, qualunque siano il gas e la temperatura. Per l'azoto a $300\,\text{K}$ le tre velocità sono $422$, $476$ e $517\,\text{m/s}$.

### Che cosa cambia con la temperatura

Se il gas si scalda, il massimo si sposta verso velocità più alte e la curva si allarga e si abbassa. L'area sotto la curva non può cambiare, perché rappresenta il numero totale di molecole, che sono sempre le stesse.

```tikz
% nome: distribuzione-maxwell-due-temperature
% alt: Le distribuzioni di Maxwell delle velocità delle molecole di azoto a due temperature. A 300 kelvin la curva è alta e stretta, con il massimo a circa 420 metri al secondo; a 900 kelvin è più bassa e più larga, con il massimo a circa 730 metri al secondo e una coda che supera i 1500 metri al secondo
% svg: distribuzione-maxwell-due-temperature-bb2615ba.svg 234x217
% poi-interattivo: cambiare la temperatura con un cursore e vedere la curva che si allarga e si abbassa, con l'area che resta uguale
\begin{tikzpicture}[x=0.9cm]
\draw[->] (0,0) -- (6.6,0);
\node[below] at (5.9,-0.45) {$v$ (m/s)};
\draw[->] (0,0) -- (0,4.3) node[above right, inner sep=1pt] {\small numero di molecole};
\foreach \x/\t in {1/300,2/600,3/900,4/1200,5/1500,6/1800} {
  \draw[thin] (\x,0.06) -- (\x,-0.06);
  \node[below] at (\x,-0.06) {\small $\t$};
}
\draw[thick, blue!60, domain=0:6.2, samples=100, smooth] plot (\x, {4.946*\x*\x*exp(-0.5054*\x*\x)});
\draw[thick, orange!90!black, domain=0:6.2, samples=100, smooth] plot (\x, {0.9521*\x*\x*exp(-0.16849*\x*\x)});
\node[right, blue!60!black] at (1.9,3.3) {$300$ K};
\node[above right, orange!90!black] at (3.2,1.75) {$900$ K};
\end{tikzpicture}
```

Con la massa succede il contrario: a parità di temperatura un gas di molecole più pesanti ha la curva più stretta, più alta e spostata verso le velocità basse.

Nella figura qui sotto ci sono sessanta atomi di un gas nobile in una scatola, con l'istogramma delle loro velocità e la curva di Maxwell alla stessa temperatura. Scegli il gas e la temperatura e avvia il moto. Prima di farlo prova a prevedere: se la temperatura passa da $150\,\text{K}$ a $600\,\text{K}$, di quanto aumenta la velocità quadratica media? E se cambi il neon con il kripton, che ha atomi quattro volte più pesanti, che cosa succede all'energia cinetica media?

```interattivo
% nome: maxwell-velocita-temperatura
% alt: Una scatola con sessanta atomi di un gas nobile in moto e, sotto, l'istogramma delle loro velocità da 0 a 1800 metri al secondo con sovrapposta la curva di Maxwell. Un cursore cambia la temperatura da 150 a 600 kelvin e un selettore sceglie il gas tra neon, argon e kripton: scaldando il gas, o scegliendo atomi più leggeri, l'istogramma si sposta verso destra, si allarga e si abbassa. Una linea segna la velocità quadratica media; sotto sono scritte la velocità quadratica media e l'energia cinetica media
```

Da $150\,\text{K}$ a $600\,\text{K}$ la temperatura assoluta diventa quattro volte più grande e la velocità quadratica media raddoppia: per il neon da $430\,\text{m/s}$ a $861\,\text{m/s}$. Cambiando il gas a temperatura fissata le velocità cambiano, ma l'energia cinetica media no: a $300\,\text{K}$ vale $6{,}21 \cdot 10^{-21}\,\text{J}$ per tutti e tre. L'istogramma oscilla intorno alla curva perché gli atomi sono solo sessanta; in un gas vero sono tanti che la curva è seguita con una precisione altissima.

### La coda delle molecole veloci

Le poche molecole molto più veloci della media spiegano fatti che la sola velocità quadratica media non spiega.

- L'[evaporazione](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente) avviene a qualunque temperatura perché anche in un liquido le velocità sono distribuite: le molecole più veloci vicino alla superficie riescono a sfuggire. Quelle che restano sono in media più lente, e il liquido si raffredda.
- L'atmosfera della Terra contiene pochissimo idrogeno e pochissimo elio. Alla stessa temperatura sono i gas con le molecole più veloci, e nell'alta atmosfera una piccola parte di esse supera la [velocità di fuga](/materiale/scuola-superiore/fisica/la-gravitazione/l-energia-potenziale-gravitazionale-e-la-velocita-di-fuga), $11{,}2\,\text{km/s}$: in miliardi di anni questi gas si sono dispersi nello spazio. Azoto e ossigeno, più lenti, sono rimasti.

## L'energia cinetica di tutte le molecole

L'energia cinetica media di una molecola, moltiplicata per il numero di molecole, dà l'energia cinetica complessiva del moto di agitazione termica. Con $N = n\,N_A$ e $k_B\,N_A = R$:

$$K_{tot} = N\,K_m = \frac{3}{2}\,N\,k_B\,T = \frac{3}{2}\,n\,R\,T$$

```ad-example
Esempio 6: l'energia cinetica di una mole di gas
Quanto vale l'energia cinetica complessiva delle molecole di $1{,}00\,\text{mol}$ di gas a $20\,^\circ\text{C}$? Da che altezza dovrebbe cadere un corpo di $1{,}00\,\text{kg}$ per arrivare al suolo con la stessa energia cinetica?

$$K_{tot} = \frac{3}{2}\,n\,R\,T = \frac{3}{2} \cdot 1{,}00\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot 293\,\text{K} = 3652{,}2\ldots\,\text{J} \approx 3{,}65 \cdot 10^{3}\,\text{J}$$

Per il corpo che cade, $m\,g\,h = K_{tot}$ dà

$$h = \frac{K_{tot}}{m\,g} = \frac{3652\,\text{J}}{1{,}00\,\text{kg} \cdot 9{,}8\,\text{m/s}^2} = 372{,}6\ldots\,\text{m} \approx 3{,}7 \cdot 10^{2}\,\text{m}$$

Una mole di gas a temperatura ambiente, che occupa circa $24\,\text{L}$ e ha una massa di pochi grammi o di poche decine di grammi, ha nel moto disordinato delle sue molecole l'energia di un chilogrammo caduto da quasi quattrocento metri.
```

Questa energia è il punto di partenza della lezione sull'[energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna).

```ad-note
Che cosa conta in $K_m$
L'energia $\frac{3}{2}\,k_B\,T$ è l'energia cinetica del moto di traslazione, cioè dello spostamento della molecola nel suo insieme. Le molecole fatte di più atomi, come $\mathrm{N_2}$ e $\mathrm{O_2}$, possono anche ruotare, e hanno per questo altra energia: se ne parla nella lezione [I calori molari dei gas](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/i-calori-molari-dei-gas). Le formule di questa lezione per $K_m$ e per $v_{qm}$ valgono comunque per tutti i gas perfetti.
```

```ad-note
Una sola molecola non ha una temperatura
La temperatura è legata a una media su moltissime molecole. Di una singola molecola si può dire la velocità e l'energia cinetica, che cambiano a ogni urto, ma non la temperatura: è una proprietà dell'insieme.
```
