# La quantità di moto

Una palla da tennis che arriva a $10\,\text{m/s}$ si ferma con una mano. Una palla da bowling alla stessa velocità no, e nemmeno la stessa palla da tennis servita a $200\,\text{km/h}$. Quanto è difficile fermare un corpo, o deviarlo, dipende insieme dalla sua massa e dalla sua velocità. La grandezza che le mette insieme è la quantità di moto: con lei il secondo principio della dinamica prende la forma in cui Newton lo ha scritto, e da lei parte lo studio degli urti.

## La definizione

La **quantità di moto** di un corpo di massa $m$ che si muove con velocità $\vec v$ è il vettore

$$\vec p = m\,\vec v$$

La massa è un numero positivo, quindi $\vec p$ ha la stessa direzione e lo stesso verso della velocità, e modulo $p = m\,v$. L'unità di misura non ha un nome proprio: è il chilogrammo per metro al secondo, $\text{kg} \cdot \text{m/s}$. Un corpo fermo ha quantità di moto nulla, qualunque sia la sua massa.

A parità di velocità la quantità di moto è direttamente proporzionale alla massa, e a parità di massa alla velocità: un corpo ha una grande quantità di moto perché è molto massiccio, perché è molto veloce, o per tutte e due le ragioni.

```ad-example
Esempio 1: un pallone e un'automobile
Quanto vale la quantità di moto di un pallone di $0{,}43\,\text{kg}$ calciato a $25\,\text{m/s}$? E quella di un'automobile di $1200\,\text{kg}$ che viaggia a $54\,\text{km/h}$?

Per il pallone

$$p = m\,v = 0{,}43\,\text{kg} \cdot 25\,\text{m/s} = 10{,}75\,\text{kg} \cdot \text{m/s} \approx 11\,\text{kg} \cdot \text{m/s}$$

Per l'automobile la velocità va prima portata in metri al secondo, $54 : 3{,}6 = 15\,\text{m/s}$:

$$p = 1200\,\text{kg} \cdot 15\,\text{m/s} = 18\,000\,\text{kg} \cdot \text{m/s} = 1{,}8 \cdot 10^4\,\text{kg} \cdot \text{m/s}$$

L'automobile è più lenta del pallone, ma la sua quantità di moto è più di mille volte più grande.
```

```ad-warning
Le unità: chilogrammi e metri al secondo
La massa va in chilogrammi e la velocità in metri al secondo. Con $54\,\text{km/h}$ lasciati così la quantità di moto dell'automobile verrebbe $3{,}6$ volte più grande, e con una massa in grammi mille volte più grande.
```

```ad-example
Esempio 2: la stessa quantità di moto
Una palla da bowling di $6{,}0\,\text{kg}$ rotola a $2{,}0\,\text{m/s}$. A che velocità dovrebbe viaggiare una palla da tennis di $58\,\text{g}$ per avere la stessa quantità di moto?

La palla da bowling ha $p = 6{,}0\,\text{kg} \cdot 2{,}0\,\text{m/s} = 12\,\text{kg} \cdot \text{m/s}$. Dalla definizione, $v = p / m$, con la massa in chilogrammi:

$$v = \frac{p}{m} = \frac{12\,\text{kg} \cdot \text{m/s}}{0{,}058\,\text{kg}} = 206{,}8\ldots\,\text{m/s} \approx 2{,}1 \cdot 10^2\,\text{m/s}$$

Sono circa $740\,\text{km/h}$, il triplo del servizio di un campione. La massa è circa cento volte più piccola, e la velocità deve essere circa cento volte più grande.
```

## Quantità di moto ed energia cinetica

Quantità di moto ed [energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) dipendono tutte e due dalla massa e dalla velocità, ma sono grandezze diverse. La quantità di moto è un vettore e cresce in proporzione alla velocità; l'energia cinetica è uno scalare e cresce con il quadrato della velocità. Sono legate: da $p = m v$ si ha $v = p/m$, e sostituendo in $K = \tfrac{1}{2} m v^2$

$$K = \frac{p^2}{2m}$$

Due corpi con la stessa quantità di moto non hanno quindi la stessa energia cinetica: ne ha di più quello con la massa più piccola. La palla da bowling dell'esempio 2 ha $K = \tfrac{1}{2} \cdot 6{,}0\,\text{kg} \cdot (2{,}0\,\text{m/s})^2 = 12\,\text{J}$; la palla da tennis con la stessa quantità di moto ha

$$K = \frac{p^2}{2m} = \frac{(12\,\text{kg} \cdot \text{m/s})^2}{2 \cdot 0{,}058\,\text{kg}} = 1241\ldots\,\text{J} \approx 1{,}2 \cdot 10^3\,\text{J}$$

