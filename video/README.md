# Video delle lezioni

Clip animate con voce per le lezioni di Sapiens, in manim con il tema a quadretti del sito. Decisione: `vault/Decisioni/2026-09-30 Le lezioni hanno clip animate per sezione, fatte con un manim a quadretti.md`.

## Installazione (macOS)
- `brew install cairo pango pkg-config ffmpeg sox`
- LaTeX: TinyTeX in `~/Library/TinyTeX` con `tlmgr install dvisvgm standalone preview doublestroke ms setspace rsfs relsize ragged2e fundus-calligra microtype wasysym physics jknapltx wasy cm-super babel-english mathastext`
- `uv venv --python 3.12 .venv && uv pip install --python .venv/bin/python manim "manim-voiceover[openai]"` (manim 0.21.0, manim-voiceover 0.4.0)
- `.env` con `OPENAI_API_KEY` per la voce vera (non è nella repo).

## Uso
- `./render.sh <file.py> <Scena> [-ql|-qm|-qh]`: render (anteprima a 480p se non si passa niente). La voce di bozza è `say -v Alice`; `SAPIENS_VOCE=openai ./render.sh ...` usa gpt-4o-mini-tts.
- `.venv/bin/python tools/frames.py <video.mp4> <Scena>`: un fotogramma per passo e i fogli di provini in `media/critica/<Scena>/`, per il critico.
- Il controllo del layout gira da solo a ogni animazione e scrive `media/controlli/<Scena>.json`.

## Come si scrive una clip
1. Piano sequenza in `lezioni/<lezione>/piano.md`, dalla lezione pubblicata.
2. Leggi `pitfalls.md`.
3. Una scena per clip, sottoclasse di `SapiensScene`: blocchi con `metti`/`colonna` nelle zone A-F x 1-6 (la riga A è l'intestazione), segni da `sapiens.marks`, voce con i bookmark.
4. Render a 720p, controllo pulito, fotogrammi, un agente critico legge fogli, codice, `.srt` e lezione. Si corregge e si rifà il giro; ogni problema nuovo va in `pitfalls.md`.

## File
- `sapiens/theme.py`: colori (dai token di `globals.css`), font del sito, quadretti.
- `sapiens/marks.py`: evidenziatore, cerchio, barra, spunta, riquadro, freccia, sottolineatura.
- `sapiens/layout.py`: griglia delle zone e controllo automatico.
- `sapiens/scene.py`: scena base, intestazione, colonne, pulizia della pagina.
- `sapiens/voice.py`: la voce, tagliata ai bookmark.
