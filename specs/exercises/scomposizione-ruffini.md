# Scomposizione con la regola di Ruffini

Generatore: `scomposizione-ruffini` (`src/lib/exercises/v2/generators/scomposizione-ruffini.ts`).
Verifica indipendente: `scripts/exercises/checkers/scomposizione_ruffini.py`. Lezione collegata:
`docs/lezioni/riscritte/37-scomposizione-ruffini.md` (con la nota `docs/lezioni/note/37-scomposizione-ruffini.md`).

Dal livello 2 lo studente riceve un polinomio in $x$ a coefficienti interi e lo scompone ("Scomponi
in fattori il polinomio."). La risposta è la scomposizione completa in ℤ (`answer.kind =
"expression"`, `form: "factored"`): il numero raccolto, la potenza di $x$ raccolta, poi i fattori.
Il livello 1 è di riconoscimento, con risposta a scelta (`choice`).

## Come si costruisce

All'indietro, come dice la pipeline: prima gli zeri (interi, poi frazionari, poi ripetuti) e i
fattori finali, poi il polinomio sviluppato. Un fattore di primo grado è sempre $qx - p$ con $q > 0$
e $\text{MCD}(p, q) = 1$, cioè allo zero $\frac{p}{q}$ corrisponde $qx - p$ come nel riquadro
"Perdere il coefficiente" della lezione. L'eventuale trinomio finale è $x^2 + bx + c$ senza due
interi di somma $b$ e prodotto $c$, quindi irriducibile.

Poi il generatore esegue sul polinomio il procedimento della lezione e da lì scrive i passaggi:

- candidati: i divisori del termine noto con i due segni e, se il coefficiente direttore non è 1,
  le frazioni $\frac{p}{q}$; si provano nell'ordine $1, -1, 2, -2, \dots$ e poi le frazioni dalla
  più piccola, come dice la lezione ("conviene provare sempre 1 e −1 per primi", "si parte dagli
  interi più piccoli");
- dopo uno zero si riprova per primo lo stesso zero, e i candidati già scartati non si riprovano
  (riquadro "Quali candidati riprovare sul quoziente");
- la divisione con la tabella di Ruffini nella forma della lezione (`\begin{array}{r|rrr|r}`, zero a
  sinistra, resto dopo la seconda barra), con lo 0 al posto delle potenze mancanti;
- con uno zero frazionario, il numero raccolto dal quoziente va nel primo fattore (esempio 3);
- un quoziente $x^2 + bx + c$ si scompone con il trinomio ("i numeri con somma … e prodotto …"),
  o come differenza di quadrati quando $b = 0$; se nessuna coppia di interi va bene, il trinomio non
  si scompone;
- un quoziente di secondo grado con coefficiente direttore diverso da 1 si divide ancora con
  Ruffini.

Il `check()` del generatore richiede che il procedimento arrivi esattamente ai fattori scelti, e il
controllo Python ricalcola tutto dal testo.

## Ordine dei fattori

Quello in cui li trova il procedimento, come negli esempi della lezione: prima il numero e la potenza
di $x$ raccolti, poi i fattori nell'ordine delle divisioni, poi i due del trinomio con il numero più
grande per primo ("$2$ e $-3$" dà $(x + 2)(x - 3)$). I fattori uguali si scrivono come potenza, al
posto del primo: $(x - 1)^3(x + 2)$.

## Regole comuni

- Coefficiente direttore positivo; coefficienti fino a 40 in valore assoluto (60 al livello 6).
- Al massimo 8 candidati da provare in tutto il procedimento, contati con l'ordine della lezione:
  la tabella dei valori $P(a)$ deve stare in pochi passaggi.
- Nel testo e nella risposta mai `1x`, `+ -`, `x^1`, termini nulli o il fattore 1 davanti a una
  parentesi.
- Passaggi: candidati, valori $P(a)$ (per $\pm 1$ con la somma dei coefficienti, come nel riquadro
  "I primi due candidati"), tabella, $P(x) = (x - a)Q(x)$, trinomio, risultato finale
  "polinomio = scomposizione".

## Livello 1: riconoscere uno zero o un fattore

Terzo grado, coefficiente direttore 1, termine noto fino a 30. Metà degli esercizi chiede "Quale di
questi numeri è uno zero del polinomio?", metà "Quale di questi binomi è un fattore del polinomio?".
Quattro opzioni, tutte divisori del termine noto: lo zero giusto, lo stesso con il segno cambiato
(riquadro "Sbagliare il segno del fattore"), due candidati che non sono zeri. I passaggi calcolano il
polinomio in tutte e quattro.

1. $x^3 - 5x^2 + 8x - 4$, un fattore: $x - 2$, perché $P(2) = 0$ e $P(-2) = -48$.
2. $x^3 + 6x^2 + 3x - 20$, un fattore: $x + 4$, perché $P(-4) = 0$; $x - 4$ è l'errore di segno.

## Livello 2: zero 1 o −1, poi il trinomio

Terzo grado completo, coefficiente direttore 1, tre zeri interi distinti tra −7 e 7, uno dei quali è
1 o −1: la prima divisione è con lo zero trovato al primo o al secondo tentativo, e il quoziente è un
trinomio che si scompone. È l'esempio 1 della lezione.

1. $x^3 - 2x^2 - 5x + 6 = (x - 1)(x + 2)(x - 3)$ (esempio 1).
2. $x^3 + 3x^2 - 22x - 24$: $P(-1) = 0$, quoziente $x^2 + 2x - 24$, risultato $(x + 1)(x + 6)(x - 4)$.

## Livello 3: una potenza mancante

Terzo grado con coefficiente direttore 1 e il termine in $x^2$ oppure in $x$ nullo (mai tutti e due:
$x^3 - 8$ è una differenza di cubi, della lezione 35). Nella tabella va lo 0 (riquadro "Dimenticare lo
zero nella tabella"). 1 non è uno zero, quindi il primo zero è −1 o un numero più grande. Metà degli
esercizi finisce con tre fattori di primo grado, metà con un trinomio che non si scompone
(sezione "Quando nessun candidato funziona" applicata al quoziente).

1. $x^3 - 7x - 6$: $P(-1) = 0$, risultato $(x + 1)(x + 2)(x - 3)$.
2. $x^3 - 5x - 12$: $P(3) = 0$, quoziente $x^2 + 3x + 4$ che non si scompone, risultato
   $(x - 3)(x^2 + 3x + 4)$.

## Livello 4: uno zero frazionario

Terzo grado con coefficiente direttore 2, 3 o 4 e uno zero $\frac{p}{q}$ con $|p| \le 5$; termine
noto fino a 24. Due casi:

- trinomio irriducibile (circa 1 su 3: molti li scarta il limite di 8 candidati): nessuno zero
  intero, lo zero frazionario si trova con Ruffini, e il $q$ raccolto dal quoziente va nel primo
  fattore, come nell'esempio 3;
- tre fattori (circa 2 su 3): due zeri interi distinti trovati prima, poi il quoziente di primo
  grado è $qx - p$.

1. $3x^3 - x^2 + 3x - 1$: $P\left(\frac{1}{3}\right) = 0$, quoziente $3x^2 + 3$, risultato
   $(3x - 1)(x^2 + 1)$.
2. $2x^3 + 3x^2 - 8x - 12$: zeri $2$ e $-2$, poi $2x + 3$; risultato $(x - 2)(x + 2)(2x + 3)$.

## Livello 5: quarto grado, Ruffini due volte

Quarto grado, coefficiente direttore 1, zeri interi tra −4 e 4, termine noto fino a 48. Circa metà
con uno zero ripetuto (esempio 4): $(x - a)^3(x - b)$, $(x - a)^2(x - b)^2$, $(x - a)^2(x - b)(x - c)$
o $(x - a)^2$ per un trinomio irriducibile. Gli altri con quattro zeri distinti o due zeri e un
trinomio irriducibile.

1. $x^4 - x^3 - 3x^2 + 5x - 2 = (x - 1)^3(x + 2)$ (esempio 4).
2. $x^4 - 15x^2 + 10x + 24$: $P(-1) = 0$, poi $Q(2) = 0$, poi il trinomio $x^2 + x - 12$; risultato
   $(x + 1)(x - 2)(x + 4)(x - 3)$.

## Livello 6: raccoglimento, Ruffini e trinomio

Prima il raccoglimento totale (riquadro "Usare Ruffini prima di raccogliere"): il MCD dei
coefficienti $k$ da 2 a 5 e/o una potenza $x^m$ con $m \le 2$; nella parentesi resta un polinomio con
coefficiente direttore 1 di terzo grado (tre zeri interi, a volte uno ripetuto, o uno zero e un
trinomio irriducibile) o di quarto grado. Grado totale al massimo 5. È l'esempio 5 della lezione.

1. $2x^5 + 2x^4 - 14x^3 - 2x^2 + 12x = 2x(x - 1)(x + 1)(x + 3)(x - 2)$ (esempio 5).
2. $2x^3 - 2x^2 - 32x + 32$: si raccoglie 2, $A(1) = 0$, quoziente $x^2 - 16$ (differenza di
   quadrati); risultato $2(x - 1)(x + 4)(x - 4)$.

## Esercizi "brutti" da evitare

- polinomi in cui Ruffini non serve perché sono prodotti notevoli evidenti ($x^3 - 8$) o binomi;
- lunghe liste di candidati che non funzionano: al massimo 8 tentativi;
- zeri grandi e coefficienti oltre 40: la lezione lavora con 6, 12, $-13$;
- uno zero ripetuto ai livelli 2, 3 e 4 (la ripetizione è la difficoltà del livello 5);
- il fattore $x$ o un numero da raccogliere prima del livello 6.

## Variante a scelta multipla

Quattro scomposizioni distinte (come prodotti, non come valore: una scomposizione incompleta ha lo
stesso valore del polinomio ed è comunque sbagliata), una sola completa. Distrattori, dagli
errori che la lezione segnala nei riquadri `ad-warning`:

- segno del fattore sbagliato: ogni zero $a$ scritto come $x + a$ ("Sbagliare il segno del fattore");
- scomposizione ferma dopo la prima divisione, $(x - a)Q(x)$ con $Q$ ancora scomponibile ("Fermarsi
  dopo la prima divisione"); al livello 6 anche ferma dopo il solo raccoglimento, e ai livelli 4 e 5
  ferma dopo la seconda divisione;
- coefficiente perso: $\left(x - \frac{p}{q}\right)(\dots)$ al posto di $(qx - p)(\dots)$, e la forma
  prima di raccogliere $q$, $\left(x - \frac{p}{q}\right)(qx^2 + \dots)$ ("Perdere il coefficiente");
- segno sbagliato nel solo fattore frazionario, o nei due fattori del trinomio;
- uno zero ripetuto contato una volta di meno;
- al livello 6 il numero raccolto dimenticato, o una $x$ in meno;
- con un trinomio irriducibile, lo stesso trinomio con un segno cambiato.

Se non bastano, uno zero spostato di 1 o 2.

## Verifica

- `sample.mts scomposizione-ruffini 1000 all 1 | verify.py`: PASS, 6.000 esercizi su 6.000. Con
  seed di partenza 7001: PASS, 6.000 su 6.000.
- Il controllo Python legge il polinomio dal LaTeX del testo, la scomposizione vera da `factor_list`
  di SymPy, e legge risposta e opzioni due volte (stringa SymPy senza valutazione, LaTeX diviso in
  fattori). Controlla che ogni fattore sia primitivo, a coefficienti interi, con coefficiente
  direttore positivo e irriducibile, e che il numero davanti sia il contenuto del polinomio.
  Ricalcola ogni tabella di Ruffini dei passaggi, ogni valore $P(a)$ (e la somma scritta per
  $\pm 1$), ogni uguaglianza tra polinomi e prodotti, il numero di candidati provati con l'ordine
  della lezione e i vincoli di ogni livello; conta i casi per livello (`CASE_RANGES`).
- `review.mts`: esce con 0, tutto il LaTeX passa da KaTeX.

Esercizi diversi (testi distinti) su 1.000 estratti per livello, seed da 1:

| Livello | Esercizi diversi |
|---|---|
| 1 | 675 |
| 2 | 122 |
| 3 | 165 |
| 4 | 520 |
| 5 | 464 |
| 6 | 775 |

I livelli 2 e 3 sono vicini al massimo possibile con i vincoli della lezione (terzo grado monico,
zeri piccoli, al livello 3 una potenza mancante): allargarli vorrebbe dire zeri oltre 7 o termini
noti oltre 42.

Errori piantati a mano (script nello scratchpad della sessione), tutti bocciati dal controllo
Python: risposta con i segni dei fattori cambiati; risposta non scomposta del tutto
($(x - a)(x^2 + \dots)$); opzione giusta spostata su un'altra; opzione incompleta indicata come
giusta; esercizio del livello 2 etichettato come livello 3 (vincolo violato); una cifra sbagliata
nella tabella di Ruffini; un valore $P(a)$ sbagliato nei passaggi; numero non raccolto al livello 6
($(4x - 4)\dots$ invece di $4(x - 1)\dots$, fattore non primitivo); due opzioni uguali; livello 1
con l'indice della risposta spostato; LaTeX della risposta diverso dal valore; coefficiente perso
nella risposta del livello 4 ($\left(x - \frac{1}{3}\right)(3x^2 + 6)$).

## Domande per la revisione

- Al livello 4, nel caso con tre fattori, il procedimento trova prima i due zeri interi e lo zero
  frazionario compare solo come ultimo quoziente ($2x + 3$), senza la divisione per $x - \frac{p}{q}$.
  Va bene così, o il livello deve avere sempre lo zero frazionario trovato con la tabella, come
  nell'esempio 3 (solo il caso con il trinomio irriducibile)?
- Il livello 1 chiede solo "quale numero è uno zero" o "quale binomio è un fattore". Serve anche la
  domanda "quali sono i candidati" (l'elenco dei divisori, con le frazioni quando il coefficiente
  direttore non è 1)?
- L'ordine dei fattori nella risposta segue il procedimento (nota della lezione: "non ho fissato una
  regola"). Quando la risposta sarà aperta si accetterà qualunque ordine; per la scelta multipla va
  bene che le opzioni abbiano ordini diversi tra loro?
