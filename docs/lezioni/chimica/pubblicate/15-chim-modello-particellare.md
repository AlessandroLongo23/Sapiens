# Il modello particellare della materia

Un profumo spruzzato in un angolo della stanza si sente dall'altra parte dopo pochi secondi, anche con l'aria ferma. Nessuno ha mai visto il profumo attraversare la stanza, ma il fenomeno si spiega bene se si immagina che la materia sia fatta di particelle piccolissime, sempre in movimento, che si mescolano con quelle dell'aria. Questa idea è il **modello particellare della materia**: una descrizione di ciò che non si vede, costruita per spiegare ciò che si vede, a cominciare dalle proprietà dei tre [stati di aggregazione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/gli-stati-di-aggregazione).

## Le quattro idee del modello

Il modello si riassume in quattro affermazioni, che valgono per ogni sostanza e in ogni stato.

1. La materia è fatta di **particelle** piccolissime, invisibili anche al microscopio ottico. Le particelle di una stessa sostanza pura sono tutte uguali tra loro.
2. Tra una particella e l'altra c'è spazio vuoto: non aria, non un'altra sostanza, ma niente.
3. Le particelle sono sempre in movimento, e si muovono tanto più in fretta quanto più alta è la temperatura.
4. Le particelle si attraggono, con forze che sono intense quando le particelle sono vicine e diventano trascurabili quando sono lontane.

Quanto sono piccole? Una molecola d'acqua, la particella dell'acqua, misura circa $0{,}3$ milionesimi di millimetro, e in una sola goccia d'acqua, $0{,}05\,\text{mL}$, ce ne sono circa $1{,}7 \cdot 10^{21}$: più di duecento miliardi per ogni persona sulla Terra. Come si arriva a questo numero lo spiega la lezione sulla [mole](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare). Che cosa siano le particelle (atomi, molecole o ioni) dipende dalla sostanza, ed è l'argomento della lezione [Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni); qui basta sapere che ogni sostanza ha le sue.

```ad-warning
"Tra le particelle c'è l'aria"
L'aria è anche lei fatta di particelle, e non può riempire gli spazi tra le particelle di un'altra sostanza, né tra le sue. Nel modello, tra una particella e l'altra c'è il vuoto. Lo stesso vale per l'acqua: tra le molecole d'acqua non c'è acqua.
```

## I tre stati visti dalle particelle

Le proprietà di solidi, liquidi e aeriformi dipendono da quanto sono vicine le particelle, da quanto si attraggono e da come si muovono.

```tikz
% nome: particelle-tre-stati
% alt: Tre riquadri con le particelle disegnate come cerchi azzurri. Nel solido sono ordinate in righe e colonne, a contatto, e ognuna ha intorno un piccolo segno di vibrazione. Nel liquido sono ancora a contatto ma disordinate, raccolte nella parte bassa del riquadro. Nell'aeriforme sono poche, lontane tra loro e sparse in tutto il riquadro, ognuna con una freccia che indica la direzione in cui si muove
% svg: particelle-tre-stati-95dcc83b.svg 322x118
\begin{tikzpicture}
\draw[thick] (0,0) rectangle (2.4,2.4);
\foreach \i in {0,...,4} \foreach \j in {0,...,3}
  \draw[fill=cyan!25] (0.32+\i*0.44,0.22+\j*0.44) circle (0.17);
\foreach \i in {0,2,4} {
  \draw[thin] (0.32+\i*0.44,1.54) ++(150:0.24) arc (150:210:0.24);
  \draw[thin] (0.32+\i*0.44,1.54) ++(30:0.24) arc (30:-30:0.24);
}
\node at (1.2,-0.35) {solido};
\draw[thick] (3.0,0) rectangle (5.4,2.4);
\foreach \x/\y in {3.2/0.2,3.6/0.22,4.01/0.19,4.43/0.21,4.83/0.2,5.2/0.23,3.42/0.58,3.83/0.57,4.25/0.6,4.66/0.56,5.07/0.6,3.23/0.95,3.66/0.96,4.08/0.98,4.88/0.95,3.46/1.33,4.46/1.31,3.88/1.35}
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
\node at (4.2,-0.35) {liquido};
\draw[thick] (6.0,0) rectangle (8.4,2.4);
\foreach \x/\y/\dx/\dy in {6.4/0.4/0.35/0.15,7.6/0.5/-0.2/0.3,8.0/1.5/0.1/-0.35,6.5/1.8/0.3/-0.2,7.2/1.2/-0.35/-0.1,7.8/2.0/-0.3/0.05}{
  \draw[fill=cyan!25] (\x,\y) circle (0.17);
  \draw[-{Stealth}, thin, blue!60!black] (\x+\dx*0.6,\y+\dy*0.6) -- (\x+\dx*1.5,\y+\dy*1.5);
}
\node at (7.2,-0.35) {aeriforme};
\end{tikzpicture}
```

