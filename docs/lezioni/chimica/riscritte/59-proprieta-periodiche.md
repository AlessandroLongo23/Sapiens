# Raggio atomico ed energia di ionizzazione

Il sodio ha un protone e un elettrone in più del neon, eppure per strappargli un elettrone serve meno di un quarto dell'energia. Passando da un elemento al successivo le proprietà degli atomi non cambiano a caso: salgono o scendono con regolarità lungo un periodo, poi ricominciano nel periodo dopo. Sono le **proprietà periodiche**. Questa lezione ne tratta due, il raggio atomico e l'energia di ionizzazione, che dipendono dalla stessa cosa: la forza con cui il nucleo trattiene gli elettroni più esterni.

## La carica nucleare efficace

Un elettrone esterno è attirato dal nucleo, che ha carica $+Z$, ma è anche respinto dagli altri elettroni. Quelli dei livelli più interni stanno quasi sempre tra lui e il nucleo, e ne nascondono una parte della carica: si dice che la **schermano**. La carica che l'elettrone esterno sente davvero, tolta la parte schermata, è la **carica nucleare efficace**, $Z_{eff}$.

Il modello più semplice conta come schermo solo gli elettroni interni, cioè quelli dei livelli sotto il livello più esterno, e fa contare ognuno per una carica intera:

$$Z_{eff} = Z - S$$

dove $S$ è il numero di elettroni interni. Per trovarlo serve la [configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica) dell'elemento.

```tikz
% nome: raggio-carica-nucleare-efficace
% alt: Due atomi a confronto, sodio e cloro. Nel sodio il nucleo ha carica più 11, attorno c'è una zona colorata con i 10 elettroni interni e fuori, su un cerchio tratteggiato, un solo elettrone esterno: la carica efficace è più 1. Nel cloro il nucleo ha carica più 17, la zona interna ha ancora 10 elettroni e sul cerchio tratteggiato, più stretto, ci sono 7 elettroni esterni: la carica efficace è più 7
\begin{tikzpicture}
\fill[blue!15] (0,0) circle (0.85);
\draw[thin] (0,0) circle (0.85);
\fill[red!70] (0,0) circle (0.22);
\node at (0,0.5) {\small $+11$};
\node at (0,-0.52) {\scriptsize $10\ e^-$};
\draw[dashed] (0,0) circle (1.75);
\fill[blue] (1.75,0) circle (2.2pt);
\node at (0,-2.2) {Na: $Z_{eff} = 11 - 10 = +1$};
\begin{scope}[shift={(5.2,0)}]
\fill[blue!15] (0,0) circle (0.7);
\draw[thin] (0,0) circle (0.7);
\fill[red!70] (0,0) circle (0.22);
\node at (0,0.44) {\small $+17$};
\node at (0,-0.45) {\scriptsize $10\ e^-$};
\draw[dashed] (0,0) circle (1.15);
\foreach \a in {0,51,103,154,206,257,309} \fill[blue] (\a:1.15) circle (2.2pt);
\node at (0,-2.2) {Cl: $Z_{eff} = 17 - 10 = +7$};
\end{scope}
\end{tikzpicture}
```

Il sodio, $[\text{Ne}]\,3s^1$, ha $10$ elettroni interni e uno esterno, che sente una carica $+1$. Il cloro, $[\text{Ne}]\,3s^2\,3p^5$, ha gli stessi $10$ elettroni interni, ma il suo nucleo ha sei protoni in più: ognuno dei suoi sette elettroni esterni sente una carica $+7$.

```ad-example
Esempio 1: la carica nucleare efficace di magnesio e zolfo
Il magnesio ha $Z = 12$ e configurazione $[\text{Ne}]\,3s^2$. Gli elettroni interni sono i $10$ del neon:

$$Z_{eff} = 12 - 10 = +2$$

Lo zolfo ha $Z = 16$ e configurazione $[\text{Ne}]\,3s^2\,3p^4$. Gli elettroni interni sono ancora $10$:

$$Z_{eff} = 16 - 10 = +6$$

Gli elettroni esterni dello zolfo sono attirati dal nucleo con una carica tripla di quelli del magnesio.
```

Dall'esempio escono le due regole che servono per tutta la lezione, valide per gli elementi dei gruppi principali (i gruppi $1$, $2$ e da $13$ a $18$):

