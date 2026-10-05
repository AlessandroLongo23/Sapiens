"""Checker for inf-pseudocodice (specs/exercises/inf-pseudocodice.md).

Written from the spec and the lesson. The pseudocode of a chart is written again here, line by line, from the
program in params; charts are run by Python:
- level 1: the line that says an action is rebuilt from the pieces in params (the variable, the number, the word);
- level 2: quotient and remainder are computed here;
- level 3: the line of the rhombus (se for a selection, finché for a loop) or of the first rectangle of the chart;
- level 4: the indented lines and all the lines of the pseudocode of the chart, counted here;
- level 5: the last line is indented here like the one above it, the copy is run, and what it writes on the inputs
  of the question is the right option; it must differ from what the original writes;
- level 6: the question carries the pseudocode of the solution, on one line; the chart of the solution passes its
  tests; of the four charts only the right one does.
"""
import re

from checkers._inf_alg import base, right_of, structure_of
from checkers._inf_programmi import choice_of, run_chart

KINDS = ["assegna", "leggi", "scrivi testo", "scrivi valore", "selezione", "ripetizione"]
L3 = ["sconto", "spedizione", "tetto", "quiz", "divisibile", "rovescia", "somma", "multipli", "risparmio", "divisioni", "traguardo"]
L4 = ["sconto", "spedizione", "soglia", "tetto", "rovescia", "somma", "multipli", "traguardo", "ripeti", "bum", "sufficienti", "euclide"]
L5 = ["rovescia", "somma", "traguardo", "risparmio", "divisioni", "addizioni", "sconto", "tetto", "quiz"]
L6 = ["divisibile", "rovescia", "multipli", "sconto", "somma", "soglia", "divisioni", "spedizione"]
CASE_RANGES = {
    1: {k: (0.11, 0.23) for k in KINDS},
    2: {"div": (0.42, 0.58), "mod": (0.42, 0.58)},
    3: {k: (0.04, 0.16) for k in L3},
    4: {k: (0.03, 0.15) for k in L4},
    5: {k: (0.07, 0.22) if k in L5[:6] else (0.02, 0.13) for k in L5},
    6: {k: (0.07, 0.19) for k in L6},
}

SAID = {">": "è maggiore di", "<": "è minore di", "≥": "è maggiore o uguale a", "≤": "è minore o uguale a", "=": "è uguale a", "≠": "è diverso da"}
SIGNS = {"+": "più", "−": "meno", "·": "per"}
WORD = re.compile(r"^(leggi|scrivi|se|finché|altrimenti)(?=\s|$)")


def pseudo(row):
    """A line of the program of a chart as the lesson writes it in pseudocode."""
    text = row.strip()

    def signs(s):
        parts = re.split(r'("[^"]*")', s)
        for i in range(0, len(parts), 2):
            for a, b in (("<=", "≤"), (">=", "≥"), ("!=", "≠"), ("==", "="), ("*", "·"), ("//", "div"), ("%", "mod"), ("-", "−")):
                parts[i] = parts[i].replace(a, b)
        return "".join(parts)

    if WORD.match(text):
        return signs(text)
    name, value = text.split(" = ", 1)
    return f"{name} ← {signs(value)}"


def rows_of(source):
    return [r for r in source.split("\n") if r.strip()]


def level1(sample, errors):
    p = sample["params"]
    v, k, w, op = p.get("v"), p.get("k"), p.get("w"), p.get("op")
    kind = p["case"]
    if kind == "assegna":
        if not p["plain"] and p["sign"] not in SIGNS:
            errors.append("unknown sign")
            return
        expr = str(k) if p["plain"] else f"{v} {p['sign']} {k}"
        action = f"mettere {k} nella variabile {v}" if p["plain"] else f"calcolare {v} {SIGNS[p['sign']]} {k} e mettere il risultato in {v}"
        row = f"{v} ← {expr}"
    elif kind == "leggi":
        action, row = f"chiedere un valore e metterlo nella variabile {v}", f"leggi {v}"
    elif kind == "scrivi testo":
        action, row = f"mostrare la parola {w}", f'scrivi "{w}"'
    elif kind == "scrivi valore":
        action, row = f"mostrare il valore della variabile {v}", f"scrivi {v}"
    elif kind == "selezione":
        action, row = f"solo se {v} {SAID[op]} {k}", f"se {v} {op} {k}"
    elif kind == "ripetizione":
        action, row = f"finché {v} {SAID[op]} {k}", f"finché {v} {op} {k}"
    else:
        errors.append("unknown case")
        return
    if action not in sample["problem"]:
        errors.append("the question does not say the action")
    if right_of(sample)["latex"] != row:
        errors.append(f"the line is «{row}»")


