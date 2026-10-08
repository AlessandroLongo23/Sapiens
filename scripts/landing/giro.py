# Renders the objects of the four high school subjects for the scrolling landing page:
# for each, the frames of half a turn about the vertical while the object does what it
# does on its card (the compass draws its circle, the cradle swings, the keys are typed,
# the flask gives off its bubbles). The page shows the frame that matches the scroll, and never a
# mix of two: the frames are many so that from one to the next little moves.
# Run: Blender -b --factory-startup -P scripts/landing/giro.py -- <out dir> [size] [frames] [id ...]
# Then: python3 scripts/landing/export-giro.py <out dir>
import bpy, math, sys, os
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ARGS = sys.argv[sys.argv.index('--') + 1:]
OUT = ARGS[0]
SIZE = int(ARGS[1]) if len(ARGS) > 1 else 800
FRAMES = int(ARGS[2]) if len(ARGS) > 2 else 144
ONLY = ARGS[3:]
TURN = 0.8  # radians either side of the pose of the card

# The builders are those of the subject cards: icons.py is read with nothing to render.
argv, sys.argv = sys.argv, ['', '--', OUT, 'none', '-']
mine = (OUT, SIZE, FRAMES, ONLY)
exec(open(os.path.join(HERE, '..', 'materie', 'icons.py')).read())
sys.argv, (OUT, SIZE, FRAMES, ONLY) = argv, mine

# For each object, the moment of its own loop shown at the fraction p of the scroll.
CAST = {
	'math': (compass, 'math', lambda p: 0.27 + 0.68 * ease(p)),  # the circle goes from nothing to whole
	'physics': (cradle, 'physics', lambda p: (0.25 + 2.0 * p) % 1.0),
	'chemistry': (flask, 'chemistry', lambda p: 0.98 * p),
	'computer-science': (keys, 'cs', lambda p: 0.02 + 0.96 * p),
}


def render(name):
	build, tone, moment = CAST[name]
	bpy.ops.wm.read_factory_settings(use_empty=True)
	sc = bpy.context.scene
	anim = build(TONES[tone])
	roots = [o for o in sc.objects if o.parent is None]
	holder = bpy.data.objects.new('giro', None)
	sc.collection.objects.link(holder)
	for o in roots:
		o.parent = holder

	def pose(frame):
		p = frame / (FRAMES - 1)
		anim(moment(p))
		holder.rotation_euler.z = TURN * (2 * p - 1)

	corners, ground = [], 0.0
	for f in range(0, FRAMES, 3):
		pose(f)
		corners += corners_now(sc)
	ground = min(c.z for c in corners)
	lo = Vector([min(c[i] for c in corners) for i in range(3)])
	hi = Vector([max(c[i] for c in corners) for i in range(3)])
	bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, ground - 0.001))
	bpy.context.object.is_shadow_catcher = True
	d = Vector((1.0, -1.35, 0.95)).normalized()
	q = d.to_track_quat('Z', 'Y')
	right, up = q @ Vector((1, 0, 0)), q @ Vector((0, 1, 0))
	xs, ys = [c.dot(right) for c in corners], [c.dot(up) for c in corners]
	centre = right * (min(xs) + max(xs)) / 2 + up * (min(ys) + max(ys)) / 2 + d * ((lo + hi) / 2).dot(d)
	cam = bpy.data.cameras.new('cam')
	cam.type, cam.ortho_scale = 'ORTHO', max(max(xs) - min(xs), max(ys) - min(ys)) * 1.2
	co = bpy.data.objects.new('cam', cam)
	co.location, co.rotation_euler = centre + d * 30, q.to_euler()
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
	sc.cycles.samples, sc.cycles.adaptive_threshold, sc.cycles.max_bounces = 24, 0.05, 4
	sc.render.resolution_x = sc.render.resolution_y = SIZE
	sc.render.use_persistent_data = True
	sc.frame_start, sc.frame_end = 0, FRAMES - 1
	bpy.app.handlers.frame_change_pre.clear()
	bpy.app.handlers.frame_change_pre.append(lambda scene, *_: pose(scene.frame_current))
	sc.render.filepath = os.path.join(OUT, name, '')
	bpy.ops.render.render(animation=True)
	bpy.app.handlers.frame_change_pre.clear()


for name in CAST:
	if ONLY and name not in ONLY:
		continue
	render(name)
	print('OK', name)
print('DONE')
