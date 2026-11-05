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
Consumen cuota las llamadas HTTP a la API de NVIDIA para la generación de la descripción de texto (`chat/completions`) y el uso de recursos de red en el generador de imágenes (Pollinations.ai / FLUX). Se evitaron usando la función nativa `fs.existsSync`: si el archivo `descripciones/mundo_<id>.txt` o `imagenes/mundo_<id>.jpg` ya existe en el disco, se lee o se omite la llamada a la red.

---

### 6. Si usaste IA: ¿qué fue lo más difícil de pedirle y qué parte tuviste que corregir tú?
Lo más difícil fue resolver los fallos de saturación en la API de NVIDIA para imágenes (error 504 Gateway Timeout por cold-start en los servidores remotos). Tuve que corregir la arquitectura pasando la generación de imágenes al servicio gratuito y directo de Pollinations.ai (que entrega los bytes limpios mediante `arrayBuffer`), limpiar el formato del archivo `.env` y asegurar la idempotencia del hash.

