# Gli urti anelastici

Due vagoni che si agganciano in una stazione di smistamento, un difensore che placca un attaccante e cade a terra con lui, due auto che si scontrano e restano incastrate: in ognuno di questi urti i corpi si deformano, fanno rumore, si scaldano, e dopo lo scontro l'energia cinetica è meno di prima. Sono urti anelastici. Che cosa succede alle velocità lo dice la [conservazione della quantità di moto](/materiale/scuola-superiore/fisica/la-quantita-di-moto/la-conservazione-della-quantita-di-moto), che in un urto vale sempre, anche quando l'energia cinetica si perde.

## Che cos'è un urto

Un **urto** è un'interazione di durata molto breve in cui due corpi si scambiano forze intense. Durante l'urto le forze che contano sono quelle tra i due corpi, che sono interne al sistema; il peso, l'attrito e le altre forze esterne, in un tempo così breve, danno un impulso trascurabile. Il sistema dei due corpi si può trattare come isolato, e tra l'istante subito prima e l'istante subito dopo l'urto

$$m_1\vec{v}_1 + m_2\vec{v}_2 = m_1\vec{V}_1 + m_2\vec{V}_2$$

con $\vec{v}_1$ e $\vec{v}_2$ le velocità prima dell'urto, $\vec{V}_1$ e $\vec{V}_2$ quelle dopo. Questa equazione vale per tutti gli urti. A distinguerli è quello che succede all'energia cinetica totale.

| Tipo di urto | Quantità di moto totale | Energia cinetica totale |
|---|---|---|
| elastico | si conserva | si conserva |
| anelastico | si conserva | diminuisce |
| completamente anelastico | si conserva | diminuisce; i corpi restano uniti |

In un **urto anelastico** una parte dell'energia cinetica iniziale serve a deformare i corpi in modo permanente, li scalda e produce il rumore dello scontro: dopo l'urto l'energia cinetica totale è minore. Un urto è **completamente anelastico** quando i due corpi dopo lo scontro restano attaccati e si muovono insieme, con la stessa velocità. Tra tutti gli urti possibili con le stesse masse e le stesse velocità iniziali, è quello in cui si perde più energia cinetica. Gli [urti elastici](/materiale/scuola-superiore/fisica/la-quantita-di-moto/gli-urti-elastici-in-una-e-in-due-dimensioni), in cui l'energia cinetica si conserva, hanno la loro lezione.

## L'urto completamente anelastico

Se dopo l'urto i due corpi formano un corpo solo, di massa $m_1 + m_2$, c'è una sola velocità finale da trovare, $\vec{V}$, e la conservazione della quantità di moto la determina:

$$m_1\vec{v}_1 + m_2\vec{v}_2 = (m_1 + m_2)\,\vec{V}$$

Quando il moto avviene lungo una retta si fissa un asse e si lavora con le componenti, cioè con velocità che hanno un segno:

$$V = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2}$$

Se il secondo corpo è fermo, $v_2 = 0$ e la formula diventa $V = \dfrac{m_1}{m_1 + m_2}\,v_1$: la velocità finale ha lo stesso verso di $v_1$ ed è sempre più piccola.

