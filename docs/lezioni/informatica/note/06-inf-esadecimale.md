# Note: Il sistema esadecimale

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "I sistemi di numerazione", 3 ottobre 2026).
`check.mts` passa sui tre file senza errori e senza avvisi.

## Struttura ed esempi

Perché serve l'esadecimale (un numero di 24 bit in sei cifre); le sedici cifre con la tabella esadecimale, decimale,
binario; da esadecimale a decimale; da decimale a esadecimale con le divisioni per 16; tra binario ed esadecimale con
i gruppi di quattro bit, nei due versi; l'ottale in breve (gruppi di tre bit); dove si incontra l'esadecimale: i
colori `#RRGGBB` e gli indirizzi.

Nove esempi svolti: $\text{2F}_{16}$ (47), $\text{1C8}_{16}$ (456), $\text{FF}_{16}$ (255); 456 in esadecimale;
$10\,1101\,0110_2 = \text{2D6}_{16}$; $\text{7A}_{16}$ e $\text{C05}_{16}$ in binario; $11\,0101_2 = 65_8 = 53$; il
colore `#FF8000`. Avvisi: le lettere sono cifre e $10_{16}$ vale sedici; un resto maggiore di 9 è una cifra sola; i
gruppi si formano da destra e ogni cifra vale sempre quattro bit.

I conti sono stati rifatti in Python (`/tmp/informatica-cap2/conti.py`), compresi $1128_{16} = 4392$ e i 24 bit di
`FF8000`.

## Scelte

- Nelle lezioni le cifre esadecimali sono `\text{2F}_{16}`, come dice il README. Nei generatori sono
  `\mathrm{2F}_{16}`: la pagina degli esercizi tratta ogni `\text{}` di un passaggio come prosa. A schermo sono uguali.
- I codici di colore e l'indirizzo MAC sono in codice in linea (`#FF8000`, `3C:22:FB:10:A4:7E`), come le formule del
  foglio di calcolo: non sono numeri da leggere in formula ma testo da copiare. Il README non lo fissava.
- Da esadecimale a binario il risultato è scritto senza zeri iniziali ($111\,1010_2$), dicendo che lo zero resta
  quando il numero deve occupare un byte.
- L'ottale ha una sezione breve e un solo esempio; negli esercizi ha un livello.
- La lezione è lunga 211 righe, più delle 180 indicate: 17 sono la tabella delle cifre e 9 sono gli esempi. Se è
  troppo, si possono togliere l'esempio 3 ($\text{FF}_{16}$) e l'esempio 7 ($\text{C05}_{16}$).

## Fonti da verificare

- L'indirizzo MAC è di 48 bit, scritto come sei coppie di cifre esadecimali (standard IEEE 802). L'indirizzo
  dell'esempio è inventato; da verificare che non sia meglio un esempio con un prefisso riservato alla documentazione.
- "Oggi l'ottale si incontra molto meno dell'esadecimale", con la spiegazione del byte che non si divide in gruppi di
  tre bit: è la spiegazione usuale, da verificare se il libro ne dà un'altra. L'uso più noto dell'ottale oggi (i
  permessi dei file nei sistemi Unix) non è citato.
- `#FF8000` è un arancione (rosso 255, verde 128, blu 0): controllato con il conto, non su uno schermo.
- La sintesi additiva rosso, verde, blu è della lezione 11 (altro gruppo): qui c'è solo una frase e il link.

## Figure

- `binario-esadecimale-gruppi` (TikZ, 401 x 143 px): i tre gruppi di quattro bit di $10\,1101\,0110_2$, con i due zeri
  aggiunti in grigio, e sotto le cifre 2, D, 6.
- `colore-esadecimale-componenti` (TikZ, 405 x 116 px): `#FF8000` diviso in FF, 80, 00 con i nomi delle componenti e i
  valori 255, 128, 0. Le caselle non sono colorate di rosso, verde e blu: nel tema scuro le figure sono invertite e i
  colori cambierebbero.

Guardate in chiaro e in scuro: niente sovrapposizioni.

## Per il generatore

`inf-esadecimale`, sei livelli (specifica in `specs/exercises/inf-esadecimale.md`): da esadecimale a decimale, da
decimale a esadecimale, da binario a esadecimale, da esadecimale a binario, l'ottale, i colori.

## Domande per Andrea

- Quanto spazio vuoi per l'ottale: una sezione breve come qui, una lezione sua, o niente?
- I colori `#RRGGBB` stanno bene qui come applicazione, o vanno lasciati tutti alla lezione sulle immagini?
- Le cifre esadecimali sempre maiuscole (2F), anche se nelle pagine web si trovano minuscole (`#ff8000`)?
- Serve il passaggio diretto tra ottale ed esadecimale (attraverso il binario)? Ora non c'è.
