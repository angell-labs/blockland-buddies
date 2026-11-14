import * as THREE from './vendor/three.module.js';
// ===== Blockland Buddies — original voxel sandbox =====
const CS=16, NC=8, WX=CS*NC, WZ=CS*NC, WY=48, SEA=14;
const B={AIR:0,GRASS:1,DIRT:2,STONE:3,SAND:4,WATER:5,WOOD:6,LEAF:7,PLANK:8,GLASS:9,BRICK:18,LAMP:19,SNOW:20};
const BLOCKS={1:['Grass','#5cbf4a'],2:['Dirt','#8a5a36'],3:['Stone','#8b8f99'],4:['Sand','#f0dc8c'],5:['Water','#3d8ee8'],
 6:['Log','#9a6a3c'],7:['Leaves','#3e9e3a'],8:['Planks','#d29b5a'],9:['Glass','#cdefff'],10:['Red','#ef4b4b'],11:['Orange','#ff9a2e'],
 12:['Yellow','#ffe23d'],13:['Lime','#8ee04a'],14:['Blue','#3c7cff'],15:['Purple','#9b5cf0'],16:['Pink','#ff8ccf'],17:['White','#f4f4f4'],
 18:['Brick','#b5523b'],19:['Lamp','#ffe9a0'],20:['Snow','#ffffff'],21:['Black','#333344'],22:['Teal','#2ec4b6'],24:['Metal','#d8dde3'],25:['Screen','#1d2a55'],26:['Clay Pot','#c8693c'],27:['Cobble','#9a968c'],28:['Lava','#ff6a1a'],29:['Crystal','#c59bff'],30:['Gold Star','#ffd23f'],32:['Rainbow','#ff66cc'],59:['Sign','#d29b5a']};
for(let i=0;i<26;i++)BLOCKS[33+i]=['Letter '+String.fromCharCode(65+i),'#fff8e0'];
const HOTBAR=[1,2,3,27,4,8,6,7,9,18,19,10,11,12,13,14,15,16,17,21,22,24,25,26,28,29,30,32,20,5,59,...Array.from({length:26},(_,i)=>33+i)];
const NT=64; // atlas tiles
// ---------- textures (procedural) ----------
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const atlas=document.createElement('canvas');atlas.width=16*NT;atlas.height=16;
const actx=atlas.getContext('2d');
function shade(hex,f){const c=new THREE.Color(hex);c.multiplyScalar(f);return '#'+c.getHexString()}
function drawTile(i,base,kind){const r=rng(i*99+7);for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=0.88+r()*0.24;
 if(kind==='brick'){f*=((y%4===0)||((x+(Math.floor(y/4)%2)*4)%8===0))?0.7:1}
 if(kind==='plank'){f*=(y%4===0)?0.75:1}
 if(kind==='log'){f*=(x%4===0)?0.8:1}
 if(kind==='glass'){f=(x===0||y===0||x===15||y===15||x===y)?0.8:1.05}
 if(kind==='lamp'){f=(x>3&&x<12&&y>3&&y<12)?1.1:0.8}
 if(kind==='leaf'&&r()<0.15)f*=0.6;
 actx.fillStyle=shade(base,f);actx.fillRect(i*16+x,y,1,1)}}
for(const id in BLOCKS){const n=BLOCKS[id][0];drawTile(+id,BLOCKS[id][1],n==='Brick'?'brick':n==='Planks'?'plank':n==='Log'?'log':n==='Glass'?'glass':n==='Lamp'?'lamp':n==='Leaves'?'leaf':n==='Cobble'?'brick':n==='Lava'?'leaf':n==='Crystal'?'glass':n==='Gold Star'?'lamp':'')}
{const rc=['#ff4b4b','#ff9a2e','#ffe23d','#5cbf4a','#3c7cff','#9b5cf0'];for(let y=0;y<16;y++)for(let x=0;x<16;x++){actx.fillStyle=rc[Math.floor((x+y)/16*6)%6];actx.fillRect(32*16+x,y,1,1)}
 for(const[x,y]of[[7,3],[8,3],[6,6],[7,6],[8,6],[9,6],[4,7],[11,7],[5,8],[10,8],[6,10],[9,10],[5,12],[10,12],[7,8],[8,8],[7,9],[8,9]]){actx.fillStyle='#fff6b0';actx.fillRect(30*16+x,y,1,1)}}
drawTile(0,'#5cbf4a','');{const r=rng(5);for(let y=0;y<16;y++)for(let x=0;x<16;x++){actx.fillStyle=shade(y<5+(r()*2|0)?'#5cbf4a':'#8a5a36',0.9+r()*0.2);actx.fillRect(63*16+x,y,1,1)}} // grass side tile 63
{const lc=['#ef4b4b','#3c7cff','#2e9e44','#9b5cf0','#ff8a00'];for(let i=0;i<26;i++){const X=(33+i)*16;actx.fillStyle='#fff8e0';actx.fillRect(X,0,16,16);actx.strokeStyle=lc[i%5];actx.lineWidth=2;actx.strokeRect(X+1,1,14,14);actx.fillStyle=lc[i%5];actx.font='bold 12px sans-serif';actx.textAlign='center';actx.textBaseline='middle';actx.fillText(String.fromCharCode(65+i),X+8,9)}
 const X=59*16;actx.fillStyle='#d29b5a';actx.fillRect(X,0,16,16);actx.fillStyle='#f5e6c8';actx.fillRect(X+2,3,12,8);actx.fillStyle='#555';for(let r=0;r<3;r++)actx.fillRect(X+4,5+r*2,8,1);actx.fillStyle='#8a5a36';actx.fillRect(X+7,11,2,5)}
const tex=new THREE.CanvasTexture(atlas);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestFilter;tex.colorSpace=THREE.SRGBColorSpace;
function tileFor(id,face){if(id===1)return face==='top'?1:face==='bottom'?2:63;if(id===6&&(face==='top'||face==='bottom'))return 8;return id}
function iconURL(id){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(atlas,tileFor(id,'side')*16,0,16,16,0,0,16,16);return c.toDataURL()}
// ---------- world ----------
let world=new Uint8Array(WX*WY*WZ), seed=1, worldName='', slot=0;
const idx=(x,y,z)=>x+WX*(z+WZ*y);
function get(x,y,z){if(x<0||z<0||x>=WX||z>=WZ||y<0)return B.STONE;if(y>=WY)return 0;return world[idx(x,y,z)]}
function set(x,y,z,v){if(x<0||z<0||x>=WX||z>=WZ||y<0||y>=WY)return;world[idx(x,y,z)]=v;if(net.on&&!net.applying)net.queue.push([x,y,z,v]);dirty(x,z);if(x%CS===0)dirty(x-1,z);if(x%CS===CS-1)dirty(x+1,z);if(z%CS===0)dirty(x,z-1);if(z%CS===CS-1)dirty(x,z+1)}
function noise2(seed){const r=rng(seed),P=[];for(let i=0;i<256;i++)P[i]=r();const h=(x,z)=>P[(x*73856093^z*19349663)&255];
 const sm=t=>t*t*(3-2*t);return(x,z)=>{const xi=Math.floor(x),zi=Math.floor(z),xf=sm(x-xi),zf=sm(z-zi);
 const a=h(xi,zi),b=h(xi+1,zi),c=h(xi,zi+1),d=h(xi+1,zi+1);return a+(b-a)*xf+(c-a)*zf+(a-b-c+d)*xf*zf}}
function generate(s){world=new Uint8Array(WX*WY*WZ);const n=noise2(s),r=rng(s+1);
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){
  let h=n(x/32,z/32)*14+n(x/12+50,z/12)*5+n(x/5,z/5+90)*1.5+6;
  const e=Math.min(x,z,WX-1-x,WZ-1-z);if(e<10)h=h*(e/10)+(SEA-4)*(1-e/10); // ocean around the edge
  h=Math.max(2,Math.min(WY-12,Math.floor(h)));
  for(let y=0;y<=h;y++){let b=y<h-3?B.STONE:y<h?B.DIRT:(h<=SEA+1?B.SAND:h>30?B.SNOW:B.GRASS);world[idx(x,y,z)]=b}
  for(let y=h+1;y<=SEA;y++)world[idx(x,y,z)]=B.WATER;
  if(world[idx(x,h,z)]===B.GRASS&&x>3&&z>3&&x<WX-4&&z<WZ-4&&r()<0.018){const th=4+(r()*2|0);
   for(let y=1;y<=th;y++)world[idx(x,h+y,z)]=B.WOOD;
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=th-1;dy<=th+1;dy++){if(Math.abs(dx)+Math.abs(dz)+(dy>th?1:0)>3)continue;const I=idx(x+dx,h+dy,z+dz);if(!world[I])world[I]=B.LEAF}}}}
function topY(x,z){for(let y=WY-1;y>0;y--){const b=get(x,y,z);if(b&&b!==B.WATER&&b!==B.LEAF)return y}return SEA}
// ---------- renderer ----------
const renderer=new THREE.WebGLRenderer({antialias:false,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);document.body.prepend(renderer.domElement);
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x8fd3ff,40,95);
const camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.1,200);
const hemi=new THREE.HemisphereLight(0xffffff,0x667744,0.7);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,0.8);scene.add(sun);
const sunBall=new THREE.Mesh(new THREE.BoxGeometry(6,6,6),new THREE.MeshBasicMaterial({color:0xfff2a0,fog:false}));scene.add(sunBall);
const moonBall=new THREE.Mesh(new THREE.BoxGeometry(5,5,5),new THREE.MeshBasicMaterial({color:0xe8ecff,fog:false}));scene.add(moonBall);
const stars=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(Array.from({length:900},()=>(Math.random()-0.5)*300),3)),new THREE.PointsMaterial({color:0xffffff,size:1.2,fog:false,transparent:true}));scene.add(stars);
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
const matSolid=new THREE.MeshLambertMaterial({map:tex,vertexColors:true});
const matWater=new THREE.MeshLambertMaterial({map:tex,vertexColors:true,transparent:true,opacity:0.7,depthWrite:false});
const matGlass=new THREE.MeshLambertMaterial({map:tex,vertexColors:true,transparent:true,opacity:0.55});
const chunks={},dirtySet=new Set();
function dirty(x,z){if(x<0||z<0||x>=WX||z>=WZ)return;dirtySet.add((x/CS|0)+','+(z/CS|0))}
const FACES=[{d:[1,0,0],n:'side',c:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],s:0.8},{d:[-1,0,0],n:'side',c:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],s:0.8},
 {d:[0,1,0],n:'top',c:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],s:1},{d:[0,-1,0],n:'bottom',c:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],s:0.55},
 {d:[0,0,1],n:'side',c:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],s:0.9},{d:[0,0,-1],n:'side',c:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],s:0.9}];
const transp=b=>b===0||b===B.WATER||b===B.GLASS||b===B.LEAF;
function buildChunk(cx,cz){const key=cx+','+cz;if(chunks[key]){for(const m of chunks[key]){scene.remove(m);m.geometry.dispose()}}
 const bufs=[[],[],[]].map(()=>({p:[],u:[],c:[],i:[],n:[]}));
 for(let y=0;y<WY;y++)for(let z=cz*CS;z<cz*CS+CS;z++)for(let x=cx*CS;x<cx*CS+CS;x++){const b=world[idx(x,y,z)];if(!b)continue;
  const g=b===B.WATER?bufs[1]:b===B.GLASS?bufs[2]:bufs[0];
  for(const f of FACES){const nb=get(x+f.d[0],y+f.d[1],z+f.d[2]);
   if(b===B.WATER){if(nb===B.WATER||(nb&&!transp(nb))||(f.d[1]===-1))continue}else if(!(transp(nb)&&nb!==b)&&!(b===B.LEAF&&nb===B.LEAF&&false))continue;
   if(b===B.LEAF&&nb===B.LEAF)continue;
   const t=tileFor(b,f.n),u0=t/NT+0.0005,u1=(t+1)/NT-0.0005,base=g.p.length/3,lit=(b===B.LAMP||b===28||b===29||b===30||b===32)?1.3:f.s;
   const top=b===B.WATER&&f.d[1]===1?-0.1:0;
   for(const c of f.c){g.p.push(x+c[0],y+c[1]+(c[1]?top:0),z+c[2]);g.c.push(lit,lit,lit);g.n.push(...f.d)}
   g.u.push(u0,0,u0,1,u1,1,u1,0);g.i.push(base,base+1,base+2,base,base+2,base+3)}}
 chunks[key]=bufs.map((g,k)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(g.p,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(g.u,2));geo.setAttribute('normal',new THREE.Float32BufferAttribute(g.n,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(g.c,3));geo.setIndex(g.i);
  const m=new THREE.Mesh(geo,[matSolid,matWater,matGlass][k]);if(k===1)m.renderOrder=2;scene.add(m);return m})}
function buildAll(){for(let cx=0;cx<NC;cx++)for(let cz=0;cz<NC;cz++)buildChunk(cx,cz);dirtySet.clear()}
// ---------- player ----------
const P={pos:new THREE.Vector3(),vel:new THREE.Vector3(),yaw:0,pitch:-0.2,fly:true,ground:false,creative:true,inv:{}};
const PW=0.3,PH=1.7;
function solidAt(x,y,z){const b=get(Math.floor(x),Math.floor(y),Math.floor(z));return b&&b!==B.WATER}
function collides(p){for(let x=p.x-PW;x<=p.x+PW;x+=PW)for(let z=p.z-PW;z<=p.z+PW;z+=PW)for(let y=p.y;y<=p.y+PH;y+=PH/2)if(solidAt(x,y,z))return true;return false}
function moveAxis(axis,d){const np=P.pos.clone();np[axis]+=d;if(!collides(np)){P.pos.copy(np);return false}return true}
function spawnPlayer(){const[x,z]=spawnXZ;P.pos.set(x+0.5,topY(x,z)+2,z+0.5);P.vel.set(0,0,0)}
// ---------- input ----------
const input={jx:0,jz:0,jump:false,down:false,keys:{}};
const joy=document.getElementById('joy'),knob=document.getElementById('knob');let joyId=null;
function joyMove(t){const r=joy.getBoundingClientRect();let dx=t.clientX-r.left-r.width/2,dy=t.clientY-r.top-r.height/2;const L=Math.hypot(dx,dy),M=r.width/2-20;if(L>M){dx*=M/L;dy*=M/L}
 knob.style.transform=`translate(${dx}px,${dy}px)`;input.jx=dx/M;input.jz=dy/M}
joy.addEventListener('touchstart',e=>{e.preventDefault();const t=e.changedTouches[0];joyId=t.identifier;joyMove(t)},{passive:false});
let lookId=null,lx=0,ly=0,tapStart=0,tapMoved=0;
const cv=renderer.domElement;
cv.addEventListener('touchstart',e=>{e.preventDefault();for(const t of e.changedTouches)if(lookId===null){lookId=t.identifier;lx=t.clientX;ly=t.clientY;tapStart=performance.now();tapMoved=0}},{passive:false});
addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(t.identifier===joyId)joyMove(t);else if(t.identifier===lookId){const dx=t.clientX-lx,dy=t.clientY-ly;tapMoved+=Math.abs(dx)+Math.abs(dy);P.yaw-=dx*0.006;P.pitch=Math.max(-1.5,Math.min(1.5,P.pitch-dy*0.006));lx=t.clientX;ly=t.clientY}}},{passive:false});
function touchEnd(e){for(const t of e.changedTouches){if(t.identifier===joyId){joyId=null;input.jx=input.jz=0;knob.style.transform=''}
 if(t.identifier===lookId){lookId=null;if(tapMoved<12&&performance.now()-tapStart<350)tapAt(t.clientX,t.clientY)}}}
addEventListener('touchend',touchEnd);addEventListener('touchcancel',touchEnd);
// desktop fallback
let mdown=false;cv.addEventListener('mousedown',e=>{mdown=true;lx=e.clientX;ly=e.clientY;tapMoved=0});
addEventListener('mousemove',e=>{if(!mdown)return;const dx=e.clientX-lx,dy=e.clientY-ly;tapMoved+=Math.abs(dx)+Math.abs(dy);P.yaw-=dx*0.005;P.pitch=Math.max(-1.5,Math.min(1.5,P.pitch-dy*0.005));lx=e.clientX;ly=e.clientY});
addEventListener('mouseup',e=>{if(mdown&&tapMoved<6&&e.target===cv)tapAt(e.clientX,e.clientY);mdown=false});
addEventListener('keydown',e=>{if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName))return;input.keys[e.code]=true;if(e.code==='KeyB')doBreak();if(e.code==='KeyP')doPlace()});addEventListener('keyup',e=>input.keys[e.code]=false);
function hold(id,k){const el=document.getElementById(id);const on=e=>{e.preventDefault();input[k]=true},off=e=>{e.preventDefault();input[k]=false};
 el.addEventListener('touchstart',on,{passive:false});el.addEventListener('touchend',off);el.addEventListener('mousedown',on);el.addEventListener('mouseup',off);el.addEventListener('mouseleave',off)}
hold('bJump','jump');hold('bDown','down');
function tapBtn(id,fn){const el=document.getElementById(id);el.addEventListener('touchstart',e=>{e.preventDefault();fn()},{passive:false});el.addEventListener('click',fn)}
// ---------- raycast ----------
function rayBlock(maxD=7){const o=camera.position,d=new THREE.Vector3();camera.getWorldDirection(d);
 let x=Math.floor(o.x),y=Math.floor(o.y),z=Math.floor(o.z);const sx=Math.sign(d.x),sy=Math.sign(d.y),sz=Math.sign(d.z);
 const tdx=Math.abs(1/d.x),tdy=Math.abs(1/d.y),tdz=Math.abs(1/d.z);
 let tx=(sx>0?x+1-o.x:o.x-x)*tdx,ty=(sy>0?y+1-o.y:o.y-y)*tdy,tz=(sz>0?z+1-o.z:o.z-z)*tdz,n=[0,0,0],t=0;
 while(t<maxD){const b=get(x,y,z);if(b&&b!==B.WATER&&y<WY)return{x,y,z,n,b,t};
  if(tx<ty&&tx<tz){x+=sx;t=tx;tx+=tdx;n=[-sx,0,0]}else if(ty<tz){y+=sy;t=ty;ty+=tdy;n=[0,-sy,0]}else{z+=sz;t=tz;tz+=tdz;n=[0,0,-sz]}}return null}
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.01,1.01,1.01)),new THREE.LineBasicMaterial({color:0xffffff}));scene.add(hl);
let sel=0;
function doBreak(){const h=rayBlock();if(!h)return;if(h.y===0)return toast('Too tough! 🪨');if(h.b===30||h.b===32){burst(h.x+0.5,h.y+0.5,h.z+0.5,0,50,true);toast(h.b===30?'⭐ You found a secret star!':'🌈 You found a rainbow block!')}
 onBroken(h.x,h.y,h.z);set(h.x,h.y,h.z,0);burst(h.x+0.5,h.y+0.5,h.z+0.5,BLOCKS[h.b][1],10);
 if(!P.creative){P.inv[h.b]=(P.inv[h.b]||0)+1;drawHotbar()}}
function doPlace(){const h=rayBlock();if(!h)return;const id=HOTBAR[sel];if(!P.creative&&!(P.inv[id]>0))return toast('Break some '+BLOCKS[id][0]+' first!');
 const x=h.x+h.n[0],y=h.y+h.n[1],z=h.z+h.n[2];const g=get(x,y,z);if(g&&g!==B.WATER)return;
 const p=P.pos;if(x+1>p.x-PW&&x<p.x+PW&&z+1>p.z-PW&&z<p.z+PW&&y+1>p.y&&y<p.y+PH)return;
 set(x,y,z,id);if(!P.creative){P.inv[id]--;drawHotbar()}onPlaced(x,y,z,id)}
tapBtn('bBreak',doBreak);tapBtn('bPlace',doPlace);
// ---------- hotbar ----------
const hb=document.getElementById('hbStrip');
function drawHotbar(){hb.innerHTML='';HOTBAR.forEach((id,i)=>{const b=document.createElement('button');b.className='hb'+(i===sel?' sel':'');b.style.backgroundImage=`url(${iconURL(id)})`;
 if(!P.creative){const s=document.createElement('span');s.textContent=P.inv[id]||0;b.appendChild(s)}
 b.addEventListener('click',()=>{sel=i;drawHotbar();toast(BLOCKS[id][0])});hb.appendChild(b)});const sl=hb.querySelector('.sel');if(sl){const a=sl.getBoundingClientRect(),c=hb.getBoundingClientRect();if(a.left<c.left||a.right>c.right)hb.scrollLeft+=a.left-c.left-(c.width-a.width)/2}}
