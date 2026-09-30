# La pressione dei gas

Una gomma della bicicletta gonfiata bene è dura, e si schiaccia quando la valvola perde. Dentro c'è solo aria, eppure regge il peso del ciclista. Il gas chiuso nella gomma spinge sulle pareti, in ogni punto e in tutte le direzioni: questa spinta, riferita alla superficie su cui agisce, è la pressione del gas. Insieme al volume e alla temperatura, è una delle tre grandezze che descrivono lo stato di un gas.

## La pressione

La **pressione** è il rapporto tra la forza che agisce perpendicolarmente a una superficie e l'area di quella superficie:

$$p = \frac{F}{S}$$

Nel Sistema Internazionale la forza si misura in newton e l'area in metri quadrati, e la pressione in **pascal**: $1\,\text{Pa} = 1\,\text{N/m}^2$. La stessa forza fa una pressione grande su una superficie piccola e una pressione piccola su una superficie grande, come spiega più a fondo la lezione di fisica sulla [pressione](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione).

```ad-example
Esempio 1: la forza su un pistone
Un gas chiuso in un cilindro ha la pressione di $1{,}5 \cdot 10^5\,\text{Pa}$. Con quale forza spinge sul pistone, che ha l'area di $20\,\text{cm}^2$?

L'area va in metri quadrati: $1\,\text{cm}^2 = 10^{-4}\,\text{m}^2$, quindi $S = 20 \cdot 10^{-4}\,\text{m}^2 = 2{,}0 \cdot 10^{-3}\,\text{m}^2$. Da $p = F/S$:

$$F = p \cdot S = 1{,}5 \cdot 10^5\,\text{Pa} \cdot 2{,}0 \cdot 10^{-3}\,\text{m}^2 = 3{,}0 \cdot 10^2\,\text{N}$$

È circa il peso di una massa di $30\,\text{kg}$, su un pistone grande come quattro monete da due euro.
```

## Da dove viene la pressione di un gas

La [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare) dice che le particelle di un gas si muovono di continuo in tutte le direzioni. Quando una particella arriva su una parete del recipiente, ci sbatte e rimbalza indietro: per invertire il suo moto la parete deve spingerla, e la particella spinge la parete con una forza uguale e opposta. Un solo urto è una spinta minuscola, ma su ogni centimetro quadrato di parete ne arrivano miliardi di miliardi al secondo, e le spinte si sommano in una forza costante: la forza del gas sulla parete.

```tikz
% nome: pressione-urti-parete
% alt: Particelle di gas che si muovono verso una parete verticale; una particella ha appena urtato la parete e rimbalza indietro, con la freccia della velocità prima dell'urto tratteggiata e quella dopo l'urto piena. Oltre la parete una freccia rossa F indica la spinta che la parete riceve dall'urto
% svg: pressione-urti-parete-fd81c55a.svg 197x118
\begin{tikzpicture}
\draw[thick] (4,0) -- (4,3);
\foreach \y in {0.15,0.3,...,3} \draw[thin] (4,\y) -- ++(0.15,-0.15);
\foreach \x/\y/\a/\l in {1.0/2.4/-10/0.6, 2.2/0.6/25/0.6, 1.4/1.3/190/0.5, 0.6/0.5/60/0.4, 2.8/2.5/-30/0.5} {
  \draw[-{Stealth}, thick, blue!60!black] (\x,\y) -- ++(\a:\l);
  \fill[blue!30] (\x,\y) circle (0.09);
  \draw (\x,\y) circle (0.09);
}
\draw[-{Stealth}, thick, dashed, blue!60!black] (3.06,2.0) -- (3.82,1.55);
\draw[-{Stealth}, thick, blue!60!black] (3.91,1.5) -- (3.06,1.0);
\fill[blue!30] (3.91,1.5) circle (0.09);
\draw (3.91,1.5) circle (0.09);
\draw[-{Stealth}, thick, red] (4.3,1.5) -- (5.1,1.5) node[right] {$\vec{F}$};
\end{tikzpicture}
```

