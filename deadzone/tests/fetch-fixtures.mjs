import fs from 'node:fs/promises';
const dir=new URL('./fixtures/',import.meta.url);await fs.mkdir(dir,{recursive:true});
const base='https://cdn.jsdelivr.net/gh/FliickzzzZ/Modelos-3d-Juego-Chromebook@main/';
const files={'z1.glb':base+'Zombies/zombie_1.glb','z2.glb':base+'Zombies/zombie_2.glb','soldier.glb':'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Soldier.glb'};
for(const[name,url]of Object.entries(files)){const file=new URL(name,dir);try{await fs.access(file);}catch{const r=await fetch(url,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error(url+': '+r.status);await fs.writeFile(file,Buffer.from(await r.arrayBuffer()));}console.log('Fixture ready:',name);}
