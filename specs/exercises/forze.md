# Le forze e il dinamometro

Generatore: `forze` (`src/lib/exercises/v2/generators/forze.ts`). Verifica indipendente:
`scripts/exercises/checkers/forze.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/16-forze.md` (note in
`docs/lezioni/fisica/note/16-forze.md`). Le funzioni comuni ai quattro generatori delle forze sono in
`src/lib/exercises/v2/fisica-forze.ts` e `scripts/exercises/checkers/forze_comune.py`.

Cinque livelli, ognuno con una difficoltà in più: leggere lo strumento, capire la sua scala, sommare forze sulla
stessa retta, poi perpendicolari, poi più di due.

## Nomi dei livelli

1. Leggere il dinamometro
2. Portata e sensibilità
3. Forze sulla stessa retta
4. Forze perpendicolari
5. Più forze su due direzioni

## Tipi di risposta

Tutti i livelli hanno una risposta `number` in newton, esatta: i dati sono esatti (una tacca della scala, newton
interi, terne pitagoriche), quindi non si arrotonda. La variante a scelta multipla ha quattro opzioni con l'unità
dentro, scritte come la lezione: `1{,}3\,\text{N}`, `50\,\text{N}`. Prima i distrattori della lezione, poi, se ne
mancano, valori vicini alla risposta (un'unità sull'ultima cifra).

## Regole comuni

- Convenzioni del README di fisica: virgola decimale `{,}`, spazio sottile prima dell'unità, $F_1$, $F_2$ per le
  forze e $R$ per la risultante; direzioni con i punti cardinali, come gli esempi 3 e 4 della lezione.
- Testo in righe `\text{…}` scritte con `textBlock`, formule tra `$…$`.
- Le scene disegnano solo i dati: il dinamometro con l'indice (livelli 1 e 2), le forze in scala (livelli 3, 4, 5).
  La risultante compare solo nella scena della soluzione, in arancione.
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).

## Livello 1: leggere il dinamometro

Scena `dinamometro` con un sacchetto appeso. Sei scale, lunghe tutte $3$ cm, scelte a caso: portata $1$ N in $20$
divisioni (numeri ogni $0{,}2$ N), $2$ N in $20$ ($0{,}5$ N), $5$ N in $25$ ($1$ N), $10$ N in $20$ ($2$ N), $20$ N in
$20$ ($5$ N), $50$ N in $25$ ($10$ N). L'indice è su una tacca senza numero. Il testo è "Quanto segna il dinamometro
della figura?"; il testo alternativo della scena dice la scala e la posizione dell'indice a parole ("3 tacche sotto il
numero 1"), per chi non vede la figura.

Esempi:

- Portata $2$ N, indice $3$ tacche sotto l'$1$: risposta $1{,}3$ N; distrattori $1{,}4$ e $1{,}2$ N (una tacca in più
  o in meno), $1{,}5$ N (il numero più vicino).
- Portata $10$ N, indice $1$ tacca sotto il $4$: risposta $4{,}5$ N; distrattori $5$ N, $4$ N e $4{,}1$ N (una
  divisione presa per $0{,}1$ N).

Distrattori: una divisione in più o in meno; ogni divisione presa per $0{,}1$ N (o per $1$ N, se la sensibilità è
$0{,}1$ N); il numero più vicino all'indice.

## Livello 2: portata e sensibilità

Tre casi, un terzo ciascuno:

- la sensibilità del dinamometro disegnato (scena senza niente appeso): il passo tra due numeri diviso le divisioni
  tra loro;
- la sensibilità dalla portata (da $1$ a $100$ N) e dal numero di divisioni ($10$, $20$, $25$, $40$, $50$, $100$),
  con al più due decimali e almeno $0{,}01$ N;
- la portata dalla sensibilità e dal numero di divisioni.

Esempi:

- "Un dinamometro ha la scala da $0$ a $10$ N, divisa in $50$ parti uguali. Qual è la sua sensibilità?" Risposta
  $0{,}2$ N; distrattori $5$ N (il rapporto rovesciato), $500$ N (il prodotto), $2$ N.
- "Un dinamometro ha la sensibilità di $0{,}5$ N e la scala divisa in $40$ parti uguali. Qual è la sua portata?"
  Risposta $20$ N; distrattori $80$ N ($40 : 0{,}5$), $40$ N (il numero di divisioni), $200$ N.

Distrattori: il rapporto rovesciato, il prodotto, dieci volte la risposta; nella figura il passo tra due numeri e la
portata.

## Livello 3: forze sulla stessa retta

Due forze orizzontali (verso est o verso ovest), moduli multipli di $5$ N da $5$ a $150$ N, diversi, con la minore
almeno il $15\%$ della maggiore (perché la freccia corta si veda). Metà con lo stesso verso, metà con versi opposti.
Scena `punto-forze` solo per i versi opposti: due frecce nello stesso verso sulla stessa retta si coprirebbero.