cento volte tanto.

## La variazione della quantità di moto

Quando la velocità di un corpo cambia, cambia la sua quantità di moto. La **variazione della quantità di moto** è la differenza tra il vettore finale e quello iniziale:

$$\Delta\vec p = \vec p_f - \vec p_i = m\,\vec v_f - m\,\vec v_i$$

È una [differenza di vettori](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori), e la quantità di moto cambia anche se cambia solo la direzione della velocità, come in una curva percorsa a velocità costante in modulo.

Per un moto lungo una retta si sceglie un verso positivo e si lavora con le componenti, che hanno un segno: $p_x = m\,v_x$ è positiva se il corpo va nel verso scelto, negativa se va in quello opposto. Allora $\Delta p_x = m\,v_{fx} - m\,v_{ix}$.

```ad-example
Esempio 3: una palla che rimbalza
Una palla di $0{,}15\,\text{kg}$ colpisce un muro alla velocità di $12\,\text{m/s}$ e rimbalza indietro a $8{,}0\,\text{m/s}$. Di quanto è cambiata la sua quantità di moto?

Scegliamo come verso positivo quello in cui la palla va verso il muro. Prima dell'urto $v_{ix} = +12\,\text{m/s}$, dopo $v_{fx} = -8{,}0\,\text{m/s}$:

$$p_{ix} = 0{,}15\,\text{kg} \cdot 12\,\text{m/s} = 1{,}8\,\text{kg} \cdot \text{m/s}$$

$$p_{fx} = 0{,}15\,\text{kg} \cdot (-8{,}0\,\text{m/s}) = -1{,}2\,\text{kg} \cdot \text{m/s}$$

$$\Delta p_x = p_{fx} - p_{ix} = -1{,}2\,\text{kg} \cdot \text{m/s} - 1{,}8\,\text{kg} \cdot \text{m/s} = -3{,}0\,\text{kg} \cdot \text{m/s}$$

La variazione ha modulo $3{,}0\,\text{kg} \cdot \text{m/s}$ ed è diretta lontano dal muro.

```tikz
% nome: rimbalzo-muro-variazione-quantita-moto
% alt: In alto una palla che va verso un muro a destra, con la quantità di moto iniziale p i verso destra, e la stessa palla dopo il rimbalzo, con la quantità di moto finale p f verso sinistra, più corta. In basso i tre vettori in scala lungo un asse x: p i lungo 1,8 verso destra, p f lungo 1,2 verso sinistra e la variazione delta p lunga 3,0 verso sinistra
% svg: rimbalzo-muro-variazione-quantita-moto-5e65784b.svg 236x151
\begin{tikzpicture}
\draw[thick] (4.6,1.6) -- (4.6,3.4);
\foreach \y in {1.75,1.9,...,3.4} \draw[thin] (4.6,\y) -- ++(0.15,-0.15);
\draw[thick, fill=blue!10] (1.2,3.0) circle (0.18);
\draw[-{Stealth}, thick, blue] (1.38,3.0) -- (3.18,3.0) node[above] {$\vec{p}_i$};
\draw[thick, fill=blue!10] (3.6,2.0) circle (0.18);
\draw[-{Stealth}, thick, blue] (3.42,2.0) -- (2.22,2.0) node[above] {$\vec{p}_f$};
\node[left] at (0.9,3.0) {\small prima};
\node[left] at (0.9,2.0) {\small dopo};
\draw[->] (-0.3,-0.15) -- (5.4,-0.15) node[right] {$x$};
\draw[-{Stealth}, thick, blue] (2.4,0.9) -- (4.2,0.9) node[right] {$\vec{p}_i$};
\draw[-{Stealth}, thick, blue] (2.4,0.6) -- (1.2,0.6) node[left] {$\vec{p}_f$};
\draw[-{Stealth}, thick, orange!90!black] (4.2,0.2) -- (1.2,0.2) node[pos=0, right] {$\Delta\vec{p}$};
\draw[dashed, thin] (4.2,0.9) -- (4.2,0.2);
\draw[dashed, thin] (1.2,0.6) -- (1.2,0.2);
\end{tikzpicture}
```
```

```ad-warning
In un rimbalzo i moduli si sommano
La palla dell'esempio 3 inverte il verso della velocità, e i due termini di $\Delta p_x$ hanno lo stesso segno: $3{,}0\,\text{kg} \cdot \text{m/s}$, non $0{,}15 \cdot (12 - 8{,}0) = 0{,}60\,\text{kg} \cdot \text{m/s}$. Sottrarre i moduli vale solo se il corpo continua nello stesso verso. Una palla che rimbalza con la stessa velocità con cui è arrivata ha $\Delta p = 2\,m\,v$, non zero.
```

