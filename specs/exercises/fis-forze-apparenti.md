# Le forze apparenti: forza centrifuga e forza di Coriolis

Generatore: `fis-forze-apparenti` (`src/lib/exercises/v2/generators/fis-forze-apparenti.ts`, con
`src/lib/exercises/v2/fis-riferimenti.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_forze_apparenti.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/75-fis-forze-apparenti.md`. Percorso nel database:
`high_school/physics/fis-relativita-galileiana/fis-forze-apparenti`.

Sette livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La forza apparente
2. La valigia che scivola
3. Il pacco in ascensore
4. La forza centrifuga
5. La centrifuga dal periodo o dai giri al minuto
6. La moneta sul piatto che ruota
7. Da che parte devia la forza di Coriolis

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($15\,\text{N}$, $4{,}2\,\text{m/s}^2$, $4{,}5\,\text{rad/s}$), un numero puro per
il coefficiente di attrito, parole al livello 7. Dati con due cifre significative, $g = 9{,}8\,\text{m/s}^2$, risultati a
due cifre, mai con uno zero finale ambiguo; un distrattore a meno dell'8% dalla risposta si scarta.

## Livello 1: la forza apparente

Autobus che frena o parte (metà ciascuno) con $1{,}1$-$4{,}9\,\text{m/s}^2$, zaino di $2{,}0$-$9{,}9\,\text{kg}$ su un sedile:
$F_{app} = m\,A$. La soluzione dice il verso: in avanti se frena, all'indietro se parte.

- "Un autobus frena con un'accelerazione di modulo $3{,}5\,\text{m/s}^2$. Quanto vale, nel sistema dell'autobus, la forza
  apparente su uno zaino di $4{,}2\,\text{kg}$ appoggiato su un sedile?" Risposta $15\,\text{N}$ ($14{,}7$); distrattori
  $41\,\text{N}$ (il peso), $1{,}2\,\text{N}$ ($m/A$), $26\,\text{N}$ ($m\,(g - A)$), $56\,\text{N}$ ($m\,(g + A)$).
- Autobus che parte con $1{,}8\,\text{m/s}^2$, zaino di $6{,}5\,\text{kg}$: $12\,\text{N}$, all'indietro.

## Livello 2: la valigia che scivola

Valigia di $5{,}0$-$25\,\text{kg}$ sul pavimento dell'autobus (la massa è un dato in più). Metà: frenata massima
$A = \mu_s\,g$ con $\mu_s = 0{,}15$-$0{,}60$. Metà: $\mu_s = A/g$ con $A = 1{,}5$-$5{,}9\,\text{m/s}^2$.

- "Una valigia di $18\,\text{kg}$ è appoggiata sul pavimento di un autobus; il coefficiente di attrito statico è
  $\mu_s = 0{,}35$. Qual è la frenata più forte che l'autobus può fare senza che la valigia scivoli?" Risposta
  $3{,}4\,\text{m/s}^2$; distrattori $62\,\text{m/s}^2$ (la massa lasciata dentro), $28\,\text{m/s}^2$ ($g/\mu_s$), $6{,}3$,
  $0{,}036$.
- "Una valigia di $12\,\text{kg}$, appoggiata sul pavimento di un autobus, comincia a scivolare quando la frenata supera
  $4{,}1\,\text{m/s}^2$. Quanto vale il coefficiente di attrito statico tra la valigia e il pavimento?" Risposta $0{,}42$;
  distrattori $2{,}4$ ($g/A$), $5{,}0$ ($A\,m/g$), $0{,}34$ ($A/m$).

## Livello 3: il pacco in ascensore

Pacco di $1{,}1$-$7{,}9\,\text{kg}$, ascensore che accelera verso l'alto o verso il basso (metà ciascuno) con
$1{,}1$-$3{,}5\,\text{m/s}^2$: $F_v = m\,(g \pm A)$.

- "Un pacco di $5{,}4\,\text{kg}$ è sul pavimento di un ascensore che accelera verso l'alto con $1{,}8\,\text{m/s}^2$. Con
  quale forza il pavimento sostiene il pacco?" Risposta $63\,\text{N}$; distrattori $43\,\text{N}$ (il segno scambiato),
  $53\,\text{N}$ (il peso), $9{,}7\,\text{N}$ ($m\,A$).
- Verso il basso con $2{,}0\,\text{m/s}^2$, pacco di $1{,}2\,\text{kg}$: $9{,}4\,\text{N}$.

## Livello 4: la forza centrifuga

$\omega = 1{,}5$-$6{,}0\,\text{rad/s}$, massa $0{,}11$-$5{,}0\,\text{kg}$, distanza $0{,}50$-$3{,}0\,\text{m}$ ma non tra $0{,}75$ e
$1{,}3\,\text{m}$ (vicino a $1\,\text{m}$ le formule sbagliate danno quasi lo stesso numero): $F_{cf} = m\,\omega^2 r$.

- "Una piattaforma ruota con velocità angolare $2{,}5\,\text{rad/s}$. Su di essa è fermo un oggetto di $0{,}80\,\text{kg}$, a
  $1{,}6\,\text{m}$ dall'asse. Quanto vale la forza centrifuga sull'oggetto, nel sistema della piattaforma?" Risposta
  $8{,}0\,\text{N}$; distrattori $3{,}2\,\text{N}$ ($\omega$ non al quadrato), $3{,}1\,\text{N}$ (diviso $r$), $5{,}1\,\text{N}$,
  $13\,\text{N}$.
- $\omega = 4{,}0\,\text{rad/s}$, $m = 0{,}25\,\text{kg}$, $r = 0{,}60\,\text{m}$: $2{,}4\,\text{N}$.

## Livello 5: la centrifuga dal periodo o dai giri al minuto

Metà: giostra con un giro ogni $3{,}0$-$9{,}9\,\text{s}$, zaino di $1{,}1$-$9{,}9\,\text{kg}$ a $1{,}5$-$4{,}0\,\text{m}$,
$\omega = 2\pi/T$. Metà: piatto a $24$-$96$ giri al minuto (tra cui $33$, $45$, $78$), oggetto di $0{,}11$-$0{,}99\,\text{kg}$ a
$0{,}11$-$0{,}45\,\text{m}$, $\omega = 2\pi\,n/60$.

- "Una giostra fa un giro ogni $7{,}3\,\text{s}$. Su un sedile, a $3{,}3\,\text{m}$ dall'asse, è appoggiato uno zaino di
  $3{,}7\,\text{kg}$..." Risposta $9{,}0\,\text{N}$; distrattori $0{,}23\,\text{N}$ ($2\pi$ dimenticato), $11\,\text{N}$ ($\omega$
  non al quadrato), $0{,}83\,\text{N}$ (diviso $r$).
