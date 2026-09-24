# Note: Prime definizioni

## Errori nell'originale

- Il testo è identico, parola per parola, a quello di "Rappresentazione degli insiemi" (02), con lo stesso titolo interno "Insiemi e Logica di base" (in Title Case e diverso dal titolo della lezione).
- Nessun errore di matematica vero e proprio, ma metà della lezione è fuori argomento: le tre rappresentazioni (argomento della 02) e la sezione "Sottoinsiemi e uguaglianza" (argomento della 04).
- L'esempio $B = \{\text{"rosso"}, \text{"verde"}, \text{"blu"}\}$ usa le virgolette dentro l'insieme, una scrittura che i libri non usano.

## Scelte

- Ambito: cos'è un insieme (ben definito, con esempi e controesempi), elementi, $\in$ e $\notin$, notazione (maiuscole, graffe, simboli $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$), insieme vuoto e insieme unitario, finiti e infiniti, cardinalità, insieme universo. Sono le nozioni che servono a tutte le lezioni successive e che nessun'altra lezione del capitolo ha nel titolo.
- Tolti: rappresentazioni e diagramma TikZ (link a 02), sottoinsiemi e uguaglianza (link a 04). Resta una frase sul fatto che nell'insieme un elemento conta una volta e l'ordine non conta, perché serve a spiegare la cardinalità; il perché formale è in 04.
- L'universo è introdotto senza diagramma e con un link a 03 per il complementare.
- La cardinalità c'è perché serve poi nella formula dell'unione (05) e nel prodotto cartesiano (03). Si parla solo di cardinalità di insiemi finiti; niente cardinalità degli infiniti.

## Dubbi da decidere

- Notazione della cardinalità: ho usato $|A|$ e citato $\text{card}(A)$ e $n(A)$. Va scelta quella del sito e usata uguale in 03, 04, 05.
- "Insieme unitario" è una riga sola: si può togliere se sembra superfluo.
- $\mathbb{Q}$ è descritto come "i numeri che si scrivono come frazione", $\mathbb{R}$ solo per nome: è voluto, le definizioni sono nei capitoli sui numeri.
- In `index.json` lo slug di questa lezione è `prime-definizioni`, uguale a `url.md`; per 02 e 03 invece gli slug di `index.json` (`insiemi-rappresentazione`, `insiemi-operazioni`) non coincidono con gli URL di `url.md` (`rappresentazione-degli-insiemi`, `operazioni-e-relazioni-tra-insiemi`). Ho usato `url.md`: va controllato che i link funzionino.

## Figure

Nessuna necessaria.

## Formulario e flashcard

- Nel formulario la cardinalità è scritta $|A|$, con $\text{card}(A)$ e $n(A)$ tra parentesi come nella lezione: quando si sceglie la notazione del sito (vedi i dubbi sopra) vanno aggiornati anche formulario e carte.
- Le carte su $\mathbb{Q}$ e $\mathbb{R}$ non ci sono, perché la lezione li nomina soltanto: c'è una sola carta sui simboli, quella su $\mathbb{Z}$.
