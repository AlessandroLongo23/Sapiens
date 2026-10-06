"""Checker for chim-fissione-fusione (specs/exercises/chim-fissione-fusione.md), written from the spec and the lesson
56-chim-fissione-fusione.md, not from the generator.

Mass defect Δm = Z·m_p + N·m_n − m_nucleus; binding energy E = Δm·c², with 1 u = 1,6605·10⁻²⁷ kg and
c = 3,00·10⁸ m/s (so 1 u ↔ 1,494·10⁻¹⁰ J); binding energy per nucleon E/A, the larger the more stable; the energy of a
reaction from the masses of reactants and products; the energy of a mass of fuel through the number of nuclei. The
masses and the binding energies in the text must be the real ones (AME2020, tables below, taken from the mass table and
not from the generator). Exact arithmetic with sympy.
"""
import re

from sympy import Rational

from checkers._chim3_c import NAMES, NEUTRON, Z_OF, ambiguous_zero, check_choice, common, dec, nuclide, prose_and_extra, sci, sig_tex

CASE_RANGES = {5: {"fissione": (0.40, 0.60), "fusione": (0.40, 0.60)}}

M_P, M_N = Rational("1.00728"), Rational("1.00866")
U_KG, C, N_A = Rational("1.6605e-27"), Rational(3 * 10**8), Rational("6.022e23")
J_PER_U = Rational("1.494e-10")

NUCLEAR_MASS = {(1, 2): "2.01355", (1, 3): "3.01550", (2, 3): "3.01493", (2, 4): "4.00151", (3, 6): "6.01348", (3, 7): "7.01436", (4, 9): "9.00999", (5, 10): "10.01019", (5, 11): "11.00656", (6, 12): "11.99671", (6, 13): "13.00006", (7, 14): "13.99923", (7, 15): "14.99627", (8, 16): "15.99053", (8, 17): "16.99474", (8, 18): "17.99477", (9, 19): "18.99347", (10, 20): "19.98695", (11, 23): "22.98373", (12, 24): "23.97846", (13, 27): "26.97441", (14, 28): "27.96925", (15, 31): "30.96553", (16, 32): "31.96329", (17, 35): "34.95953", (17, 37): "36.95658", (18, 40): "39.95251", (19, 39): "38.95328", (20, 40): "39.95162", (22, 48): "47.93587", (24, 52): "51.92734", (25, 55): "54.92433", (26, 56): "55.92067", (27, 59): "58.91838", (28, 58): "57.91998", (28, 60): "59.91542", (29, 63): "62.91369", (30, 64): "63.91268"}
BINDING = {(1, 2): "2.2", (1, 3): "8.5", (2, 3): "7.7", (2, 4): "28.3", (3, 6): "32.0", (3, 7): "39.2", (4, 9): "58.2", (6, 12): "92.2", (7, 14): "104.7", (8, 16): "127.6", (10, 20): "160.6", (12, 24): "198.3", (14, 28): "236.5", (16, 32): "271.8", (20, 40): "342.1", (26, 56): "492.3", (28, 62): "545.3", (29, 63): "551.4", (36, 84): "732.3", (38, 88): "768.5", (40, 90): "783.9", (42, 98): "846.2", (47, 107): "915.3", (50, 120): "1020.5", (54, 132): "1112.4", (56, 138): "1158.3", (60, 144): "1199.1", (64, 158): "1295.9", (74, 184): "1472.9", (79, 197): "1559.4", (82, 208): "1636.4", (90, 232): "1766.7", (92, 235): "1783.9", (92, 238): "1801.7"}
ATOMIC_MASS = {(0, 1): "1.00866", (1, 1): "1.00783", (1, 2): "2.01410", (1, 3): "3.01605", (2, 3): "3.01603", (2, 4): "4.00260", (3, 6): "6.01512", (3, 7): "7.01600", (5, 11): "11.00931", (6, 12): "12.00000", (8, 16): "15.99491", (92, 235): "235.04393", (94, 239): "239.05216", (56, 141): "140.91440", (36, 92): "91.92617", (56, 144): "143.92295", (36, 89): "88.91784", (54, 140): "139.92165", (38, 94): "93.91536", (55, 137): "136.90709", (37, 95): "94.92926", (54, 144): "143.93895", (38, 90): "89.90773", (57, 146): "145.92569", (35, 87): "86.92067", (52, 134): "133.91140", (40, 100): "99.91801", (53, 135): "134.91006", (39, 97): "96.91829", (56, 139): "138.90884", (36, 94): "93.93414", (54, 143): "142.93537", (50, 132): "131.91782", (42, 101): "100.91034", (54, 134): "133.90539", (40, 103): "102.92720"}
# joule per reaction (as written) and grams per mole of reactions (as written)
FUELS = {("3{,}20 \\cdot 10^{-11}", "235"), ("2{,}82 \\cdot 10^{-12}", "5{,}03"), ("5{,}25 \\cdot 10^{-13}", "4{,}03")}

D5 = r"(\d+\{,\}\d{5})"
BARE = r"\{\}\^\{(\d+)\}\\mathrm\{([A-Z][a-z]?)\}"


