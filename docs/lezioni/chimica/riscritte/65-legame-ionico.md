# Il legame ionico

Il sodio è un metallo tenero che in acqua reagisce con violenza, il cloro un gas giallo-verde e tossico. Messi a contatto reagiscono, e quello che resta è una polvere bianca che metti sulla pasta: il cloruro di sodio, il sale da cucina. Nella reazione ogni atomo di sodio ha ceduto un elettrone a un atomo di cloro, e i due sono diventati ioni di carica opposta, che si attraggono. Questa attrazione è il legame ionico, e spiega perché il sale è un solido duro, fragile e difficile da fondere.

## Un elettrone passa da un atomo all'altro

Il sodio ha configurazione $[\text{Ne}]\,3s^1$: un solo elettrone di valenza, lontano dal nucleo e trattenuto poco. Il cloro ha configurazione $[\text{Ne}]\,3s^2\,3p^5$: sette elettroni di valenza, uno in meno dell'ottetto. Se il sodio perde il suo elettrone e il cloro lo acquista, tutti e due arrivano alla configurazione di un gas nobile, come chiede la [regola dell'ottetto](/materiale/scuola-superiore/chimica/i-legami-chimici/energia-di-legame-e-regola-dell-ottetto):

$$\mathrm{Na} \longrightarrow \mathrm{Na^+} + e^- \qquad\qquad \mathrm{Cl} + e^- \longrightarrow \mathrm{Cl^-}$$

Lo ione $\mathrm{Na^+}$ ha la configurazione del neon, lo ione $\mathrm{Cl^-}$ quella dell'argon. Con i [simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis) il passaggio si disegna così:

```tikz
% nome: ionico-trasferimento-elettrone-lewis
% alt: A sinistra il simbolo di Lewis del sodio, con un solo puntino, e quello del cloro, con sette puntini; una freccia rossa porta il puntino del sodio verso il cloro. A destra, dopo una freccia, lo ione sodio tra parentesi quadre con carica più e senza puntini, e lo ione cloruro tra parentesi quadre con carica meno e otto puntini. Sotto ogni simbolo la configurazione elettronica: neon 3s1, neon 3s2 3p5, neon, argon
\begin{tikzpicture}
\node at (0,0) {Na};
\node at (0.75,0) {$+$};
\node at (1.5,0) {Cl};
\draw[-{Stealth}, thick, red] (0.38,0.12) to[bend left=50] (1.12,0.12);
\draw[-{Stealth}, thick] (2.3,0) -- (3.3,0);
\node at (4.2,0) {Na};
\draw[thick] (3.82,-0.5) -- (3.7,-0.5) -- (3.7,0.5) -- (3.82,0.5);
\draw[thick] (4.58,-0.5) -- (4.7,-0.5) -- (4.7,0.5) -- (4.58,0.5);
\node[right] at (4.65,0.5) {\small $+$};
\node at (5.9,0) {Cl};
\draw[thick] (5.52,-0.5) -- (5.4,-0.5) -- (5.4,0.5) -- (5.52,0.5);
\draw[thick] (6.28,-0.5) -- (6.4,-0.5) -- (6.4,0.5) -- (6.28,0.5);
\node[right] at (6.35,0.5) {\small $-$};
\node at (-0.2,-1) {\small [Ne] $3s^1$};
\node at (1.75,-1) {\small [Ne] $3s^2\,3p^5$};
\node at (4.2,-1) {\small [Ne]};
\node at (5.9,-1) {\small [Ar]};
\foreach \x/\y in {0.35/0, 1.57/0.3, 1.43/0.3, 1.85/-0.07, 1.85/0.07, 1.43/-0.3, 1.57/-0.3, 1.15/0, 5.98/0.3, 5.83/0.3, 6.25/-0.07, 6.25/0.07, 5.83/-0.3, 5.98/-0.3, 5.55/0.08, 5.55/-0.07} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Il **legame ionico** è l'attrazione elettrostatica tra ioni di carica opposta, che si sono formati perché uno o più elettroni sono passati da un atomo all'altro. A differenza del [legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente), qui nessuna coppia di elettroni è condivisa: l'elettrone ceduto appartiene per intero all'anione.

```ad-warning
Gli elettroni ceduti sono tanti quanti quelli acquistati
In un trasferimento non si creano e non si perdono elettroni. Se un atomo di magnesio ne cede due e un atomo di cloro ne può prendere uno solo, servono due atomi di cloro per ogni atomo di magnesio. È da questo conto che nasce la formula del composto.
```

## Quali elementi si legano così

Cede elettroni volentieri un atomo che li trattiene poco, cioè con una bassa [energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione): sono i metalli, soprattutto quelli dei gruppi 1 e 2 (IA e IIA). Li acquista volentieri un atomo con un'alta [elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita): sono i non metalli dei gruppi 16 e 17 (VIA e VIIA). Il legame ionico è quindi il legame tra un metallo e un non metallo.

Come regola pratica, un legame si considera ionico quando la differenza di elettronegatività tra i due atomi supera $1{,}9$ (i tipi di legame al variare di $\Delta\chi$ sono nella lezione sul [legame covalente polare](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo)). Per il cloruro di sodio

$$\Delta\chi = \chi_{\mathrm{Cl}} - \chi_{\mathrm{Na}} = 3{,}16 - 0{,}93 = 2{,}23$$

La soglia non è un confine netto. Lo ioduro di potassio, $\mathrm{KI}$, ha $\Delta\chi = 2{,}66 - 0{,}82 = 1{,}84$, eppure è un solido ionico come il sale da cucina. Quando la differenza è vicina a $1{,}9$ decide il comportamento della sostanza, e il criterio "metallo più non metallo" sbaglia più di rado della soglia.

Per gli elementi dei gruppi principali la carica dello ione si legge dal gruppo: un metallo perde tutti i suoi elettroni di valenza, un non metallo ne acquista quanti gliene mancano per arrivare a otto.

| Gruppo | 1 (IA) | 2 (IIA) | 13 (IIIA) | 15 (VA) | 16 (VIA) | 17 (VIIA) |
|---|---|---|---|---|---|---|
| Elettroni di valenza | $1$ | $2$ | $3$ | $5$ | $6$ | $7$ |
| Carica dello ione | $+1$ | $+2$ | $+3$ | $-3$ | $-2$ | $-1$ |
| Esempi | $\mathrm{Na^+}$, $\mathrm{K^+}$ | $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$ | $\mathrm{Al^{3+}}$ | $\mathrm{N^{3-}}$ | $\mathrm{O^{2-}}$, $\mathrm{S^{2-}}$ | $\mathrm{F^-}$, $\mathrm{Cl^-}$ |

```ad-example
Esempio 1: magnesio e ossigeno
Che ioni formano il magnesio e l'ossigeno quando si legano, e con quale configurazione?

