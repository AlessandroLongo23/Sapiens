"""Checker for inf-bohm-jacopini (specs/exercises/inf-bohm-jacopini.md).

Written from the spec and the lesson. Charts are run by Python, and what a family must write comes from
checkers/_inf_alg.py:
- level 1: the structures of the chart shown are read here from its lines (rhombuses, arrows that go back, one
  structure inside another);
- level 2: the table below says which structure each task needs; a jump is never needed;
- level 3: the right option is what the chart shown writes on the inputs of the question;
- level 4: the table of true and false statements below;
- levels 5 and 6: the algorithm with jumps of the question is run here, step by step, by a small interpreter of its
  numbered steps, and on every test it must write what the structured chart writes; of the four charts only the
  right one does.
"""
import re

from checkers._inf_alg import base, check_ids, check_statements, check_written, shape
from checkers._inf_programmi import choice_of, run_chart

L3 = ["bum", "sufficienti", "euclide"]
L5 = ["somma in giù", "rovescia", "sblocco", "traguardo", "multipli"]
CASE_RANGES = {
    1: {k: (0.19, 0.31) for k in ["sequenza", "selezione", "iterazione", "annidata"]},
    2: {k: (0.27, 0.40) for k in ["sequenza", "selezione", "iterazione"]},
    3: {k: (0.27, 0.40) for k in L3},
    4: {"vera": (0.42, 0.58), "falsa": (0.42, 0.58)},
    5: {k: (0.14, 0.26) for k in L5},
    6: {k: (0.14, 0.26) for k in L5},
}

KINDS = {"sequenza": "solo la sequenza", "selezione": "Una selezione", "iterazione": "Un'iterazione", "annidata": "Una selezione dentro un'iterazione"}
NEEDS = {"sequenza": "basta la sequenza", "selezione": "Una selezione", "iterazione": "Un'iterazione", "salto": "Un salto"}
TASKS = {
    "q1": ("sequenza", "rettangolo"), "q2": ("sequenza", "spedizione in più"), "q3": ("sequenza", " in "), "q4": ("sequenza", "per biglietto"),
    "q5": ("sequenza", "voti e scriverne la somma"), "q6": ("sequenza", "prodotto"), "q7": ("sequenza", "perimetro"), "q8": ("sequenza", " numeri e scriverne "),
    "s1": ("selezione", "ridotto"), "s2": ("selezione", "solo quando supera"), "s3": ("selezione", "dei due"), "s4": ("selezione", "dispari"),
    "s5": ("selezione", "solo a chi spende meno"), "s6": ("selezione", "insufficiente"), "s7": ("selezione", "solo se è quella giusta"),
    "s8": ("selezione", "nessuno studente"),
    "i1": ("iterazione", "ogni volta che è sbagliato"), "i2": ("iterazione", "uno alla volta"), "i3": ("iterazione", "una settimana dopo l'altra"),
    "i4": ("iterazione", "tutti i numeri da 1 a n"), "i5": ("iterazione", "leggerli tutti"), "i6": ("iterazione", "più volte"),
    "i7": ("iterazione", "multipli"), "i8": ("iterazione", "più volte"),
}
STATEMENTS = {
    "t1": (True, "soltanto sequenza, selezione e iterazione"), "t2": (True, "sempre fare a meno"), "t3": (True, "danno gli stessi risultati"),
    "t4": (True, "può richiedere"), "t5": (True, "da un punto solo"), "t6": (True, "dentro il giro"), "t7": (True, "mille righe"),
    "t8": (True, "una sola sequenza"), "t9": (True, "tutte e due con una condizione"), "t10": (True, "Finito il giro"),
    "t11": (True, "senza salti"), "t12": (True, "non una quarta struttura"),
    "x1": (False, "deve usare tutte e tre"), "x2": (False, "tre istruzioni"), "x3": (False, "sempre più corto"), "x4": (False, "solo con i salti"),
    "x5": (False, "Finito il ramo"), "x6": (False, "sempre una selezione"), "x7": (False, "non può stare dentro"), "x8": (False, "tutti e due i rami"),
    "x9": (False, "stessi passi"), "x10": (False, "basta una selezione"), "x11": (False, "più punti diversi"), "x12": (False, "vieta"),
}

STEP = re.compile(r"(?:^| )(\d+)\. (?=[A-Z])")
COMPARE = {"uguale a": lambda a, b: a == b, "maggiore di": lambda a, b: a > b, "maggiore o uguale a": lambda a, b: a >= b, "minore o uguale a": lambda a, b: a <= b}


