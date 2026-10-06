# Note: Entropia e disordine

Lezione nuova (lotto del terzo anno di fisica, gruppo 44, 6 ottobre 2026). Conti rifatti in Python:

- quattro molecole: molteplicità 1, 4, 6, 4, 1 su 16 (6,25 %, 25 %, 37,5 %);
- esempio 2: $10!/(5!\,5!) = 252$, $252/1024 = 0{,}2461$, $1/1024 = 0{,}000977$; $210 + 252 + 210 = 672$, $672/1024 = 0{,}656$;
- testo: $2^{-40} = 9{,}09 \cdot 10^{-13}$ (circa una su mille miliardi); $2^{-100} = 7{,}89 \cdot 10^{-31}$; con 100 molecole
  la frazione dei microstati con tra 40 e 60 molecole a sinistra è $0{,}9648$;
- esempio 3: $100!/(50!\,50!) = 1{,}0089 \cdot 10^{29}$, $\ln(1{,}01 \cdot 10^{29}) = 66{,}785$,
  $1{,}38 \cdot 10^{-23} \cdot 66{,}785 = 9{,}216 \cdot 10^{-22}$ J/K;
- esempio 4: $6{,}02 \cdot 10^{23} \cdot 1{,}38 \cdot 10^{-23} = 8{,}3076$, $\cdot \ln 2 = 5{,}758$ J/K (con $R = 8{,}31$ verrebbe
  $5{,}760$: stesso risultato a tre cifre).

Le coordinate delle tre figure sono state generate con uno script (`tikz119.py` nello scratchpad del gruppo): i sedici
microstati, le barre $1, 10, 45, 120, 210, 252, \ldots$ (3,5 cm per 252), e le tre spezzate dei valori esatti di
$\Omega/\Omega_{max}$ per $N = 10$, $100$ e $1000$.

`check.mts`: 0 errori. Un avviso sul formulario ("titolo con maiuscole all'inglese: Equazione di Boltzmann"): è il
nome proprio.

## Struttura ed esempi

L'inchiostro nell'acqua e il gas che non torna indietro; macrostato, microstato e molteplicità con quattro molecole
numerate (figura con i sedici microstati, tabella con le probabilità); l'ipotesi dei microstati ugualmente probabili
e l'avviso su microstati e macrostati; la formula $\Omega = N!/(N_s!\,N_d!)$ con il fattoriale (esempi 1 e 2, barre
per dieci molecole); l'interattiva; la molteplicità che si stringe attorno alla metà al crescere di $N$ (grafico) e lo
stato di equilibrio; l'equazione di Boltzmann, perché c'è il logaritmo, la nota sulla lettera (esempio 3);
l'espansione libera contando i microstati, con il ritorno alla formula della lezione 118 (esempio 4); che cosa vuol
dire disordine e l'avviso sull'ordine che può aumentare; la freccia del tempo (esempio 5, di ragionamento); il terzo
principio in un riquadro.

## Scelte

- Il numero di microstati è $\Omega$, non $W$: in queste lezioni $W$ è il lavoro, e nella 119 il lavoro è nominato
  nel richiamo dell'isoterma. Un riquadro dice che molti libri scrivono $S = k_B \ln W$. Lo chiamo "molteplicità"
  del macrostato.
- Le molecole a sinistra e a destra sono $N_s$ e $N_d$ (non $n$, che è il numero di moli e compare in $n\,R$).
- Il fattoriale è introdotto qui in due righe, perché il calcolo combinatorio in matematica viene dopo (la lezione
  "Combinazioni e binomio di Newton" non ha ancora un testo e non è linkata); la formula è data senza dimostrazione,
  con il controllo sulla figura dei sedici microstati. La probabilità rimanda alla lezione di matematica "Eventi e
  probabilità".
- Si contano solo le posizioni (sinistra o destra). La lezione dice in una frase che un conto completo tiene conto
  anche delle velocità, senza svilupparlo.
