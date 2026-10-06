# Valenza e numero di ossidazione

Il ferro e l'ossigeno formano due composti diversi: uno nero, $\mathrm{FeO}$, e uno rosso, $\mathrm{Fe_2O_3}$, quello che dà il colore alla ruggine. Gli elementi sono gli stessi, le formule no. Per sapere quale formula scrivere, e poi che nome dare a ciascun composto, serve un numero che dica quanto ogni atomo "pesa" nel legame: prima la valenza, poi il numero di ossidazione, che la sostituisce e fa da base a tutta la nomenclatura.

## La valenza

La **valenza** di un elemento in un composto è il numero di elettroni che un suo atomo cede, acquista o mette in comune quando si lega. Nei composti con l'idrogeno si legge dalla formula: è il numero di atomi di idrogeno che un atomo dell'elemento lega.

| Composto | Formula | Valenza dell'elemento |
|---|---|---|
| acido cloridrico | $\mathrm{HCl}$ | cloro: $1$ |
| acqua | $\mathrm{H_2O}$ | ossigeno: $2$ |
| ammoniaca | $\mathrm{NH_3}$ | azoto: $3$ |
| metano | $\mathrm{CH_4}$ | carbonio: $4$ |

La valenza è un numero senza segno, e uno stesso elemento può averne più di una: il ferro ha valenza $2$ in $\mathrm{FeO}$ e $3$ in $\mathrm{Fe_2O_3}$. Viene dagli elettroni di valenza dell'atomo, quelli del livello più esterno, di cui parla la lezione [Elettroni di valenza e simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis).

La valenza però non dice da che parte vanno gli elettroni. In $\mathrm{HCl}$ e in $\mathrm{NaCl}$ il cloro ha valenza $1$, ma lo stesso vale per l'idrogeno e per il sodio, e la valenza non distingue chi gli elettroni li attira da chi li perde. Per questo oggi si usa un numero con il segno.

## Il numero di ossidazione

Il **numero di ossidazione** di un atomo in un composto è la carica che l'atomo avrebbe se gli elettroni di ogni legame fossero assegnati tutti all'atomo più elettronegativo. Si abbrevia n.o. e si scrive con il segno davanti: $+1$, $-2$.

L'[elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita) misura quanto un atomo attira gli elettroni di legame. Nell'acqua l'ossigeno ($\chi = 3{,}44$) è più elettronegativo dell'idrogeno ($\chi = 2{,}20$): le due coppie di legame si contano tutte all'ossigeno.

```tikz
% nome: ossidazione-elettroni-assegnati-acqua
% alt: La molecola d'acqua scritta con i puntini di Lewis: l'ossigeno al centro con due coppie solitarie, sopra e sotto, e una coppia di legame verso ciascuno dei due atomi di idrogeno ai lati. Una linea tratteggiata racchiude l'ossigeno con tutti gli otto elettroni, comprese le due coppie di legame. Sopra l'ossigeno c'è scritto meno 2, sopra ogni idrogeno più 1. Sotto, il conto: l'ossigeno conta 8 elettroni e ne ha 6 di valenza, 6 meno 8 uguale meno 2; l'idrogeno ne conta 0 e ne ha 1 di valenza, 1 meno 0 uguale più 1
\begin{tikzpicture}
\node at (0,0) {\Large O};
\node at (-1.6,0) {\Large H};
\node at (1.6,0) {\Large H};
\foreach \x in {-0.1,0.1} { \fill (\x,0.42) circle (1.3pt); \fill (\x,-0.42) circle (1.3pt); }
\foreach \y in {-0.1,0.1} { \fill (-0.7,\y) circle (1.3pt); \fill (0.7,\y) circle (1.3pt); }
\draw[dashed, blue] (0,0) ellipse (1.0 and 0.72);
\node[blue] at (0,1.05) {$-2$};
\node[red] at (-1.6,0.55) {$+1$};
\node[red] at (1.6,0.55) {$+1$};
\node at (0,-1.3) {\small O: conta $8$ elettroni, ne ha $6$ di valenza, $6 - 8 = -2$};
\node at (0,-1.85) {\small H: conta $0$ elettroni, ne ha $1$ di valenza, $1 - 0 = +1$};
\end{tikzpicture}
```

