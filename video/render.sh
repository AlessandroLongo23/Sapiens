#!/bin/zsh
# Render a clip: ./render.sh <file.py> <Scene> [manim flags]. Defaults to a quick 480p preview.
# Needs TinyTeX on the PATH and OPENAI_API_KEY (from video/.env) for the narrator.
set -e
cd "${0:A:h}"
export PYTHONPATH="$PWD"
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
[[ -f .env ]] && export $(grep -v '^#' .env | xargs)
file=$1; scene=$2; shift 2
flags=("$@"); (( ${#flags} )) || flags=(-ql)
.venv/bin/manim render --media_dir media "${flags[@]}" "$file" "$scene"
