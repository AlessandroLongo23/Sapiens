"""Checker for inf-dom-eventi (specs/exercises/inf-dom-eventi.md).

Written from the spec. A sample carries the page and the script it shows in `params.html` and `params.script`; here
the page is built from the HTML, the script is run by the interpreter of checkers/_inf_g14.py, the events are fired
and the page is read:
- level 1: the selector is read from the script, and the element it takes (or null, or how many) is found here;
- level 2: after the script, the classes of an element, the items of the list or a text;
- level 3: after `params.clicks`, a text or the classes of an element;
- level 4: each of the four instructions is added to the script, the event is fired twice, and only the right one
  has the function called once for each event and never before; or the script is run as it is and what happens is
  one of four things;
- level 5: after the loop or the clicks, how many items the list has, or the text of the last one.
"""
import re

from checkers._inf_codice import common
from checkers._inf_g14 import Element, Page, fragments_only, right_of, shown
from checkers.inf_script_client import house_style

CASE_RANGES = {
    1: {"primo": (0.33, 0.47), "null": (0.19, 0.31), "quanti": (0.29, 0.41)},
    2: {"classi": (0.43, 0.57), "sostituisce": (0.19, 0.31), "conta": (0.19, 0.31)},
    3: {"conta": (0.24, 0.36), "limite": (0.33, 0.47), "classe": (0.24, 0.36)},
    4: {"quale": (0.33, 0.47), "funziona": (0.10, 0.20), "subito": (0.10, 0.20), "errore": (0.10, 0.20), "mai": (0.10, 0.20)},
    5: {"ciclo": (0.29, 0.41), "clic": (0.29, 0.41), "senza": (0.24, 0.36)},
}


def named(element):
    """An element as an option names it: the list by its id, the others by their tag and their text."""
    if any(isinstance(child, Element) for child in element.children):
        return f"{element.tag}#{element.attrs.get('id')}"
    return f"{element.tag}:{element.text}"


def read(page, how):
    """What `params.read` asks of the page."""
    found = page.all(how["selector"])
    what = how["what"]
    if what == "count":
        return str(len(found))
    if what == "list":
        return "\n".join(element.text for element in found)
    if what == "last":
        return found[-1].text if found else None
    element = found[how.get("index", 0)] if len(found) > how.get("index", 0) else None
    if element is None:
        return None
    return element.text if what == "text" else " ".join(sorted(element.classes))


def started(sample, errors):
    """The page of a sample with its script run, which must not stop."""
    params = sample["params"]
    if sample.get("listing") != shown(params["html"], params["script"]):
        errors.append("the fragment shown is not the page and the script of params")
    errors.extend(house_style("the script", params["script"]))
    if re.search(r"\bon\w+=", params["html"]):
        errors.append("the HTML has an on... attribute")
    page = Page(params["html"]).run(params["script"])
    if page.error:
        errors.append(f"the script stops: {page.message}")
    return page


def clicked(sample, page, errors):
    clicks = sample["params"].get("clicks")
    if not clicks:
        return
    if page.first(clicks["selector"]) is None or page.first(clicks["selector"]).tag != "button":
        errors.append("the clicks are not on a button of the page")
    if not 1 <= clicks["times"] <= 8 or not re.search(rf"\b{clicks['times']} volt[ae]\b", sample["problem"]):
        errors.append("the question does not say how many clicks")
    page.fire(clicks["selector"], "click", clicks["times"])
    if page.error:
        errors.append(f"a listener stops: {page.message}")


def check_selector(sample, errors):
    params = sample["params"]
    page = started(sample, errors)
    texts = [e.text for e in page.root.elements() if not any(isinstance(c, Element) for c in e.children)]
    if len(set(texts)) != len(texts):
        errors.append("two elements of the page have the same text")
    m = re.search(r'querySelector(All)?\(\s*"([^"]+)"\s*\)', params["script"])
    if not m or m.group(2) != params["selector"]:
        errors.append("the script does not use the selector of params")
        return
    found = page.all(m.group(2))
    right = right_of(sample)
    if m.group(1):
        wanted = str(len(found))
        if params["case"] != "quanti" or page.rows != [wanted]:
            errors.append("a script with querySelectorAll writes how many elements it found")
    else:
        wanted = named(found[0]) if found else "null"
        if params["case"] != ("primo" if found else "null"):
            errors.append(f"the case is {params['case']} and the selector takes {len(found)} elements")
        if found and found[0].text not in right["latex"] and (found[0].attrs.get("id") or "?") not in right["latex"]:
            errors.append("the right option does not name the element by its text or its id")
    if right["values"][0] != wanted:
        errors.append(f"the right option is {right['values'][0]!r}, and the selector takes {wanted!r}")