Nel **solido** le particelle sono a contatto e si attraggono con forze intense, che le tengono ognuna al suo posto: non possono spostarsi, ma vibrano di continuo attorno a una posizione fissa. Per questo il solido ha forma propria e volume proprio, ed è incomprimibile: le particelle sono già a contatto. Nei solidi cristallini le posizioni fisse formano un disegno ordinato che si ripete, il **reticolo cristallino**.

Nel **liquido** le particelle sono ancora a contatto, quindi il volume resta quello, ma le attrazioni non bastano a tenerle ferme in un posto: scorrono le une sulle altre, cambiano vicine di continuo, e così il liquido prende la forma del recipiente. Le attrazioni tengono però unite le particelle, che si raccolgono sul fondo e non riempiono tutto lo spazio.

Nell'**aeriforme** le particelle sono lontanissime tra loro, rispetto alle loro dimensioni, e le attrazioni sono trascurabili. Ogni particella corre in linea retta finché non urta un'altra particella o una parete, e poi cambia direzione. Per questo l'aeriforme occupa tutto il recipiente e si comprime con facilità: c'è moltissimo spazio vuoto da ridurre. Gli urti delle particelle contro le pareti sono la [pressione del gas](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-pressione-dei-gas).

| | Distanza tra le particelle | Attrazioni | Movimento |
|---|---|---|---|
| Solido | a contatto | intense | vibrano attorno a posizioni fisse |
| Liquido | a contatto | meno intense | scorrono le une sulle altre |
| Aeriforme | molto grande | trascurabili | corrono in tutte le direzioni e si urtano |

```ad-warning
"Nel solido le particelle sono ferme"
Le particelle di un solido non cambiano posto, ma non sono mai ferme: vibrano attorno alla loro posizione, e vibrano di più quando il solido si scalda. Anche un cubetto di ghiaccio nel congelatore ha le molecole in vibrazione continua.
```

## Temperatura e agitazione delle particelle

Il movimento disordinato delle particelle si chiama **agitazione termica**. Non tutte le particelle si muovono alla stessa velocità, ma la loro agitazione media è legata alla temperatura: la [temperatura](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore) di un corpo è la misura dell'energia di movimento media delle sue particelle, e quando un corpo si scalda le sue particelle si agitano di più. Due corpi alla stessa temperatura hanno particelle con la stessa agitazione media, anche se sono sostanze diverse.

Se la temperatura misura l'agitazione, deve esistere una temperatura a cui l'agitazione è la più piccola possibile, e più in basso non si può scendere. Questa temperatura si chiama **zero assoluto** e vale $-273{,}15\,^\circ\text{C}$. La **scala Kelvin**, o scala della temperatura assoluta, parte da lì: $0\,\text{K}$ è lo zero assoluto, e un kelvin è grande quanto un grado Celsius. Per passare da una scala all'altra, con $t$ in gradi Celsius e $T$ in kelvin:

$$T = t + 273 \qquad\qquad t = T - 273$$