Da questo modello si capisce da che cosa dipende la pressione di un gas:

- dal **numero di particelle** in un certo volume: più particelle vuol dire più urti al secondo, e più pressione. Una gomma si gonfia pompando dentro altra aria;
- dalla **velocità delle particelle**, cioè dalla temperatura: particelle più veloci urtano più spesso e più forte. Una bomboletta spray scaldata al sole può scoppiare;
- dal **volume**: se lo stesso gas sta in un volume più piccolo, le particelle sono più vicine alle pareti e le urtano più spesso.

Gli urti arrivano su tutte le pareti allo stesso modo, perché le particelle si muovono in tutte le direzioni: la pressione di un gas chiuso è la stessa in ogni punto del recipiente e spinge in tutte le direzioni. Per questo un palloncino gonfiato è rotondo.

```ad-warning
La pressione non è una forza
Pressione e forza non sono la stessa grandezza: la pressione è una forza divisa per un'area, e si misura in pascal, non in newton. Lo stesso gas, alla stessa pressione, fa una forza piccola su un tappo piccolo e una forza grande su un pistone grande.
```

## La pressione atmosferica

Anche l'aria è un gas, e le sue molecole urtano tutto quello che incontrano: la nostra pelle, i muri, la superficie del mare. La **pressione atmosferica** è la pressione dell'aria, e nasce dal peso della colonna d'aria che sta sopra: al livello del mare vale in media circa $1{,}013 \cdot 10^5\,\text{Pa}$, e diminuisce salendo di quota, dove sopra resta meno aria.

La misurò per primo Evangelista Torricelli, nel 1644, con un tubo di vetro pieno di mercurio capovolto in una bacinella: il mercurio scende finché la colonna è alta $760\,\text{mm}$ sopra la superficie della bacinella, e la pressione dell'aria sulla bacinella regge la colonna. L'esperienza, i barometri e il modo in cui la pressione cambia con la quota sono nella lezione di fisica sulla [pressione atmosferica](/materiale/scuola-superiore/fisica/l-equilibrio-dei-fluidi/la-pressione-atmosferica-e-la-sua-misura).

## Le unità di misura della pressione

Il pascal è un'unità piccola, e in chimica si usano spesso altre unità, nate dalla storia delle misure di pressione:

| Unità | Simbolo | Quanto vale |
|---|---|---|
| kilopascal | kPa | $1\,\text{kPa} = 1000\,\text{Pa}$ |
| ettopascal | hPa | $1\,\text{hPa} = 100\,\text{Pa}$ |
| bar | bar | $1\,\text{bar} = 10^5\,\text{Pa}$ |
| atmosfera | atm | $1\,\text{atm} = 1{,}013 \cdot 10^5\,\text{Pa} = 101{,}3\,\text{kPa}$ |
| millimetro di mercurio | mmHg | $760\,\text{mmHg} = 1\,\text{atm}$ |

L'**atmosfera** è la pressione atmosferica media al livello del mare; il **millimetro di mercurio** è la pressione di una colonna di mercurio alta un millimetro, e viene dall'esperienza di Torricelli (si chiama anche torr, dal suo nome). Le uguaglianze da ricordare sono:

$$1\,\text{atm} = 760\,\text{mmHg} = 101{,}3\,\text{kPa} = 1{,}013\,\text{bar}$$

Per passare da un'unità all'altra si moltiplica o si divide per il fattore giusto, come in ogni [equivalenza](/materiale/scuola-superiore/chimica/misure-e-grandezze/grandezze-e-unita-del-sistema-internazionale).

