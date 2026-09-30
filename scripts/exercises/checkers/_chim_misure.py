"""Helpers for the checkers of the chemistry chapter "Misure e grandezze" (group 21: chim-grandezze-si,
chim-massa-volume-densita, chim-temperatura-calore, chim-errori-cifre-significative), written from the specs and the
lessons 10-13 of docs/lezioni/chimica/riscritte/, not from src/lib/exercises/v2/chim-misure.ts.

Numbers are read as the lessons write them: decimal comma {,}, thin spaces \\, from five digits, scientific notation
"4{,}60 \\cdot 10^{4}", the unit after a thin space (\\,\\text{mL}, \\,\\mu\\text{g}, \\,\\text{kg/m}^3,
\\,^\\circ\\text{C}, \\,\\text{J/(g}\\cdot{}^\\circ\\text{C)}). A result with n significant figures is rounded half up and
written in decimal form, unless its last significant figure is left of the units, or is a zero in the units, or the
number is below 0,001: then in scientific notation with n - 1 decimals in the mantissa.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import BANNED, check_choice, fmt_dec, parse_dec, pow10_tex, prose_and_extra  # noqa: F401

UNIT_TEX = {
    "°C": r"^\circ\text{C}",
    "J/(g·°C)": r"\text{J/(g}\cdot{}^\circ\text{C)}",
}


def unit_tex(u):
    if u in UNIT_TEX:
        return UNIT_TEX[u]
    if u.startswith("μ"):
        return "\\mu\\text{" + u[1:] + "}"
    m = re.fullmatch(r"(.*?)(\^\d)?", u)
    return "\\text{" + m.group(1) + "}" + (m.group(2) or "")


def split_q(s):
    """'25{,}0\\,\\text{mL}' -> ('25{,}0', 'mL'); handles μ, exponents, °C and J/(g·°C)."""
    s = s.strip()
    for u, tex in UNIT_TEX.items():
        if s.endswith("\\," + tex):
            return s[: -len(tex) - 2], u
    m = re.fullmatch(r"(.*?)\\,(\\mu)?\\text\{([^}]*)\}(\^\d)?", s)
    if not m:
        raise ValueError(f"no unit in {s!r}")
    return m.group(1), ("μ" if m.group(2) else "") + m.group(3) + (m.group(4) or "")


def parse_num(s):
    """A decimal or a scientific notation (a \\cdot 10^{n}, a \\cdot 10^n, a \\cdot 10) -> exact value."""
    s = s.strip()
    neg = s.startswith("-")
    if neg:
        s = s[1:]
    m = re.fullmatch(r"(.+?) \\cdot 10(?:\^(-?\d)|\^\{(-?\d+)\})?", s)
    if m:
        v = parse_dec(m.group(1)) * Rational(10) ** int(m.group(2) or m.group(3) or 1)
    else:
        v = parse_dec(s)
    return -v if neg else v


def first_pos(x):
    """Exponent of the first significant digit of x > 0."""
    x = Rational(x)
    p = 0
    while Rational(10) ** (p + 1) <= x:
        p += 1
    while Rational(10) ** p > x:
        p -= 1
    return p


def round_half_up(x, p):
    """x > 0 rounded to a multiple of 10^p; None when exactly at half."""
    y = Rational(x) / Rational(10) ** p
    f = y.p // y.q
    frac = y - f
    if frac == Rational(1, 2):
        return None
    return (f + (1 if frac > Rational(1, 2) else 0)) * Rational(10) ** p


def write_sig(v, n):
    """The writing of v (already rounded) with n significant figures."""
    v = Rational(v)
    p = first_pos(v)
    last = p - n + 1
    units_zero = last == 0 and (v.p // v.q) % 10 == 0
    if last > 0 or units_zero or p < -3:
        mant = v / Rational(10) ** p
        mt = fmt_dec(mant, n - 1)
        return mt if p == 0 else f"{mt} \\cdot {pow10_tex(p)}"
    return fmt_dec(v, max(0, -last))


def rounded(x, n):
    """(value, writing) of x rounded to n significant figures, or None at half."""
    x = Rational(x)
    r = round_half_up(x, first_pos(x) - n + 1)
    if r is None:
        return None
    return r, write_sig(r, n)


def sig_count(s):
    """Significant figures of a datum as written (decimal form): '0{,}0250' -> 3, '25{,}00' -> 4."""
    digits = s.replace("{,}", "").replace("\\,", "")
    return len(digits.lstrip("0"))


def decimals_of(s):
    return len(s.split("{,}")[1]) if "{,}" in s else 0


def quantity_re(unit):
    """A regex for a quantity in prose: $<number>\\,<unit>$, the number captured."""
    return r"\$(-?[\d\\,{}]+(?: \\cdot 10(?:\^-?\d|\^\{-?\d+\})?)?)\\," + re.escape(unit_tex(unit)) + r"\$"


def check_quantity_options(sample, errs, right_value, right_writing, unit):
    """Four options, distinct, each a quantity in `unit`; the correct one has the value and the writing given."""
    ch = sample["answer"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
        return
    if len({o["latex"] for o in opts}) != 4 or len({"|".join(o["values"]) for o in opts}) != 4:
        errs.append("options not distinct")
    want = right_writing + "\\," + unit_tex(unit)
    right = [i for i, o in enumerate(opts) if o["latex"] == want]
    if len(right) != 1:
        errs.append(f"expected one option {want!r}, found {[o['latex'] for o in opts]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"correct = {ch.get('correct')} but the right option is {right[0]}")
    vals = []
    for o in opts:
        try:
            num, u = split_q(o["latex"])
            if u != unit:
                errs.append(f"option {o['latex']!r} not in {unit}")
            v = parse_num(num)
            vals.append(v)
            if Rational(o["values"][0]) != v:
                errs.append(f"option {o['latex']!r} has value {o['values'][0]}")
        except Exception as e:  # noqa: BLE001
            errs.append(f"option {o['latex']!r} unreadable: {e}")
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    if right_value is not None and vals and right and vals[right[0]] != right_value:
        errs.append("right option has a different value")


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    for field in [sample["problem"], sample.get("solution", ""), *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")


def text(sample):
    prose, extra = prose_and_extra(sample["problem"])
    return prose
