---
aggiornato: 2026-09-28
tag: [sessione, marketing]
---
# Marketing e acquisizione clienti

Sessione del 28 settembre 2026. Alessandro ha chiesto come trovare clienti e raggiungere il grande pubblico, dicendo di conoscere poco l'argomento; Claude ha proposto un piano e quattro domande.

## Cosa si è discusso
- I numeri: 100 famiglie paganti entro giugno 2027 vogliono 2.000-3.300 iscritti e 60.000-150.000 visite tra gennaio e giugno (stime da verificare). La sola SEO su un dominio nuovo difficilmente basta.
- Il vincolo del Digital Services Act: niente pubblicità profilata ai minori, quindi gli studenti si raggiungono in modo organico e la pubblicità parla solo ai genitori.
- Sei canali in ordine di resa sul tempo di Alessandro: dominio e SEO, passaparola in classe, video brevi, docenti, creator, pubblicità ai genitori.
- Il rischio del tempo: i contenuti restano il collo di bottiglia, quindi i video escono da una pipeline e li pubblica Lorena.

## Decisioni
- [[2026-09-28 Il marketing parte a ottobre, con Lorena]]
- [[2026-09-28 Video brevi con animazioni per le spiegazioni e un volto per le presentazioni]]
- [[2026-09-28 Un test con i singoli docenti già nella beta]]

Il budget non è deciso: Alessandro ha chiesto un piano per ogni fascia (zero, fino a €500, €500-2.000, oltre €2.000), scritto in [[Piano di acquisizione]].

## Idee
- [[Passaparola in classe]]: invito ai compagni e ripasso condiviso con la classe.

## Domande aperte
In [[Piano di acquisizione]]: la fascia di budget, le serie di video, chi è il volto, il messaggio per i genitori, il premio dell'invito.

## Seconda parte: inviti e codici dei creator
Alessandro ha chiesto di implementare "porta un amico" e il codice affiliato, discutendo prima meccanismo e regole. Claude ha proposto un solo meccanismo con due tipi di codice, salvato all'iscrizione (si iscrive lo studente, paga il genitore anche settimane dopo), e quattro scelte; Alessandro le ha accettate tutte:
- [[2026-09-28 Porta un amico premia l'attivazione con 30 giorni di Studio]]
- [[2026-09-28 Il codice di un creator dà 14 giorni di prova e al creator il 30 per cento per 3 mesi]]

Il conflitto con [[2026-09-25 Studio costa 9,99 euro al mese o 49,99 fino a giugno]] ("nessun prezzo diverso nella beta") è evitato: il codice del creator allunga la prova e non tocca il prezzo.

Scritto e provato nella stessa sessione, non committato né pubblicato: vedi [[Inviti e codici]]. La migrazione è applicata alla produzione e l'endpoint del webhook del sandbox di Stripe riceve anche `invoice.created`. Provando è emerso che GoTrue riscrive `app_metadata` e poteva cancellare i 14 giorni di prova: un trigger ora li conserva.

Da verificare: DPR 430/2001 sui premi, il cookie `sapiens_invito` come cookie necessario, come pagare i creator, la quota sul prezzo con o senza IVA.

## Terza parte: i punti da verificare, con la sede in Danimarca
Alessandro ha chiesto di verificare sul web i punti aperti, tenendo conto che risiede fiscalmente in Danimarca e aprirebbe una enkeltmandsvirksomhed. Quattro ricerche in parallelo, che hanno cambiato tre cose:
- [[2026-09-28 Porta un amico solo per i maggiorenni]]: la guida del Forbrugerombudsmanden danese (2014, §3.12) sconsiglia di usare i minori per reclutare amici.
- [[2026-09-28 I creator si pagano a contenuto, non a provvigione]]: la provvigione su un codice rischia di fare del creator un agente di commercio, con i contributi Enasarco (Tribunale di Roma, 2615/2024). Alessandro ha chiesto una spiegazione semplice prima di scegliere.
- [[2026-09-28 L'invito si salva solo dopo Usa l'invito]]: il cookie di 30 giorni non era con sicurezza un cookie tecnico.

Il DPR 430/2001 quasi certamente non si applica. L'IVA e il pagamento dei creator sono riassunti in [[Società e IVA]], con le domande per il revisor. È emerso che la scritta "IVA inclusa" potrebbe non essere vera sotto le soglie.

Codice aggiornato e riprovato nella stessa sessione; la tabella delle commissioni è cancellata dal database.

## Prossimo argomento
Comprare il dominio (Agenda, punto SEO), che ora blocca anche il marketing; poi, con Lorena, le prime serie di video e la pipeline che le produce.
