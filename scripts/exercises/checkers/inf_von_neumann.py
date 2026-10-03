"""Checker for inf-von-neumann (specs/exercises/inf-von-neumann.md).

Written from the spec and the lesson. Every problem is read back from its text and the answer is rebuilt from
the pieces, with the tables of the spec typed again here:
- level 1: the component named in the question is looked up in the table of components and blocks;
- level 2: the situation and the task are recognised, and the task gives the block;
- level 3: the question is one of the eight of the spec, and gives the trip;
- level 4: every option is a statement of the spec, true or false; the question says which one is asked;
- level 5: the step described is found among the six of the situation, and the answer is the next or the previous.
"""
import re

from checkers._inf_architettura import check_text_choice, common, option_text, prep, prose_and_extra

BLOCKS = ["CPU", "Memoria centrale", "Periferiche", "Bus"]

CASE_RANGES = {
    1: {b: (0.19, 0.31) for b in BLOCKS},
    2: {b: (0.19, 0.31) for b in BLOCKS},
    3: {f"viaggio-{k}": (0.19, 0.31) for k in (1, 2, 3, 4)},
    4: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    5: {"dopo": (0.40, 0.60), "prima": (0.40, 0.60)},
}

DEVICES = ["un telefono", "un tablet", "un portatile", "un computer fisso", "una console per videogiochi", "uno smartwatch"]

COMPONENTS = {
    "il processore": "CPU",
    "il microprocessore": "CPU",
    "il chip che esegue le istruzioni dei programmi": "CPU",
    "la RAM": "Memoria centrale",
    "la memoria in cui stanno i programmi aperti in questo momento": "Memoria centrale",
    "i collegamenti che portano i dati dal microfono alla RAM": "Bus",
    "il touchpad": "Periferiche",
    "il monitor": "Periferiche",
    "lo scanner": "Periferiche",
    "il proiettore": "Periferiche",
    "il ricevitore GPS": "Periferiche",
    "la tavoletta grafica": "Periferiche",
    "la memoria RAM": "Memoria centrale",
    "le piste di metallo che collegano il processore alla RAM": "Bus",
    "i collegamenti su cui i dati viaggiano tra il processore e la RAM": "Bus",
    "i collegamenti che portano i dati dalla RAM allo schermo": "Bus",
    "la tastiera": "Periferiche",
    "il mouse": "Periferiche",
    "lo schermo": "Periferiche",
    "il microfono": "Periferiche",
    "l'altoparlante": "Periferiche",
    "la fotocamera": "Periferiche",
    "la webcam": "Periferiche",
    "la stampante": "Periferiche",
    "il controller": "Periferiche",
    "le cuffie": "Periferiche",
    "il sensore di impronte": "Periferiche",
    # mass memories: among the peripherals in the lesson's scheme
    "il disco": "Periferiche",
    "la chiavetta USB": "Periferiche",
    "la memoria interna in cui restano le foto": "Periferiche",
}

# use, app, dato, calc (third person), calc (infinitive), in, inDev, out, outDev
SCENARIOS = [
    ("Giochi a un videogioco su una console", "del videogioco", "il punteggio della partita", "somma i punti appena fatti al punteggio", "sommare i punti appena fatti al punteggio", "il tasto premuto", "il controller", "l'immagine della partita", "lo schermo"),
    ("Usi la calcolatrice del telefono", "della calcolatrice", "il numero appena digitato", "moltiplica i due numeri digitati", "moltiplicare i due numeri digitati", "le cifre toccate", "lo schermo tattile", "il risultato", "lo schermo"),
    ("Apri il registro elettronico sul portatile", "del registro elettronico", "l'elenco dei voti", "calcola la media dei voti", "calcolare la media dei voti", "la password digitata", "la tastiera", "la pagina dei voti", "lo schermo"),
    ("Ascolti una canzone sul telefono", "del lettore musicale", "il brano in riproduzione", "trasforma i bit del brano nei valori del suono", "trasformare i bit del brano nei valori del suono", "il tocco sul tasto di pausa", "lo schermo tattile", "il suono della canzone", "gli auricolari"),
    ("Scrivi un tema con un programma di videoscrittura", "del programma di videoscrittura", "il testo del tema", "conta le parole del testo", "contare le parole del testo", "le lettere digitate", "la tastiera", "la pagina del tema", "la stampante"),
    ("Scatti una foto con il telefono", "dell'app della fotocamera", "i pixel della foto", "schiarisce i pixel della foto", "schiarire i pixel della foto", "l'immagine inquadrata", "la fotocamera", "la foto", "lo schermo"),
    ("Registri un messaggio vocale con il telefono", "dell'app dei messaggi", "il suono registrato", "comprime il suono registrato", "comprimere il suono registrato", "la tua voce", "il microfono", "il messaggio da riascoltare", "l'altoparlante"),
    ("Segui il navigatore sul telefono", "del navigatore", "la posizione attuale", "calcola la distanza dalla destinazione", "calcolare la distanza dalla destinazione", "il segnale dei satelliti", "il ricevitore GPS", "la mappa con il percorso", "lo schermo"),
    ("Usi un foglio di calcolo sul computer fisso", "del foglio di calcolo", "i numeri della tabella", "somma i numeri di una colonna", "sommare i numeri di una colonna", "i numeri digitati", "la tastiera", "il grafico", "il monitor"),
    ("Disegni con un programma di grafica sul computer fisso", "del programma di grafica", "il disegno in lavorazione", "calcola il colore di ogni pixel del disegno", "calcolare il colore di ogni pixel del disegno", "i movimenti della mano", "il mouse", "il disegno", "il monitor"),
    ("Usi un traduttore sul telefono", "del traduttore", "la frase da tradurre", "cerca nel dizionario le parole della frase", "cercare nel dizionario le parole della frase", "la frase dettata", "il microfono", "la traduzione", "lo schermo"),
    ("Imposti la sveglia sul telefono", "della sveglia", "l'ora della sveglia", "confronta l'ora attuale con l'ora della sveglia", "confrontare l'ora attuale con l'ora della sveglia", "l'ora scelta", "lo schermo tattile", "la suoneria", "l'altoparlante"),
    ("Cammini con un orologio contapassi al polso", "del contapassi", "il numero dei passi", "aggiunge un passo al conteggio", "aggiungere un passo al conteggio", "il movimento del polso", "il sensore di movimento", "il totale dei passi di oggi", "lo schermo dell'orologio"),
]
KEYS = ["use", "app", "dato", "calc", "calc_inf", "in", "in_dev", "out", "out_dev"]
BY_USE = {s[0]: dict(zip(KEYS, s)) for s in SCENARIOS}


