// paso 1: Importamos fs y path para manejar archivos y rutas
const fs = require('fs');
const path = require('path');

// paso 2: Función asíncrona para generar y guardar la descripción de texto
async function generarDescripcion(datosMundo) {
  // paso 3: Definimos la carpeta y ruta del archivo de descripción
  const carpetaDescripciones = path.join(__dirname, '..', 'descripciones');
  const rutaArchivo = path.join(carpetaDescripciones, `mundo_${datosMundo.id}.txt`);

  // paso 4: Si la carpeta 'descripciones' no existe, la creamos
  if (!fs.existsSync(carpetaDescripciones)) {
    fs.mkdirSync(carpetaDescripciones);
  }

  // paso 5: Si el archivo ya existe, lo leemos y evitamos llamar a la API
  if (fs.existsSync(rutaArchivo)) {
    console.log(`[Texto] El archivo descripciones/mundo_${datosMundo.id}.txt ya existe. Leyendo localmente...`);
    return fs.readFileSync(rutaArchivo, 'utf-8');
  }

  // paso 6: Preparamos el prompt que describe la escena con los colores
  const prompt = `Describe detalladamente en inglés una escena visual para generar una imagen. Mundo: ${datosMundo.mundo}. Situación: ${datosMundo.situacion}. Paleta de colores obligatoria: ${datosMundo.colores.join(', ')}.`;

  // paso 7: Hacemos la petición HTTP POST a la API de NVIDIA usando fetch
  try {
    const respuesta = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    // paso 8: Convertimos la respuesta a JSON y extraemos el texto generado
    const datos = await respuesta.json();
    const descripcion = datos.choices[0].message.content.trim();

    // paso 9: Guardamos el texto en el archivo .txt
    fs.writeFileSync(rutaArchivo, descripcion);
    console.log(`[Texto] Descripción guardada en: descripciones/mundo_${datosMundo.id}.txt`);

    return descripcion;
  } catch (error) {
    // paso 10: Capturamos cualquier error en la llamada
    console.log('Error al generar la descripción de texto:', error.message);
    process.exit(1);
  }
}

// paso 11: Exportamos la función
module.exports = { generarDescripcion };