# Il moto circolare uniforme

Il seggiolino di una ruota panoramica, la punta della lancetta dei secondi, una valvola della ruota di una bicicletta che corre a velocità costante: ognuno gira su una circonferenza e ogni giro dura lo stesso tempo. È il **moto circolare uniforme**, il moto di un punto che percorre una circonferenza con una velocità di modulo costante, cioè che percorre archi uguali in tempi uguali. È il più semplice dei moti che non stanno su una retta, e con lui si descrivono le ruote, gli ingranaggi, i satelliti.

## La velocità nel moto circolare uniforme

Come in ogni moto, la velocità istantanea è tangente alla traiettoria, come si è visto nella lezione [Spostamento e velocità nel piano](/materiale/scuola-superiore/fisica/i-moti-nel-piano/spostamento-e-velocita-nel-piano). La tangente a una circonferenza è perpendicolare al raggio nel punto di contatto: la velocità è quindi sempre perpendicolare al raggio.

```tikz
% nome: moto-circolare-velocita-tangente
% alt: Una circonferenza di centro O con un punto P disegnato in tre posizioni; in ognuna il raggio tratteggiato va da O al punto, e la velocità v, in blu scuro, è tangente alla circonferenza, perpendicolare al raggio, e ha sempre la stessa lunghezza ma una direzione diversa
% svg: moto-circolare-velocita-tangente-add27448.svg 146x157
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.5);
\fill (0,0) circle (1.5pt) node[above] {$O$};
\foreach \a in {20,135,250} {
  \draw[dashed, thin] (0,0) -- (\a:1.5);
  \fill (\a:1.5) circle (1.5pt);
  \draw[-{Stealth}, thick, blue!60!black] (\a:1.5) -- ($(\a:1.5)+(\a+90:1.1)$);
  \draw ($(\a:1.5)+(\a+180:0.2)$) -- ($(\a:1.5)+(\a+180:0.2)+(\a+90:0.2)$) -- ($(\a:1.5)+(\a+90:0.2)$);
}
\node[right] at ($(20:1.5)+(110:1.1)$) {$\vec{v}$};
\node[above left] at ($(135:1.5)+(225:1.1)$) {$\vec{v}$};
\node[below right] at ($(250:1.5)+(340:1.1)$) {$\vec{v}$};
\end{tikzpicture}
```

Nel moto circolare uniforme il modulo della velocità non cambia, ma la direzione sì, continuamente: la velocità, come vettore, non è costante. Per questo nel moto circolare uniforme c'è un'accelerazione, anche se il tachimetro segna sempre lo stesso valore; è l'argomento della lezione [L'accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta).

## Periodo e frequenza

Il moto circolare uniforme si ripete uguale a ogni giro: è un moto **periodico**. Il tempo di un giro completo è il **periodo** $T$, e si misura in secondi. Il numero di giri fatti in un secondo è la **frequenza** $f$:

$$f = \frac{1}{T} \qquad T = \frac{1}{f}$$

La frequenza si misura in giri al secondo, cioè in $1/\text{s}$, un'unità che si chiama **hertz** (simbolo $\text{Hz}$): $1\,\text{Hz} = 1\,\text{s}^{-1}$. Se un disco fa $5$ giri al secondo, $f = 5\,\text{Hz}$, e un giro dura $T = 1/5\,\text{s} = 0{,}2\,\text{s}$. Periodo e frequenza sono inversamente proporzionali: più giri al secondo vuol dire giri più brevi.

Per i motori e gli elettrodomestici si danno spesso i **giri al minuto**. Per passare alla frequenza si divide per $60$, perché un minuto ha $60$ secondi.

