---
stato: in sviluppo
release: beta
aggiornato: 2026-09-24
tag: [prodotto, studenti]
---
# Zaino

Quaderni e note personali dello studente, con formule, collegati alle lezioni.

## Stato attuale
- Pagine `src/app/(site)/zaino` (quaderni), `zaino/[quaderno]` (note), `zaino/nota/[id]` (editor TipTap con formule).
- API in `src/app/api/zaino/*`: creazione, modifica, riordino con trascinamento, ricerca testuale (`cerca`), nota legata a una lezione (`lezione`).
- Tabelle `notebooks` e `notes` con RLS; ricerca con `tsvector`; `lesson_path` e `lesson_title` per il collegamento alla lezione.
- Piano Free: 1 quaderno e 5 note (`src/lib/zaino/config.ts`). Piani a pagamento: illimitati.
- Il 23 settembre 2026 c'è lavoro non ancora committato su ricerca, riordino, spostamento delle note e note dalla lezione.
- Dal 24 settembre 2026 nella modalità Semplice la nota è un foglio largo 792 px, ridimensionato con `zoom` per stare nello schermo; sotto il 95% compare "Ingrandisci", che lo mostra a grandezza piena con scorrimento orizzontale (`src/components/zaino/SimpleEditor.tsx`). Sul foglio si attaccano gli [[Adesivi]].
- Dal 24 settembre 2026 sera l'editor della nota è stato rifatto prendendo come riferimento Notability, GoodNotes, Notion e Obsidian:
  - L'intestazione del sito non compare nell'editor. Resta una sola barra alta 56 px con indietro, pagine, "Quaderno / Titolo", stato del salvataggio, Semplice o Avanzata, Carta e un menu ⋯ (sposta, stampa o PDF, posizione della barra, scorciatoie, parole e pagine). Sul telefono modalità e Carta stanno nel menu.
  - La barra di formattazione galleggia sul foglio e si aggancia in basso al centro o al centro del lato sinistro o destro, in verticale. Si trascina dalla maniglia oppure si sposta con le frecce, si riduce a una pillola, e quando non c'è spazio le azioni secondarie vanno in "Altro". La posizione resta in questo browser (`src/lib/state/note-view.ts`). Sul telefono resta fissa in basso, sopra la tastiera.
  - Le note hanno pagine. Nel markdown una riga `<!-- pagina -->` separa le pagine (`src/lib/zaino/pages.ts`). Ogni pagina è un foglio con il suo editor e i suoi adesivi, e ogni adesivo ha il campo `page`. Il pannello delle pagine mostra le miniature, porta alla pagina e permette di aggiungere una pagina dopo, duplicare, spostare in su o in giù (sul computer anche trascinando) ed eliminare. Un'eliminazione si annulla per 7 secondi e rimette solo quella pagina. Ctrl+Invio aggiunge una pagina e le frecce passano da una pagina all'altra. Le operazioni sulle pagine non rimontano gli editor delle altre pagine, che tengono la loro cronologia.
  - La carta è un'impostazione di ogni nota, salvata nella colonna `notes.paper` senza cambiare la versione: quadretti, righe con margine rosso, puntini o bianca; otto colori (uno segue il tema, uno è scuro); righe da 20, 24 o 28 px; testo da 14, 16 o 18 px (`src/lib/zaino/paper.ts`). Il testo resta sulle righe con ogni combinazione.
  - Ci sono anche lo zoom (pagina in vista, −, percentuale, +, Ctrl +/−/0), la stampa o il PDF di una copia fatta apposta (`NotePrint`), l'elenco delle scorciatoie (tasto ?), una finestra per i collegamenti al posto di `window.prompt` e le azioni "Testo normale", "Barrato" e "Formula su una riga a parte".
  - Nella modalità Avanzata la barra è nello stesso ordine, con Annulla e Ripristina, e c'è l'interruzione di pagina; l'anteprima è divisa per pagine.
  - Su richiesta di Alessandro, lo stesso giorno: l'indice dei titoli a sinistra (Titolo, Sottotitolo e Titoletto annidati, raggruppati per pagina, con il titolo che si sta leggendo segnato in rosso) e le pagine a destra; sotto i 1.024 px si apre una colonna alla volta. Le due colonne si aprono e si chiudono scorrendo di lato in 300 ms, e il foglio si sposta con loro (`SidePanel.tsx`); con il movimento ridotto compaiono subito. Un titolo scelto nell'indice porta lì in ogni modalità e, scrivendo, vi mette il cursore. L'indice si legge con markdown-it, lo stesso parser dell'anteprima (`src/lib/zaino/outline.ts`).
  - Terza modalità, Lettura, accanto a Semplice e Avanzata: le pagine come verranno stampate, senza barra, cursore, carta né operazioni sulle pagine, con "Torna a scrivere" e Ctrl+E (o ⌘+E) per andare e tornare. Non viene ricordata come modalità di apertura. Cambiando modalità si resta sullo stesso titolo.
- Il 24 settembre 2026 è stato corretto un salvataggio non voluto: aprire una nota con formule la riscriveva, perché la conversione delle formule contava come modifica. Ora una nota soltanto aperta non viene mai salvata, e lo stesso vale per una pagina rimessa con l'annulla.

## Obiettivo
Il quaderno digitale dello studente, integrato con [[Diario e calendario]] e con le [[Lezioni]]: dalla lezione si prende una nota, dalla nota si torna alla lezione.

Nella modalità Semplice la nota è un foglio a larghezza fissa, uguale su ogni schermo, su cui si attaccano gli [[Adesivi]]. Vedi [[2026-09-24 Le note sono fogli a larghezza fissa]].

## Domande aperte
- Sul telefono il foglio intero si legge ma si scrive piccolo: il revisore ha proposto di passare al 100% quando si tocca il testo. Per ora c'è il comando "Scrivi più grande", in linea con [[2026-09-24 Le note sono fogli a larghezza fissa]]. Da decidere.
- Carta predefinita per le nuove note ("Usa per le nuove note", come in Notability e OneNote): non fatta.
- Gli [[Adesivi]] guadagnati si attaccano sulle copertine dei quaderni (vedi [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]]): dove si mettono e se coprono il colore.
- Condivisione di quaderni tra compagni o con il tutor?
- Foto degli appunti cartacei dentro una nota (vedi [[Foto e soluzione]])?
