# Privacy e dati personali

Generatore: `inf-privacy` (`src/lib/exercises/v2/generators/inf-privacy.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_privacy.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/43-inf-privacy.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (campioni in testo semplice). Le domande restano su
quello che la lezione dice: niente numeri di articolo, niente casi legali al limite, niente date o età da ricordare.

## Nomi dei livelli

1. È un dato personale?
2. Interessato e titolare
3. Le regole di chi tratta i dati
4. I tuoi diritti
5. I permessi di un'app
6. Vero o falso sulla privacy

## Livello 1: è un dato personale?

Dodici dati personali comuni (`p1`-`p12`), otto informazioni che non riguardano nessuno in particolare (`n1`-`n8`),
otto dati delle categorie particolari (`s1`-`s8`). Tre domande:

- personale (35 su 100): "Quale di queste informazioni è un dato personale?" Uno personale e tre no.
- non personale (30 su 100): "… non è un dato personale?" Una che non lo è e tre dati personali.
- particolare (35 su 100): "Quale di questi dati personali appartiene alle categorie particolari, protette con più
  severità?" Uno particolare e tre comuni.

Esempio: La targa del motorino di tuo fratello; La media dei voti di tutta la scuola; Il prezzo di un biglietto
dell'autobus; L'orario di apertura della biblioteca. Risposta: la targa.

Distrattore: "non c'è il nome, quindi non è un dato personale" (l'avviso della lezione): la targa, il soprannome, la
posizione.

## Livello 2: interessato e titolare

Otto trattamenti con un nome estratto ("La scuola conserva nel registro elettronico i voti di Elena."). Due domande,
metà ciascuna: "Chi è l'interessato?" e "Chi è il titolare del trattamento?" Opzioni: la persona; chi tratta i dati;
Il Garante per la protezione dei dati personali; un estraneo (chi ha costruito il telefono, i compagni di classe, il
fornitore della connessione, l'Unione europea).

Distrattore: lo scambio tra interessato e titolare, e il Garante preso per chi tratta i dati.

## Livello 3: le regole di chi tratta i dati

Quindici situazioni, tre per regola, con un nome estratto; alcune rispettano la regola, altre la violano. Domanda: "Di
quale regola sul trattamento dei dati si parla?" Opzioni: quattro tra Finalità, Minimizzazione, Conservazione
limitata, Trasparenza, Sicurezza. Un quinto dei casi ciascuna.

Esempio: "Un'app che fa da torcia chiede a Marco l'accesso alla rubrica." Risposta: Minimizzazione.

## Livello 4: i tuoi diritti

Quindici richieste, tre per diritto, con un nome estratto. Domanda: "Quale diritto sta esercitando?" Opzioni: quattro
tra accesso, rettifica, cancellazione, opposizione, portabilità. Un quinto dei casi ciascuno.

Esempio: "Giulia cambia servizio di musica e chiede al vecchio le sue playlist in un formato da portare al nuovo."
Risposta: Il diritto alla portabilità.

Distrattore: accesso e portabilità (la copia dei dati, il formato da portare altrove); cancellazione e opposizione.

## Livello 5: i permessi di un'app

"Elena installa un'app che legge i codici QR. L'app chiede diversi permessi: quale di questi è giustificato da quello
che deve fare?" Otto app, ognuna con i permessi che servono a ciò che fa e quelli che chiaramente non servono; sette
permessi (fotocamera, galleria, rubrica, posizione precisa, microfono, calendario, SMS). Un permesso che serve e tre
che non servono. I permessi dubbi non compaiono mai (la galleria per il lettore di codici QR, il microfono per le
mappe).

## Livello 6: vero o falso sulla privacy

Dodici affermazioni vere e dodici false, le false prese dagli avvisi ("non c'è il mio nome", "cancellare vuol dire
far sparire", la foto di gruppo). Metà "… è vera?", metà "… è falsa?".

## Esercizi da evitare

- Numeri di articolo, sanzioni, termini di legge, l'età del consenso.
- Dati al confine tra comuni e particolari: la foto del viso e la voce registrata non compaiono tra le opzioni
  quando si chiedono le categorie particolari.
- Situazioni che toccano due regole o due diritti insieme.

## Verifica

`inf_privacy.py` ha la sua tabella di ogni informazione (di nessuno, personale, particolare); al livello 2 trova nel
testo la persona e chi tratta i dati; ai livelli 3 e 4 classifica la situazione dalle parole e boccia quelle che ne
contengono di zero o di due categorie; al livello 5 ha la tabella dei permessi di ogni app, con quelli dubbi che non
devono comparire; al livello 6 la tabella di affermazioni vere e false.

## Domande per la revisione

- Livello 1: la foto del viso e la registrazione della voce sono trattate come dati personali comuni (diventano
  biometrici solo se usati per riconoscere). Va bene tenerle fuori quando si chiedono le categorie particolari?
- Livello 5: la tabella dei permessi (per esempio: l'app che fa la copia dei numeri ha bisogno della rubrica, non
  della posizione) va bene? Quali altri permessi sono da considerare dubbi?
