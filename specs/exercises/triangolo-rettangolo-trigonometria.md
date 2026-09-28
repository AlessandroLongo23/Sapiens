# Seno, coseno e tangente nel triangolo rettangolo

Generatore: `triangolo-rettangolo-trigonometria`
(`src/lib/exercises/v2/generators/triangolo-rettangolo-trigonometria.ts`). Verifica indipendente:
`scripts/exercises/checkers/triangolo_rettangolo_trigonometria.py`. Lezione collegata:
`docs/lezioni/riscritte/101-triangolo-rettangolo-trigonometria.md` (note in
`docs/lezioni/note/101-triangolo-rettangolo-trigonometria.md`, sezione "Per il generatore").

Sette livelli, quelli proposti dalla nota, nell'ordine della lezione; ognuno aggiunge una sola difficoltà.
Tutti si reggono sul testo, senza figura (vedi "Livelli che vorrebbero una figura").

## Tipi di risposta

- Livello 1: `number`, il rapporto ridotto ai minimi termini ($\frac{3}{5}$).
- Livello 2: `choice` con quattro opzioni, che è la risposta stessa.
- Livelli 3 e 4: `number` quando il valore è razionale, altrimenti `expression` con `form: 'rationalized'`
  (radicale semplificato, denominatore razionalizzato, frazione ridotta: $\frac{2\sqrt{2}}{3}$, $4\sqrt{3}$).
- Livelli 5, 6 e 7: `number` uguale a `k/100`, il valore vero arrotondato al centesimo.
- Ogni livello ha la variante a scelta multipla con quattro opzioni diverse come valori (non solo come testo).

## Convenzioni (quelle della lezione)

- Triangolo $ABC$ rettangolo in $C$; $a = \overline{BC}$, $b = \overline{AC}$, $c = \overline{AB}$; $\alpha$
  in $A$, $\beta$ in $B$. Scritture $\sin\alpha$, $\cos\alpha$, $\tan\alpha$, $\sin 30^\circ$, $\sin^2\alpha$,
  $\sin^{-1}$, $\cos^{-1}$, $\tan^{-1}$ (i tasti della calcolatrice, non $\text{sen}$ e $\text{tg}$).
- Virgola decimale `{,}`. Le misure date con la virgola sono scritte senza zeri in coda ($1{,}6$, $3{,}5$).
- Arrotondamento al centesimo, per eccesso da 5 in su, sia per le lunghezze sia per gli angoli in gradi
  (la lezione: "le lunghezze e gli angoli approssimati sono arrotondati al centesimo"). I valori arrotondati
  hanno sempre due cifre dopo la virgola ($8{,}40$, non $8{,}4$) e il segno $\approx$; un valore esatto con al
  massimo due decimali (la rampa $\frac{0{,}5}{0{,}08} = 6{,}25$) si scrive con $=$.
- Lunghezze esatte razionali come decimali ($7{,}5$ cm), irrazionali come radicale ($\frac{15\sqrt{3}}{2}$ cm);
  rapporti sempre come frazione.
- Unità: cm negli esercizi sul triangolo, m nei problemi, gradi con $^\circ$.

## Il problema dell'arrotondamento

Il generatore calcola seni, coseni e tangenti in virgola mobile. Un valore vero la cui centesima parte cade a
meno di $10^{-6}$ da una soglia di arrotondamento (per esempio $x{,}xx5$) non si usa mai: il generatore lo
scarta, e il controllo lo boccia. Così la risposta non dipende dalla precisione della calcolatrice. Il
controllo Python ricalcola ogni valore con SymPy a 50 cifre e arrotonda da solo.

Nel problema dell'albero con gli occhi a $1{,}6$ m la lezione arrotonda prima $x$ e poi aggiunge l'altezza
degli occhi; l'altezza degli occhi ha una cifra decimale, quindi i due modi danno lo stesso centesimo.

## Livello 1: seno, coseno e tangente dai lati

I tre lati di una terna pitagorica ($3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$; $20, 21, 29$;
$12, 35, 37$; $9, 40, 41$) moltiplicati per un intero, con lati fino a 60 cm; quale cateto è $a$ cambia. Si
chiede $\sin$, $\cos$ o $\tan$ di $\alpha$ o di $\beta$ (circa un terzo per funzione). Sei volte su dieci i
dati sono scritti con le lettere ($a = 6$ cm), quattro volte su dieci con i segmenti
($\overline{BC} = 6$ cm) e la domanda nomina l'angolo con il vertice ("il coseno dell'angolo
$\widehat{ABC}$"). La risposta è ridotta; nei passaggi il rapporto compare prima non ridotto.

