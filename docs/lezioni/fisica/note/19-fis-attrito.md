# Note: Le forze di attrito

Lezione nuova (primo lotto di fisica, gruppo 5, 29 settembre 2026). Conti rifatti con SymPy in `verifica_lezioni.py`:
$20 \cdot 9{,}8 = 196$ N, $78{,}4 \approx 78$ e $58{,}8 \approx 59$ N, $29 / 117{,}6 = 0{,}247 \approx 0{,}25$, $14{,}7$,
$7{,}35 \approx 7{,}4$, $20{,}7$ e $10{,}35 \approx 10$ N, $8{,}0$ e $4{,}9$ N del libro contro la parete, i valori della
figura interattiva ($19{,}6$ e $14{,}7$ N; $30{,}38$ e $23{,}52$ N con legno su legno). `check.mts` passa.

## Struttura ed esempi

L'attrito radente e i suoi due tipi, la forza premente (tre casi in figura e un avviso), l'attrito statico (che si
adatta alla spinta fino al massimo, con l'avviso), l'attrito dinamico, la tabella dei coefficienti, l'esempio della
cassa, il grafico attrito-spinta, la figura interattiva, come si misurano i coefficienti (con il dinamometro), tre
esempi (il coefficiente dinamico, una mano che spinge verso il basso, un libro contro la parete), l'attrito volvente e
l'attrito viscoso a parole, come nell'Amaldi (da verificare sul libro: il lotto chiedeva "qualitativo come
nell'Amaldi", e non ho il testo).

## Fonti

- Coefficienti di attrito: Engineering ToolBox, "Friction and Friction Coefficients for various Materials", letta il
  29 settembre 2026 (`engineeringtoolbox.com/friction-coefficients-d_778.html`, la pagina non ha una data): vetro su
  vetro $0{,}9$-$1{,}0$ e $0{,}4$; legno su legno (asciutto, lungo la fibra) $0{,}62$ e $0{,}48$; alluminio su acciaio
  $0{,}61$ e $0{,}47$; ghiaccio su ghiaccio a $0\,^\circ$C $0{,}1$ e $0{,}02$; teflon su teflon $0{,}04$ e $0{,}04$. Altre
  tabelle (per esempio quella del Serway, citata a memoria: da verificare) danno legno su legno tra $0{,}25$ e $0{,}5$:
  per questo la lezione dice che i valori sono indicativi. Meglio sostituirli con la tabella dell'Amaldi, se Andrea ce
  l'ha.

## Scelte

- $F_\perp$ per la forza premente, come chiede il lotto; $F_s$ e $F_d$ per le forze di attrito, $F_{s,\max}$ per il
  massimo.
- La forza premente è introdotta senza la reazione vincolare, che è nel capitolo successivo; nelle figure non disegno
  la reazione del piano, e il diagramma dell'attrito statico ha solo le due forze orizzontali.
- Il piano inclinato è solo citato nell'avviso sulla forza premente, con il link.
- L'esempio 2 (velocità costante) usa il primo principio, con il link: è l'unico modo di misurare l'attrito dinamico.
- Il grafico attrito-spinta è in scala uguale sui due assi, quindi il primo tratto è la bisettrice.
- Nella figura interattiva, quando la spinta scende sotto l'attrito dinamico il blocco si ferma subito (nella realtà
  rallenterebbe): la decelerazione è del secondo anno.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `forza-premente-tre-casi`, `attrito-statico-blocco-fermo` (frecce di $1{,}3$
cm, uguali), `grafico-attrito-spinta` (numeri dell'esempio 1, con `% poi-interattivo`). Interattiva
`attrito-blocco-spinta` (`fisica/AttritoBloccoSpinta.tsx`): blocco di $5$ kg, spinta da $0$ a $40$ N con il cursore o
con "Aumenta piano", due coppie di coefficienti ($0{,}40$ e $0{,}30$; legno su legno), il grafico dell'attrito contro la
spinta disegnato mentre si procede, il pavimento che scorre quando il blocco scivola.

## Esercizi

Generatore `fis-attrito`, specifica in `specs/exercises/fis-attrito.md`: cinque livelli (l'attrito dinamico, il
coefficiente, quanto vale l'attrito, la forza premente non è il peso, un libro contro la parete), senza scene.

## Domande per Andrea

- $F_\perp$, $F_N$ o $N$ per la forza premente? E "forza premente" o "forza normale"?
- Attrito statico: $F_s \le \mu_s F_\perp$, come qui, o si dà solo il massimo $F_{s,\max} = \mu_s F_\perp$?
- La tabella dei coefficienti: avete quella dell'Amaldi, per usare gli stessi numeri?
- L'attrito volvente e quello viscoso: bastano a parole, o l'Amaldi dà formule (per esempio $F_v = k\,v$)?
- Il libro premuto contro la parete (esempio 4 e livello 5 del generatore) è un caso da primo anno, o anticipa troppo
  l'equilibrio?
