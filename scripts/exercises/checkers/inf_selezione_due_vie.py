"""Checker for inf-selezione-due-vie (specs/exercises/inf-selezione-due-vie.md).

Written from the spec. Every program is run by Python (checkers/_inf_programmi.py), and the task is read from its
words and tried on the reference program (checkers/_inf_sel.py):
- level 1: a one-way selection shown as a program; the right option is what it writes on the input of the question;
- level 2: a two-way selection shown as a program or as a chart; the same;
- level 3: the task in words and four programs, of which only the right one does what the reference does;
- level 4: a program and four charts;
- level 5: a chart to build, tried on both branches and on the boundary value; the multiple choice is of charts;
- level 6: a program to write, tried the same way; the multiple choice is of programs.
"""
import re

from checkers._inf_programmi import choice_of, common
from checkers._inf_sel import all_options, check_edges, check_larger, check_one_way, check_open, check_options, check_remainder, check_tariff, check_threshold, check_written, reads, selections

FAMILIES = {"una-via": (0.24, 0.36), "due-vie": (0.15, 0.27), "tariffa": (0.12, 0.23), "resto": (0.12, 0.23), "maggiore": (0.09, 0.19)}
NARROW = {"una-via": (0.33, 0.47), "tariffa": (0.33, 0.47), "maggiore": (0.14, 0.26)}
CASE_RANGES = {1: {"confine": (0.42, 0.58)}, 2: {"confine": (0.42, 0.58)}, 3: FAMILIES, 4: NARROW, 5: FAMILIES, 6: FAMILIES}

TASKS = {"una-via": check_one_way, "due-vie": check_threshold, "tariffa": check_tariff, "resto": check_remainder, "maggiore": check_larger}


def family_of(source):
    """The family of a selection, from its shape."""
    if "altrimenti" not in source:
        return "una-via"
    if "%" in source:
        return "resto"
    if len(reads(source)) == 2:
        return "maggiore"
    return "due-vie" if '"' in source else "tariffa"


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    source = params["source"]
    choice = choice_of(sample)
    if selections(source) != 1:
        errors.append("the reference program has not one selection")
    errors += check_edges(sample) + check_options(sample)
    family = family_of(source)
    if level in (1, 2):
        errors += check_written(sample)
        if (family == "una-via") != (level == 1):
            errors.append("level 1 is a one-way selection, level 2 a two-way one")
        if (params["case"] == "confine") != (params["input"] in params["edge"]):
            errors.append("the case does not say whether the input is a boundary value")
        if level == 1 and "code" not in sample:
            errors.append("level 1 shows a program")
        if level == 2 and ("code" in sample) == ("chart" in sample):
            errors.append("level 2 shows a program or a chart")
        return errors, params["case"]
    if params["case"] != family:
        errors.append(f"the case is {params['case']}, the program is {family}")
    # the task in words: in the problem, except in level 4, which shows the program instead
    if level != 4:
        errors += TASKS[family](sample["problem"], source)
    if level == 3 and ("code" in sample or "chart" in sample or not all_options(sample, "code")):
        errors.append("level 3 gives the task in words and offers programs")
    if level == 4 and ("code" not in sample or not all_options(sample, "chart")):
        errors.append("level 4 shows a program and offers charts")
    if level == 5:
        errors += check_open(sample, "chart")
        # charts, or programs where the charts would not fit a phone: long texts on the two branches
        if not all_options(sample, "chart") and not (all_options(sample, "code") and family in ("due-vie", "resto")):
            errors.append("level 5 offers charts, or programs for the selections with a text on each branch")
    if level == 6:
        errors += check_open(sample, "program")
        if not all_options(sample, "code"):
            errors.append("level 6 offers programs")
        if not re.search(r"input\(\)", sample["answer"]["start"]["python"]):
            errors.append("the program to start from has no reading")
    if len(choice["options"]) != 4:
        errors.append("not four options")
    return errors, family
