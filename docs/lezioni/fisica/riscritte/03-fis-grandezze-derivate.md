# Grandezze derivate: area, volume e densità

Per sapere quanta vernice serve per una parete si misurano due lunghezze e si moltiplicano; per sapere se un anello è d'oro si misurano la sua massa e il suo volume e si fa una divisione. L'area, il volume e la densità non hanno uno strumento che li misuri direttamente: si calcolano a partire dalle grandezze fondamentali, e per questo si chiamano grandezze derivate.

## Grandezze e unità derivate

Una **grandezza derivata** è definita da una formula che la lega alle grandezze fondamentali del [Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale). La sua unità, l'**unità derivata**, viene dalla stessa formula: l'area di un rettangolo è una lunghezza per una lunghezza, quindi si misura in metri per metri, cioè in metri quadrati. Per dire di che cosa è fatta l'unità di una grandezza si scrive la grandezza tra parentesi quadre:

$$[A] = \text{m} \cdot \text{m} = \text{m}^2$$

Nello stesso modo una velocità, che è uno spazio diviso un tempo, si misura in metri al secondo, $\text{m/s}$.

## L'area

L'area di una superficie si misura in **metri quadrati** ($\text{m}^2$): $1\,\text{m}^2$ è l'area di un quadrato con il lato di $1\,\text{m}$. Le formule delle aree e le conversioni tra $\text{m}^2$, $\text{dm}^2$, $\text{cm}^2$ e $\text{mm}^2$ sono nella lezione [Equivalenza e aree](/materiale/scuola-superiore/matematica/geometria-del-piano-circonferenza-aree-e-similitudine/equivalenza-e-aree). La regola da ricordare è una: quando l'unità è al quadrato, anche il fattore di conversione va al quadrato.

$$1\,\text{m}^2 = (10^2\,\text{cm})^2 = 10^4\,\text{cm}^2 \qquad 1\,\text{km}^2 = (10^3\,\text{m})^2 = 10^6\,\text{m}^2$$

```ad-warning
Il prefisso va al quadrato con l'unità
$1\,\text{km}^2$ è un quadrato di $1000\,\text{m}$ per $1000\,\text{m}$, quindi vale $10^6\,\text{m}^2$, non $10^3\,\text{m}^2$. Il simbolo $\text{km}^2$ vuol dire $(\text{km})^2$.
```

## Il volume

Il volume di un corpo è lo spazio che occupa. Si misura in **metri cubi** ($\text{m}^3$): $1\,\text{m}^3$ è il volume di un cubo con lo spigolo di $1\,\text{m}$. Un metro cubo è grande (un cubo alto come un bambino piccolo); più spesso si usano i sottomultipli.

Un cubo con lo spigolo di $1\,\text{dm}$, cioè $10\,\text{cm}$, contiene $10$ strati da $10 \cdot 10$ cubetti con lo spigolo di $1\,\text{cm}$: $1\,\text{dm}^3 = 1000\,\text{cm}^3$.

```tikz
% nome: decimetro-cubo-centimetri-cubi
% alt: Un cubo con lo spigolo di 1 decimetro, cioè 10 centimetri, con le facce divise in quadretti di 1 centimetro: contiene 10 strati da 100 cubetti, cioè 1000 centimetri cubi, e il suo volume è 1 litro
% svg: decimetro-cubo-centimetri-cubi-464b8283.svg 182x144
\begin{tikzpicture}
\fill[blue!10] (0,0) rectangle (2.2,2.2);
\fill[blue!20] (0,2.2) -- (0.8,2.7) -- (3.0,2.7) -- (2.2,2.2) -- cycle;
\fill[blue!15] (2.2,0) -- (3.0,0.5) -- (3.0,2.7) -- (2.2,2.2) -- cycle;
\foreach \i in {1,...,9} {
  \draw[gray!60, very thin] (\i*0.22,0) -- (\i*0.22,2.2);
  \draw[gray!60, very thin] (0,\i*0.22) -- (2.2,\i*0.22);
  \draw[gray!60, very thin] (\i*0.22,2.2) -- ++(0.8,0.5);
  \draw[gray!60, very thin] ({\i*0.08},{2.2+\i*0.05}) -- ++(2.2,0);
  \draw[gray!60, very thin] ({2.2+\i*0.08},{\i*0.05}) -- ++(0,2.2);
  \draw[gray!60, very thin] (2.2,\i*0.22) -- ++(0.8,0.5);
}
\fill[orange!60] (0,0) rectangle (0.22,0.22);
\draw[thick] (0,0) rectangle (2.2,2.2);
\draw[thick] (0,2.2) -- (0.8,2.7) -- (3.0,2.7) -- (2.2,2.2);
\draw[thick] (2.2,0) -- (3.0,0.5) -- (3.0,2.7);
\node[below] at (1.1,-0.05) {\small $1$ dm $= 10$ cm};
\draw[thin] (0.11,0.11) -- (-0.25,0.8);
\node[left] at (-0.25,0.8) {\small $1$ cm$^3$};
\node[below] at (1.5,-0.5) {\small $1$ dm$^3$ $= 1000$ cm$^3$ $= 1$ L};
\end{tikzpicture}
```