```ad-example
Esempio 1: la centrifuga di una lavatrice
Il cestello di una lavatrice in centrifuga fa $1400$ giri al minuto. Trova la frequenza e il periodo.

$$f = \frac{1400\ \text{giri}}{60\,\text{s}} = 23{,}33\ldots\,\text{Hz} \approx 23\,\text{Hz}$$

$$T = \frac{1}{f} = \frac{60\,\text{s}}{1400} = 0{,}04285\ldots\,\text{s} \approx 0{,}043\,\text{s}$$

Un giro dura poco più di quattro centesimi di secondo. I $1400$ giri al minuto sono un numero esatto, dato dal costruttore: i risultati sono arrotondati a due cifre solo per leggerli meglio.
```

```ad-warning
Periodo e frequenza non sono la stessa cosa
Il periodo è un tempo, la frequenza è un numero di giri al secondo, e sono uno l'inverso dell'altro. Una ruota con $T = 0{,}25\,\text{s}$ ha $f = 4\,\text{Hz}$, non $0{,}25\,\text{Hz}$. E i giri al minuto non sono hertz: prima si divide per $60$.
```

## La velocità tangenziale

In un periodo il punto fa un giro, cioè percorre tutta la circonferenza, lunga $2\pi r$ (la [lunghezza della circonferenza](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/lunghezza-della-circonferenza-e-area-del-cerchio)). Il modulo della velocità, che nel moto circolare si chiama **velocità tangenziale**, è quindi

$$v = \frac{2\pi r}{T} = 2\pi r f$$

```ad-example
Esempio 2: la ruota panoramica
Una ruota panoramica ha il raggio di $18\,\text{m}$ e fa un giro completo in $5{,}0\,\text{min}$. Con quale velocità si muove un seggiolino?

Il periodo in secondi è $T = 5{,}0 \cdot 60\,\text{s} = 300\,\text{s}$. Allora

$$v = \frac{2\pi r}{T} = \frac{2\pi \cdot 18\,\text{m}}{300\,\text{s}} = 0{,}376\ldots\,\text{m/s} \approx 0{,}38\,\text{m/s}$$

Meno di mezzo metro al secondo, più lento di una persona che cammina: per questo si sale e si scende senza fermare la ruota.
```

```ad-example
Esempio 3: la rotazione della Terra
La Terra fa un giro su sé stessa in circa $24\,\text{h}$, e il raggio all'equatore è $6{,}38 \cdot 10^6\,\text{m}$. Con quale velocità si muove un punto dell'equatore?

$T = 24 \cdot 3600\,\text{s} = 86\,400\,\text{s}$, e

$$v = \frac{2\pi \cdot 6{,}38 \cdot 10^6\,\text{m}}{86\,400\,\text{s}} = 463{,}9\ldots\,\text{m/s} \approx 464\,\text{m/s}$$

cioè circa $1{,}67 \cdot 10^3\,\text{km/h}$ (moltiplicando per $3{,}6$). Chi vive all'equatore gira con la Terra più veloce di un aereo di linea, senza accorgersene.
```

## Gli angoli in radianti

Mentre il punto gira, il raggio che lo congiunge al centro spazza un angolo. Nel moto circolare gli angoli si misurano di solito in **radianti**: la misura in radianti di un angolo al centro è il rapporto tra l'arco $l$ che l'angolo stacca sulla circonferenza e il raggio $r$,

$$\theta = \frac{l}{r}$$

Un angolo di $1\,\text{rad}$ è quello che stacca un arco lungo quanto il raggio. Il radiante è un rapporto tra due lunghezze, quindi un numero puro; si scrive $\text{rad}$ per ricordare che è un angolo. La lezione di matematica [Misura degli angoli: gradi e radianti](/materiale/scuola-superiore/matematica/goniometria/misura-degli-angoli-gradi-e-radianti) lo tratta per intero.

