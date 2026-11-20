import {hidratarControles} from './hidratacion.js';
import {activarInstalacion} from './instalacion.js';
import {cargarDiapositiva} from './imagenes.js';
import {$,read,write,message,duration,imageFallback,stopMessages,retryImages} from './utilidades.js';
import {navigation} from './navegacion.js';
import {cancelLoads} from './catalogos-json.js';
// Cada sección secundaria se importa cuando se visita por primera vez.
const loaders={pasatiempos:()=>import('./tarjetas.js'),intereses:()=>import('./tarjetas.js'),juegos:()=>import('./tarjetas.js'),musica:()=>import('./musica.js'),opinion:()=>import('./opinion.js')};
const modules=new Map(),pending=new Map();let active='inicio',registration,waiting,refreshing=false;
// HTML: #app-movil-tema actualiza data-tema en <html> y guarda la preferencia.
function theme(value){value=value==='claro'?'claro':'oscuro';document.documentElement.dataset.tema=value;write('tema',value);$('#app-movil-tema').attr('aria-label',value==='claro'?'Activar modo oscuro':'Activar modo claro').find('i').attr('class',value==='claro'?'bi bi-sun-fill':'bi bi-moon-stars');}
// Compatibilidad con el valor de tema que guardaba la versión anterior.
let oldTheme;try{oldTheme=localStorage.getItem('tema');}catch{}
theme(read('tema',oldTheme==='claro'?'claro':'oscuro'));
hidratarControles(document,'principal').on('click.principal','#app-movil-tema',()=>theme(document.documentElement.dataset.tema==='claro'?'oscuro':'claro'));
$(document).on('click.principal','#aviso-app',()=>$('#aviso-app').stop(true,true).fadeOut(duration(100),function(){this.hidden=true;}));
document.addEventListener('error',imageFallback,true);
document.querySelectorAll('img').forEach(img=>{if(img.hasAttribute('src')&&img.complete&&img.naturalWidth===0)imageFallback({target:img});});
// Teclado virtual: visualViewport mide el alto real y mantiene enfocado el campo.
let viewportFrame=0,baselineHeight=innerHeight;
// HTML: los campos enfocados activan .teclado-abierto y CSS oculta la barra inferior.
function fitViewport(){
  cancelAnimationFrame(viewportFrame);viewportFrame=requestAnimationFrame(()=>{
    const vv=window.visualViewport,height=vv?.height||innerHeight,top=vv?.offsetTop||0;
    document.documentElement.style.setProperty('--app-height',height+'px');document.documentElement.style.setProperty('--app-top',top+'px');
    const editable=document.activeElement?.matches('input:not([type="hidden"]),textarea,select');
    if(!editable)baselineHeight=innerHeight;
    document.body.classList.toggle('teclado-abierto',!!editable&&Math.max(baselineHeight,innerHeight)-height>120);
    if(editable)document.activeElement.scrollIntoView({block:'nearest',behavior:'instant'});
  });
}
$(document).on('focusin.principal focusout.principal','input,textarea,select',fitViewport);
window.visualViewport?.addEventListener('resize',fitViewport);window.visualViewport?.addEventListener('scroll',fitViewport);
$(window).off('.principal').on('resize.principal',fitViewport);
// Indicador de conexión y restauración de imágenes externas.
// HTML: #estado-conexion y .pista-play explican qué funciona sin Internet.
function connection(){
  const offline=!navigator.onLine,box=$('#estado-conexion');
  if(offline)box.text('Sin conexión · Puedes usar los catálogos y favoritos guardados.').prop('hidden',false).show();
  else box.hide().prop('hidden',true);
  document.body.classList.toggle('sin-conexion',offline);
  if(!offline)retryImages();
  const hint=document.querySelector('.pista-play');if(hint)hint.textContent=offline?'La lista está disponible sin conexión. YouTube necesita Internet.':'Toca el play para escucharla en YouTube';
}
$(window).on('online.principal offline.principal',connection);
connection();fitViewport();
// Instalación y diagnóstico local. Las métricas se consultan en window.metricasPWA.
activarInstalacion();
import('./metricas-web.js').then(modulo => modulo.activarMetricas());
// Hidratación progresiva: las vistas conservan el HTML y enlazan eventos al entrar.
const nav=navigation(async id=>{
  if(active!==id)modules.get(active)?.suspend?.();active=id;
  if(!loaders[id]||modules.has(id))return;
  if(!pending.has(id)){
    const section=document.getElementById(id);section.setAttribute('aria-busy','true');
    pending.set(id,loaders[id]().then(module=>module.mount(id)).then(control=>{modules.set(id,control);if(active!==id)control.suspend?.();}).catch(()=>{message('No pudimos abrir esta sección. Vuelve a Inicio e inténtalo otra vez.');}).finally(()=>{pending.delete(id);section.removeAttribute('aria-busy');}));
  }
  await pending.get(id);
});
// Carrusel local: no depende de Internet. Pausa al ocultarse la página.
// HTML: #miCarrusel contiene las diapositivas y sus botones data-bs-slide.
const carousel=document.getElementById('miCarrusel');let slide=0,carouselTimer;
// Cambia la clase active y solicita la imagen de la diapositiva seleccionada.
function showSlide(index){const items=[...carousel.querySelectorAll('.carousel-item')];slide=(index+items.length)%items.length;cargarDiapositiva(items[slide]);items.forEach((item,i)=>{item.classList.toggle('active',i===slide);item.setAttribute('aria-hidden',String(i!==slide));});carousel.querySelectorAll('[data-bs-slide-to]').forEach((b,i)=>{b.classList.toggle('active',i===slide);b.setAttribute('aria-current',String(i===slide));});}
// Limpia el intervalo al salir de Inicio o al ocultarse la página.
function pauseCarousel(){clearInterval(carouselTimer);carouselTimer=undefined;}
function startCarousel(){pauseCarousel();if(!document.hidden&&document.body.dataset.appVista==='inicio'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)carouselTimer=setInterval(()=>showSlide(slide+1),6500);}
hidratarControles(carousel,'carrusel').on('click.carrusel','[data-bs-slide]',function(){showSlide(slide+(this.dataset.bsSlide==='next'?1:-1));startCarousel();}).on('click.carrusel','[data-bs-slide-to]',function(){showSlide(Number(this.dataset.bsSlideTo));startCarousel();}).on('mouseenter.carrusel focusin.carrusel',pauseCarousel).on('mouseleave.carrusel focusout.carrusel',startCarousel);
$(document).on('app:view.principal',()=>{startCarousel();retryImages();}).on('visibilitychange.principal',startCarousel);showSlide(0);startCarousel();
// El Service Worker actualiza el paquete completo bajo confirmación del usuario.
// HTML: #actualizar-app aparece cuando el Service Worker tiene una versión lista.
function showUpdate(worker){waiting=worker;$('#actualizar-app').prop('hidden',false).show();}
$(document).on('click.principal','#actualizar-app',()=>{if(document.activeElement?.closest('form'))document.activeElement.blur();waiting?.postMessage({type:'ACTIVATE_UPDATE'});});
if('serviceWorker'in navigator){
  let yaControlada=Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
    if(!yaControlada){yaControlada=true;return;}
    if(refreshing)return;refreshing=true;location.reload();
  });
  window.addEventListener('load',async()=>{
    try{registration=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
      if(registration.waiting)showUpdate(registration.waiting);
      const watch=worker=>worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate(worker);if(worker.state==='redundant')message(navigator.serviceWorker.controller?'La actualización no se completó. Puedes seguir usando la versión anterior.':'No se pudo preparar el modo sin conexión. Comprueba la conexión y vuelve a cargar.');});
      watch(registration.installing);registration.addEventListener('updatefound',()=>watch(registration.installing));
    }catch{message('No se pudo preparar el modo sin conexión. Comprueba tu conexión y vuelve a cargar.');}
  },{once:true});
}
// El BFCache conserva los listeners de una página. Se detienen los trabajos
// pendientes y se reanudan los recursos de la página al regresar.
$(window).on('pagehide.principal',()=>{pauseCarousel();cancelLoads();stopMessages();cancelAnimationFrame(viewportFrame);modules.forEach(m=>m.suspend?.());$('.mas,.aviso-app').stop(true,true);});
$(window).on('pageshow.principal',()=>{connection();fitViewport();startCarousel();});
window.addEventListener('pagehide',evento=>{if(evento.persisted)return;modules.forEach(m=>m.destroy?.());nav.destroy();$(document).off('.principal');$(window).off('.principal');$(carousel).off('.carrusel');document.removeEventListener('error',imageFallback,true);window.visualViewport?.removeEventListener('resize',fitViewport);window.visualViewport?.removeEventListener('scroll',fitViewport);});
