---
stato: bozza
release: dopo la v1.0
aggiornato: 2026-10-07
tag: [contenuti, programma, informatica, università, ricerca]
---
# Programma di Fondamenti di informatica

Proposta di capitoli e lezioni per la versione di ingegneria, ricavata dai programmi ufficiali degli atenei letti il 7 ottobre 2026 da un agente di ricerca, su richiesta di Alessandro. È una proposta da rivedere: niente è ancora nel database. Vedi [[Corsi universitari da aggiungere]] e [[2026-10-05 I corsi universitari non hanno una misura fissa]].

Ricerca del 7 ottobre 2026 sui programmi ufficiali dell'esame di informatica del primo anno di ingegneria, e proposta di capitoli e lezioni per il corso di Sapiens. Niente è stato applicato alla repo né al database. I file scaricati sono in `programmi/raw_inf/` accanto a questo file.

## Esito in breve

- Il corso di oggi (5 lezioni di logica digitale) non corrisponde all'esame. In 30 schede con un programma di programmazione, lette in 10 atenei, le porte logiche e le reti combinatorie e sequenziali non compaiono mai. Compaiono in una sola scheda, "Fondamenti di informatica" di Ingegneria elettronica alla Sapienza, che però è un corso di architettura dei calcolatori con un altro nome.
- L'esame è per due terzi programmazione in un linguaggio e per un terzo "cultura informatica": rappresentazione dell'informazione, architettura del calcolatore, algoritmi.
- Linguaggi: C in 14 schede su 30, Python in 6, Java in 5, C++ in 4 (più 2 insieme al C), MATLAB in 1.
- Proposta: 22 capitoli e 166 lezioni, con un tronco comune indipendente dal linguaggio, una parte di programmazione scritta una volta con esempi in C e in Python, e capitoli specifici per C, C++ e Python.

## Fonti lette

Tutte lette il 7 ottobre 2026. "Scheda" vuol dire la pagina ufficiale dell'insegnamento con il campo dei contenuti o del programma.

### Politecnico di Milano (Manifesto degli studi, A.A. 2026/27)

Di ogni scheda è stato letto il "Programma sintetico". Il "Programma dettagliato" dei singoli docenti non era ancora pubblicato (colonna vuota).

| Esame | Corso di laurea | CFU | Linguaggio | URL |
|---|---|---|---|---|
| Fondamenti di informatica (082746) | Ingegneria informatica | 10 | C | `onlineservices.polimi.it/manifesti/manifesti/controller/ManifestoPublic.do?EVN_DETTAGLIO_RIGA_MANIFESTO=evento&aa=2026&k_cf=225&k_corso_la=531&k_indir=IT1&codDescr=082746&lang=IT&semestre=1&anno_corso=1&idItemOfferta=181355&idRiga=344050` |
| Fondamenti di informatica (082746) | Ingegneria biomedica | 10 | C | stesso indirizzo con `k_corso_la=516&k_indir=BIO&semestre=2&idItemOfferta=182205&idRiga=346651` (programma identico a quello di Ingegneria informatica) |
| Informatica A (091103) | Ingegneria gestionale | 10 | C | `k_corso_la=530&k_indir=PND&codDescr=091103&idItemOfferta=182328&idRiga=346837` |
| Informatica B (081369) | Ingegneria meccanica | 7 | C, più uno strumento per il calcolo numerico non nominato | `k_corso_la=534&k_indir=MEC&codDescr=081369&idItemOfferta=181370&idRiga=344074` |
| Informatica (per aerospaziali) (083407) | Ingegneria aerospaziale | 6 | C | `k_corso_la=514&k_indir=AER&codDescr=083407&idItemOfferta=182673&idRiga=347676` |
| Informatica A (061202) | Ingegneria matematica | 10 | C, poi C++ | `k_corso_la=532&k_indir=MTM&codDescr=061202&idItemOfferta=182538&idRiga=347326` |

### Politecnico di Torino (Portale della didattica, A.A. 2025/26)

| Esame | Corso di laurea | CFU | Linguaggio | URL |
|---|---|---|---|---|
| Informatica (14BHD) | Una sola scheda per tutte le lauree in ingegneria (informatica, meccanica, gestionale, civile, biomedica, aerospaziale, elettronica e le altre) | 8 | Python | `didattica.polito.it/pls/portal30/gap.pkg_guide.viewGap?p_cod_ins=14BHDOA&p_a_acc=2026&p_header=S&p_lang=IT` |

La scheda `14BHDLM` (Ingegneria informatica) rimanda allo stesso insegnamento; i suoi campi di testo erano vuoti.

### Bologna (unibo.it, schede insegnamento)

