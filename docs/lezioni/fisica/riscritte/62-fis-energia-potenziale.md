# Energia potenziale gravitazionale ed elastica

Il maglio di un battipalo, sollevato in alto e poi lasciato cadere, pianta nel terreno un palo che nessuno riuscirebbe a spingere a mano. Un arco teso lancia una freccia a decine di metri. In tutti e due i casi un corpo, per il solo fatto di trovarsi in una certa posizione (il maglio in alto, l'arco piegato), è in grado di compiere un lavoro: ha un'**energia potenziale**. Questa lezione ne studia due tipi, quella legata alla forza-peso e quella legata alla forza elastica di una molla.

## Il lavoro del peso in una caduta

Un corpo di massa $m$ che scende in verticale da un'altezza $h$ fino al suolo riceve dal peso il lavoro $W_P = m g h$, come si è visto nella lezione sul [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza): peso e spostamento sono verticali, verso il basso. Questo lavoro il corpo lo può compiere solo perché si trovava in alto: più è pesante e più è alto, più lavoro può compiere cadendo.

## L'energia potenziale gravitazionale

L'**energia potenziale gravitazionale** di un corpo di massa $m$ che si trova all'altezza $h$ è

$$U = m g h$$

dove $h$ è l'altezza misurata da un **livello di riferimento** scelto (il pavimento, il suolo, il piano di un tavolo), a cui l'energia potenziale vale zero. Come ogni energia si misura in joule: $\text{kg} \cdot \text{m/s}^2 \cdot \text{m} = \text{N} \cdot \text{m} = \text{J}$.

```ad-example
Esempio 1: un vaso sulla mensola
Un vaso di $2{,}0\,\text{kg}$ sta su una mensola a $1{,}5\,\text{m}$ dal pavimento. Quanto vale la sua energia potenziale, con il livello di riferimento sul pavimento?

$$U = m g h = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}5\,\text{m} = 29{,}4\,\text{J} \approx 29\,\text{J}$$

Il risultato ha due cifre significative, come la massa e l'altezza.
```

### Il livello di riferimento si sceglie

Il livello a cui $U = 0$ non è fissato dalla natura: si sceglie quello più comodo per il problema. Cambiando livello cambia il valore di $U$, ma non cambia la **differenza** di energia potenziale tra due posizioni, che è l'unica cosa che conta nei conti.

```tikz
% nome: livello-riferimento-vaso
% alt: Un vaso su una mensola attaccata a una parete, a 1,5 metri dal pavimento; accanto c'è un tavolo alto 0,80 metri, e dal piano del tavolo alla mensola ci sono 0,70 metri, segnati con una seconda quota e una linea tratteggiata
% svg: livello-riferimento-vaso-ef414c60.svg 229x168
\begin{tikzpicture}
\draw[thick] (-0.3,0) -- (5.5,0);
\foreach \x in {-0.15,0,...,5.5} \draw[thin] (\x,0) -- ++(-0.15,-0.15);
\draw[thick] (5.5,0) -- (5.5,4.2);
\foreach \y in {0.15,0.3,...,4.2} \draw[thin] (5.5,\y) -- ++(0.15,-0.15);
\draw[thick] (3.7,3) -- (5.5,3);
\draw[thick, fill=blue!10] (4.4,3) rectangle ++(0.6,0.7);
\draw[thick] (0.1,1.6) -- (2.3,1.6);
\draw[thick] (0.3,0) -- (0.3,1.6);
\draw[thick] (2.1,0) -- (2.1,1.6);
\draw[dashed, thin] (2.3,1.6) -- (4.3,1.6);
\draw[{Stealth}-{Stealth}, thin] (3.3,0) -- (3.3,3) node[pos=0.27, left] {$1{,}5$ m};
\draw[{Stealth}-{Stealth}, thin] (4.1,1.6) -- (4.1,3) node[midway, right] {$0{,}70$ m};
\node[above] at (1.2,1.6) {\small tavolo};
\end{tikzpicture}
```

```ad-example
Esempio 2: lo stesso vaso con il riferimento sul tavolo
Il vaso dell'esempio 1 sta su una mensola a $1{,}5\,\text{m}$ dal pavimento; accanto c'è un tavolo alto $0{,}80\,\text{m}$. Quanto vale l'energia potenziale del vaso con il livello di riferimento sul piano del tavolo? E quanto varia l'energia potenziale se il vaso cade sul pavimento?

Sopra il tavolo il vaso è a $1{,}5 - 0{,}80 = 0{,}70\,\text{m}$:

$$U = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 0{,}70\,\text{m} = 13{,}72\,\text{J} \approx 14\,\text{J}$$

Il pavimento è $0{,}80\,\text{m}$ sotto il livello di riferimento, quindi ha un'altezza negativa, e sul pavimento il vaso ha un'energia potenziale negativa:

$$U_f = 2{,}0\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot (-0{,}80\,\text{m}) = -15{,}68\,\text{J}$$

La variazione nella caduta è $\Delta U = U_f - U_i = -15{,}68\,\text{J} - 13{,}72\,\text{J} = -29{,}4\,\text{J}$, la stessa che si trova con il riferimento sul pavimento, da $29{,}4\,\text{J}$ a zero.
```

```ad-warning
L'altezza si misura dal livello di riferimento
In $U = m g h$ l'altezza $h$ è la quota del corpo sopra il livello scelto, non la strada che ha fatto per arrivarci. Un corpo sotto il livello di riferimento ha $h$ negativa e un'energia potenziale negativa: non è un errore, vuol dire solo che ha meno energia che al livello zero.
```

## Il lavoro del peso è meno la variazione di energia potenziale

Un corpo passa dall'altezza $h_i$ all'altezza $h_f$. Se scende in verticale, il peso compie il lavoro $m g (h_i - h_f)$, cioè $U_i - U_f$. Lo stesso vale se sale: allora il peso è opposto allo spostamento, e il suo lavoro è negativo. In tutti e due i casi

$$W_P = U_i - U_f = -\Delta U$$

Quando il corpo scende il peso compie un lavoro positivo e l'energia potenziale diminuisce; quando sale il lavoro del peso è negativo e l'energia potenziale aumenta.

Questo lavoro non dipende dalla strada, come dice la lezione sul lavoro: lungo un [piano inclinato](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/l-equilibrio-sul-piano-inclinato) lavora solo la componente del peso parallela al piano, e su una scala solo i tratti verticali. Da $A$ a $B$ il peso compie sempre il lavoro $m g h$, e l'energia potenziale cala sempre di $m g h$.

```tikz
% nome: lavoro-peso-tre-percorsi
% alt: Tre percorsi dal punto A, in alto a sinistra, al punto B, 3 centimetri più in basso e 4 più a destra: un tratto verticale seguito da uno orizzontale, un piano inclinato in linea retta e una scala di quattro gradini. Il dislivello h tra A e B è segnato a sinistra ed è lo stesso per tutti e tre
% svg: lavoro-peso-tre-percorsi-a70083cc.svg 210x153
\begin{tikzpicture}
\draw[thick, blue, -{Stealth}] (0,3) -- (0,0) -- (3.95,0);
\draw[thick, orange!90!black, -{Stealth}] (0,3) -- (3.96,0.03);
\draw[thick, green!50!black, -{Stealth}] (0,3) -- (1,3) -- (1,2.25) -- (2,2.25) -- (2,1.5) -- (3,1.5) -- (3,0.75) -- (4,0.75) -- (4,0.05);
\fill (0,3) circle (1.5pt) node[above left] {$A$};
\fill (4,0) circle (1.5pt) node[below right] {$B$};
\draw[{Stealth}-{Stealth}, thin] (-0.5,0) -- (-0.5,3) node[midway, left] {$h$};
\draw[dashed, thin] (-0.6,0) -- (0,0);
\draw[dashed, thin] (-0.6,3) -- (0,3);
\end{tikzpicture}
```

```ad-note
Forze conservative
Le forze il cui lavoro dipende solo dal punto di partenza e da quello di arrivo, e non dalla strada, si chiamano forze conservative. Il peso è una di queste, e così la forza elastica: sono le forze che hanno un'energia potenziale. L'attrito no, come si vede nella lezione [Forze dissipative e conservazione dell'energia totale](/materiale/scuola-superiore/fisica/lavoro-ed-energia/forze-dissipative-e-conservazione-dell-energia-totale).
```

```ad-example
Esempio 3: una palla lanciata in alto
Una palla di $0{,}50\,\text{kg}$ viene lanciata verso l'alto da $1{,}2\,\text{m}$ di altezza, sale fino a $3{,}0\,\text{m}$ e poi cade sul pavimento. Quanto lavoro compie il peso durante la salita? E in tutto il viaggio, dal lancio al pavimento?

Con il riferimento sul pavimento, nella salita

$$W_P = U_i - U_f = m g (h_i - h_f) = 0{,}50\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot (1{,}2\,\text{m} - 3{,}0\,\text{m}) = -8{,}82\,\text{J} \approx -8{,}8\,\text{J}$$

negativo, perché la palla sale. In tutto il viaggio conta solo il punto di partenza, a $1{,}2\,\text{m}$, e quello di arrivo, a zero:

$$W_P = 0{,}50\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}2\,\text{m} = 5{,}88\,\text{J} \approx 5{,}9\,\text{J}$$

Il lavoro negativo della salita è stato recuperato nella discesa dalla stessa quota.
```

```ad-example
Esempio 4: una salita in montagna
Un escursionista di $65\,\text{kg}$ sale da un rifugio a una vetta, con un dislivello di $1{,}2\,\text{km}$. Di quanto aumenta la sua energia potenziale? Quanto lavoro compie il peso?

$$\Delta U = m g \,\Delta h = 65\,\text{kg} \cdot 9{,}8\,\text{m/s}^2 \cdot 1{,}2 \cdot 10^3\,\text{m} = 764\,400\,\text{J} \approx 7{,}6 \cdot 10^5\,\text{J}$$

Il lavoro del peso è $W_P = -\Delta U \approx -7{,}6 \cdot 10^5\,\text{J}$, qualunque sentiero l'escursionista abbia scelto. Il dislivello va in metri: con $1{,}2$ al posto di $1200$ il risultato sarebbe mille volte più piccolo.
```

```ad-warning
Il segno del lavoro del peso
$W_P = -\Delta U$: quando l'energia potenziale aumenta (il corpo sale) il lavoro del peso è negativo. Scrivere $W_P = \Delta U$ dà il segno sbagliato; il controllo è che un corpo che cade deve ricevere dal peso un lavoro positivo.
```

## L'energia potenziale elastica

Una molla allungata o compressa, lasciata libera, torna alla sua lunghezza a riposo e può spingere o tirare un corpo: anche lei ha un'energia potenziale. Chiamiamo $x$ la **deformazione** della molla, cioè di quanto è allungata o compressa rispetto alla lunghezza a riposo (nella lezione sulla [legge di Hooke](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/la-forza-elastica-e-la-legge-di-hooke) l'allungamento si chiamava $\Delta l$).

