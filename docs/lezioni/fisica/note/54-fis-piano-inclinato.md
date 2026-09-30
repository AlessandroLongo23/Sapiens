# Note: Il moto lungo un piano inclinato

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 16, 30 settembre 2026). Conti rifatti in Python:
$9{,}8 \cdot 0{,}5 = 4{,}9$; $\sqrt{5/4{,}9} = 1{,}0102$ s, $\sqrt{2 \cdot 4{,}9 \cdot 2{,}5} = 4{,}9497$ m/s; $\sqrt{2 \cdot 9{,}8
\cdot 1{,}25} = 4{,}9497$; $9{,}8\,(0{,}5 - 0{,}2\cos 30^\circ) = 3{,}2026$, $\sqrt{2 \cdot 3{,}2026 \cdot 2{,}5} = 4{,}0016$;
$9{,}8 \cdot 0{,}3 = 2{,}94$; $\tan^{-1} 0{,}36 = 19{,}80^\circ$; $9{,}8\,(\sin 15^\circ - 0{,}4\cos 15^\circ) = -1{,}2500$,
$2/1{,}25 = 1{,}6$ s, $4/2{,}5 = 1{,}6$ m; $9{,}8\sin 20^\circ = 3{,}3518$, $3/3{,}3518 = 0{,}8950$ s, $9/6{,}7036 = 1{,}3426$ m;
$9{,}8\,(\sin 25^\circ + 0{,}3\cos 25^\circ) = 6{,}8062$, $25/13{,}612 = 1{,}8366$ m, $25/(2 \cdot 9{,}8\sin 25^\circ) = 3{,}018$
m, $\tan 25^\circ = 0{,}4663$, $9{,}8\,(\sin 25^\circ - 0{,}3\cos 25^\circ) = 1{,}4771$, $25/2{,}954 = 8{,}46$ m. Le figure con
le forze sono in scala ($P = 1{,}8$ cm, $F_v = P\cos\alpha$, $F_d = \mu_d F_v$, $F_{tot}$ la differenza lungo il piano);
il grafico velocità-tempo con i punti sui valori del conto ($3$ m/s, zero a $0{,}895$ s, $-3$ m/s a $1{,}790$ s).
`check.mts` passa.

## Struttura ed esempi

Il piano liscio ($F_{tot} = m g\sin\alpha$, $a = g\sin\alpha$, i casi limite, Galileo), l'avviso sul coseno; tempo e
velocità in fondo ($t = \sqrt{2l/a}$, $v = \sqrt{2al}$), l'esempio 1, la velocità che dipende solo dall'altezza (con il
rimando alla conservazione dell'energia), l'avviso sulla lunghezza e l'altezza; il piano con l'attrito
($a = g(\sin\alpha - \mu_d\cos\alpha)$, la domanda "parte?" con $\mu_s$ rimandata al primo anno), l'esempio 2, l'avviso
sulla forza premente; la tabella accelera, costante, rallenta con l'esempio 3 e la figura interattiva; il corpo lanciato
in salita (liscio: tempo, spazio, simmetria; esempio 4 con il grafico velocità-tempo; con l'attrito:
$g(\sin\alpha + \mu_d\cos\alpha)$ e la domanda se riscende), l'esempio 5, l'avviso sul verso dell'attrito.

## Scelte

- L'asse lungo il piano con il verso positivo in discesa per i corpi che scendono, in salita per quelli lanciati su:
  lo dico ogni volta. Le accelerazioni negative restano tali nell'esempio 3 ($-1{,}25$ m/s²).
- $v = \sqrt{2al}$ lo ricavo sostituendo il tempo, e poi dico che è la relazione senza il tempo della lezione 42
  ($v^2 = v_0^2 + 2a\Delta s$), che l'ha introdotta con lo spazio di frenata.
- Il corpo che rallenta (esempio 3) si ferma e resta fermo "perché di solito $\mu_d < \mu_s$": detto così, senza un
  caso contrario.
- Galileo e il piano inclinato: una frase, senza date (la data degli esperimenti, 1604 circa, è da verificare).

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `forze-blocco-piano-liscio-moto`, `forze-blocco-attrito-discesa`,
`grafico-velocita-rampa-liscia` (con la riga `% poi-interattivo:`), `forze-blocco-attrito-salita` (velocità blu,
accelerazione verde, opposte). Interattiva `piano-inclinato-moto-attrito` (`fisica/PianoInclinatoMoto.tsx`): piano di
$2{,}0$ m, inclinazione da $0^\circ$ a $45^\circ$, $\mu_d$ da $0$ a $0{,}80$; il bottone Spingi lancia il blocco in
discesa a $1{,}0$ m/s e da lì il moto segue le leggi orarie con $a = g(\sin\alpha - \mu_d\cos\alpha)$ (nessuna
integrazione); con $|\tan\alpha - \mu_d| < 0{,}005$ l'accelerazione si prende zero; un bottone mette $\mu_d = \tan\alpha$ al
centesimo; sotto, il grafico velocità-tempo che si traccia. Forze in scala per un blocco di $5$ kg.

## Esercizi

Generatore `fis-piano-inclinato`, cinque livelli (specifica in `specs/exercises/fis-piano-inclinato.md`), con la scena
`piano-inclinato` del primo anno.

## Domande per Andrea

- Nell'esempio 3 un'accelerazione negativa ($-1{,}25\,\text{m/s}^2$, "il blocco rallenta"): i ragazzi di seconda sono
  abituati al segno, o è meglio dire "decelerazione di $1{,}25\,\text{m/s}^2$" come fanno alcuni libri?
- La velocità in fondo $\sqrt{2gh}$ prima dell'energia: la anticipo con la cinematica e rimando alla conservazione
  dell'energia. Va bene, o è meglio lasciarla alla lezione sull'energia?
- Il corpo lanciato in salita con l'attrito e la domanda "resta o riscende?" (esempio 5): è un caso che si fa in seconda,
  o è troppo?
