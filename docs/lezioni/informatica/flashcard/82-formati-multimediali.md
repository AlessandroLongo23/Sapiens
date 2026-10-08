# Flashcard: I formati dei file multimediali

## formato-di-file
Che cos'è un formato di file?
---
L'insieme delle regole che dicono come leggere i byte di un file.

## estensione-cambiata
Rinomini `gita.jpg` in `gita.png`. Che cosa è cambiato nel file?
---
Solo il nome. I byte sono ancora quelli di un JPEG: per cambiare formato serve una conversione.

## firma
Che cos'è la firma di un formato?
---
I primi byte del file, sempre gli stessi per quel formato: dicono che cosa c'è dentro, qualunque sia il nome.

## firma-png
Un file si chiama `nota.txt` e i suoi primi byte sono `89 50 4E 47`. Che cosa contiene?
---
Un'immagine PNG: `50 4E 47` sono le lettere P, N, G. Conta la firma, non l'estensione.

## contenitore
Che cos'è un contenitore?
---
Un formato che tiene insieme più tracce, come video, audio e sottotitoli, e le sincronizza.

## codec
Che cosa fa un codec?
---
Codifica i dati di una traccia quando si salva e li decodifica quando si riproduce.

## mp4-non-si-apre
Due file `.mp4`: il telefono ne apre uno e l'altro no. Come è possibile?
---
L'estensione indica il contenitore, non le codifiche: nel secondo c'è una traccia scritta con una codifica che il telefono non conosce.

## senza-perdita
Che cosa vuol dire che una compressione è senza perdita?
---
Che decomprimendo si riottengono i dati di partenza esatti, bit per bit.

## foto-formato
Quale formato conviene per una fotografia da mettere su un sito?
---
JPEG, oppure WebP: la compressione con perdita si nasconde nelle sfumature e il file pesa poco.

## schermata-formato
Per una schermata piena di testo è meglio JPEG o PNG?
---
PNG. È senza perdita, e il testo resta nitido; JPEG lascia aloni attorno ai bordi netti.

## logo-rettangolo
Un logo messo su una locandina ha attorno un rettangolo bianco. Che cosa manca al suo formato?
---
La trasparenza. In PNG, WebP o SVG lo sfondo può essere trasparente; in JPEG no.

## gif-colori
Vero o falso: il formato GIF va bene per una fotografia.
---
Falso. Ha al massimo $256$ colori, e le sfumature di una foto diventano fasce.

## animazione
Quali formati di immagine possono contenere un'animazione, tra JPEG, PNG, GIF e WebP?
---
GIF e WebP.

## audio-formati
WAV, FLAC, MP3: quale è non compresso, quale senza perdita, quale con perdita?
---
WAV di solito non è compresso, FLAC è senza perdita, MP3 è con perdita.

## docx-dentro
Che cosa c'è dentro un file DOCX o ODT?
---
Un archivio compresso con il testo in XML e le immagini, ciascuna nel suo formato.

## pdf-o-odt
Devi consegnare una relazione finita: ODT o PDF?
---
PDF. Conserva le pagine come vanno stampate e si apre allo stesso modo ovunque; l'ODT lo tieni per modificarla.

## formato-aperto
Che cos'è un formato aperto?
---
Un formato con regole pubbliche, che chiunque può usare per scrivere un programma che lo legge.

## aperto-a-lungo
Perché un file da conservare per vent'anni conviene salvarlo in un formato aperto?
---
Perché non dipende da un programma solo: chiunque potrà scriverne uno che lo apre.

## mp3-in-wav
Converti un MP3 in WAV. Che cosa succede alla dimensione e alla qualità?
---
La dimensione cresce, la qualità resta quella dell'MP3: i dati buttati via non tornano.
