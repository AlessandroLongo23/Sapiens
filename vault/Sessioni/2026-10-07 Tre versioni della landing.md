---
aggiornato: 2026-10-07
tag: [sessione, design, marketing]
---
# Tre versioni della landing

Sessione del 7 ottobre 2026. Alessandro ha chiesto di riprogettare la landing in tre versioni, con carta bianca su tecniche e riferimenti e un solo vincolo: lo stile non deve staccarsi dal resto del sito. La home di oggi è solo l'hero con lo schizzo; le tre versioni sono pagine intere.

## Dove sono
- `/prova-home` è l'indice; le versioni sono `/prova-home/quaderno`, `/prova-home/oggetti` e `/prova-home/prova`. Fuori dall'indice dei motori e senza link dal sito; in fondo a ogni pagina una barra passa da una versione all'altra. La home `/` non è stata toccata.
- Codice in `src/components/landing/prova/`, con un suo foglio di stile (`landing.css`, classi `lp-`) tenuto fuori da `globals.css` finché non si sceglie: le due versioni scartate si cancellano con le loro regole.

## Le tre versioni
- **Quaderno.** La home di oggi diventa una storia. Lo schizzo resta nell'hero; scorrendo, i fogli di una sessione di studio atterrano uno sull'altro e restano impilati: la pagina di una lezione, un esercizio, un errore corretto a penna, il ripasso prima della verifica. Evidenziatore, penna rossa e matita scrivono quando il foglio arriva. Poi le materie come indice di un quaderno e gli strumenti come foto fissate con lo scotch. Titolo: "Si impara con la penna in mano."
- **Oggetti.** Gli oggetti in tre dimensioni delle schede portano la pagina. L'hero è una natura morta resa in Blender come una scena sola (pila di libri, compasso, pendolo di Newton, tasti, benzene): gli oggetti entrano uno dopo l'altro, poi ciascuno si muove come sulla sua scheda. Seguono tre capitoli, uno per verbo del titolo, le quattro materie sulle schede vere e una griglia degli strumenti. Titolo: "Impara. Esercitati. Ricorda."
- **Prova.** La pagina è il prodotto. Nell'hero c'è un esercizio a cui si risponde subito, senza account, anche con i tasti 1-4: cinque domande del livello 1 di "Equazioni di secondo grado", con i passaggi dopo un errore e il percorso dei livelli che si riempie sotto. Poi un banco con tre cose da toccare: una parabola con i tre coefficienti, un mazzo di flashcard, la tavola periodica. Titolo: "Esercitati finché ti riesce."

## Scelte comuni
- I testi seguono due decisioni che la home di oggi non segue ancora: [[2026-09-23 Superiori STEM come segmento iniziale]] (occhiello e materie parlano delle superiori; medie e università sono una riga) e [[2026-09-23 Pratica con progressi come messaggio principale]] (esercizi a livelli e progressi vengono prima di tutto).
- I numeri vengono dal database (lezioni con la teoria, mazzi di flashcard) e dal registro degli strumenti. Niente testimonianze, voti o numeri di utenti: non ce ne sono, e [[Principi]] chiede di vendere quello che esiste.
- Piani e domande frequenti sono gli stessi nelle tre versioni (`common.tsx`) e rimandano a `/pricing`. La scritta "IVA inclusa" non c'è, perché è ancora una domanda aperta in [[Piani e prezzi]].
- Tutte e tre funzionano nel tema scuro, sul telefono e con il movimento ridotto; senza JavaScript il contenuto è già al suo posto.

## Cosa è nuovo, oltre alle pagine
- `scripts/landing/scena.py` e `scripts/landing/export-scena.py`: la scena dell'hero di Oggetti, costruita con i modelli di `scripts/materie/icons.py`. File in `public/landing/` (`scena.webp`, `scena.webm`, `scena.mov`).
- Quattro foto degli strumenti prese dal sito in locale (`public/landing/`: tavola periodica, orbitali, grafico, editor di codice). Vanno rifatte se cambia l'aspetto degli strumenti.
- Le domande dell'esercizio di prova sono scritte e controllate a mano in `data.ts`: non vengono dai generatori, che correggono sul server e chiedono un account.

