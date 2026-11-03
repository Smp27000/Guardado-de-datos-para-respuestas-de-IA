# Registro de Uso de Inteligencia Artificial (PROMPT.md)

### A. Declaración
**Usé IA: sí**

---

### B. Herramienta y modelo
- **Herramienta:** Antigravity (Google DeepMind)
- **Modelo:** Gemini 3.8 Flash (Low)

---

### C. Prompt inicial completo (literal)

```text
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
```

---

### D. Prompts siguientes

#### 1. Segundo prompt: Solicitud del siguiente archivo tras completar `mundo.js`
- **Prompt:** `ya, lo tengo listo, sigamos`
- **Respuesta de la IA:** Entregó el código de `src/texto.js` con comentarios numerados paso a paso y la explicación de cada bloque en 2 líneas, implementando la llamada fetch con `openai/gpt-oss-20b` y validando si el archivo ya existía para evitar llamadas innecesarias.
- **Qué hice con la respuesta:** Creé el archivo correspondiente en el proyecto, revisando que no utilizara librerías externas y respetara el uso exclusivo del módulo `fs` nativo.

#### 2. Tercer prompt: Solución al error de aserción en Windows
- **Prompt:** `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76, dame una breve explicacion del fallo y como lo solucionas`
- **Respuesta de la IA:** Explicó que el fallo venía del motor de Node.js en Windows (libuv) al forzar un cierre abrupto con `process.exit(1)` en el bloque catch con conexiones HTTP pendientes, sumado a una discrepancia en la URL del modelo FLUX de NVIDIA. Reemplazó `process.exit(1)` por `throw error` y corrigió la URL del endpoint a `https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell`.
- **Qué hice con la respuesta:** Modifiqué `src/imagen.js` aplicando la estructura con `throw` y ajustando el endpoint oficial para imágenes.

#### 3. Cuarto prompt: Manejo de Gateway Timeout (Error 504) y revisión del `.env`
- **Prompt:** `sigue dando el error 504, no es un error que indique algo malo en el codigo, pero si quiero confirmar que esta todo en orden, pero solamente para asegurarme este es mi .env: gpt-oss-20b base_url = "https://integrate.api.nvidia.com/v1", NVIDIA_API_KEY= "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" api_key_img="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"`
- **Respuesta de la IA:** Explicó que el error 504 es una saturación del servidor remoto de NVIDIA ante peticiones muy extensas o cold-starts, sugirió limpiar el formato del archivo `.env` (eliminando texto suelto, comillas y comas para que `process.loadEnvFile()` lo lea bien) e implementó una lógica de reintentos con `setTimeout` dentro de `src/imagen.js`.
- **Qué hice con la respuesta:** Limpié el archivo `.env` dejando únicamente la clave unificada `NVIDIA_API_KEY`, ajusté el prompt para que el texto generado fuera más conciso y apliqué el reintento automático.

---

### E. Cambios realizados sobre lo entregado por la IA

1. **Corrección de nombres de archivo:** La IA inicialmente nombró o hizo referencia en las rutas a `text.js` en lugar del nombre solicitado en los requerimientos del taller (`src/texto.js`), por lo que renombré y corregí las importaciones correspondientes.
2. **Depuración del archivo `.env`:** El archivo `.env` contenía múltiples variables no estándar (`api_key_img`, `base_url`, saltos de línea con texto libre); lo simplifiqué a una sola variable unificada (`NVIDIA_API_KEY`) para cumplir la regla estricta de que ambos servicios compartieran la misma clave.
3. **Optimización del prompt para la descripción:** La IA originalmente configuró un prompt que generaba descripciones de más de 2.000 caracteres, lo cual saturaba el endpoint de generación de imagen y provocaba respuestas 504 (Timeout). Lo ajusté para solicitar una descripción de máximo 50 palabras enfocada en la paleta de colores.

---

### F. Línea de código que no entendía y su explicación

```javascript
const bufferImagen = Buffer.from(base64Data, 'base64');
```

**Explicación con mis palabras:**  
La API de NVIDIA no devuelve la imagen como un archivo descargable directamente, sino como una cadena de texto muy larga compuesta por letras y números (codificación en Base64). La función `Buffer.from(..., 'base64')` toma esa cadena de texto y la "reconstruye" convirtiéndola en los datos binarios originales (ceros y unos de la imagen), permitiendo que `fs.writeFileSync` pueda guardarla en el disco duro como un archivo `.jpg` real que se puede abrir y visualizar.

---

### G. Error presentado y cómo se resolvió

- **Mensaje de error:**  
  `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76`

- **Cómo se resolvió:**  
  Este error ocurrió en Windows porque dentro del bloque `catch` de `src/imagen.js` se estaba llamando a `process.exit(1)` para detener el programa inmediatamente mientras el cliente HTTP nativo (`fetch`) aún intentaba cerrar el socket de red en segundo plano. Esto ocasionó un choque en la librería interna de Node.js (`libuv`).  
  Se solucionó eliminando `process.exit(1)` del bloque `catch` y reemplazándolo por `throw error`, permitiendo que el flujo asíncrono se cierre ordenadamente a través de la función principal `main()` en `src/index.js`.
