# Il moto dei satelliti

La Stazione Spaziale Internazionale ha una massa di più di $400$ tonnellate, non ha motori accesi e non cade. O meglio: cade di continuo, ma non arriva mai a terra. Newton lo spiegò con un esperimento immaginario. Da una montagna altissima un cannone spara un proiettile in orizzontale: il proiettile [cade lungo una traiettoria curva](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/il-moto-di-un-proiettile-lanciato-in-orizzontale) e tocca il suolo a una certa distanza. Con una velocità più alta arriva più lontano. Ma la Terra è rotonda, e mentre il proiettile cade il suolo sotto di lui si incurva e si allontana: c'è una velocità per cui il proiettile scende esattamente di quanto scende il suolo, e allora gira intorno alla Terra senza mai avvicinarsi. È diventato un **satellite**.

```tikz
% nome: cannone-di-newton-traiettorie
% alt: La Terra con una montagna in cima da cui partono in orizzontale cinque proiettili con velocità crescenti; la montagna è molto più alta del vero. I primi tre, tratteggiati, ricadono al suolo, ognuno più lontano del precedente. Il quarto, in arancione, percorre una circonferenza intorno alla Terra e torna al punto di partenza. Il quinto, in blu, percorre un'ellisse più grande che ha il punto di partenza come punto più vicino alla Terra
% svg: cannone-di-newton-traiettorie-7c14a26b.svg 216x246
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (1.5);
\node at (0,0) {Terra};
\draw[thick, fill=gray!20] (-0.25,1.479) -- (0,2) -- (0.25,1.479);
\draw[thick, dashed] plot[domain=0:27.3, samples=20, variable=\t] ({90-\t}:{0.5/(1-0.75*cos(\t))});
\draw[thick, dashed] plot[domain=0:55.2, samples=30, variable=\t] ({90-\t}:{1.125/(1-0.4375*cos(\t))});
\draw[thick, dashed] plot[domain=0:114.9, samples=40, variable=\t] ({90-\t}:{1.62/(1-0.19*cos(\t))});
\draw[thick, orange!90!black] (0,0) circle (2);
\draw[thick, blue] plot[domain=0:360, samples=90, variable=\t] ({90-\t}:{2.645/(1+0.3225*cos(\t))});
\draw[-{Stealth}, thick, blue!60!black] (0,2) -- (1.0,2) node[above] {$\vec v$};
\fill (0,2) circle (1.5pt);
\end{tikzpicture}
```

Nella figura qui sotto il cannone sta su una montagna immaginaria alta $640\,\text{km}$ (nessuna montagna vera lo è: serve a stare sopra l'atmosfera, dove l'aria non frena). Scegli la velocità di lancio e guarda la traiettoria. Cerca la velocità più piccola con cui il proiettile non tocca più il suolo.

```interattivo
% nome: cannone-newton-orbita
% alt: La Terra con un cannone su una montagna alta 640 kilometri, un cursore per la velocità di lancio da 4 a 11 kilometri al secondo e un bottone che lancia il proiettile in orizzontale. La traiettoria è disegnata tratteggiata: fino a 7,3 kilometri al secondo finisce al suolo, sempre più lontano; a 7,5 è una circonferenza; a velocità più alte un'ellisse sempre più allungata; da 10,7 in su una curva aperta che non torna. Sotto sono scritte la velocità di lancio, la velocità dell'orbita circolare a quella quota e che cosa fa il proiettile
```

Fino a $7{,}3\,\text{km/s}$ il proiettile ricade, sempre più lontano; da $7{,}4\,\text{km/s}$ in su non tocca più il suolo. A $7{,}5\,\text{km/s}$ la traiettoria è una circonferenza: è la velocità dell'orbita circolare a quella quota. Con le altre velocità l'orbita è un'ellisse, come dice la prima delle [leggi di Keplero](/materiale/scuola-superiore/fisica/la-gravitazione/le-leggi-di-keplero); oltre i $10{,}7\,\text{km/s}$ il proiettile non torna più, e di questo si occupa la lezione sulla [velocità di fuga](/materiale/scuola-superiore/fisica/la-gravitazione/l-energia-potenziale-gravitazionale-e-la-velocita-di-fuga). Questa lezione studia il caso più semplice e più utile: l'orbita circolare.

## La velocità orbitale

