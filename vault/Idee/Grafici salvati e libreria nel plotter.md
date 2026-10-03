---
stato: decisa
aggiornato: 2026-10-03
tag: [idea, strumenti, zaino, matematica]
---
# Grafici salvati e libreria nel plotter

Decisa il 3 ottobre 2026: [[2026-10-03 I grafici del plotter si salvano con nome e si mettono nelle note]].

## L'idea
Alessandro, 3 ottobre 2026: dato che ci sono gli account, il plotter dovrebbe salvare quello che c'è sul piano, come GeoGebra: "salva con nome", una libreria dei grafici salvati da cui ricaricarli, magari in gruppi. Con una libreria il grafico si può inserire in una nota dello [[Zaino]], come un blocco con il disegno sopra. Il comando "Svuota il piano" chiede conferma e offre di salvare prima.

## Cosa c'è già
- Un grafico è un dato (`PlotState` in `src/lib/grafico/documento.ts`): righe, costruzioni, cursori, impostazioni e finestra. Si scrive già in un link (`encodeState`) e si rilegge (`decodeState`). Salvare è scrivere lo stesso dato in una tabella.
- "Svuota il piano", dal 3 ottobre 2026: chiede conferma e offre "Copia il link e svuota", perché il link è l'unico modo di tenere un grafico oggi. Si annulla.
- Lo Zaino ha quaderni e note con l'editor TipTap, e le lezioni hanno già il blocco `grafico` (`src/lib/grafico/blocco.ts`, `LessonPlot.tsx`).

## Parere di Claude, da discutere
Tre pezzi, in quest'ordine:
1. Salvataggio e libreria: una tabella `plots` (proprietario, nome, il dato del grafico, una miniatura in SVG, date), con RLS come `notes`. Nel plotter: "Salva", "Salva con nome", "I miei grafici". Senza account resta il link.
2. La conferma di "Svuota" con "Salva e svuota" al posto di "Copia il link e svuota", per chi ha un account.
3. Il grafico dentro una nota: un blocco di TipTap che mostra il piano di un grafico salvato, con "Apri nel plotter".

## Dubbi e conflitti
- Dove sta la libreria: una sezione dello Zaino (è il posto delle cose dello studente) o solo dentro il plotter. Se sta nello Zaino, i "gruppi" possono essere i quaderni, senza un secondo sistema di cartelle.
- Il limite del piano gratuito: lo Zaino dà 1 quaderno e 5 note. Quanti grafici salvati?
- Nella nota il grafico è una copia, che non cambia più, o un collegamento, che segue le modifiche fatte nel plotter?
- Salvataggio automatico di un grafico già salvato, o solo a comando?
- Il cestino dello Zaino (30 giorni) vale anche per i grafici?
- Non è nella beta di gennaio 2027, come il plotter: quando farlo rispetto al resto.

## Collegamenti
- [[Grafico di funzioni]], [[Zaino]], [[Geometria analitica nel plotter]]
