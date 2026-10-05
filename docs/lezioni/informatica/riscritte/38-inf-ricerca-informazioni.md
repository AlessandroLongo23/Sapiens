# Cercare e valutare le informazioni in rete

Per una ricerca di scienze sul ritiro dei ghiacciai alpini trovi in pochi secondi migliaia di pagine: l'articolo di un'università, il post di un blog, un video, la pubblicità di un'agenzia di viaggi, una pagina che sostiene il contrario di tutte le altre. Trovare non è più il problema. Il lavoro sta prima, nello scrivere una ricerca che porti alle pagine giuste, e dopo, nel decidere di quali fidarsi.

## Come lavora un motore di ricerca

Un **motore di ricerca** è un servizio del [web](/materiale/scuola-superiore/informatica/internet-e-il-web/il-web-ipertesti-url-e-protocollo-http) che, date alcune parole, restituisce un elenco ordinato di pagine che le riguardano. Quando premi Invio il motore non va a leggere il web in quel momento, perché ci vorrebbero giorni: consulta un elenco che ha preparato prima.

```tikz
% nome: come-lavora-motore-di-ricerca
% alt: Schema di un motore di ricerca dall'alto in basso: le pagine del web vengono esplorate da un programma che segue i link; da queste si costruisce l'indice, che per ogni parola elenca le pagine che la contengono; le parole della ricerca entrano nell'indice da sinistra; dall'indice escono i risultati, messi in ordine
\begin{tikzpicture}
\tikzset{b/.style={draw, thick, rounded corners=3pt, minimum width=3.6cm, minimum height=0.9cm, align=center, font=\small}}
\node[b, fill=green!15] (w) at (0,0) {pagine del web};
\node[b, fill=blue!12, minimum height=1.2cm] (i) at (0,-2.2) {indice: per ogni parola,\\le pagine che la contengono};
\node[b, fill=orange!25] (r) at (0,-4.4) {risultati in ordine};
\node[draw, thick, minimum width=1.8cm, minimum height=0.9cm, align=center, font=\small] (q) at (-4.1,-2.2) {le parole\\che scrivi};
\draw[-{Stealth}, thick] (0,-0.45) -- node[right, font=\footnotesize, align=left] {1. esplorazione\\2. indicizzazione} (0,-1.6);
\draw[-{Stealth}, thick] (-3.2,-2.2) -- (-2.25,-2.2);
\draw[-{Stealth}, thick] (0,-2.8) -- node[right, font=\footnotesize] {3. ordinamento} (0,-3.95);
\end{tikzpicture}
```

1. Esplorazione. Un programma automatico, il crawler, apre una pagina, la legge, segue i suoi link verso altre pagine e ricomincia, senza fermarsi mai.
2. Indicizzazione. Con le pagine lette il motore costruisce l'**indice**, un enorme elenco che per ogni parola dice in quali pagine compare, come l'indice analitico in fondo a un libro.
3. Ordinamento. Quando scrivi una ricerca, il motore prende dall'indice le pagine che contengono le tue parole e le mette in ordine con un algoritmo che stima quali ti saranno più utili: quanto la pagina parla di quelle parole, quante altre pagine la linkano, quanto è recente, in che lingua e da dove stai cercando.

Da qui vengono tre conseguenze. Una pagina che il crawler non ha mai raggiunto, o che sta dietro una password come il registro elettronico, non compare tra i risultati anche se esiste. Il motore confronta parole, quindi trova le pagine che usano le parole che hai scritto, non quelle che rispondono meglio a quello che avevi in mente. E l'ordine non è una classifica di verità.

```ad-warning
Il primo risultato non è il più affidabile
L'ordine dipende da una stima di pertinenza e di popolarità, e i primi posti possono essere annunci a pagamento, segnati da una piccola scritta come "Sponsorizzato". Una pagina sbagliata ma molto linkata può stare sopra una pagina corretta e poco conosciuta. Chi si ferma al primo risultato lascia scegliere la fonte all'algoritmo.
```

## Formulare la ricerca