Esempi:

- $a = 4$ cm, $b = 3$ cm, $c = 5$ cm, "Quanto vale $\tan\beta$?" Risposta $\frac{3}{4}$; opzioni
  $\frac{4}{3}$, $\frac{5}{3}$, $\frac{3}{5}$.
- $c = 39$ cm, $a = 15$ cm, $b = 36$ cm, "Quanto vale $\tan\beta$?" $\frac{36}{15} = \frac{12}{5}$.

Distrattori: cateto opposto e adiacente scambiati (l'avviso della lezione), il rapporto rovesciato
($\frac{c}{a}$), un altro rapporto dello stesso angolo.

## Livello 2: i valori per 30°, 45° e 60°

Tre casi, circa un terzo ciascuno:

- "Quanto vale $\cos 30^\circ$?" (9 domande);
- "Di un angolo acuto $\alpha$ si sa che $\cos\alpha = \frac{\sqrt{3}}{2}$. Quanto vale $\sin\alpha$?": dal
  valore si riconosce l'angolo, poi si legge l'altra funzione (18 domande);
- "Quale di queste uguaglianze è vera?": quattro uguaglianze su quattro valori diversi della tabella, una
  vera e tre false.

Nel terzo caso compaiono anche le forme non razionalizzate $\frac{1}{\sqrt{2}}$ e $\frac{1}{\sqrt{3}}$: metà
delle volte l'uguaglianza vera è scritta così ($\cos 45^\circ = \frac{1}{\sqrt{2}}$), e a volte anche una
falsa. È il modo in cui ho usato il distrattore della nota "$\frac{1}{\sqrt{2}}$ e $\frac{\sqrt{2}}{2}$
presentati come diversi": messi come due opzioni della stessa domanda sarebbero due risposte giuste.

Distrattori: seno e coseno dello stesso angolo scambiati (la tangente con quella del complementare), il valore
dell'angolo complementare, poi gli altri valori della tabella.

## Livello 3: da un valore agli altri due

"Di un angolo acuto $\alpha$ si sa che $\sin\alpha = \frac{p}{q}$. Quanto vale $\cos\alpha$?" Dato il seno o il
coseno (metà ciascuno), si chiede l'altro o la tangente (metà ciascuno). Quattro volte su dieci $q^2 - p^2$ è un
quadrato ($\frac{3}{5}$, $\frac{12}{13}$, $\frac{8}{17}$, $\frac{24}{25}$...) e la risposta è razionale; sei
volte su dieci no ($p < q \le 11$, frazione ridotta, mai $\frac{1}{2}$ che è del livello 2) e la risposta ha un
radicale. Passaggi come l'esempio 2: $\cos^2\alpha = 1 - \sin^2\alpha$, la radice positiva perché è un
rapporto tra lunghezze, poi $\tan\alpha = \frac{\sin\alpha}{\cos\alpha}$.

Esempi:

- $\sin\alpha = \frac{1}{5}$, $\cos\alpha$? $\frac{\sqrt{24}}{5} = \frac{2\sqrt{6}}{5}$; opzioni $\frac{4}{5}$
  ($1 - \sin\alpha$), $\frac{24}{25}$ (senza radice), $\frac{\sqrt{26}}{5}$.
- $\cos\alpha = \frac{2}{3}$, $\tan\alpha$? $\frac{\sqrt{5}}{2}$; opzioni $\frac{2\sqrt{5}}{5}$ (rovesciata),
  $\frac{2\sqrt{5}}{9}$ ($\sin\alpha \cdot \cos\alpha$), $\frac{1}{2}$ (con $\sin\alpha = 1 - \cos\alpha$).

Distrattori: $\cos\alpha = 1 - \sin\alpha$ (dalla nota), il quadrato non estratto, $\sqrt{1 + \sin^2\alpha}$;
per la tangente il rapporto rovesciato, la tangente calcolata con $1 - \sin\alpha$, il prodotto.

## Livello 4: un lato con i valori esatti

Come l'esempio 3. Un lato intero da 2 a 20 cm e un angolo acuto ($\alpha$ o $\beta$) di $30^\circ$, $45^\circ$
o $60^\circ$; si chiede un altro lato. Le sei regole della lezione: dall'ipotenusa a un cateto (seno o coseno,
circa 4 su 11 prima degli scarti), da un cateto all'ipotenusa (diviso seno o coseno), da un cateto all'altro
(per o diviso la tangente). Con $45^\circ$ non si chiede l'altro cateto (sarebbe il dato). Quando si divide per
un radicale i passaggi razionalizzano: $c = \frac{20}{\frac{\sqrt{2}}{2}} = \frac{40}{\sqrt{2}} = 20\sqrt{2}$.

