# Isomeria

L'etanolo, l'alcol del vino, e il dimetiletere, un gas che si usa come propellente nelle bombolette spray, hanno la stessa formula bruta: $\mathrm{C_2H_6O}$. Due atomi di carbonio, sei di idrogeno e uno di ossigeno, eppure l'etanolo bolle a 78 °C e il dimetiletere a −24 °C. Quello che cambia è il modo in cui gli atomi sono legati: nell'etanolo l'ossigeno sta in fondo alla catena e porta un idrogeno, nel dimetiletere sta in mezzo ai due carboni. Composti come questi si chiamano isomeri, e in chimica organica sono la regola: con la formula $\mathrm{C_8H_{18}}$ si possono costruire 18 alcani diversi.

```molecole
% nome: isomeria-etanolo-dimetiletere
% alt: Etanolo e dimetiletere nella formula di struttura: nell'etanolo l'ossigeno è legato a un carbonio e a un idrogeno, nel dimetiletere è legato ai due carboni
% svg: isomeria-etanolo-dimetiletere-9a7afc6a.svg 298x124
colonne: 2
CCO | etanolo | idrogeni: tutti | carboni: si
COC | dimetiletere | idrogeni: tutti | carboni: si
```

## Che cosa sono gli isomeri

Gli **isomeri** sono composti diversi che hanno la stessa formula bruta. La formula bruta dice quanti atomi di ogni elemento ci sono nella molecola; non dice come sono legati tra loro né come sono disposti nello spazio, e proprio lì stanno le differenze tra due isomeri.

Gli isomeri si dividono in due grandi famiglie. Negli isomeri di struttura gli atomi sono legati in un ordine diverso. Negli stereoisomeri gli atomi sono legati nello stesso ordine, ma sono disposti in modo diverso nello spazio. Ognuna delle due famiglie ha i suoi tipi:

| Famiglia | Tipo | Che cosa cambia | Esempio |
|---|---|---|---|
| Isomeria di struttura | di catena | lo scheletro degli atomi di carbonio | pentano e 2-metilbutano |
| | di posizione | la posizione di un gruppo o di un doppio legame | propan-1-olo e propan-2-olo |
| | di gruppo funzionale | il gruppo funzionale | etanolo e dimetiletere |
| Stereoisomeria | geometrica (cis/trans, E/Z) | la disposizione attorno a un doppio legame o a un anello | cis- e trans-but-2-ene |
| | ottica | la disposizione attorno a un carbonio chirale | (R)- e (S)-acido lattico |

Per decidere se due molecole sono isomeri, la prima cosa da fare è contare gli atomi: se le formule brute sono diverse, le molecole non sono isomeri, per quanto si somiglino. Se le formule sono uguali, bisogna controllare che non siano la stessa molecola disegnata in due modi.

```ad-warning
Scambiare due disegni della stessa molecola per due isomeri
Una molecola si può disegnare girata, ribaltata o con la catena piegata in un altro modo, e resta la stessa molecola. I due disegni qui sotto sembrano diversi, ma in tutti e due la catena più lunga ha quattro carboni e c'è un $\mathrm{CH_3}$ sul secondo: sono tutti e due il 2-metilbutano. Per controllare, cerca la catena più lunga in ciascun disegno e guarda dove sono attaccati i gruppi.

```molecole
% nome: isomeria-stessa-molecola
% alt: Due disegni dello stesso 2-metilbutano: il secondo è girato e piegato in un altro modo, ma la catena più lunga ha sempre quattro carboni con un metile sul secondo
% svg: isomeria-stessa-molecola-0dcf8eb5.svg 218x125
colonne: 2
CCC(C)C | disegno 1
CC(C)CC | disegno 2 | ruota: 60
```
```

## Isomeria di struttura

Gli **isomeri di struttura** (detti anche isomeri costituzionali) hanno la stessa formula bruta ma gli atomi legati in un ordine diverso. Sono composti diversi a tutti gli effetti: hanno temperature di ebollizione diverse, spesso densità e solubilità diverse, e a volte si comportano in modo diverso nelle reazioni.

