# Metalli, non metalli e semimetalli

Il rame di un filo elettrico, il ferro di una trave, l'oro di un anello si riconoscono come metalli a colpo d'occhio; lo zolfo giallo e friabile, o l'ossigeno dell'aria, no. Più di tre elementi su quattro sono metalli, e la tavola periodica li separa dagli altri con una linea a scala. La divisione non è arbitraria: viene dalle proprietà periodiche, cioè da quanto facilmente un atomo perde i suoi elettroni esterni.

## Dove stanno nella tavola

```tikz
% nome: metalli-tavola-tre-classi
% alt: La tavola periodica dei primi sei periodi, con i gruppi da 1 a 18, e ogni casella colorata secondo la classe dell'elemento. I metalli occupano tutta la parte sinistra e centrale e scendono verso destra in basso, fino a bismuto. I non metalli stanno in alto a destra: idrogeno, carbonio, azoto, ossigeno, fosforo, zolfo, selenio, gli alogeni e i gas nobili. Tra i due, lungo una linea spessa a scala che scende dal boro al polonio, stanno i semimetalli: boro, silicio, germanio, arsenico, antimonio, tellurio e polonio. Una casella con l'asterisco nel sesto periodo indica i lantanidi
\begin{tikzpicture}[x=0.5cm, y=0.6cm]
\foreach \g in {1,...,18} \node at (\g,-0.25) {\tiny \g};
\foreach \p in {1,...,6} \node at (0.1,-\p) {\tiny \p};
\foreach \g/\p/\s in {1/2/Li, 2/2/Be, 1/3/Na, 2/3/Mg, 13/3/Al, 1/4/K, 2/4/Ca, 3/4/Sc, 4/4/Ti, 5/4/V, 6/4/Cr, 7/4/Mn, 8/4/Fe, 9/4/Co, 10/4/Ni, 11/4/Cu, 12/4/Zn, 13/4/Ga, 1/5/Rb, 2/5/Sr, 3/5/Y, 4/5/Zr, 5/5/Nb, 6/5/Mo, 7/5/Tc, 8/5/Ru, 9/5/Rh, 10/5/Pd, 11/5/Ag, 12/5/Cd, 13/5/In, 14/5/Sn, 1/6/Cs, 2/6/Ba, 4/6/Hf, 5/6/Ta, 6/6/W, 7/6/Re, 8/6/Os, 9/6/Ir, 10/6/Pt, 11/6/Au, 12/6/Hg, 13/6/Tl, 14/6/Pb, 15/6/Bi} {
\draw[thin, fill=blue!12] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\foreach \g/\p/\s in {13/2/B, 14/3/Si, 14/4/Ge, 15/4/As, 15/5/Sb, 16/5/Te, 16/6/Po} {
\draw[thin, fill=orange!50] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\foreach \g/\p/\s in {1/1/H, 18/1/He, 14/2/C, 15/2/N, 16/2/O, 17/2/F, 18/2/Ne, 15/3/P, 16/3/S, 17/3/Cl, 18/3/Ar, 16/4/Se, 17/4/Br, 18/4/Kr, 17/5/I, 18/5/Xe, 17/6/At, 18/6/Rn} {
\draw[thin, fill=green!25] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p) {\scriptsize \s};
}
\draw[thin, fill=blue!12] (2.5,-6.5) rectangle (3.5,-5.5);
\node at (3,-6) {\scriptsize $*$};
\draw[very thick] (12.5,-1.5) -- (12.5,-2.5) -- (13.5,-2.5) -- (13.5,-4.5) -- (14.5,-4.5) -- (14.5,-5.5) -- (15.5,-5.5) -- (15.5,-6.5);
\draw[thin, fill=blue!12] (1.5,-7.6) rectangle (2.5,-7);
\node[right] at (2.6,-7.3) {\scriptsize metalli};
\draw[thin, fill=orange!50] (6.5,-7.6) rectangle (7.5,-7);
\node[right] at (7.6,-7.3) {\scriptsize semimetalli};
\draw[thin, fill=green!25] (12.5,-7.6) rectangle (13.5,-7);
\node[right] at (13.6,-7.3) {\scriptsize non metalli};
\end{tikzpicture}
```

