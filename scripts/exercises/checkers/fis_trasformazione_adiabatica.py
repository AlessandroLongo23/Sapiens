"""Checker for fis-trasformazione-adiabatica (specs/exercises/fis-trasformazione-adiabatica.md), written from the spec
and the lesson 113-fis-trasformazione-adiabatica.md, not from the generator.

In an adiabatic transformation Q = 0, so W = -ΔU = n C_V (T_A - T_B), with C_V = l/2 R (l = 3 for a monatomic gas, 5
for a diatomic one) and R = 8,31 J/(mol K). If it is quasi-static, p V^γ and T V^(γ-1) stay constant, with
γ = (l + 2)/l: p_B = p_A (V_A/V_B)^γ, T_B = T_A (V_A/V_B)^(γ-1), V_B = V_A (p_A/p_B)^(1/γ), and the work is also
W = (p_A V_A - p_B V_B)/(γ - 1). Temperatures in the laws are in kelvin (0 °C = 273 K). The powers are kept exact
with sympy and rounded only at the end.
"""
import re

from sympy import Rational

from checkers._fis_calori_adiabatica import GAS, KIND, R_TEXT, answer, check_options, comma, common, cv, gamma, gas_kind, quantity, rounded, signed, text, three, value, whole

CASE_RANGES = {
    1: {"espansione": (0.40, 0.60), "compressione": (0.40, 0.60)},
    2: {"espansione": (0.40, 0.60), "compressione": (0.40, 0.60)},
    3: {"espansione": (0.35, 0.65), "compressione": (0.35, 0.65)},
    4: {"espansione": (0.40, 0.60), "compressione": (0.40, 0.60)},
    5: {"monoatomico": (0.30, 0.70), "biatomico": (0.30, 0.70)},
    6: {"espansione": (0.40, 0.60), "compressione": (0.40, 0.60)},
}

MOL, K, C, L, ATM, PA = quantity("mol"), quantity("K"), quantity("C"), quantity("L"), quantity("atm"), quantity("Pa")
CYL = "In un cilindro con le pareti isolanti "
SAMPLE = CYL + "un campione di " + GAS + ", un gas " + KIND
VOLUME_RATIOS = [Rational(3, 2), Rational(2), Rational(5, 2), Rational(3), Rational(4)]
PRESSURE_RATIOS = VOLUME_RATIOS + [Rational(5)]


def volumes(sa, sb, expansion, errs):
    """The two volumes, three figures each, the small one 1,00-3,00 L, their ratio one of the spec's."""
    VA, VB = three(sa, errs, "V_A"), three(sb, errs, "V_B")
    if (VB > VA) != expansion:
        errs.append("the volumes do not agree with the verb")
    small, big = min(VA, VB), max(VA, VB)
    if not 1 <= small <= 3 or big / small not in VOLUME_RATIOS or big >= 10:
        errs.append(f"volumes {sa}, {sb} outside the spec")
    return VA, VB


def scenes(sample, errs, l, sa, spa, sb, unit, pB):
    """The drawing shows the data and not the answer; the solution's drawing adds the final pressure."""
    for key, with_pb in (("scene", False), ("solutionScene", True)):
        sc = sample.get(key)
        if not sc or sc.get("type") != "curve-pv" or not sc.get("alt"):
            errs.append(f"{key} missing or not a curve-pv")
            continue
        d = sc["data"]
        if d.get("curva") != "adiabatica" or abs(d.get("gamma", 0) - float(gamma(l))) > 1e-9:
            errs.append(f"{key}: wrong curve")
        if [Rational(str(d.get(k))) for k in ("VA", "pA", "VB")] != [value(sa), value(spa.split(" ")[0]), value(sb)]:
            errs.append(f"{key}: the data are not those of the text")
        if d.get("unitaV") != "L" or d.get("unitaP") != unit:
            errs.append(f"{key}: wrong units")
        want = {"VA": comma(sa), "pA": comma(spa.split(" ")[0]), "VB": comma(sb)}
        if with_pb:
            want["pB"] = comma(pB)
        if d.get("testi") != want:
            errs.append(f"{key}: labels {d.get('testi')} != {want}")