- lungo un periodo, da sinistra a destra, $Z_{eff}$ cresce di uno a ogni elemento, perché si aggiunge un protone e gli elettroni interni restano gli stessi;
- scendendo lungo un gruppo, $Z_{eff}$ resta uguale, ma gli elettroni esterni stanno in un livello con $n$ più grande, quindi più lontano dal nucleo.

```ad-note
Un modello, con il suo limite
Anche gli elettroni dello stesso livello si schermano un poco tra loro, e quelli interni non schermano in modo perfetto. Con un conto più fine l'elettrone esterno del sodio sente circa $+2{,}2$ e quelli del cloro circa $+6{,}1$. I numeri cambiano, l'andamento no: $Z_{eff}$ cresce lungo il periodo.
```

```ad-warning
La carica efficace non è la carica del nucleo
Il nucleo del cloro ha carica $+17$, non $+7$. La carica efficace è quella che sentono gli elettroni esterni, e si calcola togliendo gli elettroni interni, non tutti gli elettroni: con $17 - 17$ verrebbe zero, e l'atomo non terrebbe i suoi elettroni.
```

## Il raggio atomico

Un atomo non ha un bordo: la nuvola degli elettroni sfuma (lezione [Orbitali e numeri quantici](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/orbitali-e-numeri-quantici)). Per dargli una dimensione si misura la distanza tra i nuclei di due atomi uguali legati tra loro e la si divide per due. Il **raggio atomico** è la metà di questa distanza, e si misura in picometri ($1\,\text{pm} = 10^{-12}\,\text{m}$). Nella molecola $\mathrm{Cl_2}$ i due nuclei distano circa $198\,\text{pm}$: il raggio atomico del cloro è $99\,\text{pm}$.

```tikz
% nome: raggio-atomico-periodi-gruppi
% alt: Gli atomi dei gruppi 1, 2, 13, 14, 15, 16 e 17 nel secondo e nel terzo periodo, disegnati come cerchi in scala con il raggio in picometri. Secondo periodo: litio 133, berillio 102, boro 85, carbonio 75, azoto 71, ossigeno 63, fluoro 64. Terzo periodo: sodio 155, magnesio 139, alluminio 126, silicio 116, fosforo 111, zolfo 103, cloro 99. I cerchi rimpiccioliscono da sinistra a destra e quelli del terzo periodo sono più grandi di quelli del secondo
\begin{tikzpicture}[x=1.22cm, y=1.8cm]
\foreach \g/\n in {1/1,2/2,3/13,4/14,5/15,6/16,7/17} \node at (\g,-0.45) {\scriptsize \n};
\node[left] at (0.45,-0.45) {\scriptsize gruppo};
\foreach \g/\p/\s/\r/\c in {1/1/Li/133/0.466, 2/1/Be/102/0.357, 3/1/B/85/0.297, 4/1/C/75/0.263, 5/1/N/71/0.248, 6/1/O/63/0.221, 7/1/F/64/0.224, 1/2/Na/155/0.542, 2/2/Mg/139/0.486, 3/2/Al/126/0.441, 4/2/Si/116/0.406, 5/2/P/111/0.389, 6/2/S/103/0.360, 7/2/Cl/99/0.347} {
\draw[thick, fill=blue!12] (\g,-\p) circle[radius=\c cm];
\node at (\g,-\p) {\scriptsize \s};
\node at (\g,-\p-0.42) {\tiny \r};
}
\end{tikzpicture}
```

La figura mostra due andamenti, e tutti e due si spiegano con la carica nucleare efficace.

Lungo un periodo il raggio diminuisce. Da sinistra a destra gli elettroni esterni restano nello stesso livello, mentre $Z_{eff}$ cresce: il nucleo li tira più forte e la nuvola si stringe. Nel terzo periodo si passa dai $155\,\text{pm}$ del sodio ai $99\,\text{pm}$ del cloro.

Lungo un gruppo il raggio aumenta. Scendendo, $Z_{eff}$ non cambia, ma a ogni periodo gli elettroni esterni occupano un livello in più, più lontano dal nucleo. Nel gruppo $1$ (IA):

| Elemento | $\mathrm{Li}$ | $\mathrm{Na}$ | $\mathrm{K}$ | $\mathrm{Rb}$ | $\mathrm{Cs}$ |
|---|---|---|---|---|---|
| Livello esterno | $n = 2$ | $n = 3$ | $n = 4$ | $n = 5$ | $n = 6$ |
| Raggio (pm) | $133$ | $155$ | $196$ | $210$ | $232$ |

