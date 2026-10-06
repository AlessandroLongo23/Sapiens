# Il teorema di Torricelli e l'effetto Venturi

Da una botte forata il vino zampilla tanto più forte quanto più il foro è in basso; uno spruzzatore di profumo aspira il liquido soffiandoci sopra dell'aria; un aereo di centinaia di tonnellate resta in aria perché si muove. Sono tre conseguenze dell'[equazione di Bernoulli](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-equazione-di-bernoulli),

$$p + \frac{1}{2}\,d\,v^2 + d\,g\,h = \text{costante}$$

applicata ogni volta a due punti scelti bene. In questa lezione l'equazione non cambia: cambiano le situazioni, e per ognuna si impara quali termini restano.

## Il teorema di Torricelli

Un serbatoio largo, aperto in alto, è pieno di liquido e ha un piccolo foro nella parete, a una profondità $h$ sotto la superficie libera. Con che velocità esce il liquido?

```tikz
% nome: torricelli-serbatoio-foro-profondita
% alt: Un serbatoio aperto in alto, pieno d'acqua, con un piccolo foro nella parete destra a una profondità h sotto la superficie libera. Il punto 1 è sulla superficie libera, dove l'acqua è praticamente ferma; il punto 2 è nel foro, da cui esce un getto orizzontale con velocità v indicata da una freccia blu. Su entrambi i punti agisce la pressione atmosferica p0
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (3,2.6);
\draw[thin] (0,2.6) -- (3,2.6);
\draw[thick] (0,3.1) -- (0,0) -- (3,0) -- (3,0.72);
\draw[thick] (3,0.88) -- (3,3.1);
\fill[cyan!20] (3,0.72) -- (3.5,0.72) .. controls (3.9,0.7) and (4.3,0.5) .. (4.6,0.1) -- (4.72,0.18) .. controls (4.4,0.62) and (3.95,0.86) .. (3.5,0.88) -- (3,0.88) -- cycle;
\fill (1.5,2.6) circle (1.5pt) node[above] {$1$};
\fill (3,0.8) circle (1.5pt);
\node[below left] at (3,0.75) {$2$};
\draw[-{Stealth}, thick, blue!60!black] (3.05,1.15) -- (4.1,1.15) node[above, pos=0.6] {$\vec{v}$};
\draw[{Stealth}-{Stealth}, thin] (2.2,0.8) -- (2.2,2.6);
\node[left] at (2.2,1.7) {$h$};
\draw[dashed, thin] (2.1,0.8) -- (2.75,0.8);
\node at (0.6,2.85) {$p_0$};
\node at (4.6,0.9) {$p_0$};
\end{tikzpicture}
```

Si scrive l'equazione di Bernoulli tra il punto 1, sulla superficie libera, e il punto 2, nel foro, con il livello di riferimento alla quota del foro ($h_2 = 0$, $h_1 = h$).

- Le pressioni sono uguali: sia la superficie libera sia il getto che esce sono a contatto con l'aria, quindi $p_1 = p_2 = p_0$, la pressione atmosferica.
- La velocità in superficie è trascurabile: il serbatoio è molto più largo del foro e, per l'[equazione di continuità](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/la-portata-e-l-equazione-di-continuita), il livello scende molto più lentamente di quanto il liquido esca. Si pone $v_1 = 0$.

Resta

$$p_0 + d\,g\,h = p_0 + \frac{1}{2}\,d\,v^2$$

La pressione atmosferica si semplifica, e anche la densità. È il **teorema di Torricelli**: la velocità con cui un liquido esce da un piccolo foro a profondità $h$ sotto la superficie libera è

$$v = \sqrt{2\,g\,h}$$

È la stessa velocità che avrebbe un corpo lasciato [cadere da fermo](/materiale/scuola-superiore/fisica/lavoro-ed-energia/la-conservazione-dell-energia-meccanica) da un'altezza $h$. Non è una coincidenza: il liquido che esce dal foro è sostituito, nel bilancio dell'energia, da quello che scende dalla superficie, e l'energia potenziale persa diventa energia cinetica. La velocità non dipende dalla densità del liquido (acqua, olio e mercurio escono alla stessa velocità), come la velocità di caduta non dipende dalla massa. Evangelista Torricelli, allievo di Galileo e inventore del barometro, enunciò il risultato nel 1644, un secolo prima che Bernoulli scrivesse la sua equazione.

