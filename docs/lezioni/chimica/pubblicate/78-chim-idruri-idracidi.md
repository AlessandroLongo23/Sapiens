# Idruri e idracidi

L'idrogeno ha un solo elettrone, e nei legami può fare due cose opposte: perderlo, come un metallo del gruppo 1 (IA), oppure prenderne un secondo, come un alogeno. Per questo i suoi composti binari, quelli con un solo altro elemento, sono di tipi molto diversi: solidi bianchi che a contatto con l'acqua sviluppano gas, gas come il metano e l'ammoniaca, acidi come quello dello stomaco. Si dividono in tre famiglie: gli idruri metallici, gli idruri covalenti e gli idracidi.

## L'idrogeno tra i metalli e i non metalli

Il numero di ossidazione dell'idrogeno dipende dall'elemento a cui è legato, e lo si capisce confrontando le [elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita). Quella dell'idrogeno, $\chi = 2{,}20$, sta a metà della scala: più alta di quella di tutti i metalli comuni, più bassa di quella dei non metalli che stanno in alto a destra nella tavola.

```tikz
% nome: idruri-scala-elettronegativita-idrogeno
% alt: La scala dell'elettronegatività di Pauling, una linea da 0,5 a 4. L'idrogeno è segnato a 2,20, con una linea verticale tratteggiata. A sinistra dell'idrogeno ci sono il sodio a 0,93, il calcio a 1,00 e l'alluminio a 1,61: con loro l'idrogeno ha numero di ossidazione meno 1. A destra ci sono il carbonio a 2,55, l'azoto a 3,04, il cloro a 3,16 e il fluoro a 3,98: con loro l'idrogeno ha numero di ossidazione più 1
% svg: idruri-scala-elettronegativita-idrogeno-427231bd.svg 442x126
\begin{tikzpicture}[x=3cm]
\draw[thick, -{Stealth}] (0.5,0) -- (4.2,0) node[right] {$\chi$};
\foreach \x in {1,2,3,4} { \draw (\x,0.1) -- (\x,-0.1); \node[below] at (\x,-0.1) {\small $\x$}; }
\draw[dashed, thin] (2.2,-0.75) -- (2.2,1.75);
\foreach \x/\h/\el/\a in {0.93/0.55/Na/{above left}, 1.00/1.05/Ca/{above}, 1.61/0.55/Al/{above}, 2.55/0.55/C/{above}, 3.04/0.55/N/{above left}, 3.16/1.05/Cl/{above}, 3.98/0.55/F/{above}} {
  \draw[thin] (\x,0) -- (\x,\h);
  \fill (\x,0) circle (1.5pt);
  \node[\a, inner sep=2pt] at (\x,\h) {\small \el};
}
\fill[red] (2.2,0) circle (2.2pt);
\node[above, red] at (2.2,1.75) {H};
\node at (1.3,2.25) {\small con loro H ha $-1$};
\node at (3.2,2.25) {\small con loro H ha $+1$};
\draw[-{Stealth}, thin] (2.1,1.95) -- (0.7,1.95);
\draw[-{Stealth}, thin] (2.3,1.95) -- (4.0,1.95);
\end{tikzpicture}
```

Con un elemento meno elettronegativo, cioè con un metallo, gli elettroni di legame si contano all'idrogeno, che ha n.o. $-1$. Con un elemento più elettronegativo, come l'azoto o il cloro, si contano all'altro, e l'idrogeno ha n.o. $+1$. È quello che dicono le regole della lezione [Valenza e numero di ossidazione](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/valenza-e-numero-di-ossidazione): l'idrogeno ha $+1$, tranne che negli idruri dei metalli.

| Famiglia | Idrogeno legato a | n.o. dell'idrogeno | Dove sta H nella formula | Esempi |
|---|---|---|---|---|
| idruri metallici | un metallo | $-1$ | a destra | $\mathrm{NaH}$, $\mathrm{CaH_2}$ |
| idruri covalenti | un non metallo o un semimetallo dei gruppi 14 e 15 (IVA e VA) | $+1$ con carbonio, azoto e fosforo | a destra | $\mathrm{CH_4}$, $\mathrm{NH_3}$ |
| idracidi | un non metallo dei gruppi 16 e 17 (VIA e VIIA) | $+1$ | a sinistra | $\mathrm{H_2S}$, $\mathrm{HCl}$ |

