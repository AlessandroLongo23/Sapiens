# Note: La forza elastica e la legge di Hooke

Lezione nuova (primo lotto di fisica, gruppo 5, 29 settembre 2026). Conti rifatti con SymPy in `verifica_lezioni.py`:
$200 \cdot 0{,}050 = 10$ N, $6{,}0 / 40 = 0{,}15$ m, $2{,}0 / 0{,}040 = 50$ N/m e $3{,}0 / 50 = 0{,}060$ m, il
$12{,}5$ N/m dell'avviso, la tabella dell'esempio 4 ($k = 40$ N/m per tutte le coppie e sulla pendenza), $0{,}30 \cdot
9{,}8 = 2{,}94$ N e $2{,}94 / 49 = 0{,}060$ m, il "circa dieci volte" ($2{,}94 / 0{,}30 = 9{,}8$), l'allungamento più
grande della figura interattiva ($14{,}7$ cm). `check.mts` dà un solo avviso: "Hooke" maiuscolo in un titolo, che è un
nome proprio.

## Struttura ed esempi

Corpi elastici e plastici, allungamento e lunghezza ($\Delta l = l - l_0$, con la figura), la legge di Hooke, la
forza elastica con il suo verso (figura della molla allungata e compressa, `ad-note` su $F_x = -k\,x$), la costante
elastica e la sua unità, cinque esempi (forza, allungamento, lunghezza e allungamento, costante da una tabella, massa
appesa), il grafico forza-allungamento, il limite di elasticità. Avvisi: centimetri e metri, l'allungamento non è la
lunghezza, la massa non è la forza.

## Scelte

- $\Delta l$ per l'allungamento, come chiede il lotto; $x$ solo nell'`ad-note` con l'asse, per la lezione sul moto
  armonico.
- La legge scritta per i moduli, $F = k \cdot \Delta l$, con il verso della forza elastica detto a parole; la forma
  con il segno è un approfondimento.
- La forza elastica si chiama anche "forza di richiamo"; ho usato "forza elastica" nel testo e $\vec{F}_e$.
- Molle in serie e in parallelo: non ci sono. Il programma (`programma.md`) non le cita, e l'elenco degli argomenti
  dell'Amaldi letto il 26 settembre 2026 non scende a quel dettaglio; senza una fonte che dica che l'Amaldi del primo
  anno le tratta, le ho lasciate fuori, come chiedeva il lotto.
- Gli ordini di grandezza delle costanti (ammortizzatori di un'auto, decine di migliaia di N/m; molle dei giocattoli,
  pochi N/m) sono stime mie: da verificare, o da togliere.
- Hooke pubblicò la legge nel 1678 ("De potentia restitutiva"), dopo averla data come anagramma nel 1676: data a
  memoria, da verificare.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `molla-lunghezza-allungamento`, `molla-forza-elastica-verso` (la molla
attaccata in basso al blocco, così le frecce dal centro non si sovrappongono alla molla), `grafico-forza-allungamento`
(i punti dell'esempio 4, con `% poi-interattivo`), `grafico-limite-elasticita` (qualitativo). Interattiva
`molla-hooke-righello` (`fisica/MollaHookeRighello.tsx`): massa da $0$ a $300$ g e $k$ da $20$ a $100$ N/m, la molla
scende lungo un righello di $25$ cm disegnato a un quarto della grandezza vera.

## Esercizi

Generatore `fis-forza-elastica`, specifica in `specs/exercises/fis-forza-elastica.md`: sei livelli (la forza, l'allungamento,
centimetri e metri, lunghezza e allungamento con la scena `molla-righello`, la costante da una tabella, una massa
appesa).

## Domande per Andrea

- $\Delta l$ o $x$ per l'allungamento? E $l_0$ per la lunghezza a riposo?
- La legge con il segno ($F = -k\,x$) già in prima, o solo per i moduli come qui?
- "Forza elastica" o "forza di richiamo" come nome principale?
- Molle in serie e in parallelo: le fate in prima? Se sì, servono una sezione e un livello del generatore.
- Il limite di elasticità: basta il grafico qualitativo, o volete il limite di rottura e la deformazione plastica?
