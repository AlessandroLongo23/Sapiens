---
data: 2026-09-30
tag: [sessione, esercizi]
---
# Risposta aperta e memoria degli esercizi

## Di cosa si è parlato
Alessandro ha chiesto cosa manca alla beta sul codice, lotti esclusi. Claude ha controllato `origin/master` e non le note: diario, inviti, esportazione e cancellazione dei dati, cestino, metriche e piani Free e Studio sono in produzione, anche se diverse note dicono ancora "non pubblicato". Mancano la risposta aperta negli esercizi, Sapiens AI sul progetto OpenAI in UE (oggi `gpt-4o-mini` sull'endpoint standard, senza un tetto per studente), i pagamenti veri (Stripe è sul sandbox) e la conferma del genitore all'iscrizione, che l'informativa promette ma che in `AuthModal` non si trova.

Si è partiti dalla risposta aperta. Claude ha fatto girare tutti i generatori: 888 livelli, 705 di matematica, di cui 250 solo a scelta multipla e circa 420 con una risposta esatta già pronta (203 numeri, 66 insiemi, circa 150 espressioni con la forma richiesta). Alessandro ha proposto i tipi di esercizio a parità di livello, come Duolingo; un editor di formule, tastiera virtuale o libreria, a scelta dello studente; la forma che conta solo dove è parte dell'esercizio. Poi, in modalità sparring, le tappe come Duolingo, con più prove non tutte necessarie per andare avanti, e la ripetizione spaziata sulle curve dell'oblio.

Claude ha corretto due punti, accettati: la memoria è per livello e non per tipo (il procedimento si dimentica, non il formato, e una curva per tipo porterebbe da circa 3 a 6-9 ripassi al giorno), e la tappa si supera a risposta aperta, perché la verifica a scuola è aperta. Sul ripasso implicito sui prerequisiti Claude consigliava di rimandarlo; Alessandro lo vuole nella beta.

Poi Alessandro ha rifiutato l'allenamento a scelta multipla facoltativo e ha proposto una rampa: cinque ripetizioni per livello, dalla sola scelta multipla alla sola risposta aperta, superato alla quarta e padroneggiato alla quinta. Claude ha notato che la quinta, fatta subito, non misura la memoria; Alessandro ha aggiunto che nemmeno una prova dopo due giorni basta, perché serve la curva dell'oblio vera su giorni e settimane. Il modello finale: 4 ripetizioni da 8 domande a rampa fino a superato, poi ripassi aperti decisi da FSRS, padroneggiato quando la stabilità supera una soglia (proposta 30 giorni). Alessandro ha precisato che padroneggiato è un valore dinamico dell'algoritmo, calcolato su tutti gli esercizi fatti, prerequisiti compresi, e non un numero di ripassi. Claude ha proposto che i successi sulle lezioni successive rinfreschino i prerequisiti, mentre gli errori li abbassino solo dopo il ripasso suggerito. Più tardi Alessandro ha deciso la soglia di una ripetizione, 7 giuste su 8, e 4 passi invece di 5 per i livelli senza risposta aperta (3 ripetizioni a scelta multipla, poi il ripasso).

## Decisioni
- [[2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta]]
- [[2026-09-30 La risposta aperta si scrive con MathLive, con la tastiera di Sapiens o quella del dispositivo]]
- [[2026-09-30 Nella risposta aperta la forma conta solo dove è l'esercizio]]
- [[2026-09-30 La memoria degli esercizi è per livello, con FSRS, e la risposta aperta pesa di più]]
- [[2026-09-30 Superato non si perde, padroneggiato torna da ripassare come invito]]
- [[2026-09-30 Il ripasso spaziato e quello implicito sui prerequisiti entrano nella beta]]

## Informazioni nuove
- In produzione ci sono ancora le variabili `PUBLIC_STRIPE_PRICE_LITE/BASE/PRO*` su Vercel.
- Il grafo dei prerequisiti (`src/lib/content/prerequisiti.json`) ha 67 lezioni, il primo anno.
- Diverse note hanno "Stato attuale" vecchio: [[Diario e calendario]], [[Inviti e codici]], [[Account e impostazioni]], [[GDPR e minori]].
- Nuova idea: [[Tipi di esercizio sui passaggi]].

## Rimasto aperto
- Quante domande ha un ripasso nella pratica quotidiana; il tipo della prova di salto; la soglia di padronanza; la ritenzione desiderata; come entra la velocità di risposta; quanto un successo rinfresca un prerequisito.
- Le scritture dubbie della risposta aperta, in [[Domande per Andrea]].
- Da verificare: la virgola decimale e il peso di MathLive; la fonte sulle abilità "crepate" tolte da Duolingo; i dettagli di Math Academy.

## Prossimo argomento
Il lavoro sulla risposta aperta, in ordine: la classificazione dei livelli, poi il correttore con la sua verifica (vedi [[Agenda]], punto 3).