def level1(sample, errs):
    m = re.fullmatch(CYL + MOL + " di " + GAS + ", un gas " + KIND + r", (si espandono|vengono compresse): la temperatura passa da " + K + " a " + K + r"\. Quanto lavoro compie il gas\?" + R_TEXT, text(sample))
    if not m:
        errs.append(f"level 1 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(2), m.group(3), errs)
    n = value(m.group(1))
    if not re.fullmatch(r"\d\{,\}\d[05]", m.group(1)) or not 1 <= n <= 4:
        errs.append("moles not 1,00-4,00 in steps of 0,05")
    expansion = m.group(4) == "si espandono"
    TA, TB = whole(m.group(5), 280, 450, errs, "T_A"), whole(m.group(6), 150, 600, errs, "T_B")
    if (TB < TA) != expansion:
        errs.append("the temperatures do not agree with the verb")
    if not 15 <= abs(TA - TB) <= 150:
        errs.append("temperature change outside 15-150 K")
    answer(sample, errs, n * cv(l) * (TA - TB), 3, "J")
    return "espansione" if expansion else "compressione"


def level2(sample, errs):
    m = re.fullmatch(SAMPLE + ", occupa " + L + " alla pressione di " + ATM + r"\. Il gas (si espande|viene compresso) adiabaticamente fino a " + L + r"\. Qual è la pressione finale\?", text(sample))
    if not m:
        errs.append(f"level 2 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(1), m.group(2), errs)
    expansion = m.group(5) == "si espande"
    VA, VB = volumes(m.group(3), m.group(6), expansion, errs)
    pA = three(m.group(4), errs, "p_A")
    if not 1 <= pA <= 5:
        errs.append("p_A outside 1-5 atm")
    want = answer(sample, errs, pA * (VA / VB) ** gamma(l), 3, "atm")
    if want:
        scenes(sample, errs, l, m.group(3), m.group(4), m.group(6), "atm", want)
    return "espansione" if expansion else "compressione"


def level3(sample, errs):
    m = re.fullmatch(SAMPLE + ", a " + K + ", occupa " + L + r"\. Il gas (si espande|viene compresso) adiabaticamente fino a " + L + r"\. Qual è la temperatura finale\?", text(sample))
    if not m:
        errs.append(f"level 3 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(1), m.group(2), errs)
    expansion = m.group(5) == "si espande"
    TA = whole(m.group(3), 250, 450, errs, "T_A")
    VA, VB = volumes(m.group(4), m.group(6), expansion, errs)
    TB = TA * (VA / VB) ** (gamma(l) - 1)
    if TB >= Rational(1999, 2):
        errs.append("final temperature of 1000 K or more")
    answer(sample, errs, TB, 3, "K")
    return "espansione" if expansion else "compressione"


def level4(sample, errs):
    m = re.fullmatch(
        SAMPLE + ", occupa " + L + " alla pressione di " + ATM + r"\. Il gas (si espande adiabaticamente finché la pressione scende|viene compresso adiabaticamente finché la pressione sale) a " + ATM + r"\. Qual è il volume finale\?",
        text(sample),
    )
    if not m:
        errs.append(f"level 4 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(1), m.group(2), errs)
    expansion = m.group(5).startswith("si espande")
    VA = three(m.group(3), errs, "V_A")
    pA, pB = three(m.group(4), errs, "p_A"), three(m.group(6), errs, "p_B")
    if (pB < pA) != expansion:
        errs.append("the pressures do not agree with the verb")
    low, high = min(pA, pB), max(pA, pB)
    if not 1 <= low <= 2 or high / low not in PRESSURE_RATIOS or high >= 10 or not 1 <= VA <= 6:
        errs.append("data outside the spec")
    answer(sample, errs, VA * (pA / pB) ** (1 / gamma(l)), 3, "L")
    return "espansione" if expansion else "compressione"


def level5(sample, errs):
    m = re.fullmatch(SAMPLE + ", a " + C + r", viene compresso adiabaticamente fino a un volume \$(\d\{,\}\d\d)\$ volte più piccolo\. A quale temperatura arriva\?", text(sample))
    if not m:
        errs.append(f"level 5 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(1), m.group(2), errs)
    tA = whole(m.group(3), 10, 40, errs, "t_A")
    r = value(m.group(4))
    if not Rational(3, 2) <= r <= 9:
        errs.append("ratio outside 1,50-9,00")
    TB = (tA + 273) * r ** (gamma(l) - 1)
    if TB >= Rational(1999, 2):
        errs.append("final temperature of 1000 K or more")
    TB3 = rounded(TB, 3)
    if TB3 is None:
        errs.append("T_B too close to a rounding boundary")
        return m.group(2)
    tB = value(TB3) - 273
    if tB.q != 1 or tB % 10 == 0:
        errs.append(f"t_B = {tB} is not a whole number without a final zero")
    check_options(sample, errs, str(tB), "C")
    return m.group(2)


def level6(sample, errs):
    m = re.fullmatch(SAMPLE + ", occupa " + L + " alla pressione di " + PA + r"\. Il gas (si espande|viene compresso) adiabaticamente fino a " + L + r"\. Quanto lavoro compie il gas\?", text(sample))
    if not m:
        errs.append(f"level 6 text not recognised: {text(sample)!r}")
        return None
    l = gas_kind(m.group(1), m.group(2), errs)
    expansion = m.group(5) == "si espande"
    VA, VB = volumes(m.group(3), m.group(6), expansion, errs)
    mm = re.fullmatch(r"(\d\{,\}\d\d) \\cdot 10\^\{5\}", m.group(4))
    if not mm:
        errs.append(f"pressure {m.group(4)} not written as x,xx · 10^5 Pa")
        return None
    pA5 = value(mm.group(1))
    if not 1 <= pA5 <= 5:
        errs.append("p_A outside 1-5 · 10^5 Pa")
    g = gamma(l)
    # pressures in units of 10^5 Pa, volumes in litres: p V is in units of 100 J
    pB5 = pA5 * (VA / VB) ** g
    W = 100 * (pA5 * VA - pB5 * VB) / (g - 1)
    want = answer(sample, errs, W, 2, "J")
    pB3 = rounded(pB5, 3)
    if pB3 is None:
        errs.append("p_B too close to a rounding boundary")
        return None
    if want != signed(100 * (pA5 * VA - value(pB3) * VB) / (g - 1), 2):
        errs.append("the answer changes if p_B is rounded to three figures first")
    if (W > 0) != expansion:
        errs.append("the sign of the work does not agree with the verb")
    scenes(sample, errs, l, m.group(3), mm.group(1), m.group(6), "10⁵ Pa", pB3)
    return "espansione" if expansion else "compressione"


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