Gli atomi più grandi stanno quindi in basso a sinistra nella tavola, i più piccoli in alto a destra. I valori di ogni elemento sono nella [tavola periodica](/strumenti/tavola-periodica) del sito.

```ad-warning
Più elettroni non vuol dire atomo più grande
Il cloro ha sei elettroni più del sodio ed è molto più piccolo: gli elettroni in più sono entrati nello stesso livello, e i sei protoni in più li hanno avvicinati tutti. Il raggio cresce quando si apre un livello nuovo, non quando aumenta il numero di elettroni.
```

```ad-example
Esempio 2: mettere in ordine di raggio
Disponi in ordine di raggio crescente $\mathrm{S}$, $\mathrm{Mg}$, $\mathrm{Cl}$ e $\mathrm{Na}$.

I quattro elementi sono tutti nel terzo periodo, nei gruppi $1$ ($\mathrm{Na}$), $2$ ($\mathrm{Mg}$), $16$ ($\mathrm{S}$) e $17$ ($\mathrm{Cl}$). Lungo un periodo il raggio diminuisce da sinistra a destra, quindi il più piccolo è quello più a destra:

$$\mathrm{Cl} < \mathrm{S} < \mathrm{Mg} < \mathrm{Na}$$

I valori lo confermano: $99$, $103$, $139$ e $155\,\text{pm}$.
```

```ad-example
Esempio 3: due elementi né nello stesso periodo né nello stesso gruppo
È più grande l'atomo di potassio o quello di zolfo?

Il potassio è nel quarto periodo e nel gruppo $1$, lo zolfo nel terzo periodo e nel gruppo $16$. Il potassio sta più in basso e più a sinistra: tutte e due le regole dicono che è più grande. Infatti il suo raggio è $196\,\text{pm}$, quello dello zolfo $103\,\text{pm}$.

Quando le due regole vanno in versi opposti, come per il litio (più in alto, più a sinistra) e il cloro, la posizione non decide: servono i valori. Qui $133\,\text{pm}$ contro $99\,\text{pm}$.
```

Nella figura che segue puoi scegliere un periodo o un gruppo e vedere come cambia il raggio, elemento per elemento, accanto alla carica nucleare efficace e al livello esterno. La stessa figura mostra l'energia di ionizzazione, di cui parla la seconda parte della lezione.

```interattivo
% nome: raggio-ionizzazione-andamenti
% alt: Un grafico a colonne degli elementi di un periodo o di un gruppo della tavola periodica, da scegliere. Si sceglie anche la grandezza: il raggio atomico in picometri, con gli atomi disegnati in scala sotto le colonne, oppure l'energia di prima ionizzazione in chilojoule alla mole. Toccando un elemento si leggono il suo valore, la carica nucleare efficace e il livello esterno
```

Nel terzo periodo le colonne del raggio scendono senza interruzioni, mentre $Z_{eff}$ sale da $+1$ a $+7$ con il livello esterno fermo a $n = 3$. Nel gruppo $1$ succede il contrario: $Z_{eff}$ resta $+1$, il livello esterno sale e le colonne con lui. Nel secondo periodo ossigeno e fluoro hanno quasi lo stesso raggio, $63$ e $64\,\text{pm}$: una differenza più piccola dell'incertezza con cui si definisce il raggio di un atomo.

```ad-note
I gas nobili restano fuori dal confronto
Gli atomi dei gas nobili non si legano tra loro, quindi la distanza tra due nuclei legati non si può misurare: il loro raggio si ricava in un altro modo, e non si confronta con quello degli altri elementi del periodo.
```

## Il raggio degli ioni

Un atomo che perde o acquista elettroni diventa uno ione (lezione [Atomi, molecole e ioni](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/atomi-molecole-e-ioni)), e cambia dimensione. Il raggio di uno ione si chiama **raggio ionico**.

Un catione è più piccolo del suo atomo. Il sodio, perdendo l'elettrone $3s^1$, resta con la configurazione del neon: il terzo livello si svuota, e gli elettroni rimasti sono attirati dagli stessi $11$ protoni. Un anione è più grande del suo atomo. Il cloro acquista un elettrone nello stesso livello: i protoni restano $17$, gli elettroni diventano $18$ e si respingono di più, e la nuvola si allarga.

