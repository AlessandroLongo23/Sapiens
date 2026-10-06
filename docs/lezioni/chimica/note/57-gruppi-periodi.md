# Note: Gruppi, periodi e blocchi

Lezione nuova (terzo anno di chimica, gruppo B, 6 ottobre 2026), prima del capitolo "Il sistema periodico".
Configurazioni e posizioni rifatte con uno script Python sui dati di `src/lib/tools/elementi.json`. `check.mts` passa
senza avvisi su lezione, formulario e flashcard.

## Struttura

La legge periodica moderna, con litio, sodio e potassio; i periodi, con la tabella dei sottolivelli che si riempiono e
l'avviso sul terzo periodo; i gruppi, con la numerazione tradizionale e la configurazione esterna; i blocchi (figura
della tavola a blocchi, tabella, la striscia del quarto periodo); la figura interattiva; dalla configurazione alla
posizione (esempi 1, 2 e 3); dalla posizione alla configurazione (esempi 4, 5 e 6).

## Scelte

- Confini. La storia (Mendeleev, Moseley) è nella 43 e non si ripete. I nomi delle famiglie sono della 61 (gruppo
  D): qui una frase con il link. Gli elettroni di valenza sono della 58: qui si parla di "configurazione esterna" e
  di "elettroni del livello più esterno", senza il termine. Gli andamenti delle proprietà sono delle 59 e 60.
- La legge periodica è detta nella forma "le proprietà sono una funzione periodica del numero atomico", e spiegata
  con il ripetersi della configurazione esterna.
- Il gruppo dalla configurazione ha tre regole, una per blocco: elettroni di $ns$; $12$ più quelli di $np$;
  $ns$ più $(n-1)d$. La regola unica "elettroni dopo il gas nobile" funziona solo fino al terzo periodo e nel blocco
  $d$, e avrebbe richiesto più eccezioni.
- Numerazione tradizionale: solo i gruppi A, da IA a VIIIA. I gruppi B non sono elencati.
- Lantanio e attinio stanno nel gruppo 3, nel blocco $d$, e le due righe sotto la tavola hanno 14 elementi (dal cerio
  al lutezio, dal torio al laurenzio). È il blocco che `elementi.json` assegna a ogni elemento. La tavola periodica
  del sito disegna invece 15 caselle per riga, con lantanio e attinio in testa: lezione e strumento concordano sui
  blocchi, non sul disegno.
- Il nome del gas nobile con $Z = 36$: "cripto", come nella lezione 43. Lo strumento della tavola periodica e la
  figura interattiva di questa lezione, che ne prende i nomi, scrivono "Kripton".

## Dubbi per Andrea

- Lantanio e attinio nel gruppo 3, o lutezio e laurenzio? I libri di scuola italiani mettono di solito il lantanio; la
  IUPAC non ha deciso. Se cambia, cambiano la figura dei blocchi e la figura interattiva.
- Le tre regole per il gruppo vanno bene, o preferisci la sola numerazione tradizionale per i gruppi principali
  (elettroni di $ns$ più $np$) e la numerazione da 1 a 18 letta sulla tavola?
- "Elementi rappresentativi" per i gruppi principali: è il termine che usi?
- La lezione dice che gli elementi di transizione sono i gruppi da 3 a 12. Alcuni libri escludono il gruppo 12
  (zinco, cadmio, mercurio), che ha il $d$ pieno. Va detto?
- "cripto" o "kripton"? Va uniformato tra lezioni e strumento.

## Da verificare

- Niente date né fatti storici in questa lezione.
- La lunghezza del settimo periodo (32 elementi) conta gli elementi fino all'oganesson, come `elementi.json`.

## Figure

Due TikZ, guardate in chiaro e in scuro: `gruppi-periodi-blocchi-tavola` (lo schema della tavola con i quattro
blocchi colorati) e `gruppi-periodi-quarto-periodo` (la striscia dal potassio al cripto con $4s$, $3d$, $4p$ sotto).
La seconda è larga quasi quanto la colonna: sul telefono i simboli diventano piccoli ma restano leggibili.

Una interattiva, `gruppi-periodi-elettrone-casella` (`interactive/chimica/GruppiPeriodiCasella.tsx`): la tavola
completa colorata per blocco; si sceglie il numero atomico con il cursore, con i bottoni "un elettrone in più" e "in
meno", o toccando una casella. La casella si accende, e sotto si leggono configurazione, periodo, gruppo e blocco con
la frase che spiega come ognuno esce dalla configurazione (compresi elio, lantanidi, eccezioni). Guardata in chiaro,
in scuro e a 390 px, ai valori iniziali e dopo aver scelto ferro, cerio e bromo.

## Esercizio guidato

L'esempio 2, $[\text{Ar}]\,4s^2\,3d^6$. Si fermerebbe in tre punti: il periodo (il valore più grande di $n$, non
quello dell'ultimo sottolivello scritto); il blocco; il gruppo come somma di $4s$ e $3d$.

## Esercizi

Generatore `gruppi-periodi`, cinque livelli (specifica in `specs/exercises/gruppi-periodi.md`), tutti a scelta
multipla. Nessun livello a risposta aperta: le risposte sono coppie periodo e gruppo, configurazioni o blocchi.

Prerequisiti proposti: chim-configurazione-elettronica, chim-tavola-mendeleev
