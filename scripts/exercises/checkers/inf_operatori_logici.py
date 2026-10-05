"""Checker for inf-operatori-logici (specs/exercises/inf-operatori-logici.md).

Written from the spec. Conditions written as in the flowcharts (E, O, NON) are evaluated here by Python; programs
are run by Python (checkers/_inf_programmi.py); the task is read from its words (checkers/_inf_sel.py):
- level 1: of four expressions or conditions exactly one has the value asked for, with the values of the sample; or
  the number of rows of a truth table where an expression is true;
- level 2: a program with a compound condition; the right option is what it writes on the input of the question, or
  the only input of the four on which it writes the text asked for;
- level 3: an interval (or its outside) in words and four programs;
- level 4: of four conditions only the right one is true exactly where the original is false, on a grid of values
  around every number of the condition;
- level 5: a chart to build, with a multiple choice of programs; level 6: a program to write.
"""
import itertools
import re

from checkers._inf_programmi import choice_of, common
from checkers._inf_sel import all_options, check_compound, check_edges, check_input_choice, check_open, check_options, check_said, check_written, one_of_four, reads, selections, value

MIXED = {"e": (0.22, 0.38), "o": (0.37, 0.53), "intervallo": (0.18, 0.32)}
CASE_RANGES = {
    1: {"tabella": (0.22, 0.38), "valori": (0.27, 0.43), "precedenza": (0.13, 0.27), "righe": (0.09, 0.21)},
    2: {"precedenza": (0.13, 0.27)},
    3: {"intervallo": (0.55, 0.75), "o": (0.25, 0.45)},
    4: {"confronto": (0.18, 0.32), "e": (0.30, 0.52), "o": (0.24, 0.46)},
    5: MIXED,
    6: MIXED,
}


def family_of(source):
    condition = re.search(r"^se (.*)$", source, re.M).group(1)
    both, either = bool(re.search(r"\bE\b", condition)), bool(re.search(r"\bO\b", condition))
    if both and either:
        return "precedenza"
    if either:
        return "o"
    return "intervallo" if len(reads(source)) == 1 else "e"


def check_text(sample):
    params = sample["params"]
    choice = choice_of(sample)
    case = params["case"]
    if case == "righe":
        n = sum(1 for a, b in itertools.product((True, False), repeat=2) if value(params["expression"], {"A": a, "B": b}))
        errors = [] if choice["options"][choice["correct"]]["values"][0] == str(n) else [f"the expression is true in {n} rows"]
        if params["expression"] not in sample["problem"] or not sample["problem"].endswith("In quante righe l'espressione è vera?"):
            errors.append("the problem does not show the expression and ask where it is true")
        return errors
    env = params["env"]
    errors = one_of_four(choice, params["ask"], lambda c: value(c, env))
    errors += check_said(sample, env, params["ask"])
    if (len(env) == 3) != (case == "precedenza") or (case == "valori") != (not isinstance(next(iter(env.values())), bool)):
        errors.append("the case does not match the values")
    return errors


def check_negation(sample):
    params = sample["params"]
    choice = choice_of(sample)
    original = params["original"]
    if original not in sample["problem"].replace("\\", "") or "è vera esattamente quando questa è falsa?" not in sample["problem"]:
        return ["the problem does not show the condition and ask for its negation"]
    numbers = sorted({int(n) for n in re.findall(r"\d+", original)})
    near = sorted({n + d for n in numbers for d in (-2, -1, 0, 1, 2)})
    grid = [dict(zip(params["names"], combo)) for combo in itertools.product(near, repeat=len(params["names"]))]
    errors = []
    for i, o in enumerate(choice["options"]):
        truths = [(value(o["values"][0], env), value(original, env)) for env in grid]
        if any(a is None for a, _ in truths):
            errors.append(f"option {i} is not a condition")
            continue
        negation = all(a != b for a, b in truths)
        if negation != (i == choice["correct"]):
            errors.append(f"option {i} {'is' if negation else 'is not'} the negation")
    joins = [j for j in ("E", "O") if re.search(rf"\b{j}\b", original)]
    case = "confronto" if not joins else joins[0].lower()
    if case != params["case"] or len(joins) > 1:
        errors.append("the case does not match the condition")
    return errors


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    if level == 1:
        return errors + check_text(sample), params["case"]
    if level == 4:
        return errors + check_negation(sample), params["case"]
    source = params["source"]
    family = family_of(source)
    if selections(source) != 1 or "altrimenti" not in source:
        errors.append("the reference program is not one two-way selection")
    if family != params["case"]:
        errors.append(f"the case is {params['case']}, the program is {family}")
    errors += check_edges(sample) + check_options(sample)
    if level == 2:
        if "code" not in sample:
            errors.append("level 2 shows a program")
        if params["ask"] == "scrive":
            errors += check_written(sample)
        else:
            errors += check_input_choice(sample)
        return errors, family if family == "precedenza" else None
    if family == "precedenza":
        errors.append("a condition with E and O together where the task is in words")
    errors += check_compound(sample["problem"], source)
    if not all_options(sample, "code"):
        errors.append("the options are not programs")
    if level == 3 and (family == "e" or "code" in sample or "chart" in sample):
        errors.append("level 3 is an interval or its outside, in words")
    if level == 5:
        errors += check_open(sample, "chart")
    if level == 6:
        errors += check_open(sample, "program")
    return errors, family
