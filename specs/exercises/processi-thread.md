# Processi, thread e multitasking

Generatore: `processi-thread` (`src/lib/exercises/v2/generators/processi-thread.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-so.ts`). Verifica indipendente: `scripts/exercises/checkers/processi_thread.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/20-processi-thread.md`.

Sei livelli. I livelli da 1 a 4 sono a scelta multipla (`answer.kind = 'choice'`): le risposte sono stati o sequenze di
processi. I livelli 5 e 6 hanno una risposta numerica in millisecondi (`answer.kind = 'number'`), con la scelta
multipla costruita da `toChoice()` sui valori sbagliati di `params.wrong`.

## Nomi dei livelli

1. Lo stato di un processo
2. Uno stato, un evento
3. Una sequenza di eventi
4. I turni del round robin
5. L'istante di fine
6. Il tempo in coda

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` quando superano i 28 caratteri (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I nomi di persona vengono da un elenco di dodici; nessun marchio nel testo.
- Gli stati, come opzioni: Pronto, In esecuzione, In attesa, Terminato (sempre tutti e quattro).
- Il processo è "il processo del browser", "di un gioco", "di un'app di mappe"…: dodici programmi.
- Le transizioni sono quelle della figura della lezione: riceve la CPU (pronto, in esecuzione); il quanto scade (in
  esecuzione, pronto); chiede un'operazione di ingresso o uscita (in esecuzione, in attesa); l'operazione è completata
  (in attesa, pronto); esegue l'ultima istruzione (in esecuzione, terminato).
- Round robin: tre processi $P_1$, $P_2$, $P_3$, tutti in coda dall'istante $0$ nell'ordine della tabella; chi finisce
  prima della fine del quanto lascia subito la CPU; chi non ha finito torna in fondo alla coda; il cambio di contesto
  non costa tempo. Tempi di CPU interi da $1$ a $12\,\text{ms}$, quanto da $2$ a $5\,\text{ms}$, almeno un processo che
  chiede più di un quanto, da 4 a 8 turni in tutto.

## Livello 1: lo stato di un processo

Dodici situazioni: tre per in esecuzione, quattro per pronto, tre per in attesa, due per terminato. "Il processo del
browser ha chiesto di leggere un file, e il disco non ha ancora risposto. In quale stato si trova?"

Esempi:

- "… potrebbe proseguire subito, ma la CPU è occupata da un altro processo." Risposta: Pronto.
- "… ha ricevuto i dati che aspettava, e ora gli manca solo la CPU." Risposta: Pronto. Distrattore tipico: In
  esecuzione (l'avviso "Da in attesa non si passa a in esecuzione").

## Livello 2: uno stato, un evento

Uno stato di partenza e un evento possibile da quello stato, scritto in uno di dieci modi. "Il processo di un gioco è
in esecuzione. Poi il suo quanto di tempo scade. In quale stato si trova ora?" I cinque tipi di evento escono circa 1
su 5 ciascuno.

Esempi:

- "… è in attesa. Poi i dati che aspettava arrivano." Risposta: Pronto.
- "… è in esecuzione. Poi chiede dei dati alla rete." Risposta: In attesa.

## Livello 3: una sequenza di eventi

Il processo viene creato (quindi è pronto) e seguono da 3 a 5 eventi, ognuno possibile dallo stato in cui il processo
si trova; la fine può essere solo l'ultimo evento. "Il processo del lettore video viene creato. Poi, nell'ordine: lo
scheduler gli assegna la CPU; chiede di leggere un file dal disco; l'operazione che aspettava viene completata. In
quale stato si trova alla fine?" Risposta: Pronto.

Secondo esempio: "… arriva il suo turno e riceve la CPU; il suo quanto di tempo scade; lo scheduler gli assegna la
CPU; esegue la sua ultima istruzione." Risposta: Terminato.

## Livello 4: i turni del round robin

Tabella dei tre processi con il tempo di CPU, quanto dato. "Qual è la sequenza dei turni?" Le opzioni sono sequenze
come $P_1, P_2, P_3, P_1, P_3$. Distrattori, dagli errori veri:

- il giro continua senza togliere chi ha finito ($P_1, P_2, P_3, P_1, P_2, P_3$);
- due turni consecutivi dello stesso processo contati come uno;
- un solo giro ($P_1, P_2, P_3$);
- l'ultimo turno dimenticato, o un turno in più;
- la sequenza con un quanto diverso di $1$ o $2\,\text{ms}$.

Esempi:

- Quanto $4\,\text{ms}$; $8$, $4$, $12\,\text{ms}$. Risposta: $P_1, P_2, P_3, P_1, P_3, P_3$.
- Quanto $3\,\text{ms}$; $7$, $2$, $5\,\text{ms}$. Risposta: $P_1, P_2, P_3, P_1, P_3, P_1$.

## Livello 5: l'istante di fine

Stessa tabella. "A quale istante finisce $P_2$?" Risposta in millisecondi. Valori sbagliati, nell'ordine: l'istante
che si ottiene contando un quanto intero per ogni turno; la fine con i processi eseguiti uno dopo l'altro; il tempo di
CPU del processo; poi valori vicini.

Esempi:

- Quanto $3\,\text{ms}$; $7$, $2$, $5\,\text{ms}$; fine di $P_3$: $13\,\text{ms}$ (con i quanti interi sarebbe $15$).
- Quanto $4\,\text{ms}$; $8$, $4$, $12\,\text{ms}$; fine di $P_1$: $16\,\text{ms}$ (uno dopo l'altro sarebbe $8$).

## Livello 6: il tempo in coda

Stessa tabella. "Per quanto tempo in tutto $P_3$ resta in coda, pronto, senza usare la CPU?" Risposta: istante di fine
meno tempo di CPU, sempre maggiore di zero. Valori sbagliati: l'istante di fine (la sottrazione dimenticata); l'attesa
con i processi eseguiti uno dopo l'altro; l'istante del primo turno; il valore con i quanti interi; poi valori vicini.

Esempi:

- Quanto $3\,\text{ms}$; $7$, $2$, $5\,\text{ms}$; $P_1$: $14 - 7 = 7\,\text{ms}$.
- Quanto $4\,\text{ms}$; $8$, $4$, $12\,\text{ms}$; $P_3$: $24 - 12 = 12\,\text{ms}$.

## Esercizi da evitare

- Round robin in cui nessun processo supera il quanto (diventa una fila ordinaria) o con più di 8 turni.
- Tempo in coda uguale a zero al livello 6.
- Sequenze di eventi con un passaggio che la figura della lezione non ha (da in attesa a in esecuzione).

## Verifica

`scripts/exercises/checkers/processi_thread.py` classifica la situazione del livello 1 dalle sue parole; ai livelli 2
e 3 riconosce ogni evento e lo applica con la sua tabella delle transizioni, bocciando un evento impossibile dallo
stato corrente; ai livelli 4, 5 e 6 legge la tabella e il quanto dal testo, controlla i vincoli e simula il round
robin per conto suo. Per le risposte numeriche controlla il valore, le quattro opzioni scritte con l'unità e che una
sola sia giusta.

## Domande per la revisione

- "Tempo in coda" è il nome scelto per il tempo passato da pronto: i libri lo chiamano "tempo di attesa", che qui si
  confonderebbe con lo stato in attesa. Va bene?
- I thread non hanno esercizi: nella lezione sono un cenno. Serve almeno una domanda?
- Il cambio di contesto è trascurato nei conti: va bene per il primo anno?
