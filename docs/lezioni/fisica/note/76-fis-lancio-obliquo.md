# Note: Il lancio obliquo e la gittata

Lezione nuova (lotto del terzo anno di fisica, gruppo 30, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $20\cos 35^\circ = 16{,}383$ e $20\sin 35^\circ = 11{,}472$ m/s; dopo $1{,}0$ s $x = 16{,}38$ m,
  $y = 11{,}47 - 4{,}9 = 6{,}57$ m, $v_y = 1{,}67$ m/s, $v = 16{,}46$ m/s;
- esempio 2: $h_{max} = 6{,}714$ m, $t_v = 2{,}341$ s, $L = 38{,}35$ m (anche con $400\sin 70^\circ / 9{,}8$);
- esempio 3: $9{,}8 \cdot 6{,}0 / \sin 60^\circ = 67{,}896$, radice $8{,}240$ m/s; altezze $0{,}866$ m a $30^\circ$ e
  $2{,}598$ m a $60^\circ$;
- esempio 4: coefficiente $9{,}8 / (2 \cdot 324 \cdot \cos^2 25^\circ) = 0{,}018412$, $\tan 25^\circ = 0{,}46631$;
  $y(9{,}15) = 4{,}267 - 1{,}541 = 2{,}725$ m, $y(20) = 9{,}326 - 7{,}365 = 1{,}961$ m; il vertice è a $12{,}7$ m, quindi a
  $20$ m il pallone scende;
- esempio 5: $v_{0x} = 12{,}990$, $v_{0y} = 7{,}5$, $\sqrt{56{,}25 + 235{,}2} = 17{,}072$, $t_v = 2{,}5073$ s,
  $L = 32{,}57$ m, $v = 21{,}45$ m/s; con la formula alla stessa quota $19{,}88$ m;
- figura delle cinque traiettorie ($v_0 = 20$ m/s): gittate $20{,}4$, $35{,}3$, $40{,}8$ m, altezze $1{,}4$, $5{,}1$,
  $10{,}2$, $15{,}3$, $19{,}0$ m.

`check.mts` passa senza errori e senza avvisi.

## Struttura ed esempi

Parte da dove finisce la lezione 56 (lancio orizzontale), richiamata in una riga: componenti della velocità iniziale
(figura), leggi del moto, traiettoria parabolica (dimostrata, con la figura delle velocità in tre punti), punto più
alto con tempo di salita e altezza massima, tempo di volo e gittata, con $\sin 2\alpha$ scritto prima come
$2\sin\alpha\cos\alpha$, l'angolo di $45^\circ$ e gli angoli complementari (figura delle cinque traiettorie,
interattiva), la velocità all'arrivo, il lancio da una quota con l'equazione di secondo grado, tabella di riepilogo.

Cinque esempi: posizione e velocità dopo un secondo; altezza massima, tempo di volo e gittata; velocità dalla gittata e
angolo complementare; la punizione che deve superare la barriera e passare sotto la traversa (equazione della
traiettoria); il sasso lanciato dal balcone.

## Scelte

- Simboli del README: $v_0$, $\alpha$, $v_{0x}$, $v_{0y}$, $t_v$, $h_{max}$, $L$. La lezione 56 chiamava la gittata
  $x_G$: qui è $L$, come fissato per il terzo anno, e la lezione non richiama il vecchio simbolo.
- Il tempo di salita si chiama $t_s$ (non era nel README).
- L'angolo di $45^\circ$ è dimostrato senza goniometria: $2\,v_{0x} v_{0y} = v_0^2 - (v_{0x} - v_{0y})^2$, massimo quando
  le due componenti sono uguali. La forma con $\sin 2\alpha$ arriva dopo, come conferma.
- $\sin 2\alpha = 2\sin\alpha\cos\alpha$ è enunciato, con il rimando alla goniometria del quarto anno (senza link: la
  lezione di matematica è oltre la 129).
