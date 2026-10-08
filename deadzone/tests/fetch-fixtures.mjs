import fs from 'node:fs/promises';
const dir=new URL('./fixtures/',import.meta.url);await fs.mkdir(dir,{recursive:true});
const base='https://cdn.jsdelivr.net/gh/FliickzzzZ/Modelos-3d-Juego-Chromebook@a3b78f98c0684087175058e2cd899880dc7fcef3/';
const files={'z1.glb':base+'Zombies/zombie_1.glb','z2.glb':base+'Zombies/zombie_2.glb','car.glb':base+'Armas%203D/coche/covered_car_4k.glb','gun.glb':base+'Armas%203D/pistola/9_mm.glb','soldier.glb':'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Soldier.glb'};
async function fetchBytes(url){const r=await fetch(url,{signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error(url+': '+r.status);return Buffer.from(await r.arrayBuffer());}
for(const[name,url]of Object.entries(files)){const file=new URL(name,dir);try{await fs.access(file);}catch{await fs.writeFile(file,await fetchBytes(url));}console.log('Fixture ready:',name);}
for(const name of ['Building_Small_1','Building_Medium_2_001']){
 const file=new URL(name+'.glb',dir);try{await fs.access(file);continue;}catch{}
 const city=base+'Ciudad/Exports/glTF%20(Godot)/',doc=JSON.parse((await fetchBytes(city+name+'.gltf')).toString());
 const binary=await fetchBytes(city+name+'.bin');doc.buffers=[{byteLength:binary.length}];doc.images=[];doc.textures=[];doc.materials=[];for(const m of doc.meshes)for(const p of m.primitives)delete p.material;
 let json=Buffer.from(JSON.stringify(doc));const j=Buffer.alloc(Math.ceil(json.length/4)*4,32);json.copy(j);const b=Buffer.alloc(Math.ceil(binary.length/4)*4);binary.copy(b);
 const h=Buffer.alloc(20);h.writeUInt32LE(0x46546c67);h.writeUInt32LE(2,4);h.writeUInt32LE(28+j.length+b.length,8);h.writeUInt32LE(j.length,12);h.writeUInt32LE(0x4e4f534a,16);const bh=Buffer.alloc(8);bh.writeUInt32LE(b.length);bh.writeUInt32LE(0x004e4942,4);await fs.writeFile(file,Buffer.concat([h,j,bh,b]));console.log('Geometry-only fixture ready:',name);
}
