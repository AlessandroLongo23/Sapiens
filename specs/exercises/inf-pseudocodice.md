# inf-pseudocodice: Lo pseudocodice

Lezione: `docs/lezioni/informatica/riscritte/48-inf-pseudocodice.md`.

Un'opzione e una domanda di un esercizio sono un solo capoverso di testo: uno pseudocodice su più righe, con il suo
rientro, non si può mostrare (gli a capo vengono persi). Per questo le righe di pseudocodice compaiono una alla
volta (livelli 1 e 3), il rientro si conta e si ragiona sul diagramma dello stesso algoritmo (livelli 4 e 5), e nel
livello 6 lo pseudocodice da trasformare in diagramma è scritto su una riga sola, con le righe separate da una barra
e il segno ► davanti a quelle rientrate. Le opzioni che la lezione vorrebbe come pseudocodice intero sono diagrammi.

Lo pseudocodice è quello della lezione: `leggi`, `scrivi`, `←`, `se` / `altrimenti`, `finché`; `·`, `−`, `div`,
`mod`; `=`, `≠`, `≤`, `≥`.

## Livelli

1. **Le parole dello pseudocodice.** Testo. Un'azione a parole e quattro righe. Sei casi in parti uguali:
   `assegna`, `leggi`, `scrivi testo`, `scrivi valore`, `selezione`, `ripetizione`. Esempio: "calcolare n più 1 e
   mettere il risultato in n" → `n ← n + 1` (e non `n = n + 1`).
2. **Quoziente e resto: div e mod.** «x ← 17 mod 5»: quanto vale x? Divisore da 2 a 9, resto diverso da zero.
3. **Dal blocco alla riga.** Un diagramma con una selezione o un ciclo: la riga del rombo (60%: `se` per una
   selezione, `finché` per un ciclo) o del primo rettangolo dall'alto. Esempio: rombo "i ≤ 5?" con la freccia che
   risale → `finché i ≤ 5`.
4. **Contare il rientro.** Un diagramma, anche con una struttura dentro l'altra: quante righe del suo pseudocodice
   sono rientrate, oppure quante righe ha in tutto, con `inizio` e `fine`. `altrimenti` è una riga anche se non ha
   un blocco.
5. **Un rientro sbagliato.** Un diagramma, e lo pseudocodice ricopiato con l'ultima riga rientrata come quella
   sopra: che cosa scrive? Esempio: somma da 1 a n con `scrivi s` rientrato, con 4 → 1, 3, 6, 10.
6. **Dallo pseudocodice al diagramma.** Lo pseudocodice su una riga. Risposta aperta eseguita sulle prove; a scelta
   multipla, quattro diagrammi.

## Distrattori

Dai riquadri della lezione: `=` al posto della freccia; `se` al posto di `finché`; un testo senza virgolette e una
variabile con le virgolette; quoziente e resto scambiati; quello che scrive lo pseudocodice giusto, nel livello 5;
nel livello 6 il blocco dell'ultima riga dentro il giro o dentro il ramo, e la selezione al posto del ciclo.

## Da evitare

Nel livello 5, ingressi con cui il rientro sbagliato non cambia l'uscita; nel livello 6, pseudocodici con due livelli
di rientro (su una riga sola non si distinguono).