Un satellite di massa $m$ percorre un'orbita circolare di raggio $r$ intorno a un pianeta di massa $M$, con velocità di modulo costante $v$: è un [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme). Per tenerlo sulla circonferenza serve una [forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta) $m v^2 / r$ diretta verso il centro. Sul satellite agisce una sola forza, l'attrazione del pianeta, che è diretta proprio verso il centro: è lei la forza centripeta.

```tikz
% nome: satellite-orbita-circolare-forza
% alt: Un pianeta di massa M al centro e un satellite di massa m su un'orbita circolare tratteggiata di raggio r. Sul satellite la velocità v, blu, è tangente all'orbita, e la forza di gravità F, rossa, punta verso il centro del pianeta
% svg: satellite-orbita-circolare-forza-cf79df8d.svg 177x194
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (0.8);
\node at (0,0) {$M$};
\draw[thin, dashed] (0,0) circle (2.2);
\draw[thin] (40:0.8) -- (40:2.2);
\node[above left] at (40:1.5) {$r$};
\draw[-{Stealth}, thick, red] (40:2.2) -- (40:1.3) node[below right] {$\vec F$};
\draw[-{Stealth}, thick, blue!60!black] (40:2.2) -- ++(130:1.2) node[above] {$\vec v$};
\draw[thick, fill=gray!20] (40:2.2) circle (0.12);
\node[right] at (1.85,1.5) {$m$};
\end{tikzpicture}
```

Uguagliamo la forza di gravità alla forza centripeta:

$$G\,\frac{M\,m}{r^2} = m\,\frac{v^2}{r}$$

La massa $m$ del satellite si semplifica. Moltiplicando i due membri per $r$ resta $v^2 = G M / r$, e la **velocità orbitale** è

$$v = \sqrt{\frac{G\,M}{r}}$$

Tre cose da leggere nella formula.

- Non c'è la massa del satellite. Una stazione di $400$ tonnellate e un bullone perso da un astronauta, alla stessa distanza, girano alla stessa velocità. È la stessa ragione per cui tutti i corpi cadono con la stessa accelerazione: l'accelerazione centripeta del satellite è il [campo gravitazionale](/materiale/scuola-superiore/fisica/la-gravitazione/il-campo-gravitazionale) in quel punto, $v^2/r = g$.
- A ogni raggio corrisponde una sola velocità. Un satellite non può stare su un'orbita circolare di raggio dato andando più piano o più forte: con un'altra velocità l'orbita cambia forma.
- La velocità diminuisce quando il raggio aumenta: i satelliti più lontani sono più lenti.

Come per il campo, $r$ è la distanza dal centro del pianeta: per un satellite a quota $h$ sopra un pianeta di raggio $R$, $r = R + h$.

```ad-example
Esempio 1: la velocità della Stazione Spaziale
La Stazione Spaziale Internazionale orbita a $400\,\text{km}$ di quota. Con quale velocità? Usa $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$ e $R_T = 6{,}37 \cdot 10^6\,\text{m}$.

Il raggio dell'orbita, con la quota in metri ($h = 4{,}00 \cdot 10^5\,\text{m} = 0{,}400 \cdot 10^6\,\text{m}$):

$$r = R_T + h = 6{,}37 \cdot 10^6\,\text{m} + 0{,}400 \cdot 10^6\,\text{m} = 6{,}77 \cdot 10^6\,\text{m}$$

La velocità orbitale:

$$v = \sqrt{\frac{G\,M_T}{r}} = \sqrt{\frac{6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2 \cdot 5{,}97 \cdot 10^{24}\,\text{kg}}{6{,}77 \cdot 10^6\,\text{m}}} = \sqrt{5{,}88 \cdot 10^7\,\text{m}^2/\text{s}^2} = 7{,}67 \cdot 10^3\,\text{m/s}$$

Sono $7{,}67\,\text{km/s}$, cioè circa $27\,600\,\text{km/h}$. Il prodotto $G M_T = 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$ torna in tutti i conti sui satelliti della Terra: conviene calcolarlo una volta e tenerlo.
```

```ad-warning
La quota non è il raggio dell'orbita
Nella formula va la distanza dal centro del pianeta. Con $h = 4{,}00 \cdot 10^5\,\text{m}$ al posto di $r$ l'esempio 1 darebbe $3{,}16 \cdot 10^4\,\text{m/s}$, quattro volte troppo. Per i satelliti bassi il raggio dell'orbita è quasi tutto raggio terrestre: dimenticarlo è l'errore che costa di più.
```

