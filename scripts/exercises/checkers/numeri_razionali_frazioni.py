"""Checker for numeri-razionali-frazioni, from specs/exercises/numeri-razionali-frazioni.md.

Everything is read back from the LaTeX the student sees (the problem and the option labels) and
recomputed with SymPy Rationals; params are only compared with it. The level 4 check decides
equivalence by comparing values, not with the cross product the generator uses.
"""
import re
from math import gcd

from sympy import Rational, factorint

FRAC = r"\\frac\{(-?\d+)\}\{(-?\d+)\}"


def frac(s):
    m = re.fullmatch(FRAC, s.strip())
    return (int(m.group(1)), int(m.group(2))) if m else None


def answer_frac(s):
    """An option at levels 5-6: '7', '-\\frac{3}{4}', '\\frac{3}{4}', '\\frac{3}{-4}' -> (n, d, minus_in_front)."""
    s = s.strip()
    if re.fullmatch(r"-?\d+", s):
        return int(s), 1, False
    front = s.startswith("-")
    f = frac(s[1:] if front else s)
    if f is None:
        return None
    n, d = f
    return (-n if front else n), d, front


CASE_RANGES = {
    3: {"propria": (0.15, 0.35), "impropria": (0.33, 0.57), "apparente": (0.20, 0.40)},
    6: {"numeratore negativo": (0.23, 0.43), "denominatore negativo": (0.23, 0.43), "entrambi negativi": (0.23, 0.43)},
}


def check_choice(sample, is_right, errs):
    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple-choice variant")
        return
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("options not distinct")
    right = [i for i, o in enumerate(opts) if is_right(o)]
    if right != [ch.get("correct")]:
        errs.append(f"right options {right}, correct {ch.get('correct')}")
    if sample["answer"].get("kind") == "choice" and sample["answer"] != ch:
        errs.append("choice differs from answer")


