# Radioattività e decadimenti

Nel 1896 il fisico francese Henri Becquerel trovò annerita una lastra fotografica rimasta al buio in un cassetto, accanto a un sale di uranio: il sale emetteva da solo, senza luce e senza calore, qualcosa che attraversava la carta nera. Due anni dopo Marie e Pierre Curie isolarono due elementi che lo facevano con un'intensità molto maggiore, il polonio e il radio, e chiamarono il fenomeno radioattività. Tutta la chimica studiata finora riguarda gli elettroni, e lascia i nuclei come sono; la radioattività è quello che succede quando a cambiare è il nucleo.

## Nuclei stabili e nuclei instabili

Un nucleo è descritto da due numeri: il numero atomico $Z$, cioè i protoni, e il numero di massa $A$, cioè protoni più neutroni; i neutroni sono $N = A - Z$ (lezione [Numero atomico, numero di massa e isotopi](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/numero-atomico-numero-di-massa-e-isotopi)). Un nucleo con un certo $Z$ e un certo $A$ si scrive ${}^{A}_{Z}\mathrm{X}$, per esempio ${}^{14}_{\ 6}\mathrm{C}$, oppure a parole carbonio-14.

Nel nucleo i protoni, tutti positivi, stanno a distanze piccolissime e si respingono con una forza elettrica enorme. A tenerli insieme è la **forza nucleare forte**, un'attrazione che agisce tra tutti i nucleoni (protone con protone, neutrone con neutrone, protone con neutrone), molto più intensa della repulsione elettrica ma con un raggio d'azione cortissimo, dell'ordine di $10^{-15}\,\text{m}$: si sente solo tra nucleoni vicini. I neutroni aggiungono attrazione senza aggiungere repulsione, e per questo servono: un nucleo è stabile solo se protoni e neutroni sono nel rapporto giusto.

Si conoscono più di tremila nuclei diversi, e solo $250$ circa sono stabili. Se si mette un punto per ogni nucleo stabile su un grafico, con $Z$ in orizzontale e $N$ in verticale, i punti disegnano una striscia stretta, la **fascia di stabilità**.