### Isomeria di catena

Negli isomeri di catena cambia lo scheletro degli atomi di carbonio: una catena lunga e lineare in un isomero, più corta e ramificata in un altro. La formula $\mathrm{C_5H_{12}}$ ha tre isomeri: il pentano, con cinque carboni in fila; il 2-metilbutano, con una catena di quattro e un ramo; il 2,2-dimetilpropano, con una catena di tre e due rami sullo stesso carbonio. Nel disegno la catena principale di ognuno è colorata e numerata.

```molecole
% nome: isomeria-pentani
% alt: I tre isomeri di C5H12 in formula scheletrica, con la catena principale colorata e numerata: pentano con cinque carboni in fila, 2-metilbutano con una catena di quattro e un metile sul carbonio 2, 2,2-dimetilpropano con una catena di tre e due metili sul carbonio 2
% svg: isomeria-pentani-6df4960c.svg 570x108
colonne: 3
CCCCC | pentano | catena: 0 1 2 3 4
CCC(C)C | 2-metilbutano | catena: 4 2 1 0
CC(C)(C)C | 2,2-dimetilpropano | catena: 0 1 2
```

I tre isomeri bollono a temperature diverse: circa 36 °C il pentano, 28 °C il 2-metilbutano e 10 °C il 2,2-dimetilpropano. Più la molecola è ramificata, più è compatta, e meno superficie offre alle molecole vicine: le forze di attrazione tra le molecole sono più deboli e serve meno energia per separarle.

### Isomeria di posizione

Negli isomeri di posizione lo scheletro è lo stesso, e cambia il punto in cui si trova un gruppo o un doppio legame. Nel propan-1-olo il gruppo $\mathrm{-OH}$ sta sul carbonio in fondo alla catena, nel propan-2-olo su quello centrale; nel but-1-ene il doppio legame è tra il primo e il secondo carbonio, nel but-2-ene tra il secondo e il terzo. Il numero nel nome dice proprio la posizione.

```molecole
% nome: isomeria-posizione
% alt: Due coppie di isomeri di posizione: propan-1-olo e propan-2-olo, con il gruppo OH colorato in fondo o in mezzo alla catena; but-1-ene e but-2-ene, con il doppio legame colorato all'inizio o in mezzo alla catena
% svg: isomeria-posizione-5c512808.svg 272x196
colonne: 2
CCCO | propan-1-olo | evidenzia: [OX2H] verde
CC(O)C | propan-2-olo | evidenzia: [OX2H] verde
C=CCC | but-1-ene | evidenzia: C=C blu
CC=CC | but-2-ene | evidenzia: C=C blu
```

### Isomeria di gruppo funzionale

Negli isomeri di gruppo funzionale gli stessi atomi formano gruppi funzionali diversi, e quindi composti di famiglie diverse. È il caso dell'etanolo, un alcol, e del dimetiletere, un etere. Con tre carboni la formula $\mathrm{C_3H_8O}$ dà due alcoli, che sono isomeri di posizione tra loro, e un etere, il metossietano, che è un isomero di gruppo funzionale di tutti e due.

```molecole
% nome: isomeria-gruppo-funzionale
% alt: I tre isomeri di C3H8O: propan-1-olo e propan-2-olo con il gruppo OH colorato in verde, e il metossietano con l'ossigeno dell'etere colorato in blu tra due carboni
% svg: isomeria-gruppo-funzionale-fd996da7.svg 408x98
colonne: 3
CCCO | propan-1-olo | evidenzia: [OX2H] verde
CC(O)C | propan-2-olo | evidenzia: [OX2H] verde
CCOC | metossietano | evidenzia: [OX2]([#6])[#6] blu
```

Il gruppo funzionale decide buona parte del comportamento di una molecola, e per questo gli isomeri di gruppo funzionale sono le coppie più diverse tra loro: l'$\mathrm{-OH}$ degli alcoli forma legami a idrogeno, l'ossigeno di un etere no, e infatti il propan-1-olo bolle a 97 °C e il metossietano a 7 °C.

