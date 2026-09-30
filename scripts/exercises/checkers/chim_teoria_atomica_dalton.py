"""Checker for chim-teoria-atomica-dalton (specs/exercises/chim-teoria-atomica-dalton.md).

Written from the spec and lesson 26, not from the generator.
- level 1: the checker has its own list of Dalton's postulates (four, in the lesson's words or close to them) and of
  statements that are not his; exactly one option must be a postulate;
- level 2: the data are read back and classified: products as heavy as the reactants (Lavoisier), two samples of one
  compound with the same fraction of an element (Proust), two compounds of the same elements whose masses per gram
  are in a ratio of small whole numbers (multiple proportions); the numbers must agree with the lesson's atomic masses;
- level 3: each statement has its verdict in the checker's own table;
- level 4: the atoms of every element are counted before, and the product's molecules must hold all of them (with
  the other product, for methane, taking the carbon);
- level 5: the masses are read, and m(el)/m(H) times the hydrogen atoms of the formula, to three figures, is the
  answer; the value must be within 1% of the lesson's atomic masses.
"""
import re

from checkers._chim_trasformazioni import MASS, ELEMENT_NAME, check_choice, common, count, formulas_in, option_text, prose_and_extra

CASE_RANGES = {
    1: {f"postulato {k}": (0.15, 0.35) for k in range(1, 5)},
    2: {k: (0.23, 0.43) for k in ["Lavoisier", "Proust", "proporzioni multiple"]},
    3: {str(k): (0.15, 0.35) for k in range(4)},
}

POSTULATES = {
    "La materia è fatta di atomi indivisibili.": 1,
    "Gli atomi non si possono dividere.": 1,
    "Gli atomi di uno stesso elemento sono tutti uguali.": 2,
    "Elementi diversi hanno atomi di massa diversa.": 2,
    "Nelle reazioni gli atomi non si creano e non si distruggono.": 3,
    "Una reazione chimica riorganizza gli atomi.": 3,
    "Nei composti gli atomi sono in rapporti di numeri interi.": 4,
    "In un composto gli atomi si uniscono in rapporti fissi.": 4,
}
NOT_DALTON = {
    "Gli atomi di un elemento possono avere masse diverse.",
    "In una reazione un elemento diventa un altro elemento.",
    "L'atomo è fatto di particelle più piccole.",
    "Nei composti gli atomi si uniscono in qualunque rapporto.",
    "In una reazione una parte degli atomi si distrugge.",
    "Gli atomi di tutti gli elementi hanno la stessa massa.",
    "Un composto può cambiare composizione da un campione all’altro.",
}

VERDICTS = ["Vero ancora oggi", "Falso: l'atomo ha particelle più piccole", "Falso: esistono gli isotopi", "Vero nelle reazioni chimiche, non in quelle nucleari"]
STATEMENT_VERDICT = {
    "In una reazione chimica gli atomi si separano e si legano in modo diverso.": 0,
    "La materia è fatta di atomi.": 0,
    "Gli atomi di elementi diversi hanno proprietà chimiche diverse.": 0,
    "In ogni molecola d'acqua ci sono due atomi di idrogeno e uno di ossigeno.": 0,
    "Gli atomi sono indivisibili.": 1,
    "L'atomo è una sfera piena, senza parti.": 1,
    "Gli atomi non si possono dividere in parti più piccole.": 1,
    "Tutti gli atomi di uno stesso elemento hanno la stessa massa.": 2,
    "Due atomi di cloro hanno sempre la stessa massa.": 2,
    "Due atomi di carbonio hanno sempre la stessa massa.": 2,
    "Gli atomi non si creano e non si distruggono.": 3,
    "Un atomo di un elemento non può trasformarsi in un atomo di un altro elemento.": 3,
}

