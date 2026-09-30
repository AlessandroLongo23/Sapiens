# La temperatura e le scale termometriche

Una mattina d'inverno tocchi la ringhiera di ferro del balcone e il legno della panchina accanto: il ferro sembra molto più freddo, eppure i due oggetti sono stati tutta la notte nella stessa aria e hanno la stessa temperatura. Il tatto non misura la temperatura, e per questo la fisica usa uno strumento, il termometro, e una scala di numeri su cui tutti sono d'accordo.

## Temperatura e sensazione termica

Un esperimento che si fa in casa con tre bacinelle: una con acqua calda, una con acqua tiepida, una con acqua fredda. Tieni per un minuto la mano destra nell'acqua calda e la sinistra in quella fredda, poi mettile tutte e due nella bacinella tiepida. La stessa acqua sembra fresca alla mano destra e calda alla sinistra. La sensazione di caldo e di freddo dipende da com'era la mano prima, e da quanto in fretta il corpo che tocchi le porta via o le dà energia: il ferro della ringhiera sembra più freddo del legno perché la porta via più in fretta, come spiega la lezione [Conduzione, convezione e irraggiamento](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/conduzione-convezione-e-irraggiamento).

La **temperatura** è la grandezza fisica che dice quanto un corpo è caldo o freddo, misurata con un termometro e non con il tatto. Nel [Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale) è una delle sette grandezze di base, e la sua unità è il kelvin; nella vita di tutti i giorni si usano i gradi Celsius.

## Il termometro

Un termometro sfrutta una proprietà di un corpo che cambia in modo regolare con la temperatura. Nel termometro a liquido la proprietà è il volume: un bulbo di vetro pieno di liquido (alcol colorato o, nei termometri più vecchi, mercurio) continua in un tubicino sottile, il capillare. Quando la temperatura sale il liquido si dilata, come spiega la lezione [La dilatazione termica](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/la-dilatazione-termica), e poiché il capillare è sottile anche un piccolo aumento di volume fa salire parecchio la colonna. L'altezza della colonna è la misura.

Il termometro segna la sua temperatura, non quella del corpo: messo a contatto con un corpo, si scalda o si raffredda finché i due non arrivano alla stessa temperatura, e solo allora la lettura è quella del corpo. È l'equilibrio termico, di cui parla la lezione [L'equilibrio termico e il calorimetro](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/l-equilibrio-termico-e-il-calorimetro). Per questo il termometro della febbre va tenuto qualche minuto sotto il braccio: è la [prontezza](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura) dello strumento.

### La taratura e i punti fissi

Un termometro appena costruito ha la colonna che sale e scende, ma nessun numero accanto. Per dargli una scala si fa la **taratura**, con due **punti fissi**: due situazioni che si riproducono sempre alla stessa temperatura.

1. Si mette il bulbo nel ghiaccio che fonde, e si segna dove si ferma la colonna: è $0\,^\circ\text{C}$.
2. Si mette il bulbo nel vapore dell'acqua che bolle alla pressione atmosferica normale, e si segna di nuovo: è $100\,^\circ\text{C}$.
3. Si divide il tratto tra i due segni in $100$ parti uguali: ognuna è un grado Celsius. La stessa divisione si prolunga sopra i $100$ e sotto lo $0$.

