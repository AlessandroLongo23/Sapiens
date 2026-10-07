---
stato: bozza
release: dopo la v1.0
aggiornato: 2026-10-07
tag: [contenuti, programma, chimica, università, ricerca]
---
# Programma di Chimica per ingegneria

Proposta di capitoli e lezioni per la versione di ingegneria, ricavata dai programmi ufficiali degli atenei letti il 7 ottobre 2026 da un agente di ricerca, su richiesta di Alessandro. È una proposta da rivedere: niente è ancora nel database. Vedi [[Corsi universitari da aggiungere]] e [[2026-10-05 I corsi universitari non hanno una misura fissa]].


## Fonti lette

Tutte lette il 7 ottobre 2026. "API Cineca" vuol dire la scheda dell'insegnamento restituita da `https://<ateneo>.coursecatalogue.cineca.it/api/v1/insegnamento?...` (campo `contenuti_it` o `programmazione_estesa_it`).

| Sigla | Ateneo | Esame | Corso di laurea | A.A. | CFU | URL |
|---|---|---|---|---|---|---|
| MI | Politecnico di Milano | Fondamenti di chimica (081374) | Ing. meccanica (stessa scheda per aerospaziale ed energetica, a giudicare dal testo) | 2026/27 | 7 | `https://aunicalogin.polimi.it/aunicalogin/getservizio.xml?id_servizio=178&c_classe=890037` |
| MI2 | Politecnico di Milano | Chimica generale (085900) | Ing. informatica, Ing. dell'automazione | 2026/27 | 5 | `https://aunicalogin.polimi.it/aunicalogin/getservizio.xml?id_servizio=178&c_classe=889023` |
| TO | Politecnico di Torino | Chimica (16AHM, comune a tutte le lauree in ingegneria) | Meccanica, gestionale, civile, biomedica, elettronica, aerospaziale e altre | 2025/26 (anno mostrato nella scheda) | 8 | `https://didattica.polito.it/pls/portal30/gap.pkg_guide.viewGap?p_cod_ins=16AHMLZ&p_a_acc=2026` |
| BO | Bologna | Fondamenti di chimica T (29225) | Ing. energetica | 2025/26 | 6 | `https://www.unibo.it/it/studiare/insegnamenti-competenze-trasversali-moocs/insegnamenti/insegnamento/2025/513876` |
| PD | Padova | Elementi di chimica | Ing. meccanica | 2025/26 | 6 | API Cineca unipd, corso 12576, insegnamento `52114_475672_22398` |
| PD2 | Padova | Chimica e chimica applicata | Ing. civile | 2025/26 | 9 | API Cineca unipd, corso 12383, insegnamento `52077_476817_22390` |
| PD3 | Padova | Fondamenti di chimica per la bioingegneria | Ing. biomedica | 2025/26 | 9 | API Cineca unipd, corso 12568, insegnamento `51876_470035_58508` |
| PI | Pisa | Chimica | Ing. aerospaziale | 2025/26 | 6 | API Cineca unipi, corso 11529, insegnamento `53219_705454_76492` |
| PI2 | Pisa | Chimica | Ing. elettronica | 2025/26 | 6 | API Cineca unipi, corso 11526, insegnamento `53054_702906_64673` |
| RM | Sapienza | Chimica (10628906), canali A-K e L-Z | Ing. meccanica | 2026/27 | 9 | `https://corsidilaurea.uniroma1.it/it/course/33479/attendance/lesson/8ba11a17-ead3-4243-b5ba-82a169b7d339/1/2/db7da086-e78a-490e-b58b-8f60f3a7da2d?channel=0` |
| RM2 | Sapienza | Chimica (101144), canali 1 e 2 | Ing. gestionale | 2026/27 | 6 | `https://corsidilaurea.uniroma1.it/it/course/33500/attendance/lesson/59ad3e56-35f4-490c-84a5-ec1742aca3bb/2/1/ece2263a-d27a-4338-a032-2db1df55a9aa?channel=0` |
| RM3 | Sapienza | Chimica, canale unico (solo titoli dei capitoli) | Ing. elettronica | 2026/27 | 6 | `https://corsidilaurea.uniroma1.it/it/course/33499/attendance/lesson/ef15b36b-943e-4643-add4-8093f9f7852c/1/2/90844161-cb7d-45e7-bc65-cc57ee2f8c74?channel=0` |
| NA | Napoli Federico II | Chimica | Ing. aerospaziale | 2023/24 | 6 | `https://aerospaziale.dii.unina.it/images/l/man/2023-24/schede-insegnamenti-l-ia-2023-24.pdf` (pp. 18-20) |
| GE | Genova | Chimica (117762) | Ing. meccanica per l'automazione, sede della Spezia | 2026/27 | 5 | `https://corsi.unige.it/node/259415` |
| FI | Firenze | Chimica | Ing. biomedica | 2025/26 | 9 | API Cineca unifi, corso 4279, insegnamento `52973_B388-25-25_82799_772097` |
| TN | Trento | Chimica | Ing. civile | 2025/26 | 6 | API Cineca unitn, corso 10839, insegnamento `50747_649841_94757` |