LAWS = ["La legge di Lavoisier", "La legge di Proust", "La legge delle proporzioni multiple", "Nessuna delle tre leggi"]
# fraction of the mass of the element in the compound, from lesson 01's masses
FRACTION = {
    ("acqua", "idrogeno"): 2 * MASS["H"] / (2 * MASS["H"] + MASS["O"]),
    ("cloruro di sodio", "sodio"): MASS["Na"] / (MASS["Na"] + MASS["Cl"]),
    ("anidride carbonica", "carbonio"): MASS["C"] / (MASS["C"] + 2 * MASS["O"]),
    ("carbonato di calcio", "calcio"): MASS["Ca"] / (MASS["Ca"] + MASS["C"] + 3 * MASS["O"]),
    ("ossido di magnesio", "magnesio"): MASS["Mg"] / (MASS["Mg"] + MASS["O"]),
}
# the reactions of level 2: mass of b per gram of a
REACTION = {
    ("ferro", "zolfo", "solfuro di ferro"): MASS["S"] / MASS["Fe"],
    ("magnesio", "ossigeno", "ossido di magnesio"): MASS["O"] / MASS["Mg"],
    ("idrogeno", "ossigeno", "acqua"): MASS["O"] / (2 * MASS["H"]),
    ("sodio", "cloro", "cloruro di sodio"): MASS["Cl"] / MASS["Na"],
    ("carbonio", "ossigeno", "anidride carbonica"): 2 * MASS["O"] / MASS["C"],
}
G = r"\$(\d+\{,\}\d{2})\\,\\text\{g\}\$"


def num(s):
    return float(s.replace("{,}", "."))


def law_option(o):
    return LAWS.index(option_text(o["latex"]))