Le **parole chiave** sono le parole che scrivi nel motore e che devono comparire nelle pagine che cerchi. Conviene quindi pensare alla pagina che vorresti trovare, e a come è scritta, più che alla domanda che hai in testa.

1. Scrivi su un foglio che cosa vuoi sapere, in una frase.
2. Tieni i nomi e i termini precisi, togli il resto: articoli, "come mai", "vorrei sapere".
3. Usa le parole che userebbe chi conosce l'argomento: "ritiro dei ghiacciai", non "ghiaccio che sparisce".
4. Aggiungi quello che restringe: un luogo, un periodo, il tipo di documento.
5. Guarda i primi risultati senza aprirli. Se parlano d'altro, cambia le parole usando quelle che hai visto nei titoli migliori.

```ad-example
Esempio 1: dalla domanda alle parole chiave
Devi spiegare perché i ghiacciai delle Alpi si stanno riducendo e di quanto. Che cosa scrivi?

La domanda intera, "perché i ghiacciai si stanno sciogliendo?", porta soprattutto pagine generiche. Le parole `ritiro ghiacciai alpini cause` puntano a pagine che trattano proprio quel tema; `ghiacciai alpini superficie misure` cerca i dati. Sono due ricerche diverse perché le domande sono due: i motivi e i numeri.
```

Quando le parole da sole non bastano, alcuni simboli, detti operatori, dicono al motore come trattarle. I più diffusi funzionano nei principali motori.

| Che cosa scrivi | Che cosa ottieni | Esempio |
|---|---|---|
| virgolette | le pagine con quella frase esatta, parole nello stesso ordine | `"ritiro dei ghiacciai"` |
| un meno attaccato alla parola | le pagine che non contengono quella parola | `giaguaro -auto` |
| `site:` seguito da un dominio | solo le pagine di quel sito | `ghiacciai site:universita.example` |
| `filetype:` seguito da un'estensione | solo i file di quel formato | `ghiacciai alpini filetype:pdf` |
| `OR` tra due parole | le pagine con l'una o con l'altra | `ghiacciaio OR nevaio` |

```ad-example
Esempio 2: scegliere l'operatore
Cerchi il testo di una poesia di cui ricordi solo il verso "m'illumino d'immenso". Poi cerchi notizie sul pianeta Mercurio, ma i risultati parlano del metallo.

Per la poesia servono le virgolette: `"m'illumino d'immenso"` trova le pagine con quelle parole in quell'ordine. Per il pianeta si toglie ciò che disturba: `mercurio pianeta -metallo`.
```

Sotto la casella di ricerca ci sono poi i filtri, che non richiedono simboli: per data (utile quando serve una notizia recente), per tipo (immagini, video, notizie) e per lingua.

## Leggere la pagina dei risultati

Ogni risultato dà tre informazioni prima ancora di aprirlo: l'indirizzo della pagina, il titolo e un estratto del testo, a volte con la data.

```tikz
% nome: pagina-risultati-motore-di-ricerca
% alt: Una pagina di risultati con due voci. La prima porta la scritta Sponsorizzato, l'indirizzo viaggi.example e il titolo Vacanze sul ghiacciaio: è un annuncio a pagamento. La seconda ha l'indirizzo universita.example, il titolo Il ritiro dei ghiacciai alpini e un estratto con la data: frecce indicano l'indirizzo, che dice chi pubblica, il titolo e l'estratto con la data
\begin{tikzpicture}
\draw[thick, rounded corners=3pt] (0,0) rectangle (5.6,4.2);
\draw[thick, fill=orange!25] (0.25,2.75) rectangle (5.35,3.95);
\node[anchor=west, font=\scriptsize] at (0.3,3.7) {Sponsorizzato {\ttfamily viaggi.example}};
\node[anchor=west, font=\small] at (0.3,3.15) {Vacanze sul ghiacciaio};
\draw[thick, fill=blue!12] (0.25,0.25) rectangle (5.35,2.45);
\node[anchor=west, font=\scriptsize\ttfamily] at (0.3,2.15) {universita.example};
\node[anchor=west, font=\small] at (0.3,1.6) {Il ritiro dei ghiacciai alpini};
\node[anchor=west, font=\scriptsize] at (0.3,1.0) {3 mar 2025. Le misure raccolte};
\node[anchor=west, font=\scriptsize] at (0.3,0.6) {dal 1990 mostrano che...};
\draw[{Stealth}-, thick] (5.4,3.7) -- (6.0,3.7) node[right, font=\footnotesize] {annuncio};
\draw[{Stealth}-, thick] (5.4,2.15) -- (6.0,2.15) node[right, font=\footnotesize] {chi pubblica};
\draw[{Stealth}-, thick] (5.4,1.6) -- (6.0,1.6) node[right, font=\footnotesize] {titolo};
\draw[{Stealth}-, thick] (5.4,0.8) -- (6.0,0.8) node[right, font=\footnotesize] {estratto e data};
\end{tikzpicture}
```

