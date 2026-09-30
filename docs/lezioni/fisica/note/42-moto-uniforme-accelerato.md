# Note: Il moto uniformemente accelerato

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 13, 30 settembre 2026). Conti rifatti in Python: $54/3{,}6 = 15$ m/s, $15/6{,}0 = 2{,}5$ m/s², $2{,}5 \cdot 4{,}0 = 10$ m/s; posizioni dello scooter $1{,}25 \cdot t^2$ = $0$; $1{,}25$; $5$; $11{,}25$ m e spazi per secondo $1{,}25$, $3{,}75$, $6{,}25$ m; treno $12 + 0{,}50 \cdot 20 = 22$ m/s, $240 + 100 = 340$ m, $(12 + 22)/2 \cdot 20 = 340$ m; biglia $\sqrt{2 \cdot 1{,}6/0{,}80} = 2{,}0$ s, $0{,}80 \cdot 2{,}0 = 1{,}6$ m/s; aereo $75^2/5{,}0 = 1125$ m, $75/2{,}5 = 30$ s; radice $\sqrt{9 + 16} = 5$; frenata $72/3{,}6 = 20$ m/s, $20/5{,}0 = 4{,}0$ s, $400/10 = 40$ m, $80 - 40 = 40$ m, con il segno sbagliato $80 + 40 = 120$ m e $40$ m/s; arresto $10 + 10 = 20$ m e $20 + 40 = 60$ m. `check.mts` passa.

## Struttura ed esempi

Accelerazione costante (definizione, asse e segni, figura dello scooter con gli spazi $1:3:5$ e la regola di Galileo); la legge della velocità ($v = v_0 + a\,t$, formule inverse, rimando al grafico velocità-tempo), esempio 1 (scooter, con la conversione), avviso sui km/h; la legge oraria ricavata con la velocità media $(v_0 + v)/2$ e il trapezio (figura), esempio 2 (treno), avviso sul mezzo e il quadrato; partenza da fermo ($v = a\,t$, $s = \tfrac{1}{2}a\,t^2$, proporzionalità quadratica, figura della parabola, $t = \sqrt{2s/a}$), esempio 3 (biglia); la relazione senza il tempo ricavata dalla velocità media, esempio 4 (pista di decollo), avviso sulla radice di una somma; la frenata ($t_f$ e $d_f$, velocità doppia spazio quadruplo), esempio 5, avviso sul segno, nota su accelerazione negativa che non vuol dire rallentare; lo spazio di arresto (tempo di reazione, figura v-t con rettangolo e triangolo), esempio 6 (a velocità doppia lo spazio di arresto triplica), avviso; la figura interattiva.

## Scelte

- La definizione di accelerazione e la velocità media si prendono dalle lezioni 40 e 41 del gruppo 12 (link, senza rispiegarle). La legge oraria si ricava con la velocità media, senza aree: le aree sono della lezione 43, che qui si anticipa solo con la figura del trapezio.
- In frenata l'accelerazione si scrive negativa con l'asse nel verso del moto, e le formule di tempo e spazio di frenata usano $|a|$. Si dice che le leggi valgono fino all'arresto (i freni non spingono indietro).
- Il tempo di reazione "di circa un secondo" è segnato da verificare: i valori citati di solito vanno da $0{,}5$ a $1{,}5\,\text{s}$ (codice della strada e manuali di scuola guida, fonte da trovare).
- Il decollo: $75\,\text{m/s}$ e $2{,}5\,\text{m/s}^2$ sono numeri plausibili ma non presi da un aereo preciso.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `scooter-posizioni-ogni-secondo` (scala $0{,}45$ cm/m, posizioni $0$; $0{,}5625$; $2{,}25$; $5{,}0625$ cm, frecce della velocità $0{,}1$ cm per m/s), `velocita-media-trapezio` (1 cm = 4 s e 5 m/s, retta da $(0; 2{,}4)$ a $(5; 4{,}4)$, media a $3{,}4$), `grafico-spazio-tempo-scooter` (1 cm = 1 s e 10 m, $0{,}125\,t^2$), `spazio-arresto-grafico` (1 cm = 1 s e 5 m/s). Interattiva `auto-accelerata-grafici` (`fisica/AutoAccelerataGrafici.tsx`): cursori $v_0$ da $0$ a $20$ m/s e $a$ da $-5$ a $+3$ m/s², 8 s di moto, grafici v-t (con l'area) e s-t tracciati istante per istante, scale arrotondate al valore massimo raggiunto; in frenata l'auto si ferma a $v_0/|a|$.

## Esercizi

Generatore `moto-uniforme-accelerato`, sei livelli (specifica in `specs/exercises/moto-uniforme-accelerato.md`), senza scena.

## Domande per Andrea

- La legge oraria si ricava con la velocità media (media di $v_0$ e $v$) e il trapezio: è come fa l'Amaldi, o il libro la dà con l'area del grafico velocità-tempo?
- In frenata: accelerazione negativa con l'asse nel verso del moto e formule con $|a|$, oppure "decelerazione" positiva come in molti testi di scuola guida?
- La relazione senza il tempo $v^2 = v_0^2 + 2a\,\Delta s$ è nel programma del secondo anno, o si ricava ogni volta?
- Il tempo di reazione di circa un secondo: che valore usa il libro? Serve una fonte (codice della strada o manuale).
- Lo spazio di arresto con il tempo di reazione sta bene qui, o è materia di un approfondimento?
