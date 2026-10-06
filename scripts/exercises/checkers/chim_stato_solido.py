"""Checker for chim-stato-solido (specs/exercises/chim-stato-solido.md), written from the spec and the lesson
75-chim-stato-solido.md, not from the generator.

Levels 1 and 6: the answer keys below, written from the lesson. Level 2: the type of solid from the formula, with the
lesson's rules (a metal or an alloy; a metal with a non-metal; the few covalent networks to remember; molecules
otherwise), metals read from elementi.json. Level 3: the lesson's procedure on the properties read in the text. Level 4:
the particles of a cubic cell, vertex 1/8, edge 1/4, face 1/2, inside 1, with exact fractions. Level 5: three solids of
three types ordered by the melting temperatures the lesson gives.
"""
import re
from fractions import Fraction

from checkers._chim3_h import _ELEMENTS, atoms, check_fact, check_number, check_text, choice_of, common, plain, prose_and_extra, unfx

TYPES = ["Ionico", "Molecolare", "Covalente", "Metallico"]
QUARTER = (0.18, 0.32)
CASE_RANGES = {
    2: {"ionico": QUARTER, "molecolare": QUARTER, "covalente": QUARTER, "metallico": QUARTER},
    3: {"ionico": QUARTER, "molecolare": QUARTER, "covalente": QUARTER, "metallico": QUARTER},
}

KEY_1 = {
    "Come sono disposte le particelle in un solido cristallino?": "In ordine, con uno schema che si ripete",
    "Come sono disposte le particelle in un solido amorfo?": "In disordine, come in un liquido bloccato",
    "Che cosa succede alla temperatura mentre un solido cristallino fonde?": "Resta costante",
    "Come si comporta un solido amorfo quando viene scaldato?": "Rammollisce un po' alla volta",
    "Quale di questi solidi è amorfo?": "Il vetro",
    "Quale di questi solidi è cristallino?": "Il ghiaccio",
    "Quale di questi solidi ha le particelle disposte in modo ordinato?": "Il ferro",
    "In chimica, che cosa indica la parola cristallino?": "L'ordine delle particelle",
    'Il vetro "cristallo" dei bicchieri è un solido cristallino?': "No, è un solido amorfo",
    "Un pezzo di ferro, opaco e grigio, è un solido cristallino?": "Sì, ha le particelle in ordine",
    "In quale di questi solidi il diossido di silicio è cristallino?": "Nel quarzo",
    "Come si ottiene il vetro di silice?": "Raffreddando in fretta il quarzo fuso",
    "Come si rompe un cristallo?": "Lungo piani precisi",
    "Come si chiama la disposizione ordinata delle particelle di un cristallo?": "Reticolo cristallino",
    "Che cosa sono i nodi di un reticolo cristallino?": "I punti in cui stanno le particelle",
    "Che cos'è la cella elementare di un cristallo?": "Il pezzetto più piccolo che ripetuto dà il cristallo",
    "Dove stanno le particelle nella cella cubica semplice?": "Solo sui vertici",
    "Dove stanno le particelle nella cella cubica a corpo centrato?": "Sui vertici e al centro del cubo",
    "Dove stanno le particelle nella cella cubica a facce centrate?": "Sui vertici e al centro delle facce",
    "Che cella elementare ha il rame?": "Cubica a facce centrate",
    "Che cella elementare ha il ferro a temperatura ambiente?": "Cubica a corpo centrato",
    "Quale di questi metalli ha la cella cubica a corpo centrato?": "Il sodio",
    "Quale di questi metalli non ha la cella cubica a facce centrate?": "Il ferro",
    "In un cristallo, quanti cubi hanno in comune lo stesso vertice?": "8",
}

