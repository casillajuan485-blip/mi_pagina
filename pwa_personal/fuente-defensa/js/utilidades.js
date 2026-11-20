// Utilidades compartidas: almacenamiento, avisos, imágenes, filtros y favoritos.
export const $ = window.jQuery;
export const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
export const readList = key => { const value=read(key,[]);return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]; };
export function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }
let messageTimer;
// HTML: #aviso-app muestra mensajes como texto y se oculta con un temporizador.
export function message(text) {
  clearTimeout(messageTimer);
  const box = $('#aviso-app');
  box.text(text).prop('hidden', false).stop(true, true).fadeIn(duration(160));
  messageTimer=setTimeout(()=>box.stop(true,true).fadeOut(duration(120),()=>box.prop('hidden',true)),6000);
}
export function stopMessages(){clearTimeout(messageTimer);}
export const duration = n => matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : n;
// Cancela la ejecución anterior mientras el usuario sigue escribiendo.
export function debounce(fn, delay = 250) {
  let timer;
  const wrapped = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  wrapped.cancel = () => clearTimeout(timer);
  return wrapped;
}
// Las tarjetas reciben una URL local o HTTPS autorizada. Las demás usan el SVG de respaldo.
export function safeImage(value) {
  try { const u = new URL(value, document.baseURI); return ((['http:','https:'].includes(u.protocol) && u.origin === location.origin && u.pathname.startsWith(new URL('./',document.baseURI).pathname)) || (u.protocol === 'https:' && ['images.unsplash.com','img.youtube.com'].includes(u.hostname))) ? u.href : 'img/respaldo.svg'; } catch { return 'img/respaldo.svg'; }
}
export function imageFallback(event) {
  const img = event.target;
  if (img.tagName === 'IMG' && !img.dataset.respaldo) { img.dataset.originalSrc=img.src;img.dataset.respaldo = '1'; img.src = 'img/respaldo.svg'; }
}
export function retryImages(){if(!navigator.onLine)return;document.querySelectorAll('img[data-original-src]').forEach(img=>{const original=img.dataset.originalSrc;delete img.dataset.originalSrc;delete img.dataset.respaldo;img.src=original;});}
export function favorite(button, on) {
  button.classList.toggle('on', on); button.setAttribute('aria-pressed', String(on));
  button.querySelector('i').className = on ? 'bi bi-heart-fill' : 'bi bi-heart';
}
export function normalize(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es'); }
export function empty(container, text) { const p = document.createElement('p'); p.className = 'vacio'; p.textContent = text; container.replaceChildren(p); }

export function ejemploSinUsoParaTreeShaking(){return 'PWA_DEMO_CODIGO_MUERTO';}
