"""Checker for chim-trasformazioni-fisiche-chimiche (specs/exercises/chim-trasformazioni-fisiche-chimiche.md), written
from the spec and the lesson 21-chim-trasformazioni-fisiche-chimiche.md, not from the generator.

- level 1: every option is a known situation, classified here as physical or chemical; exactly one option has the kind
  asked, and it is the correct one;
- level 2: the reaction is read from its story (own table of reactants and products); the right option lists exactly
  the side asked, in any order;
- level 3: the clue is found from the words of the story (bubbles or foam: a gas; a liquid that turns cloudy and
  leaves a solid: a precipitate; a new colour; fire, flame or light: heat and light), and exactly one rule must match;
- level 4: the situation is looked up in its own table (physical or chemical, with the right reason); the right option
  says "Sì" for a chemical change and "No" for a physical one, with that reason.
"""
import re

from checkers._chim_leggi_ponderali import check_choice, common, option_text, prose

CASE_RANGES = {
    1: {"chimica": (0.40, 0.60), "fisica": (0.40, 0.60)},
    2: {"reagenti": (0.40, 0.60), "prodotti": (0.40, 0.60)},
    3: {k: (0.18, 0.32) for k in ["Si sviluppa un gas", "Si forma un precipitato", "Cambia il colore", "Si liberano calore e luce"]},
    4: {"chimica": (0.40, 0.60), "fisica": (0.40, 0.60)},
}

CHEMICAL = {
    "Il ferro che arrugginisce", "Il legno che brucia", "L'uovo che cuoce", "Il latte che inacidisce", "Il mosto che fermenta",
    "Lo zucchero che caramella", "La mela tagliata che annerisce", "Il gas del fornello che brucia",
    "L'aceto versato sul bicarbonato", "Il pane che si tosta", "L'argento che annerisce", "Il rame del tetto che diventa verde",
    "L'acqua decomposta con la corrente", "Il cemento che fa presa",
}
PHYSICAL = {
    "Il ghiaccio che fonde", "L'acqua che bolle", "Lo zucchero che si scioglie nel tè", "La pozzanghera che si asciuga",
    "Il caffè in grani macinato", "Il filo di rame piegato", "Il bicchiere che si rompe", "Il vapore che si condensa sullo specchio",
    "La cera fusa che si solidifica", "La naftalina che sublima", "La sabbia filtrata dall'acqua", "Il ferro separato con la calamita",
    "Il cioccolato che fonde in mano", "Il sale che si scioglie nell'acqua",
}

# story start → (reactants, products)
REACTIONS = {
    "Il metano del fornello brucia": ({"metano", "ossigeno"}, {"diossido di carbonio", "acqua"}),
    "Il ferro, all'aria umida": ({"ferro", "ossigeno", "acqua"}, {"ruggine"}),
    "Scaldando il carbonato di calcio": ({"carbonato di calcio"}, {"ossido di calcio", "diossido di carbonio"}),
    "Il magnesio brucia": ({"magnesio", "ossigeno"}, {"ossido di magnesio"}),
    "Con la corrente elettrica l'acqua": ({"acqua"}, {"idrogeno", "ossigeno"}),
    "Il bicarbonato di sodio reagisce": ({"bicarbonato di sodio", "acido acetico"}, {"acetato di sodio", "acqua", "diossido di carbonio"}),
    "Scaldati insieme, il ferro e lo zolfo": ({"ferro", "zolfo"}, {"solfuro di ferro"}),
    "Nelle foglie, alla luce": ({"diossido di carbonio", "acqua"}, {"glucosio", "ossigeno"}),
    "Lo zinco immerso": ({"zinco", "acido cloridrico"}, {"cloruro di zinco", "idrogeno"}),
    "Il sodio reagisce con il cloro": ({"sodio", "cloro"}, {"cloruro di sodio"}),
    "Scaldato, l'ossido di mercurio": ({"ossido di mercurio"}, {"mercurio", "ossigeno"}),
    "Nella fermentazione": ({"glucosio"}, {"alcol etilico", "diossido di carbonio"}),
    "L'idrogeno brucia": ({"idrogeno", "ossigeno"}, {"acqua"}),
}

