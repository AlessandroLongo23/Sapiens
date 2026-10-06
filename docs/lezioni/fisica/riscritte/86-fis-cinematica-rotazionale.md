# Velocità angolare e accelerazione angolare

Il cestello della lavatrice che parte per la centrifuga, le pale di un ventilatore che continuano a girare sempre più piano dopo che l'hai spento, la ruota della bicicletta quando tiri il freno: sono corpi che ruotano attorno a un asse con una rapidità che cambia. Il [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme) del biennio descrive un punto che gira sempre allo stesso ritmo; per le rotazioni che partono, accelerano e si fermano serve una grandezza in più, l'accelerazione angolare, e con lei arrivano leggi del moto che hanno la stessa forma di quelle del [moto uniformemente accelerato](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-moto-uniformemente-accelerato) su una retta.

## La rotazione di un corpo rigido

Un **corpo rigido** è un corpo che non si deforma: la distanza tra due suoi punti qualsiasi resta sempre la stessa. Una ruota, una porta, un disco sono corpi rigidi con ottima approssimazione. Quando un corpo rigido ruota attorno a un asse fisso, ogni suo punto percorre una circonferenza che ha il centro sull'asse; i punti sull'asse restano fermi.

I punti lontani dall'asse percorrono circonferenze grandi, quelli vicini circonferenze piccole, ma in uno stesso intervallo di tempo tutti i raggi ruotano dello stesso angolo, perché il corpo non si deforma. Per dire dove si trova il corpo serve quindi un solo numero: la **posizione angolare** $\theta$, l'angolo tra una retta fissa di riferimento e una retta disegnata sul corpo, che gira con lui. L'angolo si misura in radianti, come nel moto circolare uniforme, e si prende positivo quando il corpo gira in senso antiorario.

Se il corpo passa dalla posizione $\theta_0$ alla posizione $\theta$, il suo **spostamento angolare** è

$$\Delta\theta = \theta - \theta_0$$

Un giro completo è uno spostamento angolare di $2\pi\,\text{rad}$, quindi $N$ giri valgono $\Delta\theta = 2\pi N$. Un punto a distanza $r$ dall'asse percorre intanto un arco lungo $l = r\,\Delta\theta$.

```tikz
% nome: spostamento-angolare-disco
% alt: Un disco che ruota in senso antiorario attorno al centro O. Una retta di riferimento tratteggiata è orizzontale; un raggio del disco è ruotato di un angolo delta theta rispetto a essa. Sul raggio ci sono due punti, P1 a metà raggio e P2 sul bordo: hanno spazzato lo stesso angolo, ma l'arco arancione percorso da P2 è lungo il doppio di quello di P1
% svg: spostamento-angolare-disco-d159f69f.svg 182x157
\begin{tikzpicture}
\draw[thick, fill=gray!20] (0,0) circle (2);
\draw[dashed, thin] (0,0) -- (2.7,0);
\draw[thick] (0,0) -- (50:2);
\draw[very thick, orange!90!black] (1,0) arc[start angle=0, end angle=50, radius=1];
\draw[very thick, orange!90!black] (2,0) arc[start angle=0, end angle=50, radius=2];
\draw (0.45,0) arc[start angle=0, end angle=50, radius=0.45];
\node at (25:0.75) {\small $\Delta\theta$};
\fill (50:1) circle (1.5pt) node[above left] {$P_1$};
\fill (50:2) circle (1.5pt) node[above right] {$P_2$};
\node[orange!90!black, right] at (20:1.02) {\small $l_1$};
\node[orange!90!black, right] at (25:2.05) {\small $l_2$};
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[-{Stealth}, thin] (115:1.3) arc[start angle=115, end angle=165, radius=1.3];
\end{tikzpicture}
```

Nella figura $P_2$ è a distanza doppia di $P_1$ dal centro: l'angolo $\Delta\theta$ è lo stesso per i due punti, l'arco $l_2$ è il doppio di $l_1$.

## La velocità angolare

La **velocità angolare media** dice di quanto ruota il corpo in ogni secondo:

$$\omega_m = \frac{\Delta\theta}{\Delta t}$$