### Più in alto, più lento

Il grafico mostra la velocità orbitale intorno alla Terra in funzione del raggio dell'orbita. Un satellite che sfiorasse il suolo ($r = R_T$, possibile solo senza aria e senza montagne) dovrebbe andare a $7{,}91\,\text{km/s}$: è la velocità orbitale più alta possibile intorno alla Terra, detta anche **prima velocità cosmica**. A due raggi terrestri dal centro la velocità è $5{,}59\,\text{km/s}$, a quattro $3{,}95\,\text{km/s}$: per dimezzare la velocità il raggio deve diventare quattro volte più grande, perché $v$ è inversamente proporzionale alla radice di $r$.

```tikz
% nome: grafico-velocita-orbitale-raggio
% alt: Grafico della velocità orbitale intorno alla Terra, in kilometri al secondo, in funzione del raggio dell'orbita in raggi terrestri: la curva scende da 7,91 a distanza 1, a 5,59 a distanza 2, a 3,95 a distanza 4, a 3,07 a distanza 6,6, dove è segnata l'orbita geostazionaria
% svg: grafico-velocita-orbitale-raggio-42ac053c.svg 344x226
% poi-interattivo: spostare un punto lungo la curva e leggere raggio, velocità e periodo
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=1] (7.4,4.4);
\draw[->] (-0.2,0) -- (7.8,0) node[right] {$r$};
\draw[->] (0,-0.2) -- (0,4.8) node[above] {$v$ (km/s)};
\node[below] at (1,0) {\small $R_T$};
\foreach \x in {2,3,4,5,6,7} \node[below] at (\x,0) {\small $\x R_T$};
\foreach \y/\l in {1/2,2/4,3/6,4/8} \node[left] at (0,\y) {\small $\l$};
\draw[dashed, thin] (1,0) -- (1,3.955);
\draw[thick, blue] plot[domain=1:7.4, samples=60] (\x, {3.955/sqrt(\x)});
\fill (1,3.955) circle (1.5pt) node[right] {\small $7{,}91$};
\fill (2,2.797) circle (1.5pt) node[above right] {\small $5{,}59$};
\fill (4,1.977) circle (1.5pt) node[above right] {\small $3{,}95$};
\fill (6.62,1.537) circle (1.5pt) node[above] {\small $3{,}07$};
\draw[dashed, thin] (6.62,0) -- (6.62,1.537);
\end{tikzpicture}
```

```ad-warning
Più in alto non vuol dire più veloce
Un satellite su un'orbita più alta ha richiesto un razzo più potente, e viene da pensare che vada più forte. Va più piano. La velocità orbitale non misura lo sforzo per arrivare lassù (quello è una questione di energia, nella prossima lezione), ma la velocità che serve per restarci. Più lontano il campo è più debole e la traiettoria deve curvare meno: serve meno velocità.
```

## Il periodo

Il **periodo** $T$ è il tempo di un giro completo. In un moto circolare uniforme la velocità è la circonferenza divisa per il periodo, $v = 2\pi r / T$, quindi

$$T = \frac{2\pi\,r}{v}$$

Mettendo al posto di $v$ la velocità orbitale si ottiene il periodo direttamente dal raggio:

$$T = 2\pi\,\sqrt{\frac{r^3}{G\,M}}$$

Nemmeno il periodo dipende dalla massa del satellite. Cresce con il raggio più in fretta di quanto la velocità diminuisca: un'orbita più larga è più lunga, e in più viene percorsa più piano.

```ad-example
Esempio 2: quanto dura un giro della Stazione Spaziale
Trova il periodo della Stazione Spaziale dell'esempio 1 ($r = 6{,}77 \cdot 10^6\,\text{m}$, $v = 7{,}67 \cdot 10^3\,\text{m/s}$).

$$T = \frac{2\pi\,r}{v} = \frac{2\pi \cdot 6{,}77 \cdot 10^6\,\text{m}}{7{,}67 \cdot 10^3\,\text{m/s}} = 5{,}55 \cdot 10^3\,\text{s}$$

Sono $92{,}4$ minuti: poco più di un'ora e mezza. In un giorno, $8{,}64 \cdot 10^4\,\text{s}$, la Stazione fa circa $15{,}6$ giri, e gli astronauti vedono sorgere il Sole quindici o sedici volte.
```

