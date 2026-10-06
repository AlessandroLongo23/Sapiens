# La conservazione della quantità di moto

Generatore: `fis-conservazione-quantita-moto` (`src/lib/exercises/v2/generators/fis-conservazione-quantita-moto.ts`,
con `src/lib/exercises/v2/fis-urti.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_conservazione_quantita_moto.py` (con `_fis_urti.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/82-fis-conservazione-quantita-moto.md`.

Quattro livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti i sistemi sono isolati; le forze
interne (spinta, sparo, molla, esplosione) non si calcolano mai.

## Nomi dei livelli

1. Due corpi fermi che si spingono
2. Il rinculo di un fucile
3. Un sistema già in moto che si separa
4. Tre frammenti nel piano

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($1{,}4\,\text{m/s}$). Dati con due cifre significative senza zeri finali
ambigui. Risultati a due cifre significative, mai a meno di $10^{-6}$ da un confine di arrotondamento e mai un numero
intero di decine ($40$, $20$). Nessun distrattore a meno dell'8% della risposta; se un errore tipico dà un valore
troppo vicino o non arrotondabile, il posto lo prende una risposta di scorta (la giusta moltiplicata per $1{,}3$,
$0{,}7$, $1{,}6$, $0{,}5$).

## Regole comuni

- Formule e simboli della lezione: velocità dopo l'interazione $V_1$, $V_2$; $0 = m_1 V_1 + m_2 V_2$;
  $(m_1 + m_2)\,v = m_1 V_1 + m_2 V_2$; per componenti $p_{3x} = -p_1$, $p_{3y} = -p_2$.
- Nei livelli 1, 2 e 4 la risposta è un modulo; nel livello 3 l'altro carrello prosegue in avanti.

## Livello 1: due corpi fermi che si spingono

Metà: due pattinatori (masse intere da 41 a 99 kg); metà: due carrelli con una molla compressa (masse da $1{,}1$ a
$9{,}9\,\text{kg}$). Velocità del primo da $1{,}1$ a $9{,}9\,\text{m/s}$. Le masse differiscono di almeno il 15%, così
"stessa velocità" è un errore riconoscibile. Risposta $V_2 = m_1 V_1 / m_2$.

- "Due carrelli, di $6{,}5\,\text{kg}$ e $8{,}6\,\text{kg}$, sono fermi su una rotaia con una molla compressa in mezzo.
  Liberata la molla, il primo parte a $1{,}8\,\text{m/s}$. Con che velocità parte il secondo, se l'attrito è
  trascurabile?" Risposta $1{,}4\,\text{m/s}$; distrattori $2{,}4\,\text{m/s}$ (rapporto delle masse rovesciato),
  $1{,}8\,\text{m/s}$ (stessa velocità), $0{,}77\,\text{m/s}$ ($m_1 V_1/(m_1 + m_2)$, la formula dei corpi che restano
  uniti).
- "Due pattinatori, di $45\,\text{kg}$ e $75\,\text{kg}$, sono fermi sul ghiaccio uno di fronte all'altro e si
  spingono. Dopo la spinta il primo si muove a $2{,}4\,\text{m/s}$. Con che velocità si muove il secondo, se l'attrito
  è trascurabile?" Risposta $1{,}4\,\text{m/s}$; distrattori $4{,}0\,\text{m/s}$, $2{,}4\,\text{m/s}$, $0{,}90\,\text{m/s}$.

## Livello 2: il rinculo di un fucile

In più: la massa del proiettile in grammi e la velocità in notazione scientifica. Fucile da $2{,}1$ a
$5{,}9\,\text{kg}$, proiettile da 11 a 49 g (intero, non multiplo di 10), velocità da $2{,}1 \cdot 10^2$ a
$9{,}9 \cdot 10^2\,\text{m/s}$; rinculo da $0{,}2\,\text{m/s}$ in su.

- "Un fucile di $5{,}8\,\text{kg}$ spara un proiettile di $34\,\text{g}$, che esce dalla canna a
  $8{,}6 \cdot 10^2\,\text{m/s}$. Con che velocità arretra il fucile, se chi spara non lo trattiene?" Risposta
  $5{,}0\,\text{m/s}$; distrattori $0{,}50\,\text{m/s}$ e $50\,\text{m/s}$ (conversione dei grammi sbagliata di un
  fattore dieci; il secondo è scartato perché è un numero intero di decine), $66\,\text{m/s}$ (stessa energia
  cinetica al posto della stessa quantità di moto: $V_p\sqrt{m_p/m_f}$), $6{,}6\,\text{m/s}$ (scorta).
- "Un fucile di $5{,}6\,\text{kg}$ spara un proiettile di $36\,\text{g}$, che esce dalla canna a
  $8{,}2 \cdot 10^2\,\text{m/s}$. ..." Risposta $5{,}3\,\text{m/s}$; distrattori $53\,\text{m/s}$, $0{,}53\,\text{m/s}$,
  $66\,\text{m/s}$.

## Livello 3: un sistema già in moto che si separa

In più: la quantità di moto iniziale non è zero. Due carrelli agganciati (masse da $1{,}1$ a $9{,}9\,\text{kg}$) a
velocità $v$ da $1{,}1$ a $4{,}9\,\text{m/s}$; una molla li separa, e quello davanti prosegue a $V_2$ (da $2{,}1$ a
$9{,}9\,\text{m/s}$, almeno $1\,\text{m/s}$ più di $v$). L'altro prosegue in avanti ad almeno $0{,}2\,\text{m/s}$.
Risposta $V_1 = ((m_1 + m_2)\,v - m_2 V_2)/m_1$.

- "Su una rotaia un carrello di $5{,}8\,\text{kg}$ e uno di $6{,}3\,\text{kg}$ viaggiano agganciati a
  $2{,}5\,\text{m/s}$. Una molla tra i due li separa: il carrello di $6{,}3\,\text{kg}$, che sta davanti, prosegue a
  $3{,}5\,\text{m/s}$. Con che velocità prosegue l'altro carrello?" Risposta $1{,}4\,\text{m/s}$; distrattori
  $5{,}2\,\text{m/s}$ ($p_{tot}/m_1$, la quantità di moto del carrello davanti non tolta), $0{,}68\,\text{m/s}$
  (divisa per la massa totale), $1{,}8\,\text{m/s}$ (scorta; l'errore "massa del sistema dimenticata" qui dà un
  valore negativo e viene lasciato fuori).
- "Su una rotaia un carrello di $7{,}6\,\text{kg}$ e uno di $9{,}3\,\text{kg}$ viaggiano agganciati a
  $3{,}2\,\text{m/s}$. ... prosegue a $4{,}9\,\text{m/s}$. ..." Risposta $1{,}1\,\text{m/s}$; distrattori
  $7{,}1\,\text{m/s}$, $0{,}50\,\text{m/s}$, $1{,}5\,\text{m/s}$.

## Livello 4: tre frammenti nel piano

In più: due dimensioni. Un oggetto fermo esplode in tre frammenti (masse da $0{,}11$ a $0{,}99\,\text{kg}$); il primo
parte lungo $x$ e il secondo lungo $y$ (velocità da $1{,}1$ a $9{,}9\,\text{m/s}$). Nessuna delle due quantità di moto
è sotto il 40% dell'altra, così sommarle come numeri e sommarle come vettori danno risultati diversi. Risposta
$V_3 = \sqrt{p_1^2 + p_2^2}/m_3$.

Scena `vettori-piano` (esiste già): gli assi e le due velocità date, lungo $x$ e lungo $y$, in proporzione (la più
lunga 4 quadretti), ognuna con il suo valore. Mai la terza velocità, che compare solo nella scena della soluzione.

- "Un oggetto fermo esplode in tre frammenti, che si muovono su un piano orizzontale liscio. Il primo, di
  $0{,}58\,\text{kg}$, parte a $5{,}8\,\text{m/s}$ lungo l'asse $x$; il secondo, di $0{,}63\,\text{kg}$, a
  $5{,}1\,\text{m/s}$ lungo l'asse $y$. Il terzo ha massa $0{,}58\,\text{kg}$. Con che velocità parte il terzo
  frammento?" Risposta $8{,}0\,\text{m/s}$; distrattori $11\,\text{m/s}$ ($(p_1 + p_2)/m_3$), $2{,}6\,\text{m/s}$
  ($p_3$ diviso per la massa di tutti e tre), $5{,}6\,\text{m/s}$ (scorta; $\sqrt{v_1^2 + v_2^2} = 7{,}7$ è a meno
  dell'8%).
- "... Il primo, di $0{,}56\,\text{kg}$, parte a $8{,}6\,\text{m/s}$ lungo l'asse $x$; il secondo, di
  $0{,}44\,\text{kg}$, a $7{,}6\,\text{m/s}$ lungo l'asse $y$. Il terzo ha massa $0{,}44\,\text{kg}$. ..." Risposta
  $13\,\text{m/s}$; distrattori $19\,\text{m/s}$, $11\,\text{m/s}$, $4{,}1\,\text{m/s}$.

## Da evitare

- Masse quasi uguali nel livello 1 (le due velocità coinciderebbero).
- Un carrello che nel livello 3 torna indietro: la risposta con il segno è una difficoltà in più, lasciata ai
  generatori degli urti.
- Risultati come $40\,\text{m/s}$ o da $100$ in su.
- Nella scena, qualunque freccia che non sia un dato.
