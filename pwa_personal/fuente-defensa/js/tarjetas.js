import {hidratarControles} from './hidratacion.js';
import {readList,write,favorite,safeImage,empty} from './utilidades.js';
import {loadData} from './catalogos-json.js';
import {filters,filtered} from './filtros.js';
const accents=['var(--rosa)','var(--amarillo)','var(--violeta)','var(--celeste)'];
const levels=['Principiante','Básico','Intermedio','Avanzado','Experto'];
// HTML: #grid-juegos, #grid-intereses y #grid-pasatiempos reciben las tarjetas del JSON.
export async function mount(section) {
  const data=await loadData(section), games=section==='juegos';
  const root=document.getElementById('grid-'+section);
  const favorites=new Set(readList('favJuegos'));
  let current={soloFavs:false}, signature='';
  const objects=new WeakMap();
  // Filtra, evita reconstrucciones repetidas y añade nodos en un fragmento.
  function render(state) {
    current=state;
    const list=games?filtered(data,state,favorites,'nombre'):data;
    const next=JSON.stringify(list.map(x=>x.nombre||x.titulo));
    if(next===signature)return; signature=next;
    if(!list.length){empty(root,'No hay tarjetas con ese filtro.');return;}
    const fragment=document.createDocumentFragment();
    list.forEach((item,index)=>{
      const column=document.createElement('div'); column.className='col-12 col-sm-6 col-lg-4';
      column.style.setProperty('--acento',accents[index%accents.length]);
      column.innerHTML='<div class="tarjeta-giro" tabindex="0" role="button" aria-expanded="false"><div class="tarjeta-giro__interior"><div class="tarjeta-giro__cara tarjeta-giro__frente"><img loading="lazy" decoding="async" width="400" height="310" alt=""><span class="tarjeta-giro__insignia"></span><h5></h5><small><i class="bi bi-arrow-repeat" aria-hidden="true"></i> Toca para ver más</small></div><div class="tarjeta-giro__cara tarjeta-giro__dorso"><h5></h5><p></p><div class="extra"></div></div></div></div>';
      const tarjeta=column.querySelector('.tarjeta-giro'), title=item.nombre||item.titulo;
      tarjeta.setAttribute('aria-label','Ver detalles: '+title);
      const img=column.querySelector('img'); img.src=safeImage(item.img);img.alt=title;
      column.querySelector('.tarjeta-giro__insignia').textContent=item.cat||item.insignia;
      column.querySelectorAll('h5').forEach(h=>h.textContent=title);
      column.querySelector('.tarjeta-giro__dorso p').textContent=item.desc;
      column.querySelector('.tarjeta-giro__dorso').setAttribute('aria-hidden','true');
      if(games){
        const extra=column.querySelector('.extra');
        extra.innerHTML='<div class="dato"><span></span><b></b></div><div class="nivel-barra"><i></i></div><div class="dato n-anio"></div><span class="sub"></span>';
        extra.querySelector('span').textContent='Nivel: ';extra.querySelector('b').textContent=`${levels[item.nivel-1]} (${item.nivel}/5)`;
        extra.querySelector('.nivel-barra i').style.width=item.nivel/5*100+'%';
        extra.querySelector('.n-anio').textContent=`Lo conocí en ${item.desde} · ${Math.max(0,new Date().getFullYear()-item.desde)} años jugando`;
        extra.querySelector('.sub').textContent='Subcategoría: '+item.sub;
        const b=document.createElement('button');b.type='button';b.className='favorito__boton';b.setAttribute('aria-label','Favorito: '+title);b.innerHTML='<i class="bi bi-heart"></i>';favorite(b,favorites.has(title));tarjeta.append(b);
      }else{
        const icon=document.createElement('span');icon.className='icono-flip';const i=document.createElement('i');i.className='bi '+item.icono;icon.append(i);column.querySelector('.tarjeta-giro__frente').append(icon);
      }
      objects.set(tarjeta,item);fragment.append(column);
    });
    root.replaceChildren(fragment);
  }
  // Voltea la tarjeta con clic o teclado y sincroniza sus estados accesibles.
  function turn(tarjeta){const expanded=tarjeta.classList.toggle('tarjeta-giro--volteada');tarjeta.setAttribute('aria-expanded',String(expanded));tarjeta.querySelector('.tarjeta-giro__dorso').setAttribute('aria-hidden',String(!expanded));tarjeta.querySelector('.tarjeta-giro__frente').setAttribute('aria-hidden',String(expanded));}
  // Los clics del corazón y el giro se delegan desde la rejilla. El corazón detiene la propagación.
  const area=hidratarControles(root,'tarjetas');
  area.on('click.tarjetas','.favorito__boton',function(e){e.stopPropagation();const tarjeta=this.closest('.tarjeta-giro'),item=objects.get(tarjeta),key=item.nombre;favorites.has(key)?favorites.delete(key):favorites.add(key);write('favJuegos',[...favorites]);favorite(this,favorites.has(key));if(current.soloFavs&&!favorites.has(key)){tarjeta.parentElement.remove();signature='';if(!root.children.length)empty(root,'No hay tarjetas con ese filtro.');}});
  area.on('click.tarjetas','.tarjeta-giro',function(e){if(!e.target.closest('.favorito__boton'))turn(this);});
  area.on('keydown.tarjetas','.tarjeta-giro',function(e){if(e.target===this&&['Enter',' '].includes(e.key)){e.preventDefault();turn(this);}});
  const control=games?filters(document.getElementById('filtros-juegos'),data,render):null;
  if(!games)render(current);
  return {suspend(){control?.suspend();},destroy(){area.off('.tarjetas');control?.destroy();}};
}