```tikz
% nome: radiante-arco-uguale-raggio
% alt: Una circonferenza di centro O e raggio r; due raggi formano un angolo al centro che stacca sulla circonferenza un arco, in arancione, lungo quanto il raggio: quell'angolo misura un radiante, circa 57 gradi
% svg: radiante-arco-uguale-raggio-9272368b.svg 155x125
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (1.6);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[thick] (0,0) -- (1.6,0);
\draw[thick] (0,0) -- (57.2958:1.6);
\draw[very thick, orange!90!black] (1.6,0) arc[start angle=0, end angle=57.2958, radius=1.6];
\draw (0.45,0) arc[start angle=0, end angle=57.2958, radius=0.45];
\node at (28.6:1.02) {\small $1$ rad};
\node[below] at (0.8,0) {$r$};
\node[above left] at (57.2958:0.8) {$r$};
\node[right] at (28.6:1.6) {$l = r$};
\end{tikzpicture}
```

Il giro completo stacca tutta la circonferenza, $l = 2\pi r$, quindi vale $2\pi r / r = 2\pi\,\text{rad}$. Da $360^\circ = 2\pi\,\text{rad}$ viene la regola per passare da una misura all'altra:

$$\theta_{\text{rad}} = \theta_{\text{gradi}} \cdot \frac{\pi}{180} \qquad \theta_{\text{gradi}} = \theta_{\text{rad}} \cdot \frac{180}{\pi}$$

e $1\,\text{rad} \approx 57{,}3^\circ$. Gli angoli che tornano più spesso:

| Gradi | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ | $360^\circ$ |
|---|---|---|---|---|---|---|
| Radianti | $\pi/6$ | $\pi/4$ | $\pi/3$ | $\pi/2$ | $\pi$ | $2\pi$ |

Con i radianti la lunghezza di un arco è $l = \theta\,r$: un angolo di $2{,}0\,\text{rad}$ su una circonferenza di raggio $0{,}50\,\text{m}$ stacca un arco di $1{,}0\,\text{m}$.

## La velocità angolare

Tutti i punti di una ruota che gira fanno un giro nello stesso tempo, ma quelli sul bordo percorrono più strada di quelli vicini al mozzo. Quello che hanno in comune è l'angolo spazzato ogni secondo: la **velocità angolare**

$$\omega = \frac{\Delta\theta}{\Delta t}$$

con l'angolo $\Delta\theta$ in radianti e il tempo in secondi; l'unità è il radiante al secondo, $\text{rad/s}$. Nel moto circolare uniforme in un periodo si spazza il giro intero, $2\pi\,\text{rad}$, quindi

$$\omega = \frac{2\pi}{T} = 2\pi f$$

```ad-example
Esempio 4: le lancette dell'orologio
Trova la velocità angolare della lancetta dei secondi e di quella dei minuti.

La lancetta dei secondi fa un giro in $60\,\text{s}$:

$$\omega = \frac{2\pi}{60\,\text{s}} = 0{,}1047\ldots\,\text{rad/s} \approx 0{,}105\,\text{rad/s}$$

La lancetta dei minuti fa un giro in un'ora, $3600\,\text{s}$:

$$\omega = \frac{2\pi}{3600\,\text{s}} = 1{,}745\ldots \cdot 10^{-3}\,\text{rad/s} \approx 1{,}75 \cdot 10^{-3}\,\text{rad/s}$$

sessanta volte meno. Il risultato non dipende dalla lunghezza della lancetta.
```

## Velocità tangenziale e velocità angolare

Dividendo $v = 2\pi r / T$ per $\omega = 2\pi / T$ si trova il legame tra le due velocità:

$$v = \omega\,r$$

A parità di velocità angolare la velocità tangenziale è direttamente proporzionale al raggio: su un disco che gira, un punto a distanza doppia dal centro va due volte più veloce.

