
(async () => {
"use strict";
const T = await import("https://esm.sh/three@0.160.1");
const { GLTFLoader } = await import("https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?deps=three@0.160.1");
const { clone: cloneSkinned } = await import("https://esm.sh/three@0.160.1/examples/jsm/utils/SkeletonUtils.js?deps=three@0.160.1");
const $ = id => document.getElementById(id);
const root = $("game");
if (!root) throw Error("Falta #game en el HTML");
const scene = new T.Scene();
const world = new T.Group(); scene.add(world);
const player = new T.Group(); scene.add(player);
const playerState = {position: player.position, mode: "explore", moving: false};
scene.background = new T.Color(0x25323b);
scene.fog = new T.FogExp2(0x25323b, .012);
const camera = new T.PerspectiveCamera(
  78,
  Math.max(1, root.clientWidth) / Math.max(1, root.clientHeight),
  .05,
  200
);
camera.position.set(0, 1.7, 0);
const renderer = new T.WebGLRenderer({
  antialias: false,
  powerPreference: "low-power"
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1));
renderer.setSize(
  Math.max(1, root.clientWidth),
  Math.max(1, root.clientHeight)
);
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
root.prepend(renderer.domElement);
scene.add(camera);
scene.add(new T.HemisphereLight(0xc0d4e5, 0x343434, 2.6));
const sun = new T.DirectionalLight(0xffd2a4, 2);
sun.position.set(-35, 60, -20);
scene.add(sun);
const mat = (c, metal = 0) =>
  new T.MeshStandardMaterial({
    color: c,
    roughness: .85,
    metalness: metal
  });
const geo = new T.BoxGeometry(1, 1, 1);
const m = {
  road: mat(0x2a2c30),
  ground: mat(0x52534f),
  walk: mat(0x787774),
  line: mat(0xcac3aa),
  glass: mat(0x17242b),
  dark: mat(0x202326),
  skin: mat(0x747e61),
  cloth: mat(0x50565a)
};
function box(parent, x, y, z, w, h, d, material) {
  const a = new T.Mesh(geo, material);
  a.position.set(x, y, z);
  a.scale.set(w, h, d);
  parent.add(a);
  return a;
}
const solids = [];
const addSolid = (x, z, w, d, h = 3) =>
  solids.push({ x, z, w, d, h });
function blocked(x, z, radius = .38) {
  return (
    Math.abs(x) > 88 - radius ||
    Math.abs(z) > 88 - radius ||
    solids.some(o =>
      Math.abs(x - o.x) < o.w / 2 + radius &&
      Math.abs(z - o.z) < o.d / 2 + radius
    )
  );
}
function clearLine(ax, az, bx, bz, radius = .48) {
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(dist / .6));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = ax + (bx - ax) * t;
    const z = az + (bz - az) * t;
    if (blocked(x, z, radius)) return false;
  }
  return true;
}
box(world, 0, -.18, 0, 190, .36, 190, m.ground);
for (let i = -2; i <= 2; i++) {
  const p = i * 30;
  box(world, p, .02, 0, 11, .05, 190, m.road);
  box(world, 0, .025, p, 190, .05, 11, m.road);
  for (let j = -85; j < 85; j += 9) {
    box(world, p, .058, j, .13, .01, 3, m.line);
    box(world, j, .058, p, 3, .01, .13, m.line);
  }
}
const walls = [
  0x62615f,
  0x575c5e,
  0x716962,
  0x4c565b
].map(c => mat(c));
const cityPanels = [];
function room(g,x,z,w,d) {
  function wall(lx,lz,ww,dd) {
    const mesh=box(g,lx,1.8,lz,ww,3.2,dd,walls[0]);
    cityPanels.push({g,mesh,lx,lz,ww,dd}); addSolid(x+lx,z+lz,ww,dd,3.4);
  }
  wall(0,-d/2,w,.25); wall(0,d/2,w,.25); wall(w/2,0,.25,d);
  wall(-w/2,-2.35,.25,2.5); wall(-w/2,2.35,.25,2.5);
  box(g,-w/2,3,0,.25,.8,2.2,m.dark);
  box(g,0,3.55,0,w+.2,.25,d+.2,m.dark);
  box(g,1,.65,1,2,.7,.8,m.cloth); addSolid(x+1,z+1,2,.8,1);
  box(g,-1,.7,-1,1.2,.85,.65,m.dark); addSolid(x-1,z-1,1.2,.65,1.2);
  const lamp = new T.PointLight(0xffbf75,2.5,9); lamp.position.set(0,2.6,0);g.add(lamp);
}
function groundHeight(x,z) {
  for(let ix=-2;ix<2;ix++) for(let iz=-2;iz<2;iz++)
    if(Math.abs(x-(ix*30+15))<9.5 && Math.abs(z-(iz*30+15))<9.5) return .26;
  return .06;
}
function building(x, z, w, d, h) {
  const g = new T.Group();
  g.position.set(x, 0, z);
  world.add(g);g.userData.building=true;g.userData.height=h;
  if (Math.abs(x - 10.1) < .01 && Math.abs(z - 10.1) < .01) {
    g.userData.building=false;room(g, x, z, w, d); return;
  }
  box(
    g, 0, h / 2, 0, w, h, d,
    walls[Math.floor(Math.random() * walls.length)]
  );
  box(g, 0, h + .12, 0, w + .4, .24, d + .4, m.dark);
  for (let y = 2; y < h - 1; y += 3) {
    for (let a = -w / 2 + 1.3; a < w / 2 - .4; a += 2.5) {
      box(g, a, y, d / 2 + .03, 1.1, 1.45, .05, m.glass);
      box(g, a, y, -d / 2 - .03, 1.1, 1.45, .05, m.glass);
    }
  }
  addSolid(x, z, w, d, h);
}
for (let x = -2; x < 2; x++) {
  for (let z = -2; z < 2; z++) {
    const cx = x * 30 + 15;
    const cz = z * 30 + 15;
    box(world, cx, .13, cz, 19, .26, 19, m.walk);
    for (const a of [-1, 1]) {
      for (const b of [-1, 1]) {
        building(
          cx + a * 4.9,
          cz + b * 4.9,
          7.2,
          7.2,
          9 + Math.floor(Math.random() * 13)
        );
      }
    }
  }
}
const cars = [];
function car(x, z, rot) {
  const g = new T.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  world.add(g);
  const low = new T.Group();
  g.add(low);
  const paint = mat(
    [0x72312c, 0x4c5868, 0x5d625e][
      Math.floor(Math.random() * 3)
    ]
  );
  box(low, 0, .62, 0, 1.85, .6, 3.8, paint);
  box(low, 0, 1.16, -.15, 1.6, .6, 2, paint);
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      const wheel = new T.Mesh(
        new T.CylinderGeometry(.36, .36, .19, 10),
        m.dark
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(a * .98, .36, b * 1.25);
      low.add(wheel);
    }
  }
  cars.push({ g, low });
  addSolid(x, z, 4.3, 4.3);
}
for (let i = 0; i < 15; i++) {
  const x = [-60, -30, 0, 30, 60][i % 5];
  const z = -70 + Math.floor(i / 5) * 55 + Math.random() * 8;
  if (Math.hypot(x, z) > 12) {
    car(x, z, i % 2 ? 0 : Math.PI / 2);
  }
}
const NAV_STEP = 2;
const NAV_MIN = -86;
const NAV_MAX = 86;
const NAV_SIZE = Math.round((NAV_MAX - NAV_MIN) / NAV_STEP) + 1;
const NAV_RADIUS = .48;
const navGrid = new Uint8Array(NAV_SIZE * NAV_SIZE);
function navIndex(ix, iz) {
  return iz * NAV_SIZE + ix;
}
function navInside(ix, iz) {
  return ix >= 0 && iz >= 0 &&
         ix < NAV_SIZE && iz < NAV_SIZE;
}
function navWorld(ix, iz) {
  return {
    x: NAV_MIN + ix * NAV_STEP,
    z: NAV_MIN + iz * NAV_STEP
  };
}
function navCell(x, z) {
  return {
    ix: Math.round((x - NAV_MIN) / NAV_STEP),
    iz: Math.round((z - NAV_MIN) / NAV_STEP)
  };
}
function buildNavigation() {
  let walkable = 0;
  for (let iz = 0; iz < NAV_SIZE; iz++) {
    for (let ix = 0; ix < NAV_SIZE; ix++) {
      const p = navWorld(ix, iz);
      const free = !blocked(p.x, p.z, NAV_RADIUS);
      navGrid[navIndex(ix, iz)] = free ? 1 : 0;
      if (free) walkable++;
    }
  }
  console.log("Navegación lista:", walkable, "casillas");
}
buildNavigation();
function navFree(ix, iz) {
  return navInside(ix, iz) &&
         navGrid[navIndex(ix, iz)] === 1;
}
function nearestCell(x, z) {
  const c = navCell(x, z);
  if (navFree(c.ix, c.iz)) return c;
  let best = null;
  let bestDist = Infinity;
  for (let r = 1; r <= 7; r++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        const ix = c.ix + dx;
        const iz = c.iz + dz;
        if (!navFree(ix, iz)) continue;
        const p = navWorld(ix, iz);
        const d = Math.hypot(p.x - x, p.z - z);
        if (d < bestDist) {
          bestDist = d;
          best = { ix, iz };
        }
      }
    }
    if (best) return best;
  }
  return null;
}
class MinHeap {
  constructor() {
    this.a = [];
  }
  push(item) {
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= item.f) break;
      a[i] = a[p];
      i = p;
    }
    a[i] = item;
  }
  pop() {
    const a = this.a;
    if (!a.length) return null;
    const first = a[0];
    const last = a.pop();
    if (!a.length) return first;
    let i = 0;
    while (true) {
      const l = i * 2 + 1;
      const r = l + 1;
      if (l >= a.length) break;
      let child = l;
      if (r < a.length && a[r].f < a[l].f) {
        child = r;
      }
      if (a[child].f >= last.f) break;
      a[i] = a[child];
      i = child;
    }
    a[i] = last;
    return first;
  }
  get length() {
    return this.a.length;
  }
}
function findPath(sx, sz, tx, tz) {
  const start = nearestCell(sx, sz);
  const goal = nearestCell(tx, tz);
  if (!start || !goal) return null;
  const startId = navIndex(start.ix, start.iz);
  const goalId = navIndex(goal.ix, goal.iz);
  if (startId === goalId) {
    return clearLine(sx,sz,tx,tz,NAV_RADIUS) ? [{x:tx,z:tz}] : null;
  }
  const count = NAV_SIZE * NAV_SIZE;
  const gScore = new Float32Array(count);
  const parent = new Int32Array(count);
  const closed = new Uint8Array(count);
  gScore.fill(Infinity);
  parent.fill(-1);
  const heap = new MinHeap();
  gScore[startId] = 0;
  const heuristic = (ix, iz) =>
    Math.abs(ix - goal.ix) +
    Math.abs(iz - goal.iz);
  heap.push({
    id: startId,
    ix: start.ix,
    iz: start.iz,
    g: 0,
    f: heuristic(start.ix, start.iz)
  });
  const directions = [
    [1, 0], [-1, 0],
    [0, 1], [0, -1]
  ];
  let iterations = 0;
  let found = false;
  while (heap.length && iterations < 4500) {
    iterations++;
    const node = heap.pop();
    if (closed[node.id]) continue;
    if (node.g > gScore[node.id]) continue;
    closed[node.id] = 1;
    if (node.id === goalId) {
      found = true;
      break;
    }
    for (const [dx, dz] of directions) {
      const nx = node.ix + dx;
      const nz = node.iz + dz;
      if (!navFree(nx, nz)) continue;
      const nextId = navIndex(nx, nz);
      if (closed[nextId]) continue;
      const a = navWorld(node.ix, node.iz);
      const b = navWorld(nx, nz);
      if (!clearLine(a.x, a.z, b.x, b.z, NAV_RADIUS)) {
        continue;
      }
      const nextG = gScore[node.id] + 1;
      if (nextG >= gScore[nextId]) continue;
      gScore[nextId] = nextG;
      parent[nextId] = node.id;
      heap.push({
        id: nextId,
        ix: nx,
        iz: nz,
        g: nextG,
        f: nextG + heuristic(nx, nz)
      });
    }
  }
  if (!found) return null;
  const result = [];
  let id = goalId;
  while (id !== startId && id >= 0) {
    const ix = id % NAV_SIZE;
    const iz = Math.floor(id / NAV_SIZE);
    result.push(navWorld(ix, iz));
    id = parent[id];
    if (result.length > count) return null;
  }
  result.reverse();
  const smooth = [];
  let px = sx;
  let pz = sz;
  let i = 0;
  while (i < result.length) {
    let furthest = i;
    for (let j = i + 1; j < result.length; j++) {
      if (clearLine(
        px, pz,
        result[j].x, result[j].z,
        NAV_RADIUS
      )) {
        furthest = j;
      } else {
        break;
      }
    }
    const point = result[furthest];
    smooth.push(point);
    px = point.x;
    pz = point.z;
    i = furthest + 1;
  }
  return smooth;
}
function safeSpawn() {
  const px = player.position.x;
  const pz = player.position.z;
  for (let i = 0; i < 100; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 13 + Math.random() * 10;
    const x = px + Math.sin(a) * d;
    const z = pz + Math.cos(a) * d;
    if (blocked(x, z, .65)) continue;
    if (zombies.some(other =>
      Math.hypot(
        other.actor.position.x - x,
        other.actor.position.z - z
      ) < 1.5
    )) continue;
    if (clearLine(x, z, px, pz, .48)) {
      return { x, z };
    }
    const path = findPath(x, z, px, pz);
    if (path) return { x, z };
  }
  const cell = nearestCell(px + 12, pz + 12);
  if (cell) {
    const p = navWorld(cell.ix, cell.iz);
    if (!blocked(p.x, p.z, .65)) {
      return p;
    }
  }
  return null;
}
const BASE =
  "https://cdn.jsdelivr.net/gh/FliickzzzZ/Modelos-3d-Juego-Chromebook@main/";
