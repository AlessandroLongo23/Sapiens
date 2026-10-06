# Note: Legame covalente polare e legame dativo

Lezione nuova (6 ottobre 2026), terza del capitolo "I legami chimici", gruppo E del lotto. Non pubblicata.
`check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura e confini

L'elettronegatività richiamata, con una tabella di quindici elementi, e $\Delta\chi$; il legame covalente polare con
cariche parziali, dipolo e momento dipolare; le soglie e il tipo di legame, con la scala; il confronto tra legami;
il legame dativo con ammonio, ossonio e $\mathrm{BF_3}$ con ammoniaca.

- Confine con la 60: l'elettronegatività non è rispiegata; c'è una frase con gli andamenti e il link. La tabella dei
  valori è qui perché serve per i conti.
- Confine con la 65: del legame ionico c'è solo dove cade sulla scala di $\Delta\chi$.
- Confine con la 69: il momento dipolare è quello di un legame. Che una molecola con legami polari possa essere
  apolare è detto in un riquadro, con il $\mathrm{CO_2}$ e il link; la somma dei dipoli è della 69.
- Confine con la 67: del legame dativo ci sono solo tre esempi. I legami dativi negli ossiacidi e negli ossidi dello
  zolfo, che molti libri italiani usano al posto dell'ottetto espanso, non sono trattati: decide la 67.
- Il carattere ionico percentuale non c'è.

## Scelte

- Soglie: sotto $0{,}4$ covalente puro, da $0{,}4$ a $1{,}9$ compresi covalente polare, sopra $1{,}9$ ionico, come
  nel brief e nella lezione 02, che dice "almeno $0{,}4$". Un riquadro dice che sono una regola pratica, che altri
  libri usano $1{,}7$, e dà due eccezioni: $\mathrm{NaI}$ ($1{,}73$, ionico) e $\mathrm{BF_3}$ ($1{,}94$,
  covalente).
- Freccia del momento dipolare verso l'atomo più elettronegativo ($\delta^-$), con la croce sulla coda, come nei
  libri di chimica. La lezione 02 non disegna frecce (le sue figure sono di RDKit), quindi non c'era un disegno da
  copiare: questa è la prima figura con la freccia, e la 69 dovrebbe usare la stessa.
- $\mu$ è nominato senza formula e senza unità (niente debye).
- "Ione ossonio" per $\mathrm{H_3O^+}$, come nelle lezioni 02 e 47 (altri libri: idronio).
- "Legame dativo, o legame di coordinazione"; "donatore" e "accettore".
- La frase finale su $\mathrm{H_4O^{2+}}$ risponde alla domanda che uno studente fa sempre (perché l'ossigeno non usa
  anche la seconda coppia).

## Dati e cose da verificare

- Elettronegatività: tutte da `src/lib/tools/elementi.json`, controllate con lo script (quindici valori della
  tabella e quattordici differenze). Lì l'idrogeno è $2{,}2$ e il silicio $1{,}9$: nella lezione sono scritti con due
  decimali, $2{,}20$ e $1{,}90$.
- $\mathrm{NaI}$ ionico con $\Delta\chi = 1{,}73$ e $\mathrm{BF_3}$ covalente con $\Delta\chi = 1{,}94$: i conti sono
  controllati; che siano gli esempi giusti di eccezione è da confermare.
- "Nello ione ammonio i quattro legami sono identici": vero, lo ione è tetraedrico.
- "Lo ione $\mathrm{H_4O^{2+}}$ nelle soluzioni non si forma": vero nelle soluzioni acquose; è stato osservato solo
  in superacidi (da verificare), e la lezione dice "nelle soluzioni".
- Nello strumento della tavola periodica i gas nobili leggeri non hanno elettronegatività, kripton e xeno sì ($3$ e
  $2{,}6$): non riguarda la lezione, ma uno studente potrebbe chiederlo.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `polare-nube-cloro-cloruro-idrogeno` (la nuvola simmetrica e quella
spostata, con $\delta^+$, $\delta^-$ e la freccia), `polare-scala-delta-chi` (la scala con le due soglie e sette
legami), `dativo-ammonio-ossonio-formazione` (le due formazioni con la freccia rossa del legame dativo).

Una interattiva:

| Nome | File | Che cosa fa |
|---|---|---|
| `legame-polare-delta-chi-nube` | `LegamePolareDeltaChi.tsx` | due atomi tra undici (H, C, N, O, F, S, Cl, Br, Na, Mg, K); la nuvola della coppia si sposta verso il più elettronegativo, compaiono le cariche parziali o quelle degli ioni, e un segno sulla scala dà la fascia; si leggono le due elettronegatività, $\Delta\chi$ e il tipo di legame. Avvisa quando la regola non si usa (due metalli) o è poco affidabile (un metallo e un non metallo sotto $1{,}9$) |

Guardata in chiaro, in scuro e a 390 px, senza scorrimento laterale. Le tre fasce della scala hanno un colore e una
scritta, così il colore da solo non porta informazione. Per il legame dativo non c'è una figura interattiva: non c'è
niente da muovere che dia una conseguenza da leggere, e la figura TikZ mostra il prima e il dopo.

## Esercizio guidato

L'esempio 1 (tre legami da classificare): si fermerebbe in tre punti. Quale valore si toglie da quale; il confronto
con le due soglie; il caso dell'azoto con il cloro, atomi diversi e legame puro.

## Esercizi

Generatore `chim-legame-covalente-polare`, cinque livelli (specifica in
`specs/exercises/chim-legame-covalente-polare.md`): $\Delta\chi$; tipo di legame; cariche parziali; il legame più
polare tra quattro; il legame dativo. Tutto a scelta multipla. Gli esercizi usano solo coppie lontane dalle soglie e
su cui la regola non sbaglia: l'elenco delle esclusioni è nella specifica. Controllo
`scripts/exercises/checkers/chim_legame_covalente_polare.py`: PASS su 1000 esercizi per livello con i seed 1, 50001 e
777001; errori piantati tutti bocciati; `review.mts` e `width.mts` con codice 0. Non collegato al sito.

## Dubbi per Andrea

- Le soglie $0{,}4$ e $1{,}9$: si confermano, o si usa $1{,}7$ come molti libri? Con $1{,}7$ il legame
  $\mathrm{H{-}F}$ ($1{,}78$) cadrebbe tra gli ionici e diventerebbe l'eccezione da spiegare.
- Il valore esatto $0{,}4$ è polare e $1{,}9$ è polare (come scritto qui), o sono già dall'altra parte?
- Gli esempi di eccezione ($\mathrm{NaI}$ e $\mathrm{BF_3}$) vanno bene, o se ne preferiscono altri?
- Il legame dativo negli ossiacidi ($\mathrm{H_2SO_4}$, $\mathrm{HClO_4}$) e in $\mathrm{SO_2}$, $\mathrm{SO_3}$: si
  insegna alla maniera tradizionale italiana o con l'ottetto espanso? Qui non compare, ma la risposta serve alla 67.
- La freccia del dipolo con la croce sulla coda, verso $\delta^-$: va bene per tutto il capitolo?
- Il monossido di carbonio come esempio di legame dativo: lasciato fuori. Va aggiunto?

Prerequisiti proposti: `legame-covalente`, `chim-affinita-elettronegativita`, `chim-regola-ottetto`, `chim-simboli-lewis`
