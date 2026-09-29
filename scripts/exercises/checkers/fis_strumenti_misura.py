"""Checker for fis-strumenti-misura (specs/exercises/fis-strumenti-misura.md).

Written from the spec and the lesson: the reading and the instrument are read back from the text and from the data of
the scene (the drawing the student reads), the answer is recomputed with the lesson's sensitivities (exact rationals),
and the scene is checked against the text (the kind of vernier, the cylinder's window, the meniscus away from its
edges). Level 2 checks every instrument of the options against the lesson's table and that only one fits.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import canonical_dec, check_choice, common, fmt_dec, option_text, parse_dec, prose_and_extra, split_unit

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in ["display", "scala", "portata"]},
    2: {"scrittura": (0.40, 0.60), "strumento": (0.40, 0.60)},
    3: {k: (0.25, 0.42) for k in ["righello", "righello-spostato", "cilindro"]},
}

READERS = {"un righello": ("cm", Rational(1, 10)), "un calibro con il nonio decimale": ("mm", Rational(1, 10)), "un calibro con il nonio ventesimale": ("mm", Rational(1, 20)), "un micrometro": ("mm", Rational(1, 100)), "una bilancia elettronica": ("g", Rational(1, 10)), "un cilindro graduato": ("mL", 2)}
MM = {"mm": 1, "cm": 10, "m": 1000}
INSTRUMENTS = {"righello": ((30, "cm"), (1, "mm")), "metro a nastro": ((5, "m"), (1, "mm")), "rotella metrica": ((20, "m"), (1, "cm")), "calibro ventesimale": ((15, "cm"), (Rational(1, 20), "mm")), "micrometro": ((25, "mm"), (Rational(1, 100), "mm"))}
PRECISION = {"al centesimo di millimetro": Rational(1, 100), "al ventesimo di millimetro": Rational(1, 20), "al decimo di millimetro": Rational(1, 10), "al millimetro": 1, "al centimetro": 10}
CYLINDERS = {(10, 1, 5), (25, 5, 10), (50, 10, 10), (100, 10, 10), (100, 10, 5), (250, 50, 25), (250, 10, 5), (500, 50, 10), (1000, 100, 10)}


def decimals(r):
    k = 0
    while (Rational(r) * 10**k).q != 1:
        k += 1
        if k > 15:
            raise ValueError(f"{r} is not a terminating decimal")
    return k


def with_unit(tex):
    """'12{,}3\\,\\text{g}' or '36{,}8\\,^\\circ\\text{C}' -> (value string, unit)."""
    m = re.fullmatch(r"(.+?)\\,\^\\circ\\text\{C\}", tex.strip())
    if m:
        return m.group(1), "°C"
    return split_unit(tex)


def pm_option(latex):
    """'(12{,}3 \\pm 0{,}1)\\,\\text{cm}' -> (value, uncertainty, unit, value string, uncertainty string)."""
    m = re.fullmatch(r"\((.+?) \\pm (.+?)\)\\,\\text\{(\w+)\}", latex)
    if not m:
        raise ValueError(f"not a measure with uncertainty: {latex!r}")
    return parse_dec(m.group(1)), parse_dec(m.group(2)), m.group(3), m.group(1), m.group(2)


def is_measure(o, x, s, unit):
    """The right writing: value x and uncertainty s, both with the decimals of s (or of x when more), in `unit`."""
    v, u, un, vs, us = pm_option(o["latex"])
    digits = max(decimals(s), decimals(x))
    return un == unit and v == x and u == s and vs == fmt_dec(x, digits) and us == fmt_dec(s, digits)


def same_form(sample, errs):
    """Levels 3-5: every option written with the answer's decimals."""
    forms = set()
    for o in sample["answer"]["options"]:
        v, u, un, vs, us = pm_option(o["latex"])
        d = len(vs.split("{,}")[1]) if "{,}" in vs else 0
        e = len(us.split("{,}")[1]) if "{,}" in us else 0
        forms.add((d, e, un))
    if len(forms) != 1:
        errs.append(f"options in different forms {forms}")


