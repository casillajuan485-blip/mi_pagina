import {hidratarControles} from './hidratacion.js';
import {$,duration} from './utilidades.js';
const ids=['inicio','pasatiempos','intereses','horarios','musica','juegos','opinion'];
export function navigation(onVisit){
  let current='inicio',inert=[];
  const panel=document.getElementById('app-mas-panel'),backdrop=document.querySelector('.mas-fondo'),more=document.getElementById('app-mas-abrir');
  function closeMenus(){
    $('.hamb-panel.abierto').removeClass('abierto').prop('inert',true).attr('aria-hidden','true');
    $('.hamb').attr('aria-expanded','false').html('<i class="bi bi-list" aria-hidden="true"></i>');
  }
  // HTML: #app-mas-panel se cierra y devuelve el foco al botón #app-mas-abrir.
  function closeMore(focus=true){
    if(panel.hidden)return;
    $(panel).stop(true,true).fadeOut(duration(100),()=>{panel.hidden=true;});
    backdrop.hidden=true;more.setAttribute('aria-expanded','false');inert.forEach(el=>el.inert=false);inert=[];if(focus)more.focus();
  }
  // Reutiliza las secciones del HTML y mueve el foco al título que se abre.
  async function visit(id,focus=false){
    if(!ids.includes(id))id='inicio';
    closeMore(false);closeMenus();current=id;
    document.body.dataset.appVista=id;
    ids.forEach(name=>{const section=document.getElementById(name),active=name===id;section.classList.toggle('app-vista-activa',active);section.inert=!active;section.setAttribute('aria-hidden',String(!active));});
    document.querySelectorAll('[data-app-vista]').forEach(b=>{const active=b.dataset.appVista===id;b.classList.toggle('activo',active);b.setAttribute('aria-current',active?'page':'false');});
    const extra=['intereses','horarios','opinion'].includes(id);more.classList.toggle('activo',extra);more.setAttribute('aria-current',extra?'page':'false');
    const target=document.getElementById(id);target.scrollTop=0;
    if(focus){const title=target.querySelector('h2');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}}
    document.dispatchEvent(new CustomEvent('app:view',{detail:id}));
    await onVisit(id);
  }
  // Crea un menú contextual en cada sección y conserva ahí sus filtros.
  ids.slice(1).forEach(id=>{
    const section=document.getElementById(id),container=section.querySelector('.container');
    const b=document.createElement('button');b.type='button';b.className='hamb';b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Menú de la sección');b.innerHTML='<i class="bi bi-list" aria-hidden="true"></i>';
    const menu=document.createElement('div');menu.className='hamb-panel';menu.id='menu-'+id;menu.inert=true;menu.setAttribute('aria-hidden','true');b.setAttribute('aria-controls',menu.id);
    const filter=section.querySelector('.filtros');if(filter)menu.append(filter);
    const actions=document.createElement('div');actions.className='hamb-acciones';actions.innerHTML='<button type="button" data-a="sig"><i class="bi bi-arrow-down-circle" aria-hidden="true"></i> Siguiente sección</button><button type="button" data-a="inicio"><i class="bi bi-arrow-up-circle" aria-hidden="true"></i> Volver al inicio</button><button type="button" data-a="plegar"><i class="bi bi-eye-slash" aria-hidden="true"></i> <span>Ocultar contenido</span></button>';
    menu.append(actions);container.prepend(menu);container.prepend(b);
  });
  // HTML: data-app-vista indica el id de la sección. data-a identifica cada acción del menú.
  const body=hidratarControles(document,'navegacion');
  body.on('click.navegacion','button[data-app-vista]',function(){const id=this.dataset.appVista;if(location.hash.slice(1)===id)visit(id,true);else location.hash=id;});
  body.on('click.navegacion','a[href^="#"]',function(e){const id=this.getAttribute('href').slice(1);if(ids.includes(id)){e.preventDefault();if(location.hash.slice(1)===id)visit(id,true);else location.hash=id;}});
  body.on('click.navegacion','.hamb',function(e){e.stopPropagation();const menu=this.nextElementSibling,open=!menu.classList.contains('abierto');closeMenus();menu.classList.toggle('abierto',open);menu.inert=!open;menu.setAttribute('aria-hidden',String(!open));this.setAttribute('aria-expanded',String(open));this.innerHTML=open?'<i class="bi bi-x-lg" aria-hidden="true"></i>':'<i class="bi bi-list" aria-hidden="true"></i>';});
  body.on('click.navegacion','[data-a]',function(){
    const action=this.dataset.a;
    if(action==='sig')location.hash=ids[(ids.indexOf(current)+1)%ids.length];
    else if(action==='inicio')location.hash='inicio';
    else {
      const section=document.getElementById(current),collapsed=section.dataset.plegada!=='true';
      section.dataset.plegada=String(collapsed);
      // slideToggle se limita a los bloques de contenido, nunca al documento.
      $(section).find('.container > :not(.titulo-seccion):not(.hamb):not(.hamb-panel)').stop(true,true).slideToggle(duration(160));
      this.querySelector('span').textContent=collapsed?'Mostrar contenido':'Ocultar contenido';
    }closeMenus();
  });
  body.on('click.navegacion','#app-mas-abrir',function(){
    if(!panel.hidden)return;closeMenus();panel.hidden=false;backdrop.hidden=false;$(panel).stop(true,true).hide().fadeIn(duration(150));more.setAttribute('aria-expanded','true');
    inert=[...document.body.children].filter(el=>el!==panel&&el!==backdrop&&!el.inert&&!['SCRIPT','STYLE','LINK'].includes(el.tagName));inert.forEach(el=>el.inert=true);panel.querySelector('button:not([hidden])').focus();
  });
  body.on('click.navegacion','#app-mas-cerrar,.mas-fondo',()=>closeMore());
  body.on('click.navegacion',function(e){if(!e.target.closest('.hamb,.hamb-panel'))closeMenus();});
  body.on('keydown.navegacion',function(e){
    if(e.key==='Escape'){closeMore();const active=document.activeElement.closest?.('.hamb-panel');closeMenus();if(active)active.previousElementSibling.focus();}
    if(e.key==='Tab'&&!panel.hidden){const controls=[...panel.querySelectorAll('button:not([hidden]),[tabindex="-1"]:focus:not([hidden])')],first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  $(window).off('hashchange.navegacion').on('hashchange.navegacion',()=>visit(location.hash.slice(1),true));
  visit(location.hash.slice(1)||'inicio');
  return {current:()=>current,destroy(){body.off('.navegacion');$(window).off('.navegacion');}};
}
