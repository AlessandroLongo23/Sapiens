---
stato: in sviluppo
release: beta
aggiornato: 2026-09-26
tag: [prodotto, studenti, gamificazione]
---
# Adesivi

Adesivi che lo studente guadagna studiando, raccoglie in album e attacca sui quaderni dello [[Zaino]] e sull'avatar. Regole in [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]; entrano nella beta con un MVP sulle note, vedi [[2026-09-24 Adesivi nella beta, a partire dalle note]].

## Stato attuale
MVP sulle note, del 24 settembre 2026, committato ma non ancora in produzione (il deploy aspetta il merge su master):
- Nella modalità Semplice il bottone "Adesivi" della barra apre l'album con gli 8 adesivi del prototipo, tutti disponibili e riutilizzabili senza limiti (`src/components/zaino/NoteStickers.tsx`, catalogo in `src/lib/zaino/stickers.ts`).
- Il gesto è quello del prototipo, portato in `src/lib/zaino/sticker-board.ts`: tenuto per il centro, rotella o due dita per girarlo, clic o trascinamento per attaccarlo, clic o trascinamento sull'angolo per staccarlo. Sul telefono un tocco sul foglio sposta l'adesivo in mano, un trascinamento fa scorrere la nota. "Rimetti via" o Esc lo tolgono dalla nota.
- Salvataggio: tabella `note_stickers`, un record per nota con l'elenco in JSON (centro sul foglio da 792 px e rotazione), migrazione `supabase/migrations/20260924150000_note_stickers.sql`, applicata il 24 settembre 2026 al progetto Supabase `godqhjgwmlzfnymzhqdq` (RLS attiva, 4 regole). L'editor salva l'intero elenco 600 ms dopo l'ultima modifica con `PUT /api/zaino/note/[id]/adesivi`; se il salvataggio fallisce compare un avviso con "Riprova". Se la lettura degli adesivi fallisce, la nota si apre lo stesso, senza adesivi.
- Provato nel browser su desktop e su un Pixel 7 simulato: attacco con un clic e con un tocco, stacco con un clic. Il salvataggio risponde 200, dopo il ricaricamento l'adesivo torna nello stesso punto, e un altro studente che prova a scrivere sulla nota riceve 404.
- Restano fuori: suono, premi, album per materia, avatar, adesivi sulla modalità Avanzata.

Copertine delle pagine del materiale, del 26 settembre 2026 (richiesta di Alessandro), committate ma non ancora in produzione:
- Ogni pagina indice del materiale ha la sua copertina, indipendente dalle altre: `/materiale`, ogni livello, ogni materia e ogni capitolo di ogni materia. La fascia a quadretti in alto fa da copertina del quaderno, al posto dell'icona, che su queste pagine non c'è più. Lo studente che ha fatto l'accesso ha un bottone "Adesivi" in fondo alla riga del percorso, sceglie dall'album e attacca con lo stesso gesto delle note, anche sopra il titolo.
- La copertina parte con due adesivi già attaccati (π e ∞, `COVER_DEFAULTS` in `src/lib/zaino/stickers.ts`), perché si capisca che si possono staccare e cambiare. Li vedono anche i visitatori, fermi, già nell'HTML della pagina. Finché lo studente non cambia la copertina nel database non c'è niente; dopo il primo cambiamento si salva tutto l'elenco, e una copertina svuotata resta vuota.
- Componente `src/components/content/CoverStickers.tsx`; il motore delle note (`sticker-board.ts`) ha una modalità `fluid`, larga quanto la fascia e senza zoom.
- Posizione salvata come distanza dal centro della pagina, così su ogni schermo largo l'adesivo resta vicino alla stessa parola del titolo; sotto i 1280 px le distanze si restringono in proporzione.
- Salvataggio: tabella `cover_stickers`, una riga per studente e pagina (chiave il percorso interno: `library`, `high_school`, `high_school/math`, `high_school/math/insiemi-e-logica`), migrazione `supabase/migrations/20260926160000_cover_stickers.sql`, applicata il 26 settembre 2026 con RLS e 4 regole. La leggono e la scrivono `GET` e `PUT /api/adesivi`.
- Provato nel browser a 1440 px e su un Pixel 7 simulato, con un account di prova cancellato alla fine: attacco con un clic e con un tocco, salvataggio, ricaricamento nello stesso punto, stesso scarto del titolo a 1800 px, stacco con un clic e Esc, elenco vuoto salvato.
- Con la copertina, il 26 settembre 2026 il percorso in cima alle pagine indice è diventato un'etichetta in monospazio che finisce con l'occhiello (per esempio `MATERIALE DIDATTICO / SCUOLA SUPERIORE / MATEMATICA / CAPITOLO 01`): prima percorso e occhiello si ripetevano. Home resta solo nei dati strutturati.

