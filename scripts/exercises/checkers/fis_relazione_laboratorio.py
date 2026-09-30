"""Checker for fis-relazione-laboratorio (specs/exercises/fis-relazione-laboratorio.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/09-fis-relazione-laboratorio.md), not from the
generator. Every exercise is read back from the text of the problem and of the options, never from params:
- level 1: the sentence between quotes must match exactly one model of a table written from the spec, which gives its
  part; the models with numbers are recomputed (a mean, a sum of relative uncertainties, a density, a half spread, a
  difference, a density compatible or not with a metal);
- level 2: the measures and the sensitivity are read from the prose; every table is parsed (header, units, decimals
  of each cell) and its defects found; exactly one table has none, every other exactly one, all different;
- levels 3 and 5: the result and the expected value are read, the interval rebuilt with exact Rationals, the position
  of the expected value and the margins checked (one unit of the last digit of the uncertainty, three uncertainties
  for a systematic error at level 5);
- level 4: the contributions to the relative uncertainty (3 eps_l for the cube) are computed with Rational, with
  their ratio.
Then the four options (different, with the texts of the spec), the right one, and the share of each case.
"""
import re
from sympy import Rational, pi, sqrt

BANNED = re.compile(r"—|piuttosto che")
NUM = r"\d+(?:\{,\}\d+)?"
CEL = r"\\,\{\}\^\\circ\\text\{C\}"

CASE_RANGES = {
    1: {k: (0.10, 0.19) for k in ["scopo", "teoria", "strumenti", "procedimento", "dati", "elaborazione", "conclusioni"]},
    2: {k: (0.18, 0.32) for k in ["senza-unita", "unita-nelle-caselle", "zero-mancante", "cifre-in-piu"]},
    3: {"compatibile": (0.40, 0.60), "non-compatibile": (0.40, 0.60)},
    4: {"uguali": (0.14, 0.26), "trappola": (0.08, 0.18), "primo": (0.26, 0.42), "secondo": (0.26, 0.42)},
    5: {"compatibile": (0.26, 0.41), "eccesso": (0.26, 0.41), "difetto": (0.26, 0.41)},
}


def num(s):
    """(value, decimals) of a number written 12{,}53."""
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    whole, _, frac = s.partition("{,}")
    return Rational(int(whole + frac), 10 ** len(frac)), len(frac)


def val(s):
    return num(s)[0]


# ---------------------------------------------------------------------------
# Reading the LaTeX


def top_lines(tex):
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    if not m:
        return [tex]
    return m.group(1).split(" \\\\ ")


def prose(tex):
    out = []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line.strip(), re.S)
        if not m:
            raise ValueError(f"problem line is not prose: {line!r}")
        out.append(m.group(1))
    return " ".join(out)


def option_text(latex):
    m = re.fullmatch(r"\\text\{Il lato \} ([ab])", latex)
    if m:
        return f"Il lato {m.group(1)}"
    m = re.fullmatch(r"\\text\{([^{}]*)\}", latex)
    if m:
        return m.group(1)
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", latex)
    if m:
        parts = []
        for line in m.group(1).split(" \\\\ "):
            t = re.fullmatch(r"\\text\{([^{}]*)\}", line)
            if not t:
                raise ValueError(f"option line {line!r}")
            parts.append(t.group(1))
        return " ".join(parts)
    raise ValueError(f"unreadable option {latex!r}")


def options(sample, errs):
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return None
    opts = a.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    if len({o["latex"] for o in opts}) != len(opts) or len({o["values"][0] for o in opts}) != len(opts):
        errs.append("repeated options")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct out of range")
        return None
    if sample.get("solution") != opts[c]["latex"]:
        errs.append("solution differs from the right option")
    return opts, c