L'acqua, $\mathrm{H_2O}$, è il composto dell'idrogeno con l'ossigeno, del gruppo 16, ma non è un idracido: ha il suo nome e la sua chimica, nelle lezioni sull'acqua del secondo anno.

Lungo un periodo le tre famiglie si incontrano una dopo l'altra. Questi sono i composti con l'idrogeno degli elementi del terzo periodo:

```tikz
% nome: idruri-terzo-periodo-famiglie
% alt: I composti con l'idrogeno degli elementi del terzo periodo, in fila: NaH, MgH2, AlH3, SiH4, PH3, H2S, HCl. Sotto i primi tre c'è scritto idruri metallici, sotto SiH4 e PH3 idruri covalenti, sotto H2S e HCl idracidi. Sopra ogni formula c'è il numero di atomi di idrogeno: 1, 2, 3, 4, 3, 2, 1
% svg: idruri-terzo-periodo-famiglie-fcdebb19.svg 469x80
\begin{tikzpicture}[x=1.5cm]
\foreach \x/\f/\n/\col in {0/{NaH}/1/blue!12, 1/{MgH_2}/2/blue!12, 2/{AlH_3}/3/blue!12, 3/{SiH_4}/4/gray!20, 4/{PH_3}/3/gray!20, 5/{H_2S}/2/orange!18, 6/{HCl}/1/orange!18} {
  \draw[thick, fill=\col] (\x,0) rectangle ++(1,0.9);
  \node at (\x+0.5,0.45) {\small $\mathrm{\f}$};
  \node at (\x+0.5,1.2) {\small $\n$};
}
\node[left] at (0,1.2) {\small atomi di H};
\draw[thin] (0.05,-0.15) -- (2.95,-0.15);
\node[below] at (1.5,-0.15) {\small idruri metallici};
\draw[thin] (3.05,-0.15) -- (4.95,-0.15);
\node[below] at (4,-0.15) {\small idruri covalenti};
\draw[thin] (5.05,-0.15) -- (6.95,-0.15);
\node[below] at (6,-0.15) {\small idracidi};
\end{tikzpicture}
```

Il numero di atomi di idrogeno sale da $1$ a $4$ e poi scende di nuovo a $1$. A sinistra è il numero di elettroni che il metallo cede; a destra è il numero di elettroni che mancano al non metallo per completare l'ottetto, cioè $18$ meno il numero del gruppo.

## Gli idruri metallici

Un **idruro metallico** è un composto binario dell'idrogeno con un metallo, in cui l'idrogeno ha n.o. $-1$. Gli idruri dei metalli del gruppo 1 e del calcio, dello stronzio e del bario sono solidi ionici bianchi, fatti di cationi del metallo e di ioni idruro, $\mathrm{H^-}$: un atomo di idrogeno con due elettroni, come l'elio.

La formula ha il metallo a sinistra e tanti atomi di idrogeno quanto vale il n.o. del metallo: $\mathrm{MH}$ per un metallo a $+1$, $\mathrm{MH_2}$ per uno a $+2$, $\mathrm{MH_3}$ per uno a $+3$. I nomi seguono le regole generali, con la parola "idruro".

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{LiH}$ | idruro di litio | idruro di litio | idruro di litio |
| $\mathrm{NaH}$ | idruro di sodio | idruro di sodio | idruro di sodio |
| $\mathrm{KH}$ | idruro di potassio | idruro di potassio | idruro di potassio |
| $\mathrm{MgH_2}$ | idruro di magnesio | idruro di magnesio | diidruro di magnesio |
| $\mathrm{CaH_2}$ | idruro di calcio | idruro di calcio | diidruro di calcio |
| $\mathrm{BaH_2}$ | idruro di bario | idruro di bario | diidruro di bario |
| $\mathrm{AlH_3}$ | idruro di alluminio | idruro di alluminio | triidruro di alluminio |

