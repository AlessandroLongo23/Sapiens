"""Checker for fis-ciclo-carnot (specs/exercises/fis-ciclo-carnot.md), written from the spec and the lesson
116-fis-ciclo-carnot.md, not from the generator.

A reversible engine between T_c and T_f (kelvin; t + 273 from degrees Celsius) has the efficiency 1 - T_f / T_c, does
the work eta Q_c and gives off Q_c T_f / T_c. From the efficiency, T_c = T_f / (1 - eta) and T_f = (1 - eta) T_c. A
declared engine: first W = Q_c - Q_f (else the first law is broken), then W / Q_c against 1 - T_f / T_c: above, the
second law is broken; equal, reversible; below, irreversible. A Carnot cycle run by n moles absorbs
n R T_c ln(V_B / V_A) and does the work n R (T_c - T_f) ln(V_B / V_A), with R = 8,31 J/(mol K).
"""
import math
import re

from sympy import Rational

from checkers._fis_macchine import ETA, INT, SIG2, SIG3, common, engine_scene, expect, expect_words, flow, label, no_scene, parse, prose, q, two_sig

CASE_RANGES = {
    3: {"lavoro": (0.40, 0.60), "ceduto": (0.40, 0.60)},
    4: {"calda": (0.40, 0.60), "fredda": (0.40, 0.60)},
    5: {k: (0.19, 0.31) for k in ("irreversibile", "reversibile", "secondo", "primo")},
}

VERDICTS = {
    "irreversibile": "Sì, ed è irreversibile",
    "reversibile": "Sì, ed è reversibile",
    "secondo": "No: viola il secondo principio",
    "primo": "No: viola il primo principio",
}
K = q("K")
J = q("J")


def whole(errs, s, lo, hi, what):
    v = parse(s)
    if v.q != 1 or not lo <= v <= hi:
        errs.append(f"{what} {s} out of range")
    return v


def rev(errs, Tc, Tf):
    eta = 1 - Tf / Tc
    if not Rational(15, 100) <= eta <= Rational(70, 100):
        errs.append("reversible efficiency out of range")
    return eta


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una macchina reversibile lavora tra una sorgente a " + K + " e una a " + K + r"\. Qual è il suo rendimento\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    Tc, Tf = whole(errs, m.group(1), 420, 900, "T_c"), whole(errs, m.group(2), 255, 345, "T_f")
    no_scene(sample, errs)
    vals = expect(sample, errs, rev(errs, Tc, Tf), "none", ETA)
    if any(v > 1 for v in vals):
        errs.append("an option above 1")
    if vals and not any(abs(v - Tf / Tc) <= Rational(1, 200) for v in vals):
        errs.append("the ratio of the temperatures is not among the options")
    return "kelvin"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una macchina reversibile lavora tra una sorgente a " + q("C") + " e una a " + q("C") + r"\. Qual è il suo rendimento\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    tc, tf = whole(errs, m.group(1), 150, 650, "t_c"), whole(errs, m.group(2), 5, 60, "t_f")
    no_scene(sample, errs)
    vals = expect(sample, errs, rev(errs, tc + 273, tf + 273), "none", ETA)
    if any(v > 1 for v in vals):
        errs.append("an option above 1")
    # the lesson's mistake, the ratio of the Celsius temperatures, is among the options
    if vals and not any(abs(v - (1 - tf / tc)) <= Rational(1, 200) for v in vals):
        errs.append("the Celsius mistake is not among the options")
    return "celsius"


def level3(sample, errs):
    s = prose(sample["problem"])
    head = r"Una macchina reversibile lavora tra una sorgente a " + K + " e una a " + K + r", e in ogni ciclo assorbe " + q("kJ") + r" dalla sorgente calda\. "
    if m := re.fullmatch(head + r"Quanto lavoro compie in un ciclo\?", s):
        kind = "lavoro"
    elif m := re.fullmatch(head + r"Quanto calore cede alla sorgente fredda in un ciclo\?", s):
        kind = "ceduto"
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    Tc, Tf = whole(errs, m.group(1), 420, 900, "T_c"), whole(errs, m.group(2), 255, 345, "T_f")
    Qc = two_sig(errs, m.group(3), "heat")
    if not Rational(11, 10) <= Qc <= 99:
        errs.append("heat out of range")
    eta = rev(errs, Tc, Tf)
    sc = sample.get("scene") or {}
    if sc.get("data", {}).get("sorgenti") != {"calda": label(Tc, "K"), "fredda": label(Tf, "K")}:
        errs.append("scene: the reservoirs' temperatures are not the problem's")
    (d,) = engine_scene(sample, errs, 1)
    flow(errs, d, "caldo", "entra", "Qc = " + label(Qc, "kJ"))
    flow(errs, d, "freddo", "esce", "" if kind == "lavoro" else "Qf = ?")
    flow(errs, d, "lavoro", "esce", "W = ?" if kind == "lavoro" else "")
    W, Qf = eta * Qc, (1 - eta) * Qc
    vals = expect(sample, errs, W if kind == "lavoro" else Qf, "kJ", SIG2)
    other = Qf if kind == "lavoro" else W
    if vals and not any(abs(v - other) <= other / 20 for v in vals):
        errs.append("the other quantity is not among the options")
    return kind