- Nel lancio da una quota l'origine resta ai piedi della verticale di lancio, come nella lezione 56, e la legge diventa
  $y = h + v_{0y} t - \tfrac{1}{2} g t^2$. Per i lanci alla stessa quota l'origine è nel punto di lancio.
- La velocità all'arrivo dell'esempio 5 è calcolata con le componenti e poi ritrovata con la conservazione
  dell'energia, con il link alla lezione del biennio.
- Il lancio verso il basso è detto in una riga ($v_{0y}$ negativa), senza esempio.
- La resistenza dell'aria è nominata in chiusura, senza numeri.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `lancio-obliquo-componenti-velocita`,
`lancio-obliquo-traiettoria-velocita` (1 cm = 5 m, $y = 0{,}7002x - 0{,}09128x^2$, vertice a $(3{,}836;\ 1{,}343)$,
velocità a $0{,}08$ cm per m/s), `gittata-angoli-complementari` (1 cm = 6 m, griglia ogni 5 m),
`punizione-barriera-porta` (1 cm = 3 m: barriera a 3,05 cm alta 0,633 cm, porta a 6,667 cm, traversa a 0,813 cm),
`lancio-obliquo-da-quota` (1 cm = 5 m: palazzo di 2,4 cm, arrivo a 6,514 cm).

Interattiva (registrata sotto il commento del gruppo 30):

- `lancio-obliquo-angolo-gittata` (`fisica/LancioObliquo.tsx`). Domanda: che cosa succede alla gittata se l'angolo passa
  da $30^\circ$ a $60^\circ$ con la stessa velocità? Cursori per l'angolo ($15^\circ$-$75^\circ$, ogni $5^\circ$) e per la
  velocità (7-14 m/s), bottone Lancia, le ultime quattro traiettorie restano disegnate; il volo è in tempo reale. Con il
  movimento ridotto la palla arriva subito.

## Esercizi

Generatore `fis-lancio-obliquo`, sei livelli (specifica in `specs/exercises/fis-lancio-obliquo.md`). Scena nuova
`lancio-obliquo` (`scenes/LancioObliquo.tsx`) a tutti i livelli. Senza esercizio restano l'equazione della traiettoria
(esempio 4), la velocità in un istante qualunque (esempio 1) e la velocità all'arrivo da una quota.

## Esercizio guidato

L'esempio 5 (il sasso dal balcone). Si fermerebbe tre volte: dopo il testo, "puoi usare la formula della gittata?
perché no?"; dopo le componenti, "quale equazione dà l'istante in cui il sasso tocca il suolo?"; dopo le due soluzioni,
"quale delle due scarti, e che cosa rappresenta?".

## Domande per Andrea

- La gittata si chiama $L$ qui e $x_G$ nella lezione 56 del biennio: lasciamo i due simboli, o uniformiamo il biennio?
- La dimostrazione dell'angolo di $45^\circ$ con il quadrato del binomio è al posto giusto, o meglio solo $\sin 2\alpha$
  massimo a $90^\circ$?
- Nel lancio da una quota do la formula risolta del tempo di volo. Meglio lasciare che lo studente risolva ogni volta
  l'equazione di secondo grado, senza formula?
- L'equazione della traiettoria è usata solo nell'esempio 4. Va bene, o serve un secondo esempio (per esempio trovare
  l'angolo per colpire un bersaglio, che però chiede la goniometria)?
- L'esempio della punizione usa dati verosimili ma trascura l'aria, che su un pallone conta: lo dico solo in chiusura.
  Basta?

## Da verificare

- Distanza della barriera $9{,}15$ m e altezza della traversa $2{,}44$ m: misure del regolamento del calcio, scritte a
  memoria. L'altezza della barriera ($1{,}9$ m) è una stima.
- "Con una quota di partenza l'angolo migliore è un po' meno di $45^\circ$": vero per $h > 0$, enunciato senza
  dimostrazione.

Prerequisiti proposti: fis-moto-proiettili, fis-composizione-moti, fis-seno-coseno, fis-caduta-libera
