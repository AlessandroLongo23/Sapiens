"""Checker for chim-legame-valenza (specs/exercises/chim-legame-valenza.md), written from the spec and the lesson
70-chim-legame-valenza.md, not from the generator.

Level 1: the half-filled orbital of each atom is read from the configuration printed in the problem (checked against a
table of its own). Level 2: an answer key written from the lesson. Level 3: one sigma, and order - 1 pi. Levels 4-6:
the bonds are counted from the condensed formula by two roads: sigma bonds are the atoms minus one (the molecules have
no rings), pi bonds are the doubles plus twice the triples, and the pi bonds must also equal the degree of unsaturation
(2C + 2 + N - H - X) / 2 computed from the atoms alone.
"""
import re

from checkers._chim3_g import check_number, choice_of, common_g, mathrm
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

CASE_RANGES = {3: {"singolo": (0.15, 0.35), "doppio": (0.28, 0.48), "triplo": (0.28, 0.48)}}

# symbol -> (name with article, configuration as printed)
CONFIG = {
    "H": ("l'idrogeno", "1s^1"),
    "F": ("il fluoro", "[\\text{He}]\\,2s^2\\,2p^5"),
    "Cl": ("il cloro", "[\\text{Ne}]\\,3s^2\\,3p^5"),
    "Br": ("il bromo", "[\\text{Ar}]\\,4s^2\\,3d^{10}\\,4p^5"),
    "I": ("lo iodio", "[\\text{Kr}]\\,5s^2\\,4d^{10}\\,5p^5"),
}
CAPACITY = {"s": 2, "p": 6, "d": 10}


def half_filled(config):
    """The sublevel with an unpaired electron: the one that is neither full nor empty (for these atoms, one short)."""
    found = []
    for n, l, k in re.findall(r"(\d)([spd])\^\{?(\d+)\}?", config):
        if int(k) % 2 == 1:
            if int(k) not in (1, CAPACITY[l] - 1):
                raise ValueError(f"more than one unpaired electron in {n}{l}")
            found.append(n + l)
    if len(found) != 1:
        raise ValueError(f"{len(found)} half-filled sublevels in {config!r}")
    return found[0]


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quali orbitali si sovrappongono nel legame della molecola \$\\mathrm\{([A-Z][a-z]?)(_2|[A-Z][a-z]?)\}\$\? ?(.*)", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    a = m.group(1)
    b = a if m.group(2) == "_2" else m.group(2)
    if a not in CONFIG or b not in CONFIG:
        errs.append("atom not in the table")
        return None
    # every atom other than hydrogen has its configuration printed, and it is the real one
    for sym in {a, b} - {"H"}:
        name, cfg = CONFIG[sym]
        if f"{name[1:]} ha configurazione ${cfg}$" not in prose and f"{name} ${cfg}$" not in prose:
            errs.append(f"configuration of {sym} missing or wrong")
    oa, ob = half_filled(CONFIG[a][1]), half_filled(CONFIG[b][1])
    want = f"${oa}$ e ${ob}$" if a == b else f"${oa}$ di $\\mathrm{{{a}}}$ e ${ob}$ di $\\mathrm{{{b}}}$"

    def text(o):
        # the option is prose with inline formulas, written as \text{..}formula\text{..}
        return re.sub(r"\\text\{([^}]*)\}", r"\1", o["latex"])

    plain = want.replace("$", "")
    check_choice(sample["answer"], lambda o: text(o) == plain, errs)
    return "HH" if a == b == "H" else "HX" if a == "H" else "XX" if a == b else "XY"


KEY = {
    "Come si sovrappongono gli orbitali in un legame $\\sigma$?": "Di testa, lungo l'asse di legame",
    "Come si sovrappongono gli orbitali in un legame $\\pi$?": "Di fianco, sopra e sotto l'asse",
    "Quali orbitali possono formare un legame $\\pi$?": "Due orbitali p paralleli",
    "Due orbitali $s$ si sovrappongono. Che legame formano?": "Un legame \\sigma",
    "Un orbitale $s$ si sovrappone a un orbitale $p$ diretto lungo l'asse di legame. Che legame formano?": "Un legame \\sigma",
    "Due orbitali $p$ si sovrappongono di testa, lungo l'asse di legame. Che legame formano?": "Un legame \\sigma",
    "Due orbitali $p$ paralleli si sovrappongono di fianco. Che legame formano?": "Un legame \\pi",
    "Tra gli stessi due atomi, quale legame è più forte?": "Il legame \\sigma",
    "Attorno a quale legame gli atomi possono ruotare liberamente?": "Attorno a un legame singolo",
    "Quante coppie di elettroni contiene un legame $\\pi$?": "Una",
    "Quanti legami $\\sigma$ possono esserci tra due atomi?": "Uno solo",
    "Che spin hanno i due elettroni di un legame covalente?": "Opposto",
    "Secondo la teoria del legame di valenza, quanti legami forma un atomo?": "Quanti sono i suoi elettroni spaiati",
    "Dove si trova la zona di sovrapposizione di un legame $\\sigma$?": "Sull'asse, tra i due nuclei",
    "Un orbitale $s$ può formare un legame $\\pi$?": "No, mai",
}


