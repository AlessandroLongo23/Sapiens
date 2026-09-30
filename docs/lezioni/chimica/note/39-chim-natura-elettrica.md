# Note: La natura elettrica della materia

Lezione nuova (biennio di chimica, gruppo 28, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$8{,}0 \cdot 10^{-9}/1{,}60 \cdot 10^{-19} = 5{,}0 \cdot 10^{10}$; il prodotto sbagliato dell'avviso, $1{,}28 \cdot 10^{-27}$;
esempio 2, $2{,}0 \cdot 10^{10}$; esempio 3, $(+6{,}0 - 2{,}0)/2 = +2{,}0\,\text{nC}$ e $4{,}0 \cdot 10^{-9}/e = 2{,}5 \cdot
10^{10}$. Il pettine "con più di $10^{24}$ elettroni" è una stima: un pettine di $10\,\text{g}$ di plastica ha circa
$3 \cdot 10^{24}$ elettroni (circa $0{,}57$ moli di elettroni per grammo). `check.mts` passa (un avviso: 11 grassetti,
tutti su termini definiti).

## Struttura

Strofinio e due tipi di carica (du Fay, Franklin), la regola attrazione-repulsione con la figura dei pendolini; da dove
vengono le cariche (neutro, gli elettroni che si spostano) con la figura dello strofinio e l'avviso sul vetro
"positivo"; carica, coulomb, conservazione, carica elementare e $N = |Q|/e$ con due esempi e l'avviso sul prodotto;
conduttori, isolanti, contatto (esempio 3 e avviso sulla somma con il segno) e induzione; l'elettroscopio con la sua
figura; l'elettrolisi di Faraday e il nome di Stoney come ponte verso la lezione 40.

## Scelte

- La carica elementare è scritta $e = 1{,}60 \cdot 10^{-19}\,\text{C}$ (tre cifre), come nelle lezioni 40-42 e negli
  esercizi. Il README di chimica non la elenca tra le costanti del biennio: va aggiunta lì se Andrea la approva.
- Gli elettroni sono nominati prima della lezione 40, perché senza di loro lo strofinio non si spiega; il link porta
  alla lezione successiva.
- La legge di Coulomb non si scrive: la chimica del biennio ne usa solo l'idea (più vicine, più forte). Link alla
  lezione di fisica, che esiste in `fisica/url.md` ma è del quarto anno.
- Fonti storiche: Charles du Fay, due tipi di "elettricità" (vitrea e resinosa), 1733; Benjamin Franklin, i nomi
  positiva e negativa, lettere del 1747 (da verificare l'anno preciso); Michael Faraday, leggi dell'elettrolisi,
  1833-1834; George Johnstone Stoney, il nome "electron", 1891. Tutte da manuali e da Wikipedia (voci inglesi "Charles
  François de Cisternay du Fay", "Electron", lette a memoria, non rilette il 30 settembre 2026): da verificare.
- La serie triboelettrica non c'è: il segno di quattro coppie (vetro-seta, plastica-lana, palloncino e pettine sui
  capelli) basta per il biennio.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `natura-elettrica-pendolini`, `natura-elettrica-strofinio` (tre più e tre meno
per corpo prima, due elettroni che passano), `natura-elettrica-elettroscopio`. Nessuna interattiva: la lezione è
descrittiva e i pendolini statici dicono già tutto.

## Esercizi

Generatore `chim-natura-elettrica`, cinque livelli (specifica in `specs/exercises/chim-natura-elettrica.md`), senza
scene.

## Domande per Andrea

- Carica elementare con tre cifre ($1{,}60 \cdot 10^{-19}\,\text{C}$) o con due ($1{,}6 \cdot 10^{-19}\,\text{C}$)?
  Nella lezione e negli esercizi c'è la prima.
- Il segno delle coppie strofinate: nei laboratori si usa ancora il vetro con la seta e l'ebanite (o la plastica) con la
  lana? Il palloncino sui capelli diventa negativo in tutti i libri che conosci?
- Conduttori e isolanti al biennio di chimica: basta l'elenco della lezione, o il corpo umano e l'acqua salata come
  conduttori confondono (sono conduttori ionici, non come i metalli)?
- L'induzione (il pezzetto di carta attirato) va tenuta, o è fisica e si toglie?
