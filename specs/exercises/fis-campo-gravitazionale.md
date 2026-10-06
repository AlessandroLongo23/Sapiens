# Il campo gravitazionale

Generatore: `fis-campo-gravitazionale` (`src/lib/exercises/v2/generators/fis-campo-gravitazionale.ts`, con
`src/lib/exercises/v2/fis-campo-orbite.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_campo_gravitazionale.py` (con `_fis_campo_orbite.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/95-fis-campo-gravitazionale.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-campo-gravitazionale`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il campo dalla forza su una massa
2. Il campo alla superficie di un pianeta
3. Il campo a una certa quota
4. Ragionare con i rapporti
5. Il campo di due corpi

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($8{,}65\,\text{N/kg}$, $1{,}14 \cdot 10^{-3}\,\text{N/kg}$). Dati e
risultati con tre cifre significative, come le costanti della lezione. Un numero si scrive senza potenza di dieci tra
$0{,}1$ e $1000$ ($9{,}81$; $24{,}8$; $274$; $0{,}613$), altrimenti in notazione scientifica con `\cdot`
($5{,}97 \cdot 10^{24}$); un intero che finirebbe con uno zero ambiguo va in notazione scientifica
($2{,}70 \cdot 10^{2}$). La mantissa dei dati non finisce con zero. $G = 6{,}67 \cdot 10^{-11}\,\text{N} \cdot
\text{m}^2/\text{kg}^2$. Le risposte non stanno mai a meno di $10^{-6}$ (relativo) da un confine di arrotondamento.

## Regole comuni

- Formule della lezione: $g = F/m$; $g = G M / r^2$ con $r$ dal centro; a quota $h$, $r = R + h$; a $n$ raggi dal
  centro $g = g_0 / n^2$; due sorgenti: somma vettoriale, e su un punto del segmento dei centri i moduli si
  sottraggono.
- I corpi celesti sono inventati ma possibili: massa tra $10^{22}$ e $10^{27}\,\text{kg}$, raggio di una sfera con
  densità tra $1000$ e $6000\,\text{kg/m}^3$. Il corpo si chiama "una luna" solo sotto $10^{24}\,\text{kg}$, "un
  pianeta extrasolare" solo da lì in su, "un pianeta" sempre.
- I distrattori che distano meno del $3\%$ dalla risposta si scartano; se ne restano meno di tre si completano con la
  risposta moltiplicata per $1{,}5$, $0{,}5$, $2{,}5$, $0{,}25$.
- Scena `orbita-pianeta` solo al livello 3: il corpo con il suo raggio, il punto a quota $h$ in scala, i due dati
  scritti sotto. Non disegna il campo.

## Livello 1: il campo dalla forza su una massa

Sonda da $101$ a $999\,\text{kg}$, campo tra $1$ e $30\,\text{N/kg}$; la forza è il prodotto arrotondato a tre cifre.

- "In un punto vicino a un pianeta una sonda di $577\,\text{kg}$ è attirata con una forza di $4{,}99 \cdot
  10^{3}\,\text{N}$. Quanto vale il campo gravitazionale in quel punto?" Risposta $8{,}65\,\text{N/kg}$; distrattori
  $0{,}116\,\text{N/kg}$ ($m/F$, il rapporto rovesciato), $2{,}88 \cdot 10^{6}\,\text{N/kg}$ ($F \cdot m$),
  $509\,\text{N/kg}$ ($F / 9{,}8$, una massa al posto di un campo).
- Con $169\,\text{kg}$ e $4{,}02 \cdot 10^{3}\,\text{N}$: risposta $23{,}8\,\text{N/kg}$.

## Livello 2: il campo alla superficie di un pianeta

- "Un pianeta ha massa $1{,}69 \cdot 10^{25}\,\text{kg}$ e raggio $8{,}91 \cdot 10^{6}\,\text{m}$. Quanto vale il
  campo gravitazionale alla sua superficie?" Risposta $14{,}2\,\text{N/kg}$; distrattori $1{,}27 \cdot
  10^{8}\,\text{N/kg}$ ($G M / R$, il quadrato dimenticato), $3{,}55\,\text{N/kg}$ (il diametro al posto del raggio),
  $2{,}13 \cdot 10^{11}\,\text{N/kg}$ ($M / R^2$, senza $G$).
- Con $5{,}77 \cdot 10^{25}\,\text{kg}$ e $1{,}52 \cdot 10^{7}\,\text{m}$: risposta $16{,}7\,\text{N/kg}$.

## Livello 3: il campo a una certa quota

Quota tra $0{,}08$ e $2{,}5$ raggi, arrotondata a tre cifre. La difficoltà nuova è $r = R + h$, con due numeri in
notazione scientifica che possono avere esponenti diversi.

- Con $M = 1{,}69 \cdot 10^{25}\,\text{kg}$, $R = 8{,}91 \cdot 10^{6}\,\text{m}$ e quota $3{,}98 \cdot
  10^{6}\,\text{m}$: risposta $6{,}78\,\text{N/kg}$; distrattori $71{,}2\,\text{N/kg}$ ($G M / h^2$, la quota al posto
  della distanza dal centro), $14{,}2\,\text{N/kg}$ (la quota ignorata), $8{,}74 \cdot 10^{7}\,\text{N/kg}$ (senza il
  quadrato).
- Con $M = 5{,}77 \cdot 10^{25}\,\text{kg}$, $R = 1{,}52 \cdot 10^{7}\,\text{m}$, $h = 3{,}23 \cdot
  10^{7}\,\text{m}$: risposta $1{,}71\,\text{N/kg}$.

## Livello 4: ragionare con i rapporti

Dato il campo alla superficie (tra $1$ e $30\,\text{N/kg}$), si chiede il campo a una distanza dal centro di $2$-$6$
raggi oppure a una quota di $1$-$5$ raggi (metà ciascuno, tra il $40\%$ e il $60\%$). Niente costanti.

- "Alla superficie di una luna il campo gravitazionale vale $6{,}31\,\text{N/kg}$. Quanto vale a una distanza dal
  centro uguale a 4 raggi della luna?" Risposta $0{,}394\,\text{N/kg}$; distrattori $1{,}58\,\text{N/kg}$ (diviso
  $n$), $0{,}252\,\text{N/kg}$ (distanza scambiata con la quota, $n + 1$), $0{,}789\,\text{N/kg}$ (diviso $2n$).
- "... a una quota uguale a 4 raggi della luna" con $4{,}83\,\text{N/kg}$: la distanza è 5 raggi, risposta
  $0{,}193\,\text{N/kg}$; il distrattore principale è $0{,}302\,\text{N/kg}$ (diviso $4^2$).

## Livello 5: il campo di due corpi

Masse tra $10^{23}$ e $10^{26}\,\text{kg}$ (la prima) e tra $10^{22}$ e $10^{25}$ (la seconda), distanza dei centri
tra $10^{8}$ e $10^{9}\,\text{m}$, punto tra il $20\%$ e l'$80\%$ del segmento. Si chiede il modulo; i passaggi dicono
verso quale corpo punta. Si scartano i casi in cui i due campi differiscono di meno del $15\%$ del maggiore.

- Masse $5{,}77 \cdot 10^{24}$ e $6{,}31 \cdot 10^{24}\,\text{kg}$, centri a $5{,}84 \cdot 10^{8}\,\text{m}$, $P$ a
  $3{,}03 \cdot 10^{8}\,\text{m}$ dal primo: risposta $1{,}14 \cdot 10^{-3}\,\text{N/kg}$; distrattori $9{,}52 \cdot
  10^{-3}$ (i campi sommati), $4{,}19 \cdot 10^{-3}$ e $5{,}33 \cdot 10^{-3}$ (un campo solo).
- Masse $5{,}99 \cdot 10^{25}$ e $1{,}28 \cdot 10^{24}\,\text{kg}$, centri a $3{,}94 \cdot 10^{8}\,\text{m}$, $P$ a
  $2{,}56 \cdot 10^{8}\,\text{m}$: risposta $5{,}65 \cdot 10^{-2}\,\text{N/kg}$.

## Esercizi da evitare

- Corpi impossibili (una "luna" di $10^{26}\,\text{kg}$, un pianeta con la densità di una stella di neutroni).
- Quote così piccole da non cambiare la terza cifra, o punti in cui i due campi quasi si annullano.
- Risultati con uno zero finale ambiguo scritti senza potenza di dieci.

## Verifica

`fis_campo_gravitazionale.py` rilegge il testo con espressioni regolari, controlla forma e intervalli dei dati, la
densità e il nome del corpo, ricalcola con numeri razionali esatti ($G = 667/100 \cdot 10^{-11}$), arrotonda a tre
cifre e confronta risposta e opzioni (tutte scritte nella forma canonica, con la stessa unità, con valori distinti);
al livello 3 controlla la scena (rapporto $r/R$ entro un millesimo, dati scritti uguali al testo, niente altro), agli
altri che non ci sia.

## Domande per la revisione

- I corpi sono inventati ("un pianeta di massa $1{,}69 \cdot 10^{25}\,\text{kg}$"): va bene, o meglio i corpi veri del
  Sistema Solare con i dati dei libri?
- Tre cifre significative dappertutto, come le costanti: troppo per la scelta multipla?
- Il livello 5 chiede solo il modulo e dice il verso nei passaggi: basta?
- Manca un livello "a che quota il campo vale una certa frazione" (esempio 4 della lezione): da aggiungere?
