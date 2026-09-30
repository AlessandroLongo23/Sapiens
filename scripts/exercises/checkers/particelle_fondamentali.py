"""Checker for particelle-fondamentali (specs/exercises/particelle-fondamentali.md), written from the spec and the lesson
40-particelle-fondamentali.md, not from the generator.

The lesson's table: electron charge -e, mass 9,11 · 10⁻³¹ kg = 0,000549 u; proton +e, 1,673 · 10⁻²⁷ kg = 1,007 u;
neutron no charge, 1,675 · 10⁻²⁷ kg = 1,009 u; e = 1,60 · 10⁻¹⁹ C. The discoveries with their authors and years. The
charge of a group is (protons - electrons) e; Millikan's charges are whole multiples of e. Exact arithmetic with sympy,
results rounded as the spec says.
"""
import re

from sympy import Rational

from checkers._fis_calore import rounded, value
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["Elettrone", "Protone", "Neutrone", "Nessuna delle tre"]},
    2: {"chi": (0.40, 0.60), "quando": (0.40, 0.60)},
    3: {"positiva": (0.40, 0.60), "negativa": (0.40, 0.60)},
    4: {"u": (0.26, 0.40), "kg": (0.26, 0.40), "elettroni": (0.26, 0.40)},
    5: {"quante": (0.40, 0.60), "impossibile": (0.40, 0.60)},
}

E = Rational(16, 10**20)
M_U = {"E": Rational(549, 10**6), "P": Rational(1007, 1000), "N": Rational(1009, 1000)}
M_KG = {"E": Rational(911, 100) * Rational(1, 10**31), "P": Rational(1673, 1000) * Rational(1, 10**27), "N": Rational(1675, 1000) * Rational(1, 10**27)}
NAMES = {"E": "Elettrone", "P": "Protone", "N": "Neutrone", None: "Nessuna delle tre"}
DISCOVERIES = {
    "costruì i tubi quasi vuoti in cui si osservano i raggi catodici": ("Crookes", None),
    "osservò per primo i raggi canale": ("Goldstein", 1886),
    "chiamò elettrone la porzione elementare di carica": ("Stoney", 1891),
    "misurò il rapporto tra la carica e la massa dell'elettrone": ("J. J. Thomson", 1897),
    "misurò la carica elementare con le gocce d'olio": ("Millikan", 1909),
    "trovò il protone tra i frammenti di atomi di azoto": ("Rutherford", 1919),
    "scoprì il neutrone": ("Chadwick", 1932),
}
E_TEXT = r"La carica elementare è \$e = 1\{,\}60 \\cdot 10\^\{-19\}\\,\\text\{C\}\$\."
NUM = r"(\d+(?:\{,\}\d+)?(?: \\cdot 10\^\{-?\d+\})?)"


def particle_of(prop):
    """The particle a property of the lesson belongs to (E, P, N) or None, from the table and the history."""
    if m := re.fullmatch(r"ha carica relativa \$([+-]\d)\$", prop):
        return {"-1": "E", "+1": "P"}.get(m.group(1))
    if m := re.fullmatch(r"ha massa \$" + NUM + r"\\,\\text\{(kg|u)\}\$", prop):
        v = value(m.group(1))
        table = M_KG if m.group(2) == "kg" else M_U
        found = [k for k, x in table.items() if x == v]
        return found[0] if found else None
    if m := re.fullmatch(r"ha carica \$([+-])" + NUM + r"\\,\\text\{C\}\$(.*)", prop):
        q = value(m.group(2)) * (1 if m.group(1) == "+" else -1)
        rest = m.group(3)
        if rest == "" and q == E:
            return "P"
        if rest == " e massa di circa $1\\,\\text{u}$":
            # charge -e with the mass of a nucleon: none of the three
            return None if q == -E else ("P" if q == E else None)
        raise ValueError(f"property not understood: {prop!r}")
    rules = [
        ("ha massa di circa $4\\,\\text{u}$", None),
        ("non ha carica elettrica", "N"),
        ("nessuna carica", "N"),
        ("Chadwick nel 1932", "N"),
        ("Millikan", None),
        ("Thomson nel 1897", "E"),
        ("raggi catodici", "E"),
        ("massa più piccola", "E"),
        ("intorno al nucleo", "E"),
        ("Rutherford nel 1920", "P"),
        ("ione idrogeno", "P"),
    ]
    hits = {who for key, who in rules if key in prop}
    if len(hits) != 1:
        raise ValueError(f"property not understood: {prop!r}")
    return hits.pop()


