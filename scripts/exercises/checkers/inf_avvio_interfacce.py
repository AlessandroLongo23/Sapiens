"""Checker for inf-avvio-interfacce (specs/exercises/inf-avvio-interfacce.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: the sentence is classified by the words of its phase (the chip of the firmware, the check of the
  components, the search among the mass memories, the copy of the kernel, drivers and password), one phase only;
- level 2: the phases have the order written here; the neighbour of a phase and the sorted list follow from it;
- level 3: the table of true and false statements below;
- level 4: the description is matched to its element by the words of the table below;
- level 5: the table says which features belong to the command line and which to the graphical interface.
"""
import re

from checkers._inf_so import NAMES, check_choice, check_statements, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {str(k): (0.14, 0.26) for k in range(5)},
    2: {"dopo": (0.19, 0.31), "prima": (0.19, 0.31), "sequenza": (0.43, 0.57)},
    3: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    4: {k: (0.07, 0.18) for k in ["prompt", "nome", "argomento", "interprete", "finestra", "icona", "menu", "puntatore"]},
    5: {"riga di comando": (0.40, 0.60), "grafica": (0.40, 0.60)},
}

# The five phases, in order.
PHASES = ["L'avvio del firmware", "L'autodiagnosi (POST)", "La ricerca del disco di avvio", "Il caricamento del nucleo", "L'avvio di servizi e interfaccia"]
OF_PHASE = ["dell'avvio del firmware", "dell'autodiagnosi (POST)", "della ricerca del disco di avvio", "del caricamento del nucleo", "dell'avvio di servizi e interfaccia"]
SHORT = ["firmware", "autodiagnosi", "ricerca del disco", "nucleo", "interfaccia"]
PHASE_WORDS = [
    ["in un chip", "non volatile"],
    ["componenti"],
    ["ordine fissato", "nessuna memoria di massa"],
    ["copia il nucleo", "bootloader"],
    ["driver", "password"],
]
DEVICES = ["portatile", "computer fisso", "telefono", "tablet", "console"]

STATEMENTS = {
    "t1": (True, "memoria non volatile della scheda madre"), "t2": (True, "copiato di nuovo nella RAM"), "t3": (True, "bootloader copia il nucleo"),
    "t4": (True, "prima del caricamento"), "t5": (True, "resta lo stesso"), "t6": (True, "resta alimentata"),
    "t7": (True, "Anche un telefono"), "t8": (True, "sta nella memoria di massa"), "t9": (True, "riparte dal firmware"),
    "t10": (True, "cerca il sistema operativo"),
    "f1": (False, "insieme al sistema operativo"), "f2": (False, "resta nella RAM"), "f3": (False, "bootloader controlla"),
    "f4": (False, "dopo la schermata"), "f5": (False, "stesso programma"), "f6": (False, "ripete tutte le fasi"),
    "f7": (False, "prima che parta il firmware"), "f8": (False, "non parte più"), "f9": (False, "senza una procedura"),
    "f10": (False, "prima che il nucleo"),
}

# element: (label, belongs to the command line, words of its descriptions)
ELEMENTS = {
    "prompt": ("Il prompt", True, ["pronto a ricevere", "all'inizio della riga"]),
    "nome": ("Il nome del comando", True, ["quale operazione", "la parola mkdir"]),
    "argomento": ("L'argomento", True, ["su che cosa", "la parola Documenti"]),
    "interprete": ("L'interprete dei comandi", True, ["legge la riga", "shell"]),
    "finestra": ("La finestra", False, ["il riquadro"]),
    "icona": ("L'icona", False, ["piccolo disegno"]),
    "menu": ("Il menu", False, ["elenco"]),
    "puntatore": ("Il puntatore", False, ["freccia"]),
}

# True: a feature of the command line. False: of the graphical interface.
FEATURES = {
    "c1": (True, "si scrivono"), "c2": (True, "ricordare i nomi"), "c3": (True, "sola riga"), "c4": (True, "poche risorse"),
    "c5": (True, "carattere sbagliato"), "c6": (True, "righe di testo"), "c7": (True, "server"), "c8": (True, "prompt"),
    "g1": (False, "oggetti disegnati"), "g2": (False, "in vista nei menu"), "g3": (False, "senza studiare"), "g4": (False, "più risorse"),
    "g5": (False, "è lento"), "g6": (False, "dentro una finestra"), "g7": (False, "icone"), "g8": (False, "con le dita"),
}