## Da decidere
- Quale versione, o quale incrocio: gli hero e le sezioni si possono scambiare.
- Il titolo, che cambia da versione a versione.
- Se la pagina degli esercizi deve offrire davvero una prova senza account, come promette l'hero di Prova.
- Le domande frequenti dicono che gli anni mancanti "arrivano un lotto alla volta" e non nominano chi rilegge i contenuti: da rivedere con Andrea e Lorena.
- La home resta in inglese nel footer ("Smart help for smart learners"): fuori da questo lavoro, da sistemare quando si sceglie.

## Da fare prima di pubblicare
- Provare a mano su Safari (filmato HEVC con alfa, `animation-timeline`) e su Firefox (senza `animation-timeline` i fogli atterrano senza la rotazione).
- Provare su un telefono vero: sui fogli della storia il testo è piccolo.
- Pesare il filmato dell'hero e decidere se caricarlo anche sul telefono.
- Commit: niente è committato.

## Quarta versione, Materie (stesso giorno)
Alessandro ha chiesto una versione in cui lo scroll anima gli oggetti delle quattro materie delle superiori: l'oggetto arriva, cresce e se ne va, ogni sezione ha il suo colore, e l'altra metà dello schermo mostra una lezione animata con una figura TikZ e poi lo strumento della materia, da usare sul posto.

- È a `/prova-home/materie`, codice in `src/components/landing/prova/materie/`. Titolo: "Ogni materia, da vicino."
- Da computer ogni materia è una scena alta quattro schermi con il contenuto fissato sotto la testata (`ScrollStage.tsx`): la frazione di scena scorsa sposta tre cose, ciascuna con una sola trasformazione: l'oggetto, la lezione e lo strumento. Alessandro ha bocciato la prima stesura (lenta, pesante, a scatti con scroll piccoli, con dissolvenze sfocate): ora niente dissolve e niente insegue lo scroll, l'oggetto entra dal suo lato e esce dall'alto, la lezione sale e lo strumento la segue, e la scena è alta 3,2 schermi invece di 4. Sul telefono e con il movimento ridotto niente è fissato: oggetto, lezione e strumento stanno uno sotto l'altro, e l'oggetto gira mentre attraversa lo schermo.
- Gli oggetti sono 60 fotogrammi a testa resi in Blender (`scripts/landing/giro.py`, `export-giro.py`, file in `public/landing/giro/`): mezzo giro attorno alla verticale mentre il compasso traccia il cerchio, il pendolo oscilla, i tasti si premono e il benzene ruota. La pagina disegna su un canvas i due fotogrammi più vicini allo scroll, mescolati, così il giro non va a scatti.
- Le lezioni di esempio sono vere, con il testo accorciato: "La parabola nel piano cartesiano", "Il moto lungo un piano inclinato", "Orbitali e numeri quantici", "I diagrammi di flusso". Le quattro figure TikZ sono copie degli SVG del bucket `figure` in `public/landing/figure/`: se una figura viene ripubblicata, la copia va aggiornata a mano.
- Gli strumenti sono i componenti veri: la parabola da trascinare della versione Prova, una scena della sandbox di fisica (`LessonScene`), la figura degli orbitali (`OrbitalFigure`) e l'editor di codice (`Workbench`). Si caricano solo quando la scena si avvicina.
- Da provare a mano: Safari e Firefox, un portatile con lo schermo basso (la scheda dello strumento deve stare nello schermo), il peso dei fotogrammi su una rete lenta.

## Scelta, per ora
- Il 7 ottobre 2026 Alessandro ha scelto "per ora" la versione Oggetti: `/` la mostra (`src/app/(site)/page.tsx`), in locale e non committata. Le altre versioni restano a `/prova-home` per il confronto, e `HeroSection`, `HeroSketch` e `AnimatedCounter` restano nel codice: lo schizzo serve ancora alla versione Quaderno.
- Il test `smoke.spec.ts` della home cerca ora "lezioni online" al posto di "Lezioni pubblicate". Non è stato eseguito.
- Quando la scelta è definitiva: spostare i file di Oggetti fuori da `landing/prova/`, portare le sue regole di `landing.css` in `globals.css` e cancellare le versioni scartate.


