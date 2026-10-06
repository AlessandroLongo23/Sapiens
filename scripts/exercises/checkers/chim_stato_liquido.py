"""Checker for chim-stato-liquido (specs/exercises/chim-stato-liquido.md), written from the spec and the lesson
74-chim-stato-liquido.md, not from the generator.

Levels 1 and 2: the facts of the lesson (answer keys below). Level 3: the table of the problem is read, and the most
volatile liquid is the one with the highest vapour pressure, the one with the strongest forces or the highest boiling
temperature the one with the lowest. Levels 4-6: the tables of the lesson are rewritten here; the table shown must be
made of their rows, a liquid boils when its vapour pressure equals the external pressure, 1 atm = 760 mmHg, and a
pressure in atm has three significant figures.
"""
import re
from fractions import Fraction

from checkers._chim3_h import check_choice, check_fact, choice_of, common, plain, prose_and_extra

HALF = (0.40, 0.60)
CASE_RANGES = {
    3: {k: (0.17, 0.33) for k in ("volatile", "forze", "alta", "bassa")},
    4: {"temperatura": HALF, "pressione": HALF},
    5: {"temperatura": HALF, "pressione": HALF},
    6: {"bolle": HALF, "evapora": HALF},
}

KEY_1 = {
    "Che cos'è la viscosità di un liquido?": "La resistenza che oppone allo scorrimento",
    "Come cambia la viscosità di un liquido quando lo scaldi?": "Diminuisce",
    "Da quale di queste cose dipende la viscosità di un liquido?": "Dalle forze intermolecolari",
    "L'olio è più viscoso dell'acqua. È anche più denso?": "No: galleggia sull'acqua",
    "Il mercurio è tredici volte più denso dell'acqua. Com'è la sua viscosità, rispetto a quella dell'acqua?": "Di poco superiore",
    "Perché il glicerolo è più di mille volte più viscoso dell'acqua?": "Forma molti legami a idrogeno",
    "Perché gli oli, che hanno molecole lunghe, scorrono con difficoltà?": "Le molecole si intrecciano tra loro",
    "Due sferette uguali cadono in due liquidi diversi. In quale scende più lentamente?": "Nel liquido più viscoso",
    "Quale di questi liquidi è il più viscoso a temperatura ambiente?": "Il glicerolo",
    "Perché la superficie di un liquido si comporta come una pellicola tesa?": "Le particelle della superficie sono tirate verso l'interno",
    "Che cosa misura la tensione superficiale?": "L'energia per allargare la superficie",
    "Se le forze intermolecolari di un liquido sono più intense, come è la sua tensione superficiale?": "Più alta",
    "Quale di questi liquidi ha la tensione superficiale più alta?": "Il mercurio",
    "Tra l'acqua e l'etanolo, quale ha la tensione superficiale più alta?": "L'acqua",
    "Perché le gocce di mercurio restano quasi sferiche anche su un tavolo?": "Il mercurio ha una tensione superficiale molto alta",
    "Che forma prenderebbe una goccia di liquido se non ci fosse il peso a schiacciarla?": "Una sfera",
    "Come cambia la tensione superficiale di un liquido quando la temperatura sale?": "Diminuisce",
    "Che cos'è la coesione?": "L'attrazione tra le particelle del liquido",
    "Che cos'è l'adesione?": "L'attrazione tra il liquido e il solido",
    "Quando un liquido bagna un solido?": "Quando l'adesione supera la coesione",
    "Perché l'acqua si allarga sul vetro pulito?": "Forma legami a idrogeno con il vetro",
    "Perché l'acqua resta raccolta in gocce sulla cera?": "La coesione vince sull'adesione",
    "Che menisco forma l'acqua in un tubo di vetro sottile?": "Concavo",
    "Che menisco forma il mercurio in un tubo di vetro sottile?": "Convesso",
    "In quale tubo di vetro la capillarità è più marcata?": "Nel tubo più sottile",
}

