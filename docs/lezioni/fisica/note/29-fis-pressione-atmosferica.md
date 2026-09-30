# Note: La pressione atmosferica e la sua misura

Lezione nuova (secondo lotto di fisica, gruppo 9, 30 settembre 2026). Tutti i numeri rifatti in Python: aria della
stanza $60\,\text{m}^3$, $72\,\text{kg}$, $705{,}6 \approx 7{,}1 \cdot 10^2\,\text{N}$; colonna d'aria su un metro
quadro $101\,300 / 9{,}8 \approx 10\,340\,\text{kg}$ ("circa dieci tonnellate"); tavolo $0{,}96\,\text{m}^2$,
$97\,248\,\text{N}$; Torricelli $13\,600 \cdot 9{,}8 \cdot 0{,}760 = 101\,292{,}8\,\text{Pa}$, con $13\,595$ e
$9{,}80665$ si ottiene $101\,324$ (da qui il "circa $101\,325$"); barometro ad acqua $10{,}34\,\text{m}$; $745 \cdot
1{,}33 = 990{,}85$; $101\,325 / 760 = 133{,}32\,\text{Pa}$; emisferi $\pi \cdot 0{,}25^2 = 0{,}196\,\text{m}^2$,
$19\,890\,\text{N}$, massa equivalente $2030\,\text{kg}$; ventosa $2{,}83 \cdot 10^{-3}\,\text{m}^2$, $201{,}6\,
\text{N}$, $20{,}6\,\text{kg}$; $100 / (1{,}2 \cdot 9{,}8) = 8{,}5\,\text{m}$ per ettopascal. `check.mts` passa con un
avviso letto (il titolo "Gli emisferi di Magdeburgo", dove la maiuscola è un nome proprio).

## Struttura ed esempi

