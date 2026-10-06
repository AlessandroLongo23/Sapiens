# L'equazione di stato del gas perfetto

Generatore: `fis-gas-perfetto` (`src/lib/exercises/v2/generators/fis-gas-perfetto.ts`, con
`src/lib/exercises/v2/fis-gas-leggi.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_gas_perfetto.py` (con
`_fis_gas_leggi.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/104-fis-gas-perfetto.md`. Percorso nel
database: `high_school/physics/fis-gas/fis-gas-perfetto`.

Cinque livelli, ognuno con una difficoltà in più, nell'ordine della lezione. La chimica ha già `gas-ideali` (atmosfere,
litri e $R = 0{,}0821$, massa molare, densità): qui tutto è in unità del Sistema Internazionale, con $R = 8{,}31$, e ci
sono il numero di molecole e il gas che esce.

## Nomi dei livelli

1. Da uno stato all'altro
2. Le moli di gas
3. La pressione, con litri e gradi Celsius
4. Il numero di molecole
5. Il gas uscito dalla bombola

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione (il numero di molecole è un numero puro in notazione
scientifica). Costanti date nel testo: $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$;
$T = t + 273$. Risultati con due cifre significative (tre al livello 5, dove i dati ne hanno tre), mai a metà tra due
arrotondamenti e mai interi che finiscono con uno zero.

## Livello 1: da uno stato all'altro

$V_2 = V_1 \cdot \dfrac{p_1}{p_2} \cdot \dfrac{T_2}{T_1}$. Volume da $1{,}1$ a $9{,}9\,\text{L}$, pressioni intere in
kilopascal che non finiscono per zero ($p_1$ da $101$ a $299$, $p_2$ da $31$ a $399$, rapporto tra $1/4$ e $5$ e
lontano da $1$), $t_1$ da $5$ a $35\,^\circ\text{C}$, $t_2$ da $-50$ a $200\,^\circ\text{C}$, diversa da zero e lontana
da $t_1$ almeno $15$ gradi. Il testo dice che il gas non esce.

- "Un gas occupa $5{,}6\,\text{L}$ a $23\,^\circ\text{C}$ e alla pressione di $206\,\text{kPa}$. Viene portato a
  $163\,^\circ\text{C}$ e alla pressione di $255\,\text{kPa}$, senza che ne esca. Che volume occupa?" Risposta
  $6{,}7\,\text{L}$; distrattori $32\,\text{L}$ (i gradi Celsius nel rapporto), $3{,}1\,\text{L}$ (le temperature
  capovolte), $10\,\text{L}$ (le pressioni capovolte).
- "$3{,}6\,\text{L}$ a $34\,^\circ\text{C}$ e $116\,\text{kPa}$, poi $-12\,^\circ\text{C}$ e $245\,\text{kPa}$":
  $1{,}4\,\text{L}$.

## Livello 2: le moli di gas

$n = \dfrac{p\,V}{R\,T}$ con i dati già nelle unità giuste: volume da $0{,}011$ a $0{,}099\,\text{m}^3$, pressione da
$1{,}01$ a $4{,}99 \cdot 10^5\,\text{Pa}$ (tre cifre), temperatura intera da $251$ a $399\,\text{K}$.

- "Un recipiente di $0{,}058\,\text{m}^3$ contiene un gas alla pressione di $3{,}05 \cdot 10^5\,\text{Pa}$ e alla
  temperatura di $341\,\text{K}$. Quante moli di gas contiene?" Risposta $6{,}2\,\text{mol}$; distrattori
  $31\,\text{mol}$ ($273$ tolto a una temperatura già in kelvin), $2{,}1 \cdot 10^3\,\text{mol}$ (la temperatura
  dimenticata), $52\,\text{mol}$ ($R$ dimenticata).
- "$0{,}017\,\text{m}^3$, $2{,}15 \cdot 10^5\,\text{Pa}$, $337\,\text{K}$": $1{,}3\,\text{mol}$.

## Livello 3: la pressione, con litri e gradi Celsius

$p = \dfrac{n\,R\,T}{V}$ con le conversioni: volume da $1{,}1$ a $9{,}9\,\text{L}$ o intero da $11$ a $99\,\text{L}$
(senza zero finale), moli da $1{,}1$ a $9{,}9$, temperatura da $5$ a $95\,^\circ\text{C}$. Risposta in pascal, in
notazione scientifica.

- "Un recipiente da $65\,\text{L}$ contiene $5{,}6\,\text{mol}$ di gas a $58\,^\circ\text{C}$. Quanto vale la pressione
  del gas?" Risposta $2{,}4 \cdot 10^5\,\text{Pa}$; distrattori $2{,}4 \cdot 10^2\,\text{Pa}$ (i litri non convertiti),
  $4{,}2 \cdot 10^4\,\text{Pa}$ (i gradi Celsius), $42\,\text{Pa}$ (tutti e due): i due avvisi della lezione.
- "$6{,}2\,\text{L}$, $3{,}6\,\text{mol}$, $90\,^\circ\text{C}$": $1{,}8 \cdot 10^6\,\text{Pa}$.

## Livello 4: il numero di molecole

$N = \dfrac{p\,V}{k_B\,T}$: volume da $1{,}1$ a $9{,}9\,\text{cm}^3$, pressione da $1{,}1$ a $9{,}9 \cdot 10^5\,\text{Pa}$,
temperatura da $5$ a $95\,^\circ\text{C}$. Risposta in notazione scientifica con due cifre.

- "Quante molecole ci sono in $5{,}6\,\text{cm}^3$ di gas a $60\,^\circ\text{C}$ e alla pressione di
  $5{,}8 \cdot 10^5\,\text{Pa}$?" Risposta $7{,}1 \cdot 10^{20}$; distrattori $7{,}1 \cdot 10^{26}$ (i centimetri cubi non
  convertiti), $3{,}9 \cdot 10^{21}$ (i gradi Celsius), $1{,}2 \cdot 10^{-3}$ ($R$ al posto di $k_B$: sono le moli).
