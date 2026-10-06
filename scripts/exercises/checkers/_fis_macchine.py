"""Helpers shared by the checkers of the heat engines (physics, third year, group 43): fis_macchine_termiche,
fis_enunciati_kelvin_clausius, fis_ciclo_carnot. Written from docs/lezioni/fisica/README.md and the three specs, not
from src/lib/exercises/v2/fis-macchine.ts. Numbers are written with the decimal comma {,} and \\cdot 10^{k}; the unit
follows a thin space; an efficiency is a pure number with two decimals. Rounding is half up; exact arithmetic with
sympy Rationals.
"""
import re

from sympy import Rational

from checkers._fis_termologia import NUM, common, parse, prose, rounded, sig_of, write

UNIT = {
    "none": "",
    "J": r"\text{J}",
    "kJ": r"\text{kJ}",
    "kW": r"\text{kW}",
    "K": r"\text{K}",
    "C": r"^\circ\text{C}",
    "min": r"\text{min}",
    "mol": r"\text{mol}",
    "L": r"\text{L}",
    "kPa": r"\text{kPa}",
}

ETA = ("fixed", 2)
SIG2 = ("sig", 2)
SIG3 = ("sig", 3)
INT = ("int",)


def tail(unit):
    return (r"\," + UNIT[unit]) if unit != "none" else ""


def q(unit):
    """A regex group for a quantity between dollars with the given unit (`none`: the bare number)."""
    return r"\$(" + NUM + r")" + re.escape(tail(unit)) + r"\$"


def two_sig(errs, s, what):
    """A datum with two significant figures and no ambiguous zero (1,1 to 9,9 times a power of ten)."""
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return parse(s)


def ambiguous(v, fmt):
    """A whole number that ends with a zero and is not written in scientific notation."""
    v = abs(Rational(v))
    if fmt[0] == "fixed" and fmt[1] > 0:
        return False
    if fmt[0] == "sig" and v >= 10 ** fmt[1]:
        return False
    return v.q == 1 and v.p % 10 == 0


def expect(sample, errs, truth, unit, fmt):
    """The correct option is truth rounded and written in the format, with the unit; four distinct positive options,
    all written the same way, each with the value its text says."""
    want = rounded(truth, fmt, errs)
    if ambiguous(want, fmt):
        errs.append(f"the answer {want} ends with an ambiguous zero")
    right = write(want, fmt) + tail(unit)
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return []
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4:
        errs.append(f"need four distinct options: {opts}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return []
    if opts[c] != right:
        errs.append(f"correct option {opts[c]!r} != {right!r}")
    vals = []
    for o in a["options"]:
        m = re.fullmatch(r"(" + NUM + r")" + re.escape(tail(unit)), o["latex"])
        if not m:
            errs.append(f"option {o['latex']!r} has not the unit {unit}")
            continue
        v = parse(m.group(1))
        vals.append(v)
        if write(rounded(v, fmt, []), fmt) != m.group(1):
            errs.append(f"option {o['latex']!r} not written like the answer")
        if v <= 0:
            errs.append(f"option {o['latex']!r} not positive")
        if Rational(o["values"][0]) != v:
            errs.append("option value differs from its text")
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    return vals


def expect_words(sample, errs, table, right):
    """The four options are the sentences of `table` (key -> text), each once, and the correct one has the key
    `right`."""
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a.get("options", [])
    got = {o["values"][0]: o["latex"] for o in opts}
    if len(opts) != 4 or got != {k: r"\text{" + v + "}" for k, v in table.items()}:
        errs.append(f"options are not the four sentences of the spec: {[o['latex'] for o in opts]}")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")
        return
    if opts[c]["values"][0] != right:
        errs.append(f"correct option is {opts[c]['values'][0]!r}, should be {right!r}")
    for o in opts:
        if o.get("text") != table.get(o["values"][0]):
            errs.append("option text differs from its formula")


def label(value, unit):
    """A value as a drawing's label writes it: decimal comma, a space before the unit."""
    v = Rational(value)
    s = str(v.p) if v.q == 1 else write(v, ("fixed", len(str(float(v)).split(".")[1]))).replace("{,}", ",")
    return f"{s} {unit}"


def engine_scene(sample, errs, n):
    """The scene `macchina-termica` with n devices; returns them."""
    sc = sample.get("scene")
    if not sc or sc.get("type") != "macchina-termica":
        errs.append("missing scene macchina-termica")
        return [{}] * n
    if not sc.get("alt"):
        errs.append("scene without alt")
    ds = sc.get("data", {}).get("dispositivi", [])
    if len(ds) != n:
        errs.append(f"scene with {len(ds)} devices, not {n}")
        return [{}] * n
    return ds


def flow(errs, device, where, verso, testo):
    """The device's arrow `where` (caldo, freddo, lavoro) has that direction and that label; testo None: no arrow."""
    f = device.get(where)
    if testo is None:
        if f is not None:
            errs.append(f"scene: unexpected arrow {where}")
        return
    if not f or f.get("verso") != verso or f.get("testo") != testo:
        errs.append(f"scene: arrow {where} is {f!r}, expected {verso} {testo!r}")


def no_scene(sample, errs):
    if sample.get("scene") is not None:
        errs.append("unexpected scene")


__all__ = ["UNIT", "ETA", "SIG2", "SIG3", "INT", "NUM", "q", "parse", "prose", "common", "two_sig", "expect", "expect_words", "label", "engine_scene", "flow", "no_scene", "ambiguous", "rounded", "write"]
