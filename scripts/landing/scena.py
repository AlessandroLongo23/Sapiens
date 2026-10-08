# Renders the still life of the landing page: the objects of the four subjects of the
# high school and the pile of books of its level, standing together on the page. A film in two parts:
# the objects pop in one after the other (INTRO frames), then a loop (LOOP frames) in
# which each one moves as it does on its card. The loop starts and ends on the still.
# Run: Blender -b --factory-startup -P scripts/landing/scena.py -- <out dir> <still|frames|both> [width]
# Then: python3 scripts/landing/export-scena.py <out dir>
import bpy, math, sys, os
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = sys.argv[sys.argv.index('--') + 1:]
OUT, MODE = ARGS[0], ARGS[1]
WIDTH = int(ARGS[2]) if len(ARGS) > 2 else 1440
ASPECT = 2.0
INTRO, LOOP = 40, 120  # at 30 frames a second

# The builders are those of the subject cards: icons.py is read with nothing to render.
argv, sys.argv = sys.argv, ['', '--', OUT, 'none', '-']
mine = (OUT, MODE)
exec(open(os.path.join(HERE, '..', 'materie', 'icons.py')).read())
sys.argv, (OUT, MODE) = argv, mine

# Where each object stands, in the camera's own axes on the ground: across the picture
# and away from the eye, then its size. `when` is the part of the loop in which it moves (None: all of it,
# and through the intro too).
CAST = [
	('books', level_high, 'ink', -3.55, 0.9, 1.25, (0.22, 0.7)),
	('compass', compass, 'math', -0.95, -0.95, 1.15, (0.0, 0.62)),
	('cradle', cradle, 'physics', 1.95, 1.0, 1.1, None),
	('keys', keys, 'cs', 1.75, -2.35, 1.0, (0.5, 0.98)),
	('flask', flask, 'chemistry', 5.0, -0.2, 1.05, None),
]
EYE = Vector((1.0, -1.35, 0.95)).normalized()
ACROSS = Vector((1.35, 1.0, 0)).normalized()
AWAY = Vector((-1.0, 1.35, 0)).normalized()


def stage():
	bpy.ops.wm.read_factory_settings(use_empty=True)
	sc = bpy.context.scene
	actors = []
	for name, build, tone, across, away, size, when in CAST:
		before = set(sc.objects)
		anim = build(TONES[tone])
		roots = [o for o in set(sc.objects) - before if o.parent is None]
		holder = bpy.data.objects.new(name, None)
		sc.collection.objects.link(holder)
		for o in roots:
			o.parent = holder
		holder.location = ACROSS * across + AWAY * away
		actors.append((holder, anim, when, size))
	return sc, actors


def pose(actors, frame):
	"""Frame 0 is empty; at INTRO everything stands still; INTRO + LOOP is INTRO again."""
	u = ((frame - INTRO) / LOOP) % 1.0
	for i, (holder, anim, when, size) in enumerate(actors):
		anim(u if when is None else (seg(u, *when) if frame >= INTRO else 0.0) % 1.0)
		a = 0.03 + 0.105 * i
		s = spring(seg(frame / INTRO, a, a + 0.5), 5.5, 10.0) if frame < INTRO else 1.0
		s = max(s, 0.0005) * size
		holder.scale = (s, s, s)


sc, actors = stage()
corners = []
for f in range(INTRO, INTRO + LOOP, 6):
	pose(actors, f)
	corners += corners_now(sc)
pose(actors, INTRO)
bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, -0.001))
bpy.context.object.is_shadow_catcher = True

q = EYE.to_track_quat('Z', 'Y')
right, up = q @ Vector((1, 0, 0)), q @ Vector((0, 1, 0))
xs, ys = [c.dot(right) for c in corners], [c.dot(up) for c in corners]
lo = Vector([min(c[i] for c in corners) for i in range(3)])
hi = Vector([max(c[i] for c in corners) for i in range(3)])
centre = right * (min(xs) + max(xs)) / 2 + up * (min(ys) + max(ys)) / 2 + EYE * ((lo + hi) / 2).dot(EYE)
cam = bpy.data.cameras.new('cam')
# room around the objects for the overshoot of the pop and for the shadows
cam.type, cam.ortho_scale = 'ORTHO', max(max(xs) - min(xs), (max(ys) - min(ys)) * ASPECT) * 1.12
co = bpy.data.objects.new('cam', cam)
co.location, co.rotation_euler = centre + EYE * 40, q.to_euler()
sc.collection.objects.link(co)
sc.camera = co

sun((-0.42, -0.4, 1.0), 3.3, 34)
sun((1.0, -0.3, 0.35), 0.9, 70, (0.9, 0.94, 1.0))
sun((0.3, 1.0, 0.7), 1.6, 40)
w = bpy.data.worlds.new('w')
w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs[0].default_value, bg.inputs[1].default_value = (1, 1, 1, 1), 0.5
sc.world = w

sc.render.engine = 'CYCLES'
try:
	prefs = bpy.context.preferences.addons['cycles'].preferences
	prefs.compute_device_type = 'METAL'
	prefs.get_devices()
	for dev in prefs.devices:
		dev.use = True
	sc.cycles.device = 'CPU' if os.environ.get('CYCLES_CPU') else 'GPU'
except Exception as e:
	print('gpu unavailable', e)
sc.cycles.use_denoising = True
sc.render.film_transparent = True
sc.render.resolution_percentage = 100
sc.view_settings.view_transform = 'Standard'
try:
	sc.view_settings.look = 'Medium High Contrast'
except Exception:
	pass
sc.render.image_settings.file_format, sc.render.image_settings.color_mode = 'PNG', 'RGBA'

if MODE in ('still', 'both'):
	sc.cycles.samples = 128
	sc.render.resolution_x, sc.render.resolution_y = WIDTH * 2, round(WIDTH * 2 / ASPECT)
	sc.render.filepath = os.path.join(OUT, 'scena.png')
	bpy.ops.render.render(write_still=True)
if MODE in ('frames', 'both'):
	sc.cycles.samples, sc.cycles.adaptive_threshold, sc.cycles.max_bounces = 24, 0.05, 4
	sc.render.resolution_x, sc.render.resolution_y = WIDTH, round(WIDTH / ASPECT)
	sc.render.use_persistent_data = True
	sc.frame_start, sc.frame_end = 0, INTRO + LOOP - 1
	bpy.app.handlers.frame_change_pre.clear()
	bpy.app.handlers.frame_change_pre.append(lambda scene, *_: pose(actors, scene.frame_current))
	sc.render.filepath = os.path.join(OUT, 'frames', '')
	bpy.ops.render.render(animation=True)
	bpy.app.handlers.frame_change_pre.clear()
print('DONE')
