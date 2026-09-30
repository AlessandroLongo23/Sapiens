# La forza centripeta

Nella lezione sull'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta) un corpo in moto circolare uniforme ha la velocità sempre dello stesso modulo, ma non ha accelerazione zero: la direzione della velocità cambia, e l'accelerazione punta verso il centro, con modulo $a_c = v^2/r$. Per il [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica) un'accelerazione ha bisogno di una forza. Questa lezione dice quanto deve valere, e chi la esercita.

## Quanto vale la forza centripeta

Un corpo di massa $m$ che percorre una circonferenza di raggio $r$ con velocità di modulo costante $v$ deve essere soggetto a una forza totale diretta verso il centro, di modulo

$$F_c = m\,a_c = m\,\frac{v^2}{r}$$

È la **forza centripeta**, cioè "che punta verso il centro". Con la velocità angolare $\omega$, visto che $v = \omega\,r$, si scrive anche

$$F_c = m\,\omega^2\,r$$

```tikz
% nome: forza-centripeta-filo-dall-alto
% alt: Una pallina che gira su una circonferenza di centro O, vista dall'alto, legata a un filo fissato in O. La velocità v, blu, è tangente alla circonferenza; la tensione del filo T, rossa, parte dalla pallina ed è diretta verso il centro O: è la forza centripeta
% svg: forza-centripeta-filo-dall-alto-0474168a.svg 140x164
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (1.8);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw (0,0) -- (1.5588,0.9);
\draw[-{Stealth}, thick, red] (1.5588,0.9) -- (0.7794,0.45) node[above] {$\vec{T}$};
\draw[-{Stealth}, thick, blue!60!black] (1.5588,0.9) -- (0.9588,1.9392) node[above] {$\vec{v}$};
\draw[thick, fill=blue!10] (1.5588,0.9) circle (4pt);
\node[below right] at (0.45,0.26) {$r$};
\end{tikzpicture}
```

La forza cresce con il quadrato della velocità: raddoppiando la velocità serve una forza quattro volte più grande. A parità di velocità, una curva più stretta, con $r$ più piccolo, chiede una forza più grande.

```ad-example
Esempio 1: la pallina legata al filo
Una pallina di $0{,}20\,\text{kg}$, legata a un filo lungo $0{,}80\,\text{m}$, gira su un tavolo orizzontale liscio attorno al capo fisso del filo, a $4{,}0\,\text{m/s}$. Quanto vale la tensione del filo?

Sul tavolo il peso della pallina è bilanciato dalla reazione del tavolo, e l'unica forza orizzontale è la tensione: è lei la forza centripeta.

$$T = m\,\frac{v^2}{r} = 0{,}20\,\text{kg} \cdot \frac{(4{,}0\,\text{m/s})^2}{0{,}80\,\text{m}} = 4{,}0\,\text{N}$$

A $8{,}0\,\text{m/s}$ il filo dovrebbe tirare con $16\,\text{N}$, quattro volte tanto.
```

```ad-warning
Il quadrato dimenticato
Nella formula la velocità è al quadrato: $m\,v^2/r$, non $m\,v/r$. Il controllo con le unità lo scopre: $\text{kg} \cdot \text{m/s} / \text{m} = \text{kg/s}$, che non è una forza, mentre $\text{kg} \cdot \text{m}^2/\text{s}^2 / \text{m} = \text{kg} \cdot \text{m/s}^2 = \text{N}$.
```

## Chi fa da forza centripeta

La forza centripeta non è un tipo di forza nuovo, come il peso, l'attrito o la forza elastica: è il nome del compito che una forza, o la somma di più forze, svolge nel moto circolare. Ogni volta si deve riconoscere quale forza vera tiene il corpo sulla circonferenza.

