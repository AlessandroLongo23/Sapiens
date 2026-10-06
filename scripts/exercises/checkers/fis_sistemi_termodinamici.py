"""Checker for fis-sistemi-termodinamici (specs/exercises/fis-sistemi-termodinamici.md), written from the spec and the
lesson 107-fis-sistemi-termodinamici.md, not from the generator.

An open system exchanges matter and energy, a closed one only energy, an isolated one neither. T = pV / (nR). A wall
moves only if it is mobile and the pressures differ; heat passes only if the wall conducts and the temperatures
differ. Zeroth law: two bodies in thermal equilibrium with a third are in equilibrium with each other; heat goes from
the hotter to the colder. A free conducting piston stops where V_1 / V_2 = n_1 / n_2.
"""
import re

from sympy import Rational

from checkers._fis_cinetica import R_GAS, expect, expect_label, parse, prose, q, run

CASE_RANGES = {
    1: {"aperto": (0.28, 0.48), "chiuso": (0.28, 0.48), "isolato": (0.17, 0.33)},
    5: {"meno gas a sinistra": (0.40, 0.60), "più gas a sinistra": (0.40, 0.60)},
    3: {h: (0.18, 0.32) for h in ("Niente: sono in equilibrio", "Si sposta solo la parete", "Passa solo calore", "La parete si sposta e passa calore")},
}

R_NOTE = r" \(\$R = 8\{,\}31\\,\\text\{J/\(mol\}\\cdot\\text\{K\)\}\$\)"

# the systems of the spec, each with its kind
SYSTEMS = {
    "l'acqua che bolle in una pentola senza coperchio": "aperto",
    "una tazza di tè fumante": "aperto",
    "una persona che corre": "aperto",
    "la legna che brucia in un camino": "aperto",
    "il motore acceso di un'auto": "aperto",
    "una pozzanghera al sole": "aperto",
    "l'aria in un palloncino annodato lasciato al sole": "chiuso",
    "una lattina sigillata lasciata al sole": "chiuso",
    "il gas in un cilindro chiuso da un pistone a tenuta": "chiuso",
    "l'acqua in una bottiglia tappata messa in frigorifero": "chiuso",
    "una borsa del ghiaccio sigillata appoggiata su un ginocchio": "chiuso",
    "l'acqua in una pentola a pressione chiusa, sul fuoco, prima che la valvola fischi": "chiuso",
    "il tè in un thermos perfetto, ben chiuso": "isolato",
    "l'acqua in un calorimetro ideale, chiuso": "isolato",
    "un gas in un recipiente rigido, sigillato, con le pareti adiabatiche": "isolato",
    "il ghiaccio e la bibita in un contenitore termico perfetto, chiuso": "isolato",
}
EXCHANGE = {"aperto": "materia ed energia", "chiuso": "solo energia", "isolato": "né materia né energia"}
L1_OPTIONS = set(EXCHANGE.values()) | {"solo materia"}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Considera come sistema (.*)\. Che cosa scambia con l'ambiente\?", s)
    if not m or m.group(1) not in SYSTEMS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    kind = SYSTEMS[m.group(1)]
    expect_label(sample, errs, EXCHANGE[kind], L1_OPTIONS)
    if f"sistema {kind}" not in sample["solution"]:
        errs.append("the solution does not name the kind of system")
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Il punto A della figura è lo stato di " + q("mol") + r" di gas perfetto\. Qual è la temperatura del gas\?" + R_NOTE, s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    n = parse(m.group(1))
    if not Rational(101, 1000) <= n <= Rational(499, 1000) or m.group(1).endswith("0"):
        errs.append("moles out of the spec")
    scene = sample.get("scene") or {}
    data = scene.get("data", {})
    states = data.get("stati", [])
    if scene.get("type") != "piano-pv" or len(states) != 1 or states[0].get("nome") != "A" or data.get("tratti") or "area" in data:
        errs.append("the scene is not the plane with the state A alone")
        return None
    V, p = Rational(str(states[0]["V"])), Rational(str(states[0]["p"]))
    ax, ay = data["V"], data["p"]
    if ax.get("unita") != "L" or ay.get("unita") != "kPa" or V % ax["passo"] or p % ay["passo"] or V > ax["passo"] * ax["celle"] or p > ay["passo"] * ay["celle"]:
        errs.append("the state is not on a crossing of the grid")
    if not (2 <= V <= 8 and 100 <= p <= 400):
        errs.append("state out of range")
    T = p * 1000 * V / 1000 / (n * R_GAS)
    if not 150 <= T <= 900:
        errs.append(f"temperature {float(T)} out of range")
    expect(sample, errs, T, "K", 3)
    return "stato"


