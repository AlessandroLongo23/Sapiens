"""What the checkers of chim-ossiacidi, chim-sali-binari and chim-sali-ternari share (chemistry, third year, group J).

Written from the lessons 80-82 (docs/lezioni/chimica/riscritte/), not from src/lib/exercises/v2/chim3-j.ts: it reads a
formula, counts its atoms, and works the names out of the composition and of the charges, where the generator builds
formula and names from the ions. The tables below are the tables of the lessons.
"""
import re
from fractions import Fraction
from math import gcd

ROMAN = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII"}
COUNT = {1: "", 2: "di", 3: "tri", 4: "tetra", 5: "penta", 6: "esa", 7: "epta", 8: "otta", 9: "nona", 10: "deca"}
TIMES = {1: "", 2: "bis", 3: "tris", 4: "tetrakis"}

# metal -> (name, charges, adjectives of the traditional name)
METALS = {
    "Li": ("litio", (1,), None), "Na": ("sodio", (1,), None), "K": ("potassio", (1,), None), "Ag": ("argento", (1,), None),
    "Mg": ("magnesio", (2,), None), "Ca": ("calcio", (2,), None), "Ba": ("bario", (2,), None), "Zn": ("zinco", (2,), None),
    "Al": ("alluminio", (3,), None),
    "Fe": ("ferro", (2, 3), ("ferroso", "ferrico")), "Cu": ("rame", (1, 2), ("rameoso", "rameico")),
    "Sn": ("stagno", (2, 4), ("stannoso", "stannico")), "Pb": ("piombo", (2, 4), ("piomboso", "piombico")),
    "NH_4": ("ammonio", (1,), None),
}

# anion of a hydracid -> (name, charge, acid, formula of the acid)
SIMPLE = {
    "F": ("fluoruro", 1, "acido fluoridrico", "HF"), "Cl": ("cloruro", 1, "acido cloridrico", "HCl"),
    "Br": ("bromuro", 1, "acido bromidrico", "HBr"), "I": ("ioduro", 1, "acido iodidrico", "HI"),
    "S": ("solfuro", 2, "acido solfidrico", "H_2S"),
}

# element of an oxoacid -> (root of the acid, root of the anion)
ROOTS = {"C": ("carbon", "carbon"), "N": ("nitr", "nitr"), "S": ("solfor", "solf"), "P": ("fosfor", "fosf"), "Cl": ("clor", "clor"),
         "Br": ("brom", "brom"), "I": ("iod", "iod"), "B": ("bor", "bor"), "Si": ("silic", "silic"), "Cr": ("crom", "crom"), "Mn": ("mangan", "mangan")}

# the oxidation numbers each element has in its oxoacids, and the traditional prefix and suffix of each (lesson 80)
SUFFIX = {
    "C": {4: ("", "ico")}, "N": {3: ("", "oso"), 5: ("", "ico")}, "S": {4: ("", "oso"), 6: ("", "ico")},
    "P": {3: ("", "oso"), 5: ("", "ico")}, "B": {3: ("", "ico")}, "Si": {4: ("", "ico")},
    "Cl": {1: ("ipo", "oso"), 3: ("", "oso"), 5: ("", "ico"), 7: ("per", "ico")},
    "Br": {1: ("ipo", "oso"), 5: ("", "ico")},
    "I": {1: ("ipo", "oso"), 5: ("", "ico"), 7: ("per", "ico")},
    "Cr": {6: ("", "ico")}, "Mn": {6: ("", "ico"), 7: ("per", "ico")},
}
# atoms of the element in one oxide, to count the water of meta, piro, orto
OXIDE_ATOMS = {"P": 2, "B": 2, "Si": 1}
ELEMENT_NAME = {"C": "carbonio", "N": "azoto", "S": "zolfo", "P": "fosforo", "Cl": "cloro", "Br": "bromo", "I": "iodio", "B": "boro", "Si": "silicio", "Cr": "cromo", "Mn": "manganese"}


def osso(n):
    return "monosso" if n == 1 else COUNT[n] + "osso"


def atoms(tex):
    """'H_2SO_4' -> [('H', 2), ('S', 1), ('O', 4)]; no brackets."""
    if not re.fullmatch(r"(?:[A-Z][a-z]?(?:_\d+|_\{\d+\})?)+", tex):
        raise ValueError(f"not a plain formula: {tex!r}")
    return [(s, int(k) if k else 1) for s, k in re.findall(r"([A-Z][a-z]?)(?:_\{?(\d+)\}?)?", tex)]


def strip_mathrm(tex):
    m = re.fullmatch(r"\\mathrm\{(.*)\}", tex.strip())
    if not m:
        raise ValueError(f"not \\mathrm: {tex!r}")
    return m.group(1)


