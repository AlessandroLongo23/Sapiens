"""Checker for fis-rifrazione (specs/exercises/fis-rifrazione.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/34-fis-rifrazione.md). Every problem is read back
from its text: the media and their indices, the angles. Snell's law and the critical angle are computed with sympy
(exact sines of pi*a/180, evaluated with 50 digits), rounded half up to the degree or to three significant figures,
refusing values within 1e-9 of a rounding boundary. The scene must draw the media and the incident ray of the text,
never the answer; the solution scene the refracted (or reflected) ray at the right angle.
"""
import re

from sympy import Rational, asin, pi, sin

from checkers._vettori import check_choice, common, prose, round_deg, round_sig, sig_of

CASE_RANGES = {
    1: {"velocita": (0.40, 0.60), "indice": (0.40, 0.60)},
    2: {"tabella": (0.65, 0.85), "plastica": (0.15, 0.35)},
    4: {"dalla normale": (0.55, 0.75), "dalla superficie": (0.25, 0.45)},
    6: {"totale": (0.32, 0.48), "esce": (0.27, 0.43), "verso il più rifrangente": (0.18, 0.32)},
}

TABLE = {"aria": "1{,}00", "acqua": "1{,}33", "ghiaccio": "1{,}31", "alcol etilico": "1{,}36", "vetro": "1{,}50", "diamante": "2{,}42"}
# How the text names a medium after "da" / "a" / "verso".
DA = {"dall'aria": "aria", "dall'acqua": "acqua", "dal ghiaccio": "ghiaccio", "dall'alcol etilico": "alcol etilico", "dal vetro": "vetro", "dal diamante": "diamante", "da una plastica": "plastica"}
A = {"all'aria": "aria", "all'acqua": "acqua", "al ghiaccio": "ghiaccio", "all'alcol etilico": "alcol etilico", "al vetro": "vetro", "al diamante": "diamante", "a una plastica": "plastica"}
IL = {"l'aria": "aria", "l'acqua": "acqua", "il ghiaccio": "ghiaccio", "l'alcol etilico": "alcol etilico", "il vetro": "vetro", "il diamante": "diamante"}
NUM = r"(\d+\{,\}\d+)"
C = Rational(3)  # 10^8 m/s


def rad(d):
    return pi * Rational(d) / 180


def deg(x):
    return x * 180 / pi


def index(name, written, errs):
    """The index of a named medium, checked against the lesson's table (or the plastics' range)."""
    if name == "plastica":
        k = int(written.replace("{,}", ""))
        if not (141 <= k <= 169 and k % 10):
            errs.append(f"plastic index {written}")
    elif TABLE.get(name) != written:
        errs.append(f"index of {name}: {written}")
    return Rational(written.replace("{,}", "."))


def deg_option(latex):
    m = re.fullmatch(r"(\d+)\^\\circ", latex)
    return int(m.group(1)) if m else None


def options_are(sample, errs, pattern, what):
    for o in sample["answer"]["options"]:
        if not re.fullmatch(pattern, o["latex"]):
            errs.append(f"{what} option {o['latex']!r}")


def angle_options(sample, errs, allow90=False):
    for o in sample["answer"]["options"]:
        d = deg_option(o["latex"])
        if d is None or not (1 <= d <= (90 if allow90 else 89)):
            errs.append(f"angle option {o['latex']!r}")


def scene_media(sc, top, ntop, bottom, nbottom, errs, where):
    d = sc["data"]
    shown = lambda s: s.replace("{,}", ",")  # noqa: E731
    if d.get("sopra") != {"nome": top, "n": shown(ntop)} or d.get("sotto", {}).get("nome") != bottom:
        errs.append(f"{where}: media {d.get('sopra')} {d.get('sotto')}")
    if nbottom is not None and d.get("sotto", {}).get("n") != shown(nbottom):
        errs.append(f"{where}: lower index {d.get('sotto')}")


