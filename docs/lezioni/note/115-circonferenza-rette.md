# Note: Circonferenza e rette

Lezione nuova (lotto del terzo anno, gruppo C, 5 ottobre 2026). Conti e coordinate delle figure rifatti con SymPy (`gruppo-c/verifica.py` nello scratchpad): distanze, risolventi, punti di intersezione e di contatto, tangenti (ognuna rimessa a sistema con la circonferenza per controllare che il punto comune sia uno solo), la formula di sdoppiamento in forma simbolica, l'asse radicale.

## Scelte

- Confine con la 114: qui tutto ciò che riguarda una retta o una seconda circonferenza, comprese le condizioni di tangenza per trovare l'equazione (centro e retta tangente, tangenza agli assi).
- Posizione retta-circonferenza: prima il confronto $d$ e $r$, poi il sistema, in una sola tabella. La distanza è il metodo consigliato; il discriminante serve quando si vogliono i punti.
- Una sola circonferenza, $x^2 + y^2 - 2x - 4y - 20 = 0$ (centro $(1, 2)$, raggio $5$), per gli esempi 1, 2 e 3: la tangente dell'esempio 1 è la stessa che l'esempio 3 trova nel punto $(4, 6)$.
- Tangente in un punto: con la perpendicolare al raggio, in quattro passi. La formula di sdoppiamento è in un `ad-tip`, enunciata, con un avviso sul fatto che vale solo per i punti della circonferenza. Non è dimostrata: la lezione dice che si ottiene dal procedimento fatto con le lettere.
- Tangenti da un punto esterno: fascio per $P$ e distanza uguale al raggio. Il metodo $\Delta = 0$ è solo nominato in un `ad-note`. L'esempio 5 è scelto perché una delle due tangenti è verticale e il fascio la perde.
- Lunghezza della corda $2\sqrt{r^2 - d^2}$, dal teorema della 96 sulla perpendicolare dal centro.
- Due circonferenze: tabella delle posizioni con $r$ raggio maggiore e $r'$ minore, come nella 96; asse radicale definito come differenza delle equazioni, con le due proprietà che servono (passa per i punti comuni; è la tangente comune se sono tangenti). Non è definito con la potenza di un punto.
- Circonferenze concentriche: non sono in tabella; la riga "tangenti internamente" porta la condizione $d \neq 0$ per escludere due circonferenze coincidenti.

## Lasciato fuori

- Fasci di circonferenze, potenza di un punto, tangenti comuni a due circonferenze.
- Circonferenza per due punti e tangente a una retta, circonferenza tangente a due rette: sono problemi tipici ma lunghi; possono andare nei generatori o in una seconda parte.

## Figure e blocchi grafico

Sette figure TikZ, guardate in chiaro e in scuro. Due blocchi `grafico`: la retta $3x + 4y + k = 0$ con il cursore $k$ e la distanza scritta sotto (copertina: la figura dell'esempio 1; è tangente per $k = 14$ e $k = -36$, valori che il cursore a passo $1$ raggiunge); il fascio per $P(5, 0)$ con il cursore $m$, $d$ e $r$ scritti sotto (tangente per $m = \pm 0{,}5$). Aperti su `/prova-grafico/lezione`: si disegnano e i valori iniziali sono giusti ($d = 2$; $d = 3{,}54$ e $r = 2{,}24$). I cursori non sono stati mossi.

L'esempio 8 (circonferenze tangenti) non ha figura: il testo non ne nomina una.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Cinque piani, ognuno dopo una figura TikZ e con la risposta scritta subito dopo. Aperti a 390 px con i cursori ai valori iniziali, agli estremi e nei casi limite.

1. `retta-circonferenza-distanza-cursore` (c'era, esempio 1): aggiunta la risposta ($k = -36$ e $k = 14$).
2. `corda-lunghezza-cursore-q` (nuovo, esempio 2): $y = x + q$, con $d$ e la lunghezza della corda; massima ($10$) per $q = 1$, "non esiste" quando $d > 5$.
3. `fascio-per-p-tangente-circonferenza` (c'era): aggiunta la risposta ($m = \pm 0{,}5$).
4. `due-circonferenze-distanza-centri-cursore` (nuovo, sotto la tabella di "Due circonferenze", con la figura nuova `due-circonferenze-esterne-distanza-centri`): raggi $3$ e $2$, cursore sulla distanza dei centri; tangenti per $d = 5$ e $d = 1$, concentriche per $d = 0$.
5. `asse-radicale-cursore-c` (nuovo, esempio 7): la seconda circonferenza si stringe con $c$; l'asse radicale resta una retta anche quando le due si staccano (tra $c = 32$ e $c = 33$).

Scartati: la tangente in un punto che scorre sulla circonferenza (il punto dovrebbe muoversi con un angolo, e il blocco non ha i gradi; con un parametro razionale sarebbe un trucco); la circonferenza di centro dato con il raggio a cursore fino a toccare la retta (esempio 6: ripete il piano 1 e avrebbe portato a sei piani); la tangente verticale dell'esempio 5 (il fascio con $m$ non la raggiunge: il piano mostrerebbe solo una delle due).

## Domande per Andrea

- La formula di sdoppiamento: la teniamo in un riquadro come scorciatoia, la promuoviamo a metodo principale, o la togliamo?
- Per le tangenti da un punto esterno la lezione usa solo la distanza dal centro; volete anche un esempio svolto con $\Delta = 0$, che è il metodo che poi serve per la parabola?
- L'asse radicale è presentato come "la retta che si ottiene sottraendo le equazioni": basta, o serve la definizione con la potenza di un punto?
- Mancano i fasci di circonferenze: li fate al terzo anno?
- "Tangenti internamente" quando $d = r - r'$: nella tabella ho aggiunto "con $d \neq 0$". Va bene, o preferite una riga per le concentriche come nella 96?

## Da verificare

- I blocchi `grafico` su un telefono vero e muovendo i cursori (in particolare che il valore $d$ segni $5$ per $k = 14$).
- Larghezza delle formule in evidenza sul telefono: non misurata. La più lunga è la risolvente dell'esempio 2, $x^2 + (x - 4)^2 - 2x - 4(x - 4) - 20 = 0$.

Prerequisiti proposti: circonferenza-equazione, distanza-punto-retta, retta-fasci, sistemi-secondo-grado.