## La quantità di moto di un sistema

Un insieme di corpi che si studiano insieme (due carrelli, le palle di un biliardo, un fucile e il suo proiettile) si chiama **sistema**. La **quantità di moto totale** del sistema è la somma vettoriale delle quantità di moto dei corpi che lo formano:

$$\vec p_{tot} = \vec p_1 + \vec p_2 + \ldots = m_1 \vec v_1 + m_2 \vec v_2 + \ldots$$

Lungo una retta si sommano le componenti con il loro segno, e due corpi che si muovono in versi opposti hanno quantità di moto che in parte si cancellano. Due pattinatori con la stessa massa che si allontanano alla stessa velocità in versi opposti hanno una quantità di moto totale nulla, anche se nessuno dei due è fermo.

```ad-example
Esempio 4: due carrelli sulla stessa rotaia
Un carrello di $2{,}0\,\text{kg}$ va verso destra a $3{,}0\,\text{m/s}$; un carrello di $5{,}0\,\text{kg}$ gli viene incontro, verso sinistra, a $1{,}6\,\text{m/s}$. Quanto vale la quantità di moto totale?

Con il verso positivo a destra, $v_{1x} = +3{,}0\,\text{m/s}$ e $v_{2x} = -1{,}6\,\text{m/s}$:

$$\begin{aligned}p_{tot,x} &= m_1 v_{1x} + m_2 v_{2x} \\ &= 2{,}0\,\text{kg} \cdot 3{,}0\,\text{m/s} + 5{,}0\,\text{kg} \cdot (-1{,}6\,\text{m/s}) \\ &= 6{,}0\,\text{kg} \cdot \text{m/s} - 8{,}0\,\text{kg} \cdot \text{m/s} \\ &= -2{,}0\,\text{kg} \cdot \text{m/s}\end{aligned}$$

La quantità di moto totale ha modulo $2{,}0\,\text{kg} \cdot \text{m/s}$ ed è diretta verso sinistra: prevale il carrello più lento, perché ha più massa.

```tikz
% nome: due-carrelli-quantita-moto-totale
% alt: Due carrelli su una rotaia: quello di sinistra, da 2,0 chilogrammi, ha la quantità di moto p 1 verso destra, lunga 6,0 in scala; quello di destra, da 5,0 chilogrammi, ha la quantità di moto p 2 verso sinistra, lunga 8,0. Sotto, la quantità di moto totale, verso sinistra e lunga 2,0
% svg: due-carrelli-quantita-moto-totale-f1c47af9.svg 292x78
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (7.3,0);
\foreach \x in {-0.15,0,...,7.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.6,0.12) rectangle ++(0.8,0.45);
\draw[thick, fill=gray!20] (0.8,0.12) circle (0.1);
\draw[thick, fill=gray!20] (1.2,0.12) circle (0.1);
\draw[thick, fill=blue!10] (5.2,0.12) rectangle ++(1.3,0.6);
\draw[thick, fill=gray!20] (5.5,0.12) circle (0.1);
\draw[thick, fill=gray!20] (6.2,0.12) circle (0.1);
\node at (1.0,0.36) {\small $2{,}0$};
\node at (5.85,0.43) {\small $5{,}0$ kg};
\draw[-{Stealth}, thick, blue] (1.4,0.4) -- (2.9,0.4) node[midway, above] {$\vec{p}_1$};
\draw[-{Stealth}, thick, blue] (5.2,0.4) -- (3.2,0.4) node[midway, above] {$\vec{p}_2$};
\draw[-{Stealth}, thick, orange!90!black] (3.6,-0.75) -- (3.1,-0.75) node[left] {$\vec{p}_{tot}$};
\end{tikzpicture}
```
```

Nella figura qui sotto scegli massa e velocità di due carrelli e guardi le due quantità di moto e la loro somma. Con il carrello da $2\,\text{kg}$ a $3\,\text{m/s}$ verso destra, quello da $6\,\text{kg}$ annulla la quantità di moto totale quando va a $1\,\text{m/s}$ verso sinistra: tre volte la massa, un terzo della velocità. In generale la somma è zero quando $m_1 v_1 = m_2 v_2$ e i versi sono opposti.

