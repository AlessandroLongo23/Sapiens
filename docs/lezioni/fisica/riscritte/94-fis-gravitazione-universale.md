# La legge di gravitazione universale

Una mela che si stacca dal ramo cade verso il centro della Terra. La Luna gira attorno alla Terra, e per restare sulla sua orbita ha bisogno di una [forza centripeta](/materiale/scuola-superiore/fisica/le-forze-e-il-movimento/la-forza-centripeta) diretta anch'essa verso il centro della Terra. Isaac Newton capì che le due forze sono la stessa, e che la stessa forza tiene i pianeti attorno al Sole: la pubblicò nel 1687, nei *Principia*, come legge di gravitazione universale. "Universale" perché vale tra due corpi qualsiasi, in cielo e in terra. Le [leggi di Keplero](/materiale/scuola-superiore/fisica/la-gravitazione/le-leggi-di-keplero) dicono come si muovono i pianeti; questa legge dice perché.

## Dalle leggi di Keplero alla forza

Newton ricavò la forma della forza dalle leggi di Keplero. Il ragionamento si segue bene per un pianeta di massa $m$ su un'orbita circolare di raggio $r$, percorsa con periodo $T$. Il pianeta si muove di [moto circolare uniforme](/materiale/scuola-superiore/fisica/i-moti-nel-piano/il-moto-circolare-uniforme) con velocità $v = 2\pi r/T$, quindi la forza che lo tiene sull'orbita è diretta verso il Sole e vale

$$F = m\,\frac{v^2}{r} = m\,\frac{4\pi^2 r}{T^2}$$

Per la terza legge di Keplero $T^2 = K\,r^3$, con la stessa costante $K$ per tutti i pianeti. Sostituendo:

$$F = m\,\frac{4\pi^2 r}{K\,r^3} = \frac{4\pi^2}{K} \cdot \frac{m}{r^2}$$

La forza con cui il Sole attira un pianeta è direttamente proporzionale alla massa del pianeta e inversamente proporzionale al quadrato della sua distanza dal Sole.

Manca la massa del Sole. Per il [terzo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-terzo-principio-della-dinamica), se il Sole attira il pianeta, il pianeta attira il Sole con una forza della stessa intensità. I due corpi hanno quindi lo stesso ruolo, e se la forza è proporzionale alla massa dell'uno deve essere proporzionale anche alla massa dell'altro.

## La legge

**Legge di gravitazione universale**: due corpi puntiformi di masse $m_1$ e $m_2$, a distanza $r$, si attraggono con una forza che ha per direzione la retta che li unisce e per modulo

$$F = G\,\frac{m_1\,m_2}{r^2}$$

$G$ è la **costante di gravitazione universale**:

$$G = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2}$$

Le sue unità sono quelle che servono perché il prodotto dia una forza in newton: $\text{kg} \cdot \text{kg}/\text{m}^2$ moltiplicato per $\text{N} \cdot \text{m}^2/\text{kg}^2$ dà $\text{N}$.

```tikz
% nome: gravitazione-due-sfere-forze
% alt: Due sfere di masse m1, più grande, e m2, più piccola, con i centri a distanza r. Su ciascuna agisce una forza diretta verso l'altra, lungo la retta che unisce i centri: le due frecce hanno la stessa lunghezza e versi opposti. Una quota sotto le sfere indica la distanza r tra i centri
% svg: gravitazione-due-sfere-forze-28a15b6a.svg 233x89
\begin{tikzpicture}
\draw[thin, dashed] (0,0) -- (5,0);
\draw[thick, fill=blue!10] (0,0) circle (0.7);
\draw[thick, fill=blue!10] (5,0) circle (0.35);
\fill (0,0) circle (1.5pt);
\fill (5,0) circle (1.5pt);
\node at (0,0.4) {$m_1$};
\node[above] at (5,0.38) {$m_2$};
\draw[-{Stealth}, thick, red] (0,0) -- (1.6,0) node[above] {$\vec{F}_1$};
\draw[-{Stealth}, thick, red] (5,0) -- (3.4,0) node[above] {$\vec{F}_2$};
\draw[|-|, thin] (0,-1.05) -- (5,-1.05) node[midway, below] {$r$};
\end{tikzpicture}
```

Quattro cose da leggere nella formula e nella figura.