Il magnesio è nel gruppo 2 e ha configurazione $[\text{Ne}]\,3s^2$: perde i due elettroni $3s$ e diventa $\mathrm{Mg^{2+}}$, con la configurazione del neon. L'ossigeno è nel gruppo 16 e ha configurazione $[\text{He}]\,2s^2\,2p^4$: gli mancano due elettroni per l'ottetto, li acquista e diventa $\mathrm{O^{2-}}$, anche lui con la configurazione del neon, $[\text{He}]\,2s^2\,2p^6$.

I due elettroni ceduti da un atomo di magnesio sono proprio i due che servono a un atomo di ossigeno: gli ioni sono uno a uno. La differenza di elettronegatività è $3{,}44 - 1{,}31 = 2{,}13$, e il legame è ionico.
```

```ad-warning
Lo ione non ha la carica del gruppo
Il cloro è nel gruppo 17, ma il suo ione è $\mathrm{Cl^-}$, non $\mathrm{Cl^{7-}}$ né $\mathrm{Cl^{7+}}$: ha sette elettroni di valenza e ne acquista uno solo, quello che gli manca. Per un non metallo la carica è il numero degli elettroni di valenza meno otto: $7 - 8 = -1$ per il cloro, $6 - 8 = -2$ per l'ossigeno.
```

## La formula dai due ioni

Un composto ionico è neutro: le cariche positive sono tante quante le negative. Conosciute le cariche dei due ioni, la formula si trova con il procedimento della [lezione sulla formula chimica](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-formula-chimica-e-il-suo-significato), che qui parte dai gruppi:

1. Dal gruppo ricava la carica del catione e quella dell'anione.
2. Trova il minimo comune multiplo delle due cariche, prese senza segno: è il numero di elettroni che passano dal metallo al non metallo.
3. Dividi il minimo comune multiplo per ciascuna carica: ottieni quanti cationi e quanti anioni servono.
4. Scrivi prima il simbolo del metallo e poi quello del non metallo, con quei numeri come indici (l'$1$ non si scrive).

Una scorciatoia è la regola dell'incrocio: la carica di uno ione, senza segno, diventa l'indice dell'altro, e alla fine gli indici si semplificano se hanno un divisore comune.

```ad-example
Esempio 2: calcio e fluoro
Il calcio è nel gruppo 2 e forma $\mathrm{Ca^{2+}}$; il fluoro è nel gruppo 17 e forma $\mathrm{F^-}$. Il minimo comune multiplo di $2$ e $1$ è $2$: serve $2 : 2 = 1$ ione calcio e servono $2 : 1 = 2$ ioni fluoruro. La formula è $\mathrm{CaF_2}$, fluoruro di calcio.

