"""Checker for fis-proporzionalita-diretta (specs/exercises/fis-proporzionalita-diretta.md).

Written from the spec and the lesson, not from the generator. Each exercise is read back from its prose, its table
and its `grafico-dati` scene:
- Level 1: every row of the table has the same ratio y/x; the answer is that ratio, in the unit of y over the unit of
  x, written with at least two significant figures (0{,}040, 2{,}7, 6{,}0).
- Level 2: from the pair in the prose, y2 = y1 * x2 / x1, with one decimal and no rounding.
- Level 3: the scene's line goes through the origin and through a grid intersection at least eight squares away
  (so the slope can be read); the answer is its slope, with the unit and two significant figures at least.
- Level 4: ratios all equal -> direct; else differences Delta y / Delta x all equal -> linear with a constant term;
  else neither.
- Level 5: the table is linear, has no row with x = 0 and its first x is not one step from zero; the answer is the
  constant term y - m x.
Then the options: four (three at level 4), different, the right one once, with its unit.
"""
import re

from sympy import Rational, floor, log

from checkers._fis_grafici import UNIT_UNI, check_choice, check_text_choice, common, header, n_decimals, parse_num, rat, read_problem, scene_axes

CASE_RANGES = {
    4: {"diretta": (0.23, 0.43), "lineare": (0.23, 0.43), "nessuna": (0.23, 0.43)},
}

# Direct proportionality: prose, x, y, unit of k.
DIRECT = {
    "l'allungamento $\\Delta l$ di una molla e la massa $m$ appesa": (("m", "m", "g"), ("\\Delta l", "Δl", "cm"), "cm/g"),
    "la massa $m$ e il volume $V$ di cilindri di uno stesso materiale": (("V", "V", "cm3"), ("m", "m", "g"), "g/cm3"),
    "il volume $V$ d'acqua versato da un rubinetto e il tempo $t$": (("t", "t", "min"), ("V", "V", "L"), "L/min"),
    "la distanza $s$ percorsa da un carrello a velocità costante e il tempo $t$": (("t", "t", "s"), ("s", "s", "cm"), "cm/s"),
}
LINEAR = {
    "la lunghezza $L$ di una molla e la massa $m$ appesa": (("m", "g"), ("L", "cm"), "Quanto è lunga la molla senza pesetti appesi?"),
    "la temperatura $T$ dell'acqua in una pentola sul fornello e il tempo $t$": (("t", "min"), ("T", "C"), "Qual era la temperatura dell'acqua all'inizio, per $t = 0$?"),
    "la posizione $s$ di un carrello su una rotaia e il tempo $t$": (("t", "s"), ("s", "cm"), "In quale posizione si trovava il carrello per $t = 0$?"),
    "il volume $V$ d'acqua in una vasca che si riempie e il tempo $t$": (("t", "min"), ("V", "L"), "Quanta acqua c'era nella vasca all'inizio, per $t = 0$?"),
}
KINDS = {"diretta": "proporzionalità diretta", "lineare": "lineare con termine noto", "nessuna": "nessuna delle due"}
# Plausible values of k: a spring, a solid, a tap, a cart.
KRANGE = {"cm/g": (Rational(1, 100), Rational(1, 5)), "g/cm3": (Rational(1, 2), 20), "L/min": (Rational(1, 2), 20), "cm/s": (5, 100)}


def alt(d):
    return "|".join(re.escape(k) for k in d)


def sig2(v):
    """Decimals for at least two significant figures, and no fewer than the exact value needs."""
    v = Rational(v)
    e = int(floor(log(abs(v), 10)))
    return max(n_decimals(v), max(0, 1 - e))


def rows_of(table, xs, xunit, ys, yunit, errs):
    if table is None:
        raise ValueError("missing table")
    if table[0] != header(xs, xunit) or table[1] != header(ys, yunit):
        errs.append(f"table headers {table[:2]}")
    return [(parse_num(a)[0], parse_num(b)[0]) for a, b in table[2]], [parse_num(b)[1] for _, b in table[2]]


def kind_of(rows):
    ratios = {y / x for x, y in rows}
    if len(ratios) == 1:
        return "diretta"
    slopes = {(rows[i + 1][1] - rows[i][1]) / (rows[i + 1][0] - rows[i][0]) for i in range(len(rows) - 1)}
    if len(slopes) == 1:
        return "lineare"
    return "nessuna"


