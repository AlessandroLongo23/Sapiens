# Note: Il tempo di dimezzamento

Lezione nuova (terzo anno di chimica, gruppo C, 6 ottobre 2026), capitolo "Il nucleo e la radioattività", seconda di
tre. Non pubblicata. `check.mts` passa su lezione, formulario e flashcard, senza avvisi. Conti degli esempi rifatti in
Python (script nello scratchpad).

## Struttura

Il decadimento è casuale per un nucleo e regolare per tanti; la definizione di tempo di dimezzamento, con la tabella
di dodici radioisotopi; la legge con $n$ intero, la curva, tre esempi (quanto resta, quanto tempo, trovare
$t_{1/2}$) e la figura interattiva; i tempi che non sono multipli (esponenziale, esempio 4) e il problema inverso con
il logaritmo (esempio 5), con i link alla matematica del terzo anno; l'attività e il becquerel, con la relazione
$A = 0{,}693\,N/t_{1/2}$ e l'esempio del grammo di radio; la datazione con il carbonio-14, con il grafico, l'esempio
di Ötzi, i limiti del metodo e la calibrazione. Sette esempi svolti.

## Scelte e convenzioni

- La legge è scritta $N = N_0 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$, e non $N = N_0\,e^{-\lambda t}$: con il
  tempo di dimezzamento come unico parametro la formula si legge e si controlla con le potenze di un mezzo. La
  costante di decadimento $\lambda$ non ha nome nella lezione; compare solo come $0{,}693/t_{1/2}$ nella formula
  dell'attività, dove si dice che $0{,}693$ è il logaritmo naturale di $2$.
- $N$ in questa lezione è il numero di nuclei, nella 54 il numero di neutroni; $A$ qui è l'attività, nella 54 il
  numero di massa. La lezione lo dice tutte e due le volte. Sono i simboli di tutti i libri.
- Il logaritmo è in base $2$, con il cambio di base $\log_2 x = \log x / \log 2$ per la calcolatrice.
- Tempi di dimezzamento: i valori dei libri, controllati su NUBASE2020 (Kondev e altri, Chinese Physics C 45, 030001,
  2021) e arrotondati. Per il carbonio-14 la lezione usa $5730$ anni, il valore di tutti i libri di scuola; NUBASE2020
  dà $5{,}70 \cdot 10^3$ anni. Cesio-137: NUBASE2020 $30{,}04$ anni, nella lezione $30$.
- L'anno in secondi è $365 \cdot 24 \cdot 3600 = 3{,}15 \cdot 10^7\,\text{s}$.
- Radio-226: massa molare $226\,\text{g/mol}$ (il numero di massa; `elementi.json` dà $[226]$).

## Da verificare

- Ötzi: trovato nel 1991, morto circa $5300$ anni fa. Il "$53\%$ di carbonio-14" dell'esempio 7 è ricavato da questa
  età ($2^{-5300/5730} = 0{,}527$), non da una misura pubblicata.
- Willard Libby, premio Nobel per la chimica nel 1960: a memoria.
- "Circa un atomo di carbonio ogni mille miliardi è carbonio-14" (il valore dei libri è $1{,}2 \cdot 10^{-12}$).
- Il limite di $50\,000$ anni per la datazione: è l'ordine di grandezza dei libri.
- L'età della Terra, $4{,}5$ miliardi di anni.
- "Per molto tempo questa attività è stata l'unità di misura, il curie": $1\,\text{Ci} = 3{,}7 \cdot 10^{10}\,\text{Bq}$.

## Figure

Due TikZ, guardate in chiaro e in scuro: `dimezzamento-curva-decadimento` e `dimezzamento-carbonio-14-eta`.

Una interattiva, `dimezzamento-campione-nuclei` (`DimezzamentoCampioneNuclei.tsx`): un campione di 16, 100 o 400
nuclei che decadono a caso, ognuno con la stessa probabilità in ogni istante, e accanto il conteggio dei rimasti
disegnato sopra la curva della legge. Si avvia, si mette in pausa, o si avanza di un tempo di dimezzamento alla volta
(questo bottone serve anche a chi ha chiesto meno animazioni). Quello che si deve vedere, e che il testo dice dopo:
con 16 nuclei il conteggio segue la legge solo da lontano e ogni prova è diversa, con 400 le sta quasi sopra.
Guardata in chiaro, in scuro e a 390 px, ferma, in corsa e alla fine: nessun errore in console, nessuno scorrimento
laterale.

Nessun blocco `grafico`: la curva con il cursore del tempo avrebbe ripetuto la figura interattiva.

## Esercizio guidato

L'esempio 5 (dopo quanto tempo il cobalto-60 si riduce al $10\%$). Si fermerebbe in tre punti: quanto vale il rapporto
$N_0/N$; quanti tempi di dimezzamento, con il logaritmo; tra quali due potenze di un mezzo deve cadere il risultato.

Prerequisiti proposti: chim-radioattivita, numero-massa, mole-massa-molare

Servono anche due lezioni di matematica del terzo anno, `funzioni-esponenziali` e `logaritmi-proprieta`, per le ultime
due sezioni e per i livelli 5 e 6 degli esercizi.

## Esercizi

Generatore `chim-tempo-dimezzamento`, sei livelli (specifica in `specs/exercises/chim-tempo-dimezzamento.md`): quanto
resta; quanto tempo serve; il tempo di dimezzamento; rimasto e decaduto; un tempo qualunque; il tempo dal logaritmo,
con la datazione. Il livello 4 ha per risposta un numero puro e si propone anche a risposta aperta. L'attività in
becquerel non ha un livello suo: nei primi tre livelli la quantità è sempre una massa.

## Dubbi per Andrea

- La legge con la base un mezzo va bene, o in terza vuoi anche $N = N_0\,e^{-\lambda t}$ con la costante di
  decadimento?
- I livelli 5 e 6 degli esercizi chiedono esponenziali e logaritmi con la calcolatrice. In terza, a chimica, si
  fanno, o gli esercizi devono fermarsi ai multipli interi del tempo di dimezzamento?
- La formula $A = 0{,}693\,N/t_{1/2}$ e l'esempio del grammo di radio: da tenere, o è materia di fisica del quinto
  anno?
- Per il carbonio-14 teniamo $5730$ anni, come i libri?
