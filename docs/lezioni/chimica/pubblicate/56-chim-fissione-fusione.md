# Fissione e fusione nucleare

Un grammo di uranio-235 che si spezza libera l'energia che si ottiene bruciando più di due tonnellate di carbone, e il Sole brilla da miliardi di anni senza bruciare niente. In tutti e due i casi l'energia viene dai nuclei: da nuclei pesanti che si dividono, nella fissione, o da nuclei leggeri che si uniscono, nella fusione. Per capire perché due processi opposti liberano entrambi energia bisogna prima pesare un nucleo, e scoprire che pesa meno delle particelle di cui è fatto.

## Il difetto di massa

Un nucleo di elio-4 è fatto di due protoni e due neutroni. Le masse, in unità di massa atomica, sono:

| Particella | Massa |
|---|---|
| protone | $1{,}00728\,\text{u}$ |
| neutrone | $1{,}00866\,\text{u}$ |
| nucleo di elio-4 | $4{,}00151\,\text{u}$ |

Due protoni e due neutroni, pesati separati, hanno una massa di $2 \cdot 1{,}00728\,\text{u} + 2 \cdot 1{,}00866\,\text{u} = 4{,}03188\,\text{u}$. Il nucleo che formano pesa meno: mancano $0{,}03037\,\text{u}$. Non è un errore di misura, e succede per tutti i nuclei.

Il **difetto di massa** $\Delta m$ di un nucleo è la differenza tra la somma delle masse dei suoi nucleoni, presi separati, e la massa del nucleo:

$$\Delta m = Z \cdot m_p + N \cdot m_n - m_{\text{nucleo}}$$

con $Z$ il numero di protoni e $N = A - Z$ il numero di neutroni (lezione [Numero atomico, numero di massa e isotopi](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/numero-atomico-numero-di-massa-e-isotopi)).

## Massa ed energia

La massa che manca è diventata energia. Nel 1905 Albert Einstein mostrò che massa ed energia sono legate dalla relazione

$$E = m\,c^2$$

dove $c = 3{,}00 \cdot 10^8\,\text{m/s}$ è la velocità della luce. Quando i nucleoni si uniscono in un nucleo, attratti dalla forza nucleare forte (lezione [Radioattività e decadimenti](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/radioattivita-e-decadimenti)), liberano energia, e il sistema perde la massa corrispondente. L'energia liberata, che è anche quella che servirebbe per separare di nuovo tutti i nucleoni, si chiama **energia di legame** del nucleo:

$$E = \Delta m \cdot c^2$$

Siccome $c^2$ vale $9{,}00 \cdot 10^{16}\,\text{m}^2/\text{s}^2$, a una massa piccolissima corrisponde un'energia grande. Per avere joule la massa va messa in kilogrammi: $1\,\text{u} = 1{,}6605 \cdot 10^{-27}\,\text{kg}$. Conviene calcolare una volta per tutte l'energia che corrisponde a una unità di massa atomica:

$$1{,}6605 \cdot 10^{-27}\,\text{kg} \cdot \left(3{,}00 \cdot 10^8\,\text{m/s}\right)^2 = 1{,}494 \cdot 10^{-10}\,\text{J}$$

Le energie dei nuclei si esprimono di solito in megaelettronvolt: $1\,\text{MeV} = 10^6\,\text{eV} = 1{,}60 \cdot 10^{-13}\,\text{J}$.

```ad-example
Esempio 1: l'energia di legame dell'elio-4
Con le masse della tabella, calcola il difetto di massa e l'energia di legame del nucleo di elio-4.

$$\Delta m = 2 \cdot 1{,}00728\,\text{u} + 2 \cdot 1{,}00866\,\text{u} - 4{,}00151\,\text{u} = 0{,}03037\,\text{u}$$

In kilogrammi: $0{,}03037 \cdot 1{,}6605 \cdot 10^{-27}\,\text{kg} = 5{,}043 \cdot 10^{-29}\,\text{kg}$.

$$E = \Delta m \cdot c^2 = 5{,}043 \cdot 10^{-29}\,\text{kg} \cdot 9{,}00 \cdot 10^{16}\,\text{m}^2/\text{s}^2 = 4{,}54 \cdot 10^{-12}\,\text{J}$$

In megaelettronvolt: $\dfrac{4{,}54 \cdot 10^{-12}\,\text{J}}{1{,}60 \cdot 10^{-13}\,\text{J/MeV}} = 28{,}4\,\text{MeV}$.

Per un solo nucleo sembra poco. Per una mole di nuclei, $4{,}54 \cdot 10^{-12}\,\text{J} \cdot 6{,}022 \cdot 10^{23}\,\text{mol}^{-1} = 2{,}73 \cdot 10^{12}\,\text{J/mol}$: milioni di volte l'energia di una reazione chimica, che è dell'ordine delle centinaia di kilojoule per mole.
```