def plain_option(latex):
    """An option that is plain text, text on more lines, or text with inline formulas: the words and formulas in a row."""
    if latex.strip().startswith("\\begin{gathered}"):
        return option_text(latex)
    return re.sub(r"\\text\{([^}]*)\}", r"\1", latex)


def level2(sample, prose, errs):
    if prose not in KEY:
        errs.append(f"level 2 question not in the key: {prose!r}")
        return None
    check_choice(sample["answer"], lambda o: plain_option(o["latex"]) == KEY[prose], errs)
    return "fatto"


def pair(latex):
    """'1\\,\\sigma\\text{ e }2\\,\\pi' -> (1, 2); '2\\,\\pi' -> (0, 2)."""
    m = re.fullmatch(r"(?:(\d+)\\,\\sigma)?(?:\\text\{ e \})?(?:(\d+)\\,\\pi)?", latex)
    if not m or (m.group(1) is None and m.group(2) is None):
        raise ValueError(f"not a count of bonds: {latex!r}")
    return int(m.group(1) or 0), int(m.group(2) or 0)


def level3(sample, prose, errs):
    m = re.fullmatch(r"Di quali legami è fatto il legame \$\\mathrm\{[A-Z][a-z]?(\{-\}|\{=\}|\{\\equiv\})[A-Z][a-z]?\}\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    order = {"{-}": 1, "{=}": 2, "{\\equiv}": 3}[m.group(1)]
    check_choice(sample["answer"], lambda o: pair(o["latex"]) == (1, order - 1), errs)
    return ["singolo", "doppio", "triplo"][order - 1]


def count(formula):
    """(sigma, pi, bonds drawn) of an open-chain molecule from its condensed formula."""
    doubles = formula.count("{=}")
    triples = formula.count("{\\equiv}")
    singles = formula.count("{-}")
    bare = formula.replace("{=}", "").replace("{\\equiv}", "").replace("{-}", "")
    atoms = {}
    pos = 0
    for mm in re.finditer(r"([A-Z][a-z]?)(?:_(\d)|_\{(\d+)\})?", bare):
        if mm.start() != pos:
            raise ValueError(f"cannot read {formula!r}")
        pos = mm.end()
        atoms[mm.group(1)] = atoms.get(mm.group(1), 0) + int(mm.group(2) or mm.group(3) or 1)
    if pos != len(bare) or set(atoms) - {"C", "H", "N", "O", "Cl"}:
        raise ValueError(f"cannot read {formula!r}")
    sigma = sum(atoms.values()) - 1
    pi = doubles + 2 * triples
    unsat2 = 2 * atoms.get("C", 0) + 2 + atoms.get("N", 0) - atoms.get("H", 0) - atoms.get("Cl", 0)
    if unsat2 != 2 * pi:
        raise ValueError(f"{formula!r}: {pi} pi bonds drawn, unsaturation {unsat2}/2")
    return sigma, pi, singles + doubles + triples


def level456(sample, prose, errs, lvl):
    m = re.fullmatch(r"Quanti legami \$\\(sigma|pi)\$ (?:e quanti legami \$\\pi\$ )?ci sono nella molecola \$(\\mathrm\{.+\})\$\?", prose)
    if not m:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
        return None
    both = "e quanti legami" in prose
    sigma, pi, drawn = count(mathrm(m.group(2)))
    if lvl == 6:
        if not both:
            errs.append("level 6 must ask for both")
        if pi == 0:
            errs.append("level 6 with no multiple bond")
        ch = choice_of(sample, errs)
        if sample["answer"]["kind"] != "choice":
            errs.append("level 6 is a choice")
        check_choice(ch, lambda o: pair(o["latex"]) == (sigma, pi), errs)
        return "entrambi"
    if both or (m.group(1) == "pi") != (lvl == 4):
        errs.append(f"level {lvl} asks for the wrong bonds")
    if lvl == 4:
        check_number(sample, pi, errs)
        return "nessuno" if pi == 0 else "pi"
    check_number(sample, sigma, errs)
    return "disegnati" if sigma == drawn else "nascosti"


def check(sample):
    errs = []
    common_g(sample, errs)
    lvl = sample.get("level")
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        if lvl in (1, 2, 3):
            if sample.get("answer", {}).get("kind") != "choice":
                return errs + ["answer is not a choice"], None
            kind = {1: level1, 2: level2, 3: level3}[lvl](sample, prose, errs)
        elif lvl in (4, 5, 6):
            kind = level456(sample, prose, errs, lvl)
        else:
            return [f"unknown level {lvl}"], None
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
