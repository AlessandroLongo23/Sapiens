# Elettroni, protoni e neutroni

Alla fine dell'Ottocento i chimici erano convinti, con Dalton, che l'atomo fosse la particella più piccola della materia. In meno di quarant'anni, tra il 1897 e il 1932, i fisici trovarono dentro l'atomo tre particelle più piccole: l'elettrone, il protone e il neutrone. Sono le **particelle subatomiche**, e con loro si costruiscono tutti gli atomi. Questa lezione racconta gli esperimenti che le hanno rivelate e dice quanto valgono la loro massa e la loro carica.

## I raggi catodici

Il primo indizio arrivò da un tubo di vetro. Un **tubo di Crookes**, dal nome del fisico inglese William Crookes che li costruì negli anni Settanta dell'Ottocento, è un tubo da cui si toglie quasi tutta l'aria, con due elettrodi di metallo collegati a una tensione molto alta: il **catodo**, negativo, e l'**anodo**, positivo. Quando la tensione è accesa, dal catodo parte qualcosa di invisibile che, dove colpisce il vetro in fondo al tubo o uno schermo ricoperto di una sostanza fluorescente, lo fa brillare. Lo si chiamò **raggi catodici**.

Gli esperimenti mostrarono tre cose:

- i raggi catodici viaggiano in linea retta: un oggetto di metallo messo sul loro cammino proietta un'ombra netta sullo schermo;
- fanno girare una piccola ruota a palette messa sul loro cammino: trasportano energia, come un getto di particelle;
- passando tra due placche cariche, si piegano verso la placca positiva: hanno carica negativa.

```tikz
% nome: particelle-tubo-raggi-catodici
% alt: Un tubo di vetro orizzontale in cui è quasi vuoto. A sinistra il catodo, negativo; poco più a destra l'anodo, positivo, con un foro. Il fascio di raggi catodici, in blu, parte dal catodo, passa dal foro dell'anodo e poi tra due placche, quella in alto positiva e quella in basso negativa: si piega verso la placca positiva e colpisce lo schermo fluorescente a destra più in alto del centro
% svg: particelle-tubo-raggi-catodici-c551546a.svg 285x109
\begin{tikzpicture}
\draw[thick, rounded corners=10pt] (0,0) rectangle (7.2,2);
\draw[very thick] (0.45,0.6) -- (0.45,1.4);
\node at (0.2,1.0) {$-$};
\draw[very thick] (1.6,0.45) -- (1.6,0.92);
\draw[very thick] (1.6,1.08) -- (1.6,1.55);
\node at (1.85,1.7) {$+$};
\draw[thick, fill=red!15] (3.0,1.55) rectangle (4.6,1.68);
\draw[thick, fill=blue!10] (3.0,0.32) rectangle (4.6,0.45);
\node at (3.8,1.85) {$+$};
\node at (3.8,0.15) {$-$};
\draw[very thick, gray] (7.0,0.3) -- (7.0,1.7);
\draw[thick, blue!60!black] (0.45,1.0) -- (3.0,1.0) .. controls (3.8,1.0) and (4.2,1.15) .. (4.6,1.2) -- (7.0,1.5);
\fill[green!50!black] (7.0,1.5) circle (2.5pt);
\node[below] at (0.45,-0.05) {\small catodo};
\node[below] at (1.75,-0.05) {\small anodo};
\node[below] at (3.8,-0.2) {\small placche};
\node[below] at (6.6,-0.05) {\small schermo};
\end{tikzpicture}
```

## L'elettrone

Nel 1897 il fisico inglese Joseph John Thomson deviò i raggi catodici con le placche cariche e con una calamita, e dalla deviazione ricavò il rapporto tra la carica e la massa delle particelle che li formano:

$$\frac{e}{m} = 1{,}76 \cdot 10^{11}\,\text{C/kg}$$

Il valore era lo stesso qualunque fosse il gas rimasto nel tubo e qualunque fosse il metallo del catodo: quelle particelle erano quindi le stesse in tutta la materia. Ed era più di mille volte più grande di quello dello ione idrogeno, lo ione più leggero che si conoscesse: a parità di carica, la particella era più di mille volte più leggera dell'atomo più leggero. Thomson concluse che i raggi catodici sono fatti di particelle con carica negativa, presenti in tutti gli atomi, molto più piccole di un atomo. Sono gli **elettroni**, il nome che Stoney aveva dato alla carica elementare nel 1891.

