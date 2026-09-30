# I passaggi di stato

Il ghiaccio che si scioglie in un bicchiere, l'acqua della pasta che bolle, la brina che copre i prati in una notte d'inverno: in tutti questi casi una sostanza passa da uno [stato di aggregazione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/gli-stati-di-aggregazione) a un altro. Per un chimico il fatto più importante è che la sostanza resta la stessa: il ghiaccio, l'acqua e il vapore sono tutti fatti di molecole d'acqua, $\mathrm{H_2O}$, che cambiano solo il modo in cui stanno insieme. Un passaggio di stato è quindi una trasformazione fisica, che si può sempre invertire.

## I sei passaggi

Gli stati di aggregazione sono tre: solido, liquido e aeriforme (o gassoso). Il passaggio da uno all'altro si chiama **passaggio di stato**, e ognuno dei sei passaggi possibili ha il suo nome:

- **fusione**, da solido a liquido, e il suo inverso, la **solidificazione**, da liquido a solido;
- **vaporizzazione**, da liquido ad aeriforme, e il suo inverso, la **condensazione**, da aeriforme a liquido;
- **sublimazione**, da solido ad aeriforme senza passare per il liquido, e il suo inverso, il **brinamento**, da aeriforme a solido.

```tikz
% nome: passaggi-stato-particelle
% alt: Tre riquadri con le particelle disegnate come pallini: il solido in basso a sinistra, con le particelle in file ordinate e a contatto; il liquido in basso a destra, con le particelle vicine ma in disordine; l'aeriforme in alto, con poche particelle lontane tra loro. Frecce arancioni, dei passaggi che assorbono calore, vanno dal solido al liquido (fusione), dal liquido all'aeriforme (vaporizzazione) e dal solido all'aeriforme (sublimazione); frecce blu, dei passaggi che cedono calore, fanno il percorso inverso: solidificazione, condensazione e brinamento
% svg: passaggi-stato-particelle-0a2681fe.svg 313x226
\begin{tikzpicture}
\draw[thick, fill=blue!10] (-0.8,-0.6) rectangle (0.8,0.6);
\foreach \x in {-0.54,-0.18,0.18,0.54} \foreach \y in {-0.36,0,0.36} \draw[fill=gray!40] (\x,\y) circle (0.16);
\node[below] at (0,-0.65) {\small solido};
\draw[thick, fill=cyan!20] (4.6,-0.6) rectangle (6.2,0.6);
\foreach \p in {(4.82,-0.42),(5.16,-0.38),(5.5,-0.41),(5.86,-0.4),(4.97,-0.05),(5.32,-0.02),(5.68,-0.07),(6.0,0.0),(4.84,0.3),(5.2,0.32),(5.56,0.28)} \draw[fill=gray!40] \p circle (0.16);
\node[below] at (5.4,-0.65) {\small liquido};
\draw[thick, fill=gray!10] (1.9,3.0) rectangle (3.5,4.2);
\foreach \p in {(2.2,3.9),(3.1,3.75),(2.6,3.3),(3.12,3.25),(2.15,3.25)} \draw[fill=gray!40] \p circle (0.16);
\node[above] at (2.7,4.25) {\small aeriforme};
\draw[-{Stealth}, thick, orange!90!black] (1.0,0.18) -- (4.4,0.18) node[midway, above] {\small fusione};
\draw[-{Stealth}, thick, blue!70!black] (4.4,-0.18) -- (1.0,-0.18) node[midway, below] {\small solidificazione};
\draw[-{Stealth}, thick, orange!90!black] (5.2,0.8) -- (3.45,2.85) node[midway, right=2pt] {\small vaporizzazione};
\draw[-{Stealth}, thick, blue!70!black] (3.1,2.85) -- (4.85,0.8) node[pos=0.72, left=1pt] {\small condensazione};
\draw[-{Stealth}, thick, orange!90!black] (-0.2,0.8) -- (1.55,2.85) node[midway, left=2pt] {\small sublimazione};
\draw[-{Stealth}, thick, blue!70!black] (1.9,2.85) -- (0.55,0.8) node[pos=0.28, right=1pt] {\small brinamento};
\end{tikzpicture}
```

Il passaggio da aeriforme a solido, in alcuni libri, si chiama anche condensazione o sublimazione inversa: qui lo chiamiamo brinamento, come la brina, che si forma proprio così.

