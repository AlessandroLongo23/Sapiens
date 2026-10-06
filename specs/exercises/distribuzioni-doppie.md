# Distribuzioni doppie

Generatore: `distribuzioni-doppie` (`src/lib/exercises/v2/generators/distribuzioni-doppie.ts`), con il
modulo comune del capitolo `src/lib/exercises/v2/bivariata.ts`. Verifica indipendente:
`scripts/exercises/checkers/distribuzioni_doppie.py`, con `_bivariata.py`. Lezione collegata:
"Distribuzioni doppie" (`docs/lezioni/riscritte/128-distribuzioni-doppie.md`).

Lo studente legge una tabella a doppia entrata: trova un totale marginale, una percentuale sul totale,
una percentuale condizionata, una media condizionata, una frequenza teorica di indipendenza e una
contingenza. I sei livelli seguono l'ordine della lezione e ognuno aggiunge una sola difficoltà.

## Costruzione

La tabella ha sempre due righe e due o tre colonne (tre colonne sei volte su dieci). Si estrae la
tabella e si tiene solo se il numero chiesto dal livello viene come il livello lo vuole (esatto, con
pochi decimali, del segno giusto); il caso con una quota fissata si estrae una volta, prima dei
tentativi. Le storie sono tre, con le modalità scritte nella tabella così come compaiono nella domanda:

| storia | righe | colonne |
|---|---|---|
| dove abitano e come vengono a scuola | centro, periferia | a piedi, autobus, moto |
| la meta della gita di due classi | 3A, 3B | mare, monti, lago |
| il torneo di istituto | biennio, triennio | calcio, basket, nuoto |

Con due colonne se ne toglie una a caso delle tre. Il livello 4 ha una tabella sua (righe: ore di
studio oppure classi; colonne: quattro voti consecutivi).

## Convenzioni

- Quelle della lezione: frequenza congiunta, totali di riga e di colonna, $n$ per il totale; frequenza
  teorica $\dfrac{r_i \cdot c_j}{n}$; contingenza uguale a frequenza osservata meno frequenza teorica.
- La tabella è un `array` con la riga e la colonna dei totali, intestate "tot."; al livello 1 i totali
  non ci sono. Con tre colonne e i totali la tabella è in `\small`, e $n$ non arriva a 100: così sta
  nei 350 px del telefono.
- Le percentuali si scrivono con il segno `\%`; la risposta `number` è il numero della percentuale
  ($26$ per $26\%$).
- Virgola decimale `{,}`. Un valore esatto si scrive senza zeri in coda. Un valore arrotondato ha
  sempre la consegna "Arrotonda al decimo.", una cifra dopo la virgola e il segno $\approx$ nella
  soluzione. L'arrotondamento è per eccesso da 5 in su.
- La domanda specifica sta nella consegna (`prompt`); il problema è la storia con la tabella.
- Tutti i livelli hanno risposta `number` e la variante a scelta multipla con quattro opzioni diverse
  nel testo e nel valore, costruita da `params.mistakes`; quando gli errori non bastano si aggiungono i
  vicini nell'ultima cifra mostrata.

## Livello 1: totali marginali

Tabella senza totali, caselle da 2 a 18 tutte diverse, totali di riga e di colonna tutti diversi tra
loro. "Quanti studenti in tutto abitano in periferia?": la risposta è il totale di una riga (metà dei
casi) o di una colonna.

Distrattori: il totale generale $n$; un totale dell'altro carattere; la casella più grande della riga
o colonna chiesta; il totale di un'altra riga o colonna dello stesso carattere.

Esempi: centro $13, 10, 8$ e periferia $9, 6, 11$, "abitano in periferia" → $9 + 6 + 11 = 26$
(opzioni $57, 11, 22, 26$); 3A $11, 9$ e 3B $15, 6$, "sono della 3B" → $21$.

## Livello 2: percentuale sul totale

Tabella con i totali, $n$ tra 20, 25, 40, 50, 100, così la percentuale è esatta con al massimo un
decimale. "Che percentuale di tutti gli studenti abita in periferia e viene a scuola in moto?": la
frequenza congiunta divisa per $n$. Si scarta il caso in cui la percentuale è uguale alla frequenza
($n = 100$ con quella casella).

