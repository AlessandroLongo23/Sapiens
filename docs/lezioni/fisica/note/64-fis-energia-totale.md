# Note: Forze dissipative e conservazione dell'energia totale

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 18, 30 settembre 2026). Conti rifatti in Python:
$0{,}20 \cdot 12 \cdot 9{,}8 \cdot 2{,}0 = 47{,}04$ J, $\tfrac12 \cdot 12 \cdot 16 = 96$ J, $\sqrt{2 \cdot 48{,}96 / 12} = 2{,}857$ m/s,
$4{,}0^2 / (2 \cdot 0{,}20 \cdot 9{,}8) = 4{,}082$ m; $25 \cdot 9{,}8 \cdot 3{,}2 = 784$ J,
$\tfrac12 \cdot 25 \cdot 36 = 450$ J, $334$ J (il 43% di 784); $2{,}0 \cdot 9{,}8 \cdot 2{,}0 \cdot \sin 30^\circ = 19{,}6$ J,
$0{,}20 \cdot 2{,}0 \cdot 9{,}8 \cdot \cos 30^\circ \cdot 2{,}0 = 6{,}790$ J, $K = 12{,}81$ J, $v = 3{,}579$ m/s, senza attrito $4{,}427$ m/s,
con $\mu_d\, m g$ al posto del coseno $7{,}84$ J; $\tfrac12 \cdot 1200 \cdot 20^2 = 240\,000$ J; $45 \cdot 9{,}8 \cdot 12 = 5292$ J,
$5292 / 7500 = 0{,}7056$, $2208$ J; $3{,}0 \cdot 10^4 / 0{,}25 = 1{,}2 \cdot 10^5$ J, $9{,}0 \cdot 10^4$ J. Figure: barre di 784 J = 4,8 cm
(450 J = 2,755 cm), fascia di 7500 J = 1,5 cm (5292 J = 1,058 cm). `check.mts` passa.

## Struttura ed esempi

Le forze dissipative e il lavoro dell'attrito (figura, dipendenza dal percorso, esempio 1 della cassa che rallenta, con
il link allo spazio di frenata della lezione 61 invece di ripeterlo); il
bilancio $\Delta E = W_{attrito}$ ricavato dal teorema dell'energia cinetica, l'energia dissipata, avviso sul segno,
esempio 2 (lo scivolo della lezione 63 con l'attrito, figura delle barre), esempio 3 (piano inclinato con l'attrito,
link alla lezione 21), avviso sulla forza premente, interattiva; dove va l'energia dissipata (energia interna,
l'esperimento di Joule con il link alla lezione sul calore), esempio 4 (la frenata); la conservazione dell'energia
totale, le forme dell'energia, tre catene di trasformazioni; il rendimento (esempio 5 dell'argano con la figura della
fascia, esempio 6 dell'energia spesa), avviso sul rendimento che non supera 1.

## Scelte

- "Energia interna" e non "calore" per l'energia dissipata: il calore è energia che passa da un corpo all'altro, e la
  lezione sul calore (gruppo 20) lo definisce. Da confermare.
- L'esperimento di Joule solo in due righe, senza l'equivalente meccanico della caloria: sta nella lezione sul calore.
  Data: "negli anni Quaranta dell'Ottocento" (la ruota a pale è del 1845, pubblicata nel 1850: da verificare).
- Niente valori tipici dei rendimenti (motore elettrico, motore a benzina, lampadina): non ho una fonte controllata.
  L'esempio 6 usa un motore a benzina al 25%, valore plausibile ma da verificare.
- Il rendimento con la potenza è una riga, con il link alla lezione del gruppo 17.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `attrito-lavoro-negativo`, `scivolo-bilancio-energia` (barre in scala),
`rendimento-energia-spesa-utile` (una fascia divisa in due, larghezze in scala). Interattiva `montagne-russe-attrito`
(`fisica/MontagneRusseAttrito.tsx`, che apre `MontagneRusseEnergia` della lezione 63 con l'attrito acceso): l'attrito è
semplificato, $\mu = 0{,}10$ con la forza premente $m g\cos\theta$ senza la parte centripeta delle curve, e dissipa
$\mu\, m g$ per ogni metro percorso in orizzontale; il carrello si ferma quando è lento su un tratto con
$\tan\theta \le \mu$. Il giro dura circa un minuto, a una volta e mezza il tempo vero.

## Esercizi

Generatore `fis-energia-totale`, sei livelli (specifica in `specs/exercises/fis-energia-totale.md`): Il lavoro
dell'attrito, La velocità dopo un tratto con attrito, L'energia dissipata, La rampa con l'attrito, Il rendimento, L'energia spesa. Scene
`pista-energia` (livello 3) e `piano-inclinato` della lezione 21 (livello 4, con l'angolo e la lunghezza). Lo spazio
di frenata è già nel generatore della lezione 61 (gruppo 17, livello 5), e qui non c'è.

## Domande per Andrea

- L'energia dissipata "diventa energia interna" o "diventa calore"? L'Amaldi del biennio quale dei due usa? (da
  verificare)
- Nel bilancio, $\Delta E = W_{attrito}$ oppure $\Delta E = W_{nc}$ (il lavoro delle forze non conservative)? Il secondo
  arriverà al terzo anno.
- Le forme dell'energia: l'elenco (interna, chimica, elettrica, della luce, nucleare) va bene per il secondo anno?
- Rendimento in percentuale o come numero puro? E il simbolo $\eta$ è quello dell'Amaldi?
- Servono valori tipici dei rendimenti (motore elettrico, a benzina, lampadina)? Se sì, da quale fonte?
