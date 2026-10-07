# Note: Le stringhe

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Vettori, matrici e stringhe"). Non pubblicata.

## Struttura

Apertura con i testi che lo studente scrive ogni giorno; la stringa come fila di caratteri con gli indici, la
lunghezza, il primo e l'ultimo carattere; scorrere con un ciclo (contare le vocali, con la figura e una funzione
`vocale`); costruire una stringa con la concatenazione (rovesciare una parola); confrontare (richiamo alla 56) e
la parola palindroma con due indici, con la figura; le operazioni già pronte (tabella, e un programma che divide un
indirizzo di posta); due esercizi.

- 393 righe; circa 1310 parole di testo, riquadri compresi.
- Programmi da eseguire: 5 (lunghezza e caratteri; vocali; parola rovesciata; palindroma; `find` e sottostringhe),
  ciascuno in Python e in C++.
- Esercizi con le prove: 2 (le iniziali di nome e cognome; un asterisco al posto di ogni vocale).
- Figure interattive: 2. Nessun diagramma di flusso e nessuna figura TikZ.
- Riquadri `ad-warning`: 3. Riquadri `ad-note`: 2. Tabelle: 1.

## Elementi interattivi

| Nome | Tipo | Domanda a cui risponde |
|---|---|---|
| `inf-stringa-vocali` | figura del kit a passi (`Celle` unite come in `Stringa`, `Legenda`, `Frase`, `Contatori`, `ComandiPassi`) più un campo per la parola | Quanti giri fa il ciclo su "informatica", e in quanti il contatore cambia? Il testo dopo risponde: 11 giri, 5 vocali. |
| `inf-stringa-palindroma` | la stessa figura con due indici, `i` sotto e `j` sopra | Quanti confronti servono per una parola di 7 lettere, e quanti se una coppia è diversa? Il testo dopo risponde: 3 per "ossesso", 2 per "ossuto", al più metà della lunghezza. |
| programmi `codice` | cinque programmi nei due linguaggi | Dopo ognuno il testo dice che cosa provare: "Anna Maria", "Aiuola", il ciclo in avanti con i pezzi scambiati, "Anna", l'indirizzo senza chiocciola. |

## Confini decisi

- La codifica dei caratteri è richiamata in una frase con il link alla lezione 10; il confronto tra stringhe in una
  frase con il link alla 56, che lo ha già spiegato (compreso il riquadro sul C++ e i testi tra virgolette).
- Il tipo `char` del C++ compare in un riquadro e nella funzione `vocale(char c)`: senza non si può scrivere il
  confronto con un carattere. I codici dei caratteri come numeri (`ord`, `chr`, `int(c)`), il cifrario di Cesare e
  la conversione tra maiuscole e minuscole fatta con i codici non ci sono.
- Le funzioni compaiono una volta (`vocale`), come nel capitolo precedente. La stringa passata a una funzione non è
  discussa: in C++ viene copiata, a differenza del vettore, e sarebbe un'altra eccezione da spiegare.
- `split`, `join`, le f-string e `stringstream` non ci sono: `split` è della lezione 80.
- Gli indici negativi di Python e `parola[::-1]` non ci sono. Il generatore di esercizi chiede un ciclo proprio
  perché `[::-1]` non passi.

## Scelte che il brief non fissava

- Il ciclo sulla stringa usa sempre l'indice, `for i in range(n)`, come la 70. `for c in parola` non è presentato.
- In C++ la lunghezza va in una variabile `int n = parola.length();` prima del ciclo: così il confronto `i < n` è
  tra due `int`, e `n - 1` non dà sorprese con la stringa vuota (`length()` è senza segno).
- `int p = indirizzo.find("@");` in C++: assegnato a un `int`, il valore "non trovato" diventa $-1$ come in Python.
  `string::npos` non è nominato.
- La palindroma si ferma alla prima coppia diversa, con `while i < j and palindroma` e l'`else` che avvicina gli
  indici: è lo stesso schema della ricerca che si ferma nella 71, e corrisponde passo per passo alla figura.
- Nelle prove degli esercizi le parole sono senza spazi e senza accenti.

## Verifiche

- `check.mts`: nessun errore e nessun avviso su lezione, formulario e flashcard (20 carte).
- `verifica.mts`: le soluzioni dei due esercizi superano le prove in Python e in C++.
- I cinque programmi senza prove eseguiti con `python3` e con `clang++ -std=c++17 -Wall`: stesse uscite.

## Da verificare

- "Una lettera accentata occupa due byte": vale per UTF-8, che è la codifica dei sorgenti e della console
  dell'editor del sito e di quasi tutti i sistemi di oggi. Con una console di Windows in un'altra codifica il
  numero può essere diverso. Non provato sul Clang del sito con una parola accentata letta da tastiera.
- `"Hai " + eta` in C++ "compila e stampa un testo sbagliato": provato sul Mac (Clang avvisa con `-Wall`, e il
  programma scrive un pezzo del testo o caratteri a caso). Per la norma è un accesso non definito quando il numero
  supera la lunghezza del testo.
- `nome[n]` in C++ su una `string` dà il carattere di fine stringa, che non si vede: è definito dalla norma dal
  C++11 (fonte: cppreference, `std::basic_string::operator[]`, da verificare la data di consultazione). Oltre `n`
  non è definito.

## Domande per Andrea

- In classe le stringhe del C++ sono `string`, come qui, o fai vedere anche gli array di `char`?
- Preferisci il ciclo con l'indice anche in Python, o `for c in parola` quando l'indice non serve?
- La conversione in maiuscolo carattere per carattere (`toupper`) e i codici dei caratteri (`ord`, `chr`) meritano
  un paragrafo, magari con il cifrario di Cesare come esempio?
- Per la palindroma va bene la versione con i due indici, o preferisci "rovescia e confronta" come versione
  principale?

Prerequisiti proposti: inf-vettori, inf-parametri-ritorno, inf-contatori-accumulatori, inf-codifica-caratteri

## Revisione del lotto (7 ottobre 2026)

- "`find` non trova niente e dà -1" è diventato "nella variabile finisce -1" (in C++ `find` restituisce `string::npos`); la domanda prima della figura dei palindromi chiedeva della "prima coppia" diversa, mentre in "ossuto" è la seconda.
