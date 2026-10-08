---
aggiornato: 2026-10-07
tag: [sessione, prodotto, onboarding]
---
# Onboarding

Sessione del 7 ottobre 2026. Alessandro ha chiesto di cominciare a pianificare il percorso di un nuovo utente che si iscrive.

## Da dove si partiva
Non c'è un onboarding: una finestra di iscrizione, la conferma dell'email come muro, il ritorno sulla home senza un passo successivo, nessun dato sull'anno di corso, nessun ruolo. Dettagli in [[Onboarding]], "Stato attuale". Nel vault l'argomento era una riga dell'Agenda, "Onboarding su classe e indirizzo", sotto "Prima della v1.0".

## Decisioni prese
- [[2026-10-07 L'onboarding porta lo studente a finire una prova nella prima sessione]]
- [[2026-10-07 La conferma dell'email non blocca l'ingresso]]
- [[2026-10-07 L'onboarding chiede anno e argomento in classe]]
- [[2026-10-07 L'onboarding comincia da Chi sei, con una porta per ruolo]]
- [[2026-10-07 Un account può avere più ruoli]]
- [[2026-10-07 Chiedi a un genitore è un link per pagare senza account]]
- [[2026-10-07 L'iscrizione ha anche l'accesso con Google]]
- [[2026-10-07 Come ci hai conosciuto si chiede dopo la prima prova]]
- [[2026-10-07 L'onboarding è una condizione della beta]]
- [[2026-10-07 Sotto i 14 anni conferma un genitore con un link, senza account]]

## Come si è arrivati
- Sulla conferma dell'email Alessandro ha chiesto cosa succede a chi non conferma mai e se la conferma fa da cancello ad altre funzioni. Risposta: sì, a quelle che dipendono dall'identità (pagare, inviti, tutor), mai allo studio.
- Alessandro voleva l'onboarding per tutti e cinque gli attori subito. Si è scelto di predisporre modello dei ruoli e porta d'ingresso per tutti, con il percorso intero solo per lo studente, perché dietro tre porte non c'è ancora un prodotto.
- Sul genitore Alessandro ha fatto notare che togliere il pagamento dall'account dello studente sarebbe macchinoso quando i due sono davanti allo stesso computer. Il pagamento dall'account resta; il link si aggiunge.

## Implementazione, stesso giorno
Alessandro ha chiesto di cominciare a implementare. È scritta e provata la prima fetta: vedi "Stato attuale" in [[Onboarding]], con l'elenco di quello che manca. Scelte fatte scrivendo, da confermare: l'account lo crea il server già valido per Supabase, così l'impostazione "Confirm email" del progetto resta com'è; l'account sotto i 14 anni nasce bloccato e la prova parte alla conferma del genitore; i ruoli diversi dallo studente dichiarano 18 anni; "Scuola" porta ai contatti senza account; chi si iscrive per fare qualcosa (pagare, scrivere a un tutor) prosegue con quello e non passa da `/benvenuto`; il limite è 60 iscrizioni l'ora per connessione, perché una classe condivide l'indirizzo della scuola; la cancellazione automatica dopo 30 giorni non è stata attivata, perché cancella account veri e va decisa a parte.

## Percorso a pagina intera, nel pomeriggio
Alessandro ha visto la finestra "Chi sei?" e ha chiesto un percorso a step con animazioni, oggetti 3D e componenti curati, dopo una ricerca sugli onboarding migliori da provare con Playwright. Provati Brilliant, Duolingo, Khan Academy e Mimo; i risultati e la scelta sono in [[2026-10-07 L'onboarding è un percorso a pagina intera, con l'account alla fine]]. Scritto `/iscriviti` con sei oggetti 3D nuovi; dettagli in [[Onboarding]].

Da decidere dopo averlo visto: se le carte avanzano al tocco (come ora, e come Khan Academy) o con un "Continua" (come Brilliant e Duolingo); se serve una schermata di saluto prima di "Chi sei?"; se gli oggetti vanno bene a Dario.

## Seconda versione, la sera
Alessandro: "l'idea è nella giusta direzione, ma non sembra ancora di altissima qualità". Rifatto intorno a due pezzi: oggetti 3D dal vivo che reagiscono al puntatore e volano tra le schermate, e il quaderno con l'etichetta che si compila, si apre sulla prima pagina e riceve adesivo e timbro. Dettagli in [[Onboarding]], primo paragrafo di "Stato attuale". Da far vedere a Dario: la copertina del quaderno, l'etichetta, i sei oggetti.

## Materie, la notte
Alessandro ha segnalato tre difetti (layout che si sposta, interno della copertina uguale all'esterno, apertura rigida), corretti, e ha chiesto perché si chiedesse solo la matematica. Deciso il flusso con le materie: [[2026-10-07 L'onboarding chiede le materie e un argomento per materia]]. Riscritto il percorso intorno a una pila di quaderni, uno per materia.

## Colore della materia e quaderno aperto, a tarda sera
Alessandro ha chiesto il colore della materia sulle carte, sulla schermata dell'argomento e su quella del quaderno aperto, con la barra in alto e "Continua" sempre rossi; una barra con un segmento per passo; e ha detto che la pagina del quaderno aperto non diceva niente di suo: stesse scritte per ogni materia e argomento, nessun disegno, e l'interno beige della copertina senza contrasto con lo sfondo. Fatto: dettagli in [[Onboarding]], primo paragrafo di "Stato attuale". Scelte fatte scrivendo, da confermare: il disegno è la prima figura della lezione; l'interno della copertina è del colore della copertina; "Teoria, formulario e passaggi svolti" non sta più nel quaderno su computer, per lasciare posto ai nomi dei livelli (resta sul telefono).

## La scuola, la notte
Alessandro ha fatto notare che mancava la domanda sul livello di studio e ha chiesto tre carte verticali con gli oggetti 3D della pagina dei livelli, senza il passo dell'età per chi risponde università. Fatto: dettagli in [[Onboarding]], primo paragrafo di "Stato attuale". Scelte fatte scrivendo, da confermare: medie e università saltano anno, materie e argomenti, perché non hanno ancora lezioni con esercizi; lo studente universitario è registrato nella fascia "14 o più"; i testi della schermata finale per i due livelli.

## Informazioni nuove
- Su Vercel c'è `RESEND_API_KEY` ma non `MAIL_FROM`: con il mittente di prova di Resend le email arrivano solo al proprietario dell'account. Serve un dominio verificato prima di pubblicare.
- I termini dicono già che sotto i 14 anni il titolare dell'account e dell'abbonamento è il genitore (`src/app/(site)/terms/page.tsx`).
- Non esiste una tabella dei profili: nome e documenti accettati sono in `user_metadata`.
- La prova senza account della landing "Prova" non è stata scelta qui: l'account viene prima della prova. La domanda resta aperta per la landing.

## Domande rimaste aperte
Sono in [[Onboarding]], "Domande aperte". Le più urgenti: se l'anno di corso si può chiedere senza il consenso forte del genitore ([[GDPR e minori]]), il percorso sotto i 14 anni, cosa raccolgono le pagine di interesse, cosa mostra la pagina "chiedi a un genitore".

## Prossimo argomento proposto
Il secondo giro sull'onboarding: sotto i 14 anni e consenso del genitore, che decidono se le due domande si possono fare; poi i testi e i passi schermata per schermata, da dare a Dario.
