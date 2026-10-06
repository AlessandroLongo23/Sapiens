---
aggiornato: 2026-10-05
tag: [sessione, contenuti, lezioni, strumenti]
---
# Strumenti nelle lezioni

Sessione del 5 ottobre 2026. Alessandro ha chiesto di rileggere le lezioni già scritte e cercare i punti dove ha senso montare gli strumenti nuovi (piano cartesiano, programma da eseguire, diagramma di flusso, tavola periodica, orbitali), senza forzare. Prima un passo esplorativo con un elenco di proposte, poi, approvato l'elenco, il montaggio.

## Cosa si è fatto
- Lette le 284 lezioni in cinque gruppi (matematica primo e secondo anno, fisica, chimica, informatica). Prima di questa sessione il blocco `grafico` era in due sole lezioni (87 e 88), `codice` e `diagramma` solo nel secondo anno di informatica.
- Montati 48 blocchi e 6 rimandi in 45 lezioni, in `docs/lezioni/**/riscritte/`. Non committati e non pubblicati.
  - Matematica, primo anno: 9 piani e un diagramma in 8 lezioni (11, 16, 18, 42, 44, 45, 50, 52).
  - Matematica, secondo anno: 19 piani e un diagramma in 15 lezioni (68, 69, 78, 81, 82, 83, 84, 85, 86, 89, 90, 91, 92, 93, 104).
  - Fisica: 5 piani (10, 12, 39, 41, 49).
  - Chimica: 2 piani (31, 32) e 5 rimandi agli strumenti (19, 22, 42, 43).
  - Informatica: 11 blocchi in 10 lezioni (05, 09, 10, 11, 12, 26, 36, 41, 53, 59) e un rimando nella 06.
- Le domande sui contenuti sono in [[Domande per Andrea]], sezione "Strumenti montati nelle lezioni".

