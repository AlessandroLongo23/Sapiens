# Note: La velocità media e istantanea

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 12, 30 settembre 2026). Conti rifatti in Python:
$72 / 8{,}0 = 9{,}0$ m/s e $92 / 12 = 7{,}67$ m/s (esempio 1 e avviso); $-30 / 6{,}0 = -5{,}0$ m/s (esempio 2);
$45 : \tfrac{1}{3} = 135$ km/h, $45\,000 / 1200 = 37{,}5$ m/s, $37{,}5 \cdot 3{,}6 = 135$ (esempio 3); $20 / 3{,}6 = 5{,}6$
(il controllo della conversione); $400 / 80 = 5{,}0$ m/s (esempio 4); $50 / 22 = 2{,}27$ e $190 / 22 = 8{,}64$ m/s
(esempio 5); $60/60 = 1$ h, $60/40 = 1{,}5$ h, $120 / 2{,}5 = 48$ km/h; per $s = 0{,}5\,t^2$: $s(2) = 2$, $s(6) = 18$,
$s(4) = 8$, $s(3) = 4{,}5$, $s(2{,}1) = 2{,}205$, $s(2{,}01) = 2{,}02005$, velocità medie $4$, $3$, $2{,}5$, $2{,}05$,
$2{,}005$ m/s, tangente di pendenza $2$ m/s; per la curva del carrello in salita $s = 16 - (t - 4)^2$: $s(2) = s(6) = 12$
m, tangenti di pendenza $4$, $0$, $-4$ m/s. `check.mts` passa.

## Struttura ed esempi

Velocità media con il segno (esempi 1 e 2, avviso su $s/t$), metri al secondo e chilometri all'ora (con il rimando
all'esempio 4 della lezione 02, un trucco per controllare la conversione, esempio 3 del treno, avviso sui minuti),
velocità scalare media (esempio 4 del giro di pista, esempio 5 con l'auto della lezione 38), la velocità media che non è
la media delle velocità ($60$ e $40$ km/h danno $48$, con l'avviso), la velocità media come pendenza della secante nel
grafico spazio-tempo, la velocità istantanea (tabella con gli intervalli che si accorciano, tangente, nota sul limite e
la derivata, il segno letto sul grafico, avviso sul tachimetro).

## Scelte

- La velocità istantanea come limite solo a parole, con una tabella di numeri e due figure statiche, come chiesto; il
  limite e la derivata sono nominati in una nota con il link alla lezione di matematica del quinto anno.
- Le posizioni del carrello che parte vengono da $s = 0{,}5\,t^2$ (moto uniformemente accelerato): la lezione lo dice e
  rimanda alla lezione 42, senza usare la formula.
- Il carrello che sale e ridiscende una rotaia inclinata ha un'accelerazione di $2$ m/s² (la curva è
  $16 - (t - 4)^2$): plausibile per una rotaia inclinata di una dozzina di gradi, non per un sasso lanciato in aria,
  per questo non ho usato una palla.
- Grafici statici con la riga `% poi-interattivo` (secante trascinabile, secante che diventa tangente, punto che scorre
  sulla curva): nessuna interattiva in questa lezione, perché il piano cartesiano del kit non c'è ancora.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `velocita-media-secante-grafico` ($1$ cm per secondo, $1$ cm ogni $4$ m;
secante per $(2; 2)$ e $(6; 18)$), `velocita-istantanea-tangente` (tre secanti da $P$ e la tangente $s = 2t - 2$),
`segno-velocita-tangenti` ($0{,}75$ cm per secondo, tangenti a $2$, $4$ e $6$ s con pendenza $\pm 4$ m/s in scala).

## Esercizi

Generatore `velocita`, cinque livelli (specifica in `specs/exercises/velocita.md`), scena `strada-posizioni` ai livelli
1 e 4.

## Domande per Andrea

- "Velocità scalare media" è il nome dell'Amaldi per distanza percorsa su tempo? Altri libri dicono "velocità media"
  per quella e "velocità vettoriale media" per l'altra.
- Il simbolo $v_m$ per la velocità media e $v_s$ per quella scalare vanno bene, o l'Amaldi usa $\bar v$?
- La velocità istantanea come pendenza della tangente, con una tabella di intervalli sempre più corti: è il livello
  giusto per la seconda, o basta la definizione a parole con il tachimetro?
- L'esempio della velocità media su due tratti ($48$ e non $50$ km/h) è nel programma di seconda, o è un esercizio da
  gara?