```ad-example
Esempio 2: da un'unità all'altra
Un gas ha la pressione di $0{,}850\,\text{atm}$. Quanto vale in millimetri di mercurio e in kilopascal? E una pressione di $745\,\text{mmHg}$ quanto vale in atmosfere e in kilopascal?

Un'atmosfera vale $760\,\text{mmHg}$ e $101{,}3\,\text{kPa}$:

$$0{,}850\,\text{atm} = 0{,}850 \cdot 760\,\text{mmHg} = 646\,\text{mmHg} \qquad 0{,}850\,\text{atm} = 0{,}850 \cdot 101{,}3\,\text{kPa} = 86{,}1\,\text{kPa}$$

Per la seconda si divide per $760$, perché i millimetri di mercurio in un'atmosfera sono $760$:

$$745\,\text{mmHg} = \frac{745}{760}\,\text{atm} = 0{,}980\,\text{atm} \qquad 0{,}980\,\text{atm} = 0{,}980 \cdot 101{,}3\,\text{kPa} = 99{,}3\,\text{kPa}$$

Controllo: $745\,\text{mmHg}$ è un po' meno di $760$, e infatti viene un po' meno di un'atmosfera.
```

```ad-warning
Moltiplicare o dividere
Un'atmosfera è una pressione grande, un millimetro di mercurio una pressione piccola: passando dalle atmosfere ai millimetri di mercurio il numero deve diventare più grande, e si moltiplica per $760$; nel verso opposto si divide. Chi scrive $745\,\text{mmHg} = 745 \cdot 760\,\text{atm}$ trova più di mezzo milione di atmosfere per l'aria di una stanza.
```

## Misurare la pressione di un gas: il manometro

Lo strumento che misura la pressione di un gas chiuso è il **manometro**. Il più semplice è il manometro a tubo aperto: un tubo di vetro piegato a U, con un po' di mercurio sul fondo. Un ramo è collegato al recipiente del gas, l'altro è aperto verso l'aria.

Il mercurio fa da bilancia tra due pressioni: quella del gas, da una parte, e quella atmosferica $p_0$, dall'altra. Se le due pressioni sono uguali, il mercurio sta allo stesso livello nei due rami. Se il gas preme di più, spinge in giù il mercurio dal suo lato, e il mercurio sale nel ramo aperto; se preme di meno, succede il contrario. Il dislivello $\Delta h$ tra le due superfici del mercurio, misurato in millimetri, dà direttamente la differenza tra le due pressioni in millimetri di mercurio:

$$p_{gas} = p_0 + \Delta h \qquad \text{mercurio più alto nel ramo aperto}$$

$$p_{gas} = p_0 - \Delta h \qquad \text{mercurio più alto dal lato del gas}$$

```tikz
% nome: pressione-manometro-aperto
% alt: Due manometri a tubo aperto collegati a un pallone di gas. Nel primo il mercurio è più alto nel ramo aperto, di un dislivello delta h: la pressione del gas è la pressione atmosferica più delta h. Nel secondo il mercurio è più alto dal lato del gas: la pressione del gas è la pressione atmosferica meno delta h. Frecce rosse indicano la pressione atmosferica che preme nel ramo aperto
% svg: pressione-manometro-aperto-36017c57.svg 335x170
\begin{tikzpicture}
\foreach \s/\l/\r in {0/1.0/1.8, 4.6/1.8/1.0} {
\begin{scope}[xshift=\s cm]
\fill[blue!10] (0.7,2.2) circle (0.6);
\fill[blue!10] (1.2,2.05) rectangle (2.15,2.3);
\fill[blue!10] (1.9,\l) rectangle (2.15,2.3);
\fill[gray!60] (1.9,\l) -- (1.9,0.2) -- (3.1,0.2) -- (3.1,\r) -- (2.85,\r) -- (2.85,0.45) -- (2.15,0.45) -- (2.15,\l) -- cycle;
\draw[thin] (1.9,\l) -- (2.15,\l);
\draw[thin] (2.85,\r) -- (3.1,\r);
\draw[thick] (0.7,2.2) ++(9.6:0.6) arc (9.6:345.5:0.6);
\draw[thick] (1.29,2.3) -- (2.15,2.3) -- (2.15,0.45) -- (2.85,0.45) -- (2.85,3.2);
\draw[thick] (1.28,2.05) -- (1.9,2.05) -- (1.9,0.2) -- (3.1,0.2) -- (3.1,3.2);
\node at (0.7,2.2) {\small gas};
\draw[dashed, thin] (2.15,1.8) -- (3.6,1.8);
\draw[dashed, thin] (2.15,1.0) -- (3.6,1.0);
\draw[{Stealth}-{Stealth}, thin] (3.45,1.0) -- (3.45,1.8) node[midway, right] {$\Delta h$};
\draw[-{Stealth}, thick, red] (2.975,3.3) -- (2.975,2.5);
\node[red, above] at (2.975,3.3) {$p_0$};
\end{scope}
}
\node at (1.9,-0.35) {$p_{gas} = p_0 + \Delta h$};
\node at (6.5,-0.35) {$p_{gas} = p_0 - \Delta h$};
\end{tikzpicture}
```