Dieci atenei, sedici schede. Per la tabella degli argomenti ogni ateneo ha una colonna, costruita sulla scheda più vicina a meccanica o gestionale; le altre schede dello stesso ateneo sono citate dove aggiungono qualcosa.

### Non raggiunti o raggiunti solo in parte

- Napoli: le schede 2025/26 del Course Catalogue (Ing. meccanica, gestionale, civile) esistono ma hanno il campo dei contenuti vuoto. Letta al loro posto la scheda 2023/24 di Ing. aerospaziale, pubblicata dal corso di laurea. Programma di meccanica e gestionale (9 CFU): da verificare.
- Pisa, Ing. meccanica (insegnamento `53234_705621_64962`) e Ing. biomedica: l'API risponde "Not Found". Lette aerospaziale ed elettronica.
- Firenze, Ing. meccanica, gestionale ed elettronica (Chimica, 6 CFU): "Not Found". Letta solo biomedica, che ha 9 CFU e una parte sui biomateriali.
- Genova, sede di Genova (Ing. meccanica, Ing. gestionale con "Chimica e fisica" da 12 CFU): non lette. Letta la sede della Spezia, stesso docente della scheda di Ing. meccanica 2017/18 (`corsi.unige.it/node/176462`), che ha quasi lo stesso programma.
- Bologna: letta solo Ing. energetica. Che il 29225 sia lo stesso per meccanica e gestionale è da verificare.
- Torino (Università): ha Chimica solo in Fisica e Matematica, fuori dal perimetro. Non letta.
- Registri delle lezioni: nessuno letto. La Sapienza gestionale dà le ore per blocco (nucleo 4, atomo 6, legame 10, formule e redox 6, gas 6, termodinamica 6, stati condensati ed equilibri di fase 6, equilibrio 4, acidi e basi 5).

## Tabella argomento per ateneo

"sì": nel programma. "cenni": nominato come cenno, o coperto solo in parte. "no": non compare nel programma letto (non vuol dire che il docente non lo tratti).

