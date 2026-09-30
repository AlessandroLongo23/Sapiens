"""Checker for chim-modello-particellare (specs/exercises/chim-modello-particellare.md), written from the spec and the
lesson 15-chim-modello-particellare.md, not from the generator.

- Level 1: the sentences are judged with the lesson: in the solid the particles are in contact and vibrate around
  fixed places; in the liquid they are in contact and slide; in the gas they are far apart, attract each other very
  little and run in every direction; they are never at rest, never grow, never melt, and there is no air between
  them. Exactly one option is true of the state named.
- Level 2: each phenomenon of the lesson has its explanation; the other options must be among the wrong ones listed
  here, written again from the lesson's warnings.
- Level 3: T = t + 273 and t = T - 273.
- Level 4: every temperature is brought to kelvin; the right sample has the largest (smallest) one, at least 8 K from
  the others; both scales appear.
"""
import re

from checkers._chim_stati_soluzioni import right_text, setup, texts

CASE_RANGES = {
    1: {"solido": (0.25, 0.42), "liquido": (0.25, 0.42), "aeriforme": (0.25, 0.42)},
    3: {"kelvin": (0.40, 0.60), "celsius": (0.40, 0.60)},
    4: {"trappola": (0.60, 0.80), "diretto": (0.20, 0.40)},
}

# For each sentence, the states it is true of (an empty set: never true).
TRUTH = {
    "Vibrano attorno a posizioni fisse": {"solido"},
    "Non possono cambiare posto": {"solido"},
    "Sono a contatto ma scorrono le une sulle altre": {"liquido"},
    "Restano a contatto ma cambiano posto di continuo": {"liquido"},
    "Sono lontane e corrono in tutte le direzioni": {"aeriforme"},
    "Tra loro c'è moltissimo spazio vuoto": {"aeriforme"},
    "Si attraggono pochissimo": {"aeriforme"},
    "Sono ferme": set(),
    "Diventano più grandi quando si scaldano": set(),
    "Tra loro c'è aria": set(),
    "Si fondono quando il solido fonde": set(),
}
EXAMPLES = {
    "solido": ["un cubetto di ghiaccio", "un chiodo di ferro", "un cristallo di sale", "una moneta di rame"],
    "liquido": ["l'acqua di un bicchiere", "l'alcol di un flacone", "l'olio di una bottiglia"],
    "aeriforme": ["l'aria di una stanza", "l'elio di un palloncino", "il vapore sopra una pentola che bolle"],
}

# Phenomenon (its first words) -> (id, the explanation, the wrong explanations allowed).
PHENOMENA = {
    "Una siringa piena d'aria": ("siringa", "Tra le particelle dell'aria c'è molto spazio vuoto", {
        "Le particelle dell'aria si schiacciano", "Le particelle dell'aria sono più piccole di quelle dell'acqua",
        "Le particelle dell'acqua sono ferme", "Tra le particelle dell'acqua c'è aria"}),
    "Il profumo spruzzato": ("profumo", "Le particelle del profumo si muovono e si mescolano con quelle dell'aria", {
        "Le particelle del profumo si ingrandiscono fino a riempire la stanza", "Le particelle del profumo si moltiplicano",
        "Il profumo spinge via l'aria della stanza", "Le particelle dell'aria sono ferme e il profumo scivola tra loro"}),
    "Una goccia d'inchiostro": ("inchiostro", "A temperatura più alta le particelle si muovono più in fretta", {
        "Nell'acqua calda le particelle d'inchiostro si rimpiccioliscono", "Il calore scioglie le particelle d'inchiostro",
        "Nell'acqua fredda le particelle sono ferme", "Nell'acqua calda le particelle d'acqua diventano più grandi"}),
    "L'acqua prende la forma": ("forma", "Le particelle del liquido scorrono le une sulle altre", {
        "Tra le particelle dell'acqua c'è moltissimo spazio vuoto", "Le particelle dell'acqua sono morbide e si deformano",
        "Le particelle dell'acqua non si attraggono affatto", "Le particelle dell'acqua sono ferme"}),
    "Un cubetto di ghiaccio": ("ghiaccio", "Le particelle del solido restano legate a posizioni fisse", {
        "Le particelle del ghiaccio sono ferme", "Le particelle del ghiaccio sono dure e fredde",
        "Tra le particelle del ghiaccio c'è aria che le sostiene", "Le particelle del ghiaccio sono più grandi di quelle dell'acqua"}),
    "Una sfera di metallo": ("dilatazione", "Le particelle vibrano di più e si allontanano un po' tra loro", {
        "Le particelle del metallo diventano più grandi", "Il calore aggiunge nuove particelle al metallo",
        "Le particelle del metallo si fermano", "Il metallo scaldato diventa liquido"}),
    "Mescolando 50 mL": ("volumi", "Le particelle di un liquido occupano in parte gli spazi tra quelle dell'altro", {
        "Una parte dell'alcol sparisce", "Le particelle si rimpiccioliscono quando si mescolano",
        "Una parte dell'acqua diventa alcol", "Le particelle d'acqua si schiacciano"}),
    "Un pallone gonfiato": ("pallone", "Le particelle dell'aria urtano di continuo la parete interna", {
        "Le particelle dell'aria sono attaccate alla gomma", "Le particelle dell'aria sono ferme e fanno da sostegno",
        "Le particelle dell'aria si sono ingrandite", "L'aria dentro il pallone è più leggera"}),
    "Al microscopio": ("browniano", "Sono urtati di continuo dalle particelle d'acqua in movimento", {
        "I granelli sono vivi e nuotano", "La luce del microscopio spinge i granelli", "I granelli si respingono tra loro",
        "Le particelle dei granelli si dilatano e si restringono"}),
    "Una pozzanghera": ("pozzanghera", "Le particelle più veloci sfuggono dalla superficie del liquido", {
        "Le particelle d'acqua si rimpiccioliscono fino a sparire", "Il freddo distrugge le particelle d'acqua",
        "L'acqua si trasforma in aria", "Il terreno scioglie le particelle d'acqua"}),
}


