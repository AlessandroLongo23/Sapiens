---
stato: in sviluppo
release: da decidere
aggiornato: 2026-09-28
tag: [prodotto, studenti, seo, dsa]
---
# Calcolatori e convertitori

Strumenti gratuiti, una pagina ciascuno, che risolvono un calcolo o una conversione con i passaggi e portano alla lezione e agli esercizi dello stesso argomento. Servono a tre cose: aiutano lo studente mentre studia, sono strumenti compensativi per chi ha un DSA ([[2026-09-23 Formulari e calcolatrici gratuiti]]), e prendono ricerche che le lezioni non prendono ("mcm online" è la prima fonte di traffico di Theoremz secondo Similarweb, agosto 2026, stima).

## Stato attuale
Dal 28 settembre 2026 (nel codice, non ancora pubblicato) ci sono 118 pagine sotto `/strumenti`, in dieci categorie: numeri 17, algebra 17, geometria 24, statistica 12, trigonometria 5, conversioni 9, fisica 12, chimica 7, informatica 7, scuola 8. La prima onda (25 pagine, 27 settembre) e la seconda (55 pagine, 28 settembre) coprono quasi tutta la lista qui sotto; la terza (33 pagine, 28 settembre) è stata scelta con il criterio "Quando uno strumento sì e quando no".

La terza onda aggiunge: divisori, frazione/decimale/percentuale, interesse semplice e composto; logaritmo, equazioni esponenziali e logaritmiche, equazioni fratte, biquadratiche e con il valore assoluto, disequazioni fratte; equazione della circonferenza, settore circolare, corona circolare, area di un poligono dalle coordinate; medie geometrica, armonica e quadratica, tabella delle frequenze, quartili e box plot, retta di regressione; resistenze in serie e in parallelo, codice colori delle resistenze, leggi dei gas; pH, formula minima, reagente limitante; convertitore di byte, calcolatrice binaria, subnet; assenze, voto dell'esame di terza media, media ponderata universitaria, voto di laurea.

Verifica delle ricerche del 28 settembre 2026 (Claude, con un motore di ricerca interrogato in italiano, non google.it; volumi da verificare con Keyword Planner): restano alla lezione forza peso, secondo principio, lavoro, pressione, spinta di Archimede, moto circolare, perché in cima ci sono spiegazioni. Dalla stessa verifica sono diventati strumenti, il 28 settembre (quarta onda, 5 pagine): temperatura di equilibrio, piano inclinato, legge di Coulomb, newton e kg-peso, generatore di grafici a torta con download in PNG e SVG; la tavola periodica interattiva ha il volume più alto ma è un lavoro grande, e resta un progetto a parte: [[Tavola periodica interattiva]]. Sulle ricerche sulle assenze si posiziona scuolasapiens.com, un sito che non è Sapiens: conta per la scelta del nome.
- Numeri (14): percentuali, mcm, MCD, fattori primi, frazioni, espressioni, potenze, radici, proporzioni, numeri primi, notazione scientifica, arrotondamento e cifre significative, frazione generatrice, numeri romani.
- Algebra (10): equazioni di primo e secondo grado, sistemi 2x2 e 3x3 (sostituzione, riduzione, Cramer), disequazioni di primo e secondo grado, prodotti notevoli, divisione tra polinomi, regola di Ruffini, scomposizione di polinomi.
- Geometria (20): area e perimetro delle figure piane e dei poligoni regolari, Pitagora, superficie e volume di cubo, parallelepipedo, prisma, piramide, cilindro, cono e sfera (con il disegno del solido), distanza tra due punti, punto medio, retta per due punti (anche parallela e perpendicolare), vertice e fuoco della parabola.
- Statistica (5): media, mediana e moda, varianza e deviazione standard, fattoriale, calcolo combinatorio, distribuzione binomiale.
- Trigonometria (5): gradi e radianti, gradi primi e secondi, seno coseno e tangente con gli archi associati, triangolo rettangolo, triangolo qualsiasi (con il caso ambiguo).
- Conversioni (8): equivalenze, temperatura, velocità, energia, potenza, kW e CV, pressione, pollici e centimetri.
- Fisica (6): moto rettilineo uniforme e uniformemente accelerato, densità, energia cinetica e potenziale, legge di Ohm.
- Chimica (4): massa molare, grammi e moli, molarità, diluizione.
- Informatica (4): basi numeriche, tabelle di verità, complemento a due, codici ASCII.
- Scuola (4): media dei voti, crediti scolastici, voto di maturità, conversione dei voti. Crediti e maturità seguono le regole dell'esame 2026 (D.Lgs. 62/2017 allegato A, legge 150/2024, D.L. 127/2025, OM 54 del 26 marzo 2026): per il 2027 le regole non sono ancora uscite, e la pagina lo dice.

