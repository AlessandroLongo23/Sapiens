# Operazioni con i radicali

Generatore: `radicali-operazioni`
(`src/lib/exercises/v2/generators/radicali-operazioni.ts`). Verifica indipendente:
`scripts/exercises/checkers/radicali_operazioni.py`. Lezione collegata: "Operazioni con i radicali"
(`docs/lezioni/riscritte/73-radicali-operazioni.md`), livelli presi dalla sezione "Per il generatore"
della sua nota.

Lo studente calcola con i radicali e scrive il risultato ridotto. Le lettere sono numeri positivi, come
nella lezione, e i testi che le usano lo dicono. I livelli seguono l'ordine della lezione, ognuno con
una sola difficoltà in più.

## Rappresentazione e risposta

Il generatore lavora con termini `c · (lettere fuori) · ⁿ√(R · lettere dentro)`, ridotti da una sola
funzione: i fattori con esponente almeno uguale all'indice escono (quoziente fuori, resto dentro, come
nella lezione), poi l'indice si abbassa del divisore comune con gli esponenti rimasti. Una somma di
termini somma i radicali simili e mette prima il numero, poi i radicali per indice e radicando
(`-\sqrt{3} + 2\sqrt{5}`, `8 - 2\sqrt{15}`, come negli esempi 9 e 10).

- Livelli 1, 2, 3, 5, 6, 7: risposta `expression` con `form: "simplified"`. `value` in forma SymPy
  (`6*sqrt(2)`, `2*x**2*(2*x)**(1/3)`, `(32)**(1/6)`, `(8) + (-2*sqrt(15))`), `latex` ridotto.
- Livello 4: risposta `choice` (trasporto dentro e confronto non hanno una forma "ridotta").
- Ridotto vuol dire: nessun fattore sotto radice con esponente maggiore o uguale all'indice, indice
  non semplificabile (niente `\sqrt[6]{49}` per `\sqrt[3]{7}`), radicali simili sommati, coefficiente
  1 non scritto.
- `params`: `case` (il caso del livello), `result` (i termini in forma SymPy), `resultTerms` (gli
  stessi, strutturati), `wrong` (i distrattori con LaTeX, valore e se sono ridotti).

## Regole comuni

- Nessun `+ -`, `- -`, `1\sqrt`, `\sqrt{1}`, esponente `^{1}` nel testo.
- Il caso di ogni livello si estrae una volta per esercizio, prima dei tentativi, così gli scarti non
  cambiano le quote (e si saltano due estrazioni di `rng.ts`, che con seed consecutivi non sono uniformi).
- Scelta multipla: quattro opzioni, distinte nel LaTeX e nel valore. Una sola opzione, al massimo,
  ha lo stesso valore della risposta ma non è ridotta (`\sqrt{27}` per `3\sqrt{3}`, `4\sqrt{25}` per
  `20`): è un distrattore, e la verifica la boccia per la forma. Al livello 1 non ce ne sono, perché il
  trasporto fuori arriva al livello 2.

## Livello 1: prodotto e quoziente con lo stesso indice

Il risultato è intero o un radicale già ridotto, come negli esempi della lezione: il trasporto fuori
non serve ancora. Casi, estratti con pesi 3, 3, 2,5, 2:

- prodotto intero: `\sqrt{s u^2} \cdot \sqrt{s v^2}` con s tra 2, 3, 5, 6, 7 e radicandi fino a 75;
- prodotto con i coefficienti: `c_1\sqrt{a} \cdot c_2\sqrt{b}`, a e b senza fattori quadrati e primi
  tra loro, oppure lo stesso radicando (`4\sqrt{5} \cdot 3\sqrt{5} = 60`);
- quoziente, con `:` o con la frazione: `c_1\sqrt{bt} : c_2\sqrt{b}`, con t quadrato o senza fattori
  quadrati, c₁ multiplo di c₂;
- indice 3: `\sqrt[3]{a} \cdot \sqrt[3]{b}` con ab cubo perfetto (a e b non cubi, fino a 108), oppure
  `\sqrt[3]{m^3 b} : \sqrt[3]{b}` con radicando fino a 250.

Esempi: `\sqrt{3} \cdot \sqrt{12} = 6`; `15\sqrt{70} : 3\sqrt{10} = 5\sqrt{7}`;
`\sqrt[3]{54} : \sqrt[3]{2} = 3`.