Questi metalli hanno un solo n.o., quindi il nome tradizionale e quello di Stock coincidono; solo il nome IUPAC cambia, perché conta gli atomi di idrogeno. Con un metallo che ha due n.o. tornano i suffissi e i numeri romani: $\mathrm{CuH}$ è l'idruro rameoso, o idruro di rame(I).

Gli idruri ionici reagiscono con l'acqua e liberano idrogeno gassoso: idruro più acqua dà idrossido più idrogeno. L'idruro di calcio si usa proprio per questo, come riserva di idrogeno e per togliere le ultime tracce d'acqua dai solventi.

```ad-example
Esempio 1: l'idruro di un metallo, nei due sensi
Scrivi la formula e il nome IUPAC dell'idruro di bario. Poi di' che composto è $\mathrm{KH}$ e che n.o. hanno i suoi atomi.

Il bario è del gruppo 2 e ha n.o. $+2$; l'idrogeno negli idruri dei metalli ha $-1$. Servono due atomi di idrogeno: $\mathrm{BaH_2}$, e infatti $+2 + 2 \cdot (-1) = 0$. Il nome IUPAC è diidruro di bario.

$\mathrm{KH}$ è l'idruro di potassio. Il potassio, del gruppo 1, ha $+1$; dalla somma, $+1 + x = 0$, l'idrogeno ha $-1$.
```

```ad-warning
Negli idruri dei metalli l'idrogeno ha −1
Chi applica "l'idrogeno ha sempre $+1$" trova per il calcio di $\mathrm{CaH_2}$ un n.o. $-2$, che un metallo non può avere. La regola sui metalli dei gruppi 1 e 2 viene prima di quella sull'idrogeno: si fissa il metallo, e l'idrogeno si ricava dalla somma.
```

## Gli idruri covalenti

Un **idruro covalente** è un composto binario dell'idrogeno con un non metallo o un semimetallo dei gruppi 14 e 15. È fatto di molecole, tenute insieme da [legami covalenti](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo), e i più comuni a temperatura ambiente sono gas.

Nella formula l'idrogeno si scrive a destra, come negli idruri metallici, e gli atomi di idrogeno sono $4$ per gli elementi del gruppo 14 e $3$ per quelli del gruppo 15. Questi composti hanno un nome proprio, più vecchio di ogni regola: fa da nome tradizionale, ed è quello che si usa sempre. Il nome IUPAC conta gli atomi di idrogeno.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{CH_4}$ | metano | idruro di carbonio | tetraidruro di carbonio |
| $\mathrm{SiH_4}$ | silano | idruro di silicio | tetraidruro di silicio |
| $\mathrm{NH_3}$ | ammoniaca | idruro di azoto | triidruro di azoto |
| $\mathrm{PH_3}$ | fosfina | idruro di fosforo | triidruro di fosforo |
| $\mathrm{AsH_3}$ | arsina | idruro di arsenico | triidruro di arsenico |

Il metano è il gas delle cucine, l'ammoniaca quello dall'odore pungente dei detersivi. La forma delle loro molecole, un tetraedro e una piramide, è spiegata nella lezione [La geometria delle molecole (teoria VSEPR)](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole).

Nel metano e nell'ammoniaca il carbonio e l'azoto sono più elettronegativi dell'idrogeno: l'idrogeno ha n.o. $+1$, il carbonio $-4$ e l'azoto $-3$, i valori più bassi dei loro gruppi.

```ad-note
Dove l'elettronegatività non decide
Il fosforo ($\chi = 2{,}19$) e l'idrogeno ($\chi = 2{,}20$) hanno in pratica la stessa elettronegatività: nella fosfina il legame è quasi apolare, e per convenzione si contano i n.o. come nell'ammoniaca, fosforo $-3$ e idrogeno $+1$. Il silicio ($\chi = 1{,}90$) è meno elettronegativo dell'idrogeno, e nel silano l'idrogeno ha $-1$ anche se il composto è fatto di molecole. Covalente e metallico dicono com'è fatto il composto; il segno del n.o. lo decide sempre l'elettronegatività.
```