def charge_text(k):
    """k elementary charges as the lesson writes a charge: +4{,}80 \\cdot 10^{-19}\\,\\text{C}."""
    if k == 0:
        return r"0\,\text{C}"
    return ("+" if k > 0 else "-") + rounded(abs(k) * E, 3) + r"\,\text{C}"


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quale particella subatomica (.+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    want = NAMES[particle_of(m.group(1))]
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in NAMES.values():
            errs.append(f"unexpected option {o['latex']!r}")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
    return want


def level2(sample, prose, errs):
    if m := re.fullmatch(r"Chi (.+)\?", prose):
        who, _ = DISCOVERIES[m.group(1)]
        names = {w for w, _ in DISCOVERIES.values()}
        for o in sample["answer"]["options"]:
            if option_text(o["latex"]) not in names:
                errs.append(f"unexpected option {o['latex']!r}")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == who, errs)
        return "chi"
    if m := re.fullmatch(r"In che anno (.+?) (" + "|".join(re.escape(k) for k in DISCOVERIES) + r")\?", prose):
        who, year = DISCOVERIES[m.group(2)]
        if who != m.group(1) or year is None:
            errs.append("scientist and discovery do not match")
            return None
        check_choice(sample["answer"], lambda o: o["latex"] == str(year), errs)
        return "quando"
    errs.append(f"level 2 text not recognised: {prose!r}")
    return None


def level3(sample, prose, errs):
    m = re.fullmatch(r"Un gruppo di particelle è formato da \$(\d+)\$ protoni, \$(\d+)\$ neutroni e \$(\d+)\$ elettroni\. Quanto vale la sua carica totale\? " + E_TEXT, prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    p, n, e = (int(x) for x in m.groups())
    k = p - e
    if k == 0 or abs(k) > 3 or not 3 <= p <= 20 or not p <= n <= p + 4:
        errs.append("numbers out of range")
    want = charge_text(k)
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "positiva" if k > 0 else "negativa"


def level4(sample, prose, errs):
    table_u = r"Usa le masse della tabella della lezione: protone \$1\{,\}007\\,\\text\{u\}\$, neutrone \$1\{,\}009\\,\\text\{u\}\$, elettrone \$0\{,\}000549\\,\\text\{u\}\$\."
    table_kg = r"Protone \$1\{,\}673 \\cdot 10\^\{-27\}\\,\\text\{kg\}\$, neutrone \$1\{,\}675 \\cdot 10\^\{-27\}\\,\\text\{kg\}\$, elettrone \$9\{,\}11 \\cdot 10\^\{-31\}\\,\\text\{kg\}\$\."
    if m := re.fullmatch(r"Un atomo ha \$(\d+)\$ elettroni\. Quanto vale, in unità di massa atomica, la massa di tutti i suoi elettroni\? " + table_u, prose):
        e = int(m.group(1))
        want = rounded(e * M_U["E"], 3) + r"\,\text{u}"
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "elettroni"
    if m := re.fullmatch(r"Un nucleo contiene \$(\d+)\$ protoni e \$(\d+)\$ neutroni\. Quanto vale la sua massa, sommando le masse delle particelle\? " + table_u, prose):
        p, n = int(m.group(1)), int(m.group(2))
        x = p * M_U["P"] + n * M_U["N"]
        want = f"{int(x)}{{,}}{str(int(x * 1000) % 1000).rjust(3, '0')}" + r"\,\text{u}"
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "u"
    if m := re.fullmatch(r"Un nucleo contiene \$(\d+)\$ protoni e \$(\d+)\$ neutroni\. Quanto vale la sua massa in chilogrammi, sommando le masse delle particelle\? " + table_kg, prose):
        p, n = int(m.group(1)), int(m.group(2))
        want = rounded(p * M_KG["P"] + n * M_KG["N"], 3) + r"\,\text{kg}"
        check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
        return "kg"
    errs.append(f"level 4 text not recognised: {prose!r}")
    return None


def level5(sample, prose, errs):
    if m := re.fullmatch(r"Nell'esperimento di Millikan una goccia d'olio ha una carica di \$" + NUM + r"\\,\\text\{C\}\$, in valore assoluto\. Quante cariche elementari porta\? " + E_TEXT, prose):
        k = value(m.group(1)) / E
        if k.q != 1 or not 2 <= k <= 15:
            errs.append(f"the charge is {k} e")
            return None
        check_choice(sample["answer"], lambda o: o["latex"] == str(k), errs)
        return "quante"
    if re.fullmatch(r"Quale di queste cariche non può essere la carica di una goccia d'olio di Millikan\? " + E_TEXT, prose):

        def impossible(o):
            mm = re.fullmatch(NUM + r"\\,\\text\{C\}", o["latex"])
            if not mm:
                raise ValueError(f"not a charge: {o['latex']!r}")
            return (value(mm.group(1)) / E).q != 1

        check_choice(sample["answer"], impossible, errs)
        return "impossibile"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
