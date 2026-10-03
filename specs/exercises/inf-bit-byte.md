# Bit, byte e unità di misura

Generatore: `inf-bit-byte` (`src/lib/exercises/v2/generators/inf-bit-byte.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_bit_byte.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/03-inf-bit-byte.md` (note in `docs/lezioni/informatica/note/03-inf-bit-byte.md`).
Aiuti condivisi del capitolo: `src/lib/exercises/v2/inf-informazione.ts` e `scripts/exercises/checkers/_inf_informazione.py`.

Sei livelli nell'ordine della lezione, tutti di conto e costruiti all'indietro. La risposta è sempre un numero
(`answer.kind = 'number'`, razionale esatto: `"3500"`, `"5/2"`), nell'unità che la domanda nomina; la scelta multipla
di `toChoice()` mostra il numero con la sua unità.

## Nomi dei livelli

1. Bit e byte
2. Multipli decimali
3. Multipli binari
4. Quanti valori con n bit
5. Tempo di scaricamento
6. Dati, minuti e velocità

## Regole comuni

- Unità come nel README di informatica: kB, MB, GB, TB con fattore 1000; KiB, MiB, GiB, TiB con fattore 1024; il bit
  per esteso; velocità in Mbit/s. Il fattore che serve è sempre scritto nel testo, dopo "Ricorda che": "Ricorda che
  $1\,\text{MB} = 1000\,\text{kB}$", "Ricorda che $1\,\text{B} = 8\,\text{bit}$". Solo il livello 4 non ne ha bisogno.
- Numeri con la virgola decimale `{,}` e lo spazio sottile ogni tre cifre a partire da cinque cifre intere:
  $3{,}5$, $4096$, $65\,536$.
- Nelle domande "Quanti byte sono…" l'unità B si scrive per esteso; nelle opzioni è il simbolo.
- Distrattori: numeri positivi con al più quattro decimali, diversi dalla risposta e tra loro. Se gli errori tipici ne
  danno meno di tre, si completano con il doppio, il decuplo, la metà della risposta.

## Livello 1: bit e byte

"Quanti bit sono $k\,\text{B}$?" ($k$ da 2 a 125, risposta $8k$) oppure "Quanti byte sono $8k\,\text{bit}$?"
(risposta $k$), metà e metà.

Distrattori: l'operazione inversa (dividere invece di moltiplicare), il fattore 10, sommare o togliere 8, il fattore 4
o 16.

Esempi: $12\,\text{B}$, 96 bit; $520\,\text{bit}$, 65 byte.

## Livello 2: multipli decimali

Da un'unità a un'altra tra B, kB, MB, GB, TB, a un passo (circa 2 su 3) o a due. Il numero nell'unità più grande ha al
più due decimali ed è al più 999 (meno di 100 con due passi); nell'unità più piccola è intero. Metà dei casi verso
l'unità più piccola (`moltiplica`), metà verso la più grande (`dividi`). Con due passi il testo ricorda tutti e due i
fattori.

Distrattori: la direzione sbagliata, il fattore 1024, un passo in meno (il numero lasciato com'è) o in più, il
fattore 100.

Esempi: $3{,}5\,\text{MB}$, $3500\,\text{kB}$; $250\,000\,\text{kB}$, $0{,}25\,\text{GB}$.

## Livello 3: multipli binari

Da un'unità alla vicina tra B, KiB, MiB, GiB, TiB, un solo passo, fattore 1024. Il numero nell'unità più grande è un
intero da 2 a 40 (circa 7 su 10) oppure uno tra $0{,}25$, $0{,}5$, $0{,}75$, $1{,}25$, $1{,}5$, $2{,}5$, $3{,}5$,
$4{,}5$, $7{,}5$, $12{,}5$. Metà `moltiplica`, metà `dividi`.

Distrattori: il fattore 1000, la direzione sbagliata, il numero lasciato com'è, "$2^{10} = 20$", il fattore 512.

Esempi: $3\,\text{GiB}$, $3072\,\text{MiB}$; $2560\,\text{KiB}$, $2{,}5\,\text{MiB}$.

## Livello 4: quanti valori con n bit

"Un programma conserva il livello di un personaggio in 12 bit. Quanti valori diversi può distinguere?" (`valori`,
risposta $2^n$) oppure "…in 12 bit, come numero intero a partire da 0. Qual è il valore più grande che può
conservare?" (`massimo`, risposta $2^n - 1$), metà e metà. Lo spazio è in bit, da 3 a 16 (circa 2 su 3), o in byte, da
1 a 3. Otto cose da conservare.

Distrattori: $2n$, $n^2$, la potenza prima, $2^n$ al posto di $2^n - 1$ e viceversa; con i byte anche $256 \cdot k$ e
$2^k$ (i byte non portati in bit).

Esempi: 2 byte, $65\,536$ valori; 1 byte a partire da 0, massimo 255.

## Livello 5: tempo di scaricamento

"Elena scarica un video di $25\,\text{MB}$ con una connessione da $20\,\text{Mbit/s}$. Quanti secondi servono? Ricorda
che $1\,\text{B} = 8\,\text{bit}$." Velocità tra 8, 10, 16, 20, 24, 40, 50, 80, 100, 200 Mbit/s; tempo intero da 2 a
120 secondi; dimensione intera in MB, al più 3000. Quello che si scarica è scelto in base alla dimensione (una foto,
un video, un gioco).

Distrattori: il fattore 8 dimenticato ($D : v$), diviso due volte per 8, moltiplicare invece di dividere, il fattore
8 applicato due volte.

Esempio: $6\,\text{MB}$ a $16\,\text{Mbit/s}$, 3 secondi.

## Livello 6: dati, minuti e velocità

Tre casi, circa un terzo ciascuno.

- `dati`: "Quanti MB si scaricano in $20\,\text{s}$ con una connessione da $50\,\text{Mbit/s}$?" Risposta
  $v \cdot t : 8$, intera.
- `minuti`: "Matteo scarica un gioco di $13{,}2\,\text{GB}$ con una connessione da $80\,\text{Mbit/s}$. Quanti minuti
  servono?", con i due fattori ricordati ($1\,\text{GB} = 1000\,\text{MB}$ e $1\,\text{B} = 8\,\text{bit}$). Minuti
  interi da 1 a 60; GB con al più due decimali, al più 100.
- `velocita`: "Sara vuole scaricare un video di $150\,\text{MB}$ in $60\,\text{s}$. Quale velocità serve, in megabit
  al secondo?" Risposta $8D : t$, intera.

Distrattori: il fattore 8 dimenticato o applicato al contrario, i secondi lasciati al posto dei minuti, il prodotto al
posto del quoziente.

## Esercizi da evitare

- Simboli ambigui: KB, Mb, MB/s.
- Una conversione senza il fattore nel testo.
- Risultati con più di due decimali, o tempi non interi.
- Passare da una famiglia all'altra (da GB a GiB): è nell'esempio 6 della lezione, ma il conto non si fa a mano.

## Verifica

Il controllo rilegge numeri e unità dal testo, ricalcola la risposta con razionali esatti a partire dalla grandezza
in byte di ogni unità, e controlla che i fattori ricordati nel testo siano giusti e siano quelli che servono. Poi i
vincoli del livello (intervalli, decimali, numero di passi), la risposta, le quattro opzioni con la loro unità
(diverse, una sola giusta, quella indicata da `correct`), il caso in `params.case` e le quote dei casi.

## Domande per la revisione

- Il fattore 8 è ricordato anche ai livelli 5 e 6: va bene, o lì lo studente dovrebbe ricordarlo da solo?
- Al livello 3 basta un passo, o serve anche un livello con due passi (da GiB a KiB), con numeri a sette cifre?
- La risposta è un numero senza unità ("Quanti kB sono…"): nella risposta aperta lo studente scrive solo il numero.
