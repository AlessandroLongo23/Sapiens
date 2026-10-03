# Note: La codifica dei caratteri: ASCII e Unicode

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "La codifica dell'informazione", 3 ottobre 2026).
`check.mts` passa senza errori sui tre file.

## Struttura ed esempi

Che cos'è un codice dei caratteri; ASCII a 7 bit con la tabella dei blocchi e i tre codici di partenza (48, 65, 97);
maiuscole e minuscole (differenza 32, un solo bit), con la conseguenza sull'ordinamento; le estensioni a 8 bit e il
loro difetto; Unicode e i punti di codice; UTF-8 a lunghezza variabile; quanti byte occupa un testo.

Sei esempi svolti: il codice della E; la parola "Ciao"; da G a g e a k; "Ciao mondo" in ASCII; un documento di 30
pagine in kB; "Perché è così?" in UTF-8. Avvisi: la cifra 7 non ha codice 7; lo spazio è un carattere; in UTF-8
un carattere non è sempre un byte (con "perchÃ©").

## Conti

Rifatti in Python con `ord()` e `str.encode()`: E = 69 = $100\,0101_2$; "Ciao" = 67, 105, 97, 111; g = 103, k = 107;
è = U+00E8 = 232, due byte C3 A8; ù = C3 B9; € = U+20AC = 8364, tre byte; U+1F600 = 128 512, quattro byte;
"Perché è così?" 14 caratteri e 17 byte; "perché" in UTF-8 letto come Latin-1 dà "perchÃ©";
$30 \cdot 40 \cdot 60 = 72\,000$; U+10FFFF + 1 = 1 114 112.

## Scelte

- I codici si danno in base dieci; il binario compare nell'esempio 1 e nella figura delle maiuscole. L'esadecimale
  solo nei punti di codice Unicode, con il link alla lezione 06.
- Di UTF-8 si dà la tabella delle lunghezze, non il modo in cui i bit del punto di codice si distribuiscono nei
  byte (i prefissi 110, 1110, 10): è materia da triennio.
- UTF-16 e UTF-32 non sono nominati.
- Le emoji non compaiono come caratteri nel testo (la regola dello stile le vieta, e KaTeX non le scrive negli
  esercizi): la faccina è descritta a parole con il suo punto di codice.
- Convenzione non fissata dal README: i punti di codice si scrivono U+ e almeno quattro cifre esadecimali, in testo
  normale e non in formula (U+00E8). I caratteri di cui si parla si scrivono senza virgolette quando sono preceduti
  dal nome ("la A maiuscola", "la cifra 7").

## Figure

- `ascii-maiuscola-minuscola`: i 7 bit di A e di a, con il bit di peso 32 evidenziato. Guardata in chiaro e in scuro.
- `utf8-byte-di-piu`: i quattro byte di "più". Guardata in chiaro e in scuro.

## Fonti da verificare

- ASCII, 1963: prima edizione dello standard ASA X3.4-1963; le minuscole sono arrivate con la revisione del 1967.
  La lezione dice "pubblicato nel 1963" e presenta la tabella di oggi: da decidere se precisare.
- Unicode, 1991: versione 1.0, ottobre 1991 (Unicode Consortium). Ricordato a memoria, da verificare.
- "UTF-8 è la codifica della quasi totalità delle pagine web": le statistiche di W3Techs la danno oltre il 98% nel
  2025; numero che cambia nel tempo, nella lezione non c'è la percentuale. Da verificare.
- Latin-1 è ISO/IEC 8859-1; nella tabella per il greco (ISO/IEC 8859-7) il codice 232 è θ. Controllato sulle
  tabelle che ricordo, da verificare.
- "Quasi tutti i caratteri cinesi e giapponesi" in 3 byte: quelli di uso comune stanno sotto U+FFFF, le estensioni
  rare sopra. Da verificare se serve più precisione.

## Domande per Andrea

- I tre codici da ricordare (48, 65, 97): in verifica li date o li chiedete a memoria?
- Fate scrivere i codici in binario o in esadecimale, o solo in base dieci?
- Le estensioni a 8 bit: basta Latin-1 come esempio, o il libro parla di "ASCII esteso" come di una tabella sola?
- UTF-8 con la sola tabella delle lunghezze va bene, o in classe mostrate anche i bit di prefisso?
