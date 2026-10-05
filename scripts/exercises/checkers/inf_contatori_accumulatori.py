"""Checker for inf-contatori-accumulatori (specs/exercises/inf-contatori-accumulatori.md).

Written from the spec. The count, the sum and the product are worked out here from the data in `params.tests` and
from the condition in `params.cond`, with Python's own arithmetic, and compared with the right option and with what
the reference program writes when Python runs it (checkers/_inf_programmi.py):
- level 1: how many data satisfy the condition; level 2: their sum, or the sum of all; level 3: a product;
- level 4: the program shown has a mistake: it writes something else than the program meant, which is in
  `params.intended`, and what the meant one writes is among the wrong options;
- level 5: a chart to build, with one loop and no selection; level 6: a program to write, with a test where no
  datum satisfies the condition.
"""
import math
import re

from checkers._inf_iter import heads_and_width, is_for, open_tests
from checkers._inf_programmi import choice_of, common, run_chart

CONTEXTS = ["voti", "gradi", "punti", "eta", "costo", "pari", "multipli"]
BUGS = ["azzerato", "fuori", "zero", "uno", "sovrascritto"]
TOTALS = ["somma", "prodotto", "potenza", "fattoriale"]
CASE_RANGES = {
    1: {c: (0.08, 0.21) for c in CONTEXTS},
    2: {"tutto": (0.4, 0.6), "parte": (0.4, 0.6)},
    3: {"fattoriale": (0.25, 0.42), "potenza": (0.25, 0.42), "prodotto": (0.25, 0.42)},
    4: {b: (0.1, 0.3) for b in BUGS},
    5: {t: (0.18, 0.32) for t in TOTALS},
    6: {"conta": (0.5, 0.7), "somma": (0.3, 0.5)},
}
INT_MAX = 2**31 - 1
COND = re.compile(r"[a-z]+ (>=|>|<=|<|% \d+ [!=]=) -?\d+")


def holds(p, x):
    if not COND.fullmatch(p["cond"]) or not p["cond"].startswith(p["v"] + " "):
        raise ValueError(f"not a condition on {p['v']}: {p['cond']}")
    return eval(p["cond"], {}, {p["v"]: x})


def data_of(inputs):
    """The data of a run that reads n first: n must be how many follow."""
    if inputs[0] != len(inputs) - 1:
        raise ValueError(f"n is {inputs[0]} and the data are {len(inputs) - 1}")
    return inputs[1:]


def total(kind, inputs):
    if kind == "fattoriale":
        return math.factorial(inputs[0])
    if kind == "potenza":
        return inputs[0] ** inputs[1]
    return sum(data_of(inputs)) if kind == "somma" else math.prod(data_of(inputs))


def check(sample):
    errors = common(sample)
    p = sample["params"]
    level = sample["level"]
    case = p["case"]
    tests = p["tests"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    errors += heads_and_width(sample, choice)
    shown = sample.get("code")
    if level <= 4 and not (shown and is_for(shown)):
        errors.append("the program is not shown with a for")
    if any(not all(isinstance(x, int) for x in t) for t in tests):
        errors.append("a datum is not a whole number")

    if level in (1, 2, 3):
        inputs = tests[0]
        if level == 1:
            data = data_of(inputs)
            want = sum(1 for x in data if holds(p, x))
            if not (4 <= len(data) <= 6 and 1 <= want <= len(data) - 1):
                errors.append("from 4 to 6 data, some that satisfy the condition and some that do not")
        elif level == 2:
            data = data_of(inputs)
            if (case == "parte") != (p["cond"] is not None):
                errors.append("only the sum of a part has a condition")
            want = sum(x for x in data if p["cond"] is None or holds(p, x))
        else:
            want = total(case, inputs)
            if case == "fattoriale" and not 3 <= inputs[0] <= 10:
                errors.append("a factorial from 3 to 10")
        if abs(want) > INT_MAX:
            errors.append("the result does not fit an int")
        if run_chart(p["source"], inputs) != [str(want)]:
            errors.append(f"the reference does not write {want}")
        if right["values"][0] != str(want):
            errors.append(f"the right option is not {want}")

    if level == 4:
        if case not in BUGS:
            errors.append(f"unknown mistake {case}")
        got = run_chart(p["source"], tests[0])
        meant = run_chart(p["intended"], tests[0])
        if got is None or meant is None or got == meant:
            errors.append("the mistake does not change what the program writes")
        else:
            if right["values"][0] != "\n".join(got):
                errors.append("the right option is not what the program with the mistake writes")
            if "\n".join(meant) not in [o["values"][0] for i, o in enumerate(choice["options"]) if i != choice["correct"]]:
                errors.append("what the program should write is not among the wrong options")
            if case == "zero" and got != ["0"]:
                errors.append("a product that starts from 0 writes 0")

    if level == 5:
        if case not in TOTALS:
            errors.append(f"unknown total {case}")
        want = [(t, [total(case, t)]) for t in tests]
        errors += open_tests(sample, want)
        if sample["answer"]["kind"] != "chart":
            errors.append("level 5 asks for a chart")
        for o in choice["options"]:
            source = o.get("chart", "")
            if len(re.findall(r"^\s*finché ", source, re.M)) != 1 or re.search(r"^\s*se ", source, re.M):
                errors.append("an option is not a chart with one loop and no selection")
        if len({tuple(lines) for _, lines in want}) < 2:
            errors.append("the tests write the same")

    if level == 6:
        want = []
        hits = []
        for t in tests:
            data = data_of(t)
            taken = [x for x in data if holds(p, x)]
            hits.append(len(taken))
            want.append((t, [len(taken) if case == "conta" else sum(taken)]))
        errors += open_tests(sample, want)
        if 0 not in hits or not any(0 < h < t[0] for h, t in zip(hits, tests)):
            errors.append("a test where no datum satisfies the condition and one where some do are needed")
        if sample["answer"]["kind"] != "program" or not is_for(sample["answer"]["solution"]):
            errors.append("level 6 asks for a program, solved with a for")
        if not all("code" in o and is_for(o["code"]) for o in choice["options"]):
            errors.append("level 6 offers programs with a for")
    return errors, case
