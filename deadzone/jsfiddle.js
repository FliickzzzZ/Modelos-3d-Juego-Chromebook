(async()=>{"use strict"
;const t=await(import("https://esm.sh/three@0.160.1")),{GLTFLoader:e}=await(import("https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js?deps=three@0.160.1")),{clone:o}=await(import("https://esm.sh/three@0.160.1/examples/jsm/utils/SkeletonUtils.js?deps=three@0.160.1")),n=t=>document.getElementById(t),i=n("game")
;if(!i)throw Error("Falta #game en el HTML");const a=new t.Scene,s=new t.Group;a.add(s);const r=new t.Group;a.add(r);const c={position:r.position,
mode:"explore",moving:!1};a.background=new t.Color(2437691),a.fog=new t.FogExp2(2437691,.012)
;const l=new t.PerspectiveCamera(78,Math.max(1,i.clientWidth)/Math.max(1,i.clientHeight),.05,200);l.position.set(0,1.7,0);const d=new t.WebGLRenderer({
antialias:!1,powerPreference:"low-power"});d.setPixelRatio(Math.min(devicePixelRatio,1)),d.setSize(Math.max(1,i.clientWidth),Math.max(1,i.clientHeight)),
d.outputColorSpace=t.SRGBColorSpace,d.toneMapping=t.ACESFilmicToneMapping,d.toneMappingExposure=1.4,i.prepend(d.domElement),a.add(l),
a.add(new t.HemisphereLight(12637413,3421236,2.6));const u=new t.DirectionalLight(16765604,2);u.position.set(-35,60,-20),a.add(u)
;const h=(e,o=0)=>new t.MeshStandardMaterial({color:e,roughness:.85,metalness:o}),p=new t.BoxGeometry(1,1,1),m={road:h(2763824),ground:h(5395279),
walk:h(7894900),line:h(13288362),glass:h(1516587),dark:h(2106150),skin:h(7634529),cloth:h(5264986)};function f(e,o,n,i,a,s,r,c){const l=new t.Mesh(p,c)
;return l.position.set(o,n,i),l.scale.set(a,s,r),e.add(l),l}const g=[],x=(t,e,o,n,i=3)=>g.push({x:t,z:e,w:o,d:n,h:i});function w(t,e,o=.38){
return Math.abs(t)>88-o||Math.abs(e)>88-o||g.some(n=>Math.abs(t-n.x)<n.w/2+o&&Math.abs(e-n.z)<n.d/2+o)}function v(t,e,o,n,i=.48){
const a=Math.hypot(o-t,n-e),s=Math.max(1,Math.ceil(a/.6));for(let a=1;a<=s;a++){const r=a/s;if(w(t+(o-t)*r,e+(n-e)*r,i))return!1}return!0}
f(s,0,-.18,0,190,.36,190,m.ground);for(let t=-2;t<=2;t++){const e=30*t;f(s,e,.02,0,11,.05,190,m.road),f(s,0,.025,e,190,.05,11,m.road)
;for(let t=-85;t<85;t+=9)f(s,e,.058,t,.13,.01,3,m.line),f(s,t,.058,e,3,.01,.13,m.line)}const y=[6447455,5725278,7432546,5002843].map(t=>h(t)),M=[]
;function b(t,e){for(let o=-2;o<2;o++)for(let n=-2;n<2;n++)if(Math.abs(t-(30*o+15))<9.5&&Math.abs(e-(30*n+15))<9.5)return.26;return.06}function A(e,o,n,i,a){
const r=new t.Group;if(r.position.set(e,0,o),s.add(r),r.userData.building=!0,r.userData.height=a,
Math.abs(e-10.1)<.01&&Math.abs(o-10.1)<.01)return r.userData.building=!1,void function(e,o,n,i,a){function s(t,i,a,s){const r=f(e,t,1.8,i,a,3.2,s,y[0]);M.push({
g:e,mesh:r,lx:t,lz:i,ww:a,dd:s}),x(o+t,n+i,a,s,3.4)}s(0,-a/2,i,.25),s(0,a/2,i,.25),s(i/2,0,.25,a),s(-i/2,-2.35,.25,2.5),s(-i/2,2.35,.25,2.5),
f(e,-i/2,3,0,.25,.8,2.2,m.dark),f(e,0,3.55,0,i+.2,.25,a+.2,m.dark),f(e,1,.65,1,2,.7,.8,m.cloth),x(o+1,n+1,2,.8,1),f(e,-1,.7,-1,1.2,.85,.65,m.dark),
x(o-1,n-1,1.2,.65,1.2);const r=new t.PointLight(16760693,2.5,9);r.position.set(0,2.6,0),e.add(r)}(r,e,o,n,i)
;f(r,0,a/2,0,n,a,i,y[Math.floor(Math.random()*y.length)]),f(r,0,a+.12,0,n+.4,.24,i+.4,m.dark)
;for(let t=2;t<a-1;t+=3)for(let e=-n/2+1.3;e<n/2-.4;e+=2.5)f(r,e,t,i/2+.03,1.1,1.45,.05,m.glass),f(r,e,t,-i/2-.03,1.1,1.45,.05,m.glass);x(e,o,n,i,a)}
for(let t=-2;t<2;t++)for(let e=-2;e<2;e++){const o=30*t+15,n=30*e+15;f(s,o,.13,n,19,.26,19,m.walk)
;for(const t of[-1,1])for(const e of[-1,1])A(o+4.9*t,n+4.9*e,7.2,7.2,9+Math.floor(13*Math.random()))}const z=[];function k(e,o,n){const i=new t.Group
;i.position.set(e,0,o),i.rotation.y=n,s.add(i);const a=new t.Group;i.add(a);const r=h([7483692,5003368,6120030][Math.floor(3*Math.random())])
;f(a,0,.62,0,1.85,.6,3.8,r),f(a,0,1.16,-.15,1.6,.6,2,r);for(const e of[-1,1])for(const o of[-1,1]){
const n=new t.Mesh(new t.CylinderGeometry(.36,.36,.19,10),m.dark);n.rotation.z=Math.PI/2,n.position.set(.98*e,.36,1.25*o),a.add(n)}z.push({g:i,low:a}),
x(e,o,4.3,4.3)}for(let t=0;t<15;t++){const e=[-60,-30,0,30,60][t%5],o=55*Math.floor(t/5)-70+8*Math.random();Math.hypot(e,o)>12&&k(e,o,t%2?0:Math.PI/2)}
const E=-86,L=Math.round(86)+1,S=.48,C=new Uint8Array(L*L);function D(t,e){return e*L+t}function P(t,e){return{x:E+2*t,z:E+2*e}}function T(){let t=0
;for(let e=0;e<L;e++)for(let o=0;o<L;o++){const n=P(o,e),i=!w(n.x,n.z,S);C[D(o,e)]=i?1:0,i&&t++}console.log("Navegación lista:",t,"casillas")}function O(t,e){
return function(t,e){return t>=0&&e>=0&&t<L&&e<L}(t,e)&&1===C[D(t,e)]}function N(t,e){const o=function(t,e){return{ix:Math.round((t-E)/2),iz:Math.round((e-E)/2)
}}(t,e);if(O(o.ix,o.iz))return o;let n=null,i=1/0;for(let a=1;a<=7;a++){for(let s=-a;s<=a;s++)for(let r=-a;r<=a;r++){const a=o.ix+r,c=o.iz+s;if(!O(a,c))continue
;const l=P(a,c),d=Math.hypot(l.x-t,l.z-e);d<i&&(i=d,n={ix:a,iz:c})}if(n)return n}return null}T();class I{constructor(){this.a=[]}push(t){const e=this.a
;e.push(t);let o=e.length-1;for(;o>0;){const n=o-1>>1;if(e[n].f<=t.f)break;e[o]=e[n],o=n}e[o]=t}pop(){const t=this.a;if(!t.length)return null
;const e=t[0],o=t.pop();if(!t.length)return e;let n=0;for(;;){const e=2*n+1,i=e+1;if(e>=t.length)break;let a=e;if(i<t.length&&t[i].f<t[e].f&&(a=i),
t[a].f>=o.f)break;t[n]=t[a],n=a}return t[n]=o,e}get length(){return this.a.length}}function R(t,e,o,n){const i=N(t,e),a=N(o,n);if(!i||!a)return null
;const s=D(i.ix,i.iz),r=D(a.ix,a.iz);if(s===r)return v(t,e,o,n,S)?[{x:o,z:n}]:null;const c=L*L,l=new Float32Array(c),d=new Int32Array(c),u=new Uint8Array(c)
;l.fill(1/0),d.fill(-1);const h=new I;l[s]=0;const p=(t,e)=>Math.abs(t-a.ix)+Math.abs(e-a.iz);h.push({id:s,ix:i.ix,iz:i.iz,g:0,f:p(i.ix,i.iz)})
;const m=[[1,0],[-1,0],[0,1],[0,-1]];let f=0,g=!1;for(;h.length&&f<4500;){f++;const t=h.pop();if(!u[t.id]&&!(t.g>l[t.id])){if(u[t.id]=1,t.id===r){g=!0;break}
for(const[e,o]of m){const n=t.ix+e,i=t.iz+o;if(!O(n,i))continue;const a=D(n,i);if(u[a])continue;const s=P(t.ix,t.iz),r=P(n,i);if(!v(s.x,s.z,r.x,r.z,S))continue
;const c=l[t.id]+1;c>=l[a]||(l[a]=c,d[a]=t.id,h.push({id:a,ix:n,iz:i,g:c,f:c+p(n,i)}))}}}if(!g)return null;const x=[];let w=r;for(;w!==s&&w>=0;){
const t=w%L,e=Math.floor(w/L);if(x.push(P(t,e)),w=d[w],x.length>c)return null}x.reverse();const y=[];let M=t,b=e,A=0;for(;A<x.length;){let t=A
;for(let e=A+1;e<x.length&&v(M,b,x[e].x,x[e].z,S);e++)t=e;const e=x[t];y.push(e),M=e.x,b=e.z,A=t+1}return y}function G(){const t=r.position.x,e=r.position.z
;for(let o=0;o<100;o++){const o=Math.random()*Math.PI*2,n=13+10*Math.random(),i=t+Math.sin(o)*n,a=e+Math.cos(o)*n;if(w(i,a,.65))continue
;if(pt.some(t=>Math.hypot(t.actor.position.x-i,t.actor.position.z-a)<1.5))continue;if(v(i,a,t,e,.48))return{x:i,z:a};if(R(i,a,t,e))return{x:i,z:a}}
const o=N(t+12,e+12);if(o){const t=P(o.ix,o.iz);if(!w(t.x,t.z,.65))return t}return null}
const F=new e,V=t=>"https://cdn.jsdelivr.net/gh/FliickzzzZ/Modelos-3d-Juego-Chromebook@main/"+t.split("/").map(encodeURIComponent).join("/"),B=t=>new Promise((e,o)=>F.load(V(t),e,void 0,o)),j={
zombies:[],gun:null,car:null};function U(t){return o(t.scene)}function _(e,o,n,i){const a=new t.Group,s=new t.Group;a.add(s),s.add(e),e.updateMatrixWorld(!0)
;const r=(new t.Box3).setFromObject(e),c=r.getSize(new t.Vector3);if(!Number.isFinite(c.y)||c.y<1e-5)throw Error("Dimensiones GLB inválidas");let l=o/c.y
;n&&c.x&&(l=Math.min(l,n/c.x)),i&&c.z&&(l=Math.min(l,i/c.z)),a.scale.setScalar(l);const d=r.getCenter(new t.Vector3);return s.position.set(-d.x,-r.min.y,-d.z),
a.updateMatrixWorld(!0),a}function q(e){return(e.animations||[]).map(e=>new t.AnimationClip(e.name,e.duration,e.tracks.map(t=>{
const e=t.clone(),o=e.name.replace(/\.(position|quaternion|scale)$/,"")
;if(/\.position$/.test(e.name)&&/hips|pelvis|root|armature/i.test(o))for(let t=0;t<e.values.length;t+=3)e.values[t]=e.values[0],e.values[t+2]=e.values[2]
;return e})))}const Z={};let W=null,K=.6,J=null;const X=new Set,H=new Map;function Y(){W??=new(window.AudioContext||window.webkitAudioContext),
W.resume().catch(()=>{}),nt()}function $(t){for(const e of[...X])if(!t||e.owner===t){try{e.source.stop()}catch{}e.source.disconnect(),e.gain.disconnect(),
e.panner?.disconnect(),X.delete(e)}}function Q(t){if(!W||"running"!==W.state||"zombie"===t)return;const e={shot:[190,48,.12],reload:[560,180,.12],
hurt:[140,60,.2],death:[130,40,.25],wave:[420,700,.25],step:[85,45,.055]}[t];if(!e)return;const o=W.createOscillator(),n=W.createGain(),i=W.currentTime
;o.type="wave"===t?"triangle":"sawtooth",o.frequency.setValueAtTime(e[0],i),o.frequency.exponentialRampToValueAtTime(e[1],i+e[2]),
n.gain.setValueAtTime(.04*K,i),n.gain.exponentialRampToValueAtTime(.001,i+e[2]),o.connect(n),n.connect(W.destination);const a={source:o,gain:n,type:t};X.add(a),
o.onended=()=>{X.delete(a),o.disconnect(),n.disconnect()},o.start(),o.stop(i+e[2])}async function tt(t,e=null){if(!W||"running"!==W.state||kt)return
;if("zombie"===t&&([...X].filter(t=>"zombie"===t.type).length>=2||[...X].some(t=>t.owner===e)))return;const o=Z[t];if(!o?.length)return void Q(t)
;const n=Nt,i=o[Math.floor(Math.random()*o.length)];try{H.has(i)||H.set(i,fetch(i).then(t=>{if(!t.ok)throw Error(t.status);return t.arrayBuffer()
}).then(t=>W.decodeAudioData(t)));const o=await H.get(i);if(n!==Nt||kt||e&&!pt.includes(e)||!zt&&"death"!==t)return
;if("zombie"===t&&[...X].filter(t=>"zombie"===t.type).length>=2)return;const a=W.createBufferSource(),s=W.createGain();a.buffer=o;const r={zombie:.1,
zombieDeath:.12,shot:.65,reload:.45,hurt:.5,step:.18}[t]??.45;s.gain.value=K*r,a.connect(s);let c=null;e?(c=W.createPanner(),c.panningModel="equalpower",
c.distanceModel="inverse",c.refDistance=2,c.maxDistance=20,c.rolloffFactor=1.8,s.connect(c),c.connect(W.destination)):s.connect(W.destination);const l={
source:a,gain:s,panner:c,owner:e,type:t,base:r};X.add(l),a.onended=()=>{X.delete(l),a.disconnect(),s.disconnect(),c?.disconnect()},c&&et(l),a.start(),
a.stop(W.currentTime+Math.min(o.duration,"zombie"===t?2.5:"shot"===t?.4:5))}catch(e){H.delete(i),n===Nt&&!kt&&zt&&Q(t)}}function et(t){
const e=t.owner.actor.position;t.panner.positionX.value=e.x,t.panner.positionY.value=e.y+1.3,t.panner.positionZ.value=e.z}function ot(){if(!W)return
;const e=W.listener,o=l.position;if(e.positionX){e.positionX.value=o.x,e.positionY.value=o.y,e.positionZ.value=o.z
;const n=new t.Vector3(0,0,-1).applyQuaternion(l.quaternion),i=new t.Vector3(0,1,0).applyQuaternion(l.quaternion);e.forwardX.value=n.x,e.forwardY.value=n.y,
e.forwardZ.value=n.z,e.upX.value=i.x,e.upY.value=i.y,e.upZ.value=i.z}for(const t of X)t.gain.gain.value=K*(t.base??.04),t.panner&&et(t)}function nt(){
Z.ambience?.length&&(J||(J=new Audio(Z.ambience[0]),J.loop=!0),J.volume=.38*K,J.play().catch(()=>{}))}function it(){J?.pause()}!function(t){
const e=t.filter(t=>/^Sonidos\//i.test(t.path)&&/\.(wav|mp3|ogg|m4a)$/i.test(t.path)),o={shot:/gunshot|pistol|disparo/i,reload:/reload|recarg/i,
hurt:/grunt|hurt|pain/i,death:/male-scream|death/i,zombie:/zombie.*sound|groan|growl/i,zombieDeath:/zombie.*dying|zombie.*death/i,
ambience:/ambien|soundscape|atmosphere/i}
;for(const[t,n]of Object.entries(o))Z[t]=e.filter(e=>n.test(e.path)&&(!("zombie"===t||"shot"===t)||!/dying|death|reload/i.test(e.path))).slice(0,4).map(t=>V(t.path))
}([{path:"Sonidos/dragon-studio-gun-reload-2-504027.mp3"},{path:"Sonidos/dragon-studio-zombie-dying-sound-357974.mp3"},{
path:"Sonidos/dragon-studio-zombie-sound-2-357976.mp3"},{path:"Sonidos/freesound_community-grunt-1-85280.mp3"},{
path:"Sonidos/freesound_community-single-pistol-gunshot-33-37187.mp3"},{path:"Sonidos/fronbondi_skegs-amb-a-post-apocalyptic-ambient-soundscape-452826.mp3"},{
path:"Sonidos/universfield-male-scream-121085.mp3"}]);const at=new t.Group;r.add(at);const st=new t.Group;at.add(st),f(st,0,0,-.26,.19,.2,.63,h(1514012,.7)),
f(st,0,-.17,-.04,.13,.32,.17,h(2697772)),f(st,0,.09,-.48,.1,.07,.3,h(1514012,.7));const rt=new t.PointLight(16760169,0,5);rt.position.set(0,0,-.8),at.add(rt)
;let ct=null,lt=0;const dt=[[0,0,0],[0,Math.PI,0],[0,Math.PI/2,0],[0,-Math.PI/2,0],[Math.PI/2,0,0],[-Math.PI/2,0,0],[0,0,Math.PI/2],[0,0,-Math.PI/2]]
;function ut(){ct&&(ct.rotation.set(...dt[lt]),console.log("Pistola orientación",lt+1,"/",dt.length))}const ht={},pt=[],mt=new t.Clock,ft=new t.Raycaster
;let gt=100,xt=12,wt=96,vt=0,yt=0,Mt=0,bt=0,At=0,zt=!1,kt=!1,Et=!1,Lt=!1,St=0,Ct=0,Dt=0,Pt=!0,Tt=0,Ot=0,Nt=0,It=.25,Rt=0,Gt=0,Ft=0,Vt=0,Bt=!1;const jt={waves:{
title:"OLEADAS",limit:12},explore:{title:"EXPLORACIÓN · PROTOTIPO",limit:6}};function Ut(){
n("health")&&(n("health").textContent=Math.max(0,Math.ceil(gt))+" ♥"),n("ammo")&&(n("ammo").textContent=(Et?"...":xt)+" / "+wt),
n("wave")&&(n("wave").textContent=vt),n("kills")&&(n("kills").textContent=yt)}let _t;function qt(t){const e=n("announcement");e&&(e.textContent=t,
e.style.opacity=1,clearTimeout(_t),_t=setTimeout(()=>{e.style.opacity=0},1700))}function Zt(){const e=new t.Group;f(e,0,1.58,0,.4,.42,.4,m.skin),
f(e,0,1.05,0,.65,.78,.34,m.cloth);const o=[],n=[];for(const t of[-1,1])o.push(f(e,.43*t,1.07,0,.2,.7,.2,m.skin)),n.push(f(e,.17*t,.39,0,.22,.76,.25,m.cloth))
;return{g:e,arms:o,legs:n}}function Wt(e,o){if(w(e,o,.55)){const t=N(e,o);if(!t)return null;const n=P(t.ix,t.iz);if(w(e=n.x,o=n.z,.55))return null}
const n=new t.Group;n.position.set(e,b(e,o),o),a.add(n);const i=Zt();n.add(i.g);let s=null,r=null,c=null,l=null,d=null
;const u=j.zombies[Math.floor(Math.random()*j.zombies.length)];if(u)try{const e=U(u);s=_(e,1.9,0,0),n.add(s),i.g.visible=!1
;const o=q(u),a=o.find(t=>/walk|run|move|locomotion/i.test(t.name))||o.find(t=>!/idle|death|attack|hit/i.test(t.name))||null,h=o.find(t=>/idle|breath|stand/i.test(t.name))||null
;(a||h)&&(r=new t.AnimationMixer(e),a&&(c=r.clipAction(a),c.setLoop(t.LoopRepeat),c.play(),n.userData.walkCycle=a.duration||1),h&&h!==a&&(l=r.clipAction(h),
l.setLoop(t.LoopRepeat),l.play(),l.setEffectiveWeight(c?0:1))),c||(d=function(t){const e={leftLeg:null,rightLeg:null,leftArm:null,rightArm:null};t.traverse(t=>{
if(!t.isBone)return;const o=t.name.toLowerCase();!e.leftLeg&&/left.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*left|leg_l|thigh_l/i.test(o)&&(e.leftLeg=t),
!e.rightLeg&&/right.*(upleg|thigh|leg)|(?:upleg|thigh|leg).*right|leg_r|thigh_r/i.test(o)&&(e.rightLeg=t),
!e.leftArm&&/left.*(upperarm|arm)|(?:upperarm|arm).*left|arm_l/i.test(o)&&(e.leftArm=t),
!e.rightArm&&/right.*(upperarm|arm)|(?:upperarm|arm).*right|arm_r/i.test(o)&&(e.rightArm=t)});const o={}
;for(const[t,n]of Object.entries(e))n&&(o[t]=n.rotation.x);return{bones:e,base:o}}(e)),
console.log("Zombi:",u.animations?.map(t=>t.name)||[],"Caminar:",a?.name||"procedural")}catch(t){console.warn("Zombi básico",t),s=null,r=null,i.g.visible=!0}
const h=new t.MeshBasicMaterial({visible:!1}),p=new t.Mesh(new t.BoxGeometry(.5,.5,.5),h);p.position.set(0,1.72,0),p.userData.head=!0,n.add(p)
;const m=new t.Mesh(new t.BoxGeometry(.8,1.35,.65),h);m.position.set(0,.95,0),n.add(m);const f={actor:n,basic:i,visual:s,mixer:r,walkAction:c,idleAction:l,
procedural:d,hit:[p,m],hp:vt>=5?3:2,speed:Math.min(2.6,.85+.12*vt+.25*Math.random()),t:8*Math.random(),attack:0,groan:3+5*Math.random(),path:[],
pathTimer:.5*Math.random(),stuckTime:0,lastX:e,lastZ:o,pathFailed:!1};return pt.push(f),f}function Kt(t,e,o){const n=o>5e-4;if(t.mixer){if(t.walkAction){
const e=n?Math.max(.45,Math.min(1.7,t.speed/1.5)):1;t.walkAction.setEffectiveTimeScale(e),t.idleAction?(t.walkAction.setEffectiveWeight(n?1:0),
t.idleAction.setEffectiveWeight(n?0:1)):t.walkAction.setEffectiveWeight(n?1:0)}t.mixer.update(e)}if(t.procedural){
const{bones:e,base:o}=t.procedural,i=n?.42*Math.sin(t.t):0;e.leftLeg&&(e.leftLeg.rotation.x=o.leftLeg+i),e.rightLeg&&(e.rightLeg.rotation.x=o.rightLeg-i),
e.leftArm&&(e.leftArm.rotation.x=o.leftArm-.55*i),e.rightArm&&(e.rightArm.rotation.x=o.rightArm+.55*i)}
if(t.visual)t.walkAction||t.procedural||(t.visual.rotation.z=n?.04*Math.sin(t.t):0,t.visual.rotation.x=n?.025*Math.sin(.5*t.t):0);else{const e=n?Math.sin(t.t):0
;t.basic.legs[0].rotation.x=.5*e,t.basic.legs[1].rotation.x=.5*-e,t.basic.arms[0].rotation.x=-.6-.2*e,t.basic.arms[1].rotation.x=.2*e-.6}}function Jt(t,e){
const o=r.position.x,n=r.position.z,i=t.actor.position.x,a=t.actor.position.z,s=Math.hypot(o-i,n-a);if(s<=1.15)return t.path=[],t.stuckTime=0,0;let c=o,l=n
;if(v(i,a,o,n,S))t.path=[],t.pathFailed=!1;else{if(t.pathTimer-=e,t.pathTimer<=0&&Ft<2){Ft++,t.pathTimer=1+.6*Math.random();const e=R(i,a,o,n);e?(t.path=e,
t.pathFailed=!1):(t.path=[],t.pathFailed=!0)}for(;t.path.length&&Math.hypot(t.path[0].x-i,t.path[0].z-a)<.65;)t.path.shift();t.path.length&&(c=t.path[0].x,
l=t.path[0].z)}const d=c-i,u=l-a,h=Math.hypot(d,u);let p=0;if(h>.03){const o=Math.min(t.speed*e,h),n=i+d/h*o,s=a+u/h*o;let r=i,c=a;v(i,a,n,a,S)&&(r=n),
v(r,a,r,s,S)&&(c=s),r===i&&c===a&&v(i,a,n,s,S)&&(r=n,c=s),t.actor.position.x=r,t.actor.position.z=c,t.actor.position.y=b(r,c),p=Math.hypot(r-i,c-a)
;const l=p>5e-4?r-i:d,m=p>5e-4?c-a:u;let f=Math.atan2(l,m)-t.actor.rotation.y;f=Math.atan2(Math.sin(f),Math.cos(f)),t.actor.rotation.y+=f*Math.min(1,9*e)}
if(p<.003&&s>1.5?t.stuckTime+=e:t.stuckTime=Math.max(0,t.stuckTime-2*e),t.stuckTime>1.3&&!t.pathFailed&&(t.pathTimer=Math.min(t.pathTimer,.2)),t.stuckTime>7){
const e=G();if(e)t.actor.position.set(e.x,b(e.x,e.z),e.z),t.path=[],t.pathTimer=0,t.pathFailed=!1,t.stuckTime=0,
console.warn("Zombi atascado recolocado",e);else{Yt(t);const e=pt.indexOf(t);-1!==e&&pt.splice(e,1),t.stuckTime=0,console.warn("Zombi inaccesible retirado")}}
return p}function Xt(){vt++,Mt=4+3*vt,bt=0,At=0,vt>1&&(wt+=24),qt("OLEADA "+vt),tt("wave"),Ut()}function Ht(){!zt||kt||Et||12===xt||wt<=0||(Et=!0,Gt=1.15,Ut(),
tt("reload"))}function Yt(t){$(t),a.remove(t.actor),t.mixer?.stopAllAction();for(const e of t.hit)e.geometry.dispose();t.hit[0].material.dispose()
;const e=pt.indexOf(t);e>=0&&pt.splice(e,1)}const $t=new t.Raycaster,Qt=new t.Raycaster,te=new t.Vector3,ee=new t.Vector3,oe=new t.Vector3;function ne(t){
return t.intersectObject(s,!0)[0]}function ie(){if(!zt||kt||Et)return;const e=performance.now();if(e-Tt<235)return;if(xt<=0)return void Ht();Tt=e,xt--,Ot=.13,
rt.intensity=8,tt("shot"),a.updateMatrixWorld(!0),ft.setFromCamera(new t.Vector2,l),ft.far=65;const o=ne(ft)
;let i=ft.intersectObjects(pt.flatMap(t=>t.hit),!1)[0];o&&(!i||o.distance<i.distance)&&(i=null),
oe.copy(ft.ray.origin).addScaledVector(ft.ray.direction,o?o.distance:65),i&&oe.copy(i.point),rt.getWorldPosition(ee),te.subVectors(oe,ee);const s=te.length()
;te.normalize(),$t.set(ee,te),$t.far=s+.02;const r=ne($t),c=$t.intersectObjects(pt.flatMap(t=>t.hit),!1)[0];if(c&&(!r||c.distance<r.distance)){
const t=pt.find(t=>t.hit.includes(c.object));t&&(t.hp-=c.object.userData.head?3:1,n("hitmark").style.opacity=1,setTimeout(()=>n("hitmark").style.opacity=0,90),
t.hp<=0&&(Yt(t),yt++,tt("zombieDeath")))}Ut(),0===xt&&wt>0&&Ht()}function ae(t){
for(const e of["main","options","load","credits"])n(e+"-panel")?.classList.toggle("hidden",e!==t)}function se(){n("menu")?.classList.remove("hidden"),ae("main")
}function re(){n("menu")?.classList.add("hidden")}const ce="deadzone-save-v3";function le(){try{const t=JSON.parse(localStorage.getItem(ce))
;return 3===t?.version&&Array.isArray(t.slots)?t.slots:[]}catch{return[]}}function de(){return{mode:c.mode,hp:gt,ammo:xt,reserve:wt,wave:vt,kills:yt,
remaining:Mt,spawnWait:bt,between:At,reloading:Et,reloadLeft:Gt,x:r.position.x,y:r.position.y,z:r.position.z,yaw:St,pitch:Ct,vy:Dt,grounded:Pt,map:g.map(t=>({
...t})),buildings:s.children.filter(t=>t.userData.building).map(t=>({x:t.position.x,z:t.position.z,h:t.userData.height})),cars:z.map(t=>({x:t.g.position.x,
z:t.g.position.z,rot:t.g.rotation.y})),zombies:pt.map(t=>({x:t.actor.position.x,z:t.actor.position.z,hp:t.hp,speed:t.speed,attack:t.attack,groan:t.groan})),
date:Date.now()}}function ue(t){
return t&&["waves","explore"].includes(t.mode)&&[t.hp,t.ammo,t.reserve,t.wave,t.kills,t.x,t.z,t.yaw,t.pitch].every(Number.isFinite)&&t.hp>0&&t.hp<=100&&t.ammo>=0&&t.ammo<=12&&t.reserve>=0&&t.reserve<=1e5&&t.wave>=0&&t.wave<=1e4&&Math.abs(t.x)<88&&Math.abs(t.z)<88&&Array.isArray(t.zombies)&&t.zombies.length<=12&&t.zombies.every(t=>[t.x,t.z,t.hp,t.speed].every(Number.isFinite)&&t.hp>0&&t.speed>0&&t.speed<=3&&Math.abs(t.x)<88&&Math.abs(t.z)<88)
}function he(t=!0){if(zt)try{const e=de(),o=le().filter(t=>t.mode!==e.mode);o.unshift(e),localStorage.setItem(ce,JSON.stringify({version:3,slots:o})),
t&&qt("PARTIDA GUARDADA")}catch{t&&qt("NO SE PUDO GUARDAR")}}function pe(){try{const t=d.domElement.requestPointerLock?.();t?.catch(()=>{kt=!0,se(),
qt("CLIC EN CONTINUAR PARA JUGAR")})}catch{kt=!0,se()}}function me(t="explore",e=null){Nt++,$();for(const t of[...pt])Yt(t)
;if(Object.keys(ht).forEach(t=>ht[t]=!1),c.mode=t,gt=100,xt=12,wt=96,vt=0,yt=0,Mt=0,bt=0,At=0,St=0,Ct=0,Dt=0,Pt=!0,Et=!1,Gt=0,zt=!0,kt=!1,Lt=!1,Bt=!1,Tt=0,Ot=0,
r.position.set(0,b(0,0),0),r.visible=!0,n("hud").classList.remove("hidden"),e&&ue(e)){
if(Array.isArray(e.map)&&e.map.length===g.length&&e.map.every(t=>[t.x,t.z,t.w,t.d,t.h].every(Number.isFinite)&&t.w>0&&t.d>0)){
g.splice(0,g.length,...e.map.map(t=>({...t})));for(const t of e.buildings||[]){
const e=s.children.find(e=>e.userData.building&&e.position.x===t.x&&e.position.z===t.z);if(e&&t.h>=9&&t.h<=21){const o=t.h/e.userData.height;e.scale.y*=o,
e.userData.height=t.h}}(e.cars||[]).forEach((t,e)=>{z[e]&&[t.x,t.z,t.rot].every(Number.isFinite)&&(z[e].g.position.set(t.x,0,t.z),z[e].g.rotation.y=t.rot)}),T()
}gt=e.hp,xt=e.ammo,wt=e.reserve,vt=e.wave,yt=e.kills,Mt=Math.max(0,Math.min(1e5,Number(e.remaining)||0)),bt=Math.max(0,Number(e.spawnWait)||0),
At=Math.max(0,Number(e.between)||0),St=e.yaw,Ct=Math.max(-1.2,Math.min(1.2,e.pitch)),w(e.x,e.z)||r.position.set(e.x,Math.max(b(e.x,e.z),Number(e.y)||0),e.z),
Dt=Number.isFinite(e.vy)?e.vy:0,Pt=!!e.grounded,Et=!!e.reloading,Gt=Math.max(0,Math.min(1.15,Number(e.reloadLeft)||0));for(const t of e.zombies){
const e=Wt(t.x,t.z);e&&(e.hp=t.hp,e.speed=t.speed,e.attack=Math.max(0,Number(t.attack)||0),e.groan=Math.max(1,Number(t.groan)||1))}}else"waves"===t?Xt():(Mt=6,
qt("DÍA 47 · ZONA DE PRUEBAS"));Vt=0,n("continue").textContent="CONTINUAR",n("subtitle").textContent="LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.",re(),Ut(),Y(),
ve(1,!0),pe()}function fe(){$(),tt("death"),zt=!1,kt=!1,Lt=!1,Bt=!1,document.exitPointerLock?.(),se(),n("hud").classList.add("hidden"),
n("subtitle").textContent=`HAS CAÍDO · ${yt} BAJAS`,n("continue").textContent="REINTENTAR"}n("new").onclick=()=>me("explore"),
n("waves").onclick=()=>me("waves"),n("continue").onclick=function(){if(!zt){const t=le().find(ue);return void(t?me(t.mode,t):me(c.mode))}re(),
n("subtitle").textContent="LA CIUDAD HA CAÍDO. TÚ TODAVÍA NO.",Y(),pe()},n("options").onclick=()=>ae("options"),n("credits").onclick=()=>ae("credits"),
n("load").onclick=()=>{ae("load");const t=n("saves");t.replaceChildren();const e=le().filter(ue);try{const t=JSON.parse(localStorage.getItem("deadzone-save"))
;if(t&&[t.hp,t.ammo,t.reserve,t.wave,t.kills,t.x,t.z].every(Number.isFinite)){const o={...t,mode:"waves",yaw:0,pitch:0,zombies:[],remaining:4+3*t.wave,date:0}
;ue(o)&&e.push(o)}}catch{}for(const o of e){const e=document.createElement("button")
;e.textContent=`${jt[o.mode].title} · ${o.date?new Date(o.date).toLocaleString():"GUARDADO V5 · REINICIA OLEADA"}`,e.onclick=()=>me(o.mode,o),t.append(e)}
e.length||(t.textContent="SIN PARTIDAS GUARDADAS")},document.querySelectorAll(".back").forEach(t=>t.onclick=()=>ae("main"));for(const t of["fov","sens","vol"]){
const e=n(t);e&&(e.oninput=()=>{n(t+"-val")&&(n(t+"-val").textContent=e.value+("vol"===t?"%":""))})}n("apply").onclick=()=>{l.fov=Number(n("fov").value),
l.updateProjectionMatrix(),It=Number(n("sens").value),K=Number(n("vol").value)/100,J&&(J.volume=.38*K),ot();try{
localStorage.setItem("deadzone-options",JSON.stringify({fov:l.fov,sensitivity:It,volume:K,quality:n("quality").value}))}catch{}
d.setPixelRatio(Math.min(devicePixelRatio,"low"===n("quality").value?.7:"high"===n("quality").value?1.3:1))
;for(const t of["fov","sens","vol"])n(t+"-val").textContent=n(t).value+("vol"===t?"%":"");ae("main")},document.addEventListener("keydown",t=>{ht[t.code]=!0,
"KeyR"===t.code&&Ht(),"Space"===t.code&&zt&&!kt&&Pt&&(Dt=6,Pt=!1),"F7"===t.code&&(t.preventDefault(),lt=(lt+1)%dt.length,ut(),
qt("PISTOLA: ORIENTACIÓN "+(lt+1)+"/8")),"KeyP"===t.code&&zt&&!kt&&he(),zt&&["Space","ArrowUp","ArrowDown"].includes(t.code)&&t.preventDefault()}),
document.addEventListener("keyup",t=>{ht[t.code]=!1}),document.addEventListener("mousemove",t=>{
document.pointerLockElement===d.domElement&&(St-=t.movementX*It*.01,Ct=Math.max(-1.45,Math.min(1.45,Ct-t.movementY*It*.01)))}),
d.domElement.addEventListener("mousedown",t=>{2!==t.button?zt&&!kt&&0===t.button&&(Lt=!0,
document.pointerLockElement!==d.domElement?d.domElement.requestPointerLock?.():ie()):Bt=zt&&!kt}),document.addEventListener("mouseup",t=>{0===t.button&&(Lt=!1),
2===t.button&&(Bt=!1)}),d.domElement.addEventListener("contextmenu",t=>t.preventDefault()),document.addEventListener("pointerlockchange",()=>{
if(zt)if(document.pointerLockElement===d.domElement)kt=!1,re(),nt();else{kt=!0,Lt=!1,Bt=!1,$(),nt(),Object.keys(ht).forEach(t=>ht[t]=!1),he(!1),se()
;const t=n("menu")?.querySelector(".subtitle");t&&(t.textContent="PARTIDA EN PAUSA")}}),window.addEventListener("blur",()=>{Lt=!1,Bt=!1,zt&&(kt=!0,$(),it(),
he(!1),document.exitPointerLock?.(),se()),Object.keys(ht).forEach(t=>{ht[t]=!1})});const ge={visual:null,mixer:null,walk:null},xe=Zt();async function we(){
const e=await F.loadAsync("https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Assets@main/Models/CesiumMan/glTF-Binary/CesiumMan.glb"),o=U(e)
;ge.visual=_(o,1.8),ge.visual.rotation.y=Math.PI,r.add(ge.visual),ge.mixer=new t.AnimationMixer(o);const i=q(e)
;if(!i.length)throw Error("Humanoide sin animaciones");ge.walk=ge.mixer.clipAction(i[0]),ge.walk.play(),xe.g.visible=!1,
n("asset-status").textContent="PERSONAJE RIGGEADO CARGADO"}function ve(e,o=!1){const n=!(!ht.ControlLeft&&!ht.KeyC),i=c.moving;if(r.rotation.y=St,
ge.walk&&(ge.walk.paused=!i,ge.walk.timeScale=ht.ShiftLeft?1.65:n?.65:1,ge.mixer.update(e)),ge.visual&&(ge.visual.position.y=0),!ge.visual){
const t=i?.45*Math.sin(.009*performance.now()):0;xe.legs[0].rotation.x=t,xe.legs[1].rotation.x=-t}at.position.set(.3,n?.94:1.24,-.38+Ot),
at.rotation.set(Bt?Ct:0,0,0)
;const a=new t.Vector3(r.position.x,r.position.y+(n?1.05:1.5),r.position.z),d=(new t.Quaternion).setFromEuler(new t.Euler(Ct,St,0,"YXZ")),u=new t.Vector3(Bt?.48:.65,.12,Bt?1.9:3.5).applyQuaternion(d),h=a.clone().add(u)
;s.updateMatrixWorld(!0),Qt.set(a,u.clone().normalize()),Qt.far=u.length()+.15;const p=ne(Qt)
;p&&h.copy(a).addScaledVector(Qt.ray.direction,Math.max(.15,p.distance-.22)),o?l.position.copy(h):l.position.lerp(h,1-Math.exp(14*-e)),
te.subVectors(l.position,a),Qt.set(a,te.clone().normalize()),Qt.far=te.length();const m=ne(Qt)
;m&&l.position.copy(a).addScaledVector(Qt.ray.direction,Math.max(.12,m.distance-.22)),l.quaternion.copy(d),r.visible=a.distanceTo(l.position)>.6}function ye(t){
t.scene.traverse(t=>{
if(t.isMesh)for(const e of Array.isArray(t.material)?t.material:[t.material])for(const t of["map","normalMap","roughnessMap","metalnessMap","aoMap"]){
const o=e[t],n=o?.image;if(n&&!o.userData.reduced&&(o.userData.reduced=!0,Math.max(n.width,n.height)>512)){
const t=document.createElement("canvas"),e=512/Math.max(n.width,n.height);t.width=Math.max(1,Math.round(n.width*e)),t.height=Math.max(1,Math.round(n.height*e)),
t.getContext("2d").drawImage(n,0,0,t.width,t.height),o.image=t,o.needsUpdate=!0}}})}async function Me(){
const e=["Ciudad/Exports/glTF (Godot)/Brick_Plain_3.gltf","Ciudad/Exports/glTF (Godot)/Brick_Window_Square_Single.gltf"],o=[];for(const t of e){
const e=await B(t);ye(e),o.push(e)}for(let e=0;e<M.length;e++){
const n=M[e],i=U(o[e%o.length]),a=(new t.Box3).setFromObject(i),s=a.getSize(new t.Vector3),r=a.getCenter(new t.Vector3),c=new t.Group,l=new t.Group;c.add(l),
l.add(i),l.position.copy(r).negate();const d=n.dd>n.ww;c.scale.set((d?n.dd:n.ww)/Math.max(.01,s.x),3.2/Math.max(.01,s.y),.25/Math.max(.01,s.z)),
c.rotation.y=d?Math.PI/2:0,c.position.set(n.lx,1.8,n.lz),n.g.add(c),n.mesh.visible=!1}n("city-status").textContent="APARTAMENTO EXPLORABLE · 2 MÓDULOS MEGAKIT"}
r.add(xe.g),xe.g.traverse(t=>{t.isMesh&&(t.material=h(t.position.y>1.4?10058340:4541767))});let be=0,Ae=0;window.addEventListener("resize",()=>{
const t=Math.max(1,i.clientWidth),e=Math.max(1,i.clientHeight);l.aspect=t/e,l.updateProjectionMatrix(),d.setSize(t,e)});try{
const t=JSON.parse(localStorage.getItem("deadzone-options"));t&&(n("fov").value=t.fov,n("sens").value=t.sensitivity,n("vol").value=100*t.volume,
n("quality").value=t.quality)}catch{}n("apply").onclick(),i.addEventListener("click",()=>{W||Y()},{once:!0}),window.addEventListener("pagehide",()=>{he(!1),$(),
it()}),new URLSearchParams(location.search).has("test")&&(window.__DZ={scene:a,world:s,player:r,camera:l,hero:ge,assets:j,zombies:pt,solids:g,blocked:w,
clearLine:v,findPath:R,spawnZombie:Wt,removeZombie:Yt,start:me,shoot:ie,reload:Ht,snapshot:de,validSave:ue,saveGame:he,readSaves:le,getState:()=>({hp:gt,
ammo:xt,reserve:wt,wave:vt,kills:yt,remaining:Mt,paused:kt,reloading:Et,reloadLeft:Gt,mode:c.mode}),setPaused:t=>kt=t,setYaw:t=>St=t,updatePlayerCamera:ve,
activeSounds:X,sound:tt,stopSounds:$,moveZombie:Jt,wakeAudio:Y,getPathBudget:()=>Ft}),Ut(),function t(){requestAnimationFrame(t)
;const e=mt.getDelta(),o=Math.min(e,.05);if(Ft=0,zt&&!kt){
const t=Number(!!ht.KeyW)-Number(!!ht.KeyS),e=Number(!!ht.KeyD)-Number(!!ht.KeyA),i=Math.hypot(t,e)||1,a=(ht.ControlLeft||ht.KeyC?2.2:ht.ShiftLeft?7:4.5)*o,s=(-Math.sin(St)*t+Math.cos(St)*e)/i*a,l=(-Math.cos(St)*t-Math.sin(St)*e)/i*a
;v(r.position.x,r.position.z,r.position.x+s,r.position.z,.38)&&(r.position.x+=s),
v(r.position.x,r.position.z,r.position.x,r.position.z+l,.38)&&(r.position.z+=l),c.moving=!(!t&&!e),Dt-=15*o,r.position.y+=Dt*o
;const u=b(r.position.x,r.position.z);if(r.position.y<=u?(r.position.y=u,Dt=0,Pt=!0):Pt=!1,ve(o),function(t){if(Et&&(Gt-=t,Gt<=0)){const t=Math.min(12-xt,wt)
;xt+=t,wt-=t,Et=!1,Gt=0,Ut()}}(o),ot(),Vt+=o,Vt>20&&(he(!1),Vt=0),(t||e)&&Pt&&(Rt-=o,Rt<=0&&(tt("step"),Rt=ht.ShiftLeft?.32:.48)),bt-=o,
Mt>0&&bt<=0&&pt.length<jt[c.mode].limit){const t=G();if(t){Wt(t.x,t.z)&&Mt--}bt=1.15}"waves"===c.mode&&0===Mt&&0===pt.length?(At+=o,At>2&&Xt()):At=0
;for(const t of[...pt]){const e=Jt(t,o);if(!pt.includes(t))continue;t.t+=o*(e>5e-4?7:2),Kt(t,o,e)
;const i=r.position.x-t.actor.position.x,a=r.position.z-t.actor.position.z,s=Math.hypot(i,a);if(t.attack-=o,t.groan-=o,t.groan<=0&&s<15&&(tt("zombie",t),
t.groan=5+5*Math.random()),
s<1.2&&Math.abs(r.position.y-t.actor.position.y)<1.5&&t.attack<=0&&v(t.actor.position.x,t.actor.position.z,r.position.x,r.position.z,.1)&&(gt-=12,t.attack=1.1,
gt>0&&tt("hurt"),n("damage")&&(n("damage").style.opacity=.3,setTimeout(()=>{n("damage").style.opacity=0},150)),Ut(),gt<=0)){fe();break}}
Lt&&document.pointerLockElement===d.domElement&&ie(),Ot=Math.max(0,Ot-1.1*o),rt.intensity=Math.max(0,rt.intensity-120*o)}if(be++,Ae+=e,
Ae>=1&&(n("fps")&&(n("fps").textContent=n("showfps")?.checked?be+" FPS":""),be=0,Ae=0),!zt){r.visible=!0,at.position.set(.3,1.24,-.38),r.rotation.y=-.5,
ge.mixer&&(ge.walk.paused=!0,ge.mixer.update(o));const t=6e-5*performance.now();l.position.set(r.position.x+4+1.2*Math.sin(t),r.position.y+2.1,r.position.z+5),
l.lookAt(r.position.x,r.position.y+1,r.position.z)}n("mode-name")&&(n("mode-name").textContent=jt[c.mode].title),d.render(a,l)}(),async function(){
const e=[we().catch(t=>{console.warn("Personaje provisional geométrico",t),n("asset-status").textContent="PERSONAJE BÁSICO · FALLÓ EL GLB"}),Me().catch(t=>{
console.warn("MegaKit no disponible",t),n("city-status").textContent="APARTAMENTO BÁSICO · FALLÓ MEGAKIT"})]
;for(const t of["Zombies/zombie_1.glb","Zombies/zombie_2.glb"])try{const e=await B(t);ye(e),j.zombies.push(e)}catch(e){console.warn(t,e)}
for(const t of[...pt])if(!t.visual&&j.zombies.length){const e={x:t.actor.position.x,z:t.actor.position.z,hp:t.hp,speed:t.speed};Yt(t);const o=Wt(e.x,e.z)
;o&&(o.hp=e.hp,o.speed=e.speed)}try{j.gun=await B("Armas 3D/pistola/9_mm.glb"),ye(j.gun),function(e){ct&&at.remove(ct);const o=U(e);ct=new t.Group,at.add(ct),
ct.position.set(0,0,-.08),ct.add(_(o,.23,.32,.6)),st.visible=!1,ut()}(j.gun)}catch(t){console.warn("Pistola básica",t)}try{
j.car=await B("Armas 3D/coche/covered_car_4k.glb");for(const t of z.slice(0,3))t.g.add(_(U(j.car),1.5,2.1,4.3)),t.low.visible=!1}catch(t){
console.warn("Coche básico",t)}await Promise.allSettled(e),n("loading").textContent="LISTO · P PARA GUARDAR"}().catch(console.error),
console.log("DEAD ZONE · FASE 1 · TERCERA PERSONA")})().catch(t=>{console.error(t);const e=document.getElementById("loading")
;e&&(e.textContent="NO SE PUDO INICIAR · "+t.message)});