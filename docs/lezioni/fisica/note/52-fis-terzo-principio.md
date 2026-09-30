# Note: Il terzo principio della dinamica

Lezione nuova (terzo lotto di fisica, gruppo 15, 30 settembre 2026). Conti rifatti in Python: $150/50 = 3{,}0$ e
$150/75 = 2{,}0$ m/s²; $0{,}20 \cdot 9{,}8 = 1{,}96$ N, $1{,}96/(5{,}97 \cdot 10^{24}) = 3{,}28 \cdot 10^{-25}$ m/s²;
$0{,}50 \cdot 9{,}8 = 4{,}9$ N, $(12 - 4{,}9)/0{,}50 = 14{,}2$ m/s². `check.mts` passa.

Fonte della massa della Terra, $5{,}97 \cdot 10^{24}\,\text{kg}$: NASA, "Earth Fact Sheet" (nssdc.gsfc.nasa.gov),
$5{,}9722 \cdot 10^{24}$ kg; letta a memoria, da verificare sulla pagina.

## Struttura ed esempi

L'enunciato (notazione $\vec F_{AB}$, $\vec F_{BA} = -\vec F_{AB}$, forze di contatto e a distanza, figura dei pattinatori),
azione e reazione su corpi diversi (il cavallo e il carro, avviso), stessa forza e accelerazioni diverse (esempio 1 dei
pattinatori, figura interattiva, esempio 2 della mela che attira la Terra, l'urto auto-camion), il terzo principio
intorno a noi (camminare, nuotare, il razzo con figura, esempio 3 del razzo modello), il libro sul tavolo (le due
coppie, figura, avviso).

## Scelte

- $\vec F_{AB}$ vuol dire "la forza di $A$ su $B$"; alcuni libri usano l'ordine contrario. La lezione lo definisce
  all'inizio.
- Il libro sul tavolo riprende l'avviso della lezione 20 ("Il peso e la reazione del piano non sono azione e reazione")
  con la figura delle quattro forze e i nomi $-\vec F_v$ e $-\vec P$ per le reazioni.
- L'esempio del razzo usa anche il secondo principio; il razzo come sistema a massa variabile non si nomina.
- L'indovinello del cavallo e del carro è classico; la spiegazione dice che il cavallo parte perché il terreno lo spinge
  più di quanto il carro lo tiri.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `pattinatori-spinta` (forze uguali dal centro di ciascun corpo),
`razzo-gas-spinta`, `libro-tavolo-coppie` (libro, tavolo e Terra separati, quattro forze). Interattiva
`pattinatori-spinta` (`fisica/PattinatoriSpinta.tsx`): spinta da 50 a 200 N per $0{,}40$ s, masse da 40 a 100 kg; durante
la spinta le forze uguali e le accelerazioni diverse, poi le velocità; formule chiuse, tempo reale.

## Esercizi

Generatore `fis-terzo-principio`, cinque livelli (specifica in `specs/exercises/fis-terzo-principio.md`); il livello 1 ha
le opzioni a parole, senza scena.

## Domande per Andrea

- $\vec F_{AB}$ come "forza di $A$ su $B$": è l'ordine dell'Amaldi?
- "Principio di azione e reazione" come secondo nome: va bene?
- La frase "le forze di una coppia sono sempre della stessa natura" è utile agli studenti o confonde?
- Il cavallo e il carro: si tiene, o è troppo lungo per il secondo anno?
- La massa della Terra con tre cifre ($5{,}97 \cdot 10^{24}$ kg) va bene, o si usa $6{,}0 \cdot 10^{24}$ kg?
