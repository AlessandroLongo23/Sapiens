---
stato: bozza
aggiornato: 2026-09-26
tag: [contenuti]
---
# Programma ministeriale

La mappa di riferimento dei contenuti: cosa si studia in ogni anno e indirizzo.

## Obiettivo
Un indice degli argomenti per materia e anno, basato sulle Indicazioni nazionali per i licei (e le Linee guida per tecnici e professionali quando serviranno), con lo stato di ogni argomento in Sapiens (manca, bozza, pubblicato).

## Dettagli
La matematica delle superiori è abbastanza uniforme; le differenze stanno soprattutto negli ultimi argomenti del quinto anno (equazioni differenziali, alcuni temi di analisi) e tra indirizzi. All'università i programmi cambiano da corso a corso, ed è il motivo per cui si parte dalle superiori.

## Stato attuale (24 settembre 2026)
- In vigore per i licei: Indicazioni nazionali del DM 211/2010. Il testo di matematica del liceo scientifico è diviso in primo biennio, secondo biennio e quinto anno, per temi (aritmetica e algebra, geometria, relazioni e funzioni, dati e previsioni, informatica); non dice in quale anno né in che ordine.
- Nuove Indicazioni nazionali per i licei: bozza pubblicata dal MIM il 22 aprile 2026, corretta a giugno, parere del CSPI il 14 luglio 2026, entrata in vigore prevista dal 2027/28 (fonti: mim.gov.it, umi.dm.unibo.it, blog.uniecampus.it, consultati il 24 settembre 2026). Per la matematica cambia soprattutto l'impostazione; non risulta un elenco di argomenti diverso. Da riguardare quando il testo sarà definitivo.
- L'albero di matematica in `content_nodes` (86 lezioni) non segue né le Indicazioni né un libro: mancano capitoli interi del biennio (logica, scomposizione, frazioni algebriche, statistica, geometria euclidea), la retta è divisa in 15 lezioni, "Trigonometria" contiene Pitagora, Euclide e Talete.
- Albero nuovo approvato e applicato al database il 24 settembre 2026: 39 capitoli, 183 lezioni (104 nel biennio, 79 nel triennio). Fonte: `docs/lezioni/albero.md`; motivazioni: `docs/lezioni/programma.md`. Goniometria al quarto anno come nei libri; vettori, matrici e informatica fuori per ora.
- Confronto con YouMath, Theoremz e Matematicamente.it (24 settembre 2026): Theoremz letto per intero dalla sitemap, YouMath solo in parte (il robots.txt blocca gli agenti AI). Aggiunti alla proposta gli argomenti standard che mancavano (punti notevoli del triangolo, equazioni parametriche, circonferenza e π, seno e coseno nel triangolo rettangolo, e altri); gli argomenti facoltativi sono elencati nel documento.
- 26 settembre 2026: si rifà anche l'albero di chimica delle superiori, in `docs/lezioni/chimica/programma.md` e `docs/lezioni/chimica/albero.md` (vedi [[2026-09-26 La chimica si pubblica gratis accanto alla beta]]).
- 26 settembre 2026: alberi per anno anche per fisica (liceo scientifico, 41 capitoli e 219 lezioni) e informatica (scienze applicate, 36 e 171) delle superiori, e per matematica (33 e 150), Scienze (39 e 187) e Tecnologia (29 e 135) delle medie; applicati al database. Fonti e motivazioni in `docs/lezioni/fisica/`, `docs/lezioni/informatica/`, `docs/lezioni/medie/`. Vedi [[2026-09-26 Fisica, informatica e medie hanno l'albero per anno dal programma]].
- Primo ciclo: le Nuove Indicazioni sono il DM 221/2025 (Gazzetta del 27 gennaio 2026), in vigore dalle prime del 2026/27; seconde e terze restano sul DM 254/2012 fino al 2028/29.

## Domande aperte
- La beta copre il biennio o i cinque anni?
- Vettori, matrici ed elementi di informatica: si aggiungono più avanti?
- Università: alberi da rifare, dopo medie e superiori.
- Quando entrano le medie nel prodotto, e da quale materia si comincia a scrivere.
- Ordine dei capitoli verificato su un indice di un libro diffuso (per ora scritto a memoria).
