"""Checker for numeri-naturali-mcm-mcd, from specs/exercises/numeri-naturali-mcm-mcd.md.

Recomputes everything with SymPy (factorint, gcd, lcm) from the problem text and params: which
divisor divides the number, the prime factorisation, MCD and MCM, the length of Euclid's
algorithm, and for the word problems whether the story asks for MCD or MCM.
"""
import re
from functools import reduce

from sympy import factorint, gcd, isprime, lcm

from checkers._naturali import check_choice_numbers

CRITERIA = {2, 3, 4, 5, 9, 10, 11, 25}
# which operation each story needs, from the spec
STORY_NEEDS = {"piastrelle": "MCD", "nastri": "MCD", "sacchetti": "MCD", "autobus": "MCM", "fari": "MCM", "piscina": "MCM"}

CASE_RANGES = {
    3: {"MCD": (0.40, 0.60), "MCM": (0.40, 0.60)},
    4: {"MCD": (0.40, 0.60), "MCM": (0.40, 0.60)},
    6: {"MCD": (0.40, 0.60), "MCM": (0.40, 0.60)},
}


def gcd_all(xs):
    return int(reduce(gcd, xs))


def lcm_all(xs):
    return int(reduce(lcm, xs))


def parse_fn(problem):
    m = re.fullmatch(r"\\text\{(MCD|MCM)\}\(([\d, ]+)\)", problem)
    if not m:
        raise ValueError(f"problem is not MCD(...) or MCM(...): {problem!r}")
    return m.group(1), [int(v) for v in m.group(2).split(",")]


def trap(n, d):
    """A divisor a hurried student would accept (spec, level 1)."""
    if n % d == 0:
        return False
    return {4: n % 2 == 0, 9: n % 3 == 0, 3: n % 10 in (3, 6, 9), 25: n % 5 == 0, 10: n % 5 == 0}.get(d, False)


def parse_factors(s):
    """ "2**3*3**2*5" -> [(2, 3), (3, 2), (5, 1)]"""
    if not re.fullmatch(r"\d+(\*\*\d+)?(\*\d+(\*\*\d+)?)*", s):
        raise ValueError(f"not a factorisation: {s!r}")
    items = re.findall(r"(\d+)(?:\*\*(\d+))?", s)
    return [(int(b), int(e) if e else 1) for b, e in items]


def is_prime_factorisation(fs, n):
    bases = [b for b, _ in fs]
    prod = 1
    for b, e in fs:
        prod *= b**e
    return all(isprime(b) for b in bases) and bases == sorted(set(bases)) and prod == n and all(e >= 1 for _, e in fs)


def euclid_len(a, b):
    k = 0
    while b:
        a, b = b, a % b
        k += 1
    return k


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    ans = sample["answer"]
    kind = None
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    if lvl == 1:
        n = int(sample["problem"].replace("\\,", ""))
        if not 100 <= n <= 9999:
            errs.append(f"{n} out of 100-9999")
        opts = [int(o["values"][0]) for o in ans.get("options", [])]
        if not set(opts) <= CRITERIA:
            errs.append(f"options {opts} not all criteria divisors")
        divs = [d for d in opts if n % d == 0]
        if len(divs) != 1:
            errs.append(f"{n} divisible by {divs} among {opts}: need exactly one")
        else:
            check_choice_numbers(ans, str(divs[0]), errs)
        if not any(trap(n, d) for d in opts):
            errs.append("no trap distractor")
        if sample.get("choice") is not None and len(divs) == 1:
            check_choice_numbers(sample["choice"], str(divs[0]), errs)
        if p.get("n") != str(n):
            errs.append("params.n != problem")
    elif lvl == 2:
        n = int(sample["problem"].replace("\\,", ""))
        fi = factorint(n)
        if not 48 <= n <= 1000 or sum(fi.values()) < 3 or max(fi.values()) < 2:
            errs.append(f"{n}: need 48-1000, at least three prime factors, one squared")
        canon = "*".join(f"{b}**{e}" if e > 1 else f"{b}" for b, e in sorted(fi.items()))
        if ans.get("kind") != "expression" or ans.get("value") != canon:
            errs.append(f"answer {ans.get('value')} != {canon}")
        ch = sample.get("choice")
        if ch:
            good = [i for i, o in enumerate(ch["options"]) if is_prime_factorisation(parse_factors(o["values"][0]), n)]
            if good != [ch.get("correct")]:
                errs.append(f"prime factorisations among options at {good}, correct index {ch.get('correct')}")
            check_choice_numbers(ch, canon, errs)
        else:
            errs.append("no choice")
    elif lvl in (3, 4, 5):
        which, xs = parse_fn(sample["problem"])
        if [str(x) for x in xs] != p.get("numbers"):
            errs.append("problem numbers != params")
        count, top = {3: (2, 400), 4: (3, 300), 5: (2, 999)}[lvl]
        if len(xs) != count or len(set(xs)) != count:
            errs.append(f"need {count} different numbers")
        truth = gcd_all(xs) if which == "MCD" else lcm_all(xs)
        if lvl in (3, 4):
            kind = which
            if any(x < 12 or x > top for x in xs):
                errs.append(f"numbers out of 12-{top}")
            if any(a != b and b % a == 0 for a in xs for b in xs):
                errs.append("one number is a multiple of another")
            if lcm_all(xs) > 3000:
                errs.append("MCM > 3000")
        else:
            a, b = xs
            if which != "MCD" or not a > b or a > 999:
                errs.append("Euclid needs MCD(a, b) with a > b, a <= 999")
            if not 3 <= euclid_len(a, b) <= 6:
                errs.append(f"Euclid takes {euclid_len(a, b)} divisions, expected 3-6")
        if ans.get("kind") != "number" or ans.get("value") != str(truth):
            errs.append(f"answer {ans.get('value')} != {truth}")
        check_choice_numbers(sample.get("choice"), str(truth), errs)
    elif lvl == 6:
        xs = [int(v) for v in p["numbers"]]
        need = STORY_NEEDS.get(p.get("story"))
        if need is None:
            errs.append(f"unknown story {p.get('story')}")
            return errs, None
        kind = need
        for x in xs:
            if not re.search(rf"\b{x}\b", sample["prompt"]):
                errs.append(f"{x} not in the text")
        if [int(v) for v in re.findall(r"\d+", sample["problem"])] != xs:
            errs.append(f"data in problem {sample['problem']!r} != numbers {xs}")
        truth = gcd_all(xs) if need == "MCD" else lcm_all(xs)
        if need == "MCD" and (truth < 4 or max(xs) > 400):
            errs.append("MCD problem: MCD at least 4, numbers up to 400")
        if need == "MCM" and (max(xs) > 30 or truth > 360 or any(a != b and b % a == 0 for a in xs for b in xs)):
            errs.append("MCM problem: numbers up to 30, none multiple of the other, MCM up to 360")
        if ans.get("kind") != "number" or ans.get("value") != str(truth):
            errs.append(f"answer {ans.get('value')} != {truth}")
        check_choice_numbers(sample.get("choice"), str(truth), errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
