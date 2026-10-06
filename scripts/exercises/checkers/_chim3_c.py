"""Shared helpers for the checkers of the chemistry chapter on the nucleus (third year, group C: chim-radioattivita,
chim-tempo-dimezzamento, chim-fissione-fusione), written from the specs and the lessons 54-56, not from the generators.

Element symbols and names are read from src/lib/tools/elementi.json, the site's periodic table. Nuclides are written
{}^{238}_{\\ 92}\\mathrm{U}, with the atomic number padded under the mass number. Numbers have the decimal comma,
a \\cdot 10^{n}, and a unit upright after a thin space.
"""
import json
import re
from pathlib import Path

from sympy import Float, Rational, floor, log

from checkers._fis_grandezze import BANNED, check_choice, prose_and_extra  # noqa: F401 (re-exported)

_ELEMENTS = json.loads((Path(__file__).resolve().parents[3] / "src/lib/tools/elementi.json").read_text(encoding="utf-8"))
SYMBOLS = [e["symbol"] for e in _ELEMENTS][:96]
NAMES = [e["name"].lower() for e in _ELEMENTS][:96]
Z_OF = {s: i + 1 for i, s in enumerate(SYMBOLS)}

NUC = r"\{\}\^\{(\d+)(\\mathrm\{m\})?\}_\{((?:\\ )*)(\d+)\}\\mathrm\{([A-Z][a-z]?)\}"
ALPHA = "{}^{4}_{2}\\mathrm{He}"
ELECTRON = "{}^{\\ 0}_{-1}e"
POSITRON = "{}^{\\ 0}_{+1}e"
NEUTRON = "{}^{1}_{0}n"


def nuclide(latex):
    """{}^{A}_{Z}\\mathrm{X} -> (Z, A, excited?). The symbol must be the one of Z, and Z padded to the width of A."""
    m = re.fullmatch(NUC, latex.strip())
    if not m:
        raise ValueError(f"not a nuclide: {latex!r}")
    A, Z, s = int(m.group(1)), int(m.group(4)), m.group(5)
    if Z_OF.get(s) != Z:
        raise ValueError(f"symbol {s} does not have Z = {Z}")
    width = len(m.group(1)) + (1 if m.group(2) else 0)
    if m.group(3).count("\\ ") != max(0, width - len(m.group(4))):
        raise ValueError(f"atomic number not padded as the lesson writes it: {latex!r}")
    return Z, A, bool(m.group(2))


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


def check_number(sample, value, errs):
    """A level answered with a pure number: the number, and the multiple choice with that number as the right option."""
    a = sample["answer"]
    if a.get("kind") != "number" or a.get("value") != str(value):
        errs.append(f"answer {a.get('value')!r}, expected {value}")
    check_choice(sample.get("choice") or {}, lambda o: o["latex"] == str(value) and o["values"] == [str(value)], errs)


# ---------------------------------------------------------------------------
# Numbers


def dec(s):
    """3{,}20 -> 16/5."""
    s = s.strip()
    if not re.fullmatch(r"-?\d+(\{,\}\d+)?", s):
        raise ValueError(f"not a decimal: {s!r}")
    return Rational(s.replace("{,}", "."))


def sci(s):
    """a \\cdot 10^{n} or a plain decimal -> exact value."""
    m = re.fullmatch(r"(\d+(?:\{,\}\d+)?) \\cdot 10\^\{(-?\d+)\}", s.strip())
    if m:
        return dec(m.group(1)) * Rational(10) ** int(m.group(2))
    return dec(s)


def near_tie(x, k):
    """Is x within 1e-6 (relative to the digit) of a rounding tie at the digit 10^k?"""
    y = x / Rational(10) ** k
    return abs(y - floor(y) - Rational(1, 2)) < Rational(1, 10**6)


def sig_tex(x, n):
    """x > 0 rounded to n significant figures as the lessons write it: plain from 0,001 to below 10^n, otherwise
    a \\cdot 10^{e}. None near a tie."""
    x = Rational(x) if not isinstance(x, Float) else x
    if x <= 0:
        return None
    e = int(floor(log(x, 10).evalf(30)))
    while Rational(10) ** e > x:
        e -= 1
    while Rational(10) ** (e + 1) <= x:
        e += 1
    if near_tie(x, e - n + 1):
        return None
    m = int(floor(x / Rational(10) ** (e - n + 1) + Rational(1, 2)))
    if m >= 10**n:
        m //= 10
        e += 1
    if -3 <= e < n:
        k = n - 1 - e
        s = str(m).rjust(k + 1, "0")
        return s if k == 0 else f"{s[:-k]}{{,}}{s[-k:]}"
    digits = str(m)
    mant = digits[0] + ("{,}" + digits[1:] if n > 1 else "")
    return f"{mant} \\cdot 10^{{{e}}}"


def ambiguous_zero(tex):
    return re.fullmatch(r"\d*0", tex) is not None