```ad-warning
Fusione non vuol dire sciogliersi in acqua
Nel linguaggio di tutti i giorni si dice che lo zucchero "si scioglie" nel tè e che il ghiaccio "si scioglie" al sole, ma sono due cose diverse. Il ghiaccio che diventa acqua fonde: è un passaggio di stato di una sola sostanza. Lo zucchero nel tè si discioglie: le sue particelle si disperdono tra quelle dell'acqua e formano una [soluzione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/le-soluzioni-e-la-concentrazione-percentuale), e lo zucchero resta solido fino a $186\,^\circ\text{C}$.
```

## Assorbire o cedere energia

Il [modello particellare](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/il-modello-particellare-della-materia) spiega perché ogni passaggio di stato scambia energia con l'ambiente. Nel solido le particelle sono legate da forze di attrazione intense e vibrano intorno a posizioni fisse; nel liquido sono ancora vicine ma scorrono le une sulle altre; nell'aeriforme sono lontane e quasi libere. Per passare da solido a liquido, o da liquido ad aeriforme, le particelle devono allontanarsi vincendo in parte le forze che le tengono unite, e per farlo serve energia: la sostanza assorbe calore dall'ambiente. Nei passaggi inversi le particelle si avvicinano e si legano di nuovo, e la stessa energia torna all'ambiente: la sostanza cede calore.

| Assorbono calore | Cedono calore |
|---|---|
| fusione | solidificazione |
| vaporizzazione | condensazione |
| sublimazione | brinamento |

I passaggi che assorbono calore si chiamano anche endotermici, quelli che lo cedono esotermici. Molti fatti di tutti i giorni si spiegano così. Il sudore che evapora dalla pelle prende il calore che gli serve dal corpo, e lo raffredda. Un cubetto di ghiaccio raffredda una bibita non solo perché è freddo, ma anche perché per fondere prende calore dalla bibita. Il vapore che condensa sulla pelle cede tutto il calore che aveva assorbito per vaporizzare, e per questo una scottatura da vapore è più grave di una da acqua bollente.

```ad-warning
Anche la solidificazione cede calore
Sembra strano che l'acqua che gela ceda calore, perché il ghiaccio è freddo; ma la solidificazione è l'inverso della fusione, e restituisce all'ambiente il calore che la fusione aveva preso. I coltivatori di agrumi, nelle notti di gelo, spruzzano acqua sulle piante: mentre gela sulle foglie, l'acqua cede calore e le protegge dal freddo più intenso.
```

## Temperatura di fusione e temperatura di ebollizione

Scaldando un pezzo di ghiaccio, la sua temperatura sale fino a $0\,^\circ\text{C}$; lì il ghiaccio comincia a fondere, e la temperatura resta ferma a $0\,^\circ\text{C}$ finché tutto il ghiaccio non è diventato acqua, anche se si continua a scaldare. Lo stesso succede quando l'acqua bolle, a $100\,^\circ\text{C}$. Per ogni [sostanza pura](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/sostanze-pure-miscugli-omogenei-ed-eterogenei), a una data pressione:

- la **temperatura di fusione**, $t_f$, è la temperatura a cui il solido fonde, ed è la stessa a cui il liquido solidifica;
- la **temperatura di ebollizione**, $t_e$, è la temperatura a cui il liquido bolle, ed è la stessa a cui il vapore condensa;
- durante la fusione e durante l'ebollizione la temperatura resta costante.

L'energia fornita mentre la temperatura è ferma non aumenta il moto delle particelle, cioè la temperatura: serve tutta ad allontanarle. Come cambia la temperatura nel tempo, prima, durante e dopo i passaggi, si vede nella lezione sulle [curve di riscaldamento e di raffreddamento](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/curve-di-riscaldamento-e-di-raffreddamento); quanta energia serve per ogni chilogrammo di sostanza, il calore latente, si calcola nella lezione di fisica sui [passaggi di stato e il calore latente](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/i-passaggi-di-stato-e-il-calore-latente).

Le temperature di fusione e di ebollizione non dipendono da quanta sostanza c'è: un cubetto di ghiaccio e un iceberg fondono tutti e due a $0\,^\circ\text{C}$. Dipendono solo dalla sostanza, e per questo sono **proprietà caratteristiche**, come la densità: servono a riconoscere una sostanza e a controllare se è pura.

