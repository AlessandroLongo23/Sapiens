# Note: Caratteri tipografici e font

Lezione nuova (lotto del terzo anno, 7 ottobre 2026). `check.mts` passa senza errori e senza avvisi di stile; i controlli delle cinque pagine web si provano solo nel browser, e lì le due soluzioni passano e le due partenze no. 284 righe: circa 150 di testo, il resto sono le cinque pagine (HTML e CSS) e una figura TikZ.

## Scelte

- Confine con la 10: lì il codice del carattere, qui il disegno. La lezione apre proprio da quello (la R è 82, e 82 non dice come si disegna).
- Confine con la 83: font bitmap e a contorni sono presentati come un caso di bitmap e vettoriale, con il link, senza rispiegare i due modi.
- Confine con la 92: lo studente non ha ancora scritto CSS. Le pagine hanno un foglio di stile già pronto, il testo dice solo che ogni riga è `proprietà: valore;` e chiede di cambiare i valori. Selettori di elemento soltanto (`body`, `h1`, `p`), niente classi.
- "Famiglia di caratteri" per quello che i programmi chiamano tipo di carattere; "font" per il file di una variante. Nel parlare comune le due parole si confondono, e la lezione lo dice.
- Tre gruppi di famiglie: con le grazie, senza grazie, a spaziatura fissa. I font decorativi e quelli che imitano la scrittura a mano compaiono solo nella sezione sulla leggibilità.
- "Corpo" definito come altezza dello spazio riservato alla riga, non come altezza di una lettera. Il punto tipografico è 1/72 di pollice (quello dei programmi di oggi).
- Niente font web da scaricare nelle pagine: la pagina della lezione non può fare richieste di rete. I font web sono un paragrafo.
- Formati TrueType e OpenType nominati una volta, con le estensioni.

## Elementi interattivi

- `inf-font-bitmap-contorno` (figura): che cosa succede a una lettera ingrandendola, se è una griglia di pixel e se è un contorno? La R a 10, 20, 40 e 80 pixel nei due modi, con il contorno e i suoi 19 punti da mostrare.
- Pagina 1 (`codice html` con `css`): che cosa cambia tra `serif`, `sans-serif` e `monospace`? Due parole di dieci lettere fanno vedere la spaziatura fissa.
- Pagina 2: che cosa fanno `font-size`, `line-height` e `font-weight`?
- Pagina 3: che cosa fa il browser se il primo font dell'elenco non esiste?
- Due esercizi con `%% controllo` sullo stile calcolato.
- Una figura TikZ: linea di base, corpo, interlinea.

## Da verificare

- La R ha codice 82 (ASCII: A è 65, R è la diciottesima lettera).
- 95 caratteri ASCII stampabili (da 32 a 126, spazio compreso).
- Le grazie come "eredità della scrittura con il pennello e lo scalpello": è la spiegazione tradizionale (Catich, "The Origin of the Serif", 1968), non l'unica.
- Pesi da 100 a 900, 400 normale e 700 grassetto: specifica CSS Fonts.
- "Il corpo del testo non scende sotto i 16 pixel", "interlinea tra 1,4 e 1,6": indicazioni correnti di tipografia per il web (le WCAG chiedono che il testo regga un'interlinea di almeno 1,5), non norme.
- "Un testo tutto in maiuscole si legge più lentamente perché le parole perdono la loro sagoma": è la spiegazione più diffusa, discussa negli studi sulla lettura.
- Georgia, Arial, Verdana, Times New Roman, Courier New non sono installati su tutti i dispositivi (su Android in genere no): la pagina 3 è scritta in modo che il testo dopo valga nei due casi.
- Il controllo `p | stile font-family = "Courier New", monospace` è stato provato solo con Chromium: non so se un altro browser scrive il valore calcolato allo stesso modo.
- Nell'anteprima della figura la R a contorni a 10 pixel viene "impastata": è quello che fa un rasterizzatore senza hinting. La lezione non nomina l'hinting.

## Domande per Andrea

- "Famiglia di caratteri" e "font" vanno bene, oppure preferisci "tipo di carattere" come nei menu dei programmi?
- "Con le grazie" e "senza grazie", oppure "graziati" e "bastoni" come in tipografia?
- Il corpo in punti e in pixel: serve anche l'unità `em`, o resta alla 95?
- La lezione usa il CSS prima della lezione sul CSS: va bene come anticipo, o preferisci spostare la 86 dopo la 92?
- La sezione sulla leggibilità ha sei regole in elenco: troppe?

Prerequisiti proposti: inf-codifica-caratteri, inf-bitmap-vettoriale, http-html

## Revisione del lotto (7 ottobre 2026)

- Nella pagina i componenti sono ora Dario al basso e Marta alla chitarra (erano Amir e Giulia), come nelle lezioni 88-90; "proviamo per la prima volta davanti a un pubblico" è diventato "suoniamo".
