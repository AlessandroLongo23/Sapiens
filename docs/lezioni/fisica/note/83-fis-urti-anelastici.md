# Note: Gli urti anelastici

Lezione nuova (lotto del terzo anno, gruppo 33, 6 ottobre 2026). `check.mts` passa senza avvisi. Conti rifatti in Python:

- esempio 1: $3{,}0 \cdot 10^4 / 4{,}0 \cdot 10^4 = 0{,}75$ m/s;
- esempio 2: $(480 - 360)/200 = 0{,}60$ m/s; senza il segno $840/200 = 4{,}2$ m/s;
- esempio 3: $K_i = 3{,}0 \cdot 10^4$ J, $K_f = 1{,}125 \cdot 10^4$ J, $E_d = 1{,}875 \cdot 10^4$ J, frazione $0{,}625$;
  placcaggio: $1440 + 540 = 1980$ J prima, $36$ J dopo;
- esempio 4: $V_2 = 0{,}50 \cdot 5{,}0 / 1{,}5 = 1{,}667$ m/s, $K_f = 0{,}25 + 2{,}083 = 2{,}333$ J, $E_d = 1{,}667$ J;
- esempio 5: $V = \sqrt{2 \cdot 9{,}8 \cdot 0{,}12} = 1{,}5336$ m/s, $v = 201 \cdot 1{,}5336 = 308{,}26$ m/s, $K_i = 475$ J,
  $K_f = 2{,}36$ J; con l'energia attraverso l'urto $21{,}7$ m/s;
- esempio 6: $p_x = 1{,}8 \cdot 10^4$, $p_y = 2{,}4 \cdot 10^4$, $p = 3{,}0 \cdot 10^4$ kg·m/s, $V = 10{,}71$ m/s,
  $\tan^{-1}(2{,}4/1{,}8) = 53{,}13^\circ$.

## Struttura ed esempi

Che cos'è un urto e perché la quantità di moto si conserva (rimando alla 82); tabella dei tre tipi di urto; l'urto
completamente anelastico con $V = (m_1 v_1 + m_2 v_2)/(m_1 + m_2)$ (esempio 1 dei vagoni, esempio 2 del placcaggio, due
avvisi: segni, media delle velocità); l'energia dissipata $E_d$ (esempio 3 con le barre, avviso sulle energie che si
sommano), la frazione $m_2/(m_1 + m_2)$ con il bersaglio fermo, ricavata, e l'interattiva; gli urti anelastici in cui
i corpi si separano (esempio 4); il pendolo balistico (figura, due fasi, formula, esempio 5, avviso); gli urti
completamente anelastici nel piano (esempio 6 con la figura dei vettori, avviso).

## Scelte

- Confini. Questa lezione classifica i tre tipi di urto in una tabella, perché è la prima sugli urti; la 84 la
  richiama. Il pendolo balistico sta qui (elenco dei confini del brief). Il coefficiente di restituzione non c'è: non
  è nei confini, e gli urti anelastici non completi si trattano con una velocità finale data (esempio 4).
- Simboli. $v_1$, $v_2$ prima; $V$ la velocità comune; $V_1$, $V_2$ quando i corpi si separano; $E_d = K_i - K_f$ per
  l'energia dissipata (simbolo mio: il README non ne fissa uno; la lezione 64 del biennio scrive "energia dissipata" in
  parole). Nel pendolo balistico $m$ è il proiettile e $M$ il blocco.
- La frase "tra tutti gli urti con le stesse masse e velocità iniziali, quello completamente anelastico è quello in
  cui si perde più energia cinetica" è enunciata senza dimostrazione (si vede bene solo nel sistema del centro di
  massa, che la lezione 85 nomina soltanto).
- Masse dei vagoni e dei veicoli in notazione scientifica ($1{,}5 \cdot 10^4$ kg), per non scrivere $15\,000$ kg con
  gli zeri ambigui.
