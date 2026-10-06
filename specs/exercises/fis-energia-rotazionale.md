# L'energia cinetica di rotazione e il rotolamento

Generatore: `fis-energia-rotazionale` (`src/lib/exercises/v2/generators/fis-energia-rotazionale.ts`, con
`src/lib/exercises/v2/fis-momento-angolare.ts`, `fis-energia.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_energia_rotazionale.py` (con `_fis_momento_angolare.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/89-fis-energia-rotazionale.md`. Percorso nel database:
`high_school/physics/fis-momento-angolare/fis-energia-rotazionale`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. L'energia di un corpo che ruota
2. L'energia di rotazione dalla forma del corpo
3. L'energia di un corpo che rotola
4. La velocità in fondo alla discesa
5. L'accelerazione lungo il piano inclinato
6. L'altezza raggiunta in salita

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($54\,\text{J}$, $2{,}8\,\text{m/s}$, $1{,}8\,\text{m/s}^2$). Dati con due cifre
significative senza zeri finali ambigui; $g = 9{,}8\,\text{m/s}^2$. Risultati a due cifre significative, mai a meno di
$10^{-6}$ da un confine di arrotondamento, mai da $100$ in su e mai un intero di due cifre che finisce per zero ($20$,
$90$). Nessun distrattore a meno dell'8% della risposta.

## Regole comuni

- Formule della lezione: $K_{rot} = \tfrac12 I \omega^2$; $I = c\,m r^2$ con $c = 1$ (anello sottile), $\tfrac12$ (cilindro
  pieno), $\tfrac25$ (sfera piena), $\tfrac23$ (sfera cava sottile); $K = (1 + c)\tfrac12 m v_{cm}^2$;
  $v_{cm} = \sqrt{2gh/(1 + c)}$; $a = g\sin\beta/(1 + c)$; $h = (1 + c) v_{cm}^2/(2g)$.
- Dal livello 2 il corpo è uno dei quattro, scelto a caso (ciascuno tra il 12% e il 40% dei campioni).
- Scena `rotolamento-piano` (nuova, `scenes/RotolamentoPiano.tsx`) ai livelli 4 e 5: il piano con il corpo in cima e il
  suo nome; al livello 4 il dislivello con il suo valore, al livello 5 l'angolo. Mai la velocità o l'accelerazione.

## Livello 1: l'energia di un corpo che ruota

Un volano, una ruota o una mola con $I$ da $0{,}11$ a $9{,}9\,\text{kg}\cdot\text{m}^2$ e $\omega$ da $1{,}1$ a $30\,\text{rad/s}$;
risultato da $1\,\text{J}$ in su.

- "Una ruota ha momento d'inerzia $1{,}1\,\text{kg}\cdot\text{m}^2$ e ruota a $9{,}9\,\text{rad/s}$. Quanto vale la sua energia
  cinetica di rotazione?" Risposta $54\,\text{J}$; distrattori $11\,\text{J}$ ($I\omega$, il momento angolare),
  $5{,}4\,\text{J}$ ($\tfrac12 I\omega$, senza il quadrato), e $I\omega^2$ senza il mezzo ($108$, fuori intervallo: al suo posto
  una scorta, $67\,\text{J}$).
- "Una ruota ha momento d'inerzia $3{,}9\,\text{kg}\cdot\text{m}^2$ e ruota a $5{,}8\,\text{rad/s}$." Risposta $66\,\text{J}$;
  distrattori $23\,\text{J}$, $11\,\text{J}$, $82\,\text{J}$.

## Livello 2: l'energia di rotazione dalla forma del corpo

In più: il momento d'inerzia si calcola dalla forma. Massa da $0{,}11$ a $9{,}9\,\text{kg}$, raggio in centimetri da $11$ a
$45$, $\omega$ da $11$ a $99\,\text{rad/s}$; risultato da $1\,\text{J}$ in su.

- "Un cilindro pieno di massa $2{,}4\,\text{kg}$ e raggio $15\,\text{cm}$ ruota intorno al suo asse a $42\,\text{rad/s}$. Quanto
  vale la sua energia cinetica di rotazione?" $I = \tfrac12 \cdot 2{,}4 \cdot 0{,}15^2 = 0{,}027\,\text{kg}\cdot\text{m}^2$,
  risposta $24\,\text{J}$; distrattori $48\,\text{J}$ ($c$ dimenticato, $I = m r^2$; per l'anello si usa $\tfrac12$ al posto di
  $1$), $0{,}57\,\text{J}$ ($\tfrac12 I\omega$), il doppio (senza il mezzo) quando è diverso dagli altri, altrimenti una
  scorta.

## Livello 3: l'energia di un corpo che rotola

In più: traslazione e rotazione insieme. Massa da $0{,}11$ a $9{,}9\,\text{kg}$, velocità da $1{,}1$ a $9{,}9\,\text{m/s}$.

- "Una sfera piena di massa $0{,}57\,\text{kg}$ rotola senza strisciare a $9{,}7\,\text{m/s}$. Quanto vale la sua energia
  cinetica totale?" Risposta $38\,\text{J}$; distrattori $27\,\text{J}$ (solo traslazione, l'avviso della lezione),
  $11\,\text{J}$ (solo rotazione), $75\,\text{J}$ (senza il mezzo).
- "Una sfera piena di massa $0{,}42\,\text{kg}$ rotola senza strisciare a $2{,}1\,\text{m/s}$." Risposta $1{,}3\,\text{J}$;
  distrattori $0{,}93\,\text{J}$, $0{,}37\,\text{J}$, $2{,}6\,\text{J}$.

## Livello 4: la velocità in fondo alla discesa

In più: la conservazione dell'energia. Dislivello da $0{,}11$ a $9{,}9\,\text{m}$. Con la scena.

- "Una sfera piena parte da fermo e rotola senza strisciare lungo una discesa, scendendo di $0{,}57\,\text{m}$. Con che
  velocità arriva in fondo?" Risposta $2{,}8\,\text{m/s}$; distrattori $3{,}3\,\text{m/s}$ ($\sqrt{2gh}$, la rotazione
  dimenticata: l'avviso della lezione), $4{,}0\,\text{m/s}$ ($\sqrt{2gh(1 + c)}$, il fattore dalla parte sbagliata),
  $2{,}0\,\text{m/s}$ ($\sqrt{gh/(1 + c)}$, senza il 2).
- "…scendendo di $0{,}36\,\text{m}$." Risposta $2{,}2\,\text{m/s}$; distrattori $2{,}7$, $3{,}1$ e $1{,}6\,\text{m/s}$.

## Livello 5: l'accelerazione lungo il piano inclinato

In più: l'angolo e il seno. Angolo da $15^\circ$ a $60^\circ$ a passi di $5^\circ$. Con la scena.

- "Una sfera piena rotola senza strisciare lungo un piano inclinato di $15^\circ$. Con quale accelerazione scende il suo
  centro di massa?" Risposta $1{,}8\,\text{m/s}^2$; distrattori $2{,}5\,\text{m/s}^2$ ($g\sin\beta$, il corpo che scivola),
  $6{,}8\,\text{m/s}^2$ ($g\cos\beta/(1 + c)$), $3{,}6\,\text{m/s}^2$ ($g\sin\beta\,(1 + c)$).
- "…inclinato di $30^\circ$." Risposta $3{,}5\,\text{m/s}^2$; distrattori $4{,}9$, $6{,}1$ e $6{,}9\,\text{m/s}^2$.

## Livello 6: l'altezza raggiunta in salita

In più: il problema rovesciato, dalla velocità all'altezza. Velocità da $1{,}1$ a $9{,}9\,\text{m/s}$, altezza da
$0{,}1\,\text{m}$ in su.

- "Una sfera piena rotola senza strisciare su un pavimento a $5{,}7\,\text{m/s}$ e imbocca una rampa. Di quanto sale prima
  di fermarsi?" Risposta $2{,}3\,\text{m}$; distrattori $1{,}7\,\text{m}$ ($v^2/(2g)$, la rotazione dimenticata),
  $4{,}6\,\text{m}$ (senza il 2), $1{,}2\,\text{m}$ ($1 + c$ al denominatore).
- "…a $3{,}6\,\text{m/s}$…" Risposta $0{,}93\,\text{m}$; distrattori $0{,}66$, $1{,}9$ e $0{,}47\,\text{m}$.

## Esercizi da evitare

- Risultati da scrivere in notazione scientifica o con uno zero finale ambiguo.
- Energie sotto $1\,\text{J}$ ai livelli 1-3: i distrattori diventerebbero numeri con molti zeri.
- Raggi oltre $45\,\text{cm}$: una sfera piena di un metro con mezzo chilo di massa non esiste.

## Verifica

`fis_energia_rotazionale.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con $g = 49/5$,
radici e seni esatti (SymPy), confronta la risposta e il formato delle opzioni; ai livelli 4 e 5 controlla che la scena
abbia la forma, il dislivello o l'angolo del testo, negli altri che non ci sia una scena.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli intervalli.
`review.mts` e `width.mts` con codice 0 (opzioni al più 75 px su 252).

### Errori piantati

Su 200 esercizi del seed 1: indice dell'opzione giusta, testo dell'opzione giusta, opzione doppia, parole vietate, un
dato del testo cambiato nell'ultima cifra e una scritta della scena cambiata (67 su 67) bocciati tutti. Il dato cambiato
viene preso anche quando a due cifre la risposta non cambia, perché il controllo confronta i numeri del testo con
`params`.
