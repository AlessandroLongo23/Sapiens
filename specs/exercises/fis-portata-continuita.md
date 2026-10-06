# La portata e l'equazione di continuità

Generatore: `fis-portata-continuita` (`src/lib/exercises/v2/generators/fis-portata-continuita.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_portata_continuita.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/98-fis-portata-continuita.md` (note in `docs/lezioni/fisica/note/98-fis-portata-continuita.md`).
Parti comuni ai quattro generatori dei fluidi in moto: `src/lib/exercises/v2/fis-fluidi-moto.ts` e
`scripts/exercises/checkers/_fis_fluidi_moto.py`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più: la definizione di portata, $q = S \cdot v$ con i
centimetri quadrati da convertire, la continuità con le sezioni, con i diametri (rapporto al quadrato), la portata di un
tubo circolare in litri al minuto, il condotto che si divide.

## Nomi dei livelli

1. La portata da volume e tempo
2. La portata da sezione e velocità
3. Il tubo che cambia sezione
4. Il tubo con i diametri
5. I litri al minuto di un tubo
6. Il tubo che si divide

## Regole comuni

- Risposta a scelta multipla (`choice`), quattro opzioni con l'unità dentro, tutte con due cifre significative.
- Dati con due cifre significative, mai con uno zero finale ambiguo ($11$-$99$, $1{,}1$-$9{,}9$, $0{,}11$-$0{,}99$).
- La risposta è il valore esatto (con $\pi$ dove serve) arrotondato a due cifre significative, mezzo in su, in un'unità
  che non chiede la notazione scientifica: $\text{L/s}$, $\text{L/min}$, $\text{m/s}$.
- Si scartano i casi in cui il valore esatto dista meno di $0{,}1$ unità dell'ultima cifra dal punto di arrotondamento
  (per esempio $2{,}45\ldots$ o $2{,}54\ldots$ con due cifre): chi usa $\pi = 3{,}14$ o tiene tre cifre in un passaggio
  deve arrivare alla stessa risposta. Si scartano anche le risposte che finiscono con uno zero ambiguo ($40$).
- I distrattori vengono dagli errori dei riquadri della lezione; quelli che distano meno dell'8% dalla risposta si
  scartano, e i posti vuoti si riempiono con la risposta moltiplicata per $1{,}25$, $0{,}75$, $1{,}5$, $0{,}6$, $2$, $0{,}4$.
- Conversioni: $1\,\text{cm}^2 \cdot 1\,\text{m/s} = 10^{-4}\,\text{m}^3/\text{s} = 0{,}1\,\text{L/s}$.
- Scena `tubo-sezioni` ai livelli 3 e 4: il tubo con i due tratti in scala (rapporto dei diametri), le etichette con i
  dati del testo e $v_2 = ?$. Le due frecce delle velocità sono lunghe uguali: il disegno non dà la risposta.

## Livello 1: la portata da volume e tempo

Un rubinetto, una pompa o una fontana riempie un recipiente da $V$ litri ($11$-$99$) in $\Delta t$ secondi ($11$-$99$).
$q = \Delta V / \Delta t$ in $\text{L/s}$. Distrattori: il rapporto rovesciato, la portata per $60$, la portata diviso $60$.

- "Una pompa riempie un bidone da $57\,\text{L}$ in $97\,\text{s}$. Qual è la portata della pompa?" Risposta
  $0{,}59\,\text{L/s}$; distrattori $1{,}7\,\text{L/s}$ (rovesciato), $35\,\text{L/s}$, $0{,}0098\,\text{L/s}$.
- "Una fontana riempie un secchio da $36\,\text{L}$ in $88\,\text{s}$." Risposta $0{,}41\,\text{L/s}$.

## Livello 2: la portata da sezione e velocità

Sezione in $\text{cm}^2$ ($1{,}1$-$25$), velocità in m/s ($0{,}5$-$6$), risposta in litri al secondo. Distrattori: i
$\text{cm}^2$ messi come sono ($\times 10$), $1\,\text{cm}^2$ preso per $10^{-2}\,\text{m}^2$ ($\times 100$), la sezione
divisa per la velocità.

- "In un tubo di sezione $5{,}8\,\text{cm}^2$ l'acqua scorre alla velocità di $2{,}1\,\text{m/s}$. Qual è la portata, in
  litri al secondo?" Risposta $1{,}2\,\text{L/s}$ ($12{,}18 \cdot 10^{-4}\,\text{m}^3/\text{s}$); distrattori $12\,\text{L/s}$,
  $0{,}28\,\text{L/s}$.
- "… $11\,\text{cm}^2$ … $3{,}6\,\text{m/s}$" Risposta $4{,}0\,\text{L/s}$.

## Livello 3: il tubo che cambia sezione

$v_2 = v_1 \cdot S_1 / S_2$. Il tubo si stringe (70%) o si allarga (30%); il rapporto tra la sezione grande e la piccola è
tra $1{,}5$ e $8$. Distrattori: il rapporto rovesciato, il rapporto al quadrato, la sua radice.

- "In un tubo di sezione $4{,}6\,\text{cm}^2$ l'acqua scorre a $0{,}63\,\text{m/s}$. Più avanti il tubo si stringe fino a una
  sezione di $1{,}4\,\text{cm}^2$. Con che velocità scorre l'acqua nel secondo tratto?" Risposta $2{,}1\,\text{m/s}$;
  distrattori $0{,}19\,\text{m/s}$, $6{,}8\,\text{m/s}$, $1{,}1\,\text{m/s}$.
- "… $1{,}5\,\text{cm}^2$ … $1{,}9\,\text{m/s}$ … si allarga fino a … $5{,}2\,\text{cm}^2$" Risposta $0{,}55\,\text{m/s}$.

## Livello 4: il tubo con i diametri

$v_2 = v_1 \cdot (D_1/D_2)^2$, diametri in centimetri o in millimetri (metà e metà), rapporto tra $1{,}3$ e $4$, $v_1$ da
$0{,}3$ a $3\,\text{m/s}$. Distrattori: i diametri non al quadrato (l'avviso della lezione), il rapporto rovesciato al
quadrato e non.

- "In un tubo di diametro $5{,}1\,\text{cm}$ l'acqua scorre a $0{,}33\,\text{m/s}$. Il tubo termina con un ugello di
  diametro $2{,}3\,\text{cm}$. Con che velocità esce l'acqua dall'ugello?" Risposta $1{,}6\,\text{m/s}$; distrattori
  $0{,}73\,\text{m/s}$ (senza quadrato), $0{,}067\,\text{m/s}$, $0{,}15\,\text{m/s}$.
- "… $4{,}8\,\text{cm}$ … $0{,}52\,\text{m/s}$ … $2{,}2\,\text{cm}$" Risposta $2{,}5\,\text{m/s}$.

## Livello 5: i litri al minuto di un tubo

$q = \pi r^2 v$ con $r = D/2$, diametro in cm ($1{,}1$-$5$), velocità da $0{,}2$ a $2{,}5\,\text{m/s}$, risposta in
$\text{L/min}$. Distrattori: il diametro al posto del raggio ($\times 4$), i litri al secondo, $\pi$ dimenticato.

- "In un tubo di diametro interno $4{,}6\,\text{cm}$ l'acqua scorre a $0{,}24\,\text{m/s}$. Quanti litri al minuto porta il
  tubo?" Risposta $24\,\text{L/min}$ ($23{,}9$); distrattori $96\,\text{L/min}$, $0{,}40\,\text{L/min}$, $7{,}6\,\text{L/min}$.
- "… $2{,}3\,\text{cm}$ … $1{,}4\,\text{m/s}$" Risposta $35\,\text{L/min}$.

## Livello 6: il tubo che si divide

Un tubo di diametro $D$ si divide in $n$ tubi uguali ($n = 2, 3, 4, 6$) di diametro $D_2$:
$v_2 = \dfrac{v}{n} \cdot \left(\dfrac{D}{D_2}\right)^2$. Rapporto dei diametri tra $1{,}2$ e $3{,}5$; si scartano i casi in
cui $(D/D_2)^2$ è entro il 15% da $n$ (la velocità non cambierebbe). Distrattori: i rami dimenticati, i diametri non al
quadrato, la velocità solo divisa per $n$.

- "Un tubo di diametro $6{,}2\,\text{cm}$ porta acqua alla velocità di $0{,}66\,\text{m/s}$ e si divide in $2$ tubi uguali,
  ciascuno di diametro $3{,}4\,\text{cm}$. Con che velocità scorre l'acqua in ciascuno dei tubi più piccoli?" Risposta
  $1{,}1\,\text{m/s}$; distrattori $2{,}2\,\text{m/s}$, $0{,}60\,\text{m/s}$, $0{,}33\,\text{m/s}$.
- "… $2{,}2\,\text{cm}$ … $0{,}52\,\text{m/s}$ … $6$ tubi … $1{,}1\,\text{cm}$" Risposta $0{,}35\,\text{m/s}$.

## Da evitare

- Dati con tre cifre o con zeri finali ambigui; risposte sopra $99$ o sotto $0{,}001$, che chiederebbero la notazione
  scientifica.
- Tubi che si stringono così poco che la velocità cambia meno del 50% (rapporto delle sezioni sotto $1{,}5$).
- Esempi della lezione senza esercizio: il tempo per riempire un volume a partire dal diametro (esempio 4, seconda
  parte) e i capillari con la sezione totale (esempio 5).
