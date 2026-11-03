## ¿Use IA?

si, use angravity y gemini 3.8 flash low para generar el codigo

## Prompt usado con Antigraty (Gemini 3.8 Flash Low)

Actúa como un instructor de Node.js para principiantes del SENA.
Quiero construir un programa de consola llamado "mundos-ia".

CONTEXTO: solo conozco estos temas: process.argv, módulos con require,
el módulo nativo fs (writeFileSync, readFileSync, existsSync, mkdirSync),
path, npm (init, install, scripts), el paquete object-hash, variables de
entorno con .env y process.loadEnvFile, async/await con try/catch y el fetch
nativo de Node.

OBJETIVO:
1. Recibir por parámetros una situación, un mundo y 5 colores, y guardarlos
   en un objeto JSON en data/mundo_<id>.json.
   Ejemplo de ejecución:
   npm start -- "Una tormenta eléctrica amenaza la ciudad flotante" "Aerópolis, un archipiélago de islas que flotan sobre las nubes" rojo azul verde dorado violeta
   El JSON debe quedar así (el id se genera con object-hash, tomando los
   primeros 8 caracteres del hash de situación, mundo y colores):
   {
     "id": "3f9a1c2e",
     "situacion": "Una tormenta eléctrica amenaza la ciudad flotante",
     "mundo": "Aerópolis, un archipiélago de islas que flotan sobre las nubes",
     "colores": ["rojo", "azul", "verde", "dorado", "violeta"],
     "creadoEn": "2026-10-27T15:30:00.000Z"
   }
2. Leer ese JSON y enviarlo con fetch a la API de un modelo de lenguaje para
   que escriba la descripción de una imagen del mundo imaginario. Guardarla
   en descripciones/mundo_<id>.txt.
3. Enviar esa descripción con fetch a la API de un modelo de imágenes y
   guardar la imagen en imagenes/mundo_<id>.jpg.

RESTRICCIONES:
- No uses dotenv, axios, SDK de proveedores, readline, commander ni frameworks.
- Código simple, con comentarios en español numerados ("paso 1", "paso 2"...).
- Las API keys se leen del archivo .env (con process.loadEnvFile) y nunca
  se escriben en el código.
- Si el .txt o la imagen ya existen, no vuelvas a llamar a las APIs.
- Divide el código en src/index.js, src/mundo.js, src/texto.js y src/imagen.js.

SERVICIOS:
- Texto: NVIDIA, modelo openai/gpt-oss-20b (gratuito).
- Imagen: NVIDIA, modelo FLUX.1-schnell (gratuito).
- Ambos usan la misma API key de NVIDIA, guardada en .env como
  NVIDIA_API_KEY.
(Pega aquí la ficha del servicio de la guía del taller: URL del endpoint,
formato del body y forma de leer la respuesta.)

FORMA DE RESPONDER: dame un archivo a la vez, explica cada bloque en 2 líneas
y no uses nada que no esté en el CONTEXTO.