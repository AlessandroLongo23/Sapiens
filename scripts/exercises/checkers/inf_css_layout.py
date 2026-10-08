"""Checker for inf-css-layout (specs/exercises/inf-css-layout.md): flexbox.

Written from the spec. Nothing is run: the fragments of HTML and of CSS are read here, and the answer of every
sample is worked out again from them.
- level 1: the rule is read, and who its selector takes decides which elements go in a row;
- level 2: direction, justify-content and align-items are read from the rule (missing ones have their starting
  value) and turned into a place across and a place down;
- levels 3 and 4: the widths are read from the two rules and the count is done again;
- level 5: every option is read as CSS and tested against what the case asks for; only the right one passes.
"""
import math
import re

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"chi": (0.40, 0.60), "dove": (0.40, 0.60)},
    2: {"dove": (0.40, 0.60), "regola": (0.40, 0.60)},
    3: {k: (0.17, 0.33) for k in ("avanzo", "flex", "between", "tutti")},
    4: {k: (0.25, 0.42) for k in ("prima-riga", "righe", "nowrap")},
    5: {k: (0.13, 0.27) for k in ("intestazione", "colonne", "menu", "centro", "colonna")},
}

RULE = re.compile(r"([^{}]+)\{([^}]*)\}")
BLOCK_ITEMS = {"li", "p", "article", "h3"}


def read_css(text):
    """A style sheet as {selector: {property: value}}; a declaration without a colon is an error."""
    sheet = {}
    for selector, body in RULE.findall(text):
        rule = sheet.setdefault(selector.strip(), {})
        for declaration in body.split(";"):
            if not declaration.strip():
                continue
            name, _, value = declaration.partition(":")
            rule[name.strip()] = value.strip()
    return sheet


def px(value):
    m = re.fullmatch(r"(\d+)px", value or "")
    return int(m.group(1)) if m else None


def is_flex(rule):
    return rule.get("display") == "flex"


def layout(rule):
    """(column, place across, place down) of the elements of a flex container, or None when it is not one."""
    if not is_flex(rule):
        return None
    column = rule.get("flex-direction", "row") == "column"
    justify = rule.get("justify-content", "flex-start")
    align = rule.get("align-items", "stretch")
    return (column, align if column else justify, justify if column else align)


def check_1(sample, options, right, errors):
    p = sample["params"]
    listing = sample.get("listing", "")
    page = listing.split("\n\n")[0]
    tags = re.findall(r"<(\w+)(?: class=\"([\w-]+)\")?>", page)
    if not tags or tags[0][0] != p["outer"] or tags[1] != (p["inner"], p["class"]) or [t for t, _ in tags[2:]] != [p["item"]] * len(p["voices"]):
        errors.append("the page is not outer > inner with a class > items")
    if p["item"] not in BLOCK_ITEMS or not 2 <= len(p["voices"]) <= 4:
        errors.append("2 to 4 block items")
    selectors = {p["outer"]: "none-outer", "." + p["class"]: "items", f".{p['class']} {p['item']}": "none-item"}
    if p["case"] == "chi":
        sheet = read_css(listing.split("\n\n", 1)[1] if "\n\n" in listing else "")
        if len(sheet) != 1:
            return errors.append("one rule under the page")
        (selector, rule), = sheet.items()
        if not is_flex(rule) or selector not in selectors:
            return errors.append("the rule is display: flex on one of the three selectors")
        if right["values"][0] != selectors[selector]:
            errors.append(f"with {selector} the right answer is {selectors[selector]}, not {right['values'][0]}")
        if str(len(p["voices"])) not in right["latex"] and selectors[selector] == "items":
            errors.append("the right answer does not say how many items")
    else:
        good = []
        for o in options:
            sheet = read_css(o.get("listing", ""))
            good.append(len(sheet) == 1 and is_flex(sheet.get("." + p["class"], {})))
        if good != [o is right for o in options]:
            errors.append(f"the rule on the class is not the only right one: {good}")


WORDS_X = {"flex-start": "a sinistra", "center": "al centro in orizzontale", "flex-end": "a destra"}
WORDS_Y = {"flex-start": "in alto", "center": "al centro in verticale", "flex-end": "in basso"}


def check_2(sample, options, right, errors):
    p = sample["params"]
    # worked out here from the three values: justify-content follows the direction
    column = p["column"]
    x = p["align"] if column else p["justify"]
    y = p["justify"] if column else p["align"]
    want = (column, x, y)
    words = f"{'In colonna' if column else 'In riga'}, {WORDS_X[x]} e {WORDS_Y[y]}"
    if p["case"] == "dove":
        sheet = read_css(sample.get("listing", ""))
        rule = sheet.get(p["selector"], {})
        if layout(rule) != want:
            errors.append(f"the rule shown does not lay the elements as {want}")
        if right["latex"] != words:
            errors.append(f"the right answer should read: {words}")
        if any(o["latex"] == words for o in options if o is not right):
            errors.append("a wrong option says the right place")
    else:
        if words[0].lower() + words[1:] not in sample["problem"].replace("in riga,", "in riga,"):
            errors.append("the question does not describe the layout of its params")
        good = [layout(read_css(o.get("listing", "")).get(p["selector"], {})) == want for o in options]
        if good != [o is right for o in options]:
            errors.append(f"the right rule is not the only one that gives the layout: {good}")