# ---------------------------------------------------------------------------
# Oxoacids


def read_acid(tex):
    """H_aX_bO_c -> (h, X, b, o), or ValueError."""
    a = atoms(tex)
    if len(a) != 3 or a[0][0] != "H" or a[2][0] != "O" or a[1][0] not in ROOTS:
        raise ValueError(f"not an oxoacid: {tex!r}")
    return a[0][1], a[1][0], a[1][1], a[2][1]


def acid_no(h, n_x, o):
    """Oxidation number of the central atom: hydrogen +1, oxygen -2, sum zero."""
    x = Fraction(2 * o - h, n_x)
    if x.denominator != 1:
        raise ValueError("oxidation number not whole")
    return int(x)


def acid_water(h, x, n_x):
    """Molecules of water per oxide: the hydrogens of the acid, two per molecule, for the acids made from one oxide."""
    per_oxide = Fraction(OXIDE_ATOMS.get(x, 2), n_x)  # molecules of acid from one oxide
    return Fraction(h, 2) * per_oxide


def acid_trad(tex):
    """The adjective of the traditional name (solforico, ipocloroso, pirofosforico, dicromico)."""
    h, x, n_x, o = read_acid(tex)
    no = acid_no(h, n_x, o)
    pre, suf = SUFFIX[x][no]
    root = ROOTS[x][0]
    if x in OXIDE_ATOMS:
        w = acid_water(h, x, n_x)
        top = 3 if OXIDE_ATOMS[x] == 2 else 2
        fam = "meta" if w == 1 else "orto" if w == top else "piro" if w == 2 else None
        if fam is None:
            raise ValueError(f"no meta/piro/orto for {tex!r}")
        return fam + root + suf
    if x == "Cr" and n_x == 2:
        return "di" + root + suf
    if n_x != 1:
        raise ValueError(f"unexpected acid {tex!r}")
    return pre + root + suf


def acid_iupac(tex):
    h, x, n_x, o = read_acid(tex)
    return f"acido {osso(o)}{COUNT[n_x]}{ROOTS[x][0]}ico({ROMAN[acid_no(h, n_x, o)]})"


def acid_from_iupac(name):
    """'acido tetraossosolforico(VI)' -> the formula, from the oxygen atoms and the oxidation number."""
    m = re.fullmatch(r"acido (monosso|diosso|triosso|tetraosso|pentaosso|esaosso|eptaosso)(di)?([a-z]+)ico\((I|II|III|IV|V|VI|VII)\)", name)
    if not m:
        raise ValueError(f"not an IUPAC acid name: {name!r}")
    o = next(k for k in range(1, 8) if osso(k) == m.group(1))
    n_x = 2 if m.group(2) else 1
    x = next(e for e, (r, _) in ROOTS.items() if r == m.group(3))
    no = next(k for k, v in ROMAN.items() if v == m.group(4))
    h = 2 * o - no * n_x
    if h < 1:
        raise ValueError("no hydrogen left")
    return "H" + (f"_{h}" if h > 1 else "") + x + (f"_{n_x}" if n_x > 1 else "") + "O" + (f"_{o}" if o > 1 else "")


# ---------------------------------------------------------------------------
# Salts


def read_salt(tex):
    """A salt's formula -> (metal, n_cat, anion group, n_an, water). 'Al_2(SO_4)_3', '(NH_4)_2SO_4', 'CuSO_4 \\cdot 5H_2O'."""
    water = 0
    m = re.fullmatch(r"(.*?) \\cdot (\d*)H_2O", tex)
    if m:
        tex, water = m.group(1), int(m.group(2) or 1)
    m = re.match(r"\(NH_4\)_(\d)|NH_4|([A-Z][a-z]?)(?:_(\d))?", tex)
    if not m:
        raise ValueError(f"no cation in {tex!r}")
    if m.group(0).startswith("(NH_4)"):
        cat, n_cat = "NH_4", int(m.group(1))
    elif m.group(0) == "NH_4":
        cat, n_cat = "NH_4", 1
    else:
        cat, n_cat = m.group(2), int(m.group(3) or 1)
    if cat not in METALS:
        raise ValueError(f"unknown metal {cat!r}")
    rest = tex[m.end():]
    m = re.fullmatch(r"\((.+)\)_(\d)", rest)
    if m:
        an, n_an = m.group(1), int(m.group(2))
        if len(atoms(an)) < 2:
            raise ValueError("brackets around a single atom")
    else:
        a = atoms(rest)
        if len(a) == 1:
            an, n_an = a[0][0], a[0][1]
        else:
            an, n_an = rest, 1
    return cat, n_cat, an, n_an, water