L'indice (`src/components/tools/ToolIndex.tsx`) ha una ricerca in alto, che cerca anche nei sinonimi e ignora gli accenti, e una linguetta per categoria come gli anni nella pagina di una materia; la categoria scelta sta nell'indirizzo (`#geometria`). Ogni strumento è una carta con, su una striscia a quadretti, un piccolo disegno dell'argomento (la figura, il termometro, la torta delle frazioni, la bilancia dell'equazione) e sotto un esempio svolto ("mcm(12, 18) = 36"), così si riconosce il calcolo prima di leggere il titolo. I disegni sono in `src/components/tools/art/`, uno per strumento, con le regole di stile in `primitives.tsx`. Tutte le categorie sono nell'HTML, quindi i motori di ricerca leggono tutti i link.

Ogni strumento ha il motore in `src/lib/tools/` con i test in `tests/unit/tools-*.test.mjs` (284 test, con controlli a forza bruta dove si può), i controlli in `src/components/tools/`, l'articolo in `src/content/strumenti/`. Come se ne aggiunge uno: `docs/strumenti.md`. Le pagine sono statiche e si aprono su un esempio, quindi risultato e passaggi sono nell'HTML; l'input sta nell'indirizzo e il canonical è la pagina senza parametri. I link "Impara" ed "Esercitati" compaiono solo quando la lezione ha la teoria pubblicata. I testi (risultati, passaggi, articoli) sono scritti da Claude e vanno riletti come le lezioni.

Convenzioni scelte nella seconda onda da far controllare (ad Andrea o a un insegnante): sin e cos (molti libri scrivono sen), tg e cotg; g = 9,8 m/s² di default; caloria da 4,184 J; ordine di grandezza con la soglia 5; intervalli con le quadre rovesciate e "oppure" tra due intervalli; simboli A_b, A_l, A_t per i solidi; numeri fissi dei poligoni a tre decimali; se la media per i crediti comprende il voto di comportamento (non chiaro dalla norma).

[[Strumenti DSA]] cita calcolatrice, calcolatrice scientifica e convertitore di unità dalla bozza originale: la calcolatrice scientifica non c'è ancora.

## Quando uno strumento sì e quando no
Criterio discusso con Alessandro il 28 settembre 2026: gli strumenti non devono diventare lezioni. Uno strumento si fa se vale almeno una delle due condizioni.
- Il calcolo è da strumento: chi apre la pagina ha già i numeri e il calcolo è lungo, noioso o facile da sbagliare. Una formula di tre lettere da invertire (forza peso, lavoro, pressione) non basta: è materia della lezione o del formulario.
- Le ricerche sono da strumento: la ricerca ha volume e in cima a Google ci sono calcolatori. Allora la pagina porta traffico organico che la lezione non prenderebbe, anche se il calcolo è semplice. Se in cima ci sono spiegazioni e video, l'argomento resta alla lezione.

La sovrapposizione tra l'articolo dello strumento e la lezione non è un problema (intenti di ricerca diversi), ma l'articolo resta corto e rimanda alla lezione per il perché. Tra gli 80 strumenti attuali moto uniforme ed energia potenziale sono al limite: restano per le ricerche e per le conversioni di unità, dove gli studenti sbagliano.

