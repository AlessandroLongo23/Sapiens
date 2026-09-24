"""Checker for numeri-naturali-divisibilita, from specs/exercises/numeri-naturali-divisibilita.md.

Recomputes everything with plain integer arithmetic and SymPy (factorint, isprime,
divisor_count) from the problem text and the options: which option is divisible, the divisors
among the criteria of the table, whether the number is prime, the prime factorisation, the
number of divisors. The traps are written again here from the spec.
"""
import re

from sympy import divisor_count, factorint, isprime

from checkers._naturali import check_choice_numbers

CRITERIA = [2, 3, 4, 5, 9, 10, 11, 25]
L1_DIVISORS = {3, 4, 6, 7, 8, 9}
L2_DIVISORS = {2, 3, 5, 9, 10}

CASE_RANGES = {
    3: {"11": (0.25, 0.50), "senza 11": (0.50, 0.75)},
    4: {"primo": (0.40, 0.60), "composto": (0.40, 0.60)},
    5: {"con 7, 11 o 13": (0.40, 0.60), "solo 2, 3, 5": (0.40, 0.60)},
    6: {"numero di divisori": (0.40, 0.60), "divisibilità": (0.40, 0.60)},
}


def num(s):
    return int(s.replace("\\,", "").strip())


def trap(n, d, level):
    """A non-divisor a hurried student would accept (spec, "Trabocchetti")."""
    if n % d == 0:
        return False
    s = str(n)
    if d == 2:
        return int(s[0]) % 2 == 0
    if d == 3:
        return s[-1] in "369"
    if d == 4:
        return n % 2 == 0
    if d == 5:
        return "5" in s[:-1] or "0" in s[:-1]
    if d == 6:
        return n % 2 == 0 or n % 3 == 0
    if d == 7:
        return s[-1] == "7"
    if d == 8:
        return n % 4 == 0
    if d == 9:
        return n % 3 == 0
    if d == 10:
        return s[-1] == "5" or (level == 2 and "0" in s[:-1])
    if d == 25:
        return n % 5 == 0
    return False


def canon_factors(n):
    return "*".join(f"{p}**{e}" if e > 1 else f"{p}" for p, e in sorted(factorint(n).items()))


def parse_factors(s):
    if not re.fullmatch(r"\d+(\*\*\d+)?(\*\d+(\*\*\d+)?)*", s):
        raise ValueError(f"not a factorisation: {s!r}")
    return [(int(b), int(e) if e else 1) for b, e in re.findall(r"(\d+)(?:\*\*(\d+))?", s)]


def is_prime_factorisation(fs, n):
    bases = [b for b, _ in fs]
    prod = 1
    for b, e in fs:
        prod *= b**e
    return prod == n and all(isprime(b) for b in bases) and bases == sorted(set(bases))


def latex_factors_value(tex):
    """ "2^2 \\cdot 3^{2} \\cdot 5" -> (value, [(2, 2), (3, 2), (5, 1)])"""
    fs = []
    for part in tex.split("\\cdot"):
        m = re.fullmatch(r"\s*(\d+)(?:\^\{?(\d+)\}?)?\s*", part)
        if not m:
            raise ValueError(f"bad factor {part!r}")
        fs.append((int(m.group(1)), int(m.group(2) or 1)))
    v = 1
    for b, e in fs:
        v *= b**e
    return v, fs


