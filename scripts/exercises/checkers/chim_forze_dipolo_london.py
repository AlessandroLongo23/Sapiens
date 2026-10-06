"""Checker for chim-forze-dipolo-london (specs/exercises/chim-forze-dipolo-london.md), written from the spec and the
lesson 72-chim-forze-dipolo-london.md, not from the generator.

London forces act between all particles, dipole-dipole forces only between polar molecules; the electrons of a
molecule are the sum of the atomic numbers (read from the site's periodic table); among apolar substances of a family
the one with more electrons has the stronger London forces and the higher boiling point; with the same electrons the
polar substance boils higher; an ion and a polar molecule attract with the ion-dipole force, two ions with the ionic
bond. The questions of level 6 have their key below.
"""
import re

from checkers._chim3_h import Z_OF, atoms, check_choice, check_fact, check_number, check_text, choice_of, common, electrons, fx, plain, prose_and_extra, unfx

CASE_RANGES = {
    4: {"chi bolle": (0.40, 0.60), "forza in più": (0.40, 0.60)},
    5: {"ione e acqua": (0.22, 0.38), "lato": (0.18, 0.32), "due ioni": (0.18, 0.32), "carica": (0.13, 0.27)},
}

# formula -> (name with its article, atoms / apolar / polar, boiling point of the lesson in °C)
SUBSTANCES = {
    "He": ("l'elio", "atomi", -269), "Ne": ("il neon", "atomi", -246), "Ar": ("l'argon", "atomi", -186), "Kr": ("il kripton", "atomi", -153), "Xe": ("lo xeno", "atomi", -108),
    "F2": ("il fluoro", "apolare", -188), "Cl2": ("il cloro", "apolare", -34), "Br2": ("il bromo", "apolare", 59), "I2": ("lo iodio", "apolare", 184), "N2": ("l'azoto", "apolare", -196),
    "CH4": ("il metano", "apolare", -162), "C2H6": ("l'etano", "apolare", -89), "C3H8": ("il propano", "apolare", -42), "C5H12": ("il pentano", "apolare", 36),
    "CO2": ("il diossido di carbonio", "apolare", None), "CCl4": ("il tetracloruro di carbonio", "apolare", 77),
    "HCl": ("il cloruro di idrogeno", "polare", -85), "HBr": ("il bromuro di idrogeno", "polare", -67), "HI": ("lo ioduro di idrogeno", "polare", -35),
    "SO2": ("il diossido di zolfo", "polare", None), "CHCl3": ("il triclorometano", "polare", 61), "CH3Cl": ("il clorometano", "polare", -24), "ICl": ("il cloruro di iodio", "polare", 97),
}
FAMILIES = {
    "di atomi singoli": {"He", "Ne", "Ar", "Kr", "Xe"},
    "di molecole apolari": None,  # halogens or alkanes, told apart below
}
HALOGENS = {"F2", "Cl2", "Br2", "I2"}
ALKANES = {"CH4", "C2H6", "C3H8", "C5H12"}
CATIONS = {"Na+": 1, "K+": 1, "Li+": 1, "Mg2+": 2, "Ca2+": 2}
ANIONS = {"Cl-": 1, "Br-": 1, "F-": 1, "I-": 1}

HCL, HBR, HI = "$\\mathrm{HCl}$", "$\\mathrm{HBr}$", "$\\mathrm{HI}$"
KEY = {
    f"Tra {HCL}, {HBR} e {HI}, quale bolle alla temperatura più alta?": HI,
    f"Tra {HCL}, {HBR} e {HI}, quale bolle alla temperatura più bassa?": HCL,
    f"Tra {HCL}, {HBR} e {HI}, in quale le forze di London sono più intense?": HI,
    f"Tra {HCL}, {HBR} e {HI}, quale ha la molecola più polare?": HCL,
    f"Da {HCL} a {HI} la molecola diventa meno polare, eppure la temperatura di ebollizione sale. Perché?": "Crescono le forze di London",
    "Il pentano e il 2,2-dimetilpropano hanno la stessa formula. Quale bolle alla temperatura più alta?": "Il pentano",
    "Perché il pentano bolle più in alto del 2,2-dimetilpropano, che ha gli stessi elettroni?": "Ha la molecola più allungata",
    "Il tetracloruro di carbonio è apolare e bolle a $77\\,^\\circ\\text{C}$; il clorometano è polare e bolle a $-24\\,^\\circ\\text{C}$. Perché?": "Il primo ha molti più elettroni",
    "Il triclorometano è polare e ha $58$ elettroni; il tetracloruro di carbonio è apolare e ne ha $74$, e bolle più in alto. Quale forza prevale?": "La forza di London",
    "A temperatura ambiente il cloro è un gas e lo iodio un solido. Perché?": "Lo iodio ha più elettroni",
    "Che cosa si indica con il nome di forze di van der Waals?": "Le forze dipolo-dipolo e di London",
    "Che cos'è la polarizzabilità?": "La facilità con cui la nube elettronica si deforma",
    "Come cambia la polarizzabilità quando gli elettroni di una particella aumentano?": "Aumenta",
    "Quando una sostanza molecolare bolle, che cosa si vince?": "Le forze tra le molecole",
    "Che cos'è un dipolo istantaneo?": "Un dipolo che dura un istante",
    "Che cos'è un dipolo indotto?": "Un dipolo creato da un dipolo vicino",
    "Tra quali particelle agiscono le forze di London?": "Tra tutte",
    "Perché la forza ione-dipolo è più intensa della forza dipolo-dipolo?": "Lo ione ha una carica intera",
    "Perché nei gas le forze intermolecolari contano poco?": "Le particelle sono lontane",
    "Quale di queste è una forza intramolecolare?": "Il legame covalente",
}