(con $273{,}15$ quando serve la precisione del centesimo). Nella scala Kelvin non ci sono temperature negative, e si scrive $300\,\text{K}$, senza il simbolo di grado.

```tikz
% nome: particelle-scala-kelvin
% alt: Due scale di temperatura affiancate, come due termometri. A sinistra la scala Celsius con meno 273 gradi, 0 gradi e 100 gradi; a destra la scala Kelvin con 0, 273 e 373 kelvin alla stessa altezza. Le tre righe orizzontali sono indicate come zero assoluto, fusione del ghiaccio ed ebollizione dell'acqua
% svg: particelle-scala-kelvin-7b0e510f.svg 334x182
\begin{tikzpicture}
\draw[thick] (0,0) -- (0,4.2);
\draw[thick] (2.2,0) -- (2.2,4.2);
\foreach \y/\c/\k/\n in {0.2/-273/0/zero assoluto, 2.9/0/273/fusione del ghiaccio, 3.9/100/373/ebollizione dell'acqua} {
  \draw[thin, dashed] (-0.15,\y) -- (2.35,\y);
  \node[left] at (-0.15,\y) {$\c\,^\circ$C};
  \node[right] at (2.35,\y) {$\k$ K};
  \node[right] at (3.8,\y) {\small \n};
}
\node[above] at (0,4.2) {Celsius};
\node[above] at (2.2,4.2) {Kelvin};
\end{tikzpicture}
```

```ad-example
Esempio 1: dalle due scale alla stessa scala
Converti $25\,^\circ\text{C}$ e $-196\,^\circ\text{C}$ in kelvin, e $500\,\text{K}$ in gradi Celsius.

$$25\,^\circ\text{C}: \quad T = 25 + 273 = 298\,\text{K}$$

$$-196\,^\circ\text{C}: \quad T = -196 + 273 = 77\,\text{K}$$

$$500\,\text{K}: \quad t = 500 - 273 = 227\,^\circ\text{C}$$

La seconda è la temperatura a cui bolle l'azoto liquido: sotto zero in gradi Celsius, ma positiva in kelvin, come ogni temperatura assoluta.
```

```ad-example
Esempio 2: dove si agitano di più le particelle?
Un campione di elio è a $250\,\text{K}$, uno di acqua a $-10\,^\circ\text{C}$. In quale le particelle hanno l'agitazione media più grande?

Le due temperature vanno portate nella stessa scala: $-10\,^\circ\text{C}$ sono $-10 + 273 = 263\,\text{K}$, più di $250\,\text{K}$. L'agitazione media è più grande nel campione d'acqua, che è ghiaccio, anche se l'elio è un gas: l'agitazione dipende dalla temperatura, non dallo stato.
```

```ad-warning
Il segno nella conversione
Da gradi Celsius a kelvin si aggiunge $273$, da kelvin a gradi Celsius si toglie. Un controllo veloce: il numero in kelvin è sempre il più grande dei due, e non è mai negativo. Se da $-196\,^\circ\text{C}$ ottieni $-469\,\text{K}$, hai tolto invece di aggiungere.
```

Nella figura qui sotto scegli una sostanza e cambia la temperatura: vedi le particelle vibrare nel solido, scorrere nel liquido e correre nell'aeriforme, sempre più in fretta man mano che la temperatura sale. A una stessa temperatura sostanze diverse possono essere in stati diversi, perché ognuna ha le sue temperature di fusione e di ebollizione.

```interattivo
% nome: particelle-stati-temperatura
% alt: Un recipiente con trenta particelle disegnate come cerchi azzurri. Si sceglie la sostanza (acqua, etanolo, azoto) e con un cursore la temperatura, da meno 220 a 150 gradi Celsius. Sotto la temperatura di fusione le particelle stanno in righe ordinate sul fondo e vibrano, tra fusione ed ebollizione sono ammucchiate sul fondo e scorrono le une sulle altre, sopra l'ebollizione corrono in tutto il recipiente rimbalzando sulle pareti; più alta è la temperatura, più veloce è il movimento. Sotto si leggono la temperatura in gradi Celsius e in kelvin e lo stato della sostanza
```

