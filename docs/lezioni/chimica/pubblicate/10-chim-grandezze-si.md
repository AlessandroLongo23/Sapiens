# Grandezze e unità del Sistema Internazionale

In laboratorio si pesano $2{,}50\,\text{g}$ di cloruro di sodio, si versano $25{,}0\,\text{mL}$ d'acqua, si scalda la soluzione a $60\,^\circ\text{C}$: ogni dato di un esperimento di chimica è una misura, cioè un numero seguito da un'unità. La chimica è diventata una scienza quando ha cominciato a misurare, con le bilance di Lavoisier alla fine del Settecento, e le unità che usa sono quelle fissate da un accordo internazionale, il Sistema Internazionale, che dice anche come si scrivono, come si formano i multipli e come si passa da un'unità all'altra.

## Grandezze e misura

Una **grandezza** è una proprietà di un corpo o di una sostanza che si può misurare. Per definirla si dice come si misura, con quale strumento e con quale procedura: la massa di un campione si misura con una bilancia, il volume di un liquido con un cilindro graduato, la temperatura con un termometro. Una definizione così si chiama **definizione operativa**. Il colore, l'odore o il sapore di una sostanza sono proprietà, ma non grandezze: si descrivono a parole, e non si misurano confrontandole con un'unità.

**Misurare** una grandezza vuol dire confrontarla con una grandezza dello stesso tipo scelta come **unità di misura**, e contare quante volte la contiene. Il risultato, la **misura**, è un numero seguito dall'unità:

$$m = 2{,}50\,\text{g}$$

Qui $2{,}50$ è il valore numerico e $\text{g}$ (grammo) è l'unità. La stessa massa si scrive $2500\,\text{mg}$: cambiando l'unità cambia il numero, ma la massa è la stessa.

```ad-warning
Un numero senza unità non è una misura
"Ho aggiunto $5$ di acido" non dice niente: potrebbero essere grammi, millilitri o gocce. Nel quaderno di laboratorio, nei conti e nei risultati l'unità si scrive sempre.
```

Grandezze dello stesso tipo, come due masse, si dicono **omogenee**: si possono confrontare, sommare e sottrarre, dopo averle scritte nella stessa unità. Grandezze di tipo diverso no: $3\,\text{g} + 2\,\text{mL}$ non ha senso, anche se si tratta d'acqua.

### Grandezze estensive e intensive

Il chimico divide le grandezze in due famiglie. Le **grandezze estensive** dipendono dalla quantità di materia del campione: la massa, il volume, il numero di particelle, il calore che serve per scaldarlo. Se si raddoppia il campione, raddoppiano anche loro. Le **grandezze intensive** non dipendono dalla quantità: la temperatura, la densità, la temperatura di ebollizione. Una goccia d'acqua e un litro d'acqua alla stessa temperatura hanno la stessa densità e bollono alla stessa temperatura.

```tikz
% nome: estensive-intensive-becher
% alt: Due becher d'acqua alla stessa temperatura: il primo contiene 100 millilitri, il secondo 250. Sotto il primo è scritto massa 100 grammi, sotto il secondo 250 grammi; per tutti e due temperatura 25 gradi Celsius e densità 1,00 grammi al millilitro. La massa cambia con la quantità, la temperatura e la densità no
% svg: estensive-intensive-becher-25c7af1b.svg 215x146
\begin{tikzpicture}
\fill[cyan!20] (0,0) rectangle (1.4,0.8);
\draw[thin] (0,0.8) -- (1.4,0.8);
\draw[thick] (-0.1,2.1) -- (0,2) -- (0,0) -- (1.4,0) -- (1.4,2);
\fill[cyan!20] (3,0) rectangle (4.8,1.6);
\draw[thin] (3,1.6) -- (4.8,1.6);
\draw[thick] (2.9,2.1) -- (3,2) -- (3,0) -- (4.8,0) -- (4.8,2);
\node at (0.7,-0.35) {\small $V = 100$ mL};
\node at (0.7,-0.8) {\small $m = 100$ g};
\node at (3.9,-0.35) {\small $V = 250$ mL};
\node at (3.9,-0.8) {\small $m = 250$ g};
\node at (2.4,-1.4) {\small tutti e due: $t = 25\,^\circ$C, $d = 1{,}00$ g/mL};
\end{tikzpicture}
```

Per riconoscere una sostanza servono le grandezze intensive: la massa di un campione non dice di che cosa è fatto, la sua densità o la sua temperatura di fusione sì.

## Il Sistema Internazionale

