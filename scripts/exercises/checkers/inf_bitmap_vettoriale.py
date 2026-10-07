"""Checker for inf-bitmap-vettoriale (specs/exercises/inf-bitmap-vettoriale.md).

Written from the spec and the lesson, not from the generator:
- level 1: the table of the jobs (words of the situation, words of the right choice);
- level 2: the SVG under the question is read here: the circles with their centre, radius and colour, in the order in
  which they are written. Where a circle is comes from its centre, with y growing downwards; of two overlapping
  circles the last written is the one seen whole; a circle is 2r wide and begins at cx - r;
- levels 3 and 4: pixels = inches · dpi, worked out again from the numbers of the text; 1 inch = 2,54 cm;
- level 5: the table of the statements.
"""
import re
from fractions import Fraction

from checkers._inf_sic import check_choice, check_situation, check_statements, common

CASE_RANGES = {
    2: {"dove": (0.32, 0.48), "sopra": (0.22, 0.38), "misura": (0.22, 0.38)},
    3: {"larghezza": (0.42, 0.58), "dimensioni": (0.42, 0.58)},
    4: {"pollici": (0.27, 0.43), "centimetri": (0.27, 0.43), "densità": (0.22, 0.38)},
    5: {"vera": (0.42, 0.58), "falsa": (0.42, 0.58)},
}

JOBS = {
    "striscione": ("striscione largo due metri", "Vettoriale: le forme vengono ricalcolate"),
    "tramonto": ("fotografato un tramonto", "Bitmap: una foto non è fatta di forme"),
    "icona": ("dieci dimensioni diverse", "Vettoriale: un solo file resta netto"),
    "sgranata": ("comparire dei quadretti", "È una bitmap"),
    "peso": ("2000 per 2000 pixel", "Il vettoriale: descrive due forme"),
    "schermata": ("cattura una schermata", "Una bitmap: la schermata è la griglia"),
    "ricalco": ("ricavarne il file vettoriale", "È difficile"),
    "mappa": ("piantina della scuola", "Vettoriale: linee e scritte restano nette"),
    "esporta": ("accetta solo immagini bitmap", "Esportare una bitmap alla misura che serve"),
}

STATEMENTS = {
    "t-ritaglio": (True, "sono identici a prima"),
    "t-rimpicciolire": (True, "si fondono"),
    "t-originale": (True, "conservare l'originale"),
    "t-ingrandire": (True, "vengono calcolati da quelli vicini"),
    "t-dpi": (True, "cambia solo quanto grande"),
    "t-schermo": (True, "dipende dal numero dei suoi pixel"),
    "t-vettoriale": (True, "trasformato in pixel ogni volta"),
    "t-senza-perdita": (True, "i pixel restano gli stessi"),
    "f-dettagli": (False, "compaiono dettagli"),
    "f-recupero": (False, "riportare all'originale"),
    "f-dpi": (False, "diventa più nitida"),
    "f-ritaglio": (False, "ne abbassa la qualità"),
    "f-sgrana": (False, "mostra i suoi pixel"),
    "f-peso": (False, "dipende dalla dimensione a cui lo si mostra"),
    "f-foto": (False, "ingrandibile senza limiti"),
    "f-y": (False, "cresce verso l'alto"),
}

COLOURS = {"red": "rosso", "blue": "blu", "gold": "giallo", "green": "verde", "gray": "grigio", "pink": "rosa"}
NOTE = "Il disegno è largo 100 e alto 100. "


