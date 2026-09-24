---
stato: bozza
aggiornato: 2026-09-23
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

## Marketplace
Dettagli su IVA del contatto (B2C con IVA italiana, B2B in reverse charge con verifica VIES), DAC7 e fiscalità dei tutor in [[MARKETPLACE]].

## Deciso
Sapiens resta un'impresa individuale danese almeno fino alla [[Release v1.0]]. Una società si apre quando i ricavi lo giustificano. Vedi [[2026-09-23 Impresa individuale finché i ricavi non giustificano una società]].

## Domande aperte
- L'impresa individuale ha responsabilità illimitata: un errore con i dati di minori o una lite con un cliente tocca il patrimonio personale di Alessandro. Un'assicurazione di responsabilità civile professionale e cyber costa poco e riduce il rischio mentre la società non c'è: da valutare prima della [[Release Beta]].
- Con quale soggetto si vende alle scuole italiane? Vedi [[Contratti con le scuole]].
- Se Andrea, Dario e Lorena diventano soci serve comunque una società. Vedi [[Accordi del team]].
