# Lezioni di fisica

Le lezioni di fisica delle superiori, scritte a lotti come quelle di matematica e pubblicate gratis un lotto alla
volta (vault: `Decisioni/2026-09-29 La fisica si pubblica gratis accanto alla beta.md`). Il programma è in
`programma.md`, l'albero in `albero.md`, già nel database dal 26 settembre 2026 (41 capitoli, 219 lezioni).
Le scelte sulle figure sono in `vault/Decisioni/2026-09-29 Le figure di fisica sono TikZ, le interattive e quelle
degli esercizi si disegnano con il kit.md`.

## File

Stessa struttura di `docs/lezioni/`, con il numero che viene da `originali/index.json` (la lezione in posizione i ha
il numero i + 1, a due cifre fino a 99):

- `riscritte/NN-slug.md`: la lezione. Lo slug è quello del database (`fis-grandezze-si`, `forze`).
- `formulari/NN-slug.md`: il formulario. `flashcard/NN-slug.md`: le flashcard.
- `note/NN-slug.md`: le note per Alessandro e Andrea: scelte fatte, dubbi, domande per la revisione.
- `url.md`: capitoli e lezioni di fisica con il loro indirizzo, per i link. Si rigenera con `scripts/fisica/indice.mts`,
  che riscrive anche `originali/index.json`.
- `pubblicate/`: l'ultima versione scritta nel database dallo script di pubblicazione.

Lo stile è quello di `../stile.md`, con le convenzioni di fisica qui sotto. Il controllo è lo stesso:

```sh
node node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/check.mts docs/lezioni/fisica/riscritte/*.md docs/lezioni/fisica/formulari/*.md docs/lezioni/fisica/flashcard/*.md
```

Per pubblicare (prima senza `--apply`):

```sh
node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/lezioni/publish.mts --dir docs/lezioni/fisica --apply
```

## Convenzioni di fisica

Scelte del 29 settembre 2026, da confermare con Andrea (vault: `Contenuti/Domande per Andrea.md`).

- Unità in tondo, dopo il numero con uno spazio sottile: `$9{,}8\,\text{m/s}^2$`, `$12\,\text{N}$`,
  `$2{,}5\,\text{kg}$`, `$1{,}2 \cdot 10^3\,\text{kg/m}^3$`. Nelle formule letterali le unità tra parentesi quadre
  solo quando si parla dell'unità: $[F] = \text{N}$. Gradi: `$30^\circ$`. Virgola decimale `{,}` come in matematica.
- Notazione scientifica con `\cdot`: `$3{,}0 \cdot 10^8\,\text{m/s}$`.
- Accelerazione di gravità $g = 9{,}8\,\text{m/s}^2$ (come l'Amaldi); $9{,}81$ solo dove serve la terza cifra, e
  lo si dice.
- Vettori con la freccia: `\vec{F}`, `\vec{v}`, `\vec{s}`; il modulo è la lettera senza freccia, $F$, oppure
  $|\vec{F}|$ quando serve distinguerlo. Componenti $F_x$ e $F_y$. Versori $\hat{x}$ e $\hat{y}$ solo se una lezione
  li introduce.
- Misure con incertezza: `$(12{,}3 \pm 0{,}1)\,\text{cm}$`; incertezza relativa in percentuale con la virgola.
- Cifre significative: i dati degli esempi e degli esercizi hanno di solito 2 o 3 cifre significative, e i
  risultati si arrotondano come insegna la lezione "Le cifre significative" (non più cifre dei dati). Negli esempi
  del primo capitolo, prima di quella lezione, si arrotonda in modo ragionevole e lo si dice.
- Nomi delle grandezze in corsivo (massa $m$, forza $F$, allungamento $\Delta l$, costante elastica $k$,
  coefficiente di attrito $\mu_s$ e $\mu_d$).
- Link alle lezioni di matematica che servono (proporzioni, seno e coseno, piano cartesiano, notazione
  scientifica) con gli indirizzi di `../url.md`; alle altre lezioni di fisica con quelli di `url.md`. Solo lezioni
  che esistono in quei file.

## Incertezze e cifre significative

Fissate nelle lezioni 04-08 (primo lotto, 29 settembre 2026) e valide per tutta la fisica:

- Incertezza di una serie di misure: la semidispersione $(x_{max} - x_{min})/2$. Per una misura sola, per misure
  tutte uguali o quando la semidispersione è più piccola della sensibilità, la sensibilità intera.
- Risultato: $(\bar x \pm \Delta x)\,\text{unità}$, con le parentesi; $\Delta x$ con una cifra significativa e il
  valore arrotondato alla stessa posizione, zeri finali compresi ($12{,}50$).
- Arrotondamento: si guarda la prima cifra tolta, da 5 in su si aumenta; nei passaggi una o due cifre in più.
- Incertezza relativa $\varepsilon = \Delta x / \bar x$, numero puro, o in percentuale.
- Propagazione nel caso peggiore: somme e differenze sommano le incertezze assolute, prodotti e quozienti le
  relative, una potenza $a^n$ ha $n\,\varepsilon_a$, un numero esatto $k$ dà $k\,\Delta a$.
- Compatibilità: due misure sono compatibili se gli intervalli si sovrappongono.
- Cifre significative: nelle somme e differenze il risultato ha i decimali del dato che ne ha meno, nei prodotti e
  quozienti le cifre significative del dato che ne ha meno; i numeri esatti non contano; gli zeri finali di un
  intero sono ambigui e si evitano con la notazione scientifica.

## Figure

### Statiche, in TikZ

Blocchi ` ```tikz ` con `% nome:` e `% alt:`, come in matematica; la pubblicazione compila con le librerie
`arrows.meta, decorations.pathmorphing, decorations.markings, patterns, calc` (non serve `\usetikzlibrary`). Per
guardarle:

```sh
node scripts/figure/anteprima.mjs /percorso/uscita docs/lezioni/fisica/riscritte/NN-slug.md [--scuro] [--solo nome]
```

Scrive un PNG con tutte le figure della lezione, alla scala del sito: va letto, figura per figura. I pezzi di
fisica si disegnano sempre così, perché le figure interattive (in `src/components/content/interactive/fisica.tsx`)
li disegnano uguali:

| Cosa | TikZ |
|---|---|
| Vettore, spostamento | `\draw[-{Stealth}, thick, blue] (A) -- (B) node[above] {$\vec{s}$};` |
| Forza | `\draw[-{Stealth}, thick, red] ...` |
| Velocità | `\draw[-{Stealth}, thick, blue!60!black] ...` |
| Accelerazione | `\draw[-{Stealth}, thick, green!50!black] ...` |
| Risultante (e ciò che deve risaltare) | `\draw[-{Stealth}, thick, orange!90!black] ...` |
| Componenti | la stessa freccia `dashed`, del colore del vettore; proiezioni `\draw[dashed, thin]` |
| Suolo, parete, soffitto | `\draw[thick] (0,0) -- (4,0);` e `\foreach \x in {0.15,0.3,...,4} \draw[thin] (\x,0) -- ++(-0.15,-0.15);` (niente `pattern=`: node-tikzjax non lo disegna) |
| Blocco | `\draw[thick, fill=blue!10] (x,0) rectangle ++(1,0.7);` |
| Piano inclinato | `\draw[thick, fill=gray!20] (0,0) -- (4,0) -- (4,2.3) -- cycle;` con l'angolo alla base segnato da un arco di raggio 0,6 |
| Molla | `\draw[decorate, decoration={zigzag, segment length=4pt, amplitude=3pt, pre length=4pt, post length=4pt}] (A) -- (B);` |
| Filo | `\draw (A) -- (B);` |
| Carrucola | `\draw[thick, fill=gray!20] (C) circle (0.3); \fill (C) circle (1pt);` |
| Punto materiale | `\fill (P) circle (1.5pt);` |
| Assi | `\draw[->] (-0.3,0) -- (4,0) node[right] {$x$};` come in matematica, griglia `\draw[gray!25, very thin] ... grid ...` |
| Fulcro, perno | un triangolo `\draw[thick, fill=gray!20] (x,0) -- ++(-0.2,-0.35) -- ++(0.4,0) -- cycle;` sopra un suolo; perno `\draw[thick, fill=white] (P) circle (2pt);` |
| Liquido | `\fill[cyan!20] ...;` con la superficie libera `\draw[thin] ...;`; recipiente `\draw[thick]` aperto in alto |
| Raggio di luce | `\draw[thick, orange!90!black, postaction={decorate}, decoration={markings, mark=at position 0.5 with {\arrow{Stealth}}}] (A) -- (B);`; un secondo raggio in `blue!70!black`; il prolungamento virtuale `\draw[thin, dashed, orange!90!black]` senza freccia |
| Asse ottico | `\draw[thin, dash dot] (x0,0) -- (x1,0);` |
| Normale | `\draw[thin, dashed] ...;` |
| Specchio piano | come una parete: linea `thick` e trattini ogni 0,12 sul retro |
| Specchio sferico | arco `thick` con i trattini sul retro; la luce arriva da sinistra |
| Lente sottile | convergente `\draw[{Stealth}-{Stealth}, thick, blue!60!black] (x,-h) -- (x,h);`, divergente `\draw[{Stealth[reversed]}-{Stealth[reversed]}, thick, blue!60!black] ...` |
| Fuoco, centro | `\fill (x,0) circle (1.5pt) node[below] {$F$};` |
| Oggetto, immagine | oggetto `\draw[-{Stealth}, very thick] (x,0) -- (x,h);`; immagine in `blue!70!black`, tratteggiata se virtuale |

Le frecce delle forze partono dal punto di applicazione; in un diagramma delle forze il corpo è un punto o un
blocco, con le forze che partono dal centro. Le lunghezze delle frecce sono in scala quando la figura dà i
moduli.

I grafici (spazio-tempo, allungamento-forza, massa-volume) si disegnano come quelli delle lezioni di matematica:
TikZ con assi, griglia e `plot`, niente pgfplots. Un grafico che andrà reso interattivo quando esisterà il piano
cartesiano del kit ha, sotto `% alt:`, la riga `% poi-interattivo: <cosa si potrà fare>`: è un commento di TeX e non
cambia il disegno.

### Interattive

Un blocco ` ```interattivo ` con `% nome:` e `% alt:` (vedi le lezioni di matematica, per esempio la 51) diventa
sul sito il componente con quel nome. I componenti di fisica stanno in `src/components/content/interactive/fisica/`,
un file per figura, e usano `kit.tsx` (cornice, etichette, punti da trascinare, animazioni, cursori) e `fisica.tsx`
(frecce, vettori, componenti, suolo, blocchi, molle, fili, piano inclinato, carrucole, assi): mai disegni fatti a
mano di pezzi che quei file hanno già. Altri pezzi pronti, in `interactive/fisica/`: `ottica.tsx` (raggi, cammini
riflessi e rifratti, asse ottico, normale, specchi piani e sferici, lenti sottili, fuochi, oggetto e immagine, più
`reflect`, `refract`, `criticalAngle`, `imageDistance`, `magnification`), `Dinamometro.tsx` (il dinamometro con la
sua scala), `griglia.tsx` (griglia con punti che scattano, nome di un vettore con il meno davanti) e `nomi.ts`
(nomi delle frecce messi senza sovrapposizioni); le tacche numerate sugli assi sono in
`exercises/scenes/GraficoDati.tsx`. Si registrano in `FIGURES` di `src/lib/utils/interactive.ts`, sotto il
commento del proprio gruppo. Esempio da seguire: `MotoIncontro.tsx` (cursore, bottone che avvia, lettura dei
valori sotto la figura). Niente motore fisico: i moti hanno la loro formula, e dove non ce l'hanno basta un passo
di integrazione scritto a mano.

Per guardarle serve il sito in sviluppo, acceso durante i lotti (il secondo lotto usa la porta 3001: aggiungi
`--porta 3001`):

```sh
node scripts/figure/anteprima-interattivo.mjs /percorso/figura.png figura=<nome> [--scuro] [--telefono] [--clic "button:has-text('Avvia')" --attendi 1500]
```

### Negli esercizi: le scene

Quando la figura di un esercizio cambia con i dati, il generatore mette nel campione una scena
(`scene: { type, data, alt }`, e `solutionScene` per la soluzione; vedi `src/lib/exercises/v2/types.ts`). La pagina
la disegna con il componente registrato per quel `type` in `src/components/content/exercises/scenes/index.tsx`, un
file per tipo in quella cartella, fatto con gli stessi pezzi del kit. Esempio: `BloccoForze.tsx` (tipo
`blocco-forze`). La cornice si calcola dai dati, lasciando spazio alle etichette oltre le punte delle frecce. Per
guardarla:

```sh
node scripts/figure/anteprima-interattivo.mjs /percorso/scena.png scena=blocco-forze 'dati={"forze":[{"nome":"F","modulo":30,"angolo":0}],"scala":0.06}' [--scuro] [--telefono]
```

La scena non deve dare la risposta: disegna i dati, non quello che lo studente deve trovare.

## Esercizi

Generatori in TypeScript come quelli di matematica (`scripts/exercises/README.md`): specifica in
`specs/exercises/<slug>.md`, generatore in `src/lib/exercises/v2/generators/<slug>.ts`, controllo indipendente in
`scripts/exercises/checkers/<slug con _>.py`. L'id è lo slug della lezione. Le risposte con unità sono a scelta
multipla, con l'unità nell'opzione, e i distrattori vengono dagli errori veri: unità non convertite, formula
rovesciata, componente scambiata, seno al posto del coseno, massa confusa con peso. I numeri si costruiscono
all'indietro, in modo che i risultati abbiano le cifre giuste senza arrotondamenti ambigui.
