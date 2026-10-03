# Bus e periferiche

Generatore: `inf-bus-periferiche` (`src/lib/exercises/v2/generators/inf-bus-periferiche.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_bus_periferiche.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/16-inf-bus-periferiche.md`. Macchinario comune del capitolo:
`src/lib/exercises/v2/inf-architettura.ts` e `scripts/exercises/checkers/_inf_architettura.py`.

Cinque livelli. I primi due sono a scelta multipla, composti da pezzi intercambiabili; il terzo e il quarto sono di
conto, con risposta numerica e variante a scelta costruita da `params.distractors`; il quinto è per metà a scelta (una
memoria con l'unità) e per metà numerico.

## Nomi dei livelli

1. Ingresso o uscita
2. Quale bus e in quale verso
3. Dalle linee alle celle
4. Dalle celle alle linee
5. La memoria indirizzabile

## Regole comuni

- Celle da 1 byte. Multipli binari: $2^{10}\,\text{B} = 1\,\text{KiB}$, $2^{20}\,\text{B} = 1\,\text{MiB}$,
  $2^{30}\,\text{B} = 1\,\text{GiB}$, scritti nel testo quando servono.
- Numeri da 10 000 in su con lo spazio sottile; potenze `2^8`, `2^{16}`.

## Livello 1: ingresso o uscita

Opzioni fisse: Di ingresso, Di uscita, Di ingresso e di uscita, Non è una periferica; un quarto dei casi ciascuna.
"Usi {periferica} per {uso}. Che tipo di periferica è {periferica}?" Per quello che non è una periferica: "Mentre lavori
al computer, {componente} {che cosa fa}. Che tipo di periferica è {componente}?"

- Di ingresso (12, tre o quattro usi ciascuna): tastiera, mouse, microfono, webcam, scanner, lettore di codici a barre, sensore
  di impronte, tavoletta grafica, touchpad, ricevitore GPS, fotocamera del telefono, sensore di temperatura.
- Di uscita (8): monitor, stampante, altoparlanti, cuffie, proiettore, motorino della vibrazione, stampante 3D, spie
  luminose.
- Di ingresso e di uscita (8): schermo tattile, chiavetta USB, disco esterno, scheda di rete, cuffie con microfono,
  stampante multifunzione, scheda di memoria, visore per la realtà virtuale.
- Non è una periferica (4, quattro frasi ciascuno): processore, RAM, cache, bus dati.

Esempio: "Usi il microfono per registrare un messaggio vocale. Che tipo di periferica è il microfono?" Risposta: Di
ingresso. Distrattore tipico: Di uscita (l'avviso "Il verso si guarda dal computer").

## Livello 2: quale bus e in quale verso

Opzioni fisse: Bus dati, verso la CPU; Bus dati, dalla CPU; Bus indirizzi, dalla CPU; Bus di controllo, dalla CPU. Un
quarto dei casi ciascuna.

"La CPU legge la cella di indirizzo a, che contiene il numero v." oppure "La CPU scrive il numero v nella cella di
indirizzo a.", con a da 100 a 4000 e v da 0 a 255, diversi. Poi una domanda:

- "Su quale bus viaggia il numero a, e in quale verso?" Risposta: Bus indirizzi, dalla CPU.
- "Su quale bus viaggia il numero v, e in quale verso?" Risposta: Bus dati, verso la CPU in lettura, dalla CPU in
  scrittura.
- "Su quale bus viaggia il segnale che dice che è una lettura (scrittura), e in quale verso?" Risposta: Bus di
  controllo, dalla CPU.

Una parte delle domande sul bus dati usa una periferica: "La CPU legge dalla tastiera il codice del tasto premuto, che
è v." (tastiera, mouse, microfono, sensore di temperatura: verso la CPU) e "La CPU manda alla stampante il codice di un
carattere da stampare, che è v." (stampante, schermo, altoparlante: dalla CPU).

## Livello 3: dalle linee alle celle

Tre domande, un terzo ciascuna:

- `celle`: "Un bus indirizzi ha n linee. Quante celle di memoria può indirizzare al massimo?", n da 2 a 20. Risposta
  $2^n$. Distrattori: $2n$, $n^2$, $2^n - 1$.
- `ultimo`: "Qual è l'indirizzo più grande che può trasportare?" Risposta $2^n - 1$; il distrattore $2^n$ c'è sempre.
- `aggiunta`: "Un bus indirizzi con n linee può indirizzare $2^n$ celle. Quante celle può indirizzare se gli si
  aggiunge 1 linea (si aggiungono 2 linee)?", n da 3 a 16. Risposta $2^{n+1}$ o $2^{n+2}$. Distrattori: le celle più
  1 o più 2, le celle più $2^d$.

Esempi svolti: 10 linee, indirizzo più grande $2^{10} - 1 = 1023$; 3 linee, $2^3 = 8$ celle.

## Livello 4: dalle celle alle linee

"Una memoria ha N celle. Quante linee deve avere, come minimo, il bus indirizzi per indirizzarle tutte?" Risposta: il
più piccolo n con $2^n \geq N$. Quattro casi su dieci N è una potenza di due (da $2^3$ a $2^{20}$), gli altri un numero
tondo tra 20 e 1 000 000. Il distrattore n - 1 c'è sempre (arrotondare per difetto).

Esempi svolti: 2000 celle, $2^{10} = 1024$ non arriva e $2^{11} = 2048$ sì: 11 linee; 16 celle, $2^4 = 16$: 4 linee.

## Livello 5: la memoria indirizzabile

n da 10 a 39; $2^n\,\text{B} = 2^{n \bmod 10}$ KiB, MiB o GiB.

- `memoria` (metà): "Un bus indirizzi ha n linee, e le celle sono da 1 byte. Quanta memoria può indirizzare al massimo?"
  Risposta a scelta, con l'unità più grande possibile: per esempio $4\,\text{MiB}$ per 22 linee. Distrattori: lo stesso
  numero con un'altra unità, n con l'unità giusta ($22\,\text{MiB}$), il doppio o la metà.
- `linee` (metà): "Una memoria da k MiB ha celle da 1 byte. Quante linee deve avere il bus indirizzi per indirizzarle
  tutte?" con k potenza di due da 1 a 512. Risposta numerica n. Distrattori: solo l'esponente dell'unità (20 per i
  MiB), solo l'esponente di k.

## Esercizi da evitare

- Al livello 2 l'indirizzo uguale al contenuto.
- Al livello 1 un dispositivo che può essere di un tipo o dell'altro secondo il modello (un controller con la
  vibrazione, un monitor tattile): non sono nell'elenco.
- Al livello 5 una risposta con un numero da 1024 in su (va usata l'unità più grande).

## Verifica

`scripts/exercises/checkers/inf_bus_periferiche.py` rilegge il testo. Al livello 1 cerca il dispositivo nella tabella
di questa specifica, riscritta in Python; al livello 2 legge operazione, indirizzo e contenuto e decide il bus e il
verso dal numero chiesto; ai livelli 3 e 4 rifà i conti con le potenze di due intere e controlla i distrattori "sempre
presenti"; al livello 5 trasforma ogni opzione in byte e controlla che una sola valga $2^n$, scritta con l'unità più
grande, oppure ricava le linee dalla memoria data.

## Domande per la revisione

- Al livello 2 le quattro opzioni sono sempre le stesse: va bene, o dopo qualche esercizio diventa meccanico?
- Al livello 5 le linee arrivano a 39 (512 GiB): serve fermarsi a 32?
