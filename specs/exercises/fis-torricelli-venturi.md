# Il teorema di Torricelli e l'effetto Venturi

Generatore: `fis-torricelli-venturi` (`src/lib/exercises/v2/generators/fis-torricelli-venturi.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_torricelli_venturi.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/100-fis-torricelli-venturi.md` (note in
`docs/lezioni/fisica/note/100-fis-torricelli-venturi.md`). Parti comuni: `src/lib/exercises/v2/fis-fluidi-moto.ts` e
`scripts/exercises/checkers/_fis_fluidi_moto.py`.

Sei livelli nell'ordine della lezione: la velocità di uscita da un foro, la profondità da ricavare, la gittata del
getto, il tubo di Venturi, il tubo di Pitot, la portanza.

## Nomi dei livelli

1. La velocità di uscita dal foro
2. La profondità del foro
3. Dove arriva il getto
4. Il tubo di Venturi
5. Il tubo di Pitot
6. La portanza

## Regole comuni

- $g = 9{,}8\,\text{m/s}^2$; acqua $1000\,\text{kg/m}^3$; aria $1{,}2\,\text{kg/m}^3$, sempre scritta nel testo.
- Dati con due cifre significative senza zeri ambigui; risposta a scelta multipla con due cifre significative e l'unità
  nell'opzione (m/s, m, kPa, kN).
- Si scartano i valori esatti a meno di $0{,}1$ unità dell'ultima cifra dal punto di arrotondamento e le risposte che
  finiscono con uno zero ambiguo.
- Distrattori dagli errori della lezione, scartati se entro l'8% dalla risposta, poi la risposta moltiplicata per
  $1{,}25$, $0{,}75$, $1{,}5$, $0{,}6$, $2$, $0{,}4$.
- Scena `serbatoio-foro` ai livelli 1, 2 e 3: il serbatoio con il foro e le quote date dal testo. Ai livelli 2 e 3 il
  livello dell'acqua e l'altezza del foro sono in scala; al livello 3 c'è il suolo e la distanza cercata è segnata
  "x = ?". Del getto si disegna solo il primo tratto, sempre uguale: dove cade è la risposta.

## Livello 1: la velocità di uscita dal foro

$v = \sqrt{2\,g\,h}$ con la profondità $h$ da $0{,}2$ a $9\,\text{m}$. Distrattori: il 2 dimenticato, la radice
dimenticata, il tempo di caduta da $h$.

- "Una cisterna aperta è piena d'acqua. Nella parete c'è un piccolo foro $2{,}5\,\text{m}$ sotto la superficie libera. Con
  che velocità esce l'acqua dal foro?" Risposta $7{,}0\,\text{m/s}$; distrattori $4{,}9\,\text{m/s}$, $49\,\text{m/s}$,
  $0{,}71\,\text{m/s}$.
- "… $0{,}45\,\text{m}$ …" Risposta $3{,}0\,\text{m/s}$ ($2{,}97$).

## Livello 2: la profondità del foro

Il livello dell'acqua $H$ dal fondo ($1{,}1$-$6\,\text{m}$) e l'altezza $y$ del foro dal fondo ($0{,}2$-$3\,\text{m}$, al più
il 70% di $H$): $h = H - y$, di almeno $0{,}3\,\text{m}$. Distrattori: $y$ presa per la profondità (l'avviso della
lezione), $H$, $H + y$.

- "Un serbatoio aperto è pieno d'acqua fino a $1{,}8\,\text{m}$ dal fondo. Nella parete c'è un piccolo foro a
  $0{,}45\,\text{m}$ dal fondo. Con che velocità esce l'acqua dal foro?" Risposta $5{,}1\,\text{m/s}$ ($h = 1{,}35\,\text{m}$);
  distrattori $3{,}0\,\text{m/s}$, $5{,}9\,\text{m/s}$, $6{,}6\,\text{m/s}$.
- "… $3{,}2\,\text{m}$ … $0{,}95\,\text{m}$" Risposta $6{,}6\,\text{m/s}$.

## Livello 3: dove arriva il getto

Botte a terra piena fino a $H$ ($1{,}1$-$4\,\text{m}$), foro a $y$ dal suolo (al più l'85% di $H$), $h = H - y$ di almeno
$0{,}2\,\text{m}$: $x = v \cdot t = \sqrt{2 g h} \cdot \sqrt{2 y / g} = 2\sqrt{h \cdot y}$. Distrattori: $H$ al posto di
$h$, il tempo di caduta calcolato da $h$ ($x = 2h$), il fattore 2 dimenticato.

- "Una botte appoggiata a terra è piena d'acqua fino a $2{,}3\,\text{m}$ dal suolo. Da un piccolo foro nella parete, a
  $1{,}1\,\text{m}$ dal suolo, esce un getto orizzontale. A che distanza dalla botte il getto tocca terra?" Risposta
  $2{,}3\,\text{m}$ ($2\sqrt{1{,}2 \cdot 1{,}1} = 2{,}298$); distrattori $3{,}2\,\text{m}$, $2{,}4\,\text{m}$ (scartato perché
  entro l'8%), $1{,}1\,\text{m}$.

## Livello 4: il tubo di Venturi

$v_2 = v_1 \cdot S_1/S_2$ e $p_1 - p_2 = \tfrac{1}{2} d\,(v_2^2 - v_1^2)$ in kPa, di almeno $1\,\text{kPa}$; sezioni in
$\text{cm}^2$ con rapporto tra $1{,}4$ e $5$, $v_1$ da $0{,}5$ a $4\,\text{m/s}$. Distrattori: il rapporto delle sezioni
non al quadrato, $v_1$ dimenticata, il quadrato della differenza.

- "In un tubo di Venturi orizzontale l'acqua scorre a $1{,}5\,\text{m/s}$ nel tratto largo, che ha sezione
  $12\,\text{cm}^2$. La strozzatura ha sezione $4{,}4\,\text{cm}^2$. Quanto vale la differenza di pressione tra il tratto
  largo e la strozzatura?" Risposta $7{,}2\,\text{kPa}$ ($v_2 = 4{,}09\,\text{m/s}$); distrattori $1{,}9\,\text{kPa}$,
  $8{,}4\,\text{kPa}$, $3{,}4\,\text{kPa}$.

## Livello 5: il tubo di Pitot

$v = \sqrt{2\,\Delta p / d}$ con $\Delta p$ da $0{,}2$ a $6\,\text{kPa}$ e l'aria a $1{,}2\,\text{kg/m}^3$. Distrattori: la
densità dell'acqua (l'avviso della lezione), il 2 dimenticato, i kilopascal non convertiti.

- "Il tubo di Pitot di un aereo misura, tra la presa sulla punta e quella sul fianco, una differenza di pressione di
  $3{,}4\,\text{kPa}$. La densità dell'aria è $1{,}2\,\text{kg/m}^3$. A che velocità vola l'aereo rispetto all'aria?"
  Risposta $75\,\text{m/s}$; distrattori $2{,}6\,\text{m/s}$, $53\,\text{m/s}$, $2{,}4\,\text{m/s}$.

## Livello 6: la portanza

$F = \tfrac{1}{2} d\,(v_s^2 - v_i^2) \cdot S$ in kN; $v_s$ da $41$ a $99\,\text{m/s}$, $v_i$ più bassa di $5$-$20\,\text{m/s}$,
superficie da $11$ a $60\,\text{m}^2$. Distrattori: il quadrato della differenza, il mezzo dimenticato, i quadrati
sommati.

- "In volo l'aria scorre a $72\,\text{m/s}$ sopra le ali di un aereo e a $61\,\text{m/s}$ sotto. Le ali hanno una superficie
  totale di $24\,\text{m}^2$ e la densità dell'aria è $1{,}2\,\text{kg/m}^3$. Quanto vale la portanza?" Risposta
  $21\,\text{kN}$; distrattori $1{,}7\,\text{kN}$, $42\,\text{kN}$.
- "… $55\,\text{m/s}$ … $47\,\text{m/s}$ … $16\,\text{m}^2$" Risposta $7{,}8\,\text{kN}$.

## Da evitare

- Fori sotto i $20$-$30\,\text{cm}$ dalla superficie (velocità piccole, e l'ipotesi del foro piccolo regge peggio).
- Velocità dell'aria sopra $100\,\text{m/s}$, dove l'aria non è più incomprimibile.
- Esempi della lezione senza esercizio: la portata del foro (esempio 2, seconda parte) e la formula inversa del
  venturimetro, che dà $v_1$ dalla differenza di pressione (esempio 3).