def level1(sample, prose, errs):
    ch = sample["answer"]
    m = re.fullmatch(r"(Una bilancia elettronica|Un cronometro digitale|Un termometro digitale) mostra \$(.+?)\$\. Qual è la sua sensibilità\?", prose)
    if m:
        num, u = with_unit(m.group(2))
        x = canonical_dec(num)
        expected_unit = {"Una bilancia elettronica": "g", "Un cronometro digitale": "s", "Un termometro digitale": "°C"}[m.group(1)]
        if u != expected_unit:
            errs.append("display in the wrong unit")
        s = Rational(1, 10 ** decimals(x))

        def val(o):
            n, uu = with_unit(o["latex"])
            if uu != u:
                raise ValueError("wrong unit")
            return canonical_dec(n)

        check_choice(ch, lambda o: val(o) == s, errs)
        return "display"
    m = re.fullmatch(r"(In un cilindro graduato|Sulla scala di un termometro|Sulla scala di una bilancia pesapersone) tra la tacca numerata \$(.+?)\$ e quella numerata \$(.+?)\$ ci sono \$(\d+)\$ intervalli\. Qual è la sensibilità dello strumento\?", prose)
    if m:
        (a, u1), (b, u2) = with_unit(m.group(2)), with_unit(m.group(3))
        a, b, n = canonical_dec(a), canonical_dec(b), int(m.group(4))
        if u1 != u2 or b <= a or n not in (5, 10):
            errs.append("scale data out of the spec")
        s = (b - a) / n

        def val(o):
            nn, uu = with_unit(o["latex"])
            if uu != u1:
                raise ValueError("wrong unit")
            return canonical_dec(nn)

        check_choice(ch, lambda o: val(o) == s, errs)
        return "scala"
    m = re.fullmatch(r"Un cilindro graduato ha la tacca più alta con il numero \$(.+?)\$; le tacche sono numerate ogni \$(.+?)\$ e tra due numeri vicini ci sono \$(\d+)\$ intervalli\. Quanto valgono la portata e la sensibilità\?", prose)
    if m:
        P, lab, ints = canonical_dec(split_unit(m.group(1))[0]), canonical_dec(split_unit(m.group(2))[0]), int(m.group(3))
        if (int(P), int(lab), ints) not in CYLINDERS:
            errs.append("not one of the spec's cylinders")

        def pair(o):
            mm = re.fullmatch(r"\\begin\{gathered\} \\text\{portata \} (.+?) \\\\ \\text\{sensibilità \} (.+?) \\end\{gathered\}", o["latex"])
            (p, pu), (s, su) = split_unit(mm.group(1)), split_unit(mm.group(2))
            if pu != "mL" or su != "mL":
                raise ValueError("not in mL")
            return canonical_dec(p), canonical_dec(s)

        check_choice(ch, lambda o: pair(o) == (P, lab / ints), errs)
        return "portata"
    errs.append(f"level 1 text not recognised: {prose!r}")
    return None


def instrument(o):
    mm = re.fullmatch(r"\\begin\{gathered\} \\text\{(.+?)\} \\\\ (.+?),\\ (.+?) \\end\{gathered\}", o["latex"])
    name = mm.group(1)
    (r, ru), (s, su) = split_unit(mm.group(2)), split_unit(mm.group(3))
    if name not in INSTRUMENTS or INSTRUMENTS[name] != ((canonical_dec(r), ru), (canonical_dec(s), su)) or o["values"] != [name]:
        raise ValueError(f"instrument {o['latex']!r} not as in the lesson's table")
    return name