- La forza è sempre attrattiva: ciascun corpo è tirato verso l'altro.
- Le forze sono due, una su ciascun corpo, e hanno lo stesso modulo anche se le masse sono molto diverse: sono una coppia di azione e reazione. La Terra attira una mela con la stessa forza con cui la mela attira la Terra; a cambiare è l'accelerazione, piccolissima per la Terra perché la sua massa è enorme.
- La forza è proporzionale a ciascuna delle due masse: raddoppiando una massa la forza raddoppia, raddoppiandole entrambe quadruplica.
- La forza è inversamente proporzionale al quadrato della distanza: a distanza doppia è un quarto, a distanza tripla un nono.

Per due corpi estesi a simmetria sferica, come con buona approssimazione i pianeti e le stelle, la legge vale ancora, a patto di prendere come $r$ la distanza tra i centri: una sfera omogenea attira i corpi esterni come se tutta la sua massa fosse nel centro. Newton lo dimostrò; la dimostrazione chiede strumenti di matematica del quinto anno.

```ad-warning
G non è g
$G$ è una costante universale, la stessa per ogni coppia di corpi in ogni luogo, e vale $6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2$. $g = 9{,}8\,\text{m/s}^2$ è l'accelerazione di gravità vicino alla superficie della Terra, e su un altro pianeta ha un altro valore. Hanno unità diverse e non si scambiano.
```

```ad-example
Esempio 1: l'attrazione tra due persone
Due persone di $70\,\text{kg}$ ciascuna stanno a $1{,}0\,\text{m}$ di distanza l'una dall'altra. Con quale forza si attraggono?

Trattiamo le due persone come corpi puntiformi:

$$F = G\,\frac{m_1\,m_2}{r^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{70\,\text{kg} \cdot 70\,\text{kg}}{(1{,}0\,\text{m})^2} = 3{,}268\ldots \cdot 10^{-7}\,\text{N} \approx 3{,}3 \cdot 10^{-7}\,\text{N}$$

È il peso di un granello di sabbia. La forza gravitazionale tra oggetti di tutti i giorni è troppo debole per accorgersene; diventa importante quando almeno uno dei due corpi ha la massa di un pianeta.
```

## Come la forza dipende dalla distanza

Il grafico della forza in funzione della distanza, a masse fissate, è un ramo di curva che scende in fretta: se a distanza $r_0$ la forza vale $F_0$, a $2r_0$ vale $F_0/4$, a $3r_0$ vale $F_0/9$, a $4r_0$ vale $F_0/16$. È una [proporzionalità quadratica inversa](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-inversa-e-quadratica). La forza non si annulla mai: diminuisce quanto si vuole, ma arriva a qualsiasi distanza.

```tikz
% nome: forza-gravitazionale-distanza-grafico
% alt: Grafico cartesiano della forza gravitazionale F in funzione della distanza r tra due corpi di masse fissate. La curva scende ripida e poi sempre più piano verso l'asse orizzontale, senza toccarlo. Sono segnati quattro punti: a distanza r con zero la forza vale F con zero, a distanza doppia un quarto di F con zero, a distanza tripla un nono, a distanza quadrupla un sedicesimo
% svg: forza-gravitazionale-distanza-grafico-718f36cc.svg 272x225
% poi-interattivo: muovere un punto sulla curva e leggere distanza e forza
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid[xstep=1.3, ystep=1] (5.6,4.4);
\draw[->] (-0.2,0) -- (6,0) node[right] {$r$};
\draw[->] (0,-0.2) -- (0,4.8) node[above] {$F$};
\draw[thick, blue] plot[domain=0.92:4.3, samples=60, variable=\x] ({1.3*\x},{4/(\x*\x)});
\foreach \x/\l in {1.3/{r_0}, 2.6/{2r_0}, 3.9/{3r_0}, 5.2/{4r_0}} \draw (\x,0.06) -- (\x,-0.06) node[below] {$\l$};
\draw (0.06,4) -- (-0.06,4) node[left] {$F_0$};
\draw (0.06,1) -- (-0.06,1) node[left] {$\frac{F_0}{4}$};
\draw[thin, dashed] (0,4) -- (1.3,4) -- (1.3,0);
\draw[thin, dashed] (0,1) -- (2.6,1) -- (2.6,0);
\fill (1.3,4) circle (1.6pt);
\fill (2.6,1) circle (1.6pt);
\fill (3.9,0.444) circle (1.6pt) node[above right] {$\frac{F_0}{9}$};
\fill (5.2,0.25) circle (1.6pt) node[above right] {$\frac{F_0}{16}$};
\end{tikzpicture}
```