```ad-example
Esempio 1: riconoscere il tipo di isomeria
Per ogni coppia, di che tipo di isomeri si tratta?

```molecole
% nome: isomeria-esempio-coppie
% alt: Tre coppie di molecole, una per riga: propanale e propanone; 1-clorobutano e 2-clorobutano; butan-1-olo e 2-metilpropan-1-olo
% svg: isomeria-esempio-coppie-c45faf27.svg 398x285
colonne: 2
CCC=O | propanale
CC(=O)C | propanone
CCCCCl | 1-clorobutano
CCC(Cl)C | 2-clorobutano
CCCCO | butan-1-olo
CC(C)CO | 2-metilpropan-1-olo
```

Prima coppia. Il propanale e il propanone sono tutti e due $\mathrm{C_3H_6O}$. Nel propanale il doppio legame con l'ossigeno è in fondo alla catena (un'aldeide), nel propanone è sul carbonio centrale (un chetone): i gruppi funzionali sono diversi, quindi sono isomeri di gruppo funzionale.

Seconda coppia. Tutti e due sono $\mathrm{C_4H_9Cl}$, con la stessa catena di quattro carboni; il cloro è sul carbonio 1 in uno e sul carbonio 2 nell'altro. Sono isomeri di posizione.

Terza coppia. Tutti e due sono $\mathrm{C_4H_{10}O}$ e sono alcoli con l'$\mathrm{-OH}$ in fondo alla catena, ma nel butan-1-olo i quattro carboni sono in fila, nel 2-metilpropan-1-olo la catena è di tre carboni con un ramo. Cambia lo scheletro: sono isomeri di catena.
```

## Stereoisomeria

Gli **stereoisomeri** hanno la stessa formula bruta e gli atomi legati nello stesso ordine, ma disposti in modo diverso nello spazio. Per vederli servono disegni che mostrino la terza dimensione, e bisogna sapere quali movimenti di una molecola sono possibili e quali no.

Attorno a un legame semplice gli atomi possono ruotare liberamente: a temperatura ambiente i due $\mathrm{CH_3}$ dell'etano girano di continuo uno rispetto all'altro. Le diverse posizioni che una molecola prende girando attorno ai legami semplici si chiamano conformazioni, e non sono isomeri: si trasformano l'una nell'altra da sole, milioni di volte al secondo, e non si possono separare. Due disposizioni sono stereoisomeri solo se per passare dall'una all'altra bisogna rompere un legame.

### Isomeria geometrica

Attorno a un doppio legame gli atomi non possono ruotare: per girare, uno dei due legami che uniscono i carboni (il legame $\pi$) dovrebbe rompersi. I gruppi attaccati ai due carboni del doppio legame restano quindi dove sono, e questo dà due molecole diverse. Nel but-2-ene i due $\mathrm{CH_3}$ possono stare dalla stessa parte del doppio legame (isomero cis, dal latino "al di qua") o da parti opposte (isomero trans, "al di là").

```molecole
% nome: isomeria-but-2-ene
% alt: cis-but-2-ene, con i due gruppi CH3 dalla stessa parte del doppio legame, marcato Z; trans-but-2-ene, con i due CH3 da parti opposte, marcato E
% svg: isomeria-but-2-ene-7ec9d0d1.svg 326x80
colonne: 2
stereo: si
C/C=C\C | cis-but-2-ene
C/C=C/C | trans-but-2-ene
```

I due isomeri sono sostanze diverse: il cis-but-2-ene bolle a circa 4 °C, il trans-but-2-ene a circa 1 °C. Le sigle (Z) ed (E) scritte sul doppio legame sono i descrittori della sezione "E e Z": qui coincidono con cis e trans, ma non è sempre così.

Perché ci siano isomeri geometrici, ognuno dei due carboni del doppio legame deve avere due gruppi diversi. Se un carbonio ha due gruppi uguali, scambiarli non cambia niente: nel but-1-ene il primo carbonio ha due idrogeni, nel 2-metilbut-2-ene un carbonio ha due $\mathrm{CH_3}$, e nessuno dei due ha isomeri cis e trans. Nel disegno il carbonio con i due gruppi uguali è colorato.

