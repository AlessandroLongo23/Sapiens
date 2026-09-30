"""Checker for chim-acqua-proprieta (specs/exercises/chim-acqua-proprieta.md), written from the spec and the lesson
45-chim-acqua-proprieta.md, not from the generator.

Level 1: the phenomenon is classified by its words (ice floating or breaking things, a frozen lake, the sea and the
sand, an insect or a clip on the water, water rising in paper or thin tubes, sweat and wind), and the right option
must be the lesson's property for it. Level 2: the mass does not change, V = m / 0,917 (three figures). Level 3: the
part under the surface is V · 0,917 / d (three figures), the part above V minus that (two figures). Level 4:
Q = 4,186 · m · Δt in J, the answer in kJ with three figures. Level 5: same heat and mass, c Δt is the same:
Δt_x = Δt_water · 4,186 / c_x, and the other way round; three figures (two for glass, c = 0,84).
"""
import re

from checkers._chim_acqua import Rational, common, exact_dec, one_right, option_text, quantity, quantity_options, text

CASE_RANGES = {
    2: {"massa": (0.40, 0.60), "volume": (0.40, 0.60)},
    3: {"dolce sotto": (0.18, 0.32), "dolce sopra": (0.18, 0.32), "mare sotto": (0.18, 0.32), "mare sopra": (0.18, 0.32)},
    5: {"acqua": (0.40, 0.60), "altra sostanza": (0.40, 0.60)},
}

PROPERTY = {
    "densita": "il ghiaccio è meno denso dell'acqua liquida",
    "quattro": "l'acqua liquida è più densa a $4\\,^\\circ\\text{C}$",
    "calore": "l'acqua ha un calore specifico alto",
    "tensione": "l'acqua ha una tensione superficiale alta",
    "capillarita": "l'acqua sale nei tubi sottili (capillarità)",
    "evaporazione": "per evaporare l'acqua assorbe molto calore",
}
KEYWORDS = [
    ("quattro", r"lago"),
    ("densita", r"ghiaccio galleggia|congelatore|gela nelle crepe|iceberg"),
    ("calore", r"sabbia|città sul mare|termosifoni|borsa dell'acqua calda"),
    ("tensione", r"insetto|graffetta|goccia"),
    ("capillarita", r"tovagliolo|zolletta|tubicino"),
    ("evaporazione", r"[Ss]udare|vento"),
]
ICE = Rational(917, 1000)
C_WATER = Rational(4186, 1000)
SPECIFIC = {"etanolo": "2{,}44", "olio d'oliva": "1{,}97", "alluminio": "0{,}897", "vetro": "0{,}84", "ferro": "0{,}449", "rame": "0{,}385"}


def three(s, errs):
    if not re.fullmatch(r"[1-9]\d\d", s) or s.endswith("0"):
        errs.append(f"datum {s} is not 101-999 without a final zero")
    return Rational(int(s))


