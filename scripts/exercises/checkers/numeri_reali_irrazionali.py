"""Checker for numeri-reali-irrazionali, written from specs/exercises/numeri-reali-irrazionali.md.

Every number is read back from the LaTeX the student sees (options, problem) and valued with SymPy:
square roots with sqrt, decimals as a geometric series, pi as sympy.pi. A decimal ending in \\ldots is
accepted only if its digits show a block that grows every time ("2 7 22 7 222 7 ..." or
"1 0 1 00 1 000 1"), which is what makes it irrational; any other \\ldots is an error. Comparisons and
orderings are decided by SymPy on exact values; approximations with sympy.floor on the exact root.
"""
import re

from sympy import Rational, expand, floor, pi, radsimp, sqrt, sympify

from verify import exact, latex_value

CASE_RANGES = {
    1: {"razionale": (0.38, 0.62), "irrazionale": (0.38, 0.62)},
    2: {"razionale": (0.38, 0.62), "irrazionale": (0.38, 0.62)},
    3: {"difetto": (0.38, 0.62), "eccesso": (0.38, 0.62)},
    4: {"difetto": (0.38, 0.62), "eccesso": (0.38, 0.62)},
    5: {k: (0.15, 0.35) for k in ("radici", "intero", "decimale", "negativi")},
    6: {"un negativo": (0.38, 0.62), "due negativi": (0.38, 0.62)},
    7: {"razionale": (0.38, 0.62), "irrazionale": (0.38, 0.62)},
}

IRR = "irrational-growing"
DEC_RE = re.compile(r"^(-?)(\d+)(?:\{,\}(\d*)(?:\\overline\{(\d+)\})?)?$")


def series(neg, i, ante, period):
    v = Rational(int(i))
    if ante:
        v += Rational(int(ante), 10 ** len(ante))
    if period:
        v += Rational(int(period), 10 ** len(ante) * (10 ** len(period) - 1))
    return -v if neg else v


def growing(digits):
    """True if the digits are a^1 b a^2 b a^3 b a^4 b or b a^1 b a^2 b a^3 b, a != b."""
    for a in "0123456789":
        for b in "0123456789":
            if a == b:
                continue
            if digits == "".join(a * k + b for k in range(1, 5)):
                return True
            if digits == "".join(b + a * k for k in range(1, 4)) + b:
                return True
    return False


def radicand(t):
    """The inside of a square root: integer, \\frac{a}{b} or decimal."""
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(1)), int(m.group(2)))
    d = DEC_RE.match(t)
    if d and not d.group(1):
        return series(False, d.group(2), d.group(3) or "", d.group(4) or "")
    raise ValueError(f"unreadable radicand {t!r}")