- Nell'espansione libera il fattore $2^N$ è giustificato con "ogni molecola ha il doppio delle posizioni possibili":
  è l'argomento dei libri del terzo anno, e la lezione non fa finta che sia una dimostrazione.
- Confine con la 118: qui niente $Q/T$, solo il richiamo del risultato $n\,R \ln(V_B/V_A)$ per mostrare che i due
  conti coincidono.
- Il terzo principio è in un riquadro `ad-note`, come chiede il brief, nei due enunciati (entropia che tende a zero,
  zero assoluto irraggiungibile).

## Figure

Tre TikZ, guardate in chiaro e in scuro: `microstati-quattro-molecole`, `molteplicita-dieci-molecole`,
`molteplicita-si-stringe` (grafico con assi e griglia; spezzate sui valori esatti).

Interattiva `molecole-due-meta-microstati` (`fisica/MolecoleDueMeta.tsx`, registrata sotto il commento del gruppo 44):
risponde a "dopo che la parete è stata tolta, le molecole tornano mai tutte a sinistra?". Da 4 a 60 molecole (cursore),
tutte a sinistra dietro una parete; un bottone toglie la parete e le molecole si muovono in linea retta rimbalzando
sulle pareti (i pezzi `particle` e `step` di `chimica/gas.tsx`, senza urti tra molecole). Sotto, le barre della
molteplicità di ogni macrostato con evidenziato quello attuale; sono scritti $N_s$, $N_d$, $\Omega$, $P$ e la frazione
del tempo passata con tutte le molecole a sinistra (contata da quando la prima molecola ha attraversato la metà). Con
il movimento ridotto il bottone estrae un microstato a caso alla volta. Guardata in chiaro, in scuro, da telefono, con
4, 20 e 60 molecole, prima e dopo aver tolto la parete e dopo "Ferma".

## Esempio per l'esercizio guidato

L'esempio 2 (dieci molecole). Si fermerebbe in tre punti: (1) "quanti sono in tutto i microstati?"; (2) "come
semplifichi $10!/(5!\,5!)$ prima di moltiplicare?"; (3) "perché il rapporto tra le due probabilità è proprio 252?".

## Esercizi

Generatore `fis-entropia-disordine`, cinque livelli (specifica in `specs/exercises/fis-entropia-disordine.md`):
Contare i microstati, La probabilità di un macrostato, Il macrostato più probabile, L'entropia dai microstati,
L'espansione libera. Scena nuova `scatola-molecole` ai livelli 1 e 2. L'esempio 5 (la freccia del tempo) non ha un
livello.

## Da verificare

- $k_B = 1{,}38 \cdot 10^{-23}\,\text{J/K}$ e $N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$: i valori del README.
- "Ludwig Boltzmann, fisico austriaco, nella seconda metà dell'Ottocento" (la formula è del 1877 nei miei ricordi):
  scritto a memoria.
- "Walther Nernst, chimico tedesco, all'inizio del Novecento" (1906 nei miei ricordi) per il terzo principio: scritto
  a memoria, come i due enunciati.
- "In un bicchiere d'aria le molecole sono circa $10^{22}$": ordine di grandezza (un quarto di litro a temperatura
  ambiente sono circa $0{,}01$ mol, cioè $6 \cdot 10^{21}$ molecole).
- Il link sulla costante di Boltzmann punta alla lezione 104 (gruppo 39), dove il brief dice che compare
  $pV = N k_B T$.

## Domande per Andrea

- $\Omega$ o $W$ per il numero di microstati? L'Amaldi scrive $S = k_B \ln W$; qui $W$ è il lavoro.
- "Molteplicità" per il numero di microstati di un macrostato: è il termine che usa il libro?
- La formula con i fattoriali è data senza dimostrazione, prima del calcolo combinatorio di matematica: va bene, o
  meglio fermarsi ai casi che si contano a mano?
- La freccia del tempo ha un esempio di solo ragionamento (i tre filmati): al livello giusto?

Prerequisiti proposti: fis-entropia, fis-teoria-cinetica, logaritmi-proprieta, concetti-probabilita
