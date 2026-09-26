# Frazioni algebriche e condizioni di esistenza

Generatore: `frazioni-algebriche-esistenza` (`src/lib/exercises/v2/generators/frazioni-algebriche-esistenza.ts`).
Verifica indipendente: `scripts/exercises/checkers/frazioni_algebriche_esistenza.py`. Lezione collegata:
`docs/lezioni/riscritte/46-frazioni-algebriche-esistenza.md` (note in `docs/lezioni/note/`, sezione
"Per il generatore", da cui vengono i sette livelli).

Al livello 1 lo studente calcola il valore di una frazione algebrica in un punto, o dice che non
esiste. Dal livello 2 scrive le condizioni di esistenza (C.E.) di una frazione, e al livello 7 di
un'espressione con più frazioni. Consegne:

- livello 1: "Calcola il valore della frazione algebrica, se esiste.";
- livelli 2-6: "Scrivi le condizioni di esistenza della frazione.";
- livello 7: "Scrivi le condizioni di esistenza dell'espressione.".

## Si costruisce dai fattori del denominatore

Si scelgono prima i fattori del denominatore, e il denominatore mostrato è il loro prodotto
sviluppato. I valori esclusi sono quindi noti in anticipo e sempre razionali. Ogni fattore è di uno
di tre tipi:

- una lettera, anche con esponente ($x$, $x^2$), che dà $x \neq 0$;
- un binomio di primo grado primitivo ($x - 3$, $2x + 3$, $3 - 2x$), che dà un valore;
- una somma di potenze pari con coefficienti positivi più un numero positivo ($x^2 + 4$,
  $9x^2 + 49$, $x^4 + 3x^2 + 9$), che non si annulla mai e non dà condizioni.

Non escono mai fattori irriducibili che si annullano in punti irrazionali, come $x^2 - 3$: la
lezione li lascia alle equazioni di secondo grado (riquadro "Irriducibile non vuol dire mai zero").
Il numero davanti ($2x^2 + 6x = 2x(x + 3)$) non dà condizioni, come nel procedimento della lezione.

Al livello 1 si sceglie prima il caso (esiste, numeratore nullo, non esiste) e il valore di $x$,
poi un numeratore o un denominatore che si annulla in quel valore: $x - x_0$ oppure
$(x - x_0)(x - t)$.

## Tipo di risposta

- Livello 1, la frazione esiste: `number`, il valore esatto ("3/5", "0", "-1").
- Livello 1, la frazione non esiste: `choice`, con l'opzione "non esiste" giusta. Non c'è un numero
  da scrivere, quindi l'esercizio nasce a scelta multipla.
- C.E. in una lettera (livelli 2-7): `set`, i valori esclusi in ordine crescente; l'insieme vuoto
  vuol dire "nessuna condizione" (`latex = "\text{nessuna condizione}"`). In futuro, con la risposta
  aperta, basta confrontare gli insiemi: l'ordine delle condizioni e le due scritture
  $x \neq \pm 3$ e $x \neq 3,\ x \neq -3$ danno lo stesso insieme, come chiede la nota della lezione.
- C.E. in due lettere (livello 3, monomio in due lettere; livello 6, due lettere): `choice`. Una
  condizione come $a \neq b$ non è un numero, e il tipo `set` non la contiene.

## Come si scrivono le C.E.

Come nella lezione: le condizioni separate da una virgola ("x \neq 0,\ x \neq -3"), due valori
opposti insieme con $\pm$ ($x \neq \pm \frac{3}{2}$), in ordine di valore assoluto, lo zero per primo.
Con più di tre condizioni un'opzione andrebbe su due righe (`gathered`), ma con i limiti di oggi non
succede: al massimo tre. In due lettere prima le lettere, poi i binomi: $a \neq 0,\ a \neq b$;
$a \neq \pm b$ per $a^2 - b^2$. Frazioni sempre ridotte con il segno davanti: $-\frac{7}{2}$.

## Rappresentazione

`params.case` è il caso del livello, `params.sub` una variante più fine (per esempio
`raccoglimento parziale`, `x^4 + bx^2 + t^2`, `u^2 - w^2`, `zero su zero`). `params.fracs` è la lista
delle frazioni: per ognuna il numeratore (lista di monomi), il segno davanti e il denominatore come
`pre` (un monomio $k x^j$) e `fs` (i fattori, con molteplicità `k` e `rev` quando si scrivono per
potenze crescenti, come $3 - 2x$). `params.at` ha i valori delle lettere al livello 1.

