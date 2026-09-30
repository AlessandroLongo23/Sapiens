---
stato: decisa
aggiornato: 2026-09-30
tag: [decisione, esercizi]
---
# Nella risposta aperta la forma conta solo dove è l'esercizio

## Decisione
Una risposta aperta si valuta sul valore. La forma conta, e una forma sbagliata è un errore, solo dove la forma è parte dell'esercizio: scomponi, sviluppa, semplifica, razionalizza, riduci ai minimi termini.

Per questo ogni livello che ha la risposta aperta dichiara cosa si valuta:
- `value`: solo il valore;
- `form`: il valore e la forma (le forme che i generatori hanno già: `factored`, `expanded`, `rationalized`, `simplified`, `irreducible`);
- chiuso: il livello resta a scelta multipla.

Dove conta solo il valore, le scritture equivalenti valgono tutte. Per un'equazione di secondo grado con soluzioni 0 e 2 sono giuste x = 0, 2 e x₁ = 0, x₂ = 2 e x₁,x₂ = 0,2, e così S = {0; 2}, x = 0 ∨ x = 2, l'ordine inverso, un decimale esatto al posto della frazione. Una risposta giusta ma non ridotta, come 3/6, vale giusta, con una riga che dice che si può semplificare.

## Perché
Alessandro, 30 settembre 2026: la forma sbagliata conta come sbagliata solo dove è importante ed è parte dell'esercizio. Se si chiede di risolvere un'equazione, tutte le scritture delle soluzioni vanno accettate.

La dichiarazione per livello serve per un caso che il solo confronto dei valori sbaglierebbe: in "Sviluppa (x − 1)(x + 1)" il testo dell'esercizio copiato come risposta ha lo stesso valore della soluzione.

Alternative scartate: la forma sbagliata sempre come errore (boccia chi ha risolto un'equazione e ha scritto le soluzioni in un altro modo); la forma sempre accettata con un avviso (lascia passare chi non ha scomposto).

## Conseguenze
- I circa 420 livelli con una risposta esatta vanno classificati uno per uno: li prepara Claude con uno script che mostra consegna ed esempi, e i casi dubbi vanno in [[Domande per Andrea]].
- La verifica automatica controlla, per ogni livello: la risposta di riferimento passa anche scritta in più modi, ogni distrattore della scelta multipla è bocciato, il testo copiato è bocciato dove conta la forma.
- La correzione è sul server. L'"Obiettivo" di [[Esercizi]] diceva "controllo di equivalenza nel browser", in conflitto con [[2026-09-24 Ogni tentativo salva l'esercizio intero]]: allineato.

## Collegamenti
- [[Esercizi]], [[Pipeline esercizi]], [[2026-09-30 Ogni livello è una tappa con più tipi di esercizio, e si supera a risposta aperta]]
