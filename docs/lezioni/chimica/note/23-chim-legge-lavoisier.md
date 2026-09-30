# Note: La legge di Lavoisier

Lezione nuova (biennio di chimica, gruppo 24, 30 settembre 2026). Conti rifatti in Python con la tavola della lezione 01:
esempio 1, ferro $5{,}00\,\text{g}$ e zolfo $5{,}00 \cdot 32{,}07/55{,}85 = 2{,}871\,\text{g}$, prodotto $7{,}87\,\text{g}$;
esempio 2, bicarbonato $2{,}00\,\text{g}$ dà $2{,}00 \cdot 44{,}01/84{,}01 = 1{,}048\,\text{g}$ di diossido di carbonio,
$150{,}62 - 149{,}57 = 1{,}05$; esempio 3, $1{,}20 \cdot 40{,}31/24{,}31 = 1{,}990\,\text{g}$ di ossido, ossigeno
$0{,}79\,\text{g}$; esempio 4, $10{,}00 \cdot 56{,}08/100{,}09 = 5{,}603\,\text{g}$ di ossido di calcio, $4{,}40\,\text{g}$
di diossido; reagente in eccesso con il rapporto $1{,}74$ della lezione 24, $10{,}00/1{,}74 = 5{,}747$, solfuro
$15{,}75\,\text{g}$ e zolfo avanzato $2{,}25\,\text{g}$; massa persa formando $18\,\text{g}$ d'acqua,
$286\,\text{kJ}/c^2 = 3{,}2 \cdot 10^{-9}\,\text{g}$; spinta sul palloncino con $1{,}05\,\text{g}$ di gas a
$20\,^\circ\text{C}$: $0{,}57\,\text{L}$, circa $0{,}7\,\text{g}$ d'aria spostata. `check.mts` passa.

## Struttura

Apertura (cenere più leggera, chiodo arrugginito più pesante); Lavoisier e lo stagno nella storta chiusa (1774); la legge
in un blocco citato e in formula; esempio 1; sistemi aperti e chiusi con la figura interattiva; esempi 2 (il gas che esce),
3 (il magnesio che prende ossigeno), la lana d'acciaio con la figura TikZ, l'avviso "la massa non sparisce", esempio 4
(il calcare); il reagente che avanza con l'avviso; le cifre (decimali nelle somme, con il rimando alla lezione 13); due
riquadri da saltare: Einstein e il palloncino.

## Fonti da verificare

- La frase del Traité (1789), "rien ne se crée, ni dans les opérations de l'art, ni dans celles de la nature, et l'on
  peut poser en principe que, dans toute opération, il y a une égale quantité de matière avant et après l'opération":
  resa in italiano a senso, da verificare sul testo.
- L'esperimento dello stagno nella storta chiusa, 1774, con l'aria che entra all'apertura: racconto dei libri di storia
  della chimica, da verificare.

## Figure

TikZ `lavoisier-lana-acciaio-bilancia` (bilancia a due piatti prima e dopo), guardata in chiaro e in scuro. Interattiva
`lavoisier-bilancia-aperto-chiuso` (`chimica/LavoisierBilancia.tsx`): beuta con $20\,\text{g}$ d'aceto su una bilancia
elettronica, vetrino con il bicarbonato ($0{,}10$-$0{,}50\,\text{g}$) e, se la beuta è chiusa, il tappo, tutti sul piatto
dall'inizio. "Versa il bicarbonato" porta la polvere nella beuta (e mette il tappo), poi la reazione dura cinque secondi:
bollicine, mucchietto che si consuma, gas formato $m \cdot 44{,}01/84{,}01$ che cresce come $1 - (1-r)^2$. Aperta, la
lettura scende con il gas che esce; chiusa, resta ferma e il gas si vede come puntini nella beuta, finché "Togli il tappo"
lo fa uscire. Il bicarbonato resta sotto mezzo grammo perché nella beuta chiusa $1\,\text{g}$ di gas porterebbe la
pressione a qualche atmosfera; il gas che resta sciolto nell'aceto è trascurato. Guardata in chiaro, in scuro, sul
telefono e dopo ogni passo, senza errori in console e senza scorrimento laterale.

## Esercizi

Generatore `chim-legge-lavoisier`, cinque livelli (specifica in `specs/exercises/chim-legge-lavoisier.md`).

## Domande per Andrea

- In laboratorio la prova del recipiente chiuso si fa con il palloncino o con il tappo? La lezione spiega in un riquadro
  perché con il palloncino la bilancia segna qualche decimo di grammo in meno (spinta di Archimede): va bene tenerlo, o
  è troppo per il primo anno?
- Il riquadro su Einstein ($3 \cdot 10^{-9}\,\text{g}$ per $18\,\text{g}$ d'acqua) va bene al primo anno o si toglie?
- Sistema chiuso e isolato: la lezione distingue solo aperto e chiuso. Serve anche "isolato"?
- Negli esercizi tutte le masse al centesimo di grammo, per non aprire la questione dei decimali nelle somme: va bene?