F = r"\$(\\mathrm\{[^$]*\})\$"  # a formula between dollars


def cap(s):
    return s[0].upper() + s[1:]


def level1(sample, prose, errs):
    m = re.fullmatch(r"(.+), " + F + r", (è fatto di atomi singoli|ha molecole apolari|ha molecole polari)\. Quali forze intermolecolari agiscono tra (i suoi atomi|le sue molecole)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    f = unfx(m.group(2))
    name, kind, _ = SUBSTANCES[f]
    if m.group(1) != cap(name):
        errs.append(f"name {m.group(1)!r} is not that of {f}")
    said = {"è fatto di atomi singoli": "atomi", "ha molecole apolari": "apolare", "ha molecole polari": "polare"}[m.group(3)]
    if said != kind:
        errs.append(f"{f} is {kind}, the text says {said}")
    if (m.group(4) == "i suoi atomi") != (kind == "atomi"):
        errs.append("atoms or molecules")
    check_text(sample, "Forze di London e forze dipolo-dipolo" if kind == "polare" else "Solo forze di London", errs)
    return kind


def level2(sample, prose, errs):
    m = re.fullmatch(r"Quanti elettroni ha in tutto una molecola di " + F + r", (.+)\? Numeri atomici: (.+)\.", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    f = unfx(m.group(1))
    if SUBSTANCES[f][1] == "atomi":
        errs.append("an atom is not a molecule")
    if re.sub(r"^(il |lo |l')", "", SUBSTANCES[f][0]) != m.group(2):
        errs.append(f"name {m.group(2)!r} is not that of {f}")
    given = re.findall(r"\$Z\(\\mathrm\{([A-Z][a-z]?)\}\) = (\d+)\$", m.group(3))
    if [s for s, _ in given] != [s for s, _ in atoms(f)]:
        errs.append("atomic numbers not those of the atoms of the formula, in order")
    for s, z in given:
        if Z_OF[s] != int(z):
            errs.append(f"Z of {s} is {Z_OF[s]}, not {z}")
    n = electrons(f)
    check_number(sample, n, errs, must_be_open=True)
    if sample.get("solution") != str(n):
        errs.append("solution is not the number of electrons")
    return "un elemento" if len(atoms(f)) == 1 else "più elementi"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Queste quattro sostanze sono fatte (di atomi singoli|di molecole apolari): " + F + ", " + F + ", " + F + ", " + F + r"\. (Quale bolle alla temperatura più (alta|bassa)\?|In quale le forze di London sono più (intense|deboli)\?)", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    four = [unfx(m.group(i)) for i in (2, 3, 4, 5)]
    if len(set(four)) != 4:
        errs.append("the four substances are not distinct")
    if m.group(1) == "di atomi singoli":
        ok = set(four) <= FAMILIES["di atomi singoli"]
    else:
        ok = set(four) <= HALOGENS or set(four) <= ALKANES
    if not ok:
        errs.append(f"{four} are not of one family of the lesson")
    top = m.group(7) == "alta" or m.group(8) == "intense"
    by_e = sorted(four, key=electrons)
    by_t = sorted(four, key=lambda f: SUBSTANCES[f][2])
    if by_e != by_t:
        errs.append("electrons and boiling points do not give the same order")
    want = by_e[-1] if top else by_e[0]
    check_choice(choice_of(sample), lambda o: unfx(o["latex"]) == want, errs)
    for o in choice_of(sample).get("options", []):
        if unfx(o["latex"]) not in four or o["values"] != [unfx(o["latex"])]:
            errs.append(f"option {o['latex']} is not one of the four, with its formula as value")
    return "massimo" if top else "minimo"


def level4(sample, prose, errs):
    m = re.fullmatch(F + " e " + F + r" hanno tutti e due \$(\d+)\$ elettroni(\. Quale bolle alla temperatura più alta, e perché\?|, ma " + F + r" bolle a una temperatura più alta\. Quale forza agisce tra le molecole di " + F + r" e non tra (gli atomi|le molecole) di " + F + r"\?)", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    a, b = unfx(m.group(1)), unfx(m.group(2))
    kinds = {a: SUBSTANCES[a][1], b: SUBSTANCES[b][1]}
    polar = [f for f in (a, b) if kinds[f] == "polare"]
    if len(polar) != 1:
        errs.append("one of the two must be polar and the other not")
        return None
    p = polar[0]
    q = b if p == a else a
    if not (electrons(a) == electrons(b) == int(m.group(3))):
        errs.append(f"electrons: {electrons(a)} and {electrons(b)}, the text says {m.group(3)}")
    if SUBSTANCES[p][2] - SUBSTANCES[q][2] < 15:
        errs.append("the polar substance does not boil clearly higher")
    if m.group(5):
        if unfx(m.group(5)) != p or unfx(m.group(6)) != p or unfx(m.group(8)) != q or (m.group(7) == "gli atomi") != (kinds[q] == "atomi"):
            errs.append("the second sentence does not name the polar and the apolar substance in their places")
        check_text(sample, "La forza dipolo-dipolo", errs)
        return "forza in più"
    check_text(sample, f"${fx(p)}$, perché è polare", errs)
    texts = {plain(o["latex"]) for o in choice_of(sample).get("options", [])}
    if texts != {f"${fx(p)}$, perché è polare", f"${fx(q)}$, perché è apolare", f"${fx(p)}$, perché ha più elettroni", "Bollono alla stessa temperatura"}:
        errs.append(f"options are not the four of the spec: {sorted(texts)}")
    return "chi bolle"


def level5(sample, prose, errs):
    m = re.fullmatch(r"Quale forza si esercita tra uno ione " + F + r" e una molecola d'acqua\?", prose)
    if m:
        ion = unfx(m.group(1))
        if ion not in CATIONS and ion not in ANIONS:
            errs.append(f"{ion} is not an ion of the lesson")
        check_text(sample, "Forza ione-dipolo", errs)
        return "ione e acqua"
    m = re.fullmatch(r"Quale parte della molecola d'acqua si rivolge verso uno ione " + F + r"\?", prose)
    if m:
        ion = unfx(m.group(1))
        if ion in CATIONS:
            want = "L'ossigeno, che è $\\delta^-$"
        elif ion in ANIONS:
            want = "Gli idrogeni, che sono $\\delta^+$"
        else:
            errs.append(f"{ion} is not an ion of the lesson")
            return None
        check_text(sample, want, errs)
        return "lato"
    m = re.fullmatch(r"Quale forza tiene uniti uno ione " + F + " e uno ione " + F + r" in un cristallo\?", prose)
    if m:
        if unfx(m.group(1)) not in CATIONS or unfx(m.group(2)) not in ANIONS:
            errs.append("a cation and an anion are needed")
        check_text(sample, "Legame ionico", errs)
        return "due ioni"
    m = re.fullmatch(r"Quale dei due ioni trattiene con più forza le molecole d'acqua che ha intorno: " + F + " o " + F + r"\?", prose)
    if m:
        a, b = unfx(m.group(1)), unfx(m.group(2))
        if a not in CATIONS or b not in CATIONS or CATIONS[a] == CATIONS[b]:
            errs.append("two cations with different charges are needed")
            return None
        strong, weak = (a, b) if CATIONS[a] > CATIONS[b] else (b, a)
        # the lesson's rule also asks for the smaller ion: the more charged one must not be the larger (ionic radii in pm)
        radius = {"Li+": 76, "Na+": 102, "K+": 138, "Mg2+": 72, "Ca2+": 100}
        if radius[strong] > radius[weak]:
            errs.append(f"{strong} is more charged but larger than {weak}: the rule does not decide")
        check_text(sample, f"${fx(strong)}$, perché ha la carica maggiore", errs)
        return "carica"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def level6(sample, prose, errs):
    check_fact(sample, prose, KEY, errs)
    return "fatto"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if lvl != 2 and sample.get("answer", {}).get("kind") != "choice":
        errs.append("only level 2 has an open answer")
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
