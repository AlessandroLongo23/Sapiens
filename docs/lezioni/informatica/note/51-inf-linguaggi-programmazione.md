# Note: Linguaggi, compilatori e interpreti

Lezione nuova, scritta il 5 ottobre 2026 secondo `brief-secondo-anno.md` (capitolo "Linguaggi e primi programmi"), con
formulario e flashcard. Non pubblicata.

## Che cosa c'è

Linguaggio macchina (richiamo alla lezione 14) e basso livello; linguaggi ad alto livello, codice sorgente, sintassi;
compilatore e programma eseguibile (il traduttore di un romanzo, le app del telefono); interprete (l'interprete a una
conferenza); tabella di confronto; perché Python e C++; un programma di tre stampe nei due linguaggi, da rompere con un
nome sbagliato nell'ultima istruzione per vedere la differenza tra i due traduttori.

- 115 righe, circa 45 di testo. Figure TikZ: 1 (`compilatore-e-interprete`). Programmi da eseguire: 1. Esercizi con le
  prove: 0. Diagrammi: 0. Riquadri: 1 `ad-note`, 2 `ad-warning`.
- È una lezione di concetto con un solo programma, come da consegna: i minimi delle lezioni con la programmazione (tre
  programmi, due esercizi con le prove) qui non si applicano.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard: 17 carte).
- `verifica.mts`: niente da controllare, la lezione non ha esercizi con le prove.
- Figura guardata in chiaro e in scuro con `anteprima.mjs` (larga circa 7,9 cm): testi dentro i riquadri, frecce
  dritte, niente da correggere.
- Programma provato nella pagina di anteprima con Chromium (Playwright), nelle due linguette: stampa "Inizio",
  "7 per 8 fa 56", "Fine". Con `prin` al posto di `print` Python stampa le prime due righe e poi
  `NameError: name 'prin' is not defined. Did you mean: 'print'?` alla riga 3; con `cot` al posto di `cout` il C++ non
  stampa niente e dà `programma.cpp:8:5: error: use of undeclared identifier 'cot'`. La scritta "Compilo…" compare
  davvero, in alto accanto a "Esegui".

## Scelte che il README non fissava

- L'esperimento usa un nome sbagliato e non un errore di sintassi, perché Python controlla la sintassi di tutto il
  file prima di partire: con una parentesi non chiusa nell'ultima riga non stampa niente nemmeno lui, e la differenza
  tra i due traduttori non si vedrebbe. La riga della tabella dice "un nome scritto male", non "un errore". La
  distinzione è spiegata nella 55.
- Python è detto "interpretato" e C++ "compilato", come nei libri. Il riquadro `ad-note` dice che Python passa da una
  forma intermedia, senza la parola "bytecode".
- L'assembly non è nominato: la lezione 14 usa già un linguaggio macchina a parole, e il termine avrebbe chiesto una
  definizione in più. Da decidere con Andrea.
- Niente storia dei linguaggi (date, nomi), niente classifiche di diffusione: sono numeri e fatti che invecchiano.
- "Programma eseguibile" o "eseguibile"; "codice sorgente" o "sorgente"; "traduttore" per dire insieme compilatore e
  interprete.

## Da verificare

- "I libri di scuola usano l'uno o l'altro": viene da `programma.md` (Hoepli e Atlas con C e C++, Minerva e Hoepli
  "Hashtag" con Python, schede lette il 26 settembre 2026). Indici non letti.
- "I suoi programmi sono tra i più veloci" (C++): affermazione generica, senza numeri. Va bene così?
- La frase sull'editor ("Compilo…", compilatore e interprete che girano nel browser) dipende dal sito: se cambia la
  scritta in `src/components/codice/clang.ts`, va cambiata la frase.

## Domande per Andrea

- L'assembly va nominato in questa lezione, o basta "linguaggio macchina" e "basso livello"?
- Per Python dici "interpretato" e basta, o vuoi che il bytecode sia nominato già al biennio?
- Le due immagini (il traduttore del romanzo, l'interprete alla conferenza) sono quelle che usi in classe?
