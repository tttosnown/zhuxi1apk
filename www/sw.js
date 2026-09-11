const CACHE='zhuxi-v34-startup-weekfix2';
const ASSETS=['./','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','./code-bank.json','./code-bank.min.json','./norm-library.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  // HTML 必须优先取网络，避免旧 Service Worker 缓存让首次打开仍停在上一版周历。
  if(url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r}).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r}).catch(()=>cached)));
});
