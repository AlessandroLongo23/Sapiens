"""Checker for inf-script-client (specs/exercises/inf-script-client.md).

Written from the spec. The JavaScript of a sample is read by the interpreter of checkers/_inf_g14.py, the Python of
level 5 is run by Python:
- level 1: the claims are told true from false by the table below; for a page with its script, the page is built
  here, the script sees only the elements above its tag unless it has defer, and what it finds or leaves in the
  page is the right option;
- levels 2 to 4: the script shown is `params.script`, and the right option is what the interpreter says it writes
  (or that it stops for an error);
- level 5: the Python shown is run, each of the four fragments of JavaScript is run, and only the right one writes
  what the Python writes.
"""
import re

from checkers._inf_codice import common, run_python
from checkers._inf_g14 import Page, console, fragments_only, right_of, shown

CASE_RANGES = {
    1: {"concetto": (0.33, 0.47), "head": (0.14, 0.26), "defer": (0.14, 0.26), "fondo": (0.14, 0.26)},
    2: {"conto": (0.33, 0.47), "testo": (0.24, 0.36), "const": (0.24, 0.36)},
    3: {"se": (0.27, 0.40), "uguale": (0.27, 0.40), "logici": (0.27, 0.40)},
    4: {"for": (0.27, 0.40), "while": (0.27, 0.40), "funzione": (0.27, 0.40)},
    5: {"scrivere": (0.19, 0.31), "selezione": (0.19, 0.31), "ciclo": (0.19, 0.31), "funzione": (0.19, 0.31)},
}

# what the lesson says of a script in a page: true or false
CLAIMS = {
    "Lo esegue il browser, sul dispositivo di chi apre la pagina.": True,
    "Chi apre la pagina può leggere il testo dello script.": True,
    "Per fare il conto lo script non aspetta una risposta dal server.": True,
    "Lo script non può leggere i file sul disco di chi apre la pagina.": True,
    "Il file dello script arriva dal server con una richiesta HTTP.": True,
    "Lo script non può guardare le altre schede aperte nel browser.": True,
    "Lo esegue il server, che poi spedisce la pagina già pronta.": False,
    "Il testo dello script resta sul server: chi apre la pagina non lo vede.": False,
    "Una password scritta nello script resta segreta.": False,
    "Lo script può leggere i file sul disco di chi apre la pagina.": False,
    "Per ogni conto lo script chiede il risultato al server.": False,
    "Lo script può leggere le altre schede aperte nel browser.": False,
    "Lo script è scritto in Java.": False,
    "Lo script gira una volta sola, sul computer di chi ha scritto la pagina.": False,
}

LOOSE = re.compile(r"(?<![=!])==(?!=)|!=(?!=)")
NEEDS = {
    (2, "conto"): ["const ", "let ", "console.log("],
    (2, "testo"): ['"', " + ", "console.log("],
    (2, "const"): ["const ", "let ", "console.log("],
    (3, "se"): ["if ("],
    (3, "uguale"): ["if (", "=="],
    (3, "logici"): ["if ("],
    (4, "for"): ["for (let "],
    (4, "while"): ["while ("],
    (4, "funzione"): ["function ", "return "],
}


def house_style(what, script):
    """The JavaScript we show is written as the lessons write it."""
    errors = []
    if re.search(r"\bvar\b", script):
        errors.append(f"{what} uses var")
    if LOOSE.search(script):
        errors.append(f"{what} compares with == or !=")
    if re.search(r"\bonclick\b", script):
        errors.append(f"{what} uses onclick")
    listed = script.rstrip("\n").split("\n")
    for i, row in enumerate(listed):
        indent = len(row) - len(row.lstrip(" "))
        if indent % 4:
            errors.append(f"{what} has a row indented by {indent} spaces")
        # an instruction ends with a semicolon, but for a row that opens or closes a block or goes on in the next one
        goes_on = (i > 0 and listed[i - 1].endswith("(")) or (i + 1 < len(listed) and listed[i + 1].strip().startswith("."))
        if row.strip() and not row.endswith((";", "{", "}", "(", "=")) and not row.strip().startswith("//") and not goes_on:
            errors.append(f"{what} has a row without its semicolon: {row.strip()}")
    return errors


def check_claims(sample, errors):
    options = sample["answer"]["options"]
    asked = "vera" if "è vera?" in sample["problem"] else "falsa" if "è falsa?" in sample["problem"] else None
    if asked is None or asked != sample["params"].get("ask"):
        errors.append("the question does not ask for the true claim or for the false one")
        return
    if any(o["latex"] not in CLAIMS for o in options):
        errors.append("an option is not a claim of the lesson")
        return
    good = [CLAIMS[o["latex"]] == (asked == "vera") for o in options]
    if good != [i == sample["answer"]["correct"] for i in range(len(options))]:
        errors.append(f"the right claim is not the only {asked} one: {good}")
    if sample["solution"] != right_of(sample)["latex"]:
        errors.append("the solution is not the right claim")


