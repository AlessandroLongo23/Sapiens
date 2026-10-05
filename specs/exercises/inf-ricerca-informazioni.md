# inf-ricerca-informazioni: Cercare e valutare le informazioni in rete

Generatore: `src/lib/exercises/v2/generators/inf-ricerca-informazioni.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-web2.ts` e di `inf-programmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/inf_ricerca_informazioni.py` (aiuti in `_inf_web2.py`). Lezione:
`docs/lezioni/informatica/riscritte/38-inf-ricerca-informazioni.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`format: 'text'`, `answer.kind = 'choice'`). Gli
operatori di ricerca sono la struttura della lezione: il livello 3 li fa scrivere, il livello 4 li fa leggere su
pagine descritte, e il controllo esegue la ricerca da sé.

## Regole comuni

- Domini inventati (`universita.example`, `scuola.example`, `comune.example`, `museo.example`,
  `biblioteca.example`), autori ed enti inventati ("M. Verdi", "Università di Esempio"). Nessun marchio, nemmeno
  per i motori di ricerca e le enciclopedie.
- Una ricerca dentro una frase sta tra virgolette basse («giaguaro -auto»); le parole di una pagina anche.
- `params.case` dice il caso; `solution` è il testo dell'opzione giusta; `steps` ha due frasi.

## Livello 1: come lavora un motore di ricerca

- `fase` (circa metà): un lavoro descritto su un argomento tra dieci, e la sua fase. Opzioni fisse: Esplorazione,
  Indicizzazione, Ordinamento, "Nessuna: è un lavoro che resta a te". Tre descrizioni per fase; le tre che restano
  a chi cerca sono decidere se una pagina dice il vero, scegliere le parole chiave, controllare chi ha scritto.
  Esempio: "Il motore registra in un elenco, parola per parola, in quali pagine sulla raccolta differenziata compare
  ciascuna." Risposta: Indicizzazione.
- `vera`, `falsa` (circa un quarto ciascuna): otto affermazioni vere e otto false sui motori. Le false sono gli
  errori dei riquadri: il primo risultato è il più affidabile, l'ordine è una classifica di verità, il motore legge
  il web al momento, ogni pagina compare.

## Livello 2: dalla domanda alle parole chiave

"Per una ricerca vuoi sapere perché i ghiacciai delle Alpi si stanno riducendo. Che cosa conviene scrivere nel
motore?" Giusta: le parole chiave precise (`ritiro ghiacciai alpini cause`), da tre a cinque parole senza articoli
né parole di domanda. Distrattori, tre tra cinque:

- la domanda intera con il punto interrogativo;
- la richiesta cortese ("vorrei sapere…");
- parole di tutti i giorni al posto dei termini precisi ("ghiaccio che sparisce in montagna");
- una parola sola;
- le parole sul compito e non sulla pagina ("ghiacciai ricerca per la scuola").

Sedici domande. Il controllo guarda come è scritta ogni opzione e che le parole giuste contengano il termine
preciso della sua tabella.

## Livello 3: scrivere la ricerca con un operatore

Un bisogno e quattro ricerche scritte; cinque operatori, un quinto ciascuno.

- `frase`: di un testo ricordi solo alcune parole e le vuoi nello stesso ordine. Giusta: `"chi dorme non piglia
  pesci"`. Sbagliate: senza virgolette, le parole unite da OR, con `site:`, con il meno davanti.
- `meno`: cerchi una cosa e i risultati parlano di un'altra. Giusta: `giaguaro animale -auto`. Sbagliate: il meno
  staccato (`- auto`), la parola tra virgolette, OR, "non", il meno sulla parola sbagliata.
- `sito`: solo le pagine di un sito. Giusta: `menu mensa site:scuola.example`. Sbagliate: il dominio da solo, tra
  virgolette, con `filetype:`, con il meno, `site:` con lo spazio.