```molecole
% nome: isomeria-senza-cis-trans
% alt: But-1-ene e 2-metilbut-2-ene, che non hanno isomeri geometrici: è colorato il carbonio del doppio legame che porta due gruppi uguali, due idrogeni nel but-1-ene e due CH3 nel 2-metilbut-2-ene
% svg: isomeria-senza-cis-trans-e9e68a48.svg 344x90
colonne: 2
stereo: si
C=CCC | but-1-ene | atomi: 0 giallo
CC=C(C)C | 2-metilbut-2-ene | atomi: 2 giallo
```

Anche un anello blocca la rotazione, perché per girare un carbonio dell'anello bisognerebbe rompere l'anello. Nell'1,4-dimetilcicloesano i due $\mathrm{CH_3}$ possono stare dalla stessa parte del piano dell'anello (cis) o da parti opposte (trans). Nel disegno il cuneo pieno indica un legame che esce dal foglio verso di te, il cuneo tratteggiato un legame che va dietro al foglio.

```molecole
% nome: isomeria-anello
% alt: cis-1,4-dimetilcicloesano, con i due CH3 disegnati tutti e due su cunei pieni, e trans-1,4-dimetilcicloesano, con un CH3 su un cuneo pieno e l'altro su un cuneo tratteggiato
% svg: isomeria-anello-c1cc459a.svg 542x98
colonne: 2
C[C@H]1CC[C@@H](C)CC1 | cis-1,4-dimetilcicloesano
C[C@H]1CC[C@H](C)CC1 | trans-1,4-dimetilcicloesano
```

### Le regole di priorità

Cis e trans funzionano quando sui due carboni del doppio legame c'è un gruppo uguale, o almeno un gruppo che si riconosce come "la catena". Se i quattro gruppi sono tutti diversi, dire quali stanno "dalla stessa parte" non ha più un senso preciso. Per questi casi, e per i carboni chirali dell'isomeria ottica, si usano le regole di priorità di Cahn, Ingold e Prelog (regole CIP), che mettono in ordine i gruppi attaccati a un atomo.

1. Si guarda l'atomo legato direttamente: ha la priorità più alta quello con il numero atomico più grande. Per esempio $\mathrm{Br} > \mathrm{Cl} > \mathrm{O} > \mathrm{N} > \mathrm{C} > \mathrm{H}$.
2. Se i due atomi legati direttamente sono uguali, si scrivono i tre atomi attaccati a ciascuno, in ordine dal numero atomico più grande al più piccolo, e si confrontano uno alla volta, dal primo: vince il gruppo che ha l'atomo più grande al primo punto di differenza. Se anche questi sono uguali, si va avanti di un altro legame.
3. Un doppio legame conta come se l'atomo all'altra estremità fosse ripetuto due volte.

Qualche esempio. Tra $\mathrm{-CH_2CH_3}$ e $\mathrm{-CH_3}$ il primo atomo è un carbonio in tutti e due; attaccati al carbonio ci sono $(\mathrm{C, H, H})$ nell'etile e $(\mathrm{H, H, H})$ nel metile, e al primo posto $\mathrm{C} > \mathrm{H}$: vince l'etile. Tra $\mathrm{-CH_2OH}$, con $(\mathrm{O, H, H})$, e $\mathrm{-CH(CH_3)_2}$, con $(\mathrm{C, C, H})$, vince $\mathrm{-CH_2OH}$, perché al primo posto $\mathrm{O} > \mathrm{C}$, anche se l'altro gruppo ha più atomi. Il gruppo $\mathrm{-COOH}$ conta come $(\mathrm{O, O, O})$: un ossigeno del doppio legame, ripetuto due volte, e quello dell'$\mathrm{-OH}$.

