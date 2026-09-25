# Adesivi di Sapiens: guida di stile e formato

Ogni adesivo nasce da questa guida. Se lo stile cambia, si cambia la guida e si rigenerano i file
(vedi vault/Decisioni/2026-09-26 Gli adesivi sono SVG scritti da Claude, senza aspettare Dario.md).

## Il carattere

Gli adesivi sono cultura matematica e scientifica vista dal quaderno di uno studente: simboli,
formule, diagrammi, strumenti, scritte brevi. Un adesivo dice una cosa sola e si legge a colpo
d'occhio anche piccolo, a 60 px. Niente personaggi, niente facce, niente mascotte (vedi
vault/Idee/Mascotte per materia.md). L'ironia è ammessa, sugli errori e sulla fatica, mai su una
persona.

Ogni adesivo di capitolo racconta l'idea centrale del capitolo con l'oggetto che uno studente
riconosce: il diagramma di Venn per gli insiemi, la bilancia per le equazioni, la retta dei numeri
per gli interi.

## Forma

- Il file disegna solo l'illustrazione, dentro il suo `viewBox`. Il bordo bianco fustellato (4 px
  per lato), gli angoli arrotondati e l'ombra li aggiunge il sito: l'adesivo finito è largo
  `viewBox + 8`.
- Il riquadro va da 56 a 150 px di lato. Il formato più comune è un quadrato di 96 o un rettangolo
  di 128 × 88; i nastri con una scritta arrivano a 150 × 60.
- Il fondo pieno riempie tutto il `viewBox` (un `rect` grande quanto lui): il sito ne arrotonda gli
  angoli con `data-radius`.
- Margine interno di almeno 8 px tra il bordo del `viewBox` e ciò che conta.

## Adesivi fustellati

Un adesivo può avere la forma del suo disegno: il π, i due cerchi di un Venn, le lettere di
un'equazione. Si scrive `data-cut="8"` al posto di `data-radius`: la build prende tutto ciò che il
disegno colora, lo allarga di quel margine in px (da 4 a 14), riempie i buchi e ne fa il bordo
bianco, arrotondato come quello di un adesivo tagliato. Regole:
- niente fondo pieno: il disegno è la forma;
- le parti devono stare abbastanza vicine perché il margine le unisca in una sagoma sola, altrimenti
  la build si ferma e lo dice; con lettere e numeri serve un margine di 8-10 e un tratto spesso
  (`font-weight="600"`);
- il margine si aggiunge fuori dal `viewBox`: un `viewBox` di 112 × 96 con `data-cut="8"` dà un
  adesivo di 128 × 112.

## Dimensione

Lo studente ingrandisce o rimpicciolisce ogni adesivo da 0,6 a 1,8 volte, mentre lo tiene in mano.
La misura del file è quella di partenza: si disegna pensando a come si vede a 1.

## Palette

Pochi colori, quelli del quaderno. Un adesivo ne usa al massimo tre, più il bianco carta.

| Nome | Colore | Uso |
|---|---|---|
| inchiostro | `#1b1e27` | tratti e testo su fondo chiaro |
| carta | `#fbfaf6` | fondo chiaro, testo su fondo scuro |
| rosso penna | `#c0352f` | il segno che conta: la curva, la soluzione, la correzione |
| quadretto | `#4f7fc0` | griglie, con opacità 0,25-0,35 |
| senape | `#e8b53e` | fondo caldo |
| verde lavagna | `#2f7a57` | fondo della geometria |
| blu | `#2b64a8` | fondo freddo |
| notte | `#1f2a44` | fondo scuro delle formule celebri |
| rosso timbro | `#b3302f` | fondo dei nastri e dei timbri |

Le griglie di fondo hanno passo 11 o 12 px, tratto di 1 px. I tratti principali sono di 2,4-2,8
px con estremi arrotondati; gli assi 1,2 px, all'inchiostro con opacità 0,55.

## Testo

- `font-family="serif"` è Fraunces, per le formule e le parole in corsivo; `"mono"` è JetBrains
  Mono, per le etichette maiuscole piccole (7-9 px, `letter-spacing` 1-1,2); `"math"` è il corsivo
  matematico di KaTeX; `"ams"` è il font AMS di KaTeX, dove `N`, `Z`, `Q`, `R`, `C` sono le lettere
  degli insiemi numerici (ℕ, ℤ, ℚ, ℝ, ℂ).
- I simboli che Fraunces non ha (π, φ, ∞, √, →, ≠, ≤, ∈, ∩, ∪) si prendono da KaTeX in automatico.
  Se un carattere non c'è in nessun font, la build si ferma e lo dice.
- Il testo è attributi e basta: `x`, `y`, `font-family`, `font-size`, `font-style`,
  `font-weight` (400 o 600; il mono anche 500), `text-anchor`, `letter-spacing`, `fill`,
  `fill-opacity`, `transform`. Dentro un `text` si possono usare dei `tspan` con `dx`, `dy` e gli
  stessi attributi di carattere, per esponenti e pedici. Nient'altro.
- La build converte il testo in tracciati: il file servito non dipende da nessun font.

## Formato del file

Un file per adesivo in `stickers/<pacchetto>/<id>.svg`. L'`id` è il nome del file, in minuscolo con
trattini, unico in tutto il catalogo, e non cambia mai: il database salva gli adesivi per `id`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"
     data-name="Insiemi" data-radius="20" data-accent="#c0352f"
     data-cover="high_school/math/insiemi-e-logica">
  <rect width="96" height="96" fill="#fbfaf6"/>
  …
</svg>
```

- `data-name`: il nome nell'album, breve.
- `data-radius`: raggio degli angoli dell'adesivo finito, da 8 a 30; oppure `data-cut` per un
  adesivo fustellato (vedi sopra).
- `data-accent`: il colore delle particelle quando si attacca; di solito il colore dominante.
- `data-cover` (facoltativo): la pagina su cui l'adesivo è attaccato di serie, con il percorso
  interno (`high_school/math/insiemi-e-logica`). Un adesivo di capitolo ha quello del suo capitolo.

Elementi ammessi: `g`, `path`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `text`,
`tspan`, `defs`, `clipPath`, `linearGradient`, `radialGradient`, `stop`. Niente `style`, `script`,
`image`, `foreignObject`, attributi `on…` o collegamenti esterni.

## Pacchetti

I pacchetti sono in `stickers/packs.json`, nell'ordine in cui compaiono nell'album. La cartella di
un adesivo è il suo pacchetto. Tipi (vault/Decisioni/2026-09-26 Pacchetti di adesivi per capitolo,
materia, studio e stagione.md): uno per capitolo di matematica, uno per materia, uno sullo studio, e
gli stagionali, che escono nel loro periodo e restano per sempre.

## Build

`npm run stickers` legge `stickers/`, controlla ogni file, converte il testo e scrive:
- `public/stickers/<id>.svg`, i file serviti;
- `src/lib/zaino/sticker-catalog.json`, l'indice che il sito legge;
- `stickers/foglio.html`, il foglio di prova con tutti gli adesivi (non si committa).

I file generati si committano insieme ai sorgenti. `npm run stickers -- --check` fallisce se non
sono aggiornati.
