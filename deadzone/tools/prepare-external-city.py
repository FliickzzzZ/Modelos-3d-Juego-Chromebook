"""Reuse cached source; publish small glTF descriptors + shared 512px maps, never inline binary data."""
from pathlib import Path
import json,urllib.parse,io
from PIL import Image
cache=Path('/tmp/dz-city');out=Path('deadzone/assets')
base='https://raw.githubusercontent.com/FliickzzzZ/Modelos-3d-Juego-Chromebook/a3b78f98c0684087175058e2cd899880dc7fcef3/Ciudad/Exports/glTF%20%28Godot%29/'
for name in ['Building_Small_1','Building_Medium_2_001']:
 doc=json.loads((cache/(name+'.gltf')).read_text())
 for b in doc['buffers']:b['uri']=base+urllib.parse.quote(b['uri'])
 for image in doc['images']:
  filename=image['uri'];img=Image.open(cache/filename);img.thumbnail((512,512));img.save(out/filename,optimize=True)
 (out/(name+'.gltf')).write_text(json.dumps(doc,separators=(',',':')))
print('External descriptions and shared maps ready. Source binaries referenced by verified original URLs.')