| Sostanza | Temperatura di fusione | Temperatura di ebollizione |
|---|---|---|
| azoto | $-210\,^\circ\text{C}$ | $-196\,^\circ\text{C}$ |
| ossigeno | $-218\,^\circ\text{C}$ | $-183\,^\circ\text{C}$ |
| etanolo (alcol etilico) | $-114\,^\circ\text{C}$ | $78\,^\circ\text{C}$ |
| acetone | $-95\,^\circ\text{C}$ | $56\,^\circ\text{C}$ |
| mercurio | $-39\,^\circ\text{C}$ | $357\,^\circ\text{C}$ |
| acqua | $0\,^\circ\text{C}$ | $100\,^\circ\text{C}$ |
| naftalene | $80\,^\circ\text{C}$ | $218\,^\circ\text{C}$ |
| cloruro di sodio (sale da cucina) | $801\,^\circ\text{C}$ | $1465\,^\circ\text{C}$ |
| ferro | $1538\,^\circ\text{C}$ | $2862\,^\circ\text{C}$ |

Le temperature di ebollizione della tabella sono quelle alla pressione atmosferica normale, $1\,\text{atm}$.

## Lo stato di una sostanza a una temperatura

Le due temperature dividono la scala delle temperature in tre zone. Alla pressione normale una sostanza è solida sotto la sua temperatura di fusione ($t < t_f$), liquida tra la temperatura di fusione e quella di ebollizione ($t_f < t < t_e$), aeriforme sopra la temperatura di ebollizione ($t > t_e$).

```tikz
% nome: passaggi-stato-zone-temperatura
% alt: Quattro barre orizzontali, una per sostanza, su una scala di temperature da meno 250 a 400 gradi Celsius: ossigeno, etanolo, acqua e mercurio. Ogni barra è divisa in tre zone, solido a sinistra, liquido al centro, aeriforme a destra, separate dalla temperatura di fusione e da quella di ebollizione. Una linea tratteggiata verticale a 25 gradi, la temperatura ambiente, attraversa la zona aeriforme dell'ossigeno, quella liquida dell'etanolo, dell'acqua e del mercurio
% svg: passaggi-stato-zone-temperatura-54772a6c.svg 362x197
\begin{tikzpicture}
\foreach \n/\y/\f/\e in {ossigeno/3/-218/-183, etanolo/2.2/-114/78, acqua/1.4/0/100, mercurio/0.6/-39/357} {
\fill[blue!15] (0,\y) rectangle ({(\f+250)/100},\y+0.45);
\fill[cyan!25] ({(\f+250)/100},\y) rectangle ({(\e+250)/100},\y+0.45);
\fill[gray!12] ({(\e+250)/100},\y) rectangle (6.5,\y+0.45);
\draw[thin] (0,\y) rectangle (6.5,\y+0.45);
\draw[thin] ({(\f+250)/100},\y) -- ({(\f+250)/100},\y+0.45);
\draw[thin] ({(\e+250)/100},\y) -- ({(\e+250)/100},\y+0.45);
\node[left] at (0,\y+0.225) {\small \n};
}
\draw[->] (0,0.2) -- (6.8,0.2) node[right] {$t$ ($^\circ$C)};
\foreach \t in {-200,-100,0,100,200,300,400} \draw ({(\t+250)/100},0.26) -- ({(\t+250)/100},0.14) node[below] {\small $\t$};
\draw[dashed, thick, orange!90!black] (2.75,0.2) -- (2.75,3.75) node[above] {\small $25\,^\circ$C};
\fill[blue!15] (0.3,-0.75) rectangle (0.6,-0.5);
\draw[thin] (0.3,-0.75) rectangle (0.6,-0.5);
\node[right] at (0.6,-0.625) {\small solido};
\fill[cyan!25] (2.3,-0.75) rectangle (2.6,-0.5);
\draw[thin] (2.3,-0.75) rectangle (2.6,-0.5);
\node[right] at (2.6,-0.625) {\small liquido};
\fill[gray!12] (4.3,-0.75) rectangle (4.6,-0.5);
\draw[thin] (4.3,-0.75) rectangle (4.6,-0.5);
\node[right] at (4.6,-0.625) {\small aeriforme};
\end{tikzpicture}
```