Controllo: $1 \cdot (+2) + 2 \cdot (-1) = 0$.
```

```ad-example
Esempio 3: alluminio e ossigeno
L'alluminio è nel gruppo 13 e forma $\mathrm{Al^{3+}}$; l'ossigeno forma $\mathrm{O^{2-}}$. Il minimo comune multiplo di $3$ e $2$ è $6$: servono $6 : 3 = 2$ ioni alluminio e $6 : 2 = 3$ ioni ossido. La formula è $\mathrm{Al_2O_3}$, ossido di alluminio.

Controllo: $2 \cdot (+3) + 3 \cdot (-2) = 0$. Con l'incrocio si arriva allo stesso risultato: il $3$ dell'alluminio va all'ossigeno, il $2$ dell'ossigeno all'alluminio.
```

```ad-warning
Con l'incrocio ricordati di semplificare
Per magnesio e ossigeno, $\mathrm{Mg^{2+}}$ e $\mathrm{O^{2-}}$, l'incrocio dà $\mathrm{Mg_2O_2}$. La formula di un composto ionico è il rapporto più piccolo tra gli ioni: si semplifica per $2$ e si scrive $\mathrm{MgO}$. Nella formula, poi, le cariche non si scrivono: $\mathrm{Ca^{2+}F^-_2}$ non è una formula.
```

Nella figura scegli un metallo e un non metallo e aggiungi ioni finché il composto è neutro: le due barre confrontano le cariche positive e quelle negative.

```interattivo
% nome: ionico-formula-ioni-neutro
% alt: Si scelgono un catione tra sodio, potassio, magnesio, calcio e alluminio e un anione tra fluoruro, cloruro, ossido, solfuro e nitruro. Con i bottoni più e meno si aggiungono ioni, disegnati come sfere con la loro carica. Due barre affiancate mostrano la carica positiva totale e la carica negativa totale; quando sono uguali e gli ioni sono nel rapporto più piccolo compare la formula del composto
```

Con $\mathrm{Al^{3+}}$ e $\mathrm{O^{2-}}$ le barre si pareggiano la prima volta a sei cariche, con due cationi e tre anioni. Con quattro e sei si pareggiano di nuovo, ma il rapporto è lo stesso e la formula non cambia.

## Il reticolo cristallino e l'unità formula

Uno ione attira tutti gli ioni di carica opposta che ha intorno, in qualunque direzione: il legame ionico non unisce una coppia precisa di ioni. Per questo cationi e anioni non formano molecole, ma si dispongono in un **reticolo cristallino**, una struttura ordinata che si ripete uguale in tutte le direzioni, in cui ogni ione è circondato da ioni dell'altro segno. Lo avevi incontrato nella lezione [Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni) disegnato in un piano; nello spazio il cloruro di sodio è fatto così:

```tikz
% nome: ionico-reticolo-cloruro-sodio-cubo
% alt: Un cubetto del reticolo del cloruro di sodio, con tre ioni per spigolo: sfere grandi verdi, gli ioni cloruro, e sfere piccole viola, gli ioni sodio, alternate in tutte e tre le direzioni. Lo ione sodio al centro del cubo è unito con segmenti rossi ai sei ioni cloruro più vicini: sopra, sotto, a destra, a sinistra, davanti e dietro
\begin{tikzpicture}
\draw[thin, gray] (0.0,0.0) -- (2.3,0.0);
\draw[thin, gray] (0.0,0.0) -- (0.0,2.3);
\draw[thin, gray] (0.0,0.0) -- (1.15,0.83);
\draw[thin, gray] (0.57,0.41) -- (2.88,0.41);
\draw[thin, gray] (0.57,0.41) -- (0.57,2.71);
\draw[thin, gray] (0.0,1.15) -- (1.15,1.98);
\draw[thin, gray] (1.15,0.83) -- (3.45,0.83);
\draw[thin, gray] (1.15,0.83) -- (1.15,3.13);
\draw[thin, gray] (0.0,2.3) -- (1.15,3.13);
\draw[thin, gray] (0.0,1.15) -- (2.3,1.15);
\draw[thin, gray] (1.15,0.0) -- (1.15,2.3);
\draw[thin, gray] (1.15,0.0) -- (2.3,0.83);
\draw[thin, gray] (0.57,1.56) -- (2.88,1.56);
\draw[thin, gray] (1.72,0.41) -- (1.72,2.71);
\draw[thin, gray] (1.15,1.15) -- (2.3,1.98);
\draw[thin, gray] (1.15,1.98) -- (3.45,1.98);
\draw[thin, gray] (2.3,0.83) -- (2.3,3.13);
\draw[thin, gray] (1.15,2.3) -- (2.3,3.13);
\draw[thin, gray] (0.0,2.3) -- (2.3,2.3);
\draw[thin, gray] (2.3,0.0) -- (2.3,2.3);
\draw[thin, gray] (2.3,0.0) -- (3.45,0.83);
\draw[thin, gray] (0.57,2.71) -- (2.88,2.71);
\draw[thin, gray] (2.88,0.41) -- (2.88,2.71);
\draw[thin, gray] (2.3,1.15) -- (3.45,1.98);
\draw[thin, gray] (1.15,3.13) -- (3.45,3.13);
\draw[thin, gray] (3.45,0.83) -- (3.45,3.13);
\draw[thin, gray] (2.3,2.3) -- (3.45,3.13);
\draw[very thick, red] (1.72,1.56) -- (0.57,1.56);
\draw[very thick, red] (1.72,1.56) -- (2.88,1.56);
\draw[very thick, red] (1.72,1.56) -- (1.72,0.41);
\draw[very thick, red] (1.72,1.56) -- (1.72,2.71);
\draw[very thick, red] (1.72,1.56) -- (1.15,1.15);
\draw[very thick, red] (1.72,1.56) -- (2.3,1.98);
\foreach \x/\y in {1.15/0.83, 1.15/3.13, 2.3/1.98, 3.45/0.83, 3.45/3.13} \draw[thick, fill=green!25] (\x,\y) circle (0.3);
\foreach \x/\y in {1.15/1.98, 2.3/0.83, 2.3/3.13, 3.45/1.98} \draw[thick, fill=violet!25] (\x,\y) circle (0.18);
\foreach \x/\y in {0.57/1.56, 1.72/0.41, 1.72/2.71, 2.88/1.56} \draw[thick, fill=green!25] (\x,\y) circle (0.3);
\foreach \x/\y in {0.57/0.41, 0.57/2.71, 1.72/1.56, 2.88/0.41, 2.88/2.71} \draw[thick, fill=violet!25] (\x,\y) circle (0.18);
\foreach \x/\y in {0.0/0.0, 0.0/2.3, 1.15/1.15, 2.3/0.0, 2.3/2.3} \draw[thick, fill=green!25] (\x,\y) circle (0.3);
\foreach \x/\y in {0.0/1.15, 1.15/0.0, 1.15/2.3, 2.3/1.15} \draw[thick, fill=violet!25] (\x,\y) circle (0.18);
\draw[thick, fill=violet!25] (4.6,2.2) circle (0.18); \node[right] at (4.85,2.2) {Na$^+$};
\draw[thick, fill=green!25] (4.6,1.4) circle (0.3); \node[right] at (4.95,1.4) {Cl$^-$};
\end{tikzpicture}
```

Ogni ione $\mathrm{Na^+}$ ha per vicini sei ioni $\mathrm{Cl^-}$, e ogni $\mathrm{Cl^-}$ sei ioni $\mathrm{Na^+}$. Il numero di ioni di segno opposto a contatto con uno ione si chiama **numero di coordinazione**: nel cloruro di sodio vale $6$. Altri composti, con ioni di dimensioni diverse o in un rapporto diverso, hanno reticoli con un'altra geometria.

Un cristallo di sale non contiene molecole $\mathrm{NaCl}$: la formula dice solo che gli ioni sono in rapporto uno a uno. Il più piccolo gruppo di ioni che rispetta la formula si chiama **unità formula**, e per un composto ionico prende il posto della molecola nei conti con la mole.

```ad-example
Esempio 4: quanti ioni in un pizzico di cloruro di calcio
Quanti ioni ci sono in $11{,}1\,\text{g}$ di cloruro di calcio, $\mathrm{CaCl_2}$?

