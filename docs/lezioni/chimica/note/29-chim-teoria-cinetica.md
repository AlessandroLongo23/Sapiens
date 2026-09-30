# Note: La teoria cinetico-molecolare

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026). Apre il capitolo "Le leggi dei gas" del secondo
anno, come nel Valitutti (capitolo 4 "La teoria cinetico-molecolare della materia" e 5 "Le leggi dei gas", titoli
letti in `programma.md`; paragrafi da verificare).

## Cosa c'è

Il modello del gas ideale con le cinque ipotesi in un elenco numerato, una figura delle particelle con le velocità; le
proprietà dei gas spiegate dal modello (compressibilità, occupare il recipiente, densità piccola, diffusione, pressione)
con un avviso sull'aria tra le particelle; energia cinetica media proporzionale alla temperatura assoluta, figura a
$200$ e $800\,\text{K}$, la scala Kelvin, esempi 1 (conversioni) e 2 (quando l'energia raddoppia) con l'avviso sul
rapporto dei gradi Celsius; particelle leggere e pesanti, esempio 3 (idrogeno e ossigeno, rapporto $4$), la figura
interattiva e l'avviso sulla stessa energia con velocità diverse; il ponte verso le leggi dei gas e un riquadro su gas
ideali e reali.

Conti rifatti in Python: $-78 + 273 = 195$, $37 + 273 = 310$, $2800 - 273 = 2527$; $600/300 = 2$; $313/293 = 1{,}068$;
$\sqrt{32{,}00/2{,}02} = 3{,}98$; velocità media $\sqrt{8RT/(\pi M)}$ a $298\,\text{K}$: azoto $475\,\text{m/s}$ ("circa
480"), idrogeno $1768\,\text{m/s}$ ("circa 1800"), elio $1256$, argon $397\,\text{m/s}$. `check.mts` passa.

## Scelte

- Le velocità delle molecole sono velocità medie della distribuzione di Maxwell, non le velocità quadratiche medie
  ($515\,\text{m/s}$ per l'azoto): la lezione dice solo "in media" e non dà la formula.
- La relazione $\tfrac12 m v^2$ si usa per il confronto tra gas leggeri e pesanti, con il link alla lezione di fisica
  sull'energia cinetica (secondo anno di fisica). Senza moli: il capitolo della mole viene dopo nell'albero, quindi
  parlo di "masse molecolari relative" con la tavola della lezione 01.
- "Negli esercizi $T = t + 273$", come il README di chimica.
- La frase sull'aria che occupa "circa un millesimo del volume" con le molecole: stima mia (diametro dell'azoto
  $0{,}37\,\text{nm}$, $2{,}5 \cdot 10^{25}$ molecole per metro cubo, frazione circa $7 \cdot 10^{-4}$), da verificare.
- Il palloncino di elio che si sgonfia in un giorno contro una settimana per l'aria: segnato "da verificare" nel testo.
- Gas reali con "errori di meno dell'1%" a temperatura e pressione ambiente: da verificare gas per gas (per l'aria il
  fattore di compressibilità a $1\,\text{atm}$ e $25\,^\circ\text{C}$ è circa $0{,}9997$, da verificare la fonte).

## Figure

Due TikZ, guardate in chiaro e in scuro: `cinetica-gas-particelle` (recipiente con dodici particelle e le frecce delle
velocità, `blue!60!black` come le velocità di fisica) e `cinetica-temperatura-velocita` (due recipienti uguali, frecce
doppie a temperatura quadrupla). Interattiva `gas-effusione-foro` (`chimica/GasEffusione.tsx`): due recipienti uguali,
elio sopra e argon sotto, $26$ atomi ciascuno, con un foro verso una camera vuota; urti elastici tra dischi dello
stesso gas scritti a mano (`chimica/gas.tsx`), velocità dalla distribuzione di Maxwell in proporzione a quelle vere
($1260\,\text{m/s}$ dell'elio a $300\,\text{K}$ disegnati come $1{,}5\,\text{cm/s}$), cursore della temperatura da $100$ a
$600\,\text{K}$, bottone "Apri i fori", conteggio degli atomi passati almeno una volta. Guardata in chiaro, in scuro, sul
telefono e dopo l'apertura dei fori.

La prima versione era un recipiente solo con elio e argon separati da un setto, da togliere: con gli urti tra atomi i
due gas attraversavano il centro allo stesso ritmo (nella diffusione reciproca in un recipiente chiuso i due flussi si
bilanciano), e la figura non mostrava la differenza di massa. L'effusione da un foro (legge di Graham) la mostra.

Nessuna molecola RDKit: la lezione parla di particelle, e la forma delle molecole non serve.

## Esercizi

Generatore `chim-teoria-cinetica`, cinque livelli (specifica in `specs/exercises/chim-teoria-cinetica.md`): Celsius e
kelvin; le ipotesi del modello; temperatura ed energia; particelle leggere e pesanti; quale campione. Nessuna scena.

## Domande per Andrea

- Le cinque ipotesi sono quelle che usate in classe, o i libri del biennio ne danno quattro (senza la distribuzione
  delle velocità)? Il livello 2 degli esercizi dipende da questo elenco.
- Il confronto delle velocità con $\sqrt{m_2/m_1}$ (esempio 3, livello 4 degli esercizi) è da secondo anno, o si ferma
  al "più leggero, più veloce" senza conti?
- La diffusione: basta la spiegazione qualitativa (cammino a zig-zag), o serve nominare la legge di Graham?
- Le velocità medie (circa $480\,\text{m/s}$ per l'azoto a $25\,^\circ\text{C}$): meglio dare la velocità media o la
  quadratica media, che alcuni libri chiamano "velocità delle molecole"?
