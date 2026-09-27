# Potenze con esponente razionale

Generatore: `radicali-esponente-razionale`
(`src/lib/exercises/v2/generators/radicali-esponente-razionale.ts`). Verifica indipendente:
`scripts/exercises/checkers/radicali_esponente_razionale.py`. Lezione collegata:
`docs/lezioni/riscritte/76-radicali-esponente-razionale.md` (nota in
`docs/lezioni/note/76-radicali-esponente-razionale.md`, sezione "Per il generatore", da cui vengono i
sette livelli).

Lo studente passa da un radicale a una potenza con esponente frazionario e ritorno, calcola potenze
con esponente razionale e usa le proprietà delle potenze per fare i conti tra radicali con indici
diversi. Ogni valore è una potenza di una sola base con esponente razionale: il generatore sceglie
prima la base e gli esponenti (la risposta), poi scrive il testo. Le lettere indicano numeri positivi,
come nella lezione, e la consegna lo dice ("con a > 0").

## Tipo di risposta

- Livelli 2, 3 e 5: `number`, un razionale ridotto (`"9"`, `"1/8"`, `"3/2"`).
- Livelli 1, 4, 6 e i primi due casi del livello 7: `expression`, con `value` in forma SymPy
  (`2**(5/6)`, `a**(17/12)`, `-(2**(9/10))`, `2**(-1/2)`) e `form`:
  - `"radical"` e `"power"` al livello 1, dove conta la scrittura e non il valore;
  - `"simplified"`: radicale con l'indice minimo e niente da portare fuori, la parte intera
    dell'esponente scritta fuori ($a\sqrt[12]{a^5}$, non $\sqrt[12]{a^{17}}$), nessun esponente
    frazionario rimasto;
  - `"rationalized"`: una frazione con il radicale al numeratore e un intero al denominatore
    ($\frac{\sqrt[3]{9}}{3}$).
- Livello 7, caso vero o falso: `choice` fin dall'inizio (quattro uguaglianze, una vera).

La variante a scelta multipla (`toChoice`) ha quattro opzioni distinte per valore, con i distrattori
presi dagli errori della lezione; un esercizio i cui errori tipici non danno tre valori diversi dalla
risposta si scarta, senza riempitivi.

## Regole comuni

- Esponenti scritti con la frazione, $a^{\frac{m}{n}}$, mai con la barra; esponente decimale con la
  virgola, `0{,}4`.
- Radicandi scritti come numero quando sono il risultato ($\sqrt[6]{32}$), come potenza al livello 1
  dove la scrittura è l'argomento ($\sqrt[3]{7^{2}}$).
- Mai base negativa sotto un esponente frazionario, tranne nelle uguaglianze false del livello 7.
- Mai `^{1}` nel testo; nessun `+ -` o `- -`.
- Risultati numerici con numeratore e denominatore al massimo 256; radicandi dei risultati al massimo
  1000, indici al massimo 12.

## Livello 1: dalla potenza al radicale e ritorno

Metà "Scrivi la potenza come radicale" ($7^{\frac{2}{3}} \to \sqrt[3]{7^{2}}$), metà "Scrivi il
radicale come potenza" ($\sqrt[5]{a^{3}} \to a^{\frac{3}{5}}$). Esponente $\frac{m}{n}$ ridotto, $n$ da
2 a 7, $m$ da 1 a 5, $m \neq n$ (anche $m > n$: $\sqrt[3]{7^{5}}$); basi 2, 3, 5, 6, 7, 10, 11 o la
lettera $a$ (circa 2 su 9).

Esempi: $11^{\frac{3}{5}} = \sqrt[5]{11^{3}}$; $\sqrt[6]{a} = a^{\frac{1}{6}}$.

Distrattori: indice ed esponente scambiati ($\sqrt[3]{11^{5}}$ oppure $11^{\frac{5}{3}}$), il reciproco
o l'esponente negativo, l'esponente preso come fattore ($\sqrt[5]{3 \cdot 11}$, $\frac{a}{6}$),
l'esponente del radicando dimenticato ($11^{\frac{1}{5}}$), il prodotto $m \cdot n$ come esponente.

## Livello 2: potenze con base potenza perfetta