```ad-warning
Mettere in ordine i gruppi per grandezza
La priorità non dipende da quanto è grande il gruppo o da quanto pesa: si decide al primo atomo diverso. $\mathrm{-OH}$ (massa 17) viene prima di $\mathrm{-CH_2CH_2CH_3}$ (massa 43), perché l'ossigeno ha numero atomico 8 e il carbonio 6; $\mathrm{-Cl}$ viene prima di $\mathrm{-COOH}$ anche se il $\mathrm{-COOH}$ pesa di più.
```

### E e Z

Con le regole di priorità si trova, su ognuno dei due carboni del doppio legame, il gruppo con la priorità più alta. Se i due gruppi con la priorità più alta stanno dalla stessa parte del doppio legame, l'isomero è **Z** (dal tedesco zusammen, "insieme"); se stanno da parti opposte, è **E** (entgegen, "opposto"). Il descrittore si scrive tra parentesi davanti al nome: (Z)-but-2-ene.

Nel but-2-ene su ogni carbonio c'è un $\mathrm{CH_3}$ e un $\mathrm{H}$, e il $\mathrm{CH_3}$ ha la priorità più alta: il cis è Z e il trans è E, come mostrava il disegno. Non è sempre così, e il 2-clorobut-2-ene lo fa vedere.

```ad-example
Esempio 2: un isomero Z con i metili da parti opposte
Il (Z)-2-clorobut-2-ene ha sul carbonio 2 un $\mathrm{CH_3}$ e un $\mathrm{H}$, sul carbonio 3 un $\mathrm{Cl}$ e un $\mathrm{CH_3}$.

```molecola
% nome: isomeria-clorobutene
% alt: (Z)-2-clorobut-2-ene: i due CH3 stanno da parti opposte del doppio legame, il cloro sta dalla stessa parte del CH3 del carbonio 2; il doppio legame è marcato Z
% svg: isomeria-clorobutene-8f6d20d7.svg 192x93
stereo: si
smiles: C/C=C(\Cl)C
legenda: (Z)-2-clorobut-2-ene
```

Sul carbonio 2 vince il $\mathrm{CH_3}$ sull'$\mathrm{H}$ ($\mathrm{C} > \mathrm{H}$). Sul carbonio 3 vince il $\mathrm{Cl}$ sul $\mathrm{CH_3}$ ($\mathrm{Cl} > \mathrm{C}$). Nel disegno il $\mathrm{CH_3}$ del carbonio 2 e il $\mathrm{Cl}$ stanno dalla stessa parte del doppio legame, quindi l'isomero è Z. Eppure i due $\mathrm{CH_3}$ stanno da parti opposte: guardando solo la catena di carbonio lo si chiamerebbe trans.
```

```ad-example
Esempio 3: la priorità si decide al secondo atomo
Il 3-metilpent-2-ene ha sul carbonio 2 un $\mathrm{CH_3}$ e un $\mathrm{H}$, sul carbonio 3 un $\mathrm{CH_3}$ e un $\mathrm{CH_2CH_3}$.

```molecola
% nome: isomeria-metilpentene
% alt: (E)-3-metilpent-2-ene: il CH3 del carbonio 2 e l'etile del carbonio 3 stanno da parti opposte del doppio legame; il doppio legame è marcato E
% svg: isomeria-metilpentene-b97beba2.svg 201x88
stereo: si
smiles: C/C=C(\C)CC
legenda: (E)-3-metilpent-2-ene
```

Sul carbonio 2 vince il $\mathrm{CH_3}$. Sul carbonio 3 i due gruppi cominciano tutti e due con un carbonio; al secondo atomo l'etile ha $(\mathrm{C, H, H})$ e il metile $(\mathrm{H, H, H})$, quindi vince l'etile. Nel disegno il $\mathrm{CH_3}$ del carbonio 2 e l'etile stanno da parti opposte: l'isomero è E.
```

```ad-warning
Pensare che cis voglia dire sempre Z
Cis e trans guardano due gruppi uguali, o la catena; Z ed E guardano i gruppi con la priorità più alta. Nel but-2-ene coincidono, nel 2-clorobut-2-ene no. Quando i gruppi sono tutti diversi, usa E e Z.
```

### Isomeria ottica