def circles(listing, errs):
    """The circles of the SVG, in the order in which they are written: (cx, cy, r, fill or None)."""
    lines = listing.rstrip("\n").split("\n")
    if lines[0] != '<svg viewBox="0 0 100 100">' or lines[-1] != "</svg>":
        errs.append("the fragment is not an SVG on a grid of 100 by 100")
    if any(len(line) > 42 for line in lines):
        errs.append("a row of the fragment is longer than 42 characters")
    found = re.findall(r'<circle cx="(\d+)" cy="(\d+)" r="(\d+)"(?:\s+fill="(\w+)")?/>', listing)
    if len(found) != listing.count("<circle") or not found:
        errs.append("a circle of the fragment cannot be read")
    out = [(int(cx), int(cy), int(r), fill or None) for cx, cy, r, fill in found]
    for cx, cy, r, _ in out:
        if cx - r < 0 or cx + r > 100 or cy - r < 0 or cy + r > 100:
            errs.append("a circle goes out of the drawing")
    return out


def level2(sample, errs):
    problem, params = sample["problem"], sample["params"]
    if not problem.startswith(NOTE):
        errs.append(f"level 2 text not recognised: {problem!r}")
        return None
    ask = problem[len(NOTE):]
    shapes = circles(sample.get("listing", ""), errs)
    if errs:
        return None
    if ask == "In quale zona del disegno si trova il cerchio?":
        (cx, cy, r, _), = shapes
        if abs(cx - 50) < 15 or abs(cy - 50) < 15:
            errs.append("the circle is too near the middle to say where it is")
        # y grows downwards: a small y is at the top
        zone = f"{'alto' if cy < 50 else 'basso'}-{'sinistra' if cx < 50 else 'destra'}"
        labels = {f"{v}-{h}": f"In {v} a {h}" for v in ("alto", "basso") for h in ("sinistra", "destra")}

        def right(o):
            if labels.get(o["values"][0]) != o["latex"]:
                raise ValueError(f"option {o['latex']!r} is not {o['values'][0]}")
            return o["values"][0] == zone

        check_choice(sample, right, errs)
        return "dove"
    if ask == "I due cerchi si sovrappongono in parte. Quale dei due si vede intero?":
        if len(shapes) != 2:
            errs.append("not two circles")
            return None
        (x1, y1, r1, c1), (x2, y2, r2, c2) = shapes
        d = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
        if not abs(r1 - r2) < d < r1 + r2 or c1 == c2 or c1 not in COLOURS or c2 not in COLOURS:
            errs.append("the two circles do not overlap in part, or have the same colour")
            return None
        if (params.get("first"), params.get("second")) != (c1, c2):
            errs.append("params do not carry the two colours")

        def right(o):
            said = re.fullmatch(r"Quello (\w+): è scritto per (ultimo|primo)", o["latex"])
            if not said:
                return False
            which, pos = said.groups()
            if which != COLOURS[c2 if pos == "ultimo" else c1]:
                raise ValueError(f"option {o['latex']!r} gives the wrong place to the colour")
            return pos == "ultimo"

        check_choice(sample, right, errs)
        return "sopra"
    (cx, cy, r, _), = shapes[:1]
    if len(shapes) != 1:
        errs.append("not one circle")
    if ask == "Quanto è largo il cerchio, nelle unità del disegno?":
        value = 2 * r
    elif ask == "A che distanza dal bordo sinistro del disegno comincia il cerchio?":
        value = cx - r
    else:
        errs.append(f"level 2 question not recognised: {ask!r}")
        return None
    check_choice(sample, lambda o: o["latex"] == str(value), errs)
    return "misura"


def number_of(o, pattern):
    m = re.fullmatch(pattern, o["latex"])
    if not m or o["values"][0] != m.group(1):
        raise ValueError(f"option {o['latex']!r} is not {o['values'][0]}")
    return int(m.group(1))


DENSITIES = {72, 100, 150, 200, 300, 600}


