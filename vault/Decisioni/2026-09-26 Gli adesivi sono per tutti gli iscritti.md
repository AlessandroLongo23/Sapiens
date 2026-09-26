---
stato: decisa
aggiornato: 2026-09-26
tag: [decisione, studenti, gamificazione, business]
---
# Gli adesivi sono per tutti gli iscritti

## Decisione
Attaccare adesivi sulle copertine e sulle note è per tutti gli studenti con un account, Free e Studio. Chi non ha un account vede gli adesivi predefiniti delle copertine; il bottone "Adesivi" gli apre la registrazione e, dopo l'accesso, l'album. Senza account non si salva niente, nemmeno nel browser.

## Perché
Scelta di Alessandro, 26 settembre 2026, sulla proposta di Claude.

Il costo non decide: nel database resta solo lo stato finale di ogni copertina (attaccare e staccare riscrivono la stessa riga), e un adesivo occupa circa 170 byte, misurato su Postgres il 26 settembre 2026. Una copertina con 5 adesivi pesa circa 1 KB, una con il massimo di 60 circa 10 KB. Con 10.000 studenti che personalizzano 5-10 copertine ciascuno fanno 50-100 MB; il caso limite, ogni studente con tutte le circa 114 pagine piene, fa circa 11 GB. Il piano Pro di Supabase include 8 GB di disco e poi costa $0,125 al GB (pagina dei prezzi di Supabase, 26 settembre 2026). Le scritture, anche a 20 salvataggi al giorno per studente, sono 2-3 al secondo in media. Il database intero pesava 20 MB il 26 settembre 2026, con 66 utenti.

Decide il prodotto: gli adesivi devono sostenere l'abitudine, e la sessione gratuita giornaliera è proprio quell'abitudine; e [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]] dice che nessun adesivo si compra, mentre chiuderli dietro Studio sarebbe un modo di venderli. Il bottone per chi non ha un account è un motivo in più per registrarsi.

Alternative scartate:
- Solo gli abbonati Studio: contraddice "nessun adesivo si compra" e toglie lo strumento proprio a chi usa la sessione gratuita.
- Free con un pacchetto ridotto: stessa obiezione, in piccolo.
- Adesivi anche senza account, salvati nel browser: si perdono cambiando dispositivo, e sono un secondo sistema da mantenere.

## Conseguenze
- Il salvataggio accetta solo le pagine che esistono nel materiale (biblioteca, livelli, materie, capitoli): al massimo una riga per pagina vera per studente, così nessuno può riempire la tabella con pagine inventate. Nel codice dal 26 settembre 2026 (`src/app/api/adesivi/route.ts`).
- Il bottone "Adesivi" c'è anche per chi non ha un account (`src/components/content/CoverStickers.tsx`).
- Resta aperto se, dopo la beta, gli utenti Free guadagnano adesivi come gli abbonati: vedi [[Adesivi]].

## Collegamenti
- [[Adesivi]], [[Piani e prezzi]], [[Pratica quotidiana]]