Caricamento delle copertine, corretto il 26 settembre 2026: uno studente vedeva per un attimo gli adesivi predefiniti, poi sostituiti dai suoi. Ora uno script nel layout segna `html.signed-in` prima del primo disegno e il CSS nasconde i predefiniti a chi ha una sessione; il sito chiede tutte le copertine dello studente con una sola richiesta (`GET /api/adesivi`) e ne tiene una copia nel browser (`src/lib/state/covers.ts`), cancellata all'uscita; la tavola si monta prima del disegno. Misurato fotogramma per fotogramma: gli adesivi dello studente compaiono nello stesso fotogramma dell'idratazione della pagina (circa 200 ms sul server di sviluppo), senza adesivi che compaiono e spariscono.

Catalogo, del 26 settembre 2026, committato: gli adesivi sono file SVG in `stickers/<pacchetto>/`, scritti da Claude secondo la guida `stickers/STILE.md`. `npm run stickers` li controlla, converte il testo in tracciati (Fraunces e JetBrains Mono da Fontsource, simboli dai font di KaTeX) e scrive `public/stickers/` e l'indice `src/lib/zaino/sticker-catalog.json`; con `--png` fa anche una foto del foglio di prova (`stickers/foglio.html`). Un controllo prima del commit ferma sorgenti e file generati non allineati. Due pacchetti: i primi 8 adesivi, convertiti in file con gli stessi `id`, e i 10 capitoli del primo anno di matematica, ciascuno predefinito sulla copertina del suo capitolo accanto al π. L'album li mostra divisi per pacchetto. Provato nel browser il 26 settembre: copertina di "Insiemi e logica" per visitatore e studente, album, attacco e salvataggio.

Adesivi fustellati e dimensione, del 26 settembre 2026, su richiesta di Alessandro, committati:
- Un adesivo con `data-cut` ha la forma del suo disegno: la build allarga ciò che il disegno colora del margine indicato, riempie i buchi e traccia il contorno bianco (distanza euclidea, marching squares, curve smussate). Nel sito il file stesso fa da maschera a faccia, fasce, ombre e retro, così piega e ombre seguono la sagoma. Primi tre: il π disegnato a mano (`pi-sagoma`), la scritta a² + b² = c² (`pitagora-scritta`) e il Venn a due cerchi, che ha preso il posto dell'adesivo `insiemi`.
- Ogni adesivo attaccato ha una dimensione `s`, da 0,6 a 1,8 volte, che si sceglie mentre lo si tiene in mano: bottoni − e + nella barra, tasti + e −, Ctrl o ⌘ con la rotella (e il pizzico del trackpad), due dita sul telefono. Si salva con posizione e rotazione.
- Provato nel browser: π fustellato ingrandito a 1,48, salvato e ritrovato dopo il ricaricamento; stacco del Venn con la piega a forma di cerchio. Il pizzico a due dita sul telefono non è provato (da verificare su un telefono vero).

I pezzi grafici di partenza erano `src/components/ui/Sticker.tsx` e `src/components/content/flashcards/PeelSticker.tsx`. Non esiste un avatar.

