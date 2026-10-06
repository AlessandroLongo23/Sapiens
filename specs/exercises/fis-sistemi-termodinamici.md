# Sistemi termodinamici e principio zero

Generatore: `fis-sistemi-termodinamici` (`src/lib/exercises/v2/generators/fis-sistemi-termodinamici.ts`, con
`src/lib/exercises/v2/fis-cinetica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_sistemi_termodinamici.py`
(con `_fis_cinetica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/107-fis-sistemi-termodinamici.md`. Percorso
nel database: `high_school/physics/termodinamica/fis-sistemi-termodinamici`.

Cinque livelli, nell'ordine della lezione. La lezione è in gran parte di vocabolario: i livelli 1, 3 e 4 sono domande
di ragionamento su casi generati, con quattro frasi tra cui scegliere; i livelli 2 e 5 hanno un conto.

## Nomi dei livelli

1. Aperto, chiuso o isolato
2. Lo stato nel piano pressione-volume
3. Due gas e una parete
4. Il principio zero
5. Dove si ferma il pistone

## Tipi di risposta

Scelta multipla, quattro opzioni. Ai livelli 2 e 5 un numero con l'unità (kelvin con tre cifre significative,
centimetri con due), mai a metà tra due arrotondamenti e mai intero con lo zero finale. Agli altri livelli una frase:
le quattro frasi sono sempre le stesse per il livello e ne cambia l'ordine. Un'opzione lunga va su due righe.

## Livello 1: aperto, chiuso o isolato

"Considera come sistema … Che cosa scambia con l'ambiente?" Opzioni: "materia ed energia" (aperto), "solo energia"
(chiuso), "né materia né energia" (isolato), "solo materia" (mai giusta). La soluzione nomina il tipo di sistema. I
sistemi sono sedici:

- aperti: l'acqua che bolle in una pentola senza coperchio; una tazza di tè fumante; una persona che corre; la legna
  che brucia in un camino; il motore acceso di un'auto; una pozzanghera al sole;
- chiusi: l'aria in un palloncino annodato lasciato al sole; una lattina sigillata lasciata al sole; il gas in un
  cilindro chiuso da un pistone a tenuta; l'acqua in una bottiglia tappata messa in frigorifero; una borsa del ghiaccio
  sigillata appoggiata su un ginocchio; l'acqua in una pentola a pressione chiusa, sul fuoco, prima che la valvola
  fischi;
- isolati: il tè in un thermos perfetto, ben chiuso; l'acqua in un calorimetro ideale, chiuso; un gas in un recipiente
  rigido, sigillato, con le pareti adiabatiche; il ghiaccio e la bibita in un contenitore termico perfetto, chiuso.

Esempi: "Considera come sistema la legna che brucia in un camino. Che cosa scambia con l'ambiente?" Risposta "materia
ed energia". "Considera come sistema una lattina sigillata lasciata al sole. …" Risposta "solo energia" (l'errore
tipico è "né materia né energia": chiuso scambiato per isolato).

## Livello 2: lo stato nel piano pressione-volume

Scena `piano-pv` (del gruppo 41) con il solo punto $A$ su un incrocio della griglia: volume da $2$ a $8\,\text{L}$,
pressione da $100$ a $400\,\text{kPa}$ a passi di $50$. Il testo dà solo le moli, con tre cifre da $0{,}101$ a $0{,}499$ senza
zero finale. $T = \dfrac{p\,V}{n\,R}$ deve stare tra $150$ e $900\,\text{K}$.

- "Il punto A della figura è lo stato di $0{,}157\,\text{mol}$ di gas perfetto. Qual è la temperatura del gas?
  ($R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$)" con $A$ a $3\,\text{L}$ e $350\,\text{kPa}$. Risposta $805\,\text{K}$; distrattori
  $6{,}69 \cdot 10^{3}\,\text{K}$ ($R$ dimenticata), $532\,\text{K}$ ($273$ tolto ai kelvin), $19{,}8\,\text{K}$ (le moli al
  numeratore).