HAPPENS = ["Niente: sono in equilibrio", "Si sposta solo la parete", "Passa solo calore", "La parete si sposta e passa calore"]


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Due gas sono separati da una parete (mobile|fissa) e (conduttrice|isolante)\. A sinistra la pressione è " + q("kPa") + " e la temperatura " + q("K")
        + "; a destra " + q("kPa") + " e " + q("K") + r"\. Che cosa succede\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    p1, T1, p2, T2 = (parse(x) for x in m.groups()[2:])
    if not all(81 <= p <= 299 for p in (p1, p2)) or not all(251 <= T <= 449 for T in (T1, T2)):
        errs.append("data out of range")
    if 0 < abs(p1 - p2) < 20 or 0 < abs(T1 - T2) < 20:
        errs.append("values different but too close")
    moves = m.group(1) == "mobile" and p1 != p2
    heat = m.group(2) == "conduttrice" and T1 != T2
    right = HAPPENS[3 if moves and heat else 1 if moves else 2 if heat else 0]
    expect_label(sample, errs, right, set(HAPPENS))
    return right


HEAT = ["Non passa calore", "Passa calore da A a B", "Passa calore da B ad A", "Passa calore, ma non si sa in che verso"]
ASK = r" Poi A e B vengono messi a contatto\. Che cosa succede\?"


def level4(sample, errs):
    s = prose(sample["problem"])
    if re.fullmatch(r"Il corpo A è in equilibrio termico con un terzo corpo C, e anche il corpo B lo è\." + ASK, s):
        right, kind = HEAT[0], "terzo corpo, equilibrio"
    elif re.fullmatch(r"Il corpo A è in equilibrio termico con un terzo corpo C; il corpo B, messo a contatto con C, non lo è\." + ASK, s):
        right, kind = HEAT[3], "terzo corpo, verso ignoto"
    else:
        m = re.fullmatch(r"Un termometro segna " + q("C") + " a contatto con il corpo A e " + q("C") + r" a contatto con il corpo B\." + ASK, s)
        if not m:
            errs.append(f"level 4 text not recognised: {s!r}")
            return None
        a, b = parse(m.group(1)), parse(m.group(2))
        if not (15 <= a <= 45 and 15 <= b <= 45) or 0 < abs(a - b) < Rational(1, 2) or "{,}" not in m.group(1) or "{,}" not in m.group(2):
            errs.append("readings out of the spec")
        right = HEAT[0] if a == b else HEAT[1] if a > b else HEAT[2]
        kind = "termometro, uguali" if a == b else "termometro, A più caldo" if a > b else "termometro, B più caldo"
    expect_label(sample, errs, right, set(HEAT))
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un cilindro orizzontale lungo " + q("cm") + ", chiuso alle estremità, è diviso da un pistone che scorre senza attrito e conduce il calore\\. A sinistra ci sono "
        + q("mol") + " di gas, a destra " + q("mol") + r"\. Quanto è lunga la parte di sinistra all'equilibrio\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    L, n1, n2 = (parse(x) for x in m.groups())
    if L.q != 1 or L % 10 == 0 or not 41 <= L <= 99:
        errs.append("length out of the spec")
    for x, n in ((m.group(2), n1), (m.group(3), n2)):
        if not Rational(11, 100) <= n <= Rational(99, 100) or x.endswith("0"):
            errs.append("moles out of the spec")
    if abs(n1 - n2) < Rational(1, 10):
        errs.append("the two amounts are too close")
    expect(sample, errs, L * n1 / (n1 + n2), "cm", 2)
    return "meno gas a sinistra" if n1 < n2 else "più gas a sinistra"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    return run(LEVELS, sample)
