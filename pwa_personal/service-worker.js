const PREFIX='beimar-original-pwa-';
// Cambia la versión cuando publiques cambios de archivos en GitHub Pages.
const VERSION='frontend-694f2631d42e';
const CACHE=PREFIX+VERSION;
// Lista de HTML, CSS, módulos y datos necesarios para abrir la PWA offline.
const ASSETS=[
  "./",
  "./css/base-y-rejilla.css",
  "./css/bootstrap-icons.woff2",
  "./css/controles-e-instalacion.css",
  "./css/fondo-y-animaciones.css",
  "./css/iconos-utilizados.css",
  "./css/menu-de-seccion.css",
  "./css/orden-de-cascada.css",
  "./css/portada-y-navegacion.css",
  "./css/responsive-y-teclado.css",
  "./css/secciones-y-contenido.css",
  "./css/tema-tarjetas-y-formulario.css",
  "./data/canciones.json",
  "./data/intereses.json",
  "./data/juegos.json",
  "./data/pasatiempos.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./img/clash_of_clans.webp",
  "./img/clash_royal.webp",
  "./img/cuphead.webp",
  "./img/efootbal.webp",
  "./img/freddys.webp",
  "./img/good_of_war.webp",
  "./img/hit_run.webp",
  "./img/left4_dead.webp",
  "./img/mobil.webp",
  "./img/pasatiempo.webp",
  "./img/portada-dibujo.svg",
  "./img/resident_evil.webp",
  "./img/respaldo.svg",
  "./img/silent_hill.webp",
  "./img/teken.webp",
  "./index.html",
  "./js/inicio-app.js",
  "./js/librerias/dompurify.mjs",
  "./js/librerias/dompurify.umd.js",
  "./js/librerias/jquery-3.7.1.min.js",
  "./js/modulos/chunk-B3FUGA7J.js",
  "./js/modulos/chunk-PUEUFYA4.js",
  "./js/modulos/chunk-WHZ5JBAO.js",
  "./js/modulos/metricas-web-ME6BGLAB.js",
  "./js/modulos/musica-WRIBPWCX.js",
  "./js/modulos/opinion-DSHSCJQT.js",
  "./js/modulos/respaldo-5KWBJD6L.js",
  "./js/modulos/tarjetas-OKCB5LI3.js",
  "./manifest.json"
];
// Proxy offline. Guarda imágenes externas bajo demanda, con límite de entradas.
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
  if (same && !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if(!same){
    // Se conserva el modo original de <img> (normalmente no-cors).
    // Una respuesta opaca tiene status 0 y puede contener una imagen valida.
    // Red primero: una respuesta antigua fallida no queda fijada para siempre.
    if(request.destination==='image'&&['images.unsplash.com','img.youtube.com'].includes(url.hostname))event.respondWith((async()=>{
      let cache;try{cache=await caches.open(runtimeName);}catch{}
      try{
        const response=await fetch(request, {signal:AbortSignal.timeout(4000)});
        if(!response.ok&&response.type!=='opaque')throw new Error('Imagen');
        if(cache)event.waitUntil((async()=>{try{await cache.put(request,response.clone());const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-60)))await cache.delete(key);}catch{/* Una cuota agotada no impide mostrar la imagen. */}})());
        return response;
      }catch{
        if(cache){try{const saved=await cache.match(request);if(saved)return saved;}catch{}}
        return (await caches.match('./img/respaldo.svg'))||Response.error();
      }
    })());
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
