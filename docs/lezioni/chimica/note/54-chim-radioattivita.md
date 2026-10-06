# Note: Radioattività e decadimenti

Lezione nuova (terzo anno di chimica, gruppo C, 6 ottobre 2026), capitolo "Il nucleo e la radioattività", prima di
tre. Non pubblicata. `check.mts` passa su lezione, formulario e flashcard; resta l'avviso sui 13 grassetti, che sono
tutti termini nel punto in cui sono definiti (forza nucleare forte, fascia di stabilità, decadimento radioattivo,
radioattività, equazione nucleare, i quattro decadimenti, positrone, emissione gamma, radiazioni ionizzanti, famiglia
radioattiva). La lezione è lunga 24 991 caratteri, al limite dei 25 000: circa 2000 sono le coordinate dei 253 nuclei
stabili della prima figura.

## Struttura

Becquerel e i Curie; perché un nucleo è stabile (forza nucleare forte, rapporto tra neutroni e protoni) e la fascia di
stabilità, con la figura; il decadimento, nucleo padre e figlio; le equazioni nucleari e le due somme che si
conservano, con il procedimento in quattro passi; il decadimento $\alpha$; il $\beta^-$; il $\beta^+$ e la cattura
elettronica; l'emissione $\gamma$; la tabella di confronto e la figura degli spostamenti sul grafico; il potere
penetrante, con figura e tabella; le famiglie radioattive e la figura interattiva; le trasmutazioni artificiali, con
il rimando alla lezione 56. Sei esempi svolti.

## Confini con le altre due lezioni del gruppo

- Qui non c'è niente sul tempo: "quando il nucleo decade non si può prevedere" è una frase con il link alla 55. Il
  becquerel e l'attività sono nella 55.
- L'energia dei decadimenti e il difetto di massa sono nella 56. Qui la fissione è nominata solo nell'ultima frase.
- Le dosi (sievert, gray) e gli effetti biologici non ci sono, a parte il riquadro sulle sorgenti $\alpha$ e il radon:
  l'albero non li prevede in nessuna lezione.

## Scelte e fonti