const gltf = new GLTFLoader();
const url = p =>
  BASE + p.split("/").map(encodeURIComponent).join("/");
const load = p =>
  new Promise((ok, no) =>
    gltf.load(url(p), ok, undefined, no)
  );
const assets = {
  zombies: [],
  gun: null,
  car: null
};
function copy(asset) {
  return cloneSkinned(asset.scene);
}
function fit(source,height,maxW,maxD) {
  const wrap=new T.Group(), offset=new T.Group();wrap.add(offset);offset.add(source);
  source.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(source), size=bounds.getSize(new T.Vector3());
  if(!Number.isFinite(size.y)||size.y<1e-5) throw Error("Dimensiones GLB inválidas");
  let scale=height/size.y;
  if(maxW&&size.x) scale=Math.min(scale,maxW/size.x);
  if(maxD&&size.z) scale=Math.min(scale,maxD/size.z);
  wrap.scale.setScalar(scale);
  const center=bounds.getCenter(new T.Vector3());
  offset.position.set(-center.x,-bounds.min.y,-center.z);
  wrap.updateMatrixWorld(true);return wrap;
}
function inPlaceClips(asset) {
  return (asset.animations||[]).map(clip=>new T.AnimationClip(clip.name,clip.duration,clip.tracks.map(track=>{
    const next=track.clone(); const target=next.name.replace(/\.(position|quaternion|scale)$/,'');
    if(/\.position$/.test(next.name)&&/hips|pelvis|root|armature/i.test(target)) {
      for(let i=0;i<next.values.length;i+=3) {next.values[i]=next.values[0];next.values[i+2]=next.values[2];}
    }
    return next;
  })));
}
const audio={};let ctx=null,volume=.6,ambience=null;
const activeSounds=new Set(), buffers=new Map();
function wakeAudio() {ctx??=new(window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});startAmbience();}
function stopSounds(owner) {
  for(const item of [...activeSounds]) if(!owner||item.owner===owner) {
    try{item.source.stop();}catch{} item.source.disconnect();item.gain.disconnect();item.panner?.disconnect();activeSounds.delete(item);
  }
}
function tone(type) {
  if(!ctx||ctx.state!=="running"||type==="zombie")return;
  const cfg={shot:[190,48,.12],reload:[560,180,.12],hurt:[140,60,.2],death:[130,40,.25],wave:[420,700,.25],step:[85,45,.055]}[type];
  if(!cfg)return;const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
  o.type=type==="wave"?"triangle":"sawtooth";o.frequency.setValueAtTime(cfg[0],t);o.frequency.exponentialRampToValueAtTime(cfg[1],t+cfg[2]);
  g.gain.setValueAtTime(.04*volume,t);g.gain.exponentialRampToValueAtTime(.001,t+cfg[2]);o.connect(g);g.connect(ctx.destination);
  const item={source:o,gain:g,type};activeSounds.add(item);o.onended=()=>{activeSounds.delete(item);o.disconnect();g.disconnect();};o.start();o.stop(t+cfg[2]);
}
async function sound(type,owner=null) {
  if(!ctx||ctx.state!=="running"||paused)return;
  if(type==="zombie"&&([...activeSounds].filter(s=>s.type==="zombie").length>=2||[...activeSounds].some(s=>s.owner===owner)))return;
  const files=audio[type];if(!files?.length){tone(type);return;}
  const epoch=session, file=files[Math.floor(Math.random()*files.length)];
  try {
    if(!buffers.has(file)) buffers.set(file,fetch(file).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();}).then(b=>ctx.decodeAudioData(b)));
    const buffer=await buffers.get(file);
    if(epoch!==session||paused||(owner&&!zombies.includes(owner))||(!alive&&type!=="death"))return;
    if(type==="zombie"&&[...activeSounds].filter(s=>s.type==="zombie").length>=2)return;
    const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;
    const base={zombie:.1,zombieDeath:.12,shot:.65,reload:.45,hurt:.5,step:.18}[type]??.45;
    gain.gain.value=volume*base;source.connect(gain);let panner=null;
    if(owner){panner=ctx.createPanner();panner.panningModel="equalpower";panner.distanceModel="inverse";panner.refDistance=2;panner.maxDistance=20;panner.rolloffFactor=1.8;gain.connect(panner);panner.connect(ctx.destination);}else gain.connect(ctx.destination);
    const item={source,gain,panner,owner,type,base};activeSounds.add(item);
    source.onended=()=>{activeSounds.delete(item);source.disconnect();gain.disconnect();panner?.disconnect();};
    if(panner)setSoundPosition(item);source.start();source.stop(ctx.currentTime+Math.min(buffer.duration,type==="zombie"?2.5:type==="shot"?.4:5));
  }catch(e){buffers.delete(file);if(epoch===session&&!paused&&alive)tone(type);}
}
function setSoundPosition(item) {
  const p=item.owner.actor.position;item.panner.positionX.value=p.x;item.panner.positionY.value=p.y+1.3;item.panner.positionZ.value=p.z;
}
function updateAudio() {
  if(!ctx)return;const l=ctx.listener,p=camera.position;
  if(l.positionX){l.positionX.value=p.x;l.positionY.value=p.y;l.positionZ.value=p.z;
    const f=new T.Vector3(0,0,-1).applyQuaternion(camera.quaternion),u=new T.Vector3(0,1,0).applyQuaternion(camera.quaternion);
    l.forwardX.value=f.x;l.forwardY.value=f.y;l.forwardZ.value=f.z;l.upX.value=u.x;l.upY.value=u.y;l.upZ.value=u.z;}
  for(const item of activeSounds){item.gain.gain.value=volume*(item.base??.04);if(item.panner)setSoundPosition(item);}
}
function findSounds(files) {
  const af=files.filter(f=>/^Sonidos\//i.test(f.path)&&/\.(wav|mp3|ogg|m4a)$/i.test(f.path));
  const pats={shot:/gunshot|pistol|disparo/i,reload:/reload|recarg/i,hurt:/grunt|hurt|pain/i,death:/male-scream|death/i,zombie:/zombie.*sound|groan|growl/i,zombieDeath:/zombie.*dying|zombie.*death/i,ambience:/ambien|soundscape|atmosphere/i};
  for(const[k,re]of Object.entries(pats))audio[k]=af.filter(f=>re.test(f.path)&&(!(k==="zombie"||k==="shot")||!/dying|death|reload/i.test(f.path))).slice(0,4).map(f=>url(f.path));
}
findSounds([
 {path:"Sonidos/dragon-studio-gun-reload-2-504027.mp3"},
 {path:"Sonidos/dragon-studio-zombie-dying-sound-357974.mp3"},
 {path:"Sonidos/dragon-studio-zombie-sound-2-357976.mp3"},
 {path:"Sonidos/freesound_community-grunt-1-85280.mp3"},
 {path:"Sonidos/freesound_community-single-pistol-gunshot-33-37187.mp3"},
 {path:"Sonidos/fronbondi_skegs-amb-a-post-apocalyptic-ambient-soundscape-452826.mp3"},
 {path:"Sonidos/universfield-male-scream-121085.mp3"}
]);
function startAmbience(){if(!audio.ambience?.length)return;if(!ambience){ambience=new Audio(audio.ambience[0]);ambience.loop=true;}ambience.volume=volume*.38;ambience.play().catch(()=>{});}
function stopAmbience(){ambience?.pause();}
const gunAnchor = new T.Group();
player.add(gunAnchor);
const basicGun = new T.Group();
gunAnchor.add(basicGun);
box(
  basicGun, 0, 0, -.26,
  .19, .2, .63,
  mat(0x171a1c, .7)
);
box(
  basicGun, 0, -.17, -.04,
  .13, .32, .17,
  mat(0x292a2c)
);
box(
  basicGun, 0, .09, -.48,
  .1, .07, .3,
  mat(0x171a1c, .7)
);
const flash = new T.PointLight(0xffbd69, 0, 5);
flash.position.set(0, 0, -.8);
gunAnchor.add(flash);
let gunModel = null;
let gunAxis = 0;
const gunOrientations = [
  [0, 0, 0],
  [0, Math.PI, 0],
  [0, Math.PI / 2, 0],
  [0, -Math.PI / 2, 0],
  [Math.PI / 2, 0, 0],
  [-Math.PI / 2, 0, 0],
  [0, 0, Math.PI / 2],
  [0, 0, -Math.PI / 2]
];
function setGunAxis() {
  if (!gunModel) return;
  gunModel.rotation.set(
    ...gunOrientations[gunAxis]
  );
  console.log(
    "Pistola orientación",
    gunAxis + 1,
    "/",
    gunOrientations.length
  );
}
function installGun(asset) {
  if (gunModel) gunAnchor.remove(gunModel);
  const source = copy(asset);
  gunModel = new T.Group();
  gunAnchor.add(gunModel);
  gunModel.position.set(0, 0, -.08);
  gunModel.add(fit(source, .23, .32, .6));
  basicGun.visible = false;
  setGunAxis();
}
const keys = {};
const zombies = [];
const clock = new T.Clock();
const ray = new T.Raycaster();
let hp = 100;
let ammo = 12;
let reserve = 96;
let wave = 0;
let kills = 0;
let remaining = 0;
let spawnWait = 0;
let between = 0;
let alive = false;
let paused = false;
let reloading = false;
let shootHeld = false;
let yaw = 0;
let pitch = 0;
let vy = 0;
let grounded = true;
let lastShot = 0;
let recoil = 0;
let session = 0;
let sensitivity = .25;
let stepWait = 0;
let reloadLeft=0, pathsThisFrame=0, saveWait=0, aimHeld=false;
const modes={waves:{title:"OLEADAS",limit:12},explore:{title:"EXPLORACIÓN · PROTOTIPO",limit:6}};
function hud() {
  if ($("health")) {
    $("health").textContent =
      Math.max(0, Math.ceil(hp)) + " ♥";
  }
  if ($("ammo")) {
    $("ammo").textContent =
      (reloading ? "..." : ammo) + " / " + reserve;
  }
  if ($("wave")) $("wave").textContent = wave;
  if ($("kills")) $("kills").textContent = kills;
}
let bannerTimeout;
function announce(msg) {
  const a = $("announcement");
  if (!a) return;
  a.textContent = msg;
  a.style.opacity = 1;
  clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => {
    a.style.opacity = 0;
  }, 1700);
}
function basicZombie() {
  const g = new T.Group();
  box(g, 0, 1.58, 0, .4, .42, .4, m.skin);
  box(g, 0, 1.05, 0, .65, .78, .34, m.cloth);
  const arms = [];
  const legs = [];
  for (const s of [-1, 1]) {
    arms.push(
      box(g, s * .43, 1.07, 0, .2, .7, .2, m.skin)
    );
    legs.push(
      box(g, s * .17, .39, 0, .22, .76, .25, m.cloth)
    );
  }
  return { g, arms, legs };
}
function findProceduralBones(source) {
  const bones = {
    leftLeg: null,
    rightLeg: null,
    leftArm: null,
    rightArm: null
  };
  source.traverse(o => {
    if (!o.isBone) return;
    const name = o.name.toLowerCase();
    if (
      !bones.leftLeg &&
      /left.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*left|leg_l|thigh_l/i.test(name)
    ) {
      bones.leftLeg = o;
    }
    if (
      !bones.rightLeg &&
      /right.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*right|leg_r|thigh_r/i.test(name)
    ) {
      bones.rightLeg = o;
    }
    if (
      !bones.leftArm &&
      /left.*(upperarm|arm)|(?:upperarm|arm).*left|arm_l/i.test(name)
    ) {
      bones.leftArm = o;
    }
    if (
      !bones.rightArm &&
      /right.*(upperarm|arm)|(?:upperarm|arm).*right|arm_r/i.test(name)
    ) {
      bones.rightArm = o;
    }
  });
  const base = {};
  for (const [name, bone] of Object.entries(bones)) {
    if (bone) base[name] = bone.rotation.x;
  }
  return { bones, base };
}
function spawnZombie(x, z) {
  if (blocked(x, z, .55)) {
    const cell = nearestCell(x, z);
    if (!cell) return null;
    const p = navWorld(cell.ix, cell.iz);
    x = p.x;
    z = p.z;
    if (blocked(x, z, .55)) return null;
  }
  const actor = new T.Group();
  actor.position.set(x, groundHeight(x,z), z);
  scene.add(actor);
  const basic = basicZombie();
  actor.add(basic.g);
  let visual = null;
  let mixer = null;
  let walkAction = null;
  let idleAction = null;
  let procedural = null;
  const asset = assets.zombies[
    Math.floor(Math.random() * assets.zombies.length)
  ];
  if (asset) {
    try {
      const src = copy(asset);
      visual = fit(src, 1.90, 0, 0);
      actor.add(visual);
      basic.g.visible = false;
      const clips = inPlaceClips(asset);
      const walking =
        clips.find(c => /walk|run|move|locomotion/i.test(c.name)) ||
        clips.find(c => !/idle|death|attack|hit/i.test(c.name)) ||
        null;
      const idling =
        clips.find(c => /idle|breath|stand/i.test(c.name)) ||
        null;
      if (walking || idling) {
        mixer = new T.AnimationMixer(src);
        if (walking) {
          walkAction = mixer.clipAction(walking);
          walkAction.setLoop(T.LoopRepeat);
          walkAction.play();
          actor.userData.walkCycle =
            walking.duration || 1;
        }
        if (idling && idling !== walking) {
          idleAction = mixer.clipAction(idling);
          idleAction.setLoop(T.LoopRepeat);
          idleAction.play();
          idleAction.setEffectiveWeight(
            walkAction ? 0 : 1
          );
        }
      }
      if (!walkAction) {
        procedural = findProceduralBones(src);
      }
      console.log(
        "Zombi:",
        asset.animations?.map(c => c.name) || [],
        "Caminar:",
        walking?.name || "procedural"
      );
    } catch (e) {
      console.warn("Zombi básico", e);
      visual = null;
      mixer = null;
      basic.g.visible = true;
    }
  }
  const hitMat = new T.MeshBasicMaterial({
    visible: false
  });
  const head = new T.Mesh(
    new T.BoxGeometry(.5, .5, .5),
    hitMat
  );
  head.position.set(0, 1.72, 0);
  head.userData.head = true;
  actor.add(head);
  const torso = new T.Mesh(
    new T.BoxGeometry(.8, 1.35, .65),
    hitMat
  );
  torso.position.set(0, .95, 0);
  actor.add(torso);
  const zombieData = {
    actor,
    basic,
    visual,
    mixer,
    walkAction,
    idleAction,
    procedural,
    hit: [head, torso],
    hp: wave >= 5 ? 3 : 2,
    speed: Math.min(
      2.6,
      .85 + wave * .12 + Math.random() * .25
    ),
    t: Math.random() * 8,
    attack: 0,
    groan: 3 + Math.random() * 5,
    path: [],
    pathTimer: Math.random() * .5,
    stuckTime: 0,
    lastX: x,
    lastZ: z,
    pathFailed: false
  };
  zombies.push(zombieData);
  return zombieData;
}
function updateZombieAnimation(z, dt, moved) {
  const moving = moved > .0005;
  if (z.mixer) {
    if (z.walkAction) {
      const targetSpeed = moving
        ? Math.max(.45, Math.min(1.7, z.speed / 1.5))
        : 1;
      z.walkAction.setEffectiveTimeScale(targetSpeed);
      if (z.idleAction) {
        z.walkAction.setEffectiveWeight(moving ? 1 : 0);
        z.idleAction.setEffectiveWeight(moving ? 0 : 1);
      } else {
        z.walkAction.setEffectiveWeight(moving ? 1 : 0);
      }
    }
    z.mixer.update(dt);
  }
  if (z.procedural) {
    const { bones, base } = z.procedural;
    const swing = moving ? Math.sin(z.t) * .42 : 0;
    if (bones.leftLeg) {
      bones.leftLeg.rotation.x =
        base.leftLeg + swing;
    }
    if (bones.rightLeg) {
      bones.rightLeg.rotation.x =
        base.rightLeg - swing;
    }
    if (bones.leftArm) {
      bones.leftArm.rotation.x =
        base.leftArm - swing * .55;
    }
    if (bones.rightArm) {
      bones.rightArm.rotation.x =
        base.rightArm + swing * .55;
    }
  }
  if (!z.visual) {
    const swing = moving ? Math.sin(z.t) : 0;
    z.basic.legs[0].rotation.x = swing * .5;
    z.basic.legs[1].rotation.x = -swing * .5;
    z.basic.arms[0].rotation.x =
      -.6 - swing * .2;
    z.basic.arms[1].rotation.x =
      -.6 + swing * .2;
  } else if (!z.walkAction && !z.procedural) {
    z.visual.rotation.z =
      moving ? Math.sin(z.t) * .04 : 0;
    z.visual.rotation.x =
      moving ? Math.sin(z.t * .5) * .025 : 0;
  }
}
function moveZombie(z, dt) {
  const px = player.position.x;
  const pz = player.position.z;
  const x = z.actor.position.x;
  const zz = z.actor.position.z;
  const dist = Math.hypot(px - x, pz - zz);
  if (dist <= 1.15) {
    z.path = [];
    z.stuckTime = 0;
    return 0;
  }
  let targetX = px;
  let targetZ = pz;
  const direct = clearLine(x, zz, px, pz, NAV_RADIUS);
  if (direct) {
    z.path = [];
    z.pathFailed = false;
  } else {
    z.pathTimer -= dt;
    if (z.pathTimer <= 0 && pathsThisFrame < 2) {
      pathsThisFrame++;
      z.pathTimer = 1 + Math.random() * .6;
      const path = findPath(x, zz, px, pz);
      if (path) {
        z.path = path;
        z.pathFailed = false;
      } else {
        z.path = [];
        z.pathFailed = true;
      }
    }
    while (
      z.path.length &&
      Math.hypot(
        z.path[0].x - x,
        z.path[0].z - zz
      ) < .65
    ) {
      z.path.shift();
    }
    if (z.path.length) {
      targetX = z.path[0].x;
      targetZ = z.path[0].z;
    }
  }
  const tx = targetX - x;
  const tz = targetZ - zz;
  const targetDist = Math.hypot(tx, tz);
  let moved = 0;
  if (targetDist > .03) {
    const step = Math.min(
      z.speed * dt,
      targetDist
    );
    const nx = x + tx / targetDist * step;
    const nz = zz + tz / targetDist * step;
    let finalX = x;
    let finalZ = zz;
    if (clearLine(x, zz, nx, zz, NAV_RADIUS)) {
      finalX = nx;
    }
    if (clearLine(finalX, zz, finalX, nz, NAV_RADIUS)) {
      finalZ = nz;
    }
    if (
      finalX === x &&
      finalZ === zz &&
      clearLine(x, zz, nx, nz, NAV_RADIUS)
    ) {
      finalX = nx;
      finalZ = nz;
    }
    z.actor.position.x = finalX;
    z.actor.position.z = finalZ;
    z.actor.position.y=groundHeight(finalX,finalZ);
    moved = Math.hypot(
      finalX - x,
      finalZ - zz
    );
    const faceX = moved > .0005 ? finalX - x : tx;
    const faceZ = moved > .0005 ? finalZ - zz : tz;
    const desiredAngle = Math.atan2(faceX, faceZ);
    let difference =
      desiredAngle - z.actor.rotation.y;
    difference = Math.atan2(
      Math.sin(difference),
      Math.cos(difference)
    );
    z.actor.rotation.y +=
      difference * Math.min(1, dt * 9);
  }
  if (moved < .003 && dist > 1.5) {
    z.stuckTime += dt;
  } else {
    z.stuckTime = Math.max(
      0,
      z.stuckTime - dt * 2
    );
  }
  if (z.stuckTime > 1.3 && !z.pathFailed) {
    z.pathTimer = Math.min(z.pathTimer,.2);
  }
  if (z.stuckTime > 7) {
    const rescue = safeSpawn();
    if (rescue) {
      z.actor.position.set(
        rescue.x, groundHeight(rescue.x,rescue.z), rescue.z
      );
      z.path = [];
      z.pathTimer = 0;
      z.pathFailed = false;
      z.stuckTime = 0;
      console.warn(
        "Zombi atascado recolocado",
        rescue
      );
    } else {
      removeZombie(z);
      const index = zombies.indexOf(z);
      if (index !== -1) zombies.splice(index, 1);
      z.stuckTime = 0;
      console.warn("Zombi inaccesible retirado");
    }
  }
  return moved;
}
function newWave() {
  wave++;
  remaining = 4 + wave * 3;
  spawnWait = 0;
  between = 0;
  if (wave > 1) reserve += 24;
  announce("OLEADA " + wave);
  sound("wave");
  hud();
}
function reload(){
  if(!alive||paused||reloading||ammo===12||reserve<=0)return;
  reloading=true;reloadLeft=1.15;hud();sound("reload");
}
function updateReload(dt){if(!reloading)return;reloadLeft-=dt;if(reloadLeft<=0){const n=Math.min(12-ammo,reserve);ammo+=n;reserve-=n;reloading=false;reloadLeft=0;hud();}}
function removeZombie(z){stopSounds(z);scene.remove(z.actor);z.mixer?.stopAllAction();
  for(const h of z.hit){h.geometry.dispose();}z.hit[0].material.dispose();
  const i=zombies.indexOf(z);if(i>=0)zombies.splice(i,1);
}
const shotRay=new T.Raycaster(),cameraRay=new T.Raycaster();
const tmpDir=new T.Vector3(),tmpOrigin=new T.Vector3(),tmpTarget=new T.Vector3();
function firstWorldHit(cast){return cast.intersectObject(world,true)[0];}
function shoot(){
  if(!alive||paused||reloading)return;const now=performance.now();if(now-lastShot<235)return;
  if(ammo<=0){reload();return;}lastShot=now;ammo--;recoil=.13;flash.intensity=8;sound("shot");
  scene.updateMatrixWorld(true);ray.setFromCamera(new T.Vector2(),camera);ray.far=65;
  const wall=firstWorldHit(ray),hits=ray.intersectObjects(zombies.flatMap(z=>z.hit),false);
  let hit=hits[0];if(wall&&(!hit||wall.distance<hit.distance))hit=null;
  tmpTarget.copy(ray.ray.origin).addScaledVector(ray.ray.direction,wall?wall.distance:65);
  if(hit)tmpTarget.copy(hit.point);
  flash.getWorldPosition(tmpOrigin);tmpDir.subVectors(tmpTarget,tmpOrigin);const reach=tmpDir.length();tmpDir.normalize();
  shotRay.set(tmpOrigin,tmpDir);shotRay.far=reach+.02;
  const muzzleWall=firstWorldHit(shotRay),muzzleHit=shotRay.intersectObjects(zombies.flatMap(z=>z.hit),false)[0];
  if(muzzleHit&&(!muzzleWall||muzzleHit.distance<muzzleWall.distance)){
    const target=zombies.find(z=>z.hit.includes(muzzleHit.object));if(target){target.hp-=muzzleHit.object.userData.head?3:1;
      $("hitmark").style.opacity=1;setTimeout(()=>$("hitmark").style.opacity=0,90);
      if(target.hp<=0){removeZombie(target);kills++;sound("zombieDeath");}
    }
  }
  hud();if(ammo===0&&reserve>0)reload();
}
function panel(id) {
  for (const p of [
    "main",
    "options",
    "load",
    "credits"
  ]) {
    $(p + "-panel")?.classList.toggle(
      "hidden",
      p !== id
    );
  }
}
function showMenu() {
  $("menu")?.classList.remove("hidden");
  panel("main");
}
function hideMenu() {
  $("menu")?.classList.add("hidden");
}
const SAVE_KEY="deadzone-save-v3";
function readSaves(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));return d?.version===3&&Array.isArray(d.slots)?d.slots:[];}catch{return[];}}
function snapshot(){return{mode:playerState.mode,hp,ammo,reserve,wave,kills,remaining,spawnWait,between,reloading,reloadLeft,x:player.position.x,y:player.position.y,z:player.position.z,yaw,pitch,vy,grounded,
  map:solids.map(o=>({...o})),buildings:world.children.filter(g=>g.userData.building).map(g=>({x:g.position.x,z:g.position.z,h:g.userData.height})),
  cars:cars.map(c=>({x:c.g.position.x,z:c.g.position.z,rot:c.g.rotation.y})),
  zombies:zombies.map(z=>({x:z.actor.position.x,z:z.actor.position.z,hp:z.hp,speed:z.speed,attack:z.attack,groan:z.groan})),date:Date.now()};}
