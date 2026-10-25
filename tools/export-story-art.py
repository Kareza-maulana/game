"""Prepare newly generated cinematic illustrations; existing game art is untouched."""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image
from sprite_gen.frames.extract import fit_to_cell
from sprite_gen.spec.runio import atomic_save_image

name, kind = sys.argv[1:]
source = Path('.tools/story-work') / (name + '.png')
destination = Path('assets/story') / (name + '.webp')
with Image.open(source) as image:
    image = image.convert('RGBA')
    size = (384, 512) if kind == 'portrait' else (1280, 720)
    scale = min(1, min(size[0] / image.width, size[1] / image.height))
    fit = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    fitted = fit_to_cell(image, *fit, 0, 0, {'resample':'nearest', 'align_x':'bbox-center', 'align_y':'bottom'})
    if kind == 'portrait':
        assert fitted.getchannel('A').getextrema()[0] == 0, 'Portrait requires real alpha'
    atomic_save_image(fitted, destination.with_suffix('.png'))
    fitted.save(destination, 'WEBP', lossless=True, exact=True, quality=80, method=4)
    with Image.open(destination) as decoded:
        assert decoded.convert('RGBA').tobytes() == fitted.tobytes(), 'WebP pixels differ'
    report = {'id':name,'kind':kind,'file':destination.as_posix(),'sourceSize':list(image.size),'size':list(fitted.size),
              'bytes':destination.stat().st_size,'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),
              'rgba_sha256':hashlib.sha256(fitted.tobytes()).hexdigest(),'lossless':True,'runtime_fit':'sprite-gen nearest fit_to_cell'}
destination.with_suffix('.verified.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
# Only delete fixed per-image intermediates after the compressed asset verifies.
for p in [source, source.with_name(source.name + '.raw.png'), destination.with_suffix('.png')]:
    resolved = p.resolve()
    assert resolved.is_relative_to(Path.cwd() / '.tools/story-work') or resolved.is_relative_to(Path.cwd() / 'assets/story')
    if p.is_file():
        p.unlink()
print(name, report['size'], report['bytes'], 'bytes; lossless runtime WebP verified')
