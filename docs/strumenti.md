# Strumenti: come si costruisce un calcolatore

I calcolatori e i convertitori gratuiti di `/strumenti`. Il perché, la lista e la pagina tipo sono nel vault, in
`vault/Prodotti/Studenti/Calcolatori e convertitori.md`. Qui c'è come si scrive uno strumento nuovo, così che tutti
abbiano lo stesso aspetto e gli stessi controlli. Esempi completi: `calcolo-mcm` (una lista di numeri),
`calcolo-percentuale` (più modi, due campi).

## Quando uno strumento sì e quando no

Uno strumento non è una lezione. Prima di aggiungerne uno, deve valere almeno una di queste due condizioni:

1. **Il calcolo è da strumento**: chi apre la pagina ha già dei numeri in mano, e il calcolo è lungo, noioso o facile
   da sbagliare (scomposizione, sistemi, massa molare, conversioni, varianza, resistenze in parallelo). Una formula
   di tre lettere da invertire (F = m·a, L = F·s) non basta: lì il valore è capire la formula, e quello è della
   lezione o del formulario.
2. **Le ricerche sono da strumento**: la ricerca ("calcolo densità", "da kW a CV") ha volume, e in cima ai risultati
   di Google ci sono calcolatori, non spiegazioni. Allora la pagina prende traffico che una lezione non
   prenderebbe, e si fa anche se il calcolo è semplice. Se in cima ci sono spiegazioni e video, l'argomento resta
   alla lezione.

In entrambi i casi l'articolo sotto lo strumento resta corto (come si fa a mano, un esempio, gli errori frequenti) e
il perché lo lascia alla lezione, collegata con "Impara". La sovrapposizione con la lezione va bene, perché l'intento
è diverso; il testo però non si copia da una all'altra.

## I file di uno strumento

Per uno strumento con indirizzo `/strumenti/<slug>`:

1. **Il motore**, `src/lib/tools/<nome>.ts`: funzioni pure dagli input (stringhe, come le scrive lo studente) a un
   `Outcome` (`src/lib/tools/types.ts`). Nessun import da React o dal server: gira sul server per l'esempio e nel
   browser mentre lo studente scrive.
2. **I test**, `tests/unit/tools-<nome>.test.mjs`, sul modello di `tests/unit/tools.test.mjs`: casi normali, casi
   limite, input sbagliati, e dove si può un controllo a forza bruta su molti valori.
3. **I controlli**, `src/components/tools/<Nome>Tool.tsx`, componente client: `useToolState` per gli input,
   `ToolSheet` con `ToolField`, `toolInputClass`, `ModeSwitch` o `ToggleGroup`, `Examples`.
4. **L'articolo**, `src/content/strumenti/<slug>.md`: le prime due righe sono il titolo e una riga vuota (le salta
   il renderer). Poi `## Che cos'è`, `## Come si calcola a mano` con uno o due esempi in un blocco ```` ```ad-example ````,
   gli errori frequenti in un blocco ```` ```ad-error ````, `## Domande frequenti` con due o tre `###`. Tra 250 e 450
   parole. Formule con `$…$` e `$$…$$`.
5. **La scheda nel registro**, `src/lib/tools/registry.ts` (`ToolMeta`), e **il componente** in
   `src/components/tools/registry.ts`. Nella scheda, `sample` è un esempio svolto brevissimo in LaTeX
   (`'\\text{mcm}(12, 18) = 36'`), che compare sulla carta dell'indice e fa riconoscere lo strumento a colpo
   d'occhio: al massimo una ventina di caratteri a video, una riga sola (o due, come un sistema), niente virgole
   come separatori. `keywords` sono i sinonimi che la ricerca dell'indice deve trovare (`['sconto', 'iva']`).
   Il disegno della carta va in `src/components/tools/art/<categoria>.tsx`, con le primitive e le regole di
   `art/primitives.tsx` (griglia 120 × 80, un solo elemento in rosso: quello che lo strumento trova).
6. Uno strumento con più pagine (area e perimetro, una per figura) ha un motore solo e una voce di registro per
   pagina.

## Leggibilità: le regole per i DSA

Gli strumenti li cercano soprattutto studenti che non sanno fare quel calcolo, e tra loro molti con DSA (dislessia,
discalculia) o disturbi dell'attenzione. Le regole vengono dalle linee guida della British Dyslexia Association
(Dyslexia Style Guide, 2023), dell'Università di Udine per i materiali didattici (2021), del DfES inglese su dislessia
e discalculia (2001), del W3C per le disabilità cognitive (COGA, 2021) e dalla teoria del carico cognitivo (Sweller
1998, Catrambone 1998, Renkl e Atkinson 2003). Dettagli nel vault, nota "Calcolatori e convertitori".

1. **Un passaggio, una trasformazione.** `say` è una frase sola, breve (al massimo 15 parole circa), all'imperativo:
   "Moltiplica i fattori scelti." Niente calcoli dentro la frase: al massimo un simbolo o un numero ($x$, $12$).
