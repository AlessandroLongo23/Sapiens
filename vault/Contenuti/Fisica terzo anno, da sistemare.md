---
stato: in sviluppo
aggiornato: 2026-10-06
tag: [contenuti, fisica, da-fare]
---
# Fisica terzo anno, da sistemare

Quello che non va ancora nel terzo anno di fisica (lezioni 71-119), scritto il 6 ottobre 2026 e pubblicato lo stesso giorno su richiesta di Alessandro senza aspettare queste correzioni. Ogni voce si spunta quando è fatta. Il contesto è in [[2026-10-06 Terzo anno di fisica]]; i dettagli gruppo per gruppo in `docs/lezioni/fisica/rapporti-terzo-anno.md`.

## Lezioni
- [ ] Formule troppo larghe sul telefono. In 38 lezioni su 49 la formula più lunga supera i 600 px (colonna di 358 px a 390 px di schermo): scorrono nel loro riquadro, ma sono scomode. Le peggiori: 76 (955 px), 113 (954), 102 (948), 72 e 108 (908), 83 (897), 77 (885), 106 (859), 91 (849), 119 (835), 74 (832), 96 (830). Vanno spezzate su più righe come hanno fatto i gruppi 32 e 34. Lo script che le misura è `pagine.mjs` nello scratchpad della sessione: da rifare in `scripts/lezioni/` se serve ancora.
- [ ] Coerenza tra lezioni vicine scritte in parallelo da gruppi che non si sono letti: 86-88 con 89-91 (tabella dei momenti d'inerzia, nomi dei corpi, lavoro di un momento e tabella traslazione-rotazione forse ripetuti tra 88 e 89), 92-94 con 95-97 (simboli e parole della gravitazione), 104 e 111 con 114-119 (richiami).
- [ ] Il simbolo $c$ in $I = c\,m\,r^2$ (89) non è nel README: aggiungerlo o cambiarlo.
- [ ] Nella 88 $M$ è sia il momento sia la massa della carrucola.
- [ ] Dati scritti a memoria da controllare su una fonte: gli elenchi "Da verificare" delle note 71-119, a partire da 92 e 93 (date, fatti storici, dati astronomici), 112 (calori molari), 101 (viscosità), 114 (rendimenti tipici, energia di un litro di benzina).
- [ ] Avvisi di `check.mts`: 14 grassetti nella 107 (soglia 12). Gli avvisi sui titoli con un nome proprio (Keplero, Boltzmann, Carnot) sono falsi allarmi: va corretto il controllo, non le lezioni.
- [ ] Cinque figure TikZ delle lezioni 105-108 sono larghe 400-445 px e sul telefono si rimpiccioliscono.

## Figure interattive e scene
- [ ] Scena `piano-pv`: su un ciclo di Carnot mette il nome di uno stato sopra un altro punto (manca il modo di fissare il lato del nome), e nel tema scuro la griglia si legge poco (al livello 2 della 107 lo studente deve leggere 350 kPa tra due etichette).
- [ ] Scena `asta-forze` (del biennio): sotto i 30 gradi scrive l'angolo sopra la freccia. Il livello 3 della 88 evita 20 e 25 gradi; il difetto resta anche negli esercizi del primo anno.
- [ ] Scena `orbita-pianeta`: stringe la lettera $h$ quando la quota è sotto il 10% del raggio.
- [ ] Figura `rotolamento-gara-piano-inclinato` (89): a 10 gradi la lettera $\beta$ tocca la linea tratteggiata.
- [ ] Casi non guardati: la sonda di `campo-gravitazionale-sonda` trascinata lontano; gli estremi bassi dei cursori del lancio obliquo; i vettori paralleli nella 71; il grafico con un solo tratto nella 77; le scene `vettori-piano` dei livelli 4 e 5 della 73; `gas-scatola-urti-pressione` dopo l'ultima modifica a `molecole.tsx`; `molecole-due-meta-microstati` in movimento dopo l'ultima modifica.
- [ ] Nessuna figura provata con il movimento ridotto attivo, su un telefono vero, su Safari o su Firefox.
- [ ] Un errore di idratazione comparso una volta, sotto carico, alla prima apertura di `adiabatica-isoterma-pistone`: non si è ripetuto.

## Esercizi
- [ ] `fis-lancio-obliquo` può dare come risposta giusta un numero con lo zero ambiguo (20 m), che il README di fisica vieta.
- [ ] Poca varietà: livello 6 di `fis-trasformazioni-termodinamiche` (82 esercizi diversi su 1000) e tre livelli dei generatori 92-94 (47, 231 e 310).
- [ ] Controllo Python permissivo: in `fis-gas-perfetto` 56 errori piantati su 200 passano (il dato cambiato non sposta il risultato arrotondato, secondo il gruppo); nelle scene di 78-81 passano da 19 a 30 su 80-120 (numeri di solo disegno, secondo il gruppo); 16 su 120 al livello 5 della 109. Da verificare a mano che nessuno cambi un dato che lo studente legge.
- [ ] Le specifiche di 78-81 hanno un esempio solo per i primi livelli, non due per livello.
- [ ] Esempi delle lezioni rimasti senza esercizio (elenchi nei rapporti): mano destra su un disegno, equazione della traiettoria, conteggio dei quadretti, Terra-Luna, urto nel piano tra masse diverse, il punto tra Terra e Luna, tubo con il mercurio, massa molare, potenza e tempo del frigorifero, freccia del tempo.
- [ ] `fis-viscosita`, `fis-gas-perfetto` e `fis-calori-molari` non hanno scene.
- [ ] Le pagine di revisione (`review.mts`) di diversi generatori sono state generate ma non lette campione per campione (gruppi 36 e 39).

## Kit e doppioni
- [ ] Doppioni da unire: `fisica/flussiCalore.tsx` e `fisica/sorgenti.tsx` (schema della macchina termica); `fisica/molecole.tsx` e le molecole di `chimica/gas.tsx`; le scene `piano-pv`, `curve-pv` e `ciclo-carnot`; `grafico-forza-spostamento`, `grafico-spezzata` e `grafico-velocita-tempo`.
- [ ] Pezzi da portare nel kit, riscritti in più file (terza richiesta): assi con le tacche numerate, quota con due frecce, cilindro con pistone, freccia curva del verso di rotazione, corpo che rotola, ellisse, tubo a sezione variabile, veicolo visto di lato, numeri con decimali fissi e in notazione scientifica, $\odot$ e $\otimes$.
- [ ] `Slider` accavalla l'unità al numero e con passo 0,25 mostra un decimale solo; `ToggleGroup` non va a capo; `Vector` mette male il nome quando la freccia punta a sinistra; `Label` stacca il simbolo dei gradi.

## Collegamenti
- [[2026-10-06 Terzo anno di fisica]], [[Domande per Andrea]], [[Pipeline lezioni]], [[Pipeline esercizi]], [[Agenda]]