Il **Sistema Internazionale di unità di misura** (SI), adottato nel 1960 dalla Conferenza generale dei pesi e delle misure, sceglie sette grandezze **fondamentali**, ognuna con la sua unità:

| Grandezza | Unità | Simbolo | In laboratorio |
|---|---|---|---|
| lunghezza | metro | $\text{m}$ | le dimensioni di un cristallo, le distanze tra gli atomi |
| massa | chilogrammo | $\text{kg}$ | la pesata di un reagente |
| intervallo di tempo | secondo | $\text{s}$ | la durata di una reazione |
| temperatura | kelvin | $\text{K}$ | la temperatura di un gas |
| quantità di sostanza | mole | $\text{mol}$ | il numero di particelle di un campione |
| intensità di corrente elettrica | ampere | $\text{A}$ | l'elettrolisi e le pile |
| intensità luminosa | candela | $\text{cd}$ | quasi mai |

La settima grandezza è quella del chimico. La **quantità di sostanza** dice quante particelle (atomi, molecole, ioni) contiene un campione, e la sua unità è la **mole**: una mole contiene $6{,}02 \cdot 10^{23}$ particelle, il numero di Avogadro. Contare le particelle una per una è impossibile, perché sono troppe; la mole permette di contarle pesando, come spiega la lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare).

Dal 20 maggio 2019 tutte le unità del SI sono definite a partire da costanti della natura, con un valore fissato una volta per tutte (BIPM, "Le Système international d'unités", nona edizione, 2019):

- la mole contiene esattamente $6{,}022\,140\,76 \cdot 10^{23}$ particelle: il numero di Avogadro non si misura più, è la definizione della mole;
- il chilogrammo è definito a partire dalla costante di Planck. Fino al 2019 era la massa di un cilindro di platino e iridio conservato dal 1889 a Sèvres, vicino a Parigi;
- il kelvin è definito a partire dalla costante di Boltzmann, e il secondo dalle oscillazioni della radiazione dell'atomo di cesio-133.

La massa si misura con la bilancia e si esprime in chilogrammi o in grammi. Non va confusa con il peso, che è una forza e si misura in newton: la differenza è nella lezione di fisica [La forza-peso e la massa](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-peso-e-la-massa).

### Le grandezze derivate

Tutte le altre grandezze si ottengono da quelle fondamentali con una formula e si chiamano **derivate**. La loro unità viene dalla stessa formula: il volume di un cubo è una lunghezza alla terza, quindi si misura in metri cubi, $\text{m}^3$; la densità è una massa divisa per un volume, quindi si misura in $\text{kg/m}^3$. Alcune unità derivate hanno un nome proprio, come il joule dell'energia e il pascal della pressione. Quelle che servono di più nel biennio:

| Grandezza | Unità del SI | Unità usate in laboratorio |
|---|---|---|
| volume | $\text{m}^3$ | $\text{L}$, $\text{mL}$, $\text{cm}^3$ |
| densità | $\text{kg/m}^3$ | $\text{g/mL}$, $\text{g/cm}^3$, $\text{g/L}$ per i gas |
| temperatura | $\text{K}$ | $^\circ\text{C}$ |
| energia, calore | $\text{J}$ | $\text{kJ}$, $\text{cal}$ |
| pressione | $\text{Pa}$ | $\text{atm}$, $\text{mmHg}$ |

Il litro, $1\,\text{L} = 1\,\text{dm}^3$, non è un'unità del SI, ma il SI lo accetta, come il minuto e l'ora. Il grado Celsius è un'unità del SI con un nome speciale: un grado Celsius è ampio quanto un kelvin. L'atmosfera, il millimetro di mercurio e la caloria invece sono fuori dal SI, ma in chimica si usano ancora. Volume e densità hanno la loro lezione, [Massa, volume e densità](/materiale/scuola-superiore/chimica/misure-e-grandezze/massa-volume-e-densita); temperatura e calore la lezione [Temperatura e calore](/materiale/scuola-superiore/chimica/misure-e-grandezze/temperatura-e-calore).

## Come si scrivono le unità

I simboli delle unità hanno regole precise, le stesse in tutto il mondo:

- si scrivono dopo il numero, separati da uno spazio: $5\,\text{g}$, $25\,^\circ\text{C}$;
- sono minuscoli, tranne quelli delle unità che vengono dal nome di una persona, come $\text{K}$ (kelvin), $\text{Pa}$ (pascal) e $\text{J}$ (joule). Il litro ha due simboli ammessi, $\text{l}$ e $\text{L}$: si usa $\text{L}$, che non si confonde con la cifra $1$;
- non sono abbreviazioni: niente punto e niente plurale, $3\,\text{mol}$ e non "3 moli." né "3 mols";
- i nomi delle unità nel testo sono minuscoli: il grammo, la mole, il kelvin.