```ad-example
Esempio 3: la lettura del manometro
Il barometro del laboratorio segna $752\,\text{mmHg}$. Un pallone di gas è collegato a un manometro a tubo aperto, e il mercurio nel ramo aperto è $38\,\text{mm}$ più alto che nel ramo del gas. Quanto vale la pressione del gas, in millimetri di mercurio e in atmosfere? E se il mercurio fosse $25\,\text{mm}$ più alto dal lato del gas?

Il mercurio è spinto verso il ramo aperto, quindi il gas preme più dell'aria:

$$p_{gas} = p_0 + \Delta h = 752\,\text{mmHg} + 38\,\text{mmHg} = 790\,\text{mmHg} = \frac{790}{760}\,\text{atm} = 1{,}04\,\text{atm}$$

Nel secondo caso il mercurio è salito dal lato del gas, che preme meno dell'aria:

$$p_{gas} = p_0 - \Delta h = 752\,\text{mmHg} - 25\,\text{mmHg} = 727\,\text{mmHg}$$
```

```ad-warning
Il dislivello va aggiunto o tolto
Prima di fare il conto guarda da che parte il mercurio è più alto. Il mercurio sale dal lato dove la pressione è più bassa: se sale nel ramo aperto, il gas ha una pressione maggiore di quella atmosferica e il dislivello si aggiunge; se sale dal lato del gas, si toglie. Il dislivello è in millimetri di mercurio solo perché nel tubo c'è mercurio: con l'acqua, $13{,}6$ volte meno densa, lo stesso dislivello sarebbe una differenza di pressione $13{,}6$ volte più piccola.
```

## Pressione assoluta e pressione relativa

Il manometro delle gomme, quello del benzinaio, misura come il manometro a tubo aperto la differenza tra la pressione del gas e quella atmosferica: una gomma sgonfia, con dentro aria alla pressione atmosferica, segna zero. Questa differenza si chiama **pressione relativa**; la pressione vera del gas, quella che compare nelle leggi dei gas, è la **pressione assoluta**:

$$p_{assoluta} = p_{relativa} + p_0$$

```ad-example
Esempio 4: la gomma dell'auto
Il manometro del benzinaio segna $2{,}2\,\text{bar}$ per una gomma dell'auto. La pressione atmosferica è $1{,}0\,\text{bar}$. Quanto vale la pressione assoluta dell'aria nella gomma, in bar e in atmosfere?

$$p = 2{,}2\,\text{bar} + 1{,}0\,\text{bar} = 3{,}2\,\text{bar} \qquad p = \frac{3{,}2}{1{,}013}\,\text{atm} = 3{,}2\,\text{atm}$$

Il bar e l'atmosfera sono quasi uguali, e con due cifre significative il numero non cambia.
```

```ad-warning
Nelle leggi dei gas va la pressione assoluta
Le leggi dei gas delle prossime lezioni valgono con la pressione assoluta, cioè con quella che si misura rispetto al vuoto. Se un esercizio dà la lettura di un manometro che misura la pressione relativa, come quello delle gomme, prima si somma la pressione atmosferica.
```
