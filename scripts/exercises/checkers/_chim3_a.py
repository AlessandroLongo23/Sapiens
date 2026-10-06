"""Shared helpers for the checkers of the chemistry chapter on the electronic structure (third year, group A:
chim-luce-spettri, chim-modello-bohr, chim-livelli-energia, chim-onda-particella), written from the specs and the
lessons 48-51, not from the generators.

Every quantity is recomputed here with exact fractions from the constants the lessons give (c = 3,00 · 10^8 m/s,
h = 6,63 · 10^-34 J·s, N_A = 6,02 · 10^23 mol^-1, E_n = -2,18 · 10^-18 J / n^2, m_e = 9,11 · 10^-31 kg) and rounded
half up to the figures the spec asks for. Numbers are written with the decimal comma, a \\cdot 10^{n}, and a unit
upright after a thin space; the value of an option is "5.66e14 Hz" or "656 nm".
"""
from fractions import Fraction as F

from checkers._fis_grandezze import BANNED, check_choice, option_text, prose_and_extra  # noqa: F401 (re-exported)

C = F(3) * 10**8
H = F(663, 100) * F(10) ** -34
N_A = F(602, 100) * 10**23
RYDBERG = F(218, 100) * F(10) ** -18
M_E = F(911, 100) * F(10) ** -31
M_P = F(167, 100) * F(10) ** -27
PI = F(3141592653589793, 10**15)


def parts(x, digits=3):
    """x > 0 rounded half up to `digits` figures: (integer mantissa, exponent of its last digit, distance from a tie)."""
    x = F(x)
    if x <= 0:
        raise ValueError(f"{x} is not positive")
    e = 0
    while x >= F(10) ** (e + 1):
        e += 1
    while x < F(10) ** e:
        e -= 1
    scaled = x / F(10) ** (e - digits + 1)
    whole = scaled.numerator // scaled.denominator
    frac = scaled - whole
    m = whole + (1 if frac >= F(1, 2) else 0)
    if m >= 10**digits:
        m //= 10
        e += 1
    return m, e, abs(frac - F(1, 2))


def rounded(x, digits=3):
    m, e, _ = parts(x, digits)
    return F(m) * F(10) ** (e - digits + 1)


def near_tie(x, digits=3, margin=F(5, 100)):
    """True when the last figure of x hangs on a rounding: the generators must redraw those."""
    return parts(x, digits)[2] < margin


def sci_value(x, digits=3):
    """5.66e14: the value of an option in scientific notation."""
    m, e, _ = parts(x, digits)
    s = str(m)
    return f"{s[0]}.{s[1:]}e{e}" if digits > 1 else f"{s}e{e}"


def sci_tex(x, digits=3):
    m, e, _ = parts(x, digits)
    s = str(m)
    return f"{s[0]}{{,}}{s[1:]} \\cdot 10^{{{e}}}"


def plain(x, digits=3):
    """x rounded to `digits` figures as a plain number with a point: 656, 58.9, 0.181."""
    r = rounded(x, digits)
    if r.denominator == 1:
        return str(r.numerator)
    k = 0
    while (r * 10**k).denominator != 1:
        k += 1
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    return f"{s[:-k]}.{s[-k:]}"


def tex(num):
    """A plain number as the lessons write it: 58.9 -> 58{,}9."""
    return str(num).replace(".", "{,}")


def from_sci(s):
    """'5.66e14' -> the exact fraction."""
    mant, exp = s.split("e")
    whole, _, frac = mant.partition(".")
    return F(int(whole + frac), 10 ** len(frac)) * F(10) ** int(exp)


def choice_of(sample):
    """The multiple choice of a sample: the answer itself, or the `choice` beside a number."""
    a = sample.get("answer", {})
    return a if a.get("kind") == "choice" else sample.get("choice") or {}


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    kind = sample.get("answer", {}).get("kind")
    if kind not in ("choice", "number"):
        errs.append(f"answer kind {kind}")
    if kind == "number" and "choice" not in sample:
        errs.append("a number answer needs its multiple choice")


def prose(sample):
    return prose_and_extra(sample["problem"])[0]


def need(text, piece, errs):
    """The datum the answer is computed from must be written in the problem."""
    if piece not in text:
        errs.append(f"the problem does not show {piece!r}")


def right_value(sample, value, errs):
    """Four different options, of which the only right one has this value, and `correct` points to it."""
    check_choice(choice_of(sample), lambda o: o["values"] == [value], errs)


def right_text(sample, text, errs):
    """The same, for an option that is a sentence: recognised by its words."""
    check_choice(choice_of(sample), lambda o: option_text(o["latex"]) == text, errs)


def check_number(sample, value, errs):
    """A level answered with a pure number: the number, and the multiple choice with that number as the right option."""
    a = sample["answer"]
    if a.get("kind") != "number" or a.get("value") != str(value):
        errs.append(f"answer {a.get('value')!r}, expected {value}")
    check_choice(sample.get("choice") or {}, lambda o: o["latex"] == str(value) and o["values"] == [str(value)], errs)


def far_from_right(sample, right, errs, unit, gap=F(4, 100)):
    """No wrong option with the same unit within 4% of the right number: a rounding must not decide the answer."""
    for o in choice_of(sample).get("options", []):
        v = o["values"][0]
        if not v.endswith(" " + unit):
            continue
        num = v[: -len(unit) - 1]
        try:
            x = from_sci(num) if "e" in num else F(num)
        except ValueError:
            continue
        if x != right and abs(x / right - 1) < gap:
            errs.append(f"option {v!r} too close to the answer")


def statements(sample, truth, want, errs):
    """Four statements of a table text -> true/false: exactly one has the truth value asked for, and it is `correct`."""
    opts = choice_of(sample).get("options", [])
    for o in opts:
        if option_text(o["latex"]) not in truth:
            errs.append(f"statement not in the table: {option_text(o['latex'])!r}")
            return
    check_choice(choice_of(sample), lambda o: truth[option_text(o["latex"])] is want, errs)
