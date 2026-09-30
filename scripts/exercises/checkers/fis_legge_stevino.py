"""Checker for fis-legge-stevino (specs/exercises/fis-legge-stevino.md), written from the spec and the lesson
28-fis-legge-stevino.md. The problem is read back from its text. Stevin's law p = p0 + d·g·h with g = 9,8 N/kg,
p0 = 1,01 · 10^5 Pa, h the depth below the free surface in metres and d in kg/m³ (the lesson's table: water 1000, sea
water 1030, olive oil 920, mercury 13 600; in g/cm³ 1,00, 1,03, 0,92, 13,6). The U-tube: d1·h1 = d2·h2 above the plane
of the interface. Answers rounded half up to two figures; p0 + d·g·h to the place of the less precise addend (p0 to
the thousands, d·g·h to its second figure). No ties. The scenes must carry the text's data.
"""
from sympy import Rational

from checkers._fis_fluidi import G, P0, expect, grab, need, scene
from checkers.forze_comune import common, exponent, prose, round_sig

CASE_RANGES = {
    1: {k: (0.17, 0.33) for k in ["acqua", "mare", "olio", "mercurio"]},
    2: {"g-cm3": (0.40, 0.60), "kg-m3": (0.40, 0.60)},
    3: {"acqua": (0.40, 0.60), "mare": (0.40, 0.60)},
    4: {"acqua": (0.40, 0.60), "olio": (0.40, 0.60)},
    5: {"idrostatica": (0.40, 0.60), "totale": (0.40, 0.60)},
    6: {"altezza": (0.50, 0.70), "densita": (0.30, 0.50)},
}

D = {"acqua": Rational(1000), "mare": Rational(1030), "olio": Rational(920), "mercurio": Rational(13600)}
WHERE = {"in un lago d'acqua dolce": "acqua", "nel mare": "mare", "in una cisterna piena d'olio d'oliva": "olio", "in una vaschetta di mercurio": "mercurio"}
WHERE_RX = "(" + "|".join(WHERE) + ")"
G_CM3 = {"acqua": "1{,}00", "mare": "1{,}03", "olio": "0{,}92", "mercurio": "13{,}6"}
NAMES = {"acqua": "acqua", "mercurio": "mercurio", "olio d'oliva": "olio"}
OF = {"acqua": "d'acqua", "mercurio": "di mercurio", "olio": "d'olio"}
P0_TEX = "1{,}01 \\cdot 10^{5}\\,\\text{Pa}"


def density(errs, q, liquid):
    v, u, digits = q
    if u == "kg/m^3":
        if v != D[liquid]:
            errs.append(f"density of {liquid} is {v}, the lesson says {D[liquid]}")
        return v, "kg-m3"
    if u == "g/cm^3":
        if digits != G_CM3[liquid]:
            errs.append(f"density of {liquid} written {digits}, the lesson says {G_CM3[liquid]}")
        return v * 1000, "g-cm3"
    errs.append(f"density in {u}")
    return v, None


def depth_ok(errs, h, liquid):
    """Depths that fit: mercury up to 0,99 m, oil up to 9,9 m, water up to 99 m."""
    top = {"mercurio": Rational(99, 100), "olio": Rational(99, 10)}.get(liquid, Rational(99))
    if not Rational(1, 10) <= h <= top:
        errs.append(f"depth {h} m not believable in {liquid}")


def container(errs, sample, labels, **data):
    d = scene(errs, sample, "recipiente-liquido")
    if not d:
        return
    if d.get("etichette") != labels:
        errs.append(f"scene labels {d.get('etichette')} != {labels}")
    for k, v in data.items():
        if abs(Rational(str(d.get(k))) - Rational(v)) > Rational(1, 10**9):
            errs.append(f"scene {k} = {d.get(k)}, the text says {v}")


def lab(q):
    return q[2].replace("{,}", ",")


