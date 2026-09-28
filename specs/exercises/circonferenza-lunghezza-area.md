# Lunghezza della circonferenza e area del cerchio

Generatore: `circonferenza-lunghezza-area`
(`src/lib/exercises/v2/generators/circonferenza-lunghezza-area.ts`). Verifica indipendente:
`scripts/exercises/checkers/circonferenza_lunghezza_area.py`. Lezione collegata: "Lunghezza della
circonferenza e area del cerchio" (`docs/lezioni/riscritte/99-circonferenza-lunghezza-area.md`), con la
nota `docs/lezioni/note/99-circonferenza-lunghezza-area.md` (sezione "Per il generatore").

Lo studente calcola circonferenza e area dal raggio o dal diametro, torna al raggio dalle misure date
con $\pi$ o con $\pi \approx 3{,}14$, calcola archi e settori con la proporzione sull'angolo al centro,
l'area della corona circolare, del segmento circolare di $90^\circ$ e di $60^\circ$ e di figure composte.
Niente figure: ogni esercizio si regge sul testo.

La nota propone nove livelli. Qui sono otto, nell'ordine della lezione: il livello 4 della nota (area
dalla circonferenza) è un caso del livello 2, perché è lo stesso passaggio all'indietro verso il raggio.
Sono uno in più dei sette abituali perché la lezione ha otto parti distinte (circonferenza e area, formule
inverse, approssimazione, arco, settore, corona, segmento, figure composte), ognuna con i suoi errori.

## Rappresentazione

- Il testo sta nel `problem`, come righe `\text{...}` scritte con `textBlock`; il `prompt` è
  "Risolvi il problema." oppure, quando il risultato contiene $\pi$, "Risolvi il problema. Lascia
  indicato π nel risultato."
- Risposta `number` (un intero esatto in `answer.value`) quando il risultato non ha $\pi$: raggi,
  diametri, angoli, giri. Risposta `expression` quando ce l'ha: `answer.value` è una stringa SymPy
  (`12*pi`, `9*pi-18`, `6*pi-9*sqrt(3)`), `answer.latex` la stessa misura senza unità.
- Le misure con $\pi$ sono esatte e ridotte, scritte come nella lezione: $12\pi$, $\frac{9}{2}\pi$,
  $9\pi - 18$, $64 - 16\pi$, $6\pi - 9\sqrt{3}$. Il primo termine è positivo; tra i termini positivi viene
  prima la costante ($48 + 2\pi$).
- Unità come la lezione: lunghezze `10\pi\text{ cm}`, aree `16\pi\ \text{cm}^2`, angoli `60^\circ`, giri
  `350\text{ giri}`. Le quattro opzioni della scelta multipla hanno tutte l'unità della risposta.
- `params.case` dice il caso, `params.unit` l'unità, `params.value` e `params.wrong` la risposta e gli
  errori tipici come coefficienti `[costante, π, π², √3]`. Il controllo non legge i dati dai `params`:
  li rilegge dal testo.

## Regole comuni

- Notazione della lezione: $C$ per la circonferenza, $A$ per l'area, $r$ e $R$ per i raggi, $d$ per il
  diametro, $\ell$ per l'arco, $\alpha$ per l'angolo al centro in gradi; pedici in parole
  ($A_{\text{settore}}$, $A_{\text{corona}}$, $A_{\text{segmento}}$); divisioni scritte con i due punti
  ($62{,}8 : 3{,}14$), come negli esempi 1 e 2; virgola decimale `{,}`.
- Dati interi, tranne le misure approssimate del livello 3 (decimali finiti con al più due cifre).
- Risposte senza $\pi$ intere; risposte con $\pi$ con coefficienti interi (le frazioni compaiono solo
  in qualche distrattore, come $\frac{9}{2}\pi$).
- Distrattori presi dagli avvisi della lezione; se non bastano, la stessa misura con il coefficiente di
  $\pi$ spostato di 1 o 2 (mai fino a farlo sparire), o il numero spostato di 1 (10 per gli angoli).
  Le opzioni sono diverse come numeri, positive, e per angoli e giri intere; gli angoli restano sotto
  $360^\circ$.
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).

## Livello 1: circonferenza e area dal raggio o dal diametro

Quattro casi alla pari: $C$ dal raggio ($r$ da 2 a 25), $C$ dal diametro ($d$ da 3 a 40, anche dispari),
$A$ dal raggio ($r$ da 2 a 20), $A$ dal diametro (pari, raggio da 2 a 20).

Esempi: "Quanto è lunga una circonferenza di raggio $5$ cm?" → $10\pi$ cm. "Qual è l'area di un
cerchio di diametro $10$ cm?" → $25\pi\ \text{cm}^2$.

Distrattori: $2\pi d$ (il diametro in $2\pi r$), $\pi r$ (il 2 dimenticato), $\pi r^2$ per la
circonferenza; per l'area $2\pi r$ (la circonferenza), $\pi d^2$, $2\pi r^2$, e con il diametro $\pi d$.

## Livello 2: dalla circonferenza o dall'area al raggio, con π

Quattro casi alla pari: raggio dalla circonferenza ($18\pi$ cm, $r$ fino a 25), raggio dall'area
($49\pi\ \text{cm}^2$, $r$ fino a 20), area dalla circonferenza, circonferenza dall'area. Nei primi due,
tre volte su dieci si chiede il diametro.

Esempi: "Una circonferenza è lunga $18\pi$ cm. Quanto misura il raggio?" → $9$ cm. "Una circonferenza
è lunga $12\pi$ cm. Qual è l'area del cerchio?" → $36\pi\ \text{cm}^2$.

Distrattori: dalla circonferenza il diametro ($C$ diviso solo per $\pi$), il raggio con $\pi$ ($9\pi$
cm), $4r$; dall'area $r^2$ (la radice dimenticata), il diametro, $r\pi$, $\frac{r^2}{2}$; per l'area dalla
circonferenza $C^2 = 144\pi^2$ (il distrattore della nota: "senza passare dal raggio"), $\pi d^2$,
$2\pi r^2$ e la circonferenza stessa; per la circonferenza dall'area $\pi r$, $4\pi r$, $2\pi r^2$.

## Livello 3: con π ≈ 3,14

Tre casi: raggio dalla circonferenza approssimata (35 su 100, $62{,}8$ cm, $r$ da 2 a 30), raggio
dall'area approssimata (35 su 100, $314\ \text{cm}^2$, $r$ da 3 a 20), giri di una ruota (30 su 100:
diametro da 40 a 90 cm a passi di 10, giri multipli di 50 da 100 a 1000, distanza in metri).
Il risultato è sempre intero.

Esempi: "Una circonferenza è lunga $62{,}8$ cm. Quanto misura il raggio, con $\pi \approx 3{,}14$?"
→ $10$ cm. "Una ruota ha il diametro di $50$ cm. Quanti giri fa per percorrere $549{,}5$ m, con
$\pi \approx 3{,}14$?" → $350$ giri.

Distrattori: il diametro al posto del raggio, $C : 2$ ($\pi$ dimenticato), $r^2$ (la radice
dimenticata); per la ruota metà dei giri ($2\pi d$), il doppio ($\pi r$), i metri non convertiti.

## Livello 4: lunghezza dell'arco

Angoli al centro divisori di $360^\circ$: 30, 36, 40, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270.
Il raggio (fino a 30 cm) è scelto perché l'arco sia un multiplo intero di $\pi$. Sei volte su dieci si
chiede l'arco, quattro l'angolo dall'arco.

Esempi: "In una circonferenza di raggio $6$ cm, quanto è lungo l'arco che corrisponde a un angolo al
centro di $60^\circ$?" → $2\pi$ cm. "In una circonferenza di raggio $10$ cm un arco è lungo $5\pi$ cm.
Quanto misura l'angolo al centro?" → $90^\circ$.

Distrattori: la formula del settore, $\frac{\pi r \alpha}{360^\circ}$ (senza il 2), il diametro al posto
del raggio, la circonferenza intera; per l'angolo il doppio ($\pi r$ al posto di $2\pi r$), la metà,
$360^\circ - \alpha$.

