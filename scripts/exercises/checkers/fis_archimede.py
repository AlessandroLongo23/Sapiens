"""Checker for fis-archimede (specs/exercises/fis-archimede.md), written from the spec and the lesson
30-fis-archimede.md. Each problem is read back from its text, the densities in the text must be the lesson's
(acqua 1000, acqua di mare 1030, olio d'oliva 920, alcol etilico 790, glicerina 1260; ferro 7870, alluminio 2700,
rame 8960, piombo 11 300; ghiaccio 917), and the truth is computed with exact rationals and g = 9,8 N/kg:
S_A = d V g, P_app = P - S_A, d = d_fl P / (P - P_app), V = (P - P_app) / (d_fl g), V_imm / V = d_corpo / d_liquido,
the largest load d_fl V - m (raft) or (d_out - d_in) V - m (balloon). On levels 3 and 5 the scene must draw the data
of the text: the two readings on a division of one of the spec's balances, the two heights of the block.
"""
import re

from sympy import Rational as R

from checkers.forze_comune import common, prose, sig_figs
from checkers._fis_atmosfera import expect_u, parse_num, q

G = R(98, 10)
LIQ = {
    "in acqua": ("acqua", 1000),
    "in acqua di mare": ("mare", 1030),
    "nell'olio d'oliva": ("olio", 920),
    "nell'alcol etilico": ("alcol", 790),
    "nella glicerina": ("glicerina", 1260),
}
METALS = {"ferro": 7870, "alluminio": 2700, "rame": 8960, "piombo": 11300}
BALANCES = {(5, 25, 5), (10, 25, 5)}
LIQ_RX = "(" + "|".join(re.escape(k) for k in LIQ) + r") \(densità " + q("kg/m^3") + r"\)"

CASE_RANGES = {
    1: {"dm3": (0.40, 0.60), "cm3": (0.40, 0.60)},
    3: {"volume": (0.35, 0.65), "densita": (0.35, 0.65)},
    4: {"altezza": (0.40, 0.60), "volume": (0.40, 0.60)},
    5: {"corpo": (0.35, 0.65), "liquido": (0.35, 0.65)},
    6: {"zattera": (0.40, 0.60), "mongolfiera": (0.40, 0.60)},
}


def fm(rx, s):
    m = re.fullmatch(rx, s)
    return m.groups() if m else None


def liquid(errs, where, dens, allowed=None):
    kind, d = LIQ[where]
    if parse_num(dens) != d:
        errs.append(f"density {dens} for {where}, the lesson says {d}")
    if allowed and kind not in allowed:
        errs.append(f"liquid {kind} not allowed here")
    return kind, R(d)


def two(errs, s, what):
    if sig_figs(s) != 2:
        errs.append(f"{what} {s!r} has not two significant figures")


def level1(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"Un blocco di (\w+) \(densità " + q("kg/m^3") + r"\) ha il volume di \$(.+?)\\,\\text\{(dm|cm)\}\^3\$ ed è tutto immerso " + LIQ_RX + r"\. Quanto vale la spinta di Archimede sul blocco\?", s)
    if not g or g[0] not in METALS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if parse_num(g[1]) != METALS[g[0]]:
        errs.append(f"density of {g[0]} is {g[1]}")
    _, dl = liquid(errs, g[4], g[5])
    raw = parse_num(g[2])
    if g[3] == "dm":
        two(errs, g[2], "volume")
        V = raw / 1000
    else:
        if not (raw % 10 == 0 and 100 <= raw <= 990):
            errs.append(f"volume {raw} cm3 not a multiple of 10 in 100-990")
        V = raw / 10**6
    expect_u(errs, sample, dl * V * G, "N", ("sig", 2))
    return "dm3" if g[3] == "dm" else "cm3"


def level2(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"(Un sasso|Un blocco di metallo|Una chiave inglese|Un pesetto) pesa " + q("N") + " in aria e ha il volume di " + q("cm^3") + r"\. Quanto segna il dinamometro a cui è appeso quando è tutto immerso " + LIQ_RX + r"\?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    kind, dl = liquid(errs, g[3], g[4], {"acqua", "mare", "olio", "alcol"})
    P, V = parse_num(g[1]), parse_num(g[2]) / 10**6
    two(errs, g[1], "weight")
    if not 1500 <= P / (G * V) <= 12000:
        errs.append("the body's density is outside 1500-12000")
    truth = P - dl * V * G
    if truth < 1:
        errs.append("apparent weight under 1 N")
    expect_u(errs, sample, truth, "N", ("sig", 2))
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"Un corpo appeso ai dinamometri della figura segna " + q("N") + " in aria e " + q("N") + " quando è tutto immerso " + LIQ_RX + r"\. Qual è (il volume|la densità) del corpo\?", s)
    if not g:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    _, dl = liquid(errs, g[2], g[3], {"acqua", "olio", "alcol"})
    P, P2 = parse_num(g[0]), parse_num(g[1])
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "dinamometri-archimede" or (d.get("portata"), d.get("divisioni"), d.get("ogni")) not in BALANCES:
        errs.append("scene is not one of the spec's pairs of balances")
    else:
        if R(str(d["aria"])) != P or R(str(d["liquido"])) != P2:
            errs.append("scene readings differ from the text")
        for x in (P, P2):
            i = x / R(d["portata"], d["divisioni"])
            if not (i.is_integer and 0 < i < d["divisioni"]):
                errs.append(f"reading {x} not on a division")
    dP = P - P2
    if P < 1 or dP < 1:
        errs.append("weight or buoyancy under 1 N")
    if g[4] == "la densità":
        truth = dl * P / dP
        if not 1500 <= truth <= 12000:
            errs.append("density outside 1500-12000")
        expect_u(errs, sample, truth, "kg/m^3", ("sig", 2))
        return "densita"
    expect_u(errs, sample, dP / (dl * G) * 10**6, "cm^3", ("sig", 2))
    return "volume"