## Verifiche
- `scripts/lezioni/check.mts` passa su tutti i file toccati.
- Guardati nel browser con Playwright: i 5 piani di fisica, 17 dei 19 piani del secondo anno di matematica, gli 11 blocchi di informatica (a 1280 e 390 px).
- Non guardati nel browser: i 10 blocchi del primo anno di matematica e i 2 piani di chimica (solo l'HTML della pagina di prova, e non per tutti).
- Mai provati: telefono vero, WebKit, tema scuro, i bottoni `anima`, i gesti di modifica dei diagrammi, i link verso `/strumenti/` con i parametri.

## Da sapere
- I segmenti si disegnano nel blocco `grafico` come curve in $t$ con un parametro dentro: così sono entrate la distanza punto-retta (85) e i blocchi di 82, 83 e 104.
- Trappole di sintassi: i decimali dentro le formule si scrivono `0{,}5`; i nomi degli assi hanno al massimo 8 caratteri; il nome di un asse compare solo se l'asse è dentro la finestra; un cursore non può chiamarsi $\Delta t$; il plotter non legge `P'`.
- `valore:` scrive il numero senza unità, passa alle frazioni quando due decimali non bastano e dice "non esiste" anche quando le soluzioni sono infinite. In tre blocchi di fisica i valori sono stati tolti o cambiati per questo.
- Il bottone "Reset" del piano copre lo zero e la prima tacca nell'angolo in basso a sinistra.
- Il diagramma della 59 è largo 876 px e quello della 26 689 px: si scorrono dentro il riquadro, anche da computer.
- I link verso `/strumenti/` dentro le lezioni sono i primi, e `check.mts` controlla solo i link `/materiale/`.
- Le righe `% poi-interattivo:` delle figure coperte dai blocchi nuovi sono rimaste nei sorgenti.

## Rimasto aperto
- Guardare nel browser i blocchi non visti, poi commit e pubblicazione (le decide Alessandro).
- La tavola periodica dentro le lezioni chiede un blocco `tavola` che non esiste. Dove servirebbe: 43 (le coppie Te/I, Co/Ni, Ar/K, la tavola moderna, le previsioni di Mendeleev), 42 (isotopi del cloro), 02 (elettronegatività sui primi tre periodi). Opzioni minime: vista iniziale, proprietà, elementi o gruppi evidenziati (oggi manca), elemento aperto all'avvio, griglia ridotta ai primi periodi, domanda.
- La lezione 52 sugli orbitali non ha punti scoperti.
- Cosa manca agli strumenti e alzerebbe altre proposte: punti trascinabili nel blocco `grafico`, unità e decimali fissi in `valore:`, due piani accoppiati (v-t sopra s-t), una retta dei numeri con i cursori (circa 15 TikZ statiche al primo anno).
- Proposte lasciate fuori: 30 (prodotti notevoli), 71, 14, 07 e 08, 58 e 01 di informatica, 11 e 20 di chimica.

## La sandbox di fisica
Nella stessa sessione Alessandro ha proposto uno strumento per la fisica, che oggi non ne ha uno: una scena fatta di pezzi, con forze e grafici accanto. Claude ha fatto notare che contraddiceva la decisione del 29 settembre ("niente motore fisico") e ha proposto un motore nostro basato sui vincoli, corpi che non ruotano, la carrucola nel primo set e la statica dall'inizio. Alessandro ha approvato il piano e ha chiesto di partire.

Fatta la prima fetta, non committata: il motore (`src/lib/sandbox/engine.ts`) con 10 test contro le formule chiuse, cinque scene (piano inclinato, Atwood, piano e peso appeso, due fili, lancio da un tavolo), l'interfaccia divisa tra scena e forze con grafici (`src/components/sandbox/`), e la pagina di prova `/prova-fisica/sandbox`. Provata con Playwright a 1280 e 390 px. Stato, limiti e seguito in [[Sandbox di fisica]]; decisioni in [[2026-10-05 La sandbox di fisica ha un motore nostro, basato sui vincoli]] e [[2026-10-05 La prima sandbox ha corpi che non ruotano, con statica e moto insieme]].

Vista la pagina di prova, Alessandro ha chiesto di lasciare fuori l'editor e di preparare da una a tre lezioni di esempio, diverse tra loro e curate nel layout, perché nella colonna di una lezione c'è molto meno spazio. Fatta la versione per le lezioni (`LessonScene.tsx`) e tre scene nelle lezioni 20, 55 e 54 di fisica, non pubblicate: una ferma con sole forze, una con moto, forze e grafico, una con moto e grafico. Guardandole con Playwright sono venuti fuori e sono stati corretti: la colonna vera è larga 568 px e non 896 come la pagina di prova; il motore fermava il blocco quando il pesetto toccava terra (ora la corda si allenta); la cassa che torna in fondo alla rampa si incastrava nell'angolo con il pavimento (ora la corsa finisce lì).

## Revisione del 6 ottobre 2026
Alessandro ha guardato le scene e ha chiesto due cose, fatte lo stesso giorno. Le frecce delle forze cambiavano lunghezza anche quando la forza restava uguale, perché la scala si adattava alla forza più grande: ora la scala è fissa per scena (vedi [[Sandbox di fisica]], "Dettagli"). La figura `corpo-due-fili-tensioni` della lezione 20, che è una figura del kit e non una scena della sandbox, ha un cursore per la distanza tra le pareti, da 1,6 a 3,65 m. Alessandro ha corretto la prima versione, dove i fili si allungavano: i fili hanno sempre la stessa lunghezza (1,85 m), quindi avvicinando le pareti il corpo scende e i fili diventano più ripidi, allontanandole sale e i fili si tendono. A 3,2 m gli angoli sono di 30° e la tensione è 19,6 N, a 1,6 m 64° e 10,9 N, a 3,65 m 9° e 63 N. Il disegno è più alto per far posto alla discesa, e i punti di attacco si trascinano ancora lungo le pareti.

Il server di sviluppo di Sapiens quel giorno era sulla porta 3111, perché sulla 3000 girava un altro progetto.

## Editor della sandbox e revisione del terzo anno di fisica (6 ottobre 2026)
Alessandro ha chiesto due cose: un controllo veloce delle 29 lezioni del terzo anno di fisica, scritte nel frattempo in un'altra sessione, e lo strumento generico con l'editor.

L'editor è fatto e provato nel browser: vedi [[Sandbox di fisica]], "Stato attuale".

La revisione (lezioni 71-99, 33 figure interattive lette per intero, 150 esempi rifatti, niente guardato nel browser) ha trovato sei errori, corretti lo stesso giorno:
- `BernoulliTubo`: la freccia di $v_2$ aveva un tetto, e da 5 m/s in su sembrava sempre uguale. Ora le due velocità hanno una scala sola, 0,19 cm per m/s.
- `CarrucolaMassaSecchio`: la freccia dell'accelerazione non era proporzionale, e la carrucola girava cinque volte più in fretta della fune. Ora 0,12 cm per m/s², e la carrucola disegnata gira con la fune disegnata.
- `NaveGalileo`: la velocità della nave aveva una scala doppia rispetto alla stessa velocità disegnata sul sasso.
- Lezione 89, figura del rotolamento: la freccia di $\omega$ girava in senso antiorario con la ruota che va a destra.
- Lezione 71, esempio del lavoro del peso: il controllo con $h = 1{,}06$ m dava $-41{,}6$ J e non $-41$; ora $h = 1{,}057$ m.

Le altre 30 figure rispettano le due regole di questi giorni (frecce a scala fissa, vincoli rispettati). Restano da valutare, e sono in [[Domande per Andrea]]: le barre dell'energia normalizzate in `RampaPavimentoAttrito`, sette figure che non partono dai numeri di un esempio, il peso scritto $mg$ in alcune figure e $P$ in altre, $F_s$ usato per la forza del suolo nella 81, il colore della quantità di moto.

## Collegamenti
- [[Piano cartesiano nelle lezioni]], [[Grafico di funzioni]], [[Editor di codice]], [[Diagrammi di flusso eseguibili]], [[Tavola periodica interattiva]], [[Orbitali atomici interattivi]]
- [[Domande per Andrea]]
