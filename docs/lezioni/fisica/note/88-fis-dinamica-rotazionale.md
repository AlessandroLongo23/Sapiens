# Note: Momento torcente e dinamica delle rotazioni

Lezione nuova (lotto del terzo anno, gruppo 34, 6 ottobre 2026). Conti rifatti in Python: $4{,}5 \cdot 0{,}25 = 1{,}125$,
$\frac{1}{2} \cdot 2{,}0 \cdot 0{,}25^2 = 0{,}0625$, $1{,}125/0{,}0625 = 18$, $18 \cdot 3{,}0 = 54$ rad/s, $54/2\pi = 8{,}59$ giri/s;
$0{,}75 \cdot 12 \cdot \sin 60^\circ = 7{,}794$, $7{,}794/3{,}8 = 2{,}051$, $9{,}0/3{,}8 = 2{,}37$; $-15/2{,}5 = -6{,}0$,
$0{,}12 \cdot 6{,}0 = 0{,}72$, $0{,}72/0{,}31 = 2{,}32$; $(1{,}125 - 0{,}225)/0{,}0625 = 14{,}4$; secchio: $19{,}6/4{,}0 = 4{,}9$,
$T = 9{,}8$, $\alpha = 49$; Atwood: $9{,}8/3{,}5 = 2{,}8$, $T_1 = 12{,}6$, $T_2 = 14{,}0$, $T_2 - T_1 = 1{,}4 = 0{,}50 \cdot 2{,}8$,
carrucola ideale $3{,}27$ m/s² e $13{,}07$ N; $0{,}40 \cdot 20 - 0{,}30 \cdot 10 = 5{,}0$, $r = 0{,}50$, $F = 22{,}36$,
$\varphi = 26{,}57^\circ$, $0{,}50 \cdot 22{,}36 \cdot 0{,}4472 = 5{,}0$. `check.mts`: 0 errori; un avviso sul titolo "La
macchina di Atwood con la carrucola pesante" (maiuscola "all'inglese"): è il nome proprio Atwood, e l'ho lasciato.

## Confini

- Il momento di una forza è del primo anno (lezione 22): qui è richiamato in mezza pagina, con il nome "momento
  torcente" del titolo, l'angolo chiamato $\varphi$ (README) e il segno. Nuovo: $M_{tot} = I\,\alpha$, la carrucola con
  massa, il momento come prodotto vettoriale.
- La derivazione di $M_{tot} = I\,\alpha$ parte dal risultato per la pallina della lezione 87 e somma sui pezzetti; le
  forze interne si cancellano a coppie.
- Il prodotto vettoriale è della 71: qui c'è solo l'applicazione al momento, con il verso ($\odot$, $\otimes$) e la
  componente $M_z = r_x F_y - r_y F_x$.
- Lavoro ed energia nelle rotazioni e il rotolamento sono della 89, il momento angolare della 90: solo i link in fondo.
  Niente rotolamento su piano inclinato, niente yo-yo.

## Scelte

- Nell'esempio 1 la massa del disco è $m$ e non $M$, per non confonderla con il momento $M$ nella stessa formula;
  negli esempi con la carrucola $M$ è la massa della carrucola, come nei libri, e il momento non compare con la sua
  lettera (si scrive $T\,R$ e $I\,\alpha$). È il punto più delicato della notazione: vedi la prima domanda.
- La tensione è $T$ ($T_1$, $T_2$): in questa lezione non c'è il periodo.
- La lezione 52 enuncia il terzo principio con "stesso modulo, stessa direzione e verso opposto". Perché i momenti
  delle forze interne si cancellino serve anche che le due forze stiano sulla stessa retta: la lezione lo dice a parte
  ("nei corpi rigidi, poi, le due forze agiscono lungo la stessa retta, quella che congiunge i due pezzetti"), come
  ipotesi in più e non come parte del principio.
