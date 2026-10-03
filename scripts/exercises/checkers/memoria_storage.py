"""Checker for memoria-storage (specs/exercises/memoria-storage.md).

Written from the spec and the lesson; the tables of the spec are typed again here and the answer is rebuilt from
the pieces read in the text:
- level 1: the task after "Quale memoria" is matched against the patterns of the spec, each with its memory;
- level 2: every option is a thing that is lost or kept; the question says which one is asked;
- level 3: the numbers are read and the count is redone (addresses from 0, 8 bits in a byte);
- level 4: the numbers and the factor are read from the text and the conversion is redone with whole numbers;
- level 5: the memories are ranked with the hierarchy of the lesson.
"""
import re

from checkers._inf_architettura import NUM, check_choice, check_number, check_text_choice, common, option_text, parse_int, prose_and_extra

MEMORIES = ["RAM", "ROM", "Cache", "Memoria di massa"]

CASE_RANGES = {
    1: {m: (0.19, 0.31) for m in MEMORIES},
    2: {"persa": (0.40, 0.60), "ritrovata": (0.40, 0.60)},
    3: {k: (0.19, 0.31) for k in ["ultimo", "quante", "byte", "bit"]},
    4: {k: (0.17, 0.33) for k in ["kib", "mib", "celle", "file"]},
    5: {"ordine": (0.56, 0.77), "estremo": (0.23, 0.44)},
}

DEVICE = r"un(?:a|o)? (?:telefono|tablet|portatile|computer fisso|console per videogiochi|smartwatch)"
APP = r"(?:del videogioco|della calcolatrice|del registro elettronico|del programma di videoscrittura|del navigatore|del foglio di calcolo|del lettore musicale|del programma di grafica|del traduttore|della sveglia)"
FILES = {
    "le foto": ["un telefono", "un tablet", "un portatile", "un computer fisso"],
    "i video": ["un telefono", "un tablet", "un portatile", "un computer fisso"],
    "le canzoni scaricate": ["un telefono", "un tablet", "un portatile", "uno smartwatch"],
    "i documenti salvati": ["un tablet", "un portatile", "un computer fisso"],
    "le app installate": ["un telefono", "un tablet", "uno smartwatch"],
    "i giochi installati": ["una console per videogiochi", "un portatile", "un computer fisso"],
    "il sistema operativo": None,
}
UNSAVED = [
    "il tema che stai scrivendo e non hai ancora salvato",
    "i dati della partita in corso, non ancora salvata",
    "il disegno a cui stai lavorando e che non hai ancora salvato",
    "i numeri appena scritti in un foglio di calcolo non ancora salvato",
    "la foto che stai ritoccando e non hai ancora salvato",
]
SAVED = ["il tema dopo che l'hai salvato", "la partita dopo il salvataggio", "il disegno dopo che l'hai salvato", "il foglio di calcolo dopo che l'hai salvato", "la foto ritoccata dopo che l'hai salvata"]

