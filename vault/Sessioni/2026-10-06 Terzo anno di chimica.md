---
aggiornato: 2026-10-06
tag: [sessione, contenuti, chimica]
---
# Terzo anno di chimica

Sessione del 6 ottobre 2026. Alessandro ha chiesto lezioni, esercizi, flashcard e formulari del terzo anno di chimica delle superiori, con le componenti interattive e le figure TikZ. Il terzo anno sono 35 lezioni in sette capitoli; due erano già scritte ("La geometria delle molecole", file 02, e "Orbitali e numeri quantici", file 52). Le altre 33 sono scritte e verificate, con note, formulari, flashcard, figure e generatori di esercizi. Non sono pubblicate né committate: aspettano il via libera di Alessandro.

## Cosa si è fatto
- Brief del lotto: `docs/lezioni/chimica/brief-terzo-anno.md`, con i confini tra le lezioni, le costanti e i simboli del terzo anno, le convenzioni di nomenclatura e le due fasi (lezioni, poi generatori).
- Dieci gruppi in parallelo, file 48-82 (il 68 non si usa: è il posto della VSEPR):
  - A, struttura elettronica: 48 luce e spettri, 49 Bohr, 50 livelli e sottolivelli, 51 onda-particella
  - B: 53 configurazione elettronica, 57 gruppi periodi e blocchi, 58 simboli di Lewis
  - C, nucleo: 54 radioattività, 55 tempo di dimezzamento, 56 fissione e fusione
  - D, proprietà periodiche: 59 raggio ed energia di ionizzazione, 60 affinità ed elettronegatività, 61 metalli e non metalli
  - E, legami: 62 ottetto, 63 legame covalente, 64 covalente polare e dativo
  - F, legami: 65 ionico, 66 metallico, 67 formule di Lewis
  - G, forma delle molecole: 69 polarità, 70 legame di valenza, 71 ibridazione
  - H, forze intermolecolari: 72 dipolo-dipolo e London, 73 legame a idrogeno, 74 stato liquido, 75 solidi
  - I, nomenclatura: 76 numero di ossidazione, 77 ossidi, 78 idruri e idracidi, 79 idrossidi
  - J, nomenclatura: 80 ossiacidi, 81 sali binari, 82 sali ternari
- A metà lavoro sei gruppi sono stati fermati dal limite di sessione, con tutti i file già sul disco; sono ripartiti e hanno chiuso controlli e resoconto.
- I 33 generatori sono collegati al sito in `index.ts`, `config.ts` e `level-names.ts`. I nomi dei livelli del gruppo F, scritti in prima persona, sono stati riportati alla forma degli altri.

## Numeri
- 33 lezioni, circa 678.000 caratteri, 119 figure TikZ, 43 figure interattive, 651 flashcard.
- 33 generatori, 187 livelli, tutti a scelta multipla.
- Nessun blocco `grafico` e nessun disegno di RDKit: le formule di Lewis sono TikZ, perché RDKit non disegna le coppie solitarie.

## Cosa si è deciso mentre si scriveva
Sono scelte di chi ha scritto, da confermare con Andrea: vedi [[Domande per Andrea]], sezione "Terzo anno di chimica".
- I dati degli elementi vengono da `src/lib/tools/elementi.json`, così lezioni e tavola periodica del sito dicono la stessa cosa.
- Soglie di $\Delta\chi$ a 0,4 e 1,9, date come regola pratica. Tre gruppi hanno trovato che 1,9 lascia fuori composti ionici veri; gli esercizi usano solo le coppie in cui la soglia e "metallo più non metallo" concordano.
- Configurazione scritta nell'ordine di riempimento, $4s^2\,3d^6$.
- Per ogni composto i tre nomi nell'ordine tradizionale, Stock, IUPAC; prefissi IUPAC senza elisione; per gli ossiacidi due nomi soli, perché il numero romano è già nel nome IUPAC.
- La freccia del dipolo punta verso $\delta^-$, con la croce sulla coda (64 e 69). La lezione 02 non la disegna.
- "Kripton", come la tavola del sito: corretti le lezioni 43, 53 e 57, cinque generatori e i loro controlli, che scrivevano "cripto".
- La risposta aperta resta fuori: 19 generatori avevano proposto livelli con un numero intero come risposta, ma `open-answers.mts` accetta solo lezioni di matematica, e nessuno ha provato se il correttore legge un numero di ossidazione scritto "+6". Le righe proposte sono nei resoconti dei gruppi; per ora ogni livello è a scelta multipla.
- I prerequisiti non sono in un file: `docs/lezioni/prerequisiti.md` è della sola matematica. Ogni nota di lezione ha la riga `Prerequisiti proposti:`.
- L'esercizio guidato ([[2026-10-06 Le lezioni hanno un esercizio guidato, con fermate non fisse]]) non ha ancora il suo blocco: ogni nota indica l'esempio svolto adatto e i punti in cui fermarsi.

