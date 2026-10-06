# Note: Il momento d'inerzia

Lezione nuova (lotto del terzo anno, gruppo 34, 6 ottobre 2026). Conti rifatti in Python: $0{,}050 \cdot 0{,}20^2 = 2{,}0 \cdot 10^{-3}$
e $0{,}050 \cdot 0{,}40^2 = 8{,}0 \cdot 10^{-3}$ kg·m²; $2 \cdot 2{,}0 \cdot 0{,}60^2 = 1{,}44$; $2{,}0 \cdot 1{,}2^2 = 2{,}88$;
$\frac{1}{2} \cdot 3{,}0 \cdot 0{,}20^2 = 0{,}060$ e $3{,}0 \cdot 0{,}20^2 = 0{,}12$; $\frac{1}{3} \cdot 18 \cdot 0{,}80^2 = 3{,}84$;
$\frac{2}{5} \cdot 5{,}97 \cdot 10^{24} \cdot (6{,}37 \cdot 10^6)^2 = 9{,}690 \cdot 10^{37}$; $0{,}090 + 0{,}18 = 0{,}27$;
$172{,}8 + 36 = 208{,}8$. Figura interattiva: con $m = 1{,}0$ kg e $r = 0{,}50$ m, $I = 0{,}50$, $\alpha = 0{,}80$ rad/s²,
in $4$ s $6{,}4$ rad, cioè $1{,}02$ giri; con $r = 1{,}0$ m $I = 2{,}0$, $\alpha = 0{,}20$, $1{,}6$ rad, $0{,}25$ giri.
`check.mts`: 0 errori, 0 avvisi sui tre file.

## Confini

- La lezione 87 definisce il momento d'inerzia e insegna a calcolarlo; $M_{tot} = I\,\alpha$ per un corpo rigido è della
  88, l'energia cinetica di rotazione della 89.
- Per dare un senso a $m r^2$ prima della 88, la lezione ricava $M = (m r^2)\,\alpha$ per una pallina sola su
  un'asticella leggera, da $F = m a_t$ e $a_t = \alpha r$. La 88 riparte da lì e somma sui pezzetti. L'alternativa
  dell'Amaldi (da verificare) è introdurre $I$ dall'energia cinetica di rotazione, che qui è nella lezione dopo.
- Il teorema di Huygens-Steiner è enunciato e usato, non dimostrato, come da brief; il controllo con le due formule
  dell'asta c'è.
- La figura interattiva usa $\alpha = M/I$ per due masse: il testo lo presenta come lo stesso risultato della pallina
  ("ogni massa dà il suo contributo"), e rimanda alla 88 per il caso generale.

## Scelte

- $I$ senza freccia, in $\text{kg} \cdot \text{m}^2$; massa del corpo esteso $M$, raggio $R$, lunghezza $L$, lato della
  lamina $a$; $I_{cm}$ e distanza tra gli assi $d$. Nella sezione dei corpi estesi $M$ è la massa: il momento della
  forza, che ha la stessa lettera, compare solo nel primo paragrafo e nell'ultimo.
- Tabella con sette righe: anello (e cilindro cavo sottile), disco (e cilindro pieno), sfera piena, sfera cava sottile,
  asta per il centro, asta per un estremo, lamina rettangolare attorno a un lato. La lamina c'è per poter fare
  l'esempio della porta, che torna nella 88.
- La figura dei corpi estesi ne disegna sei (manca la sfera cava, che disegnata è uguale alla piena).
- L'esempio della Terra usa $M_T$ e $R_T$ del README, con tre cifre.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `massa-puntiforme-forza-tangente`, `manubrio-due-assi` (scala $2{,}5$ cm
per metro), `momenti-inerzia-corpi-estesi`, `disco-asse-sul-bordo`, `giostra-disco-bambino` (scala $1$ cm per
$0{,}8$ m: raggio $2$ cm, bambino a $1{,}5$ cm).

Interattiva `asta-masse-momento-inerzia` (`fisica/AstaMasseMomentoInerzia.tsx`). Domanda: con lo stesso momento, quanto
in fretta prende velocità l'asta se le masse stanno vicine all'asse o lontane? Risposta nel testo: a distanza doppia
$I$ è quattro volte più grande, l'accelerazione angolare un quarto, e in quattro secondi l'asta fa un quarto di giro
invece di uno. Cursori: distanza $0{,}4$-$1$ m, massa $0{,}5$-$2$ kg; momento fisso di $0{,}40$ N·m per $4$ s.

## Esercizio guidato

L'esempio 6 (il disco appeso a un chiodo). Si fermerebbe in tre punti: qual è l'asse per il centro di massa parallelo
a quello del chiodo; quanto vale la distanza $d$ tra i due assi; quale formula dà $I_{cm}$.

## Esercizi

Generatore `fis-momento-inerzia`, sei livelli (specifica in `specs/exercises/fis-momento-inerzia.md`), con la scena
nuova `masse-asse` nei livelli 2 e 3. La sfera cava, la lamina (esempio 4) e la Terra (esempio 5) non hanno un
esercizio.

## Da verificare

- Momento d'inerzia della Terra misurato: $8{,}0 \cdot 10^{37}\,\text{kg} \cdot \text{m}^2$ (a memoria; il valore
  corrente è $8{,}04 \cdot 10^{37}$, cioè $0{,}33\,M_T R_T^2$).
- $\frac{2}{3} M R^2$ per la sfera cava a parete sottile e $\frac{1}{3} M a^2$ per la lamina attorno a un lato: formule
  standard, scritte a memoria.
- La frase sui volani con la massa nella corona e sulle ruote da corsa con i cerchi leggeri: è un fatto tecnico noto,
  senza fonte.
- "Teorema di Huygens-Steiner" è il nome dei libri italiani; "teorema degli assi paralleli" è dato come secondo nome.

## Domande per Andrea

- Va bene ricavare $M = (m r^2)\,\alpha$ per una massa sola già in questa lezione, o preferisci introdurre $I$
  dall'energia cinetica di rotazione e spostare l'ordine delle lezioni 87-89?
- La tabella ha sette corpi: sono quelli dei libri del terzo anno, o ne servono altri (cilindro cavo spesso, asta
  inclinata, sfera attorno a un asse tangente come riga a parte)?
- La lamina rettangolare attorno a un lato è spiegata come "una pila di aste": basta, o è un passaggio troppo veloce?
- Il momento d'inerzia della Terra come esempio di corpo non omogeneo: lo tieni, o è fuori posto prima della
  gravitazione?
- Serve la dimostrazione del teorema di Huygens-Steiner almeno per due masse puntiformi?

Prerequisiti proposti: fis-cinematica-rotazionale, fis-momento-forza, leggi-newton, fis-centro-massa