def level3(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r".+ deve essere larga (\d+) pollici sulla carta, con una densità di stampa di (\d+) dpi\. Quanti pixel deve avere in larghezza\?", problem)
    if m:
        w, dpi = int(m.group(1)), int(m.group(2))
        if not 2 <= w <= 12 or dpi not in DENSITIES:
            errs.append(f"{w} inches at {dpi} dpi")
        if params.get("pixels") != w * dpi:
            errs.append("params do not carry the pixels")
        check_choice(sample, lambda o: number_of(o, r"(\d+) pixel") == w * dpi, errs)
        return "larghezza"
    m = re.fullmatch(r"Una stampa deve misurare (\d+) pollici di larghezza e (\d+) di altezza, a (\d+) dpi\. Quanti pixel deve avere l'immagine, larghezza per altezza\?", problem)
    if not m:
        errs.append(f"level 3 text not recognised: {problem!r}")
        return None
    w, h, dpi = (int(x) for x in m.groups())
    if not 2 <= w <= 12 or not 2 <= h <= 10 or w == h or dpi not in DENSITIES:
        errs.append(f"{w} by {h} inches at {dpi} dpi")
    if params.get("pixels") != [w * dpi, h * dpi]:
        errs.append("params do not carry the pixels")

    def right(o):
        said = re.fullmatch(r"\$(\d+) \\times (\d+)\$", o["latex"])
        if not said or o["values"][0] != f"{said.group(1)}x{said.group(2)}":
            raise ValueError(f"option {o['latex']!r} is not {o['values'][0]}")
        return (int(said.group(1)), int(said.group(2))) == (w * dpi, h * dpi)

    check_choice(sample, right, errs)
    return "dimensioni"


def level4(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"Un'immagine larga (\d+) pixel viene stampata a (\d+) dpi\. (Un pollice è 2,54 cm\. Quanti centimetri|Quanti pollici) è larga la stampa\?", problem)
    if m:
        px, dpi = int(m.group(1)), int(m.group(2))
        if px % dpi or dpi not in DENSITIES or not 2 <= px // dpi <= 12:
            errs.append(f"{px} pixels at {dpi} dpi")
        inches = px // dpi
        if (params.get("pixels"), params.get("dpi"), params.get("inches")) != (px, dpi, inches):
            errs.append("params do not carry pixels, dpi and inches")
        if m.group(3) == "Quanti pollici":
            check_choice(sample, lambda o: number_of(o, r"(\d+) pollici") == inches, errs)
            return "pollici"
        cm = inches * Fraction(254, 100)

        def right(o):
            said = re.fullmatch(r"\$(\d+)(?:\{,\}(\d+))?\$ cm", o["latex"])
            if not said or o["values"][0] != said.group(1) + ("," + said.group(2) if said.group(2) else ""):
                raise ValueError(f"option {o['latex']!r} is not {o['values'][0]}")
            return Fraction(said.group(1) + "." + (said.group(2) or "0")) == cm

        check_choice(sample, right, errs)
        return "centimetri"
    m = re.fullmatch(r"Un'immagine larga (\d+) pixel viene stampata in modo da essere larga (\d+) pollici\. Con quale densità è stampata\?", problem)
    if not m:
        errs.append(f"level 4 text not recognised: {problem!r}")
        return None
    px, inches = int(m.group(1)), int(m.group(2))
    if px % inches or px // inches not in DENSITIES:
        errs.append(f"{px} pixels on {inches} inches")
    if (params.get("pixels"), params.get("dpi"), params.get("inches")) != (px, px // inches, inches):
        errs.append("params do not carry pixels, dpi and inches")
    check_choice(sample, lambda o: number_of(o, r"(\d+) dpi") == px // inches, errs)
    return "densità"


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    if (lvl == 2) != ("listing" in sample):
        errs.append("a fragment is shown only at level 2")
    try:
        if lvl == 1:
            kind = check_situation(sample, JOBS, errs)
        elif lvl == 2:
            kind = level2(sample, errs)
        elif lvl == 3:
            kind = level3(sample, errs)
        elif lvl == 4:
            kind = level4(sample, errs)
        elif lvl == 5:
            kind = check_statements(sample, "sulle immagini", STATEMENTS, errs)
        else:
            errs.append(f"unknown level {lvl}")
    except ValueError as e:
        errs.append(str(e))
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