| Sbagliato | Giusto | Perché |
|---|---|---|
| 150 gr | $150\,\text{g}$ | il simbolo del grammo è $\text{g}$ |
| 3 Kg | $3\,\text{kg}$ | $\text{K}$ è il kelvin |
| 25 ml. | $25\,\text{mL}$ | niente punto |
| 0,5 moli | $0{,}5\,\text{mol}$ | il simbolo non ha plurale |
| 298 °K | $298\,\text{K}$ | il kelvin non vuole il simbolo di grado |
| 2 hr | $2\,\text{h}$ | il simbolo dell'ora è $\text{h}$ |

```ad-warning
Maiuscole e minuscole cambiano il significato
$\text{m}$ è il metro, ma davanti a un'altra unità è il prefisso milli; $\text{M}$ è il prefisso mega. Così $1\,\text{mg}$ è un milligrammo e $1\,\text{Mg}$ un milione di grammi, una tonnellata. Nei libri di chimica compare anche $\text{M}$ da sola, per la molarità di una soluzione, che si studia più avanti: è un'altra cosa ancora.
```

## Multipli e sottomultipli

Per le grandezze molto grandi o molto piccole si usano i **multipli** e i **sottomultipli** dell'unità, formati con un **prefisso** che moltiplica l'unità per una potenza di $10$:

| Prefisso | Simbolo | Fattore | Esempio in chimica |
|---|---|---|---|
| giga | $\text{G}$ | $10^{9}$ | |
| mega | $\text{M}$ | $10^{6}$ | $\text{MJ}$, l'energia di una combustione |
| kilo | $\text{k}$ | $10^{3}$ | $\text{kg}$, $\text{kJ}$ |
| etto | $\text{h}$ | $10^{2}$ | $\text{hPa}$, la pressione atmosferica |
| deci | $\text{d}$ | $10^{-1}$ | $\text{dm}^3$ |
| centi | $\text{c}$ | $10^{-2}$ | $\text{cm}^3$ |
| milli | $\text{m}$ | $10^{-3}$ | $\text{mg}$, $\text{mL}$, $\text{mmol}$ |
| micro | $\mu$ | $10^{-6}$ | $\mu\text{g}$, $\mu\text{L}$ |
| nano | $\text{n}$ | $10^{-9}$ | $\text{nm}$, la dimensione delle molecole |
| pico | $\text{p}$ | $10^{-12}$ | $\text{pm}$, il raggio degli atomi |

Il prefisso si scrive attaccato all'unità: $1\,\text{mL} = 10^{-3}\,\text{L}$, $1\,\text{mmol} = 10^{-3}\,\text{mol}$, $1\,\mu\text{g} = 10^{-6}\,\text{g}$. Le potenze con esponente negativo sono spiegate nella lezione di matematica [Potenze in $\mathbb{Q}$](/materiale/scuola-superiore/matematica/numeri-razionali/potenze-in-q): $10^{-3} = 0{,}001$.

Il chilogrammo è l'unica delle sette unità che ha già un prefisso: i prefissi della massa si attaccano al grammo. Dal chilogrammo al microgrammo, con i prefissi che si usano davvero, ogni passo vale mille:

```tikz
% nome: scala-prefissi-massa
% alt: Le unità di massa in fila, kg, g, mg, microgrammi: verso destra ogni passo moltiplica il numero per 1000, verso sinistra lo divide per 1000
% svg: scala-prefissi-massa-5d561a0e.svg 209x106
\begin{tikzpicture}
\foreach \u [count=\i from 0] in {kg,g,mg,$\mu$g} {
  \draw[thick, fill=blue!10] (\i*1.5,0) rectangle ++(0.9,0.6);
  \node at (\i*1.5+0.45,0.3) {\small \u};
}
\fill[orange!25] (1.5,0) rectangle ++(0.9,0.6);
\draw[thick] (1.5,0) rectangle ++(0.9,0.6);
\node at (1.95,0.3) {\small g};
\foreach \i in {0,1,2} {
  \draw[-{Stealth}, thin] (\i*1.5+0.65,0.72) to[bend left=45] (\i*1.5+1.75,0.72);
  \draw[-{Stealth}, thin] (\i*1.5+1.75,-0.12) to[bend left=45] (\i*1.5+0.65,-0.12);
}
\node[above] at (2.7,1.15) {\small $\cdot 1000$ a ogni passo};
\node[below] at (2.7,-0.55) {\small $:1000$ a ogni passo};
\end{tikzpicture}
```