## Cosa fanno gli altri
Ricerca del 27 settembre 2026 (Claude): pagine di Theoremz lette direttamente, YouMath dagli estratti dei motori di ricerca perché blocca le richieste automatiche, gli altri siti letti direttamente.
- Theoremz: 15 calcolatori sotto `/calcolatori/` (percentuale, MCD, mcm, fattori primi, numero primo, equivalenze, frazioni, proporzioni, potenze, derivate, integrali, espressioni, equazioni, secondo grado, sistemi 2x2). Tutti gratuiti, con i passaggi, già compilati con un esempio, 100-200 parole di teoria e 4 FAQ sotto, nessun link alle lezioni. In più strumenti AI su foto.
- YouMath: circa 90 strumenti (da verificare), dall'aritmetica ad analisi 2 e algebra lineare, più calcolatori dentro le pagine di domande e risposte (kW e CV, Celsius e Fahrenheit, pollici e centimetri) e DeepMath, un risolutore AI. Con pubblicità; i passaggi solo su una parte.
- Portali generalisti italiani (calcolatore.online, calcolo.tools): centinaia di calcolatori, soprattutto fisco e salute. Omni Calculator ha la struttura migliore ma testi tradotti. Symbolab e Mathway mettono i passaggi a pagamento.
- Nessuno lega lo strumento alla lezione e agli esercizi, e quasi nessuno copre gli strumenti della vita scolastica (media dei voti, crediti, voto di maturità), che stanno su siti piccoli.

Domanda in Italia (Google Trends, 12 mesi, indice relativo con "mcm" = 100, da verificare con Keyword Planner): percentuale circa 700, pollici cm 150, frazioni 130, equazioni 130, densità 120, perimetro 105, espressioni 100, Celsius Fahrenheit 80, potenze 70, kW CV 70, radice quadrata 65, numeri romani 55, MCD 50, proporzioni 50, equivalenze 40, logaritmo 35, secondo grado 29, Pitagora 27, area del cerchio 27, moli 25, media ponderata 25, radianti 25, massa molare 20, crediti scolastici 18, media dei voti 16.

## Lista per categorie
Proposta di Claude del 27 settembre 2026. Tra parentesi la prima onda, cioè gli strumenti con più domanda e una lezione di Sapiens già scritta.

**Numeri e aritmetica.** Percentuali, con quattro modi: percentuale di un numero, che percentuale è, variazione, sconto (prima onda). Proporzioni (prima onda). Frazioni: operazioni e semplificazione (prima onda). Espressioni numeriche con i passaggi (prima onda). mcm e MCD (prima onda). Scomposizione in fattori primi (prima onda). Numero primo. Potenze (prima onda). Radici quadrate e cubiche, anche semplificate (prima onda). Notazione scientifica. Arrotondamenti e cifre significative. Frazione generatrice di un decimale periodico. Numeri romani.

**Algebra ed equazioni.** Equazioni di primo grado (prima onda). Equazioni di secondo grado (prima onda). Sistemi lineari 2x2 e 3x3. Disequazioni di primo e secondo grado con lo studio del segno. Prodotti notevoli (sviluppo). Scomposizione di polinomi. Divisione tra polinomi e regola di Ruffini. Semplificazione di frazioni algebriche.

**Geometria.** Area e perimetro, una pagina per figura: quadrato, rettangolo, triangolo, trapezio, rombo, parallelogramma, cerchio, poligoni regolari (prima onda). Teorema di Pitagora (prima onda). Solidi: superficie e volume di cubo, parallelepipedo, prisma, piramide, cilindro, cono, sfera. Piano cartesiano: distanza e punto medio, retta per due punti, rette parallele e perpendicolari, vertice e fuoco della parabola.

**Statistica e probabilità.** Media, mediana e moda (prima onda). Media ponderata. Varianza e deviazione standard. Fattoriale, disposizioni, permutazioni e combinazioni. Probabilità binomiale.

**Trigonometria.** Gradi e radianti (prima onda). Gradi sessagesimali e decimali. Seno, coseno e tangente di un angolo. Risoluzione del triangolo rettangolo.

**Conversioni di unità.** Equivalenze: lunghezza, massa, capacità, area, volume, tempo (prima onda). Velocità, km/h e m/s. Temperatura, Celsius, Fahrenheit e Kelvin (prima onda). Energia: joule, calorie, kWh, elettronvolt. Potenza: kW e CV. Pressione. Pollici e centimetri. Le coppie più cercate (kW e CV, pollici e centimetri, Celsius e Fahrenheit) hanno una pagina propria, con la conversione inversa collegata.