2. **Il calcolo va in `math`, una riga per voce.** Ogni riga è una formula intera: il componente la mette su una
   riga sua e non la spezza mai (se è più larga dello schermo scorre di lato). Una catena lunga si divide in più
   righe che cominciano con "=", ognuna con il suo risultato intermedio:
   `['\\text{mcm}(12, 18) = 2^2 \\cdot 3^2', '= 4 \\cdot 9', '= 36']`.
3. **Le liste di valori vanno in `table`**, mai separate da virgole (con la virgola decimale "2, 3" si legge 2,3):
   i numeri e le loro scomposizioni, i dati ordinati, le cifre con le potenze della base. Intestazioni brevi.
4. **Evidenzia ciò che cambia** con `\\hl{…}` dentro la formula: il risultato di quel passaggio, il fattore scelto,
   il termine che si sposta. Il componente lo colora e lo sottolinea (mai solo colore). Uno o due per passaggio.
5. **`then` per la conclusione** a parole, quando serve ("Il segno è meno: è una diminuzione del 15%.").
6. **Più di cinque passaggi: raggruppali** con `group` sul primo passaggio di ogni parte ("Il discriminante",
   "Le soluzioni").
7. **Il risultato sono righe `rows`**, una per valore, con un'etichetta a parole che dice cos'è ("Area",
   "Minimo comune multiplo di 12 e 18") e il valore con la sua unità. Il valore è solo il valore ("$36$",
   "$25\\pi \\text{ cm}^2 \\approx 78{,}54 \\text{ cm}^2$"), senza ripetere il calcolo.
8. **Numeri** con la virgola decimale e lo spazio sottile per le migliaia da 10 000 in su (`decimalTex`, `intTex`).
9. **Errori** che dicono cosa fare, con un esempio: "Scrivi un numero intero maggiore di 0, per esempio 12."
10. **Articolo**: una definizione in una frase all'inizio, un esempio svolto prima della regola generale, paragrafi
    di al massimo quattro righe, ogni termine tecnico spiegato la prima volta. I calcoli degli esempi fuori dalle
    frasi: un calcolo di più righe va in un solo blocco `$$\begin{aligned} … \end{aligned}$$` allineato sul segno
    "=" (righe `$$` separate vengono centrate e lontane, e sembrano formule diverse).

## Il motore

- Input come stringhe; numeri letti con `parseDecimal`, `parseNatural`, `parseNaturalList`, `parseDecimalList`
  (`src/lib/tools/numbers.ts`): virgola decimale, punti delle migliaia, aritmetica esatta con `Rational`
  (`src/lib/exercises/v2/rational.ts`). I generatori di esercizi in `src/lib/exercises/v2/` hanno già molto da
  riusare: `factorize`, `factorsLatex`, `divisionTable`, `parseAscii` ed `exprSteps` in `naturali.ts`, i polinomi
  in `latex.ts`, i radicali in `surd.ts`.
- Numeri nell'output con `decimalTex` e `decimal` (virgola, spazio sottile per le migliaia, "≈" quando è
  arrotondato), `intTex` e `intText` per gli interi.
- `rows`, `copy` e `steps` come nelle regole di leggibilità qui sopra (tipi in `src/lib/tools/types.ts`); esempi
  completi in `mcm-mcd.ts` e `percentuale.ts`.
- Un input sbagliato dà `fail('…')` con una frase che dice cosa scrivere ("Servono almeno due numeri."), mai
  un'eccezione. Limiti ragionevoli sulla dimensione degli input.
- Ogni risultato è controllato dai test. Un risultato sbagliato su una pagina che dice "con i passaggi" è peggio di
  nessuna pagina.

## I controlli

- Numeri: `inputMode="decimal"` (o `numeric` per gli interi), `autoComplete="off"`, classe `toolInputClass`.
- Più modi dello stesso strumento: `ModeSwitch` (griglia, due per riga sul telefono); due scelte brevi:
  `ToggleGroup` di `src/components/ui/ToggleGroup.tsx`.
- Unità: due `select` con un bottone di scambio in mezzo.
- Gli input stanno in `useToolState(DEFAULTS)`: le chiavi finiscono nell'indirizzo (`?n=12%2C18`), quindi sono
  corte e in italiano (`n`, `a`, `b`, `modo`, `da`, `a`). I `DEFAULTS` sono l'esempio con cui la pagina si apre, e
  devono dare un risultato con passaggi interessanti.
- Il risultato si calcola a ogni battuta con `useMemo`. Per gli strumenti dove un input a metà dà solo errori
  (equazioni, espressioni) va bene lo stesso, purché l'errore sia gentile ("Scrivi un'equazione in x, per esempio
  2x + 3 = 7").
- `Examples` con tre o quattro esempi cliccabili.

## Controlli prima di finire

- `node --test tests/unit/tools-<nome>.test.mjs`
- `npx eslint --max-warnings=0` e `npx tsc --noEmit -p .` sui file toccati.
- La pagina aperta sul server di sviluppo: risultato e passaggi nell'HTML (`curl`), niente errori in console.
- Testi: niente trattini lunghi, niente "piuttosto che" come contrasto, grassetto raro.