Nella figura qui sotto cambi le due masse e la distanza tra due pianeti. Che cosa succede alle due frecce se raddoppi la distanza? E se raddoppi una sola massa?

```interattivo
% nome: gravitazione-due-masse
% alt: Due pianeti sferici sulla stessa retta, con tre cursori: la massa del primo e la massa del secondo, da 1 a 2 per dieci alla ventiquattro kilogrammi, e la distanza tra i centri, da 1 a 3 per dieci alla otto metri. Su ciascun pianeta è disegnata la forza con cui l'altro lo attira: le due frecce sono sempre lunghe uguali, si allungano se una massa cresce e si accorciano molto se la distanza cresce. Sotto la figura sono scritti le masse, la distanza e il valore della forza in newton
```

Le due frecce restano sempre uguali tra loro, qualunque siano le masse. Raddoppiando una massa si allungano del doppio; raddoppiando la distanza si accorciano a un quarto.

```ad-example
Esempio 2: la forza tra la Terra e la Luna
La Terra ha massa $5{,}97 \cdot 10^{24}\,\text{kg}$, la Luna $7{,}35 \cdot 10^{22}\,\text{kg}$, e la distanza media tra i loro centri è $3{,}84 \cdot 10^{5}\,\text{km}$. Con quale forza si attraggono?

La distanza va in metri: $r = 3{,}84 \cdot 10^{5}\,\text{km} = 3{,}84 \cdot 10^{8}\,\text{m}$, e il suo quadrato è $r^2 = 1{,}4746 \cdot 10^{17}\,\text{m}^2$.

$$F = G\,\frac{M_T\,M_L}{r^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{5{,}97 \cdot 10^{24}\,\text{kg} \cdot 7{,}35 \cdot 10^{22}\,\text{kg}}{1{,}4746 \cdot 10^{17}\,\text{m}^2}$$

Conviene moltiplicare prima i numeri e poi sommare gli esponenti delle potenze di dieci: $6{,}67 \cdot 5{,}97 \cdot 7{,}35 / 1{,}4746 = 198{,}48\ldots$ e $-11 + 24 + 22 - 17 = 18$.

$$F = 198{,}5 \cdot 10^{18}\,\text{N} \approx 1{,}98 \cdot 10^{20}\,\text{N}$$

Con questa forza la Terra tiene la Luna in orbita, e con la stessa forza la Luna tira la Terra.
```

```ad-warning
La distanza è tra i centri, è in metri ed è al quadrato
Tre errori che cambiano il risultato di molti ordini di grandezza. Per un corpo vicino a un pianeta $r$ non è la quota sopra la superficie: è la quota più il raggio del pianeta. I kilometri vanno convertiti in metri prima di sostituire, perché $G$ è in unità del Sistema Internazionale. E il denominatore è $r^2$: con $r$ al posto di $r^2$ nell'esempio 2 verrebbe una forza $3{,}84 \cdot 10^{8}$ volte più grande.
```

## La bilancia di Cavendish e il valore di $G$

Newton non conosceva il valore di $G$. Con le orbite dei pianeti si misura solo il prodotto di $G$ per la massa del Sole; per avere $G$ da sola bisogna misurare la forza tra due masse note, e l'esempio 1 mostra quanto sia piccola. Ci riuscì Henry Cavendish nel 1798, con una **bilancia di torsione**.