| Esame | Corso di laurea | A.A. | CFU | Linguaggio | URL |
|---|---|---|---|---|---|
| Fondamenti di informatica T (93034) | Ingegneria informatica | 2026/27 | 12 | C | `unibo.it/it/studiare/insegnamenti-competenze-trasversali-moocs/insegnamenti/insegnamento/2026/543007` |
| Fondamenti di informatica T-1 (28004) | Ingegneria gestionale | 2026/27 | 9 | Java | `.../insegnamento/2026/536944` |
| Fondamenti di informatica (09730) e Fondamenti di informatica A (15305) | Ingegneria biomedica e Ingegneria elettronica, Cesena | 2026/27 | 6 | C | `.../insegnamento/2026/531744` e `.../insegnamento/2026/518106` (stesso programma, contato una volta) |
| Fondamenti di informatica e laboratorio T-AB (28623) | Ingegneria elettronica e telecomunicazioni | 2025/26 | 12 | C | `.../insegnamento/2025/530782` |

Ingegneria civile a Bologna non ha un esame di informatica nel piano 2026/27. Ingegneria meccanica: pagina del piano non raggiunta.

### Padova (Course Catalogue Cineca)

| Esame | Corso di laurea | A.A. | CFU | Linguaggio | URL |
|---|---|---|---|---|---|
| Fondamenti di informatica | Ingegneria informatica (stesso insegnamento per Ingegneria elettronica) | 2025/26 | 12 | Java | `unipd.coursecatalogue.cineca.it/api/v1/insegnamento?anno=2025&insegnamento=51489_469745_66600&ordinamento_aa=2025&corso_cod=12162&af_percorso=51489&corso_aa=2025` |
| Fondamenti di informatica | Ingegneria gestionale | 2025/26 | 9 | Java | `...insegnamento=52478_481611_32354&corso_cod=12377&af_percorso=52478...` |
| Elementi di informatica e programmazione | Ingegneria biomedica (secondo anno) | 2026/27, coorte 2025 | 9 | Python | `...anno=2026&insegnamento=51876_550254_58509&corso_cod=12568&af_percorso=51876...` |

Ingegneria meccanica a Padova non ha un esame di informatica tra gli obbligatori del piano.

### Pisa (Course Catalogue Cineca)

| Esame | Corso di laurea | A.A. | CFU | Linguaggio | URL |
|---|---|---|---|---|---|
| Fondamenti di programmazione | Ingegneria informatica | 2025/26 | 9 | C, poi C++ | `unipi.coursecatalogue.cineca.it/api/v1/insegnamento?anno=2025&insegnamento=53381_702881_75845&ordinamento_aa=2025&corso_cod=11525&af_percorso=53381&corso_aa=2025` |
| Fondamenti di informatica | Ingegneria biomedica | 2025/26 | 6 | C++ | `...insegnamento=53043_702815_72141&corso_cod=11528&af_percorso=53045...` |
| Fondamenti di informatica | Ingegneria gestionale (secondo anno) | 2026/27, coorte 2025 | 6 | Java | `...anno=2026&insegnamento=53233_705596_77767&corso_cod=11533&af_percorso=53233...` |

"Fondamenti di informatica e calcolatori" (12 CFU, Ingegneria elettronica): la scheda esiste ma non ha testi. La scheda di Ingegneria informatica ha un programma di tre righe: il dettaglio è da verificare su `esami.unipi.it`.

### Sapienza (corsidilaurea.uniroma1.it, A.A. 2026/27)

Il catalogo avverte che i contenuti 2026/27 sono "in corso di aggiornamento".

| Esame | Corso di laurea | CFU | Linguaggio | URL |
|---|---|---|---|---|
| Introduzione alla programmazione, canale 1 | Ingegneria informatica e automatica | 9 | Python | `corsidilaurea.uniroma1.it/it/course/33501/attendance/lesson/e1c7939d-92e9-4713-b6d3-bc31f0d8225c/1/1/62977ef3-a2cc-4d64-8524-13f4e0e57225?channel=0` |
| Complementi di programmazione, canale 1 (secondo semestre) | Ingegneria informatica e automatica | 9 | C e C++ | `.../33501/attendance/lesson/e1c7939d-92e9-4713-b6d3-bc31f0d8225c/1/2/2ef0b775-513f-4d6a-ae43-2485e1e6bf4d?channel=0` (letti solo gli obiettivi: il campo del programma era vuoto) |
| Fondamenti di informatica, canale 1 | Ingegneria gestionale | 9 | Python | `.../33500/attendance/lesson/59ad3e56-35f4-490c-84a5-ec1742aca3bb/1/2/8876e476-b504-4780-bba1-6e418bb4f16d?channel=0` |
| Fondamenti di informatica | Ingegneria elettronica | 6 | nessuno: è un corso di architettura (aritmetica binaria, algebra di Boole, circuiti logici, processori, assembly), e chiede il C come prerequisito | `.../33499/attendance/lesson/ef15b36b-943e-4643-add4-8093f9f7852c/1/2/0e43d191-29a4-43bc-9593-e1177c1b216d/781a78df-72a1-482d-9305-abe1f47567d7?channel=0` |

Nei piani di Ingegneria meccanica, clinica e civile salvati il 6 ottobre non compare alcun esame con "informatica" nel nome: da verificare.

### Napoli Federico II