Un atomo di ossigeno libero ha $6$ elettroni di valenza; dopo l'assegnazione ne conta $8$, due in più, come se avesse carica $-2$. Ogni atomo di idrogeno resta senza il suo unico elettrone, come se avesse carica $+1$. I numeri di ossidazione nell'acqua sono $-2$ per l'ossigeno e $+1$ per l'idrogeno.

Negli altri tipi di legame il conto è lo stesso:

- in un [legame covalente puro](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente), tra due atomi uguali, gli elettroni sono divisi a metà e nessuno ne guadagna: in $\mathrm{Cl_2}$ il cloro ha n.o. $0$;
- in un [legame covalente polare](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo), come in $\mathrm{HCl}$, la coppia va al cloro: idrogeno $+1$, cloro $-1$;
- in un [composto ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico), come $\mathrm{NaCl}$, gli elettroni sono passati davvero da un atomo all'altro, e il numero di ossidazione è la carica dello ione: sodio $+1$, cloro $-1$.

```ad-warning
Il numero di ossidazione non è una carica vera
Nell'acqua non ci sono ioni $\mathrm{O^{2-}}$ e $\mathrm{H^+}$: gli elettroni sono condivisi, solo spostati verso l'ossigeno. Il numero di ossidazione è un conto fatto come se il legame fosse ionico. Per non confonderli si scrivono in due modi: la carica di uno ione con il numero prima del segno, $\mathrm{Fe^{3+}}$; il numero di ossidazione con il segno prima del numero, $+3$.
```

Il numero di ossidazione dice anche qual è la valenza: è il suo valore senza il segno. Il ferro con n.o. $+3$ ha valenza $3$.

## Le regole per assegnarlo

Disegnare i puntini di ogni molecola sarebbe lungo. Si usano otto regole, che vengono tutte dalla definizione. Sono in ordine di precedenza: quando due regole danno risultati incompatibili, vale quella che viene prima.

1. Un elemento non combinato ha n.o. $0$: $\mathrm{Na}$, $\mathrm{Fe}$, $\mathrm{O_2}$, $\mathrm{Cl_2}$, $\mathrm{S_8}$.
2. Uno ione fatto da un solo atomo ha come n.o. la sua carica: $+2$ in $\mathrm{Ca^{2+}}$, $-1$ in $\mathrm{Cl^-}$.
3. La somma dei n.o. di tutti gli atomi è $0$ in una molecola o in un'unità formula, ed è la carica in uno ione poliatomico.
4. Il fluoro nei composti ha sempre n.o. $-1$.
5. I metalli del gruppo 1 (IA) hanno sempre $+1$, quelli del gruppo 2 (IIA) sempre $+2$, l'alluminio $+3$. Hanno un solo valore anche lo zinco, $+2$, e l'argento, $+1$.
6. L'idrogeno ha $+1$.
7. L'ossigeno ha $-2$.
8. Cloro, bromo e iodio hanno $-1$ nei composti con l'idrogeno e con i metalli.

Il numero che manca si ricava dalla regola 3, con un'equazione. Le regole 6 e 7 hanno poche eccezioni, e l'ordine di precedenza le prevede tutte: le trovi nell'esempio 5.

Per i non metalli che non compaiono nelle regole la tavola periodica dà i due estremi. Il n.o. più alto è il numero degli elettroni di valenza, cioè la cifra delle unità del gruppo: l'atomo li ha persi tutti. Il più basso è il numero del gruppo meno $18$: l'atomo ha completato l'ottetto.