// ---------- UI helpers ----------
let toastT;function toast(s){const t=document.getElementById('toast');t.textContent=s;t.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>t.style.opacity=0,1600)}
const panel=document.getElementById('panel');
function showPanel(html,btns){panel.innerHTML='<div>'+html+'</div>';for(const [label,cls,fn] of btns){const b=document.createElement('button');b.textContent=label;b.className=cls||'';b.onclick=()=>{fn();};panel.appendChild(b)}panel.classList.remove('hidden')}
const hidePanel=()=>panel.classList.add('hidden');
// ---------- creatures (original designs, made of boxes) ----------
const critters=[];const critterGroup=new THREE.Group();scene.add(critterGroup);
function box(w,h,d,color,x,y,z,parent,opts={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color,transparent:!!opts.op,opacity:opts.op||1,emissive:opts.em||0}));m.position.set(x,y,z);parent.add(m);return m}
function eyes(g,y,z,sz=0.12,gap=0.13,big=false){for(const s of[-1,1]){box(sz,sz,0.02,0xffffff,s*gap,y,z,g);box(sz*0.5,sz*(big?0.6:0.5),0.03,0x111111,s*gap,y-0.01,z+0.01,g)}}
const KINDS={
 puppy:{emoji:'🐶',pet:true,food:'bone',make(c){const g=new THREE.Group();box(0.5,0.35,0.8,c||0xc8915a,0,0.35,0,g);const h=box(0.4,0.38,0.38,c||0xc8915a,0,0.62,0.45,g);
  box(0.1,0.2,0.08,0x7a4a2a,-0.16,0.86,0.42,g);box(0.1,0.2,0.08,0x7a4a2a,0.16,0.86,0.42,g);box(0.14,0.1,0.1,0x333333,0,0.56,0.66,g);eyes(g,0.7,0.645);
  for(const[x,z]of[[-.17,.28],[.17,.28],[-.17,-.28],[.17,-.28]])box(0.12,0.2,0.12,c||0xc8915a,x,0.1,z,g);g.userData.tail=box(0.08,0.08,0.3,c||0xc8915a,0,0.5,-0.5,g);return g}},
 kitten:{emoji:'🐱',pet:true,food:'fish',make(c){const g=new THREE.Group();box(0.4,0.3,0.65,c||0x9a9aa8,0,0.32,0,g);box(0.36,0.32,0.32,c||0x9a9aa8,0,0.58,0.38,g);
  box(0.09,0.12,0.06,c||0x9a9aa8,-0.12,0.78,0.38,g);box(0.09,0.12,0.06,c||0x9a9aa8,0.12,0.78,0.38,g);box(0.06,0.05,0.03,0xff9ab8,0,0.53,0.55,g);eyes(g,0.62,0.545,0.1,0.09,true);
  for(const[x,z]of[[-.13,.22],[.13,.22],[-.13,-.22],[.13,-.22]])box(0.1,0.18,0.1,c||0x9a9aa8,x,0.09,z,g);g.userData.tail=box(0.07,0.4,0.07,c||0x9a9aa8,0,0.6,-0.35,g);return g}},
 bunny:{emoji:'🐰',pet:true,food:'carrot',make(c){const g=new THREE.Group();box(0.4,0.38,0.5,c||0xf5f0ea,0,0.25,0,g);box(0.32,0.3,0.3,c||0xf5f0ea,0,0.5,0.28,g);
  box(0.08,0.32,0.06,c||0xf5f0ea,-0.08,0.8,0.25,g);box(0.08,0.32,0.06,c||0xf5f0ea,0.08,0.8,0.25,g);box(0.06,0.05,0.03,0xff9ab8,0,0.46,0.44,g);eyes(g,0.55,0.435,0.08,0.08);box(0.14,0.14,0.1,0xffffff,0,0.3,-0.3,g);return g}},
 dragon:{emoji:'🐲',pet:true,food:'berry',make(c){const g=new THREE.Group();box(0.45,0.4,0.7,c||0x6fd38a,0,0.4,0,g);box(0.4,0.36,0.42,c||0x6fd38a,0,0.72,0.42,g);
  box(0.3,0.06,0.3,0xffe08a,0,0.28,0.05,g);box(0.07,0.15,0.07,0xfff3c4,-0.12,0.95,0.35,g);box(0.07,0.15,0.07,0xfff3c4,0.12,0.95,0.35,g);eyes(g,0.78,0.635,0.13,0.11,true);
  g.userData.wl=box(0.4,0.04,0.3,0xffb3d9,-0.4,0.62,0,g);g.userData.wr=box(0.4,0.04,0.3,0xffb3d9,0.4,0.62,0,g);g.userData.tail=box(0.12,0.12,0.4,c||0x6fd38a,0,0.35,-0.5,g);
  for(const[x,z]of[[-.15,.22],[.15,.22],[-.15,-.22],[.15,-.22]])box(0.12,0.2,0.12,c||0x6fd38a,x,0.1,z,g);return g}},
 turtle:{emoji:'🐢',pet:true,food:'seaweed',make(c){const g=new THREE.Group();box(0.7,0.3,0.8,c||0x4f9a5a,0,0.3,0,g);box(0.5,0.15,0.6,0x7cc47f,0,0.5,0,g);box(0.3,0.25,0.3,0x9ad38a,0,0.3,0.5,g);eyes(g,0.38,0.655,0.08,0.08);
  for(const[x,z]of[[-.4,.25],[.4,.25],[-.4,-.25],[.4,-.25]])box(0.25,0.08,0.18,0x9ad38a,x,0.18,z,g);return g}},
 glowsnail:{emoji:'🐌',pet:true,food:'leaf',make(){const g=new THREE.Group();box(0.3,0.18,0.8,0xffe8a0,0,0.09,0,g);box(0.24,0.3,0.24,0xffe8a0,0,0.3,0.32,g);box(0.04,0.18,0.04,0xffe8a0,-0.07,0.52,0.36,g);box(0.04,0.18,0.04,0xffe8a0,0.07,0.52,0.36,g);
  box(0.5,0.5,0.45,0xb48cff,0,0.43,-0.12,g,{em:0x6a3cc0});box(0.3,0.3,0.47,0xe0c8ff,0,0.43,-0.12,g,{em:0x8a5ce0});eyes(g,0.34,0.445,0.07,0.06,true);return g}},
 nessie:{emoji:'🦕',pet:false,hello:'🦕 A shy, friendly river creature waves hello!',make(){const g=new THREE.Group();const C=0x5cc4b0;box(0.9,0.5,1.4,C,0,0.1,0,g);box(0.6,0.4,0.6,C,0,0.1,-1.0,g);box(0.4,0.3,0.5,C,0,0.05,-1.6,g);
  g.userData.body=box(0.35,1.4,0.35,C,0,0.9,0.7,g);box(0.45,0.4,0.6,C,0,1.7,0.85,g);eyes(g,1.8,1.155,0.12,0.12,true);box(0.2,0.04,0.02,0x225544,0,1.6,1.155,g);for(const z of[-0.3,0.2])box(0.1,0.15,0.2,0xffe08a,0,0.42,z,g);return g}},
 fish:{emoji:'🐠',pet:false,hello:'🐠 A happy little fish blows bubbles at you!',make(){const g=new THREE.Group();const C=[0xffa02e,0xffe23d,0x3c7cff,0xff66cc][Math.random()*4|0];box(0.18,0.3,0.45,C,0,0,0,g);g.userData.tail=box(0.06,0.25,0.18,C,0,0,-0.3,g);box(0.2,0.08,0.1,0xffffff,0,0,0.08,g);eyes(g,0.05,0.23,0.06,0.05);return g}},
 jelly:{emoji:'🟢',pet:false,make(){const g=new THREE.Group();const col=[0x8af0a0,0xff9ad5,0x9ad0ff][Math.random()*3|0];g.userData.body=box(0.8,0.6,0.8,col,0,0.3,0,g,{op:0.85,em:0x112211});
  for(const s of[-1,1]){box(0.18,0.18,0.02,0xffffff,s*0.18,0.42,0.41,g);box(0.09,0.09,0.03,0x111111,s*0.18,0.4,0.42,g);box(0.16,0.04,0.02,0x225522,s*0.18,0.55,0.41,g).rotation.z=s*0.4}
  box(0.2,0.04,0.02,0x225522,0,0.22,0.41,g);return g}},
 ghost:{emoji:'👻',pet:false,make(){const g=new THREE.Group();g.userData.body=box(0.6,0.8,0.5,0xf4f4ff,0,0.6,0,g,{op:0.8,em:0x333344});
  for(let i=0;i<3;i++)box(0.18,0.15,0.5,0xf4f4ff,-0.2+i*0.2,0.15,0,g,{op:0.8});
  for(const s of[-1,1]){box(0.2,0.22,0.02,0xffffff,s*0.14,0.75,0.26,g);box(0.12,0.06,0.03,0x334,s*0.14,0.72,0.27,g)} // sleepy half-closed eyes
  box(0.12,0.1,0.02,0xffaacc,0,0.52,0.26,g);g.userData.zzz=true;return g}},
};
const PET_COLORS={puppy:[0xc8915a,0xf0e0c0,0x555555,0xe8b070],kitten:[0x9a9aa8,0xf0a050,0x333333,0xffffff],bunny:[0xf5f0ea,0xb08060,0xdddddd],dragon:[0x6fd38a,0x8ab4ff,0xff9ad5,0xc59aff]};
function spawnCritter(kind,x,z,data={}){const K=KINDS[kind];const color=data.color??(PET_COLORS[kind]?PET_COLORS[kind][Math.random()*PET_COLORS[kind].length|0]:null);
 const mesh=K.make(color);const y=data.y??topY(Math.floor(x),Math.floor(z))+1;mesh.position.set(x,y,z);critterGroup.add(mesh);
 const c={kind,mesh,color,owned:!!data.owned,name:data.name||'',love:data.love||0,friend:!!data.friend,vel:new THREE.Vector3(),t:Math.random()*10,target:null,night:!K.pet};
 mesh.traverse(o=>o.userData.critter=c);critters.push(c);return c}
function removeCritter(c){critterGroup.remove(c.mesh);critters.splice(critters.indexOf(c),1)}
function populate(){const r=rng(seed+5);const kinds=['puppy','kitten','bunny','dragon'];for(let i=0;i<14;i++){const x=12+r()*(WX-24),z=12+r()*(WZ-24);
 if(get(Math.floor(x),topY(Math.floor(x),Math.floor(z)),Math.floor(z))===B.GRASS||i<4)spawnCritter(kinds[i%4],x,z)}
 // guarantee one of each near spawn
 kinds.forEach((k,i)=>spawnCritter(k,spawnXZ[0]+Math.cos(i*1.57)*4,spawnXZ[1]+Math.sin(i*1.57)*4))}
const ray=new THREE.Raycaster();
function tapAt(cx,cy){ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);const mk=ray.intersectObjects(markerGroup.children,false)[0];if(mk&&mk.distance<14){mk.object.userData.act();return}
 const hit=ray.intersectObjects(critterGroup.children,true)[0];if(hit&&hit.distance<10){const c=hit.object.userData.critter;if(settings.learning&&prog&&LC&&LC.journal[c.kind]&&!prog.journal.includes(c.kind)){addJournal(c.kind);return}critterMenu(c);return}
 const o=ray.ray.origin,d=ray.ray.direction;let x=Math.floor(o.x),y=Math.floor(o.y),z=Math.floor(o.z);for(let t=0;t<8;t+=0.05){const px=o.x+d.x*t,py=o.y+d.y*t,pz=o.z+d.z*t;const b=get(Math.floor(px),Math.floor(py),Math.floor(pz));if(b&&b!==B.WATER){if(prog)blockTapped({x:Math.floor(px),y:Math.floor(py),z:Math.floor(pz),b});return}}}
const FOOD={bone:'🦴',fish:'🐟',carrot:'🥕',berry:'🍓',seaweed:'🥬',leaf:'🍃'};
function critterMenu(c){const K=KINDS[c.kind];
 if(K.pet){if(!c.owned)showPanel(`${K.emoji} A friendly ${c.kind}! Want to adopt it?`,[['❤️ Adopt','green',()=>{hidePanel();askName(c)}],['Not now','',hidePanel]]);
  else showPanel(`${K.emoji} <b>${c.name}</b> ${'💖'.repeat(Math.min(5,1+(c.love/3|0)))}`,[[FOOD[K.food]+' Feed','green',()=>{c.love++;hearts(c);toast(c.name+' loves it! Yum!');hidePanel()}],
   [c.sit?'🐾 Follow me':'💤 Stay here','',()=>{c.sit=!c.sit;hidePanel()}],['✏️ Rename','',()=>{hidePanel();askName(c)}],['Close','',hidePanel]])}
 else if(c.friend)showPanel(`${K.emoji} Your silly ${c.kind==='jelly'?'jelly':'ghost'} friend says hi!`,[['🎉 Confetti poof','',()=>{poof(c);hidePanel()}],['Bye!','',hidePanel]]);
 else showPanel(K.hello?K.hello:c.kind==='jelly'?'🟢 A grumpy jelly! It just wants a hug.':'👻 A sleepy ghost yawns at you.',[['🤗 Be friends','green',()=>{c.friend=true;hearts(c);toast('New friend!');hidePanel()}],['🎉 Poof!','',()=>{poof(c);hidePanel()}],['Leave it','',hidePanel]])}
function askName(c){const n=prompt('What will you name your '+c.kind+'?',c.name||'');if(n===null)return;c.name=(n.trim()||'Buddy').slice(0,16);c.owned=true;c.fixed=false;if(c.secretIdx!=null&&secrets[c.secretIdx])secrets[c.secretIdx].taken=true;hearts(c);toast('Welcome home, '+c.name+'! 🎉')}
// particles
const parts=[];
function burst(x,y,z,color,n,conf){for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.12),new THREE.MeshBasicMaterial({color:conf?new THREE.Color().setHSL(Math.random(),0.9,0.6):color}));
 m.position.set(x,y,z);scene.add(m);parts.push({m,v:new THREE.Vector3((Math.random()-0.5)*4,Math.random()*4+1,(Math.random()-0.5)*4),life:1+Math.random()})}}
const heartTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.font='54px serif';x.textAlign='center';x.fillText('💖',32,52);return new THREE.CanvasTexture(c)})();
function hearts(c){for(let i=0;i<4;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true}));s.scale.set(0.4,0.4,0.4);s.position.copy(c.mesh.position).add(new THREE.Vector3((Math.random()-0.5),1+Math.random()*0.4,(Math.random()-0.5)));scene.add(s);parts.push({m:s,v:new THREE.Vector3(0,0.8,0),life:1.5,noGrav:true})}}
function poof(c){const p=c.mesh.position;burst(p.x,p.y+0.5,p.z,0,40,true);removeCritter(c);toast('🎉 Poof! Confetti!')}
// ---------- day/night ----------
let tod=0.3; const DAY_LEN=480; // seconds per full day
const skyDay=new THREE.Color(0x8fd3ff),skyNight=new THREE.Color(0x24305e),skySet=new THREE.Color(0xffb37a),tmpC=new THREE.Color();
function isNight(){return tod>0.78||tod<0.22}
function updateSky(){const a=tod*Math.PI*2-Math.PI/2;const sy=Math.sin(a);const dayF=THREE.MathUtils.clamp(sy*3+0.5,0,1);
 tmpC.copy(skyNight).lerp(skyDay,dayF);if(Math.abs(sy)<0.25)tmpC.lerp(skySet,(0.25-Math.abs(sy))*1.6);scene.background=tmpC.clone();scene.fog.color.copy(tmpC);
 hemi.intensity=0.45+0.45*dayF;sun.intensity=0.15+0.75*dayF;const c=P.pos;
 sunBall.position.set(c.x+Math.cos(a)*120,c.y+sy*120,c.z+20);moonBall.position.set(c.x-Math.cos(a)*120,c.y-sy*120,c.z-20);sun.position.copy(dayF>0?sunBall.position:moonBall.position);
 stars.position.copy(c);stars.material.opacity=1-dayF;document.getElementById('clock').textContent=isNight()?'🌙':(tod<0.3||tod>0.7)?'🌅':'☀️'}
// ---------- save / load ----------
const SKEY=i=>'blockland_slot_'+i;
function rleEncode(a){const out=[];for(let i=0;i<a.length;){const v=a[i];let n=1;while(i+n<a.length&&a[i+n]===v&&n<65535)n++;out.push(v,n&255,n>>8);i+=n}
 let s='';const u=new Uint8Array(out);for(let i=0;i<u.length;i+=8192)s+=String.fromCharCode.apply(null,u.subarray(i,i+8192));return btoa(s)}
function rleDecode(str){const s=atob(str),a=new Uint8Array(WX*WY*WZ);let p=0;for(let i=0;i<s.length;i+=3){const v=s.charCodeAt(i),n=s.charCodeAt(i+1)|(s.charCodeAt(i+2)<<8);a.fill(v,p,p+n);p+=n}return a}
function save(quiet){if(!worldName||net.on)return;const pets=critters.filter(c=>c.owned||(c.friend&&!KINDS[c.kind].pet)).map(c=>({kind:c.kind,x:c.mesh.position.x,y:c.mesh.position.y,z:c.mesh.position.z,name:c.name,love:c.love,color:c.color,owned:c.owned,friend:c.friend,sit:c.sit}));
 const wild=critters.filter(c=>!c.owned&&!c.fixed&&c.secretIdx==null&&KINDS[c.kind].pet).map(c=>({kind:c.kind,x:c.mesh.position.x,z:c.mesh.position.z,color:c.color}));
 try{localStorage.setItem(SKEY(slot),JSON.stringify({name:worldName,seed,signs,spawn:spawnXZ,landmarks,secrets,kind:worldKind,tod,creative:P.creative,fly:P.fly,inv:P.inv,p:[P.pos.x,P.pos.y,P.pos.z,P.yaw,P.pitch],pets,wild,w:rleEncode(world),saved:Date.now()}));if(!quiet)toast('Saved! 💾')}
 catch(e){toast('Could not save (storage full)')}}
function startWorld(i,data,kind){slot=i;critters.slice().forEach(removeCritter);
 net.on=false;document.getElementById('bEmote').classList.add('hidden');if(data){worldName=data.name;seed=data.seed;spawnXZ=data.spawn||[WX/2,WZ/2];landmarks=data.landmarks||[];secrets=data.secrets||[];signs=data.signs||{};worldKind=data.kind||'nature';world=rleDecode(data.w);tod=data.tod;P.creative=data.creative;P.fly=data.fly&&data.creative;P.inv=data.inv||{};
  P.pos.set(data.p[0],data.p[1],data.p[2]);P.yaw=data.p[3];P.pitch=data.p[4];for(const c of data.pets){const k=spawnCritter(c.kind,c.x,c.z,c);k.sit=c.sit}for(const c of data.wild||[])spawnCritter(c.kind,c.x,c.z,c)}
 else{worldKind=kind;signs={};genKind(kind);tod=0.3;P.creative=true;P.fly=false;P.inv={};spawnPlayer();populate()}
 spawnSecrets();buildAll();refreshSelf();updateModeUI();buildMarkers();updateCoinUI();warned=false;drawHotbar();document.getElementById('menu').classList.add('hidden');document.getElementById('hud').classList.remove('hidden');running=true;if(!data)save(true)}
function showMenu(){running=false;if(typeof updatePending!=='undefined'&&updatePending&&!net.on){setTimeout(doUpdate,50)}document.getElementById('hud').classList.add('hidden');document.getElementById('menu').classList.remove('hidden');hidePanel();
 const el=document.getElementById('slots');el.innerHTML='';for(let i=0;i<3;i++){const raw=localStorage.getItem(SKEY(i));let d=null;try{d=raw&&JSON.parse(raw)}catch(e){}
  const s=document.createElement('div');s.className='slot';s.innerHTML=`<h3>${d?'🌍 '+escapeHtml(d.name):'Empty slot '+(i+1)}</h3>`;
  const mk=(t,c,f)=>{const b=document.createElement('button');b.textContent=t;b.className=c;b.onclick=f;s.appendChild(b)};
  if(d){mk('▶️ Play','green',()=>startWorld(i,d));mk('🗑️','red',()=>{if(confirm('Delete "'+d.name+'" forever?')){localStorage.removeItem(SKEY(i));showMenu()}})}
  else mk('✨ New World','green',()=>{const n=prompt('Name your new world:','My World');if(n===null)return;worldName=(n.trim()||'My World').slice(0,24);seed=(Math.random()*1e9)|0;chooseKind(k=>startWorld(i,null,k))});
  el.appendChild(s)}
 const ex=document.createElement('div');ex.className='slot';ex.innerHTML=`<h3>${profile?escapeHtml(profile.name)+' · '+LVL_NAME[lvlOf(profile)]:'You'}</h3>${avatarPreviewHTML(avatar)}<div>${escapeHtml(avatar.name)}</div>`;const ab=document.createElement('button');ab.textContent='🧑 My Avatar';ab.onclick=()=>openAvatarMaker(showMenu);ex.appendChild(ab);const sw=document.createElement('button');sw.className='sm';sw.textContent='🔄 Switch player';sw.onclick=()=>{saveProg();document.getElementById('menu').classList.add('hidden');showLogin()};ex.appendChild(sw);el.appendChild(ex);
 {const t=document.createElement('div');t.className='slot together';t.innerHTML='<h3>👫 Play Together</h3><p>One iPad hosts, the others join with the room code</p>';const hb=document.createElement('button');hb.className='green';hb.textContent='📡 Host';hb.onclick=hostShared;t.appendChild(hb);const jb=document.createElement('button');jb.textContent='🔗 Join';jb.onclick=askRoomCode;t.appendChild(jb);el.appendChild(t)}}
const escapeHtml=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ---------- mode buttons ----------
function updateModeUI(){document.getElementById('bMode').textContent=P.creative?'🎨 Creative':'🌱 Adventure';document.getElementById('bFly').classList.toggle('hidden',!P.creative);
 document.getElementById('bFly').textContent='🕊️ Fly: '+(P.fly?'on':'off');document.getElementById('bDown').classList.toggle('hidden',!P.fly)}
tapBtn('bMode',()=>{P.creative=!P.creative;if(!P.creative)P.fly=false;updateModeUI();drawHotbar();toast(P.creative?'Creative: build with everything!':'Adventure: collect blocks by breaking them!')});
tapBtn('bFly',()=>{P.fly=!P.fly;P.vel.y=0;updateModeUI()});
tapBtn('bMenu',()=>{save();if(net.on){net.on=false;net.ws&&net.ws.close();for(const id in net.remotes)removeRemote(id)}showMenu()});
tapBtn('bShot',()=>{renderer.render(scene,camera);document.getElementById('shotImg').src=cv.toDataURL('image/png');document.getElementById('shot').classList.remove('hidden')});
document.getElementById('shotClose').onclick=()=>document.getElementById('shot').classList.add('hidden');
// ---------- update loop ----------
let running=false,last=performance.now(),saveT=0,spawnT=0;
function updatePlayer(dt){let fx=input.jx,fz=input.jz;const k=input.keys;if(k.KeyW)fz=-1;if(k.KeyS)fz=1;if(k.KeyA)fx=-1;if(k.KeyD)fx=1;
 const jump=input.jump||k.Space,down=input.down||k.ShiftLeft;const sp=P.fly?8:4.5,s=Math.sin(P.yaw),c=Math.cos(P.yaw);
 const mx=(fx*c+fz*s)*sp,mz=(-fx*s+fz*c)*sp;const inWater=get(Math.floor(P.pos.x),Math.floor(P.pos.y+0.5),Math.floor(P.pos.z))===B.WATER;
 if(P.fly){P.vel.y=jump?6:down?-6:0}else{P.vel.y-=(inWater?8:22)*dt;if(inWater){P.vel.y=Math.max(P.vel.y,-2);if(jump)P.vel.y=3}else if(jump&&P.ground)P.vel.y=7.5}
 P.vel.y=Math.max(P.vel.y,-25);
 // auto step-up helps little kids
 const bx=moveAxis('x',mx*dt),bz=moveAxis('z',mz*dt);if((bx||bz)&&P.ground&&!P.fly){const up=P.pos.clone();up.y+=1.05;if(!collides(up)){P.vel.y=Math.max(P.vel.y,6.2)}}
 const hitY=moveAxis('y',P.vel.y*dt);P.ground=hitY&&P.vel.y<0;if(hitY)P.vel.y=0;
 if(P.pos.y<-10){spawnPlayer();toast('Whoosh! Back home 🏡')} // gentle respawn
 P.pos.x=THREE.MathUtils.clamp(P.pos.x,0.5,WX-0.5);P.pos.z=THREE.MathUtils.clamp(P.pos.z,0.5,WZ-0.5);
 camera.position.set(P.pos.x,P.pos.y+1.55,P.pos.z);camera.rotation.set(P.pitch,P.yaw,0,'YXZ')}
