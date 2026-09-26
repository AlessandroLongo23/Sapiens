# Enti geometrici, segmenti e angoli

Generatore: `geometria-enti` (`src/lib/exercises/v2/generators/geometria-enti.ts`).
Verifica indipendente: `scripts/exercises/checkers/geometria_enti.py`. Lezione collegata:
`docs/lezioni/riscritte/58-geometria-enti.md` (note in `docs/lezioni/note/58-geometria-enti.md`,
sezione "Per il generatore").

Gli esercizi si reggono sul testo, senza figure: lunghezze di segmenti con i punti medi, il tipo di un
angolo dalla sua misura, gradi e primi, complementari, supplementari ed esplementari, i quattro angoli
di due rette incidenti e le bisettrici, e per ultimi i problemi risolti con un'equazione. La
notazione è quella della lezione: $AB = 8$ cm per la lunghezza, $\widehat{AOB} = 50^\circ$ per la
misura, lettere greche per gli angoli senza nome, primi scritti $37^\circ 25'$, virgola decimale con
`{,}`. Il testo dei problemi a parole sta nel `problem` come righe `\text{…}` scritte con `textBlock`,
come nel livello 7 di `equazioni-primo-grado`; la pagina lo mostra come paragrafo.

## Si costruisce dalla risposta

Si scelgono prima i numeri che rendono bella la risposta, poi si scrive il testo: lunghezze intere
che danno metà intere o con $,5$; angoli pari quando servono le metà; la soluzione $x$ intera nei
problemi, da cui si ricavano il totale e la differenza del testo. Nessun esercizio si cerca per
tentativi sul risultato, tranne gli scarti dei casi degeneri (risposta uguale a un dato, angolo
uguale al suo complementare).

## Rappresentazione

`params` contiene i dati come li dice il testo, e niente di ricavato dalla risposta, tranne `x` al
livello 7, che il verificatore ricalcola:

- livello 1: `story` (`mn`, `mc`, `an`, `mb`), `AB` e `BC`, oppure `AC` e `AB` per `mb`;
- livello 2: `name` (l'angolo in LaTeX), `measure`, `case` (il tipo);
- livello 3: `case` (`somma` o `differenza`), `g1`, `p1`, `g2`, `p2` (gradi e primi dei due angoli);
- livello 4: `case` (`complementare`, `supplementare`, `esplementare`), `angle`, `phrasing`
  (`trova` oppure `coppia`);
- livello 5: `case`, `deg`, `min`;
- livello 6: `case` (`opposto`, `adiacente`, `bisettrici-adiacenti`, `bisettrici-consecutivi`), poi
  `given`, `asked`, `angle` per le rette incidenti, `a` (e `b`) per le bisettrici;
- livello 7: `story`, i dati (`AC`, `k`, `d`, `pair`, `form`), `ask`, `equation` (LaTeX, la stessa dei
  passaggi) e `x`.

Tipo di risposta: `number` per una lunghezza in cm o una misura in gradi interi (livelli 1, 4, 6, 7),
con il valore razionale esatto (`"23/2"` per $11{,}5$ cm); `choice` per il tipo di angolo (livello 2)
e per i risultati in gradi e primi (livelli 3 e 5), che nessun tipo di risposta aperta sa scrivere
oggi. Le opzioni di una lunghezza sono `11{,}5 \text{ cm}`, di un angolo `45^\circ`, in gradi e
primi `56^\circ 15'` con `values` `["56", "15"]`.

## Livello 1: segmenti adiacenti e punto medio

Esempio 1 della lezione e la fine dell'esempio 2. Quattro storie, circa 1 su 4 ciascuna:

- `mn`: $AB$ e $BC$ adiacenti, $M$ e $N$ punti medi di $AB$ e $BC$, quanto è lungo $MN$;
- `mc`: $M$ punto medio di $AB$, quanto è lungo $MC$;
- `an`: $N$ punto medio di $BC$, quanto è lungo $AN$;
- `mb`: $AC$ lungo $s$ cm, $B$ su $AC$ con $AB = a$ cm, $M$ punto medio di $AC$, quanto è lungo $MB$
  (quando $B$ sta tra $A$ e $M$ e quando sta oltre $M$).

Vincoli: $AB$ e $BC$ interi da 2 a 20 cm e diversi; per `mb` $AC$ da 8 a 30 cm e $1 \le AB < AC$; la
risposta è positiva, intera o con $,5$, e non è uno dei numeri del testo.

Esempi: "I segmenti $AB$ e $BC$ sono adiacenti, con $AB = 3$ cm e $BC = 20$ cm. $M$ è il punto medio
di $AB$ e $N$ è il punto medio di $BC$. Quanto è lungo $MN$?" $MN = 1{,}5 + 10 = 11{,}5$ cm. "Il
segmento $AC$ è lungo $15$ cm e il punto $B$ sta su $AC$, con $AB = 4$ cm. $M$ è il punto medio di
$AC$. Quanto è lungo $MB$?" $AM = 7{,}5$ cm, $MB = 7{,}5 - 4 = 3{,}5$ cm.

Distrattori: la somma senza dividere per 2 ($AB + BC$), la metà di un solo segmento, la metà presa
sul segmento sbagliato ($AB + \frac{BC}{2}$ al posto di $\frac{AB}{2} + BC$), la metà della
differenza; per `mb` $BC$, $AM$, la metà di $AB$, $AM + AB$.

## Livello 2: che tipo di angolo è

La tabella delle misure della lezione. "L'angolo $\widehat{AOB}$ misura $135^\circ$. Che tipo di angolo
è?" Risposta a scelta tra nullo, acuto, retto, ottuso, piatto, concavo, giro. Quote: acuto e ottuso
circa 22% ciascuno, concavo 20%, retto, piatto e giro circa 10%, nullo 6%. Misure in gradi interi.
Un angolo oltre $180^\circ$ ha sempre il nome di una lettera greca, perché la lezione dice che
$\widehat{AOB}$ senza altre parole è l'angolo convesso.

Esempi: $\gamma = 277^\circ$, concavo ($180^\circ < 277^\circ < 360^\circ$); $\widehat{PQR} = 90^\circ$,
retto.

Distrattori: i tipi vicini nella tabella, con ordine casuale tra quelli alla stessa distanza (per
$135^\circ$ acuto o retto, piatto, concavo; per un concavo piatto, giro, ottuso, che è l'errore "più
grande di un retto vuol dire ottuso").

## Livello 3: gradi e primi

Esempio 3 e il riquadro "I primi non sono decimali". Metà somme e metà differenze, sempre con il
riporto o con il prestito:

- somma $g_1^\circ p_1' + g_2^\circ p_2'$, gradi da 10 a 80, primi da 10 a 59, $p_1 + p_2 > 60$;
- differenza $A^\circ a' - B^\circ b'$ con $a < b$, $A$ da 30 a 150, risultato di almeno un grado.

Il risultato ha i primi tra 1 e 59. Esempi: $25^\circ 48' + 30^\circ 27' = 55^\circ 75' = 56^\circ 15'$;
$69^\circ 31' - 22^\circ 56' = 68^\circ 91' - 22^\circ 56' = 46^\circ 35'$.

Distrattori: per la somma il risultato non finito ($55^\circ 75'$, stesso valore ma con i primi oltre
59, sbagliato proprio per questo), il riporto perso ($55^\circ 15'$), il riporto fatto a 100 quando
i primi superano 100, i primi non ridotti con il grado aggiunto; per la differenza il grado non tolto
($47^\circ 35'$), il piccolo tolto dal grande ($47^\circ 25'$), il prestito di 100 primi
($46^\circ 75'$). Poi valori vicini ($\pm 1^\circ$, $\pm 5'$, $\pm 10'$).

## Livello 4: complementare, supplementare, esplementare

Gradi interi. Quote: complementare 35%, supplementare 40%, esplementare 25% (la lezione cita gli
esplementari in una frase). Due scritture, metà ciascuna: "Trova il supplementare di un angolo di
$59^\circ$." e "Gli angoli $\alpha$ e $\beta$ sono supplementari e $\alpha = 64^\circ$. Quanto misura
$\beta$?". L'angolo va da $5^\circ$ al totale meno $5^\circ$ e non è uguale alla risposta ($45^\circ$
per il complementare, $90^\circ$, $180^\circ$).

Esempi: complementare di $32^\circ$, $58^\circ$; esplementare di $125^\circ$, $235^\circ$.

Distrattori: gli altri due ($90^\circ - \alpha$, $180^\circ - \alpha$, $360^\circ - \alpha$, quando
positivi: è il riquadro "Complementari e supplementari"), la somma al posto della differenza, poi
$\pm 10^\circ$ e valori vicini.

## Livello 5: complementare e supplementare con i primi

Esempio 4: $90^\circ = 89^\circ 60'$. Stesse quote del livello 4. "Trova il complementare di un angolo
di $37^\circ 25'$." Gradi da 2 al totale meno 3, primi da 1 a 59. Esempi: complementare di
$37^\circ 25'$, $52^\circ 35'$; supplementare di $58^\circ 17'$, $121^\circ 43'$.

Distrattori: il grado non tolto ($53^\circ 35'$), il prestito di 100 primi ($52^\circ 75'$), i primi
copiati ($53^\circ 25'$), gli altri totali ($142^\circ 35'$ per il complementare), poi valori vicini.

## Livello 6: rette incidenti e bisettrici

Esempi 6 e 7, riquadro "Opposti al vertice non vuol dire adiacenti". Quattro casi, circa 1 su 4:

- `opposto` e `adiacente`: "Due rette incidenti in $O$ formano quattro angoli, $\alpha$, $\beta$,
  $\gamma$ e $\delta$, uno dopo l'altro intorno a $O$. Se $\delta = 28^\circ$, quanto misura
  $\beta$?" L'ordine intorno a $O$ sostituisce la figura: due angoli a due posti di distanza sono
  opposti al vertice, due vicini sono adiacenti. Angolo da $20^\circ$ a $160^\circ$, mai $90^\circ$.
- `bisettrici-adiacenti`: $\widehat{AOB}$ e $\widehat{BOC}$ adiacenti, dato solo $\widehat{AOB}$ (pari,
  da $20^\circ$ a $160^\circ$), l'angolo tra le bisettrici: sempre $90^\circ$, trovato con le due metà.
- `bisettrici-consecutivi`: $\widehat{AOB}$ e $\widehat{BOC}$ consecutivi con misure pari diverse e
  somma sotto $180^\circ$, l'angolo tra le bisettrici è la metà della somma.

Esempi: $\delta = 28^\circ$, $\beta$ opposto, $28^\circ$; $\gamma = 30^\circ$, $\beta$ adiacente,
$150^\circ$; consecutivi di $52^\circ$ e $38^\circ$, $26^\circ + 19^\circ = 45^\circ$.

Distrattori: per le rette l'altro valore (opposto scambiato con adiacente), $360^\circ - \alpha$,
$90^\circ - \alpha$; per le bisettrici la somma senza metà ($180^\circ$, $a + b$), una sola metà, la
metà della differenza, $90^\circ$ per i consecutivi.

## Livello 7: problemi con un'equazione

Sì, il generatore tiene un livello di problemi risolti con un'equazione di primo grado, come gli
esempi 2 e 5 della lezione. Con questo livello l'arco di prerequisito `equazioni-primo-grado` di cui
parla la nota diventa giusto (vedi le domande in fondo). Cinque storie, circa 1 su 5:

- `segmento-rapporto`: $AC$ lungo $s$ cm, $B$ lo divide con $AB$ doppio, triplo, quadruplo o
  quintuplo di $BC$; si chiede $AB$ o $BC$. Equazione $kx + x = s$ con $x = BC$ da 2 a 15.
- `segmento-differenza`: $AB$ più lungo di $BC$ di $d$ cm; $x + d + x = s$.
- `angoli-rapporto`: due angoli complementari, supplementari o adiacenti, uno il $k$-plo
  dell'altro; si chiede il maggiore o il minore. $kx + x = 90$ o $180$, solo con $x$ intero.
- `angoli-differenza`: due angoli complementari, supplementari o adiacenti che differiscono di
  $d$; $x + d + x = 90$ o $180$.
- `angolo-multiplo`: l'angolo acuto il cui supplementare è il $k$-plo del complementare (esempio
  5, $k$ tra 3, 4, 6, 7, 10), l'angolo il cui supplementare è il $k$-plo dell'angolo stesso, l'angolo
  il cui complementare è il $k$-plo dell'angolo stesso.

I passaggi dicono che cos'è $x$, scrivono l'equazione, la risolvono e finiscono con il controllo sul
testo. Esempi: "Il segmento $AC$ è lungo $45$ cm e il punto $B$ lo divide in due parti, con $AB$
doppio di $BC$. Quanto è lungo $BC$?" $2x + x = 45$, $BC = 15$ cm. "Trova l'angolo acuto il cui
supplementare è il quadruplo del suo complementare." $180 - x = 4(90 - x)$, $x = 60$.

Distrattori: l'altra parte, il totale diviso per $k$ al posto di $k + 1$, la metà del totale, la
differenza tolta o aggiunta senza dividere, per `angolo-multiplo` il complementare o il supplementare
della soluzione e la soluzione delle altre due forme.

## Esercizi "brutti" da evitare

- Risposta uguale a un numero del testo (livello 1) o all'angolo dato (livello 4).
- Angoli di $0^\circ$ o $1^\circ$ come dato, un angolo retto tra due rette incidenti (i quattro
  angoli sono uguali e la domanda non insegna niente).
- Somme senza riporto e differenze senza prestito al livello 3: la difficoltà del livello è quella.
- Risultati in gradi e primi con $0'$ o con i primi oltre 59.
- $\widehat{AOB}$ per un angolo concavo.
- Metà che non si scrivono con un decimale solo: gli angoli da dimezzare sono pari.

## Livelli che vorrebbero una figura

Nessun livello ne ha bisogno per essere risolto. Il livello 6 la vorrebbe per i quattro angoli (oggi
"uno dopo l'altro intorno a $O$" fa da figura) e per le bisettrici; il livello 1 starebbe meglio con
il disegno dei segmenti sulla retta, come negli esempi 1 e 2. Non ci sono esercizi sul riconoscere
consecutivi, adiacenti e opposti al vertice da una descrizione (la nota li proponeva al livello 2):
senza figura la descrizione dovrebbe ripetere la definizione, e la domanda diventa un esercizio di
lettura.

## Verifiche fatte (26 settembre 2026)

- `sample.mts geometria-enti 1000 all 1 | verify.py`: PASS, 7.000 esercizi su 7.000, quote dei casi
  dentro gli intervalli. Con seed di partenza 7001: PASS.
- Esercizi diversi su 1.000 per livello (testo del problema distinto): 707, 556, 1.000, 575, 987,
  724, 453. Il livello 2 ha i casi retto, piatto, giro e nullo con una sola misura ciascuno, e variano
  solo per il nome dell'angolo; gli acuti, ottusi e concavi coprono quasi tutte le misure.
- Errori piantati, tutti bocciati: risposta cambiata (livelli 1, 4, 6, 7), opzione giusta spostata
  (tutti e sette i livelli), opzioni doppie (1, 6), opzione giusta scritta non finita ($55^\circ 75'$
  al posto di $56^\circ 15'$, livelli 3 e 5), misura cambiata con il tipo che non torna (2), dato
  cambiato solo in `params` (1), somma senza riporto (3), angolo uguale al complementare (4), opposto
  dichiarato adiacente (6), equazione con un numero cambiato (7), `x` sbagliata (7), angolo concavo
  scritto $\widehat{AOB}$ (2), livello inesistente.
- `review.mts` esce con 0; `width.mts`: nessuna formula del problema oltre 350 px (la più larga
  153 px, le differenze del livello 3), nessuna opzione oltre 252 px (la più larga 68 px).
- `steps-scan.mts`: niente prima di "fatto". `tsc` senza errori nel generatore, `eslint` pulito.

## Domande per la revisione

- Livello 7 e prerequisiti: con i problemi risolti con un'equazione la lezione chiede
  `equazioni-primo-grado`. Si aggiunge l'arco in `prerequisiti.md`, o si toglie il livello e i
  problemi restano solo negli esempi?
- Livello 2: basta la misura, o serve anche il caso "un angolo ottuso non ha complementare"
  (riquadro della lezione), che oggi non esce da nessuna parte perché il livello 4 ha risposte
  numeriche?
- Esplementari: la lezione li cita in una frase come termine di "alcuni libri", e qui valgono un
  quarto dei livelli 4 e 5. Se il libro in uso non li usa, si tolgono.
- Livello 6, bisettrici di angoli adiacenti: la risposta è sempre $90^\circ$. Va bene come verifica
  del risultato dell'esempio 7, ma chi se lo ricorda risponde senza conti.
- Livello 3: i distrattori con i primi oltre 59 ($55^\circ 75'$) hanno lo stesso valore della risposta
  e sono sbagliati per la forma. È l'errore del riquadro, ma uno studente potrebbe contestarlo.