```tikz
% nome: ossidazione-estremi-gruppi-principali
% alt: Una tabella con una colonna per ciascuno dei gruppi 1, 2, 13, 14, 15, 16 e 17, con un elemento di esempio: sodio, magnesio, alluminio, carbonio, azoto, zolfo, cloro. Una riga dà il numero di ossidazione massimo, da più 1 a più 7 passando da un gruppo al successivo. Un'altra riga dà il minimo, che c'è solo per i non metalli: meno 4 per il gruppo 14, meno 3 per il 15, meno 2 per il 16, meno 1 per il 17
\begin{tikzpicture}[x=1.15cm, y=0.75cm]
\foreach \g/\x/\el/\ma/\mi in {1/0/Na/+1/{}, 2/1/Mg/+2/{}, 13/2/Al/+3/{}, 14/3/C/+4/-4, 15/4/N/+5/-3, 16/5/S/+6/-2, 17/6/Cl/+7/-1} {
  \draw[thin] (\x,0) rectangle ++(1,-1);
  \draw[thin, fill=red!12] (\x,-1) rectangle ++(1,-1);
  \draw[thin, fill=blue!12] (\x,-2) rectangle ++(1,-1);
  \node at (\x+0.5,0.45) {\small \g};
  \node at (\x+0.5,-0.5) {\el};
  \node at (\x+0.5,-1.5) {$\ma$};
  \node at (\x+0.5,-2.5) {$\mi$};
}
\node[left] at (0,0.45) {\small gruppo};
\node[left] at (0,-0.5) {\small esempio};
\node[left] at (0,-1.5) {\small massimo};
\node[left] at (0,-2.5) {\small minimo};
\end{tikzpicture}
```

Lo zolfo, nel gruppo 16 (VIA), va da $-2$ a $+6$; il cloro, nel gruppo 17 (VIIA), da $-1$ a $+7$. Tra i due estremi i valori più comuni vanno di due in due: $+4$ e $+6$ per lo zolfo, $+1$, $+3$, $+5$ e $+7$ per il cloro. Fanno eccezione l'ossigeno e il fluoro, i due elementi più elettronegativi, che non arrivano a $+6$ e a $+7$. I metalli di transizione hanno di solito più valori, tutti positivi: ferro $+2$ e $+3$, rame $+1$ e $+2$. I numeri di ossidazione di ogni elemento sono nella sua scheda della [tavola periodica](/strumenti/tavola-periodica?elemento=Fe).

## Calcolare il numero di ossidazione

Il procedimento è sempre lo stesso.

1. Scrivi i n.o. che conosci dalle regole.
2. Chiama $x$ quello che non conosci.
3. Moltiplica ogni n.o. per l'indice del suo atomo nella formula e somma.
4. Poni la somma uguale a $0$, o alla carica se è uno ione, e ricava $x$.

```ad-example
Esempio 1: un composto di due elementi
Qual è il n.o. dello zolfo in $\mathrm{SO_3}$?

L'ossigeno ha $-2$ e gli atomi di ossigeno sono tre. Con $x$ per lo zolfo:

$$x + 3 \cdot (-2) = 0 \qquad x = +6$$

Lo zolfo ha n.o. $+6$, il massimo per un elemento del gruppo 16.
```

```ad-example
Esempio 2: un composto di tre elementi
Qual è il n.o. dello zolfo in $\mathrm{H_2SO_4}$, l'acido solforico?

L'idrogeno ha $+1$ (due atomi), l'ossigeno $-2$ (quattro atomi).

$$2 \cdot (+1) + x + 4 \cdot (-2) = 0 \qquad 2 + x - 8 = 0 \qquad x = +6$$

Lo zolfo ha n.o. $+6$, come in $\mathrm{SO_3}$.
```