- Dati dei nuclei: stabilità, modi di decadimento e tempi di dimezzamento da NUBASE2020 (Kondev e altri, "The
  NUBASE2020 evaluation of nuclear physics properties", Chinese Physics C 45, 030001, 2021), scaricato dal sito
  dell'IAEA (www-nds.iaea.org/amdc) il 6 ottobre 2026. I 253 quadratini della fascia di stabilità sono i nuclei che
  NUBASE2020 dà come stabili. Le tre famiglie naturali della figura interattiva sono state controllate nuclide per
  nuclide sulla stessa tabella (rami principali).
- Il grafico della fascia ha $Z$ in orizzontale e $N$ in verticale, come nei libri di chimica (Valitutti); la carta
  dei nuclidi dei fisici ha gli assi scambiati. La figura interattiva usa gli stessi assi della figura TikZ.
- "Tutti i nuclei con $Z > 82$ sono instabili": vero. Il bismuto-209 è stato considerato stabile fino al 2003; ha un
  tempo di dimezzamento di $2 \cdot 10^{19}$ anni (NUBASE2020). `elementi.json` lo dà come isotopo naturale al 100%,
  e così torio e uranio: sono naturali ma radioattivi. La scheda dell'elemento nello strumento non dice quali isotopi
  sono radioattivi: sarebbe utile aggiungerlo.
- Notazione: ${}^{238}_{\ 92}\mathrm{U}$ con il numero atomico allineato a destra, come chiede il brief; la lezione
  42 lo scrive senza lo spazio (${}^{23}_{11}\mathrm{Na}$, dove non serve). Elettrone ${}^{\ 0}_{-1}e$, positrone
  ${}^{\ 0}_{+1}e$, neutrone ${}^{1}_{0}n$, protone ${}^{1}_{1}p$.
- Il neutrino è in un riquadro `ad-note` e non compare nelle equazioni.
- La cattura elettronica ha come esempio il berillio-7, che decade solo così; il potassio-40, più noto, decade in due
  modi ($\beta^-$ all'89%, cattura all'11%) ed è nominato solo nella lezione 55.
- Il tecnezio-99m è scritto ${}^{99\mathrm{m}}_{\ 43}\mathrm{Tc}$. Alcuni libri usano l'asterisco per il nucleo
  eccitato.
- La regola per prevedere il decadimento è data come orientamento, con la frase "qualche nucleo decade in più di un
  modo". L'esempio 5 (fosforo-30 e fosforo-32) è controllato su NUBASE2020.

## Da verificare

- Becquerel, 1896, e la lastra nel cassetto; Marie e Pierre Curie, polonio e radio nel 1898: scritti a memoria.
- Rutherford, 1919, prima trasmutazione artificiale (azoto più $\alpha$ dà ossigeno-17 e un protone): a memoria.
- "Più di tremila nuclei conosciuti": NUBASE2020 ne elenca 3340 nello stato fondamentale.
- Spessori che fermano le radiazioni (un foglio di carta, qualche millimetro di alluminio, alcuni centimetri di
  piombo): ordini di grandezza dei libri di testo, non misure.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `radioattivita-fascia-stabilita` (i nuclei stabili veri),
`radioattivita-spostamenti-decadimenti`, `radioattivita-potere-penetrante`.

Una interattiva, `radioattivita-carta-nuclidi` (`RadioattivitaCartaNuclidi.tsx`): un pezzo del grafico, $Z$ da 81 a
92 e $N$ da 123 a 147, con il capostipite a scelta (uranio-238, uranio-235, torio-232). I bottoni $\alpha$, $\beta^-$
e $\beta^+$ spostano il nucleo, sotto compare l'equazione, e la didascalia dice se quel decadimento è quello che il
nucleo fa in natura. Le caselle grigie sono la famiglia naturale, le verdi i nuclei stabili. La domanda ha una
risposta precisa, che il testo dà dopo: $8$ $\alpha$ e $6$ $\beta^-$ dall'uranio-238 al piombo-206. Guardata in
chiaro, in scuro e a 390 px, ai valori iniziali e dopo i decadimenti: nessun errore in console, nessuno scorrimento
laterale. Limiti: il bottone $\beta^-$ è spento sull'uranio, perché il nettunio è fuori dalla finestra; la figura
lascia fare decadimenti che il nucleo in natura non fa, e lo dice nella didascalia.

Una seconda figura interattiva sul potere penetrante (scegli lo schermo, guarda che cosa passa) è stata scartata:
sarebbe stata la figura TikZ con un bottone.

## Esercizio guidato

L'esempio 6 (quanti decadimenti da uranio-238 a piombo-206). Si fermerebbe in tre punti: quale decadimento cambia il
numero di massa; quanto vale $Z$ dopo gli otto decadimenti $\alpha$; quanti $\beta^-$ servono per tornare a $82$.

Prerequisiti proposti: numero-massa, particelle-fondamentali

## Esercizi

Generatore `chim-radioattivita`, sei livelli (specifica in `specs/exercises/chim-radioattivita.md`): il nucleo figlio
di un decadimento $\alpha$; di un $\beta^-$; di un $\beta^+$ o di una cattura elettronica; la particella emessa;
prevedere il decadimento dagli isotopi stabili; contare i decadimenti in una famiglia. Tutti i nuclei sono veri e
decadono come dice l'esercizio (140 emettitori e 105 isotopi per il livello 5, controllati uno per uno su NUBASE2020).
Il livello 6 ha per risposta un numero puro e si propone anche a risposta aperta.

## Dubbi per Andrea

- Il grafico della fascia di stabilità con $Z$ in orizzontale e $N$ in verticale va bene, o in classe usi la carta dei
  nuclidi con $N$ in orizzontale?
- La cattura elettronica va tenuta al terzo anno, o basta il $\beta^+$? Qui ha mezza sezione e metà del livello 3
  degli esercizi.
- Il neutrino resta fuori dalle equazioni, in un riquadro che si può saltare: va bene, o lo vuoi scritto?
- Le dosi e gli effetti biologici delle radiazioni (sievert, fondo naturale) non sono in nessuna lezione dell'albero:
  serve una lezione, o un paragrafo qui?
- Il livello 5 degli esercizi dà gli isotopi stabili dell'elemento e chiede il decadimento atteso: è un esercizio che
  si fa in classe, o è troppo?
