# Il moto armonico

Generatore: `fis-moto-armonico` (`src/lib/exercises/v2/generators/fis-moto-armonico.ts`, con
`src/lib/exercises/v2/fis-moti-piano.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_moto_armonico.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/49-fis-moto-armonico.md`. Percorso nel database:
`high_school/physics/fis-moti-piano/fis-moto-armonico`.

Cinque livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Ampiezza e periodo
2. La posizione a un istante
3. La velocità massima
4. L'accelerazione massima
5. Dalla velocità e dall'accelerazione massime

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità ($3{,}5\,\text{cm}$, $-4{,}2\,\text{cm}$, $0{,}16\,\text{m/s}$,
$0{,}49\,\text{m/s}^2$). Dati con due cifre significative senza zeri ambigui (anche l'istante del livello 2:
$1{,}0\,\text{s}$, non $1\,\text{s}$); il numero di oscillazioni contate è esatto. Risultati a due cifre significative,
mai vicini a un confine di arrotondamento.

## Regole comuni

- Formule della lezione: $A$ è metà della distanza tra le estremità; $T$ è il tempo diviso per le oscillazioni
  complete; partendo da $x = A$, $x = A\cos(\omega t)$ con $\omega = 2\pi/T$ e l'angolo in radianti;
  $v_{max} = \omega A$, $a_{max} = \omega^2 A$ con $A$ in metri; $\omega = a_{max}/v_{max}$.
- Niente scene: al livello 2 la figura del punto sulla circonferenza darebbe la risposta.

## Livello 1: ampiezza e periodo

Un peso appeso a una molla, il pistone di un motore, l'ago di una macchina da cucire. Metà: distanza tra le estremità
$2{,}2$-$60\,\text{cm}$, si chiede l'ampiezza. Metà: da $11$ a $60$ oscillazioni (non multipli di $10$) in
$2{,}0$-$99\,\text{s}$, periodo tra $0{,}1$ e $5\,\text{s}$.

- "Un peso appeso a una molla si muove di moto armonico tra due punti distanti $14\,\text{cm}$. Quanto vale l'ampiezza
  del moto?" Risposta $7{,}0\,\text{cm}$; distrattori $14\,\text{cm}$ (l'escursione, l'avviso della lezione),
  $3{,}5\,\text{cm}$, $28\,\text{cm}$.
- Per il periodo i distrattori sono la frequenza, mezza oscillazione per periodo, il tempo per il numero di oscillazioni.

## Livello 2: la posizione a un istante

Ampiezza $2{,}0$-$20\,\text{cm}$, periodo $1{,}2$-$9{,}6\,\text{s}$, istante uguale a una frazione del periodo tra
$1/12$, $1/8$, $1/6$, $1/3$, $3/8$, $5/12$, $7/12$, $5/8$, $2/3$, $5/6$, $7/8$, $11/12$ (mai un quarto, dove $x = 0$),
scritto con due cifre significative esatte; $|\cos(\omega t)| \ge 0{,}2$. La risposta può essere negativa.

- "Un corpo si muove di moto armonico con ampiezza $8{,}4\,\text{cm}$ e periodo $1{,}5\,\text{s}$; all'istante $t = 0$
  si trova nell'estremità $x = A$. Dove si trova all'istante $t = 1{,}0\,\text{s}$?" $\omega t = 4{,}19\,\text{rad}$,
  risposta $-4{,}2\,\text{cm}$; distrattori la calcolatrice in gradi ($8{,}4$), il seno al posto del coseno ($-7{,}3$),
  il segno sbagliato ($4{,}2$).

## Livello 3: la velocità massima

Ampiezza $1{,}1$-$60\,\text{cm}$; metà con il periodo ($0{,}20$-$5{,}0\,\text{s}$), metà con la frequenza
($0{,}20$-$9{,}9\,\text{Hz}$).

- "Un corpo oscilla di moto armonico con ampiezza $5{,}0\,\text{cm}$ e periodo $2{,}0\,\text{s}$. Quanto vale la sua
  velocità massima?" Risposta $0{,}16\,\text{m/s}$; distrattori i centimetri non convertiti ($16$), il $2\pi$
  dimenticato, l'accelerazione massima.

## Livello 4: l'accelerazione massima

Ampiezza $1{,}1$-$60\,\text{cm}$; metà con il periodo, metà con la frequenza (tutti e due $0{,}20$-$5{,}0$).

- "Un corpo oscilla di moto armonico con ampiezza $5{,}0\,\text{cm}$ e periodo $2{,}0\,\text{s}$. Quanto vale la sua
  accelerazione massima?" Risposta $0{,}49\,\text{m/s}^2$; distrattori la velocità massima, $2\pi A/T^2$ (il $2\pi$ al
  posto di $4\pi^2$), i centimetri non convertiti.

## Livello 5: dalla velocità e dall'accelerazione massime

$v_{max}$ da $0{,}11$ a $9{,}9\,\text{m/s}$, $a_{max}$ da $0{,}50$ a $99\,\text{m/s}^2$, con $\omega$ tra $0{,}5$ e
$50\,\text{rad/s}$ e l'ampiezza di almeno $1\,\text{cm}$. Metà il periodo, metà l'ampiezza.

- "Nel moto armonico di un corpo la velocità massima è $0{,}60\,\text{m/s}$ e l'accelerazione massima è
  $1{,}8\,\text{m/s}^2$. Quanto vale il periodo?" $\omega = 3{,}0\,\text{rad/s}$, risposta $2{,}1\,\text{s}$;
  distrattori $1/\omega$, $2\pi\omega$, $\omega$.
- Per l'ampiezza i distrattori sono $v/a$, $a/v^2$, $v\,a$.

## Esercizi da evitare

- Istanti a un quarto o a tre quarti del periodo (la posizione è zero, e la calcolatrice in gradi non si distingue).
- Istanti come $1\,\text{s}$ o $20\,\text{s}$, con una cifra significativa o uno zero ambiguo.

## Verifica

`fis_moto_armonico.py` rilegge il testo, controlla cifre significative e intervalli, controlla che l'istante sia una
delle frazioni del periodo ammesse, calcola con SymPy esatto (il coseno di multipli razionali di $\pi$), arrotonda a due
cifre e confronta la risposta e la forma delle opzioni, anche negative.

## Domande per la revisione

- La legge oraria con il coseno e la partenza da $x = A$ è quella dell'Amaldi, o il libro usa il seno con la partenza
  dal centro? (da verificare)
