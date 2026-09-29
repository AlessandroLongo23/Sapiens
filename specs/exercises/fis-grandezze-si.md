# Grandezze fisiche e unità del Sistema Internazionale

Generatore: `fis-grandezze-si` (`src/lib/exercises/v2/generators/fis-grandezze-si.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_grandezze_si.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/02-fis-grandezze-si.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`): le risposte hanno un'unità, e la
fisica le chiede a scelta multipla con l'unità nell'opzione (`docs/lezioni/fisica/README.md`). Aiuti comuni del gruppo in
`src/lib/exercises/v2/fis-grandezze.ts`.

## Nomi dei livelli

1. Unità e prefissi
2. Un prefisso e l'unità
3. Notazione scientifica
4. Tra due prefissi
5. Ore, minuti e km/h
6. Ordine di grandezza

## Regole comuni

- Numeri come nella lezione: virgola `{,}`, separatore delle migliaia `\,` da cinque cifre nella parte intera
  ($72\,000$, ma $3500$), unità in tondo dopo uno spazio sottile, `$3{,}5\,\text{km}$`, `$4{,}2\,\mu\text{m}$`;
  notazione scientifica `a \cdot 10^{n}` con $1 \le a < 10$ (`10^3`, `10^{-4}`, `10^{12}`, e `10` per $n = 1$).
- I dati hanno da una a tre cifre significative e si costruiscono all'indietro: mantissa ed esponente.
- Le opzioni sono diverse come valori e come scrittura; i distrattori sono gli errori della lezione, poi altri errori
  di un passo.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: unità e prefissi

Tre casi, un terzo ciascuno:

- l'unità del SI di una delle sette grandezze fondamentali; opzioni "nome (simbolo)", con distrattori che sono unità
  vere ma non del SI per quella grandezza (centimetro, grammo, minuto, grado Celsius) o unità di altre grandezze;
- la scrittura corretta di una misura con $\text{kg}$, $\text{m}$, $\text{s}$, $\text{g}$, $\text{km}$, $\text{cm}$: la
  giusta e tre sbagliate della tabella della lezione (Kg, mt, sec, gr, Km, il punto finale, il plurale);
- il valore di un prefisso (giga, mega, kilo, etto, deci, centi, milli, micro, nano): distrattori l'esponente con il
  segno sbagliato e i prefissi vicini ($10^{\pm 1}$, $10^{\pm 3}$).

Esempi: "Qual è l'unità di misura del Sistema Internazionale per la massa?" Risposta: chilogrammo (kg); distrattori
grammo (g), newton (N), tonnellata (t). "Quanto vale il prefisso micro?" Risposta $10^{-6}$; distrattori $10^{6}$,
$10^{-3}$, $10^{-9}$.

## Livello 2: un prefisso e l'unità

Metri ($\text{km}$, $\text{dm}$, $\text{cm}$, $\text{mm}$), grammi ($\text{kg}$, $\text{hg}$, $\text{mg}$), secondi
($\text{ms}$), litri ($\text{hL}$, $\text{dL}$, $\text{cL}$, $\text{mL}$): dal multiplo o sottomultiplo all'unità o
viceversa, metà ciascuno. Dato con al più tre decimali, risposta decimale con al più quattro decimali e non oltre
$1\,000\,000$.

Esempi: "Esprimi $3{,}5\,\text{km}$ in $\text{m}$." Risposta $3500\,\text{m}$; distrattori $0{,}0035\,\text{m}$ (verso
sbagliato), $35\,000\,\text{m}$ e $350\,\text{m}$ (un passo in più o in meno). "Esprimi $3\,\text{dL}$ in $\text{L}$."
Risposta $0{,}3\,\text{L}$.

## Livello 3: notazione scientifica

Esponente da $-9$ a $-2$ o da $3$ a $9$, mantissa con una, due o tre cifre significative, unità $\text{m}$, $\text{s}$,
$\text{g}$, $\text{kg}$, $\text{L}$. Due casi:

- scrivere in notazione scientifica un numero scritto per esteso (circa 60%): distrattori l'esponente con il segno
  sbagliato, gli zeri contati al posto dei posti della virgola, l'esponente di uno in più o in meno;
- riconoscere la notazione scientifica tra quattro scritture dello stesso numero (circa 40%), come l'avviso della
  lezione: $38{,}4 \cdot 10^4$, $0{,}384 \cdot 10^6$, $3{,}84 \cdot 10^5$, $384 \cdot 10^3$.

Esempi: "Scrivi in notazione scientifica la misura $0{,}00042\,\text{m}$." Risposta $4{,}2 \cdot 10^{-4}\,\text{m}$;
distrattori $4{,}2 \cdot 10^{4}\,\text{m}$, $4{,}2 \cdot 10^{-3}\,\text{m}$ (contati i tre zeri dopo la virgola),
$4{,}2 \cdot 10^{-5}\,\text{m}$.

