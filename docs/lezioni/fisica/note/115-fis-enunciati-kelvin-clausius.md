# Note: Gli enunciati di Kelvin e di Clausius

Lezione nuova (lotto del terzo anno di fisica, gruppo 43, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $4186 \cdot 0{,}25 \cdot 60 = 62\,790$ J;
- esempio 2: $300 + 100 = 400$ J;
- esempio 3: $4186 \cdot 1{,}0 \cdot 10^3 \cdot 1{,}0 = 4{,}186 \cdot 10^6$ J, $2{,}0 \cdot 10^6 / 4{,}186 \cdot 10^6 = 0{,}4778$ m³;
- esempio 4: $800 - 500 = 300$ J; esempio 5: $400 + 200 = 600$ J, $600 - 200 = 400$ J;
- esempio 6: $600 - 450 = 150$ J, $150/600 = 0{,}25$.

`check.mts`: 0 errori; 2 avvisi sulla lezione ("titolo con maiuscole all'inglese" per i due titoli "Se fosse falso Clausius,
sarebbe falso Kelvin" e viceversa: le maiuscole sono dei nomi propri).

## Struttura ed esempi

Il primo principio non fissa il verso (esempio 1, il tè); l'enunciato di Clausius e il frigorifero che non lo viola (figura,
esempio 2); l'enunciato di Kelvin, $\eta < 1$, l'isoterma che non lo viola, l'asimmetria tra lavoro e calore (figura,
avviso); il moto perpetuo di prima e di seconda specie (tabella, esempio 3, la nave); l'equivalenza dei due enunciati nelle
due direzioni, ciascuna con un esempio numerico e la sua figura (esempi 4 e 5), poi la figura interattiva; come riconoscere
che cosa viola un dispositivo (due passi, esempio 6 con quattro dispositivi, avviso).

## Scelte

- Confine con la 114: macchina termica, sorgenti e rendimento sono già definiti lì e si richiamano con il link. Confine con
  la 116: niente trasformazioni reversibili, niente rendimento massimo. Confine con la 117 (gruppo 44): il frigorifero qui
  entra solo con il bilancio $Q_c = Q_f + W$, quanto serve per l'enunciato di Clausius e per la dimostrazione; coefficiente
  di prestazione e funzionamento stanno nella 117, linkata.
- L'equivalenza si dimostra con la versione dei libri di testo: se cade Clausius, il dispositivo vietato riporta $Q_f$ alla
  sorgente calda e l'insieme viola Kelvin; se cade Kelvin, la macchina vietata aziona un frigorifero e l'insieme viola
  Clausius. La macchina vietata prende il calore dalla sorgente calda (così la sorgente calda riceve in tutto proprio $Q_f$).
- L'enunciato di Kelvin è dato nella forma di Kelvin-Planck, con il nome tra parentesi.
- I dispositivi vietati sono disegnati con il cerchio tratteggiato, in tutte le figure e nella scena degli esercizi.
- La lezione è qualitativa, ma ogni esempio ha un conto o un bilancio da fare (sei esempi).

## Figure

Quattro TikZ, guardate in chiaro e in scuro, tutte con le frecce in scala (1 cm = 800 J), con le coordinate generate da uno
script: `clausius-frigorifero-dispositivo-vietato`, `kelvin-macchina-termica-macchina-vietata`,
`equivalenza-clausius-falso-kelvin-falso`, `equivalenza-kelvin-falso-clausius-falso`.

Interattiva `equivalenza-kelvin-clausius` (`fisica/EquivalenzaEnunciati.tsx`): risponde a "che cosa fa l'insieme di una
macchina vera e di un dispositivo vietato? Nella prima costruzione, quanto calore scambia in tutto la sorgente fredda?". Un
selettore sceglie la costruzione (se cade Clausius, se cade Kelvin), un cursore cambia il calore ceduto dalla macchina (da
200 a 700 J, con $Q_c = 800$ J) o il lavoro della macchina vietata (da 100 a 400 J, con $Q_f = 400$ J del frigorifero), un
bottone sostituisce i due dispositivi con il loro insieme e mostra solo gli scambi totali. Parte dai numeri degli esempi 4 e 5.

## Esercizio guidato

L'esempio 4 (l'insieme che viola Kelvin). Si fermerebbe in tre punti: (1) "quanto calore scambia in tutto la sorgente
fredda?"; (2) "quanto ne cede in tutto la sorgente calda?"; (3) "quale enunciato vieta una macchina che fa questo?".

## Da verificare

- Date: Clausius 1850, Kelvin (William Thomson) 1851 (scritte a memoria).
- I due enunciati sono parafrasi nella forma dei libri di testo italiani, non citazioni.
- Per l'acqua di mare l'esempio 3 usa i dati dell'acqua ($1{,}0 \cdot 10^3$ kg/m³ e 4186 J/(kg·°C)), e lo dice.

## Domande per Andrea

- La dimostrazione dell'equivalenza con i numeri (esempi 4 e 5) accanto a quella in lettere: è troppo, o aiuta?
- Nella seconda metà la macchina vietata prende il calore dalla sorgente calda. L'Amaldi fa lo stesso, o usa la sorgente
  fredda? (da verificare)
- L'espansione isoterma come caso che non viola Kelvin presuppone la lezione 111: va bene tenerla nel testo?
- La nave che va con il calore del mare come esempio di moto perpetuo di seconda specie: va bene, o è meglio un altro
  esempio?

Prerequisiti proposti: fis-macchine-termiche, principi-termo, calore