## La notazione scientifica

La chimica passa di continuo da numeri enormi a numeri minuscoli: in $18\,\text{g}$ d'acqua ci sono circa $602\,000\,000\,000\,000\,000\,000\,000$ molecole, e la distanza tra i due atomi della molecola di idrogeno è $0{,}000\,000\,000\,074\,\text{m}$. Per scriverli senza file di zeri si usa la **notazione scientifica**: il numero si scrive come

$$a \cdot 10^{n}$$

con $1 \le a < 10$ e $n$ intero. Per scrivere un numero in notazione scientifica:

1. sposta la virgola fino ad avere una sola cifra diversa da zero prima della virgola: questo è $a$;
2. conta di quanti posti l'hai spostata: questo è il valore di $n$;
3. se l'hai spostata verso sinistra (il numero era grande) $n$ è positivo, se l'hai spostata verso destra (il numero era minore di $1$) $n$ è negativo.

```ad-example
Esempio 1: numeri della chimica in notazione scientifica
Scrivi in notazione scientifica il numero di molecole in $18\,\text{g}$ d'acqua, $602\,000\,000\,000\,000\,000\,000\,000$, e la distanza tra gli atomi della molecola di idrogeno, $0{,}000\,000\,000\,074\,\text{m}$.

Nel primo numero la virgola va spostata di $23$ posti verso sinistra per avere $6{,}02$: le molecole sono $6{,}02 \cdot 10^{23}$.

Nel secondo la virgola va spostata di $11$ posti verso destra per avere $7{,}4$: la distanza è $7{,}4 \cdot 10^{-11}\,\text{m}$, cioè $74\,\text{pm}$.
```

```ad-warning
Il primo fattore sta tra 1 e 10
$60{,}2 \cdot 10^{22}$ e $0{,}602 \cdot 10^{24}$ valgono quanto $6{,}02 \cdot 10^{23}$, ma non sono in notazione scientifica: il primo fattore deve essere almeno $1$ e minore di $10$. E contare gli zeri non basta: in $0{,}000\,000\,000\,074$ gli zeri dopo la virgola sono $10$, ma la virgola si sposta di $11$ posti.
```

Nei prodotti e nei quozienti si moltiplicano o si dividono i primi fattori e si applicano le proprietà delle potenze agli esponenti; se il primo fattore esce da $1 \le a < 10$, si riporta dentro spostando la virgola.

```ad-example
Esempio 2: la massa di tante molecole
Una molecola d'acqua ha la massa di $3{,}0 \cdot 10^{-23}\,\text{g}$. Quanto pesano $5{,}0 \cdot 10^{24}$ molecole?

$$3{,}0 \cdot 10^{-23}\,\text{g} \cdot 5{,}0 \cdot 10^{24} = 15 \cdot 10^{1}\,\text{g}$$

Il primo fattore, $15$, è più grande di $10$: $15 = 1{,}5 \cdot 10$, quindi la massa è $1{,}5 \cdot 10^{2}\,\text{g}$, cioè $150\,\text{g}$.
```

Quando interessa solo quanto è grande una misura, si usa il suo **ordine di grandezza**, la potenza di $10$ più vicina: gli atomi hanno raggi dell'ordine di $10^{-10}\,\text{m}$, cioè $100\,\text{pm}$. La notazione scientifica e l'ordine di grandezza sono spiegati più a lungo nella lezione di fisica [Grandezze fisiche e unità del Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale).

## Cambiare unità di misura

Per passare da un'unità a un'altra si sostituisce all'unità il suo valore nella nuova unità, cioè si moltiplica per il **fattore di conversione**. Per esempio $1\,\text{mg} = 10^{-3}\,\text{g}$, quindi

$$125\,\text{mg} = 125 \cdot 10^{-3}\,\text{g} = 0{,}125\,\text{g}$$

Tra due multipli o sottomultipli si passa dall'unità: si scrivono tutti e due come potenze di $10$ dell'unità e si divide.

