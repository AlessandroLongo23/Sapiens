# Sistemi di riferimento inerziali e non inerziali

Generatore: `fis-sistemi-non-inerziali` (`src/lib/exercises/v2/generators/fis-sistemi-non-inerziali.ts`, con
`src/lib/exercises/v2/fis-riferimenti.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_sistemi_non_inerziali.py`
(con `_fis_riferimenti.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/72-fis-sistemi-non-inerziali.md`.
Percorso nel database: `high_school/physics/fis-relativita-galileiana/fis-sistemi-non-inerziali`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Inerziale o no
2. Il pallone visto dall'autobus
3. Il tempo per arrivare alla parete
4. Il pendolo nel veicolo che accelera
5. La caduta in ascensore

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni. Al livello 1 le opzioni sono parole; negli altri una grandezza con l'unità
($4{,}4\,\text{m}$, $0{,}64\,\text{s}$, $2{,}4\,\text{m/s}^2$) o un angolo in gradi interi. Dati con due cifre significative
senza zeri ambigui, $g = 9{,}8\,\text{m/s}^2$; risultati a due cifre significative, mai vicini a un confine di
arrotondamento e mai con uno zero finale ambiguo ($40$). Un distrattore che dista meno dell'8% dalla risposta si scarta
e si sostituisce con un valore al 20-40% di distanza.

## Livello 1: inerziale o no

Un veicolo descritto con il suo moto, e la domanda "Il sistema di riferimento del veicolo è inerziale?". Tre famiglie, un
terzo ciascuna: inerziale (treno a $72$-$288\,\text{km/h}$ costanti su un binario rettilineo, ascensore che sale a
$1{,}1$-$2{,}5\,\text{m/s}$ costanti, nave in linea retta a $4{,}0$-$9{,}9\,\text{m/s}$ costanti); non inerziale perché cambia
il modulo (autobus che frena con $1{,}1$-$4{,}5\,\text{m/s}^2$, aereo che accelera sulla pista con $1{,}5$-$3{,}5\,\text{m/s}^2$,
ascensore che parte con $0{,}50$-$1{,}5\,\text{m/s}^2$); non inerziale perché cambia la direzione (auto in curva a
$36$-$72\,\text{km/h}$ costanti, giostra con un giro ogni $4{,}0$-$9{,}9\,\text{s}$, treno in curva a $11$-$35\,\text{m/s}$
costanti). Le quattro opzioni sono sempre le stesse: "sì, la velocità è costante", "no, cambia il modulo", "no, cambia
la direzione", "no, perché si muove".

- "Un treno viaggia a $216\,\text{km/h}$ costanti su un binario rettilineo. Il sistema di riferimento del treno è
  inerziale?" Risposta: "sì, la velocità è costante". Il distrattore che conta è "no, perché si muove" (l'avviso
  "Inerziale non vuol dire fermo").
- "Una giostra gira a velocità angolare costante e fa un giro ogni $6{,}5\,\text{s}$. Il sistema di riferimento della
  giostra è inerziale?" Risposta: "no, cambia la direzione". Il distrattore che conta è "sì, la velocità è costante".

## Livello 2: il pallone visto dall'autobus

Autobus a $11$-$25\,\text{m/s}$ che frena con $1{,}1$-$4{,}5\,\text{m/s}^2$, pallone libero sul pavimento liscio, tempo
$1{,}1$-$3{,}0\,\text{s}$; l'autobus in quel tempo non si ferma ($A\,t \le v_0 - 1$). Metà lo spostamento rispetto
all'autobus, $\Delta s\,' = \tfrac{1}{2}A\,t^2$, metà la velocità rispetto all'autobus, $v' = A\,t$.

- "Un autobus viaggia a $15\,\text{m/s}$ e comincia a frenare con un'accelerazione di modulo $2{,}0\,\text{m/s}^2$. Un
  pallone è fermo sul pavimento liscio. Di quanto avanza il pallone rispetto all'autobus in $2{,}1\,\text{s}$?" Risposta
  $4{,}4\,\text{m}$; distrattori $A\,t^2$ (il mezzo dimenticato), $v_0\,t$ (lo spostamento sulla strada), lo spostamento
  dell'autobus sulla strada.
- "... Quale velocità ha il pallone rispetto all'autobus dopo $1{,}5\,\text{s}$?" con $A = 3{,}2\,\text{m/s}^2$: $4{,}8\,\text{m/s}$;
  distrattori $v_0 - A\,t$ (la velocità dell'autobus), $v_0$, $A\,t/2$.

## Livello 3: il tempo per arrivare alla parete

Stessi dati, più la distanza dalla parete davanti, $2{,}0$-$9{,}9\,\text{m}$: $t = \sqrt{2\,\Delta s\,'/A}$, con l'autobus
ancora in moto all'arrivo. La difficoltà in più è la formula rovesciata.

- "..., a $6{,}2\,\text{m}$ dalla parete davanti. Dopo quanto tempo il pallone tocca la parete?" con $A = 1{,}1\,\text{m/s}^2$:
  $3{,}4\,\text{s}$; distrattori $\sqrt{d/A}$, $2d/A$, $d/v_0$, $d/A$.
- Con $d = 4{,}2\,\text{m}$ e $A = 2{,}2\,\text{m/s}^2$: $1{,}954\ldots \approx 2{,}0\,\text{s}$.

## Livello 4: il pendolo nel veicolo che accelera

Metà: l'angolo del filo con la verticale da $A = 1{,}1$-$6{,}0\,\text{m/s}^2$, $\tan\theta = A/g$, almeno $5^\circ$. Metà:
l'accelerazione dall'angolo, intero tra $4^\circ$ e $35^\circ$, $A = g\tan\theta$.

- "Un ciondolo è appeso con un filo al soffitto di un tram, che accelera su un rettilineo con $3{,}0\,\text{m/s}^2$.
  Quando il ciondolo è fermo rispetto al tram, quale angolo forma il filo con la verticale?" Risposta $17^\circ$;
  distrattori il complementare ($73^\circ$) e l'angolo con il seno al posto della tangente ($18^\circ$).
- "Su un treno che accelera su un rettilineo un ciondolo appeso al soffitto resta fermo rispetto al treno, con il filo
  inclinato di $14^\circ$ rispetto alla verticale. Quanto vale l'accelerazione del treno?" Risposta $2{,}4\,\text{m/s}^2$;
  distrattori $g/\tan\theta$, $g\cos\theta$, $g\sin\theta$ (quando non coincide con la risposta).

## Livello 5: la caduta in ascensore

Ascensore che accelera verso l'alto o verso il basso (metà ciascuno) con $1{,}1$-$4{,}5\,\text{m/s}^2$, pallina lasciata
cadere da $1{,}1$-$2{,}5\,\text{m}$: $t = \sqrt{2h/(g \pm A)}$.

- "In un ascensore che accelera verso il basso con $1{,}1\,\text{m/s}^2$, una pallina viene lasciata cadere da
  $1{,}8\,\text{m}$ dal pavimento. Dopo quanto tempo tocca il pavimento?" Risposta $0{,}64\,\text{s}$; distrattori il segno
  di $A$ scambiato ($0{,}57\,\text{s}$), l'ascensore fermo, $\sqrt{2h/A}$, $\sqrt{h/(g - A)}$.
- Verso l'alto con $A = 1{,}2\,\text{m/s}^2$ e $h = 1{,}5\,\text{m}$: $0{,}52\,\text{s}$ (l'esempio 4 della lezione).

## Esercizi da evitare

- Un autobus che si ferma prima del tempo dato, o prima che il pallone arrivi alla parete.
- Angoli del pendolo sotto i $4^\circ$, dove seno e tangente danno lo stesso numero.
- Veicoli il cui moto non è detto per intero (un "treno a $200\,\text{km/h}$" senza dire se in rettilineo).

## Verifica

`fis_sistemi_non_inerziali.py` rilegge il testo con espressioni regolari, controlla intervalli e cifre dei dati, ricalcola
con SymPy esatto, arrotonda e confronta la risposta e la forma delle opzioni; al livello 1 ricava la famiglia dal testo
e controlla la chiave dell'opzione giusta e i testi delle quattro opzioni.

## Senza esercizio

L'esempio 5 della lezione (l'accelerazione di un punto dell'equatore) non ha un livello: è un conto con la notazione
scientifica che appartiene al moto circolare. Nessuna scena: i livelli sono moti su una retta o domande a parole.

## Domande per la revisione

- Al livello 1 "no, perché si muove" è sempre tra le opzioni: va bene come distrattore fisso?
- Al livello 4 il pendolo si risolve dal suolo, come nella lezione 72. Il generatore della 75 non lo ripete.