def split_unit(latex):
    """'3{,}5 \\cdot 10^{-11}\\,\\text{J}' -> ('3{,}5 \\cdot 10^{-11}', 'J'); a percentage has the unit '%'."""
    m = re.fullmatch(r"(.*?)\\,(?:\\text\{([^}]*)\}|(\\%))", latex.strip())
    if not m:
        raise ValueError(f"no unit in {latex!r}")
    return m.group(1), m.group(2) or "%"


# ---------------------------------------------------------------------------
# Real nuclides and how they decay (NUBASE2020, Kondev et al., Chinese Physics C 45, 030001, 2021): (Z, A)

ALPHA_EMITTERS = {
    (60, 144), (62, 146), (62, 147), (64, 148), (83, 211), (84, 208), (84, 210), (84, 218), (86, 219), (86, 220), (86, 222),
    (87, 221), (88, 223), (88, 224), (88, 226), (89, 225), (90, 228), (90, 229), (90, 230), (90, 232), (91, 231), (92, 234),
    (92, 235), (92, 236), (92, 238), (93, 237), (94, 238), (94, 239), (94, 240), (94, 242), (95, 241), (95, 243), (96, 245),
    (96, 246), (96, 247),
}
BETA_MINUS_EMITTERS = {
    (1, 3), (6, 14), (7, 16), (9, 20), (10, 23), (11, 24), (12, 27), (14, 31), (15, 32), (15, 33), (16, 35), (18, 41), (19, 42),
    (20, 45), (26, 59), (27, 60), (28, 63), (36, 85), (38, 89), (38, 90), (39, 90), (40, 95), (42, 99), (43, 99), (44, 106),
    (47, 111), (50, 121), (53, 131), (54, 133), (55, 137), (56, 140), (57, 140), (58, 144), (61, 147), (63, 154), (65, 160),
    (73, 182), (74, 187), (76, 191), (79, 198), (80, 203), (81, 208), (82, 210), (82, 212), (82, 214), (83, 210), (88, 228),
    (89, 228), (90, 231), (90, 234), (91, 234), (92, 239), (93, 239),
}
BETA_PLUS_EMITTERS = {
    (6, 10), (6, 11), (7, 13), (8, 14), (8, 15), (9, 17), (9, 18), (10, 19), (11, 21), (11, 22), (12, 23), (13, 25), (14, 27),
    (15, 30), (16, 31), (17, 33), (18, 35), (19, 38), (20, 39), (21, 43), (25, 52), (31, 68), (37, 82),
}
CAPTURE_NUCLIDES = {
    (4, 7), (18, 37), (20, 41), (22, 44), (23, 49), (24, 51), (25, 53), (25, 54), (26, 55), (27, 57), (31, 67), (32, 68),
    (32, 71), (33, 73), (34, 72), (34, 75), (36, 81), (37, 83), (38, 82), (38, 85), (46, 103), (48, 109), (49, 111), (53, 125),
    (55, 131), (56, 133),
}
GAMMA_EMITTERS = {(43, 99), (56, 137)}

# Stable isotopes (mass numbers) of the elements level 5 uses, by Z.
STABLE = {
    6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22], 11: [23], 12: [24, 25, 26], 13: [27],
    14: [28, 29, 30], 15: [31], 16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40], 21: [45], 22: [46, 47, 48, 49, 50],
    24: [50, 52, 53, 54], 25: [55], 26: [54, 56, 57, 58], 27: [59], 28: [58, 60, 61, 62, 64], 29: [63, 65],
    30: [64, 66, 67, 68, 70], 31: [69, 71], 33: [75], 35: [79, 81], 36: [78, 80, 82, 83, 84, 86], 38: [84, 86, 87, 88],
}


def family(head, path):
    """The nuclides of a radioactive family: from the head, 'a' is an α decay and 'b' a β⁻ decay."""
    out = [head]
    for c in path:
        Z, A = out[-1]
        out.append((Z - 2, A - 4) if c == "a" else (Z + 1, A))
    return out


# uranium-238, uranium-235 and thorium-232, main branches
FAMILIES = [family((92, 238), "abbaaaaabbabba"), family((92, 235), "ababaaaabab"), family((90, 232), "abbaaaabba")]


def dec_tex(r):
    """A terminating decimal as the lessons write it, exact: 10{,}54, 24."""
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            raise ValueError(f"{r} is not a terminating decimal")
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    return s if k == 0 else f"{s[:-k]}{{,}}{s[-k:]}"


def exact_tex(r):
    """An exact quantity: plain below 100 000, otherwise a \\cdot 10^{e} with the whole mantissa."""
    r = Rational(r)
    if r < 10**5:
        return dec_tex(r)
    e = 0
    while Rational(10) ** (e + 1) <= r:
        e += 1
    return f"{dec_tex(r / Rational(10) ** e)} \\cdot 10^{{{e}}}"


def real(expr, digits=40):
    """A real number (a power, a logarithm) as a rational close to it, for the rounding checks."""
    return Rational(str(expr.evalf(digits)))
