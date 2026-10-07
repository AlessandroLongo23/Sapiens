"""Checker for inf-validazione-moduli (specs/exercises/inf-validazione-moduli.md).

Written from the spec. The form is built here (what is written in a field is the `value` attribute of its tag), the
script is run by the interpreter of checkers/_inf_g14.py with the names the question says are already taken (`form`,
the fields, `errore`), and `submit` is fired:
- level 1: what the script writes, and for the lengths the count of the characters done again here;
- level 2: each of the four values is written in the field and the form is sent: one only passes, or one only is
  stopped, as the question asks;
- level 3: the message the function leaves in `errore`, and which of the checks gave it;
- level 4: whether `submit` was stopped and whether a message was written: four things can happen;
- level 5: each of the four conditions is put in the place of the comment and tried on values chosen here; only the
  right one stops exactly the values the question says.
"""
import re

from checkers._inf_codice import common
from checkers._inf_g14 import Page, fragments_only, right_of, shown
from checkers.inf_script_client import house_style

CASE_RANGES = {
    1: {"lunghezza": (0.33, 0.47), "somma": (0.29, 0.41), "casella": (0.19, 0.31)},
    2: {"vuoto": (0.19, 0.31), "lunghezza": (0.19, 0.31), "forma": (0.19, 0.31), "intervallo": (0.19, 0.31)},
    3: {"primo": (0.19, 0.31), "secondo": (0.19, 0.31), "terzo": (0.19, 0.31), "nessuno": (0.19, 0.31)},
    4: {"parte": (0.19, 0.31), "fermato": (0.19, 0.31), "lo-stesso": (0.19, 0.31), "mai": (0.19, 0.31)},
    5: {"uguali": (0.24, 0.36), "vuoto": (0.14, 0.26), "intervallo": (0.24, 0.36), "somma": (0.14, 0.26)},
}

ORDINALS = ["primo", "secondo", "terzo"]


def form_of(html, script, fields):
    """A form with its fields and the element of the message; the script finds them under their names."""
    page = Page(f"<form>{html}</form><span id=\"errore\"></span>")
    given = {"form": page.first("form"), "errore": page.first("#errore")}
    for name in fields:
        given[name] = page.first(f"#{name}")
        if given[name] is None:
            raise ValueError(f"no field {name}")
    for name, value in given.items():
        page.interp.top.declare(name, value)
    return page.run(script)


def sent(page):
    """Fires submit: whether it was stopped, and the message left in `errore`."""
    event = page.fire(page.first("form"), "submit")[0]
    return event.prevented, page.text("#errore")


def check_reading(sample, errors):
    params = sample["params"]
    html, script = params["html"], params["script"]
    if sample.get("listing") != shown(html, script):
        errors.append("the fragment shown is not the page and the script of params")
    errors.extend(house_style("the script", script))
    page = Page(html).run(script)
    if page.error:
        errors.append(f"the script stops: {page.message}")
    written = "\n".join(page.rows)
    right = right_of(sample)["values"][0]
    if right != written:
        errors.append(f"the right option is {right!r}, and the script writes {written!r}")
    case = params["case"]
    if case == "lunghezza":
        m = re.search(r'value="([^"]*)"', html)
        counted = len(m.group(1).strip(" ") if ".trim()" in script else m.group(1)) if m else None
        if m is None or m.group(1) == m.group(1).strip(" ") or str(counted) != right:
            errors.append(f"the field has spaces around its text, and its characters are {counted}")
        if "spazi compresi" not in sample["problem"]:
            errors.append("the question does not say that the spaces count")
    elif case == "somma":
        if not re.search(r"\w \+ \w", script) or ".value" not in script:
            errors.append("the case somma adds what is read from a field")
    elif case == "casella":
        if html.count('type="checkbox"') != 2 or script.count(".checked") != 2:
            errors.append("the case casella reads two boxes")


def check_values(sample, errors):
    params = sample["params"]
    script, name = params["script"], params["field"]
    if sample.get("listing") != script:
        errors.append("the script shown is not the one of params")
    errors.extend(house_style("the script", script))
    if script.count("if (") != 1 or "event.preventDefault();" not in script or '"submit"' not in script:
        errors.append("level 2 has one check in a listener of submit")
    wants = "passa" if "il modulo parte?" in sample["problem"] else "fermato" if "viene fermato?" in sample["problem"] else None
    if wants is None or wants != params.get("ask") or name not in sample["problem"]:
        errors.append("the question does not ask which value passes or which is stopped")
        return
    options = sample["answer"]["options"]
    stopped = []
    for o in options:
        text = o.get("listing", "").rstrip("\n")
        if len(text) < 2 or text[0] != '"' or text[-1] != '"':
            errors.append("a value is not shown between quotes")
            return
        page = form_of(f'<input id="{name}">', script, [name])
        if page.error:
            errors.append(f"the script stops: {page.message}")
            return
        page.first(f"#{name}").value = text[1:-1]
        stopped.append(sent(page)[0])
    asked = [s == (wants == "fermato") for s in stopped]
    if asked != [i == sample["answer"]["correct"] for i in range(len(options))]:
        errors.append(f"the right value is not the only one that is {wants}: stopped {stopped}")
    need = {"vuoto": '=== ""', "lunghezza": ".length ", "forma": ".includes(", "intervallo": " || "}[params["case"]]
    if need not in script:
        errors.append(f"a check of {params['case']} without {need}")


