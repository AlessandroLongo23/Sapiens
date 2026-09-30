"""Checker for numero-massa (specs/exercises/numero-massa.md), written from the spec and the lesson 42-numero-massa.md,
not from the generator.

Z counts the protons and names the element; A = Z + N; a neutral atom has Z electrons, an ion Z - charge. Isotopes
share Z and differ in A. The average atomic mass is the mean of the isotopes' masses weighted by their abundances; with
two isotopes the abundance x of one follows from m_a x + m_b (1 - x) = M. Named elements must carry their real data
(IUPAC 2021, rounded as the lesson rounds them). Exact arithmetic with sympy.
"""
import re

from sympy import Rational, floor

from checkers._fis_grandezze import check_choice, common, prose_and_extra

CASE_RANGES = {
    1: {k: (0.26, 0.40) for k in ["protoni", "neutroni", "elettroni"]},
    3: {"elettroni": (0.40, 0.60), "protoni": (0.18, 0.32), "neutroni": (0.18, 0.32)},
    5: {"reale": (0.40, 0.60), "inventato": (0.40, 0.60)},
    6: {"reale": (0.40, 0.60), "inventato": (0.40, 0.60)},
}

SYMBOLS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr".split()
NAMES = "idrogeno elio litio berillio boro carbonio azoto ossigeno fluoro neon sodio magnesio alluminio silicio fosforo zolfo cloro argon potassio calcio scandio titanio vanadio cromo manganese ferro cobalto nichel rame zinco gallio germanio arsenico selenio bromo cripto".split()
Z_OF = {s: i + 1 for i, s in enumerate(SYMBOLS)}
# element -> [(mass number, mass in u, abundance in %)], IUPAC 2021 rounded to hundredths
REAL = {
    "litio": [(6, "6.02", "7.59"), (7, "7.02", "92.41")],
    "boro": [(10, "10.01", "19.90"), (11, "11.01", "80.10")],
    "cloro": [(35, "34.97", "75.76"), (37, "36.97", "24.24")],
    "rame": [(63, "62.93", "69.15"), (65, "64.93", "30.85")],
    "gallio": [(69, "68.93", "60.11"), (71, "70.92", "39.89")],
    "bromo": [(79, "78.92", "50.69"), (81, "80.92", "49.31")],
    "rubidio": [(85, "84.91", "72.17"), (87, "86.91", "27.83")],
    "argento": [(107, "106.91", "51.84"), (109, "108.90", "48.16")],
    "antimonio": [(121, "120.90", "57.21"), (123, "122.90", "42.79")],
    "europio": [(151, "150.92", "47.81"), (153, "152.92", "52.19")],
    "tallio": [(203, "202.97", "29.52"), (205, "204.97", "70.48")],
    "magnesio": [(24, "23.99", "78.99"), (25, "24.99", "10.00"), (26, "25.98", "11.01")],
    "silicio": [(28, "27.98", "92.23"), (29, "28.98", "4.68"), (30, "29.97", "3.09")],
    "neon": [(20, "19.99", "90.48"), (21, "20.99", "0.27"), (22, "21.99", "9.25")],
}
# stable nuclides of the first 36 elements (IUPAC 2021), plus tritium and carbon-14: Z -> mass numbers
STABLE = {
    1: {1, 2, 3}, 2: {3, 4}, 3: {6, 7}, 4: {9}, 5: {10, 11}, 6: {12, 13, 14}, 7: {14, 15}, 8: {16, 17, 18}, 9: {19}, 10: {20, 21, 22},
    11: {23}, 12: {24, 25, 26}, 13: {27}, 14: {28, 29, 30}, 15: {31}, 16: {32, 33, 34, 36}, 17: {35, 37}, 18: {36, 38, 40},
    19: {39, 41}, 20: {40, 42, 43, 44, 46}, 21: {45}, 22: {46, 47, 48, 49, 50}, 23: {51}, 24: {50, 52, 53, 54}, 25: {55},
    26: {54, 56, 57, 58}, 27: {59}, 28: {58, 60, 61, 62, 64}, 29: {63, 65}, 30: {64, 66, 67, 68, 70}, 31: {69, 71},
    32: {70, 72, 73, 74, 76}, 33: {75}, 34: {74, 76, 77, 78, 80, 82}, 35: {79, 81}, 36: {78, 80, 82, 83, 84, 86},
}
TABLE_M = {"litio": "6.94", "boro": "10.81", "cloro": "35.45", "rame": "63.55", "gallio": "69.72", "bromo": "79.90", "rubidio": "85.47", "argento": "107.87", "antimonio": "121.76", "europio": "151.96", "tallio": "204.38"}

NUC = r"\{\}\^\{(\d+)\}_\{(\d+)\}\\mathrm\{([A-Z][a-z]?)(?:\^\{(\d?)([+-])\})?\}"
DEC = r"(\d+\{,\}\d+)"


def dec(s):
    return Rational(s.replace("{,}", "."))


def nuclide(latex):
    """{}^{A}_{Z}\\mathrm{X^{q}} -> (A, Z, symbol, charge)."""
    m = re.fullmatch(NUC, latex)
    if not m:
        raise ValueError(f"not a nuclide: {latex!r}")
    q = 0
    if m.group(5):
        q = int(m.group(4) or 1) * (1 if m.group(5) == "+" else -1)
    return int(m.group(1)), int(m.group(2)), m.group(3), q