## Livello 5: area del settore

Tre casi: area dal raggio e dall'angolo (45 su 100), angolo dall'area (30 su 100), area dall'arco con
$A_{\text{settore}} = \frac{\ell \cdot r}{2}$ (25 su 100). Stessi angoli del livello 4, raggio fino a 20,
area multipla intera di $\pi$.

Esempi: "Qual è l'area di un settore circolare di raggio $6$ cm e angolo al centro di $60^\circ$?" →
$6\pi\ \text{cm}^2$. "In un settore circolare di raggio $6$ cm l'arco è lungo $2\pi$ cm. Qual è l'area
del settore?" → $6\pi\ \text{cm}^2$.

Distrattori: la formula dell'arco, $r$ al posto di $r^2$, il diametro come raggio, il cerchio intero;
per l'angolo la proporzione fatta con la circonferenza, la metà, il doppio; dall'arco il prodotto
$\ell \cdot r$ senza dividere per 2, $r^2$ al posto di $r$, metà dell'arco.

## Livello 6: corona circolare

Tre casi: dai raggi (45 su 100), dai diametri (25 su 100), il raggio mancante dall'area della corona e
dall'altro raggio (30 su 100, metà con il maggiore da trovare, metà con il minore). Raggi interi,
$1 \le r < R \le 15$.

Esempi: "Due circonferenze concentriche hanno i raggi di $5$ cm e $3$ cm. Qual è l'area della corona
circolare?" → $16\pi\ \text{cm}^2$. "Una corona circolare ha l'area di $24\pi\ \text{cm}^2$, e il raggio
della circonferenza minore misura $5$ cm. Quanto misura il raggio della circonferenza maggiore?" →
$7$ cm.

Distrattori: $\pi (R - r)^2$, $\pi (R^2 + r^2)$, $\pi R^2$, con i diametri $\pi (D^2 - d^2)$ e con i
raggi $2\pi (R - r)$; per il raggio mancante $R^2$ (la radice dimenticata), $k + r$, $r + \sqrt{k}$
quando $k$ è un quadrato.

## Livello 7: segmento circolare

Metà con l'angolo di $90^\circ$ (raggio pari da 2 a 30, area $\frac{r^2}{4}\pi - \frac{r^2}{2}$), metà con
$60^\circ$ (raggio multiplo di 6 fino a 30, area $\frac{r^2}{6}\pi - \frac{r^2}{4}\sqrt{3}$). Il cerchio è
dato con il raggio (50 su 100), il diametro (20), la circonferenza (15) o l'area (15).

Esempi: "In un cerchio di raggio $6$ cm, qual è l'area del segmento circolare che corrisponde a un
angolo al centro di $90^\circ$?" → $9\pi - 18\ \text{cm}^2$. "In un cerchio di diametro $12$ cm, ...
$60^\circ$?" → $6\pi - 9\sqrt{3}\ \text{cm}^2$.

Distrattori: solo il settore, settore più triangolo, il triangolo senza dividere per 2, il cerchio
intero meno il triangolo; per $60^\circ$ anche il triangolo trattato come rettangolo
($\frac{r^2}{2}$ al posto di $\frac{\sqrt{3}}{4} r^2$).

## Livello 8: figure composte

Cinque casi alla pari: quadrato con il cerchio inscritto (esempio 9), quadrato con quattro quarti di
cerchio centrati nei vertici e raggio metà del lato, quadrato con il quarto di cerchio di raggio uguale
al lato, finestra (rettangolo con sopra un semicerchio sulla base), rettangolo da cui si toglie un
semicerchio sulla base. Lato del quadrato pari da 4 a 20; base del rettangolo multipla di 4 fino a 20,
altezza fino a 20 e, quando il semicerchio si toglie, maggiore di metà base.

Esempi: "Un quadrato ha il lato di $8$ cm, e dentro c'è il cerchio inscritto. Qual è l'area della parte
del quadrato che resta fuori dal cerchio?" → $64 - 16\pi\ \text{cm}^2$. "Una finestra è fatta da un
rettangolo di base $8$ cm e altezza $10$ cm, con sopra un semicerchio che ha per diametro la base.
Qual è l'area della finestra?" → $80 + 8\pi\ \text{cm}^2$.