def check_message(sample, errors):
    params = sample["params"]
    html, script, name = params["html"], params["script"], params["field"]
    if sample.get("listing") != shown(html, script):
        errors.append("the fragment shown is not the page and the script of params")
    errors.extend(house_style("the script", script))
    messages = [m for m in re.findall(r'return "([^"]*)";', script) if m]
    if not 2 <= len(messages) <= 3 or len(set(messages)) != len(messages):
        errors.append("the function has two or three checks, each with its message")
    page = form_of(html, script, [name])
    if page.error:
        errors.append(f"the script stops: {page.message}")
    message = page.text("#errore")
    right = right_of(sample)["values"][0]
    if right != message:
        errors.append(f"the right option is {right!r}, and the message is {message!r}")
    wanted = ORDINALS[messages.index(message)] if message in messages else "nessuno"
    if params["case"] != wanted:
        errors.append(f"the case is {params['case']} and the value stops at {wanted}")
    labels = [o["latex"] for o in sample["answer"]["options"]]
    if any(m not in labels for m in messages) or "" not in [o["values"][0] for o in sample["answer"]["options"]]:
        errors.append("the options are not the messages of the function and no message")
    if "spazi compresi" not in sample["problem"]:
        errors.append("the question does not say that the spaces count")


def check_sending(sample, errors):
    params = sample["params"]
    html, script, name = params["html"], params["script"], params["field"]
    if sample.get("listing") != shown(html, script):
        errors.append("the fragment shown is not the page and the script of params")
    errors.extend(house_style("the script", script))
    if script.count("if (") != 1 or '"submit"' not in script:
        errors.append("level 4 has one check in a listener of submit")
    page = form_of(html, script, [name])
    if page.error:
        errors.append(f"the script stops: {page.message}")
    prevented, message = sent(page)
    if page.error:
        errors.append(f"the listener stops: {page.message}")
    wanted = {(False, False): "parte", (True, True): "fermato", (False, True): "lo-stesso", (True, False): "mai"}[(prevented, bool(message))]
    right = right_of(sample)["values"][0]
    if right != wanted or params["case"] != wanted:
        errors.append(f"the right option is {right!r}, the case {params['case']!r}, and the form gives {wanted!r}")
    if {o["values"][0] for o in sample["answer"]["options"]} != {"parte", "fermato", "lo-stesso", "mai"}:
        errors.append("the four options are not the four things that can happen")
    # where preventDefault is: inside the braces of the if, nowhere, or outside them
    inside = bool(re.search(r"\{\n {8}messaggio = [^\n]*\n {8}event\.preventDefault\(\);", script))
    place = "giusto" if inside else "sempre" if "event.preventDefault();" in script else "manca"
    if params.get("place") != place:
        errors.append(f"preventDefault is {place}, not {params.get('place')}")


def trials(params):
    """The values to try a condition on, and whether the check described stops each: said again here from the spec."""
    case = params["case"]
    if case == "uguali":
        pairs = [("ada@x", "ada@x"), ("ada@x", "ada@y"), ("ada@x ", "ada@x"), (" ada@x", "ada@x"), ("", ""), ("a", "")]
        clean = (lambda t: t.strip(" ")) if params["trims"] else (lambda t: t)
        return [(pair, clean(pair[0]) != clean(pair[1])) for pair in pairs]
    if case == "vuoto":
        return [((v,), v.strip(" ") == "") for v in ["", " ", "   ", "Ada", " Ada ", "a"]]
    if case == "intervallo":
        low, high = params["low"], params["high"]
        return [((str(n),), not low <= n <= high) for n in [low - 2, low - 1, low, low + 1, high - 1, high, high + 1, high + 5]]
    top = params["max"]
    pairs = [(0, 0), (1, 1), (1, top - 1), (top, 0), (1, top), (top + 1, 0), (0, top + 1), (2, 3), (top, top), (2, 1)]
    return [((str(a), str(b)), a + b > top) for a, b in pairs]


def check_condition(sample, errors):
    params = sample["params"]
    script, fields = params["script"], params["fields"]
    if sample.get("listing") != script or script.count("/* condizione */") != 1:
        errors.append("the script shown is the one of params, with one comment where the condition goes")
        return
    for key in ("low", "high", "max"):
        if key in params and not re.search(rf"\b{params[key]}\b", sample["problem"]):
            errors.append(f"the question does not say the number {params[key]}")
    if not all(name in sample["problem"] for name in fields):
        errors.append("the question does not name the fields")
    if params["case"] == "uguali" and params["trims"] != ("tolti gli spazi" in sample["problem"]):
        errors.append("the question and params.trims do not agree on the spaces")
    tests = trials(params)
    options = sample["answer"]["options"]
    if not all("listing" in o for o in options):
        errors.append("level 5 offers fragments")
        return
    html = "".join(f'<input id="{name}">' for name in fields)
    good = []
    for o in options:
        whole = script.replace("/* condizione */", " ".join(o["listing"].split())) + '\nform.addEventListener("submit", controlla);\n'
        does = []
        for values, _stop in tests:
            page = form_of(html, whole, fields)
            for name, value in zip(fields, values):
                page.first(f"#{name}").value = value
            prevented = sent(page)[0]
            does.append("errore" if page.error else prevented)
        good.append(does == [stop for _values, stop in tests])
    if good != [i == sample["answer"]["correct"] for i in range(len(options))]:
        errors.append(f"the right condition is not the only one that stops what the question says: {good}")
    right = right_of(sample)["listing"]
    errors.extend(e for e in house_style("the right condition", right + ";") if "indented" not in e and "semicolon" not in e)
    if sample.get("solutionListing") != right:
        errors.append("the fragment of the solution is not the right option")


def check(sample):
    errors = common(sample) + fragments_only(sample)
    case = sample["params"].get("case")
    if sample["answer"]["kind"] != "choice":
        return errors, case
    [check_reading, check_values, check_message, check_sending, check_condition][sample["level"] - 1](sample, errors)
    return errors, case
