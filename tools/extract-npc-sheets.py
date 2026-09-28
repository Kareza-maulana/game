"""Extract user-authored transparent strips with sprite-gen's alpha segmentation.

Keep the authored frame pitch and pixel scale. Use one union crop per animation,
never resize or recenter individual poses. Sources in karakter/ stay untouched.
"""
import hashlib
import json
import math
from pathlib import Path
from PIL import Image, ImageChops
from sprite_gen.frames.segment import segment_boundaries, project_alpha
from sprite_gen.spec.runio import atomic_save_image

specs = [
    ('ki-jati', 'ki jati (1).png', 6, .14, 36),
    ('kilisuci', 'dewi kilisuci.png', 10, .12, 38),
    ('penjaga', 'penjaga gerbang (2) (1).png', 6, .14, 40),
]
manifest = {}
for name, filename, count, duration, height in specs:
    source = Path('karakter') / filename
    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    strip = Image.open(source).convert('RGBA')
    inner_cuts, detected = segment_boundaries(strip, count)
    assert inner_cuts and len(inner_cuts) == count - 1, (filename, inner_cuts, detected)
    cuts = [0, *inner_cuts, strip.width]
    profile = project_alpha(strip)
    assert all(profile[x] == 0 for x in cuts[1:-1]), 'A cut crosses visible artwork'
    width = math.ceil(strip.width / count)
    frames = []
    for index, (left, right) in enumerate(zip(cuts, cuts[1:])):
        frame = Image.new('RGBA', (width, strip.height))
        part = strip.crop((left, 0, right, strip.height))
        frame.alpha_composite(part, (left - round(index * strip.width / count), 0))
        assert sum(frame.getchannel('A').histogram()[1:]) == sum(part.getchannel('A').histogram()[1:]), 'Clipped visible pixels'
        assert frame.getbbox(), 'Empty frame'
        frames.append(frame)
    union = frames[0].getchannel('A')
    for frame in frames[1:]:
        union = ImageChops.lighter(union, frame.getchannel('A'))
    crop = union.getbbox()
    output = Path('assets/npc') / name
    output.mkdir(parents=True, exist_ok=True)
    files, records = [], []
    for index, frame in enumerate(frames):
        frame = frame.crop(crop)
        path = output / f'idle-{index+1:02}.png'
        atomic_save_image(frame, path)
        files.append(path.as_posix())
        records.append({'frame':index+1,'source_range':[cuts[index],cuts[index+1]],'bbox':list(frame.getbbox()),'visible_pixels':sum(frame.getchannel('A').histogram()[1:])})
    size = [crop[2]-crop[0], crop[3]-crop[1]]
    manifest[name] = {'source':source.as_posix(),'sha256':source_hash,'frames':files,'frameSeconds':duration,'size':size,'displayHeight':height,'sourceSize':list(strip.size),'unionCrop':list(crop),'segmentation':'sprite-gen alpha projection; zero-alpha boundaries','records':records}
    assert hashlib.sha256(source.read_bytes()).hexdigest() == source_hash
    print(name, count, 'frames;', size, '; no visible pixels clipped')
Path('assets/npc/manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
