---
stato: in sviluppo
release: da decidere
aggiornato: 2026-10-07
tag: [prodotto, studenti, strumenti, fisica, lezioni]
---
# Sandbox di fisica

Lo strumento della fisica: una scena fatta di pezzi (masse, piani inclinati, corde, carrucole, vincoli) che si muove secondo le leggi della meccanica, con accanto le forze, i grafici e i numeri del corpo scelto. Per gli studenti che studiano, per le lezioni e per i docenti che preparano materiale.

## Stato attuale
Dal 5 ottobre 2026 c'è la prima fetta, nel codice locale, non committata. Non è nella beta.

Dal 7 ottobre 2026 la sandbox è uno strumento del sito, alla pagina `/strumenti/sandbox-di-fisica`: l'editor in alto, i link alle lezioni sul piano inclinato e sull'attrito, un articolo (`src/content/strumenti/sandbox-di-fisica.md`) e la carta nell'indice degli strumenti, tra quelli di fisica. Il nome è "Sandbox di fisica". La pagina di prova `/prova-fisica/sandbox` è stata tolta; il vecchio visore delle scene fisse (`Sandbox.tsx`, quello di `?fissa=1`) non ha più una pagina che lo usa. Una scena condivisa sta nell'indirizzo dopo `#s=`, come prima. Guardata con Playwright a 1440 e 390 px, senza scorrimento laterale.

- Il motore, `src/lib/sandbox/engine.ts`: punti materiali, superfici fisse dritte con attrito statico e dinamico, corde ideali, carrucole fisse ideali (una per corda), in unità SI. A ogni passo risolve un solo sistema lineare che ha per incognite le accelerazioni e le forze dei vincoli, quindi tensioni, reazioni e attrito sono risultati da leggere. Il passo è $x + vh + \frac{1}{2}ah^2$, tagliato dove l'attrito ferma un corpo, dove un corpo atterra e dove una corda si tende: un sistema con forze costanti segue la legge chiusa fino all'arrotondamento. Una scena è JSON.
- Le scene, `src/lib/sandbox/scenes.ts`: piano inclinato, macchina di Atwood, piano inclinato con peso appeso, corpo appeso a due fili, lancio da un tavolo, e per le lezioni la lampada tra soffitto e parete e il carrello sul tavolo con il pesetto.
- I test, `tests/unit/sandbox.test.mjs`: 12, contro le formule chiuse ($a = g \sin\theta$, attrito che tiene fino a $\tan\theta \leq \mu_s$, $a$ e $T$ di Atwood, corpi collegati con e senza attrito, le due tensioni dei fili, tempo di caduta e gittata dal tavolo, distanza di arresto, energia e lunghezza di un pendolo).
- L'interfaccia, `src/components/sandbox/`: `Sandbox.tsx` (la scena a sinistra; a destra le forze sul corpo scelto con i moduli, $\sum F$, $a$, $v$, l'energia e due grafici nel tempo a scelta tra $x$, $y$, $v$, $v_x$, $v_y$), `SceneDrawing.tsx` (la scena con i pezzi del kit delle lezioni, le forze come frecce, la traiettoria del corpo scelto), `TimeChart.tsx`. Comandi: avvia e pausa, un passo, da capo, tempo a un quarto, il cursore del tempo per tornare indietro, quali forze disegnare. Un clic su un corpo lo sceglie. Con `locked` la scena è fissa, come in una lezione.
- La pagina di prova `/prova-fisica/sandbox` c'è stata fino al 7 ottobre 2026 (vedi sopra).
- Provata con Playwright su Chromium a 1280 e 390 px, senza errori. Non provata su WebKit, nel tema scuro, su un telefono vero.

Nelle lezioni, dal 5 ottobre 2026 (richiesta di Alessandro dopo aver visto la pagina di prova: lì gli elementi occupano molto più spazio della colonna di una lezione, e va scelto quali servono):
- `src/components/sandbox/LessonScene.tsx` è la scena dentro una lezione: fissa, con solo i pezzi che la lezione chiede. Ogni figura dichiara la scena, i cursori e le scelte, e quali tra tempo, elenco delle forze, grafico, valori, frase e domanda. Scena e numeri stanno affiancati nella colonna della lezione (568 px da computer; affiancati da 544 px in su) e uno sotto l'altro sul telefono. Il tempo è una riga sola: avvia, da capo, cursore.
- Si monta con il blocco `interattivo` di sempre, un file per figura in `src/components/content/interactive/fisica/`, registrato in `FIGURES`. Non c'è ancora un blocco suo che descriva la scena nel markdown.
- Tre lezioni di fisica ne hanno una, nei sorgenti e non pubblicate, ciascuna con i numeri di un esempio della lezione:
  - 20, dopo l'esempio 4: la lampada di 20 N tra un filo inclinato e uno orizzontale. Ferma: solo le forze e le componenti di $T$, con il cursore dell'angolo. A 30° dà 23,09 N e 11,55 N.
  - 55, dopo l'esempio 3: il blocco di 4 kg e il pesetto. Moto, forze del corpo scelto, accelerazione e grafico della velocità; cursore della massa del pesetto e scelta tra tavolo liscio e con attrito. Ritrova gli esempi 2 e 3, e sotto 1,4 kg il sistema non parte.
  - 54, dopo l'esempio 5: la cassa lanciata in salita. Moto e grafico della velocità lungo la rampa, senza elenco delle forze; cursore dell'inclinazione e scelta di $\mu_s$. A 25° con 0,50 si ferma dopo 1,84 m e resta; altrimenti riscende e il grafico è una spezzata.