```ad-warning
La massa va in kilogrammi, e la velocità della luce al quadrato
I due errori più frequenti nel calcolo: lasciare il difetto di massa in unità di massa atomica, e moltiplicare per $c$ invece che per $c^2$. Con $\Delta m$ in kilogrammi e $c$ in metri al secondo il risultato è in joule.
```

```ad-warning
Nelle reazioni nucleari la massa non si conserva
Nelle reazioni chimiche la legge di Lavoisier vale con una precisione che nessuna bilancia riesce a smentire, perché le energie in gioco sono piccole. Nei nuclei no: la massa dei prodotti è diversa da quella dei reagenti in modo misurabile. Si conserva il numero di nucleoni, non la massa.
```

## L'energia di legame per nucleone

Un nucleo grande ha più nucleoni e quindi un'energia di legame più grande, ma questo non dice se è legato meglio. Per confrontare nuclei diversi si divide l'energia di legame per il numero di massa: l'**energia di legame per nucleone** $\dfrac{E}{A}$ è l'energia che in media lega ogni nucleone. Più è alta, più il nucleo è stabile.

Per l'elio-4 dell'esempio 1 vale $\dfrac{28{,}4\,\text{MeV}}{4} = 7{,}1\,\text{MeV}$.

```ad-example
Esempio 2: il ferro-56
Il nucleo di ferro-56 ($Z = 26$) ha una massa di $55{,}92067\,\text{u}$. Quanto vale la sua energia di legame per nucleone?

I neutroni sono $N = 56 - 26 = 30$.

$$\Delta m = 26 \cdot 1{,}00728\,\text{u} + 30 \cdot 1{,}00866\,\text{u} - 55{,}92067\,\text{u} = 0{,}52841\,\text{u}$$

$$E = 0{,}52841 \cdot 1{,}494 \cdot 10^{-10}\,\text{J} = 7{,}89 \cdot 10^{-11}\,\text{J} = 493\,\text{MeV}$$

$$\frac{E}{A} = \frac{493\,\text{MeV}}{56} = 8{,}8\,\text{MeV}$$

Ogni nucleone del ferro-56 è legato più di ogni nucleone dell'elio-4: $8{,}8\,\text{MeV}$ contro $7{,}1\,\text{MeV}$.
```

Se si calcola l'energia di legame per nucleone di tutti i nuclei stabili e la si mette in grafico in funzione del numero di massa, si ottiene una curva che ogni discorso sull'energia nucleare usa come mappa.

