"""Checker for fis-proporzionalita-inversa (specs/exercises/fis-proporzionalita-inversa.md).

Written from the spec and the lesson, not from the generator. Each exercise is read back from its prose, its table
and its `grafico-dati` scene:
- Level 1: every row of the table has the same product x*y; the answer is that product, in the product of the units
  (kPa*cm3, and m/s*s = m, L/min*min = L), with at least two significant figures.
- Level 2: from the pair in the prose, y2 = y1 * x1 / x2, exact with the decimals of y1.
- Level 3: from the pair in the prose, y2 = y1 * (x2 / x1)^2, exact with one decimal.
- Level 4: the only one of y/x, Delta y/Delta x, x*y, y/x^2 that is the same on every row names the law.
- Level 5: the same on the scene's points, which lie on grid intersections (they can be read) and have no line.
Then the options: four, different, the right one once, with its unit or its label.
"""
import re

from sympy import Rational, floor, log

from checkers._fis_grafici import check_choice, check_text_choice, common, header, n_decimals, parse_num, rat, read_problem, scene_axes

CASE_RANGES = {
    4: {k: (0.15, 0.35) for k in ["diretta", "lineare", "inversa", "quadratica"]},
    5: {k: (0.15, 0.35) for k in ["diretta", "lineare", "inversa", "quadratica"]},
}

INVERSE = {
    "la pressione $p$ dell'aria chiusa in una siringa e il suo volume $V$": (("V", "cm3"), ("p", "kPa"), "kPa*cm3"),
    "il tempo $t$ che un carrello impiega a percorrere una rotaia e la sua velocità $v$": (("v", "m/s"), ("t", "s"), "m"),
    "il tempo $t$ per riempire una vasca e la portata $Q$ del rubinetto": (("Q", "L/min"), ("t", "min"), "L"),
}
STORIES2 = [
    (r"L'aria chiusa in una siringa ha la pressione di \$(.+?)\$ kPa quando il volume è di \$([^$]+?)\\ \\text\{cm\}\^3\$\. A temperatura costante la pressione è inversamente proporzionale al volume\. Quanto vale la pressione quando il volume è di \$([^$]+?)\\ \\text\{cm\}\^3\$\?", "yxx", "kPa"),
    (r"A \$(.+?)\$ m/s un carrello percorre tutta una rotaia in \$(.+?)\$ s\. Il tempo è inversamente proporzionale alla velocità\. Quanto tempo impiega il carrello a \$(.+?)\$ m/s\?", "xyx", "s"),
    (r"Con un rubinetto che versa \$(.+?)\$ L/min una vasca si riempie in \$(.+?)\$ min\. Il tempo è inversamente proporzionale alla portata\. Quanto tempo serve con un rubinetto che versa \$(.+?)\$ L/min\?", "xyx", "min"),
]
STORIES3 = [
    (r"Un carrello che parte da fermo su una rotaia inclinata percorre \$(.+?)\$ cm in \$(.+?)\$ s\. La distanza percorsa è proporzionale al quadrato del tempo\. Quanta strada percorre il carrello in \$(.+?)\$ s\?", "cm", (Rational(5), Rational(30))),
    (r"Un sasso lasciato cadere da fermo scende di \$(.+?)\$ m in \$(.+?)\$ s\. La distanza di caduta è proporzionale al quadrato del tempo\. Di quanto scende il sasso in \$(.+?)\$ s\?", "m", (Rational(49, 10), Rational(49, 10))),
]
LAWS = {"diretta": "proporzionalità diretta", "lineare": "lineare con termine noto", "inversa": "proporzionalità inversa", "quadratica": "proporzionalità quadratica"}


def sig2(v):
    v = Rational(v)
    e = int(floor(log(abs(v), 10)))
    return max(n_decimals(v), max(0, 1 - e))


def law_of(rows):
    """The laws whose invariant is the same on every row (there must be exactly one)."""
    found = []
    if len({y / x for x, y in rows}) == 1:
        found.append("diretta")
    slopes = {(rows[i + 1][1] - rows[i][1]) / (rows[i + 1][0] - rows[i][0]) for i in range(len(rows) - 1)}
    if len(slopes) == 1 and "diretta" not in found:
        found.append("lineare")
    if len({x * y for x, y in rows}) == 1:
        found.append("inversa")
    if len({y / x**2 for x, y in rows}) == 1:
        found.append("quadratica")
    return found