Si misura in radianti al secondo, $\text{rad/s}$. Se l'intervallo $\Delta t$ è così breve che la rotazione, lì dentro, non fa in tempo a cambiare ritmo, il rapporto dà la **velocità angolare istantanea** $\omega$, come succede per la [velocità istantanea](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-velocita-media-e-istantanea) di un'auto. Con la scelta fatta per gli angoli, $\omega$ è positiva se il corpo gira in senso antiorario e negativa se gira in senso orario.

Tutti i punti di un corpo rigido hanno, in ogni istante, la stessa velocità angolare: per questo si parla della velocità angolare del corpo, senza dire di quale punto.

Motori ed elettrodomestici danno la rapidità di rotazione in giri al minuto. Un giro vale $2\pi\,\text{rad}$ e un minuto $60\,\text{s}$, quindi $n$ giri al minuto sono

$$\omega = \frac{2\pi\,n}{60\,\text{s}}$$

Un trapano che fa $900$ giri al minuto ha $\omega = 2\pi \cdot 900 / 60\,\text{s} = 94{,}2\ldots\,\text{rad/s} \approx 94\,\text{rad/s}$.

```ad-note
La velocità angolare come vettore
Alla velocità angolare si associa anche un vettore $\vec\omega$: ha la direzione dell'asse di rotazione e il verso dato dalla regola della mano destra (le dita chiuse seguono la rotazione, il pollice indica $\vec\omega$), la stessa del [prodotto vettoriale](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/prodotto-scalare-e-prodotto-vettoriale). Finché l'asse resta fisso, come in questa lezione, del vettore serve solo il segno.
```

## L'accelerazione angolare

Quando la velocità angolare cambia, la rapidità con cui cambia è l'**accelerazione angolare media**:

$$\alpha_m = \frac{\Delta\omega}{\Delta t} = \frac{\omega - \omega_0}{\Delta t}$$

dove $\omega_0$ è la velocità angolare all'inizio dell'intervallo e $\omega$ quella alla fine. L'unità di misura è il radiante al secondo quadrato, $\text{rad/s}^2$: un'accelerazione angolare di $2\,\text{rad/s}^2$ vuol dire che ogni secondo la velocità angolare aumenta di $2\,\text{rad/s}$. Su un intervallo brevissimo si ha l'accelerazione angolare istantanea $\alpha$, e anche questa è la stessa per tutti i punti del corpo.

Il segno di $\alpha$ da solo non dice se il corpo accelera o rallenta: conta il confronto con il segno di $\omega$. Se $\alpha$ e $\omega$ hanno lo stesso segno la rotazione diventa più rapida, se hanno segni opposti rallenta. È la stessa regola dell'[accelerazione](/materiale/scuola-superiore/fisica/il-moto-rettilineo/l-accelerazione) e della velocità su una retta.

```ad-example
Esempio 1: la centrifuga che parte
Il cestello di una lavatrice, fermo, raggiunge i $1200$ giri al minuto della centrifuga in $8{,}0\,\text{s}$. Quanto vale la sua accelerazione angolare media?

La velocità angolare finale, in radianti al secondo, è

$$\omega = \frac{2\pi \cdot 1200}{60\,\text{s}} = 125{,}6\ldots\,\text{rad/s} \approx 126\,\text{rad/s}$$

Il cestello parte da fermo, $\omega_0 = 0$, quindi

$$\alpha_m = \frac{\omega - \omega_0}{\Delta t} = \frac{125{,}7\,\text{rad/s} - 0}{8{,}0\,\text{s}} = 15{,}7\ldots\,\text{rad/s}^2 \approx 16\,\text{rad/s}^2$$

Ogni secondo la velocità angolare cresce di circa $16\,\text{rad/s}$, cioè di due giri e mezzo al secondo.
```

```ad-warning
Prima i radianti al secondo
Nelle formule di questa lezione $\omega$ va in $\text{rad/s}$. Dividere $1200$ per $8{,}0$ dà $150$, che sono giri al minuto guadagnati ogni secondo, non $\text{rad/s}^2$: i giri al minuto si convertono prima, con $\omega = 2\pi\,n / 60\,\text{s}$.
```

## Il moto circolare uniformemente accelerato

Se l'accelerazione angolare $\alpha$ è costante, la velocità angolare cambia della stessa quantità ogni secondo, e il moto di ciascun punto del corpo si chiama **moto circolare uniformemente accelerato**. Contando il tempo da $t = 0$, dalla definizione $\alpha = (\omega - \omega_0)/t$ si ricava la legge della velocità angolare:

$$\omega = \omega_0 + \alpha\,t$$

Nel grafico che ha il tempo in ascissa e la velocità angolare in ordinata questa legge è una retta, che parte da $\omega_0$ e ha pendenza $\alpha$.

```tikz
% nome: grafico-velocita-angolare-tempo-area
% alt: Grafico della velocità angolare in funzione del tempo per un moto con accelerazione angolare costante: una retta che sale da omega zero, all'istante zero, fino a omega, all'istante t. L'area sotto la retta è divisa in un rettangolo azzurro di base t e altezza omega zero, che vale omega zero per t, e in un triangolo arancione sopra di esso, di base t e altezza alfa per t, che vale un mezzo di alfa per t al quadrato
% svg: grafico-velocita-angolare-tempo-area-eb2c3928.svg 230x188
% poi-interattivo: cambiare omega zero e alfa e leggere l'area, cioè l'angolo descritto
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (4.6,3.6);
\fill[blue!10] (0,0) rectangle (4,1.2);
\fill[orange!25] (0,1.2) -- (4,1.2) -- (4,3.2) -- cycle;
\draw[->] (-0.3,0) -- (5,0) node[right] {$t$};
\draw[->] (0,-0.3) -- (0,4) node[above] {$\omega$};
\draw[dashed, thin] (4,0) -- (4,3.2);
\draw[dashed, thin] (0,3.2) -- (4,3.2);
\draw[dashed, thin] (0,1.2) -- (4,1.2);
\draw[thick, blue] (0,1.2) -- (4,3.2);
\node[left] at (0,1.2) {$\omega_0$};
\node[left] at (0,3.2) {$\omega$};
\node[below] at (4,0) {$t$};
\node[below left] at (0,0) {$O$};
\node at (2,0.6) {$\omega_0\,t$};
\node at (3.05,1.75) {\small $\frac{1}{2}\alpha\,t^2$};
\draw[<->, thin] (4.3,1.2) -- (4.3,3.2);
\node[right] at (4.3,2.2) {\small $\alpha\,t$};
\end{tikzpicture}
```

Nel [grafico velocità-tempo](/materiale/scuola-superiore/fisica/il-moto-rettilineo/il-grafico-velocita-tempo) di un moto su una retta l'area sotto il grafico è lo spostamento. Qui vale la stessa cosa con le grandezze angolari: l'area sotto il grafico di $\omega$ è lo spostamento angolare $\Delta\theta$. Nella figura l'area è fatta di un rettangolo, che vale $\omega_0\,t$, e di un triangolo di base $t$ e altezza $\alpha\,t$, che vale $\frac{1}{2}\alpha\,t^2$. Sommandoli si ha la legge della posizione angolare:

$$\theta = \theta_0 + \omega_0\,t + \frac{1}{2}\,\alpha\,t^2$$

Ricavando il tempo dalla prima legge, $t = (\omega - \omega_0)/\alpha$, e sostituendolo nella seconda si ottiene una terza relazione, comoda quando il tempo non è tra i dati:

$$\omega^2 = \omega_0^2 + 2\,\alpha\,\Delta\theta$$

Le tre leggi sono quelle del moto rettilineo uniformemente accelerato, con ogni grandezza lineare sostituita dalla sua corrispondente angolare:

| Moto su una retta | Rotazione attorno a un asse |
|---|---|
| posizione $s$ | posizione angolare $\theta$ |
| velocità $v$ | velocità angolare $\omega$ |
| accelerazione $a$ | accelerazione angolare $\alpha$ |
| $v = v_0 + a\,t$ | $\omega = \omega_0 + \alpha\,t$ |
| $s = s_0 + v_0\,t + \frac{1}{2}a\,t^2$ | $\theta = \theta_0 + \omega_0\,t + \frac{1}{2}\alpha\,t^2$ |
| $v^2 = v_0^2 + 2\,a\,\Delta s$ | $\omega^2 = \omega_0^2 + 2\,\alpha\,\Delta\theta$ |

Chi sa risolvere un problema di frenata su una strada sa già risolvere quello di una ruota che si ferma: cambiano solo i nomi delle grandezze.

