# Note: Il moto di un proiettile lanciato in orizzontale

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 16, 30 settembre 2026). Conti rifatti in Python:
$\sqrt{1{,}6/9{,}8} = 0{,}4041$ s, $1{,}5 \cdot 0{,}4041 = 0{,}6061$ m, $9{,}8 \cdot 0{,}4041 = 3{,}960$ m/s,
$\sqrt{2{,}25 + 15{,}68} = 4{,}234$ m/s, $\tan^{-1}(3{,}96/1{,}5) = 69{,}25^\circ$; $\sqrt{40/9{,}8} = 2{,}0203$ s,
$18/2{,}0203 = 8{,}910$ m/s; $180/3{,}6 = 50$, $\sqrt{1000/9{,}8} = 10{,}102$ s, $50 \cdot 10{,}102 = 505{,}1$ m. Figura dei due
moti: $v_0 = 2{,}0$ m/s, $h = 1{,}225$ m, un'immagine ogni $0{,}1$ s, scala $4$ cm per metro: $x = 0; 0{,}8; \ldots; 4$ cm,
$y = 4{,}9; 4{,}704; 4{,}116; 3{,}136; 1{,}764; 0$ cm (discese di $0{,}049$ e $0{,}441$ m nel primo e nell'ultimo intervallo).
Figura delle velocità: stessa traiettoria, $y = 4{,}9 - 0{,}30625\,x^2$, componenti a $0{,}3$ cm per m/s ($v_x = 0{,}6$ cm,
$v_y = 0{,}735$ e $1{,}47$ cm a metà e all'arrivo). `check.mts` passa.

## Struttura ed esempi

I due moti (primo principio in orizzontale, caduta libera in verticale, leggi orarie), la figura stroboscopica,
l'esempio 1 (le due palline), l'avviso sul tempo di volo; tempo di volo e gittata, gli esempi 2 (pallina dal tavolo),
3 (la velocità dalla gittata) e 4 (il pacco dall'aereo); la traiettoria parabolica, l'avviso sull'altezza che cala come
il quadrato; la velocità durante il volo (componenti, Pitagora, angolo), la figura, l'esempio 5, l'avviso sulle
componenti sommate come numeri; la figura interattiva; il rimando al lancio obliquo del terzo anno.

## Scelte

- Origine ai piedi del tavolo, $y$ verso l'alto: $y = h - \tfrac{1}{2}g t^2$ e $v_y = -g t$. Alcuni libri mettono
  l'origine nel punto di lancio con $y$ verso il basso.
- La gittata si chiama $x_G$ e il tempo di volo $t_v$ (da confermare, vedi sotto).
- Il lancio obliquo non c'è: è al terzo anno (`fis-lancio-obliquo`, nell'albero), e la lezione lo nomina alla fine.
- L'esempio 4 ha un risultato di tre cifre, scritto $5{,}1 \cdot 10^2$ m come dicono le regole sulle cifre significative.

## Figure

Due TikZ, guardate in chiaro e in scuro: `proiettile-orizzontale-due-moti` (le ombre sul pavimento equidistanti e le
altezze sulla linea di destra, con i punti sulle coordinate del conto), `proiettile-velocita-componenti`. Interattiva
`proiettile-tavolo-gittata` (`fisica/ProiettileTavolo.tsx`): tavolo di $1{,}2$ m, $v_0$ da $0{,}5$ a $4{,}0$ m/s, il volo
dalle leggi orarie mostrato quattro volte più lento del vero (lo dice la didascalia), un punto ogni $0{,}05$ s, le due
ombre, la velocità con le componenti, le ultime tre traiettorie che restano con la loro gittata.

## Esercizi

Generatore `fis-moto-proiettili`, cinque livelli (specifica in `specs/exercises/fis-moto-proiettili.md`), con la scena
`lancio-orizzontale` (nuova, `scenes/LancioOrizzontale.tsx`).

## Domande per Andrea

- I nomi $t_v$ per il tempo di volo e $x_G$ per la gittata: l'Amaldi ne usa altri? Le lezioni del lancio obliquo del
  terzo anno dovranno usare gli stessi.
- L'origine ai piedi del tavolo con $y$ verso l'alto, o nel punto di lancio con $y$ verso il basso (niente segni meno)?
- L'angolo della velocità all'arrivo con $\tan^{-1}$: si fa in seconda o si lascia al terzo anno?
- L'esempio del pacco lanciato dall'aereo ($500$ m, $180$ km/h) va bene, o preferisci un esempio sportivo (una palla da
  tennis colpita in orizzontale)?
