"""Helpers shared by the checkers of the kinetic theory and of the internal energy (physics, third year, group 40):
fis_teoria_cinetica, fis_temperatura_microscopica, fis_sistemi_termodinamici, fis_energia_interna. Written from
docs/lezioni/fisica/README.md and the four specs, not from src/lib/exercises/v2/fis-cinetica.ts.

Numbers as the lessons write them: decimal comma {,}, thin spaces \\, between thousands from five digits, a minus sign,
scientific notation with \\cdot 10^{k} when the integer part would need more digits than the significant figures or
the value is under 0,001. Every datum is read from the text as an exact Rational; answers that are square roots are
rounded from fifty digits. Rounding is half up on the absolute value, and a tie is an error.

Constants of the README: R = 8,31 J/(mol K), k_B = 1,38e-23 J/K, N_A = 6,02e23 mol^-1.
"""
import re
from fractions import Fraction

from sympy import Rational, floor, sqrt  # noqa: F401  (sqrt for the checkers)

from checkers.forze_comune import prose as _prose

BANNED = re.compile(r"—|piuttosto che")

R_GAS = Rational(831, 100)
K_B = Rational(138, 100) * Rational(10) ** -23
N_A = Rational(602, 100) * Rational(10) ** 23

UNIT = {
    "": "",
    "J": r"\text{J}",
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "ms": r"\text{m/s}",
    "Pa": r"\text{Pa}",
    "kPa": r"\text{kPa}",
    "kg": r"\text{kg}",
    "g": r"\text{g}",
    "gmol": r"\text{g/mol}",
    "mol": r"\text{mol}",
    "L": r"\text{L}",
    "cm": r"\text{cm}",
    "kgm3": r"\text{kg/m}^3",
}

NUM = r"-?(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"
_NUM = re.compile(r"(-?)((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?")

# molar masses in g/mol, as the lessons give them, and whether the gas is monatomic
GASES = {
    "idrogeno": ("2{,}02", False),
    "elio": ("4{,}00", True),
    "metano": ("16{,}0", False),
    "ammoniaca": ("17{,}0", False),
    "neon": ("20{,}2", True),
    "azoto": ("28{,}0", False),
    "ossigeno": ("32{,}0", False),
    "fluoro": ("38{,}0", False),
    "argon": ("39{,}9", True),
    "anidride carbonica": ("44{,}0", False),
    "ozono": ("48{,}0", False),
    "butano": ("58{,}1", False),
    "cloro": ("70{,}9", False),
    "kripton": ("83{,}8", True),
    "xeno": ("131", True),
}
GAS = "(" + "|".join(re.escape(k) for k in sorted(GASES, key=len, reverse=True)) + ")"


def prose(tex):
    return _prose(tex)


def parse(s):
    """A number as written, exactly."""
    m = _NUM.fullmatch(s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    whole = m.group(2).replace("\\,", "")
    frac = m.group(3) or ""
    v = Rational(int(whole + frac), 10 ** len(frac))
    if m.group(4):
        v *= Rational(10) ** int(m.group(4))
    return -v if m.group(1) else v


def sig_of(s):
    """Significant figures of a number as written (the zeros at the end count)."""
    digits = re.sub(r" \\cdot 10\^\{-?\d+\}", "", s).replace("\\,", "").replace("{,}", "").lstrip("-").strip()
    return len(digits.lstrip("0"))


def q(unit):
    """A regex group for a quantity between dollars with the given unit."""
    u = UNIT[unit]
    return r"\$(" + NUM + r")" + (r"\\," + re.escape(u) if u else "") + r"\$"


def exact(x):
    """A Rational: x itself, or fifty digits of an irrational value."""
    x = Rational(x) if not hasattr(x, "is_Rational") else x
    if x.is_Rational:
        return x, True
    return Rational(str(x.evalf(50))), False


def exponent(a):
    """e with 10^e <= a < 10^(e+1), for a positive Rational."""
    e = len(str(a.p)) - len(str(a.q))
    while Rational(10) ** e > a:
        e -= 1
    while Rational(10) ** (e + 1) <= a:
        e += 1
    return e


def round_sig(x, s, errs=None):
    """x rounded to s significant figures: (negative, digits, exponent of the first digit)."""
    r, is_exact = exact(x)
    if r == 0:
        raise ValueError("zero cannot be rounded to significant figures")
    a = abs(r)
    e = exponent(a)
    scaled = a * Rational(10) ** (s - 1 - e)
    if is_exact and scaled - floor(scaled) == Rational(1, 2) and errs is not None:
        errs.append(f"{x} is a tie at {s} figures")
    d = int(floor(scaled + Rational(1, 2)))
    if d == 10**s:
        d //= 10
        e += 1
    return r < 0, d, e


def write(neg, d, e, s):
    digits = str(d)
    sign = "-" if neg else ""
    if e >= s or e < -3:
        m = digits[0] + ("{,}" + digits[1:] if s > 1 else "")
        return f"{sign}{m} \\cdot 10^{{{e}}}"
    if e >= 0:
        whole, frac = digits[: e + 1], digits[e + 1 :]
        if len(whole) >= 5:
            whole = re.sub(r"\B(?=(\d{3})+(?!\d))", r"\\,", whole)
        return sign + whole + ("{,}" + frac if frac else "")
    return f"{sign}0{{,}}{'0' * (-e - 1)}{digits}"


def fmt(x, s, errs=None):
    return write(*round_sig(x, s, errs), s)


def with_unit(num, unit):
    return num + (r"\," + UNIT[unit] if UNIT[unit] else "")


def expect(sample, errs, truth, unit, s, signed=False):
    """The correct option is the truth rounded to s figures and written as the lessons do, with the unit; it is not a
    whole number ending in zero; the four options are distinct, written the same way, positive unless signed, and
    their `values` say what their text says."""
    neg, d, e = round_sig(truth, s, errs)
    if e == s - 1 and d % 10 == 0:
        errs.append("the answer ends with an ambiguous zero")
    right = with_unit(write(neg, d, e, s), unit)
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
    if not sample.get("solution", "").endswith(right):
        errs.append(f"the solution does not end with {right!r}")
    tail = (r"\\," + re.escape(UNIT[unit])) if UNIT[unit] else ""
    vals = []
    for o in a["options"]:
        m = re.fullmatch(r"(" + NUM + r")" + tail, o["latex"])
        if not m:
            errs.append(f"option {o['latex']!r} is not a number with the unit {unit!r}")
            continue
        v = parse(m.group(1))
        vals.append(v)
        if v == 0 or fmt(v, s) != m.group(1):
            errs.append(f"option {o['latex']!r} not written with {s} figures")
        if not signed and v <= 0:
            errs.append(f"option {o['latex']!r} not positive")
        if Rational(Fraction(o["values"][0])) != v:
            errs.append(f"option value {o['values'][0]!r} differs from its text {o['latex']!r}")
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")


def label_text(tex):
    """The words of an option written as one or two lines of \\text{}."""
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", tex)
    parts = m.group(1).split(r" \\ ") if m else [tex]
    out = []
    for p in parts:
        t = re.fullmatch(r"\\text\{(.*)\}", p)
        if not t:
            raise ValueError(f"option is not text: {tex!r}")
        out.append(t.group(1))
    return " ".join(out)


def expect_label(sample, errs, right, allowed):
    """The correct option says `right`; the four options are different and all among `allowed`."""
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    texts = [label_text(o["latex"]) for o in a["options"]]
    if len(texts) != 4 or len(set(texts)) != 4:
        errs.append(f"need four distinct options: {texts}")
    for o, text in zip(a["options"], texts):
        if o["values"] != [text]:
            errs.append(f"option value {o['values']!r} differs from its text {text!r}")
        if text not in allowed:
            errs.append(f"option {text!r} is not one of the level's")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(texts):
        errs.append("correct index out of range")
        return
    if texts[c] != right:
        errs.append(f"correct option {texts[c]!r} != {right!r}")


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")


def run(levels, sample):
    """check(sample) for a checker whose levels are functions (sample, errs) -> kind."""
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in levels:
        return [f"unknown level {lvl}"], None
    try:
        kind = levels[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
