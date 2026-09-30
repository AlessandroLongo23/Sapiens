# Note: Energia potenziale gravitazionale ed elastica

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 18, 30 settembre 2026). Conti rifatti in Python:
$2{,}0 \cdot 9{,}8 \cdot 1{,}5 = 29{,}4$ J; $2{,}0 \cdot 9{,}8 \cdot 0{,}70 = 13{,}72$ J; $2{,}0 \cdot 9{,}8 \cdot (-0{,}80) = -15{,}68$ J
e $-15{,}68 - 13{,}72 = -29{,}4$ J; $0{,}50 \cdot 9{,}8 \cdot (1{,}2 - 3{,}0) = -8{,}82$ J, $0{,}50 \cdot 9{,}8 \cdot 1{,}2 = 5{,}88$ J;
$65 \cdot 9{,}8 \cdot 1200 = 764\,400$ J; $\tfrac12 \cdot 250 \cdot 0{,}080^2 = 0{,}80$ J e con $0{,}16$ m $3{,}2$ J;
$\sqrt{2 \cdot 6{,}0 / 1200} = 0{,}10$ m; $\tfrac12 \cdot 200 \cdot (0{,}10^2 - 0{,}050^2) = 0{,}75$ J. `check.mts` passa.

## Struttura ed esempi

Il lavoro del peso in una caduta ($m g h$, richiamato dalla lezione sul lavoro del gruppo 17, con il link);
l'energia potenziale gravitazionale $U = m g h$ con l'esempio 1; il livello di riferimento (figura, esempio 2 con
l'energia negativa e la stessa $\Delta U$, avviso); $W_P = -\Delta U$ e l'indipendenza dal percorso (richiamata dalla lezione sul
lavoro, figura dei tre percorsi, nota sulle forze conservative), esempi 3 (la palla lanciata:
lavoro negativo in salita, totale che dipende solo dalle quote) e 4 (l'escursionista, con il dislivello in km), avviso
sul segno; l'energia elastica (la deformazione $x$, figura delle tre molle, l'area sotto la retta di Hooke richiamata dalla
lezione sul lavoro, $U = \tfrac12 k x^2$), esempi 5 (con il raddoppio) e 6 (la deformazione dall'energia), avviso sul mezzo, il quadrato e i
centimetri; il lavoro della forza elastica; una tabella di confronto tra le due energie.

## Scelte

- Notazioni del README del secondo anno: $U$, $W$, $x$ per la deformazione. Nella lezione sulla legge di Hooke
  l'allungamento era $\Delta l$: lo dico nel testo.
- $g$ in $\text{m/s}^2$ (non $\text{N/kg}$ come nel primo anno), perché qui si lavora con le energie.
- "Forze conservative" solo in una nota: il capitolo del terzo anno "Il lavoro e le forze conservative" le tratta per
  bene. Il link della nota va alla lezione 64, non alle lezioni del terzo anno, che non sono ancora scritte.
- L'energia potenziale di un corpo esteso si riferisce al baricentro: non lo dico, perché gli esempi usano oggetti
  piccoli rispetto alle quote. Da decidere se serve una nota.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `livello-riferimento-vaso` (1 m = 2 cm: mensola a 3,0 cm, tavolo a 1,6 cm),
`lavoro-peso-tre-percorsi` (tre percorsi da $A$ a $B$ con lo stesso dislivello, 3 cm), `molla-deformazione-x`. Nessuna
interattiva. Il grafico della forza di una molla con l'area del triangolo l'avevo disegnato, ma la lezione sul lavoro
(gruppo 17) ha già `grafico-molla-area-triangolo`: l'ho tolto e ho messo il link. Per lo stesso motivo il lavoro del peso
lungo un piano inclinato è solo richiamato, con il link. Nei nodi di TikZ `\tfrac` fa fallire node-tikzjax: si usa
`\frac`.

## Esercizi

Generatore `fis-energia-potenziale`, cinque livelli (specifica in `specs/exercises/fis-energia-potenziale.md`):
L'energia potenziale gravitazionale, Il livello di riferimento, Il lavoro del peso, L'energia potenziale elastica, La
deformazione dall'energia. Nessuna scena.

## Domande per Andrea

- La deformazione della molla: $x$ (come nelle notazioni del secondo anno) o $\Delta l$, come nella lezione sulla legge
  di Hooke? Oppure $\Delta x$?
- $g$ in $\text{m/s}^2$ da questa lezione in poi, o si resta con $\text{N/kg}$ del primo anno?
- Il nome: "energia potenziale gravitazionale" o "energia potenziale della forza-peso"? L'Amaldi del biennio quale
  usa? (da verificare)
- Le forze conservative vanno nominate già al secondo anno, come faccio in una nota, o si lasciano al terzo?
- Il lavoro della forza elastica tra due deformazioni ($W_{el} = U_i - U_f$) serve al secondo anno, o basta l'energia di
  una molla deformata?
