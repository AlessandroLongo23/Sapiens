"""Checker for chim-curve-riscaldamento (specs/exercises/chim-curve-riscaldamento.md).

Written from the spec and lesson 20, not from the generator. Levels 1-5 read the curve from the scene
(`curva-temperatura-tempo`, points [minute, °C]) and find its stretches: a stretch with the same temperature at both
ends is a plateau (a change of state at constant temperature), one that rises slower than the others while the
material changes state is an interval (a mixture):
- level 1: the two plateaus of a heating curve are melting (lower) and boiling (higher);
- level 2: the stretch holding the minute asked gives what is in the container: solid, solid and liquid, liquid,
  liquid and vapour, vapour, in the order of a heating curve;
- level 3: a plateau means a pure substance, a slow rise a mixture;
- level 4: the plateaus are compared with the table in the text (checked against the lesson's values); exactly one
  substance has both;
- level 5: on a cooling curve the freezing point is the plateau, not the lowest point before it; the freezing ends
  where the plateau ends;
- level 6: the time is proportional to the mass, or to the latent heat, computed with exact fractions and rounded to
  two significant figures, away from a rounding boundary.
"""
import re

from sympy import Rational

from checkers._fis_grandezze import check_choice, common, option_text, parse_dec, prose_and_extra

CASE_RANGES = {
    1: {"fusione": (0.4, 0.6), "ebollizione": (0.4, 0.6)},
    3: {"pura": (0.4, 0.6), "miscuglio": (0.4, 0.6)},
    5: {"temperatura": (0.4, 0.6), "tempo": (0.4, 0.6)},
    6: {"massa": (0.4, 0.6), "calore-latente": (0.4, 0.6)},
}

SUBSTANCES = {
    "acqua": (0, 100),
    "etanolo": (-114, 78),
    "acetone": (-95, 56),
    "naftalene": (80, 218),
    "mercurio": (-39, 357),
    "acido acetico": (17, 118),
    "cicloesano": (7, 81),
    "metanolo": (-98, 65),
    "glicole etilenico": (-13, 197),
}
LATENT = {"ghiaccio": (334, 2260), "etanolo solido": (108, 855)}
DEG = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"


def curve(sample, errs):
    sc = sample.get("scene") or {}
    if sc.get("type") != "curva-temperatura-tempo":
        errs.append("no curve")
        return None
    pts = sc["data"]["punti"]
    if any(pts[i + 1][0] <= pts[i][0] for i in range(len(pts) - 1)):
        errs.append("times not increasing")
    if not sc.get("alt"):
        errs.append("scene without alt")
    return [(Rational(m), Rational(T)) for m, T in pts]


def plateaus(pts):
    return [(a, b) for a, b in zip(pts, pts[1:]) if a[1] == b[1]]


def deg_of(o):
    m = re.fullmatch(r"(-?\d+)\\,\^\\circ\\text\{C\}", o["latex"])
    if not m:
        raise ValueError(f"not a temperature: {o['latex']!r}")
    return int(m.group(1))


def level1(sample, prose, errs):
    pts = curve(sample, errs)
    m = re.fullmatch(r"Il grafico è la curva di riscaldamento di una sostanza pura, scaldata da solida fino a quando è tutta vapore\. Qual è la sua temperatura di (fusione|ebollizione)\?", prose)
    if not m or not pts:
        errs.append("level 1 not recognised")
        return None
    pl = plateaus(pts)
    if len(pl) != 2 or not all(pts[i][1] < pts[i + 1][1] for i in range(len(pts) - 1) if pts[i][1] != pts[i + 1][1]):
        errs.append("a heating curve with two plateaus expected")
        return None
    tf, te = sorted(p[0][1] for p in pl)
    right = tf if m.group(1) == "fusione" else te
    check_choice(sample["answer"], lambda o: deg_of(o) == right, errs)
    return m.group(1)


CONTENTS = ["Solo solido", "Solido e liquido", "Solo liquido", "Liquido e vapore", "Solo vapore"]