function updateCritters(dt,t){for(const c of critters.slice()){const m=c.mesh,K=KINDS[c.kind];c.t+=dt;if(c.fixed&&!c.owned){if(c.swim){c.ang=(c.ang||Math.random()*6)+dt*0.6;m.position.x=c.hx+Math.cos(c.ang)*2.5;m.position.z=c.hz+Math.sin(c.ang)*2.5;m.rotation.y=-c.ang;if(m.userData.tail)m.userData.tail.rotation.y=Math.sin(t*10)*0.6;m.position.y=c.homeY+Math.sin(t*2+c.hx)*0.2;continue}m.position.y=c.homeY+(c.kind==='nessie'?Math.sin(t*1.5)*0.15:0);m.rotation.y=Math.sin(t*0.5+c.t)*0.6;if(m.userData.tail)m.userData.tail.rotation.y=Math.sin(t*4)*0.5;continue}let tx=null,tz=null,speed=1.2;
 const dp=m.position.distanceTo(P.pos);
 if(c.owned&&!c.sit){if(dp>3){tx=P.pos.x;tz=P.pos.z;speed=Math.min(7,dp)}if(dp>30){m.position.set(P.pos.x+1,P.pos.y,P.pos.z+1)}}
 else if(c.friend){if(dp>4){tx=P.pos.x;tz=P.pos.z;speed=2.5}}
 else if(!c.sit||!c.owned){if(!c.target||c.t>4){c.t=0;c.target=Math.random()<0.4?null:[m.position.x+(Math.random()-0.5)*8,m.position.z+(Math.random()-0.5)*8]}if(c.target){tx=c.target[0];tz=c.target[1]}}
 if(c.night&&!c.friend&&!isNight()){m.scale.multiplyScalar(0.97);if(m.scale.x<0.1){removeCritter(c);continue}} // fade away at sunrise
 let moving=false;if(tx!==null){const dx=tx-m.position.x,dz=tz-m.position.z,L=Math.hypot(dx,dz);if(L>0.3){moving=true;const nx=m.position.x+dx/L*speed*dt,nz=m.position.z+dz/L*speed*dt;
  const ty=topY(Math.floor(nx),Math.floor(nz))+1;const cy=m.position.y;if(ty-cy<=1.2||K==='x'||c.kind==='ghost'||c.kind==='dragon'){m.position.x=THREE.MathUtils.clamp(nx,1,WX-1);m.position.z=THREE.MathUtils.clamp(nz,1,WZ-1)}else c.target=null;
  m.rotation.y=Math.atan2(dx,dz)}}
 const gy=Math.max(topY(Math.floor(m.position.x),Math.floor(m.position.z))+1,SEA+0.6);
 const hover=c.kind==='ghost'?1+Math.sin(t*2+c.t)*0.3:(c.kind==='dragon'&&moving&&c.owned)?0.6:0;
 m.position.y+= (gy+hover-m.position.y)*Math.min(1,dt*8);
 if(c.kind==='jelly'){const sq=1+Math.sin(t*6+m.id)*0.12;m.userData.body.scale.set(1/sq,sq,1/sq);if(moving)m.position.y+=Math.abs(Math.sin(t*6))*0.3}
 if(m.userData.tail)m.userData.tail.rotation.y=Math.sin(t*(c.owned?12:4))*0.5;
 if(m.userData.wl){m.userData.wl.rotation.z=Math.sin(t*10)*0.5;m.userData.wr.rotation.z=-Math.sin(t*10)*0.5}
 if(c.friend&&!K.pet)m.rotation.y+=dt*2;}}
function spawnNightFriends(){const n=critters.filter(c=>c.night).length;if(!isNight()||n>=6)return;const a=Math.random()*Math.PI*2,r=10+Math.random()*10;
 const x=THREE.MathUtils.clamp(P.pos.x+Math.cos(a)*r,2,WX-2),z=THREE.MathUtils.clamp(P.pos.z+Math.sin(a)*r,2,WZ-2);spawnCritter(Math.random()<0.5?'jelly':'ghost',x,z)}
function loop(now){requestAnimationFrame(loop);const dt=Math.min(0.05,(now-last)/1000);last=now;if(!running)return;
 if(panel.classList.contains('hidden')&&LO.classList.contains('hidden'))updatePlayer(dt);learnLoop(dt);
 tod=(tod+dt/DAY_LEN)%1;updateSky();updateCritters(dt,now/1000);
 let rebuilt=0;for(const k of dirtySet){if(rebuilt++>=3)break;dirtySet.delete(k);const[a,b]=k.split(',').map(Number);if(a>=0&&b>=0&&a<NC&&b<NC)buildChunk(a,b)}
 flushNet(dt);updateMini(dt);updateGhost();const h=rayBlock();hl.visible=!!h&&!ghost;if(h)hl.position.set(h.x+0.5,h.y+0.5,h.z+0.5);
 for(const p of parts.slice()){p.life-=dt;if(!p.noGrav)p.v.y-=9*dt;p.m.position.addScaledVector(p.v,dt);if(p.life<=0){scene.remove(p.m);parts.splice(parts.indexOf(p),1)}}
 spawnT+=dt;if(spawnT>6){spawnT=0;spawnNightFriends()}
 saveT+=dt;if(saveT>30){saveT=0;save(true)}
 updateSelf();renderer.render(scene,camera)}
addEventListener('visibilitychange',()=>{if(document.hidden&&running)save(true)});
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});

// ---------- building & furniture library (original designs) ----------
const W=17,R=10,O=11,Y=12,BL=14,PU=15,PK=16,PL=8,LOG=6,GL=9,BR=18,LP=19,BK=21,TE=22,ST=3,LF=7,ME=24,SC=25,TC=26;
function F(c,x0,y0,z0,x1,y1,z1,id){for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)c.push([x,y,z,id]);return c}
const FURN={
 bed:{e:'🛏️',n:'Bed',f:c=>{F(c,0,0,-1,0,1,-1,PL);F(c,0,0,0,0,0,0,W);F(c,0,0,1,0,0,2,R)}},
 bunk:{e:'🪜',n:'Bunk Bed',f:c=>{F(c,0,0,-1,0,3,-1,LOG);F(c,0,0,3,0,3,3,LOG);F(c,0,0,0,0,0,0,W);F(c,0,0,1,0,0,2,BL);F(c,0,2,0,0,2,0,W);F(c,0,2,1,0,2,2,R)}},
 couch:{e:'🛋️',n:'Couch',f:c=>{F(c,0,0,0,2,0,0,BL);F(c,0,0,-1,2,1,-1,BL);F(c,-1,0,-1,-1,0,0,BL);F(c,3,0,-1,3,0,0,BL)}},
 chair:{e:'🪑',n:'Chair',f:c=>{F(c,0,0,0,0,0,0,PL);F(c,0,0,-1,0,1,-1,PL)}},
 table:{e:'🍽️',n:'Table',f:c=>{F(c,0,0,0,0,0,1,LOG);F(c,2,0,0,2,0,1,LOG);F(c,0,1,0,2,1,1,PL)}},
 desk:{e:'🖥️',n:'Desk',f:c=>{F(c,0,0,0,0,0,0,LOG);F(c,2,0,0,2,0,0,LOG);F(c,0,1,0,2,1,0,PL);F(c,1,2,0,1,2,0,SC);F(c,2,2,0,2,2,0,LP)}},
 shelf:{e:'📚',n:'Bookshelf',f:c=>{F(c,0,0,0,0,3,0,PL);F(c,2,0,0,2,3,0,PL);F(c,1,3,0,1,3,0,PL);c.push([1,0,0,R],[1,1,0,BL],[1,2,0,Y])}},
 lamp:{e:'💡',n:'Lamp',f:c=>{F(c,0,0,0,0,1,0,LOG);c.push([0,2,0,LP])}},
 tv:{e:'📺',n:'TV',f:c=>{F(c,0,0,0,2,0,0,PL);F(c,0,1,0,2,2,0,SC)}},
 counter:{e:'🧑‍🍳',n:'Counter',f:c=>{F(c,0,0,0,2,0,0,PL);F(c,0,2,-0,2,2,0,PL)}},
 fridge:{e:'🧊',n:'Fridge',f:c=>{F(c,0,0,0,0,2,0,W);c.push([0,1,0,ME])}},
 stove:{e:'🍳',n:'Stove',f:c=>{F(c,0,0,0,1,0,0,BK);F(c,0,2,0,1,2,0,ME)}},
 sink:{e:'🚰',n:'Sink',f:c=>{c.push([0,0,0,PL],[0,1,-1,ME],[0,0,1,PL]);c.push([0,1,1,TE])}},
 tub:{e:'🛁',n:'Bathtub',f:c=>{F(c,0,0,0,3,0,2,W);F(c,0,1,0,3,1,0,W);F(c,0,1,2,3,1,2,W);F(c,0,1,1,0,1,1,W);F(c,3,1,1,3,1,1,W);F(c,1,1,1,2,1,1,5)}},
 toilet:{e:'🚽',n:'Toilet',f:c=>{F(c,0,0,0,0,0,1,W);c.push([0,1,0,W])}},
 rug:{e:'🟪',n:'Rug',f:c=>{F(c,-1,-1,-1,1,-1,1,PU);c.push([0,-1,0,PK])}},
 plant:{e:'🪴',n:'Plant',f:c=>{c.push([0,0,0,TC],[0,1,0,LF],[0,2,0,LF])}},
 petbed:{e:'🐾',n:'Pet Bed',f:c=>{F(c,-1,0,-1,1,0,1,PK);c.push([0,0,0,0],[0,-1,0,W])}},
 fireplace:{e:'🔥',n:'Fireplace',f:c=>{F(c,0,0,0,2,2,0,BR);c.push([1,0,0,O]);F(c,1,3,0,1,4,0,BR)}},
 piano:{e:'🎹',n:'Piano',f:c=>{F(c,0,0,0,2,0,1,BK);F(c,0,1,0,2,2,0,BK);F(c,0,1,1,2,1,1,W)}},
 toys:{e:'🧸',n:'Toy Chest',f:c=>{F(c,0,0,0,1,0,0,R);F(c,0,1,0,1,1,0,Y)}},
};
function cellsOf(key){const c=[];FURN[key].f(c);return c.filter(a=>a)}
function rotCells(c,r){return c.map(([x,y,z,id])=>{for(let i=0;i<r;i++){const t=x;x=-z;z=t}return[x,y,z,id]})}
function addFurn(c,key,ox,oy,oz,r=0){for(const[x,y,z,id]of rotCells(cellsOf(key),r))c.push([ox+x,oy+y,oz+z,id])}
function house(furnished){const c=[];F(c,-3,0,-3,3,5,3,0);F(c,-3,-1,-3,3,-1,3,PL);
 F(c,-3,0,-3,3,3,-3,BR);F(c,-3,0,3,3,3,3,BR);F(c,-3,0,-3,-3,3,3,BR);F(c,3,0,-3,3,3,3,BR);
 c.push([0,0,3,0],[0,1,3,0]);F(c,-3,1,-1,-3,2,1,GL);F(c,3,1,-1,3,2,1,GL);F(c,-2,1,-3,-1,2,-3,GL);
 for(let i=0;i<3;i++)F(c,-3+i,4+i,-3+i,3-i,4+i,3-i,R);c.push([0,7,0,R]);
 if(furnished){addFurn(c,'bed',-2,0,-1,0);addFurn(c,'fireplace',0,0,-2,0);addFurn(c,'table',1,0,0,0);addFurn(c,'chair',1,0,2,2);
  addFurn(c,'rug',-1,0,1);addFurn(c,'plant',2,0,2);addFurn(c,'lamp',-2,0,2);addFurn(c,'petbed',2,0,-2)}return c}
function bigHouse(furnished){const c=[];F(c,-5,0,-4,5,9,4,0);F(c,-5,-1,-4,5,-1,4,PL);
 F(c,-5,0,-4,5,7,-4,PL);F(c,-5,0,4,5,7,4,PL);F(c,-5,0,-4,-5,7,4,PL);F(c,5,0,-4,5,7,4,PL);
 F(c,-4,4,-3,4,4,3,PL);F(c,1,4,-3,4,4,-3,0); // floor 2 + stair hole
 for(let i=0;i<4;i++)F(c,1+i,i,-3,1+i,i,-3,ST); // stairs along back wall
 c.push([0,0,4,0],[0,1,4,0]);F(c,-5,1,-2,-5,2,2,GL);F(c,5,1,0,5,2,2,GL);F(c,-5,5,-2,-5,6,2,GL);F(c,5,5,-2,5,6,2,GL);F(c,-3,5,4,3,6,4,GL);
 for(let i=0;i<4;i++)F(c,-5+i,8+i,-4+i,5-i,8+i,4-i,BL);
 if(furnished){addFurn(c,'counter',-4,0,-3,0);addFurn(c,'stove',-4,0,-2,1);addFurn(c,'fridge',-4,0,0);addFurn(c,'sink',-2,0,-2,0);
  addFurn(c,'couch',1,0,2,2);addFurn(c,'tv',1,0,-1,0);addFurn(c,'rug',2,0,0);addFurn(c,'piano',-3,0,2,0);addFurn(c,'plant',4,0,3);addFurn(c,'lamp',-4,0,3);
  addFurn(c,'bunk',-4,5,-2,0);addFurn(c,'bed',-2,5,-2,0);addFurn(c,'desk',1,5,2,2);addFurn(c,'toys',-4,5,3);addFurn(c,'tub',1,5,-1,0);addFurn(c,'toilet',4,5,0,0);addFurn(c,'petbed',-1,5,2);addFurn(c,'shelf',-1,5,-3)}return c}
const BUILDS={cottage:{e:'🏡',n:'Cozy Cottage',f:()=>house(true)},cottage0:{e:'🏠',n:'Cottage (empty)',f:()=>house(false)},
 big:{e:'🏘️',n:'Big Family House',f:()=>bigHouse(true)},big0:{e:'🏚️',n:'Big House (empty)',f:()=>bigHouse(false)}};
// ghost preview
let ghostKey=null,ghostRot=0,ghostCells=[],ghostAt=null;const undoStack=[];
const ghostMat=new THREE.MeshBasicMaterial({transparent:true,opacity:0.5,depthWrite:false});let ghost=null;
function setGhost(key){ghostKey=key;if(ghost){scene.remove(ghost);ghost.dispose()}ghost=null;if(!key){document.getElementById('buildBar').classList.add('hidden');return}
 const raw=FURN[key]?cellsOf(key):DECOR[key]?(()=>{const c=[];DECOR[key].f(c);return c})():BUILDS[key].f();ghostCells=rotCells(raw,ghostRot);const solid=ghostCells.filter(a=>a[3]);
 ghost=new THREE.InstancedMesh(new THREE.BoxGeometry(1.002,1.002,1.002),ghostMat,solid.length);const m=new THREE.Matrix4(),col=new THREE.Color();
 solid.forEach(([x,y,z,id],i)=>{m.makeTranslation(x+0.5,y+0.5,z+0.5);ghost.setMatrixAt(i,m);ghost.setColorAt(i,col.set(BLOCKS[id][1]))});
 ghost.renderOrder=3;scene.add(ghost);document.getElementById('buildBar').classList.remove('hidden');document.getElementById('bbName').textContent=(FURN[key]||DECOR[key]||BUILDS[key]).n}
function updateGhost(){if(!ghost)return;const h=rayBlock(14);if(!h){ghost.visible=false;ghostAt=null;return}
 ghostAt=[h.x+h.n[0],h.y+h.n[1],h.z+h.n[2]];if(h.n[1]!==1)ghostAt=[h.x+h.n[0],h.y,h.z+h.n[2]];if(BUILDS[ghostKey]){const d=ghostKey.startsWith('big')?7:5;ghostAt[0]+=Math.round(-Math.sin(P.yaw)*d);ghostAt[2]+=Math.round(-Math.cos(P.yaw)*d)}ghost.visible=true;ghost.position.set(...ghostAt)}
function confirmGhost(){if(!ghostAt)return toast('Point at the ground first!');const [ax,ay,az]=ghostAt,old=[];
 for(const[x,y,z,id]of ghostCells){const X=ax+x,Y=ay+y,Z=az+z;if(Y<1||Y>=WY||X<0||Z<0||X>=WX||Z>=WZ)continue;old.push([X,Y,Z,get(X,Y,Z)]);set(X,Y,Z,id)}
 // nudge player out if buried
 for(let i=0;i<12&&collides(P.pos);i++)P.pos.y+=1;
 undoStack.push(old);if(undoStack.length>20)undoStack.shift();burst(ax+0.5,ay+1,az+0.5,0,25,true);toast('Built! 🎉 (↩️ to undo)');
 if(DECOR[ghostKey]&&prog){prog.inv[ghostKey]--;saveProg();if(prog.inv[ghostKey]<=0){delete prog.inv[ghostKey];saveProg();setGhost(null);toast('Placed your last one! 🎉')}else toast(`Placed! ${prog.inv[ghostKey]} left in My Stuff`)}}
function undo(){const old=undoStack.pop();if(!old)return toast('Nothing to undo');for(let i=old.length-1;i>=0;i--){const[x,y,z,b]=old[i];set(x,y,z,b)}toast('Undone ↩️')}
function openLibrary(tab='furn'){const L=tab==='furn'?FURN:BUILDS;
 panel.innerHTML=`<div class="tabs"><button class="${tab==='furn'?'green':''}" id="tF">🛋️ Furniture</button><button class="${tab==='build'?'green':''}" id="tB">🏠 Buildings</button><button class="red" id="tX">✖</button></div><div class="lib"></div>`;
 const lib=panel.querySelector('.lib');for(const k in L){const b=document.createElement('button');b.className='libItem';b.innerHTML=`<big>${L[k].e}</big><small>${L[k].n}</small>`;b.onclick=()=>{hidePanel();ghostRot=0;setGhost(k)};lib.appendChild(b)}
 panel.querySelector('#tF').onclick=()=>openLibrary('furn');panel.querySelector('#tB').onclick=()=>openLibrary('build');panel.querySelector('#tX').onclick=hidePanel;panel.classList.remove('hidden')}
tapBtn('bBuild',()=>openLibrary());tapBtn('bUndo',undo);tapBtn('bbRot',()=>{ghostRot=(ghostRot+1)%4;setGhost(ghostKey)});tapBtn('bbOk',confirmGhost);tapBtn('bbX',()=>setGhost(null));
// hotbar arrows
function scrollStrip(el,d){el.scrollBy({left:d*el.clientWidth*0.8,behavior:'smooth'})}
tapBtn('hbL',()=>scrollStrip(hb,-1));tapBtn('hbR',()=>scrollStrip(hb,1));

// ===================== v2: more buildings, city world, avatars, multiplayer, map =====================
const CB=27,LV=28,SA=4,WA=5,GR=1,DI=2;
function ring(c,x0,z0,x1,z1,y0,y1,id){F(c,x0,y0,z0,x1,y1,z0,id);F(c,x0,y0,z1,x1,y1,z1,id);F(c,x0,y0,z0,x0,y1,z1,id);F(c,x1,y0,z0,x1,y1,z1,id)}
function rowHouse(col,furn){const c=[];F(c,-2,0,-3,2,8,2,0);F(c,-2,-1,-3,2,-1,2,PL);ring(c,-2,-3,2,2,0,7,col);F(c,-1,4,-2,1,4,1,PL);
 c.push([0,0,2,0],[0,1,2,0],[1,2,2,W]);F(c,-1,1,2,-1,2,2,GL);F(c,-1,5,2,1,6,2,GL);F(c,-2,8,-3,2,8,2,BK);F(c,1,9,-2,1,10,-2,BR);c.push([-1,4,-2,0]);F(c,1,1,-2,1,1,-2,ST);c.push([1,2,-2,ST],[1,3,-2,ST],[0,4,-2,0],[1,4,-2,0]);
 if(furn){addFurn(c,'couch',-1,0,0,1);addFurn(c,'lamp',-1,0,-2);addFurn(c,'bed',-1,5,-1,0);addFurn(c,'plant',1,5,1)}return c}
function pub(furn){const c=[];F(c,-4,0,-3,4,6,3,0);F(c,-4,-1,-3,4,-1,3,PL);ring(c,-4,-3,4,3,0,3,W);for(const x of[-4,0,4])F(c,x,0,3,x,3,3,LOG);F(c,-4,0,-3,-4,3,-3,LOG);F(c,4,0,-3,4,3,-3,LOG);
 c.push([1,0,3,0],[1,1,3,0]);F(c,-3,1,3,-1,2,3,GL);F(c,2,1,3,3,2,3,GL);for(let i=0;i<3;i++)F(c,-4,4+i,-3+i,4,4+i,3-i,BK);c.push([5,3,3,LOG],[5,2,3,Y]);
 if(furn){addFurn(c,'counter',-3,0,-2,0);addFurn(c,'fireplace',1,0,-2,0);addFurn(c,'table',-3,0,0,0);addFurn(c,'chair',-1,0,1,1);addFurn(c,'lamp',3,0,1)}return c}
function phoneBox(){const c=[];F(c,-1,0,-1,1,3,1,0);ring(c,-1,-1,1,1,0,2,R);F(c,-1,1,-1,-1,1,1,GL);F(c,1,1,-1,1,1,1,GL);c.push([0,0,1,0],[0,1,1,0]);F(c,-1,3,-1,1,3,1,R);c.push([0,4,0,LP],[0,0,0,BK]);return c}
function clockTower(){const c=[];F(c,-2,0,-2,2,24,2,0);ring(c,-2,-2,2,2,0,18,BR);c.push([0,0,2,0],[0,1,2,0]);
 for(const[a,b]of[[0,2],[0,-2],[2,0],[-2,0]]){const sx=a?0:1,sz=a?1:0;for(let d=-1;d<=1;d++)for(let y=14;y<=16;y++)c.push([a+d*sx,y,b+d*sz,W]);c.push([a,15,b,BK],[a+sx*0,16,b,BK])}
 for(let i=0;i<3;i++)F(c,-2+i,19+i,-2+i,2-i,19+i,2-i,TE);c.push([0,22,0,TE],[0,23,0,Y]);return c}
function castle(){const c=[];F(c,-7,0,-7,7,10,7,0);F(c,-7,-1,-7,7,-1,7,CB);ring(c,-7,-7,7,7,0,5,ST);for(let i=-7;i<=7;i+=2){c.push([i,6,-7,ST],[i,6,7,ST],[-7,6,i,ST],[7,6,i,ST])}
 F(c,-1,0,7,1,2,7,0);for(const x of[-7,7])for(const z of[-7,7]){F(c,x-1,0,z-1,x+1,8,z+1,ST);F(c,x,9,z,x,10,z,LOG);c.push([x+1,10,z,R],[x+1,9,z,R])}
 F(c,-3,0,-5,3,4,-2,ST);F(c,-2,0,-4,2,3,-3,0);c.push([0,0,-2,0],[0,1,-2,0]);addFurn(c,'bed',-1,0,-3,1);return c}