```tikz
% nome: raggio-ionico-atomo-ione
% alt: Quattro cerchi in scala. A sinistra l'atomo di sodio, raggio 155 picometri, e accanto il catione sodio, molto più piccolo, 102 picometri. A destra l'atomo di cloro, 99 picometri, e accanto l'anione cloruro, molto più grande, 181 picometri
\begin{tikzpicture}
\draw[thick, fill=blue!12] (0,0) circle (0.93);
\node at (0,0) {Na};
\node at (0,-1.5) {\small $155$ pm};
\draw[-{Stealth}] (1.1,0) -- (1.6,0);
\draw[thick, fill=orange!25] (2.4,0) circle (0.61);
\node at (2.4,0) {\small Na$^+$};
\node at (2.4,-1.5) {\small $102$ pm};
\draw[thick, fill=blue!12] (5,0) circle (0.59);
\node at (5,0) {Cl};
\node at (5,-1.5) {\small $99$ pm};
\draw[-{Stealth}] (5.75,0) -- (6.25,0);
\draw[thick, fill=green!18] (7.5,0) circle (1.09);
\node at (7.5,0) {Cl$^-$};
\node at (7.5,-1.5) {\small $181$ pm};
\end{tikzpicture}
```

| Atomo | Raggio (pm) | Ione | Raggio (pm) |
|---|---|---|---|
| $\mathrm{Na}$ | $155$ | $\mathrm{Na^+}$ | $102$ |
| $\mathrm{Mg}$ | $139$ | $\mathrm{Mg^{2+}}$ | $72$ |
| $\mathrm{Al}$ | $126$ | $\mathrm{Al^{3+}}$ | $54$ |
| $\mathrm{O}$ | $63$ | $\mathrm{O^{2-}}$ | $140$ |
| $\mathrm{F}$ | $64$ | $\mathrm{F^-}$ | $133$ |
| $\mathrm{Cl}$ | $99$ | $\mathrm{Cl^-}$ | $181$ |

I cinque ioni $\mathrm{O^{2-}}$, $\mathrm{F^-}$, $\mathrm{Na^+}$, $\mathrm{Mg^{2+}}$ e $\mathrm{Al^{3+}}$ hanno tutti $10$ elettroni, la configurazione del neon: si chiamano **isoelettronici**. Eppure non hanno la stessa dimensione, perché gli stessi dieci elettroni sono attirati da un numero diverso di protoni.

```ad-example
Esempio 4: ordinare ioni isoelettronici
Disponi in ordine di raggio crescente $\mathrm{F^-}$, $\mathrm{Mg^{2+}}$, $\mathrm{O^{2-}}$ e $\mathrm{Na^+}$.

Tutti e quattro hanno $10$ elettroni. I protoni sono $8$ nell'ossigeno, $9$ nel fluoro, $11$ nel sodio e $12$ nel magnesio. Con gli stessi elettroni, più protoni vuol dire una nuvola più stretta: lo ione più piccolo è quello con $Z$ più grande.

$$\mathrm{Mg^{2+}} < \mathrm{Na^+} < \mathrm{F^-} < \mathrm{O^{2-}}$$

I raggi sono $72$, $102$, $133$ e $140\,\text{pm}$.
```

Qui puoi scegliere un elemento e passare dall'atomo al suo ione più comune: la figura disegna i due in scala e conta protoni ed elettroni.

```interattivo
% nome: raggio-atomo-ione-confronto
% alt: Un atomo e il suo ione più comune disegnati come cerchi in scala, uno accanto all'altro, per un elemento da scegliere tra litio, sodio, potassio, magnesio, calcio, alluminio, ossigeno, zolfo, fluoro, cloro e bromo. Sotto ogni cerchio ci sono il raggio in picometri, il numero di protoni e il numero di elettroni. I cationi sono più piccoli del loro atomo, gli anioni più grandi
```

I metalli della figura danno tutti un catione più piccolo dell'atomo, i non metalli un anione più grande, e in ogni coppia il numero di protoni non cambia: cambia solo quanti elettroni quei protoni devono trattenere.

```ad-warning
Lo ione positivo non è quello più grande
Il segno più indica elettroni in meno, non qualcosa in più: un catione ha perso elettroni ed è più piccolo dell'atomo. È l'anione, con il segno meno, ad avere elettroni in più e a essere più grande.
```