| Esame | Corso di laurea | A.A. | CFU | Linguaggio | URL |
|---|---|---|---|---|---|
| Fondamenti di informatica (modulo di Fondamenti di informatica più modulo di Laboratorio di informatica) | Ingegneria informatica (lo stesso insegnamento da 12 CFU è nei piani di Ingegneria elettronica e biomedica) | 2026/27 | 6+6 | C | Guida del corso di laurea, schede degli insegnamenti: `ingegneria-informatica.unina.it/images/files/GuideL-LM/Guida_LT_IngInf_2026-2027_ITA.pdf` |

### Genova (corsi.unige.it)

| Esame | Corso di laurea | A.A. | CFU | Linguaggio | URL |
|---|---|---|---|---|---|
| Fondamenti di informatica (66054) | Ingegneria informatica | 2025/26 | 9 | C++ | `corsi.unige.it/node/239811` |
| Fondamenti di informatica | Ingegneria elettronica e tecnologie dell'informazione | 2026/27 | 6 | C++ | `corsi.unige.it/node/258224` (stesso programma, senza matematica discreta e senza classi) |
| Fondamenti di informatica | Ingegneria gestionale | 2025/26 | 6 | Python | `corsi.unige.it/node/242428` |
| Informatica per l'ingegneria industriale | Ingegneria meccanica | 2025/26 | 6 | Python | `corsi.unige.it/node/242187` |
| Fondamenti di informatica | Ingegneria dell'energia, Savona | 2026/27 | 6 | Java (gli obiettivi parlano di "ANSI C": scheda incoerente, da verificare) | `corsi.unige.it/node/259522` |
| Fondamenti di informatica | Ingegneria meccanica per l'automazione, La Spezia | 2026/27 | 6 | MATLAB | `corsi.unige.it/node/259413` |

### Firenze (Course Catalogue Cineca, A.A. 2025/26)