```ad-example
Esempio 3: il mese della Luna
La Luna percorre un'orbita quasi circolare di raggio $3{,}84 \cdot 10^8\,\text{m}$ intorno alla Terra. Quanto dura un giro?

Qui il dato è già la distanza tra i centri. Conviene calcolare prima il cubo del raggio:

$$r^3 = (3{,}84 \cdot 10^8\,\text{m})^3 = 5{,}66 \cdot 10^{25}\,\text{m}^3$$

$$T = 2\pi\,\sqrt{\frac{r^3}{G\,M_T}} = 2\pi\,\sqrt{\frac{5{,}66 \cdot 10^{25}\,\text{m}^3}{3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2}} = 2\pi \cdot 3{,}77 \cdot 10^5\,\text{s} = 2{,}37 \cdot 10^6\,\text{s}$$

Dividendo per gli $8{,}64 \cdot 10^4$ secondi di un giorno si trovano $27{,}4$ giorni. Il valore misurato è $27{,}3$ giorni: la legge che dà la velocità di un satellite artificiale a $400\,\text{km}$ da terra dà anche il mese della Luna.
```

```ad-warning
Il cubo sta sotto la radice
Nella formula del periodo il raggio è al cubo e la radice è quadrata: $T = 2\pi\sqrt{r^3/(G M)}$. Gli errori tipici sono il raggio al quadrato (per somiglianza con la legge di gravitazione) e $G M$ al numeratore. Il controllo con le unità li scopre: $\text{m}^3$ diviso $\text{m}^3/\text{s}^2$ dà $\text{s}^2$, e la radice dà secondi.
```

## La terza legge di Keplero, ricavata

Eleviamo al quadrato la formula del periodo e dividiamo per $r^3$:

$$T^2 = \frac{4\pi^2}{G\,M}\,r^3 \quad\Rightarrow\quad \frac{T^2}{r^3} = \frac{4\pi^2}{G\,M}$$

Il secondo membro contiene solo costanti e la massa del corpo centrale: è lo stesso numero per tutti i satelliti dello stesso pianeta, e per tutti i pianeti intorno al Sole. È la **terza legge di Keplero**, che la lezione sulle [leggi di Keplero](/materiale/scuola-superiore/fisica/la-gravitazione/le-leggi-di-keplero) enuncia come $T^2/a^3 = \text{costante}$ con il semiasse maggiore $a$ dell'ellisse: in un'orbita circolare il semiasse maggiore è il raggio. Keplero aveva trovato la legge dai dati delle osservazioni, senza sapere perché valesse né quanto valesse la costante. La legge di gravitazione dà tutte e due le risposte. (Per le orbite ellittiche la legge vale lo stesso, con $a$ al posto di $r$, ma la dimostrazione è più lunga e non la diamo.)

La costante dipende dalla massa centrale, e questo la rende uno strumento di misura: dal raggio e dal periodo dell'orbita di un satellite qualsiasi si ricava la massa del corpo attorno a cui gira.

$$M = \frac{4\pi^2\,r^3}{G\,T^2}$$

È così che si conoscono le masse del Sole, dei pianeti che hanno lune e delle stelle doppie: nessuno le ha mai messe su una bilancia.

```ad-example
Esempio 4: la massa del Sole dall'anno terrestre
La Terra gira intorno al Sole a una distanza media di $1{,}50 \cdot 10^{11}\,\text{m}$ e impiega un anno, $3{,}16 \cdot 10^7\,\text{s}$. Quanto vale la massa del Sole?

Qui il corpo centrale è il Sole e il satellite è la Terra.

$$M_S = \frac{4\pi^2\,r^3}{G\,T^2} = \frac{4\pi^2 \cdot (1{,}50 \cdot 10^{11}\,\text{m})^3}{6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2 \cdot (3{,}16 \cdot 10^7\,\text{s})^2}$$

Al numeratore $4\pi^2 \cdot 3{,}375 \cdot 10^{33} = 1{,}332 \cdot 10^{35}$, al denominatore $6{,}67 \cdot 10^{-11} \cdot 9{,}986 \cdot 10^{14} = 6{,}660 \cdot 10^4$:

$$M_S = \frac{1{,}332 \cdot 10^{35}}{6{,}660 \cdot 10^4}\,\text{kg} = 2{,}00 \cdot 10^{30}\,\text{kg}$$

Il valore accettato è $1{,}99 \cdot 10^{30}\,\text{kg}$: la differenza sta nell'ultima cifra dei dati. La massa della Terra non è servita.
```

