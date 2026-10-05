# Password e autenticazione

Generatore: `password-sicure` (`src/lib/exercises/v2/generators/password-sicure.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/password_sicure.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/41-password-sicure.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (campioni in testo semplice, potenze in `$…$`). I
livelli 2, 3 e 4 sono sul conto della lezione, $N = k^n$, costruito all'indietro: prima si scelgono i caratteri e la
lunghezza, poi si scrive la domanda. I conti servono a capire perché una password lunga regge; nessun dettaglio su
come si conduce un attacco.

## Nomi dei livelli

1. I fattori di autenticazione
2. Quante password possibili
3. Più lunga o più varia
4. Il tempo per provarle tutte
5. La difesa giusta
6. Le abitudini che contano

## Livello 1: i fattori di autenticazione

"Quando Anna entra nel registro elettronico, il servizio chiede l'impronta del dito. Che fattore di autenticazione
è?" Sedici prove, quattro per risposta, e sei servizi. Opzioni fisse: Qualcosa che sai; Qualcosa che hai; Qualcosa
che sei; Nessuno: serve a dire chi sei, non a dimostrarlo (il nome utente, l'indirizzo di posta, il soprannome:
identificazione, non autenticazione). Un quarto dei casi ciascuna.

## Livello 2: quante password possibili

- password (3 su 4): "Una password è fatta di 8 caratteri scelti a caso tra lettere minuscole, maiuscole e cifre. Le
  lettere minuscole sono 26, come le maiuscole; le cifre sono 10. Quante sono le password possibili?" Risposta:
  $62^{8}$. Alfabeti: cifre (10, lunghezza da 4 a 9), minuscole (26), minuscole e maiuscole (52), minuscole e cifre
  (36), minuscole, maiuscole e cifre (62), e questi ultimi con 8, 18, 28 o 38 simboli dichiarati nel testo (70, 80,
  90, 100). Lunghezza da 4 a 16.
- frase (1 su 4): "Una frase d'accesso è fatta di 5 parole scelte a caso da un elenco di 2000 parole. Quante sono le
  frasi possibili?" Risposta: $2000^{5}$.

Distrattori: base ed esponente scambiati ($8^{62}$); il prodotto ($62 \cdot 8$); i caratteri contati male (solo le
minuscole, le cifre senza lo zero, gli insiemi moltiplicati: $260^{n}$ per minuscole e cifre); per la frase,
$26^{p}$, cioè le lettere al posto delle parole.

## Livello 3: più lunga o più varia

- fattore (metà): "Una password di 9 caratteri scelti a caso tra le lettere minuscole viene allungata di 3
  caratteri. Per quanto si moltiplica il numero delle combinazioni possibili?" Risposta: $26^{3}$. Distrattori:
  $26 \cdot 3$; $26^{12}$ (il totale nuovo, non il fattore); $3^{26}$.
- più, meno (un quarto ciascuno): "Quale di queste password, scelte a caso, ha più combinazioni possibili?" Quattro
  password su una griglia di due alfabeti, uno contenuto nell'altro (cifre, minuscole, minuscole e maiuscole, con le
  cifre), e due lunghezze. La risposta ha insieme la base e l'esponente più grandi (o più piccoli): non serve la
  calcolatrice.

## Livello 4: il tempo per provarle tutte

Solo potenze di dieci.

- tempo (55 su 100): "Il codice di un lucchetto ha 9 cifre scelte a caso, quindi ci sono $10^{9}$ combinazioni. Un
  programma ne prova $10^{4}$ al secondo. Quanti secondi servono, al massimo, per provarle tutte?" Risposta: $10^{5}$
  secondi. Distrattori: $10^{13}$ (esponenti sommati), $10^{36}$ (moltiplicati), $5$ secondi.
- cifre (45 su 100): "Un programma prova $10^{3}$ combinazioni al secondo e, nel caso peggiore, impiega $10^{5}$
  secondi per provare tutti i codici numerici di una certa lunghezza. Quante cifre ha il codice?" Risposta: 8 cifre.

## Livello 5: la difesa giusta

- pericolo (55 su 100): una situazione per ognuna delle quattro strade della tabella della lezione, e la difesa che la
  ferma. Opzioni fisse: Una password che non si può prevedere; Una password lunga; Una password diversa per ogni
  account; L'attenzione e un secondo fattore.
- due fattori (45 su 100): "Quale di queste coppie di prove è una vera autenticazione a due fattori?" Una coppia di
  tipo diverso (Password e codice generato dall'app sul telefono) e tre che non lo sono: due cose che sai (Password e
  domanda segreta), due cose che hai, due cose che sei, oppure Nome utente e password.

## Livello 6: le abitudini che contano

Undici situazioni con un nome estratto, la cosa giusta e quattro sbagliate (se ne mostrano tre): il codice chiesto
"dall'assistenza", il computer del laboratorio, l'amico che chiede la password, il furto di dati con la stessa
password su tre account, la domanda di recupero, cambiare la password senza motivo, le decine di account, da quale
account partire con i due fattori, quale password scegliere, il telefono senza codice, il sito che rispedisce la
password.

## Esercizi da evitare

- Conti che chiedono la calcolatrice (confronti tra potenze con base ed esponente che vanno in direzioni opposte).
- Base uguale all'esponente ($10^{10}$), che renderebbe uguali due opzioni.
- Numeri di tentativi al secondo di macchine reali, o procedure per indovinare una password.

## Verifica

`password_sicure.py` conta i caratteri dagli insiemi che il testo nomina (26, 26, 10 e i simboli dichiarati), legge
la lunghezza dal testo e ricalcola $k^n$, $k^m$ e gli esponenti delle potenze di dieci; nel confronto calcola i
quattro numeri esatti e controlla anche che la risposta vinca su base ed esponente insieme. Una coppia di prove è a
due fattori se i tipi delle due prove, presi dalla sua tabella, sono due. Le situazioni dei livelli 1, 5 e 6 hanno le
loro tabelle.

## Domande per la revisione

- Livello 1: il nome utente come quarta risposta ("nessun fattore") e il codice ricevuto per messaggio come "qualcosa
  che hai". Va bene?
- Livello 2: gli alfabeti con i simboli dichiarano nel testo quanti sono (8, 18, 28, 38), perché la lezione non dà un
  numero. Va bene, o si preferisce fermarsi a 62?
- Livello 5: "Chiavetta di sicurezza e codice generato dall'app" (due cose che hai) è tra le coppie sbagliate.