$A^{\frac{m}{n}}$ con $A = c^n \le 256$, esponente positivo non intero, risultato $c^m \le 256$. I
passaggi fanno prima la radice e poi la potenza, come consiglia la lezione.

Esempi: $243^{\frac{2}{5}} = 9$; $64^{\frac{1}{6}} = 2$.

Distrattori: base per esponente ($243 \cdot \frac{2}{5} = \frac{486}{5}$), la radice senza la potenza
($3$), la radice moltiplicata per $m$ ($6$), il reciproco, il segno opposto.

## Livello 3: esponente negativo, base frazionaria, esponente decimale

- Esponente negativo (4 su 10): $A^{-\frac{m}{n}} = \frac{1}{c^m}$.
- Base frazionaria (3 su 10): $\left(\frac{p}{q}\right)^{\pm\frac{m}{n}}$ con $p$ e $q$ potenze
  $n$-esime, esponente negativo 7 volte su 10; il reciproco scambia numeratore e denominatore.
- Esponente decimale (3 su 10): $0{,}5$, $1{,}5$, $2{,}5$, $0{,}25$, $0{,}75$, $1{,}25$, $0{,}2$, $0{,}4$,
  $0{,}6$, $0{,}8$ e i negativi $-0{,}5$, $-1{,}5$, $-0{,}25$, $-0{,}75$, $-0{,}4$; il primo passaggio
  scrive la frazione ($0{,}75 = \frac{75}{100} = \frac{3}{4}$).

Esempi: $\left(\frac{4}{9}\right)^{-\frac{1}{2}} = \frac{3}{2}$; $16^{0{,}75} = 8$.

Distrattori: il risultato negativo ("l'esponente negativo rende negativo"), il reciproco dimenticato,
la base per l'esponente, la radice senza la potenza.

## Livello 4: un solo radicale da due radicali con indici diversi

Prodotto (6 su 10) o quoziente (4 su 10) di due radicali della stessa base (2, 3, 5 o 7), indici
diversi da 2 a 8, radicandi potenze della base fino a 81 ($\sqrt[3]{4}$, $\sqrt[5]{9}$), ogni radicale
già semplificato. L'esponente del risultato è tra 0 e 1 (la parte intera fuori arriva al livello 6), con
indice fino a 12.

Esempi: $\sqrt{2} \cdot \sqrt[3]{2} = \sqrt[6]{32}$; $\sqrt[3]{4} : \sqrt{2} = \sqrt[6]{2}$.

Distrattori (dal riquadro "Sommare o moltiplicare gli esponenti sbagliati"): gli esponenti moltiplicati
($\sqrt[6]{2}$), numeratori e denominatori sommati tra loro ($\sqrt[5]{4}$), la differenza al posto della
somma e viceversa, il quoziente degli esponenti, la sottrazione al contrario ($\frac{1}{\sqrt[6]{2}}$).

## Livello 5: tre potenze da portare alla stessa base

$A^{r} \cdot B^{s} : C^{t}$ oppure $A^{r} : B^{s} \cdot C^{t}$ (metà e metà), con $A$, $B$, $C$ potenze
diverse di 2 (da $4$ a $64$, 7 volte su 10) o di 3 ($9$, $27$, $81$). Ogni potenza, portata alla
base comune, ha esponente intero da $-3$ a $3$ (come nell'esempio 6 della lezione, $8^{\frac{2}{3}} =
2^{2}$); almeno un esponente è negativo; il risultato è $p^k$ con $|k| \le 3$.

Esempi: $8^{\frac{2}{3}} \cdot 4^{-\frac{1}{2}} : 16^{\frac{3}{4}} = \frac{1}{4}$;
$64^{\frac{1}{3}} \cdot 8^{-\frac{1}{3}} : 32^{-\frac{2}{5}} = 8$.

Distrattori: la divisione fatta come un prodotto (tutti gli esponenti sommati), il reciproco del
risultato, il segno degli esponenti negativi ignorato, i segni delle operazioni scambiati, il risultato
cambiato di segno.

## Livello 6: lettere, parte intera fuori e radicali annidati

- Prodotto (metà): due o tre radicali di $a$ con indici diversi da 2 a 6 e minimo comune multiplo fino
  a 12; l'esponente della somma è tra 1 e 3, non intero, e la parte intera si porta fuori
  ($\sqrt{a} \cdot \sqrt[3]{a^{2}} \cdot \sqrt[4]{a} = a\sqrt[12]{a^{5}}$).