```ad-warning
La profondità si misura dalla superficie libera
Nella formula $h$ è la distanza in verticale tra la superficie libera e il foro, non l'altezza del foro dal fondo. Se il serbatoio è pieno fino a $1{,}50\,\text{m}$ e il foro è a $0{,}30\,\text{m}$ dal fondo, $h = 1{,}50\,\text{m} - 0{,}30\,\text{m} = 1{,}20\,\text{m}$. E la velocità cresce con la radice di $h$: a profondità quadrupla il liquido esce a velocità doppia, non quadrupla.
```

```ad-example
Esempio 1: la velocità di uscita
Una cisterna aperta è piena d'acqua. Nella parete c'è un forellino $0{,}80\,\text{m}$ sotto la superficie libera. Con che velocità esce l'acqua?

$$v = \sqrt{2\,g\,h} = \sqrt{2 \cdot 9{,}8\,\frac{\text{m}}{\text{s}^2} \cdot 0{,}80\,\text{m}} = \sqrt{15{,}68\,\frac{\text{m}^2}{\text{s}^2}} \approx 4{,}0\,\frac{\text{m}}{\text{s}}$$
```

```ad-note
Quando il teorema non basta
Il teorema vale finché il foro è piccolo rispetto al serbatoio e la superficie libera e il getto sono alla stessa pressione. Man mano che il serbatoio si svuota $h$ diminuisce e il getto rallenta. Se il serbatoio è chiuso e sopra il liquido c'è un gas a pressione $p_1$ diversa da $p_0$, le pressioni non si semplificano e si torna all'equazione di Bernoulli completa.
```

### Dove arriva il getto

Uscito dal foro in orizzontale, il liquido non è più spinto da niente: cade, come un [proiettile lanciato in orizzontale](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-di-un-proiettile-lanciato-in-orizzontale) con velocità $v$. Se il foro è a un'altezza $y$ dal suolo, il tempo di caduta e la distanza $x$ a cui il getto tocca terra sono

$$t = \sqrt{\frac{2\,y}{g}} \qquad\qquad x = v \cdot t = \sqrt{2\,g\,h} \cdot \sqrt{\frac{2\,y}{g}} = 2\sqrt{h \cdot y}$$

Un foro in alto ha tanto tempo per cadere ma poca velocità, uno in basso tanta velocità ma poco tempo.

```ad-example
Esempio 2: il getto di una botte
Una botte appoggiata a terra è piena d'acqua fino a $1{,}25\,\text{m}$ dal suolo. Nella parete, a $0{,}45\,\text{m}$ dal suolo, c'è un foro circolare di diametro $1{,}0\,\text{cm}$. A che distanza dalla botte il getto tocca terra? Quanta acqua esce al secondo?

Il foro è alla profondità $h = 1{,}25\,\text{m} - 0{,}45\,\text{m} = 0{,}80\,\text{m}$, quella dell'esempio 1: l'acqua esce a $v = 3{,}96\,\text{m/s}$ (si tiene una cifra in più per i conti che seguono). Il getto cade per $y = 0{,}45\,\text{m}$:

$$t = \sqrt{\frac{2\,y}{g}} = \sqrt{\frac{2 \cdot 0{,}45\,\text{m}}{9{,}8\,\text{m/s}^2}} = 0{,}303\,\text{s} \qquad\qquad x = v \cdot t = 3{,}96\,\frac{\text{m}}{\text{s}} \cdot 0{,}303\,\text{s} = 1{,}2\,\text{m}$$

Con la formula diretta, $x = 2\sqrt{0{,}80\,\text{m} \cdot 0{,}45\,\text{m}} = 2 \cdot 0{,}60\,\text{m} = 1{,}2\,\text{m}$. La portata è $q = S \cdot v$, con il raggio del foro $r = 0{,}50\,\text{cm} = 5{,}0 \cdot 10^{-3}\,\text{m}$:

$$q = \pi\,r^2 \cdot v = \pi \cdot (5{,}0 \cdot 10^{-3}\,\text{m})^2 \cdot 3{,}96\,\frac{\text{m}}{\text{s}} = 3{,}1 \cdot 10^{-4}\,\frac{\text{m}^3}{\text{s}}$$

cioè $0{,}31$ litri al secondo.
```