L'indirizzo è la parte più utile e la meno guardata: il [nome di dominio](/materiale/scuola-superiore/informatica/internet-e-il-web/indirizzi-ip-e-nomi-di-dominio) dice chi pubblica la pagina, e spesso basta a decidere se aprirla. Nella figura il primo risultato è un annuncio che vende vacanze, il secondo viene dal sito di un'università.

## Valutare una fonte

Una **fonte** è il documento da cui prendi un'informazione: una pagina, un articolo, un video, un libro. Sul web chiunque può pubblicare, senza che nessuno controlli prima, quindi il controllo tocca a chi legge. Si fa con quattro domande.

| Domanda | Che cosa cerchi nella pagina | Segnale di allarme |
|---|---|---|
| Chi scrive? | il nome dell'autore, la sezione "Chi siamo", il dominio | nessun autore, nessun modo di sapere chi c'è dietro il sito |
| Quando? | la data di pubblicazione o dell'ultimo aggiornamento | nessuna data, o dati vecchi presentati come attuali |
| Con quali prove? | le fonti citate, i dati con la loro origine, i link | affermazioni forti senza una fonte, "lo dicono gli scienziati" |
| Perché? | lo scopo: informare, vendere, convincere, far ridere | la pagina vende ciò di cui parla bene, o è fatta per farsi condividere |

Chi scrive conta perché la competenza non è uguale su tutto: un glaciologo è una fonte autorevole sui ghiacciai, non sulle diete. Vale per gli enti come per le persone, e un sito che non dice a chi appartiene ti chiede di credere a uno sconosciuto.

Quando è stato scritto conta in modo diverso a seconda dell'argomento. La data di una battaglia non cambia, e una pagina di dieci anni fa va bene; la superficie di un ghiacciaio, il numero di abitanti di una città, una legge cambiano, e un dato vecchio è un dato sbagliato.

Le prove sono ciò che distingue un'informazione da un'opinione. Una pagina seria dice da dove vengono i suoi numeri e ti permette di andare a controllare: la fonte da cui un dato nasce, cioè chi ha fatto la misura o scritto il documento originale, si chiama **fonte primaria**, e risalire fin lì è il controllo migliore.

Lo scopo, infine, spiega molte distorsioni. Chi vende un prodotto non mente per forza, ma non ha interesse a raccontarne i difetti; un titolo che ti fa arrabbiare o stupire è scritto per essere cliccato, e il testo sotto spesso dice molto meno.

```ad-warning
Una pagina curata non è una pagina affidabile
Una grafica professionale, un nome che suona ufficiale, il lucchetto accanto all'indirizzo, migliaia di condivisioni: nessuno di questi dice che il contenuto è vero. Il lucchetto indica solo che la connessione con il sito è cifrata, e un sito ben fatto costa poco a chiunque. Anche il dominio aiuta ma non basta: va guardato chi c'è dietro, non la sigla finale.
```

## Confrontare più fonti

Nessuna fonte, da sola, basta per un'informazione che conta. La regola è cercarne almeno un'altra che dica la stessa cosa, e che sia indipendente: due **fonti indipendenti** sono arrivate all'informazione ognuna per conto suo, senza copiarsi.