Esempi:

- "$F_1 = 120$ N verso est e $F_2 = 80$ N verso est." Risposta $200$ N; distrattori $40$ N, $120$ N, $100$ N (la
  media).
- "$F_1 = 45$ N verso ovest e $F_2 = 30$ N verso est." Risposta $15$ N; distrattori $75$ N, $45$ N.

Distrattori: l'altra operazione (somma al posto della differenza e il contrario), la forza più grande, la media.

## Livello 4: forze perpendicolari

Terne pitagoriche ($3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$; $20, 21, 29$; $12, 35, 37$; $9, 40, 41$) per un
fattore intero, con la risultante fino a $150$ N e le forze di almeno $5$ N. Due casi:

- la risultante di due forze date (circa 70%), con la scena delle due forze e, nella soluzione, la risultante;
- la forza che manca, data la risultante e una delle due forze (circa 30%), senza scena nel problema (disegnerebbe
  la risposta).

Esempi:

- "$F_1 = 30$ N verso est e $F_2 = 40$ N verso nord." Risposta $50$ N; distrattori $70$ N (la somma dei moduli,
  l'avviso della lezione), $10$ N, $40$ N.
- "Due forze perpendicolari hanno una risultante di $26$ N; una delle due vale $10$ N." Risposta $24$ N; distrattori
  $16$ N (la differenza), $36$ N, $26$ N.

## Livello 5: più forze su due direzioni

Tre forze (circa 60%: due orizzontali opposte e una verticale) o quattro (due orizzontali e due verticali, opposte a
coppie), come l'esempio 4 della lezione. Le somme lungo i due assi sono i cateti di una terna pitagorica (per un
fattore), la risultante è intera e fino a $100$ N, nessuna forza oltre $150$ N, ogni freccia lunga almeno $0{,}3$ cm
quando la più lunga è di $2$ cm.

Esempi:

- "$F_1 = 50$ N verso est, $F_2 = 20$ N verso ovest e $F_3 = 40$ N verso nord." Risposta $50$ N; distrattori
  $110$ N (tutti i moduli sommati), $70$ N ($30 + 40$), $10$ N.
- "$F_1 = 24$ N verso est, $F_2 = 10$ N verso ovest, $F_3 = 68$ N verso nord e $F_4 = 20$ N verso sud." Risposta
  $50$ N; distrattori $122$ N, $62$ N, $34$ N.

Distrattori: tutti i moduli sommati; le due somme parziali sommate; le forze opposte sommate invece che sottratte
(quando dà un intero); la differenza delle somme parziali.

## Esercizi da evitare

- Un indice su una tacca con il numero (livello 1: si legge senza contare).
- Due forze uguali in versi opposti (risultante nulla: è l'equilibrio, capitolo successivo).
- Una risultante lungo un asse al livello 5 (diventerebbe il livello 3).
- Frecce più corte di $0{,}3$ cm nella scena.

## Verifica

`forze.py` legge il testo e la scena. Al livello 1 controlla che la scala sia una delle sei, che l'indice sia su una
tacca senza numero e che il testo alternativo dica la stessa posizione; la risposta è il numero di tacche per la
sensibilità. Ai livelli 3-5 ogni forza è un vettore di SymPy lungo est, nord, ovest o sud, la risultante è la loro
somma e il modulo $\sqrt{R_x^2 + R_y^2}$ deve essere intero; la scena deve avere le forze del testo, in scala (la più
lunga di $2$ cm, nessuna sotto $0{,}3$ cm), e non la risultante; la scena della soluzione ha la risultante con il
modulo e la direzione giusti. Poi la risposta, le quattro opzioni diverse, l'opzione giusta, il testo di ogni opzione
e la quota dei casi (`CASE_RANGES`).

Esito: `sample.mts forze 1000 all` con i seed $1$, $50001$ e $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e
`width.mts` escono con codice 0 (opzioni al massimo di $69$ px).

### Errori piantati

Su 25 esercizi (5 per livello) e 6 modifiche ciascuno (risposta cambiata, opzione giusta spostata, due opzioni uguali,
opzione scritta senza lo spazio sottile, un dato del testo cambiato, la scena cambiata), tutti bocciati. Bocciati
anche l'indice spostato su un numero e la risultante aggiunta alla scena del problema.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 102 (102), livello 2 86 (86), livello 3 842 (850), livello 4 417
(409), livello 5 907 (916). I livelli 1 e 2 sono stretti per costruzione: sei scale e le loro tacche.

## Domande per la revisione

- Direzioni con i punti cardinali (est, nord): la lezione le usa negli esempi 3 e 4, ma i libri scrivono spesso "verso
  destra", "verso l'alto". Va bene?
- Livello 2: la sensibilità con due decimali ($0{,}05$ N, $0{,}02$ N) è da biennio?
- Serve un livello di vero o falso sulla forza come vettore (effetti statici e dinamici, contatto e distanza)?