def read_anion(an):
    """An anion group -> (traditional name, IUPAC name, charge). 'Cl', 'SO_4', 'HCO_3', 'HS', 'H_2PO_4'."""
    if an in SIMPLE:
        return SIMPLE[an][0], SIMPLE[an][0], SIMPLE[an][1]
    if an == "HS":
        return "idrogenosolfuro", "idrogenosolfuro", 1
    a = atoms(an)
    kept = 0
    if a[0][0] == "H":
        kept = a[0][1]
        a = a[1:]
    if len(a) != 2 or a[1][0] != "O" or a[0][0] not in ROOTS:
        raise ValueError(f"unknown anion {an!r}")
    (x, n_x), (_, o) = a
    # the acid it comes from: the one whose central atom has an oxidation number of the lesson's table
    found = []
    for h in range(kept + 1, 5):
        no = Fraction(2 * o - h, n_x)
        if no.denominator == 1 and int(no) in SUFFIX[x]:
            acid = "H" + (f"_{h}" if h > 1 else "") + x + (f"_{n_x}" if n_x > 1 else "") + "O" + (f"_{o}" if o > 1 else "")
            try:
                adj = acid_trad(acid)
            except ValueError:
                continue
            found.append((h, int(no), adj))
    known = [f for f in found if (x, n_x, o, f[0]) in KNOWN_ACIDS]
    if len(known) != 1:
        raise ValueError(f"anion {an!r}: {len(known)} acids of the lessons")
    h, no, adj = known[0]
    adj = re.sub(r"^orto", "", adj)
    trad = (adj[:-3] + "ato") if adj.endswith("ico") else (adj[:-3] + "ito")
    trad = trad.replace("solfor", "solf").replace("fosfor", "fosf")
    hy = "" if kept == 0 else COUNT[kept] + "idrogeno"
    iupac = f"{hy}{osso(o)}{COUNT[n_x]}{ROOTS[x][1]}ato({ROMAN[no]})"
    return hy + trad, iupac, h - kept


# the oxoacids of the lessons, as (element, atoms of it, oxygens, hydrogens)
KNOWN_ACIDS = {
    ("C", 1, 3, 2), ("N", 1, 2, 1), ("N", 1, 3, 1), ("S", 1, 3, 2), ("S", 1, 4, 2), ("P", 1, 4, 3),
    ("Cl", 1, 1, 1), ("Cl", 1, 2, 1), ("Cl", 1, 3, 1), ("Cl", 1, 4, 1), ("Br", 1, 1, 1), ("Br", 1, 3, 1),
    ("I", 1, 1, 1), ("I", 1, 3, 1), ("I", 1, 4, 1), ("Cr", 1, 4, 2), ("Cr", 2, 7, 2), ("Mn", 1, 4, 1),
}


def metal_charge(tex):
    """The charge of the metal in a salt, from the charge of the anion: never from the indices crossed back."""
    cat, n_cat, an, n_an, _ = read_salt(tex)
    q = Fraction(read_anion(an)[2] * n_an, n_cat)
    if q.denominator != 1 or int(q) not in METALS[cat][1]:
        raise ValueError(f"{tex!r}: the metal would have charge {q}")
    return int(q)


def lowest_terms(tex):
    _, n_cat, _, n_an, _ = read_salt(tex)
    return gcd(n_cat, n_an) == 1


def hydrate_word(n):
    return ("mono" if n == 1 else COUNT[n]) + "idrato"


def salt_names(tex):
    """The three names of a salt in lowest terms, from its formula: {'trad', 'stock', 'iupac'}."""
    cat, n_cat, an, n_an, water = read_salt(tex)
    if gcd(n_cat, n_an) != 1:
        raise ValueError(f"{tex!r} not in lowest terms")
    trad_an, iupac_an, _ = read_anion(an)
    q = metal_charge(tex)
    nome, charges, adj = METALS[cat]
    if len(charges) == 1:
        trad = stock = f"{trad_an} di {nome}"
    else:
        trad = f"{trad_an} {adj[charges.index(q)]}"
        stock = f"{trad_an} di {nome}({ROMAN[q]})"
    composite = an not in SIMPLE
    if composite:
        head = iupac_an if n_an == 1 else f"{TIMES[n_an]}[{iupac_an}]"
    else:
        head = COUNT[n_an] + iupac_an
    iupac = f"{head} di {COUNT[n_cat]}{nome}"
    tail = f" {hydrate_word(water)}" if water else ""
    return {"trad": trad + tail, "stock": stock + tail, "iupac": iupac + tail}


def same_formula(a, b):
    return a.replace(" ", "") == b.replace(" ", "")