I **metalli** occupano tutta la parte sinistra e il centro della tavola, e in basso, nel sesto periodo, arrivano fino al gruppo $15$. I **non metalli** stanno in alto a destra, più l'idrogeno, che per la sua configurazione $1s^1$ è nel gruppo $1$ ma non è un metallo. Lungo il confine, che scende a scala dal boro al polonio, si trovano i **semimetalli**, con proprietà intermedie: boro, silicio, germanio, arsenico, antimonio, tellurio e polonio.

Con i lantanidi e gli attinidi, che la figura non mostra, i metalli sono $91$ su $118$ elementi; i non metalli sono $20$ e i semimetalli $7$.

```ad-note
Un confine che i libri non disegnano tutti uguale
Sui primi sei semimetalli tutti sono d'accordo. Il polonio per alcuni libri è un metallo, e l'astato, qui tra i non metalli con gli altri alogeni, per alcuni è un semimetallo: sono elementi radioattivi e rarissimi, di cui si conosce poco.
```

## Le proprietà dei metalli

Un metallo si riconosce da un gruppo di proprietà fisiche che compaiono insieme:

- è lucente, cioè riflette la luce quando la superficie è pulita;
- conduce bene la corrente elettrica e il calore;
- è **malleabile**, cioè si lascia ridurre in lamine sottili, ed è **duttile**, cioè si lascia tirare in fili, senza rompersi;
- a temperatura ambiente è solido, con la sola eccezione del mercurio, che fonde a $-38{,}8\,^\circ\text{C}$.

Dal punto di vista chimico, gli atomi dei metalli hanno pochi elettroni esterni, un'energia di ionizzazione bassa e un'elettronegatività bassa. Nelle reazioni perdono elettroni e diventano ioni positivi: $\mathrm{Na^+}$, $\mathrm{Mg^{2+}}$, $\mathrm{Al^{3+}}$. Con l'ossigeno formano ossidi basici (lezione [Ossidi basici e ossidi acidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/ossidi-basici-e-ossidi-acidi)).

Lucentezza, conduzione e malleabilità hanno una causa comune: nel metallo solido gli elettroni esterni non restano legati al loro atomo e si muovono per tutto il pezzo. Come questo avvenga lo spiega la lezione [Il legame metallico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-metallico).

## Le proprietà dei non metalli

I non metalli hanno le proprietà opposte:

- non sono lucenti;
- non conducono la corrente e conducono male il calore (fa eccezione la grafite, una forma del carbonio, che conduce la corrente);
- da solidi sono fragili: sotto un colpo si rompono, non si deformano;
- a temperatura ambiente molti sono gas ($\mathrm{H_2}$, $\mathrm{N_2}$, $\mathrm{O_2}$, $\mathrm{F_2}$, $\mathrm{Cl_2}$ e i gas nobili), uno è liquido (il bromo), gli altri sono solidi (carbonio, fosforo, zolfo, selenio, iodio).

Tranne l'idrogeno e l'elio, i loro atomi hanno molti elettroni esterni, da quattro a otto; tutti hanno un'energia di ionizzazione alta e un'elettronegatività alta. Nelle reazioni con i metalli acquistano elettroni e diventano ioni negativi, come $\mathrm{Cl^-}$ e $\mathrm{O^{2-}}$; tra loro mettono gli elettroni in comune e formano molecole. Con l'ossigeno formano ossidi acidi.

## I semimetalli

I semimetalli hanno in genere l'aspetto di un metallo e il comportamento di un non metallo: il silicio è grigio e lucente, ma è fragile e conduce poco. La loro conducibilità è intermedia, e soprattutto cambia al contrario di quella dei metalli: un metallo scaldato conduce peggio, un semimetallo come il silicio o il germanio conduce meglio. Per questo si chiamano anche **semiconduttori**, e sono il materiale dei circuiti elettronici.

