"""Checker for fis-errori-misura (specs/exercises/fis-errori-misura.md).

Written from the spec and the lesson, not from the generator. Each exercise is read back as the student sees it:
- levels 1 and 5: the situation is recognised from a table of sentences written from the spec (one template per
  situation, with the name, the object and the numbers left free); the template decides the case, and so the right
  option; the numbers are checked where they matter (digits swapped, 9 oscillations for 10, inches for centimetres);
  the options are the three or four fixed ones;
- level 2: the empty reading z and the reading L are read from the text; the answer is L - z with SymPy Rationals,
  the distractors L + z, L, L - 2z; four different positive values, with one decimal and the unit;
- level 3: the shots are read from the scene; mean M and spread s (largest distance from M) are computed exactly,
  the class from the thresholds of the spec, and no value may fall between two thresholds; shots within 0.95, at
  least 0.07 apart, rounded to hundredths; the alt names the number of shots and does not give the answer;
- level 4: the three series are read from the text; each is classified from its deviations from the reference, its
  range and its mean, and the asked series must be the only one of its class.
Then the share of each case (CASE_RANGES).
"""
import math
import re

from sympy import Rational

LABELS = {
    1: {"casuale": "errore casuale", "sistematico": "errore sistematico", "sbaglio": "sbaglio (errore grossolano)"},
    3: {"PA": "precisi e accurati", "PN": "precisi ma non accurati", "AN": "accurati ma non precisi", "NN": "né precisi né accurati"},
    5: {
        "media": "ripetere la misura più volte e fare la media",
        "correggi": "tarare lo strumento o correggere il metodo",
        "scarta": "scartare quella misura e rifarla",
        "sensibile": "usare uno strumento più sensibile",
    },
}

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in LABELS[1]},
    2: {k: (0.18, 0.32) for k in ["bilancia", "dinamometro", "termometro", "righello"]},
    3: {k: (0.18, 0.32) for k in LABELS[3]},
    4: {k: (0.25, 0.42) for k in ["PA", "PN", "AN"]},
    5: {k: (0.18, 0.32) for k in LABELS[5]},
}

BANNED = re.compile(r"—|piuttosto che")

UNITS = {"g": r"\text{g}", "N": r"\text{N}", "C": r"{}^\circ\text{C}", "cm": r"\text{cm}", "mm": r"\text{mm}", "s": r"\text{s}"}
NUM = r"-?\d+(?:\{,\}\d+)?"


def parse_num(s):
    """(value, decimals) of a number written 182{,}2 or -0{,}3."""
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    neg = s.startswith("-")
    whole, _, frac = s.lstrip("-").partition("{,}")
    if len(whole) > 1 and whole.startswith("0"):
        raise ValueError(f"leading zero in {s!r}")
    v = Rational(int(whole + frac), 10 ** len(frac))
    return (-v if neg else v), len(frac)


def fmt(v, d):
    scaled = Rational(v) * 10**d
    if scaled.q != 1:
        raise ValueError(f"{v} does not have {d} decimals")
    s = str(abs(int(scaled))).rjust(d + 1, "0")
    out = s[: len(s) - d] + ("{,}" + s[len(s) - d :] if d else "")
    return ("-" if scaled < 0 else "") + out


# ---------------------------------------------------------------------------
# Reading the problem


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    return m.group(1).split(r" \\ ") if m else [tex.strip()]


def read(tex):
    """(prose, data lines): the \\text{} lines joined, then the lines that are not prose."""
    prose, data = [], []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if m and r"\quad" not in line and not data:
            prose.append(m.group(1))
        else:
            data.append(line.strip())
    return " ".join(prose), data


def template(tpl):
    """{N} a name (the same each time), {O} an object, {K} an integer in dollars, {V:u} a number with unit u."""
    rx = re.escape(tpl)
    first = True

    def name(_m):
        nonlocal first
        if first:
            first = False
            return r"(?P<name>[A-Z][a-z]+)"
        return r"(?P=name)"

    rx = re.sub(re.escape(re.escape("{N}")), name, rx)
    rx = rx.replace(re.escape("{O}"), r"([a-zà-ù'][a-zà-ù' ]*?)")
    rx = rx.replace(re.escape("{P}"), r"([A-Z][a-zà-ù' ]*?)")
    rx = rx.replace(re.escape("{K}"), r"\$(\d+)\$")
    for u, tex in UNITS.items():
        rx = rx.replace(re.escape("{V:" + u + "}"), r"\$(" + NUM + r")\\," + re.escape(tex) + r"\$")
    rx = rx.replace(re.escape("{A}"), r"(.+?)")
    return re.compile(rx)