- Guardate con Playwright dentro la pagina della lezione di prova, a 568 px di colonna, a 390 px e nel tema scuro, senza errori e senza scorrimento laterale. Non provate su WebKit né su un telefono vero.
- Le forze hanno i nomi delle lezioni: $P$, $F_v$ per la reazione, $F_s$ e $F_d$ per l'attrito; una corda può dare il nome alla sua tensione.

L'editor, dal 6 ottobre 2026 (richiesta di Alessandro: uno strumento dove si aggiungono, spostano e tolgono i pezzi, senza niente di macchinoso, con una libreria e l'aggancio tra i pezzi):
- `src/components/sandbox/Editor.tsx`, oggi alla pagina `/strumenti/sandbox-di-fisica` (fino al 7 ottobre alla pagina di prova). Una cornice sola, come il plotter (richiesta di Alessandro del 6 ottobre 2026, dopo una prima versione a schede separate): in alto la barra con annulla e ripeti a sinistra ed esempi, condividi e svuota a destra; a sinistra il pannello a sezioni che si chiudono (i pezzi della libreria, i valori del pezzo scelto, le forze, il grafico); a destra la scena su una griglia di mezzo metro, con una riga di aiuto sopra e sotto la barra del tempo (avvia, un passo, da capo, velocità, cursore). Sul telefono la scena e il tempo stanno sopra, il pannello sotto. I bottoni della barra sono quelli del plotter (`IconButton` di `PlotterParts.tsx`). Dal 6 ottobre 2026 ha lo schermo intero, come il plotter: quello del browser dove esiste, altrimenti la cornice fissata sopra la pagina; la scena prende lo spazio che c'è, misurato mentre cambia, e Esc esce.
- Un clic su un pezzo della libreria lo mette nella scena, già scelto; poi si trascina. Una massa avvicinata a una superficie ci si appoggia e ne prende l'inclinazione; sotto il bordo di una carrucola si allinea, così il filo scende verticale. Quello che è appoggiato a una superficie, o legato a essa, la segue quando la si sposta, la si allunga o se ne cambia l'angolo.
- La corda: si sceglie Corda, poi si cliccano i due capi (un corpo, un punto di una superficie, un punto qualunque), e in mezzo una carrucola se deve passarci; una linea tratteggiata segue il puntatore. Il verso in cui gira attorno alla carrucola lo decide la scena. Le corde sono sempre tese alla partenza.
- Gli estremi di una superficie scelta si trascinano: pavimento e soffitto restano orizzontali, la parete verticale, il piano inclinato ruota. Valori nel pannello: massa, velocità iniziale e forma di un corpo; lunghezza, inclinazione e attrito di una superficie; raggio di una carrucola; la carrucola di una corda.
- Togli (anche con Canc), annulla e ripeti (anche da tastiera), svuota, sette esempi da aprire, e "Copia il link": la scena sta nell'indirizzo dopo `#s=`.
- Le funzioni che modificano la scena sono in `src/lib/sandbox/edit.ts`, pure, con un test (blocco che si appoggia e segue il piano, Atwood costruita a mano, scena che passa per il link).
- Provato con Playwright su Chromium a 1360 px: scena costruita da zero (pavimento, piano inclinato, massa appoggiata, carrucola, seconda massa, corda), moto, togli e annulla; a 390 px senza scorrimento laterale.

