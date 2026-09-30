"""Helpers for the checkers of the principles of dynamics (physics, second year, group 15: fis-primo-principio,
leggi-newton, fis-terzo-principio, fis-diagramma-corpo-libero). Written from the specs and the lessons 50-53, not from
src/lib/exercises/v2/fis-dinamica.ts.

Values are exact (sympy); the answer is rounded half up to two significant figures with _vettori.round_sig, which
refuses values within 1e-9 of a boundary; accelerations are written 2{,}4\\,\\text{m/s}^2, results in scientific
notation 3{,}3 \\cdot 10^{-25}.
"""
import re

from sympy import Rational, floor, log

from checkers._vettori import check_choice, round_sig, sig_of

G = Rational(49, 5)
NUMR = r"(\d+(?:\{,\}\d+)?)"
KG = r"\$" + NUMR + r"\\,\\text\{kg\}\$"
NW = r"\$" + NUMR + r"\\,\\text\{N\}\$"
SEC = r"\$" + NUMR + r"\\,\\text\{s\}\$"
ACC = r"\$" + NUMR + r"\\,\\text\{m/s\}\^2\$"
ANG = r"\$(\d+)\^\\circ\$"


def data2(errs, s, what):
    """A datum with two unambiguous significant figures."""
    if sig_of(s) != 2 or re.fullmatch(r"\d0", s):
        errs.append(f"{what} {s} has not two unambiguous significant figures")
    return Rational(s.replace("{,}", "."))


def unit_tex(unit):
    return {"N": r"\,\text{N}", "kg": r"\,\text{kg}", "acc": r"\,\text{m/s}^2", "": ""}[unit]


def answer2(sample, errs, truth, unit, low=Rational(1), direction=None):
    """The right option is truth rounded to two significant figures with its unit (and a direction, "verso destra",
    for an acceleration); the others are written alike."""
    want = round_sig(truth, 2)
    if want is None:
        errs.append(f"{truth.evalf(12)} too close to a rounding boundary, or too large")
        return
    if truth < low:
        errs.append(f"result {truth.evalf(6)} under {low}")
    if re.fullmatch(r"[1-9]0", want):
        errs.append(f"result {want} has an ambiguous trailing zero")
    u = unit_tex(unit)
    right = want + u + (f"\\ \\text{{{direction}}}" if direction else "")
    for o in check_choice(sample, errs, right):
        extra = r"(?:\\ \\text\{verso (?:l'alto|il basso|destra|sinistra)\})?" if unit == "acc" else ""
        m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)" + re.escape(u) + extra, o)
        if not m or (sig_of(m.group(1)) != 2 and m.group(1) != "0") or re.fullmatch(r"[1-9]0", m.group(1)):
            errs.append(f"option {o!r} is not written like the answer")


def sci_round(x):
    """Exact x > 0 as (mantissa string with two significant figures, exponent), half up; None near a boundary."""
    e = int(floor(log(x, 10).evalf(60)))
    if Rational(10) ** e > x:
        e -= 1
    if Rational(10) ** (e + 1) <= x:
        e += 1
    m = round_sig(x / Rational(10) ** e, 2)
    if m is None:
        return None
    if m == "10":
        e += 1
        m = "1{,}0"
    return m, e


def sci_tex(x):
    r = sci_round(x)
    return None if r is None else f"{r[0]} \\cdot 10^{{{r[1]}}}"


def answer_sci(sample, errs, truth, unit):
    want = sci_tex(truth)
    if want is None:
        errs.append("result too close to a rounding boundary")
        return
    u = unit_tex(unit)
    for o in check_choice(sample, errs, want + u):
        if not (re.fullmatch(r"\d\{,\}\d \\cdot 10\^\{-?\d+\}" + re.escape(u), o) or re.fullmatch(r"\d+(?:\{,\}\d+)?" + re.escape(u), o)):
            errs.append(f"option {o!r} is not written like the answer")


def scene_forces(sample, errs, kind, expected):
    """The problem's scene is `kind` with exactly the forces expected: [(name, sub, modulus, angle)]."""
    sc = sample.get("scene")
    if not sc or sc.get("type") != kind:
        errs.append(f"no {kind} scene")
        return
    got = sorted((F["nome"], F.get("sub"), Rational(str(F["modulo"])), Rational(str(F["angolo"]))) for F in sc["data"]["forze"])
    want = sorted((n, s, Rational(m), Rational(a)) for n, s, m, a in expected)
    if len(got) != len(want) or any(g[0] != w[0] or g[1] != w[1] or abs(g[2] - w[2]) > Rational(1, 1000) or abs(g[3] - w[3]) > Rational(1, 1000) for g, w in zip(got, want)):
        errs.append(f"scene forces {got} are not {want}")


def no_scene(sample, errs):
    if sample.get("scene"):
        errs.append("unexpected scene")
