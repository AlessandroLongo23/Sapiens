"""Helpers shared by the checkers of temperature and heat (physics, second year, group 19): fis_temperatura,
fis_dilatazione_termica, calore. Written from docs/lezioni/fisica/README.md and the three specs, not from
src/lib/exercises/v2/fis-termologia.ts: numbers with the decimal comma {,}, thin spaces \\, between thousands from
five digits, a minus sign for temperatures below zero, scientific notation with \\cdot 10^{k}; degrees Celsius as
\\,^\\circ\\text{C}; rounding half up on the absolute value. Exact arithmetic with sympy Rationals.
"""
import re

from sympy import Rational

from checkers.forze_comune import fmt_exact, fmt_sig, is_tie, round_sig
from checkers.forze_comune import prose as _prose

BANNED = re.compile(r"—|piuttosto che")

UNIT = {
    "C": r"^\circ\text{C}",
    "F": r"^\circ\text{F}",
    "K": r"\text{K}",
    "J": r"\text{J}",
    "kJ": r"\text{kJ}",
    "cal": r"\text{cal}",
    "kcal": r"\text{kcal}",
    "m": r"\text{m}",
    "cm": r"\text{cm}",
    "mm": r"\text{mm}",
    "kg": r"\text{kg}",
    "g": r"\text{g}",
    "L": r"\text{L}",
    "mL": r"\text{mL}",
    "cm3": r"\text{cm}^3",
    "perC": r"^\circ\text{C}^{-1}",
    "c": r"\text{J/(kg}\cdot{}^\circ\text{C)}",
    "JC": r"\text{J}/^\circ\text{C}",
}

NUM = r"-?(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"


def prose(tex):
    return _prose(tex)


def parse(s):
    """A number as written, exactly (a leading minus allowed)."""
    s = s.strip()
    m = re.fullmatch(r"(-?)((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    whole = m.group(2).replace("\\,", "")
    frac = m.group(3) or ""
    v = Rational(int(whole + frac), 10 ** len(frac))
    if m.group(4):
        v *= Rational(10) ** int(m.group(4))
    return -v if m.group(1) else v


def q(unit):
    """A regex group for a quantity between dollars with the given unit."""
    return r"\$(" + NUM + r")\\," + re.escape(UNIT[unit]) + r"\$"


def round_int(x):
    x = Rational(x)
    a = abs(x)
    r = (2 * a.p + a.q) // (2 * a.q)
    return -Rational(r) if x < 0 else Rational(r)


def round_fixed(x, d):
    return round_int(Rational(x) * 10**d) / 10**d


def write(v, fmt):
    """fmt: ('int',), ('fixed', d) or ('sig', s); v already rounded."""
    v = Rational(v)
    sign = "-" if v < 0 else ""
    a = abs(v)
    if fmt[0] == "sig":
        return sign + fmt_sig(a, fmt[1])
    if fmt[0] == "int":
        return sign + fmt_exact(a)
    d = fmt[1]
    s = str(int(a * 10**d)).rjust(d + 1, "0")
    return sign + s[: len(s) - d] + ("{,}" + s[len(s) - d :] if d else "")


def rounded(x, fmt, errs):
    """x rounded in the format; a tie is an error."""
    x = Rational(x)
    if fmt[0] == "sig":
        if x == 0:
            errs.append("zero answer")
            return x
        if is_tie(abs(x), fmt[1]):
            errs.append(f"{x} is a tie at {fmt[1]} figures")
        r = round_sig(abs(x), fmt[1])
        return -r if x < 0 else r
    d = 0 if fmt[0] == "int" else fmt[1]
    y = abs(x) * 10**d
    if y - int(y) == Rational(1, 2):
        errs.append(f"{x} is a tie")
    return round_fixed(x, d)


def expect(sample, errs, truth, unit, fmt, signed=False):
    """The correct option is truth rounded and written in the format; four distinct options, each written the same
    way (a number in the format and the unit), positive unless signed."""
    want = rounded(truth, fmt, errs)
    right = write(want, fmt) + r"\," + UNIT[unit]
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return
    if opts[c] != right:
        errs.append(f"correct option {opts[c]!r} != {right!r}")
    vals = []
    for o in a["options"]:
        m = re.fullmatch(r"(" + NUM + r")\\," + re.escape(UNIT[unit]), o["latex"])
        if not m:
            errs.append(f"option {o['latex']!r} has not the unit {unit}")
            continue
        v = parse(m.group(1))
        vals.append(v)
        if write(rounded(v, fmt, []), fmt) != m.group(1):
            errs.append(f"option {o['latex']!r} not written like the answer")
        if not signed and v <= 0:
            errs.append(f"option {o['latex']!r} not positive")
        if Rational(o["values"][0]) != v:
            errs.append("option value differs from its text")
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")


def sig_of(s):
    digits = re.sub(r"\\cdot 10\^\{-?\d+\}", "", s).replace("\\,", "").replace("{,}", "").lstrip("-").strip()
    return len(digits.lstrip("0"))


__all__ = ["UNIT", "NUM", "parse", "q", "prose", "expect", "common", "rounded", "write", "round_int", "sig_of", "fmt_exact"]