```tikz
% nome: radioattivita-fascia-stabilita
% alt: Grafico con il numero di protoni Z sull'asse orizzontale, da 0 a 90, e il numero di neutroni N su quello verticale, da 0 a 130. I nuclei stabili sono quadratini blu che formano una striscia stretta: fino a Z = 20 segue la retta tratteggiata N = Z, poi sale più ripida e finisce a Z = 82, N = 126. Sopra la striscia la scritta troppi neutroni, decadimento beta meno; sotto, troppi protoni, decadimento beta più o cattura elettronica; oltre la fine, Z maggiore di 82, nessun nucleo stabile
\begin{tikzpicture}[x=0.055cm,y=0.055cm]
\draw[->] (0,0) -- (98,0) node[right] {$Z$};
\draw[->] (0,0) -- (0,140) node[above] {$N$};
\foreach \t in {20,40,60,80} { \draw (\t,0) -- (\t,-2) node[below] {\small $\t$}; }
\foreach \t in {20,40,60,80,100,120} { \draw (0,\t) -- (-2,\t) node[left] {\small $\t$}; }
\draw[thin, dashed] (0,0) -- (92,92) node[right] {\small $N = Z$};
\foreach \z/\n in {1/0,1/1,2/1,2/2,3/3,3/4,4/5,5/5,5/6,6/6,6/7,7/7,7/8,8/8,8/9,8/10,9/10,10/10,10/11,10/12,11/12,12/12,12/13,12/14,13/14,14/14,14/15,14/16,15/16,16/16,16/17,16/18,17/18,16/20,18/18,17/20,18/20,19/20,18/22,20/20,19/22,20/22,20/23,20/24,21/24,20/26,22/24,22/25,22/26,22/27,22/28,24/26,23/28,24/28,24/29,24/30,26/28,25/30,26/30,26/31,26/32,28/30,27/32,28/32,28/33,28/34,29/34,28/36,30/34,29/36,30/36,30/37,30/38,31/38,30/40,32/38,31/40,32/40,32/41,32/42,34/40,33/42,34/42,34/43,34/44,36/42,35/44,34/46,36/44,35/46,36/46,36/47,36/48,38/46,37/48,36/50,38/48,38/49,38/50,39/50,40/50,40/51,40/52,42/50,41/52,40/54,42/52,42/53,42/54,44/52,42/55,42/56,44/54,44/55,44/56,44/57,44/58,46/56,45/58,44/60,46/58,46/59,46/60,48/58,47/60,46/62,48/60,47/62,46/64,48/62,48/63,48/64,50/62,49/64,48/66,50/64,50/65,50/66,50/67,50/68,50/69,50/70,52/68,51/70,50/72,52/70,51/72,52/71,50/74,52/72,54/70,52/73,52/74,54/72,53/74,54/74,54/75,54/76,56/74,54/77,54/78,56/76,55/78,54/80,56/78,56/79,56/80,58/78,56/81,56/82,58/80,57/82,58/82,59/82,58/84,60/82,60/83,62/82,60/85,60/86,60/88,62/87,62/88,62/90,63/90,62/92,64/90,64/91,64/92,66/90,64/93,64/94,66/92,65/94,64/96,66/94,66/95,66/96,68/94,66/97,66/98,68/96,67/98,68/98,68/99,68/100,70/98,69/100,68/102,70/100,70/101,70/102,70/103,70/104,71/104,70/106,72/104,72/105,72/106,72/107,72/108,73/108,74/108,74/109,74/110,75/110,74/112,76/111,76/112,76/113,76/114,77/114,76/116,78/114,77/116,78/116,78/117,78/118,80/116,79/118,78/120,80/118,80/119,80/120,80/121,80/122,81/122,80/124,82/122,81/124,82/124,82/125,82/126} { \fill[blue!70!black] (\z,\n) rectangle ++(1,1); }
\node[align=center] at (30,92) {\small troppi neutroni:\\ \small $\beta^-$};
\node[align=center] at (76,40) {\small troppi protoni:\\ \small $\beta^+$ o cattura};
\node[align=center] at (66,136) {\small $Z > 82$: nessun\\ \small nucleo stabile};
\end{tikzpicture}
```

La figura dice tre cose.

- I nuclei leggeri stabili hanno circa tanti neutroni quanti protoni: fino al calcio, $Z = 20$, la fascia segue la retta $N = Z$. Il carbonio-12 ha $6$ protoni e $6$ neutroni, l'ossigeno-16 ne ha $8$ e $8$.
- Più il nucleo è pesante, più neutroni servono per compensare la repulsione tra i protoni, che cresce in fretta perché ogni protone respinge tutti gli altri. Nel piombo-208 i neutroni sono $126$ e i protoni $82$: il rapporto $N/Z$ vale $126/82 = 1{,}54$.
- Oltre il piombo, $Z = 82$, la fascia finisce: nessun numero di neutroni basta più, e tutti i nuclei con $Z > 82$ sono instabili.

Un nucleo fuori dalla fascia, o oltre la sua fine, prima o poi si trasforma da solo in un altro nucleo, emettendo una particella. La trasformazione si chiama **decadimento radioattivo**, la proprietà di questi nuclei **radioattività**, e un isotopo con il nucleo instabile è un radioisotopo. Il nucleo che decade è il nucleo padre, quello che si forma è il nucleo figlio. Quando il nucleo decade non si può prevedere, e non dipende dalla temperatura, dalla pressione o dal composto in cui l'atomo si trova: di questo parla la lezione [Il tempo di dimezzamento](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/il-tempo-di-dimezzamento).

```ad-warning
Instabile non vuol dire che decade subito
Un nucleo instabile può restare com'è per una frazione di secondo o per miliardi di anni. L'uranio-238 è radioattivo, eppure metà di quello che c'era quando si è formata la Terra esiste ancora.
```