## Oggetti sul telefono (stesso giorno)
Alessandro ha fatto notare che sul telefono la versione Oggetti sembrava un ripiego: era la composizione da computer messa in colonna. Sotto i 640 px la pagina ha ora un disegno suo; da computer non cambia nulla.

- **Hero.** Sta in uno schermo, come la prima schermata di un'app: la scena in alto da bordo a bordo, l'occhiello su una riga ("Materie scientifiche delle superiori"), il titolo su tre righe, una sola frase, un solo bottone pieno con la nota della prova come didascalia (senza asterisco), e "Sfoglia le lezioni" come link di testo. Prima la scena finiva sotto la piega e i due bottoni avevano lo stesso peso.
- **Scala dei caratteri.** Titolo 52 px, verbi dei capitoli 44, titoli di sezione 32, titoli dei capitoli 24, testo 17. Prima i verbi (60 px) erano più grandi del titolo della pagina (46 px).
- **Numeri.** Una riga sola di quattro, con le etichette accorciate.
- **Capitoli.** I fogli sono alti quanto il loro contenuto e hanno il carattere più grande (3,5 % della larghezza invece di 2,95 %), così si leggono; la tinta è una banda da bordo a bordo; l'oggetto sta sempre a destra, per non coprire il verbo seguente, e il numero di pagina del foglio è nascosto.
- **Strumenti.** Sotto i 1024 px sono una riga da scorrere di lato, con la scheda seguente che spunta dal bordo, al posto di cinque schede una sotto l'altra.
- **Spazi.** Le sezioni hanno 56 px sopra e sotto invece di 80. La pagina è alta 7.190 px invece di 9.760 (a 360 px di larghezza).
- I titoli di sezione (`ink.tsx`), i piani e le domande (`common.tsx`) sono comuni alle quattro versioni: le misure per il telefono valgono per tutte. Le regole dei fogli stanno in `landing.css`, sotto `.lp-oggetti`.

Verificato con foto a 320, 360, 768 e 1440 px, tema chiaro e scuro, con il movimento ridotto. Non provato su un telefono vero né con il filmato dell'hero in riproduzione.

Notato e non toccato:
- Alla prima visita il banner dei cookie copre circa metà del primo schermo del telefono.
- Nel tema scuro il riquadro della formula sul foglio della lezione è scuro e la formula non si legge. Quel riquadro non è stato modificato in questo lavoro; da verificare se succede anche da computer.

## Via gli occhielli (stesso giorno)
Alessandro ha chiesto di togliere dalla landing gli occhielli e i numeri dei tre capitoli. Tolti nella versione Oggetti, a ogni larghezza: l'occhiello dell'hero, quelli delle sezioni (materie, strumenti, prezzi, domande) e "01, 02, 03" accanto ai verbi. Restano le etichette sulle schede degli strumenti ("Strumenti", "Laboratorio 3D"), i nomi dei piani e i numeri delle domande. `SectionTitle` accetta ancora l'occhiello, che le altre versioni di `/prova-home` usano. Senza l'occhiello l'hero non dice più "superiori": da computer non compare nel primo schermo, sul telefono nemmeno "materie scientifiche" (vedi [[2026-09-23 Superiori STEM come segmento iniziale]]).

## Consolida e il carbonio (stesso giorno)
- Il terzo verbo è "Consolida" al posto di "Ricorda", nel titolo e nel terzo capitolo: il titolo della versione Oggetti è ora "Impara. Esercitati. Consolida."
- La foto della tavola periodica mostra la scheda del carbonio al posto del californio, e ha anche la riga degli attinidi, che prima era tagliata. Il file è `public/landing/tavola-periodica-carbonio.webp` (1600 × 887): il nome è cambiato perché l'ottimizzatore delle immagini di Next teneva in cache la foto vecchia sotto lo stesso indirizzo. Rifatta dal sito in locale a 1600 px di larghezza, con il puntatore sul carbonio. La usano le versioni Oggetti e Quaderno, dove il riquadro è passato da 2:1 a 9:5; nella versione Oggetti la foto del laboratorio accanto è passata a 14:11, così le due schede hanno la stessa altezza.
- La scheda del laboratorio nella versione Oggetti si chiama "Laboratorio di chimica" al posto di "Esperimenti con le mani", e mostra il banco con gli strumenti (`public/lab/copertine/banco-singolo.webp`) al posto dell'aula. La versione Quaderno ha ancora la foto dell'aula.
- Le domande frequenti si aprono e si chiudono con un'animazione (altezza e opacità, 0,3 s, spenta con il movimento ridotto). Non sono più elementi `<details>`, che in Safari e Firefox non si animano in altezza: ogni riga è un bottone con `aria-expanded` (`FaqRow.tsx`), e senza JavaScript le risposte sono tutte aperte. Vale per le quattro versioni.