def level2(sample, prose, errs):
    pts = curve(sample, errs)
    m = re.fullmatch(r"Il grafico è la curva di riscaldamento di una sostanza pura\. Che cosa c'è nel recipiente al minuto (\d+)\?", prose)
    if not m or not pts:
        errs.append("level 2 not recognised")
        return None
    t = int(m.group(1))
    if len(pts) != 6 or len(plateaus(pts)) != 2:
        errs.append("five stretches expected")
        return None
    k = [i for i in range(5) if pts[i][0] < t < pts[i + 1][0]]
    if len(k) != 1:
        errs.append(f"minute {t} at a corner or outside")
        return None
    k = k[0]
    flat = pts[k][1] == pts[k + 1][1]
    if flat != (k in (1, 3)):
        errs.append("stretches not in the order of a heating curve")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == CONTENTS[k], errs)
    return None


def level3(sample, prose, errs):
    pts = curve(sample, errs)
    m = re.fullmatch(r"Il grafico mostra la temperatura di (un solido che viene scaldato finché fonde e il liquido si scalda|un liquido che viene scaldato finché bolle)\. Che cosa si può dire del materiale\?", prose)
    if not m or not pts or len(pts) != 4:
        errs.append("level 3 not recognised")
        return None
    verb = "fonde" if "fonde" in m.group(1) else "bolle"
    slopes = [(b[1] - a[1]) / (b[0] - a[0]) for a, b in zip(pts, pts[1:])]
    if slopes[1] == 0:
        pure = True
    elif 0 < slopes[1] * 2 <= min(slopes[0], slopes[2]):
        pure = False
    else:
        errs.append(f"middle stretch neither a plateau nor a slow rise: {slopes}")
        return None
    right = f"È una sostanza pura: {verb} a temperatura costante" if pure else f"È un miscuglio: {verb} in un intervallo di temperature"

    def read(o):
        t = option_text(o["latex"])
        if not re.fullmatch(r"È (una sostanza pura|un miscuglio): " + verb + r" (a temperatura costante|in un intervallo di temperature)", t):
            raise ValueError(f"option not read: {t!r}")
        return t

    check_choice(sample["answer"], lambda o: read(o) == right, errs)
    return "pura" if pure else "miscuglio"


def level4(sample, prose, errs):
    pts = curve(sample, errs)
    m = re.fullmatch(r"Il grafico è la curva di riscaldamento di una sostanza pura, alla pressione normale\. Temperature di fusione e di ebollizione di quattro sostanze: (.+)\. Quale sostanza è\?", prose)
    if not m or not pts:
        errs.append("level 4 not recognised")
        return None
    table = {x.strip(): (int(a), int(b)) for x, a, b in re.findall(r"([a-z ]+) " + DEG + r" e " + DEG, m.group(1))}
    if len(table) != 4:
        errs.append(f"four substances expected: {table}")
        return None
    for x, v in table.items():
        if SUBSTANCES.get(x) != v:
            errs.append(f"data of {x} differ from the lesson")
    pl = sorted(p[0][1] for p in plateaus(pts))
    if len(pl) != 2:
        errs.append("two plateaus expected")
        return None
    extra = sample["scene"]["data"].get("temperature", [])
    if sorted(extra) != pl:
        errs.append("the plateaus' temperatures are not marked on the axis")
    hit = [x for x, v in table.items() if (v[0], v[1]) == tuple(pl)]
    if len(hit) != 1:
        errs.append(f"{len(hit)} substances match")
        return None
    check_choice(sample["answer"], lambda o: option_text(o["latex"]).lower() == hit[0], errs)
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]).lower() not in table:
            errs.append("option not in the table")
    return None