## Le prove del modello

Le particelle non si vedono, ma molti fenomeni si spiegano solo se ci sono.

La **diffusione** è il mescolarsi spontaneo di due sostanze senza che nessuno le agiti: il profumo nella stanza, una goccia di inchiostro che colora piano piano tutta l'acqua di un bicchiere fermo. Le particelle dell'inchiostro, urtate di continuo da quelle dell'acqua, si spargono in ogni direzione. In acqua calda la goccia si allarga molto prima che in acqua fredda, perché le particelle si muovono più in fretta.

Il **moto browniano** fu osservato nel 1827 dal botanico scozzese Robert Brown: al microscopio, i granelli minuscoli contenuti nel polline, sospesi nell'acqua, si agitano a scatti senza fermarsi mai. Nel 1905 Albert Einstein ne diede la spiegazione: ogni granello è urtato da tutte le parti dalle molecole d'acqua in movimento, e gli urti non si bilanciano mai del tutto. Pochi anni dopo le misure di Jean Perrin confermarono la spiegazione, e con lei l'esistenza delle molecole.

Anche gli spazi vuoti lasciano tracce. Un aeriforme si comprime, un liquido quasi per niente. E se si mescolano $50\,\text{mL}$ di alcol e $50\,\text{mL}$ d'acqua, il volume finale è di circa $97\,\text{mL}$, non $100\,\text{mL}$: le particelle più piccole dell'acqua si sistemano in parte negli spazi tra quelle più grandi dell'alcol, come la sabbia versata in un secchio di sassi.

```ad-example
Esempio 3: una sfera che non passa più nell'anello
Una sfera di metallo passa di misura attraverso un anello. Scaldata sulla fiamma, non passa più; lasciata raffreddare, torna a passare. Come si spiega con il modello particellare?

Scaldando la sfera, le sue particelle vibrano di più attorno alle loro posizioni, e vibrando di più si tengono un po' più lontane le une dalle altre: la sfera si dilata, cioè diventa un po' più grande, anche se le particelle restano le stesse e non cambiano dimensione. Raffreddandosi, le vibrazioni diminuiscono e la sfera torna alle dimensioni di prima. Il fenomeno è la [dilatazione termica](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica).
```

```ad-warning
Le particelle non cambiano
Nel modello, quando una sostanza si scalda, si dilata, fonde o bolle, le particelle restano le stesse, con le stesse dimensioni: cambiano solo la distanza tra loro e il loro movimento. Dire che "le particelle si dilatano" o che "le particelle del ghiaccio fondono" attribuisce alla singola particella una proprietà che è solo dell'insieme.
```

## I passaggi di stato con le particelle

Il modello spiega anche perché, scaldando un solido, si passa al liquido e poi all'aeriforme. Scaldando il solido le particelle vibrano sempre di più, finché alla temperatura di fusione le vibrazioni vincono le attrazioni che le tenevano ai loro posti: il reticolo si disfa e le particelle cominciano a scorrere, il solido fonde. Scaldando ancora il liquido le particelle si muovono sempre più in fretta, e alla temperatura di ebollizione riescono a sfuggire alle attrazioni delle vicine in tutto il liquido, anche dentro, dove formano le bolle: il liquido bolle.

Già prima di bollire, però, qualche particella della superficie, più veloce della media, sfugge nell'aria: per questo una pozzanghera si asciuga anche d'inverno, senza bollire. Le particelle che vanno via sono le più veloci, e quelle che restano sono in media più lente: il liquido che evapora si raffredda, come la pelle bagnata al vento. Questi fenomeni hanno una lezione tutta per loro, [I passaggi di stato](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/i-passaggi-di-stato), e la versione con i conti del modello, per i gas, è la [teoria cinetico-molecolare](/materiale/scuola-superiore/chimica/le-leggi-dei-gas/la-teoria-cinetico-molecolare) del secondo anno.