def check_scene(sample, errs, top, ntop, bottom, nbottom, theta1, arc, refracted=None, reflected=False, problem=True):
    key = "scene" if problem else "solutionScene"
    sc = sample.get(key)
    if not sc or sc.get("type") != "raggio-due-mezzi":
        errs.append(f"{key} missing")
        return
    d = sc["data"]
    scene_media(sc, top, ntop, bottom, nbottom, errs, key)
    if abs(float(d.get("incidente", -99)) - float(theta1)) > 0.05:
        errs.append(f"{key}: incident ray at {d.get('incidente')}, not {float(theta1):.2f}")
    if arc is not None and d.get("arco") != arc:
        errs.append(f"{key}: arc {d.get('arco')} != {arc}")
    r = d.get("rifratto")
    if refracted is None:
        if r is not None:
            errs.append(f"{key}: refracted ray drawn")
    elif r is None or abs(float(r["angolo"]) - float(refracted)) > 0.05:
        errs.append(f"{key}: refracted ray {r}, not {float(refracted):.2f}")
    if bool(d.get("riflesso")) != reflected:
        errs.append(f"{key}: reflected ray {d.get('riflesso')}")


def level1(s, sample, errs):
    m = re.fullmatch(r"(Il diamante|Il vetro|Il ghiaccio|L'acqua|L'alcol etilico|Una plastica trasparente) ha indice di rifrazione \$n = " + NUM + r"\$\. A che velocità viaggia la luce al suo interno\? Usa \$c = 3\{,\}00 \\cdot 10\^8\\,\\text\{m/s\}\$\.", s)
    if m:
        name = {"Una plastica trasparente": "plastica"}.get(m.group(1), m.group(1).split(" ", 1)[1] if m.group(1).startswith("Il ") else m.group(1)[2:])
        n = index(name, m.group(2), errs)
        v = round_sig((C / n).evalf(50), 3)
        if v is None:
            errs.append("speed at a rounding boundary")
            return None
        check_choice(sample, errs, f"{v} \\cdot 10^8\\,\\text{{m/s}}")
        options_are(sample, errs, r"\d\{,\}\d\d \\cdot 10\^[78]\\,\\text\{m/s\}", "speed")
        return "velocita"
    m = re.fullmatch(r"(In un liquido trasparente|In un cristallo|In una plastica trasparente) la luce viaggia a \$" + NUM + r" \\cdot 10\^8\\,\\text\{m/s\}\$\. Quanto vale l'indice di rifrazione\? Usa \$c = 3\{,\}00 \\cdot 10\^8\\,\\text\{m/s\}\$\.", s)
    if not m:
        errs.append(f"level 1 text: {s!r}")
        return None
    vv = Rational(m.group(2).replace("{,}", "."))
    if sig_of(m.group(2)) != 3 or not Rational(125, 100) <= vv <= Rational(230, 100):
        errs.append("speed datum")
    n = round_sig((C / vv).evalf(50), 3)
    if n is None:
        errs.append("index at a rounding boundary")
        return None
    check_choice(sample, errs, f"n = {n}")
    options_are(sample, errs, r"n = \d\{,\}\d\d\d?", "index")
    return "indice"


