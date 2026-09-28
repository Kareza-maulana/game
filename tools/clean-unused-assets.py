"""Audit and remove replaced/generated files only within this project.

Default is preview; --apply deletes the exact hashed list after validating the
current resource graph and the lossless replacements. User sprites are excluded.
"""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
project = json.loads((ROOT / 'cahaya-kadiri.json').read_text(encoding='utf-8'))
used = {(ROOT / r['file']).resolve() for r in project['resources']['resources'] if r.get('file')}
manifest = json.loads((ROOT / 'assets/optimized-manifest.json').read_text(encoding='utf-8'))
removed = []

def sha(data):
    return hashlib.sha256(data).hexdigest()

def candidate(path, reason):
    path = path.resolve()
    assert path.is_relative_to(ROOT / 'assets'), f'Outside asset directory: {path}'
    assert path not in used, f'Still used: {path}'
    if path.is_file():
        removed.append({'file': path.relative_to(ROOT).as_posix(), 'bytes': path.stat().st_size,
                        'sha256': sha(path.read_bytes()), 'reason': reason})

for logical, entry in manifest['images'].items():
    replacement = ROOT / entry['file']
    assert sha(replacement.read_bytes()) == entry['sha256'], f'Changed replacement: {replacement}'
    with Image.open(replacement) as image:
        assert list(image.size) == entry['size'] and sha(image.convert('RGBA').tobytes()) == entry['rgba_sha256']
    if logical.startswith('assets/'):
        source = ROOT / logical
        if source.exists():
            assert sha(source.read_bytes()) == entry['source_sha256'], f'Source changed: {source}'
            candidate(source, 'Replaced by verified pixel-identical lossless WebP')

for source in (ROOT / 'assets/art').glob('*.png.raw.png'):
    candidate(source, 'Intermediate generator output; final production asset retained')
for source in (ROOT / 'assets/art').glob('prop-*.png'):
    if source.name.endswith('.raw.png'):
        continue
    runtime = ROOT / 'assets/props-ready' / source.name
    logical = runtime.relative_to(ROOT).as_posix()
    entry = manifest['images'].get(logical)
    assert entry and (ROOT / entry['file']).resolve() in used, f'No active production version: {source}'
    candidate(source, 'Superseded high-resolution generated prop; existing runtime dimensions and pixels preserved')
for name in ['ki-jati.png', 'kilisuci.png', 'ki-jati-preview.png', 'petirtaan-preview.png']:
    candidate(ROOT / 'assets/art' / name, 'Obsolete generated NPC/preview; current characters and background retained')

assert all(p.exists() for p in used), 'Missing active resource'
assert len({r['file'] for r in removed}) == len(removed), 'Duplicate cleanup entry'
report = {'removedBytes': sum(r['bytes'] for r in removed), 'count': len(removed), 'files': removed,
          'preserved': ['All original files in karakter/', 'GDD, prompts and generation reports', 'All active resources and lossless verification hashes']}
if '--apply' in sys.argv:
    # Verify the complete plan before deleting anything; never follow symlinks.
    for row in removed:
        target = ROOT / row['file']
        assert target.resolve().is_relative_to(ROOT / 'assets') and not target.is_symlink()
        assert sha(target.read_bytes()) == row['sha256']
    for row in removed:
        (ROOT / row['file']).unlink()
    assert all(p.exists() for p in used)
    if removed:
        (ROOT / 'docs/asset-cleanup.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print('Deleted', len(removed), 'verified unused files;', report['removedBytes'], 'bytes; all active resources intact.')
else:
    (ROOT / 'test-results').mkdir(exist_ok=True)
    (ROOT / 'test-results/asset-cleanup-plan.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print('Preview:', len(removed), 'files;', report['removedBytes'], 'bytes. See test-results/asset-cleanup-plan.json')