def num(t):
    """Exact value of a number as written, or IRR for a growing decimal."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\sqrt\{(.+)\}", t)
    if m:
        v = sqrt(radicand(m.group(2)))
        return -v if m.group(1) else v
    if t == r"\pi":
        return pi
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        v = Rational(int(m.group(2)), int(m.group(3)))
        return -v if m.group(1) else v
    m = re.fullmatch(r"(\d+)\{,\}(\d+)\\ldots", t)
    if m:
        if not growing(m.group(2)):
            raise ValueError(f"decimal with \\ldots that does not show a growing block: {t!r}")
        return IRR
    d = DEC_RE.match(t)
    if d:
        return series(d.group(1) == "-", d.group(2), d.group(3) or "", d.group(4) or "")
    raise ValueError(f"unreadable number {t!r}")


def is_rational(v):
    return v is not IRR and bool(v.is_rational)


def trunc4(v):
    return floor(v * 10**4) if v >= 0 else -floor(-v * 10**4)


def check_choice_common(sample, errs):
    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple-choice variant")
        return None
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("options not distinct in LaTeX")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append("choice.correct out of range")
        return None
    return ch


def pick_one(sample, errs, good):
    """good: one bool per option; exactly one True and choice.correct must point to it."""
    ch = sample["choice"]
    if sum(good) != 1:
        errs.append(f"{sum(good)} options satisfy the question, expected 1")
    elif not good[ch["correct"]]:
        errs.append("choice.correct points to a wrong option")
    if sample["answer"].get("kind") == "choice" and sample["answer"] != ch:
        errs.append("choice differs from answer")


def level_which(sample, errs, want_root):
    m = re.fullmatch(r"\\text\{Quale di questi numeri è (razionale|irrazionale)\?\}", sample["problem"])
    if not m:
        return errs + [f"problem not a question: {sample['problem']}"], None
    ask = m.group(1)
    if sample["params"].get("ask") != ask:
        errs.append("params.ask differs from the problem")
    ch = check_choice_common(sample, errs)
    if ch is None:
        return errs, ask
    vals = []
    for o in ch["options"]:
        if want_root and not o["latex"].startswith(r"\sqrt"):
            errs.append(f"level 1 option is not a square root: {o['latex']}")
        try:
            vals.append(num(o["latex"]))
        except ValueError as e:
            errs.append(str(e))
            return errs, ask
    good = [is_rational(v) == (ask == "razionale") for v in vals]
    pick_one(sample, errs, good)
    keys = [str(v) if v is IRR else radsimp(v) for v in vals]
    if IRR not in vals and len(set(keys)) != len(keys):
        errs.append("two options with the same value")
    if len(sample["steps"]) != 5:
        errs.append("steps: one rule and one line per option")
    return errs, ask


def level_approx(sample, errs):
    p = sample["params"]
    n, k, sign, which = int(p["n"]), int(p["k"]), int(p["sign"]), p["which"]
    lvl = sample["level"]
    if sqrt(n).is_rational:
        errs.append("n is a perfect square")
    if k not in (1, 2):
        errs.append("precision must be the tenth or the hundredth")
    if k == 1 and not 2 <= n <= 99 or k == 2 and not 2 <= n <= 50:
        errs.append("n out of range")
    if (lvl == 3) != (sign == 1):
        errs.append("level 3 is √n, level 4 is -√n")
    want = ("-" if sign < 0 else "") + rf"\sqrt{{{n}}}"
    if sample["problem"] != want:
        errs.append(f"problem {sample['problem']} != {want}")
    word = {1: "al decimo", 2: "al centesimo"}[k] if k in (1, 2) else "?"
    if sample["prompt"] != f"Trova l'approssimazione per {which} {word}.":
        errs.append(f"prompt does not say per {which} {word}")
    x = sign * sqrt(n)
    lo = Rational(floor(x * 10**k), 10**k)
    hi = lo + Rational(1, 10**k)
    if not lo < x < hi:
        errs.append("bounds do not contain the root")
    truth = lo if which == "difetto" else hi
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    ch = check_choice_common(sample, errs)
    if ch is not None:
        try:
            vals = [num(o["latex"]) for o in ch["options"]]
        except ValueError as e:
            return errs + [str(e)], which
        for o, v in zip(ch["options"], vals):
            if Rational(o["values"][0]) != v:
                errs.append(f"option {o['latex']} shows {v}, values say {o['values'][0]}")
            if not re.fullmatch(r"-?\d+(\{,\}\d{1,3})?", o["latex"]):
                errs.append(f"option {o['latex']} is not a decimal with at most 3 decimals")
        if len(set(vals)) != len(vals):
            errs.append("options with the same value")
        pick_one(sample, errs, [v == truth for v in vals])
    return errs, which


def rel_parts(latex):
    parts = re.split(r" (<|>) ", latex)
    if len(parts) != 3:
        raise ValueError(f"not a single inequality: {latex!r}")
    return parts[0], parts[1], parts[2]


def pair_kind(a, b):
    if a < 0 and b < 0:
        return "negativi"
    if a < 0 or b < 0:
        return "misto"
    ints = [v for v in (a, b) if v.is_integer]
    if ints:
        return "intero"
    if all(not v.is_rational for v in (a, b)):
        return "radici"
    return "decimale"


def level_compare(sample, errs):
    if sample["problem"] != r"\text{Quale di queste disuguaglianze è vera?}":
        errs.append("problem is not the question")
    ch = check_choice_common(sample, errs)
    if ch is None:
        return errs, None
    good, kinds = [], []
    for o in ch["options"]:
        try:
            L, op, R = rel_parts(o["latex"])
            a, b = num(L), num(R)
        except ValueError as e:
            return errs + [str(e)], None
        if a == b:
            errs.append(f"equal sides in {o['latex']}")
        if (a < b) == (b < a):
            errs.append(f"cannot order {o['latex']}")
        good.append(bool(a < b) if op == "<" else bool(a > b))
        kinds.append(pair_kind(a, b))
        if not any(not v.is_rational for v in (a, b)):
            errs.append(f"no irrational in {o['latex']}")
    if sorted(kinds) != sorted(["radici", "intero", "decimale", "negativi"]):
        errs.append(f"pair kinds {kinds}, expected one of each")
    pick_one(sample, errs, good)
    kind = kinds[ch["correct"]] if len(kinds) == 4 else None
    if sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} but the true pair is {kind}")
    if sample["solution"] != ch["options"][ch["correct"]]["latex"]:
        errs.append("solution differs from the right option")
    return errs, kind


def level_order(sample, errs):
    items = sample["problem"].split(r" \quad ")
    if len(items) != 4:
        return errs + [f"{len(items)} numbers, expected 4"], None
    try:
        vals = {t: num(t) for t in items}
    except ValueError as e:
        return errs + [str(e)], None
    if any(v is IRR for v in vals.values()):
        errs.append("growing decimals are not for ordering")
        return errs, None
    if len(set(vals)) != 4 or len({radsimp(v) for v in vals.values()}) != 4:
        errs.append("numbers not distinct")
    if len({trunc4(v) for v in vals.values()}) != 4:
        errs.append("two numbers agree to four decimals")
    if sum(1 for v in vals.values() if not v.is_rational) < 1:
        errs.append("no irrational number")
    negs = sum(1 for v in vals.values() if v < 0)
    kind = {1: "un negativo", 2: "due negativi"}.get(negs)
    if kind is None:
        errs.append(f"{negs} negative numbers")
    if sample["params"].get("case") != kind:
        errs.append("params.case wrong")
    right = " < ".join(sorted(items, key=lambda t: float(vals[t].evalf(30))))
    # float of a 30-digit evaluation is enough to sort numbers four decimals apart; check with SymPy too
    srt = right.split(" < ")
    for u, w in zip(srt, srt[1:]):
        if not vals[u] < vals[w]:
            errs.append(f"sort failed between {u} and {w}")
    ch = check_choice_common(sample, errs)
    if ch is not None:
        good = []
        for o in ch["options"]:
            chain = o["latex"].split(" < ")
            if sorted(chain) != sorted(items):
                errs.append(f"option {o['latex']} is not an order of the given numbers")
            good.append(o["latex"] == right)
        pick_one(sample, errs, good)
    if sample["solution"] != right:
        errs.append("solution is not the increasing order")
    return errs, kind


OPS = [
    re.compile(r"\((\d+) - \\sqrt\{(\d+)\}\) \+ \(\\sqrt\{\2\} \+ (\d+)\)"),
    re.compile(r"\((\d+) \+ \\sqrt\{(\d+)\}\)\(\1 - \\sqrt\{\2\}\)"),
    re.compile(r"(\d+)\\sqrt\{(\d+)\} \\cdot \\sqrt\{\2\}"),
    re.compile(r"\\sqrt\{(\d+)\}\\,\(\\sqrt\{\1\} \+ (\d+)\)"),
    re.compile(r"\((\d+) (\+|-) \\sqrt\{(\d+)\}\)\^2"),
    re.compile(r"\(\\sqrt\{(\d+)\} \+ (\d+)\) \+ \(\\sqrt\{\1\} - \2\)"),
]


def to_sympy(t):
    s = t.replace(r"\cdot", "*").replace(r"\,", "").replace("^", "**")
    s = re.sub(r"\\sqrt\{(\d+)\}", r"sqrt(\1)", s)
    s = re.sub(r"(\d)\s*sqrt", r"\1*sqrt", s)
    s = re.sub(r"\)\s*\(", ")*(", s)
    s = re.sub(r"(sqrt\(\d+\))\s*\(", r"\1*(", s)
    return sympify(s)


def level_ops(sample, errs):
    prob = sample["problem"]
    if not any(r.fullmatch(prob) for r in OPS):
        errs.append(f"problem not one of the six forms: {prob}")
    truth = expand(radsimp(to_sympy(prob)))
    lab = "razionale" if truth.is_rational else "irrazionale"
    ans = sample["answer"]
    if ans.get("kind") != "expression":
        errs.append("answer must be an expression")
    else:
        try:
            v = exact(ans["value"])
            if expand(radsimp(v)) != truth:
                errs.append(f"answer {ans['value']} != {truth}")
            if expand(radsimp(latex_value(ans["latex"]))) != truth:
                errs.append("answer.latex differs from the value")
        except ValueError as e:
            errs.append(str(e))
    if not sample["solution"].endswith(rf"\text{{, {lab}}}"):
        errs.append(f"solution does not say {lab}")
    if sample["params"].get("case") != lab:
        errs.append("params.case wrong")
    ch = check_choice_common(sample, errs)
    if ch is not None:
        good, keys = [], []
        for o in ch["options"]:
            m = re.fullmatch(r"(.+)\\ \\text\{\((razionale|irrazionale)\)\}", o["latex"])
            if not m:
                return errs + [f"option not 'value (verdict)': {o['latex']}"], lab
            try:
                v = expand(radsimp(latex_value(m.group(1))))
                if expand(radsimp(exact(o["values"][0]))) != v or o["values"][1] != m.group(2):
                    errs.append(f"option {o['latex']} differs from its values")
            except ValueError as e:
                return errs + [str(e)], lab
            # a wrong value always carries its own true verdict, so only the value or only the verdict is off
            if v != truth and m.group(2) != ("razionale" if v.is_rational else "irrazionale"):
                errs.append(f"distractor {o['latex']} is wrong twice")
            keys.append((v, m.group(2)))
            good.append(v == truth and m.group(2) == lab)
        if len(set(keys)) != len(keys):
            errs.append("options not distinct")
        pick_one(sample, errs, good)
    return errs, lab


def check(sample):
    errs = []
    texts = [sample["problem"], sample["solution"]] + sample.get("steps", [])
    if any(re.search(r"\d\.\d", t) for t in texts):
        errs.append("decimal point instead of comma")
    if not sample.get("steps"):
        errs.append("no steps")
    lvl = sample["level"]
    if lvl == 1:
        return level_which(sample, errs, True)
    if lvl == 2:
        return level_which(sample, errs, False)
    if lvl in (3, 4):
        return level_approx(sample, errs)
    if lvl == 5:
        return level_compare(sample, errs)
    if lvl == 6:
        return level_order(sample, errs)
    if lvl == 7:
        return level_ops(sample, errs)
    return errs + [f"unknown level {lvl}"], None
