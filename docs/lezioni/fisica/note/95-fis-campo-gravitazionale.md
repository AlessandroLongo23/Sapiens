# Note: Il campo gravitazionale

Lezione nuova (lotto del terzo anno, gruppo 37, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella
lezione ($G = 6{,}67 \cdot 10^{-11}$, $M_T = 5{,}97 \cdot 10^{24}$ kg, $R_T = 6{,}37 \cdot 10^6$ m):

- esempio 1: $520 / 250 = 2{,}08$ N/kg; $80 \cdot 2{,}08 = 166{,}4$ N;
- superficie della Terra $9{,}813$ N/kg; Luna $G M_L / R_L^2 = 1{,}619$ N/kg;
- esempio 2: $(3{,}84 \cdot 10^8)^2 = 1{,}4746 \cdot 10^{17}$, $g = 2{,}700 \cdot 10^{-3}$ N/kg; rapporto con il suolo
  $3634$, $r / R_T = 60{,}28$;
- Everest: $(6370 / 6378{,}85)^2 = 0{,}9972$;
- esempio 3: $r = 6{,}77 \cdot 10^6$ m, $g = 8{,}688$ N/kg ($88{,}5\%$ di $9{,}813$), peso $608{,}2$ N contro $686{,}9$ N;
  con $h$ al posto di $r$: $2{,}489 \cdot 10^3$ N/kg;
- grafico: $9{,}8 / 4 = 2{,}45$, $9{,}8 / 9 = 1{,}089$, $9{,}8 / 16 = 0{,}6125$;
- esempio 4: $\sqrt 2 \cdot 6{,}37 \cdot 10^6 = 9{,}0085 \cdot 10^6$ m, quota $2{,}6385 \cdot 10^6$ m;
- esempio 5: $M_T / M_L = 81{,}22$, radice $9{,}012$, $x = 3{,}456 \cdot 10^8$ m; in quel punto i due campi valgono
  $3{,}33 \cdot 10^{-3}$ N/kg.

`check.mts` passa (lezione, formulario, flashcard).

## Scelte

- Confine con la 94 (gruppo 36): il valore di $g$ al suolo dalla legge di gravitazione sta nella 94; qui lo richiamo in
  una riga con il link e parto dalla definizione di campo. La bilancia di Cavendish e la massa inerziale e
  gravitazionale non compaiono.
- Confine con la 96 e la 97: l'assenza apparente di peso è solo annunciata nell'esempio 3, con il link alla 96;
  l'energia non compare.
- Il campo è disegnato in verde, il colore delle accelerazioni nella tabella del README, perché $\vec g$ è
  un'accelerazione; le forze restano rosse.
- Simboli: $\vec g$ e $g$ per il campo, $g_0$ per il valore al suolo della Terra (solo nel confronto con la quota),
  $r$ per la distanza dal centro, $h$ per la quota, $R$ per il raggio di un pianeta qualsiasi, $M_L$ e $R_L$ per la
  Luna, $d$ e $x$ nel problema Terra-Luna.
- Il campo dentro e fuori una sfera è solo enunciato, come chiede il brief: teorema dei gusci a parole, formula
  lineare per la sfera omogenea, nota sulla Terra vera.
- La tabella finale "campo e forza" è un confronto vero e resta; non c'è un riepilogo.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `campo-gravitazionale-vettori-pianeta` (frecce a 1,6, 2,4 e 3,2 cm lunghe
1,0, 0,444 e 0,25 cm: in scala con $1/r^2$), `linee-campo-gravitazionale-radiale`, `quota-e-distanza-dal-centro`,
`grafico-campo-terra-distanza` (1 cm per raggio terrestre, 0,4 cm per N/kg; riga `% poi-interattivo`),
`terra-luna-campo-nullo` (1 cm = $0{,}5 \cdot 10^8$ m: $P$ a 6,92 cm, Luna a 7,68 cm; i raggi dei due corpi non sono in
scala), `campo-dentro-fuori-sfera-omogenea`.

Interattiva `campo-gravitazionale-sonda` (`fisica/CampoGravitazionaleSonda.tsx`): una sonda da trascinare intorno alla
Terra, dal suolo a quattro raggi terrestri; la distanza scatta a ventesimi di raggio. Risponde a: "a che distanza il
campo è un quarto di quello al suolo, e a che distanza la metà?" Il testo dopo la figura dà la prima risposta e
l'esempio 4 la seconda. La freccia è in scala (0,11 cm per N/kg), quindi oltre i tre raggi è molto corta: è quello che
la figura deve mostrare, ma da telefono si vede poco.

## Da verificare

- Massa e raggio della Luna: $7{,}35 \cdot 10^{22}$ kg e $1{,}74 \cdot 10^6$ m (valori correnti dei libri).
- Distanza Terra-Luna $3{,}84 \cdot 10^8$ m (la stessa delle lezioni 48 e 57).
- Quota dell'Everest $8{,}85$ km; quota della Stazione Spaziale $400$ km (varia tra 370 e 460 km).
- "Lo ha dimostrato Newton per i corpi a simmetria sferica": è il teorema dei gusci dei Principia; scritto a memoria.
- La nota sulla Terra non omogenea: "il campo resta vicino a $10$ N/kg per quasi metà del raggio". Nel modello PREM il
  campo resta tra $9{,}8$ e $10{,}7$ N/kg fino al confine tra mantello e nucleo, a circa $0{,}55\,R_T$ dal centro:
  scritto a memoria, da controllare.

## Domande per Andrea

- Il campo si disegna in verde come le accelerazioni, o serve un colore suo (che poi varrebbe anche per il campo
  elettrico del quarto anno)?
- $g_0$ per il valore al suolo va bene, o l'Amaldi usa un altro simbolo?
- L'esempio 5 (il punto tra Terra e Luna in cui il campo si annulla) è al livello del terzo anno o va in fondo come
  approfondimento?
- La sezione "Dentro e fuori una sfera" basta così, o i libri in adozione fanno anche un esempio numerico dentro la
  Terra (il tunnel)?

## Esercizio guidato

L'esempio 3 (il campo alla quota della Stazione Spaziale) renderebbe di più come esercizio guidato. Si fermerebbe in
tre punti: "quale distanza va nella formula?" (scelta tra $h$, $R_T$ e $R_T + h$); "quanto fa $R_T + h$ con le due
potenze di dieci diverse?"; "il risultato è plausibile rispetto a $9{,}8$ N/kg?" (prima di calcolare il peso).

## Esercizi

Generatore `fis-campo-gravitazionale`, cinque livelli (specifica in `specs/exercises/fis-campo-gravitazionale.md`): Il
campo dalla forza su una massa, Il campo alla superficie di un pianeta, Il campo a una certa quota, Ragionare con i
rapporti, Il campo di due corpi. Scena nuova `orbita-pianeta` (`scenes/OrbitaPianeta.tsx`) al livello 3. L'esempio 4 (a
che quota il campo si dimezza) e l'esempio 5 nella forma "dove si annulla" non hanno un livello.

Prerequisiti proposti: fis-gravitazione-universale, fis-forza-peso, fis-operazioni-vettori, fis-proporzionalita-inversa