def sizes(sample):
    p = sample["params"]
    sheet = read_css(sample.get("listing", ""))
    box = sheet.get(p["box"], {})
    item = sheet.get(p["item"], {})
    return sheet, box, item, px(box.get("width")), px(box.get("gap", "0px")), px(item.get("width"))


def same_sizes(sample, width, gap, w, errors):
    """The numbers of the fragment are those the sample declares in its params."""
    p = sample["params"]
    if (width, gap, w or 0) != (p["width"], p["gap"], p["w"]):
        errors.append(f"the fragment says {width}, {gap}, {w} and the params {p['width']}, {p['gap']}, {p['w']}")


def check_3(sample, options, right, errors):
    p = sample["params"]
    sheet, box, item, width, gap, w = sizes(sample)
    n = p["n"]
    if not is_flex(box) or width is None:
        return errors.append("the container is flex and has a width")
    same_sizes(sample, width, gap, w, errors)
    case = p["case"]
    if not (3 if case == "between" else 2) <= n <= 5 or str(n) not in sample["problem"]:
        errors.append("the number of elements is not in the question")
    if case == "avanzo":
        answer = width - n * w - (n - 1) * gap
    elif case == "flex":
        if sheet.get(".ultima", {}).get("flex") != "1":
            errors.append("the last element has flex: 1")
        answer = width - (n - 1) * w - (n - 1) * gap
    elif case == "between":
        if box.get("justify-content") != "space-between" or "gap" in box:
            errors.append("space-between without a gap")
        answer = (width - n * w) / (n - 1)
    else:
        if item.get("flex") != "1":
            errors.append("every element has flex: 1")
        answer = (width - (n - 1) * gap) / n
    if answer <= 0 or answer != int(answer):
        errors.append(f"the answer {answer} is not a whole positive number of pixels")
    elif right["values"][0] != str(int(answer)):
        errors.append(f"the answer is {int(answer)}, the sample says {right['values'][0]}")


def check_4(sample, options, right, errors):
    p = sample["params"]
    sheet, box, item, width, gap, w = sizes(sample)
    if not is_flex(box) or None in (width, gap, w):
        return errors.append("the container is flex and has widths")
    same_sizes(sample, width, gap, w, errors)
    per = (width + gap) // (w + gap)
    if not 2 <= per <= 4 or not per < p["count"] <= 3 * per:
        errors.append(f"{per} per row and {p['count']} elements are outside the spec")
    wrap = box.get("flex-wrap")
    case = p["case"]
    if wrap != ("nowrap" if case == "nowrap" else "wrap"):
        errors.append("flex-wrap does not match the case")
    answer = {"prima-riga": str(per), "righe": str(math.ceil(p["count"] / per)), "nowrap": "shrink"}[case]
    if right["values"][0] != answer:
        errors.append(f"the answer is {answer}, the sample says {right['values'][0]}")
    if case == "nowrap" and f"ne starebbero {per}" not in sample["problem"]:
        errors.append("the question says how many would fit")


def good_5(case, sheet, p):
    box = sheet.get(p["selector"], {})
    if case == "intestazione":
        return layout(box) == (False, "space-between", "center")
    if case == "colonne":
        return is_flex(box) and box.get("flex-direction", "row") == "row" and px(box.get("gap")) == p["gap"] and sheet.get("main", {}).get("flex") == "1" and "flex" not in sheet.get("aside", {})
    if case == "menu":
        return len(sheet) == 1 and p["selector"].endswith(" ul") and is_flex(box) and box.get("flex-direction", "row") == "row" and px(box.get("gap")) == p["gap"]
    if case == "centro":
        return is_flex(box) and box.get("justify-content") == "center" and box.get("align-items") == "center"
    return layout(box) is not None and layout(box)[:2] == (True, "center")


def check_5(sample, options, right, errors):
    p = sample["params"]
    # the menu is told as "un elenco ul dentro nav": the container is the list, named by its two parts
    if not all(part in sample["problem"] for part in (p["selector"].split() if p["case"] == "menu" else [p["selector"]])):
        errors.append("the question does not name the container")
    if p["gap"] and f"{p['gap']} px" not in sample["problem"]:
        errors.append("the question does not say the gap")
    good = [good_5(p["case"], read_css(o.get("listing", "")), p) for o in options]
    if good != [o is right for o in options]:
        errors.append(f"the right rule is not the only one that gives the layout: {good}")
    if sample.get("solutionListing") != right.get("listing"):
        errors.append("the fragment of the solution is not the right option")


def check(sample):
    errors = common(sample)
    case = sample["params"].get("case")
    choice = choice_of(sample)
    if not choice or sample["answer"]["kind"] != "choice":
        return errors + ["every level is a multiple choice"], case
    options = choice["options"]
    right = options[choice["correct"]]
    {1: check_1, 2: check_2, 3: check_3, 4: check_4, 5: check_5}[sample["level"]](sample, options, right, errors)
    return errors, case
