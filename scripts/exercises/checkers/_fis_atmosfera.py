"""Helpers shared by the checkers of atmospheric pressure and Archimedes (physics, first year, group 9):
fis_pressione_atmosferica and fis_archimede. Written from docs/lezioni/fisica/README.md and from the two specs.

Numbers are read and written with forze_comune (decimal comma, thin spaces from five digits, scientific notation with
\\cdot 10^{k}, rounding half up). Units may carry a power, written outside \\text: \\,\\text{cm}^3, \\,\\text{kg/m}^3;
the options of the multiple choice are written the same way.
"""
import re

from sympy import Rational

from checkers.forze_comune import NUM, fmt_exact, fmt_sig, is_tie, parse_num, round_sig

__all__ = ["NUM", "parse_num", "unit_tex", "with_unit", "q", "expect_u"]


def unit_tex(u):
    m = re.fullmatch(r"(.*?)(\^\d)?", u)
    return f"\\text{{{m.group(1)}}}{m.group(2) or ''}"


def with_unit(num, u):
    return f"{num}\\,{unit_tex(u)}"


def q(u):
    """A regex for '$<number>\\,<unit>$' capturing the number."""
    return r"\$(" + NUM + r")\\," + re.escape(unit_tex(u)) + r"\$"


def expect_u(errs, sample, truth, u, fmt):
    """The answer is truth (rounded with ('sig', s), as it is with ('exact',)); four distinct options, one right, each
    written as number, thin space, unit."""
    truth = Rational(truth)
    if truth <= 0:
        errs.append(f"true answer {truth} not positive")
        return
    if fmt[0] == "sig":
        if is_tie(truth, fmt[1]):
            errs.append(f"{truth} is a tie at {fmt[1]} significant figures")
        want = round_sig(truth, fmt[1])
        write = lambda v: fmt_sig(v, fmt[1])  # noqa: E731
    else:
        want = truth
        write = fmt_exact
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != want:
        errs.append(f"answer {ans.get('value')} != {want}")
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
    texts = set()
    for o, v in zip(opts, vals):
        if v <= 0:
            errs.append(f"option {v} not positive")
            continue
        if fmt[0] == "sig" and round_sig(v, fmt[1]) != v:
            errs.append(f"option {v} not rounded to {fmt[1]} figures")
        w = with_unit(write(v), u)
        if o["latex"] != w:
            errs.append(f"option latex {o['latex']!r} != {w!r}")
        texts.add(o["latex"])
    if len(texts) != len(opts):
        errs.append("two options are written the same way")
    # the value written in the solution is the answer
    if with_unit(write(want), u) not in sample.get("solution", ""):
        errs.append("the solution does not show the answer")