```ad-example
Esempio 3: due atomi dello stesso elemento
Qual è il n.o. del cromo in $\mathrm{K_2Cr_2O_7}$, il dicromato di potassio?

Il potassio, del gruppo 1, ha $+1$ (due atomi); l'ossigeno $-2$ (sette atomi). Gli atomi di cromo sono due, e l'incognita va moltiplicata per $2$:

$$2 \cdot (+1) + 2x + 7 \cdot (-2) = 0 \qquad 2 + 2x - 14 = 0 \qquad 2x = 12 \qquad x = +6$$

Ogni atomo di cromo ha n.o. $+6$.
```

```ad-warning
Il numero di ossidazione è di un atomo solo
In $\mathrm{K_2Cr_2O_7}$ i due atomi di cromo valgono insieme $+12$, ma il n.o. del cromo è $+6$: l'errore più comune è fermarsi a $2x = 12$ e rispondere $+12$. Allo stesso modo l'ossigeno ha $-2$, non $-14$.
```

```ad-example
Esempio 4: gli ioni poliatomici
Qual è il n.o. dello zolfo nello ione solfato, $\mathrm{SO_4^{2-}}$? E quello dell'azoto nello ione ammonio, $\mathrm{NH_4^+}$?

In uno ione la somma è la carica. Per il solfato:

$$x + 4 \cdot (-2) = -2 \qquad x = +6$$

Per l'ammonio, con l'idrogeno a $+1$:

$$x + 4 \cdot (+1) = +1 \qquad x = -3$$

Lo zolfo ha $+6$; l'azoto ha $-3$, il minimo del gruppo 15.
```

```ad-warning
In uno ione la somma non è zero
Con $x + 4 \cdot (-2) = 0$ lo zolfo del solfato verrebbe $+8$, più dei suoi sei elettroni di valenza. Prima di scrivere l'equazione guarda se la formula ha una carica in alto a destra.
```

```ad-example
Esempio 5: le eccezioni di idrogeno e ossigeno
Trova i n.o. in $\mathrm{NaH}$, in $\mathrm{H_2O_2}$ e in $\mathrm{OF_2}$.

In $\mathrm{NaH}$, l'idruro di sodio, il sodio ha $+1$ per la regola 5, che viene prima della regola 6 sull'idrogeno: $+1 + x = 0$, quindi l'idrogeno ha $-1$. Succede in tutti gli idruri dei metalli, perché l'idrogeno è più elettronegativo dei metalli.

In $\mathrm{H_2O_2}$, l'acqua ossigenata, l'idrogeno ha $+1$ per la regola 6, che viene prima della regola 7: $2 \cdot (+1) + 2x = 0$, quindi l'ossigeno ha $-1$. I composti con l'ossigeno a $-1$ si chiamano perossidi.

In $\mathrm{OF_2}$ il fluoro ha $-1$ per la regola 4: $x + 2 \cdot (-1) = 0$, quindi l'ossigeno ha $+2$. È l'unico composto comune in cui l'ossigeno ha un n.o. positivo, perché solo il fluoro è più elettronegativo di lui.
```

Nella figura puoi provare tu: scegli una formula, dai a ogni elemento un numero di ossidazione e guarda come cambiano il totale delle cariche positive e quello delle negative.

```interattivo
% nome: ossidazione-calcola-atomo-per-atomo
% alt: Si sceglie una formula tra dieci, tra molecole e ioni (H2O, SO3, H2SO4, KMnO4, K2Cr2O7, lo ione solfato, lo ione ammonio, H2O2, NaH, OF2). Per ogni elemento della formula una riga mostra il simbolo, quanti atomi ci sono, il numero di ossidazione scelto con due bottoni più e meno e il contributo, cioè il numero di ossidazione per il numero di atomi. Sotto, due barre: il totale dei contributi positivi e il totale di quelli negativi. Un bottone controlla: dice se la somma è quella giusta e, per ogni elemento sbagliato, quale regola si applica
```

Quando i numeri sono giusti le due barre sono lunghe uguali, se la specie è neutra, oppure differiscono proprio della carica dello ione. Una somma giusta non garantisce che siano giusti i singoli numeri: in $\mathrm{H_2O}$ anche $+2$ e $-4$ danno zero, ma l'idrogeno ha $+1$ per la regola 6. Prima si scrivono i numeri fissati dalle regole, poi si ricava quello che manca.