KEY_6 = {
    "Che cosa sono le forme allotropiche di un elemento?": "Forme dello stesso elemento con gli atomi legati in modi diversi",
    "A quanti atomi è legato ogni atomo di carbonio nel diamante?": "4",
    "A quanti atomi è legato ogni atomo di carbonio nella grafite?": "3",
    "Nel diamante, come sono disposti i quattro atomi legati a un atomo di carbonio?": "Ai vertici di un tetraedro",
    "Che struttura ha la grafite?": "Strati piani di esagoni",
    "Perché la grafite conduce la corrente?": "Un elettrone per atomo è libero nello strato",
    "Perché il diamante non conduce la corrente?": "Tutti gli elettroni di valenza sono nei legami",
    "Che cosa tiene uniti tra loro gli strati della grafite?": "Forze di London",
    "Che cosa unisce gli atomi dentro uno strato di grafite?": "Legami covalenti",
    "Perché la grafite è tenera?": "Gli strati scorrono uno sull'altro",
    "Quale forma del carbonio è la mina delle matite?": "La grafite",
    "Che aspetto ha la grafite?": "Nera e opaca",
    "Quale ha la densità maggiore, il diamante o la grafite?": "Il diamante",
    "Che tipo di solido è il fullerene?": "Molecolare",
    "Quanti atomi di carbonio ha la molecola del fullerene più noto?": "60",
    "Come sono disposti gli atomi nella molecola del fullerene più noto?": "In pentagoni ed esagoni",
    "Quale di queste forme del carbonio è fatta di molecole?": "Il fullerene",
    "Che cos'è il grafene?": "Un singolo strato di grafite",
    "Che cos'è un nanotubo di carbonio?": "Uno strato arrotolato a cilindro",
    "Quale di queste è una forma allotropica dell'ossigeno?": "L'ozono",
}


def four_types(sample, errs):
    texts = sorted(plain(o["latex"]) for o in choice_of(sample).get("options", []))
    if texts != sorted(TYPES):
        errs.append(f"the options are not the four types: {texts}")
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("this level is a multiple choice only")


# ---------------------------------------------------------------------------
# Level 2

METAL_FAMILIES = {"alcalini", "alcalino-terrosi", "transizione", "altri-metalli"}
IS_METAL = {e["symbol"]: e["family"] in METAL_FAMILIES for e in _ELEMENTS}
# the covalent networks the lesson asks to remember (graphite is left out of the exercises)
NETWORKS = {"SiO2", "Si", "SiC"}
# the name as the exercise writes it -> the formula beside it
FORMULA_OF = {
    "il cloruro di sodio": "NaCl", "il bromuro di potassio": "KBr", "il cloruro di potassio": "KCl", "l'ossido di magnesio": "MgO",
    "il fluoruro di calcio": "CaF2", "l'ossido di calcio": "CaO", "il fluoruro di litio": "LiF", "il bromuro di sodio": "NaBr",
    "il cloruro di magnesio": "MgCl2",
    "il ghiaccio": "H2O", "il ghiaccio secco": "CO2", "lo iodio": "I2", "l'ammoniaca solida": "NH3", "lo zolfo": "S8",
    "il metano solido": "CH4", "l'argon solido": "Ar",
    "il quarzo": "SiO2", "il silicio": "Si", "il carburo di silicio": "SiC",
    "il ferro": "Fe", "il rame": "Cu", "l'argento": "Ag", "l'oro": "Au", "l'alluminio": "Al", "il sodio": "Na",
}
# solids the lesson names without a formula
NAMED = {"il diamante": "Covalente", "lo zucchero": "Molecolare", "la naftalina": "Molecolare", "l'ottone": "Metallico"}


def type_from_formula(formula):
    """The lesson's rules "Dalla formula"."""
    metals = [IS_METAL[s] for s, _ in atoms(formula)]
    if all(metals):
        return "Metallico"
    if any(metals):
        return "Ionico"
    if formula in NETWORKS:
        return "Covalente"
    return "Molecolare"


