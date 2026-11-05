// paso 1: Importamos los módulos nativos fs y path
const fs = require('fs');
const path = require('path');

// paso 2: Función asíncrona para generar y guardar la imagen
async function generarImagen(id, descripcion) {
  // paso 3: Configuramos la carpeta 'imagenes' y la ruta del archivo destino
  const carpetaImagenes = path.join(__dirname, '..', 'imagenes');
  const rutaArchivo = path.join(carpetaImagenes, `mundo_${id}.jpg`);

  // paso 4: Creamos la carpeta 'imagenes' si aún no existe
  if (!fs.existsSync(carpetaImagenes)) {
    fs.mkdirSync(carpetaImagenes);
  }

  // paso 5: Si la imagen ya existe, evitamos llamar a la API
  if (fs.existsSync(rutaArchivo)) {
    console.log(`[Imagen] La imagen imagenes/mundo_${id}.jpg ya existe. Omitiendo llamada a la API...`);
    return rutaArchivo;
  }

  // paso 6: Realizamos la petición GET al servicio gratuito de Pollinations.ai
  console.log('[Imagen] Generando imagen con Pollinations.ai...');
  try {
    // Tomamos los primeros 250 caracteres para un prompt ágil y conciso
    const promptCorto = descripcion.replace(/\n+/g, ' ').slice(0, 250);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptCorto)}?width=1024&height=1024&nologo=true`;
    const respuesta = await fetch(url);

    // paso 7: Validamos que la respuesta HTTP sea correcta
    if (!respuesta.ok) {
      throw new Error(`Error en la API de imágenes (${respuesta.status}): ${respuesta.statusText}`);
    }

    // paso 8: Obtenemos los bytes de la imagen directamente como ArrayBuffer
    const arrayBuffer = await respuesta.arrayBuffer();

    // paso 9: Convertimos el ArrayBuffer a Buffer binario de Node.js y guardamos el .jpg
    const bufferImagen = Buffer.from(arrayBuffer);
    fs.writeFileSync(rutaArchivo, bufferImagen);

    console.log(`[Imagen] Imagen guardada en: imagenes/mundo_${id}.jpg`);
    return rutaArchivo;
  } catch (error) {
    // paso 10: Capturamos cualquier error en la descarga
    console.log('Error al generar la imagen:', error.message);
    throw error;
  }
}

// paso 11: Exportamos la función
module.exports = { generarImagen };