Distrattori: la frequenza divisa per il totale di riga e per il totale di colonna (arrotondate al
decimo: l'avviso "una casella, tre percentuali" della lezione); la frequenza assoluta letta come
percentuale.

Esempi: (periferia, moto) $= 4$ su $n = 20$ → $20\%$ (opzioni $50\%$, $44{,}4\%$, $20\%$, $4\%$);
(3A, monti) $= 6$ su $n = 20$ → $30\%$.

## Livello 3: percentuale condizionata

Stessa tabella del livello 2. "Tra chi viene a scuola in moto, che percentuale abita in periferia?":
si divide per il totale della riga o della colonna di cui parla la prima parte della domanda (almeno
8 unità, e la percentuale non è $100\%$). Due casi: esatta con al massimo un decimale (60%);
arrotondata al decimo, quando il quoziente ha più di un decimale (40%), e solo allora la consegna
aggiunge "Arrotonda al decimo.".

Distrattori: la frequenza divisa per $n$; la frequenza divisa per il totale dell'altro carattere; la
frequenza assoluta letta come percentuale.

Esempi: con (centro, autobus) $= 9$ e riga centro $= 30$, "Tra chi abita in centro, che percentuale
viene a scuola in autobus?" → $30\%$; con (periferia, autobus) $= 13$ e colonna autobus $= 22$,
"Tra chi viene a scuola in autobus, che percentuale abita in periferia? Arrotonda al decimo." →
$\approx 59{,}1\%$.

## Livello 4: media condizionata

Tabella con due righe (ore di studio "1 ora", "2 ore", "3 ore", due delle tre; oppure le classi 3A e
3B), quattro voti consecutivi che partono da 4, 5 o 6, e il totale di ogni riga, diverso nelle due
righe e scelto tra 5, 8, 10, 20. Ogni riga ha almeno tre voti con frequenza non nulla e nessuna
frequenza oltre 9. "Calcola il voto medio di chi studia 2 ore al giorno.": media ponderata della riga,
esatta con al massimo due decimali; le due righe hanno medie diverse.

Distrattori: la media di tutte le unità; la somma della riga divisa per il totale generale; la media
dei quattro voti senza le frequenze; la media dell'altra riga.

Esempi: voti $6, 7, 8, 9$, riga "3 ore" $1, 1, 1, 2$ (totale 5) → $\dfrac{39}{5} = 7{,}8$; voti
$4, 5, 6, 7$, riga "1 ora" $6, 0, 3, 1$ (totale 10) → $4{,}9$.

## Livello 5: frequenza teorica

Tabella con i totali, $n$ tra 20, 25, 30, 40, 50, 60, 80, 100. "Calcola la frequenza teorica di
indipendenza della casella (3A, lago).": totale di riga per totale di colonna diviso $n$, intera (40%)
o con la virgola (60%), con al massimo due decimali e sempre diversa dalla frequenza osservata.

Distrattori: la frequenza osservata; la frequenza teorica arrotondata all'intero (l'avviso della
lezione); il totale di colonna; il totale di riga.

Esempi: riga 3A $= 30$, colonna lago $= 15$, $n = 50$ → $9$ (osservata $8$); riga centro $= 30$,
colonna a piedi $= 16$, $n = 50$ → $9{,}6$.

## Livello 6: contingenza

"Calcola la contingenza della casella (3B, lago).": frequenza osservata meno frequenza teorica, con al
massimo due decimali. Tre casi: positiva (40%), negativa (40%), zero (20%). Nel caso zero la tabella è
indipendente (due righe proporzionali, con $n$ da 15 a 100); negli altri $n$ è come al livello 5.

Distrattori: la contingenza con il segno scambiato (teorica meno osservata); la frequenza teorica; la
frequenza osservata.

Esempi: (3B, lago) osservata $13$, teorica $\dfrac{16 \cdot 31}{40} = 12{,}4$ → $0{,}6$; (centro,
autobus) osservata $9$, teorica $13{,}2$ → $-4{,}2$.

## Esercizi da evitare

- Tabelle con una casella vuota, o con le due righe dello stesso totale.
- Percentuali con più di un decimale presentate come esatte; percentuali condizionate su gruppi di
  meno di 8 unità.
- Frequenze teoriche periodiche o con più di due decimali.
- Una frequenza teorica uguale a quella osservata al livello 5 (la risposta si leggerebbe nella tabella).
- Tabelle più larghe di 350 px: tre colonne con totali a tre cifre.

## Risposta aperta

Tutti e sei i livelli hanno risposta numerica: proposti come `V` (il valore). Per le percentuali il
valore è il numero senza il segno; per la contingenza conta il segno.