```tikz
% nome: fissione-fusione-curva-energia-legame
% alt: Grafico dell'energia di legame per nucleone, in megaelettronvolt, in funzione del numero di massa A da 0 a 240. La curva sale ripida per i nuclei leggeri, con un picco isolato per l'elio-4 a 7,1; arriva al massimo, 8,8, intorno al ferro-56, e poi scende piano fino a 7,6 per l'uranio-235. Una freccia verde verso destra nella parte in salita è la fusione, una freccia rossa verso sinistra nella parte in discesa è la fissione: tutte e due portano verso il massimo
% svg: fissione-fusione-curva-energia-legame-0aa2ce06.svg 348x232
\begin{tikzpicture}[x=0.03cm,y=0.5cm]
\draw[->] (0,0) -- (252,0) node[right] {$A$};
\draw[->] (0,0) -- (0,9.9) node[above] {$E/A$ (MeV)};
\foreach \a in {50,100,150,200} { \draw (\a,0) -- (\a,-0.12) node[below] {\small $\a$}; }
\foreach \e in {2,4,6,8} { \draw (0,\e) -- (-2,\e) node[left] {\small $\e$}; }
\draw[thick, blue] plot coordinates {(1,0.00) (2,1.11) (3,2.83) (4,7.07) (6,5.33) (7,5.61) (9,6.46) (11,6.93) (12,7.68) (14,7.52) (16,7.98) (20,8.03) (24,8.26) (28,8.45) (32,8.49) (40,8.60) (48,8.72) (56,8.79) (62,8.79) (70,8.73) (84,8.72) (98,8.64) (110,8.55) (120,8.50) (138,8.39) (150,8.26) (165,8.15) (184,8.01) (197,7.92) (208,7.87) (220,7.72) (232,7.62) (238,7.57)};
\fill (2,1.11) circle (1.5pt) node[right] {\small ${}^{2}\mathrm{H}$};
\fill (4,7.07) circle (1.5pt) node[left] {\small ${}^{4}\mathrm{He}$};
\fill (56,8.79) circle (1.5pt) node[above] {\small ${}^{56}\mathrm{Fe}$};
\fill (235,7.59) circle (1.5pt) node[above] {\small ${}^{235}\mathrm{U}$};
\draw[-{Stealth}, thick, green!50!black] (8,3.6) -- (40,6.6);
\node[right, green!50!black] at (27,4.6) {\small fusione};
\draw[-{Stealth}, thick, red] (222,6.5) -- (150,7.3);
\node[below, red] at (186,6.6) {\small fissione};
\end{tikzpicture}
```

La curva sale in fretta per i nuclei leggeri, con qualche picco (l'elio-4 è molto più legato dei suoi vicini), raggiunge il massimo, circa $8{,}8\,\text{MeV}$, intorno al ferro e al nichel, e poi scende piano fino a $7{,}6\,\text{MeV}$ per l'uranio. La discesa è l'effetto della repulsione tra i protoni, che cresce con il loro numero. I nuclei intorno al ferro sono i più stabili di tutti.

Da qui viene la regola: una reazione nucleare libera energia se i nuclei che si formano stanno più in alto sulla curva di quelli di partenza, perché i nucleoni finiscono legati di più, e la differenza esce come energia. Ci sono due modi per salire: da destra, spezzando un nucleo pesante in due nuclei medi, e da sinistra, unendo due nuclei leggeri in uno più pesante.

```ad-warning
Energia di legame alta non vuol dire energia da spendere
L'energia di legame non è energia contenuta nel nucleo, pronta a uscire: è l'energia che il nucleo ha già ceduto quando si è formato. Un nucleo con un'energia di legame per nucleone alta, come il ferro, è un nucleo da cui non si ricava più niente, né spezzandolo né fondendolo.
```

Nella figura qui sotto scegli un nucleo con il cursore e decidi che cosa farne: dividerlo in due parti uguali o unirlo a un altro uguale. La figura legge sulla curva l'energia di legame prima e dopo, e dice se la reazione libera energia o ne chiede. Prova con l'uranio-235, poi con il ferro-56 in tutti e due i modi, poi con il deuterio, ${}^{2}\mathrm{H}$.

```interattivo
% nome: fissione-fusione-curva-energia
% alt: La curva dell'energia di legame per nucleone in funzione del numero di massa, con un punto arancione sul nucleo scelto con il cursore e un punto blu sul nucleo, o sui due nuclei, che si formano. Si sceglie tra dividere il nucleo in due parti uguali (fissione) e unirlo a un altro uguale (fusione). Sotto si leggono la reazione, l'energia di legame per nucleone prima e dopo, e l'energia liberata o assorbita in megaelettronvolt
```

La fissione dell'uranio-235 in due nuclei medi libera più di $200\,\text{MeV}$; quella del ferro-56 ne assorbe una ventina, e anche la sua fusione ne assorbe: dal massimo della curva si può solo scendere. La fusione di due nuclei di deuterio in elio-4 libera $24\,\text{MeV}$, che divisi per i soli quattro nucleoni coinvolti sono $6\,\text{MeV}$ a testa, contro meno di $1\,\text{MeV}$ per nucleone della fissione dell'uranio.

## La fissione nucleare

La **fissione nucleare** è la divisione di un nucleo pesante in due nuclei più leggeri, con l'emissione di alcuni neutroni e di molta energia. La scoprirono nel 1938 a Berlino i chimici Otto Hahn e Fritz Strassmann, che bombardando l'uranio con neutroni trovarono tra i prodotti il bario, un elemento con poco più di metà del suo numero atomico; la spiegazione, e il nome, li diedero poche settimane dopo Lise Meitner e Otto Frisch.

Il nucleo che si usa è l'uranio-235. Quando assorbe un neutrone lento diventa instabile, si deforma e si spezza. I due frammenti non sono sempre gli stessi; una delle divisioni possibili è

$${}^{235}_{\ 92}\mathrm{U} + {}^{1}_{0}n \longrightarrow {}^{141}_{\ 56}\mathrm{Ba} + {}^{92}_{36}\mathrm{Kr} + 3\,{}^{1}_{0}n$$

Le due somme tornano, come in ogni equazione nucleare: in alto $235 + 1 = 141 + 92 + 3 \cdot 1$, in basso $92 + 0 = 56 + 36 + 0$.

```ad-example
Esempio 3: l'energia di una fissione
Calcola l'energia liberata dalla fissione scritta sopra, e quella liberata da $1{,}00\,\text{g}$ di uranio-235. Masse degli atomi: uranio-235 $235{,}04393\,\text{u}$, bario-141 $140{,}91440\,\text{u}$, kripton-92 $91{,}92617\,\text{u}$; neutrone $1{,}00866\,\text{u}$.

Un neutrone entra e tre escono: nel bilancio delle masse ne restano due tra i prodotti.

$$\Delta m = 235{,}04393\,\text{u} - 140{,}91440\,\text{u} - 91{,}92617\,\text{u} - 2 \cdot 1{,}00866\,\text{u} = 0{,}18604\,\text{u}$$

$$E = 0{,}18604 \cdot 1{,}494 \cdot 10^{-10}\,\text{J} = 2{,}78 \cdot 10^{-11}\,\text{J}$$

Sono $174\,\text{MeV}$ per un solo nucleo. In $1{,}00\,\text{g}$ di uranio-235 i nuclei sono

$$\frac{1{,}00\,\text{g}}{235{,}04\,\text{g/mol}} \cdot 6{,}022 \cdot 10^{23}\,\text{mol}^{-1} = 2{,}56 \cdot 10^{21}$$

e l'energia è $2{,}56 \cdot 10^{21} \cdot 2{,}78 \cdot 10^{-11}\,\text{J} = 7{,}1 \cdot 10^{10}\,\text{J}$. Un kilogrammo di carbone, bruciando, dà circa $3 \cdot 10^7\,\text{J}$: per avere la stessa energia ne servono più di due tonnellate.

Le masse sono quelle degli atomi, elettroni compresi: gli elettroni sono $92$ prima e $56 + 36 = 92$ dopo, e nella differenza si cancellano.
```

I frammenti della fissione hanno troppi neutroni per il loro numero atomico, e sono quindi radioattivi: decadono $\beta^-$ più volte, liberando altra energia, finché arrivano a un nucleo stabile. Contando anche questi decadimenti, ogni fissione libera in tutto circa $200\,\text{MeV}$.

```ad-warning
La fissione non è un decadimento alfa
In un decadimento $\alpha$ il nucleo emette da solo una particella piccola e resta quasi quello di prima, con $A$ più basso di $4$. Nella fissione il nucleo si spezza in due parti di grandezza simile, e di solito lo fa perché ha assorbito un neutrone.
```

### La reazione a catena

Ogni fissione dell'uranio-235 è provocata da un neutrone e ne libera due o tre. Se almeno uno di questi provoca un'altra fissione, il processo si mantiene da solo: è una **reazione a catena**.

```tikz
% nome: fissione-fusione-reazione-catena
% alt: Schema di una reazione a catena. Da sinistra un neutrone colpisce un nucleo di uranio-235, che si spezza in due frammenti e libera tre neutroni. Due dei tre neutroni colpiscono altri due nuclei di uranio-235, che si spezzano a loro volta in due frammenti liberando ciascuno altri tre neutroni; il terzo neutrone si perde. A ogni passaggio le fissioni raddoppiano
% svg: fissione-fusione-reazione-catena-3ea10b5a.svg 367x208
\begin{tikzpicture}
\fill[gray] (-1.6,0) circle (0.07);
\draw[-{Stealth}, thin] (-1.5,0) -- (-0.5,0);
\node[above] at (-1.2,0.05) {\small $n$};
\draw[thick, fill=orange!25] (0,0) circle (0.42);
\node at (0,0) {\scriptsize ${}^{235}\mathrm{U}$};
\draw[thin, dashed] (0,0.42) -- (0,0.78);
\draw[thin, dashed] (0,-0.42) -- (0,-0.83);
\draw[thick, fill=blue!10] (0,1.05) circle (0.27);
\draw[thick, fill=blue!10] (0,-1.05) circle (0.22);
\node[left] at (-0.3,-1.1) {\small frammenti};
\draw[-{Stealth}, thin] (0.38,0.25) -- (2.8,1.45);
\draw[-{Stealth}, thin] (0.38,-0.25) -- (2.8,-1.45);
\draw[-{Stealth}, thin] (0.45,0) -- (2.4,0);
\fill[gray] (2.5,0) circle (0.07);
\node[right] at (2.6,0) {\small perso};
\foreach \y in {1.65,-1.65} {
\draw[thick, fill=orange!25] (3.2,\y) circle (0.42);
\node at (3.2,\y) {\scriptsize ${}^{235}\mathrm{U}$};
\draw[thick, fill=blue!10] (3.75,\y+0.8) circle (0.27);
\draw[thick, fill=blue!10] (3.75,\y-0.8) circle (0.22);
\draw[-{Stealth}, thin] (3.62,\y+0.14) -- (5.5,\y+0.55);
\draw[-{Stealth}, thin] (3.65,\y) -- (5.6,\y);
\draw[-{Stealth}, thin] (3.62,\y-0.14) -- (5.5,\y-0.55);
\node[right] at (5.65,\y) {\small altre fissioni};
}
\end{tikzpicture}
```

Che cosa succede dipende da quanti neutroni, in media, vanno a segno.

- Se ogni fissione ne provoca in media meno di una, la reazione si spegne. Succede in un pezzo di uranio piccolo, dal quale quasi tutti i neutroni escono senza incontrare un nucleo. La massa minima perché la reazione si mantenga si chiama massa critica.
- Se ogni fissione ne provoca esattamente una, la reazione procede a ritmo costante e l'energia esce in modo regolare: è la reazione controllata di un reattore nucleare.
- Se ogni fissione ne provoca più di una, il numero di fissioni cresce a ogni passaggio, come nella figura, e in una frazione di secondo si libera un'energia enorme: è la reazione incontrollata di una bomba atomica.

L'uranio naturale è quasi tutto uranio-238, che non sostiene la reazione a catena; l'uranio-235 è solo lo $0{,}72\%$ (lo si legge nella scheda dell'[uranio](/strumenti/tavola-periodica?elemento=U) della tavola periodica). Per i reattori più diffusi l'uranio si arricchisce, portando l'uranio-235 a qualche unità per cento; per una bomba serve un arricchimento molto maggiore.

### Le centrali nucleari

In una centrale nucleare la reazione a catena avviene nel nocciolo del reattore, dove tre cose la tengono sotto controllo. Il moderatore, di solito acqua, rallenta i neutroni, perché l'uranio-235 assorbe bene solo quelli lenti. Le barre di controllo, fatte di materiali che assorbono i neutroni come il cadmio e il boro, si inseriscono di più o di meno tra le barre di combustibile per tenere a una, in media, le fissioni provocate da ogni fissione. Un fluido, di nuovo acqua nella maggior parte dei reattori, porta via il calore.

Da qui in poi la centrale funziona come una a carbone o a gas: il calore produce vapore, il vapore fa girare una turbina, la turbina un alternatore. La differenza sta nel combustibile: non c'è combustione, quindi durante il funzionamento non si emette anidride carbonica, e ne serve pochissimo. In cambio restano le scorie: i frammenti di fissione e gli altri nuclei radioattivi che si formano nel combustibile, alcuni con tempi di dimezzamento di decine di migliaia di anni (lezione [Il tempo di dimezzamento](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/il-tempo-di-dimezzamento)), che vanno tenuti isolati per tutto quel tempo. L'altro rischio è quello degli incidenti, come a Černobyl' nel 1986 e a Fukushima nel 2011.

## La fusione nucleare

La **fusione nucleare** è l'unione di due nuclei leggeri in un nucleo più pesante. La reazione più studiata, perché è la più facile da innescare, è quella tra i due isotopi pesanti dell'idrogeno, il deuterio e il trizio:

$${}^{2}_{1}\mathrm{H} + {}^{3}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + {}^{1}_{0}n$$

```tikz
% nome: fissione-fusione-deuterio-trizio
% alt: La fusione tra deuterio e trizio. A sinistra un nucleo di deuterio, un protone e un neutrone, e un nucleo di trizio, un protone e due neutroni, si avvicinano. A destra della freccia ci sono un nucleo di elio-4, due protoni e due neutroni, e un neutrone libero che si allontana
% svg: fissione-fusione-deuterio-trizio-6244a5a4.svg 244x106
\begin{tikzpicture}
\draw[thick, fill=red!15] (0,0.5) circle (0.2);
\node at (0,0.5) {\small $+$};
\draw[thick, fill=gray!20] (0.38,0.5) circle (0.2);
\node[above] at (0.19,0.75) {\small ${}^{2}\mathrm{H}$};
\draw[thick, fill=gray!20] (-0.02,-0.72) circle (0.2);
\draw[thick, fill=gray!20] (0.38,-0.72) circle (0.2);
\draw[thick, fill=red!15] (0.18,-0.4) circle (0.2);
\node at (0.18,-0.4) {\small $+$};
\node[below] at (0.19,-0.95) {\small ${}^{3}\mathrm{H}$};
\draw[-{Stealth}, thin] (0.75,0.4) -- (1.25,0.1);
\draw[-{Stealth}, thin] (0.75,-0.45) -- (1.25,-0.15);
\draw[-{Stealth}, thick] (1.7,0) -- (2.9,0);
\draw[thick, fill=gray!20] (3.6,0.19) circle (0.2);
\draw[thick, fill=red!15] (3.98,0.19) circle (0.2);
\node at (3.98,0.19) {\small $+$};
\draw[thick, fill=red!15] (3.6,-0.19) circle (0.2);
\node at (3.6,-0.19) {\small $+$};
\draw[thick, fill=gray!20] (3.98,-0.19) circle (0.2);
\node[below] at (3.79,-0.45) {\small ${}^{4}\mathrm{He}$};
\draw[thick, fill=gray!20] (5.2,0.5) circle (0.2);
\draw[-{Stealth}, thin] (5.45,0.6) -- (6.1,0.85);
\node[below] at (5.3,0.25) {\small $n$};
\end{tikzpicture}
```

```ad-example
Esempio 4: l'energia di una fusione
Calcola l'energia liberata dalla fusione di un nucleo di deuterio con uno di trizio, e quella liberata da $1{,}00\,\text{g}$ di miscela. Masse degli atomi: deuterio $2{,}01410\,\text{u}$, trizio $3{,}01605\,\text{u}$, elio-4 $4{,}00260\,\text{u}$; neutrone $1{,}00866\,\text{u}$.

$$\Delta m = (2{,}01410 + 3{,}01605)\,\text{u} - (4{,}00260 + 1{,}00866)\,\text{u} = 0{,}01889\,\text{u}$$

$$E = 0{,}01889 \cdot 1{,}494 \cdot 10^{-10}\,\text{J} = 2{,}82 \cdot 10^{-12}\,\text{J}$$

Sono $17{,}6\,\text{MeV}$. Una coppia deuterio-trizio ha una massa di $5{,}03015\,\text{u}$, quindi in $1{,}00\,\text{g}$ di miscela le coppie sono

$$\frac{1{,}00\,\text{g}}{5{,}03015\,\text{g/mol}} \cdot 6{,}022 \cdot 10^{23}\,\text{mol}^{-1} = 1{,}197 \cdot 10^{23}$$

e l'energia è $1{,}197 \cdot 10^{23} \cdot 2{,}82 \cdot 10^{-12}\,\text{J} = 3{,}4 \cdot 10^{11}\,\text{J}$: quasi cinque volte quella di un grammo di uranio-235 dell'esempio 3.
```

La difficoltà è far avvicinare i due nuclei. Sono entrambi positivi e si respingono, e la forza nucleare forte, che li unirebbe, agisce solo a distanze piccolissime. Per arrivarci i nuclei devono urtarsi a velocità altissime, cioè la temperatura deve essere di milioni di gradi: a quelle temperature gli atomi hanno perso i loro elettroni e la materia è un plasma, un gas di nuclei e di elettroni liberi.

```ad-warning
Fissione e fusione riguardano nuclei diversi
Liberano energia tutte e due perché riguardano nuclei diversi: la fissione i nuclei molto pesanti, a destra del massimo della curva, la fusione quelli molto leggeri, a sinistra. Fondere due nuclei di uranio, o spezzare un nucleo di elio, costerebbe energia.
```

### Le stelle

Nel centro del Sole la temperatura è di circa quindici milioni di gradi, e la pressione è enorme: lì i nuclei di idrogeno fondono. Il risultato di una serie di passaggi è che quattro nuclei di idrogeno diventano un nucleo di elio-4:

$$4\,{}^{1}_{1}\mathrm{H} \longrightarrow {}^{4}_{2}\mathrm{He} + 2\,{}^{\ 0}_{+1}e$$

In alto $4 \cdot 1 = 4 + 0$, in basso $4 \cdot 1 = 2 + 2 \cdot 1$. Lo $0{,}7\%$ della massa dell'idrogeno diventa energia, quella che il Sole irraggia.

```ad-example
Esempio 5: quanta massa perde il Sole
Il Sole irraggia $3{,}8 \cdot 10^{26}\,\text{J}$ ogni secondo. Quanta massa perde in un secondo?

Da $E = m\,c^2$:

$$m = \frac{E}{c^2} = \frac{3{,}8 \cdot 10^{26}\,\text{J}}{9{,}00 \cdot 10^{16}\,\text{m}^2/\text{s}^2} = 4{,}2 \cdot 10^{9}\,\text{kg}$$

Più di quattro milioni di tonnellate al secondo. Il Sole però ha una massa di $2{,}0 \cdot 10^{30}\,\text{kg}$: a questo ritmo, in dieci miliardi di anni ne perde meno di un millesimo.
```

Quando in una stella l'idrogeno del centro finisce, se la stella è abbastanza grande comincia a fondere l'elio in carbonio e ossigeno, e poi nuclei via via più pesanti. La fusione si ferma al ferro, il massimo della curva, perché da lì in poi non libera più energia. Gli elementi di cui sono fatti i pianeti e i viventi, dal carbonio al ferro, si sono formati così dentro stelle che non esistono più; quelli più pesanti del ferro si formano in eventi molto più violenti, come le esplosioni delle stelle di grande massa.

### La fusione sulla Terra

Sulla Terra la fusione è stata ottenuta in modo incontrollato nella bomba all'idrogeno, dove a portare deuterio e trizio alla temperatura necessaria è l'esplosione di una bomba a fissione. Ottenerla in modo controllato, per produrre energia, è molto più difficile: nessun recipiente resiste a un plasma a cento milioni di gradi. Le due strade su cui si lavora sono tenere il plasma sospeso con campi magnetici intensi, dentro macchine a forma di ciambella come ITER, in costruzione nel sud della Francia, e comprimere una pallina di combustibile con fasci laser. Un reattore a fusione avrebbe un combustibile abbondante (il deuterio si ricava dall'acqua) e non produrrebbe le scorie a lunga vita della fissione, ma oggi nessun impianto produce più energia elettrica di quanta ne consuma.

## Fissione e fusione a confronto

| | Fissione | Fusione |
|---|---|---|
| Che cosa succede | un nucleo pesante si divide in due nuclei medi | due nuclei leggeri si uniscono |
| Nuclei di partenza | uranio-235, plutonio-239 | deuterio, trizio, idrogeno |
| Come si innesca | con un neutrone lento | con temperature di milioni di gradi |
| Energia per grammo | circa $7 \cdot 10^{10}\,\text{J}$ | circa $3 \cdot 10^{11}\,\text{J}$ |
| Prodotti | frammenti radioattivi, neutroni | elio, neutroni |
| Dove avviene | centrali nucleari, bombe atomiche | stelle, bombe all'idrogeno, reattori sperimentali |