def cap(s):
    return s[0].upper() + s[1:]


def split_use(prose, errs):
    """'Use. Rest' -> the scenario and the rest."""
    for use, sc in BY_USE.items():
        if prose.startswith(use + ". "):
            return sc, prose[len(use) + 2:]
    errs.append(f"unknown situation in {prose!r}")
    return None, None


def level1(sample, prose, errs):
    m = re.fullmatch(r"A quale blocco della macchina di von Neumann (appartiene|appartengono) (.+?) (di|collegat[aoe] a) (un[ao]? .+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    verb, comp, link, device = m.groups()
    if comp not in COMPONENTS:
        errs.append(f"unknown component {comp!r}")
        return None
    if device not in DEVICES:
        errs.append(f"unknown device {device!r}")
    plural = comp.split(" ")[0] in ("le", "i", "gli")
    if plural != (verb == "appartengono"):
        errs.append("verb does not agree with the component")
    block = COMPONENTS[comp]
    check_text_choice(sample, block, set(BLOCKS), errs)
    return block


def tasks(sc):
    return {
        f"esegue le istruzioni {sc['app']}": "CPU",
        sc["calc"]: "CPU",
        f"decide quale istruzione {sc['app']} va eseguita dopo": "CPU",
        f"conserva le istruzioni {sc['app']} mentre il programma è in esecuzione": "Memoria centrale",
        f"conserva {sc['dato']} mentre il programma lavora": "Memoria centrale",
        f"tiene {sc['dato']} a disposizione della CPU": "Memoria centrale",
        f"riceve dall'esterno {sc['in']}": "Periferiche",
        f"porta all'esterno {sc['out']}": "Periferiche",
        f"trasporta {sc['dato']} dalla memoria centrale alla CPU": "Bus",
        f"trasporta {sc['out']} dalla memoria centrale {prep('a', sc['out_dev'])}": "Bus",
        f"trasporta {sc['in']} {prep('da', sc['in_dev'])} alla memoria centrale": "Bus",
    }


def level2(sample, prose, errs):
    sc, rest = split_use(prose, errs)
    if sc is None:
        return None
    m = re.fullmatch(r"Quale blocco della macchina di von Neumann (.+)\?", rest)
    table = tasks(sc)
    if not m or m.group(1) not in table:
        errs.append(f"level 2 task not recognised: {rest!r}")
        return None
    block = table[m.group(1)]
    check_text_choice(sample, block, set(BLOCKS), errs)
    return block


MOVES = ["Da una periferica alla memoria centrale", "Dalla memoria centrale alla CPU", "Dalla CPU alla memoria centrale", "Dalla memoria centrale a una periferica"]


def trips(sc):
    return {
        f"{cap(sc['in_dev'])} ha appena ricevuto {sc['in']}. Qual è il primo viaggio di questo dato sul bus?": 0,
        f"Dopo che {sc['in_dev']} ha ricevuto {sc['in']}, da dove a dove viaggia per prima cosa questo dato?": 0,
        f"La CPU sta per eseguire un'istruzione che usa {sc['dato']}. Da dove a dove viaggia questo dato prima del calcolo?": 1,
        f"La CPU deve {sc['calc_inf']}. Da dove a dove viaggiano, prima del calcolo, i dati che le servono?": 1,
        f"La CPU ha appena finito di {sc['calc_inf']}. Da dove a dove viaggia il risultato subito dopo il calcolo?": 2,
        f"La CPU ha eseguito un'istruzione che cambia {sc['dato']}. Da dove a dove viaggia il valore nuovo subito dopo?": 2,
        f"Ora {sc['out']} deve uscire dal computer. Qual è il suo ultimo viaggio sul bus?": 3,
        f"Tra un istante {sc['out_dev']} porterà all'esterno {sc['out']}. Qual è l'ultimo viaggio sul bus prima che succeda?": 3,
    }


def level3(sample, prose, errs):
    sc, rest = split_use(prose, errs)
    if sc is None:
        return None
    table = trips(sc)
    if rest not in table:
        errs.append(f"level 3 question not recognised: {rest!r}")
        return None
    move = table[rest]
    check_text_choice(sample, MOVES[move], set(MOVES), errs)
    return f"viaggio-{move + 1}"


TRUE = {
    "Programmi e dati stanno nella stessa memoria",
    "Le istruzioni sono scritte in memoria come sequenze di bit",
    "Per cambiare lavoro si carica in memoria un altro programma",
    "La CPU prende le istruzioni dalla memoria centrale",
    "Lo stesso computer può eseguire programmi diversi",
    "Un programma si può copiare come qualsiasi altro dato",
    "Un programma va in memoria centrale prima di essere eseguito",
    "I bit di una cella possono essere un dato o un'istruzione",
}
FALSE = {
    "Per cambiare programma si spostano i cavi dei circuiti",
    "Le istruzioni stanno nella CPU, i dati nella memoria",
    "Programmi e dati stanno in due memorie separate",
    "Un computer esegue solo il programma con cui è costruito",
    "Le istruzioni sono scritte con lettere, i dati con bit",
    "Il bus conserva il programma mentre la CPU lo esegue",
    "Le periferiche eseguono le istruzioni del programma",
    "La CPU esegue un programma anche se non è in memoria",
    "La memoria centrale contiene solo dati, mai istruzioni",
    "Un programma non si può copiare, perché non è un dato",
}


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quale di queste affermazioni sulla macchina di von Neumann è (vera|falsa)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    want = m.group(1)
    texts = [option_text(o["latex"]) for o in sample["answer"]["options"]]
    pool = TRUE if want == "vera" else FALSE
    right = [x for x in texts if x in pool]
    if len(right) != 1:
        errs.append(f"{len(right)} statements are {want}: {texts}")
        return want
    check_text_choice(sample, right[0], TRUE | FALSE, errs)
    return want


STEP_OPTIONS = [
    "Una periferica di ingresso riceve il dato",
    "Il dato viene scritto nella memoria centrale",
    "La CPU preleva istruzione e dati dalla memoria",
    "La CPU esegue l'istruzione",
    "Il risultato viene scritto nella memoria centrale",
    "Una periferica di uscita porta fuori il risultato",
]


def step_texts(sc):
    return [
        f"{sc['in_dev']} riceve {sc['in']}",
        f"il bus porta {sc['in']} nella memoria centrale",
        "la CPU preleva dalla memoria centrale l'istruzione da eseguire e i dati che le servono",
        f"la CPU {sc['calc']}",
        "il bus porta il risultato del calcolo nella memoria centrale",
        f"{sc['out_dev']} porta all'esterno {sc['out']}",
    ]


def level5(sample, prose, errs):
    sc, rest = split_use(prose, errs)
    if sc is None:
        return None
    m = re.fullmatch(r"A un certo punto (.+)\. (Che cosa succede subito dopo\?|Che cosa è successo subito prima\?)", rest)
    steps = step_texts(sc)
    if not m or m.group(1) not in steps:
        errs.append(f"level 5 step not recognised: {rest!r}")
        return None
    k = steps.index(m.group(1)) + 1  # 1 to 6
    after = "dopo" in m.group(2)
    target = k + 1 if after else k - 1
    if not 1 <= target <= 6:
        errs.append(f"no step {'after' if after else 'before'} step {k}")
        return None
    shown = {option_text(o["latex"]) for o in sample["answer"]["options"]}
    if STEP_OPTIONS[k - 1] in shown:
        errs.append("the step described is among the options")
    # the spec keeps these out: the fetch of the next instruction after step 5, the result of the previous one
    # before step 3, and "the datum is written" against "the result is written"
    if after and k == 5 and STEP_OPTIONS[2] in shown:
        errs.append("after step 5 the next fetch is also right")
    if not after and k == 3 and STEP_OPTIONS[4] in shown:
        errs.append("before step 3 the previous result is also right")
    if target in (2, 5) and STEP_OPTIONS[1] in shown and STEP_OPTIONS[4] in shown:
        errs.append("steps 2 and 5 offered together when one of them is the answer")
    check_text_choice(sample, STEP_OPTIONS[target - 1], set(STEP_OPTIONS), errs)
    if sample["params"].get("step") != k:
        errs.append(f"params.step {sample['params'].get('step')} but the text describes step {k}")
    return "dopo" if after else "prima"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, prose, errs)
    if kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