## L'energia di ionizzazione

Per strappare un elettrone a un atomo bisogna vincere l'attrazione del nucleo, e questo richiede energia. L'**energia di prima ionizzazione**, $E_i$, è l'energia necessaria per togliere l'elettrone più esterno a un atomo isolato, allo stato gassoso:

$$\mathrm{X}(g) \to \mathrm{X^+}(g) + e^-$$

Si misura in $\text{kJ/mol}$: è l'energia che serve per ionizzare una [mole](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare) di atomi. È sempre positiva, perché l'atomo l'energia la deve ricevere. Più è grande, più l'atomo trattiene il suo elettrone.

```ad-example
Esempio 5: l'energia per ionizzare un solo atomo
L'energia di prima ionizzazione del sodio è $495{,}8\,\text{kJ/mol}$. Quanta energia serve per un solo atomo?

Una mole contiene $N_A = 6{,}022 \cdot 10^{23}$ atomi. In joule, $495{,}8\,\text{kJ} = 4{,}958 \cdot 10^5\,\text{J}$:

$$\frac{4{,}958 \cdot 10^5\,\text{J/mol}}{6{,}022 \cdot 10^{23}\,\text{mol}^{-1}} = 8{,}233 \cdot 10^{-19}\,\text{J}$$

Per un atomo servono $8{,}233 \cdot 10^{-19}\,\text{J}$.
```

Il grafico mostra l'energia di prima ionizzazione dei primi venti elementi, in ordine di numero atomico.

```tikz
% nome: ionizzazione-prima-energia-grafico
% alt: Grafico dell'energia di prima ionizzazione, in chilojoule alla mole, in funzione del numero atomico per i primi venti elementi. La linea sale a zig zag dentro ogni periodo e crolla all'inizio del periodo successivo. I massimi sono i gas nobili: elio 2372, neon 2081, argon 1521. I minimi sono i metalli alcalini: litio 520, sodio 496, potassio 419. Dentro ogni periodo ci sono due piccole discese: dal berillio al boro e dall'azoto all'ossigeno, dal magnesio all'alluminio e dal fosforo allo zolfo
\begin{tikzpicture}
\draw[->] (0,0) -- (9,0) node[right] {$Z$};
\draw[->] (0,0) -- (0,4.5) node[above] {$E_i$ (kJ/mol)};
\foreach \y/\l in {0.833/500,1.667/1000,2.5/1500,3.333/2000} {
\draw[gray!30, very thin] (0,\y) -- (8.7,\y);
\node[left] at (0,\y) {\scriptsize \l};
}
\foreach \z in {2,10,18} \node[below] at (\z*0.42,0) {\scriptsize \z};
\draw[thick, blue] (0.42,2.187) -- (0.84,3.953) -- (1.26,0.867) -- (1.68,1.499) -- (2.10,1.334) -- (2.52,1.810) -- (2.94,2.337) -- (3.36,2.190) -- (3.78,2.802) -- (4.20,3.468) -- (4.62,0.826) -- (5.04,1.230) -- (5.46,0.963) -- (5.88,1.311) -- (6.30,1.687) -- (6.72,1.666) -- (7.14,2.085) -- (7.56,2.535) -- (7.98,0.698) -- (8.40,0.983);
\foreach \x/\y in {0.42/2.187, 0.84/3.953, 1.26/0.867, 1.68/1.499, 2.52/1.810, 2.94/2.337, 3.78/2.802, 4.20/3.468, 4.62/0.826, 5.04/1.230, 5.88/1.311, 6.30/1.687, 7.14/2.085, 7.56/2.535, 7.98/0.698, 8.40/0.983} \fill[blue] (\x,\y) circle (1.5pt);
\foreach \x/\y in {2.10/1.334, 3.36/2.190, 5.46/0.963, 6.72/1.666} \fill[red] (\x,\y) circle (2pt);
\node[above] at (0.84,3.953) {\scriptsize He};
\node[above] at (4.20,3.468) {\scriptsize Ne};
\node[above] at (7.56,2.535) {\scriptsize Ar};
\node[below] at (1.26,0.867) {\scriptsize Li};
\node[below] at (4.62,0.826) {\scriptsize Na};
\node[below] at (7.98,0.698) {\scriptsize K};
\node[left] at (0.42,2.187) {\scriptsize H};
\node[below] at (2.10,1.334) {\scriptsize B};
\node[below] at (3.36,2.190) {\scriptsize O};
\node[below] at (5.46,0.963) {\scriptsize Al};
\node[below] at (6.72,1.666) {\scriptsize S};
\end{tikzpicture}
```