```interattivo
% nome: quantita-moto-due-carrelli
% alt: Due carrelli su una rotaia, con quattro cursori per la massa di ciascuno, da 1 a 6 chilogrammi, e per la velocità di ciascuno, da meno 5 a 5 metri al secondo. Sopra ogni carrello una freccia mostra la velocità; sotto la rotaia due frecce in scala mostrano le quantità di moto p1 e p2 e una terza la quantità di moto totale. Sotto la figura sono scritti i tre valori
```

Nel piano le quantità di moto si sommano come tutti i vettori, con il metodo punta-coda o per componenti. Se due quantità di moto sono perpendicolari, il modulo della somma si trova con il [teorema di Pitagora](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/teoremi-di-pitagora-e-di-euclide).

```ad-example
Esempio 5: due veicoli a un incrocio
Un'automobile di $1200\,\text{kg}$ viaggia verso est a $15\,\text{m/s}$; un furgone di $2000\,\text{kg}$ viaggia verso nord a $12\,\text{m/s}$. Quanto vale la quantità di moto totale dei due veicoli, e che direzione ha?

Le due quantità di moto sono

$$p_1 = 1200\,\text{kg} \cdot 15\,\text{m/s} = 1{,}8 \cdot 10^4\,\text{kg} \cdot \text{m/s}$$

$$p_2 = 2000\,\text{kg} \cdot 12\,\text{m/s} = 2{,}4 \cdot 10^4\,\text{kg} \cdot \text{m/s}$$

la prima verso est, la seconda verso nord. Sono perpendicolari:

$$\begin{aligned}p_{tot} &= \sqrt{p_1^2 + p_2^2} = \sqrt{(1{,}8 \cdot 10^4)^2 + (2{,}4 \cdot 10^4)^2}\,\text{kg} \cdot \text{m/s} \\ &= 3{,}0 \cdot 10^4\,\text{kg} \cdot \text{m/s}\end{aligned}$$

L'angolo $\theta$ che $\vec p_{tot}$ forma con la direzione est ha $\tan\theta = p_2 / p_1 = 1{,}33\ldots$, quindi $\theta \approx 53^\circ$ verso nord.

```tikz
% nome: quantita-moto-incrocio-somma
% alt: Due vettori perpendicolari sommati con il metodo punta-coda: p 1, orizzontale verso est, lungo 1,8 in scala, e p 2, verticale verso nord, lungo 2,4, messo sulla punta di p 1. La quantità di moto totale va dalla coda di p 1 alla punta di p 2, è lunga 3,0 e forma con l'orizzontale un angolo theta di 53 gradi
% svg: quantita-moto-incrocio-somma-f3d99840.svg 194x139
\begin{tikzpicture}
\draw[-{Stealth}, thick, blue] (0,0) -- (2.25,0) node[midway, below] {$\vec{p}_1$};
\draw[-{Stealth}, thick, blue] (2.25,0) -- (2.25,3) node[midway, right] {$\vec{p}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (2.25,3) node[midway, above left] {$\vec{p}_{tot}$};
\draw (0.6,0) arc[start angle=0, end angle=53.13, radius=0.6];
\node at (0.85,0.42) {$\theta$};
\draw[thin] (2.05,0) -- (2.05,0.2) -- (2.25,0.2);
\draw[->, thin] (3.6,1.6) -- (4.4,1.6) node[right] {\small est};
\draw[->, thin] (3.6,1.6) -- (3.6,2.4) node[above] {\small nord};
\end{tikzpicture}
```
```

```ad-warning
La quantità di moto totale non è la somma dei moduli
Nell'esempio 4 la somma dei moduli darebbe $14\,\text{kg} \cdot \text{m/s}$, nell'esempio 5 $4{,}2 \cdot 10^4\,\text{kg} \cdot \text{m/s}$: tutti e due sbagliati. I moduli si sommano solo quando i corpi si muovono nella stessa direzione e nello stesso verso.
```

## Il secondo principio con la quantità di moto

Il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) dice che $\vec F_{tot} = m\,\vec a$. Se in un intervallo $\Delta t$ la forza totale è costante, lo è anche l'accelerazione, $\vec a = \Delta\vec v / \Delta t$. Sostituendo, e ricordando che la massa non cambia,

$$\vec F_{tot} = m\,\frac{\Delta\vec v}{\Delta t} = \frac{m\,\vec v_f - m\,\vec v_i}{\Delta t} = \frac{\Delta\vec p}{\Delta t}$$

La forza totale che agisce su un corpo è uguale alla variazione della sua quantità di moto divisa per il tempo in cui avviene:

$$\vec F_{tot} = \frac{\Delta\vec p}{\Delta t}$$

