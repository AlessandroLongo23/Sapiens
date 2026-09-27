# Radicali e loro proprietà

Generatore: `numeri-reali-radici` (`src/lib/exercises/v2/generators/numeri-reali-radici.ts`).
Verifica indipendente: `scripts/exercises/checkers/numeri_reali_radici.py`. Lezione collegata:
"Radicali e loro proprietà" (`docs/lezioni/riscritte/72-numeri-reali-radici.md`), livelli proposti
nella sezione "Per il generatore" della nota `docs/lezioni/note/72-numeri-reali-radici.md`.

Sette livelli, nell'ordine della lezione: calcolare una radice, condizioni di esistenza, la radice di
una potenza ($\sqrt{x^2} = |x|$), semplificare un radicale numerico, semplificare con le lettere,
ridurre allo stesso indice, confrontare e ordinare. Ogni livello aggiunge una sola difficoltà.

Tutto si costruisce all'indietro: al livello 1 si sceglie la radice e si eleva; ai livelli 4 e 5 si
sceglie il radicale irriducibile e si moltiplicano indice ed esponenti per un numero $g$; al livello 6
si scelgono i radicali e il loro MCM; al livello 7 si scelgono i numeri e si scarta l'esercizio se
l'ordine dei radicandi coincide con quello giusto.

Il caso di ogni livello si estrae una volta per esercizio, prima dei tentativi, così gli scarti
dentro un caso non cambiano le quote; il controllo Python verifica le quote con `CASE_RANGES`.

## Regole comuni

- Radicali scritti `\sqrt{…}` con indice 2 e `\sqrt[n]{…}` altrimenti; esponenti tra graffe nei
  radicali con le lettere e nei prodotti di fattori (`2^{4} \cdot 3^{6}`), mai esponente 1.
