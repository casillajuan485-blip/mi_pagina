import {prepararSanitizacion, textoSeguro} from './sanitizacion.js';
import {read, write, message} from './utilidades.js';
const pending = new Map();
const controllers = new Set();
// Verifica los campos esperados y sanitiza los textos antes de preparar tarjetas.
export function validate(name, data) {
  const keys = name === 'canciones' ? ['titulo','artista','cat','sub','id'] : name === 'juegos' ? ['nombre','img','cat','sub','desc'] : ['titulo','insignia','icono','img','desc'];
  if (!Array.isArray(data) || !data.length || data.length > 500 || data.some(row => !row || keys.some(k => typeof row[k] !== 'string' || row[k].length > 5000) || (name === 'juegos' && (!Number.isInteger(row.nivel) || row.nivel < 1 || row.nivel > 5 || !Number.isInteger(row.desde))) || (name === 'canciones' && !/^[-\w]{0,20}$/.test(row.id)) || (row.icono && !/^bi-[a-z0-9-]+$/.test(row.icono)))) throw new Error('JSON no válido');
  // Copiamos solo campos esperados. Las vistas insertan el resultado como texto.
  return data.map(row => Object.fromEntries([...keys, ...(name === 'juegos' ? ['nivel','desde'] : [])].map(key => [key, typeof row[key] === 'string' && !['img','id','icono'].includes(key) ? textoSeguro(row[key]) : row[key]])));
}
// Fetch lee data/<sección>.json. Si falla, usa la copia en localStorage o el módulo de respaldo.
export function loadData(name) {
  if (!pending.has(name)) pending.set(name, (async () => {
    const controller = new AbortController(); controllers.add(controller);
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`data/${name}.json`, {signal: controller.signal});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await prepararSanitizacion();
      const data = validate(name, await response.json()); write(`catalogo-v2-${name}`,data); return data;
    } catch {
      await prepararSanitizacion();
      const saved = read(`catalogo-v2-${name}`, null);
      if (saved) { try { return validate(name,saved); } catch { /* respaldo del paquete */ } }
      message('No pudimos actualizar este catálogo. Mostramos una copia de respaldo.');
      const {default: backup} = await import('./respaldo.js'); return validate(name,backup[name]);
    } finally { clearTimeout(timer); controllers.delete(controller); }
  })().catch(error => { pending.delete(name); throw error; }));
  return pending.get(name);
}
export function cancelLoads() { controllers.forEach(c => c.abort()); }
