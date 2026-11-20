import {hidratarControles} from './hidratacion.js';
import {prepararSanitizacion, textoSeguro} from './sanitizacion.js';
import {tienePalabrasInapropiadas} from './moderacion.js';
import {$,write,read,message} from './utilidades.js';
// Hidratación del formulario y validación por pasos, antes de guardar.
// HTML: #form-opinion se enlaza al abrir Opinión. Cada id identifica un campo.
export async function mount(){
  await prepararSanitizacion();
  const form=document.getElementById('form-opinion'),button=document.getElementById('btn-enviar');
  const names=['nombre1','nombre2','apPaterno','apMaterno'];
  const ids=[...names,'correo','fecha','comentario','calificacion'];
  const hints=['Llene su primer nombre','Ahora llene su segundo nombre','Ahora llene su apellido paterno','Ahora llene su apellido materno','Ahora escriba su correo electrónico','Ahora elija su fecha de nacimiento','Cuéntenos qué parte le gustó de la página','Por último, califique la página'];
  const touched=new Set();
  const validacionesDeTexto=new Map();
  const field=id=>document.getElementById(id);
  const today=new Date();field('fecha').max=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  // Valida el formato del campo y bloquea palabras o etiquetas antes de guardar.
  function error(id){
    const value=field(id).value.trim();
    // Se modera el texto libre y se evita guardar etiquetas en campos de opinión.
    if (id==='comentario' || names.includes(id)) {
      let validacion = validacionesDeTexto.get(id);
      if (validacion?.valor !== value) {
        const limpio = textoSeguro(value);
        const error = tienePalabrasInapropiadas(limpio)
          ? 'Evita palabras inapropiadas en este campo'
          : /[<>]/.test(value) || limpio !== value
            ? 'Escribe el texto sin etiquetas HTML'
            : '';
        validacion = {valor:value,error};
        validacionesDeTexto.set(id,validacion);
      }
      if (validacion.error) return validacion.error;
    }
    if(names.includes(id))return value.length<2?'Mínimo 2 letras':!/^\p{L}+(?:[ '\u2019-]\p{L}+)*$/u.test(value)?'Solo letras, sin números ni símbolos':'';
    if(id==='correo')return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(value)?'':'Correo no válido (ej: nombre@correo.com)';
    if(id==='comentario')return value.length<10?'Escriba al menos 10 caracteres':value.length>300?'Máximo 300 caracteres':'';
    if(id==='calificacion')return /^[1-5]$/.test(value)?'':'Elija de 1 a 5 estrellas';
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return 'Elija una fecha';
    const [y,m,d]=value.split('-').map(Number),date=new Date(y,m-1,d),now=new Date();
    if(date.getFullYear()!==y||date.getMonth()!==m-1||date.getDate()!==d)return 'Esa fecha no existe';
    if(date>now)return 'La fecha no puede ser futura';
    let age=now.getFullYear()-y;if(now<new Date(now.getFullYear(),m-1,d))age--;
    if(age<5||age>120)return 'La edad debe estar entre 5 y 120 años';
    return '';
  }
  // Activa un campo por vez y comunica su validación a los lectores de pantalla.
  function update(){
    const errors=ids.map(error),first=errors.findIndex(Boolean),valid=errors.filter(x=>!x).length;
    ids.forEach((id,i)=>{
      const box=document.getElementById('g-'+id),input=field(id),notice=box.querySelector('.aviso');
      const blocked=first!==-1&&i>first,active=i===first;
      box.classList.toggle('bloqueado',blocked);box.classList.toggle('completo',!errors[i]);input.disabled=blocked;
      input.setAttribute('aria-invalid',String(active&&touched.has(id)&&!!errors[i]));
      notice.id='aviso-'+id;input.setAttribute('aria-describedby',notice.id);
      if(active){notice.textContent=touched.has(id)?errors[i]:hints[i];notice.className='aviso visible '+(touched.has(id)?'error':'info');$(notice).show();}else{$(notice).hide();notice.className='aviso';}
    });
    document.querySelectorAll('#estrellas button').forEach(b=>{b.disabled=field('calificacion').disabled;b.setAttribute('aria-pressed',String(Number(b.dataset.v)===Number(field('calificacion').value)));b.setAttribute('aria-label',b.dataset.v+' de 5 estrellas');});
    field('progreso-form').style.width=valid/ids.length*100+'%';button.disabled=first!==-1;
    const ageText=field('edad-calculada');
    if(!error('fecha')){const [y,m,d]=field('fecha').value.split('-').map(Number),now=new Date();let age=now.getFullYear()-y;if(now<new Date(now.getFullYear(),m-1,d))age--;ageText.textContent=`Tienes ${age} años`;}else ageText.textContent='';
  }
  // HTML: el aviso global #opinion-exito permanece por encima de la vista activa.
  // Confirmamos solo después de guardar y damos tiempo para leer antes de volver.
  let regreso, ocultacion;
  function limpiarConfirmacion() {
    clearTimeout(regreso);
    clearTimeout(ocultacion);
    field('opinion-exito').hidden = true;
    field('opinion-exito-texto').textContent = '';
  }
  function mostrarConfirmacion() {
    limpiarConfirmacion();
    field('opinion-exito').hidden = false;
    field('opinion-exito-texto').textContent = 'Tu opinión se registró con éxito';
    regreso = setTimeout(() => {
      // Si la persona ya abrió otra sección, respetamos su selección.
      if (document.body.dataset.appVista === 'opinion') location.hash = 'inicio';
    }, 1600);
    ocultacion = setTimeout(limpiarConfirmacion, 3800);
  }
  window.addEventListener('pagehide', limpiarConfirmacion);

  // HTML: #estrellas envía el valor data-v. El submit viene de #form-opinion.
  const area=hidratarControles(form,'opinion');
  area.on('input.opinion change.opinion','input, textarea',function(){touched.add(this.id);update();});
  area.on('click.opinion','#estrellas button',function(){field('calificacion').value=this.dataset.v;touched.add('calificacion');document.querySelectorAll('#estrellas button').forEach(b=>b.classList.toggle('on',Number(b.dataset.v)<=Number(this.dataset.v)));update();});
  // Comprueba todo nuevamente antes de persistir el comentario y la nota.
  area.on('submit.opinion',function(e){
    e.preventDefault();ids.forEach(id=>touched.add(id));update();
    const invalid=ids.find(id=>error(id));if(invalid){field(invalid).focus();return;}
    // Se guarda una opinión local, no se simula un envío a un servidor.
    const opinions=read('opiniones-v1',[]);
    const ok=write('opiniones-v1',[...(Array.isArray(opinions)?opinions:[]).slice(-49),{comentario:textoSeguro(field('comentario').value.trim()),calificacion:Number(field('calificacion').value),fecha:new Date().toISOString()}]);
    if(!ok){message('No pudimos guardar tu opinión. Revisa el almacenamiento del navegador e inténtalo de nuevo.');return;}
    mostrarConfirmacion();
    form.reset();field('calificacion').value='0';touched.clear();validacionesDeTexto.clear();document.querySelectorAll('#estrellas button').forEach(b=>b.classList.remove('on'));update();
  });
  field('calificacion').value='0';update();
  return {destroy(){area.off('.opinion');limpiarConfirmacion();window.removeEventListener('pagehide',limpiarConfirmacion);}};
}