```ad-note
Un numero di ossidazione può essere una frazione
Nella magnetite, $\mathrm{Fe_3O_4}$, il conto dà $3x - 8 = 0$, cioè $x = +\frac{8}{3}$. Non è un errore: è una media. Dei tre atomi di ferro, due hanno $+3$ e uno ha $+2$, e $(3 + 3 + 2) : 3 = \frac{8}{3}$.
```

## Dai numeri di ossidazione alla formula

Il conto si fa anche al contrario: noti i n.o. di due elementi, si scrive la formula del loro composto. La somma deve fare zero, quindi servono tanti atomi di ciascun elemento da pareggiare le cariche. La **regola dell'incrocio** lo fa in un passaggio: il n.o. di ciascun elemento, senza segno, diventa l'indice dell'altro.

```tikz
% nome: ossidazione-regola-incrocio
% alt: La regola dell'incrocio per l'ossido di alluminio. In alto il simbolo Al con il numero di ossidazione più 3 e il simbolo O con meno 2; in basso gli stessi due simboli con gli indici. Due frecce si incrociano: il 3 dell'alluminio scende a fare da indice all'ossigeno, il 2 dell'ossigeno scende a fare da indice all'alluminio. A destra la formula Al2O3 e sotto il controllo: 2 per più 3 più 3 per meno 2 uguale 0
\begin{tikzpicture}
\node at (0,1.8) {\Large Al};
\node at (2.4,1.8) {\Large O};
\node[red] at (0.7,1.8) {$+3$};
\node[blue] at (3.05,1.8) {$-2$};
\node at (0,0) {\Large Al};
\node at (2.4,0) {\Large O};
\node[blue] at (0.5,-0.22) {$2$};
\node[red] at (2.95,-0.22) {$3$};
\draw[-{Stealth}, red] (0.7,1.55) -- (2.95,0.03);
\draw[-{Stealth}, blue] (3.05,1.55) -- (0.55,0.03);
\draw[-{Stealth}, thick] (3.7,0) -- (4.7,0);
\node at (5.7,0) {\Large $\mathrm{Al_2O_3}$};
\node at (2.8,-1.1) {\small $2 \cdot (+3) + 3 \cdot (-2) = 0$};
\end{tikzpicture}
```

Nella formula l'elemento con il n.o. positivo si scrive per primo: il metallo sta a sinistra. Quando un metallo e un non metallo si legano, il non metallo prende il suo n.o. più basso: $-2$ per ossigeno e zolfo, $-1$ per gli alogeni.

```ad-example
Esempio 6: dalla coppia di numeri alla formula
Scrivi la formula del composto tra calcio e cloro, e di quello tra piombo, con n.o. $+4$, e ossigeno.

Calcio $+2$, cloro $-1$: il $2$ del calcio va al cloro, l'$1$ del cloro va al calcio e non si scrive. La formula è $\mathrm{CaCl_2}$, e infatti $+2 + 2 \cdot (-1) = 0$.

Piombo $+4$, ossigeno $-2$: l'incrocio dà $\mathrm{Pb_2O_4}$. I due indici si dividono per $2$, e la formula è $\mathrm{PbO_2}$: $+4 + 2 \cdot (-2) = 0$.
```

```ad-warning
Gli indici vanno ridotti ai minimi termini
Dopo l'incrocio, se i due indici hanno un divisore comune si semplificano: $\mathrm{Ca_2O_2}$ diventa $\mathrm{CaO}$, $\mathrm{S_2O_6}$ diventa $\mathrm{SO_3}$. Succede ogni volta che i due n.o. sono uguali o uno è multiplo dell'altro. Fanno eccezione i perossidi, come $\mathrm{H_2O_2}$, in cui i due atomi di ossigeno sono legati tra loro e gli indici restano quelli.
```

