# Note: MCD e MCM tra monomi

## Errori nell'originale

- Esempio 2: "MCD(3/2, 9/4, 1/8) = 1/8, MCM(3/2, 9/4, 1/8) = 9/1 = 9". MCD e MCM tra frazioni non si usano nei libri italiani, e comunque il valore dell'MCM è sbagliato anche con la definizione generalizzata (MCM dei numeratori diviso MCD dei denominatori), che dà 9/2. Con la convenzione adottata il coefficiente è 1: MCD $= ab$, MCM $= a^4b^3$.
- "Lettere assenti in un monomio si considerano con esponente 0": corretto, ma in questa forma lo studente non capisce che cosa ne segue per l'MCD. Riscritto come "nel MCD vanno solo le lettere comuni a tutti".
- La definizione non diceva che il coefficiente non è determinato dal grado, cioè perché serve una convenzione.
- La sezione sulle applicazioni usava frazioni algebriche, che non sono in questo capitolo. Tolta; resta una frase di apertura su a cosa servono.
- Titolo interno "MCM e MCD" allineato al titolo del sito (MCD e MCM); "Massimo Comun Divisore" con le maiuscole corretto.

## Convenzione sul coefficiente, da confermare

Ho usato: se i coefficienti sono tutti interi, MCD e MCM dei valori assoluti; se almeno uno è una frazione, coefficiente 1; coefficiente sempre positivo. È la scelta che mi risulta più diffusa, ma alcuni testi mettono sempre 1 (da verificare sui libri adottati). La lezione lo dice in un riquadro ad-note. Scelta da confermare.

## Cosa è cambiato

- Aggiunta la definizione di monomio divisibile, con link a Operazioni tra monomi.
- Procedimento in passi numerati e quattro esempi: stesse lettere, segni negativi e lettere non comuni, coefficienti frazionari, nessuna lettera comune.
- Aggiunto un controllo (MCD per MCM uguale al prodotto dei due monomi, a meno del segno), che vale solo per due monomi a coefficienti interi; la lezione lo dice.
- Tutti gli esempi sono verificati con SymPy (gcd e lcm).

## Dubbi

- Nel sito il titolo usa MCM maiuscolo; molti libri scrivono "m.c.m." minuscolo. Ho seguito il sito.

## Formulario e flashcard

- Nel formulario ho tenuto una riga sulla convenzione del coefficiente ("alcuni libri mettono sempre coefficiente 1"), perché lo studente con un libro diverso trova risultati diversi. Se la convenzione cambia, vanno aggiornate anche le carte `coefficiente-interi`, `coefficiente-frazioni`, `mcd-conto`, `mcm-conto`, `mcd-lettere-non-comuni`, `mcd-nessuna-lettera-comune`, `mcm-nessuna-lettera-comune`, `errore-segno-meno`.
