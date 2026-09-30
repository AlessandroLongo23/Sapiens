# Note: La forza centripeta

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 16, 30 settembre 2026). Conti rifatti in Python:
$0{,}2 \cdot 16/0{,}8 = 4{,}0$ N ($16$ N a $8$ m/s); $\sqrt{0{,}8 \cdot 9{,}8 \cdot 50} = 19{,}799$ m/s $= 71{,}28$ km/h,
$\sqrt{0{,}4 \cdot 9{,}8 \cdot 50} = 14{,}0$ m/s $= 50{,}4$ km/h; $0{,}2 \cdot 9{,}8 = 1{,}96$ N,
$\sqrt{1{,}96 \cdot 0{,}5/0{,}1} = 3{,}1305$ m/s; $\sqrt{9{,}8 \cdot 0{,}9} = 2{,}970$ m/s; Luna: $T = 27{,}3 \cdot 86\,400 =
2{,}3587 \cdot 10^6$ s, $4\pi^2 \cdot 3{,}84 \cdot 10^8 / T^2 = 2{,}725 \cdot 10^{-3}$ m/s², $9{,}8/3600 = 2{,}722 \cdot 10^{-3}$,
$384\,400/6371 = 60{,}3$. `check.mts` passa.

## Struttura ed esempi

Quanto vale la forza centripeta ($m v^2/r$ e $m\omega^2 r$), la figura, l'esempio 1 (pallina legata sul tavolo),
l'avviso sul quadrato con il controllo delle unità; chi fa da forza centripeta (tensione, attrito statico, peso,
reazione vincolare), gli esempi 2 (auto in curva, velocità massima) e 3 (disco e pesetto, la tensione uguale al peso
del pesetto fermo); il secchio in cima al giro verticale ($T + mg = mv^2/r$, velocità minima); la nota sulla Luna e la
mela; se il filo si spezza (la tangente, la mola, l'auto sul ghiaccio), l'avviso sulla forza centrifuga con il rimando
alle forze apparenti del terzo anno; la figura interattiva.

## Scelte

- La forza centripeta come "compito" di una forza vera, non come una forza a sé: è il punto su cui insisto di più.
- Il giro in verticale è solo nel punto più alto, con la nota che il moto non è uniforme ma che lì l'accelerazione
  verso il centro è ancora $v^2/r$. Il punto più basso non c'è.
- La nota sulla Luna anticipa la gravitazione in poche righe. Dati: raggio medio dell'orbita $3{,}844 \cdot 10^5$ km,
  periodo siderale $27{,}32$ giorni, raggio terrestre medio $6371$ km (valori standard, da verificare sulla fonte che
  userà il capitolo della gravitazione).
- La curva sopraelevata non c'è: nel biennio richiede di scomporre la reazione vincolare, e allunga molto.

## Figure

Due TikZ, guardate in chiaro e in scuro: `forza-centripeta-filo-dall-alto` (velocità tangente, tensione verso il
centro), `filo-spezzato-tangente` (la pallina che prosegue lungo la tangente, tre posizioni equidistanti).
Interattiva `forza-centripeta-filo-spezzato` (`fisica/FiloSpezzato.tsx`): pallina di $0{,}20$ kg vista dall'alto,
velocità da $0{,}5$ a $3{,}0$ m/s, raggio da $0{,}5$ a $1{,}0$ m, tensione in scala ($0{,}3$ cm/N), il giro mostrato tre volte
più lento del vero, il bottone che spezza il filo e la pallina che prosegue lungo la tangente.

## Esercizi

Generatore `fis-forza-centripeta`, cinque livelli (specifica in `specs/exercises/fis-forza-centripeta.md`), senza
scene.

## Domande per Andrea

- La forza centrifuga: nella lezione dico che vista da terra non c'è, e rimando alle forze apparenti del terzo anno.
  Va bene nominarla già in seconda, o è meglio non nominarla affatto?
- La curva sopraelevata (con la reazione vincolare inclinata) si fa in seconda?
- Il secchio in cima al giro verticale è un esempio adatto, o il moto non uniforme confonde?
- La nota sulla Luna e la mela: la teniamo qui come anticipazione o la lasciamo tutta alla gravitazione?