```ad-example
Esempio 1: due vagoni che si agganciano
Un vagone di $1{,}5 \cdot 10^4\,\text{kg}$ si muove a $2{,}0\,\text{m/s}$ su un binario rettilineo e raggiunge un vagone fermo di $2{,}5 \cdot 10^4\,\text{kg}$, a cui si aggancia. Con che velocità si muovono i due vagoni dopo l'aggancio?

```tikz
% nome: vagoni-prima-dopo
% alt: Due righe. In alto, prima dell'urto, il vagone 1 a sinistra ha una velocità verso destra lunga 2 centimetri, 2,0 metri al secondo, e il vagone 2, più grande, è fermo. In basso, dopo l'urto, i due vagoni sono attaccati e hanno una sola velocità V verso destra, lunga 0,75 centimetri; le frecce sono in scala, un centimetro per ogni metro al secondo
\begin{tikzpicture}
\node[left] at (-0.2,2.3) {\small prima};
\draw[thick] (0,1.9) -- (6.6,1.9);
\foreach \x in {0.15,0.3,...,6.6} \draw[thin] (\x,1.9) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.5,1.9) rectangle ++(1.2,0.7);
\draw[thick, fill=orange!25] (3.6,1.9) rectangle ++(1.8,0.7);
\node at (1.1,2.25) {\small $1$};
\node at (4.5,2.25) {\small $2$};
\draw[-{Stealth}, thick, blue!60!black] (1.1,2.85) -- (3.1,2.85) node[above] {$\vec{v}_1$};
\node[above] at (4.5,2.6) {\small fermo};
\node[left] at (-0.2,0.4) {\small dopo};
\draw[thick] (0,0) -- (6.6,0);
\foreach \x in {0.15,0.3,...,6.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (2.6,0) rectangle ++(1.2,0.7);
\draw[thick, fill=orange!25] (3.8,0) rectangle ++(1.8,0.7);
\node at (3.2,0.35) {\small $1$};
\node at (4.7,0.35) {\small $2$};
\draw[-{Stealth}, thick, blue!60!black] (4.1,0.95) -- (4.85,0.95) node[right] {$\vec{V}$};
\end{tikzpicture}
```

Con l'asse nel verso del moto del primo vagone, $v_1 = 2{,}0\,\text{m/s}$ e $v_2 = 0$:

$$V = \frac{m_1 v_1}{m_1 + m_2} = \frac{1{,}5 \cdot 10^4\,\text{kg} \cdot 2{,}0\,\text{m/s}}{1{,}5 \cdot 10^4\,\text{kg} + 2{,}5 \cdot 10^4\,\text{kg}} = \frac{3{,}0 \cdot 10^4\,\text{kg}\cdot\text{m/s}}{4{,}0 \cdot 10^4\,\text{kg}} = 0{,}75\,\text{m/s}$$

La stessa quantità di moto, $3{,}0 \cdot 10^4\,\text{kg}\cdot\text{m/s}$, ora è portata da una massa più grande, e la velocità è scesa.
```

Se i due corpi si vengono incontro, una delle due velocità è negativa, e le due quantità di moto in parte si cancellano.

```ad-example
Esempio 2: un placcaggio
In una partita di rugby un attaccante di $80\,\text{kg}$ corre a $6{,}0\,\text{m/s}$ verso la meta. Un difensore di $120\,\text{kg}$ gli corre incontro a $3{,}0\,\text{m/s}$ e lo placca: i due restano avvinghiati. Con che velocità e in che verso si muovono subito dopo il placcaggio?

```tikz
% nome: placcaggio-prima
% alt: Prima del placcaggio: l'attaccante, un blocco a sinistra, ha una velocità verso destra lunga 2,4 centimetri, 6,0 metri al secondo; il difensore, un blocco più grande a destra, ha una velocità verso sinistra lunga 1,2 centimetri, 3,0 metri al secondo. Sotto, l'asse x punta verso destra
\begin{tikzpicture}
\draw[thick] (0,0) -- (6.6,0);
\foreach \x in {0.15,0.3,...,6.6} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, fill=blue!10] (0.6,0) rectangle ++(0.7,0.8);
\draw[thick, fill=orange!25] (5.0,0) rectangle ++(0.8,1.0);
\draw[-{Stealth}, thick, blue!60!black] (0.95,1.05) -- (3.35,1.05) node[above] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (5.4,1.25) -- (4.2,1.25) node[above] {$\vec{v}_2$};
\node at (0.95,0.4) {\small $1$};
\node at (5.4,0.5) {\small $2$};
\draw[->] (5.4,-0.6) -- (6.5,-0.6) node[right] {$x$};
\end{tikzpicture}
```

Con l'asse nel verso dell'attaccante, $v_1 = 6{,}0\,\text{m/s}$ e $v_2 = -3{,}0\,\text{m/s}$:

$$V = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{80\,\text{kg} \cdot 6{,}0\,\text{m/s} + 120\,\text{kg} \cdot (-3{,}0\,\text{m/s})}{80\,\text{kg} + 120\,\text{kg}} = \frac{480 - 360}{200}\,\text{m/s} = 0{,}60\,\text{m/s}$$

Il risultato è positivo: i due si muovono nel verso dell'attaccante, che aveva la quantità di moto più grande ($480\,\text{kg}\cdot\text{m/s}$ contro $360$), ma molto lentamente.
```

