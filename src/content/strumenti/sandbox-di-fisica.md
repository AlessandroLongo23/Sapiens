# Sandbox di fisica

## Un simulatore di meccanica

La sandbox è un banco di prova per la meccanica: metti insieme masse, piani inclinati, corde e carrucole, premi "Avvia" e la scena si muove secondo le leggi della dinamica. Per ogni corpo vedi le forze disegnate come frecce, i loro valori, la risultante, l'accelerazione e la velocità. È gratis e non chiede di registrarsi.

Si usa meglio da computer: sul telefono funziona, ma la scena è piccola.

## Come si costruisce una scena

Un clic su un pezzo della libreria lo mette nella scena; poi lo trascini dove serve. I pezzi sono otto: massa, sfera, corda, carrucola, pavimento, piano inclinato, parete e soffitto.

Una massa avvicinata a una superficie ci si appoggia e ne prende l'inclinazione. Quello che è appoggiato a una superficie la segue quando la sposti, la allunghi o ne cambi l'angolo.

Per una corda scegli "Corda" e clicca i due capi: un corpo, un punto di una superficie o un punto qualunque. Se la corda passa su una carrucola, clicca la carrucola tra un capo e l'altro.

Scegliendo un pezzo ne cambi i valori nel pannello: la massa e la velocità iniziale di un corpo, la lunghezza, l'inclinazione e i coefficienti di attrito $\mu_s$ e $\mu_d$ di una superficie, il raggio di una carrucola. "Annulla" e "Ripeti" valgono per ogni modifica.

Se non vuoi partire da zero apri "Esempi": piano inclinato con attrito, macchina di Atwood, piano inclinato con un peso appeso, blocco sul tavolo con un pesetto, corpo appeso a due fili, lampada tra soffitto e parete, lancio da un tavolo.

## Le forze su un corpo

Seleziona un corpo e nel pannello compare l'elenco delle sue forze, con il modulo di ciascuna: il peso $P$, la reazione del piano $F_v$, l'attrito statico $F_s$ o dinamico $F_d$, la tensione $T$ di una corda. Sotto trovi la somma delle forze, l'accelerazione, la velocità e l'energia meccanica.

Le frecce hanno una scala fissa: una forza che non cambia tiene la sua lunghezza anche quando muovi un cursore, così due frecce si possono confrontare a occhio.

Con "Componenti lungo x e y" ogni forza viene scomposta nelle sue due componenti, disegnate tratteggiate.

```ad-example
Quando parte un blocco su un piano inclinato
Apri l'esempio "Piano inclinato con attrito" e seleziona il blocco. A 30° con $\mu_s = 0{,}3$ il blocco scende, perché $\tan 30° \approx 0{,}58$ è maggiore di $\mu_s$. Abbassa l'inclinazione a 16°: adesso $\tan 16° \approx 0{,}29$ è minore di $\mu_s$, l'attrito statico tiene e il blocco resta fermo.
```

## Il moto e i grafici

"Avvia" fa partire il tempo e "Pausa" lo ferma. "Un passo" avanza di poco per volta, "Da capo" riporta la scena all'inizio, e con "¼×" il tempo scorre quattro volte più lento.

Per il corpo selezionato vedi un grafico nel tempo, a scelta tra posizione e velocità, con le loro componenti. L'andamento intero è tratteggiato in anticipo, e il moto lo ripassa con un tratto continuo. Il corpo selezionato lascia anche la traccia del suo percorso sulla scena.

```ad-example
La macchina di Atwood
Apri l'esempio "Macchina di Atwood" e avvia. Le due masse hanno la stessa accelerazione in modulo, $a = \frac{(m_2 - m_1)\,g}{m_1 + m_2}$, e la tensione della corda è la stessa sui due lati. Seleziona una massa e confronta i valori del pannello con quelli che ottieni dalla formula.
```

## Che cosa calcola, e che cosa no

I corpi sono punti materiali: hanno una massa e si spostano, ma non ruotano. Le corde sono ideali, cioè senza massa e inestensibili, e le carrucole sono fisse e senza attrito. Le superfici sono dritte, con attrito statico e dinamico. Le unità sono quelle del Sistema Internazionale.

Tensioni, reazioni e attrito non sono messi a mano: a ogni istante la sandbox risolve le equazioni del moto con i vincoli della scena, e quei valori sono il risultato.

Alcune cose oggi non ci sono: i corpi non si urtano tra loro, non ci sono molle, e un corpo che arriva alla fine di un piano dove ne comincia un altro ferma la simulazione.

## Condividere una scena

"Condividi" copia un link che riapre la scena com'è, con tutti i suoi pezzi e i loro valori. Serve per mandare un esercizio a un compagno o per ritrovare una scena preparata per la classe.