def body(errs, name, dens):
    d = parse_num(dens)
    if name == "ghiaccio":
        if d != 917:
            errs.append("ice is not 917")
    elif name == "legno":
        if not (d % 10 == 0 and 300 <= d <= 900):
            errs.append(f"wood density {d} not 300-900")
    else:
        errs.append(f"unknown floating body {name}")
    return d


def level4(sample, errs):
    s = prose(sample["problem"])
    head = r"Un blocco di (legno|ghiaccio) \(densità " + q("kg/m^3") + r"\) "
    g = fm(head + r"alto " + q("cm") + r" galleggia " + LIQ_RX + r" con le facce orizzontali\. Quanti centimetri della sua altezza sono sotto la superficie\?", s)
    kind, u = "altezza", "cm"
    if not g:
        g = fm(head + r"ha il volume di " + q("dm^3") + r" e galleggia " + LIQ_RX + r"\. Qual è il volume della parte immersa\?", s)
        kind, u = "volume", "dm^3"
    if not g:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    dc = body(errs, g[0], g[1])
    _, dl = liquid(errs, g[3], g[4], {"acqua", "mare", "olio", "glicerina"})
    two(errs, g[2], "size")
    if dc > dl * R(95, 100):
        errs.append("the body does not float clearly")
    expect_u(errs, sample, parse_num(g[2]) * dc / dl, u, ("sig", 2))
    return kind


def heights(errs, sample):
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "galleggiante-quote":
        errs.append("no waterline scene")
        return None, None
    h, hi = R(str(d["altezza"])), R(str(d["immersa"]))
    th, ti = d.get("testoAltezza", ""), d.get("testoImmersa", "")
    for txt, val in ((th, h), (ti, hi)):
        m = re.fullmatch(r"(\d+(?:,\d+)?) cm", txt)
        if not m or parse_num(m.group(1).replace(",", "{,}")) != val or sig_figs(m.group(1).replace(",", "{,}")) != 2:
            errs.append(f"scene label {txt!r} is not {val} cm with two figures")
    if not (h.is_integer and 10 <= h <= 30 and R(15, 100) * h < hi < R(95, 100) * h):
        errs.append("heights outside the spec")
    return h, hi


def level5(sample, errs):
    s = prose(sample["problem"])
    h, hi = heights(errs, sample)
    if h is None:
        return None
    g = fm(r"Il blocco della figura galleggia " + LIQ_RX + r"\. Qual è la densità del blocco\?", s)
    if g:
        _, dl = liquid(errs, g[0], g[1], {"acqua", "mare", "olio", "glicerina"})
        expect_u(errs, sample, dl * hi / h, "kg/m^3", ("sig", 2))
        return "corpo"
    g = fm(r"Il blocco della figura, di legno con la densità di " + q("kg/m^3") + r", galleggia in un liquido sconosciuto\. Qual è la densità del liquido\?", s)
    if g:
        dc = body(errs, "legno", g[0])
        truth = dc * h / hi
        if not 700 <= truth <= 1600:
            errs.append("liquid density outside 700-1600")
        expect_u(errs, sample, truth, "kg/m^3", ("sig", 2))
        return "liquido"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


def level6(sample, errs):
    s = prose(sample["problem"])
    g = fm(r"Una zattera ha il volume di " + q("m^3") + " e la massa di " + q("kg") + r"\. Quale massa può portare al massimo senza andare sotto, " + LIQ_RX + r"\?", s)
    if g:
        _, dl = liquid(errs, g[2], g[3], {"acqua", "mare"})
        V, m = parse_num(g[0]), parse_num(g[1])
        two(errs, g[0], "volume")
        if not (m % 10 == 0 and 80 <= m <= 400 and m <= R(6, 10) * dl * V):
            errs.append(f"raft mass {m} outside the spec")
        expect_u(errs, sample, dl * V - m, "kg", ("sig", 2))
        return "zattera"
    g = fm(
        r"Una mongolfiera ha il volume di " + q("m^3") + r"; l'involucro, la cesta e il bruciatore hanno la massa di " + q("kg") + r"\. L'aria fuori ha la densità di " + q("kg/m^3")
        + r", l'aria calda dentro di " + q("kg/m^3") + r"\. Quale massa di passeggeri può sollevare al massimo\?",
        s,
    )
    if g:
        V, m, dout, din = (parse_num(x) for x in g)
        if dout != R(120, 100) or g[2] != "1{,}20":
            errs.append("outside air is not 1,20")
        if not (R(90, 100) <= din <= R(99, 100)):
            errs.append(f"hot air {din} outside 0,90-0,99")
        if not (V % 100 == 0 and 1500 <= V <= 3000 and m % 10 == 0 and 200 <= m <= 400):
            errs.append("balloon data outside the spec")
        truth = (dout - din) * V - m
        if truth < 50:
            errs.append("load under 50 kg")
        expect_u(errs, sample, truth, "kg", ("sig", 2))
        return "mongolfiera"
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