Il peso dell'aria (esempio 1, la stanza; avviso "l'aria non pesa"), la pressione atmosferica e perché non ci schiaccia
(esempio 2, il tavolo), l'esperienza di Torricelli con la spiegazione per Stevino (esempio 3), la forma e
l'inclinazione del tubo (avviso), perché il mercurio (esempio 4, barometro ad acqua), le unità (tabella, esempio 5,
avvisi su hPa e su mmHg), i barometri a mercurio e aneroide, la pressione e la quota (Périer sul Puy de Dôme, tabella
dell'atmosfera standard, nota sul tempo atmosferico), gli emisferi di Magdeburgo (esempio 6), la cannuccia e la
ventosa (esempio 7, avvisi "la cannuccia non aspira" e "la pressione interna si sottrae").

La legge di Stevino e la pressione sono solo usate e linkate: le spiega il gruppo 8 nelle lezioni 26-28. La formula
$p = F/S$ è usata senza rispiegarla.

## Fonti

- Esperienza di Torricelli: 1644, lettera a Michelangelo Ricci dell'11 giugno 1644 (a memoria, da verificare). La
  frase d'apertura riprende la sua immagine ("Noi viviamo sommersi nel fondo d'un pelago d'aria"), che non ho citato
  alla lettera perché la cito a memoria. Chi abbia fatto materialmente l'esperimento (Torricelli o Vincenzo Viviani)
  è da verificare; la lezione dice "Torricelli".
- Florin Périer e il Puy de Dôme: 19 settembre 1648, differenza di circa tre pollici (circa $8{,}5\,\text{cm}$) tra
  Clermont e la cima; a memoria, da verificare. Il monte è alto $1465\,\text{m}$ ("circa $1500\,\text{m}$").
- Otto von Guericke: sindaco di Magdeburgo; la dimostrazione con i cavalli è datata di solito 1654 (Ratisbona,
  davanti all'imperatore Ferdinando III) o 1656-1657 (Magdeburgo): per questo la lezione dice "a metà del Seicento".
  Il numero dei cavalli (otto per parte, o di più) e il diametro degli emisferi ("circa mezzo metro") sono da
  verificare.
- Tabella della quota: valori dell'atmosfera standard internazionale (ISO 2533:1975, uguale fino a $11\,\text{km}$
  alla U.S. Standard Atmosphere 1976), calcolati da me con la formula $p = 1013{,}25 \cdot (1 - 2{,}25577 \cdot
  10^{-5}\,h)^{5{,}25588}\,\text{hPa}$: $899$, $795$, $701$, $505$, $314\,\text{hPa}$ a $1000$, $2000$, $3000$, $5500$ e
  $8849\,\text{m}$; da confrontare con una tabella pubblicata. Sull'Everest la pressione vera misurata è un po' più
  alta (circa $330\,\text{hPa}$, da verificare): "circa un terzo" vale in tutti e due i casi.
- $1\,\text{atm} = 101\,325\,\text{Pa}$ (definizione, 10ª Conferenza generale dei pesi e delle misure, 1954, da
  verificare la data), $1\,\text{bar} = 10^5\,\text{Pa}$, densità del mercurio $13\,595\,\text{kg/m}^3$ a $0\,^\circ
  \text{C}$: valori noti, citati a memoria.
- Densità dell'aria $1{,}2\,\text{kg/m}^3$ e del mercurio $13\,600\,\text{kg/m}^3$: tabella della lezione 03.
- "Cabine pressurizzate, voli intorno ai $10\,000\,\text{m}$", "le carte del tempo riportano le pressioni al livello
  del mare", "circa $1\,\text{hPa}$ ogni $8\,\text{m}$": fatti noti, il terzo calcolato con la densità dell'aria.

## Scelte

- Pressione atmosferica "$p_0 \approx 1{,}013 \cdot 10^5\,\text{Pa}$" come nel brief; il valore esatto dell'atmosfera
  normale ($101\,325$) solo nell'esempio 3 e nella tabella delle unità.
- Nell'esempio 3 il conto con $g = 9{,}8$ dà $1{,}0 \cdot 10^5\,\text{Pa}$ con due cifre, per la regola del README; si
  dice che con valori più precisi viene il valore normale.
- Negli esempi 6 e 7 $\pi$ con tutte le cifre; negli esercizi $\pi = 3{,}14$ scritto nel testo (vedi la specifica).
- Il mercurio nelle figure è `gray!60`: con `gray!40` (il colore di `liquidi.tsx` del gruppo 8) nel tema scuro il tubo
  stretto diventa quasi invisibile. Da uniformare con il gruppo 8.
- L'altitudine è qualitativa, come chiesto: niente formula, una tabella e due frasi.
- La nota sul tempo atmosferico (anticicloni) è in un `ad-note`: si può saltare.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `esperienza-torricelli`, `torricelli-tubi-diversi` (tubo stretto, largo e
inclinato di $30^\circ$, la superficie del mercurio orizzontale anche nel tubo inclinato), `emisferi-magdeburgo`,
`cannuccia-pressione`. Le etichette con l'unità sono scritte "$76$ cm" fuori dal math: `\text{cm}` dentro un nodo fa
fallire node-tikzjax (errore di compilazione, non documentato nel README).

Interattiva `torricelli-tubo-inclinato` (`fisica/TorricelliTubo.tsx`): inclinazione da $0$ a $60^\circ$, quota $0$,
$1000$, $2000$, $4800\,\text{m}$ (colonna di $760$, $674$, $596$, $416\,\text{mm}$ dall'atmosfera standard). La cima
della colonna resta alla stessa quota; oltre circa $38^\circ$ al livello del mare il mercurio riempie tutto il tubo
lungo un metro, e la didascalia lo spiega. Guardata in chiaro, in scuro, al telefono, a $30^\circ$, a $55^\circ$ e dopo
il cambio di quota.

## Esercizi

Generatore `fis-pressione-atmosferica`, specifica in `specs/exercises/fis-pressione-atmosferica.md`: cinque livelli
(Le unità della pressione, Millimetri di mercurio ed ettopascal, La forza dell'aria su una superficie, La colonna di un
barometro, La ventosa e gli emisferi). Nessuna scena: le figure non cambierebbero con i dati in modo utile.

## Domande per Andrea

- Nel primo biennio si usa "$p_0 = 1{,}013 \cdot 10^5\,\text{Pa}$" o "$1{,}01 \cdot 10^5$"? E $1\,\text{mmHg} =
  1{,}33\,\text{hPa}$ o la proporzione con $760\,\text{mmHg}$?
- L'atmosfera (atm) e il millimetro di mercurio vanno insegnati, o bastano pascal, ettopascal e bar?
- La tabella della pressione con la quota è utile in prima, o basta dire che cala e che a $5500\,\text{m}$ è la metà?
- La forza sugli emisferi come pressione per l'area del cerchio ($\pi r^2$): va bene detta così, senza dimostrazione?
- Il mercurio nelle figure grigio: va bene, o tutti i liquidi in `cyan!20` come dice il README?
- La storia (Torricelli, Périer, Guericke): i nomi e le date vanno bene così, o si preferisce meno storia?