```ad-example
Esempio 2: il ventilatore spento
Le pale di un ventilatore girano a $12\,\text{rad/s}$. Quando lo spegni rallentano con accelerazione angolare costante e si fermano in $6{,}0\,\text{s}$. Quanto vale l'accelerazione angolare? Quanti giri fanno le pale prima di fermarsi?

Prendiamo come positivo il verso in cui girano le pale: $\omega_0 = 12\,\text{rad/s}$ e, alla fine, $\omega = 0$.

$$\alpha = \frac{\omega - \omega_0}{t} = \frac{0 - 12\,\text{rad/s}}{6{,}0\,\text{s}} = -2{,}0\,\text{rad/s}^2$$

Il segno meno dice che $\alpha$ è opposta a $\omega$: le pale rallentano. L'angolo descritto, contato da $\theta_0 = 0$, è

$$
\begin{gathered}
\theta = \omega_0\,t + \frac{1}{2}\,\alpha\,t^2 \\
= 12\,\text{rad/s} \cdot 6{,}0\,\text{s} + \frac{1}{2} \cdot (-2{,}0\,\text{rad/s}^2) \cdot (6{,}0\,\text{s})^2 \\
= 72\,\text{rad} - 36\,\text{rad} = 36\,\text{rad}
\end{gathered}
$$

Un giro vale $2\pi\,\text{rad}$, quindi il numero di giri è

$$N = \frac{\theta}{2\pi} = \frac{36\,\text{rad}}{2\pi\,\text{rad}} = 5{,}72\ldots \approx 5{,}7$$

Le pale fanno poco meno di sei giri. Nel grafico di $\omega$ in funzione del tempo l'area è quella di un triangolo di base $6{,}0\,\text{s}$ e altezza $12\,\text{rad/s}$: $\frac{1}{2} \cdot 6{,}0 \cdot 12 = 36\,\text{rad}$, lo stesso risultato.
```

```ad-warning
Il segno di α in una frenata
In una rotazione che rallenta $\alpha$ ha il segno opposto a quello di $\omega$. Se nell'esempio 2 si scrive $\alpha = +2{,}0\,\text{rad/s}^2$, la legge della posizione dà $72 + 36 = 108\,\text{rad}$: l'angolo di un ventilatore che in quei sei secondi raddoppia la sua velocità invece di fermarsi.
```

```ad-example
Esempio 3: la ruota frenata, senza il tempo
La ruota di una bicicletta capovolta gira a $20\,\text{rad/s}$. Appoggiando la mano al copertone la rallenti in modo uniforme, e dopo $5{,}0$ giri la ruota gira a $8{,}0\,\text{rad/s}$. Quanto vale l'accelerazione angolare? Quanto è durata la frenata?

Il tempo non è tra i dati, quindi si usa la terza relazione. Prima i giri diventano radianti:

$$\Delta\theta = 2\pi N = 2\pi \cdot 5{,}0 = 31{,}4\ldots\,\text{rad}$$

Da $\omega^2 = \omega_0^2 + 2\,\alpha\,\Delta\theta$ si ricava

$$
\begin{gathered}
\alpha = \frac{\omega^2 - \omega_0^2}{2\,\Delta\theta} = \frac{(8{,}0\,\text{rad/s})^2 - (20\,\text{rad/s})^2}{2 \cdot 31{,}42\,\text{rad}} \\
= \frac{-336\,\text{rad}^2/\text{s}^2}{62{,}83\,\text{rad}} = -5{,}34\ldots\,\text{rad/s}^2 \approx -5{,}3\,\text{rad/s}^2
\end{gathered}
$$

Ora che $\alpha$ è nota, la legge della velocità angolare dà il tempo:

$$t = \frac{\omega - \omega_0}{\alpha} = \frac{8{,}0\,\text{rad/s} - 20\,\text{rad/s}}{-5{,}348\,\text{rad/s}^2} = 2{,}24\ldots\,\text{s} \approx 2{,}2\,\text{s}$$
```

```ad-warning
I giri non sono radianti
Nelle tre leggi l'angolo è in radianti. Mettere $\Delta\theta = 5{,}0$ nell'esempio 3 dà $\alpha = -33{,}6\,\text{rad/s}^2$, più di sei volte il valore giusto. I giri si moltiplicano per $2\pi$ prima di usarli, e un angolo trovato in radianti si divide per $2\pi$ per avere i giri.
```

## Dalle grandezze angolari a quelle lineari

