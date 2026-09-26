# Problemi con le equazioni

Generatore: `equazioni-problemi` (`src/lib/exercises/v2/generators/equazioni-problemi.ts`).
Verifica indipendente: `scripts/exercises/checkers/equazioni_problemi.py`. Lezione collegata:
`docs/lezioni/riscritte/51-equazioni-problemi.md` (note in `docs/lezioni/note/`).

Lo studente riceve un problema a parole e lo risolve come nella lezione: sceglie l'incognita e ne
scrive le limitazioni, traduce il testo in un'equazione di primo grado, la risolve, controlla la
soluzione sul testo e risponde alla domanda. La consegna è "Risolvi il problema con un'equazione."
(al livello 7 "Risolvi il problema con un'equazione e controlla che la soluzione sia accettabile.").
Il testo sta nel `problem` come righe `\text{…}` scritte con `textBlock`, come nel livello 7 di
`equazioni-primo-grado`; la pagina lo mostra come paragrafo.

## Rispetto al livello 7 di equazioni-primo-grado

Quel livello ha già i problemi semplici: consecutivi, età "tra quanti anni", divisioni, perimetro di
un rettangolo, biglietti, monete, spesa, risparmi, tariffe. Qui non si ripetono. Ogni livello porta un
tipo di problema che la lezione tratta in un esempio svolto e che lì manca: l'ordine delle parole,
i numeri pari e dispari, "anni fa", l'area chiesta dopo i lati, il quadrato del binomio che si
cancella, le percentuali una dopo l'altra, il moto, le miscele, il lavoro in ore e minuti. L'ultimo
livello aggiunge la difficoltà della sezione "Le limitazioni dell'incognita": la soluzione
dell'equazione può non essere accettabile, e allora il problema è impossibile.

## Si costruisce dalla risposta

Si sceglie prima il valore dell'incognita (l'altezza, il numero più piccolo, il tempo in minuti,
il prezzo prima dello sconto), poi si calcolano i dati del testo. Così la risposta è sempre un
numero bello: intero e positivo ai livelli 1-5, un numero intero di minuti al livello 6. Il
livello 7 costruisce il problema accettabile o impossibile scegliendo apposta dati che portano la
soluzione fuori dalle limitazioni (negativa, non intera, più grande del totale).

## Rappresentazione

