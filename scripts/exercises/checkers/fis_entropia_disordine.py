"""Checker for fis-entropia-disordine (specs/exercises/fis-entropia-disordine.md), written from the spec and the lesson
119-fis-entropia-disordine.md, not from the generator.

N molecules in a box of two equal halves: a macrostate with N_s on the left and N_d on the right has
Ω = N!/(N_s! N_d!) microstates out of 2^N, all equally likely, so its probability is Ω/2^N. Ω is largest at N_s = N/2
and falls on both sides, so of two macrostates the one closer to N/2 has more microstates and, by S = k_B ln Ω, more
entropy. In a free expansion from V_A to V_B the microstates grow by (V_B/V_A)^N and ΔS = N k_B ln(V_B/V_A).
"""
import re

from sympy import Integer, Rational, binomial, log

from checkers._fis_frigo_entropia import K_B, answer, common, text, value

CASE_RANGES = {3: {"massimo": (0.40, 0.60), "minimo": (0.40, 0.60)}}

KB_TEX = r"\$k_B = 1\{,\}38 \\cdot 10\^\{-23\}\\,\\text\{J/K\}\$"
BOX = r"In una scatola divisa in due metà "
ASKS = {
    "ha più microstati": "massimo",
    "ha l'entropia più grande": "massimo",
    "ha meno microstati": "minimo",
    "ha l'entropia più piccola": "minimo",
}
GROWS = {"raddoppia": 2, "triplica": 3, "diventa $4$ volte più grande": 4, "diventa $5$ volte più grande": 5}


def scene(sample, errs, ns, nd):
    sc = sample.get("scene") or {}
    if sc.get("type") != "scatola-molecole" or sc.get("data") != {"sinistra": ns, "destra": nd}:
        errs.append(f"scene {sc.get('type')!r} {sc.get('data')!r} != {ns} left, {nd} right")


def counts(errs, n, ns, nd, lo):
    if not 4 <= n <= 10 or ns + nd != n or not lo <= ns <= n - lo:
        errs.append(f"counts {n}, {ns}, {nd} outside the ranges")


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(BOX + r"ci sono \$(\d+)\$ molecole\. Quanti microstati ha il macrostato con \$(\d+)\$ (molecola|molecole) a sinistra e \$(\d+)\$ a destra\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    n, ns, nd = int(m.group(1)), int(m.group(2)), int(m.group(4))
    counts(errs, n, ns, nd, 1)
    if (ns == 1) != (m.group(3) == "molecola"):
        errs.append("singular and plural")
    a = sample["answer"]
    opts = [o["latex"] for o in a["options"]]
    if len(opts) != 4 or len(set(opts)) != 4 or not all(re.fullmatch(r"[1-9]\d*", o) for o in opts):
        errs.append(f"need four distinct whole numbers: {opts}")
    elif opts[a["correct"]] != str(binomial(n, ns)):
        errs.append(f"correct option {opts[a['correct']]} != {binomial(n, ns)}")
    scene(sample, errs, ns, nd)
    return None


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(BOX + r"ci sono \$(\d+)\$ molecole, che si muovono a caso\. Qual è la probabilità di trovarne \$(\d+)\$ a sinistra e \$(\d+)\$ a destra\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    n, ns, nd = int(m.group(1)), int(m.group(2)), int(m.group(3))
    counts(errs, n, ns, nd, 0)
    answer(sample, errs, Rational(100 * binomial(n, ns), 2**n), 3, "pct")
    scene(sample, errs, ns, nd)
    return None


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(BOX + r"\$(\d+)\$ molecole si muovono a caso\. Quale di questi macrostati, indicati con il numero \$N_s\$ di molecole a sinistra, (.+)\?", s)
    if not m or m.group(2) not in ASKS:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    n, kind = int(m.group(1)), ASKS[m.group(2)]
    if n not in (20, 30, 40, 50, 60, 80, 100):
        errs.append(f"{n} molecules")
    a = sample["answer"]
    picked = []
    for o in a["options"]:
        mm = re.fullmatch(r"N_s = (\d+)", o["latex"])
        if not mm or not 0 <= int(mm.group(1)) <= n:
            errs.append(f"option {o['latex']!r}")
            return kind
        picked.append(int(mm.group(1)))
    if len(set(picked)) != 4:
        errs.append("need four distinct macrostates")
        return kind
    # The multiplicities themselves, not the distance from the middle: the rule of the lesson is what is being checked.
    omegas = [binomial(n, k) for k in picked]
    if len(set(omegas)) != 4:
        errs.append("two macrostates with the same multiplicity")
    half = Rational(n, 2)
    if all(k >= half for k in picked) or all(k <= half for k in picked):
        errs.append("all the macrostates on one side of the middle")
    best = max(omegas) if kind == "massimo" else min(omegas)
    if omegas[a["correct"]] != best:
        errs.append(f"correct option N_s = {picked[a['correct']]} is not the {kind}")
    return kind


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un macrostato di un sistema ha \$\\Omega = (\d\{,\}[1-9]) \\cdot 10\^\{(\d+)\}\$ microstati\. Quanto vale la sua entropia\? Usa " + KB_TEX + r"\.", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    e = int(m.group(2))
    if not 10 <= e <= 60 or m.group(1)[0] == "0":
        errs.append("multiplicity outside the ranges")
    omega = value(m.group(1)) * Integer(10) ** e
    answer(sample, errs, K_B * log(omega), 3, "JK")
    return None


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un gas perfetto con \$(\d\{,\}[1-9]) \\cdot 10\^\{(\d+)\}\$ molecole si espande liberamente in un recipiente isolato, e il suo volume (.+)\. Di quanto varia la sua entropia\? Usa " + KB_TEX + r"\.",
        s,
    )
    if not m or m.group(3) not in GROWS:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    e = int(m.group(2))
    if not 20 <= e <= 24 or m.group(1)[0] == "0":
        errs.append("number of molecules outside the ranges")
    N = value(m.group(1)) * Integer(10) ** e
    answer(sample, errs, N * K_B * log(GROWS[m.group(3)]), 2, "JK")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    a = sample.get("answer", {})
    if a.get("kind") != "choice" or not isinstance(a.get("correct"), int) or not 0 <= a["correct"] < len(a.get("options", [])) or len(a["options"]) != 4:
        return errs + ["answer is not a choice of four options"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if lvl >= 3 and sample.get("scene"):
        errs.append("a scene where none is expected")
    return errs, kind