Tra un'unità di volume e quella subito più piccola il fattore è $10^3 = 1000$: il fattore delle lunghezze va al cubo.

| Unità | $\text{m}^3$ | $\text{dm}^3$ | $\text{cm}^3$ | $\text{mm}^3$ |
|---|---|---|---|---|
| in $\text{cm}^3$ | $10^6$ | $1000$ | $1$ | $10^{-3}$ |

Per i liquidi si usa il **litro** ($\text{L}$), che il SI accetta: un litro è un decimetro cubo, e un millilitro è un centimetro cubo.

$$1\,\text{L} = 1\,\text{dm}^3 \qquad 1\,\text{mL} = 1\,\text{cm}^3 \qquad 1\,\text{m}^3 = 1000\,\text{L}$$

```ad-warning
Un metro cubo non è mille centimetri cubi
$1\,\text{m} = 100\,\text{cm}$, ma $1\,\text{m}^3 = 100^3\,\text{cm}^3 = 10^6\,\text{cm}^3$. Tra due unità di volume vicine il fattore è $1000$, non $10$ né $100$.
```

Il volume di un solido regolare si calcola con le formule della geometria: per il cubo di spigolo $\ell$ è $\ell^3$, per il parallelepipedo rettangolo di spigoli $a$, $b$, $c$ è $a \cdot b \cdot c$; le formule del cilindro e della sfera sono nella lezione [Aree e volumi dei solidi](/materiale/scuola-superiore/matematica/geometria-dello-spazio/aree-e-volumi-dei-solidi).

```ad-example
Esempio 1: il volume di un acquario
Un acquario ha la forma di un parallelepipedo lungo $60\,\text{cm}$, largo $30\,\text{cm}$ e alto $40\,\text{cm}$. Quanti litri d'acqua contiene quando è pieno?

$$V = 60\,\text{cm} \cdot 30\,\text{cm} \cdot 40\,\text{cm} = 72\,000\,\text{cm}^3$$

Un litro è $1000\,\text{cm}^3$, quindi $V = 72\,000 : 1000 = 72\,\text{dm}^3 = 72\,\text{L}$.
```

### Il volume di un corpo irregolare

Il volume di un sasso non si calcola con una formula. Si misura **per immersione**: si versa dell'acqua in un cilindro graduato e si legge il volume $V_1$, poi si immerge del tutto il sasso e si legge il nuovo volume $V_2$. Il sasso occupa il posto di un volume d'acqua uguale al suo, quindi

$$V = V_2 - V_1$$

```tikz
% nome: volume-per-immersione
% alt: Due cilindri graduati da 0 a 200 millilitri: nel primo l'acqua arriva a 120 millilitri, nel secondo, con un sasso immerso sul fondo, arriva a 146 millilitri; il volume del sasso è la differenza, 26 millilitri
% svg: volume-per-immersione-83815844.svg 204x173
\begin{tikzpicture}
\foreach \x/\v in {0/120, 3/146} {
  \fill[blue!15] (\x,0) rectangle ++(1.2,{\v*0.016});
  \draw[thick] (\x,3.4) -- (\x,0) -- ++(1.2,0) -- ++(0,3.4);
  \foreach \t in {10,20,...,200} \draw[thin] (\x,{\t*0.016}) -- ++(0.15,0);
  \foreach \t in {50,100,150,200} {
    \draw[thin] (\x,{\t*0.016}) -- ++(0.3,0);
    \node[left, font=\scriptsize] at (\x,{\t*0.016}) {$\t$};
  }
  \draw[thin] (\x,{\v*0.016}) -- ++(1.2,0);
}
\fill[gray!50] (3.25,0) -- (3.8,0) -- (4.0,0.25) -- (3.85,0.5) -- (3.45,0.55) -- (3.2,0.3) -- cycle;
\draw[thin] (3.25,0) -- (3.8,0) -- (4.0,0.25) -- (3.85,0.5) -- (3.45,0.55) -- (3.2,0.3) -- cycle;
\node[below] at (0.6,-0.1) {\small $V_1 = 120$ mL};
\node[below] at (3.6,-0.1) {\small $V_2 = 146$ mL};
\node[above] at (0.6,3.45) {\small mL};
\node[above] at (3.6,3.45) {\small mL};
\end{tikzpicture}
```