- "Un piatto fa $45$ giri al minuto. Su di esso è fermo un oggetto di $0{,}20\,\text{kg}$, a $0{,}15\,\text{m}$ dall'asse..."
  $\omega = 4{,}712\,\text{rad/s}$, risposta $0{,}67\,\text{N}$; distrattori $0{,}017\,\text{N}$ ($2\pi$ dimenticato),
  $0{,}14\,\text{N}$, $61\,\text{N}$ (i giri al minuto usati come $\omega$).

## Livello 6: la moneta sul piatto che ruota

$\mu_s = 0{,}15$-$0{,}60$. Metà: velocità angolare massima a $0{,}11$-$0{,}45\,\text{m}$ dall'asse, $\omega = \sqrt{\mu_s g/r}$.
Metà: distanza massima con $\omega = 2{,}0$-$9{,}9\,\text{rad/s}$, $r = \mu_s g/\omega^2$.

- "Una moneta è appoggiata su un piatto che ruota, a $0{,}12\,\text{m}$ dall'asse; il coefficiente di attrito statico è
  $\mu_s = 0{,}40$. Fino a quale velocità angolare la moneta resta ferma sul piatto?" Risposta $5{,}7\,\text{rad/s}$;
  distrattori $0{,}69$ ($\sqrt{\mu_s g r}$), $33$ (la radice dimenticata), $14$, $0{,}58\,\text{rad/s}$.
- "Un piatto ruota a $3{,}5\,\text{rad/s}$; tra il piatto e una moneta il coefficiente di attrito statico è
  $\mu_s = 0{,}30$. Fino a quale distanza dall'asse la moneta, appoggiata sul piatto, resta ferma?" Risposta
  $0{,}24\,\text{m}$; distrattori $0{,}84$, $4{,}2$, $0{,}49$, $0{,}024\,\text{m}$.

## Livello 7: da che parte devia la forza di Coriolis

Domande a parole su casi generati, con le stesse quattro opzioni: "verso destra", "verso sinistra", "è nulla", "verso
l'esterno". Il 40%: una palla lanciata su una piattaforma che ruota in senso antiorario (destra) o orario (sinistra). Il
40%: un vento, una corrente marina o un proiettile a lunga gittata che si muove verso nord, sud, est o ovest
nell'emisfero nord (destra) o sud (sinistra). Il 20%: una cassa ferma sulla piattaforma (è nulla; "verso l'esterno" è la
centrifuga).

- "Una piattaforma ruota in senso orario, vista dall'alto, a $0{,}40\,\text{rad/s}$. Una palla viene lanciata sul suo piano
  liscio. Vista dalla piattaforma, da che parte la forza di Coriolis devia la palla, rispetto al verso del suo moto?"
  Risposta "verso sinistra".
- "Una corrente marina si muove verso ovest nell'emisfero sud, lontano dall'equatore. Da che parte la devia la forza di
  Coriolis, rispetto al verso del moto?" Risposta "verso sinistra".

## Esercizi da evitare

- Forze sopra i $100\,\text{N}$, che con due cifre chiederebbero la notazione scientifica (per questo lo zaino e non il
  passeggero dell'esempio 1).
- Al livello 4 una distanza vicina a $1\,\text{m}$ o $\omega$ vicina a $1\,\text{rad/s}$.
- Al livello 7 moti "all'equatore", dove la deviazione orizzontale si annulla, e domande sul lavandino.

## Verifica

`fis_forze_apparenti.py` rilegge il testo, controlla intervalli e cifre, ricalcola con SymPy esatto ($\pi$ compreso) e
confronta risposta e opzioni; al livello 1 controlla anche il verso scritto nell'ultimo passaggio, al livello 7 ricava
la risposta dal verso di rotazione o dall'emisfero.

## Senza esercizio

Il pendolo visto dall'auto (esempio 2) è il livello 4 del generatore della lezione 72 e non si ripete. Gli esempi 7
(centrifuga della Terra) e 8 (di quanto la palla manca il bambino) non hanno un livello. Nessuna scena: una scena per
la piattaforma vista dall'alto renderebbe il livello 7 più chiaro, ma il verso della deviazione è la risposta.

## Domande per la revisione

- Il livello 2 mette la massa della valigia tra i dati anche se si semplifica: è un dato in più voluto. Va bene?
- Al livello 7 la regola è "a destra del moto nell'emisfero nord" per ogni direzione: serve un livello in più che chieda
  il punto cardinale ("un vento verso nord nell'emisfero nord devia verso est")?
