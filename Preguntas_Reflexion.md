# Preguntas de Reflexión - Taller "mundos-ia"

### 1. ¿Por qué el id se calcula sin la fecha? ¿Qué pasaría si la incluyeras?
Porque el hash debe ser determinista e idempotente: los mismos parámetros (situación, mundo y colores) siempre deben generar el mismo id para reutilizar los archivos ya creados en caché. Si incluyéramos la fecha, como cada milisegundo cambia, el id siempre sería diferente y volvería a llamar a las APIs innecesariamente en cada ejecución.

---

### 2. ¿Por qué se le pide al modelo de texto la descripción en inglés? Si puedes, prueba con una en español y compara las imágenes.
Porque los modelos de difusión de imágenes (como FLUX y Stable Diffusion) fueron entrenados mayoritariamente con datasets y textos en inglés (como LAION). Al recibir el prompt en inglés entienden con mayor precisión conceptos abstractos, iluminación y estilos, mientras que en español suelen malinterpretar palabras clave o perder coherencia en la escena.

---

### 3. ¿Qué diferencia hay entre una respuesta JSON de texto y una respuesta con los bytes de una imagen? ¿Qué es base64?
El JSON viaja como texto estructurado legible (caracteres Unicode), mientras que una imagen son datos binarios puros (bytes sin formato de texto). Base64 es un método de codificación que convierte esos bytes binarios en una cadena de caracteres alfanuméricos seguros para viajar dentro de un JSON a través de HTTP sin corromperse.

---

### 4. ¿Qué pasaría si guardas la imagen con 'utf-8'? ¿Por qué?
El archivo de la imagen se corrompería y no podría abrirse. La codificación `utf-8` intenta interpretar secuencias binarias arbitrarias como caracteres de texto válidos, modificando o reemplazando bytes que no coinciden con la tabla Unicode, lo que destruye la cabecera y la estructura interna del archivo JPG.

---

### 5. ¿Qué pasos consumen cuota gratuita y cómo evitaste repetirlos?
Consumen cuota las llamadas HTTP a la API de NVIDIA: la generación de la descripción (`chat/completions`) y la generación de la imagen (`flux.1-schnell`). Se evitaron usando la función nativa `fs.existsSync`: si el archivo `descripciones/mundo_<id>.txt` o `imagenes/mundo_<id>.jpg` ya existe en el disco, se lee o se omite la llamada a la API.

---

### 6. Si usaste IA: ¿qué fue lo más difícil de pedirle y qué parte tuviste que corregir tú?
Lo más difícil fue que generara un prompt visual conciso y adaptado a las limitaciones de tiempo del modelo de imágenes, ya que inicialmente producía textos demasiado largos que causaban error 504 (timeout en NVIDIA). Tuve que corregir la longitud del prompt a un formato corto (máximo 50 palabras), arreglar las rutas de importación de los archivos y limpiar las variables del archivo `.env`.