Distrattori: il raggio uguale al lato (dalla nota), la circonferenza al posto dell'area, il cerchio da
solo, un solo quarto; per i semicerchi il cerchio intero, il raggio uguale alla base, l'operazione
sbagliata (somma al posto della differenza e viceversa). Le opzioni con area negativa (per esempio
$64 - 64\pi$) sono scartate.

## Cosa evitare

- Raggi che danno frazioni: $\frac{25}{4}\pi - \frac{25}{2}$ per il segmento di $90^\circ$ con raggio 5,
  $\frac{8}{3}\pi - 4\sqrt{3}$ per quello di $60^\circ$ con raggio 4.
- Archi e settori con coefficienti di $\pi$ non interi nella risposta.
- Il cerchio circoscritto al quadrato (serve la diagonale $\ell\sqrt{2}$ della lezione 100).
- Segmenti circolari con angoli diversi da $90^\circ$ e $60^\circ$ (servono le funzioni goniometriche).
- Radianti: gli angoli sono in gradi.

## Controllo indipendente

Il controllo rilegge i dati dal testo e ricostruisce la figura con SymPy: cerchi come `Circle`, archi e
settori in radianti come integrali ($\int r\, d\theta$ e $\iint \rho\, d\rho\, d\theta$, senza la proporzione
in gradi della lezione), il triangolo del segmento come `Polygon` con vertici esatti
$(r\cos\theta, r\sin\theta)$ (e per $60^\circ$ controlla che sia equilatero), quadrati e rettangoli come
`Polygon` con il cerchio inscritto che tocca i quattro lati, i quarti che non si sovrappongono, il
semicerchio che entra nel rettangolo. Le domande all'indietro si risolvono con `solve` su un'incognita
positiva. Controlla anche la forma delle misure (frazioni ridotte, niente coefficiente 1, niente zeri
in coda, termini raccolti, primo termine positivo), l'unità di ogni opzione, che le opzioni siano
diverse come numeri e che una sola sia giusta, e le quote dei casi.

## Livelli che vorrebbero una figura

La nota chiede una figura per arco, settore, corona, segmento e figure composte (livelli 4-8 qui). Il
testo basta, ma i livelli 7 e 8 si leggerebbero meglio con il disegno: il segmento circolare con il
triangolo $OAB$, i quattro quarti di cerchio, la finestra.

## Domande per la revisione

- Otto livelli invece dei sette abituali: si possono fondere corona (6) e figure composte (8), ma il
  segmento sta in mezzo nella lezione. Va bene così?
- Livello 2: il distrattore $144\pi^2\ \text{cm}^2$ ($C^2$) è quello proposto dalla nota, ma è l'unica
  opzione con $\pi^2$ e si scarta a colpo d'occhio. Tenerlo o sostituirlo con $\frac{C^2}{4}$?
- Livello 3: nella ruota la distanza è in metri con decimali ($549{,}5$ m) per avere un numero intero
  di giri. Meglio distanze tonde (1 km, come l'esempio 2) e risposta approssimata?
- Livello 7, segmento di $60^\circ$: usa l'altezza del triangolo equilatero della lezione 100, come
  l'esempio 8. Se l'esempio 8 si sposta, il caso di $60^\circ$ va tolto.
- Livello 7: il cerchio dato con la circonferenza o con l'area aggiunge un passaggio del livello 2.
  Utile ripasso o distrazione?
- Livello 8: "quattro quarti" e "cerchio inscritto" danno la stessa risposta con lo stesso lato; lo
  studente deve accorgersi che i quattro quarti fanno un cerchio. Va bene tenerli entrambi?
- Unità: le misure composte sono scritte come nella lezione, $9\pi - 18\ \text{cm}^2$, senza parentesi.
  Alcuni libri scrivono $(9\pi - 18)\ \text{cm}^2$: quale usate?
- Lettere: $C$ e $A$, come nella lezione (la nota chiede ad Andrea se preferisce $2p$ e $S$).
