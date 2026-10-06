# Le leggi di Gay-Lussac

Generatore: `fis-leggi-gay-lussac` (`src/lib/exercises/v2/generators/fis-leggi-gay-lussac.ts`, con
`src/lib/exercises/v2/fis-gas-leggi.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_leggi_gay_lussac.py`
(con `_fis_gas_leggi.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/103-fis-leggi-gay-lussac.md`. Percorso nel
database: `high_school/physics/fis-gas/fis-leggi-gay-lussac`.

Cinque livelli, ognuno con una difficoltà in più, nell'ordine della lezione: prima le leggi con i gradi Celsius, poi con
i kelvin. La chimica ha già `chim-legge-charles-gay-lussac`, che parte dai kelvin.

## Nomi dei livelli

1. Il volume partendo da 0 °C
2. La temperatura dalla pressione
3. Il volume con i kelvin
4. La temperatura finale della bombola
5. Di quanto sale il pistone

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione. $\alpha = 1/273\,^\circ\text{C}^{-1}$ e $T = t + 273$, come
nella lezione. Volumi con tre cifre ($x{,}xx$, senza zero finale), pressioni intere in kilopascal che non finiscono per
zero, temperature intere in gradi Celsius. Risultati con tre cifre (volumi), interi (temperature) o con due cifre (la
salita del pistone), mai a metà tra due arrotondamenti.

## Livello 1: il volume partendo da 0 °C

$V = V_0\,(1 + t/273)$, con $V_0$ da $1{,}01$ a $9{,}99\,\text{L}$ e $t$ da $10$ a $200\,^\circ\text{C}$.

- "Un gas occupa $5{,}77\,\text{L}$ a $0\,^\circ\text{C}$. Viene scaldato a pressione costante fino a
  $126\,^\circ\text{C}$. Che volume occupa?" Risposta $8{,}43\,\text{L}$; distrattori $2{,}66\,\text{L}$ (l'$1 +$
  dimenticato), $13{,}0\,\text{L}$ ($1/100$ al posto di $1/273$), $3{,}11\,\text{L}$ (il segno meno).
- "$1{,}69\,\text{L}$ fino a $120\,^\circ\text{C}$": $2{,}43\,\text{L}$.

## Livello 2: la temperatura dalla pressione

La seconda legge girata: $t = 273\,(p/p_0 - 1)$. $p_0$ da $101$ a $299\,\text{kPa}$, $p$ più grande di almeno
$6\,\text{kPa}$ e al più doppia, risultato tra $15$ e $270\,^\circ\text{C}$, intero.

- "Un recipiente rigido contiene gas alla pressione di $202\,\text{kPa}$ quando è a $0\,^\circ\text{C}$. A quale
  temperatura la pressione arriva a $312\,\text{kPa}$?" Risposta $149\,^\circ\text{C}$; distrattori $422\,^\circ\text{C}$
  (il $-1$ dimenticato, che è anche la temperatura in kelvin), $54\,^\circ\text{C}$ ($100$ al posto di $273$), più un
  valore vicino.
- "$158\,\text{kPa}$, poi $175\,\text{kPa}$": $29\,^\circ\text{C}$.

## Livello 3: il volume con i kelvin

$V_2 = V_1\,T_2/T_1$ con le temperature date in gradi Celsius: $t_1$ da $5$ a $40\,^\circ\text{C}$, $t_2$ da $-40$ a
$250\,^\circ\text{C}$, diversa da zero e lontana da $t_1$ almeno $20$ gradi. Il verbo ("scaldato", "raffreddato") segue
i dati.

- "Un gas, sotto un pistone libero di scorrere, occupa $5{,}77\,\text{L}$ a $26\,^\circ\text{C}$. A pressione costante
  viene scaldato fino a $131\,^\circ\text{C}$. Che volume occupa?" Risposta $7{,}80\,\text{L}$; distrattori
  $29{,}1\,\text{L}$ (il rapporto dei gradi Celsius, l'avviso della lezione), $4{,}27\,\text{L}$ (il rapporto capovolto),
  $8{,}54\,\text{L}$ (il volume iniziale usato come $V_0$, l'altro avviso).
- "$1{,}69\,\text{L}$ da $25$ a $233\,^\circ\text{C}$": $2{,}87\,\text{L}$.

## Livello 4: la temperatura finale della bombola

$T_2 = T_1\,p_2/p_1$ e ritorno ai gradi Celsius. $p_1$ da $101$ a $299\,\text{kPa}$, $p_2$ tra $1{,}1$ e $2$ volte
$p_1$, $t_1$ da $5$ a $35\,^\circ\text{C}$.

- "Una bombola rigida contiene gas alla pressione di $202\,\text{kPa}$ a $23\,^\circ\text{C}$. A quale temperatura, in
  gradi Celsius, la pressione raggiunge $314\,\text{kPa}$?" Risposta $187\,^\circ\text{C}$; distrattori
  $460\,^\circ\text{C}$ (i kelvin dati come gradi Celsius), $36\,^\circ\text{C}$ (il rapporto dei gradi Celsius),
  $-83\,^\circ\text{C}$ (il rapporto capovolto).
- "$158\,\text{kPa}$ a $34\,^\circ\text{C}$, poi $254\,\text{kPa}$": $221\,^\circ\text{C}$.

## Livello 5: di quanto sale il pistone

$h_2 = h_1\,T_2/T_1$ e poi $\Delta h = h_2 - h_1$. $h_1$ da $15{,}0$ a $40{,}0\,\text{cm}$ (un decimale), $t_1$ da $10$ a
$40\,^\circ\text{C}$, aumento da $30$ a $250$ gradi; la salita è almeno un centimetro e si dà con due cifre. Scena
`cilindro-pistone` con $h_1$ e $t_1$; nella soluzione la stessa scena con $h_2$, $t_2$, il gas tinto di rosso e la
linea tratteggiata dell'altezza di prima.

- "Un cilindro con un pistone libero di scorrere contiene gas a $26\,^\circ\text{C}$, e il pistone è a
  $27{,}8\,\text{cm}$ dal fondo. Il gas viene scaldato fino a $190\,^\circ\text{C}$. Di quanto sale il pistone?" Risposta
  $15\,\text{cm}$; distrattori $43\,\text{cm}$ (l'altezza finale al posto della salita), $1{,}8 \cdot 10^2\,\text{cm}$
  (i gradi Celsius al denominatore), $9{,}8\,\text{cm}$ ($T_2$ al denominatore).
- "$12\,^\circ\text{C}$, $22{,}2\,\text{cm}$, fino a $170\,^\circ\text{C}$": $12\,\text{cm}$.

## Esercizi da evitare

- Una temperatura finale di $0\,^\circ\text{C}$ al livello 3 (il rapporto dei gradi Celsius darebbe zero).
- Temperature sotto $-40\,^\circ\text{C}$: l'aria resta un gas, ma il testo non dice quale gas è.
- Salite del pistone sotto il centimetro, o intere che finiscono per zero.

## Verifica

`fis_leggi_gay_lussac.py` rilegge il testo, controlla intervalli, scrittura dei dati e verbo, ricalcola con i razionali
e confronta l'opzione giusta e il formato delle altre; al livello 5 controlla che la scena disegni $h_1$ e $t_1$ e
quella della soluzione $h_2$.

L'esito dei controlli è nel rapporto del gruppo 39 e nella nota della lezione.

## Domande per la revisione

- Al livello 2 il distrattore "$-1$ dimenticato" coincide con la temperatura in kelvin: è un errore solo, contato una
  volta.
- La seconda legge in gradi Celsius nel verso diretto ($p$ da $p_0$ e $t$) non ha un livello suo: ha la stessa
  difficoltà del livello 1. Serve?
