"""Checker for fis-tabelle-grafici (specs/exercises/fis-tabelle-grafici.md).

Written from the spec and the lesson, not from the generator. Each exercise is read back as the student sees it:
the prose, the table and the `grafico-dati` scene.
- Level 1: the asked value is a point of the scene; the point lies on a grid intersection (it can be read exactly);
  the answer is its other coordinate, written with the decimals of a square.
- Level 2: from the table and the number of squares, the right step is the smallest 1, 2 or 5 times a power of ten
  that holds the largest value; each wrong option either does not hold it, or is larger, or is not such a step.
- Level 3: the value is read on the scene's line between two measured points (not on one), at a grid intersection.
- Level 4: for each row, a least-squares line through the other rows; the answer is the only row far from its line
  (more than five times the other rows' spread and at least a square), and the scene shows the table's points.
Then the options: four, different, the right one once, with its unit.
"""
import re

from sympy import Rational, floor, log

from checkers._fis_grafici import (
    UNIT_TEX,
    UNIT_UNI,
    check_choice,
    common,
    fmt,
    n_decimals,
    parse_num,
    rat,
    read_problem,
    header,
    scene_axes,
    value_option,
)

CASE_RANGES = {
    1: {"y": (0.35, 0.65), "x": (0.35, 0.65)},
    2: {"y": (0.35, 0.65), "x": (0.35, 0.65)},
    3: {"y": (0.35, 0.65), "x": (0.35, 0.65)},
}

# The experiments: what the prose says, and the two quantities (symbol, plain symbol, unit).
CTX = {
    "l'allungamento $\\Delta l$ di una molla in funzione della massa $m$ appesa": (("m", "m", "g"), ("\\Delta l", "Δl", "cm")),
    "la lunghezza $L$ di una molla in funzione della massa $m$ appesa": (("m", "m", "g"), ("L", "L", "cm")),
    "la temperatura $T$ dell'acqua in una pentola sul fornello in funzione del tempo $t$": (("t", "t", "min"), ("T", "T", "C")),
    "la posizione $s$ di un carrello su una rotaia in funzione del tempo $t$": (("t", "t", "s"), ("s", "s", "cm")),
    "l'altezza $h$ di una candela accesa in funzione del tempo $t$": (("t", "t", "min"), ("h", "h", "cm")),
}
WHAT = "|".join(re.escape(k) for k in CTX)
VAL = r"\$([^$]+)\$ (\S+?)"


def value_in_prose(num, unit_uni, unit):
    if UNIT_UNI[unit] != unit_uni:
        raise ValueError(f"unit {unit_uni} in the prose, expected {UNIT_UNI[unit]}")
    return parse_num(num)


def series_steps():
    return sorted(Rational(m) * Rational(10) ** e for e in range(-3, 5) for m in (1, 2, 5))


def level1(prose, table, sample, errs):
    m = re.fullmatch(r"Il grafico mostra (" + WHAT + r")\. Quanto vale \$(.+?)\$ nel punto misurato con \$(.+?)\$ uguale a " + VAL + r"\?", prose)
    mode = "y"
    if not m:
        m = re.fullmatch(r"Il grafico mostra (" + WHAT + r")\. Per quale valore di \$(.+?)\$ è stato misurato \$(.+?)\$ uguale a " + VAL + r"\?", prose)
        mode = "x"
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    (xs, xu, xunit), (ys, yu, yunit) = CTX[m.group(1)]
    a, b = m.group(2), m.group(3)
    if (mode == "y" and (a, b) != (ys, xs)) or (mode == "x" and (a, b) != (xs, ys)):
        errs.append("the symbols do not match the experiment")
    d = scene_axes(sample, xu, xunit, yu, yunit)
    sx, sy = rat(d["x"]["passo"]), rat(d["y"]["passo"])
    pts = [(rat(p[0]), rat(p[1])) for p in d["punti"]]
    for px, py in pts:
        if (px / sx).q != 1 or (py / sy).q != 1:
            errs.append(f"point ({px}, {py}) is not on a grid intersection")
    if d.get("linea"):
        errs.append("level 1 draws no line")
    given, _ = value_in_prose(m.group(4), m.group(5), xunit if mode == "y" else yunit)
    idx = 0 if mode == "y" else 1
    hits = [p for p in pts if p[idx] == given]
    if len(hits) != 1:
        errs.append(f"{given} matches {len(hits)} points")
        return mode
    truth = hits[0][1 - idx]
    step = sy if mode == "y" else sx
    check_choice(errs, sample, truth, n_decimals(step), yunit if mode == "y" else xunit)
    return mode


