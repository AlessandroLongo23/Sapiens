# Amminoacidi e legame peptidico

Le proteine del tuo corpo, dall'emoglobina che porta l'ossigeno alla cheratina dei capelli, fino agli enzimi che digeriscono il cibo, sono catene di piccole molecole legate una dopo l'altra: gli amminoacidi. Gli esseri viventi costruiscono le proteine con venti amminoacidi, tutti fatti sullo stesso schema, e li uniscono sempre con lo stesso legame, il legame peptidico. Da come è fatto un amminoacido e da come si lega al successivo dipendono la forma di una proteina e quindi il lavoro che fa.

## Struttura di un α-amminoacido

Un **amminoacido** è una molecola che contiene un gruppo amminico, $-\mathrm{NH_2}$, e un gruppo carbossilico, $-\mathrm{COOH}$. Negli **α-amminoacidi**, che sono quelli delle proteine, i due gruppi sono legati allo stesso atomo di carbonio, il **carbonio α**. Il carbonio α porta anche un atomo di idrogeno e un quarto gruppo, la **catena laterale**, che si indica con R:

$$\mathrm{H_2N{-}CH(R){-}COOH}$$

La lettera α viene dalla nomenclatura tradizionale, che chiama α il primo carbonio dopo il gruppo carbossilico. I venti amminoacidi delle proteine hanno in comune tutto tranne la catena laterale: nella glicina R è un atomo di idrogeno, nell'alanina è un metile $-\mathrm{CH_3}$, nella serina è $-\mathrm{CH_2OH}$, nella fenilalanina contiene un anello benzenico.

Nella figura le parti comuni hanno sempre lo stesso colore: il gruppo amminico in blu, il carbonio α in giallo, il gruppo carbossilico in rosso. In verde c'è la catena laterale, l'unica parte che cambia.

```molecole
% nome: peptidi-struttura-generale
% alt: Alanina, serina e fenilalanina con il gruppo amminico in blu, il carbonio alfa in giallo, il gruppo carbossilico in rosso e la catena laterale in verde
% svg: peptidi-struttura-generale-a9fc349c.svg 678x137
colonne: 3
atomi: 0 blu
atomi: 1 giallo
atomi: 2 3 4 rosso
N[C@H](C(=O)O)C | alanina | evidenzia: [CH3] verde
N[C@H](C(=O)O)CO | serina | evidenzia: [CH2][OH] verde
N[C@H](C(=O)O)Cc1ccccc1 | fenilalanina | evidenzia: [CH2]c1ccccc1 verde
```