- Annidati (metà): $\sqrt[n]{a^{u}\sqrt[m]{a^{v}}}$ con $n$ da 2 a 4, $u$ uguale a 1 (7 su 10) o 2, $m$
  da 2 a 5.

Esempi: $\sqrt[3]{a} \cdot \sqrt[4]{a^{3}} = a\sqrt[12]{a}$; $\sqrt{a\sqrt[3]{a^{2}}} = \sqrt[6]{a^{5}}$.

Distrattori: nel prodotto la parte intera dimenticata ($\sqrt[12]{a}$), portata fuori senza toglierla
dal radicando ($a\sqrt[12]{a^{13}}$), numeratori e denominatori sommati, esponenti moltiplicati; negli
annidati la radice esterna applicata solo al radicale interno, la radice esterna applicata solo ad $a^u$,
il fattore esterno dimenticato, gli esponenti sommati al posto della potenza di potenza.

## Livello 7: casi scomodi

- Radicando negativo (35 su 100): $\sqrt[3]{-4} \cdot \sqrt[6]{2} = -\sqrt[6]{32}$, indice dispari 3 o
  5, base 2 o 3; il passaggio porta fuori il segno meno prima di scrivere la potenza, come l'esempio 7.
  Distrattori: il segno perso, "Non ha significato", esponenti moltiplicati o sommati male.
- Risultato da razionalizzare (35 su 100): $B^{-\frac{m}{n}}$ con $B$ tra 2, 3, 5, 6, 7, 10, $n$ da 2
  a 4, a volte con esponente decimale ($2^{-0{,}5}$, $3^{-0{,}25}$); risposta
  $\frac{\sqrt[n]{B^{n-m}}}{B}$. Distrattori: il segno meno, il reciproco dimenticato
  ($\sqrt[3]{4}$), il radicale sbagliato al numeratore ($\frac{\sqrt[3]{4}}{2}$), l'indice al
  denominatore ($\frac{\sqrt{10}}{2}$). Il distrattore $\frac{1}{\sqrt{2}}$ non c'è: ha lo stesso valore.
- Vero o falso (30 su 100): "Quale uguaglianza è vera?", quattro uguaglianze da quattro famiglie
  diverse su cinque, una vera e tre false: radice di indice dispari di un negativo
  ($\sqrt[3]{-8} = -8^{\frac{1}{3}}$ vera, $(-8)^{\frac{1}{3}} = -2$ falsa perché non ha significato),
  potenza di potenza con base negativa ($\left[(-2)^{2}\right]^{\frac{1}{2}} = 2$ vera, $= -2$ falsa),
  somma ($(9 + 16)^{\frac{1}{2}} = 5$ vera, $= 7$ falsa), esponente negativo ($8^{-\frac{2}{3}} =
  \frac{1}{4}$ vera, $= -4$ falsa), indice ed esponente ($8^{\frac{2}{3}} = \sqrt[3]{8^{2}}$ vera,
  $= \sqrt{8^{3}}$ falsa). Nella stessa domanda non compaiono la versione vera e quella falsa della
  stessa famiglia. I passaggi dicono, per ogni uguaglianza, perché è vera o falsa.

Esempi: $10^{-\frac{1}{2}} = \frac{\sqrt{10}}{10}$; $\sqrt{2} \cdot \sqrt[5]{-4} = -\sqrt[10]{512}$.

## Da evitare

- Numeri grandi: basi oltre 256, radicandi dei risultati oltre 1000, indici oltre 12.
- Radicali non semplificati nel testo del livello 4 ($\sqrt[4]{4}$).
- Opzioni con lo stesso valore della risposta ma scritte in un'altra forma ($\frac{1}{\sqrt{2}}$ accanto
  a $\frac{\sqrt{2}}{2}$, $\sqrt[12]{2^{10}}$ accanto a $\sqrt[6]{32}$): il controllo le accetterebbe
  come distrattori solo se non sono nella forma richiesta, ma per lo studente sarebbero un tranello.
- Basi negative sotto esponenti frazionari fuori dal vero o falso.

## Verifica