Le grandezze angolari sono le stesse per tutto il corpo; ogni punto, però, ha la sua velocità e la sua accelerazione, che dipendono dalla distanza $r$ dall'asse. Per un punto a distanza $r$ valgono, con gli angoli in radianti, le due relazioni già viste nel moto circolare uniforme,

$$l = r\,\Delta\theta \qquad v = \omega\,r$$

dove $v$ è la velocità tangenziale, sempre tangente alla circonferenza.

Se la velocità angolare cambia, cambia anche il modulo di $v$. In un intervallo $\Delta t$ la variazione è $\Delta v = r\,\Delta\omega$, perché $r$ non cambia, e dividendo per $\Delta t$ si trova quanto rapidamente cresce il modulo della velocità:

$$a_t = \frac{\Delta v}{\Delta t} = r\,\frac{\Delta\omega}{\Delta t} = \alpha\,r$$

È l'**accelerazione tangenziale**: ha la direzione della tangente, come la velocità, e misura la variazione del suo modulo. Ha il verso della velocità quando il punto va più veloce, il verso opposto quando rallenta.

Intanto la velocità cambia anche direzione, come in ogni moto circolare, e a questo cambiamento corrisponde l'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta), diretta verso il centro:

$$a_c = \frac{v^2}{r} = \omega^2\,r$$

In un moto circolare qualsiasi l'accelerazione del punto ha quindi due componenti perpendicolari tra loro: la tangenziale cambia il modulo della velocità, la centripeta ne cambia la direzione. Il modulo dell'accelerazione totale si trova con il teorema di Pitagora:

$$a = \sqrt{a_t^2 + a_c^2}$$

```tikz
% nome: accelerazione-tangenziale-centripeta
% alt: Un punto P su una circonferenza di centro O, che gira in senso antiorario andando sempre più veloce. Da P partono la velocità v, blu scuro, tangente; l'accelerazione tangenziale a t, verde tratteggiata, anch'essa tangente e nel verso della velocità; l'accelerazione centripeta a c, verde tratteggiata, diretta verso il centro e lunga tre volte la tangenziale; l'accelerazione totale a, verde continua, diagonale del rettangolo costruito sulle due componenti
% svg: accelerazione-tangenziale-centripeta-ac18553c.svg 157x190
\begin{tikzpicture}
\draw[thick, gray!60] (0,0) circle (2);
\fill (0,0) circle (1.5pt) node[below left] {$O$};
\draw[dashed, thin] (0,0) -- (40:2);
\draw[-{Stealth}, thick, blue!60!black] (40:2) -- ($(40:2)+(130:1.5)$) node[above] {$\vec{v}$};
\draw[-{Stealth}, thick, dashed, green!50!black] (40:2) -- ($(40:2)+(130:0.48)$);
\draw[-{Stealth}, thick, dashed, green!50!black] (40:2) -- (40:0.56);
\draw[-{Stealth}, thick, green!50!black] (40:2) -- ($(40:0.56)+(130:0.48)$);
\draw[dashed, thin, green!50!black] (40:0.56) -- ($(40:0.56)+(130:0.48)$);
\draw[dashed, thin, green!50!black] ($(40:2)+(130:0.48)$) -- ($(40:0.56)+(130:0.48)$);
\node[green!50!black, right] at ($(40:2)+(130:0.3)+(0.15,0.3)$) {\small $\vec{a}_t$};
\node[green!50!black, below right] at (40:1.2) {\small $\vec{a}_c$};
\node[green!50!black, above left] at ($(40:0.75)+(130:0.48)$) {\small $\vec{a}$};
\fill (40:2) circle (1.5pt) node[right] {$P$};
\draw[-{Stealth}, thin] (200:1.3) arc[start angle=200, end angle=250, radius=1.3];
\end{tikzpicture}
```

Nel moto circolare uniforme $\alpha = 0$: la componente tangenziale è nulla e resta solo quella centripeta. Appena la velocità angolare cambia compaiono tutte e due.

