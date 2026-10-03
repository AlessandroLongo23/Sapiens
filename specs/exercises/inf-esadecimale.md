# Il sistema esadecimale

Generatore: `inf-esadecimale` (`src/lib/exercises/v2/generators/inf-esadecimale.ts`).
Verifica indipendente: `scripts/exercises/checkers/inf_esadecimale.py`. Lezione collegata:
"Il sistema esadecimale" (`docs/lezioni/informatica/riscritte/06-inf-esadecimale.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-basi.ts` e `scripts/exercises/checkers/_inf_basi.py`.

I livelli seguono la lezione: da esadecimale a decimale, da decimale a esadecimale, da binario a
esadecimale e ritorno con i gruppi di quattro bit, il sistema ottale, le componenti di un colore. Il
numero è estratto per primo; tutte le scritture vengono da lui. Numeri fino a tre cifre esadecimali
(4095, 12 bit).

## Scrittura

- Esadecimale con le cifre in tondo e il pedice 16. Negli esercizi le cifre in tondo sono
  `\mathrm{2F}_{16}` e non `\text{2F}_{16}` come nelle lezioni: la pagina degli esercizi legge ogni
  `\text{}` di un passaggio come testo. Il risultato a schermo è lo stesso.
- Binario a gruppi di quattro con `\,`, ottale con il pedice 8.
- Un colore è `\texttt{\#RRGGBB}` dentro la frase del problema.
- Le risposte in base dieci sono `number`; quelle in esadecimale, binario e ottale sono `choice`, con
  quattro numeri diversi anche come valore e senza zeri iniziali.

## Livello 1: da esadecimale a decimale

Numeri di due cifre (da 16 a 255, circa 7 su 10) o di tre (da 256 a 4095); quelli senza lettere
compaiono poco (3 su 4 scartati). Passaggi: il valore delle lettere, la tabella dei pesi (potenze di 16)
sopra le cifre, i prodotti e la somma.

Esempi svolti:

1. `\mathrm{2F}_{16} = 2 \cdot 16 + 15 \cdot 1 = 47`.
2. `\mathrm{1C8}_{16} = 1 \cdot 256 + 12 \cdot 16 + 8 \cdot 1 = 456`.

## Livello 2: da decimale a esadecimale

Numeri da 26 a 255 (circa 6 su 10) o da 256 a 4095; quelli il cui esadecimale non ha lettere compaiono
poco. Passaggi: la tabella delle divisioni successive per 16, con i resti da 10 a 15 scritti anche come
lettera (`12 = \mathrm{C}`); i resti letti dal basso.

Esempi svolti:

1. `456`: 456 : 16 = 28 resto 8; 28 : 16 = 1 resto 12 = C; 1 : 16 = 0 resto 1; `\mathrm{1C8}_{16}`.
2. `43`: resti 11 = B e 2; `\mathrm{2B}_{16}`.

## Livello 3: da binario a esadecimale

Numeri da 5 a 12 bit; la lunghezza 8 è la più frequente, le altre obbligano a completare con gli zeri il
gruppo di sinistra. Passaggi: la tabella con i gruppi di quattro bit e sotto la cifra di ogni gruppo.

Esempi svolti:

1. `1100\,0011_2`: gruppi 1100 e 0011, cioè C e 3: `\mathrm{C3}_{16}`.
2. `10\,1101\,0110_2`: gruppi 0010, 1101, 0110: `\mathrm{2D6}_{16}`.

## Livello 4: da esadecimale a binario

Numeri di due o tre cifre esadecimali. Passaggi: la tabella con le cifre e sotto il gruppo di quattro
bit di ognuna; i gruppi scritti di seguito, togliendo gli zeri iniziali se ci sono (il passaggio lo dice).

Esempi svolti:

1. `\mathrm{8F}_{16}`: 1000 e 1111: `1000\,1111_2`.
2. `\mathrm{34A}_{16}`: 0011, 0100, 1010; tolti i due zeri iniziali `11\,0100\,1010_2`.

## Livello 5: il sistema ottale

Numeri da 9 a 511 (fino a tre cifre ottali, nove bit), un terzo ciascuno (`params.case`):

- `ott-dec`: da ottale a decimale con i pesi 64, 8, 1 (`number`);
- `bin-ott`: da binario a ottale con i gruppi di tre bit (`choice`); il problema è scritto a gruppi di
  quattro come ogni numero binario, e il primo passaggio lo riscrive a gruppi di tre;
- `ott-bin`: da ottale a binario, tre bit per cifra (`choice`).

Esempi svolti:

1. `57_8 = 5 \cdot 8 + 7 \cdot 1 = 47`.
2. `1\,0001\,0011_2`: gruppi 100, 010, 011: `423_8`.

## Livello 6: le componenti di un colore

"Nel colore #RRGGBB quanto vale la componente rossa (verde, blu)?", risposta in base dieci. Le tre
componenti hanno valori diversi; i valori 0, 128 e 255 compaiono un po' più spesso; le coppie di cifre
uguali (AA, 33) un po' meno. Passaggi: quale coppia di cifre, poi la conversione.

Esempi svolti:

1. `#FF8000`, verde: `80_{16} = 8 \cdot 16 + 0 = 128`.
2. `#3FA2C8`, blu: `\mathrm{C8}_{16} = 12 \cdot 16 + 8 = 200`.

## Esercizi "brutti" da evitare

- numeri esadecimali senza lettere in quasi tutti gli esercizi (non si distinguono da un numero decimale);
- opzioni che sono lo stesso numero con zeri iniziali;
- nelle tabelle dei gruppi, un gruppo intero di zeri a sinistra;
- colori con due componenti uguali (la risposta sarebbe anche un distrattore).

## Variante a scelta multipla

Quattro opzioni distinte, una corretta.

- Livello 1: i pesi da sinistra; A contata 11 (ogni lettera vale uno in più); i valori delle cifre
  scritti uno dopo l'altro (2 e 15: 215); i pesi della base dieci; la somma delle cifre.
- Livello 2: i resti letti dall'alto; un resto scritto in decimale (1128 al posto di 1C8); una lettera
  sbagliata di uno; numeri vicini.
- Livello 3: i gruppi formati da sinistra; il valore dei gruppi scritto in decimale; una lettera
  sbagliata di uno; le cifre in ordine inverso.
- Livello 4: le cifre scritte senza gli zeri del gruppo (5 come 101); una lettera sbagliata di uno; i
  gruppi in ordine inverso; un gruppo letto al contrario.
- Livello 5: i gruppi di quattro al posto di tre; i gruppi da sinistra; quattro bit per cifra ottale;
  la scrittura letta in base dieci o in base sedici.
- Livello 6: il valore di un'altra componente; i pesi scambiati tra le due cifre; i pesi della base
  dieci; numeri vicini.

## Nomi dei livelli

Per `level-names.ts`:

1. Da esadecimale a decimale
2. Da decimale a esadecimale
3. Da binario a esadecimale
4. Da esadecimale a binario
5. L'ottale
6. I colori

## Domande per la revisione

- Il livello 6 sui colori anticipa la lezione sulla codifica delle immagini: tenerlo qui, o spostarlo là?
- Il livello 5 mescola tre conversioni con l'ottale: è il peso giusto per un sistema che la lezione tratta in breve?
- Da esadecimale a binario la risposta giusta è senza zeri iniziali (`111\,1010_2` per 7A): va bene, o si vuole sempre il byte intero (`0111\,1010_2`)?
- Il limite è tre cifre esadecimali: servono anche numeri di quattro cifre (16 bit)?
