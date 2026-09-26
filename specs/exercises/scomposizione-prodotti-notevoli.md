# Scomposizione con i prodotti notevoli

Generatore: `scomposizione-prodotti-notevoli`
(`src/lib/exercises/v2/generators/scomposizione-prodotti-notevoli.ts`). Verifica indipendente:
`scripts/exercises/checkers/scomposizione_prodotti_notevoli.py`. Lezione collegata:
`docs/lezioni/riscritte/35-scomposizione-prodotti-notevoli.md`.

Lo studente scompone in fattori un polinomio a coefficienti interi riconoscendo un prodotto notevole
letto al contrario. La risposta (`answer.kind = "expression"`, `form: "factored"`) è la
scomposizione portata fino in fondo in ℤ: ogni parentesi è primitiva (nessun numero o lettera comune
ai suoi termini) e irriducibile. Esempio: `x^4 - 16 = (x^2 + 4)(x + 2)(x - 2)`, mai
`(x^2 + 4)(x^2 - 4)`.

## Costruzione

Si costruisce all'indietro: prima le basi (`params.spec`: caso, fattore comune `k`, basi `a`, `b`,
`c`), poi i fattori, poi il polinomio come prodotto sviluppato. Le basi sono monomi di primo grado o
numeri, con coefficienti primi tra loro: così ogni parentesi è primitiva e irriducibile per
costruzione (binomi e trinomi di primo grado primitivi, somme di quadrati di primo grado, falsi
quadrati di primo grado). Le eccezioni con basi di secondo grado sono controllate a parte: `x^2 - q`
e `p x^2 - q` compaiono solo se `p` e `q` non sono entrambi quadrati.

## Scrittura

Le convenzioni sono quelle della lezione:

- il polinomio del testo è ordinato per grado complessivo decrescente e, a parità di grado, secondo
  le potenze decrescenti della prima lettera in ordine alfabetico (`8a^3 - 36a^2b + 54ab^2 - 27b^3`);
  fa eccezione la base binomia, scritta come nella lezione, trinomio quadrato e poi `-c^2`
  (`x^2 - 2x + 1 - y^2`);
- nella risposta prima il fattore comune, poi le parentesi; somma per differenza con la somma prima,
  `(a + b)(a - b)`; dentro ogni parentesi i termini per grado decrescente, il primo positivo;
- se il primo termine del polinomio è negativo si raccoglie anche il segno meno:
  `-x^2 + 10x - 25 = -(x - 5)^2`;
- un fattore ripetuto si scrive come potenza: `(x - 1)^2(x + 1)`.

## Regole comuni

- Coefficienti del testo interi, in valore assoluto al massimo 250 (il più grande degli esempi della
  lezione è 54; il limite serve alle quarte potenze con fattore comune, come `32x^5 - 162xy^4`).
- Lettere da una delle due famiglie `a, b, c` e `x, y, z`.
- Consegna fissa: "Scomponi in fattori il polinomio."

## Livello 1: differenza di quadrati

`a^2 - b^2 = (a + b)(a - b)`, con `a = px` (a volte `px^2`) e `b` numero (circa 55%, caso
`lettera e numero`) o `qy` (caso `due lettere`); `p` fino a 9, `q` fino a 10, primi tra loro.

1. `9x^2 - 16 = (3x + 4)(3x - 4)`.
2. `4x^2 - 25y^2 = (2x + 5y)(2x - 5y)` (esempio 1 della lezione).

## Livello 2: quadrato di un binomio

`a^2 ± 2ab + b^2 = (a ± b)^2`, doppio prodotto con il segno più o meno (metà e metà); `b` numero
(circa 60%) o monomio con un'altra lettera; a volte la base è `x^2` (`x^4 + 2x^2 + 1`).

1. `4x^2 - 12xy + 9y^2 = (2x - 3y)^2`.
2. `25z^2 + 40z + 16 = (5z + 4)^2`.

## Livello 3: somma o differenza di cubi

`a^3 ± b^3 = (a ± b)(a^2 ∓ ab + b^2)`, basi di primo grado o numeri con coefficienti fino a 5; il
falso quadrato è irriducibile e la scomposizione finisce lì.

1. `8a^3 + 27 = (2a + 3)(4a^2 - 6a + 9)`.
2. `x^3 - 8 = (x - 2)(x^2 + 2x + 4)` (esempio 10).

## Livello 4: cubo di un binomio o quadrato di un trinomio

Quattro termini (circa 60%, `(a ± b)^3`, basi con coefficienti fino a 3 e 4) o sei termini
(`(a + b + c)^2`, con `a = x`, `2x` o `x^2`, `b = ±qy`, `c = ±r`, `q, r` fino a 3). Il polinomio di
sei termini è ordinato come gli altri, quindi i quadrati non stanno tutti all'inizio.

