
(async () => {
"use strict";

const T = await import("https://esm.sh/three@0.160.1");
const { GLTFLoader } = await import("https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?deps=three@0.160.1");
const { clone: cloneSkinned } = await import("https://esm.sh/three@0.160.1/examples/jsm/utils/SkeletonUtils.js?deps=three@0.160.1");

const $ = id => document.getElementById(id);
const root = $("game");
if (!root) throw Error("Falta #game en el HTML");

// ============================================================
// ESCENA ORIGINAL
// ============================================================

const scene = new T.Scene();
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

// ============================================================
// COLISIONES ORIGINALES + RADIO CONFIGURABLE
// ============================================================

const solids = [];

const addSolid = (x, z, w, d) =>
  solids.push({ x, z, w, d });

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

// Comprueba toda la trayectoria, no solo el destino.
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

// ============================================================
// CIUDAD ORIGINAL
// ============================================================

box(scene, 0, -.18, 0, 190, .36, 190, m.ground);

for (let i = -2; i <= 2; i++) {
  const p = i * 30;

  box(scene, p, .02, 0, 11, .05, 190, m.road);
  box(scene, 0, .025, p, 190, .05, 11, m.road);

  for (let j = -85; j < 85; j += 9) {
    box(scene, p, .058, j, .13, .01, 3, m.line);
    box(scene, j, .058, p, 3, .01, .13, m.line);
  }
}

const walls = [
  0x62615f,
  0x575c5e,
  0x716962,
  0x4c565b
].map(c => mat(c));

function building(x, z, w, d, h) {
  const g = new T.Group();
  g.position.set(x, 0, z);
  scene.add(g);

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

  addSolid(x, z, w, d);
}

for (let x = -2; x < 2; x++) {
  for (let z = -2; z < 2; z++) {
    const cx = x * 30 + 15;
    const cz = z * 30 + 15;

    box(scene, cx, .13, cz, 19, .26, 19, m.walk);

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

// ============================================================
// COCHES ORIGINALES
// ============================================================

const cars = [];

function car(x, z, rot) {
  const g = new T.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  scene.add(g);

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

// ============================================================
// NAVEGACIÓN NUEVA: A* ALREDEDOR DE LOS EDIFICIOS
// ============================================================

// Cuadrícula ligera para Chromebook.
// Se calcula con las mismas colisiones de la ciudad.
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

// Busca una casilla transitable cercana.
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

// Cola de prioridad para A*.
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
    return [{ x: tx, z: tz }];
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

  // Suavizar: elimina esquinas innecesarias,
  // pero nunca atraviesa edificios.
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

// Posición segura alrededor del jugador.
function safeSpawn() {
  const px = camera.position.x;
  const pz = camera.position.z;

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

    // Preferir posiciones con línea de visión.
    // Las demás siguen siendo válidas con A*.
    if (clearLine(x, z, px, pz, .48)) {
      return { x, z };
    }

    const path = findPath(x, z, px, pz);

    if (path) return { x, z };
  }

  // Fallback: casilla navegable próxima.
  const cell = nearestCell(px + 12, pz + 12);

  if (cell) {
    const p = navWorld(cell.ix, cell.iz);

    if (!blocked(p.x, p.z, .65)) {
      return p;
    }
  }

  return null;
}

// ============================================================
// RECURSOS 3D ORIGINALES
// ============================================================

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

function fit(source, height, maxW, maxD) {
  const wrap = new T.Group();
  wrap.add(source);

  source.updateMatrixWorld(true);

  let b = new T.Box3().setFromObject(source);
  let s = b.getSize(new T.Vector3());

  if (!isFinite(s.y) || s.y < .00001) {
    throw Error("GLB dimensions invalid");
  }

  let factor = height / s.y;

  if (maxW && s.x > 0) {
    factor = Math.min(factor, maxW / s.x);
  }

  if (maxD && s.z > 0) {
    factor = Math.min(factor, maxD / s.z);
  }

  source.scale.multiplyScalar(factor);
  source.updateMatrixWorld(true);

  b = new T.Box3().setFromObject(source);
  const c = b.getCenter(new T.Vector3());

  source.position.x -= c.x;
  source.position.z -= c.z;
  source.position.y -= b.min.y;

  source.updateMatrixWorld(true);

  return wrap;
}

// ============================================================
// AUDIO ORIGINAL
// ============================================================

const audio = {};
let ctx = null;
let volume = .65;
let ambience = null;

const activeSounds = new Set();

function tone(type) {
  try {
    ctx ??= new (
      window.AudioContext || window.webkitAudioContext
    )();

    if (ctx.state === "suspended") ctx.resume();

    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    const cfg = {
      shot: [190, 48, .12],
      reload: [560, 180, .12],
      hurt: [140, 60, .2],
      death: [130, 40, .25],
      zombie: [90, 52, .4],
      wave: [420, 700, .25],
      step: [85, 45, .055]
    }[type] || [200, 80, .1];

    o.type = type === "wave" ? "triangle" : "sawtooth";

    o.frequency.setValueAtTime(cfg[0], t);
    o.frequency.exponentialRampToValueAtTime(
      cfg[1], t + cfg[2]
    );

    g.gain.setValueAtTime(.075 * volume, t);
    g.gain.exponentialRampToValueAtTime(
      .001, t + cfg[2]
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start(t);
    o.stop(t + cfg[2]);
  } catch (e) {}
}

function sound(type) {
  const files = audio[type];

  if (!files?.length) {
    tone(type);
    return;
  }

  const file = files[
    Math.floor(Math.random() * files.length)
  ];

  try {
    const a = new Audio(file);
    a.volume = volume * (type === "zombie" ? .45 : 1);

    activeSounds.add(a);

    const cleanup = () => activeSounds.delete(a);

    a.addEventListener("ended", cleanup, { once: true });
    a.addEventListener("error", cleanup, { once: true });

    if (type === "shot") {
      setTimeout(() => {
        a.pause();
        cleanup();
      }, 320);
    }

    a.play().catch(() => {
      cleanup();
      tone(type);
    });
  } catch (e) {
    tone(type);
  }
}

function findSounds(files) {
  const af = files.filter(f =>
    /^Sonidos\//i.test(f.path) &&
    /\.(wav|mp3|ogg|m4a)$/i.test(f.path)
  );

  const pats = {
    shot: /gun|pistol|shot|shoot|disparo|fire/i,
    reload: /reload|recarg|magazine|clip/i,
    hurt: /grunt|hurt|damage|pain|dolor|hit/i,
    death: /death|dying|muerte|die/i,
    zombie: /zombie|groan|growl|monster|moan/i,
    wave: /wave|round|alarm|start/i,
    step: /foot|step|walk|paso/i,
    ambience: /ambien|atmosphere|background|wind|viento|environment/i
  };

  for (const [k, re] of Object.entries(pats)) {
    let matching = af.filter(f => re.test(f.path));

    if (k === "shot") {
      matching = matching.filter(f =>
        !/reload|recarg|magazine|clip|empty/i.test(f.path)
      );
    }

    if (k === "hurt" || k === "death") {
      matching = matching.filter(f =>
        !/zombie|monster/i.test(f.path)
      );
    }

    audio[k] = matching
      .slice(0, 8)
      .map(f => url(f.path));

    console.log("Audio", k, matching.map(f => f.path));
  }
}

function startAmbience() {
  if (ambience || !audio.ambience?.length) return;

  ambience = new Audio(audio.ambience[0]);
  ambience.loop = true;
  ambience.volume = volume * .25;

  ambience.play().catch(() => {
    ambience = null;
  });
}

function stopAmbience() {
  if (!ambience) return;

  ambience.pause();
  ambience.currentTime = 0;
  ambience = null;
}

// ============================================================
// PISTOLA FPS ORIGINAL
// ============================================================

const gunAnchor = new T.Group();
camera.add(gunAnchor);

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

// ============================================================
// ESTADO ORIGINAL
// ============================================================

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

// ============================================================
// ZOMBIS: MODELOS, ANIMACIONES Y COLISIONES CORREGIDAS
// ============================================================

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

// Detecta huesos utilizables si el GLB no trae
// clips de caminar o correr.
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
  // No permitir zombis dentro de edificios.
  if (blocked(x, z, .55)) {
    const cell = nearestCell(x, z);

    if (!cell) return null;

    const p = navWorld(cell.ix, cell.iz);

    x = p.x;
    z = p.z;

    if (blocked(x, z, .55)) return null;
  }

  const actor = new T.Group();
  actor.position.set(x, 0, z);
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

      // SE MANTIENE LA ALTURA DE 1,90 METROS.
      visual = fit(src, 1.90, 0, 0);

      actor.add(visual);
      basic.g.visible = false;

      // Eliminamos solo la traslación global del modelo.
      // Conservamos rotaciones de brazos, piernas,
      // columna, cabeza y demás huesos.
      const clips = (asset.animations || [])
        .map(c => new T.AnimationClip(
          c.name,
          c.duration,
          c.tracks.filter(tr => {
            if (/\.scale$/i.test(tr.name)) return false;

            const parts = tr.name.split(".");
            const target = parts[0].toLowerCase();
            const property = parts[parts.length - 1];

            if (
              property === "position" &&
              /^(root|armature|scene|hips|pelvis)$/i.test(target)
            ) {
              return false;
            }

            return true;
          })
        ))
        .filter(c => c.tracks.length > 0);

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

      // Si el GLB no trae caminar, intentamos
      // animar sus huesos directamente.
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

    // NUEVO: navegación
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

// Animación del GLB sincronizada con el movimiento.
function updateZombieAnimation(z, dt, moved) {
  const moving = moved > .0005;

  if (z.mixer) {
    if (z.walkAction) {
      // El mixer SIEMPRE avanza. Ya no se congela.
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

  // Animación de huesos cuando el GLB no tiene
  // un clip de caminar utilizable.
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

  // Movimiento básico si no existe un esqueleto.
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

// Movimiento de un zombi con navegación.
function moveZombie(z, dt) {
  const px = camera.position.x;
  const pz = camera.position.z;

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

    if (z.pathTimer <= 0 || !z.path.length) {
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

    // Consumir puntos ya alcanzados.
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

    // Comprueba cada eje Y toda la trayectoria.
    if (clearLine(x, zz, nx, zz, NAV_RADIUS)) {
      finalX = nx;
    }

    if (clearLine(finalX, zz, finalX, nz, NAV_RADIUS)) {
      finalZ = nz;
    }

    // Si ambos ejes fallan, prueba la dirección
    // completa. Esto ayuda con esquinas.
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

    moved = Math.hypot(
      finalX - x,
      finalZ - zz
    );

    // Girar hacia la dirección real de movimiento.
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

  // Detección de zombis atascados.
  if (moved < .003 && dist > 1.5) {
    z.stuckTime += dt;
  } else {
    z.stuckTime = Math.max(
      0,
      z.stuckTime - dt * 2
    );
  }

  if (z.stuckTime > 1.3) {
    z.pathTimer = 0;
  }

  // Recuperación para que no se bloquee la ronda.
  if (z.stuckTime > 7) {
    const rescue = safeSpawn();

    if (rescue) {
      z.actor.position.set(
        rescue.x, 0, rescue.z
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
      // Último recurso: no dejar una ronda
      // bloqueada por un enemigo inaccesible.
      scene.remove(z.actor);
      z.mixer?.stopAllAction();

      const index = zombies.indexOf(z);
      if (index !== -1) zombies.splice(index, 1);

      z.stuckTime = 0;
      console.warn("Zombi inaccesible retirado");
    }
  }

  return moved;
}

// ============================================================
// OLEADAS ORIGINALES
// ============================================================

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

// ============================================================
// RECARGA ORIGINAL
// ============================================================

function reload() {
  if (
    !alive ||
    paused ||
    reloading ||
    ammo === 12 ||
    reserve <= 0
  ) return;

  reloading = true;
  hud();
  sound("reload");

  const id = session;

  setTimeout(() => {
    if (id !== session || !alive) return;

    const n = Math.min(12 - ammo, reserve);

    ammo += n;
    reserve -= n;
    reloading = false;

    hud();
  }, 1150);
}

// ============================================================
// DISPARO ORIGINAL
// ============================================================

function shoot() {
  if (!alive || paused || reloading) return;

  const now = performance.now();

  if (now - lastShot < 235) return;

  if (ammo <= 0) {
    reload();
    return;
  }

  lastShot = now;
  ammo--;

  recoil = .13;
  flash.intensity = 8;

  sound("shot");

  ray.setFromCamera(new T.Vector2(0, 0), camera);

  const hits = ray.intersectObjects(
    zombies.flatMap(z => z.hit),
    false
  );

  if (hits.length && hits[0].distance < 65) {
    const target = zombies.find(z =>
      z.hit.includes(hits[0].object)
    );

    if (target) {
      target.hp -= hits[0].object.userData.head ? 3 : 1;

      if ($("hitmark")) {
        $("hitmark").style.opacity = 1;

        setTimeout(() => {
          $("hitmark").style.opacity = 0;
        }, 90);
      }

      if (target.hp <= 0) {
        scene.remove(target.actor);
        target.mixer?.stopAllAction();

        zombies.splice(zombies.indexOf(target), 1);
        kills++;

        sound("zombie");
      }
    }
  }

  hud();

  if (ammo === 0 && reserve > 0) {
    setTimeout(() => {
      if (alive && !reloading && ammo === 0) {
        reload();
      }
    }, 250);
  }
}

// ============================================================
// MENÚ ORIGINAL
// ============================================================

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

function start() {
  session++;

  for (const z of zombies) {
    scene.remove(z.actor);
    z.mixer?.stopAllAction();
  }

  zombies.length = 0;

  hp = 100;
  ammo = 12;
  reserve = 96;
  wave = 0;
  kills = 0;

  yaw = 0;
  pitch = 0;
  vy = 0;
  grounded = true;

  reloading = false;
  alive = true;
  paused = false;
  shootHeld = false;

  camera.position.set(0, 1.7, 0);
  $("hud")?.classList.remove("hidden");

  newWave();
  hideMenu();
  hud();

  startAmbience();

  renderer.domElement.requestPointerLock?.();
}

function die() {
  sound("death");
  stopAmbience();

  alive = false;
  paused = false;
  shootHeld = false;

  document.exitPointerLock?.();
  showMenu();

  const sub = $("menu")?.querySelector(".subtitle");

  if (sub) {
    sub.textContent =
      `HAS CAÍDO · OLEADA ${wave} · ${kills} BAJAS`;
  }

  if ($("continue")) {
    $("continue").textContent = "▶ REINTENTAR";
  }
}

$("new").onclick = start;

$("continue").onclick = () => {
  if (!alive) {
    start();
  } else {
    hideMenu();
    renderer.domElement.requestPointerLock?.();
  }
};

$("options").onclick = () => panel("options");
$("credits").onclick = () => panel("credits");

$("load").onclick = () => {
  panel("load");

  const saves = $("saves");
  if (!saves) return;

  saves.innerHTML = "";

  let data;

  try {
    data = JSON.parse(
      localStorage.getItem("deadzone-save")
    );
  } catch (e) {}

  const b = document.createElement("button");

  b.textContent = data
    ? `CARGAR · OLEADA ${data.wave}`
    : "SIN PARTIDAS GUARDADAS";

  b.disabled = !data;

  b.onclick = () => {
    start();

    hp = data.hp;
    ammo = data.ammo;
    reserve = data.reserve;
    wave = data.wave;
    kills = data.kills;

    camera.position.set(data.x, 1.7, data.z);
    remaining = 4 + wave * 3;

    hud();
  };

  saves.appendChild(b);
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

  if (ambience) {
    ambience.volume = volume * .25;
  }

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

  panel("main");
};

// ============================================================
// CONTROLES ORIGINALES
// ============================================================

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

  if (e.code === "KeyP" && alive) {
    try {
      localStorage.setItem(
        "deadzone-save",
        JSON.stringify({
          hp,
          ammo,
          reserve,
          wave,
          kills,
          x: camera.position.x,
          z: camera.position.z
        })
      );

      announce("PARTIDA GUARDADA");
    } catch (err) {}
  }

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
    if (!alive || e.button !== 0) return;

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

document.addEventListener("mouseup", () => {
  shootHeld = false;
});

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
    } else {
      paused = true;
      shootHeld = false;
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
  shootHeld = false;

  Object.keys(keys).forEach(k => {
    keys[k] = false;
  });
});

// ============================================================
// CARGA DE RECURSOS
// IMPORTANTE: ZOMBIS ANTES QUE EL COCHE 4K
// ============================================================

async function loadAssets() {
  let files = [];

  try {
    const r = await fetch(
      "https://api.github.com/repos/FliickzzzZ/Modelos-3d-Juego-Chromebook/git/trees/main?recursive=1"
    );

    if (r.ok) {
      files = (await r.json()).tree.filter(
        f => f.type === "blob"
      );
    }
  } catch (e) {
    console.warn("Índice no disponible", e);
  }

  findSounds(files);

  if (alive) startAmbience();

  const find = re =>
    files.find(f => re.test(f.path))?.path;

  const pistol =
    find(/9_mm\.glb$/i) ||
    "Armas 3D/pistola/9_mm.glb";

  const carPath =
    find(/covered_car_4k\.glb$/i) ||
    "Armas 3D/coche/covered_car_4k.glb";

  const zombiePaths = files
    .filter(f => /zombie_[124]\.glb$/i.test(f.path))
    .sort((a, b) => a.size - b.size)
    .map(f => f.path);

  if (!zombiePaths.length) {
    zombiePaths.push(
      "Zombies/zombie_1.glb",
      "Zombies/zombie_2.glb"
    );
  }

  // 1. PISTOLA
  try {
    assets.gun = await load(pistol);
    installGun(assets.gun);

    console.log(
      "Pistola real cargada. F7 para girarla"
    );
  } catch (e) {
    console.warn("Pistola básica", e);
  }

  // 2. ZOMBIS PRIMERO
  for (const p of zombiePaths.slice(0, 2)) {
    try {
      const asset = await load(p);
      assets.zombies.push(asset);

      console.log(
        "Zombi cargado:",
        p,
        "Animaciones:",
        asset.animations.map(a => a.name)
      );
    } catch (e) {
      console.warn("Zombi no disponible", p, e);
    }
  }

  // Reemplazar zombis básicos que ya existan.
  if (alive && assets.zombies.length) {
    for (const z of [...zombies]) {
      const x = z.actor.position.x;
      const zpos = z.actor.position.z;
      const h = z.hp;

      scene.remove(z.actor);
      z.mixer?.stopAllAction();

      const index = zombies.indexOf(z);
      if (index !== -1) zombies.splice(index, 1);

      const replacement = spawnZombie(x, zpos);

      if (replacement) {
        replacement.hp = h;
      }
    }
  }

  // 3. COCHE PESADO AL FINAL
  try {
    assets.car = await load(carPath);

    for (const c of cars.slice(0, 3)) {
      const fitted = fit(
        copy(assets.car),
        1.5,
        2.1,
        4.3
      );

      c.g.add(fitted);
      c.low.visible = false;
    }

    console.log("Coches reales cargados");
  } catch (e) {
    console.warn("Coches básicos", e);
  }

  console.log("DEAD ZONE V5: recursos preparados");
}

// ============================================================
// BUCLE PRINCIPAL
// ============================================================

let fpsCount = 0;
let fpsTimer = 0;

function frame() {
  requestAnimationFrame(frame);

  const dt = Math.min(clock.getDelta(), .05);

  if (alive && !paused) {
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

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

    if (!blocked(
      camera.position.x + dx,
      camera.position.z
    )) {
      camera.position.x += dx;
    }

    if (!blocked(
      camera.position.x,
      camera.position.z + dz
    )) {
      camera.position.z += dz;
    }

    vy -= 15 * dt;
    camera.position.y += vy * dt;

    const floor = crouch ? 1.15 : 1.7;

    if (camera.position.y <= floor) {
      camera.position.y = floor;
      vy = 0;
      grounded = true;
    }

    if ((f || s) && grounded) {
      stepWait -= dt;

      if (stepWait <= 0) {
        sound("step");
        stepWait = keys.ShiftLeft ? .32 : .48;
      }
    }

    // ========================================================
    // GENERACIÓN SEGURA DE ZOMBIS
    // ========================================================

    spawnWait -= dt;

    if (remaining > 0 && spawnWait <= 0) {
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
      remaining === 0 &&
      zombies.length === 0
    ) {
      between += dt;

      if (between > 2) {
        newWave();
      }
    } else {
      between = 0;
    }

    // ========================================================
    // ZOMBIS: NAVEGACIÓN + ANIMACIÓN
    // ========================================================

    for (const z of [...zombies]) {
      // El movimiento calcula una ruta que rodea edificios.
      const moved = moveZombie(z, dt);

      // Si el zombi se retiró por estar inaccesible,
      // no continuamos actualizándolo.
      if (!zombies.includes(z)) continue;

      // La animación vuelve a avanzar en cada frame.
      z.t += dt * (moved > .0005 ? 7 : 2);

      updateZombieAnimation(z, dt, moved);

      const dx =
        camera.position.x -
        z.actor.position.x;

      const dz =
        camera.position.z -
        z.actor.position.z;

      const dist = Math.hypot(dx, dz);

      z.attack -= dt;
      z.groan -= dt;

      if (z.groan <= 0 && dist < 15) {
        sound("zombie");
        z.groan = 5 + Math.random() * 5;
      }

      // ATAQUE ORIGINAL
      if (dist < 1.2 && z.attack <= 0) {
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

    // DISPARO AUTOMÁTICO ORIGINAL
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

    gunAnchor.position.set(
      .32,
      -.28,
      -.53 + recoil
    );

    flash.intensity = Math.max(
      0,
      flash.intensity - dt * 120
    );
  }

  // FPS ORIGINAL
  fpsCount++;
  fpsTimer += dt;

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

  renderer.render(scene, camera);
}

// ============================================================
// AJUSTE DE PANTALLA ORIGINAL
// ============================================================

window.addEventListener("resize", () => {
  const w = Math.max(1, root.clientWidth);
  const h = Math.max(1, root.clientHeight);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ============================================================
// INICIO ORIGINAL
// ============================================================

hud();
frame();
loadAssets().catch(console.error);

console.log("DEAD ZONE V5 INICIADO");

})();