```tikz
% nome: termometro-taratura-punti-fissi
% alt: Un termometro a liquido verticale, con il bulbo in basso e il capillare. Accanto al capillare due segni lunghi: il più basso, a 3,0 centimetri dalla base del capillare, è lo zero, segnato nel ghiaccio fondente; il più alto, a 18,0 centimetri, è il cento, segnato nell'acqua bollente. Tra i due, nove tacche più corte dividono il tratto in dieci parti di dieci gradi. La colonna di liquido arriva a 7,2 centimetri
% svg: termometro-taratura-punti-fissi-ccec821b.svg 281x233
\begin{tikzpicture}
\fill[red!50] (0,-0.45) circle (0.32);
\fill[red!50] (-0.06,-0.2) rectangle (0.06,1.8);
\draw[thick] (-0.15,-0.079) -- (-0.15,5) arc[start angle=180, end angle=0, radius=0.15] -- (0.15,-0.079) arc[start angle=67.97, end angle=-247.97, radius=0.4];
\draw[thin] (0.15,0) -- (0.55,0) node[right] {base del capillare};
\draw[thin] (-0.15,0) -- (-1.75,0);
\foreach \y in {1.125,1.5,...,4.2} \draw[thin] (0.15,\y) -- (0.35,\y);
\draw (0.15,0.75) -- (0.55,0.75) node[right] {$0\,^\circ$C, ghiaccio fondente};
\draw (0.15,4.5) -- (0.55,4.5) node[right] {$100\,^\circ$C, acqua bollente};
\draw[dashed, thin] (0.15,1.8) -- (0.9,1.8) node[right] {colonna a $7{,}2$ cm};
\draw[thin] (-0.15,0.75) -- (-0.6,0.75);
\draw[thin] (-0.15,4.5) -- (-1.75,4.5);
\draw[{Stealth}-{Stealth}, thin] (-0.4,0.02) -- (-0.4,0.73);
\node[left] at (-0.4,0.375) {\small $3{,}0$ cm};
\draw[{Stealth}-{Stealth}, thin] (-1.6,0.02) -- (-1.6,4.48);
\node[left] at (-1.6,2.25) {$18{,}0$ cm};
\end{tikzpicture}
```

I punti fissi funzionano perché, finché il ghiaccio fonde o l'acqua bolle, la temperatura non cambia, anche se si continua a scaldare: lo spiega la lezione [I passaggi di stato e il calore latente](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente). La pressione conta: in montagna, dove la pressione atmosferica è più bassa, l'acqua bolle sotto i $100\,^\circ\text{C}$, e per questo il secondo punto fisso si prende alla pressione normale.

Con la taratura, una lettura qualunque si trasforma in temperatura con una [proporzione](/materiale/scuola-superiore/matematica/numeri-razionali/rapporti-proporzioni-e-percentuali): la temperatura sta a $100$ come il tratto sopra lo zero sta al tratto tra i due punti fissi.

```ad-example
Esempio 1: un termometro tarato con il righello
Su un termometro senza scala la colonna è a $3{,}0\,\text{cm}$ dalla base del capillare nel ghiaccio fondente e a $18{,}0\,\text{cm}$ nell'acqua bollente. Messo in una stanza, la colonna si ferma a $7{,}2\,\text{cm}$. Che temperatura c'è nella stanza?

Tra i due punti fissi ci sono $18{,}0 - 3{,}0 = 15{,}0\,\text{cm}$ per $100\,^\circ\text{C}$. Sopra lo zero la colonna è salita di $7{,}2 - 3{,}0 = 4{,}2\,\text{cm}$, quindi

$$t = \frac{4{,}2\,\text{cm}}{15{,}0\,\text{cm}} \cdot 100\,^\circ\text{C} = 28\,^\circ\text{C}$$

Ogni grado vale $15{,}0 / 100 = 0{,}15\,\text{cm}$ di colonna.
```

```ad-warning
Lo zero non è la base della colonna
La lunghezza si misura dal segno dello zero, non dalla base del capillare. Nell'esempio 1, $7{,}2 / 18{,}0 \cdot 100 = 40\,^\circ\text{C}$ è sbagliato: conta come temperatura anche i $3{,}0\,\text{cm}$ che la colonna ha già a $0\,^\circ\text{C}$.
```

## La scala Celsius

La scala tarata così è la **scala Celsius**, da Anders Celsius, che nel 1742 propose una scala con questi due punti fissi (la sua era rovesciata, con lo $0$ all'acqua che bolle; l'anno dopo fu girata come la usiamo oggi). La temperatura in gradi Celsius si indica con $t$, e si scrive con lo spazio tra il numero e il simbolo: $21\,^\circ\text{C}$. Sotto lo zero le temperature sono negative, $-5\,^\circ\text{C}$, e non c'è niente di strano: lo zero Celsius è solo la temperatura del ghiaccio che fonde, scelta per comodità.

