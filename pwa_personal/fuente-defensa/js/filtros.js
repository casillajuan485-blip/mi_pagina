import {hidratarControles} from './hidratacion.js';
import {debounce, normalize} from './utilidades.js';
// HTML: el contenedor .filtros recibe el buscador, categorías, orden y botón de favoritos.
export function filters(root, data, render) {
  const state = {cat:'Todas', sub:'Todas', soloFavs:false, search:''};
  root.innerHTML = '<div class="filtro-fila"><label class="buscador"><i class="bi bi-search" aria-hidden="true"></i><input type="search" inputmode="search" placeholder="Buscar…" aria-label="Buscar en este catálogo" maxlength="100"></label><button type="button" class="btn-favs" aria-pressed="false"><i class="bi bi-heart"></i> Solo favoritos</button></div><div class="chips" data-nivel="cat"></div><div class="chips chips-sub" data-nivel="sub"></div><label class="orden-filtro">Ordenar <select aria-label="Ordenar catálogo"><option value="original">Orden original</option><option value="az">A–Z</option></select></label>';
  // Crea botones de categorías con data-filter-value para el evento delegado.
  function chips(level, values, selected) {
    const fragment=document.createDocumentFragment();
    values.forEach(value => { const button=document.createElement('button'); button.type='button'; button.className='chip'+(value===selected?' activo':''); button.dataset.filterValue=value; button.setAttribute('aria-pressed',String(value===selected)); button.textContent=value; fragment.append(button); });
    root.querySelector(`[data-nivel="${level}"]`).replaceChildren(fragment);
  }
  function refresh() {
    chips('cat',['Todas',...new Set(data.map(x=>x.cat))],state.cat);
    chips('sub',state.cat==='Todas'?[]:['Todas',...new Set(data.filter(x=>x.cat===state.cat).map(x=>x.sub))],state.sub);
    render(state);
  }
  // El buscador espera 250 ms antes de volver a filtrar.
  const search = debounce(value => { state.search=normalize(value); render(state); });
  // Un espacio de nombres propio evita duplicaciones sin borrar eventos ajenos.
  const area=hidratarControles(root,'filtros');
  area.on('click.filtros','button[data-filter-value]',function () { const level=this.closest('[data-nivel]').dataset.nivel; state[level]=this.dataset.filterValue; if(level==='cat') state.sub='Todas'; refresh(); });
  area.on('click.filtros','.btn-favs',function () { state.soloFavs=!state.soloFavs; this.classList.toggle('activo',state.soloFavs); this.setAttribute('aria-pressed',String(state.soloFavs)); this.querySelector('i').className=state.soloFavs?'bi bi-heart-fill':'bi bi-heart'; render(state); });
  area.on('input.filtros','input[type="search"]',function(){search(this.value);});
  area.on('change.filtros','select',function(){state.order=this.value; render(state);});
  refresh();
  return {state, suspend(){search.cancel();}, destroy(){search.cancel();area.off('.filtros');}};
}
// Aplica categoría, subcategoría, favoritos, búsqueda y orden de la lista.
export function filtered(data,state,favorites,key) {
  const list=data.filter(x=>(state.cat==='Todas'||x.cat===state.cat)&&(state.sub==='Todas'||x.sub===state.sub)&&(!state.soloFavs||favorites.has(x[key]))&&(!state.search||normalize(Object.values(x).filter(v=>typeof v==='string').join(' ')).includes(state.search)));
  return state.order==='az'?list.sort((a,b)=>a[key].localeCompare(b[key],'es')):list;
}
