# Turns the frames of giro.py into what the scrolling landing page draws.
# Run: python3 scripts/landing/export-giro.py <out dir of giro.py> [id ...]   (needs Pillow, numpy and cwebp)
# Each frame becomes public/landing/giro/<id>/<nnn>.webp, with the shadow on the ground made
# lighter and faded out towards the edge of the picture, as on the subject cards.
import sys, os, glob, subprocess, tempfile
import numpy as np
from PIL import Image

SRC, ONLY = sys.argv[1], sys.argv[2:]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'landing', 'giro')


def clean(src, dst):
	a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255
	h, w = a.shape[:2]
	y, x = np.mgrid[0:h, 0:w]
	r = np.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2))
	fade = np.clip((0.98 - r) / 0.45, 0, 1) ** 1.5
	alpha = a[..., 3]
	shadow = (a[..., :3].max(axis=2) < 0.08) & (alpha < 0.97)
	a[..., 3] = np.where(shadow, alpha * fade * 0.75, alpha)
	Image.fromarray((a * 255).round().astype(np.uint8)).save(dst)


for folder in sorted(glob.glob(os.path.join(SRC, '*', ''))):
	name = os.path.basename(os.path.dirname(folder))
	frames = sorted(glob.glob(os.path.join(folder, '*.png')))
	if not frames or (ONLY and name not in ONLY):
		continue
	os.makedirs(os.path.join(OUT, name), exist_ok=True)
	with tempfile.TemporaryDirectory() as tmp:
		for k, f in enumerate(frames):
			t = os.path.join(tmp, 'f.png')
			clean(f, t)
			subprocess.run(['cwebp', '-quiet', '-q', '78', '-alpha_q', '88', t, '-o', os.path.join(OUT, name, f'{k:03d}.webp')], check=True)
	print(name, len(frames), 'frames')
