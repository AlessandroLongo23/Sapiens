"""Checker for fis-teoria-cinetica (specs/exercises/fis-teoria-cinetica.md), written from the spec and the lesson
105-fis-teoria-cinetica.md, not from the generator.

N = n N_A; m = M / N_A with M turned from g/mol into kg/mol; v_qm = sqrt(mean of the squares); p = N m v_qm^2 / (3 V)
with V turned from litres into cubic metres; v_qm = sqrt(3 p / d); p / p_0 = (N factor)(v factor)^2 / (V factor).
"""
import re

from sympy import Rational

from checkers._fis_cinetica import GAS, GASES, N_A, expect, parse, prose, q, run, sig_of, sqrt

CASE_RANGES = {
    1: {"centesimi": (0.40, 0.60), "decimi": (0.40, 0.60)},
    5: {"gas leggero": (0.40, 0.60), "gas denso": (0.40, 0.60)},
}

NA_NOTE = r" \(\$N_A = 6\{,\}02 \\cdot 10\^\{23\}\\,\\text\{mol\}\^\{-1\}\$\)"
DEL = r"(?:dell'|del |dello )"
LITRES = {Rational(x) for x in ("1", "3/2", "2", "5/2", "3", "4", "5", "6", "8")}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un recipiente contiene " + q("mol") + " di " + GAS + r"\. Quant(i atomi|e molecole) ci sono\?" + NA_NOTE, s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    n = parse(m.group(1))
    if sig_of(m.group(1)) != 2 or m.group(1).endswith("0") or not Rational(11, 100) <= n <= Rational(99, 10):
        errs.append(f"moles {m.group(1)} not with two figures in range")
    if (m.group(3) == "i atomi") != GASES[m.group(2)][1]:
        errs.append("atoms and molecules mixed up")
    expect(sample, errs, n * N_A, "", 2)
    return "centesimi" if n < 1 else "decimi"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"La massa molare " + DEL + GAS + " è " + q("gmol") + r"\. Qual è la massa di (un suo atomo|una sua molecola)\?" + NA_NOTE, s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    gas, M = m.group(1), m.group(2)
    if GASES[gas][0] != M:
        errs.append(f"molar mass {M} is not the table's for {gas}")
    if (m.group(3) == "un suo atomo") != GASES[gas][1]:
        errs.append("atoms and molecules mixed up")
    expect(sample, errs, parse(M) / 1000 / N_A, "kg", 3)
    return "atomo" if GASES[gas][1] else "molecola"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente ci sono ([345]) molecole con velocità di modulo (.*)\. Quanto vale la loro velocità quadratica media\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    speeds = [parse(x) for x in re.findall(r"\$(\d+)\\,\\text\{m/s\}\$", m.group(2))]
    if re.sub(r"\$\d+\\,\\text\{m/s\}\$", "V", m.group(2)) != ", ".join(["V"] * (len(speeds) - 1)) + " e V":
        errs.append("the list of speeds is not written as a list")
    if len(speeds) != int(m.group(1)):
        errs.append("the number of molecules does not match the speeds")
    if len(set(speeds)) != len(speeds) or any(v % 10 or not 150 <= v <= 950 for v in speeds) or max(speeds) - min(speeds) < 250:
        errs.append(f"speeds out of the spec: {speeds}")
    scene = sample.get("scene") or {}
    if scene.get("type") != "molecole-velocita" or [Rational(x) for x in scene.get("data", {}).get("velocita", [])] != speeds:
        errs.append("the scene does not draw the speeds of the text")
    expect(sample, errs, sqrt(sum(v * v for v in speeds) / len(speeds)), "ms", 3)
    return f"{len(speeds)} molecole"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"In un recipiente di " + q("L") + r" ci sono \$(" + r"\d\{,\}\d\d \\cdot 10\^\{\d+\}" + r")\$ (atomi|molecole) di " + GAS + ", di massa " + q("kg")
        + r" ciascun[oa], con velocità quadratica media " + q("ms") + r"\. Quanto vale la pressione del gas\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    V, N, kind, gas, mass, v = m.groups()
    if parse(V) not in LITRES or sig_of(V) != 3:
        errs.append(f"volume {V} not in the list")
    if (kind == "atomi") != GASES[gas][1]:
        errs.append("atoms and molecules mixed up")
    # the mass of the molecule is the gas's, M / N_A, with three figures
    from checkers._fis_cinetica import fmt

    if fmt(parse(GASES[gas][0]) / 1000 / N_A, 3) != mass:
        errs.append(f"mass {mass} is not that of a molecule of {gas}")
    speed = parse(v)
    if not 151 <= speed <= 999 or speed % 10 == 0:
        errs.append(f"speed {v} out of range")
    p = parse(N) * parse(mass) * speed**2 / (3 * parse(V) / 1000)
    if not 4 * 10**4 <= p <= 42 * 10**4:
        errs.append(f"pressure {float(p)} out of range")
    expect(sample, errs, p, "Pa", 3)
    return kind


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un gas alla pressione di " + q("Pa") + " ha densità " + q("kgm3") + r"\. Quanto vale la velocità quadratica media delle sue molecole\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    p, d = parse(m.group(1)), parse(m.group(2))
    if sig_of(m.group(1)) != 3 or sig_of(m.group(2)) != 3 or p % 1000 or (p / 1000) % 10 == 0 or not 61000 <= p <= 299000:
        errs.append("pressure not as the spec wants")
    if not (Rational(101, 1000) <= d <= Rational(999, 1000) or Rational(101, 100) <= d <= Rational(249, 100)) or m.group(2).endswith("0"):
        errs.append("density out of range")
    expect(sample, errs, sqrt(3 * p / d), "ms", 3)
    return "gas leggero" if d < 1 else "gas denso"


FACTOR = {"raddoppia": Rational(2), "triplica": Rational(3), "si dimezza": Rational(1, 2), "non cambia": Rational(1)}
VERB = "(" + "|".join(FACTOR) + ")"


def p0(k):
    if k == 1:
        return "p_0"
    return f"{k.p}\\,p_0" if k.q == 1 else f"\\dfrac{{{k.p}}}{{{k.q}}}\\,p_0"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un recipiente il numero di molecole " + VERB + ", il volume " + VERB + " e la velocità quadratica media " + VERB + r"\. La pressione iniziale è \$p_0\$: quanto vale quella finale\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    a, b, c = (FACTOR[x] for x in m.groups())
    if c == 1 or sum(x != 1 for x in (a, b, c)) < 2:
        errs.append("fewer than two quantities change, or the speed does not")
    k = a * c**2 / b
    ans = sample["answer"]
    opts = ans["options"]
    vals = [Rational(o["values"][0]) for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4:
        errs.append("need four distinct options")
    for o, v in zip(opts, vals):
        if o["latex"] != p0(v) or v <= 0:
            errs.append(f"option {o['latex']!r} is not its value {v} times p_0")
    if vals[ans["correct"]] != k:
        errs.append(f"correct option {vals[ans['correct']]} != {k}")
    if sample["solution"] != "p = " + p0(k):
        errs.append("the solution is not the answer")
    return "più veloci" if c > 1 else "più lente"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    return run(LEVELS, sample)
