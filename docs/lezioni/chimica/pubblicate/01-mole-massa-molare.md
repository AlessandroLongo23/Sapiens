# La mole e la massa molare

In un cucchiaino d'acqua ci sono circa $1{,}7 \cdot 10^{23}$ molecole: nessuno le può contare una per una, ma una bilancia pesa quel cucchiaino in un attimo. La mole è il ponte tra le due cose: permette di passare dalla massa di una sostanza, che si misura, al numero di particelle che contiene, che è quello che conta nelle reazioni. Per usarla servono tre ingredienti: la massa degli atomi, la formula della molecola e il numero di Avogadro.

## Massa atomica e unità di massa atomica

Gli atomi sono così leggeri che il grammo è un'unità scomoda: un atomo di idrogeno pesa circa $1{,}67 \cdot 10^{-24}\ \mathrm{g}$. Per questo in chimica si usa un'unità su misura. L'**unità di massa atomica**, simbolo $\mathrm{u}$, è un dodicesimo della massa di un atomo di carbonio-12:

$$1\ \mathrm{u} = \frac{1}{12}\ \text{della massa di un atomo di } {}^{12}\mathrm{C} \approx 1{,}661 \cdot 10^{-24}\ \mathrm{g}$$

La **massa atomica relativa** di un elemento dice quante volte la massa media dei suoi atomi è più grande di $1\ \mathrm{u}$. Per il carbonio vale $12{,}01$: un atomo di carbonio ha in media una massa di $12{,}01\ \mathrm{u}$. È un numero puro, senza unità, e si legge sulla tavola periodica. In questa lezione e nei suoi esercizi usiamo sempre questi valori, arrotondati a due decimali:

| Elemento | Simbolo | Massa atomica relativa |
|---|---|---|
| Idrogeno | $\mathrm{H}$ | $1{,}01$ |
| Carbonio | $\mathrm{C}$ | $12{,}01$ |
| Azoto | $\mathrm{N}$ | $14{,}01$ |
| Ossigeno | $\mathrm{O}$ | $16{,}00$ |
| Sodio | $\mathrm{Na}$ | $22{,}99$ |
| Magnesio | $\mathrm{Mg}$ | $24{,}31$ |
| Fosforo | $\mathrm{P}$ | $30{,}97$ |
| Zolfo | $\mathrm{S}$ | $32{,}07$ |
| Cloro | $\mathrm{Cl}$ | $35{,}45$ |
| Potassio | $\mathrm{K}$ | $39{,}10$ |
| Calcio | $\mathrm{Ca}$ | $40{,}08$ |
| Ferro | $\mathrm{Fe}$ | $55{,}85$ |

```ad-note
Perché il carbonio non vale 12 esatto
Per definizione un atomo di carbonio-12 pesa esattamente $12\ \mathrm{u}$. In natura, però, circa un atomo di carbonio su cento è carbonio-13, un po' più pesante, e la tavola periodica riporta la media pesata sugli isotopi presenti in natura: $12{,}01$. Per lo stesso motivo il cloro vale $35{,}45$ e non un numero intero.
```

## Dalla formula di struttura alla formula bruta

Per calcolare la massa di una molecola bisogna sapere quanti atomi di ogni elemento contiene. Lo dice la **formula bruta** (o formula molecolare): i simboli degli elementi, ognuno con un indice che dice quanti atomi ci sono. Il glucosio è $\mathrm{C_6H_{12}O_6}$: sei atomi di carbonio, dodici di idrogeno, sei di ossigeno. L'indice $1$ non si scrive.

Spesso però la molecola ti viene data disegnata. Nella formula di struttura completa ogni atomo ha il suo simbolo e ogni legame il suo trattino, e contare è facile. Nella formula scheletrica, quella dei libri e dei farmaci, i chimici risparmiano inchiostro: ogni vertice e ogni estremo di una linea è un atomo di carbonio, e gli idrogeni legati al carbonio non si scrivono. Si scrivono solo gli idrogeni legati ad altri atomi, come l'$\mathrm{OH}$ dell'etanolo.

