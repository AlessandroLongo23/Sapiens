# Flashcard: Audio e video digitali

## bitrate-definizione
Che cos'è il bitrate di un suono o di un video?
---
Il numero di bit che servono per ogni secondo. Si misura in bit al secondo, kbit/s o Mbit/s.

## bitrate-non-compresso
Come si calcola il bitrate di un suono non compresso?
---
Frequenza di campionamento per bit per campione per numero di canali.

## bitrate-mono-stereo
Un suono mono non compresso ha bitrate $700\,\text{kbit/s}$. Quanto vale lo stesso suono in stereo?
---
$1400\,\text{kbit/s}$: i canali sono due, e ognuno ha i suoi campioni.

## dimensione-dal-bitrate
Come si passa dal bitrate ai byte di un file?
---
Bitrate in bit al secondo per i secondi, diviso $8$.

## un-secondo-a-128
Quanti byte occupa un secondo di musica a $128\,\text{kbit/s}$?
---
$16\,000$: sono $128\,000$ bit, divisi per $8$.

## kilobit-kilobyte
Vero o falso: un minuto a $80\,\text{kbit/s}$ occupa $80 \cdot 60 = 4800\,\text{kB}$.
---
Falso. $4800$ sono i kbit: i kB sono $4800 : 8 = 600$.

## bitrate-compresso-chi-lo-decide
In un file audio compresso, da che cosa dipende il bitrate?
---
Dalla scelta di chi salva il file: sono i bit a disposizione per ogni secondo. Non si calcola più dai campioni.

## bitrate-basso
Che cosa succede abbassando il bitrate di un file compresso con perdita?
---
Il file diventa più piccolo e la qualità scende, perché il programma deve buttare via più cose.

## formato-senza-perdita
Tra WAV, FLAC e MP3, quale comprime senza perdere niente?
---
FLAC. WAV non comprime, MP3 comprime con perdita.

## fotogramma
Che cos'è un fotogramma?
---
Una delle immagini ferme che, mostrate una dopo l'altra, formano il video.

## fps
Un video a $25$ fotogrammi al secondo dura $4$ secondi. Quanti fotogrammi ha?
---
$100$.

## video-non-compresso
Come si calcolano i byte di un secondo di video non compresso a $24$ bit per pixel?
---
Larghezza per altezza per $3$ byte, per i fotogrammi al secondo.

## raddoppiare-fps
Che cosa succede alla dimensione di un video non compresso passando da $30$ a $60$ fotogrammi al secondo?
---
Raddoppia: i fotogrammi sono il doppio, e ognuno occupa quanto prima.

## fotogramma-chiave
Che cos'è un fotogramma chiave?
---
Un fotogramma scritto per intero, che non dipende dai precedenti. Gli altri contengono solo le differenze.

## differenze-quando-convengono
In quale video le differenze tra fotogrammi fanno risparmiare di più: una lezione con la telecamera ferma o una partita?
---
La lezione: tra un fotogramma e il successivo cambia pochissimo.

## cambio-di-scena
Perché a un cambio di scena serve un nuovo fotogramma chiave?
---
Perché quasi tutti i pixel sono diversi da prima: scrivere le differenze costerebbe quanto il fotogramma intero.

## codec-contenitore
MP4 è un codec o un contenitore?
---
Un contenitore: il file che tiene insieme video, audio e sottotitoli. Come è compresso ciascuno lo dice la sua codifica, e il codec è il programma che la applica.

## estensione-non-basta
Vero o falso: se un lettore apre un file `.mp4`, li apre tutti.
---
Falso. L'estensione dice il contenitore; dentro possono esserci codifiche per cui il lettore non ha il codec.

## streaming-condizione
Un video ha bitrate $6\,\text{Mbit/s}$ e la connessione arriva a $4\,\text{Mbit/s}$. Che cosa succede in streaming?
---
Il video si ferma a caricare: i bit arrivano più lentamente di quanto vengono consumati. Serve una versione con bitrate minore di $4\,\text{Mbit/s}$.
