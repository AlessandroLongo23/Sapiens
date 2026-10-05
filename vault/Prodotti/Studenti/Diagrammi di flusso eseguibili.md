---
stato: in sviluppo
release:
aggiornato: 2026-10-05
tag: [prodotto]
---
# Diagrammi di flusso eseguibili

Nelle lezioni di programmazione il diagramma di flusso si esegue un blocco alla volta, con la tabella delle variabili accanto.

## Stato attuale
Costruito il 5 ottobre 2026 su proposta di Alessandro, sul `master` locale: non è in produzione.

- Un blocco `diagramma` in una lezione contiene un programma di poche righe (`leggi`, `scrivi`, assegnamento, `se` con `altrimenti`, `finché`). La pagina lo disegna con le quattro forme dei libri e lo esegue. La sintassi è in `docs/lezioni/README.md`, sezione "Il diagramma di flusso da eseguire".
- Comandi: "Esegui" (va avanti da solo e si ferma a ogni "leggi"), "Passo", "Indietro", "Ricomincia".
- Il blocco in corso è acceso e la freccia appena percorsa è colorata. Accanto: una frase che dice cosa ha fatto il passo, la tabella delle variabili con segnate quelle lette o cambiate dal blocco, e l'uscita. Su un rombo la frase riscrive la condizione con i valori al posto dei nomi ("6 ≤ 5: è falsa").
- Un errore (variabile senza valore, divisione per zero, testo sommato a un numero) ferma l'esecuzione sul blocco e lo dice a parole. Un ciclo che non finisce viene fermato dopo 2000 passi.
- Il disegno è calcolato dal programma, nessuno posiziona i blocchi. La pagina pubblicata lo contiene già come SVG, per la stampa e per chi non ha JavaScript.
- L'esecuzione è un interprete scritto da noi (`src/lib/diagramma/`), senza `eval`: il contenuto di un blocco non arriva mai al JavaScript della pagina.
- Le cinque lezioni di programmazione hanno i loro dodici diagrammi in questa forma nei file di `docs/lezioni/informatica/riscritte/`. In produzione ci sono ancora le figure in TikZ: le lezioni si ripubblicano dopo il deploy del codice, altrimenti il sito mostrerebbe il blocco come testo.
- Prove: `tests/unit/diagramma.test.mjs` (12), `tests/e2e/diagramma.spec.ts` (6, solo Chromium in sviluppo). Lo script di controllo delle lezioni esegue ogni diagramma con i valori di `% ingresso:`.

Codice: `src/lib/diagramma/` (`espressione.ts`, `blocco.ts`, `disegno.ts`, `esecuzione.ts`), `src/components/diagramma/LessonChart.tsx`, `src/lib/utils/chart-figure.ts`.

## Obiettivo
Il seguito è in [[Diagramma e codice in corrispondenza]]: il diagramma modificabile dallo studente e il codice accanto che lo rispecchia. Non è deciso.

## Dettagli
- Non ci sono salti: ogni diagramma che si può scrivere ha un programma in Python e in C++ che fa lo stesso.
- `/` è la divisione della calcolatrice (7 / 2 fa 3,5); `//` e `%` sono quoziente e resto tra interi.
- Le parole che uniscono due condizioni sono `E`, `O`, `NON` in maiuscolo, perché `e` e `o` servono come nomi di variabili (l'età nella lezione 47).

## Domande aperte
- Le figure in TikZ comparivano in Google Immagini; un SVG nel testo no. Da decidere se conta.
- Non provato su Safari, Firefox e su un telefono vero.
- Una tabella con tutti i passi fatti (la tabella di traccia delle lezioni, compilata da sola) non c'è.
- Le domande per Andrea su parole e divisione sono in [[Domande per Andrea]], sezione del 5 ottobre.

## Collegamenti
- Attori: [[Studente]]
- [[Lezioni]], [[Editor di codice]], [[Pipeline lezioni]]
- [[2026-10-05 Prime lezioni di programmazione]]
