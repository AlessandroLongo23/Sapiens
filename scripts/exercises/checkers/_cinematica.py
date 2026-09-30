"""Shared reading helpers for the checkers of the kinematics generators of group 12 (fis_punto_materiale, velocita,
fis_moto_rettilineo_uniforme, fis_accelerazione). Written from the lessons 38-41 and the specs, not from
src/lib/exercises/v2/cinematica.ts.

Numbers are read as the lessons write them: a decimal comma {,}, a minus sign, the unit upright after a thin space
(-2{,}5\\,\\text{m/s}, 3{,}5\\,\\text{m/s}^2). Values are exact sympy Rationals.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, round_sig

UNIT_TEX = {
    "m": r"\text{m}",
    "km": r"\text{km}",
    "s": r"\text{s}",
    "min": r"\text{min}",
    "h": r"\text{h}",
    "m/s": r"\text{m/s}",
    "km/h": r"\text{km/h}",
    "m/s2": r"\text{m/s}^2",
}
NUM = r"-?\d+(?:\{,\}\d+)?"


def dec(s):
    """A number as written ("-2{,}5", "140"), exact; no useless zeros allowed."""
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    body = s.lstrip("-")
    if re.match(r"0\d", body) or ("{,}" in body and body.endswith("0")):
        raise ValueError(f"number with useless zeros: {s!r}")
    return Rational(s.replace("{,}", "."))


def fmt(r):
    """An exact terminating decimal as the lessons write it: -2{,}5, 140."""
    r = Rational(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 10:
            raise ValueError(f"{r} does not terminate")
    sign = "-" if r < 0 else ""
    digits = str(abs(int(r * 10**k))).rjust(k + 1, "0")
    whole, frac = (digits[: len(digits) - k], digits[len(digits) - k :]) if k else (digits, "")
    return sign + whole + ("{,}" + frac if frac else "")


def lines(tex):
    """The top-level lines of a problem (\\begin{array}{l} ... \\end{array}); a table inside stays one line."""
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    if not m:
        return [tex]
    body, out, cur, depth, i = m.group(1), [], "", 0, 0
    while i < len(body):
        if body.startswith("\\begin{", i):
            depth += 1
        elif body.startswith("\\end{", i):
            depth -= 1
        if depth == 0 and body.startswith(" \\\\ ", i):
            out.append(cur)
            cur, i = "", i + 4
            continue
        cur += body[i]
        i += 1
    out.append(cur)
    return [x.strip() for x in out]


def read(tex):
    """(prose joined with spaces, list of the other lines)."""
    prose, other = [], []
    for line in lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m:
            prose.append(m.group(1))
        else:
            other.append(line)
    return " ".join(prose), other


def Q(unit):
    """A quantity in the prose, "$-2{,}5\\,\\text{m/s}$", capturing the number."""
    return r"\$(" + NUM + r")\\," + re.escape(UNIT_TEX[unit]) + r"\$"


def answer_tex(sample, errs, want_num, unit):
    """The right option is exactly the number `want_num` (as written, "4{,}0") with `unit`; every option is a number
    with the same unit (trailing zeros allowed: an option may carry significant figures)."""
    want = f"{want_num}\\,{UNIT_TEX[unit]}"
    opts = check_choice(sample, errs, want)
    for o in opts:
        if not re.fullmatch("(" + NUM + r")\\," + re.escape(UNIT_TEX[unit]), o):
            errs.append(f"option {o!r} is not a quantity in {unit}")
    return opts


def answer(sample, errs, value, unit):
    """The right option is the exact `value`, written without useless zeros."""
    return answer_tex(sample, errs, fmt(value), unit)


def answer_sig(sample, errs, exact, n, unit):
    """The right option is `exact` rounded to n significant figures (refused near a boundary)."""
    want = round_sig(exact, n)
    if want is None:
        errs.append(f"{exact} too close to a rounding boundary")
        return []
    return answer_tex(sample, errs, want, unit)


def table_ts(line):
    """A table of times and positions in two columns: returns (t unit, s unit, [t values], [s values])."""
    m = re.fullmatch(r"\\begin\{array\}\{c\|c\} t\\ \((.*?)\) & s\\ \((.*?)\) \\\\ \\hline (.*) \\end\{array\}", line)
    if not m:
        raise ValueError(f"not a table: {line!r}")
    rows = [r.split(" & ") for r in m.group(3).split(" \\\\ ")]
    if any(len(r) != 2 for r in rows):
        raise ValueError("table rows")
    units = {v: k for k, v in UNIT_TEX.items()}
    return units[m.group(1)], units[m.group(2)], [dec(r[0].strip()) for r in rows], [dec(r[1].strip()) for r in rows]


def scene_road(sample, key="scene"):
    sc = sample.get(key) or {}
    if sc.get("type") != "strada-posizioni":
        return None
    return sc.get("data", {})


# The fastest a body may go in the exercises, m/s (a pedestrian does not run at 12 m/s).
TOP_SPEED = {
    "pedone": 2.5,
    "carrello": 8,
    "cane": 8,
    "monopattino": 8,
    "ciclista": 15,
    "motorino": 15,
    "auto": 40,
    "treno": 40,
}


def plausible(errs, body, speed):
    """`body` as written ("Un pedone", "un'auto"), `speed` in m/s."""
    key = body.lower().replace("un'", "").replace("un ", "").strip()
    top = TOP_SPEED.get(key)
    if top is None:
        errs.append(f"unknown body {body!r}")
    elif abs(speed) > top:
        errs.append(f"{body} at {float(abs(speed))} m/s is not plausible")
