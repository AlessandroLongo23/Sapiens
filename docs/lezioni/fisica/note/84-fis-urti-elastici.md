# Note: Gli urti elastici in una e in due dimensioni

Lezione nuova (lotto del terzo anno, gruppo 33, 6 ottobre 2026). `check.mts` passa senza avvisi. Conti rifatti in Python:

- esempio 1: $V_1 = (4{,}0 - 8{,}0)/4{,}0 = -1{,}0$ m/s, $V_2 = (8{,}0 + 12)/4{,}0 = 5{,}0$ m/s; quantità di moto $2{,}0$
  kg·m/s prima e dopo; energie $6{,}0 + 8{,}0 = 14$ J e $1{,}5 + 12{,}5 = 14$ J; velocità relativa $6{,}0$ e $-6{,}0$
  m/s; con $v_2 = +4{,}0$: $V_1 = 3{,}0$, $V_2 = 1{,}0$ m/s;
- esempio 2: $1{,}0$ e $4{,}0$ m/s ($9{,}0 = 1{,}0 + 8{,}0$ J); con le masse scambiate $-1{,}0$ e $2{,}0$ m/s
  ($4{,}5 = 0{,}5 + 4{,}0$ J);
- esempio 3: $2{,}0\cos 30^\circ = 1{,}732$, $2{,}0\sin 30^\circ = 1{,}0$ m/s; componenti $1{,}5 + 0{,}5 = 2{,}0$ e
  $0{,}866 - 0{,}866 = 0$; quadrati $3{,}0 + 1{,}0 = 4{,}0$;
- esempio 4: $V_{2x} = 2{,}00$, $V_{2y} = -0{,}893$, $V_2 = 2{,}190$ m/s, $24{,}07^\circ$; $K_i = 0{,}900$ J,
  $K_f = 0{,}1796 + 0{,}7194 = 0{,}899$ J. Il dato $1{,}34$ m/s viene da $v_1\sqrt{(m_2 - m_1)/(m_2 + m_1)} = 1{,}3416$
  m/s, la velocità che un urto elastico dà al primo disco quando devia di $90^\circ$.

## Struttura ed esempi

Definizione di urto elastico e il modello; l'urto centrale come sistema di due equazioni; la dimostrazione delle
velocità finali (differenza di quadrati, divisione membro a membro, velocità relativa che si inverte, sistema
lineare); esempio 1 con i due carrelli che si vengono incontro e i tre controlli, un `ad-tip` e l'avviso sul segno;
il bersaglio fermo (esempio 2 con le masse scambiate, tabella dei tre casi particolari con la figura, il muro,
interattiva, avviso sull'energia che non passa tutta); l'urto nel piano (sistema di tre equazioni, quattro incognite,
figura); masse uguali e regola dei $90^\circ$ dimostrata con l'inverso del teorema di Pitagora (figura del triangolo,
esempio 3, interattiva); masse diverse (esempio 4, "l'urto è stato elastico?", avviso sulle tre condizioni).

## Scelte

- Confini. La tabella dei tipi di urto è nella 83 e qui non si ripete. Il sistema del centro di massa non si usa
  (lezione 85, solo nominato): la regola dei $90^\circ$ è dimostrata con il triangolo delle velocità.
- La dimostrazione delle velocità finali è data per intero, come chiede il brief, con i link ai prodotti notevoli e
  ai sistemi lineari.
- "Urto centrale" per l'urto lungo una retta: è il termine dei libri; lo uso una volta, poi "lungo una retta".
- Nel piano gli angoli finali sono $\theta_1$ e $\theta_2$, presi da parti opposte dell'asse e tutti e due positivi,
  così lo studente lavora con angoli acuti (non ha ancora la goniometria). Il README non fissa i simboli degli angoli
  degli urti.
- L'esempio 4 chiede di verificare se un urto è elastico: è l'uso più frequente delle tre equazioni nei problemi con
  masse diverse, e non chiede di risolvere un sistema non lineare. Ha i dati con tre cifre, perché con due il
  confronto tra $K_i$ e $K_f$ non sarebbe significativo.
