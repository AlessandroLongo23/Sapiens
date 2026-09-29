# La forza-peso e la massa

Un sasso lasciato andare cade, un libro appoggiato preme sul tavolo, uno zaino tira giù le spalle: la Terra attira tutti i corpi, e questa forza è il loro peso. Nel linguaggio di tutti i giorni peso e massa sono la stessa cosa ("peso $60$ chili"), ma in fisica sono due grandezze diverse, con unità diverse: la massa si misura in chilogrammi con la bilancia, il peso in newton con il [dinamometro](/materiale/scuola-superiore/fisica/i-vettori-e-le-forze/le-forze-e-il-dinamometro). Un astronauta sulla Luna ha la stessa massa che ha sulla Terra, ma pesa circa sei volte di meno.

## La massa

La **massa** di un corpo misura la quantità di materia di cui è fatto. È una grandezza scalare, una delle grandezze di base del Sistema Internazionale, e la sua unità è il chilogrammo (kg); si usano anche il grammo, $1\,\text{g} = 10^{-3}\,\text{kg}$, e la tonnellata, $1\,\text{t} = 10^3\,\text{kg}$ (vedi [Grandezze fisiche e unità del Sistema Internazionale](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/grandezze-fisiche-e-unita-del-sistema-internazionale)).

La massa di un corpo non dipende dal luogo in cui si trova: una borraccia di $0{,}75\,\text{kg}$ ha la stessa massa a Roma, in cima all'Everest, sulla Luna e su una navicella nello spazio. Con i principi della dinamica si vedrà che la massa misura anche l'inerzia di un corpo, cioè quanto è difficile metterlo in moto o fermarlo ([Il primo principio della dinamica](/materiale/scuola-superiore/fisica/i-principi-della-dinamica/il-primo-principio-della-dinamica-e-i-sistemi-inerziali)).

## La forza-peso

La **forza-peso** (o peso) di un corpo è la forza con cui la Terra lo attira. È una forza a distanza, e come ogni forza è un vettore, $\vec{P}$:

