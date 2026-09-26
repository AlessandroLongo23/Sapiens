# Dati, frequenze e grafici

Generatore: `statistica-dati` (`src/lib/exercises/v2/generators/statistica-dati.ts`). Verifica
indipendente: `scripts/exercises/checkers/statistica_dati.py`. Lezione collegata: "Dati, frequenze e
grafici" (`docs/lezioni/riscritte/55-statistica-dati.md`), con la sezione "Per il generatore" della
sua nota.

Lo studente riconosce popolazione, campione, unità statistica e carattere di un'indagine, classifica
un carattere, conta frequenze assolute, relative e percentuali da un elenco, legge le frequenze
cumulate di una tabella, conta i dati di una classe $a \vdash b$ e passa dalle frequenze agli angoli
dell'aerogramma e ritorno. Media, mediana e moda restano ai generatori delle lezioni 56 e 57.

## Rappresentazione

- Niente figure. I grafici entrano solo con i loro numeri: le frequenze da cui si disegna
  l'aerogramma (livello 6) o gli angoli dei suoi settori (livello 7). Ortogramma e istogramma non
  hanno un livello: chiederebbero di leggere un disegno (vedi le domande per la revisione).
- Il testo è prosa con `textBlock` (righe di circa 46 caratteri, numeri tra dollari come nella
  lezione: $1$, $0$, $2$). La pagina la mostra come un paragrafo, che va a capo da solo.
- Le tabelle (livelli 4, 6, 7) sono un `array` di due colonne in verticale, come nella lezione:
  `\begin{array}{l|c} \text{Voto} & f_a \\ \hline 4 & 3 \\ … \\ \hline \text{Totale} & 20 \end{array}`.
  Stanno tra la prosa che le introduce e la domanda, dentro l'`array{l}` del problema; la pagina le
  mostra come una formula sola. Nei livelli 4 e 6 la riga "Totale" c'è sempre; nel livello 7 no
  (gli angoli, e $N$ è nel testo).
- Notazione della lezione: $N$ numero dei dati, $f_a$, $f_r$, percentuali con `\%`, classi
  `a \vdash b`, angoli `126^\circ`, virgola decimale `0{,}45`, `\cdot`, `\dfrac`.
- `params.case` dice il caso di cui la verifica controlla la quota; `params.unit` il tipo di numero
  della risposta (`count`, `rel`, `pct`, `deg`); `params.mistakes` gli errori da cui nascono i
  distrattori; `params.step` il passo dei distrattori di riserva.

## Regole comuni

- Si parte dalle frequenze: il generatore sceglie $N$ e le frequenze (o le percentuali), poi scrive
  l'elenco, la tabella o gli angoli. Così ogni conteggio è intero, ogni percentuale e ogni angolo sono
  esatti, e nessun arrotondamento entra nelle risposte.
- Le percentuali delle risposte sono intere; le frequenze relative hanno al massimo due decimali.
- Le domande che hanno bisogno di un numero ($k$, una modalità numerica, una classe) stanno
  nell'ultima frase del testo; la consegna (`prompt`) è una frase fissa per livello, senza formule.

## Livello 1: popolazione, campione, unità e carattere

Dodici indagini scritte come l'esempio della lezione (una scuola, un comune, una fabbrica di
lampadine, una palestra, una biblioteca, un concessionario, i lavoratori di una città, un frutteto,
un cinema, un'azienda, un ospedale, un supermercato). La popolazione ha $P$ elementi
($P$ tra $600$ e $5000$), il campione $n$ ($n$ tra $40$ e $300$, al massimo un quinto di $P$). La
consegna chiede uno dei quattro ruoli, un quarto ciascuno; le quattro opzioni sono le quattro
risposte dell'indagine, mescolate. È la scelta più naturale: ogni opzione sbagliata è la risposta a
un'altra delle quattro domande, cioè proprio lo scambio che lo studente rischia.

Esempio 1. "Un cinema ha avuto 600 spettatori in un mese e vuole sapere che giudizio danno ai film.
Consegna un questionario a 60 spettatori scelti a caso." Qual è la popolazione? Risposta: i 600
spettatori del mese (distrattori: i 60 spettatori scelti, ogni spettatore del mese, il giudizio sui
film).

