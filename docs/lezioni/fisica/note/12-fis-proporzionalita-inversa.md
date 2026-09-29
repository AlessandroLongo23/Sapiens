# Note: Proporzionalità inversa e quadratica

Lezione nuova, primo lotto di fisica (gruppo 3, 29 settembre 2026). I numeri sono rifatti nello script `verifica.py`
del lotto, con le coordinate dei quattro grafici TikZ. `check.mts` passa senza avvisi.

## Struttura ed esempi

Proporzionalità inversa (definizione, unità della costante come prodotto delle unità, grafico, previsione),
proporzionalità quadratica (definizione, unità, grafico), una nota sulla legge dell'inverso del quadrato, la
linearizzazione ($p$ in funzione di $1/V$, $s$ in funzione di $t^2$), la tabella per riconoscere la legge, due avvisi
in fondo. La matematica è nella lezione 45 e nella lezione "La parabola": linkate, non rispiegate.

Cinque esempi:

1. la siringa con il manometro: sei coppie $V$, $p$ con i prodotti tra $2975$ e $3040\ \text{kPa} \cdot \text{cm}^3$,
   entro l'$1{,}1\%$ dalla media $3006$; costante $3{,}0 \cdot 10^3\ \text{kPa} \cdot \text{cm}^3$ (legge di Boyle,
   con il link alla lezione del terzo anno);
2. il carrello su una rotaia di $1{,}2$ m: $v \cdot t = 1{,}2$ m (la prima prova dà $1{,}22$), la costante è la
   lunghezza della rotaia; a $0{,}50$ m/s, $2{,}4$ s;
3. previsioni con la siringa: $250$ kPa a $12\ \text{cm}^3$ (estrapolazione), $25\ \text{cm}^3$ a $120$ kPa;
4. il carrello sul piano inclinato che parte da fermo: $s/t^2$ tra $11{,}8$ e $12{,}4\ \text{cm/s}^2$, media
   $12{,}04 \approx 12\ \text{cm/s}^2$; con la citazione di Galileo, "Discorsi e dimostrazioni matematiche intorno a due nuove
   scienze", 1638 (la legge dei quadrati dei tempi, terza giornata);
5. $s$ in funzione di $t^2$: retta con pendenza $\dfrac{75}{6{,}25} = 12\ \text{cm/s}^2$.

Nel testo il rapporto $s/t$ di $47{,}9$ cm in $2{,}0$ s è scritto $24{,}0\ \text{cm/s}$: il valore è $23{,}95$,
arrotondato per eccesso come si fa a scuola.

## Scelte

- La legge di Boyle compare come esempio, non come legge da studiare: la lezione vera è al terzo anno. Il manometro è
  descritto in una frase ("uno strumento che misura la pressione"), perché la pressione arriva nel capitolo dei fluidi,
  più avanti nello stesso anno.
- La linearizzazione è nella lezione, anche se alcuni libri del biennio non la fanno: è il metodo che i fisici usano
  davvero per riconoscere una legge, e dà un senso alla pendenza della lezione 11.
- La legge dell'inverso del quadrato è solo in un `ad-note`, senza esempi numerici.
- Nella tabella per riconoscere la legge, la dipendenza lineare "cresce di $m \cdot x$" quando $x$ raddoppia: corretto,
  ma forse poco intuitivo. In alternativa si può scrivere "non raddoppia".

## Figure

Quattro blocchi TikZ, larghi al più 377 px: `grafico-pressione-volume`, `grafico-distanza-tempo-piano-inclinato`,
`pressione-in-funzione-inverso-volume`, `distanza-in-funzione-quadrato-tempo`.

Una figura interattiva: `siringa-pressione-volume` (`src/components/content/interactive/fisica/SiringaPressione.tsx`),
registrata in `FIGURES`. La siringa con il manometro a lancetta: un cursore (o il trascinamento del manico dello
stantuffo) cambia il volume da $20$ a $60\ \text{cm}^3$, la pressione è $3000/V$ kPa, e sotto la figura ci sono $V$,
$p$ e il prodotto $p \cdot V = 3000$. I puntini dell'aria si stringono quando il volume cala. "Dimezza il volume" lo
dimezza con un'animazione. È la legge ideale, senza gli errori della tabella dell'esempio 1.

### Grafici marcati `% poi-interattivo`

| Figura | Cosa dovrà fare |
|---|---|
| `grafico-pressione-volume` | trascinare un punto lungo la curva e leggere $p$, $V$ e il loro prodotto |
| `grafico-distanza-tempo-piano-inclinato` | trascinare un punto lungo la curva: a tempo doppio, distanza quadrupla |
| `pressione-in-funzione-inverso-volume` | passare con un bottone da $p$ in funzione di $V$ a $p$ in funzione di $1/V$ |
| `distanza-in-funzione-quadrato-tempo` | passare da $s$ in funzione di $t$ a $s$ in funzione di $t^2$ e leggere la pendenza |

## Formulario e flashcard

Formulario: le due proporzionalità, la tabella della linearizzazione, la tabella per riconoscere la legge, tre
avvisi. 17 carte.

## Esercizi

Generatore `fis-proporzionalita-inversa`, cinque livelli (`specs/exercises/fis-proporzionalita-inversa.md`): la
costante inversa con la sua unità, prevedere con l'inversa, prevedere con la quadratica, riconoscere la legge dalla
tabella, riconoscere la legge dal grafico (scena `grafico-dati` con i soli punti).

## Prerequisiti

`fis-proporzionalita-inversa <- fis-proporzionalita-diretta`.

## Domande per Andrea

- La linearizzazione ($y$ in funzione di $1/x$ o di $x^2$) va tenuta al primo anno?
- La costante della siringa: meglio in $\text{kPa} \cdot \text{cm}^3$ (come qui) o convertita in joule
  ($3{,}0\ \text{J}$), che però arrivano solo con il lavoro?
- La citazione di Galileo (1638, "Discorsi", terza giornata) è corretta nella forma "gli spazi percorsi stanno tra loro
  come i quadrati dei tempi"? Da verificare sul testo.
- L'esempio del sasso negli esercizi usa $4{,}9\ \text{m/s}^2$ prima della caduta libera: va bene?