```ad-example
Esempio 1: che stato a $25\,^\circ\text{C}$?
In quale stato si trovano a $25\,^\circ\text{C}$ e alla pressione normale l'ossigeno, il mercurio e il naftalene?

- L'ossigeno bolle a $-183\,^\circ\text{C}$: $25\,^\circ\text{C}$ è sopra la sua temperatura di ebollizione, quindi è aeriforme.
- Il mercurio fonde a $-39\,^\circ\text{C}$ e bolle a $357\,^\circ\text{C}$: $25\,^\circ\text{C}$ è tra le due, quindi è liquido. È l'unico metallo liquido a temperatura ambiente, ed è per questo che si usava nei termometri.
- Il naftalene fonde a $80\,^\circ\text{C}$: $25\,^\circ\text{C}$ è sotto, quindi è solido. È la sostanza delle palline di naftalina contro le tarme.
```

```ad-example
Esempio 2: da $-150$ a $90\,^\circ\text{C}$
Un campione di etanolo viene scaldato da $-150\,^\circ\text{C}$ a $90\,^\circ\text{C}$. Quali passaggi di stato avvengono?

A $-150\,^\circ\text{C}$ l'etanolo è solido, perché è sotto la sua temperatura di fusione, $-114\,^\circ\text{C}$. Scaldandolo, a $-114\,^\circ\text{C}$ fonde; poi il liquido si scalda fino a $78\,^\circ\text{C}$, dove bolle; sopra $78\,^\circ\text{C}$ è vapore. Avvengono quindi una fusione e poi una vaporizzazione, per ebollizione. Raffreddandolo da $90$ a $-150\,^\circ\text{C}$ avverrebbero i passaggi inversi, nell'ordine inverso: prima la condensazione a $78\,^\circ\text{C}$, poi la solidificazione a $-114\,^\circ\text{C}$.
```

```ad-warning
Alla temperatura di fusione, solido o liquido?
Esattamente alla temperatura di fusione una sostanza può essere solida, liquida, o tutte e due insieme, come il ghiaccio che galleggia nell'acqua a $0\,^\circ\text{C}$: dipende da quanta energia ha già ricevuto. La regola delle tre zone vale per le temperature diverse da quelle dei passaggi. Lo stesso vale alla temperatura di ebollizione, dove convivono liquido e vapore.
```

## Evaporazione ed ebollizione

La vaporizzazione avviene in due modi.

- L'**evaporazione** avviene a qualunque temperatura, e solo dalla superficie del liquido: le particelle vicino alla superficie che in quel momento sono più veloci della media riescono a sfuggire alle attrazioni delle altre e passano nell'aria. È il modo in cui si asciugano i panni stesi e le pozzanghere. Va più in fretta se la temperatura è più alta, se la superficie è più grande e se c'è vento, che porta via il vapore.
- L'**ebollizione** avviene solo alla temperatura di ebollizione, e in tutto il liquido: si formano bolle di vapore anche sul fondo, che salgono e scoppiano in superficie.

```tikz
% nome: passaggi-stato-evaporazione-ebollizione
% alt: Due becker con acqua. Nel primo, a temperatura ambiente, alcune particelle lasciano la superficie del liquido, indicate da frecce che puntano verso l'alto: è l'evaporazione, solo dalla superficie. Nel secondo, scaldato da una fiamma, ci sono bolle di vapore in tutto il liquido, anche sul fondo, che salgono verso la superficie: è l'ebollizione
% svg: passaggi-stato-evaporazione-ebollizione-1c7b1e7c.svg 259x154
\begin{tikzpicture}
\fill[cyan!20] (0.07,0.07) rectangle (1.93,1.5);
\draw[thin] (0.07,1.5) -- (1.93,1.5);
\draw[thick] (-0.1,2.3) -- (0,2.2) -- (0,0) -- (2,0) -- (2,2.2) -- (2.1,2.3);
\foreach \x/\y in {0.45/1.85,1.2/2.05,1.6/1.75} {\draw[fill=gray!40] (\x,\y) circle (0.08); \draw[-{Stealth}, thin] (\x,\y+0.1) -- (\x,\y+0.4);}
\node[below, align=center] at (1,-0.1) {\small evaporazione:\\ \small solo dalla superficie};
\fill[cyan!20] (3.57,0.07) rectangle (5.43,1.5);
\draw[thin] (3.57,1.5) -- (5.43,1.5);
\foreach \p/\r in {(3.9,0.25)/0.07,(4.4,0.45)/0.1,(5.0,0.2)/0.06,(4.1,0.85)/0.12,(4.9,0.75)/0.1,(4.5,1.2)/0.13,(3.85,1.25)/0.09,(5.15,1.3)/0.08} \draw[thin] \p circle (\r);
\draw[thick] (3.4,2.3) -- (3.5,2.2) -- (3.5,0) -- (5.5,0) -- (5.5,2.2) -- (5.6,2.3);
\draw[thick, orange!90!black, fill=orange!25] (4.5,-0.55) .. controls (4.35,-0.3) and (4.43,-0.2) .. (4.5,-0.1) .. controls (4.57,-0.2) and (4.65,-0.3) .. (4.5,-0.55);
\node[below, align=center] at (4.5,-0.6) {\small ebollizione:\\ \small bolle in tutto il liquido};
\end{tikzpicture}
```