| Esame | Corso di laurea | CFU | Linguaggio | URL |
|---|---|---|---|---|
| Fondamenti di informatica (modulo dell'esame integrato Fondamenti di informatica/Programmazione, 15 CFU) | Ingegneria informatica | 9 | C | `unifi.coursecatalogue.cineca.it/api/v1/insegnamento?anno=2025&insegnamento=52938_B308-25-25_60333_773402&ordinamento_aa=2025&corso_cod=4278&af_percorso=52938&corso_aa=2025` |
| Fondamenti di informatica | Ingegneria biomedica | 9 | C | `...insegnamento=52973_B388-25-25_21467_772096&corso_cod=4279&af_percorso=52973...` |

### Trento (Course Catalogue Cineca, A.A. 2025/26)

| Esame | Corso di laurea | CFU | Linguaggio | URL |
|---|---|---|---|---|
| Programmazione 1 | Ingegneria informatica, delle comunicazioni ed elettronica | 12 | C | `unitn.coursecatalogue.cineca.it/api/v1/insegnamento?anno=2025&insegnamento=50778_649083_93215&ordinamento_aa=2025&corso_cod=10853&af_percorso=50778&corso_aa=2025` |

### Non raggiunti o senza contenuti

- Napoli, "Elementi di informatica" (6 CFU) di Ingegneria meccanica, gestionale e aerospaziale: le tre schede del Course Catalogue esistono ma hanno i testi vuoti. Linguaggio e programma da verificare sulle guide dei rispettivi corsi di laurea.
- Firenze, "Fondamenti di informatica" (6 CFU) di Ingegneria meccanica e gestionale: l'API ha risposto "Not Found" con tutti i parametri provati.
- Pisa, Ingegneria elettronica: scheda senza testi.
- Bologna, Ingegneria meccanica: piano non raggiunto.
- Università di Torino: non ha lauree in ingegneria (a Torino le ha il Politecnico), quindi non rientra nel confronto.
- Nessun registro delle lezioni è stato letto: i dettagli sotto vengono dai campi "contenuti" e "programma".

## Conteggio dei linguaggi

31 schede con contenuti in 10 atenei. Una (Sapienza, Ingegneria elettronica) non insegna a programmare. Sulle altre 30:

| Linguaggio | Schede | Dove |
|---|---|---|
| C | 14 (2 delle quali proseguono in C++) | PoliMi 6, Bologna 3, Firenze 2, Napoli 1, Trento 1, Pisa 1 |
| Python | 6 | PoliTo 1, Sapienza 2, Genova 2, Padova 1 |
| Java | 5 | Padova 2, Bologna 1, Pisa 1, Genova 1 |
| C++ come linguaggio principale | 4 | Genova 2, Pisa 1, Sapienza 1 (Complementi di programmazione, "C/C++") |
| MATLAB | 1 | Genova (La Spezia) |

Letture del conteggio:

- Per ateneo il linguaggio dominante è il C in cinque (PoliMi, Bologna, Napoli, Firenze, Trento), il Python in due (PoliTo, Sapienza), il C++ o C con C++ in due (Pisa, Genova nelle lauree dell'informazione), Java in uno (Padova).
- Il conteggio è per scheda, non per studenti. La scheda unica del Politecnico di Torino vale per tutte le matricole di ingegneria dell'ateneo, quindi il peso del Python è più alto di 6 su 30. Quanti studenti: da verificare (dati USTAT).
- Dentro lo stesso ateneo il linguaggio cambia con la laurea: a Bologna e a Pisa i gestionali fanno Java e gli altri C o C++; a Genova i gestionali e i meccanici fanno Python e gli informatici C++; a Padova i biomedici fanno Python e gli altri Java.
- C e C++ insieme coprono 18 schede su 30, Python 6, Java 5.

## Tabella argomento per ateneo

Legenda: S = presente nelle schede lette; P = presente solo in alcune schede dell'ateneo; c = solo accennato o citato come "cenni"; un trattino = assente dalle schede lette. Colonne: MI = PoliMi, TO = PoliTo, BO = Bologna, PD = Padova, PI = Pisa, RM = Sapienza, NA = Napoli (solo Ingegneria informatica), GE = Genova, FI = Firenze, TN = Trento.

| Argomento | MI | TO | BO | PD | PI | RM | NA | GE | FI | TN | Atenei |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Rappresentazione dell'informazione, sistemi di numerazione | S | S | S | S | S | S | S | P | S | S | 10 |
| Complemento a due e virgola mobile nominati | S | - | P | - | - | S | S | P | S | - | 6 |
| Algebra di Boole, logica proposizionale | S | c | - | - | - | P | S | - | - | S | 4 |
| Porte logiche, reti combinatorie e sequenziali | - | - | - | - | - | P | - | - | - | - | 1 |
| Architettura del calcolatore, macchina di von Neumann | S | S | S | S | P | S | S | S | S | S | 10 |
| Linguaggio macchina o assembly | - | - | c | P | P | S | - | - | S | - | 5 |
| Sistema operativo | S | c | S | P | P | c | c | S | - | c | 9 |
| Reti di calcolatori, Internet | P | - | P | - | - | c | - | P | - | - | 4 |
| Algoritmi, diagrammi di flusso, pseudocodice | S | S | S | S | S | S | S | S | S | S | 10 |
| Compilazione e interpretazione, sintassi e semantica (BNF) | S | - | S | S | S | - | S | c | S | - | 7 |
| Calcolabilità, macchina di Turing | - | - | S | - | - | - | c | - | - | - | 2 |
| Tipi, variabili, espressioni | S | S | S | S | S | S | S | S | S | S | 10 |
| Strutture di controllo | S | S | S | S | S | S | S | S | S | S | 10 |
| Funzioni e passaggio dei parametri | S | S | S | S | S | S | S | S | S | S | 10 |
| Record di attivazione, pila delle chiamate | S | - | S | - | - | S | - | - | - | - | 3 |
| Ricorsione | S | - | S | P | - | S | - | P | S | S | 7 |
| Array e matrici (in Python: liste) | S | S | S | S | S | S | S | S | S | S | 10 |
| Stringhe | S | S | S | S | S | S | S | S | c | S | 10 |
| Puntatori | S | - | S | - | S | P | S | P | S | S | 8 |
| Memoria dinamica | S | - | S | - | S | P | - | P | S | S | 7 |
| Struct, record | S | - | S | - | S | - | S | P | S | c | 7 |
| File di testo | S | S | S | P | S | S | S | S | - | S | 9 |
| File binari | P | - | P | - | - | - | - | - | - | - | 2 |
| Liste concatenate | S | - | S | P | P | P | S | P | S | S | 9 |
| Pile, code, tipi di dato astratti | P | - | S | P | P | P | S | P | - | S | 8 |
| Alberi binari, alberi binari di ricerca | P | - | - | - | - | P | - | - | P | S | 4 |
| Liste, insiemi e dizionari di Python; tabelle hash | - | S | - | S | - | S | - | P | - | - | 4 |
| Ricerca lineare e binaria | - | - | P | S | P | c | S | - | S | S | 7 |
| Ordinamento | - | - | S | S | P | - | S | - | S | S | 6 |
| Complessità, O-grande | - | - | c | S | - | c | c | - | S | S | 6 |
| Programmi su più file, moduli, librerie | c | - | S | - | P | P | S | P | - | - | 6 |
| Eccezioni | - | S | - | S | - | - | - | - | - | - | 2 |
| Classi e oggetti, ereditarietà | P | - | P | S | S | P | - | P | - | - | 6 |
| Basi di dati | c | - | c | - | - | - | - | - | - | - | 2 |
| Strumenti di produttività o di calcolo numerico (Excel, MATLAB) | P | - | - | - | - | - | - | P | - | - | 2 |
| Matematica discreta (insiemi, relazioni, combinatoria) | - | - | - | - | - | - | - | P | - | - | 1 |

Che cosa dice la tabella:

- Il nucleo presente in tutti e dieci gli atenei: rappresentazione dell'informazione, architettura, algoritmi, tipi e variabili, strutture di controllo, funzioni, array, stringhe. Subito dopo, in nove: file di testo, liste concatenate, sistema operativo (spesso solo accennato).
- Puntatori, memoria dinamica e struct sono in tutti gli atenei dove il linguaggio è C o C++ e mancano dove è Python o Java. Liste, insiemi, dizionari ed eccezioni fanno il percorso opposto. È la differenza che il corso deve gestire.
- Ricerca, ordinamento e complessità sono in sei o sette atenei su dieci. Al Politecnico di Milano e di Torino mancano dal programma sintetico.
- La logica digitale è nel programma di un solo esame su 31, e quell'esame è un corso di architettura.

## Come trattare il linguaggio

Proposta: un corso solo, in tre strati.

1. Tronco comune senza codice (capitoli 1-4). Rappresentazione dell'informazione, algebra di Boole, calcolatore, algoritmi. È uguale ovunque e non dipende dal linguaggio.
2. Programmazione di base scritta una volta, con ogni esempio in C e in Python (capitoli 5-15). Lo studente sceglie il linguaggio del suo esame all'inizio e la lezione mostra quello. I concetti (variabile, ciclo, funzione, array, ricorsione, file, ricerca, ordinamento) sono gli stessi nelle 30 schede; cambia la sintassi. Gli esercizi di programmazione di Sapiens si verificano su ingresso e uscita, quindi lo stesso esercizio con gli stessi casi di prova vale per tutti i linguaggi che l'editor esegue.
3. Capitoli specifici (16-22). Per il C: puntatori, memoria dinamica, liste concatenate, programmi su più file (18 schede su 30 con C o C++). Per il C++: un capitolo breve "dal C al C++". Per Python: collezioni, eccezioni e moduli (6 schede, tra cui la scheda unica del Politecnico di Torino e la Sapienza). In coda un capitolo di programmazione a oggetti, con esempi in Python e in C++, per le schede che la chiedono (sei atenei).

Perché C e Python e non uno solo: il C è il linguaggio più frequente (14 schede, cinque atenei), ma un corso solo in C lascerebbe fuori il Politecnico di Torino, la Sapienza e metà di Genova. Un corso solo in Python lascerebbe fuori puntatori e memoria dinamica, che sono il cuore dell'esame in otto atenei su dieci.

Java (5 schede, tra cui tutta Padova) resta scoperto nel codice: l'editor di Sapiens esegue Python, C, C++ e JavaScript ma non Java. Uno studente di Padova trova nel corso il tronco comune, gli algoritmi e i concetti, non gli esempi nel suo linguaggio. Vedi "Dubbi aperti".

Ogni lezione dei capitoli 5-22 dichiara per quali linguaggi vale. Nell'elenco: senza marca = C e Python; [C] = C e C++; [C++] = solo C++; [Py] = solo Python.

## Capitoli e lezioni

### Parte I. Tronco comune

**1. La rappresentazione dell'informazione**
1. Bit, byte e codifica dell'informazione
2. I sistemi di numerazione posizionali
3. Dal binario al decimale e ritorno
4. Ottale ed esadecimale
5. Addizione e sottrazione in binario
6. Interi senza segno e overflow
7. Modulo e segno, complemento a uno, eccesso
8. Il complemento a due
9. Operazioni in complemento a due: overflow e cambio di segno
10. Numeri frazionari in binario e virgola fissa
11. La virgola mobile e lo standard IEEE 754
12. Errori di arrotondamento: perché 0,1 + 0,2 non fa 0,3
13. La codifica dei caratteri: ASCII e Unicode
14. Immagini e suoni: campionamento e quantizzazione

**2. Logica e algebra di Boole**
1. Proposizioni e connettivi: AND, OR, NOT
2. Tabelle di verità
3. Le proprietà dell'algebra di Boole e i teoremi di De Morgan
4. Semplificare un'espressione logica
5. Dalle espressioni logiche alle porte: uno sguardo ai circuiti (solo cenni; il resto va nel corso di Reti logiche)

**3. Il calcolatore**
1. La macchina di von Neumann
2. La CPU e il ciclo di prelievo, decodifica ed esecuzione
3. La memoria centrale: celle, indirizzi, parole
4. Memorie di massa e gerarchia delle memorie
5. Bus e dispositivi di ingresso e uscita
6. Linguaggio macchina e assembly: un programma su una macchina didattica
7. Il sistema operativo: a che cosa serve
8. Processi e multitasking
9. Il file system: file, cartelle, percorsi
10. Reti di calcolatori e Internet in breve

**4. Algoritmi e linguaggi**
1. Problemi, algoritmi, programmi
2. I diagrammi di flusso
3. Lo pseudocodice
4. Sequenza, selezione, iterazione: la programmazione strutturata (con il teorema di Böhm e Jacopini)
5. Progettare per raffinamenti successivi
6. Tracciare l'esecuzione a mano (la tabella di traccia, che molti esami chiedono)
7. Linguaggi di basso e di alto livello
8. Compilatori e interpreti (la catena editor, compilatore, linker, esecuzione)
9. Sintassi e semantica: le grammatiche BNF
10. Che cosa si può calcolare: la macchina di Turing in breve (Bologna, Napoli)

### Parte II. Programmare (esempi in C e in Python)

**5. Variabili, tipi, espressioni**
1. Il primo programma
2. Variabili e assegnazione
3. I tipi interi
4. I tipi reali
5. I caratteri
6. Il tipo booleano
7. Operatori aritmetici e precedenze
8. Divisione intera e resto
9. Conversioni di tipo
10. Leggere dalla tastiera e scrivere a video (`scanf` e `printf`, `input` e `print`)
11. Costanti e funzioni matematiche di libreria
12. Errori di sintassi, di esecuzione e di logica: come si trovano

**6. La selezione**
1. L'istruzione if
2. if-else e alternative in cascata
3. Operatori di confronto e operatori logici
4. Selezioni annidate
5. La scelta multipla (`switch` in C, `match` e catene di `elif` in Python)

**7. L'iterazione**
1. Il ciclo while
2. Il ciclo for
3. Il ciclo con controllo in coda (do-while)
4. Contatori e accumulatori
5. Cicli con sentinella e controllo dell'ingresso
6. Cicli annidati
7. break e continue
8. Algoritmi numerici con i cicli: MCD, numeri primi, somma delle cifre

**8. Le funzioni**
1. Definire e chiamare una funzione
2. Parametri e valore restituito
3. Variabili locali e globali: le regole di visibilità
4. Il passaggio per valore
5. Il passaggio per riferimento (puntatori come parametri in C, oggetti modificabili in Python)
6. Il record di attivazione e la pila delle chiamate
7. Scomporre un programma in funzioni

**9. Array e matrici**
1. Gli array (in Python: le liste usate come array)
2. Scorrere un array
3. Massimo, minimo, somma e media
4. Inserire ed eliminare un elemento
5. Array come parametri di una funzione
6. Copie e alias: quando due nomi indicano lo stesso array
7. Le matrici
8. Algoritmi sulle matrici: righe, colonne, diagonali, trasposta, prodotto

**10. Le stringhe**
1. Stringhe come sequenze di caratteri (in C: il terminatore)
2. Leggere e scrivere stringhe
3. Le funzioni di libreria sulle stringhe (`string.h`, i metodi di `str`)
4. Algoritmi sulle stringhe: conteggi, inversione, palindromi
5. Da stringa a numero e da numero a stringa
6. Dividere un testo in parole

**11. La ricorsione**
1. Definizioni ricorsive: caso base e passo ricorsivo
2. Fattoriale e Fibonacci
3. Che cosa succede sulla pila delle chiamate
4. Ricorsione su array e stringhe
5. Ricorsione e iterazione a confronto (con la ricorsione in coda, Padova)
6. Le torri di Hanoi

**12. I dati strutturati**
1. Il record: `struct` in C, tuple e dizionari in Python
2. Array di record
3. Record e funzioni
4. Record dentro record

**13. I file**
1. File di testo: aprire, leggere, chiudere
2. Scrivere su un file di testo
3. Leggere un file riga per riga
4. Elaborare dati tabellari da file (il tipo di esercizio più frequente negli scritti in Python)
5. I file binari (PoliMi, Bologna)

**14. Il costo degli algoritmi**
1. Contare le operazioni
2. Caso migliore, caso peggiore, caso medio
3. La notazione O-grande
4. Le classi di costo più comuni: costante, logaritmico, lineare, quadratico, esponenziale

**15. Ricerca e ordinamento**
1. La ricerca lineare
2. La ricerca binaria
3. L'ordinamento per selezione
4. L'ordinamento per inserzione
5. Il bubble sort
6. Fondere due sequenze ordinate
7. Il merge sort
8. Il quick sort
9. Gli ordinamenti a confronto e il limite inferiore dell'ordinamento (Firenze)

### Parte III. Capitoli specifici del linguaggio

**16. I puntatori [C]**
1. Indirizzi e variabili puntatore
2. Gli operatori `&` e `*`
3. Puntatori come parametri: scambiare due variabili
4. Puntatori e array
5. L'aritmetica dei puntatori
6. Puntatori e stringhe
7. Puntatori a struct e operatore freccia
8. Puntatori a puntatori
9. Gli errori tipici: puntatori non inizializzati, puntatori pendenti, `NULL`

**17. La memoria dinamica [C]**
1. Stack e heap
2. `malloc` e `free`
3. Array dinamici
4. Ridimensionare con `realloc`
5. Matrici dinamiche
6. Memory leak e altri errori di gestione della memoria

**18. Liste concatenate e tipi di dato astratti [C]**
1. Nodi e liste concatenate
2. Inserire in testa e scorrere la lista
3. Inserire in coda e in ordine
4. Cercare ed eliminare un nodo
5. Liste e ricorsione
6. Liste doppiamente concatenate (PoliMi, Ingegneria matematica)
7. Che cos'è un tipo di dato astratto
8. La pila
9. La coda
10. Alberi binari e visite (Trento, Firenze, Sapienza)
11. Alberi binari di ricerca: cercare e inserire (Trento, Firenze)

**19. Programmi su più file [C]**
1. `typedef`, `enum` e `union`
2. Il preprocessore: `#include` e `#define`
3. File di intestazione e compilazione separata
4. Costruire una libreria di funzioni

**20. Dal C al C++ [C++]**
1. Ingresso e uscita con `cin` e `cout`
2. I riferimenti e il passaggio per riferimento
3. `new` e `delete`
4. La classe `string`
5. Sovraccarico di funzioni e template di funzione (Genova)
6. I flussi su file (`ifstream`, `ofstream`)

**21. Collezioni, eccezioni e moduli di Python [Py]**
1. Le liste: metodi e slicing
2. Le tuple
3. Gli insiemi
4. I dizionari
5. Strutture annidate: liste di liste, dizionari di liste e di insiemi (PoliTo)
6. Riferimenti, oggetti modificabili e copie
7. Metodi delle stringhe e formattazione dell'uscita
8. Le eccezioni: `try` ed `except`
9. Sollevare un'eccezione e controllare i dati in ingresso
10. Moduli e `import`

**22. Classi e oggetti (esempi in Python e in C++)**
1. Dal record alla classe: attributi e metodi
2. I costruttori
3. Incapsulamento: pubblico e privato
4. Un tipo di dato astratto scritto come classe: la pila
5. Sovraccarico degli operatori (Genova, PoliMi Ingegneria matematica) [C++]
6. L'ereditarietà in breve
7. Il polimorfismo in breve

### Totali

22 capitoli, 166 lezioni.

| Parte | Capitoli | Lezioni |
|---|---|---|
| I. Tronco comune | 1-4 | 39 |
| II. Programmare, in C e in Python | 5-15 | 74 |
| III. Specifici: C | 16-19 | 30 |
| III. Specifici: C++ | 20 | 6 |
| III. Specifici: Python | 21 | 10 |
| III. Classi e oggetti | 22 | 7 |

Nessuno studente le fa tutte. Percorso di chi ha l'esame in C (PoliMi, Bologna, Napoli, Firenze, Trento): parti I e II più i capitoli 16-19, 143 lezioni al massimo. In Python (PoliTo, Sapienza, Genova gestionale e meccanica): parti I e II più il capitolo 21 e le prime lezioni del 22, circa 127. In C++ (Pisa, Genova): come il C più i capitoli 20 e 22, 156.

Confronto con le ore d'aula: un esame da 10 CFU ha circa 100 ore tra lezioni, esercitazioni e laboratorio, cioè circa 50 incontri da due ore. Con due o tre lezioni di Sapiens per incontro si ottengono 100-150 lezioni: il percorso in C da 143 sta in quell'intervallo. È un controllo di plausibilità, non un obiettivo (decisione del 5 ottobre 2026 sulla misura dei corsi).

## Che fine fanno le cinque lezioni di logica digitale

| Lezione di oggi | Proposta |
|---|---|
| Variabili logiche | Resta, riscritta: diventa 2.1 e 2.2 (connettivi e tabelle di verità). L'algebra di Boole è nei programmi di PoliMi, Napoli e Trento. |
| Funzioni logiche | Resta, riscritta: diventa 2.3 e 2.4 (proprietà, De Morgan, semplificazione). |
| Porte logiche | Si riduce a una lezione di cenni, la 2.5. La versione completa va al corso futuro. |
| Reti combinatorie | Esce dal corso. Va a un futuro corso di Reti logiche o di Architettura degli elaboratori. |
| Reti sequenziali | Esce dal corso, come sopra. |

Motivo: su 31 schede, le reti logiche compaiono solo in "Fondamenti di informatica" di Ingegneria elettronica alla Sapienza, che adotta i manuali di architettura di Hamacher e di Tanenbaum. "Architettura degli elaboratori" è già il candidato numero 12 nell'elenco dei corsi da aggiungere (circa 20 piani su 24): le due lezioni tolte sono il primo capitolo di quel corso. Se si preferisce un corso di Reti logiche a sé, sono il suo nucleo insieme alle mappe di Karnaugh e agli automi.

## Estensioni lasciate fuori

| Argomento | Esame a cui appartiene | Dove è comparso nelle schede lette |
|---|---|---|
| Reti combinatorie e sequenziali, mappe di Karnaugh, flip-flop, registri, automi a stati finiti | Reti logiche | Sapienza, Ingegneria elettronica |
| Assembly MIPS o Intel, architetture RISC e CISC, pipeline, cache, microprogrammazione | Architettura degli elaboratori (Calcolatori elettronici) | Sapienza, Ingegneria elettronica; Firenze (assembler MIPS, prima parte del corso) |
| Tabelle hash, heap, alberi bilanciati, grafi e visite, programmazione dinamica, analisi con Ω e Θ e ricorrenze | Algoritmi e strutture dati | Padova (tabelle e hashtable), Sapienza (grafi, in Complementi di programmazione e negli obiettivi di Ingegneria gestionale) |
| Java, interfacce, classi generiche, collezioni, gerarchie di ereditarietà estese, binding dinamico | Programmazione a oggetti | Padova, Bologna gestionale, Pisa gestionale, Genova Savona; PoliMi Ingegneria matematica (C++) |
| Modello relazionale, SQL | Basi di dati | PoliMi Informatica A ("principi di basi di dati"), Bologna gestionale (negli obiettivi) |
| Scheduling, gestione della memoria, concorrenza | Sistemi operativi | solo cenni ovunque |
| Protocolli, TCP/IP, HTML | Reti di calcolatori | PoliMi Informatica A, Bologna T-AB, Genova Savona (cenni) |
| MATLAB e strumenti per il calcolo numerico | Calcolo numerico | PoliMi Informatica B, Genova La Spezia |
| Foglio elettronico e programmi di produttività | nessun esame di Sapiens | PoliMi Informatica A, Genova La Spezia |
| Insiemi, relazioni, strutture algebriche, calcolo combinatorio | Matematica discreta, Algebra | Genova, Ingegneria informatica |
| Espressioni regolari, linguaggi formali | Fondamenti teorici dell'informatica | Sapienza, Introduzione alla programmazione |

Gli alberi binari di ricerca (lezioni 18.10 e 18.11) sono al confine: appartengono ad Algoritmi e strutture dati, ma tre atenei li mettono in questo esame. Sono tenuti, marcati con gli atenei.

## Dubbi aperti e punti da verificare

Scelte da discutere:

- Java. È il linguaggio di 5 schede su 30 e di tutta Padova, ma l'editor non lo esegue. Tre strade: lasciarlo fuori e dirlo nella pagina del corso; aggiungere esempi Java non eseguibili; portare Java nell'editor. Da decidere con la nota "Editor di codice".
- Lezioni con esempi in due linguaggi. La parte II presuppone che una lezione possa mostrare lo stesso esempio in C o in Python secondo la scelta dello studente. Oggi il blocco `codice` non ha questo interruttore: è una decisione di prodotto. L'alternativa è scrivere due volte la parte II (74 lezioni in più), con titoli uguali.
- C++ come linguaggio di ingresso. A Pisa (Ingegneria biomedica) e a Genova il primo linguaggio è il C++ con `cin` e `cout` fin dalla prima lezione. La proposta lo tratta come C più un capitolo di passaggio. Se si vuole servire bene quegli studenti servono esempi in tre linguaggi nella parte II.
- Classi e oggetti. Sono in sei atenei ma a profondità molto diversa: cenni al PoliMi, metà del corso a Padova. Il capitolo 22 copre i cenni. Chi ha l'esame in Java ha bisogno del corso di Programmazione a oggetti.
- Ricerca, ordinamento e complessità stanno nella parte comune anche se mancano dai programmi sintetici del PoliMi e del PoliTo. Sono in sei o sette atenei e quasi sempre negli esercizi d'esame: tenute per la regola dell'unione.
- Il capitolo 3 ha dieci lezioni su architettura, sistema operativo e reti che nei programmi sono spesso una riga. Potrebbe scendere a sei se si considera solo quello che viene chiesto all'esame.
- Le eccezioni del C++ non funzionano nell'editor (limite del compilatore): per questo le eccezioni sono solo nel capitolo di Python.
- Sovrapposizione con l'informatica delle superiori di Sapiens (`docs/lezioni/informatica/albero.md`): sistemi di numerazione, algoritmi e basi di Python ci sono già. Da decidere se le lezioni universitarie le riusano o le riscrivono. Non controllato in questa ricerca.

Da verificare sui dati:

- Napoli, "Elementi di informatica" di Ingegneria meccanica, gestionale e aerospaziale: linguaggio e programma non letti (schede vuote).
- Firenze, Ingegneria meccanica e gestionale: schede non raggiunte.
- Pisa: programma esteso di "Fondamenti di programmazione" e di "Fondamenti di informatica e calcolatori" su `esami.unipi.it`.
- PoliMi: i programmi dettagliati per docente del 2026/27 non erano pubblicati; il programma sintetico non nomina ricerca e ordinamento, che di solito negli scritti ci sono. Da controllare sui temi d'esame.
- PoliMi, Informatica B: quale strumento di calcolo numerico (MATLAB è l'ipotesi, non scritta nella scheda).
- Sapienza: il programma di "Complementi di programmazione" (campo vuoto, letti solo gli obiettivi); se Ingegneria meccanica, clinica e civile hanno davvero un piano senza esame di informatica; i contenuti 2026/27 sono dichiarati provvisori dal catalogo.
- Genova, Ingegneria dell'energia: Java nel programma, "ANSI C" negli obiettivi.
- Bologna, Ingegneria meccanica: piano non letto.
- Peso per studenti iscritti: i conteggi sono per scheda. Con i dati USTAT il Python del Politecnico di Torino peserebbe di più.
- Il rapporto "due o tre lezioni di Sapiens per incontro in aula" è la stima già usata per l'intelligenza artificiale: non è ancora stato misurato su un capitolo pilota.
- Nessun tema d'esame è stato letto. Le marche del tipo "il tipo di esercizio più frequente" vengono dalle modalità d'esame e dagli esempi di domande scritti nelle schede (PoliTo, Sapienza), non da un conteggio.
