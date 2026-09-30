"""Helpers shared by the checkers of the fluids at rest (physics, first year, group 8): fis_pressione,
fis_legge_pascal, fis_legge_stevino. Written from docs/lezioni/fisica/README.md and the three specs, not from the
generators. Numbers as in the forces' checkers (forze_comune: decimal comma, thin spaces, scientific notation with
\\cdot 10^{k}, rounding half up to significant figures); units with an exponent are written outside the \\text:
\\,\\text{cm}^2, \\,\\text{kg/m}^3.
"""
import re

from sympy import Rational

from checkers.forze_comune import NUM, fmt_exact, fmt_sig, is_tie, parse_num, round_sig, sig_figs

G = Rational(98, 10)  # N/kg
P0 = Rational(101000)  # Pa, 1,01 · 10^5


def unit_tex(u):
    m = re.fullmatch(r"(.*?)(\^\d)?", u)
    return "\\text{" + m.group(1) + "}" + (m.group(2) or "")


def with_u(num, u):
    return f"{num}\\,{unit_tex(u)}"


def quantity(s):
    """'$3{,}5 \\cdot 10^{2}\\,\\text{cm}^2$' or without dollars -> (value, unit, digits as written)."""
    s = s.strip().strip("$")
    m = re.fullmatch(r"(" + NUM + r")\\,\\text\{([^}]*)\}(\^\d)?", s)
    if not m:
        raise ValueError(f"not a quantity: {s!r}")
    return parse_num(m.group(1)), m.group(2) + (m.group(3) or ""), m.group(1)


Q = r"\$([^$]+)\$"


def grab(rx, s):
    """Full match of rx, where {Q} is a quantity between dollars; returns the list of (value, unit, digits)."""
    m = re.fullmatch(rx.replace("{Q}", Q), s)
    if not m:
        return None
    out = []
    for g in m.groups():
        try:
            out.append(quantity("$" + g + "$"))
        except ValueError:
            out.append(g)
    return out


def need(errs, q, unit, figures=2, what="datum"):
    """A quantity in the given unit with at most `figures` significant figures, written as the lessons write data: an
    integer from 100 up as it is (1200, the zeros are placeholders), anything else with exactly `figures` figures."""
    v, u, digits = q
    if u != unit:
        errs.append(f"{what} in {u}, expected {unit}")
    if figures is not None:
        plain_int = re.fullmatch(r"\d+(?:\\,\d{3})*", digits) and v >= 100
        if round_sig(v, figures) != v:
            errs.append(f"{what} {digits!r} has more than {figures} significant figures")
        elif not plain_int and sig_figs(digits) != figures:
            errs.append(f"{what} {digits!r} not written with {figures} significant figures")
        elif plain_int and fmt_exact(v) != digits:
            errs.append(f"{what} {digits!r} not written as the integer {fmt_exact(v)}")
    return v


def expect(errs, sample, truth, unit, s=2):
    """The answer is truth rounded to s figures (no tie); the choice has four distinct options with the unit, each
    rounded to s figures, exactly one of them the answer."""
    truth = Rational(truth)
    if truth <= 0:
        errs.append(f"true answer {truth} not positive")
        return
    if is_tie(truth, s):
        errs.append(f"{truth} is a tie at {s} significant figures")
    want = round_sig(truth, s)
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != want:
        errs.append(f"answer {ans.get('value')} != {want}")
    if sample.get("params", {}).get("unit") != unit:
        errs.append(f"unit {sample.get('params', {}).get('unit')} != {unit}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
        return
    opts = ch.get("options", [])
    vals = [Rational(o["values"][0]) for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4:
        errs.append(f"choice needs four distinct options: {[o['values'] for o in opts]}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or vals[idx] != want:
        errs.append("choice.correct is not the truth")
    for o, v in zip(opts, vals):
        if v <= 0:
            errs.append(f"option {v} not positive")
            continue
        if round_sig(v, s) != v:
            errs.append(f"option {v} not rounded to {s} figures")
        w = with_u(fmt_sig(v, s), unit)
        if o["latex"] != w:
            errs.append(f"option latex {o['latex']!r} != {w!r}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options are written the same way")


def scene(errs, sample, kind):
    sc = sample.get("scene")
    if not sc or sc.get("type") != kind or not sc.get("alt"):
        errs.append(f"no {kind} scene with an alt")
        return {}
    return sc.get("data", {})


__all__ = ["G", "P0", "Q", "expect", "fmt_exact", "fmt_sig", "grab", "need", "quantity", "scene", "unit_tex", "with_u"]