CLUES = ["Si sviluppa un gas", "Si forma un precipitato", "Cambia il colore", "Si liberano calore e luce"]
CLUE_RULES = [
    ("Si sviluppa un gas", re.compile(r"bollicine|schiuma")),
    ("Si forma un precipitato", re.compile(r"si intorbida e sul fondo si deposita un solido")),
    ("Cambia il colore", re.compile(r"divent(?:a|at[ao]) (?:scura|verde|blu scuro|nera)")),
    ("Si liberano calore e luce", re.compile(r"luce|fuoco|fiamma")),
]

# story start → (chemical?, right reason)
TRICKY = {
    "In una pentola sul fornello": (False, "le bollicine sono vapore acqueo, cioè ancora acqua"),
    "Si apre una bottiglia di acqua gassata": (False, "esce il gas che era già sciolto nell'acqua"),
    "Si versa una goccia di inchiostro": (False, "l'inchiostro si mescola all'acqua senza cambiare"),
    "Si accende una lampadina": (False, "il filamento resta lo stesso metallo di prima"),
    "Si lascia evaporare al sole": (False, "i cristalli sono il sale che era sciolto nell'acqua"),
    "Si versa dell'aceto sul bicarbonato": (True, "il gas è diossido di carbonio, una sostanza nuova"),
    "Si immerge un chiodo di ferro": (True, "si formano sostanze nuove, come il rame sul chiodo"),
    "Si soffia con una cannuccia": (True, "si forma un solido nuovo, il carbonato di calcio"),
    "Si avvicina una fiamma a un nastro di magnesio": (True, "la polvere bianca è una sostanza nuova, un ossido"),
    "Il latte lasciato per giorni": (True, "si formano sostanze nuove, come un acido"),
}


def split_list(text):
    """ "Zinco e acido cloridrico" → {"zinco", "acido cloridrico"}; "A, b e c" → {"a", "b", "c"}."""
    text = text[0].lower() + text[1:]
    head, _, last = text.rpartition(" e ")
    items = [last] if not head else [*head.split(", "), last]
    # "acido cloridrico" and the like contain no " e "; names never do
    return set(items)


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quale di queste trasformazioni è (chimica|fisica)\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    kind = m.group(1)
    for o in sample["answer"]["options"]:
        t = option_text(o["latex"])
        if t not in CHEMICAL and t not in PHYSICAL:
            errs.append(f"unknown situation {t!r}")
    target = CHEMICAL if kind == "chimica" else PHYSICAL
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) in target, errs)
    return kind


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.*) Quali sono i (reagenti|prodotti)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    story, word = m.group(1), m.group(2)
    keys = [k for k in REACTIONS if story.startswith(k)]
    if len(keys) != 1:
        errs.append(f"reaction not recognised: {story!r}")
        return None
    reag, prod = REACTIONS[keys[0]]
    for x in reag | prod:
        if x not in story:
            errs.append(f"{x!r} not in the story")
    want = reag if word == "reagenti" else prod
    check_choice(sample["answer"], lambda o: split_list(option_text(o["latex"])) == want, errs)
    return word


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.*) Quale indizio di una reazione chimica si osserva\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    story = m.group(1)
    hits = [c for c, rule in CLUE_RULES if rule.search(story)]
    if len(hits) != 1:
        errs.append(f"clues found {hits} in {story!r}")
        return None
    if sorted(option_text(o["latex"]) for o in sample["answer"]["options"]) != sorted(CLUES):
        errs.append("the options are not the four clues")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == hits[0], errs)
    return hits[0]


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.*) Si è formata una sostanza nuova\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    keys = [k for k in TRICKY if m.group(1).startswith(k)]
    if len(keys) != 1:
        errs.append(f"situation not recognised: {m.group(1)!r}")
        return None
    chem, reason = TRICKY[keys[0]]
    right = ("Sì: " if chem else "No: ") + reason
    opts = [option_text(o["latex"]) for o in sample["answer"]["options"]]
    if not all(re.match(r"(Sì|No): ", o) for o in opts):
        errs.append("options do not start with Sì or No")
    # two answers each way for a physical change; for a chemical one, the right "Sì" and one wrong
    if sum(o.startswith("Sì") for o in opts) != 2:
        errs.append(f"expected two options with Sì: {opts}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == right, errs)
    return "chimica" if chem else "fisica"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, errs)
    except Exception as e:  # noqa: BLE001
        errs.append(f"checker error: {e!r}")
        kind = None
    return errs, kind