## Le equazioni nucleari

Un decadimento si scrive con una **equazione nucleare**: a sinistra il nucleo padre, a destra il nucleo figlio e la particella emessa, ognuno con il suo numero di massa in alto e la sua carica in basso. In ogni equazione nucleare si conservano due quantità:

- il numero di nucleoni: la somma dei numeri in alto è la stessa a sinistra e a destra;
- la carica elettrica: la somma dei numeri in basso è la stessa a sinistra e a destra.

Per le particelle che non sono nuclei il numero in basso è la carica, in unità $e$: l'elettrone si scrive ${}^{\ 0}_{-1}e$, perché non ha nucleoni e ha carica $-1$; il neutrone ${}^{1}_{0}n$; il protone ${}^{1}_{1}p$.

Il simbolo dell'elemento, invece, può cambiare, e di solito cambia: se dopo il decadimento il nucleo ha un altro $Z$, è il nucleo di un altro elemento. Trovato il nuovo $Z$, l'elemento si legge sulla [tavola periodica](/strumenti/tavola-periodica).

Per completare un'equazione in cui manca un nucleo o una particella:

1. scrivi i numeri in alto e in basso di tutto quello che conosci;
2. trova il numero in alto che manca, in modo che la somma dei nucleoni sia la stessa ai due lati;
3. trova il numero in basso che manca, in modo che la somma delle cariche sia la stessa ai due lati;
4. se manca un nucleo, cerca l'elemento che ha quel $Z$; se manca una particella, la riconosci dai suoi due numeri.

```ad-warning
Un'equazione nucleare non si bilancia come una reazione chimica
In una reazione chimica gli atomi di ogni elemento sono gli stessi prima e dopo. In un decadimento no: l'uranio diventa torio, il carbonio diventa azoto. Quello che si conserva sono le due somme, dei numeri in alto e dei numeri in basso.
```

## Il decadimento alfa

Nel **decadimento alfa** il nucleo emette una particella $\alpha$, cioè un nucleo di elio-4, fatto di due protoni e due neutroni: ${}^{4}_{2}\mathrm{He}$. Sono le particelle dell'esperimento di Rutherford (lezione [I modelli atomici di Thomson e di Rutherford](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/i-modelli-atomici-di-thomson-e-di-rutherford)). Il nucleo perde quattro nucleoni, di cui due protoni:

$${}^{A}_{Z}\mathrm{X} \longrightarrow {}^{A-4}_{Z-2}\mathrm{Y} + {}^{4}_{2}\mathrm{He}$$

Il numero di massa diminuisce di $4$ e il numero atomico di $2$: il nucleo figlio sta due caselle prima sulla tavola periodica. L'uranio-238 decade così:

$${}^{238}_{\ 92}\mathrm{U} \longrightarrow {}^{234}_{\ 90}\mathrm{Th} + {}^{4}_{2}\mathrm{He}$$

In alto $238 = 234 + 4$, in basso $92 = 90 + 2$. Il decadimento alfa è tipico dei nuclei pesanti, quelli oltre la fine della fascia: emettendo una particella $\alpha$ il nucleo si alleggerisce di due protoni in un colpo solo.

```ad-example
Esempio 1: completare un decadimento alfa
Il radio-226, ${}^{226}_{\ 88}\mathrm{Ra}$, emette una particella $\alpha$. Qual è il nucleo figlio?

Il numero di massa scende di $4$: $A = 226 - 4 = 222$. Il numero atomico scende di $2$: $Z = 88 - 2 = 86$. L'elemento con $Z = 86$ è il radon.

$${}^{226}_{\ 88}\mathrm{Ra} \longrightarrow {}^{222}_{\ 86}\mathrm{Rn} + {}^{4}_{2}\mathrm{He}$$

Controllo: $226 = 222 + 4$ e $88 = 86 + 2$.
```

## Il decadimento beta meno

Nel **decadimento beta meno** un neutrone del nucleo si trasforma in un protone, e il nucleo emette un elettrone, la particella $\beta^-$:

$${}^{1}_{0}n \longrightarrow {}^{1}_{1}p + {}^{\ 0}_{-1}e$$

Il nucleo ha un neutrone in meno e un protone in più. Il numero di nucleoni è lo stesso, quindi $A$ non cambia; $Z$ aumenta di $1$:

$${}^{A}_{Z}\mathrm{X} \longrightarrow {}^{\ \ A}_{Z+1}\mathrm{Y} + {}^{\ 0}_{-1}e$$

Il nucleo figlio sta una casella dopo sulla tavola periodica. Il carbonio-14 decade così, e diventa azoto:

$${}^{14}_{\ 6}\mathrm{C} \longrightarrow {}^{14}_{\ 7}\mathrm{N} + {}^{\ 0}_{-1}e$$

In alto $14 = 14 + 0$, in basso $6 = 7 + (-1)$. Il decadimento $\beta^-$ è tipico dei nuclei con troppi neutroni, quelli che stanno sopra la fascia di stabilità: trasformando un neutrone in un protone il nucleo si avvicina alla fascia. Il carbonio-14 ha $8$ neutroni per $6$ protoni, mentre i carboni stabili ne hanno $6$ o $7$.

```ad-warning
L'elettrone beta non viene dalla nuvola elettronica
L'elettrone emesso nel decadimento $\beta^-$ nasce nel nucleo, nel momento in cui un neutrone diventa un protone: prima non c'era. Non è uno degli elettroni che stanno intorno al nucleo, e l'atomo non diventa uno ione per averlo perso. Per lo stesso motivo nel decadimento $\beta^-$ il numero atomico aumenta, anche se viene emessa una carica negativa: l'errore più frequente è farlo diminuire.
```

```ad-example
Esempio 2: completare un decadimento beta meno
Lo iodio-131, ${}^{131}_{\ 53}\mathrm{I}$, usato in medicina per la tiroide, è un emettitore $\beta^-$. Qual è il nucleo figlio?

Il numero di massa non cambia: $A = 131$. Il numero atomico aumenta di $1$: $Z = 53 + 1 = 54$, che è lo xeno.

$${}^{131}_{\ 53}\mathrm{I} \longrightarrow {}^{131}_{\ 54}\mathrm{Xe} + {}^{\ 0}_{-1}e$$

Controllo: $131 = 131 + 0$ e $53 = 54 - 1$.
```

## Il decadimento beta più e la cattura elettronica

Un nucleo con troppi protoni, sotto la fascia di stabilità, fa il contrario: trasforma un protone in un neutrone. Ha due modi per farlo.

Nel **decadimento beta più** il nucleo emette un **positrone**, la particella $\beta^+$: ha la stessa massa dell'elettrone e carica opposta, $+1$, e si scrive ${}^{\ 0}_{+1}e$.

$${}^{A}_{Z}\mathrm{X} \longrightarrow {}^{\ \ A}_{Z-1}\mathrm{Y} + {}^{\ 0}_{+1}e$$

Il fluoro-18, usato negli esami PET, decade così:

$${}^{18}_{\ 9}\mathrm{F} \longrightarrow {}^{18}_{\ 8}\mathrm{O} + {}^{\ 0}_{+1}e$$

Nella **cattura elettronica** il nucleo cattura uno degli elettroni più interni dell'atomo, che si unisce a un protone e lo trasforma in un neutrone. Qui l'elettrone sta a sinistra della freccia, perché entra nel nucleo, e non viene emessa nessuna particella carica:

$${}^{A}_{Z}\mathrm{X} + {}^{\ 0}_{-1}e \longrightarrow {}^{\ \ A}_{Z-1}\mathrm{Y}$$

Il berillio-7 decade così, e diventa litio:

$${}^{7}_{4}\mathrm{Be} + {}^{\ 0}_{-1}e \longrightarrow {}^{7}_{3}\mathrm{Li}$$