- Nell'esempio 5 la massa totale $2{,}01$ kg tiene una cifra in più dei dati, come passaggio intermedio.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `vagoni-prima-dopo` (1 cm per m/s: 2,0 e 0,75 cm), `placcaggio-prima`
(0,4 cm per m/s: 2,4 e 1,2 cm; il "dopo" non è disegnato, perché a quella scala la freccia sarebbe di 0,24 cm),
`energia-urto-barre` (6 cm per 30 kJ: la divisione a 2,25 cm), `pendolo-balistico` (fili di 2,5 cm a $40^\circ$:
estremi a 3,607 e 4,407; 1,485), `urto-incrocio-quantita-moto` (1 cm per $10^4$ kg·m/s: 1,8, 2,4 e 3,0 cm, arco a
$53{,}13^\circ$).

Interattiva `urto-anelastico-energia` (`fisica/UrtoAnelasticoEnergia.tsx`). Domanda: che frazione dell'energia
cinetica resta dopo un urto completamente anelastico, e da che cosa dipende? Un carrello ne urta uno fermo e ci resta
attaccato; cursori per le due masse (da 0,5 a 4 kg) e per la velocità (da 1 a 4 m/s). Accanto, le barre di
`fisica/energia.tsx` (gruppo 18): energia cinetica ed energia dissipata, disegnate come frazioni di $K_i$ (la linea
tratteggiata è sempre alla stessa altezza). Il testo dopo la figura dà la risposta ($m_2/(m_1 + m_2)$, metà con masse
uguali). Guardata in chiaro, in scuro e da telefono, ferma e dopo l'urto, ai valori iniziali.

## Esercizio guidato

L'esempio 5 (il pendolo balistico). Si fermerebbe in tre punti: (1) "Quale legge vale mentre il proiettile si
conficca?" (la quantità di moto, non l'energia); (2) "Con che velocità parte il blocco subito dopo l'urto?"
($\sqrt{2gh} = 1{,}53$ m/s, dalla salita); (3) "Qual è la massa che sale?" ($2{,}01$ kg, blocco più proiettile).

## Esercizi

Generatore `fis-urti-anelastici`, sei livelli (specifica in `specs/exercises/fis-urti-anelastici.md`): I due corpi
restano attaccati, Urto frontale con i corpi attaccati, L'energia dissipata, I corpi si separano dopo l'urto, Il
pendolo balistico, Urto ad angolo retto. Scena `vettori-piano` al livello 6. Senza esercizio: la direzione dopo
l'urto nel piano (l'angolo dell'esempio 6) e l'energia dissipata in un urto frontale.

## Da verificare

- Masse dei vagoni ($1{,}5 \cdot 10^4$ e $2{,}5 \cdot 10^4$ kg) e velocità di aggancio ($2{,}0$ m/s): plausibili, a memoria.
- Giocatori di rugby di $80$ e $120$ kg a $6{,}0$ e $3{,}0$ m/s: plausibili, a memoria.
- Pendolo balistico: proiettile di $10$ g, blocco di $2{,}0$ kg, salita di $12$ cm, velocità $3{,}1 \cdot 10^2$ m/s.
- Auto di $1{,}2 \cdot 10^3$ kg e furgone di $1{,}6 \cdot 10^3$ kg a $15$ m/s ($54$ km/h).

## Domande per Andrea

- Il simbolo $E_d$ per l'energia dissipata va bene, o preferisci $\Delta K$ negativa, o $E_{diss}$?
- Vuoi il coefficiente di restituzione, anche solo in un riquadro? L'ho lasciato fuori.
- Il pendolo balistico è appeso "a due fili", così il blocco trasla e non ruota: lo dico solo nella figura. Serve
  una riga nel testo?
- L'esempio 6 ha le masse in notazione scientifica. Preferisci le tonnellate, o veicoli più leggeri?
- La frazione $m_2/(m_1 + m_2)$ è ricavata nel testo: è nel programma del terzo anno o è un di più?

Prerequisiti proposti: fis-conservazione-quantita-moto, fis-energia-cinetica, energia, fis-seno-coseno