```ad-warning
Le velocità opposte hanno segni opposti
Sommare le due quantità di moto senza il segno, nell'esempio 2, dà $V = (480 + 360)/200 = 4{,}2\,\text{m/s}$: come se il difensore corresse nello stesso verso dell'attaccante. Prima di scrivere l'equazione fissa l'asse e dai a ogni velocità il suo segno.
```

```ad-warning
La velocità finale non è la media delle velocità
Nell'esempio 1 la media tra $2{,}0\,\text{m/s}$ e $0$ è $1{,}0\,\text{m/s}$, ma i vagoni vanno a $0{,}75\,\text{m/s}$. La media semplice vale solo se le masse sono uguali: in generale ogni velocità pesa in proporzione alla massa del suo corpo.
```

## L'energia dissipata

In un urto anelastico l'energia cinetica totale diminuisce. La differenza tra quella iniziale e quella finale è l'**energia dissipata** nell'urto:

$$E_d = K_i - K_f$$

con $K_i = \tfrac{1}{2} m_1 v_1^2 + \tfrac{1}{2} m_2 v_2^2$ e, per un urto completamente anelastico, $K_f = \tfrac{1}{2}(m_1 + m_2)\,V^2$. Non sparisce: la si ritrova come energia interna dei corpi deformati e riscaldati e, in piccola parte, nel suono. L'energia totale si conserva, come nella lezione sulle [forze dissipative](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale); a non conservarsi è la sola energia cinetica.

```ad-example
Esempio 3: l'energia dissipata nell'aggancio
Quanta energia cinetica si dissipa nell'aggancio dei vagoni dell'esempio 1?

Prima dell'urto si muove solo il primo vagone:

$$K_i = \frac{1}{2} m_1 v_1^2 = \frac{1}{2} \cdot 1{,}5 \cdot 10^4\,\text{kg} \cdot (2{,}0\,\text{m/s})^2 = 3{,}0 \cdot 10^4\,\text{J}$$

Dopo l'urto i due vagoni si muovono insieme a $0{,}75\,\text{m/s}$:

$$K_f = \frac{1}{2}(m_1 + m_2)\,V^2 = \frac{1}{2} \cdot 4{,}0 \cdot 10^4\,\text{kg} \cdot (0{,}75\,\text{m/s})^2 = 1{,}125 \cdot 10^4\,\text{J} \approx 1{,}1 \cdot 10^4\,\text{J}$$

$$E_d = K_i - K_f = 3{,}0 \cdot 10^4\,\text{J} - 1{,}125 \cdot 10^4\,\text{J} = 1{,}875 \cdot 10^4\,\text{J} \approx 1{,}9 \cdot 10^4\,\text{J}$$

Si è dissipato il $62{,}5\%$ dell'energia cinetica iniziale.

```tikz
% nome: energia-urto-barre
% alt: Due barre orizzontali della stessa lunghezza, una sopra l'altra. Quella in alto, prima dell'urto, è tutta energia cinetica, K i uguale a 30 kilojoule. Quella in basso, dopo l'urto, è divisa in due parti: 11 kilojoule di energia cinetica K f e 19 kilojoule di energia dissipata E d
\begin{tikzpicture}
\node[left] at (0,1.2) {\small prima};
\node[left] at (0,0.2) {\small dopo};
\draw[thick, fill=blue!10] (0.2,1.0) rectangle (6.2,1.4);
\node at (3.2,1.2) {\small $K_i = 30$ kJ};
\draw[thick, fill=blue!10] (0.2,0) rectangle (2.45,0.4);
\draw[thick, fill=red!15] (2.45,0) rectangle (6.2,0.4);
\node at (1.325,0.2) {\small $K_f = 11$ kJ};
\node at (4.325,0.2) {\small $E_d = 19$ kJ};
\end{tikzpicture}
```
```