def level1(prose, table, sample, errs):
    m = re.fullmatch(r"La tabella riporta (" + alt(DIRECT) + r"), che sono direttamente proporzionali\. Quanto vale la costante di proporzionalità \$k = (.+?) / (.+?)\$\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    (xs, _, xunit), (ys, _, yunit), ku = DIRECT[m.group(1)]
    if (m.group(2), m.group(3)) != (ys, xs):
        errs.append("k is not y / x")
    rows, _ = rows_of(table, xs, xunit, ys, yunit, errs)
    if not 4 <= len(rows) <= 5 or len({x for x, _ in rows}) != len(rows):
        errs.append("4 or 5 different rows")
    if kind_of(rows) != "diretta":
        errs.append("the table is not a direct proportionality")
        return "k"
    k = rows[0][1] / rows[0][0]
    lo, hi = KRANGE[ku]
    if not lo <= k <= hi:
        errs.append(f"k = {k} {ku} is not plausible")
    check_choice(errs, sample, k, sig2(k), ku)
    return "k"


STORIES = [
    (r"Una molla si allunga di \$(.+?)\$ cm quando le si appendono \$(.+?)\$ g\. L'allungamento è direttamente proporzionale alla massa appesa\. Di quanto si allunga la molla con \$(.+?)\$ g\?", "yxx", "cm"),
    (r"Un cilindro di metallo con il volume di \$([^$]+?)\\ \\text\{cm\}\^3\$ ha una massa di \$(.+?)\$ g\. Per cilindri dello stesso metallo la massa è direttamente proporzionale al volume\. Quanto vale la massa di un cilindro dello stesso metallo con il volume di \$([^$]+?)\\ \\text\{cm\}\^3\$\?", "xyx", "g"),
    (r"In \$(.+?)\$ min un rubinetto versa \$(.+?)\$ L d'acqua\. Il volume versato è direttamente proporzionale al tempo\. Quanta acqua versa lo stesso rubinetto in \$(.+?)\$ min\?", "xyx", "L"),
    (r"Un carrello a velocità costante percorre \$(.+?)\$ cm in \$(.+?)\$ s\. La distanza è direttamente proporzionale al tempo\. Quanta strada percorre il carrello in \$(.+?)\$ s\?", "yxx", "cm"),
]


def level2(prose, table, sample, errs):
    for rx, order, unit in STORIES:
        m = re.fullmatch(rx, prose)
        if not m:
            continue
        vals = [parse_num(g) for g in m.groups()]
        if order == "yxx":
            (y1, dy), (x1, _), (x2, _) = vals
        else:
            (x1, _), (y1, dy), (x2, _) = vals
        if x1 == x2:
            errs.append("the same x twice")
        y2 = y1 * x2 / x1
        if dy != 1 or n_decimals(y2) > 1:
            errs.append(f"y2 = {y2} needs rounding or y1 has {dy} decimals")
        check_choice(errs, sample, y2, 1, unit)
        return "valore"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def level3(prose, table, sample, errs):
    m = re.fullmatch(r"Il grafico mostra (" + alt(DIRECT) + r"), con la retta che passa tra i punti\. Calcola la pendenza della retta, con la sua unità di misura\.", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    (_, xu, xunit), (_, yu, yunit), ku = DIRECT[m.group(1)]
    d = scene_axes(sample, xu, xunit, yu, yunit)
    line = d.get("linea") or {}
    if line.get("tipo") != "retta" or rat(line.get("q", 0)) != 0:
        errs.append("level 3 needs a line through the origin")
        return "pendenza"
    k = rat(line["m"])
    sx, sy = rat(d["x"]["passo"]), rat(d["y"]["passo"])
    # a grid intersection on the line, far from the origin, inside the sheet
    far = [c for c in range(8, d["x"]["celle"] + 1) if ((k * c * sx) / sy).q == 1 and k * c * sx / sy <= d["y"]["celle"]]
    if not far:
        errs.append("the line crosses no grid intersection eight squares away")
    for p in d["punti"]:
        if k * rat(p[0]) != rat(p[1]):
            errs.append("a point is off the line")
    lo, hi = KRANGE[ku]
    if not lo <= k <= hi:
        errs.append(f"k = {k} {ku} is not plausible")
    check_choice(errs, sample, k, sig2(k), ku)
    return "pendenza"


def level4(prose, table, sample, errs):
    m = re.fullmatch(r"La tabella riporta (" + alt(LINEAR) + r")\. Che legame c'è tra le due grandezze\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    (xs, xunit), (ys, yunit), _ = LINEAR[m.group(1)]
    rows, _ = rows_of(table, xs, xunit, ys, yunit, errs)
    kind = kind_of(rows)
    if kind == "diretta" and m.group(1).startswith("la lunghezza"):
        errs.append("a spring of length zero")
    if kind == "nessuna" and any(rows[i + 1][1] <= rows[i][1] for i in range(len(rows) - 1)):
        errs.append("the curve should grow")
    if len(sample["answer"].get("options", [])) != 3:
        errs.append("three options")
    check_text_choice(errs, sample, kind, KINDS)
    return kind


def level5(prose, table, sample, errs):
    m = re.fullmatch(r"La tabella riporta (" + alt(LINEAR) + r"), che sono in dipendenza lineare\. (.+)", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    (xs, xunit), (ys, yunit), ask = LINEAR[m.group(1)]
    if m.group(2) != ask:
        errs.append("the question does not match the experiment")
    rows, dys = rows_of(table, xs, xunit, ys, yunit, errs)
    if kind_of(rows) != "lineare":
        errs.append("the table is not linear with a constant term")
        return "q"
    if any(x == 0 for x, _ in rows):
        errs.append("the table has the row x = 0")
    if rows[0][0] == rows[1][0] - rows[0][0]:
        errs.append("the first x is one step from zero")
    mm = (rows[1][1] - rows[0][1]) / (rows[1][0] - rows[0][0])
    q0 = rows[0][1] - mm * rows[0][0]
    if q0 <= 0:
        errs.append("constant term not positive")
    check_choice(errs, sample, q0, dys[0], yunit)
    return "q"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        prose, table = read_problem(sample["problem"])
        kind = LEVELS[lvl](prose, table, sample, errs)
    except (ValueError, KeyError, StopIteration, ZeroDivisionError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
