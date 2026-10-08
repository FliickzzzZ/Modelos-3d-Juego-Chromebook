"""Original deterministic CC0 vegetation meshes with alpha-cut foliage; no external assets."""
import random,math,json,struct,io
from pathlib import Path
from PIL import Image,ImageDraw
random.seed(47);out=Path('deadzone/assets')
# Leaf atlas: individual tapered leaves and veins, transparent outside silhouette.
im=Image.new('RGBA',(256,256));d=ImageDraw.Draw(im)
for row in range(4):
 for col in range(4):
  cx,cy=col*64+32,row*64+32
  points=[(cx,cy-29)]+[(cx+int(16*math.sin(t*math.pi/12)),cy-29+int(t*58/12)) for t in range(1,12)]+[(cx,cy+29)]+[(cx-int(16*math.sin(t*math.pi/12)),cy-29+int(t*58/12)) for t in range(11,0,-1)]
  color=(random.randrange(40,68),random.randrange(73,110),random.randrange(24,40),255);d.polygon(points,fill=color);d.line([(cx,cy-27),(cx,cy+27)],fill=(95,116,48,255),width=1)
  for yy in range(-20,24,7):
   d.line([(cx,cy+yy),(cx+12,cy+yy-8)],fill=(74,99,38,255));d.line([(cx,cy+yy),(cx-12,cy+yy-8)],fill=(74,99,38,255))
b=io.BytesIO();im.save(b,'PNG');leaf=b.getvalue();(out/'foliage.png').write_bytes(leaf)
def make(kind):
 verts=[[],[]];norms=[[],[]];uvs=[[],[]];idx=[[],[]]
 def quad(mi,p,n,uv):
  start=len(verts[mi])//3
  for v in p:verts[mi].extend(v);norms[mi].extend(n)
  for u in uv:uvs[mi].extend(u)
  idx[mi].extend([start,start+1,start+2,start,start+2,start+3])
 def branch(a,b,r1,r2):
  # Cylinders with irregular six-sided taper. Basis in horizontal plane suitable for trunk/branches.
  for i in range(6):
   t=i*math.tau/6;u=(i+1)*math.tau/6
   p=[(a[0]+r1*math.cos(t),a[1],a[2]+r1*math.sin(t)),(a[0]+r1*math.cos(u),a[1],a[2]+r1*math.sin(u)),(b[0]+r2*math.cos(u),b[1],b[2]+r2*math.sin(u)),(b[0]+r2*math.cos(t),b[1],b[2]+r2*math.sin(t))]
   quad(0,p,(math.cos(t),.1,math.sin(t)),[(0,0),(1,0),(1,1),(0,1)])
 def leaves(center,count,spread,size):
  for i in range(count):
   a=random.random()*math.tau;rad=spread*random.random()**.5;cx=center[0]+math.cos(a)*rad;cz=center[2]+math.sin(a)*rad;cy=center[1]+random.uniform(-spread*.5,spread*.5);w=size*random.uniform(.6,1.2);h=w*1.7
   turn=random.random()*math.tau;dx=math.cos(turn)*w/2;dz=math.sin(turn)*w/2
   cell=random.randrange(16);u=(cell%4)/4;v=(cell//4)/4
   quad(1,[(cx-dx,cy-h/2,cz-dz),(cx+dx,cy-h/2,cz+dz),(cx+dx,cy+h/2,cz+dz),(cx-dx,cy+h/2,cz-dz)],(-math.sin(turn),.35,math.cos(turn)),[(u,v),(u+.25,v),(u+.25,v+.25),(u,v+.25)])
 if kind=='tree':
  branch((0,0,0),(.2,5.7,.1),.28,.055)
  for i in range(11):
   a=i*2.4;y=2.6+i*.23;end=(math.cos(a)*2.2,y+1.7,math.sin(a)*2.2);branch((.1,y,0),end,.085,.012);leaves(end,95,1.15,.35)
  leaves((0,6.3,0),110,1.5,.4)
 elif kind=='shrub':
  for i in range(9):
   a=i*2.4;end=(math.cos(a)*.65,.7+random.random()*.5,math.sin(a)*.65);branch((0,0,0),end,.025,.006);leaves(end,25,.45,.19)
 else:
  for i in range(25):
   a=random.random()*math.tau;x=random.uniform(-.28,.28);z=random.uniform(-.28,.28);h=random.uniform(.22,.64);w=.025;dx=math.cos(a)*w;dz=math.sin(a)*w
   quad(0,[(x-dx,0,z-dz),(x+dx,0,z+dz),(x+dx+.08,h,z+dz+.05),(x-dx+.08,h,z-dz+.05)],(-math.sin(a),.1,math.cos(a)),[(0,0),(1,0),(1,1),(0,1)])
 binary=bytearray();views=[];acc=[]
 def append(data):
  binary.extend(b'\0'*((-len(binary))%4));pos=len(binary);binary.extend(data);views.append({'buffer':0,'byteOffset':pos,'byteLength':len(data)});return len(views)-1
 def accessor(values,type_,components,ctype):
  view=append(struct.pack('<'+('f' if ctype==5126 else 'I')*len(values),*values));a={'bufferView':view,'componentType':ctype,'count':len(values)//components,'type':type_}
  if type_=='VEC3':a['min']=[min(values[j::3]) for j in range(3)];a['max']=[max(values[j::3]) for j in range(3)]
  acc.append(a);return len(acc)-1
 primitives=[]
 for mi in range(2):
  if not verts[mi]:continue
  primitives.append({'attributes':{'POSITION':accessor(verts[mi],'VEC3',3,5126),'NORMAL':accessor(norms[mi],'VEC3',3,5126),'TEXCOORD_0':accessor(uvs[mi],'VEC2',2,5126)},'indices':accessor(idx[mi],'SCALAR',1,5125),'material':mi})
 image=append(leaf)
 doc={'asset':{'version':'2.0','generator':'DEAD ZONE original botanical mesh CC0'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'mesh':0}],'meshes':[{'primitives':primitives}],'bufferViews':views,'accessors':acc,'buffers':[{'byteLength':len(binary)}],'images':[{'bufferView':image,'mimeType':'image/png'}],'textures':[{'source':0}],'materials':[{'name':'bark' if kind!='grass' else 'grass','doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[.17,.135,.09,1] if kind!='grass' else [.22,.31,.1,1],'metallicFactor':0,'roughnessFactor':1}},{'name':'leaves','doubleSided':True,'alphaMode':'MASK','alphaCutoff':.45,'pbrMetallicRoughness':{'baseColorTexture':{'index':0},'metallicFactor':0,'roughnessFactor':.95}}]}
 j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4);binary+=b'\0'*((-len(binary))%4);data=struct.pack('<III',0x46546c67,2,28+len(j)+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary;(out/(kind+'.glb')).write_bytes(data);print(kind,len(data))
for k in ['tree','shrub','grass']:make(k)
