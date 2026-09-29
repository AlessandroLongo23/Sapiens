# Note: La relazione di laboratorio

Lezione nuova, primo lotto di fisica, gruppo 2. La chiedono le Indicazioni nazionali (DM 211/2010, allegato F, primo
biennio: "la scrittura di relazioni"); il programma (`docs/lezioni/fisica/programma.md`) la mette tra i tagli
possibili, e qui è scritta come lezione breve di metodo. Numeri dell'esempio rifatti in `g2/verifica.py` (media della
massa $67{,}53$, semidispersione $0{,}05$, volume medio $25{,}33$, $\rho = 2{,}666$, incertezze relative $0{,}0015$ e
$0{,}0790$, $\Delta\rho = 0{,}21$, risultato $(2{,}7 \pm 0{,}2)\ \text{g/cm}^3$). `check.mts` senza avvisi.

## Struttura

Le parti in tabella, poi scopo, strumenti, procedimento e conclusioni spiegati; le tabelle dei dati (cinque regole,
una tabella scritta male e la stessa scritta bene); l'elaborazione (con il link alla lezione sui grafici del gruppo
3); le conclusioni in tre parti; una relazione completa (densità di un cilindretto con bilancia e cilindro graduato,
compatibile con l'alluminio); un `ad-note` sulle varianti tra insegnanti; errori frequenti.

## Scelte e dubbi

- Le parti: titolo, scopo, cenni teorici, materiali e strumenti, procedimento, dati, elaborazione dei dati,
  conclusioni. È lo schema più comune nelle schede di laboratorio dei licei che ho in mente; alcune scuole aggiungono
  "grafici" o "fonti di errore" come parti a sé. Da verificare con Andrea e con l'Amaldi.
- Procedimento al passato, in prima persona plurale o impersonale: tutte e due accettate, detto nell'`ad-note`.
- Nella relazione di esempio l'incertezza del volume è la somma delle due letture ($2$ mL), perché è più grande della
  semidispersione dei tre volumi ($0{,}5$ mL): applica la regola "la più grande tra semidispersione e incertezza degli
  strumenti", estesa a una grandezza calcolata. È un passaggio che la lezione 06 non dice in modo esplicito; qui è
  spiegato nel testo dell'esempio.
- Densità di riferimento: alluminio $2{,}70$, ferro $7{,}87$, rame $8{,}96\ \text{g/cm}^3$ (valori a temperatura
  ambiente delle tabelle dei manuali, per esempio il CRC Handbook of Chemistry and Physics; da verificare
  sull'edizione).
- La data dell'esempio ("14 ottobre") è senza anno, apposta.

## Figure

- `cilindro-graduato-volume` (TikZ, 267 px): due cilindri graduati, l'acqua a $50$ mL e, con il cilindretto sul
  fondo, a $75$ mL.

Nessuna figura interattiva.

## Lasciato ad altre lezioni

- I grafici con le barre d'errore: lezione "Tabelle e grafici cartesiani" (gruppo 3), linkata. Se quella lezione non
  tratta le barre d'errore, serve un accenno qui o là.

## Per il generatore

`specs/exercises/fis-relazione-laboratorio.md`, cinque livelli a scelta multipla: le parti della relazione, la tabella
dei dati, confronto con il valore atteso, quale misura migliorare, cercare l'errore sistematico.

## Domande per Andrea

- Le parti della relazione e i loro nomi: vanno bene quelli della lezione, o la vostra scheda ne usa altri
  ("obiettivo", "strumentazione", "analisi dei dati")?
- Procedimento in prima persona plurale o impersonale?
- La tabella con l'incertezza nell'intestazione, sotto la tabella o in una colonna: avete una preferenza?
- Nell'esempio l'incertezza del volume viene dalle due letture del cilindro graduato ($1 + 1$ mL) e non dalla
  semidispersione dei tre volumi. È il ragionamento che chiedete ai ragazzi?
- Serve un esempio di relazione con un grafico (per esempio allungamento di una molla), o basta il link alla lezione
  sui grafici?