def fmt(x, d, unit):
    """x rounded half up to d decimals with the lesson's comma, and its unit; None near a tie."""
    y = x * 10**d
    f = y - floor(y)
    if abs(f - Rational(1, 2)) < Rational(1, 10**6):
        return None
    k = int(floor(y + Rational(1, 2)))
    s = str(k).rjust(d + 1, "0")
    return f"{s[:-d]}{{,}}{s[-d:]}" + unit


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quanti (protoni|neutroni|elettroni) ha l'atomo neutro \$(.+)\$\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    A, Z, s, q = nuclide(m.group(2))
    if Z_OF[s] != Z or q != 0 or A not in STABLE[Z]:
        errs.append("symbol and Z do not match, or not a real nuclide")
    want = str(A - Z if m.group(1) == "neutroni" else Z)
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return m.group(1)


def level2(sample, prose, errs):
    m = re.fullmatch(r"Un atomo neutro ha \$(\d+)\$ protoni, \$(\d+)\$ neutroni e \$(\d+)\$ elettroni\. Qual è il suo simbolo\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    p, n, e = (int(x) for x in m.groups())
    if p != e or p + n not in STABLE.get(p, set()):
        errs.append("not neutral, or not a real nuclide")
    want = (p + n, p, SYMBOLS[p - 1], 0)

    def right(o):
        try:
            return nuclide(o["latex"]) == want
        except ValueError:
            return False

    check_choice(sample["answer"], right, errs)
    return "simbolo"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Quanti (protoni|neutroni|elettroni) ha lo ione \$(.+)\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    A, Z, s, q = nuclide(m.group(2))
    if Z_OF[s] != Z or q == 0:
        errs.append("symbol and Z do not match, or not an ion")
    want = str({"protoni": Z, "neutroni": A - Z, "elettroni": Z - q}[m.group(1)])
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return m.group(1)


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quale di questi atomi è un isotopo di \$(.+)\$\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    A, Z, s, _ = nuclide(m.group(1))
    for o in sample["answer"]["options"]:
        a, z, s2, _ = nuclide(o["latex"])
        if Z_OF[s2] != z:
            errs.append(f"option {o['latex']!r}: symbol and Z do not match")
        if (a, z) == (A, Z):
            errs.append("the atom itself among the options")
    if A not in STABLE.get(Z, set()):
        errs.append("the atom is not a real nuclide")
    for o in sample["answer"]["options"]:
        a, z, _, _ = nuclide(o["latex"])
        if z == Z and a not in STABLE[Z]:
            errs.append(f"isotope {o['latex']!r} is not a real nuclide")
    check_choice(sample["answer"], lambda o: nuclide(o["latex"])[1] == Z, errs)
    return "isotopo"


def element(prose_subject, errs):
    """'Il cloro' -> 'cloro'; 'Un elemento $\\mathrm{X}$' -> None."""
    if prose_subject == r"Un elemento $\mathrm{X}$":
        return None
    m = re.fullmatch(r"(?:Il |L')(\w+)", prose_subject)
    if not m or m.group(1) not in REAL:
        errs.append(f"unknown element {prose_subject!r}")
        return None
    name = m.group(1)
    if prose_subject != (f"L'{name}" if name[0] in "aeiou" else f"Il {name}"):
        errs.append("article")
    return name


def iso_label(name, a):
    return (f"{name}-{a}" if name else rf"$\mathrm{{X}}$-{a}")


def level5(sample, prose, errs):
    m = re.fullmatch(r"(.+?) ha (due|tre) isotopi: (.+)\. Quanto vale la sua massa atomica\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    name = element(m.group(1), errs)
    items = re.findall(r"(?:(\w+)|\$\\mathrm\{X\}\$)-(\d+) \(\$" + DEC + r"\\,\\text\{u\}\$, \$" + DEC + r"\\,\\%\$\)", m.group(3))
    if len(items) != (2 if m.group(2) == "due" else 3):
        errs.append("isotopes not read")
        return None
    isos = [(int(a), dec(ms), dec(p)) for _, a, ms, p in items]
    if sum(p for _, _, p in isos) != 100:
        errs.append("abundances do not add up to 100 %")
    if name:
        real = [(a, Rational(ms), Rational(p)) for a, ms, p in REAL[name]]
        if real != isos:
            errs.append(f"data of {name} are not the real ones")
    else:
        for a, ms, _ in isos:
            if not a - 1 < ms < a:
                errs.append("made-up mass not just under its mass number")
    avg = sum(ms * p / 100 for _, ms, p in isos)
    want = fmt(avg, 2, r"\,\text{u}")
    if want is None:
        errs.append("tie")
        return None
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "reale" if name else "inventato"


def level6(sample, prose, errs):
    m = re.fullmatch(
        r"(.+?) ha due isotopi, (.+?) \(\$" + DEC + r"\\,\\text\{u\}\$\) e (.+?) \(\$" + DEC + r"\\,\\text\{u\}\$\), e la sua massa atomica è \$" + DEC + r"\$\. Quanto è abbondante (.+)\?",
        prose,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    name = element(m.group(1), errs)
    labels = [m.group(2), m.group(4)]
    masses = [dec(m.group(3)), dec(m.group(5))]
    M = dec(m.group(6))
    nums = [int(re.search(r"-(\d+)$", lab).group(1)) for lab in labels]
    if labels != [iso_label(name, a) for a in nums]:
        errs.append("isotope names")
    if name:
        real = REAL[name]
        if [a for a, _, _ in real] != nums or [Rational(x) for _, x, _ in real] != masses or Rational(TABLE_M[name]) != M:
            errs.append(f"data of {name} are not the real ones")
    if not name and not all(a - 1 < ms < a for a, ms in zip(nums, masses)):
        errs.append("made-up mass not just under its mass number")
    if not min(masses) < M < max(masses):
        errs.append("average outside the masses")
    i = labels.index(m.group(7))
    a, b = masses[i], masses[1 - i]
    x = (b - M) / (b - a) * 100
    want = fmt(x, 1, r"\,\%")
    if want is None:
        errs.append("tie")
        return None
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "reale" if name else "inventato"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