def phase_of(o):
    i = int(o["values"][0])
    if PHASES[i] != option_text(o["latex"]):
        raise ValueError(f"option {o['latex']!r} is not phase {i}")
    return i


def lower_first(s):
    return s[0].lower() + s[1:]


def level1(sample, prose, errs):
    m = re.fullmatch(r"(.+) Quale fase dell'avvio descrive la frase\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    sentence = m.group(1)
    if not any(n in sentence for n in NAMES) or not any(d in sentence for d in DEVICES):
        errs.append("no known name or device in the sentence")
    found = [i for i, words in enumerate(PHASE_WORDS) if any(w in sentence for w in words)]
    if len(found) != 1:
        errs.append(f"the sentence fits {len(found)} phases: {found}")
        return None
    check_choice(sample["answer"], lambda o: phase_of(o) == found[0], errs)
    return str(found[0])


def level2(sample, prose, errs):
    m = re.fullmatch(r"Durante l'avvio (?:del|della) (.+?), quale fase viene subito (dopo|prima) (.+)\?", prose)
    if m:
        if m.group(1) not in DEVICES:
            errs.append(f"unknown device {m.group(1)!r}")
        names = [lower_first(x) for x in PHASES] if m.group(2) == "dopo" else OF_PHASE
        if m.group(3) not in names:
            errs.append(f"unknown phase {m.group(3)!r}")
            return None
        want = names.index(m.group(3)) + (1 if m.group(2) == "dopo" else -1)
        if not 0 <= want <= 4:
            errs.append("no phase there")
            return None
        check_choice(sample["answer"], lambda o: phase_of(o) == want, errs)
        return m.group(2)
    m = re.fullmatch(r"Quale elenco mette queste fasi dell'avvio (?:del|della) (.+?) nell'ordine in cui avvengono\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    if m.group(1) not in DEVICES:
        errs.append(f"unknown device {m.group(1)!r}")
    sets = set()

    def sorted_list(o):
        names = lower_first(option_text(o["latex"])).split(", ")
        idx = [SHORT.index(n) for n in names]
        if "-".join(map(str, idx)) != o["values"][0]:
            raise ValueError("list value does not match its text")
        if len(set(idx)) != len(idx) or len(idx) not in (3, 4):
            raise ValueError("a list must have three or four different phases")
        sets.add(frozenset(idx))
        return idx == sorted(idx)

    check_choice(sample["answer"], sorted_list, errs)
    if len(sets) != 1:
        errs.append("the lists do not contain the same phases")
    return "sequenza"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Nell'interfaccia (a riga di comando|grafica), come si chiama (.+)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    found = [k for k, (_, _, words) in ELEMENTS.items() if any(w in m.group(2) for w in words)]
    if len(found) != 1:
        errs.append(f"description {m.group(2)!r} fits {len(found)} elements")
        return None
    if ELEMENTS[found[0]][1] != (m.group(1) == "a riga di comando"):
        errs.append(f"{found[0]} does not belong to the interface {m.group(1)}")

    def element(o):
        k = o["values"][0]
        if ELEMENTS[k][0] != option_text(o["latex"]):
            raise ValueError(f"option {o['latex']!r} is not the element {k!r}")
        return k

    check_choice(sample["answer"], lambda o: element(o) == found[0], errs)
    return found[0]


def level5(sample, prose, errs):
    m = re.fullmatch(r"Quale di queste è una caratteristica dell'interfaccia (a riga di comando|grafica)\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    want_cli = m.group(1) == "a riga di comando"

    def is_cli(o):
        fid = o["values"][0]
        if fid not in FEATURES:
            raise ValueError(f"unknown feature {fid!r}")
        kind, words = FEATURES[fid]
        if words not in option_text(o["latex"]):
            raise ValueError(f"feature {fid} does not say {words!r}")
        return kind

    check_choice(sample["answer"], lambda o: is_cli(o) == want_cli, errs)
    return "riga di comando" if want_cli else "grafica"


def check(sample):
    errs = []
    common(sample, errs)
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, errs)
    elif lvl == 3:
        kind = check_statements(sample, prose, "sull'avvio", STATEMENTS, errs)
    elif lvl == 4:
        kind = level4(sample, prose, errs)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
