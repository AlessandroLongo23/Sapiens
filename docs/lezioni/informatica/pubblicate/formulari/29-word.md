# Formulario: Struttura di un documento elettronico

## Contenuto e forma

- Contenuto: quello che c'è scritto (parole, numeri, immagini, tabelle).
- Formattazione: l'aspetto con cui il contenuto si presenta (carattere, dimensione, colori, allineamento, margini).
- Sono indipendenti: prima si scrive, poi si impagina.

## A che cosa si applica la formattazione

| Pezzo | Che cosa si sceglie |
|---|---|
| carattere | tipo di carattere, dimensione in punti, grassetto, corsivo, colore |
| paragrafo (il testo tra un Invio e il successivo) | allineamento, interlinea, rientri, spazio prima e dopo |
| pagina | formato, orientamento, margini |
| sezione | impostazioni di pagina diverse dal resto del documento |

- Un punto tipografico (pt) è circa $0{,}35\,\text{mm}$; il testo di una relazione è di $11$ o $12$ punti.
- Foglio A4: $21\,\text{cm}$ per $29{,}7\,\text{cm}$. In orizzontale i due lati si scambiano.

## La pagina

- Intestazione: nel margine superiore. Piè di pagina: nel margine inferiore. Si scrivono una volta e si ripetono su tutte le pagine.
- Campo: un segnaposto che il programma riempie da solo (numero di pagina, numero totale delle pagine, data).

Area del testo:

$$\text{larghezza dell'area} = \text{larghezza del foglio} - \text{margine sinistro} - \text{margine destro}$$

$$\text{altezza dell'area} = \text{altezza del foglio} - \text{margine superiore} - \text{margine inferiore}$$

Esempio: A4 verticale, margini sinistro $3\,\text{cm}$ e destro $2\,\text{cm}$: $21 - 3 - 2 = 16\,\text{cm}$.

## I caratteri non stampabili

| Segno | Nome | Che cosa fa |
|---|---|---|
| ¶ | fine paragrafo (Invio) | chiude il paragrafo e ne comincia uno nuovo |
| ↵ | interruzione di riga | manda a capo restando nello stesso paragrafo |
| → | tabulazione (Tab) | sposta il testo fino a una posizione fissa della riga |
| · | spazio | separa due parole |
| linea tratteggiata | interruzione di pagina | fa cominciare su una pagina nuova quello che segue |

## I formati dei file

| Formato | Estensione | Si modifica | Quando si usa |
|---|---|---|---|
| modificabile | `.docx`, `.odt` | sì, con tutta la formattazione | per continuare a lavorarci |
| PDF | `.pdf` | no | per consegnare, stampare, pubblicare |
| testo semplice | `.txt` | sì, ma solo i caratteri | per appunti senza formattazione |

```ad-warning
Invio alla fine di ogni riga
Dentro un paragrafo le righe le manda a capo il programma: Invio si preme solo quando il paragrafo è finito.
```

```ad-warning
Allineare e centrare con gli spazi
Per centrare c'è l'allineamento del paragrafo, per mettere in colonna c'è la tabulazione: gli spazi si spostano appena cambia qualcosa.
```

```ad-warning
Pagina nuova a colpi di Invio
Le righe vuote restano nel testo: aggiungi $5$ righe prima e il titolo scende di $5$ righe. Con l'interruzione di pagina resta in cima.
```
