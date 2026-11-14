// Network-first service worker (works on the GitHub Pages https site): new versions load right away, and the game still opens offline.
const VERSION='5.0.0';const C='blockland-'+VERSION;
const F=['./','index.html','style.css','game.js','vendor/three.module.js','vendor/peerjs.min.js','p2p.js','manifest.json','icon.png','version.json','content/learning.json'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname==='/ws')return;
 const live=/(version\.json|\/version|manifest\.json)$/.test(u.pathname);
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok&&!live){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
