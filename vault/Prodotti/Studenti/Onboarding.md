---
stato: in sviluppo
release: beta
aggiornato: 2026-10-07
tag: [prodotto, studenti, onboarding]
---
# Onboarding

Il percorso di chi si iscrive, dal primo clic su "Registrati" alla prima prova finita. Nella beta è completo per lo studente e ha una porta per ogni altro attore.

## Stato attuale
Dalla notte del 7 ottobre 2026 il percorso dello studente chiede anche la scuola. Nel codice, non committato e non pubblicato; la migrazione `20261007230000_onboarding_level.sql` (colonna `profiles.school_level`) è applicata. Vale questo paragrafo; dove quelli sotto dicono altro, sono superati.

- "Che scuola fai?" viene subito dopo "Chi sei?" (ed è il primo passo di `/benvenuto`): tre carte verticali, Medie, Superiori, Università, con gli oggetti delle carte dei livelli della biblioteca (matite, pila di libri, tocco) disegnati dal vivo. I tre modelli sono esportati da `scripts/materie/icons.py` in `public/onboarding/` (0,8 MB) e rifanno il ciclo dei filmati con le stesse curve (`stage-engine.ts`).
- Università: l'età non si chiede, e l'account nasce con la fascia "14 o più". Medie e superiori: l'età si chiede come prima.
- Solo le superiori proseguono con anno, materie e argomenti, perché sono l'unico livello con lezioni ed esercizi. Medie e università vanno alla schermata finale, che dice "Le lezioni delle medie (dell'università) sono in arrivo", e poi all'account. Il link "Non faccio le superiori" della domanda sull'anno è tolto.
- Il server salva `school_level` e, per un livello diverso dalle superiori, non tiene anno, materie e argomenti.
- Provato con Playwright su computer e telefono: i tre percorsi fino alla schermata dell'account, con il numero giusto di segmenti nella barra (4 per l'università, 5 per le medie). Lint e typecheck puliti. Non provati: un'iscrizione vera con il livello salvato, `/benvenuto`, il movimento ridotto.

Dalla tarda sera del 7 ottobre 2026, su richiesta di Alessandro, le schermate dalle materie in poi hanno il colore della materia. Nel codice, non committato e non pubblicato. Vale questo paragrafo; dove quelli sotto dicono altro, sono superati.

- Colore: le carte delle materie, la scritta "Quaderno 2 di 3", il capitolo e la lezione scelti, la ricerca e la schermata del quaderno aperto prendono il colore della materia (rosso, blu, verde, arancio), da una sola variabile, `--ob-tone` in `onboarding.css`, che un elemento cambia portando `data-subject`. La barra in alto e "Continua" restano rossi.
- Barra in alto: un segmento per passo, che si riempie quando il passo è lasciato alle spalle. Scegliere una materia con lezioni aggiunge il suo segmento (con tre materie i passi dello studente sono nove).
- Quaderno aperto: la pagina di destra ha la lezione, materia e capitolo, e una figura presa dalla lezione, incollata come un ritaglio con un pezzo di nastro del colore della materia; dove la lezione non ha figure c'è l'adesivo del capitolo. L'interno della copertina è del colore della copertina, non più beige, e ha un foglio incollato con "Il percorso": i livelli della lezione con il loro nome, il primo segnato "si parte da qui"; sotto, la riga sui giorni di prova. Sul telefono la pagina e il percorso sono due fogli uno sotto l'altro.
- Da dove vengono i dati: i nomi dei livelli da `src/lib/exercises/level-names.ts`, mandati con l'elenco delle lezioni; la figura da `GET /api/onboarding?lesson=<percorso>`, che legge la teoria della lezione e prende il primo disegno pubblicato (TikZ o chimica) di forma non troppo larga. La pagina la chiede appena la lezione è scelta. 361 lezioni su 426 con la teoria hanno almeno una figura (contate sul database il 7 ottobre 2026).
- Provato nel browser con Playwright, su computer (1512x949) e telefono (390x844): tre materie scelte, quaderno aperto di matematica, fisica e chimica. Lint pulito. Non provati: il tema scuro, una lezione senza figure, una lezione con 8 o 9 livelli (il foglio li tiene su una riga ciascuno), Safari e Firefox, un telefono vero.

