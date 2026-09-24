# Note: Operazioni in ℤ

Lezione nuova, scritta da zero. Tutti i conti di lezione, formulario e carte sono stati rifatti in Python.

## Scelte di convenzione

- Titolo nella prima riga: "Operazioni in ℤ" con il carattere Unicode, come fa "Operazioni in ℕ" (06). Nel database il titolo è `Operazioni in \mathbb{Z}`: la prima riga viene scartata dal sito, quindi non cambia niente, ma i due formati restano diversi.
- Positivi scritti con il $+$ esplicito solo quando serve a mostrare la regola ($(+7) + (-4)$); negli esempi e nelle espressioni il $+$ si omette. Il testo lo dice all'inizio, insieme alla regola che un negativo dopo il segno di un'operazione va tra parentesi.
- Divisione con $:$, come in 06.
- "Somma algebrica" e "termine" definiti qui, con lo stesso nome usato in 13 (Operazioni tra monomi).
- La regola dei segni è presentata una volta, con la tabella, e vale per prodotto e quoziente. La giustificazione di "meno per meno fa più" con la distributiva è in un `ad-note`, saltabile.
- Nella tabella delle proprietà ho messo solo "interna in ℕ / in ℤ", non tutta la tabella di 06: le altre proprietà sono le stesse e sono elencate in una lista.

## Dubbi

- Concordi e discordi sono definiti in 20 (Numeri interi e valore assoluto); qui li uso con un link e una glossa tra virgole, senza grassetto. Se 20 cambia, controllare che la definizione resti "diversi da 0".
- La frase "Lo $0$ non ha segno, quindi $0 : (-4)$ fa $0$, non $-0$" è corretta ma forse superflua: si può togliere.
- Divisione con resto tra interi (resto non negativo, $-7 = 2 \cdot (-4) + 1$): lasciata fuori, perché i libri del biennio di solito non la fanno e le convenzioni sul resto negativo variano. Da decidere se serve.
- "Invariantiva della sottrazione senza condizioni" e "distributiva senza la condizione $b \geq c$" sono citate solo in una riga, senza esempio.
- La figura (retta dei numeri con le frecce di $(-3) + (+5)$ e $(+4) + (-6)$) va guardata sul sito in chiaro e in scuro: le etichette delle due frecce sono sopra le frecce, a quote diverse, e non dovrebbero sovrapporsi.

## Argomenti lasciati ad altre lezioni

- Definizione di ℤ, opposto, valore assoluto, concordi e discordi, confronto: in 20 (Numeri interi e valore assoluto).
- Potenze con base negativa e le potenze nelle espressioni: in 22 (Potenze in ℤ). Nessun esempio qui contiene potenze.
- Divisione sempre possibile: rimando a Operazioni in ℚ.

## Cosa togliere da lezioni già scritte

- 20 (Numeri interi e valore assoluto), riga 23: "In ℤ la sottrazione è sempre possibile, cioè è un'operazione interna". Non è sbagliata e può restare come motivazione, ma la spiegazione (sottrazione come addizione dell'opposto) è qui: basterebbe un link.
- 13 (Operazioni tra monomi), sezione "Somma algebrica": "sottrarre un monomio vuol dire sommare il suo opposto" è la stessa idea di qui; si può aggiungere un link a questa lezione, senza togliere nulla.
- 06 (Operazioni in ℕ) rimanda già a questa lezione per la sottrazione: niente da cambiare.

## Formulario e flashcard

- Formulario: sezioni nell'ordine della lezione, tre `ad-warning` (due negativi sommati, meno davanti alla parentesi, somma tra discordi). Nessuna figura.
- 19 carte. La carta `espressione-segno` ($12 - 20 : (-5) = 16$) usa numeri che non sono nella lezione, ma lo stesso passaggio dell'Esempio 2.

## Livelli per gli esercizi

1. Addizione di due interi, concordi o discordi, con il segno esplicito: $(-7) + (+4) = -3$.
2. Sottrazione di due interi, da trasformare in addizione dell'opposto: $(-2) - (-6) = +4$.
3. Somma algebrica di 4-6 termini senza parentesi, con segni da ridurre: $-4 + 9 - 12 + 3 = -4$.
4. Somma algebrica con una o due parentesi da togliere, almeno una preceduta da $-$: $15 - [4 - (6 - 11) + 2] = 4$.
5. Prodotti di più fattori e divisioni esatte con la regola dei segni: $(-2) \cdot (+3) \cdot (-1) \cdot (-5) = -30$, $(-12) : (-4) = 3$.
6. Espressioni con tutte e quattro le operazioni, priorità e parentesi annidate, tutte le divisioni esatte: $-[5 - (3 - 8)] + \{-2 \cdot [4 - (-6 + 1)]\} : (-3) = -4$.