function treeHouse(){const c=[];F(c,-3,0,-3,3,12,3,0);F(c,0,0,0,0,6,0,LOG);F(c,-2,6,-2,2,6,2,PL);ring(c,-2,-2,2,2,7,8,PL);c.push([0,7,2,0],[0,8,2,0]);F(c,-2,8,-1,-2,8,1,GL);
 for(let i=0;i<3;i++)F(c,-3+i,9+i,-3+i,3-i,9+i,3-i,LF);for(let i=0;i<6;i++)c.push([-2+i,i,3,PL]);addFurn(c,'toys',-1,7,-1);return c}
function beachHut(){const c=[];F(c,-2,0,-2,2,5,2,0);F(c,-2,-1,-2,2,-1,2,PL);for(let y=0;y<3;y++)ring(c,-2,-2,2,2,y,y,y%2?W:[TE,PK,Y][0]);c.push([0,0,2,0],[0,1,2,0]);F(c,-2,3,-2,2,3,2,TE);F(c,-1,4,-1,1,4,1,TE);return c}
function lighthouse(){const c=[];F(c,-3,0,-3,3,20,3,0);for(let y=0;y<16;y++){const id=(y/3|0)%2?W:R;for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++){const d=Math.abs(x)+Math.abs(z);if(d===3||(d===2&&Math.abs(x)===1)||(Math.abs(x)===2&&z===0)||(Math.abs(z)===2&&x===0))c.push([x,y,z,id])}}
 c.push([0,0,2,0],[0,1,2,0]);for(let i=0;i<15;i++){const a=[[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]][i%8];c.push([a[0],i,a[1],PL])}
 F(c,-2,16,-2,2,16,2,W);F(c,-1,17,-1,1,18,1,GL);c.push([0,17,0,LP],[0,18,0,LP]);F(c,-1,19,-1,1,19,1,R);c.push([0,20,0,R]);return c}
function fountain(){const c=[];F(c,-2,0,-2,2,0,2,ST);F(c,-1,0,-1,1,0,1,WA);F(c,-2,-1,-2,2,-1,2,ST);c.push([0,0,0,ST],[0,1,0,ST],[0,2,0,ST],[0,3,0,WA]);return c}
function bridge(){const c=[];F(c,-5,0,-2,5,4,2,0);F(c,-5,0,-2,5,0,2,ST);F(c,-5,1,-2,5,1,-2,ST);F(c,-5,1,2,5,1,2,ST);F(c,-1,-1,-2,1,-1,2,ST);c.push([-5,2,-2,LP],[5,2,2,LP],[-5,2,2,LP],[5,2,-2,LP]);return c}
function tikiHut(){const c=[];F(c,-2,0,-2,2,5,2,0);for(const x of[-2,2])for(const z of[-2,2])F(c,x,0,z,x,2,z,LOG);F(c,-3,3,-3,3,3,3,SA);F(c,-2,4,-2,2,4,2,SA);c.push([0,5,0,SA],[3,0,3,LOG],[3,1,3,LOG],[3,2,3,O]);addFurn(c,'rug',0,0,0);return c}
function palm(h=6){const c=[];for(let y=0;y<h;y++)c.push([y>3?1:0,y,0,LOG]);const t=[1,h,0];c.push([t[0],t[1],t[2],LF]);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])for(let i=1;i<=3;i++)c.push([t[0]+a*i,t[1]-(i>2?1:0),t[2]+b*i,LF]);return c}
function beachHouse(furn){const c=[];F(c,-3,0,-3,3,8,3,0);for(const x of[-3,3])for(const z of[-3,3])F(c,x,0,z,x,1,z,LOG);F(c,-3,2,-3,3,2,4,PL);ring(c,-3,-3,3,3,3,5,TE);F(c,-3,3,-3,3,3,3,TE);F(c,-2,3,-2,2,5,2,0);
 c.push([0,3,3,0],[0,4,3,0]);F(c,-2,4,3,-1,4,3,GL);F(c,1,4,3,2,4,3,GL);F(c,-3,6,-3,3,6,3,W);F(c,-2,7,-2,2,7,2,W);c.push([0,1,5,PL],[0,0,6,PL]);
 if(furn){addFurn(c,'bed',-2,3,-1,0);addFurn(c,'couch',0,3,-1,0);addFurn(c,'plant',2,3,2)}return c}
Object.assign(BUILDS,{row:{e:'🏘️',n:'Row House',f:()=>rowHouse(BR,true)},pub:{e:'🍺',n:'Old Inn',f:()=>pub(true)},phone:{e:'☎️',n:'Phone Booth',f:phoneBox},
 clock:{e:'🕰️',n:'Clock Tower',f:clockTower},castle:{e:'🏰',n:'Castle',f:castle},tree:{e:'🌳',n:'Treehouse',f:treeHouse},hut:{e:'⛱️',n:'Beach Hut',f:beachHut},
 light:{e:'🗼',n:'Lighthouse',f:lighthouse},fount:{e:'⛲',n:'Fountain',f:fountain},bridge:{e:'🌉',n:'Stone Bridge',f:bridge},tiki:{e:'🛖',n:'Tiki Hut',f:tikiHut},
 palm:{e:'🌴',n:'Palm Tree',f:()=>palm(6)},beach:{e:'🏖️',n:'Beach House',f:()=>beachHouse(true)},beach0:{e:'🏝️',n:'Beach House (empty)',f:()=>beachHouse(false)}});
// ---- city world: England (west) + Hawaii (east) ----
let spawnXZ=[WX/2,WZ/2],worldKind='nature';
function stamp(cells,ax,ay,az,r=0){for(const[x,y,z,id]of rotCells(cells,r)){const X=ax+x,Y=ay+y,Z=az+z;if(X>=0&&Z>=0&&X<WX&&Z<WZ&&Y>0&&Y<WY)world[idx(X,Y,Z)]=id}}
function col(x,z,top,topId,under=DI){for(let y=0;y<=top;y++)world[idx(x,y,z)]=y<top-3?ST:y<top?under:topId}
function generateCity(s){world=new Uint8Array(WX*WY*WZ);const n=noise2(s),r=rng(s+3),G=16;
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){
  if(x<64){let h=G;if(z<36||z>104)h+=Math.floor(n(x/14,z/14)*7*Math.min(1,Math.abs(z<36?36-z:z-104)/10));
   const e=Math.min(x,z,WZ-1-z);if(e<4)h=Math.min(h,G-1-(4-e));col(x,z,h,GR)}
  else{const vx=x-86,vz=z-98,vd=Math.hypot(vx,vz);let h=G;let top=GR;
   if(x>92){h=G-Math.floor((x-92)/4);top=SA}if(x>=70&&x<=92&&(z<14||z>118))top=SA;
   if(vd<20){h=Math.max(h,Math.floor(G+(20-vd)*1.25));top=vd<14?ST:GR}
   h=Math.max(4,h);col(x,z,h,top,top===SA?SA:DI);if(vd<20&&vd>14)world[idx(x,h,z)]=BK;
   if(vd<4){for(let y=h-2;y<=h;y++)world[idx(x,y,z)]=y===h?LV:BK}}
  for(let y=1;y<=SEA;y++)if(!world[idx(x,y,z)])world[idx(x,y,z)]=WA}
 // river + bridge (England)
 for(let z=0;z<WZ;z++)for(let x=38;x<=42;x++){for(let y=G-3;y<=G+12;y++)world[idx(x,y,z)]=0;for(let y=G-4;y<G;y++)world[idx(x,y,z)]=WA;world[idx(x,G-5,z)]=SA}
 // cobbled streets
 for(let x=4;x<70;x++)for(let z=61;z<=66;z++)world[idx(x,G,z)]=CB;for(let z=20;z<110;z++)for(let x=18;x<=21;x++)world[idx(x,G,z)]=CB;
 for(let z=40;z<=88;z++)for(let x=54;x<=57;x++)world[idx(x,G,z)]=CB;
 stamp(bridge(),40,G,63,0);stamp(bridge(),40,G,65,0);
 const cols=[BR,R,O,Y,W,BL,PK,TE];let i=0;
 for(const x0 of[6,11,26,31,46]){stamp(rowHouse(cols[i++%8],true),x0+2,G+1,57,0)} // north side, door faces street
 for(const x0 of[6,13]){stamp(rowHouse(cols[i++%8],true),x0+2,G+1,70,2)}
 stamp(pub(true),31,G+1,72,2);stamp(phoneBox(),23,G+1,68,2);stamp(phoneBox(),44,G+1,68,2);stamp(phoneBox(),60,G+1,59,0);
 stamp(clockTower(),50,G+1,72,2);stamp(fountain(),62,G+1,63,0);
 for(const[x,z,rr]of[[10,90,0],[30,92,0],[48,94,0],[30,30,2],[50,28,2]])stamp(house(true),x,(x<64?topY(x,z):G)+1,z,rr);
 stamp(castle(),9,topY(9,20)+1,20,0);
 for(let k=0;k<40;k++){const x=4+r()*30|0,z=r()<0.5?4+r()*28|0:108+r()*16|0;const y=topY(x,z);if(world[idx(x,y,z)]===GR&&!world[idx(x,y+1,z)])world[idx(x,y+1,z)]=LF} // hedges
 // Hawaii
 for(let k=0;k<45;k++){const x=66+r()*48|0,z=4+r()*120|0;if(Math.hypot(x-86,z-98)<21)continue;const y=topY(x,z);const b=world[idx(x,y,z)];if((b===SA||b===GR)&&y>SEA&&!world[idx(x,y+1,z)])stamp(palm(5+(r()*3|0)),x,y+1,z,r()*4|0)}
 for(const z of[20,38,56])stamp(beachHouse(true),100,topY(100,z)+1,z,1);
 for(const[x,z]of[[80,30],[80,48],[90,66]])stamp(tikiHut(),x,topY(x,z)+1,z,0);
 stamp(beachHut(),106,topY(106,74)+1,74,1);stamp(lighthouse(),120,SEA+1,8,0);for(let y=1;y<=SEA;y++)F([],0,0,0,0,0,0,0);
 for(let x=104;x<126;x++){for(let z=80;z<=82;z++)world[idx(x,SEA+2,z)]=PL;if(x%4===0)for(let y=1;y<=SEA+1;y++){world[idx(x,y,80)]=LOG;world[idx(x,y,82)]=LOG}} // boardwalk
 for(let x=104;x<=105;x++)for(let z=80;z<=82;z++)for(let y=SEA+1;y<topY(x,z)+1;y++);
 stamp(treeHouse(),74,topY(74,64)+1,64,0);
 // plaza at spawn
 spawnXZ=[64,64];for(let x=60;x<=68;x++)for(let z=60;z<=68;z++){world[idx(x,G,z)]=CB;for(let y=G+1;y<G+6;y++)if(world[idx(x,y,z)]!==ST&&!(x===62))world[idx(x,y,z)]=world[idx(x,y,z)]}
}
// ---- avatar maker ----
const AV_KEY='blockland_avatar';
const AV_OPTS={skin:['#ffdbb5','#f1c27d','#c68642','#8d5524','#5c3a21','#e0ac69'],hair:['#2b1b10','#6b4423','#d9a441','#f2e3a0','#c0392b','#8e44ad','#3498db','#ffffff'],
 shirt:['#ef4b4b','#ff9a2e','#ffe23d','#5cbf4a','#3c7cff','#9b5cf0','#ff8ccf','#f4f4f4','#333344'],pants:['#2c4a8a','#333344','#8a5a36','#5cbf4a','#ff8ccf','#9b5cf0','#f4f4f4'],
 hat:['none','cap','crown','flower','bow','wizard','lei','sunhat']};
const HAT_EMOJI={none:'🚫',cap:'🧢',crown:'👑',flower:'🌺',bow:'🎀',wizard:'🧙',lei:'🌸',sunhat:'👒'};
let avatar=Object.assign({name:'Builder',skin:'#ffdbb5',hair:'#6b4423',shirt:'#3c7cff',pants:'#2c4a8a',hat:'cap'},JSON.parse(localStorage.getItem(AV_KEY)||'{}'));
function nameTag(text){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(255,255,255,0.85)';x.beginPath();x.roundRect(4,8,248,48,20);x.fill();
 x.fillStyle='#333';x.font='bold 30px sans-serif';x.textAlign='center';x.fillText(text,128,43);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(1.6,0.4,1);s.position.y=2.3;s.renderOrder=5;return s}
function makeAvatar(a,name){const g=new THREE.Group();const b=(w,h,d,c,x,y,z)=>box(w,h,d,new THREE.Color(c).getHex(),x,y,z,g);
 b(0.22,0.7,0.25,a.pants,-0.13,0.35,0);b(0.22,0.7,0.25,a.pants,0.13,0.35,0);b(0.55,0.65,0.3,a.shirt,0,1.02,0);
 g.userData.armL=b(0.18,0.6,0.22,a.shirt,-0.37,1.05,0);g.userData.armR=b(0.18,0.6,0.22,a.shirt,0.37,1.05,0);b(0.15,0.12,0.18,a.skin,-0.37,0.7,0);b(0.15,0.12,0.18,a.skin,0.37,0.7,0);
 b(0.5,0.5,0.5,a.skin,0,1.6,0);b(0.54,0.16,0.54,a.hair,0,1.86,-0.02);b(0.54,0.35,0.1,a.hair,0,1.68,-0.24);
 for(const s of[-1,1]){b(0.1,0.1,0.02,'#ffffff',s*0.11,1.63,0.255);b(0.05,0.07,0.03,'#222222',s*0.11,1.62,0.265)}b(0.16,0.04,0.02,'#c0392b',0,1.48,0.255);
 if(a.hat==='cap'){b(0.56,0.14,0.56,'#ef4b4b',0,1.98,0);b(0.4,0.04,0.25,'#ef4b4b',0,1.92,0.35)}
 if(a.hat==='crown'){b(0.5,0.12,0.5,'#ffd84a',0,2.0,0);for(const[x,z]of[[-.2,.2],[.2,.2],[-.2,-.2],[.2,-.2]])b(0.08,0.12,0.08,'#ffd84a',x,2.12,z)}
 if(a.hat==='flower'){b(0.16,0.16,0.06,'#ff8ccf',0.22,1.9,0.22);b(0.06,0.06,0.07,'#ffe23d',0.22,1.9,0.23)}
 if(a.hat==='bow'){b(0.14,0.12,0.06,'#ff5fa2',-0.08,1.98,0);b(0.14,0.12,0.06,'#ff5fa2',0.08,1.98,0)}
 if(a.hat==='lei'){for(let i=0;i<8;i++){const an=i/8*Math.PI*2;b(0.1,0.1,0.1,['#ff8ccf','#ffe23d','#ffffff'][i%3],Math.cos(an)*0.3,1.33,Math.sin(an)*0.18)}}
 if(a.hat==='sunhat'){b(0.9,0.05,0.9,'#f0dc8c',0,1.9,0);b(0.5,0.18,0.5,'#f0dc8c',0,2.0,0);b(0.52,0.06,0.52,'#ff8ccf',0,1.95,0)}
 if(a.hat==='wizard'){b(0.56,0.06,0.56,'#6c4ad6',0,1.96,0);b(0.36,0.2,0.36,'#6c4ad6',0,2.08,0);b(0.2,0.2,0.2,'#6c4ad6',0,2.26,0);b(0.06,0.06,0.06,'#ffe23d',0,2.4,0)}
 if(name){g.userData.tag=nameTag(name);g.add(g.userData.tag)}return g}
function avatarPreviewHTML(a){return `<div class="avp"><div style="background:${a.hair};height:14px;border-radius:6px 6px 0 0"></div><div class="avh" style="background:${a.skin}">• •<br><span>‿</span></div>
 <div style="background:${a.shirt};height:44px;border-radius:6px"></div><div style="display:flex;gap:4px"><div style="background:${a.pants};height:40px;flex:1"></div><div style="background:${a.pants};height:40px;flex:1"></div></div><div class="avhat">${a.hat==='none'?'':HAT_EMOJI[a.hat]}</div></div>`}
function openAvatarMaker(done){const m=document.getElementById('avmaker');m.classList.remove('hidden');const draw=()=>{let h=`<h2>Make your buddy!</h2><div class="avrow">${avatarPreviewHTML(avatar)}<div class="avopts">`;
  for(const k of['skin','hair','shirt','pants'])h+=`<div class="avl"><b>${{skin:'Skin',hair:'Hair',shirt:'Shirt',pants:'Pants'}[k]}</b>${AV_OPTS[k].map(c=>`<button class="sw${avatar[k]===c?' on':''}" data-k="${k}" data-v="${c}" style="background:${c}"></button>`).join('')}</div>`;
  h+=`<div class="avl"><b>Hat</b>${AV_OPTS.hat.filter(v=>!['lei','sunhat'].includes(v)||(avatar.unlocks||[]).includes(v)).map(v=>`<button class="sw hat${avatar.hat===v?' on':''}" data-k="hat" data-v="${v}">${HAT_EMOJI[v]}</button>`).join('')}</div>`;
  h+=`<div class="avl"><b>Name</b><span style="font-size:24px">${escapeHtml(avatar.name)}</span></div></div></div><button class="green" id="avDone">✅ Done</button>`;m.innerHTML=h;
  m.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{avatar[b.dataset.k]=b.dataset.v;draw()});
  m.querySelector('#avDone').onclick=()=>{localStorage.setItem(profile?'blockland_avatar_'+profile.id:AV_KEY,JSON.stringify(avatar));m.classList.add('hidden');refreshSelf();if(net.ws)netSend({t:'avatar',name:avatar.name,avatar});done&&done()}};draw()}
// own avatar (third-person view)
let selfMesh=null,thirdPerson=false;
function refreshSelf(){if(selfMesh)scene.remove(selfMesh);selfMesh=makeAvatar(avatar,null);selfMesh.visible=thirdPerson;scene.add(selfMesh)}
// ---- multiplayer ----
const EMOTES=['👋 Hi!','😄','❤️','👍 Yes!','👎 No','🏠 Come here!','🐶 Look at my pet!','🎉 Yay!','😂','🤔 Hmm','🙏 Thank you!','👀 Follow me!'];
const net={ws:null,id:0,remotes:{},queue:[],applying:false,posT:0,on:false};
function netSend(o){if(net.ws&&net.ws.readyState===1)net.ws.send(JSON.stringify(o))}
function addRemote(o){removeRemote(o.id);const m=makeAvatar(o.avatar||{},o.name);m.userData.name=o.name;scene.add(m);net.remotes[o.id]={mesh:m,name:o.name,target:o.pos||null,emoteT:0};if(o.pos)m.position.set(o.pos[0],o.pos[1],o.pos[2])}
function removeRemote(id){const r=net.remotes[id];if(r){scene.remove(r.mesh);delete net.remotes[id]}}
function emoteSprite(target,text){const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.roundRect(4,4,504,88,40);x.fill();x.fillStyle='#333';x.font='bold 48px sans-serif';x.textAlign='center';x.fillText(text,256,64);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(2.6,0.5,1);s.position.y=2.9;s.renderOrder=6;target.add(s);setTimeout(()=>target.remove(s),3500)}
function netCid(){let c=localStorage.getItem('blockland_cid');if(!c){c=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('blockland_cid',c)}return c}
function netStatus(kind,info){if(kind==='open'&&!net.on)card(`<div class="bigEmoji">📡</div><h2>Your room code is</h2><div class="roomCode">${info}</div><p>On the other iPad: 👫 Play Together → 🔗 Join, and type <b>${info}</b>.</p>`,[['OK, pick our world','green',closeCard]],{});
 else if(kind==='error'){net.ws=null;const m=info==='peer-unavailable'?'No room with that code. Check the code on the host iPad (it must have tapped 📡 Host first).':info==='full'?'That room is full.':'Could not connect. Both iPads need internet (Wi-Fi) for Play Together. Try again in a moment.';card(`<div class="bigEmoji">😕</div><h2>${m}</h2>`,[['OK','green',closeCard]])}
 else if(kind==='full')card(`<div class="bigEmoji">🚫</div><h2>That room is full.</h2>`,[['OK','green',closeCard]])}
function hostShared(){joinShared('host')}
function askRoomCode(){card(`<div class="bigEmoji">🔗</div><h2>Type the room code</h2><p>It's shown on the iPad that tapped 📡 Host.</p><input id="roomIn" class="roomIn" maxlength="4" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="ABCD">`,
 [['Cancel','red',closeCard],['▶️ Join','green',()=>{const c=(LO.querySelector('#roomIn').value||'').toUpperCase().replace(/[^A-Z]/g,'');if(c.length!==4){LO.querySelector('#roomIn').focus();return}card(`<h2>Joining room ${c}…</h2>`,[]);joinShared('join',c)}]]);setTimeout(()=>{const i=LO.querySelector('#roomIn');if(i)i.focus()},100)}
function joinShared(mode,code){if(net.ws&&net.ws.readyState<2)return;if(!window.BBNet||!BBNet.available){card('<h2>Play Together could not load. Check the internet connection and reopen the game.</h2>',[['OK','green',closeCard]]);return}
 for(const id in net.remotes)removeRemote(id);const ws=mode==='host'?BBNet.host(netStatus):BBNet.join(code,netStatus);net.ws=ws;if(mode==='host')card('<h2>📡 Making a room…</h2>',[['Cancel','red',()=>{closeCard();ws.close()}]]);
 ws.onopen=()=>{if(ws===net.ws)netSend({t:'hello',name:avatar.name,avatar,cid:netCid()})};
 ws.onmessage=ev=>{if(ws!==net.ws)return;const m=JSON.parse(ev.data);
  if(m.t==='welcome'){net.id=m.id;if(BBNet.role==='guest')closeCard();if(m.needWorld){net.others=m.others;chooseKind(kind=>netSend({t:'pick',kind}),(BBNet.role==='host'?'Room '+BBNet.code+': p':'P')+'ick the world you will share:',()=>{ws.close();net.ws=null})}
   else{world=rleDecode(m.w);worldName=m.meta.name||'Our World';seed=1;const mt=m.meta;worldKind=mt.kind||'nature';spawnXZ=mt.spawn||(mt.kind==='city'?[64,64]:[WX/2,WZ/2]);landmarks=mt.landmarks||[];secrets=mt.secrets||[];startShared(worldKind,m.others)}}
  else if(m.t==='needUpload'){seed=(Math.random()*1e9)|0;worldName={england:'England',hawaii:'Hawaii'}[m.kind]||'Nature';worldKind=m.kind;genKind(m.kind);netSend({t:'uploadWorld',w:rleEncode(world),name:worldName,kind:m.kind,spawn:spawnXZ,landmarks,secrets});startShared(m.kind,net.others||[])}
  else if(m.t==='sets'){quest.theirPlaced+=m.l.filter(e=>e[3]).length;net.applying=true;for(const[x,y,z,v]of m.l)set(x,y,z,v);net.applying=false}
  else if(m.t==='pos'){const r=net.remotes[m.id];if(r&&m.id!==net.id)r.target=m.p}
  else if(m.t==='join'){if(m.id===net.id)return;addRemote(m);toast(`👋 ${m.name} joined!`)}
  else if(m.t==='leave'){removeRemote(m.id);toast(`👋 ${m.name} left`)}
  else if(m.t==='avatar'){if(m.id===net.id)return;const r=net.remotes[m.id];addRemote({id:m.id,name:m.name,avatar:m.avatar,pos:r&&r.target})}
  else if(m.t==='emote'){if(m.id!==net.id)quest.heard=true;const r=net.remotes[m.id];const txt=EMOTES[m.i]||'';if(r)emoteSprite(r.mesh,txt);toast(`${m.name}: ${txt}`)}};
 ws.onclose=()=>{if(ws!==net.ws)return;document.getElementById('roomTag').classList.add('hidden');if(net.on){toast(BBNet.role==='host'?'Play Together stopped':'Lost connection to the host iPad 😢');net.on=false;for(const id in net.remotes)removeRemote(id);setTimeout(showMenu,1500)}net.ws=null}}