Thomson misurò il rapporto, non la carica. La carica la misurò nel 1909 il fisico statunitense Robert Millikan con l'esperimento della goccia d'olio. Millikan spruzzava goccioline d'olio piccolissime tra due placche orizzontali cariche; alcune gocce si caricavano, e cambiando la tensione tra le placche Millikan riusciva a tenerle ferme, con la forza elettrica verso l'alto che bilanciava il peso. Dal valore della tensione ricavava la carica della goccia. Tutte le cariche misurate erano multipli interi di uno stesso valore, la carica elementare:

$$e = 1{,}60 \cdot 10^{-19}\,\text{C}$$

```tikz
% nome: particelle-goccia-millikan
% alt: Due placche orizzontali, quella in alto positiva e con un piccolo foro, quella in basso negativa. Tra le placche una goccia d'olio ferma, con due frecce rosse uguali: la forza elettrica verso l'alto e il peso verso il basso. Sopra la placca alta alcune goccioline che cadono dal foro
% svg: particelle-goccia-millikan-055d86ad.svg 159x132
\begin{tikzpicture}
\draw[thick, fill=red!15] (0,2.4) rectangle (1.6,2.55);
\draw[thick, fill=red!15] (1.9,2.4) rectangle (3.5,2.55);
\draw[thick, fill=blue!10] (0,0) rectangle (3.5,0.15);
\node[right] at (3.6,2.47) {$+$};
\node[right] at (3.6,0.07) {$-$};
\fill (1.6,3.2) circle (1.2pt);
\fill (1.85,3.0) circle (1.2pt);
\fill (1.7,2.8) circle (1.2pt);
\draw[thick, fill=yellow!20] (1.75,1.3) circle (0.1);
\draw[-{Stealth}, thick, red] (1.75,1.4) -- (1.75,2.05) node[right] {$F_e$};
\draw[-{Stealth}, thick, red] (1.75,1.2) -- (1.75,0.55) node[right] {$P$};
\end{tikzpicture}
```

Con la carica di Millikan e il rapporto di Thomson si trova la massa dell'elettrone.

```ad-example
Esempio 1: la massa dell'elettrone
Dal rapporto $e/m = 1{,}76 \cdot 10^{11}\,\text{C/kg}$ e dalla carica $e = 1{,}60 \cdot 10^{-19}\,\text{C}$, quanto vale la massa dell'elettrone?

$$m = \frac{e}{e/m} = \frac{1{,}60 \cdot 10^{-19}\,\text{C}}{1{,}76 \cdot 10^{11}\,\text{C/kg}} = 9{,}09 \cdot 10^{-31}\,\text{kg}$$

Con valori più precisi di $e$ e di $e/m$ si ottiene $9{,}11 \cdot 10^{-31}\,\text{kg}$, il valore della tabella in fondo alla lezione.
```

```ad-example
Esempio 2: le gocce di Millikan
Tre gocce d'olio hanno cariche $4{,}80 \cdot 10^{-19}\,\text{C}$, $8{,}00 \cdot 10^{-19}\,\text{C}$ e $6{,}40 \cdot 10^{-19}\,\text{C}$. Quante cariche elementari porta ciascuna?

Si divide ogni carica per $e$: $4{,}80/1{,}60 = 3$, $8{,}00/1{,}60 = 5$, $6{,}40/1{,}60 = 4$. Le gocce hanno $3$, $5$ e $4$ cariche elementari: $3$, $5$ e $4$ elettroni in più, se le cariche sono negative. Una goccia con $5{,}6 \cdot 10^{-19}\,\text{C}$, che darebbe $3{,}5$, non si trova mai.
```

## Il protone

Gli atomi sono neutri: se contengono elettroni negativi, devono contenere anche una carica positiva uguale. Già nel 1886 il fisico tedesco Eugen Goldstein, usando un tubo con il catodo bucato, aveva visto dei raggi che attraversano i fori del catodo e vanno nel verso opposto ai raggi catodici. Si piegano verso la placca negativa, quindi sono positivi, e li chiamò **raggi canale**.

I raggi canale sono ioni positivi del gas contenuto nel tubo: atomi che hanno perso elettroni negli urti con i raggi catodici. A differenza dei raggi catodici, il loro rapporto tra carica e massa cambia con il gas, perché cambia la massa degli atomi. Il rapporto più grande si ha con l'idrogeno: lo ione idrogeno è la particella positiva più leggera, con carica $+e$ e una massa circa $1836$ volte quella dell'elettrone. Nel 1919 il fisico neozelandese Ernest Rutherford trovò la stessa particella tra i frammenti che escono da atomi di azoto colpiti da particelle alfa, e capì che si trova in tutti gli atomi; nel 1920 le diede il nome di **protone**.