def match_table(table, prose):
    """All (case, index, groups) whose template matches the prose; groups are strings."""
    hits = []
    for case, tpls in table.items():
        for i, tpl in enumerate(tpls):
            m = template(tpl).fullmatch(prose)
            if m:
                hits.append((case, i, [g for g in m.groups()]))
    return hits


def value(s, decimals=None, errs=None):
    v, d = parse_num(s)
    if decimals is not None and d != decimals and errs is not None:
        errs.append(f"{s} written with {d} decimals, expected {decimals}")
    return v


def text_option(latex):
    """The words of a text option, on one line or on the lines of a gathered."""
    g = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", latex)
    parts = g.group(1).split(r" \\ ") if g else [latex]
    words = []
    for p in parts:
        m = re.fullmatch(r"\\text\{([^{}]*)\}", p.strip())
        if not m:
            raise ValueError(f"not a text option: {latex!r}")
        words.append(m.group(1))
    return " ".join(words)


def check_fixed(errs, sample, labels, truth, gathered=False):
    a = sample["answer"]
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a.get("options", [])
    shown = []
    for o in opts:
        try:
            shown.append(text_option(o["latex"]))
        except ValueError as e:
            errs.append(str(e))
            return
        if gathered != o["latex"].startswith(r"\begin{gathered}"):
            errs.append(f"option layout: {o['latex']!r}")
        if o["values"][0] not in labels or labels[o["values"][0]] != shown[-1]:
            errs.append(f"option {shown[-1]!r} with value {o['values']} is not a fixed option")
    if sorted(shown) != sorted(labels.values()):
        errs.append(f"options are not the fixed ones: {shown}")
    if shown.count(labels[truth]) != 1 or a.get("correct") != shown.index(labels[truth]):
        errs.append(f"the right option should be {labels[truth]!r}, got index {a.get('correct')}")


# ---------------------------------------------------------------------------
# Level 1: the table of situations, from the spec

Q1 = " Che tipo di errore c'è nelle sue misure?"
L1 = {
    "sistematico": [
        "Una bilancia, a piatto vuoto, segna {V:g}. {N} la usa per pesare {O}.",
        r"Il cronometro di {N} va {A} di {V:s} ogni $100\,\text{s}$. {N} lo usa per misurare {O}.",
        "{N} misura {O} con un righello che ha il bordo consumato, facendo partire ogni misura dal bordo.",
        "{N} legge il termometro sempre {A}, con l'occhio {A} il livello del liquido, per misurare {O}.",
        r"{N} misura {O} con un metro a nastro d'acciaio tarato a $20\,{}^\circ\text{C}$, in un cortile al sole a {V:C}.",
        "Un dinamometro, senza niente appeso, segna {V:N}. {N} lo usa per misurare il peso di {O}.",
        "{N} misura {K} volte {O}, facendo partire il cronometro sempre quando la pallina è già partita.",
    ],
    "casuale": [
        "{N} cronometra {K} volte la caduta di una pallina; a volte preme il tasto un po' prima dell'arrivo, a volte un po' dopo.",
        "{N} misura {K} volte {O} con un metro da sarta, appoggiandolo ogni volta in modo un po' diverso.",
        "{N} misura {K} volte il peso di {O} con un dinamometro appeso a un tavolo che vibra: la lancetta oscilla, e {N} la legge a volte un po' più su e a volte un po' più giù.",
        "{N} misura {K} volte {O} con un righello e legge a occhio la tacca più vicina, che a volte è un po' sopra e a volte un po' sotto il valore vero.",
        "{N} pesa {K} volte {O} con una bilancia di precisione vicino a una finestra aperta: una corrente d'aria muove il piatto, a volte verso l'alto e a volte verso il basso.",
        "{N} misura {K} volte con un calibro il diametro di un sasso irregolare, prendendolo ogni volta in un punto diverso.",
    ],
    "sbaglio": [
        "{N} misura {K} volte {O}; in una delle misure scrive {V:cm} al posto di {V:cm}.",
        "{N} misura {K} volte {O}; in una delle misure legge la scala dei pollici invece di quella dei centimetri.",
        "{N} pesa {K} volte {O}; prima di una sola pesata dimentica di azzerare la bilancia.",
        "{N} cronometra {K} volte {K} oscillazioni di un pendolo; in una prova conta {K} oscillazioni invece di {K}.",
        "{N} riporta in una tabella {K} misure {O} in centimetri; una la scrive in millimetri, nella colonna dei centimetri.",
        "{N} pesa {K} volte {O}; a metà di una pesata preme per sbaglio il tasto di azzeramento.",
    ],
}


