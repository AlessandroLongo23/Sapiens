# Informazione, dati e codici

Generatore: `inf-informazione-dati` (`src/lib/exercises/v2/generators/inf-informazione-dati.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_informazione_dati.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/01-inf-informazione-dati.md` (note in `docs/lezioni/informatica/note/01-inf-informazione-dati.md`).
Aiuti condivisi del capitolo: `src/lib/exercises/v2/inf-informazione.ts` e `scripts/exercises/checkers/_inf_informazione.py`.

Sei livelli nell'ordine della lezione. I livelli 1, 2, 3 e 6 sono a scelta multipla (`answer.kind = 'choice'`): la
risposta è una frase, una sequenza di bit o una parola. I livelli 4 e 5 hanno per risposta un numero naturale
(`answer.kind = 'number'`) e una scelta multipla costruita da `toChoice()`.

## Nomi dei livelli

1. Dati e informazioni
2. Codificare con una tabella
3. Decodificare una sequenza
4. Quante sequenze con n bit
5. Quanti bit servono
6. Analogico o digitale

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` a righe di al più 24 caratteri quando sono più lunghe.
- Nei testi degli esercizi un dato si scrive tra virgolette alte curve, “38,5”, perché KaTeX non ha le caporali
  della lezione.
- Sempre quattro opzioni, tutte diverse, una sola giusta. Niente trattini lunghi e niente "piuttosto che".

## Livello 1: dati e informazioni

Tre casi.

- `trova-informazione` (circa 3 su 10): "Quale di queste è un'informazione, e non soltanto un dato?". Una frase che
  dà significato a un valore ("Il treno parte dal binario 17") e tre valori da soli tra virgolette (“38,5”, “MI”,
  “03/10”).
- `trova-dato` (circa 3 su 10): "Quale di questi è soltanto un dato, e non un'informazione?". Un valore da solo e tre
  frasi.
- `ruolo` (circa 4 su 10): una storia in una frase, "Il registro elettronico prende i voti di Sara in matematica,
  calcola la media e mostra la media di Sara.", e una domanda su uno dei tre pezzi: "Che cosa sono i voti di Sara in
  matematica per questa operazione?" (i dati in ingresso), "Che cos'è il calcolo della media?" (l'elaborazione), "Che
  cos'è la media di Sara?" (l'informazione ottenuta). Le quattro opzioni sono sempre: I dati in ingresso,
  L'elaborazione, L'informazione ottenuta, Il codice.

Pezzi: undici argomenti per i primi due casi (febbre, voto, ora, binario, prezzo, data, nota musicale, colore del
semaforo, altezza, passi, pagina), ognuno con un valore estratto e la frase che lo contiene; otto storie per il terzo
(registro e media, contapassi, cassa del supermercato, stazione meteo, cronometro della pista, torneo, biblioteca,
assenze), con dodici nomi. Il nome dell'operazione comincia sempre con "il calcolo", "la somma", "la ricerca" o "il
conteggio".

Regola del controllo: un'opzione è un dato se è un solo valore tra virgolette, senza spazi; è un'informazione se è
una frase di almeno tre parole senza virgolette.

## Livello 2: codificare con una tabella

Una tabella con quattro lettere in ordine alfabetico e, sotto ciascuna, una sequenza di 2 bit; le quattro sequenze
sono tutte diverse, in ordine casuale. Si chiede la codifica di una parola di 3-5 lettere scritta con quelle lettere.
Tre insiemi di lettere, ognuno con le sue parole: A C O S (CASA, COSA, SACCO…), A E L M (MELA, LAMA, MAMMA…), A N O T
(NOTA, TANA, NONNA…).

Distrattori, tutti della stessa lunghezza della risposta: una lettera codificata con la sequenza di un'altra; ogni
lettera con la sequenza della colonna accanto; i due bit di ogni gruppo scambiati; la codifica di un'altra parola
della stessa lunghezza.

Esempio: A = 00, C = 01, O = 10, S = 11, parola CASA. Risposta: 01001100.

## Livello 3: decodificare una sequenza

Una tabella con sei lettere e sequenze di 3 bit tutte diverse (sei delle otto possibili). Si dà la sequenza di bit di
una parola di 4 o 5 lettere, senza spazi, e si chiede la parola. Tre insiemi: A E L M R T, A I N O P S, C E I O R S.

Distrattori: la parola con una lettera sbagliata (letta dalla colonna sbagliata) e altre parole vere della stessa
lunghezza scritte con le stesse lettere.

Esempio: C = 010, E = 101, I = 100, O = 001, R = 110, S = 111; sequenza 001110111001. Risposta: ORSO.

## Livello 4: quante sequenze con n bit

Tre casi.

- `sequenze` (circa 3 su 10): "Quante sequenze diverse si possono scrivere con $n$ bit?" oppure "Un codice binario ha
  parole di $n$ bit. Quante cose diverse può rappresentare al massimo?", con $n$ da 2 a 12. Risposta $2^n$.
- `libere` (circa 4 su 10): "Un codice binario con parole di $n$ bit è usato per rappresentare $k$ simboli. Quante
  sequenze restano senza significato?", con $n$ da 3 a 7 e $2^{n-1} < k < 2^n$. Risposta $2^n - k$.
- `bit-in-piu` (circa 3 su 10): "Con $n$ bit si scrivono $2^n$ sequenze diverse. Quante se ne scrivono con $n + d$
  bit?", con $n$ da 2 a 9 e $d$ da 1 a 3. Risposta $2^{n+d}$.

Distrattori: $2n$, $n^2$, la potenza prima e quella dopo; nel terzo caso anche "aggiungo $2d$" e "moltiplico per $d$".

Esempi: 7 bit, 128 sequenze; parole di 5 bit per 26 lettere, 6 sequenze libere.

## Livello 5: quanti bit servono

"Un codice binario deve distinguere $N$ livelli di un videogioco, con parole tutte della stessa lunghezza. Quanti bit
servono, come minimo, per ogni parola?" Risposta: il più piccolo $n$ con $2^n \ge N$. $N$ da 4 a 1024; undici tipi di
cose da contare.

- `potenza` (circa 1 su 4): $N$ è una potenza di due. La scelta multipla contiene $n + 1$.
- `potenza-piu-uno` (circa 1 su 7): $N = 2^k + 1$. La scelta contiene $n - 1$.
- `generico` (gli altri). La scelta contiene $n - 1$.

Altri distrattori: $N$ (un bit per ogni cosa) e la metà di $N$.

Esempi: 26 lettere, 5 bit; 64 livelli, 6 bit; 65 livelli, 7 bit.

## Livello 6: analogico o digitale

"Quale di questi oggetti rappresenta l'informazione in modo analogico?" (uno analogico e tre digitali) oppure "in modo
digitale?" (uno digitale e tre analogici), metà e metà.

- Analogici: un termometro a mercurio, un orologio a lancette, un disco in vinile, una bilancia con l'ago, un
  tachimetro a lancetta, una musicassetta, una meridiana, una fotografia su pellicola, l'indicatore del carburante a
  lancetta.
- Digitali: un termometro con il display a cifre, un orologio che mostra le ore con i numeri, un file musicale, una
  bilancia che scrive il peso in cifre, un contapassi, una foto scattata con il telefono, un interruttore della luce,
  un pallottoliere, un contachilometri a cifre.

## Esercizi da evitare

- Due lettere con la stessa sequenza, o sequenze di lunghezze diverse nella stessa tabella.
- Una parola con una lettera che non è nella tabella.
- Al livello 4, $k$ cose che non richiedono proprio $n$ bit, o nessuna sequenza libera.
- Opzioni di lunghezza diversa ai livelli 2 e 3 (la risposta si riconoscerebbe a occhio).

## Verifica

Il controllo rilegge tutto dal testo: classifica le opzioni del livello 1 dalla forma e ricava il ruolo dalla frase
citata nella domanda; ai livelli 2 e 3 legge la tabella, codifica la parola o divide la sequenza in gruppi di tre e la
decodifica; ai livelli 4 e 5 rifà il conto; al livello 6 cerca ogni oggetto nei due elenchi qui sopra. Poi controlla
le quattro opzioni (diverse, una sola giusta, quella indicata da `correct`), il caso dichiarato in `params.case` e le
quote dei casi.

## Domande per la revisione

- Al livello 1 il dato si riconosce perché è un valore da solo tra virgolette: è abbastanza, o servono situazioni
  meno guidate?
- Al livello 6 la meridiana, la pellicola e il pallottoliere sono esempi che uno studente di oggi riconosce?
- Al livello 3 le parole sono di 4 o 5 lettere (12 o 15 bit da dividere in gruppi): è la lunghezza giusta?
