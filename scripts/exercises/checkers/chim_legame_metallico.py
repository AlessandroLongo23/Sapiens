"""Checker for chim-legame-metallico (specs/exercises/chim-legame-metallico.md), written from the spec and the lesson
66-chim-legame-metallico.md, not from the generator.

The facts of the lesson (answer keys below); an atom of a metal shares its valence electrons, read from the group; the
electrons of the sea in a mass are n · N_A · valence electrons; of two metals the one that shares more electrons, or
with the same electrons the one higher in the group, melts higher (checked against the melting points of the site's
periodic table); the gold in a jewel is its mass times the carats over 24.
"""
import re

from sympy import Rational, floor

from checkers._chim3_f import BY_NAME, N_A, check_choice, check_number, common, dec, is_metal, mass, no_art, option_text, parse_sci, prose_and_extra, valence

CASE_RANGES = {4: {"elettroni": (0.40, 0.60), "dimensioni": (0.40, 0.60)}, 6: {"lega": (0.40, 0.60), "carati": (0.40, 0.60)}}

MODEL = {
    "Nel modello del mare di elettroni, da che cosa è formato un metallo?": "Cationi ed elettroni liberi",
    "Che cos'è il legame metallico?": "Attrazione tra cationi ed elettroni liberi",
    "Che cosa vuol dire che un elettrone è delocalizzato?": "Non appartiene a un atomo preciso",
    "Quali elettroni formano il mare di elettroni?": "Gli elettroni di valenza",
    "Il legame metallico è direzionale?": "No: agisce in tutte le direzioni",
    "Un pezzo di sodio metallico contiene ioni negativi di sodio?": "No: solo cationi ed elettroni",
    "Perché tra gli atomi di un pezzo di sodio non c'è un legame ionico?": "Gli atomi sono tutti uguali",
    "Perché un pezzo di metallo è neutro?": "Elettroni liberi e cariche dei cationi si compensano",
    "Qual è la formula del rame metallico?": "Il simbolo Cu",
    "Che cosa hanno in comune gli atomi dei metalli?": "Pochi elettroni di valenza, trattenuti poco",
}
PROPERTIES = {
    "Perché un metallo conduce la corrente anche da solido?": "Ha elettroni liberi di muoversi",
    "In un filo di rame percorso da corrente, quali particelle si spostano lungo il filo?": "Gli elettroni",
    "Che cosa succede alla resistenza elettrica di un metallo quando lo scaldi?": "Aumenta",
    "Verso quale polo di una pila si spostano gli elettroni di un metallo?": "Verso il polo positivo",
    "Perché i metalli conducono bene il calore?": "Gli elettroni liberi portano l'energia",
    "Perché i metalli sono lucenti?": "Gli elettroni liberi riemettono la luce",
    "Che cosa vuol dire che un metallo è malleabile?": "Si può ridurre in lamine",
    "Che cosa vuol dire che un metallo è duttile?": "Si può tirare in fili",
    "Perché un metallo colpito si deforma senza rompersi?": "Gli strati scorrono nel mare di elettroni",
    "Un metallo è malleabile perché il legame metallico è debole?": "No: perché non ha direzione",
    "Un solido conduce la corrente da solido e martellato si appiattisce. Che cos'è?": "Un metallo",
    "Un solido non conduce da solido, conduce fuso e martellato si sbriciola. Che cos'è?": "Un composto ionico",
    "Perché un cristallo ionico colpito si spacca e un metallo no?": "Nel cristallo cariche uguali finiscono di fronte",
    "Quale di questi metalli è liquido a temperatura ambiente?": "Il mercurio",
}
ALLOYS = {
    "Che cos'è una lega?": "Un miscuglio omogeneo solido di un metallo",
    "Di che cosa è fatto l'acciaio?": "Ferro e carbonio",
    "Di che cosa è fatto l'ottone?": "Rame e zinco",
    "Di che cosa è fatto il bronzo?": "Rame e stagno",
    "Che tipo di lega è l'acciaio?": "Interstiziale",
    "Che tipo di lega è l'ottone?": "Di sostituzione",
    "In una lega interstiziale, dove stanno gli atomi aggiunti?": "Negli spazi vuoti del reticolo",
    "Perché una lega è di solito più dura del metallo puro?": "Gli strati scorrono con più difficoltà",
    "Una lega ha una formula chimica?": "No: la composizione può variare",
}


def fact(sample, prose, key, errs):
    if prose not in key:
        errs.append(f"question not in the key: {prose!r}")
        return False
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == key[prose], errs)
    return True


def level1(sample, prose, errs):
    return "modello" if fact(sample, prose, MODEL, errs) else None