def level2(prose, table, sample, errs):
    m = re.fullmatch(
        r"La tabella riporta (" + WHAT + r")\. Devi disegnare il grafico su un foglio a quadretti, e sull'asse (verticale|orizzontale), quello di \$(.+?)\$, hai \$(\d+)\$ quadretti\. Quanto conviene far valere un quadretto\?",
        prose,
    )
    if not m or table is None:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    (xs, _, xunit), (ys, _, yunit) = CTX[m.group(1)]
    axis = "y" if m.group(2) == "verticale" else "x"
    if m.group(3) != (ys if axis == "y" else xs):
        errs.append("the axis does not carry the named quantity")
    N = int(m.group(4))
    if not 8 <= N <= 20:
        errs.append(f"N = {N}")
    if table[0] != header(xs, xunit) or table[1] != header(ys, yunit):
        errs.append(f"table headers {table[:2]}")
    col = [parse_num(r[1 if axis == "y" else 0])[0] for r in table[2]]
    M = max(col)
    unit = yunit if axis == "y" else xunit
    steps = series_steps()
    truth = next(s for s in steps if M <= N * s)
    check_choice(errs, sample, truth, n_decimals(truth), unit)
    for o in sample["answer"]["options"]:
        v, _, _ = value_option(o["latex"])
        if v == truth:
            continue
        fits = M <= N * v
        if fits and v in steps and v < truth:
            errs.append(f"option {v} is also a right answer")
        if fits and v not in steps and v >= truth:
            errs.append(f"option {v} is not a mistake worth showing")
    return axis


def level3(prose, table, sample, errs):
    m = re.fullmatch(r"Il grafico mostra (" + WHAT + r"), con la retta che passa tra i punti\. Leggi sulla retta quanto vale \$(.+?)\$ quando \$(.+?)\$ vale " + VAL + r"\.", prose)
    mode = "y"
    if not m:
        m = re.fullmatch(r"Il grafico mostra (" + WHAT + r"), con la retta che passa tra i punti\. Leggi sulla retta per quale valore di \$(.+?)\$ si ha \$(.+?)\$ uguale a " + VAL + r"\.", prose)
        mode = "x"
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    (xs, xu, xunit), (ys, yu, yunit) = CTX[m.group(1)]
    d = scene_axes(sample, xu, xunit, yu, yunit)
    sx, sy = rat(d["x"]["passo"]), rat(d["y"]["passo"])
    line = d.get("linea") or {}
    if line.get("tipo") != "retta":
        errs.append("level 3 needs the line")
        return mode
    k, q0 = rat(line["m"]), rat(line["q"])
    pts = [(rat(p[0]), rat(p[1])) for p in d["punti"]]
    for px, py in pts:
        if k * px + q0 != py:
            errs.append(f"point ({px}, {py}) is not on the line")
    given, _ = value_in_prose(m.group(4), m.group(5), xunit if mode == "y" else yunit)
    if mode == "y":
        x0, y0 = given, k * given + q0
    else:
        y0, x0 = given, (given - q0) / k
    xs_ = sorted(p[0] for p in pts)
    if not xs_[0] < x0 < xs_[-1] or x0 in xs_:
        errs.append(f"x = {x0} is not strictly between two measured points")
    if (x0 / sx).q != 1 or (y0 / sy).q != 1:
        errs.append(f"({x0}, {y0}) is not on a grid intersection")
    if mode == "y":
        check_choice(errs, sample, y0, n_decimals(sy), yunit)
    else:
        check_choice(errs, sample, x0, n_decimals(sx), xunit)
    return mode


def fit(points):
    n = len(points)
    sx = sum(p[0] for p in points)
    sy = sum(p[1] for p in points)
    sxx = sum(p[0] ** 2 for p in points)
    sxy = sum(p[0] * p[1] for p in points)
    k = (n * sxy - sx * sy) / (n * sxx - sx**2)
    return k, (sy - k * sx) / n


def level4(prose, table, sample, errs):
    m = re.fullmatch(r"La tabella riporta (" + WHAT + r"), e il grafico ne mostra i punti\. Tutti i punti stanno vicini a una retta, tranne uno\. Quale misura va rifatta\?", prose)
    if not m or table is None:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    (xs, xu, xunit), (ys, yu, yunit) = CTX[m.group(1)]
    rows = [(parse_num(a)[0], parse_num(b)[0]) for a, b in table[2]]
    d = scene_axes(sample, xu, xunit, yu, yunit)
    if [(rat(p[0]), rat(p[1])) for p in d["punti"]] != rows:
        errs.append("the scene does not show the table's points")
    sy = rat(d["y"]["passo"])
    far = []
    for i, (x0, y0) in enumerate(rows):
        others = rows[:i] + rows[i + 1 :]
        k, q0 = fit(others)
        spread = max(abs(y - (k * x + q0)) for x, y in others)
        res = abs(y0 - (k * x0 + q0))
        if res > 5 * spread and res >= sy:
            far.append(i)
    if len(far) != 1:
        errs.append(f"rows far from the line: {far}")
        return "riga"
    bad = far[0]
    a = sample["answer"]
    opts = a["options"]
    idx = [int(o["values"][0]) for o in opts]
    if len(opts) != 4 or len(set(idx)) != 4:
        errs.append("four different rows are needed")
    if idx[a["correct"]] != bad:
        errs.append(f"the right option is row {idx[a['correct']]}, the far row is {bad}")
    for i, o in zip(idx, opts):
        want = f"{xs} = {fmt(rows[i][0], parse_num(table[2][i][0])[1])}\\ {UNIT_TEX[xunit]}"
        if o["latex"] != want:
            errs.append(f"option {o['latex']!r} != {want!r}")
        if rows[i][0] <= 0:
            errs.append("an option on the origin row")
    return "riga"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        prose, table = read_problem(sample["problem"])
        kind = LEVELS[lvl](prose, table, sample, errs)
    except (ValueError, KeyError, StopIteration) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
