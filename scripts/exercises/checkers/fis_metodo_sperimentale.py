"""Checker for fis-metodo-sperimentale (specs/exercises/fis-metodo-sperimentale.md).

Written from the spec and the lesson, not from the generator. The story is read back from the text:
- level 1: the sentence is classified by its verbs (conclude che, vede che, pensa che, misura, nota che, in this
  order of precedence) and exactly one phase must match;
- level 2: the three quantities that can change, the one that changes and the one measured are read from the story;
  the right answer follows from the question;
- level 3: the table is parsed, the pairs where only the asked quantity changes are found, and the measured values
  are checked against the laws of the spec (pendulum, rolling ball, heated water);
- level 4: the measures and the uncertainty are parsed; the quantity depends when neighbouring measures differ by
  at least five uncertainties, does not when all differ by at most one (anything between is an error); the answer
  is "confermano" when this agrees with the hypothesis. The pendulum periods are checked against the law.
"""
import math
import re

from sympy import Rational

from checkers._fis_grandezze import check_choice, common, option_text, parse_dec, prose_and_extra

CASE_RANGES = {
    1: {k: (0.14, 0.27) for k in ["Osservazione", "Ipotesi", "Esperimento", "Analisi dei dati", "Conclusione"]},
    2: {k: (0.25, 0.42) for k in ["indipendente", "dipendente", "costanti"]},
    3: {"a": (0.40, 0.60), "b": (0.40, 0.60)},
    4: {"conferma": (0.38, 0.62), "smentita": (0.38, 0.62)},
}

PHASES = ["Osservazione", "Ipotesi", "Esperimento", "Analisi dei dati", "Conclusione"]
NAMES = ["Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Elena", "Davide", "Chiara", "Tommaso", "Irene", "Pietro"]
G = 9.8


def da(x):
    for art, joined in [("l'", "dall'"), ("la ", "dalla "), ("lo ", "dallo "), ("il ", "dal "), ("le ", "dalle "), ("gli ", "dagli "), ("i ", "dai ")]:
        if x.startswith(art):
            return joined + x[len(art):]
    return "da " + x


def phase_of(sentence):
    rules = [("conclude che", "Conclusione"), ("vede che", "Analisi dei dati"), ("pensa che", "Ipotesi"), ("misura", "Esperimento"), ("nota che", "Osservazione")]
    for key, phase in rules:
        if key in sentence:
            return phase
    return None


def lower_first(s):
    return s[0].lower() + s[1:] if s else s


def level1(sample, prose, errs):
    m = re.fullmatch(r"(.*) Quale fase del metodo sperimentale descrive la frase\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    sentence = m.group(1)
    name = sentence.split(" ")[0]
    if name not in NAMES:
        errs.append(f"unknown name {name!r}")
    phase = phase_of(sentence)
    if phase is None:
        errs.append(f"no phase verb in {sentence!r}")
        return None
    # the verbs of a later rule must not be in a sentence of an earlier one (one phase per sentence)
    keys = ["conclude che", "vede che", "pensa che", "nota che"]
    if sum(k in sentence for k in keys) > 1:
        errs.append(f"sentence with two phase verbs: {sentence!r}")
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in PHASES or o["values"] != [option_text(o["latex"])]:
            errs.append(f"option {o['latex']!r} is not a phase")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == phase, errs)
    return phase


