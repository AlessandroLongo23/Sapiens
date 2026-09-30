# Errori già visti

Da leggere prima di scrivere una scena. Ogni voce: il problema, come si evita. Si aggiunge una riga ogni volta che il render, il controllo del layout o il critico trovano qualcosa di nuovo.

## Ambiente
- `\usepackage[italian]{babel}` nel preambolo va in conflitto con il babel del template di manim ("Option clash"). Le formule non ne hanno bisogno.
- LaTeX è TinyTeX in `~/Library/TinyTeX` e non è nel PATH di sistema: si lancia sempre con `./render.sh`, che lo aggiunge insieme a `PYTHONPATH` e alla chiave di `.env`.
- La chiave OpenAI di produzione ha risposto "429, no credits" il 30 settembre 2026: la voce di bozza è `say -v Alice` (motore "say", predefinito). `SAPIENS_VOCE=openai ./render.sh ...` per la voce vera.

## Voce e tempi
- I bookmark funzionano perché il copione si taglia ai bookmark e ogni pezzo si sintetizza a parte: mettili ai confini di frase o di inciso, mai a metà di un numero ("meno <bookmark/>cinque"), altrimenti la voce fa una pausa innaturale.
- I simboli nel copione si scrivono a parole ("x al quadrato", "più o meno", "radice di").

## Segni a mano
- `freccia`: la curvatura è in unità di scena, non proporzionale alla distanza (prima faceva archi enormi).
- Una freccia che indica una parte di formula deve finire accanto alla formula, non sulla parte: altrimenti attraversa i simboli.

## Layout
- Le zone sono riga+colonna: "C1:D3" vuol dire righe C-D e colonne 1-3, cioè a sinistra, non in alto. Per due blocchi uno sopra l'altro si cambiano le lettere, per due affiancati i numeri.
- La riga A è la fascia dell'intestazione; le righe B-F partono due quadretti sotto il tratto rosso del titolo (critico, giro 1: le etichette toccavano il tratto).
- Una colonna con più di 4 righe con frazioni non entra in mezza pagina: `metti` la rimpicciolisce e il controllo segnala "RIMPICCIOLITO". Si divide su due pagine o su due colonne, non si abbassa il corpo.
- Una nota a matita accanto a un blocco nella colonna di destra esce dall'area sicura: si misura prima (Caveat a 44 è circa 0,19 unità per carattere).
- Le colonne si centrano in verticale nella zona: allineate in alto lasciavano vuoto il terzo inferiore.

## Stile
- Rosso solo per i segni del correttore (cerchio, barra, spunta). Le frecce e le note a matita sono in grafite; tutte le etichette, anche "errore frequente", sono in inchiostro chiaro (`INK_MUTED`); il colore della materia resta nell'etichetta dell'intestazione.
- I riepiloghi si scrivono in MathTex (`\text{...}` più la formula), non in Inter con x²: la x deve essere quella della lezione.
- Due bande di evidenziatore vicine si fondono: `pad=0.05` o una banda sola.

## LaTeX
- MathTex non accetta una sottostringa spezzata dentro `\frac{...}` o `\sqrt{...}`. Per segnare un numero dentro una frazione si usa `frazione()` in clip4.py (numeratore e denominatore separati), oppure una riga in più ("72 = 36 · 2") che isola il numero.

## Copione
- Il copione dice sempre l'esempio prima di mostrarlo ("Prendi quattro x al quadrato..."): una formula che compare mentre la voce parla della regola generale confonde.
- Le affermazioni logiche seguono la lezione alla lettera: "un prodotto vale zero se e solo se almeno uno dei fattori vale zero".

## Animazione
- Mai `set_opacity` su un gruppo che contiene curve: imposta anche il riempimento, che era a zero, e le parabole diventano ciotole piene. Si usa `self.sbiadisci(mob)` e `self.ravviva(mob)`, che scalano l'opacità di ogni parte.
- Le note a matita si scrivono (`self.nota(mob)`), non compaiono in dissolvenza: sono fatte a mano come i segni della penna.

## Matematica sullo schermo
- Un "errore frequente" barrato deve essere falso nel contesto: "−5² = −25" è vero, lo sbaglio è "b² = −5²" con b = −5 (critico, clip 2, giro 1).
- La voce non deve leggere la scrittura ambigua che la clip vuole correggere: "il quadrato di meno cinque", non "meno cinque al quadrato".

## Colonne dense
- `\dfrac` e le frazioni in S aggiungono mezza unità di altezza: in una colonna larga un terzo di pagina si usa `\frac` a 40.
- L'allineamento ai quadretti sposta ogni riga fino a un quadretto in giù: per colonne di cinque righe in un terzo di pagina si passa `quadretti=False`.
- Colonne affiancate di altezza diversa si allineano in alto (`verticale=UP`), altrimenti partono ad altezze diverse.

## Tempi
- Ogni risultato ha una pausa prima che la pagina cambi: `pulisci` aspetta un secondo. Un risultato scritto dopo la fine della voce va spostato su un bookmark.
- Un passaggio compare quando la voce lo dice, non quando dice il passaggio prima: una riga con due uguaglianze ("= ±√(49/4) = ±7/2") si divide in due pezzi con due bookmark.

## Voce, di nuovo
- Una potenza di un numero negativo si legge "il quadrato di meno otto" o "meno otto, tutto al quadrato", mai "meno otto al quadrato" (critici delle clip 2 e 4).
- Le condizioni si dicono intere come nella lezione: "quando delta è positivo ma non è un quadrato perfetto", non "quando delta non è un quadrato perfetto" (falso per delta negativo).
- "Radice" in italiano vuol dire anche soluzione: si dice "la radice di delta".

## Frecce
- Il controllo del layout ignora i segni, quindi non vede una freccia che attraversa una riga di calcolo. Le frecce tra righe di una colonna si fanno partire dal bordo destro e curvare verso l'esterno (curva positiva verso destra), e si controllano sui fotogrammi.

## Dal controllo finale del pilota (30 settembre 2026)
- La leggibilità si giudica alla misura del video nella lezione, circa 800 px di larghezza: sotto `font_size` 44 una formula non si legge. La clip 3 (colonne a 36) è il caso da non ripetere: tre colonne affiancate con calcoli non ci stanno, meglio due pagine.
- I segni si misurano sul bersaglio: un cerchio intorno a una cifra dentro una frazione copre ±, √ e la linea di frazione; una barra copre solo la parte sbagliata (`b^2 =` resta pulito, si barra `-5^2 = -25`).
- La matita (Caveat) è per le parole: simboli e numeri nelle note si scrivono in MathTex color grafite, perché nel Caveat lo 0 sembra una o.