function validSave(d){return d&&["waves","explore"].includes(d.mode)&&[d.hp,d.ammo,d.reserve,d.wave,d.kills,d.x,d.z,d.yaw,d.pitch].every(Number.isFinite)&&d.hp>0&&d.hp<=100&&d.ammo>=0&&d.ammo<=12&&d.reserve>=0&&d.reserve<=100000&&d.wave>=0&&d.wave<=10000&&Math.abs(d.x)<88&&Math.abs(d.z)<88&&Array.isArray(d.zombies)&&d.zombies.length<=12&&d.zombies.every(z=>[z.x,z.z,z.hp,z.speed].every(Number.isFinite)&&z.hp>0&&z.speed>0&&z.speed<=3&&Math.abs(z.x)<88&&Math.abs(z.z)<88);}
function saveGame(notice=true){if(!alive)return;try{const d=snapshot(),slots=readSaves().filter(s=>s.mode!==d.mode);slots.unshift(d);localStorage.setItem(SAVE_KEY,JSON.stringify({version:3,slots}));if(notice)announce("PARTIDA GUARDADA");}catch{if(notice)announce("NO SE PUDO GUARDAR");}}
function requestLock(){try{const result=renderer.domElement.requestPointerLock?.();result?.catch(()=>{paused=true;showMenu();announce("CLIC EN CONTINUAR PARA JUGAR");});}catch{paused=true;showMenu();}}
function start(mode="explore",data=null){
  session++;stopSounds();for(const z of [...zombies])removeZombie(z);
  Object.keys(keys).forEach(k=>keys[k]=false);playerState.mode=mode;
  hp=100;ammo=12;reserve=96;wave=0;kills=0;remaining=0;spawnWait=0;between=0;yaw=0;pitch=0;vy=0;grounded=true;
  reloading=false;reloadLeft=0;alive=true;paused=false;shootHeld=false;aimHeld=false;lastShot=0;recoil=0;
  player.position.set(0,groundHeight(0,0),0);player.visible=true;$("hud").classList.remove("hidden");
  if(data&&validSave(data)){
    if(Array.isArray(data.map)&&data.map.length===solids.length&&data.map.every(o=>[o.x,o.z,o.w,o.d,o.h].every(Number.isFinite)&&o.w>0&&o.d>0)){
      solids.splice(0,solids.length,...data.map.map(o=>({...o})));
      for(const b of data.buildings||[]){const g=world.children.find(o=>o.userData.building&&o.position.x===b.x&&o.position.z===b.z);if(g&&b.h>=9&&b.h<=21){const ratio=b.h/g.userData.height;g.scale.y*=ratio;g.userData.height=b.h;}}
      (data.cars||[]).forEach((v,i)=>{if(cars[i]&&[v.x,v.z,v.rot].every(Number.isFinite)){cars[i].g.position.set(v.x,0,v.z);cars[i].g.rotation.y=v.rot;}});buildNavigation();
    }
    hp=data.hp;ammo=data.ammo;reserve=data.reserve;wave=data.wave;kills=data.kills;remaining=Math.max(0,Math.min(100000,Number(data.remaining)||0));
    spawnWait=Math.max(0,Number(data.spawnWait)||0);between=Math.max(0,Number(data.between)||0);yaw=data.yaw;pitch=Math.max(-1.2,Math.min(1.2,data.pitch));
    if(!blocked(data.x,data.z))player.position.set(data.x,Math.max(groundHeight(data.x,data.z),Number(data.y)||0),data.z);
    vy=Number.isFinite(data.vy)?data.vy:0;grounded=!!data.grounded;reloading=!!data.reloading;reloadLeft=Math.max(0,Math.min(1.15,Number(data.reloadLeft)||0));
    for(const saved of data.zombies){const z=spawnZombie(saved.x,saved.z);if(z){z.hp=saved.hp;z.speed=saved.speed;z.attack=Math.max(0,Number(saved.attack)||0);z.groan=Math.max(1,Number(saved.groan)||1);}}
  }else if(mode==="waves")newWave();else{remaining=6;announce("DÍA 47 · ZONA DE PRUEBAS");}
  saveWait=0;$("continue").textContent="CONTINUAR";$("subtitle").textContent="LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.";hideMenu();hud();wakeAudio();updatePlayerCamera(1,true);requestLock();
}
function resume(){if(!alive){const saved=readSaves().find(validSave);if(saved)start(saved.mode,saved);else start(playerState.mode);return;}hideMenu();$("subtitle").textContent="LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.";wakeAudio();requestLock();}
function die(){stopSounds();sound("death");alive=false;paused=false;shootHeld=false;aimHeld=false;document.exitPointerLock?.();showMenu();$("hud").classList.add("hidden");$("subtitle").textContent=`HAS CAÍDO · ${kills} BAJAS`;$("continue").textContent="REINTENTAR";}
$("new").onclick=()=>start("explore");$("waves").onclick=()=>start("waves");$("continue").onclick=resume;
$("options").onclick=()=>panel("options");$("credits").onclick=()=>panel("credits");
$("load").onclick=()=>{panel("load");const list=$("saves");list.replaceChildren();const slots=readSaves().filter(validSave);
  try{const old=JSON.parse(localStorage.getItem("deadzone-save"));if(old&&[old.hp,old.ammo,old.reserve,old.wave,old.kills,old.x,old.z].every(Number.isFinite)){
    const migrated={...old,mode:"waves",yaw:0,pitch:0,zombies:[],remaining:4+old.wave*3,date:0};if(validSave(migrated)){slots.push(migrated);}
  }}catch{}
  for(const d of slots){const b=document.createElement("button");b.textContent=`${modes[d.mode].title} · ${d.date?new Date(d.date).toLocaleString():"GUARDADO V5 · REINICIA OLEADA"}`;b.onclick=()=>start(d.mode,d);list.append(b);}
  if(!slots.length)list.textContent="SIN PARTIDAS GUARDADAS";
};
document.querySelectorAll(".back").forEach(
  b => b.onclick = () => panel("main")
);
for (const id of ["fov", "sens", "vol"]) {
  const el = $(id);
  if (el) {
    el.oninput = () => {
      if ($(id + "-val")) {
        $(id + "-val").textContent =
          el.value + (id === "vol" ? "%" : "");
      }
    };
  }
}
$("apply").onclick = () => {
  camera.fov = Number($("fov").value);
  camera.updateProjectionMatrix();
  sensitivity = Number($("sens").value);
  volume = Number($("vol").value) / 100;
  if (ambience) ambience.volume = volume * .38;
  updateAudio();
  try{localStorage.setItem("deadzone-options",JSON.stringify({fov:camera.fov,sensitivity,volume,quality:$("quality").value}));}catch{}
  renderer.setPixelRatio(
    Math.min(
      devicePixelRatio,
      $("quality").value === "low"
        ? .7
        : $("quality").value === "high"
          ? 1.3
          : 1
    )
  );
  for(const id of ["fov","sens","vol"])$(id+"-val").textContent=$(id).value+(id==="vol"?"%":"");
  panel("main");
};
document.addEventListener("keydown", e => {
  keys[e.code] = true;
  if (e.code === "KeyR") reload();
  if (
    e.code === "Space" &&
    alive &&
    !paused &&
    grounded
  ) {
    vy = 6;
    grounded = false;
  }
  if (e.code === "F7") {
    e.preventDefault();
    gunAxis = (gunAxis + 1) %
      gunOrientations.length;
    setGunAxis();
    announce(
      "PISTOLA: ORIENTACIÓN " +
      (gunAxis + 1) + "/8"
    );
  }
  if (e.code === "KeyP" && alive && !paused) saveGame();
  if (
    alive &&
    ["Space", "ArrowUp", "ArrowDown"].includes(e.code)
  ) {
    e.preventDefault();
  }
});
document.addEventListener("keyup", e => {
  keys[e.code] = false;
});
document.addEventListener("mousemove", e => {
  if (
    document.pointerLockElement !==
    renderer.domElement
  ) return;
  yaw -= e.movementX * sensitivity * .01;
  pitch = Math.max(
    -1.45,
    Math.min(
      1.45,
      pitch - e.movementY * sensitivity * .01
    )
  );
});
renderer.domElement.addEventListener(
  "mousedown",
  e => {
    if(e.button===2){aimHeld=alive&&!paused;return;}
    if (!alive || paused || e.button !== 0) return;
    shootHeld = true;
    if (
      document.pointerLockElement !==
      renderer.domElement
    ) {
      renderer.domElement.requestPointerLock?.();
    } else {
      shoot();
    }
  }
);
document.addEventListener("mouseup", e => {
  if(e.button===0)shootHeld=false; if(e.button===2)aimHeld=false;
});
renderer.domElement.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener(
  "pointerlockchange",
  () => {
    if (!alive) return;
    if (
      document.pointerLockElement ===
      renderer.domElement
    ) {
      paused = false;
      hideMenu();
      startAmbience();
    } else {
      paused = true;
      shootHeld = false;aimHeld=false;stopSounds();startAmbience();
      Object.keys(keys).forEach(k=>keys[k]=false);
      saveGame(false);
      showMenu();
      const sub = $("menu")?.querySelector(
        ".subtitle"
      );
      if (sub) {
        sub.textContent = "PARTIDA EN PAUSA";
      }
    }
  }
);
window.addEventListener("blur", () => {
  shootHeld = false;aimHeld=false;
  if(alive){paused=true;stopSounds();stopAmbience();saveGame(false);document.exitPointerLock?.();showMenu();}
  Object.keys(keys).forEach(k => {
    keys[k] = false;
  });
});
const hero={visual:null,mixer:null,walk:null};
const heroFallback=basicZombie();player.add(heroFallback.g);
heroFallback.g.traverse(o=>{if(o.isMesh)o.material=mat(o.position.y>1.4?0x997a64:0x454d47);});
async function installHero(){
  const path="https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/CesiumMan/glTF-Binary/CesiumMan.glb";
  const asset=await gltf.loadAsync(path),src=copy(asset);hero.visual=fit(src,1.8);hero.visual.rotation.y=Math.PI;player.add(hero.visual);
  hero.mixer=new T.AnimationMixer(src);const clips=inPlaceClips(asset);if(!clips.length)throw Error("Humanoide sin animaciones");hero.walk=hero.mixer.clipAction(clips[0]);hero.walk.play();heroFallback.g.visible=false;
  $("asset-status").textContent="PERSONAJE RIGGEADO CARGADO";
}
function updatePlayerCamera(dt,snap=false){
  const crouch=!!(keys.ControlLeft||keys.KeyC), moving=playerState.moving;
  player.rotation.y=yaw;
  if(hero.walk){hero.walk.paused=!moving;hero.walk.timeScale=keys.ShiftLeft?1.65:crouch?.65:1;hero.mixer.update(dt);}
  if(hero.visual)hero.visual.position.y=0;
  if(!hero.visual){const swing=moving?Math.sin(performance.now()*.009)*.45:0;heroFallback.legs[0].rotation.x=swing;heroFallback.legs[1].rotation.x=-swing;}
  gunAnchor.position.set(.3,crouch?.94:1.24,-.38+recoil);gunAnchor.rotation.set(aimHeld?pitch:0,0,0);
  const pivot=new T.Vector3(player.position.x,player.position.y+(crouch?1.05:1.5),player.position.z);
  const rotation=new T.Quaternion().setFromEuler(new T.Euler(pitch,yaw,0,"YXZ"));
  const offset=new T.Vector3(aimHeld?.48:.65,.12,aimHeld?1.9:3.5).applyQuaternion(rotation);
  const desired=pivot.clone().add(offset);world.updateMatrixWorld(true);
  cameraRay.set(pivot,offset.clone().normalize());cameraRay.far=offset.length()+.15;
  const obstacle=firstWorldHit(cameraRay);if(obstacle)desired.copy(pivot).addScaledVector(cameraRay.ray.direction,Math.max(.15,obstacle.distance-.22));
  if(snap)camera.position.copy(desired);else camera.position.lerp(desired,1-Math.exp(-dt*14));
  tmpDir.subVectors(camera.position,pivot);cameraRay.set(pivot,tmpDir.clone().normalize());cameraRay.far=tmpDir.length();
  const clipped=firstWorldHit(cameraRay);if(clipped)camera.position.copy(pivot).addScaledVector(cameraRay.ray.direction,Math.max(.12,clipped.distance-.22));
  camera.quaternion.copy(rotation);player.visible=pivot.distanceTo(camera.position)>.6;
}
function optimizeTextures(asset){asset.scene.traverse(o=>{if(!o.isMesh)return;for(const material of Array.isArray(o.material)?o.material:[o.material]){
  for(const key of ["map","normalMap","roughnessMap","metalnessMap","aoMap"]){const t=material[key],img=t?.image;if(!img||t.userData.reduced)continue;
    t.userData.reduced=true;if(Math.max(img.width,img.height)>512){const c=document.createElement("canvas"),ratio=512/Math.max(img.width,img.height);c.width=Math.max(1,Math.round(img.width*ratio));c.height=Math.max(1,Math.round(img.height*ratio));c.getContext("2d").drawImage(img,0,0,c.width,c.height);t.image=c;t.needsUpdate=true;}}
}});}
async function installCity(){
  const paths=["Ciudad/Exports/glTF (Godot)/Brick_Plain_3.gltf","Ciudad/Exports/glTF (Godot)/Brick_Window_Square_Single.gltf"];
  const modules=[];for(const p of paths){const a=await load(p);optimizeTextures(a);modules.push(a);}
  for(let i=0;i<cityPanels.length;i++){
    const p=cityPanels[i],src=copy(modules[i%modules.length]),b=new T.Box3().setFromObject(src),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3());
    const group=new T.Group(),offset=new T.Group();group.add(offset);offset.add(src);offset.position.copy(center).negate();
    const alongZ=p.dd>p.ww;group.scale.set((alongZ?p.dd:p.ww)/Math.max(.01,size.x),3.2/Math.max(.01,size.y),.25/Math.max(.01,size.z));
    group.rotation.y=alongZ?Math.PI/2:0;group.position.set(p.lx,1.8,p.lz);p.g.add(group);p.mesh.visible=false;
  }
  $("city-status").textContent="APARTAMENTO EXPLORABLE · 2 MÓDULOS MEGAKIT";
}
async function loadAssets(){
  const jobs=[installHero().catch(e=>{console.warn("Personaje provisional geométrico",e);$("asset-status").textContent="PERSONAJE BÁSICO · FALLÓ EL GLB";}),installCity().catch(e=>{console.warn("MegaKit no disponible",e);$("city-status").textContent="APARTAMENTO BÁSICO · FALLÓ MEGAKIT";})];
  for(const p of ["Zombies/zombie_1.glb","Zombies/zombie_2.glb"]){try{const a=await load(p);optimizeTextures(a);assets.zombies.push(a);}catch(e){console.warn(p,e);}}
  for(const z of [...zombies]){if(!z.visual&&assets.zombies.length){const state={x:z.actor.position.x,z:z.actor.position.z,hp:z.hp,speed:z.speed};removeZombie(z);const n=spawnZombie(state.x,state.z);if(n){n.hp=state.hp;n.speed=state.speed;}}}
  try{assets.gun=await load("Armas 3D/pistola/9_mm.glb");optimizeTextures(assets.gun);installGun(assets.gun);}catch(e){console.warn("Pistola básica",e);}
  try{assets.car=await load("Armas 3D/coche/covered_car_4k.glb");for(const c of cars.slice(0,3)){c.g.add(fit(copy(assets.car),1.5,2.1,4.3));c.low.visible=false;}}catch(e){console.warn("Coche básico",e);}
  await Promise.allSettled(jobs);$("loading").textContent="LISTO · P PARA GUARDAR";
}
let fpsCount = 0;
let fpsTimer = 0;
function frame() {
  requestAnimationFrame(frame);
  const elapsed=clock.getDelta(),dt=Math.min(elapsed,.05);
  pathsThisFrame=0;
  if (alive && !paused) {
    const f =
      Number(!!keys.KeyW) -
      Number(!!keys.KeyS);
    const s =
      Number(!!keys.KeyD) -
      Number(!!keys.KeyA);
    const len = Math.hypot(f, s) || 1;
    const crouch =
      keys.ControlLeft || keys.KeyC;
    const spd = (
      crouch
        ? 2.2
        : keys.ShiftLeft
          ? 7
          : 4.5
    ) * dt;
    const dx = (
      -Math.sin(yaw) * f +
      Math.cos(yaw) * s
    ) / len * spd;
    const dz = (
      -Math.cos(yaw) * f -
      Math.sin(yaw) * s
    ) / len * spd;
    if (clearLine(player.position.x,player.position.z,player.position.x+dx,player.position.z,.38)) {
      player.position.x += dx;
    }
    if (clearLine(player.position.x,player.position.z,player.position.x,player.position.z+dz,.38)) {
      player.position.z += dz;
    }
    playerState.moving=!!(f||s);
    vy-=15*dt;player.position.y+=vy*dt;
    const floor=groundHeight(player.position.x,player.position.z);
    if(player.position.y<=floor){player.position.y=floor;vy=0;grounded=true;}else grounded=false;
    updatePlayerCamera(dt);updateReload(dt);updateAudio();
    saveWait+=dt;if(saveWait>20){saveGame(false);saveWait=0;}
    if ((f || s) && grounded) {
      stepWait -= dt;
      if (stepWait <= 0) {
        sound("step");
        stepWait = keys.ShiftLeft ? .32 : .48;
      }
    }
    spawnWait -= dt;
    if (remaining > 0 && spawnWait <= 0 && zombies.length<modes[playerState.mode].limit) {
      const point = safeSpawn();
      if (point) {
        const created = spawnZombie(
          point.x,
          point.z
        );
        if (created) {
          remaining--;
        }
      }
      spawnWait = 1.15;
    }
    if (
      playerState.mode === "waves" && remaining === 0 &&
      zombies.length === 0
    ) {
      between += dt;
      if (between > 2) {
        newWave();
      }
    } else {
      between = 0;
    }
    for (const z of [...zombies]) {
      const moved = moveZombie(z, dt);
      if (!zombies.includes(z)) continue;
      z.t += dt * (moved > .0005 ? 7 : 2);
      updateZombieAnimation(z, dt, moved);
      const dx =
        player.position.x -
        z.actor.position.x;
      const dz =
        player.position.z -
        z.actor.position.z;
      const dist = Math.hypot(dx, dz);
      z.attack -= dt;
      z.groan -= dt;
      if (z.groan <= 0 && dist < 15) {
        sound("zombie",z);
        z.groan = 5 + Math.random() * 5;
      }
      if (dist < 1.2 && Math.abs(player.position.y-z.actor.position.y)<1.5 && z.attack <= 0 && clearLine(z.actor.position.x,z.actor.position.z,player.position.x,player.position.z,.1)) {
        hp -= 12;
        z.attack = 1.1;
        if (hp > 0) {
          sound("hurt");
        }
        if ($("damage")) {
          $("damage").style.opacity = .3;
          setTimeout(() => {
            $("damage").style.opacity = 0;
          }, 150);
        }
        hud();
        if (hp <= 0) {
          die();
          break;
        }
      }
    }
    if (
      shootHeld &&
      document.pointerLockElement ===
      renderer.domElement
    ) {
      shoot();
    }
    recoil = Math.max(
      0,
      recoil - dt * 1.1
    );
    flash.intensity = Math.max(
      0,
      flash.intensity - dt * 120
    );
  }
  fpsCount++;
  fpsTimer += elapsed;
  if (fpsTimer >= 1) {
    if ($("fps")) {
      $("fps").textContent =
        $("showfps")?.checked
          ? fpsCount + " FPS"
          : "";
    }
    fpsCount = 0;
    fpsTimer = 0;
  }
  if(!alive){
    player.visible=true;gunAnchor.position.set(.3,1.24,-.38);player.rotation.y=-.5;
    if(hero.mixer){hero.walk.paused=true;hero.mixer.update(dt);}
    const t=performance.now()*.00006;camera.position.set(player.position.x+4+Math.sin(t)*1.2,player.position.y+2.1,player.position.z+5);camera.lookAt(player.position.x,player.position.y+1,player.position.z);
  }
  if($("mode-name"))$("mode-name").textContent=modes[playerState.mode].title;
  renderer.render(scene, camera);
}
window.addEventListener("resize", () => {
  const w = Math.max(1, root.clientWidth);
  const h = Math.max(1, root.clientHeight);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
try{const saved=JSON.parse(localStorage.getItem("deadzone-options"));if(saved){$("fov").value=saved.fov;$("sens").value=saved.sensitivity;$("vol").value=saved.volume*100;$("quality").value=saved.quality;}}catch{}
$("apply").onclick();
root.addEventListener("click",()=>{if(!ctx)wakeAudio();},{once:true});
window.addEventListener("pagehide",()=>{saveGame(false);stopSounds();stopAmbience();});
if(new URLSearchParams(location.search).has("test"))window.__DZ={scene,world,player,camera,hero,assets,zombies,solids,blocked,clearLine,findPath,spawnZombie,removeZombie,start,shoot,reload,snapshot,validSave,saveGame,readSaves,getState:()=>({hp,ammo,reserve,wave,kills,remaining,paused,reloading,reloadLeft,mode:playerState.mode}),setPaused:v=>paused=v,setYaw:v=>yaw=v,updatePlayerCamera,activeSounds,sound,stopSounds,moveZombie,wakeAudio,getPathBudget:()=>pathsThisFrame};
hud();
frame();
loadAssets().catch(console.error);
console.log("DEAD ZONE · FASE 1 · TERCERA PERSONA");
})().catch(error=>{console.error(error);const status=document.getElementById("loading");if(status)status.textContent="NO SE PUDO INICIAR · "+error.message;});