def level1(sample, errs):
    prose, data = read(sample["problem"])
    if data or not prose.endswith(Q1):
        errs.append("level 1: problem is not one situation and the question")
        return None
    hits = match_table(L1, prose[: -len(Q1)])
    if len(hits) != 1:
        errs.append(f"level 1: {len(hits)} situations recognised in {prose!r}")
        return None
    case, i, g = hits[0]
    nums = [x for x in g if x and re.fullmatch(NUM, x)]
    if case == "sistematico":
        if i in (0, 5):
            z = value(nums[0], 1, errs)
            if not 0 < z <= (Rational(9, 10) if i == 0 else Rational(1, 2)):
                errs.append(f"empty reading {z} out of range")
        if i == 1 and g[1] not in ("avanti", "indietro"):
            errs.append(f"clock goes {g[1]!r}")
        if i == 3 and (g[1], g[2]) not in (("dal basso", "sotto"), ("dall'alto", "sopra")):
            errs.append(f"thermometer read {g[1]!r} with the eye {g[2]!r}")
        if i == 4 and not value(nums[0], 0, errs) >= 30:
            errs.append("tape in the sun not warmer than 30 C")
    if case == "sbaglio" and i == 0:
        a, b = nums[-2:]
        if value(a, 1, errs) == value(b, 1, errs) or a.replace("{,}", "") != b.replace("{,}", "")[::-1] or len(a) != 5:
            errs.append(f"{a} is not {b} with the two digits swapped")
    if case == "sbaglio" and i == 3:
        n, k, k1, k2 = (int(x) for x in g[1:5])
        if not (k == k2 and k1 == k - 1 and k in (10, 20)):
            errs.append(f"oscillations {k1} instead of {k2}, of {k}")
    if "{K}" in L1[case][i] and not 3 <= int(g[1]) <= 8:
        errs.append(f"{g[1]} measures")
    check_fixed(errs, sample, LABELS[1], case)
    return case


# ---------------------------------------------------------------------------
# Level 2: correcting the zero

L2 = {
    "bilancia": ("Una bilancia, a piatto vuoto, segna {V:g}. Con {O} sul piatto segna {V:g}. Quanto pesa {O}?", "g", (1, 9), (100, 5000), True),
    "dinamometro": ("Un dinamometro, senza niente appeso, segna {V:N}. Con {O} appeso segna {V:N}. Qual è il peso {O}?", "N", (1, 5), (10, 200), True),
    "termometro": ("Un termometro, nel ghiaccio fondente, segna {V:C}. {P} segna {V:C}. Qual è la temperatura {O}?", "C", (2, 15), (150, 900), True),
    "righello": (
        "Il righello di {N} ha il bordo consumato: lo zero della scala non c'è più, e il bordo sta sulla tacca {V:cm}. {N} appoggia {O} al bordo, e l'altra estremità arriva alla tacca {V:cm}. Quanto è {A} {O}?",
        "cm",
        (2, 8),
        (30, 5000),
        False,
    ),
}


def level2(sample, errs):
    prose, data = read(sample["problem"])
    if data:
        errs.append("level 2: extra lines")
    for case, (tpl, unit, zr, lr, signed) in L2.items():
        m = template(tpl).fullmatch(prose)
        if not m:
            continue
        nums = [x for x in m.groups() if x and re.fullmatch(NUM, x)]
        z, L = value(nums[0], 1, errs), value(nums[1], 1, errs)
        if not zr[0] <= abs(z) * 10 <= zr[1] or (z < 0 and not signed):
            errs.append(f"empty reading {z} out of range")
        if not lr[0] <= L * 10 <= lr[1]:
            errs.append(f"reading {L} out of range")
        truth = L - z
        want = {truth, L + z, L, L - 2 * z}
        a = sample["answer"]
        opts = a.get("options", [])
        shown = []
        for o in opts:
            mm = re.fullmatch("(" + NUM + r")\\," + re.escape(UNITS[unit]), o["latex"])
            if not mm:
                errs.append(f"option {o['latex']!r} not a number in {unit}")
                return case
            v = value(mm.group(1), 1, errs)
            if Rational(o["values"][0]) != v:
                errs.append(f"option value {o['values']} != {v}")
            if v <= 0:
                errs.append(f"option {v} not positive")
            shown.append(v)
        if len(opts) != 4 or set(shown) != want or len(want) != 4:
            errs.append(f"options {shown} are not L - z, L + z, L, L - 2z = {sorted(want)}")
        if a.get("kind") != "choice" or shown.count(truth) != 1 or a.get("correct") != shown.index(truth):
            errs.append(f"the right option should be {truth}")
        return case
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


