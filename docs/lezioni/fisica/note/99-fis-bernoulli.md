# Note: L'equazione di Bernoulli

Lezione nuova (lotto del terzo anno di fisica, gruppo 38, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella lezione:

- ordini di grandezza: $\tfrac12 \cdot 1000 \cdot 2{,}0^2 = 2000$ Pa, $1000 \cdot 9{,}8 \cdot 1{,}0 = 9800$ Pa;
- esempio 1: $500 \cdot (64 - 4) = 30\,000$ Pa, $p_2 = 120\,000$ Pa;
- esempio 2: $1000 \cdot 9{,}8 \cdot 9{,}0 = 88\,200$ Pa, $p_2 = 211\,800$ Pa, scritto $2{,}12 \cdot 10^5$ Pa;
- esempio 3: $v_2 = 6{,}0$ m/s, $500 \cdot (36 - 2{,}25) = 16\,875$ Pa, $d g h = 49\,000$ Pa, $p_2 = 234\,125$ Pa;
- figura delle barre: $300\,000 + 1125 = 234\,125 + 18\,000 + 49\,000 = 301\,125$ Pa;
- esempio 4: $0{,}6 \cdot 900 = 540$ Pa, $54\,000$ N, cioè il peso di $5{,}5 \cdot 10^3$ kg;
- testo dopo l'interattiva: con $2{,}0$ m/s, $500 \cdot (64 - 4) = 30\,000$ Pa.

`check.mts` passa senza errori e senza avvisi.

## Scelte

- La dimostrazione c'è, con il bilancio $W_{nc} = \Delta E$ della lezione 79 (linkata): l'Amaldi e il Walker del terzo anno la danno così. Le forze di pressione sono trattate come forze non conservative esterne al volumetto, il peso entra come energia potenziale.
- Simboli del README: $p + \tfrac12 d\,v^2 + d\,g\,h = \text{costante}$, con $h$ quota. Il riquadro "La quota non è la profondità" c'è perché nella 28 $h$ era la profondità.
- I nomi "pressione dinamica" e "pressione idrostatica" per il secondo e il terzo termine non compaiono: i termini si chiamano "termine cinetico" e "termine della quota". Da decidere con Andrea.
- Confine con la 100: qui l'equazione, i tre casi particolari (fermo, orizzontale, sezione costante), il procedimento e gli esempi di calcolo diretto della pressione. La strozzatura con i tubicini compare come caso particolare qualitativo; il venturimetro con la formula della velocità, Torricelli, Pitot e la portanza stanno nella 100. L'esempio del vento sul tetto sta qui perché è un uso diretto del caso orizzontale; la 100 non lo ripete.
- Somme e differenze di pressioni arrotondate alla posizione dell'addendo meno preciso ($3{,}00 \cdot 10^5$ è preciso alle migliaia), come nella 28.
- $g = 9{,}8\,\text{m/s}^2$ (qui in m/s², non in N/kg come nel capitolo dei fluidi fermi, perché il termine viene da $m g h$).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `bernoulli-tubo-sezioni-quote` (i due volumetti hanno la stessa area, $0{,}6 \times 1$ e $1{,}2 \times 0{,}5$; $v_2$ è lunga il doppio di $v_1$ come vuole il rapporto delle altezze disegnate), `tubo-orizzontale-strozzatura-tubicini` (qualitativa), `bernoulli-barre-esempio-tre-termini` ($1{,}2$ cm per $10^5$ Pa: $3{,}6$; $2{,}81 + 0{,}216 + 0{,}588 = 3{,}614$).

Interattiva (registrata sotto il commento del gruppo 38):

- `bernoulli-tubo-barre` (`fisica/BernoulliTubo.tsx`): il tubo dell'esempio 3 con tre cursori (velocità d'ingresso da 0,5 a 2 m/s, dislivello da 0 a 8 m, diametro in alto da 2 a 4 cm) e due colonne in scala con i tre termini nelle due sezioni. Domanda: costa più pressione salire di cinque metri o dimezzare il diametro? Risposta nel testo: con i dati dell'esempio la salita ($0{,}49$ contro $0{,}17 \cdot 10^5$ Pa); a $2{,}0$ m/s l'accelerazione arriva a $0{,}30 \cdot 10^5$ Pa. Le colonne sono un pezzo scritto nel file (due rettangoli impilati): `energia.tsx` del gruppo 18 disegna un solo stato con le barre separate, e qui servono due stati affiancati.

## Esercizi

Generatore `fis-bernoulli`, cinque livelli (specifica in `specs/exercises/fis-bernoulli.md`): Il calo di pressione nella strozzatura, La pressione nella strozzatura, Il tubo che sale, La strozzatura con i diametri, Più in alto e più stretto. Pressioni in kilopascal. Scena `tubo-sezioni` ai livelli 3, 4 e 5. Senza esercizio: il vento sul tetto.

## Esercizio guidato

L'esempio 3. Si fermerebbe in tre punti: "quale equazione dà $v_2$?" (la continuità, con il quadrato dei diametri); "dove conviene mettere il livello di riferimento?" (in cantina, così $h_1 = 0$); "quali termini restano nell'equazione?" (tutti e tre a destra, due a sinistra).

## Domande per Andrea

- La dimostrazione con il lavoro delle forze di pressione va tenuta per intero, o al terzo anno basta enunciare che è la conservazione dell'energia?
- "Termine cinetico" e "termine della quota" o i nomi "pressione dinamica" e "pressione di gravità"? L'Amaldi non dà nomi (da verificare).
- L'esempio del tetto: la frase "lontano dalla casa l'aria ferma e quella in moto hanno la stessa pressione totale" giustifica il confronto tra dentro e fuori, che a rigore non sono sulla stessa linea di flusso. Va bene così, o è meglio togliere l'esempio?
- $g$ in m/s² in questo capitolo, mentre nel capitolo dei fluidi fermi è in N/kg: lo segnalo?

## Da verificare

- Daniel Bernoulli, svizzero, pubblicazione dell'*Hydrodynamica* nel 1738: a memoria.
- Densità dell'aria $1{,}2\,\text{kg/m}^3$ a temperatura ambiente al livello del mare (a $0\,^\circ\text{C}$ è $1{,}29$).
- "Circa ottocento volte più piccola di quella dell'acqua": $1000/1{,}2 = 833$.
- Vento di $30$ m/s ($108$ km/h) come vento di tempesta: valore di esempio.
- "Due navi affiancate si avvicinano": esempio classico dei libri, citato senza conti.

Prerequisiti proposti: fis-portata-continuita, fis-legge-stevino, energia, fis-bilancio-energia