**Informatica.** Basi numeriche: binario, ottale, decimale, esadecimale (prima onda). Testo e codici ASCII. Tabelle di verità di una proposizione (è nel primo anno, con la logica). Complemento a due.

**Chimica.** Massa molare da una formula. Grammi e moli. Molarità e diluizione. Bilanciamento delle reazioni, più avanti.

**Fisica.** Moto rettilineo uniforme e uniformemente accelerato. Velocità e accelerazione media. Densità. Energia cinetica e potenziale. Legge di Ohm.

**Vita scolastica.** Media dei voti, con il modo "che voto mi serve per arrivare a..." (prima onda). Crediti scolastici. Simulatore del voto di maturità. Conversione dei voti (decimi, quindicesimi, trentesimi, centesimi). Giorni alla maturità. Sono gli strumenti che uno studente riapre, e si legano al [[Diario e calendario]].

**Più avanti.** Derivate, integrali, limiti, grafico di una funzione: la domanda è alta ma servono un motore di calcolo simbolico e la concorrenza è forte (Symbolab, Wolfram, GeoGebra, YouMath). Per i grafici conviene incorporare Desmos o GeoGebra.

La prima onda conta circa 20 strumenti.

## Pagina tipo
Tutti gli strumenti usano lo stesso scheletro e gli stessi controlli, con il linguaggio visivo del quaderno ([[2026-09-24 Linguaggio visivo del quaderno a quadretti]]).

Dall'alto verso il basso:
1. Intestazione come le altre pagine (`PageHeader`): occhiello con la categoria, titolo con le parole cercate ("Calcolo mcm e MCD"), una riga di spiegazione.
2. Lo strumento su un foglio a quadretti: input a sinistra e risultato a destra su computer, uno sotto l'altro sul telefono, sempre sopra la piega. Si apre già compilato con un esempio, così il risultato e i passaggi sono nell'HTML che legge Google.
3. Il risultato grande, in inchiostro, con il bottone Copia; dove serve, forma esatta e decimale.
4. I passaggi numerati, aperti, con lo stesso componente della soluzione degli esercizi ("Come si risolve", numeri 01, 02 in monospazio).
5. Due link fissi: "Impara" alla lezione e "Esercitati" alla scheda o al percorso dello stesso argomento. È l'aggancio che nessun concorrente ha.
6. Sotto, a larghezza di lettura: come si fa a mano con due esempi svolti, gli errori frequenti (con lo stile delle lezioni), una tabella dei casi comuni quando ha senso (mcm dei numeri da 2 a 20), domande frequenti, strumenti collegati e conversione inversa, la firma di chi l'ha controllato.

I controlli sono sempre gli stessi:
- Numeri: tastiera numerica sul telefono (`inputmode="decimal"`), virgola e punto accettati, errori detti a parole ("il denominatore non può essere 0").
- Liste di numeri (mcm, media): un campo solo, separati da virgola o spazio.
- Frazioni: due campi con la linea di frazione.
- Espressioni ed equazioni: un campo di testo con l'anteprima della formula scritta (KaTeX) e una riga di tasti sul telefono (frazione, potenza, radice, parentesi, π).
- Modi dello stesso strumento (le quattro percentuali, media semplice o ponderata): il `ToggleGroup` che il sito usa già.
- Unità: due menu con il bottone di scambio in mezzo.
- Calcolo dal vivo per formule e conversioni; bottone "Risolvi" (anche con Invio) per equazioni ed espressioni, dove un input a metà darebbe errori.
- Esempi cliccabili e "Azzera".
- L'input sta nell'indirizzo (`?a=12&b=18`), così un risultato si condivide; il canonical punta alla pagina senza parametri e le varianti non si indicizzano.
- Risultato in una regione `aria-live`, formule leggibili dagli screen reader (KaTeX con MathML), tutto usabile da tastiera.

Indirizzi: una sezione propria (proposta `/strumenti/<nome>`, con nomi come `calcolo-mcm-mcd`), un indice per categorie con le copertine come la biblioteca, e un link dalla lezione e dal formulario allo strumento dell'argomento.