def level2(sample, prose, errs):
    m = re.fullmatch(r"Che tipo di solido è ([^,$?]+)(?:, \$([^$]+)\$)?\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    name, tex = m.group(1), m.group(2)
    if tex is None:
        if name not in NAMED:
            errs.append(f"{name!r} without a formula is not a solid of the lesson")
            return None
        want = NAMED[name]
    else:
        formula = unfx(tex)
        if FORMULA_OF.get(name) != formula:
            errs.append(f"{name!r} is not {formula}")
            return None
        want = type_from_formula(formula)
    four_types(sample, errs)
    check_text(sample, want, errs)
    return want.lower()


# ---------------------------------------------------------------------------
# Level 3

# sentence -> (conducts when solid, conducts when molten or dissolved)
CONDUCTS = {
    "Allo stato solido conduce la corrente.": (True, None),
    "Conduce la corrente sia da solido sia da fuso.": (True, True),
    "Allo stato solido non conduce la corrente; fuso la conduce.": (False, True),
    "Non conduce la corrente da solido, ma la conduce da fuso.": (False, True),
    "Allo stato solido non conduce la corrente; sciolto in acqua la conduce.": (False, True),
    "Non conduce la corrente né da solido né da fuso.": (False, False),
    "Non conduce la corrente in nessun caso.": (False, False),
}
HARDNESS = {
    "Si lascia ridurre in lamine.": "malleabile", "Si piega senza rompersi.": "malleabile", "È malleabile.": "malleabile",
    "È duro ma fragile.": "fragile", "Sotto un colpo si spacca lungo un piano.": "fragile",
    "È tenero.": "tenero", "Si scalfisce con un'unghia.": "tenero", "Si sbriciola con facilità.": "tenero",
    "È durissimo.": "durissimo", "Riga il vetro.": "durissimo",
}


def level3(sample, prose, errs):
    m = re.fullmatch(r"Un solido sconosciuto fonde a \$(-?\d+)\\,\^\\circ\\text\{C\}\$\. (.+) Che tipo di solido è\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    temp = int(m.group(1))
    sentences = re.split(r"(?<=\.) ", m.group(2))
    cond = [s for s in sentences if s in CONDUCTS]
    hard = [s for s in sentences if s in HARDNESS]
    if len(sentences) != 2 or len(cond) != 1 or len(hard) != 1:
        errs.append(f"level 3 properties not recognised: {sentences}")
        return None
    solid, molten = CONDUCTS[cond[0]]
    hardness = HARDNESS[hard[0]]
    # the procedure "Dalle proprietà", then the other data must agree with the type and leave no doubt
    if solid:
        want, ok = "Metallico", hardness == "malleabile" and -40 <= temp <= 3500
    elif molten:
        want, ok = "Ionico", hardness == "fragile" and 600 <= temp <= 1000
    elif temp < 200:
        want, ok = "Molecolare", hardness == "tenero"
    elif temp > 1400:
        want, ok = "Covalente", hardness == "durissimo"
    else:
        errs.append(f"a solid that never conducts and melts at {temp}: neither low nor very high")
        return None
    if not ok:
        errs.append(f"the data do not agree: {want}, {hardness}, {temp}")
    four_types(sample, errs)
    check_text(sample, want, errs)
    return want.lower()


# ---------------------------------------------------------------------------
# Level 4

PLACES = [("sui vertici", Fraction(1, 8), {8}), ("sugli spigoli", Fraction(1, 4), {12}), ("sulle facce", Fraction(1, 2), {2, 6}), ("all'interno", Fraction(1), {1, 2, 4})]


def level4(sample, prose, errs):
    m = re.fullmatch(r"In una cella cubica ci sono (.+)\. Quante particelle contiene la cella\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    items = re.split(r", | e ", m.group(1))
    found = []
    for j, item in enumerate(items):
        mm = re.fullmatch(r"\$(\d+)\$ (particelle )?(.+)", item)
        if not mm or bool(mm.group(2)) != (j == 0):
            errs.append(f"level 4 item not recognised: {item!r}")
            return None
        found.append((mm.group(3), int(mm.group(1))))
    order = [p[0] for p in PLACES]
    where = [w for w, _ in found]
    if any(w not in order for w in where) or where != sorted(set(where), key=order.index):
        errs.append(f"positions wrong or out of order: {where}")
        return None
    counts = dict(found)
    total, terms, values = Fraction(0), [], []
    for name, share, allowed in PLACES:
        k = counts.get(name)
        if k is None:
            continue
        if k not in allowed:
            errs.append(f"{k} particles {name} is not a cubic cell of the spec")
        part = k * share
        total += part
        terms.append(str(k) if share == 1 else f"{k} \\cdot \\frac{{1}}{{{share.denominator}}}")
        values.append(str(part))
    if not any(n in counts for n in order[:3]):
        errs.append("no particle on vertices, edges or faces")
    if total.denominator != 1:
        errs.append(f"the cell holds {total} particles, not a whole number")
        return None
    n = int(total)
    check_number(sample, n, errs, must_be_open=True)
    # the count written as in the lesson's example
    line = " + ".join(terms) + (" = " + " + ".join(values) if len(terms) > 1 else "") + f" = {n}"
    steps = [s.replace("\\begin{aligned} &", "").replace(" \\\\ &", " ").replace(" \\end{aligned}", "") for s in sample.get("steps", [])]
    if line not in steps:
        errs.append(f"the steps do not show the count {line!r}")
    if sample.get("solution") != str(n):
        errs.append(f"solution {sample.get('solution')!r} != {n}")
    return "cella"


# ---------------------------------------------------------------------------
# Level 5

# as the problem names it -> (type, as the options write it, melting temperature of the lesson or the least it can be)
SOLIDS = {
    "iodio $\\mathrm{I_2}$": ("molecolare", "$\\mathrm{I_2}$", 114),
    "ghiaccio": ("molecolare", "ghiaccio", 0),
    "naftalina": ("molecolare", "naftalina", 80),
    "zucchero": ("molecolare", "zucchero", 186),
    "cloruro di sodio $\\mathrm{NaCl}$": ("ionico", "$\\mathrm{NaCl}$", 801),
    "cloruro di potassio $\\mathrm{KCl}$": ("ionico", "$\\mathrm{KCl}$", 770),
    "ossido di magnesio $\\mathrm{MgO}$": ("ionico", "$\\mathrm{MgO}$", 2852),
    "diamante": ("covalente", "diamante", 3500),
    "quarzo $\\mathrm{SiO_2}$": ("covalente", "quarzo", 1700),
    "carburo di silicio $\\mathrm{SiC}$": ("covalente", "$\\mathrm{SiC}$", 2500),
}
RANK = {"molecolare": 0, "ionico": 1, "covalente": 2}


def level5(sample, prose, errs):
    m = re.fullmatch(r"Metti in ordine di temperatura di fusione crescente: (.+)\.", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    names = m.group(1).split(", ")
    if len(names) != 3 or any(n not in SOLIDS for n in names):
        errs.append(f"level 5 solids not recognised: {names}")
        return None
    solids = [SOLIDS[n] for n in names]
    if sorted(s[0] for s in solids) != sorted(RANK):
        errs.append("not one molecular, one ionic and one covalent solid")
        return None
    by_type = sorted(solids, key=lambda s: RANK[s[0]])
    by_temp = sorted(solids, key=lambda s: s[2])
    if by_type != by_temp or len({s[2] for s in solids}) != 3:
        errs.append(f"the order of the types is not the order of the temperatures: {[s[1] for s in by_temp]}")
        return None
    labels = sorted(s[1] for s in solids)
    for o in choice_of(sample).get("options", []):
        text = plain(o["latex"])
        if sorted(text.split(", ")) != labels:
            errs.append(f"option {text!r} is not an order of the three solids")
        if o["values"] != [text]:
            errs.append(f"option value {o['values']} is not its text")
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("this level is a multiple choice only")
    check_text(sample, ", ".join(s[1] for s in by_temp), errs)
    return "ordine"


# ---------------------------------------------------------------------------


def facts(key):
    def level(sample, prose, errs):
        check_fact(sample, prose, key, errs)
        if sample.get("answer", {}).get("kind") != "choice":
            errs.append("this level is a multiple choice only")
        return "fatto"

    return level


LEVELS = {1: facts(KEY_1), 2: level2, 3: level3, 4: level4, 5: level5, 6: facts(KEY_6)}


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
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
