# Note: La CPU e il ciclo di esecuzione delle istruzioni

Lezione nuova (3 ottobre 2026). Non esisteva un originale.

## Struttura ed esempi

Le parti della CPU (unità di controllo, ALU, registri; contatore di programma, registro istruzioni, accumulatore) con
la figura; un linguaggio macchina in miniatura, dichiarato inventato; il ciclo prelievo, decodifica, esecuzione in tre
passi con la figura; clock e frequenza; i core.

Cinque esempi svolti:

1. `CARICA 10`, `SOMMA 11`, `SALVA 12`, `FERMA` con $7$ e $5$: il primo ciclo fase per fase e la tabella dello stato
   dopo ogni ciclo;
2. una somma e una sottrazione ($18 + 15 - 8 = 25$): si segue solo l'accumulatore;
3. una cella riscritta durante il programma ($4$ e $6$: la cella $12$ finisce a $20$, non a $14$);
4. clock di $2\,\text{MHz}$ e $4$ impulsi per istruzione: $500\,000$ istruzioni al secondo, $6$ secondi per
   $3\,000\,000$ istruzioni;
5. quattro core da $500\,000$ istruzioni al secondo: $6\,000\,000$ in $3$ secondi, come massimo.

Avvisi: copiare non è spostare; il contatore di programma guarda avanti; la frequenza da sola non dice quale CPU è più
veloce.

## Conti

Rifatti in Python (`/tmp/informatica-cap4/conti.py`): i tre programmi degli esempi eseguiti con un interprete di poche
righe (stato dopo ogni ciclo dell'esempio 1; $25$ nell'esempio 2; $20$ nell'esempio 3, e $14$ con il valore vecchio);
$2\,000\,000 : 4 = 500\,000$; $3\,000\,000 : 500\,000 = 6$; $4 \cdot 500\,000 \cdot 3 = 6\,000\,000$.

## Scelte

- Il linguaggio macchina è inventato e a parole: `CARICA`, `SOMMA`, `SOTTRAI`, `SALVA`, `FERMA`, con un indirizzo. È
  una macchina a un accumulatore, come quelle dei libri (per esempio il "Little Man Computer" di Stuart Madnick, usato
  nella didattica dagli anni Sessanta: da verificare, e non citato nel testo). Niente salti: i cicli e le condizioni
  sono del secondo anno.
- Le istruzioni si scrivono in codice in linea (`` `SOMMA 11` ``), mai dentro `$...$`; negli esercizi, dentro
  `\text{}`.
- I registri sono tre. Mancano il registro indirizzi e il registro dati della memoria (MAR e MDR), che molti libri
  mettono nello schema: avrebbero raddoppiato i passi del prelievo. Se servono, vanno aggiunti alla lezione 16 con i
  bus.
- Il contatore di programma aumenta nella fase di prelievo, come nella descrizione più diffusa. Gli indirizzi partono
  da $0$ e ogni istruzione occupa una cella.
- "Impulsi di clock" e non "cicli di clock", per non confondere con il ciclo di esecuzione.
- I numeri degli esempi sul clock sono piccoli di proposito ($2\,\text{MHz}$): non descrivono una CPU di oggi.
- I confronti della ALU sono nominati ma non usati: il linguaggio della lezione non ha istruzioni di confronto.

## Fatti da verificare

- "Milioni o miliardi di volte al secondo" e "le CPU dei computer e dei telefoni di oggi contengono più core": vero nel
  2026 per i prodotti in commercio, senza numeri nel testo. Da rileggere quando la lezione invecchia.
- Hertz, kHz, MHz, GHz con i fattori $10^3$, $10^6$, $10^9$: Sistema Internazionale.
- "Due CPU con lo stesso clock possono eseguire un numero diverso di istruzioni al secondo": è il motivo per cui il
  clock non basta a confrontare CPU di famiglie diverse; nessun numero citato.

## Figure

- `cpu-parti-registri` (TikZ): il riquadro della CPU con unità di controllo e ALU a sinistra e i tre registri a destra.
- `ciclo-prelievo-decodifica-esecuzione` (TikZ): le tre fasi a triangolo, con le frecce in senso orario.

Guardate in chiaro e in scuro.

## Per il generatore

`inf-cpu`, sei livelli (specifica in `specs/exercises/inf-cpu.md`): le parti della CPU (scelta multipla); l'accumulatore
alla fine; contatore di programma e registro istruzioni; una cella che cambia; istruzioni al secondo; tempo e core. I
livelli da 2 a 6 sono di conto, con risposta numerica.

## Domande per Andrea

- Va bene un linguaggio macchina a parole in italiano (`CARICA`, `SOMMA`, `SALVA`), o si preferiscono i nomi inglesi
  dei libri (`LOAD`, `ADD`, `STORE`)?
- Servono MAR e MDR in questa lezione?
- "Impulsi di clock" al posto di "cicli di clock": è chiaro?
- Il conto "istruzioni al secondo = frequenza diviso impulsi per istruzione" è un modello molto semplificato. Va bene
  per la prima, o è meglio fermarsi alla definizione di frequenza?
- Core e thread: qui c'è solo il core, e il rimando alla lezione 20. Basta?