def refraction(s, sample, errs, lvl):
    m = re.fullmatch(
        r"Un raggio di luce passa (dall'\S+|dal \S+|da una plastica|dall'alcol etilico) \(\$n = " + NUM + r"\$\) (all'\S+|al \S+|a una plastica|all'alcol etilico) \(\$n = " + NUM + r"\$\) "
        r"(?:con un angolo di incidenza di \$(\d+)\^\\circ\$\. Quanto vale l'angolo di rifrazione\?|e forma un angolo di \$(\d+)\^\\circ\$ con la superficie di separazione\. Quanto vale l'angolo di rifrazione, misurato dalla normale\?)",
        s,
    )
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    top, bottom = DA.get(m.group(1)), A.get(m.group(3))
    if top is None or bottom is None:
        errs.append("unknown media")
        return None
    n1, n2 = index(top, m.group(2), errs), index(bottom, m.group(4), errs)
    surface = m.group(6) is not None
    theta1 = 90 - int(m.group(6)) if surface else int(m.group(5))
    if lvl == 2:
        if top != "aria" or n2 <= n1 or surface or not 15 <= theta1 <= 80:
            errs.append("level 2 constraints")
    else:
        if n1 <= n2:
            errs.append("level 4: not towards a less refracting medium")
        elif not 10 <= theta1 <= deg(asin(n2 / n1)).evalf(30) - 3:
            errs.append("level 4: angle out of range")
    x = n1 * sin(rad(theta1)) / n2
    if x >= 1:
        errs.append("no refracted ray: total reflection")
        return None
    exact = deg(asin(x)).evalf(50)
    right = round_deg(exact)
    if right is None:
        errs.append("angle at a rounding boundary")
        return None
    check_choice(sample, errs, f"{right}^\\circ")
    angle_options(sample, errs)
    arc = {"rif": "superficie", "testo": f"{90 - theta1}°"} if surface else {"rif": "normale", "testo": f"{theta1}°"}
    ntop, nbot = m.group(2), m.group(4)
    check_scene(sample, errs, top, ntop, bottom, nbot, theta1, arc)
    check_scene(sample, errs, top, ntop, bottom, nbot, theta1, arc, refracted=exact, problem=False)
    if lvl == 2:
        return "plastica" if bottom == "plastica" else "tabella"
    return "dalla superficie" if surface else "dalla normale"


def level3(s, sample, errs):
    m = re.fullmatch(r"Un raggio di luce passa dall'aria \(\$n = 1\{,\}00\$\) a un materiale trasparente\. L'angolo di incidenza è di \$(\d+)\^\\circ\$ e l'angolo di rifrazione è di \$(\d+)\^\\circ\$\. Quanto vale l'indice di rifrazione del materiale\?", s)
    if not m:
        errs.append(f"level 3 text: {s!r}")
        return None
    t1, t2 = int(m.group(1)), int(m.group(2))
    n = (sin(rad(t1)) / sin(rad(t2))).evalf(50)
    if not (30 <= t1 <= 80 and 10 <= t2 < t1 and Rational(125, 100) <= n <= Rational(245, 100)):
        errs.append("level 3 constraints")
    right = round_sig(n, 3)
    if right is None:
        errs.append("index at a rounding boundary")
        return None
    check_choice(sample, errs, f"n = {right}")
    options_are(sample, errs, r"n = \d\{,\}\d\d\d?", "index")
    d = sample.get("scene", {}).get("data", {})
    if sample.get("scene", {}).get("type") != "raggio-due-mezzi" or d.get("incidente") != t1 or d.get("arco") != {"rif": "normale", "testo": f"{t1}°"} or d.get("rifratto") != {"angolo": t2, "testo": f"{t2}°"} or d.get("sotto", {}).get("n") != "?":
        errs.append(f"level 3 scene {d}")
    ds = sample.get("solutionScene", {}).get("data", {})
    if ds.get("incidente") != t1 or ds.get("rifratto") != {"angolo": t2, "testo": f"{t2}°"} or ds.get("sotto") != {"nome": "materiale", "n": right.replace("{,}", ",")}:
        errs.append(f"level 3 solution scene {ds}")
    return "indice"


PAIRS = {("acqua", "aria"), ("ghiaccio", "aria"), ("alcol etilico", "aria"), ("vetro", "aria"), ("diamante", "aria"), ("vetro", "acqua"), ("diamante", "acqua"), ("diamante", "vetro"), ("plastica", "aria")}