def check_page(sample, errors):
    params = sample["params"]
    page = started(sample, errors)
    how = params["read"]
    start = re.search(r"^let \w+ = (\d+);$", params["script"], re.M)
    if sample["level"] == 3 and params["case"] != "classe" and (not start or read(page, how) != start.group(1)):
        errors.append("the page does not start from the value the counter starts from")
    clicked(sample, page, errors)
    wanted = read(page, how)
    right = right_of(sample)["values"][0]
    if right != wanted:
        errors.append(f"the right option is {right!r}, and the page gives {wanted!r}")
    level, case = sample["level"], params["case"]
    script = params["script"]
    if level == 2:
        if "addEventListener" in script or params.get("clicks"):
            errors.append("level 2 has no events")
        need = {"classi": "classList.", "sostituisce": ".textContent = ", "conta": ".length"}[case]
        if need not in script:
            errors.append(f"a script of {case} without {need}")
        if case == "classi" and page.all(how["selector"])[how["index"]].text not in sample["problem"]:
            errors.append("the question does not name the item it asks about")
    if level == 3:
        if script.count("addEventListener") != 1 or not params.get("clicks"):
            errors.append("level 3 has one listener and some clicks")
        if case == "limite" and not re.search(r"if \(\w+ [<>] \d+\)", script):
            errors.append("a counter with a limit has no if")
        if case == "conta" and "if (" in script:
            errors.append("a plain counter has an if")
        if case == "classe" and (how["what"] != "classes" or "classList." not in script):
            errors.append("the case classe asks for the classes of an element")
        if how["selector"].lstrip("#") not in sample["problem"]:
            errors.append("the question does not name the element to read")
    if level == 5:
        if "createElement" not in script:
            errors.append("level 5 creates elements")
        if ("append(" in script) != (case != "senza"):
            errors.append("only the case senza has no append")
        if case == "ciclo" and ("for (" not in script or params.get("clicks")):
            errors.append("the case ciclo has a loop and no clicks")
        if case == "clic" and not params.get("clicks"):
            errors.append("the case clic has clicks")
        if how["what"] not in ("count", "last") or (how["what"] == "count") != ("quante voci" in sample["problem"]):
            errors.append("the question and params.read do not ask the same thing")


def calls(page, event):
    """How many times the function was called while the script started, and in two events fired afterwards."""
    before = len(page.rows)
    if not page.error:
        page.fire(event["selector"], event["type"], 2)
    return before, len(page.rows) - before


def check_listener(sample, errors):
    params = sample["params"]
    html, script, event = params["html"], params["script"], params["event"]
    if sample.get("listing") != shown(html, script):
        errors.append("the fragment shown is not the page and the script of params")
    if len(Page(html).all(event["selector"])) != 1 or f"function {params['fn']}()" not in script or params["fn"] not in sample["problem"] + sample["solution"]:
        errors.append("the page, the script and the question do not name the same element and the same function")
    options = sample["answer"]["options"]
    if params["case"] == "quale":
        errors.extend(house_style("the script", script))
        if not all("listing" in o for o in options):
            errors.append("the case quale offers fragments")
            return
        good = []
        for o in options:
            page = Page(html).run(script + "\n" + o["listing"])
            good.append(not page.error and calls(page, event) == (0, 2))
        if good != [i == sample["answer"]["correct"] for i in range(len(options))]:
            errors.append(f"the right instruction is not the only one that registers the function: {good}")
        if sample.get("solutionListing") != right_of(sample)["listing"]:
            errors.append("the fragment of the solution is not the right option")
        errors.extend(house_style("the right instruction", right_of(sample)["listing"]))
        return
    page = Page(html).run(script)
    if page.error == "syntax":
        errors.append(f"the script is not JavaScript: {page.message}")
    before, after = calls(page, event)
    wanted = "errore" if page.error else {(0, 2): "funziona", (1, 0): "subito", (0, 0): "mai"}.get((before, after), "altro")
    right = right_of(sample)["values"][0]
    if right != wanted or params["case"] != wanted:
        errors.append(f"the right option is {right!r}, the case {params['case']!r}, and the page gives {wanted!r}")
    if {o["values"][0] for o in options} != {"funziona", "subito", "errore", "mai"}:
        errors.append("the four options are not the four things that can happen")
    if "due" not in sample["problem"]:
        errors.append("the question fires the event twice")


def check(sample):
    errors = common(sample) + fragments_only(sample)
    case = sample["params"].get("case")
    level = sample["level"]
    if sample["answer"]["kind"] != "choice":
        return errors, case
    if level == 1:
        check_selector(sample, errors)
    elif level == 4:
        check_listener(sample, errors)
    else:
        check_page(sample, errors)
    return errors, case
