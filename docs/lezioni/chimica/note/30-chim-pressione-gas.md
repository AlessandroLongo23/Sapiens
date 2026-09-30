# Note: La pressione dei gas

Lezione nuova (biennio di chimica, gruppo 26 "gas", 30 settembre 2026).

## Cosa c'è

La definizione di pressione con l'esempio 1 (la forza su un pistone); la pressione come urti delle particelle, con la
figura degli urti su una parete e i tre fattori (numero di particelle, temperatura, volume); l'avviso "la pressione non
è una forza"; la pressione atmosferica e Torricelli in due paragrafi, con il link alla lezione 29 di fisica per
l'esperienza e i barometri; la tabella delle unità e le uguaglianze da ricordare, l'esempio 2 (conversioni) e l'avviso
su moltiplicare o dividere; il manometro a tubo aperto con la figura dei due casi, l'esempio 3 e l'avviso sul
dislivello; pressione assoluta e relativa, l'esempio 4 (la gomma dell'auto) e l'avviso sulle leggi dei gas.

Conti rifatti in Python: $1{,}5 \cdot 10^5 \cdot 2{,}0 \cdot 10^{-3} = 300\,\text{N}$; $0{,}850 \cdot 760 = 646$,
$0{,}850 \cdot 101{,}3 = 86{,}1$; $745/760 = 0{,}980$, $0{,}980 \cdot 101{,}3 = 99{,}3$; $790/760 = 1{,}04$;
$752 - 25 = 727$; $3{,}2/1{,}013 = 3{,}16$. La moneta da due euro ha un diametro di $25{,}75\,\text{mm}$ (da verificare),
area $5{,}2\,\text{cm}^2$: $20\,\text{cm}^2$ sono circa quattro monete. `check.mts` passa.

## Scelte

- Costanti del README di chimica: $1\,\text{atm} = 1{,}013 \cdot 10^5\,\text{Pa} = 760\,\text{mmHg}$, e $101{,}3\,\text{kPa}$
  per le conversioni. La lezione 29 di fisica usa $101\,325\,\text{Pa}$ nella tabella; qui basta $101{,}3\,\text{kPa}$.
- Il torr è solo nominato, come sinonimo del millimetro di mercurio.
- Il manometro a tubo aperto dà la pressione in mmHg sommando o togliendo il dislivello: è il modo dei libri di chimica
  generale (Brown, Petrucci); non so se i libri del biennio lo fanno (da verificare).
- Pressione assoluta e relativa: aggiunta perché gli esercizi sulle gomme e sulle bombole danno quasi sempre la
  pressione relativa, e nelle leggi dei gas serve quella assoluta.

## Figure

Due TikZ, guardate in chiaro e in scuro: `pressione-urti-parete` (particelle verso una parete tratteggiata come il suolo
di fisica, una che rimbalza, la forza sulla parete in rosso) e `pressione-manometro-aperto` (due manometri affiancati,
mercurio `gray!60` come in fisica, gas `blue!10`, pressione atmosferica in rosso). Nessuna interattiva: la pressione
come urti si vede nella figura del cilindro della lezione successiva (`gas-cilindro-boyle`), che segna in rosso ogni
urto sulle pareti.

Scena nuova per gli esercizi: `manometro-aperto` (`exercises/scenes/ManometroAperto.tsx`), lo stesso disegno della
figura TikZ con il dislivello in scala ($1\,\text{cm}$ ogni $180\,\text{mm}$, al più $1{,}4\,\text{cm}$) e l'etichetta
$\Delta h$; guardata in chiaro, in scuro, sul telefono.

## Esercizi

Generatore `chim-pressione-gas`, cinque livelli (specifica in `specs/exercises/chim-pressione-gas.md`): da un'unità
all'altra; millimetri di mercurio e kilopascal; forza e pressione sul pistone; il manometro a tubo aperto (scena
`manometro-aperto`); pressione assoluta e relativa.

## Domande per Andrea

- Il manometro a tubo aperto si fa al secondo anno di chimica? Se no, la sezione e il livello 4 degli esercizi si
  tolgono.
- Pressione assoluta e relativa: si nomina, o i problemi del biennio danno sempre la pressione assoluta?
- Il bar e l'ettopascal servono in chimica, o bastano atmosfere, millimetri di mercurio e kilopascal?
- La forza su un pistone (esempio 1 e livello 3 degli esercizi) è troppo "fisica" per questa lezione?