```tikz
% nome: botte-getto-gittata
% alt: Una botte piena d'acqua fino a 1,25 metri dal suolo, con un foro nella parete destra a 0,45 metri dal suolo, cioè 0,80 metri sotto la superficie. Dal foro esce un getto che descrive un arco di parabola e tocca terra a 1,2 metri dalla botte
\begin{tikzpicture}[scale=2]
\fill[cyan!20] (-1.2,0) rectangle (0,1.25);
\draw[thin] (-1.2,1.25) -- (0,1.25);
\draw[thick] (-1.2,1.5) -- (-1.2,0) -- (0,0) -- (0,0.42);
\draw[thick] (0,0.48) -- (0,1.5);
\draw[thick] (-1.5,0) -- (1.7,0);
\foreach \x in {-1.4,-1.25,...,1.7} \draw[thin] (\x,0) -- ++(-0.08,-0.08);
\draw[thick, cyan!60!blue, domain=0:1.2, samples=30] plot (\x,{0.45-0.3125*\x*\x});
\draw[{Stealth}-{Stealth}, thin] (-0.2,0.45) -- (-0.2,1.25);
\node[left] at (-0.2,0.85) {\small $h = 0{,}80$ m};
\draw[{Stealth}-{Stealth}, thin] (-0.2,0) -- (-0.2,0.45);
\node[left] at (-0.2,0.22) {\small $y = 0{,}45$ m};
\draw[dashed, thin] (-0.3,0.45) -- (0,0.45);
\draw[{Stealth}-{Stealth}, thin] (0,-0.25) -- (1.2,-0.25);
\node[below] at (0.6,-0.25) {\small $x = 1{,}2$ m};
\draw[-{Stealth}, thick, blue!60!black] (0.03,0.6) -- (0.5,0.6) node[above, pos=0.6] {$\vec{v}$};
\end{tikzpicture}
```

Nella figura qui sotto il serbatoio è pieno fino a un metro e puoi spostare il foro lungo la parete. La domanda: da quale altezza il getto arriva più lontano?

```interattivo
% nome: serbatoio-foro-getto
% alt: Un serbatoio pieno d'acqua fino a un metro di altezza, con un foro nella parete che si sposta in verticale trascinandolo o con un cursore, da 10 a 90 centimetri dal suolo. Dal foro esce un getto a forma di parabola che arriva a terra; sotto la figura si leggono la profondità del foro, la velocità di uscita, il tempo di caduta e la distanza a cui il getto tocca terra. Una tacca sul suolo segna la distanza massima, un metro
```

Dal foro a metà altezza. La gittata $x = 2\sqrt{h \cdot y}$ dipende dal prodotto di due numeri, $h$ e $y$, che hanno somma fissa (l'altezza dell'acqua), e un prodotto così è massimo quando i due numeri sono uguali. Con l'acqua a $1{,}00\,\text{m}$, il foro a $50\,\text{cm}$ manda il getto a $1{,}00\,\text{m}$; due fori alla stessa distanza dalla metà, per esempio a $20\,\text{cm}$ e a $80\,\text{cm}$ dal suolo, lo mandano tutti e due a $0{,}80\,\text{m}$, perché si scambiano $h$ e $y$.

## L'effetto Venturi

In un tubo orizzontale l'equazione di Bernoulli perde il termine della quota, e dove il tubo si stringe il fluido accelera e la sua pressione scende. Questo abbassamento di pressione in una strozzatura si chiama **effetto Venturi**, dal fisico italiano Giovanni Battista Venturi, che lo studiò alla fine del Settecento.

L'effetto si sfrutta per misurare la velocità di un fluido in un condotto senza metterci dentro niente che si muova. Un **tubo di Venturi** (o venturimetro) è un tratto di tubo orizzontale con una strozzatura: la sezione passa da $S_1$ a $S_2$, più piccola, e un manometro misura la differenza di pressione $p_1 - p_2$ tra il tratto largo e la strozzatura.

