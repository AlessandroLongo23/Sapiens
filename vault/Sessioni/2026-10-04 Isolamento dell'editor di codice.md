---
aggiornato: 2026-10-04
tag: [sessione, informatica, sicurezza]
---
# Isolamento dell'editor di codice

Sessione della notte tra il 3 e il 4 ottobre 2026, seguito di [[2026-10-03 Editor di codice]]. Alessandro ha chiesto in un'altra chat se eseguire codice nel browser fosse rischioso, poi ha chiesto qui di provare l'attacco, fare la patch e provare di nuovo.

## Cosa si è fatto
- **La prova prima della patch.** Un utente di prova con l'accesso fatto esegue nell'editor un programma Python che usa `XMLHttpRequest` dal modulo `js`. Il programma legge `/api/me` (risposta 200 con id ed email) e crea un quaderno (risposta 201). L'origine del worker era quella del sito.
- **La patch.** I programmi girano in un iframe isolato: vedi [[2026-10-04 I programmi dell'editor girano in un iframe senza l'origine del sito]] e la sezione "Dove gira un programma" di [[Editor di codice]].
- **La prova dopo la patch.** Lo stesso programma stampa `origine: null`, le due richieste sono bloccate, nessun quaderno nel database.
- **Un secondo strato.** Togliendo apposta la policy dell'iframe, su WebKit la POST partiva con il cookie e il quaderno veniva creato. Ora `src/proxy.ts` rifiuta le scritture con `Origin` diversa dal sito; rifatta la prova su WebKit, nessun quaderno.

## Cosa si è scoperto strada facendo
- Chrome non avvia un worker di tipo modulo da un blob in una pagina senza origine; un worker classico con un `import()` dentro sì.
- Le intestazioni di `next.config.ts` sostituiscono quelle con lo stesso nome messe da una rotta: la rotta dell'iframe va esclusa dalla regola generale.
- In sviluppo `request.nextUrl.origin` non segue l'intestazione `Host`: la rotta legge l'host dalla richiesta.

## Verifiche
Scritte nella sezione "Controlli" di [[Editor di codice]] e nel messaggio della PR.

## Domande aperte
- Su Chromium la prova con la policy tolta non è riuscita (Python non si caricava): non si sa se lì il cookie parte. Il controllo sul server copre comunque il caso.
- La memoria di un programma non ha limite.

## Collegamenti
- [[Editor di codice]], [[2026-10-03 Editor di codice]]