- `formato`: solo i documenti PDF. Giusta: `ghiacciai alpini filetype:pdf`. Sbagliate: `pdf` da solo, `site:pdf`,
  tra virgolette, con il meno, con OR.
- `oppure`: l'una o l'altra di due parole. Giusta: `moto OR motocicletta`. Sbagliate: le due parole da sole, tra
  virgolette, con il meno, con `site:`, con `filetype:`.

Controllo: ogni opzione viene letta da un piccolo lettore di ricerche (parole, frasi, parole escluse, sito,
formato, gruppi con OR; un operatore scritto male non è una ricerca) e confrontata con la ricerca che il bisogno
in `params` richiede. Due scritture della stessa ricerca contano come uguali.

## Livello 4: che cosa trova una ricerca

Una ricerca e quattro pagine descritte; una sola viene trovata. Sei casi, un sesto ciascuno: `meno`, `frase`,
`sito`, `formato`, `due` (meno e `site:` insieme), `oppure` (con OR si chiede la sola pagina che non viene
trovata).

Una pagina è scritta sempre allo stesso modo: "Una pagina" oppure "Un file PDF", il sito se serve, le parole che
ha, e quelle che non ha. Esempio: "Quale di queste viene trovata dalla ricerca «calcio -sport
site:scuola.example»?" Opzioni: una pagina di museo.example con «calcio», senza «sport»; una pagina di
scuola.example con «calcio» e «sport»; una pagina di scuola.example con «calcio», senza «sport» (giusta); una
pagina di scuola.example con «sport», senza «calcio».

Le pagine sbagliate violano ciascuna una condizione: hanno la parola esclusa, stanno su un altro sito, non sono un
PDF ma contengono la parola «pdf», nominano il sito senza starci, hanno le parole della frase in punti diversi.

Controllo: la ricerca e le pagine si leggono dal testo e la ricerca viene eseguita sulle pagine.

## Livello 5: le quattro domande su una fonte

- `domanda` (circa 6 su 10): il difetto di una pagina su un argomento, e quale delle quattro domande lo scopre.
  Opzioni fisse: Chi scrive? Quando? Con quali prove? Perché? Tre difetti per domanda. Esempio: "Una pagina sui
  ghiacciai alpini riporta dei numeri senza dire a quale anno si riferiscono." Risposta: Quando?
- `motivo`, `non motivo`: un buon motivo per fidarsi tra tre che non lo sono, o il contrario. I cattivi motivi sono
  quelli del riquadro: grafica curata, lucchetto, primo risultato, condivisioni, nome ufficiale, molte copie, tono
  sicuro.

## Livello 6: confrontare e citare le fonti

- `indipendenti` (circa 35 su 100): un conto. "Trovi il dato su 4 siti che riportano la stessa frase con le stesse
  parole, copiata da un vecchio articolo, e su un altro sito, che ha raccolto il dato per conto suo. Quante fonti
  indipendenti hai?" Le copie (da 3 a 9) valgono una fonte, gli altri siti (da 1 a 3) una ciascuno. Distrattori:
  tutti i siti contati, solo le copie, solo gli altri.
- `citazione` (circa 25 su 100): una citazione con quattro dei cinque elementi (autore, titolo, nome del sito,
  indirizzo, data di consultazione), e quale manca. Il controllo divide la citazione e riconosce ogni elemento.
- `vera`, `falsa`: nove affermazioni vere e nove false su fonti indipendenti, fonte primaria, enciclopedie
  collaborative, assistenti artificiali, citazione e plagio.

## Da evitare

- Operatori che la lezione non insegna (`intitle:`, l'asterisco), e ricerche con più di due operatori.
- Pagine descritte in modo che due vengano trovate: ogni pagina dice anche la parola che non ha, dove conta.
- Domande su quale motore o quale enciclopedia usare, e su date o nomi.
- Parole chiave "giuste" discutibili: la versione vaga usa parole di tutti i giorni, mai un sinonimo tecnico.