Tecnica: il calcolo gira nel browser con aritmetica esatta. I generatori di esercizi hanno già razionali, radicali, LaTeX e passaggi (`src/lib/exercises/v2/`): i risolutori possono partire da lì, con gli stessi controlli di correttezza.

Dati strutturati: `WebApplication` e `BreadcrumbList` su ogni strumento. I risultati FAQ e HowTo non compaiono più su Google (FAQ dal 7 maggio 2026, Search Engine Journal, 10 maggio 2026), ma le domande frequenti restano utili ai lettori e alle risposte AI. Il markup `MathSolver` per i risolutori gratuiti: supporto per l'italiano da verificare.

## Leggibilità
Richiesta di Alessandro del 27 settembre 2026: chi cerca uno strumento spesso non sa fare quel calcolo, e tra questi molti studenti con DSA; come sono scritti e impaginati spiegazione e dati conta moltissimo. Nella prima versione le formule andavano a capo a metà ("6x − 12 + 2 = x +" su una riga, "8" sulla successiva), i risultati con più valori stavano in fila e le liste di valori erano separate da virgole.

Fonti consultate il 27 settembre 2026: British Dyslexia Association, Dyslexia Style Guide (2023); Università di Udine, indicazioni per lezioni, slide e dispense accessibili (23 gennaio 2021); DfES 0512/2001, Guidance to support pupils with dyslexia and dyscalculia (settembre 2001); W3C, Making Content Usable for People with Cognitive and Learning Disabilities (COGA, 29 aprile 2021); Linee guida MIUR per i DSA (12 luglio 2011, lette da una sintesi, da verificare sull'originale); studi sul carico cognitivo (Sweller, van Merriënboer e Paas 1998; Catrambone 1998; Atkinson, Renkl e Merrill 2003); Rello e Baeza-Yates (2013) sui caratteri; meta-analisi di Azzarello e altri (Annals of Dyslexia, luglio 2026) sui font "per dislessici", senza beneficio misurabile.

Regole applicate (dettaglio in `docs/strumenti.md`):
- Un passaggio è una trasformazione: una frase breve all'imperativo, poi il calcolo su righe proprie, ognuna con il risultato intermedio.
- Nessuna formula va a capo a metà: se è larga scorre di lato.
- Le liste di valori stanno in tabella, mai separate da virgole (con la virgola decimale "2, 3" si legge 2,3).
- Ciò che cambia in un passaggio è evidenziato con tinta e sottolineatura, mai solo con il colore.
- Il risultato è una riga per valore, con un'etichetta a parole.
- I passaggi stanno sotto input e risultato, in righe di al massimo 70 caratteri, testo a 17 px con interlinea 1,65; oltre cinque passaggi sono raggruppati sotto un sottotitolo.
- Si possono aprire i passaggi uno alla volta.
- Gli articoli hanno la stessa larghezza e i calcoli degli esempi su righe separate.

Non ancora fatto: una versione a parole di ogni formula per la sintesi vocale (KaTeX affida la lettura al MathML nascosto, che alcuni lettori vocali ignorano: da provare con VoiceOver e con i lettori usati nelle scuole, come LeggiXme ed ePico); mostrare accanto al campo il valore letto ("Hai scritto 2,5"); le catene di uguaglianze allineate sul segno "=".

## Domande aperte
- Indirizzo della sezione: per ora `/strumenti` (scelta di Claude, reversibile finché il sito non è indicizzato).
- Quanti strumenti nella prima onda e se entrano prima della beta.
- Pagine per singolo valore ("scomposizione in fattori primi di 72", "massa molare di NaOH"): hanno domanda, ma vanno limitate a un insieme curato per non cadere nel contenuto prodotto in serie.
- Strumenti della vita scolastica: le regole di crediti e maturità cambiano ogni anno (per la maturità 2027 da verificare); chi le aggiorna.
- Derivate, integrali e limiti: se e quando, e con quale motore.

## Collegamenti
- [[Strumenti DSA]], [[SEO]], [[Azioni SEO]], [[Dieci punti dai concorrenti]], [[Lezioni]], [[Esercizi]]