```molecole
% nome: mole-etanolo-due-formule
% alt: L'etanolo disegnato due volte: a sinistra la formula scheletrica, una linea spezzata con OH in fondo; a destra la formula di struttura con tutti gli atomi, due C, sei H e un O
% svg: mole-etanolo-due-formule-77843cc4.svg 416x124
colonne: 2
CCO | formula scheletrica
CCO | formula di struttura | idrogeni: tutti | carboni: si
```

Per passare dalla formula scheletrica alla formula bruta:

1. Conta i vertici e gli estremi senza simbolo: sono gli atomi di carbonio.
2. Conta gli atomi scritti con il loro simbolo ($\mathrm{O}$, $\mathrm{N}$...) e gli idrogeni scritti accanto a loro.
3. Per ogni carbonio, conta i legami che vede (un doppio legame vale due): gli idrogeni che non vedi sono quelli che mancano per arrivare a quattro.
4. Scrivi la formula con il carbonio per primo, poi l'idrogeno, poi gli altri elementi in ordine alfabetico.

L'ordine del passo 4 è quello che si usa per i composti del carbonio; per gli altri si seguono le formule tradizionali ($\mathrm{H_2O}$, $\mathrm{NH_3}$, $\mathrm{NaCl}$).

```ad-example
Esempio 1: l'etanolo
Nella formula scheletrica dell'etanolo ci sono due estremi senza simbolo, quindi due carboni, poi un $\mathrm{O}$ con il suo $\mathrm{H}$. Il primo carbonio vede un solo legame e porta tre idrogeni; il secondo ne vede due (con il primo carbonio e con l'ossigeno) e porta due idrogeni. In tutto gli idrogeni sono $3 + 2 + 1 = 6$, e la formula bruta è $\mathrm{C_2H_6O}$.

La formula di struttura a destra, nella figura sopra, mostra gli stessi atomi tutti scritti: due $\mathrm{C}$, sei $\mathrm{H}$, un $\mathrm{O}$.
```

