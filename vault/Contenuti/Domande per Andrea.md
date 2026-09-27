---
stato: in uso
release: beta
aggiornato: 2026-09-27
tag: [contenuti, revisione]
---
# Domande per Andrea

Tutte le domande sui contenuti che aspettano la rilettura di Andrea, in un posto solo: convenzioni, notazioni, definizioni che cambiano tra i libri, scelte degli esercizi. Andrea rilegge con i suoi tempi e la pubblicazione non lo aspetta (vedi [[2026-09-24 Contenuti scritti da Claude e rivisti da Andrea]]); questa nota fa in modo che nessuna domanda resti solo in una chat.

## Come si usa
- Ogni lotto aggiunge qui le sue domande principali, in una sezione con il nome del lotto e il link alla nota di sessione. Le domande minori restano nelle note delle lezioni (`docs/lezioni/note/`, sezione dei dubbi) e nelle specifiche degli esercizi (`specs/exercises/`, sezione "Domande per la revisione"): ogni sezione qui dice dove trovarle.
- Una domanda aperta è una casella vuota. Quando Andrea risponde si spunta la casella, si scrive la risposta sulla stessa riga ("Andrea, data: …") e si annota cosa è cambiato nelle lezioni o nei generatori.
- Le domande sono scritte perché Andrea possa rispondere senza aprire il codice: la scelta fatta, l'alternativa, dove si trova.

## Convenzioni generali (23 settembre 2026)
Dalla revisione delle 18 lezioni originali; dettagli in `docs/lezioni/README.md`. Tra parentesi la scelta fatta.
- [ ] Inclusione: $\subseteq$ e $\subset$ (scelta fatta), oppure $\subset$ e $\subsetneq$.
- [ ] Sottoinsiemi impropri: $\emptyset$ e $A$ (scelta fatta), oppure solo $A$.
- [ ] Cardinalità: $|A|$ (scelta fatta), $\text{card}(A)$ o $n(A)$.
- [ ] Differenza tra insiemi: $A \setminus B$ (scelta fatta), oppure $A - B$.
- [ ] MCD e MCM maiuscoli come nei titoli del sito, oppure m.c.m. come in molti libri.
- [ ] Coefficiente di MCD e MCM tra monomi: MCD e MCM dei valori assoluti con coefficienti interi, 1 con coefficienti frazionari (scelta fatta), oppure sempre 1.
- [ ] Equazione indeterminata: $S = \mathbb{R}$ (scelta fatta, con un riquadro su $\mathbb{Q}$), oppure $S = \mathbb{Q}$ al primo anno.
- [ ] Elemento neutro di sottrazione e divisione: "non esiste" (scelta fatta), oppure "solo a destra".
- [ ] Nomi: "monomia" per $ax^2 = 0$, "identità" per l'equazione indeterminata, la proprietà dissociativa che alcuni libri non nominano.

## Primo generatore: equazioni di secondo grado (23 settembre 2026)
Specifica in `specs/exercises/equazioni-secondo-grado.md`. Vedi [[2026-09-23 Primo generatore della pipeline]].
- [ ] Le proporzioni tra i casi (pure e spurie al livello 1, complete e pure al livello 4) sono quelle giuste?
- [ ] Al livello 4 servono anche radici con denominatore da razionalizzare, come $x^2 = \frac{5}{2}$?
- [ ] Il livello 5 dovrebbe includere prodotti e quadrati da sviluppare, come $(x - 1)^2 = 2x + 3$?

## Terzo lotto: monomi, polinomi e scomposizione (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/27-38` e nelle specifiche. Vedi [[2026-09-26 Terzo lotto, monomi polinomi e scomposizione]].
- [ ] Nome del trinomio $x^2 + sx + p$: caratteristico, speciale, somma e prodotto, oppure nessuno.
- [ ] Il divisore $ax - b$ nella regola di Ruffini, e la divisibilità di $x^n \pm a^n$: nella 35 o nella 37?
- [ ] L'ordine dei fattori nelle scomposizioni, e se $3 - x$ al posto di $x - 3$ va accettato quando arriveranno le risposte aperte.
- [ ] "La somma di due quadrati è irriducibile" vale solo al primo grado ($x^4 + 4$ si scompone): basta la precisazione della lezione 35?
- [ ] Risposte aperte con due campi (quoziente e resto) per divisione e Ruffini.

