# Note: Gli operatori logici

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "La
selezione"), insieme alla 56 e alla 59. Non pubblicata.

## Struttura

I tre operatori in una tabella (Python, C++, diagrammi); `and` con la giostra (diagramma e programma); `or` con il
biglietto ridotto del cinema, che riprende l'esempio della 47; `not` e il confronto opposto; le tabelle di verità in
una tabella sola; la precedenza, con l'esempio del museo; gli intervalli; la negazione di una condizione composta
con le leggi di De Morgan, dette a parole, e un programma che scrive le due forme; due esercizi.

- Programmi da eseguire: 3 (giostra, cinema, voto valido con le due forme della negazione), ciascuno in Python e in
  C++.
- Esercizi con le prove: 2 (fine settimana, da scrivere guardando un diagramma con `% codice: no`; anno bisestile,
  con `and`, `or` e un confronto rovesciato).
- Diagrammi: 2 (`diagramma-flusso-giostra-and`, `diagramma-flusso-fine-settimana`).
- Riquadri `ad-warning`: 4 (`giorno == 6 or 7`; il contrario di minore; `1 <= voto <= 10` in C++; negare senza
  cambiare l'operatore). `ad-note`: 1. `ad-tip`: 1.
- Righe: 329. Testo da leggere, contato come nella nota della 56: 45 righe, circa 1460 parole.

## Verifiche

- `check.mts`: ok su lezione, formulario e flashcard (19 carte).
- `verifica.mts`: le due soluzioni superano le prove in Python e in C++. Il programma di partenza del bisestile
  supera tre prove su quattro e sbaglia il 1900, come dice la consegna.
- I tre programmi senza prove eseguiti con Pyodide e con `@yowasp/clang` sui valori del testo (130 e 7, 130 e 9,
  110 e 9; 14, 65, 30; 7, 0, 10, 11); in C++ compilati anche con `clang++ -Wall`, senza avvisi.
- I due diagrammi eseguiti fino in fondo nella pagina in sviluppo (porta 3000) con un browser pilotato da
  Playwright, in chiaro e in scuro, con i valori di `% ingresso:`. La frase del rombo è "130 ≥ 120 E 7 ≥ 8: è
  falsa". Il codice accanto al primo diagramma coincide con il programma della lezione, a parte le domande di
  `input`. Corretto dopo il primo giro: nel secondo diagramma "giorno feriale" usciva di pochi pixel dal riquadro
  (588 px contro 576), ed è diventato "feriale" (560 px), anche nel programma e nelle prove.

### L'intervallo in C++: non compila

Il brief chiedeva di provare `0 <= x <= 10` in C++ e di dire che "compila ma è sbagliato". Provato: con il
compilatore del sito (`@yowasp/clang` 22, argomenti di `clang-args.ts`) e con il `clang++` della macchina (Apple
clang 21) la riga non compila, anche senza `-Wall`:

```
error: chained comparison 'X <= Y <= Z' does not behave the same as a mathematical expression [-Wparentheses]
```

Nelle versioni recenti di Clang questo avviso è un errore. La lezione dice quindi le due cose: che cosa vorrebbe
dire la riga in C++ (confronta con 10 il vero o falso di `1 <= voto`, quindi è sempre vera), che il compilatore
della pagina la rifiuta e che altri compilatori la accettano. Quest'ultima frase non è stata provata qui: sulla
macchina non c'è GCC (`g++` è Clang). Da verificare con GCC, che dovrebbe dare solo un avviso con `-Wall`.

### Altre cose provate

- `giorno == 6 or 7` e `giorno == 6 || 7`: nessun errore e nessun avviso, condizione sempre vera.
- `eta < 14 or >= 65`: `SyntaxError` in Python.
- `!eta >= 18` in C++: compila con un avviso e vale sempre 0; `not eta >= 18` in Python nega il confronto.
- `True or False and False` è `True`; `(True or False) and False` è `False`.
- Con `-Wall` Clang avvisa per `&&` dentro `||` senza parentesi: la soluzione del bisestile ha le parentesi.

## Scelte che il README non fissava

- Nomi degli operatori: "e", "o", "non", con la scrittura dei due linguaggi. Niente "congiunzione", "disgiunzione",
  "negazione", e niente AND, OR, NOT in maiuscolo, che nei diagrammi del sito sono E, O, NON.
- Una sola tabella di verità per i tre operatori, con vero e falso scritti per esteso (non V e F, non 1 e 0).
- Le leggi di De Morgan sono dette a parole, in due righe, senza simboli. Il nome sta nel testo e non nel titolo
  della sezione, perché `check.mts` segnala le maiuscole nei titoli.
- La valutazione a corto circuito (`and` e `or` che non calcolano il secondo lato quando il primo basta) non c'è.
- Lo xor non c'è; l'"o" che esclude è nominato solo per dire che `or` non lo è.
- Precedenza: il testo dà l'ordine `not`, `and`, `or` e dice che i confronti vengono prima di `and` e `or`. La
  differenza tra `not` di Python (dopo i confronti) e `!` del C++ (prima) sta in un `ad-note`, con la regola di
  mettere sempre le parentesi.
- L'esempio del museo usa due variabili booleane, `socio` e `lunedi`, senza un programma: serve solo a leggere la
  condizione.
- Nel programma del voto valido il C++ scrive 1 e 0, come nella 56.

## Da verificare

- GCC accetta `1 <= voto <= 10` con un avviso: non provato (vedi sopra).
- "A destra dell'`or` c'è solo il numero 7, che i due linguaggi trattano come vero": in Python `giorno == 6 or 7`
  vale 7, non `True`; dentro un `if` il risultato è lo stesso. La lezione non entra nel dettaglio.

## Domande per Andrea

- Usi i nomi "congiunzione", "disgiunzione" e "negazione", o bastano "e", "o", "non"?
- Le tabelle di verità: vero e falso per esteso, V e F, oppure 1 e 0?
- Le leggi di De Morgan al secondo anno: a parole come qui, o le lasci al terzo anno?
- La valutazione a corto circuito va nominata?
- In Python fai usare `1 <= voto <= 10`, che funziona, o insegni solo la forma con `and`, che vale anche in C++?
- Anno bisestile come esercizio finale: va bene, o è meglio un esempio senza l'operatore `%`?

Le domande non sono state copiate in `vault/Contenuti/Domande per Andrea.md`, perché il brief vieta di modificare
file esistenti: vanno riportate lì da chi raccoglie il lotto.