## I satelliti geostazionari

Le parabole della televisione satellitare sono fissate al muro e puntano sempre nella stessa direzione. Il satellite a cui sono rivolte, visto da terra, non si muove. Un satellite così si chiama **geostazionario**: gira intorno alla Terra sopra l'equatore, nello stesso verso in cui la Terra ruota, e fa un giro esattamente nel tempo in cui la Terra fa un giro su sé stessa. Resta quindi sempre sopra lo stesso punto dell'equatore.

Il periodo è imposto, e la terza legge dice che a un periodo corrisponde un solo raggio. Dalla formula $T^2 = 4\pi^2 r^3 / (G M)$ si ricava

$$r = \sqrt[3]{\frac{G\,M\,T^2}{4\pi^2}}$$

```ad-example
Esempio 5: a che quota sta un satellite geostazionario
La Terra fa un giro su sé stessa, rispetto alle stelle, in $23$ ore e $56$ minuti, cioè in $8{,}62 \cdot 10^4\,\text{s}$. A quale quota orbita un satellite geostazionario, e con quale velocità?

Il raggio dell'orbita, con $G M_T = 3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2$:

$$r = \sqrt[3]{\frac{G\,M_T\,T^2}{4\pi^2}} = \sqrt[3]{\frac{3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2 \cdot (8{,}62 \cdot 10^4\,\text{s})^2}{4\pi^2}} = \sqrt[3]{7{,}49 \cdot 10^{22}\,\text{m}^3} = 4{,}22 \cdot 10^7\,\text{m}$$

Sulla calcolatrice la radice cubica è il tasto $\sqrt[3]{x}$, oppure l'elevamento alla $1/3$. La quota è il raggio dell'orbita meno il raggio della Terra:

$$h = r - R_T = 42{,}2 \cdot 10^6\,\text{m} - 6{,}37 \cdot 10^6\,\text{m} = 3{,}58 \cdot 10^7\,\text{m}$$

cioè circa $35\,800\,\text{km}$, quasi sei raggi terrestri sopra il suolo. La velocità è

$$v = \sqrt{\frac{G\,M_T}{r}} = \sqrt{\frac{3{,}98 \cdot 10^{14}\,\text{m}^3/\text{s}^2}{4{,}22 \cdot 10^7\,\text{m}}} = 3{,}07 \cdot 10^3\,\text{m/s}$$

circa $3{,}1\,\text{km/s}$: meno della metà di quella della Stazione Spaziale.
```

```ad-note
Perché 23 ore e 56 minuti
Il giorno di $24$ ore è il tempo tra due mezzogiorni, e in quel tempo la Terra fa un po' più di un giro, perché intanto si è spostata lungo la sua orbita intorno al Sole. Un giro esatto rispetto alle stelle dura quattro minuti in meno. Con $24$ ore, $8{,}64 \cdot 10^4\,\text{s}$, il conto darebbe un raggio di $4{,}22 \cdot 10^7\,\text{m}$ lo stesso: la differenza è sulla quarta cifra.
```

Tutti i satelliti geostazionari stanno sulla stessa circonferenza, larga $6{,}6$ raggi terrestri, sopra l'equatore: sono satelliti per le telecomunicazioni e per la meteorologia. La figura mostra in scala le orbite di cui abbiamo parlato.

```tikz
% nome: orbite-terra-in-scala
% alt: La Terra e, in scala, tre orbite circolari: quella della Stazione Spaziale, a 400 kilometri di quota, quasi attaccata alla superficie; quella dei satelliti del GPS, a 20200 kilometri di quota, a circa quattro raggi terrestri dal centro; quella geostazionaria, a 35800 kilometri di quota, a 6,6 raggi terrestri dal centro
% svg: orbite-terra-in-scala-4f5ed85b.svg 310x229
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (0.45);
\draw[thin, red] (0,0) circle (0.478);
\draw[thin, dashed] (0,0) circle (1.877);
\draw[thin, dashed] (0,0) circle (2.979);
\fill (60:1.877) circle (1.5pt);
\fill (20:2.979) circle (1.5pt);
\node[right] at (20:3.05) {\small geostazionario};
\node[right] at (60:1.95) {\small GPS};
\draw[thin] (0.34,-0.34) -- (2.3,-2.3);
\node[right] at (2.3,-2.35) {\small Stazione Spaziale};
\end{tikzpicture}
```

