# Memoria centrale e memorie di massa

Generatore: `memoria-storage` (`src/lib/exercises/v2/generators/memoria-storage.ts`). Verifica indipendente:
`scripts/exercises/checkers/memoria_storage.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/15-memoria-storage.md`. Macchinario comune del capitolo:
`src/lib/exercises/v2/inf-architettura.ts` e `scripts/exercises/checkers/_inf_architettura.py`.

Cinque livelli. I livelli 1, 2 e 5 sono a scelta multipla, composti da pezzi intercambiabili; i livelli 3 e 4 sono di
conto, con risposta numerica e una variante a scelta multipla costruita da `params.distractors`.

## Nomi dei livelli

1. Quale memoria per quale uso
2. Che cosa si perde senza corrente
3. Celle e indirizzi
4. Capacità con i multipli
5. La gerarchia delle memorie

## Regole comuni

- Celle da 1 byte, indirizzi da 0.
- Multipli binari KiB e MiB con fattore 1024, multipli decimali MB e GB con fattore 1000: il fattore è sempre scritto
  nel testo ("Ricorda che $1\,\text{KiB} = 1024\,\text{B}$").
- Numeri da 10 000 in su con lo spazio sottile.

## Livello 1: quale memoria per quale uso

"Quale memoria {compito}?" Opzioni: RAM, ROM, Cache, Memoria di massa; la memoria è scelta per prima, un quarto dei
casi ciascuna. Dispositivi: telefono, tablet, portatile, computer fisso, console per videogiochi, smartwatch. Dieci
programmi (videogioco, calcolatrice, registro elettronico, videoscrittura, navigatore, foglio di calcolo, lettore
musicale, grafica, traduttore, sveglia).

- RAM: contiene le istruzioni {del programma} mentre il programma è in esecuzione; contiene {un lavoro non ancora
  salvato} (cinque); di {dispositivo} contiene i programmi aperti e si svuota allo spegnimento.
- ROM: di {dispositivo} conserva anche senza corrente le prime istruzioni da eseguire all'accensione; contiene il
  programma di avvio e nell'uso normale viene solo letta; fa parte della memoria centrale ma non è volatile.
- Cache: di {dispositivo} tiene accanto alla CPU una copia dei dati usati più di recente; è più veloce della RAM ma
  molto più piccola; risparmia alla CPU l'attesa della RAM per le istruzioni {del programma} che si ripetono di
  continuo.
- Memoria di massa: di {dispositivo} conserva {le foto, i video, le canzoni scaricate, i documenti salvati, le app
  installate, i giochi installati, il sistema operativo} anche a dispositivo spento (ogni tipo di file solo sui
  dispositivi su cui ha senso); ha la capacità più grande; conserva {un lavoro dopo il salvataggio} (cinque); è quella
  da cui le istruzioni {del programma} vengono copiate nella RAM quando apri il programma.

Esempi:

- "Quale memoria contiene il tema che stai scrivendo e non hai ancora salvato?" Risposta: RAM. Distrattore tipico:
  Memoria di massa.
- "Quale memoria di un tablet conserva anche senza corrente le prime istruzioni da eseguire all'accensione?" Risposta:
  ROM.

## Livello 2: che cosa si perde senza corrente

Una frase che dice che un dispositivo si spegne all'improvviso (sei frasi, tutte finiscono con "si spegne."), poi metà
dei casi "Quale di queste cose va persa?" (una cosa persa e tre conservate) e metà "Quale di queste cose si ritrova
alla riaccensione?" (una conservata e tre perse).

Perse (stanno solo in registri, cache o RAM): il tema scritto e non ancora salvato; la partita in corso, non salvata;
il numero appena digitato nella calcolatrice; il disegno non ancora salvato; il contenuto dell'accumulatore della CPU; i
dati tenuti nella cache; le modifiche non salvate a una foto; la copia in RAM del programma aperto.

Conservate (ROM o memoria di massa): le foto salvate nella galleria; il programma di avvio nella ROM; i file su una
chiavetta USB; il sistema operativo installato sul disco; un documento salvato sul disco; le canzoni scaricate nella
memoria interna; le app installate; i video salvati su una scheda di memoria.

## Livello 3: celle e indirizzi

Numero di celle N da un elenco di 31 valori tra 16 e 1 048 576 (potenze di due e numeri tondi). Quattro domande, un
quarto ciascuna:

- `ultimo`: "Una memoria ha N celle, con gli indirizzi che partono da 0. Qual è l'indirizzo dell'ultima cella?"
  Risposta N - 1; il distrattore N c'è sempre.
- `quante`: "Gli indirizzi delle celle di una memoria vanno da 0 a N - 1. Quante celle ha la memoria?" Risposta N; il
  distrattore N - 1 c'è sempre.
- `byte`: "Una memoria ha celle da 1 byte, con indirizzi da 0 a N - 1. Qual è la sua capacità in byte?" Risposta N.
  Distrattori: N - 1, 8N.
- `bit`: "Una memoria ha N celle da 1 byte. Quanti bit contiene in tutto?" Risposta 8N. Distrattori: N, 8(N - 1).

Esempi svolti: 256 celle, ultimo indirizzo 255; indirizzi da 0 a 3999, 4000 celle.

## Livello 4: capacità con i multipli

Quattro domande, un quarto ciascuna; k è uno tra 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64, 100, 128, 256, 512.

- `kib`: "Una memoria ha 1024k celle da 1 byte. Qual è la sua capacità in KiB?" Risposta k. Distrattore: il risultato
  della divisione per 1000, troncato.
- `mib`: "Una RAM ha una capacità di 1024k KiB. Quanti MiB sono?" Risposta k.
- `celle`: "Una memoria ha una capacità di k KiB e celle da 1 byte. Quante celle ha?" Risposta 1024k; il distrattore
  1000k c'è sempre.
- `file`: "{Una chiavetta USB, Un SSD, Una scheda di memoria, Un disco magnetico} ha una capacità di C GB. Quante foto
  (canzoni, presentazioni; quanti video) da S MB può contenere al massimo?" con C tra 4, 8, 16, 32, 64, 128, 256, 500
  e S tra 2 e 500, solo quando la divisione è esatta. Risposta 1000C : S. Distrattori: il conto con 1024, C per S.

Esempi svolti: $20\,\text{KiB}$ sono $20 \cdot 1024 = 20\,480$ celle; $32\,\text{GB}$ contengono
$32\,000 : 250 = 128$ video da $250\,\text{MB}$.

## Livello 5: la gerarchia delle memorie

La gerarchia della lezione, dall'alto: registri, cache, RAM, SSD, disco magnetico. Dall'alto in basso la velocità e il
costo per byte diminuiscono, la capacità aumenta. Sei criteri: dalla più veloce, dalla più lenta, dalla più costosa per
byte, dalla meno costosa, dalla più capiente, dalla meno capiente. Per la capacità si usano solo registri, cache, RAM e
disco magnetico.

- `ordine` (due terzi): "Metti in ordine queste memorie {criterio}: {tre o quattro memorie}." Le memorie sono elencate
  in un ordine che non è né la risposta né il suo contrario. Opzioni: l'ordine giusto, il contrario, l'ordine in cui
  sono elencate, un altro.
- `estremo` (un terzo): "Quale di queste memorie è la più veloce (la più lenta, costa di più per ogni byte, costa di
  meno, ha la capacità più grande, più piccola)?" Opzioni: quattro memorie.

Esempio: "Metti in ordine queste memorie dalla più lenta alla più veloce: RAM, cache, SSD." Risposta: SSD, RAM, cache.

## Esercizi da evitare

- Al livello 1 un compito che vale per due memorie ("perde il contenuto senza corrente" vale per RAM e cache).
- Al livello 5 SSD e disco magnetico confrontati per capacità.
- Al livello 4 una divisione con resto.

## Verifica

`scripts/exercises/checkers/memoria_storage.py` rilegge il testo. Al livello 1 riconosce il compito con i modelli di
questa specifica, riscritti in Python, e ne ricava la memoria; al livello 2 classifica ogni opzione come persa o
conservata e controlla che una sola sia quella chiesta; ai livelli 3 e 4 legge i numeri e rifà il conto con gli interi,
e controlla che i distrattori "sempre presenti" ci siano; al livello 5 ordina le memorie con la gerarchia e controlla
che le opzioni siano ordini delle memorie elencate, con il contrario tra le opzioni.

## Domande per la revisione

- Al livello 2 "il contenuto dell'accumulatore della CPU" e "i dati tenuti nella cache" sono tra le cose perse: sono
  troppo tecniche accanto al tema non salvato?
- Il livello 5 chiede anche il costo per byte: è un criterio che usate in classe?
