# Note: La caduta libera e il lancio verticale

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 13, 30 settembre 2026). Conti rifatti in Python: cadute $\tfrac{1}{2} \cdot 9{,}8 \cdot t^2$ = $4{,}9$; $19{,}6$; $44{,}1$ m, spazi per secondo $4{,}9$, $14{,}7$, $24{,}5$ m, e $\sqrt{2 \cdot 44{,}1/9{,}8} = 3{,}0$ s; ponte $\sqrt{24/9{,}8} = 1{,}565$ s, $\sqrt{2 \cdot 9{,}8 \cdot 12} = 15{,}34$ m/s ($55$ km/h); pozzo $4{,}9 \cdot 1{,}8^2 = 15{,}876$ m, $9{,}8 \cdot 1{,}8 = 17{,}64$ m/s; righello $\sqrt{0{,}30/9{,}8} = 0{,}175$ s; lancio a $19{,}6$ m/s: altezze $0$; $14{,}7$; $19{,}6$; $14{,}7$; $0$ m e velocità $19{,}6$; $9{,}8$; $0$; $-9{,}8$; $-19{,}6$ m/s; lancio a $12$ m/s: $144/19{,}6 = 7{,}347$ m, $24/9{,}8 = 2{,}449$ s, $12 - 19{,}6 = -7{,}6$ m/s, $24 - 19{,}6 = 4{,}4$ m; chiavi $\sqrt{98} = 9{,}899$ m/s; balcone $\sqrt{64 + 235{,}2} = 17{,}297$, $t = 25{,}297/9{,}8 = 2{,}581$ s, salita $0{,}816$ s e $3{,}265$ m, caduta da $15{,}265$ m in $1{,}765$ s. `check.mts` passa.

## Struttura ed esempi

Tutti i corpi cadono allo stesso modo (Aristotele, Galileo e i Discorsi del 1638, il racconto di Viviani, il tubo di Newton con la figura, Apollo 15); l'accelerazione di gravità ($9{,}8$ m/s², stessa cosa dei $9{,}8$ N/kg, variazioni sulla Terra, la Luna, definizione di caduta libera); la convenzione dell'asse verso l'alto con le tre leggi, nota sull'asse verso il basso dei libri; la caduta da ferma (figura ogni secondo, $1:3:5$, tempo di caduta e velocità d'arrivo, indipendenti dalla massa), esempio 1 (ponte), avviso sulla radice, esempio 2 (pozzo), il righello per il tempo di reazione; il lancio verso l'alto (figura con le frecce di velocità e accelerazione, tempo di salita, altezza massima, simmetria e tempo di volo), avviso "in cima l'accelerazione non è zero", esempi 3 (palla a $12$ m/s) e 4 (chiavi all'amico); i grafici del lancio (figura v-t e y-t); il lancio da un'altezza con l'equazione di secondo grado e in due passi, esempio 5 (balcone), avviso sul segno dello spostamento; l'aria trascurata (rimando alla velocità limite); la figura interattiva.

## Scelte

- Convenzione: asse verso l'alto per tutta la lezione, posizione $y$ (la $s$ delle lezioni precedenti), $a = -g$ con $g = 9{,}8$ m/s² positivo. Una nota dice che molti libri, per la sola caduta, prendono l'asse verso il basso.
- Dati storici: Galileo, "Discorsi e dimostrazioni matematiche intorno a due nuove scienze", Leida 1638; il racconto della torre di Pisa è di Vincenzo Viviani (Racconto istorico della vita di Galileo, scritto nel 1654, da verificare la data) ed è segnato come dubbio; l'esperimento del martello e della piuma di David Scott è del 2 agosto 1971, missione Apollo 15 (NASA, da citare con il link del filmato se serve). Valori di $g$: $9{,}78$ all'equatore e $9{,}83$ ai poli, $1{,}6$ sulla Luna (valori standard, da verificare sulla fonte del libro).
- Il tubo di Newton è disegnato con una moneta e una piuma stilizzate; il tubo con l'aria ha un fondo azzurrino.
- Il lancio da un'altezza usa l'equazione di secondo grado: al secondo anno la matematica ce l'ha (primo anno o inizio del secondo); c'è anche la via in due passi, senza equazione.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `tubo-di-newton`, `caduta-libera-ogni-secondo` (1 cm = 10 m, palline a $4{,}41$; $3{,}92$; $2{,}45$; $0$ cm), `lancio-verticale-frecce` (1 cm = 5 m per le altezze, $0{,}06$ cm per m/s per le velocità: frecce di $1{,}18$ e $0{,}59$ cm; accelerazione $0{,}5$ cm, non in scala con le velocità), `lancio-verticale-grafici` (v-t 1 cm = 10 m/s, y-t 1 cm = 5 m, 1 cm = 1 s). Interattiva `lancio-verticale-velocita` (`fisica/LancioVerticale.tsx`): cursore $v_0$ da $5$ a $20$ m/s e cursore del tempo, bottone Lancia; freccia della velocità in scala ($0{,}06$ cm per m/s), freccia verde di $g$ sempre uguale, tacca all'altezza massima, puntini ogni $0{,}25$ s.

## Esercizi

Generatore `fis-caduta-libera`, sei livelli (specifica in `specs/exercises/fis-caduta-libera.md`), senza scena.

## Domande per Andrea

- Asse verso l'alto per tutto, anche per la caduta semplice, con $y$ come posizione: va bene, o l'Amaldi usa l'asse verso il basso e $h = \tfrac{1}{2}g\,t^2$? E la lettera: $y$, $h$ o $s$?
- Il racconto della torre di Pisa: citarlo come dubbio, o toglierlo?
- Il lancio da un balcone con l'equazione di secondo grado: dentro la lezione, o solo negli esercizi più difficili?
- La velocità d'arrivo si chiede "in modulo" negli esercizi: va bene la parola, o meglio "quanto vale la velocità"?