function startShared(kind,others){net.on=true;slot=-1;critters.slice().forEach(removeCritter);tod=0.3;P.creative=true;P.fly=false;P.inv={};spawnPlayer();populate();spawnSecrets();buildAll();buildMarkers();updateCoinUI();
 for(const id in net.remotes)removeRemote(id);for(const o of others||[])if(o.id!==net.id)addRemote(o);updateModeUI();drawHotbar();refreshSelf();document.getElementById('menu').classList.add('hidden');document.getElementById('hud').classList.remove('hidden');
 document.getElementById('bEmote').classList.remove('hidden');const rt=document.getElementById('roomTag');if(BBNet.code){rt.textContent='👫 Room '+BBNet.code;rt.classList.remove('hidden')}running=true;closeCard();toast('🌍 Playing together!'+(BBNet.role==='host'?' Room code: '+BBNet.code:''))}
setInterval(()=>netSend({t:'ping'}),10000);
function flushNet(dt){if(!net.on)return;if(net.queue.length){netSend({t:'sets',l:net.queue});net.queue=[]}net.posT+=dt;if(net.posT>0.1){net.posT=0;netSend({t:'pos',p:[+P.pos.x.toFixed(2),+P.pos.y.toFixed(2),+P.pos.z.toFixed(2),+P.yaw.toFixed(2)]})}
 for(const id in net.remotes){const r=net.remotes[id];if(!r.target)continue;const m=r.mesh,[x,y,z,yaw]=r.target;const dx=x-m.position.x,dz=z-m.position.z;const mv=Math.hypot(dx,dz)>0.05;if(Math.hypot(dx,dz,y-m.position.y)>6)m.position.set(x,y,z);
  m.position.x+=dx*Math.min(1,dt*10);m.position.y+=(y-m.position.y)*Math.min(1,dt*10);m.position.z+=dz*Math.min(1,dt*10);m.rotation.y=yaw+Math.PI;
  const sw=mv?Math.sin(performance.now()/120)*0.6:0;m.userData.armL.rotation.x=sw;m.userData.armR.rotation.x=-sw}}
// ---- map ----
const BCOL={};for(const id in BLOCKS)BCOL[id]=new THREE.Color(BLOCKS[id][1]);
let mapBase=null,mapBaseT=0;
function buildMapBase(){const c=document.createElement('canvas');c.width=WX;c.height=WZ;const x=c.getContext('2d'),img=x.createImageData(WX,WZ);
 for(let i=0;i<WX;i++)for(let k=0;k<WZ;k++){let y=WY-1,b=0;for(;y>0;y--){b=world[idx(i,y,k)];if(b)break}const cc=BCOL[b]||BCOL[3];const f=0.6+y/WY*0.8;const o=(k*WX+i)*4;img.data[o]=Math.min(255,cc.r*255*f);img.data[o+1]=Math.min(255,cc.g*255*f);img.data[o+2]=Math.min(255,cc.b*255*f);img.data[o+3]=255}
 x.putImageData(img,0,0);mapBase=c;mapBaseT=performance.now()}
function drawMap(cv,big){const x=cv.getContext('2d'),S=cv.width/WX;if(!mapBase||performance.now()-mapBaseT>(big?0:5000))buildMapBase();x.imageSmoothingEnabled=false;x.drawImage(mapBase,0,0,cv.width,cv.height);
 x.textAlign='center';x.textBaseline='middle';x.font=`${big?22:12}px sans-serif`;
 for(const c of critters){if(big||c.owned)x.fillText(c.owned?KINDS[c.kind].emoji:(KINDS[c.kind].pet?KINDS[c.kind].emoji:'✨'),c.mesh.position.x*S,c.mesh.position.z*S)}
 if(big)for(const l of landmarks){x.font='26px sans-serif';x.fillText(l.e,l.x*S,l.z*S);x.font='bold 15px sans-serif';x.lineWidth=4;x.strokeStyle='#000a';x.strokeText(l.n,l.x*S,l.z*S+22);x.fillStyle='#fff';x.fillText(l.n,l.x*S,l.z*S+22)}
 for(const id in net.remotes){const r=net.remotes[id].mesh.position;x.fillStyle='#3c7cff';x.beginPath();x.arc(r.x*S,r.z*S,big?9:4,0,7);x.fill();if(big){x.fillStyle='#fff';x.font='bold 18px sans-serif';x.fillText(net.remotes[id].name,r.x*S,r.z*S-18)}}
 const px=P.pos.x*S,pz=P.pos.z*S,a=P.yaw;x.save();x.translate(px,pz);x.rotate(-a);x.fillStyle='#ff3b3b';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();const k=big?14:7;x.moveTo(0,-k);x.lineTo(k*0.7,k*0.7);x.lineTo(-k*0.7,k*0.7);x.closePath();x.fill();x.stroke();x.restore()}
let miniOn=localStorage.getItem('blockland_mini')!=='0';
function openMap(){const ov=document.getElementById('mapView');ov.classList.remove('hidden');const lm=document.getElementById('lmList');lm.innerHTML='';for(const l of landmarks){const b=document.createElement('button');b.className='lmb';b.textContent=l.e+' '+l.n;b.onclick=()=>teleport(l.x,l.z+3);lm.appendChild(b)}const cv=document.getElementById('mapCanvas');drawMap(cv,true);document.getElementById('miniTog').textContent='Minimap: '+(miniOn?'on':'off')}
document.getElementById('mapCanvas').addEventListener('click',e=>{const cv=e.target,r=cv.getBoundingClientRect();let x=Math.floor((e.clientX-r.left)/r.width*WX),z=Math.floor((e.clientY-r.top)/r.height*WZ);
 for(const l of landmarks)if(Math.hypot(l.x-x,l.z-z)<4){x=l.x;z=l.z+3}teleport(Math.max(0,Math.min(WX-1,x)),Math.max(0,Math.min(WZ-1,z)))});
function chooseKind(cb,title='What kind of world?',onCancel){const m=document.getElementById('kindPick');m.classList.remove('hidden');m.innerHTML=`<h2>${title}</h2><button class="green kbtn" data-k="nature">🌳<br>Nature World<br><small>hills, lakes, forests</small></button><button class="green kbtn" data-k="england">🏰<br>England<br><small>Big Ben, Tower Bridge, castle, cliffs</small></button><button class="green kbtn" data-k="hawaii">🌋<br>Hawaii<br><small>volcano, beaches, reef, waterfall</small></button><br><button class="red" id="kCancel">Cancel</button>`;
 m.querySelectorAll('.kbtn').forEach(b=>b.onclick=()=>{m.classList.add('hidden');cb(b.dataset.k)});m.querySelector('#kCancel').onclick=()=>{m.classList.add('hidden');onCancel&&onCancel()}}
tapBtn('bMap',openMap);tapBtn('bView',()=>{thirdPerson=!thirdPerson;if(!selfMesh)refreshSelf();selfMesh.visible=thirdPerson});
tapBtn('bEmote',()=>{showPanel('Say something!',EMOTES.map((t,i)=>[t,'',()=>{netSend({t:'emote',i});quest.emoted=true;if(thirdPerson&&selfMesh)emoteSprite(selfMesh,t);hidePanel()}]).concat([['Close','red',hidePanel]]))});
document.getElementById('mapClose').onclick=()=>document.getElementById('mapView').classList.add('hidden');
document.getElementById('miniTog').onclick=()=>{miniOn=!miniOn;localStorage.setItem('blockland_mini',miniOn?'1':'0');document.getElementById('miniTog').textContent='Minimap: '+(miniOn?'on':'off')};
let miniT=0;function updateMini(dt){const cv=document.getElementById('mini');cv.classList.toggle('hidden',!miniOn);miniT+=dt;if(!miniOn||miniT<0.5)return;miniT=0;drawMap(cv,false)}
function updateSelf(){if(!selfMesh)return;selfMesh.visible=thirdPerson;if(!thirdPerson)return;selfMesh.position.set(P.pos.x,P.pos.y,P.pos.z);selfMesh.rotation.y=P.yaw+Math.PI;
 const d=new THREE.Vector3();camera.getWorldDirection(d);camera.position.addScaledVector(d,-4)}


// ===================== v3: England & Hawaii worlds, landmarks, secrets =====================
const CRY=29,STAR=30,RAIN=32;
let landmarks=[],secrets=[];
function carve(x,y,z){if(x>=0&&z>=0&&x<WX&&z<WZ&&y>0&&y<WY)world[idx(x,y,z)]=0}
function put(x,y,z,v){if(x>=0&&z>=0&&x<WX&&z<WZ&&y>0&&y<WY)world[idx(x,y,z)]=v}
function wget(x,y,z){return(x>=0&&z>=0&&x<WX&&z<WZ&&y>=0&&y<WY)?world[idx(x,y,z)]:0}
// walkable 3x3 tunnel, lit with crystals, solid floor
function tunnel(pts,light=CRY){let k=0;for(let i=0;i<pts.length-1;i++){const[a,b,c]=pts[i],[d,e,f]=pts[i+1];const n=Math.max(Math.abs(d-a),Math.abs(f-c),Math.abs(e-b)*2,1);
 for(let s=0;s<=n;s++){const x=Math.round(a+(d-a)*s/n),y=Math.round(b+(e-b)*s/n),z=Math.round(c+(f-c)*s/n);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){for(let dy=0;dy<3;dy++)carve(x+dx,y+dy,z+dz);const fl=wget(x+dx,y-1,z+dz);if(!fl||fl===WA)put(x+dx,y-1,z+dz,ST)}
  if(k++%5===0&&wget(x,y+3,z))put(x,y+3,z,light)}}}
function room(x0,y0,z0,x1,y1,z1,wall,lamp=LP){for(let x=x0-1;x<=x1+1;x++)for(let y=y0-1;y<=y1+1;y++)for(let z=z0-1;z<=z1+1;z++){const edge=x<x0||x>x1||y<y0||y>y1||z<z0||z>z1;if(edge){if(wall||!wget(x,y,z)||wget(x,y,z)===WA)put(x,y,z,wall||ST)}else carve(x,y,z)}
 put((x0+x1)>>1,y1+1,(z0+z1)>>1,lamp);put(x0,y1+1,z0,lamp);put(x1,y1+1,z1,lamp)}
function ground(x,z){return topY(x,z)}
function oak(x,y,z){for(let i=0;i<5;i++)put(x,y+i,z,LOG);for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=3;dy<=6;dy++)if(Math.abs(dx)+Math.abs(dz)+(dy>5?2:0)<=3&&!wget(x+dx,y+dy,z+dz))put(x+dx,y+dy,z+dz,LF)}
function jungleTree(x,y,z,r){const h=6+(r()*3|0);for(let i=0;i<h;i++)put(x,y+i,z,LOG);for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)for(let dy=h-2;dy<=h+1;dy++)if(dx*dx+dz*dz+(dy-h+1)*(dy-h+1)*2<=10&&!wget(x+dx,y+dy,z+dz))put(x+dx,y+dy,z+dz,LF)}
// --- landmark structures ---
function parliament(){const c=[];F(c,-10,0,-3,10,9,3,0);F(c,-10,0,-3,10,6,3,SA);F(c,-9,1,-2,9,5,2,0);F(c,-9,3,-2,9,3,2,SA);
 for(let x=-9;x<=9;x+=2){c.push([x,1,3,GL],[x,4,3,GL],[x,1,-3,GL],[x,4,-3,GL])}c.push([0,0,3,0],[0,1,3,0]);
 for(const x of[-10,-4,4,10]){F(c,x,7,-1,x,8,-1,SA);c.push([x,9,-1,BK])}F(c,-10,7,-3,10,7,-3,BK);F(c,-10,7,3,10,7,3,BK);addFurn(c,'couch',-6,1,0,0);addFurn(c,'couch',4,1,0,0);return c}
function bigBen(){const c=clockTower().map(([x,y,z,id])=>[x,y,z,id===BR?SA:id===TE?BK:id]);return c}
function towerBridge(){const c=[];F(c,-2,0,-9,2,16,9,0);F(c,-2,0,-9,2,0,9,ST);F(c,-2,1,-9,-2,1,9,BL);F(c,2,1,-9,2,1,9,BL);
 for(const z of[-5,5]){F(c,-2,-6,z-1,2,12,z+1,ST);F(c,-1,1,z-1,1,3,z+1,0);for(let i=0;i<3;i++)F(c,-2+i,13+i,z-1,2-i,13+i,z+1,BL);c.push([0,16,z,Y]);c.push([-2,8,z,GL],[2,8,z,GL])}
 F(c,-2,11,-4,2,11,4,BL);for(let i=0;i<4;i++){c.push([-2,11-i*2,-6-i,BL],[2,11-i*2,-6-i,BL],[-2,11-i*2,6+i,BL],[2,11-i*2,6+i,BL])}return c}
function royalPalace(){const c=[];F(c,-12,0,-3,12,7,14,0);F(c,-12,0,-3,12,5,3,W);F(c,-11,1,-2,11,4,2,0);F(c,-11,3,-2,11,3,2,W);
 for(let x=-11;x<=11;x+=2)c.push([x,1,3,GL],[x,4,3,GL]);c.push([0,0,3,0],[0,1,3,0],[0,6,0,LOG],[0,7,0,LOG],[1,7,0,R],[1,6,0,BL]);
 for(let x=-12;x<=12;x++)if(Math.abs(x)>1)c.push([x,0,9,BK]);c.push([-2,0,9,Y],[-2,1,9,Y],[2,0,9,Y],[2,1,9,Y]);
 addFurn(c,'shelf',-8,1,-2);addFurn(c,'piano',4,1,-2);addFurn(c,'rug',0,0,0);return c}
function bigWheel(){const c=[];const R0=8;for(let x=-9;x<=9;x++)for(let y=-9;y<=9;y++){const d=Math.hypot(x,y);if(Math.abs(d-R0)<0.55)c.push([x,y+10,0,W]);else if(d<R0&&(x===0||y===0||Math.abs(Math.abs(x)-Math.abs(y))<1)&&d>1)c.push([x,y+10,0,ME])}
 for(let a=0;a<8;a++){const x=Math.round(Math.cos(a*Math.PI/4)*R0),y=Math.round(Math.sin(a*Math.PI/4)*R0);c.push([x,y+10,1,TE],[x,y+10,-1,TE])}
 c.push([0,10,0,RAIN]); // secret: rainbow hub
 for(let i=0;i<10;i++){c.push([Math.round(-i*0.4)-1,i,0,ME],[Math.round(i*0.4)+1,i,0,ME])}return c}
function bus(){const c=[];F(c,-3,0,-1,3,5,1,0);F(c,-3,1,-1,3,5,1,R);F(c,-2,2,-1,2,2,1,GL);F(c,-2,4,-1,2,4,1,GL);F(c,-3,2,-1,-3,2,1,GL);for(const x of[-2,2])for(const z of[-1,1])c.push([x,0,z,BK]);F(c,-2,2,0,2,2,0,R);F(c,-2,4,0,2,4,0,R);return c}
function hotel(){const c=[];F(c,-3,0,-3,3,19,3,0);F(c,-3,0,-3,3,18,3,W);F(c,-2,1,-2,2,17,2,0);for(let y=3;y<18;y+=3)F(c,-2,y,-2,2,y,2,W);
 for(let y=1;y<18;y++)if(y%3)for(let x=-2;x<=2;x++){c.push([x,y,3,GL],[x,y,-3,GL],[3,y,x,GL],[-3,y,x,GL])}for(let y=4;y<18;y+=3)F(c,-3,y-1,4,3,y-1,4,TE);
 c.push([0,0,3,0],[0,1,3,0],[0,0,4,0]);F(c,-2,19,0,2,19,0,PK);addFurn(c,'couch',-1,0,-1,0);addFurn(c,'plant',2,0,2);return c}
function leiRing(){const c=[];const cols=[PK,Y,R,W,PU,O];let i=0;for(let a=0;a<64;a++){const x=Math.round(Math.cos(a/64*Math.PI*2)*5),z=Math.round(Math.sin(a/64*Math.PI*2)*5);if(!c.some(q=>q[0]===x&&q[2]===z))c.push([x,0,z,cols[i++%cols.length]])}c.push([0,0,0,LF],[0,1,0,PK]);return c}
function surfboard(col){return[[0,0,0,col],[0,1,0,W],[0,2,0,col]]}
function stoneCircle(){const c=[];for(let a=0;a<10;a++){const x=Math.round(Math.cos(a/10*Math.PI*2)*6),z=Math.round(Math.sin(a/10*Math.PI*2)*6);c.push([x,0,z,ST],[x,1,z,ST],[x,2,z,ST]);if(a%2===0){const x2=Math.round(Math.cos((a+1)/10*Math.PI*2)*6),z2=Math.round(Math.sin((a+1)/10*Math.PI*2)*6);c.push([x2,3,z2,ST],[x,3,z,ST])}}c.push([0,0,0,STAR]);return c}
function tinyHut(col){return[[0,0,0,LOG],[1,0,0,LOG],[0,0,1,0],[1,0,1,LOG],[0,1,0,LF],[1,1,0,LF],[0,1,1,LF],[1,1,1,LF],[0,0,2,LP]]}
// ---------- England ----------
function genEngland(s){world=new Uint8Array(WX*WY*WZ);const n=noise2(s),r=rng(s+7),G=16;landmarks=[];secrets=[];
 const zc=x=>Math.round(62+Math.sin(x/18)*6),LON=(x,z)=>x>=48&&x<121&&z>=26&&z<=92;
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){
  if(x>=121||z>=117){col(x,z,SEA-3-(x>=124||z>=121?2:0),SA,SA);continue}
  let h=LON(x,z)?G:G+Math.floor(n(x/22,z/22)*9+n(x/8,z/8)*2-2);const chalk=z>=104&&x>44;if(chalk)h=Math.max(h,G+7);
  const dz=Math.abs(z-zc(x));if(dz<=3){col(x,z,G-5,SA,SA);for(let y=G-4;y<G;y++)world[idx(x,y,z)]=WA;continue}
  if(dz<12&&!chalk)h=Math.min(h,G+Math.max(0,dz-5));h=Math.max(G-1,h);
  col(x,z,h,GR);if(chalk)for(let y=1;y<h;y++)world[idx(x,y,z)]=W;if(LON(x,z)&&dz<=5)world[idx(x,h,z)]=CB}
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++)for(let y=1;y<=SEA;y++)if(!world[idx(x,y,z)])world[idx(x,y,z)]=WA;
 // London streets
 for(let x=48;x<121;x++)for(const z0 of[44,80])for(let z=z0-1;z<=z0+1;z++)if(Math.abs(z-zc(x))>3)world[idx(x,G,z)]=CB;
 for(const x0 of[72,96])for(let z=44;z<=80;z++)if(Math.abs(z-zc(x0))>3)for(let x=x0-1;x<=x0+1;x++)world[idx(x,G,z)]=CB;
 stamp(parliament(),58,G+1,zc(58)-8,0);stamp(bigBen(),78,G+1,zc(78)-8,0);put(78,G+1+23,zc(78)-8,STAR); // secret star on top of the tower
 stamp(bridge(),72,G,zc(72),1);stamp(towerBridge(),96,G,zc(96),0);stamp(royalPalace(),100,G+1,30,0);stamp(fountain(),100,G+1,40,0);
 stamp(bigWheel(),84,G+1,zc(84)+11,0);stamp(bus(),82,G+1,80,0);stamp(bus(),108,G+1,44,0);
 for(const[x,z]of[[88,47],[64,77],[104,77],[76,41]])stamp(phoneBox(),x,G+1,z,0);
 for(const[x,z]of[[56,72],[110,72],[60,86]])oak(x,G+1,z);
 // countryside
 const cg=ground(26,30);stamp(castle(),26,cg+1,30,0);
 for(let x=10;x<=42;x++)for(let z=80;z<=104;z++){col(x,z,G,GR);for(let y=G+1;y<WY;y++)world[idx(x,y,z)]=0}
 for(const[x,z,rr]of[[16,84,0],[32,84,0],[16,100,2],[32,100,2]])stamp(house(true),x,G+1,z,rr);
 oak(24,G+1,92);for(let y=1;y<=5;y++)put(20,G+y,92,W);[R,BL,Y,PK].forEach((c,i)=>put(20+(i%2?1:-1)*(i<2?1:0),G+5,92+(i>=2?(i%2?1:-1):0),c));stamp(pub(true),44,ground(44,92)+1,92,3);
 for(let x=4;x<56;x++)if(x%14>2){const y=ground(x,20);if(world[idx(x,y,20)]===GR)put(x,y+1,20,ST)}
 for(let z=4;z<52;z++)if(z%12>2&&Math.abs(z-30)>9){const y=ground(48,z);if(world[idx(48,y,z)]===GR)put(48,y+1,z,ST)}
 for(let k=0;k<24;k++){const x=2+r()*44|0,z=2+r()*60|0;const y=ground(x,z);if(world[idx(x,y,z)]===GR&&Math.abs(z-zc(x))>5&&(Math.abs(x-26)>10||Math.abs(z-30)>10))oak(x,y+1,z)}
 stamp(lighthouse(),112,ground(112,110)+1,110,0);
 // ---- secrets (not on the map) ----
 stamp(stoneCircle(),10,ground(10,10)+1,10,0);
 // castle secret tunnel -> hidden room -> exit on the hillside
 const ty=cg+1;tunnel([[26,ty,33],[26,ty-3,38],[26,cg-5,42]]);room(23,cg-5,42,29,cg-2,48,ST,CRY);
 addFurnWorld('toys',24,cg-5,47,0);put(28,cg-5,47,STAR);addFurnWorld('lamp',28,cg-5,43,0);
 tunnel([[23,cg-5,45],[14,cg-5,45],[8,ground(6,45)-2,45],[4,ground(4,45)+1,45]]);
 // hidden tea party room inside the hills, behind a hedge
 const tg=ground(10,62);room(6,G-4,56,14,G-1,62,PL);addFurnWorld('table',9,G-4,58,0);addFurnWorld('chair',8,G-4,58,1);addFurnWorld('chair',12,G-4,59,3);addFurnWorld('chair',10,G-4,57,2);
 put(10,G-2,58,W);put(11,G-2,59,PK);put(9,G-2,59,Y);addFurnWorld('plant',6,G-4,56,0);addFurnWorld('fireplace',11,G-4,56,0);put(14,G-4,62,STAR);
 tunnel([[10,G-4,63],[10,G-2,66],[10,tg+1,68]]);for(const[dx,dz]of[[-2,0],[2,0],[-2,1],[2,1],[-2,2],[2,2]])put(10+dx,ground(10+dx,68+dz)+1,68+dz,LF);
 secrets.push({kind:'bunny',x:13,y:G-4,z:61});
 // crystal cave with underground pond, treasure and a glow snail
 const cx0=36,cz0=8,cgy=ground(cx0,cz0);tunnel([[cx0,cgy+1,cz0],[cx0,cgy-3,cz0+6],[cx0-6,G-7,cz0+10]]);room(22,G-7,14,32,G-3,22,null,CRY);
 for(let x=24;x<=27;x++)for(let z=18;z<=21;z++){put(x,G-8,z,WA);put(x,G-9,z,SA)}for(const[x,z]of[[22,14],[32,14],[22,22],[32,22],[30,18]])put(x,G-7,z,CRY);
 addFurnWorld('toys',31,G-7,21,0);put(29,G-7,21,STAR);secrets.push({kind:'glowsnail',x:23.5,y:G-7,z:15.5});
 // friendly river creature + bunny nook in the white cliffs
 secrets.push({kind:'nessie',x:40.5,y:G-1,z:zc(40)+0.5});
 for(let x=68;x<=71;x++)for(let y=G+2;y<=G+4;y++)for(let z=113;z<=116;z++)carve(x,y,z);put(70,G+5,114,CRY);secrets.push({kind:'kitten',x:69.5,y:G+2,z:114.5});
 landmarks=[{n:'Big Ben',e:'🕰️',x:78,z:zc(78)-8},{n:'Parliament',e:'🏛️',x:58,z:zc(58)-8},{n:'Tower Bridge',e:'🌉',x:96,z:zc(96)},{n:'River Thames',e:'🌊',x:30,z:zc(30)},
  {n:'Royal Palace',e:'👑',x:100,z:30},{n:'Big Wheel',e:'🎡',x:84,z:zc(84)+11},{n:'Double-Decker Bus',e:'🚌',x:82,z:80},{n:'Castle',e:'🏰',x:26,z:30},
  {n:'Village Green',e:'🌳',x:24,z:92},{n:'White Cliffs',e:'🏳️',x:84,z:110},{n:'Lighthouse',e:'🗼',x:112,z:110}];
 spawnXZ=[24,94]}