```ad-warning
Dieci copie sono una fonte sola
Se dieci siti riportano la stessa frase con le stesse parole, quasi sempre l'hanno copiata l'uno dall'altro o da un'unica origine. Dieci copie di un errore restano un errore. Cerca la frase tra virgolette, trova chi l'ha scritta per primo e valuta quello.
```

Per sapere chi c'è dietro un sito che non conosci, la mossa più rapida è uscire dalla pagina: apri un'altra scheda e cerca il nome del sito o dell'autore, per leggere che cosa ne dicono gli altri. Quello che un sito dice di sé nella pagina "Chi siamo" lo ha scritto lui.

```ad-example
Esempio 3: due pagine sullo stesso tema
Per la ricerca sui ghiacciai trovi due pagine. La prima, su `universita.example`, è firmata da una ricercatrice, porta la data di quest'anno e un grafico con la scritta "dati del catasto dei ghiacciai". La seconda, su `verita-nascoste.example`, non ha autore né data, dice che "i ghiacciai in realtà crescono, ma non ve lo dicono" e non cita nessuna misura. Quale usi?

Alla prima si può rispondere a tutte e quattro le domande: chi (una ricercatrice, con il nome), quando (quest'anno), con quali prove (i dati, con l'origine), perché (informare). Alla seconda a nessuna, e il tono da segreto svelato è fatto per essere condiviso. Usi la prima, e per il confronto cerchi una seconda fonte indipendente, per esempio un ente che misura i ghiacciai.
```

```ad-example
Esempio 4: tre numeri diversi
Cerchi quanti abitanti ha la tua città e tre pagine danno $388\,000$, $392\,000$ e $371\,000$. Qual è il numero giusto?

Prima di scegliere guardi le date: la prima pagina riporta un dato di due anni fa, la seconda di quest'anno, la terza non lo dice. Poi guardi l'origine: le prime due citano l'istituto nazionale di statistica, la terza niente. I primi due numeri sono entrambi corretti, ciascuno per il suo anno; vai sul sito dell'istituto, che è la fonte primaria, prendi il dato più recente e lo scrivi con l'anno accanto. Il terzo numero non si può usare.
```

## Enciclopedie collaborative e assistenti artificiali

Un'enciclopedia collaborativa come Wikipedia è scritta e corretta da volontari. Per farsi un'idea di un argomento è un buon punto di partenza, e la sua parte più utile per una ricerca sta in fondo alla voce: le note, che portano alle fonti da cui il testo è stato ricavato. Si aprono quelle, si controllano e si citano quelle.

Un assistente basato sull'intelligenza artificiale risponde con un testo scorrevole e sicuro, costruito a partire da un'enorme quantità di testi. Proprio la sicurezza del tono inganna: la risposta può contenere un dato inventato, una citazione che non esiste, un'informazione superata, scritti con la stessa naturalezza delle parti corrette. Va trattato come qualunque fonte senza autore: gli chiedi da dove viene un'informazione, apri quella pagina e controlli che dica davvero ciò che ti è stato riferito.

## Citare le fonti

Una ricerca dichiara da dove vengono le sue informazioni, per due motivi: chi legge deve poter controllare, e il lavoro di un altro non si presenta come proprio. Per una pagina web si scrivono l'autore (o l'ente), il titolo, il nome del sito, l'indirizzo e la data in cui l'hai consultata, perché le pagine cambiano.

```ad-example
Esempio 5: una citazione completa
M. Verdi, "Il ritiro dei ghiacciai alpini", Università di Esempio, `https://universita.example/ghiacciai`, consultato il 14 marzo 2026.
```

Copiare un paragrafo e incollarlo nella ricerca senza virgolette e senza fonte è plagio, anche quando la pagina è liberamente leggibile. Che cosa si può riusare di testi e immagini trovati in rete, e a quali condizioni, è l'argomento della lezione su [diritto d'autore e licenze](/materiale/scuola-superiore/informatica/sicurezza-e-cittadinanza-digitale/diritto-d-autore-e-licenze).
