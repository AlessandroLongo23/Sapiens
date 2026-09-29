# Note: Valore medio e incertezza di una serie di misure

Lezione nuova, primo lotto di fisica, gruppo 2. È la lezione che fissa le regole sulle incertezze usate da tutte le
lezioni di fisica: vedi "Regole per tutte le lezioni" qui sotto. Numeri rifatti in `g2/verifica.py`: somme, medie e
semidispersioni dei cinque esempi, arrotondamenti ($2{,}508 \to 2{,}5$, $0{,}19 \to 0{,}2$, $0{,}6633 \to 0{,}7$,
$0{,}614 \to 0{,}61$), la bilancia con la semidispersione sotto la sensibilità, gli intervalli dell'esempio 4 e le
loro sovrapposizioni. `check.mts` senza avvisi.

## Regole per tutte le lezioni

1. Valore medio: la media aritmetica delle misure.
2. Incertezza assoluta di una serie: la semidispersione $\dfrac{x_{\max} - x_{\min}}{2}$. Di una misura sola, di
   misure tutte uguali, o quando la semidispersione è più piccola della sensibilità: la sensibilità dello strumento.
   In breve, la più grande tra semidispersione e sensibilità.
3. Risultato: $x = (\bar{x} \pm \Delta x)\,\text{unità}$, con le parentesi. L'incertezza con una sola cifra
   significativa; il valore arrotondato alla stessa posizione decimale; per arrotondare si guarda la prima cifra
   tolta ($5$ o più: si aumenta), sempre, anche per l'incertezza (niente arrotondamento per eccesso d'ufficio).
4. Compatibilità: due misure sono compatibili se gli intervalli $[\bar{x} - \Delta x,\ \bar{x} + \Delta x]$ si
   sovrappongono; una misura è compatibile con un valore di riferimento se il valore sta nel suo intervallo.

Le regole di propagazione (lezione 07) e delle cifre significative (lezione 08) completano queste.

## Struttura ed esempi

Valore medio (link alla media di matematica), semidispersione come incertezza (link al campo di variazione), figura
delle sei misure del pendolo, il caso delle misure uguali e della sensibilità, come si scrive e si arrotonda il
risultato, figura interattiva, `ad-note` sulle altre convenzioni, quattro esempi, confronto tra misure con la figura
dei tre intervalli.

Esempi: il pendolo, $(12{,}50 \pm 0{,}06)\,\text{s}$ (lo zero finale); la biglia sulla guida, $(2{,}5 \pm 0{,}2)\,\text{s}$
(tutti e due gli arrotondamenti); la pallina con una misura sbagliata, $(0{,}61 \pm 0{,}04)\,\text{s}$ contro
$(0{,}7 \pm 0{,}2)\,\text{s}$ tenendola; tre gruppi e lo stesso pendolo (A e B incompatibili, C compatibile con
entrambi). Avvisi: il diviso due, le cifre della calcolatrice, lo zero finale, compatibili non vuol dire uguali.

Dati scelti apposta: nelle serie degli esempi il valore medio coincide (o quasi) con il punto medio tra massimo e
minimo, così l'intervallo del risultato contiene tutte le misure, come dice il testo; nessun arrotondamento cade a
metà.

## Scelte e dubbi (convenzioni che cambiano tra i libri)

- Semidispersione contro deviazione standard. Nel biennio i libri italiani usano la semidispersione (o "errore
  massimo"); più avanti, e all'università, lo scarto quadratico medio e quello della media, $\sigma / \sqrt{n}$. La
  lezione usa la semidispersione e lo dice nell'`ad-note`, con il link alla lezione di statistica. La figura
  interattiva mostra il difetto della semidispersione: con molte misure tende a crescere.
- Una o due cifre significative nell'incertezza. Qui sempre una. Una convenzione diffusa nei laboratori (per esempio
  nella Review of Particle Physics del Particle Data Group, da verificare la sezione) ne tiene due quando la prima
  cifra è $1$ ($0{,}14$ invece di $0{,}1$). Detto nell'`ad-note`.
- Arrotondamento dell'incertezza: con la regola solita, non per eccesso. Alcuni insegnanti arrotondano la
  semidispersione sempre per eccesso, perché è un errore massimo; detto nell'`ad-note`.
- Incertezza di una misura singola uguale alla sensibilità (non metà sensibilità). Molti libri, per gli strumenti
  analogici, usano metà della divisione più piccola. La lezione 04 (Gli strumenti di misura, gruppo 1) fa la stessa
  scelta e lo dice in un riquadro: le due lezioni sono allineate. Da confermare con Andrea.
- "Incertezza assoluta (o errore assoluto)": tengo tutte e due le parole la prima volta, poi solo "incertezza".
- "Compatibili" per intervalli che si sovrappongono anche di poco. Alcuni libri chiedono che la differenza dei valori
  sia minore della somma delle incertezze: è la stessa cosa.

## Figure

- `misure-pendolo-semidispersione` (TikZ, 317 px): le sei misure come punti, la media in arancione, la parentesi da
  $12{,}44$ a $12{,}56$ con i due $\Delta t$.
- `misure-compatibili-intervalli` (TikZ, 332 px): gli intervalli A, B, C dell'esempio 4, in blu, rosso e verde.
- `misure-ripetute-istogramma` (interattiva, `src/components/content/interactive/fisica/MisureRipetute.tsx`): parte
  dalle sei misure dell'esempio; ogni misura nuova è $12{,}50$ s più un errore casuale normale di $0{,}05$ s, letto al
  centesimo; le misure si impilano sul loro valore, con la media e la parentesi della semidispersione. Sotto: $n$,
  $\bar{t}$, la semidispersione con il conto e il risultato arrotondato con le regole della lezione, tutto in
  centesimi interi (niente arrotondamenti in virgola mobile). Guardata in chiaro, in scuro, a 390 px e dopo i clic.

## Lasciato ad altre lezioni

- Incertezza relativa e propagazione: lezione 07. Cifre significative e arrotondamento in dettaglio: lezione 08
  (linkata dove la lezione arrotonda).
- Media e campo di variazione come statistica: lezioni di matematica 56 e 57, linkate.

## Per il generatore

`specs/exercises/fis-valore-medio.md`, sei livelli: il valore medio, la semidispersione, scrivere il risultato,
incertezza e sensibilità, una misura da scartare, misure compatibili.

## Domande per Andrea

- Semidispersione come incertezza di una serie, come qui, o volete lo scarto quadratico medio già in prima?
- L'incertezza sempre con una cifra significativa, o due quando la prima è $1$?
- Arrotondare l'incertezza con la regola solita, come qui, o sempre per eccesso?
- L'incertezza di una misura singola è la sensibilità, o metà della sensibilità per gli strumenti con la scala?
  (Serve la stessa risposta nella lezione sugli strumenti di misura.)
- "Incertezza" o "errore" (assoluto, relativo)? I ragazzi trovano tutte e due le parole nei libri.
- Le parentesi in $(12{,}50 \pm 0{,}06)\,\text{s}$ sono obbligatorie per voi, o accettate $12{,}50 \pm 0{,}06$ s?