def five(r):
    """A mass to five decimals of u, as the lesson writes it."""
    k = int(Rational(r) * 10**5)
    if Rational(k, 10**5) != r:
        raise ValueError(f"{r} has more than five decimals")
    s = str(k).rjust(6, "0")
    return f"{s[:-5]}{{,}}{s[-5:]}"


def qty(x, n, unit):
    s = sig_tex(x, n)
    return None if s is None else f"{s}\\,\\text{{{unit}}}"


def right_is(want):
    return lambda o: want is not None and o["latex"] == want


def energy_of(dm, errs):
    """E = Δm c² to three figures in joule; the lesson's shortcut must give the same."""
    want = qty(dm * U_KG * C**2, 3, "J")
    if want is None or want != qty(dm * J_PER_U, 3, "J"):
        errs.append("the energy is near a tie, or the two roads of the lesson disagree")
        return None
    if ambiguous_zero(sig_tex(dm * U_KG * C**2, 3)):
        errs.append("the energy ends with an ambiguous zero")
    return want


def level1(sample, prose, extra, errs):
    m = re.fullmatch(r"Il nucleo di ([a-z]+)-(\d+), \$(.+?)\$, ha una massa di \$" + D5 + r"\\,\\text\{u\}\$\. Quanto vale il suo difetto di massa\? Il protone ha massa \$1\{,\}00728\\,\\text\{u\}\$, il neutrone \$1\{,\}00866\\,\\text\{u\}\$\.", prose)
    if not m or extra:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    Z, A, _ = nuclide(m.group(3))
    if NAMES[Z - 1] != m.group(1) or A != int(m.group(2)):
        errs.append("name, mass number and symbol do not agree")
    mass = dec(m.group(4))
    if NUCLEAR_MASS.get((Z, A)) is None or Rational(NUCLEAR_MASS[(Z, A)]) != mass:
        errs.append(f"the nucleus ({Z}, {A}) does not have a mass of {m.group(4)} u")
    dm = Z * M_P + (A - Z) * M_N - mass
    if dm <= 0:
        errs.append("mass defect not positive")
        return None
    check_choice(sample["answer"], right_is(f"{five(dm)}\\,\\text{{u}}"), errs)
    return "difetto"


def level2(sample, prose, extra, errs):
    m = re.fullmatch(r"Il difetto di massa del nucleo \$(.+?)\$ è \$" + D5 + r"\\,\\text\{u\}\$\. Quanto vale la sua energia di legame, in joule\? Usa \$1\\,\\text\{u\} = 1\{,\}6605 \\cdot 10\^\{-27\}\\,\\text\{kg\}\$ e \$c = 3\{,\}00 \\cdot 10\^\{8\}\\,\\text\{m/s\}\$\.", prose)
    if not m or extra:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    Z, A, _ = nuclide(m.group(1))
    dm = dec(m.group(2))
    if (Z, A) not in NUCLEAR_MASS or Z * M_P + (A - Z) * M_N - Rational(NUCLEAR_MASS[(Z, A)]) != dm:
        errs.append(f"{m.group(2)} u is not the mass defect of ({Z}, {A})")
    check_choice(sample["answer"], right_is(energy_of(dm, errs)), errs)
    return "energia"


def level3(sample, prose, extra, errs):
    m = re.fullmatch(r"L'energia di legame del nucleo \$(.+?)\$ è \$(\d+\{,\}\d)\\,\\text\{MeV\}\$\. Quanto vale la sua energia di legame per nucleone\?", prose)
    if not m or extra:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    Z, A, _ = nuclide(m.group(1))
    E = dec(m.group(2))
    if BINDING.get((Z, A)) is None or Rational(BINDING[(Z, A)]) != E:
        errs.append(f"the nucleus ({Z}, {A}) does not have a binding energy of {m.group(2)} MeV")
    if A < 4:
        errs.append("the spec starts from A = 4")
    want = qty(E / A, 3, "MeV")
    if want is None or ambiguous_zero(sig_tex(E / A, 3)):
        errs.append("the answer is near a tie or ends with an ambiguous zero")
    check_choice(sample["answer"], right_is(want), errs)
    return "per nucleone"


def level4(sample, prose, extra, errs):
    m = re.fullmatch(r"Le energie di legame di quattro nuclei, in megaelettronvolt, sono: (.+)\. Qual è il nucleo più stabile\?", prose)
    if not m or extra:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    items = re.findall(r"\$" + BARE + r"\$ \$(\d+\{,\}\d)\$", m.group(1))
    if len(items) != 4 or len({(a, s) for a, s, _ in items}) != 4:
        errs.append("four different nuclei are needed")
        return None
    per = {}
    for a, s, e in items:
        Z, A = Z_OF[s], int(a)
        if BINDING.get((Z, A)) is None or Rational(BINDING[(Z, A)]) != dec(e):
            errs.append(f"({Z}, {A}) does not have a binding energy of {e} MeV")
        per[(Z, A)] = dec(e) / A
    ranked = sorted(per, key=per.get, reverse=True)
    best = ranked[0]
    if per[best] - per[ranked[1]] < Rational(1, 10):
        errs.append("the two most stable nuclei are less than 0,1 MeV per nucleon apart")
    if best == max(per, key=lambda k: k[1]):
        errs.append("the most stable nucleus is also the heaviest: the trap is missing")
    opts = sample["answer"].get("options", [])
    if sorted((nuclide(o["latex"])[0], nuclide(o["latex"])[1]) for o in opts) != sorted(per):
        errs.append("the options are not the four nuclei of the text")
    check_choice(sample["answer"], lambda o: nuclide(o["latex"])[:2] == best, errs)
    return "stabile"


