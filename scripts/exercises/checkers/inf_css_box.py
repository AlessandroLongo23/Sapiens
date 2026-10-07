"""Checker for inf-css-box (specs/exercises/inf-css-box.md).

Written from the spec, without the generator's code. The rule shown under the question is read again here, and
every answer is worked out from its declarations:
- level 1: the measure asked for, or the declaration to change;
- level 2: the value of a side from a pair of values, or the line a border draws;
- level 3: width + 2 padding + 2 border, and + 2 margin for the room taken;
- level 4: with border-box the width is the box, and the content is what is left;
- level 5: the width to write for a box of a given size;
- level 6: block and inline elements from a table, and the larger of two margins that meet.
"""
import re

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"misura": (0.52, 0.68), "dichiarazione": (0.32, 0.48)},
    2: {"due-valori": (0.52, 0.68), "linea": (0.32, 0.48)},
    3: {"bordo": (0.52, 0.68), "spazio": (0.32, 0.48)},
    4: {"scatola": (0.23, 0.37), "contenuto": (0.32, 0.48), "senza": (0.23, 0.37)},
    5: {"content-box": (0.62, 0.78), "border-box": (0.22, 0.38)},
    6: {"margini": (0.23, 0.37), "blocco": (0.18, 0.32), "larghezza": (0.18, 0.32), "linea": (0.13, 0.27)},
}

BLOCKS = {"h1", "h2", "p", "ul", "li", "div", "header", "nav", "main", "footer"}
INLINES = {"a", "em", "strong", "span"}
LINES = {"solid": "continua", "dashed": "tratteggiata", "dotted": "puntini", "none": "nessuna"}


def read_rule(text):
    """(selector, {property: value}) of a rule on several rows, each declaration on its own row."""
    m = re.fullmatch(r"(\S[^{}\n]*) \{\n((?:  [a-z-]+: [^;\n]+;\n)+)\}\n", text)
    if not m:
        return None
    declarations = dict(re.findall(r"  ([a-z-]+): ([^;\n]+);\n", m.group(2)))
    return m.group(1), declarations


def pixels(value):
    m = re.fullmatch(r"(\d+)px", value)
    return int(m.group(1)) if m else None


def sizes(declarations):
    """width, padding, border and margin of a rule, in pixels; a part that is not written is 0."""
    border = re.fullmatch(r"(\d+)px (solid|dashed|dotted) [a-z]+", declarations.get("border", ""))
    return {
        "width": pixels(declarations.get("width", "")),
        "padding": pixels(declarations.get("padding", "0px")),
        "border": int(border.group(1)) if border else 0,
        "margin": pixels(declarations.get("margin", "0px")),
        "sizing": declarations.get("box-sizing", "content-box"),
    }


