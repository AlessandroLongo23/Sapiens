---
aggiornato: 2026-10-06
tag: [sessione, contenuti, fisica]
---
# Terzo anno di fisica

Sessione del 6 ottobre 2026, seguito di [[2026-09-30 Terzo lotto di fisica]]. Alessandro ha chiesto lezioni, esercizi, flashcard e formulari del terzo anno di fisica delle superiori, con le figure interattive e le figure TikZ. Il lotto è scritto e verificato: 49 lezioni, file 71-119, in nove capitoli. Non è committato né pubblicato: aspetta il via libera di Alessandro.

- La dinamica e la relatività galileiana (6 lezioni, 71-76)
- Il lavoro e le forze conservative (3, 77-79)
- La quantità di moto (6, 80-85)
- Il corpo rigido e il momento angolare (6, 86-91)
- La gravitazione (6, 92-97)
- La meccanica dei fluidi (4, 98-101)
- La temperatura e i gas (5, 102-106)
- Il primo principio della termodinamica (7, 107-113)
- Il secondo principio della termodinamica (6, 114-119)

Con questo lotto le lezioni di fisica scritte sono 119 su 219.

## Cosa si è fatto
- Prima del lotto (Claude):
  - il brief `docs/lezioni/fisica/brief-terzo-anno.md`, con le regole per lavorare in una cartella condivisa, che cosa sa lo studente del terzo anno (niente goniometria, derivate, integrali), i confini tra le 49 lezioni e la forma del rapporto;
  - nel README di fisica la sezione "Notazioni del terzo anno", valida per tutti i gruppi;
  - i commenti dei gruppi 30-44 nei due registri (`src/lib/utils/interactive.ts` e `src/components/content/exercises/scenes/index.tsx`).
- Quindici gruppi in parallelo, da 2 a 4 lezioni ciascuno. Ogni lezione ha testo, nota, formulario, flashcard, figure TikZ, almeno una figura interattiva registrata, specifica degli esercizi, generatore e controllo Python indipendente.
- Dopo i gruppi (Claude): i 49 generatori collegati al sito in `index.ts`, `config.ts` e `level-names.ts`; i rapporti dei gruppi salvati in `docs/lezioni/fisica/rapporti-terzo-anno.md`.

