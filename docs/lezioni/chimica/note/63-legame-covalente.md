# Note: Il legame covalente

Lezione nuova (6 ottobre 2026), seconda del capitolo "I legami chimici", gruppo E del lotto. Non pubblicata.
`check.mts` passa su lezione e flashcard; sul formulario resta un avviso, "titolo con maiuscole all'inglese", per il
titolo "Scrivere la formula di Lewis di una molecola semplice": la maiuscola è quella di un nome proprio.

## Struttura e confini

La coppia in comune con $\mathrm{H_2}$ e la formula di Lewis; coppie di legame e coppie solitarie con $\mathrm{Cl_2}$;
quanti legami forma un atomo; legami doppi e tripli con $\mathrm{O_2}$ e $\mathrm{N_2}$; ordine, lunghezza ed
energia; le molecole semplici con più di due atomi.

- Confine con la 64: questa lezione definisce il legame covalente e il covalente puro. Le molecole dell'ultima
  sezione ($\mathrm{H_2O}$, $\mathrm{NH_3}$, $\mathrm{CH_4}$, $\mathrm{CO_2}$, $\mathrm{HCl}$) hanno legami polari: la
  lezione lo dice in una riga e rimanda. Niente elettronegatività, niente cariche parziali.
- Confine con la 67: qui le formule di Lewis sono solo delle biatomiche e di cinque molecole semplici, ricavate da
  "ogni atomo fa i legami che gli servono". Il procedimento generale, gli ioni poliatomici, la risonanza e le
  eccezioni all'ottetto sono della 67. Il formulario ha un procedimento in quattro passi, che riassume quello che la
  lezione fa negli esempi 5 e 6; se il gruppo F ne scrive uno diverso, questo va allineato.
- Confine con la 70: del perché un legame doppio non sia forte il doppio c'è solo il link ai legami $\sigma$ e
  $\pi$.
- Confine con la 02 e la 69: la formula di Lewis non dà la forma, con il link alla VSEPR.
- I solidi covalenti (diamante, quarzo) non sono nominati: sono della 75.

## Scelte

- "Covalente puro (o covalente apolare)": tutti e due i nomi, poi sempre "puro", come nel brief. "Omopolare" non
  compare.
- "Coppia solitaria", come nella 02 e nella 44 (altri libri: doppietto libero, coppia di non legame).
- "Elettrone spaiato" per i puntini singoli del simbolo di Lewis.
- Numero di legami $= 8 - \text{elettroni di valenza}$, dato come regola dei casi più comuni, con la tabella per i
  gruppi 14-17 e l'idrogeno a parte. La parola valenza non compare: è della lezione 76.
- Le formule di Lewis delle molecole sono disegnate "in fila" o "a croce", e l'ultimo paragrafo dice che la forma
  vera è un'altra. La 44 avverte di non disegnare l'acqua in fila: qui il disegno in fila è dichiarato come formula e
  non come forma.
- Il paramagnetismo dell'ossigeno liquido è in un riquadro `ad-note` come limite del modello di Lewis. La teoria
  degli orbitali molecolari è fuori dal programma e non è nominata.
- Ordine di legame solo intero ($1$, $2$, $3$): i legami di ordine frazionario arrivano con la risonanza (67).

## Dati e cose da verificare

- Tabella ordine-lunghezza-energia, a memoria dalle tabelle delle energie medie di legame dei testi di chimica
  generale: $\mathrm{C{-}C}$ $154\,\text{pm}$ e $348\,\text{kJ/mol}$, $\mathrm{C{=}C}$ $134$ e $614$,
  $\mathrm{C{\equiv}C}$ $120$ e $839$, $\mathrm{N{-}N}$ $145$ e $163$, $\mathrm{N{=}N}$ $125$ e $418$,
  $\mathrm{N{\equiv}N}$ $110$ e $945$. Da verificare sul libro adottato; sono valori medi, e i libri differiscono di
  qualche unità ($\mathrm{C{-}C}$ $347$ o $348$, $\mathrm{N{\equiv}N}$ $941$ o $945$). Gli stessi numeri sono in
  `chim3-e.ts` e in `_chim3_e.py`.
