# Note: Iperbole equilatera e funzione omografica

Lezione nuova, scritta da zero (lotto del terzo anno, gruppo D, 5 ottobre 2026). Non pubblicata. Conti rifatti con SymPy nello stesso script della 118 (`gruppo-d/verifica.py`): il prodotto delle distanze dagli asintoti, vertici e fuochi di $xy = k$ (con la definizione di iperbole controllata in sette punti di $xy = 4$ e $xy = -9$: la differenza delle distanze dai fuochi vale $2a$), la risolvente dell'esempio 4, la scomposizione $\frac{2x + 1}{x - 1} = 2 + \frac{3}{x - 1}$, il conto con le lettere ($k = \frac{bc - ad}{c^2}$), i punti degli esempi 5 e 6, la funzione dell'esempio 7, i due casi con $ad - bc = 0$. `check.mts` passa sui tre file senza errori né avvisi.

## Scelte

- Confine con la 119: qui solo il caso $a = b$. Vertici, fuochi, asintoti ed eccentricità si prendono dalla 119 senza ridefinirli.
- Il passaggio da $x^2 - y^2 = a^2$ a $xy = k$ non usa la rotazione di $45°$, che gli studenti non hanno (la 104 non dà le formule della rotazione nel piano cartesiano). Usa la distanza punto-retta della 85: il prodotto delle distanze di un punto dai due asintoti è $\frac{a^2}{2}$, e con gli asintoti come assi diventa $|xy| = \frac{a^2}{2}$. È un argomento corretto ma non è quello dei libri.
- Funzione omografica: $y = \frac{ax + b}{cx + d}$ con $c \neq 0$ e $ad - bc \neq 0$. La lezione avverte che $a$, $b$, $c$ qui sono coefficienti e non semiassi. Il grafico è presentato come traslazione di $y = \frac{k}{x}$, con il link alla 109; il conto generale è in un `ad-note`.
- Il segno di $bc - ad$ dice dove stanno i rami rispetto al centro ("in alto a destra e in basso a sinistra").
- Per trovare una funzione omografica la lezione usa la forma $y = q + \frac{k}{x - p}$ con gli asintoti e un punto. Non c'è l'esercizio con tre punti e il sistema nei coefficienti.
- Coordinate con la virgola (correzione al brief), punto e virgola solo nei blocchi `grafico`.

## Lasciato fuori

- Dominio e immagine della funzione omografica come insiemi (c'è solo $x \neq -\frac{d}{c}$), la funzione inversa, le disequazioni fratte lette sul grafico.
- La tangente a $xy = k$ con lo sdoppiamento: c'è solo l'esempio 4, con $\Delta = 0$.
- La funzione omografica per tre punti.

## Dubbi per Andrea

1. Il passaggio a $xy = k$ con il prodotto delle distanze dagli asintoti va bene, o vuoi la rotazione di $45°$ con le sue formule (che andrebbero introdotte qui)?
2. Per $xy = k$ con $k < 0$ la lezione dà vertici e fuochi con $|k|$. È il livello di dettaglio giusto, o i fuochi di $xy = k$ si possono togliere?
3. La funzione omografica per tre punti (sistema nei coefficienti) va aggiunta?
4. "In alto a destra e in basso a sinistra del centro" per il segno di $bc - ad$: i libri dicono "primo e terzo quadrante rispetto agli asintoti". Quale preferisci?

## Da verificare

- I due blocchi `grafico` sono stati visti nel browser il 5 ottobre 2026 (Chromium a 420 px, tema chiaro). `xy=k` con $k = 4$, $9$, $-9$, $0{,}1$, $0$, $-0{,}1$: la curva implicita è disegnata bene anche vicino a zero, e con $k = 0$ restano i due assi. La funzione omografica con cinque combinazioni dei cursori, compresa $b = -2$ (resta la retta $y = 2$) e $a = 0$, $d = 0$; il valore si legge "$bc - ad = 3$". Funzionano. Il primo blocco ora sta nell'esempio 2 e il secondo nell'esempio 5, dopo la figura. Non visti in scuro né su un telefono vero.
- Nella 45 (Proporzionalità diretta e inversa) c'è già il link a questa lezione: quando si pubblica smette di puntare a una pagina vuota.
- Figure guardate nelle anteprime, in chiaro e in scuro, e nella pagina di prova in chiaro. Larghezza delle formule in evidenza non misurata.

## Figure

Cinque, in TikZ. Coordinate controllate: fuochi $(\pm 4{,}243, 0)$ per $x^2 - y^2 = 9$; vertici $(\pm 2, \pm 2)$ e fuochi $(\pm 2{,}828, \pm 2{,}828)$ per $xy = 4$; vertici $(\mp 3, \pm 3)$ e fuochi $(\mp 4{,}243, \pm 4{,}243)$ per $xy = -9$; per le due funzioni omografiche gli asintoti, il centro e i punti segnati, tutti calcolati con SymPy.

- `iperbole-equilatera-riferita-agli-assi`, `iperbole-equilatera-xy-uguale-4`, `iperbole-equilatera-xy-uguale-meno-9`, `funzione-omografica-2x-piu-1-fratto-x-meno-1`, `funzione-omografica-x-meno-3-fratto-2x-piu-4`.
- Blocchi `grafico`: `iperbole-equilatera-xy-k-cursore`, `funzione-omografica-cursori`.

## Formulario e flashcard

- Formulario senza figure. 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Quattro piani, ognuno dopo una figura che fa da copertina e seguito dal testo con la risposta. Visti su `/prova-grafico/lezione` con Chromium a 390 px, in chiaro, ai valori iniziali, agli estremi e nei casi limite.

- `iperbole-equilatera-secondo-membro-cursore` (esempio 1), nuovo: $x^2 - y^2 = k$ con $k$ da $-9$ a $9$ e gli asintoti. Per $k = 0$ restano le due rette $y = \pm x$, e il testo lo spiega con la scomposizione.
- `iperbole-equilatera-xy-k-cursore` (esempio 2): la domanda ora nomina $k = 0$, dove restano i due assi; risposta nel testo.
- `iperbole-xy-4-fascio-cursore` (esempio 4), nuovo, con la figura nuova `iperbole-xy-4-tangente-nel-vertice`: la retta $y = -x + q$ e $\Delta = q^2 - 16$.
- `funzione-omografica-cursori` (esempio 5), cambiato: ora ha i quattro cursori $a$, $b$, $c$, $d$, i valori $ad - bc$ e $C$, e la domanda porta ai due casi esclusi dalla definizione: $ad - bc = 0$ (resta la retta $y = 2$) e $c = 0$ (una retta, e $C$ "non esiste"). Con quattro cursori è il piano più alto della lezione: a 390 px ci sta, ma occupa tutto lo schermo.

La figura nuova è stata guardata in anteprima, in chiaro e in scuro.

Scartati: $y = q + \frac{k}{x - p}$ con i cursori $p$, $q$, $k$ (è una traslazione, argomento della 109, e i piani sarebbero stati cinque); un piano per il passaggio dagli assi agli asintoti (servirebbe ruotare il riferimento).

Prerequisiti proposti: iperbole, funzioni-lineari, distanza-punto-retta, grafici-trasformazioni
