---
stato: decisa
release: dopo la beta
aggiornato: 2026-09-24
tag: [prodotto, studenti, gamificazione]
---
# Adesivi

Adesivi che lo studente guadagna studiando, raccoglie in album e attacca sui quaderni dello [[Zaino]] e sull'avatar. Regole in [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]].

## Stato attuale
Niente come funzione. Esistono i pezzi grafici: `src/components/ui/Sticker.tsx` (icona su etichetta inclinata) e `src/components/content/flashcards/PeelSticker.tsx` (l'adesivo che si stacca dalla risposta delle [[Flashcard]]). Non esiste un avatar.

## Obiettivo
- Un album per materia, come quello delle figurine, con le caselle vuote per gli adesivi mancanti.
- Un adesivo guadagnato si stacca dal foglio con lo stesso gesto delle flashcard e si attacca dove lo studente vuole: prima sulle copertine dei quaderni, poi sull'avatar.
- Si guadagnano con impegno e padronanza: giorni consecutivi della [[Pratica quotidiana]], un capitolo portato all'ultimo livello degli [[Esercizi]], un errore frequente superato, una verifica del [[Diario e calendario]] preparata. Alcuni arrivano a sorpresa.
- Collezioni stagionali (inizio anno, periodo delle verifiche, maturità) che restano ottenibili dopo la stagione.
- Sfide di comunità cooperative, senza classifiche, con obiettivi calcolati sugli utenti attivi.

## Dettagli
- Nessun adesivo si compra.
- Gli adesivi si calcolano sul server dalla tabella dei tentativi (vedi [[2026-09-23 Progressi salvati per ogni tentativo]]), come la serie di giorni.
- Stile provvisorio: cultura matematica disegnata a mano, con il tratto dello schizzo della home (π, parabole, teoremi, scienziati, battute sugli errori).

### Il gesto di attacco e stacco
Idea di Alessandro, 24 settembre 2026: attaccare e staccare un adesivo deve dare soddisfazione, con un effetto tattile convincente.

Attacco, con il mouse:
1. Da un cassetto con gli adesivi si clicca quello che si vuole, e l'adesivo si aggancia al puntatore.
2. L'adesivo segue il puntatore, tenuto per il centro; la rotella lo ruota intorno al centro.
3. Scelti punto e orientamento, si preme: tocca il foglio solo l'angolo d'appoggio, sempre quello in basso a sinistra sullo schermo. L'angolo di stacco è sempre quello opposto, in alto a destra. Quando l'adesivo ruota, i due angoli si scelgono di nuovo in base all'inclinazione, così restano sempre in quelle posizioni (Alessandro, 24 settembre 2026). Il resto è sollevato, leggermente curvo, con l'ombra sul foglio.
4. Tenendo premuto, si trascina verso l'angolo di stacco e l'adesivo aderisce poco a poco.
5. Quando il trascinamento esce dalla sagoma dell'adesivo, l'adesivo aderisce del tutto, con un lieve effetto di particelle.
6. Basta anche un clic: l'adesivo si stende da solo, dall'angolo d'appoggio a quello di stacco (Alessandro, 24 settembre 2026).

Stacco:
1. Al passaggio del puntatore compare l'angolo di stacco, come sulle [[Flashcard]].
2. Premendo e trascinando, l'animazione va nel verso opposto a quella dell'attacco. Basta anche un clic, come sulle flashcard: l'angolo resiste un istante e poi l'adesivo viene via tutto (Alessandro, 24 settembre 2026).
3. Quando l'adesivo è staccato del tutto si gira nel verso opposto a quello dello stacco: la piega si riapre all'indietro e il davanti torna su dalla parte da cui l'adesivo è venuto, senza completare un giro intero (Alessandro, 24 settembre 2026). Intanto arriva in mano, e alla fine oscilla appena, come l'onda dello strappo.

Note di progetto:
- L'attacco è lo stacco di `PeelSticker.tsx` al contrario: la piega come asse del segmento tra angolo e puntatore e il retro riflesso si possono riusare.
- Sapiens è mobile-first ([[2026-09-03 Mobile-first, poi PWA, poi Capacitor]]): sul telefono non ci sono rotella né passaggio del puntatore. Proposta: si trascina dal cassetto col dito, si ruota con due dita, l'angolo di stacco è sempre un po' sollevato come l'orecchia delle flashcard a riposo.
- Con "riduci movimento" niente particelle né oscillazione, solo una dissolvenza; da tastiera frecce per spostare, un tasto per ruotare, Invio per attaccare.
- Se si lascia a metà dell'attacco: oltre una soglia, o con un colpo veloce come sulle flashcard, l'adesivo finisce di aderire da solo; sotto la soglia torna in mano, agganciato al puntatore (Alessandro, 24 settembre 2026).
- Vibrazione all'aderenza completa sul telefono: `navigator.vibrate` funziona su Android ma non su Safari per iOS (da verificare); con Capacitor c'è il plugin Haptics.
- Desktop e tablet non vibrano (l'iPad non ha vibrazione), quindi la conferma passa da vista e suono. Proposta: alla pressione l'adesivo si schiaccia appena e l'ombra si stringe, all'aderenza completa un riflesso di luce attraversa la superficie; un suono breve e sommesso di carta che aderisce e di strappo, che si può spegnere e che non parte con l'audio del dispositivo disattivato (da decidere se acceso per default).
- Tablet: stesso gesto del telefono con le dita. Con la Apple Pencil l'iPad riconosce il passaggio sopra lo schermo, quindi l'angolo di stacco può comparire come col mouse (da verificare nel browser).
- Trackpad: lo scorrimento a due dita arriva come rotella ed è molto più fitto, quindi la rotazione va smorzata; su Safari per macOS si può usare anche il gesto di rotazione a due dita.
- Un adesivo staccato torna nel cassetto: non si perde.

### Prototipo
Il 24 settembre 2026 è pronto un prototipo del gesto in una pagina sola, fuori dal codice di Sapiens: https://claude.ai/artifact/B3vCZVbFiLsmzo8ivRMuZk (privato, da condividere con Dario dal menu Condividi). Ha 8 adesivi in stile cultura matematica, la copertina e la pagina a quadretti, l'attacco a fasce curve con l'ombra, lo stacco preso da `PeelSticker.tsx` e il ribaltamento dell'adesivo quando si stacca. Nelle regolazioni si cambiano soglia e sollevamento, e si accendono o spengono particelle, suono e rallentatore.

## Domande aperte
- Il suono degli adesivi è acceso o spento per default?
- Stile e prima collezione, con Dario.
- Gli utenti Free guadagnano adesivi come gli abbonati? La sessione gratuita giornaliera è proprio l'abitudine che gli adesivi dovrebbero sostenere.
- Quanti adesivi per collezione, e ogni quanto ne arriva uno.
- Com'è fatto l'avatar, e se serve.
- Da quanti utenti attivi in su hanno senso le sfide di comunità.

## Collegamenti
- Attori: [[Studente]]
- Release: dopo la [[Release Beta]]
- Decisioni: [[2026-09-24 Adesivi dopo la beta, premiano impegno e padronanza]], [[2026-09-24 Linguaggio visivo del quaderno a quadretti]]
- Idee: [[Mascotte per materia]]