def level1(prose, table, sample, errs):
    m = re.fullmatch(r"La tabella riporta (" + "|".join(re.escape(k) for k in INVERSE) + r"), che sono inversamente proporzionali\. Quanto vale la costante di proporzionalità \$k = (.+?) \\cdot (.+?)\$\?", prose)
    if not m or table is None:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    (xs, xunit), (ys, yunit), ku = INVERSE[m.group(1)]
    if (m.group(2), m.group(3)) != (xs, ys):
        errs.append("k is not x * y")
    if table[0] != header(xs, xunit) or table[1] != header(ys, yunit):
        errs.append(f"table headers {table[:2]}")
    rows = [(parse_num(a)[0], parse_num(b)[0]) for a, b in table[2]]
    if not 4 <= len(rows) <= 5:
        errs.append("4 or 5 rows")
    if law_of(rows) != ["inversa"]:
        errs.append(f"the table follows {law_of(rows)}")
        return "k"
    k = rows[0][0] * rows[0][1]
    check_choice(errs, sample, k, sig2(k), ku)
    return "k"


def level2(prose, table, sample, errs):
    for rx, order, unit in STORIES2:
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
        y2 = y1 * x1 / x2
        if n_decimals(y2) > dy:
            errs.append(f"y2 = {y2} needs rounding")
        check_choice(errs, sample, y2, dy, unit)
        return "inversa"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def level3(prose, table, sample, errs):
    for rx, unit, (klo, khi) in STORIES3:
        m = re.fullmatch(rx, prose)
        if not m:
            continue
        (y1, dy), (x1, _), (x2, _) = [parse_num(g) for g in m.groups()]
        if x1 == x2:
            errs.append("the same time twice")
        k = y1 / x1**2
        if not klo <= k <= khi:
            errs.append(f"k = {k} is not plausible")
        y2 = y1 * (x2 / x1) ** 2
        if dy != 1 or n_decimals(y2) > 1:
            errs.append(f"y2 = {y2} needs rounding")
        check_choice(errs, sample, y2, 1, unit)
        return "quadratica"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(prose, table, sample, errs):
    if prose != "In un esperimento si misurano due grandezze, $x$ in secondi e $y$ in centimetri. Quale legge lega $y$ a $x$?" or table is None:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    if table[0] != header("x", "s") or table[1] != header("y", "cm"):
        errs.append(f"table headers {table[:2]}")
    rows = [(parse_num(a)[0], parse_num(b)[0]) for a, b in table[2]]
    if len(rows) != 4 or len({x for x, _ in rows}) != 4:
        errs.append("four different rows")
    found = law_of(rows)
    if len(found) != 1:
        errs.append(f"laws that fit: {found}")
        return None
    check_text_choice(errs, sample, found[0], LAWS)
    if len(sample["answer"]["options"]) != 4:
        errs.append("four options")
    return found[0]


def level5(prose, table, sample, errs):
    if prose != "Il grafico mostra i punti misurati di due grandezze, $x$ in secondi e $y$ in centimetri. Quale legge lega $y$ a $x$?":
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    d = scene_axes(sample, "x", "s", "y", "cm")
    if d.get("linea"):
        errs.append("level 5 shows the points only")
    sx, sy = rat(d["x"]["passo"]), rat(d["y"]["passo"])
    pts = [(rat(p[0]), rat(p[1])) for p in d["punti"]]
    for x, y in pts:
        if (x / sx).q != 1 or (y / sy).q != 1 or x <= 0 or y <= 0:
            errs.append(f"point ({x}, {y}) is not on a grid intersection inside the sheet")
        if x / sx > d["x"]["celle"] or y / sy > d["y"]["celle"]:
            errs.append(f"point ({x}, {y}) is off the sheet")
    if len(pts) < 4:
        errs.append("at least four points")
    found = law_of(sorted(pts))
    if len(found) != 1:
        errs.append(f"laws that fit: {found}")
        return None
    check_text_choice(errs, sample, found[0], LAWS)
    return found[0]


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
