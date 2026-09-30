# I raggi di luce e la propagazione rettilinea

Generatore: `ottica-geometrica` (`src/lib/exercises/v2/generators/ottica-geometrica.ts`, con
`src/lib/exercises/v2/raggi-specchi.ts`). Verifica indipendente: `scripts/exercises/checkers/ottica_geometrica.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/31-ottica-geometrica.md`. Percorso nel database:
`high_school/physics/ottica/ottica-geometrica`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il tempo della luce
2. Chilometri e minuti
3. L'anno luce
4. L'ombra di un cartoncino
5. La camera oscura
6. L'ombra al contrario

## Numeri e risposte

$c = 3{,}00 \cdot 10^8\,\text{m/s}$ e $1\,\text{anno luce} = 9{,}46 \cdot 10^{15}\,\text{m}$ sono scritti nel testo. Le
distanze astronomiche hanno 3 cifre significative (livelli 1-2 con i metri o i chilometri), i minuti e gli anni luce
2; i dati delle ombre e della camera oscura 2 ($1{,}1$-$9{,}9$ o $11$-$99$, senza zeri finali). I risultati si
arrotondano alle cifre significative dei dati, come la lezione "Le cifre significative"; un valore a meno di
$10^{-6}$ da un confine di arrotondamento non si usa. Si scrivono per esteso tra $10^{-2}$ e $10^{3}$ ($497\,\text{s}$,
$0{,}70\,\text{m}$), in notazione scientifica fuori ($1{,}5 \cdot 10^{11}\,\text{m}$). Tutte le opzioni hanno le cifre
significative della risposta e la sua unità.

## Regole comuni

