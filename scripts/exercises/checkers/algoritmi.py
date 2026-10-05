"""Checker for algoritmi (specs/exercises/algoritmi.md).

Written from the spec and the lesson. The charts are run by Python (checkers/_inf_programmi.py) and what they must
write comes from the table of the families in checkers/_inf_alg.py, not from the generator:
- level 1: the table below says which property each step breaks; the question names the step or the fault;
- levels 2 and 3: the right option is what the chart shown writes on the inputs of the question;
- level 4: the table of true and false statements below;
- level 5: of the four charts only the right one writes what the family must, on every test;
- level 6: the chart of the solution passes its tests, which are those of params; the multiple choice as in level 5.
"""
from checkers._inf_alg import base, check_ids, check_statements, check_written, right_of
from checkers._inf_programmi import choice_of

L3 = ["soglia", "sconto", "due numeri", "rovescia", "addizioni", "euclide"]
L5 = ["quota", "unita", "rettangolo", "due numeri", "sconto"]
CASE_RANGES = {
    1: {"manca": (0.52, 0.68), "passo": (0.32, 0.48)},
    2: {k: (0.25, 0.42) for k in ["quota", "unita", "rettangolo"]},
    3: {k: (0.10, 0.24) for k in L3},
    4: {"vera": (0.42, 0.58), "falsa": (0.42, 0.58)},
    5: {k: (0.13, 0.27) for k in L5},
    6: {k: (0.13, 0.27) for k in L5},
}

# The property a step breaks, and words of its text.
BROKEN = {
    "f1": ("finito", "senza fermarti mai"), "f2": ("finito", "per sempre"), "f3": ("finito", "tutti i numeri pari"),
    "f4": ("finito", "senza mai smettere"), "f5": ("finito", "tutte le cifre"), "f6": ("finito", "torna al passo 1"),
    "a1": ("non ambiguo", "un po'"), "a2": ("non ambiguo", "al punto giusto"), "a3": ("non ambiguo", "qualche minuto"),
    "a4": ("non ambiguo", "abbastanza grande"), "a5": ("non ambiguo", "quanto basta"), "a6": ("non ambiguo", "un bel pezzo"),
    "e1": ("eseguibile", "ndovina"), "e2": ("eseguibile", "lotteria"), "e3": ("eseguibile", "nel pensiero"),
    "e4": ("eseguibile", "più grande che esiste"), "e5": ("eseguibile", "tra un anno"), "e6": ("eseguibile", "per zero"),
    "d1": ("deterministico", "a caso"), "d2": ("deterministico", "dado"), "d3": ("deterministico", "moneta"),
    "d4": ("deterministico", "senza guardare"), "d5": ("deterministico", "a caso"), "d6": ("deterministico", "mescolato"),
    "g1": ("generale", "7,5"), "g2": ("generale", "lato 3"), "g3": ("generale", "21"), "g4": ("generale", "48 e 18"),
    "g5": ("generale", "12 e 30"), "g6": ("generale", "135"),
}
PRECISE = {
    "p1": "ggiungi 1", "p2": "per 2", "p3": "il risultato", "p4": "chiamalo p", "p5": "almeno 6", "p6": "ogli b da a",
    "p7": "per l'altezza", "p8": "maggiore di zero", "p9": "200 metri", "p10": "seconda uscita", "p11": "chiamali a e b", "p12": "a più b",
}
NAMES = {"finito": "Finito", "non ambiguo": "Non ambiguo", "eseguibile": "Eseguibile", "deterministico": "Deterministico", "generale": "Generale"}
FAULTS = {"finito": "non termini", "non ambiguo": "è ambiguo", "eseguibile": "non è eseguibile", "deterministico": "non deterministico"}

STATEMENTS = {
    "t1": (True, "scritto in un linguaggio"), "t2": (True, "programmi diversi"), "t3": (True, "anche a mano"), "t4": (True, "gli basta"),
    "t5": (True, "una persona oppure una macchina"), "t6": (True, "da cui l'algoritmo parte"), "t7": (True, "a parole"),
    "t8": (True, "molti passi eseguiti"), "t9": (True, "solo dopo"), "t10": (True, "può dipendere dai dati"),
    "t11": (True, "garantito solo"), "t12": (True, "più piccoli"),
    "x1": (False, "la stessa cosa"), "x2": (False, "solo se c'è un computer"), "x3": (False, "bisogna aver capito"),
    "x4": (False, "un solo programma"), "x5": (False, "riceve prima di cominciare"), "x6": (False, "ogni volta un risultato diverso"),
    "x7": (False, "Qualunque elenco"), "x8": (False, "infiniti passi"), "x9": (False, "subito il programma"),
    "x10": (False, "sempre tutti"), "x11": (False, "un caso solo"), "x12": (False, "scritto in italiano"),
}


def level1(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    if params["case"] == "manca":
        prop, words = BROKEN[params["step"]]
        if words not in sample["problem"]:
            errors.append("the question does not show the step")
        if prop != params["property"] or right_of(sample)["values"][0] != prop:
            errors.append(f"the step breaks «{prop}»")
        for o in choice["options"]:
            if NAMES.get(o["values"][0]) != o["latex"]:
                errors.append("an option is not the name of a property")
    elif params["case"] == "passo":
        prop = params["property"]
        if FAULTS[prop] not in sample["problem"]:
            errors.append("the question does not name the fault")
        table = {k: (v[0] == prop, v[1]) for k, v in BROKEN.items()} | {k: (False, v) for k, v in PRECISE.items()}
        check_ids(sample, errors, table, True)
        # the three others must be precise steps, not steps with another fault
        if sum(1 for o in choice["options"] if o["values"][0] in PRECISE) != 3:
            errors.append("the other three are not precise steps")
    else:
        errors.append("unknown case")


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample)
    if level == 1:
        level1(sample, errors)
    elif level == 4:
        check_statements(sample, errors, STATEMENTS)
    else:
        allowed = {2: ["quota", "unita", "rettangolo"], 3: L3, 5: L5, 6: L5}[level]
        if params["family"] not in allowed:
            errors.append(f"the family {params['family']} is not of this level")
        if level in (2, 3):
            check_written(sample, errors)
        else:
            choice = choice_of(sample)
            if not all("chart" in o for o in choice["options"]):
                errors.append("the options are not charts")
            if (sample["answer"]["kind"] == "chart") != (level == 6):
                errors.append("only level 6 asks for a chart")
    return errors, params["case"]