Lungo un periodo l'energia di ionizzazione aumenta. Da sinistra a destra $Z_{eff}$ cresce e il raggio diminuisce: l'elettrone esterno è più vicino al nucleo e più attirato. Ogni periodo comincia con un minimo, il metallo alcalino, e finisce con un massimo, il gas nobile.

Lungo un gruppo l'energia di ionizzazione diminuisce. Scendendo, l'elettrone esterno è sempre più lontano dal nucleo, con la stessa $Z_{eff}$: toglierlo costa meno. Nel gruppo $1$ si va dai $520{,}2\,\text{kJ/mol}$ del litio ai $375{,}7\,\text{kJ/mol}$ del cesio.

L'energia di ionizzazione va quindi al contrario del raggio: gli atomi piccoli trattengono bene i loro elettroni, quelli grandi li perdono con poca spesa.

### Le due eccezioni lungo il periodo

I punti rossi del grafico sono quattro discese dove ci si aspetterebbe una salita. Si ripetono uguali nel secondo e nel terzo periodo, e hanno due cause diverse.

Tra il gruppo $2$ e il gruppo $13$: il boro ($800{,}6\,\text{kJ/mol}$) ha un'energia di ionizzazione più bassa del berillio ($899{,}5$), e l'alluminio ($577{,}6$) più bassa del magnesio ($737{,}7$). L'elettrone che si toglie al berillio è un $2s$; quello del boro è il primo elettrone $2p$, che ha un'energia più alta del $2s$ ed è schermato anche dai due elettroni $2s$. Costa meno toglierlo.

Tra il gruppo $15$ e il gruppo $16$: l'ossigeno ($1314\,\text{kJ/mol}$) sta sotto l'azoto ($1402$), e lo zolfo ($999{,}6$) sotto il fosforo ($1012$). L'azoto ha tre elettroni $2p$, uno per orbitale. Il quarto elettrone dell'ossigeno deve entrare in un orbitale già occupato, e i due elettroni nello stesso orbitale si respingono: toglierne uno è un po' più facile.

```ad-warning
L'andamento non è una regola senza eccezioni
"L'energia di ionizzazione cresce lungo il periodo" vale per l'andamento generale. Per due elementi vicini bisogna controllare se sono una delle due coppie che fanno eccezione: gruppi $2$ e $13$, gruppi $15$ e $16$.
```

```ad-example
Esempio 6: chi ha l'energia di ionizzazione più alta
Per ogni coppia, quale elemento ha l'energia di prima ionizzazione maggiore? a) $\mathrm{Na}$ e $\mathrm{Cl}$; b) $\mathrm{F}$ e $\mathrm{I}$; c) $\mathrm{Mg}$ e $\mathrm{Al}$.

a) Stesso periodo, il cloro è più a destra: ha l'energia maggiore ($1251$ contro $495{,}8\,\text{kJ/mol}$).

b) Stesso gruppo, il fluoro è più in alto: ha l'energia maggiore ($1681$ contro $1008\,\text{kJ/mol}$).

c) Stesso periodo, e l'alluminio è più a destra, ma i gruppi sono il $2$ e il $13$: è la prima eccezione. L'energia maggiore è quella del magnesio ($737{,}7$ contro $577{,}6\,\text{kJ/mol}$).
```

## Le energie di ionizzazione successive

Dopo il primo elettrone se ne può togliere un secondo, poi un terzo. L'**energia di seconda ionizzazione** è quella che serve per togliere un elettrone allo ione $\mathrm{X^+}$:

$$\mathrm{X^+}(g) \to \mathrm{X^{2+}}(g) + e^-$$

Ogni energia successiva è più grande della precedente, perché l'elettrone va tolto a uno ione sempre più positivo, in cui gli stessi protoni trattengono meno elettroni. La crescita però non è regolare.

| Elemento | Prima | Seconda | Terza | Quarta |
|---|---|---|---|---|
| $\mathrm{Na}$ | $496$ | $4562$ | $6910$ | $9543$ |
| $\mathrm{Mg}$ | $738$ | $1451$ | $7733$ | $10\,543$ |
| $\mathrm{Al}$ | $578$ | $1817$ | $2745$ | $11\,577$ |

