// paso 1: Cargamos las variables de entorno desde el archivo .env de forma nativa
process.loadEnvFile();

// paso 2: Importamos las funciones de cada módulo
const { guardarMundo } = require('./mundo');
const { generarDescripcion } = require('./texto');
const { generarImagen } = require('./imagen');

// paso 3: Función principal autoejecutable que coordina todo el programa
async function main() {
  try {
    // paso 4: Obtenemos los argumentos enviados por consola ignorando node y la ruta del script
    const argumentos = process.argv.slice(2);

    console.log('=== INICIANDO MUNDOS-IA ===');

    // paso 5: Guardamos los datos en el JSON y obtenemos el objeto del mundo
    const datosMundo = guardarMundo(argumentos);

    // paso 6: Generamos u obtenemos la descripción textual con la IA
    const descripcion = await generarDescripcion(datosMundo);

    // paso 7: Generamos u obtenemos la imagen correspondiente
    await generarImagen(datosMundo.id, descripcion);

    console.log('=== PROCESO COMPLETADO CON ÉXITO ===');
  } catch (error) {
    // paso 8: Capturamos cualquier error general durante la ejecución
    console.log('Ocurrió un error en el flujo principal:', error.message);
  }
}

// paso 9: Ejecutamos el flujo principal
main();