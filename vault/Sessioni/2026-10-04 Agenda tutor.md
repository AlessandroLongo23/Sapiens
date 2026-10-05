---
aggiornato: 2026-10-05
tag: [sessione, tutor]
---
# Agenda tutor

4 ottobre 2026, seguito di [[2026-10-04 Pensieri sulla visione, tutor docenti e scuole]]. Alessandro ha chiesto l'elenco di quello che serve al lato tutor, poi di implementarlo tutto mentre era via, con un revisore critico per l'interfaccia e i test di tutti i flussi.

## Cosa si è fatto
- Trovati su GitHub i progetti di riferimento, che in locale non ci sono: `AleRipetizioni` (che ha assorbito `TutorTrack`), `CalendarioLezioni`, `FlexiPlan`. Lo schema di AleRipetizioni e il solver dell'orario sono in [[Agenda tutor]] e [[Orario e aule]].
- Scritta l'agenda del tutor: sei tabelle, le pagine del tutor (`/studenti`, la scheda dello studente, `/calendario`, il riepilogo rifatto, gli orari liberi nel profilo), le pagine dello studente (`/il-mio-tutor`, `/invito-tutor/[codice]`), orari e recensioni sul profilo pubblico. Il dettaglio è in "Stato attuale" di [[Agenda tutor]].
- Migrazione `20261004200000_tutor_agenda.sql` applicata al database di produzione: solo tabelle nuove, più il valore `tutor` per `source` in `diary_entries`.
- Due giri di revisione critica dell'interfaccia su screenshot da computer e da telefono, in chiaro e in scuro.

## Cosa ha trovato il revisore, e si è corretto
Al primo giro dieci problemi da correggere, tra cui: i campi degli orari larghi quanto la pagina; sul telefono la scheda scorreva nel vuoto per un elemento nascosto fuori posto; la barra dell'area tutor tagliata sul telefono; i compiti in ritardo che sparivano in un elenco chiuso; "Ritira" che cancellava con un tocco; la stessa etichetta "In attesa di risposta" su tutti e due i lati. Più una ventina di migliorie di testo e di accessibilità.

## Il 5 ottobre: l'interfaccia rifatta
Alessandro ha visto i flussi nei video (22 clip in `screenshots/agenda-tutor/`, cartella ignorata da git) e li ha giudicati sufficienti come esperienza, ma l'interfaccia non curata: tutto in una pagina, poca direzione artistica. Ha chiesto una route per ogni cosa, la chat a tutta pagina o in una barra laterale, una dashboard generale e una per studente.

Rifatto tutto il frontend dell'agenda nel linguaggio del quaderno a quadretti, senza toccare tabelle e API: l'elenco delle pagine e degli elementi è in "Stato attuale" di [[Agenda tutor]]. Un terzo giro del revisore, questa volta di direzione artistica contro diario e Zaino, ha chiesto tra l'altro: post-it chiari anche nel tema scuro, timbri solo per le eccezioni, lo storico delle lezioni come registro, gli orari liberi ridisegnati come un orario, le ore del mese sui quadretti al posto di quattro grafici a barre. Applicato. I video sono stati registrati di nuovo sulle pagine nuove.

## Cosa si è scoperto strada facendo
- La scala degli spazi di Tailwind in questo progetto non è quella predefinita: `h-7` non sono 28 pixel. Dove una misura deve combaciare con un disegno in pixel (le righe delle schede) va scritta in pixel.
- La pagina taglia quello che esce di lato, quindi il documento non scorre mai in orizzontale e un controllo su `scrollWidth` non vede niente: il test ora misura gli elementi uno per uno.
- `AleRipetizioni` è pubblica e contiene la chiave privata di un service account Google (`aleripetizioni-6e15ddddf52c.json`). Alessandro la revoca lui.
- Due test del marketplace erano già rotti prima di questo lavoro: cercavano un bottone dove dal gruppo di selezione in poi c'è un radio. Corretti i selettori.
- Le regole di lint vietano `Date.now()` dentro un componente, anche sul server: l'ora si legge in `agendaClock()` e si passa ai componenti.
- Un inserimento multiplo con righe di forma diversa mette `null` nelle colonne mancanti e salta i valori predefiniti.

## Verifiche
`tests/e2e/tutor-agenda.spec.ts`, 19 flussi, sul server di sviluppo con il database vero e utenti usa e getta; `tests/unit/tutor-agenda.test.mjs`, 12 test; `tsc` e `eslint` puliti sui file toccati. Non è stata fatta la build di produzione, perché il server di sviluppo di Alessandro era acceso nella stessa cartella.

## Domande aperte
Sono in [[Agenda tutor]]: le scelte fatte senza Alessandro (consenso spento in partenza, messaggi con i minorenni, recensioni senza moderazione), i guadagni e DAC7, quello che non è stato fatto.

## Collegamenti
- [[Agenda tutor]], [[Marketplace]], [[Diario e calendario]], [[Schema dati]], [[Pay-per-lead]]

## Il 5 ottobre, seconda passata: un solo vocabolario
Alessandro ha visto l'interfaccia rifatta: meglio, più vicina al resto del sito, ma con troppi elementi di stile diverso sulla stessa pagina. Secondo lui il problema è a monte, nel design system: i componenti ci sono, ma non si usano in modo coerente. L'esempio che ha fatto è la barra laterale dell'area tutor, con uno stile diverso dalla navigazione in alto.

Fatto, tenendo il layout: tolti gli elementi inventati per l'agenda (timbri, post-it, schede a righe, foglietti di calendario, scritte a mano, contatori cerchiati) e sostituiti con i componenti comuni. La barra laterale è ora un componente solo, `SideNav`, usato anche dall'area account, e segna la sezione corrente con l'evidenziatore dell'header. Le linguette sono quelle dei capitoli. Dettagli in [[Agenda tutor]].

Da decidere con Alessandro e Dario: la barra laterale dell'account è cambiata di conseguenza (prima la sezione corrente aveva un fondo rosa, ora l'evidenziatore giallo). Resta aperto il lavoro vero sul design system: scrivere quali componenti esistono e quando si usa ciascuno, perché oggi la regola è solo nel codice.

Verifiche: 33 test dei flussi, 12 test unitari, tsc ed eslint puliti. I 22 video in `screenshots/agenda-tutor/` sono registrati di nuovo.