Il gruppo amminico è una base (come l'ammoniaca, può acquistare uno ione $\mathrm{H^+}$), il gruppo carbossilico è un acido (può cederlo): il nome "amminoacido" ricorda proprio questi due gruppi.

```ad-note
La prolina
In uno dei venti amminoacidi, la prolina, la catena laterale si richiude ad anello sull'azoto del gruppo amminico. L'azoto è legato a due atomi di carbonio e porta un solo idrogeno ($-\mathrm{NH}-$ invece di $-\mathrm{NH_2}$). La prolina si lega agli altri amminoacidi come tutti, ma il suo anello rende la catena meno flessibile.
```

## Gli amminoacidi delle proteine sono L

Nella glicina il carbonio α è legato a due atomi di idrogeno. In tutti gli altri amminoacidi è legato a quattro gruppi diversi ($-\mathrm{NH_2}$, $-\mathrm{COOH}$, $-\mathrm{H}$ e R), quindi è uno stereocentro: come hai visto nella lezione sull'isomeria, la molecola esiste in due forme che sono l'una l'immagine speculare dell'altra, due enantiomeri.

Per gli amminoacidi i due enantiomeri si chiamano **D** e **L**. La convenzione viene dalla proiezione di Fischer: si disegna la catena di atomi di carbonio in verticale con il gruppo $-\mathrm{COOH}$ in alto e la catena laterale in basso; se il gruppo $-\mathrm{NH_2}$ sta a sinistra l'amminoacido è L, se sta a destra è D. Le proteine di tutti gli esseri viventi sono fatte solo di amminoacidi L.

Con le regole di priorità di Cahn, Ingold e Prelog, gli stessi amminoacidi L sono quasi tutti S. La cisteina fa eccezione: è L come gli altri, ma è R. Nella figura il carbonio α è in viola, con la sua configurazione tra parentesi.

```molecole
% nome: peptidi-configurazione-l
% alt: L-alanina, L-serina e L-cisteina con il carbonio alfa marcato: S per alanina e serina, R per la cisteina
% svg: peptidi-configurazione-l-0e0038d5.svg 483x131
colonne: 3
stereo: si
N[C@H](C(=O)O)C | L-alanina
N[C@H](C(=O)O)CO | L-serina
N[C@H](C(=O)O)CS | L-cisteina
```

La disposizione nello spazio dei quattro gruppi è la stessa in tutti e tre: cambia la priorità dei gruppi. Nell'alanina e nella serina l'ordine è $-\mathrm{NH_2} > -\mathrm{COOH} > \mathrm{R} > -\mathrm{H}$, perché il carbonio del $-\mathrm{COOH}$ è legato a tre ossigeni (contando due volte quello del doppio legame), mentre quello di R è legato al massimo a un ossigeno. Nella cisteina il carbonio di R, $-\mathrm{CH_2SH}$, è legato a un atomo di zolfo, che ha numero atomico $16$ e batte l'ossigeno ($8$): la catena laterale sale al secondo posto, il $-\mathrm{COOH}$ scende al terzo, e con due priorità scambiate la lettera passa da S a R.

```ad-warning
Confondere L con S
D e L da una parte, R e S dall'altra sono due convenzioni diverse: D/L confronta la molecola con una proiezione di Fischer di riferimento, R/S dipende dai numeri atomici dei gruppi. Per gli amminoacidi delle proteine L corrisponde quasi sempre a S, ma la cisteina (L e R) mostra che non si può tradurre una lettera nell'altra senza fare il conto delle priorità.
```

## Lo zwitterione

Il gruppo carbossilico cede facilmente uno ione $\mathrm{H^+}$ e il gruppo amminico lo acquista. In acqua, quindi, un amminoacido non si trova nella forma senza cariche che si scrive di solito: il $-\mathrm{COOH}$ diventa $-\mathrm{COO^-}$ e il $-\mathrm{NH_2}$ diventa $-\mathrm{NH_3^+}$. La molecola che si ottiene ha una carica positiva e una negativa, e nel complesso è neutra: si chiama **zwitterione** (dal tedesco Zwitter, "ibrido").

$$\mathrm{H_2N{-}CH(R){-}COOH} \longrightarrow \mathrm{{}^{+}H_3N{-}CH(R){-}COO^-}$$

Gli amminoacidi solidi sono fatti di zwitterioni tenuti insieme dall'attrazione tra le cariche, come i sali: per questo sono solidi cristallini che si sciolgono bene in acqua e si decompongono ad alta temperatura invece di fondere.

La forma che prevale dipende dal pH. In una soluzione molto acida (pH 1) c'è tanto $\mathrm{H^+}$ che anche il gruppo carbossilico resta $-\mathrm{COOH}$, e l'amminoacido ha carica $+1$; in una soluzione molto basica (pH 12) il gruppo amminico perde il suo $\mathrm{H^+}$ e l'amminoacido ha carica $-1$. Tra i due estremi, e in particolare al pH del sangue e delle cellule (circa $7{,}4$, il **pH fisiologico**), un amminoacido con la catena laterale neutra è uno zwitterione.

| pH | Gruppo carbossilico | Gruppo amminico | Carica netta |
|---|---|---|---|
| molto acido (pH 1) | $-\mathrm{COOH}$ | $-\mathrm{NH_3^+}$ | $+1$ |
| intorno a 7 | $-\mathrm{COO^-}$ | $-\mathrm{NH_3^+}$ | $0$ |
| molto basico (pH 12) | $-\mathrm{COO^-}$ | $-\mathrm{NH_2}$ | $-1$ |

```molecole
% nome: peptidi-alanina-ph
% alt: L'alanina a pH 1 con carica +1, a pH 7 come zwitterione con carica 0, a pH 12 con carica -1
% svg: peptidi-alanina-ph-1693ea05.svg 543x113
colonne: 3
[NH3+][C@H](C(=O)O)C | pH 1: carica +1
[NH3+][C@H](C(=O)[O-])C | pH 7: zwitterione
N[C@H](C(=O)[O-])C | pH 12: carica -1
```

```ad-warning
Disegnare l'amminoacido a pH 7 senza cariche
A pH 7 la forma con $-\mathrm{COOH}$ e $-\mathrm{NH_2}$ c'è in quantità trascurabile. Se l'esercizio chiede la forma a pH fisiologico, il gruppo carbossilico va scritto $-\mathrm{COO^-}$ e il gruppo amminico $-\mathrm{NH_3^+}$.
```

```ad-note
Il punto isoelettrico
Il pH a cui la carica media delle molecole di un amminoacido è zero si chiama punto isoelettrico. Per gli amminoacidi con la catena laterale neutra è vicino a 6 (per l'alanina circa $6{,}0$); è più basso per quelli con una catena laterale acida e più alto per quelli con una catena laterale basica.
```

Nelle reazioni della lezione gli amminoacidi sono disegnati senza cariche, come fanno i libri: il disegno è più leggibile, e il legame peptidico unisce gli stessi atomi.

## Le catene laterali

La catena laterale decide come si comporta un amminoacido in acqua e quindi dove si sistema in una proteina. Gli amminoacidi si dividono in quattro gruppi secondo la loro catena laterale.

| Catena laterale | Cosa contiene | A pH 7 | Esempi |
|---|---|---|---|
| apolare | solo carbonio e idrogeno (o uno zolfo legato a due carboni) | senza carica | glicina, alanina, valina, leucina, isoleucina, fenilalanina, metionina |
| polare neutra | un gruppo $-\mathrm{OH}$, $-\mathrm{SH}$ o ammidico $-\mathrm{CONH_2}$ | senza carica | serina, treonina, cisteina, asparagina, glutammina, tirosina |
| acida | un secondo gruppo carbossilico | $-\mathrm{COO^-}$, carica negativa | acido aspartico, acido glutammico |
| basica | un secondo gruppo basico con l'azoto | $-\mathrm{NH_3^+}$ o simile, carica positiva | lisina, arginina, istidina |

Nelle figure che seguono gli amminoacidi sono disegnati come sono a pH 7, con la catena laterale in verde.

### Catene laterali apolari

Le catene laterali apolari sono fatte di carbonio e idrogeno, come gli idrocarburi: non formano legami a idrogeno con l'acqua e si dicono idrofobiche. In una proteina sciolta in acqua tendono a stare all'interno, lontano dall'acqua.

```molecole
% nome: peptidi-apolari
% alt: Glicina, alanina, valina, leucina, isoleucina e fenilalanina a pH 7, con la catena laterale apolare in verde
% svg: peptidi-apolari-9728b466.svg 636x310
colonne: 3
[NH3+]CC(=O)[O-] | glicina (Gly), R = H
[NH3+][C@H](C(=O)[O-])C | alanina (Ala) | atomi: 5 verde
[NH3+][C@H](C(=O)[O-])C(C)C | valina (Val) | atomi: 5 6 7 verde
[NH3+][C@H](C(=O)[O-])CC(C)C | leucina (Leu) | atomi: 5 6 7 8 verde
[NH3+][C@H](C(=O)[O-])[C@@H](C)CC | isoleucina (Ile) | atomi: 5 6 7 8 verde
[NH3+][C@H](C(=O)[O-])Cc1ccccc1 | fenilalanina (Phe) | atomi: 5 6 7 8 9 10 11 verde
```

La metionina ha uno zolfo nella catena laterale ($-\mathrm{CH_2CH_2SCH_3}$), ma lo zolfo è legato a due atomi di carbonio e la catena resta apolare.

### Catene laterali polari neutre

Le catene laterali polari contengono un gruppo $-\mathrm{OH}$ (serina, treonina, tirosina), un gruppo $-\mathrm{SH}$ (cisteina) o un gruppo ammidico $-\mathrm{CONH_2}$ (asparagina, glutammina). Formano legami a idrogeno con l'acqua e sono idrofile, ma a pH 7 non hanno carica.

```molecole
% nome: peptidi-polari
% alt: Serina, treonina, cisteina, asparagina, glutammina e tirosina a pH 7, con la catena laterale polare in verde
% svg: peptidi-polari-60a390ba.svg 765x286
colonne: 3
[NH3+][C@H](C(=O)[O-])CO | serina (Ser) | atomi: 5 6 verde
[NH3+][C@H](C(=O)[O-])[C@@H](C)O | treonina (Thr) | atomi: 5 6 7 verde
[NH3+][C@H](C(=O)[O-])CS | cisteina (Cys) | atomi: 5 6 verde
[NH3+][C@H](C(=O)[O-])CC(N)=O | asparagina (Asn) | atomi: 5 6 7 8 verde
[NH3+][C@H](C(=O)[O-])CCC(N)=O | glutammina (Gln) | atomi: 5 6 7 8 9 verde
[NH3+][C@H](C(=O)[O-])Cc1ccc(O)cc1 | tirosina (Tyr) | atomi: 5 6 7 8 9 10 11 12 verde
```

### Catene laterali acide

L'acido aspartico e l'acido glutammico hanno un secondo gruppo carbossilico nella catena laterale. A pH 7 anche questo ha ceduto il suo $\mathrm{H^+}$: la catena laterale è $-\mathrm{COO^-}$ e l'amminoacido ha carica netta $-1$. In questa forma si chiamano aspartato e glutammato.

```molecole
% nome: peptidi-acide
% alt: Acido aspartico e acido glutammico a pH 7, con la catena laterale in verde che termina con un gruppo carbossilato carico negativamente
% svg: peptidi-acide-32c0f427.svg 452x141
colonne: 2
[NH3+][C@H](C(=O)[O-])CC(=O)[O-] | acido aspartico (Asp) | atomi: 5 6 7 8 verde
[NH3+][C@H](C(=O)[O-])CCC(=O)[O-] | acido glutammico (Glu) | atomi: 5 6 7 8 9 verde
```

### Catene laterali basiche

La lisina, l'arginina e l'istidina hanno nella catena laterale un secondo gruppo con l'azoto che può acquistare $\mathrm{H^+}$. A pH 7 la lisina ($-\mathrm{NH_3^+}$) e l'arginina (il gruppo guanidinico, con la carica distribuita su tre azoti) hanno carica netta $+1$. L'istidina è un caso di confine: il suo anello acquista $\mathrm{H^+}$ intorno a pH 6, e a pH 7 è in gran parte senza carica, come nella figura.

```molecole
% nome: peptidi-basiche
% alt: Lisina e arginina a pH 7 con la catena laterale carica positivamente, e istidina con l'anello senza carica, catene laterali in verde
% svg: peptidi-basiche-c3cae54d.svg 867x141
colonne: 3
[NH3+][C@H](C(=O)[O-])CCCC[NH3+] | lisina (Lys) | atomi: 5 6 7 8 9 verde
[NH3+][C@H](C(=O)[O-])CCCNC(N)=[NH2+] | arginina (Arg) | atomi: 5 6 7 8 9 10 11 verde
[NH3+][C@H](C(=O)[O-])Cc1c[nH]cn1 | istidina (His) | atomi: 5 6 7 8 9 10 verde
```

```ad-note
Dove i libri non sono d'accordo
Alcuni amminoacidi stanno in gruppi diversi a seconda del libro. La glicina, con R = H, è a volte tra le polari; la cisteina e la tirosina sono a volte tra le apolari; l'istidina è sempre tra le basiche anche se a pH 7 è in gran parte senza carica. Negli esercizi di questa lezione si usano solo amminoacidi che tutti i libri classificano allo stesso modo.
```

## Il legame peptidico

Due amminoacidi si legano quando il gruppo carbossilico del primo reagisce con il gruppo amminico del secondo. Il carbossile perde il suo $-\mathrm{OH}$, il gruppo amminico perde un $\mathrm{H}$, e il carbonio si lega all'azoto: il nuovo legame $\mathrm{C{-}N}$ si chiama **legame peptidico**, e il gruppo $-\mathrm{CO{-}NH}-$ che si forma è un'ammide. L'$-\mathrm{OH}$ e l'$\mathrm{H}$ persi formano una molecola d'acqua, quindi la reazione è una **condensazione**: due molecole si uniscono e ne esce una piccola, l'acqua.

$$\text{amminoacido} + \text{amminoacido} \longrightarrow \text{dipeptide} + \mathrm{H_2O}$$

Nello schema la glicina e l'alanina formano il dipeptide glicilalanina. Ogni atomo ha il colore della molecola da cui viene: in blu gli atomi della glicina, in arancione quelli dell'alanina. Gli idrogeni che finiscono nell'acqua sono disegnati apposta. Il dipeptide è disegnato girato, con la glicina a destra: il suo gruppo amminico libero è l'$-\mathrm{NH_2}$ blu in fondo alla catena.

```reazione
% nome: peptidi-reazione-gly-ala
% alt: Glicina più alanina danno il dipeptide glicilalanina più acqua; gli atomi della glicina sono in blu e quelli dell'alanina in arancione, e nell'acqua l'ossigeno e un idrogeno sono blu, l'altro idrogeno è arancione
% svg: peptidi-reazione-gly-ala-c58db745.svg 720x150
reazione: [NH2:1][CH2:2][C:3](=[O:4])[O:5][H:12].[H:13][NH:6][C@@H:7]([CH3:8])[C:9](=[O:10])[OH:11]>>[NH2:1][CH2:2][C:3](=[O:4])[NH:6][C@@H:7]([CH3:8])[C:9](=[O:10])[OH:11].[H:12][O:5][H:13]
colora: si
larghezza: 720
altezza: 150
```

Nell'acqua l'ossigeno e uno dei due idrogeni sono blu: vengono dal gruppo carbossilico della glicina. L'altro idrogeno è arancione, e viene dal gruppo amminico dell'alanina. Il dipeptide, invece, ha tutti gli atomi della glicina tranne quelli dell'$-\mathrm{OH}$ e tutti quelli dell'alanina tranne un idrogeno.

```ad-warning
L'ossigeno dell'acqua viene dal carbossile
L'acqua non si forma dal gruppo amminico: l'azoto perde solo un idrogeno e resta nel dipeptide, legato al carbonio. L'ossigeno dell'acqua è quello dell'$-\mathrm{OH}$ del gruppo carbossilico.
```

La reazione inversa, in cui l'acqua rompe il legame peptidico e libera i due amminoacidi, è l'**idrolisi**. Nella digestione la fanno gli enzimi dello stomaco e dell'intestino; in laboratorio si ottiene scaldando il peptide con un acido forte.

```ad-note
Nelle cellule
Nelle cellule il legame peptidico non si forma mescolando due amminoacidi: la reazione diretta richiede energia e sarebbe lentissima. Si forma nei ribosomi, dove ogni amminoacido arriva legato a una molecola di RNA di trasporto e viene aggiunto alla catena nell'ordine scritto nel DNA. Il bilancio degli atomi però è lo stesso: per ogni legame peptidico un $-\mathrm{OH}$ e un $\mathrm{H}$ escono dagli amminoacidi.
```

### Come si scrive un dipeptide

1. Scrivi il primo amminoacido con il gruppo $-\mathrm{NH_2}$ a sinistra e il gruppo $-\mathrm{COOH}$ a destra.
2. Togli l'$-\mathrm{OH}$ dal suo gruppo carbossilico.
3. Scrivi il secondo amminoacido allo stesso modo e togli un $\mathrm{H}$ dal suo gruppo amminico.
4. Lega il carbonio del primo all'azoto del secondo: è il legame peptidico, e le due parti tolte formano $\mathrm{H_2O}$.
5. Controlla la formula: quella del dipeptide è la somma delle formule dei due amminoacidi meno $\mathrm{H_2O}$.

```ad-example
Esempio 1: il dipeptide Ala-Ser
Scriviamo il dipeptide formato dall'alanina ($\mathrm{C_3H_7NO_2}$) e dalla serina ($\mathrm{C_3H_7NO_3}$), con l'alanina al primo posto, e calcoliamo la sua massa molare.

L'alanina perde l'$-\mathrm{OH}$ del gruppo carbossilico, la serina un $\mathrm{H}$ del gruppo amminico, e il carbonio dell'alanina si lega all'azoto della serina:

$$\mathrm{H_2N{-}CH(CH_3){-}CO{-}NH{-}CH(CH_2OH){-}COOH}$$

Per la formula sommiamo gli atomi e togliamo quelli dell'acqua: $\mathrm{C_{3+3}H_{7+7-2}N_{1+1}O_{2+3-1}} = \mathrm{C_6H_{12}N_2O_4}$.

Con le masse atomiche (C $12{,}01$; H $1{,}01$; N $14{,}01$; O $16{,}00$) la massa molare dell'alanina è $89{,}11\ \mathrm{g/mol}$, quella della serina $105{,}11\ \mathrm{g/mol}$ e quella dell'acqua $18{,}02\ \mathrm{g/mol}$:

$$89{,}11 + 105{,}11 - 18{,}02 = 176{,}20\ \mathrm{g/mol}$$

Controllo dalla formula: $6 \cdot 12{,}01 + 12 \cdot 1{,}01 + 2 \cdot 14{,}01 + 4 \cdot 16{,}00 = 72{,}06 + 12{,}12 + 28{,}02 + 64{,}00 = 176{,}20\ \mathrm{g/mol}$.
```

### Il gruppo peptidico è rigido

Il legame peptidico non si comporta come un normale legame singolo $\mathrm{C{-}N}$. L'azoto ha un doppietto elettronico libero che può spostarsi verso il carbonio, mentre un doppietto del doppio legame $\mathrm{C{=}O}$ si sposta sull'ossigeno: il gruppo peptidico è un ibrido di risonanza tra due strutture limite.

```molecole
% nome: peptidi-risonanza
% alt: Le due strutture limite del gruppo peptidico: a sinistra con il doppio legame tra carbonio e ossigeno, a destra con il doppio legame tra carbonio e azoto, l'ossigeno negativo e l'azoto positivo
% svg: peptidi-risonanza-6b1805b5.svg 212x118
colonne: 2
evidenzia: [CX3](~O)~N giallo
CC(=O)NC | con C=O
CC([O-])=[NH+]C | con C=N
```

La struttura vera sta tra le due: il legame $\mathrm{C{-}N}$ ha in parte il carattere di un doppio legame, è più corto di un legame singolo e non può ruotare. Per questo i sei atomi del gruppo peptidico (il carbonio α del primo amminoacido, il $\mathrm{C}$, l'$\mathrm{O}$, l'$\mathrm{N}$, il suo $\mathrm{H}$ e il carbonio α del secondo) stanno sullo stesso piano, e la catena di una proteina si può piegare solo ruotando attorno ai legami dei carboni α.

## Dipeptidi e verso della catena

Un dipeptide ha due estremità diverse. Da una parte c'è un gruppo amminico libero: è l'**N-terminale**. Dall'altra c'è un gruppo carbossilico libero: è il **C-terminale**. Per convenzione i peptidi si scrivono dall'N-terminale, a sinistra, al C-terminale, a destra, con le sigle di tre lettere degli amminoacidi separate da un trattino: Gly-Ala è il dipeptide in cui la glicina ha il gruppo amminico libero e l'alanina ha il carbossile libero.

Gly-Ala e Ala-Gly sono due molecole diverse: hanno la stessa formula, $\mathrm{C_5H_{10}N_2O_3}$, ma il legame peptidico unisce atomi diversi. Sono isomeri di struttura. Nella figura l'N-terminale è in blu, il C-terminale in rosso e il legame peptidico in giallo.

```molecole
% nome: peptidi-gly-ala-ala-gly
% alt: I dipeptidi Gly-Ala e Ala-Gly affiancati, con l'N-terminale in blu, il C-terminale in rosso e il legame peptidico in giallo: nel primo il gruppo amminico libero è della glicina, nel secondo dell'alanina
% svg: peptidi-gly-ala-ala-gly-009372a4.svg 430x142
colonne: 2
evidenzia: [NX3H2] blu; [CX3](=O)[OX2H1] rosso; [CX3](=O)[NX3H1] giallo
NCC(=O)N[C@@H](C)C(=O)O | Gly-Ala | ruota: 180
N[C@@H](C)C(=O)NCC(=O)O | Ala-Gly
```

In Gly-Ala il metile dell'alanina sta vicino al C-terminale; in Ala-Gly sta vicino all'N-terminale.

```ad-warning
Gly-Ala e Ala-Gly non sono lo stesso dipeptide
L'ordine delle sigle dice quale amminoacido mette il gruppo carbossilico nel legame peptidico (il primo) e quale il gruppo amminico (il secondo). Invertire l'ordine dà un'altra molecola, con proprietà diverse.
```

```ad-example
Esempio 2: quanti dipeptidi diversi
Con glicina e alanina, contando anche i dipeptidi con due amminoacidi uguali, quanti dipeptidi diversi si possono formare? E con tutti e venti gli amminoacidi?

Al primo posto può esserci Gly o Ala, e al secondo lo stesso: Gly-Gly, Gly-Ala, Ala-Gly, Ala-Ala, cioè $2 \cdot 2 = 4$ dipeptidi.

Con venti amminoacidi le scelte sono $20$ per il primo posto e $20$ per il secondo: $20 \cdot 20 = 400$ dipeptidi. Un tripeptide ne ha $20^3 = 8000$, e una catena di $100$ amminoacidi $20^{100}$: è da questo numero enorme di sequenze possibili che nasce la varietà delle proteine.
```

## Tripeptidi, polipeptidi e proteine

Un dipeptide ha ancora un gruppo amminico e un gruppo carbossilico liberi, e può legarsi a un terzo amminoacido, poi a un quarto, e così via. Nel tripeptide Gly-Ala-Ser i legami peptidici, in giallo, sono due.

```molecola
% nome: peptidi-tripeptide
% alt: Il tripeptide Gly-Ala-Ser con i due legami peptidici in giallo, l'N-terminale della glicina in blu e il C-terminale della serina in rosso
% svg: peptidi-tripeptide-0f1bc6c4.svg 198x185
smiles: NCC(=O)N[C@@H](C)C(=O)N[C@@H](CO)C(=O)O
ruota: 180
evidenzia: [NX3H2] blu; [CX3](=O)[OX2H1] rosso; [CX3](=O)[NX3H1] giallo
legenda: Gly-Ala-Ser
```

La catena principale ripete sempre la stessa sequenza di tre atomi, $\mathrm{N{-}C_\alpha{-}C}$, e le catene laterali sporgono dai carboni α. Ogni legame peptidico unisce due amminoacidi vicini e libera una molecola d'acqua, quindi:

$$n \text{ amminoacidi in catena} \quad \longrightarrow \quad n - 1 \text{ legami peptidici e } n - 1 \text{ molecole d'acqua}$$

Una catena di pochi amminoacidi si chiama peptide o oligopeptide; una catena lunga si chiama **polipeptide**. Una **proteina** è formata da uno o più polipeptidi con una forma precisa e una funzione nella cellula. Il confine tra polipeptide e proteina non è fissato, ma di solito si parla di proteina oltre la cinquantina di amminoacidi.

```ad-example
Esempio 3: la massa del tripeptide
Calcoliamo la massa molare del tripeptide Gly-Ala-Ser.

Le masse molari dei tre amminoacidi sono $75{,}08\ \mathrm{g/mol}$ (glicina), $89{,}11\ \mathrm{g/mol}$ (alanina) e $105{,}11\ \mathrm{g/mol}$ (serina). I legami peptidici sono $3 - 1 = 2$, e si liberano due molecole d'acqua:

$$75{,}08 + 89{,}11 + 105{,}11 - 2 \cdot 18{,}02 = 269{,}30 - 36{,}04 = 233{,}26\ \mathrm{g/mol}$$

La formula è $\mathrm{C_8H_{15}N_3O_5}$, che dà lo stesso risultato: $8 \cdot 12{,}01 + 15 \cdot 1{,}01 + 3 \cdot 14{,}01 + 5 \cdot 16{,}00 = 233{,}26\ \mathrm{g/mol}$.
```

```ad-example
Esempio 4: i legami peptidici dell'insulina
L'insulina umana è formata da due catene, una di $21$ amminoacidi e una di $30$. Quanti legami peptidici contiene?

La formula $n - 1$ vale per ogni catena, perché ogni catena ha il suo N-terminale e il suo C-terminale: $21 - 1 = 20$ legami nella prima e $30 - 1 = 29$ nella seconda, $49$ in tutto. Contare $51 - 1 = 50$ come se fosse una catena sola sarebbe sbagliato: le due catene sono tenute insieme da ponti disolfuro tra cisteine, che non sono legami peptidici.
```

L'asparagina e la glutammina hanno un gruppo ammidico anche nella catena laterale. Quel gruppo somiglia a un legame peptidico, ma non unisce due amminoacidi: nel dipeptide Gly-Asn il legame peptidico (in giallo) è uno solo, e l'ammide della catena laterale (in grigio) non conta.

```molecola
% nome: peptidi-gly-asn
% alt: Il dipeptide Gly-Asn con l'unico legame peptidico in giallo e il gruppo ammidico della catena laterale dell'asparagina in grigio
% svg: peptidi-gly-asn-6011ce1a.svg 253x124
smiles: NCC(=O)N[C@@H](CC(N)=O)C(=O)O
evidenzia: [CX3](=O)[NX3H1] giallo; [CX3](=O)[NX3H2] grigio
legenda: Gly-Asn
```

```ad-warning
Contare le ammidi delle catene laterali
Un legame peptidico unisce il carbonio del carbossile di un amminoacido all'azoto del gruppo amminico del successivo, lungo la catena principale. Il gruppo $-\mathrm{CONH_2}$ di asparagina e glutammina è un'ammide ma non è un legame peptidico, come non lo sono i gruppi della catena laterale della lisina o dell'acido aspartico: nelle proteine le catene laterali non entrano nella catena principale.
```

## I livelli di struttura delle proteine

La forma di una proteina si descrive su quattro livelli, ognuno costruito sul precedente.

La **struttura primaria** è la sequenza degli amminoacidi, scritta dall'N-terminale al C-terminale. È tenuta insieme dai legami peptidici ed è scritta nel DNA: tutto il resto dipende da lei.

La **struttura secondaria** è il modo in cui tratti della catena principale si ripiegano in forme regolari: l'α-elica, una spirale, e il foglietto β, in cui tratti di catena stanno affiancati. Le tengono in piedi i legami a idrogeno tra il $\mathrm{C{=}O}$ di un gruppo peptidico e l'$\mathrm{N{-}H}$ di un altro, e sono possibili perché i gruppi peptidici sono piani e rigidi.

La **struttura terziaria** è la forma tridimensionale di tutta la catena. La decidono le catene laterali: quelle apolari si raccolgono all'interno, lontano dall'acqua; quelle polari e cariche restano all'esterno; le catene acide e basiche si attraggono con legami ionici; due cisteine vicine possono unire i loro atomi di zolfo in un **ponte disolfuro** $-\mathrm{S{-}S}-$, un legame covalente. Due cisteine legate così formano la cistina.

```molecola
% nome: peptidi-cistina
% alt: La cistina, due molecole di cisteina unite da un ponte disolfuro tra i due atomi di zolfo, evidenziato in giallo
% svg: peptidi-cistina-3180d250.svg 299x133
smiles: N[C@@H](CSSC[C@H](N)C(=O)O)C(=O)O
evidenzia: SS giallo
legenda: cistina
```

La **struttura quaternaria** riguarda le proteine formate da più catene, e descrive come le catene si sistemano una rispetto all'altra: l'emoglobina, per esempio, è formata da quattro catene.

Il calore, un pH molto acido o molto basico e alcune sostanze possono distruggere la struttura secondaria, terziaria e quaternaria di una proteina senza rompere i legami peptidici: è la **denaturazione**. L'albume dell'uovo che diventa bianco e solido in padella è una proteina denaturata. Con la forma la proteina perde anche la sua funzione, mentre la struttura primaria resta intatta.