def level2(sample, errors):
    p = sample["params"]
    a, b = p["a"], p["b"]
    if not (2 <= b <= 9 and a % b != 0 and a > b):
        errors.append("the numbers are out of the constraints")
    value = a // b if p["case"] == "div" else a % b
    if f"{a} {p['case']} {b}" not in sample["problem"]:
        errors.append("the question does not show the operation")
    if right_of(sample)["latex"] != str(value):
        errors.append(f"{a} {p['case']} {b} is {value}")


def level3(sample, errors):
    p = sample["params"]
    rows = rows_of(p["source"])
    if p["ask"] == "rombo":
        marked = [r for r in rows if re.match(r"(se|finché)\s", r)]
        if len(marked) != 1:
            errors.append("the chart has not exactly one rhombus")
            return
        row = pseudo(marked[0])
        word = "finché" if structure_of(p["source"]) == "iterazione" else "se"
        if not row.startswith(word + " ") or "rombo" not in sample["problem"]:
            errors.append("the line of the rhombus has the wrong word")
    elif p["ask"] == "rettangolo":
        row = pseudo(next(r for r in rows if not WORD.match(r.strip())))
        if "primo rettangolo" not in sample["problem"]:
            errors.append("the question does not say which rectangle")
    else:
        errors.append("unknown question")
        return
    if right_of(sample)["latex"] != row:
        errors.append(f"the line is «{row}»")
    if "chart" not in sample:
        errors.append("the chart is not shown")


def level4(sample, errors):
    p = sample["params"]
    rows = rows_of(p["source"])
    if p["ask"] == "rientrate":
        value = sum(1 for r in rows if r.startswith(" "))
        asked = "rientrate" in sample["problem"]
    else:
        value = len(rows) + 2
        asked = '"inizio" e "fine"' in sample["problem"]
    if not asked:
        errors.append("the question does not ask what params says")
    if right_of(sample)["latex"] != str(value):
        errors.append(f"the count is {value}")
    if "chart" not in sample:
        errors.append("the chart is not shown")


def level5(sample, errors):
    p = sample["params"]
    rows = rows_of(p["source"])
    above = rows[-2]
    indent = above[: len(above) - len(above.lstrip())]
    if not indent or rows[-1].startswith(" "):
        errors.append("the last line is not after a structure")
        return
    copy = "\n".join(rows[:-1] + [indent + rows[-1].strip()]) + "\n"
    inputs = p["inputs"]
    written = run_chart(copy, inputs)
    if written is None or len(written) > 9:
        errors.append("the copy does not end, or writes too much")
        return
    if written == run_chart(p["source"], inputs):
        errors.append("on these inputs the copy writes what the original does")
    if right_of(sample)["values"][0] != "\n".join(written):
        errors.append(f"the copy writes {written}")
    if f"«{pseudo(rows[-1])}»" not in sample["problem"] or "chart" not in sample:
        errors.append("the question does not show the line or the chart")
    for x in inputs:
        if not re.search(rf"(?<!\d){x}(?!\d)", sample["problem"].split("ricopiato")[1]):
            errors.append(f"the question does not say the input {x}")
    if p["tests"][0] != inputs:
        errors.append("the inputs asked are not the first test")


def level6(sample, errors):
    p = sample["params"]
    rows = rows_of(p["source"])
    if any(r.startswith("     ") for r in rows):
        errors.append("a pseudocode on one line cannot show two levels of indentation")
    line = " / ".join(["inizio"] + [("► " if r.startswith(" ") else "") + pseudo(r) for r in rows] + ["fine"])
    if line not in sample["problem"]:
        errors.append("the question does not carry the pseudocode of the solution")
    choice = choice_of(sample)
    if sample["answer"]["kind"] != "chart" or not all("chart" in o for o in choice["options"]):
        errors.append("level 6 asks for a chart and offers charts")


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample)
    if level >= 3 and params["family"] not in {3: L3, 4: L4, 5: L5, 6: L6}[level]:
        errors.append(f"the family {params['family']} is not of this level")
    [level1, level2, level3, level4, level5, level6][level - 1](sample, errors)
    return errors, params["case"]
