# Note: Bus e periferiche

Lezione nuova (3 ottobre 2026). Non esisteva un originale.

## Struttura ed esempi

I tre bus con la figura e i passi di una lettura; la larghezza del bus indirizzi con la formula $2^n$, la tabella degli
otto indirizzi di tre linee e il procedimento in tre punti; le periferiche di ingresso, di uscita e di tutti e due i
tipi, con la figura; porte e interfacce.

Sei esempi svolti:

1. leggere la cella $2040$ che contiene $75$: che cosa viaggia su quale bus (e la variante in scrittura);
2. $16$ linee: $65\,536$ celle, indirizzo più grande $65\,535$, $64\,\text{KiB}$;
3. $1000$ celle: $10$ linee (il caso scomodo, non una potenza di due), e il caso di $1024$ celle esatte;
4. $32$ linee: $4\,\text{GiB}$, con il conto fatto con le potenze;
5. classificare le periferiche di una videochiamata, con il processore che non è una periferica;
6. copiare una foto su una chiavetta: bus, interfaccia, porta.

Avvisi: l'indirizzo e il contenuto sono due numeri diversi; una linea in più raddoppia, non aggiunge; il verso si guarda
dal computer.

## Conti

Rifatti in Python (`/tmp/informatica-cap4/conti.py`): $2^3 = 8$; $2^{16} = 65\,536$ e $65\,536 : 1024 = 64$;
$2^{17} = 131\,072$; $2^9 = 512$, $2^{10} = 1024$, $1024 - 1000 = 24$; $2^{32} = 4\,294\,967\,296 = 4 \cdot 2^{30}$;
$2^{20} = 1\,048\,576$.

## Scelte

- "Linee" per i fili del bus, e "larghezza" per il loro numero. Il bus indirizzi è detto a un solo verso (dalla CPU), il
  bus dati a due versi; del bus di controllo dico solo che porta i comandi, e negli esercizi il comando di lettura o
  scrittura parte dalla CPU. I segnali che vanno verso la CPU (le interruzioni) non ci sono.
- Gli indirizzi delle periferiche sono nominati in una riga ("della cella di memoria, o della periferica") senza
  spiegare come sono fatti.
- Per i conti: celle da $1$ byte, multipli binari con $2^{10}$, $2^{20}$, $2^{30}$, sempre scritti negli esercizi.
- "Schermo tattile" e non touch screen; "scheda di rete" tra le periferiche di ingresso e di uscita.
- Porte: USB, HDMI, presa per le cuffie, porta di rete come esempi, una volta; Bluetooth e Wi-Fi come interfacce senza
  fili. Nessuna versione, nessuna velocità, nessun tipo di connettore.
- Il driver non è nominato: "un programma che sappia comandarla", con il link alla lezione 18.
- Il bus dati è presentato per ultimo e in due righe; la "parola" della CPU (CPU a 32 o a 64 bit) non c'è.

## Fatti da verificare

- USB sciolto come Universal Serial Bus: sicuro. HDMI non è sciolto (High-Definition Multimedia Interface).
- "Con $32$ linee si indirizzano $4\,\text{GiB}$": è il limite dei computer con indirizzi a $32$ bit. Non dico quante
  linee hanno i computer di oggi, perché è un numero che cambia e che non coincide con i 64 bit dei registri: da
  verificare se si vuole aggiungerlo.
- Le porte nominate esistono sui dispositivi in commercio nel 2026; la presa per le cuffie manca su molti telefoni.

## Figure

- `bus-indirizzi-dati-controllo` (TikZ): la CPU a sinistra, memoria centrale e periferiche a destra, tre frecce: una
  punta per gli indirizzi, due per dati e controllo.
- `periferiche-ingresso-uscita` (TikZ): CPU e memoria al centro, tre periferiche di ingresso a sinistra, tre di uscita
  a destra, quelle di tutti e due i tipi sotto.

Guardate in chiaro e in scuro.

## Per il generatore

`inf-bus-periferiche`, cinque livelli (specifica in `specs/exercises/inf-bus-periferiche.md`): ingresso o uscita e
quale bus in quale verso (scelta multipla); dalle linee alle celle e dalle celle alle linee (conto, risposta numerica);
la memoria indirizzabile (scelta con l'unità, o numero di linee).

## Domande per Andrea

- Il bus di controllo: basta "trasporta i comandi", o servono le interruzioni e i segnali di stato?
- Le memorie di massa tra le periferiche di ingresso e di uscita, come nella lezione 13: va bene anche qui?
- "Non è una periferica" come quarta risposta negli esercizi su ingresso e uscita (processore, RAM, cache, bus): è
  utile o confonde?
- Serve dire quante linee di indirizzo ha un computer di oggi?
- Porte e interfacce in una sezione breve, senza esercizi: va bene, o serve un livello "quale porta per quale
  periferica" (che però invecchia)?
