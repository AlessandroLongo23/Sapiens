# Note: Il concetto di algoritmo

Lezione nuova, scritta da zero il 5 ottobre 2026 secondo `brief-secondo-anno.md` (secondo anno, capitolo "Algoritmi e
diagrammi di flusso"). Non pubblicata.

## Struttura

Apertura con il navigatore; definizione di algoritmo, esecutore, dati di ingresso e di uscita, con la media di due voti
a parole e come diagramma; le cinque proprietà in tabella, con un controesempio per ognuna; un algoritmo sceglie e
ripete, con l'algoritmo di Euclide per sottrazioni (a parole, diagramma, tabella di traccia con 48 e 18); algoritmo e
programma, con il maggiore di due numeri e il codice accanto al diagramma; quattro esercizi.

- Righe: 189 nel file, 61 di testo. Nessuna figura TikZ, nessun blocco `codice`.
- Diagrammi: 7. Tre nella lezione (`algoritmo-media-due-voti`, `algoritmo-euclide-sottrazioni`,
  `algoritmo-maggiore-di-due`) e quattro negli esercizi: uno da eseguire per capire che cosa calcola (addizioni
  ripetute), uno da riordinare, uno da completare (due rami vuoti), uno da costruire.
- Avvisi: la ricetta che non è un algoritmo; i dati per cui un algoritmo vale; algoritmo e programma.

## Verifiche

- `check.mts`: ok, nessun errore e nessun avviso (lezione, formulario, flashcard). `verifica.mts`: 0 esercizi, perché
  non ci sono blocchi `codice`.
- I sette diagrammi eseguiti fino in fondo nella pagina di anteprima, con Chromium guidato da Playwright ("Passo" fino
  alla fine con i valori di `% ingresso:`). Uscite: 7,5; 6; 30; 12; 24 (quello da riordinare, prima della correzione).
- I tre esercizi da modificare risolti nella pagina con gli stessi gesti dello studente: blocco trascinato (biglietti,
  esce 26), blocchi aggiunti dalla fila e scritti (minore: 12 con 12 e 30, 4 con 9 e 4; ore e minuti: 135 con 2 e 15).
- Valori citati nel testo controllati con il motore dei diagrammi: Euclide con 35 e 12 dà 1, con 5 e 0 si ferma dopo
  2000 passi; le addizioni ripetute danno 10 con 5 e 2, 42 con 6 e 7, 0 con $b = 0$ e con $b = -2$.

## Scelte

- Cinque proprietà: finito, non ambiguo, eseguibile, deterministico, generale. I libri non sono d'accordo né sul
  numero né sui nomi ("finitezza", "non ambiguità", "realizzabilità", "determinismo", "generalità"; alcuni aggiungono
  la completezza). Ho usato gli aggettivi, più facili da dire per un quindicenne.
- La lezione viene prima di quella sui diagrammi di flusso, ma usa già i diagrammi: dice in una riga che le forme si
  spiegano nella lezione 47 e chiede solo di premere "Passo". Negli esercizi lo studente trascina e scrive blocchi, con
  le istruzioni scritte nella consegna.
- `% codice: no` su tutti i diagrammi tranne quello della sezione "Algoritmo e programma", dove il codice accanto
  serve a far vedere un algoritmo e due programmi. Il brief prevede `% codice: no` per gli esercizi in cui il
  programma lo scrive lo studente; qui serve a non mostrare codice a chi non ha ancora visto un linguaggio.
- Euclide nella versione con le sottrazioni, non con i resti: usa solo la sottrazione e si segue a mano. La
  spiegazione del perché funziona è in due righe, senza dimostrazione.
- Il caso $b = 0$ è presentato come dato fuori dai vincoli per cui l'esecuzione non termina.
- Variabili: $a$, $b$, $n$, $t$, $p$, $h$, $m$ di una lettera; `media` per intero.
- Nessun accenno a efficienza, complessità, algoritmi non deterministici o probabilistici.

## Fonti e cose da verificare

- Euclide, "Elementi", libro VII, proposizioni 1 e 2 (circa 300 a.C.): il procedimento per sottrazioni successive. La
  lezione dice "uno degli algoritmi più antichi che si conoscano" e "eseguito a mano per più di duemila anni". Citato a
  memoria, da verificare su un'edizione degli Elementi.
- L'origine della parola "algoritmo" (dal nome di al-Khwarizmi, IX secolo) non è nella lezione: mancava lo spazio. Se
  la si vuole aggiungere, la fonte da controllare è la voce "algoritmo" del Vocabolario Treccani.
- Il limite dei 2000 passi viene da `src/lib/diagramma/esecuzione.ts` (`MAX_STEPS`): se cambia, cambia la frase
  dell'avviso sui dati.

## Domande per Andrea

- Le proprietà dell'algoritmo: vanno bene queste cinque e questi nomi, o in classe usi un altro elenco?
- "Dati di ingresso" e "dati di uscita", con input e output tra parentesi: va bene, o preferisci input e output?
- L'algoritmo di Euclide alla prima lezione del capitolo è troppo, per una classe che non ha ancora visto i cicli?
