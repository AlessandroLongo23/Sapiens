---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi, lezioni]
---
# Ogni lezione ha una pagina di esercizi svolti, fatta dai suoi generatori

## Decisione
Ogni lezione con esercizi ha una pagina a parte di esercizi svolti: uno o due per ogni tipologia di esercizio che la lezione propone, con tutti i passaggi, presi dagli stessi generatori del percorso e della scheda con un seed fisso. La lezione ha i link alla pagina. Vale per matematica, fisica e chimica.

I passaggi spiegati si scrivono nel generatore, come stringhe con i parametri dell'esercizio, così valgono per qualunque seed. Solo dove non si riesce si scrivono a mano, per gli esercizi con il seed fisso.

## Perché
Il 30 settembre 2026 Alessandro ha mandato la lezione sul benzene al prof Magini, suo ex professore di chimica. Il prof ha risposto che dopo la teoria metterebbe lo svolgimento di alcuni esercizi. Alessandro lo legge così: non gli esempi dentro il testo, che ci sono già, ma esercizi svolti delle stesse tipologie che lo studente trova poi nella scheda e nel percorso, a scelta multipla e a risposta aperta. Chi arriva agli esercizi deve sapere come si fanno perché li ha già visti svolti.

L'infrastruttura c'è già: i generatori producono l'esercizio e i passaggi, che oggi lo studente vede solo dopo un errore nel percorso. Mostrarli prima costa poco.

Alternative scartate:
- Un esempio svolto per livello, proposto da Claude. Alessandro preferisce contare per tipologia di esercizio, uno o due per ognuna.
- Solo gli esempi scritti a mano nel testo della lezione. Restano, ma non seguono le tipologie dei generatori e non coprono tutti i livelli (nella lezione sul benzene sono quattro, tutti sui nomi).
- Gli esercizi svolti dentro la pagina della lezione. Alessandro preferisce una pagina a parte, con i link nella lezione.

## Conseguenze
- Oggi ogni lezione ha un solo generatore (`src/lib/exercises/config.ts`) con 5-7 livelli, quindi "un esercizio per generatore" darebbe un solo esercizio svolto per lezione. La tipologia va definita sui livelli e sui casi dentro un livello: il livello 1 di `equazioni-secondo-grado` mescola equazioni pure e spurie, che il generatore distingue in `params.case`. Da decidere (vedi Domande aperte).
- I passaggi sono già stringhe parametriche: il generatore scrive testo e conti insieme, per esempio "Calcola il discriminante: Δ = b² − 4ac = …". Sono righe brevi pensate per chi ha appena sbagliato. Per un esercizio letto a freddo Claude propone un campo facoltativo con il perché di ogni passaggio, scritto dal generatore con gli stessi parametri; il percorso può continuare a mostrare solo la riga breve.
- La chimica ha 36 generatori, tutti dei primi capitoli (materia, misure, gas, leggi ponderali, acqua). Le lezioni sugli idrocarburi, compreso il benzene, non hanno generatori: lì gli esercizi svolti richiedono prima i generatori, o esercizi scritti a mano.
- Aggiornate [[Esercizi]] e [[Lezioni]].

## Domande aperte
- Cosa conta come tipologia: il livello, il caso dentro il livello, o tutti e due.
- Gratuita o nel piano Studio. La scheda gratuita dà solo i risultati e lascia lo svolgimento passo passo al percorso, per non togliere il motivo di iscriversi (vedi [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]]). Claude propone la pagina gratuita e indicizzata: spiega come si fa una tipologia, che è il lavoro della lezione, e "esercizi svolti" è una ricerca frequente.
- Dove stanno i link nella lezione: in fondo, alla fine di ogni sezione, o accanto a ogni livello nel percorso.
- Seed fisso per sempre, come la scheda di un giorno, o un esercizio nuovo a ogni visita con "Un altro esempio".

## Collegamenti
- [[Esercizi]], [[Lezioni]], [[Pipeline esercizi]], [[SEO]]
- [[2026-09-26 Una scheda di esercizi gratuita e indicizzata per ogni lezione]], [[2026-09-27 La scheda degli esercizi è giornaliera]]
- [[2026-09-25 Gli esercizi sono un percorso di livelli]]