## Filmati nelle schede degli strumenti (stesso giorno)
Alessandro ha chiesto filmati al posto delle foto ferme per orbitali, plotter ed editor, e una scheda per la sandbox di fisica con un pendolo.

- Quattro filmati registrati dagli strumenti veri, in `public/landing/film/` (`.webm` VP9, `.mp4` H.264 e una foto `.webp` ciascuno, 800 × 600, 24 fotogrammi al secondo): `orbitali` (un 2p_x che fa un giro, 8 s, 1,5 MB), `grafico` (il punto sul cerchio che traccia seno e coseno, 8 s, circa 140 kB), `editor` (un programma Python che si scrive, parte e stampa i quadrati da 1 a 7, 9,7 s, circa 75 kB), `sandbox` (un pendolo con peso, tensione e velocità, due oscillazioni, 6 s, circa 135 kB). Ognuno si rifà con `scripts/landing/film-<nome>.mjs`, con il server di sviluppo acceso (`SAPIENS_URL`, predefinito `localhost:3000`).
- Nella versione Oggetti la seconda riga degli strumenti ha quattro schede al posto di tre. Su computer il filmato parte quando il puntatore o il fuoco è sulla scheda e torna alla foto quando esce; sul telefono parte quando la scheda è quasi tutta nello schermo; con il movimento ridotto resta la foto. Il filmato si scarica la prima volta che parte (`TileFilm.tsx`).
- La sandbox non ha ancora una pagina sotto `/strumenti` (`/prova-fisica/sandbox` risponde 404 in produzione): la sua scheda non è un link e ha l'etichetta "In arrivo". Quando la pagina esiste basta darle `href` e l'etichetta "Strumenti".
- Limiti: l'orbitale pesa 1,5 MB perché una nuvola di punti si comprime male (a 750 kb/s si impasta); nel filmato del plotter il disegno occupa solo la fascia centrale del riquadro; il cerchio è centrato in (−π/2, 0) per non coprire l'inizio delle curve; i filmati non sono stati provati su Safari. La versione Quaderno usa ancora le foto ferme di `public/landing/`.
- Filmato del plotter rifatto lo stesso giorno, su indicazione di Alessandro: il cerchio è nell'origine, il seno scorre verso destra dalla proiezione del punto sull'asse y e il coseno scorre verso l'alto dalla proiezione sull'asse x, con due linee tratteggiate che legano il punto alle curve. Il disegno riempie il riquadro e il loop si chiude senza che le curve spariscano (circa 200 kB). I numeri sugli assi sono nascosti, perché lungo le due strisce conterebbero il tempo trascorso.
- La sandbox è diventata uno strumento con la sua pagina, `/strumenti/sandbox-di-fisica` (vedi [[Sandbox di fisica]]): la scheda della landing è un link e ha l'etichetta "Strumenti". Lo script del filmato punta al nuovo indirizzo e ai nuovi comandi del tempo, ma non è stato rieseguito dopo la modifica.
- Il filmato degli orbitali è stato rifatto la sera del 7 ottobre, su richiesta di Alessandro: la camera sta ferma e a muoversi sono i punti, con il moto proprio dello strumento negli orbitali di tipo complesso. È un 3d con m = 1 (un anello blu sopra uno arancione), 8 s, 1,5 MB. I punti vicini all'asse girano più in fretta di quelli lontani, quindi la nuvola non torna mai al punto di partenza: il loop si chiude con una dissolvenza di un terzo di secondo. `VERSION` in `TileFilm.tsx` è passato a 3.