Le tue mani sono una l'immagine allo specchio dell'altra, ma non si possono sovrapporre: un guanto destro non entra nella mano sinistra. Un oggetto che non si può sovrapporre alla sua immagine allo specchio si dice **chirale** (dal greco cheir, "mano"). Anche molte molecole sono chirali, e la ragione più comune è un carbonio chirale.

Un **carbonio chirale** (o stereocentro) è un atomo di carbonio legato a quattro gruppi tutti diversi. Le due disposizioni possibili dei quattro gruppi attorno a quel carbonio sono una l'immagine allo specchio dell'altra, e nessuna rotazione trasforma l'una nell'altra: per farlo bisognerebbe staccare due gruppi e scambiarli di posto. Le due molecole che si ottengono sono due stereoisomeri detti **enantiomeri**: molecole che sono l'una l'immagine speculare dell'altra e non si possono sovrapporre.

Per riconoscere un carbonio chirale si guardano i gruppi interi, non solo l'atomo legato direttamente. Nel butan-2-olo il carbonio 2 porta un $\mathrm{H}$, un $\mathrm{-OH}$, un $\mathrm{-CH_3}$ e un $\mathrm{-CH_2CH_3}$: quattro gruppi diversi, il carbonio è chirale. Nel pentan-3-olo il carbonio 3 porta un $\mathrm{H}$, un $\mathrm{-OH}$ e due $\mathrm{-CH_2CH_3}$ uguali: non è chirale, e la molecola non ha enantiomeri.

```molecole
% nome: isomeria-centri
% alt: Butan-2-olo, con il carbonio 2 colorato perché porta quattro gruppi diversi, e pentan-3-olo, con il carbonio 3 colorato in grigio perché porta due gruppi etile uguali e non è chirale
% svg: isomeria-centri-a4f0125c.svg 272x95
colonne: 2
CCC(C)O | butan-2-olo | atomi: 2 giallo
CCC(O)CC | pentan-3-olo | atomi: 2 grigio
```

Alcuni carboni non sono mai chirali: un $\mathrm{CH_3}$ o un $\mathrm{CH_2}$, che hanno almeno due idrogeni uguali, e un carbonio con un doppio legame, che ha solo tre gruppi. In un anello un carbonio può essere chirale se i due tratti di anello che partono da lui sono diversi, come nel carvone più avanti.

```ad-note
Molecole con più carboni chirali
Una molecola con $n$ carboni chirali ha al massimo $2^n$ stereoisomeri: con due carboni chirali, fino a quattro. Possono essere meno quando la molecola ha una simmetria interna: l'acido tartarico ha due carboni chirali ma solo tre stereoisomeri.
```

### Configurazione R e S

Due enantiomeri hanno lo stesso nome, e per distinguerli si scrive la configurazione del carbonio chirale, R o S, che si trova con le regole di priorità.

1. Metti in ordine di priorità i quattro gruppi legati al carbonio chirale, da 1 (priorità più alta) a 4.
2. Guarda la molecola con il gruppo 4, che spesso è un idrogeno, rivolto lontano da te, dietro al foglio.
3. Segui i gruppi 1, 2, 3 nell'ordine: se giri in senso orario la configurazione è **R** (dal latino rectus, "destro"), se giri in senso antiorario è **S** (sinister, "sinistro").

Nelle formule scheletriche l'idrogeno del carbonio chirale di solito non si disegna. Se dal carbonio partono tre linee e una è un cuneo pieno, l'idrogeno sta dietro al foglio, ed è già nella posizione giusta: guardi 1, 2, 3 nel disegno così com'è. Se invece una delle tre linee è un cuneo tratteggiato, l'idrogeno viene verso di te: trovi il senso di rotazione nel disegno e poi lo inverti.

L'acido lattico, che si forma nei muscoli sotto sforzo e nello yogurt, ha un carbonio chirale legato a $\mathrm{-OH}$, $\mathrm{-COOH}$, $\mathrm{-CH_3}$ e $\mathrm{H}$. Ecco i due enantiomeri, con la configurazione scritta accanto al carbonio chirale.

