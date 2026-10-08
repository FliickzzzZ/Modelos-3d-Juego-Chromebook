"""Package two existing CC0 MegaKit buildings, resizing textures before runtime."""
import urllib.request,urllib.parse,json,struct,io,concurrent.futures
from pathlib import Path
from PIL import Image
src='https://raw.githubusercontent.com/FliickzzzZ/Modelos-3d-Juego-Chromebook/a3b78f98c0684087175058e2cd899880dc7fcef3/'
folder='Ciudad/Exports/glTF (Godot)/'
cache=Path('/tmp/dz-city');cache.mkdir(exist_ok=True)
out=Path('deadzone/assets');out.mkdir(exist_ok=True)
def fetch(path):
 p=cache/Path(path).name
 if not p.exists():p.write_bytes(urllib.request.urlopen(src+urllib.parse.quote(path,safe='/'),timeout=90).read())
 return p.read_bytes()
def png(name):
 im=Image.open(io.BytesIO(fetch(folder+name)));im.thumbnail((512,512));b=io.BytesIO();im.save(b,'PNG',optimize=True);return b.getvalue()
def glb(name):
 doc=json.loads(fetch(folder+name+'.gltf'))
 resources=[folder+b['uri'] for b in doc.get('buffers',[])]+[folder+i['uri'] for i in doc.get('images',[])]
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(fetch,resources))
 binary=bytearray();offsets=[]
 def append(b):
  while len(binary)%4:binary.append(0)
  pos=len(binary);binary.extend(b);return pos
 for b in doc['buffers']:offsets.append(append(fetch(folder+b['uri'])))
 for v in doc['bufferViews']:v['byteOffset']=v.get('byteOffset',0)+offsets[v['buffer']];v['buffer']=0
 for i in doc.get('images',[]):
  data=png(i.pop('uri'));pos=append(data);i['mimeType']='image/png';i['bufferView']=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':pos,'byteLength':len(data)})
 doc['buffers']=[{'byteLength':len(binary)}]
 j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary+=b'\0'*((-len(binary))%4)
 data=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
 (out/(name+'.glb')).write_bytes(data)
 print(name,len(data),len(doc['images']),'textures',flush=True)
for n in ['Building_Small_1','Building_Medium_2_001']:glb(n)
for n in ['T_Concrete_Asphalt_BaseColor.png','T_Concrete_BaseColor.png','T_Concrete_Normal.png','T_Concrete_ORM.png','T_Dirt_BaseColor.png','T_Dirt_Normal.png','T_Dirt_ORM.png']:
 (out/n).write_bytes(png(n));print(n,flush=True)