## Obiettivo
- Un catalogo in file SVG scritti da Claude, con un indice e un foglio di prova, in pacchetti per capitolo di matematica, per materia, sullo studio e per stagione: vedi [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]] e [[2026-09-26 Pacchetti di adesivi per capitolo, materia, studio e stagione]]. Ogni copertina ha i predefiniti del suo pacchetto.
- Dopo la beta, lo studente crea adesivi suoi solo da modelli nostri (testo o formula su una sagoma), senza caricare immagini: vedi [[2026-09-26 Gli adesivi li crea Sapiens, gli studenti poi solo da modelli]].
- Un album per materia, come quello delle figurine, con le caselle vuote per gli adesivi mancanti.
- Un adesivo guadagnato si stacca dal foglio con lo stesso gesto delle flashcard e si attacca dove lo studente vuole: prima sulle copertine dei quaderni, poi sull'avatar.
- Si guadagnano con impegno e padronanza: giorni consecutivi della [[Pratica quotidiana]], un capitolo portato all'ultimo livello degli [[Esercizi]], un errore frequente superato, una verifica del [[Diario e calendario]] preparata. Alcuni arrivano a sorpresa.
- Collezioni stagionali (inizio anno, periodo delle verifiche, maturità) che restano ottenibili dopo la stagione.
- Sfide di comunità cooperative, senza classifiche, con obiettivi calcolati sugli utenti attivi.

## Dettagli
- Nessun adesivo si compra.
- Gli adesivi si calcolano sul server dalla tabella dei tentativi (vedi [[2026-09-23 Progressi salvati per ogni tentativo]]), come la serie di giorni.
- Stile: quello degli 8 adesivi di oggi (simboli, formule, diagrammi, scritte), fissato da una guida di stile che Claude scrive prima dei lotti. Gli 8 di oggi sono funzioni che scrivono SVG in `src/lib/zaino/stickers.ts`, scritte a mano da Claude il 24 settembre 2026 per il prototipo.

### Il gesto di attacco e stacco
Idea di Alessandro, 24 settembre 2026: attaccare e staccare un adesivo deve dare soddisfazione, con un effetto tattile convincente.

Attacco, con il mouse:
1. Da un cassetto con gli adesivi si clicca quello che si vuole, e l'adesivo si aggancia al puntatore.
2. L'adesivo segue il puntatore, tenuto per il centro; la rotella lo ruota intorno al centro.
3. Scelti punto e orientamento, si preme: tocca il foglio solo l'angolo d'appoggio, sempre quello in basso a sinistra sullo schermo. L'angolo di stacco è sempre quello opposto, in alto a destra. Quando l'adesivo ruota, i due angoli si scelgono di nuovo in base all'inclinazione, così restano sempre in quelle posizioni (Alessandro, 24 settembre 2026). Il resto è sollevato, leggermente curvo, con l'ombra sul foglio.
4. Tenendo premuto, si trascina verso l'angolo di stacco e l'adesivo aderisce poco a poco.
5. Quando il trascinamento esce dalla sagoma dell'adesivo, l'adesivo aderisce del tutto, con un lieve effetto di particelle.
6. Basta anche un clic: l'adesivo si stende da solo, dall'angolo d'appoggio a quello di stacco (Alessandro, 24 settembre 2026).

Stacco:
1. Al passaggio del puntatore compare l'angolo di stacco, come sulle [[Flashcard]].
2. Premendo e trascinando, l'animazione va nel verso opposto a quella dell'attacco. Basta anche un clic, come sulle flashcard: l'angolo resiste un istante e poi l'adesivo viene via tutto (Alessandro, 24 settembre 2026).
3. Quando l'adesivo è staccato del tutto si gira nel verso opposto a quello dello stacco: la piega si riapre all'indietro e il davanti torna su dalla parte da cui l'adesivo è venuto, senza completare un giro intero (Alessandro, 24 settembre 2026). Intanto arriva in mano, e alla fine oscilla appena, come l'onda dello strappo.

