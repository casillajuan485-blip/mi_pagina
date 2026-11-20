import {hidratarControles} from './hidratacion.js';
import {message} from './utilidades.js';
// Captura el prompt e invócalo directamente al pulsar Instalar.
export function activarInstalacion() {
  const aviso = document.querySelector('.instalacion');
  const boton = document.querySelector('.mas__instalar');
  const modo = matchMedia('(display-mode: standalone)');
  const instalada = () => modo.matches || navigator.standalone === true;
  let solicitud, reloj, mostrado = false;
  function cerrar() { clearTimeout(reloj); aviso.hidden = true; }
  function mostrar() {
    boton.hidden = instalada();
    if (mostrado || instalada()) return;
    mostrado = true;
    aviso.hidden = false;
    reloj = setTimeout(cerrar,5000);
  }
  window.addEventListener('beforeinstallprompt', evento => {
    evento.preventDefault();
    solicitud = evento;
    mostrar();
  });
  window.addEventListener('appinstalled', () => { solicitud = undefined; boton.hidden = true; cerrar(); });
  modo.addEventListener('change', () => { if (instalada()) { boton.hidden = true; cerrar(); } });
  window.addEventListener('pagehide', cerrar);
  hidratarControles(document,'instalacion')
    .on('click.instalacion', '[data-cerrar-instalacion]', cerrar)
    .on('click.instalacion', '[data-instalar-app]', async () => {
      cerrar();
      if (instalada()) return;
      const evento = solicitud;
      solicitud = undefined;
      if (evento) {
        try { await evento.prompt(); await evento.userChoice; return; }
        catch { /* Continúa con las instrucciones del navegador. */ }
      }
      const ayuda = document.getElementById('instalacion-ayuda');
      ayuda.textContent = /iPhone|iPad|iPod/.test(navigator.userAgent)
        ? 'En Safari, toca Compartir y luego Añadir a pantalla de inicio.'
        : 'Abre el menú del navegador y elige Instalar aplicación o Añadir a pantalla de inicio.';
      ayuda.hidden = false;
      if (!boton.closest('[hidden]')) ayuda.focus();
      else message(ayuda.textContent);
    });
  if (document.readyState === 'complete') mostrar();
  else window.addEventListener('load', mostrar, {once:true});
}