```ad-warning
L'ammoniaca non è un acido
$\mathrm{NH_3}$ contiene idrogeno, ma in acqua non libera ioni $\mathrm{H^+}$: è una base, come dice la lezione [Soluzioni acide e basiche: una prima idea del pH](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/soluzioni-acide-e-basiche-una-prima-idea-del-ph). Nella formula l'idrogeno sta a destra proprio per distinguerla dagli acidi, che lo hanno a sinistra.
```

## Gli idracidi

Un **idracido** è un composto binario dell'idrogeno con un non metallo del gruppo 16 o del gruppo 17, che sciolto in acqua si comporta da acido. Gli idracidi che si studiano sono cinque: quelli dei quattro alogeni e quello dello zolfo.

Nella formula l'idrogeno sta a sinistra, come in tutti gli acidi, e ha n.o. $+1$. Il non metallo ha il suo n.o. più basso, $-1$ per gli alogeni e $-2$ per lo zolfo, e gli atomi di idrogeno sono tanti quanti ne servono per pareggiarlo: uno con gli alogeni, due con lo zolfo.

Gli idracidi hanno due nomi, che non sono sinonimi.

- Il composto puro, che a temperatura ambiente è un gas fatto di molecole, prende il nome IUPAC: la radice del non metallo con il suffisso -uro, seguita da "di idrogeno". $\mathrm{HCl}$ è il cloruro di idrogeno.
- La sua soluzione in acqua, che è quella che si usa in laboratorio, prende il nome tradizionale: "acido" e la radice del non metallo con il suffisso -idrico. $\mathrm{HCl}$ in acqua è l'acido cloridrico.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{HF}$ | acido fluoridrico | fluoruro di idrogeno | fluoruro di idrogeno |
| $\mathrm{HCl}$ | acido cloridrico | cloruro di idrogeno | cloruro di idrogeno |
| $\mathrm{HBr}$ | acido bromidrico | bromuro di idrogeno | bromuro di idrogeno |
| $\mathrm{HI}$ | acido iodidrico | ioduro di idrogeno | ioduro di idrogeno |
| $\mathrm{H_2S}$ | acido solfidrico | solfuro di idrogeno | solfuro di diidrogeno |

L'idrogeno ha un solo n.o. positivo, e la notazione di Stock non ha numeri romani da aggiungere: coincide con il nome IUPAC senza i prefissi. La radice dello zolfo qui è solf-, e non solfor- come nelle anidridi.

In acqua le molecole di un idracido si separano in ioni, e liberano gli ioni $\mathrm{H^+}$ che fanno di una soluzione un acido:

$$\mathrm{HCl}(g) \longrightarrow \mathrm{H^+}(aq) + \mathrm{Cl^-}(aq)$$

L'acido cloridrico è l'acido del succo gastrico e, diluito, l'acido muriatico del supermercato. L'acido solfidrico è il gas con l'odore di uova marce delle sorgenti sulfuree. L'acido fluoridrico corrode il vetro e si conserva in bottiglie di plastica.

```ad-example
Esempio 2: i nomi di un idracido
Che nomi ha $\mathrm{H_2S}$? Che n.o. ha lo zolfo?

L'idrogeno ha $+1$: $2 \cdot (+1) + x = 0$, quindi lo zolfo ha $-2$, il n.o. più basso del gruppo 16.

L'idrogeno è a sinistra e lo zolfo è un non metallo del gruppo 16: è un idracido. Nome tradizionale: acido solfidrico. Nome IUPAC: solfuro di diidrogeno, con il prefisso che conta i due atomi di idrogeno. Nella notazione di Stock: solfuro di idrogeno.
```