def level5(s, sample, errs):
    m = re.fullmatch(r"Qual è l'angolo limite per la luce che passa (dall'\S+|dal \S+|da una plastica|dall'alcol etilico) \(\$n = " + NUM + r"\$\) (all'\S+|al \S+) \(\$n = " + NUM + r"\$\)\?", s)
    if not m:
        errs.append(f"level 5 text: {s!r}")
        return None
    top, bottom = DA.get(m.group(1)), A.get(m.group(3))
    if (top, bottom) not in PAIRS:
        errs.append(f"pair {top} {bottom}")
        return None
    n1, n2 = index(top, m.group(2), errs), index(bottom, m.group(4), errs)
    if n2 >= n1:
        errs.append("no critical angle")
        return None
    exact = deg(asin(n2 / n1)).evalf(50)
    right = round_deg(exact)
    if right is None:
        errs.append("critical angle at a rounding boundary")
        return None
    check_choice(sample, errs, f"{right}^\\circ")
    angle_options(sample, errs)
    if sample.get("scene"):
        errs.append("level 5 must not have a problem scene")
    check_scene(sample, errs, top, m.group(2), bottom, m.group(4), exact, {"rif": "normale", "testo": f"{right}°"}, refracted=90, problem=False)
    return None


def level6(s, sample, errs):
    m = re.fullmatch(
        r"Un raggio di luce va (dall'\S+|dal \S+|dall'alcol etilico) \(\$n = " + NUM + r"\$\) verso (l'\S+|il \S+|l'alcol etilico) \(\$n = " + NUM + r"\$\) e arriva sulla superficie di separazione con un angolo di incidenza di \$(\d+)\^\\circ\$\. Che cosa succede\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text: {s!r}")
        return None
    top, bottom = DA.get(m.group(1)), IL.get(m.group(3))
    if top is None or bottom is None:
        errs.append("unknown media")
        return None
    n1, n2 = index(top, m.group(2), errs), index(bottom, m.group(4), errs)
    t1 = int(m.group(5))
    x = (n1 * sin(rad(t1)) / n2).evalf(50)
    for o in sample["answer"]["options"]:
        if o["latex"] != "\\text{riflessione totale}":
            mm = re.fullmatch(r"\\text\{raggio rifratto a \} (\d+)\^\\circ", o["latex"])
            if not mm or not 1 <= int(mm.group(1)) <= 90:
                errs.append(f"option {o['latex']!r}")
    arc = {"rif": "normale", "testo": f"{t1}°"}
    check_scene(sample, errs, top, m.group(2), bottom, m.group(4), t1, arc)
    if n1 > n2:
        crit = deg(asin(n2 / n1)).evalf(50)
        if x > 1:
            if not crit + 3 <= t1 <= 85:
                errs.append("total reflection angle range")
            check_choice(sample, errs, "\\text{riflessione totale}")
            check_scene(sample, errs, top, m.group(2), bottom, m.group(4), t1, arc, reflected=True, problem=False)
            return "totale"
        if not 10 <= t1 <= crit - 3:
            errs.append("exit angle range")
        kind = "esce"
    else:
        if not 45 <= t1 <= 85:
            errs.append("angle range towards the denser medium")
        kind = "verso il più rifrangente"
    exact = deg(asin(x)).evalf(50)
    right = round_deg(exact)
    if right is None:
        errs.append("angle at a rounding boundary")
        return None
    check_choice(sample, errs, f"\\text{{raggio rifratto a }} {right}^\\circ")
    if "\\text{riflessione totale}" not in [o["latex"] for o in sample["answer"]["options"]]:
        errs.append("total reflection missing among the options")
    check_scene(sample, errs, top, m.group(2), bottom, m.group(4), t1, arc, refracted=exact, problem=False)
    return kind


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    try:
        s = prose(sample["problem"])
        if lvl == 1:
            kind = level1(s, sample, errs)
        elif lvl in (2, 4):
            kind = refraction(s, sample, errs, lvl)
        elif lvl == 3:
            kind = level3(s, sample, errs)
        elif lvl == 5:
            kind = level5(s, sample, errs)
        else:
            kind = level6(s, sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