| | Metalli | Semimetalli | Non metalli |
|---|---|---|---|
| Aspetto | lucenti | lucenti | opachi |
| Corrente elettrica | la conducono bene | la conducono poco | non la conducono |
| Sotto un colpo | si deformano | si rompono | si rompono (se solidi) |
| Stato a $25\,^\circ\text{C}$ | solidi (tranne $\mathrm{Hg}$) | solidi | gas, solidi, un liquido ($\mathrm{Br_2}$) |
| Energia di ionizzazione | bassa | intermedia | alta |
| Elettronegatività | bassa | intermedia | alta |
| Nelle reazioni | perdono elettroni | dipende dal partner | acquistano o condividono elettroni |

```ad-example
Esempio 1: riconoscere la classe dalle proprietà
Un elemento è un solido grigio e lucente. Colpito con un martello va in frantumi, e conduce la corrente molto meno del rame, ma sempre meglio man mano che lo si scalda. Che cos'è?

La lucentezza farebbe pensare a un metallo, ma un metallo sotto il martello si schiaccia e non si rompe, e scaldato conduce peggio. Lucente, fragile, conduttore mediocre che migliora con la temperatura: è un semimetallo. Potrebbe essere il silicio.
```

```ad-warning
La lucentezza da sola non fa un metallo
Anche il silicio e lo iodio solido luccicano. Per decidere servono più proprietà insieme: un metallo è lucente, conduce bene e si deforma senza rompersi. E non tutti i metalli sono duri e pesanti: il sodio si taglia con un coltello e galleggia sull'acqua.
```

## Il carattere metallico

La divisione in tre classi è comoda, ma il passaggio da metallo a non metallo è graduale. Il **carattere metallico** è la tendenza di un elemento a perdere elettroni e a formare ioni positivi. È tanto più forte quanto più facilmente l'atomo cede i suoi elettroni esterni, quindi segue gli andamenti della lezione [Raggio atomico ed energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione), al contrario:

- lungo un periodo, da sinistra a destra, il carattere metallico diminuisce, perché la carica nucleare efficace cresce e gli elettroni esterni sono trattenuti di più;
- lungo un gruppo, dall'alto in basso, il carattere metallico aumenta, perché gli elettroni esterni sono più lontani dal nucleo.

```tikz
% nome: metalli-carattere-metallico-andamento
% alt: Lo schema della tavola periodica, un rettangolo con l'incavo in alto, con due frecce: una verso sinistra sotto la tavola e una verso il basso sul lato sinistro. Il carattere metallico aumenta andando a sinistra e scendendo. Nell'angolo in basso a sinistra c'è il cesio, nell'angolo in alto a destra il fluoro
\begin{tikzpicture}
\draw[thick, fill=gray!12] (0,0) -- (7.2,0) -- (7.2,2.8) -- (6.8,2.8) -- (6.8,2.4) -- (4.8,2.4) -- (4.8,1.6) -- (0.8,1.6) -- (0.8,2.4) -- (0.4,2.4) -- (0.4,2.8) -- (0,2.8) -- cycle;
\draw[-{Stealth}, thick, blue] (-0.35,2.8) -- (-0.35,0);
\draw[-{Stealth}, thick, blue] (7.2,-0.35) -- (0,-0.35);
\node[blue, below] at (3.6,-0.4) {\small il carattere metallico aumenta};
\node at (6.6,2.05) {\small F};
\node at (0.25,0.3) {\small Cs};
\end{tikzpicture}
```

Il terzo periodo mostra tutto il passaggio: sodio, magnesio e alluminio sono metalli, il silicio è un semimetallo, fosforo, zolfo e cloro sono non metalli. Il gruppo $14$ (IVA) lo mostra in verticale: il carbonio è un non metallo, silicio e germanio sono semimetalli, stagno e piombo sono metalli.

Gli elementi con il carattere metallico più forte sono in basso a sinistra, il cesio e il francio; quelli che ne hanno meno sono in alto a destra.

```ad-example
Esempio 2: ordinare per carattere metallico
Disponi in ordine di carattere metallico crescente $\mathrm{Mg}$, $\mathrm{S}$, $\mathrm{Na}$ e $\mathrm{Si}$.

Sono tutti nel terzo periodo, nei gruppi $2$, $16$, $1$ e $14$. Lungo un periodo il carattere metallico diminuisce verso destra, quindi cresce da destra verso sinistra:

$$\mathrm{S} < \mathrm{Si} < \mathrm{Mg} < \mathrm{Na}$$

Le energie di ionizzazione lo confermano, in ordine decrescente: $999{,}6$, $786{,}5$, $737{,}7$ e $495{,}8\,\text{kJ/mol}$.
```