La massa molare è $M = 40{,}08 + 2 \cdot 35{,}45 = 110{,}98\,\text{g/mol}$, e la quantità di sostanza
$$n = \frac{m}{M} = \frac{11{,}1\,\text{g}}{110{,}98\,\text{g/mol}} = 0{,}100\,\text{mol}$$
Le unità formula sono $0{,}100\,\text{mol} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 6{,}02 \cdot 10^{22}$. Ogni unità formula contiene tre ioni, un $\mathrm{Ca^{2+}}$ e due $\mathrm{Cl^-}$: gli ioni sono $3 \cdot 6{,}02 \cdot 10^{22} = 1{,}81 \cdot 10^{23}$.
```

```ad-warning
"La molecola di cloruro di sodio"
Nel sale solido non c'è nessuna coppia $\mathrm{Na^+}$-$\mathrm{Cl^-}$ che stia insieme più delle altre: ogni ione appartiene a tutto il cristallo. Di un composto ionico si dice "unità formula", non "molecola", e la sua formula è sempre una formula minima.
```

## L'energia reticolare

Strappare un elettrone al sodio costa energia: l'energia di ionizzazione è $496\,\text{kJ/mol}$. Il cloro, quando acquista un elettrone, ne libera $349\,\text{kJ/mol}$ (la sua affinità elettronica). Il passaggio dell'elettrone tra due atomi isolati, da solo, è quindi in perdita:

$$496\,\text{kJ/mol} - 349\,\text{kJ/mol} = 147\,\text{kJ/mol}$$

A rendere stabile il composto è quello che succede dopo: gli ioni di carica opposta si attraggono e si impacchettano nel reticolo, liberando molta più energia di quella spesa. L'**energia reticolare** è l'energia che si libera quando una mole di composto ionico solido si forma dai suoi ioni allo stato gassoso, ed è la stessa che bisogna fornire per separare del tutto gli ioni di una mole di solido. Per il cloruro di sodio vale $787\,\text{kJ/mol}$, più di cinque volte i $147\,\text{kJ/mol}$ spesi per formare gli ioni.

L'energia reticolare misura la forza del legame ionico. L'attrazione tra due ioni è tanto più intensa quanto più grandi sono le loro cariche e quanto più piccola è la distanza $d$ tra i loro centri, e l'energia reticolare cresce circa come

$$\frac{q_+ \cdot q_-}{d}$$

dove $q_+$ e $q_-$ sono le cariche dei due ioni senza segno. Ioni piccoli e con carica alta danno reticoli molto stabili, che fondono a temperature alte.

| Composto | Cariche | $d$ (pm) | Energia reticolare (kJ/mol) | Fusione ($^\circ\text{C}$) |
|---|---|---|---|---|
| $\mathrm{NaF}$ | $1$ e $1$ | $235$ | $923$ | $993$ |
| $\mathrm{NaCl}$ | $1$ e $1$ | $283$ | $787$ | $801$ |
| $\mathrm{KCl}$ | $1$ e $1$ | $319$ | $715$ | $770$ |
| $\mathrm{CaO}$ | $2$ e $2$ | $240$ | $3401$ | $2613$ |
| $\mathrm{MgO}$ | $2$ e $2$ | $212$ | $3791$ | $2852$ |

```ad-example
Esempio 5: cloruro di sodio e ossido di magnesio
Di quante volte l'energia reticolare dell'ossido di magnesio dovrebbe superare quella del cloruro di sodio?