# ---------------------------------------------------------------------------
# Level 3: the target

WORDS = {6: "sei", 7: "sette", 8: "otto"}
DIRS = {"a destra": 0, "in alto a destra": 45, "in alto": 90, "in alto a sinistra": 135, "a sinistra": 180, "in basso a sinistra": 225, "in basso": 270, "in basso a destra": 315}


def level3(sample, errs):
    prose, data = read(sample["problem"])
    if prose != "Ogni colpo del bersaglio è una misura, e il centro è il valore vero. Come sono questi colpi?" or data:
        errs.append(f"level 3 text: {prose!r}")
    sc = sample.get("scene")
    if not sc or sc.get("type") != "bersaglio":
        errs.append("no bersaglio scene")
        return None
    if sample.get("solutionScene") != sc:
        errs.append("solutionScene differs from the scene")
    shots = []
    for p in sc["data"]["colpi"]:
        x, y = (Rational(repr(float(c))) for c in p)
        if (x * 100).q != 1 or (y * 100).q != 1:
            errs.append(f"shot {p} not rounded to hundredths")
        shots.append((x, y))
    n = len(shots)
    if not 6 <= n <= 8:
        errs.append(f"{n} shots")
    if any(x * x + y * y > Rational(95, 100) ** 2 for x, y in shots):
        errs.append("a shot beyond 0.95")
    if any((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 < Rational(7, 100) ** 2 for i, a in enumerate(shots) for b in shots[i + 1 :]):
        errs.append("two shots closer than 0.07")
    Mx = sum(x for x, _ in shots) / n
    My = sum(y for _, y in shots) / n
    M2 = Mx**2 + My**2
    s2 = max((x - Mx) ** 2 + (y - My) ** 2 for x, y in shots)
    if s2 <= Rational(1, 5) ** 2:
        precise = True
    elif s2 >= Rational(45, 100) ** 2:
        precise = False
    else:
        errs.append(f"spread {math.sqrt(s2):.3f} between the thresholds")
        return None
    if M2 <= Rational(8, 100) ** 2:
        accurate = True
    elif M2 >= Rational(2, 5) ** 2:
        accurate = False
    else:
        errs.append(f"mean at {math.sqrt(M2):.3f} between the thresholds")
        return None
    case = ("P" if precise else "") + ("A" if accurate else "N") if precise else ("AN" if accurate else "NN")
    alt = sc.get("alt", "")
    m = re.fullmatch(r"Un bersaglio con (sei|sette|otto) colpi, (.+)\.", alt)
    if not m or m.group(1) != WORDS.get(n):
        errs.append(f"alt does not say the {n} shots: {alt!r}")
    if re.search(r"precis|accurat", alt):
        errs.append("alt gives the answer")
    if m and not accurate:
        named = [d for d in DIRS if m.group(2).endswith(" " + d) or f" {d}," in m.group(2)]
        named = max(named, key=len) if named else None
        ang = math.degrees(math.atan2(float(My), float(Mx))) % 360
        if named is None or min(abs(ang - DIRS[named]), 360 - abs(ang - DIRS[named])) > 22.6:
            errs.append(f"alt direction {named!r} but the mean is at {ang:.0f} degrees")
    check_fixed(errs, sample, LABELS[3], case)
    return case


# ---------------------------------------------------------------------------
# Level 4: three series

ASK = {"precisa e accurata": "PA", "precisa ma non accurata": "PN", "accurata ma non precisa": "AN"}
L4 = [
    ("Tre gruppi pesano quattro volte, ognuno con la sua bilancia, un pesetto campione da {V:g}. Quale serie è {A}?", "g", {50, 100, 20}),
    ("Tre gruppi misurano quattro volte, ognuno con il suo calibro, un blocchetto di riferimento lungo {V:mm}. Quale serie è {A}?", "mm", {25, 40}),
    ("Un segnale acustico dà un intervallo di {V:s}: tre gruppi lo misurano quattro volte, ognuno con il suo cronometro. Quale serie è {A}?", "s", {10}),
]
H = Rational(1, 100)


def classify4(xs, R):
    dev = [x - R for x in xs]
    rng = max(xs) - min(xs)
    mean = sum(xs) / 4
    small = lambda ds: all(abs(d) <= 2 * H for d in ds) and 2 * H <= rng <= 4 * H  # noqa: E731
    out = []
    if sum(dev) == 0 and small(dev):
        out.append("PA")
    o = mean - R
    if 20 * H <= abs(o) <= 50 * H and small([x - mean for x in xs]):
        out.append("PN")
    if sum(dev) == 0 and all(20 * H <= abs(d) <= 50 * H for d in dev) and rng >= 50 * H:
        out.append("AN")
    return out


def level4(sample, errs):
    prose, data = read(sample["problem"])
    for tpl, unit, refs in L4:
        m = template(tpl).fullmatch(prose)
        if not m:
            continue
        R = value(m.group(1), 2, errs)
        if R not in refs:
            errs.append(f"reference {R} not in the spec")
        asked = ASK.get(m.group(2))
        if asked is None:
            errs.append(f"question {m.group(2)!r}")
            return None
        if len(data) != 3:
            errs.append(f"{len(data)} series")
            return asked
        classes = []
        for letter, line in zip("ABC", data):
            parts = line.split(r" \quad ")
            if len(parts) != 4 or not parts[0].startswith(rf"\text{{{letter}: }} ") or not parts[3].endswith(r"\," + UNITS[unit]):
                errs.append(f"series line {line!r}")
                return asked
            raw = [parts[0][len(rf"\text{{{letter}: }} ") :], parts[1], parts[2], parts[3][: -len(r"\," + UNITS[unit])]]
            xs = [value(r, 2, errs) for r in raw]
            c = classify4(xs, R)
            if len(c) != 1:
                errs.append(f"series {letter} is {c or 'no class'}: {raw}")
                return asked
            classes.append(c[0])
        if sorted(classes) != ["AN", "PA", "PN"]:
            errs.append(f"classes {classes}")
        right = "ABC"[classes.index(asked)] if asked in classes else None
        a = sample["answer"]
        shown = [o["latex"] for o in a.get("options", [])]
        if shown != [r"\text{serie A}", r"\text{serie B}", r"\text{serie C}"] or [o["values"] for o in a["options"]] != [["A"], ["B"], ["C"]]:
            errs.append(f"options {shown}")
        elif right is None or a.get("correct") != "ABC".index(right):
            errs.append(f"the right option should be serie {right}")
        return asked
    errs.append(f"level 4 text not recognised: {prose!r}")
    return None


# ---------------------------------------------------------------------------
# Level 5: the remedy

Q5 = " Che cosa conviene fare?"
L5 = {
    "media": [
        "{N} cronometra {K} volte la caduta di una pallina dalla stessa altezza e trova tempi diversi, a volte più lunghi e a volte più corti, tra {V:s} e {V:s}.",
        "{N} misura {K} volte il peso di {O} con un dinamometro appeso a un sostegno che vibra: la lancetta oscilla, e le letture cambiano ogni volta di qualche decimo di newton, a volte in più e a volte in meno.",
        "{N} misura {K} volte {O} con un metro da sarta, appoggiandolo ogni volta in modo un po' diverso, e trova valori tra {V:cm} e {V:cm}, a volte più lunghi e a volte più corti.",
        "{N} misura {K} volte il periodo di un pendolo con il cronometro a mano e trova valori tra {V:s} e {V:s}, a volte sopra e a volte sotto un valore centrale.",
    ],
    "correggi": [
        "Pesando quattro volte un pesetto campione da {V:g}, la bilancia di {N} dà sempre valori tra {V:g} e {V:g}.",
        "La bilancia di {N}, a piatto vuoto, segna {V:g}, e {N} deve pesare {O}.",
        "{N} legge il termometro sempre dal basso, con l'occhio sotto il livello del liquido, per misurare {O}.",
        "Il cronometro di {N} parte sempre {V:s} dopo che si preme il tasto, e {N} lo usa per misurare {O}.",
    ],
    "scarta": [
        "{N} misura cinque volte {O} e trova {A}; poi si accorge che nella {A} misura ha scambiato le due cifre.",
        "{N} cronometra cinque volte $10$ oscillazioni di un pendolo e trova {A}; nella {A} prova si accorge di aver contato solo $9$ oscillazioni.",
        "{N} pesa cinque volte {O} e trova {A}; prima della {A} pesata aveva dimenticato di azzerare la bilancia.",
        "{N} misura cinque volte {O} e trova {A}; nella {A} misura si accorge di aver letto la scala dei pollici.",
    ],
    "sensibile": [
        "{N} misura cinque volte {O} con un righello che ha solo le tacche dei centimetri, e trova sempre {V:cm}. Serve la lunghezza al millimetro.",
        "{N} misura cinque volte il tempo di caduta di una pallina con un cronometro a fotocellule che mostra solo i decimi di secondo, e legge sempre {V:s}. Serve il tempo al centesimo di secondo.",
        "{N} pesa cinque volte {O} con una bilancia da cucina che segna i grammi, e legge sempre {V:g}. Serve la massa al decimo di grammo.",
        "{N} misura cinque volte la temperatura {O} con un termometro che ha solo le tacche dei gradi, e legge sempre {V:C}. Serve la temperatura al decimo di grado.",
    ],
}
ORD = ["prima", "seconda", "terza", "quarta", "quinta"]
SCARTA_UNIT = ["cm", "s", "g", "cm"]


def five(s, unit, errs):
    """Five values '$a$, $b$, $c$, $d$ e $e\\,unit$', with one decimal."""
    m = re.fullmatch(r"\$(" + NUM + r")\$, \$(" + NUM + r")\$, \$(" + NUM + r")\$, \$(" + NUM + r")\$ e \$(" + NUM + r")\\," + re.escape(UNITS[unit]) + r"\$", s)
    if not m:
        raise ValueError(f"not five measures in {unit}: {s!r}")
    return [value(x, 1, errs) for x in m.groups()]


def level5(sample, errs):
    prose, data = read(sample["problem"])
    if data or not prose.endswith(Q5):
        errs.append("level 5: problem is not one situation and the question")
        return None
    hits = match_table(L5, prose[: -len(Q5)])
    if len(hits) != 1:
        errs.append(f"level 5: {len(hits)} situations recognised in {prose!r}")
        return None
    case, i, g = hits[0]
    nums = [x for x in g if x and re.fullmatch(NUM, x)]
    if case == "media" and i in (0, 2, 3):
        a, b = (value(x, None) for x in nums[-2:])
        if not a < b:
            errs.append(f"range {a} - {b}")
    if case == "correggi" and i == 0:
        R, a, b = (value(x, 2, errs) for x in nums)
        if not ((a > R and b > R) or (a < R and b < R)) or not min(abs(a - R), abs(b - R)) >= Rational(1, 10) or not 0 < b - a <= Rational(1, 10):
            errs.append(f"sample {R} read between {a} and {b}: not one shift")
    if case == "scarta":
        xs = five(g[-2], SCARTA_UNIT[i], errs)
        if g[-1] not in ORD:
            errs.append(f"ordinal {g[-1]!r}")
            return case
        k = ORD.index(g[-1])
        odd, rest = xs[k], xs[:k] + xs[k + 1 :]
        if max(rest) - min(rest) > Rational(2, 10):
            errs.append(f"the other measures are not close: {rest}")
        if min(abs(odd - r) for r in rest) < 1:
            errs.append(f"the odd measure {odd} is not far from the others {rest}")
        centre = (max(rest) + min(rest)) / 2
        if i == 0:
            digits = fmt(odd, 1).replace("{,}", "")
            swapped = parse_num(digits[1] + "{,}" + digits[0])[0]
            if len(digits) != 2 or abs(swapped - centre) > Rational(1, 10):
                errs.append(f"{odd} is not a measure with its digits swapped")
        if i == 1 and not any(abs(odd - r * Rational(9, 10)) <= Rational(15, 100) for r in rest):
            errs.append(f"{odd} is not 9 oscillations of {rest}")
        if i == 2 and not odd > max(rest):
            errs.append("a scale not zeroed should read more")
        if i == 3 and not any(abs(odd - r / Rational(254, 100)) <= Rational(1, 10) for r in rest):
            errs.append(f"{odd} is not {rest} in inches")
    if case == "sensibile":
        v, d = parse_num(nums[0])
        if d != (1 if i == 1 else 0) or v <= 0:
            errs.append(f"reading {nums[0]} does not show the instrument's last digit")
    check_fixed(errs, sample, LABELS[5], case, gathered=True)
    return case


# ---------------------------------------------------------------------------

LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if sample.get("answer", {}).get("kind") != "choice" or sample.get("choice") is not None:
        errs.append("the answer must be a choice, with no separate choice variant")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