```tikz
% nome: tubo-di-venturi-dislivello
% alt: Un tubo di Venturi: un tubo orizzontale pieno d'acqua con un tratto largo di sezione S1 e una strozzatura di sezione S2. Su ciascun tratto è montato un tubicino verticale aperto: nel tratto largo l'acqua sale più in alto che nella strozzatura, e il dislivello tra le due colonne è indicato con delta h. Frecce blu indicano le velocità v1, corta, e v2, lunga
\begin{tikzpicture}
\fill[cyan!20] (0,-0.6) -- (2.4,-0.6) -- (3.4,-0.3) -- (6,-0.3) -- (6,0.3) -- (3.4,0.3) -- (2.4,0.6) -- (0,0.6) -- cycle;
\fill[cyan!20] (1.05,0.6) rectangle (1.35,2.7);
\fill[cyan!20] (4.45,0.3) rectangle (4.75,1.5);
\draw[thick] (0,-0.6) -- (2.4,-0.6) -- (3.4,-0.3) -- (6,-0.3);
\draw[thick] (0,0.6) -- (1.05,0.6) -- (1.05,3.1);
\draw[thick] (1.35,3.1) -- (1.35,0.6) -- (2.4,0.6) -- (3.4,0.3) -- (4.45,0.3) -- (4.45,3.1);
\draw[thick] (4.75,3.1) -- (4.75,0.3) -- (6,0.3);
\draw[thin] (1.05,2.7) -- (1.35,2.7);
\draw[thin] (4.45,1.5) -- (4.75,1.5);
\draw[dashed, thin] (1.35,2.7) -- (5.5,2.7);
\draw[dashed, thin] (4.75,1.5) -- (5.5,1.5);
\draw[{Stealth}-{Stealth}, thin] (5.3,1.5) -- (5.3,2.7);
\node[right] at (5.3,2.1) {$\Delta h$};
\draw[-{Stealth}, thick, blue!60!black] (0.3,0) -- (0.8,0) node[above] {$\vec{v}_1$};
\draw[-{Stealth}, thick, blue!60!black] (3.5,0) -- (5.5,0);
\node[below, blue!60!black] at (5.2,-0.3) {$\vec{v}_2$};
\node[below] at (1.2,-0.6) {$S_1$, $p_1$};
\node[below] at (4.0,-0.3) {$S_2$, $p_2$};
\end{tikzpicture}
```

Le equazioni sono due. La continuità lega le velocità, Bernoulli lega velocità e pressioni:

$$v_2 = v_1 \cdot \frac{S_1}{S_2} \qquad\qquad p_1 - p_2 = \frac{1}{2}\,d\,(v_2^2 - v_1^2)$$

Sostituendo la prima nella seconda:

$$p_1 - p_2 = \frac{1}{2}\,d\,v_1^2 \left[\left(\frac{S_1}{S_2}\right)^2 - 1\right]$$

e da qui la velocità del fluido nel tratto largo:

$$v_1 = \sqrt{\frac{2\,(p_1 - p_2)}{d \left[\left(\dfrac{S_1}{S_2}\right)^2 - 1\right]}}$$

La differenza di pressione si può leggere, come nella figura, dal dislivello $\Delta h$ tra due tubicini verticali: per la [legge di Stevino](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-legge-di-stevino-e-i-vasi-comunicanti), $p_1 - p_2 = d\,g\,\Delta h$.

```ad-example
Esempio 3: il venturimetro
In una conduttura d'acqua è inserito un tubo di Venturi: il tratto largo ha sezione $10\,\text{cm}^2$, la strozzatura $5{,}0\,\text{cm}^2$. Il manometro misura tra i due tratti una differenza di pressione di $6{,}0 \cdot 10^3\,\text{Pa}$. Con che velocità scorre l'acqua nella conduttura, e qual è la portata?

Il rapporto delle sezioni è $S_1 / S_2 = 2{,}0$, quindi il termine tra parentesi quadre vale $2{,}0^2 - 1 = 3{,}0$:

$$v_1 = \sqrt{\frac{2 \cdot 6{,}0 \cdot 10^3\,\text{Pa}}{1000\,\text{kg/m}^3 \cdot 3{,}0}} = \sqrt{4{,}0\,\frac{\text{m}^2}{\text{s}^2}} = 2{,}0\,\frac{\text{m}}{\text{s}}$$

Nella strozzatura l'acqua va a $v_2 = 4{,}0\,\text{m/s}$. La portata, con $S_1 = 10\,\text{cm}^2 = 1{,}0 \cdot 10^{-3}\,\text{m}^2$:

$$q = S_1 \cdot v_1 = 1{,}0 \cdot 10^{-3}\,\text{m}^2 \cdot 2{,}0\,\frac{\text{m}}{\text{s}} = 2{,}0 \cdot 10^{-3}\,\frac{\text{m}^3}{\text{s}}$$

cioè $2{,}0$ litri al secondo. Controllo: $\tfrac{1}{2} \cdot 1000 \cdot (4{,}0^2 - 2{,}0^2) = 6{,}0 \cdot 10^3\,\text{Pa}$.
```

