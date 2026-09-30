"""Checker for chim-separazione-miscugli (specs/exercises/chim-separazione-miscugli.md).

Written from the spec and lesson 18, not from the generator:
- level 1: the situation is recognised by its key words, and the method follows from the lesson's table; the
  methods that would also work (decantation where filtration is asked, and so on) must not be among the options;
- level 2: the method named in the question gives its property from the lesson's table, or the property described
  gives the method;
- level 3: the liquids and their boiling points are read from the text and checked against the lesson's values;
  the first fraction is the lowest boiling point, the reading after a plateau the next one up;
- level 4: the distances are read from the text; R_f = d/f exactly, in hundredths; the dye is the reference with
  the same R_f, or none; the scene carries the same distances;
- level 5: the steps of each option are applied to a model of the mixture (which components dissolve, which are
  liquid, magnetic, volatile, immiscible), and only the right option must end with every component wanted on its
  own, with no step that does nothing.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import check_choice, common, option_text, parse_dec, prose_and_extra

CASE_RANGES = {
    2: {"proprieta": (0.4, 0.6), "metodo": (0.4, 0.6)},
    3: {"due": (0.4, 0.6), "tre": (0.4, 0.6)},
    4: {"calcolo": (0.4, 0.6), "uguale": (0.28, 0.47), "nessuno": (0.06, 0.2)},
}

METHODS = ["filtrazione", "decantazione", "centrifugazione", "imbuto separatore", "evaporazione", "cristallizzazione", "distillazione", "estrazione con solvente", "cromatografia", "separazione magnetica"]

# Level 1: key words -> (method, other methods that would also work)
SOLID_IN_LIQUID = {"decantazione", "centrifugazione"}
L1_RULES = [
    ("olio forma uno strato", "imbuto separatore", {"decantazione"}),
    ("benzina", "imbuto separatore", {"decantazione"}),
    ("sabbia che non si scioglie", "filtrazione", SOLID_IN_LIQUID),
    ("alla turca", "filtrazione", SOLID_IN_LIQUID),
    ("fango", "filtrazione", SOLID_IN_LIQUID),
    ("recuperare il sale", "evaporazione", {"cristallizzazione", "distillazione"}),
    ("saline", "evaporazione", {"cristallizzazione"}),
    ("da bere dall'acqua di mare", "distillazione", set()),
    ("alcol", "distillazione", set()),
    ("acetone", "distillazione", set()),
    ("petrolio", "distillazione", set()),
    ("solvente di una vernice", "distillazione", set()),
    ("coloranti ci sono nell'inchiostro", "cromatografia", set()),
    ("firma", "cromatografia", set()),
    ("colorante vietato", "cromatografia", set()),
    ("limatura di ferro", "separazione magnetica", set()),
    ("lattine", "separazione magnetica", set()),
    ("sangue", "centrifugazione", set()),
    ("panna", "centrifugazione", {"decantazione"}),
    ("iodio", "estrazione con solvente", set()),
    ("caffeina", "estrazione con solvente", set()),
    ("solfato di rame", "cristallizzazione", set()),
]

PROPERTY = {
    "filtrazione": "la dimensione delle particelle",
    "decantazione": "la densità",
    "centrifugazione": "la densità",
    "imbuto separatore": "la densità",
    "evaporazione": "il liquido evapora, il solido no",
    "cristallizzazione": "il liquido evapora, il solido no",
    "distillazione": "la temperatura di ebollizione",
    "estrazione con solvente": "la solubilità in un altro solvente",
    "cromatografia": "quanto è trattenuta dalla carta",
    "separazione magnetica": "le proprietà magnetiche",
}
L2_RULES = [
    ("bollono a temperature diverse", "distillazione", set()),
    ("pori di un foglio di carta", "filtrazione", SOLID_IN_LIQUID),
    ("si scioglie molto meglio in un altro liquido", "estrazione con solvente", set()),
    ("calamita", "separazione magnetica", set()),
    ("trattenute dalla carta", "cromatografia", set()),
    ("non si mescolano e hanno densità diverse", "imbuto separatore", SOLID_IN_LIQUID),
    ("giorni a depositarsi", "centrifugazione", set()),
    ("l'acqua evapora, il solido no", "evaporazione", {"cristallizzazione", "distillazione"}),
]

BOILING = {"acetone": 56, "metanolo": 65, "etanolo": 78, "acqua": 100, "acido acetico": 118, "glicole etilenico": 197}


def method_of(latex):
    m = option_text(latex).lower()
    if m not in METHODS:
        raise ValueError(f"not a method: {m!r}")
    return m


def by_rules(prose, rules, errs):
    hits = [(m, also) for key, m, also in rules if key in prose]
    if len({m for m, _ in hits}) != 1:
        errs.append(f"situation not recognised ({len(hits)} rules): {prose!r}")
        return None, None
    return hits[0]


def choice_methods(sample, right, also, errs):
    for o in sample["answer"]["options"]:
        try:
            m = method_of(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            continue
        if m in also:
            errs.append(f"option {m!r} would also work")
        if o["values"] != [m]:
            errs.append(f"option value {o['values']} is not {m!r}")
    check_choice(sample["answer"], lambda o: method_of(o["latex"]) == right, errs)


def level1(sample, prose, errs):
    if not prose.endswith(" Quale metodo conviene usare?"):
        errs.append("level 1 question not recognised")
    right, also = by_rules(prose, L1_RULES, errs)
    if right:
        choice_methods(sample, right, also, errs)
    return None


def level2(sample, prose, errs):
    m = re.fullmatch(r"Quale proprietà dei componenti di un miscuglio sfrutta (?:la |l')(.+)\?", prose)
    if m:
        method = m.group(1)
        if method not in METHODS:
            errs.append(f"unknown method {method!r}")
            return "proprieta"
        prop = PROPERTY[method]
        texts = [option_text(o["latex"]).lower() for o in sample["answer"]["options"]]
        if len(set(texts)) != 4 or not all(t in PROPERTY.values() for t in texts):
            errs.append(f"options are not four different properties: {texts}")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]).lower() == prop, errs)
        return "proprieta"
    if not prose.endswith(" Quale metodo li separa?"):
        errs.append("level 2 text not recognised")
        return None
    right, also = by_rules(prose, L2_RULES, errs)
    if right:
        choice_methods(sample, right, also, errs)
    return "metodo"


def temps_in(prose):
    return [int(x) for x in re.findall(r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$", prose)]


def level3(sample, prose, errs):
    m = re.fullmatch(r"Si distilla un miscuglio di (.+?) (?:e|ed) (.+?)\. (?:L'|Il )(.+?) bolle a \$(\d+)\\,\^\\circ\\text\{C\}\$, (?:l'|il )(.+?) a \$(\d+)\\,\^\\circ\\text\{C\}\$\. Che cosa si raccoglie nella prima frazione, e che temperatura segna il termometro in testa alla colonna mentre la si raccoglie\?", prose)
    if m:
        a, b = m.group(1), m.group(2)
        if m.group(3).lower() != a or m.group(5) != b:
            errs.append("liquids named in two ways")
        ta, tb = int(m.group(4)), int(m.group(6))
        for x, tx in ((a, ta), (b, tb)):
            if BOILING.get(x) != tx:
                errs.append(f"boiling point of {x} is not {tx}")
        if abs(ta - tb) < 20:
            errs.append("boiling points closer than 20 °C")
        first, T = (a, ta) if ta < tb else (b, tb)

        def reading(o):
            mm = re.fullmatch(r"\\text\{(.+), a \}(\d+)\\,\^\\circ\\text\{C\}", o["latex"])
            if not mm:
                raise ValueError(f"option not read: {o['latex']!r}")
            name = mm.group(1).lower()
            if name not in (a, b) or int(mm.group(2)) not in (ta, tb):
                raise ValueError(f"option {o['latex']!r} outside the mixture")
            return name, int(mm.group(2))

        check_choice(sample["answer"], lambda o: reading(o) == (first, T), errs)
        return "due"
    m = re.fullmatch(r"Si distilla un miscuglio di (.+?), (.+?) (?:e|ed) (.+?)\. Temperature di ebollizione: (.+?)\. Il termometro in testa alla colonna, dopo una sosta a \$(\d+)\\,\^\\circ\\text\{C\}\$, è salito e ora resta fermo a \$(\d+)\\,\^\\circ\\text\{C\}\$\. Che cosa si sta raccogliendo\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    trio = [m.group(1), m.group(2), m.group(3)]
    listed = dict(re.findall(r"([a-z ]+?) \$(\d+)\\,\^\\circ\\text\{C\}\$", m.group(4)))
    listed = {k.strip(", "): int(v) for k, v in listed.items()}
    if set(listed) != set(trio):
        errs.append(f"table {listed} does not match {trio}")
    for x in trio:
        if BOILING.get(x) != listed.get(x):
            errs.append(f"boiling point of {x} wrong")
    s = sorted(BOILING[x] for x in trio if x in BOILING)
    if len(s) == 3 and (s[1] - s[0] < 20 or s[2] - s[1] < 20):
        errs.append("boiling points closer than 20 °C")
    before, now = int(m.group(5)), int(m.group(6))
    if now not in s[1:] or s[s.index(now) - 1] != before:
        errs.append(f"readings {before} then {now} are not two plateaus in a row")
    right = [x for x in trio if BOILING.get(x) == now]

    def name(o):
        t = option_text(o["latex"]).lower()
        if t == "tutti e tre insieme":
            return "tutti"
        if t not in trio:
            raise ValueError(f"option {t!r} not in the mixture")
        return t

    check_choice(sample["answer"], lambda o: right and name(o) == right[0], errs)
    return "tre"


def rf_value(latex):
    return parse_dec(latex)


def level4(sample, prose, errs):
    cm = r"\$(\d+\{,\}\d)\\,\\text\{cm\}\$"
    m = re.fullmatch(r"Nel cromatogramma la linea di partenza è a " + cm + r" dal bordo inferiore della carta\. Il solvente ha percorso " + cm + r" dalla linea di partenza, la macchia ([ABC]) " + cm + r"\. Quanto vale il fattore di ritenzione della macchia \3\?", prose)
    scene = sample.get("scene") or {}
    data = scene.get("data", {})
    if m:
        base, f, d = parse_dec(m.group(1)), parse_dec(m.group(2)), parse_dec(m.group(4))
        rf = d / f
        if (rf * 100).q != 1:
            errs.append(f"R_f {rf} is not a number of hundredths")
        if not (Rational(1, 10) <= rf <= Rational(9, 10)):
            errs.append(f"R_f {rf} out of range")
        if scene.get("type") != "cromatogramma" or Rational(str(data.get("fronte"))) != f or Rational(str(data["macchie"][0]["d"])) != d or Rational(str(data.get("partenza"))) != base:
            errs.append("scene does not match the text")
        for o in sample["answer"]["options"]:
            if rf_value(o["latex"]) <= 0:
                errs.append("non-positive option")
        check_choice(sample["answer"], lambda o: rf_value(o["latex"]) == rf, errs)
        return "calcolo"
    m = re.fullmatch(r"Con la stessa carta e lo stesso solvente, tre coloranti noti hanno questi valori di \$R_f\$: (.+?)\. In un campione sconosciuto la macchia ([ABC]) percorre " + cm + r" mentre il solvente percorre " + cm + r", tutti e due dalla linea di partenza\. Quale colorante è la macchia \2\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    refs = {k: parse_dec(v) for k, v in re.findall(r"([a-z]+) (\d\{,\}\d\d)", m.group(1))}
    if len(refs) != 3:
        errs.append(f"references not read: {m.group(1)!r}")
    d, f = parse_dec(m.group(3)), parse_dec(m.group(4))
    rf = d / f
    if scene.get("type") != "cromatogramma" or Rational(str(data.get("fronte"))) != f or Rational(str(data["macchie"][0]["d"])) != d:
        errs.append("scene does not match the text")
    same = [k for k, v in refs.items() if v == rf]
    if not same and min(abs(v - rf) for v in refs.values()) < Rational(5, 100):
        errs.append("R_f too close to a reference without being equal")
    right = same[0] if same else "nessuno"

    def name(o):
        t = option_text(o["latex"])
        if t == "Nessuno dei tre":
            return "nessuno"
        mm = re.fullmatch(r"Il colorante ([a-z]+)", t)
        if not mm or mm.group(1) not in refs:
            raise ValueError(f"option {t!r} not a reference")
        return mm.group(1)

    check_choice(sample["answer"], lambda o: name(o) == right, errs)
    return "uguale" if same else "nessuno"


# ---------------------------------------------------------------- level 5: a model of the mixture

PROPS = {
    "sabbia": {"solid"},
    "zolfo": {"solid"},
    "ferro": {"solid", "magnetic"},
    "sale": {"solid", "soluble"},
    "acqua": {"liquid", "volatile", "water"},
    "alcol": {"liquid", "volatile", "miscible"},
    "olio": {"liquid", "immiscible"},
}
MIXTURES = {
    "sabbia, sale e acqua (il sale è sciolto)": ["sabbia", "sale", "acqua"],
    "limatura di ferro, sabbia e sale, tutti asciutti": ["ferro", "sabbia", "sale"],
    "limatura di ferro, zolfo e sale, tutti asciutti": ["ferro", "zolfo", "sale"],
    "olio, acqua e sale sciolto nell'acqua": ["olio", "acqua", "sale"],
    "sabbia, acqua e alcol": ["sabbia", "acqua", "alcol"],
    "sabbia, olio e acqua": ["sabbia", "olio", "acqua"],
}
GOALS = {"la sabbia": "sabbia", "il sale": "sale", "l'acqua": "acqua", "il ferro": "ferro", "lo zolfo": "zolfo", "l'olio": "olio", "l'alcol": "alcol"}


def has(g, prop):
    return [c for c in g if prop in PROPS[c]]


def apply(step, groups):
    """Applies a step to every group it can act on; returns the new groups, or None if it acts on none."""
    out, acted = [], False
    for g in groups:
        g = set(g)
        liquids = has(g, "liquid")
        solids = has(g, "solid")
        if step == "separazione magnetica" and not liquids and has(g, "magnetic") and len(g) > 1:
            mag = set(has(g, "magnetic"))
            out += [mag, g - mag]
            acted = True
        elif step == "aggiunta d'acqua" and not liquids and has(g, "soluble"):
            out.append(g | {"acqua"})
            acted = True
        elif step == "filtrazione" and liquids and [c for c in solids if "soluble" not in PROPS[c]]:
            stuck = {c for c in solids if "soluble" not in PROPS[c]}
            out += [stuck, g - stuck]
            acted = True
        elif step == "evaporazione" and has(g, "volatile") and g - set(has(g, "volatile")):
            out.append(g - set(has(g, "volatile")))  # the volatile liquids are lost
            acted = True
        elif step == "distillazione" and has(g, "volatile") and len(g) > 1:
            vol = has(g, "volatile")
            out += [{c} for c in vol]
            rest = g - set(vol)
            if rest:
                out.append(rest)
            acted = True
        elif step == "imbuto separatore" and has(g, "immiscible") and has(g, "water") and not [c for c in solids if "soluble" not in PROPS[c]]:
            oil = set(has(g, "immiscible"))
            out += [oil, g - oil]
            acted = True
        else:
            out.append(g)
    return out if acted else None


def works(mixture, goal, steps):
    groups = [set(mixture)]
    for s in steps:
        groups = apply(s, groups)
        if groups is None:
            return False
    wanted = set(goal)
    alone = {next(iter(g)) for g in groups if len(g) == 1}
    return wanted <= alone


def option_steps(latex):
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", latex)
    if not m:
        raise ValueError(f"option not a list of steps: {latex!r}")
    steps = []
    for i, part in enumerate(m.group(1).split(" \\\\ ")):
        mm = re.fullmatch(r"\\text\{(\d)\. (.+)\}", part.strip())
        if not mm or int(mm.group(1)) != i + 1:
            raise ValueError(f"step not numbered: {part!r}")
        steps.append(mm.group(2))
    return steps


def level5(sample, prose, errs):
    m = re.fullmatch(r"Un miscuglio contiene (.+?)\. Si vogliono ottenere separati (.+?)\. In che ordine si fanno i passi\?", prose)
    if not m or m.group(1) not in MIXTURES:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    mixture = MIXTURES[m.group(1)]
    parts = re.split(r", | e ", m.group(2))
    if any(p not in GOALS for p in parts):
        errs.append(f"goal not read: {m.group(2)!r}")
        return None
    goal = [GOALS[p] for p in parts]
    check_choice(sample["answer"], lambda o: works(mixture, goal, option_steps(o["latex"])), errs)
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}.get(lvl)
    if not fn:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, prose, errs)
    if lvl != 4 and sample.get("scene"):
        errs.append("unexpected scene")
    return errs, kind
