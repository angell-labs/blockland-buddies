// Blockland Buddies "Play Together" for a static site (GitHub Pages).
// One iPad hosts: it runs the shared world in the browser and gets a 4-letter room code.
// Other iPads join with that code. Connections are direct iPad-to-iPad (WebRTC via PeerJS).
// The public PeerJS broker (0.peerjs.com) is only used to introduce the iPads to each other.
(function(){
const WX=128,WY=48,WZ=128,EMOTES=12,MAX_PLAYERS=6,PREFIX='blockland-buddies-',CHUNK=12000;
const KINDS=['nature','england','hawaii'],HATS=['none','cap','crown','flower','bow','wizard','lei','sunhat'];
const LETTERS='ABCDEFGHJKLMNPQRSTUVWXYZ';
function rleDecode(str){const s=atob(str),a=new Uint8Array(WX*WY*WZ);let p=0;for(let i=0;i+2<s.length;i+=3){const v=s.charCodeAt(i),n=s.charCodeAt(i+1)|(s.charCodeAt(i+2)<<8);a.fill(v,p,p+n);p+=n}return a}
function rleEncode(a){let out='';const parts=[];for(let i=0;i<a.length;){const v=a[i];let n=1;while(i+n<a.length&&a[i+n]===v&&n<65535)n++;out+=String.fromCharCode(v,n&255,n>>8);i+=n;if(out.length>30000){parts.push(out);out=''}}parts.push(out);return btoa(parts.join(''))}
const cleanName=s=>String(s||'').replace(/[^A-Za-z0-9 _\-]/g,'').slice(0,16).trim()||'Builder';
function cleanAvatar(a){const o={};if(a&&typeof a==='object'){for(const k of['skin','hair','shirt','pants']){const v=String(a[k]||'');if(/^#[0-9a-fA-F]{6}$/.test(v))o[k]=v}const h=String(a.hat||'none');o.hat=HATS.includes(h)?h:'none'}return o}
function cleanList(v,keys,n=40){const out=[];if(Array.isArray(v))for(const e of v.slice(0,n)){if(!e||typeof e!=='object')continue;const d={};for(const k of keys){const x=e[k];if(typeof x==='number'&&isFinite(x))d[k]=Math.round(x*100)/100;else if(typeof x==='string')d[k]=x.slice(0,30);else if(x==null||typeof x==='boolean')d[k]=x??null}out.push(d)}return out}
const SHARED_KEY=k=>'blockland_shared_'+k;
function lsBytes(){let n=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);n+=k.length+(localStorage.getItem(k)||'').length}}catch(e){}return n}

// chunked string transport over a PeerJS DataConnection (raw serialization)
let chunkSeq=0;
function wireSend(conn,obj){if(!conn)return;if(!conn.open){if(!conn._closed)(conn._q=conn._q||[]).push(obj);return}const s=JSON.stringify(obj);try{if(s.length<=CHUNK){conn.send('M'+s);return}const id=(++chunkSeq).toString(36),n=Math.ceil(s.length/CHUNK);for(let i=0;i<n;i++)conn.send('C'+id+'|'+i+'|'+n+'|'+s.slice(i*CHUNK,(i+1)*CHUNK))}catch(e){}}
function wireReceiver(cb){const bufs={};return data=>{if(typeof data!=='string')return;if(data[0]==='M'){let m;try{m=JSON.parse(data.slice(1))}catch(e){return}cb(m);return}
 if(data[0]==='C'){const a=data.indexOf('|'),b=data.indexOf('|',a+1),c=data.indexOf('|',b+1);const id=data.slice(1,a),i=+data.slice(a+1,b),n=+data.slice(b+1,c);if(!(n>0&&n<2000))return;const B=bufs[id]||(bufs[id]={got:0,p:new Array(n)});if(B.p[i]==null){B.p[i]=data.slice(c+1);B.got++}if(B.got===n){delete bufs[id];let m;try{m=JSON.parse(B.p.join(''))}catch(e){return}cb(m)}}}}

// ---------- the shared world, run on the host iPad (port of the old Mac server) ----------
function Hub(){const st={world:null,meta:{},dirty:false};const clients=new Map();let nextId=1;
 const others=me=>[...clients.values()].filter(c=>c!==me&&c.ready).map(c=>({id:c.id,name:c.name,avatar:c.avatar,pos:c.pos}));
 const bcast=(o,skip)=>{for(const c of clients.values())if(c!==skip)c.send(o)};
 function load(kind){try{const raw=localStorage.getItem(SHARED_KEY(kind));if(!raw)return false;const d=JSON.parse(raw);st.world=rleDecode(d.w);st.meta=d.meta||{};st.meta.kind=kind;return true}catch(e){return false}}
 function save(){if(!st.world||!st.dirty)return;st.dirty=false;try{const k=SHARED_KEY(st.meta.kind||'nature');const s=JSON.stringify({meta:st.meta,w:rleEncode(st.world)});const old=(localStorage.getItem(k)||'').length;
  // keep plenty of room for the kids' own saved worlds (Safari allows about 5 MB per site)
  if(lsBytes()-old+s.length<3.5e6)localStorage.setItem(k,s)}catch(e){}}
 setInterval(save,15000);
 function welcome(me){me.send({t:'welcome',id:me.id,meta:st.meta,w:rleEncode(st.world),others:others(me)});me.ready=true;bcast({t:'join',id:me.id,name:me.name,avatar:me.avatar},me)}
 function add(send,close){if(clients.size>=MAX_PLAYERS){send({t:'full'});setTimeout(close,500);return null}const me={id:nextId++,name:'Builder',avatar:{},pos:[0,0,0,0],send,close,last:Date.now()};clients.set(me.id,me);return me}
 function remove(me){if(!clients.has(me.id))return;clients.delete(me.id);if(me.ready)bcast({t:'leave',id:me.id,name:me.name});save()}
 setInterval(()=>{const now=Date.now();for(const c of clients.values())if(c.remote&&now-c.last>45000){remove(c);try{c.close()}catch(e){}}},5000);
 function handle(me,m){if(!clients.has(me.id)||!m||typeof m!=='object')return;me.last=Date.now();const t=m.t;
  if(t==='hello'){const cid=String(m.cid||'').slice(0,64);me.cid=cid;if(cid)for(const c of clients.values())if(c!==me&&c.cid===cid){remove(c);try{c.close()}catch(e){}}
   me.name=cleanName(m.name);me.avatar=cleanAvatar(m.avatar);if(!st.world)me.send({t:'welcome',id:me.id,needWorld:true,others:others(me)});else welcome(me)}
  else if(t==='pick'&&!me.ready){const kind=KINDS.includes(m.kind)?m.kind:'nature';if(!st.world)load(kind);if(!st.world){me.uploading=kind;me.send({t:'needUpload',kind});return}welcome(me)}
  else if(t==='uploadWorld'&&!st.world&&me.uploading){try{st.world=rleDecode(m.w);st.meta={name:cleanName(m.name)||'Our World',kind:me.uploading,spawn:(m.spawn||[64,64]).slice(0,2).map(Number),landmarks:cleanList(m.landmarks,['n','e','x','z']),secrets:cleanList(m.secrets,['kind','x','y','z','swim'])};st.dirty=true;save();me.ready=true;me.send({t:'worldAccepted'});bcast({t:'join',id:me.id,name:me.name,avatar:me.avatar},me)}catch(e){}}
  else if(t==='uploadWorld'&&st.world&&!me.ready)welcome(me);
  else if(!me.ready)return;
  else if(t==='sets'){const ok=[];for(const e of(Array.isArray(m.l)?m.l:[]).slice(0,20000)){if(!Array.isArray(e))continue;const[x,y,z,v]=e.map(q=>q|0);if(x>=0&&x<WX&&y>0&&y<WY&&z>=0&&z<WZ&&v>=0&&v<64){st.world[x+WX*(z+WZ*y)]=v;ok.push([x,y,z,v])}}if(ok.length){st.dirty=true;bcast({t:'sets',l:ok},me)}}
  else if(t==='pos'){if(!Array.isArray(m.p))return;me.pos=m.p.slice(0,4).map(q=>Math.round((+q||0)*100)/100);bcast({t:'pos',id:me.id,p:me.pos},me)}
  else if(t==='emote'){const i=m.i;if(Number.isInteger(i)&&i>=0&&i<EMOTES)bcast({t:'emote',id:me.id,name:me.name,i})}
  else if(t==='avatar'){me.name=cleanName(m.name);me.avatar=cleanAvatar(m.avatar);bcast({t:'avatar',id:me.id,name:me.name,avatar:me.avatar},me)}}
 return{add,remove,handle,save}}

// A small object that behaves like the WebSocket the game used to open to the Mac.
function FakeSocket(){const s={readyState:0,onopen:null,onmessage:null,onclose:null,onerror:null,send(){},close(){}};
 s._open=()=>{if(s.readyState!==0)return;s.readyState=1;s.onopen&&s.onopen()};
 s._msg=o=>{if(s.readyState===1&&s.onmessage)s.onmessage({data:JSON.stringify(o)})};
 s._close=()=>{if(s.readyState>=2)return;s.readyState=3;s.onclose&&s.onclose()};return s}

let current=null; // {peer, role, code}
function stop(){if(current){try{current.hub&&current.hub.save()}catch(e){}try{current.peer.destroy()}catch(e){}current=null}}
const newCode=()=>Array.from({length:4},()=>LETTERS[Math.random()*LETTERS.length|0]).join('');

// Host: returns a socket for the host's own game; status(msg, code) reports progress.
function host(status){stop();const sock=FakeSocket();const hub=Hub();let tries=0;
 const start=()=>{const code=newCode();const peer=new Peer(PREFIX+code,{debug:0});current={peer,role:'host',code,hub};
  let me=null;
  peer.on('open',()=>{status&&status('open',code);
   me=hub.add(o=>queueMicrotask(()=>sock._msg(o)),()=>sock._close());
   sock.send=str=>{let m;try{m=JSON.parse(str)}catch(e){return}queueMicrotask(()=>hub.handle(me,m))};
   sock.close=()=>{hub.remove(me);stop();sock._close()};sock._open()});
  peer.on('connection',conn=>{let c=null,refused=false;const ensure=()=>{if(!c&&!refused){c=hub.add(o=>wireSend(conn,o),()=>conn.close());if(c)c.remote=true;else refused=true}return c};
   conn.on('open',()=>{ensure();const q=conn._q||[];conn._q=[];q.forEach(o=>wireSend(conn,o))});
   conn.on('data',wireReceiver(m=>{if(ensure())hub.handle(c,m)}));conn.on('close',()=>{conn._closed=true;conn._q=[];if(c)hub.remove(c)});conn.on('error',()=>{if(c)hub.remove(c)})});
  peer.on('disconnected',()=>{try{if(!peer.destroyed)peer.reconnect()}catch(e){}}); // keep the room code reachable for late joiners
  peer.on('error',err=>{if(err&&err.type==='unavailable-id'&&tries++<5){try{peer.destroy()}catch(e){}return start()}
   if(sock.readyState===0){status&&status('error',err&&err.type);sock._close()}})};
 start();return sock}

// Join: connect to a host's room code.
function join(code,status){stop();const sock=FakeSocket();code=String(code||'').toUpperCase().replace(/[^A-Z]/g,'').slice(0,4);
 const peer=new Peer({debug:0});current={peer,role:'guest',code};let conn=null,opened=false;
 const fail=why=>{if(!opened){status&&status('error',why);try{peer.destroy()}catch(e){}sock._close()}};
 const timer=setTimeout(()=>fail('timeout'),20000);
 peer.on('open',()=>{conn=peer.connect(PREFIX+code,{serialization:'raw',reliable:true});
  conn.on('open',()=>{opened=true;clearTimeout(timer);sock.send=str=>{let m;try{m=JSON.parse(str)}catch(e){return}wireSend(conn,m)};sock.close=()=>{try{conn.close()}catch(e){}stop();sock._close()};sock._open()});
  conn.on('data',wireReceiver(m=>{if(m.t==='full'){toastFull();return}sock._msg(m)}));
  conn.on('close',()=>{clearTimeout(timer);if(opened){stop();sock._close()}else fail('closed')});conn.on('error',()=>fail('conn'))});
 peer.on('error',err=>fail(err&&err.type));
 function toastFull(){status&&status('full')}
 return sock}
window.BBNet={host,join,stop,get code(){return current&&current.code},get role(){return current&&current.role},available:typeof Peer!=='undefined'};
})();
