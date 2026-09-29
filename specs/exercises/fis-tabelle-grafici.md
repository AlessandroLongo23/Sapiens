# Tabelle e grafici cartesiani

Generatore: `fis-tabelle-grafici` (`src/lib/exercises/v2/generators/fis-tabelle-grafici.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_tabelle_grafici.py` (con `_fis_grafici.py`, condiviso dai tre generatori del gruppo).
Lezione collegata: `docs/lezioni/fisica/riscritte/10-fis-tabelle-grafici.md` (note in
`docs/lezioni/fisica/note/10-fis-tabelle-grafici.md`). Pezzi comuni in `src/lib/exercises/v2/grafici.ts`.

Quattro livelli. I livelli 1, 3 e 4 hanno un grafico: la scena `grafico-dati`
(`src/components/content/exercises/scenes/GraficoDati.tsx`), un foglio a quadretti con gli assi, i nomi, le unità, i
numeri ogni due quadretti e i punti (al livello 3 anche la retta). La scena disegna i dati e mai la risposta.

## Tipi di risposta

Tutte le risposte sono a scelta multipla (`answer.kind = 'choice'`) con quattro opzioni, come chiede il README di
fisica per le risposte con unità: il numero con la sua unità, `8\ \text{cm}`, `0{,}5\ \text{min}`; al livello 4 la
riga della tabella, `m = 100\ \text{g}`. `values` è `[valore esatto, unità]` (o l'indice della riga).

## Regole comuni

- Cinque esperimenti della lezione: allungamento della molla in funzione della massa; lunghezza della molla; acqua sul
  fornello (temperatura e tempo); carrello su una rotaia (posizione e tempo); candela accesa (altezza e tempo, una
  retta che scende).
- Tutto parte da una retta sul foglio a quadretti: $y = q + d \cdot x$ in quadretti, con $d = 1$ (o $-1$ per la
  candela), e un valore per quadretto su ogni asse ($10$, $20$, $25$ g; $0{,}5$ o $1$ cm; $2$ o $5$ °C...). Così ogni
  punto e ogni lettura cadono su un incrocio della griglia e il valore è esatto.
- I punti misurati sono ogni due quadretti (da $x = 0$ per i tempi, dal primo pesetto per le masse).
- Le misure delle tabelle (livelli 2 e 4) hanno un errore di al più un quinto di quadretto, con le cifre che ne
  vengono ($2{,}1$ cm, $24{,}4$ °C), come la tabella della molla nella lezione.
- Valori scritti con i decimali del passo e gli zeri finali ($5{,}0$ s), virgola `{,}`, unità dritte dopo lo spazio.
- Niente trattini lunghi né "piuttosto che" (il `check()` lo controlla).

## Livello 1: leggere un punto del grafico

Il grafico con i punti misurati; metà delle volte si chiede $y$ di un punto dato il suo $x$, metà $x$ dato $y$.

- "Il grafico mostra l'allungamento $\Delta l$ di una molla in funzione della massa $m$ appesa. Quanto vale
  $\Delta l$ nel punto misurato con $m$ uguale a $200$ g?" Risposta $8$ cm; distrattori $6$ e $10$ cm (i punti
  vicini), $200$ cm (l'altra coordinata).
- "Il grafico mostra la posizione $s$ di un carrello su una rotaia in funzione del tempo $t$. Per quale valore di $t$
  è stato misurato $s$ uguale a $140$ cm?" Risposta $10$ s; distrattori $8$ e $11$ s, $140$ s.

Distrattori: i quadretti contati al posto del valore (l'avviso "Leggere i quadretti al posto dei valori"), il punto
vicino, l'altra coordinata con l'unità sbagliata.

## Livello 2: scegliere la scala di un asse

Una tabella di misure e il numero di quadretti disponibili su un asse (da $8$ a $20$). La risposta è il passo $1$, $2$
o $5$ per una potenza di $10$ più piccolo che fa stare il valore più grande, come nell'esempio 2 della lezione. Asse
verticale o orizzontale, metà ciascuno.

- Molla, $9$ quadretti per $\Delta l$, valore più grande $10{,}2$ cm: risposta $2$ cm; distrattori $1$ cm (non ci
  sta), $5$ cm (spreca metà foglio), $1{,}2$ cm (riempie il foglio ma è un passo scomodo).
- Carrello, $19$ quadretti per $t$, fino a $10$ s: risposta $1$ s; distrattori $0{,}5$ s, $2$ s, $0{,}53$ s.

Distrattori: il passo comodo più piccolo, che non fa stare i dati; il passo comodo più grande; il valore più grande
diviso per i quadretti, arrotondato a due cifre (esatto ma scomodo), o un passo ancora più grande.

## Livello 3: leggere tra i punti sulla retta

Il grafico con i punti e la retta che passa tra loro; si chiede il valore sulla retta a metà tra due punti misurati
(un quadretto dispari), metà $y$ dato $x$ e metà $x$ dato $y$.

- Molla: "Leggi sulla retta quanto vale $\Delta l$ quando $m$ vale $175$ g." Risposta $7$ cm; distrattori $6$ e
  $8$ cm (i punti misurati ai lati), $9$ cm.
- Carrello: "Leggi sulla retta per quale valore di $t$ si ha $s$ uguale a $130$ cm." Risposta $9$ s; distrattori $8$,
  $10$ e $11$ s.

Distrattori: i due punti misurati accanto, i quadretti contati, la proporzione con il primo punto quando la retta non
passa per l'origine (il "costringere la retta per l'origine" della lezione 11).

## Livello 4: la misura da rifare

Una tabella e il grafico dei suoi punti: tutti vicini a una retta tranne uno, spostato di $2$ o $3$ quadretti in su o
in giù. Le opzioni sono quattro righe (mai quella con $x = 0$).

- Molla: $50$ g $2{,}0$ cm, $100$ g $6{,}0$ cm, $150$ g $6{,}2$ cm, $200$ g $8{,}0$ cm, $250$ g $10{,}2$ cm. Risposta
  $m = 100$ g.
- Carrello: $0$ s $42$ cm, $2$ s $62$ cm, $4$ s $82$ cm, $6$ s $72$ cm, $8$ s $120$ cm, $10$ s $138$ cm. Risposta
  $t = 6$ s.

## Esercizi da evitare

- Un punto o una lettura che non cade su un incrocio della griglia (non si leggerebbe esatto).
- Al livello 3 una lettura su un punto misurato (sarebbe il livello 1).
- Al livello 2 due passi comodi che fanno stare i dati entrambi "giusti": la risposta è solo il più piccolo.
- Un'opzione zero o negativa, due opzioni uguali.

## Verifica

`scripts/exercises/checkers/fis_tabelle_grafici.py` rilegge testo, tabella e scena: al livello 1 il punto chiesto
deve essere nella scena, su un incrocio, e la risposta è l'altra coordinata; al livello 2 ricalcola il passo dalla
tabella e dal numero di quadretti e controlla che ogni distrattore sia davvero sbagliato (non ci sta, è più grande, o
non è un passo comodo); al livello 3 legge la retta della scena, controlla che i punti ci stiano sopra e che la
lettura sia tra due punti e su un incrocio; al livello 4 per ogni riga fa la retta dei minimi quadrati con le altre e
cerca l'unica riga lontana (più di cinque volte lo scarto degli altri e almeno un quadretto), e controlla che la scena
mostri i punti della tabella. Poi le opzioni: quattro, diverse, quella giusta una volta sola, scritta con i decimali
del passo e la sua unità.

Esito: `sample.mts fis-tabelle-grafici 1000 all` con i seed 1, 50001 e 777001, 4000 esercizi ciascuno, PASS. Quote
dei casi (metà $x$, metà $y$) nei limiti. `review.mts` esce con 0, `width.mts` con 0 (problema al massimo 162 px,
opzioni al massimo 91 px).

Errori piantati, su 30 esercizi per livello: 750 su 810 bocciati; i 60 non bocciati sono cambi di un numero della
tabella del livello 2 che non toccano il valore più grande, quindi non cambiano la risposta (non sono errori). Tra i
bocciati, 30 su 30 con il numero di quadretti triplicato al livello 2. Gli altri errori: opzione giusta spostata,
opzione duplicata, valore o unità dell'opzione giusta cambiati, un dato del testo cambiato, un punto della scena
spostato di mezzo quadretto, la retta della scena cambiata.

Esercizi diversi su 1.000 (seed da 1): livello 1 551, livello 2 1000, livello 3 532, livello 4 999.

## Nomi dei livelli

1. Leggere un punto del grafico
2. Scegliere la scala di un asse
3. Leggere tra i punti sulla retta
4. La misura da rifare

## Domande per la revisione

- Livello 2: la regola "il passo comodo più piccolo che fa stare i dati" è quella della lezione. Un insegnante può
  accettare anche il passo successivo, se il foglio è grande: va bene considerarlo sbagliato?
- Livello 2: il passo $2{,}5$ (comune su alcuni libri) non è tra i passi comodi. Aggiungerlo?
- Livello 4: il punto sbagliato è spostato di $2$ o $3$ quadretti e si vede a occhio. Va reso più difficile, con uno
  spostamento più piccolo e le barre di incertezza?
- Manca un livello sull'estrapolazione (la lezione ne parla con cautela): serve?
