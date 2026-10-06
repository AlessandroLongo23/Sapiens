"""Shared by the checkers of the chapter "Statistica bivariata" (distribuzioni_doppie, regressione_correlazione).

Numbers are read back from the LaTeX the student sees (1{,}90 is 1.90, 26\\% is 26) and compared as Fractions.
Rounding is half away from zero, done with Fractions and, for square roots, with SymPy's exact root.
"""
import re
from fractions import Fraction as F

from sympy import Rational, floor, sqrt

NUM = re.compile(r"^(-?\d+(?:\{,\}\d+)?)(\\%)?$")


def num(s, percent=None):
    """The number written in LaTeX; `percent` True/False demands or forbids the % sign."""
    m = NUM.match(s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    if percent is not None and bool(m.group(2)) != percent:
        raise ValueError(f"percent sign {'missing' if percent else 'not expected'}: {s!r}")
    return F(m.group(1).replace("{,}", "."))


def digits_shown(s):
    m = re.search(r"\{,\}(\d+)", s)
    return len(m.group(1)) if m else 0


def frac(s):
    if not re.fullmatch(r"-?\d+(/\d+)?", str(s)):
        raise ValueError(f"not an exact rational: {s!r}")
    return F(str(s))


def finite_digits(v):
    """Digits after the comma of a finite decimal, None if periodic."""
    for k in range(9):
        if (v * 10**k).denominator == 1:
            return k
    return None


def round_to(v, k):
    """v rounded to k decimals, half away from zero."""
    s = -1 if v < 0 else 1
    scaled = abs(v) * 10**k + F(1, 2)
    return F(s * (scaled.numerator // scaled.denominator), 10**k)


def sqrt_round100(v):
    """√v rounded to the hundredth, exact, for a Fraction v ≥ 0; also whether the root is exactly that."""
    r = sqrt(Rational(v.numerator, v.denominator))
    rounded = F(int(floor(100 * r + Rational(1, 2))), 100)
    return rounded, rounded * rounded == v


def body_lines(problem):
    """The lines of the outer \\begin{array}{l} … \\end{array}, nested arrays kept whole."""
    m = re.fullmatch(r"\s*\\begin\{array\}\{l\}(.*)\\end\{array\}\s*", problem, re.S)
    if not m:
        return [problem.strip()]
    inner = m.group(1)
    out, depth, cur, i = [], 0, "", 0
    while i < len(inner):
        if inner.startswith(r"\begin{", i):
            depth += 1
        elif inner.startswith(r"\end{", i):
            depth -= 1
        if depth == 0 and inner.startswith(r"\\", i):
            out.append(cur.strip())
            cur = ""
            i += 2
            continue
        cur += inner[i]
        i += 1
    out.append(cur.strip())
    return out


def array_rows(tex):
    """Column spec and rows of cells of a \\begin{array}{spec} … \\end{array}; \\hline dropped."""
    m = re.fullmatch(r"(?:\\small\s*)?\\begin\{array\}\{([lc|]+)\}(.*)\\end\{array\}", tex.strip(), re.S)
    if not m:
        raise ValueError(f"not a table: {tex[:60]!r}")
    rows = [[c.strip() for c in r.replace(r"\hline", "").split("&")] for r in m.group(2).split(r"\\")]
    return m.group(1), rows


def text_of(cell):
    m = re.fullmatch(r"\\text\{(.*)\}", cell)
    return m.group(1) if m else None


def check_choice_shape(ch, errs):
    if not ch or ch.get("kind") != "choice":
        errs.append("manca la scelta multipla")
        return False
    opts = ch["options"]
    if len(opts) != 4:
        errs.append("servono 4 opzioni")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("opzioni con lo stesso testo")
    if len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("opzioni con gli stessi valori")
    if not 0 <= ch["correct"] < len(opts):
        errs.append("indice della risposta fuori intervallo")
        return False
    return True


def check_number_choice(sample, right, errs, must=(), percent=False, digits=None, lo=None, hi=None):
    """The choice of a number level: every option's LaTeX is its value, the right one is `right` and is there
    once, the mistakes in `must` are among the others, and every option stays in [lo, hi]. With `digits`
    every option shows exactly that many digits after the comma."""
    ans = sample["answer"]
    if ans.get("kind") != "number" or frac(ans["value"]) != right:
        errs.append(f"risposta {ans.get('value')}, attesa {right}")
    ch = sample.get("choice")
    if not check_choice_shape(ch, errs):
        return
    vals = []
    for o in ch["options"]:
        v = num(o["latex"], percent)
        vals.append(v)
        if frac(o["values"][0]) != v:
            errs.append(f"opzione {o['latex']} con valore {o['values'][0]}")
        if digits is not None and digits_shown(o["latex"]) != digits:
            errs.append(f"opzione {o['latex']}: servono {digits} cifre dopo la virgola")
        if digits is None and o["latex"].rstrip("\\%").endswith("0") and "{,}" in o["latex"]:
            errs.append(f"opzione {o['latex']}: zero in coda")
        if (lo is not None and v < lo) or (hi is not None and v > hi):
            errs.append(f"opzione {o['latex']} fuori dall'intervallo")
    if vals[ch["correct"]] != right:
        errs.append(f"opzione giusta {ch['options'][ch['correct']]['latex']}, attesa {right}")
    if sum(1 for v in vals if v == right) != 1:
        errs.append("valore giusto ripetuto o assente")
    for m in must:
        if m is None or m == right:
            continue
        if (lo is not None and m < lo) or (hi is not None and m > hi):
            continue
        if m not in vals:
            errs.append(f"manca il distrattore {m}")
