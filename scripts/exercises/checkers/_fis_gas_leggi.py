"""Helpers shared by the checkers of the gas laws (physics, third year, group 39): fis_legge_boyle,
fis_leggi_gay_lussac, fis_gas_perfetto. Written from docs/lezioni/fisica/README.md ("Notazioni del terzo anno": gas)
and from the three specs, not from src/lib/exercises/v2/fis-gas-leggi.ts. Numbers are read and written as the
thermology checkers do (decimal comma {,}, thin spaces from five digits, scientific notation with \\cdot 10^{k},
rounding half up); what is added here are the units of the gas lessons, the answers that are pure numbers in
scientific notation (a number of molecules) and the scene of the cylinder with its piston.
"""
import re

from sympy import Rational

from checkers._fis_termologia import NUM, common, parse, prose, rounded, sig_of, write
from checkers.forze_comune import exponent, fixed, round_sig

UNIT = {
    "Pa": r"\text{Pa}",
    "kPa": r"\text{kPa}",
    "m3": r"\text{m}^3",
    "L": r"\text{L}",
    "cm3": r"\text{cm}^3",
    "cm2": r"\text{cm}^2",
    "cm": r"\text{cm}",
    "m": r"\text{m}",
    "kg": r"\text{kg}",
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "mol": r"\text{mol}",
    "J": r"\text{J}",
}

# The constants of the lessons (README di fisica, notazioni del terzo anno).
P_ATM = Rational(101000)  # Pa
G = Rational(98, 10)  # m/s²
R_GAS = Rational(831, 100)  # J/(mol·K)
K_B = Rational(138, 100) / Rational(10) ** 23  # J/K
ZERO_C = Rational(273)

G_TEXT = r"\$g = 9\{,\}8\\,\\text\{m/s\}\^2\$"
R_TEXT = r"\$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$"
KB_TEXT = r"\$k_B = 1\{,\}38 \\cdot 10\^\{-23\}\\,\\text\{J/K\}\$"

SIG2 = ("sig", 2)
SIG3 = ("sig", 3)
INT = ("int",)


def qty(unit):
    """A regex group for a quantity between dollars with the given unit."""
    return r"\$(" + NUM + r")\\," + re.escape(UNIT[unit]) + r"\$"


def ends_in_zero(written):
    """A whole number written with a final zero (120, 2\\,300): its significant figures are ambiguous."""
    return re.fullmatch(r"-?[\d\\,]*0", written) is not None and parse(written) != 0


def expect(sample, errs, truth, unit, fmt, signed=False, plain_answer=True):
    """The correct option is truth rounded and written in the format with its unit; four distinct options, each
    written the same way, positive unless signed. With plain_answer the answer must not end in an ambiguous zero."""
    want = rounded(truth, fmt, errs)
    num = write(want, fmt)
    if plain_answer and ends_in_zero(num):
        errs.append(f"answer {num} ends in an ambiguous zero")
    right = num + r"\," + UNIT[unit]
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
    if "\\approx" not in sample["solution"] or right not in sample["solution"]:
        errs.append("solution does not show the answer")


def sci_text(x, s):
    """x > 0 with s significant figures, always in scientific notation: 2{,}5 \\cdot 10^{19}."""
    v = round_sig(x, s)
    e = exponent(v)
    return f"{fixed(v / Rational(10) ** e, s - 1)} \\cdot 10^{{{e}}}"


def expect_sci(sample, errs, truth, s):
    """The options are pure numbers in scientific notation with s figures; the correct one is truth rounded."""
    truth = Rational(truth)
    scaled = truth * Rational(10) ** (s - 1 - exponent(truth))
    if scaled - int(scaled) == Rational(1, 2):
        errs.append("the answer is a tie")
    right = sci_text(truth, s)
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
    vals = set()
    for o in a["options"]:
        m = re.fullmatch(r"\d\{,\}(\d+) \\cdot 10\^\{(-?\d+)\}", o["latex"])
        if not m or len(m.group(1)) != s - 1:
            errs.append(f"option {o['latex']!r} is not in scientific notation with {s} figures")
            continue
        v = parse(o["latex"])
        vals.add(v)
        if Rational(o["values"][0]) != v:
            errs.append("option value differs from its text")
    if len(vals) != 4:
        errs.append("two options with the same value")
    if right not in sample["solution"]:
        errs.append("solution does not show the answer")


def label_number(text):
    """The number of a scene's label ('h_1 = 30,0 cm'), exactly."""
    m = re.fullmatch(r"[A-Za-z]+(?:_\w+)? = (−?[\d,]+) .+", text)
    if not m:
        raise ValueError(f"label not recognised: {text!r}")
    return Rational(m.group(1).replace("−", "-").replace(",", "."))


def cylinder(errs, scene, what):
    """The scene is the cylinder with its piston; returns its data."""
    if not isinstance(scene, dict) or scene.get("type") != "cilindro-pistone":
        errs.append(f"{what}: the scene is not cilindro-pistone")
        return {}
    if not scene.get("alt"):
        errs.append(f"{what}: scene without alt")
    data = scene.get("data", {})
    if not (0 < data.get("altezza", 0) <= data.get("scala", 0)):
        errs.append(f"{what}: the piston is outside the cylinder")
    return data


__all__ = [
    "UNIT", "NUM", "P_ATM", "G", "R_GAS", "K_B", "ZERO_C", "G_TEXT", "R_TEXT", "KB_TEXT", "SIG2", "SIG3", "INT",
    "qty", "parse", "prose", "common", "expect", "expect_sci", "ends_in_zero", "sig_of", "label_number", "cylinder",
]
