# Note: Punto materiale, traiettoria e sistema di riferimento

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 12, 30 settembre 2026). Conti rifatti in Python:
$-15 - 25 = -40$ m e $11 - 3 = 8$ s (esempio 1); $\Delta s = 50$ m, $d = 120 + 70 = 190$ m (esempio 2); tabella
dell'automobilina $16 - 4 = 12$ m, $0 - 16 = -16$ m, $0 - 4 = -4$ m, $d = 12 + 16 = 28$ m (esempio 3); dalle 8:52 alle
9:17 $8 + 17 = 25$ min. Nella figura della pallina le posizioni scendono di $0{,}1$, $0{,}3$, $0{,}5$, $0{,}7$, $0{,}9$ cm
(tempi uguali, moto accelerato), sulla curva $y = 2{,}5 - 0{,}4\,x^2$. `check.mts` passa.

## Struttura ed esempi

Il punto materiale (con l'avviso "non vuol dire corpo piccolo"), la traiettoria (rettilinea e curvilinea, rimando ai
moti nel piano), il sistema di riferimento (retta orientata, origine, unità, orologio; moto e quiete relativi; la
pallina lasciata cadere sul treno, con la figura delle due traiettorie), la posizione con il segno su una retta
orientata (figura), istante e intervallo (avviso sugli orari), spostamento con il segno (esempio 1, avviso sull'ordine
della sottrazione), distanza percorsa (esempio 2 con la figura, avviso sul ritorno, figura interattiva), la legge
oraria come tabella (esempio 3 con le posizioni disegnate sulla retta, nota su quello che la tabella non dice, rimando
al grafico spazio-tempo della lezione 40 e alla velocità della lezione 39).

## Scelte

- Lo spostamento come vettore e la distanza percorsa sono già nella lezione 13 (Grandezze scalari e vettoriali, con un
  esempio di andata e ritorno in km): qui li riprendo con la coordinata e il segno, e rimando là per il vettore.
- Il grafico spazio-tempo non è in questa lezione: la tabella dell'esempio 3 è disegnata come posizioni sulla retta,
  in due righe (andata e ritorno), e il grafico è lasciato alla lezione 40.
- La traiettoria relativa è detta con la pallina sul treno, senza parlare di composizione dei moti (lezione del
  capitolo sui moti nel piano) né di relatività galileiana (terzo anno).
- Dati della Terra (diametro circa $13\,000$ km, distanza dal Sole circa $150$ milioni di km): valori noti e arrotondati,
  da verificare sull'Amaldi se si vuole la stessa cifra.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `traiettoria-pallina-treno-banchina`, `posizione-retta-orientata` (auto a
$30$ m, ciclista a $-30$ m, tacche ogni $10$ m), `andata-ritorno-spostamento-distanza` ($0{,}5$ cm ogni $10$ m, da $0$ a
$120$ e ritorno a $50$), `automobilina-posizioni-istanti` (posizioni in scala, $0{,}45$ cm ogni metro).
Interattiva `andata-ritorno-distanza-spostamento` (`fisica/AndataRitorno.tsx`): l'auto dell'esempio 2 a $10$ m/s,
andata in $12$ s, sosta di $3$ s, ritorno in $7$ s; cursore sul tempo e bottone; la freccia blu dello spostamento e le
due righe arancioni della strada fatta, con i valori sotto. Guardata in chiaro, in scuro e sul telefono, dopo
l'animazione, senza errori in console.

## Esercizi

Generatore `fis-punto-materiale`, quattro livelli (specifica in `specs/exercises/fis-punto-materiale.md`), scena
`strada-posizioni` (nuova, `scenes/StradaPosizioni.tsx`).

## Domande per Andrea

- Posizione con la lettera $s$ (come le notazioni del secondo anno) o con $x$, che molti libri usano per il moto su una
  retta? E "spazio percorso": l'Amaldi usa questa espressione per la distanza percorsa o per la posizione?
- La lezione separa spostamento (con il segno) e distanza percorsa (sempre positiva). L'Amaldi del biennio fa la stessa
  distinzione in questo capitolo, o la lascia ai vettori?
- La traiettoria che dipende dal sistema di riferimento (la pallina sul treno) va bene qui, o è meglio lasciarla alla
  composizione dei moti?
- Nel generatore c'è un livello sugli intervalli tra due orari (8:52 e 9:17): utile o troppo aritmetico per la fisica?