function addFurnWorld(key,x,y,z,r){for(const[a,b,c,id]of rotCells(cellsOf(key),r))put(x+a,y+b,z+c,id)}

function dukes(){const c=[];F(c,-5,0,-4,5,6,4,0);F(c,-5,0,-4,5,0,4,PL);for(const x of[-5,0,5])for(const z of[-4,4])F(c,x,1,z,x,3,z,LOG);
 F(c,-6,4,-5,6,4,5,SA);F(c,-4,5,-3,4,5,3,SA);F(c,-2,6,-1,2,6,1,SA);F(c,-4,1,-3,4,1,-3,PL);F(c,-4,2,-3,4,2,-3,LOG);
 addFurnWorldCells(c,'table',-3,1,0,0);addFurnWorldCells(c,'table',1,1,0,0);addFurnWorldCells(c,'chair',-4,1,2,2);addFurnWorldCells(c,'chair',3,1,2,2);addFurnWorldCells(c,'plant',4,1,3,0);
 for(const[x,z]of[[-6,5],[6,5]]){c.push([x,0,z,LOG],[x,1,z,LOG],[x,2,z,LOG],[x,3,z,O])}F(c,-3,3,5,3,3,5,R);F(c,-2,3,5,2,3,5,Y);return c}
function addFurnWorldCells(c,key,ox,oy,oz,r){for(const[x,y,z,id]of rotCells(cellsOf(key),r))c.push([ox+x,oy+y,oz+z,id])}
function shop(col,awn){const c=[];F(c,-2,0,-2,2,5,2,0);F(c,-2,-1,-2,2,-1,2,PL);for(let y=0;y<4;y++){F(c,-2,y,-2,2,y,-2,col);F(c,-2,y,-2,-2,y,2,col);F(c,2,y,-2,2,y,2,col)}
 F(c,-2,0,2,2,3,2,col);F(c,-1,1,2,1,2,2,GL);c.push([0,0,2,0],[0,1,2,0]);F(c,-2,4,-2,2,4,2,col);F(c,-2,3,3,2,3,3,awn);addFurnWorldCells(c,'counter',-1,0,-1,0);return c}
function truck(){const c=[];F(c,-3,0,-1,3,4,2,0);F(c,-3,1,-1,3,3,1,W);F(c,-3,2,-1,3,2,1,Y);F(c,2,2,-1,3,3,1,GL);for(const x of[-2,2])for(const z of[-1,1])c.push([x,0,z,BK]);
 F(c,-2,2,1,1,2,1,0);F(c,-3,4,-1,1,4,2,PK);F(c,-2,0,3,1,0,3,PL);return c}
function surfShack(col){const c=[];F(c,-2,0,-2,2,4,2,0);for(const x of[-2,2])for(const z of[-2,2])F(c,x,0,z,x,2,z,LOG);F(c,-2,0,-2,2,2,-2,col);F(c,-3,3,-3,3,3,3,SA);F(c,-2,4,-2,2,4,2,SA);
 c.push([1,0,1,PL]);[PK,Y,BL].forEach((q,i)=>c.push([-1+i,0,3,q],[-1+i,1,3,W],[-1+i,2,3,q]));return c}
function wave(len,h){const c=[];for(let x=0;x<len;x++){const hh=Math.round(h*(0.6+0.4*Math.sin(x/len*Math.PI)));for(let y=0;y<hh;y++)c.push([x,y,0,y===hh-1?W:TE]);c.push([x,hh-1,1,W])}return c}
// ---------- Hawaii ----------
function genHawaii(s){world=new Uint8Array(WX*WY*WZ);const n=noise2(s),r=rng(s+9);landmarks=[];secrets=[];
 const V=[46,54],D=[100,86],L=[98,26],KA=[100,36],KB=[106,72],HB=[24,102];
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){const d=Math.hypot(x-64,z-64),R=46+n(x/18,z/18)*8;let h,top=GR,under=DI;
  if(d>R){h=Math.max(3,SEA-2-Math.floor((d-R)/3));top=SA;under=SA}else if(d>R-5){h=SEA+1;top=SA;under=SA}else h=SEA+2+Math.floor((R-5-d)*0.15+n(x/10,z/10)*3);
  const vd=Math.hypot(x-V[0],z-V[1]);if(vd<28){const vh=Math.floor(45-vd*1.15);if(vh>h){h=vh;top=vd<15?(r()<0.3?BK:ST):GR;under=ST}}
  {const t=Math.max(0,Math.min(1,((x-KA[0])*(KB[0]-KA[0])+(z-KA[1])*(KB[1]-KA[1]))/((KB[0]-KA[0])**2+(KB[1]-KA[1])**2)));const kd=Math.hypot(x-(KA[0]+(KB[0]-KA[0])*t),z-(KA[1]+(KB[1]-KA[1])*t));
   if(kd<8&&d<R-3){const kh=SEA+4+Math.floor((8-kd)*2.4*(0.75+0.25*Math.sin(t*Math.PI))+Math.abs(Math.sin(z*0.7))*3*(8-kd)/8);if(kh>h){h=kh;top=GR;under=ST}}}
  const bd=Math.hypot(x-HB[0],z-HB[1]);if(bd<9&&d>R-14){h=Math.min(h,SEA-3);top=SA;under=SA}else if(bd<14&&d>R-18&&d<=R+2){const rh=SEA+2+Math.floor((bd-9)*1.8);if(rh>h){h=rh;top=GR;under=ST}}
  const dd=Math.hypot(x-D[0],z-D[1]);if(dd<12){if(dd<5){h=SEA+3;top=GR;under=DI}else{const rh=SEA+2+Math.floor(Math.max(0,9-Math.abs(dd-7.5)*2.2));if(rh>h){h=rh;top=GR;under=ST}}}
  const ld=Math.hypot(x-L[0],z-L[1]);if(ld<10){h=SEA-2;top=SA;under=SA}else if(ld<11.5){h=SEA-1;top=SA;under=SA}
  col(x,z,h,top,under);if(vd<4){for(let y=h-2;y<=h;y++)world[idx(x,y,z)]=0;world[idx(x,h-3,z)]=LV}
  if(ld>=10&&ld<11.5&&!(x>L[0]-2&&x<L[0]+2&&z<L[1]))world[idx(x,SEA,z)]=[PK,O,Y,PU][(r()*4)|0]} // coral reef with a gap
 for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++)for(let y=1;y<=SEA;y++)if(!world[idx(x,y,z)])world[idx(x,y,z)]=WA;
 // Waikiki-style beach town: Kalakaua shopping street, beachfront hotels, Duke's, surf break
 for(let x=46;x<=88;x++)for(let z=84;z<=104;z++){col(x,z,SEA+2,GR);for(let y=SEA+3;y<WY;y++)world[idx(x,y,z)]=0}
 for(let x=46;x<=88;x++)for(let z=92;z<=94;z++)world[idx(x,SEA+2,z)]=CB;
 [[BR,PK],[Y,TE],[PK,Y],[TE,O],[W,R],[O,BL],[PU,Y]].forEach(([c1,c2],i)=>stamp(shop(c1,c2),50+i*6,SEA+3,88,0));
 stamp(hotel(),54,SEA+3,99,0);stamp(hotel(),64,SEA+3,99,0);stamp(beachHouse(true),74,SEA+3,99,0);
 [PK,Y,BL,R,TE,O].forEach((c,i)=>{const x=50+i*3,z=108;stamp(surfboard(c),x,ground(x,z)+1,z,0)});
 stamp(dukes(),83,ground(83,108)+1,108,0);stamp(tikiHut(),46,ground(46,106)+1,106,0);
 for(const[x0,z0]of[[50,119],[64,121],[76,118]])stamp(wave(10,2),x0,SEA+1,z0,0);for(const[x,z]of[[55,117],[70,119]])put(x,SEA+1,z,[PK,Y][x%2]);
 // North Shore: big waves, surf shacks and a shrimp truck
 for(let x=54;x<=80;x++)for(let z=12;z<=22;z++){const dn=Math.hypot(x-64,z-64);if(dn>44){col(x,z,SEA+1,SA,SA);for(let y=SEA+2;y<WY;y++)world[idx(x,y,z)]=0}}
 [PK,TE,Y].forEach((c,i)=>stamp(surfShack(c),58+i*7,SEA+2,18,2));stamp(truck(),78,SEA+2,19,0);
 for(const[x0,z0,h]of[[52,7,5],[64,4,6],[74,8,4]])stamp(wave(12,h),x0,SEA+1,z0,0);
 // Hanauma-style snorkel bay: coral, fish and turtles
 {const r2=rng(s+21);for(let k=0;k<40;k++){const a=r2()*Math.PI*2,q=r2()*8;const x=Math.round(HB[0]+Math.cos(a)*q),z=Math.round(HB[1]+Math.sin(a)*q);if(wget(x,SEA-2,z)===WA)put(x,SEA-2,z,[PK,O,Y,PU,R][r2()*5|0])}
  for(let k=0;k<6;k++)secrets.push({kind:'fish',x:HB[0]+Math.cos(k)*4,y:SEA-1,z:HB[1]+Math.sin(k)*4,swim:1});secrets.push({kind:'turtle',x:HB[0]+2,y:SEA-1.2,z:HB[1]-2},{kind:'turtle',x:HB[0]-3,y:SEA-1.2,z:HB[1]+1})}
 stamp(leiRing(),40,ground(40,96)+1,96,0);
 // rainforest
 for(let k=0;k<70;k++){const x=66+r()*32|0,z=34+r()*44|0;if(Math.hypot(x-84,z-58)<7||Math.hypot(x-V[0],z-V[1])<24)continue;const y=ground(x,z);if(world[idx(x,y,z)]!==GR)continue;
  if(r()<0.5)jungleTree(x,y+1,z,r);else stamp(palm(5+(r()*3|0)),x,y+1,z,r()*4|0)}
 for(let k=0;k<160;k++){const x=r()*WX|0,z=r()*WZ|0,y=ground(x,z);if(world[idx(x,y,z)]===GR&&!wget(x,y+1,z))put(x,y+1,z,[PK,Y,R,W][r()*4|0])}
 for(let k=0;k<50;k++){const x=r()*WX|0,z=r()*WZ|0,y=ground(x,z);if(world[idx(x,y,z)]===SA&&y>SEA&&!wget(x,y+1,z)&&Math.abs(z-108)>2)stamp(palm(5+(r()*3|0)),x,y+1,z,r()*4|0)}
 // waterfall with a secret room behind it
 const wx=46,wz=33,wg=ground(wx,wz+4);for(let x=wx-5;x<=wx+5;x++)for(let z=wz-4;z<=wz-1;z++)for(let y=wg;y<=wg+10;y++)if(!wget(x,y,z)||y<=wg+10)put(x,y,z,ST);
 for(let y=wg+1;y<=wg+10;y++)for(let x=wx-1;x<=wx+1;x++)put(x,y,wz,WA);for(let x=wx-3;x<=wx+3;x++)for(let z=wz+1;z<=wz+3;z++){put(x,wg,z,WA);put(x,wg-1,z,SA)}
 room(wx-3,wg+1,wz-6,wx+3,wg+4,wz-2,ST,CRY);for(let y=wg+1;y<=wg+2;y++)carve(wx,y,wz-1);put(wx,wg,wz,ST);put(wx,wg,wz+1,ST);
 addFurnWorld('toys',wx-2,wg+1,wz-6,0);put(wx+2,wg+1,wz-6,RAIN);put(wx+3,wg+1,wz-3,STAR);addFurnWorld('plant',wx-3,wg+1,wz-3,0);
 // lava tube cave inside the volcano (glowing rock, perfectly safe)
 const tx=64,tz=58,tg=ground(tx,tz);tunnel([[tx,tg+1,tz],[58,tg-2,57],[52,tg-4,56]],LV);room(47,tg-4,52,53,tg-1,58,BK,LV);
 for(const[x,z]of[[47,52],[53,52],[47,58]])put(x,tg-4,z,CRY);put(53,tg-4,58,STAR);secrets.push({kind:'glowsnail',x:49.5,y:tg-4,z:54.5});
 // sea cave through a rocky headland by the snorkel lagoon
 const hx=84,hz=18;for(let x=hx-6;x<=hx+6;x++)for(let z=hz-5;z<=hz+5;z++){const q=Math.hypot(x-hx,z-hz);if(q<6)for(let y=1;y<=SEA+7-Math.floor(q);y++)put(x,y,z,ST)}
 tunnel([[hx-7,SEA+1,hz],[hx+7,SEA+1,hz]]);put(hx,SEA+1,hz+1,STAR);
 // hidden turtle cove on the west coast (walk in through the rock gap)
 const cx=14,cz=70;for(let x=cx-6;x<=cx+6;x++)for(let z=cz-6;z<=cz+6;z++){const q=Math.hypot(x-cx,z-cz);if(q>=4.5&&q<6.5)for(let y=1;y<=SEA+5;y++)put(x,y,z,ST);else if(q<4.5){for(let y=1;y<=SEA;y++)put(x,y,z,x<cx?WA:SA);for(let y=SEA+1;y<=SEA+6;y++)carve(x,y,z)}}
 tunnel([[cx+9,ground(cx+9,cz)+1,cz],[cx+2,SEA+1,cz]]);put(cx+2,SEA+6,cz+1,CRY);secrets.push({kind:'turtle',x:cx+1.5,y:SEA+1,z:cz-1.5},{kind:'turtle',x:cx+2.5,y:SEA+1,z:cz+1.5});
 // tiny hidden village in the rainforest
 const mx=84,mz=58,mg=ground(mx,mz);for(let x=mx-6;x<=mx+6;x++)for(let z=mz-6;z<=mz+6;z++){const q=Math.hypot(x-mx,z-mz);col(x,z,mg,GR);for(let y=mg+1;y<WY;y++)world[idx(x,y,z)]=0;if(q>=5.5&&q<6.5&&!(z>mz+4&&Math.abs(x-mx)<=1))for(let y=1;y<=2;y++)put(x,mg+y,z,LF)}
 for(const[dx,dz]of[[-3,-3],[2,-3],[-3,1],[2,1]])stamp(tinyHut([BR,R,TE,PK][(dx+dz+8)%4]),mx+dx,mg+1,mz+dz,0);put(mx,mg+1,mz,RAIN);
 stamp(lighthouse(),26,Math.max(SEA,ground(26,30))+1,30,0);
 for(let k=0;k<3;k++){const a=1.2+k*0.5;secrets.push({kind:'turtle',x:64+Math.cos(a)*48,y:null,z:64+Math.sin(a)*48})}
 landmarks=[{n:'Volcano',e:'🌋',x:V[0],z:V[1]},{n:'Diamond Head',e:'⛰️',x:D[0],z:D[1]},{n:'Waikiki Beach',e:'🏄',x:62,z:108},{n:'Beachfront Hotels',e:'🏨',x:59,z:99},{n:"Duke's",e:'🍹',x:83,z:108},{n:'Kalakaua Shops',e:'🛍️',x:68,z:88},{n:'Surf Break',e:'🌊',x:64,z:118},{n:'North Shore',e:'🏄‍♂️',x:66,z:16},{n:'Shrimp Truck',e:'🍤',x:78,z:19},{n:'Snorkel Bay',e:'🤿',x:HB[0],z:HB[1]},{n:'Koolau Mountains',e:'⛰️',x:103,z:54},
  {n:'Lagoon & Reef',e:'🐠',x:L[0],z:L[1]},{n:'Waterfall',e:'💦',x:wx,z:wz+2},{n:'Rainforest',e:'🌴',x:74,z:44},{n:'Lighthouse',e:'🗼',x:26,z:30},
  {n:'Lei Garden',e:'🌺',x:40,z:96},{n:'Tiki Hut',e:'🛖',x:46,z:106}];
 spawnXZ=[64,102]}
// generic generator by kind
function genKind(kind){if(kind==='england')genEngland(seed);else if(kind==='hawaii')genHawaii(seed);else if(kind==='city'){generateCity(seed);landmarks=[];secrets=[]}else{generate(seed);spawnXZ=[WX/2,WZ/2];landmarks=[];secrets=[]}}
function spawnSecrets(){secrets.forEach((s,i)=>{if(s.taken)return;const c=spawnCritter(s.kind,s.x,s.z,s.y==null?{}:{y:s.y});c.fixed=s.y!=null;c.homeY=s.y;c.secretIdx=i;if(s.swim){c.swim=true;c.hx=s.x;c.hz=s.z}})}
function teleport(x,z){P.pos.set(x+0.5,topY(Math.floor(x),Math.floor(z))+1.05,z+0.5);P.vel.set(0,0,0);for(let i=0;i<30&&collides(P.pos);i++)P.pos.y+=1;for(let i=0;i<20&&get(Math.floor(P.pos.x),Math.floor(P.pos.y),Math.floor(P.pos.z))===B.WATER;i++)P.pos.y+=1;for(const c of critters)if(c.owned&&!c.sit)c.mesh.position.set(P.pos.x+1,P.pos.y,P.pos.z+1);document.getElementById('mapView').classList.add('hidden');toast('✨ Zoom!')}

// ---- automatic updates ----
const APP_VERSION='5.0.0';let updatePending=null;
function newer(a,b){const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){if((x[i]||0)>(y[i]||0))return true;if((x[i]||0)<(y[i]||0))return false}return false}
function doUpdate(){const k='blockland_upd_'+updatePending;if(sessionStorage.getItem(k)){const b=document.getElementById('updBanner');b.classList.remove('hidden');b.textContent='✨ Close and reopen the game to update';return}if(ghost){toast('Finish building first, then tap Update!');return}try{save(true)}catch(e){}sessionStorage.setItem(k,'1');
 const go=()=>location.reload();if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration)navigator.serviceWorker.getRegistration().then(r=>r?r.update().finally(go):go()).catch(go);else go()}
async function checkUpdate(){try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return;const v=(await r.json()).version;
 if(v&&newer(v,APP_VERSION)){updatePending=v;if(!running)return doUpdate();const b=document.getElementById('updBanner');b.classList.remove('hidden');b.textContent='✨ New version ready! Tap to refresh'}}catch(e){}}
document.getElementById('updBanner').onclick=doUpdate;
setInterval(checkUpdate,3*60*1000);addEventListener('focus',checkUpdate);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate()});setTimeout(checkUpdate,1500);