```ad-warning
Nella formula entra il rapporto delle sezioni al quadrato
Con i diametri il rapporto va elevato alla quarta: $S_1/S_2 = (D_1/D_2)^2$, quindi $(S_1/S_2)^2 = (D_1/D_2)^4$. Una strozzatura con il diametro pari alla metà ha la sezione pari a un quarto, e il termine tra parentesi vale $4^2 - 1 = 15$, non $2^2 - 1 = 3$.
```

Lo stesso effetto fa funzionare gli spruzzatori: nel flacone di profumo, nell'aerografo e nella pistola a spruzzo un getto d'aria veloce passa sopra l'imboccatura di un tubicino che pesca nel liquido. Sopra il tubicino la pressione scende sotto quella atmosferica, che invece continua a premere sul liquido nel serbatoio, e il liquido sale e viene trascinato via dal getto in goccioline.

## Il tubo di Pitot

Per misurare la velocità di un aereo rispetto all'aria si usa un altro strumento, il **tubo di Pitot** (dal francese Henri Pitot, che lo inventò nel Settecento per misurare la velocità della Senna). È un tubo sottile puntato contro la corrente, con due prese di pressione: una sulla punta, rivolta verso il fluido che arriva, e una sul fianco.

```tikz
% nome: tubo-di-pitot-prese-pressione
% alt: Un tubo di Pitot visto in sezione, immerso in una corrente d'aria che arriva da sinistra con velocità v. Sulla punta, nel punto 2, l'aria si ferma: è il punto di ristagno. Sul fianco, nel punto 1, l'aria scorre con velocità v. Un manometro collegato alle due prese misura la differenza di pressione p2 meno p1
\begin{tikzpicture}
\foreach \y in {1.5,-1.5} \draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}] (-2,\y) -- (5,\y);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.3 with {\arrow{Stealth}}}] (-2,0.75) -- (-0.4,0.75) .. controls (0.2,0.78) and (0.4,0.95) .. (1,0.95) -- (5,0.95);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.3 with {\arrow{Stealth}}}] (-2,-0.75) -- (-0.4,-0.75) .. controls (0.2,-0.78) and (0.4,-0.95) .. (1,-0.95) -- (5,-0.95);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.6 with {\arrow{Stealth}}}] (-2,0) -- (0,0);
\draw[thick, fill=gray!20] (5,0.5) -- (0.5,0.5) .. controls (0.15,0.5) and (0,0.25) .. (0,0) .. controls (0,-0.25) and (0.15,-0.5) .. (0.5,-0.5) -- (5,-0.5);
\fill (0,0) circle (1.5pt) node[above left] {$2$};
\fill (2.6,0.5) circle (1.5pt) node[above] {$1$};
\node[right] at (0.15,0) {\small $v_2 = 0$};
\node[above] at (-1.3,1.5) {$\vec{v}$};
\node at (3.7,0) {\small manometro: $p_2 - p_1$};
\end{tikzpicture}
```

Il fluido che arriva proprio sulla punta si ferma: quel punto si chiama **punto di ristagno**, e lì $v_2 = 0$. Il fluido che passa sul fianco, invece, scorre con la velocità $v$ che ha lontano dal tubo, cioè la velocità dell'aereo rispetto all'aria, e ha la pressione $p_1$ dell'aria indisturbata. I due punti sono praticamente alla stessa quota, e l'equazione di Bernoulli dà

$$p_1 + \frac{1}{2}\,d\,v^2 = p_2$$

Nel punto di ristagno tutta l'energia cinetica è diventata pressione. Il manometro misura la differenza $p_2 - p_1$, e la velocità è

