"""Frames for the critic: one per step of a rendered clip, plus contact sheets.

    .venv/bin/python tools/frames.py <video.mp4> <Scene>

Reads media/controlli/<Scene>.json (written by SapiensScene), grabs the frame just before
the end of every step, and writes media/critica/<Scene>/NN.png and foglio-K.png (3x3
steps per sheet, each labelled with step number and time).
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def main(video: str, scene: str) -> None:
    report = json.loads((ROOT / "media" / "controlli" / f"{scene}.json").read_text())
    out = ROOT / "media" / "critica" / scene
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.png"):
        old.unlink()
    steps = [s for s in report["passi"] if s["t"] > 0]
    # Merge steps closer than 0.4 s: the critic needs states, not every tick.
    kept: list[dict] = []
    for s in steps:
        if kept and s["t"] - kept[-1]["t"] < 0.4:
            kept[-1] = s
        else:
            kept.append(s)
    paths = []
    for s in kept:
        p = out / f"{s['n']:03d}.png"
        t = max(0.0, min(s["t"], report["durata"] - 0.1) - 0.04)
        # Seeking right at the end yields no frame: step back until one comes out.
        while not p.exists() and t >= 0:
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", video, "-frames:v", "1", str(p)], check=True)
            t -= 0.25
        paths.append((s, p))
    font = ImageFont.load_default(size=28)
    for k in range(0, len(paths), 9):
        chunk = paths[k : k + 9]
        tw, th = 640, 360
        sheet = Image.new("RGB", (tw * 3, th * ((len(chunk) + 2) // 3)), "white")
        for i, (s, p) in enumerate(chunk):
            im = Image.open(p).convert("RGB").resize((tw, th))
            d = ImageDraw.Draw(im)
            d.rectangle([0, 0, 190, 36], fill="black")
            d.text((6, 2), f"#{s['n']}  {s['t']:.1f}s", fill="white", font=font)
            if s["problemi"]:
                d.rectangle([0, th - 8, tw, th], fill="red")
            sheet.paste(im, ((i % 3) * tw, (i // 3) * th))
        sheet.save(out / f"foglio-{k // 9 + 1}.png")
    print(f"{len(paths)} fotogrammi, {(len(paths) + 8) // 9} fogli in {out}")
    if report["problemi"]:
        print("Problemi di layout:\n  " + "\n  ".join(report["problemi"]))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