Nella figura il sasso ha il volume $V = 146\,\text{mL} - 120\,\text{mL} = 26\,\text{mL}$, cioè $26\,\text{cm}^3$. Come si legge bene la scala di un cilindro graduato lo spiega la lezione [Gli strumenti di misura](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/gli-strumenti-di-misura).

## La densità

Un cubetto di legno e uno di ferro grandi uguali hanno masse molto diverse: il ferro ha più massa in ogni centimetro cubo. La grandezza che lo misura è la **densità**, il rapporto tra la massa $m$ di un corpo e il suo volume $V$:

$$d = \frac{m}{V}$$

La densità dice quanta massa c'è in un'unità di volume. La sua unità nel SI è il **chilogrammo al metro cubo** ($\text{kg/m}^3$); nei laboratori si usa spesso il **grammo al centimetro cubo** ($\text{g/cm}^3$). Poiché $1\,\text{g} = 10^{-3}\,\text{kg}$ e $1\,\text{cm}^3 = 10^{-6}\,\text{m}^3$,

$$1\,\frac{\text{g}}{\text{cm}^3} = \frac{10^{-3}\,\text{kg}}{10^{-6}\,\text{m}^3} = 10^3\,\frac{\text{kg}}{\text{m}^3}$$

Quindi l'acqua, che ha la densità di $1\,\text{g/cm}^3$, ha anche la densità di $1000\,\text{kg/m}^3$: un litro d'acqua ha la massa di $1\,\text{kg}$, un metro cubo quella di una tonnellata.

La densità è una proprietà del materiale, non dell'oggetto: un chiodo e una trave di ferro hanno masse e volumi diversissimi, ma lo stesso rapporto $\dfrac{m}{V}$. Per questo la densità serve a riconoscere di che cosa è fatto un corpo. Dipende un po' dalla temperatura, perché scaldandosi i corpi si dilatano; i valori della tabella sono a temperatura ambiente, tranne quello del ghiaccio.

| Materiale | $d$ in $\text{kg/m}^3$ | $d$ in $\text{g/cm}^3$ |
|---|---|---|
| aria | $1{,}2$ | $0{,}0012$ |
| legno di abete | circa $450$ | circa $0{,}45$ |
| olio d'oliva | $920$ | $0{,}92$ |
| ghiaccio | $917$ | $0{,}917$ |
| acqua | $1000$ | $1{,}00$ |
| vetro | circa $2500$ | circa $2{,}5$ |
| alluminio | $2700$ | $2{,}70$ |
| ferro | $7870$ | $7{,}87$ |
| rame | $8960$ | $8{,}96$ |
| piombo | $11\,300$ | $11{,}3$ |
| mercurio | $13\,600$ | $13{,}6$ |
| oro | $19\,300$ | $19{,}3$ |

```ad-example
Esempio 2: di che materiale è il blocchetto?
Un blocchetto di metallo a forma di parallelepipedo misura $2{,}0\,\text{cm}$, $3{,}0\,\text{cm}$ e $5{,}0\,\text{cm}$ e ha la massa di $81\,\text{g}$. Di che metallo è fatto?

Il volume è $V = 2{,}0 \cdot 3{,}0 \cdot 5{,}0 = 30\,\text{cm}^3$, quindi

$$d = \frac{m}{V} = \frac{81\,\text{g}}{30\,\text{cm}^3} = 2{,}7\,\text{g/cm}^3 = 2700\,\text{kg/m}^3$$

Nella tabella è la densità dell'alluminio.
```

```ad-warning
La massa sopra, il volume sotto
La densità è $\dfrac{m}{V}$, non $\dfrac{V}{m}$. Un controllo: i metalli hanno densità più grandi dell'acqua, e $\dfrac{30}{81} = 0{,}37$ direbbe che l'alluminio è più leggero dell'acqua a parità di volume.
```

### Massa e volume dalla densità

Dalla formula della densità si ricavano la massa e il volume, come in un'equazione:

$$m = d \cdot V \qquad V = \frac{m}{d}$$

Prima di fare il conto, massa, volume e densità vanno scritti in unità che si accordano: $\text{kg}$, $\text{m}^3$ e $\text{kg/m}^3$, oppure $\text{g}$, $\text{cm}^3$ e $\text{g/cm}^3$.