## Regole comuni

- Coefficienti interi, al massimo 100 in valore assoluto (al livello 1 al massimo 40).
- Denominatori ordinati per potenze decrescenti, tranne i casi "al contrario" della lezione
  ($3 - x$, $9 - 4x^2$, $9x - 4x^3$), scritti per potenze crescenti come negli esempi 7 e
  nell'avviso sul segno.
- Il numeratore è un numero, $x$, o un binomio di primo grado. Può avere un fattore in comune con il
  denominatore ($\frac{x}{x^2 + 6x}$): le C.E. restano, come nell'esempio 8.
- Numeratore mai uguale al denominatore; due fattori uguali si scrivono come potenza.
- I passaggi seguono il procedimento: la scomposizione (una catena di uguaglianze che il verificatore
  rilegge e controlla), una riga per fattore ("Il fattore $x + 6$ si annulla per $x = -6$", "Il
  fattore numerico $2$ non è mai zero", "Il fattore $x^2 + 1$ è positivo e non si annulla mai"),
  poi "C.E.: …".

## Livello 1: il valore di una frazione algebrica

Tre casi: esiste (circa 5 su 10), numeratore nullo (2 su 10, la frazione vale 0), non esiste (3 su
10, il denominatore vale 0; un terzo di questi è $\frac{0}{0}$). Una lettera con $x$ intero tra $-5$ e
$5$ (3 volte su 4), oppure due lettere ($a$, $b$ o $x$, $y$) con valori interi non nulli, come
nell'esempio 2. Numeratore e denominatore nel punto al massimo 60 in valore assoluto; valore con
numeratore fino a 40 e denominatore fino a 20. I numeri negativi si sostituiscono tra parentesi.

1. $\frac{x^2 + 2x - 3}{x - 8}$ per $x = -3$: numeratore $(-3)^2 + 2 \cdot (-3) - 3 = 0$,
   denominatore $-11$, la frazione vale $0$.
2. $\frac{a + b}{a - 3b}$ per $a = 5$, $b = -4$: vale $\frac{1}{17}$.
3. $\frac{6}{x^2 + 8x + 16}$ per $x = -4$: il denominatore vale $0$, la frazione non esiste.

## Livello 2: denominatore di primo grado

Un terzo $x + b$ (valore intero), un terzo $ax + b$ con $2 \le a \le 5$ (valore intero o frazionario,
denominatore fino a 5), un terzo $b - ax$ con la costante davanti (l'avviso "Il segno del valore
escluso"). Passaggi con $\neq$ come nella lezione ($2x - 3 \neq 0$, $2x \neq 3$, $x \neq \frac{3}{2}$)
e un controllo per sostituzione.

1. $\frac{x}{2x + 7}$: C.E. $x \neq -\frac{7}{2}$ (controllo $2 \cdot \left(-\frac{7}{2}\right) + 7 = 0$).
2. $\frac{x - 2}{6 - x}$: C.E. $x \neq 6$.

## Livello 3: monomio o raccoglimento totale

Un quarto monomio in $x$ ($2x^4$), un quinto monomio in due lettere ($5x^2y^2$, risposta a scelta
multipla), il resto raccoglimento totale $kx^j(ax + b)$ con $j = 1$ o $2$.

1. $\frac{x}{x^2 + 6x}$: $x^2 + 6x = x(x + 6)$, C.E. $x \neq 0,\ x \neq -6$.
2. $\frac{x + y}{5x^2y^2}$: $5 \cdot x \cdot x \cdot y \cdot y$, C.E. $x \neq 0,\ y \neq 0$.

## Livello 4: differenza di quadrati o quadrato di un binomio

Circa 55 su 100 $p^2x^2 - q^2$ ($p = 1$ due volte su tre, $p$ e $q$ primi tra loro; un quarto scritto
$q^2 - p^2x^2$), il resto $(px \pm q)^2$ sviluppato.

1. $\frac{x - 2}{9x^2 - 1}$: $(3x - 1)(3x + 1)$, C.E. $x \neq \pm \frac{1}{3}$.
2. $\frac{3x + 5}{x^2 - 2x + 1}$: $(x - 1)^2$, C.E. $x \neq 1$ (il fattore compare due volte, la
   condizione è una).

## Livello 5: trinomio di secondo grado

Sette su dieci $x^2 + sx + p = (x - r_1)(x - r_2)$ con $r_1, r_2$ interi diversi, non nulli, non
opposti, $|s| \le 15$, $|p| \le 60$; tre su dieci $(px - s)(x - r)$ con $p = 2$ o $3$ e un valore
frazionario, scomposto spezzando il termine di primo grado e raccogliendo a gruppi.

1. $\frac{3x + 7}{x^2 - 10x + 16}$: due numeri con somma $-10$ e prodotto $16$, $-8$ e $-2$; C.E.
   $x \neq 2,\ x \neq 8$.
2. $\frac{x + 3}{2x^2 - x - 10}$: $2x^2 + 4x - 5x - 10 = 2x(x + 2) - 5(x + 2) = (x + 2)(2x - 5)$;
   C.E. $x \neq -2,\ x \neq \frac{5}{2}$.

## Livello 6: scomposizioni in più passi, fattori mai nulli, due lettere

Cinque casi: raccoglimento e differenza di quadrati (circa 2 su 10, metà scritti al contrario come
$9x - 4x^3$), raccoglimento e trinomio (1,5 su 10), un fattore che non si annulla mai (2 su 10:
$(x - r)(x^2 + t^2)$ con raccoglimento parziale, o $kx(x^2 + t^2)$), nessuna condizione (1,5 su 10:
$x^2 + t^2$, $k(x^2 + t^2)$, $x^4 + bx^2 + t^2$, $p^2x^2 + q^2$), due lettere (3 su 10: $a(a \pm b)$,
$b(a \pm b)$, $a^2 - b^2$, $ab(a \pm b)$, risposta a scelta multipla).

1. $\frac{3x + 5}{9x^3 - x}$: $x(9x^2 - 1) = x(3x - 1)(3x + 1)$, C.E. $x \neq 0,\ x \neq \pm \frac{1}{3}$.
2. $\frac{1}{x^3 - x^2 + x - 1}$: $x^2(x - 1) + (x - 1) = (x - 1)(x^2 + 1)$, C.E. $x \neq 1$.
3. $\frac{x + 1}{x^2 + 9}$: C.E. nessuna condizione.
4. $\frac{2x - y}{3x^2 + 3xy}$: $3x(x + y)$, C.E. $x \neq 0,\ x \neq -y$.

## Livello 7: più frazioni nella stessa espressione

Due o tre frazioni, almeno un denominatore di secondo grado, al massimo tre condizioni. Denominatori
tra $kx$, $x - r$, $x^2 - s^2$, $x^2 - rx$ e $x^2 + t^2$. Tre casi, circa un terzo ciascuno: un valore
in comune a due denominatori (si scrive una volta sola), un denominatore che non si annulla mai,
valori tutti diversi.

1. $\frac{x}{x^2 - 1} - \frac{1}{x + 2}$: C.E. $x \neq \pm 1,\ x \neq -2$.
2. $\frac{x + 2}{x^2 + 3x} + \frac{2}{x + 3} - \frac{2}{x - 5}$: il valore $-3$ compare due volte;
   C.E. $x \neq 0,\ x \neq -3,\ x \neq 5$.

## Esercizi "brutti" da evitare

- Denominatori con zeri irrazionali ($x^2 - 3$, $x^2 + x - 1$): il verificatore li boccia.
- Denominatore senza lettere, o uguale al numeratore.
- Due fattori uguali non scritti come potenza; binomi non primitivi ($2x + 4$ come fattore).
- Al livello 5, radici opposte (è una differenza di quadrati, livello 4) o nulle (è un raccoglimento).
- Al livello 7, un denominatore mai nullo e un valore in comune insieme (due difficoltà in una).
- Valori enormi al livello 1.

## Variante a scelta multipla

Quattro opzioni diverse per valore (due scritture dello stesso insieme non possono stare insieme),
una sola giusta. I distrattori vengono dagli avvisi della lezione:

- livello 1: "non esiste" quando il numeratore vale zero (avviso "Numeratore zero e denominatore
  zero"); $0$ o $1$ quando la frazione non esiste ($\frac{8}{0} = 0$, $\frac{0}{0} = 1$); il valore
  con $(-3)^2$ scritto senza parentesi (viene $-9$); la frazione capovolta; il valore opposto;
- valore escluso con il segno cambiato ($3 - x$ dà $x \neq -3$, avviso "Il segno del valore
  escluso"); $2x - 3$ letto come $x \neq 3$ (non diviso) o $x \neq \frac{2}{3}$ (capovolto);
- la radice del numeratore aggiunta o al posto del denominatore;
- $x^2 - 9$ con il solo $x \neq 3$ (avviso "Dimenticare il valore negativo") o $x \neq 9$;
- raccoglimento letto termine per termine: $x^2 + x \neq 0$ come $x \neq 0$ (avviso "La legge vale
  per i prodotti, non per le somme"); il fattore $x$ dimenticato;
- al trinomio, i due numeri di somma e prodotto presi come valori esclusi ($-2$ e $-3$ per
  $x^2 - 5x + 6$); con $a \neq 1$, il valore non diviso per $a$;
- quadrato di un binomio: $\pm$ come se fosse una differenza di quadrati, o "nessuna condizione";
- $x^2 + 4$ spezzato in $(x - 2)(x + 2)$: $x \neq \pm 2$, o $x \neq -2$;
- due lettere: "$a \neq 0$ oppure $a \neq b$" (avviso "E, non oppure"), $a \neq 0,\ b \neq 0$
  (termine per termine), il segno del binomio cambiato, una condizione dimenticata;
- livello 7: un denominatore dimenticato, il solo valore in comune, il valore negativo di
  $x^2 - s^2$ dimenticato, il numeratore letto come denominatore.

Se mancano distrattori, si sposta un valore di $\pm 1$, $\pm 2$.

## Verifiche fatte (26 settembre 2026)

- `sample.mts frazioni-algebriche-esistenza 1000 all 1 | verify.py`: PASS, 7.000 su 7.000. Con il
  seed di partenza 7001: PASS, 7.000 su 7.000. Quote dei casi dentro gli intervalli di
  `CASE_RANGES` con tutti e due i seed.
- Esercizi diversi su 1.000 per livello (seed 1): 973, 763, 938, 707, 904, 746, 997.
- `width.mts`: esce con 0. Formula del problema più larga 224 px (livello 7) su 350; opzione più
  larga 178 px su 252.
- `review.mts`: esce con 0. `tsc` senza errori nel generatore, `eslint --max-warnings=0` pulito.
- Errori piantati a mano, tutti bocciati (16): valore escluso con il segno cambiato; LaTeX della
  risposta con il solo valore positivo; `correct` spostato su un'opzione sbagliata (livelli 1 e 5);
  denominatore $x^2 - 3$ con zeri irrazionali; valore del livello 1 cambiato; opzione "oppure" al
  posto di quella giusta; un denominatore dimenticato al livello 7; due opzioni uguali; una
  scomposizione sbagliata nei passaggi; un trinomio al posto di un raccoglimento (livello 3);
  "nessuna condizione" risposta con $x \neq 0$; $x \neq 1,\ x \neq -1$ scritto senza $\pm$; un
  "1x" nel testo; un numeratore nullo risposto "non esiste".

## Domande per la revisione

- Al livello 1 i numeri negativi si sostituiscono sempre tra parentesi, anche al primo termine:
  "$(-3) - 8$". L'esempio 1 della lezione scrive "$-3 + 3$" senza parentesi, l'esempio 2 chiede le
  parentesi. Quale scrittura teniamo?
- "Non esiste" e le C.E. in due lettere sono solo a scelta multipla. Per la risposta aperta
  servirebbe un tipo che contenga condizioni come $a \neq b$; con i tipi di oggi resta così.
- Le opzioni scrivono sempre $\pm$ per due valori opposti, e il verificatore lo pretende. La nota
  della lezione chiede di accettare anche la forma estesa: vale per la risposta aperta, e per le
  lezioni 47-49 conviene decidere una scrittura sola.
- Il distrattore $x \neq \pm 3$ per $x^4 + 3x^2 + 9$ è più debole degli altri (viene da "$t^2$ è un
  quadrato"). Va bene, o per quei denominatori meglio "nessuna condizione" contro valori vicini?
- Il livello 3 mescola il monomio in due lettere (a scelta multipla) con i casi in una lettera. Se
  la pagina dovesse un giorno offrire la risposta aperta per livello, quel caso andrebbe spostato.