Distrattori: la somma dei radicandi (`\sqrt{15}` per `\sqrt{3} \cdot \sqrt{12}`), la radice dimenticata
(36), la metà al posto della radice (18), i coefficienti sommati, il radicando moltiplicato invece che
diviso, l'indice 6 per due radici cubiche.

## Livello 2: trasporto fuori, radicandi numerici

`c\sqrt[n]{f^n s}` con n = 2 (7 su 10) o 3. Indice 2: s senza fattori quadrati fino a 21, f da 2 a 8,
radicando fino a 300. Indice 3: s senza fattori cubi fino a 10, f da 2 a 5, radicando fino a 400.
Coefficiente davanti in 4 casi su 10 (radicando allora fino a 200). I passaggi seguono la ricetta
della lezione: scomposizione, esponente diviso per l'indice, quoziente fuori e resto dentro.

Esempi: `\sqrt{72} = 6\sqrt{2}`; `5\sqrt{20} = 10\sqrt{5}`; `\sqrt[3]{54} = 3\sqrt[3]{2}`.

Distrattori: un fattore lasciato dentro (`2\sqrt{18}` per `6\sqrt{2}`, stesso valore, non ridotto), il
quadrato portato fuori al posto della base (`36\sqrt{2}`), il radicando diviso per il fattore e non per
la sua potenza (`6\sqrt{12}`), il coefficiente dimenticato o sommato; con l'indice 3 anche un quadrato
portato fuori da una radice cubica (`3\sqrt[3]{6}` per `\sqrt[3]{54}`) e l'indice perso.

## Livello 3: trasporto fuori con le lettere

`\sqrt[n]{N \cdot` una o due lettere`}` con n = 2 (65 su 100) o 3, lettere a e b oppure x e y, esponenti
da 1 a 7 (indice 2) o da 1 a 8 (indice 3), almeno uno non minore dell'indice; metà dei radicandi ha un
numero (fino a 75). Sotto radice resta sempre qualcosa. Un passaggio per ogni lettera: "5 : 2 = 2 con
resto 1, fuori a², dentro a".

Esempi: `\sqrt{a^{5}b^{2}} = a^{2}b\sqrt{a}`; `\sqrt[3]{16x^{7}} = 2x^{2}\sqrt[3]{2x}`.

Distrattori: quoziente e resto scambiati, il resto dimenticato (niente radice), una potenza lasciata
dentro (stesso valore, non ridotto), il quoziente fuori ma l'esponente intero dentro, il numero non
portato fuori (stesso valore, non ridotto), esponente meno indice.

## Livello 4: trasporto dentro e confronto (scelta multipla)

Metà e metà.