- L'equilibrio del corpo rigido è presentato come caso particolare ($M_{tot} = 0$), con il link alla 23.
- Le figure del secchio e della macchina di Atwood hanno le forze in scala ($1$ cm ogni $10$ N).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `mola-forza-tangente`, `porta-spinta-obliqua` (scala $5$ cm per metro,
forza $1$ cm per $6$ N: punta in $(4{,}75;\ 1{,}732)$), `secchio-carrucola-con-massa` ($T = 0{,}98$ cm,
$m g = 1{,}96$ cm), `atwood-carrucola-con-massa` ($T_1 = 1{,}26$, $T_2 = 1{,}40$, pesi $0{,}98$ e $1{,}96$ cm),
`momento-prodotto-vettoriale` (angoli di $\vec r$ e $\vec F$: $18{,}4^\circ$ e $78{,}1^\circ$).

Interattiva `carrucola-massa-secchio` (`fisica/CarrucolaMassaSecchio.tsx`). Domanda: che cosa succede
all'accelerazione del secchio quando la carrucola diventa più pesante? Risposta nel testo: con la carrucola senza massa
$a = g$ e la fune non è tesa; con $M = 2m$ l'accelerazione è $g/2$, con $M = 6m$ è $g/4$; conta solo il rapporto tra le
masse. Cursori: carrucola da $0$ a $8$ kg, secchio da $1$ a $4$ kg; il secchio scende di $1{,}5$ m. La carrucola è
disegnata più grande del vero (raggio $0{,}10$ m), con un raggio segnato che la mostra girare.

## Esercizio guidato

L'esempio 4 (il secchio del pozzo). Si fermerebbe in tre punti: quali forze agiscono sul secchio e con quale segno;
quale forza dà momento sulla carrucola e con quale braccio; come si lega $\alpha$ ad $a$.

## Esercizi

Generatore `fis-dinamica-rotazionale`, sei livelli (specifica in `specs/exercises/fis-dinamica-rotazionale.md`), con le
scene esistenti `asta-forze` (livello 3, angoli da $30^\circ$ in su: sotto, la scena scrive l'angolo sopra la freccia) e
`corpi-collegati` (livello 6). Il momento dalle componenti dell'esempio 6
non ha un esercizio.

## Da verificare

- Momento d'inerzia di una ruota di bicicletta, $0{,}12\,\text{kg} \cdot \text{m}^2$, e raggio del cerchione
  $0{,}31$ m: valori plausibili scritti a memoria.
- Momento d'inerzia della porta, $3{,}8\,\text{kg} \cdot \text{m}^2$: è quello dell'esempio 4 della lezione 87
  ($3{,}84$, porta di $18$ kg larga $0{,}80$ m).
- Il nome "momento torcente": nei libri italiani è usato come sinonimo di momento di una forza nelle rotazioni; il
  titolo della lezione viene dall'albero.

## Domande per Andrea

- La lettera $M$ è sia il momento della forza (dal primo anno) sia la massa della carrucola o del disco: preferisci
  $\tau$ per il momento torcente, come i libri americani, o $m_c$ per la massa della carrucola?
- La dimostrazione di $M_{tot} = I\,\alpha$ con i pezzetti e le forze interne che si cancellano (con l'ipotesi che le
  forze interne stiano sulla retta che congiunge i due pezzetti): va bene così, o al terzo anno si enuncia soltanto?
- Nella macchina di Atwood con la carrucola pesante si chiedono in verifica le due tensioni, o basta l'accelerazione?
- La sezione "Il momento come vettore" sta in fondo, dopo le carrucole: la vuoi subito dopo il richiamo del momento,
  prima del secondo principio?
- Serve un esempio con due momenti di segno opposto sulla stessa ruota (forza motrice e attrito), oltre al riquadro
  che lo accenna?

Prerequisiti proposti: fis-momento-inerzia, fis-cinematica-rotazionale, fis-momento-forza, fis-corpi-collegati