Il controllo Python legge con un piccolo parser la notazione della lezione (potenze con esponente
frazionario o decimale, `\sqrt[n]{…}`, `\frac`, `\cdot`, `:`, prodotti sottintesi come
`a\sqrt[12]{a^{5}}`) e calcola con SymPy il valore esatto del problema, della risposta e di ogni
opzione, con $a$ positiva; una base negativa con esponente non intero solleva un errore ("non ha
significato"), la radice di indice dispari di un negativo è la radice reale. Controlla che la risposta
valga quanto il problema, che sia nella forma richiesta (radicando senza fattori da portare fuori e con
l'indice minimo, denominatore senza radicali, radicale o potenza al livello 1), che ogni opzione abbia il
valore dichiarato, che una sola opzione sia giusta e che nessun distrattore abbia il valore della
risposta. Riscrive il testo del problema dai `params` e lo confronta; controlla i vincoli di ogni
livello e le quote dei casi. Per il vero o falso ricalcola la verità di ogni uguaglianza dai suoi valori
e ne riscrive il testo.

- `sample.mts … 1000 all 1` e `… 1000 all 7001` con `verify.py`: PASS per tutti i 7.000 esercizi.
- Errori piantati, tutti bocciati su tutti e due i seed (script `g76-plant.py` nello scratchpad): risposta
  cambiata (livello 2); opzione giusta spostata (livello 3); risposta $\sqrt[12]{1024}$ al posto di
  $\sqrt[6]{32}$ (stesso valore, non semplificata); risposta lasciata come potenza $2^{\frac{5}{6}}$;
  denominatore non razionalizzato $\frac{1}{\sqrt[3]{4}}$; parte intera tolta dal testo della risposta
  (livello 6); $\sqrt[10]{a^{13}}$ al posto di $a\sqrt[10]{a^{3}}$ (stesso valore); livello 1 con la
  potenza come risposta al posto del radicale; distrattore uguale alla risposta; opzione con un valore
  diverso dal suo testo; $A = 50$ al livello 2 (non è una potenza perfetta); esponente decimale scritto
  col punto; indice della risposta sbagliato nel vero o falso; due uguaglianze vere; testo di
  un'uguaglianza diverso dai suoi valori; segno perso nel radicando negativo; esponente $\frac{7}{2}$
  fuori intervallo al livello 1.
- `width.mts`: esce con 0. Formula del problema più larga 164 px su 350 (livello 5), opzione più larga
  143 px su 252 (livello 7, vero o falso).
- `review.mts`: esce con 0.

Esercizi diversi su 1.000 per livello (seed da 1; tra parentesi seed da 7001): livello 1 313 (309),
livello 2 55 (55), livello 3 231 (237), livello 4 130 (130), livello 5 915 (913), livello 6 145 (143),
livello 7 364 (357). Il livello 2 resta sotto 100 di proposito: con base fino a 256 e risultato fino a
256 le potenze $c^n$ con esponente $\frac{m}{n}$ sono 55 in tutto, cioè tutte quelle con numeri da
calcolo a mente; allargarlo vorrebbe dire basi come $361$ o $729$, che la lezione non usa.

## Figure

Nessun livello ne ha bisogno: sono tutti conti scritti.

## Domande per la revisione

- Il livello 7 mescola due tipi di risposta: `expression` per il radicando negativo e la
  razionalizzazione, `choice` per il vero o falso. Oggi il sito mostra solo la scelta multipla e non
  cambia niente; per le risposte aperte forse conviene separare il vero o falso in un livello a sé.
- Al livello 1 la risposta è un valore (`7**(2/3)`) con `form` `"radical"` o `"power"`: un controllo
  aperto solo sul valore accetterebbe la scrittura di partenza. Le due forme sono nuove rispetto a
  `"simplified"` e `"rationalized"` del brief.
- Il distrattore "esponente preso come fattore" ($243 \cdot \frac{2}{5} = \frac{486}{5}$) non è nei
  riquadri della lezione: l'ho preso dagli errori di chi confonde potenza e prodotto. Va bene, o meglio
  solo gli errori che la lezione nomina (con il rischio di non avere tre distrattori per $m = 1$)?
- Nel vero o falso, "$(-8)^{\frac{1}{3}} = -2$" è falsa perché il primo membro non ha significato. Alcuni
  libri ammettono la base negativa con indice dispari; se il libro in uso lo fa, questa famiglia va
  tolta.
