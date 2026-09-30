# Forze dissipative e conservazione dell'energia totale

Un pendolo vero, lasciato oscillare, si ferma dopo qualche minuto; una bicicletta su cui si smette di pedalare rallenta e si ferma anche in pianura. In questi casi l'energia meccanica non si conserva: diminuisce, perché agiscono l'attrito e la resistenza dell'aria. Quella energia però non sparisce. Le mani strofinate si scaldano, i freni di un'auto dopo una frenata scottano: l'energia meccanica persa è diventata un'altra forma di energia. Tenendo conto di tutte le forme, l'energia totale si conserva sempre.

## Le forze dissipative

Le forze che frenano un moto trasformando energia meccanica in altre forme si chiamano **forze dissipative**: l'[attrito dinamico](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-di-attrito) tra due superfici che strisciano, la resistenza dell'aria su un corpo in moto, quella dell'acqua su una barca. Sono sempre opposte al moto, e il loro lavoro è sempre negativo.

Un corpo che striscia per un tratto $d$ su un piano orizzontale subisce l'attrito dinamico $F_d = \mu_d F_\perp = \mu_d\, m g$, opposto allo spostamento. Il [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) dell'attrito è

$$W_{attrito} = -F_d \cdot d$$

```tikz
% nome: attrito-lavoro-negativo
% alt: Un blocco che scivola verso destra su un pavimento, con la velocità v verso destra e la forza di attrito dinamico Fd verso sinistra, opposta al moto; sotto, lo spostamento d del blocco, verso destra
% svg: attrito-lavoro-negativo-4e7140e0.svg 227x72
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.3,0);
\foreach \x in {-0.15,0,...,5.3} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick, dashed, fill=blue!10] (0.3,0) rectangle ++(1,0.7);
\draw[thick, fill=blue!10] (3.5,0) rectangle ++(1,0.7);
\draw[-{Stealth}, thick, blue!60!black] (4.5,0.45) -- (5.4,0.45) node[above] {$\vec{v}$};
\draw[-{Stealth}, thick, red] (3.5,0.08) -- (2.6,0.08) node[above] {$\vec{F}_d$};
\draw[-{Stealth}, thin] (0.8,-0.4) -- (4,-0.4) node[midway, below] {$d$};
\end{tikzpicture}
```

A differenza del lavoro del peso, il lavoro dell'attrito dipende dalla strada: per spostare un armadio da un angolo all'altro della stanza, girando intorno al tavolo invece di andare dritti, l'attrito compie più lavoro. Per questo l'attrito non ha un'energia potenziale.

```ad-example
Esempio 1: una cassa che rallenta
Una cassa di $12\,\text{kg}$ scivola sul pavimento a $4{,}0\,\text{m/s}$; tra la cassa e il pavimento $\mu_d = 0{,}20$. Quanta energia dissipa l'attrito nei primi $2{,}0\,\text{m}$? Con che velocità la cassa arriva alla fine di quel tratto?

Il lavoro dell'attrito è

$$W_{attrito} = -\mu_d\, m g\, d = -0{,}20 \cdot 12\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 2{,}0\,\text{m} = -47{,}04\,\text{J} \approx -47\,\text{J}$$

e l'attrito dissipa $47\,\text{J}$. Sul piano orizzontale l'energia potenziale non cambia, e l'energia cinetica passa da $\tfrac{1}{2} \cdot 12 \cdot 4{,}0^2\,\text{J} = 96\,\text{J}$ a $96 - 47{,}04 = 48{,}96\,\text{J}$:

$$v_f = \sqrt{\frac{2 K_f}{m}} = \sqrt{\frac{2 \cdot 48{,}96\,\text{J}}{12\,\text{kg}}} = 2{,}85\ldots\,\text{m/s} \approx 2{,}9\,\text{m/s}$$

Dopo altri $2{,}1\,\text{m}$ circa la cassa si ferma: l'attrito ha dissipato tutti i $96\,\text{J}$ nello [spazio di frenata](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) $v^2 / (2 \mu_d\, g) = 4{,}1\,\text{m}$.
```

## Il bilancio dell'energia meccanica

Quando lavora anche l'attrito, il [teorema dell'energia cinetica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/l-energia-cinetica-e-il-teorema-dell-energia-cinetica) si scrive con il lavoro del peso e delle forze elastiche, $-\Delta U$, più il lavoro dell'attrito:

$$\Delta K = -\Delta U + W_{attrito} \quad\Rightarrow\quad \Delta E = W_{attrito}$$

La variazione dell'energia meccanica è uguale al lavoro dell'attrito, che è negativo: l'energia meccanica diminuisce. Tra la posizione iniziale e quella finale

$$K_f + U_f = K_i + U_i + W_{attrito}$$

L'**energia dissipata** è quello che manca: $E_i - E_f = -W_{attrito}$. Senza attrito $W_{attrito} = 0$, e si ritrova la [conservazione dell'energia meccanica](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica).

```ad-warning
Il segno del lavoro dell'attrito
Il lavoro dell'attrito è negativo, e l'energia finale è più piccola di quella iniziale. Chi scrive $E_f = E_i - W_{attrito}$ con $W_{attrito}$ già negativo trova un'energia finale più grande di quella iniziale: il controllo è che, con l'attrito, il corpo deve arrivare più lento che senza.
```

```ad-example
Esempio 2: uno scivolo vero
Un bambino di $25\,\text{kg}$ parte da fermo dalla cima di uno scivolo alto $3{,}2\,\text{m}$ e arriva in fondo a $6{,}0\,\text{m/s}$. Quanta energia è stata dissipata?

Con il riferimento in fondo allo scivolo, all'inizio l'energia è tutta potenziale e alla fine tutta cinetica:

$$E_i = m g h = 25\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 3{,}2\,\text{m} = 784\,\text{J} \qquad E_f = \frac{1}{2} m v^2 = \frac{1}{2} \cdot 25\,\text{kg} \cdot (6{,}0\,\text{m/s})^2 = 450\,\text{J}$$

L'energia dissipata è $784\,\text{J} - 450\,\text{J} = 334\,\text{J} \approx 3{,}3 \cdot 10^2\,\text{J}$, poco meno della metà di quella iniziale. Senza attriti il bambino arriverebbe a $7{,}9\,\text{m/s}$, come nell'esempio 1 della lezione sulla conservazione dell'energia meccanica.

```tikz
% nome: scivolo-bilancio-energia
% alt: Due barre della stessa lunghezza. In cima allo scivolo l'energia è tutta potenziale, U uguale a 784 joule; in fondo è divisa tra l'energia cinetica K, 450 joule, e l'energia dissipata, 334 joule
% svg: scivolo-bilancio-energia-9e824c52.svg 295x59
\begin{tikzpicture}
\node[left] at (0,1.2) {\small in cima};
\node[left] at (0,0.2) {\small in fondo};
\draw[thick, fill=orange!25] (0,1.0) rectangle (4.8,1.4);
\node at (2.4,1.2) {\small $U = 784$ J};
\draw[thick, fill=blue!10] (0,0.0) rectangle (2.755,0.4);
\node at (1.38,0.2) {\small $K = 450$ J};
\draw[thick, fill=red!15] (2.755,0.0) rectangle (4.8,0.4);
\node at (3.78,0.2) {\small $334$ J};
\node[right] at (4.8,0.2) {\small dissipata};
\end{tikzpicture}
```
```

```ad-example
Esempio 3: una rampa con l'attrito
Un blocco di $2{,}0\,\text{kg}$ parte da fermo e scivola per $2{,}0\,\text{m}$ lungo un piano inclinato di $30^\circ$, con $\mu_d = 0{,}20$. Con che velocità arriva in fondo?

Il blocco scende di $h = l \sin 30^\circ = 1{,}0\,\text{m}$, e perde l'energia potenziale $m g h = 2{,}0 \cdot 9{,}8 \cdot 1{,}0\,\text{J} = 19{,}6\,\text{J}$. Sul [piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato) la forza premente è $m g \cos 30^\circ$, quindi il lavoro dell'attrito è

$$W_{attrito} = -\mu_d\, m g \cos 30^\circ \cdot l = -0{,}20 \cdot 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}866 \cdot 2{,}0\,\text{m} = -6{,}78\ldots\,\text{J}$$

In fondo l'energia cinetica è $19{,}6\,\text{J} - 6{,}79\,\text{J} = 12{,}81\,\text{J}$, e

$$v = \sqrt{\frac{2K}{m}} = \sqrt{\frac{2 \cdot 12{,}81\,\text{J}}{2{,}0\,\text{kg}}} = 3{,}57\ldots\,\text{m/s} \approx 3{,}6\,\text{m/s}$$

contro i $4{,}4\,\text{m/s}$ che avrebbe senza attrito.
```