Più in fretta si vuole cambiare la quantità di moto di un corpo, più forza serve. Se la forza non è costante, la stessa formula dà la **forza media** nell'intervallo $\Delta t$: quella forza costante che produrrebbe la stessa variazione nello stesso tempo.

Questa è la forma in cui Newton enunciò il principio, ed è più generale di $\vec F = m\,\vec a$: vale anche quando la massa cambia, come per un razzo che perde il carburante che brucia. Per i corpi di massa costante le due forme dicono la stessa cosa. Si controlla anche sulle unità: $\text{kg} \cdot \text{m/s}$ diviso secondi dà $\text{kg} \cdot \text{m/s}^2$, cioè newton.

Se la forza totale è nulla, $\Delta\vec p = \vec 0$: la quantità di moto resta costante. È il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) detto con la quantità di moto.

```ad-example
Esempio 6: la forza che frena un'automobile
Un'automobile di $1200\,\text{kg}$ che viaggia a $25\,\text{m/s}$ frena e si ferma in $4{,}0\,\text{s}$. Qual è la forza totale media che l'ha frenata?

Con il verso positivo nel verso del moto, la quantità di moto passa da $p_{ix} = 1200\,\text{kg} \cdot 25\,\text{m/s} = 3{,}0 \cdot 10^4\,\text{kg} \cdot \text{m/s}$ a zero:

$$F_x = \frac{\Delta p_x}{\Delta t} = \frac{0 - 3{,}0 \cdot 10^4\,\text{kg} \cdot \text{m/s}}{4{,}0\,\text{s}} = -7{,}5 \cdot 10^3\,\text{N}$$

Il segno meno dice che la forza è opposta al moto. Fermare l'automobile in metà tempo richiederebbe una forza doppia.

```tikz
% nome: frenata-forza-quantita-moto
% alt: Un'automobile disegnata come un blocco su una strada, con la quantità di moto iniziale p i verso destra e la forza frenante F verso sinistra, opposta al moto; più avanti, tratteggiata, la stessa automobile ferma
% svg: frenata-forza-quantita-moto-86a1599f.svg 292x55
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (7.3,0);
\foreach \x in {-0.15,0,...,7.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (1.4,0) rectangle ++(1.2,0.6);
\draw[thick, dashed, fill=blue!10] (5.6,0) rectangle ++(1.2,0.6);
\draw[-{Stealth}, thick, blue] (2.6,0.4) -- (4.4,0.4) node[above] {$\vec{p}_i$};
\draw[-{Stealth}, thick, red] (1.4,0.3) -- (0.2,0.3) node[above] {$\vec{F}$};
\node[above] at (6.2,0.6) {\small $\vec{p}_f = \vec{0}$};
\end{tikzpicture}
```
```

```ad-example
Esempio 7: la quantità di moto dopo una spinta
Un carrello di $4{,}0\,\text{kg}$ si muove a $1{,}5\,\text{m/s}$ quando una forza costante di $6{,}0\,\text{N}$, nel verso del moto, comincia a spingerlo. Quanto vale la sua quantità di moto dopo $3{,}0\,\text{s}$? E la sua velocità?

Da $F_x = \Delta p_x / \Delta t$ si ricava $\Delta p_x = F_x\,\Delta t$:

$$\Delta p_x = 6{,}0\,\text{N} \cdot 3{,}0\,\text{s} = 18\,\text{kg} \cdot \text{m/s}$$

La quantità di moto iniziale è $p_{ix} = 4{,}0\,\text{kg} \cdot 1{,}5\,\text{m/s} = 6{,}0\,\text{kg} \cdot \text{m/s}$, quella finale

$$p_{fx} = 6{,}0\,\text{kg} \cdot \text{m/s} + 18\,\text{kg} \cdot \text{m/s} = 24\,\text{kg} \cdot \text{m/s}$$

$$v_{fx} = \frac{p_{fx}}{m} = \frac{24\,\text{kg} \cdot \text{m/s}}{4{,}0\,\text{kg}} = 6{,}0\,\text{m/s}$$

Il prodotto $F\,\Delta t$ ha un nome, impulso, ed è l'argomento della lezione [L'impulso e il teorema dell'impulso](/materiale/scuola-superiore/fisica/la-quantita-di-moto/l-impulso-e-il-teorema-dell-impulso).
```

## Verso la conservazione

La quantità di moto totale di un sistema ha una proprietà che la rende preziosa: quando due corpi interagiscono solo tra loro, come in un urto, le forze che si scambiano sono uguali e opposte per il [terzo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica), e quello che l'uno perde in quantità di moto l'altro lo guadagna. La somma non cambia. È la legge della lezione [La conservazione della quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto).