```ad-warning
I raggi canale non sono sempre protoni
I raggi canale sono ioni positivi del gas rimasto nel tubo: sono protoni solo quando il gas è idrogeno. Con l'elio o con il neon sono ioni più pesanti, e per questo il loro rapporto tra carica e massa cambia da gas a gas, mentre quello dei raggi catodici è sempre lo stesso.
```

```ad-example
Esempio 3: quanti elettroni pesano come un protone?
La massa del protone è $1{,}673 \cdot 10^{-27}\,\text{kg}$, quella dell'elettrone $9{,}11 \cdot 10^{-31}\,\text{kg}$. Quante volte il protone è più pesante?

$$\frac{m_p}{m_e} = \frac{1{,}673 \cdot 10^{-27}\,\text{kg}}{9{,}11 \cdot 10^{-31}\,\text{kg}} = 1836$$

Servono più di milleottocento elettroni per fare la massa di un protone: in un atomo quasi tutta la massa è dei protoni (e dei neutroni), non degli elettroni.
```

```ad-warning
Carica uguale non vuol dire massa uguale
Protone ed elettrone hanno cariche uguali e opposte, $+e$ e $-e$, ma masse molto diverse. Un errore frequente, nelle domande sulla massa di un atomo o di uno ione, è contare gli elettroni come se pesassero quanto i protoni.
```

## Il neutrone

Con protoni ed elettroni i conti delle masse non tornavano. L'atomo di elio ha due protoni, ma una massa pari a circa quattro volte quella del protone. Nel 1920 Rutherford ipotizzò che nell'atomo ci fosse anche una particella neutra con una massa simile a quella del protone. Trovarla fu difficile, proprio perché non avendo carica non si lascia deviare né attirare. Ci riuscì nel 1932 il fisico inglese James Chadwick, studiando la radiazione che esce dal berillio colpito da particelle alfa: la chiamò **neutrone**. Il neutrone non ha carica, e ha una massa appena più grande di quella del protone.

## Le tre particelle a confronto

Le masse delle particelle subatomiche si scrivono anche in unità di massa atomica $\text{u}$, la stessa unità delle masse atomiche (lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)), con $1\,\text{u} = 1{,}661 \cdot 10^{-27}\,\text{kg}$. La carica si scrive anche come multiplo di $e$: la **carica relativa**.

| Particella | Simbolo | Carica | Carica relativa | Massa | Massa in $\text{u}$ | Scoperta |
|---|---|---|---|---|---|---|
| Elettrone | $\mathrm{e^-}$ | $-1{,}60 \cdot 10^{-19}\,\text{C}$ | $-1$ | $9{,}11 \cdot 10^{-31}\,\text{kg}$ | $0{,}000549$ | Thomson, 1897 |
| Protone | $\mathrm{p^+}$ | $+1{,}60 \cdot 10^{-19}\,\text{C}$ | $+1$ | $1{,}673 \cdot 10^{-27}\,\text{kg}$ | $1{,}007$ | Rutherford, 1919 |
| Neutrone | $\mathrm{n^0}$ | $0$ | $0$ | $1{,}675 \cdot 10^{-27}\,\text{kg}$ | $1{,}009$ | Chadwick, 1932 |

Due cose da ricordare: protone e neutrone hanno quasi la stessa massa, circa $1\,\text{u}$ ciascuno; l'elettrone ha una massa quasi duemila volte più piccola, che nei conti delle masse degli atomi spesso si trascura. Protoni e neutroni si trovano al centro dell'atomo, nel nucleo, e gli elettroni intorno: come si è scoperto lo racconta la lezione [I modelli atomici di Thomson e di Rutherford](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/i-modelli-atomici-di-thomson-e-di-rutherford).

```ad-example
Esempio 4: la carica di un gruppo di particelle
Un atomo di ossigeno ha $8$ protoni, $8$ neutroni e $8$ elettroni. Quanto vale la sua carica? E se acquista $2$ elettroni?

La carica relativa è $8 \cdot (+1) + 8 \cdot 0 + 8 \cdot (-1) = 0$: l'atomo è neutro. Con $2$ elettroni in più diventa $8 - 10 = -2$, cioè una carica $-2e = -3{,}20 \cdot 10^{-19}\,\text{C}$: è lo ione ossido, $\mathrm{O^{2-}}$. I neutroni non contano nella carica.
```
