# Note: Parabola e rette

Lezione nuova (lotto del terzo anno, gruppo C, 5 ottobre 2026). Conti rifatti con SymPy (`gruppo-c/verifica.py` nello scratchpad): risolventi e discriminanti, tangenti (controllate anche con la derivata, che la lezione non nomina), punti di contatto, le due parabole dell'esempio 6. Le due formule dell'area del segmento parabolico sono state controllate con un integrale: quella generale in forma simbolica, quelle dell'esempio 7 con i numeri.

## Scelte

- Confine con la 93: il sistema retta-parabola e la tabella secante, tangente, esterna ci sono già lì. Qui la tabella torna in forma breve, con un solo esempio, e la lezione va subito alle tangenti.
- Una sola parabola, $y = \frac{1}{4}x^2 - x + 2$, per gli esempi 1, 2, 3, 4 e 7.
- Tangente in un punto: la formula $m = 2ax_0 + b$ è dimostrata scomponendo la risolvente in $(x - x_0)[a(x + x_0) + b - m]$ e chiedendo che il secondo punto comune coincida con il primo. Niente derivate, e niente rimando al quinto anno.
- Non c'è la formula di sdoppiamento per la parabola: basta $m = 2ax_0 + b$.
- Tangenti da un punto: fascio e $\Delta = 0$. "Interno" ed "esterno" sono definiti con il fuoco (interno: dalla parte del fuoco) e tradotti in una disuguaglianza per $y = ax^2 + bx + c$.
- Parabola con asse orizzontale: le rette per $P$ scritte come $x - x_0 = n(y - y_0)$, con $n = 2ay_0 + b$. La lettera $n$ è una scelta mia.
- Segmento parabolico: il brief lo dava come facoltativo. C'è, con il teorema di Archimede per la corda perpendicolare all'asse e la formula $\frac{|a| \cdot |x_2 - x_1|^3}{6}$ per una corda qualsiasi, tutte e due enunciate senza dimostrazione; la lezione dice che servono gli integrali del quinto anno.
- L'esempio 6 ha due soluzioni ($a = 1$ e $a = \frac{1}{4}$): è voluto, perché in verifica capita.

## Lasciato fuori

- Fasci di parabole.
- Il teorema di Archimede per una corda qualsiasi nella forma geometrica (due terzi del parallelogramma): c'è solo la formula con le ascisse.
- Proprietà della tangente legate al fuoco (riflessione, sottotangente).

## Figure e blocchi grafico

Cinque figure TikZ, guardate in chiaro e in scuro. Il segmento parabolico è colorato con un percorso chiuso (`\fill` sull'arco, chiuso dalla corda), senza `\clip` e senza `pattern`: nel tema scuro si vede bene. Due blocchi `grafico`: la retta $y = x + q$ con il discriminante $32 + 16q$ (copertina: figura dell'esempio 1; tangente per $q = -2$); il fascio per $P(3, -1)$ con il discriminante $16m^2 - 16m - 32$ (copertina: figura dell'esempio 4; tangente per $m = -1$ e $m = 2$). Aperti su `/prova-grafico/lezione`: si disegnano e i valori iniziali sono giusti ($\Delta = 16$ e $\Delta = -36$). I cursori non sono stati mossi.

## Da cambiare in altre lezioni

- 93, sezione "Retta e parabola": si può aggiungere in fondo un rimando a questa lezione per le tangenti. Facoltativo.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Cinque piani, ognuno dopo una figura TikZ e con la risposta scritta subito dopo. Aperti a 390 px con i cursori ai valori iniziali, agli estremi e nei casi limite.

1. `retta-parabola-cursore-q` (c'era, esempio 1): aggiunta la risposta ($q = -2$, punto $T(4, 2)$).
2. `secante-per-p-diventa-tangente` (nuovo, esempio 2): la retta per $P(-2, 5)$ con il cursore $m$ e il secondo punto comune $Q$, che raggiunge $P$ per $m = -2$. È la dimostrazione di $m = 2ax_0 + b$ vista sul piano.
3. `fascio-per-p-tangente-parabola` (c'era, esempio 4): aggiunta la risposta ($m = -1$ e $m = 2$).
4. `parabole-per-due-punti-tangenti-cursore-a` (nuovo, esempio 6, con la figura nuova `due-parabole-tangenti-a-una-retta`): le parabole per $A$ e $B$ con il cursore $a$ e $\Delta$ scritto sotto; tangenti per $a = 0{,}25$ e $a = 1$, retta per $a = 0$.
5. `segmento-parabolico-cursore-k` (nuovo, esempio 7): la retta $y = k$ con $h$, corda e area scritte sotto; l'area non raddoppia con $h$, ed è zero per $k = 1$. La regione non è colorata: il blocco non disegna aree.

Scartati: la tangente che scorre lungo la parabola con il punto di contatto a cursore (avrebbe portato a sei piani, e il piano 2 mostra la stessa idea dal lato della dimostrazione); la parabola con asse orizzontale e la sua tangente (esempio 5: un caso solo, senza parametro utile); la tangente parallela a una retta data (è il piano 1 letto al contrario).

## Domande per Andrea

- La tangente in un punto con $m = 2ax_0 + b$: va bene darla come formula al terzo anno, o volete solo il metodo $\Delta = 0$ e la formula di sdoppiamento?
- Il segmento parabolico: lo tenete al terzo anno? E la formula $\frac{|a| \cdot |x_2 - x_1|^3}{6}$ è ammessa nelle verifiche, o volete solo "due terzi del rettangolo"?
- "Punto interno / esterno alla parabola": è la terminologia del vostro libro?
- Le tangenti alla parabola con asse orizzontale meritano un esempio (c'è, il 5) o sono troppo per questa lezione?
- Serve un esempio in cui dal punto non passa nessuna tangente (punto interno), con l'equazione in $m$ senza soluzioni?

## Da verificare

- I blocchi `grafico` su un telefono vero e muovendo i cursori.
- Larghezza delle formule in evidenza sul telefono: non misurata. La più lunga è il primo passaggio della dimostrazione di $m = 2ax_0 + b$.

Prerequisiti proposti: parabola-equazione, sistemi-secondo-grado, retta-fasci, funzioni-quadratiche.
