# I formati dei file multimediali

Generatore: `formati-multimediali` (`src/lib/exercises/v2/generators/formati-multimediali.ts`, con gli aiuti di
`inf-programmi.ts` e di `inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/formati_multimediali.py`.
Lezione collegata: `docs/lezioni/informatica/riscritte/82-formati-multimediali.md`.

Cinque livelli, tutti a scelta multipla con quattro opzioni di testo (campioni in testo semplice). La lezione non ha
un conto: i livelli chiedono di riconoscere e di scegliere, a partire da nomi di file, primi byte e situazioni.

## Nomi dei livelli

1. Che cosa c'è nel file
2. Il nome o il contenuto
3. Il formato con queste proprietà
4. Il formato per lo scopo
5. Contenitori, codec, formati aperti

## Livello 1: che cosa c'è nel file

"Anna riceve un file che si chiama musica.png e non è stato rinominato. Che cosa contiene?" Sei nomi (gita, musica,
foto, filmato, appunti, lezione) per sedici estensioni: jpg, png, gif, svg, webp (immagine); wav, mp3, flac (suono);
mp4, webm, mkv, avi (video); txt, odt, pdf, docx (documento di testo). Opzioni fisse: Un'immagine; Un suono; Un video;
Un documento di testo. Il nome può indicare un'altra famiglia (musica.png): decide l'estensione. Le quote seguono il
numero delle estensioni (5, 3, 4, 4 su 16).

## Livello 2: il nome o il contenuto

- firma (7 su 10): "Tommaso riceve un file che si chiama gita.jpg. I suoi primi byte, in esadecimale, sono 89 50 4E
  47. Le firme: PNG 89 50 4E 47, JPEG FF D8 FF, GIF 47 49 46 38, PDF 25 50 44 46. Che cosa contiene il file?"
  Risposta: Un'immagine PNG. Le firme sono scritte nel testo, perché non si chiede di ricordarle: si chiede di
  seguire i byte e non il nome. Estensione e firma sono estratte separatamente tra le quattro: in un caso su quattro
  coincidono (caso `coerente`), negli altri il file è stato rinominato (caso `rinominato`) e l'opzione che segue
  l'estensione è tra le sbagliate.
- situazioni (3 su 10): rinominare gita.jpg in gita.png (cambia solo il nome); come si ottiene davvero un PNG
  (esportando); canzone.mp3 rinominato in .jpg (si apre il programma sbagliato); da FLAC a MP3 e ritorno (la qualità
  resta quella dell'MP3).

## Livello 3: il formato con queste proprietà

"Luca cerca un formato di immagine senza perdita in cui ogni pixel abbia il suo grado di trasparenza. Quale di
questi fa al caso?" Undici richieste scritte con le proprietà delle tabelle della lezione: con perdita (JPEG);
senza perdita con trasparenza sfumata (PNG); animazione (GIF, senza WebP tra le opzioni); vettoriale (SVG); nessuna
compressione (BMP); con o senza perdita, trasparenza e animazione (WebP); audio senza perdita (FLAC); audio non
compresso (WAV); le pagine come vanno stampate (PDF); solo i caratteri (TXT); un contenitore (MP4, WebM o MKV). Un
formato che soddisfa la richiesta e tre che non la soddisfano.

## Livello 4: il formato per lo scopo

Dieci situazioni con un nome estratto, il formato giusto con il suo motivo e quattro scelte sbagliate (se ne
mostrano tre): le foto per il sito (JPEG), il logo (SVG), la schermata con il testo (PNG), la breve animazione
(GIF), lo stemma senza rettangolo bianco (PNG), la relazione da consegnare (PDF), il giornalino in lavorazione (ODT o
DOCX), il concerto da conservare (FLAC), l'intervista da mandare (MP3), i temi da riaprire tra vent'anni (un formato
aperto). Le opzioni sbagliate sono gli errori della lezione: PNG per una foto, JPEG per testo e bordi netti, JPEG
per la trasparenza, PDF per un documento da correggere.

## Livello 5: contenitori, codec, formati aperti

"Quale di queste affermazioni sui formati è vera?" (una vera tra tre false) oppure "è falsa?" (una falsa tra tre
vere), metà e metà. Otto vere e otto false: l'estensione di un video indica il contenitore; due MP4 possono avere
codifiche diverse; aperto non vuol dire gratuito né senza compressione; cambiare estensione non cambia formato; un
DOCX è un archivio; il codec non è l'estensione.

## Esercizi da evitare

- Domande che chiedono di ricordare una firma, un anno o chi ha definito un formato.
- WebP tra le opzioni di una domanda la cui risposta è un altro formato con le stesse proprietà.
- Numeri sulla dimensione dei file nei vari formati: dipendono dall'immagine.

## Verifica

`formati_multimediali.py` legge l'estensione dal nome e la famiglia da una tabella sua; confronta i primi byte del
testo con le sue firme, qualunque sia il nome; per il livello 3 ha una tabella delle proprietà dei formati e, per ogni
richiesta, una condizione: esattamente un'opzione deve soddisfarla. Situazioni e affermazioni hanno le loro tabelle.

## Domande per la revisione

- Livello 1: "Un suono" e "Un documento di testo" per PDF vanno bene come nomi delle famiglie?
- Livello 3: GIF è la risposta per l'animazione solo quando WebP non è tra le opzioni. Va bene?
- Livello 4: per l'intervista la risposta è MP3; Opus e AAC non sono tra le opzioni.
