---
aggiornato: 2026-10-05
tag: [sessione, contenuti, informatica]
---
# Secondo anno di informatica

Sessione del 5 ottobre 2026, seguito di [[2026-10-05 Prime lezioni di programmazione]]. Alessandro ha chiesto di completare il biennio di informatica. Il primo anno era completo dal 3 ottobre ([[2026-10-03 Primo lotto di informatica]]); del secondo erano scritte cinque lezioni di programmazione. Questo lotto scrive le altre 27.

## Cosa si è fatto
- Brief del lotto: `docs/lezioni/informatica/brief-secondo-anno.md`. Fissa tre scelte rimaste aperte, da confermare: nelle lezioni con la programmazione la lunghezza si conta sul testo (40-80 righe, 350 in tutto); una lettera per contatori e numeri senza significato, un nome intero quando il valore è qualcosa; Python e C++ insieme.
- Sette gruppi in parallelo, uno per capitolo o mezzo capitolo:
  - Internet e il web: 33-36 e 37-39
  - Sicurezza e cittadinanza digitale: 40-44
  - Algoritmi e diagrammi di flusso: 45, 46, 48, 49, 50
  - Linguaggi e primi programmi: 51, 52, 54, 55
  - La selezione: 56, 58, 59
  - L'iterazione: 62, 63, 64
- Ogni lezione ha testo, nota, formulario e flashcard. Formulario e flashcard sono stati scritti anche per le cinque lezioni già pubblicate (47, 53, 57, 60, 61).
- I diagrammi di flusso delle lezioni nuove sono tutti blocchi `diagramma` ([[Diagrammi di flusso eseguibili]]): 58 nel secondo anno, di cui 16 da riordinare, correggere, completare o costruire. Il capitolo sugli algoritmi, che viene prima dei linguaggi, lavora quasi solo con quelli.

## Numeri
- Secondo anno: 32 lezioni, circa 7500 righe. 29 esercizi con le prove, in Python e in C++. 24 figure TikZ nei capitoli senza programmazione e nelle lezioni 50 e 51.
- Il biennio di informatica ha 64 lezioni, tutte con formulario e flashcard.

## Verifiche
- `check.mts` su lezioni, formulari e flashcard del secondo anno: nessun errore. Tre avvisi nella 63 sono righe di asterischi dentro blocchi di codice.
- `verifica.mts`: 29 esercizi, 0 errori nei due linguaggi.
- Ogni pagina del secondo anno aperta in Chromium nell'anteprima, a 1280 e a 390 px: figure tutte presenti, nessun errore nelle formule, nessuno scorrimento laterale, ogni editor montato, ogni diagramma da eseguire arrivato a "Fine".
- I gruppi di algoritmi hanno risolto nel browser i loro 13 esercizi sui diagrammi con i gesti dello studente. Non risolti a mano: la costruzione nella 54 e nella 62, la correzione del rombo nella 55, il completamento nella 59.
- Le figure TikZ sono state guardate dai gruppi in chiaro e in scuro.

## Corretto nel sito
- In C++ il resto di una divisione per zero dava un messaggio in inglese: ora dice "divisione intera per zero", come la divisione (`src/components/codice/wasi.ts`).

## Da sapere
- **Norme.** Le lezioni 43 (privacy) e 44 (diritto d'autore) citano il GDPR, l'età del consenso digitale e la legge sul diritto d'autore, in termini generali e senza numeri di articolo. Controllati sul testo il 5 ottobre: GDPR art. 8 e art. 12, le licenze Creative Commons. Il resto è scritto a memoria ed è elencato nelle note delle due lezioni come "da verificare": vanno rilette con le fonti.
- **Fatti storici** (ARPANET, il web al CERN, Böhm e Jacopini 1966): a memoria, nelle note con la fonte da controllare.
- **Lo pseudocodice** della 48 ha la forma dei blocchi del diagramma (`leggi`, `scrivi`, `←`, `se`, `altrimenti`, `finché` con il rientro), senza "allora" e senza righe di chiusura.
- **`0 <= x <= 10` in C++** non compila con il compilatore del sito ("chained comparison"); la lezione 58 lo dice. Che altri compilatori lo accettino non è stato provato.
- **La selezione a più vie** nella 59 non ha un diagramma: tre rombi in cascata sono larghi 862 px e non stanno nel riquadro.
- **Niente generatori di esercizi** per il secondo anno: il primo li ha, il secondo no.
- Non provato su Safari, Firefox e su un telefono vero.

## Domande per Andrea
Ogni nota di lezione ha le sue. Le principali sono riportate in [[Domande per Andrea]], sezione "Informatica, secondo anno".

## Collegamenti
- [[Pipeline lezioni]], [[Programma ministeriale]], [[Diagrammi di flusso eseguibili]], [[Editor di codice]]
- [[2026-10-03 L'informatica si pubblica gratis lotto per lotto, come fisica e chimica]]