1. `8a^3 - 36a^2b + 54ab^2 - 27b^3 = (2a - 3b)^3` (esempio 8).
2. `x^4 - 2x^2y + 4x^2 + y^2 - 4y + 4 = (x^2 - y + 2)^2` (esempio 7, ordinato).

## Livello 5: raccoglimento e poi prodotto notevole

Un fattore comune (numero da 2 a 7, lettera con esponente 1 o 2 anche con un numero, oppure segno
meno, da solo o con un numero o una lettera) e dentro uno dei prodotti dei livelli 1-3: differenza
di quadrati, quadrato di un binomio o somma e differenza di cubi (circa 35%, 35%, 30%). Con il
segno meno da solo non si usa la differenza di quadrati, perché `-x^2 + 9` è già una differenza
di quadrati `9 - x^2`.

1. `50x^3 - 20x^2 + 2x = 2x(5x - 1)^2` (esempio 12).
2. `-8a^3 + 27 = -(2a - 3)(4a^2 + 6a + 9)`.

## Livello 6: più passi o basi binomie

Quattro casi:

- due differenze di quadrati, circa 35%: `a^4 - b^4 = (a^2 + b^2)(a + b)(a - b)`, a volte con un
  fattore comune (`2x^5 - 2x = 2x(x^2 + 1)(x + 1)(x - 1)`, esempio 13);
- base binomia, circa 35%: `(a ± b)^2 - c^2 = (a ± b + c)(a ± b - c)` (esempio 15), con `b` numero e
  `c` lettera, o due lettere, o `c` numero;
- sesta potenza, circa 10%: `x^6 - 1`, `x^6 - 64`, `64x^6 - 1`, `x^6 - y^6`, dalla differenza di
  quadrati (esempio 14);
- raccoglimento parziale, circa 20%: `x^3 - x^2 - x + 1 = (x - 1)^2(x + 1)` (esempio 16), con basi
  `px ± q` o `x ± y`.

1. `x^4 - 81 = (x^2 + 9)(x + 3)(x - 3)`.
2. `x^2 - 2x + 1 - y^2 = (x + y - 1)(x - y - 1)`: basi `x - 1` e `y`, prima la somma, i termini di
   ogni parentesi in ordine di grado.

## Esercizi "brutti" da evitare

- un polinomio con un fattore comune ai livelli 1-4 (sarebbe il livello 5), o senza al livello 5;
- una parentesi della risposta non primitiva (`(4x + 2)(4x - 2)`) o riducibile (`x^2 - 4` lasciato
  dentro, `x^4 + x^2 + 1` come falso quadrato);
- un trinomio che è solo un trinomio di secondo grado (`x^2 + 2x - 3`): nella base binomia la `c`
  ha sempre una lettera diversa da quella di `a` oppure `b` ha una lettera;
- coefficienti oltre 250, `1x`, `x^1`, `+ -`, un `1` davanti a una parentesi.

## Variante a scelta multipla

Quattro opzioni scritte come prodotti. Esattamente una è la scomposizione giusta; le altre sono di
due tipi, e il controllo le distingue:

- sbagliate: un polinomio diverso da quello del testo;
- incomplete: lo stesso polinomio, ma con una parentesi che si scompone ancora o con un fattore
  comune non raccolto. Sono sbagliate per questo motivo, e il controllo lo verifica con
  `factor_list` su ogni parentesi. Ai livelli 5 e 6 ce n'è sempre almeno una (tranne nella base
  binomia, dove lo "stop troppo presto" non è un prodotto); al massimo due per esercizio.

Distrattori per livello, dagli avvisi della lezione:

- livello 1: `(a - b)^2` (avviso "Differenza di quadrati e quadrato di una differenza"), `(a + b)^2`,
  radice del coefficiente dimenticata `(a + b^2)(a - b^2)` (solo con `b` fino a 4), basi scambiate
  `-(a + b)(a - b)`;
- livello 2: segno del doppio prodotto sbagliato, `(a + b)(a - b)`, doppio prodotto preso come base
  `(a ± 2b)^2` (avviso "Il doppio prodotto va controllato");
- livello 3: `(a ± b)^3` (avviso "la somma di cubi non è il cubo della somma"), il falso quadrato
  scritto come quadrato `(a + b)(a - b)^2` (avviso "Il falso quadrato non è un quadrato"), segno
  sbagliato nel falso quadrato o nel primo fattore;
