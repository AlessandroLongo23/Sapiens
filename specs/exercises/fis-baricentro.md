# Il baricentro e la stabilità dell'equilibrio

Generatore: `fis-baricentro` (`src/lib/exercises/v2/generators/fis-baricentro.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_baricentro.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/25-fis-baricentro.md`
(note in `docs/lezioni/fisica/note/25-fis-baricentro.md`). Funzioni comuni in `src/lib/exercises/v2/fis-corpo-rigido.ts` e
`scripts/exercises/checkers/_corpo_rigido.py`; scena `asta-forze`.

Cinque livelli, ognuno con una difficoltà in più: il baricentro di due corpi, di tre, il tipo di equilibrio, l'angolo
oltre cui un corpo si ribalta, quanto può sporgere un'asse con un peso sopra.

## Nomi dei livelli

1. Il baricentro di due corpi
2. Il baricentro di tre corpi
3. Stabile, instabile o indifferente
4. L'angolo di ribaltamento
5. Quanto può sporgere

## Tipi di risposta

Livelli 1, 2, 4 e 5: `number` con l'unità, a scelta multipla di quattro opzioni. Le distanze sono esatte, con due
cifre significative e al più due decimali in metri ($0{,}39\,\text{m}$), o intere in centimetri; l'angolo si
arrotonda al grado e non è mai entro $0{,}05^\circ$ da un mezzo grado. Livello 3: `choice` di tre parole ("stabile",
"instabile", "indifferente").

## Regole comuni

- Masse da $1{,}0$ a $9{,}5\,\text{kg}$ a passi di $0{,}5$, scritte con due cifre.
- La scena `asta-forze` disegna l'asta con i corpi (piccoli blocchi con la loro massa) e le distanze del testo, o
  l'asse sul tetto con il suo peso. Il livello 4 e il caso del vaso del livello 5 non hanno scena: la figura
  mostrerebbe l'angolo o la sporgenza da trovare.

## Livello 1: il baricentro di due corpi

Due corpi alle estremità di un'asta leggera lunga $L$ (da $0{,}20$ a $2{,}0\,\text{m}$); la distanza del baricentro
dal primo corpo, $x_G = m_2 L / (m_1 + m_2)$.

- "$2{,}0\,\text{kg}$ e $6{,}0\,\text{kg}$, asta di $1{,}2\,\text{m}$; distanza dal corpo di $2{,}0\,\text{kg}$?"
  Risposta $0{,}90\,\text{m}$; distrattori $0{,}30\,\text{m}$ (vicino al corpo leggero), $0{,}60\,\text{m}$ (il centro),
  $3{,}6\,\text{m}$ ($m_2 L / m_1$).
- "$3{,}5\,\text{kg}$ e $1{,}5\,\text{kg}$, asta di $1{,}3\,\text{m}$; distanza dal corpo di $3{,}5\,\text{kg}$?"
  Risposta $0{,}39\,\text{m}$.

## Livello 2: il baricentro di tre corpi

Tre corpi su un'asta leggera di $100\,\text{cm}$, a posizioni diverse multiple di $10\,\text{cm}$ dall'estremità
sinistra; $x_G = \sum m x / \sum m$, intero con al più due cifre.

- "$6{,}5\,\text{kg}$ a $0\,\text{cm}$, $1{,}0\,\text{kg}$ a $50\,\text{cm}$ e $5{,}0\,\text{kg}$ a $80\,\text{cm}$."
  Risposta $36\,\text{cm}$; distrattori $43\,\text{cm}$ (la media delle posizioni, senza le masse), $50\,\text{cm}$
  (il centro dell'asta).
- "$9{,}0\,\text{kg}$ a $0$, $2{,}0\,\text{kg}$ a $30$ e $1{,}0\,\text{kg}$ a $60\,\text{cm}$." Risposta $10\,\text{cm}$.

Distrattori: la media delle posizioni; la posizione del corpo più pesante; il centro dell'asta.

## Livello 3: stabile, instabile o indifferente

Un corpo della lezione, un terzo per tipo. Stabili: la lampada appesa, il righello appeso per un foro vicino
all'estremità, la pallina in fondo alla scodella, il cono sulla base, il pendolo fermo in basso. Instabili: la matita
sulla punta, la pallina in cima alla cupola, il cono sulla punta, l'asta ferma in verticale su un perno sotto il
baricentro, il righello in verticale su un dito. Indifferenti: la ruota di bicicletta sul suo asse, la pallina sul
tavolo, il cono sul fianco, il righello appeso per il centro, il cilindro sul fianco.

## Livello 4: l'angolo di ribaltamento

Un blocco omogeneo largo $w$ e alto $h$ (multipli di $5\,\text{cm}$, $w$ da $10$ a $60$, $h$ da $20$ a $120$,
$1/5 \le w/h < 1$) si ribalta quando la verticale del baricentro passa per lo spigolo: $\tan\theta = w/h$. La
scatola inclinata su uno spigolo (60%) o il blocco su un piano inclinato ruvido (40%).

- "Scatola larga $35\,\text{cm}$ e alta $75\,\text{cm}$." Risposta $25^\circ$; distrattori $65^\circ$ (la tangente
  rovesciata), $13^\circ$ (metà larghezza su tutta l'altezza), $43^\circ$ (tutta la larghezza su metà altezza).
- L'esempio 3 della lezione, l'armadio di $0{,}60 \times 1{,}6\,\text{m}$: $21^\circ$.

## Livello 5: quanto può sporgere

Un'asse omogenea lunga $L$ (da $1{,}0$ a $4{,}0\,\text{m}$) e di peso $P$: con un vaso di peso $W$ sull'estremità
che sporge (60%), la sporgenza massima $s = P L / (2 (P + W))$; oppure l'asse sporge di $s$ dal bordo di un tetto e un
gatto di peso $W$ cammina verso l'estremità (40%): arriva fino a $x = P (L/2 - s) / W$, tra $0{,}10\,\text{m}$ e $s$.

- "Lunga $2{,}8\,\text{m}$, pesa $190\,\text{N}$, vaso di $90\,\text{N}$." Risposta $0{,}95\,\text{m}$; distrattori
  $1{,}4\,\text{m}$ (il vaso dimenticato), $0{,}45\,\text{m}$ (i pesi scambiati), $1{,}9\,\text{m}$ (senza il 2).
- "Lunga $3{,}0\,\text{m}$, pesa $120\,\text{N}$, sporge di $1{,}2\,\text{m}$; gatto di $60\,\text{N}$." Risposta
  $0{,}60\,\text{m}$; distrattori $0{,}15\,\text{m}$ (rovesciato), $3{,}0\,\text{m}$ (il braccio del peso misurato
  dall'estremità), $0{,}30\,\text{m}$.

## Esercizi da evitare

- Due masse uguali (il baricentro nel centro), una media delle posizioni uguale al baricentro.
- Un angolo a meno di $0{,}05^\circ$ da un mezzo grado; un blocco più largo che alto.
- Un gatto che arriva fino in fondo (non c'è niente da trovare) o che si ferma a pochi centimetri.

## Verifica

`fis_baricentro.py` rilegge il testo, ricalcola $x_G$ con i razionali di SymPy, l'angolo con `atan` esatto, la
sporgenza dall'uguaglianza dei momenti rispetto al bordo; confronta i corpi del livello 3 con la tabella della
specifica; controlla la scena e le opzioni. Esito: `sample.mts fis-baricentro 1000 all` con i seed $1$, $50001$ e
$777001$, PASS; `review.mts` e `width.mts` escono con codice 0 (opzioni al massimo di $90$ px).

### Errori piantati

Su 25 esercizi e le sei modifiche solite, 130 su 135 bocciati: i 5 passati sono uno spazio aggiunto nel testo del
livello 3, che non ha numeri. Bocciata anche la descrizione di un corpo sostituita con quella di un corpo in un altro
tipo di equilibrio.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 641 (633), livello 2 991 (997), livello 3 15 (15), livello 4 282
(279), livello 5 921 (912). I livelli 3 e 4 sono stretti per costruzione.

## Domande per la revisione

- "Baricentro" per tutto, o anche "centro di massa" (che la lezione del terzo anno usa)?
- Livello 4: l'arcotangente con la calcolatrice è da primo anno? La lezione di seno e coseno la introduce.
- Livello 5: la sporgenza con due pesi è un problema da verifica, o solo da approfondimento?
