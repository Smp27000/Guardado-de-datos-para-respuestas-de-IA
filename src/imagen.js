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

  // paso 6: Realizamos la petición POST al endpoint de FLUX en NVIDIA
  try {
    const respuesta = await fetch('https://integrate.api.nvidia.com/v1/genai/black-forest-labs/flux-1-schnell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        prompt: descripcion
      })
    });

    // paso 7: Parseamos la respuesta a JSON
    const datos = await respuesta.json();

    // paso 8: Extraemos la imagen que viene codificada en base64
    const base64Data = datos.artifacts[0].base64;

    // paso 9: Convertimos el base64 a un buffer binario y lo guardamos como .jpg
    const bufferImagen = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(rutaArchivo, bufferImagen);

    console.log(`[Imagen] Imagen guardada en: imagenes/mundo_${id}.jpg`);
    return rutaArchivo;
  } catch (error) {
    // paso 10: Capturamos y mostramos posibles errores
    console.log('Error al generar la imagen:', error.message);
    process.exit(1);
  }
}

// paso 11: Exportamos la función
module.exports = { generarImagen };