```ad-example
Esempio 2: l'acido acetilsalicilico
L'acido acetilsalicilico è il principio attivo dell'aspirina. Nel disegno i carboni sono evidenziati in giallo per contarli: sono $9$, sei nell'anello e tre fuori. Gli ossigeni sono $4$. Gli idrogeni si contano carbonio per carbonio: $4$ sui carboni dell'anello che hanno un legame libero, $3$ sul carbonio del gruppo $\mathrm{CH_3}$, l'unico che non ha legami con l'ossigeno né con l'anello, $1$ sul gruppo $\mathrm{OH}$. In tutto $8$, e la formula bruta è $\mathrm{C_9H_8O_4}$.

```molecola
% nome: mole-aspirina-carboni
% alt: Acido acetilsalicilico in formula scheletrica con i nove atomi di carbonio evidenziati in giallo: sei nell'anello, due nei gruppi C=O e uno nel CH3
% svg: mole-aspirina-carboni-b9d8564a.svg 282x168
smiles: CC(=O)Oc1ccccc1C(=O)O
evidenzia: [#6] giallo
legenda: acido acetilsalicilico, C9H8O4
```
```

```ad-warning
Dimenticare gli idrogeni che non sono scritti
Chi conta solo i simboli scritti nella formula scheletrica dell'etanolo trova $\mathrm{C_2HO}$, o addirittura $\mathrm{HO}$ se dimentica anche i carboni. Ogni carbonio ha sempre quattro legami: quelli che non vedi sono legami con atomi di idrogeno.
```

La stessa formula bruta non basta a dire di che molecola si tratta. L'etanolo e l'etere dimetilico hanno tutti e due formula $\mathrm{C_2H_6O}$, ma gli atomi sono legati in modo diverso e sono due sostanze diverse: la prima è l'alcol del vino, la seconda un gas. Per la massa, però, conta solo quanti atomi ci sono, e le due molecole pesano uguale.

```molecole
% nome: mole-etanolo-etere-dimetilico
% alt: Etanolo ed etere dimetilico in formula di struttura: tutti e due hanno due C, sei H e un O, ma nell'etanolo l'ossigeno sta in fondo alla catena e nell'etere sta in mezzo ai due carboni
% svg: mole-etanolo-etere-dimetilico-ab021034.svg 470x124
colonne: 2
idrogeni: tutti
carboni: si
CCO | etanolo, C2H6O
COC | etere dimetilico, C2H6O
```

## Massa molecolare

La **massa molecolare** è la massa di una molecola, e si ottiene sommando le masse atomiche di tutti gli atomi che la formano, ognuna moltiplicata per il numero di atomi di quell'elemento:

$$\text{massa molecolare} = \sum (\text{numero di atomi} \cdot \text{massa atomica})$$

Come la massa atomica, si esprime in $\mathrm{u}$; il numero senza unità si chiama massa molecolare relativa.

```ad-example
Esempio 3: acqua e anidride carbonica
Una molecola d'acqua, $\mathrm{H_2O}$, ha due atomi di idrogeno e uno di ossigeno:
$$2 \cdot 1{,}01 + 16{,}00 = 18{,}02\ \mathrm{u}$$
Una molecola di anidride carbonica, $\mathrm{CO_2}$, ha un atomo di carbonio e due di ossigeno:
$$12{,}01 + 2 \cdot 16{,}00 = 44{,}01\ \mathrm{u}$$
```

```ad-example
Esempio 4: il glucosio
Il glucosio è lo zucchero che le cellule usano come carburante. Nella formula di struttura, con gli ossigeni in rosso, si contano $6$ carboni, $12$ idrogeni e $6$ ossigeni: $\mathrm{C_6H_{12}O_6}$.

```molecola
% nome: mole-glucosio-struttura
% alt: Glucosio in formula di struttura con tutti gli atomi scritti: un anello di cinque carboni e un ossigeno, sei atomi di ossigeno evidenziati in rosso e dodici idrogeni
% svg: mole-glucosio-struttura-fe2fd444.svg 203x220
smiles: C(C1C(C(C(C(O1)O)O)O)O)O
idrogeni: tutti
carboni: si
evidenzia: [#8] rosso
legenda: glucosio, C6H12O6
```

Conviene fare il conto elemento per elemento:
$$\mathrm{C}: 6 \cdot 12{,}01 = 72{,}06 \qquad \mathrm{H}: 12 \cdot 1{,}01 = 12{,}12 \qquad \mathrm{O}: 6 \cdot 16{,}00 = 96{,}00$$
$$72{,}06 + 12{,}12 + 96{,}00 = 180{,}18\ \mathrm{u}$$
```

```ad-note
I composti ionici
Il cloruro di sodio, $\mathrm{NaCl}$, non è fatto di molecole ma di ioni $\mathrm{Na^+}$ e $\mathrm{Cl^-}$ disposti in un reticolo. Per questi composti si parla di massa formula, e si calcola allo stesso modo sulla formula: $22{,}99 + 35{,}45 = 58{,}44\ \mathrm{u}$.
```

## La mole e il numero di Avogadro

Una molecola d'acqua ha una massa di $18{,}02\ \mathrm{u}$, cioè $18{,}02 \cdot 1{,}661 \cdot 10^{-24} \approx 2{,}99 \cdot 10^{-23}\ \mathrm{g}$: nessuna bilancia la può pesare. In laboratorio si lavora con quantità enormi di particelle, e per contarle si usa un "pacchetto" fisso, come la dozzina per le uova.

La **mole** (simbolo $\mathrm{mol}$) è la quantità di sostanza che contiene $6{,}022 \cdot 10^{23}$ particelle. Le particelle possono essere atomi, molecole o ioni, e bisogna sempre dire quali: una mole di molecole d'acqua, una mole di atomi di ferro. Il numero di particelle per mole è il **numero di Avogadro**:

$$N_A = 6{,}022 \cdot 10^{23}\ \mathrm{mol^{-1}}$$

Dal 2019 il valore di $N_A$ è fissato per definizione ($6{,}02214076 \cdot 10^{23}\ \mathrm{mol^{-1}}$); nei conti bastano quattro cifre.

Il numero di Avogadro non è stato scelto a caso: è, con ottima approssimazione, il numero di unità di massa atomica che ci vogliono per fare un grammo. Infatti
$$6{,}022 \cdot 10^{23} \cdot 1{,}661 \cdot 10^{-24}\ \mathrm{g} \approx 1{,}000\ \mathrm{g}$$
Quindi una mole di particelle da $1\ \mathrm{u}$ pesa $1\ \mathrm{g}$, e una mole di molecole d'acqua, che pesano $18{,}02\ \mathrm{u}$ ciascuna, pesa $18{,}02\ \mathrm{g}$.

## Massa molare

La **massa molare** $M$ di una sostanza è la massa di una mole di quella sostanza, e si misura in grammi per mole ($\mathrm{g/mol}$). Per quanto visto sopra, ha lo stesso valore numerico della massa molecolare:

| | Massa di una molecola | Massa di una mole |
|---|---|---|
| Acqua, $\mathrm{H_2O}$ | $18{,}02\ \mathrm{u}$ | $18{,}02\ \mathrm{g}$ |
| Glucosio, $\mathrm{C_6H_{12}O_6}$ | $180{,}18\ \mathrm{u}$ | $180{,}18\ \mathrm{g}$ |

Per un elemento fatto di atomi singoli, come il ferro, la massa molare è la massa atomica in $\mathrm{g/mol}$: $M_{\mathrm{Fe}} = 55{,}85\ \mathrm{g/mol}$. Ecco le masse molari di alcune sostanze di tutti i giorni, calcolate con la tavola sopra.

```molecole
% nome: mole-sostanze-piccole
% alt: Sei sostanze comuni in formula di struttura con la massa molare: acqua 18,02, anidride carbonica 44,01, metano 16,05, etanolo 46,08, acido acetico 60,06 e acetone 58,09 grammi per mole
% svg: mole-sostanze-piccole-133d68a1.svg 1029x260
colonne: 3
idrogeni: tutti
carboni: si
O | acqua, M = 18,02 g/mol
O=C=O | anidride carbonica, M = 44,01 g/mol
C | metano, M = 16,05 g/mol
CCO | etanolo, M = 46,08 g/mol
CC(=O)O | acido acetico, M = 60,06 g/mol
CC(C)=O | acetone, M = 58,09 g/mol
```

Per le molecole più grandi la formula di struttura completa diventa affollata, e si usa quella scheletrica.

```molecole
% nome: mole-sostanze-grandi
% alt: Tre molecole più grandi in formula scheletrica con la massa molare: glucosio 180,18, caffeina 194,22 e acido acetilsalicilico 180,17 grammi per mole
% svg: mole-sostanze-grandi-f4406bc4.svg 1164x173
colonne: 3
OCC1OC(O)C(O)C(O)C1O | glucosio, M = 180,18 g/mol
Cn1cnc2c1c(=O)n(C)c(=O)n2C | caffeina, M = 194,22 g/mol
CC(=O)Oc1ccccc1C(=O)O | acido acetilsalicilico, M = 180,17 g/mol
```

```ad-warning
Confondere l'elemento con la molecola
L'ossigeno che respiriamo è fatto di molecole $\mathrm{O_2}$: la sua massa molare è $2 \cdot 16{,}00 = 32{,}00\ \mathrm{g/mol}$, non $16{,}00$. Lo stesso vale per $\mathrm{H_2}$, $\mathrm{N_2}$ e $\mathrm{Cl_2}$. Prima di calcolare $M$ controlla la formula della sostanza.
```

## Dalla massa alle moli

Se una mole pesa $M$ grammi, in $m$ grammi di sostanza ci sono $m / M$ moli. La quantità di sostanza $n$ si ricava dalla massa così:

$$n = \frac{m}{M}$$

con $m$ in grammi, $M$ in $\mathrm{g/mol}$ e $n$ in moli. Girando la formula si trova la massa che corrisponde a un certo numero di moli, $m = n \cdot M$.

Il procedimento è sempre lo stesso:

1. Scrivi la formula bruta della sostanza (dal nome o dal disegno).
2. Calcola la massa molare $M$ con la tavola delle masse atomiche.
3. Porta la massa in grammi, se è data in milligrammi o chilogrammi.
4. Dividi: $n = m / M$.

```ad-tip
Quante cifre scrivere
Nel risultato tieni tante cifre significative quante ne ha il dato meno preciso: se la massa è $36{,}0\ \mathrm{g}$ (tre cifre), il risultato ha tre cifre. Le masse molari della tavola ne hanno quattro o cinque e di solito non sono loro a decidere.
```

```ad-example
Esempio 5: moli d'acqua
Quante moli ci sono in $36{,}0\ \mathrm{g}$ di acqua?

La massa molare dell'acqua è $18{,}02\ \mathrm{g/mol}$:
$$n = \frac{36{,}0\ \mathrm{g}}{18{,}02\ \mathrm{g/mol}} = 1{,}998 \ldots \approx 2{,}00\ \mathrm{mol}$$
```

```ad-example
Esempio 6: una compressa di aspirina
Una compressa contiene $500\ \mathrm{mg}$ di acido acetilsalicilico, $\mathrm{C_9H_8O_4}$. Quante moli sono?

La massa molare è $9 \cdot 12{,}01 + 8 \cdot 1{,}01 + 4 \cdot 16{,}00 = 108{,}09 + 8{,}08 + 64{,}00 = 180{,}17\ \mathrm{g/mol}$. La massa va portata in grammi: $500\ \mathrm{mg} = 0{,}500\ \mathrm{g}$. Quindi
$$n = \frac{0{,}500\ \mathrm{g}}{180{,}17\ \mathrm{g/mol}} = 0{,}002775 \ldots \approx 2{,}78 \cdot 10^{-3}\ \mathrm{mol}$$
```

```ad-example
Esempio 7: dalle moli alla massa
Quanti grammi pesano $0{,}250\ \mathrm{mol}$ di etanolo, $\mathrm{C_2H_6O}$?

La massa molare è $2 \cdot 12{,}01 + 6 \cdot 1{,}01 + 16{,}00 = 46{,}08\ \mathrm{g/mol}$, e
$$m = n \cdot M = 0{,}250\ \mathrm{mol} \cdot 46{,}08\ \mathrm{g/mol} = 11{,}52\ \mathrm{g} \approx 11{,}5\ \mathrm{g}$$
```

```ad-warning
Moltiplicare invece di dividere
Per trovare le moli la massa si divide per $M$. Un controllo con le unità: $\mathrm{g} \cdot \mathrm{g/mol}$ dà $\mathrm{g^2/mol}$, che non sono moli; $\mathrm{g} : \mathrm{g/mol}$ dà $\mathrm{mol}$. E un controllo con il buon senso: $36{,}0\ \mathrm{g}$ d'acqua sono circa due volte $18{,}02\ \mathrm{g}$, quindi circa due moli, non $649$.
```

## Dalle moli al numero di particelle

Ogni mole contiene $N_A$ particelle, quindi $n$ moli ne contengono

$$N = n \cdot N_A$$

Se la domanda riguarda gli atomi di un elemento, bisogna ancora moltiplicare per il numero di quegli atomi in ogni molecola, che si legge nella formula bruta.

```ad-example
Esempio 8: molecole e atomi nell'acqua
Nell'esempio 5 abbiamo trovato che $36{,}0\ \mathrm{g}$ d'acqua sono $2{,}00\ \mathrm{mol}$. Le molecole sono
$$N = 2{,}00 \cdot 6{,}022 \cdot 10^{23} = 12{,}044 \cdot 10^{23} \approx 1{,}20 \cdot 10^{24}$$
Ogni molecola $\mathrm{H_2O}$ ha due atomi di idrogeno, quindi gli atomi di idrogeno sono il doppio:
$$N_{\mathrm{H}} = 2 \cdot 1{,}2044 \cdot 10^{24} \approx 2{,}41 \cdot 10^{24}$$
Gli atomi in tutto, tre per molecola, sono $3 \cdot 1{,}2044 \cdot 10^{24} \approx 3{,}61 \cdot 10^{24}$.
```

```ad-example
Esempio 9: dalle molecole alla massa
Un campione di anidride carbonica contiene $6{,}022 \cdot 10^{22}$ molecole. Quanto pesa?

Prima le moli, dividendo per $N_A$:
$$n = \frac{N}{N_A} = \frac{6{,}022 \cdot 10^{22}}{6{,}022 \cdot 10^{23}\ \mathrm{mol^{-1}}} = 0{,}1000\ \mathrm{mol}$$
Poi la massa, con $M = 44{,}01\ \mathrm{g/mol}$:
$$m = 0{,}1000\ \mathrm{mol} \cdot 44{,}01\ \mathrm{g/mol} = 4{,}401\ \mathrm{g}$$
```

```ad-warning
Dividere per il numero di Avogadro invece di moltiplicare
Da moli a particelle si moltiplica per $N_A$: il risultato è un numero enorme. Se trovi qualcosa come $3{,}32 \cdot 10^{-24}$ molecole, meno di una molecola, hai diviso. Anche il contrario vale: da particelle a moli si divide.
```

## Composizione percentuale

La **composizione percentuale** di un composto dice quanta parte della sua massa, in percentuale, è dovuta a ciascun elemento. Per un elemento $X$ che compare $k$ volte nella formula:

$$\%X = \frac{k \cdot A_X}{M} \cdot 100$$

dove $A_X$ è la massa atomica dell'elemento e $M$ la massa molare del composto. Le percentuali di tutti gli elementi sommano a $100\%$, a meno degli arrotondamenti.

```ad-example
Esempio 10: l'acqua
In $\mathrm{H_2O}$, con $M = 18{,}02\ \mathrm{g/mol}$:
$$\%\mathrm{O} = \frac{16{,}00}{18{,}02} \cdot 100 = 88{,}8\% \qquad \%\mathrm{H} = \frac{2 \cdot 1{,}01}{18{,}02} \cdot 100 = 11{,}2\%$$
Quasi tutta la massa dell'acqua è ossigeno, anche se gli atomi di idrogeno sono il doppio: ogni atomo di ossigeno pesa quanto sedici atomi di idrogeno.
```

```ad-example
Esempio 11: l'azoto nella caffeina
La caffeina ha formula $\mathrm{C_8H_{10}N_4O_2}$: nel disegno i quattro atomi di azoto sono in blu e i due di ossigeno in rosso. Qual è la percentuale in massa di azoto?

```molecola
% nome: mole-caffeina-azoto
% alt: Caffeina in formula scheletrica: due anelli uniti, con i quattro atomi di azoto evidenziati in blu e i due atomi di ossigeno evidenziati in rosso
% svg: mole-caffeina-azoto-f8b2e24d.svg 183x168
smiles: Cn1cnc2c1c(=O)n(C)c(=O)n2C
evidenzia: [#7] blu; [#8] rosso
legenda: caffeina, C8H10N4O2
```

La massa molare è
$$8 \cdot 12{,}01 + 10 \cdot 1{,}01 + 4 \cdot 14{,}01 + 2 \cdot 16{,}00 = 96{,}08 + 10{,}10 + 56{,}04 + 32{,}00 = 194{,}22\ \mathrm{g/mol}$$
e l'azoto pesa $4 \cdot 14{,}01 = 56{,}04$, quindi
$$\%\mathrm{N} = \frac{56{,}04}{194{,}22} \cdot 100 = 28{,}9\%$$
In $10{,}0\ \mathrm{g}$ di caffeina ci sono quindi $10{,}0 \cdot \frac{56{,}04}{194{,}22} = 2{,}885\ldots \approx 2{,}89\ \mathrm{g}$ di azoto.
```

```ad-example
Esempio 12: tutti gli elementi del glucosio
Nel glucosio, $\mathrm{C_6H_{12}O_6}$ con $M = 180{,}18\ \mathrm{g/mol}$ (esempio 4):
$$\%\mathrm{C} = \frac{72{,}06}{180{,}18} \cdot 100 = 40{,}0\% \qquad \%\mathrm{H} = \frac{12{,}12}{180{,}18} \cdot 100 = 6{,}7\% \qquad \%\mathrm{O} = \frac{96{,}00}{180{,}18} \cdot 100 = 53{,}3\%$$
Controllo: $40{,}0 + 6{,}7 + 53{,}3 = 100{,}0$.
```

```ad-warning
Contare gli atomi al posto della massa
Nell'acqua due atomi su tre sono di idrogeno, ma l'idrogeno non è il $66{,}7\%$ della massa: è l'$11{,}2\%$. La composizione percentuale si fa con le masse, cioè moltiplicando ogni numero di atomi per la sua massa atomica. E se l'elemento compare più volte nella formula, al numeratore va $k \cdot A_X$, non $A_X$ da sola.
```