Dalla notte del 7 ottobre 2026 il percorso dello studente chiede le materie ([[2026-10-07 L'onboarding chiede le materie e un argomento per materia]]). Nel codice, non committato e non pubblicato; la migrazione `20261007180000_onboarding_subjects.sql` è applicata. Vale questo paragrafo; dove quelli sotto dicono altro, sono superati.

- Passi dello studente: chi sei, età, anno, materie (scelta multipla, "in arrivo" su quelle senza lezioni per l'anno), una schermata per materia con l'argomento ("Lo scelgo dopo" la salta), "Da quale vuoi cominciare?" se i quaderni compilati sono più di uno, il quaderno aperto sulla prima pagina, l'account. `/benvenuto` fa gli stessi passi dall'anno in poi e salva alla fine.
- Ogni materia è un quaderno del suo colore (rosso, blu, verde, arancio), con il suo oggetto 3D e la sua etichetta; quelli già scelti restano in pila sotto quello in mano. Le materie senza adesivi di capitolo ne hanno uno della materia (pendolo, beuta, parentesi graffe).
- Il server (`src/lib/server/onboarding.ts`) legge le quattro materie delle superiori e salva `subjects`, `topics` e `topic` (la lezione di partenza); controlla che ogni lezione esista e appartenga alla materia sotto cui arriva.
- Corretti lo stesso giorno, su segnalazione di Alessandro: titolo e quaderno partono dall'alto e non si spostano più al cambiare dell'elenco, che scorre dentro la schermata; l'interno della copertina ha una faccia sua ("In questo quaderno") scelta dalla pagina striscia per striscia; la copertina è fatta di otto strisce incernierate, si piega mentre gira e ricade aperta di piatto a sinistra, e per farle posto il quaderno si sposta al centro.
- Provato nel browser, su computer e telefono: tre materie scelte, due compilate e una saltata, scelta del quaderno, iscrizione vera fino alla pagina degli esercizi di fisica con materie e argomenti salvati. Non provati: Safari e Firefox, un telefono vero, la suite Playwright.

Dalla sera del 7 ottobre 2026 il percorso è stato rifatto una seconda volta, dopo che Alessandro ha chiesto più qualità ("mi devi impressionare"). Nel codice, non committato e non pubblicato. Vale questo paragrafo; dove quelli sotto dicono altro, sono superati.

- L'idea che tiene insieme le schermate: lo studente compila l'etichetta del suo quaderno. Su computer il quaderno sta a destra delle domande (`src/components/onboarding/Notebook.tsx`): Nome, Classe, Materia e Oggi si scrivono a penna quando si sceglie, e a matita mentre il puntatore passa su una risposta. Scelta la lezione, sulla copertina va l'adesivo del suo capitolo (da `coverDefaults` di `src/lib/zaino/stickers.ts`). Alla schermata "Sappiamo da dove cominciare" la copertina si apre sulla prima pagina, con la lezione e i suoi livelli. All'account il quaderno si richiude e il nome compare sull'etichetta mentre lo si scrive; creato l'account va il timbro "visto" e si apre la pagina degli esercizi. Su telefono il quaderno è una striscia sopra la domanda e la prima pagina è un foglio nella schermata.
- Gli oggetti sono disegnati dal vivo con three.js, non più filmati (`stage-engine.ts`, `Stage.tsx`): una sola tela copre la finestra e mette ogni oggetto dove la pagina ha un elemento `data-stage-slot`. Si girano verso il puntatore, si alzano quando il puntatore è sulla loro carta, saltano con un giro quando vengono scelti e volano da una schermata all'altra (lo zaino dalla carta all'angolo del quaderno). Alcuni hanno una parte che si muove: il tetto della casa, i raggi della lampadina, la bandiera e l'orologio della scuola, e i quattro oggetti delle materie rifanno il ciclo dei filmati delle carte delle materie, con le stesse curve e la stessa durata di 2,5 secondi: il compasso cancella e ridisegna il cerchio, il pendolo di Newton oscilla, l'anello del benzene scatta due volte di un sesto di giro, i tasti si premono uno dopo l'altro. I modelli sono quelli di `scripts/materie/icons.py`, esportati con la modalità nuova `glb` in `public/onboarding/` (7 file, 1,8 MB), con un fermo immagine per chi ha il movimento ridotto o non ha WebGL.
- Risposte: tasti che scendono sotto il dito, con il numero da tastiera in alto a sinistra su computer (1-5 sceglie, Esc torna indietro). La parola chiave di ogni domanda è passata con l'evidenziatore del sito. Nell'argomento c'è una ricerca tra le lezioni dell'anno. I campi dell'account hanno l'etichetta dentro e una spunta quando il valore è valido.
- Provato nel browser la sera del 7 ottobre, su computer e telefono: tutto il percorso con il mouse e con la sola tastiera, la ricerca, un'iscrizione vera fino alla pagina degli esercizi con anno e argomento salvati, le altre porte, il movimento ridotto. Typecheck, lint e i 725 test unitari passano. Non provati: Safari e Firefox, un telefono vero (le prestazioni della tela su un telefono lento), la suite Playwright.

Dal pomeriggio del 7 ottobre 2026 l'ingresso è un percorso a pagina intera ([[2026-10-07 L'onboarding è un percorso a pagina intera, con l'account alla fine]]), nel codice, non committato e non pubblicato.

- `/iscriviti` (`src/app/iscriviti/`, `src/components/onboarding/Onboarding.tsx`, `onboarding.css`), fuori dalla cornice del sito, sulla carta a quadretti: una barra in alto con indietro, avanzamento a segmenti e "Accedi"; una domanda per schermata; le risposte sono carte che si scelgono con un tocco e fanno avanzare.
- Studente: "Chi sei?" (cinque carte con un oggetto 3D ciascuna), "Quanti anni hai?" (meno di 14, 14 o più), "Che anno fai?", "Cosa state facendo in matematica?" (capitoli, poi lezioni), un foglio "Il tuo punto di partenza" con la lezione scelta e i suoi livelli, poi l'account. Niente va al server prima dell'account; con l'account si salvano anno e argomento e si apre la pagina degli esercizi della lezione. Sotto i 14 anni il modulo chiede l'email di un genitore e l'ultima schermata dice che gli è stato scritto.
- Genitore, tutor, docente: una schermata con quello che c'è oggi per loro, poi l'account, con la dichiarazione dei 18 anni. Scuola: la schermata e il link ai contatti.
- `/benvenuto` è lo stesso componente per chi ha già un account e non ha risposto: solo anno e argomento.
- Oggetti 3D: sei nuovi, resi con Blender dallo script delle materie (`scripts/materie/icons.py`: zaino, casa, lampadina, lavagna, scuola, busta), in `public/onboarding/` come fermo immagine e filmato con trasparenza (2,3 MB in tutto). L'oggetto scelto in "Chi sei?" accompagna le schermate successive; il filmato parte quando l'oggetto compare o viene scelto (`ObjectFilm.tsx`).
- Movimento: lo step esce in 140 ms; il successivo entra a pezzi (oggetto, domanda, risposte una dopo l'altra, 45 ms di scarto), dal lato verso cui si va. Con il movimento ridotto niente si muove e i filmati non si caricano.
- La finestra (`AuthModal.tsx`) serve per accedere e per chi si iscrive nel mezzo di un'azione; "Registrati" senza un'azione in corso porta a `/iscriviti`.
- Provato nel browser il 7 ottobre, su computer e telefono: tutto il percorso dello studente fino alla pagina degli esercizi con i dati salvati, il modulo sotto i 14 anni, le quattro altre porte, il ritorno indietro con le risposte conservate, il movimento ridotto. Non provati: Safari e Firefox, un telefono vero, la suite Playwright.

Quello che segue è la prima fetta, della mattina: il server e i cancelli valgono ancora, la finestra e la pagina `/benvenuto` di allora sono state sostituite.

Dal 7 ottobre 2026 la prima fetta è nel codice, non committata e non pubblicata. La migrazione `supabase/migrations/20261007120000_onboarding.sql` è applicata al database di produzione.

- Database: `profiles` (ruoli, fascia d'età, anno, argomento, email confermata, email e consenso del genitore, "come ci hai conosciuto"), `email_codes`, `parent_consents`. Scrive solo il server; ogni account esistente ha avuto la sua riga, con l'email confermata come diceva Supabase. `referral_run_finished` salta l'attivazione di un invito finché l'email non è confermata, e `referral_activate_if_ready` la recupera alla conferma.
- Iscrizione (`src/components/shell/AuthModal.tsx`, `POST /api/auth/signup`, `src/lib/server/onboarding.ts`): "Chi sei?" con cinque risposte; "Scuola" porta ai contatti senza creare un account. Lo studente sceglie "Meno di 14" o "14 o più", gli altri ruoli dichiarano di avere 18 anni. L'account lo crea il server, già valido per Supabase, e il browser entra subito con la stessa password: l'impostazione "Confirm email" del progetto non è stata toccata. Chi si iscrive da un'azione in corso (un pagamento, una richiesta a un tutor) prosegue con quella; gli altri vanno a `/benvenuto` (studente) o a `/profile-editor` (tutor).
- Sotto i 14 anni: l'account nasce bloccato (ban di Supabase) e parte un'email al genitore con un link a `/genitore/conferma`. La pagina spiega e ha un pulsante; solo il pulsante conferma, toglie il blocco e fa partire la prova da quel momento (`app_metadata.trialFrom`, letto da `trialEnd`). Se l'email al genitore non parte, l'account non resta.
- `/benvenuto` (`src/components/onboarding/Welcome.tsx`, `POST /api/onboarding`): anno, poi le lezioni di matematica di quell'anno che hanno esercizi, per capitolo; la scelta porta alla pagina degli esercizi della lezione. Tutte e due le domande si possono saltare.
- Conferma dell'email (`VerifyEmail.tsx`, `POST /api/auth/email-code`): codice di 6 cifre, 15 minuti, 5 tentativi, un invio al minuto. Sta in "Accesso e sicurezza" dell'account e in una finestra che si apre da sola quando serve e poi riprende l'azione.
- Cancello sull'email confermata, sul server: pagamento (`/api/stripe/checkout`), codice di invito proprio (`/api/inviti`), richiesta a un tutor (`/api/tutoring/requests`), messaggio a un tutor (`/api/tutoring/messages`).
- Provato il 7 ottobre con account `@example.com` poi cancellati: rifiuti dell'iscrizione, iscrizione e ingresso dal browser, anno e argomento fino alla pagina degli esercizi, pagamento e invito rifiutati senza conferma e accettati dopo, codice sbagliato e giusto, link del genitore falso, aperto senza premere, confermato, accesso dello studente prima e dopo. Typecheck, lint e i 725 test unitari passano. Non eseguita la suite Playwright.

Non ancora nel codice: l'accesso con Google, "Come ci hai conosciuto?" nella schermata del risultato (la rotta che salva la risposta c'è), la richiesta di confermare l'email alla fine della prima prova, il link "chiedi a un genitore" per pagare, le pagine di interesse per genitore, docente e scuola, la cancellazione dopo 30 giorni degli account non confermati, anno e argomento modificabili dall'account, il Diario che usa l'argomento, i test Playwright, termini e informativa.

Blocca la pubblicazione: su Vercel manca `MAIL_FROM` e Resend non ha un dominio verificato, quindi il codice e l'email al genitore arriverebbero solo all'indirizzo del proprietario dell'account Resend. Dipende dalla scelta del dominio ([[SEO]]).

Prima del 7 ottobre non c'era un onboarding:

- L'iscrizione è una finestra (`src/components/shell/AuthModal.tsx`) con nome, cognome, email, password e due caselle (termini, età). Il sottotitolo dice "Serve solo per i piani Premium: la teoria resta gratis", che non descrive più Free e Studio.
- Supabase chiede la conferma dell'email: lo studente deve aprire la posta prima di entrare. Il link di conferma riporta alla home `/` (`emailRedirectTo`), senza un passo successivo.
- Dopo l'accesso `completeLogin` (`src/lib/state/auth.ts`) chiude la finestra e lascia lo studente sulla pagina dov'era.
- Dell'account si conoscono nome, email e documenti accettati (`user_metadata`). Non c'è l'anno di corso, non c'è una tabella dei profili e non c'è un ruolo: il tutor è una riga della tabella `tutors`, lo staff è `app_metadata.role = 'admin'`.
- La prova di 7 giorni parte alla creazione dell'account (`planOf` in `src/lib/auth/entitlements.ts`).
- Non c'è l'accesso con Google.

## Obiettivo
Deciso il 7 ottobre 2026 (vedi [[2026-10-07 Onboarding]]).

Il traguardo è uno: lo studente finisce una prova sull'argomento che sta facendo a scuola, nella prima sessione ([[2026-10-07 L'onboarding porta lo studente a finire una prova nella prima sessione]]).

Il percorso dello studente:
1. "Chi sei?" con cinque risposte: studente, genitore, tutor, docente, scuola ([[2026-10-07 L'onboarding comincia da Chi sei, con una porta per ruolo]]).
2. Iscrizione con email e password oppure con Google ([[2026-10-07 L'iscrizione ha anche l'accesso con Google]]). Si entra subito, senza aspettare la conferma dell'email ([[2026-10-07 La conferma dell'email non blocca l'ingresso]]).
3. Due domande, un tocco ciascuna: "Che anno fai?" e "Cosa state facendo in matematica?", scelta sull'albero delle lezioni di quell'anno ([[2026-10-07 L'onboarding chiede anno e argomento in classe]]).
4. La lezione di quell'argomento, con la prima prova in evidenza.
5. Alla fine della prova: il risultato, il percorso dei livelli, la richiesta di confermare l'email con un codice di 6 cifre, e la domanda "Come ci hai conosciuto?", che si può saltare ([[2026-10-07 Come ci hai conosciuto si chiede dopo la prima prova]]).
6. Dal giorno dopo il Diario lo riporta sull'argomento.

Gli altri attori:
- Tutor: va al percorso che esiste già (profilo tutor e [[Agenda tutor]]).
- Genitore, docente, scuola: una pagina che dice cosa c'è oggi per loro e raccoglie l'interesse con una domanda. Per il docente c'è già la scheda giornaliera degli esercizi, senza account ([[2026-09-28 Un test con i singoli docenti già nella beta]]).
- Un account può avere più ruoli ([[2026-10-07 Un account può avere più ruoli]]).

Il genitore e il pagamento: lo studente paga dal suo account come oggi, e in più può mandare a un genitore un link che porta al pagamento di Studio per il suo account, senza che il genitore si iscriva ([[2026-10-07 Chiedi a un genitore è un link per pagare senza account]]).

## Dettagli
- Senza email confermata si può: leggere le lezioni, fare le prove, usare Diario e Zaino, avere i 7 giorni di Studio.
- Serve l'email confermata per: pagare, far contare l'invito per chi ha invitato, creare un proprio codice di invito, scrivere a un tutor.
- Un account mai confermato si cancella dopo 30 giorni. A un indirizzo non confermato arrivano solo l'email con il codice e un promemoria.
- Il ruolo non sta in `user_metadata`, che l'utente può riscrivere dal browser: sta in una tabella dei profili scritta dal server.
- L'evento "prima prova finita" esiste già: è quello che attiva un invito (trigger su `exercise_sessions.finished_at`, vedi [[Inviti e codici]]).
- File che il lavoro toccherà, da non cambiare prima che Alessandro lo chieda: `src/components/shell/AuthModal.tsx`, `src/lib/state/auth.ts`, `src/lib/auth/entitlements.ts`, le impostazioni di accesso del progetto Supabase, la funzione `referral_activate`, una migrazione nuova per profili e ruoli, il Checkout di Stripe (`src/lib/stripe/`), termini e informativa (Google come fornitore, i dati nuovi raccolti).

## Domande aperte
- Cosa trova chi risponde Medie o Università: oggi una schermata che dice che le lezioni sono in arrivo e che intanto ci sono quelle delle superiori e gli strumenti. Da decidere il testo, dove atterra dopo l'account, e se raccogliere l'interesse (anno delle medie, corso di laurea).
- Deciso il 7 ottobre: sotto i 14 anni conferma un genitore con un link ([[2026-10-07 Sotto i 14 anni conferma un genitore con un link, senza account]]). Restano le tre domande per il legale scritte lì.
- Chi ha scelto "genitore" in "Chi sei?" oggi crea un account con quel ruolo e nient'altro: va deciso cosa trova.
- Chiedere anno e argomento è "più di nome ed email": [[GDPR e minori]] dice che prima serve il consenso forte del genitore. Va deciso se l'anno di corso si può chiedere a chi dichiara almeno 14 anni senza quel consenso, e va chiesto a un legale.
- Sotto i 14 anni l'account lo crea il genitore: quale porta di "Chi sei?" prende, e cosa vede?
- Da verificare sulla documentazione di Supabase: con "Confirm email" spento ogni utente risulta confermato, quindi lo stato "verificato" va tenuto in `app_metadata` e l'email con il codice la manda Sapiens.
- Da verificare: quanti account Google delle scuole bloccano l'accesso alle app esterne.
- Cosa raccolgono le pagine di genitore, docente e scuola: solo l'email, o anche una domanda (quanti figli, quale materia, quale scuola)? La lista d'attesa era rimasta in sospeso in [[2026-09-29 Legale e fiscale prima del marketing]].
- La pagina "chiedi a un genitore" mostra dati di un minorenne a chi ha il link: cosa mostra, quanto dura il link, se si può revocare.
- La prova senza account della landing "Prova" resta da decidere con la landing ([[2026-10-07 Tre versioni della landing]]): il 7 ottobre si è scelto l'account prima della prova.
- Lo studente che non trova il suo argomento (anni non ancora scritti, argomento di un'altra materia).
- La grafica dei passi, con Dario.
- La misura: quota di iscritti che finisce una prova nella prima sessione, da aggiungere a [[Metriche]].

## Collegamenti
- Attori: [[Studente]], [[Genitore]], [[Tutor]], [[Docente]], [[Dirigente]]
- Release: [[Release Beta]]
- Note: [[Account e impostazioni]], [[Inviti e codici]], [[Piani e prezzi]], [[Diario e calendario]], [[Esercizi]], [[GDPR e minori]], [[Piano di acquisizione]]
- Decisioni: [[2026-10-07 L'onboarding chiede le materie e un argomento per materia]], [[2026-10-07 L'onboarding è un percorso a pagina intera, con l'account alla fine]], [[2026-10-07 Sotto i 14 anni conferma un genitore con un link, senza account]], [[2026-10-07 L'onboarding è una condizione della beta]] e le otto collegate sopra