| Argomento | MI | TO | BO | PD | PI | RM | NA | GE | FI | TN |
|---|---|---|---|---|---|---|---|---|---|---|
| Mole, formule, calcoli stechiometrici | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Reagente limitante, resa | cenni | sì | cenni | cenni | sì | sì | cenni | cenni | no | sì |
| Nomenclatura inorganica, numero di ossidazione | no | sì | sì | sì | sì | sì | sì | sì | no | sì |
| Bilanciamento delle redox | cenni | sì | sì | cenni | sì | sì | sì | cenni | cenni | sì |
| Nucleo, radioattività, difetto di massa | no | cenni | sì | sì | sì | sì (RM2) | no | sì | sì | sì |
| Modello quantistico, orbitali, configurazioni | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Proprietà periodiche | sì | sì | sì | sì | sì | sì | cenni | sì | sì | sì |
| Legame ionico, energia reticolare, Born-Haber | cenni | cenni | sì | sì | sì | sì (RM2) | cenni | no | cenni | sì |
| Lewis, geometria molecolare (VSEPR), polarità | sì | sì | sì | sì | sì | sì | sì | cenni | sì | sì |
| Legame di valenza e ibridazione | cenni | sì | sì | sì | sì | sì | cenni | sì | cenni | sì |
| Orbitali molecolari | no | cenni | sì | sì | cenni (PI2) | cenni (RM2) | no | sì | no | no |
| Legame metallico, bande, semiconduttori | sì | cenni | sì | sì | sì (PI2) | sì | sì | sì | cenni | no |
| Forze intermolecolari | sì | sì | sì | sì | sì | sì | sì | cenni | sì | sì |
| Gas ideali, miscele, Dalton | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Teoria cinetica, distribuzione delle velocità | no | sì | no | no | sì | sì | sì | no | cenni | no |
| Gas reali, van der Waals, stato critico | sì | sì | no | cenni | sì | sì | sì | sì | no | sì |
| Solidi cristallini, reticoli, celle elementari | sì | sì | sì | cenni | cenni | sì | cenni | sì | sì | sì |
| Tensione di vapore, diagrammi di stato a un componente | sì | sì | cenni | cenni | sì | sì | sì | cenni | sì | sì |
| Soluzioni, concentrazioni, Raoult, proprietà colligative | cenni | sì | no | no | sì | sì | cenni | cenni | sì | sì |
| Diagrammi di stato binari (liquido-vapore, eutettici) | no | no | no | sì (PD2) | no | sì | no | cenni | no | cenni |
| Termochimica: entalpia, Hess | sì | sì | sì | sì | sì | sì | cenni | cenni | sì | sì |
| Entropia, energia libera, spontaneità | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Equilibrio chimico, K, Le Chatelier, van't Hoff | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Cinetica, Arrhenius, catalisi | sì | sì | sì | sì | cenni | sì (RM2) | sì | sì | sì | no |
| Acidi e basi, pH di forti e deboli | sì | sì | sì | sì | sì | sì | sì | sì | sì | sì |
| Idrolisi dei sali | cenni | sì | sì | sì | sì | sì | cenni | sì | no | sì |
| Soluzioni tampone | no | no | no | sì (PD3) | sì | no | no | cenni | no | sì |
| Solubilità e prodotto di solubilità | cenni | no | no | no | sì | sì | sì | sì | sì | sì |
| Pile, potenziali standard, Nernst | sì | sì | sì | sì | sì | sì | sì | no | sì | sì |
| Elettrolisi, leggi di Faraday | sì | sì | sì | sì | sì | no | sì | no | sì | no |
| Pile commerciali, accumulatori, idrogeno | no | no | cenni | sì | no | no | no | cenni | no | no |
| Corrosione e protezione dei metalli | sì | no | no | cenni | no | no | no | no | no | no |
| Chimica organica (gruppi funzionali) | no | sì | no | cenni (PD2), sì (PD3) | no | no | cenni | sì | sì | no |
| Polimeri | no | no | no | sì (PD2) | no | no | no | sì | sì | no |
| Materiali (metalli, ceramici, leganti, biomateriali) | no | no | no | sì (PD2) | no | no | no | cenni | sì | no |
| Chimica, energia e ambiente | sì | cenni | cenni | no | no | no | no | sì | no | no |

Note alla tabella:
- RM2 (gestionale, 6 CFU) si ferma agli equilibri ionici: niente elettrochimica. RM (meccanica, 9 CFU) ha l'elettrochimica senza l'elettrolisi e la cinetica solo per cenni.
- MI2 (informatica, 5 CFU) è MI senza cinetica e senza il capitolo sull'ambiente.
- A Genova il programma 2026/27 non nomina l'elettrochimica; la scheda 2017/18 dello stesso docente la metteva tra i quesiti d'esame. Da verificare.
- In nessuna scheda letta compaiono per nome le titolazioni e gli acidi poliprotici (Trento scrive "acidi e basi monoprotiche").

## Nome consigliato

"Chimica". È il nome dell'esame in 7 atenei su 10 (Torino, Pisa, Sapienza, Napoli, Genova, Firenze, Trento). Le alternative lette: "Fondamenti di chimica" (Milano, Bologna), "Elementi di chimica" (Padova), "Chimica generale" (Milano, informatica). Nella materia di Sapiens va distinto dalla chimica delle superiori con il livello, non con il nome.

## Capitoli e lezioni

L'ordine segue quello più comune nelle schede (Torino, Padova, Sapienza): atomo, legame, reazioni, stati della materia, termodinamica, equilibrio, cinetica, soluzioni acquose, elettrochimica.

### 1. Atomi, nuclei e mole
1. Atomi, isotopi e massa atomica. Numero atomico, numero di massa, massa atomica media di un elemento.
2. La mole e la massa molare
3. Formula minima e formula molecolare. Dalla composizione percentuale alla formula.
4. Difetto di massa ed energia di legame nucleare. Energia per nucleone, fissione e fusione.
5. Radioattività. Decadimenti alfa, beta e gamma, legge del decadimento, tempo di dimezzamento.