def level1(sample, prose, errs):
    m = re.fullmatch(r"(.+) è un (solido|liquido|aeriforme)\. Quale frase descrive le sue particelle\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    what, state = m.group(1), m.group(2)
    if what[0].lower() + what[1:] not in EXAMPLES[state]:
        errs.append(f"{what!r} is not an example of a {state}")
    ts = texts(sample)
    if any(x not in TRUTH for x in ts):
        errs.append(f"unknown sentence in {ts}")
        return state
    right = [x for x in ts if state in TRUTH[x]]
    if len(right) != 1:
        errs.append(f"{len(right)} true sentences: {right}")
        return state
    if not any(TRUTH[x] == set() for x in ts):
        errs.append("no misconception among the options")
    right_text(sample, errs, right[0])
    return state


def level2(sample, prose, errs):
    if not prose.endswith(" Quale spiegazione dà il modello particellare?"):
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    found = [v for k, v in PHENOMENA.items() if prose.startswith(k)]
    if len(found) != 1:
        errs.append(f"phenomenon not recognised: {prose!r}")
        return None
    pid, right, wrong = found[0]
    ts = texts(sample)
    for x in ts:
        if x != right and x not in wrong:
            errs.append(f"option {x!r} is not an explanation of {pid}")
    right_text(sample, errs, right)
    return pid


def opt_temp(latex):
    m = re.fullmatch(r"(-?\d+)\\,(\\text\{K\}|\^\\circ\\text\{C\})", latex)
    if not m:
        raise ValueError(f"not a temperature: {latex!r}")
    return int(m.group(1)), "K" if "K" in m.group(2) else "C"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Scrivi in (kelvin|gradi Celsius) la temperatura \$(-?\d+)\\,(\\text\{K\}|\^\\circ\\text\{C\})\$\.", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    to, x = m.group(1), int(m.group(2))
    given = "K" if "K" in m.group(3) else "C"
    if (to == "kelvin") != (given == "C"):
        errs.append("conversion to the same scale")
    want = (x + 273, "K") if to == "kelvin" else (x - 273, "C")
    if want[0] < 0 and want[1] == "K":
        errs.append("negative kelvin")
    opts = sample["answer"]["options"]
    try:
        vals = [opt_temp(o["latex"]) for o in opts]
    except ValueError as e:
        errs.append(str(e))
        return None
    if len(set(vals)) != 4 or any(u != want[1] for _, u in vals):
        errs.append(f"options {vals}")
    right = [i for i, v in enumerate(vals) if v == want]
    if len(right) != 1 or sample["answer"]["correct"] != right[0]:
        errs.append(f"the right option {want} is not the one marked")
    return to.split()[-1] if to == "kelvin" else "celsius"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quattro campioni: (.+)\. In quale le particelle hanno l'agitazione media più (grande|piccola)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    items = re.findall(r"([a-z]+) a \$(-?\d+)\\,(\\text\{K\}|\^\\circ\\text\{C\})\$", m.group(1))
    if len(items) != 4:
        errs.append(f"{len(items)} samples")
        return None
    most = m.group(2) == "grande"
    kelvin = {n: int(x) + (0 if "K" in u else 273) for n, x, u in items}
    shown = {n: int(x) for n, x, u in items}
    scales = {("K" if "K" in u else "C") for _, _, u in items}
    if scales != {"K", "C"}:
        errs.append("both scales must appear")
    if any(v <= 0 for v in kelvin.values()):
        errs.append("a temperature at or below absolute zero")
    order = sorted(kelvin.values())
    if any(b - a < 8 for a, b in zip(order, order[1:])):
        errs.append(f"temperatures too close: {order}")
    pick = max if most else min
    right = pick(kelvin, key=kelvin.get)
    by_number = pick(shown, key=shown.get)
    opts = sample["answer"]["options"]
    names = []
    for o in opts:
        mm = re.fullmatch(r"\\text\{([A-Z][a-z]+) a \}(-?\d+)\\,(\\text\{K\}|\^\\circ\\text\{C\})", o["latex"])
        if not mm:
            errs.append(f"option not recognised: {o['latex']!r}")
            return None
        n = mm.group(1).lower()
        if n not in shown or int(mm.group(2)) != shown[n]:
            errs.append(f"option {o['latex']!r} does not match the text")
        names.append(n)
    if sorted(names) != sorted(kelvin):
        errs.append("options are not the four samples")
    if names.count(right) != 1 or sample["answer"]["correct"] != names.index(right):
        errs.append(f"the right sample {right} is not the one marked")
    return "trappola" if by_number != right else "diretto"


def check(sample):
    errs, prose, _ = setup(sample)
    lvl = sample["level"]
    kind = {1: level1, 2: level2, 3: level3, 4: level4}.get(lvl, lambda *a: errs.append(f"unknown level {lvl}"))(sample, prose, errs)
    return errs, kind
