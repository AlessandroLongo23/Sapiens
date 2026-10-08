# Turns the renders of scena.py into what the landing page shows.
# Run: python3 scripts/landing/export-scena.py <out dir of scena.py>   (needs Pillow, numpy, cwebp and ffmpeg)
# The still becomes public/landing/scena.webp. The frames become scena.webm (VP9 with alpha,
# for Chrome and Firefox) and scena.mov (HEVC with alpha, for Safari), with a key frame where
# the loop starts, so the film can jump back there. As on the subject cards, the ground only
# catches the shadows, which are made lighter here and fade out towards the edges.
import sys, os, glob, subprocess, tempfile
import numpy as np
from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'landing')
INTRO = 40  # frames before the loop, as in scena.py
os.makedirs(OUT, exist_ok=True)


def clean(src, dst):
	a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255
	h, w = a.shape[:2]
	y, x = np.mgrid[0:h, 0:w]
	# the ground reaches the edges of the picture: its shadows fade out before they do
	edge = np.minimum(np.minimum(x, w - 1 - x) / (0.16 * w), np.minimum(y, h - 1 - y) / (0.2 * h))
	fade = np.clip(edge, 0, 1) ** 1.5
	alpha = a[..., 3]
	shadow = (a[..., :3].max(axis=2) < 0.08) & (alpha < 0.97)
	a[..., 3] = np.where(shadow, alpha * fade * 0.7, alpha)
	Image.fromarray((a * 255).round().astype(np.uint8)).save(dst)


still = os.path.join(SRC, 'scena.png')
if os.path.exists(still):
	with tempfile.NamedTemporaryFile(suffix='.png') as t:
		clean(still, t.name)
		subprocess.run(['cwebp', '-quiet', '-q', '86', '-alpha_q', '92', '-resize', '2400', '0', t.name, '-o', os.path.join(OUT, 'scena.webp')], check=True)
	print('still')
frames = sorted(glob.glob(os.path.join(SRC, 'frames', '*.png')))
if frames:
	with tempfile.TemporaryDirectory() as tmp:
		for k, f in enumerate(frames):
			clean(f, os.path.join(tmp, f'{k:04d}.png'))
		src = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', os.path.join(tmp, '%04d.png'), '-an']
		key = ['-force_key_frames', f'{INTRO / 30:.4f}']
		subprocess.run(src + key + ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-auto-alt-ref', '0', os.path.join(OUT, 'scena.webm')], check=True)
		subprocess.run(src + key + ['-c:v', 'hevc_videotoolbox', '-allow_sw', '1', '-alpha_quality', '0.8', '-q:v', '60', '-vtag', 'hvc1', '-pix_fmt', 'bgra', os.path.join(OUT, 'scena.mov')], check=True)
	print('film', len(frames), 'frames')
