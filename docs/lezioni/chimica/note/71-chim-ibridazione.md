# Note: L'ibridazione degli orbitali

Lezione nuova (6 ottobre 2026), lotto del terzo anno, gruppo G: capitolo "La forma delle molecole e le teorie del
legame", quarta e ultima lezione. `check.mts` passa su lezione, formulario e flashcard, senza avvisi.

## Struttura e confini

Il problema del metano; promozione e ibridazione $sp^3$, con le tre regole degli ibridi e la forma di un ibrido;
ammoniaca e acqua, con gli ibridi che ospitano le coppie solitarie; $sp^2$ con l'etene e $\mathrm{BF_3}$; $sp$ con
l'etino; dalla geometria (numero sterico) all'ibridazione, con la tabella, il procedimento e tre esempi
(formaldeide, $\mathrm{CO_2}$, propene); che cosa dice il modello e che cosa no.

- Confine con la 70: i legami $\sigma$ e $\pi$ sono definiti là; qui si dice con quali orbitali sono fatti (ibridi
  per i $\sigma$ e per le coppie solitarie, $p$ non ibridati per i $\pi$).
- Confine con la 02: la geometria si trova con la VSEPR, e la lezione lo dice in chiaro: l'ibridazione si sceglie
  dalla geometria, non la prevede. La nota della 02 su $\mathrm{H_2S}$ ("servono teorie del legame che vedrai più
  avanti") trova qui la sua risposta, in un riquadro.
- Molecole: quelle del brief (metano, etene, etino, acqua, ammoniaca) più $\mathrm{NH_4^+}$, $\mathrm{BF_3}$,
  $\mathrm{CH_2O}$, $\mathrm{CO_2}$ e il propene. Il propene serve per dire che l'ibridazione è di un atomo, non
  della molecola.
- Gli ibridi con orbitali $d$ sono solo nominati in un riquadro. La teoria degli orbitali molecolari è fuori.
- Il benzene e la delocalizzazione sono del quinto anno (lezione 07): non compaiono.

## Scelte da confermare

- L'ibridazione è presentata come un modo di descrivere, con un riquadro ("non è qualcosa che l'atomo fa prima di
  legarsi"). Molti libri la raccontano come un processo in due tempi; la lezione usa i due passi ma dice che non
  avvengono nel tempo.
- Acqua e ammoniaca come $sp^3$ con gli angoli corretti dalla repulsione delle coppie solitarie, come nei libri di
  scuola. È un'approssimazione (gli ibridi dell'acqua non sono $sp^3$ esatti): il testo dice "si descrivono con".
- "Parte di $s$" e "parte di $p$" (un quarto e tre quarti nell'$sp^3$) al posto di "carattere $s$".
- Nei disegni il lobo piccolo dell'ibrido non c'è, e la lezione lo dice.
- La regola numero sterico → ibridazione è data per gli atomi del secondo periodo, con il limite di
  $\mathrm{H_2S}$ in un riquadro.

## Dati e cose da verificare

- Lunghezza del legame C–H nel metano $109\,\text{pm}$ (108,7): da verificare.
- Angolo di $\mathrm{H_2S}$ circa $92^\circ$, come nella lezione 02.
- "La promozione costa energia, ma il carbonio la recupera": senza numeri (circa 400 kJ/mol per la promozione, a
  memoria, non scritto nella lezione).
- Il boro di $\mathrm{BF_3}$ come $sp^2$ con un orbitale $p$ vuoto: è la descrizione dei libri di scuola.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `ibridazione-carbonio-caselle-sp3`, `ibridazione-s-piu-p`,
`ibridazione-metano-ammoniaca-acqua`, `ibridazione-caselle-sp2-sp`, `ibridazione-etene-sigma-pi`.

Due interattive:

| Nome | File | Che cosa fa |
|---|---|---|
| `ibridazione-forma-ibrido` | `IbridazioneFormaIbrido.tsx` | la forma di un orbitale fatto di $s$ e di $p$, con la parte di $p$ da scegliere tra 0 e 100%: da una sfera a due lobi uguali, passando per $sp$ (50%), $sp^2$ (67%) e $sp^3$ (75%) |
| `ibridazione-mescola-orbitali` | `IbridazioneMescolaOrbitali.tsx` | il carbonio con l'ibridazione a scelta: a sinistra il diagramma a caselle (ibridi e orbitali $p$ rimasti), a destra i lobi attorno al nucleo; sotto, numero di ibridi, angolo, orbitali $p$ rimasti e legami $\pi$ possibili |

La forma della prima figura è la parte angolare del mescolamento, disegnata come grafico polare
($\sqrt{1 - f} + \sqrt{3f}\cos\theta$ con $f$ la parte di $p$): è uno schizzo della forma, come i lobi dei libri, non
una mappa di probabilità come le nuvole della lezione 52. Con meno del 25% di $p$ il lobo piccolo non compare, ed è
corretto.

Manca una figura statica per l'etino: la sezione ha il testo, la figura interattiva subito dopo e la figura del
triplo legame dell'azoto nella lezione 70. Se serve, si può aggiungere un disegno come quello dell'etene.

## Esercizio guidato

L'esempio 4 (i tre carboni del propene). Si fermerebbe in tre punti: quanti domini ha il primo carbonio; quanti il
secondo, con il doppio legame che conta come un dominio; quali orbitali formano il legame tra i due.

## Dubbi per Andrea

- La promozione e l'ibridazione vanno raccontate come due passi, come fa la lezione, o è meglio partire subito dagli
  ibridi?
- L'acqua e l'ammoniaca $sp^3$: va bene per una terza, o conviene dire solo "quattro domini, quattro ibridi" senza
  il nome?
- Il riquadro su $\mathrm{H_2S}$ (ibridazione quasi assente) resta?
- Gli ibridi $sp^3d$ e $sp^3d^2$: bastano due righe o vanno tolti del tutto?
- Serve una figura statica dell'etino con i due legami $\pi$?

## Esercizi

Generatore `chim-ibridazione`, cinque livelli (specifica in `specs/exercises/chim-ibridazione.md`).

Prerequisiti proposti: chim-legame-valenza, geometria-molecolare-vsepr, chim-orbitali-numeri-quantici, chim-formule-lewis