def check(sample):
    errors = common(sample)
    params, level = sample["params"], sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or errors:
        return errors, case
    options = choice["options"]
    right = options[choice["correct"]]["values"][0]
    if sample["answer"]["kind"] != "choice":
        errors.append("every level is multiple choice")
    number = lambda: all(re.fullmatch(r"\d+", o["values"][0]) and int(o["values"][0]) > 0 for o in options)

    read = read_rule(sample["listing"]) if "listing" in sample else None
    if level in (1, 2, 3, 4, 5) and not read:
        return errors + ["the rule is not shown, one declaration per row"], case

    if level == 1:
        s = sizes(read[1])
        if None in s.values() or len({s["padding"], s["border"], s["margin"]}) != 3 or set(read[1]) != {"width", "padding", "border", "margin"}:
            return errors + ["a rule with width, padding, border and margin, three different numbers"], case
        asked = {"testo e il bordo": "padding", "elementi vicini": "margin", "spessa la cornice": "border", "testo dalla cornice": "padding", "elementi che ha intorno": "margin", "più spessa la cornice": "border"}
        part = next((p for words, p in asked.items() if words in sample["problem"]), None)
        if part != params.get("ask"):
            return errors + ["the question does not ask for the part in params"], case
        if case == "misura":
            if right != str(s[part]) or not number():
                errors.append(f"the {part} is {s[part]} px, not {right}")
        elif case == "dichiarazione":
            if right.strip() != f"{part}: {read[1][part]};":
                errors.append(f"the declaration to change is the one of {part}")
            if sorted(o["values"][0].strip() for o in options) != sorted(f"{p}: {v};" for p, v in read[1].items()):
                errors.append("the options are the four declarations of the rule")
        else:
            errors.append(f"unknown case {case}")

    elif level == 2:
        if len(read[1]) != 1:
            return errors + ["a rule with one declaration"], case
        (prop, value), = read[1].items()
        if case == "due-valori":
            m = re.fullmatch(r"(\d+)px (\d+)px", value)
            side = next((s for words, s in {"sopra": "top", "sotto": "bottom", "a sinistra": "left", "a destra": "right"}.items() if f" {words} " in sample["problem"]), None)
            if not m or prop not in ("padding", "margin") or m.group(1) == m.group(2) or side != params.get("side"):
                return errors + ["padding or margin with two different values, and one side asked for"], case
            if ("padding" in sample["problem"]) != (prop == "padding"):
                errors.append("the question names the other property")
            value_of = m.group(1) if side in ("top", "bottom") else m.group(2)
            if right != value_of or not number():
                errors.append(f"{prop} on the {side} is {value_of} px, not {right}")
        elif case == "linea":
            m = re.fullmatch(r"\d+px (?:(solid|dashed|dotted) )?[a-z]+", value)
            if prop != "border" or not m:
                return errors + ["a border with or without its style"], case
            style = m.group(1) or "none"
            if right != style or LINES[style] not in options[choice["correct"]]["latex"]:
                errors.append(f"the border draws {style}, not {right}")
            if {o["values"][0] for o in options} != set(LINES):
                errors.append("the options are the three lines and no line")
        else:
            errors.append(f"unknown case {case}")

    elif level in (3, 4):
        s = sizes(read[1])
        if None in s.values() or not s["padding"] or not s["border"]:
            return errors + ["a rule with width, padding and border in pixels"], case
        edge = s["width"] + 2 * s["padding"] + 2 * s["border"]
        if level == 3:
            if "box-sizing" in read[1]:
                errors.append("level 3 has no box-sizing")
            if case == "bordo":
                wanted, words = edge, "dal bordo sinistro al bordo destro"
                if str(s["width"] + s["padding"] + s["border"]) not in [o["values"][0] for o in options]:
                    errors.append("the mistake of adding padding and border once is not among the options")
            elif case == "spazio":
                wanted, words = edge + 2 * s["margin"], "margini compresi"
                if "margin" not in read[1]:
                    errors.append("the room taken needs a margin")
            else:
                return errors + [f"unknown case {case}"], case
        else:
            border_box = s["sizing"] == "border-box"
            if "margin" in read[1] or s["sizing"] not in ("content-box", "border-box"):
                errors.append("level 4 has no margin, and box-sizing is border-box when it is there")
            if case == "scatola":
                wanted, words = (s["width"] if border_box else edge), "dal bordo sinistro al bordo destro"
                if not border_box:
                    errors.append("the box of level 4 is asked with border-box")
            elif case == "contenuto":
                wanted, words = s["width"] - 2 * s["padding"] - 2 * s["border"], "largo il contenuto"
                if not border_box:
                    errors.append("the content shrinks only with border-box")
            elif case == "senza":
                wanted, words = s["width"], "largo il contenuto"
                if "box-sizing" in read[1]:
                    errors.append("this case has no box-sizing")
            else:
                return errors + [f"unknown case {case}"], case
        if words not in sample["problem"]:
            errors.append("the question does not ask for that width")
        if right != str(wanted) or not number():
            errors.append(f"the width is {wanted} px, not {right}")

    elif level == 5:
        d = dict(read[1])
        if d.get("width") != "?":
            return errors + ["the width to find is a question mark"], case
        s = sizes({**d, "width": "0px"})
        m = re.search(r"largo (\d+) px dal bordo sinistro al bordo destro", sample["problem"])
        if not m or int(m.group(1)) != params["total"] or not s["padding"] or not s["border"]:
            return errors + ["the size of the box is not in the question"], case
        total = int(m.group(1))
        wanted = total if s["sizing"] == "border-box" else total - 2 * s["padding"] - 2 * s["border"]
        if case != s["sizing"]:
            errors.append("the case is not the box-sizing of the rule")
        if right != str(wanted) or not number():
            errors.append(f"the width to write is {wanted}px, not {right}")
        if options[choice["correct"]]["latex"] != f"{wanted}px":
            errors.append("the right option is not written as a CSS value")

    elif level == 6:
        if case == "margini":
            one = read_rule(sample.get("listing", ""))
            if one:
                bottom, top = pixels(one[1].get("margin-bottom", "")), pixels(one[1].get("margin-top", ""))
                names = (one[0], one[0])
            else:
                found = re.findall(r"([a-z0-9]+) \{ margin-(top|bottom): (\d+)px; \}\n", sample.get("listing", ""))
                if len(found) != 2 or found[0][1] != "bottom" or found[1][1] != "top":
                    return errors + ["the margin under the first and the margin over the second"], case
                bottom, top, names = int(found[0][2]), int(found[1][2]), (found[0][0], found[1][0])
            if bottom is None or top is None or bottom == top or not set(names) <= BLOCKS:
                return errors + ["two blocks with two different margins"], case
            if (params["first"], params["second"], params["bottom"], params["top"]) != (*names, bottom, top):
                errors.append("params do not say what the rules say")
            if right != str(max(bottom, top)) or not number():
                errors.append(f"between the two there are {max(bottom, top)} px, not {right}")
            if str(bottom + top) not in [o["values"][0] for o in options]:
                errors.append("the sum of the two margins is not among the options")
        elif case in ("blocco", "linea", "larghezza"):
            tags = [o["values"][0] for o in options]
            wanted = BLOCKS if case == "blocco" else INLINES
            good = [t in wanted for t in tags]
            if not set(tags) <= BLOCKS | INLINES or sorted(tags) != sorted(params["tags"]):
                errors.append("the options are elements of the lesson")
            if good != [i == choice["correct"] for i in range(4)]:
                errors.append(f"the right element is not the only one of its kind: {good}")
            words = {"blocco": "riga nuova", "linea": "dentro la riga di testo", "larghezza": "non ha effetto"}[case]
            if words not in sample["problem"]:
                errors.append("the question does not ask for that kind of element")
        else:
            errors.append(f"unknown case {case}")
    else:
        errors.append(f"unknown level {level}")
    return errors, case
