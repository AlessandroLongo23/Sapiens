"""Checker for insiemi-rappresentazione, from specs/exercises/insiemi-rappresentazione.md.

The property in params is re-rendered (it must be exactly the problem) and its elements are found
by trying every integer in a wide range, not by solving; the answer and every set option are
compared with that enumeration.
"""
import json

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    els,
    prop_elements,
    prop_tex,
    prop_tex_split,
    prose,
    set_answer_errors,
    set_option_truth,
    set_tex,
)

CASE_RANGES = {
    4: {"vuoto": (0.08, 0.25), "non vuoto": (0.75, 0.92)},
}

WORDS = {"pari", "dispari", "mult", "div"}


def problem_tex(prop):
    """A = {x in N | x è multiplo di k e a <= x <= b} does not fit a phone on one line (380 px of 350):
    that one goes on two, broken before the "e". Every other property stays on one line."""
    cs = prop["conds"]
    if len(cs) == 2 and cs[0]["t"] == "mult" and cs[1]["t"] == "range" and cs[1].get("lo") is not None and cs[1].get("hi") is not None:
        return prop_tex_split(prop, "A = ")
    return f"A = {prop_tex(prop)}"


def option_tex(prop):
    """Level 5 options: a property with two conditions on two lines, the others on one."""
    return prop_tex_split(prop) if len(prop["conds"]) == 2 else prop_tex(prop)


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    kind = None
    if lvl == 5:
        E = els(p["E"])
        if f"E = {set_tex(E)}" not in sample["problem"]:
            errs.append("problem does not show E")
        if "Quale proprietà caratteristica descrive $E$?" not in prose(sample["problem"]):
            errs.append("problem does not ask for the property")
        if not 2 <= len(E) <= 10:
            errs.append(f"E has {len(E)} elements")

        def grade(o):
            prop = json.loads(o["values"][0])
            if o["latex"] != option_tex(prop):
                raise ValueError(f"latex {o['latex']} != {option_tex(prop)}")
            return set(prop_elements(prop)) == set(E)

        errs += choice_errors(ans, grade)
        return errs, None

    prop = p["prop"]
    truth = prop_elements(prop)
    if sample["problem"] != problem_tex(prop):
        errs.append(f"problem {sample['problem']} != {problem_tex(prop)}")
    errs += set_answer_errors(sample, truth)
    if len(truth) > 10:
        errs.append(f"{len(truth)} elements, more than 10")
    ts = [c["t"] for c in prop["conds"]]
    if lvl == 1:
        if prop["dom"] != "N" or ts != ["range"] or not truth:
            errs.append("level 1: only extremes in N, non-empty set")
    elif lvl == 2:
        if prop["dom"] != "N" or not WORDS & set(ts) or not truth:
            errs.append("level 2: even, odd, multiples or divisors in N")
    elif lvl == 3:
        other = dict(prop, dom="Z" if prop["dom"] == "N" else "N")
        if set(prop_elements(other)) == set(truth):
            errs.append("level 3: N and Z give the same set")
    elif lvl == 4:
        if prop["dom"] != "N" or ts != ["lin"] or int(prop["conds"][0]["a"]) < 1:
            errs.append("level 4: one condition a x + b rel c in N, a >= 1")
        kind = "vuoto" if not truth else "non vuoto"
    else:
        errs.append(f"unknown level {lvl}")
    if sample.get("choice") is None:
        errs.append("no choice variant")
    else:
        errs += choice_errors(sample["choice"], set_option_truth(truth))
    return errs, kind