// ===================== v4.1: profiles + learning =====================
let LC=null;fetch('content/learning.json',{cache:'no-store'}).then(r=>r.json()).then(j=>LC=j).catch(()=>{LC={words6:[{w:'CAT',e:'🐱'},{w:'DOG',e:'🐶'},{w:'SUN',e:'☀️'}],words9:[{w:'tiny',m:'very small',s:'The ____ hut.'},{w:'enormous',m:'very big',s:'An ____ volcano.'},{w:'gentle',m:'soft and kind',s:'Be ____.'}],spell:['CAT','DOG'],landmarks:{},journal:{},blueprints:{6:[{t:'count',n:5,txt:'Place 5 blocks.'}],9:[{t:'count',n:12,txt:'Place 12 blocks.'}]},shop:[],melodies:[],quests:[]}});
const PROF_KEY='blockland_profiles',SET_KEY='blockland_learning',PROG_KEY='blockland_progress';
let profiles=(()=>{try{return JSON.parse(localStorage.getItem(PROF_KEY)||'null')||[]}catch(e){return[]}})();
const KID_EMOJI=['🦊','🐻','🐼','🦁'],KID_SHIRT=['#3c7cff','#5cbf4a','#ff7a3c','#b05cff'],AGES=[4,5,6,7,8,9,10,11,12];
const newKidId=()=>'k'+Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-3);
const lvlOf=p=>p&&(p.lvl===6||p.lvl===9)?p.lvl:(p&&p.age<=7?6:9);
const LVL_NAME={6:'🌱 Little Builder',9:'🚀 Big Builder'},LVL_DESC={6:'picture words, adding small numbers, read-aloud',9:'vocabulary, times tables, making change'};
// older saves keyed players by name: give each one an id and move their progress over
profiles.forEach(p=>{if(!p.id){p.id=newKidId();try{const pr=JSON.parse(localStorage.getItem(PROG_KEY)||'{}');if(pr[p.name]){pr[p.id]=pr[p.name];delete pr[p.name];localStorage.setItem(PROG_KEY,JSON.stringify(pr))}const av=localStorage.getItem('blockland_avatar_'+p.name);if(av){localStorage.setItem('blockland_avatar_'+p.id,av);localStorage.removeItem('blockland_avatar_'+p.name)}}catch(e){}}});
if(profiles.length)localStorage.setItem(PROF_KEY,JSON.stringify(profiles));
let settings=Object.assign({learning:true,interval:15},JSON.parse(localStorage.getItem(SET_KEY)||'{}'));
let progAll=JSON.parse(localStorage.getItem(PROG_KEY)||'{}');let profile=null,prog=null;
const saveProfiles=()=>localStorage.setItem(PROF_KEY,JSON.stringify(profiles)),saveSettings=()=>localStorage.setItem(SET_KEY,JSON.stringify(settings));
function saveProg(){if(profile){progAll[profile.id]=prog;localStorage.setItem(PROG_KEY,JSON.stringify(progAll))}}
function newProg(){return{inv:{},playSec:0,sinceSec:0,challenges:0,coins:0,stars:0,words:[],stamps:{},journal:[],songs:[],blueprints:0,treasures:[],quests:[],vocab:[]}}
const age=()=>profile?lvlOf(profile):9;
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t).replace(/[^\w\s.,!?'’-]/g,' '));u.rate=0.9;speechSynthesis.speak(u)}catch(e){}}
const LO=document.getElementById('learnOv');
function card(html,btns,opts={}){LO.innerHTML=`<div class="lcard">${html}<div class="lbtns"></div></div>`;const bx=LO.querySelector('.lbtns');
 for(const [label,cls,fn] of btns||[]){const b=document.createElement('button');b.innerHTML=label;b.className=cls||'';b.onclick=()=>fn(b);bx.appendChild(b)}LO.classList.remove('hidden');if(opts.say)speak(opts.say);return LO}
const closeCard=()=>{LO.classList.add('hidden');try{stopVoice()}catch(e){}};
const sayBtn=t=>['🔊 Read to me','',()=>speak(t)];
function reward(coins,msg){prog.coins+=coins;if(coins)prog.stars++;saveProg();toast(msg+(coins?` +${coins}🪙`:''));updateCoinUI()}
function updateCoinUI(){const b=document.getElementById('bLearn');if(b)b.textContent=settings.learning?`🎓 ${prog?prog.coins:0}🪙`:'🎓'}
// ---- login screen ----
function showLogin(){const m=document.getElementById('login');m.classList.remove('hidden');if(!profiles.length)return showSetup(false);
 m.innerHTML=`<h1>Blockland <span>Buddies</span></h1><p class="sub">Who's playing?</p><div class="who n${profiles.length}"></div><button id="lgParent" class="sm">👪 Grown-ups</button>`;
 const w=m.querySelector('.who');profiles.forEach((p,i)=>{const b=document.createElement('button');b.className='whoBtn '+(['','green','orange','purple'][i%4]);b.innerHTML=`<big>${KID_EMOJI[i%4]}</big>${escapeHtml(p.name)}<small>${LVL_NAME[lvlOf(p)]}</small>`;b.onclick=()=>login(p.id);w.appendChild(b)});
 m.querySelector('#lgParent').onclick=()=>parentGate(parentPanel)}
// ---- family setup (first launch, and later from 👪 Grown-ups → Edit kids) ----
function showSetup(editing){const m=document.getElementById('login');m.classList.remove('hidden');closeCard();
 let draft=profiles.length?profiles.map(p=>({id:p.id,name:p.name,age:p.age,lvl:p.lvl})):[{id:newKidId(),name:'',age:6}];
 const draw=()=>{m.innerHTML=`<h1>Blockland <span>Buddies</span></h1><div class="setup"><h2>👪 Family setup</h2><p>Add each child who will play (up to 4). Their age picks the learning level.</p><div class="kids"></div>
  <p class="hint" id="suErr"></p><div class="lbtns">${draft.length<4?'<button id="suAdd">➕ Add a kid</button>':''}${editing?'<button id="suCancel" class="red">Cancel</button>':''}<button id="suSave" class="green">✅ ${editing?'Save':'Save &amp; play'}</button></div>
  <p class="tiny">Names and ages stay on this iPad only. Change them any time: 👪 Grown-ups → ✏️ Edit kids.</p></div>`;
  const box=m.querySelector('.kids');draft.forEach((k,i)=>{const r=document.createElement('div');r.className='kidrow';
   r.innerHTML=`<span class="kidEm">${KID_EMOJI[i%4]}</span><div class="kidMain"><input class="kidName" maxlength="16" placeholder="Name" autocomplete="off" autocorrect="off" spellcheck="false" value="${escapeHtml(k.name)}">
    <div class="ages"><b>Age</b> ${AGES.map(a=>`<button class="ageB${k.age===a?' on':''}" data-a="${a}">${a}</button>`).join('')}</div><small>${k.age?LVL_NAME[lvlOf({age:k.age,lvl:k.lvl})]+': '+LVL_DESC[lvlOf({age:k.age,lvl:k.lvl})]:'Tap an age'}</small></div>${draft.length>1?'<button class="red kidX" title="Remove">✖</button>':''}`;
   r.querySelector('.kidName').oninput=e=>{k.name=e.target.value};
   r.querySelectorAll('.ageB').forEach(b=>b.onclick=()=>{k.age=+b.dataset.a;delete k.lvl;draw()});
   const x=r.querySelector('.kidX');if(x)x.onclick=()=>{draft.splice(i,1);draw()};box.appendChild(r)});
  const add=m.querySelector('#suAdd');if(add)add.onclick=()=>{draft.push({id:newKidId(),name:'',age:0});draw();const ins=m.querySelectorAll('.kidName');ins[ins.length-1].focus()};
  const c=m.querySelector('#suCancel');if(c)c.onclick=()=>{if(profile){m.classList.add('hidden');showMenu()}else showLogin()};
  m.querySelector('#suSave').onclick=()=>{const err=t=>{m.querySelector('#suErr').textContent=t};
   for(const k of draft)k.name=String(k.name||'').replace(/[^A-Za-z0-9 _-]/g,'').replace(/\s+/g,' ').slice(0,16).trim();
   if(draft.some(k=>!k.name))return err('Please type a name for each kid (letters and numbers).');
   if(draft.some(k=>!k.age))return err('Please tap an age for each kid.');
   if(new Set(draft.map(k=>k.name.toLowerCase())).size<draft.length)return err('Each kid needs a different name.');
   const gone=profiles.filter(p=>!draft.some(k=>k.id===p.id));
   if(gone.length&&!confirm('Remove '+gone.map(p=>p.name).join(' and ')+'? Their coins, stamps and progress on this iPad will be deleted. Saved worlds stay.'))return;
   for(const p of gone){delete progAll[p.id];localStorage.removeItem('blockland_avatar_'+p.id)}localStorage.setItem(PROG_KEY,JSON.stringify(progAll));
   profiles=draft.map(k=>{const o={id:k.id,name:k.name,age:k.age};if(k.lvl)o.lvl=k.lvl;return o});saveProfiles();
   profile=null;document.getElementById('menu').classList.add('hidden');showLogin()}};draw()}
function login(id){profile=profiles.find(p=>p.id===id);if(!profile)return showLogin();const idx=profiles.indexOf(profile);prog=Object.assign(newProg(),progAll[id]||{});
 const own=localStorage.getItem('blockland_avatar_'+id);
 avatar=Object.assign({skin:'#ffdbb5',hair:'#6b4423',shirt:KID_SHIRT[idx%4],pants:'#2c4a8a',hat:'cap'},JSON.parse(own||'{}'));avatar.name=profile.name;
 localStorage.setItem('blockland_avatar_'+id,JSON.stringify(avatar));saveProg();document.getElementById('login').classList.add('hidden');showMenu()}
// ---- parent gate & panel ----
function parentGate(ok){const a=11+Math.random()*9|0,b=12+Math.random()*9|0;let typed='';
 const draw=()=>{card(`<h2>👪 Grown-ups only</h2><p>What is ${a} + ${b}?</p><div class="pad-show">${typed||'&nbsp;'}</div><div class="pad">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✓'].map(k=>`<button class="padk" data-k="${k}">${k}</button>`).join('')}</div>`,[['Cancel','red',closeCard]]);
  LO.querySelectorAll('.padk').forEach(el=>el.onclick=()=>{const k=el.dataset.k;if(k==='⌫')typed=typed.slice(0,-1);else if(k==='✓'){if(+typed===a+b){closeCard();ok();return}else{typed='';}}else if(typed.length<3)typed+=k;draw()})};draw()}
function parentPanel(){let h=`<h2>👪 Parent settings</h2><div class="prow"><b>Learning Mode</b> <button id="pL" class="${settings.learning?'green':'red'}">${settings.learning?'On':'Off'}</button></div>
 <div class="prow"><b>Challenge every</b> ${['off',5,10,15,20,25,30].map(v=>`<button class="pI ${String(settings.interval)===String(v)?'green':''}" data-v="${v}">${v==='off'?'Off':v+' min'}</button>`).join('')}</div><h3>Players</h3>`;
 profiles.forEach((p,i)=>{const g=Object.assign(newProg(),progAll[p.id]||{});const st=Object.values(g.stamps).reduce((a,b)=>a+b.length,0);
  h+=`<div class="pprog"><b>${KID_EMOJI[i%4]} ${escapeHtml(p.name)}</b> · age ${p.age} · level <button class="pA" data-i="${i}">${p.lvl?LVL_NAME[p.lvl]:'Auto: '+LVL_NAME[lvlOf(p)]}</button><br>⏱️ ${Math.round(g.playSec/60)} min played · 🧩 ${g.challenges} challenges · 🪙 ${g.coins} coins · ⭐ ${g.stars}<br>🔤 words spelled: ${g.words.join(', ')||'none yet'}<br>📘 stamps: ${st} · 📓 journal: ${g.journal.length} · 🎹 songs: ${g.songs.join(', ')||'none'} · 📐 blueprints: ${g.blueprints} · 🤝 quests: ${g.quests.length}<br>📖 vocabulary: ${g.vocab.join(', ')||'none'} · 🎁 ${g.treasures.join(' ')}</div>`});
 card(h+'<p class="tiny">Level “Auto” follows age: 4–7 → 🌱 Little Builder, 8–12 → 🚀 Big Builder. Tap a level to change it.</p>',[['✏️ Edit kids','',()=>showSetup(true)],['✅ Done','green',()=>{closeCard();if(!profile)showLogin()}]]);
 LO.querySelector('#pL').onclick=()=>{settings.learning=!settings.learning;saveSettings();updateCoinUI();parentPanel()};
 LO.querySelectorAll('.pI').forEach(b=>b.onclick=()=>{settings.interval=b.dataset.v==='off'?'off':+b.dataset.v;saveSettings();parentPanel()});
 LO.querySelectorAll('.pA').forEach(b=>b.onclick=()=>{const p=profiles[+b.dataset.i];if(!p.lvl)p.lvl=6;else if(p.lvl===6)p.lvl=9;else delete p.lvl;saveProfiles();if(profile&&profile.id===p.id)profile=p;parentPanel()})}
// ---- timed challenges ----
let challengeOn=false,warned=false;
function intervalSec(){return settings.interval==='off'||!settings.learning?Infinity:settings.interval*60}
function tickLearning(dt){if(!prog||!running||challengeOn||!LO.classList.contains('hidden'))return;prog.playSec+=dt;prog.sinceSec+=dt;const I=intervalSec();
 if(I!==Infinity&&!warned&&prog.sinceSec>=I-60){warned=true;toast('⏰ In 1 minute: a fun challenge!');speak('In one minute, a fun challenge!')}
 if(prog.sinceSec>=I){if(ghost)return;startChallenge()}}
function pick(a){return a[Math.random()*a.length|0]}
function shuffle(a){return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1])}
let recentQ=[];function pickFresh(a){const f=a.filter(x=>!recentQ.includes(x));const it=pick(f.length?f:a);recentQ=[it,...recentQ].slice(0,6);return it}
function makeQ(kind){const A=age();
 if(kind==='read'){if(A<=6){const it=pickFresh(LC.words6),opts=shuffle([it,...shuffle(LC.words6.filter(x=>x!==it)).slice(0,2)]);return{q:`Which word is ${it.e}?`,say:'Which word matches the picture?',big:it.e,opts:opts.map(o=>o.w),ans:it.w}}
  const it=pickFresh(LC.words9);if(Math.random()<0.5){const opts=shuffle([it,...shuffle(LC.words9.filter(x=>x!==it)).slice(0,2)]);return{q:`What does "${it.w}" mean?`,say:`What does ${it.w} mean?`,opts:opts.map(o=>o.m),ans:it.m,vocab:it.w}}
  const opts=shuffle([it,...shuffle(LC.words9.filter(x=>x!==it)).slice(0,2)]);return{q:`Fill in the blank: ${it.s}`,say:it.s.replace('____','blank'),opts:opts.map(o=>o.w),ans:it.w,vocab:it.w}}
 if(A<=6){const a=1+Math.random()*5|0,b=1+Math.random()*4|0,em=pick(['🍎','⭐','🐟','🧱','🌺']);const ans=a+b;const opts=shuffle([...new Set([ans,ans+1,Math.max(0,ans-1),ans+2])].slice(0,3));if(!opts.includes(ans))opts[0]=ans;
  return{q:`${em.repeat(a)} + ${em.repeat(b)} = ?`,say:[a,'plus',b,'is how many?'],opts:shuffle(opts).map(String),ans:String(ans)}}
 const t=Math.random();let q,ans,say;if(t<0.5){const a=2+Math.random()*9|0,b=2+Math.random()*9|0;q=`${a} × ${b} = ?`;ans=a*b;say=[a,'times',b,'equals what?']}else if(t<0.75){const a=20+Math.random()*60|0,b=10+Math.random()*30|0;q=`${a} + ${b} = ?`;ans=a+b;say=[a,'plus',b,'equals what?']}else{const r=2+Math.random()*5|0,c=2+Math.random()*6|0;q=`You build ${r} rows of ${c} blocks. How many blocks?`;ans=r*c;say=['You build',r,'rows of',c,'blocks. How many blocks?']}
 const opts=new Set([ans]);while(opts.size<3)opts.add(ans+pick([-10,-2,-1,1,2,10]));return{q,say,opts:shuffle([...opts]).map(String),ans:String(ans)}}
function askQ(Q,done){const html=`${Q.big?`<div class="bigEmoji">${Q.big}</div>`:''}<h2>${escapeHtml(Q.q)}</h2><div class="opts"></div><p class="hint"></p>`;
 card(html,[sayBtn(Q.say)],{say:age()<=6?Q.say:null});const o=LO.querySelector('.opts');
 for(const op of Q.opts){const b=document.createElement('button');b.className='opt';b.textContent=op;b.onclick=()=>{if(op===Q.ans){b.classList.add('green');if(Q.vocab&&!prog.vocab.includes(Q.vocab))prog.vocab.push(Q.vocab);speak('Yes!');setTimeout(done,600)}else{b.disabled=true;b.classList.add('nope');LO.querySelector('.hint').textContent='Good try! Pick another one 💛';speak('Good try! Pick another one.')}};o.appendChild(b)}}
function startChallenge(){challengeOn=true;warned=false;const kinds=shuffle(['read','math','read']);let i=0;
 const next=()=>{if(i>=3){prog.sinceSec=0;prog.challenges++;saveProg();card(`<div class="bigEmoji">🏆</div><h2>Challenge done! Great thinking, ${escapeHtml(profile.name)}!</h2>`,[['▶️ Keep playing','green',()=>{closeCard();challengeOn=false;reward(3,'Challenge complete!')}]],{say:'Challenge done! Great thinking!'});return}
  const Q=makeQ(kinds[i++]);askQ(Q,next)};
 card(`<div class="bigEmoji">🧩</div><h2>Brain break, ${escapeHtml(profile.name)}!</h2><p>Answer 3 fun questions to keep playing.</p>`,[['Let\'s go!','green',next]],{say:'Brain break! Answer three fun questions to keep playing.'})}
// ---- letter blocks, signs, spelling ----
const LETTER0=33,SIGN=59;let signs={};
function letterAt(x,y,z){const b=get(x,y,z);return b>=LETTER0&&b<LETTER0+26?String.fromCharCode(65+b-LETTER0):null}
function checkSpelling(x,y,z){if(!LC)return;for(const[dx,dz]of[[1,0],[0,1]]){let sx=x,sz=z;while(letterAt(sx-dx,y,sz-dz)){sx-=dx;sz-=dz}let w='',cx=sx,cz=sz;while(letterAt(cx,y,cz)){w+=letterAt(cx,y,cz);cx+=dx;cz+=dz}
 const cands=[w,[...w].reverse().join('')];for(const c of cands)if(c.length>=2&&LC.spell.includes(c)){if(!prog.words.includes(c)){prog.words.push(c);reward(2,`🔤 You spelled ${c}!`)}else toast(`🔤 ${c}!`);speak(c.split('').join(' ')+'. '+c);burst(x+0.5,y+1,z+0.5,0,30,true);return}}}
function onPlaced(x,y,z,id){if(id>=LETTER0&&id<LETTER0+26&&prog)checkSpelling(x,y,z);if(id===SIGN){const t=prompt('What should the sign say?','Welcome!');signs[x+','+y+','+z]=(t||'Hello!').slice(0,80)}
 if(bp.active)bp.placed.push([x,y,z]);quest.myPlaced++}
function onBroken(x,y,z){delete signs[x+','+y+','+z];if(bp.active)bp.placed=bp.placed.filter(p=>p[0]!==x||p[1]!==y||p[2]!==z)}
function blockTapped(h){if(h.b===SIGN){const t=signs[h.x+','+h.y+','+h.z]||'This sign is blank.';card(`<div class="bigEmoji">🪧</div><h2>${escapeHtml(t)}</h2>`,[sayBtn(t),['Close','green',closeCard]],{say:t});return true}
 if(settings.learning&&LC&&LC.journal['b'+h.b]&&!prog.journal.includes('b'+h.b)){addJournal('b'+h.b);return true}return false}
function addJournal(key){const j=LC&&LC.journal[key];if(!j||!prog||prog.journal.includes(key))return;prog.journal.push(key);saveProg();const f=age()<=6?j.f6:j.f9;
 card(`<div class="bigEmoji">📓</div><h2>New journal page: ${escapeHtml(j.n)}</h2><p>${escapeHtml(f)}</p>`,[sayBtn(f),['Nice!','green',()=>{closeCard();reward(1,'📓 Journal page added!')}]],{say:age()<=6?f:null})}
// ---- passport & plaques ----
function lmFact(n){return LC&&LC.landmarks[n]}
function stampCheck(){if(!prog||!settings.learning)return;const w=worldKind;prog.stamps[w]=prog.stamps[w]||[];for(const l of landmarks){if(prog.stamps[w].includes(l.n))continue;if(Math.hypot(P.pos.x-l.x,P.pos.z-l.z)<7){prog.stamps[w].push(l.n);saveProg();reward(1,`📘 Passport stamp: ${l.n}!`)}}}
function plaque(l){const f=lmFact(l.n)||{f6:'A famous place!',f9:'A famous place to explore!'};const txt=age()<=6?f.f6:f.f9;let h=`<div class="bigEmoji">${l.e}</div><h2>${escapeHtml(l.n)}</h2><p>${escapeHtml(txt)}</p>`;
 if(age()>6&&f.v)h+=`<p class="vocab">📖 Word of the place: <b>${escapeHtml(f.v.w)}</b>: ${escapeHtml(f.v.m)}</p>`;if(f.v&&age()>6&&!prog.vocab.includes(f.v.w)){prog.vocab.push(f.v.w);saveProg()}
 card(h,[sayBtn(age()>6&&f.v?[txt,`Word of the place: ${f.v.w}, which means ${f.v.m}.`]:txt),['Close','green',closeCard]],{say:age()<=6?txt:null})}
function passport(){const w=worldKind,st=(prog.stamps[w]||[]);let h=`<h2>📘 ${escapeHtml(profile.name)}'s Passport: ${escapeHtml(worldName)}</h2><div class="stamps">`;
 for(const l of landmarks){const got=st.includes(l.n);h+=`<button class="stamp ${got?'got':''}" data-n="${escapeHtml(l.n)}">${got?l.e:'❔'}<small>${escapeHtml(l.n)}</small></button>`}
 h+=`</div><p>${st.length} of ${landmarks.length} stamps. Visit places to collect them!</p>`;card(h,[['Close','green',closeCard]]);
 LO.querySelectorAll('.stamp.got').forEach(b=>b.onclick=()=>plaque(landmarks.find(l=>l.n===b.dataset.n)))}
function journal(){let h=`<h2>📓 ${escapeHtml(profile.name)}'s Nature Journal</h2><div class="stamps">`;for(const k in LC.journal){const j=LC.journal[k],got=prog.journal.includes(k);h+=`<button class="stamp ${got?'got':''}" data-k="${k}">${got?'📗':'❔'}<small>${got?escapeHtml(j.n):'???'}</small></button>`}
 card(h+`</div><p>Tap animals and nature (leaves, sand, lava, crystals…) to add pages!</p>`,[['Close','green',closeCard]]);
 LO.querySelectorAll('.stamp.got').forEach(b=>b.onclick=()=>{const j=LC.journal[b.dataset.k],f=age()<=6?j.f6:j.f9;card(`<h2>${escapeHtml(j.n)}</h2><p>${escapeHtml(f)}</p>`,[sayBtn(f),['Back','green',journal]])})}
