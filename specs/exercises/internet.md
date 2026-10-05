# internet: Internet, la rete delle reti

Generatore: `src/lib/exercises/v2/generators/internet.ts`, con gli aiuti di `src/lib/exercises/v2/inf-web1.ts`.
Verifica indipendente: `scripts/exercises/checkers/internet.py`. Lezione:
`docs/lezioni/informatica/riscritte/33-internet.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`answer.kind = 'choice'`). I campioni sono testo
semplice (`format: 'text'`). Le domande si compongono da pezzi intercambiabili, e ogni pezzo ha un identificatore
nelle `values` dell'opzione. La `solution` è sempre il testo dell'opzione giusta.

## Regole comuni

- Si dà del tu; niente trattini lunghi, niente "piuttosto che", niente marchi.
- I nomi di persona vengono da un elenco di dodici.
- I numeri da cinque cifre in su hanno uno spazio stretto che non va a capo tra le migliaia (3 000 000).
- `params.case` dice il caso dell'esercizio, per le quote.

## Livello 1: reti locali e reti geografiche

Otto reti locali (`l1`-`l8`: la rete dei computer del laboratorio di una scuola, la rete Wi-Fi di un appartamento…) e
otto reti geografiche (`g1`-`g8`: la rete di una compagnia telefonica che copre tutta Italia, la rete che collega due
continenti…). Tutte cominciano con "la rete", così la forma non tradisce la risposta. Due domande, metà ciascuna: "Quale
di queste è una rete locale (LAN)?" (una locale e tre geografiche) e "Quale di queste è una rete geografica (WAN)?".

Esempio: "Quale di queste è una rete geografica (WAN)?" Opzioni: La rete dei computer di uno studio medico; La rete che
collega le sedi di una banca in venti città; La rete Wi-Fi a cui si collegano i tablet di una classe; La rete dei
computer e delle stampanti di un ufficio. Risposta: la seconda.

## Livello 2: le parole delle reti

Diciotto descrizioni, tre per parola. Si chiede "Di che cosa si parla?". Opzioni: la parola giusta e tre delle altre
cinque, tra Il router, Il fornitore di accesso, La rete locale, La rete geografica, Il Wi-Fi, Internet.

Esempio: "Il telefono può mostrarlo al massimo anche quando le pagine non si aprono. Di che cosa si parla?" Risposta:
Il Wi-Fi. Distrattore tipico: Internet (l'avviso "Il Wi-Fi non è Internet").

## Livello 3: il Wi-Fi non è Internet

Il guasto si deduce da che cosa funziona ancora. Tre casi, un terzo ciascuno, con un nome, un dispositivo (telefono,
tablet, portatile, console) e uno scambio dentro casa (una foto alla stampante, un video al televisore, una canzone
alla cassa senza fili):

- `uscita`: il dispositivo mostra il Wi-Fi al massimo e lo scambio dentro casa riesce, ma le pagine non si aprono da
  nessun dispositivo. Risposta: nel collegamento tra il router e il fornitore di accesso.
- `wifi`: quel dispositivo non riesce a fare né l'una né l'altra cosa, gli altri sì. Risposta: nel collegamento tra
  quel dispositivo e il router.
- `router`: nessun dispositivo riesce a fare né l'una né l'altra cosa. Risposta: nel router di casa.

Le opzioni sono sempre quattro posti: i tre qui sopra e la periferica dello scambio (Nella stampante), che non spiega
mai le pagine che non si aprono.

Esempio: "A casa di Anna il portatile mostra il Wi-Fi al massimo e riesce a mandare una canzone alla cassa senza fili,
ma le pagine web non si aprono da nessun dispositivo. Dov'è più probabile che sia il guasto?" Risposta: Nel
collegamento tra il router e il fornitore di accesso.

## Livello 4: quanti pacchetti

Il conto dell'esempio 1, costruito all'indietro: si scelgono la dimensione (da 300 kB a 12 MB, multipli di 300 kB) e i
byte per pacchetto (500, 1000, 1250, 1500, 2000, 2500), e il numero dei pacchetti è il quoziente, sempre intero. La
dimensione è data anche in byte, come nella lezione ($1\,\text{MB} = 1\,000\,000\,\text{B}$): la difficoltà è il conto,
non l'equivalenza.

- `pacchetti` (metà): dimensione e byte per pacchetto, si chiede il numero dei pacchetti. Distrattori: uno zero in più
  o in meno, il doppio, la metà.
- `dimensione` (un quarto): numero dei pacchetti e byte per pacchetto, si chiede la dimensione in byte. Distrattori:
  uno zero in più o in meno, la somma al posto del prodotto.
- `perso` (un quarto): il pacchetto numero k va perso, si chiede quanti byte rimanda il mittente. Risposta: i byte di
  un pacchetto. Distrattori: tutto il file, tutto il file meno un pacchetto, i primi k pacchetti.

Esempio: "Una foto occupa 3 MB, cioè 3 000 000 B. Ogni pacchetto porta 2500 B della foto. Quanti pacchetti servono?"
Risposta: 1200 pacchetti.

## Livello 5: che cosa decide un protocollo

Otto cose che un protocollo stabilisce (`d1`-`d8`: in che ordine stanno le informazioni dentro un pacchetto, chi parla
per primo, che cosa fa chi riceve quando manca un pacchetto…) e otto che non stabilisce (`n1`-`n8`: la marca del
router, il colore del cavo, il sistema operativo del telefono…), come nell'esempio 3. Due domande, metà ciascuna:
"Quale di queste cose è stabilita da un protocollo?" e "… non è stabilita…?".

Esempio: "Quale di queste cose non è stabilita da un protocollo?" Risposta possibile: Quanto è grande lo schermo del
dispositivo.

## Livello 6: vero o falso su Internet

Dodici affermazioni vere (`t1`-`t12`) e dodici false (`f1`-`f12`), le false prese dagli avvisi della lezione (Internet
e il web come sinonimi, il Wi-Fi come Internet) e dagli errori sui pacchetti (la foto che viaggia intera, la stessa
strada per tutti, tutto da rispedire). Due domande, metà ciascuna: "Quale di queste affermazioni su Internet è vera?"
e "… è falsa?".

Esempio: "… è falsa?" Risposta possibile: Quando mandi un messaggio vocale stai usando il web.

## Da evitare

- Domande di memoria su date e nomi (ARPANET, 1969, 1983).
- Reti del livello 1 di estensione dubbia (la rete di un ospedale con più sedi, la rete di un campus).
- Descrizioni del livello 2 che vanno bene per due parole (una rete "che collega reti lontane" senza dire che ha un
  solo proprietario è sia una rete geografica sia Internet).
- Al livello 4, quozienti non interi e dimensioni date solo in MB.

## Verifica

`scripts/exercises/checkers/internet.py` ricostruisce la risposta dai pezzi: ha la sua tabella delle reti, dei compiti
di un protocollo e delle affermazioni, con le parole che ogni opzione deve contenere; classifica la descrizione del
livello 2 dalle parole che usa e boccia quelle che vanno bene per zero o per due parole; al livello 3 deduce il guasto
dal testo della situazione; al livello 4 rifà il conto e controlla che i numeri siano quelli del testo. Poi controlla
le quattro opzioni (diverse, una sola giusta, quella indicata), che la soluzione sia il testo dell'opzione giusta, e la
quota dei casi.

## Domande per la revisione

- Livello 3: il caso `router` (niente funziona, neanche dentro casa) non è nella lezione, che tratta solo l'uscita
  verso il fornitore. Va bene come terzo caso?
- Livello 4: i pacchetti portano da 500 a 2500 B. Va bene, o si preferisce sempre 1500 B come nell'esempio?