Anche l'evaporazione assorbe calore, e lo prende dal liquido che resta e da quello che c'è intorno: per questo si ha freddo uscendo bagnati dall'acqua, e il sudore raffredda la pelle.

### La temperatura di ebollizione dipende dalla pressione

Una bolla di vapore si forma dentro il liquido solo se la pressione del vapore al suo interno riesce a vincere la pressione che il liquido e l'aria esercitano su di essa. Se la pressione esterna è più bassa, questo succede a una temperatura più bassa, e viceversa. In montagna la pressione atmosferica è minore, e l'acqua bolle sotto i $100\,^\circ\text{C}$: in cima al Monte Bianco, a circa $4800\,\text{m}$, bolle intorno a $85\,^\circ\text{C}$, e la pasta cuoce male. Nella pentola a pressione succede il contrario: il coperchio chiuso tiene il vapore dentro, la pressione sale fino a circa il doppio di quella atmosferica e l'acqua bolle intorno a $120\,^\circ\text{C}$, e il cibo cuoce più in fretta.

Per questo, quando si dà la temperatura di ebollizione di una sostanza come proprietà caratteristica, bisogna dire a quale pressione: le tabelle la danno alla pressione atmosferica normale, $1\,\text{atm}$. Anche la temperatura di fusione dipende dalla pressione, ma molto meno, e nella vita di tutti i giorni non se ne vedono gli effetti.

```ad-warning
Evaporazione ed ebollizione non sono sinonimi
Tutte e due sono vaporizzazione, ma l'evaporazione avviene a ogni temperatura e solo dalla superficie, l'ebollizione solo alla temperatura di ebollizione e in tutto il liquido. Una pozzanghera che si asciuga d'estate evapora: non bolle, perché è ben lontana da $100\,^\circ\text{C}$.
```

## Condensazione, sublimazione e brinamento

La condensazione è il passaggio da aeriforme a liquido. Il vapore acqueo che c'è sempre nell'aria condensa quando incontra una superficie fredda: si appannano lo specchio del bagno dopo la doccia e gli occhiali entrando d'inverno in una stanza calda, e si formano le goccioline su una bottiglia presa dal frigorifero. Le nuvole e la rugiada sono vapore acqueo condensato in goccioline. La condensazione del vapore è anche il passo finale della distillazione, nel refrigerante (lezione sui [metodi di separazione dei miscugli](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/metodi-di-separazione-dei-miscugli)).

La sublimazione è il passaggio diretto da solido ad aeriforme. Sublimano il ghiaccio secco, cioè anidride carbonica solida, $\mathrm{CO_2}$, che alla pressione atmosferica non diventa mai liquida e sublima a $-78\,^\circ\text{C}$; la naftalina, che profuma l'armadio perché le sue palline passano lentamente nell'aria; lo iodio, un solido grigio scuro che, scaldato piano in un becker, sublima in un vapore viola. Anche il ghiaccio sublima lentamente, ed è per questo che i cubetti dimenticati nel congelatore si rimpiccioliscono.

Il brinamento è il passaggio inverso, da aeriforme a solido. Nelle notti fredde il vapore dell'aria si deposita direttamente in cristalli di ghiaccio sull'erba e sui vetri delle auto: è la brina. Nell'esperimento dello iodio, se sopra il becker si mette un pallone pieno d'acqua fredda, il vapore viola brina sul fondo del pallone in cristalli lucidi di iodio, e si ottiene iodio più puro di quello di partenza: la sublimazione seguita dal brinamento è anche un metodo per purificare un solido.

```ad-note
Gas o vapore?
Nel linguaggio comune "gas" e "vapore" sono sinonimi. In chimica si chiama di solito vapore l'aeriforme di una sostanza che a temperatura ambiente è liquida o solida, come il vapore acqueo o il vapore di iodio, e gas quello di una sostanza che a temperatura ambiente è aeriforme, come l'ossigeno o l'azoto. La distinzione precisa usa la temperatura critica, che si studia più avanti.
```