Limiti di oggi:
- Un pezzo si aggiunge con un clic, non trascinandolo dalla libreria.
- Sul telefono la scena è piccola (7,2 m in 340 px): si usa, ma è da computer.
- Il capo di una corda legato a una superficie è un punto: segue la superficie, non si vede che cosa lo tiene.
- Niente blocco per le lezioni e niente scene salvate con nome. Non c'è un pendolo tra gli esempi (il filmato della landing lo costruisce con un link).
- I grafici sono un disegno semplice del kit, non il piano del plotter.
- Niente equazioni con i simboli ($m g \sin\theta - \mu N = m a$): solo i numeri.
- I corpi non si urtano tra loro; l'atterraggio è anelastico e non toglie velocità lungo la superficie; una corda che si tende dà uno strattone anelastico.
- Un corpo che arriva in fondo a un piano dove comincia un'altra superficie ferma la simulazione, perché il passaggio da una superficie all'altra non c'è.
- Con una corda tesa e un corpo appoggiato e fermo (il pesetto a terra con il filo ancora teso) tensione e reazione non sono determinate dalle equazioni, e il motore ne sceglie una coppia.
- Nelle lezioni le etichette delle forze si toccano quando due frecce sono vicine o corte.
- La carrucola non ha il sostegno disegnato; le etichette delle forze si sovrappongono quando le frecce sono vicine.

Comandi del tempo, dal 7 ottobre 2026 (richiesta di Alessandro): solo simboli, nell'ordine da capo, avvia o pausa, un passo; la velocità è un bottone solo che a ogni clic passa a ×1, ×½, ×¼, ×⅛ e ricomincia. Prima erano bottoni con il testo e una scelta tra 1× e ¼×.

Barra del tempo, dal 7 ottobre 2026 (richiesta di Alessandro: la barra andava da 0 al tempo presente, quindi durante il moto il cursore stava sempre in fondo). Ora la barra è lunga quanto dura la scena: l'istante in cui il moto finisce o si ferma, calcolato prima di partire (`useDuration` in `useSim.ts`), oppure 30 secondi per una scena che non finisce, come un pendolo; a 30 secondi la scena si ferma da sola (prima erano 20). Il cursore si riempie mentre il tempo scorre, e si può portare su qualunque istante, anche più avanti di dove il moto è arrivato: la scena viene calcolata fino a lì (`seekTime`). Accanto c'è il tempo sul totale. Alessandro aveva proposto una lunghezza fissa di 30 o 60 secondi; gli esempi durano da 1 a 2 secondi, e su una barra fissa di 30 il cursore si sarebbe mosso di pochi pixel. Le scene nelle lezioni (`LessonScene.tsx`) hanno ancora la barra di prima.

## Obiettivo
Come l'ha raccontata Alessandro il 5 ottobre 2026. Una sandbox dove si mettono insieme dei pezzi come in un ambiente LEGO: corde in tensione, piani inclinati, masse, vincoli come pavimenti e soffitti. Lo schermo è diviso, metà scena e metà formule o grafici: si clicca un componente, per esempio una pallina, la si lancia, e a destra si vedono l'altezza e la velocità in funzione del tempo e quello che succede nei numeri e nelle formule. È modulare e cresce con le lezioni di fisica.

Ha due versioni, come il plotter. Dentro una lezione la scena può essere fissa. Nello strumento c'è l'editor, con cui i professori creano esercizi e materiale e gli studenti studiano.

