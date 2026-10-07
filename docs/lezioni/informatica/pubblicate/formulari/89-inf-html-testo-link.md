# Formulario: Testo, link e immagini

## Dentro un paragrafo

| Elemento | Che cosa dice | Come lo mostra il browser |
|---|---|---|
| `<em>…</em>` | enfasi: la parola su cui cade la voce | corsivo |
| `<strong>…</strong>` | importanza: da non perdere | grassetto |
| `<br>` | a capo dentro lo stesso paragrafo; non si chiude | una riga nuova |

- Uno dentro l'altro: `<strong>ingresso <em>gratuito</em></strong>`. L'ultimo aperto si chiude per primo.
- `<br>` solo dove l'a capo fa parte del testo (versi, indirizzi). Per staccare due discorsi: due `<p>`.

## Link

```html
<a href="concerti.html">Le date dei concerti</a>
```

| Valore di `href` | Dove porta |
|---|---|
| `https://www.scuola.example/orario.html` | indirizzo assoluto: un URL intero, anche su un altro sito |
| `concerti.html` | un file nella stessa cartella della pagina |
| `foto/palco.html` | un file nella cartella `foto`, che sta accanto alla pagina |
| `../index.html` | un file nella cartella sopra |
| `/img/logo.png` | un file a partire dalla radice del sito |
| `#contatti` | l'elemento di questa pagina con `id="contatti"` |
| `concerti.html#giugno` | l'elemento con `id="giugno"` della pagina `concerti.html` |

Scrivere un percorso relativo:

1. Parti dalla cartella della pagina in cui scrivi il link.
2. Per ogni cartella da cui devi uscire scrivi `../`.
3. Aggiungi le cartelle in cui entri, separate da `/`.
4. In fondo metti il nome del file.

Da `concerti/date.html` a `img/logo.png`: `../img/logo.png`. Da `concerti/natale/scaletta.html`: `../../img/logo.png`.

- `id`: un nome che nella pagina ha un solo elemento.
- Il testo del link dice dove porta: "Le date dei concerti", non "clicca qui".

## Immagini

```html
<img src="img/logo.png" alt="Il logo dei Fuori Tempo: un disco in vinile" width="120" height="120">
```

| Attributo | Che cosa dice |
|---|---|
| `src` | dove sta il file: percorso relativo o indirizzo assoluto, come in `href` |
| `alt` | il testo alternativo: quello che l'immagine comunica |
| `width`, `height` | larghezza e altezza in pixel, senza unità |

- `<img>` non ha un tag di chiusura.
- `alt` compare quando l'immagine non arriva, viene letto a chi non vede, serve ai motori di ricerca. Immagine solo decorativa: `alt=""`.
- Con una sola misura l'altra è calcolata in proporzione; con due misure in un rapporto diverso da quello del file l'immagine si deforma.
- Un'immagine come link: `<a href="index.html"><img src="img/logo.png" alt="Home"></a>`.

```ad-warning
Errori da non fare
`href="www.scuola.example"` senza `https://` è letto come un percorso relativo. Un `../` in più o in meno, o una maiuscola diversa, rompono il link. `width` e `height` non alleggeriscono il file: una foto grande si ridimensiona prima.
```
