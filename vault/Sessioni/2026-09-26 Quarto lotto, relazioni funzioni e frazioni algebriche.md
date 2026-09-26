---
aggiornato: 2026-09-26
tag: [sessione, contenuti, matematica]
---
# Quarto lotto: relazioni, funzioni e frazioni algebriche

Sessione del 26 settembre 2026, seguito di [[2026-09-26 Terzo lotto, monomi polinomi e scomposizione]]. Alessandro ha indicato i prossimi argomenti del primo anno: le lezioni mancanti di Relazioni e funzioni e di Equazioni di primo grado, e per intero Frazioni algebriche, Disequazioni, Statistica e Geometria del piano.

## Cosa si è deciso
- Le 23 lezioni indicate si dividono in due lotti, seguendo i prerequisiti: il quarto con funzioni, frazioni algebriche ed equazioni, il quinto con disequazioni, statistica e geometria (Claude, approvato da Alessandro). Al quarto si aggiunge Prodotto cartesiano, prerequisito di Relazioni binarie: 13 lezioni. Restano da fare nel capitolo Insiemi e logica intersezione, differenza e le tre lezioni di logica.
- Prerequisiti cambiati su proposta degli agenti: Relazioni di equivalenza e d'ordine richiede anche Sottoinsiemi e uguaglianza; Definizione di funzione anche Espressioni con frazioni; Composizione e funzione inversa anche Equazioni di primo grado intere (lo script lo segnala perché nell'albero viene dopo, ed è scritto tra i dubbi); Semplificazione delle frazioni algebriche anche MCD e MCM di polinomi, che quindi esce dalla riga di Operazioni con le frazioni algebriche; Equazioni letterali anche Semplificazione. Chiusi due dubbi: il piano cartesiano è spiegato in breve nella lezione 42, la legge di annullamento del prodotto nella 46.

## Cosa si è fatto
- Tredici lezioni nuove (file 39-51 in `docs/lezioni/`): Prodotto cartesiano; Relazioni binarie; Relazioni di equivalenza e d'ordine; Definizione di funzione; Dominio, codominio e immagine; Composizione e funzione inversa; Proporzionalità diretta e inversa; Frazioni algebriche e condizioni di esistenza; Semplificazione; Operazioni con le frazioni algebriche; Equazioni fratte; Equazioni letterali; Problemi con le equazioni. 35 figure (quasi tutte diagrammi a frecce e grafici), 241 flashcard. Il brief chiedeva le formule già spezzate per il telefono: misurate sul sito, nessuna esce dalla colonna. Pubblicate.
- Notazione uniformata: la 41 scriveva la relazione $R$, ora $\mathcal{R}$ come la 40. Nella 49 una figura aperta con `~~~tikz`, che lo script di pubblicazione non avrebbe compilato, riscritta con i backtick.
- Lezioni già pubblicate ridotte dove il lotto tratta l'argomento per intero: nella 03 la sezione sul prodotto cartesiano diventa un riepilogo (esempi rinumerati), nella 18 dominio e immagine e il calcolo dell'inversa rimandano alle lezioni nuove, nella 16 il passaggio dal testo all'equazione rimanda a Problemi con le equazioni. Le flashcard già pubblicate non si toccano: dove una carta restava scoperta, il riepilogo ha ripreso la frase che serve.
- Tredici generatori di esercizi (85 livelli), con specifica, controllo indipendente in Python, verifica con due seed più un terzo di Claude (424242), errori piantati, misura della larghezza con `width.mts` fin dalla prima consegna. Collegati al sito con i nomi dei livelli. Tre controlli Python hanno trovato difetti veri nei generatori (un distrattore `undefined`, la trappola $-2^2$ a volte assente, un distrattore mancante), corretti dagli agenti. Nel browser, a 390 px, tutti gli 85 livelli si leggono per intero; le equazioni letterali mostravano la soluzione dei livelli 2-5 come codice, perché era un ambiente a più righe con del testo dentro, che la pagina spezza: riscritta come una riga, e controllato che nessun altro generatore abbia soluzioni o passaggi che KaTeX non disegna.

## Informazioni nuove
- Mettere nel brief i limiti di larghezza (formule della lezione, problemi e opzioni degli esercizi) ha evitato del tutto le correzioni a posteriori del terzo lotto.
- Alcune risposte non entrano nei tipi di oggi: il dominio $\mathbb{R}$ (un insieme vuoto oggi vuol dire "nessuna soluzione"), $\mathbb{R} \setminus \{\dots\}$ per le fratte indeterminate, le discussioni delle letterali, quoziente e resto, ore e minuti. Sono tutte a scelta multipla; per le risposte aperte serviranno tipi nuovi.

## Domande aperte
Per Andrea, oltre ai dubbi in fondo a ogni nota (`docs/lezioni/note/39-51`) e a ogni specifica:
- $\mathrm{Im}(f)$ o $f(A)$ per l'insieme immagine (la 18 usa il primo, la 43 il secondo e cita l'altro);
- $ax + b$ o $mx + q$ per la funzione lineare (44 e 45);
- il parametro delle equazioni letterali $a$ o $k$;
- la riduzione allo stesso denominatore non ha esercizi propri (la risposta sarebbe una coppia di frazioni): basta dentro le somme della 48?
- nelle equazioni problema una soluzione negativa sull'età conta come impossibile;
- la carta `inversa-lineare` della 18 doppia una della 44.

## Prossimo argomento
Commit del lotto, deploy, poi il quinto lotto: disequazioni, statistica e geometria (11 lezioni).