```ad-example
Esempio 3: stesso gruppo
Ha un carattere metallico più forte il potassio o il litio? E tra l'azoto e il bismuto, che stanno tutti e due nel gruppo $15$?

Lungo un gruppo il carattere metallico aumenta scendendo. Il potassio (quarto periodo) è più metallico del litio (secondo periodo): la sua energia di ionizzazione è $418{,}8\,\text{kJ/mol}$ contro $520{,}2$.

Nel gruppo $15$ la differenza è tale che cambia la classe: l'azoto, in cima, è un non metallo gassoso; il bismuto, in fondo, è un metallo.
```

Nella figura puoi toccare un elemento dei gruppi principali e leggere la sua classe, la sua famiglia e i due numeri da cui dipende il carattere metallico.

```interattivo
% nome: metalli-tavola-classi
% alt: I gruppi principali della tavola periodica, 1, 2 e da 13 a 18, per i primi sei periodi, con una fascia al centro per i metalli di transizione. Ogni casella ha il simbolo dell'elemento e un colore per la classe: metallo, semimetallo o non metallo; un selettore colora invece le famiglie. Toccando un elemento si leggono il nome, la classe, la famiglia, lo stato fisico a 25 gradi, l'energia di ionizzazione e l'elettronegatività, e una tacca si sposta su una scala dell'energia di ionizzazione
```

Spostandoti lungo una riga verso destra la tacca dell'energia di ionizzazione tende a salire e la classe passa da metallo a semimetallo a non metallo; scendendo lungo una colonna la tacca scende. Non c'è però un valore che separa i metalli dagli altri: il berillio, un metallo, ha un'energia di ionizzazione più alta del boro, un semimetallo. La classe dipende dall'insieme delle proprietà, non da un numero solo.

```ad-warning
Carattere metallico ed elettronegatività vanno in versi opposti
Il carattere metallico cresce dove l'energia di ionizzazione e l'elettronegatività diminuiscono: verso il basso e verso sinistra. Chi ricorda "tutto aumenta verso destra e verso l'alto" deve togliere dall'elenco il raggio atomico e il carattere metallico.
```

## Le famiglie di elementi

Alcuni gruppi contengono elementi così simili tra loro da avere un nome di famiglia, che hai incontrato nella lezione [La tavola periodica di Mendeleev](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-tavola-periodica-di-mendeleev). Ora la somiglianza si spiega: gli elementi di un gruppo hanno la stessa configurazione degli elettroni esterni (lezione [Gruppi, periodi e blocchi](/materiale/scuola-superiore/chimica/il-sistema-periodico/gruppi-periodi-e-blocchi)).

### I metalli alcalini

Sono gli elementi del gruppo $1$ (IA) senza l'idrogeno: litio, sodio, potassio, rubidio, cesio e francio. La configurazione esterna è $ns^1$: un solo elettrone, che perdono con grande facilità per dare ioni $1+$, come $\mathrm{Na^+}$ e $\mathrm{K^+}$.