- "$3{,}6\,\text{cm}^3$, $57\,^\circ\text{C}$, $1{,}7 \cdot 10^5\,\text{Pa}$": $1{,}3 \cdot 10^{20}$.

## Livello 5: il gas uscito dalla bombola

$n_1 - n_2 = \dfrac{(p_1 - p_2)\,V}{R\,T}$: bombola da $10{,}0$ a $50{,}0\,\text{L}$ (un decimale), temperatura da $5$ a
$35\,^\circ\text{C}$, $p_1$ da $2{,}21$ a $2{,}99 \cdot 10^6\,\text{Pa}$ e $p_2$ più bassa di almeno
$1{,}00 \cdot 10^6\,\text{Pa}$, non sotto $1{,}01 \cdot 10^6\,\text{Pa}$, scritte con tre cifre senza zero finale. Risposta
in moli con tre cifre.

- "Una bombola da $30{,}5\,\text{L}$ contiene gas a $23\,^\circ\text{C}$, alla pressione di
  $2{,}62 \cdot 10^6\,\text{Pa}$. Dopo un certo uso, alla stessa temperatura, la pressione è
  $1{,}38 \cdot 10^6\,\text{Pa}$. Quante moli di gas sono uscite?" Risposta $15{,}4\,\text{mol}$; distrattori
  $17{,}1\,\text{mol}$ (le moli rimaste), $32{,}5\,\text{mol}$ (le moli iniziali), $198\,\text{mol}$ (i gradi Celsius).
- "$21{,}5\,\text{L}$, $34\,^\circ\text{C}$, da $2{,}26$ a $1{,}16 \cdot 10^6\,\text{Pa}$": $9{,}27\,\text{mol}$.

## Esercizi da evitare

- Una temperatura finale di $0\,^\circ\text{C}$ al livello 1.
- Pressioni oltre $3 \cdot 10^6\,\text{Pa}$: il gas vero comincia a scostarsi dal modello, e la lezione lo dice.
- Risposte intere che finiscono con uno zero.

## Verifica

`fis_gas_perfetto.py` rilegge il testo, controlla intervalli e scrittura dei dati, ricalcola con i razionali (il numero
di molecole per intero, con $k_B$ esatta come è scritta) e confronta l'opzione giusta e il formato delle altre.

L'esito dei controlli è nel rapporto del gruppo 39 e nella nota della lezione.

## Domande per la revisione

- Nessun livello ha una scena: lo stato finale è l'incognita e nel piano pressione-volume non c'è niente da disegnare
  senza dare la risposta. Un livello "leggi la temperatura dal piano" si potrà fare con la scena del piano
  pressione-volume degli altri gruppi.
- La massa molare (esempi 2 e 4 della lezione) non ha un livello: è già in `gas-ideali` di chimica.