Nel placcaggio dell'esempio 2 la perdita è ancora più grande. Prima dell'urto $K_i = \tfrac{1}{2} \cdot 80 \cdot 6{,}0^2 + \tfrac{1}{2} \cdot 120 \cdot 3{,}0^2 = 1440\,\text{J} + 540\,\text{J} = 1980\,\text{J}$; dopo, $K_f = \tfrac{1}{2} \cdot 200 \cdot 0{,}60^2 = 36\,\text{J}$. Quando i due corpi si vengono incontro con quantità di moto quasi uguali, restano quasi fermi e l'energia cinetica si dissipa quasi tutta.

```ad-warning
Le energie cinetiche si sommano sempre
Nella quantità di moto la velocità del difensore entra con il segno meno; nell'energia cinetica è al quadrato, e il suo contributo è positivo. $K_i$ è $1440 + 540$, non $1440 - 540$.
```

### Quando il bersaglio è fermo

Se il secondo corpo è fermo c'è una formula che dà subito la frazione di energia dissipata. Da $V = \dfrac{m_1 v_1}{m_1 + m_2}$,

$$K_f = \frac{1}{2}(m_1 + m_2)\,V^2 = \frac{1}{2}\,\frac{m_1^2 v_1^2}{m_1 + m_2} = \frac{m_1}{m_1 + m_2}\,K_i$$

L'energia cinetica che resta è la frazione $\dfrac{m_1}{m_1 + m_2}$ di quella iniziale, e quella dissipata è il resto:

$$\frac{E_d}{K_i} = \frac{m_2}{m_1 + m_2}$$

Per i vagoni, $2{,}5/4{,}0 = 0{,}625$: il $62{,}5\%$ trovato nell'esempio 3.

Nella figura qui sotto un carrello ne urta uno fermo e ci resta attaccato. Cambia le masse e la velocità, e guarda quanta dell'energia cinetica iniziale resta dopo l'urto.

```interattivo
% nome: urto-anelastico-energia
% alt: Un carrello in moto urta un carrello fermo su una rotaia e i due proseguono attaccati. Tre cursori scelgono le due masse, da 0,5 a 4 chilogrammi, e la velocità del primo carrello, da 1 a 4 metri al secondo; un bottone avvia l'urto. Accanto, due barre: l'energia cinetica e l'energia dissipata, che compare al momento dell'urto, con una linea tratteggiata all'altezza dell'energia cinetica iniziale. Sotto sono scritte la velocità finale, le energie e la percentuale dissipata
```

La frazione dissipata dipende solo dalle masse. Con masse uguali si perde sempre metà dell'energia cinetica, a qualunque velocità. Se il bersaglio è molto più pesante del proiettile (un moscerino contro un camion fermo) si perde quasi tutta; se è molto più leggero, il proiettile prosegue quasi indisturbato e la perdita è piccola.

## Gli urti anelastici in cui i corpi si separano

In molti urti i corpi non restano attaccati, ma l'energia cinetica diminuisce lo stesso: due auto che si tamponano e poi si staccano, una palla di gomma piena che rimbalza poco. Sono urti anelastici ma non completamente. Le velocità finali sono due, e la sola conservazione della quantità di moto non le determina entrambe: una va misurata, o serve un'altra informazione.