- La tensione di un filo: la pallina dell'esempio 1, il sasso nella fionda, il martello del lancio del martello prima che l'atleta lo lasci.
- L'attrito statico: un'auto che curva su una strada piana è tenuta sulla curva dall'attrito tra le gomme e l'asfalto, rivolto verso il centro della curva. È statico, perché le gomme non strisciano di lato.
- Il peso: la Luna gira attorno alla Terra, e un satellite in orbita, perché la gravità della Terra li attira verso il centro.
- La reazione vincolare: nel cestello di una lavatrice in centrifuga, la parete spinge i panni verso l'asse di rotazione.

```ad-example
Esempio 2: l'auto in curva
Un'auto percorre una curva piana di raggio $50\,\text{m}$; tra le gomme e l'asfalto asciutto $\mu_s = 0{,}80$. Qual è la velocità più alta con cui può affrontare la curva senza slittare?

La forza centripeta è l'attrito statico, che può arrivare al massimo a $\mu_s\,m\,g$ (su una strada piana la forza premente è il peso). L'auto resta in curva finché la forza che serve non supera il massimo:

$$m\,\frac{v^2}{r} \le \mu_s\,m\,g$$

La massa si semplifica, e la velocità massima è

$$v_{max} = \sqrt{\mu_s\,g\,r} = \sqrt{0{,}80 \cdot 9{,}8\,\text{m/s}^2 \cdot 50\,\text{m}} = 19{,}79\ldots\,\text{m/s} \approx 20\,\text{m/s}$$

cioè circa $71\,\text{km/h}$. Sull'asfalto bagnato, con $\mu_s = 0{,}40$, scende a $14\,\text{m/s}$, circa $50\,\text{km/h}$: per questo sul bagnato le curve si fanno più piano. La velocità massima non dipende dalla massa dell'auto.
```

```ad-example
Esempio 3: il disco e il pesetto
Un disco di $0{,}10\,\text{kg}$ scivola su un tavolo a cuscino d'aria, legato a un filo che passa per un foro al centro del tavolo e regge, sotto il tavolo, un pesetto di $0{,}20\,\text{kg}$. Il disco gira su una circonferenza di raggio $0{,}50\,\text{m}$ e il pesetto resta fermo. Con quale velocità gira il disco?

Il pesetto è fermo, quindi il filo lo tira con una tensione uguale al suo peso: $T = 0{,}20 \cdot 9{,}8\,\text{N} = 1{,}96\,\text{N}$. La stessa tensione, sull'altro capo, è la forza centripeta del disco:

$$m\,\frac{v^2}{r} = T \quad\Rightarrow\quad v = \sqrt{\frac{T\,r}{m}} = \sqrt{\frac{1{,}96\,\text{N} \cdot 0{,}50\,\text{m}}{0{,}10\,\text{kg}}} = 3{,}130\ldots\,\text{m/s} \approx 3{,}1\,\text{m/s}$$

Se il disco gira più piano, la tensione che serve è più piccola del peso del pesetto, che scende e tira il disco verso il centro, su un cerchio più stretto.
```

Quando le forze che fanno da forza centripeta sono più d'una, conta la loro somma nella direzione del centro. Un secchio d'acqua fatto girare in verticale, nel punto più alto del giro, ha sia il peso sia la tensione della corda rivolti verso il basso, cioè verso il centro:

$$T + m\,g = m\,\frac{v^2}{r}$$

La corda resta tesa, e l'acqua non cade, finché $m\,v^2/r$ è più grande di $m\,g$, cioè finché in cima $v \ge \sqrt{g\,r}$. Con un braccio di $0{,}90\,\text{m}$ servono almeno $\sqrt{9{,}8 \cdot 0{,}90} = 3{,}0\,\text{m/s}$ nel punto più alto. Il moto in verticale non è uniforme, perché il peso accelera il secchio in discesa e lo frena in salita, ma nel punto più alto la velocità è orizzontale e l'accelerazione verso il centro vale ancora $v^2/r$.