Per i composti ionici è lo stesso conto che la lezione [La formula chimica e il suo significato](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-formula-chimica-e-il-suo-significato) fa con le cariche degli ioni.

## Le famiglie dei composti inorganici

I composti inorganici si dividono in poche famiglie, secondo gli elementi che contengono. Un composto **binario** è fatto di due elementi, uno **ternario** di tre.

```tikz
% nome: ossidazione-famiglie-composti-inorganici
% alt: Due riquadri, uno sopra l'altro. Il primo, composti binari, elenca cinque famiglie con gli elementi che contengono: ossidi basici, metallo e ossigeno; ossidi acidi o anidridi, non metallo e ossigeno; idruri, metallo o non metallo e idrogeno; idracidi, idrogeno e non metallo dei gruppi 16 e 17; sali binari, metallo e non metallo. Il secondo, composti ternari, ne elenca tre: idrossidi, metallo, ossigeno e idrogeno; ossiacidi, idrogeno, non metallo e ossigeno; sali ternari, metallo, non metallo e ossigeno
\begin{tikzpicture}
\draw[thick, fill=blue!8] (0,0) rectangle (7.4,-3.9);
\node[anchor=west] at (0.15,-0.4) {composti binari};
\draw[thin] (0,-0.75) -- (7.4,-0.75);
\foreach \y/\n/\c in {-1.15/{ossidi basici}/{metallo + O}, -1.75/{ossidi acidi (anidridi)}/{non metallo + O}, -2.35/{idruri}/{metallo o non metallo + H}, -2.95/{idracidi}/{H + non metallo}, -3.55/{sali binari}/{metallo + non metallo}} {
  \node[anchor=west] at (0.15,\y) {\small \n};
  \node[anchor=east] at (7.3,\y) {\footnotesize \c};
}
\draw[thick, fill=orange!12] (0,-4.3) rectangle (7.4,-7.0);
\node[anchor=west] at (0.15,-4.7) {composti ternari};
\draw[thin] (0,-5.05) -- (7.4,-5.05);
\foreach \y/\n/\c in {-5.45/{idrossidi}/{metallo + O + H}, -6.05/{ossiacidi}/{H + non metallo + O}, -6.65/{sali ternari}/{metallo + non metallo + O}} {
  \node[anchor=west] at (0.15,\y) {\small \n};
  \node[anchor=east] at (7.3,\y) {\footnotesize \c};
}
\end{tikzpicture}
```

Ogni famiglia ha la sua lezione: [Ossidi basici e ossidi acidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/ossidi-basici-e-ossidi-acidi), [Idruri e idracidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/idruri-e-idracidi), [Gli idrossidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/gli-idrossidi), [Gli ossiacidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/gli-ossiacidi), [I sali binari](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/i-sali-binari) e [I sali ternari](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/i-sali-ternari). Gli idracidi sono composti dell'idrogeno con un non metallo dei gruppi 16 e 17.

## Tre modi di dare il nome

Lo stesso composto ha tre nomi, perché tre sistemi di nomenclatura convivono: nei libri, sulle etichette dei reagenti e nelle verifiche li trovi tutti. Tutti e tre partono dal numero di ossidazione, e si imparano una volta sola, perché valgono per ogni famiglia.

### La nomenclatura tradizionale

La **nomenclatura tradizionale** dice il n.o. con un suffisso, e a volte un prefisso, attaccato alla radice del nome dell'elemento.

| Quanti n.o. ha l'elemento | Nome | Esempio |
|---|---|---|
| uno | "di" e il nome dell'elemento | ossido di sodio |
| due | -oso per il più basso, -ico per il più alto | ossido ferroso ($+2$), ossido ferrico ($+3$) |
| quattro | ipo- e -oso, -oso, -ico, per- e -ico, dal più basso al più alto | anidride ipoclorosa ($+1$), clorosa ($+3$), clorica ($+5$), perclorica ($+7$) |