```ad-example
Esempio 4: un punto sul bordo di un disco che accelera
Un disco di raggio $0{,}40\,\text{m}$ parte da fermo con accelerazione angolare costante di $3{,}0\,\text{rad/s}^2$. Dopo $1{,}0\,\text{s}$, quanto valgono la velocità e l'accelerazione di un punto del bordo?

Dopo $1{,}0\,\text{s}$ la velocità angolare è

$$\omega = \omega_0 + \alpha\,t = 0 + 3{,}0\,\text{rad/s}^2 \cdot 1{,}0\,\text{s} = 3{,}0\,\text{rad/s}$$

e la velocità del punto

$$v = \omega\,r = 3{,}0\,\text{rad/s} \cdot 0{,}40\,\text{m} = 1{,}2\,\text{m/s}$$

Le due componenti dell'accelerazione sono

$$
\begin{gathered}
a_t = \alpha\,r = 3{,}0\,\text{rad/s}^2 \cdot 0{,}40\,\text{m} = 1{,}2\,\text{m/s}^2 \\
a_c = \omega^2\,r = (3{,}0\,\text{rad/s})^2 \cdot 0{,}40\,\text{m} = 3{,}6\,\text{m/s}^2
\end{gathered}
$$

e l'accelerazione totale

$$
\begin{gathered}
a = \sqrt{a_t^2 + a_c^2} = \sqrt{(1{,}2\,\text{m/s}^2)^2 + (3{,}6\,\text{m/s}^2)^2} \\
= 3{,}79\ldots\,\text{m/s}^2 \approx 3{,}8\,\text{m/s}^2
\end{gathered}
$$

La figura sopra è disegnata con questi valori: la componente centripeta è il triplo di quella tangenziale. Un secondo più tardi $a_t$ è ancora $1{,}2\,\text{m/s}^2$, mentre $a_c$, con $\omega$ raddoppiata, è diventata quattro volte più grande: $14{,}4\,\text{m/s}^2$.
```

```ad-warning
L'accelerazione angolare non è l'accelerazione centripeta
$\alpha$ dice come cambia la velocità angolare e dà la componente tangenziale, $a_t = \alpha\,r$. La componente centripeta, $a_c = \omega^2 r$, c'è anche quando $\alpha$ è zero: un punto che gira a velocità angolare costante ha $a_t = 0$ ma non ha accelerazione nulla.
```

Nella figura qui sotto un disco parte da fermo con l'accelerazione angolare che scegli, e un punto a distanza $r$ dall'asse porta con sé le frecce dell'accelerazione. Avvia il moto e guarda che cosa succede alle due componenti dell'accelerazione mentre il disco prende velocità.

```interattivo
% nome: disco-accelerazione-angolare
% alt: Un disco visto dall'alto che parte da fermo e gira in senso antiorario con accelerazione angolare costante. Su un punto P del disco sono disegnate, in verde, le due componenti dell'accelerazione, quella tangenziale e quella centripeta diretta verso il centro, e l'accelerazione totale. Due cursori cambiano l'accelerazione angolare, da 0,5 a 2 radianti al secondo quadrato, e la distanza del punto dall'asse, da 1 a 2 metri; un bottone avvia il moto, che si ferma quando la velocità angolare arriva a 1,8 radianti al secondo. Sotto si leggono il tempo, la velocità angolare, l'angolo, la velocità del punto e le accelerazioni
```

La componente tangenziale resta sempre la stessa, perché $\alpha$ è costante. La componente centripeta parte da zero e cresce con il quadrato della velocità angolare: all'inizio l'accelerazione totale è quasi tangente alla circonferenza, poi ruota verso il centro, e quando $\omega$ è grande è diretta quasi lungo il raggio. Spostando il punto a distanza doppia dall'asse, velocità e accelerazioni raddoppiano tutte, a parità di $\omega$ e di $\alpha$.

## Che cosa fa cambiare la velocità angolare

Le leggi di questa lezione descrivono come ruota un corpo, senza dire perché. Su una retta la velocità di un corpo cambia quando su di esso agisce una forza, e cambia tanto meno quanto più grande è la sua massa. Nelle rotazioni questi due ruoli sono presi dal [momento della forza](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-momento-di-una-forza-e-di-una-coppia-di-forze) e da una grandezza nuova, che dipende da come la massa è distribuita attorno all'asse: la presenta la lezione [Il momento d'inerzia](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/il-momento-d-inerzia), e la lezione [Momento torcente e dinamica delle rotazioni](/materiale/scuola-superiore/fisica/il-corpo-rigido-e-il-momento-angolare/momento-torcente-e-dinamica-delle-rotazioni) le lega all'accelerazione angolare.