```tikz
% nome: bilancia-torsione-cavendish
% alt: Schema della bilancia di torsione di Cavendish vista dall'alto. Un'asta leggera, appesa per il centro a un filo sottile, porta alle estremità due sfere piccole di massa m. Vicino a ciascuna, da parti opposte dell'asta, c'è una sfera grande e fissa di massa M. Ogni sfera piccola è attirata dalla sfera grande vicina con una forza F: le due forze, di verso opposto, fanno ruotare l'asta di un piccolo angolo attorno al filo
% svg: bilancia-torsione-cavendish-bde6e62b.svg 226x144
\begin{tikzpicture}
\draw[thick] (-2.2,0) -- (2.2,0);
\draw[thick, fill=white] (0,0) circle (2pt);
\node[below] at (0,-0.1) {filo};
\draw[thick, fill=blue!10] (-2.2,0) circle (0.2);
\draw[thick, fill=blue!10] (2.2,0) circle (0.2);
\node[left] at (-2.4,0) {$m$};
\node[right] at (2.4,0) {$m$};
\draw[thick, fill=gray!20] (-2.2,1.3) circle (0.55);
\draw[thick, fill=gray!20] (2.2,-1.3) circle (0.55);
\node at (-2.2,1.3) {$M$};
\node at (2.2,-1.3) {$M$};
\draw[-{Stealth}, thick, red] (-2.2,0) -- (-2.2,0.62);
\node[right] at (-2.15,0.4) {$\vec{F}$};
\draw[-{Stealth}, thick, red] (2.2,0) -- (2.2,-0.62);
\node[left] at (2.15,-0.4) {$\vec{F}$};
\draw[-{Stealth}, thin] (50:1.3) arc (50:11:1.3);
\draw[-{Stealth}, thin] (230:1.3) arc (230:191:1.3);
\end{tikzpicture}
```

Un'asta leggera con due piccole sfere di piombo alle estremità è appesa per il centro a un filo sottile. Avvicinando a ciascuna sfera piccola una grande sfera di piombo, le forze di attrazione fanno ruotare l'asta, finché il filo, torcendosi, non le equilibra. Il filo era stato tarato prima: dall'angolo di rotazione Cavendish risalì alla forza, e dalla forza, note le masse e la distanza, a $G$. Il valore che si ricava dalle sue misure differisce da quello accettato oggi di circa l'$1\%$.

```ad-example
Esempio 3: la forza che Cavendish doveva misurare
Nell'apparato di Cavendish una sfera grande di $158\,\text{kg}$ aveva il centro a $0{,}225\,\text{m}$ dal centro di una sfera piccola di $0{,}730\,\text{kg}$. Quanto vale la forza tra le due sfere?

$$F = G\,\frac{M\,m}{r^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{158\,\text{kg} \cdot 0{,}730\,\text{kg}}{(0{,}225\,\text{m})^2} = 1{,}519\ldots \cdot 10^{-7}\,\text{N} \approx 1{,}52 \cdot 10^{-7}\,\text{N}$$

È circa un cinquantamilionesimo del peso della sfera piccola, che vale $0{,}730\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 = 7{,}2\,\text{N}$: per questo servono un filo sottilissimo e un apparato chiuso, al riparo dalle correnti d'aria.
```

## L'accelerazione di gravità dalla legge

Un corpo di massa $m$ vicino alla superficie della Terra è attirato dalla Terra con una forza che finora abbiamo chiamato [forza-peso](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa) e scritto $m\,g$. Ora sappiamo da dove viene: è la forza gravitazionale tra il corpo e la Terra, con $r$ uguale al raggio della Terra $R_T$, perché la distanza si misura dal centro. Uguagliando le due scritture:

$$m\,g = G\,\frac{M_T\,m}{R_T^2}$$

La massa $m$ del corpo si semplifica, e resta

$$g = G\,\frac{M_T}{R_T^2}$$

Con $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$ e $R_T = 6{,}37 \cdot 10^{6}\,\text{m}$:

$$g = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{5{,}97 \cdot 10^{24}\,\text{kg}}{(6{,}37 \cdot 10^{6}\,\text{m})^2} = 9{,}813\ldots\,\text{N/kg} \approx 9{,}81\,\text{m/s}^2$$

L'accelerazione di gravità non è quindi una costante della natura: dipende dalla massa e dal raggio del pianeta su cui ci si trova. La stessa formula, con la massa e il raggio di un altro corpo celeste, dà l'accelerazione di gravità sulla sua superficie.

La formula si legge anche al contrario. Quando Cavendish ebbe misurato $G$, la massa della Terra, che nessuna bilancia può misurare, si ricavò da grandezze già note:

$$M_T = \frac{g\,R_T^2}{G} = \frac{9{,}81\,\text{m/s}^2 \cdot (6{,}37 \cdot 10^{6}\,\text{m})^2}{6{,}67 \cdot 10^{-11}\,\text{N} \cdot \text{m}^2/\text{kg}^2} = 5{,}97 \cdot 10^{24}\,\text{kg}$$

Per questo si dice che Cavendish "pesò la Terra".