- Decimali con la virgola `{,}`, frazioni sotto radice con `\dfrac`, come nella lezione.
- Polinomi come nella lezione: `2x - 6`, e con il coefficiente di $x$ negativo il termine noto
  davanti quando è positivo (`5 - x`, come nell'esempio 2).
- Ogni esercizio ha quattro opzioni distinte per valore e per LaTeX, una sola giusta. Quando la
  risposta non è già una scelta, le opzioni stanno in `params.options` e `toChoice` le mescola.
- Tipi di risposta: `number` al livello 1 quando la radice esiste; `choice` quando non esiste e ai
  livelli 2, 6 e 7; `expression` ai livelli 3, 4 e 5, con `value` in forma SymPy
  (`Abs(x - 3)`, `root(108, 5)`, `real_root(Abs(a)**3*b**2, 5)`) e, ai livelli 4 e 5,
  `form = "irreducible"`: il radicale finale deve avere MCD tra indice ed esponenti uguale a 1.
  È una forma nuova rispetto a `simplified` e `rationalized`, perché qui "semplificare" vuol dire
  dividere indice ed esponenti, come nella lezione (il trasporto fuori è nella lezione 73).

## Livello 1: calcolare una radice

Sei casi: radice quadrata di un intero (base da 2 a 20), radice cubica, quarta o quinta di un intero
(8, …, 1000; 16, …, 625; 32, 243), radice di una frazione (quadrata con termini fino a 12, cubica fino
a 5, quarta fino a 3, quinta con numeratore 1 o 2), radice di un decimale ($\sqrt{0{,}09}$, …,
$\sqrt{2{,}25}$; $\sqrt[3]{0{,}001}$, …, $\sqrt[3]{0{,}729}$), indice dispari con radicando negativo
(intero, frazione o decimale), indice pari con radicando negativo (non esiste in $\mathbb{R}$). Quote
2, 2, 1,5, 1,5, 2 e 1,5 su 10,5.

Esempi: $\sqrt{144} = 12$; $\sqrt[5]{-\dfrac{1}{32}} = -\dfrac{1}{2}$; $\sqrt[4]{-16}$ non esiste in
$\mathbb{R}$ (risposta a scelta: "non esiste in $\mathbb{R}$").

Distrattori: $\pm 12$ (la radice con due valori, riquadro della lezione), $-12$, il radicando diviso
per l'indice ($144 : 2 = 72$), la radice quadrata al posto di quella di indice più alto
($\sqrt[4]{81} \to 9$); per le frazioni la radice del solo numeratore o del solo denominatore e il
reciproco; per i decimali la virgola spostata ($\sqrt{0{,}09} \to 0{,}03$ o $3$); per l'indice dispari
con radicando negativo il risultato positivo e "non esiste in $\mathbb{R}$"; per l'indice pari con
radicando negativo $-2$, $2$ e $\pm 2$.

## Livello 2: condizioni di esistenza

Sei casi: radicando di primo grado con indice pari (2, 4 o 6), lo stesso con indice dispari (3 o 5),
radicando sempre positivo ($x^2 + 4$, $2x^2 + 3$), radicando che vale zero in un punto solo
($-x^2$, $-3x^2$, $-(x - 3)^2$), frazione con numeratore positivo sotto una radice di indice pari
($\sqrt{\dfrac{2}{x - 1}}$, $\sqrt{\dfrac{5}{3 - x}}$), frazione sotto una radice di indice dispari.
Quote 3, 1,5, 1, 1, 1,5 e 1 su 9. Nel primo grado il coefficiente di $x$ va da −5 a 5 (negativo in
circa un terzo dei casi), la soglia è intera tra −9 e 9 oppure una frazione con denominatore da 2 a 5,
il termine noto al massimo 30.

La risposta è una scelta tra condizioni: `ge:r`, `le:r`, `gt:r`, `lt:r`, `ne:r`, `eq:r`, `all`,
`none`, scritte $x \ge 3$, …, "ogni $x \in \mathbb{R}$", "nessun $x \in \mathbb{R}$". Il controllo
ricalcola l'insieme con `solveset` sui reali e lo confronta con quello di ogni opzione.

Esempi: $\sqrt[4]{5 - x}$, C.E.: $x \le 5$; $\sqrt{\dfrac{2}{x - 1}}$, C.E.: $x > 1$.

Distrattori: il verso non cambiato dividendo per un numero negativo, la soglia col segno sbagliato,
$>$ al posto di $\ge$, "ogni $x$" con indice pari (e la condizione dell'indice pari con indice
dispari), $\ge$ al posto di $>$ con il denominatore (riquadro della lezione), $x \neq 1$ senza il
segno della frazione, $x \ge 0$ e "nessun $x$" per il radicando sempre positivo, "nessun $x$" e
$x \le 0$ per $-x^2$.

## Livello 3: la radice di una potenza

Quattro casi: binomio alla potenza pari ($\sqrt{(x - 3)^2}$, $\sqrt[4]{(2x + 1)^4}$), monomio
($\sqrt{9x^2} = 3|x|$, $\sqrt[4]{a^4} = |a|$), binomio alla potenza dispari
($\sqrt[3]{(x - 3)^3} = x - 3$), trinomio quadrato di un binomio ($\sqrt{x^2 + 6x + 9} = |x + 3|$,
$\sqrt{4x^2 - 12x + 9} = |2x - 3|$). Quote 3, 2, 2 e 3 su 10. Il binomio è $px + s$ con $p$ da 1 a 3,
$s$ da −9 a 9, $\text{MCD}(p, s) = 1$.

La risposta è un'espressione senza radice (`Abs(x - 3)`, `3*Abs(x)`, `x - 3`). Il controllo la
confronta con `real_root` in 27 punti, da −20 a 20, così la base è negativa in qualche punto.

Distrattori: la base senza valore assoluto ($x - 3$), l'opposto ($3 - x$), il segno del termine noto
cambiato ($|x + 3|$), il valore assoluto con l'indice dispari; per il trinomio $|x| + 3$, cioè
$\sqrt{a + b} = \sqrt{a} + \sqrt{b}$; per il monomio $3x$, $9|x|$ e $-3x$.

## Livello 4: semplificare un radicale numerico

Tre casi: radicando scritto come numero da scomporre ($\sqrt[15]{32}$, $\sqrt[6]{625}$), radicando
scritto come prodotto di potenze ($\sqrt[10]{2^{4} \cdot 3^{6}}$), radicale già irriducibile
($\sqrt[6]{12}$, $\sqrt[6]{3^{4} \cdot 5}$). Quote 4,5, 3,5 e 2 su 10. Si sceglie un radicale
irriducibile con indice da 2 a 5, uno o due primi tra 2, 3, 5, 7 ed esponenti minori dell'indice,
radicando al massimo 500, poi si moltiplica per $g$ da 2 a 5; indice finale al massimo 20, radicando
scritto come numero al massimo 5000. Nel caso irriducibile un esponente ha un divisore comune con
l'indice e l'altro no.

Esempi: $\sqrt[15]{32} = \sqrt[3]{2}$; $\sqrt[10]{2^{4} \cdot 3^{6}} = \sqrt[5]{108}$.

Distrattori: diviso solo l'indice ($\sqrt[5]{2^{4} \cdot 3^{6}}$), divisi solo gli esponenti
($\sqrt[10]{108}$), diviso un esponente solo ($\sqrt[5]{2^{2} \cdot 3^{6}}$, riquadro della lezione),
diviso per un divisore di $g$ ($\sqrt[6]{625}$ per $\sqrt[12]{5^{8}}$, dove $g = 4$: stesso valore,
non irriducibile). Per i radicali irriducibili le "semplificazioni" che ignorano il fattore non divisibile ($\sqrt[6]{3^{4} \cdot 5} \to
\sqrt[3]{3^{2} \cdot 5}$). Il controllo confronta i valori esattamente ($\sqrt[m]{N} = \sqrt[n]{P}$
se e solo se $N^n = P^m$) e accetta un distrattore con lo stesso valore della risposta solo se non è
irriducibile.

## Livello 5: semplificare con le lettere

Quattro casi, come nell'esempio 5 della lezione: indice di partenza pari ed esponente finale dispari,
con il valore assoluto ($\sqrt[6]{x^2} = \sqrt[3]{|x|}$, $\sqrt[10]{a^{6} b^{4}} =
\sqrt[5]{|a|^{3} b^{2}}$, $\sqrt[4]{(x - 1)^{2}} = \sqrt{|x - 1|}$); indice pari ed esponenti finali
pari, senza ($\sqrt[6]{a^{4}} = \sqrt[3]{a^{2}}$); indice di partenza dispari, senza
($\sqrt[9]{a^{6}} = \sqrt[3]{a^{2}}$); radicando con esponente dispari sotto indice pari, dove le C.E.
danno la base non negativa e il valore assoluto non serve ($\sqrt[6]{x^{3}} = \sqrt{x}$,
$\sqrt[10]{(x - 2)^{5}} = \sqrt{x - 2}$). Quote 3,5, 2, 2 e 2,5 su 10. Basi: una lettera ($x$ o $a$),
un binomio $x \pm c$ con $c$ da 1 a 5, due lettere ($a$, $b$). Esponenti finali minori dell'indice
finale, esponenti di partenza al massimo 12, indice di partenza al massimo 15.

La consegna dice che le lettere possono avere qualunque valore reale per cui il radicale esiste
(la lezione 72 non sottintende lettere positive). Il controllo valuta risposta e opzioni anche con
valori negativi delle lettere (da −20 a 20 con una lettera, una griglia di 36 coppie con due),
soltanto dove il radicale di partenza esiste; controlla che il valore assoluto stia esattamente sugli
esponenti finali dispari quando l'indice di partenza è pari, leggendo le barre sul LaTeX, perché
SymPy scrive $|a|^2$ come $a^2$.

Distrattori: il valore assoluto dimenticato, il valore assoluto sulla lettera sbagliata, il valore
assoluto con l'indice dispari ($\sqrt[3]{|a|}$ per $\sqrt[9]{a^{3}}$), diviso solo l'indice, divisi
solo gli esponenti, diviso un esponente solo, diviso per un divisore di $g$ (stesso valore, non
irriducibile), indice ed esponenti divisi per numeri diversi. Il generatore scarta i candidati con
lo stesso valore e irriducibili (come $\sqrt{|x|}$ per $\sqrt[6]{x^{3}}$, uguale a $\sqrt{x}$ sulle
C.E.) e quelli con indice 1.

## Livello 6: ridurre allo stesso indice

Tre casi: due radicali numerici, tre radicali numerici, due o tre radicali con la lettera $x$
($\sqrt{x}$, $\sqrt[3]{x^{2}}$, $\sqrt[4]{x^{3}}$, come l'esempio 7). Quote 3,5, 4 e 2,5 su 10.
Indici diversi tra 2 e 6, MCM al massimo 12 e maggiore dell'indice più grande (così nessun radicale
resta com'è); radicandi numerici diversi tra 2, 3, 5, 6, 7, 10, al massimo 2000 dopo l'elevamento;
radicali di partenza irriducibili. Nel caso con la lettera i passaggi scrivono C.E.: $x \ge 0$.

La risposta è una scelta: le opzioni sono i radicali allo stesso indice separati da virgole
(`\sqrt[12]{64},\ \sqrt[12]{81},\ \sqrt[12]{125}`), con valore `12|64|81|125`. Il controllo verifica
che ogni radicale valga quello di partenza ($b^{k} = a^{L}$) e che l'indice sia il MCM.

Esempio: $\sqrt{2}$, $\sqrt[3]{3}$, $\sqrt[4]{5}$ diventano $\sqrt[12]{64}$, $\sqrt[12]{81}$,
$\sqrt[12]{125}$.

Distrattori: i radicandi non elevati ($\sqrt[12]{2}$, …), moltiplicati per il fattore invece che
elevati ($\sqrt[12]{12}$), elevati al proprio indice, elevati al fattore di un altro radicale, un
radicale solo lasciato com'era, l'indice uguale al prodotto degli indici (stesso valore, indice non
minimo); con la lettera gli esponenti sommati al fattore invece che moltiplicati. Si scartano le
opzioni che hanno gli stessi radicali della risposta in un altro ordine.

## Livello 7: confrontare e ordinare

Tre numeri da scrivere in ordine crescente. Tre casi: tre radicali positivi con almeno due indici
diversi tra 2, 3, 4 e 6 (esempio 9), un intero (2 o 3) con due radicali vicini a lui
($3$, $\sqrt[4]{80}$, $\sqrt{10}$), tre numeri negativi scritti come $\sqrt[3]{-3}$ o $-\sqrt{2}$, con
tutte e due le forme (esempio 10). Quote 6, 2 e 2 su 10. MCM degli indici al massimo 12, radicandi
allo stesso indice diversi e al massimo 5000, nessun radicale che sia un intero. Nei primi due casi
l'ordine dei radicandi scritti non è quello giusto: è la trappola del riquadro "Confrontare i
radicandi con indici diversi".

Le opzioni sono permutazioni scritte `A < B < C`, con valore `ord:i,j,k` (le posizioni nel testo).

Distrattori: l'ordine dei radicandi, l'ordine rovesciato (per i negativi è l'ordine dei valori
assoluti, l'errore di non rovesciare tra gli opposti), l'ordine degli indici, poi altre permutazioni.

## Esercizi diversi su 1.000

Contati sul testo del problema, seed da 1 a 1000: livello 1 172, livello 2 704, livello 3 197,
livello 4 349, livello 5 220, livello 6 544, livello 7 961. Il livello 1 e il livello 3 hanno pochi
esercizi possibili per natura (una radice esatta ha pochi radicandi piccoli), ma tutti sopra 100.

## Da evitare

- Radicandi enormi: al livello 1 al massimo 1000, al livello 6 al massimo 2000, al livello 7 5000.
- Il MCM uguale all'indice più grande al livello 6, che lascia un radicale com'è.
- Al livello 7, tre radicali già in ordine di radicando: la domanda non misurerebbe niente.
- Distrattori "giusti": un radicale con lo stesso valore e irriducibile, $|a|^2$ al posto di $a^2$.

## Figure

Nessun livello ha bisogno di una figura. Il livello 7 potrebbe mostrare i tre numeri sulla retta, ma
come dice la nota della lezione i punti cadono vicini (tra 1,41 e 1,59 nell'esempio 9) e le etichette
si sovrappongono.

## Verifica

- `sample.mts numeri-reali-radici 1000 all 1` e `… 1000 all 7001`, passati a `verify.py`: PASS,
  7.000 esercizi su 7.000 per ciascun seed, quote dei casi dentro gli intervalli.
- Errori piantati a mano, tutti bocciati: risposta cambiata (livello 1), opzione giusta spostata
  (livelli 1 e 7), indice pari con radicando negativo in params, opzione scritta diversamente dal suo
  valore, $\ge$ al posto di $>$ con il denominatore, caso sbagliato, valore assoluto dimenticato
  (livelli 3 e 5), testo diverso da params (livelli 3 e 7), radicale non semplificato come risposta,
  semplificato a metà (stesso valore, non irriducibile) come risposta e come opzione giusta, valore
  assoluto con l'indice dispari, valore assoluto superfluo su un esponente pari, indice comune non
  minimo, radicando sbagliato, opzioni doppie.
- `width.mts`: nessuna formula oltre i limiti; la più larga del problema 148 px (livello 3), l'opzione
  più larga 184 px (livello 6).
- `review.mts` esce con 0; lo script dei passaggi non trova formule che KaTeX non legge.

## Domande per la revisione

- Livello 5: la consegna dice che le lettere possono avere qualunque valore per cui il radicale
  esiste. Con le lezioni 73-76, che sottintendono lettere positive, uno studente potrebbe scrivere
  $\sqrt[3]{a}$ per $\sqrt[6]{a^{2}}$: il generatore lo considera sbagliato, come la lezione. Va
  bene, o la consegna deve essere più esplicita?
- Livello 1: "non esiste in $\mathbb{R}$" è una risposta solo a scelta multipla; una futura risposta
  aperta avrà bisogno di un modo per dirlo. E $\pm 3$ come distrattore è abbastanza tentante, o
  meglio un numero?
- Livello 6 con la lettera: la condizione $x \ge 0$ compare solo nei passaggi, non nel testo.
  Scriverla nel testo toglierebbe un pezzo del ragionamento; lasciarla fuori chiede allo studente di
  ricordarsela. Quale preferisci?
- Livello 4: la risposta ha il radicando come numero ($\sqrt[5]{108}$), come l'esempio 4. Qualche
  libro lo lascia scomposto ($\sqrt[5]{2^{2} \cdot 3^{3}}$): la scelta multipla accetta solo la prima
  forma.