def level4(sample, errs):
    s = prose(sample["problem"])
    head = r"Una macchina reversibile ha un rendimento di \$(0\{,\}\d\d)\$ e "
    no_scene(sample, errs)
    if m := re.fullmatch(head + r"cede calore a una sorgente a " + K + r"\. Qual è la temperatura della sorgente calda\?", s):
        eta, Tf = parse(m.group(1)), whole(errs, m.group(2), 265, 325, "T_f")
        truth, kind = Tf / (1 - eta), "calda"
    elif m := re.fullmatch(head + r"assorbe calore da una sorgente a " + K + r"\. Qual è la temperatura della sorgente fredda\?", s):
        eta, Tc = parse(m.group(1)), whole(errs, m.group(2), 450, 900, "T_c")
        truth, kind = (1 - eta) * Tc, "fredda"
    else:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if not Rational(20, 100) <= eta <= Rational(68, 100):
        errs.append("efficiency out of range")
    expect(sample, errs, truth, "K", INT)
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un costruttore dichiara che la sua macchina termica, lavorando tra una sorgente a " + K + " e una a " + K + r", in ogni ciclo assorbe " + J + ", cede " + J + " e compie " + J + r" di lavoro\. Può esistere\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    Tc, Tf, Qc, Qf, W = (parse(m.group(i)) for i in range(1, 6))
    if not (250 <= Tf <= 350 and 420 <= Tc <= 900 and Tc % 5 == 0 and Tf % 5 == 0):
        errs.append("temperatures out of range")
    eta_rev = 1 - Tf / Tc
    if not Rational(20, 100) <= eta_rev <= Rational(70, 100):
        errs.append("reversible efficiency out of range")
    if not (0 < W < Qc and Qf > 0):
        errs.append("heats out of range")
    no_scene(sample, errs)
    if W != Qc - Qf:
        if abs(W - (Qc - Qf)) < 20:
            errs.append("the imbalance is too small to see")
        kind = "primo"
    else:
        eta = W / Qc
        if eta == eta_rev:
            kind = "reversibile"
        else:
            if abs(eta - eta_rev) < Rational(3, 100):
                errs.append("the declared efficiency is too close to the reversible one")
            kind = "secondo" if eta > eta_rev else "irreversibile"
    expect_words(sample, errs, VERDICTS, kind)
    return kind


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un ciclo di Carnot è percorso da \$(0\{,\}\d\d\d)\\,\\text\{mol\}\$ di gas perfetto tra le temperature di " + K + " e " + K + r"\. Nell'espansione isoterma il volume del gas passa da \$(\d+\{,\}\d+)\\,\\text\{L\}\$ a \$(\d+\{,\}\d+)\\,\\text\{L\}\$\. Quanto lavoro compie il gas in un ciclo\? Usa \$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\.",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    n, Tc, Tf, VA, VB = parse(m.group(1)), whole(errs, m.group(2), 400, 650, "T_c"), whole(errs, m.group(3), 250, 350, "T_f"), parse(m.group(4)), parse(m.group(5))
    if not Rational(1, 10) <= n <= Rational(8, 10) or VB / VA not in (2, 3, 4) or not 1 <= VA <= Rational(5, 2):
        errs.append("moles or volumes out of range")
    for txt in (m.group(4), m.group(5)):
        if len(txt.replace("{,}", "")) != 3:
            errs.append(f"volume {txt} not with three figures")
    if 1 - Tf / Tc < Rational(15, 100):
        errs.append("efficiency under 0,15")
    ratio = float(VB / VA)
    nR = float(n) * 8.31
    W = nR * float(Tc - Tf) * math.log(ratio)
    if not 100 <= W < 10000:
        errs.append("work out of range")
    # a result from a logarithm: it must be clear of a rounding boundary at three figures
    y = W / 10 ** (math.floor(math.log10(W)) - 2)
    if abs(y - math.floor(y) - 0.5) < 0.015:
        errs.append("the work is too close to a rounding boundary")
    truth = Rational(round(W * 100000), 100000)
    vals = expect(sample, errs, truth, "J", SIG3)
    Qc = nR * float(Tc) * math.log(ratio)
    if vals and not any(abs(float(v) - Qc) <= Qc / 100 for v in vals):
        errs.append("the heat absorbed is not among the options")
    sc = sample.get("scene") or {}
    if sc.get("type") != "ciclo-carnot" or not sc.get("alt"):
        errs.append("missing scene ciclo-carnot")
    else:
        d = sc["data"]
        st = {x["nome"]: x for x in d.get("stati", [])}
        k = (float(Tc) / float(Tf)) ** 1.5  # monatomic gas: T V^(2/3) constant along the adiabats
        want = {
            "A": (float(VA), nR * float(Tc) / float(VA)),
            "B": (float(VB), nR * float(Tc) / float(VB)),
            "C": (float(VB) * k, nR * float(Tf) / (float(VB) * k)),
            "D": (float(VA) * k, nR * float(Tf) / (float(VA) * k)),
        }
        for name, (V, p) in want.items():
            g = st.get(name)
            if not g or abs(g["V"] - V) > 1e-3 * V or abs(g["p"] - p) > 1e-3 * p:
                errs.append(f"scene: state {name} is {g}, expected V = {V:.4f}, p = {p:.4f}")
        if d.get("temperature") != {"calda": f"{Tc} K", "fredda": f"{Tf} K"}:
            errs.append("scene: the temperatures are not the problem's")
        if set(d) - {"V", "p", "stati", "temperature", "gamma"}:
            errs.append("the problem's scene carries more than the data")
        if d["V"]["passo"] * d["V"]["celle"] < want["C"][0] or d["p"]["passo"] * d["p"]["celle"] < want["A"][1]:
            errs.append("the cycle does not fit the axes")
        if d["V"]["celle"] > 10 or d["p"]["celle"] > 10:
            errs.append("too many cells on an axis")
    return "gas"


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