Nel $\mathrm{MgO}$ le cariche sono $2$ e $2$ e la distanza è $212\,\text{pm}$; nel $\mathrm{NaCl}$ le cariche sono $1$ e $1$ e la distanza è $283\,\text{pm}$. Il rapporto tra le due stime è
$$\frac{2 \cdot 2}{212} : \frac{1 \cdot 1}{283} = \frac{4 \cdot 283}{212} = 5{,}34$$
Le cariche doppie contano per un fattore $4$, la distanza più piccola per un fattore $1{,}33$. Il rapporto tra i valori misurati è $3791 : 787 = 4{,}82$: la stima dà l'ordine di grandezza giusto, non il valore esatto, perché in un reticolo ogni ione risente di tutti gli altri e non di uno solo.
```

Nella prossima figura scegli tu i due ioni: le sfere sono in scala, e sotto leggi la distanza tra i centri e la stima dell'energia reticolare a confronto con quella del cloruro di sodio.

```interattivo
% nome: ionico-energia-reticolare-ioni
% alt: Si scelgono un catione tra litio, sodio, potassio, magnesio e calcio e un anione tra fluoruro, cloruro, bromuro e ossido. I due ioni sono disegnati a contatto, in scala, con la distanza tra i centri in picometri. Una barra mostra quante volte l'attrazione stimata, il prodotto delle cariche diviso per la distanza, supera quella del cloruro di sodio, disegnato sotto come riferimento
```

Cambiando $\mathrm{Na^+}$ con $\mathrm{K^+}$ la barra scende di poco, perché cresce solo la distanza. Passando da $\mathrm{Na^+}$ e $\mathrm{Cl^-}$ a $\mathrm{Mg^{2+}}$ e $\mathrm{O^{2-}}$ la barra diventa più di cinque volte più lunga: la carica pesa più delle dimensioni.

```ad-warning
Ioni più grandi non vuol dire legame più forte
Uno ione grande tiene il vicino più lontano, e l'attrazione diminuisce. A parità di cariche il reticolo più stabile è quello con gli ioni più piccoli: $\mathrm{NaF}$ fonde a $993\,^\circ\text{C}$, $\mathrm{KCl}$ a $770\,^\circ\text{C}$.
```

## Le proprietà dei composti ionici

Le proprietà dei composti ionici vengono tutte dal reticolo: ioni fermi al loro posto, tenuti da attrazioni forti in ogni direzione.

| Proprietà | Spiegazione |
|---|---|
| Solidi a temperatura ambiente, con punti di fusione alti | per fondere il solido bisogna vincere le attrazioni tra tutti gli ioni vicini |
| Duri ma fragili | uno strato che scorre porta ioni dello stesso segno uno di fronte all'altro |
| Isolanti allo stato solido | gli ioni sono carichi, ma non possono spostarsi |
| Conduttori allo stato fuso e in soluzione | gli ioni sono liberi di muoversi e trasportano la carica |
| Spesso solubili in acqua | le molecole d'acqua, polari, circondano gli ioni e li staccano dal reticolo |

La fragilità è la proprietà che distingue meglio un cristallo ionico da un metallo. Un colpo fa scorrere uno strato di ioni rispetto a quello sotto: con lo spostamento di una sola posizione ogni catione si trova di fronte a un catione e ogni anione di fronte a un anione. L'attrazione diventa repulsione, e il cristallo si spacca lungo quel piano.

```tikz
% nome: ionico-fragilita-strati-scorrono
% alt: Due disegni di un cristallo ionico fatto di quattro strati di ioni positivi e negativi alternati. Nel primo, prima dell'urto, ogni ione ha sopra e sotto ioni di segno opposto, e una freccia indica l'urto sui due strati superiori. Nel secondo i due strati superiori sono scivolati di una posizione: ogni ione si trova di fronte a uno dello stesso segno, frecce rosse a due punte indicano la repulsione e i due strati si staccano
\begin{tikzpicture}
\foreach \x in {0.0, 1.32, 2.64} {\draw[thick, fill=green!25] (\x,0) circle (0.3); \node at (\x,0) {$-$};}
\foreach \x in {0.66, 1.98} {\draw[thick, fill=violet!25] (\x,0) circle (0.2); \node at (\x,0) {\scriptsize $+$};}
\foreach \x in {0.66, 1.98} {\draw[thick, fill=green!25] (\x,0.66) circle (0.3); \node at (\x,0.66) {$-$};}
\foreach \x in {0.0, 1.32, 2.64} {\draw[thick, fill=violet!25] (\x,0.66) circle (0.2); \node at (\x,0.66) {\scriptsize $+$};}
\foreach \x in {0.0, 1.32, 2.64} {\draw[thick, fill=green!25] (\x,1.32) circle (0.3); \node at (\x,1.32) {$-$};}
\foreach \x in {0.66, 1.98} {\draw[thick, fill=violet!25] (\x,1.32) circle (0.2); \node at (\x,1.32) {\scriptsize $+$};}
\foreach \x in {0.66, 1.98} {\draw[thick, fill=green!25] (\x,1.98) circle (0.3); \node at (\x,1.98) {$-$};}
\foreach \x in {0.0, 1.32, 2.64} {\draw[thick, fill=violet!25] (\x,1.98) circle (0.2); \node at (\x,1.98) {\scriptsize $+$};}
\draw[-{Stealth}, very thick, blue!60!black] (-1.1,1.65) -- (-0.4,1.65);
\node[above] at (-0.75,1.7) {\small urto};
\node at (1.32,-0.75) {\small prima};
\foreach \x in {4.5, 5.82, 7.14} {\draw[thick, fill=green!25] (\x,0) circle (0.3); \node at (\x,0) {$-$};}
\foreach \x in {5.16, 6.48} {\draw[thick, fill=violet!25] (\x,0) circle (0.2); \node at (\x,0) {\scriptsize $+$};}
\foreach \x in {5.16, 6.48} {\draw[thick, fill=green!25] (\x,0.66) circle (0.3); \node at (\x,0.66) {$-$};}
\foreach \x in {4.5, 5.82, 7.14} {\draw[thick, fill=violet!25] (\x,0.66) circle (0.2); \node at (\x,0.66) {\scriptsize $+$};}
\foreach \x in {5.16, 6.48, 7.8} {\draw[thick, fill=green!25] (\x,1.5) circle (0.3); \node at (\x,1.5) {$-$};}
\foreach \x in {5.82, 7.14} {\draw[thick, fill=violet!25] (\x,1.5) circle (0.2); \node at (\x,1.5) {\scriptsize $+$};}
\foreach \x in {5.82, 7.14} {\draw[thick, fill=green!25] (\x,2.16) circle (0.3); \node at (\x,2.16) {$-$};}
\foreach \x in {5.16, 6.48, 7.8} {\draw[thick, fill=violet!25] (\x,2.16) circle (0.2); \node at (\x,2.16) {\scriptsize $+$};}
\draw[{Stealth}-{Stealth}, thick, red] (5.16,0.82) -- (5.16,1.34);
\draw[{Stealth}-{Stealth}, thick, red] (5.82,0.82) -- (5.82,1.34);
\draw[{Stealth}-{Stealth}, thick, red] (6.48,0.82) -- (6.48,1.34);
\draw[{Stealth}-{Stealth}, thick, red] (7.14,0.82) -- (7.14,1.34);
\node at (6.15,-0.75) {\small dopo: cariche uguali di fronte};
\end{tikzpicture}
```

Un metallo colpito allo stesso modo si deforma senza rompersi: il confronto è nella lezione sul [legame metallico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-metallico).

Per condurre la corrente servono cariche libere di muoversi. Nel sale solido le cariche ci sono, ma sono bloccate nel reticolo; nel sale fuso, sopra $801\,^\circ\text{C}$, e nel sale sciolto in acqua gli ioni si muovono, i cationi verso il polo negativo e gli anioni verso quello positivo. Come l'acqua smonta il reticolo lo racconta la lezione [L'acqua come solvente](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/l-acqua-come-solvente).

```ad-example
Esempio 6: riconoscere un composto ionico
Una sostanza bianca fonde a $770\,^\circ\text{C}$, da solida non conduce la corrente, ma la conduce se viene fusa o sciolta in acqua. È fatta di molecole o di ioni?

Il punto di fusione alto dice che le particelle sono tenute da attrazioni forti. La conduzione solo allo stato fuso e in soluzione dice che le cariche ci sono già nel solido, ma sono bloccate: è un composto ionico. I dati sono quelli del cloruro di potassio, $\mathrm{KCl}$.
```

```ad-warning
"I composti ionici conducono la corrente"
Dipende dallo stato. Un cristallo di sale è un isolante: gli ioni non si spostano. Conducono il sale fuso e la soluzione, dove gli ioni sono liberi. A trasportare la carica, in tutti e due i casi, sono gli ioni e non gli elettroni.
```

```ad-note
Non tutti i composti ionici si sciolgono in acqua
Il cloruro di sodio si scioglie bene; il carbonato di calcio del marmo e il solfato di bario quasi per niente. Un composto ionico si scioglie quando l'attrazione tra gli ioni e le molecole d'acqua compensa l'energia reticolare, e con reticoli molto stabili questo non succede.
```