```ad-example
Esempio 4: l'accelerazione di gravità sulla Luna
La Luna ha massa $7{,}35 \cdot 10^{22}\,\text{kg}$ e raggio $1{,}74 \cdot 10^{6}\,\text{m}$. Quanto vale l'accelerazione di gravità sulla sua superficie, e quanto pesa lì un astronauta che con la tuta ha una massa di $120\,\text{kg}$?

$$g_L = G\,\frac{M_L}{R_L^2} = 6{,}67 \cdot 10^{-11}\,\frac{\text{N} \cdot \text{m}^2}{\text{kg}^2} \cdot \frac{7{,}35 \cdot 10^{22}\,\text{kg}}{(1{,}74 \cdot 10^{6}\,\text{m})^2} = 1{,}619\ldots\,\text{m/s}^2 \approx 1{,}62\,\text{m/s}^2$$

È circa un sesto di quella terrestre. Il peso dell'astronauta sulla Luna è

$$m\,g_L = 120\,\text{kg} \cdot 1{,}62\,\text{m/s}^2 = 194{,}4\,\text{N} \approx 194\,\text{N}$$

contro i $1{,}18 \cdot 10^{3}\,\text{N}$ sulla Terra. La massa dell'astronauta è la stessa.
```

Come cambia $g$ salendo di quota, e che cosa succede dentro la Terra, si vede nella lezione sul [campo gravitazionale](/materiale/scuola-superiore/fisica/la-gravitazione/il-campo-gravitazionale).

### La Luna cade come la mela

Newton controllò la sua legge sulla Luna. La Luna dista dal centro della Terra $3{,}84 \cdot 10^{8}\,\text{m}$, cioè $60$ raggi terrestri ($3{,}84 \cdot 10^{8}/6{,}37 \cdot 10^{6} = 60{,}3$). Se la forza diminuisce con il quadrato della distanza, a quella distanza l'accelerazione di gravità deve essere $60^2 = 3600$ volte più piccola che sulla superficie:

$$\frac{9{,}81\,\text{m/s}^2}{3600} = 2{,}73 \cdot 10^{-3}\,\text{m/s}^2$$

L'[accelerazione centripeta](/materiale/scuola-superiore/fisica/i-moti-nel-piano/l-accelerazione-centripeta) della Luna si calcola dal raggio dell'orbita e dal periodo, $27{,}3$ giorni cioè $2{,}36 \cdot 10^{6}\,\text{s}$:

$$a_c = \frac{4\pi^2 r}{T^2} = \frac{4\pi^2 \cdot 3{,}84 \cdot 10^{8}\,\text{m}}{(2{,}36 \cdot 10^{6}\,\text{s})^2} = 2{,}72 \cdot 10^{-3}\,\text{m/s}^2$$

I due valori differiscono di meno dell'uno per cento: la Luna "cade" verso la Terra con l'accelerazione prevista dalla legge, e la forza che la tiene in orbita è la stessa che fa cadere la mela.

## Massa inerziale e massa gravitazionale

La massa di un corpo compare in fisica in due ruoli diversi.

- Nel [secondo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-secondo-principio-della-dinamica), $F = m\,a$, la massa misura l'inerzia: quanto il corpo resiste a un cambiamento di velocità, qualunque sia la forza che agisce. È la **massa inerziale** $m_i$.
- Nella legge di gravitazione la massa misura quanto intensamente il corpo attira gli altri corpi e ne è attirato. È la **massa gravitazionale** $m_g$.

Sono due proprietà definite in modo indipendente, e nulla obbliga a pensare che coincidano. Per un corpo in caduta libera vicino alla Terra la forza è gravitazionale e l'accelerazione è regolata dall'inerzia:

$$m_i\,a = G\,\frac{M_T\,m_g}{R_T^2} \quad\Rightarrow\quad a = \frac{m_g}{m_i} \cdot G\,\frac{M_T}{R_T^2}$$

Gli esperimenti mostrano, fin da Galileo, che nel vuoto tutti i corpi cadono con la stessa accelerazione. Questo è possibile solo se il rapporto $m_g/m_i$ è lo stesso per tutti i corpi, di qualunque materiale: le due masse sono direttamente proporzionali, e con le unità di misura in uso, in cui $G$ ha il valore che conosciamo, il rapporto vale $1$. Per questo si usa un solo simbolo $m$ e una sola unità, il kilogrammo. Le misure più precise confermano l'uguaglianza fino a una parte su mille miliardi e oltre.