def level2(sample, prose, errs):
    m = re.fullmatch(
        r"(\w+) studia (.+?); le grandezze che può cambiare sono (.+?), (.+?) e (.+?)\. Vuole sapere se (.+?) dipende (.+?): (.+?) e ogni volta misura (.+?)\. (Qual è la variabile indipendente\?|Qual è la variabile dipendente\?|Quali grandezze deve tenere costanti\?)",
        prose,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    three = [m.group(3), m.group(4), m.group(5)]
    dep = m.group(6)
    if m.group(9) != dep:
        errs.append("the measured quantity is named in two ways")
    indep = [x for x in three if da(x) == m.group(7)]
    if len(indep) != 1:
        errs.append(f"the changed quantity {m.group(7)!r} is not one of {three}")
        return None
    indep = indep[0]
    controls = sorted(x for x in three if x != indep)
    q = m.group(10)
    if "indipendente" in q:
        kind, right = "indipendente", {indep}
    elif "dipendente" in q:
        kind, right = "dipendente", {dep}
    else:
        kind, right = "costanti", set(controls)
    allowed = set(three) | {dep}

    def names(o):
        text = lower_first(option_text(o["latex"]))
        if kind != "costanti":
            return {text}
        for x in allowed:
            for y in allowed:
                if x != y and text == f"{x} e {y}":
                    return {x, y}
        raise ValueError(f"not a pair of quantities: {text!r}")

    for o in sample["answer"]["options"]:
        try:
            got = names(o)
            if not got <= allowed:
                errs.append(f"option {o['latex']!r} names a quantity of another experiment")
        except ValueError as e:
            errs.append(str(e))
    check_choice(sample["answer"], lambda o: names(o) == right, errs)
    return kind


SYMBOLS = {"la massa della pallina": "m", "la lunghezza del filo": "L", "l'inclinazione del piano": "\\alpha", "la massa d'acqua": "m", "la temperatura iniziale dell'acqua": "T_0"}


def cell(s):
    """A table cell: 0{,}50\\,\\text{m}, 10^\\circ, 30\\,^\\circ\\text{C} -> its number."""
    s = s.strip()
    m = re.fullmatch(r"(.+?)(?:\\,\\text\{\w+\}|\^\\circ|\\,\^\\circ\\text\{C\})", s)
    if not m:
        raise ValueError(f"cell {s!r}")
    return float(parse_dec(m.group(1)))


def level3(sample, prose, extra, errs):
    m = re.fullmatch(r"(\w+) ha fatto quattro prove con (.+?)\. Quali due prove deve confrontare per sapere se (.+?) dipende (.+?)\?", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    what, dep, asked = m.group(2), m.group(3), m.group(4)
    t = re.fullmatch(r"\\begin\{array\}\{c\|c\|c\|c\} \\text\{prova\} & (.+?) & (.+?) & (.+?) \\\\ \\hline (.+) \\end\{array\}", extra[0])
    if not t:
        errs.append("table not recognised")
        return None
    sa, sb, sy = t.group(1), t.group(2), t.group(3)
    rows = []
    for k, r in enumerate(t.group(4).split(" \\\\ ")):
        c = [x.strip() for x in r.split("&")]
        if c[0] != str(k + 1):
            errs.append(f"row {k + 1} numbered {c[0]}")
        rows.append((cell(c[1]), cell(c[2]), cell(c[3])))
    if len(rows) != 4 or len({(r[0], r[1]) for r in rows}) != 4 or len({r[0] for r in rows}) != 2 or len({r[1] for r in rows}) != 2:
        errs.append("the four trials are not the four combinations of two values")
    name = [n for n in SYMBOLS if da(n) == asked]
    if len(name) != 1:
        errs.append(f"asked quantity {asked!r} unknown")
        return None
    sym = SYMBOLS[name[0]]
    if sym not in (sa, sb) or (sym == "m" and sa != "m"):
        errs.append(f"asked quantity {sym} is not a column")
        return None
    col = 0 if sa == sym else 1
    # the law behind the measured values
    for a, b, y in rows:
        if "pendolo" in what:
            law = 2 * math.pi * math.sqrt(b / G)
        elif "piano" in what:
            law = math.sqrt(14 * 1.0 / (5 * G * math.sin(math.radians(b))))
        else:
            law = None
        if law is not None and abs(y - law) > 0.011 * law + 0.006:
            errs.append(f"measured {y} far from the law {law:.3f}")
    if "acqua" in what:
        ratios = [y / (a * (100 - b)) for a, b, y in rows]
        if max(ratios) / min(ratios) > 1.02:
            errs.append("heating times not proportional to m(100 - T0)")
    if dep != ("il periodo" if "pendolo" in what else "il tempo di discesa" if "piano" in what else "il tempo per arrivare all'ebollizione"):
        errs.append(f"measured quantity {dep!r} does not fit the experiment")

    def pair(o):
        mm = re.fullmatch(r"prove (\d) e (\d)", option_text(o["latex"]))
        x, y = int(mm.group(1)) - 1, int(mm.group(2)) - 1
        if o["values"] != [f"{x + 1}-{y + 1}"] or not x < y:
            raise ValueError("option values do not match its text")
        return x, y

    def good(o):
        x, y = pair(o)
        return rows[x][col] != rows[y][col] and rows[x][1 - col] == rows[y][1 - col]

    check_choice(sample["answer"], good, errs)
    return "a" if col == 0 else "b"


def level4(sample, prose, errs):
    m = re.fullmatch(r"(\w+) controlla l'ipotesi che (.+?) (non )?dipenda (.+?)\. (.+) di \$([^$]+)\$, \$([^$]+)\$ e \$([^$]+)\$, con un'incertezza di \$([^$]+)\$\. Che cosa dicono i dati\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    claim_depends = m.group(3) is None
    story = m.group(5)
    vals = []
    units = set()
    for g in (6, 7, 8, 9):
        mm = re.fullmatch(r"(.+?)\\,\\text\{(\w+)\}", m.group(g))
        if not mm:
            errs.append(f"measure {m.group(g)!r} without unit")
            return None
        vals.append(parse_dec(mm.group(1)))
        units.add(mm.group(2))
    if len(units) != 1:
        errs.append(f"measures in different units {units}")
    ys, u = vals[:3], vals[3]
    diffs = [abs(ys[1] - ys[0]), abs(ys[2] - ys[1])]
    if max(ys) - min(ys) <= u:
        depends = False
    elif min(diffs) >= 5 * u:
        depends = True
    else:
        errs.append(f"measures {ys} with uncertainty {u}: neither within one nor five uncertainties apart")
        return None
    # the pendulum: periods from the law
    if "fili lunghi" in story:
        lens = [int(x) for x in re.findall(r"\$(\d+)\\,\\text\{cm\}\$", story)]
        for L, y in zip(lens, ys):
            if abs(float(y) - 2 * math.pi * math.sqrt(L / 100 / G)) > 0.006:
                errs.append(f"period {y} for {L} cm off the law")
    if "filo lungo $1{,}00\\,\\text{m}$" in story:
        for y in ys:
            if abs(float(y) - 2 * math.pi * math.sqrt(1 / G)) > float(u) + 0.006:
                errs.append(f"period {y} for 1 m off the law")
    if "masse di" in story and "allungamenti" in story:
        masses = [int(x) for x in re.findall(r"\$(\d+)\\,\\text\{g\}\$", story)]
        ratios = {y / mm for y, mm in zip(ys, masses)}
        if len(masses) != 3 or len(ratios) != 1 or next(iter(ratios)) not in (Rational(2, 100), Rational(3, 100), Rational(4, 100)):
            errs.append(f"spring stretches {ys} not 0,02-0,04 cm per gram of {masses}")
    if "tempi di fusione" in story and not (ys[1] * 4 == ys[0] * 3 and ys[2] * 2 == ys[0]):
        errs.append(f"melting times {ys} not t, 3t/4, t/2")
    agree = depends == claim_depends
    right = "I dati confermano l'ipotesi" if agree else "I dati smentiscono l'ipotesi"
    texts = {option_text(o["latex"]) for o in sample["answer"]["options"]}
    if not texts <= {"I dati confermano l'ipotesi", "I dati smentiscono l'ipotesi", "I dati la dimostrano per sempre", "I dati non dicono niente"}:
        errs.append(f"unexpected options {texts}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == right, errs)
    return "conferma" if agree else "smentita"


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    lvl = sample["level"]
    if lvl != 3 and extra:
        errs.append("unexpected non-prose lines")
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, errs)
    elif lvl == 3:
        kind = level3(sample, prose, extra, errs)
    elif lvl == 4:
        kind = level4(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
