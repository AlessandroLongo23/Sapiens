# Note: Proporzionalità diretta e dipendenza lineare

Lezione nuova, primo lotto di fisica (gruppo 3, 29 settembre 2026). I numeri sono rifatti nello script `verifica.py`
del lotto, con le coordinate dei sei grafici TikZ. `check.mts` passa senza avvisi.

## Struttura ed esempi

La matematica della proporzionalità diretta e della funzione lineare è nella lezione 45 ("Proporzionalità diretta e
inversa") e nelle lezioni 81 e 82 (retta e coefficiente angolare): qui non si rispiega, si linka. La lezione di fisica
aggiunge quello che la matematica non ha: la costante con la sua unità e il suo significato; i rapporti "uguali entro
l'incertezza"; la pendenza calcolata con due punti della retta (non due misure) e con le unità; la pendenza che non è
l'angolo, perché l'angolo dipende dalla scala; il termine noto come grandezza fisica (lunghezza a riposo, temperatura
iniziale, posizione iniziale).

Sei esempi:

1. la densità dell'alluminio dai rapporti $m/V$ dei cinque cilindri della lezione 10: media
   $2{,}696 \approx 2{,}70\ \text{g/cm}^3$; l'incertezza del rapporto del cilindro più piccolo è circa il $3\%$ ($0{,}1/13{,}4 + 0{,}1/5{,}0$),
   cioè $0{,}07\ \text{g/cm}^3$, più delle differenze tra i rapporti ($0{,}03$);
2. la pendenza della retta della molla: $10{,}0$ cm a $250$ g, $0{,}040\ \text{cm/g}$;
3. previsioni con la molla: $3{,}6$ cm con $90$ g, circa $14$ cm con $360$ g (estrapolazione);
4. la lunghezza della molla, $L = 0{,}040\ \text{cm/g} \cdot m + 12{,}0\ \text{cm}$ (retta dei minimi quadrati:
   $0{,}0398$ e $12{,}03$);
5. l'acqua sul fornello: $4{,}0$ °C/min e $18$ °C (minimi quadrati: $4{,}03$ e $18{,}1$), previsione $46$ °C a
   $7$ minuti;
6. il carrello sulla rotaia a cuscino d'aria: $15$ cm/s e $20$ cm (minimi quadrati: $15{,}0$ e $20{,}2$), che rimanda al
   moto rettilineo uniforme.

Nei grafici la pendenza è letta tra punti della retta su una linea della griglia: $5{,}0$ e $25{,}0\ \text{cm}^3$ per i
cilindri ($13{,}5$ g e $67{,}5$ g), l'origine e $250$ g per la molla.

## Scelte

- "Pendenza" come nome fisico, con il rimando a "coefficiente angolare" della matematica. La lettera $k$ per la
  costante di proporzionalità, $m$ e $q$ per la retta, come nella lezione 45.
- Il simbolo $m$ è la pendenza nella formula $y = mx + q$, come nella lezione di matematica, e la massa negli esempi
  della molla. Nell'esempio 4, dove ci sono tutte e due, la pendenza è scritta per esteso ("pendenza $=$ ...") e la
  legge è $L = 0{,}040\ \text{cm/g} \cdot m + 12{,}0$ cm, con $m$ massa. Da decidere se chiamare la pendenza in un
  altro modo (domanda sotto).
- Le densità dei tre materiali del grafico: ferro $7{,}9$, alluminio $2{,}7$, legno di faggio "circa $0{,}7$"
  $\text{g/cm}^3$ (valori da manuale; il faggio varia tra circa $0{,}65$ e $0{,}75$, da verificare sulla tabella del libro).
- La legge di Hooke non è introdotta: l'esempio 2 rimanda a "La forza elastica e la legge di Hooke".

## Figure

Sei blocchi TikZ, guardati in chiaro e in scuro, larghi al più 384 px: `pendenza-retta-cilindri-alluminio`,
`pendenza-retta-molla`, `pendenza-non-dipende-dalla-scala`, `rette-densita-tre-materiali`,
`grafico-lunghezza-molla-massa`, `grafico-riscaldamento-acqua`. Nessuna figura interattiva: la molla interattiva è
nella lezione 10, e le altre idee (spostare la retta, cambiare la scala) sono tutte del piano cartesiano.

### Grafici marcati `% poi-interattivo`

| Figura | Cosa dovrà fare |
|---|---|
| `pendenza-retta-cilindri-alluminio` | trascinare i due punti del triangolo lungo la retta: $\Delta m / \Delta V$ resta $2{,}70$ |
| `pendenza-retta-molla` | spostare il secondo punto lungo la retta e leggere $\Delta l / \Delta m$ |
| `pendenza-non-dipende-dalla-scala` | allungare o schiacciare l'asse verticale: cambia l'angolo, la pendenza scritta no |
| `rette-densita-tre-materiali` | scegliere un materiale e vedere la sua retta con la pendenza uguale alla densità |
| `grafico-lunghezza-molla-massa` | spostare la retta in su e in giù cambiando il termine noto, a pendenza fissa |
| `grafico-riscaldamento-acqua` | prolungare la retta e leggere la temperatura prevista a ogni minuto |

## Formulario e flashcard

Formulario: proporzionalità diretta, pendenza, dipendenza lineare, riconoscere la legge, tre avvisi. 17 carte.

## Esercizi

Generatore `fis-proporzionalita-diretta`, cinque livelli (`specs/exercises/fis-proporzionalita-diretta.md`): la
costante con la sua unità, prevedere un valore, la pendenza dal grafico (scena `grafico-dati`), riconoscere il legame,
il termine noto.

## Prerequisiti

`fis-proporzionalita-diretta <- fis-tabelle-grafici, funzioni-lineari` (la lezione di matematica 45). Il link alla
densità chiede anche `fis-grandezze-derivate`, del capitolo precedente.

## Domande per Andrea

- La pendenza si chiama $m$ come in matematica, anche quando nella stessa formula c'è la massa $m$? Alternative: $k$
  anche per la retta, o $a$ ("$L = a \cdot m + L_0$").
- Il termine noto: "termine noto" come in matematica, o "intercetta" / "valore iniziale"?
- "Uguali entro l'incertezza": il criterio della lezione è "differenze più piccole dell'incertezza e senza tendenza".
  Al biennio si usa anche il confronto tra intervalli (le due misure con le barre si sovrappongono)?
- La densità del legno di faggio "circa $0{,}7\ \text{g/cm}^3$": quale valore usa il libro in adozione?