def level1(sample, errs):
    m = re.fullmatch(r"(.*) Quale proprietà dell'acqua lo spiega\?", text(sample))
    if not m:
        errs.append("level 1 text not recognised")
        return None
    hits = [k for k, rx in KEYWORDS if re.search(rx, m.group(1))]
    if len(hits) != 1:
        errs.append(f"phenomenon not classified: {m.group(1)!r} -> {hits}")
        return None
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in PROPERTY.values():
            errs.append(f"option is not a property: {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == PROPERTY[hits[0]])
    return hits[0]


DENS = r"\$0\{,\}917\\,\\text\{g/mL\}\$"


def level2(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Una massa di " + quantity("g") + r" d'acqua ghiaccia\. Che volume occupa il ghiaccio\? La densità del ghiaccio è " + DENS + r"\.", s):
        kind = "massa"
    elif m := re.fullmatch(r"In un contenitore ci sono " + quantity("mL") + r" d'acqua, con densità \$1\{,\}00\\,\\text\{g/mL\}\$\. L'acqua ghiaccia: che volume occupa il ghiaccio, con densità " + DENS + r"\?", s):
        kind = "volume"
    else:
        errs.append("level 2 text not recognised")
        return None
    quantity_options(sample, errs, three(m.group(1), errs) / ICE, 3, "mL")
    return kind


def level3(sample, errs):
    m = re.fullmatch(
        r"Un blocco di ghiaccio di " + quantity("cm3") + r" galleggia nell'acqua (dolce|di mare)\. Quanti centimetri cubi del blocco stanno (sotto|sopra) la superficie\? "
        r"Densità del ghiaccio \$0\{,\}917\\,\\text\{g/cm\}\^3\$, dell'acqua (dolce|di mare) " + quantity("gcm3") + r"\.",
        text(sample),
    )
    if not m:
        errs.append("level 3 text not recognised")
        return None
    V = three(m.group(1), errs)
    liquid = m.group(2)
    if m.group(4) != liquid:
        errs.append("two different liquids")
    d = exact_dec(m.group(5))
    if d != (Rational(103, 100) if liquid == "di mare" else 1):
        errs.append(f"density {d} of {liquid}")
    under = V * ICE / d
    if m.group(3) == "sotto":
        quantity_options(sample, errs, under, 3, "cm3")
    else:
        quantity_options(sample, errs, V - under, 2, "cm3")
    return ("mare" if liquid == "di mare" else "dolce") + " " + m.group(3)


def level4(sample, errs):
    m = re.fullmatch(
        r"Quanti kilojoule servono per scaldare " + quantity("g") + r" d'acqua da " + quantity("C") + " a " + quantity("C") + r"\? Il calore specifico dell'acqua è \$4\{,\}186\\,\\text\{J/\(g\}\\cdot\{\}\^\\circ\\text\{C\)\}\$\.",
        text(sample),
    )
    if not m:
        errs.append("level 4 text not recognised")
        return None
    mass = three(m.group(1), errs)
    for x in (m.group(2), m.group(3)):
        if not re.fullmatch(r"\d+\{,\}0", x):
            errs.append(f"temperature {x} not written with one decimal")
    t1, t2 = exact_dec(m.group(2)), exact_dec(m.group(3))
    if not (t2 - t1 >= 10 and t2 <= 95):
        errs.append("temperature rise below 10 degrees or above 95 °C")
    quantity_options(sample, errs, C_WATER * mass * (t2 - t1) / 1000, 3, "kJ")
    return "calore"


def level5(sample, errs):
    s = text(sample)
    tail = r" Calori specifici: acqua \$4\{,\}186\\,\\text\{J/\(g\}\\cdot\{\}\^\\circ\\text\{C\)\}\$, (.+?) " + quantity("cJ") + r"\."
    if m := re.fullmatch(r"Si danno lo stesso calore a masse uguali d'acqua e di (.+?)\. Il campione di (.+?) si scalda di " + quantity("C") + r"\. Di quanto si scalda l'acqua\?" + tail, s):
        name, given, want_water = m.group(1), m.group(3), True
        names, c = {m.group(1), m.group(2), m.group(4)}, m.group(5)
    elif m := re.fullmatch(r"Si danno lo stesso calore a masse uguali d'acqua e di (.+?)\. L'acqua si scalda di " + quantity("C") + r"\. Di quanto si scalda il campione di (.+?)\?" + tail, s):
        name, given, want_water = m.group(1), m.group(2), False
        names, c = {m.group(1), m.group(3), m.group(4)}, m.group(5)
    else:
        errs.append("level 5 text not recognised")
        return None
    if len(names) != 1 or name not in SPECIFIC or SPECIFIC[name] != c:
        errs.append(f"substance or specific heat: {names} {c}")
        return None
    if not re.fullmatch(r"\d\d\{,\}\d", given):
        errs.append(f"given warming {given} not with three figures")
    g = exact_dec(given)
    cx = exact_dec(c)
    truth = g * cx / C_WATER if want_water else g * C_WATER / cx
    if not Rational(1, 2) <= truth <= 400:
        errs.append("result out of range")
    quantity_options(sample, errs, truth, 2 if name == "vetro" else 3, "C")
    return "acqua" if want_water else "altra sostanza"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