C100 = r"$100\,^\circ\text{C}$"
KEY_2 = {
    "Quali molecole riescono a sfuggire dalla superficie di un liquido?": "Quelle con più energia cinetica",
    "Perché l'evaporazione raffredda il liquido?": "Se ne vanno le molecole più veloci",
    "Che cos'è un liquido volatile?": "Un liquido che evapora facilmente",
    "Da quale parte del liquido avviene l'evaporazione?": "Solo dalla superficie",
    "A quale temperatura avviene l'evaporazione?": "A qualunque temperatura",
    "Perché l'evaporazione è più rapida a temperatura più alta?": "Più molecole hanno l'energia per sfuggire",
    "Perché liquidi diversi, alla stessa temperatura, evaporano con velocità diverse?": "Hanno forze intermolecolari diverse",
    "Che cos'è la tensione di vapore di un liquido?": "La pressione del vapore in equilibrio con il liquido",
    "In un recipiente chiuso un liquido è in equilibrio con il suo vapore. Che cosa fanno evaporazione e condensazione?": "Continuano tutte e due, alla pari",
    "In un recipiente chiuso, quando liquido e vapore sono in equilibrio, come cambia la quantità di vapore?": "Non cambia più",
    "Da che cosa dipende la tensione di vapore?": "Dal liquido e dalla temperatura",
    "Un cucchiaio d'acqua e un litro d'acqua sono chiusi in due recipienti alla stessa temperatura. In quale la tensione di vapore è più alta?": "È uguale nei due recipienti",
    "Lo stesso liquido, alla stessa temperatura, è chiuso in un recipiente piccolo e in uno grande, e in tutti e due resta del liquido. In quale la tensione di vapore è più alta?": "È uguale nei due recipienti",
    "Come cambia la tensione di vapore di un liquido quando lo scaldi?": "Aumenta, sempre più in fretta",
    "A parità di temperatura, com'è la tensione di vapore di un liquido con forze intermolecolari deboli?": "Alta",
    "Quando bolle un liquido?": "Quando la tensione di vapore uguaglia la pressione esterna",
    "Che cos'è la temperatura di ebollizione normale di un liquido?": "Quella misurata a 1 atm",
    "Da che cosa dipende la temperatura a cui bolle un dato liquido?": "Dalla pressione esterna",
    "In alta montagna la pressione atmosferica è più bassa. A che temperatura bolle l'acqua, rispetto a " + C100 + "?": "A una temperatura più bassa",
    "Nella pentola a pressione, a che temperatura bolle l'acqua, rispetto a " + C100 + "?": "A una temperatura più alta",
    "Perché nella pentola a pressione l'acqua bolle a una temperatura più alta?": "Il vapore trattenuto fa salire la pressione",
    "Di che cosa sono fatte le bolle di un liquido che bolle?": "Del vapore di quel liquido",
    "Che cosa sono le bollicine che compaiono sulle pareti di una pentola d'acqua molto prima dell'ebollizione?": "Aria che era sciolta nell'acqua",
    "Che cosa fa un liquido finché la sua tensione di vapore è minore della pressione esterna?": "Evapora solo dalla superficie",
    "Un liquido molto volatile, alla stessa pressione esterna, bolle a una temperatura alta o bassa?": "Bassa",
}

# The lesson's tables, in mmHg.
WATER = {0: "4.6", 20: "17.5", 25: "23.8", 40: "55.3", 60: "149", 80: "355", 90: "526", 100: "760", 120: "1489"}
WATER = {t: Fraction(p) for t, p in WATER.items()}
AT_20 = {"etere dietilico": 440, "acetone": 185, "etanolo": 44, "acqua": Fraction("17.5")}
ORDER_20 = ["etere dietilico", "acetone", "etanolo", "acqua"]
# (liquid, °C) -> vapour pressure: the two tables, the normal boiling temperatures (760 mmHg), worked example 4
VAPOUR = {("acqua", t): p for t, p in WATER.items()}
VAPOUR.update({(name, 20): Fraction(p) for name, p in AT_20.items()})
VAPOUR.update({("etere dietilico", 35): Fraction(760), ("acetone", 56): Fraction(760), ("etanolo", 78): Fraction(760), ("etanolo", 60): Fraction(351)})

NUM = r"\d+(?:\{,\}\d+)?"
DEG = r"\\,\^\\circ\\text\{C\}"
MMHG = r"\\,\\text\{mmHg\}"
ATM = r"\\,\\text\{atm\}"
REMIND = r" Ricorda che \$1\\,\\text\{atm\} = 760\\,\\text\{mmHg\}\$\."
INTRO_W = r"La tabella dà la tensione di vapore dell'acqua a varie temperature\. "
HEAD_T = r"\text{temperatura} & \text{tensione di vapore} \\ (^\circ\text{C}) & (\text{mmHg}) \\ \hline"
HEAD_L = r"\text{liquido} & \text{tensione di vapore} \\ & (\text{mmHg}) \\ \hline"


