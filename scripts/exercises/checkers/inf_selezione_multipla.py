"""Checker for inf-selezione-multipla (specs/exercises/inf-selezione-multipla.md).

Written from the spec. Every program is run by Python (checkers/_inf_programmi.py), and the task is read from its
words and tried on the reference program (checkers/_inf_sel.py):
- level 1: two nested selections (sign, or which of two numbers is larger), as a chart or as a program; the right
  option is what it writes on the input of the question;
- level 2: a cascade of three or four bands, as a program; the same;
- level 3: a program shown as it is (conditions in the wrong order, an `if` on every row, or right) beside what it
  was meant to do: the right option is what the program shown writes, and where there is a mistake the input shows
  it;
- level 4: the task in words and four programs of three ways;
- level 5: a chart to complete, starting from the first selection, with a multiple choice of programs;
- level 6: a program to write.
"""
import re

from checkers._inf_programmi import choice_of, common, run_chart
from checkers._inf_sel import all_options, check_bands, check_duel, check_edges, check_open, check_options, check_sign, check_written, reads, selections

FAMILIES = {"fasce": (0.42, 0.58), "segno": (0.18, 0.32), "confronto": (0.18, 0.32)}
CASE_RANGES = {
    1: {"segno": (0.42, 0.58), "confronto": (0.42, 0.58)},
    2: {"confine": (0.52, 0.68)},
    3: {"ordine": (0.32, 0.48), "tanti-if": (0.32, 0.48), "giusto": (0.13, 0.27)},
    4: FAMILIES,
    5: FAMILIES,
    6: FAMILIES,
}
TASKS = {"fasce": check_bands, "segno": check_sign, "confronto": check_duel}


def family_of(source):
    if len(reads(source)) == 2:
        return "confronto"
    return "segno" if re.search(r"[<>] 0$", source, re.M) else "fasce"


def nested(source):
    """Every selection after the first sits in the "no" of the one before: one more step to the right each."""
    depths = [len(m.group(1)) for m in re.finditer(r"^(\s*)se\s", source, re.M)]
    return depths == [4 * i for i in range(len(depths))] and source.count("altrimenti") == len(depths)


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    source = params["source"]
    choice = choice_of(sample)
    errors += check_options(sample)
    if level == 3:
        intended = params["intended"]
        errors += check_written(sample) + check_bands(sample["problem"], intended)
        if not nested(intended):
            errors.append("what the program was meant to be is not a cascade")
        kind = params["case"]
        here, meant = run_chart(source, params["input"]), run_chart(intended, params["input"])
        if kind == "giusto":
            if source != intended:
                errors.append("the program shown is not the right one")
        else:
            if here == meant:
                errors.append("the input does not show the mistake")
            if kind == "tanti-if" and ("altrimenti" in source or selections(source) != selections(intended) + 1):
                errors.append("not an if on every row")
            if kind == "ordine" and (not nested(source) or source == intended or sorted(re.findall(r"se (.*)", source)) != sorted(re.findall(r"se (.*)", intended))):
                errors.append("not the same cascade in another order")
        if "code" not in sample:
            errors.append("level 3 shows a program")
        if choice["options"][choice["correct"]]["values"][0] != "\n".join(here or []):
            errors.append("the right option is not what the program shown writes")
        return errors, kind
    family = family_of(source)
    if not nested(source):
        errors.append("the reference program is not a cascade")
    errors += check_edges(sample)
    if level in (1, 2):
        errors += check_written(sample)
        ways = selections(source) + 1
        if level == 1 and (family == "fasce" or ways != 3 or ("code" in sample) == ("chart" in sample)):
            errors.append("level 1 is two nested selections, shown as a chart or as a program")
        if level == 2 and (family != "fasce" or ways not in (3, 4) or "code" not in sample):
            errors.append("level 2 is a cascade of bands, shown as a program")
        if level == 2 and (params["case"] == "confine") != (params["input"] in params["edge"]):
            errors.append("the case does not say whether the input is a threshold")
        return errors, params["case"]
    if params["case"] != family:
        errors.append(f"the case is {params['case']}, the program is {family}")
    if selections(source) != 2:
        errors.append("not three ways")
    errors += TASKS[family](sample["problem"], source)
    if not all_options(sample, "code"):
        errors.append("the options are not programs")
    if level == 4 and ("code" in sample or "chart" in sample):
        errors.append("level 4 gives the task in words")
    if level == 5:
        errors += check_open(sample, "chart")
        start = sample["answer"].get("start", "")
        first = re.search(r"^se .*$", source, re.M).group(0)
        if first not in start or selections(start) != 1:
            errors.append("the chart to start from is not the first selection")
    if level == 6:
        errors += check_open(sample, "program")
    return errors, family
