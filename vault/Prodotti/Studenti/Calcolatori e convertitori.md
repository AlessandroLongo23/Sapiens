---
stato: bozza
release: da decidere
aggiornato: 2026-09-27
tag: [prodotto, studenti, seo, dsa]
---
# Calcolatori e convertitori

Strumenti gratuiti, una pagina ciascuno, che risolvono un calcolo o una conversione con i passaggi e portano alla lezione e agli esercizi dello stesso argomento. Servono a tre cose: aiutano lo studente mentre studia, sono strumenti compensativi per chi ha un DSA ([[2026-09-23 Formulari e calcolatrici gratuiti]]), e prendono ricerche che le lezioni non prendono ("mcm online" è la prima fonte di traffico di Theoremz secondo Similarweb, agosto 2026, stima).

## Stato attuale
Nessuno strumento nel codice. [[Strumenti DSA]] cita calcolatrice, calcolatrice scientifica e convertitore di unità dalla bozza originale.

## Cosa fanno gli altri
Ricerca del 27 settembre 2026, dettagli in `reports/` e nella sessione [[2026-09-26 SEO e scheda degli esercizi]].
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

## Domande aperte
- Indirizzo della sezione: `/strumenti`, `/calcolatori` o altro.
- Quanti strumenti nella prima onda e se entrano prima della beta.
- Pagine per singolo valore ("scomposizione in fattori primi di 72", "massa molare di NaOH"): hanno domanda, ma vanno limitate a un insieme curato per non cadere nel contenuto prodotto in serie.
- Strumenti della vita scolastica: le regole di crediti e maturità cambiano ogni anno (per la maturità 2027 da verificare); chi le aggiorna.
- Derivate, integrali e limiti: se e quando, e con quale motore.

## Collegamenti
- [[Strumenti DSA]], [[SEO]], [[Azioni SEO]], [[Dieci punti dai concorrenti]], [[Lezioni]], [[Esercizi]]
