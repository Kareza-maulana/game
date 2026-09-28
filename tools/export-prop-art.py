"""Export compact runtime cutouts using sprite-gen's canonical fit function.

After size cleanup, existing runtime WebP files are the production masters.
Only newly generated high-resolution PNGs need the fitting step.
"""
import json
from pathlib import Path
from PIL import Image
from sprite_gen.frames.extract import fit_to_cell
from sprite_gen.spec.runio import atomic_save_image

destination = Path('assets/props-ready')
destination.mkdir(exist_ok=True)
report = []
for verified in sorted(Path('assets/art').glob('prop-*.verified.json')):
    source = verified.with_name(verified.name.replace('.verified.json', '.png'))
    out = destination / source.name
    if not source.exists():
        assert out.with_suffix('.webp').is_file() or out.is_file(), f'Missing runtime prop: {out}'
        continue
    with Image.open(source) as image:
        scale = min(1, 512 / max(image.size))
        size = [max(1, round(n * scale)) for n in image.size]
        fitted = fit_to_cell(image.convert('RGBA'), *size, 0, 0,
                             {'resample':'nearest', 'align_x':'bbox-center', 'align_y':'bottom'})
        atomic_save_image(fitted, out)
        report.append({'source':str(source), 'out':str(out), 'source_size':list(image.size),
                       'size':size, 'source_bytes':source.stat().st_size, 'bytes':out.stat().st_size})
if report:
    Path('assets/props-ready/export-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(len(report), 'runtime cutouts;', sum(r['source_bytes'] for r in report), '->', sum(r['bytes'] for r in report), 'bytes')
