# Turns the renders of icons.py into what the subject cards show.
# Run: python3 scripts/materie/export.py <out dir of icons.py> [id ...]   (needs Pillow, numpy, cwebp and ffmpeg)
# A still becomes <id>.webp. A loop (frames/<id>/) becomes <id>.webm (VP9 with alpha, for
# Chrome and Firefox) and <id>.mov (HEVC with alpha, for Safari), and its first frame
# replaces the still, so the picture and the film sit exactly on each other.
# The ground under each object only catches its shadow; here the shadow is made
# lighter and faded out towards the edge of the picture, so no square shows on the card.
import sys, os, glob, subprocess, tempfile
import numpy as np
from PIL import Image

SRC, ONLY = sys.argv[1], sys.argv[2:]
# OUT_DIR sends the files elsewhere: the objects of the onboarding go to public/onboarding.
OUT = os.environ.get('OUT_DIR') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'materie')
os.makedirs(OUT, exist_ok=True)


def clean(src, dst):
	a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255
	h, w = a.shape[:2]
	y, x = np.mgrid[0:h, 0:w]
	r = np.hypot((x - w / 2) / (w / 2), (y - h / 2) / (h / 2))
	fade = np.clip((0.98 - r) / 0.45, 0, 1) ** 1.5
	alpha = a[..., 3]
	# shadow: nearly black and not opaque
	shadow = (a[..., :3].max(axis=2) < 0.08) & (alpha < 0.97)
	a[..., 3] = np.where(shadow, alpha * fade * 0.75, alpha)
	Image.fromarray((a * 255).round().astype(np.uint8)).save(dst)


def webp(png, name):
	subprocess.run(['cwebp', '-quiet', '-q', '86', '-alpha_q', '92', '-resize', '480', '480', png, '-o', os.path.join(OUT, name + '.webp')], check=True)


loops = {os.path.basename(d) for d in glob.glob(os.path.join(SRC, 'frames', '*')) if glob.glob(os.path.join(d, '*.png'))}
for f in sorted(glob.glob(os.path.join(SRC, '*.png'))):
	name = os.path.basename(f)[:-4]
	if name in loops or (ONLY and name not in ONLY):
		continue
	with tempfile.NamedTemporaryFile(suffix='.png') as t:
		clean(f, t.name)
		webp(t.name, name)
for name in sorted(loops):
	if ONLY and name not in ONLY:
		continue
	with tempfile.TemporaryDirectory() as tmp:
		frames = sorted(glob.glob(os.path.join(SRC, 'frames', name, '*.png')))
		for k, f in enumerate(frames):
			clean(f, os.path.join(tmp, f'{k:04d}.png'))
		webp(os.path.join(tmp, '0000.png'), name)
		src = ['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '30', '-i', os.path.join(tmp, '%04d.png'), '-an']
		subprocess.run(src + ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '28', '-auto-alt-ref', '0', os.path.join(OUT, name + '.webm')], check=True)
		subprocess.run(src + ['-c:v', 'hevc_videotoolbox', '-allow_sw', '1', '-alpha_quality', '0.8', '-q:v', '62', '-vtag', 'hvc1', '-pix_fmt', 'bgra', os.path.join(OUT, name + '.mov')], check=True)
	print('loop', name, len(frames), 'frames')
print('done')