Proprio perché lo zero è una scelta, i rapporti tra temperature Celsius non hanno significato: a $20\,^\circ\text{C}$ non fa "il doppio del caldo" che a $10\,^\circ\text{C}$. Le differenze invece sì: da $10$ a $20\,^\circ\text{C}$ la temperatura sale di $10\,^\circ\text{C}$, come da $80$ a $90\,^\circ\text{C}$.

## La scala Kelvin

Non si può raffreddare un corpo quanto si vuole: esiste una temperatura più bassa di tutte, lo **zero assoluto**, che vale $-273{,}15\,^\circ\text{C}$. Ci si può avvicinare moltissimo, ma non raggiungerlo. La scala **Kelvin**, o scala assoluta, mette il suo zero proprio lì e usa gradi larghi come quelli Celsius. La temperatura assoluta si indica con $T$ e si misura in **kelvin**, simbolo $\text{K}$, senza il segno di grado: $293\,\text{K}$, non $293\,^\circ\text{K}$.

$$T = t + 273{,}15 \qquad\qquad t = T - 273{,}15$$

Quando i dati sono gradi interi, come quasi sempre negli esercizi, basta $273$: $20\,^\circ\text{C}$ sono $293\,\text{K}$. Nella scala Kelvin non ci sono temperature negative.

Il grado Celsius e il kelvin hanno la stessa ampiezza, quindi una **differenza di temperatura** ha lo stesso numero nelle due scale, come dice già la lezione sulle unità del SI: se l'acqua passa da $20\,^\circ\text{C}$ a $50\,^\circ\text{C}$, cioè da $293\,\text{K}$ a $323\,\text{K}$,

$$\Delta T = \Delta t = 30\,\text{K} = 30\,^\circ\text{C}$$

```ad-warning
Il $+273$ solo sulle temperature, non sulle differenze
Una temperatura si converte aggiungendo $273$; una differenza di temperatura no, perché i $273$ si tolgono sottraendo. L'aumento da $20\,^\circ\text{C}$ a $50\,^\circ\text{C}$ è di $30\,\text{K}$, non di $303\,\text{K}$.
```

```ad-example
Esempio 2: da Celsius a kelvin e ritorno
L'azoto liquido bolle a $-196\,^\circ\text{C}$; il corpo umano è a $310\,\text{K}$. Quanto valgono queste temperature nell'altra scala?

$$T = -196 + 273 = 77\,\text{K} \qquad\qquad t = 310 - 273 = 37\,^\circ\text{C}$$

Con le temperature negative il segno conta: $-196 + 273$ fa $77$, non $469$.
```

```ad-note
La definizione del kelvin
Dal 2019 il kelvin non si definisce più con un punto fisso dell'acqua, ma fissando il valore di una costante della fisica, la costante di Boltzmann (BIPM, "Le Système international d'unités", nona edizione, 2019). Per le misure di tutti i giorni non cambia niente: il ghiaccio fonde sempre a $273{,}15\,\text{K}$ alla pressione normale.
```

## La scala Fahrenheit

Negli Stati Uniti si usa ancora la scala **Fahrenheit**, di Daniel Gabriel Fahrenheit (1724): il ghiaccio fonde a $32\,^\circ\text{F}$ e l'acqua bolle a $212\,^\circ\text{F}$. Tra i due punti fissi ci sono $180$ gradi Fahrenheit invece di $100$, quindi un grado Fahrenheit vale $100/180 = 5/9$ di grado Celsius. Indicando con $t_F$ la temperatura Fahrenheit:

$$t_F = \frac{9}{5}\,t + 32 \qquad\qquad t = \frac{5}{9}\,(t_F - 32)$$

Nella prima formula prima si moltiplica, poi si aggiunge $32$; nella seconda prima si toglie $32$, poi si moltiplica.