### 2. Struttura elettronica dell'atomo
6. Quanti di luce ed effetto fotoelettrico
7. Spettri atomici e modello di Bohr
8. Onde di materia e principio di indeterminazione
9. Equazione di Schrödinger e numeri quantici. Solo il significato: funzione d'onda, densità di probabilità, n, l, m, spin.
10. Forma ed energia degli orbitali
11. Configurazioni elettroniche. Pauli, Hund, ordine di riempimento, carica nucleare efficace.
12. Tavola periodica e raggi atomici. Gruppi, periodi, blocchi; raggi atomici e ionici.
13. Energia di ionizzazione, affinità elettronica ed elettronegatività. Con il carattere metallico.

### 3. Legame chimico
14. Legame ionico ed energia reticolare
15. Ciclo di Born-Haber
16. Legame covalente e strutture di Lewis. Energia e lunghezza di legame, legami multipli, legame dativo, eccezioni all'ottetto.
17. Carica formale e risonanza. Con gli elettroni delocalizzati del benzene.
18. Geometria molecolare con la teoria VSEPR
19. Polarità dei legami e momento dipolare
20. Legame di valenza: legami sigma e pi greco
21. Orbitali ibridi sp, sp² e sp³
22. Orbitali molecolari delle molecole biatomiche. Ordine di legame, paramagnetismo dell'ossigeno.
23. Legame metallico e teoria delle bande
24. Conduttori, semiconduttori e isolanti. Drogaggio di tipo n e p, cenno alla giunzione.
25. Forze intermolecolari. Dipolo-dipolo, forze di London, legame a idrogeno; effetto sui punti di ebollizione.

### 4. Nomenclatura, reazioni e stechiometria
26. Numero di ossidazione
27. Nomenclatura dei composti binari. Ossidi, idruri, idracidi, sali binari.
28. Nomenclatura di idrossidi, ossoacidi e sali
29. Equazioni chimiche e bilanciamento
30. Calcoli stechiometrici
31. Reagente limitante e resa
32. Concentrazione delle soluzioni. Molarità, molalità, frazione molare, percentuali; diluizioni.
33. Reazioni in soluzione ed equazioni ioniche. Acido-base, precipitazione, scambio.
34. Bilanciamento delle redox con le semireazioni. Ambiente acido e basico, dismutazioni.

### 5. Gas
35. Equazione di stato dei gas ideali
36. Densità e massa molare dei gas. Con la stechiometria delle reazioni in fase gassosa.
37. Miscele di gas e legge di Dalton. Pressioni parziali, frazioni molari, massa molare media.
38. Teoria cinetica e distribuzione delle velocità. Maxwell-Boltzmann, velocità quadratica media, legge di Graham.
39. Gas reali ed equazione di van der Waals. Con temperatura critica e liquefazione.

### 6. Liquidi, solidi e passaggi di stato
40. Tensione di vapore ed ebollizione. Dipendenza dalla temperatura (Clausius-Clapeyron).
41. Diagrammi di stato dell'acqua e dell'anidride carbonica. Punto triplo, punto critico, regola delle fasi.
42. Solidi cristallini e amorfi. Solidi ionici, covalenti, molecolari e metallici e le loro proprietà.
43. Reticoli e celle elementari. Cubica semplice, a corpo centrato, a facce centrate; densità e impacchettamento.
44. Strutture dei solidi ionici e covalenti. Cloruro di sodio, cloruro di cesio; diamante e grafite.

### 7. Soluzioni
45. Dissoluzione e solubilità. Effetto della temperatura, gas nei liquidi e legge di Henry.
46. Legge di Raoult e soluzioni ideali. Con le deviazioni positive e negative.
47. Abbassamento crioscopico e innalzamento ebullioscopico
48. Pressione osmotica
49. Elettroliti e coefficiente di van't Hoff. Grado di dissociazione, proprietà colligative degli elettroliti.
50. Equilibrio liquido-vapore delle miscele binarie. Diagrammi pressione-composizione e temperatura-composizione, distillazione.
51. Diagrammi eutettici. Curve di raffreddamento, lettura del diagramma, regola della leva.

### 8. Termochimica
52. Sistema, funzioni di stato e primo principio
53. Entalpia e calore di reazione. Calore a volume e a pressione costante, calorimetria.
54. Entalpie standard di formazione
55. Legge di Hess
56. Entalpia di reazione dalle energie di legame
57. Combustione e potere calorifico. Bilancio termico di una combustione.