## Verifiche
- `check.mts` su lezioni, formulari e flashcard: 99 file, nessun errore. Gli avvisi rimasti sono nomi propri nei titoli (Bohr, Lewis, Stock, London) e grassetti sui termini definiti.
- Ogni generatore: 1000 esercizi per livello con i seed 1, 50001 e 777001 dai gruppi, errori piantati bocciati, `review.mts` e `width.mts` a zero; poi tutti insieme con un quarto seed, 300 per livello: tutti passano.
- `tsc` senza errori dopo il collegamento; `open-answers.mts` esce con 0.
- Nel browser, in sviluppo, a 390 px: le 33 lezioni su `/prova-grafico/lezione` senza errori di KaTeX, immagini mancanti, errori in console o scorrimento laterale, con le 43 figure interattive montate.
- Le pagine degli esercizi su `/prova-grafico/esercizio` a 390 px, ogni livello con due seed (374 pagine): al primo giro 18 davano errore 500. Sette generatori dei gruppi A, C e H (`chim-modello-bohr`, `chim-livelli-energia`, `chim-radioattivita`, `chim-tempo-dimezzamento`, `chim-forze-dipolo-london`, `chim-legame-idrogeno`, `chim-stato-solido`) davano a nove livelli una risposta numerica senza dichiarare `toChoice`, e il sito non trovava le quattro opzioni; i controlli dei gruppi non lo vedevano, perché `sample.mts` non passa dal server. Aggiunto `toChoice` ai sette, rifatti i tre seed, `review.mts`, `width.mts` e le loro 78 pagine: nessun errore.
- `review.mts` e `width.mts` rifatti anche su `chim-fissione-fusione`, che il gruppo C aveva cambiato dopo l'ultimo giro: escono con 0.
- Dati condivisi tra i gruppi confrontati: raggi ionici (59 e 65), affinità del cloro (60 e 65), energie dei legami tra carboni (63 e 70) coincidono. Le energie di ionizzazione successive dei gruppi A e D differiscono di 1 kJ/mol in due valori (terza del carbonio, prima del silicio), per l'arrotondamento di un mezzo.
- Le domande fisse dei generatori 73, 74 e 75, scritti da aiutanti del gruppo H e letti da quel gruppo solo a campione, sono state rilette una per una: nessun errore trovato.
- I dati nucleari (tempi di dimezzamento, masse, energie di legame) sono controllati sulle tabelle NUBASE2020 e AME2020 dell'IAEA, scaricate il 6 ottobre 2026.

## Limiti
- Dati scritti a memoria, da verificare su una fonte: energie di ionizzazione successive, raggi ionici, affinità elettroniche, energie e lunghezze di legame, energie reticolari, momenti dipolari, temperature di ebollizione, tensioni di vapore (da un'equazione di Antoine con costanti a memoria), righe degli spettri, date e nomi. Gli elenchi sono nelle note delle lezioni. Gli stessi numeri stanno spesso in tre posti (figura, generatore, controllo): andrebbero in `elementi.json` o in un file solo.
- In `elementi.json` mancano i numeri di ossidazione $+3$ del cloro, $-1$ dell'ossigeno, $+7$ del bromo e $+6$ del manganese, che le lezioni 76-80 usano.
- Nessun esercizio mostra un disegno: niente diagrammi a caselle, simboli o formule di Lewis tra le opzioni. Servirebbero tipi di scena nuovi.
- Livelli con poche domande diverse: il 4 di `chim-tempo-dimezzamento` (otto), il 5 di `chim-idruri-idracidi` (cinque idracidi), i livelli a domande fisse di 65, 66, 74 e 75 (da 10 a 25), i gruppi piccoli di 80-82.
- N₂O₃ manca dalla 67, che è al limite dei 25.000 caratteri. La 71 non ha una figura dell'etino. Il legame dativo (64) non ha una figura interattiva.
- Alcune lezioni ed esercizi nominano composti rari o che in pratica non esistono (CuOH, Pb(OH)₄, Fe₂S₃, le anidridi di bromo e iodio); la figura della 82 lascia costruire sali che non esistono senza avvisare.
- Le lezioni dei gruppi A e C non sono state rilette per intero dall'inizio: frasi vietate cercate su tutti i file e conti rifatti con gli script.
- Le figure interattive sono state viste dai gruppi in chiaro, in scuro e a 390 px, non in tutte le combinazioni; i cursori della figura della 74 non sono stati mossi. Tre gruppi hanno visto una volta un avviso di React in console ("state update on a component that hasn't mounted yet"), sparito ricaricando; nel passaggio finale sulle 33 lezioni non è comparso.
- `scripts/figure/anteprima-interattivo.mjs` aspetta che la rete sia ferma e con la macchina carica va in timeout: tre gruppi hanno usato una copia loro. Da correggere nello script.
- Niente provato su un telefono vero, su Safari o su Firefox.

## Da sapere prima di pubblicare
- L'ordine: prima il codice (generatori e figure interattive) su master e in produzione, poi le lezioni con `publish.mts --dir docs/lezioni/chimica --per-slug`.
- Nella cartella ci sono lezioni di chimica del biennio modificate da un'altra sessione ([[2026-10-05 Strumenti nelle lezioni]]: 19, 22, 31, 32, 42, 43) e non pubblicate: `publish.mts` non ha un filtro e pubblicherebbe anche quelle. La 43 ha in più la correzione di "kripton".
- Le lezioni del biennio che rimandano al terzo anno (43) trovano ora le lezioni scritte. La 02 e la 52 non rimandano ancora alle lezioni nuove del loro capitolo.
- Il sito in sviluppo il 6 ottobre rispondeva sulla porta 3131; sulla 3000 girava un altro progetto.

## Prossimo argomento
Il via libera di Alessandro per commit, PR e pubblicazione. Poi le risposte di Andrea, a partire dalle soglie di $\Delta\chi$ e dalla nomenclatura IUPAC, e la risposta aperta per le materie diverse dalla matematica. Il quarto anno di chimica sono 45 lezioni (soluzioni, stechiometria, termochimica, cinetica, equilibrio, acidi e basi, redox, elettrochimica).

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Programma ministeriale]], [[Domande per Andrea]], [[Tavola periodica interattiva]], [[Orbitali atomici interattivi]]
- [[2026-09-30 Biennio di chimica]], [[2026-10-05 Terzo anno di matematica]], [[2026-10-03 Video del prof. Atzeni]]
