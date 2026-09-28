"""Lossless runtime image compression. Never resize, quantize, or edit source sprites.

Run after generating/replacing assets, then npm run build. PNGs are retained until
the separate, audited cleanup step. Requires Pillow with WebP support.
"""
import hashlib
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, features

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / 'assets/optimized-manifest.json'
assert features.check('webp'), 'Pillow requires WebP support'
project = json.loads((ROOT / 'cahaya-kadiri.json').read_text(encoding='utf-8'))
previous = json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else {'images': {}}
images = previous['images'].copy()
sources = {r['name'] for r in project['resources']['resources'] if r.get('kind') == 'image' and r['name'].endswith('.png')}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def convert(logical):
    source = ROOT / logical
    existing = images.get(logical)
    if not source.exists():
        assert existing and (ROOT / existing['file']).is_file(), f'Missing {logical}'
        return logical, existing
    source_bytes = source.read_bytes()
    if existing and existing['source_sha256'] == digest(source_bytes) and (ROOT / existing['file']).is_file():
        if digest((ROOT / existing['file']).read_bytes()) == existing['sha256']:
            return logical, existing
    # Keep every user-provided sprite untouched; generated copies live in assets.
    out = ROOT / ('assets/player-ready/' + logical.removeprefix('karakter/')) if logical.startswith('karakter/') else source
    out = out.with_suffix('.webp')
    assert out.is_relative_to(ROOT / 'assets') and not out.is_symlink()
    out.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        pixels = original.convert('RGBA')
        metadata = {}
        if original.info.get('icc_profile'):
            metadata['icc_profile'] = original.info['icc_profile']
        # PNG sRGB/default gamma maps to WebP's default sRGB. Unexpected color
        # metadata requires explicit handling rather than silently changing it.
        assert original.info.get('gamma', .45455) in (.45455, .4545), f'Unexpected gamma: {source}'
        pixels.save(out, 'WEBP', lossless=True, exact=True, quality=75, method=4, **metadata)
        with Image.open(out) as decoded:
            assert decoded.size == pixels.size and decoded.convert('RGBA').tobytes() == pixels.tobytes(), f'Pixel mismatch: {logical}'
            assert decoded.info.get('icc_profile') == original.info.get('icc_profile'), f'ICC mismatch: {logical}'
        entry = {'file': out.relative_to(ROOT).as_posix(), 'size': list(pixels.size),
                 'source_bytes': len(source_bytes), 'bytes': out.stat().st_size,
                 'source_sha256': digest(source_bytes), 'sha256': digest(out.read_bytes()),
                 'rgba_sha256': digest(pixels.tobytes()), 'pixel_identical': True}
        print(f'{logical}: {len(source_bytes):,} -> {out.stat().st_size:,} bytes; RGBA identical', flush=True)
        return logical, entry

with ThreadPoolExecutor(max_workers=4) as pool:
    for logical, entry in pool.map(convert, sorted(sources)):
        images[logical] = entry
MANIFEST.write_text(json.dumps({'format': 'WebP lossless, exact RGBA, original dimensions', 'images': images}, indent=2), encoding='utf-8')
npcs_path = ROOT / 'assets/npc/manifest.json'
npcs = json.loads(npcs_path.read_text(encoding='utf-8'))
for clip in npcs.values():
    clip['runtimeFrames'] = [images.get(frame, {}).get('file', frame) for frame in clip['frames']]
    clip['framePathsNote'] = 'frames are stable GDevelop resource IDs; runtimeFrames are files on disk'
npcs_path.write_text(json.dumps(npcs, indent=2), encoding='utf-8')
print('Verified:', len(images), 'images;', sum(v['source_bytes'] for v in images.values()), '->', sum(v['bytes'] for v in images.values()), 'bytes')