def text_choice(sample, errs, texts, truth):
    """Options with fixed texts {key: text}; the right one must be `truth`."""
    got = options(sample, errs)
    if not got:
        return
    opts, c = got
    for o in opts:
        try:
            tx = option_text(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            continue
        k = o["values"][0]
        if texts.get(k) != tx:
            errs.append(f"option {k!r} says {tx!r}")
    keys = [o["values"][0] for o in opts]
    if keys.count(truth) != 1 or keys[c] != truth:
        errs.append(f"the right option is {truth!r}, options {keys}, correct {c}")


# ---------------------------------------------------------------------------
# Level 1: the parts of the report

PART_NAMES = {
    "scopo": "Scopo",
    "teoria": "Cenni teorici",
    "strumenti": "Materiali e strumenti",
    "procedimento": "Procedimento",
    "dati": "Dati",
    "elaborazione": "Elaborazione dei dati",
    "conclusioni": "Conclusioni",
}

METALS = {"alluminio": ("dell'alluminio", Rational(270, 100)), "ferro": ("del ferro", Rational(787, 100)), "rame": ("del rame", Rational(896, 100)), "piombo": ("del piombo", Rational(113, 10))}
OF_METAL = {v[0]: k for k, v in METALS.items()}
WORDS = "(tre|quattro|cinque|sei|otto|dieci)"
# symbol, unit, decimals of the quantities in the data
QTY = {"t": ("s", 2), "m": ("g", 1), "l": ("cm", 1), "T": ("C", 1), "V": ("mL", 0)}
NOUNS = {"tempi": ("i", "s", "secondi", False), "masse": ("le", "g", "grammi", True), "lunghezze": ("le", "cm", "centimetri", True), "temperature": ("le", "C", "gradi Celsius", True), "volumi": ("i", "mL", "millilitri", False)}


def compile_model(model):
    """A model in a small notation: «N» a number between dollars, «X» a bare number, «C» a temperature between dollars,
    «W» a count in words, «A:x|y» alternatives; the rest is literal."""
    out = ""
    for piece in re.split(r"(«[^»]*»)", model):
        if piece == "«N»":
            out += rf"\$({NUM})\$"
        elif piece == "«X»":
            out += rf"({NUM})"
        elif piece == "«C»":
            out += rf"\$({NUM}){CEL}\$"
        elif piece == "«W»":
            out += WORDS
        elif piece.startswith("«A:"):
            out += "(" + "|".join(re.escape(a) for a in piece[3:-1].split("|")) + ")"
        else:
            out += re.escape(piece)
    return re.compile(out)


def ok(_m):
    return []


def v_bilancia(m):
    P, S = val(m.group(1)), val(m.group(2))
    return [] if S in (Rational(1, 100), Rational(1, 10), 1) and P >= 100 * S else [f"balance {P} g / {S} g"]


def v_same(m):
    return [] if m.group(1) == m.group(2) else ["oscillations and divisor differ"]


def v_termo(m):
    return [] if val(m.group(2)) > 50 else ["thermometer range"]


def v_temps(m):
    return [] if val(m.group(1)) < val(m.group(2)) else ["two temperatures"]


def v_misura(m):
    sym, x, unit = m.group(2), m.group(3), m.group(4)
    u, d = QTY[sym]
    if unit != u or num(x)[1] != d:
        return [f"measure {sym} = {x} {unit}"]
    return []


def v_tabella(m):
    art, part, n, noun, mis, unit = m.group(2), m.group(1), m.group(3), m.group(4), m.group(5), m.group(6)
    a, _, name, fem = NOUNS[noun]
    good = art == a and part == ("riportate" if fem else "riportati") and mis == ("misurate" if fem else "misurati") and unit == f"in {name}"
    return [] if good else ["agreement or unit of the table sentence"]


def v_colonna(m):
    sym, unit, art, noun = m.group(1), m.group(2), m.group(4), m.group(5)
    a, u, _, _ = NOUNS[noun]
    return [] if QTY[sym][0] == u == unit and art == a else ["column sentence"]


def v_mean(m):
    sym, S, n, M, cel, unit = m.group(1), m.group(2), int(m.group(3)), m.group(4), m.group(5), m.group(6)
    u, d = QTY[sym]
    errs = []
    if val(S) / n != val(M):
        errs.append(f"mean {S}/{n} != {M}")
    if num(S)[1] != d or num(M)[1] != d:
        errs.append("mean decimals")
    if (u == "C") != bool(cel) or (u != "C" and unit != u):
        errs.append("mean unit")
    return errs


def v_sum(m):
    pairs = {"della densità": ("della massa e del volume", r"d"), "della velocità": ("della distanza e del tempo", "v")}
    errs = [] if pairs[m.group(1)] == (m.group(2), m.group(3)) else ["pair of relative uncertainties"]
    if val(m.group(4)) + val(m.group(5)) != val(m.group(6)):
        errs.append("sum of relative uncertainties")
    return errs


def v_rho(m):
    return [] if val(m.group(1)) / int(m.group(2)) == val(m.group(3)) else ["density division"]


def v_vel(m):
    return [] if val(m.group(1)) / val(m.group(2)) == val(m.group(3)) else ["velocity division"]


def v_half(m):
    units = {"dei tempi": ("s", 2), "delle masse": ("g", 1), "delle lunghezze": ("cm", 1)}
    u, d = units[m.group(1)]
    A, B, H = (num(m.group(i)) for i in (2, 3, 4))
    errs = [] if m.group(5) == u and A[1] == B[1] == H[1] == d else ["half spread units"]
    if A[0] <= B[0] or (A[0] - B[0]) / 2 != H[0]:
        errs.append("half spread")
    return errs


def v_diff(m):
    return [] if val(m.group(1)) - val(m.group(2)) == val(m.group(3)) and val(m.group(3)) > 0 else ["difference"]


def density_vs_metal(m, compatible):
    x, dx = num(m.group(1)), num(m.group(2))
    rho = METALS[OF_METAL[m.group(3)]][1]
    u = Rational(1, 10 ** dx[1])
    errs = [] if x[1] == dx[1] else ["density decimals"]
    dist = abs(x[0] - rho)
    if compatible and not dist <= dx[0] - u:
        errs.append(f"density {x[0]} ± {dx[0]} not clearly compatible with {rho}")
    if not compatible:
        if not dist >= dx[0] + u:
            errs.append(f"density {x[0]} ± {dx[0]} not clearly outside {rho}")
        if OF_METAL[m.group(3)] != m.group(4):
            errs.append("metal names differ")
    return errs


def v_ratio(m):
    pairs = {"del volume": "della massa", "del tempo": "della distanza"}
    errs = [] if pairs[m.group(1)] == m.group(3) and m.group(5) == m.group(1) else ["pair of the improvement sentence"]
    if val(m.group(2)) < 3 * val(m.group(4)):
        errs.append("the larger uncertainty is not much larger")
    return errs


DEG = rf"\\,\{{\}}\^\\circ\\text\{{C\}}"
MODELS = [
    # scopo
    ("scopo", "Misurare la densità di un «A:cilindretto|cubetto» metallico e riconoscere di che metallo è fatto.", ok),
    ("scopo", "Verificare che il periodo del pendolo «A:non dipende dalla massa appesa|non dipende dall'ampiezza delle oscillazioni|dipende dalla lunghezza del filo».", ok),
    ("scopo", "Misurare il tempo di caduta di una pallina lasciata cadere da un'altezza di «N» m.", ok),
    ("scopo", "Verificare che l'allungamento della molla è direttamente proporzionale alla «A:massa appesa|forza applicata».", ok),
    ("scopo", "Misurare la temperatura di equilibrio di due masse d'acqua, una a «C» e una a «C», versate nello stesso recipiente.", v_temps),
    ("scopo", "Misurare la velocità media di un carrello su un tratto di «N» m.", ok),
    # cenni teorici: formulas with letters only
    ("teoria", r"La densità è il rapporto tra massa e volume, $d = m / V$«A:|, e si misura in $\text{g/cm}^3$».", ok),
    ("teoria", "Il periodo si ricava dal tempo di «N» oscillazioni, $T = t / «X»$.", v_same),
    ("teoria", "La velocità media è il rapporto tra la distanza percorsa e il tempo impiegato, $v = s / t$.", ok),
    ("teoria", r"L'allungamento della molla è la differenza tra la sua lunghezza con la massa appesa e quella a riposo, $\Delta l = l - l_0$.", ok),
    ("teoria", "Il volume del cilindretto è l'aumento del livello dell'acqua nel cilindro graduato quando lo si immerge, $V = V_2 - V_1$.", ok),
    ("teoria", r"Il valore medio di $n$ misure è la loro somma divisa per $n$, $\bar{x} = \dfrac{x_1 + x_2 + \dots + x_n}{n}$.", ok),
    ("teoria", r"Il volume di un cubetto di spigolo $l$ è $V = l^3$, quindi la sua densità è $d = m / l^3$.", ok),
    # materiali e strumenti
    ("strumenti", "Bilancia elettronica, portata «N» g, sensibilità «N» g.", v_bilancia),
    ("strumenti", "«A:Cronometro digitale|Cronometro del telefono|Cronometro da polso», sensibilità $0{,}01$ s.", ok),
    ("strumenti", "Cilindro graduato da «N» mL, sensibilità «N» mL.", ok),
    ("strumenti", "Righello da «N» cm, sensibilità $0{,}1$ cm.", ok),
    ("strumenti", "Metro a nastro da «N» m, sensibilità $1$ mm.", ok),
    ("strumenti", r"Termometro digitale, portata da $-«X»$ a «C», sensibilità $0{,}1\,{}^\circ\text{C}$.", v_termo),
    # procedimento: what the group did, in the past
    ("procedimento", "Abbiamo riempito il cilindro graduato fino a «N» mL e vi abbiamo calato il cilindretto.", ok),
    ("procedimento", "Abbiamo misurato «W» volte il tempo di «N» oscillazioni.", ok),
    ("procedimento", "Abbiamo lasciato cadere la pallina da un'altezza di «N» m e fermato il cronometro quando ha toccato il pavimento.", ok),
    ("procedimento", "Abbiamo appeso alla molla masse di «N», «N» e «N» g e ogni volta ne abbiamo misurato la lunghezza con il righello.", ok),
    ("procedimento", "Abbiamo versato «N» g di acqua a «C» e «N» g di acqua a «C» nello stesso recipiente, abbiamo mescolato e letto il termometro.", ok),
    ("procedimento", "Abbiamo segnato sul pavimento due traguardi a «N» m l'uno dall'altro e cronometrato il carrello tra i due.", ok),
    ("procedimento", "Abbiamo pesato il cilindretto «W» volte, togliendolo dal piatto e rimettendolo.", ok),
]
# Models written directly as regular expressions (they need their groups in order).
RAW = [
    ("dati", rf"Misura \$({NUM})\$: \$([tmlV]) = ({NUM})\$ (s|g|cm|mL)\.", v_misura),
    ("dati", rf"Misura \$({NUM})\$: \$T = ({NUM}){CEL}\$\.", lambda m: [] if num(m.group(2))[1] == 1 else ["temperature decimals"]),
    ("dati", rf"Nella tabella \${NUM}\$ sono (riportati|riportate) (i|le) {WORDS} (tempi|masse|lunghezze|temperature|volumi) (misurati|misurate), (in [A-Za-z ]+)\.", v_tabella),
    ("dati", rf"Riga \${NUM}\$ della tabella: \$m = ({NUM})\$ g, \$V = (\d+)\$ mL\.", lambda m: [] if num(m.group(1))[1] == 1 else ["mass decimals"]),
    ("dati", rf"Riga \${NUM}\$ della tabella: \$m = (\d+)\$ g, \$l = ({NUM})\$ cm\.", lambda m: [] if num(m.group(2))[1] == 1 else ["length decimals"]),
    ("dati", rf"Nella colonna \$([tmlV])\\ \(\\text\{{(s|g|cm|mL)\}}\)\$ della tabella \$({NUM})\$ ci sono (i|le) (tempi|masse|lunghezze|temperature|volumi) delle {WORDS} misure\.", v_colonna),
    ("dati", rf"Nella colonna \$T\\ \(\{{\}}\^\\circ\\text\{{C\}}\)\$ della tabella \${NUM}\$ ci sono le temperature delle {WORDS} misure\.", ok),
    ("elaborazione", rf"\$\\bar\{{([tmlT])\}} = \\dfrac\{{({NUM})\}}\{{(\d+)\}} = ({NUM})({CEL})?\$(?: (s|g|cm))?\.", v_mean),
    ("elaborazione", rf"L'incertezza relativa (della densità|della velocità) è la somma di quelle (della massa e del volume|della distanza e del tempo): \$\\varepsilon_\{{(d|v)\}} = ({NUM}) \+ ({NUM}) = ({NUM})\$\.", v_sum),
    ("elaborazione", rf"\$d = \\dfrac\{{({NUM})\}}\{{(\d+)\}} = ({NUM})\\ \\text\{{g/cm\}}\^3\$\.", v_rho),
    ("elaborazione", rf"\$v = \\dfrac\{{({NUM})\}}\{{({NUM})\}} = ({NUM})\$ cm/s\.", v_vel),
    ("elaborazione", rf"La semidispersione (dei tempi|delle masse|delle lunghezze) è \$\\dfrac\{{({NUM}) - ({NUM})\}}\{{2\}} = ({NUM})\$ (s|g|cm)\.", v_half),
    ("elaborazione", rf"\$\\Delta l = ({NUM}) - ({NUM}) = ({NUM})\$ cm\.", v_diff),
    ("conclusioni", rf"La densità misurata, \$\(({NUM}) \\pm ({NUM})\)\\ \\text\{{g/cm\}}\^3\$, è compatibile con quella (dell'alluminio|del ferro|del rame|del piombo)\.", lambda m: density_vs_metal(m, True)),
    ("conclusioni", rf"La densità misurata, \$\(({NUM}) \\pm ({NUM})\)\\ \\text\{{g/cm\}}\^3\$, non è compatibile con quella (dell'alluminio|del ferro|del rame|del piombo): il cilindretto non è di (alluminio|ferro|rame|piombo)\.", lambda m: density_vs_metal(m, False)),
    ("conclusioni", r"Per ridurre l'incertezza servirebbe (un cilindro graduato con una scala più fitta|misurare il tempo di \$20\$ oscillazioni invece che di \$10\$|un cronometro comandato da una fotocellula|una bilancia che misuri i centesimi di grammo|un tratto più lungo per il carrello)\.", ok),
    ("conclusioni", r"(Il periodo|Il tempo di caduta|Il tempo di percorrenza) misurato è più grande di quello atteso: può dipendere dal tempo di reazione nel fermare il cronometro, che allunga tutti i tempi\.", ok),
    ("conclusioni", r"La temperatura di equilibrio misurata è più bassa di quella prevista: può dipendere dal calore ceduto al recipiente e all'aria\.", ok),
    ("conclusioni", r"La densità misurata è più grande di quella attesa: può dipendere dal cilindretto pesato ancora bagnato\.", ok),
    ("conclusioni", rf"L'incertezza relativa (del volume|del tempo), \$(\d)\\%\$, è molto più grande di quella (della massa|della distanza), \$({NUM})\\%\$: conviene migliorare la misura (del volume|del tempo)\.", v_ratio),
]
ALL_MODELS = [(p, compile_model(m), f) for p, m, f in MODELS] + [(p, re.compile(r), f) for p, r, f in RAW]


def level1(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(r"“(.*)” In quale parte della relazione va questa frase\?", text)
    if not m:
        errs.append(f"unexpected problem {text!r}")
        return None
    sentence = m.group(1)
    hits = [(p, mm, f) for p, rx, f in ALL_MODELS if (mm := rx.fullmatch(sentence))]
    if len(hits) != 1:
        errs.append(f"{len(hits)} models match {sentence!r}")
        return None
    part, mm, f = hits[0]
    errs += f(mm)
    text_choice(sample, errs, PART_NAMES, part)
    return part


# ---------------------------------------------------------------------------
# Level 2: the data table

WHAT = {
    "il tempo di caduta di una pallina": ("t", "s"),
    "il periodo di un pendolo": ("T", "s"),
    "il tempo che un carrello impiega a percorrere un tratto": ("t", "s"),
    "la lunghezza di una molla con una massa appesa": ("l", "cm"),
    "la massa di un cilindretto metallico": ("m", "g"),
    "la massa di una pallina": ("m", "g"),
    "la temperatura di equilibrio di due masse d'acqua": ("T", "C"),
}
INSTR = {"un cronometro": ("s", [Rational(1, 100)]), "un righello": ("cm", [Rational(1, 10)]), "una bilancia": ("g", [Rational(1, 10), Rational(1, 100)]), "un termometro": ("C", [Rational(1, 10)])}
VAL = rf"\$({NUM})(?:\\,\\text\{{(s|cm|g)\}}|{CEL})\$"
UNIT_HEAD = {"s": r"\text{s}", "cm": r"\text{cm}", "g": r"\text{g}", "C": r"{}^\circ\text{C}"}
UNIT_CELL = {"s": r"\ \text{s}", "cm": r"\ \text{cm}", "g": r"\ \text{g}", "C": r"\,{}^\circ\text{C}"}


def unit_of(m, i):
    return m.group(i) or "C"


def defects(latex, sym, unit, measures, d):
    """The defects of a table, from its header and cells."""
    t = re.fullmatch(r"\\begin\{array\}\{c\|c\} \\text\{n\.\} & (.*?) \\\\ \\hline (.*) \\end\{array\}", latex)
    if not t:
        raise ValueError(f"not a table: {latex!r}")
    head, rows = t.group(1), t.group(2).split(" \\\\ ")
    found = set()
    if head == sym:
        head_unit = False
    elif head == f"{sym}\\ ({UNIT_HEAD[unit]})":
        head_unit = True
    else:
        raise ValueError(f"header {head!r}")
    if len(rows) != 3:
        raise ValueError("a table needs three rows")
    cell_units = []
    for i, row in enumerate(rows):
        k, _, cell = row.partition(" & ")
        if k != str(i + 1):
            raise ValueError(f"row number {k!r}")
        has_unit = cell.endswith(UNIT_CELL[unit])
        cell_units.append(has_unit)
        if has_unit:
            cell = cell[: -len(UNIT_CELL[unit])]
        v, dd = num(cell)
        x, xd = measures[i]
        if dd == d:
            if v != x:
                raise ValueError(f"cell {cell} is not the measure {x}")
        elif dd < d:
            # the zero the instrument showed, dropped
            if v != x or (x * 10 ** d) % 10 != 0:
                raise ValueError(f"cell {cell} drops a digit that is not a final zero")
            found.add("zero-mancante")
        elif dd == d + 1:
            if (v * 10**d).floor() != x * 10**d or (v * 10 ** (d + 1)) % 10 == 0:
                raise ValueError(f"cell {cell} is not the measure {x} with one digit more")
            found.add("cifre-in-piu")
        else:
            raise ValueError(f"cell {cell} decimals")
    if any(cell_units):
        if head_unit or not all(cell_units):
            raise ValueError("units both in the header and in the cells, or in some cells only")
        found.add("unita-nelle-caselle")
    elif not head_unit:
        found.add("senza-unita")
    return found


def level2(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(rf"Un gruppo ha misurato tre volte (.+) con (un cronometro|un righello|una bilancia|un termometro) che ha la sensibilità di {VAL}: ha letto {VAL}, {VAL} e {VAL}\. Quale tabella è scritta bene\?", text)
    if not m or m.group(1) not in WHAT:
        errs.append(f"unexpected problem {text!r}")
        return None
    sym, unit = WHAT[m.group(1)]
    iu, sens = INSTR[m.group(2)]
    S, d = num(m.group(3))
    if iu != unit or S not in sens or S != Rational(1, 10**d):
        errs.append(f"instrument {m.group(2)} with sensitivity {S} for {m.group(1)}")
    units = [unit_of(m, i) for i in (4, 6, 8, 10)]
    if any(u != unit for u in units):
        errs.append("units of the measures")
    measures = [num(m.group(i)) for i in (5, 7, 9)]
    if any(dd != d for _, dd in measures):
        errs.append("measures not written with the decimals of the sensitivity")
    if len({x for x, _ in measures}) != 3:
        errs.append("repeated measures")
    zeros = [x for x, _ in measures if (x * 10**d) % 10 == 0]
    if len(zeros) < 1:
        errs.append("no measure with a final zero")
    got = options(sample, errs)
    if not got:
        return None
    opts, c = got
    found = []
    for o in opts:
        try:
            f = defects(o["latex"], sym, unit, measures, d)
        except ValueError as e:
            errs.append(str(e))
            return None
        if len(f) > 1:
            errs.append(f"a table with two defects {sorted(f)}")
        label = next(iter(f)) if f else "giusta"
        found.append(label)
        if o["values"][0] != label:
            errs.append(f"table labelled {o['values'][0]!r} is {label!r}")
    if len(set(found)) != 4:
        errs.append(f"defects not all different: {found}")
    if found.count("giusta") != 1 or found[c] != "giusta":
        errs.append("the right option is not the one good table")
    missing = {"senza-unita", "unita-nelle-caselle", "zero-mancante", "cifre-in-piu"} - set(found)
    return next(iter(missing)) if len(missing) == 1 else None


# ---------------------------------------------------------------------------
# Levels 3 and 5: the result and the expected value

RES = rf"\$\(({NUM}) \\pm ({NUM})\)(\\ \\text\{{g/cm\}}\^3|\\ \\text\{{m/s\}}\^2|{CEL}|\\,\\text\{{m/s\}}|\\,\\text\{{s\}})\$"
UNITS = {r"\ \text{g/cm}^3": "g/cm3", r"\ \text{m/s}^2": "m/s2", r"\,{}^\circ\text{C}": "C", r"\,\text{m/s}": "m/s", r"\,\text{s}": "s"}
EXP = {
    "la densità dell'acqua distillata": (r"La densità dell'acqua è \$1\{,\}00\\ \\text\{g/cm\}\^3\$\.", Rational(1), "g/cm3"),
    "l'accelerazione di gravità con un pendolo": (r"Il valore atteso è \$9\{,\}8\\ \\text\{m/s\}\^2\$\.", Rational(98, 10), "m/s2"),
    "la temperatura dell'acqua che bolle, in un laboratorio al livello del mare": (rf"Il valore atteso è \$100\{{,\}}0{CEL}\$\.", Rational(100), "C"),
    r"la velocità del suono nell'aria a $20\,{}^\circ\text{C}$": (r"Il valore atteso è \$343\\,\\text\{m/s\}\$\.", Rational(343), "m/s"),
}
# Level 5: causes that can shift the measures, without the direction.
CAUSES = {
    "density": ["La bilancia non è stata azzerata prima delle pesate.", "Il livello dell'acqua nel cilindro graduato è stato letto con l'occhio non all'altezza della superficie."],
    "timing": ["Il cronometro è stato fatto partire e fermato a mano.", "La lunghezza del filo è stata misurata con un metro a nastro vecchio, mai confrontato con un altro."],
    "boiling": ["Il termometro non era mai stato controllato con un altro termometro.", "La colonnina del termometro è stata letta con l'occhio non alla sua altezza."],
    "sound": ["Il tempo dell'eco è stato misurato con un cronometro azionato a mano.", "La distanza dalla parete è stata misurata con un metro a nastro vecchio, mai confrontato con un altro."],
}
CAUSE_OF = {"la densità del cilindretto": "density", "la densità dell'acqua distillata": "density", "l'accelerazione di gravità con un pendolo": "timing", "la temperatura dell'acqua che bolle, in un laboratorio al livello del mare": "boiling", r"la velocità del suono nell'aria a $20\,{}^\circ\text{C}$": "sound"}


def expected(measured, rest, errs, level):
    """(E, unit, the text after the expected sentence) for the context."""
    if measured == "la densità del cilindretto":
        m = re.match(rf"Il cilindretto è di (alluminio|ferro|rame|piombo), che ha la densità di \$({NUM})\\ \\text\{{g/cm\}}\^3\$\. ?", rest)
        if not m:
            return None
        E = METALS[m.group(1)][1]
        if val(m.group(2)) != E:
            errs.append(f"density of {m.group(1)} written {m.group(2)}")
        return E, "g/cm3", rest[m.end():]
    p = re.fullmatch(rf"il periodo di un pendolo lungo \$(\d+)\\,\\text\{{cm\}}\$", measured)
    if p and level == 5:
        m = re.match(rf"La teoria lo dà di \$({NUM})\\,\\text\{{s\}}\$\. ?", rest)
        if not m:
            return None
        L = Rational(int(p.group(1)), 100)
        T = 2 * pi * sqrt(L / Rational(98, 10))
        E, dE = num(m.group(1))
        if dE != 2 or abs(T - E) > Rational(1, 200):
            errs.append(f"period of a {L} m pendulum written {E}, theory {T.evalf(5)}")
        return E, "s", rest[m.end():]
    if measured in EXP:
        rx, E, unit = EXP[measured]
        m = re.match(rx + " ?", rest)
        if not m:
            return None
        return E, unit, rest[m.end():]
    return None


def result_errors(x, dx, unit, want_unit):
    errs = []
    (X, xd), (D, dd) = x, dx
    s = str(D * 10**dd)
    if not re.fullmatch(r"[1-9]0*", s):
        errs.append(f"uncertainty {D} has more than one significant digit")
    u = Rational(10) ** (len(s) - 1) / 10**dd
    if xd != dd or (X / u).q != 1:
        errs.append(f"value {X} not written to the digit of the uncertainty {D}")
    if D / X > Rational(1, 5):
        errs.append("uncertainty over 20%")
    if unit != want_unit:
        errs.append(f"unit {unit} for a quantity in {want_unit}")
    return errs, u


VERDICTS3 = {
    "compatibile": "Compatibile: il valore atteso sta nell'intervallo della misura",
    "non-compatibile": "Non compatibile: il valore atteso è fuori dall'intervallo",
    "diversa-sbagliata": "Sbagliata: è diversa dal valore atteso",
    "rifare": "Da rifare finché non dà il valore atteso",
}
VERDICTS5 = {
    "compatibile": "Compatibile: nessun segno di errore sistematico",
    "eccesso": "Non compatibile: probabile errore sistematico che aumenta le misure",
    "difetto": "Non compatibile: probabile errore sistematico che diminuisce le misure",
    "casuali": "Non compatibile: colpa degli errori casuali, basta ripetere le misure",
}


def level35(sample, errs, level):
    text = prose(sample["problem"])
    if level == 3:
        m = re.fullmatch(rf"Il gruppo ha misurato (.+?): {RES}\. (.*)", text)
        tail_q = "Che cosa si conclude sulla misura?"
    else:
        m = re.fullmatch(rf"Il gruppo ha misurato {WORDS} volte (.+?) e ha scritto il risultato {RES}\. (.*)", text)
        tail_q = "Quale conclusione segue dai dati?"
    if not m:
        errs.append(f"unexpected problem {text!r}")
        return None
    g = m.groups()[1:] if level == 5 else m.groups()
    measured, xs, ds, ut, rest = g
    got = expected(measured, rest, errs, level)
    if not got:
        errs.append(f"unknown context or expected value: {measured!r} / {rest!r}")
        return None
    E, want_unit, rest = got
    x, dx = num(xs), num(ds)
    e, u = result_errors(x, dx, UNITS[ut], want_unit)
    errs += e
    X, D = x[0], dx[0]
    lo, hi = X - D, X + D
    inside = lo + u <= E <= hi - u
    outside = E <= lo - u or E >= hi + u
    if not inside and not outside:
        errs.append(f"expected value {E} on the edge of [{lo}, {hi}]")
        return None
    if level == 3:
        if rest != tail_q:
            errs.append(f"unexpected question {rest!r}")
        if inside and X == E:
            errs.append("compatible and equal to the expected value: no trap")
        truth = "compatibile" if inside else "non-compatibile"
        text_choice(sample, errs, VERDICTS3, truth)
        return truth
    kind = "timing" if measured.startswith("il periodo di un pendolo") else CAUSE_OF.get(measured)
    cause = rest[: -len(tail_q) - 1] if rest.endswith(" " + tail_q) else None
    if cause not in CAUSES.get(kind, []):
        errs.append(f"unexpected cause or question {rest!r}")
    if cause and re.search(r"aument|diminu|allung|accorc|più|meno", cause):
        errs.append("the cause says the direction")
    if inside:
        truth = "compatibile"
    elif abs(X - E) >= 3 * D:
        truth = "eccesso" if X > E else "difetto"
    else:
        errs.append(f"not compatible but less than three uncertainties away: {X} ± {D}, {E}")
        return None
    text_choice(sample, errs, VERDICTS5, truth)
    return truth


# ---------------------------------------------------------------------------
# Level 4: which measure to improve

FORMULAS = {
    r"d = m / V": ("Per misurare la densità di un cilindretto un gruppo", ("m", "g", "massa", "La massa"), ("V", "mL", "volume", "Il volume"), 1),
    "v = s / t": ("Per misurare la velocità media di un carrello un gruppo", ("s", "m", "distanza", "La distanza"), ("t", "s", "tempo", "Il tempo"), 1),
    r"A = a \cdot b": ("Per misurare l'area di un rettangolo di lati $a$ e $b$ un gruppo", ("a", "cm", "lato-a", "Il lato a"), ("b", "cm", "lato-b", "Il lato b"), 1),
    r"d = m / l^3": ("Per misurare la densità di un cubetto un gruppo", ("m", "g", "massa", "La massa"), ("l", "cm", "spigolo", "Lo spigolo"), 3),
}
DATUM = rf"\$([a-zA-Z]) = \(({NUM}) \\pm ({NUM})\)\\,\\text\{{([a-zA-Z]+)\}}\$"


def level4(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(rf"(.+) usa \$(.+?)\$ e trova {DATUM} e {DATUM}\. Quale misura conviene migliorare per ridurre l'incertezza del risultato\?", text)
    if not m or m.group(2) not in FORMULAS:
        errs.append(f"unexpected problem {text!r}")
        return None
    intro, A, B, pw = FORMULAS[m.group(2)]
    if m.group(1) != intro:
        errs.append("intro does not match the formula")
    data = []
    for (sym, unit, _, _), i in ((A, 3), (B, 7)):
        if m.group(i) != sym or m.group(i + 3) != unit:
            errs.append(f"datum {m.group(i)} in {m.group(i + 3)}, expected {sym} in {unit}")
        x, dx = num(m.group(i + 1)), num(m.group(i + 2))
        e, _ = result_errors(x, dx, unit, unit)
        errs += [s for s in e if "20%" not in s]
        data.append((x[0], dx[0]))
    ea = data[0][1] / data[0][0]
    eb = data[1][1] / data[1][0]
    ca, cb = ea, pw * eb
    if ca + cb > Rational(1, 5):
        errs.append("relative uncertainty of the result over 20%")
    trap = pw == 3 and eb < ea and cb > ca
    if ca == cb:
        truth, case = "stesso", "uguali"
    else:
        r = max(ca, cb) / min(ca, cb)
        # The trap of the exponent: eps_l < eps_m but 3 eps_l > eps_m, so the ratio is below 3; at least 2.
        need = 2 if trap else 3
        if r < need:
            errs.append(f"contributions {ca} and {cb} nearly equal (ratio {float(r):.2f})")
        truth = A[2] if ca > cb else B[2]
        case = "trappola" if trap else ("primo" if ca > cb else "secondo")
    texts = {A[2]: A[3], B[2]: B[3], "stesso": "Tutte e due allo stesso modo", "nessuna": "Nessuna: l'incertezza del risultato non dipende dai dati"}
    text_choice(sample, errs, texts, truth)
    return case


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    for field in [sample.get("problem", ""), sample.get("solution", ""), *sample.get("steps", []), *(o["latex"] for o in sample.get("answer", {}).get("options", []))]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    lvl = sample["level"]
    try:
        if lvl == 1:
            case = level1(sample, errs)
        elif lvl == 2:
            case = level2(sample, errs)
        elif lvl in (3, 5):
            case = level35(sample, errs, lvl)
        elif lvl == 4:
            case = level4(sample, errs)
        else:
            return [f"unknown level {lvl}"], None
    except ValueError as e:
        return errs + [str(e)], None
    return errs, case