```ad-example
Esempio 3: dal nome alla formula
Scrivi la formula dell'acido bromidrico e dello ioduro di idrogeno.

Acido bromidrico: il suffisso -idrico indica un idracido, e la radice brom- il bromo. Il bromo è un alogeno, con n.o. $-1$: serve un solo atomo di idrogeno, scritto a sinistra. La formula è $\mathrm{HBr}$.

Ioduro di idrogeno: il suffisso -uro è quello del nome IUPAC degli idracidi. Lo iodio ha $-1$: $\mathrm{HI}$.
```

```ad-warning
-idrico non è -ico
L'acido cloridrico è $\mathrm{HCl}$; l'acido clorico è $\mathrm{HClO_3}$, un acido con l'ossigeno della lezione [Gli ossiacidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/gli-ossiacidi). Sono le tre lettere "idr" a dire che l'acido non contiene ossigeno. Lo stesso vale per solfidrico ($\mathrm{H_2S}$) e solforico ($\mathrm{H_2SO_4}$).
```

```ad-note
Un idracido con tre elementi
L'acido cianidrico, $\mathrm{HCN}$, è fatto di tre elementi, ma si mette tra gli idracidi: non contiene ossigeno, e il gruppo $\mathrm{CN}$ si comporta come un alogeno. Il suo nome IUPAC è cianuro di idrogeno.
```

## Riconoscere la famiglia dalla formula

Davanti a un composto binario dell'idrogeno, la famiglia si decide guardando l'altro elemento.

1. È un metallo: idruro metallico. L'idrogeno ha $-1$ e sta a destra.
2. È un non metallo dei gruppi 16 e 17, ossigeno escluso: idracido. L'idrogeno ha $+1$ e sta a sinistra.
3. È un non metallo o un semimetallo dei gruppi 14 e 15: idruro covalente. L'idrogeno sta a destra.

```ad-example
Esempio 4: tre formule, tre famiglie
Classifica $\mathrm{LiH}$, $\mathrm{HI}$ e $\mathrm{NH_3}$, e trova il n.o. dell'elemento legato all'idrogeno.

$\mathrm{LiH}$: il litio è un metallo del gruppo 1. È un idruro metallico, l'idruro di litio; il litio ha $+1$ e l'idrogeno $-1$.

$\mathrm{HI}$: lo iodio è un alogeno, e l'idrogeno è a sinistra. È un idracido, l'acido iodidrico; l'idrogeno ha $+1$ e lo iodio $-1$.

$\mathrm{NH_3}$: l'azoto è un non metallo del gruppo 15, e l'idrogeno è a destra. È un idruro covalente, l'ammoniaca; con l'idrogeno a $+1$, $x + 3 \cdot (+1) = 0$ dà $-3$ per l'azoto.
```

Nella figura scegli l'elemento da legare all'idrogeno: la scala mostra chi dei due è più elettronegativo, e sotto compaiono la formula con i numeri di ossidazione, la famiglia e i nomi.

```interattivo
% nome: idruri-idracidi-scegli-elemento
% alt: Si sceglie l'elemento da legare all'idrogeno tra quindici: litio, sodio, potassio, magnesio, calcio, alluminio, carbonio, silicio, azoto, fosforo, zolfo, fluoro, cloro, bromo, iodio. Sulla scala dell'elettronegatività sono segnati l'idrogeno, a 2,20, e l'elemento scelto, con una freccia che va verso il più elettronegativo dei due. Sotto la scala c'è la formula del composto, con il numero di ossidazione scritto sopra ogni simbolo. Sotto la figura si leggono la famiglia (idruro metallico, idruro covalente o idracido) e i tre nomi
```

Passando dal sodio al cloro la freccia cambia verso: con il sodio gli elettroni vanno all'idrogeno, che ha $-1$ e sta a destra nella formula; con il cloro vanno al cloro, e l'idrogeno ha $+1$ e sta a sinistra. Con il fosforo i due segni sulla scala quasi coincidono, e con il silicio la freccia va verso l'idrogeno anche se il silano è un idruro covalente: sono i due casi della nota sull'elettronegatività.