```molecole
% nome: isomeria-acido-lattico
% alt: I due enantiomeri dell'acido lattico: a sinistra il (R), con il CH3 su un cuneo pieno, a destra il (S), con il CH3 su un cuneo tratteggiato; nei due disegni COOH è a sinistra e OH in basso a destra
% svg: isomeria-acido-lattico-40668944.svg 362x108
colonne: 2
stereo: si
C[C@@H](O)C(=O)O | (R)-acido lattico
C[C@H](O)C(=O)O | (S)-acido lattico
```

```ad-example
Esempio 4: la configurazione dell'acido lattico
Le priorità sono: 1 l'$\mathrm{-OH}$ (ossigeno, numero atomico 8); 2 il $\mathrm{-COOH}$, con $(\mathrm{O, O, O})$ attaccati al carbonio; 3 il $\mathrm{-CH_3}$, con $(\mathrm{H, H, H})$; 4 l'$\mathrm{H}$.

Nel disegno di sinistra l'$\mathrm{-OH}$ è in basso a destra, il $\mathrm{-COOH}$ a sinistra, il $\mathrm{-CH_3}$ in alto a destra su un cuneo pieno. Il cuneo pieno dice che l'idrogeno sta dietro al foglio, quindi si legge il disegno così com'è: da $\mathrm{OH}$ in basso a destra, a $\mathrm{COOH}$ a sinistra, a $\mathrm{CH_3}$ in alto a destra, si gira in senso orario. La configurazione è R.

Nel disegno di destra i gruppi hanno la stessa posizione, ma il $\mathrm{-CH_3}$ è su un cuneo tratteggiato: va dietro al foglio, e l'idrogeno viene verso di te. Il giro 1, 2, 3 nel disegno è ancora orario, e va invertito: la configurazione è S. Scambiare cuneo pieno e cuneo tratteggiato vuol dire guardare la molecola allo specchio, con il foglio come specchio.
```

```ad-example
Esempio 5: l'alanina
L'alanina è uno degli amminoacidi che formano le proteine. Il suo carbonio chirale porta $\mathrm{-NH_2}$, $\mathrm{-COOH}$, $\mathrm{-CH_3}$ e $\mathrm{H}$.

```molecola
% nome: isomeria-alanina
% alt: L'alanina delle proteine: COOH a sinistra, NH2 in basso a destra, CH3 in alto a destra su un cuneo tratteggiato; il carbonio chirale è marcato S
% svg: isomeria-alanina-72d4ee55.svg 111x105
stereo: si
smiles: C[C@H](N)C(=O)O
legenda: (S)-alanina
```

Priorità: 1 l'$\mathrm{-NH_2}$ (azoto, numero atomico 7), 2 il $\mathrm{-COOH}$, 3 il $\mathrm{-CH_3}$, 4 l'$\mathrm{H}$. Nel disegno da $\mathrm{NH_2}$ in basso a destra a $\mathrm{COOH}$ a sinistra a $\mathrm{CH_3}$ in alto a destra si gira in senso orario; il $\mathrm{CH_3}$ è su un cuneo tratteggiato, quindi l'idrogeno viene verso di te e il senso va invertito. La configurazione è S. L'alanina delle proteine è tutta di questa forma, che la biochimica chiama anche L-alanina.
```

```ad-warning
Dimenticare di invertire quando l'idrogeno è davanti
Il senso di rotazione si legge con il gruppo 4 lontano da te. Se il gruppo 4 è su un cuneo pieno, o se l'idrogeno sottinteso viene in avanti perché un altro gruppo è sul cuneo tratteggiato, il giro che vedi nel disegno va invertito.
```

### La luce polarizzata

Due enantiomeri hanno la stessa temperatura di fusione, la stessa temperatura di ebollizione, la stessa densità e la stessa solubilità in acqua. Si comportano in modo diverso solo con altre cose chirali, e una di queste è la luce polarizzata, cioè luce che oscilla in un solo piano. Quando la luce polarizzata attraversa la soluzione di un enantiomero, il piano di oscillazione ruota di un certo angolo; l'altro enantiomero lo ruota dello stesso angolo nel verso opposto. Per questo gli enantiomeri si chiamano anche isomeri ottici. Lo strumento che misura la rotazione è il polarimetro.

