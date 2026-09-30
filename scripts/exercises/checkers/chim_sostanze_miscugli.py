"""Checker for chim-sostanze-miscugli (specs/exercises/chim-sostanze-miscugli.md), written from the spec and the lesson
16-chim-sostanze-miscugli.md, not from the generator.

- Levels 1 and 2: every material is classified with the checker's own list (the lesson's examples and a few more);
  exactly one option is of the class asked, and in level 2 a pure substance is among the distractors.
- Level 3: the scene's four boxes are read: one kind of particle is a pure substance; with two kinds, each particle's
  two nearest neighbours are looked at, and the box is homogeneous when at most 75 % of those links join particles of
  the same kind, heterogeneous from 78 % up (in between is an error). Exactly one box is of the kind asked.
- Level 4: a sample that starts and ends melting at the same temperature can be pure, any other is a mixture.
- Level 5: phases = the water (with what is dissolved in it) plus one for each thing that stays separate (ice, oil,
  iron filings, copper coins, mercury); components = the substances (ice is water).
"""
import math
import re

from checkers._chim_stati_soluzioni import right_text, setup, texts

CASE_RANGES = {
    1: {"pura": (0.50, 0.70), "miscuglio": (0.30, 0.50)},
    2: {"omogeneo": (0.40, 0.60), "eterogeneo": (0.40, 0.60)},
    3: {"pura": (0.25, 0.42), "omogeneo": (0.25, 0.42), "eterogeneo": (0.25, 0.42)},
    5: {"fasi": (0.50, 0.70), "componenti": (0.30, 0.50)},
}

PURE = {"acqua distillata", "ossigeno", "rame", "ferro", "alluminio", "cloruro di sodio", "saccarosio", "anidride carbonica", "elio", "mercurio", "etanolo puro"}
HOMOGENEOUS = {"acqua di mare filtrata", "acqua zuccherata", "aria filtrata", "ottone", "bronzo", "aceto", "acqua minerale naturale", "benzina", "tè filtrato"}
HETEROGENEOUS = {"acqua e olio", "acqua e sabbia", "granito", "terriccio", "succo d'arancia con la polpa", "fumo", "nebbia", "maionese", "panna montata", "latte", "acqua fangosa"}


def kind_of(name):
    n = name[0].lower() + name[1:]
    return "pura" if n in PURE else "omogeneo" if n in HOMOGENEOUS else "eterogeneo" if n in HETEROGENEOUS else None


def level12(sample, prose, errs, lvl):
    if lvl == 1:
        m = re.fullmatch(r"Quale di questi materiali è (una sostanza pura|un miscuglio)\?", prose)
    else:
        m = re.fullmatch(r"Quale di questi materiali è un miscuglio (omogeneo|eterogeneo)\?", prose)
    if not m:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
        return None
    asked = {"una sostanza pura": "pura", "un miscuglio": "miscuglio"}.get(m.group(1), m.group(1))
    ts = texts(sample)
    kinds = [kind_of(x) for x in ts]
    if None in kinds:
        errs.append(f"unknown material in {ts}")
        return asked
    match = [x for x, k in zip(ts, kinds) if (k == asked) or (asked == "miscuglio" and k != "pura")]
    if len(match) != 1:
        errs.append(f"{len(match)} options of the class asked: {match}")
        return asked
    if lvl == 2 and "pura" not in kinds:
        errs.append("no pure substance among the distractors")
    right_text(sample, errs, match[0])
    return asked


def box_kind(ps):
    kinds = {p[2] for p in ps}
    if len(kinds) == 1:
        return "pura"
    if len(kinds) != 2:
        return None
    same = links = 0
    for p in ps:
        near = sorted((math.hypot(q[0] - p[0], q[1] - p[1]), q[2]) for q in ps if q is not p)[:2]
        for _, k in near:
            links += 1
            same += k == p[2]
    share = same / links
    if share <= 0.75:
        return "omogeneo"
    if share >= 0.78:
        return "eterogeneo"
    return None