## Dettagli
- Scomposizione dei vettori (7 ottobre 2026): nella scheda "Forze su m" la casella "Componenti lungo x e y" disegna, per il corpo selezionato, le due componenti di ogni forza e della velocità (frecce tratteggiate sottili dallo stesso punto, con le due linee che chiudono il rettangolo) e aggiunge al pannello le componenti di forze, accelerazione e velocità. Un vettore già lungo un asse non viene scomposto. Limite: su un blocco piccolo con tre forze e la velocità le etichette sono fitte, e due componenti sovrapposte sulla stessa retta (T₁y e T₂y nel corpo a due fili) restano difficili da distinguere.
- Etichette stabili (7 ottobre 2026): il nome di una freccia tiene il posto che ha rispetto alla sua freccia da un fotogramma all'altro (`memory` in `placeLabels`, `SceneDrawing.tsx`) e ne cerca un altro solo quando finisce sopra una linea o un altro nome. Prima sceglieva il posto migliore a ogni fotogramma e nel pendolo saltava di continuo. Misura su 7 secondi di pendolo: nessun salto per T e P; il nome di v cambia posto solo alle inversioni, quando la freccia sparisce e riparte dall'altra parte.
- Seconda revisione del 7 ottobre 2026, applicata: pavimenti, soffitti e pareti possono essere "senza fine" (campo `endless` della superficie, scelta "Senza fine / Limitata" nell'editor). Sono senza fine il primo pavimento, i soffitti e le pareti nuove, e il pavimento più basso degli esempi; i piani inclinati restano limitati. La freccia della velocità parte dal centro del corpo. Il nome del corpo sta in un angolo scelto in ordine fisso e non salta più al variare della massa. Le formule del pannello sono allineate a sinistra.
- Fluidità con un corpo selezionato (7 ottobre 2026): i numeri del pannello si aggiornano ogni 6 fotogrammi e il grafico ogni 3 mentre la scena corre, le formule KaTeX sono composte una volta sola per testo (`Tex` in `kit.tsx`), la traccia del corpo non ridisegna i tratti già percorsi (un pendolo ripassava lo stesso arco all'infinito), la libreria dei pezzi è costruita una volta. Misura sul pendolo, Chromium senza interfaccia, server di sviluppo, 3 secondi: script 890 ms con il corpo selezionato e 739 ms senza (prima 1028 e 873), paint 80 ms e 31 ms. Resta un 20% in più con la selezione. Non misurato sulla versione di produzione. Limite noto: l'editor intero si ridisegna a ogni fotogramma; per andare oltre va separato il disegno della scena dal resto.
- Revisione di Alessandro del 7 ottobre 2026 sull'editor, tutta applicata:
  - Il pezzo scelto cambia colore, senza linee tratteggiate attorno, che finivano sopra le frecce e i loro nomi.
  - Nel pannello ogni valore ha il nome con l'unità tra parentesi quadre su una riga, e sotto il cursore con il campo del numero. I simboli sono formule vere ($v_x$, $v_y$, $\mu_s$, $\mu_d$).
  - Nelle forze i simboli stanno in una colonna loro, così gli "=" sono allineati. Sotto, quattro gruppi con il nome su una riga e le formule sotto: somma delle forze, accelerazione, velocità, energia meccanica (`src/components/sandbox/panels.tsx`).
  - Il grafico conosce in anticipo tutto l'andamento (`usePreview` in `useSim.ts`: lo calcola un attimo dopo che la scena smette di cambiare, fino a 8 secondi o alla fine del moto): gli assi sono fissati sui suoi estremi, l'andamento è tratteggiato e il moto lo ripassa con un tratto continuo e più spesso. Griglia e tacche numerate sui due assi. Prima gli assi si adattavano a ogni istante e la curva sembrava cambiare pendenza. Vale anche per le scene nelle lezioni.
  - Ogni corpo in moto ha la freccia blu della velocità, accanto al corpo, a scala fissa. Nelle lezioni la figura la chiede con `velocity`; oggi lo fa solo la cassa della lezione 54.
  - I nomi delle frecce sono piazzati da una funzione (`placeLabels` in `SceneDrawing.tsx`) che cerca il posto libero da ogni linea del disegno (contorni dei corpi, fili, superfici, altre frecce) e dagli altri nomi; una forza troppo corta per uscire dal suo corpo ha il nome fuori lo stesso. Il nome del corpo va nell'angolo del blocco più lontano dalle frecce, o fuori se il blocco è piccolo.
- Le frecce delle forze hanno una scala fissa, in centimetri per newton, che non cambia con i cursori né con il tempo: una forza che non cambia tiene la sua lunghezza (Alessandro, 6 ottobre 2026: con la scala che si adattava alla forza più grande il peso si accorciava muovendo un cursore, e per chi sta imparando confonde). Nelle lezioni la scala la dichiara la figura (`forceScale`); nello strumento è quella dei valori con cui la scena si apre.
- Il motore è nostro e la prima versione ha corpi che non ruotano, con statica e moto insieme: vedi le decisioni.
- Nel disegno la parte piena di una superficie è alla destra di chi va da `a` a `b`.
- In una corda con la carrucola, `wrap` dice il verso in cui il filo gira andando da `from` a `to`.
- Ordine proposto da Claude per il seguito: l'editor (aggiungere, spostare e collegare i pezzi), poi la scena in un link e salvata con nome, poi il blocco per le lezioni che dichiara cosa è permesso, poi la molla.

## Domande aperte
- La scena degli esercizi (`SceneRef`) e quella della sandbox devono diventare lo stesso formato?
- I grafici passano al piano del plotter, o resta il disegno del kit?
- Dove si generano le equazioni con i simboli, e per quali scene.
- Il nome dello strumento e il suo indirizzo sotto `/strumenti`.
- Quando entra in una release.
- Il motore fa da modello anche agli apparati di meccanica del [[Laboratorio di fisica]], con sopra l'errore di misura? Lì si misura, qui resta la legge esatta ([[2026-10-07 Nel laboratorio di fisica si misura, la legge esatta resta alla sandbox]]).

## Collegamenti
- Attori: [[Studente]], [[Docente]]
- Decisioni: [[2026-10-05 La sandbox di fisica ha un motore nostro, basato sui vincoli]], [[2026-10-05 La prima sandbox ha corpi che non ruotano, con statica e moto insieme]], [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]
- [[Grafici e simulazioni interattive]], [[Grafico di funzioni]], [[Laboratori]], [[2026-10-05 Strumenti nelle lezioni]]