I due modi portano allo stesso nucleo figlio: $A$ non cambia, $Z$ diminuisce di $1$, e l'elemento si sposta una casella prima sulla tavola periodica.

```ad-example
Esempio 3: stessa partenza, stesso arrivo
Il sodio-22, ${}^{22}_{11}\mathrm{Na}$, decade quasi sempre $\beta^+$ e qualche volta per cattura elettronica. Scrivi le due equazioni.

In tutti e due i casi $A$ resta $22$ e $Z$ scende a $11 - 1 = 10$, che è il neon.

$${}^{22}_{11}\mathrm{Na} \longrightarrow {}^{22}_{10}\mathrm{Ne} + {}^{\ 0}_{+1}e \qquad\qquad {}^{22}_{11}\mathrm{Na} + {}^{\ 0}_{-1}e \longrightarrow {}^{22}_{10}\mathrm{Ne}$$

Controllo della prima: $22 = 22 + 0$ e $11 = 10 + 1$. Controllo della seconda: $22 + 0 = 22$ e $11 - 1 = 10$.
```

```ad-note
Il neutrino
Nei decadimenti beta e nella cattura elettronica il nucleo emette anche un'altra particella, il neutrino (un antineutrino nel $\beta^-$): non ha carica, ha una massa piccolissima e attraversa la materia quasi senza lasciare traccia. Non cambia né la somma dei numeri in alto né quella dei numeri in basso, e nelle equazioni di questa lezione non lo scriviamo.
```

## L'emissione gamma

Dopo un decadimento alfa o beta il nucleo figlio resta spesso con un eccesso di energia, in uno stato eccitato, come un atomo dopo che un suo elettrone è salito di livello. Se ne libera emettendo un raggio $\gamma$: un fotone, cioè luce, con una frequenza molto più alta di quella della luce visibile e dei raggi X, e quindi con un'energia molto più grande (lezione [La luce e gli spettri atomici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-luce-e-gli-spettri-atomici)). Un fotone non ha né massa né carica: nell'**emissione gamma** non cambiano né $A$ né $Z$, e il nucleo resta quello che era.

$${}^{99\mathrm{m}}_{\ 43}\mathrm{Tc} \longrightarrow {}^{99}_{43}\mathrm{Tc} + \gamma$$

La lettera m accanto al numero di massa indica un nucleo che resta nello stato eccitato abbastanza a lungo da poterlo usare: il tecnezio-99m è il radioisotopo più usato negli esami di medicina nucleare, proprio perché emette solo raggi $\gamma$, che escono dal corpo e si possono rivelare.

## I decadimenti a confronto

| Decadimento | Particella | Che cosa succede nel nucleo | $A$ | $Z$ |
|---|---|---|---|---|
| $\alpha$ | ${}^{4}_{2}\mathrm{He}$ | escono $2$ protoni e $2$ neutroni | $-4$ | $-2$ |
| $\beta^-$ | ${}^{\ 0}_{-1}e$ | un neutrone diventa un protone | uguale | $+1$ |
| $\beta^+$ | ${}^{\ 0}_{+1}e$ | un protone diventa un neutrone | uguale | $-1$ |
| cattura elettronica | nessuna (entra ${}^{\ 0}_{-1}e$) | un protone diventa un neutrone | uguale | $-1$ |
| $\gamma$ | fotone | il nucleo perde energia | uguale | uguale |

Sul grafico della fascia di stabilità ogni decadimento è uno spostamento, sempre lo stesso.

