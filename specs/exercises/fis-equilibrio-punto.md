# L'equilibrio di un punto materiale e le reazioni vincolari

Generatore: `fis-equilibrio-punto` (`src/lib/exercises/v2/generators/fis-equilibrio-punto.ts`, con
`src/lib/exercises/v2/fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_equilibrio_punto.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/20-fis-equilibrio-punto.md`. Percorso nel database:
`high_school/physics/fis-equilibrio-solidi/fis-equilibrio-punto`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La reazione del piano d'appoggio
2. La forza equilibrante
3. Due fili con lo stesso angolo
4. Un filo orizzontale e uno inclinato
5. Due fili con angoli diversi
6. Quanto si può tendere un filo

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, con l'unità nell'opzione ($24\,\text{N}$) o in gradi interi ($9^\circ$). Masse e forze
date con due cifre significative e senza zeri finali ambigui (da $1{,}1$ a $9{,}9$ o da $11$ a $99$); angoli in gradi
interi, che non contano; $g = 9{,}8\,\text{N/kg}$, e il peso $m \cdot g$ si scrive esatto nei passaggi. Le forze della
risposta si arrotondano a due cifre significative (mezzo in su), gli angoli al grado; un valore a meno di $10^{-6}$ da
un confine di arrotondamento non si usa, e nemmeno una forza sotto $1\,\text{N}$ o da $100\,\text{N}$ in su. Tutte le
opzioni sono scritte come la risposta.

## Regole comuni

- Formule della lezione: $F_v = P \pm F$ sul piano d'appoggio; $F_e = R$; $T = \dfrac{P}{2\sin\alpha}$ con i fili
  simmetrici; $T\cos\beta = P$ e $F = T\sin\beta$ con il filo inclinato di $\beta$ dalla verticale e quello orizzontale;
  per due fili ad $\alpha_1$ e $\alpha_2$ dall'orizzontale le due equazioni per componenti, che danno
  $T_1 = \dfrac{P\cos\alpha_2}{\sin(\alpha_1 + \alpha_2)}$ e $T_2 = \dfrac{P\cos\alpha_1}{\sin(\alpha_1 + \alpha_2)}$.
- Scene: livello 2 `punto-forze` (le forze date, in scala; la soluzione aggiunge la forza equilibrante); livelli 3-6
  `fili-corpo` (i fili con gli angoli dati segnati, niente forze; la soluzione disegna le tensioni e il peso in scala).
  Il livello 1 non ha scena: con le sole forze date il diagramma sarebbe incompleto (la reazione è la risposta).
- Ogni livello sceglie prima il caso e poi i numeri, così i casi restano metà e metà.

## Livello 1: la reazione del piano d'appoggio

Un corpo su un piano orizzontale, con una mano che lo preme verso il basso (metà) o un filo verticale che lo tira verso
l'alto (metà), con una forza tra il $15\%$ e l'$80\%$ del peso.

- "Un libro di $3{,}3\,\text{kg}$ è appoggiato su un tavolo orizzontale. Un filo verticale lo tira verso l'alto con una
  forza di $7{,}9\,\text{N}$, più piccola del suo peso. Quanto vale la reazione vincolare del piano?" Risposta
  $24\,\text{N}$ ($32{,}34 - 7{,}9$); distrattori $32\,\text{N}$ (la reazione uguale al peso), $40\,\text{N}$ (la forza
  con il segno sbagliato), $7{,}9\,\text{N}$.
- "Una cassa di $4{,}5\,\text{kg}$ … Una mano la preme verso il basso con una forza di $12\,\text{N}$." Risposta
  $56\,\text{N}$ ($44{,}1 + 12$).

## Livello 2: la forza equilibrante

Metà: due forze perpendicolari (est e nord). Metà: tre forze, est, ovest (più piccola) e nord, come l'esempio 4 della
lezione "Le forze e il dinamometro". Nessuna delle due direzioni è meno di un quarto dell'altra.

- "Su un punto materiale agiscono una forza di $47\,\text{N}$ verso est e una forza di $52\,\text{N}$ verso nord. Quanto
  vale il modulo della forza equilibrante?" Risposta $70\,\text{N}$; distrattori $99\,\text{N}$ (moduli sommati),
  $5{,}0\,\text{N}$ (differenza), $84\,\text{N}$. La media dei moduli, terzo errore previsto, qui è $49{,}5$, a metà tra
  due valori: quando un distrattore cade su un confine di arrotondamento si salta, e subentra un valore vicino alla
  risposta ($1{,}2$, $0{,}8$ o $1{,}4$ volte).
- Con tre forze i distrattori sono la somma dei tre moduli, la forza verso ovest presa con il verso sbagliato e la somma
  delle due componenti.

## Livello 3: due fili con lo stesso angolo

Un corpo appeso a due fili simmetrici, con l'angolo da $15^\circ$ a $75^\circ$ dato con l'orizzontale (metà) o con la
verticale (metà).

- "Un'insegna di $1{,}2\,\text{kg}$ è appesa a due fili, che formano ciascuno un angolo di $74^\circ$ con la verticale.
  Quanto vale la tensione di ciascun filo?" Risposta $21\,\text{N}$ ($11{,}76 / (2\cos 74^\circ)$); distrattori
  $5{,}9\,\text{N}$ (il peso diviso a metà), $6{,}1\,\text{N}$ (seno e coseno scambiati), $43\,\text{N}$ (il 2
  dimenticato).

## Livello 4: un filo orizzontale e uno inclinato

La lampada dell'esempio 4 della lezione. Il filo inclinato forma tra $15^\circ$ e $70^\circ$ con la verticale; l'angolo
è dato con la verticale (metà) o con l'orizzontale (metà); si chiede la tensione del filo inclinato (metà) o di quello
orizzontale (metà).

- "Una lampada di $1{,}2\,\text{kg}$ è appesa al soffitto con un filo che forma un angolo di $69^\circ$ con la verticale;
  un secondo filo, orizzontale e legato alla parete, la tiene scostata. Quanto vale la tensione del filo orizzontale?"
  Risposta $31\,\text{N}$; distrattori $4{,}5\,\text{N}$ (seno e coseno scambiati), $11\,\text{N}$ ($P\sin\beta$),
  $33\,\text{N}$ (la tensione dell'altro filo).

## Livello 5: due fili con angoli diversi

Angoli da $20^\circ$ a $75^\circ$ con l'orizzontale, diversi di almeno $10^\circ$; si chiede la tensione del filo di
sinistra o di destra, metà ciascuna.

- "Un lampadario di $1{,}2\,\text{kg}$ è appeso a due fili: quello di sinistra forma un angolo di $23^\circ$ con
  l'orizzontale, quello di destra un angolo di $74^\circ$. Quanto vale la tensione del filo di destra?" Risposta
  $11\,\text{N}$; distrattori $3{,}3\,\text{N}$ (l'altra tensione), $6{,}1\,\text{N}$ (come se i fili fossero
  simmetrici), $5{,}9\,\text{N}$ (il peso a metà).

## Livello 6: quanto si può tendere un filo

L'esempio 7 della lezione, al contrario del livello 3: dalla tensione massima all'angolo più piccolo,
$\sin\alpha = P / 2T$, tra $4^\circ$ e $40^\circ$, arrotondato al grado.

- "Un filo per stendere regge al massimo una tensione di $16\,\text{N}$. Al centro si appende un cappotto di
  $1{,}2\,\text{kg}$. Qual è l'angolo più piccolo che i due tratti del filo possono formare con l'orizzontale?" Risposta
  $22^\circ$; distrattori $47^\circ$ (il 2 dimenticato), $68^\circ$ (l'angolo con la verticale), $36^\circ$ (la
  tangente di $P/T$).

La scena segna l'angolo con $\alpha$ e lo disegna di $15^\circ$, non in scala: l'angolo è la risposta.

## Esercizi da evitare

- Forze della risposta sotto $1\,\text{N}$ o da $100\,\text{N}$ in su (servirebbe la notazione scientifica).
- Un filo che tira più del peso (il corpo si staccherebbe dal piano); fili quasi verticali o quasi orizzontali oltre i
  limiti detti sopra.
- Due fili del livello 5 con angoli quasi uguali: sarebbe il livello 3.

## Verifica

`fis_equilibrio_punto.py` rilegge il testo (con l'accordo di genere), controlla cifre significative e intervalli,
calcola con la trigonometria esatta di SymPy (60 cifre), controlla al livello 5 che le due tensioni soddisfino le due
equazioni, arrotonda e confronta con l'opzione giusta; controlla che la scena disegni i dati del testo (forze del
livello 2, angoli e riferimenti dei fili) e che nella scena del problema non ci siano forze.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 41 px su 252).

### Errori piantati

Bocciati tutti: indice dell'opzione giusta spostato, primo e secondo numero del testo cambiati, testo dell'opzione giusta
cambiato, un'opzione doppia, parole vietate, un angolo dei fili nella scena spostato di $3^\circ$, una forza in più
nella scena del problema, un modulo cambiato nella scena del livello 2. L'unica eccezione non è un errore: al livello 6
una tensione massima più grande di $1\,\text{N}$ dà spesso lo stesso angolo al grado (bocciati 17 su 40).

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 981 (976), livello 2 958 (945), livello 3 992 (987), livello 4 961 (961), livello 5 998
(997), livello 6 973 (962).

## Domande per la revisione

- $\vec{F}_v$ per la reazione vincolare, come nella lezione, o $\vec{N}$, o $\vec{R}$?
- Il livello 5 chiede di risolvere un sistema di due equazioni: è da primo anno, o va tenuto come livello più difficile
  facoltativo?
