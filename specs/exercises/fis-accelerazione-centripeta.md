# L'accelerazione centripeta

Generatore: `fis-accelerazione-centripeta` (`src/lib/exercises/v2/generators/fis-accelerazione-centripeta.ts`, con
`src/lib/exercises/v2/fis-moti-piano.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_accelerazione_centripeta.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/48-fis-accelerazione-centripeta.md`. Percorso nel database:
`high_school/physics/fis-moti-piano/fis-accelerazione-centripeta`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Dalla velocità e dal raggio
2. Con la velocità in km/h
3. Dal periodo
4. La velocità massima in curva
5. Come cambia l'accelerazione

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($5{,}0\,\text{m/s}^2$, $13\,\text{m/s}$). Dati con due cifre significative
senza zeri ambigui; risultati a due cifre significative, mai vicini a un confine di arrotondamento, mai da $100$ in su.

## Regole comuni

- Formule della lezione: $a_c = v^2/r = \omega^2 r = 4\pi^2 r/T^2$; la velocità in $\text{km/h}$ si divide per $3{,}6$
  prima di elevarla al quadrato; a raggio fisso $a_c$ va con $v^2$, a velocità fissa con $1/r$, a periodo fisso con $r$.
- Le accelerazioni di un'auto restano tra $0{,}1$ e $9{,}9\,\text{m/s}^2$ (al massimo circa $g$).
- Niente scene: la figura non aggiunge dati.

## Livello 1: dalla velocità e dal raggio

Auto in curva, raggio $11$-$99\,\text{m}$, velocità $2{,}0$-$30\,\text{m/s}$.

- "Un'auto percorre una curva di raggio $45\,\text{m}$ alla velocità costante di $15\,\text{m/s}$. Quanto vale la sua
  accelerazione centripeta?" Risposta $5{,}0\,\text{m/s}^2$; distrattori $v/r$ ($0{,}33$, il quadrato dimenticato),
  $r/v^2$, $v^2 r$ (scartato se supera $99$).

## Livello 2: con la velocità in km/h

Auto in una rotonda, raggio $11$-$99\,\text{m}$, velocità $11$-$99\,\text{km/h}$.

- "Un'auto percorre una rotonda di raggio $45\,\text{m}$ alla velocità costante di $54\,\text{km/h}$. Quanto vale la sua
  accelerazione centripeta?" $v = 15\,\text{m/s}$, risposta $5{,}0\,\text{m/s}^2$; distrattori $v^2/r$ con i
  $\text{km/h}$ ($65$), $v/r$ con i metri al secondo, $v^2/(3{,}6\,r)$ (convertita una volta sola, $18$).

## Livello 3: dal periodo

Un sasso fatto girare con una corda: raggio $0{,}20$-$2{,}0\,\text{m}$, periodo $0{,}30$-$3{,}0\,\text{s}$, accelerazione
almeno $0{,}5\,\text{m/s}^2$.

- "Un sasso legato a una corda è fatto girare su una circonferenza orizzontale di raggio $0{,}80\,\text{m}$, e fa un giro
  in $0{,}90\,\text{s}$. Quanto vale la sua accelerazione centripeta?" Risposta $39\,\text{m/s}^2$; distrattori la
  velocità $2\pi r/T$ ($5{,}6$), $4\pi^2 r/T$ ($35$, il quadrato di $T$ dimenticato), $2\pi r/T^2$.

## Livello 4: la velocità massima in curva

Accelerazione massima delle gomme $1{,}1$-$9{,}9\,\text{m/s}^2$, raggio $11$-$99\,\text{m}$; $v = \sqrt{a\,r}$.

- "Le gomme di un'auto permettono un'accelerazione centripeta di $4{,}0\,\text{m/s}^2$ al massimo. Con quale velocità
  massima l'auto può percorrere una curva di raggio $45\,\text{m}$?" Risposta $13\,\text{m/s}$; distrattori $a\,r$
  (la radice dimenticata, scartato se supera $99$), $\sqrt{r/a}$.

## Livello 5: come cambia l'accelerazione

Un terzo ciascuno: la stessa curva a velocità doppia, tripla o dimezzata ($a_2 = a_1 k^2$); alla stessa velocità una
curva di raggio doppio, triplo o dimezzato ($a_2 = a_1/k$); sulla stessa giostra un bambino a distanza doppia, tripla o
dimezzata dal centro ($a_2 = a_1 k$). $a_1$ da $0{,}50$ a $9{,}9\,\text{m/s}^2$.

- "Un'auto percorre una curva con un'accelerazione centripeta di $3{,}2\,\text{m/s}^2$. Quanto vale la sua
  accelerazione se percorre la stessa curva a velocità doppia?" Risposta $13\,\text{m/s}^2$; distrattori le altre
  regole: $a_1 k$ ($6{,}4$, l'avviso della lezione), $a_1/k$, $a_1/k^2$.

## Esercizi da evitare

- Auto con accelerazioni di tre o quattro $g$.
- Risultati da $100$ in su, che andrebbero in notazione scientifica.

## Verifica

`fis_accelerazione_centripeta.py` rilegge il testo, controlla cifre significative e intervalli, calcola con SymPy
esatto, arrotonda a due cifre e confronta la risposta e la forma delle opzioni ($\text{m/s}^2$ con l'esponente fuori dal
testo).

## Domande per la revisione

- Il livello 5 con la giostra (periodo fisso) mette alla prova la stessa idea dell'esempio 5 della lezione: basta, o
  serve anche il caso "stessa auto, raggio doppio e velocità doppia"?