```ad-example
Esempio 4: un carrello che torna indietro
Su una rotaia un carrello di $0{,}50\,\text{kg}$ si muove a $4{,}0\,\text{m/s}$ e urta un carrello fermo di $1{,}5\,\text{kg}$. Dopo l'urto il primo carrello torna indietro a $1{,}0\,\text{m/s}$. Qual è la velocità del secondo? Quanta energia cinetica si è dissipata?

Con l'asse nel verso iniziale del primo carrello, $v_1 = 4{,}0\,\text{m/s}$, $v_2 = 0$ e $V_1 = -1{,}0\,\text{m/s}$. Dalla conservazione della quantità di moto:

$$m_1 v_1 = m_1 V_1 + m_2 V_2 \quad\Rightarrow\quad V_2 = \frac{m_1 (v_1 - V_1)}{m_2} = \frac{0{,}50\,\text{kg} \cdot (4{,}0 + 1{,}0)\,\text{m/s}}{1{,}5\,\text{kg}} = 1{,}66\ldots\,\text{m/s} \approx 1{,}7\,\text{m/s}$$

Le energie cinetiche:

$$K_i = \frac{1}{2} \cdot 0{,}50\,\text{kg} \cdot (4{,}0\,\text{m/s})^2 = 4{,}0\,\text{J}$$

$$K_f = \frac{1}{2} \cdot 0{,}50\,\text{kg} \cdot (1{,}0\,\text{m/s})^2 + \frac{1}{2} \cdot 1{,}5\,\text{kg} \cdot (1{,}66\ldots\,\text{m/s})^2 = 0{,}25\,\text{J} + 2{,}08\ldots\,\text{J} = 2{,}33\ldots\,\text{J}$$

$$E_d = K_i - K_f = 4{,}0\,\text{J} - 2{,}33\ldots\,\text{J} \approx 1{,}7\,\text{J}$$

L'energia cinetica è diminuita: l'urto è anelastico, anche se i carrelli si sono separati.
```

## Il pendolo balistico

Il **pendolo balistico** è un dispositivo per misurare la velocità di un proiettile senza cronometri: un blocco di legno o di sabbia di massa $M$, appeso a dei fili, in cui il proiettile di massa $m$ si conficca. Il blocco, con il proiettile dentro, oscilla e sale di un'altezza $h$, che si misura.

```tikz
% nome: pendolo-balistico
% alt: Un blocco di massa M grande appeso al soffitto con due fili verticali; da sinistra arriva un proiettile di massa m piccola con velocità v. A destra, tratteggiata, la posizione più alta raggiunta dal blocco dopo l'urto, con i fili inclinati: il blocco è salito di un'altezza h rispetto alla posizione iniziale, segnata da due linee orizzontali tratteggiate
\begin{tikzpicture}
\draw[thick] (-0.5,3.4) -- (5.6,3.4);
\foreach \x in {-0.35,-0.2,...,5.6} \draw[thin] (\x,3.4) -- ++(0.15,0.15);
\draw (2.0,3.4) -- (2.0,0.9);
\draw (2.8,3.4) -- (2.8,0.9);
\draw[thick, fill=blue!10] (1.7,0.2) rectangle (3.1,0.9);
\node at (2.4,0.55) {$M$};
\draw[dashed] (2.0,3.4) -- (3.607,1.485);
\draw[dashed] (2.8,3.4) -- (4.407,1.485);
\draw[thick, dashed, fill=blue!10] (3.307,0.785) rectangle (4.707,1.485);
\draw[thick, fill=gray!20] (-0.1,0.55) circle (0.09);
\node[below] at (-0.1,0.45) {$m$};
\draw[-{Stealth}, thick, blue!60!black] (0.05,0.55) -- (1.3,0.55) node[above] {$\vec{v}$};
\draw[dashed, thin] (3.1,0.2) -- (5.5,0.2);
\draw[dashed, thin] (4.707,0.785) -- (5.5,0.785);
\draw[{Stealth}-{Stealth}, thin] (5.3,0.2) -- (5.3,0.785) node[midway, right] {$h$};
\end{tikzpicture}
```

