"""The narrator, with exact bookmark timing.

The script is cut at every bookmark, each piece is synthesised on its own and the pieces
are joined: a bookmark falls exactly where its piece begins, with no transcription step.
The engine is swappable:

- "openai": gpt-4o-mini-tts with a teacher's instructions (needs OPENAI_API_KEY and credit);
- "say": the macOS voice Alice, free and local, for drafts.

Results are cached by text, engine, voice and instructions in video/.cache/voce.
"""

from __future__ import annotations

import os
import re
import subprocess
import tempfile
from pathlib import Path

from manim_voiceover.helper import remove_bookmarks
from manim_voiceover.services.base import SpeechService
from manim_voiceover.tracker import AUDIO_OFFSET_RESOLUTION

CACHE = Path(__file__).resolve().parent.parent / ".cache" / "voce"
BOOKMARK = re.compile(r"<bookmark\s*mark\s*=['\"]\w*['\"]\s*/>")

ISTRUZIONI = (
    "Sei un insegnante di matematica di un liceo italiano che spiega a uno studente di quindici anni. "
    "Italiano standard, senza accento regionale. Voce calda e chiara, ritmo calmo ma non lento, "
    "come chi spiega alla lavagna: piccole pause dopo ogni passaggio, enfasi leggera sulle parole chiave. "
    "Niente tono da pubblicità e niente entusiasmo forzato."
)


def _durata(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


class SapiensVoice(SpeechService):
    def __init__(self, motore: str = "say", voice: str | None = None, istruzioni: str = ISTRUZIONI, **kwargs):
        self.motore = motore
        self.voice = voice or {"say": "Alice", "openai": "marin"}[motore]
        self.istruzioni = istruzioni
        CACHE.mkdir(parents=True, exist_ok=True)
        kwargs.setdefault("cache_dir", str(CACHE))
        super().__init__(**kwargs)

    def _sintetizza(self, testo: str, dest: Path) -> None:
        if self.motore == "say":
            aiff = dest.with_suffix(".aiff")
            subprocess.run(["say", "-v", self.voice, "-r", "178", "-o", str(aiff), testo], check=True)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(aiff), "-ar", "44100", "-ac", "1", str(dest)], check=True)
            aiff.unlink()
        else:
            import openai

            if not os.getenv("OPENAI_API_KEY"):
                raise RuntimeError("OPENAI_API_KEY is not set: run through video/render.sh")
            with openai.OpenAI().audio.speech.with_streaming_response.create(model="gpt-4o-mini-tts", voice=self.voice, input=testo, instructions=self.istruzioni, response_format="wav") as r:
                r.stream_to_file(str(dest))

    def generate_from_text(self, text, cache_dir=None, path=None, **kwargs):
        cache_dir = Path(cache_dir or self.cache_dir)
        spoken = remove_bookmarks(text)
        input_data = {"input_text": text, "service": f"sapiens-{self.motore}", "config": {"voice": self.voice, "istruzioni": self.istruzioni if self.motore == "openai" else ""}}
        cached = self.get_cached_result(input_data, cache_dir)
        if cached is not None:
            return cached
        audio = self.get_audio_basename(input_data) + ".mp3"
        # Pieces between bookmarks, with their offset in the bookmark-free text.
        pieces, offset, last = [], 0, 0
        for m in BOOKMARK.finditer(text):
            chunk = text[last : m.start()]
            pieces.append((offset, chunk))
            offset += len(chunk)
            last = m.end()
        pieces.append((offset, text[last:]))
        boundaries, t = [], 0.0
        with tempfile.TemporaryDirectory() as tmp:
            files = []
            for i, (off, chunk) in enumerate(pieces):
                if not chunk.strip():
                    continue
                f = Path(tmp) / f"{i:03d}.wav"
                self._sintetizza(chunk.strip(), f)
                boundaries.append({"audio_offset": int(t * AUDIO_OFFSET_RESOLUTION), "text_offset": off, "word_length": len(chunk), "text": chunk, "boundary_type": "Word"})
                t += _durata(f)
                files.append(f)
            boundaries.append({"audio_offset": int(t * AUDIO_OFFSET_RESOLUTION), "text_offset": len(spoken), "word_length": 1, "text": ".", "boundary_type": "Word"})
            lst = Path(tmp) / "lista.txt"
            lst.write_text("".join(f"file '{f}'\n" for f in files))
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst), "-ar", "44100", "-b:a", "192k", str(cache_dir / audio)], check=True)
        return {"input_text": text, "input_data": input_data, "original_audio": audio, "word_boundaries": boundaries}