Esempio 2. "Un concessionario ha venduto 600 automobili in un anno e vuole sapere di che colore
erano. Controlla 40 automobili scelte a caso tra quelle vendute." Qual è l'unità statistica?
Risposta: ogni automobile venduta.

## Livello 2: il tipo di carattere

"Su ogni studente di una classe si osserva il numero di fratelli. Che tipo di carattere è?" Quattro
risposte, un quarto ciascuna, sempre nello stesso ordine: qualitativo senza ordine, qualitativo con
un ordine, quantitativo discreto, quantitativo continuo. Sono le quattro categorie della lezione
(che chiama "qualitativo, con un ordine" il giudizio di una verifica). Un elenco di 103 coppie
popolazione e carattere su dieci popolazioni (studenti, famiglie, automobili, giorni di un mese,
calciatori, pazienti, libri, smartphone, abitanti, clienti di un albergo). I caratteri con un ordine
dicono le loro modalità tra parentesi (insufficiente, sufficiente, buono, ottimo), così l'ordine si
vede. Tra i qualitativi senza ordine ci sono nove numeri che non sono quantità (CAP, numero di maglia,
numero di cellulare, targa, codice ISBN, prefisso, numero della camera), l'avviso "Un numero non è
sempre una quantità" della lezione; per loro i passaggi lo dicono.

Esempio 1. Su ogni paziente di un pronto soccorso si osserva la pressione del sangue: quantitativo
continuo (si misura).

Esempio 2. Su ogni calciatore di un campionato si osserva il numero di maglia: qualitativo senza
ordine (si scrive con cifre, ma i conti non significano niente).

## Livello 3: frequenze da un elenco di dati

Un elenco di $N = 20$ o $25$ dati, da 3 a 5 modalità, ognuna almeno 2 volte. Otto caratteri:
numero di fratelli, gol in una partita, libri letti, voti (da 4 a 8), animali in casa (numerici,
modalità consecutive), sport, mezzo di trasporto, gusto di gelato (parole). Si chiede, un terzo
ciascuna, la frequenza assoluta, la relativa (decimale con la virgola) o la percentuale di una
modalità.

Esempio 1. I voti di 20 studenti: $4, 6, 5, 5, 5, 5, 6, 4, 5, 5, 6, 6, 5, 5, 4, 4, 4, 4, 6, 6$.
Frequenza percentuale di $5$: $f_a = 8$, controllo $6 + 8 + 6 = 20$, $f_r = \frac{8}{20} = 0{,}4$,
cioè $40\%$.

Esempio 2. Il gusto preferito di 25 clienti, con pistacchio 13 volte: $f_r = \frac{13}{25} = 0{,}52$.

## Livello 4: frequenze cumulate

Una tabella di un carattere quantitativo discreto (fratelli, voti da 4 a 9, gol, libri, figli per
famiglia), ogni modalità almeno una volta, $N = 20, 25, 40$ o $50$, con il totale. La domanda, un terzo
ciascuna: "al massimo $k$" (cumulata di $k$), "meno di $k$" (cumulata di $k - 1$), "almeno $k$"
($N$ meno la cumulata di $k - 1$). La risposta somma sempre almeno due modalità e mai tutte. Circa una
volta su quattro la domanda chiede la percentuale ("Che percentuale degli studenti ha…"), solo con $N$
che divide $100$.

Esempio 1. Gol in 20 partite: $0 \to 4$, $1 \to 2$, $2 \to 4$, $3 \to 3$, $4 \to 2$, $5 \to 5$. "In
quante partite la squadra ha segnato al massimo 4 gol?" Cumulata di 4: $4 + 2 + 4 + 3 + 2 = 15$.

Esempio 2. Libri letti da 20 studenti: $0 \to 4$, $1 \to 4$, $2 \to 5$, $3 \to 5$, $4 \to 2$. "Che
percentuale degli studenti ha letto meno di 4 libri?" Cumulata di 3: $18$, $\frac{18}{20} \cdot 100 = 90\%$.

## Livello 5: dati raggruppati in classi