- livello 4: segno della seconda base cambiato, il segno fuori dal cubo `-(a - b)^3` (avviso "Il
  segno fuori dal cubo"), cubo letto come somma di cubi; per il trinomio, i segni delle basi scelti
  male (riquadro "Il controllo dei segni");
- livello 5: incompleta `k(a^2 - b^2)`, fattore comune dimenticato, segno del fattore comune perso,
  più i distrattori del prodotto interno;
- livello 6: incompleta `(a^2 + b^2)(a^2 - b^2)` (avviso "Fermarsi troppo presto"),
  `(a^3 + b^3)(a^3 - b^3)` e `(a^2 - b^2)(a^4 + a^2b^2 + b^4)` (esempio 14), `(a + b)(a^2 - b^2)`;
  sbagliate `(a^2 + b^2)(a - b)^2`, `(a + b)^3(a - b)`, segno della base binomia sbagliato.

Se i distrattori non bastano, si sposta di ±1, ±2 l'ultimo termine di un fattore.

Un'opzione troppo larga per il pulsante (252 px utili a 16 px) va su due righe con
`\begin{gathered} … \\ … \end{gathered}`, spezzata tra due fattori vicino a metà: la seconda riga
comincia con la parentesi del fattore successivo, per esempio
`(2a + 1)(4a^2 - 2a + 1)` e sotto `(2a - 1)(4a^2 + 2a + 1)`. La larghezza si stima sui caratteri
(un esponente vale 0,7, il `^` niente): oltre 31 unità, circa 8 px l'una, si va a capo. Succede solo
al livello 6 (sesta potenza e `(a + b)(a - b)(a^4 + a^2b^2 + b^4)` con coefficienti), circa un
esercizio su dieci. Misura con KaTeX su 150 esercizi per livello: nessuna opzione oltre 252 px
(la più larga 233 px), nessun problema oltre 350 px (il più largo 291 px, al livello 4). Il
controllo ricompone le righe e boccia un'opzione con una riga persa, perché il suo valore non
corrisponde più al LaTeX.

## Verifica

Il controllo Python rilegge il polinomio dal testo e la risposta e ogni opzione dal loro LaTeX, come
prodotto `k(f_1)^{e_1}(f_2)^{e_2}\dots`. Controlla: uguaglianza con SymPy; ogni parentesi primitiva,
con almeno due termini e irriducibile (`factor_list`); nessun fattore ripetuto invece della potenza;
numero di fattori irriducibili uguale a quello di SymPy; forma per livello; ordine dei termini;
segno meno davanti quando il primo termine è negativo; passaggi (ogni uguaglianza senza testo in
mezzo deve essere vera); la scelta multipla come sopra. Il caso di ogni livello si legge dalla
fattorizzazione di SymPy, non da `params`, e la sua quota è controllata con `CASE_RANGES`.

Esito, 1.000 esercizi per livello: PASS con il seed di partenza 1 e con il seed 7001. Il controllo
è lento (circa 4 minuti per 6.000 esercizi, per `factor_list` su ogni opzione).

Errori piantati a mano, tutti bocciati:

- risposta cambiata (`(3x + 4)(3x - 4)` al posto di `(2y + 5)(2y - 5)`);
- risposta non scomposta fino in fondo (`(x^2 + 4y^2)(x^2 - 4y^2)` al posto di
  `(x^2 + 4y^2)(x + 2y)(x - 2y)`), con il valore SymPy giusto;
- fattore comune non raccolto (`(4x + 6)(4x - 6)` per `16x^2 - 36`);
- `choice.correct` spostato su un'opzione sbagliata e su un'opzione incompleta;
- un'opzione incompleta sostituita con un'altra scomposizione completa (due opzioni giuste);
- un livello 5 senza opzione incompleta;
- vincolo violato: coefficiente oltre 250 nel testo, polinomio non ordinato, fattore ripetuto
  (`(3c + 2)(3c + 2)(3c - 2)`), meno non raccolto davanti (`(-2a - b)(2a + b)` al posto di
  `-(2a + b)^2`), `params.case` sbagliato.

Esercizi diversi su 1.000 per livello (seed da 1): livello 1: 517, livello 2: 539, livello 3: 305,
livello 4: 317, livello 5: 898, livello 6: 447.

## Domande per la revisione

- Nel quadrato di un trinomio il polinomio è ordinato (`x^2 + 4xy + 4y^2 + 2x + 4y + 1`), mentre la
  lezione lo presenta con i tre quadrati all'inizio (`x^2 + 4y^2 + 1 + 4xy + 2x + 4y`). Ordinato è
  più difficile da riconoscere: va bene, o conviene scriverlo come nella lezione?
- Nella base binomia la risposta ordina i termini di ogni parentesi, `(x + y - 1)(x - y - 1)`,
  mentre la nota della lezione scrive `(x - 1 + y)(x - 1 - y)`, che mostra la base `x - 1`. Quale
  forma preferisce Andrea?
- Con il segno meno raccolto la risposta è `-(2a - 3)(4a^2 + 6a + 9)`; qualche libro scrive
  `(3 - 2a)(9 + 6a + 4a^2)`. Nella risposta aperta futura andranno accettate tutte e due?
