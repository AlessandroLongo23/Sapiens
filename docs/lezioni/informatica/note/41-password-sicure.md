# Note: Password e autenticazione

Lezione nuova, scritta da zero (secondo anno, capitolo "Sicurezza e cittadinanza digitale", 5 ottobre 2026). 148 righe, due figure, tre esempi, nessun programma. `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard.

## Struttura

Identificazione e autenticazione; i tre fattori (figura); le quattro strade per cui una password si perde, ognuna con la sua difesa; il conto $N = k^n$ con due esempi e la figura a barre; la frase d'accesso; una password per ogni account e il gestore; come un sito conserva le password (nota, solo l'idea); l'autenticazione a due fattori; sei abitudini con il motivo; un esempio su che cosa fare dopo un furto di dati.

## Conti

Rifatti con Python (`k**n`):

- $10^4 = 10\,000$.
- $26^8 = 208\,827\,064\,576 \approx 2{,}1 \cdot 10^{11}$; a $10^9$ tentativi al secondo sono 209 s, circa 3 minuti e mezzo.
- $62^8 = 218\,340\,105\,584\,896 \approx 2{,}2 \cdot 10^{14}$; 218 340 s, cioè 2,53 giorni.
- $26^{12} = 95\,428\,956\,661\,682\,176 \approx 9{,}5 \cdot 10^{16}$; 3,03 anni.
- $26^{12} : 62^8 \approx 437$, nel testo "circa 400 volte".
- $26^4 = 456\,976$.
- $2000^5 = 3{,}2 \cdot 10^{16}$.
- Nella figura la lunghezza delle barre è il logaritmo in base dieci: 4; 11,32; 14,34; 16,98.

## Scelte

- Il conto è il centro della lezione. La velocità di $10^9$ tentativi al secondo è un'ipotesi dichiarata ("supponi che"), non un dato: serve a trasformare le combinazioni in un tempo. Le velocità vere dipendono da come il sito conserva le password e cambiano ogni anno.
- La lezione non spiega come si conduce un attacco: dice quali strade esistono e quale difesa risponde a ognuna.
- Funzioni hash: solo l'idea di "impronta da cui non si torna indietro", in una nota, con il rimando al quinto anno. La parola "hash" non compare. Il quinto anno non si può linkare, quindi niente link.
- Notazione scientifica: usata ($2{,}1 \cdot 10^{11}$) accanto a "circa". In `docs/lezioni/url.md` non c'è una lezione di matematica sulla notazione scientifica; il link va solo a "Potenze in N".
- La figura a barre è in scala logaritmica, senza la parola: il testo dice che ogni passo verso destra moltiplica per dieci.
- Il consiglio di non cambiare le password a scadenza fissa segue le linee guida NIST SP 800-63B (2017, confermate nella revisione 4 del 2025). Molte scuole e molti libri dicono ancora di cambiarle ogni tre mesi: la lezione li contraddice apertamente.
- Passkey: non ci sono. Sono una tecnologia recente e i nomi cambiano; da decidere se aggiungere una riga.
- Nessun nome di prodotto.

## Fonti e cose da verificare

Niente è stato controllato su una fonte esterna, tranne i conti.

- NIST SP 800-63B, "Digital Identity Guidelines: Authentication and Lifecycle Management" (2017; revisione 4, 2025): lunghezza prima della complessità, niente cambio periodico senza motivo, niente domande di recupero. Da verificare sul testo.
- I tre fattori (sai, hai, sei): classificazione standard, anche in NIST SP 800-63. Da verificare.
- "Il gestore le conserva cifrate" e "i browser e i telefoni di oggi ne hanno uno incluso": vero per i principali browser e per iOS e Android. Da verificare.
- "Un PIN regge perché il telefono o la carta si bloccano dopo pochi tentativi": le carte di pagamento si bloccano dopo tre tentativi, i telefoni allungano l'attesa. Il testo non dà numeri.
- L'elenco di 2000 parole è un numero comodo per il conto. Gli elenchi usati davvero sono più lunghi (Diceware: 7776 parole). Da decidere se usare 7776, che dà un conto meno pulito.
- "L'impronta copiata non si può sostituire": argomento corrente; sui telefoni l'impronta resta nel dispositivo e non viene spedita ai servizi. Il testo non entra nel dettaglio.

## Figure

- `fattori-di-autenticazione`: tre riquadri affiancati con gli esempi sotto.
- `combinazioni-password-a-confronto`: quattro barre su un asse in potenze di dieci.

Guardate in chiaro e in scuro: nessuna correzione.

## Domande per Andrea

- Il conto con le potenze e la notazione scientifica è alla portata di una seconda a ottobre-novembre, quando si fa questo capitolo?
- Va bene contraddire il consiglio "cambia la password ogni tre mesi"?
- Aggiungere le passkey?
- Vuoi un programma Python da eseguire che calcola `k**n`? Il capitolo è senza programmazione e i blocchi `codice` arrivano con la lezione 52, quindi non l'ho messo.