## Livello 4: tra due prefissi

Due prefissi della stessa unità distanti da $10^3$ a $10^9$: metri ($\text{km}$, $\text{m}$, $\text{cm}$, $\text{mm}$,
$\mu\text{m}$, $\text{nm}$), grammi ($\text{kg}$, $\text{g}$, $\text{mg}$, $\mu\text{g}$), secondi ($\text{s}$,
$\text{ms}$, $\mu\text{s}$, $\text{ns}$), litri ($\text{L}$, $\text{mL}$, $\mu\text{L}$). Risposta in notazione scientifica
con esponente da $\pm 2$ a $\pm 12$. I passaggi passano dall'unità, come l'esempio 3 della lezione.

Esempio: "Esprimi $4{,}2\,\mu\text{m}$ in $\text{mm}$, in notazione scientifica." Risposta
$4{,}2 \cdot 10^{-3}\,\text{mm}$; distrattori $4{,}2 \cdot 10^{3}\,\text{mm}$ (esponente rovesciato),
$4{,}2 \cdot 10^{-6}\,\text{mm}$ e $4{,}2\,\text{mm}$ (un prefisso di troppo o di meno).

## Livello 5: ore, minuti e km/h

Tre casi, un terzo ciascuno:

- ore e minuti in secondi ($1$-$5\,\text{h}$, minuti multipli di $5$): distrattori i minuti non convertiti, tutto in
  minuti, "2 h 15 min" letto come $2{,}15\,\text{h}$, $100$ secondi al minuto;
- ore decimali in ore e minuti (parte decimale $0{,}1$, $0{,}2$, $0{,}25$, $0{,}3$, $0{,}4$, $0{,}5$, $0{,}6$, $0{,}75$,
  $0{,}8$): distrattore principale i decimali letti come minuti ($1{,}5\,\text{h}$ come $1\,\text{h}\ 50\,\text{min}$,
  l'avviso della lezione), poi i quarti d'ora vicini;
- velocità: da $\text{km/h}$ (multipli di $18$) a $\text{m/s}$, o da $\text{m/s}$ (interi da $2$ a $40$) a $\text{km/h}$:
  distrattori $3{,}6$ usato al contrario, i fattori $60$ e $1000$ usati da soli.

Esempi: "Esprimi in secondi il tempo $2\,\text{h}\ 15\,\text{min}$." Risposta $8100\,\text{s}$; distrattori
$7215\,\text{s}$, $135\,\text{s}$, $7740\,\text{s}$. "Esprimi in $\text{m/s}$ la velocità $72\,\text{km/h}$." Risposta
$20\,\text{m/s}$; distrattori $259{,}2\,\text{m/s}$, $1200\,\text{m/s}$.

## Livello 6: ordine di grandezza

Una misura in notazione scientifica o per esteso, con primo fattore minore di $3$ o almeno $6$: lì la regola della
lezione ($a < 5$: $10^n$; $a \ge 5$: $10^{n+1}$) e quella con la soglia $\sqrt{10}$ danno lo stesso risultato. Esponente
da $-9$ a $9$, ordine di grandezza mai $10^0$. Distrattori l'altro lato della regola, una potenza in più o in meno,
l'esponente con il segno sbagliato.

Esempio: "Qual è l'ordine di grandezza della misura $6{,}37 \cdot 10^6\,\text{m}$?" Risposta $10^7\,\text{m}$.

## Esercizi da evitare

- Opzioni con lo stesso valore (tranne il caso "riconosci" del livello 3, dove sono uguali per costruzione e diverse
  come scrittura).
- Conversioni con numeri oltre $10^{15}$ o sotto $10^{-15}$.
- Ordini di grandezza con il primo fattore tra $3$ e $6$.

## Verifica

`scripts/exercises/checkers/fis_grandezze_si.py` rilegge dal testo la grandezza, il prefisso o la misura, e ricalcola la
risposta con le tabelle della lezione (le sette unità, le scritture corrette, i prefissi, le unità dei livelli 2 e 4 come
potenze di dieci dell'unità) in aritmetica esatta. Controlla che ogni numero sia scritto nella forma canonica, le quattro
opzioni diverse, una sola giusta, e la quota dei casi.

## Domande per la revisione

- Ordine di grandezza: la lezione usa la soglia $5$; gli esercizi evitano i numeri tra $3$ e $6$. Va bene, o si sceglie una
  regola sola e si usano tutti i numeri?
- Livello 1: "hg" (ettogrammo) al livello 2 è un'unità che gli studenti conoscono dalla spesa; va tenuta?
- Notazione scientifica con esponente $1$: scriviamo $3 \cdot 10\,\mu\text{L}$. Meglio $3 \cdot 10^1$?
