# Grafica bitmap e grafica vettoriale

Generatore: `inf-bitmap-vettoriale` (`src/lib/exercises/v2/generators/inf-bitmap-vettoriale.ts`, con
`makeCodeGenerator` di `inf-codice.ts` per il frammento SVG e gli aiuti di `inf-sic.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_bitmap_vettoriale.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/83-inf-bitmap-vettoriale.md`.

Cinque livelli, tutti a scelta multipla con quattro opzioni di testo. I livelli 3 e 4 sono sul conto della lezione,
$\text{pixel} = \text{pollici} \cdot \text{dpi}$, costruito all'indietro da un numero intero di pollici. Il livello 2
mostra un frammento SVG vero sotto la domanda (`Sample.listing`).

## Nomi dei livelli

1. Bitmap o vettoriale
2. Leggere un SVG
3. I pixel per la stampa
4. Quanto viene grande la stampa
5. Che cosa succede ai pixel

## Livello 1: bitmap o vettoriale

Nove situazioni con un nome estratto, la scelta giusta con il motivo e quattro sbagliate (se ne mostrano tre): il
logo sullo striscione, la foto del tramonto, l'icona in dieci dimensioni, l'immagine che ingrandita mostra i
quadretti, il peso dei due file dello stesso cerchio, la schermata, il vettoriale da ricavare da una foto, la
piantina per il sito e per il cartellone, il logo vettoriale per un sito che accetta solo bitmap.

## Livello 2: leggere un SVG

Il frammento è `<svg viewBox="0 0 100 100">` con uno o due `circle`; righe di 42 caratteri al massimo (il `fill` va
a capo). Il testo dice "Il disegno è largo 100 e alto 100."

- dove (4 su 10): un cerchio con il centro lontano almeno 15 dal mezzo. "In quale zona del disegno si trova il
  cerchio?" Opzioni: In alto a sinistra, In alto a destra, In basso a sinistra, In basso a destra. L'errore atteso è
  la y letta come nel piano cartesiano.
- sopra (3 su 10): due cerchi di colori diversi che si sovrappongono in parte, tutti dentro il disegno. "Quale dei
  due si vede intero?" Risposta: quello scritto per ultimo. Sbagliate: quello scritto per primo; tutti e due, non si
  toccano; nessuno, i colori si mescolano.
- misura (3 su 10): "Quanto è largo il cerchio?" ($2r$; sbagliate: $r$, `cx`, $r^2$) oppure "A che distanza dal
  bordo sinistro comincia il cerchio?" (`cx` $- r$; sbagliate: `cx`, `cx` $+ r$, $r$).

## Livello 3: i pixel per la stampa

Pollici da 2 a 12, densità tra 72, 100, 150, 200, 300 e 600 dpi.

- larghezza (metà): "Una foto deve essere larga 7 pollici sulla carta, con una densità di stampa di 300 dpi. Quanti
  pixel deve avere in larghezza?" Risposta: 2100 pixel. Sbagliate: la densità, la somma, il doppio, la metà.
- dimensioni (metà): "Una stampa deve misurare 7 pollici di larghezza e 10 di altezza, a 200 dpi. Quanti pixel deve
  avere l'immagine, larghezza per altezza?" Risposta: $1400 \times 2000$.

## Livello 4: quanto viene grande la stampa

Costruito all'indietro: pollici interi $k$ da 2 a 12, pixel $= k \cdot \text{dpi}$.

- pollici: "Un'immagine larga 1500 pixel viene stampata a 300 dpi. Quanti pollici è larga la stampa?" 5 pollici.
- centimetri: lo stesso, con "Un pollice è 2,54 cm" nel testo: $2 \cdot 2{,}54 = 5{,}08$ cm. Sbagliate: i pollici
  letti come centimetri, $k \cdot 25{,}4$, $k + 2{,}54$.
- densità: "Un'immagine larga 144 pixel viene stampata in modo da essere larga 2 pollici. Con quale densità è
  stampata?" 72 dpi.

## Livello 5: che cosa succede ai pixel

Affermazioni vere e false, otto e otto, sulle operazioni (ritagliare, rimpicciolire, ingrandire, cambiare formato),
sull'etichetta dei dpi, sulla rasterizzazione e sulla y di SVG. Una vera tra tre false, o una falsa tra tre vere.

## Esercizi da evitare

- Cerchi vicini al centro del disegno, per i quali "in alto" o "in basso" non è evidente.
- Misure in centimetri che non siano un numero intero di pollici per 2,54.
- Domande che chiedono di ricordare un attributo SVG senza un frammento da leggere.

## Verifica

`inf_bitmap_vettoriale.py` legge il frammento SVG per conto suo (centro, raggio e colore di ogni cerchio,
nell'ordine), controlla che i cerchi stiano nel disegno e che i due cerchi si sovrappongano in parte, e ricava zona,
cerchio in vista e misure. I conti dei livelli 3 e 4 sono rifatti dai numeri del testo, i centimetri con le frazioni
esatte.

## Domande per la revisione

- Le misure sono in pollici, con i centimetri solo dove il fattore 2,54 è nel testo. Va bene, o si preferiscono i
  centimetri dappertutto?
- Livello 2: il frammento ha solo cerchi. Servono anche `rect` e `polygon`?
