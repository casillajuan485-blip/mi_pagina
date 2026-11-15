const PREFIX='beimar-original-pwa-';
const VERSION='frontend-17dcb80949ed';
const CACHE=PREFIX+VERSION;
const ASSETS=["./","./assets/chunks/cards-K6LK5UYK.js","./assets/chunks/chunk-7XYHCREX.js","./assets/chunks/chunk-EI2SK2JV.js","./assets/chunks/chunk-OCXD2OVD.js","./assets/chunks/music-DND6RVJV.js","./assets/chunks/opinion-PUCPGU4B.js","./assets/chunks/respaldo-WWQT6T2E.js","./assets/main.js","./css/adaptacion.css","./css/base.css","./css/efectos.css","./css/estilo.css","./css/extra.css","./css/inicio.css","./css/menu.css","./data/canciones.json","./data/intereses.json","./data/juegos.json","./data/pasatiempos.json","./icons/icon-192.png","./icons/icon-512.png","./img/clash_of_clans.jpg","./img/clash_royal.jpg","./img/cuphead.jpg","./img/efootbal.jpg","./img/freddys.jpg","./img/good_of_war.jpg","./img/hit_run.jpg","./img/left4_dead.jpg","./img/mobil.jpg","./img/pasatiempo.jpg","./img/resident_evil.jpg","./img/respaldo.svg","./img/silent_hill.jpg","./img/teken.jpg","./index.html","./manifest.json","./vendor/bootstrap-icons.min.css","./vendor/bootstrap-icons.woff2","./vendor/jquery-3.7.1.min.js"];
const runtimeName=CACHE+'-imagenes';
self.addEventListener('install',event=>{
  // La instalación debe completarse entera: una actualización incompleta
  // no sustituye a la versión offline que ya funciona.
  event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);}catch(error){await caches.delete(CACHE);throw error;}})());
});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE&&k!==runtimeName).map(k=>caches.delete(k)));await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
  const request=event.request;if(request.method!=='GET')return;
  const url=new URL(request.url),same=url.origin===self.location.origin;
  if(!same){
    // No se almacenan respuestas opacas; si una imagen externa falla,
    // se muestra una imagen local. YouTube sigue requiriendo Internet.
    if(request.destination==='image')event.respondWith((async()=>{const cache=await caches.open(runtimeName);const found=await cache.match(request);if(found)return found;try{const response=await fetch(request,{mode:'cors'});if(!response.ok)throw new Error('Imagen');await cache.put(request,response.clone());const keys=await cache.keys();if(keys.length>60)await cache.delete(keys[0]);return response;}catch{return (await caches.match('./img/respaldo.svg'))||Response.error();}})());
    return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    // HTML, CSS, JS y JSON se sirven de la misma versión atómica.
    const hit=await cache.match(request,{ignoreSearch:request.destination==='document'});if(hit)return hit;
    try{return await fetch(request);}catch{
      if(request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
      if(request.destination==='image')return (await cache.match('./img/respaldo.svg'))||Response.error();
      return new Response(JSON.stringify({error:'Sin conexión'}),{status:503,headers:{'Content-Type':'application/json'}});
    }
  })());
});
