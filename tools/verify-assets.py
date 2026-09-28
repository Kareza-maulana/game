"""Validate compressed pixels, source sprites, resource paths, and build budget."""
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
read = lambda file: json.loads((ROOT / file).read_text(encoding='utf-8'))
sha = lambda data: hashlib.sha256(data).hexdigest()
manifest = read('assets/optimized-manifest.json')['images']
for logical, entry in manifest.items():
    file = ROOT / entry['file']
    assert sha(file.read_bytes()) == entry['sha256'], f'Compressed file changed: {file}'
    with Image.open(file) as image:
        assert list(image.size) == entry['size'], f'Dimensions changed: {file}'
        assert sha(image.convert('RGBA').tobytes()) == entry['rgba_sha256'], f'Pixels changed: {file}'
    if logical.startswith('karakter/'):
        assert sha((ROOT / logical).read_bytes()) == entry['source_sha256'], f'User sprite changed: {logical}'
for clip in read('assets/npc/manifest.json').values():
    assert sha((ROOT / clip['source']).read_bytes()) == clip['sha256'], 'NPC sheet changed'
    for frame in clip.get('runtimeFrames', clip['frames']):
        assert (ROOT / frame).is_file(), f'Missing NPC frame: {frame}'
project = read('cahaya-kadiri.json')
for resource in project['resources']['resources']:
    if resource.get('file'):
        assert (ROOT / resource['file']).is_file(), f'Missing resource: {resource}'
files = [p for p in (ROOT / 'dist').rglob('*') if p.is_file()]
size = sum(p.stat().st_size for p in files)
assert size < 100_000_000, f'100 MB budget exceeded: {size}'
print(f'PASS: {len(manifest)} lossless RGBA hashes; original sprites intact; all resources exist; dist {size:,} bytes <100 MB.')