- $\mathrm{C{-}O}$ $143\,\text{pm}$ e $\mathrm{C{=}O}$ $123\,\text{pm}$ (esempio 4): da verificare.
- $\mathrm{O{=}O}$ $121\,\text{pm}$ e $498\,\text{kJ/mol}$: solo nella figura interattiva, da verificare.
- "Il legame triplo di $\mathrm{N_2}$ è uno dei più forti che esistano": vero (quello del monossido di carbonio è più
  forte); la frase non dice "il più forte".
- Per l'azoto il doppio legame vale più del doppio del singolo ($418$ contro $2 \cdot 163$): il riquadro "un legame
  doppio non è forte il doppio" usa solo il carbonio, e gli esercizi fanno lo stesso.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `covalente-idrogeno-coppia-condivisa`, `covalente-cloro-ottetti`,
`covalente-ossigeno-azoto-lewis`, `covalente-ordine-lunghezza-carbonio` (le tre lunghezze in scala),
`covalente-lewis-molecole-semplici`. Le formule di Lewis sono fatte a mano con le coordinate dei puntini.

Una interattiva:

| Nome | File | Che cosa fa |
|---|---|---|
| `legame-covalente-condividi-coppie` | `LegameCovalenteCondividi.tsx` | due atomi tra cinque coppie (H e H, Cl e Cl, O e O, N e N, H e Cl); si scelgono le coppie in comune da zero a tre, e sotto ogni atomo si legge quanti elettroni ha intorno; con il numero giusto compaiono il tipo di legame, la lunghezza e l'energia |

Guardata in chiaro, in scuro e a 390 px, senza scorrimento laterale. Una sola figura interattiva: l'altra idea, le
lunghezze in scala al variare dell'ordine, si legge meglio ferma, ed è una TikZ.

## Esercizio guidato

L'esempio 6 (il diossido di carbonio): si fermerebbe in tre punti. Quanti legami servono al carbonio e a ogni
ossigeno ($4$ e $2$); la scelta dei due legami doppi; il controllo finale sugli elettroni di valenza ($16$, otto
coppie).

## Esercizi

Generatore `legame-covalente`, cinque livelli (specifica in `specs/exercises/legame-covalente.md`): fatti; legami e
coppie solitarie di un atomo; elettroni di una molecola con legami singoli; legami doppi e tripli; ordine, lunghezza
ed energia. I livelli 2, 3 e 4 chiedono un numero intero e vanno anche a risposta aperta. Controllo
`scripts/exercises/checkers/legame_covalente.py`: PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001;
errori piantati tutti bocciati; `review.mts` e `width.mts` con codice 0. Non collegato al sito. Il livello 4 usa
anche etene, etino, cianuro di idrogeno e metanale, che la lezione non ha (sono nella 02): il testo dell'esercizio
dice sempre quali legami ci sono.

## Dubbi per Andrea

- La regola "numero di legami $= 8 -$ elettroni di valenza" va data così, o si aspetta la valenza della lezione 76?
- Il riquadro sul paramagnetismo dell'ossigeno: utile come limite del modello, o da togliere perché apre una domanda
  a cui il corso non risponde?
- $\mathrm{CO_2}$ in questa lezione (con i due doppi legami) o solo nella 67?
- Le formule di Lewis con i trattini per i legami e i puntini per le coppie solitarie: va bene, o si vogliono anche
  le coppie solitarie come trattini, come in alcuni libri italiani?
- I valori della tabella: quale libro fa da riferimento?

Prerequisiti proposti: `chim-regola-ottetto`, `chim-simboli-lewis`, `chim-configurazione-elettronica`
