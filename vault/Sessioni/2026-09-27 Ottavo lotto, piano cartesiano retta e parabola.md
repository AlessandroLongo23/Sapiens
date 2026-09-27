---
aggiornato: 2026-09-27
tag: [sessione, contenuti, matematica]
---
# Ottavo lotto: piano cartesiano, retta e parabola

Sessione del 27 settembre 2026, seguito di [[2026-09-27 Settimo lotto, sistemi radicali e secondo grado]]. Secondo lotto del secondo anno: i capitoli Piano cartesiano e retta (7 lezioni) e Parabola e disequazioni di secondo grado (3). Le lezioni complete di matematica passano da 79 a 89.

## Cosa si è deciso
- Il lotto segue i prerequisiti: le disequazioni di secondo grado hanno bisogno della parabola, la parabola del piano cartesiano (Claude, con l'accordo di Alessandro).
- Punti scritti $A(2, -3)$ con la virgola, come le coppie delle lezioni 39, 42 e 68, e coordinate non intere con le frazioni. Distanza tra due punti $\overline{AB}$, distanza punto-retta $d(P, r)$. Forma implicita $ax + by + c = 0$, esplicita $y = mx + q$ (agenti, da verificare con il libro in uso; le domande sono in [[Domande per Andrea]]).
- Rette parallele: le coincidenti contano tra le parallele, come nella 60, così $m_1 = m_2$ vale senza eccezioni.
- Prerequisiti: coefficiente angolare dipende anche dai sistemi (retta per due punti con il sistema); intersezione dipende dal coefficiente angolare; Disequazioni di secondo grado dipende da Studio del segno (il metodo della scomposizione), e per le fratte basta la lezione precedente con i sistemi di disequazioni. 89 lezioni, 134 archi, nessun ciclo.
- Da questo lotto ogni nota di lezione ha una sezione "Domande per Andrea", e le principali vanno in [[Domande per Andrea]].

## Cosa si è fatto
- Dieci lezioni nuove (file 80-89 in `docs/lezioni/`): Il piano cartesiano: distanza e punto medio; Equazione della retta e casi particolari; Coefficiente angolare e retta per due punti; Rette parallele e perpendicolari; Intersezione tra due rette; Distanza di un punto da una retta; Fasci di rette; La parabola; Disequazioni di secondo grado; Disequazioni fratte e sistemi di secondo grado. 87 esempi svolti, 75 figure (il piano con la griglia, rette, parabole con la parte sopra o sotto l'asse, tabelle dei segni), 194 flashcard. Ogni conto e ogni punto delle figure controllato con SymPy; il controllo ha trovato una retta disegnata sbagliata nella 83, corretta. Pubblicate; sul telefono nessuna formula esce dalla colonna e nessuna pagina scorre di lato.
- Link dalle lezioni già scritte: 17, 42, 45, 60, 68, 74, 78. La 45 linkava per la parabola una pagina vuota del terzo anno: ora porta alla 87.
- Dieci generatori di esercizi (68 livelli), verificati su 1.000 esercizi per livello con tre seed, errori piantati tutti bocciati, `width.mts` a 0. I controlli confrontano le rette come rette: un'equazione moltiplicata per 2 è la stessa retta e non può fare da distrattore. Nel browser nessun errore di KaTeX; lo script segnala cinque livelli per un pixel di sporgenza (la $P$ in corsivo delle coppie, le radici), ma nelle schermate tutto si legge. Quasi tutti i livelli vorrebbero una figura: le specifiche dicono quali e con cosa.
- Commit: lezioni c1b0232, generatori 1834650.

## Informazioni nuove
- In questo capitolo gli esercizi senza figura reggono, ma perdono molto: livelli come "leggi $m$ dal grafico" o "disegna la retta" non si possono proporre. Le figure negli esercizi di matematica sono il prossimo limite della pipeline (vedi le specifiche 80-89).

## Domande aperte
Le principali sono in [[Domande per Andrea]], le altre nella sezione "Domande per Andrea" di ogni nota (`docs/lezioni/note/80-89`) e nelle specifiche.

## Prossimo argomento
Push e deploy dei lotti settimo e ottavo; poi il resto del secondo anno: equazioni di grado superiore, probabilità, geometria (circonferenza, aree, Pitagora, similitudine).
