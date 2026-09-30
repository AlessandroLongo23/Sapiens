"""Checker for fis-passaggi-stato (specs/exercises/fis-passaggi-stato.md), written from the spec and the lesson
70-fis-passaggi-stato.md, not from the generator.

A change of state at its own temperature takes (or gives back) Q = L m, with L_f = 3,34·10^5 J/kg for ice and
L_v = 2,26·10^6 J/kg for water; warming takes c m Δt, with c = 4186 J/(kg·°C) for water and 2,1·10^3 for ice. On the
temperature-heat graph the plateau's length is L m. A cube of ice melting in water: the water gives c m_w (t_w - t_e),
the ice takes L_f m_i + c m_i t_e. Exact arithmetic with sympy, answers to two significant figures.
"""
import re

from sympy import Rational

from checkers._fis_calore import C_ICE, C_WATER, LF, LV, answer, common, quantity, text, value

CASE_RANGES = {
    1: {"fusione": (0.15, 0.35), "solidificazione": (0.15, 0.35), "vaporizzazione": (0.15, 0.35), "condensazione": (0.15, 0.35)},
    2: {"fusione": (0.40, 0.60), "vaporizzazione": (0.40, 0.60)},
    3: {"fusione": (0.40, 0.60), "ebollizione": (0.40, 0.60)},
    5: {"calore latente": (0.40, 0.60), "massa": (0.40, 0.60)},
}

KG, C, G = quantity("kg"), quantity("C"), quantity("g")
CNEG = r"\$(-\d+)\\,\^\\circ\\text\{C\}\$"
ZERO = r"\$0\\,\^\\circ\\text\{C\}\$"
HUNDRED = r"\$100\\,\^\\circ\\text\{C\}\$"
LF_TEXT = r"Il calore latente di fusione del ghiaccio è \$3\{,\}34 \\cdot 10\^\{5\}\\,\\text\{J/kg\}\$\."
LV_TEXT = r"Il calore latente di vaporizzazione dell'acqua è \$2\{,\}26 \\cdot 10\^\{6\}\\,\\text\{J/kg\}\$\."
CW_TEXT = r"Il calore specifico dell'acqua è \$4186\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$\."
CI_TEXT = r"quello del ghiaccio \$2\{,\}1 \\cdot 10\^\{3\}\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$"


def mass(errs, s):
    if not re.fullmatch(r"0\{,\}[1-9][1-9]", s):
        errs.append(f"mass {s} is not 0,11-0,99 kg with two significant figures")
    return value(s)


def whole(errs, s, lo, hi, what):
    v = value(s)
    if not re.fullmatch(r"\d+", s) or not lo <= v <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return v


def level1(sample, errs):
    s = text(sample)
    forms = {
        "fusione": ("Quanto calore serve per fondere " + KG + " di ghiaccio che si trova già a " + ZERO + r"\? " + LF_TEXT, LF),
        "solidificazione": (KG + " d'acqua a " + ZERO + r" diventano ghiaccio nel congelatore\. Quanto calore cedono\? " + LF_TEXT, LF),
        "vaporizzazione": ("Quanto calore serve per trasformare in vapore " + KG + " d'acqua che bolle a " + HUNDRED + r"\? " + LV_TEXT, LV),
        "condensazione": (KG + " di vapore a " + HUNDRED + r" condensano in acqua alla stessa temperatura\. Quanto calore cedono\? " + LV_TEXT, LV),
    }
    for kind, (rx, L) in forms.items():
        if m := re.fullmatch(rx, s):
            answer(sample, errs, L * mass(errs, m.group(1)), 2, "J")
            return kind
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = text(sample)
    Q = r"\$(\d\{,\}\d) \\cdot 10\^\{(\d)\}\\,\\text\{J\}\$"
    if m := re.fullmatch(r"A un blocco di ghiaccio a " + ZERO + " si forniscono " + Q + r"\. Quanti grammi di ghiaccio fondono\? " + LF_TEXT, s):
        kind, L, lo, hi = "fusione", LF, 3, 5
    elif m := re.fullmatch(r"All'acqua che bolle in una pentola, a " + HUNDRED + ", si forniscono " + Q + r"\. Quanti grammi d'acqua diventano vapore\? " + LV_TEXT, s):
        kind, L, lo, hi = "vaporizzazione", LV, 4, 6
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    if m.group(1).endswith("0") or not lo <= int(m.group(2)) <= hi:
        errs.append("heat not two figures in range")
    heat = value(m.group(1)) * Rational(10) ** int(m.group(2))
    g = heat / L * 1000
    if not 10 <= g < 1000:
        errs.append("mass outside 10-1000 g")
    answer(sample, errs, g, 2, "g")
    return kind