```ad-warning
La forza premente sul piano inclinato
Sul piano inclinato l'attrito è $\mu_d\, m g \cos\alpha$, non $\mu_d\, m g$: il piano sostiene solo la componente del peso perpendicolare a sé. Con $\mu_d\, m g$ nell'esempio 3 l'energia dissipata verrebbe $7{,}8\,\text{J}$ invece di $6{,}8\,\text{J}$.
```

Nella figura qui sotto il carrello delle montagne russe corre con l'attrito acceso: a ogni passaggio la barra dell'energia dissipata cresce, l'energia meccanica cala, e il carrello risale ogni volta un po' meno, finché si ferma in una valle. La somma delle tre barre resta sempre la stessa.

```interattivo
% nome: montagne-russe-attrito
% alt: Una pista delle montagne russe con un carrello di 500 chilogrammi, l'attrito acceso e un bottone che lo lascia andare. Accanto, le barre dell'energia cinetica K, dell'energia potenziale U, dell'energia dissipata e della loro somma: mentre il carrello corre la barra dell'energia dissipata cresce, l'energia meccanica diminuisce e la somma delle tre resta costante. Un interruttore spegne l'attrito; sotto sono scritti l'altezza, la velocità e le energie in kilojoule
```

## Dove va l'energia dissipata

L'energia dissipata dall'attrito non si perde: diventa **energia interna** dei corpi che strisciano, cioè energia di movimento delle loro molecole, e i corpi si scaldano. È il calore che senti strofinando le mani, quello che scalda i freni e i dischi di un'auto, quello che fa bruciare nell'atmosfera le meteore. James Prescott Joule, negli anni Quaranta dell'Ottocento, misurò di quanto si scalda l'acqua mescolata da una ruota a pale mossa da un peso che scende, e trovò che a un certo lavoro corrisponde sempre lo stesso riscaldamento: il calore è una forma di energia (lo si vede nella lezione [Calore, capacità termica e calore specifico](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico)).

```ad-example
Esempio 4: la frenata di un'auto
Un'auto di $1200\,\text{kg}$ viaggia a $72\,\text{km/h}$ e frena fino a fermarsi. Quanta energia diventa energia interna dei freni, dei dischi e delle gomme?

La velocità in metri al secondo è $72 : 3{,}6 = 20\,\text{m/s}$, e l'energia cinetica è

$$K = \frac{1}{2} m v^2 = \frac{1}{2} \cdot 1200\,\text{kg} \cdot (20\,\text{m/s})^2 = 240\,000\,\text{J} = 2{,}4 \cdot 10^5\,\text{J}$$

Su una strada in piano l'energia potenziale non cambia, e tutti i $2{,}4 \cdot 10^5\,\text{J}$ diventano energia interna.
```

## La conservazione dell'energia totale

L'energia meccanica è solo una delle forme dell'energia. Le altre sono l'energia interna (o termica), legata alla temperatura dei corpi; l'energia chimica, immagazzinata nei legami tra gli atomi del cibo e dei combustibili; l'energia elettrica, quella della corrente; l'energia della luce e delle altre radiazioni; l'energia nucleare, dei nuclei degli atomi. L'energia passa da una forma all'altra e da un corpo all'altro, e tutte le misure fatte finora dicono che in questi passaggi non si crea e non si distrugge mai:

$$\text{l'energia totale di un sistema isolato resta costante}$$

È il **principio di conservazione dell'energia**. Un sistema è isolato quando non scambia energia con l'esterno; se la scambia, la sua energia cambia di quanto ne entra o ne esce.

Alcune catene di trasformazioni:

- in una centrale idroelettrica l'acqua di un lago in quota perde energia potenziale scendendo nelle condotte, la sua energia cinetica fa girare le turbine, e gli alternatori la trasformano in energia elettrica;
- in un ciclista l'energia chimica del cibo diventa, nei muscoli, energia cinetica della bicicletta e in gran parte energia interna (il ciclista si scalda e suda);
- in una lampadina l'energia elettrica diventa luce ed energia interna del filamento o del circuito.

In ogni catena una parte dell'energia finisce in energia interna, che si disperde nell'ambiente e non si riesce più a usare del tutto: l'energia si conserva, ma diventa meno utile.

## Il rendimento

In una macchina che trasforma energia, una parte dell'energia spesa diventa quella che serve (l'energia utile), il resto si dissipa. Il **rendimento** $\eta$ (la lettera greca "eta") è il rapporto tra l'energia utile e l'energia spesa:

$$\eta = \frac{E_{utile}}{E_{spesa}}$$

È un numero puro, sempre minore di 1, e si scrive spesso in percentuale. Con la [potenza](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-potenza) il rapporto è lo stesso, $\eta = P_{utile} / P_{spesa}$, perché le due energie si misurano nello stesso tempo.

```ad-example
Esempio 5: il rendimento di un argano
Un argano elettrico solleva un carico di $45\,\text{kg}$ di $12\,\text{m}$, consumando $7{,}5\,\text{kJ}$ di energia elettrica. Qual è il suo rendimento?

L'energia utile è l'aumento di energia potenziale del carico:

$$E_{utile} = m g h = 45\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 12\,\text{m} = 5292\,\text{J}$$

$$\eta = \frac{E_{utile}}{E_{spesa}} = \frac{5292\,\text{J}}{7500\,\text{J}} = 0{,}705\ldots \approx 71\%$$

Gli altri $7500 - 5292 = 2208\,\text{J}$, circa $2{,}2\,\text{kJ}$, sono diventati energia interna del motore, dei cavi e degli ingranaggi.

```tikz
% nome: rendimento-energia-spesa-utile
% alt: Una fascia larga quanto l'energia spesa, 7500 joule, che si divide in due: una fascia che prosegue dritta, larga quanto l'energia utile, 5292 joule, e una più stretta che piega verso il basso, l'energia dissipata, 2208 joule
% svg: rendimento-energia-spesa-utile-bd3bcfdc.svg 228x87
\begin{tikzpicture}
\fill[orange!25] (0,0) rectangle (2,1.5);
\fill[blue!10] (2,0.442) -- (5,0.442) -- (5,1.5) -- (2,1.5) -- cycle;
\fill[red!15] (2,0) -- (2,0.442) .. controls (2.9,0.442) and (3.2,0.1) .. (3.4,-0.6) -- (2.98,-0.6) .. controls (2.8,-0.05) and (2.5,0) .. (2,0) -- cycle;
\draw[thin] (0,0) -- (2,0) .. controls (2.5,0) and (2.8,-0.05) .. (2.98,-0.6);
\draw[thin] (0,1.5) -- (5,1.5);
\draw[thin] (2,0.442) .. controls (2.9,0.442) and (3.2,0.1) .. (3.4,-0.6);
\draw[thin] (2,0.442) -- (5,0.442);
\node[align=center] at (1,0.75) {\small spesa \\ \small $7500$ J};
\node[align=center] at (3.8,0.97) {\small utile \\ \small $5292$ J};
\node[right] at (3.4,-0.45) {\small dissipata $2208$ J};
\end{tikzpicture}
```
```

```ad-example
Esempio 6: l'energia spesa dal rendimento
Un motore a benzina con un rendimento del $25\%$ deve fornire $3{,}0 \cdot 10^4\,\text{J}$ di energia utile. Quanta energia chimica consuma? Quanta ne dissipa?

Dalla definizione, $E_{spesa} = E_{utile} / \eta$:

$$E_{spesa} = \frac{3{,}0 \cdot 10^4\,\text{J}}{0{,}25} = 1{,}2 \cdot 10^5\,\text{J}$$

L'energia dissipata è $1{,}2 \cdot 10^5\,\text{J} - 3{,}0 \cdot 10^4\,\text{J} = 9{,}0 \cdot 10^4\,\text{J}$: tre quarti dell'energia del carburante scaldano il motore e i gas di scarico.
```

```ad-warning
Il rendimento non supera mai 1
Una macchina non può dare più energia di quella che riceve. Un rendimento più grande di 1, o del $100\%$, vuol dire che il rapporto è stato scritto al contrario: l'energia utile va sopra, quella spesa sotto. E per trovare l'energia spesa si divide per $\eta$, non si moltiplica: moltiplicando, l'energia spesa verrebbe più piccola di quella utile.
```