Il moto ha due fasi, e in ognuna si conserva una grandezza diversa.

1. L'urto. Il proiettile si ferma dentro il blocco in un tempo brevissimo, prima che il blocco si sia spostato: è un urto completamente anelastico. Si conserva la quantità di moto, non l'energia cinetica. Se $V$ è la velocità del blocco con il proiettile subito dopo l'urto,

$$m\,v = (m + M)\,V$$

2. La salita. Dopo l'urto lavora solo il peso (la tensione dei fili è perpendicolare al moto), e l'[energia meccanica si conserva](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica): l'energia cinetica che il blocco ha in basso diventa energia potenziale nel punto più alto.

$$\frac{1}{2}(m + M)\,V^2 = (m + M)\,g\,h \quad\Rightarrow\quad V = \sqrt{2 g h}$$

Mettendo insieme le due fasi si ottiene la velocità del proiettile:

$$v = \frac{m + M}{m}\,\sqrt{2 g h}$$

```ad-example
Esempio 5: la velocità di un proiettile
Un proiettile di $10\,\text{g}$ si conficca in un blocco di $2{,}0\,\text{kg}$ appeso a due fili. Il blocco sale di $12\,\text{cm}$. Qual era la velocità del proiettile?

In unità del Sistema Internazionale $m = 0{,}010\,\text{kg}$ e $h = 0{,}12\,\text{m}$; la massa totale è $m + M = 2{,}01\,\text{kg}$. Dalla salita:

$$V = \sqrt{2 g h} = \sqrt{2 \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}12\,\text{m}} = 1{,}53\ldots\,\text{m/s}$$

Dall'urto:

$$v = \frac{m + M}{m}\,V = \frac{2{,}01\,\text{kg}}{0{,}010\,\text{kg}} \cdot 1{,}53\ldots\,\text{m/s} = 308{,}2\ldots\,\text{m/s} \approx 3{,}1 \cdot 10^2\,\text{m/s}$$

Il proiettile aveva $K_i = \tfrac{1}{2} \cdot 0{,}010 \cdot 308^2 \approx 475\,\text{J}$; il blocco dopo l'urto ne ha $\tfrac{1}{2} \cdot 2{,}01 \cdot 1{,}53^2 \approx 2{,}4\,\text{J}$. Più del $99\%$ dell'energia cinetica si è dissipata nel conficcarsi.
```

```ad-warning
L'energia meccanica non si conserva attraverso l'urto
Scrivere $\tfrac{1}{2} m v^2 = (m + M)\,g\,h$, dal proiettile in volo direttamente al punto più alto, è sbagliato: salta l'urto, in cui quasi tutta l'energia cinetica si dissipa. Con i dati dell'esempio 5 darebbe $v \approx 22\,\text{m/s}$ al posto di $3{,}1 \cdot 10^2\,\text{m/s}$. Nell'urto si usa la quantità di moto, nella salita l'energia.
```

## Gli urti completamente anelastici nel piano

Se le velocità iniziali non sono sulla stessa retta, la conservazione si scrive per componenti. Per un urto completamente anelastico:

$$m_1 v_{1x} + m_2 v_{2x} = (m_1 + m_2)\,V_x \qquad m_1 v_{1y} + m_2 v_{2y} = (m_1 + m_2)\,V_y$$

Dalle due componenti si ricavano il modulo e la direzione di $\vec{V}$, come per ogni vettore.

