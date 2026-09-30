# Note: Il moto rettilineo uniforme e il grafico spazio-tempo

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 12, 30 settembre 2026). Conti rifatti in Python:
$150 + 6{,}0 \cdot 25 = 300$ m, $(450 - 150)/6{,}0 = 50$ s, $450/6{,}0 = 75$ s (esempio 1 e avviso);
$80 - 1{,}6 \cdot 20 = 48$ m, $80/1{,}6 = 50$ s (esempio 2); $(90 - 30)/8 = 7{,}5$ m/s (esempio 3);
$6{,}0 \cdot 5{,}0 = 30$ m e $-4{,}0 \cdot 5{,}0 = -20$ m (area); $420/14 = 30$ s, $8{,}0 \cdot 30 = 240$ m,
$420 - 6{,}0 \cdot 30 = 240$ m (esempio 4); $200/8 = 25$ s, $30 \cdot 25 = 750$ m, $200 + 22 \cdot 25 = 750$ m,
$200/52 = 3{,}85$ s (esempio 5 e avviso). Scale delle figure: rette $A$ (da $20$ a $120$ m), $B$ (da $100$ a $20$ m) e
$C$ ($60$ m) con $0{,}6$ cm per secondo e $0{,}035$ cm per metro; incontro nel punto $(4{,}5; 2{,}4)$ cm con $0{,}15$ cm
per secondo e $0{,}01$ cm per metro. `check.mts` passa.

## Struttura ed esempi

Definizione del moto rettilineo uniforme; legge oraria ricavata dalla velocità media (esempi 1 e 2, avvisi su $s_0$ e
sul segno); il grafico spazio-tempo come retta, con $s_0$ intercetta e $v$ pendenza (figura con tre rette, figura
interattiva dell'auto che traccia il grafico, esempio 3 della legge dal grafico, avvisi "il grafico non è la strada" e
"la pendenza con le unità degli assi"); il grafico velocità-tempo con lo spostamento come area (figura, velocità
negativa, rimando alla lezione 43, avviso sui due grafici); due corpi che si incontrano (esempio 4 con la figura delle
rette, esempio 5 dell'inseguimento, avviso su somma e differenza delle velocità, figura interattiva).

## Scelte

- L'esempio 4 usa due ciclisti a $8$ e $6$ m/s e $420$ m, gli stessi numeri della figura interattiva (dove però sono
  un'auto e un camion); la lezione di matematica 51 ha lo stesso problema in km/h, ed è linkata.
- Il grafico velocità-tempo è introdotto solo per il moto uniforme (retta orizzontale, area come rettangolo), con un
  rimando alla lezione 43 del gruppo 13 per il resto.
- Nel grafico dell'incontro ho tolto la tacca dei $200$ m per far posto al valore $240$.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `rette-spazio-tempo-tre-moti`, `legge-oraria-dal-grafico`,
`area-grafico-velocita-tempo`, `incontro-due-ciclisti-rette`, tutte con la riga `% poi-interattivo` dove serve.
Interattive `moto-uniforme-grafico-spazio-tempo` (`fisica/MotoUniformeGrafico.tsx`: strada verticale accanto al grafico
con la stessa scala, cursori per $s_0$ da $0$ a $120$ m e $v$ da $-10$ a $10$ m/s, tempo fino a $12$ s o alla fine della
strada) e `incontro-rette-spazio-tempo` (`fisica/IncontroRette.tsx`: incontro a $30$ s e $240$ m, inseguimento a $25$ s e
$750$ m, con il punto $P$ e le proiezioni sugli assi). I pezzi comuni (strada verticale, veicoli visti dall'alto, assi
con le tacche numerate) sono nel mio file `fisica/stradaGrafico.tsx`. Guardate in chiaro, in scuro e sul telefono, dopo
l'animazione, senza errori in console né scorrimento laterale.

## Esercizi

Generatore `fis-moto-rettilineo-uniforme`, cinque livelli (specifica in
`specs/exercises/fis-moto-rettilineo-uniforme.md`), scene `grafico-dati` (livelli 3 e 4) e `strada-posizioni` (livello
5).

## Domande per Andrea

- L'Amaldi scrive la legge oraria $s = s_0 + v\,t$ o $x = x_0 + v\,t$? E chiama il grafico "spazio-tempo",
  "posizione-tempo" o "orario"?
- Il grafico velocità-tempo con l'area come spostamento sta bene in questa lezione, o l'Amaldi lo introduce solo con il
  moto accelerato?
- Gli inseguimenti con la partenza in istanti diversi (uno parte $10$ s dopo l'altro) servono? Ora non ci sono.
