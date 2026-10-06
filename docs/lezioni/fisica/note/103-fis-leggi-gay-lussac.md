# Note: Le leggi di Gay-Lussac

Lezione nuova (lotto del terzo anno di fisica, gruppo 39, 6 ottobre 2026). Conti rifatti in Python con i dati scritti
come nella lezione:

- $\alpha = 1/273 = 3{,}663 \cdot 10^{-3}\,^\circ\text{C}^{-1}$; rispetto all'acqua ($2{,}1 \cdot 10^{-4}$, tabella della
  lezione 66) è $17$ volte, rispetto all'acciaio ($3\lambda = 3{,}6 \cdot 10^{-5}$) $102$ volte;
- esempio 1: $2{,}00 \cdot (1 + 80/273) = 2{,}586$ L;
- esempio 2: $V_0 = 0{,}500 / (1 + 20/273) = 0{,}4659$ L, $0{,}4659 \cdot (1 + 100/273) = 0{,}6365$ L; con $0{,}500$ al
  posto di $V_0$, $0{,}683$ L; in kelvin $0{,}500 \cdot 373/293 = 0{,}6365$ L; con i gradi Celsius $2{,}5$ L; $373/293 = 1{,}273$;
- esempio 3: $273 \cdot (2{,}00/1{,}50 - 1) = 91{,}0\,^\circ\text{C}$;
- esempio 4: $2{,}20 \cdot 333/290 = 2{,}526$ ($\cdot 10^5$ Pa), aumento del $14{,}8\%$;
- esempio 5: $24{,}0 \cdot 400/300 = 32{,}0$ cm;
- figura interattiva: $p = p_0\,(1 + t/273)$ con $p_0 = 60$, $100$, $140$ kPa; a $150\,^\circ\text{C}$ sono $93{,}0$,
  $154{,}9$ e $216{,}9$ kPa; flashcard: $313/293 = 1{,}068$.

`check.mts`: 0 errori. Un avviso "titolo con maiuscole all'inglese" nel formulario su "Con la temperatura in gradi
Celsius": è un nome proprio.

## Scelte

- La chimica (lezione 32) parte dalla retta in gradi Celsius solo per il volume, passa subito ai kelvin e chiama le
  due leggi "di Charles" e "di Gay-Lussac". Qui i nomi sono quelli del titolo dell'albero, prima e seconda legge di
  Gay-Lussac, con una nota finale sugli altri nomi. La lezione dà tutte e due le leggi nella forma con $\alpha$, ricava
  lo zero assoluto dal fatto che il coefficiente è lo stesso, e ricava la forma in kelvin con il conto ($V = V_0\,T/T_0$),
  che in chimica è solo enunciato. In più: il legame con la dilatazione termica del biennio, il termometro a gas, le
  due trasformazioni nel piano pressione-volume.
- Confine con la 102: il piano pressione-volume e la pressione sotto il pistone sono dati per noti, con il link.
- Confine con la 104: la lezione finisce con la tabella delle tre trasformazioni e rimanda. Niente $pV/T$.
- Confine con la 106: il significato microscopico dello zero assoluto è solo un rimando.
- Simboli: $t$ in gradi Celsius, $T$ in kelvin, $T_0 = 273\,\text{K}$; $V_0$ e $p_0$ sono volume e pressione a
  $0\,^\circ\text{C}$. $p_0$ nel biennio e nella 102 è la pressione atmosferica: la lezione lo dice in una riga, e non
  usa mai la pressione atmosferica con un simbolo. $\alpha$ è lo stesso simbolo del coefficiente di dilatazione volumica
  della lezione 66, ed è voluto: è lo stesso coefficiente.
- $273$ e non $273{,}15$, come nel README; il valore più preciso è dato una volta, parlando dello zero assoluto.
- Lo zero assoluto è presentato come estrapolazione, con le due cautele (il gas liquefa prima; conta che tutte le rette
  arrivino lì). Niente "le molecole si fermano".

## Figure