def side(tex):
    """One side of a nuclear equation: [(Z, A, count)], the neutron as Z = 0."""
    out = []
    for term in tex.split(" + "):
        m = re.fullmatch(r"(?:(\d+)\\,)?(.+)", term.strip())
        count = int(m.group(1) or 1)
        if m.group(2) == NEUTRON:
            out.append((0, 1, count))
        else:
            Z, A, excited = nuclide(m.group(2))
            if excited:
                raise ValueError("excited nucleus in a reaction")
            out.append((Z, A, count))
    return out


def level5(sample, prose, extra, errs):
    m = re.fullmatch(r"Quanta energia libera questa reazione di (fissione|fusione)\? Masse in unità di massa atomica: (.+)\. A \$1\\,\\text\{u\}\$ corrispondono \$1\{,\}494 \\cdot 10\^\{-10\}\\,\\text\{J\}\$\.", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 5 text not recognised: {prose!r} {extra}")
        return None
    kind = m.group(1)
    eq = re.fullmatch(r"(.+) \\longrightarrow (.+)", extra[0])
    if not eq:
        errs.append(f"equation not recognised: {extra[0]!r}")
        return None
    left, right = side(eq.group(1)), side(eq.group(2))
    # a nuclear equation keeps the two sums
    for name, i in (("A", 1), ("Z", 0)):
        if sum(p[i] * p[2] for p in left) != sum(p[i] * p[2] for p in right):
            errs.append(f"the sum of {name} is not the same on the two sides")
    heavy = [p for p in left if p[0] >= 90]
    if kind == "fissione":
        if len(heavy) != 1 or (0, 1, 1) not in left or len([p for p in right if p[0] > 0]) != 2 or not any(p[0] == 0 for p in right):
            errs.append("not a fission: a heavy nucleus and a neutron give two fragments and some neutrons")
    elif heavy or any(p[0] > 8 for p in left + right):
        errs.append("not a fusion of light nuclei")
    # the masses given: every particle of the equation, with its real mass
    given = {}
    for label, a, s, mass in re.findall(r"(neutrone|\$\{\}\^\{(\d+)\}\\mathrm\{([A-Z][a-z]?)\}\$) \$" + D5 + r"\$", m.group(2)):
        key = (0, 1) if label == "neutrone" else (Z_OF[s], int(a))
        given[key] = dec(mass)
        if ATOMIC_MASS.get(key) is None or Rational(ATOMIC_MASS[key]) != given[key]:
            errs.append(f"{key} does not have a mass of {mass} u")
    species = {(p[0], p[1]) for p in left + right}
    if set(given) != species:
        errs.append(f"masses given for {sorted(given)}, particles in the equation {sorted(species)}")
        return None
    dm = sum(given[(p[0], p[1])] * p[2] for p in left) - sum(given[(p[0], p[1])] * p[2] for p in right)
    if dm <= 0:
        errs.append("the reaction does not release energy")
        return None
    check_choice(sample["answer"], right_is(energy_of(dm, errs)), errs)
    return kind


def level6(sample, prose, extra, errs):
    m = re.fullmatch(r"La (fissione|fusione) di .+ libera (?:in media )?\$(.+?)\\,\\text\{J\}\$\. .+ \$(\d+(?:\{,\}\d+)?)\\,\\text\{g(?:/mol)?\}\$\. Quanta energia libera la (fissione|fusione) di \$(\d+(?:\{,\}\d+)?)\\,\\text\{g\}\$ di .+\?", prose)
    if not m or extra:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    kind, e1, molar, kind2, grams = m.groups()
    if kind != kind2 or (e1, molar) not in FUELS:
        errs.append(f"{e1} J per reaction with {molar} g per mole is not a fuel of the spec")
    E1, M, g = sci(e1), dec(molar), dec(grams)
    N = g / M * N_A
    total = N * E1
    s = sig_tex(total, 2)
    if s is None or ambiguous_zero(s):
        errs.append("the energy is near a tie or ends with an ambiguous zero")
        return None
    # the same answer with the number of nuclei rounded to three figures, as the solution does
    n3 = sig_tex(N, 3)
    if n3 is None or sig_tex(sci(n3) * E1, 2) != s:
        errs.append("rounding the number of nuclei to three figures changes the answer")
    check_choice(sample["answer"], right_is(f"{s}\\,\\text{{J}}"), errs)
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample["answer"].get("kind") != "choice":
        errs.append("every level is a multiple choice")
    prose, extra = prose_and_extra(sample["problem"])
    try:
        kind = LEVELS[lvl](sample, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