def level2(sample, prose, errs):
    ch = sample["answer"]
    m = re.fullmatch(r"Con (.+?) leggi \$(.+?)\$\. Come si scrive la misura con la sua incertezza\?", prose)
    if m:
        if m.group(1) not in READERS:
            errs.append(f"unknown instrument {m.group(1)!r}")
            return None
        unit, s = READERS[m.group(1)]
        num, u = split_unit(m.group(2))
        x = parse_dec(num)
        if u != unit or num != fmt_dec(x, decimals(s)) or (x / s).q != 1:
            errs.append(f"reading {m.group(2)} not on the instrument's grid")
        check_choice(ch, lambda o: is_measure(o, x, s, unit), errs)
        return "scrittura"
    m = re.fullmatch(r"Devi misurare (.+?), circa \$(.+?)\$, (al .+?)\. Quale strumento usi\? Accanto a ogni strumento ci sono la sua portata e la sua sensibilità\.", prose)
    if m:
        num, u = split_unit(m.group(2))
        size = parse_dec(num) * MM[u]
        prec = PRECISION[m.group(3)]

        def fits(name):
            (r, ru), (s, su) = INSTRUMENTS[name]
            return r * MM[ru] >= size and s * MM[su] <= prec

        check_choice(ch, lambda o: fits(instrument(o)), errs)
        return "strumento"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def level3(sample, prose, errs):
    sc = sample.get("scene") or {}
    data = sc.get("data", {})
    ch = sample["answer"]
    if prose == "Un oggetto è appoggiato su un righello graduato in millimetri, come nella figura. Quanto è lungo?":
        if sc.get("type") != "righello":
            errs.append("scene is not a ruler")
            return None
        a, b = data.get("inizio"), data.get("fine")
        if not (isinstance(a, int) and isinstance(b, int)) or a % 10 or not 15 <= b - a <= 42:
            errs.append(f"ruler data {data} out of the spec")
            return None
        L = Rational(b - a, 10)
        s = Rational(1, 10) if a == 0 else Rational(2, 10)
        if "righello" not in sc.get("alt", ""):
            errs.append("scene alt does not describe a ruler")
        check_choice(ch, lambda o: is_measure(o, L, s, "cm"), errs)
        same_form(sample, errs)
        return "righello" if a == 0 else "righello-spostato"
    if prose == "Nella figura c'è un tratto di un cilindro graduato pieno d'acqua. Quanto vale il volume dell'acqua?":
        if sc.get("type") != "cilindro-graduato":
            errs.append("scene is not a cylinder")
            return None
        lvl, div, every, lo, hi = (data.get(k) for k in ("livello", "divisione", "ogni", "da", "a"))
        if div not in (1, 2, 5) or every % div or lo % every or hi - lo != 20 * div or (lvl - lo) % div:
            errs.append(f"cylinder data {data} out of the spec")
            return None
        if not (lo + 3 * div <= lvl <= hi - 3 * div):
            errs.append("meniscus too close to the edge of the window")
        check_choice(ch, lambda o: is_measure(o, Rational(lvl), Rational(div), "mL"), errs)
        same_form(sample, errs)
        return "cilindro"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def caliper(sample, prose, errs, n):
    name = "decimale" if n == 10 else "ventesimale"
    if prose != f"Nella figura ci sono la scala principale di un calibro, in millimetri con i centimetri numerati, e il nonio {name}; la tacca del nonio che coincide con una tacca della scala principale è segnata con un triangolino. Quanto vale la misura?":
        errs.append(f"level text not recognised: {prose!r}")
        return None
    sc = sample.get("scene") or {}
    data = sc.get("data", {})
    if sc.get("type") != "calibro" or data.get("nonio") != n:
        errs.append(f"scene {sc.get('type')} {data} is not a {name} caliper")
        return None
    r = Rational(str(data.get("lettura")))
    k = (r * n) % n
    if (r * n).q != 1 or k == 0 or not 3 <= int(r) <= 60:
        errs.append(f"reading {r} out of the spec")
        return None
    if f"divisione {k} del nonio" not in sc.get("alt", ""):
        errs.append("scene alt does not name the division")
    check_choice(sample["answer"], lambda o: is_measure(o, r, Rational(1, n), "mm"), errs)
    same_form(sample, errs)
    return name


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    if lvl <= 2 and sample.get("scene"):
        errs.append("a scene where the spec has none")
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, errs)
    elif lvl == 3:
        kind = level3(sample, prose, errs)
    elif lvl == 4:
        kind = caliper(sample, prose, errs, 10)
    elif lvl == 5:
        kind = caliper(sample, prose, errs, 20)
    else:
        return [f"unknown level {lvl}"], None
    return errs, kind