def run_jumps(text, inputs, limit=5000):
    """What an algorithm written as numbered steps with jumps writes: the steps are those of the lesson."""
    marks = list(STEP.finditer(text))
    steps = {}
    for i, m in enumerate(marks):
        steps[int(m.group(1))] = text[m.end() : marks[i + 1].start() if i + 1 < len(marks) else len(text)].strip()
    if sorted(steps) != list(range(1, len(steps) + 1)):
        raise ValueError("the steps are not numbered from 1")
    env, out, pending, pc, done = {}, [], [int(x) for x in inputs], 1, 0
    val = lambda tok: int(tok) if re.fullmatch(r"\d+", tok) else env[tok]
    while pc in steps:
        done += 1
        if done > limit:
            return None
        s = steps[pc]
        pc += 1
        if m := re.fullmatch(r"Leggi (\w+)\.", s):
            if not pending:
                return None
            env[m.group(1)] = pending.pop(0)
        elif m := re.fullmatch(r"Metti (\d+) in (\w+)\.", s):
            env[m.group(2)] = int(m.group(1))
        elif m := re.fullmatch(r"Se (\w+) è (uguale a|maggiore di|maggiore o uguale a|minore o uguale a) (\w+), vai al passo (\d+)\.", s):
            if COMPARE[m.group(2)](val(m.group(1)), val(m.group(3))):
                pc = int(m.group(4))
        elif m := re.fullmatch(r"Aggiungi (\w+) a (\w+)\.", s):
            env[m.group(2)] += val(m.group(1))
        elif m := re.fullmatch(r"Togli (\w+) a (\w+)\.", s):
            env[m.group(2)] -= val(m.group(1))
        elif m := re.fullmatch(r"Vai al passo (\d+)\.", s):
            pc = int(m.group(1))
        elif m := re.fullmatch(r'Scrivi "([^"]*)"\.', s):
            out.append(m.group(1))
        elif m := re.fullmatch(r"Scrivi (\w+) per (\w+)\.", s):
            out.append(str(val(m.group(1)) * val(m.group(2))))
        elif m := re.fullmatch(r"Scrivi (\w+)\.", s):
            out.append(str(val(m.group(1))))
        elif s == "Fine.":
            break
        else:
            raise ValueError(f"a step that is not understood: {s}")
    return out


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample)
    choice = choice_of(sample)
    if level == 1:
        sel, loops, nested = shape(params["source"])
        kind = "annidata" if nested else "iterazione" if loops else "selezione" if sel else "sequenza"
        if nested and (sel, loops) != (1, 1):
            errors.append("more than a selection inside a loop")
        if not nested and sel + loops > 1:
            errors.append("two structures one after the other")
        if params["case"] != kind:
            errors.append(f"the chart is: {kind}")
        if "chart" not in sample:
            errors.append("the chart is not shown")
        check_ids(sample, errors, {k: (k, v) for k, v in KINDS.items()}, kind)
    elif level == 2:
        need, words = TASKS[params["task"]]
        if words not in sample["problem"] or params["text"] not in sample["problem"]:
            errors.append("the question does not say the task")
        if params["case"] != need:
            errors.append(f"the task needs: {need}")
        check_ids(sample, errors, {k: (k, v) for k, v in NEEDS.items()}, need)
    elif level == 3:
        if params["family"] not in L3:
            errors.append("not a chart with a structure inside another")
        if not shape(params["source"])[2]:
            errors.append("no structure inside another")
        check_written(sample, errors)
    elif level == 4:
        check_statements(sample, errors, STATEMENTS)
    else:
        if params["family"] not in L5:
            errors.append(f"the family {params['family']} is not of this level")
        if params["jumps"] not in sample["problem"]:
            errors.append("the question does not carry the algorithm with jumps")
        if "vai al passo" not in params["jumps"].lower():
            errors.append("no jump")
        for t in params["tests"]:
            if run_jumps(params["jumps"], t) != run_chart(params["source"], t):
                errors.append(f"on {t} the algorithm with jumps and the chart write different things")
        if shape(params["source"]) != (0, 1, False):
            errors.append("the structured chart is not one loop")
        if not all("chart" in o for o in choice["options"]):
            errors.append("the options are not charts")
        if (sample["answer"]["kind"] == "chart") != (level == 6):
            errors.append("only level 6 asks for a chart")
    return errors, params["case"]