```ad-example
Esempio 3: la massa di una bottiglia d'olio
Quanto vale la massa di $2{,}5\,\text{L}$ di olio d'oliva, che ha la densità di $920\,\text{kg/m}^3$?

Il volume va in metri cubi: $2{,}5\,\text{L} = 2{,}5\,\text{dm}^3 = 2{,}5 \cdot 10^{-3}\,\text{m}^3$. Quindi

$$m = d \cdot V = 920\,\frac{\text{kg}}{\text{m}^3} \cdot 2{,}5 \cdot 10^{-3}\,\text{m}^3 = 2{,}3\,\text{kg}$$
```

```ad-example
Esempio 4: un chilo d'oro e un chilo d'alluminio
Che volume occupa $1\,\text{kg}$ d'oro? E $1\,\text{kg}$ di alluminio?

Con la massa in grammi e la densità in $\text{g/cm}^3$ il volume esce in centimetri cubi:

$$V_{\text{oro}} = \frac{1000\,\text{g}}{19{,}3\,\text{g/cm}^3} \approx 51{,}8\,\text{cm}^3 \qquad V_{\text{alluminio}} = \frac{1000\,\text{g}}{2{,}70\,\text{g/cm}^3} \approx 370\,\text{cm}^3$$

Un chilo d'oro sta in un cubetto di meno di $4\,\text{cm}$ di spigolo; un chilo d'alluminio occupa un volume circa $7$ volte più grande.
```

```ad-warning
Unità che non si accordano
Con $m = 81\,\text{g}$ e $V = 30 \cdot 10^{-6}\,\text{m}^3$ la divisione dà $2{,}7 \cdot 10^6$, che non è né in $\text{g/cm}^3$ né in $\text{kg/m}^3$. Prima si porta tutto nello stesso gruppo di unità, poi si divide.
```

```ad-warning
Più denso non vuol dire più pesante
Un chilo di piombo e un chilo di legno hanno la stessa massa. Quando si dice che il piombo "pesa più" del legno si intende che, a parità di volume, ha più massa: ha una densità maggiore.
```

### Il grafico massa-volume

Se si misurano massa e volume di tanti pezzi dello stesso materiale, il rapporto $\dfrac{m}{V}$ è sempre lo stesso: quando il volume raddoppia, raddoppia anche la massa. Sul grafico con il volume in orizzontale e la massa in verticale i punti di ogni materiale stanno su una retta che passa per l'origine, tanto più ripida quanto più il materiale è denso. È un caso di [proporzionalità diretta](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare).

```tikz
% nome: grafico-massa-volume
% alt: Il grafico della massa in grammi in funzione del volume in centimetri cubi per tre materiali: tre rette che passano per l'origine, la più ripida per l'alluminio, che a 40 centimetri cubi arriva a 108 grammi, poi l'acqua, che arriva a 40 grammi, e il legno di abete, che arriva a 18 grammi
% svg: grafico-massa-volume-3a5d9aa4.svg 221x158
% poi-interattivo: scegliere il materiale e trascinare il punto lungo la retta, leggendo massa, volume e il loro rapporto
\begin{tikzpicture}[scale=0.92]
\draw[gray!25, very thin] (0,0) grid[xstep=0.9, ystep=0.5] (3.6,3);
\draw[->] (-0.2,0) -- (4.0,0) node[right] {\small $V$ (cm$^3$)};
\draw[->] (0,-0.2) -- (0,3.4) node[above] {\small $m$ (g)};
\foreach \v in {10,20,30,40} \node[below, font=\scriptsize] at ({\v*0.09},0) {$\v$};
\foreach \m in {20,40,...,120} \node[left, font=\scriptsize] at (0,{\m*0.025}) {$\m$};
\draw[thick, orange!90!black] (0,0) -- (3.6,2.7) node[above left, font=\small] {alluminio};
\draw[thick, blue] (0,0) -- (3.6,1) node[above left, font=\small] {acqua};
\draw[thick, green!50!black] (0,0) -- (3.6,0.45) node[below left, font=\small] {legno};
\end{tikzpicture}
```

Prova a cambiare il volume e il materiale: la massa cambia con il volume, il rapporto tra le due no.

```interattivo
% nome: densita-massa-volume
% alt: Un cubo di materiale che cresce con un cursore del volume, da 5 a 50 centimetri cubi, e accanto il grafico massa-volume con le rette di legno, acqua, alluminio e ferro e il punto del cubo sulla retta del suo materiale; quattro bottoni scelgono il materiale, e sotto si leggono volume, massa e il rapporto massa su volume, che resta uguale alla densità del materiale
```