Esempi:

- $c = 15$ cm, $\alpha = 60^\circ$, il cateto $a$? $a = c \cdot \sin\alpha = \frac{15\sqrt{3}}{2}$ cm;
  opzioni $7{,}5$ cm (coseno al posto del seno), $30$ cm, $10\sqrt{3}$ cm.
- il cateto $b = 20$ cm, $\alpha = 45^\circ$, l'ipotenusa? $20\sqrt{2}$ cm; opzioni $10\sqrt{2}$ cm
  (moltiplicato invece di diviso), $20$ cm, $40\sqrt{2}$ cm.

Distrattori: le altre cinque operazioni (per o diviso seno, coseno, tangente), prima il seno al posto del
coseno e il prodotto al posto del quoziente; poi il doppio e la metà.

## Livello 5: un lato con la calcolatrice

Come il livello 4, ma l'angolo è un intero da $10^\circ$ a $80^\circ$ diverso da $30^\circ$, $45^\circ$,
$60^\circ$, il lato dato un intero da 3 a 40 cm, la risposta tra 1 e 150 cm arrotondata al centesimo
(esempio 4).

Esempi:

- $c = 29$ cm, $\alpha = 79^\circ$, il cateto $a$? $29 \cdot \sin 79^\circ \approx 28{,}47$ cm; opzioni
  $5{,}53$ cm (coseno), $29{,}54$ cm ($\frac{c}{\sin\alpha}$), $151{,}98$ cm.
- $c = 29$ cm, $\beta = 31^\circ$, il cateto $b$? $\approx 14{,}94$ cm.

Distrattori: seno e coseno scambiati (o la tangente rovesciata), la calcolatrice in radianti (l'avviso della
lezione), $b \cdot \cos\alpha$ al posto di $\frac{b}{\cos\alpha}$ e le altre operazioni, poi $\pm 1$.

## Livello 6: l'angolo da due lati

Come gli esempi 5 e 6. Metà delle volte i due cateti (interi da 2 a 30, diversi) e la tangente; metà
l'ipotenusa (intera fino a 40) e un cateto, e si usa il seno se il cateto è opposto all'angolo chiesto, il
coseno se è adiacente (circa un quarto ciascuno). L'angolo chiesto è $\alpha$ o $\beta$, tra $5^\circ$ e
$85^\circ$, mai $30^\circ$, $45^\circ$ o $60^\circ$, arrotondato al centesimo di grado.

Esempi:

- $a = 30$ cm, $b = 22$ cm, $\alpha$? $\tan\alpha = \frac{15}{11}$, $\alpha \approx 53{,}75^\circ$; opzioni
  $36{,}25^\circ$ (il complementare), $0{,}94^\circ$ (in radianti), $54{,}75^\circ$.
- $c = 13$ cm, $b = 7$ cm, $\alpha$? $\cos\alpha = \frac{7}{13}$, $\alpha \approx 57{,}42^\circ$.

Distrattori: il complementare, il risultato in radianti letto come gradi, un'altra funzione inversa sullo
stesso rapporto, poi $\pm 1^\circ$. Il distrattore della nota "$\frac{1}{\sin}$ al posto di $\sin^{-1}$" non
c'è: $\frac{1}{\sin}$ di un rapporto non dà un angolo plausibile (quasi sempre più di $90^\circ$), quindi non
sarebbe un'opzione credibile.

## Livello 7: problemi

Tre storie:

- angolo di elevazione, circa 4 su 10: distanza intera da 8 a 60 m, angolo intero da $15^\circ$ a $70^\circ$
  (non $30^\circ$, $45^\circ$, $60^\circ$); sei volte su dieci con gli occhi a $1{,}5$, $1{,}6$, $1{,}7$ o
  $1{,}8$ m (esempio 7), le altre con un goniometro appoggiato a terra. Oggetti: albero (4-30 m), lampione
  (4-12 m), campanile e torre (15-90 m), palazzo (10-60 m); l'altezza deve stare nell'intervallo
  dell'oggetto;
