# Note: Gli strumenti di misura

Lezione nuova, scritta da zero (primo lotto di fisica, gruppo 1, 29 settembre 2026). `check.mts` passa senza errori;
avviso sui grassetti (13, tutti su termini definiti). È la più lunga delle quattro (circa 24.000 caratteri, con sei figure
TikZ e una interattiva): calibro e micrometro chiedono figure e passi.

## Struttura ed esempi

Strumenti analogici e digitali; portata, sensibilità (valore di una divisione, calcolato tra due tacche numerate) e
prontezza, con la scelta dello strumento; come si scrive una lettura, $(12{,}3 \pm 0{,}1)\,\text{cm}$, con un `ad-note` sulla
metà divisione; il righello (anche quando non parte da zero); il cilindro graduato con il menisco e l'errore di parallasse;
il calibro, le sue parti, il nonio decimale con il procedimento in tre passi e la figura interattiva, il nonio
ventesimale, un cenno al cinquantesimale; il micrometro; bilance e cronometri, con il tempo di reazione e il rimando
all'esperimento del pendolo; un rimando al dinamometro.

Sei esempi: portata e sensibilità di un cilindro ($250\,\text{mL}$, $2\,\text{mL}$), un righello che parte da
$2{,}0\,\text{cm}$ (differenza $5{,}4\,\text{cm}$, incertezza $0{,}2\,\text{cm}$), la lettura di un cilindro
($36\,\text{mL}$), il nonio decimale ($23{,}7\,\text{mm}$), il nonio ventesimale ($12{,}35\,\text{mm}$), il micrometro
($7{,}73\,\text{mm}$). Avvisi: una tacca non vale sempre $1$, la tacca iniziale da togliere, il numero sotto la tacca che
coincide, $0{,}05\,\text{mm}$ per divisione nel ventesimale, il mezzo millimetro del micrometro, la sensibilità del display
che non è l'incertezza.

## Scelte

- Incertezza di una lettura singola uguale alla sensibilità (Amaldi, da confermare); un `ad-note` dice che alcuni libri
  usano metà divisione.
- Nel righello che non parte da zero l'incertezza della differenza è la somma delle due ($0{,}2\,\text{cm}$), con il link
  alla lezione sulla propagazione: anticipa una regola di un'altra lezione, ma senza la regola il risultato sarebbe
  sbagliato. Se non va bene, l'esempio si può rifare con l'oggetto allineato allo zero.
- Il nonio ventesimale con $20$ divisioni in $19\,\text{mm}$ (e la nota sui calibri da $39\,\text{mm}$); i numeri del nonio
  da $0$ a $10$ sono i decimi di millimetro, come sui calibri veri.
- "Precisione" e "accuratezza" non ci sono: sono della lezione sugli errori.

## Numeri

Rifatti in Python (`verifica.py`, lo stesso delle altre lezioni del gruppo): $\dfrac{50}{25} = 2$; $7{,}4 - 2{,}0 = 5{,}4$;
nel nonio decimale lo zero a $23{,}7$ e la settima tacca a $23{,}7 + 7 \cdot 0{,}9 = 30$; nel ventesimale lo zero a
$12{,}35$ e la settima tacca a $12{,}35 + 7 \cdot 0{,}95 = 19$; micrometro $7{,}5 + 0{,}23 = 7{,}73$ e
$\dfrac{0{,}5}{50} = 0{,}01$; nella figura della parallasse la retta dall'occhio alto al fondo del menisco taglia la
parete a $37\,\text{mL}$. Le coordinate delle due figure del nonio sono generate da uno script dalle letture.

## Figure

- `righello-lettura-differenza` (TikZ, 309 x 102 px): righello da $1$ a $8\,\text{cm}$ e matita da $2{,}0$ a $7{,}4$.
- `menisco-parallasse` (TikZ, 272 x 177 px): cilindro di lato, due occhi, $36$ e $37\,\text{mL}$.
- `calibro-parti` (TikZ, 332 x 173 px): asta, cursore, becchi esterni e interni, asta di profondità, un oggetto stretto.
- `nonio-decimale-lettura` e `nonio-ventesimale-lettura` (TikZ, 329 e 342 x 114 px): scala principale e nonio da vicino,
  la divisione che coincide in arancione con un triangolino.
- `micrometro-lettura` (TikZ, 324 x 165 px): cilindro fisso con millimetri e mezzi millimetri, tamburo con la divisione 23.
- `calibro-nonio` (interattiva, `src/components/content/interactive/fisica/CalibroNonio.tsx`, registrata in `FIGURES`):
  le due scale da $-1$ a $31\,\text{mm}$, un cursore sposta lo zero del nonio da $0$ a $10\,\text{mm}$ a passi di un
  decimo o di un ventesimo; la divisione che coincide si colora; bottoni per il tipo di nonio e per mostrare la lettura.
  Lo stesso file esporta `NonioScala`, che disegna anche la scena `calibro` degli esercizi. Guardata in chiaro e in scuro,
  a 800 e 390 px, dopo il clic su "Mostra la lettura" e su "ventesimale": zero errori, niente scorrimento laterale.

## Per il generatore

`fis-strumenti-misura`, cinque livelli a scelta multipla (specifica in `specs/exercises/fis-strumenti-misura.md`):
portata e sensibilità, scrivere e scegliere, righello e cilindro, calibro decimale, calibro ventesimale. Dal livello 3 con
le scene `righello`, `cilindro-graduato` e `calibro` (`src/components/content/exercises/scenes/`).

## Domande per Andrea

- Incertezza di una lettura singola: la sensibilità intera o metà divisione?
- Il righello che non parte da zero con incertezza $0{,}2\,\text{cm}$: va bene anticipare la somma delle incertezze, o
  l'esempio va rifatto con lo zero allineato?
- Il micrometro (palmer) si fa nel vostro laboratorio? Se sì, serve un livello di esercizi con la scena del tamburo.
- Nel nonio ventesimale il vostro calibro ha $19$ o $39\,\text{mm}$, e i numeri da $0$ a $10$?
- Nella scena del calibro la divisione che coincide è segnata con un triangolino: così l'esercizio allena la lettura
  (millimetri interi e divisione per sensibilità) e non la ricerca della coincidenza, che su uno schermo a volte non si
  vede. Va bene?
- Nell'elenco delle caratteristiche mancano la "soglia" e la "precisione", che alcuni libri mettono qui: servono?