L'enantiomero che ruota il piano in senso orario (per chi guarda verso la sorgente di luce) si dice destrogiro e si indica con (+); quello che lo ruota in senso antiorario si dice levogiro e si indica con (−). Una miscela con le stesse quantità dei due enantiomeri, detta miscela racemica, non ruota il piano, perché gli effetti opposti si annullano.

```ad-warning
Confondere R e S con (+) e (−)
R e S vengono da una regola sul disegno; (+) e (−) da una misura con il polarimetro, e non si ricavano l'uno dall'altro. L'(S)-acido lattico è destrogiro, (+); l'(R)-carvone è levogiro, (−).
```

### Enantiomeri e organismi viventi

Gli enzimi e i recettori del nostro corpo sono fatti di amminoacidi chirali, e sono chirali a loro volta: come una mano destra riconosce un guanto destro, un recettore può legare un enantiomero e non l'altro. Il carvone ne è l'esempio più noto: l'(R)-carvone ha l'odore della menta romana (quella delle gomme da masticare), l'(S)-carvone quello dei semi di cumino dei prati e dell'aneto. Le due molecole differiscono solo per la disposizione dei gruppi attorno al carbonio chirale dell'anello, e il naso le distingue.

```molecole
% nome: isomeria-carvone
% alt: I due enantiomeri del carvone: un anello a sei atomi con un gruppo chetonico, e sul carbonio chirale dell'anello il gruppo laterale su un cuneo pieno nell'(R)-carvone e su un cuneo tratteggiato nell'(S)-carvone
% svg: isomeria-carvone-da459a9e.svg 354x129
colonne: 2
stereo: si
CC1=CC[C@H](CC1=O)C(=C)C | (R)-carvone
CC1=CC[C@@H](CC1=O)C(=C)C | (S)-carvone
```

Nel carvone il carbonio chirale sta nell'anello: porta un $\mathrm{H}$, il gruppo laterale e due tratti di anello, uno che arriva al gruppo $\mathrm{C{=}O}$ dopo un solo $\mathrm{CH_2}$ e uno che ci arriva dall'altra parte, passando per il doppio legame. I due tratti sono diversi, quindi i gruppi sono quattro gruppi diversi.

Con i farmaci la differenza tra enantiomeri può essere molto più seria. La talidomide fu venduta dal 1957, soprattutto in Germania, come sedativo e contro la nausea, anche alle donne in gravidanza, come miscela racemica dei due enantiomeri. Fu ritirata nel 1961, quando si capì che causava gravi malformazioni ai feti: nacquero con malformazioni circa diecimila bambini.

```molecole
% nome: isomeria-talidomide
% alt: I due enantiomeri della talidomide: due anelli uniti da un carbonio chirale, marcato R in quello di sinistra e S in quello di destra
% svg: isomeria-talidomide-c9032c44.svg 546x170
colonne: 2
stereo: si
O=C1CC[C@@H](N2C(=O)c3ccccc3C2=O)C(=O)N1 | (R)-talidomide
O=C1CC[C@H](N2C(=O)c3ccccc3C2=O)C(=O)N1 | (S)-talidomide
```

La storia che si racconta spesso è che l'(R)-talidomide fosse il sedativo e l'(S)-talidomide il veleno, e che vendere solo l'enantiomero buono avrebbe evitato la tragedia. È vera solo in parte. L'idrogeno del carbonio chirale della talidomide si stacca e si riattacca facilmente, e nel corpo i due enantiomeri si trasformano l'uno nell'altro nel giro di poche ore: anche prendendo solo l'(R)-talidomide, nel sangue si forma una miscela dei due. Un farmaco con il solo enantiomero "buono" non avrebbe evitato il danno. Oggi la talidomide si usa ancora, sotto controlli molto stretti, contro un tumore del sangue (il mieloma multiplo) e contro alcune complicazioni della lebbra.
