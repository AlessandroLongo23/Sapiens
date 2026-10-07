# Formulario: Audio e video digitali

## Bitrate

Il bitrate è il numero di bit per ogni secondo di suono o di video. Multipli decimali: $1\,\text{kbit/s} = 1000\,\text{bit/s}$, $1\,\text{Mbit/s} = 1\,000\,000\,\text{bit/s}$.

Suono non compresso:

$$\begin{aligned}& \text{bitrate} = \\ & \quad \text{frequenza di campionamento} \\ & \quad \cdot \text{bit per campione} \cdot \text{canali}\end{aligned}$$

Qualità di un CD: $44\,100 \cdot 16 \cdot 2 = 1\,411\,200\,\text{bit/s} = 1411{,}2\,\text{kbit/s}$.

Dal bitrate alla dimensione, per qualunque file:

$$\text{byte} = \frac{\text{bitrate} \cdot \text{secondi}}{8}$$

Tre minuti a $128\,\text{kbit/s}$: $128\,000 \cdot 180 : 8 = 2\,880\,000\,\text{B} = 2{,}88\,\text{MB}$.

In un file compresso il bitrate lo sceglie chi salva: più è basso, più piccolo è il file e più si perde.

## Formati dell'audio

| Che cosa contiene | Bitrate per la qualità di un CD | Esempi |
|---|---|---|
| i campioni così come sono | $1411{,}2\,\text{kbit/s}$ | WAV |
| i campioni compressi senza perdita | circa la metà | FLAC |
| un suono compresso con perdita | da $96$ a $320\,\text{kbit/s}$ | MP3, AAC, Opus |

## Video non compresso

- Fotogramma: una delle immagini ferme di cui è fatto il video.
- Frequenza dei fotogrammi: quanti in un secondo, in fps.
- Risoluzione: i pixel di ogni fotogramma, larghezza per altezza.

Con $24$ bit per pixel, cioè $3$ byte:

$$\begin{aligned}& \text{byte} = \text{larghezza} \cdot \text{altezza} \cdot 3 \\ & \quad \cdot \text{fotogrammi al secondo} \cdot \text{secondi}\end{aligned}$$

$1920 \times 1080$ a $25$ fps: $6\,220\,800\,\text{B}$ per fotogramma, $155{,}52\,\text{MB}$ al secondo.

## Compressione tra fotogrammi

- Fotogramma chiave: completo, compresso come una fotografia. Serve all'inizio, a ogni cambio di scena e comunque ogni pochi secondi.
- Gli altri fotogrammi contengono solo le differenze dal precedente.
- Più movimento c'è, più differenze ci sono: a parità di bitrate la qualità scende.

## Codec, contenitore, streaming

- Codifica: il modo in cui audio o video vengono compressi (MP3, AAC; H.264). Codec: il programma che comprime e poi ricostruisce.
- Contenitore: il file che tiene insieme video, audio e sottotitoli e li sincronizza (MP4, MKV, WebM). L'estensione dice il contenitore, non le codifiche.
- Streaming: il video si riproduce mentre arriva. Regge se la velocità della connessione è maggiore del bitrate del video.

```ad-warning
Kilobit e kilobyte
Il bitrate è in bit, la dimensione in byte: si divide sempre per $8$.
```

```ad-warning
Minuti e secondi
La durata va portata in secondi prima di moltiplicare per il bitrate.
```

```ad-warning
Estensione e codec
Due file con la stessa estensione possono avere dentro codifiche diverse: uno si apre e l'altro no.
```