```tikz
% nome: scale-celsius-kelvin-fahrenheit
% alt: Tre scale termometriche verticali affiancate, Celsius, Kelvin e Fahrenheit, con quattro linee orizzontali che attraversano tutte e tre alla stessa temperatura: acqua bollente 100 gradi Celsius, 373 kelvin, 212 gradi Fahrenheit; corpo umano 37 gradi Celsius, 310 kelvin, 98,6 gradi Fahrenheit; ghiaccio fondente 0 gradi Celsius, 273 kelvin, 32 gradi Fahrenheit; meno 40 gradi Celsius, 233 kelvin, meno 40 gradi Fahrenheit
% svg: scale-celsius-kelvin-fahrenheit-f70e184e.svg 353x207
\begin{tikzpicture}
\foreach \x/\s in {0/Celsius, 2.6/Kelvin, 5.2/Fahrenheit} {
  \draw[thick] (\x,-1.5) -- (\x,3.4);
  \node[above] at (\x,3.4) {\small \s};
}
\foreach \y/\c/\k/\f/\w in {3/{$100\,^\circ$C}/{$373$ K}/{$212\,^\circ$F}/acqua bollente, 1.11/{$37\,^\circ$C}/{$310$ K}/{$98{,}6\,^\circ$F}/corpo umano, 0/{$0\,^\circ$C}/{$273$ K}/{$32\,^\circ$F}/ghiaccio fondente, -1.2/{$-40\,^\circ$C}/{$233$ K}/{$-40\,^\circ$F}/} {
  \draw[dashed, thin] (-0.2,\y) -- (5.4,\y);
  \node[above right, inner sep=1pt] at (0.05,\y) {\small \c};
  \node[above right, inner sep=1pt] at (2.65,\y) {\small \k};
  \node[above right, inner sep=1pt] at (5.25,\y) {\small \f};
  \node[left] at (-0.2,\y) {\small \w};
}
\end{tikzpicture}
```

```ad-example
Esempio 3: la febbre in Fahrenheit
Un termometro americano segna $101\,^\circ\text{F}$. Quanto vale la temperatura in gradi Celsius? E a quanti gradi Fahrenheit corrispondono $37\,^\circ\text{C}$?

$$t = \frac{5}{9}\,(101 - 32) = \frac{5}{9} \cdot 69 = 38{,}33\ldots \approx 38{,}3\,^\circ\text{C}$$

$$t_F = \frac{9}{5} \cdot 37 + 32 = 66{,}6 + 32 = 98{,}6\,^\circ\text{F}$$

C'è la febbre: $38{,}3\,^\circ\text{C}$.
```

```ad-warning
Il $32$ al posto sbagliato
Da Fahrenheit a Celsius si toglie $32$ prima di moltiplicare per $5/9$: $\frac{5}{9} \cdot 101 - 32 = 24{,}1$ è sbagliato. Controllo veloce con i punti fissi: la formula deve dare $32\,^\circ\text{F} \to 0\,^\circ\text{C}$ e $212\,^\circ\text{F} \to 100\,^\circ\text{C}$.
```

Le due scale segnano lo stesso numero una volta sola: ponendo $t_F = t$ nella prima formula si trova $t = \frac{9}{5}t + 32$, cioè $t = -40$. A $-40\,^\circ\text{C}$ fa anche $-40\,^\circ\text{F}$.

Nella figura qui sotto il termometro ha accanto le tre scale. Prima lo tari: lo metti nel ghiaccio fondente e nell'acqua bollente, e la scala Celsius compare tra i due segni. Poi sposti la temperatura e leggi lo stesso livello del liquido nelle tre scale.

```interattivo
% nome: termometro-tre-scale
% alt: Un termometro a liquido con accanto tre scale verticali, Celsius, Kelvin e Fahrenheit, e un cursore che cambia la temperatura da meno 40 a 110 gradi Celsius. All'inizio il termometro non ha scala: due bottoni lo mettono nel ghiaccio fondente e nell'acqua bollente e segnano i punti fissi, e dopo il secondo segno compaiono la divisione in cento gradi e le tre scale. Una linea orizzontale all'altezza della colonna attraversa le scale, e sotto sono scritte le tre letture
```
