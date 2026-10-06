# Note: Valenza e numero di ossidazione

Lezione nuova (6 ottobre 2026), terzo anno, capitolo "Classificazione e nomenclatura dei composti", prima di sette. Gruppo I del lotto (lezioni 76-79). `check.mts` passa su lezione, formulario e flashcard; resta un avviso, "titolo con maiuscole all'inglese", sul titolo "La notazione di Stock", dove Stock è un cognome.

## Struttura

La valenza, con il suo limite (non ha segno); il numero di ossidazione dalla definizione, con la molecola d'acqua a puntini; le otto regole in ordine di precedenza; gli estremi dal gruppo; il procedimento di calcolo con cinque esempi (binario, ternario, due atomi dello stesso elemento, ioni, eccezioni); la figura interattiva; dai n.o. alla formula con la regola dell'incrocio; le famiglie dei composti; le tre nomenclature, con un esempio.

## Scelte e confini

- Confini dentro il gruppo: la 76 presenta le tre nomenclature una volta sola (suffissi, numeri romani, prefissi, radici), la regola dell'incrocio e lo schema delle famiglie. Le 77, 78 e 79 non le rispiegano: danno la parola della famiglia (ossido, anidride, idruro, acido -idrico, idrossido) e le tabelle dei composti.
- Le regole sono otto e in ordine di precedenza: "quando due regole danno risultati incompatibili, vale quella che viene prima". Così le eccezioni di idrogeno e ossigeno (idruri dei metalli, perossidi, $\mathrm{OF_2}$) non sono casi da ricordare a parte, ma conseguenze dell'ordine. La regola della somma è la terza, perché serve a tutte le altre. I libri di scuola di solito elencano le eccezioni dentro le regole dell'idrogeno e dell'ossigeno.
- Definizione di valenza: "numero di elettroni che un atomo cede, acquista o mette in comune". È la definizione più diffusa nei libri italiani; quella storica (atomi di idrogeno legati) è data subito dopo come modo di leggerla.
- Scrittura: n.o. con il segno davanti ($+3$), carica dello ione con il numero davanti ($\mathrm{Fe^{3+}}$), come nel brief. Abbreviazione "n.o.", usata in tutte e quattro le lezioni.
- Nella regola 5 ci sono anche zinco ($+2$) e argento ($+1$), che i libri mettono tra i valori fissi.
- Regola 8 sugli alogeni limitata ai composti con l'idrogeno e con i metalli, dove è sempre vera.
- Estremi dal gruppo: massimo uguale alla cifra delle unità del gruppo, minimo uguale al gruppo meno 18, con l'eccezione di ossigeno e fluoro. Detto solo per i gruppi principali.
- Nomenclatura, convenzioni (valgono per tutto il gruppo I, e servono al gruppo J):
  - ordine dei tre nomi e colonne delle tabelle come nel brief: Formula, Tradizionale, Stock, IUPAC;
  - Stock: il numero romano si scrive solo se l'elemento ha più di un n.o.; attaccato al nome, senza spazio;
  - IUPAC: prefissi senza elisione della vocale (pentaossido, eptaossido, triidrossido), coerenti con la forma "tetraossosolfato" del brief; il prefisso mono- non si scrive mai, tranne in "monossido" quando gli atomi sono uno a uno e l'elemento ha più di un ossido ($\mathrm{CO}$ monossido di carbonio, $\mathrm{FeO}$ monossido di ferro; ma $\mathrm{CaO}$ ossido di calcio, $\mathrm{Na_2O}$ ossido di disodio, $\mathrm{Cl_2O}$ ossido di dicloro).
- Radici della nomenclatura tradizionale: dieci in tabella. Rame con radice rame- (rameoso, rameico), la forma dei libri di scuola; esiste anche "cuproso, cuprico".
- Le redox non sono nominate: sono del quarto anno e non si possono linkare.

## Dubbi per Andrea

1. Il prefisso mono-: va bene la regola "solo in monossido, e solo se l'elemento ha più ossidi"? Alcuni libri scrivono "monossido di dicloro" per $\mathrm{Cl_2O}$ e "monossido di calcio" per $\mathrm{CaO}$, altri "ossido di ferro" per $\mathrm{FeO}$.
2. Prefissi senza elisione: "pentaossido di difosforo" o "pentossido"? "Eptaossido" o "eptossido"? Abbiamo scelto la forma senza elisione.
3. Le regole in ordine di precedenza, con le eccezioni ricavate dall'ordine: va bene, o preferisci l'elenco tradizionale con le eccezioni scritte dentro la regola dell'idrogeno e quella dell'ossigeno?
4. La valenza: basta la sezione breve che c'è, o a scuola si chiede di più (valenza ionica e covalente)?
5. Il n.o. frazionario della magnetite è in una nota che si può saltare: lo teniamo?
6. Rameoso e rameico, oppure cuproso e cuprico?

## Da verificare

- $\mathrm{FeO}$ nero e $\mathrm{Fe_2O_3}$ rosso, "quello che dà il colore alla ruggine": scritto a memoria.
- La IUPAC come "Unione internazionale di chimica pura e applicata": traduzione corrente del nome.
- Nella magnetite due atomi di ferro a $+3$ e uno a $+2$: scritto a memoria.
- `src/lib/tools/elementi.json`: per il cloro mancano il $+3$ (ha $+7$, $+5$, $+1$, $-1$); per l'ossigeno c'è solo $-2$, senza il $-1$ dei perossidi; per il bromo non c'è il $+7$; per il manganese non c'è il $+6$. La lezione usa per il cloro $+1$, $+3$, $+5$, $+7$, come tutti i libri. Le elettronegatività citate ($3{,}44$ per l'ossigeno, $2{,}20$ per l'idrogeno) sono quelle del file.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `ossidazione-elettroni-assegnati-acqua`, `ossidazione-estremi-gruppi-principali`, `ossidazione-regola-incrocio` (copiata anche nel formulario), `ossidazione-famiglie-composti-inorganici`.

Una interattiva, `ossidazione-calcola-atomo-per-atomo` (`src/components/content/interactive/chimica/NumeroOssidazioneCalcola.tsx`): dieci formule tra molecole e ioni; per ogni elemento due bottoni cambiano il n.o., la riga mostra il contributo e due barre i totali positivi e negativi; "Controlla" dice quali numeri sono sbagliati e quale regola li fissa. Una somma giusta con i numeri sbagliati ($+2$ e $-4$ nell'acqua) viene segnalata.

Nessun blocco `grafico`: non c'è una curva con un parametro.

## Esercizio guidato

L'esempio 3 ($\mathrm{K_2Cr_2O_7}$). Si fermerebbe in tre punti: quali n.o. sono fissati dalle regole (potassio e ossigeno); come si scrive l'equazione, con il $2x$ per i due atomi di cromo; che cosa si risponde dopo $2x = 12$ ($+6$, non $+12$).

Prerequisiti proposti: chim-affinita-elettronegativita, chim-simboli-lewis, chim-atomi-molecole-ioni, chim-formula-chimica
