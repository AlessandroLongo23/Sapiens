"""Checker for chim-passaggi-stato (specs/exercises/chim-passaggi-stato.md).

Written from the spec and lesson 19, not from the generator:
- level 1: the two states, or the everyday fact (recognised by its key words), give the change of state;
- level 2: the same, and the lesson's rule: melting, vaporisation and sublimation take heat because the particles
  move apart, the other three give it back because they come together;
- level 3: the four substances and their melting and boiling points are read from the text and checked against the
  lesson's table; the state at the temperature follows from the three zones, and exactly one substance must be in the
  state asked, with no temperature within 5 °C of a change;
- level 4: the states at the two temperatures give the changes, in the order they happen;
- level 5: the situation, recognised by its key words, gives the answer of the lesson.
"""
import re

from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"fatto": (0.4, 0.6), "stati": (0.4, 0.6)},
    3: {"solido": (0.25, 0.42), "liquido": (0.25, 0.42), "aeriforme": (0.25, 0.42)},
    4: {k: (0.09, 0.2) for k in ["nessuno", "F", "E", "FE", "S", "C", "CS"]},
}

NAMES = ["fusione", "solidificazione", "vaporizzazione", "condensazione", "sublimazione", "brinamento"]
BY_STATES = {
    ("solido", "liquido"): "fusione",
    ("liquido", "solido"): "solidificazione",
    ("liquido", "aeriforme"): "vaporizzazione",
    ("aeriforme", "liquido"): "condensazione",
    ("solido", "aeriforme"): "sublimazione",
    ("aeriforme", "solido"): "brinamento",
}
TAKES_HEAT = {"fusione", "vaporizzazione", "sublimazione"}

# key words of the everyday facts
FACT_WORDS = [
    ("cristalli di ghiaccio formati dal vapore", "brinamento"),
    ("strato di ghiaccio dal vapore", "brinamento"),
    ("forma cristalli lucidi sul fondo freddo", "brinamento"),
    ("si appanna", "condensazione"),
    ("rugiada", "condensazione"),
    ("goccioline", "condensazione"),
    ("burro in padella diventa liquido", "fusione"),
    ("neve sul tetto diventa acqua", "fusione"),
    ("il ferro diventa liquido", "fusione"),
    ("pozzanghera si asciuga", "vaporizzazione"),
    ("pentola bolle", "vaporizzazione"),
    ("panni stesi si asciugano", "vaporizzazione"),
    ("senza lasciare liquido", "sublimazione"),
    ("naftalina", "sublimazione"),
    ("diventa un vapore viola senza fondere", "sublimazione"),
    ("nel freezer diventa ghiaccio", "solidificazione"),
    ("si indurisce", "solidificazione"),
    ("ferro fuso", "solidificazione"),
]

TABLE = {
    "azoto": (-210, -196),
    "ossigeno": (-218, -183),
    "etanolo": (-114, 78),
    "acetone": (-95, 56),
    "mercurio": (-39, 357),
    "acqua": (0, 100),
    "naftalene": (80, 218),
    "cloruro di sodio": (801, 1465),
    "ferro": (1538, 2862),
}
DEG = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"


def fact_change(fact, errs):
    hits = {n for k, n in FACT_WORDS if k in fact}
    if len(hits) != 1:
        errs.append(f"fact not recognised: {fact!r}")
        return None
    return hits.pop()


def name_of(o):
    t = option_text(o["latex"]).lower()
    if t not in NAMES:
        raise ValueError(f"not a change of state: {t!r}")
    return t


def level1(sample, prose, errs):
    m = re.fullmatch(r"Come si chiama il passaggio di una sostanza dallo stato (\w+) allo stato (\w+)\?", prose)
    if m:
        right, kind = BY_STATES.get((m.group(1), m.group(2))), "stati"
    else:
        m = re.fullmatch(r"(.+) Quale passaggio di stato avviene\?", prose)
        if not m:
            errs.append(f"level 1 text not recognised: {prose!r}")
            return None
        right, kind = fact_change(m.group(1), errs), "fatto"
    if right:
        check_choice(sample["answer"], lambda o: name_of(o) == right, errs)
    return kind


def level2(sample, prose, errs):
    m = re.fullmatch(r"Durante (?:la |il )(\w+), la sostanza assorbe o cede calore, e perché\?", prose)
    if m:
        change = m.group(1)
    else:
        m = re.fullmatch(r"(.+) Durante questo passaggio di stato, la sostanza assorbe o cede calore, e perché\?", prose)
        if not m:
            errs.append(f"level 2 text not recognised: {prose!r}")
            return None
        change = fact_change(m.group(1), errs)
    if change not in NAMES:
        errs.append(f"unknown change {change!r}")
        return None
    takes = change in TAKES_HEAT

    def read(o):
        mm = re.fullmatch(r"(Assorbe|Cede) calore: le particelle si (allontanano|avvicinano)", option_text(o["latex"]))
        if not mm:
            raise ValueError(f"option not read: {o['latex']!r}")
        return mm.group(1) == "Assorbe", mm.group(2) == "allontanano"

    check_choice(sample["answer"], lambda o: read(o) == (takes, takes), errs)
    return None