def level3(sample, prose, errs):
    m = re.fullmatch(r"Ogni colore è un tipo di particelle\. Quale riquadro mostra (una sostanza pura|un miscuglio omogeneo|un miscuglio eterogeneo)\?", prose)
    sc = sample.get("scene") or {}
    if not m or sc.get("type") != "particelle-riquadri":
        errs.append(f"level 3 text or scene not recognised: {prose!r}")
        return None
    asked = {"una sostanza pura": "pura", "un miscuglio omogeneo": "omogeneo", "un miscuglio eterogeneo": "eterogeneo"}[m.group(1)]
    boxes = sc["data"].get("riquadri", [])
    side = sc["data"].get("lato", 2.2)
    if len(boxes) != 4:
        errs.append(f"{len(boxes)} boxes")
        return asked
    kinds = []
    for i, ps in enumerate(boxes):
        for x, y, k in ps:
            if not (0.1 <= x <= side - 0.1 and 0.1 <= y <= side - 0.1) or k not in (0, 1, 2):
                errs.append(f"box {i}: particle {x}, {y}, {k} outside")
        for a in range(len(ps)):
            for b in range(a + 1, len(ps)):
                if math.hypot(ps[a][0] - ps[b][0], ps[a][1] - ps[b][1]) < 0.25:
                    errs.append(f"box {i}: particles overlap")
                    break
        kinds.append(box_kind(ps))
    if None in kinds:
        errs.append(f"a box cannot be classified: {kinds}")
        return asked
    hits = [i for i, k in enumerate(kinds) if k == asked]
    if len(hits) != 1:
        errs.append(f"{len(hits)} boxes of the kind asked")
        return asked
    if any(re.search(r"sostanza|miscuglio|pur|omogene|eterogene", sc.get("alt", "")) for _ in [0]):
        errs.append("the scene's alt gives the answer away")
    right_text(sample, errs, f"Riquadro {'ABCD'[hits[0]]}")
    return asked


def level4(sample, prose, errs, extra):
    m = re.fullmatch(r"Quattro polveri bianche vengono scaldate lentamente\. La tabella dice a che temperatura comincia e a che temperatura finisce la fusione di ciascuna\. Quale (può essere una sostanza pura|è di sicuro un miscuglio)\?", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    pure = m.group(1).startswith("può")
    rows = re.findall(r"\\text\{([ABCD])\} & (\d+)\\,\^\\circ\\text\{C\} & (\d+)\\,\^\\circ\\text\{C\}", extra[0])
    if [r[0] for r in rows] != list("ABCD"):
        errs.append(f"table rows {rows}")
        return None
    fit = [r[0] for r in rows if (int(r[1]) == int(r[2])) == pure]
    for _, a, b in rows:
        if int(b) < int(a) or int(b) - int(a) > 20:
            errs.append(f"interval {a}-{b}")
    if len(fit) != 1:
        errs.append(f"{len(fit)} samples fit")
        return None
    right_text(sample, errs, f"Campione {fit[0]}")
    return "pura" if pure else "miscuglio"


# What can be in the glass: (new phase, substance added).
ADDITIONS = {
    "due cubetti di ghiaccio": (True, None),
    "uno strato d'olio": (True, "olio"),
    "un cucchiaino di sale, che si scioglie tutto": (False, "sale"),
    "un cucchiaino di zucchero, che si scioglie tutto": (False, "zucchero"),
    "un po' di alcol, che si mescola con l'acqua": (False, "alcol"),
    "un po' di limatura di ferro sul fondo": (True, "ferro"),
    "tre monetine di rame": (True, "rame"),
    "qualche goccia di mercurio sul fondo": (True, "mercurio"),
}


def level5(sample, prose, errs):
    m = re.fullmatch(r"In un bicchiere d'acqua si mettono (.+)\. (Quante fasi ha il sistema\?|Quante sostanze diverse, cioè quanti componenti, contiene\?)", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    body = m.group(1)
    found = [a for a in ADDITIONS if a in body]
    rest = body
    for a in found:
        rest = rest.replace(a, "")
    if re.sub(r"[ ,e]", "", rest) or not 2 <= len(found) <= 4:
        errs.append(f"additions not recognised: {body!r}")
        return None
    phases_q = m.group(2).startswith("Quante fasi")
    if not phases_q and "uno strato d'olio" in found:
        errs.append("oil in a question on components")
    phases = 1 + sum(ADDITIONS[a][0] for a in found)
    comps = 1 + sum(ADDITIONS[a][1] is not None for a in found)
    want = phases if phases_q else comps
    word = (("1 fase" if want == 1 else f"{want} fasi") if phases_q else ("1 componente" if want == 1 else f"{want} componenti"))
    for x in texts(sample):
        if not re.fullmatch(r"\d+ (fase|fasi|componente|componenti)", x):
            errs.append(f"option {x!r}")
    right_text(sample, errs, word)
    return "fasi" if phases_q else "componenti"


def check(sample):
    errs, prose, extra = setup(sample)
    lvl = sample["level"]
    if lvl in (1, 2):
        kind = level12(sample, prose, errs, lvl)
    elif lvl == 3:
        kind = level3(sample, prose, errs)
    elif lvl == 4:
        kind = level4(sample, prose, errs, extra)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
        kind = None
    return errs, kind