## Quarto lotto: relazioni, funzioni e frazioni algebriche (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/39-51` e nelle specifiche. Vedi [[2026-09-26 Quarto lotto, relazioni funzioni e frazioni algebriche]].
- [ ] Insieme immagine: $\mathrm{Im}(f)$ o $f(A)$ (la 18 usa il primo, la 43 il secondo e cita l'altro).
- [ ] Funzione lineare: $ax + b$ o $mx + q$ (44 e 45).
- [ ] Il parametro delle equazioni letterali: $a$ o $k$ (la 50 usa $a$; dal settimo lotto parametriche e sistemi usano $k$).
- [ ] La riduzione allo stesso denominatore non ha esercizi propri (la risposta sarebbe una coppia di frazioni): basta dentro le somme della 48?
- [ ] Nelle equazioni problema una soluzione negativa sull'età conta come impossibile?
- [ ] La carta `inversa-lineare` della 18 doppia una della 44.

## Quinto lotto: disequazioni, statistica e geometria (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/52-62` e nelle specifiche. Vedi [[2026-09-26 Quinto lotto, disequazioni statistica e geometria]].
- [ ] Intervalli con le quadre rovesciate, $]a, b]$, e la scrittura delle soluzioni: "$x < -3$ oppure $x > 2$" o con gli intervalli.
- [ ] Definizioni che cambiano tra i libri: triangolo isoscele (almeno due lati uguali), trapezio (due soli lati paralleli), rette parallele (le coincidenti contano), moda quando tutti i valori hanno la stessa frequenza.
- [ ] La 59 usa "supplementari di angoli congruenti sono congruenti", mentre la 58 enuncia solo "supplementari di uno stesso angolo".
- [ ] Esercizi che vorrebbero una figura: il livello 1 delle disequazioni (retta), i livelli 1-3 delle parallele (gli otto angoli), gli aerogrammi, le dimostrazioni da completare.

## Sesto lotto: intersezione, differenza e logica (26 settembre 2026)
Altri dubbi in `docs/lezioni/note/63-67` e nelle specifiche. Vedi [[2026-09-26 Sesto lotto, intersezione differenza e logica]].
- [ ] Nomi delle forme dell'implicazione: la 66 chiama inversa $q \to p$ e contraria $\neg p \to \neg q$; alcuni libri dicono reciproca (o conversa) la prima e inversa la seconda.
- [ ] Equivalenza tra proposizioni con $\Leftrightarrow$ (alcuni libri usano $\equiv$), e la precedenza tra $\wedge$ e $\vee$ (la 65 mette sempre le parentesi).
- [ ] La 64 e la 66 sono lunghe (circa 22.000 caratteri): le note dicono quali esempi togliere se serve.
- [ ] Il motore delle figure non compila `\mathbb{N}` né `\complement`: in due figure c'è una scritta al posto del simbolo.
- [ ] Esercizi che vorrebbero una figura: i problemi con i diagrammi (livelli 5-6 dell'intersezione, 6-7 della differenza), gli insiemi di verità (livello 6 dell'implicazione, livello 2 dei quantificatori).

## Settimo lotto: sistemi, radicali e secondo grado (27 settembre 2026)
Altri dubbi in `docs/lezioni/note/68-79` e nelle specifiche. Vedi [[2026-09-27 Settimo lotto, sistemi radicali e secondo grado]].
- [ ] Lettere sotto radice: la 72 usa condizioni di esistenza e valori assoluti ($\sqrt{x^2} = |x|$), dalla 73 alla 76 le lettere sono positive, dichiarato in ogni lezione.
- [ ] "Semplificare" un radicale: nella 72 vuol dire dividere indice ed esponenti; $\sqrt{12} = 2\sqrt{3}$ è "portare fuori" (73). La 17 usa "semplificare" nel senso largo.
- [ ] Le coppie soluzione dei sistemi: $(x, y)$ con la virgola; la 68 scrive $S = \{(3, 2)\}$, la 69 "la coppia $(2, 1)$".
- [ ] I nomi "regola di Cartesio", "permanenza" e "variazione" (77), e le lettere $s$ e $p$, che nella 36 hanno un altro segno ($x^2 + sx + p$ contro $x^2 - sx + p$).
- [ ] Le approssimazioni per difetto dei numeri negativi (71): $-2{,}65$ per $-\sqrt{7}$, perché "per difetto" vuol dire minore.
- [ ] Opzioni con il valore giusto in forma non ridotta ($\frac{30\sqrt{2}}{2}$, $\sqrt{8}$ al posto di $2\sqrt{2}$) contano come errori (livelli 1-4 della razionalizzazione, 1 e 5 delle espressioni): è giusto?
- [ ] Il sasso lanciato in alto (79, altezza $20t - 5t^2$) viene dalla fisica: si tiene nel biennio?
- [ ] Nelle equazioni parametriche, "soluzioni reali" quando per un valore di $k$ l'equazione diventa di primo grado: i libri scrivono "$k \le \frac{3}{2}$" oppure "$k \le \frac{3}{2}$ e $k \ne 1$".

## Chimica (25 settembre 2026)
Le lezioni di chimica non sono nella beta; le domande restano per quando entreranno. Vedi [[2026-09-25 Chimica con RDKit]].
- [ ] La tavola delle masse atomiche, la classificazione degli amminoacidi, la soglia di polarità del legame.
- [ ] I nomi: coppia solitaria, propan-2-olo.
- [ ] Date e dati scritti a memoria, segnati "da verificare" nelle note di ogni lezione (`docs/lezioni/chimica/`).

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Standard di qualità]]