def level3(sample, errs):
    s = text(sample)
    if m := re.fullmatch("Quanto calore serve per trasformare " + KG + " di ghiaccio a " + ZERO + " in acqua a " + C + r"\? " + LF_TEXT + " " + CW_TEXT, s):
        M = mass(errs, m.group(1))
        tf = whole(errs, m.group(2), 5, 60, "final temperature")
        answer(sample, errs, LF * M + C_WATER * M * tf, 2, "J")
        return "fusione"
    if m := re.fullmatch("Quanto calore serve per trasformare in vapore " + KG + " d'acqua a " + C + r"\? " + CW_TEXT + " " + LV_TEXT, s):
        M = mass(errs, m.group(1))
        ti = whole(errs, m.group(2), 10, 90, "starting temperature")
        answer(sample, errs, C_WATER * M * (100 - ti) + LV * M, 2, "J")
        return "ebollizione"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch("Quanto calore serve per trasformare " + KG + " di ghiaccio a " + CNEG + " in acqua a " + C + r"\? Il calore specifico dell'acqua è \$4186\\,\\text\{J/\(kg\}\\cdot\{\}\^\\circ\\text\{C\)\}\$, " + CI_TEXT + r"\. " + LF_TEXT, s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    M = mass(errs, m.group(1))
    t0 = -int(m.group(2))
    if not 5 <= t0 <= 30:
        errs.append("ice temperature outside -30..-5")
    tf = whole(errs, m.group(3), 5, 60, "final temperature")
    answer(sample, errs, C_ICE * M * t0 + LF * M + C_WATER * M * tf, 2, "J")
    return "tre tappe"


def graph(sample, errs):
    sc = sample.get("scene") or {}
    if sc.get("type") != "curva-riscaldamento":
        errs.append("no heating curve")
        return None
    pts = [(Rational(str(p[0])), Rational(str(p[1]))) for p in sc["data"].get("punti", [])]
    if len(pts) != 4 or pts[0][0] != 0 or pts[1][1] != pts[2][1] or not pts[0][0] < pts[1][0] < pts[2][0] < pts[3][0] or not pts[0][1] < pts[1][1] < pts[3][1]:
        errs.append(f"the graph is not rise, plateau, rise: {pts}")
        return None
    return pts


def level5(sample, errs):
    s = text(sample)
    pts = graph(sample, errs)
    if pts is None:
        return None
    if m := re.fullmatch(r"Un campione di " + KG + r" di una sostanza solida, a \$20\\,\^\\circ\\text\{C\}\$, viene scaldato fino a fonderlo tutto\. Il grafico mostra la sua temperatura in funzione del calore fornito\. Quanto vale il calore latente di fusione della sostanza\?", s):
        M = mass(errs, m.group(1))
        (q0, t0), (q1, tf), (q2, _), (q3, t3) = pts
        if t0 != 20 or tf % 10 or not 60 <= tf <= 350 or t3 != tf + 40:
            errs.append("temperatures of the graph")
        dq = q2 - q1
        if dq.q != 1 or not 11 <= dq <= 99 or dq % 10 == 0 or q1.q != 1 or not 5 <= q1 <= 60:
            errs.append("plateau not whole kJ in range")
        answer(sample, errs, dq * 1000 / M, 2, "Jkg")
        return "calore latente"
    if re.fullmatch(r"Il grafico mostra la temperatura di un blocco di ghiaccio in funzione del calore fornito, finché non diventa acqua a \$40\\,\^\\circ\\text\{C\}\$\. Qual è la massa del blocco, in grammi\? " + LF_TEXT, s):
        (q0, t0), (a, tf), (b, _), (q3, t3) = pts
        if tf != 0 or t3 != 40 or t0 not in (-10, -20, -30, -40):
            errs.append("temperatures of the ice graph")
        g = (b - a) * 10**6 / LF
        # the graph is the ice's: its first stretch and the last agree with that mass, to the tenth of kJ written
        M = g / 1000
        if abs(a - C_ICE * M * (-t0) / 1000) > Rational(1, 10) or abs(q3 - b - C_WATER * M * 40 / 1000) > Rational(2, 10):
            errs.append("the graph's stretches do not belong to one mass of ice")
        answer(sample, errs, g, 2, "g")
        return "massa"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


def level6(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un cubetto di ghiaccio di " + G + ", a " + ZERO + ", viene messo in un bicchiere con " + G + " d'acqua a " + C
        + r"\. Il ghiaccio fonde tutto\. Trascurando il bicchiere e l'aria, a quale temperatura arriva l'acqua\? " + LF_TEXT + " " + CW_TEXT,
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mi, mw, tw = value(m.group(1)) / 1000, value(m.group(2)) / 1000, whole(errs, m.group(3), 15, 40, "water temperature")
    if not (Rational(11, 1000) <= mi <= Rational(99, 1000) and Rational(15, 100) <= mw <= Rational(4, 10)):
        errs.append("masses outside the ranges")
    give, need = C_WATER * mw * tw, LF * mi
    if give < Rational(11, 10) * need:
        errs.append("the ice would not surely melt")
    te = (give - need) / (C_WATER * (mw + mi))
    if te < 1:
        errs.append("final temperature under 1 °C")
    answer(sample, errs, te, 2, "C")
    return "ghiaccio in acqua"


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
