# Note: Le forze apparenti: forza centrifuga e forza di Coriolis

Lezione nuova (lotto del terzo anno di fisica, gruppo 31, 6 ottobre 2026). Conti rifatti in Python: $60 \cdot 4{,}2 = 252$ N,
$60 \cdot 9{,}8 = 588$ N; $0{,}98$ N, $0{,}30$ N, $\tan^{-1}(3{,}0/9{,}8) = 17{,}02^\circ$; $0{,}35 \cdot 9{,}8 = 3{,}43$ m/s²;
$12 \cdot 7{,}8 = 93{,}6$ N, $12 \cdot 9{,}8 = 117{,}6$ N; $\omega = 2\pi/5{,}0 = 1{,}2566$ rad/s, $50 \cdot \omega^2 \cdot 4{,}0 = 315{,}8$ N;
$\sqrt{0{,}40 \cdot 9{,}8/0{,}12} = 5{,}715$ rad/s, $0{,}910$ giri/s, $54{,}6$ giri/min; $70 \cdot (7{,}27 \cdot 10^{-5})^2 \cdot 6{,}37 \cdot 10^6 = 2{,}357$
N su $686$ N; $3{,}0/2{,}0 = 1{,}5$ s, $0{,}40 \cdot 1{,}5 = 0{,}60$ rad $= 34{,}4^\circ$, $3{,}0 \cdot 0{,}60 = 1{,}8$ m. Gli avvisi di
`check.mts` sui titoli sono per i nomi propri (Terra, Coriolis).

## Confini

- La 72 mostra che nei sistemi accelerati i principi non valgono e fa i conti dal suolo; qui si ricava
  $\vec a = \vec a\,' + \vec A$ (dalla composizione delle velocità della 73 con $\vec V$ che cambia), si definisce
  $\vec F_{app} = -m\,\vec A$ e si rifanno gli stessi problemi da bordo. Il pendolo ha gli stessi numeri della 72, apposta.
- La 57 del biennio ha la forza centripeta, l'auto in curva e un avviso che rimanda qui per la centrifuga. La centrifuga
  è ricavata come $-m\,\vec A$ con $\vec A$ accelerazione centripeta del punto della piattaforma; la moneta sul giradischi
  è il conto dell'auto in curva visto da chi ruota, e lo dico.
- La bilancia in ascensore è nella 53: qui il pacco sul pavimento, risolto da dentro.
- Coriolis è qualitativa, come da brief: niente formula (la lezione dice che richiede il prodotto vettoriale), proprietà
  ricavate dall'esperimento della palla sulla piattaforma, con un conto fatto dal suolo (esempio 8), e gli effetti sulla
  Terra. La 71 (prodotto vettoriale) non è richiamata con un link perché la formula non si dà.
- L'assenza di peso in orbita è della 96; qui solo l'ascensore in caduta libera, in una riga.

## Scelte

- Le forze apparenti sono disegnate rosse e tratteggiate, e la lezione lo dichiara. Nel README il tratteggio è delle
  componenti: qui non ci sono componenti disegnate nelle stesse figure, ma è una convenzione nuova, da confermare.
- Simboli: $\vec F_{app}$, $\vec A$ (README), $F_{cf}$ per la centrifuga, perché nella 57 del biennio $F_c$ è la
  forza centripeta (il README non fissa il simbolo).
- "Forza apparente" è il nome principale; "fittizia" e "d'inerzia" sono citati una volta.
- La regola di Coriolis è data rispetto al verso del moto ("a destra del moto"), per non dipendere da chi guarda.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `forza-apparente-autobus-frena`, `pendolo-tre-forze-sistema-auto` (2 cm per
newton: $1{,}96$, $(0{,}60; 1{,}96)$ e $0{,}60$ cm, filo a $17^\circ$), `forza-centrifuga-velocita-angolare` (grafico
$F_{cf} = 200\,\omega^2$ con il punto $(1{,}257; 316)$, `% poi-interattivo`), `centrifuga-due-descrizioni` ($\vec T$ e
$\vec F_{cf}$ lunghe uguali), `coriolis-palla-piattaforma` ($0{,}6$ cm per metro; bambino spostato di $34{,}4^\circ$; curva
$r = 1{,}2\,t$ cm, angolo $-22{,}92^\circ\,t$), `ciclone-emisfero-nord` (schema qualitativo).