$$v = \sqrt{\frac{2\,(p_2 - p_1)}{d}}$$

dove $d$ è la densità del fluido in moto: l'aria per un aereo, l'acqua per una barca.

```ad-example
Esempio 4: la velocità di un aereo
Il tubo di Pitot di un piccolo aereo misura, tra la presa sulla punta e quella sul fianco, una differenza di pressione di $2{,}4 \cdot 10^3\,\text{Pa}$. La densità dell'aria è $1{,}2\,\text{kg/m}^3$. A che velocità vola l'aereo rispetto all'aria?

$$v = \sqrt{\frac{2\,(p_2 - p_1)}{d}} = \sqrt{\frac{2 \cdot 2{,}4 \cdot 10^3\,\text{Pa}}{1{,}2\,\text{kg/m}^3}} = \sqrt{4{,}0 \cdot 10^3\,\frac{\text{m}^2}{\text{s}^2}} \approx 63\,\frac{\text{m}}{\text{s}}$$

cioè circa $230\,\text{km/h}$. In quota l'aria è meno densa, e la stessa differenza di pressione corrisponde a una velocità maggiore: gli strumenti di bordo ne tengono conto.
```

```ad-warning
La densità è quella del fluido che scorre
Nel tubo di Pitot di un aereo $d$ è la densità dell'aria, non quella del liquido del manometro. Con $1000\,\text{kg/m}^3$ al posto di $1{,}2\,\text{kg/m}^3$ la velocità dell'esempio verrebbe $2{,}2\,\text{m/s}$, quella di una persona che cammina svelta.
```

## La portanza

L'ala di un aereo ha un profilo studiato perché l'aria le scorra attorno in un modo preciso: la forma e l'inclinazione dell'ala fanno sì che l'aria passi più veloce sopra che sotto, e che dietro l'ala venga deviata verso il basso. Dove l'aria è più veloce le linee di flusso sono più fitte.

```tikz
% nome: profilo-alare-linee-di-flusso
% alt: Il profilo di un'ala visto in sezione, con l'aria che arriva da sinistra. Sopra l'ala le linee di flusso sono fitte: l'aria è veloce e la pressione bassa. Sotto l'ala sono più distanti: l'aria è più lenta e la pressione più alta. Una freccia rossa verso l'alto, applicata all'ala, indica la portanza
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) .. controls (0.4,0.75) and (2.6,0.75) .. (4.4,-0.15) .. controls (2.8,-0.05) and (0.6,-0.3) .. (0,0);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.12 with {\arrow{Stealth}}}] (-1.6,0.35) .. controls (-0.4,0.4) and (0.4,1.0) .. (1.6,0.82) .. controls (2.8,0.65) and (4.2,0.2) .. (5.8,-0.05);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.12 with {\arrow{Stealth}}}] (-1.6,0.75) .. controls (-0.4,0.8) and (0.5,1.2) .. (1.6,1.05) .. controls (2.8,0.9) and (4.2,0.55) .. (5.8,0.35);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.12 with {\arrow{Stealth}}}] (-1.6,1.2) .. controls (-0.4,1.22) and (0.6,1.42) .. (1.6,1.3) .. controls (2.8,1.18) and (4.2,0.95) .. (5.8,0.8);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.12 with {\arrow{Stealth}}}] (-1.6,-0.15) .. controls (-0.5,-0.2) and (0.3,-0.55) .. (1.6,-0.5) .. controls (2.8,-0.48) and (4.2,-0.5) .. (5.8,-0.55);
\draw[blue!60!black, postaction={decorate}, decoration={markings, mark=at position 0.12 with {\arrow{Stealth}}}] (-1.6,-0.7) .. controls (-0.5,-0.72) and (0.5,-1.0) .. (1.6,-1.0) .. controls (2.8,-1.0) and (4.2,-1.0) .. (5.8,-1.05);
\draw[-{Stealth}, thick, red] (1.7,0.2) -- (1.7,2.1) node[right] {$\vec{F}$};
\fill (1.7,0.2) circle (1.5pt);
\node[right] at (5.9,0.75) {\small veloce, $p$ bassa};
\node[right] at (5.9,-0.85) {\small lenta, $p$ alta};
\end{tikzpicture}
```

