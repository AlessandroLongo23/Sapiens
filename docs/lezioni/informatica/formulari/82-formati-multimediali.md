# Formulario: I formati dei file multimediali

## Formato, estensione, firma

- Formato di file: le regole che dicono come leggere i byte di un file.
- Estensione: la parte del nome dopo l'ultimo punto. È solo un pezzo del nome: si può cambiare senza cambiare i byte.
- Firma: i primi byte del file, sempre gli stessi per un formato. Dice che cosa c'è davvero dentro.

| Formato | Primi byte, in esadecimale |
|---|---|
| PNG | `89 50 4E 47` |
| JPEG | `FF D8 FF` |
| GIF | `47 49 46 38` |
| PDF | `25 50 44 46` |

- Conversione: un programma legge i dati con le regole di un formato e li riscrive con quelle di un altro ("Esporta", "Salva con nome").

## Contenitore e codifica

- Contenitore: il formato che tiene insieme più tracce (video, audio, sottotitoli) e le sincronizza.
- Codifica: come sono scritti i dati dentro una traccia. Il codec è il programma che codifica e decodifica.
- L'estensione di un video (`.mp4`, `.webm`, `.mkv`, `.avi`) indica il contenitore, non le codifiche.

## Con perdita e senza perdita

- Senza perdita: si riottengono i dati di partenza esatti.
- Con perdita: una parte dei dati, quella che si nota meno, viene buttata via; il file è molto più piccolo.

## Immagini

| Formato | Compressione | Trasparenza | Animazione |
|---|---|---|---|
| BMP | nessuna | no | no |
| JPEG | con perdita | no | no |
| PNG | senza perdita | sì | no |
| GIF | senza perdita, $256$ colori | sì, senza sfumature | sì |
| WebP | con o senza perdita | sì | sì |
| SVG | vettoriale | sì | sì |

- Fotografia: JPEG o WebP. Schermata: PNG. Logo: SVG. Animazione: GIF o WebP. Sfondo trasparente: PNG, WebP, SVG.

## Audio, video, documenti

| Formato | Che cos'è |
|---|---|
| WAV | audio, di solito non compresso |
| FLAC | audio senza perdita |
| MP3, AAC, Opus | audio con perdita |
| MP4, WebM, MKV, AVI | contenitori video |
| TXT | solo i caratteri |
| DOCX, ODT | documento da modificare (un archivio con dentro XML e immagini) |
| PDF | le pagine come vanno stampate |

## Aperto o proprietario

- Formato aperto: regole pubbliche, che chiunque può usare per scrivere un programma che lo legge (TXT, PNG, SVG, FLAC, ODT, WebM, PDF).
- Formato proprietario: le regole sono di un'azienda, che le tiene segrete o decide chi le può usare.
- Per conservare a lungo o scambiare con altri: formato aperto.

## Scegliere un formato

1. Che cosa contiene? Foto, disegno di forme, schermata, suono, testo.
2. Ci devo lavorare ancora? Allora senza perdita, o modificabile.
3. Chi lo deve aprire, e con che cosa?
4. Quanto può pesare?

```ad-warning
Rinominare non è convertire
`gita.jpg` rinominato `gita.png` resta un JPEG: i byte non cambiano.
```

```ad-warning
Convertire non restituisce la qualità
Da MP3 a WAV, o da JPEG a PNG, il file cresce e la qualità resta quella di prima.
```

```ad-warning
L'estensione di un video non dice la codifica
Due file `.mp4` possono avere dentro codifiche diverse, e un lettore può aprirne uno e non l'altro.
```