Sono i metalli con il carattere metallico più forte. Sono teneri, poco densi (litio, sodio e potassio galleggiano sull'acqua) e fondono a temperature basse. Reagiscono con l'acqua formando un idrossido e idrogeno gassoso, e reagiscono con l'ossigeno dell'aria: si conservano immersi in olio di vaselina. In natura non si trovano mai come elementi, solo nei composti.

| | $\mathrm{Li}$ | $\mathrm{Na}$ | $\mathrm{K}$ | $\mathrm{Rb}$ | $\mathrm{Cs}$ |
|---|---|---|---|---|---|
| Energia di ionizzazione ($\text{kJ/mol}$) | $520{,}2$ | $495{,}8$ | $418{,}8$ | $403$ | $375{,}7$ |
| Temperatura di fusione ($^\circ\text{C}$) | $180{,}5$ | $97{,}8$ | $63{,}4$ | $39{,}3$ | $28{,}4$ |

Scendendo nel gruppo l'energia di ionizzazione cala, e la reazione con l'acqua diventa più violenta: il litio frizza, il sodio corre sulla superficie fondendo, il potassio si incendia.

### I metalli alcalino-terrosi

Sono gli elementi del gruppo $2$ (IIA): berillio, magnesio, calcio, stronzio, bario e radio. La configurazione esterna è $ns^2$, e gli ioni sono $2+$: $\mathrm{Mg^{2+}}$, $\mathrm{Ca^{2+}}$. Sono più duri e più densi dei metalli alcalini e fondono a temperature più alte; sono reattivi, ma meno degli alcalini dello stesso periodo, perché hanno un'energia di ionizzazione più alta.

### I metalli di transizione

Occupano i gruppi da $3$ a $12$, il blocco $d$: ferro, rame, zinco, argento, oro, e la maggior parte dei metalli di uso comune. Sono duri, densi, con temperature di fusione alte (il tungsteno fonde a $3422\,^\circ\text{C}$). A differenza dei metalli dei gruppi $1$ e $2$, molti formano ioni con cariche diverse, come $\mathrm{Fe^{2+}}$ e $\mathrm{Fe^{3+}}$, o $\mathrm{Cu^+}$ e $\mathrm{Cu^{2+}}$, e i loro composti sono spesso colorati.

### Gli alogeni

Sono gli elementi del gruppo $17$ (VIIA): fluoro, cloro, bromo, iodio e astato. La configurazione esterna è $ns^2\,np^5$: manca un elettrone per completare il livello. Sono i non metalli più reattivi. Come elementi formano molecole biatomiche: $\mathrm{F_2}$ e $\mathrm{Cl_2}$ sono gas, $\mathrm{Br_2}$ è un liquido, $\mathrm{I_2}$ è un solido. Con i metalli acquistano un elettrone e danno ioni $1-$, formando sali come $\mathrm{NaCl}$: il nome alogeno vuol dire "generatore di sali".

Il più reattivo è il fluoro, in cima al gruppo, e la reattività diminuisce scendendo: al contrario di quello che succede tra i metalli alcalini, perché qui conta la capacità di attirare un elettrone, non quella di perderlo.

### I gas nobili

Sono gli elementi del gruppo $18$ (VIIIA): elio, neon, argon, kripton, xeno e radon. Hanno il livello esterno completo, $ns^2\,np^6$ ($1s^2$ per l'elio), l'energia di ionizzazione più alta del loro periodo e nessuna tendenza ad acquistare elettroni. Sono gas formati da atomi singoli, e in condizioni ordinarie non reagiscono; solo dei più pesanti, come lo xeno, si conoscono alcuni composti, preparati a partire dal 1962.

```ad-example
Esempio 4: prevedere dal gruppo
Lo stronzio ($\mathrm{Sr}$) è nel gruppo $2$ e nel quinto periodo, il bromo ($\mathrm{Br}$) nel gruppo $17$ e nel quarto. Che ioni formano, e qual è la formula del loro composto?

Lo stronzio è un metallo alcalino-terroso: ha due elettroni esterni, $5s^2$, e li perde formando $\mathrm{Sr^{2+}}$. Il bromo è un alogeno: acquista un elettrone e forma $\mathrm{Br^-}$.

Per avere un composto neutro servono due ioni $\mathrm{Br^-}$ per ogni ione $\mathrm{Sr^{2+}}$: la formula è $\mathrm{SrBr_2}$, come $\mathrm{MgCl_2}$ e $\mathrm{CaCl_2}$.
```

```ad-warning
L'idrogeno non è un metallo alcalino
L'idrogeno sta nel gruppo $1$ perché ha un solo elettrone, ma è un non metallo: è un gas fatto di molecole $\mathrm{H_2}$, e la sua energia di ionizzazione, $1312\,\text{kJ/mol}$, è più del doppio di quella del litio. Allo stesso modo "gruppo $1$" e "metalli alcalini" non sono sinonimi.
```
