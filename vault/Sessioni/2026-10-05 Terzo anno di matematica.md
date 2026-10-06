---
aggiornato: 2026-10-05
tag: [sessione, contenuti, matematica]
---
# Terzo anno di matematica

Sessione del 5 ottobre 2026. Alessandro ha chiesto di passare al terzo anno di matematica, se il biennio delle quattro materie era completo. Lo era, e il lotto del terzo anno è scritto e verificato: 25 lezioni con note, formulari, flashcard e generatori di esercizi. Non è pubblicato né committato: aspetta il via libera di Alessandro.

## Il biennio era completo
Controllato sul database di produzione e sul codice: ogni lezione del biennio ha teoria, formulario, flashcard ed esercizi collegati in `src/lib/exercises/config.ts`. Sono 104 lezioni di matematica, 70 di fisica, 39 di chimica e 64 di informatica, 277 in tutto, con 5.125 flashcard e 1.619 livelli di esercizi. Il controllo guarda la presenza dei contenuti, non la loro qualità.

## Cosa si è fatto
- Brief del lotto: `docs/lezioni/brief-terzo-anno.md`, con i confini tra le lezioni e le due fasi (lezioni, poi generatori).
- Le 25 lezioni del terzo anno aggiunte a `docs/lezioni/originali/index.json`: sono i file 105-129.
- Sette gruppi in parallelo, uno per capitolo o mezzo capitolo:
  - Funzioni e loro proprietà: 105-109
  - Successioni e progressioni: 110-113
  - Circonferenza e parabola: 114-117
  - Ellisse e iperbole: 118-120
  - Esponenziali: 121-123
  - Logaritmi: 124-127
  - Statistica bivariata: 128-129
- Ogni lezione ha testo, nota, formulario e flashcard, poi specifica, generatore e controllo Python indipendente.
- I 25 generatori sono collegati al sito: `index.ts`, `config.ts`, `level-names.ts` e `v2/open-answers.ts`.
- Il terzo anno è nel grafo dei prerequisiti (`docs/lezioni/prerequisiti.md`): 129 lezioni, nessun ciclo, nessun arco ridondante.

## Numeri
- 25 lezioni, circa 586.000 caratteri, 124 figure TikZ, 79 piani con i cursori (blocchi `grafico`), 482 flashcard, dopo il secondo passaggio (prima: 514.000, 106 e 40).
- 25 generatori, 169 livelli; 20 generatori hanno livelli a risposta aperta.

## Cosa si è deciso mentre si scriveva
- Le coordinate dei punti si scrivono con la virgola, $P(2, -3)$, come nelle lezioni 80-87, e le non intere come frazioni. Il brief chiedeva per errore il punto e virgola: corretto a metà lavoro e convertito in tutte le lezioni. Il punto e virgola resta solo dentro i blocchi `grafico`, dove è la sintassi del plotter.
- La 107 fissa le parole per tutto il terzo anno: "crescente" e "decrescente" sono in senso stretto, "in senso lato" o "non decrescente" per l'altro, "monotona" comprende i due casi.
- Le successioni partono da $a_1$. Niente simbolo di sommatoria. Niente limiti: la somma infinita di una progressione geometrica è in un riquadro.
- $\ln x$ per la base $e$ e $\log x$ per la base 10.
- Ellisse e iperbole tengono sempre $a$ sotto $x^2$ e $b$ sotto $y^2$, anche con i fuochi sull'asse $y$.
- Le equazioni e disequazioni esponenziali che chiedono un logaritmo stanno nella 126 e nella 127; la 122 e la 123 rimandano lì.
- Funzioni periodiche (108) viene prima della goniometria: usa grafici dati, parte intera e parte frazionaria.

Sono scelte di chi ha scritto, da confermare con Andrea: vedi [[Domande per Andrea]].

## Verifiche
- `check.mts` su lezioni, formulari e flashcard: 75 file, nessun errore.
- Ogni conto delle lezioni rifatto con SymPy dai gruppi (oltre 500 controlli negli script dei gruppi). Ogni figura guardata in chiaro e in scuro nelle anteprime.
- Ogni generatore: 1000 esercizi per livello con i seed 1, 50001 e 777001 dai gruppi, errori piantati bocciati; poi tutti insieme con un quarto seed, 300 per livello: tutti passano.
- `open-answers.mts` esce con 0; `grade-check.mts` con 100 campioni per livello: nessun fallimento nei 20 generatori con risposta aperta.
- `tsc` senza errori, test unitari 675 su 675, ESLint pulito sui file del lotto.
- Nel browser, in sviluppo, a 390 px: le 25 lezioni su `/prova-grafico/lezione` senza errori di KaTeX, immagini mancanti o scorrimento laterale, con 40 bottoni "Prova tu"; 507 pagine di esercizi su `/prova-grafico/esercizio` (ogni livello con due seed, più la risposta aperta) senza errori.
- I gruppi hanno mosso i cursori dei piani di 105-120 e della 129; quelli di 121-127 (12 piani) sono stati solo aperti.

## Corretto durante le verifiche
- I livelli 6 e 7 di `equazioni-logaritmiche` avevano una risposta aperta con un logaritmo, che il correttore non legge: ora sono a scelta multipla.
- Nella 116 "il fuoco sta a distanza $\frac{1}{4a}$ dal vertice" era falso con $a < 0$.
- Nell'esempio 4 della 129 i dati della palla non venivano da un moto vero: ora è $h = 20t - 5t^2$.
- Sei piani di 118-120 erano fuori dal riquadro dell'esempio e restavano senza copertina.