- Il rallentamento dei neutroni nei reattori, esempio classico dei tre casi, non c'è: sta meglio nel quinto anno.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `urto-elastico-prima-dopo` (0,5 cm per m/s: 1,0, 2,0, 0,5 e 2,5 cm),
`urto-elastico-tre-casi` (frecce 0,9 cm per $v_1$: dopo, 0,9, poi 0,85 e 1,75, poi 0,88 all'indietro),
`urto-biliardo-angoli` (1,2 cm per m/s: 2,4, 2,08 e 1,2 cm, a $30^\circ$ e $-60^\circ$), `triangolo-velocita-urto`
(ipotenusa 4 cm, cateti $4\cos 30^\circ$ e $4\sin 30^\circ$; copiata nel formulario).

Interattive:

- `urto-elastico-masse` (`fisica/UrtoElasticoMasse.tsx`). Domanda: in che verso riparte il primo carrello, al variare
  delle due masse? Cursori per le masse (da 0,5 a 4 kg) e per la velocità con cui il secondo viene incontro (da 0 a 2
  m/s); il primo parte sempre a 2 m/s. Sotto, $V_1$, $V_2$, $p_{tot}$ e $K_{tot}$.
- `biliardo-urto-angoli` (`fisica/BiliardoUrtoAngoli.tsx`). Domanda: come cambiano le due direzioni dopo l'urto se la
  bianca colpisce più o meno di striscio? Un cursore sposta di lato la traiettoria della bianca (frazione $s$ dei due
  raggi); con bocce lisce uguali la boccia colpita parte lungo la retta dei centri, con $\sin\theta_2 = s$, e la bianca
  a $90^\circ$ da lei. Il modello (bocce lisce, niente effetto) è detto nel commento del file, non nella lezione.

Guardate: `urto-elastico-masse` in chiaro dopo l'urto e in scuro da telefono ferma; `biliardo-urto-angoli` in chiaro
dopo il colpo. Gli screenshot che mancano sono nel rapporto (il sito di sviluppo andava spesso in timeout).

## Esercizio guidato

L'esempio 1 (due carrelli che si vengono incontro). Si fermerebbe in tre punti: (1) "Che segno ha $v_2$?" (negativo);
(2) "Quanto vale il numeratore di $V_1$?" ($4{,}0 - 8{,}0$); (3) "Come controlli il risultato senza rifare le
energie?" (velocità relativa opposta).

## Esercizi

Generatore `fis-urti-elastici`, cinque livelli (specifica in `specs/exercises/fis-urti-elastici.md`): La velocità del
corpo colpito, Il primo corpo prosegue o torna indietro, Due corpi che si vengono incontro, Le direzioni dopo un colpo
di striscio, Le velocità dopo un colpo di striscio. Scena `vettori-piano` ai livelli 4 e 5. Senza esercizio:
l'esempio 4 (urto nel piano tra masse diverse) e $V_2$ nell'urto frontale con tutti e due in moto.

## Da verificare

- Che l'Amaldi chiami "urto centrale" l'urto lungo una retta, e che dia la regola dei $90^\circ$ nel testo e non solo
  negli esercizi.
- Velocità della boccia da biliardo, $2{,}0$ m/s: plausibile, a memoria.

## Domande per Andrea

- La dimostrazione delle formule di $V_1$ e $V_2$ è nel testo per intero. Va bene, o la vuoi in un riquadro che si
  può saltare?
- Gli angoli $\theta_1$ e $\theta_2$ presi tutti e due positivi, da parti opposte: è la convenzione che usi?
- L'esempio 4 ha tre cifre significative, diversamente dal resto del capitolo. Lo tengo?
- Vuoi un cenno al pendolo di Newton con due sfere lanciate insieme, o basta la riga di apertura?

Prerequisiti proposti: fis-urti-anelastici, fis-conservazione-quantita-moto, fis-energia-cinetica, fis-seno-coseno
