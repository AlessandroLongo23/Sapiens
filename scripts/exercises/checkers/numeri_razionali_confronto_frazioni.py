"""Checker for numeri-razionali-confronto-frazioni, from specs/exercises/numeri-razionali-confronto-frazioni.md.

The fractions are read back from the problem LaTeX and every option is parsed from its LaTeX, so the
check is on what the student sees. Order and equivalence are decided with SymPy Rationals.
"""
import re
from math import gcd, lcm

from sympy import Rational

from verify import rat

FRAC = r"(-?)\\frac\{(\d+)\}\{(\d+)\}"


def parse_frac(s):
    s = s.strip()
    m = re.fullmatch(FRAC, s)
    if not m:
        return None
    n, d = int(m.group(2)), int(m.group(3))
    return (-n if m.group(1) else n, d)


def value(f):
    return Rational(f[0], f[1])


CASE_RANGES = {
    2: {"positive": (0.45, 0.75), "negative": (0.10, 0.30), "miste": (0.10, 0.30)},
    5: {"tutte negative": (0.35, 0.65), "miste": (0.35, 0.65)},
}


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    parts = sample["problem"].split(r",\quad ")
    fs = [parse_frac(x) for x in parts]
    if any(f is None for f in fs):
        return [f"problem not a list of fractions: {sample['problem']}"], None
    if [f"{n}/{d}" for n, d in fs] != p.get("fractions"):
        errs.append("problem differs from params.fractions")
    for n, d in fs:
        if d < 2 or gcd(abs(n), d) != 1:
            errs.append(f"fraction {n}/{d} not reduced or integer")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    if sample.get("choice") is not None and sample["choice"] != ans:
        errs.append("choice differs from answer")
    idx = ans["correct"]
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        return errs + ["correct index out of range"], None
    vals = [value(f) for f in fs]
    kind = None
    if lvl == 1:
        (a, b), = fs
        target = Rational(a, b)
        if not (1 <= a and 2 <= b <= 10):
            errs.append("level 1: target out of range")
        shown = [parse_frac(o["latex"]) for o in opts]
        if any(s is None for s in shown):
            return errs + ["option not a fraction"], None
        for o, s in zip(opts, shown):
            if value(s) != rat(o["values"][0]):
                errs.append(f"option {o['latex']} value mismatch")
        eq = [i for i, s in enumerate(shown) if s[0] * b == s[1] * a]  # cross product
        if eq != [idx]:
            errs.append(f"equivalent options {eq}, correct {idx}")
        if shown[idx] == (a, b):
            errs.append("correct option is the given fraction itself")
        if len({value(s) for s in shown}) != 4 or len({o["latex"] for o in opts}) != 4:
            errs.append("options not distinct")
        if any(value(s).q == 1 for s in shown):
            errs.append("option with an integer value")
    elif lvl in (2, 3, 4, 5):
        ask = p.get("ask")
        if ask not in ("maggiore", "minore") or ask not in sample["prompt"]:
            errs.append("prompt must ask maggiore or minore")
        if len(set(vals)) != 4:
            errs.append("need four different fractions")
        shown = [parse_frac(o["latex"]) for o in opts]
        if any(s is None for s in shown) or sorted(shown) != sorted(fs):
            errs.append("options are not the given fractions")
        else:
            for o, s in zip(opts, shown):
                if value(s) != rat(o["values"][0]):
                    errs.append("option value mismatch")
            best = max(vals) if ask == "maggiore" else min(vals)
            if value(shown[idx]) != best:
                errs.append(f"correct option {shown[idx]} is not the {ask}")
        nums = {n for n, _ in fs}
        dens = {d for _, d in fs}
        if lvl == 2:
            if len(dens) != 1:
                errs.append("level 2: same denominator")
            negs = sum(1 for n, _ in fs if n < 0)
            kind = "positive" if negs == 0 else "negative" if negs == 4 else "miste"
        elif lvl == 3:
            if len(nums) != 1 or min(nums) < 1:
                errs.append("level 3: same positive numerator")
        elif lvl == 4:
            if len(nums) != 4 or len(dens) != 4 or min(nums) < 1:
                errs.append("level 4: positive, all numerators and denominators different")
            # comparing numerators only must give the wrong answer
            by_num = max(fs) if ask == "maggiore" else min(fs)
            best = max(vals) if ask == "maggiore" else min(vals)
            if value(by_num) == best:
                errs.append("level 4: the largest/smallest numerator already gives the answer")
            if lcm(*dens) > 120:
                errs.append("level 4: MCM > 120")
        else:
            negs = sum(1 for n, _ in fs if n < 0)
            if negs < 2:
                errs.append("level 5: at least two negatives")
            if negs < 4 and ask != "minore":
                errs.append("level 5: mixed signs must ask the least")
            kind = "tutte negative" if negs == 4 else "miste"
    elif lvl == 6:
        truth = sorted(vals)
        if sum(1 for n, _ in fs if n < 0) < 2:
            errs.append("level 6: at least two negatives")
        orders = []
        for o in opts:
            items = [parse_frac(x) for x in o["latex"].split(" < ")]
            if any(i is None for i in items) or sorted(items) != sorted(fs):
                errs.append(f"option {o['latex']} is not an order of the given fractions")
                continue
            if [value(i) for i in items] != [rat(v) for v in o["values"]]:
                errs.append("option values differ from its latex")
            orders.append(tuple(value(i) for i in items))
        if len(set(orders)) != len(opts):
            errs.append("options not distinct")
        right = [i for i, o in enumerate(orders) if list(o) == truth]
        if right != [idx]:
            errs.append(f"ascending options {right}, correct {idx}")
    else:
        errs.append(f"unknown level {lvl}")
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind
