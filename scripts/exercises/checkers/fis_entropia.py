"""Checker for fis-entropia (specs/exercises/fis-entropia.md), written from the spec and the lesson 118-fis-entropia.md,
not from the generator.

The entropy change of a body that exchanges the heat Q, with its sign (positive when absorbed), reversibly at the
absolute temperature T is Q/T. A change of state of a mass m exchanges L m; a perfect gas at constant temperature has
n R ln(V_B/V_A); a body of mass m and specific heat c that goes from T_A to T_B has m c ln(T_B/T_A). When the heat Q
goes from a reservoir at T_c to one at T_f the universe has Q/T_f - Q/T_c, and in a cycle of a heat engine
Q_f/T_f - Q_c/T_c with Q_f = Q_c - W. Exact arithmetic with sympy (symbolic logarithms), entropy changes written with
their sign.
"""
import re

from sympy import Rational, log

from checkers._fis_frigo_entropia import C_WATER, C_WATER_TEX, LF, LF_TEX, LV, LV_TEX, R_GAS, ZERO_C, answer, common, no_trailing_zero, quantity, text, value

CASE_RANGES = {
    1: {"assorbe": (0.40, 0.60), "cede": (0.40, 0.60)},
    2: {"fusione": (0.17, 0.33), "solidificazione": (0.17, 0.33), "vaporizzazione": (0.17, 0.33), "condensazione": (0.17, 0.33)},
    3: {"espansione": (0.40, 0.60), "compressione": (0.40, 0.60)},
    4: {"scalda": (0.40, 0.60), "raffredda": (0.40, 0.60)},
}

J, K, KG, MOL, L, C = quantity("J"), quantity("K"), quantity("kg"), quantity("mol"), quantity("L"), quantity("C")
R_TEX = r"\$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$"


def whole(errs, s, lo, hi, what):
    """A whole number between lo and hi that does not end with a zero."""
    if not re.fullmatch(r"\d+", s):
        errs.append(f"{what} {s} is not a whole number")
    v = value(s)
    if not lo <= v <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    no_trailing_zero(errs, s, what)
    return v


def three_decimal(errs, s, what):
    """A mass from 0,105 to 0,995 kg, three figures, the last one not zero."""
    if not re.fullmatch(r"0\{,\}[1-9]\d[1-9]", s):
        errs.append(f"{what} {s} outside 0,105-0,995")
    return value(s)


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Una sorgente a " + K + " (assorbe|cede) " + J + r" di calore\. Di quanto varia la sua entropia\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    T, Q = whole(errs, m.group(1), 251, 599, "T"), whole(errs, m.group(3), 205, 995, "Q")
    sign = 1 if m.group(2) == "assorbe" else -1
    answer(sample, errs, sign * Q / T, 3, "JK", plus=True)
    return m.group(2)