// ---- piano ----
let AC=null;const NOTE={C:261.63,D:293.66,E:329.63,F:349.23,G:392,A:440,B:493.88,c:523.25};
function tone(n){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=NOTE[n];g.gain.setValueAtTime(0.35,AC.currentTime);g.gain.exponentialRampToValueAtTime(0.001,AC.currentTime+0.6);o.connect(g).connect(AC.destination);o.start();o.stop(AC.currentTime+0.65)}catch(e){}}
function piano(song){const notes=song?song.notes.split(' '):[];let i=0;
 const draw=()=>{let h=`<h2>🎹 ${song?escapeHtml(song.title):'Free Play Piano'}</h2>${song?`<p>Tap the glowing key! (${i}/${notes.length})</p>`:'<p>Play anything you like!</p>'}<div class="keys">`;
  for(const n of ['C','D','E','F','G','A','B','c'])h+=`<button class="key ${song&&notes[i]===n?'glow':''}" data-n="${n}">${n.toUpperCase()}</button>`;
  card(h+'</div>',[...(song?[['▶ Listen','',()=>notes.forEach((n,k)=>setTimeout(()=>tone(n),k*420))]]:[]),['🎵 Songs','',songList],['Close','green',closeCard]]);
  LO.querySelectorAll('.key').forEach(k=>k.onclick=()=>{const n=k.dataset.n;tone(n);if(song&&n===notes[i]){i++;if(i>=notes.length)return setTimeout(()=>concert(song),500);draw()}})};draw()}
function songList(){card(`<h2>🎵 Pick a song</h2>`,[...LC.melodies.map(s=>[`${prog.songs.includes(s.title)?'⭐ ':''}${escapeHtml(s.title)}`,'',()=>piano(s)]),['🎹 Free play','',()=>piano(null)],['Close','green',closeCard]])}
function concert(s){const first=!prog.songs.includes(s.title);if(first)prog.songs.push(s.title);saveProg();
 card(`<div class="bigEmoji">🎻🎉</div><h2>Concert time! You played "${escapeHtml(s.title)}"</h2><div class="concert"><b>Where it's from:</b> ${escapeHtml(s.place)}<br>${escapeHtml(s.info)}</div>`,[sayBtn([`You played ${s.title}!`,s.info]),['Take a bow 🙇','green',()=>{closeCard();if(first)reward(2,'🎹 New song learned!')}]],{say:`Bravo! You played ${s.title}!`})}
// ---- blueprints ----
const bp={active:null,placed:[]};
function blueprintCard(){if(bp.active)return checkCard();const b=pick(LC.blueprints[age()<=6?6:9]);bp.active=b;bp.placed=[];card(`<div class="bigEmoji">📐</div><h2>Blueprint</h2><p>${escapeHtml(b.txt)}</p><p>Build it with new blocks, then tap 📐 again to check.</p>`,[sayBtn(b.txt),['OK!','green',closeCard]],{say:age()<=6?b.txt:null})}
function bpCheck(b,P2){const S=new Set(P2.map(p=>p.join(',')));const has=(x,y,z)=>S.has(x+','+y+','+z);const n=P2.length;
 if(b.t==='count')return n===b.n?[true]:[false,n<b.n?`You have ${n}. You need ${b.n-n} more!`:`You have ${n}. That's ${n-b.n} too many. Break some!`];
 if(b.t==='tower'){let best=0;for(const[x,y,z]of P2){let k=0;while(has(x,y+k,z))k++;best=Math.max(best,k)}return best>=b.n?[true]:[false,`Your tallest tower is ${best}. Make it ${b.n} tall!`]}
 const W=b.w,H=b.t==='wall'?b.h:b.d;for(const[x,y,z]of P2){for(const[ax,az]of b.t==='wall'?[[1,0],[0,1]]:[[1,0]]){let ok=true;for(let i=0;i<W&&ok;i++)for(let j=0;j<H&&ok;j++){const X=b.t==='wall'?x+ax*i:x+i,Y=b.t==='wall'?y+j:y,Z=b.t==='wall'?z+az*i:z+j;if(!has(X,Y,Z))ok=false}if(ok)return[true]}}
 return[false,`Not quite yet. You need a ${W} by ${H} ${b.t==='wall'?'wall':'floor'} (${W*H} blocks). You've placed ${n}. Keep going!`]}
function checkCard(){const b=bp.active;card(`<div class="bigEmoji">📐</div><h2>${escapeHtml(b.txt)}</h2><p>Blocks placed: ${bp.placed.length}</p>`,[['✅ Check my build','green',()=>{const[ok,msg]=bpCheck(b,bp.placed);
  if(ok){bp.active=null;prog.blueprints++;saveProg();card(`<div class="bigEmoji">🏅</div><h2>Perfect build!</h2>`,[['Yay!','green',()=>{closeCard();reward(3,'📐 Blueprint done!')}]],{say:'Perfect build!'})}else card(`<div class="bigEmoji">🤔</div><h2>${escapeHtml(msg)}</h2>`,[sayBtn(msg),['Keep building','green',closeCard]])}],['Start over','',()=>{bp.placed=[];closeCard()}],['New blueprint','',()=>{bp.active=null;blueprintCard()}],['Close','',closeCard]])}
// ---- coin shop (Waikiki) ----
function shopCard(){let h=`<h2>🛍️ Kalakaua Play Shop</h2><p>You have <b>${prog.coins} 🪙</b></p>`;card(h,[...LC.shop.map(it=>[`${it.e} ${escapeHtml(it.n)}: ${it.p}🪙${prog.treasures.includes(it.e)?' ✔️':''}`,'',()=>buy(it)]),['Close','green',closeCard]])}
function buy(it){if(prog.coins<it.p){const need=it.p-prog.coins;return card(`<h2>Save up! You need ${need} more 🪙</h2><p>Earn coins from challenges, stamps, journal pages and blueprints.</p>`,[['OK','green',shopCard]])}
 const left=prog.coins-it.p;const finish=()=>{prog.coins=left;prog.treasures.push(it.e);if(it.unlock&&!(avatar.unlocks||[]).includes(it.unlock)){avatar.unlocks=[...(avatar.unlocks||[]),it.unlock];localStorage.setItem('blockland_avatar_'+profile.id,JSON.stringify(avatar))}saveProg();updateCoinUI();
  card(`<div class="bigEmoji">${it.e}</div><h2>You bought ${escapeHtml(it.n)}!</h2><p>You have ${left} 🪙 left.${it.unlock?' New hat unlocked in My Avatar!':''}</p>`,[['Shop more','',shopCard],['Close','green',closeCard]],{say:`You bought ${it.n}`})};
 if(age()<=6)return card(`<h2>${it.e} ${escapeHtml(it.n)} costs ${it.p} 🪙</h2><p>${'🪙'.repeat(Math.min(prog.coins,20))}</p><p>${prog.coins} take away ${it.p} leaves ${left}.</p>`,[['Buy it!','green',finish],['Back','',shopCard]],{say:`${prog.coins} take away ${it.p} leaves ${left}`});
 const opts=shuffle([...new Set([left,left+1,Math.max(0,left-1),left+2])].slice(0,3).concat(left).filter((v,i,a)=>a.indexOf(v)===i)).slice(0,3);if(!opts.includes(left))opts[0]=left;
 askQ({q:`You have ${prog.coins} 🪙. ${it.n} costs ${it.p}. How many will you have left?`,say:`You have ${prog.coins} coins. It costs ${it.p}. How many are left?`,opts:shuffle(opts).map(String),ans:String(left)},finish)}
// ---- team quests (two iPads) ----
const quest={active:null,myPlaced:0,theirPlaced:0,base:[0,0],emoted:false,heard:false};
function questCard(){if(!net.on)return card(`<h2>🤝 Team Quests</h2><p>Tap 👫 Play Together on the menu to do quests with a friend!</p>`,[['OK','green',closeCard]]);
 const list=LC.quests.filter(q=>!q.world||q.world===worldKind);card(`<h2>🤝 Team Quests</h2>${quest.active?`<p>Now: <b>${escapeHtml(quest.active.txt)}</b></p>`:''}`,[...list.map(q=>[`${prog.quests.includes(q.id)?'✔️ ':''}${escapeHtml(q.txt)}`,'',()=>{quest.active=q;quest.base=[quest.myPlaced,quest.theirPlaced];quest.emoted=quest.heard=false;closeCard();toast('🤝 Quest: '+q.txt);speak(q.txt)}]),['Close','green',closeCard]])}
function questTick(){const q=quest.active;if(!q||!net.on)return;let done=false;
 if(q.type==='meet'){const l=landmarks.find(x=>x.n===q.lm);if(l&&Math.hypot(P.pos.x-l.x,P.pos.z-l.z)<9)for(const id in net.remotes){const r=net.remotes[id].mesh.position;if(Math.hypot(r.x-l.x,r.z-l.z)<9)done=true}}
 if(q.type==='build')done=quest.myPlaced-quest.base[0]>=q.n&&quest.theirPlaced-quest.base[1]>=q.n;
 if(q.type==='emote')done=quest.emoted&&quest.heard;
 if(done){quest.active=null;if(!prog.quests.includes(q.id))prog.quests.push(q.id);saveProg();burst(P.pos.x,P.pos.y+2,P.pos.z,0,40,true);card(`<div class="bigEmoji">🤝🏆</div><h2>Team quest complete!</h2><p>${escapeHtml(q.txt)}</p>`,[['High five!','green',()=>{closeCard();reward(q.reward,'🤝 Quest done!')}]],{say:'Team quest complete!'})}}
// ---- markers (plaques, blueprints, piano, shop) ----
const markerGroup=new THREE.Group();scene.add(markerGroup);
function emojiSprite(e,scale=1.1){const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.fillStyle='#fffd';x.beginPath();x.arc(48,48,44,0,7);x.fill();x.font='58px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,48,54);
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c)}));s.scale.set(scale,scale,scale);return s}
function buildMarkers(){markerGroup.clear();if(!settings.learning)return;const add=(e,x,z,fn,dy=2.2)=>{const s=emojiSprite(e);s.position.set(x+0.5,topY(Math.floor(x),Math.floor(z))+dy,z+0.5);s.userData.act=fn;markerGroup.add(s)};
 for(const l of landmarks)add('📜',l.x+2,l.z+3,()=>plaque(l));const[sx,sz]=spawnXZ;add('📐',sx+3,sz-3,blueprintCard);add('🎹',sx-3,sz-3,songList);
 const ks=landmarks.find(l=>l.n==='Kalakaua Shops');if(ks)add('🪙',ks.x,ks.z+5,shopCard);const rp=landmarks.find(l=>l.n==='Royal Palace'||l.n==='Beachfront Hotels');if(rp)add('🎹',rp.x-2,rp.z+6,songList)}
function learnHub(){card(`<h2>🎓 ${escapeHtml(profile.name)}'s Learning</h2><p>🪙 ${prog.coins} coins · ⭐ ${prog.stars} stars · next challenge in ${intervalSec()===Infinity?'(off)':Math.max(0,Math.ceil((intervalSec()-prog.sinceSec)/60))+' min'}</p>`,
 [['📘 Passport','',passport],['🎒 My Stuff','',()=>myStuff()],['📓 Journal','',journal],['🎹 Piano','',songList],['📐 Blueprint','',blueprintCard],['🔤 Spelling','',()=>card(`<h2>🔤 Spelling</h2><p>Use the letter blocks in the hotbar (A–Z) to spell words in a row, like ${LC.spell.slice(0,5).join(', ')}…</p><p>Words spelled: ${prog.words.join(', ')||'none yet'}</p>`,[['OK','green',closeCard]])],
  ['🤝 Team Quests','',questCard],...(landmarks.some(l=>l.n==='Kalakaua Shops')?[['🛍️ Shop (in Waikiki)','',()=>{const ks=landmarks.find(l=>l.n==='Kalakaua Shops');if(Math.hypot(P.pos.x-ks.x,P.pos.z-ks.z)<14)shopCard();else card('<h2>🛍️ The shop is on Kalakaua Avenue in Waikiki!</h2><p>Use the map to go there, then tap the 🪙 sign.</p>',[['OK','green',closeCard]])}]]:[]),['Close','green',closeCard]])}
tapBtn('bLearn',()=>{if(prog)learnHub()});tapBtn('bStuff',()=>{if(prog)myStuff()});
let lt=0;function learnLoop(dt){tickLearning(dt);lt+=dt;if(lt>1){lt=0;stampCheck();questTick();if(prog&&Math.random()<0.1)saveProg()}}

// ===================== v4.2: Lily voice clips + shop inventory =====================
let VOICE={};fetch('content/audio/manifest.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).then(j=>VOICE=j||{}).catch(()=>{});
const normT=t=>String(t).replace(/\s+/g,' ').trim();
const ONES=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],TENS=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function numWord(n){if(n<20)return ONES[n];if(n<100)return TENS[n/10|0]+(n%10?'-'+ONES[n%10]:'');return ONES[n/100|0]+' hundred'+(n%100?' '+numWord(n%100):'')}
const lily={el:new Audio(),queue:[],unlocked:false,log:[],fallbacks:0};
lily.el.preload='auto';lily.el.addEventListener('ended',()=>playNext());lily.el.addEventListener('error',()=>playNext());
function unlockAudio(){if(lily.unlocked)return;lily.unlocked=true;try{lily.el.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';const p=lily.el.play();if(p)p.catch(()=>{});AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume&&AC.resume()}catch(e){}}
addEventListener('touchstart',unlockAudio,{passive:true,capture:true});addEventListener('mousedown',unlockAudio,{capture:true});
function clipFor(part){if(typeof part==='number')return VOICE['#'+part];return VOICE[normT(part)]}
function playNext(){const f=lily.queue.shift();if(!f)return;lily.el.src='content/audio/'+f;lily.log.push(f);const p=lily.el.play();if(p)p.catch(()=>playNext())}
function stopVoice(){lily.queue=[];try{lily.el.pause()}catch(e){}try{speechSynthesis.cancel()}catch(e){}}
// speak(text) or speak([parts]) where numbers are spoken from number clips
speak=function(t){if(t==null)return;const parts=Array.isArray(t)?t:[t];const files=parts.map(clipFor);stopVoice();
 if(files.length&&files.every(Boolean)){lily.queue=files.slice();playNext();return}
 lily.fallbacks++;const text=parts.map(p=>typeof p==='number'?String(p):p).join(' ');
 try{const u=new SpeechSynthesisUtterance(String(text).replace(/[^\w\s.,!?'’-]/g,' '));u.rate=0.9;speechSynthesis.speak(u)}catch(e){}};
// every fixed line the game can say, for pre-generating Lily clips
function allVoiceLines(){const L=new Set();const add=t=>L.add(normT(t));
 UI_LINES.forEach(add);for(let i=0;i<26;i++)add(String.fromCharCode(65+i));
 for(const it of LC.words6){add(it.w)}for(const it of LC.words9){add(it.w);add(it.m);add(it.s.replace('____','blank'));add(`What does ${it.w} mean?`)}
 for(const w of LC.spell){add(w.split('').join(' ')+'. '+w)}
 for(const n in LC.landmarks){const f=LC.landmarks[n];add(f.f6);add(f.f9);if(f.v)add(`Word of the place: ${f.v.w}, which means ${f.v.m}.`)}
 for(const k in LC.journal){add(LC.journal[k].f6);add(LC.journal[k].f9)}
 for(const s of LC.melodies){add(`Bravo! You played ${s.title}!`);add(`You played ${s.title}!`);add(s.info)}
 for(const it of LC.shop){add(`You got a ${it.n}!`)}for(const q of LC.quests)add(q.txt);
 for(const b of [...LC.blueprints[6],...LC.blueprints[9]])add(b.txt);
 const nums={};for(let i=0;i<=144;i++)nums['#'+i]=numWord(i);return{lines:[...L],numbers:nums}}
const UI_LINES=['Which word matches the picture?','Yes!','Good try! Pick another one.','plus','times','equals what?','is how many?','You build','rows of','blocks. How many blocks?','You have','coins. It costs','How many are left?','take away','leaves',
 'Brain break! Answer three fun questions to keep playing.','Challenge done! Great thinking!','Perfect build!','Team quest complete!','Hello!','This sign is blank.','In one minute, a fun challenge!'];
// ---- shop inventory ----
const DECOR={
 seashell:{n:'Seashell',f:c=>{c.push([0,0,0,PK],[1,0,0,W],[0,1,0,PK])}},
 shaveice:{n:'Shave Ice Stand',f:c=>{F(c,0,0,0,1,0,0,W);c.push([0,1,0,PK],[1,1,0,BL],[0,2,0,LOG],[0,3,0,Y],[1,3,0,Y],[-1,3,0,Y])}},
 pineapple:{n:'Pineapple',f:c=>{c.push([0,0,0,Y],[0,1,0,Y],[0,2,0,LF],[0,3,0,LF])}},
 torch:{n:'Tiki Torch',f:c=>{c.push([0,0,0,LOG],[0,1,0,LOG],[0,2,0,LOG],[0,3,0,O])}},
 toyturtle:{n:'Toy Turtle',f:c=>{F(c,0,0,0,1,0,1,13);c.push([2,0,0,TE],[0,0,2,TE],[1,0,-1,TE],[-1,0,1,TE])}},
 umbrella:{n:'Beach Umbrella',f:c=>{for(let y=0;y<3;y++)c.push([0,y,0,LOG]);for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)c.push([x,3,z,(x+z)%2?W:R]);c.push([0,4,0,R])}},
 ukulele:{n:'Ukulele',f:c=>{c.push([0,0,0,PL],[1,0,0,PL],[0,1,0,PL],[1,1,0,PL],[0,2,0,LOG],[0,3,0,LOG],[0,4,0,BK])}},
 icecream:{n:'Ice Cream Cart',f:c=>{F(c,0,1,0,2,1,0,W);c.push([0,0,0,BK],[2,0,0,BK],[0,2,0,PK],[1,2,0,Y],[2,2,0,13],[1,3,0,LOG],[1,4,0,LOG]);F(c,0,5,-1,2,5,1,PK)}},
 surfboard:{n:'Surfboard',f:c=>{c.push([0,0,0,TE],[0,1,0,W],[0,2,0,TE],[0,3,0,TE])}}};
function shopPrice(it){return age()<=6?it.p:Math.round(it.p*1.5)}
function ownsHat(k){return(avatar.unlocks||[]).includes(k)}
function giveItem(it){prog.inv=prog.inv||{};if(it.type==='hat'){avatar.unlocks=[...new Set([...(avatar.unlocks||[]),it.k])];localStorage.setItem('blockland_avatar_'+profile.id,JSON.stringify(avatar))}else prog.inv[it.k]=(prog.inv[it.k]||0)+1;
 if(!prog.treasures.includes(it.e))prog.treasures.push(it.e);saveProg()}
shopCard=function(){let h=`<h2>🛍️ Kalakaua Play Shop</h2><p>You have <b>${prog.coins} 🪙</b></p>`;
 card(h,[...LC.shop.map(it=>{const owned=it.type==='hat'?ownsHat(it.k):(prog.inv&&prog.inv[it.k]);return[`${it.e} ${escapeHtml(it.n)}: ${it.type==='hat'&&owned?'Owned ✔️':shopPrice(it)+'🪙'}${it.type!=='hat'&&owned?` (have ${prog.inv[it.k]})`:''}`,'',()=>it.type==='hat'&&owned?wearHat(it):buy(it)]}),['🎒 My Stuff','',myStuff],['Close','green',closeCard]])}
buy=function(it){const price=shopPrice(it);if(prog.coins<price){const need=price-prog.coins;return card(`<h2>Save up! You need ${need} more 🪙</h2><p>Earn coins from challenges, stamps, journal pages and blueprints.</p>`,[['OK','green',shopCard]])}
 const left=prog.coins-price;const finish=()=>{prog.coins=left;giveItem(it);updateCoinUI();
  card(`<div class="bigEmoji">${it.e}</div><h2>You got a ${escapeHtml(it.n)}!</h2><p>You have ${left} 🪙 left. ${it.type==='hat'?'Wear it now or change hats in My Avatar.':'Find it in 🎒 My Stuff and place it in the world!'}</p>`,[...(it.type==='hat'?[['👒 Wear it!','green',()=>wearHat(it)]]:[['📦 Place it now','green',()=>{closeCard();placeItem(it.k)}]]),['🛍️ Shop more','',shopCard],['Close','',closeCard]],{say:`You got a ${it.n}!`})};
 if(age()<=6)return card(`<h2>${it.e} ${escapeHtml(it.n)} costs ${price} 🪙</h2><p>${'🪙'.repeat(Math.min(prog.coins,20))}</p><p>${prog.coins} take away ${price} leaves ${left}.</p>`,[['Buy it!','green',finish],['Back','',shopCard]],{say:[prog.coins,'take away',price,'leaves',left]});
 const opts=new Set([left]);while(opts.size<3)opts.add(Math.max(0,left+pick([-2,-1,1,2,3])));
 askQ({q:`You have ${prog.coins} 🪙. ${it.n} costs ${price}. How many will you have left?`,say:['You have',prog.coins,'coins. It costs',price,'How many are left?'],opts:shuffle([...opts]).map(String),ans:String(left)},finish)}
function wearHat(it){avatar.hat=it.k;localStorage.setItem('blockland_avatar_'+profile.id,JSON.stringify(avatar));refreshSelf();if(net.ws)netSend({t:'avatar',name:avatar.name,avatar});closeCard();toast(`${it.e} You're wearing your ${it.n}!`)}
function placeItem(k){if(!(prog.inv&&prog.inv[k]>0))return toast('You need to buy one first!');ghostRot=0;setGhost(k)}
function myStuff(){const inv=prog.inv||{};const items=LC.shop.filter(it=>it.type==='hat'?ownsHat(it.k):inv[it.k]>0);
 card(`<h2>🎒 ${escapeHtml(profile.name)}'s Stuff</h2>${items.length?'':'<p>Nothing yet! Buy things at the 🪙 shop in Waikiki.</p>'}`,[...items.map(it=>it.type==='hat'?[`${it.e} ${escapeHtml(it.n)}: wear`,avatar.hat===it.k?'green':'',()=>wearHat(it)]:[`${it.e} ${escapeHtml(it.n)} ×${inv[it.k]}: place`,'',()=>{closeCard();placeItem(it.k)}]),['Close','green',closeCard]])}

window.__game={lily,allVoiceLines,myStuff,placeItem,getVoice:()=>VOICE,setVoice:v=>VOICE=v,getAvatar:()=>avatar,set,onPlaced,blockTapped,addJournal,closeCard,login,showLogin,startChallenge,getProg:()=>prog,getProfile:()=>profile,settings,bpCheck,learnHub,passport,journal,piano,shopCard,questCard,quest,signs:()=>signs,checkSpelling,tone,checkUpdate,APP_VERSION,genKind,teleport,getLandmarks:()=>landmarks,getSecrets:()=>secrets,P,net,avatar,openMap,generateCity,chooseKind,openAvatarMaker,BCOL,FURN,BUILDS,setGhost,confirmGhost,undo,openLibrary,critters,startWorld,save,get,doBreak,doPlace,critterMenu,setTod:v=>tod=v,spawnNightFriends};
showLogin();requestAnimationFrame(loop);
