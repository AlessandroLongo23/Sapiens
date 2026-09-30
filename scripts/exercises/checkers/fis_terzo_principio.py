"""Checker for fis-terzo-principio (specs/exercises/fis-terzo-principio.md), written from the spec and the lesson
52-fis-terzo-principio.md, not from the generator.

Level 1: the reaction of a force, among four sentences; the table below is written again from the lesson. Level 2:
the same force F on two bodies, a = F / m of the one asked. Level 3: F = m_A a_A, a_B = F / m_B. Level 4: a body of
mass m pulls the Earth (5,97 * 10^24 kg) with its weight, a_T = m g / M_T, in scientific notation. Level 5: a model
rocket, a = (F - m g) / m. g = 49/5, exact arithmetic.
"""
import re

from sympy import Rational

from checkers._dinamica import ACC, G, KG, NW, answer2, answer_sci, data2, no_scene
from checkers._vettori import check_choice, common, prose, round_sig

CASE_RANGES = {
    2: {"pattinatori": (0.40, 0.60), "canoe": (0.40, 0.60)},
}

# situation, action -> (reaction, three forces that are not its reaction)
PAIRS = {
    ("Un libro è fermo su un tavolo.", "il peso del libro, cioè la Terra che attira il libro"): ("il libro attira la Terra", {"il tavolo spinge il libro", "il libro preme sul tavolo", "la Terra attira il tavolo"}),
    ("Un libro è fermo su un tavolo.", "la forza con cui il tavolo spinge il libro verso l'alto"): ("il libro preme sul tavolo", {"la Terra attira il libro", "il libro attira la Terra", "il pavimento spinge il tavolo"}),
    ("Una ragazza cammina.", "la forza con cui il piede spinge il suolo all'indietro"): ("il suolo spinge il piede in avanti", {"il suolo spinge il piede in su", "la Terra attira la ragazza", "il piede spinge il suolo in giù"}),
    ("Un razzo decolla.", "la forza con cui il razzo spinge i gas di scarico verso il basso"): ("i gas spingono il razzo in su", {"la Terra attira il razzo", "l'aria spinge il razzo in su", "i gas spingono il razzo in giù"}),
    ("Una lampada è appesa al soffitto con un filo.", "il peso della lampada"): ("la lampada attira la Terra", {"il filo tira la lampada in su", "la lampada tira il filo in giù", "il soffitto tira il filo in su"}),
    ("Un martello colpisce un chiodo.", "la forza del martello sul chiodo"): ("il chiodo spinge il martello", {"il legno spinge il chiodo", "la mano spinge il martello", "la Terra attira il martello"}),
    ("Un nuotatore avanza a rana.", "la forza con cui le mani spingono l'acqua all'indietro"): ("l'acqua spinge le mani in avanti", {"l'acqua spinge le mani indietro", "la Terra attira il nuotatore", "l'acqua spinge il nuotatore in su"}),
}
EARTH = Rational(597, 100) * Rational(10) ** 24


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.+?\.) Quale forza forma una coppia di azione e reazione con (.+)\?", s)
    if not m or (m.group(1), m.group(2)) not in PAIRS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    right, wrong = PAIRS[(m.group(1), m.group(2))]
    opts = check_choice(sample, errs, f"\\text{{{right}}}")
    if {o for o in opts} != {f"\\text{{{x}}}" for x in wrong | {right}}:
        errs.append(f"options {opts} are not the pair's")
    no_scene(sample, errs)
    return "coppie"


def level2(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Due pattinatori, di " + KG + " e " + KG + r", sono fermi sul ghiaccio e si spingono con una forza di " + NW + r"\. Quanto vale l'accelerazione del pattinatore di " + KG + r"\?", s):
        kind = "pattinatori"
    elif m := re.fullmatch(r"Due canoe, di " + KG + " e " + KG + r" con chi le guida, sono ferme sull'acqua\. Chi sta nella prima tira una fune legata alla seconda, e la fune tira ciascuna canoa verso l'altra con una forza di " + NW + r"\. Quanto vale l'accelerazione della canoa di " + KG + r"\?", s):
        kind = "canoe"
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    mA, mB, F = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "mass"), data2(errs, m.group(3), "force")
    if m.group(4) not in (m.group(1), m.group(2)):
        errs.append("the mass asked is not one of the two")
    if min(mA, mB) < 40 or abs(mA - mB) < 10:
        errs.append("masses outside the ranges")
    asked = Rational(m.group(4).replace("{,}", "."))
    answer2(sample, errs, F / asked, "acc", low=Rational(0))
    # the classic mistake, the other body's acceleration, must be among the options (it depends on the other mass)
    other = round_sig(F / (mA + mB - asked), 2)
    if other and not re.fullmatch(r"[1-9]0", other) and other + r"\,\text{m/s}^2" not in [o["latex"] for o in sample["answer"]["options"]]:
        errs.append("the other body's acceleration is not among the options")
    no_scene(sample, errs)
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Due pattinatori, di " + KG + " e " + KG + r", sono fermi sul ghiaccio e si spingono\. Il pattinatore di " + KG + r" ha un'accelerazione di " + ACC + r"\. Quanto vale l'accelerazione dell'altro\?", s)
    if not m or m.group(3) != m.group(1):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mA, mB, aA = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "mass"), data2(errs, m.group(4), "acceleration")
    if min(mA, mB) < 40 or abs(mA - mB) < 10:
        errs.append("masses outside the ranges")
    answer2(sample, errs, aA * mA / mB, "acc", low=Rational(0))
    no_scene(sample, errs)
    return "accelerazioni"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un sasso|Un vaso|Uno zaino) di " + KG + r" cade dall'alto\. Quanto vale l'accelerazione che (il sasso|il vaso|lo zaino) dà alla Terra\? La massa della Terra è \$5\{,\}97 \\cdot 10\^\{24\}\\,\\text\{kg\}\$\.", s)
    if not m or m.group(1).split()[1] != m.group(3).split()[1]:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass = data2(errs, m.group(2), "mass")
    answer_sci(sample, errs, mass * G / EARTH, "acc")
    no_scene(sample, errs)
    return "terra"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un razzo modello di \$(0\{,\}\d\d)\\,\\text\{kg\}\$ parte verticalmente; i gas di scarico lo spingono verso l'alto con una forza di " + NW + r"\. Quanto vale la sua accelerazione alla partenza\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass, F = data2(errs, m.group(1), "mass"), data2(errs, m.group(2), "force")
    P = mass * G
    if not Rational(13, 10) * P <= F <= 4 * P:
        errs.append("thrust outside 1,3-4 times the weight")
    answer2(sample, errs, (F - P) / mass, "acc", low=Rational(0))
    no_scene(sample, errs)
    return "razzo"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


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
