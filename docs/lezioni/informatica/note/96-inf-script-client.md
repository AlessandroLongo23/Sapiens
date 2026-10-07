# Note: Gli script nella pagina web

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Pagine web interattive", gruppo 14), insieme alla 97 e alla 98. Non pubblicata.

## Struttura

Apertura con il numero dei posti liberi scritto a mano nell'HTML; che cos'è uno script e dove gira; come si collega e perché serve `defer`; il linguaggio accanto a Python e C++; la console; tre esercizi.

- Pagine da modificare: 1 (i posti liberi calcolati dallo script), più 1 esercizio.
- Programmi `codice javascript`: 2 (biglietti interi e ridotti con `prompt()`; funzione e ciclo `for`), più 2 esercizi con le prove.
- Figure interattive: 2. Riquadri `ad-warning`: 3 (script prima della pagina, testo da `prompt()`, tre segni di uguale); `ad-note`: 1.

## Confini con le lezioni vicine

- La 96 usa una sola riga che tocca la pagina, `document.querySelector("#liberi").textContent = liberi`, senza spiegarla: serve a vedere un effetto e a motivare `defer`. Selezione degli elementi, `textContent`, classi ed eventi sono tutti della 97.
- I vettori di JavaScript compaiono in una frase e in una voce della figura dei costrutti (`[4, 7, 9]`, `v.length`): la 97 li usa per il risultato di `querySelectorAll` e in un esercizio.
- Niente oggetti, niente funzioni freccia, niente `var`, niente `for...of`: il ciclo sui vettori è quello con l'indice, come nella 70.
- Client e server: un paragrafo con il link alla 34 e alla 36. Il web dinamico è del quinto anno e non è linkato.

## Scelte

- Lo script si collega sempre con `<script src="script.js" defer></script>` nella `head`. Il tag in fondo al `body` è nominato come alternativa che dà lo stesso risultato, e la figura lo mostra.
- `const` per tutto quello che non viene riassegnato, `let` per il resto. `var` non è nominato.
- Sempre `===` e `!==`; `==` compare solo nel riquadro che dice di non usarlo.
- Punto e virgola alla fine di ogni istruzione, rientro di quattro spazi, graffa aperta sulla riga dell'istruzione.
- I nomi sono in italiano e in minuscolo, come nel resto del lotto. Dove servono due parole si usa la scrittura di JavaScript con la maiuscola in mezzo (`nomeValido` nella 98), perché è quella dei nomi del linguaggio (`querySelector`, `textContent`).
- `prompt()` e `console.log()` sono il modo di leggere e scrivere dei programmi senza pagina, come nell'editor. La lezione dice che `prompt()` restituisce un testo e mostra `"2" + "3"`.
- La console è presentata come la zona sotto la pagina nell'editor, e come pannello degli strumenti per sviluppatori in un browser. Nessun nome di browser.
- I messaggi di errore citati (`ReferenceError: venduto is not defined`, `Cannot set properties of null`) sono quelli che lo studente legge nell'editor con un browser basato su Chromium. Altri browser usano parole diverse: per questo il riquadro dice "un errore che parla di `null`, come...".

## Elementi interattivi

- Pagina con lo script (blocchi `html`, `css`, `js`): che cosa cambia nella pagina se cambio un numero nello script, senza toccare l'HTML? Guardata a 1280 e a 390 px, eseguita, provata senza `defer` (nella console compare l'errore con file e riga).
- `inf-script-ordine-lettura` (`ScriptOrdineLettura.tsx`): quando lo script cerca `#liberi`, il browser lo ha già costruito? Tre posizioni del tag, sette passi ciascuna. Il testo dopo la figura dà la risposta.
- Programmi `codice javascript`: il programma dei biglietti (che cosa succede togliendo `Number()`), la funzione con il ciclo.
- `inf-js-costrutti-confronto` (`CostruttiConfronto.tsx`): che cosa cambia tra il costrutto che conosco e quello di JavaScript? Otto costrutti nelle tre forme, con le parole nuove segnate. È la tabella del confronto chiesta dal brief: una tabella markdown a tre colonne di codice sul telefono andava a capo dentro le celle, ed è stata tolta dalla lezione. Il formulario ha una tabella a due colonne con le sole forme di JavaScript.

## Domande per Andrea

- Va bene presentare `const` e `let` insieme dalla prima riga, o al terzo anno conviene solo `let`?
- `defer` nella `head` come unica forma usata: molti libri del liceo mettono il tag in fondo al `body`. Quale delle due vuoi nelle lezioni?
- I vettori hanno solo una frase e una voce nella figura (`const v = [4, 7, 9]`, `v.length`). È troppo per una lezione che non li usa, o va bene come anticipo della 97?
- Il programma con `prompt()` va bene come ponte tra i programmi del capitolo precedente e la pagina, o preferisci che tutto passi da una pagina fin dall'inizio?

## Da verificare

- Storia del nome: JavaScript è nato nel 1995 in Netscape (Brendan Eich), e il nome è stato scelto per ragioni commerciali nel periodo del lancio di Java. Fonte da controllare: A. Wirfs-Brock e B. Eich, "JavaScript: the first 20 years", HOPL IV, 2020. La lezione non dà date.
- `defer`: uno script con `defer` viene eseguito dopo che il documento è stato letto, nell'ordine in cui compare. Fonte da controllare: HTML Living Standard del WHATWG, sezione sull'elemento `script`.
- "Di solito con il tasto F12 o con la voce Ispeziona": vero per i browser più diffusi su computer, da ricontrollare; su telefono gli strumenti non ci sono.
- "Uno script non può leggere i file del tuo disco né guardare le altre schede": è la regola generale; i file scelti dall'utente con un campo `type="file"` sono un'eccezione che la lezione non nomina.

## Verifiche

- `check.mts`: nessun errore, nessun avviso. `verifica.mts`: i due esercizi `javascript` superano le prove; per la pagina dà l'avviso atteso ("i controlli si provano nel browser").
- Nel browser (Playwright, 1280 e 390 px): ogni blocco eseguito; i due programmi con le risposte 2 e 3; i tre esercizi con "Verifica" sul codice di partenza (bocciato) e sulla soluzione (superato).

Prerequisiti proposti: inf-html-struttura, inf-client-server, inf-parametri-ritorno, inf-ciclo-for

## Revisione del lotto (7 ottobre 2026)

- Il concerto della pagina è ora "di beneficenza": i biglietti costano 8 euro, mentre il concerto di fine anno delle lezioni 88-91 è gratuito e in aula magna. Nell'alt della figura "il paragrafo con id liberi" è diventato "l'elemento" (è uno `span`).