```ad-note
La Luna e la mela
La Luna gira attorno alla Terra su un'orbita quasi circolare di raggio $3{,}84 \cdot 10^8\,\text{m}$, in $27{,}3$ giorni. La sua accelerazione centripeta è $a_c = 4\pi^2 r / T^2 = 2{,}72 \cdot 10^{-3}\,\text{m/s}^2$, circa $g/3600$: la Luna è $60$ volte più lontana dal centro della Terra di una mela sulla superficie, e $60^2 = 3600$. È il confronto con cui Newton si convinse che la forza che fa cadere la mela è la stessa che tiene la Luna in orbita, e che diminuisce con il quadrato della distanza. La gravitazione si studia al terzo anno.
```

## Se il filo si spezza

Se la forza centripeta viene a mancare, per esempio perché il filo si spezza, sul corpo non agisce più nessuna forza orizzontale. Per il [primo principio](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali) il corpo prosegue in linea retta con la velocità che aveva in quell'istante: lungo la tangente alla circonferenza, non verso l'esterno.

```tikz
% nome: filo-spezzato-tangente
% alt: Una pallina che girava in senso antiorario su una circonferenza tratteggiata di centro O, vista dall'alto. Nel punto più alto il filo si spezza: la pallina prosegue in linea retta verso sinistra, lungo la tangente alla circonferenza in quel punto, ed è disegnata in tre posizioni successive a distanze uguali; il pezzo di filo rimasto resta attaccato al centro
% svg: filo-spezzato-tangente-251db08d.svg 208x158
\begin{tikzpicture}
\draw[thin, dashed] (0,0) circle (1.8);
\fill (0,0) circle (1.5pt) node[below] {$O$};
\draw (0,0) -- (0,1.1);
\draw[thin, dashed] (0,1.8) -- (-3.6,1.8);
\draw[-{Stealth}, thick, blue!60!black] (0,1.8) -- (-0.8,1.8) node[above] {$\vec{v}$};
\draw[thick, fill=blue!10] (0,1.8) circle (4pt);
\draw[thick, fill=blue!10, opacity=0.6] (-1.1,1.8) circle (4pt);
\draw[thick, fill=blue!10, opacity=0.6] (-2.2,1.8) circle (4pt);
\draw[thick, fill=blue!10, opacity=0.6] (-3.3,1.8) circle (4pt);
\end{tikzpicture}
```

È quello che si vede con una mola che fa scintille: i frammenti incandescenti partono lungo la tangente alla mola. Per lo stesso motivo un'auto che su una curva ghiacciata perde l'aderenza prosegue dritta, fuori dalla curva.

```ad-warning
Non c'è una forza che spinge verso l'esterno
Chi sta su un'auto in curva si sente spinto verso l'esterno, e si parla di "forza centrifuga". Ma, visto da terra, nessuna forza spinge il passeggero verso l'esterno: è il suo corpo che tende a proseguire dritto, per inerzia, mentre l'auto (il sedile, la portiera) lo costringe a curvare, spingendolo verso il centro. Per questo, quando il filo si spezza, la pallina non vola via lungo il raggio. La forza centrifuga è una [forza apparente](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-forze-apparenti-forza-centrifuga-e-forza-di-coriolis), che compare solo in chi guarda dall'auto, e si studia al terzo anno.
```

Nella figura qui sotto cambi la velocità e il raggio del giro e leggi la forza centripeta che il filo deve esercitare; poi spezzi il filo e guardi da che parte parte la pallina.

```interattivo
% nome: forza-centripeta-filo-spezzato
% alt: Una pallina di 0,20 chilogrammi che gira su un tavolo liscio legata a un filo, vista dall'alto, con due cursori per la velocità, da 0,5 a 4 metri al secondo, e per il raggio, da 0,3 a 1 metro. Sulla pallina sono disegnate la velocità, tangente, e la tensione del filo verso il centro, lunga in proporzione; sotto sono scritte l'accelerazione centripeta e la forza centripeta. Un bottone spezza il filo, e la pallina prosegue in linea retta lungo la tangente
```
