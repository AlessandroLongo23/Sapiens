"""Checker for diagrammi-flusso (specs/exercises/diagrammi-flusso.md).

Written from the spec and the lesson. What an algorithm must write comes from the table of the families in
checkers/_inf_alg.py; charts and programs are run by Python:
- level 1: the shape of a block is decided here from what is written in it; the contents of a shape and the arrows
  that leave a block come from the tables below;
- levels 2 and 3: the right option is what the chart shown writes on the inputs of the question;
- level 4: the same, or the times the condition is asked, counted here by running the loop with a counter in it;
- level 5: of the four programs only the right one writes what the chart does (their Python is run), and they fit
  a phone: at most 9 lines of Python, lines of at most 34 characters;
- level 6: the chart of the solution passes its tests; of the four charts only the right one does.
"""
import re

from checkers._inf_alg import base, check_ids, check_written, right_of
from checkers._inf_programmi import choice_of, run_python, to_python

L2 = ["ordine", "quota", "unita", "rettangolo"]
L3 = ["soglia", "sconto", "spedizione", "due numeri", "divisibile"]
L4 = ["rovescia", "somma", "multipli", "divisioni"]
L5 = ["quota", "sconto", "soglia", "rovescia", "somma", "multipli"]
L6 = ["unita", "divisibile", "sconto", "soglia", "rovescia", "somma"]
CASE_RANGES = {
    1: {"forma": (0.52, 0.68), "contenuto": (0.14, 0.26), "frecce": (0.14, 0.26)},
    2: {"ordine": (0.33, 0.47), "quota": (0.14, 0.26), "unita": (0.14, 0.26), "rettangolo": (0.14, 0.26)},
    3: {k: (0.14, 0.26) for k in L3},
    4: {k: (0.18, 0.32) for k in L4},
    5: {k: (0.11, 0.23) for k in L5},
    6: {k: (0.11, 0.23) for k in L6},
}

SHAPES = {"ovale": "Un ovale", "parallelogramma": "Un parallelogramma", "rettangolo": "Un rettangolo", "rombo": "Un rombo"}
CONTENTS = {"ovale": "inizio", "parallelogramma": "da leggere o da scrivere", "rettangolo": "Un calcolo", "rombo": "Una domanda"}
ARROWS = {"rombo": ("un rombo", 2), "rettangolo": ("un rettangolo", 1), "parallelogramma": ("un parallelogramma", 1), "fine": ('"fine"', 0), "inizio": ('"inizio"', 1)}
COUNTS = ["Nessuna", "Una", "Due", "Tre"]


def shape_of(text):
    if text in ("inizio", "fine"):
        return "ovale"
    if text.startswith("leggi ") or text.startswith("scrivi "):
        return "parallelogramma"
    if "←" in text:
        return "rettangolo"
    if text.endswith("?"):
        return "rombo"
    return None


def level1(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    right = right_of(sample)
    case = params["case"]
    if case == "forma":
        text = re.search(r"«(.+)»", sample["problem"]).group(1)
        shape = shape_of(text)
        if shape is None or right["values"][0] != shape or params["shape"] != shape:
            errors.append(f"«{text}» is in a {shape}")
        for o in choice["options"]:
            if SHAPES.get(o["values"][0]) != o["latex"]:
                errors.append("an option is not a shape")
    elif case == "contenuto":
        shape = params["shape"]
        if SHAPES[shape].lower() not in sample["problem"]:
            errors.append("the question does not name the shape")
        check_ids(sample, errors, {k: (k, v) for k, v in CONTENTS.items()}, shape)
    elif case == "frecce":
        words, count = ARROWS[params["from"]]
        if words not in sample["problem"]:
            errors.append("the question does not name the block")
        if right["values"][0] != str(count) or right["latex"] != COUNTS[count]:
            errors.append(f"{count} arrows leave {words}")
        for o in choice["options"]:
            if COUNTS[int(o["values"][0])] != o["latex"]:
                errors.append("an option says another number than its value")
    else:
        errors.append("unknown case")


def turns(source, inputs):
    """How many times the body of the only loop of `source` runs on `inputs`."""
    out = ["__n = 0"]
    for line in to_python(source).split("\n"):
        out.append(line)
        if line.startswith("while "):
            out.append("    __n += 1")
    out.append("print('TURNS', __n)")
    return int(run_python("\n".join(out) + "\n", inputs)[-1].split()[1])


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample)
    if level == 1:
        level1(sample, errors)
        return errors, params["case"]
    family = params["family"]
    if family not in {2: L2, 3: L3, 4: L4, 5: L5, 6: L6}[level]:
        errors.append(f"the family {family} is not of this level")
    choice = choice_of(sample)
    if level in (2, 3) or (level == 4 and params["ask"] == "scrive"):
        check_written(sample, errors)
    elif level == 4:
        n = turns(params["source"], params["inputs"])
        if not 1 <= n <= 6:
            errors.append(f"a loop of {n} turns")
        if right_of(sample)["values"][0] != str(n + 1) or params["turns"] != n:
            errors.append(f"the condition is asked {n + 1} times")
        if str(params["inputs"][0]) not in sample["problem"] or "chart" not in sample:
            errors.append("the question does not give the input or the chart")
    elif level == 5:
        if "chart" not in sample or not all("code" in o for o in choice["options"]):
            errors.append("level 5 shows a chart and offers programs")
        for o in choice["options"]:
            if len(o["code"]["python"].rstrip("\n").split("\n")) > 9:
                errors.append("a program of more than 9 lines of Python")
            if any(len(row) > 34 for lang in ("python", "cpp") for row in o["code"][lang].split("\n")):
                errors.append("a line of more than 34 characters")
    else:
        if sample["answer"]["kind"] != "chart" or not all("chart" in o for o in choice["options"]):
            errors.append("level 6 asks for a chart and offers charts")
    return errors, params["case"]
