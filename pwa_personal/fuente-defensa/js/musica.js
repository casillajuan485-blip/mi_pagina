import {hidratarControles} from './hidratacion.js';
import {readList,write,favorite,empty,safeImage} from './utilidades.js';
import {loadData} from './catalogos-json.js';
import {filters,filtered} from './filtros.js';
// HTML: #lista-musica recibe canciones y #filtros-musica recibe el buscador.
export async function mount(){
  const data=await loadData('canciones'),root=document.getElementById('lista-musica');
  const favorites=new Set(readList('favMusica'));
  let selected=data[0].titulo,state,signature='';
  const items=new Map(data.map(x=>[x.titulo,x]));
  // Actualiza solo la canción seleccionada y deja el texto completo en el detalle.
  function select(item){
    const previous=root.querySelector('.cancion.activa');previous?.classList.remove('activa');
    selected=item.titulo;
    document.getElementById('titulo-cancion').textContent=item.titulo;
    document.getElementById('artista-cancion').textContent=item.artista;
    const image=document.getElementById('portada-video');delete image.dataset.respaldo;
    image.src=item.id?safeImage(`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`):'img/respaldo.svg';
    document.getElementById('escuchar-youtube').href=item.id?'https://www.youtube.com/watch?v='+encodeURIComponent(item.id):'https://www.youtube.com/results?search_query='+encodeURIComponent(item.titulo+' '+item.artista);
    [...root.children].find(el=>el.dataset.cancion===selected)?.classList.add('activa');
    document.querySelector('.pista-play').textContent=navigator.onLine?'Toca el play para escucharla en YouTube':'La lista está disponible sin conexión. YouTube necesita Internet.';
  }
  // Construye los resultados del catálogo y conserva los favoritos locales.
  function render(next){
    state=next;const list=filtered(data,state,favorites,'titulo');const key=JSON.stringify(list.map(x=>x.titulo));
    if(signature===key)return;signature=key;
    if(!list.length){empty(root,'No hay canciones con ese filtro.');return;}
    const fragment=document.createDocumentFragment();
    list.forEach((item,index)=>{
      const row=document.createElement('div');row.className='cancion'+(item.titulo===selected?' activa':'');row.setAttribute('role','button');row.tabIndex=0;row.dataset.cancion=item.titulo;
      row.innerHTML='<span class="numero-cancion"></span><span class="pista__datos"><strong></strong><small></small><em class="etiqueta-cat"></em></span><button type="button" class="favorito__boton"><i class="bi bi-heart"></i></button>';
      row.querySelector('.numero-cancion').textContent=String(index+1).padStart(2,'0');
      row.querySelector('strong').textContent=item.titulo;row.querySelector('small').textContent=item.artista;row.querySelector('em').textContent=item.cat+' · '+item.sub;
      const button=row.querySelector('button');button.setAttribute('aria-label','Favorito: '+item.titulo);favorite(button,favorites.has(item.titulo));fragment.append(row);
    });root.replaceChildren(fragment);
  }
  // La lista escucha clics y teclas de todas las canciones, incluidas las añadidas tras filtrar.
  const area=hidratarControles(root,'musica');
  area.on('click.musica','.favorito__boton',function(e){e.stopPropagation();const row=this.closest('.cancion'),key=row.dataset.cancion;favorites.has(key)?favorites.delete(key):favorites.add(key);write('favMusica',[...favorites]);favorite(this,favorites.has(key));if(state.soloFavs&&!favorites.has(key)){row.remove();signature='';root.querySelectorAll('.numero-cancion').forEach((n,i)=>n.textContent=String(i+1).padStart(2,'0'));if(!root.children.length)empty(root,'No hay canciones con ese filtro.');}});
  area.on('click.musica','.cancion',function(e){if(!e.target.closest('.favorito__boton'))select(items.get(this.dataset.cancion));});
  area.on('keydown.musica','.cancion',function(e){if(e.target===this&&['Enter',' '].includes(e.key)){e.preventDefault();select(items.get(this.dataset.cancion));}});
  const control=filters(document.getElementById('filtros-musica'),data,render);select(data[0]);
  return {suspend(){control.suspend();},destroy(){control.destroy();area.off('.musica');}};
}
