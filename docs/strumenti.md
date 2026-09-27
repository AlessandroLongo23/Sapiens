# Strumenti: come si costruisce un calcolatore

I calcolatori e i convertitori gratuiti di `/strumenti`. Il perché, la lista e la pagina tipo sono nel vault, in
`vault/Prodotti/Studenti/Calcolatori e convertitori.md`. Qui c'è come si scrive uno strumento nuovo, così che tutti
abbiano lo stesso aspetto e gli stessi controlli. Esempi completi: `calcolo-mcm` (una lista di numeri),
`calcolo-percentuale` (più modi, due campi).

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
   `src/components/tools/registry.ts`.
6. Uno strumento con più pagine (area e perimetro, una per figura) ha un motore solo e una voce di registro per
   pagina.

## Il motore

- Input come stringhe; numeri letti con `parseDecimal`, `parseNatural`, `parseNaturalList`, `parseDecimalList`
  (`src/lib/tools/numbers.ts`): virgola decimale, punti delle migliaia, aritmetica esatta con `Rational`
  (`src/lib/exercises/v2/rational.ts`). I generatori di esercizi in `src/lib/exercises/v2/` hanno già molto da
  riusare: `factorize`, `factorsLatex`, `divisionTable`, `parseAscii` ed `exprSteps` in `naturali.ts`, i polinomi
  in `latex.ts`, i radicali in `surd.ts`.
- Numeri nell'output con `decimalTex` e `decimal` (virgola, spazio sottile per le migliaia, "≈" quando è
  arrotondato), `intTex` e `intText` per gli interi.
- `result`: la risposta in una riga, prosa con formule `$…$`. `copy`: la stessa in testo semplice. `steps`: i
  passaggi, uno per voce, frasi italiane all'imperativo di seconda persona ("Scomponi…", "Moltiplica…"), come le
  soluzioni degli esercizi, con le formule in `$…$`.
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