Un elenco di $N = 20$ o $25$ valori interi (altezze in cm, pesi in kg, minuti per arrivare a scuola,
punteggi di un test, battiti al minuto) e quattro classi $a \vdash b$ consecutive della stessa ampiezza
(10, o 15 per i punteggi), ognuna con almeno 3 valori. La classe chiesta non è l'ultima; nell'elenco
c'è sempre un valore uguale al suo estremo $a$ (che si conta) e uno uguale a $b$ (che va nella classe
dopo), l'avviso "Il dato sul confine" della lezione. Si chiede la frequenza assoluta (3 volte su 5) o
la percentuale (2 su 5) della classe.

Esempio 1. Battiti di 25 persone, classi $55 \vdash 65$, $65 \vdash 75$, $75 \vdash 85$, $85 \vdash 95$;
nella classe $75 \vdash 85$ ci sono $75, 75, 77, 77, 81, 82, 84, 84$: $f_a = 8$; l'$85$ (due volte) va
in $85 \vdash 95$.

Esempio 2. Minuti di 20 studenti; classe $25 \vdash 35$ con $25, 26, 28, 29, 31, 31$: $f_a = 6$, cioè
$\frac{6}{20} \cdot 100 = 30\%$.

## Livello 6: gli angoli dell'aerogramma

Una tabella di un carattere qualitativo (sport, mezzo, gusto, genere musicale, animale di casa) con
3-5 modalità. Metà delle volte frequenze assolute con $N$ divisore di $360$ ($20, 24, 30, 36, 40, 45,
60, 72, 90, 120$) e il metodo "ogni dato vale $\frac{360^\circ}{N}$"; metà percentuali multiple di $5$ e
$\alpha = f_r \cdot 360^\circ$. L'angolo è intero e diverso dalla frequenza e dalla percentuale della
modalità (altrimenti il distrattore principale coinciderebbe con la risposta).

Esempio 1. Genere preferito di 24 ragazzi: rock 8, jazz 6, classica 10. Ogni dato vale $15^\circ$,
la classica ha $10 \cdot 15^\circ = 150^\circ$.

Esempio 2. Gusto in percentuale: fragola $35\%$, pistacchio $35\%$, nocciola $30\%$. Pistacchio:
$0{,}35 \cdot 360^\circ = 126^\circ$ (distrattore: $35^\circ$).

## Livello 7: dall'aerogramma alle frequenze

Gli angoli dei settori in una tabella e $N$ nel testo (l'esempio 5 della lezione). Metà delle volte si
chiede quanti dati ci sono in un settore ($\frac{\alpha}{360} \cdot N$), metà la percentuale
($\frac{\alpha}{360} \cdot 100$). $N$ è un divisore di $360$ oppure $200$ o $300$ (con frequenze
multiple di 5); per la percentuale le percentuali sono multiple di 5 e $N$ è un multiplo di 20. Gli
angoli sono interi e sommano a $360^\circ$; la risposta non è mai uguale all'angolo.

Esempio 1. Genere di 24 ragazzi con angoli $120^\circ$, $90^\circ$, $150^\circ$: nel settore della
classica ci sono $\frac{150}{360} \cdot 24 = 10$ ragazzi.

Esempio 2. Animale di casa di 40 famiglie, il cane ha $72^\circ$: $\frac{72}{360} \cdot 100 = 20\%$.

## Da evitare

- Frequenze che non tornano: ogni tabella ha il totale giusto, ogni elenco ha $N$ dati.
- Percentuali o angoli con la virgola nelle risposte (la lezione arrotonda a un decimale nell'esempio
  delle altezze; qui non si chiede di arrotondare, vedi le domande).
- Cumulate con modalità senza ordine: il livello 4 usa solo caratteri numerici.
- Domande banali: "al massimo" l'ultima modalità (è $N$), "almeno" la prima.
- Caratteri ambigui al livello 2 (l'età in anni, il reddito, le stelle di un albergo, il mese di
  nascita): tolti dall'elenco.

## Variante a scelta multipla

Livelli 1 e 2: la risposta è già a scelta multipla (i quattro ruoli, i quattro tipi). Livelli 3-7:
quattro opzioni, il valore giusto più i primi errori distinti e validi di questo elenco, poi i vicini
(più o meno un passo: un dato, $\frac{100}{N}\%$, $\frac{360^\circ}{N}$, $18^\circ$ o $5\%$).

- Livello 3: assoluta $f_a \pm 1$, $f_a + 2$ (un dato contato male); relativa $\frac{f_a}{100}$ (divide
  per 100 invece che per $N$), $\frac{f_a \pm 1}{N}$; percentuale $f_a\%$ (non divide per $N$),
  $\frac{f_a \pm 1}{N} \cdot 100$.
- Livello 4: il confine preso o lasciato (cumulata di $k - 1$ invece che di $k$, e viceversa), la sola
  frequenza di $k$, il complementare; per la percentuale anche il conteggio al posto della
  percentuale.
- Livello 5: la classe letta come $]a, b]$, come $[a, b]$, come $]a, b[$; per la percentuale anche il
  conteggio.
- Livello 6: la frequenza o la percentuale scritte come angolo (l'avviso "L'angolo non è la
  percentuale"), metà dell'angolo (mezzo cerchio al posto del cerchio intero), $\frac{360^\circ}{k}$
  (settori uguali).
- Livello 7: l'angolo letto come risposta, la percentuale al posto del conteggio (o il conteggio al
  posto della percentuale), $\frac{\alpha \cdot N}{100}$, $\frac{N}{k}$ o $\frac{100}{k}$.

Le opzioni stanno nel formato della risposta: $7$, $0{,}45$, $45\%$, $126^\circ$.

## Verifica

`statistica_dati.py` rilegge tutto dal testo che vede lo studente: le frasi dei quattro ruoli
(livello 1) dalla sua tabella delle dodici indagini; il tipo del carattere (livello 2) dal suo elenco;
l'elenco dei dati, le classi e la domanda dalla prosa (livelli 3 e 5); le tabelle dal LaTeX (livelli
4, 6, 7). Ricalcola la risposta con razionali esatti, controlla i vincoli di questa specifica e la
variante a scelta multipla (quattro opzioni distinte, ognuna scritta come il suo valore, una sola
uguale alla risposta, quella indicata da `correct`).

