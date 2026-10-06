# Note: L'energia cinetica di rotazione e il rotolamento

Lezione nuova (lotto del terzo anno, gruppo 35, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella
lezione:

- mola: $I = \tfrac12 \cdot 2{,}0 \cdot 0{,}10^2 = 0{,}010$, $\omega = 2\pi \cdot 15 = 94{,}25$ rad/s, $K = 44{,}41$ J; con
  $\omega = 15$ verrebbe $1{,}125$ J; frenata con $0{,}50$ N·m: $88{,}8$ rad, $14{,}1$ giri; sasso di 1 kg da 4,5 m: $44{,}1$ J;
- bowling: $\tfrac12 \cdot 7{,}2 \cdot 16 = 57{,}6$ J, $\tfrac25$ di $57{,}6 = 23{,}04$ J, totale $80{,}64$ J;
- cilindro da $0{,}80$ m: $\sqrt{15{,}68/1{,}5} = 3{,}233$ m/s, scivolando $3{,}960$ m/s;
- gara su $2{,}0$ m a $30^\circ$: sfera $a = 3{,}5$ m/s², $t = 1{,}069$ s; anello $a = 2{,}45$ m/s², $t = 1{,}278$ s; blocco
  $a = 4{,}9$ m/s², $t = 0{,}904$ s;
- sfera che risale a $3{,}0$ m/s: $1{,}4 \cdot 9 / 19{,}6 = 0{,}643$ m; blocco $0{,}459$ m;
- tabelle: energia totale $(1 + c)/2 \cdot m v^2$ e parte di rotazione $c/(1 + c)$ per $c = 1, \tfrac23, \tfrac12, \tfrac25$;
  accelerazioni $1/(1 + c)$ e velocità $\sqrt{2gh/(1 + c)}$.

`check.mts`: 0 errori, 0 avvisi.

## Confini e scelte

- La lezione usa il momento d'inerzia e la tabella dei corpi estesi della lezione 87 (gruppo 34) senza ricavarli: riporta
  solo le quattro righe che servono (anello, cilindro pieno, sfera piena, sfera cava), con il link.
- $K_{rot} = \tfrac12 I \omega^2$ è ricavata sommando le energie dei pezzetti, come fanno i libri del terzo anno. La formula
  $K = \tfrac12 m v_{cm}^2 + \tfrac12 I \omega^2$ del corpo che rotola è enunciata, e lo dice.
- Il lavoro di un momento, $W = M\theta$, e $W = \Delta K_{rot}$ stanno in una sottosezione breve, senza esempio in
  riquadro: nessun'altra lezione del capitolo li ha, e servono per chiudere l'analogia con la traslazione. Se la 88
  del gruppo 34 li ha già, qui basta un rimando.
- Il numero $c$ di $I = c\,m r^2$ è un simbolo mio, non del README: permette di scrivere una volta sola
  $K = (1 + c)\tfrac12 m v_{cm}^2$, $v_{cm} = \sqrt{2gh/(1 + c)}$ e $a = g\sin\beta/(1 + c)$. Da confermare.
- L'angolo del piano è $\beta$, perché nelle lezioni 86-91 $\alpha$ è l'accelerazione angolare (README); la lezione 54 del
  biennio usava $\alpha$, e la lezione lo dice.
- L'accelerazione lungo il piano è ricavata dall'energia ($v^2 = 2 a l$), non dalle forze con $M = I\alpha$: quella strada
  appartiene alla 88. La forza di attrito statico non viene calcolata.
- Niente yo-yo e niente carrucola con massa (quest'ultima è della 88).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `disco-rotazione-velocita-punti` ($v = 0{,}7\,r$: frecce di 0,63 e 1,26 cm
per i raggi di 0,9 e 1,8 cm), `rotolamento-arco-uguale-spostamento` (mezzo giro di una ruota di raggio 0,6 cm:
$s = 0{,}6\pi = 1{,}885$ cm), `rotolamento-velocita-punti-ruota` (frecce di 1,3 e 2,6 cm), `cilindro-rotola-piano-inclinato`
(piano a $30^\circ$), `gara-rotolamento-sfera-cilindro-anello` (piano a $20^\circ$ lungo 7 cm; partiti a 6,8 cm dal fondo,
quando la sfera ha percorso 6,1 cm il cilindro ne ha percorsi 5,69 e l'anello 4,27, in proporzione a $1/(1 + c)$).

Interattiva (registrata sotto il commento del gruppo 35 in `src/lib/utils/interactive.ts`):

- `rotolamento-gara-piano-inclinato` (`fisica/GaraRotolamento.tsx`). Domanda: chi arriva prima in fondo tra blocco senza
  attrito, sfera, cilindro e anello, e l'ordine cambia con l'inclinazione? Piano di 2,0 m, angolo da $10^\circ$ a
  $40^\circ$, valore iniziale $30^\circ$ (i numeri dell'esempio 4). Il moto ha la sua formula, $s = \tfrac12 a t^2$; la gara
  va a metà velocità e la didascalia lo dice; i raggi disegnati sui corpi girano di $s/r$.

## Esercizio guidato

L'esempio 3 (il cilindro in discesa) renderebbe di più come esercizio guidato. Si fermerebbe in tre punti: quali forze
compiono lavoro (per arrivare a dire che l'energia meccanica si conserva); come si scrive l'energia cinetica in fondo
(la domanda che scopre chi dimentica la rotazione); quanto vale $1 + c$ per il cilindro.

## Esercizi

Generatore `fis-energia-rotazionale`, sei livelli (specifica in `specs/exercises/fis-energia-rotazionale.md`): L'energia di
un corpo che ruota, L'energia di rotazione dalla forma del corpo, L'energia di un corpo che rotola, La velocità in fondo
alla discesa, L'accelerazione lungo il piano inclinato, L'altezza raggiunta in salita. Scena nuova `rotolamento-piano`
(`scenes/RotolamentoPiano.tsx`) ai livelli 4 e 5. Restano senza esercizio i giri al secondo da convertire (esempio 1), il
lavoro di un momento e i tempi della gara (esempio 4).

## Domande per Andrea

- Il numero $c$ di $I = c\,m r^2$ va bene come simbolo, o i libri in adozione scrivono ogni volta la formula del corpo?
- Il lavoro di un momento ($W = M\theta$) sta meglio qui o nella lezione 88 sulla dinamica delle rotazioni?
- L'accelerazione $a = g\sin\beta/(1 + c)$ ricavata dall'energia basta, o al terzo anno si chiede anche la strada con
  le forze e l'attrito statico?
- La sfera cava nella gara: la teniamo, o bastano anello, cilindro e sfera come nell'Amaldi (da verificare)?

## Da verificare

- La tabella dei momenti d'inerzia deve coincidere con quella della lezione 87 (stessi nomi dei corpi: "anello sottile",
  "cilindro pieno", "sfera piena", "sfera cava sottile").
- Massa di una palla da bowling: $7{,}2$ kg (il massimo regolamentare è circa $7{,}26$ kg, a memoria).

Prerequisiti proposti: fis-momento-inerzia, fis-cinematica-rotazionale, energia, fis-piano-inclinato
