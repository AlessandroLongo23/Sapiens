# Note: Il principio di relatività galileiana

Lezione nuova (lotto del terzo anno di fisica, gruppo 31, 6 ottobre 2026). Conti rifatti in Python: $(26 - 20)/4{,}0 = 1{,}5$
m/s², $(11 - 5)/4{,}0 = 1{,}5$ m/s², $1200 \cdot 1{,}5 = 1800$ N; $\sqrt{2 \cdot 19{,}6/9{,}8} = 2{,}0$ s, $9{,}8 \cdot 2{,}0 = 19{,}6$
m/s, $8{,}0 \cdot 2{,}0 = 16$ m, $\sqrt{8{,}0^2 + 19{,}6^2} = 21{,}17$ m/s; $0{,}80/0{,}20 = 4{,}0$ m/s², $0{,}50$ m, $0{,}40$ J;
$0{,}50 + 30 \cdot 0{,}50 = 15{,}5$ m, $0{,}80 \cdot 15{,}5 = 12{,}4$ J, $0{,}10 \cdot (32^2 - 30^2) = 12{,}4$ J;
$2\pi \cdot 1{,}50 \cdot 10^{11}/(3{,}15 \cdot 10^7) = 2{,}99 \cdot 10^4$ m/s. `check.mts` dà un avviso sul titolo "La nave di
Galileo": la maiuscola è del nome proprio.

## Confini

- La 73 ha posizioni e velocità; qui si parte da $\vec v = \vec v\,' + \vec V$ e si ricava $\vec a = \vec a\,'$, poi
  l'invarianza di forza e massa, i tre principi, l'enunciato e le sue due conseguenze.
- Il sasso dall'albero usa la 56 del biennio (proiettile lanciato in orizzontale) per il conto dalla riva, con il link.
- La 72 ha il conto delle accelerazioni della Terra; qui c'è solo la velocità orbitale, per dire che il laboratorio è
  la stanza sotto coperta.
- L'esempio 3 mette energia cinetica e lavoro tra le grandezze relative e mostra che $W = \Delta K$ vale in tutti e due i
  sistemi. La quantità di moto, che sarebbe l'esempio naturale, ha la sua lezione più avanti (80) e non è nominata.
- Il limite del principio (luce, Einstein 1905) è in un paragrafo finale senza link: le lezioni di relatività del quinto
  anno sono vuote.

## Scelte

- Il passo del "Dialogo" è parafrasato, non citato: a memoria non mi fido della lettera. Se Andrea vuole la citazione
  ("Rinserratevi con qualche amico nella maggiore stanza che sia sotto coverta di alcun gran navilio...") va controllata
  sul testo.
- "Invariante" e "relativa" sono i due termini della lezione; la tabella li mette a confronto.
- La velocità di arrivo del sasso vista dalla nave è lasciata a $19{,}6$ m/s, con tre cifre, perché con due sarebbe
  $20$ m/s, con lo zero ambiguo.

## Figure

Due TikZ, guardate in chiaro e in scuro: `velocita-tempo-due-sistemi` (grafico con `% poi-interattivo`: punti $(0; 20)$,
$(4; 26)$, $(0; 5)$, $(4; 11)$) e `sasso-albero-nave-due-osservatori` ($0{,}2$ cm per metro: albero $3{,}92$ cm, nave
avanti di $3{,}2$ cm, parabola $x = 1{,}6\,t$, $y = -0{,}98\,t^2$ in centimetri). L'esempio 3 non ha figura: i due
spostamenti stanno nel rapporto di 1 a 31 e in scala non si disegnano insieme.

Interattiva `nave-galileo-sasso` (`fisica/NaveGalileo.tsx`). Domanda: se la nave va più veloce, il sasso cade più
indietro? Cursore per la velocità della nave (da 0 a 8 m/s, parte da 8 come nell'esempio 2), selettore del punto di
vista, bottone che lascia cadere il sasso; boe ogni 5 m per vedere il moto.

## Esercizio guidato

L'esempio 2 (il sasso dall'albero). Tre fermate: (1) "nel sistema della nave, quali forze agiscono sul sasso e con quale
velocità parte?"; (2) "nel sistema della riva, con quale velocità parte il sasso?" (quella della nave, in orizzontale);
(3) "di quanto è avanzato l'albero mentre il sasso cadeva?", prima di confrontare con i $16$ m del sasso.

## Esercizi

Generatore `fis-principio-relativita-galileo`, sei livelli (specifica in `specs/exercises/fis-principio-relativita-galileo.md`): la stessa accelerazione, la stessa forza, lo stesso esperimento sul treno, invariante o relativa (a parole), il sasso dall'albero visto dalla riva, l'energia cinetica vista da terra. Nessuna scena. L'esempio 4 (la velocità della Terra) non ha un livello. Controlli: tre seed da 1000 campioni per livello con `verify.py` (PASS), errori piantati bocciati, `review.mts` e `width.mts` a 0.

## Da verificare

- "Dialogo sopra i due massimi sistemi del mondo", 1632; l'esperimento della nave è nella Giornata seconda ed è proposto
  da Salviati (a memoria); il contenuto della stanza (mosche, farfalle, pesci, secchio che gocciola).
- L'obiezione della torre contro il moto della Terra: attribuita in generale agli aristotelici, senza un nome.
- Einstein, 1905, relatività ristretta.
- Anno di $3{,}15 \cdot 10^7$ s ($365$ giorni); distanza Terra-Sole dal README.

## Domande per Andrea

- La dimostrazione di $\vec a = \vec a\,'$ è fatta con le differenze di velocità, senza componenti. Va bene così?
- "Le forze non cambiano" è motivato con esempi (molla, peso, attrito, dinamometro), non dimostrato. È il livello
  giusto, o preferisci dirlo come ipotesi?
- L'esempio 3 su lavoro ed energia cinetica nei due sistemi: lo tieni al terzo anno, o è troppo per questa lezione?
- Il paragrafo finale su Einstein: va bene qui, o lo sposti tutto al quinto anno?

Prerequisiti proposti: fis-trasformazioni-galileo, fis-sistemi-non-inerziali, leggi-newton, fis-moto-proiettili
