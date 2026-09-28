---
stato: bozza
aggiornato: 2026-09-28
tag: [legale, fiscale]
---
# Società e IVA

## Situazione
Sapiens è un'impresa individuale di Alessandro in Danimarca (CVR, IVA danese, Stripe danese) che vende a consumatori italiani, molti minorenni.

## Lista di controllo (dalla [[ROADMAP]], chat del 4 settembre 2026)
- CVR come impresa individuale su virk.dk.
- Registrazione IVA danese: serve dalla prima fattura per comprare servizi esteri (Vercel, Supabase, OpenAI) in reverse charge.
- Per le vendite in Italia: esenzione UE per le piccole imprese (numero EX da Skattestyrelsen, fatturato UE sotto €100.000 e italiano sotto €85.000, senza detrazione dell'IVA sugli acquisti) oppure regime OSS con Stripe Tax all'aliquota italiana del 22%.
- Incasso in euro su un conto in euro, per evitare conversioni.
- Una sessione con un revisore sul regime "virksomhedsordningen" prima del primo incasso.

## Ricerca del 28 settembre 2026
Fatta da Claude sul web per gli inviti e i creator; da confermare con un revisor danese e, per i creator, con un commercialista italiano.

IVA sulle vendite agli studenti italiani:
- Sapiens è con buona probabilità un servizio elettronico: il Reg. di esecuzione 282/2011, allegato I punto 5, cita "l'insegnamento a distanza automatizzato" e gli eserciziari online corretti in automatico. I tutor del marketplace, dove c'è una persona, sono un caso diverso.
- Sotto 10.000 € l'anno di vendite B2C in altri paesi UE (art. 59 quater della direttiva 2006/112) la vendita si considera fatta in Danimarca, con la moms danese; sopra, IVA italiana al 22% con l'OSS. Stripe Tax gestisce entrambi i casi.
- La soglia danese di registrazione moms è 50.000 DKK l'anno, circa 6.700 €, per anno solare dal 2025 (BDO Danimarca, 2024). Ma ogni acquisto di servizi dall'estero (Vercel, Supabase, OpenAI, un creator) obbliga a registrarsi dal primo acquisto per autoliquidare la moms (BDO Danimarca, 8 ottobre 2025).
- Il regime PMI transfrontaliero ("Momsfri små", numero EX su skat.dk, attesa fino a 35 giorni lavorativi) permette di non addebitare IVA in Italia fino a 85.000 € di fatturato italiano e 100.000 € nell'UE, senza detrazione dell'IVA sugli acquisti. L'Italia lo ammette anche per i servizi (d.lgs. 180/2024).
- La scritta "IVA inclusa" deve corrispondere all'imposta davvero addebitata: se Sapiens non addebita IVA, o addebita la moms danese, va cambiata. Vedi [[Piani e prezzi]].

Pagare i creator (vedi [[2026-09-28 I creator si pagano a contenuto, non a provvigione]]):
- Con partita IVA: servizio B2B tassato in Danimarca (art. 44 direttiva, art. 7-ter DPR 633/72). Il creator fattura senza IVA italiana (il forfettario con la marca da bollo sopra 77,47 € e l'iscrizione al VIES), Sapiens autoliquida la moms al 25%, che si compensa se è registrata.
- Senza partita IVA: prestazione occasionale; un committente estero non applica la ritenuta del 20%, il creator dichiara il compenso come reddito diverso (art. 67 lett. l TUIR). Collaborazioni ripetute possono diventare abituali e richiedere la partita IVA (ATECO 73.11.03, influencer, dal 2025).
- In Danimarca è una spesa deducibile con fattura o ricevuta e bonifico; nessuna ritenuta danese. DAC7 non riguarda Sapiens, che non intermedia vendite di terzi.

Domande per il revisor danese:
1. La registrazione moms obbligatoria per gli acquisti dall'estero rende tassabili anche le vendite, anche sotto 50.000 DKK?
2. Sotto 10.000 € di vendite nell'UE, moms danese o niente IVA? Da quando conviene l'OSS o il numero EX?
3. L'esenzione danese per l'insegnamento (momsloven §13, stk. 1, nr. 3) può valere per una piattaforma automatica?
4. Serve una segnalazione a eIndkomst per i compensi a creator italiani senza partita IVA?
5. La virksomhedsordningen conviene con ricavi così bassi?

## Marketplace
Dettagli su IVA del contatto (B2C con IVA italiana, B2B in reverse charge con verifica VIES), DAC7 e fiscalità dei tutor in [[MARKETPLACE]].

## Deciso
Sapiens resta un'impresa individuale danese almeno fino alla [[Release v1.0]]. Una società si apre quando i ricavi lo giustificano. Vedi [[2026-09-23 Impresa individuale finché i ricavi non giustificano una società]].

## Domande aperte
- L'impresa individuale ha responsabilità illimitata: un errore con i dati di minori o una lite con un cliente tocca il patrimonio personale di Alessandro. Un'assicurazione di responsabilità civile professionale e cyber costa poco e riduce il rischio mentre la società non c'è: da valutare prima della [[Release Beta]].
- Con quale soggetto si vende alle scuole italiane? Vedi [[Contratti con le scuole]].
- Se Andrea, Dario e Lorena diventano soci serve comunque una società. Vedi [[Accordi del team]].