Cinque TikZ, guardate in chiaro e in scuro. Nei tre grafici l'asse orizzontale ha la stessa scala (1 cm = 60 gradi),
così il grafico in kelvin è quello in gradi Celsius con l'origine spostata: `gay-lussac-volume-temperatura-celsius`
(retta da $(0{,}45;\,0)$ a $(7{,}5;\,3{,}099)$, punto dell'esempio 1 a $(6{,}333;\,2{,}586)$),
`gay-lussac-pressione-temperatura-celsius` ($p_0 = 100$ e $60$ kPa, 1 cm = 50 kPa),
`gay-lussac-volume-temperatura-kelvin` ($273$ K a $x = 4{,}55$, $353$ K a $5{,}883$), `gay-lussac-pistone-riscaldato`
(1 cm = 10 cm), `gay-lussac-isobara-isocora-piano` ($A(1{,}5;\,2)$ su $y = 3/x$, $B(3;\,2)$ e $C(1{,}5;\,4)$ su $y = 6/x$).

Interattiva, registrata sotto il commento del gruppo 39 in `src/lib/utils/interactive.ts`:

- `termometro-gas-zero-assoluto` (`fisica/TermometroGasZeroAssoluto.tsx`). Domanda: a quale temperatura la pressione
  arriverebbe a zero, e cambia se nel bulbo c'è più gas? Risposta nel testo subito dopo. Un bulbo in un bagno da $-100$
  a $150\,^\circ\text{C}$, un manometro, il grafico della pressione in funzione di $t$ dove ogni temperatura provata
  lascia un punto, il bottone che prolunga la retta fino a $-273$ e tre quantità di gas. Usa `Gauge` di
  `chimica/gas.tsx` (importato, non modificato), `heatTint`, `Ticks`, `Words`, `Axes`. Guardata in chiaro, in scuro e
  da telefono, al valore iniziale, agli estremi del cursore, con il prolungamento e con poco e tanto gas. Il nome è
  diverso da `gas-cilindro-charles` di chimica.

Nessun blocco `grafico`: quello con il cursore di $V_0$ è già nella lezione di chimica.

## Esercizi

Generatore `fis-leggi-gay-lussac`, cinque livelli (specifica in `specs/exercises/fis-leggi-gay-lussac.md`): Il volume
partendo da 0 °C, La temperatura dalla pressione, Il volume con i kelvin, La temperatura finale della bombola, Di quanto
sale il pistone. Scena `cilindro-pistone` al livello 5, con la scena della soluzione. L'esempio 2 nella forma a due
passaggi (prima $V_0$) non ha un livello: lo stesso problema è il livello 3, in kelvin.

## Esercizio guidato

L'esempio 2 (partendo da un'altra temperatura). Si fermerebbe in tre punti: (1) "il volume dato è $V_0$?", per far
dire di no; (2) "come trovi $V_0$?", prima della divisione per $1 + \alpha\,t_1$; (3) dopo il risultato, "rifallo con i
kelvin: quanti passaggi servono?".

## Da verificare

- Gay-Lussac, 1802 (stessa data della lezione di chimica); Jacques Charles "intorno al 1787", senza pubblicare.
- Lord Kelvin, proposta della scala assoluta nel 1848.
- "Legge di Volta e Gay-Lussac" come nome usato nei libri italiani per la prima legge.
- Il termometro a gas a volume costante "per molto tempo strumento di riferimento per tarare gli altri".
- La pallina da ping-pong ammaccata che torna tonda nell'acqua bollente (apertura): esperienza comune, non misurata.
- $-273{,}15\,^\circ\text{C}$.

## Domande per Andrea

- I nomi: "prima e seconda legge di Gay-Lussac", come nel titolo. L'Amaldi quale chiama prima, quella a pressione
  costante o quella a volume costante? Qui la prima è a pressione costante.
- La forma in gradi Celsius occupa mezza lezione (due esempi e due livelli degli esercizi). È il peso giusto, o al
  terzo anno si passa subito ai kelvin?
- $p_0$ per la pressione a $0\,^\circ\text{C}$ si scontra con $p_0$ pressione atmosferica del biennio. Meglio un altro
  simbolo per una delle due ($p_{atm}$)?
- Il termometro a gas è solo nominato e mostrato nella figura interattiva. Serve un esempio svolto di taratura?

Prerequisiti proposti: fis-legge-boyle, fis-temperatura, fis-dilatazione-termica, fis-proporzionalita-diretta
