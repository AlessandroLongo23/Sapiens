# Note: Nomenclatura degli alcani

## Cosa c'è

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit. Ambito: alcani a catena aperta, formula generale $\mathrm{C}_n\mathrm{H}_{2n+2}$ con il perché, le tre formule (struttura, razionale, scheletrica), i primi dieci alcani lineari, i gruppi metile, etile e propile, le cinque regole IUPAC e dieci esempi svolti, compreso uno dal nome alla formula. Niente cicloalcani, niente sostituenti ramificati (isopropile, terz-butile) se non in una nota, niente alogeni.

Le regole sono quelle che applica il generatore `scripts/chimica/esercizi/alcani_nomenclatura.py`, con gli stessi nomi e le stesse radici, e gli errori nei riquadri sono i suoi distrattori: catena sbagliata (esempio 1 e avviso), numerazione dalla parte sbagliata (esempio 3), ordine alfabetico ed errore sul prefisso (dopo l'esempio 7), atomi contati male (avviso sulla formula scheletrica). In più c'è l'avviso sulla somma dei locanti, un errore vero degli studenti che il generatore non usa.

## Verifica dei nomi

Ogni nome della lezione e del formulario è stato controllato in due modi: `name_mol` del generatore sul SMILES della figura deve dare lo stesso nome italiano, e OPSIN deve leggere il nome inglese come la stessa molecola (SMILES canonici uguali). Tutti passano tutti e due i controlli, tranne 3-etil-2-metilesano (esempio 2), che passa solo OPSIN: il generatore non lo sa nominare (vedi sotto). Controllati con OPSIN anche i nomi sbagliati citati nel testo, che devono descrivere la stessa molecola: 4-metilpentano, 3,4,9-trimetildecano, 5-etil-3-metileptano, 2-etilpentano (= 3-metilesano), 1-metilbutano (= pentano), 3-isopropilesano (= 3-etil-2-metilesano).

Le catene colorate nelle figure vengono dalla catena che restituisce `name_mol`, tranne nell'esempio 8, dove il generatore sceglie la catena che passa per l'etile (dà lo stesso nome) e la lezione colora quella scritta dritta, come dice il testo.

## Figure

13 figure nella lezione, una nel formulario (copia della figura dell'esempio 7 con nome diverso). Guardate tutte in chiaro e in scuro. Correzioni fatte:

- i gruppi alchilici erano disegnati con un asterisco (atomo fittizio `*`) per il punto di attacco: nel tema scuro l'asterisco e il pezzo di legame vicino restano neri e spariscono, perché `figure.py` non ha un colore per l'atomo di numero atomico 0. Ora ogni gruppo è colorato in blu dentro una molecola (3-metilpentano, 3-etilpentano, 4-propileptano).

Da guardare sul sito: nel 2,7,8-trimetildecano e nel 4-etil-3-metil-5-propilnonano RDKit piega la catena, che resta leggibile grazie ai numeri ma non è uno zigzag dritto. Il giallo della catena nel tema scuro è un marrone scuro, poco contrastato con i numeri bianchi.

## Dubbi da decidere

- Regola della catena principale: la lezione segue le raccomandazioni IUPAC (catena più lunga, poi più ramificazioni). Alcuni libri di testo invertono o semplificano; va confrontato con il libro che usano le classi di Andrea.
- "Locante": ho introdotto il termine perché lo usano i libri e serve nelle regole. Alcuni libri dicono solo "numero".
- La formula razionale è scritta senza trattini tra i carboni, con una frase che cita l'altra forma. Va scelta una forma per tutte le lezioni di chimica.
- Il riquadro "Un controllo sul nome finito" (metile mai in 1, etile mai prima del 3, propile mai prima del 4) vale solo con sostituenti lineari, e la lezione lo dice.
- Il 5° anno ha già visto la nomenclatura in parte al 3° o 4° in alcuni licei: la lezione riparte da zero.

## Problemi trovati fuori dalla lezione

`figure.py` scrive il manifesto in `figure/<nome del file>.json`: la lezione e il formulario si chiamano tutti e due `03-alcani-nomenclatura.md`, quindi compilare il formulario sovrascrive il manifesto della lezione (e viceversa). Ho compilato prima il formulario e poi la lezione, così il manifesto su disco è quello della lezione; l'SVG del formulario c'è, ma non è in nessun manifesto. Da correggere nel compilatore (per esempio un prefisso `formulario-` nel nome del manifesto).

## Difetti del generatore (non corretti)

1. La spiegazione è sbagliata per le molecole simmetriche. `steps_for` scrive "I numeri sono ... da tutte e due le parti; decide l'ordine alfabetico dei sostituenti" ogni volta che i locanti sono uguali nelle due direzioni, anche quando c'è un solo tipo di sostituente e le due numerazioni danno lo stesso nome. Esempi: 3-metilpentano (livello 1) e 2,4-dimetilpentano (livello 2), dove l'ordine alfabetico non decide niente. Il nome è giusto, la spiegazione no.
2. Nella stessa spiegazione, "Sulla catena ci sono un metile" è sgrammaticato con un solo sostituente (serve "c'è"), e i gruppi sono elencati per lunghezza (metile, etile), non in ordine alfabetico come nel nome.
3. La regola "a parità di lunghezza, la catena con più ramificazioni" non decide mai in nessun esercizio. Con sostituenti solo lineari due catene lunghe uguali hanno sempre lo stesso numero di ramificazioni (l'ho controllato su 16 553 molecole a caso: mai), e le molecole in cui la regola servirebbe hanno per forza una catena candidata con un sostituente ramificato, che `name_mol` rifiuta restituendo `None`: per esempio 3-etil-2-metilesano e 3-etil-2,4-dimetilesano, il nome di esempio del brief. Il generatore quindi non sbaglia, ma non esercita questa regola; la lezione la insegna con l'esempio 2, verificato solo con OPSIN.
