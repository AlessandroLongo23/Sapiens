---
stato: in sviluppo
release: v2
aggiornato: 2026-10-05
tag: [prodotto, tutor]
---
# Agenda tutor

Strumenti per il tutor dopo il primo contatto: appuntamenti, studenti seguiti, materiale.

## Stato attuale
Scritta il 4 ottobre 2026, mentre Alessandro era via, sull'elenco concordato in chat. Committata e pubblicata il 5 ottobre 2026, su richiesta di Alessandro, con le decisioni qui sotto ancora aperte; la migrazione `supabase/migrations/20261004200000_tutor_agenda.sql` è applicata al database di produzione dal 4 ottobre. Vedi [[2026-10-04 Agenda tutor]].

- **Tabelle:** `tutor_students` (il legame tra un tutor e uno studente, con invito, origine e consenso sui progressi), `tutor_availability`, `tutor_lessons`, `tutor_assignments`, `tutor_messages`, `tutor_reviews`. Sono chiuse al browser: legge e scrive solo il server, che controlla di chi è la riga (`src/lib/server/tutor-agenda.ts`). In `diary_entries` la colonna `source` accetta anche `tutor`.
- **Pagine (rifatte il 5 ottobre 2026):** Alessandro ha giudicato la prima versione funzionante ma con tutto in una pagina. Ora c'è una barra laterale con le sezioni e i numeri di quello che aspetta, e una pagina per ogni cosa. La scheda dello studente ha le linguette (`/studenti/[id]`, `/compiti`, `/lezioni`, `/progressi`, `/appunti`); i messaggi hanno una pagina intera (`/messaggi`, `/messaggi/[id]`) con le conversazioni di lato; gli orari liberi sono una linguetta del profilo (`/profile-editor/orari`). Lato studente `/il-mio-tutor/[id]` ha le linguette In breve, Compiti, Lezioni, Messaggi, Condivisione. Aprire una scheda non segna i messaggi come letti: lo fa solo la pagina della conversazione.
- **Aspetto (uniformato il 5 ottobre 2026, seconda passata):** la prima riscrittura aveva aggiunto elementi suoi (timbri, post-it, schede a righe, foglietti di calendario, scritte a penna e a matita, contatori cerchiati). Alessandro: più originale, ma troppi stili diversi sulla stessa pagina, e la barra laterale non parlava la lingua della navigazione in alto. Quegli elementi sono stati tolti e l'agenda usa solo i componenti che il sito ha già: `Badge` per ogni stato e ogni contatore, `Card` e `CardLink` per riquadri e schede, `Button` per ogni azione (un solo bottone rosso per pagina, i link "vedi tutto" nella variante `link`), `Breadcrumb` al posto del link "indietro", il riquadro tratteggiato per gli stati vuoti, i numeri come `Stat`, i giorni scritti come nel diario. Due pezzi sono diventati comuni: `src/components/ui/SideNav.tsx`, la barra laterale usata anche da `/account`, che segna la sezione corrente con l'evidenziatore come l'header; e `src/components/ui/binder-tabs.ts`, le linguette dei capitoli di una materia (`YearTabs`), ora usate anche per le schede. `agenda.css` non esiste più; in `agenda/Paper.tsx` restano solo composizioni di componenti comuni.
- **Studenti del tutor:** `/studenti` con "Aggiungi uno studente", che crea un invito da mandare (link da copiare o da WhatsApp). Lo studente lo apre a `/invito-tutor/[codice]`, accede se serve, e sceglie lì se condividere i progressi. Chi arriva da una richiesta accettata in `/leads` entra nell'elenco da solo, senza condividere niente.
- **Scheda dello studente** (`/studenti/[id]`): progressi (serie di giorni, giorni di studio, esercizi fatti, risposte giuste, lezioni con i livelli superati) solo se lo studente li condivide; compiti; lezioni; messaggi; appunti privati; interruzione del rapporto.
- **Compiti:** il tutor sceglie una lezione con esercizi, un livello o tutti, una scadenza. Il compito entra nel diario dello studente come voce "dal tutor". Risulta fatto quando il livello è superato: si legge dalle prove dello studente, non si salva. Un compito in ritardo resta in vista.
- **Lezioni:** quelle del tutor sono confermate subito e si possono ripetere ogni settimana fino alla fine del mese; quelle dello studente sono proposte che il tutor accetta o rifiuta. Le confermate entrano nel diario dello studente. Annullando, il tutor può togliere anche le successive della serie.
- **Calendario** (`/calendario`): la settimana, le proposte da confermare, "Fissa una lezione".
- **Riepilogo** (`/dashboard`): studenti seguiti, lezioni della settimana, compiti aperti, ore nel mese, prossime lezioni, l'elenco di quello che aspetta (richieste, proposte, messaggi, inviti), ore di lezione degli ultimi sei mesi. Le ore per studente sono sulle schede dell'elenco.
- **Orari liberi:** si impostano in `/profile-editor/orari` e compaiono sul profilo pubblico.
- **Recensioni:** lo studente seguito lascia un voto da 1 a 5 e un testo da `/il-mio-tutor`; compaiono sul profilo pubblico senza nome.
- **Lato studente** (`/il-mio-tutor`, dal menu dell'account; con un solo tutor porta subito alle sue pagine): compiti con il link agli esercizi, lezioni e richiesta di una nuova, messaggi, consenso sui progressi, recensione, interruzione.
- **Messaggi:** una conversazione per legame, senza tempo reale: la pagina aperta chiede i messaggi nuovi ogni 15 secondi.
- **Email:** invito accettato, proposta di lezione, risposta alla proposta (best effort, come quelle del marketplace).
- **Test:** `tests/e2e/tutor-agenda.spec.ts` (19 flussi) e `tests/unit/tutor-agenda.test.mjs` (12).

## Da decidere
Elenco del 5 ottobre 2026: le decisioni che spettano ad Alessandro. L'agenda è online con le scelte provvisorie indicate.
- **Chat con i minorenni.** Oggi i messaggi sono aperti a ogni studente collegato, minorenni compresi. Nel [[Marketplace]] il contatto di un minore passa dall'account del genitore: vale anche per la chat? È la più urgente, perché la chat è già pubblica. Vedi [[GDPR e minori]].
- **Moderazione delle recensioni.** Si pubblicano subito sul profilo del tutor. La colonna `hidden` esiste in `tutor_reviews`, la pagina per lo staff no.
- **Guadagni.** Le colonne `paid` e `hourly_rate` esistono in `tutor_lessons` ma nessuna pagina le legge o le scrive. Aspettano la risposta su DAC7 (vedi "Dettagli" e [[Consulenze IDA]]).
- **Barra laterale dell'account.** Con `SideNav` la sezione corrente di `/account` è segnata dall'evidenziatore giallo e non più dal fondo rosa: da confermare o riportare indietro, anche con Dario.
- **Progressi condivisi.** Sono spenti finché lo studente non li accende. Va bene come scelta predefinita?
- **Lezioni ricorrenti.** La ripetizione settimanale arriva alla fine del mese, come nel vecchio progetto. Basta, o serve una data di fine a scelta?
- **Voci del tutor nel diario.** Lo studente non può cambiarle né cancellarle, solo spuntarle o nasconderle.
- **Videochiamata.** Integrata ([[Aula virtuale]]) o link esterno, come oggi?

## Non ancora costruito
Elenco del 5 ottobre 2026.
- I guadagni del tutor (vedi sopra).
- "Assegna" dalla pagina di una lezione: oggi si assegna solo dalla scheda dello studente.
- I compiti sulle flashcard: i progressi delle flashcard non sono nel database.
- La videochiamata: c'è solo un campo per il link.
- Il [[Punteggio di attività dei tutor]].
- La pagina dello staff per nascondere una recensione.
- Dal [[Marketplace]], mancanti da prima: i pagamenti, la verifica del telefono con OTP, i termini per i tutor, un job di scadenza programmato.

## Da verificare
Elenco del 5 ottobre 2026.
- Tema scuro e telefono dopo la seconda passata sull'aspetto: guardata una pagina ciascuno.
- Il resto dei test Playwright: lanciate solo le tre spec del tutoraggio, mentre `/account` ha cambiato barra laterale.
- Una prova con dati veri: aspetta che Supabase sblocchi il progetto di AleRipetizioni, fermo in "Coming up".
- Nel database restano 61 utenti di prova `e2e-…@example.com` creati prima del 4 ottobre: da cancellare.
- Il design system: scrivere quali componenti esistono e quando si usa ciascuno, con Dario. Oggi la regola è solo nel codice.

## Obiettivo
Dalla bozza originale: un sistema per gestire gli appuntamenti, tenere traccia dei pagamenti e preparare il materiale. Dalla ricerca del 6 settembre: con il consenso dello studente, vedere i suoi progressi sugli argomenti in cui era bloccato e assegnargli esercizi dalla biblioteca.

Da Alessandro, 4 ottobre 2026 (vedi [[2026-10-04 Pensieri sulla visione, tutor docenti e scuole]]): il lato tutor è il prossimo che vuole sviluppare per bene.
- La dashboard parte dal sistema che Alessandro usava quando dava ripetizioni, in un altro progetto sul suo computer: quanti ragazzi seguiva, quando aveva lezione, gli argomenti, quante lezioni faceva e quanto guadagnava. Si ricicla l'architettura e si adatta alla struttura e al database di Sapiens.
- Dal profilo il tutor cambia materie e tariffe e imposta gli orari della settimana in cui è libero.
- Una vista d'insieme sull'andamento e sul numero di ragazzi, e un calendario delle lezioni sincronizzato con quello degli studenti.
- Il tutor assegna compiti che lo studente fa tra gli esercizi delle lezioni, e ne segue i progressi su esercizi e flashcard.
- Lo studente seguito da un tutor ha una pagina dedicata: le lezioni con il tutor, la richiesta di lezioni nuove, una chat tra i due.

## Dettagli
Attenzione: se Sapiens registra ore e prezzi delle lezioni, rischia di diventare piattaforma soggetta a DAC7 (vedi [[Pay-per-lead]]). Un registro dei pagamenti tenuto solo dal tutor, per sé, va valutato con cura.

## Domande aperte
- Le scelte fatte da Claude il 4 ottobre 2026 senza Alessandro sono in "Da decidere", sopra.
- I guadagni: aspettano la risposta su DAC7 (vedi sopra e [[Consulenze IDA]]).
- Il "tenere traccia dei pagamenti" della bozza originale è compatibile con il modello senza commissioni?
- Videochiamata integrata o link esterno (Meet)? Alessandro il 4 ottobre 2026 propone quella integrata: vedi [[Aula virtuale]].
- Il progetto delle ripetizioni è su GitHub: `AlessandroLongo23/AleRipetizioni` (SvelteKit e Supabase, ultimo commit 30 gennaio 2026), che ha assorbito il più vecchio `TutorTrack`. Letto il 4 ottobre 2026. Tabelle: `students` (anagrafica, livello, `assigned_topics`), `lectures` (studente, materia, data, inizio, fine, tariffa oraria, `paid`, stato `pending` o `accepted`), `subjects` (nome e colore), `reviews` (voto da 1 a 5 e testo). Pagine del tutor: analytics (guadagni, ore, studenti, materie), calendario con lezioni ricorrenti e lezioni non pagate, studenti, scheda dello studente con serie di giorni, accessi, esercizi completati, lezioni recenti e argomenti assegnati. Lo studente propone una lezione dal suo calendario e il tutor accetta o rifiuta da un link nell'email. È pensato per un tutor solo: nessuna tabella ha il tutor come proprietario.
- Il vecchio sistema teneva i guadagni: in Sapiens quella parte resta, e dove (vedi l'attenzione su DAC7 sopra)?
- La chat tra tutor e studente minorenne: per i minori il contatto passa dall'account del genitore ([[Marketplace]]). Vale anche per la chat?
- L'attività del tutor può decidere la sua posizione nelle ricerche: vedi [[Punteggio di attività dei tutor]].
