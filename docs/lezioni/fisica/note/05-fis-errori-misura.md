# Note: Errori casuali ed errori sistematici

Lezione nuova, primo lotto di fisica, gruppo 2 (errori e incertezze). Tutti i numeri della lezione, del formulario e
delle carte sono rifatti in `verifica.py` (scratchpad del lotto, `g2/verifica.py`, 85 controlli per le lezioni 05-09):
le correzioni della bilancia ($182{,}6 - 0{,}4 = 182{,}2$ e $182{,}6 - (-0{,}3) = 182{,}9$), somme, medie e campi di
variazione delle tre serie dell'esempio 3 ($200{,}00$, $201{,}20$, $200{,}0$; medie $50{,}00$, $50{,}30$, $50{,}0$;
campi $0{,}04$, $0{,}02$, $0{,}7$). `check.mts` passa sui tre file senza avvisi.

## Struttura ed esempi

Apertura con i cinque tempi della pallina (errore di misura non vuol dire sbaglio). Da dove vengono le incertezze
(strumento, persona, oggetto, ambiente). Errori sistematici (tre cause, parallasse con figura, come si scoprono e si
correggono), errori casuali (si riducono con la media, rimando alla lezione 06), sbagli (si scartano dicendo perché).
Tabella di confronto. Precisione e accuratezza con i quattro bersagli e la figura interattiva.

Tre esempi: bilancia che non segna zero (con lo zero negativo), quattro situazioni da classificare, tre bilance e un
pesetto campione (precisa e accurata, precisa e non accurata, accurata e non precisa). Avvisi: correzione nel verso
sbagliato, il tempo di reazione che è tutti e due gli errori, scartare una misura solo perché è scomoda, precisa non
vuol dire giusta. Un `ad-note` sui nomi che cambiano tra i libri.

## Scelte e dubbi

- "Errore di misura" come differenza tra valore misurato e valore vero, e "incertezza" come stima di quanto può
  essere grande. Molti libri del biennio usano "errore" e "incertezza" quasi come sinonimi (errore assoluto,
  incertezza assoluta); nella lezione 06 dico "incertezza assoluta (o errore assoluto)". Da confermare con Andrea.
- Precisione e accuratezza: precise = vicine tra loro (errori casuali piccoli), accurate = media vicina al valore
  vero (errori sistematici piccoli). È l'uso più diffuso a scuola. Nel Vocabolario internazionale di metrologia (JCGM
  200:2012, VIM terza edizione) "precision" è la vicinanza tra misure ripetute, "trueness" (giustezza) la vicinanza
  della media al valore vero, e "accuracy" (accuratezza) comprende tutte e due. L'`ad-note` lo dice in due righe.
  Alcuni libri italiani chiamano "precisione" la sensibilità dello strumento: da verificare sull'Amaldi in uso.
- "Sbagli" (errori grossolani) come terza categoria, fuori dagli errori di misura. Alcuni libri li chiamano "errori
  grossolani" e li mettono tra gli errori; ho scelto "sbaglio" per non contraddire la frase di apertura ("errore non
  vuol dire sbaglio"), con "errori grossolani" tra parentesi.
- Il tempo di reazione: la lezione dice che ha una parte casuale e una sistematica (quando i ritardi all'avvio e
  all'arresto non sono uguali). Molti libri lo mettono solo tra i casuali.
- Il metro d'acciaio al sole dà misure più corte del vero (la scala si allunga): corretto, ma è un esempio che
  qualcuno potrebbe trovare controintuitivo.
- Non ho messo il valore vero come "inconoscibile" in modo filosofico: la lezione parla di valore vero e di campione
  di valore noto, come i libri del biennio.

## Figure

- `errore-di-parallasse` (TikZ): scala da 10 a 14 vista di lato, lancetta sopra il 12, occhio giusto (verde) e
  occhio di sbieco (rosso) che vede circa 11,7. Coordinate: occhio in $(3{,}3;\,2{,}5)$, punta in $(2;\,0{,}5)$, la
  retta incontra la scala in $x = 2 - 1{,}3 \cdot 0{,}25 = 1{,}675$, cioè $11{,}675$, "circa $11{,}7$".
- `bersagli-precisione-accuratezza` (TikZ): quattro bersagli (raggi 1, 0,65, 0,3) con sei colpi ciascuno, calcolati
  da uno stesso schema di media zero, scalato e spostato (script `g2/hits.py`); larghezza 275 px.
- `bersaglio-errori` (interattiva, `src/components/content/interactive/fisica/BersaglioErrori.tsx`): colpi uno o dieci
  alla volta, cursori per l'errore sistematico (sposta la nuvola in una direzione fissa, 40 gradi) e per quello
  casuale (la allarga); le estrazioni restano, quindi muovendo i cursori si vede la stessa nuvola spostarsi o
  allargarsi. Croce arancione sulla media, lettura della distanza della media dal centro e della distanza media dei
  colpi dalla media; la didascalia classifica la nuvola (soglie 0,3 cm su un bersaglio di raggio 2 cm). Parte con
  dieci colpi, sempre gli stessi (generatore con seme). Esporta `Target` e `Hit`, usati dalla scena `bersaglio`.

Guardate in chiaro, in scuro e a 390 px, anche dopo i clic: nessun errore in console, nessuno scorrimento laterale.

## Lasciato ad altre lezioni

- Sensibilità, portata e prontezza degli strumenti: lezione 04 (Gli strumenti di misura), linkata.
- Come si calcolano valore medio e incertezza di una serie: lezione 06, linkata due volte.

## Per il generatore

`specs/exercises/fis-errori-misura.md`, cinque livelli: casuale o sistematico, correggere lo zero, il bersaglio (con
la scena `bersaglio`), precisione e accuratezza da tre serie di numeri, come rimediare.

## Domande per Andrea

- Precisione e accuratezza: va bene la coppia "precise = vicine tra loro, accurate = media vicina al valore vero"? O
  il libro che usate chiama "precisione" la sensibilità e "accuratezza" (o esattezza) tutto il resto?
- "Sbaglio" o "errore grossolano"? E li contate tra gli errori di misura o fuori?
- Il tempo di reazione con una parte casuale e una sistematica, come nella lezione, o solo casuale?
- Gli esempi usano un pesetto campione da $50{,}00$ g e bilance con i centesimi: sono strumenti che i ragazzi vedono
  in laboratorio, o meglio esempi con strumenti più comuni?
- Nel livello "Come rimediare" degli esercizi ogni situazione ha un solo rimedio giusto (media, taratura, scartare,
  strumento più sensibile). Vi sembra una semplificazione accettabile?