```ad-example
Esempio 6: uno scontro a un incrocio
Un'auto di $1{,}2 \cdot 10^3\,\text{kg}$ viaggia verso est a $15\,\text{m/s}$; un furgone di $1{,}6 \cdot 10^3\,\text{kg}$ viaggia verso nord, anche lui a $15\,\text{m/s}$. All'incrocio si scontrano e restano incastrati. Con che velocità e in che direzione si muovono subito dopo l'urto?

Con l'asse $x$ verso est e l'asse $y$ verso nord, l'auto ha quantità di moto solo lungo $x$ e il furgone solo lungo $y$:

$$p_x = 1{,}2 \cdot 10^3\,\text{kg} \cdot 15\,\text{m/s} = 1{,}8 \cdot 10^4\,\text{kg}\cdot\text{m/s} \qquad p_y = 1{,}6 \cdot 10^3\,\text{kg} \cdot 15\,\text{m/s} = 2{,}4 \cdot 10^4\,\text{kg}\cdot\text{m/s}$$

```tikz
% nome: urto-incrocio-quantita-moto
% alt: Un piano cartesiano con l'asse x verso est e l'asse y verso nord. Dall'origine partono la quantità di moto dell'auto lungo x, lunga 1,8 centimetri, quella del furgone lungo y, lunga 2,4 centimetri, e in arancione la quantità di moto totale, la diagonale del rettangolo, lunga 3 centimetri, che forma un angolo alfa di 53 gradi con l'asse x; le frecce sono in scala, un centimetro ogni 10 000 chilogrammi per metro al secondo
\begin{tikzpicture}
\draw[->] (-0.5,0) -- (3.2,0) node[right] {$x$ (est)};
\draw[->] (0,-0.5) -- (0,3.3) node[above] {$y$ (nord)};
\draw[dashed, thin] (1.8,0) -- (1.8,2.4) -- (0,2.4);
\draw[-{Stealth}, thick, blue] (0,0) -- (1.8,0) node[below] {$\vec{p}_1$};
\draw[-{Stealth}, thick, blue] (0,0) -- (0,2.4) node[left] {$\vec{p}_2$};
\draw[-{Stealth}, thick, orange!90!black] (0,0) -- (1.8,2.4) node[right] {$\vec{p}_{tot}$};
\draw[thin] (0.6,0) arc[start angle=0, end angle=53.13, radius=0.6];
\node at (0.85,0.38) {$\alpha$};
\fill (0,0) circle (1.5pt);
\end{tikzpicture}
```

La quantità di moto totale ha modulo

$$p_{tot} = \sqrt{p_x^2 + p_y^2} = \sqrt{(1{,}8)^2 + (2{,}4)^2} \cdot 10^4\,\text{kg}\cdot\text{m/s} = 3{,}0 \cdot 10^4\,\text{kg}\cdot\text{m/s}$$

e dopo l'urto è la quantità di moto dei due veicoli uniti, di massa $2{,}8 \cdot 10^3\,\text{kg}$:

$$V = \frac{p_{tot}}{m_1 + m_2} = \frac{3{,}0 \cdot 10^4\,\text{kg}\cdot\text{m/s}}{2{,}8 \cdot 10^3\,\text{kg}} = 10{,}7\ldots\,\text{m/s} \approx 11\,\text{m/s}$$

La direzione è quella di $\vec{p}_{tot}$:

$$\alpha = \tan^{-1}\frac{p_y}{p_x} = \tan^{-1}\frac{2{,}4}{1{,}8} = 53{,}1\ldots^\circ \approx 53^\circ$$

a nord della direzione est. I veicoli vanno più verso nord che verso est, perché il furgone, a parità di velocità, aveva più quantità di moto.
```

```ad-warning
Si sommano le quantità di moto, non le velocità
Nell'esempio 6 le due velocità hanno lo stesso modulo, ma la direzione finale non è a $45^\circ$: i vettori da sommare sono $m_1\vec{v}_1$ e $m_2\vec{v}_2$, e quello del veicolo più pesante è più lungo.
```