I valori sono in $\text{kJ/mol}$. In ogni riga c'è un salto: dopo il primo elettrone per il sodio, dopo il secondo per il magnesio, dopo il terzo per l'alluminio. Il salto arriva quando sono finiti gli elettroni del livello esterno e si comincia a togliere quelli interni, molto più vicini al nucleo e molto meno schermati. Il numero di elettroni che vengono via prima del salto è il numero degli elettroni di valenza (lezione [Elettroni di valenza e simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis)).

Per questo il sodio forma lo ione $\mathrm{Na^+}$ e mai $\mathrm{Na^{2+}}$, e il magnesio si ferma a $\mathrm{Mg^{2+}}$: il passo successivo costerebbe un'energia che nessuna reazione chimica restituisce. Sono gli stessi salti che dimostrano l'esistenza dei livelli di energia (lezione [Livelli e sottolivelli di energia](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/livelli-e-sottolivelli-di-energia)).

```ad-example
Esempio 7: riconoscere il gruppo dalle energie successive
Un elemento del terzo periodo ha queste energie di ionizzazione, in $\text{kJ/mol}$: $578$, $1817$, $2745$, $11\,577$. In quale gruppo si trova?

Si confronta ogni energia con la precedente:

$$\frac{1817}{578} \approx 3{,}1 \qquad \frac{2745}{1817} \approx 1{,}5 \qquad \frac{11\,577}{2745} \approx 4{,}2$$

Il rapporto più grande, e la differenza di gran lunga più grande ($8832\,\text{kJ/mol}$), è tra la terza e la quarta. I primi tre elettroni sono del livello esterno, il quarto è interno: gli elettroni di valenza sono $3$ e l'elemento è nel gruppo $13$. È l'alluminio.
```

```ad-warning
Il salto si cerca nelle differenze, non nel primo aumento
Le energie successive crescono sempre, e la seconda è spesso due o tre volte la prima anche senza cambiare livello. Il salto vero è quello in cui l'energia aumenta di migliaia di $\text{kJ/mol}$ in un colpo: se ti fermi al primo aumento, attribuisci all'alluminio un solo elettrone di valenza.
```

## Gli andamenti in uno schema

```tikz
% nome: raggio-ionizzazione-andamenti-tavola
% alt: Lo schema della tavola periodica, un rettangolo con l'incavo in alto, con quattro frecce. Per il raggio atomico una freccia verso il basso lungo il lato sinistro e una verso sinistra lungo il lato inferiore: il raggio aumenta scendendo e andando a sinistra. Per l'energia di ionizzazione una freccia verso l'alto lungo il lato destro e una verso destra lungo il lato superiore: l'energia aumenta salendo e andando a destra
\begin{tikzpicture}
\draw[thick, fill=gray!12] (0,0) -- (7.2,0) -- (7.2,2.8) -- (6.8,2.8) -- (6.8,2.4) -- (4.8,2.4) -- (4.8,1.6) -- (0.8,1.6) -- (0.8,2.4) -- (0.4,2.4) -- (0.4,2.8) -- (0,2.8) -- cycle;
\draw[-{Stealth}, thick, blue] (-0.35,2.8) -- (-0.35,0);
\draw[-{Stealth}, thick, blue] (7.2,-0.35) -- (0,-0.35);
\node[blue, below] at (3.6,-0.4) {\small il raggio atomico aumenta};
\draw[-{Stealth}, thick, red] (7.55,0) -- (7.55,2.8);
\draw[-{Stealth}, thick, red] (0,3.15) -- (7.2,3.15);
\node[red, above] at (3.6,3.2) {\small l'energia di ionizzazione aumenta};
\node at (3.6,0.8) {\small tavola periodica};
\end{tikzpicture}
```

Le due grandezze vanno in versi opposti, e la causa è una sola. Dove la carica nucleare efficace è grande e il livello esterno è vicino al nucleo, in alto a destra, gli atomi sono piccoli e non cedono elettroni. Dove è piccola e il livello esterno è lontano, in basso a sinistra, gli atomi sono grandi e cedono elettroni con poca energia. Con gli stessi due ingredienti si spiegano le proprietà della lezione [Affinità elettronica ed elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita).