```tikz
% nome: radioattivita-spostamenti-decadimenti
% alt: Una griglia con Z in orizzontale e N in verticale. Al centro la casella del nucleo padre. Una freccia rossa va in basso a sinistra di due caselle in Z e due in N: decadimento alfa. Una freccia blu va di una casella a destra e una in basso: beta meno. Una freccia verde va di una casella a sinistra e una in alto: beta più o cattura elettronica
\begin{tikzpicture}[scale=0.8]
\draw[gray!40, very thin] (0,0) grid (5,5);
\draw[->] (0,0) -- (5.5,0) node[right] {$Z$};
\draw[->] (0,0) -- (0,5.5) node[above] {$N$};
\draw[thin, fill=red!15] (0,0) rectangle (1,1);
\draw[thin, fill=blue!10] (3,1) rectangle (4,2);
\draw[thin, fill=green!15] (1,3) rectangle (2,4);
\draw[thick, fill=gray!40] (2,2) rectangle (3,3);
\draw[-{Stealth}, thick, red] (2.4,2.4) -- (0.6,0.6);
\draw[-{Stealth}, thick, blue] (2.6,2.4) -- (3.4,1.6);
\draw[-{Stealth}, thick, green!50!black] (2.4,2.6) -- (1.6,3.4);
\node[right] at (3.1,2.7) {\small nucleo padre};
\node[right, red] at (1.1,0.5) {\small $\alpha$};
\node[right, blue] at (4.1,1.5) {\small $\beta^-$};
\node[above, green!50!black] at (1.5,4.05) {\small $\beta^+$, cattura};
\end{tikzpicture}
```

Il decadimento $\alpha$ toglie due protoni e due neutroni; il $\beta^-$ toglie un neutrone e aggiunge un protone, e porta verso la fascia un nucleo che le sta sopra; il $\beta^+$ e la cattura elettronica fanno il contrario. L'emissione $\gamma$ lascia il nucleo nella sua casella.

```ad-example
Esempio 4: riconoscere la particella emessa
Il cobalto-60 decade in nichel-60, e il polonio-210 in piombo-206. Quale particella emette ciascuno? Il cobalto ha $Z = 27$, il nichel $28$, il polonio $84$, il piombo $82$.

Per il cobalto, $A$ resta $60$ e $Z$ passa da $27$ a $28$: la particella ha $0$ in alto e $27 - 28 = -1$ in basso, quindi è un elettrone. È un decadimento $\beta^-$.

$${}^{60}_{27}\mathrm{Co} \longrightarrow {}^{60}_{28}\mathrm{Ni} + {}^{\ 0}_{-1}e$$

Per il polonio, $A$ passa da $210$ a $206$ e $Z$ da $84$ a $82$: la particella ha $210 - 206 = 4$ in alto e $84 - 82 = 2$ in basso, quindi è un nucleo di elio. È un decadimento $\alpha$.

$${}^{210}_{\ 84}\mathrm{Po} \longrightarrow {}^{206}_{\ 82}\mathrm{Pb} + {}^{4}_{2}\mathrm{He}$$
```

```ad-example
Esempio 5: prevedere il decadimento dalla posizione
Il fosforo ha un solo isotopo stabile, il fosforo-31 ($Z = 15$). Quale decadimento ti aspetti dal fosforo-32? E dal fosforo-30?

Il fosforo-32 ha $32 - 15 = 17$ neutroni, uno in più dell'isotopo stabile, che ne ha $16$: sta sopra la fascia e decade $\beta^-$, diventando zolfo-32.

Il fosforo-30 ha $15$ neutroni, uno in meno: sta sotto la fascia e decade $\beta^+$, diventando silicio-30.

$${}^{32}_{15}\mathrm{P} \longrightarrow {}^{32}_{16}\mathrm{S} + {}^{\ 0}_{-1}e \qquad\qquad {}^{30}_{15}\mathrm{P} \longrightarrow {}^{30}_{14}\mathrm{Si} + {}^{\ 0}_{+1}e$$

La regola vale come orientamento: troppi neutroni, $\beta^-$; troppo pochi, $\beta^+$ o cattura elettronica; nuclei molto pesanti, spesso $\alpha$. Qualche nucleo decade in più di un modo.
```

## Quanto penetrano le radiazioni

Le particelle $\alpha$ e $\beta$ e i raggi $\gamma$ si chiamano **radiazioni ionizzanti**: attraversando la materia strappano elettroni agli atomi che incontrano e li trasformano in ioni. È così che rompono i legami delle molecole, anche quelle delle cellule, ed è così che si rivelano. I tre tipi si fermano però a distanze molto diverse.