def check_order(sample, errors):
    params = sample["params"]
    html, script, file, ident = params["html"], params["script"], params["file"], params["id"]
    if sample.get("listing") != shown(html, script, file):
        errors.append("the fragment shown is not the page and the script of params")
    errors += house_style("the script", script)
    page = Page(html)
    tags = page.all("script")
    if len(tags) != 1 or tags[0].attrs.get("src") != file:
        errors.append("the page does not link its script once")
        return
    tag = tags[0]
    deferred = "defer" in tag.attrs
    where = "defer" if deferred else "head" if tag.parent.tag == "head" else "fondo"
    if deferred and tag.parent.tag != "head":
        errors.append("a script with defer is linked from the head")
    if where == "fondo" and (tag.parent.tag != "body" or tag.parent.children[-1] is not tag):
        errors.append("the script is neither in the head nor the last thing of the body")
    if where != params["case"]:
        errors.append(f"the script tag is in {where}, not in {params['case']}")
    if file not in sample["problem"] or f'"#{ident}"' not in script or len(page.all(f"#{ident}")) != 1:
        errors.append("the question, the script and the page do not name the same file and the same element")
    if not deferred:
        page.visible = tag.order
    found = page.first(f"#{ident}", True) is not None
    page.run(script)
    if page.error == "syntax":
        errors.append(f"the script is not JavaScript: {page.message}")
    right = right_of(sample)["values"][0]
    if "nella costante" in sample["problem"]:
        wanted = "elemento" if found else "null"
        if page.error:
            errors.append("the script that only looks for the element stops")
    elif "che cosa si legge" in sample["problem"]:
        wanted = page.text(f"#{ident}")
        if bool(page.error) == found:
            errors.append("the script stops exactly when it does not find the element")
    else:
        errors.append("the question asks neither what the script finds nor what the page shows")
        return
    if right != wanted:
        errors.append(f"the right option is {right!r}, and the page gives {wanted!r}")


def check_console(sample, errors):
    params = sample["params"]
    script = params["script"]
    level, case = sample["level"], params["case"]
    if sample.get("listing") != script:
        errors.append("the script shown is not the one of params")
    errors += house_style("the script", script)
    for piece in NEEDS.get((level, case), []):
        if piece not in script:
            errors.append(f"a script of {case} without {piece.strip()}")
    if level == 3 and case == "logici" and "&&" not in script and "||" not in script:
        errors.append("a script of logici without && or ||")
    if level == 2 and re.search(r"\b(if|for|while|function)\b", script):
        errors.append("level 2 has no selection, loop or function")
    if level == 3 and re.search(r"\b(for|while|function)\b", script):
        errors.append("level 3 has no loop or function")
    page = Page().run(script)
    if page.error == "syntax":
        errors.append(f"the script is not JavaScript: {page.message}")
    if page.error and page.rows:
        errors.append("the script writes something and then stops: no option says that")
    if len(page.rows) > 5:
        errors.append(f"the script writes {len(page.rows)} rows")
    written = console(script)
    right = right_of(sample)["values"][0]
    if right != written:
        errors.append(f"the right option is {right!r}, and the script writes {written!r}")
    if case == "const" and params.get("fails") != (written == "errore"):
        errors.append("params.fails does not say whether the script stops")
    if case != "const" and level != 2 and written == "errore":
        errors.append("a script that stops outside the level of const")
    if "console" not in sample["problem"]:
        errors.append("the question does not ask what the console shows")


def check_translation(sample, errors):
    params = sample["params"]
    python = params["python"]
    options = sample["answer"]["options"]
    if sample.get("listing") != python:
        errors.append("the Python shown is not the one of params")
    if "Python" not in sample["problem"] or "JavaScript" not in sample["problem"]:
        errors.append("the question does not name the two languages")
    need = {"scrivere": "print(", "selezione": "if ", "ciclo": ("for ", "while "), "funzione": "def "}[params["case"]]
    if not any(piece in python for piece in ([need] if isinstance(need, str) else need)):
        errors.append(f"the Python of {params['case']} has not its construct")
    wanted = run_python(python)
    if not wanted:
        errors.append("the Python stops or writes nothing")
        return
    if not all("listing" in o for o in options):
        errors.append("level 5 offers fragments")
        return
    same = [console(o["listing"]) == "\n".join(wanted) for o in options]
    if same != [i == sample["answer"]["correct"] for i in range(len(options))]:
        errors.append(f"the right fragment is not the only one that writes what the Python writes: {same}")
    right = right_of(sample)["listing"]
    errors += house_style("the right fragment", right)
    # the same program, not only the same output: the numbers of the two fragments are the same
    if sorted(re.findall(r"\d+", python)) != sorted(re.findall(r"\d+", right)):
        errors.append("the right fragment has not the numbers of the Python")
    if sample.get("solutionListing") != right:
        errors.append("the fragment of the solution is not the right option")


def check(sample):
    errors = common(sample) + fragments_only(sample)
    params = sample["params"]
    case = params.get("case")
    level = sample["level"]
    if sample["answer"]["kind"] != "choice":
        return errors, case
    if level == 1:
        if case == "concetto":
            check_claims(sample, errors)
        else:
            check_order(sample, errors)
    elif level in (2, 3, 4):
        check_console(sample, errors)
    elif level == 5:
        check_translation(sample, errors)
    return errors, case