## Numeri
- 49 lezioni, circa 1.076.000 caratteri (da 16.000 a 28.600 l'una), 221 figure TikZ, 53 figure interattive, 926 flashcard.
- 49 generatori, 283 livelli, tutti a scelta multipla; 21 scene nuove per gli esercizi (lancio obliquo, grafici forza-spostamento, orbite, tubi, serbatoio, cilindro con pistone, piano pressione-volume, macchina termica, molecole).
- Moduli comuni nuovi degli esercizi: `fis-rotazioni.ts`, `fis-urti.ts`, `fis-fluidi-moto.ts`, `fis-riferimenti.ts`, `fis-keplero-newton.ts`, `fis-calori-adiabatica.ts`. Pezzi nuovi delle figure: `fisica/pianoPV.tsx`, `fisica/molecole.tsx`, `fisica/flussiCalore.tsx`, `fisica/sorgenti.tsx`, `fisica/gravita.ts`.

## Cosa si è deciso mentre si scriveva
Sono scelte di chi ha scritto, da confermare con Andrea: vedi [[Domande per Andrea]].
- Negli urti le velocità prima sono $v_1$ e $v_2$, quelle dopo $V_1$ e $V_2$.
- Primo principio $\Delta U = Q - W$, con il lavoro compiuto dal sistema positivo.
- Sorgenti $T_c$ e $T_f$, calori $Q_c$ e $Q_f$ in valore assoluto; $\text{COP}_f$ e $\text{COP}_p$ per frigorifero e pompa di calore.
- Microstati $\Omega$ nell'equazione di Boltzmann, perché $W$ è il lavoro.
- Forza centrifuga $F_{cf}$ (nella 57 $F_c$ è la centripeta), forze apparenti disegnate tratteggiate, forza di Coriolis senza formula.
- Gittata $L$ (la 56 del biennio usa $x_G$).
- Il coseno di un angolo ottuso entra nella 71 con $\cos(180^\circ - \alpha) = -\cos\alpha$; $\ln$ si usa come tasto della calcolatrice nell'isoterma e nell'entropia.

## Verifiche
- `check.mts` sui 147 file (lezioni, formulari, flashcard): nessun errore. Restano avvisi sui titoli con un nome proprio (Keplero, Boltzmann, Carnot), scambiati per maiuscole all'inglese, e nella 107 14 grassetti contro una soglia di 12.
- I conti delle lezioni rifatti in Python dai gruppi; le figure TikZ guardate in chiaro e in scuro.
- Ogni generatore: 1000 esercizi per livello con i seed 1, 50001 e 777001 dai gruppi; poi tutti insieme con un quarto seed, 300 per livello: tutti PASS. `review.mts` e `width.mts` a 0.
- `tsc` sull'intero progetto senza errori dopo il collegamento; ESLint pulito sui file del lotto.
- Nel browser, in sviluppo, a 390 px: le 49 lezioni su `/prova-grafico/lezione`, con tutte le 53 figure interattive montate, nessun errore di KaTeX, nessuna immagine mancante, nessuno scorrimento laterale della pagina, nessun errore in console.
- Le figure interattive guardate dai gruppi su `/prova-fisica` in chiaro, in scuro e da telefono, agli estremi dei cursori.

## Informazioni nuove
- Quindici gruppi insieme hanno portato la macchina a carico 130 e il sito di sviluppo è caduto; poi il limite di sessione ha fermato 13 gruppi a metà. Ripresi con un comando pesante alla volta e senza `tsc` nei gruppi, hanno chiuso tutti. Per il prossimo lotto: meno gruppi insieme, oppure la regola fin dall'inizio.
- Il file `scenes/index.tsx` è stato riscritto una volta da un'altra sessione e le righe di un gruppo sono sparite; rimesse e ricontrollate alla fine (tutte le figure e le scene del lotto sono registrate).
- Nel kit mancano ancora, e sono stati riscritti in più file: assi con le tacche numerate, la quota con due frecce, il cilindro con il pistone, la freccia curva del verso di rotazione, un corpo che rotola, un'ellisse, un tubo a sezione variabile, i numeri con decimali fissi e in notazione scientifica. L'elenco completo è in `docs/lezioni/fisica/rapporti-terzo-anno.md`.
- Doppioni da unire: `flussiCalore.tsx` e `sorgenti.tsx` (schema della macchina termica); `molecole.tsx` e le molecole di `chimica/gas.tsx`; le scene `piano-pv`, `curve-pv` e `ciclo-carnot`.

## Limiti
- Le formule più lunghe degli esempi sono più larghe della colonna sul telefono (fino a 955 px, contro i 620-720 delle lezioni del biennio) e scorrono nel loro riquadro. I gruppi 32 e 34 ne hanno spezzate 17; le altre lezioni no.
- La scena `piano-pv` su un ciclo di Carnot mette il nome di uno stato sopra un altro punto, e nel tema scuro la griglia si legge poco. La scena `asta-forze` del biennio scrive l'angolo sopra la freccia sotto i 30 gradi.
- Il generatore della 76 può dare come risposta giusta un numero con lo zero ambiguo (20 m).
- Poca varietà in quattro livelli: 47, 82, 231 e 310 esercizi diversi su 1000 (gruppi 36 e 41).
- Errori piantati non bocciati dal controllo Python dove il dato cambiato non sposta il risultato arrotondato (56 su 200 nel gas perfetto) o tocca solo numeri di disegno della scena (gruppo 32): da ricontrollare a mano.
- Le specifiche delle lezioni 78-81 hanno un esempio solo per i primi livelli.
- I gruppi che scrivevano lezioni vicine in parallelo non hanno potuto leggersi: da confrontare 86-88 con 89-91, 92-94 con 95-97, 104 e 111 con 114-119.
- Costanti, dati tabulati, date e fatti storici sono scritti a memoria ed elencati sotto "Da verificare" in ogni nota; la 92 e la 93 ne hanno più delle altre.
- Nessun livello a risposta aperta, come nel resto della fisica. Niente provato su un telefono vero, su Safari o su Firefox.

## Da sapere prima di pubblicare
- `publish.mts --dir docs/lezioni/fisica` non ha un filtro: nella cartella ci sono anche lezioni del biennio modificate da altre sessioni e non pubblicate.
- L'ordine: prima il codice (generatori, figure, scene) su master e in produzione, poi le lezioni. Poi `scripts/fisica/indice.mts` per rigenerare `url.md`.
- Le lezioni rimandano a lezioni di matematica del terzo anno (logaritmi) e di chimica che vanno pubblicate prima o insieme.

## Prossimo argomento
Il via libera di Alessandro per commit e pubblicazione. Prima, un giro sui limiti qui sopra (formule larghe, `piano-pv`, zero ambiguo, coerenza tra lezioni vicine). Poi il kit, che è alla terza richiesta degli stessi pezzi, e il quarto anno di fisica (onde, suono, luce, elettricità e magnetismo).

## Collegamenti
- [[Pipeline lezioni]], [[Pipeline esercizi]], [[Lezioni]], [[Domande per Andrea]]
- [[2026-09-30 Terzo lotto di fisica]], [[2026-09-29 La fisica si pubblica gratis accanto alla beta]], [[2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle degli esercizi si disegnano con il kit]]