```ad-example
Esempio 3: conversioni con i prefissi
Esprimi $0{,}0250\,\text{mol}$ in millimoli, $35\,\mu\text{L}$ in millilitri e $2{,}4\,\text{mg}$ in microgrammi.

$1\,\text{mmol} = 10^{-3}\,\text{mol}$, quindi $1\,\text{mol} = 10^3\,\text{mmol}$ e $0{,}0250\,\text{mol} = 0{,}0250 \cdot 10^3\,\text{mmol} = 25{,}0\,\text{mmol}$.

$1\,\mu\text{L} = 10^{-6}\,\text{L}$ e $1\,\text{mL} = 10^{-3}\,\text{L}$, quindi $1\,\mu\text{L} = \dfrac{10^{-6}}{10^{-3}}\,\text{mL} = 10^{-3}\,\text{mL}$ e $35\,\mu\text{L} = 35 \cdot 10^{-3}\,\text{mL} = 0{,}035\,\text{mL}$.

$1\,\text{mg} = 10^{-3}\,\text{g}$ e $1\,\mu\text{g} = 10^{-6}\,\text{g}$, quindi $1\,\text{mg} = 10^{3}\,\mu\text{g}$ e $2{,}4\,\text{mg} = 2{,}4 \cdot 10^{3}\,\mu\text{g} = 2400\,\mu\text{g}$.
```

```ad-tip
Un controllo sul verso
Passando a un'unità più piccola il numero diventa più grande, e viceversa: $0{,}0250\,\text{mol}$ sono tante millimoli, $25{,}0$; $35\,\mu\text{L}$ sono pochi millilitri, $0{,}035$.
```

### I volumi

Il volume è una lunghezza alla terza, e anche il fattore di conversione va alla terza: $1\,\text{dm} = 10\,\text{cm}$, ma $1\,\text{dm}^3 = 10^3\,\text{cm}^3 = 1000\,\text{cm}^3$. Il litro è un decimetro cubo, e il millilitro è un centimetro cubo:

$$1\,\text{L} = 1\,\text{dm}^3 = 1000\,\text{mL} \qquad 1\,\text{mL} = 1\,\text{cm}^3 \qquad 1\,\text{m}^3 = 1000\,\text{L}$$

```ad-example
Esempio 4: il volume di un matraccio
Un matraccio contiene $250\,\text{mL}$. Quanto vale il suo volume in litri, in centimetri cubi e in metri cubi?

$250\,\text{mL} = 250 \cdot 10^{-3}\,\text{L} = 0{,}250\,\text{L}$, e poiché $1\,\text{mL} = 1\,\text{cm}^3$ il volume è anche $250\,\text{cm}^3$.

Un metro cubo è mille litri, quindi $1\,\text{L} = 10^{-3}\,\text{m}^3$ e $0{,}250\,\text{L} = 0{,}250 \cdot 10^{-3}\,\text{m}^3 = 2{,}50 \cdot 10^{-4}\,\text{m}^3$.
```

```ad-warning
Un decimetro cubo non è dieci centimetri cubi
$1\,\text{dm} = 10\,\text{cm}$, ma $1\,\text{dm}^3 = 10^3\,\text{cm}^3$: tra due unità di volume vicine il fattore è $1000$, non $10$. Allo stesso modo $1\,\text{m}^3 = 10^6\,\text{cm}^3$, non $100\,\text{cm}^3$.
```

### Le unità composte

Una densità o una concentrazione hanno due unità, una sopra e una sotto la frazione, e si convertono tutte e due. Si sostituisce ogni unità con il suo valore nella nuova unità, poi si fa il conto.

```ad-example
Esempio 5: la densità dell'aria
L'aria ha la densità di $1{,}2\,\text{g/L}$. Quanto vale in $\text{kg/m}^3$ e in $\text{g/mL}$?

$1\,\text{g} = 10^{-3}\,\text{kg}$ e $1\,\text{L} = 10^{-3}\,\text{m}^3$, quindi

$$1{,}2\,\frac{\text{g}}{\text{L}} = 1{,}2 \cdot \frac{10^{-3}\,\text{kg}}{10^{-3}\,\text{m}^3} = 1{,}2\,\text{kg/m}^3$$

$1\,\text{L} = 10^{3}\,\text{mL}$, quindi

$$1{,}2\,\frac{\text{g}}{\text{L}} = \frac{1{,}2\,\text{g}}{10^{3}\,\text{mL}} = 1{,}2 \cdot 10^{-3}\,\text{g/mL} = 0{,}0012\,\text{g/mL}$$

Il grammo al litro e il chilogrammo al metro cubo sono la stessa unità: $\text{g/L} = \text{kg/m}^3$.
```

```ad-warning
Il fattore va dove sta l'unità
Nella conversione da $\text{g/L}$ a $\text{g/mL}$ i millilitri sono al denominatore: $1{,}2\,\text{g}$ in un litro sono $1{,}2\,\text{g}$ in mille millilitri, quindi il numero diventa mille volte più piccolo, non più grande. Scrivere $1{,}2\,\text{g/L} = 1200\,\text{g/mL}$ vorrebbe dire che un millilitro d'aria pesa più di un chilo.
```