```tikz
% nome: molla-deformazione-x
% alt: Tre molle attaccate a una parete a sinistra, con un blocco all'estremo libero. In alto la molla è a riposo; al centro è allungata, e il blocco è spostato verso destra di x rispetto alla posizione di riposo, segnata da una linea tratteggiata verticale; in basso è compressa, e il blocco è spostato verso sinistra di x
% svg: molla-deformazione-x-2325a984.svg 217x177
\begin{tikzpicture}
\draw[thick] (0,-0.2) -- (0,4.2);
\foreach \y in {0,0.15,...,4.2} \draw[thin] (0,\y) -- ++(-0.15,-0.15);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,3.55) -- (2,3.55);
\draw[thick, fill=blue!10] (2,3.2) rectangle ++(0.7,0.7);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,2.05) -- (2.8,2.05);
\draw[thick, fill=blue!10] (2.8,1.7) rectangle ++(0.7,0.7);
\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (0,0.55) -- (1.3,0.55);
\draw[thick, fill=blue!10] (1.3,0.2) rectangle ++(0.7,0.7);
\draw[dashed, thin] (2,-0.1) -- (2,4.1);
\draw[{Stealth}-{Stealth}, thin] (2,1.5) -- (2.8,1.5) node[midway, below] {$x$};
\draw[{Stealth}-{Stealth}, thin] (1.3,0) -- (2,0) node[midway, below] {$x$};
\node[right] at (3.8,3.55) {\small a riposo};
\node[right] at (3.8,2.05) {\small allungata};
\node[right] at (3.8,0.55) {\small compressa};
\end{tikzpicture}
```