### 9. Entropia ed energia libera
58. Processi spontanei ed entropia. Secondo principio.
59. Entropia standard e terzo principio. Variazione di entropia di una reazione.
60. Energia libera di Gibbs e spontaneità
61. Effetto della temperatura sulla spontaneità. I quattro casi dei segni di ΔH e ΔS, temperatura di inversione.
62. Energia libera e costante di equilibrio. ΔG = ΔG° + RT ln Q.

### 10. Equilibrio chimico
63. Legge di azione di massa e costante di equilibrio
64. Kp, Kc e le altre forme della costante
65. Quoziente di reazione e verso della reazione
66. Calcolo della composizione all'equilibrio
67. Grado di dissociazione nelle reazioni gassose
68. Equilibri eterogenei
69. Principio di Le Chatelier. Concentrazione, pressione, volume, gas inerte, catalizzatore.
70. Temperatura ed equazione di van't Hoff

### 11. Cinetica chimica
71. Velocità di reazione e legge cinetica
72. Ordine di reazione e metodo delle velocità iniziali
73. Leggi cinetiche integrate e tempo di dimezzamento
74. Teoria degli urti ed energia di attivazione. Con lo stato di transizione.
75. Equazione di Arrhenius
76. Meccanismi di reazione e stadio lento
77. Catalisi. Omogenea ed eterogenea; controllo termodinamico e cinetico nella sintesi dell'ammoniaca.

### 12. Acidi e basi
78. Acidi e basi secondo Arrhenius, Brønsted e Lewis. Coppie coniugate.
79. Autoprotolisi dell'acqua e pH
80. pH di acidi e basi forti
81. Forza di acidi e basi: Ka e Kb. Relazione con la struttura, effetto livellante dell'acqua.
82. pH di acidi e basi deboli
83. Idrolisi dei sali
84. Neutralizzazione e pH delle miscele. Acido forte con base forte, acido debole con base forte.
85. Soluzioni tampone

### 13. Equilibri di solubilità
86. Prodotto di solubilità
87. Effetto dello ione comune e del pH sulla solubilità
88. Condizioni di precipitazione. Confronto tra Q e Kps.

### 14. Elettrochimica
89. Celle galvaniche e pila Daniell. Semielementi, ponte salino, notazione della pila.
90. Potenziali standard di riduzione. Elettrodo standard a idrogeno, tipi di elettrodi.
91. Serie elettrochimica e spontaneità delle redox. Metalli con acidi ossidanti e non.
92. Forza elettromotrice, energia libera e costante di equilibrio
93. Equazione di Nernst
94. Pile a concentrazione
95. Pile commerciali, accumulatori e celle a combustibile. Piombo, litio, idrogeno.
96. Elettrolisi dei sali fusi e delle soluzioni acquose. Potenziale di decomposizione, sovratensione, ordine di scarica.
97. Leggi di Faraday
98. Processi elettrolitici industriali. Raffinazione del rame, alluminio, cloro-soda, elettrolisi dell'acqua.

### 15. Corrosione e protezione dei metalli
99. Meccanismo elettrochimico della corrosione. Corrosione a umido del ferro, coppie galvaniche, aerazione differenziale, passivazione.
100. Protezione dalla corrosione. Rivestimenti, zincatura, anodi sacrificali, protezione catodica.

### 16. Chimica organica e polimeri
101. Alcani e isomeria di struttura. Con la nomenclatura di base.
102. Alcheni, alchini e composti aromatici
103. Alcoli, eteri e ammine
104. Aldeidi, chetoni, acidi carbossilici e derivati. Esteri e ammidi.
105. Polimerizzazione per addizione e per condensazione
106. Struttura e proprietà dei polimeri. Termoplastici, termoindurenti, elastomeri; cristallinità, transizione vetrosa.

### 17. Chimica, energia e ambiente
107. Atmosfera e inquinanti. Smog fotochimico, piogge acide, ozono stratosferico, effetto serra.
108. Combustibili, idrogeno e fonti di energia

Totale: 17 capitoli, 108 lezioni.

## Estensioni lasciate fuori

