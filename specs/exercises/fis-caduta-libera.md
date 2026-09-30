# La caduta libera e il lancio verticale

Generatore: `fis-caduta-libera` (`src/lib/exercises/v2/generators/fis-caduta-libera.ts`, con
`src/lib/exercises/v2/fis-moto-accelerato.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_caduta_libera.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/44-fis-caduta-libera.md`. Percorso nel database:
`high_school/physics/cinematica/fis-caduta-libera`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Dal tempo di caduta
2. Il tempo di caduta
3. La velocità d'arrivo
4. Il lancio verso l'alto
5. La velocità con il segno
6. Il lancio da un balcone

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. $g = 9{,}8\,\text{m/s}^2$, aria trascurata (lo dice ogni testo). Dati con
due cifre significative ($1{,}1$-$9{,}9$ o $11$-$99$; al livello 1 anche tempi da $0{,}51$ a $0{,}99\,\text{s}$),
risultati con due cifre significative, sotto $100$, mai vicini a un confine di arrotondamento.

## Regole comuni

- Convenzione della lezione: asse verticale verso l'alto, $a = -g$. Le velocità d'arrivo si chiedono "in modulo"; al
  livello 5 si chiede la velocità con il segno.
- Formule: $h = \tfrac{1}{2}g\,t^2$, $v = g\,t$; $t = \sqrt{2h/g}$; $v = \sqrt{2g\,h}$; $h_{max} = v_0^2/(2g)$,
  $t_{volo} = 2v_0/g$; $v = v_0 - g\,t$; dal balcone, $y_0 + v_0\,t - \tfrac{1}{2}g\,t^2 = 0$.
- Niente scena.

## Livello 1: dal tempo di caduta

Un sasso lasciato cadere in un pozzo o da un ponte; tempo da $0{,}51$ a $0{,}99\,\text{s}$ (tre volte su dieci) o da
$1{,}1$ a $4{,}4\,\text{s}$. Metà la profondità (o l'altezza), metà la velocità d'arrivo.

- "Un sasso lasciato cadere da fermo in un pozzo tocca l'acqua dopo $1{,}7\,\text{s}$. Quanto è profondo il pozzo, fino
  all'acqua?" Risposta $14\,\text{m}$; distrattori $28\,\text{m}$ ($g\,t^2$, il mezzo dimenticato), $8{,}3\,\text{m}$
  ($\tfrac{1}{2}g\,t$), $17\,\text{m}$ ($g\,t$, la velocità).
- Per la velocità: $\tfrac{1}{2}g\,t$, $g\,t^2$, $g/t$.

## Livello 2: il tempo di caduta

Altezza da $1{,}1$ a $99\,\text{m}$; un vaso, un sasso, una mela, una chiave, con l'accordo.

- "Una chiave cade da ferma da un'altezza di $72\,\text{m}$. Quanto tempo impiega ad arrivare al suolo?" Risposta
  $3{,}8\,\text{s}$; distrattori $15\,\text{s}$ ($2h/g$, la radice dimenticata), $2{,}7\,\text{s}$ ($\sqrt{h/g}$, il $2$
  dimenticato), $7{,}3\,\text{s}$ ($h/g$).

## Livello 3: la velocità d'arrivo

Come il livello 2.

- Stessa chiave: risposta $38\,\text{m/s}$; distrattori $2g\,h$ (la radice dimenticata, quando sta sotto $100$),
  $27\,\text{m/s}$ ($\sqrt{g\,h}$), $2h$ ($g$ per il tempo senza radice); di riserva la risposta spostata del $20\%$.

## Livello 4: il lancio verso l'alto

Una palla, un sasso o una moneta lanciati a $v_0$ da $1{,}1$ a $30\,\text{m/s}$. Metà l'altezza massima, metà il tempo
per tornare al punto di lancio.

- "Una palla viene lanciata verticalmente verso l'alto a $7{,}5\,\text{m/s}$. Dopo quanto tempo torna al punto di
  lancio?" Risposta $1{,}5\,\text{s}$; distrattori $0{,}77\,\text{s}$ (solo la salita), $5{,}7\,\text{s}$ ($v_0^2/g$),
  $2{,}6\,\text{s}$ ($2g/v_0$).
- Per l'altezza: $v_0^2/g$ (il $2$ dimenticato), $v_0/(2g)$ (il quadrato dimenticato), $v_0^2/2$ ($g$ dimenticato).

## Livello 5: la velocità con il segno

$v_0$ da $5$ a $30\,\text{m/s}$, $t$ da $1{,}1$ a $6\,\text{s}$, con la palla ancora in volo ($t < 2v_0/g$); metà in
salita ($v \geq 1\,\text{m/s}$), metà in discesa ($v \leq -1\,\text{m/s}$).

- "Una palla viene lanciata verticalmente verso l'alto a $25\,\text{m/s}$. Con l'asse rivolto verso l'alto, quanto vale
  la sua velocità dopo $2{,}4\,\text{s}$?" Risposta $1{,}5\,\text{m/s}$; distrattori $-1{,}5\,\text{m/s}$ (il segno
  sbagliato), $49\,\text{m/s}$ ($v_0 + g\,t$), $13\,\text{m/s}$ ($v_0 - \tfrac{1}{2}g\,t$).

## Livello 6: il lancio da un balcone

Balcone da $1{,}1$ a $40\,\text{m}$, $v_0$ da $1{,}1$ a $20\,\text{m/s}$ verso l'alto; si chiede il tempo fino al suolo.

- "Da un balcone alto $6{,}3\,\text{m}$ una palla viene lanciata verticalmente verso l'alto a $7{,}7\,\text{m/s}$, e poi
  cade fino al suolo. Dopo quanto tempo tocca il suolo?" Risposta $2{,}2\,\text{s}$; distrattori $1{,}6\,\text{s}$
  ($2v_0/g$, il balcone ignorato), $1{,}1\,\text{s}$ ($\sqrt{2y_0/g}$, il lancio ignorato), $1{,}9\,\text{s}$
  ($v_0/g + \sqrt{2y_0/g}$, la salita sopra il balcone ignorata); di riserva la radice di un lancio verso il basso.

## Esercizi da evitare

- Al livello 5 velocità vicine a zero (tra $-1$ e $1\,\text{m/s}$) e tempi in cui la palla è già a terra.
- Risultati di $100$ o più.

## Verifica

`fis_caduta_libera.py` rilegge il testo (con l'accordo), ricalcola con $g = 49/5$ esatto e le radici di SymPy, arrotonda
a due cifre e confronta la risposta e il formato delle opzioni; al livello 6 prende la radice positiva
dell'equazione di secondo grado.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 75 px su 252).

### Errori piantati

Su 240 esercizi (40 per livello): indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate
e scena aggiunta bocciati tutti. Un numero del testo cambiato di un'unità: 199 su 240; passano quasi solo esercizi dei
livelli 2, 3 e 6, dove il dato sta sotto una radice e la risposta arrotondata resta la stessa (da $72$ a $73\,\text{m}$
il tempo resta $3{,}8\,\text{s}$): non sono errori del controllo.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 257 (267), livello 2 507 (503), livello 3 504 (500), livello 4 484 (487), livello 5 481
(466), livello 6 950 (937). I livelli 1-4 hanno un solo dato numerico: pochi esercizi diversi, come l'angolo limite
del piano inclinato.

## Domande per la revisione

- Asse verso l'alto per tutti i livelli, con le velocità d'arrivo "in modulo": va bene, o per le cadute semplici l'asse
  verso il basso come molti libri?
- Il livello 6 (equazione di secondo grado) è adatto al secondo anno, o va tolto?