Per allungare la molla di $x$ bisogna compiere un lavoro. La forza non è costante: secondo la legge di Hooke parte da zero, a molla a riposo, e cresce fino a $k x$. Nella lezione sul [lavoro](/materiale/scuola-superiore/fisica/lavoro-ed-energia/il-lavoro-di-una-forza) si è visto che il lavoro è allora l'area sotto il grafico della forza in funzione dell'allungamento, un triangolo di base $x$ e altezza $k x$:

$$W = \frac{1}{2} \cdot x \cdot k x = \frac{1}{2} k x^2$$

Tornando a riposo la molla restituisce questo lavoro. L'**energia potenziale elastica** di una molla di costante elastica $k$ deformata di $x$ è

$$U = \frac{1}{2} k x^2$$

con $k$ in N/m e $x$ in metri, e il livello zero nella molla a riposo. È positiva sia per una molla allungata sia per una compressa, perché $x$ compare al quadrato: una molla compressa di $5\,\text{cm}$ ha la stessa energia della stessa molla allungata di $5\,\text{cm}$.

```ad-example
Esempio 5: una molla compressa
Una molla con $k = 250\,\text{N/m}$ viene compressa di $8{,}0\,\text{cm}$. Quanta energia potenziale elastica ha? E se la compressione raddoppia?

La deformazione va in metri, $x = 0{,}080\,\text{m}$:

$$U = \frac{1}{2} k x^2 = \frac{1}{2} \cdot 250\,\text{N/m} \cdot (0{,}080\,\text{m})^2 = 0{,}80\,\text{J}$$

Con $x = 0{,}16\,\text{m}$ l'energia diventa $\tfrac{1}{2} \cdot 250 \cdot 0{,}16^2\,\text{J} = 3{,}2\,\text{J}$: quattro volte tanto, perché la deformazione è al quadrato.
```

