"""
A sheet per action from the frames of scripts/lab/usi.mjs: up to eight of them, evenly spaced, in two rows, so an
action can be looked at in one image.

    python3 scripts/lab/usi_sheets.py <out dir> [name filter]
"""
import glob
import os
import re
import sys

from PIL import Image, ImageDraw

out = sys.argv[1]
only = sys.argv[2] if len(sys.argv) > 2 else ''
groups = {}
for f in sorted(glob.glob(os.path.join(out, '*-[0-9][0-9].png'))):
    m = re.match(r'(.*)-(\d\d)\.png$', os.path.basename(f))
    if m and only in m.group(1):
        groups.setdefault(m.group(1), []).append(f)

COLS, W, H = 4, 480, 300
for tag, frames in groups.items():
    n = min(8, len(frames))
    pick = [frames[round(i * (len(frames) - 1) / max(1, n - 1))] for i in range(n)]
    rows = (n + COLS - 1) // COLS
    sheet = Image.new('RGB', (COLS * W, rows * H), '#202020')
    draw = ImageDraw.Draw(sheet)
    for i, f in enumerate(pick):
        im = Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS)
        x, y = (i % COLS) * W, (i // COLS) * H
        sheet.paste(im, (x, y))
        draw.text((x + 6, y + 4), os.path.basename(f)[-6:-4], fill='#ffe14a')
    sheet.save(os.path.join(out, f'foglio-{tag}.png'))
    print(f'foglio-{tag}.png', len(frames), 'frames')
