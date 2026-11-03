// paso 1: Importamos los módulos nativos fs y path
const fs = require('fs');
const path = require('path');

// paso 2: Función asíncrona para generar y guardar la imagen
async function generarImagen(id, descripcion, reintentos = 3) {
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

  // paso 6: Realizamos la petición a la API con control de reintentos
  console.log(`[Imagen] Solicitando imagen a NVIDIA FLUX (intentos restantes: ${reintentos})...`);

  try {
    const respuesta = await fetch('https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell', {
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

    // paso 7: Si hay error 504 (timeout del servidor) y quedan intentos, esperamos y reintentamos
    if (respuesta.status === 504 && reintentos > 1) {
      console.log('[Imagen] Servidor de NVIDIA saturado (504). Reintentando en 5 segundos...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await generarImagen(id, descripcion, reintentos - 1);
    }

    // paso 8: Validamos si la respuesta final fue exitosa
    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      throw new Error(`Error en la API de NVIDIA (${respuesta.status}): ${errorTexto}`);
    }

    // paso 9: Parseamos el JSON y extraemos la imagen en base64
    const datos = await respuesta.json();
    const base64Data = datos.artifacts[0].base64;

    // paso 10: Convertimos el base64 a archivo binario .jpg
    const bufferImagen = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(rutaArchivo, bufferImagen);

    console.log(`[Imagen] Imagen guardada en: imagenes/mundo_${id}.jpg`);
    return rutaArchivo;
  } catch (error) {
    // paso 11: Mostramos el mensaje y propagamos el error
    console.log('Error en generarImagen:', error.message);
    throw error;
  }
}

// paso 12: Exportamos la función
module.exports = { generarImagen };