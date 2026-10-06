"""Checker for fis-forze-conservative-energia (specs/exercises/fis-forze-conservative-energia.md), written from the
spec and the lesson 78-fis-forze-conservative-energia.md, not from the generator.

Friction of constant modulus F along a path of length l does the work -F l, so along the two edges of a table a by b
it is -F (a + b). A conservative force does opposite works on the way out and on the way back, whatever the paths;
friction does the same negative work both ways. W = U_A - U_B. A spring going from x_A to x_B does
k (x_A^2 - x_B^2) / 2. On a graph of U the kinetic energy is E - U and the force on a straight stretch is minus its
slope.
"""
import re

from sympy import Rational

from checkers._fis_energia import Q, answer, data
from checkers._fis_quantita_moto import exact_answer, graph, value_at
from checkers._vettori import check_choice, common, num, prose

M, N, J, CM, NM = Q("m"), Q("N"), Q("J"), Q("cm"), Q("N/m")
TABLES = {("0{,}6", "0{,}8"), ("0{,}9", "1{,}2"), ("1{,}2", "1{,}6"), ("1{,}5", "2{,}0"), ("0{,}5", "1{,}2"), ("0{,}8", "1{,}5"), ("1{,}8", "2{,}4"), ("2{,}1", "2{,}8")}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un libro viene spinto|Una scatola viene spinta|Un astuccio viene spinto) sul piano di un tavolo rettangolare di " + M + " per " + M + r", da un angolo all'angolo opposto, seguendo i due bordi\. L'attrito ha modulo " + N + r"\. Quanto lavoro compie l'attrito\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if (m.group(2), m.group(3)) not in TABLES and (m.group(3), m.group(2)) not in TABLES:
        errs.append("table not in the list of the spec")
    a, b, F = num(m.group(2)), num(m.group(3)), data(errs, m.group(4), "friction")
    if not Rational(11, 10) <= F <= 25:
        errs.append("friction out of range")
    answer(sample, errs, -F * (a + b), "J", lo=1, hi=Rational(995, 10))
    return "bordi"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su un corpo agisce una forza conservativa, che compie un lavoro di " + J + r" quando il corpo va da \$A\$ a \$B\$ lungo un cammino\. Quanto lavoro compie quando il corpo torna da \$B\$ ad \$A\$ lungo un altro cammino\?", s)
    if m:
        W = data(errs, m.group(1), "work")
        if not Rational(11, 10) <= abs(W) <= 49:
            errs.append("work out of range")
        right = m.group(1)[1:] if m.group(1).startswith("-") else "-" + m.group(1)
        opts = check_choice(sample, errs, right + r"\,\text{J}")
        if r"0\,\text{J}" not in opts or m.group(1) + r"\,\text{J}" not in opts:
            errs.append("the options miss zero or the same work")
        return "conservativa"
    m = re.fullmatch(r"Una cassa viene trascinata sul pavimento da \$A\$ a \$B\$, e l'attrito compie un lavoro di " + J + r"\. Poi la cassa viene riportata in \$A\$ lungo lo stesso cammino\. Quanto lavoro ha compiuto l'attrito in tutto\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    W = data(errs, m.group(1), "work")
    if W >= 0 or not Rational(11, 10) <= -W <= 49:
        errs.append("the work of friction must be negative and in range")
    answer(sample, errs, 2 * W, "J")
    if r"0\,\text{J}" not in [o["latex"] for o in sample["answer"]["options"]]:
        errs.append("the options miss zero")
    return "attrito"


def level3(sample, errs):
    s = prose(sample["problem"])
    kinds = r"(elastica di una molla|gravitazionale di un sasso|gravitazionale di un vaso|elastica di un elastico)"
    m = re.fullmatch(r"L'energia potenziale " + kinds + " passa da " + J + " a " + J + r"\. Quanto lavoro ha compiuto (la forza elastica|il peso)\?", s)
    if m:
        UA, UB = int(m.group(2)), int(m.group(3))
        force = m.group(4)
        W = UA - UB
        kind = "lavoro"
        truth = W
    else:
        m = re.fullmatch(r"L'energia potenziale " + kinds + " vale " + J + r"\. Poi (la forza elastica|il peso) compie un lavoro di " + J + r"\. Quanto vale ora l'energia potenziale\?", s)
        if not m:
            errs.append(f"level 3 text not recognised: {s!r}")
            return None
        UA, W = int(m.group(2)), int(m.group(4))
        force = m.group(3)
        UB = UA - W
        kind = "finale"
        truth = UB
    if (force == "il peso") != m.group(1).startswith("gravitazionale"):
        errs.append("the force does not match the potential energy")
    if not (11 <= UA <= 99 and 11 <= UB <= 99) or UA % 10 == 0 or UB % 10 == 0:
        errs.append("energies out of range or ending in zero")
    if abs(W) < 11 or W % 10 == 0:
        errs.append("difference under 11 J or multiple of 10")
    exact_answer(sample, errs, truth, "J", places=0)
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una molla con costante elastica " + NM + " è allungata di " + CM + r"\. Viene (tirata|lasciata tornare) fino a un allungamento di " + CM + r"\. Quanto lavoro compie la forza elastica\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    k, xa, xb = data(errs, m.group(1), "spring constant", figures=3), data(errs, m.group(2), "stretch"), data(errs, m.group(4), "stretch")
    if not 101 <= k <= 999 or not all(Rational(11, 10) <= x <= 25 for x in (xa, xb)) or abs(xa - xb) < 2:
        errs.append("data out of range")
    if (m.group(3) == "tirata") != (xb > xa):
        errs.append("the verb does not match the stretches")
    answer(sample, errs, k * ((xa / 100) ** 2 - (xb / 100) ** 2) / 2, "J", lo=Rational(1, 10), hi=Rational(995, 10))
    return "molla"


def corners(sample, errs, key="scene"):
    pts, d = graph(sample, errs, key)
    if len(pts) != 4 or pts[0][0] != 0 or pts[-1][0] != 8 or any(p[0].q != 1 for p in pts):
        errs.append("the graph must have four corners at whole metres from 0 to 8")
    if any(p[1] % 5 != 0 or not 5 <= p[1] <= 45 for p in pts):
        errs.append("energies must be multiples of 5 J between 5 and 45")
    if d.get("x", {}).get("unita") != "m" or d.get("y", {}).get("unita") != "J" or d.get("y", {}).get("passo") != 5 or d.get("x", {}).get("passo") != 1:
        errs.append("axes not as in the spec")
    return pts, d


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un corpo si muove lungo l'asse \$x\$ sotto l'azione di una forza conservativa\. Il grafico mostra la sua energia potenziale; la retta tratteggiata è la sua energia meccanica, \$E = (\d+)\\,\\text\{J\}\$\. Quanta energia cinetica ha il corpo in \$x = (\d)\\,\\text\{m\}\$\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    E, xq = int(m.group(1)), int(m.group(2))
    pts, d = corners(sample, errs)
    U = value_at(pts, xq)
    K = E - U
    if U % 5 != 0 or K < 15 or K % 10 == 0 or E > 50:
        errs.append("the point is not on the grid, or K is under 15 J or a multiple of 10")
    if d.get("livello") != {"valore": E, "nome": "E"}:
        errs.append("the line of E in the scene does not match the text")
    if "segna" in d or "area" in d:
        errs.append("the scene shows more than the data")
    spts, sd = corners(sample, errs, "solutionScene")
    if spts != pts or sd.get("segna") != [[xq, int(U)]] or sd.get("livello") != d.get("livello"):
        errs.append("the solution's scene does not mark the point")
    exact_answer(sample, errs, K, "J", places=0)
    return "cinetica"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un corpo si muove lungo l'asse \$x\$ sotto l'azione di una forza conservativa, con l'energia potenziale del grafico\. Quanto vale la forza \$F_x\$ che agisce sul corpo tra \$x = (\d)\\,\\text\{m\}\$ e \$x = (\d)\\,\\text\{m\}\$\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    xa, xb = int(m.group(1)), int(m.group(2))
    pts, d = corners(sample, errs)
    xs = [p[0] for p in pts]
    if xa not in xs or xb not in xs or xs.index(xb) != xs.index(xa) + 1:
        errs.append("the stretch is not between two consecutive corners")
        return None
    F = -(value_at(pts, xb) - value_at(pts, xa)) / (xb - xa)
    if F == 0 or F % 10 == 0:
        errs.append("force zero or multiple of 10")
    if any(k in d for k in ("livello", "segna", "area")):
        errs.append("the scene shows more than the data")
    exact_answer(sample, errs, F, "N", places=1)
    return "destra" if F > 0 else "sinistra"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}
CASE_RANGES = {
    2: {"conservativa": (0.4, 0.6), "attrito": (0.4, 0.6)},
    3: {"lavoro": (0.4, 0.8), "finale": (0.2, 0.6)},
    6: {"destra": (0.3, 0.75), "sinistra": (0.25, 0.7)},
}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if lvl not in (5, 6) and (sample.get("scene") or sample.get("solutionScene")):
        errs.append("no scene expected")
    return errs, kind