def check_one_of_four(ans, truth_key, errs):
    """Choice with 4 distinct options, exactly the truth at the correct index."""
    check_choice_numbers(ans, truth_key, errs)


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    ans = sample["answer"]
    kind = p.get("case")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")

    if lvl in (1, 2):
        m = re.search(r"divisibile per (\d+)\?", sample["prompt"])
        if not m:
            return [f"no divisor in prompt {sample['prompt']!r}"], None
        d = int(m.group(1))
        if d not in (L1_DIVISORS if lvl == 1 else L2_DIVISORS):
            errs.append(f"divisor {d} not allowed at level {lvl}")
        shown = [num(x) for x in sample["problem"].split("\\qquad")]
        opts = [int(o["values"][0]) for o in ans.get("options", [])]
        if sorted(opts) != sorted(shown) or len(set(shown)) != 4:
            errs.append(f"options {opts} != problem {shown}")
        if lvl == 1:
            if not (all(20 <= x <= 99 for x in shown) or all(100 <= x <= 999 for x in shown)):
                errs.append(f"{shown}: need all two-digit (from 20) or all three-digit")
        elif not all(1000 <= x <= 9999 for x in shown):
            errs.append(f"{shown}: need four-digit numbers")
        good = [x for x in shown if x % d == 0]
        if len(good) != 1:
            errs.append(f"multiples of {d} among {shown}: {good}")
        else:
            check_one_of_four(ans, str(good[0]), errs)
        if not any(trap(x, d, lvl) for x in shown):
            errs.append("no trap")
        kind = str(d)

    elif lvl == 3:
        n = num(sample["problem"])
        truth = [c for c in CRITERIA if n % c == 0]
        if not 100 <= n <= 99999:
            errs.append(f"{n} out of 100-99999")
        if not 1 <= len(truth) <= 6:
            errs.append(f"{n} divisible by {truth}: need 1-6")
        if not any(trap(n, c, 3) for c in CRITERIA):
            errs.append("no trap among the criteria")
        if ans.get("kind") != "set" or [int(v) for v in ans.get("values", [])] != truth:
            errs.append(f"answer {ans.get('values')} != {truth}")
        ch = sample.get("choice")
        key = "|".join(map(str, truth))
        check_choice_numbers(ch, key, errs)
        if ch:
            for o in ch["options"]:
                vs = [int(v) for v in o["values"]]
                if not vs or vs != sorted(set(vs)) or not set(vs) <= set(CRITERIA):
                    errs.append(f"option {o['values']} is not a sorted non-empty subset of the criteria")
        kind = "11" if n % 11 == 0 else "senza 11"

    elif lvl == 4:
        n = num(sample["problem"])
        if not 49 <= n <= 400:
            errs.append(f"{n} out of 49-400")
        prime = isprime(n)
        if not prime and min(factorint(n)) < 7:
            errs.append(f"{n} has a factor 2, 3 or 5")
        true_keys = []
        for o in ans.get("options", []):
            k = o["values"][0]
            if k == "primo":
                ok = prime
            else:
                m = re.fullmatch(r"div:(\d+)", k)
                if not m or not isprime(int(m.group(1))):
                    errs.append(f"bad option {k}")
                    continue
                ok = n % int(m.group(1)) == 0
                if str(m.group(1)) not in o["latex"]:
                    errs.append(f"option latex {o['latex']} does not match {k}")
            if ok:
                true_keys.append(k)
        if len(true_keys) != 1:
            errs.append(f"true statements: {true_keys}")
        else:
            check_one_of_four(ans, true_keys[0], errs)
        if prime and true_keys != ["primo"]:
            errs.append("prime but 'primo' not the answer")
        kind = "primo" if prime else "composto"

    elif lvl == 5:
        n = num(sample["problem"])
        fi = factorint(n)
        if not 60 <= n <= 5000 or len(fi) < 2 or sum(fi.values()) < 3 or max(fi.values()) < 2 or max(fi) > 13:
            errs.append(f"{n}: need 60-5000, two primes up to 13, three factors, an exponent >= 2")
        canon = canon_factors(n)
        if ans.get("kind") != "expression" or ans.get("value") != canon:
            errs.append(f"answer {ans.get('value')} != {canon}")
        ch = sample.get("choice")
        if ch:
            good = [i for i, o in enumerate(ch["options"]) if is_prime_factorisation(parse_factors(o["values"][0]), n)]
            if good != [ch.get("correct")]:
                errs.append(f"prime factorisations among options at {good}, correct {ch.get('correct')}")
            check_one_of_four(ch, canon, errs)
        else:
            errs.append("no choice")
        kind = "con 7, 11 o 13" if max(fi) >= 7 else "solo 2, 3, 5"

    elif lvl == 6:
        left, right = sample["problem"].split("=")
        n = num(left)
        v, fs = latex_factors_value(right)
        if v != n or not is_prime_factorisation(fs, n):
            errs.append(f"shown factorisation {right} is not the one of {n}")
        if max(e for _, e in fs) < 2:
            errs.append("need an exponent >= 2")
        if ans.get("kind") == "number":
            kind = "numero di divisori"
            k = int(divisor_count(n))
            if ans.get("value") != str(k):
                errs.append(f"answer {ans.get('value')} != {k} divisors")
            check_one_of_four(sample.get("choice"), str(k), errs)
        elif ans.get("kind") == "choice":
            kind = "divisibilità"
            listed = [int(x) for x in re.findall(r"\d+", sample["prompt"].split("è divisibile")[0])]
            opts = [int(o["values"][0]) for o in ans["options"]]
            if sorted(listed) != sorted(opts):
                errs.append(f"prompt lists {listed}, options {opts}")
            good = [x for x in opts if n % x == 0]
            if len(good) != 1:
                errs.append(f"divisors of {n} among {opts}: {good}")
            else:
                check_one_of_four(ans, str(good[0]), errs)
                if good[0] in (1, n) or sum(factorint(good[0]).values()) < 2:
                    errs.append(f"divisor {good[0]} too trivial")
        else:
            errs.append(f"unexpected answer kind {ans.get('kind')}")
    else:
        errs.append(f"unknown level {lvl}")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} != {kind}")
    return errs, kind