def level1(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Quanto vale la pressione idrostatica a {Q} di profondità " + WHERE_RX + r" \(\$d = ([^$]+)\$\)\?", s)
    if not g:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    h = need(errs, g[0], "m", what="depth")
    liquid = WHERE[g[1]]
    d, how = density(errs, g[2], liquid)
    if how != "kg-m3":
        errs.append("level 1 density not in kg/m^3")
    depth_ok(errs, h, liquid)
    expect(errs, sample, d * G * h, "Pa")
    container(errs, sample, {"h": f"h = {lab(g[0])} m"}, profondita=h)
    return liquid


def level2(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Quanto vale la pressione idrostatica a {Q} di profondità " + WHERE_RX + r" \(\$d = ([^$]+)\$\)\?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    hc = need(errs, g[0], "cm", what="depth")
    liquid = WHERE[g[1]]
    d, how = density(errs, g[2], liquid)
    if not 10 <= hc <= 99:
        errs.append(f"depth {hc} cm out of 10-99")
    expect(errs, sample, d * G * hc / 100, "Pa")
    container(errs, sample, {"h": f"h = {lab(g[0])} cm"}, profondita=hc)
    return how


def level3(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Quanto vale la pressione totale a {Q} di profondità " + WHERE_RX + r" \(\$d = ([^$]+)\$\), se in superficie la pressione atmosferica è di \$([^$]+)\$\?", s)
    if not g or g[3] != (P0, "Pa", "1{,}01 \\cdot 10^{5}"):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    h = need(errs, g[0], "m", what="depth")
    liquid = WHERE[g[1]]
    if liquid not in ("acqua", "mare"):
        errs.append("level 3 is in water")
    d, _ = density(errs, g[2], liquid)
    dgh = d * G * h
    place = max(3, exponent(round_sig(dgh, 2)) - 1)
    total = P0 + dgh
    figures = exponent(total) - place + 1
    expect(errs, sample, total, "Pa", s=figures)
    return liquid


def level4(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"(Una vasca è piena d'acqua|Una cisterna è piena d'olio d'oliva) \(\$d = ([^$]+)\$\) fino all'altezza di {Q}\. Quanto vale la pressione idrostatica in un punto che si trova {Q} sopra il fondo\?", s)
    if not g:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    liquid = "acqua" if "acqua" in g[0] else "olio"
    d, _ = density(errs, g[1], liquid)
    H = need(errs, g[2], "m", what="height")
    yc = need(errs, g[3], "cm", what="height above the bottom")
    if yc % 10 or not 10 <= yc <= 90:
        errs.append(f"height above the bottom {yc} cm not a multiple of 10 up to 90")
    h = H - yc / 100
    if h < Rational(1, 2):
        errs.append(f"depth {h} m too small")
    expect(errs, sample, d * G * h, "Pa")
    container(errs, sample, {"H": f"H = {lab(g[2])} m", "y": f"y = {lab(g[3])} cm"}, livello=H, dalFondo=yc / 100)
    return liquid


def level5(sample, errs):
    s = prose(sample["problem"])
    g = grab(r"Il sensore di un sub misura una pressione idrostatica di {Q} " + WHERE_RX + r" \(\$d = ([^$]+)\$\)\. A che profondità si trova il sub\?", s)
    if g:
        p = need(errs, g[0], "kPa", what="pressure")
        liquid = WHERE[g[1]]
        d, _ = density(errs, g[2], liquid)
        expect(errs, sample, p * 1000 / (d * G), "m")
        return "idrostatica"
    g = grab(r"(Nel mare|In un lago d'acqua dolce) \(\$d = ([^$]+)\$\) un sensore misura la pressione totale di {Q}\. In superficie la pressione atmosferica è di \$([^$]+)\$\. A che profondità si trova il sensore\?", s)
    if g and g[3] == (P0, "Pa", "1{,}01 \\cdot 10^{5}"):
        liquid = "mare" if g[0] == "Nel mare" else "acqua"
        d, _ = density(errs, g[1], liquid)
        p = need(errs, g[2], "kPa", what="pressure", figures=None)
        if p % 10 or not 120 <= p <= 990:
            errs.append(f"total pressure {p} kPa not a multiple of 10 from 120 to 990")
        expect(errs, sample, (p * 1000 - P0) / (d * G), "m")
        return "totale"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


def level6(sample, errs):
    s = prose(sample["problem"])
    g = grab(
        r"In un tubo a U che contiene (acqua|mercurio) \(\$d = ([^$]+)\$\) si versa, in un ramo, (acqua|olio d'oliva) \(\$d = ([^$]+)\$\), che non si mescola con esso\. Sopra la superficie di separazione la colonna (d'acqua|d'olio|di mercurio) è alta {Q}\. Quanto è alta, nell'altro ramo, la colonna (d'acqua|d'olio|di mercurio) sopra lo stesso piano\?",
        s,
    )
    if g:
        base, top = NAMES[g[0]], NAMES[g[2]]
        if (top, base) not in {("olio", "acqua"), ("acqua", "mercurio"), ("olio", "mercurio")}:
            errs.append(f"pair {top} on {base} not in the spec")
        d2, _ = density(errs, g[1], base)
        d1, _ = density(errs, g[3], top)
        if g[4] != OF[top] or g[6] != OF[base]:
            errs.append("the columns' names do not match the liquids")
        h1 = need(errs, g[5], "cm", what="h1")
        expect(errs, sample, h1 * d1 / d2, "cm")
        sc = scene(errs, sample, "tubo-a-u")
        if sc and (Rational(str(sc.get("d1"))) != d1 or Rational(str(sc.get("d2"))) != d2 or Rational(str(sc.get("h1"))) != h1 or sc.get("etichette") != {"h1": f"h_1 = {lab(g[5])} cm", "h2": "h_2 = ?"}):
            errs.append("scene data differ from the text")
        return "altezza"
    g = grab(
        r"In un tubo a U con dell'acqua \(\$d = ([^$]+)\$\) si versa, in un ramo, un liquido che non si mescola con essa\. Sopra il piano della superficie di separazione la colonna del liquido è alta {Q} e quella d'acqua {Q}\. Quanto vale la densità del liquido\?",
        s,
    )
    if g:
        d2, _ = density(errs, g[0], "acqua")
        h1 = need(errs, g[1], "cm", what="h1")
        h2 = need(errs, g[2], "cm", what="h2")
        if not Rational(6, 10) <= h2 / h1 <= Rational(99, 100):
            errs.append(f"ratio {h2 / h1} out of 0,6-0,99")
        expect(errs, sample, d2 * h2 / h1, "kg/m^3")
        sc = scene(errs, sample, "tubo-a-u")
        if sc and (Rational(str(sc.get("h1"))) != h1 or sc.get("etichette") != {"h1": f"h_1 = {lab(g[1])} cm", "h2": f"h_2 = {lab(g[2])} cm"}):
            errs.append("scene data differ from the text")
        return "densita"
    errs.append(f"level 6 text not recognised: {s!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