La radice è spesso quella del nome latino dell'elemento, e va imparata:

| Elemento | Radice | Elemento | Radice |
|---|---|---|---|
| ferro | ferr- | zolfo | solfor- |
| rame | rame- | azoto | nitr- |
| stagno | stann- | fosforo | fosfor- |
| piombo | piomb- | carbonio | carbon- |
| oro | aur- | cloro | clor- |

Il nome della famiglia cambia da una famiglia all'altra (ossido, anidride, idrossido, acido), e ogni lezione dà il suo.

```ad-warning
-oso e -ico non indicano un numero fisso
Ferroso vuol dire $+2$, ma rameoso vuol dire $+1$ e stannoso $+2$: il suffisso -oso indica il n.o. più basso di quell'elemento, non un valore uguale per tutti. Per usare la nomenclatura tradizionale bisogna ricordare i n.o. di ogni elemento.
```

### La notazione di Stock

La **notazione di Stock** scrive il n.o. in numeri romani, tra parentesi, subito dopo il nome dell'elemento e senza spazio: ossido di ferro(II), ossido di ferro(III). Il segno non si scrive. Quando l'elemento ha un solo n.o. il numero romano non serve: ossido di sodio.

### La nomenclatura IUPAC

La **nomenclatura IUPAC** non usa il n.o.: legge la formula, e dice con un prefisso quanti atomi ci sono di ogni elemento. La IUPAC è l'Unione internazionale di chimica pura e applicata, l'organizzazione che fissa le regole dei nomi.

| Atomi | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Prefisso | mono- | di- | tri- | tetra- | penta- | esa- | epta- |

Il nome si legge da destra a sinistra rispetto alla formula: $\mathrm{Fe_2O_3}$ è il triossido di diferro. Il prefisso mono- di solito non si dice: $\mathrm{Na_2O}$ è l'ossido di disodio, $\mathrm{CaO}$ l'ossido di calcio. Si scrive solo in monossido, quando gli atomi sono uno a uno e l'elemento ha anche altri ossidi: $\mathrm{CO}$ è il monossido di carbonio, per distinguerlo dal diossido, $\mathrm{CO_2}$.

### I tre nomi a confronto

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{Na_2O}$ | ossido di sodio | ossido di sodio | ossido di disodio |
| $\mathrm{FeO}$ | ossido ferroso | ossido di ferro(II) | monossido di ferro |
| $\mathrm{Fe_2O_3}$ | ossido ferrico | ossido di ferro(III) | triossido di diferro |
| $\mathrm{SO_3}$ | anidride solforica | ossido di zolfo(VI) | triossido di zolfo |
| $\mathrm{Cl_2O_7}$ | anidride perclorica | ossido di cloro(VII) | eptaossido di dicloro |

```ad-example
Esempio 7: i tre nomi dalla formula
Che nomi ha $\mathrm{Cu_2O}$? Il rame ha n.o. $+1$ e $+2$.

Prima il n.o. del rame: $2x + (-2) = 0$, quindi $x = +1$, il più basso dei due.

Nome tradizionale: ossido rameoso. Notazione di Stock: ossido di rame(I). Nome IUPAC, dalla formula: ossido di dirame.
```

```ad-warning
Il numero romano non è l'indice della formula
In $\mathrm{Fe_2O_3}$ il ferro ha indice $2$, ma il nome di Stock è ossido di ferro(III): tra parentesi va il n.o., che si calcola. L'indice della formula lo dicono i prefissi del nome IUPAC, diferro.
```

Dal nome si torna alla formula per due strade. Dal nome tradizionale o da quello di Stock si ricava il n.o. e si applica la regola dell'incrocio: l'ossido di piombo(IV) ha il piombo a $+4$ e l'ossigeno a $-2$, quindi $\mathrm{PbO_2}$. Dal nome IUPAC si scrivono gli indici che i prefissi dicono: il pentaossido di diazoto è $\mathrm{N_2O_5}$.