Per l'equazione di Bernoulli, sopra l'ala, dove l'aria è più veloce, la pressione è più bassa che sotto. La differenza di pressione tra la faccia inferiore e quella superiore dà una forza diretta verso l'alto, la **portanza**. Se $v_s$ e $v_i$ sono le velocità dell'aria sopra e sotto l'ala e $S$ è la superficie dell'ala,

$$p_i - p_s = \frac{1}{2}\,d\,(v_s^2 - v_i^2) \qquad\qquad F = (p_i - p_s) \cdot S$$

L'aereo vola in orizzontale quando la portanza equilibra il peso. Poiché la portanza cresce con il quadrato della velocità, sotto una certa velocità l'ala non regge più l'aereo: per questo serve una pista per decollare.

```ad-example
Esempio 5: la portanza di un piccolo aereo
In volo l'aria scorre a $70\,\text{m/s}$ sopra le ali di un aereo da turismo e a $60\,\text{m/s}$ sotto. Le ali hanno una superficie totale di $20\,\text{m}^2$ e la densità dell'aria è $1{,}2\,\text{kg/m}^3$. Quanto vale la portanza? Quale massa può sostenere?

$$p_i - p_s = \frac{1}{2}\,d\,(v_s^2 - v_i^2) = \frac{1}{2} \cdot 1{,}2\,\frac{\text{kg}}{\text{m}^3} \cdot (4900 - 3600)\,\frac{\text{m}^2}{\text{s}^2} = 7{,}8 \cdot 10^2\,\text{Pa}$$

$$F = (p_i - p_s) \cdot S = 7{,}8 \cdot 10^2\,\text{Pa} \cdot 20\,\text{m}^2 = 1{,}6 \cdot 10^4\,\text{N}$$

In volo orizzontale la portanza è uguale al peso, $F = m\,g$:

$$m = \frac{F}{g} = \frac{1{,}6 \cdot 10^4\,\text{N}}{9{,}8\,\text{m/s}^2} = 1{,}6 \cdot 10^3\,\text{kg}$$

Basta una differenza di pressione inferiore all'uno per cento della pressione atmosferica per tenere in aria un aereo di una tonnellata e mezza.
```

```ad-note
Che cosa spiega Bernoulli e che cosa no
L'equazione di Bernoulli dice quanto vale la differenza di pressione una volta note le due velocità. Non dice perché l'aria sopra l'ala è più veloce: questo dipende dalla forma del profilo, dall'inclinazione dell'ala e dalla viscosità dell'aria, e si studia all'università. La spiegazione che ogni tanto si legge, secondo cui l'aria di sopra "deve fare più strada nello stesso tempo" per ricongiungersi con quella di sotto, è sbagliata: le due correnti non si ricongiungono. La portanza si può descrivere anche con il [terzo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica): l'ala spinge l'aria verso il basso, l'aria spinge l'ala verso l'alto.
```

Lo stesso meccanismo, capovolto, tiene incollate alla pista le auto da corsa: i loro alettoni sono ali rovesciate, e la forza che ne risulta è diretta verso il basso.

## Quale formula in quale situazione

| Situazione | Punti da confrontare | Risultato |
|---|---|---|
| Foro in un serbatoio aperto | superficie libera e foro | $v = \sqrt{2\,g\,h}$ |
| Getto che cade da un foro ad altezza $y$ | il foro e il suolo | $x = 2\sqrt{h \cdot y}$ |
| Tubo di Venturi | tratto largo e strozzatura | $p_1 - p_2 = \tfrac{1}{2}\,d\,(v_2^2 - v_1^2)$ |
| Tubo di Pitot | fianco e punto di ristagno | $v = \sqrt{2\,(p_2 - p_1)/d}$ |
| Ala | sotto e sopra | $F = \tfrac{1}{2}\,d\,(v_s^2 - v_i^2) \cdot S$ |

Tutti questi risultati valgono per un fluido ideale. L'aria e l'acqua vere hanno un attrito interno, che in molte situazioni conta: è l'argomento della lezione [L'attrito viscoso e la velocità limite](/materiale/scuola-superiore/fisica/la-meccanica-dei-fluidi/l-attrito-viscoso-e-la-velocita-limite).