| Satellite | Quota | Raggio dell'orbita | Velocità | Periodo |
|---|---|---|---|---|
| Stazione Spaziale | $400\,\text{km}$ | $1{,}06\,R_T$ | $7{,}67\,\text{km/s}$ | $92$ minuti |
| GPS | $20\,200\,\text{km}$ | $4{,}17\,R_T$ | $3{,}87\,\text{km/s}$ | $12{,}0$ ore |
| Geostazionario | $35\,800\,\text{km}$ | $6{,}62\,R_T$ | $3{,}07\,\text{km/s}$ | $23$ ore e $56$ minuti |
| Luna | | $60{,}3\,R_T$ | $1{,}02\,\text{km/s}$ | $27{,}4$ giorni |

## L'assenza apparente di peso

Nei filmati dalla Stazione Spaziale gli astronauti galleggiano, e si dice che sono "in assenza di gravità". Non è vero: a $400\,\text{km}$ di quota il campo gravitazionale è $8{,}69\,\text{N/kg}$, l'$89\%$ di quello al suolo, e un astronauta di $70\,\text{kg}$ pesa $608\,\text{N}$. Se la gravità lì non ci fosse, la Stazione non girerebbe intorno alla Terra: proseguirebbe in linea retta.

Quello che manca non è il peso, ma la sensazione del peso. Sulla Terra senti di pesare perché il pavimento ti sostiene: la sensazione viene dalla forza con cui il pavimento, la sedia o la bilancia ti spingono verso l'alto. Una bilancia misura proprio quella forza. Nella lezione sul [diagramma delle forze](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-diagramma-delle-forze) hai visto che in un ascensore che accelera verso il basso la bilancia segna meno, e che se il cavo si spezzasse, con ascensore, bilancia e passeggero in caduta libera insieme, segnerebbe zero.

La Stazione Spaziale è un ascensore in caduta libera che non arriva mai al suolo. La Stazione, gli astronauti e ogni oggetto a bordo sono soggetti solo alla gravità e hanno tutti la stessa accelerazione, $g$ verso il centro della Terra, perché l'accelerazione di caduta non dipende dalla massa. Cadendo insieme, nessuno preme sull'altro: il pavimento non spinge sui piedi, la bilancia segna zero, una penna lasciata andare resta accanto alla mano. Si parla di **assenza apparente di peso**, o di imponderabilità.

```ad-warning
In orbita la gravità c'è
"Gli astronauti galleggiano perché nello spazio non c'è gravità" è sbagliato due volte. La gravità c'è, ed è quasi quella del suolo; ed è proprio lei a tenere la Stazione in orbita, facendo da forza centripeta. Gli astronauti galleggiano perché sono in caduta libera insieme alla Stazione. La stessa cosa succede per una ventina di secondi sugli aerei che, per addestrare gli astronauti, volano lungo una parabola a pochi kilometri da terra.
```

Visto dall'interno della Stazione, che è un sistema di riferimento accelerato, tutto va come se il peso fosse sparito: è il punto di vista dei [sistemi non inerziali](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/sistemi-di-riferimento-inerziali-e-non-inerziali), in cui il peso è bilanciato da una [forza apparente](/materiale/scuola-superiore/fisica/la-dinamica-e-la-relativita-galileiana/le-forze-apparenti-forza-centrifuga-e-forza-di-coriolis). Visto da terra, il conto è quello di questa lezione: una sola forza, la gravità, e un moto circolare.

## Come si risolve un problema sui satelliti

1. Individua il corpo centrale: è la sua massa $M$ che entra nelle formule, mai quella del satellite.
2. Trova il raggio dell'orbita: se il testo dà la quota, $r = R + h$, tutto in metri.
3. Per la velocità, $v = \sqrt{G M / r}$; per il periodo, $T = 2\pi r / v$ oppure $T = 2\pi\sqrt{r^3 / (G M)}$.
4. Se sono dati periodo e raggio e si cerca la massa centrale, $M = 4\pi^2 r^3 / (G T^2)$; se sono dati periodo e massa e si cerca il raggio, $r = \sqrt[3]{G M T^2 / (4\pi^2)}$.
5. Controlla l'ordine di grandezza: intorno alla Terra le velocità orbitali stanno tra $1$ e $8\,\text{km/s}$, e i periodi vanno da un'ora e mezza in su.