def proper_reduced(a, b):
    return 2 <= a < b <= 10 and gcd(a, b) == 1


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    prob = sample["problem"]
    kind = None
    if lvl == 1:
        m = re.fullmatch(FRAC + r" \\text\{ di \} (\d+)", prob)
        if not m:
            return [f"level 1: problem not 'a/b di N': {prob}"], None
        a, b, n = (int(g) for g in m.groups())
        if not proper_reduced(a, b):
            errs.append(f"level 1: {a}/{b} not proper and reduced with b <= 10")
        if n % b or n > 150:
            errs.append(f"level 1: {n} not a multiple of {b} up to 150")
        truth = Rational(a, b) * n
        if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
            errs.append(f"answer {ans.get('value')} != {truth}")
        check_choice(sample, lambda o: re.fullmatch(r"\d+", o["latex"]) and Rational(o["latex"]) == truth, errs)
    elif lvl == 2:
        fm = re.search(r"\$" + FRAC + r"\$", prob)
        nm = re.search(r"(?:sono|cioè) (\d+)", prob)
        if not fm or not nm:
            return [f"level 2: cannot read the fraction or the part: {prob}"], None
        a, b, part = int(fm.group(1)), int(fm.group(2)), int(nm.group(1))
        if not proper_reduced(a, b):
            errs.append(f"level 2: {a}/{b} not proper and reduced")
        whole = part / Rational(a, b)
        if not whole.is_integer or whole > 400:
            errs.append(f"level 2: whole {whole} not an integer up to 400")
        if "studenti" in prob and not 12 <= whole <= 32:
            errs.append(f"level 2: a class of {whole} students")
        if ans.get("kind") != "number" or Rational(ans["value"]) != whole:
            errs.append(f"answer {ans.get('value')} != {whole}")
        check_choice(sample, lambda o: re.fullmatch(r"\d+", o["latex"]) and Rational(o["latex"]) == whole, errs)
    elif lvl == 3:
        f = frac(prob)
        if not f:
            return [f"level 3: problem not a fraction: {prob}"], None
        n, d = f
        if n < 1 or not 2 <= d <= 12:
            errs.append("level 3: terms out of range")
        if n < d:
            kind, truth = "propria", "propria"
        elif n % d == 0:
            kind, truth = "apparente", f"apparente {n // d}"
        else:
            kind, truth = "impropria", f"impropria {n // d} {n // d + 1}"

        def label(o):
            s = o["latex"].replace("\\text{", "").replace("}", "").replace(",", "")
            return " ".join(w for w in s.split() if w not in ("tra", "e", "uguale", "a"))

        if p.get("case") != kind:
            errs.append(f"params.case {p.get('case')} but the fraction is {kind}")
        if ans.get("kind") != "choice":
            errs.append("level 3: answer must be a choice")
        for o in ans.get("options", []):
            lab = label(o)
            if not re.fullmatch(r"propria|apparente \d+|impropria (\d+) (\d+)", lab):
                errs.append(f"level 3: unreadable option {o['latex']}")
            m = re.fullmatch(r"impropria (\d+) (\d+)", lab)
            if m and int(m.group(2)) != int(m.group(1)) + 1:
                errs.append(f"level 3: option {o['latex']} not between consecutive integers")
        check_choice(sample, lambda o: label(o) == truth, errs)
    elif lvl == 4:
        if ans.get("kind") != "choice":
            return ["level 4: answer must be a choice"], None
        for o in ans["options"]:
            parts = o["latex"].split(r" \text{ e } ")
            fs = [frac(x) for x in parts]
            if len(fs) != 2 or any(f is None for f in fs):
                errs.append(f"level 4: option not a pair: {o['latex']}")
                continue
            if any(n < 1 or d < 2 for n, d in fs):
                errs.append(f"level 4: pair with a non-positive or integer term: {o['latex']}")
            if [f"{n}/{d}" for n, d in fs] != o["values"]:
                errs.append("level 4: option values differ from its latex")

        def equivalent(o):
            fs = [frac(x) for x in o["latex"].split(r" \text{ e } ")]
            return len(fs) == 2 and None not in fs and Rational(*fs[0]) == Rational(*fs[1]) and fs[0] != fs[1]

        check_choice(sample, equivalent, errs)
    elif lvl in (5, 6):
        f = frac(prob)
        if not f:
            return [f"level {lvl}: problem not a fraction: {prob}"], None
        n, d = f
        g = gcd(n, d)
        if g < 4 or sum(factorint(g).values()) < 2:
            errs.append(f"level {lvl}: MCD {g} is not composite")
        if max(abs(n), abs(d)) > 400:
            errs.append(f"level {lvl}: terms over 400")
        truth = Rational(n, d)
        if truth.q < 2:
            errs.append(f"level {lvl}: the reduced fraction is an integer")
        if lvl == 5 and (n < 0 or d < 0):
            errs.append("level 5: signs not allowed")
        if lvl == 6:
            if n > 0 and d > 0:
                errs.append("level 6: needs a minus sign")
            kind = "entrambi negativi" if n < 0 and d < 0 else "numeratore negativo" if n < 0 else "denominatore negativo"
            if p.get("case") != kind:
                errs.append(f"params.case {p.get('case')} but the fraction has {kind}")
        if ans.get("kind") != "expression" or Rational(ans["value"]) != truth:
            errs.append(f"answer {ans.get('value')} != {truth}")

        def right(o):
            r = answer_frac(o["latex"])
            if r is None:
                return False
            an, ad, front = r
            if ad < 1 or gcd(an, ad) != 1 or Rational(an, ad) != truth:
                return False
            return front == (an < 0)  # a negative result has the minus in front of the fraction

        for o in (sample.get("choice") or {}).get("options", []):
            r = answer_frac(o["latex"])
            if r is None:
                errs.append(f"level {lvl}: unreadable option {o['latex']}")
        check_choice(sample, right, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    return errs, kind
