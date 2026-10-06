"""Helpers shared by the checkers of the first law (physics, third year, group 41): fis_lavoro_termodinamico,
principi_termo, fis_trasformazioni_termodinamiche. Written from docs/lezioni/fisica/README.md and the three specs, not
from src/lib/exercises/v2/fis-termo-pv.ts: the units of lessons 109-111, answers that carry their sign, results that
come from a natural logarithm (computed with sympy to thirty digits), and the scene of the pressure-volume plane.
Numbers are read and written as in _fis_termologia.py; R = 8,31 J/(mol K), 1 atm = 1,01e5 Pa.
"""
import re

from sympy import N, Rational

from checkers._fis_termologia import NUM, common, parse, prose, rounded, sig_of, write

R_GAS = Rational(831, 100)
ATM = Rational(101000)

UNIT = {
    "J": r"\text{J}",
    "Pa": r"\text{Pa}",
    "kPa": r"\text{kPa}",
    "atm": r"\text{atm}",
    "L": r"\text{L}",
    "m3": r"\text{m}^3",
    "K": r"\text{K}",
    "mol": r"\text{mol}",
}
USE_R = r" Usa \$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\."

SIG2 = ("sig", 2)
INT = ("int",)


def d(unit):
    """A regex group for a quantity between dollars with the given unit."""
    return r"\$(" + NUM + r")\\," + re.escape(UNIT[unit]) + r"\$"


def exact_value(x):
    """A Rational as it is; any other sympy number to thirty digits, with a flag that says it was not exact."""
    if isinstance(x, Rational) or isinstance(x, int):
        return Rational(x), True
    return Rational(str(N(x, 30))), False


def near_tie(x, s):
    """True when x is within 0,015 of a unit of the last kept figure from a rounding boundary."""
    from checkers.forze_comune import exponent

    a = abs(Rational(x))
    y = a * Rational(10) ** (s - 1 - exponent(a))
    return abs(y - int(y) - Rational(1, 2)) < Rational(15, 1000)


def expect(sample, errs, truth, unit, fmt):
    """The correct option is truth rounded and written in the format, with its sign; four distinct options written
    the same way, none zero; no answer with an ambiguous final zero."""
    value, is_exact = exact_value(truth)
    if value == 0:
        errs.append("zero answer")
        return
    if not is_exact and fmt[0] == "sig" and near_tie(value, fmt[1]):
        errs.append(f"{float(value)} is too near a tie")
    want = rounded(value, fmt, errs if is_exact else [])
    text = write(want, fmt)
    if "\\cdot" not in text and want == int(want) and int(want) % 10 == 0:
        errs.append(f"answer {text} ends with an ambiguous zero")
    right = text + r"\," + UNIT[unit]
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or isinstance(c, bool) or not 0 <= c < len(opts):
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
        if v == 0:
            errs.append("an option is zero")
            continue
        if write(rounded(v, fmt, []), fmt) != m.group(1):
            errs.append(f"option {o['latex']!r} not written like the answer")
        if Rational(o["values"][0]) != v:
            errs.append("option value differs from its text")
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")


def two_sig(errs, s, what):
    if sig_of(s) != 2:
        errs.append(f"{what} {s} has not two significant figures")
    return parse(s)


def three_whole(errs, s, what):
    """A whole number of three figures that does not end with a zero."""
    v = parse(s)
    if not re.fullmatch(r"\d{3}", s) or v % 10 == 0 or not 105 <= v <= 985:
        errs.append(f"{what} {s} is not a whole number of three figures without a final zero")
    return v


def moles(errs, s):
    v = two_sig(errs, s, "moles")
    if not (Rational(11, 100) <= v <= Rational(99, 100) or Rational(11, 10) <= v <= Rational(39, 10)) or re.search(r"0$", s):
        errs.append("moles out of range")
    return v


# ---------------------------------------------------------------------------
# The scene of the pressure-volume plane


def scene_states(sample, errs, v_axis, p_axis, with_solution=None):
    """The states and the legs of the sample's scene, after checking its type and its axes. With `with_solution` the
    solution's scene must be the same drawing with that `area`."""
    sc = sample.get("scene")
    if not sc or sc.get("type") != "piano-pv":
        errs.append("no piano-pv scene")
        return [], []
    data = sc["data"]
    if data.get("V") != v_axis or data.get("p") != p_axis:
        errs.append(f"scene axes differ from the spec: {data.get('V')}, {data.get('p')}")
    if "area" in data:
        errs.append("the problem's scene shows the area")
    if not sc.get("alt"):
        errs.append("scene without alt")
    states = data.get("stati", [])
    legs = data.get("tratti", [])
    for s in states:
        if not (0 < s["V"] <= v_axis["passo"] * v_axis["celle"] and 0 < s["p"] <= p_axis["passo"] * p_axis["celle"]):
            errs.append(f"state {s['nome']} off the sheet")
    if with_solution:
        sol = sample.get("solutionScene")
        if not sol or sol.get("type") != "piano-pv":
            errs.append("no solution scene")
        else:
            sd = dict(sol["data"])
            if sd.pop("area", None) != with_solution:
                errs.append("solution scene without the right area")
            if sd != data:
                errs.append("solution scene differs from the problem's")
    return states, legs


def on_grid(errs, states, v_step, p_step):
    for s in states:
        if Rational(str(s["V"])) % Rational(str(v_step)) != 0 or Rational(str(s["p"])) % Rational(str(p_step)) != 0:
            errs.append(f"state {s['nome']} is not on the grid")


__all__ = ["ATM", "INT", "R_GAS", "SIG2", "UNIT", "USE_R", "NUM", "common", "d", "expect", "moles", "on_grid", "parse", "prose", "scene_states", "three_whole", "two_sig"]