def check(sample):
    errs = []
    common(sample, errs)
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected lines in the problem")
    lvl = sample["level"]
    ch = sample["answer"]

    if lvl == 1:
        if prose != "Quale di queste affermazioni è un postulato della teoria atomica di Dalton?":
            return errs + [f"text not recognised: {prose!r}"], None
        right = None
        for o in ch["options"]:
            s = option_text(o["latex"])
            if s not in POSTULATES and s not in NOT_DALTON:
                errs.append(f"unknown statement {s!r}")
            if s in POSTULATES:
                right = POSTULATES[s]
        check_choice(ch, lambda o: option_text(o["latex"]) in POSTULATES, errs)
        return errs, f"postulato {right}" if right else None

    if lvl == 2:
        m = re.fullmatch(rf"In un recipiente chiuso si fanno reagire {G} di (\w+) e {G} di (\w+), che reagiscono del tutto e formano ([\w ]+)\. Alla fine nel recipiente ci sono {G} di ([\w ]+)\. Quale legge mostrano questi dati\?", prose)
        if m:
            a, b, tot = num(m.group(1)), num(m.group(3)), num(m.group(6))
            key = (m.group(2), m.group(4), m.group(5))
            if key not in REACTION or m.group(7) != m.group(5):
                errs.append(f"unknown reaction {key}")
            elif abs(b / a / REACTION[key] - 1) > 0.03:
                errs.append(f"the masses {a}, {b} do not react completely")
            if abs(a + b - tot) > 0.005:
                errs.append("the mass is not conserved")
            check_choice(ch, lambda o: law_option(o) == 0, errs)
            return errs, "Lavoisier"
        m = re.fullmatch(rf"Un campione di {G} di ([\w ]+) contiene {G} di (\w+); un altro campione, di {G}, preparato in un altro modo, ne contiene {G}\. Quale legge mostrano questi dati\?", prose)
        if m:
            m1, e1, m2, e2 = num(m.group(1)), num(m.group(3)), num(m.group(5)), num(m.group(6))
            key = (m.group(2), m.group(4))
            if key not in FRACTION:
                errs.append(f"unknown compound {key}")
            else:
                for mm, e in ((m1, e1), (m2, e2)):
                    if abs(e - mm * FRACTION[key]) > 0.0051:
                        errs.append(f"{e} g in {mm} g of {key[0]} is not its composition")
            check_choice(ch, lambda o: law_option(o) == 1, errs)
            return errs, "Proust"
        G3 = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{g\}\$"
        m = re.fullmatch(rf"Due composti diversi sono fatti di (\w+) e (\w+)\. Nel primo {G} di (\w+) sono uniti a {G3} di (\w+), nel secondo a {G3}\. Quale legge mostrano questi dati\?", prose)
        if m:
            mx, y1, y2 = num(m.group(3)), num(m.group(5)), num(m.group(7))
            x, y = ELEMENT_NAME[m.group(1)], ELEMENT_NAME[m.group(2)]
            r = y2 / y1
            if not any(abs(r - p / q) < 0.03 * p / q for p in range(1, 6) for q in range(1, 6) if p != q):
                errs.append(f"ratio {r:.3f} is not a ratio of small whole numbers")
            # the first compound must be a real one: grams of y per gram of x from a small formula
            if not any(abs(y1 / mx / (b * MASS[y] / (a * MASS[x])) - 1) < 0.01 for a in (1, 2) for b in (1, 2, 3)):
                errs.append(f"{y1} g of {y} per {mx} g of {x} is not a simple compound")
            check_choice(ch, lambda o: law_option(o) == 2, errs)
            return errs, "proporzioni multiple"
        return errs + [f"text not recognised: {prose!r}"], None

    if lvl == 3:
        m = re.fullmatch(r"Secondo Dalton, (.+) Che cosa ne sappiamo oggi\?", prose)
        said = m and m.group(1)[0].upper() + m.group(1)[1:]
        if not m or said not in STATEMENT_VERDICT:
            return errs + [f"text not recognised: {prose!r}"], None
        k = STATEMENT_VERDICT[said]
        check_choice(ch, lambda o: option_text(o["latex"]) == VERDICTS[k], errs)
        for o in ch["options"]:
            if option_text(o["latex"]) not in VERDICTS:
                errs.append(f"unknown verdict {o['latex']!r}")
        return errs, str(k)

    if lvl == 4:
        m = re.fullmatch(
            r"In un recipiente ci sono \$(\d+)\$ (atomi|molecole|unità formula) di (\$\\mathrm\{\w+\}\$) e \$(\d+)\$ (atomi|molecole|unità formula) di (\$\\mathrm\{[\w{}]+\}\$), che reagiscono tutti e formano (?:solo (\$\\mathrm\{[\w{}]+\}\$)|(\$\\mathrm\{[\w{}]+\}\$) e (\$\\mathrm\{[\w{}]+\}\$))\. Quante (molecole|unità formula) di (\$\\mathrm\{[\w{}]+\}\$) si formano\?",
            prose,
        )
        if not m:
            return errs + [f"text not recognised: {prose!r}"], None
        f = lambda s: formulas_in(s)[0][1]  # noqa: E731
        before = {}
        for n, fo in ((int(m.group(1)), f(m.group(3))), (int(m.group(4)), f(m.group(6)))):
            for e, k in count(fo).items():
                before[e] = before.get(e, 0) + n * k
        asked = f(m.group(11))
        pc = count(asked)
        if m.group(7):
            # one product: every element must give the same number of molecules
            ns = {before[e] / k for e, k in pc.items()}
            if len(ns) != 1 or set(pc) != set(before):
                return errs + [f"atoms not conserved: {before} -> {asked}"], None
            want = ns.pop()
        else:
            other = count(f(m.group(9)) if f(m.group(9)) != asked else f(m.group(8)))
            # the element that only the asked product has
            only = [e for e in pc if e not in other]
            if len(only) != 1:
                return errs + ["cannot count the product"], None
            want = before[only[0]] / pc[only[0]]
            rest = {e: before[e] - want * pc.get(e, 0) for e in before}
            ks = {rest[e] / k for e, k in other.items()}
            if len(ks) != 1 or any(v < 0 for v in rest.values()):
                return errs + ["atoms not conserved with two products"], None
        if want != int(want):
            return errs + [f"{want} molecules"], None
        check_choice(ch, lambda o: int(o["latex"]) == int(want), errs)
        return errs, asked

    if lvl == 5:
        m = re.fullmatch(rf"In un campione di ([\w ]+), \$\\mathrm\{{(\w+)\}}\$, ci sono {G} di idrogeno e \$(\d+(?:\{{,\}}\d+)?)\\,\\text\{{g\}}\$ di (\w+)\. Quante volte un atomo di (\w+) è più pesante di un atomo di idrogeno\?", prose)
        if not m:
            return errs + [f"text not recognised: {prose!r}"], None
        f = formulas_in(prose)[0][1]
        c = count(f)
        el = ELEMENT_NAME[m.group(5)]
        if set(c) != {"H", el} or c[el] != 1 or ELEMENT_NAME[m.group(6)] != el:
            return errs + [f"formula {f} and element {el}"], None
        mh, my = num(m.group(3)), num(m.group(4))
        v = my / mh * c["H"]
        if abs(v / (MASS[el] / MASS["H"]) - 1) > 0.01:
            errs.append(f"{v:.3f} is not the mass of {el} relative to H")
        want = float(f"{v:.3g}")

        def right(o):
            x = float(o["values"][0])
            if o["latex"] != o["values"][0].replace(".", "{,}"):
                raise ValueError(f"option {o['latex']!r}")
            return abs(x - want) < 1e-9

        check_choice(ch, right, errs)
        return errs, f

    return errs + [f"unknown level {lvl}"], None
