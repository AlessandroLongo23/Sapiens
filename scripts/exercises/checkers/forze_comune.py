"""Helpers shared by the checkers of the forces (physics, first year, group 5): forze, fis_forza_peso,
fis_forza_elastica, fis_attrito. Written from docs/lezioni/fisica/README.md (how numbers and units are written) and
from the specs, not from the generators: numbers with the decimal comma {,}, thin spaces \\, between thousands from
five digits, the unit after a thin space as \\,\\text{N}, scientific notation with \\cdot 10^{k}; rounding to
significant figures half up.
"""
import re

from sympy import Rational, floor, log

BANNED = re.compile(r"—|piuttosto che")

NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?"


def parse_num(s):
    """A number as the lessons write it, exactly: 9{,}8, 35\\,000, 2{,}9 \\cdot 10^{3}."""
    m = re.fullmatch(r"((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?(?: \\cdot 10\^\{(-?\d+)\})?", s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    whole = m.group(1).replace("\\,", "")
    frac = m.group(2) or ""
    v = Rational(int(whole + frac), 10 ** len(frac))
    if m.group(3):
        v *= Rational(10) ** int(m.group(3))
    return v


def n_decimals(r):
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 15:
            return 99
    return k


def fixed(r, d):
    """r with exactly d decimals, thin spaces in the integer part from five digits."""
    r = Rational(r)
    if n_decimals(r) > d:
        raise ValueError(f"{r} has more than {d} decimals")
    s = str(int(r * 10**d)).rjust(d + 1, "0")
    whole, frac = s[: len(s) - d], s[len(s) - d :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return f"{whole}{{,}}{frac}" if frac else whole


def fmt_exact(r):
    return fixed(r, n_decimals(r))


def exponent(r):
    r = Rational(r)
    e = int(floor(log(r, 10)))
    while Rational(10) ** e > r:
        e -= 1
    while Rational(10) ** (e + 1) <= r:
        e += 1
    return e


def round_sig(r, s):
    """r > 0 rounded to s significant figures, half up."""
    r = Rational(r)
    scale = Rational(10) ** (s - 1 - exponent(r))
    return Rational(int(floor(r * scale + Rational(1, 2)))) / scale


def is_tie(r, s):
    x = Rational(r) * Rational(10) ** (s - 1 - exponent(r))
    return x - floor(x) == Rational(1, 2)


def fmt_sig(r, s):
    """Exactly s significant figures; scientific notation from 10^s up and under 0,001."""
    v = round_sig(r, s)
    e = exponent(v)
    if e >= s or e < -3:
        return f"{fixed(v / Rational(10) ** e, s - 1)} \\cdot 10^{{{e}}}"
    return fixed(v, max(0, s - 1 - e))


def sig_figs(s):
    """Significant figures of a number as written (trailing zeros of an integer count, as the specs use them)."""
    digits = re.sub(r"\\cdot 10\^\{-?\d+\}", "", s).replace("\\,", "").replace("{,}", "").strip()
    return len(digits.lstrip("0"))


def with_unit(num, unit):
    return f"{num}\\,\\text{{{unit}}}" if unit else num


# ---------------------------------------------------------------------------
# Reading the problem


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    return m.group(1).split(r" \\ ") if m else [tex.strip()]


def prose(tex, allow_math=False):
    """The prose lines of a problem joined with spaces; with allow_math, the other lines are returned apart."""
    out, math = [], []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if m:
            out.append(m.group(1))
        elif allow_math:
            math.append(line.strip())
        else:
            raise ValueError(f"expected prose lines only: {line!r}")
    return (" ".join(out), math) if allow_math else " ".join(out)


def match(rx, s):
    """Full match of a pattern where {X} is a number between dollars with the unit X (N, kg, g, N/m, cm, m, N/kg), {V} a
    bare number between dollars, {D} a direction, {W} a word."""
    units = {"N": "N", "KG": "kg", "G": "g", "NM": "N/m", "NCM": "N/cm", "CM": "cm", "M": "m", "NKG": "N/kg"}
    pat = re.escape(rx)
    for key, u in units.items():
        pat = pat.replace(re.escape("{" + key + "}"), r"\$(" + NUM + r")\\,\\text\{" + re.escape(u) + r"\}\$")
    pat = pat.replace(re.escape("{V}"), r"\$(" + NUM + r")\$")
    pat = pat.replace(re.escape("{D}"), r"(est|ovest|nord|sud)")
    pat = pat.replace(re.escape("{W}"), r"([A-Za-zàèéìòù]+)")
    m = re.fullmatch(pat, s)
    return m.groups() if m else None


# ---------------------------------------------------------------------------
# The answer and the options


def expect(errs, sample, truth, unit, fmt):
    """fmt: ('exact',), ('int',) or ('sig', s). truth is exact; with 'sig' the answer is truth rounded."""
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
        if fmt[0] == "int" and not truth.is_integer:
            errs.append(f"answer {truth} not an integer")
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
    if sum(v == want for v in vals) != 1:
        errs.append("the truth appears more than once among the options")
    texts = set()
    for o, v in zip(opts, vals):
        if v <= 0:
            errs.append(f"option {v} not positive")
            continue
        if fmt[0] == "sig" and round_sig(v, fmt[1]) != v:
            errs.append(f"option {v} not rounded to {fmt[1]} figures")
        if fmt[0] == "int" and not v.is_integer:
            errs.append(f"option {v} not an integer")
        w = with_unit(write(v), unit)
        if o["latex"] != w:
            errs.append(f"option latex {o['latex']!r} != {w!r}")
        texts.add(o["latex"])
    if len(texts) != len(opts):
        errs.append("two options are written the same way")


def common(sample):
    errs = []
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    return errs