```tikz
% nome: radioattivita-potere-penetrante
% alt: Una sorgente radioattiva a sinistra emette tre radiazioni verso destra, una sotto l'altra, contro tre schermi: un foglio di carta, una lastra di alluminio spessa qualche millimetro e un blocco di piombo spesso alcuni centimetri. La particella alfa si ferma sul foglio di carta. La particella beta attraversa la carta e si ferma nell'alluminio. Il raggio gamma, disegnato come un'onda, attraversa carta e alluminio ed esce dal piombo attenuato, tratteggiato
\begin{tikzpicture}
\draw[thick, fill=gray!40] (-0.6,0.2) rectangle (0.2,2.2);
\node[rotate=90] at (-0.2,1.2) {\small sorgente};
\draw[thick] (2,0) -- (2,2.4);
\node[above] at (2,2.4) {\small carta};
\draw[thick, fill=gray!20] (4,0) rectangle (4.25,2.4);
\node[above] at (4.12,2.4) {\small alluminio};
\draw[thick, fill=gray!60] (6,0) rectangle (7.1,2.4);
\node[above] at (6.55,2.4) {\small piombo};
\draw[-{Stealth}, thick, red] (0.2,1.9) -- (1.95,1.9);
\node[above, red] at (1.0,1.9) {$\alpha$};
\draw[-{Stealth}, thick, blue] (0.2,1.2) -- (3.95,1.2);
\node[above, blue] at (1.0,1.2) {$\beta$};
\draw[thick, orange!90!black, decorate, decoration={snake, segment length=6pt, amplitude=1.5pt}] (0.2,0.5) -- (6,0.5);
\node[above, orange!90!black] at (1.0,0.55) {$\gamma$};
\draw[-{Stealth}, thin, dashed, orange!90!black] (7.1,0.5) -- (8.2,0.5);
\end{tikzpicture}
```

| Radiazione | Che cos'è | Carica | Che cosa la ferma |
|---|---|---|---|
| $\alpha$ | nucleo di elio | $+2$ | un foglio di carta, pochi centimetri d'aria, lo strato esterno della pelle |
| $\beta$ | elettrone o positrone | $-1$ o $+1$ | qualche millimetro di alluminio |
| $\gamma$ | fotone | $0$ | niente del tutto: alcuni centimetri di piombo, o uno spessore maggiore di cemento, la riducono a una piccola frazione |

La particella $\alpha$ è pesante e ha carica doppia: ionizza moltissimi atomi in un tratto breve, perde subito la sua energia e si ferma. Il raggio $\gamma$, senza carica, interagisce di rado e va lontano. Il potere penetrante e il potere ionizzante vanno quindi in senso opposto.

```ad-warning
Poco penetrante non vuol dire innocuo
Una sorgente $\alpha$ fuori dal corpo fa poco danno, perché la pelle ferma le particelle. Se però la sostanza viene respirata o ingerita, le particelle $\alpha$ cedono tutta la loro energia a pochi strati di cellule vive, e sono le più dannose delle tre. È il caso del radon, un gas radioattivo che esce dal terreno e si accumula nei locali chiusi.
```

## Le famiglie radioattive

Spesso anche il nucleo figlio è instabile, e decade a sua volta. Si forma così una catena di decadimenti, una **famiglia radioattiva**, che parte da un nucleo pesante e finisce solo quando arriva a un nucleo stabile. In natura ce ne sono tre, e tutte finiscono su un isotopo del piombo:

| Capostipite | Nucleo stabile finale |
|---|---|
| uranio-238 | piombo-206 |
| uranio-235 | piombo-207 |
| torio-232 | piombo-208 |

La famiglia dell'uranio-238 passa per quattordici decadimenti, tra cui quelli del radio-226 e del radon-222 dell'esempio 1 e del polonio-210 dell'esempio 4. Il radio e il polonio dei Curie stavano nei minerali di uranio per questo: l'uranio li produce di continuo.

