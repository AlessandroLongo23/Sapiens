# Note: Grafici per rappresentare i dati

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "Il foglio di calcolo", seconda metà, 3 ottobre
2026). `check.mts` passa senza errori su lezione, formulario e flashcard (20 carte).

## Struttura ed esempi

Dalla tabella al grafico (serie e categorie, i quattro passi, le parti del grafico: titolo, assi, titoli degli assi,
legenda); quale grafico per quali dati, con la tabella dei quattro tipi e un esempio con figura per ciascuno; i grafici
che ingannano (asse tagliato, torta con troppe fette, torta senza un totale) e tre controlli finali.

Quattro esempi svolti: colonne (iscritti a quattro corsi), linee (temperatura dalle 8 alle 18), torta (come 24 studenti
vengono a scuola), dispersione (ore di studio e voto di dieci studenti). Avvisi: grafico senza titoli e senza legenda,
linea tra categorie senza ordine, asse che non parte da zero, troppe fette, dati che non sono parti di un totale.

Sei figure TikZ, guardate in chiaro e in scuro (`/tmp/informatica-cap6b/fig/`): il grafico a colonne con le sue parti,
i quattro tipi, i due grafici con l'asse da 0 e da 90. Le figure dei quattro esempi sono dentro i riquadri.

Link: "Dati, frequenze e grafici" e "Media, mediana e moda" (statistica), "Rapporti, proporzioni e percentuali" (le
percentuali della torta), "Il piano cartesiano: distanza e punto medio" (i punti della dispersione).

## Scelte

- La statistica non è rispiegata: niente frequenze, medie, angoli dei settori. La lezione di matematica calcola gli
  angoli della torta; qui la fetta è "grande quanto la sua parte del totale", con le percentuali.
- Nomi dei grafici: "a colonne", "a linee", "a torta", "a dispersione", come nei menu dei programmi. La lezione dice una
  volta che il grafico a colonne è l'ortogramma della lezione di statistica e che l'istogramma, in statistica, è un'altra
  cosa. La lezione di matematica chiama "diagramma cartesiano" il grafico a linee: qui non è ripetuto.
- Non ci sono il grafico a barre orizzontali, quello ad area, le colonne in pila e gli effetti 3D.
- La lezione è più lunga delle altre in righe (229) per via delle sei figure; il testo è di circa 12 700 caratteri.

## Conti

- Torta: $12 + 6 + 4 + 2 = 24$; $12 : 24 = 50\%$, $6 : 24 = 25\%$; settori di $180^\circ$, $90^\circ$, $60^\circ$ e
  $30^\circ$ nel disegno.
- Asse tagliato: $100 - 90 = 10$, $110 - 90 = 20$, rapporto 2; differenza vera $10 : 100 = 10\%$.
- Colonne dell'esempio 1: il coro (9) ha meno della metà degli iscritti di robotica (24).
- Sei colonne nel primo grafico: 2 serie per 3 categorie.

## Da verificare

- "Alcuni programmi lo chiamano istogramma": nelle versioni italiane di Excel il grafico a colonne si è chiamato
  "Istogramma" (nelle più recenti c'è anche un tipo "Istogramma" statistico, distinto da "Colonne"); LibreOffice Calc
  lo chiama "Colonna". Da verificare sulle versioni in uso a scuola.
- "Oltre cinque o sei fette è meglio un grafico a colonne" è una regola pratica, non una norma: la lezione di
  matematica dice "con dieci settori sottili gli angoli non si confrontano più". Negli esercizi la torta va bene fino
  a 5 parti ed è sbagliata da 12 in su; tra 7 e 11 non si chiede.
- "Lo ridisegna da solo quando i numeri cambiano": vero per i grafici collegati alle celle in Excel, LibreOffice Calc
  e Fogli Google.
- I dati degli esempi (iscritti, temperature, ore di studio) sono inventati.

## Domande per Andrea

- Per i dati nel tempo con pochi valori (gli iscritti di tre anni) molti libri accettano anche le colonne. La lezione
  dice "linee per un andamento nel tempo" senza eccezioni, e negli esercizi lo scopo è sempre scritto: va bene?
- Serve il grafico a barre orizzontali, per le categorie con i nomi lunghi?