Note di progetto:
- L'attacco è lo stacco di `PeelSticker.tsx` al contrario: la piega come asse del segmento tra angolo e puntatore e il retro riflesso si possono riusare.
- Sapiens è mobile-first ([[2026-09-03 Mobile-first, poi PWA, poi Capacitor]]): sul telefono non ci sono rotella né passaggio del puntatore. Proposta: si trascina dal cassetto col dito, si ruota con due dita, l'angolo di stacco è sempre un po' sollevato come l'orecchia delle flashcard a riposo.
- Con "riduci movimento" niente particelle né oscillazione, solo una dissolvenza; da tastiera frecce per spostare, un tasto per ruotare, Invio per attaccare.
- Se si lascia a metà dell'attacco: oltre una soglia, o con un colpo veloce come sulle flashcard, l'adesivo finisce di aderire da solo; sotto la soglia torna in mano, agganciato al puntatore (Alessandro, 24 settembre 2026).
- Vibrazione all'aderenza completa sul telefono: `navigator.vibrate` funziona su Android ma non su Safari per iOS (da verificare); con Capacitor c'è il plugin Haptics.
- Desktop e tablet non vibrano (l'iPad non ha vibrazione), quindi la conferma passa da vista e suono. Proposta: alla pressione l'adesivo si schiaccia appena e l'ombra si stringe, all'aderenza completa un riflesso di luce attraversa la superficie; un suono breve e sommesso di carta che aderisce e di strappo, che si può spegnere e che non parte con l'audio del dispositivo disattivato (da decidere se acceso per default).
- Tablet: stesso gesto del telefono con le dita. Con la Apple Pencil l'iPad riconosce il passaggio sopra lo schermo, quindi l'angolo di stacco può comparire come col mouse (da verificare nel browser).
- Trackpad: lo scorrimento a due dita arriva come rotella ed è molto più fitto, quindi la rotazione va smorzata; su Safari per macOS si può usare anche il gesto di rotazione a due dita.
- Un adesivo staccato torna nel cassetto: non si perde.

### Prototipo
Il 24 settembre 2026 è pronto un prototipo del gesto in una pagina sola, fuori dal codice di Sapiens: https://claude.ai/artifact/B3vCZVbFiLsmzo8ivRMuZk (privato, da condividere con Dario dal menu Condividi). Ha 8 adesivi in stile cultura matematica, la copertina e la pagina a quadretti, l'attacco a fasce curve con l'ombra, lo stacco preso da `PeelSticker.tsx` e il ribaltamento dell'adesivo quando si stacca. Nelle regolazioni si cambiano soglia e sollevamento, e si accendono o spengono particelle, suono e rallentatore.

## Domande aperte
- Nell'MVP ogni adesivo si usa quante volte si vuole: va bene anche dopo, o un adesivo guadagnato è un pezzo solo, come una figurina?
- Perché gli adesivi entrano nella beta (vedi [[2026-09-24 Adesivi nella beta, a partire dalle note]]).
- Il suono degli adesivi è acceso o spento per default?
- Gli utenti Free guadagnano adesivi come gli abbonati? La sessione gratuita giornaliera è proprio l'abitudine che gli adesivi dovrebbero sostenere.
- Quanti adesivi per materia e per stagione, e ogni quanto esce un pacchetto stagionale.
- Perché non aspettare Dario per lo stile ([[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]]).
- Com'è fatto l'avatar, e se serve.
- Da quanti utenti attivi in su hanno senso le sfide di comunità.

## Collegamenti
- Attori: [[Studente]]
- Release: [[Release Beta]]
- Decisioni: [[2026-09-26 Gli adesivi li crea Sapiens, gli studenti poi solo da modelli]], [[2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario]], [[2026-09-26 Pacchetti di adesivi per capitolo, materia, studio e stagione]], [[2026-09-24 Adesivi nella beta, a partire dalle note]], [[2026-09-24 Le note sono fogli a larghezza fissa]], [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]], [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
- Idee: [[Mascotte per materia]]