def dec(s):
    return Fraction(s.replace("{,}", "."))


def tex(x):
    """A number as the lesson writes it: 526, 17{,}5."""
    x = Fraction(x)
    if x.denominator == 1:
        return str(x.numerator)
    s = f"{float(x):.1f}"
    if Fraction(s) != x:
        raise ValueError(f"{x} has more than one decimal")
    return s.replace(".", "{,}")


def grouped(n):
    s = str(n)
    return s if n < 10000 else re.sub(r"\B(?=(\d{3})+(?!\d))", r"\\,", s)


def sig3(x):
    """x with three significant figures, with the decimal comma; ValueError when the next figure is too close to a 5."""
    x = Fraction(x)
    k = 0
    while x * 10**k < 100:
        k += 1
    y = x * 10**k
    if y >= 1000:
        raise ValueError("number too large")
    frac = y - (y.numerator // y.denominator)
    if abs(frac - Fraction(1, 2)) < Fraction(1, 20):
        raise ValueError(f"rounding of {float(x)} to three figures is too close to call")
    m = int(y + Fraction(1, 2))
    if m == 1000:
        raise ValueError("rounds to four figures")
    digits = str(m).rjust(k + 1, "0")
    return (digits[: len(digits) - k] + ("{,}" + digits[len(digits) - k :] if k else ""))


def read_table(extra, head, errs):
    """The rows of the one table of the problem, as pairs of strings."""
    if len(extra) != 1:
        errs.append(f"expected one table, found {len(extra)}")
        return None
    m = re.fullmatch(r"\\begin\{array\}\{c\|c\} (.*) \\end\{array\}", extra[0])
    if not m or not m.group(1).startswith(head + " "):
        errs.append("table not written as the spec says")
        return None
    rows = [r.split(" & ") for r in m.group(1)[len(head) + 1 :].split(" \\\\ ")]
    if any(len(r) != 2 for r in rows):
        errs.append("table rows are not pairs")
        return None
    return rows


def water_table(extra, errs):
    """The water table shown: {°C: mmHg}; its rows must be the lesson's, in order, at least five."""
    rows = read_table(extra, HEAD_T, errs)
    if rows is None:
        return None
    shown = {}
    for t, p in rows:
        t = int(t)
        if t not in WATER or tex(WATER[t]) != p:
            errs.append(f"row {t} & {p} is not in the lesson's table")
        shown[t] = dec(p)
    if list(shown) != sorted(shown) or len(shown) != len(rows) or len(rows) < 5:
        errs.append("rows of the water table out of order, repeated or too few")
    return shown


def no_table(extra, errs):
    if extra:
        errs.append(f"unexpected lines {extra}")


def level1(sample, prose, extra, errs):
    no_table(extra, errs)
    check_fact(sample, prose, KEY_1, errs)
    return "fatto"


def level2(sample, prose, extra, errs):
    no_table(extra, errs)
    check_fact(sample, prose, KEY_2, errs)
    return "fatto"


QUESTIONS_3 = {
    "Qual è il più volatile?": ("volatile", max, "Sono volatili allo stesso modo"),
    "In quale le forze intermolecolari sono più intense?": ("forze", min, "Le forze sono uguali in tutti"),
    "Quale bolle alla temperatura più alta, a parità di pressione esterna?": ("alta", min, "Bollono alla stessa temperatura"),
    "Quale bolle alla temperatura più bassa, a parità di pressione esterna?": ("bassa", max, "Bollono alla stessa temperatura"),
}


def level3(sample, prose, extra, errs):
    m = re.fullmatch(r"La tabella dà la tensione di vapore di (tre|quattro) liquidi a \$20" + DEG + r"\$\. (.+)", prose)
    if not m or m.group(2) not in QUESTIONS_3:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    kind, pick, same = QUESTIONS_3[m.group(2)]
    rows = read_table(extra, HEAD_L, errs)
    if rows is None:
        return None
    n = {"tre": 3, "quattro": 4}[m.group(1)]
    if [r[0] for r in rows] != [f"\\text{{{c}}}" for c in "ABCD"[:n]]:
        errs.append("the liquids are not A, B, C (and D), in order")
        return None
    vals = [int(r[1]) for r in rows]
    if not all(5 <= v <= 600 for v in vals):
        errs.append(f"vapour pressures outside 5-600 mmHg: {vals}")
    for i in range(n):
        for j in range(i):
            lo, hi = sorted((vals[i], vals[j]))
            if hi < Fraction(13, 10) * lo + 3:
                errs.append(f"vapour pressures too close: {lo} and {hi}")
    want = "Il liquido " + "ABCD"[vals.index(pick(vals))]
    allowed = {"Il liquido " + c for c in "ABCD"[:n]} | ({same} if n == 3 else set())
    opts = choice_of(sample).get("options", [])
    if {plain(o["latex"]) for o in opts} != allowed:
        errs.append(f"options are not the liquids of the table: {[plain(o['latex']) for o in opts]}")
    for o in opts:
        text = plain(o["latex"])
        if o["values"] != [text[-1] if text.startswith("Il liquido ") else "uguali"]:
            errs.append(f"option value {o['values']} does not match {text!r}")
    check_choice(choice_of(sample), lambda o: plain(o["latex"]) == want, errs)
    return kind


def temperature_options(sample, want, errs):
    opts = choice_of(sample).get("options", [])
    for o in opts:
        m = re.fullmatch(r"(\d+)" + DEG, o["latex"])
        if not m or int(m.group(1)) not in WATER or o["values"] != [m.group(1)]:
            errs.append(f"option {o['latex']!r} is not a temperature of the lesson's table with its value")
    check_choice(choice_of(sample), lambda o: o["latex"] == f"{want}\\,^\\circ\\text{{C}}", errs)


def level4(sample, prose, extra, errs):
    shown = water_table(extra, errs)
    if shown is None:
        return None
    m = re.fullmatch(INTRO_W + r"A che temperatura bolle l'acqua se la pressione esterna è \$(" + NUM + ")" + MMHG + r"\$\?", prose)
    if m:
        p = dec(m.group(1))
        at = [t for t, q in shown.items() if q == p]
        if len(at) != 1 or at[0] == 0:
            errs.append(f"{m.group(1)} mmHg is not one row of the table shown (or is the row of 0 °C)")
            return None
        temperature_options(sample, at[0], errs)
        return "temperatura"
    m = re.fullmatch(INTRO_W + r"In un recipiente l'acqua bolle a \$(\d+)" + DEG + r"\$\. Qual è la pressione esterna\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    t = int(m.group(1))
    if t not in shown or t == 0:
        errs.append(f"{t} °C is not a row of the table shown (or is 0 °C)")
        return None
    for o in choice_of(sample).get("options", []):
        mo = re.fullmatch("(" + NUM + ")" + MMHG, o["latex"])
        if not mo or dec(mo.group(1)) not in WATER.values() or Fraction(o["values"][0]) != dec(mo.group(1)):
            errs.append(f"option {o['latex']!r} is not a pressure of the lesson's table with its value")
    check_choice(choice_of(sample), lambda o: o["latex"] == tex(shown[t]) + "\\,\\text{mmHg}", errs)
    return "pressione"


def pressure_in_atm(sample, p, errs):
    """The right option is p / 760 with three figures; the product, and the number in mmHg read as atm, are not."""
    want = sig3(p / 760) + "\\,\\text{atm}"
    opts = choice_of(sample).get("options", [])
    for o in opts:
        if not re.fullmatch(r"\d+(?:\\,\d{3})*(?:\{,\}\d+)?" + ATM, o["latex"]):
            errs.append(f"option {o['latex']!r} is not a pressure in atm")
    check_choice(choice_of(sample), lambda o: o["latex"] == want, errs)


def level5(sample, prose, extra, errs):
    m = re.fullmatch(INTRO_W + r"A che temperatura bolle l'acqua se la pressione esterna è \$(\d+\{,\}\d+)" + ATM + r"\$\?" + REMIND, prose)
    if m:
        shown = water_table(extra, errs)
        if shown is None:
            return None
        p = dec(m.group(1)) * 760
        close = [t for t, q in WATER.items() if abs(q - p) <= q * Fraction(2, 100)]
        exact = [t for t, q in shown.items() if abs(q - p) <= q * Fraction(2, 1000)]
        if len(close) != 1 or exact != close or sig3(WATER[close[0]] / 760) != m.group(1):
            errs.append(f"{m.group(1)} atm does not point to one row of the table shown")
            return None
        temperature_options(sample, close[0], errs)
        return "temperatura"
    ask = r"A quale pressione esterna, in atmosfere, l'(.+) bolle a \$(\d+)" + DEG + r"\$\?" + REMIND
    m = re.fullmatch(INTRO_W + ask, prose)
    if m:
        shown = water_table(extra, errs)
        if shown is None:
            return None
        t = int(m.group(2))
        if m.group(1) != "acqua" or t not in shown:
            errs.append(f"{m.group(1)} at {t} °C is not in the table shown")
            return None
        if shown[t] < 50 or t == 100:
            errs.append("the spec leaves out the rows under 40 °C and the row of 100 °C")
        pressure_in_atm(sample, shown[t], errs)
        return "pressione"
    m = re.fullmatch(r"La tabella dà la tensione di vapore di alcuni liquidi a \$20" + DEG + r"\$\. " + ask, prose)
    if m:
        rows = read_table(extra, HEAD_L, errs)
        if rows is None:
            return None
        names = [re.fullmatch(r"\\text\{(.+)\}", r[0]).group(1) for r in rows]
        if names != [x for x in ORDER_20 if x in names] or len(names) < 3 or any(tex(AT_20[x]) != r[1] for x, r in zip(names, rows)):
            errs.append("the table is not the lesson's table of the liquids at 20 °C")
            return None
        if m.group(1) not in names or m.group(2) != "20":
            errs.append(f"{m.group(1)} at {m.group(2)} °C is not in the table shown")
            return None
        pressure_in_atm(sample, Fraction(AT_20[m.group(1)]), errs)
        return "pressione"
    m = re.fullmatch(r"L'(.+) ha una tensione di vapore di \$(" + NUM + ")" + MMHG + r"\$ a \$(\d+)" + DEG + r"\$\. " + ask, prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    no_table(extra, errs)
    name, p, t = m.group(1), dec(m.group(2)), int(m.group(3))
    if (m.group(4), m.group(5)) != (name, m.group(3)) or VAPOUR.get((name, t)) != p:
        errs.append(f"{name} at {t} °C with {p} mmHg is not a datum of the lesson")
        return None
    pressure_in_atm(sample, p, errs)
    return "pressione"


BOILS = "Bolle: la tensione di vapore uguaglia la pressione esterna"
EVAPORATES = "Evapora ma non bolle: la tensione di vapore è minore della pressione esterna"
NOTHING = "Non evapora né bolle: un liquido evapora solo se bolle"


def level6(sample, prose, extra, errs):
    no_table(extra, errs)
    m = re.fullmatch(
        r"L'(.+), a \$(\d+)" + DEG + r"\$, ha una tensione di vapore di \$(" + NUM + ")" + MMHG + r"\$\. È in un recipiente aperto, in un ambiente dove la pressione esterna è \$(" + NUM + ")" + MMHG + r"\$\. Che cosa succede al liquido\?",
        prose,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    name, t, p, outside = m.group(1), int(m.group(2)), dec(m.group(3)), dec(m.group(4))
    if VAPOUR.get((name, t)) != p or (name, t) == ("acqua", 0):
        errs.append(f"{name} at {t} °C with {p} mmHg is not a datum of the lesson the spec allows")
        return None
    if outside == p:
        kind, want = "bolle", BOILS
    elif outside >= p * Fraction(5, 4):
        kind, want = "evapora", EVAPORATES
        if name == "acqua" and outside == 760:
            errs.append("water under 760 mmHg that does not boil: 'it is not at 100 °C' would be a fair answer")
    else:
        errs.append(f"external pressure {outside} neither equal to the vapour pressure {p} nor clearly above it")
        return None
    hundred = "Non bolle: " + ("l'acqua" if name == "acqua" else "un liquido") + " bolle solo a 100 °C"
    values = {BOILS: "bolle", EVAPORATES: "evapora", hundred: "cento", NOTHING: "niente"}
    opts = choice_of(sample).get("options", [])
    if {plain(o["latex"]) for o in opts} != set(values):
        errs.append(f"options are not the four of the spec: {[plain(o['latex']) for o in opts]}")
    for o in opts:
        if o["values"] != [values.get(plain(o["latex"]))]:
            errs.append(f"option value {o['values']} does not match its text")
    check_choice(choice_of(sample), lambda o: plain(o["latex"]) == want, errs)
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("every level is a multiple choice")
    prose, extra = prose_and_extra(sample["problem"])
    try:
        kind = LEVELS[lvl](sample, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError, ZeroDivisionError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