TASKS = [
    (rf"contiene le istruzioni {APP} mentre il programma è in esecuzione", "RAM"),
    (rf"di {DEVICE} contiene i programmi aperti e si svuota allo spegnimento", "RAM"),
    (rf"di {DEVICE} conserva anche senza corrente le prime istruzioni da eseguire all'accensione", "ROM"),
    (rf"di {DEVICE} contiene il programma di avvio e nell'uso normale viene solo letta", "ROM"),
    (rf"di {DEVICE} fa parte della memoria centrale ma non è volatile", "ROM"),
    (rf"di {DEVICE} tiene accanto alla CPU una copia dei dati usati più di recente", "Cache"),
    (rf"di {DEVICE} è più veloce della RAM ma molto più piccola", "Cache"),
    (rf"risparmia alla CPU l'attesa della RAM per le istruzioni {APP} che si ripetono di continuo", "Cache"),
    (rf"di {DEVICE} ha la capacità più grande", "Memoria di massa"),
    (rf"è quella da cui le istruzioni {APP} vengono copiate nella RAM quando apri il programma", "Memoria di massa"),
]


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quale memoria (.+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    task = m.group(1)
    memory = None
    for rx, mem in TASKS:
        if re.fullmatch(rx, task):
            memory = mem
    if task.startswith("contiene ") and task[len("contiene "):] in UNSAVED:
        memory = "RAM"
    if task.startswith("conserva ") and task[len("conserva "):] in SAVED:
        memory = "Memoria di massa"
    f = re.fullmatch(rf"di ({DEVICE}) conserva (.+) anche a dispositivo spento", task)
    if f and f.group(2) in FILES:
        allowed = FILES[f.group(2)]
        if allowed is not None and f.group(1) not in allowed:
            errs.append(f"{f.group(2)} on {f.group(1)} is not in the spec")
        memory = "Memoria di massa"
    if memory is None:
        errs.append(f"level 1 task not recognised: {task!r}")
        return None
    check_text_choice(sample, memory, set(MEMORIES), errs)
    return memory


LOST = {
    "Il tema scritto e non ancora salvato",
    "La partita in corso, non salvata",
    "Il numero appena digitato nella calcolatrice",
    "Il disegno non ancora salvato",
    "Il contenuto dell'accumulatore della CPU",
    "I dati tenuti nella cache",
    "Le modifiche non salvate a una foto",
    "La copia in RAM del programma aperto",
}
KEPT = {
    "Le foto salvate nella galleria",
    "Il programma di avvio nella ROM",
    "I file su una chiavetta USB",
    "Il sistema operativo installato sul disco",
    "Un documento salvato sul disco",
    "Le canzoni scaricate nella memoria interna",
    "Le app installate",
    "I video salvati su una scheda di memoria",
}


def level2(sample, prose, errs):
    m = re.fullmatch(r"(.+ si spegne\.) (Quale di queste cose va persa\?|Quale di queste cose si ritrova alla riaccensione\?)", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    lost = "persa" in m.group(2)
    texts = [option_text(o["latex"]) for o in sample["answer"]["options"]]
    pool = LOST if lost else KEPT
    right = [x for x in texts if x in pool]
    if len(right) != 1:
        errs.append(f"{len(right)} options fit the question: {texts}")
        return "persa" if lost else "ritrovata"
    check_text_choice(sample, right[0], LOST | KEPT, errs)
    return "persa" if lost else "ritrovata"


def level3(sample, prose, errs):
    n = f"\\$({NUM})\\$"
    m = re.fullmatch(rf"Una memoria ha {n} celle, con gli indirizzi che partono da \$0\$\. Qual è l'indirizzo dell'ultima cella\?", prose)
    if m:
        cells = parse_int(m.group(1))
        check_number(sample, cells - 1, errs, mistakes=[cells])
        if str(cells) not in sample["params"].get("distractors", []):
            errs.append("the number of cells must be a distractor")
        return "ultimo"
    m = re.fullmatch(rf"Gli indirizzi delle celle di una memoria vanno da \$0\$ a {n}\. Quante celle ha la memoria\?", prose)
    if m:
        last = parse_int(m.group(1))
        check_number(sample, last + 1, errs, mistakes=[last])
        if str(last) not in sample["params"].get("distractors", []):
            errs.append("the last address must be a distractor")
        return "quante"
    m = re.fullmatch(rf"Una memoria ha celle da \$1\$ byte, con indirizzi da \$0\$ a {n}\. Qual è la sua capacità in byte\?", prose)
    if m:
        last = parse_int(m.group(1))
        check_number(sample, last + 1, errs, mistakes=[last, 8 * (last + 1)])
        return "byte"
    m = re.fullmatch(rf"Una memoria ha {n} celle da \$1\$ byte\. Quanti bit contiene in tutto\?", prose)
    if m:
        cells = parse_int(m.group(1))
        check_number(sample, 8 * cells, errs, mistakes=[cells])
        return "bit"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    n = f"({NUM})"
    m = re.fullmatch(rf"Una memoria ha \${n}\$ celle da \$1\$ byte\. Qual è la sua capacità in KiB\? Ricorda che \$1\\,\\text\{{KiB\}} = 1024\\,\\text\{{B\}}\$\.", prose)
    kind = "kib"
    if not m:
        m = re.fullmatch(rf"Una RAM ha una capacità di \${n}\\,\\text\{{KiB\}}\$\. Quanti MiB sono\? Ricorda che \$1\\,\\text\{{MiB\}} = 1024\\,\\text\{{KiB\}}\$\.", prose)
        kind = "mib"
    if m:
        size = parse_int(m.group(1))
        if size % 1024:
            errs.append(f"{size} is not a multiple of 1024")
            return kind
        check_number(sample, size // 1024, errs)
        return kind
    m = re.fullmatch(rf"Una memoria ha una capacità di \$(\d+)\\,\\text\{{KiB\}}\$ e celle da \$1\$ byte\. Quante celle ha\? Ricorda che \$1\\,\\text\{{KiB\}} = 1024\\,\\text\{{B\}}\$\.", prose)
    if m:
        k = int(m.group(1))
        check_number(sample, 1024 * k, errs, mistakes=[1000 * k])
        if str(1000 * k) not in sample["params"].get("distractors", []):
            errs.append("the count with the factor 1000 must be a distractor")
        return "celle"
    m = re.fullmatch(
        rf"(Una chiavetta USB|Un SSD|Una scheda di memoria|Un disco magnetico) ha una capacità di \$(\d+)\\,\\text\{{GB\}}\$\. (Quante foto|Quante canzoni|Quante presentazioni|Quanti video) da \$(\d+)\\,\\text\{{MB\}}\$ può contenere al massimo\? Ricorda che \$1\\,\\text\{{GB\}} = 1000\\,\\text\{{MB\}}\$\.",
        prose,
    )
    if m:
        c, s = int(m.group(2)), int(m.group(4))
        if (c * 1000) % s:
            errs.append("the files do not fill the memory exactly")
            return "file"
        check_number(sample, c * 1000 // s, errs)
        return "file"
    errs.append(f"level 4 text not recognised: {prose!r}")
    return None


# from the fastest and dearest per byte to the slowest and cheapest
HIERARCHY = ["registri", "cache", "RAM", "SSD", "disco magnetico"]
# key: (rank is read top-down?, is it about capacity?)
ORDERS = {
    "dalla più veloce alla più lenta": (True, False),
    "dalla più lenta alla più veloce": (False, False),
    "da quella che costa di più per ogni byte a quella che costa di meno": (True, False),
    "da quella che costa di meno per ogni byte a quella che costa di più": (False, False),
    "dalla più capiente alla meno capiente": (False, True),
    "dalla meno capiente alla più capiente": (True, True),
}
BESTS = {
    "è la più veloce": (True, False),
    "è la più lenta": (False, False),
    "costa di più per ogni byte": (True, False),
    "costa di meno per ogni byte": (False, False),
    "ha la capacità più grande": (False, True),
    "ha la capacità più piccola": (True, True),
}


def level5(sample, prose, errs):
    opts = sample["answer"]["options"]
    m = re.fullmatch(r"Metti in ordine queste memorie (.+): (.+)\.", prose)
    if m:
        if m.group(1) not in ORDERS:
            errs.append(f"unknown order {m.group(1)!r}")
            return None
        top_down, capacity = ORDERS[m.group(1)]
        items = m.group(2).split(", ")
        if len(items) not in (3, 4) or len(set(items)) != len(items) or any(x not in HIERARCHY for x in items):
            errs.append(f"memories {items} not in the spec")
            return None
        if capacity and "SSD" in items:
            errs.append("SSD compared for capacity")
        right = sorted(items, key=HIERARCHY.index, reverse=not top_down)
        if items in (right, right[::-1]):
            errs.append("the memories are listed already in order")
        for o in opts:
            if sorted(option_text(o["latex"]).split(", ")) != sorted(items):
                errs.append(f"option {o['latex']!r} is not an order of the listed memories")
        check_text_choice(sample, ", ".join(right), None, errs)
        if ", ".join(right[::-1]) not in [option_text(o["latex"]) for o in opts]:
            errs.append("the reversed order must be an option")
        return "ordine"
    m = re.fullmatch(r"Quale di queste memorie (.+)\?", prose)
    if m and m.group(1) in BESTS:
        top_down, capacity = BESTS[m.group(1)]
        items = [option_text(o["latex"]) for o in opts]
        if any(x not in HIERARCHY for x in items) or len(set(items)) != 4:
            errs.append(f"options {items} are not four memories")
            return None
        if capacity and "SSD" in items:
            errs.append("SSD compared for capacity")
        ranked = sorted(items, key=HIERARCHY.index)
        check_text_choice(sample, ranked[0] if top_down else ranked[-1], set(HIERARCHY), errs)
        return "estremo"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


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
