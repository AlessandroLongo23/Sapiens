"""Checker for chim-legge-boyle (specs/exercises/chim-legge-boyle.md), written from the spec and the lesson
31-chim-legge-boyle.md, not from the generator.

At constant temperature p1 V1 = p2 V2, with the two pressions in the same unit and the two volumes in the same unit
(1 L = 1000 mL, 1 atm = 760 mmHg). Under water the pressure is 1,0 atm plus 1 atm every 10 m. When the volume is
multiplied by f the pressure is multiplied by 1/f: a volume x % smaller gives a pressure 100 x / (100 - x) % larger,
a volume x % larger a pressure 100 x / (100 + x) % smaller, to the whole per cent.
"""
import re

from checkers._chim_gas import answer, answer_int, common, quantity, sig_of, text, value
from sympy import Rational

CASE_RANGES = {
    2: {"mmHg": (0.40, 0.60), "kPa": (0.40, 0.60)},
    3: {"volumi": (0.40, 0.60), "pressioni": (0.40, 0.60)},
    5: {"sale": (0.40, 0.60), "scende": (0.40, 0.60)},
    6: {"diminuisce": (0.40, 0.60), "aumenta": (0.40, 0.60)},
}


def two_sig(s, errs):
    if sig_of(s) != 2:
        errs.append(f"{s} has not two significant figures")
    return value(s)


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas occupa " + quantity("L") + " alla pressione di " + quantity("atm") + r"\. A temperatura costante il suo volume diventa " + quantity("L") + r"\. Quale pressione ha il gas\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    V1, p1, V2 = (two_sig(m.group(i), errs) for i in (1, 2, 3))
    if V1 == V2:
        errs.append("equal volumes")
    p2 = p1 * V1 / V2
    answer(sample, errs, p2, 2, "atm")
    return "compressione" if V2 < V1 else "espansione"


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un campione di gas occupa " + quantity("L") + r" alla pressione di \$(\d+)\\,\\text\{(mmHg|kPa)\}\$\. A temperatura costante la pressione diventa \$(\d+)\\,\\text\{(mmHg|kPa)\}\$\. Quale volume occupa il gas\?", s)
    if not m or m.group(3) != m.group(5):
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V1, p1, p2 = value(m.group(1)), value(m.group(2)), value(m.group(4))
    if sig_of(m.group(1)) != 3 or m.group(2).endswith("0") or m.group(4).endswith("0"):
        errs.append("data without three significant figures")
    answer(sample, errs, p1 * V1 / p2, 3, "L")
    return m.group(3)


def level3(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Una siringa contiene \$(\d+)\\,\\text\{mL\}\$ di gas alla pressione di " + quantity("atm") + r"\. A temperatura costante il gas si espande fino a occupare " + quantity("L") + r"\. Quale pressione ha il gas\?", s):
        V1 = value(m.group(1)) / 1000
        p1, V2 = value(m.group(2)), value(m.group(3))
        answer(sample, errs, p1 * V1 / V2, 3, "atm")
        return "volumi"
    if m := re.fullmatch(r"Un gas occupa " + quantity("L") + " alla pressione di " + quantity("atm") + r"\. A temperatura costante la pressione diventa " + quantity("mmHg") + r"\. Quale volume occupa il gas\?", s):
        V1, p1, p2 = value(m.group(1)), value(m.group(2)) * 760, value(m.group(3))
        answer(sample, errs, p1 * V1 / p2, 2, "L")
        return "pressioni"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Il grafico mostra la pressione di una quantità fissa di gas in funzione del volume, a temperatura costante\. Quale pressione ha il gas quando il suo volume è " + quantity("L") + r"\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    V = value(m.group(1))
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "grafico-dati" or d.get("x", {}).get("nome") != "V" or d.get("y", {}).get("nome") != "p":
        errs.append("no p-V graph")
        return None
    pts = [(Rational(str(a)), Rational(str(b))) for a, b in d.get("punti", [])]
    products = {a * b for a, b in pts}
    if len(pts) < 3 or len(products) != 1:
        errs.append(f"the points are not on one isotherm: {pts}")
        return None
    k = products.pop()
    step = Rational(str(d["y"]["passo"]))
    if any((b / step).q != 1 for _, b in pts):
        errs.append("a point off the grid")
    if any(a == V for a, _ in pts):
        errs.append("the volume asked is one of the points")
    line = d.get("linea", {})
    if line.get("tipo") != "inversa" or Rational(str(line.get("k"))) != k:
        errs.append("line")
    answer(sample, errs, k / V, 2, "atm")
    return "grafico"


def level5(sample, errs):
    s = text(sample)
    if m := re.fullmatch(
        r"Un sub, a \$(\d+)\\,\\text\{m\}\$ di profondità, espira una bolla d'aria di " + quantity("cm3")
        + r"\. Sott'acqua la pressione cresce di \$1\\,\\text\{atm\}\$ ogni \$10\\,\\text\{m\}\$, e in superficie è \$1\{,\}0\\,\\text\{atm\}\$\. Quale volume ha la bolla in superficie, se la temperatura non cambia\?",
        s,
    ):
        h, V1 = int(m.group(1)), two_sig(m.group(2), errs)
        if h % 5 or not 5 <= h <= 40:
            errs.append("depth")
        answer(sample, errs, V1 * (1 + Rational(h, 10)), 2, "cm3")
        return "sale"
    if m := re.fullmatch(
        r"Un palloncino contiene " + quantity("L") + r" d'aria in superficie, dove la pressione è \$1\{,\}0\\,\\text\{atm\}\$\. Un sub lo porta a \$(\d+)\\,\\text\{m\}\$ di profondità; sott'acqua la pressione cresce di \$1\\,\\text\{atm\}\$ ogni \$10\\,\\text\{m\}\$\. Quale volume ha il palloncino, se la temperatura non cambia\?",
        s,
    ):
        V1, h = two_sig(m.group(1), errs), int(m.group(2))
        if h % 5 or not 5 <= h <= 40:
            errs.append("depth")
        answer(sample, errs, V1 / (1 + Rational(h, 10)), 2, "L")
        return "scende"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


def whole_percent(x, errs):
    fl = int(x)
    frac = x - fl
    if frac == Rational(1, 2):
        errs.append("percentage on a half")
    return fl + 1 if frac > Rational(1, 2) else fl


def level6(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"A temperatura costante il volume di un gas (diminuisce|aumenta) del \$(\d+)\\,\\%\$\. Di quanto per cento (aumenta|diminuisce) la sua pressione\?", s)
    if not m or m.group(1) == m.group(3):
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    x = Rational(int(m.group(2)))
    allowed = {10, 20, 25, 30, 40, 50, 60, 75, 80} if m.group(1) == "diminuisce" else {10, 20, 25, 50, 100, 150, 200, 300}
    if int(x) not in allowed:
        errs.append(f"percentage {x} not in the spec's list")
    truth = 100 * x / (100 - x) if m.group(1) == "diminuisce" else 100 * x / (100 + x)
    answer_int(sample, errs, whole_percent(truth, errs), "pct")
    return m.group(1)


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
