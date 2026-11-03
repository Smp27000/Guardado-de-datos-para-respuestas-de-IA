// paso 1: Importamos los módulos nativos fs, path y la librería object-hash
const fs = require('fs');
const path = require('path');
const hash = require('object-hash');

// paso 2: Función principal para procesar los argumentos y crear el JSON
function guardarMundo(argumentos) {
  // paso 3: Extraemos situación, mundo y los 5 colores desde los argumentos
  const situacion = argumentos[0];
  const mundo = argumentos[1];
  const colores = argumentos.slice(2, 7);

  // paso 4: Validamos que los parámetros requeridos estén completos
  if (!situacion || !mundo || colores.length < 5) {
    console.log('Error: Debes ingresar situación, mundo y exactamente 5 colores.');
    process.exit(1);
  }

  // paso 5: Generamos el hash y tomamos solo los primeros 8 caracteres
  const id = hash({ situacion, mundo, colores }).substring(0, 8);

  // paso 6: Construimos el objeto del mundo con la fecha actual
  const datosMundo = {
    id: id,
    situacion: situacion,
    mundo: mundo,
    colores: colores,
    creadoEn: new Date().toISOString()
  };

  // paso 7: Verificamos si existe la carpeta 'data', si no, la creamos
  const carpetaData = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData);
  }

  // paso 8: Guardamos el archivo JSON formateado con sangría de 2 espacios
  const rutaArchivo = path.join(carpetaData, `mundo_${id}.json`);
  fs.writeFileSync(rutaArchivo, JSON.stringify(datosMundo, null, 2));

  console.log(`[Mundo] Guardado correctamente en: data/mundo_${id}.json`);
  return datosMundo;
}

// paso 9: Exportamos la función para usarla en index.js
module.exports = { guardarMundo };