- $A$ a $6\,\text{L}$ e $100\,\text{kPa}$, $0{,}251\,\text{mol}$: risposta $288\,\text{K}$.

## Livello 3: due gas e una parete

"Due gas sono separati da una parete (mobile o fissa) e (conduttrice o isolante). A sinistra la pressione è … e la
temperatura …; a destra … e …. Che cosa succede?" Pressioni da $81$ a $299\,\text{kPa}$, temperature da $251$ a
$449\,\text{K}$; due valori sono uguali oppure diversi di almeno $20$. La parete si sposta solo se è mobile e le
pressioni sono diverse; passa calore solo se è conduttrice e le temperature sono diverse. Opzioni: "Niente: sono in
equilibrio", "Si sposta solo la parete", "Passa solo calore", "La parete si sposta e passa calore", ciascuna giusta in
circa un quarto dei casi.

- "… parete fissa e isolante … $112\,\text{kPa}$ … $388\,\text{K}$; a destra $239\,\text{kPa}$ e $388\,\text{K}$ …" Risposta
  "Niente: sono in equilibrio" (l'errore tipico è far spostare una parete fissa).
- "… parete mobile e isolante … $150\,\text{kPa}$ … $300\,\text{K}$; a destra $150\,\text{kPa}$ e $400\,\text{K}$ …" Risposta "Niente:
  sono in equilibrio": le temperature sono diverse ma la parete non conduce (i dati veri non hanno lo zero finale).

## Livello 4: il principio zero

Cinque casi. Con il termometro (80% circa): "Un termometro segna $a$ a contatto con il corpo A e $b$ a contatto con il
corpo B. Poi A e B vengono messi a contatto. Che cosa succede?", con letture con un decimale tra $15{,}0$ e
$45{,}0\,^\circ\text{C}$, uguali oppure diverse di almeno mezzo grado. Con il terzo corpo (20% circa): "Il corpo A è in
equilibrio termico con un terzo corpo C, e anche il corpo B lo è. …" oppure "…; il corpo B, messo a contatto con C,
non lo è. …". Opzioni: "Non passa calore", "Passa calore da A a B", "Passa calore da B ad A", "Passa calore, ma non si
sa in che verso".

- Termometro $24{,}5\,^\circ\text{C}$ con A e $24{,}5\,^\circ\text{C}$ con B: "Non passa calore".
- A in equilibrio con C, B no: "Passa calore, ma non si sa in che verso".

## Livello 5: dove si ferma il pistone

Cilindro lungo da $41$ a $99\,\text{cm}$ (senza zero finale), moli da $0{,}11$ a $0{,}99$ per parte, diverse di almeno
$0{,}1$. $l_1 = \dfrac{n_1}{n_1 + n_2}\,L$, con due cifre.

- "Un cilindro orizzontale lungo $52\,\text{cm}$, chiuso alle estremità, è diviso da un pistone che scorre senza attrito e
  conduce il calore. A sinistra ci sono $0{,}86\,\text{mol}$ di gas, a destra $0{,}23\,\text{mol}$. Quanto è lunga la parte di
  sinistra all'equilibrio?" Risposta $41\,\text{cm}$; distrattori $11\,\text{cm}$ (l'altra parte), $26\,\text{cm}$ (metà
  cilindro), $14\,\text{cm}$ (il rapporto delle moli per la lunghezza).
- $L = 61\,\text{cm}$, $0{,}21$ e $0{,}31\,\text{mol}$: risposta $25\,\text{cm}$.

## Da evitare

- Al livello 1 sistemi il cui tipo dipende da come si guarda (una stanza con la finestra socchiusa, la Terra).
- Al livello 3 valori diversi ma quasi uguali, che uno studente leggerebbe come uguali.
- Scene con la risposta scritta o con aree colorate.
- Trattini lunghi e "piuttosto che" nei testi.