## Secondo passaggio: più piani con i cursori
Alessandro ha chiesto, la sera del 5 ottobre, un altro passaggio sulle lezioni: il terzo anno getta le basi dello studio di funzione, ed è il punto giusto per mettere più piani con i parametri giusti, senza esagerare. Il suo esempio: $a^x$ con il cursore $a$, crescente, costante nel caso limite $a = 1$, decrescente. La regola è la "Fase 3" di `docs/lezioni/brief-terzo-anno.md`.

- I piani passano da 40 a 79, in 23 lezioni su 25; le figure TikZ da 106 a 124, perché ogni piano nuovo ha la sua copertina. Restano senza piani la 113 (un piano mostrerebbe i primi casi, e la lezione dice che i primi casi non dimostrano) e la 128 (tabelle e barre, nessuna curva da muovere).
- Ogni piano, nuovo o vecchio, ha una domanda con una risposta precisa e subito dopo il paragrafo che la dà; i casi limite sono nominati ($a = 1$, $k = 0$, $\Delta = 0$, $r = 0$).
- Al massimo cinque piani per lezione: ci arrivano le 114-117 e la 125.
- I gruppi hanno aperto ogni piano nuovo o cambiato a 390 px, ai valori iniziali, agli estremi e nei casi limite. Dopo il passaggio: `check.mts` senza errori sui 75 file, le 25 lezioni nel browser senza errori di KaTeX né scorrimento laterale, 79 bottoni "Prova tu" per 79 piani.
- La 129 è salita a 34.000 caratteri.

Limiti del blocco `grafico` emersi, da decidere se correggere nel plotter:
- con $a = 1$ la zona di $\log_a x > c$ resta colorata senza la curva: nella 127 è aggirato scrivendo la formula come $\log_a x \cdot \log_a a$, che lo studente non vede;
- $\frac{k}{x}$ con $k = 0$ viene disegnata anche in $x = 0$, e il punto tolto da un grafico non è segnato (105, 107): il testo lo dice;
- `assi:` e i nomi dei `valore:` non leggono LaTeX; la lettera `e` è riservata al numero di Nepero, quindi l'eccentricità si chiama $E$.

Quello che il blocco non sa fare e che i gruppi avrebbero usato, in ordine di richieste: un punto da trascinare sulla curva (luogo geometrico, tangente, simmetrico), punti liberi da trascinare (circonferenza e parabola per tre punti, tangenti da un punto esterno), le soluzioni come segmento sull'asse $x$, segmenti e aree colorate, due zone insieme, punti in numero variabile per le successioni. I punti isolati di una successione si possono già fare come punti fermi con le coordinate legate al cursore.

I gruppi hanno anche elencato, per ogni lezione, gli esercizi "dalla funzione al grafico" e "dal grafico alla funzione" con l'errore che ogni grafico sbagliato rappresenta, e l'esempio svolto più adatto a diventare un esercizio guidato con due o tre fermate: sono riportati in forma abbreviata nelle due idee registrate lo stesso giorno, [[Esercizi con i grafici]] ed [[Esercizio guidato nelle lezioni]]; quello che è mancato al blocco è in [[Piano cartesiano nelle lezioni]].

## Da sapere prima di pubblicare
- `scripts/lezioni/publish.mts` non ha un filtro. Nella cartella ci sono anche 24 lezioni del biennio con piani aggiunti da un'altra sessione ([[2026-10-05 Strumenti nelle lezioni]]) e non ancora pubblicati: un `--apply` adesso pubblicherebbe anche quelle. Serve un filtro per numero, oppure pubblicare tutto insieme d'accordo con l'altra sessione.
- L'ordine: prima il codice dei generatori su master e in produzione, poi le lezioni. Dopo la pubblicazione, `prerequisiti.mts --write` e `node scripts/grafo/layout.mjs`, che leggono `pubblicate/`.
- Le lezioni del biennio non rimandano ancora alle nuove (43, 80, 87, 91, 93, 104).

## Limiti
- Nessun esercizio mostra un grafico: funzioni, coniche e statistica lavorano su testo, formule e punti.
- Il correttore della risposta aperta non conosce i logaritmi.
- Le disequazioni sono solo a scelta multipla, come nel biennio.
- Restano senza esercizio alcuni esempi delle lezioni (tangenti da un punto esterno a ellisse e iperbole, asse radicale, basi diverse nelle equazioni esponenziali e logaritmiche): gli elenchi sono nelle specifiche.
- Fatti storici a memoria nelle note della 110 e della 113 (Eulero, Peano, Gauss): da verificare.
- Niente provato su un telefono vero, su Safari o su Firefox.

## Prossimo argomento
Il via libera di Alessandro per commit, PR e pubblicazione. Poi il quarto anno di matematica (23 lezioni: goniometria, trigonometria, numeri complessi, calcolo combinatorio, probabilità, geometria dello spazio).

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Programma ministeriale]], [[Piano cartesiano nelle lezioni]]
- [[2026-09-28 Decimo lotto, geometria del secondo anno]], [[2026-09-27 Dopo la matematica delle superiori le altre materie, poi le medie]]
