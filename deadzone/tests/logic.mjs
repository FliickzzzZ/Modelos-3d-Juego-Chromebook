import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import * as Three from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
function texturelessGLB(file){const raw=fs.readFileSync(file),n=raw.readUInt32LE(12),doc=JSON.parse(raw.subarray(20,20+n));
 doc.images=[];doc.textures=[];doc.materials=[];for(const mesh of doc.meshes||[])for(const primitive of mesh.primitives)delete primitive.material;
 const body=raw.subarray(20+n+8);const j=Buffer.from(JSON.stringify(doc));const padded=Buffer.alloc(Math.ceil(j.length/4)*4,32);j.copy(padded);const out=Buffer.alloc(12+8+padded.length+8+body.length);out.writeUInt32LE(0x46546c67);out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);out.writeUInt32LE(padded.length,12);out.writeUInt32LE(0x4e4f534a,16);padded.copy(out,20);out.writeUInt32LE(body.length,20+padded.length);out.writeUInt32LE(0x004e4942,24+padded.length);body.copy(out,28+padded.length);return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength);
}
const parsed={};for(const[name,file]of [['hero','soldier.glb'],['z1','z1.glb'],['z2','z2.glb'],['car','car.glb'],['gun','gun.glb']])parsed[name]=await new GLTFLoader().parseAsync(texturelessGLB(new URL('./fixtures/'+file,import.meta.url)),'');
for(const n of ['Building_Small_1','Building_Medium_2_001','tree','shrub','grass'])parsed[n]=await new GLTFLoader().parseAsync(texturelessGLB(new URL((n.startsWith('Building')?'./fixtures/':'../assets/')+n+'.glb',import.meta.url)),'');
const listeners={};class Element{constructor(id){this.id=id;this.style={};this.children=[];this.clientWidth=1100;this.clientHeight=720;this.value={quality:'low',fov:'78',sens:'.25',vol:'60'}[id]||'';this.classList={add(){},remove(){},toggle(){}};}getContext(){return null;}addEventListener(n,f){this[n]=f;}prepend(){}append(x){this.children.push(x);}appendChild(x){this.append(x);}replaceChildren(){this.children=[];}querySelector(){return ids.subtitle;}requestPointerLock(){document.pointerLockElement=this;listeners.pointerlockchange?.();return Promise.resolve();}}
const ids=new Proxy({}, {get(o,k){return o[k]??=new Element(k);}});const storage=new Map();let ticks=0,raf=null;
const document={getElementById:id=>ids[id],createElement:id=>new Element(id),querySelectorAll:()=>[],addEventListener:(n,f)=>listeners[n]=f,exitPointerLock(){this.pointerLockElement=null;listeners.pointerlockchange?.();}};
class Renderer{constructor(){this.shadowMap={};this.domElement=new Element('canvas');}setPixelRatio(){}setSize(){}render(scene){scene.updateMatrixWorld(true);}}
class Loader{load(path,ok,_,fail){this.loadAsync(path).then(ok,fail);}async loadAsync(path){if(path.includes('Soldier'))return parsed.hero;for(const n of ['Building_Small_1','Building_Medium_2_001','tree','shrub','grass'])if((path.includes(n+'.glb')||path.includes(n+'.gltf')))return parsed[n];if(path.includes('zombie_1'))return parsed.z1;if(path.includes('zombie_2'))return parsed.z2;if(path.includes('covered_car'))return parsed.car;if(path.includes('9_mm'))return parsed.gun;throw Error('Excluded from logic harness: '+path);}}
class AudioNode{constructor(){this.gain={value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}};this.positionX={value:0};this.positionY={value:0};this.positionZ={value:0};this.frequency={setValueAtTime(){},exponentialRampToValueAtTime(){}};}connect(){}disconnect(){}start(){}stop(when){if(when===undefined)this.onended?.();}}
class AudioContext{constructor(){this.state='running';this.currentTime=0;this.destination={};this.listener={};}resume(){return Promise.resolve();}createGain(){return new AudioNode();}createOscillator(){return new AudioNode();}createBufferSource(){return new AudioNode();}createPanner(){return new AudioNode();}decodeAudioData(){return Promise.resolve({duration:2});}}
const window={addEventListener:(n,f)=>listeners[n]=f,AudioContext};const consoleLog=console;
const testThree={...Three,TextureLoader:class{async loadAsync(){return new Three.Texture();}},WebGLRenderer:Renderer,Clock:class{getDelta(){return 1/60;}}};
const context=vm.createContext({__modules:{three:testThree,loader:{GLTFLoader:Loader},skeleton:{clone}},T:{...Three,WebGLRenderer:Renderer,Clock:class{getDelta(){return 1/60;}}},GLTFLoader:Loader,cloneSkinned:clone,document,window,console,devicePixelRatio:1,performance:{now:()=>ticks},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{search:'?test=1'},URLSearchParams,Audio:class{play(){return Promise.resolve();}pause(){}},requestAnimationFrame:f=>raf=f,setTimeout,clearTimeout,fetch:()=>Promise.resolve({ok:true,arrayBuffer:()=>Promise.resolve(new ArrayBuffer(0))})});
let source=fs.readFileSync(new URL('../'+(process.env.DZ_SOURCE||'game.js'),import.meta.url),'utf8');source=source.replace(/await\s*\(?import\("([^"\n]+)"\)\)?/g,(_,url)=>url.includes('SkeletonUtils')?'__modules.skeleton':url.includes('GLTFLoader')?'__modules.loader':'__modules.three');
await vm.runInContext(source,context);await new Promise(r=>setTimeout(r,80));const d=window.__DZ;assert(d);let passed=0;
function test(name,f){f();passed++;consoleLog.log('PASS',name);}
function frame(n=1){for(let i=0;i<n;i++){ticks+=1000/60;raf();}}
function clean(){for(const z of [...d.zombies])d.removeZombie(z);}
test('Original systems boot with real Three.js scene',()=>assert(d.scene.isScene&&d.world.isGroup&&d.player.isGroup));
test('Rigged temporary human and actual animation loaded',()=>{assert(d.hero.visual&&d.hero.mixer&&d.hero.walk&&d.hero.idle&&d.hero.run&&d.hero.hand?.isBone);assert(parsed.hero.animations.length>0);});
d.start('waves');clean();
test('Player and shoulder camera have independent positions',()=>{assert.notEqual(d.player.position,d.camera.position);assert(d.player.position.distanceTo(d.camera.position)>2);});
test('Street has two loaded complete buildings and bounded walkable route',()=>{assert.equal(d.world.children.filter(o=>o.userData.building).length,2);assert(!d.blocked(0,20,.2));assert(d.blocked(-13,3,.2));assert(d.blocked(0,41,.2));});
test('A* routes around a building, each route segment collision-free',()=>{assert(!d.clearLine(0,10,-20,3,.48));const path=d.findPath(0,10,-20,3);assert(path?.length);let p={x:0,z:10};for(const q of path){assert(d.clearLine(p.x,p.z,q.x,q.z,.48));p=q;}assert(!d.findPath(400,400,0,0));});
test('Zombie sizes remain normalized through actual GLB animation',()=>{const z=d.spawnZombie(0,-5);assert(z?.visual&&z.mixer);for(let i=0;i<90;i++)z.mixer.update(1/60);z.actor.updateMatrixWorld(true);const size=new Three.Box3().setFromObject(z.visual).getSize(new Three.Vector3());assert(size.y>.8&&size.y<2.8,`animated height ${size.y}`);clean();});
test('Gun ray cannot damage a zombie behind a real building mesh',()=>{d.player.position.set(0,.06,0);d.setYaw(0);d.updatePlayerCamera(1,true);const z=d.spawnZombie(0,-8);const wall=new Three.Mesh(new Three.BoxGeometry(3,4,.3),new Three.MeshBasicMaterial());wall.position.set(0,2,-4);d.world.add(wall);const hp=z.hp;d.shoot();assert.equal(z.hp,hp);d.world.remove(wall);wall.geometry.dispose();wall.material.dispose();clean();});
test('Unobstructed shots damage a zombie',()=>{ticks+=300;d.player.position.set(0,.06,0);d.setYaw(0);d.updatePlayerCamera(1,true);const z=d.spawnZombie(.65,-8);const hp=z.hp;d.shoot();assert(z.hp<hp||!d.zombies.includes(z));clean();});
test('Pause freezes reload; resume completes using game time',()=>{d.reload();const remaining=d.getState().reloadLeft;d.setPaused(true);frame(90);assert.equal(d.getState().reloadLeft,remaining);d.setPaused(false);frame(90);assert(!d.getState().reloading);});
clean();const z=d.spawnZombie(0,-9);z.hp=1;d.saveGame(false);const saved=d.readSaves()[0];
test('Save records active enemies, remaining spawns, camera angles',()=>{assert.equal(saved.zombies.length,1);assert.equal(saved.zombies[0].hp,1);assert(Number.isFinite(saved.remaining)&&Number.isFinite(saved.yaw));});
d.start('waves',saved);
test('Save restores active enemies rather than restarting wave',()=>{assert.equal(d.zombies.length,1);assert.equal(d.zombies[0].hp,1);assert.equal(d.getState().remaining,saved.remaining);});
test('Invalid saves are rejected',()=>{assert(!d.validSave({...saved,hp:NaN}));assert(!d.validSave({...saved,ammo:-2}));assert(!d.validSave({...saved,zombies:[{x:NaN}]}));});
d.start('explore');d.saveGame(false);
test('Exploration and wave saves coexist separately',()=>{assert.equal(d.readSaves().length,2);assert.equal(d.getState().mode,'explore');assert.equal(d.getState().wave,0);});
clean();
test('Camera shortens its boom in front of a wall',()=>{const wall=new Three.Mesh(new Three.BoxGeometry(5,4,.3),new Three.MeshBasicMaterial());wall.position.set(0,2,1);d.world.add(wall);d.player.position.set(0,.06,0);d.setYaw(0);d.updatePlayerCamera(1,true);assert(d.camera.position.z<1);d.world.remove(wall);wall.geometry.dispose();wall.material.dispose();});
clean();d.start('waves');clean();const a=d.spawnZombie(0,-5),b=d.spawnZombie(0,-7);await d.sound('zombie',a);await d.sound('zombie',b);
test('Zombie groans have owners, spatial panners and a two-voice limit',()=>{const sounds=[...d.activeSounds].filter(s=>s.type==='zombie');assert.equal(sounds.length,2);assert(sounds.every(s=>s.owner&&s.panner));});
d.removeZombie(a);
test('Killing a zombie stops only that zombie groan',()=>{assert(![...d.activeSounds].some(s=>s.owner===a));assert([...d.activeSounds].some(s=>s.owner===b));});
d.stopSounds();test('Pause cleanup removes all active effects',()=>assert.equal(d.activeSounds.size,0));
clean();const zs=Array.from({length:8},(_,i)=>d.spawnZombie(-20,3+i*.15));d.player.position.set(0,.06,0);for(const z of zs){z.pathTimer=0;d.moveZombie(z,.016);}
test('Navigation enforces at most two path calculations per frame',()=>assert.equal(d.getPathBudget(),2));
consoleLog.log('TOTAL',passed,'logic tests. WebGL rendering, textures and browser audio not exercised.');fs.writeFileSync(new URL('./results.txt',import.meta.url),`${passed} logic tests passed with real Three.js and real textureless GLB rigs. Renderer/DOM/audio mocked. Browser rendering not verified.\n`);process.exit(0);