def state(x, T):
    tf, te = TABLE[x]
    return "solido" if T < tf else "liquido" if T < te else "aeriforme"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Alla pressione normale: (.+)\. Quale di queste sostanze è (solida|liquida|aeriforme) a " + DEG + r"\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    want = {"solida": "solido", "liquida": "liquido", "aeriforme": "aeriforme"}[m.group(2)]
    T = int(m.group(3))
    subs = re.findall(r"([a-z ]+) \(fonde a " + DEG + r", bolle a " + DEG + r"\)", m.group(1))
    names = [s[0].strip() for s in subs]
    if len(names) != 4 or len(set(names)) != 4:
        errs.append(f"four substances expected: {names}")
        return None
    for x, tf, te in subs:
        x = x.strip()
        if TABLE.get(x) != (int(tf), int(te)):
            errs.append(f"data of {x} differ from the lesson")
            return None
        if min(abs(T - int(tf)), abs(T - int(te))) < 5:
            errs.append(f"{T} °C too close to a change of {x}")
    hit = [x for x in names if state(x, T) == want]
    if len(hit) != 1:
        errs.append(f"{len(hit)} substances {want} at {T}")
        return want
    check_choice(sample["answer"], lambda o: option_text(o["latex"]).lower() == hit[0], errs)
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]).lower() not in names:
            errs.append("option not among the four")
    return want


LABELS = {
    "Nessun passaggio di stato": [],
    "Solo la fusione": ["F"],
    "Solo l'ebollizione": ["E"],
    "La fusione e poi l'ebollizione": ["F", "E"],
    "Solo la solidificazione": ["S"],
    "Solo la condensazione": ["C"],
    "La condensazione e poi la solidificazione": ["C", "S"],
}


def level4(sample, prose, errs):
    m = re.fullmatch(r"Un campione di ([a-z ]+) viene (scaldato|raffreddato) da " + DEG + r" a " + DEG + r", alla pressione normale\. (?:Il|L') ?([a-z ]+) fonde a " + DEG + r" e bolle a " + DEG + r"\. Quali passaggi di stato avvengono\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    x, verb, T1, T2 = m.group(1), m.group(2), int(m.group(3)), int(m.group(4))
    tf, te = int(m.group(6)), int(m.group(7))
    if m.group(5).strip() != x or TABLE.get(x) != (tf, te):
        errs.append(f"data of {x} differ from the lesson")
        return None
    if (verb == "scaldato") != (T2 > T1):
        errs.append("heated but the temperature goes down, or the other way")
    if min(abs(T - c) for T in (T1, T2) for c in (tf, te)) < 5:
        errs.append("a temperature within 5 °C of a change")
    order = ["solido", "liquido", "aeriforme"]
    a, b = order.index(state(x, T1)), order.index(state(x, T2))
    seq = []
    if b > a:
        seq = ["F", "E"][a:b]
    elif b < a:
        seq = ["S", "C"][b:a][::-1]
    key = {(): "nessuno", ("F",): "F", ("E",): "E", ("F", "E"): "FE", ("S",): "S", ("C",): "C", ("C", "S"): "CS"}[tuple(seq)]

    def read(o):
        t = option_text(o["latex"])
        if t not in LABELS:
            raise ValueError(f"option not read: {t!r}")
        return LABELS[t]

    check_choice(sample["answer"], lambda o: read(o) == seq, errs)
    return key


SITUATIONS = [
    ("la pressione atmosferica è più bassa che al livello del mare", "Sotto i 100 °C"),
    ("pentola a pressione", "Sopra i 100 °C"),
    ("una pozzanghera si asciuga in poche ore", "Evapora dalla superficie"),
    ("Che cosa la distingue dall'acqua che evapora da un bicchiere", "Si formano bolle in tutto il liquido"),
    ("si alza la fiamma al massimo", "Resta a 100 °C"),
    ("Uscendo dalla piscina si ha freddo", "L'acqua evapora e prende calore dalla pelle"),
    ("a Napoli, al livello del mare", "A Napoli"),
    ("che condensa sulla mano scotta", "Condensando cede altro calore alla pelle"),
]


def level5(sample, prose, errs):
    hits = [r for k, r in SITUATIONS if k in prose]
    if len(hits) != 1:
        errs.append(f"situation not recognised: {prose!r}")
        return None
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == hits[0], errs)
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    if sample.get("scene"):
        errs.append("unexpected scene")
    return errs, fn(sample, prose, errs)