def level2(sample, errs):
    s = text(sample)
    forms = [
        ("fusione", r"Un blocco di ghiaccio di " + KG + r", a \$0\\,\^\\circ\\text\{C\}\$, fonde completamente\. Di quanto varia la sua entropia\? Per l'acqua " + LF_TEX + r"\.", LF, 273, 1),
        ("solidificazione", KG + r" di acqua a \$0\\,\^\\circ\\text\{C\}\$ diventano ghiaccio alla stessa temperatura\. Di quanto varia l'entropia dell'acqua\? Per l'acqua " + LF_TEX + r"\.", LF, 273, -1),
        ("vaporizzazione", KG + r" di acqua a \$100\\,\^\\circ\\text\{C\}\$ diventano vapore alla stessa temperatura\. Di quanto varia l'entropia dell'acqua\? Per l'acqua " + LV_TEX + r"\.", LV, 373, 1),
        ("condensazione", KG + r" di vapore a \$100\\,\^\\circ\\text\{C\}\$ condensano in acqua alla stessa temperatura\. Di quanto varia l'entropia del vapore\? Per l'acqua " + LV_TEX + r"\.", LV, 373, -1),
    ]
    for name, pattern, latent, T, sign in forms:
        if m := re.fullmatch(pattern, s):
            kg = three_decimal(errs, m.group(1), "mass")
            answer(sample, errs, sign * latent * kg / T, 3, "JK", plus=True)
            return name
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(MOL + r" di gas perfetto (si espandono|vengono compresse) a temperatura costante da " + L + " a " + L + r"\. Di quanto varia l'entropia del gas\? Usa " + R_TEX + r"\.", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if not re.fullmatch(r"[1-4]\{,\}\d[1-9]", m.group(1)) or value(m.group(1)) < Rational(105, 100):
        errs.append(f"moles {m.group(1)} outside 1,05-4,95")
    n = value(m.group(1))
    for v in (m.group(3), m.group(4)):
        if not re.fullmatch(r"[1-9]\d\{,\}[1-9]", v) or value(v) < Rational(105, 10):
            errs.append(f"volume {v} outside 10,5-99,5 L")
    va, vb = value(m.group(3)), value(m.group(4))
    grows = m.group(2) == "si espandono"
    if grows != (vb > va):
        errs.append("the volumes do not fit the verb")
    r = max(va, vb) / min(va, vb)
    if not Rational(12, 10) <= r <= 6:
        errs.append("ratio of the volumes outside 1,2-6")
    answer(sample, errs, n * R_GAS * log(vb / va), 3, "JK", plus=True)
    return "espansione" if grows else "compressione"


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(KG + r" di acqua (vengono scaldati|si raffreddano) da " + C + " a " + C + r"\. Di quanto varia l'entropia dell'acqua\? Per l'acqua " + C_WATER_TEX + r"\.", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    kg = three_decimal(errs, m.group(1), "mass")
    ta, tb = int(value(m.group(3))), int(value(m.group(4)))
    warms = m.group(2) == "vengono scaldati"
    if not (5 <= ta <= 95 and 5 <= tb <= 95 and abs(ta - tb) >= 15) or warms != (tb > ta):
        errs.append("temperatures outside the ranges, or not fitting the verb")
    answer(sample, errs, kg * C_WATER * log(Rational(tb + ZERO_C, ta + ZERO_C)), 3, "JK", plus=True)
    return "scalda" if warms else "raffredda"


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(J + " di calore passano da una sorgente a " + K + " a una sorgente a " + K + r"\. Di quanto varia l'entropia dell'universo\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    Q, Tc, Tf = whole(errs, m.group(1), 605, 2495, "Q"), whole(errs, m.group(2), 351, 599, "T_c"), whole(errs, m.group(3), 251, 569, "T_f")
    if Tc - Tf < 30:
        errs.append("temperatures closer than 30 K")
    if not (Q / Tf < 10 and Q / Tc >= 1):
        errs.append("a term outside 1-10 J/K")
    truth = Q / Tf - Q / Tc
    if truth < Rational(1, 10):
        errs.append("entropy change under 0,10 J/K")
    answer(sample, errs, truth, None, "JK", plus=True, decimals=2)
    sc = sample.get("scene") or {}
    want = {"tc": f"{m.group(2)} K", "tf": f"{m.group(3)} K", "q": f"{m.group(1)} J"}
    if sc.get("type") != "sorgenti-calore" or sc.get("data") != want:
        errs.append(f"scene {sc.get('type')!r} {sc.get('data')!r} != {want!r}")
    return None


def level6(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Una macchina termica lavora tra una sorgente a " + K + " e una a " + K + r"\. In ogni ciclo assorbe " + J + " dalla sorgente calda e compie un lavoro di " + J
        + r"\. Di quanto varia l'entropia dell'universo in un ciclo\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    Tc, Tf = whole(errs, m.group(1), 401, 699, "T_c"), whole(errs, m.group(2), 271, 349, "T_f")
    Qc, W = whole(errs, m.group(3), 1005, 4995, "Q_c"), whole(errs, m.group(4), 105, 4995, "W")
    Qf = Qc - W
    carnot = Qc * (1 - Tf / Tc)
    if not Rational(39, 100) * carnot <= W <= Rational(86, 100) * carnot:
        errs.append("work outside 40%-85% of the reversible one")
    if not (Qf / Tf < 10 and Qc / Tc >= 1):
        errs.append("a term outside 1-10 J/K")
    truth = Qf / Tf - Qc / Tc
    if truth < Rational(1, 10):
        errs.append("entropy change under 0,10 J/K")
    answer(sample, errs, truth, None, "JK", plus=True, decimals=2)
    sc = sample.get("scene") or {}
    want = {
        "sorgenti": {"calda": f"{m.group(1)} K", "fredda": f"{m.group(2)} K"},
        "dispositivi": [{"nome": "macchina", "caldo": {"verso": "entra", "testo": f"Qc = {m.group(3)} J"}, "freddo": {"verso": "esce", "testo": "Qf"}, "lavoro": {"verso": "esce", "testo": f"W = {m.group(4)} J"}}],
    }
    if sc.get("type") != "macchina-termica" or sc.get("data") != want:
        errs.append(f"scene {sc.get('data')!r} != {want!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
    if lvl <= 4 and sample.get("scene"):
        errs.append("a scene where none is expected")
    return errs, kind