def level2(sample, prose, errs):
    m = re.fullmatch(r"(.+) è un metallo del gruppo \$(\d+)\$\. Nel modello del mare di elettroni, quanti elettroni mette in comune ogni suo atomo\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    el = BY_NAME[no_art(m.group(1))]
    sym = el["symbol"]
    if el["group"] != int(m.group(2)) or not is_metal(sym):
        errs.append(f"{sym}: not a metal of group {m.group(2)}")
    check_number(sample, valence(sym), errs)
    return f"gruppo-{el['group']}"


def level3(sample, prose, errs):
    m = re.fullmatch(
        r"Quanti elettroni delocalizzati ci sono in \$(.+?)\\,\\text\{g\}\$ di (\w+), metallo del gruppo \$(\d+)\$\? "
        r"La massa atomica è \$(.+?)\$; usa \$N_A = 6\{,\}02 \\cdot 10\^\{23\}\\,\\text\{mol\}\^\{-1\}\$\.",
        prose,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    el = BY_NAME[m.group(2)]
    sym = el["symbol"]
    if el["group"] != int(m.group(3)) or not is_metal(sym):
        errs.append(f"{sym}: not a metal of group {m.group(3)}")
    if dec(m.group(4)) != mass(sym):
        errs.append("the atomic mass in the text is not that of the table")
    v = valence(sym)
    truth = dec(m.group(1)) / mass(sym) * N_A * v

    def right(o):
        return abs(parse_sci(o["latex"])[0] / truth - 1) < Rational(6, 1000)

    for o in sample["answer"]["options"]:
        value, mant, _ = parse_sci(o["latex"])
        if Rational(6, 1000) <= abs(value / truth - 1) < Rational(5, 100):
            errs.append(f"option {o['latex']!r} too close to the answer")
        if not (1 <= mant < 10) or len(re.sub(r"\D", "", o["latex"].split(" \\cdot")[0])) != 3:
            errs.append(f"option {o['latex']!r} not in scientific notation with three figures")
    check_choice(sample["answer"], right, errs)
    return f"elettroni-{v}"


def melting(sym):
    """Melting point in °C, rounded to the unit, from the site's periodic table (kelvin there)."""
    c = Rational(str(BY_NAME_SYMBOL[sym]["melting"])) - Rational("273.15")
    return int(floor(c + Rational(1, 2)))


BY_NAME_SYMBOL = {e["symbol"]: e for e in BY_NAME.values()}


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quale metallo ha il punto di fusione più alto, (.+) o (.+), e perché\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    a, b = BY_NAME[no_art(m.group(1))], BY_NAME[no_art(m.group(2))]
    sa, sb = a["symbol"], b["symbol"]
    if not (is_metal(sa) and is_metal(sb)) or sa == sb:
        errs.append("not two different metals")
        return None
    va, vb = valence(sa), valence(sb)
    if va != vb:
        if a["period"] != b["period"]:
            errs.append("different electrons: the two metals must be of the same period")
        high, low = (a, b) if va > vb else (b, a)
        reason, kind = "più elettroni in comune", "elettroni"
    else:
        if a["group"] != b["group"]:
            errs.append("same electrons: the two metals must be of the same group")
        high, low = (a, b) if a["period"] < b["period"] else (b, a)
        reason, kind = "catione più piccolo", "dimensioni"
    # the rule of the lesson must agree with the measured melting points, by a clear margin
    if melting(high["symbol"]) < melting(low["symbol"]) + 10:
        errs.append(f"the rule gives {high['symbol']} but the melting points are {melting(high['symbol'])} and {melting(low['symbol'])}")
    # the steps quote the two melting points
    text = " ".join(sample["steps"])
    for sym in (high["symbol"], low["symbol"]):
        if f"${melting(sym)}\\,^\\circ\\text{{C}}$" not in text:
            errs.append(f"the melting point of {sym} in the steps is not {melting(sym)}")
    cap = lambda s: s[0].upper() + s[1:]  # noqa: E731
    want = f"{cap(m.group(1) if high is a else m.group(2))}: {reason}"
    names = {cap(m.group(1)), cap(m.group(2))}
    for o in sample["answer"]["options"]:
        mo = re.fullmatch(r"(.+): (più elettroni in comune|meno elettroni in comune|catione più piccolo|catione più grande)", option_text(o["latex"]))
        if not mo or mo.group(1) not in names:
            errs.append(f"option {o['latex']!r} not recognised")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
    return kind


def level5(sample, prose, errs):
    return "proprieta" if fact(sample, prose, PROPERTIES, errs) else None


def level6(sample, prose, errs):
    m = re.fullmatch(r"Un gioiello di oro a \$(\d+)\$ carati ha una massa di \$(.+?)\\,\\text\{g\}\$\. Quanti grammi di oro puro contiene\?", prose)
    if not m:
        return "lega" if fact(sample, prose, ALLOYS, errs) else None
    carats, grams = int(m.group(1)), dec(m.group(2))
    if not 1 <= carats < 24:
        errs.append(f"{carats} carats")
    truth = grams * carats / 24
    if truth * 100 != int(truth * 100):
        errs.append("the mass of gold has more than two decimals")

    def grams_of(o):
        mo = re.fullmatch(r"(\d+\{,\}\d\d)\\,\\text\{g\}", o["latex"])
        if not mo:
            raise ValueError(f"not a mass with two decimals: {o['latex']!r}")
        return dec(mo.group(1))

    check_choice(sample["answer"], lambda o: grams_of(o) == truth, errs)
    return "carati"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    kind_of_answer = sample.get("answer", {}).get("kind")
    if (lvl == 2) != (kind_of_answer == "number"):
        return errs + [f"level {lvl} with a {kind_of_answer} answer"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