```ad-example
Esempio 6: quanti decadimenti da uranio a piombo
Nella famiglia dell'uranio-238 i decadimenti sono solo $\alpha$ e $\beta^-$. Quanti di ciascun tipo servono per arrivare da ${}^{238}_{\ 92}\mathrm{U}$ a ${}^{206}_{\ 82}\mathrm{Pb}$?

Solo i decadimenti $\alpha$ cambiano il numero di massa, di $4$ ogni volta. Il numero di massa scende di $238 - 206 = 32$, quindi i decadimenti $\alpha$ sono $32 : 4 = 8$.

Otto decadimenti $\alpha$ fanno scendere $Z$ di $8 \cdot 2 = 16$: da $92$ a $76$. Il piombo però ha $Z = 82$, cioè $82 - 76 = 6$ in più, e ogni decadimento $\beta^-$ aumenta $Z$ di $1$: i decadimenti $\beta^-$ sono $6$.

Controllo: $A = 238 - 8 \cdot 4 = 206$ e $Z = 92 - 8 \cdot 2 + 6 = 82$.
```

Nella figura qui sotto il nucleo sta su un pezzo del grafico della fascia di stabilità, quello dei nuclei pesanti, e sei tu a farlo decadere. Scegli il capostipite e premi $\alpha$, $\beta^-$ o $\beta^+$: il nucleo si sposta, e sotto compare l'equazione. Prova a portare l'uranio-238 fino a un nucleo stabile e conta i decadimenti.

```interattivo
% nome: radioattivita-carta-nuclidi
% alt: Un pezzo del grafico dei nuclei pesanti, con Z da 81 a 92 in orizzontale e N da 123 a 147 in verticale. Le caselle verdi sono i nuclei stabili, quelle grigie i nuclei della famiglia naturale del capostipite scelto (uranio-238, uranio-235 o torio-232). Un cerchio arancione segna il nucleo, che si fa decadere con i bottoni alfa, beta meno e beta più; una linea traccia il cammino. Sotto si leggono l'equazione dell'ultimo decadimento, quanti alfa e beta sono stati fatti e se quel decadimento è quello che il nucleo fa in natura
```

Per arrivare dall'uranio-238 al piombo-206 servono sempre $8$ decadimenti $\alpha$ e $6$ $\beta^-$, in qualunque ordine li si faccia: è il conto dell'esempio 6. In natura però l'ordine non si sceglie, perché ogni nucleo ha il suo modo di decadere: le caselle grigie segnano il cammino vero, in cui dopo ogni tratto di decadimenti $\alpha$, che portano il nucleo sopra la fascia, due decadimenti $\beta^-$ lo riportano indietro. Con il torio-232 i decadimenti sono $6$ $\alpha$ e $4$ $\beta^-$, con l'uranio-235 sono $7$ e $4$.

## Trasmutazioni naturali e artificiali

Un decadimento cambia il numero atomico, e quindi trasforma un elemento in un altro: è una trasmutazione, quella che gli alchimisti avevano cercato per secoli con mezzi chimici, senza poterla ottenere, perché le reazioni chimiche non toccano il nucleo. Una trasmutazione si può anche provocare, colpendo un nucleo con una particella. La prima la ottenne Rutherford nel 1919, bombardando l'azoto con particelle $\alpha$:

$${}^{14}_{\ 7}\mathrm{N} + {}^{4}_{2}\mathrm{He} \longrightarrow {}^{17}_{\ 8}\mathrm{O} + {}^{1}_{1}p$$

Le due somme tornano anche qui: $14 + 4 = 17 + 1$ e $7 + 2 = 8 + 1$. Così si producono i radioisotopi usati in medicina e gli elementi dopo l'uranio, che in natura non esistono. Quando il nucleo colpito è molto pesante e si spezza in due, la reazione si chiama fissione: è l'argomento della lezione [Fissione e fusione nucleare](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/fissione-e-fusione-nucleare).