```ad-note
Una coincidenza che chiede una spiegazione
L'uguaglianza tra massa inerziale e massa gravitazionale è un fatto sperimentale che la meccanica di Newton registra senza spiegarlo. Einstein la prese come punto di partenza della relatività generale.
```

## Più di due corpi

Se un corpo è attirato da più corpi, ogni forza si calcola con la legge di gravitazione come se gli altri non ci fossero, e la forza totale è la [somma vettoriale](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/somma-e-differenza-di-vettori) delle singole forze. Se i corpi sono allineati le forze stanno sulla stessa retta: si sommano i moduli se hanno lo stesso verso, si sottraggono se hanno versi opposti.

```ad-example
Esempio 5: dove la Terra e la Luna tirano con la stessa forza
Una sonda viaggia sulla retta che unisce la Terra alla Luna. A quale distanza dal centro della Terra le forze con cui la Terra e la Luna la attirano hanno lo stesso modulo? Usa $M_T = 5{,}97 \cdot 10^{24}\,\text{kg}$, $M_L = 7{,}35 \cdot 10^{22}\,\text{kg}$ e la distanza Terra-Luna $D = 3{,}84 \cdot 10^{8}\,\text{m}$.

Chiamiamo $x$ la distanza della sonda dal centro della Terra; dalla Luna dista $D - x$. Le due forze, di verso opposto, sono uguali in modulo quando

$$G\,\frac{M_T\,m}{x^2} = G\,\frac{M_L\,m}{(D - x)^2}$$

$G$ e la massa $m$ della sonda si semplificano. Le distanze sono positive, quindi si può estrarre la radice quadrata dei due membri:

$$\frac{D - x}{x} = \sqrt{\frac{M_L}{M_T}} = \sqrt{\frac{7{,}35 \cdot 10^{22}}{5{,}97 \cdot 10^{24}}} = 0{,}1109\ldots$$

Da $D - x = 0{,}1110\,x$ si ricava

$$x = \frac{D}{1{,}1110} = \frac{3{,}84 \cdot 10^{8}\,\text{m}}{1{,}1110} = 3{,}456\ldots \cdot 10^{8}\,\text{m} \approx 3{,}46 \cdot 10^{8}\,\text{m}$$

Il punto è a nove decimi del percorso: la Terra ha una massa $81$ volte più grande, e per pareggiare la forza della Luna bisogna esserle $9$ volte più lontani, perché $9^2 = 81$.
```

```tikz
% nome: punto-equilibrio-terra-luna
% alt: La Terra a sinistra, più grande, la Luna a destra, più piccola, e tra le due, molto più vicina alla Luna, una sonda. Sulla sonda agiscono due forze uguali e opposte lungo la retta che unisce i due corpi: una verso la Terra e una verso la Luna. Sotto, due quote: la distanza x dal centro della Terra alla sonda, nove decimi del totale, e la distanza D meno x dalla sonda al centro della Luna
% svg: punto-equilibrio-terra-luna-a96042d4.svg 308x95
\begin{tikzpicture}
\draw[thin, dashed] (0,0) -- (7,0);
\draw[thick, fill=blue!10] (0,0) circle (0.5);
\node[above] at (0,0.5) {Terra};
\draw[thick, fill=gray!20] (7,0) circle (0.2);
\node[above] at (7,0.2) {Luna};
\draw[-{Stealth}, thick, red] (6.3,0) -- (5.8,0);
\node[above] at (5.85,0.05) {$\vec{F}_T$};
\draw[-{Stealth}, thick, red] (6.3,0) -- (6.8,0);
\node[below] at (6.6,-0.1) {$\vec{F}_L$};
\fill (6.3,0) circle (2pt);
\draw[|-|, thin] (0,-0.95) -- (6.3,-0.95) node[midway, below] {$x$};
\draw[|-|, thin] (6.3,-0.95) -- (7,-0.95) node[midway, below] {$D - x$};
\end{tikzpicture}
```

Con la legge di gravitazione le tre leggi di Keplero smettono di essere regole trovate nelle misure e diventano conseguenze dei principi della dinamica. Come si ricavano la velocità e il periodo di un corpo in orbita si vede nella lezione sul [moto dei satelliti](/materiale/scuola-superiore/fisica/la-gravitazione/il-moto-dei-satelliti).
