# Livelli e sottolivelli di energia

Generatore: `chim-livelli-energia` (`src/lib/exercises/v2/generators/chim-livelli-energia.ts`, con
`src/lib/exercises/v2/chim3-a.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_livelli_energia.py` (con
`_chim3_a.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/50-chim-livelli-energia.md`. Percorso nel database:
`high_school/chemistry/chim-struttura-elettronica/chim-livelli-energia`.

Cinque livelli, ognuno con una difficoltà in più. I livelli 1 e 3 hanno per risposta un numero intero e vanno anche a
risposta aperta; gli altri sono a scelta multipla, quattro opzioni.

## Dati

Energie di ionizzazione successive in $\text{kJ/mol}$, arrotondate all'unità, degli elementi con al massimo cinque
elettroni nel livello esterno tra i primi venti (gli altri darebbero elenchi troppo lunghi). Sono quelle della lezione
e della sua figura interattiva (`IONIZATION` in `chim3-a.ts`); la prima di ogni riga coincide con
`src/lib/tools/elementi.json` entro $1\,\text{kJ/mol}$. Da verificare su una fonte (vedi le note della lezione 50).

| Elemento | Energie successive |
|---|---|
| Li | 520, 7298, 11815 |
| Be | 900, 1757, 14849, 21007 |
| B | 801, 2427, 3660, 25026, 32827 |
| C | 1086, 2353, 4620, 6223, 37831, 47277 |
| N | 1402, 2856, 4578, 7475, 9445, 53267, 64360 |
| Na | 496, 4562, 6910, 9543, 13354, 16613, 20117, 25496 |
| Mg | 738, 1451, 7733, 10543, 13630, 18020, 21711, 25661 |
| Al | 578, 1817, 2745, 11577, 14842, 18379, 23326, 27465 |
| Si | 786, 1577, 3232, 4356, 16091, 19805, 23780, 29287 |
| P | 1012, 1907, 2914, 4964, 6274, 21267, 25431, 29872 |
| K | 419, 3052, 4420, 5877, 7975, 9590, 11343, 14944 |
| Ca | 590, 1145, 4912, 6491, 8153, 10496, 12270, 14206 |

Nel testo i numeri da $10\,000$ in su hanno lo spazio delle migliaia. Si mostrano sempre almeno due energie dopo il
salto, e il salto è il rapporto più grande tra un'energia e la precedente, almeno $1{,}3$ volte ogni altro rapporto
dell'elenco (per l'alluminio $4{,}2$ contro $3{,}1$).

## Nomi dei livelli

1. Il salto nelle energie di ionizzazione
2. Dalle energie all'elemento
3. Quanti elettroni in un livello
4. Sottolivelli e ordine di energia
5. Gli elettroni nei livelli

## Livello 1: il salto nelle energie di ionizzazione

Le prime energie di ionizzazione di un elemento senza nome (due o tre dopo il salto), e si chiede quanti elettroni ha
nel livello più esterno. Risposta: un numero da $1$ a $5$. Distrattori: uno in più (si conta l'energia dopo il salto),
uno in meno (ci si ferma al primo aumento), il numero di energie dell'elenco.

- "Le prime quattro energie di ionizzazione di un elemento sono, in $\text{kJ/mol}$: $738$, $1451$, $7733$ e
  $10\,543$. Quanti elettroni ha l'elemento nel livello più esterno?" Risposta: $2$.
- "Le prime cinque energie di ionizzazione di un elemento sono, in $\text{kJ/mol}$: $578$, $1817$, $2745$, $11\,577$ e
  $14\,842$. Quanti elettroni ha l'elemento nel livello più esterno?" Risposta: $3$.

## Livello 2: dalle energie all'elemento

Tre casi in parti uguali, tutti dalle energie di ionizzazione.

- L'elemento, dato il periodo (secondo, terzo o quarto). Distrattori: gli elementi vicini nello stesso periodo.
- La disposizione degli elettroni nei livelli, dato il nome dell'elemento e il numero di elettroni ($2,\ 8,\ 3$).
  Distrattori: l'ordine rovesciato, un elettrone in più o in meno all'esterno, tutti gli elettroni dopo i primi due
  in un solo livello.
- Lo ione che forma un metallo indicato con $\mathrm{X}$ (litio, berillio, sodio, magnesio, alluminio, potassio,
  calcio): $\mathrm{X^+}$, $\mathrm{X^{2+}}$ o $\mathrm{X^{3+}}$. Distrattori: le altre cariche fino a $4+$.

Esempi:

- "Un elemento del terzo periodo ha queste prime energie di ionizzazione, in $\text{kJ/mol}$: $738$, $1451$, $7733$ e
  $10\,543$. Qual è l'elemento?" Risposta: $\mathrm{Mg}$.
- "Un metallo, che indichiamo con $\mathrm{X}$, ha queste prime energie di ionizzazione, in $\text{kJ/mol}$: $496$,
  $4562$ e $6910$. Quale ione forma più facilmente?" Risposta: $\mathrm{X^+}$.

## Livello 3: quanti elettroni in un livello

Risposta: un numero. Quattro casi in parti uguali: la capienza $2n^2$ del livello $n$ da $1$ a $5$; la capienza di un
sottolivello che esiste, fino al $5f$ ($2$, $6$, $10$, $14$); il numero di sottolivelli del livello $n$; la somma delle
capienze dei primi sottolivelli di un livello ($3s$ e $3p$: $8$). Distrattori: $n^2$, $2n$, la capienza del livello al
posto di quella del sottolivello, quattro in più o in meno.

- "Quanti elettroni può contenere al massimo il livello $n = 3$?" Risposta: $18$.
- "Quanti elettroni può contenere al massimo il sottolivello $4d$?" Risposta: $10$.

## Livello 4: sottolivelli e ordine di energia

Quattro casi in parti uguali.

- Quale sottolivello non esiste ($60\%$: uno tra $1p$, $1d$, $1f$, $2d$, $2f$, $3f$ tra tre che esistono), o quale
  esiste (uno vero tra tre che non esistono).
- Quale sottolivello viene subito dopo uno dato, da $1s$ a $4d$, nell'ordine di energia della lezione. Distrattori: il
  sottolivello successivo dello stesso livello ($3d$ dopo $3p$), quello dopo ancora, quello prima.
- Quale di due sottolivelli ha l'energia più bassa, o più alta: coppie in cui il livello inganna ($4s$ e $3d$, $5s$ e
  $4d$, $6s$ e $4f$) e coppie in cui non inganna. Distrattori: l'altro, "hanno la stessa energia", "dipende dal
  livello".
- Tre sottolivelli vicini da mettere in ordine di energia crescente. Distrattori: l'ordine per livello ($3p < 3d < 4s$)
  e altre permutazioni.

Esempi:

- "In ordine di energia crescente, quale sottolivello viene subito dopo il $3p$?" Risposta: $4s$.
- "Metti in ordine di energia crescente i sottolivelli $3d$, $4s$ e $3p$." Risposta: $3p < 4s < 3d$.

## Livello 5: gli elettroni nei livelli

Un elemento da $Z = 3$ a $Z = 20$, con potassio e calcio circa il $45\%$ delle volte. Due casi: la disposizione nei
livelli ($67\%$; distrattori: il terzo livello riempito oltre gli otto elettroni, $2,\ 8,\ 9$ per il potassio, l'ordine
rovesciato, un elettrone in più o in meno all'esterno) e il numero di elettroni del livello più esterno ($33\%$).

- "Il potassio ha $19$ elettroni. Come sono disposti nei livelli di energia, a partire dal nucleo?" Risposta:
  $2,\ 8,\ 8,\ 1$.
- "Il fosforo ha $15$ elettroni. Quanti ne ha nel livello più esterno?" Risposta: $5$.

## Da evitare

- Elementi oltre il calcio: con il $3d$ la disposizione per livelli non è più quella della lezione.
- Elenchi di più di otto energie: non stanno in un problema da leggere sul telefono.
- La configurazione scritta con i sottolivelli ($1s^2\,2s^2 \dots$): è l'argomento della lezione successiva.
- Elementi con sei o più elettroni esterni nei livelli 1 e 2: il salto arriva tardi e l'elenco si allunga.

## Risposta aperta

Livelli 1 e 3: il valore (un numero intero). `'chim-livelli-energia': { 1: V, 3: V }`.
