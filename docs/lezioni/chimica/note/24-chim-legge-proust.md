# Note: La legge di Proust

Lezione nuova (biennio di chimica, gruppo 24, 30 settembre 2026). Conti rifatti in Python con la tavola della lezione 01
(il rame, che non c'è, con $63{,}55$): solfuro di rame(I), $\mathrm{Cu_2S}$, $127{,}10/32{,}07 = 3{,}963$; solfuro di ferro
$55{,}85/32{,}07 = 1{,}742$; ossido di magnesio $24{,}31/16{,}00 = 1{,}519$; acqua $16{,}00/2{,}02 = 7{,}921$; cloruro di
sodio $35{,}45/22{,}99 = 1{,}542$; diossido di carbonio $32{,}00/12{,}01 = 2{,}664$, monossido $1{,}332$. Tabella degli
esperimenti: $1{,}98/0{,}500$, $3{,}96/1{,}00$, $6{,}34/1{,}60 = 3{,}9625$, $9{,}51/2{,}40 = 3{,}9625$, tutti $3{,}96$;
percentuale $6{,}34/7{,}94 = 79{,}8\%$. Esempio 1, $3{,}04/2{,}00 = 1{,}52$; esempio 2, $12{,}0/3{,}96 = 3{,}030$;
esempio 3, $250 \cdot 0{,}112 = 28{,}0$ (con $2{,}02/18{,}02$ viene $28{,}02$); esempio 4, $8{,}00/3{,}96 = 2{,}020$, avanzo
$0{,}98$, prodotto $10{,}02$; esempio 5, $7{,}00/1{,}74 = 4{,}02$, $1{,}74 \cdot 3{,}00 = 5{,}22$, avanzo $1{,}78$,
prodotto $8{,}22$. `check.mts` passa.

## Scelte

- Il composto di rame e zolfo è $\mathrm{Cu_2S}$, quello che si forma scaldando i due elementi; la lezione lo chiama
  "solfuro di rame" senza il numero romano. Il rapporto esatto dà $79{,}85\%$ di rame, al confine tra $79{,}8$ e
  $79{,}9$: la lezione usa i dati dell'esperimento, $79{,}8\%$.
- Rapporti con tre cifre e l'elemento più pesante sopra, sempre; l'avviso sul rapporto rovesciato insegna a chiedersi
  quale elemento pesa di più.
- "Reagente limitante" è nominato insieme a "reagente in eccesso", perché il procedimento ne ha bisogno.
- Il ferro-zolfo usa $1{,}74$ anche nella lezione 23 (reagente che avanza), per coerenza.

## Fonti da verificare

Proust (1754-1826) in Spagna, il carbonato di rame sintetico e naturale, la disputa con Berthollet "tra il 1801 e il
1807": date dai libri di storia della chimica, da verificare. Berthollidi: il nome è quello dei libri universitari.

## Figure

TikZ `proust-rame-zolfo-grafico` (massa di zolfo in funzione di quella di rame, quattro punti su una retta per l'origine,
con la riga `% poi-interattivo`), guardata in chiaro e in scuro. Interattiva `proust-rapporto-combinazione`
(`chimica/ProustRapporto.tsx`): quattro coppie (Cu e S, Fe e S, Mg e O, O e H) con i rapporti della lezione, due cursori
per le masse; "Fai reagire" stacca da ogni barra la parte che reagisce e la porta nella barra del composto, il reagente in
eccesso resta con la scritta "avanza". Sotto, il rapporto, la massa del secondo elemento che servirebbe per tutto il
primo, la massa del composto. Guardata in chiaro, in scuro, sul telefono (le etichette della scelta sono i simboli,
perché i nomi facevano scorrere la pagina di lato) e dopo la reazione.

## Esercizi

Generatore `chim-legge-proust`, cinque livelli (specifica in `specs/exercises/chim-legge-proust.md`).

## Domande per Andrea

- Rame e zolfo: a scuola si ottiene $\mathrm{Cu_2S}$ (rapporto circa $4:1$) o si insegna $\mathrm{CuS}$ (circa $2:1$)?
  I libri non sono d'accordo; la lezione usa $\mathrm{Cu_2S}$.
- Il ferro e lo zolfo "nel rapporto $7:4$" è la forma classica dei libri; qui è $1{,}74$. Va bene il decimale?
- "Reagente limitante" al primo anno o solo "reagente in eccesso"?
- Il riquadro sui berthollidi: da tenere o da togliere al primo anno?
- La composizione percentuale si ferma qui ai dati sperimentali; dalla formula la calcola la lezione 35. Il confine
  va bene?