def level5(sample, prose, errs):
    pts = curve(sample, errs)
    if not pts or len(pts) != 5:
        errs.append("level 5 curve not recognised")
        return None
    pl = plateaus(pts)
    if len(pl) != 1:
        errs.append("one plateau expected")
        return None
    (a, b) = pl[0]
    i = pts.index(a)
    if not (i >= 2 and pts[i - 1][1] < a[1] and pts[0][1] > a[1] and pts[-1][1] < a[1]):
        errs.append("not a cooling curve with supercooling before the plateau")
    if prose == "Il grafico è la curva di raffreddamento di un liquido puro, che alla fine è tutto solido. Qual è la sua temperatura di solidificazione?":
        check_choice(sample["answer"], lambda o: deg_of(o) == a[1], errs)
        return "temperatura"
    if prose == "Il grafico è la curva di raffreddamento di un liquido puro, con la sopraffusione. Dopo quanti minuti dall’inizio la sostanza è tutta solida?":

        def minutes(o):
            mm = re.fullmatch(r"(\d+)\\,\\text\{min\}", o["latex"])
            if not mm:
                raise ValueError(f"not minutes: {o['latex']!r}")
            return int(mm.group(1))

        check_choice(sample["answer"], lambda o: minutes(o) == b[0], errs)
        return "tempo"
    errs.append("level 5 question not recognised")
    return None


def sig2(x):
    """Two significant figures of a positive Rational, as a Rational; None too close to a boundary."""
    d = 0 if x >= 10 else 1 if x >= 1 else 2
    s = x * 10**d
    frac = s - (s.p // s.q)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**6):
        return None
    return Rational(int(s + Rational(1, 2)), 10**d)


def minutes_dec(o):
    mm = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\,\\text\{min\}", o["latex"])
    if not mm:
        raise ValueError(f"not minutes: {o['latex']!r}")
    return parse_dec(mm.group(1))


def level6(sample, prose, errs):
    num = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{min\}\$"
    m = re.fullmatch(r"Con un fornello, \$(\d+)\\,\\text\{g\}\$ (?:di ghiaccio a \$0\\,\^\\circ\\text\{C\}\$ fondono|d'acqua a \$100\\,\^\\circ\\text\{C\}\$ bollono via, diventando tutti vapore,) in " + num + r"\. Con lo stesso fornello, quanto dura (?:la fusione|l'ebollizione) di \$(\d+)\\,\\text\{g\}\$\?", prose)
    if m:
        m1, t1, m2 = Rational(m.group(1)), parse_dec(m.group(2)), Rational(m.group(3))
        exact, kind = t1 * m2 / m1, "massa"
    else:
        m = re.fullmatch(r"Con un fornello, (la fusione di una certa massa di (ghiaccio|etanolo solido)|l'ebollizione di una certa massa (d'acqua|di etanolo)) dura " + num + r"\. Con lo stesso fornello, quanto dura (?:l'ebollizione della stessa massa (?:d'acqua|di etanolo)|la fusione della stessa massa di (?:ghiaccio|etanolo solido))\? Calore latente di fusione \$(\d+)\\,\\text\{kJ/kg\}\$, di vaporizzazione \$(\d+)\\,\\text\{kJ/kg\}\$\.", prose)
        if not m:
            errs.append(f"level 6 not recognised: {prose!r}")
            return None
        solid = m.group(2) or ("ghiaccio" if m.group(3) == "d'acqua" else "etanolo solido")
        Lf, Lv = int(m.group(5)), int(m.group(6))
        if LATENT[solid] != (Lf, Lv):
            errs.append("latent heats differ from the lesson")
        t1 = parse_dec(m.group(4))
        forward = m.group(1).startswith("la fusione")
        exact = t1 * Rational(Lv, Lf) if forward else t1 * Rational(Lf, Lv)
        kind = "calore-latente"
    right = sig2(exact)
    if right is None:
        errs.append("answer too close to a rounding boundary")
        return kind
    if right >= 10 and right % 10 == 0:
        errs.append(f"answer {right} min has an ambiguous zero")
    if not (Rational(1, 10) < exact < Rational(199, 2)):
        errs.append(f"answer {exact} out of range")
    check_choice(sample["answer"], lambda o: minutes_dec(o) == right, errs)
    return kind


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(lvl)
    if not fn:
        return [f"unknown level {lvl}"], None
    if lvl == 6 and sample.get("scene"):
        errs.append("unexpected scene")
    if lvl <= 5 and sample.get("scene"):
        # the temperatures the solution names are corners of the curve
        corners = {int(T) for _, T in sample["scene"]["data"]["punti"]}
        for T in re.findall(DEG, " ".join(sample["steps"])):
            if int(T) not in corners:
                errs.append(f"the solution names {T} °C, not on the curve")
    return errs, fn(sample, prose, errs)