- Livelli 4-6: la scena (`raggi-specchi`) disegna la sorgente puntiforme, il cartoncino (se il testo dice dov'è), lo
  schermo e le quote dei dati; la `solutionScene` aggiunge i raggi che sfiorano i bordi del cartoncino, la zona d'ombra
  e la quota del risultato. La camera oscura è disegnata non in scala (oggetto, foro, parete di fondo), con l'immagine
  capovolta solo nella soluzione.

## Livello 1: il tempo della luce

La luce che arriva da un satellite, dalla Luna, dal Sole, da Marte o da Giove, con distanze plausibili in metri.

- "$1{,}49 \cdot 10^{11}\,\text{m}$ dal Sole." Risposta $497\,\text{s}$; distrattori $4{,}97 \cdot 10^{18}\,\text{s}$
  (esponenti sommati), $4{,}47 \cdot 10^{19}\,\text{s}$ ($d \cdot c$), $2{,}01 \cdot 10^{-3}\,\text{s}$ ($c/d$).
- "$8{,}92 \cdot 10^{10}\,\text{m}$ da Marte." Risposta $297\,\text{s}$.

## Livello 2: chilometri e minuti

Metà dei casi la distanza è in chilometri e si chiede il tempo; metà si dà il tempo in minuti (Sole da $8{,}1$ a
$8{,}5$, Giove da 33 a 54, Saturno da 68 a 84) e si chiede la distanza in metri.

- "$9{,}77 \cdot 10^7\,\text{km}$ da Marte." Risposta $326\,\text{s}$; distrattori $0{,}326\,\text{s}$ (chilometri non
  convertiti), $3{,}26 \cdot 10^{5}\,\text{s}$, $3{,}07 \cdot 10^{-3}\,\text{s}$.
- "$8{,}2$ minuti dal Sole." Risposta $1{,}5 \cdot 10^{11}\,\text{m}$; distrattori $2{,}5 \cdot 10^{9}\,\text{m}$
  (minuti non convertiti), $8{,}9 \cdot 10^{12}\,\text{m}$ (ore), $1{,}6 \cdot 10^{-6}\,\text{m}$ ($t/c$).

## Livello 3: l'anno luce

Metà dei casi da anni luce a metri, metà da metri ad anni luce.

- "$3{,}6$ anni luce." Risposta $3{,}4 \cdot 10^{16}\,\text{m}$; distrattori $1{,}1 \cdot 10^{8}\,\text{m}$ (l'anno
  luce preso come un tempo: anni in secondi), $1{,}1 \cdot 10^{9}\,\text{m}$ ($N \cdot c$), $3{,}8 \cdot
  10^{-16}\,\text{m}$ (diviso).
- "$3{,}1 \cdot 10^{16}\,\text{m}$." Risposta $3{,}3$ anni luce; distrattori $9{,}8 \cdot 10^{8}$, $1{,}0 \cdot 10^{8}$,
  $3{,}3 \cdot 10^{3}$ anni luce.

## Livello 4: l'ombra di un cartoncino

Cartoncino alto $h$ ($1{,}1$-$9{,}9\,\text{cm}$) a $d$ ($30$-$99\,\text{cm}$) da una lampadina puntiforme, schermo a
$D$ ($1{,}1$-$4{,}9\,\text{m}$) con $1{,}5\,d \le D \le 4\,d$. Si chiede $H = h \cdot D/d$, con $D$ da convertire in
centimetri.

- "$h = 4{,}9\,\text{cm}$, $d = 36\,\text{cm}$, $D = 1{,}4\,\text{m}$." Risposta $19\,\text{cm}$; distrattori
  $1{,}3\,\text{cm}$ (rapporto rovesciato), $14\,\text{cm}$ (distanza cartoncino-schermo al posto di $D$),
  $0{,}19\,\text{cm}$ (metri non convertiti).
- "$h = 6{,}6$, $d = 32$, $D = 1{,}1$." Risposta $23\,\text{cm}$.

## Livello 5: la camera oscura

Metà dei casi l'altezza dell'immagine (albero alto $h$ in metri a $d$ metri, scatola profonda $d'$ centimetri,
risultato in centimetri), metà l'altezza dell'oggetto (edificio, immagine in centimetri, risultato in metri).

- "$h = 5{,}3\,\text{m}$, $d = 3{,}6\,\text{m}$, $d' = 25\,\text{cm}$." Risposta $37\,\text{cm}$; distrattori
  $76\,\text{cm}$ (rapporto rovesciato), $0{,}37\,\text{cm}$ (unità), $0{,}76\,\text{cm}$.
- "$d = 3{,}1\,\text{m}$, $d' = 19\,\text{cm}$, $h' = 4{,}3\,\text{cm}$." Risposta $0{,}70\,\text{m}$.

## Livello 6: l'ombra al contrario

Metà dei casi dove mettere il cartoncino ($d = h \cdot D/H$, tra un quinto e due terzi di $D$), metà quanto è alto
($h = H \cdot d/D$). Nel primo caso la scena non disegna il cartoncino.

- "$D = 1{,}3\,\text{m}$, $h = 9{,}1\,\text{cm}$, $H = 43\,\text{cm}$." Risposta $28\,\text{cm}$; distrattori
  $0{,}28\,\text{cm}$, $55\,\text{cm}$, $14\,\text{cm}$.
- "$d = 77\,\text{cm}$, $D = 2{,}5\,\text{m}$, $H = 12\,\text{cm}$." Risposta $3{,}7\,\text{cm}$.

## Verifica

`ottica_geometrica.py` rilegge il testo, rifà i conti con frazioni esatte e arrotonda con le cifre significative,
rifiutando i valori vicini a un confine; controlla il formato di ogni opzione (unità, cifre significative), la scena
(cartoncino dove dice il testo, niente raggi nel problema) e la soluzione (raggi dalla sorgente che sfiorano i bordi
del cartoncino; immagine della camera oscura sulle rette che passano per il foro). Quote dei casi.

## Domande per la revisione

- Un dato del testo cambiato di poco (per esempio 71 minuti invece di 74) può dare lo stesso risultato arrotondato: il
  controllo con gli errori piantati lo lascia passare in circa un caso su cento, ed è giusto.
- Nei distrattori dei livelli 1-3 compaiono numeri assurdi ($10^{19}\,\text{s}$): vengono da errori veri, ma forse
  sono troppo facili da scartare.
