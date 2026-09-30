"""
Compresses a lab scene for the web, after Blender has written it (build_banco.py):

    python3 scripts/lab/compress.py public/lab/esperimento.glb

- the textures inside go to WebP (gltf-transform webp, quality 90);
- the geometry is compressed with meshopt (gltf-transform meshopt): positions and normals become 16-bit integers,
  which the page's GLTFLoader decodes (scene.ts registers the decoder);
- the two lightmaps next to it (<name>-luce.png, <name>-esterno.png) go to WebP (cwebp, quality 92, no visible
  banding at 8 bits) and the `Lighting` node's extras are pointed at them.

It needs npx (it runs @gltf-transform/cli without adding it to the project) and cwebp (brew install webp). The
playground (/laboratorio/mani) loads banco.glb and the avatar with its own loader, without the meshopt decoder: those
two stay uncompressed.
"""
import json, os, struct, subprocess, sys, tempfile


def patch_extras(path):
    """Rewrites the lightmap names in the extras from .png to .webp; returns the names."""
    d = open(path, 'rb').read()
    magic, version, _ = struct.unpack('<III', d[:12])
    assert magic == 0x46546C67, 'not a GLB'
    jl, jt = struct.unpack('<II', d[12:20])
    j = json.loads(d[20:20 + jl])
    names = []
    for node in j.get('nodes', []):
        ex = node.get('extras', {})
        for key in ('lightmap', 'lightmap_ext'):
            if isinstance(ex.get(key), str) and ex[key].endswith('.png'):
                names.append(ex[key])
                ex[key] = ex[key][:-4] + '.webp'
    js = json.dumps(j, separators=(',', ':')).encode()
    js += b' ' * ((4 - len(js) % 4) % 4)
    rest = d[20 + jl:]
    out = struct.pack('<III', magic, version, 12 + 8 + len(js) + len(rest)) + struct.pack('<II', len(js), jt) + js + rest
    open(path, 'wb').write(out)
    return names


def run(*cmd):
    print('$', ' '.join(cmd))
    subprocess.run(cmd, check=True)


def main():
    src = os.path.abspath(sys.argv[1])
    here = os.path.dirname(src)
    tmp = tempfile.mkdtemp(prefix='lab-compress-')
    a, b = os.path.join(tmp, 'a.glb'), os.path.join(tmp, 'b.glb')
    subprocess.run(['cp', src, a], check=True)
    names = patch_extras(a)
    # textures first: re-encoding them after meshopt would decode the geometry again
    run('npx', '-y', '@gltf-transform/cli@4', 'webp', a, b, '--quality', '90')
    run('npx', '-y', '@gltf-transform/cli@4', 'meshopt', b, src, '--level', 'medium')
    for n in names:
        png = os.path.join(here, n)
        if os.path.exists(png):
            run('cwebp', '-quiet', '-q', '92', '-m', '6', png, '-o', png[:-4] + '.webp')
    print('COMPRESSED', src, os.path.getsize(src), [n[:-4] + '.webp' for n in names])


if __name__ == '__main__':
    main()
