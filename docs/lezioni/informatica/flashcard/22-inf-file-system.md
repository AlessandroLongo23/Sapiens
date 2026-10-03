# Flashcard: Il file system: file, cartelle e percorsi

## file-system
Che cos'è il file system?
---
La parte del sistema operativo che organizza i dati in file e cartelle e ricorda dove si trova ciascuno.

## file
Che cos'è un file?
---
Una sequenza di byte registrata nella memoria di massa sotto un nome.

## estensione
Che cos'è l'estensione di un file?
---
La parte del nome dopo l'ultimo punto: indica il formato del file.

## estensione-due-punti
Qual è l'estensione di `foto.mare.png`?
---
`.png`: conta quello che viene dopo l'ultimo punto.

## tipo-dal-nome
Che tipo di file è `musica.txt`?
---
Un documento di testo: il tipo si legge dall'estensione, non dal resto del nome.

## estensioni-immagini
Quali estensioni indicano un'immagine?
---
`.jpg`, `.png` e `.gif`.

## cambiare-estensione
Vero o falso: rinominando `gita.jpg` in `gita.mp3` l'immagine diventa un brano.
---
Falso. Il contenuto resta quello di un'immagine: per cambiare formato serve un programma che converta i dati.

## cartella
Che cos'è una cartella?
---
Un contenitore di file e di altre cartelle.

## radice
Che cos'è la radice?
---
La cartella da cui parte tutto l'albero, che non sta dentro nessun'altra.

## stesso-nome
Due file possono avere lo stesso nome?
---
Sì, se stanno in due cartelle diverse; nella stessa cartella no.

## percorso-assoluto
Da dove parte un percorso assoluto?
---
Dalla radice.

## percorso-relativo
Da dove parte un percorso relativo?
---
Dalla cartella corrente, quella in cui ti trovi.

## due-scritture
Come si scrive la radice con la barra? E con la barra rovesciata?
---
`/` nel primo caso; una lettera con i due punti e la barra rovesciata, come `C:\`, nel secondo.

## due-punti
Che cosa indica `..` in un percorso?
---
La cartella che contiene quella corrente: si sale di un livello.

## relativo-scendere
La cartella corrente è `/home/anna`. Qual è il percorso assoluto di `foto/gita.jpg`?
---
`/home/anna/foto/gita.jpg`.

## relativo-salire
La cartella corrente è `/home/anna/temi`. Qual è il percorso assoluto di `../foto`?
---
`/home/anna/foto`: `..` toglie `temi`, poi si aggiunge `foto`.

## barra-iniziale
`home/anna`, senza la barra iniziale, è un percorso assoluto o relativo?
---
Relativo: cerca `home` dentro la cartella corrente.

## copiare-spostare
Che differenza c'è tra copiare e spostare un file?
---
Dopo la copia i file sono due e l'originale resta dov'era; dopo lo spostamento il file è uno solo, nella cartella nuova.

## rinominare
Che cosa cambia nel percorso di un file quando lo rinomini?
---
Solo l'ultima parte, il nome: la cartella resta la stessa.

## dimensione-cartella
Una cartella contiene $10$ file da $200\,\text{kB}$. Quanti megabyte occupa?
---
$2\,\text{MB}$: $10 \cdot 200 = 2000\,\text{kB}$, e $1\,\text{MB} = 1000\,\text{kB}$.