- rampa, circa 3 su 10: dislivello da $0{,}3$ a $1{,}2$ m, pendenza del 5, 6, 8, 10, 12, 15 o 20%; si chiede
  la lunghezza orizzontale (mai intera), l'angolo con il terreno o la lunghezza della rampa (esempio 8);
- scala, circa 3 su 10: lunga da $2{,}5$ a 8 m; con l'angolo con il pavimento (da $55^\circ$ a $80^\circ$) si
  chiede l'altezza sul muro o la distanza del piede (esempio 9); con la distanza del piede si chiede l'angolo
  (tra $55^\circ$ e $82^\circ$).

Esempi:

- occhi a $1{,}7$ m, distanza 15 m, $23^\circ$: $15 \cdot \tan 23^\circ \approx 6{,}37$, albero
  $\approx 8{,}07$ m; opzioni $6{,}37$ m (occhi dimenticati), $7{,}56$ m (seno), $25{,}52$ m (radianti).
- rampa di $1$ m al 6%, l'angolo? $\tan^{-1}(0{,}06) \approx 3{,}43^\circ$; opzioni $6{,}00^\circ$ (la
  pendenza presa come angolo), $86{,}57^\circ$, $0{,}06^\circ$.

Distrattori: l'altezza degli occhi dimenticata (o contata due volte), la pendenza presa come angolo in gradi
(l'avviso della lezione), seno e coseno scambiati, il complementare, la calcolatrice in radianti.

## Esercizi da evitare

- Dati incoerenti: un cateto non più corto dell'ipotenusa, una terna che non è rettangola, un angolo non acuto.
- Valori vicini a una soglia di arrotondamento (sopra).
- Angoli notevoli nei livelli 5, 6 e 7 (li risolvono i valori esatti), e al livello 4 un lato chiesto uguale
  al dato.
- Risposte non ridotte o non razionalizzate; lunghezze razionali scritte come frazione.
- Trattini lunghi e "piuttosto che" nei testi.

## Controllo indipendente

Il controllo legge i dati dal testo che vede lo studente (mai da `params`) e ricostruisce la figura con le
coordinate: al livello 1 $C = (0, 0)$, $A$ sull'asse $x$, $B$ sull'asse $y$, l'ipotenusa data deve essere
$\overline{AB}$ e il rapporto si misura dai vettori nel vertice; ai livelli 4 e 5 un triangolo con l'angolo dato
e ipotenusa 1, poi scalato sul lato dato; al livello 6 il terzo lato con Pitagora e l'angolo con l'arcocoseno
del prodotto scalare; al livello 7 la scena (occhio, piede e cima; la rampa; la scala contro il muro). Ai
livelli 2 e 3 usa $\sin$, $\cos$, $\tan$ esatti di SymPy, anche di $\sin^{-1}\frac{p}{q}$. Controlla che le
opzioni siano quattro valori diversi (confrontati esattamente), una sola uguale alla risposta, nella forma
giusta; che la soluzione dica $\approx$ con due decimali; le quote dei casi.

## Domande per la revisione

- Arrotondamento degli angoli al centesimo di grado, come nella lezione; se Andrea preferisce il decimo o
  gradi e primi, cambia solo `fixed2` e il controllo.
- Livello 2: il caso dell'uguaglianza vera usa $\frac{1}{\sqrt{2}}$ come forma giusta. Va bene, o una
  risposta con la forma non razionalizzata confonde al secondo anno?
- Livello 3: manca il caso "data la tangente, trova seno o coseno" (la lezione dice "da uno dei tre numeri si
  trovano gli altri due", ma gli esempi partono dal seno). Aggiungerlo?
- Livello 6: il distrattore "$\frac{1}{\sin}$ al posto di $\sin^{-1}$" è stato tolto (vedi sopra).
- Livello 7: i contesti (albero, torre, rampa, scala) vanno bene, o nel libro al secondo anno ci sono le
  ombre e il piano inclinato?
- La notazione $\sin$/$\tan$ e il triangolo rettangolo in $C$ seguono le scelte della lezione, ancora da
  confermare (vedi le domande nella nota).

## Livelli che vorrebbero una figura

I livelli 1, 4, 5 e 6 vorrebbero il triangolo con i dati segnati (la lezione ne ha una per esempio); il 7 una
figura per storia (lo sguardo verso la cima, la rampa, la scala contro il muro). Il livello 1 con i segmenti e
la domanda su $\widehat{ABC}$ è quello in cui la figura aiuta di più a riconoscere il cateto opposto.