Interattiva `giostra-coriolis-palla` (`fisica/GiostraCoriolis.tsx`). Domanda: vista dalla piattaforma, da che parte curva
la palla, e che cosa cambia se la piattaforma gira nell'altro verso? Parte dai numeri dell'esempio 8 ($3{,}0$ m,
$2{,}0$ m/s, $0{,}40$ rad/s); il cursore va da $-0{,}8$ a $0{,}8$ rad/s, il selettore sceglie suolo o piattaforma.
L'animazione va a $0{,}6$ volte il tempo vero. Per la centrifuga non c'è una figura interattiva: il grafico statico
$F_{cf}(\omega)$ ha la riga `% poi-interattivo`.

## Esercizio guidato

L'esempio 6 (la moneta sul giradischi). Tre fermate: (1) "nel sistema del piatto, quali forze orizzontali agiscono sulla
moneta e che verso hanno?"; (2) "quanto vale al massimo l'attrito statico?"; (3) "che cosa succede alla massa quando
scrivi la condizione?", prima di ricavare $\omega$.

## Esercizi

Generatore `fis-forze-apparenti`, sette livelli (specifica in `specs/exercises/fis-forze-apparenti.md`): la forza apparente, la valigia che scivola, il pacco in ascensore, la forza centrifuga, la centrifuga dal periodo o dai giri al minuto, la moneta sul piatto, il verso della deviazione di Coriolis (a parole). Nessuna scena. Gli esempi 2 (pendolo: è nel generatore della 72), 7 e 8 non hanno un livello. Controlli: tre seed da 1000 campioni per livello con `verify.py` (PASS), errori piantati bocciati, `review.mts` e `width.mts` a 0.

## Da verificare

- Coriolis: Gaspard-Gustave de Coriolis, memoria del 1835 (a memoria).
- Pendolo di Foucault: 1851, Panthéon di Parigi, filo di $67$ m; rotazione del piano di circa $11^\circ$ all'ora a
  Parigi ($360^\circ \cdot \sin 48{,}85^\circ / 24 = 11{,}3^\circ$); verso orario nell'emisfero nord.
- Alisei: da nord-est nell'emisfero nord, da sud-est nel sud; l'aria al suolo va dalle fasce intorno ai $30^\circ$ verso
  l'equatore.
- Correnti oceaniche: circuiti orari a nord, antiorari a sud.
- Il lavandino: "migliaia di volte più piccola" è un ordine di grandezza a memoria.
- $\omega$ della Terra $7{,}27 \cdot 10^{-5}$ rad/s (dal conto della 72, giorno di $24$ h), $R_T$ dal README.
- $33$ giri al minuto del giradischi; $\mu_s = 0{,}35$ e $0{,}40$ inventati.
- Schiacciamento della Terra ai poli e $g$ minore all'equatore: detti come fatti, senza numeri.

## Domande per Andrea

- $F_{cf}$ per la forza centrifuga, per non confonderla con $F_c$ della centripeta (lezione 57): va bene il simbolo?
- Le forze apparenti tratteggiate nei disegni: va bene come convenzione per tutto il capitolo?
- Coriolis senza formula: basta, o vuoi almeno $F = 2\,m\,\omega\,v'$ per un moto nel piano di rotazione, in un riquadro?
- L'esempio 7 (centrifuga della Terra) dice che la bilancia segna lo $0{,}3\%$ in meno all'equatore per la rotazione:
  il valore misurato di $g$ cambia anche per lo schiacciamento. Lo precisiamo o è troppo?
- La deviazione verso est dei gravi in caduta (Guglielmini, Bologna, 1791) non è nella lezione: la vuoi tra gli effetti?

Prerequisiti proposti: fis-sistemi-non-inerziali, fis-forza-centripeta, leggi-newton, fis-accelerazione-centripeta
