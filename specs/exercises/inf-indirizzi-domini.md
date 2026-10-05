# inf-indirizzi-domini: Indirizzi IP e nomi di dominio

Generatore: `src/lib/exercises/v2/generators/inf-indirizzi-domini.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-web1.ts`. Verifica indipendente: `scripts/exercises/checkers/inf_indirizzi_domini.py`.
Lezione: `docs/lezioni/informatica/riscritte/35-inf-indirizzi-domini.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`answer.kind = 'choice'`). I campioni sono testo
semplice (`format: 'text'`). La `solution` è sempre il testo dell'opzione giusta, e `params.case` dice il caso.

Indirizzi e nomi si costruiscono all'indietro dai loro pezzi, e sono solo quelli riservati agli esempi: `192.0.2.x`,
`198.51.100.x`, `203.0.113.x`, `2001:db8::`, i nomi sotto `.example` e `esempio.it`.

Un URL o un nome lungo, nel testo e nelle opzioni, ha uno spazio di larghezza zero dopo ogni punto, perché sul telefono
possa andare a capo. Il valore dell'opzione (`values`) e il testo letto ad alta voce (`text`) non lo hanno.

## Livello 1: riconoscere un indirizzo IP

- `valido` (4 su 10): "Quale di queste scritture è un indirizzo IPv4?" Un indirizzo e tre scritture sbagliate, ognuna
  con un difetto diverso tra: un numero più grande di 255 (spesso proprio 256, l'avviso "Il massimo è 255, non 256"),
  tre numeri, cinque numeri, virgole al posto dei punti.
- `non valido` (4 su 10): "Quale di queste scritture non è un indirizzo IPv4?" Una scrittura sbagliata e tre indirizzi.
  L'ultimo numero degli indirizzi giusti è spesso 0 o 255, i due valori di cui gli studenti dubitano.
- `ipv6` (2 su 10): "Quale di queste scritture è un indirizzo IPv6?" Risposta: `2001:db8::` seguito da cifre
  esadecimali. Distrattori: un indirizzo IPv4, lo stesso con i due punti al posto dei punti, un indirizzo IPv6 scritto
  con i punti.

Esempio: "Quale di queste scritture non è un indirizzo IPv4?" Opzioni: 192.0.2.256; 192.0.2.43; 198.51.100.0;
203.0.113.167. Risposta: 192.0.2.256.

## Livello 2: i byte di un indirizzo

- `da binario` (4 su 10): "In binario un indirizzo IPv4 è 11000000 00000000 00000010 10010100. Come si scrive in base
  dieci?" Risposta: 192.0.2.148. I distrattori cambiano solo l'ultimo numero.
- `in binario` (4 su 10): "Nell'indirizzo 198.51.100.21, come si scrive in binario, su 8 bit, il terzo numero?" Mai il
  numero 0.
- `bit` (2 su 10): "Nell'indirizzo 192.0.2.45, quanti bit occupano i primi tre numeri?" Risposta: 24 bit. Distrattori:
  il numero dei numeri, 4 bit per numero, un byte in più o in meno, 10 bit per numero, 256.

I distrattori dei primi due casi sono gli errori di conversione: i bit letti al contrario, tutti spostati di un posto,
il primo bit perso, il valore più uno.

## Livello 3: quanti indirizzi con n bit

- `quanti` (3 su 10): "Una rete usa indirizzi di 6 bit. Quanti indirizzi diversi si possono scrivere?" Con n tra 2 e
  12, oppure 16. Risposta: $2^n$. Distrattori: $2n$, $n^2$, $2^n - 1$, la metà, il doppio.
- `massimo` (3 su 10): "Gli indirizzi di una rete sono numeri di 7 bit, contati a partire da 0. Qual è il più grande?"
  Risposta: $2^n - 1$. Distrattori: $2^n$ (l'errore dell'avviso), $2^n + 1$, la metà.
- `bit` (4 su 10): "Una rete deve dare un indirizzo diverso a 21 dispositivi. Quanti bit deve avere, come minimo, un
  indirizzo?" Il numero dei dispositivi sta tra $2^{n-1} + 1$ e $2^n$, con n tra 3 e 10. Risposta: n. Distrattori: un
  bit o due in più o in meno.

## Livello 4: i livelli di un nome di dominio

Un nome di quattro parti, tutte diverse: `orario.classi.scuola.example`. Si chiede il dominio di primo livello, di
secondo livello, di terzo livello, oppure "quale parte è il nome che il proprietario ha registrato?" (la seconda da
destra). Un quarto ciascuno. Le opzioni sono le quattro parti: chi conta da sinistra sbaglia.

Esempio: "Nel nome di dominio foto.gite.comune.example, qual è il dominio di secondo livello?" Risposta: comune.

## Livello 5: di chi è il sito

L'avviso "Chi è il proprietario si legge a destra". Due casi, metà ciascuno:

- `inganno`: "Un messaggio ti invita a entrare nel sito www.esempio.it.servizio-avvisi.example. Quali sono le due parti
  che dicono chi ha registrato il nome?" Risposta: servizio-avvisi.example. Distrattori: il nome conosciuto che sta a
  sinistra (esempio.it), le prime due parti, due parti prese nel mezzo.
- `stesso`: "Chi ha registrato squadra.example è il proprietario di uno solo di questi nomi. Quale?" Risposta:
  registro.squadra.example. Distrattori: nomi che contengono la stessa parola ma finiscono in un altro modo
  (squadra.example.servizio-avvisi.example, squadra.esempio.it, registro.squadra.servizio-avvisi.example).

## Livello 6: il DNS

- `guasto` (4 su 10), dedotto da che cosa funziona, come nell'esempio 4:
  - nessun sito si apre scrivendo il nome, ma funziona un servizio raggiunto con l'indirizzo IP: il server DNS non
    risponde;
  - non funziona neanche quello: il collegamento a Internet è interrotto;
  - tutti i siti si aprono tranne uno, scritto con una lettera sbagliata: il DNS traduce solo nomi esatti (l'avviso "Il
    DNS non è un motore di ricerca").
  La quarta opzione, sempre sbagliata: i siti hanno cambiato indirizzo IP.
- `passi` (4 su 10): i quattro passi della figura, con il nome e l'indirizzo dell'esercizio: "Quale passo viene subito
  dopo questo?" (o subito prima).
- `cambio` (2 su 10), dall'esempio 3: il sito cambia server e indirizzo, "Che cosa deve fare chi visita il sito?"
  Risposta: niente. Distrattori: scrivere il nuovo indirizzo, imparare un nome nuovo, cambiare fornitore di accesso.

## Da evitare

- Indirizzi e nomi veri: niente prefissi diversi dai tre degli esempi, niente nomi sotto `.it`, `.com`, `.org` che
  non siano `esempio.it`.
- Al livello 4, l'opzione di due parti (`scuola.example`) accanto a `scuola`: la lezione chiama "nome registrato" ora
  l'una ora l'altra.
- Al livello 5, i domini in cui le parti fisse sono due (`.edu.it`): sono una nota della lezione, non la regola.
- Indirizzi IPv6 in forma lunga tra le opzioni, e domande su indirizzi statici e dinamici con una sola riga di testo
  nella lezione.

## Verifica

`scripts/exercises/checkers/inf_indirizzi_domini.py` ricalcola ogni risposta dal testo della domanda: al livello 1
chiede al modulo `ipaddress` di Python quali scritture sono indirizzi; al livello 2 converte i byte; al livello 3
calcola le potenze di due; ai livelli 4 e 5 divide il nome ai punti e conta le parti da destra; al livello 6 conosce
l'ordine dei passi e deduce il guasto dalle due osservazioni. Controlla anche che indirizzi e nomi siano quelli
riservati agli esempi, le quattro opzioni, la soluzione e la quota dei casi.

## Domande per la revisione

- Livello 2: la conversione di un byte tra binario e base dieci viene dal primo anno. Va bene chiederla qui, o il
  livello deve restare sui soli conti dei bit?
- Livello 4: i nomi hanno quattro parti, la lezione ne mostra tre. "Dominio di terzo livello" è la terza parte da
  destra anche quando a sinistra ce n'è un'altra?
- Livello 1: riconoscere un indirizzo IPv6 (solo nella forma abbreviata `2001:db8::…`) è materia di esercizio?