- Titolazioni acido-base e indicatori; acidi poliprotici. In nessuna scheda letta. Sono capitoli fissi dei manuali e delle lauree in Chimica; il primo candidato a rientrare se Andrea li vede negli scritti d'esame.
- Composti di coordinazione, chimica inorganica descrittiva dei gruppi. Solo un cenno a Torino ("generalità sui gruppi principali e su alcuni metalli di transizione"). Tipici di "Chimica generale e inorganica" delle lauree in Chimica.
- Conduttività delle soluzioni elettrolitiche, potenziale chimico, coefficiente di ripartizione, lacuna di miscibilità, diagrammi peritettici. Solo Sapienza meccanica.
- Costante di Madelung, curva di Morse. Solo Sapienza gestionale; la curva di Morse può stare come figura nella lezione 16.
- Spettrometria di massa (Pisa elettronica); effetto Joule-Thomson e umidità relativa (Pisa aerospaziale).
- Cristalli liquidi, proprietà elettriche, magnetiche e meccaniche dei materiali, polimeri conduttori. Solo Genova.
- Stereoisomeria (chiralità, R/S), biomolecole. Solo Padova biomedica; a Milano la biomedica ha un esame a parte ("Fondamenti di chimica e chimica organica"). Starebbero in un corso per la bioingegneria.
- Materiali da costruzione: diagramma ferro-carbonio, acciai, ghise, ceramici, vetro, leganti, cemento Portland, calcestruzzo (Padova civile). Biomateriali, biocompatibilità, sterilizzazione (Firenze biomedica). Appartengono a "Scienza e tecnologia dei materiali", già in elenco al numero 20 di `vault/Contenuti/Corsi universitari da aggiungere.md`.
- Laboratorio. Nessuna scheda di ingegneria lo prevede.

## Dubbi aperti e punti da verificare

- 108 lezioni sono più della stima di 50-90 per un esame da 6-9 CFU. Dipende dall'unione: nessun ateneo chiede tutti i 17 capitoli. Uno studente di Sapienza gestionale ne usa circa 80 (capitoli 1-12 meno qualche lezione), uno di Milano meccanica circa 85: stime a occhio dalla tabella, non conteggi. Da decidere se segnare nel corso i capitoli "non in tutti gli atenei" (15, 16, 17 e le lezioni 50-51).
- Capitolo 16 (organica e polimeri): presente a Torino, Genova, Firenze biomedica, Padova civile e biomedica, per cenni a Napoli; assente a Milano meccanica, Bologna, Pisa, Sapienza, Trento. Tenuto nel corso perché Torino lo chiede a tutte le lauree in ingegneria. I polimeri (105-106) hanno una base più debole: Genova e le due schede "applicate".
- Capitolo 17 (ambiente ed energia): Milano meccanica e Genova, cenni a Bologna e Torino. È descrittivo, con pochi esercizi generabili. Si può ridurre a letture o togliere.
- Lezioni 50-51 (diagrammi binari ed eutettici): Sapienza meccanica, Padova civile, quesito d'esame a Genova nel 2017/18. Altrove stanno in Scienza dei materiali o Metallurgia. Se quel corso si fa, la 51 si sposta lì.
- Capitolo 15 (corrosione): per nome solo a Milano e Padova. Tenuto perché Milano è l'ateneo con più iscritti e lo mette tra gli obiettivi dell'esame.
- Soluzioni tampone: esplicite solo a Pisa aerospaziale, Trento e Padova biomedica. Tenute perché sono esercizio classico dei manuali adottati (Silvestroni, Brown, Atkins); se compaiono negli scritti di Milano, Torino e Sapienza è da verificare sui temi d'esame.
- Orbitali molecolari: trattazione piena solo a Bologna, Padova e Genova, cenni a Torino, Pisa e Sapienza. Una lezione sola.
- Profondità della parte quantistica (lezioni 6-9): le schede vanno da "cenni alla teoria dei quanti" (Bologna) a "equazione di Schrödinger" (Sapienza, Genova). Proposta: livello qualitativo, senza risolvere l'equazione. Da confermare con Andrea.
- Convenzioni da chiedere ad Andrea e da portare in `vault/Contenuti/Domande per Andrea.md` quando il corso parte: nomenclatura tradizionale, IUPAC o entrambe; "tensione di vapore" o "pressione di vapore"; potenziali di riduzione con la convenzione IUPAC; Kps o Ks; redox bilanciate con il metodo ionico-elettronico o anche con la variazione del numero di ossidazione.
- Da verificare sulle fonti: programma di Napoli 2025/26 per meccanica e gestionale; Pisa e Firenze meccanica; Genova sede principale; Bologna meccanica e gestionale; se a Genova l'elettrochimica è ancora in programma; l'anno accademico della scheda di Torino (la pagina richiesta con `p_a_acc=2026` mostra "A.A. 2025/26").
- Nessun tema d'esame è stato letto: la tabella dice che cosa c'è nei programmi, non quanto pesa allo scritto.
