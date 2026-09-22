"""Use sprite-gen's native-alpha verification and trim, preserving generated raws.

Some GPT outputs already had native alpha despite the initial chroma request.
Reprocessing those with the canonical native route preserves the whole object.
This script owns no image cleanup algorithm; all cleanup lives in sprite-gen.
"""
import json
from pathlib import Path
from PIL import Image
from sprite_gen.gen.chroma import verify_native_alpha
from sprite_gen.gen import trim_to_alpha

for raw in Path('assets/art').glob('prop-*.png.raw.png'):
    out = raw.with_name(raw.name.removesuffix('.raw.png'))
    try:
        alpha = verify_native_alpha(raw, out)
        trim = trim_to_alpha(out)
        with Image.open(out) as image:
            histogram = image.getchannel('A').histogram()
            coverage = sum(histogram[8:]) / (image.width * image.height)
            if coverage < .12 or min(image.size) < 60:
                raise ValueError(f'incomplete silhouette: {coverage:.3f}, {image.size}')
        report = {'raw':str(raw),'out':str(out),'cleanup':'sprite-gen verify_native_alpha + trim_to_alpha','alpha':alpha,'trim':trim,'coverage':coverage}
        out.with_suffix('.verified.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        print('Verified', out.name, trim['after'], round(coverage,3))
    except (Exception, SystemExit) as error:
        print('REJECTED', raw.name, error)
