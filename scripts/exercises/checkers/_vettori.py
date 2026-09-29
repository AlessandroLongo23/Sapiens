"""Helpers for the checkers of the vector generators of physics (fis-scalari-vettori, fis-operazioni-vettori,
fis-seno-coseno). Written from the specs and the lessons, not from src/lib/exercises/v2/vettori.ts.

Numbers are read as the lessons write them (decimal comma {,}, a minus sign, the unit after a thin space),
values are exact (sympy Rational) and rounding to significant figures is done on exact values with sympy's
arbitrary precision, half up, refusing values within 1e-9 of a rounding boundary.
"""
import re

from sympy import Rational, N, floor, log

BANNED = re.compile(r"—|piuttosto che")
NUM = r"-?\d+(?:\{,\}\d+)?"


def prose(tex):
    """The text of a problem made of \\text{} lines (textBlock), joined with spaces."""
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    lines = m.group(1).split(r" \\ ") if m else [tex.strip()]
    out = []
    for line in lines:
        mm = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not mm:
            raise ValueError(f"expected prose lines only: {line!r}")
        out.append(mm.group(1))
    return " ".join(out)


def num(s):
    """A number as the lessons write it, checked to be written the canonical way (no trailing zeros unless
    `keep_zeros`, no leading zeros)."""
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def canonical(s):
    """True if the exact value s is written without useless zeros ("4{,}5", not "4{,}50" or "04")."""
    body = s.lstrip("-")
    if re.match(r"0\d", body):
        return False
    return not ("{,}" in body and body.endswith("0"))


def qty_re(unit_group=r"([^{}]+)"):
    return re.compile(r"(" + NUM + r")\\,\\text\{" + unit_group + r"\}(?:\\ \\text\{(.*)\})?")


def parse_option(latex):
    """An option "43\\,\\text{N}" or "7\\,\\text{km}\\ \\text{verso est}" → (value string, unit, extra)."""
    m = qty_re().fullmatch(latex)
    if not m:
        raise ValueError(f"option not a quantity: {latex!r}")
    return m.group(1), m.group(2), m.group(3)


def round_sig(x, n):
    """Exact x rounded half up to n significant figures, as the decimal string the lessons write ("8{,}7", "43",
    "201", "-6{,}9"); None if too close to a boundary or if it would need zeros before the comma."""
    x = Rational(x) if not hasattr(x, "evalf") else x
    if x == 0:
        return None
    ax = abs(x)
    e = int(floor(log(ax, 10).evalf(50)))
    # guard against log imprecision near powers of ten
    if Rational(10) ** e > ax:
        e -= 1
    if Rational(10) ** (e + 1) <= ax:
        e += 1
    k = n - 1 - e
    if k < 0:
        return None
    y = ax * Rational(10) ** k
    fl = int(floor(y.evalf(60)))
    frac = (y - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    r = fl + 1 if frac > Rational(1, 2) else fl
    s = str(r).rjust(k + 1, "0")
    whole, dec = (s[: len(s) - k], s[len(s) - k :]) if k else (s, "")
    digits = (whole + dec).lstrip("0")
    if len(digits) != n:
        return None
    out = whole + ("{,}" + dec if dec else "")
    return ("-" if x < 0 else "") + out


def round_deg(x):
    x = N(x, 60)
    fl = int(floor(x))
    frac = x - fl
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    return str(fl + 1 if frac > Rational(1, 2) else fl)


def sig_of(s):
    """Significant figures of a datum as written: "45" → 2, "4{,}5" → 2, "245" → 3."""
    return len(s.lstrip("-").replace("{,}", "").lstrip("0"))


def check_choice(sample, errs, right_latex):
    """Four distinct options, and the correct one is exactly `right_latex`."""
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return []
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return opts
    if opts[c] != right_latex:
        errs.append(f"correct option {opts[c]!r} != expected {right_latex!r}")
    if opts.count(right_latex) != 1:
        errs.append("the right option appears more than once")
    return opts


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def fmt_exact(r):
    """An exact terminating decimal written as the lessons write it."""
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 10:
            raise ValueError(f"{r} is not a terminating decimal")
    sign = "-" if r < 0 else ""
    s = str(abs(int(r * 10**k))).rjust(k + 1, "0")
    whole, dec = (s[: len(s) - k], s[len(s) - k :]) if k else (s, "")
    return sign + whole + ("{,}" + dec if dec else "")


def scene_vectors(sc):
    return [((Rational(str(w["da"][0])), Rational(str(w["da"][1]))), (Rational(str(w["a"][0])), Rational(str(w["a"][1]))), w) for w in sc["data"]["vettori"]]
