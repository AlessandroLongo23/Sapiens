# Formulario: Il file system: file, cartelle e percorsi

## File ed estensioni

- File system: la parte del sistema operativo che organizza i dati in file e cartelle.
- File: una sequenza di byte registrata nella memoria di massa sotto un nome.
- Estensione: quello che viene dopo l'ultimo punto del nome; indica il formato (`foto.mare.png` ha estensione `.png`).

| Estensione | Tipo di file |
|---|---|
| `.txt`, `.odt`, `.docx`, `.pdf` | documento di testo |
| `.ods`, `.xlsx` | foglio di calcolo |
| `.odp`, `.pptx` | presentazione |
| `.jpg`, `.png`, `.gif` | immagine |
| `.mp3`, `.wav` | audio |
| `.mp4`, `.avi` | video |
| `.html` | pagina web |
| `.zip` | archivio compresso |
| `.exe` | programma eseguibile |

## Cartelle e percorsi

- Cartella (directory): contenitore di file e di altre cartelle. Radice: la cartella che non sta dentro nessun'altra.
- Percorso: l'elenco delle cartelle da attraversare, seguito dal nome del file.
- Percorso assoluto: parte dalla radice. Con la barra: `/home/anna/foto/gita.jpg`. Con la barra rovesciata: `C:\Utenti\anna\foto\gita.jpg`.
- Percorso relativo: parte dalla cartella corrente. `..` è la cartella che contiene quella corrente, `.` è la cartella corrente.

## Da relativo ad assoluto

1. Scrivi il percorso assoluto della cartella corrente.
2. Per ogni nome del percorso relativo, aggiungilo in fondo.
3. Per ogni `..`, togli l'ultima cartella.

| Cartella corrente | Percorso relativo | Percorso assoluto |
|---|---|---|
| `/home/anna/temi` | `arte/mappa.png` | `/home/anna/temi/arte/mappa.png` |
| `/home/anna/temi` | `../foto/gita.jpg` | `/home/anna/foto/gita.jpg` |
| `C:\Utenti\anna\temi\arte` | `..\..\..\luca\rock\brano.mp3` | `C:\Utenti\luca\rock\brano.mp3` |

## Operazioni

| Operazione | Che cosa cambia |
|---|---|
| copiare | nasce un secondo file nella cartella di arrivo; l'originale resta |
| spostare | cambia la cartella, il nome resta |
| rinominare | cambia il nome, la cartella resta |
| eliminare | il file va nel cestino, da cui si può recuperare |

## Dimensioni

- $1\,\text{kB} = 1000\,\text{B}$, $1\,\text{MB} = 1000\,\text{kB}$, $1\,\text{GB} = 1000\,\text{MB}$.
- Dimensione di una cartella: la somma di ciò che contiene ($40 \cdot 250\,\text{kB} = 10\,000\,\text{kB} = 10\,\text{MB}$).
- Quanti file interi stanno in uno spazio: si divide e si arrotonda per difetto ($30 : 4 = 7{,}5$, quindi $7$).

```ad-warning
Cambiare l'estensione non converte il file
`gita.jpg` rinominato `gita.mp3` resta un'immagine.
```

```ad-warning
La barra iniziale
`/home/anna` parte dalla radice; `home/anna` parte dalla cartella corrente.
```

```ad-warning
Non ignorare i due punti
`../foto` da `/home/anna/temi` è `/home/anna/foto`, non `/home/anna/temi/foto`.
```