`params.story` è la storia; poi i dati così come stanno nel testo (per esempio `p`, `e`, `T` per lo
sconto, `v1`, `v2`, `D` per l'incontro), `equation` (l'equazione in LaTeX, la stessa dei passaggi),
`variable` (`x`, oppure `t` nei problemi di moto come nell'esempio 6 della lezione), `x` (la
soluzione dell'equazione, razionale esatto) e `normal` (`{a, b}`, la forma normale $ax = b$). Al
livello 7 anche `case` (`accettabile` o `impossibile`). Niente di derivato dalla risposta: il
verificatore ricostruisce l'equazione dai dati della storia, la risolve con SymPy e ricava da solo la
risposta; poi legge `equation` dal LaTeX e controlla che abbia la stessa soluzione e sia la stessa
equazione a meno di un fattore.

## Regole comuni

- Passaggi in italiano: che cosa è $x$ con le limitazioni, "Traduci il testo in un'equazione:",
  le equazioni equivalenti fino a $x = …$, il passaggio dalla $x$ alla risposta quando la domanda
  chiede altro, "Controllo sul testo:" con i numeri trovati (la lezione vuole la verifica sul
  testo, non sull'equazione).
- Nell'equazione niente `1x`, `0x`, `+ -`, `- -`, `1(`; coefficienti decimali con la virgola
  (`0{,}25x`), come nella lezione.
- La risposta dei livelli 1-5 non è mai uno dei numeri scritti nel testo.
- Nomi italiani da due elenchi; "ed" davanti a un nome che comincia per E.
- Unità: "euro", "euro al chilo", km/h, `$\text{cm}^2$` per le aree; il simbolo € non si usa perché
  il testo è in `\text{}`.
- Ogni storia esce circa con la stessa frequenza nel suo livello (il verificatore lo controlla).

## Livello 1: numeri ed età

Cinque storie, circa 1 su 5 ciascuna.

- `ordine`: "il triplo della somma di un numero e 4", "la somma del triplo di un numero e 4", le
  stesse con la differenza, "la metà della somma" e "la somma della metà" (riquadro "L'ordine delle
  parole"). Il numero tra 3 e 30, moltiplicatore da 2 a 5, risultato fino a 200.
- `pari-dispari`: due o tre numeri pari o dispari consecutivi, scritti $2x$, $2x + 2$ o
  $2x + 1$, $2x + 3$ come nella tabella della lezione; si chiede il più piccolo o il più grande.
- `somma-due`: due numeri con somma nota, "il triplo del più piccolo supera di 10 il più grande"
  oppure "il più grande supera di 16 il doppio del più piccolo" (riquadro "Chi supera chi").
- `eta-fa`: "quanti anni fa il genitore aveva il triplo degli anni del figlio", con
  $0 < x <$ età del figlio (esempio 2). Differenza di età tra 20 e 45 anni, genitore fino a 65.
- `eta-somma`: il genitore ha $d$ anni più del figlio, tra $n$ anni (o $n$ anni fa) la somma delle
  età sarà (era) $S$; si chiede l'età di oggi di uno dei due.

Esempi: "La somma del quadruplo di un numero e 5 è 89. Qual è il numero?" $4x + 5 = 89$, risposta
21. "Oggi Paolo ha 34 anni e suo figlio Matteo ne ha 10. Quanti anni fa Paolo aveva il quadruplo
degli anni di Matteo?" $34 - x = 4(10 - x)$, risposta 2.

## Livello 2: geometria

- `rettangolo-area`: perimetro e relazione tra i lati (la base supera l'altezza, è il doppio o il
  triplo, supera il doppio); si chiede l'area (riquadro "Fermarsi alla x", esempio 3).
- `isoscele`: triangolo isoscele con perimetro dato, la base che supera il lato obliquo o il
  contrario; si chiede la base o il lato obliquo. La base è sempre minore del doppio del lato.
- `quadrato`: allungando o accorciando il lato di $a$, l'area aumenta o diminuisce di $D$;
  $(x + a)^2 = x^2 + D$, il termine $x^2$ si cancella (esempio 4). Si chiede il lato di partenza o
  quello nuovo.
- `rettangolo-cambia`: la base supera l'altezza di $d$; allungando la base di $a$ e accorciando
  l'altezza di $e$ l'area aumenta o diminuisce di $D$:
  $(x + d + a)(x - e) = x(x + d) \pm D$, di nuovo con $x^2$ che si cancella.

Esempi: "Il perimetro di un foglio rettangolare è 128 cm, e la base supera di 7 cm il doppio
dell'altezza. Calcola l'area del foglio." $2(x + 2x + 7) = 128$, $x = 19$, risposta 855. "Se accorci
di 6 cm il lato di un quadrato, la sua area diminuisce di 264 cm². Quanto è lungo il lato del
quadrato di partenza?" $(x - 6)^2 = x^2 - 264$, risposta 25.

## Livello 3: percentuali

- `sconto`: un oggetto scontato del $p\%$ più un altro a prezzo pieno, spesa totale; si chiede il
  prezzo prima dello sconto. $x - 0{,}2x + 12 = 76$.
- `resto`: il $p_1\%$ e poi il $p_2\%$ di quello che resta (esempio 5): risparmi, mele vendute,
  un percorso a tappe.
- `aumento`: il prezzo aumenta del $p\%$ e poi cala del $d\%$; si chiede il prezzo di partenza.
  $x + 0{,}2x - 0{,}4 \cdot 1{,}2x = 324$.
- `parti`: il $p_1\%$ e il $p_2\%$ di un totale, e gli altri sono $R$ (studenti, libri, un
  sondaggio); si chiede il totale o il primo gruppo.

Tutti gli importi intermedi (lo sconto, la spesa del libro, il prezzo dopo l'aumento, i gruppi) sono
interi. Esempio: "Tommaso spende il 60% dei suoi risparmi per un libro e poi il 20% di quello che
gli resta per un gioco. Alla fine ha ancora 16 euro." $x - 0{,}6x - 0{,}2 \cdot 0{,}4x = 16$,
risposta 50.

## Livello 4: moto

L'incognita è il tempo $t$ in ore (come nell'esempio 6) o una distanza; la risposta è in minuti o
in km, sempre intera, con un tempo tra 10 minuti e 4 ore.

- `incontro`: due veicoli (auto e camion, due ciclisti, due amici a piedi, due treni) partono
  insieme dalle due città e si vengono incontro; $v_1 t + v_2 t = D$; si chiede dopo quanti minuti
  o a quanti km da $A$.
- `inseguimento`: il secondo parte dallo stesso punto una o due ore dopo, più veloce;
  $v_2 t = v_1(t + 1)$; si chiede dopo quanti minuti dalla sua partenza o a quanti km lo raggiunge.
- `andata-ritorno`: velocità diverse all'andata e al ritorno, tempo totale in minuti; si chiede la
  distanza. $\frac{x}{24} + \frac{x}{16} = \frac{25}{12}$ (incognita solo al numeratore, come
  l'esempio 8).

## Livello 5: miscele

- `miscela`: due prodotti (caffè, tè, frutta secca, caramelle) a prezzi interi, $Q$ kg di miscela a
  un prezzo intero tra i due (esempio 7); si chiede la quantità di uno dei due.
- `aggiunta`: $m$ kg di un prodotto, quanti kg di un altro aggiungere per ottenere un prezzo dato:
  $p_a m + p_b x = p_m(m + x)$, con la miscela che cresce.
- `diluizione`: $m$ litri con il $c_1\%$ di succo, sale o zucchero; quanta acqua aggiungere per
  scendere al $c_2\%$: $0{,}3 \cdot 30 = 0{,}25(30 + x)$.

## Livello 6: lavoro

Incognita solo al numeratore, come nell'esempio 8: si sommano le parti di lavoro fatte in un'ora (o
in un minuto). La risposta è un tempo e si scrive in ore e minuti (`2 h 24 min`, `45 min`), quindi
questo livello risponde con una scelta (`answer.kind = "choice"`), con `values` in minuti.

- `insieme`: due rubinetti, imbianchini, trattori (tempi in ore) o due stampanti, due fratelli che
  preparano sacchetti (tempi in minuti). $\frac{x}{4} + \frac{x}{6} = 1$.
- `svuota`: un rubinetto riempie e uno scarico svuota: $\frac{x}{a} - \frac{x}{b} = 1$.
- `dopo`: il primo lavora da solo per $h$ ore, poi arriva il secondo; si chiede quanto lavorano
  insieme: $\frac{x + h}{a} + \frac{x}{b} = 1$.

Con i tempi in ore la soluzione non è mai un numero intero di ore (la conversione in minuti è il
punto del livello) ed è al massimo 12 ore; con i tempi in minuti è al massimo 3 ore. Sempre un
numero intero di minuti.

## Livello 7: la soluzione è accettabile?

Circa metà dei problemi è impossibile perché la soluzione dell'equazione non rispetta le
limitazioni dell'incognita. Cinque storie, tutte della lezione:

- `consecutivi`: la somma di due o tre naturali consecutivi; impossibile se $x$ non è intero
  (esempio 1, somma 100).
- `eta`: "quanti anni fa"; impossibile se $x < 0$, cioè se il momento cercato è nel futuro.
- `rettangolo`: perimetro e "la base supera l'altezza di $d$"; impossibile se $x \le 0$ (l'esempio
  "Una soluzione da scartare").
- `miscela`: impossibile se il prezzo della miscela è fuori dai due prezzi, e $x$ è negativo o
  supera $Q$ (seconda parte dell'esempio 7).
- `divisione`: due persone con $T$ figurine, una ne ha $d$ più dell'altra; impossibile se $x$ è
  negativo o non intero.

Il verificatore decide da solo se la soluzione è accettabile, dalle limitazioni scritte per ogni
storia. Quando il problema è impossibile, i passaggi finiscono con la soluzione scartata e il
motivo ("$-3$ non è accettabile: un'altezza non può essere negativa"); quando è accettabile, con il
controllo sul testo.

## Esercizi "brutti" da evitare

- Una risposta che è già un numero del testo (scartata e rigenerata).
- Età impossibili (genitore di 80 anni, figlio nato quando il genitore aveva 10 anni), un triangolo
  che non si chiude, prezzi con i centesimi dopo uno sconto, un tempo di 3 secondi o di 20 ore.
- Un problema di lavoro con la risposta in ore intere: la conversione in minuti non serve più.
- Due numeri "consecutivi" o due quantità di miscela uguali (il distrattore "l'altra quantità"
  coinciderebbe con la risposta).

## Variante a scelta multipla

Quattro opzioni distinte, una corretta. I distrattori vengono dagli errori che la lezione nomina,
poi da numeri vicini alla risposta (mai 0 né negativi ai livelli 1-6):

- l'altra lettura dell'ordine delle parole (la soluzione di $3x + 4 = 45$ al posto di
  $3(x + 4) = 45$), chi supera chi con il dislivello dalla parte sbagliata;
- fermarsi alla $x$ (l'altezza invece dell'area, $x$ invece di $2x$ nei numeri pari, il totale
  invece del gruppo) e l'altra quantità del problema;
- far passare il tempo per uno solo nelle età; il perimetro preso come somma di due lati; ciascun
  lato obliquo contato una volta; $(x + a)^2$ senza il termine $a^2$ o con il segno sbagliato;
- percentuali sommate ($0{,}35x$ al posto di $0{,}75x - 0{,}3x$), aumento e calo trattati come una
  sola variazione, lo sconto aggiunto al prezzo scontato;
- nel moto un veicolo solo, le velocità sottratte o sommate a sproposito, il tempo contato dalla
  prima partenza, $1{,}5$ ore lette come 1 ora e 50 minuti;
- nelle miscele la quantità totale che non cresce, la miscela a metà;
- nel lavoro i tempi sommati o mediati (riquadro "Sommare i tempi"), $2{,}4$ ore lette come 2 ore e
  40 minuti (riquadro dedicato), il tempo dall'inizio al posto di quello insieme.

Al livello 7 un'opzione è sempre "Il problema è impossibile". Se il problema è impossibile, tra le
opzioni c'è la soluzione scartata (per esempio $-3$ o $\frac{130}{3}$), che è l'errore da evitare, e
i suoi arrotondamenti o il suo valore assoluto.

## Verifiche fatte (26 settembre 2026)

- `sample.mts equazioni-problemi 1000 all 1 | verify.py`: PASS, 7.000 esercizi. Di nuovo con seed
  di partenza 7001: PASS. Le storie escono ognuna nella sua quota (per esempio al livello 1 tra 182 e
  216 su 1.000; al livello 7 520 accettabili e 480 impossibili).
- Errori piantati a mano, tutti bocciati: risposta cambiata; opzione giusta spostata; equazione
  cambiata (l'ordine delle parole letto al contrario, le percentuali sommate, un termine in più non
  riportato nei passaggi); un dato del testo cambiato (la soluzione non torna più); età
  implausibile; tempo scritto "2 h 40 min" con il valore di un altro; opzione doppia; `case` del
  livello 7 invertito; opzione "impossibile" tolta; soluzione scartata tolta dalle opzioni di un
  problema impossibile; forma normale sbagliata; un dato tolto dal testo; opzione non intera ai
  livelli 1-5; un perimetro che dà un'altezza frazionaria; un inseguitore più lento del primo.
- `review.mts`: esce con 0, gli esempi si leggono bene.
- `width.mts`: esce con 0. Il testo è prosa e va a capo da solo; l'opzione più larga è "Il problema
  è impossibile", 197 px su 252.
- Esercizi diversi su 1.000 per livello: 941, 927, 976, 847, 927, 462, 953. Il livello 6 è il più
  stretto perché le coppie di tempi che danno un numero intero di minuti sono poche; con otto
  contesti resta sopra 400.
- `tsc` ed `eslint` senza errori nei file di questo generatore.

## Domande per la revisione

- Livello 6: la risposta è una scelta con i tempi scritti "2 h 24 min". Per una futura risposta
  aperta servono due campi (ore e minuti) o un numero di minuti: quale?
- Livello 7: l'età con soluzione negativa si dichiara impossibile ("il triplo lo avrà tra 6 anni,
  non lo ha avuto"). Nei libri alcuni la considerano risposta alla domanda "tra quanti anni":
  per chi legge la domanda alla lettera è impossibile, ma va bene così?
- Il livello 7 mette insieme cinque storie dei livelli precedenti; la lezione presenta le
  limitazioni prima degli esempi. Meglio lasciarlo per ultimo (sintesi) o spostarlo dopo il
  livello 1?
- Le velocità dei ciclisti arrivano a 30 km/h e quelle dei treni merci a 120 km/h: vanno bene come
  numeri, o meglio restringerle?
- I problemi di lavoro con "lo scarico aperto" e "senza tappo" sono classici dei libri ma poco
  realistici: tenerli?