- la direzione è verticale, cioè quella del filo a piombo;
- il verso è verso il basso, verso il centro della Terra;
- il punto di applicazione è il baricentro del corpo, il punto che la lezione [Il baricentro e la stabilità dell'equilibrio](/materiale/scuola-superiore/fisica/l-equilibrio-dei-solidi/il-baricentro-e-la-stabilita-dell-equilibrio) insegna a trovare (in un corpo omogeneo e simmetrico, come un blocco o una sfera, è il centro);
- il modulo $P$ si misura in newton.

```tikz
% nome: forza-peso-verso-centro-terra
% alt: La Terra disegnata come un cerchio, con tre corpi in punti diversi della superficie: il peso di ciascuno è una freccia rossa che punta verso il centro della Terra, lungo la retta tratteggiata che unisce il corpo al centro
% svg: forza-peso-verso-centro-terra-6c83d61c.svg 126x124
\begin{tikzpicture}
\draw[thick, fill=blue!10] (0,0) circle (1.4);
\fill (0,0) circle (1.5pt);
\foreach \a in {90,210,330} {
\draw[dashed, thin] (0,0) -- (\a:1.4);
\draw[thick, fill=orange!25] ($(\a:1.4)+(\a+90:0.18)$) -- ($(\a:1.4)+(\a-90:0.18)$) -- ($(\a:1.76)+(\a-90:0.18)$) -- ($(\a:1.76)+(\a+90:0.18)$) -- cycle;
\draw[-{Stealth}, thick, red] (\a:1.58) -- (\a:0.88);
}
\node[red] at (0.3,0.98) {$\vec{P}$};
\node[right] at (0.05,0.15) {\small centro};
\end{tikzpicture}
```

"Verso il basso" vuol dire quindi cose diverse in punti diversi della Terra: a Roma e in Australia i pesi puntano in direzioni quasi opposte, ma sempre verso il centro.

## Il peso è proporzionale alla massa

Se si appendono a un dinamometro due sacchetti uguali, la lettura raddoppia; con tre, triplica. Il peso è direttamente proporzionale alla massa, e la costante di proporzionalità si indica con $g$:

$$P = m \cdot g$$

Sulla Terra

$$g = 9{,}8\,\text{N/kg}$$

cioè ogni chilogrammo di massa pesa $9{,}8\,\text{N}$. L'unità N/kg è la stessa cosa del $\text{m/s}^2$, perché $1\,\text{N} = 1\,\text{kg} \cdot \text{m/s}^2$: per questo $g$ si scrive anche $9{,}8\,\text{m/s}^2$, e si chiama **accelerazione di gravità**. Il nome viene dal moto: un corpo che cade liberamente aumenta la sua velocità di $9{,}8\,\text{m/s}$ ogni secondo, come spiega la lezione [La caduta libera e il lancio verticale](/materiale/scuola-superiore/fisica/il-moto-rettilineo/la-caduta-libera-e-il-lancio-verticale).

Il grafico del peso in funzione della massa è una retta che passa per l'origine, come ogni [proporzionalità diretta](/materiale/scuola-superiore/fisica/relazioni-tra-grandezze-e-grafici/proporzionalita-diretta-e-dipendenza-lineare), e la sua pendenza è $g$.

```tikz
% nome: grafico-peso-massa
% alt: Il grafico del peso P in newton in funzione della massa m in chilogrammi sulla Terra: una retta per l'origine che passa per il punto di massa 1 chilogrammo e peso 9,8 newton e per quello di massa 4 chilogrammi e peso 39,2 newton
% svg: grafico-peso-massa-62d15ae6.svg 252x185
% poi-interattivo: spostare un punto sulla retta e leggere massa e peso, cambiare corpo celeste e vedere la retta cambiare pendenza
\begin{tikzpicture}[x=1cm, y=0.08cm]
\draw[gray!25, very thin] (0,0) grid[xstep=1, ystep=10] (4.5,45);
\draw[->] (0,0) -- (4.8,0) node[right] {\small $m$ (kg)};
\draw[->] (0,0) -- (0,48) node[above] {\small $P$ (N)};
\foreach \x in {1,2,3,4} \node[below] at (\x,0) {\scriptsize $\x$};
\foreach \y in {10,20,30,40} \node[left] at (0,\y) {\scriptsize $\y$};
\node[below left] at (0,0) {\scriptsize $0$};
\draw[thick, blue] (0,0) -- (4.5,44.1);
\draw[dashed, thin] (1,0) -- (1,9.8) -- (0,9.8);
\fill[blue] (1,9.8) circle (1.5pt);
\fill[blue] (4,39.2) circle (1.5pt);
\node[right] at (1,8) {\scriptsize $(1;\ 9{,}8)$};
\node[right] at (4,36) {\scriptsize $(4;\ 39{,}2)$};
\end{tikzpicture}
```

```ad-example
Esempio 1: il peso di uno zaino
Uno zaino ha la massa di $6{,}0\,\text{kg}$. Quanto pesa?

$$P = m \cdot g = 6{,}0\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 58{,}8\,\text{N} \approx 59\,\text{N}$$

I dati hanno due cifre significative, e il risultato si arrotonda a due cifre, come insegna la lezione [Le cifre significative](/materiale/scuola-superiore/fisica/le-grandezze-fisiche-e-la-misura/le-cifre-significative).
```

```ad-example
Esempio 2: la massa dal peso
Un sacchetto appeso a un dinamometro gli fa segnare $3{,}5\,\text{N}$. Qual è la sua massa?

Dalla formula del peso si ricava la massa dividendo per $g$:

$$m = \frac{P}{g} = \frac{3{,}5\,\text{N}}{9{,}8\,\text{N/kg}} = 0{,}357\ldots\,\text{kg} \approx 0{,}36\,\text{kg}$$

cioè circa $360\,\text{g}$.
```

```ad-example
Esempio 3: una massa in grammi
Quanto pesa una mela di $300\,\text{g}$?

Nella formula la massa va in chilogrammi, perché $g$ è in newton al chilogrammo: $300\,\text{g} = 0{,}300\,\text{kg}$. Quindi

$$P = 0{,}300\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 2{,}94\,\text{N} \approx 2{,}9\,\text{N}$$
```

```ad-warning
La massa in grammi
Con la massa in grammi, $300 \cdot 9{,}8 = 2940$ non è il peso in newton: la mela peserebbe quanto un'automobile piccola. Prima di usare $P = m \cdot g$ la massa si porta in chilogrammi.
```

```ad-warning
Massa e peso non sono la stessa grandezza
"Peso $60\,\text{kg}$" nel linguaggio comune vuol dire "ho la massa di $60\,\text{kg}$". In fisica la massa è $60\,\text{kg}$ e il peso è $60 \cdot 9{,}8 \approx 590\,\text{N}$. Il peso si scrive in newton, mai in chilogrammi, e la massa in chilogrammi, mai in newton.
```

```ad-note
Il valore di g sulla Terra
Il valore $9{,}8\,\text{N/kg}$ è arrotondato: $g$ cambia un po' con il luogo, da circa $9{,}78\,\text{N/kg}$ all'equatore a circa $9{,}83\,\text{N/kg}$ ai poli, e diminuisce salendo di quota. Il valore di riferimento fissato per convenzione è $9{,}80665\,\text{N/kg}$. Negli esercizi si usa $9{,}8$, e $9{,}81$ solo quando serve una cifra in più.
```

## Il peso sugli altri corpi celesti

Anche la Luna e i pianeti attirano i corpi vicini alla loro superficie, ma con intensità diverse: la formula resta $P = m \cdot g$, con il valore di $g$ di quel corpo celeste. La massa non cambia, il peso sì.

| Corpo celeste | $g$ (N/kg) |
|---|---|
| Mercurio | $3{,}7$ |
| Venere | $8{,}9$ |
| Terra | $9{,}8$ |
| Luna | $1{,}6$ |
| Marte | $3{,}7$ |
| Giove | $23{,}1$ |
| Saturno | $9{,}0$ |
| Urano | $8{,}7$ |
| Nettuno | $11{,}0$ |

Per i pianeti gassosi (Giove, Saturno, Urano, Nettuno), che non hanno una superficie solida, il valore è quello all'altezza in cui la pressione dell'atmosfera è uguale a quella della Terra al livello del mare.

```ad-example
Esempio 4: un astronauta sulla Luna
Un astronauta con la tuta ha la massa di $75\,\text{kg}$. Quanto pesa sulla Terra e quanto sulla Luna?

Sulla Terra:

$$P_T = 75\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 735\,\text{N} \approx 740\,\text{N}$$

Sulla Luna:

$$P_L = 75\,\text{kg} \cdot 1{,}6\,\text{N/kg} = 120\,\text{N}$$

La massa è $75\,\text{kg}$ in tutti e due i posti. Il peso sulla Luna è circa un sesto di quello sulla Terra, perché $9{,}8 : 1{,}6 \approx 6$: per questo gli astronauti delle missioni Apollo saltellavano con tute pesantissime.
```

```ad-example
Esempio 5: da Marte alla Terra
Un robot su Marte pesa $74\,\text{N}$. Quanto pesa sulla Terra?

Prima si trova la massa, che è la stessa sui due pianeti:

$$m = \frac{P_M}{g_M} = \frac{74\,\text{N}}{3{,}7\,\text{N/kg}} = 20\,\text{kg}$$

Poi il peso sulla Terra: $P_T = 20\,\text{kg} \cdot 9{,}8\,\text{N/kg} = 196\,\text{N}$, cioè circa $2{,}0 \cdot 10^2\,\text{N}$ con due cifre significative.
```

```ad-warning
Il g del posto giusto
Sulla Luna, su Marte o su un altro pianeta si usa il $g$ di quel corpo celeste. Con $9{,}8$ si trova il peso sulla Terra, e un robot di $20\,\text{kg}$ su Marte non pesa $196\,\text{N}$ ma $74\,\text{N}$.
```

## Come si misurano il peso e la massa

Il peso è una forza, e si misura con il dinamometro: il corpo appeso al gancio tira la molla verso il basso con il suo peso, la molla lo tira verso l'alto, e quando l'indice è fermo le due forze hanno lo stesso modulo. Il dinamometro legge proprio quel modulo.

```tikz
% nome: sacchetto-appeso-forze
% alt: Un sacchetto appeso con un filo al gancio di un dinamometro: sul sacchetto agiscono il peso P verso il basso e la forza F del dinamometro verso l'alto, due frecce rosse della stessa lunghezza che partono dal centro del sacchetto
% svg: sacchetto-appeso-forze-8b42b913.svg 120x132
\begin{tikzpicture}
\draw (0,2.1) -- (0,0.8);
\draw[thick, fill=blue!10] (-0.5,0) rectangle (0.5,0.8);
\draw[-{Stealth}, thick, red] (0,0.4) -- (0,1.6) node[right] {$\vec{F}$};
\draw[-{Stealth}, thick, red] (0,0.4) -- (0,-0.8) node[right] {$\vec{P}$};
\fill (0,0.4) circle (1.5pt);
\node[right] at (0.1,2.1) {\small al dinamometro};
\end{tikzpicture}
```

La massa invece si misura con la **bilancia a bracci uguali**: il corpo va su un piatto, e sull'altro si mettono masse campione finché il giogo non è orizzontale. In equilibrio i due piatti hanno lo stesso peso, quindi le stesse masse. Sulla Luna i pesi dei due piatti diventano tutti e due circa sei volte più piccoli, ma restano uguali tra loro: la bilancia dà la stessa massa.

```tikz
% nome: bilancia-bracci-uguali
% alt: Una bilancia a bracci uguali in equilibrio: il giogo è orizzontale, su un piatto c'è una mela e sull'altro le masse campione
% svg: bilancia-bracci-uguali-d8e1f50a.svg 210x85
\begin{tikzpicture}
\draw[thick, fill=gray!20] (-0.5,0) -- (0.5,0) -- (0.1,0.2) -- (0.1,2) -- (-0.1,2) -- (-0.1,0.2) -- cycle;
\draw[thick] (-1.8,2.1) -- (1.8,2.1);
\fill (0,2.1) circle (1.5pt);
\draw (-1.8,2.1) -- (-2.3,1.1);
\draw (-1.8,2.1) -- (-1.3,1.1);
\draw (1.8,2.1) -- (1.3,1.1);
\draw (1.8,2.1) -- (2.3,1.1);
\draw[thick] (-2.4,1.1) -- (-1.2,1.1);
\draw[thick] (1.2,1.1) -- (2.4,1.1);
\draw[thick, fill=red!15] (-1.8,1.32) circle (0.22);
\draw[thick, fill=gray!20] (1.45,1.1) rectangle (1.75,1.5);
\draw[thick, fill=gray!20] (1.85,1.1) rectangle (2.1,1.4);
\draw[thick, fill=gray!20] (1.52,1.5) rectangle (1.68,1.65);
\node[below] at (-1.8,1.05) {\small mela};
\node[below] at (1.8,1.05) {\small masse campione};
\end{tikzpicture}
```

```ad-note
La bilancia pesapersone misura una forza
La bilancia del bagno, e quella elettronica della cucina, misurano la forza con cui il corpo le preme, cioè il peso, e mostrano la massa dividendo per $9{,}8$. Sono tarate per la Terra: sulla Luna una persona di $60\,\text{kg}$ leggerebbe circa $10\,\text{kg}$. La bilancia a bracci uguali segnerebbe invece $60\,\text{kg}$ anche lì.
```

Nella figura qui sotto puoi scegliere un corpo celeste e la massa appesa: il dinamometro segna pesi diversi da un posto all'altro, la bilancia a bracci uguali resta in equilibrio con le stesse masse campione.

```interattivo
% nome: peso-massa-pianeti
% alt: A sinistra un dinamometro con un sacchetto appeso, a destra una bilancia a bracci uguali con lo stesso sacchetto su un piatto e le masse campione sull'altro; si sceglie il corpo celeste tra Terra, Luna, Marte e Giove e con un cursore la massa del sacchetto, da 0,5 a 2 chilogrammi: l'indice del dinamometro segna il peso m per g, che cambia da un corpo celeste all'altro, mentre la bilancia resta in equilibrio con le stesse masse campione
```