- Dentro: `\pm c\sqrt[n]{s}` con n = 2 (7 su 10) o 3, c da 2 a 5 (da 2 a 3 con l'indice 3), segno meno
  in 45 casi su 100. Con indice pari il meno resta fuori (`-2\sqrt{3} = -\sqrt{12}`), con indice
  dispari entra (`-2\sqrt[3]{3} = \sqrt[3]{-24}`), come nel riquadro della lezione. Opzioni tutte nella
  forma `\pm\sqrt[n]{N}`, nessuna con N potenza perfetta. Distrattori: il meno perso, il fattore non
  elevato (`\sqrt{6}`), il radicando elevato al posto del fattore (`\sqrt{18}`), il quadrato al posto
  del cubo, la somma al posto del prodotto (`\sqrt{7}`).
- Confronto: "Qual è il numero maggiore?" (6 su 10) o "minore", tra quattro numeri `c\sqrt{s}` (c fino a
  6, s senza fattori quadrati fino a 11, c²s fino a 120), a volte uno intero. Radicandi c²s distinti,
  il più grande al massimo 1,8 volte il più piccolo; almeno tre coefficienti da 2 in su. Il trabocchetto
  della lezione ($2\sqrt{3}$ contro $3\sqrt{2}$): quando il coefficiente più grande (più piccolo) è uno
  solo, non è la risposta. Le opzioni sono i quattro numeri.

Esempi: `-4\sqrt{3} \to -\sqrt{48}`; tra `3\sqrt{5}`, `3\sqrt{7}`, `5\sqrt{2}`, `2\sqrt{10}` il maggiore è
`3\sqrt{7}`.

## Livello 5: indici diversi, potenza e radice di un radicale

Tre casi, con pesi 4, 3, 3.

- Indici diversi: coppie di indici 2 e 3, 2 e 4, 3 e 6, 2 e 6 (mcm fino a 6), prodotto o quoziente
  (4 su 10, solo con la stessa base). Stessa base numerica (2, 3, 5), basi diverse (solo prodotto,
  radicando finale fino a 500) o una lettera. I radicali del testo sono già ridotti (esponente primo
  con l'indice). Il risultato si riduce: `\sqrt{x} \cdot \sqrt[3]{x^{2}} = x\sqrt[6]{x}`.
- Potenza: `\left(c\sqrt[n]{s}\right)^{k}` con n = 2, 3, 4, k da 2 a 5 (fino a 3 con il coefficiente), mai
  k = n senza coefficiente. Esempi della lezione: `\left(\sqrt[3]{2}\right)^{4} = 2\sqrt[3]{2}`,
  `\left(2\sqrt{3}\right)^{2} = 12`.
- Radice di radicale: `\sqrt[m]{\sqrt[n]{A}}` o `\sqrt[m]{c\sqrt[n]{s}}` con m, n tra 2 e 3 e prodotto
  degli indici fino a 6. Esempi: `\sqrt{2\sqrt{2}} = \sqrt[4]{8}`, `\sqrt[3]{\sqrt{64}} = 2`.

Distrattori: radicandi moltiplicati senza portarli all'indice comune (`\sqrt[6]{4}`), indici sommati
(`\sqrt[5]{4}`), il risultato non ridotto (`\sqrt[6]{x^{7}}`, `\sqrt[3]{16}`, `\sqrt[6]{49}`), il
coefficiente non elevato (6 per `\left(2\sqrt{3}\right)^{2}`), la radice presa come il radicando (36),
il coefficiente lasciato fuori o portato dentro senza potenza.

## Livello 6: somma di radicali che diventano simili

Pesi 7, 1,5, 1,5:

- numeri: tre termini su un solo radicando (s tra 2, 3, 5, 6, 7) o, in 45 casi su 100, due gruppi
  con tre o quattro termini (esempio 9);
- lettere: tre termini `\sqrt{f^2 s a}` con s tra 1, 2, 3 (`\sqrt{4a} + \sqrt{9a}` della lezione);
- indice 3: due o tre radici cubiche con s = 2 o 3, a volte con il radicando negativo (esempio 15).

Ogni termine è `k\sqrt[n]{f^n s}` con f da 1 a 5 e k = 1 (a volte 2 o 3); almeno due termini da ridurre;
nessun termine scritto due volte; coefficienti del risultato fino a 30. Il risultato non è mai zero.

Esempi: `\sqrt{50} - \sqrt{18} + \sqrt{8} = 4\sqrt{2}`; `\sqrt{12} + \sqrt{20} - \sqrt{27} = -\sqrt{3} + 2\sqrt{5}`.

Distrattori: la radice della somma dei radicandi (l'errore del riquadro, `\sqrt{40}`), un segno
sbagliato, il coefficiente k dimenticato, i coefficienti scambiati tra i due gruppi, tutto su un solo
radicando, il risultato non ridotto (`\sqrt{32}` per `4\sqrt{2}`), il quadrato del fattore portato fuori.

## Livello 7: prodotti notevoli con i radicali

Pesi 3,5, 2,5, 2,5, 1,5:

- quadrato di un binomio: due radicali con radicandi diversi o un radicale e un intero, quadrati fino a 30;
- somma per differenza: `(x + y)(x - y)` in un ordine o nell'altro, con uno o due radicali; risultato intero;
- prodotto di binomi con lo stesso radicale: `(c_1\sqrt{s} + m_1)(c_2\sqrt{s} + m_2)`, che non sia un
  quadrato né una somma per differenza, con il termine in radicale che non si annulla;
- quadrato più un termine `k\sqrt{t}`: in metà dei casi il doppio prodotto si cancella (esempio 14).

Esempi: `\left(\sqrt{5} - \sqrt{3}\right)^{2} = 8 - 2\sqrt{15}`;
`\left(\sqrt{2} + 3\right)\left(\sqrt{2} - 1\right) = -1 + 2\sqrt{2}`;
`\left(\sqrt{3} - \sqrt{2}\right)^{2} + 2\sqrt{6} = 5`.

Distrattori: il quadrato della differenza scritto come differenza dei quadrati (2 per
`\left(\sqrt{5} - \sqrt{3}\right)^{2}`, l'avviso della lezione), il doppio prodotto dimenticato, senza il
2, con il segno sbagliato, il coefficiente non elevato al quadrato; nella somma per differenza la somma
dei quadrati, il segno rovesciato; nel prodotto di binomi i prodotti incrociati dimenticati o con un
segno sbagliato.

## Esercizi da evitare

Radicali del testo già ridotti quando il livello chiede di ridurli (livelli 2 e 6); indici oltre 6;
`\sqrt{4}` o `\sqrt[3]{8}` tra le opzioni del trasporto dentro; un confronto in cui basta guardare il
coefficiente; risultati nulli o con coefficienti oltre 30.

## Figure

Nessun livello ne ha bisogno: l'argomento è di calcolo.

## Verifica

`scripts/exercises/checkers/radicali_operazioni.py` rilegge testo, risposta e opzioni dal LaTeX con un
suo parser (radici con indice, `\frac`, `:`, `\cdot`, prodotto sottinteso, parentesi, potenze), li
valuta con SymPy (lettere positive, radici dispari di numeri negativi reali) e controlla: la risposta
uguale al valore del testo (con `simplify`), `answer.value` uguale, la forma ridotta sul LaTeX della
risposta; una sola opzione giusta e ridotta, al massimo un distrattore con lo stesso valore (non
ridotto), distrattori diversi tra loro, il `values` di ogni opzione uguale al suo LaTeX; i vincoli di
ogni livello (stesso indice e prodotto dei radicandi che non chiede trasporti al livello 1, qualcosa da
portare fuori ai livelli 2 e 3, lettere positive dette nel testo, mcm e prodotto degli indici fino a 6,
numero di termini e di gruppi, forma `\pm\sqrt[n]{N}` e meno fuori con indice pari al livello 4,
trabocchetto del confronto) e le quote dei casi (`CASE_RANGES`). Le opzioni diverse si confrontano in
due punti razionali per le lettere con 50 cifre.

Esito (27 settembre 2026): 7.000 esercizi dal seed 1 e 7.000 dal seed 7001, tutti PASS.

Errori piantati a mano, tutti bocciati (15): risposta cambiata; `answer.value` cambiato; risposta non
ridotta (`\sqrt{48}` al posto di `4\sqrt{3}`); opzione giusta spostata (livelli 2 e 4); due opzioni
uguali; livello 2 senza niente da portare fuori; radicali simili non sommati (`4\sqrt{3} + \sqrt{3}`);
indice riducibile (`\sqrt[6]{49}`); il meno dentro una radice quadrata (`\sqrt{-12}`); domanda del
confronto rovesciata (maggiore al posto di minore); livello 3 senza "le lettere sono positive"; segno
del doppio prodotto cambiato; `values` di un'opzione diverso dal suo LaTeX; testo cambiato (`:` in `+`).

Esercizi diversi su 1.000 (seed 1 / seed 7001): livello 1 542 / 511, livello 2 250 / 239, livello 3
608 / 606, livello 4 532 / 531, livello 5 272 / 274, livello 6 952 / 933, livello 7 770 / 779.

Larghezza (`width.mts`, 150 esercizi per livello): nessuna formula oltre 350 px né opzione oltre
252 px. Le più larghe: problema 271 px (livello 6, quattro termini), opzione 111 px (livello 6).

## Domande per la revisione

- Il livello 4 mescola due domande diverse (trasporto dentro e confronto). Si possono separare in due
  livelli, ma la nota della lezione li mette insieme; li ho tenuti così.
- Con indice dispari e segno meno la risposta giusta è `\sqrt[3]{-24}`, come nel riquadro della
  lezione. `-\sqrt[3]{24}` ha lo stesso valore e non compare mai tra le opzioni, per non avere due
  risposte giuste: va bene così, o si preferisce la forma con il meno fuori?
- Nel confronto c'è a volte un intero (`8`) tra i radicali: è nello spirito della lezione (si porta
  dentro come `\sqrt{64}`), ma la lezione non lo mostra. Da tenere?