```ad-example
Esempio 6: la deformazione dall'energia
Una molla con $k = 1200\,\text{N/m}$ ha un'energia potenziale elastica di $6{,}0\,\text{J}$. Di quanto è deformata?

Dalla formula, $x^2 = 2U / k$:

$$x = \sqrt{\frac{2U}{k}} = \sqrt{\frac{2 \cdot 6{,}0\,\text{J}}{1200\,\text{N/m}}} = \sqrt{0{,}010\,\text{m}^2} = 0{,}10\,\text{m} = 10\,\text{cm}$$
```

```ad-warning
Il mezzo e il quadrato
Nell'energia elastica ci sono tutti e due: $U = \tfrac{1}{2} k x^2$, non $k x^2$ e non $\tfrac{1}{2} k x$ (che non è nemmeno un'energia: $\text{N/m} \cdot \text{m} = \text{N}$). E la deformazione va in metri: con $8{,}0$ al posto di $0{,}080$ l'energia dell'esempio 5 verrebbe diecimila volte più grande.
```

Anche per la forza elastica il lavoro è meno la variazione di energia potenziale, $W_{el} = U_i - U_f$: una molla che si accorcia da $x_i = 10\,\text{cm}$ a $x_f = 5{,}0\,\text{cm}$, con $k = 200\,\text{N/m}$, compie il lavoro $\tfrac{1}{2} \cdot 200 \cdot (0{,}10^2 - 0{,}050^2)\,\text{J} = 0{,}75\,\text{J}$.

## Le due energie potenziali a confronto

| | gravitazionale | elastica |
|---|---|---|
| formula | $U = m g h$ | $U = \tfrac{1}{2} k x^2$ |
| livello zero | scelto (pavimento, suolo, tavolo) | la molla a riposo |
| può essere negativa | sì, sotto il livello zero | no |
| cresce con | l'altezza, in proporzione | il quadrato della deformazione |
| lavoro della forza | $W_P = -\Delta U$ | $W_{el} = -\Delta U$ |