```tikz
% nome: giostra-velocita-raggio
% alt: Un disco che gira attorno al centro O, visto dall'alto, con due punti sullo stesso raggio, uno a distanza r1 e uno a distanza r2, più grande; le loro velocità, in blu scuro, sono perpendicolari al raggio e la seconda è più lunga della prima, in proporzione alla distanza dal centro
% svg: giostra-velocita-raggio-29542bdd.svg 177x155
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (2);
\fill (0,0) circle (1.5pt) node[below] {$O$};
\draw[thin] (0,0) -- (2,0);
\fill (0.8,0) circle (1.5pt);
\fill (2,0) circle (1.5pt);
\draw[-{Stealth}, thick, blue!60!black] (0.8,0) -- (0.8,0.6);
\draw[-{Stealth}, thick, blue!60!black] (2,0) -- (2,1.5);
\node[left] at (0.8,0.45) {$\vec{v}_1$};
\node[right] at (2,1.2) {$\vec{v}_2$};
\node[below] at (0.8,0) {\small $r_1$};
\node[below right] at (2,0) {\small $r_2$};
\draw[-{Stealth}, thin] (-0.9,1.3) arc[start angle=125, end angle=165, radius=1.6];
\node at (-1.35,0.95) {\small $\omega$};
\end{tikzpicture}
```

```ad-example
Esempio 5: la ruota della bicicletta
La ruota di una bicicletta ha il raggio di $0{,}34\,\text{m}$ e fa $3{,}0$ giri al secondo. Trova la velocità angolare e la velocità di un punto del copertone rispetto al mozzo.

$$\omega = 2\pi f = 2\pi \cdot 3{,}0\,\text{Hz} = 18{,}84\ldots\,\text{rad/s} \approx 19\,\text{rad/s}$$

$$v = \omega\,r = 18{,}85\,\text{rad/s} \cdot 0{,}34\,\text{m} = 6{,}40\ldots\,\text{m/s} \approx 6{,}4\,\text{m/s}$$

circa $23\,\text{km/h}$: se la ruota non slitta, è anche la velocità della bicicletta. Nel prodotto $\omega\,r$ il radiante non si scrive nell'unità del risultato, perché è un numero puro: $\text{rad/s} \cdot \text{m} = \text{m/s}$.
```

```ad-example
Esempio 6: due bambini sulla giostra
Una giostra fa un giro in $6{,}0\,\text{s}$. Anna è seduta a $1{,}0\,\text{m}$ dal centro, Bruno a $2{,}5\,\text{m}$. Trova le velocità angolari e tangenziali dei due bambini.

La velocità angolare è la stessa per tutti e due, perché girano insieme alla giostra:

$$\omega = \frac{2\pi}{6{,}0\,\text{s}} = 1{,}047\ldots\,\text{rad/s} \approx 1{,}0\,\text{rad/s}$$

Le velocità tangenziali sono diverse:

$$
\begin{gathered}
v_A = \omega\,r_A = 1{,}047\,\text{rad/s} \cdot 1{,}0\,\text{m} \approx 1{,}0\,\text{m/s} \\
v_B = \omega\,r_B = 1{,}047\,\text{rad/s} \cdot 2{,}5\,\text{m} = 2{,}61\ldots\,\text{m/s} \approx 2{,}6\,\text{m/s}
\end{gathered}
$$

Bruno è $2{,}5$ volte più lontano dal centro e va $2{,}5$ volte più veloce.
```

```ad-warning
In $v = \omega\,r$ l'angolo va in radianti
La formula $v = \omega\,r$ vale solo con $\omega$ in $\text{rad/s}$. Con i giri al secondo o con i gradi al secondo il risultato è sbagliato: per la ruota dell'esempio 5, $3{,}0 \cdot 0{,}34 = 1{,}0$ darebbe una velocità più di sei volte troppo piccola. Prima si passa ai radianti, con $\omega = 2\pi f$.
```

Nella figura qui sotto un punto gira su una circonferenza: cambi il raggio e il periodo, e leggi l'angolo spazzato in radianti, la velocità angolare e la velocità tangenziale.

```interattivo
% nome: moto-circolare-radianti
% alt: Un punto che gira in senso antiorario su una circonferenza, con la velocità tangente in blu scuro; il raggio che lo congiunge al centro spazza un angolo, segnato da un arco arancione sulla circonferenza. Due cursori cambiano il raggio e il periodo, e un bottone avvia o ferma il moto; sotto sono scritti l'angolo in radianti e in gradi, l'arco percorso, la velocità angolare e la velocità tangenziale
```