Esito, 1.000 esercizi per livello: PASS con il seed 1 e con il seed 7001. Quote dei casi dentro gli
intervalli di `CASE_RANGES`.

Esercizi diversi su 1.000 (seed 1): livello 1: 887; livello 2: 103 (è l'intero elenco dei caratteri:
per averne di più servono caratteri nuovi, non numeri); livelli 3-7: da 999 a 1.000.

Errori piantati a mano, tutti bocciati: risposta cambiata (livello 3); opzione giusta sbagliata
(livello 6); ruolo sbagliato (livello 1); tipo di carattere sbagliato (livello 2); totale della tabella
sbagliato (livello 4); angoli che non sommano a $360^\circ$ (livello 7); opzione scritta con un valore
diverso dal suo (livello 3); nessun dato sul confine $b$ (livello 5); classe letta come $]a, b]$
(livello 5); angolo uguale alla frequenza (livello 6); opzioni doppie (livello 4); elenco del testo
diverso da `params` (livello 3).

Larghezza (`width.mts`): 0 formule oltre 350 px e 0 opzioni oltre 252 px; la tabella più larga misura
236 px (livello 6), l'opzione più larga 227 px (livello 1, le frasi dei quattro ruoli).

## Domande per la revisione

- Il livello 2 ha 103 caratteri in tutto. Alcune classificazioni sono discutibili e vanno guardate:
  la pressione del sangue e il tempo passato al telefono come continui; il numero della camera come
  qualitativo; la classe energetica (A, B, C, D, E) e la taglia (S, M, L, XL) come qualitativi con un
  ordine. L'età in anni e il reddito sono stati tolti perché i libri non sono d'accordo.
- Le percentuali arrotondate a un decimale (l'esempio delle 30 altezze) non ci sono: tutte le risposte
  sono esatte. Serve un livello con l'arrotondamento, o basta la lezione?
- Ortogramma e istogramma non hanno esercizi: senza figura resterebbe solo "quale grafico per quale
  dato" (la tabella finale della lezione), che si può aggiungere come domanda a scelta multipla. I
  livelli 6 e 7 vorrebbero la figura dell'aerogramma: il livello 7 in particolare, dove oggi gli
  angoli stanno in una tabella invece che sul disegno.
- Livello 1: "il mezzo di trasporto" e "gli allenamenti a settimana" come nome del carattere sono
  brevi per stare nel bottone del telefono; la lezione dice "quanti arrivano in autobus".
